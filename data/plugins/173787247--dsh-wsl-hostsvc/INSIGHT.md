# dsh-wsl-hostsvc

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[ccf36d6](https://github.com/173787247/dsh-wsl-hostsvc/tree/ccf36d6cf39de4b6749009149011a22abef1d9fc)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-hostsvc)
<!-- END META -->

> **功能**：从WSL探测本地模型端口和models API，对照Ollama容量与设置并给provider草稿，不生成或自动改配置。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将host发现、常用端口、模型API/容量与草稿汇成工具，HTTP层失败可见；模型/网络能力归环境，不算新诊断算法。

> **主要限制**：[Q03](#research-q03) 主ok/URL/模板仍可TCP触发，apiReady非生成；元数据回退/固定模板非真实runner容量，顺序探测缺总deadline/取消，自定义host非仅Windows。

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
  - [Q01 · 本地模型连接诊断比手工nc/curl增加什么？](#detail-section-11)
  - [Q02 · TCP、HTTP、settings和草稿怎样串起来？](#detail-section-12)
  - [Q03 · ok、apiReady和ctxMatch到底支持多强建议？](#detail-section-13)
  - [Q04 · 怎样试用诊断，验证分层收据有何净价值？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者排WSL到Windows本地模型连接/容量问题，需分TCP/API/生成，不把诊断草稿当已修复。

手工IP/nc/curl、模型日志与拼YAML；集成提供一致线索，不新增模型部署/推理能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| host/TCP探测 | 定位可达端口 | 首开放非服务认证，自定义可远端 |
| models状态 | 区分API与TCP | 无认证header，不证生成 |
| Ollama容量对照 | 提醒context配置 | 前3模型、元数据/正则非runner真相 |
| provider草稿 | 少手拼YAML | TCP触发、固定容量/占位需人改 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/prompt、Node>=18 | 必需 | 注册/网络helper | 宿主取消兼容未验 |
| WSL/host发现 | 必需 | 环境与候选IP | nameserver非身份认证 |
| 可达模型服务/防火墙 | 实际诊断必需 | TCP/API层 | open不等目标服务 |
| settings/实际模型容量 | 按需 | 对照与草稿修正 | 元数据/正则非运行验收 |
| 可信host与明确权限 | 采用前提 | 限网络探测范围 | 代码不强制仅本机 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 单可信host/服务，备份settings | 可先关草稿 |
| 诊断 | 分TCP/API/模型ID/容量 | 不能只主ok |
| 配置 | 人工替换占位及核运行ctx | 不直接放大监听/容量 |
| 验收 | 授权后真实小请求 | 生成/流式另证 |
| 退出 | 停工具恢复配置/监听 | unknown/cancel先查仍在工作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本地模型/GPU/宿主 | 网络模式/权限与备份 | 环境金额未知 |
| 持续 | 顺序TCP/HTTP/读取/模型结果 | 分层判断/ID容量核对 | 总耗时与成功率未测 |
| 失败恢复 | 重探与服务排障 | 核防火墙/端口/原配置 | tool超时不证明内部停止 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 集中线索 | IP/TCP/models与模板 | 排障成功率/节省人工 |
| TCP/API区分 | HTTP状态和ids显式 | 认证/生成/流式可用 |
| 容量提示 | settings对show数字 | 实际runner容量/全默认模型覆盖 |

> **思考**：[Q03](#research-q03) 主ok/URL/模板仍可TCP触发，apiReady非生成；元数据回退/固定模板非真实runner容量，顺序探测缺总deadline/取消，自定义host非仅Windows。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将host发现、常用端口、模型API/容量与草稿汇成工具，HTTP层失败可见；模型/网络能力归环境，不算新诊断算法。

[Q02](#research-q02) 核心/注册分层、fetch注入、HTTP状态和lossless可借鉴；[Q03](#research-q03) 成功语义与建议门槛对齐，容量来源/错误层应保真，公共helper保留kit归属。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 主ok/URL/模板仍可TCP触发，apiReady非生成；元数据回退/固定模板非真实runner容量，顺序探测缺总deadline/取消，自定义host非仅Windows。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 能核设置者限单可信服务试，草稿非自动修复；API/运行容量不符或取消不可控则停依赖建议，回服务日志/nc/curl，恢复原配置。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

重读固定入口、hostsvc、provider关键链和公共宿主函数，复核全部正式findings；未网络/模型请求、目标测试或宿主验收。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/hostsvc.js、lib/providers.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定hostsvc及providers探测/模板/容量/设置关键链、入口/README/package/公共host函数；不全审所有playbook/套件工具或实际模型系统。
- 下一步：[Q04](#research-q04) 错端口/401/404/生成失败/容量差异/取消分层对照，授权后才实际生成，本轮未执行。

**分析版本**

- **仓库**：[173787247/dsh-wsl-hostsvc](https://github.com/173787247/dsh-wsl-hostsvc)
- **版本号**：0.4.3（[固定提交 ccf36d6](https://github.com/173787247/dsh-wsl-hostsvc/tree/ccf36d6cf39de4b6749009149011a22abef1d9fc)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证分层收据与统一预算/取消，以每层实证限制建议强度，授权生成有新增资源负担，不能把已有apiReady重复算增量。

[Q04](#research-q04) 错端口/401/404/生成失败/容量差异/取消分层对照，授权后才实际生成，本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 232 | — | — | 1516 |
| .js | source | 4 | 820 | 751 | 19 | — |
| .js | test | 1 | 152 | 140 | 5 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-hostsvc/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：本地模型连接诊断各层能支持什么建议，如何限定成本与采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 本地模型连接诊断比手工nc/curl增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

host_reach面向WSL里的DSH连接Windows本地Ollama/LM Studio/vLLM/llama-server失败，集中host候选、TCP、models状态和provider草稿。不是Windows系统服务管理，不启动/停模型、不自动写settings、不运行生成验证；云模型和套件GPU/网络工具仅建议分工，不归本包能力。

相对手工查resolv.conf、nc/curl和拼YAML，组合减少切换并披露TCP开放不等API ready。合格结果应定位哪个层失败、正确服务/模型与容量，并经过真实会话核验；一个开放端口或models列表不能证明模型能生成、认证/流式和长上下文可用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-11](https://github.com/173787247/dsh-wsl-hostsvc/blob/ccf36d6cf39de4b6749009149011a22abef1d9fc/README.md#L5-L11)

作者定位与TCP/API区别。

```text
DeepSeek Harness plugin: from **WSL**, probe **Windows-host** OpenAI-compatible LLM servers and suggest a reachable `baseURL`.

[中文说明 → README.zh.md](./README.zh.md)

## Where it sits

From WSL, probes Windows-side Ollama, LM Studio, vLLM, and llama-server. TCP open is not the same as API ready.
```

**依据 2 · 作者声明**：[README.md:34-55](https://github.com/173787247/dsh-wsl-hostsvc/blob/ccf36d6cf39de4b6749009149011a22abef1d9fc/README.md#L34-L55)

端口和输出范围。

<details>
<summary>查看原文（22行）</summary>

```text
**Scope:** local OpenAI-compatible servers on the Windows host (`host_reach`). Does not configure cloud DeepSeek; for V4.1 Flash set model id **`deepseek-flash`** in settings.

## What it does

Tool **`host_reach`** (default `profile=all`) probes:

| id | Port | Typical server |
|----|------|----------------|
| `ollama` | 11434 | Ollama |
| `lmstudio` | 1234 | LM Studio local server |
| `vllm` | 8000 | vLLM OpenAI server |
| `llama` | 8080 | llama-server / Unsloth Desktop |

Hosts tried: `127.0.0.1`, `localhost`, `host.docker.internal`, and the Windows IP from `/etc/resolv.conf`.

### Outputs worth pasting

- **`suggestedBaseURL`** / per-service URLs → `llm-pi-ai.providers.*.baseURL` (keep `/v1`)
- **`providerSnippets.yaml`** → paste under `llm-pi-ai.providers` in `~/.dsh/settings.yaml`
- **`ollamaModels`** → exact ids from `ollama list` / `/api/tags`
- **`connectivityPlaybook`** → ordered tools when HTTPS/DNS also fail
- **hints** → Ollama `n_ctx` vs settings `contextWindow`, Unsloth Desktop vs Studio, VRAM
```

</details>

**依据 3 · 源码核查**：[index.js:11-29](https://github.com/173787247/dsh-wsl-hostsvc/blob/ccf36d6cf39de4b6749009149011a22abef1d9fc/index.js#L11-L29)

注册host_reach及执行。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.systemPrompt.section({
    name: "tool:host_reach",
    order: 114,
    text: "Use host_reach to probe Windows-host local LLMs from WSL (Ollama 11434, LM Studio 1234, vLLM 8000, llama-server 8080). Paste providerSnippets into ~/.dsh/settings.yaml under llm-pi-ai.providers; keep contextWindow ≤ Ollama n_ctx. If local chat is slow or idle-times out, switch the session to deepseek-flash and run gpu_doctor for VRAM. Follow connectivityPlaybook when HTTPS or DNS also fails.",
  });

  ctx.tools.register({
    name: "host_reach",
    description: "Probe Windows-host Ollama / LM Studio / vLLM / llama-server from WSL; suggest OpenAI-compatible baseURL.",
    parameters: core.parameters(config),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · TCP、HTTP、settings和草稿怎样串起来？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

WSL门控后，发现host先读resolv.conf nameserver，未取到才PowerShell首非Loopback/vEthernet/WSL IPv4；候选127.0.0.1、localhost、host.docker.internal和该IP去重，显式hosts可替换且不限本机。按profile常见端口或custom，逐服务逐host顺序TCP1.5秒，记录全部目标、首开放host构成http /v1 URL；没有先验证端口属于该LLM。

Ollama开放才读tags/ps，前3模型show，读取~/.dsh/settings.yaml并用行正则取model/context/default，不回整份设置。其他三服务读/v1/models，记录HTTP状态、apiReady和ids；custom仅TCP不跟models。各HTTP helper独立AbortSignal.timeout，入口不接exec.signal，整个顺序流程无总预算。

模板以TCP openServices生成，替换模型ID和固定容量待用户处理；toLossless递归undefined→null维持宿主JSON兼容。探测/建议与DSH注册分层、fetch可注入、保留HTTP错误有可复用价值，但不是新探测算法。

#### 证据与依据

**依据 1 · 源码核查**：[lib/hostsvc.js:140-155](https://github.com/173787247/dsh-wsl-hostsvc/blob/ccf36d6cf39de4b6749009149011a22abef1d9fc/lib/hostsvc.js#L140-L155)

TCP限时与关闭socket。

<details>
<summary>查看原文（16行）</summary>

```text
function probe(host, port, timeoutMs = 1500) {
  return new Promise((resolve) => {
    const sock = createConnection({ host, port });
    const done = (open, error = "") => {
      try {
        sock.destroy();
      } catch {
        /* ignore */
      }
      resolve({ host, port, open, error: error || "" });
    };
    sock.setTimeout(timeoutMs);
    sock.on("connect", () => done(true, ""));
    sock.on("timeout", () => done(false, "timeout"));
    sock.on("error", (err) => done(false, err.message || "error"));
  });
```

</details>

**依据 2 · 源码核查**：[lib/hostsvc.js:170-234](https://github.com/173787247/dsh-wsl-hostsvc/blob/ccf36d6cf39de4b6749009149011a22abef1d9fc/lib/hostsvc.js#L170-L234)

host发现/候选/自定义与顺序探测。

<details>
<summary>查看原文（65行）</summary>

```text
async function windowsHostIp() {
  try {
    const resolv = readFileSync("/etc/resolv.conf", "utf8");
    const m = resolv.match(/^nameserver\s+(\S+)/m);
    if (m) return m[1];
  } catch {
    /* ignore */
  }
  try {
    const { stdout } = await runPowerShell(
      "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback|vEthernet|WSL' } | Select-Object -First 1 -ExpandProperty IPAddress)",
      { timeoutMs: 10_000 },
    );
    const ip = stdout
      .trim()
      .split(/\r?\n/)
      .map((s) => s.trim())
      .find(Boolean);
    if (ip) return ip;
  } catch {
    /* ignore */
  }
  return "";
}

function resolvePorts(args) {
  const profile = typeof args?.profile === "string" ? args.profile : "all";

  if (profile === "custom" || (args?.profile == null && Number.isInteger(args?.port))) {
    const port = Number.isInteger(args?.port) ? args.port : 11434;
    return [{ id: "custom", label: `port ${port}`, port, path: "/v1" }];
  }
  if (profile !== "all" && SERVICE_PORTS[profile]) {
    const s = SERVICE_PORTS[profile];
    return [{ id: profile, ...s }];
  }
  return Object.entries(SERVICE_PORTS).map(([id, s]) => ({ id, ...s }));
}

export async function execute(args) {
  const includeProviders = args?.includeProviders !== false;
  const servicesSpec = resolvePorts(args);
  const winIp = await windowsHostIp();
  const defaults = ["127.0.0.1", "localhost", "host.docker.internal", winIp].filter(Boolean);
  const hosts = Array.isArray(args?.hosts) && args.hosts.length
    ? args.hosts.map(String)
    : [...new Set(defaults)];

  const targets = [];
  const services = [];
  for (const spec of servicesSpec) {
    let hit = null;
    for (const host of hosts) {
      const t = await probe(host, spec.port);
      targets.push({ ...t, service: spec.id });
      if (t.open && !hit) hit = t;
    }
    services.push({
      id: spec.id,
      label: spec.label,
      port: spec.port,
      open: Boolean(hit),
      host: hit?.host || "",
      suggestedBaseURL: hit ? `http://${hit.host}:${spec.port}${spec.path}` : "",
    });
```

</details>

**依据 3 · 源码核查**：[lib/hostsvc.js:244-308](https://github.com/173787247/dsh-wsl-hostsvc/blob/ccf36d6cf39de4b6749009149011a22abef1d9fc/lib/hostsvc.js#L244-L308)

models/settings/容量和模板实际链。

<details>
<summary>查看原文（65行）</summary>

```text
  const ollamaSvc = openServices.find((s) => s.id === "ollama");
  if (ollamaSvc?.suggestedBaseURL) {
    ollamaModels = await fetchOllamaModelNames(ollamaSvc.suggestedBaseURL);
    const ps = await fetchOllamaPs(ollamaSvc.suggestedBaseURL);
    ollamaPsOk = ps.ok;
    ollamaPsError = ps.error || "";
    ollamaLoaded = ps.models || [];
  }

  let settingsMap = {};
  let defaultProvider = "";
  let defaultModel = "";
  const settingsPath = join(homedir(), ".dsh", "settings.yaml");
  try {
    if (existsSync(settingsPath)) {
      const yamlText = readFileSync(settingsPath, "utf8");
      settingsMap = parseSettingsContextWindows(yamlText);
      const dm = parseDefaultModel(yamlText);
      defaultProvider = dm.provider || "";
      defaultModel = dm.model || "";
    }
  } catch {
    settingsMap = {};
  }

  const ctxReports = [];
  if (ollamaSvc?.suggestedBaseURL && ollamaModels.length) {
    const probeModels = ollamaModels.slice(0, 3);
    for (const model of probeModels) {
      const show = await fetchOllamaShow(ollamaSvc.suggestedBaseURL, model);
      const settingsCw = settingsMap[model] ?? null;
      const cmp = compareCtx(settingsCw, show.numCtx);
      ctxReports.push({
        model,
        ...cmp,
        showOk: show.ok,
        showError: show.error || "",
      });
    }
  }

  const openAiModels = [];
  const openAiNotes = [];
  for (const s of openServices.filter((x) => x.id === "vllm" || x.id === "llama" || x.id === "lmstudio")) {
    if (!s.suggestedBaseURL) continue;
    const models = await fetchOpenAiModels(s.suggestedBaseURL);
    openAiModels.push({ service: s.id, ...models });
    if (models.apiReady && models.ids.length) {
      openAiNotes.push(
        `${s.id} /v1/models ok (${models.ids.slice(0, 5).join(", ")}). Use these ids in providerSnippets.`,
      );
    } else if (models.tcpOpen && !models.apiReady) {
      const statusHint =
        models.httpStatus === 404
          ? "HTTP 404 — port open but not an OpenAI /v1 service (wrong process or path); run docker_doctor / check who owns the port."
          : `API not ready (${models.error || `http_${models.httpStatus}`}); port open ≠ models API — try docker_doctor.`;
      openAiNotes.push(`${s.id}: ${statusHint}`);
    } else if (!models.ok) {
      openAiNotes.push(`${s.id} /v1/models failed (${models.error}) — TCP may be closed; re-probe or docker_doctor.`);
    }
  }

  const providerSnippets = includeProviders
    ? buildProviderSnippets(openServices.filter((s) => s.id !== "custom"))
    : { yaml: "", blocks: [] };
```

</details>

**依据 4 · 源码核查**：[lib/hostsvc.js:158-167](https://github.com/173787247/dsh-wsl-hostsvc/blob/ccf36d6cf39de4b6749009149011a22abef1d9fc/lib/hostsvc.js#L158-L167)

lossless转换。

<details>
<summary>查看原文（10行）</summary>

```text
/** Deep-replace undefined with null so dsh lossless JSON accepts the tool result. */
export function toLossless(value) {
  if (value === undefined) return null;
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(toLossless);
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    out[k] = toLossless(v);
  }
  return out;
```

</details>

**依据 5 · 源码核查**：[lib/providers.js:324-356](https://github.com/173787247/dsh-wsl-hostsvc/blob/ccf36d6cf39de4b6749009149011a22abef1d9fc/lib/providers.js#L324-L356)

HTTP/API分层和独立timeout。

<details>
<summary>查看原文（33行）</summary>

```text
export async function fetchOpenAiModels(baseURL, { timeoutMs = 3000, fetchFn = fetch } = {}) {
  const root = String(baseURL).replace(/\/$/, "");
  const url = root.endsWith("/v1") ? `${root}/models` : `${root}/v1/models`;
  try {
    const res = await fetchFn(url, { signal: AbortSignal.timeout(timeoutMs) });
    const httpStatus = Number(res.status) || 0;
    const apiReady = httpStatus >= 200 && httpStatus < 300;
    if (!apiReady) {
      return {
        ok: false,
        tcpOpen: true,
        apiReady: false,
        httpStatus,
        ids: [],
        error: `http_${httpStatus}`,
        url,
      };
    }
    const data = await res.json();
    const ids = (data.data || []).map((m) => m.id).filter(Boolean);
    return { ok: true, tcpOpen: true, apiReady: true, httpStatus, ids, error: "", url };
  } catch (err) {
    return {
      ok: false,
      tcpOpen: false,
      apiReady: false,
      httpStatus: 0,
      ids: [],
      error: err instanceof Error ? err.message : String(err),
      url,
    };
  }
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · ok、apiReady和ctxMatch到底支持多强建议？

**研究主题**：缺陷与关键质疑

#### 完整回答

主ok只看至少一个TCP开放，suggestedBaseURL和模板也按开放触发，即使404/401或错进程仍可能给可粘贴草稿。models helper确实区分http/API，并在文本显示apiNotReady，是重要反证；但没有Authorization header，受保护服务可能401不能当服务坏。apiReady只2xx加可解析列表，不证明目标模型可生成或流式。解析JSON/数据形状异常catch标tcpOpen=false，也不能覆盖前面TCP开放事实。

Ollama num_ctx先读parameters，缺失回model_info/details中的context_length/num_ctx，这可能是理论元数据非当前runner运行容量；ctxMatch比较本地配置数字不等真实运行有效。只取tags前3，未必默认模型，settings用行正则且不按provider区分同名ID；模板仍固定8192/32768/131072和占位ID，不能照抄视作自动校准。

显式hosts不限本机、nameserver也未认证Windows身份；listen 0.0.0.0建议改变暴露面，应按防火墙/网络单独审查，插件不自动更改。外层15秒与TCP/多HTTP累计等待独立，取消未传可继续探测；未运行复现，不写实际扫描越权或取消失败。

#### 证据与依据

**依据 1 · 源码核查**：[lib/hostsvc.js:306-338](https://github.com/173787247/dsh-wsl-hostsvc/blob/ccf36d6cf39de4b6749009149011a22abef1d9fc/lib/hostsvc.js#L306-L338)

模板/建议和主ok均由TCP。

<details>
<summary>查看原文（33行）</summary>

```text
  const providerSnippets = includeProviders
    ? buildProviderSnippets(openServices.filter((s) => s.id !== "custom"))
    : { yaml: "", blocks: [] };

  const advice = [
    "Point llm-pi-ai providers.*.baseURL at a suggestedBaseURL below (keep the /v1 suffix).",
    "If only the Windows host IP works: set OLLAMA_HOST=0.0.0.0:11434 (or the app's 'listen on all interfaces') then re-probe.",
    "WSL mirrored networking may make 127.0.0.1 reach Windows; classic NAT often needs the resolv.conf nameserver IP.",
    "Do not run Ollama + vLLM + llama-server on the same GPU at once unless you know VRAM headroom — run gpu_doctor.",
    "See examples/local-llm-providers.settings.yaml in this repo for full snippets.",
    ...collectServiceHints(openServices, { ollamaModels, ctxReports, openAiNotes }),
    ...buildLocalSessionAdvice({
      ollamaOpen: Boolean(ollamaSvc),
      ollamaLoaded,
      ctxReports,
      defaultModel,
    }),
  ];
  if (!openServices.length) {
    advice.unshift("No probed local LLM port is reachable from WSL yet.");
  }
  if (!Object.keys(settingsMap).length) {
    advice.push(`No contextWindow entries parsed from ${settingsPath} (missing file or no model ids yet).`);
  }

  return toLossless({
    ok: openServices.length > 0,
    error: "",
    windowsHostIp: winIp || "",
    hostsTried: hosts,
    services,
    targets,
    suggestedBaseURL: primary?.suggestedBaseURL || "",
```

</details>

**依据 2 · 源码核查**：[lib/providers.js:1-33](https://github.com/173787247/dsh-wsl-hostsvc/blob/ccf36d6cf39de4b6749009149011a22abef1d9fc/lib/providers.js#L1-L33)

固定容量与占位模型。

<details>
<summary>查看原文（33行）</summary>

```text
/** Provider metadata and paste-ready YAML for ~/.dsh/settings.yaml */
export const PROVIDER_META = {
  ollama: {
    displayName: "Local Ollama (Windows)",
    apiKeyEnv: "OLLAMA_API_KEY",
    dummyKey: "ollama",
    defaultModel: "REPLACE_WITH_ollama_list_NAME",
    contextWindow: 8192,
    maxTokens: 8192,
  },
  lmstudio: {
    displayName: "LM Studio (Windows)",
    apiKeyEnv: "LMSTUDIO_API_KEY",
    dummyKey: "lmstudio",
    defaultModel: "REPLACE_WITH_LMSTUDIO_MODEL_ID",
    contextWindow: 32768,
    maxTokens: 8192,
  },
  vllm: {
    displayName: "vLLM (Docker / WSL)",
    apiKeyEnv: "VLLM_API_KEY",
    dummyKey: "vllm",
    defaultModel: "REPLACE_WITH_VLLM_SERVED_MODEL",
    contextWindow: 131072,
    maxTokens: 8192,
  },
  llama: {
    displayName: "llama-server / Unsloth Desktop",
    apiKeyEnv: "LLAMA_API_KEY",
    dummyKey: "llama",
    defaultModel: "REPLACE_WITH_LLAMA_SERVER_MODEL",
    contextWindow: 131072,
    maxTokens: 8192,
```

</details>

**依据 3 · 源码核查**：[lib/providers.js:230-255](https://github.com/173787247/dsh-wsl-hostsvc/blob/ccf36d6cf39de4b6749009149011a22abef1d9fc/lib/providers.js#L230-L255)

show元数据回退。

<details>
<summary>查看原文（26行）</summary>

```text
/** Extract num_ctx / context length from Ollama /api/show JSON. */
export function parseOllamaNumCtx(showJson) {
  if (!showJson || typeof showJson !== "object") return null;
  const params = String(showJson.parameters || "");
  const m = params.match(/\bnum_ctx\s+(\d+)/i);
  if (m) return Number(m[1]);
  const md = showJson.model_info || showJson.details || {};
  for (const [k, v] of Object.entries(md)) {
    if (/context_length|num_ctx/i.test(k) && Number.isFinite(Number(v))) return Number(v);
  }
  return null;
}

export async function fetchOllamaShow(baseURL, model, { timeoutMs = 4000, fetchFn = fetch } = {}) {
  const root = String(baseURL).replace(/\/v1\/?$/, "");
  try {
    const res = await fetchFn(`${root}/api/show`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: model }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return { ok: false, model, numCtx: null, error: `http_${res.status}` };
    const data = await res.json();
    return { ok: true, model, numCtx: parseOllamaNumCtx(data), error: "", rawParameters: data.parameters || "" };
  } catch (err) {
```

</details>

**依据 4 · 源码核查**：[lib/providers.js:270-302](https://github.com/173787247/dsh-wsl-hostsvc/blob/ccf36d6cf39de4b6749009149011a22abef1d9fc/lib/providers.js#L270-L302)

settings简化解析与unknown比较。

<details>
<summary>查看原文（33行）</summary>

```text
  const text = String(yamlText || "");
  const out = {};
  let currentId = "";
  for (const line of text.split(/\r?\n/)) {
    const idM = line.match(/^\s+-\s+id:\s*(\S+)\s*$/);
    if (idM) {
      currentId = idM[1].replace(/['"]/g, "");
      continue;
    }
    const cwM = line.match(/^\s+contextWindow:\s*(\d+)\s*$/);
    if (cwM && currentId) {
      out[currentId] = Number(cwM[1]);
      currentId = "";
    }
  }
  return out;
}

export function compareCtx(settingsCw, ollamaNumCtx) {
  const settings =
    settingsCw === null || settingsCw === undefined || settingsCw === ""
      ? null
      : Number.isFinite(Number(settingsCw))
        ? Number(settingsCw)
        : null;
  const numCtx =
    ollamaNumCtx === null || ollamaNumCtx === undefined || ollamaNumCtx === ""
      ? null
      : Number.isFinite(Number(ollamaNumCtx))
        ? Number(ollamaNumCtx)
        : null;
  if (settings === null || numCtx === null) {
    return { ctxMatch: "unknown", settingsCw: settings, ollamaNumCtx: numCtx };
```

</details>

**依据 5 · 源码核查**：[lib/providers.js:324-356](https://github.com/173787247/dsh-wsl-hostsvc/blob/ccf36d6cf39de4b6749009149011a22abef1d9fc/lib/providers.js#L324-L356)

无认证header，apiReady和catch状态。

<details>
<summary>查看原文（33行）</summary>

```text
export async function fetchOpenAiModels(baseURL, { timeoutMs = 3000, fetchFn = fetch } = {}) {
  const root = String(baseURL).replace(/\/$/, "");
  const url = root.endsWith("/v1") ? `${root}/models` : `${root}/v1/models`;
  try {
    const res = await fetchFn(url, { signal: AbortSignal.timeout(timeoutMs) });
    const httpStatus = Number(res.status) || 0;
    const apiReady = httpStatus >= 200 && httpStatus < 300;
    if (!apiReady) {
      return {
        ok: false,
        tcpOpen: true,
        apiReady: false,
        httpStatus,
        ids: [],
        error: `http_${httpStatus}`,
        url,
      };
    }
    const data = await res.json();
    const ids = (data.data || []).map((m) => m.id).filter(Boolean);
    return { ok: true, tcpOpen: true, apiReady: true, httpStatus, ids, error: "", url };
  } catch (err) {
    return {
      ok: false,
      tcpOpen: false,
      apiReady: false,
      httpStatus: 0,
      ids: [],
      error: err instanceof Error ? err.message : String(err),
      url,
    };
  }
}
```

</details>

**依据 6 · 源码核查**：[index.js:25-29](https://github.com/173787247/dsh-wsl-hostsvc/blob/ccf36d6cf39de4b6749009149011a22abef1d9fc/index.js#L25-L29)

执行不传signal。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用诊断，验证分层收据有何净价值？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

已有WSL到Windows本地模型问题且能手工核设置者可限单服务/明确可信host试，includeProviders可关；先备份settings，将输出当诊断线索与草稿。确认TCP/API/目标ID/运行容量分别成立，再手工配置并用授权真实请求验收；不因ok改监听所有网卡/加大context，也不因apiReady断言可生成。

首次有本地模型/宿主/网络模式与凭据准备，GPU/内存资源属于环境且金额未知；持续顺序TCP/HTTP与settings读/模型结果token，实际耗时未测。失败重探/服务/防火墙排错，外层超时不表示内部停；退出停工具、恢复备份并核监听配置，探测本身不写但用户照建议的变更要单独还原。API/容量不符或取消不可控应停回nc/curl及服务日志。

未验证方向是统一deadline/取消并按TCP→API→认证→授权生成层分别给收据与建议，区别现有HTTP字段不是简单再标apiReady。生成测试需同意且有GPU/token/隐私成本，默认不自动触发。对照错端口、404/401、模型列表但生成失败、元数据大于runner容量与用户取消，测误建议、修复时间和新增请求成本；若当前报告已足够或探测增加负担超过收益则不加。

#### 证据与依据

**依据 1 · 源码核查**：[lib/hostsvc.js:285-308](https://github.com/173787247/dsh-wsl-hostsvc/blob/ccf36d6cf39de4b6749009149011a22abef1d9fc/lib/hostsvc.js#L285-L308)

当前API字段与模板参照。

<details>
<summary>查看原文（24行）</summary>

```text
  const openAiModels = [];
  const openAiNotes = [];
  for (const s of openServices.filter((x) => x.id === "vllm" || x.id === "llama" || x.id === "lmstudio")) {
    if (!s.suggestedBaseURL) continue;
    const models = await fetchOpenAiModels(s.suggestedBaseURL);
    openAiModels.push({ service: s.id, ...models });
    if (models.apiReady && models.ids.length) {
      openAiNotes.push(
        `${s.id} /v1/models ok (${models.ids.slice(0, 5).join(", ")}). Use these ids in providerSnippets.`,
      );
    } else if (models.tcpOpen && !models.apiReady) {
      const statusHint =
        models.httpStatus === 404
          ? "HTTP 404 — port open but not an OpenAI /v1 service (wrong process or path); run docker_doctor / check who owns the port."
          : `API not ready (${models.error || `http_${models.httpStatus}`}); port open ≠ models API — try docker_doctor.`;
      openAiNotes.push(`${s.id}: ${statusHint}`);
    } else if (!models.ok) {
      openAiNotes.push(`${s.id} /v1/models failed (${models.error}) — TCP may be closed; re-probe or docker_doctor.`);
    }
  }

  const providerSnippets = includeProviders
    ? buildProviderSnippets(openServices.filter((s) => s.id !== "custom"))
    : { yaml: "", blocks: [] };
```

</details>

**依据 2 · 源码核查**：[lib/hostsvc.js:310-338](https://github.com/173787247/dsh-wsl-hostsvc/blob/ccf36d6cf39de4b6749009149011a22abef1d9fc/lib/hostsvc.js#L310-L338)

监听与配置建议/ok。

<details>
<summary>查看原文（29行）</summary>

```text
  const advice = [
    "Point llm-pi-ai providers.*.baseURL at a suggestedBaseURL below (keep the /v1 suffix).",
    "If only the Windows host IP works: set OLLAMA_HOST=0.0.0.0:11434 (or the app's 'listen on all interfaces') then re-probe.",
    "WSL mirrored networking may make 127.0.0.1 reach Windows; classic NAT often needs the resolv.conf nameserver IP.",
    "Do not run Ollama + vLLM + llama-server on the same GPU at once unless you know VRAM headroom — run gpu_doctor.",
    "See examples/local-llm-providers.settings.yaml in this repo for full snippets.",
    ...collectServiceHints(openServices, { ollamaModels, ctxReports, openAiNotes }),
    ...buildLocalSessionAdvice({
      ollamaOpen: Boolean(ollamaSvc),
      ollamaLoaded,
      ctxReports,
      defaultModel,
    }),
  ];
  if (!openServices.length) {
    advice.unshift("No probed local LLM port is reachable from WSL yet.");
  }
  if (!Object.keys(settingsMap).length) {
    advice.push(`No contextWindow entries parsed from ${settingsPath} (missing file or no model ids yet).`);
  }

  return toLossless({
    ok: openServices.length > 0,
    error: "",
    windowsHostIp: winIp || "",
    hostsTried: hosts,
    services,
    targets,
    suggestedBaseURL: primary?.suggestedBaseURL || "",
```

</details>

**依据 3 · 源码核查**：[lib/providers.js:230-255](https://github.com/173787247/dsh-wsl-hostsvc/blob/ccf36d6cf39de4b6749009149011a22abef1d9fc/lib/providers.js#L230-L255)

容量差异验证来源。

<details>
<summary>查看原文（26行）</summary>

```text
/** Extract num_ctx / context length from Ollama /api/show JSON. */
export function parseOllamaNumCtx(showJson) {
  if (!showJson || typeof showJson !== "object") return null;
  const params = String(showJson.parameters || "");
  const m = params.match(/\bnum_ctx\s+(\d+)/i);
  if (m) return Number(m[1]);
  const md = showJson.model_info || showJson.details || {};
  for (const [k, v] of Object.entries(md)) {
    if (/context_length|num_ctx/i.test(k) && Number.isFinite(Number(v))) return Number(v);
  }
  return null;
}

export async function fetchOllamaShow(baseURL, model, { timeoutMs = 4000, fetchFn = fetch } = {}) {
  const root = String(baseURL).replace(/\/v1\/?$/, "");
  try {
    const res = await fetchFn(`${root}/api/show`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: model }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return { ok: false, model, numCtx: null, error: `http_${res.status}` };
    const data = await res.json();
    return { ok: true, model, numCtx: parseOllamaNumCtx(data), error: "", rawParameters: data.parameters || "" };
  } catch (err) {
```

</details>

#### 缺口

- 无真实WSL网络/模型API/生成或取消与全成本对照
  **影响**：不能保证诊断成功/实际上下文/净节时
  **进一步探讨**：单可信服务核分层结果与设置，授权后才生成；记录总时间/重试/资源和恢复。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
