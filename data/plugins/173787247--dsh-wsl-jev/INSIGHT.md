# dsh-wsl-jev

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[1684b4f](https://github.com/173787247/dsh-wsl-jev/tree/1684b4f10d2709b5880bb77a29045a009bf44f94)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-jev)
<!-- END META -->

> **功能**：为 DSH 接入 TypeSafe Jev 的结构化问答、证据核对与候选排序。

> **亮点**：给 DSH 一组固定类型的判断入口，调用方可直接复核标签和候选，不必从散文抽取。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：脱敏只识别有限键名和形状，证据可能重复出现在未限长的题目中，不能据此传敏感内容。[Q03](#research-q03)

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
  - [Q01 · 结构化判断服务什么任务？](#detail-section-11)
  - [Q02 · 调用如何接通并映射回结果？](#detail-section-12)
  - [Q03 · 脱敏和超时是否覆盖完整外发？](#detail-section-13)
  - [Q04 · 怎样试验比当前方法更容易复核？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用预设判据核对主张、回答标签或从若干候选中选一项。

人或规则可直接核对明确条件；通用模型也可生成结构化结果，需自行约束输出。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Jev 判断 | 核对标签和候选 | 远端凭据及非敏感授权材料 |

**流程与依赖**

| 依赖 | 用途 | 条件 |
| --- | --- | --- |
| DSH tools | 挂载工具 | 按目标宿主核对 |
| 远端密钥及路线 | 结构化判断 | 仅非敏感授权数据 |

| 阶段 | 操作 | 检查 |
| --- | --- | --- |
| 试用 | 状态后跑合成材料 | 复核标签及候选 |
| 退出 | 移除凭据或禁用插件 | 回人工 |

**效果与成本**

| 阶段 | 资源 | 待测 |
| --- | --- | --- |
| 每次请求 | 外部调用与响应等待 | 实际费用、尾延迟 |

| 结果 | 支持 | 待测 |
| --- | --- | --- |
| 结构化结果 | 标签及候选映射 | 正确率和复核时间 |

> **思考**：脱敏只识别有限键名和形状，证据可能重复出现在未限长的题目中，不能据此传敏感内容。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：给 DSH 一组固定类型的判断入口，调用方可直接复核标签和候选，不必从散文抽取。[Q01](#research-q01) [Q02](#research-q02)

请求类型和返回映射分层，方便定位输入输出；回复标签、错误输出与脱敏仍需边界验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

脱敏只识别有限键名和形状，证据可能重复出现在未限长的题目中，不能据此传敏感内容。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用非敏感材料作为辅助核对；外发不获准或标签不能复核时停用。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持工具入口、问题构造和外发路径；正确率、服务契约和实际用量尚未验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/tools.js、cordis.patch.yml、index.js、lib/client.js、lib/redact.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根包、工具、数据和代理调用源码。未调用远端或读取实际凭据。
- 下一步：记录真实请求范围、标签与人工对照，并区分服务拒绝、超时和空答案。

**分析版本**

- **仓库**：[173787247/dsh-wsl-jev](https://github.com/173787247/dsh-wsl-jev)
- **版本号**：0.2.0（[固定提交 1684b4f](https://github.com/173787247/dsh-wsl-jev/tree/1684b4f10d2709b5880bb77a29045a009bf44f94)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

用证据引用与响应校验减少外发，在人工标签集上测误判、外发字符和复核时长。尚未验证。[Q04](#research-q04)

记录真实请求范围、标签与人工对照，并区分服务拒绝、超时和空答案。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 215 | — | — | 907 |
| .js | source | 5 | 706 | 619 | 41 | — |
| .js | test | 1 | 120 | 115 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-jev/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 使用者能否在限定外发内容的前提下，用结构化判断作为一项可核对的辅助结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 结构化判断服务什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

代码评审或证据核对中，需要反复将材料映射为是非、选择或评分的人，可向 Jev 提供小段依据和固定判据。比通用对话少从散文解析标签的步骤，比直接规则适合语义匹配，但需要另一模型且其置信度不等于已验证事实。合格结果是标签与给定证据一致，并可用独立答案复核。可用明确规则判定的任务仍宜用规则，人保留最终复核。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:30-37](https://github.com/173787247/dsh-wsl-jev/blob/1684b4f10d2709b5880bb77a29045a009bf44f94/README.md#L30-L37)

作者区分状态、提问、核对和排序。

```text
## 工具

| 工具 | 作用 |
|------|------|
| `jev_status` | provider / endpoint / 是否有 key / 代理 |
| `jev_ask` | 对 `state` 提 typed 问题 |
| `jev_check` | 单题 noul：证据是否支持 claim |
| `jev_rank` | 从候选里选最贴合 query 的一项 |
```

**依据 2 · 源码核查**：[lib/tools.js:20-52](https://github.com/173787247/dsh-wsl-jev/blob/1684b4f10d2709b5880bb77a29045a009bf44f94/lib/tools.js#L20-L52)

核对与排序使用预定义类型和标准。

<details>
<summary>查看原文（33行）</summary>

```text
export function buildCheckQuestions({ claim, evidence } = {}) {
  const c = String(claim || "").trim();
  if (!c) throw new Error("jev_check: claim is required");
  const ev = evidence == null ? "" : typeof evidence === "string" ? evidence : JSON.stringify(evidence);
  return {
    supported: {
      type: "noul",
      instructions: `Is the following claim supported by the evidence?\nClaim: ${c}${ev ? `\nEvidence:\n${ev}` : ""}`,
      criteria: {
        true: "The evidence supports the claim.",
        false: "The evidence does not support the claim, or evidence is missing.",
      },
    },
  };
}

export function buildRankQuestions({ query, candidates } = {}) {
  const q = String(query || "").trim();
  if (!q) throw new Error("jev_rank: query is required");
  const list = Array.isArray(candidates) ? candidates.map(String) : [];
  if (list.length < 2) throw new Error("jev_rank: need at least 2 candidates");
  if (list.length > 32) throw new Error("jev_rank: at most 32 candidates");
  const criteria = {};
  for (let i = 0; i < list.length; i++) {
    const key = `c${i}`;
    criteria[key] = list[i];
  }
  return {
    best: {
      type: "choice",
      instructions: `Which candidate best matches this query?\nQuery: ${q}`,
      criteria,
    },
```

</details>

#### 缺口

- 无同批任务标签对照。
  **影响**：无法估计误判或复核时间。
  **进一步探讨**：让人工及通用模型独立判同一匿名样本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 调用如何接通并映射回结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Profile patch 挂载后注册工具。状态只读配置，不发探测请求。问答规范化类型，核对把 claim/evidence 填进题目，排序按 c0… 键为候选生成选择题，返回时映回文本。客户端自动模式优先 OpenRouter key，否则 TypeSafe；固定 HTTPS endpoint 收 JSON POST，Bearer 取进程配置。成功时直接使用 JSON answers 或空对象，未见按题逐项核验响应类型；未知排序键不映为候选，置信度仍是上游值。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-10](https://github.com/173787247/dsh-wsl-jev/blob/1684b4f10d2709b5880bb77a29045a009bf44f94/cordis.patch.yml#L1-L10)

默认挂载及参数。

<details>
<summary>查看原文（10行）</summary>

```text
- insert:
    - id: dsh-wsl-jev
      name: dsh-wsl-jev
      config:
        enabled: true
        # provider: auto | openrouter | typesafe
        provider: auto
        model: jev-latest
        timeoutMs: 15000
        maxStateChars: 16000
```

</details>

**依据 2 · 源码核查**：[index.js:42-60](https://github.com/173787247/dsh-wsl-jev/blob/1684b4f10d2709b5880bb77a29045a009bf44f94/index.js#L42-L60)

status 返回本地状态。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.tools.register({
    name: "jev_status",
    description: "Show dsh-wsl-jev provider, endpoint, whether an API key is set, and proxy status (no secrets).",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {},
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: formatStatus(v) }],
    },
    timeoutMs: 5_000,
    isConcurrencySafe: () => true,
    async execute() {
      return client.status();
    },
    presentCall: () => ({ card: "generic", title: "Jev status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "Jev status", content: r.content }),
```

</details>

**依据 3 · 源码核查**：[lib/client.js:63-104](https://github.com/173787247/dsh-wsl-jev/blob/1684b4f10d2709b5880bb77a29045a009bf44f94/lib/client.js#L63-L104)

POST 和响应解析。

<details>
<summary>查看原文（42行）</summary>

```text
      const safeState = prepareState(state, maxStateChars);
      const safeQuestions = redactValue(questions);
      const body = {
        model,
        state: safeState,
        questions: safeQuestions,
      };

      const started = Date.now();
      const res = await fetchImpl(resolved.endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resolved.apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "HTTP-Referer": "https://github.com/173787247/dsh-wsl-jev",
          "X-OpenRouter-Title": "dsh-wsl-jev",
        },
        body: JSON.stringify(body),
        timeoutMs,
        env,
      });
      const latencyMs = Date.now() - started;
      const text = await res.text();
      let json;
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`dsh-wsl-jev: non-JSON response HTTP ${res.status}: ${text.slice(0, 200)}`);
      }
      if (!res.ok) {
        const err = json?.error?.message || json?.message || json?.error || text.slice(0, 200);
        throw new Error(`dsh-wsl-jev: HTTP ${res.status}: ${err}`);
      }
      return {
        ok: true,
        provider: resolved.provider,
        model: json.model || model,
        answers: json.answers || {},
        usage: json.usage || null,
        id: json.id || null,
        latencyMs,
```

</details>

**依据 4 · 源码核查**：[lib/client.js:110-136](https://github.com/173787247/dsh-wsl-jev/blob/1684b4f10d2709b5880bb77a29045a009bf44f94/lib/client.js#L110-L136)

自动和显式凭据选择。

<details>
<summary>查看原文（27行）</summary>

```text
export function resolveProvider(provider, env = process.env) {
  const p = String(provider || "auto").toLowerCase().trim();
  const orKey = str(env.OPENROUTER_API_KEY);
  const tsKey = str(env.TYPESAFE_API_KEY || env.TYPESAFE_KEY);

  if (p === "openrouter") {
    return {
      provider: "openrouter",
      endpoint: OPENROUTER_SYSTEMONE,
      apiKey: orKey,
    };
  }
  if (p === "typesafe") {
    return {
      provider: "typesafe",
      endpoint: TYPESAFE_SYSTEMONE,
      apiKey: tsKey,
    };
  }
  // auto
  if (orKey) {
    return { provider: "openrouter", endpoint: OPENROUTER_SYSTEMONE, apiKey: orKey };
  }
  if (tsKey) {
    return { provider: "typesafe", endpoint: TYPESAFE_SYSTEMONE, apiKey: tsKey };
  }
  return { provider: "none", endpoint: OPENROUTER_SYSTEMONE, apiKey: "" };
```

</details>

**依据 5 · 源码核查**：[lib/tools.js:103-116](https://github.com/173787247/dsh-wsl-jev/blob/1684b4f10d2709b5880bb77a29045a009bf44f94/lib/tools.js#L103-L116)

排序键映回候选的边界。

<details>
<summary>查看原文（14行）</summary>

```text
/** Map rank choice key back to candidate text. */
export function resolveRankPick(answers, candidates) {
  const pick = answers?.best;
  const key = pick?.choice ?? pick?.value ?? null;
  const list = Array.isArray(candidates) ? candidates.map(String) : [];
  if (key == null) return { key: null, text: null, confidence: pick?.confidence ?? null };
  const m = /^c(\d+)$/.exec(String(key));
  const idx = m ? Number(m[1]) : -1;
  return {
    key: String(key),
    text: idx >= 0 && idx < list.length ? list[idx] : null,
    confidence: pick?.confidence ?? null,
    raw: pick,
  };
```

</details>

#### 缺口

- 外部响应未运行。
  **影响**：不能确认真实模型兼容或异常覆盖。
  **进一步探讨**：用固定公开小样本核对成功、错误和空答案。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 脱敏和超时是否覆盖完整外发？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

没有密钥会在网络前拒绝，配置状态的 ready 只表示有 key。发出前按键名和有限形状递归替换，但 check 的 evidence 已嵌入 instructions 字符串，普通客户名、内部路径和不匹配的密钥仍可能原样外发。maxStateChars 只裁 state，不约束 questions；重复嵌入的文本仍可发出。错误信息可带服务正文片段，工具返回的 claim 和 candidates 也沿用调用入参。需要可信凭据和可达的外部服务；额外调用引入等待、用量和独立服务失败。未测价格，不能把本地状态视为成功。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:34-68](https://github.com/173787247/dsh-wsl-jev/blob/1684b4f10d2709b5880bb77a29045a009bf44f94/lib/client.js#L34-L68)

有 key 仅指可尝试发请求，脱敏针对请求体。

<details>
<summary>查看原文（35行）</summary>

```text
    status() {
      const hasKey = Boolean(resolved.apiKey);
      return {
        ok: true,
        provider: resolved.provider,
        endpoint: resolved.endpoint,
        hasKey,
        model,
        proxy: Boolean(resolveProxyUrl(env)),
        proxyMode: proxyLabel(env),
        timeoutMs,
        maxStateChars,
        egress: hasKey ? "ON when tools called" : "blocked (no API key)",
        ready: hasKey,
        hint: hasKey
          ? null
          : "No API key — set OPENROUTER_API_KEY or TYPESAFE_API_KEY (see examples/dsh-wsl-jev.env.example). Tools stay registered but jev_ask/check/rank will refuse until a key is present.",
      };
    },
    async systemOne({ state, questions }) {
      if (!resolved.apiKey) {
        throw new Error(
          "dsh-wsl-jev: no API key — set OPENROUTER_API_KEY or TYPESAFE_API_KEY (see examples/dsh-wsl-jev.env.example)",
        );
      }
      if (!questions || typeof questions !== "object" || !Object.keys(questions).length) {
        throw new Error("dsh-wsl-jev: questions object is required");
      }

      const safeState = prepareState(state, maxStateChars);
      const safeQuestions = redactValue(questions);
      const body = {
        model,
        state: safeState,
        questions: safeQuestions,
```

</details>

**依据 2 · 源码核查**：[lib/redact.js:3-35](https://github.com/173787247/dsh-wsl-jev/blob/1684b4f10d2709b5880bb77a29045a009bf44f94/lib/redact.js#L3-L35)

键与字符串规则范围。

<details>
<summary>查看原文（33行）</summary>

```text
const SENSITIVE_KEY =
  /^(password|passwd|secret|token|api[_-]?key|authorization|auth|access[_-]?token|refresh[_-]?token|private[_-]?key|client[_-]?secret)$/i;

const SECRET_SHAPES = [
  /\bBearer\s+[A-Za-z0-9._\-+/=]{20,}\b/gi,
  /\bsk-[A-Za-z0-9]{20,}\b/g,
  /\bsk-or-[A-Za-z0-9_-]{20,}\b/g,
  /\bts_live_[A-Za-z0-9_-]{20,}\b/g,
  /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/g,
  /\bxapp-[A-Za-z0-9-]{20,}\b/g,
  /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/g,
  /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
];

export function redactString(text) {
  let s = String(text ?? "");
  for (const re of SECRET_SHAPES) {
    s = s.replace(re, "[REDACTED]");
  }
  return s;
}

export function redactValue(value) {
  if (value == null) return value;
  if (typeof value === "string") return redactString(value);
  if (Array.isArray(value)) return value.map(redactValue);
  if (typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = SENSITIVE_KEY.test(k) ? "[REDACTED]" : redactValue(v);
    }
    return out;
```

</details>

**依据 3 · 源码核查**：[lib/client.js:139-146](https://github.com/173787247/dsh-wsl-jev/blob/1684b4f10d2709b5880bb77a29045a009bf44f94/lib/client.js#L139-L146)

长度限制只用于 state。

```text
function prepareState(state, maxStateChars) {
  if (state == null) return "";
  if (typeof state === "string") {
    return truncateChars(redactValue(state), maxStateChars);
  }
  const redacted = redactValue(state);
  const raw = JSON.stringify(redacted);
  return truncateChars(raw, maxStateChars);
```

**依据 4 · 源码核查**：[lib/tools.js:20-31](https://github.com/173787247/dsh-wsl-jev/blob/1684b4f10d2709b5880bb77a29045a009bf44f94/lib/tools.js#L20-L31)

证据进入 instructions。

<details>
<summary>查看原文（12行）</summary>

```text
export function buildCheckQuestions({ claim, evidence } = {}) {
  const c = String(claim || "").trim();
  if (!c) throw new Error("jev_check: claim is required");
  const ev = evidence == null ? "" : typeof evidence === "string" ? evidence : JSON.stringify(evidence);
  return {
    supported: {
      type: "noul",
      instructions: `Is the following claim supported by the evidence?\nClaim: ${c}${ev ? `\nEvidence:\n${ev}` : ""}`,
      criteria: {
        true: "The evidence supports the claim.",
        false: "The evidence does not support the claim, or evidence is missing.",
      },
```

</details>

**依据 5 · 源码核查**：[index.js:131-139](https://github.com/173787247/dsh-wsl-jev/blob/1684b4f10d2709b5880bb77a29045a009bf44f94/index.js#L131-L139)

工具回显原始 claim。

```text
    async execute(args) {
      try {
        const questions = buildCheckQuestions(args);
        const state = [args.claim, args.evidence].filter(Boolean).join("\n\n");
        const out = await client.systemOne({ state, questions });
        return { ...out, claim: args.claim };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
```

#### 缺口

- 未验证服务留存、价格和完整请求时延。
  **影响**：无法判断敏感场景可用或成本。
  **进一步探讨**：在本地替代网络用合成标记审查发出字节，再单独核实授权服务条款。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试验比当前方法更容易复核？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先在隔离 Profile 用非敏感合成样本做辅助判断，记录人工标签、错误和多一次请求的时长。无 key、外发不获许可、响应不匹配或结果有分歧时回到人工或规则。可试验让请求题目引用压缩后的证据 ID 而非重复整段材料，并在输入预览后校验响应标签。对比现有实现的外发字符、漏匹配和复核耗时；若证据删减使误判增多或标注维护超过节省，就不成立。此方案未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tools.js:20-31](https://github.com/173787247/dsh-wsl-jev/blob/1684b4f10d2709b5880bb77a29045a009bf44f94/lib/tools.js#L20-L31)

重复材料路径可作为对照。

<details>
<summary>查看原文（12行）</summary>

```text
export function buildCheckQuestions({ claim, evidence } = {}) {
  const c = String(claim || "").trim();
  if (!c) throw new Error("jev_check: claim is required");
  const ev = evidence == null ? "" : typeof evidence === "string" ? evidence : JSON.stringify(evidence);
  return {
    supported: {
      type: "noul",
      instructions: `Is the following claim supported by the evidence?\nClaim: ${c}${ev ? `\nEvidence:\n${ev}` : ""}`,
      criteria: {
        true: "The evidence supports the claim.",
        false: "The evidence does not support the claim, or evidence is missing.",
      },
```

</details>

**依据 2 · 源码核查**：[lib/client.js:97-104](https://github.com/173787247/dsh-wsl-jev/blob/1684b4f10d2709b5880bb77a29045a009bf44f94/lib/client.js#L97-L104)

现有输出保留 usage 供记录。

```text
      return {
        ok: true,
        provider: resolved.provider,
        model: json.model || model,
        answers: json.answers || {},
        usage: json.usage || null,
        id: json.id || null,
        latencyMs,
```

#### 缺口

- 缺真实复核对照。
  **影响**：只支持非敏感辅助试验。
  **进一步探讨**：先在小样本记录正确性及失败，避免影响正式判定。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
