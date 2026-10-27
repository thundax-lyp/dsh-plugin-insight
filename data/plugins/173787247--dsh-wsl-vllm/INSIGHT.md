# dsh-wsl-vllm

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[e42e1dc](https://github.com/173787247/dsh-wsl-vllm/tree/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-vllm)
<!-- END META -->

> **实现功能**：把已有本机/Docker vLLM OpenAI 兼容端点接入 DSH Agent 的状态与聊天工具。

> **核心亮点**：为现有 vLLM 提供轻量按需工具，包含状态探测和补全返回 usage。详见[Q01](#research-q01)。

> **风险与缺陷**：总输入不受 maxPromptChars 保证，reachable:false 仍 ok:true；服务资源和取消语义未知。详见[Q03](#research-q03)与[Q04](#research-q04)。

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
  - [Q01 · 这是 DSH 模型后端还是调用本机 vLLM 的工具？](#detail-section-11)
  - [Q02 · 端点、认证、超时和消息体如何构造？](#detail-section-12)
  - [Q03 · 提示长度限制是否覆盖所有发送给本地模型的内容？](#detail-section-13)
  - [Q04 · 可达性结果和工具超时会不会被误读？](#detail-section-14)
  - [Q05 · 怎样试用且避免把本地服务安全和成本混为插件能力？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 vLLM 的 WSL 开发者让 Agent 按需查询模型并调用本地聊天补全。详见[Q01](#research-q01)。

直接请求 vLLM HTTP 端点已可推理；插件只把端点暴露为 DSH Agent 工具。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 状态工具 | 探测模型 | ok:true 仍可能离线 |
| 聊天工具 | 非流式补全 | 不替换主模型 |
| prompt 截断 | 控单条 user 输入 | system/messages 不限 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH tools/systemPrompt | 必需 | 工具注册 | Agent 无入口 |
| vLLM OpenAI 端点 | 必需 | 模型列表/补全 | reachable:false/聊天失败 |
| GPU/模型/容器网络 | 环境必需 | 推理服务 | 插件不能代替 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 准备 | 启本地/Docker vLLM | /v1/models 可查 |
| 安装 | web profile 加可选包/配 baseUrl | 工具可见 |
| 检查 | 调 vllm_status | 看 reachable 与 models |
| 试聊 | 调 vllm_chat 短 prompt | 比对 message/usage |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 部署 | 自备 vLLM/GPU/模型，金额未知 | Docker/WSL 部署 | 插件不提供推理 |
| 调用 | 默认120秒与最多8192输出 token | 选模型/查状态 | 吞吐/显存未知 |
| 管控 | 本机或自定义地址/API key | 限网络与输入 | 取消/上下文边界未知 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 服务探测 | /v1/models 列表 | 真实可达性 |
| 聊天工具 | 非流式补全/usage | 模型质量与吞吐 |
| 输入控制 | prompt 截断/输出上限 | 总输入上限 |

> **思考**：总输入不受 maxPromptChars 保证，reachable:false 仍 ok:true；服务资源和取消语义未知。详见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：为现有 vLLM 提供轻量按需工具，包含状态探测和补全返回 usage。详见[Q01](#research-q01)。

为现有 vLLM 提供轻量按需工具，包含状态探测和补全返回 usage。详见[Q01](#research-q01)。

OpenAI 兼容端点包装简单；组合输入长度与宿主取消应补。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

总输入不受 maxPromptChars 保证，reachable:false 仍 ok:true；服务资源和取消语义未知。详见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅已有可信 vLLM 的环境小范围试用；先核 reachable、模型 id、输入上限及取消时序。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码可核工具/API 调用；未注册主模型 provider。maxPromptChars 只限制 prompt，不限 system/messages；status 工具/底层超时不一致。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh.md、index.js、lib/client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.md、index.js、lib/client.js、package.json；未运行插件、vLLM 或目标宿主；旧 META 仅复用。
- 下一步：目标 WSL/Docker 测模型列表/聊天/离线、长 system/messages、host 15秒超时、取消、GPU资源与网络权限。

**分析版本**

- **仓库**：[173787247/dsh-wsl-vllm](https://github.com/173787247/dsh-wsl-vllm)
- **版本号**：0.1.0（[固定提交 e42e1dc](https://github.com/173787247/dsh-wsl-vllm/tree/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进为组合消息总上限、宿主取消信号传递和状态超时一致化。详见[Q05](#research-q05)。

目标 WSL/Docker 测模型列表/聊天/离线、长 system/messages、host 15秒超时、取消、GPU资源与网络权限。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 109 | — | — | 451 |
| .js | source | 2 | 166 | 155 | 3 | — |
| .js | test | 1 | 16 | 15 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-vllm/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：vLLM 工具能否可靠访问已部署服务，并正确约束输入和取消？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这是 DSH 模型后端还是调用本机 vLLM 的工具？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件注册 vllm_status 和 vllm_chat 两个 DSH Agent 工具，用于查询本机/Docker OpenAI 兼容 vLLM 的模型列表并发起一次非流式聊天补全。它没有注册 DSH 主模型 provider，也没有把所有对话路由到 vLLM；只有 Agent 调用工具时才发请求。作者称套件可选、默认不随 daily 安装，目标 vLLM/GPU 是否存在未验证。适合已有 vLLM 服务且愿让 Agent按需调用的 WSL 开发者。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-33](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/README.md#L5-L33)

作者本地/Docker 与可选套件定位

<details>
<summary>查看原文（29行）</summary>

````text
对接本机/Docker vLLM 的 OpenAI 兼容服务（默认 :8000）。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-vllm
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-vllm
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## 工具

| 工具 | 作用 |
|------|------|
| `vllm_status` | 可达性与模型 |
| `vllm_chat` | 对话补全 |

## 配置要点

`baseUrl / defaultModel / timeoutMs`

Windows 原生 vLLM 一般没有；优先 Docker。`DSH_VLLM_BASE` / `DSH_VLLM_MODEL`。
````

</details>

**依据 2 · 源码核查**：[index.js:3-24](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/index.js#L3-L24)

注册 tools/systemPrompt 而非模型 provider

<details>
<summary>查看原文（22行）</summary>

```text
export const name = "dsh-wsl-vllm";
export const inject = ["tools", "systemPrompt"];

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

**依据 3 · 源码核查**：[index.js:28-70](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/index.js#L28-L70)

仅两个工具

<details>
<summary>查看原文（43行）</summary>

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
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "vLLM chat" }),
    presentResult: (_a, r) => ({ card: "generic", title: "vLLM chat", content: r.content }),
  });
```

</details>

**依据 4 · 源码核查**：[lib/client.js:61-87](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/lib/client.js#L61-L87)

聊天补全路径

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

- 目标 vLLM 端点和 DSH 工具显示未联调
  **影响**：不能宣称替换宿主主模型或提升吞吐
  **进一步探讨**：目标 DSH 调用工具并对照 vLLM 服务日志

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 端点、认证、超时和消息体如何构造？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

baseUrl 优先配置、再 DSH_VLLM_BASE、默认 http://127.0.0.1:8000；apiKey 可从配置/环境读取，Bearer 放请求头。status GET /v1/models 并返回模型 id；chat POST /v1/chat/completions，采用 model/默认模型与 system+prompt，max_tokens 在1–8192间截取，stream=false，返回首个 choice 文本及 usage。每次请求用 AbortController 超时后清 timer，错误由聊天工具转为 ok:false。服务的模型、资源和鉴权方式必须另行准备。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:6-36](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/index.js#L6-L36)

配置、状态工具

<details>
<summary>查看原文（31行）</summary>

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

  const timeoutMs = client.timeoutMs;

  ctx.tools.register({
    name: "vllm_status",
    description: "Check whether vLLM OpenAI endpoint is reachable; list model ids.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 15_000,
    isConcurrencySafe: () => true,
    async execute() {
      return client.status();
```

</details>

**依据 2 · 源码核查**：[index.js:42-70](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/index.js#L42-L70)

聊天工具参数/呈现

<details>
<summary>查看原文（29行）</summary>

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
    presentCall: () => ({ card: "generic", title: "vLLM chat" }),
    presentResult: (_a, r) => ({ card: "generic", title: "vLLM chat", content: r.content }),
  });
```

</details>

**依据 3 · 源码核查**：[lib/client.js:3-39](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/lib/client.js#L3-L39)

URL/认证/超时和 JSON 错误

<details>
<summary>查看原文（37行）</summary>

```text
export function createVllmClient({
  baseUrl,
  defaultModel = "",
  apiKey = "",
  timeoutMs = 120_000,
  maxPromptChars = 32_000,
  fetchImpl = fetch,
} = {}) {
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
      return json;
    } finally {
      clearTimeout(t);
    }
  }
```

</details>

**依据 4 · 源码核查**：[lib/client.js:41-89](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/lib/client.js#L41-L89)

status/chat 请求结构

<details>
<summary>查看原文（49行）</summary>

```text
  return {
    root,
    defaultModel,
    timeoutMs,
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
    },
  };
```

</details>

#### 缺口

- 目标 vLLM 兼容字段和宿主超时行为未测
  **影响**：源码接口不保证模型响应或性能
  **进一步探讨**：Docker/WSL vLLM /v1/models 与补全联调

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 提示长度限制是否覆盖所有发送给本地模型的内容？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

maxPromptChars 默认 32000，只在没有 messages 数组时对 user prompt 执行 slice；system 字段不截断，若内部调用 client.chat 传 messages 则逐条原样传 content，亦不受该上限约束。当前 DSH 工具 schema 只暴露 prompt/system/model/maxTokens，没有 messages，所以正常工具调用仍可能通过超长 system 绕过所谓总提示上限；内部 API 还允许不受限 messages。上下文窗口/服务拒绝及费用取决于本地模型，未实测。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:43-53](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/index.js#L43-L53)

公开工具参数缺 messages

<details>
<summary>查看原文（11行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/client.js:61-79](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/lib/client.js#L61-L79)

只截 prompt 且 system/messages 不截

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[index.js:14-17](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/index.js#L14-L17)

maxPromptChars 配置

```text
    apiKey: config.apiKey || "",
    timeoutMs: positive(config.timeoutMs, 120_000),
    maxPromptChars: positive(config.maxPromptChars, 32_000),
  });
```

#### 缺口

- 目标模型上下文长度/超长请求行为未测
  **影响**：不能把 maxPromptChars 当总输入大小保证
  **进一步探讨**：限制组合消息总字符/token 并测大 system/messages

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可达性结果和工具超时会不会被误读？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

vllm_status 捕获请求错误后仍返回 ok:true、reachable:false，用于表达“工具执行成功但服务离线”，使用者必须读 reachable，不能只看 ok。工具层 status timeoutMs 固定15秒，而底层 client.status 使用全局 timeoutMs 默认120秒；目标宿主若在15秒截断工具，底层请求是否随工具取消未知。聊天 tool 与底层同一 timeoutMs，但未把宿主取消 signal 传入 client，只依赖内部 timer。建议对齐/传递取消，实际影响待测。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:28-40](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/index.js#L28-L40)

状态工具15秒

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[index.js:42-63](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/index.js#L42-L63)

聊天工具超时

<details>
<summary>查看原文（22行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/client.js:14-39](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/lib/client.js#L14-L39)

底层独立 AbortController

<details>
<summary>查看原文（26行）</summary>

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
  }
```

</details>

**依据 4 · 源码核查**：[lib/client.js:45-59](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/lib/client.js#L45-L59)

离线仍 ok:true/ reachable:false

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

#### 缺口

- 宿主工具超时是否 abort 底层 fetch 未核
  **影响**：不能用 ok:true 判定服务可达或 15 秒内停止网络
  **进一步探讨**：目标服务挂起/离线时验证宿主与 fetch 取消

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样试用且避免把本地服务安全和成本混为插件能力？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

先在 Docker/WSL 单独启动可信 vLLM，确认 /v1/models、模型 id 与服务监听地址，再安装可选插件，调用 status 看 reachable/models，然后发短 prompt 做 chat 与 usage 对照。默认 127.0.0.1 不意味着容器可直接访问；远端 baseUrl/API key 由操作者设，源码未限制目标域名；请求使用运行时 fetch 的默认 TLS 校验，远端地址与密钥接收方仍需操作者核对。插件本身无 GPU 推理，显存、吞吐、电费、模型许可都由 vLLM 部署承担。可改进总输入上限与取消传递，均未实现。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-42](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/README.md#L12-L42)

作者安装/可选与端点说明

<details>
<summary>查看原文（31行）</summary>

````text
## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-vllm
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-vllm
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## 工具

| 工具 | 作用 |
|------|------|
| `vllm_status` | 可达性与模型 |
| `vllm_chat` | 对话补全 |

## 配置要点

`baseUrl / defaultModel / timeoutMs`

Windows 原生 vLLM 一般没有；优先 Docker。`DSH_VLLM_BASE` / `DSH_VLLM_MODEL`。

## 兼容性

| 字段 | 值 |
|------|----|
| **插件** | `dsh-wsl-vllm` **0.1.0** |
| **最低 dsh** | ≥ **0.1.2**（Web UI 一次性 `?token=`，Windows 中继 `:3081`） |
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.2.0-rc.2`**）— 套件唯一真源 |
| **套件档位** | 可选（默认不在 `install.sh` / `KIT_SET=daily`） |
````

</details>

**依据 2 · 源码核查**：[lib/client.js:11-25](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/lib/client.js#L11-L25)

默认地址和请求行为

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/client.js:45-89](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/lib/client.js#L45-L89)

状态/聊天结果

<details>
<summary>查看原文（45行）</summary>

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
    },
  };
```

</details>

**依据 4 · 源码核查**：[index.js:20-24](https://github.com/173787247/dsh-wsl-vllm/blob/e42e1dc23a89ea7cc87474dcd5d8c610b37c651b/index.js#L20-L24)

使用建议

```text
  ctx.systemPrompt.section({
    name: "tool:vllm",
    order: 128,
    text: "dsh-wsl-vllm talks to a local/Docker vLLM OpenAI-compatible server (default http://127.0.0.1:8000). Use vllm_status before vllm_chat. Prefer for high-throughput local serving; do not assume Windows-native vLLM.",
  });
```

#### 缺口

- 实际模型部署成本、网络暴露和效果未测
  **影响**：不能把工具可注册等同本地推理已就绪
  **进一步探讨**：目标硬件/容器联通、授权和短/长请求性能验证

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
