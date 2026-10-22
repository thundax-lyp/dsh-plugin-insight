# dsh-wsl-llamacpp

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[bc5454d](https://github.com/173787247/dsh-wsl-llamacpp/tree/bc5454d19624f5f7575e841c6d62d47cbbdb2411)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-llamacpp)
<!-- END META -->

> **实现功能**：给 DSH Agent 提供 llama.cpp 兼容服务的模型列表状态与一次性非流式聊天工具。

> **核心亮点**：降低 Agent 调用本地 OpenAI 兼容 GGUF 服务的接线成本。详见[Q01](#research-q01)。

> **风险与缺陷**：健康 ok:true 与可达性分离、状态超时不一致，最大 prompt 限制只对单 prompt 生效。详见[Q03](#research-q03)和[Q04](#research-q04)。

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
  - [Q01 · 是 DSH 模型提供者还是工具级本地推理桥？](#detail-section-11)
  - [Q02 · 连接、模型和返回如何处理？](#detail-section-12)
  - [Q03 · status 的 ok:true 能否表示本地服务健康？](#detail-section-13)
  - [Q04 · 输入/输出长度控制覆盖哪些路径？](#detail-section-14)
  - [Q05 · 什么时候可用于本地辅助推理？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 GGUF/llama.cpp 服务时将个别辅助请求交给本地模型。详见[Q01](#research-q01)。

直接 curl/SDK 调 llama.cpp OpenAI 兼容端点可完成推理；插件把调用接到 DSH 工具面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| status | 枚举模型 | ok:true 不等于可达 |
| chat | 本地辅助推理 | 未管理模型进程 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| OpenAI 兼容服务 | 必需 | 模型/聊天 API | reachable:false |
| 已加载 GGUF | 实际推理必需 | 生成 | chat 失败 |
| DSH tools | 必需 | Agent 入口 | 无工具 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 启动 | 本机模型服务 | /v1/models |
| 测试 | llama_status | reachable/models |
| 调用 | llama_chat | message/usage/资源 |

**效果与成本**

#### 成本

| 阶段 | 本插件动作 | 现金/资源 | 人工/时间 | 未知与失败恢复 |
| --- | --- | --- | --- | --- |
| 首次 | 获取 GGUF/启动兼容服务、设模型/URL/key | GPU/CPU/内存/磁盘/电力；硬件购买与模型许可金额未知 | 模型选择、端口/隐私校验与集成工时未知 | 模型不兼容需换模型或回退原生调用 |
| 持续 | 每次非流式 chat 与 status | 显存/计算/电力/可能远端流量，金额未知 | 人工质量核查/监控 reachable，工时未知 | 单次延迟/吞吐/重试率未知 |
| 失败恢复 | 处理服务停机、超时、超长请求或误外发 | 重算/重启占资源；如误发远端有外部成本未知 | 查 tool_success/reachable、清理进程/轮换 key，工时未知 | 大响应无界、恢复成功率未测 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 状态 | 模型列表请求 | 服务健康/性能 |
| 聊天 | 首个 completion | 质量/稳定 |
| 本地性 | 默认 localhost | 配置后仍本地 |

> **思考**：健康 ok:true 与可达性分离、状态超时不一致，最大 prompt 限制只对单 prompt 生效。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：降低 Agent 调用本地 OpenAI 兼容 GGUF 服务的接线成本。详见[Q01](#research-q01)。

降低 Agent 调用本地 OpenAI 兼容 GGUF 服务的接线成本。详见[Q01](#research-q01)。

薄 HTTP 客户端易复用，健康语义、超时与上下文长度需严格化。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

健康 ok:true 与可达性分离、状态超时不一致，最大 prompt 限制只对单 prompt 生效。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先核 /v1/models，再以固定 prompt 对照服务端原生结果与资源；不要只看 status.ok。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认仅工具级桥；status 不可达仍 ok:true，工具 15 秒与客户端 120 秒不齐；输入输出限额不完整。目标服务未测。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.md、index.js、lib/client.js；不运行目标插件或推理服务。旧 META 复用。
- 下一步：目标服务核断线、慢模型列表、长 system/大输出、远端 URL 与 maxTokens 小数。

**分析版本**

- **仓库**：[173787247/dsh-wsl-llamacpp](https://github.com/173787247/dsh-wsl-llamacpp)
- **版本号**：0.1.0（[固定提交 bc5454d](https://github.com/173787247/dsh-wsl-llamacpp/tree/bc5454d19624f5f7575e841c6d62d47cbbdb2411)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进为一致健康语义、输入/输出边界和本机 URL 限制。详见[Q05](#research-q05)。

目标服务核断线、慢模型列表、长 system/大输出、远端 URL 与 maxTokens 小数。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 109 | — | — | 460 |
| .js | source | 2 | 169 | 158 | 4 | — |
| .js | test | 1 | 17 | 16 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-20），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-llamacpp/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：llama.cpp 工具级桥接的能力、健康信号和资源控制边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 是 DSH 模型提供者还是工具级本地推理桥？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件只注册 llama_status 与 llama_chat 两个工具，并注入提示词；chat 工具一次 POST /v1/chat/completions，默认非流式返回首个 choice，未注册 DSH 模型 provider 或替换主 Agent 模型。README 说复用已有 GGUF/llama.cpp/Unsloth Desktop，适合 Agent 把个别请求转给本地服务。固定源码不证明目标 GGUF/宿主互通。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-33](https://github.com/173787247/dsh-wsl-llamacpp/blob/bc5454d19624f5f7575e841c6d62d47cbbdb2411/README.md#L5-L33)

作者定位与配置

<details>
<summary>查看原文（29行）</summary>

````text
对接本机 llama.cpp / Unsloth Desktop 的 OpenAI 兼容接口（默认 :8080）。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-llamacpp
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-llamacpp
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## 工具

| 工具 | 作用 |
|------|------|
| `llama_status` | 是否可达、模型 id |
| `llama_chat` | /v1/chat/completions |

## 配置要点

`baseUrl / defaultModel / timeoutMs`

复用已有 GGUF，不重装工具链。环境变量：`DSH_LLAMA_BASE`、`DSH_LLAMA_MODEL`。
````

</details>

**依据 2 · 源码核查**：[index.js:21-72](https://github.com/173787247/dsh-wsl-llamacpp/blob/bc5454d19624f5f7575e841c6d62d47cbbdb2411/index.js#L21-L72)

只注册两个工具

<details>
<summary>查看原文（52行）</summary>

```text
  ctx.systemPrompt.section({
    name: "tool:llamacpp",
    order: 128,
    text: "dsh-wsl-llamacpp talks to a local llama.cpp (or Unsloth Desktop) OpenAI-compatible server. Default http://127.0.0.1:8080. Use llama_status before llama_chat. Do not reinstall toolchains — reuse existing GGUF servers.",
  });

  const timeoutMs = client.timeoutMs;

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
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "llama chat" }),
    presentResult: (_a, r) => ({ card: "generic", title: "llama chat", content: r.content }),
  });
}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:62-90](https://github.com/173787247/dsh-wsl-llamacpp/blob/bc5454d19624f5f7575e841c6d62d47cbbdb2411/lib/client.js#L62-L90)

单次非流式 chat

<details>
<summary>查看原文（29行）</summary>

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
    },
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 连接、模型和返回如何处理？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

baseUrl 优先配置再 DSH_LLAMA_BASE，缺省 127.0.0.1:8080；defaultModel 同理；apiKey 可从配置或 DSH_LLAMA_API_KEY 取。status 调 /v1/models，chat 需明确/默认 model，再组 system/user prompt 和 max_tokens，非流式请求超时默认 120 秒，结果只提取 choices[0].message.content 与 usage。baseUrl 没有限定本机，若改到远端会把 Bearer key 和 prompt 发到该地址，需由部署者校验服务归属。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:6-19](https://github.com/173787247/dsh-wsl-llamacpp/blob/bc5454d19624f5f7575e841c6d62d47cbbdb2411/index.js#L6-L19)

配置与默认

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

**依据 2 · 源码核查**：[lib/client.js:12-40](https://github.com/173787247/dsh-wsl-llamacpp/blob/bc5454d19624f5f7575e841c6d62d47cbbdb2411/lib/client.js#L12-L40)

请求/鉴权/超时

<details>
<summary>查看原文（29行）</summary>

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
  }
```

</details>

**依据 3 · 源码核查**：[lib/client.js:46-90](https://github.com/173787247/dsh-wsl-llamacpp/blob/bc5454d19624f5f7575e841c6d62d47cbbdb2411/lib/client.js#L46-L90)

状态/模型/输出

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
    },
```

</details>

#### 缺口

- 目标服务器接口版本和隐私边界未知
  **影响**：错误配置可外发提示词/密钥
  **进一步探讨**：目标隔离网络验证 URL 与认证

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · status 的 ok:true 能否表示本地服务健康？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

status 捕获任何 /v1/models 错误仍返回 ok:true、reachable:false 和 error；这仅表示工具调用本身返回结构，而非服务器可达。模型列表解析直接对 models.data 做 map，非数组或形状异常也进入 reachable:false。Agent/监控若只看 ok 会误判健康，必须同时看 reachable 与 models，并检查实际 chat。status 工具 timeoutMs=15 秒，但 client 请求默认 120 秒，宿主可能先超时。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:29-41](https://github.com/173787247/dsh-wsl-llamacpp/blob/bc5454d19624f5f7575e841c6d62d47cbbdb2411/index.js#L29-L41)

status 工具 15s

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/client.js:46-61](https://github.com/173787247/dsh-wsl-llamacpp/blob/bc5454d19624f5f7575e841c6d62d47cbbdb2411/lib/client.js#L46-L61)

status 失败 ok:true

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

**依据 3 · 源码核查**：[lib/client.js:15-39](https://github.com/173787247/dsh-wsl-llamacpp/blob/bc5454d19624f5f7575e841c6d62d47cbbdb2411/lib/client.js#L15-L39)

客户端 120s 超时

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
        throw new Error(`${label} non-JSON ${res.status}: ${text.slice(0, 200)}`);
      }
      if (!res.ok) throw new Error(`${label} HTTP ${res.status}: ${json?.error?.message || json?.error || text.slice(0, 200)}`);
      return json;
    } finally {
      clearTimeout(t);
    }
```

</details>

#### 缺口

- 目标 DSH tool timeout 行为未测
  **影响**：健康信号可能被误读
  **进一步探讨**：目标服务停机/慢响应核 tool output

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 输入/输出长度控制覆盖哪些路径？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

maxPromptChars 只在没有 messages 时截单个 prompt；client.chat 支持 messages 数组，但注册给 Agent 的 llama_chat 参数 schema 没列 messages，正常工具调用不会走该分支。system 文本不截断，maxTokens 经 Number 和上下限夹取但不取整，小数可能被传给服务器。返回 content 和 usage 不限制长度，服务端巨型响应会全读为 text 再 JSON.parse。资源占用与泄漏取决于服务端及调用者。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:43-55](https://github.com/173787247/dsh-wsl-llamacpp/blob/bc5454d19624f5f7575e841c6d62d47cbbdb2411/index.js#L43-L55)

Agent 参数仅 model/prompt/system/maxTokens

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/client.js:62-90](https://github.com/173787247/dsh-wsl-llamacpp/blob/bc5454d19624f5f7575e841c6d62d47cbbdb2411/lib/client.js#L62-L90)

仅 prompt 截断、max_tokens、返回内容

<details>
<summary>查看原文（29行）</summary>

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
    },
```

</details>

**依据 3 · 源码核查**：[lib/client.js:22-36](https://github.com/173787247/dsh-wsl-llamacpp/blob/bc5454d19624f5f7575e841c6d62d47cbbdb2411/lib/client.js#L22-L36)

全量读取响应

<details>
<summary>查看原文（15行）</summary>

```text
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
```

</details>

#### 缺口

- 目标大响应/小数参数未测
  **影响**：长度限制口径容易高估
  **进一步探讨**：目标长 system/大输出/小数 maxTokens 矩阵

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么时候可用于本地辅助推理？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

先验证服务器版本和 /v1/models，选定具体模型后做少量 chat，与原生 llama.cpp CLI/HTTP 对照质量、时延、显存与 token 费用；必要时禁用远端 baseUrl。该插件无模型管理或启动能力，需另维护 GGUF 和服务进程。改进可让 status 的 ok 反映连通、约束模型/URL 与入出长度；均未在固定版实现。部署成本视硬件和模型而定，源码不能量化。 假设推导：工具级 HTTP 桥能降低接线步骤，但 status 在不可达时仍 ok:true、客户端与 tool 超时不齐，长 system/响应也不受限；因此当前“本地可用”判断可能误导 Agent。相对固定版，将健康结果明确拆为 tool_success/reachable/model_ready，统一超时层级、对所有输入和响应字节设限，并对本地部署默认只接 loopback，可在同等资源下减少假健康与意外远端外发。条件是 llama.cpp 兼容服务返回稳定 schema，部署者确实需要本地限制；代价是大 prompt/响应被拒、更多诊断/配置。用停机、慢 /v1/models、无模型、长 system/大响应、远端 URL、非法 maxTokens 与正常短 prompt 对照固定版/原型，测健康报告与真实 chat 一致率、外发次数、失败定位和延迟。若仍报告健康但 chat 不通，或长输入仍无界消耗，或正常场景因限额大量失败，增量假设被证伪。限制远端并非现有固定版能力。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-42](https://github.com/173787247/dsh-wsl-llamacpp/blob/bc5454d19624f5f7575e841c6d62d47cbbdb2411/README.md#L22-L42)

作者工具与兼容声明

<details>
<summary>查看原文（21行）</summary>

```text
## 工具

| 工具 | 作用 |
|------|------|
| `llama_status` | 是否可达、模型 id |
| `llama_chat` | /v1/chat/completions |

## 配置要点

`baseUrl / defaultModel / timeoutMs`

复用已有 GGUF，不重装工具链。环境变量：`DSH_LLAMA_BASE`、`DSH_LLAMA_MODEL`。

## 兼容性

| 字段 | 值 |
|------|----|
| **插件** | `dsh-wsl-llamacpp` **0.1.0** |
| **最低 dsh** | ≥ **0.1.2**（Web UI 一次性 `?token=`，Windows 中继 `:3081`） |
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.2.0-rc.2`**）— 套件唯一真源 |
| **套件档位** | 可选（默认不在 `install.sh` / `KIT_SET=daily`） |
```

</details>

**依据 2 · 源码核查**：[index.js:6-25](https://github.com/173787247/dsh-wsl-llamacpp/blob/bc5454d19624f5f7575e841c6d62d47cbbdb2411/index.js#L6-L25)

禁用/接入

<details>
<summary>查看原文（20行）</summary>

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

  ctx.systemPrompt.section({
    name: "tool:llamacpp",
    order: 128,
    text: "dsh-wsl-llamacpp talks to a local llama.cpp (or Unsloth Desktop) OpenAI-compatible server. Default http://127.0.0.1:8080. Use llama_status before llama_chat. Do not reinstall toolchains — reuse existing GGUF servers.",
  });
```

</details>

**依据 3 · 源码核查**：[lib/client.js:46-90](https://github.com/173787247/dsh-wsl-llamacpp/blob/bc5454d19624f5f7575e841c6d62d47cbbdb2411/lib/client.js#L46-L90)

模型/聊天方法

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
    },
```

</details>

#### 缺口

- 真实推理质量/成本未测
  **影响**：不宜据工具存在宣称本地模型可用
  **进一步探讨**：同设备对照基准与运行监控

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
