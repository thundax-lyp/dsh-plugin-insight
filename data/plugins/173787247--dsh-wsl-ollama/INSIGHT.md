# dsh-wsl-ollama

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[90a0f51](https://github.com/173787247/dsh-wsl-ollama/tree/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-ollama)
<!-- END META -->

> **实现功能**：为 DSH 在 WSL 或本机调用现有 Ollama 守护进程提供状态、模型列表、聊天和嵌入工具。

> **核心亮点**：简化 Agent 对本地 Ollama 模型的自查、聊天与向量获取。详见[Q01](#research-q01)。

> **风险与缺陷**：只看 status.ok 会误判连通；maxPromptChars 不限制 messages 分支，且 baseUrl 并非保证本地。详见[Q03](#research-q03)和[Q04](#research-q04)。

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
  - [Q01 · Ollama 插件在 WSL 中承担哪类角色？](#detail-section-11)
  - [Q02 · WSL 主机地址和请求超时如何决定？](#detail-section-12)
  - [Q03 · 输入截断与返回量有哪些不一致？](#detail-section-13)
  - [Q04 · 状态检查的成功语义与本地性如何判断？](#detail-section-14)
  - [Q05 · 怎样验证后才用于本地任务？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 Ollama 模型的本机/WSL 辅助调用；不是 DSH 主模型提供器。详见[Q01](#research-q01)。

直接 Ollama CLI/HTTP 提供原生能力；插件只减少 Agent 调用步骤，未提供索引管理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| status/list | 发现可用模型 | status.ok 不代表 reachable |
| chat | 非流式调用 | messages 未按 maxPromptChars 截断 |
| embed | 返回向量 | 大向量负担未知 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH tools/systemPrompt | 必需 | Agent 入口 | 无工具 |
| Ollama 服务与模型 | 必需 | chat/embed | 不可达/无模型 |
| WSL/Windows 网络 | 条件必需 | 跨系统访问 | status unreachable |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 配置 | 设 baseUrl/defaultModel | 指向正确主机 |
| 自查 | status/list | reachable 且模型存在 |
| 试用 | chat/embed | 对照 Ollama 直调 |
| 扩用 | 检资源/地址 | 明确数据边界 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 启动 | Ollama 守护进程/模型磁盘 | WSL 地址配置 | 兼容未测 |
| 调用 | 本机 CPU/GPU/内存、网络 | 监控超时 | 性能未知 |
| 安全 | Windows 监听/防火墙 | 控制 baseUrl | 隐私取决于部署 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 模型调用 | Ollama chat/embed | 质量/性能 |
| WSL 探测 | nameserver 推断 | 必然连通 |
| 输入限制 | prompt 截断 | messages 上界 |

> **思考**：只看 status.ok 会误判连通；maxPromptChars 不限制 messages 分支，且 baseUrl 并非保证本地。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：简化 Agent 对本地 Ollama 模型的自查、聊天与向量获取。详见[Q01](#research-q01)。

简化 Agent 对本地 Ollama 模型的自查、聊天与向量获取。详见[Q01](#research-q01)。

轻量 HTTP 客户端便于借鉴；状态语义、两层超时和输入限制需对齐。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

只看 status.ok 会误判连通；maxPromptChars 不限制 messages 分支，且 baseUrl 并非保证本地。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅在已确认 reachable、模型和地址的环境小范围试用；长 messages 与向量返回需核宿主负担。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持四工具；status 在不可达仍 ok:true，messages 绕过 prompt 截断，短工具超时与客户端120秒不一致；目标 WSL 未测。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.md、index.js、lib/client.js、package.json；未调用 Ollama/宿主或跑目标测试。旧 META 仅复用。
- 下一步：目标 WSL 测探测地址、不可达 status、慢请求取消、长 messages、嵌入输出。

**分析版本**

- **仓库**：[173787247/dsh-wsl-ollama](https://github.com/173787247/dsh-wsl-ollama)
- **版本号**：0.2.0（[固定提交 90a0f51](https://github.com/173787247/dsh-wsl-ollama/tree/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进为统一 reachable/ok、传播取消、限所有消息/向量长度及展示地址边界。详见[Q05](#research-q05)。

目标 WSL 测探测地址、不可达 status、慢请求取消、长 messages、嵌入输出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 120 | — | — | 594 |
| .js | source | 2 | 275 | 255 | 8 | — |
| .js | test | 1 | 61 | 57 | 2 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-ollama/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 中的 Ollama 工具是否在可达性、输入限制与超时语义上可靠？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Ollama 插件在 WSL 中承担哪类角色？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它为 DSH 注册 ollama_status/list/chat/embed 四个工具和一段系统提示，调用已有本地/Windows 主机 Ollama 守护进程的 HTTP API。它不是替换 DSH 主模型的 model provider，聊天是模型可调用的非流式工具；嵌入向量可供其他流程取用但本插件未提供索引或检索。适用于已有 Ollama 模型与网络可达路径的本机实验，隐私性取决于实际 baseUrl 指向。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-30](https://github.com/173787247/dsh-wsl-ollama/blob/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea/README.md#L5-L30)

作者场景与四工具

<details>
<summary>查看原文（26行）</summary>

````text
在 WSL 上给 DeepSeek Harness 接本地 [Ollama](https://ollama.com)：`ollama_status` / `list` / `chat` / `embed`。

可选插件，**不在** `install.sh`。

## 最短上手

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-ollama
# 或本机 path 链进 web profile 后 restart
```

Ollama 需已在跑。默认基址 `http://127.0.0.1:11434`。

若 Ollama 装在 **Windows**、dsh 在 **WSL**：`localhost` 常会 503。可：

- 让 Ollama 监听 `0.0.0.0:11434`，或
- 设 `DSH_OLLAMA_BASE=http://<Windows主机IP>:11434`（插件也可在 `baseUrl` 为空时尝试从 `/etc/resolv.conf` 推主机）

## 工具

| 工具 | 作用 |
|------|------|
| `ollama_status` | 基址、连通性、默认模型 |
| `ollama_list` | 已拉取模型列表 |
| `ollama_chat` | 本地对话 |
| `ollama_embed` | 向量（给 vecmem 等用） |
````

</details>

**依据 2 · 源码核查**：[index.js:3-23](https://github.com/173787247/dsh-wsl-ollama/blob/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea/index.js#L3-L23)

工具/提示入口

<details>
<summary>查看原文（21行）</summary>

```text
export const name = "dsh-wsl-ollama";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-ollama] disabled");
    return;
  }
  const client = createOllamaClient({
    baseUrl: config.baseUrl || undefined,
    defaultModel: config.defaultModel || process.env.DSH_OLLAMA_MODEL || "",
    timeoutMs: positive(config.timeoutMs, 120_000),
    maxPromptChars: positive(config.maxPromptChars, 32_000),
  });
  console.log(`[dsh-wsl-ollama] base=${client.root} defaultModel=${client.defaultModel || "(none)"}`);

  ctx.systemPrompt.section({
    name: "tool:ollama",
    order: 128,
    text: "dsh-wsl-ollama talks to a local Ollama daemon (default http://127.0.0.1:11434). Use ollama_status/list before chat. Prefer local models for offline or private prompts; cloud Flash stays the default agent brain unless you choose otherwise.",
  });
```

</details>

**依据 3 · 源码核查**：[index.js:59-124](https://github.com/173787247/dsh-wsl-ollama/blob/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea/index.js#L59-L124)

chat/embed 注册

<details>
<summary>查看原文（66行）</summary>

```text
  ctx.tools.register({
    name: "ollama_chat",
    description: "Non-streaming chat against a local Ollama model. Provide model + prompt (or messages).",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        model: { type: "string" },
        prompt: { type: "string" },
        system: { type: "string" },
        messages: {
          type: "array",
          items: {
            type: "object",
            properties: { role: { type: "string" }, content: { type: "string" } },
          },
        },
      },
    },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: v.ok === false ? `FAIL: ${v.error}` : String(v.message || "") }] },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await client.chat(args || {});
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "Ollama chat" }),
    presentResult: (_a, r) => ({ card: "generic", title: "Ollama chat", content: r.content }),
  });

  ctx.tools.register({
    name: "ollama_embed",
    description: "Embed text with a local Ollama embedding-capable model. Returns dims + embedding vector.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["input"],
      properties: {
        model: { type: "string", description: "Embedding model name" },
        input: { type: "string" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text: v.ok === false ? `FAIL: ${v.error}` : `dims=${v.dims} model=${v.model} (embedding omitted in render)`,
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await client.embed(args || {});
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "Ollama embed" }),
    presentResult: (_a, r) => ({ card: "generic", title: "Ollama embed", content: r.content }),
  });
```

</details>

**依据 4 · 源码核查**：[lib/client.js:104-138](https://github.com/173787247/dsh-wsl-ollama/blob/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea/lib/client.js#L104-L138)

HTTP chat/embed

<details>
<summary>查看原文（35行）</summary>

```text
    async chat({ model, prompt, system, messages }) {
      const m = String(model || defaultModel || "").trim();
      if (!m) throw new Error("ollama_chat: model required (or set defaultModel / DSH_OLLAMA_MODEL)");
      let msgs = Array.isArray(messages) ? messages.map((x) => ({ role: x.role, content: String(x.content || "") })) : [];
      if (!msgs.length) {
        const p = String(prompt || "").trim();
        if (!p) throw new Error("ollama_chat: prompt or messages required");
        if (system) msgs.push({ role: "system", content: String(system) });
        msgs.push({ role: "user", content: p.slice(0, maxPromptChars) });
      }
      const json = await request("/api/chat", {
        method: "POST",
        body: { model: m, messages: msgs, stream: false },
      });
      return {
        ok: true,
        model: json.model || m,
        message: json.message?.content || "",
        done: json.done,
        total_duration: json.total_duration,
      };
    },
    async embed({ model, input }) {
      const m = String(model || defaultModel || "").trim();
      if (!m) throw new Error("ollama_embed: model required");
      const text = String(input || "").trim();
      if (!text) throw new Error("ollama_embed: input required");
      const json = await request("/api/embeddings", {
        method: "POST",
        body: { model: m, prompt: text.slice(0, maxPromptChars) },
      });
      const emb = json.embedding || json.embeddings?.[0] || [];
      return { ok: true, model: m, dims: emb.length, embedding: emb };
    },
  };
```

</details>

#### 缺口

- 目标 DSH/Ollama 版本与本地模型未测
  **影响**：不能推断模型质量/完全本地隐私
  **进一步探讨**：目标 WSL 状态/list 与本机 Ollama 对照

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · WSL 主机地址和请求超时如何决定？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

baseUrl 显式配置优先，其次 DSH_OLLAMA_BASE/OLLAMA_HOST；WSL 时从 /etc/resolv.conf 首个 nameserver 推测 Windows 主机地址，否则回 127.0.0.1:11434。HTTP 请求统一按 timeoutMs 默认120秒设置 AbortController，并 JSON 解析/错误化；工具层 status/list 分别标15/30秒、chat/embed 标 timeoutMs，但客户端均用统一120秒，因此 status/list 宿主截止可能先于底层请求。WSL nameserver 未必就是 Ollama 所在主机，需实际连通验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:5-22](https://github.com/173787247/dsh-wsl-ollama/blob/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea/lib/client.js#L5-L22)

地址探测

<details>
<summary>查看原文（18行）</summary>

```text
export function detectDefaultBase(env = process.env) {
  const fromEnv = String(env.DSH_OLLAMA_BASE || env.OLLAMA_HOST || "").trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (existsSync("/proc/version")) {
    try {
      const v = readFileSync("/proc/version", "utf8");
      if (/microsoft|wsl/i.test(v)) {
        // WSL2 default NAT gateway = Windows host
        const resolv = readFileSync("/etc/resolv.conf", "utf8");
        const m = resolv.match(/^nameserver\s+(\S+)/m);
        if (m) return `http://${m[1]}:11434`;
      }
    } catch {
      /* fall through */
    }
  }
  return "http://127.0.0.1:11434";
}
```

</details>

**依据 2 · 源码核查**：[lib/client.js:35-69](https://github.com/173787247/dsh-wsl-ollama/blob/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea/lib/client.js#L35-L69)

统一请求时限

<details>
<summary>查看原文（35行）</summary>

```text
export function createOllamaClient({
  baseUrl,
  defaultModel = "",
  timeoutMs = 120_000,
  maxPromptChars = 32_000,
  fetchImpl = fetch,
  env = process.env,
} = {}) {
  const root = String(baseUrl || detectDefaultBase(env)).replace(/\/$/, "");

  async function request(path, { method = "GET", body } = {}) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetchImpl(`${root}${path}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
        signal: ctrl.signal,
      });
      const text = await res.text();
      let json;
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`ollama non-JSON ${res.status}: ${text.slice(0, 200)}`);
      }
      if (!res.ok) {
        throw new Error(`ollama HTTP ${res.status}: ${json?.error || text.slice(0, 200)}`);
      }
      return json;
    } finally {
      clearTimeout(t);
    }
  }
```

</details>

**依据 3 · 源码核查**：[index.js:25-49](https://github.com/173787247/dsh-wsl-ollama/blob/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea/index.js#L25-L49)

status/list 工具超时

<details>
<summary>查看原文（25行）</summary>

```text
  const timeoutMs = client.timeoutMs;

  ctx.tools.register({
    name: "ollama_status",
    description: "Check whether local Ollama is reachable and list known default model.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 15_000,
    isConcurrencySafe: () => true,
    async execute() {
      return client.status();
    },
    presentCall: () => ({ card: "generic", title: "Ollama status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "Ollama status", content: r.content }),
  });

  ctx.tools.register({
    name: "ollama_list",
    description: "List models installed in local Ollama.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: formatList(v) }] },
    timeoutMs: 30_000,
    isConcurrencySafe: () => true,
    async execute() {
      try {
```

</details>

**依据 4 · 源码核查**：[index.js:78-115](https://github.com/173787247/dsh-wsl-ollama/blob/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea/index.js#L78-L115)

chat/embed 工具超时

<details>
<summary>查看原文（38行）</summary>

```text
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: v.ok === false ? `FAIL: ${v.error}` : String(v.message || "") }] },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await client.chat(args || {});
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "Ollama chat" }),
    presentResult: (_a, r) => ({ card: "generic", title: "Ollama chat", content: r.content }),
  });

  ctx.tools.register({
    name: "ollama_embed",
    description: "Embed text with a local Ollama embedding-capable model. Returns dims + embedding vector.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["input"],
      properties: {
        model: { type: "string", description: "Embedding model name" },
        input: { type: "string" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text: v.ok === false ? `FAIL: ${v.error}` : `dims=${v.dims} model=${v.model} (embedding omitted in render)`,
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
```

</details>

#### 缺口

- 宿主 timeout 如何中止底层请求未知
  **影响**：短工具可能提前超时而请求继续
  **进一步探讨**：目标 WSL 网络地址/慢服务对照

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 输入截断与返回量有哪些不一致？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

chat 的 maxPromptChars 仅应用于使用 prompt 的分支；只要 messages 数组非空就直接映射每条 content，system 参数也不会再单独附加。embed 输入会截到 maxPromptChars。ollama_embed 工具的 render 只显示 dims/model 并说明向量 omitted，但 execute 返回包含完整 embedding 的对象；宿主是否将原始结构化向量交给模型需实测。非流式 chat 和完整向量可能导致时延/上下文负担。

prompt 分支的 system 也原样加入，不在 maxPromptChars 内，因此该配置不是组合输入总预算。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:104-136](https://github.com/173787247/dsh-wsl-ollama/blob/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea/lib/client.js#L104-L136)

prompt 与 messages 分支/截断

<details>
<summary>查看原文（33行）</summary>

```text
    async chat({ model, prompt, system, messages }) {
      const m = String(model || defaultModel || "").trim();
      if (!m) throw new Error("ollama_chat: model required (or set defaultModel / DSH_OLLAMA_MODEL)");
      let msgs = Array.isArray(messages) ? messages.map((x) => ({ role: x.role, content: String(x.content || "") })) : [];
      if (!msgs.length) {
        const p = String(prompt || "").trim();
        if (!p) throw new Error("ollama_chat: prompt or messages required");
        if (system) msgs.push({ role: "system", content: String(system) });
        msgs.push({ role: "user", content: p.slice(0, maxPromptChars) });
      }
      const json = await request("/api/chat", {
        method: "POST",
        body: { model: m, messages: msgs, stream: false },
      });
      return {
        ok: true,
        model: json.model || m,
        message: json.message?.content || "",
        done: json.done,
        total_duration: json.total_duration,
      };
    },
    async embed({ model, input }) {
      const m = String(model || defaultModel || "").trim();
      if (!m) throw new Error("ollama_embed: model required");
      const text = String(input || "").trim();
      if (!text) throw new Error("ollama_embed: input required");
      const json = await request("/api/embeddings", {
        method: "POST",
        body: { model: m, prompt: text.slice(0, maxPromptChars) },
      });
      const emb = json.embedding || json.embeddings?.[0] || [];
      return { ok: true, model: m, dims: emb.length, embedding: emb };
```

</details>

**依据 2 · 源码核查**：[index.js:92-123](https://github.com/173787247/dsh-wsl-ollama/blob/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea/index.js#L92-L123)

embed 渲染隐藏向量但返回原值

<details>
<summary>查看原文（32行）</summary>

```text
  ctx.tools.register({
    name: "ollama_embed",
    description: "Embed text with a local Ollama embedding-capable model. Returns dims + embedding vector.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["input"],
      properties: {
        model: { type: "string", description: "Embedding model name" },
        input: { type: "string" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text: v.ok === false ? `FAIL: ${v.error}` : `dims=${v.dims} model=${v.model} (embedding omitted in render)`,
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await client.embed(args || {});
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "Ollama embed" }),
    presentResult: (_a, r) => ({ card: "generic", title: "Ollama embed", content: r.content }),
```

</details>

**依据 3 · 作者声明**：[README.md:32-43](https://github.com/173787247/dsh-wsl-ollama/blob/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea/README.md#L32-L43)

配置边界

<details>
<summary>查看原文（12行）</summary>

````text
## 配置

```yaml
config:
  enabled: true
  baseUrl: ""              # 空 = 自动探测
  defaultModel: ""         # 或环境变量 DSH_OLLAMA_MODEL
  timeoutMs: 120000
  maxPromptChars: 32000
```

环境变量：`DSH_OLLAMA_BASE` / `OLLAMA_HOST`、`DSH_OLLAMA_MODEL`。
````

</details>

#### 缺口

- 宿主结构化值可见性与大向量大小未知
  **影响**：长 messages 可绕过限制，大向量可能增加处理成本
  **进一步探讨**：目标宿主测 messages 上界与向量可见性

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 状态检查的成功语义与本地性如何判断？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

status 捕获 /api/tags 失败后仍返回 ok:true，同时 reachable:false 和 hints；因此只看 ok 会误认 Ollama 已可用，使用者应以 reachable 判定。baseUrl 可指任意 HTTP 位置，WSL Windows 守护进程若需监听0.0.0.0，将扩大访问面；插件未做 URL 私网校验或身份认证，调用边界由配置与 Ollama 服务承担。status/list 应先于 chat/embed，用明确的模型与地址复核。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:75-90](https://github.com/173787247/dsh-wsl-ollama/blob/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea/lib/client.js#L75-L90)

status 不可达仍 ok:true

<details>
<summary>查看原文（16行）</summary>

```text
    async status() {
      try {
        const tags = await request("/api/tags");
        const models = (tags.models || []).map((m) => m.name);
        return { ok: true, baseUrl: root, reachable: true, models, defaultModel: defaultModel || null };
      } catch (e) {
        return {
          ok: true,
          baseUrl: root,
          reachable: false,
          error: e instanceof Error ? e.message : String(e),
          models: [],
          defaultModel: defaultModel || null,
          hints: unreachableHints({ baseUrl: root }),
        };
      }
```

</details>

**依据 2 · 源码核查**：[lib/client.js:5-33](https://github.com/173787247/dsh-wsl-ollama/blob/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea/lib/client.js#L5-L33)

WSL 地址/监听建议

<details>
<summary>查看原文（29行）</summary>

```text
export function detectDefaultBase(env = process.env) {
  const fromEnv = String(env.DSH_OLLAMA_BASE || env.OLLAMA_HOST || "").trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (existsSync("/proc/version")) {
    try {
      const v = readFileSync("/proc/version", "utf8");
      if (/microsoft|wsl/i.test(v)) {
        // WSL2 default NAT gateway = Windows host
        const resolv = readFileSync("/etc/resolv.conf", "utf8");
        const m = resolv.match(/^nameserver\s+(\S+)/m);
        if (m) return `http://${m[1]}:11434`;
      }
    } catch {
      /* fall through */
    }
  }
  return "http://127.0.0.1:11434";
}

/** Hints when Ollama is unreachable from WSL (localhost ≠ Windows host). */
export function unreachableHints({ baseUrl } = {}) {
  return [
    "Ollama unreachable from this process.",
    "WSL localhost is not the Windows host — if Ollama runs on Windows, point at the WSL2 gateway (often 10.255.255.254) or the nameserver in /etc/resolv.conf.",
    "Example: DSH_OLLAMA_BASE=http://10.255.255.254:11434 (or http://<windows-host-ip>:11434).",
    "Ensure Ollama listens on 0.0.0.0:11434 (not only 127.0.0.1 on Windows).",
    baseUrl ? `Tried baseUrl=${baseUrl}` : null,
  ].filter(Boolean);
}
```

</details>

**依据 3 · 作者声明**：[README.md:16-21](https://github.com/173787247/dsh-wsl-ollama/blob/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea/README.md#L16-L21)

作者网络配置说明

```text
Ollama 需已在跑。默认基址 `http://127.0.0.1:11434`。

若 Ollama 装在 **Windows**、dsh 在 **WSL**：`localhost` 常会 503。可：

- 让 Ollama 监听 `0.0.0.0:11434`，或
- 设 `DSH_OLLAMA_BASE=http://<Windows主机IP>:11434`（插件也可在 `baseUrl` 为空时尝试从 `/etc/resolv.conf` 推主机）
```

**依据 4 · 源码核查**：[index.js:19-23](https://github.com/173787247/dsh-wsl-ollama/blob/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea/index.js#L19-L23)

模型自查提示

```text
  ctx.systemPrompt.section({
    name: "tool:ollama",
    order: 128,
    text: "dsh-wsl-ollama talks to a local Ollama daemon (default http://127.0.0.1:11434). Use ollama_status/list before chat. Prefer local models for offline or private prompts; cloud Flash stays the default agent brain unless you choose otherwise.",
  });
```

#### 缺口

- 目标 Windows 防火墙/服务绑定/宿主路由未知
  **影响**：“本地”隐私与可达性不可仅从插件名推断
  **进一步探讨**：目标检查监听地址、reachable 和外部可访问性

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证后才用于本地任务？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

先在 WSL 检 status.reachable，再 list 确认模型名，chat 用短 prompt 与长 messages 测超时/截断，embed 核 dims 与返回向量；记录模型下载磁盘、CPU/GPU/内存、非流式等待和网络开放成本。本轮未测性能或结果质量。可改进 status 的 ok 语义、统一工具/客户端取消、全部消息及向量大小限制，并标注地址并非必然本机；这些是未实现假设。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-43](https://github.com/173787247/dsh-wsl-ollama/blob/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea/README.md#L9-L43)

作者安装与配置

<details>
<summary>查看原文（35行）</summary>

````text
## 最短上手

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-ollama
# 或本机 path 链进 web profile 后 restart
```

Ollama 需已在跑。默认基址 `http://127.0.0.1:11434`。

若 Ollama 装在 **Windows**、dsh 在 **WSL**：`localhost` 常会 503。可：

- 让 Ollama 监听 `0.0.0.0:11434`，或
- 设 `DSH_OLLAMA_BASE=http://<Windows主机IP>:11434`（插件也可在 `baseUrl` 为空时尝试从 `/etc/resolv.conf` 推主机）

## 工具

| 工具 | 作用 |
|------|------|
| `ollama_status` | 基址、连通性、默认模型 |
| `ollama_list` | 已拉取模型列表 |
| `ollama_chat` | 本地对话 |
| `ollama_embed` | 向量（给 vecmem 等用） |

## 配置

```yaml
config:
  enabled: true
  baseUrl: ""              # 空 = 自动探测
  defaultModel: ""         # 或环境变量 DSH_OLLAMA_MODEL
  timeoutMs: 120000
  maxPromptChars: 32000
```

环境变量：`DSH_OLLAMA_BASE` / `OLLAMA_HOST`、`DSH_OLLAMA_MODEL`。
````

</details>

**依据 2 · 源码核查**：[lib/client.js:75-138](https://github.com/173787247/dsh-wsl-ollama/blob/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea/lib/client.js#L75-L138)

四类 API 行为

<details>
<summary>查看原文（64行）</summary>

```text
    async status() {
      try {
        const tags = await request("/api/tags");
        const models = (tags.models || []).map((m) => m.name);
        return { ok: true, baseUrl: root, reachable: true, models, defaultModel: defaultModel || null };
      } catch (e) {
        return {
          ok: true,
          baseUrl: root,
          reachable: false,
          error: e instanceof Error ? e.message : String(e),
          models: [],
          defaultModel: defaultModel || null,
          hints: unreachableHints({ baseUrl: root }),
        };
      }
    },
    async list() {
      const tags = await request("/api/tags");
      return {
        ok: true,
        models: (tags.models || []).map((m) => ({
          name: m.name,
          size: m.size,
          modified_at: m.modified_at,
          digest: m.digest,
        })),
      };
    },
    async chat({ model, prompt, system, messages }) {
      const m = String(model || defaultModel || "").trim();
      if (!m) throw new Error("ollama_chat: model required (or set defaultModel / DSH_OLLAMA_MODEL)");
      let msgs = Array.isArray(messages) ? messages.map((x) => ({ role: x.role, content: String(x.content || "") })) : [];
      if (!msgs.length) {
        const p = String(prompt || "").trim();
        if (!p) throw new Error("ollama_chat: prompt or messages required");
        if (system) msgs.push({ role: "system", content: String(system) });
        msgs.push({ role: "user", content: p.slice(0, maxPromptChars) });
      }
      const json = await request("/api/chat", {
        method: "POST",
        body: { model: m, messages: msgs, stream: false },
      });
      return {
        ok: true,
        model: json.model || m,
        message: json.message?.content || "",
        done: json.done,
        total_duration: json.total_duration,
      };
    },
    async embed({ model, input }) {
      const m = String(model || defaultModel || "").trim();
      if (!m) throw new Error("ollama_embed: model required");
      const text = String(input || "").trim();
      if (!text) throw new Error("ollama_embed: input required");
      const json = await request("/api/embeddings", {
        method: "POST",
        body: { model: m, prompt: text.slice(0, maxPromptChars) },
      });
      const emb = json.embedding || json.embeddings?.[0] || [];
      return { ok: true, model: m, dims: emb.length, embedding: emb };
    },
  };
```

</details>

**依据 3 · 源码核查**：[index.js:27-124](https://github.com/173787247/dsh-wsl-ollama/blob/90a0f51bc8c9c16f41c99a4c17b84aa6df4ff1ea/index.js#L27-L124)

工具接口

<details>
<summary>查看原文（98行）</summary>

```text
  ctx.tools.register({
    name: "ollama_status",
    description: "Check whether local Ollama is reachable and list known default model.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 15_000,
    isConcurrencySafe: () => true,
    async execute() {
      return client.status();
    },
    presentCall: () => ({ card: "generic", title: "Ollama status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "Ollama status", content: r.content }),
  });

  ctx.tools.register({
    name: "ollama_list",
    description: "List models installed in local Ollama.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: formatList(v) }] },
    timeoutMs: 30_000,
    isConcurrencySafe: () => true,
    async execute() {
      try {
        return await client.list();
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "Ollama list" }),
    presentResult: (_a, r) => ({ card: "generic", title: "Ollama list", content: r.content }),
  });

  ctx.tools.register({
    name: "ollama_chat",
    description: "Non-streaming chat against a local Ollama model. Provide model + prompt (or messages).",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        model: { type: "string" },
        prompt: { type: "string" },
        system: { type: "string" },
        messages: {
          type: "array",
          items: {
            type: "object",
            properties: { role: { type: "string" }, content: { type: "string" } },
          },
        },
      },
    },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: v.ok === false ? `FAIL: ${v.error}` : String(v.message || "") }] },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await client.chat(args || {});
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "Ollama chat" }),
    presentResult: (_a, r) => ({ card: "generic", title: "Ollama chat", content: r.content }),
  });

  ctx.tools.register({
    name: "ollama_embed",
    description: "Embed text with a local Ollama embedding-capable model. Returns dims + embedding vector.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["input"],
      properties: {
        model: { type: "string", description: "Embedding model name" },
        input: { type: "string" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text: v.ok === false ? `FAIL: ${v.error}` : `dims=${v.dims} model=${v.model} (embedding omitted in render)`,
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await client.embed(args || {});
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "Ollama embed" }),
    presentResult: (_a, r) => ({ card: "generic", title: "Ollama embed", content: r.content }),
  });
```

</details>

#### 缺口

- 目标硬件性能、模型质量和运行费用未知
  **影响**：无法给出生产推荐
  **进一步探讨**：目标 WSL 隔离 profile/已知模型运行完整矩阵

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
