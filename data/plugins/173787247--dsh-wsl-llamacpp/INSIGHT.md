# dsh-wsl-llamacpp

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[b421d27](https://github.com/173787247/dsh-wsl-llamacpp/tree/b421d27e5fa772375669557a85f1e3cae15f21d7)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-llamacpp)
<!-- END META -->

> **功能**：在 DSH 中探测 llama.cpp 兼容服务并请求单次聊天生成。

> **亮点**：[Q01](#research-q01) 在 DSH 会话里调用已有服务的两个接口，减少请求准备与终端切换。

> **主要限制**：[Q02](#research-q02) 模型列表可达和 HTTP 成功都不足以证明有效推理。调用方要核对模型、返回文本和实际上下文。

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
  - [Q01 · 在什么场景下值得从 DSH 调用现有 GGUF 服务？](#detail-section-11)
  - [Q02 · 模型调用、参数限制与结果状态怎样落地？](#detail-section-12)
  - [Q03 · 试用需要什么，失败如何退回原有入口？](#detail-section-13)
  - [Q04 · 区分列表可达与模型可生成会减少误判吗？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有兼容服务的 WSL 开发者想从当前会话发送一次短文本生成任务。

直接调用现有兼容 HTTP 接口，可使用同一服务和模型。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 服务状态 | 列出可见模型 ID | reachable 不能证明生成可用 |
| 聊天生成 | 向指定模型发送提示 | 需模型与可达服务，返回可能为空 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 工具服务 | 必需 | 挂载状态和 chat 工具 | 无法注册调用 |
| 可达的兼容服务及模型 ID | 必需 | 提供状态和生成 | 列表可达仍需确认模型推理 |
| Bearer 凭据 | 服务要求时 | 授权请求 | 服务拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户确认现有服务地址和模型 | 从 Host 可达，端点归属明确 |
| 调用 | 用户先列模型，再提交无敏感短提示 | 目标模型返回可核对的非空文本 |
| 退出 | 用户停用工具，改直接调用 | 保留现有服务配置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 模型和服务资源未知 | 配置端点、模型和认证 | 已部署服务可复用 |
| 持续 | 推理资源与等待未知 | 确认有效文本 | 输出为非流式 |
| 失败 | 排障资源未知 | 检查直接请求与服务日志 | 需区分超时、错误和空回复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话内生成 | 工具封装两项 HTTP 请求 | 真实用户节时 |
| 兼容服务复用 | 可配置地址、模型与认证 | llama.cpp 和 Unsloth 版本兼容矩阵 |

> **思考**：[Q02](#research-q02) 模型列表可达和 HTTP 成功都不足以证明有效推理。调用方要核对模型、返回文本和实际上下文。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 在 DSH 会话里调用已有服务的两个接口，减少请求准备与终端切换。

[Q02](#research-q02) 请求层统一处理 HTTP 和 JSON 错误，成功结果仍需验证文本及模型状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 模型列表可达和 HTTP 成功都不足以证明有效推理。调用方要核对模型、返回文本和实际上下文。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用测试 profile 验证列表及一个已知可用模型的非空输出。失败后以直接请求对照。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认 Host 工具及 HTTP 协议调用，实际服务兼容性、任务结果与探针价值未验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定包的工具注册和 HTTP 客户端。未执行目标代码、模型、WSL、宿主和测试。
- 下一步：在固定服务及模型对照直接请求，覆盖无模型、非 JSON、空 choices、慢响应和停用。

**分析版本**

- **仓库**：[173787247/dsh-wsl-llamacpp](https://github.com/173787247/dsh-wsl-llamacpp)
- **版本号**：0.1.0（[固定提交 b421d27](https://github.com/173787247/dsh-wsl-llamacpp/tree/b421d27e5fa772375669557a85f1e3cae15f21d7)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 在用户请求时增加指定模型的短探针，并对照误判率和额外负载。

在固定服务及模型对照直接请求，覆盖无模型、非 JSON、空 choices、慢响应和停用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 109 | — | — | 460 |
| .js | source | 2 | 169 | 158 | 4 | — |
| .js | test | 1 | 17 | 16 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-llamacpp/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已部署兼容服务的 WSL 用户能否在 DSH 会话里把一次小任务交给现有 GGUF 模型？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 在什么场景下值得从 DSH 调用现有 GGUF 服务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有 llama.cpp 兼容服务的用户，可在 DSH 会话中对选中的文本做一次摘要或重写，无需另开终端拼 HTTP 请求。插件实际向模型注册状态与 chat 两个工具，通过注入的工具服务使用，DSH 的主模型配置不会因为这个 apply 被替换。使用者仍要选择可用模型，合格结果是指定后端返回有效文本且任务检查通过。直接用 HTTP 客户端已经可达同一后端，插件增加会话内入口及结构化参数，未提供部署和管理模型服务的机制。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-10](https://github.com/173787247/dsh-wsl-llamacpp/blob/b421d27e5fa772375669557a85f1e3cae15f21d7/README.md#L5-L10)

项目声明支持已部署的 llama.cpp 和 Unsloth 兼容服务。

```text
对接本机 llama.cpp / Unsloth Desktop 的 OpenAI 兼容接口（默认 :8080）。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |
```

**依据 2 · 作者声明**：[README.md:22-33](https://github.com/173787247/dsh-wsl-llamacpp/blob/b421d27e5fa772375669557a85f1e3cae15f21d7/README.md#L22-L33)

两项工具及复用现有服务的范围。

<details>
<summary>查看原文（12行）</summary>

```text
## 工具

| 工具 | 作用 |
|------|------|
| `llama_status` | 是否可达、模型 id |
| `llama_chat` | /v1/chat/completions |

## 配置要点

`baseUrl / defaultModel / timeoutMs`

复用已有 GGUF，不重装工具链。环境变量：`DSH_LLAMA_BASE`、`DSH_LLAMA_MODEL`。
```

</details>

**依据 3 · 源码核查**：[index.js:3-25](https://github.com/173787247/dsh-wsl-llamacpp/blob/b421d27e5fa772375669557a85f1e3cae15f21d7/index.js#L3-L25)

注入的服务和配置，未配置模型供应商。

<details>
<summary>查看原文（23行）</summary>

```text
export const name = "dsh-wsl-llamacpp";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-llamacpp] disabled");
    return;
  }
  const client = createOpenAiCompatClient({
    baseUrl: config.baseUrl || process.env.DSH_LLAMA_BASE || "http://127.0.0.1:8080",
    defaultModel: config.defaultModel || process.env.DSH_LLAMA_MODEL || "",
    apiKey: config.apiKey || "",
    timeoutMs: positive(config.timeoutMs, 120_000),
    maxPromptChars: positive(config.maxPromptChars, 32_000),
    label: "llamacpp",
  });
  console.log(`[dsh-wsl-llamacpp] base=${client.root}`);

  ctx.systemPrompt.section({
    name: "tool:llamacpp",
    order: 128,
    text: "dsh-wsl-llamacpp talks to a local llama.cpp (or Unsloth Desktop) OpenAI-compatible server. Default http://127.0.0.1:8080. Use llama_status before llama_chat. Do not reinstall toolchains — reuse existing GGUF servers.",
  });
```

</details>

**依据 4 · 源码核查**：[index.js:29-64](https://github.com/173787247/dsh-wsl-llamacpp/blob/b421d27e5fa772375669557a85f1e3cae15f21d7/index.js#L29-L64)

状态和生成由实际注册工具接入。

<details>
<summary>查看原文（36行）</summary>

```text
  ctx.tools.register({
    name: "llama_status",
    description: "Check llama.cpp / Unsloth OpenAI-compatible server reachability and model ids.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 15_000,
    isConcurrencySafe: () => true,
    async execute() {
      return client.status();
    },
    presentCall: () => ({ card: "generic", title: "llama.cpp status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "llama.cpp status", content: r.content }),
  });

  ctx.tools.register({
    name: "llama_chat",
    description: "Chat completion via local llama.cpp-compatible /v1/chat/completions.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        model: { type: "string" },
        prompt: { type: "string" },
        system: { type: "string" },
        maxTokens: { type: "number" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : String(v.message || "") }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await client.chat(args || {});
```

</details>

#### 缺口

- 没有现成任务的时间与答案对照
  **影响**：无法判断工具切换价值是否超过直接请求
  **进一步探讨**：对同一后端及提示比较 DSH 工具和直接请求的步骤与合格率

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型调用、参数限制与结果状态怎样落地？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

status 用 GET /v1/models 取 id，失败返回 ok=true、reachable=false，判断需读 reachable。chat 要求显式 model 或默认值，不使用状态探测结果自动选模型。工具只开放 prompt、system、model、maxTokens，库内部虽支持 messages 数组，注册 schema 并未开放它。prompt 经 trim 后截断到配置的字符数，system 不经同一裁剪，字符上限也不能保证符合实际模型 token 窗口。请求带可选 Bearer，固定 stream=false，输出 token 数夹在 1 至 4096。HTTP 非成功、非 JSON 和超时均可产生错误，但正常 JSON 如果没有 choices[0].message.content，仍返回 ok=true 和空文本。请求超时终止客户端等待，源码未确认服务端推理停止。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:43-66](https://github.com/173787247/dsh-wsl-llamacpp/blob/b421d27e5fa772375669557a85f1e3cae15f21d7/index.js#L43-L66)

实际工具输入与错误渲染。

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.tools.register({
    name: "llama_chat",
    description: "Chat completion via local llama.cpp-compatible /v1/chat/completions.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        model: { type: "string" },
        prompt: { type: "string" },
        system: { type: "string" },
        maxTokens: { type: "number" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : String(v.message || "") }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await client.chat(args || {});
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
```

</details>

**依据 2 · 源码核查**：[lib/client.js:12-39](https://github.com/173787247/dsh-wsl-llamacpp/blob/b421d27e5fa772375669557a85f1e3cae15f21d7/lib/client.js#L12-L39)

请求头、超时与响应错误。

<details>
<summary>查看原文（28行）</summary>

```text
  const root = String(baseUrl || "http://127.0.0.1:8080").replace(/\/$/, "");
  const key = String(apiKey || process.env.DSH_LLAMA_API_KEY || "").trim();

  async function request(path, { method = "GET", body } = {}) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const headers = {};
      if (body) headers["Content-Type"] = "application/json";
      if (key) headers.Authorization = `Bearer ${key}`;
      const res = await fetchImpl(`${root}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: ctrl.signal,
      });
      const text = await res.text();
      let json;
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`${label} non-JSON ${res.status}: ${text.slice(0, 200)}`);
      }
      if (!res.ok) throw new Error(`${label} HTTP ${res.status}: ${json?.error?.message || json?.error || text.slice(0, 200)}`);
      return json;
    } finally {
      clearTimeout(t);
    }
```

</details>

**依据 3 · 源码核查**：[lib/client.js:46-60](https://github.com/173787247/dsh-wsl-llamacpp/blob/b421d27e5fa772375669557a85f1e3cae15f21d7/lib/client.js#L46-L60)

列表探测和 unreachable 返回。

<details>
<summary>查看原文（15行）</summary>

```text
    async status() {
      try {
        const models = await request("/v1/models");
        const ids = (models.data || []).map((m) => m.id);
        return { ok: true, baseUrl: root, reachable: true, models: ids, defaultModel: defaultModel || null };
      } catch (e) {
        return {
          ok: true,
          baseUrl: root,
          reachable: false,
          error: e instanceof Error ? e.message : String(e),
          models: [],
          defaultModel: defaultModel || null,
        };
      }
```

</details>

**依据 4 · 源码核查**：[lib/client.js:62-89](https://github.com/173787247/dsh-wsl-llamacpp/blob/b421d27e5fa772375669557a85f1e3cae15f21d7/lib/client.js#L62-L89)

模型、消息裁剪、非流式请求和空内容。

<details>
<summary>查看原文（28行）</summary>

```text
    async chat({ model, prompt, system, messages, maxTokens = 1024 }) {
      const m = String(model || defaultModel || "").trim();
      if (!m) throw new Error(`${label}: model required (or set defaultModel)`);
      let msgs = Array.isArray(messages)
        ? messages.map((x) => ({ role: x.role, content: String(x.content || "") }))
        : [];
      if (!msgs.length) {
        const p = String(prompt || "").trim();
        if (!p) throw new Error(`${label}: prompt or messages required`);
        if (system) msgs.push({ role: "system", content: String(system) });
        msgs.push({ role: "user", content: p.slice(0, maxPromptChars) });
      }
      const json = await request("/v1/chat/completions", {
        method: "POST",
        body: {
          model: m,
          messages: msgs,
          max_tokens: Math.min(4096, Math.max(1, Number(maxTokens) || 1024)),
          stream: false,
        },
      });
      const content = json.choices?.[0]?.message?.content || "";
      return {
        ok: true,
        model: json.model || m,
        message: content,
        usage: json.usage || null,
      };
```

</details>

#### 缺口

- 不同服务端的 chat template、错误和取消行为未运行
  **影响**：兼容 API 声明不足以判断模型结果或资源释放
  **进一步探讨**：对明确模型调用短长输入，注入缺 choices 和超时响应，检查有效文本及服务端任务

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 试用需要什么，失败如何退回原有入口？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

准备一个已启用并可从 DSH Host 访问的兼容服务，在 profile 中指向确切地址和模型 ID。默认回环地址指 DSH 所在网络，若 WSL 与 Windows 服务不共用回环，需要单独确认实际路由与认证。状态工具外层限 15 秒，但通用 HTTP 请求用客户端配置的 timeoutMs，默认 120 秒，内部没有接收宿主取消信号。先用无敏感内容的短请求核对服务端返回、最终文本及耗时，再比较原有入口。URL 可配置，任何 prompt/system 内容都会发送到该地址，需先确认端点归属。若状态可达但请求失败或返回空值，应按服务端日志和直接请求定位，避免认为已完成任务。停用插件可退回原请求方式，加载分支没有安装或卸载模型。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:6-19](https://github.com/173787247/dsh-wsl-llamacpp/blob/b421d27e5fa772375669557a85f1e3cae15f21d7/index.js#L6-L19)

加载配置与禁用分支。

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-llamacpp] disabled");
    return;
  }
  const client = createOpenAiCompatClient({
    baseUrl: config.baseUrl || process.env.DSH_LLAMA_BASE || "http://127.0.0.1:8080",
    defaultModel: config.defaultModel || process.env.DSH_LLAMA_MODEL || "",
    apiKey: config.apiKey || "",
    timeoutMs: positive(config.timeoutMs, 120_000),
    maxPromptChars: positive(config.maxPromptChars, 32_000),
    label: "llamacpp",
  });
  console.log(`[dsh-wsl-llamacpp] base=${client.root}`);
```

</details>

**依据 2 · 源码核查**：[index.js:29-38](https://github.com/173787247/dsh-wsl-llamacpp/blob/b421d27e5fa772375669557a85f1e3cae15f21d7/index.js#L29-L38)

外层状态超时。

<details>
<summary>查看原文（10行）</summary>

```text
  ctx.tools.register({
    name: "llama_status",
    description: "Check llama.cpp / Unsloth OpenAI-compatible server reachability and model ids.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 15_000,
    isConcurrencySafe: () => true,
    async execute() {
      return client.status();
    },
```

</details>

**依据 3 · 源码核查**：[lib/client.js:12-28](https://github.com/173787247/dsh-wsl-llamacpp/blob/b421d27e5fa772375669557a85f1e3cae15f21d7/lib/client.js#L12-L28)

可配置端点和请求信号。

<details>
<summary>查看原文（17行）</summary>

```text
  const root = String(baseUrl || "http://127.0.0.1:8080").replace(/\/$/, "");
  const key = String(apiKey || process.env.DSH_LLAMA_API_KEY || "").trim();

  async function request(path, { method = "GET", body } = {}) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const headers = {};
      if (body) headers["Content-Type"] = "application/json";
      if (key) headers.Authorization = `Bearer ${key}`;
      const res = await fetchImpl(`${root}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: ctrl.signal,
      });
      const text = await res.text();
```

</details>

**依据 4 · 源码核查**：[lib/client.js:74-89](https://github.com/173787247/dsh-wsl-llamacpp/blob/b421d27e5fa772375669557a85f1e3cae15f21d7/lib/client.js#L74-L89)

文本进入请求，空内容边界。

<details>
<summary>查看原文（16行）</summary>

```text
      const json = await request("/v1/chat/completions", {
        method: "POST",
        body: {
          model: m,
          messages: msgs,
          max_tokens: Math.min(4096, Math.max(1, Number(maxTokens) || 1024)),
          stream: false,
        },
      });
      const content = json.choices?.[0]?.message?.content || "";
      return {
        ok: true,
        model: json.model || m,
        message: content,
        usage: json.usage || null,
      };
```

</details>

**依据 5 · 作者声明**：[README.md:12-18](https://github.com/173787247/dsh-wsl-llamacpp/blob/b421d27e5fa772375669557a85f1e3cae15f21d7/README.md#L12-L18)

作者提供 profile 安装方法。

````text
## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-llamacpp
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-llamacpp
```
````

#### 缺口

- WSL 网络路径、认证和实际推理开销未测
  **影响**：无法估算首次配置和持续等待的总成本
  **进一步探讨**：比较本机与跨 Windows 端点，记录模型列表、首个有效文本和超时清理

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 区分列表可达与模型可生成会减少误判吗？

**研究主题**：新假设与验证

#### 完整回答

当前状态仅 GET 模型列表，列表可用时不能排除模型未加载、chat 模板错误或结果为空。可以评估在用户显式请求时为指定模型执行一次最短的探针，并独立标记可达、可推理、返回空值和错误。使用相同服务模拟列表正常但 chat 拒绝、慢启动、空 choices 与有效响应，比较现有状态和分阶段检查的误判率、等待时长和服务额外负载。若检测改善不足以覆盖探针开销，或探针导致并发负载问题，则拒绝。该探针为未验证建议。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:46-60](https://github.com/173787247/dsh-wsl-llamacpp/blob/b421d27e5fa772375669557a85f1e3cae15f21d7/lib/client.js#L46-L60)

现有状态不执行推理。

<details>
<summary>查看原文（15行）</summary>

```text
    async status() {
      try {
        const models = await request("/v1/models");
        const ids = (models.data || []).map((m) => m.id);
        return { ok: true, baseUrl: root, reachable: true, models: ids, defaultModel: defaultModel || null };
      } catch (e) {
        return {
          ok: true,
          baseUrl: root,
          reachable: false,
          error: e instanceof Error ? e.message : String(e),
          models: [],
          defaultModel: defaultModel || null,
        };
      }
```

</details>

**依据 2 · 源码核查**：[lib/client.js:74-89](https://github.com/173787247/dsh-wsl-llamacpp/blob/b421d27e5fa772375669557a85f1e3cae15f21d7/lib/client.js#L74-L89)

执行及可能的空文本。

<details>
<summary>查看原文（16行）</summary>

```text
      const json = await request("/v1/chat/completions", {
        method: "POST",
        body: {
          model: m,
          messages: msgs,
          max_tokens: Math.min(4096, Math.max(1, Number(maxTokens) || 1024)),
          stream: false,
        },
      });
      const content = json.choices?.[0]?.message?.content || "";
      return {
        ok: true,
        model: json.model || m,
        message: content,
        usage: json.usage || null,
      };
```

</details>

#### 缺口

- 没有模型可用性探针的对照
  **影响**：收益和额外推理负担未知
  **进一步探讨**：在测试服务中比较故障判断、探针耗时和占用

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
