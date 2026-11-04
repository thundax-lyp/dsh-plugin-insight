# dsh-wsl-ollama

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[53991c1](https://github.com/173787247/dsh-wsl-ollama/tree/53991c1eccd5ad3e97dd60e65ded678e61b38fe7)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-ollama)
<!-- END META -->

> **功能**：为 DSH 提供 Ollama 状态、模型列表、非流式对话和向量工具。

> **亮点**：让会话按需调用本地模型而无需切换主 provider；工具分别暴露探测、生成与向量结果。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：WSL 默认地址是启发式，实际请求可走配置的非本地端点；主会话也仍可能使用云模型。[Q01](#research-q01) [Q03](#research-q03)

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
  - [Q01 · 何时用 Ollama 工具而不是更换主模型？](#detail-section-11)
  - [Q02 · 四项工具实际执行了什么？](#detail-section-12)
  - [Q03 · 地址、容量和失败由谁负责？](#detail-section-13)
  - [Q04 · 怎样试用及验证路由改进？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在保留当前 DSH 主模型的同时，按需请求已安装的 Ollama 模型。

手工 Ollama CLI 或 HTTP 已能调模型；这里的增量是同一 DSH 会话里的工具入口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 对话及嵌入 | 按需使用 Ollama | 依赖可达 daemon 与匹配模型 |

**流程与依赖**

| 依赖 | 用途 | 条件 |
| --- | --- | --- |
| DSH tools | 挂载入口 | 兼容需另核 |
| Ollama daemon 与模型 | 执行请求 | 明确地址及模型能力 |

| 阶段 | 操作 | 验收 |
| --- | --- | --- |
| 试用 | tags 后试短输入 | 检查文本与维数 |
| 恢复 | 禁用并回本地 CLI | 确认实际地址 |

**效果与成本**

| 环节 | 资源 | 未知 |
| --- | --- | --- |
| 推理 | 本地计算和完整响应缓冲 | 冷/热启动及显存 |

| 结果 | 当前支持 | 待测 |
| --- | --- | --- |
| 按需调用 | 模型选择与文本或向量 | 性能、正确率与数据范围 |

> **思考**：WSL 默认地址是启发式，实际请求可走配置的非本地端点；主会话也仍可能使用云模型。[Q01](#research-q01) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：让会话按需调用本地模型而无需切换主 provider；工具分别暴露探测、生成与向量结果。[Q01](#research-q01) [Q02](#research-q02)

API 请求集中，status 与推理区分；地址推断不做探测，输入限制依调用形态变化。

<a id="detail-section-5"></a>

### 1.4 主要限制

WSL 默认地址是启发式，实际请求可走配置的非本地端点；主会话也仍可能使用云模型。[Q01](#research-q01) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先固定可信本地地址，用短文本确认结果；路由或宿主数据范围不清时回本地 CLI。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持请求映射；真实设备、daemon API 兼容、路由和性能待验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定源码。未启动真实 daemon、模型、DSH 或代理。
- 下一步：在同一固定模型核对空结果、超时、显式地址与 WSL 自动地址。

**分析版本**

- **仓库**：[173787247/dsh-wsl-ollama](https://github.com/173787247/dsh-wsl-ollama)
- **版本号**：0.2.0（[固定提交 53991c1](https://github.com/173787247/dsh-wsl-ollama/tree/53991c1eccd5ad3e97dd60e65ded678e61b38fe7)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

让操作者确认实际选路，并在多种 WSL 网络模式中对照错连率和首次响应。未验证。[Q04](#research-q04)

在同一固定模型核对空结果、超时、显式地址与 WSL 自动地址。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 120 | — | — | 594 |
| .js | source | 2 | 275 | 255 | 8 | — |
| .js | test | 1 | 61 | 57 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-ollama/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-ollama/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-ollama/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 能否按需调用指定 Ollama 模型，并由操作者辨认路线和本地数据边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何时用 Ollama 工具而不是更换主模型？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

使用 DSH 的工程师若已有 Ollama 模型，希望在同一会话里单独委派短文本或取一个向量，可先查看 daemon 已安装模型再调用。成功标准是指定模型返回有效文本或维数符合预期，主会话 provider 不改变。相比 curl，插件提供模型工具参数及结果；相比直接把 Ollama 配成主模型，它适用于偶尔调用而非整体离线。主代理仍可能由云端提供，工具入参和返回可能参与其上下文；使用本地 daemon 不等于全流程本地。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-21](https://github.com/173787247/dsh-wsl-ollama/blob/53991c1eccd5ad3e97dd60e65ded678e61b38fe7/README.md#L5-L21)

作者描述本地调用和 Windows/WSL 地址问题。

<details>
<summary>查看原文（17行）</summary>

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
````

</details>

**依据 2 · 源码核查**：[index.js:19-38](https://github.com/173787247/dsh-wsl-ollama/blob/53991c1eccd5ad3e97dd60e65ded678e61b38fe7/index.js#L19-L38)

提示区分辅助调用与主代理。

<details>
<summary>查看原文（20行）</summary>

```text
  ctx.systemPrompt.section({
    name: "tool:ollama",
    order: 128,
    text: "dsh-wsl-ollama talks to a local Ollama daemon (default http://127.0.0.1:11434). Use ollama_status/list before chat. Prefer local models for offline or private prompts; cloud Flash stays the default agent brain unless you choose otherwise.",
  });

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
```

</details>

#### 缺口

- 未验证工具结果在目标宿主的模型上下文呈现。
  **影响**：无法确认端到端隐私。
  **进一步探讨**：用匿名标记核对宿主日志和工具结果链。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 四项工具实际执行了什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

启用后创建 HTTP 客户端并注册 status、list、chat、embed。status/list 请求 /api/tags，status 失败返回可达性及提示。chat 向 /api/chat 发送明确模型和消息列表，stream:false，等待完整 JSON；embed 调 /api/embeddings，从 embedding 或 embeddings 第一项取向量并记录维数。工具结构化值带向量，但 render 只呈现维数及模型，不能假定任何调用方都可直接拿到向量。错误由工具封成 ok:false；空向量仍可作为 ok:true 返回，调用方应核维数。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:6-24](https://github.com/173787247/dsh-wsl-ollama/blob/53991c1eccd5ad3e97dd60e65ded678e61b38fe7/index.js#L6-L24)

禁用与配置入口。

<details>
<summary>查看原文（19行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/client.js:75-101](https://github.com/173787247/dsh-wsl-ollama/blob/53991c1eccd5ad3e97dd60e65ded678e61b38fe7/lib/client.js#L75-L101)

状态与模型目录取自 tags。

<details>
<summary>查看原文（27行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/client.js:104-137](https://github.com/173787247/dsh-wsl-ollama/blob/53991c1eccd5ad3e97dd60e65ded678e61b38fe7/lib/client.js#L104-L137)

chat 与 embed 请求和响应。

<details>
<summary>查看原文（34行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[index.js:104-119](https://github.com/173787247/dsh-wsl-ollama/blob/53991c1eccd5ad3e97dd60e65ded678e61b38fe7/index.js#L104-L119)

向量在文字渲染中省略。

<details>
<summary>查看原文（16行）</summary>

```text
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
```

</details>

#### 缺口

- 未运行不同 daemon API 版本。
  **影响**：兼容性与调用方如何取结构化向量未知。
  **进一步探讨**：固定模型及版本检查正常回复、缺模型和空向量。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 地址、容量和失败由谁负责？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

显式配置优先，其次读取环境；WSL 情况猜 resolv.conf 第一个 nameserver 为 Windows 主机，最后才返回 loopback。不是先探测 localhost 再切换。该 nameserver 可能只是 DNS 转发，需操作者确认。HTTP 请求不添加认证头，也无本地目的地校验；任意配置地址会收到提示或文本。跨主机监听不能仅靠工具保证访问范围。单 prompt 和 embed 输入被裁剪，直接 messages 数组及 system 文字未用同一上限，响应整段读入。模型加载、显存、并发与长输入由 daemon 或操作者负责，超时不会证明推理已经停止。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:5-21](https://github.com/173787247/dsh-wsl-ollama/blob/53991c1eccd5ad3e97dd60e65ded678e61b38fe7/lib/client.js#L5-L21)

地址推断的确切顺序。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/client.js:43-67](https://github.com/173787247/dsh-wsl-ollama/blob/53991c1eccd5ad3e97dd60e65ded678e61b38fe7/lib/client.js#L43-L67)

fetch 请求、认证头缺省及超时。

<details>
<summary>查看原文（25行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/client.js:104-133](https://github.com/173787247/dsh-wsl-ollama/blob/53991c1eccd5ad3e97dd60e65ded678e61b38fe7/lib/client.js#L104-L133)

消息与两种文本输入的裁剪不同。

<details>
<summary>查看原文（30行）</summary>

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
```

</details>

#### 缺口

- 未量化本地推理及网络负担。
  **影响**：无法估计冷启动、硬件容量和超时恢复。
  **进一步探讨**：同模型记录冷/热启动、长输入和取消后的实际资源变化。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用及验证路由改进？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先在隔离 Profile 明确配置本地 daemon 地址，确认 tags 再用非敏感短输入验证 chat 和预期嵌入维数。网络不可达、向量为空或无法确保材料只送信任路径时禁用工具，回到直接本地 CLI。后续可加有限地址探测及明确的选路说明，要求切换目标由操作者确认，再比较默认推断与显式确认在 WSL NAT、镜像网络和 Linux daemon 下的错误连接率；若它不降低错连，或把已固定的地址错误替换，就不采用。尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:5-21](https://github.com/173787247/dsh-wsl-ollama/blob/53991c1eccd5ad3e97dd60e65ded678e61b38fe7/lib/client.js#L5-L21)

现有环境与推断规则可做对照。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/client.js:75-88](https://github.com/173787247/dsh-wsl-ollama/blob/53991c1eccd5ad3e97dd60e65ded678e61b38fe7/lib/client.js#L75-L88)

status 有可达结果和失败提示。

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

#### 缺口

- 缺多网络模式对照。
  **影响**：只能支持受控试用。
  **进一步探讨**：用隔离样本分别验证显式配置和自动推断。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
