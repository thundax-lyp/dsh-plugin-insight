# dsh-wsl-vllm

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[69deae2](https://github.com/173787247/dsh-wsl-vllm/tree/69deae2bce3450c198f87718439ea89c7aafc5e5)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-vllm)
<!-- END META -->

> **功能**：在 DSH 中查看 vLLM 服务可达性和模型，并调用聊天补全。

> **亮点**：[Q01](#research-q01) 给现有 vLLM 服务增加会话内工具入口，减少操作界面切换。

> **主要限制**：[Q02](#research-q02) 状态可达未覆盖生成路径，工具不传结束原因，空回复也可能成功。后端容量与超时需单独验收。

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
  - [Q01 · 已有 vLLM 服务的操作者能从会话内做什么？](#detail-section-11)
  - [Q02 · 工具能否反映服务负载、截断和生成完成？](#detail-section-12)
  - [Q03 · 怎样验收 Docker 或本机端点并退出？](#detail-section-13)
  - [Q04 · 将结束原因和有效文本单独反馈能否减少假成功？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 vLLM 服务的操作者在当前 DSH 会话里提交一个短文本任务。

直接通过同一 vLLM 接口调用，可核对原始响应字段。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 状态 | 获取可达性和模型 ID | 不做推理 |
| 聊天补全 | 提交短文本任务 | 需指定模型和可达端点，空回复仍可能显示成功 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Host 工具服务 | 必需 | 注册状态和 chat | 无法调用 |
| vLLM 兼容地址和模型 ID | 必需 | 推理 | 无暴露端口、未加载或地址不通时失败 |
| Bearer | 服务要求时 | 通过鉴权 | 服务拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核对测试端点与模型 | Host 可达且归属明确 |
| 验收 | 用户查模型并发送短提示 | 确认有效文本及任务结果 |
| 退出 | 用户停用插件并直接请求 | 现有服务仍可使用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | GPU 与服务开销未知 | 确认端口、模型和凭据 | 依赖已有部署 |
| 持续 | 推理成本和排队时间未知 | 核对输出模型及完成度 | 等待非流式回复 |
| 失败 | 重试资源未知 | 查服务端日志 | 客户端退出未确认服务停止 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话内推理 | 工具接线到标准端点 | 真实操作节时 |
| 状态 | 模型 ID 及可达性 | 模型实际可推理与服务容量 |

> **思考**：[Q02](#research-q02) 状态可达未覆盖生成路径，工具不传结束原因，空回复也可能成功。后端容量与超时需单独验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 给现有 vLLM 服务增加会话内工具入口，减少操作界面切换。

[Q02](#research-q02) 调用协议封装简洁，工具文本缺少结束原因和使用量，适合关注一次短生成。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 状态可达未覆盖生成路径，工具不传结束原因，空回复也可能成功。后端容量与超时需单独验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 使用独立测试 profile 对比直接请求，核对模型和非空回复。无法确定端点归属时停止发送。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持工具接线与结果投影。实际 vLLM 模型、容器网络、吞吐和结果反馈价值尚未验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对固定仓库的 Host 工具和 HTTP 封装。未执行模型、宿主、Docker 或目标测试。
- 下一步：在固定 vLLM 版本验证端口、Bearer、空 choices、长提示、超时与资源回收。

**分析版本**

- **仓库**：[173787247/dsh-wsl-vllm](https://github.com/173787247/dsh-wsl-vllm)
- **版本号**：0.1.0（[固定提交 69deae2](https://github.com/173787247/dsh-wsl-vllm/tree/69deae2bce3450c198f87718439ea89c7aafc5e5)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 把结束原因、空回复和实际模型一并投影，以相同响应样本检查诊断和重试行为。

在固定 vLLM 版本验证端口、Bearer、空 choices、长提示、超时与资源回收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 109 | — | — | 451 |
| .js | source | 2 | 166 | 155 | 3 | — |
| .js | test | 1 | 16 | 15 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-vllm/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已运行 vLLM 的用户能否在 DSH 向选定后端做一次生成，并辨别容量和失败边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 已有 vLLM 服务的操作者能从会话内做什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

服务已运行且能从 DSH Host 访问时，操作者可在会话内查看服务列出的模型，并向指定模型提交一次文本生成。直接 HTTP 已能完成相同任务，额外价值是无需切到外部调用客户端。注册只有状态与 chat 工具，主会话模型没有因此切换。工具也不创建 Docker 容器、不调度 GPU，调用结果质量仍由同一后端决定。合格结果至少需核对实际模型、有效文本和任务标准。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-15](https://github.com/173787247/dsh-wsl-vllm/blob/69deae2bce3450c198f87718439ea89c7aafc5e5/README.md#L5-L15)

作者定位为连接本机或 Docker 服务。

<details>
<summary>查看原文（11行）</summary>

````text
对接本机/Docker vLLM 的 OpenAI 兼容服务（默认 :8000）。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-vllm
````

</details>

**依据 2 · 源码核查**：[index.js:6-24](https://github.com/173787247/dsh-wsl-vllm/blob/69deae2bce3450c198f87718439ea89c7aafc5e5/index.js#L6-L24)

配置对象与工具提示接线。

<details>
<summary>查看原文（19行）</summary>

```text
export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-vllm] disabled");
    return;
  }
  const client = createVllmClient({
    baseUrl: config.baseUrl || undefined,
    defaultModel: config.defaultModel || process.env.DSH_VLLM_MODEL || "",
    apiKey: config.apiKey || "",
    timeoutMs: positive(config.timeoutMs, 120_000),
    maxPromptChars: positive(config.maxPromptChars, 32_000),
  });
  console.log(`[dsh-wsl-vllm] base=${client.root}`);

  ctx.systemPrompt.section({
    name: "tool:vllm",
    order: 128,
    text: "dsh-wsl-vllm talks to a local/Docker vLLM OpenAI-compatible server (default http://127.0.0.1:8000). Use vllm_status before vllm_chat. Prefer for high-throughput local serving; do not assume Windows-native vLLM.",
  });
```

</details>

**依据 3 · 源码核查**：[index.js:28-64](https://github.com/173787247/dsh-wsl-vllm/blob/69deae2bce3450c198f87718439ea89c7aafc5e5/index.js#L28-L64)

注册两个工具，调用既有后端。

<details>
<summary>查看原文（37行）</summary>

```text
  ctx.tools.register({
    name: "vllm_status",
    description: "Check whether vLLM OpenAI endpoint is reachable; list model ids.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 15_000,
    isConcurrencySafe: () => true,
    async execute() {
      return client.status();
    },
    presentCall: () => ({ card: "generic", title: "vLLM status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "vLLM status", content: r.content }),
  });

  ctx.tools.register({
    name: "vllm_chat",
    description: "Chat completion via vLLM /v1/chat/completions.",
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
```

</details>

#### 缺口

- 未比较真实团队使用与直接请求
  **影响**：无法确认会话内入口改善多少操作
  **进一步探讨**：对同一服务、请求和验收条件记录完成时间及误选模型

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具能否反映服务负载、截断和生成完成？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

状态只请求 /v1/models，失败通过 reachable=false 表达，ok=true 仅代表工具构造了状态。生成请求为非流式，单次提交指定或默认模型。模型 ID 不从 status 自动选择。用户 prompt 按字符截断，system 不受同一上限，服务端 tokenizer 决定最终上下文。max_tokens 夹在 1 到 8192。工具只公开 prompt、system 等字段，库内部 messages 分支不在 tool schema。返回首个 choice 的 message.content 和 usage，缺 choice 时会得空文本且 ok=true，也没有传出 finish_reason，工具文本只显示正文。并发安全标记不代表后端具备并发容量，源码没有 vLLM 队列、GPU 指标、背压或服务端取消确认。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:42-67](https://github.com/173787247/dsh-wsl-vllm/blob/69deae2bce3450c198f87718439ea89c7aafc5e5/index.js#L42-L67)

schema 与文本渲染。

<details>
<summary>查看原文（26行）</summary>

```text
  ctx.tools.register({
    name: "vllm_chat",
    description: "Chat completion via vLLM /v1/chat/completions.",
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
      }
    },
```

</details>

**依据 2 · 源码核查**：[lib/client.js:14-38](https://github.com/173787247/dsh-wsl-vllm/blob/69deae2bce3450c198f87718439ea89c7aafc5e5/lib/client.js#L14-L38)

请求、客户端取消和错误。

<details>
<summary>查看原文（25行）</summary>

```text
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
        throw new Error(`vllm non-JSON ${res.status}: ${text.slice(0, 200)}`);
      }
      if (!res.ok) throw new Error(`vllm HTTP ${res.status}: ${json?.error?.message || json?.error || text.slice(0, 200)}`);
      return json;
    } finally {
      clearTimeout(t);
    }
```

</details>

**依据 3 · 源码核查**：[lib/client.js:45-60](https://github.com/173787247/dsh-wsl-vllm/blob/69deae2bce3450c198f87718439ea89c7aafc5e5/lib/client.js#L45-L60)

模型列表与可达性。

<details>
<summary>查看原文（16行）</summary>

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
    },
```

</details>

**依据 4 · 源码核查**：[lib/client.js:61-87](https://github.com/173787247/dsh-wsl-vllm/blob/69deae2bce3450c198f87718439ea89c7aafc5e5/lib/client.js#L61-L87)

模型选择、输入裁剪、输出和上限。

<details>
<summary>查看原文（27行）</summary>

```text
    async chat({ model, prompt, system, messages, maxTokens = 1024 }) {
      const m = String(model || defaultModel || "").trim();
      if (!m) throw new Error("vllm_chat: model required");
      let msgs = Array.isArray(messages)
        ? messages.map((x) => ({ role: x.role, content: String(x.content || "") }))
        : [];
      if (!msgs.length) {
        const p = String(prompt || "").trim();
        if (!p) throw new Error("vllm_chat: prompt or messages required");
        if (system) msgs.push({ role: "system", content: String(system) });
        msgs.push({ role: "user", content: p.slice(0, maxPromptChars) });
      }
      const json = await request("/v1/chat/completions", {
        method: "POST",
        body: {
          model: m,
          messages: msgs,
          max_tokens: Math.min(8192, Math.max(1, Number(maxTokens) || 1024)),
          stream: false,
        },
      });
      return {
        ok: true,
        model: json.model || m,
        message: json.choices?.[0]?.message?.content || "",
        usage: json.usage || null,
      };
```

</details>

#### 缺口

- 没有真实服务的 token 上限、容量和错误样本
  **影响**：无法确定并发负载、退出原因及服务端取消
  **进一步探讨**：以测试服务核对 token 溢出、排队、空 choices 和超时

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样验收 Docker 或本机端点并退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

使用测试 profile 配置 Host 可达地址和已知模型 ID，若服务要求鉴权则提供 Bearer。默认 :8000 只是 DSH Host 的回环目标，容器未暴露端口或绑定不同网络时不会自动可达。文本与可选 Bearer 会被送到配置端点，先核实端点归属。状态探测后以无敏感短提示验证有效文本，再用直接请求对照一项错误和一次慢调用。状态外层 15 秒，通用请求默认 120 秒且不接收外层取消信号，需单独验证在宿主超时后的服务资源。若返回为空、模型不对或容量不可接受，停用插件后回到原调用入口。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-15](https://github.com/173787247/dsh-wsl-vllm/blob/69deae2bce3450c198f87718439ea89c7aafc5e5/README.md#L5-L15)

连接服务与 profile 安装入口。

<details>
<summary>查看原文（11行）</summary>

````text
对接本机/Docker vLLM 的 OpenAI 兼容服务（默认 :8000）。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-vllm
````

</details>

**依据 2 · 源码核查**：[index.js:6-19](https://github.com/173787247/dsh-wsl-vllm/blob/69deae2bce3450c198f87718439ea89c7aafc5e5/index.js#L6-L19)

禁用、地址、模型和超时。

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-vllm] disabled");
    return;
  }
  const client = createVllmClient({
    baseUrl: config.baseUrl || undefined,
    defaultModel: config.defaultModel || process.env.DSH_VLLM_MODEL || "",
    apiKey: config.apiKey || "",
    timeoutMs: positive(config.timeoutMs, 120_000),
    maxPromptChars: positive(config.maxPromptChars, 32_000),
  });
  console.log(`[dsh-wsl-vllm] base=${client.root}`);

```

</details>

**依据 3 · 源码核查**：[index.js:28-38](https://github.com/173787247/dsh-wsl-vllm/blob/69deae2bce3450c198f87718439ea89c7aafc5e5/index.js#L28-L38)

外层状态超时。

<details>
<summary>查看原文（11行）</summary>

```text
  ctx.tools.register({
    name: "vllm_status",
    description: "Check whether vLLM OpenAI endpoint is reachable; list model ids.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 15_000,
    isConcurrencySafe: () => true,
    async execute() {
      return client.status();
    },
    presentCall: () => ({ card: "generic", title: "vLLM status" }),
```

</details>

**依据 4 · 源码核查**：[lib/client.js:11-34](https://github.com/173787247/dsh-wsl-vllm/blob/69deae2bce3450c198f87718439ea89c7aafc5e5/lib/client.js#L11-L34)

端点、Bearer 和请求处理。

<details>
<summary>查看原文（24行）</summary>

```text
  const root = String(baseUrl || process.env.DSH_VLLM_BASE || "http://127.0.0.1:8000").replace(/\/$/, "");
  const key = String(apiKey || process.env.DSH_VLLM_API_KEY || "").trim();

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
        throw new Error(`vllm non-JSON ${res.status}: ${text.slice(0, 200)}`);
      }
      if (!res.ok) throw new Error(`vllm HTTP ${res.status}: ${json?.error?.message || json?.error || text.slice(0, 200)}`);
```

</details>

#### 缺口

- 未测 Docker 网络和服务端负载
  **影响**：无法估算等待、端口配置与错误恢复成本
  **进一步探讨**：固定测试端点分别验证拒绝、慢响应、服务无模型和停用

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 将结束原因和有效文本单独反馈能否减少假成功？

**研究主题**：新假设与验证

#### 完整回答

当前封装已提取 usage，但工具文本只投影 message，缺少结束原因。可对照一种同时提示模型、无文本、因长度截断或 HTTP 拒绝的结果，帮助操作者判断应缩短提示、降低输出预算还是直接排障。固定模型，以正常结束、达到 max_tokens、缺 choices 和超时的响应组合测正确诊断率、重试次数和阅读负担。若提示未减少无谓重试，或使正确结果更难判断，放弃变更。此方案尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:54-66](https://github.com/173787247/dsh-wsl-vllm/blob/69deae2bce3450c198f87718439ea89c7aafc5e5/index.js#L54-L66)

模型可见文本仅生成正文或错误。

<details>
<summary>查看原文（13行）</summary>

```text
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
      }
```

</details>

**依据 2 · 源码核查**：[lib/client.js:73-87](https://github.com/173787247/dsh-wsl-vllm/blob/69deae2bce3450c198f87718439ea89c7aafc5e5/lib/client.js#L73-L87)

结构化响应尚不传结束原因。

<details>
<summary>查看原文（15行）</summary>

```text
      const json = await request("/v1/chat/completions", {
        method: "POST",
        body: {
          model: m,
          messages: msgs,
          max_tokens: Math.min(8192, Math.max(1, Number(maxTokens) || 1024)),
          stream: false,
        },
      });
      return {
        ok: true,
        model: json.model || m,
        message: json.choices?.[0]?.message?.content || "",
        usage: json.usage || null,
      };
```

</details>

#### 缺口

- 缺少带结束原因的用户或模型对照
  **影响**：不知道信息增量能否改变重试决策
  **进一步探讨**：用相同响应样本对比两种工具输出

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
