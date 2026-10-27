# dsh-wsl-hostsvc

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[ef261f7](https://github.com/173787247/dsh-wsl-hostsvc/tree/ef261f7a5d03f4beae08bd250f980941903e6304)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-hostsvc)
<!-- END META -->

> **实现功能**：从WSL探测Windows侧本地模型服务，输出可达地址、模型API状态、上下文提示和配置片段。

> **核心亮点**：把WSL宿主发现、常见服务探测、HTTP模型状态和配置草稿合在DSH工具中，较手工nc/curl减少切换，并区分TCP开放与models API状态。集成价值不等于新探测算法。详见[Q02](#research-q02)。

> **风险与缺陷**：主ok、建议URL和模板仍可由TCP开放触发，apiReady不代表生成可用；固定模板容量、元数据回退和未传播取消信号限制诊断可信度，均为静态判断未复现。详见[Q02](#research-q02)和[Q04](#research-q04)。

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
  - [Q01 · 谁需要此诊断，输入如何成为服务与配置建议？](#detail-section-11)
  - [Q02 · 相对手工探测有何增量，关键误判来自哪里？](#detail-section-12)
  - [Q03 · WSL、宿主服务与安装条件怎样影响启动和恢复？](#detail-section-13)
  - [Q04 · 首次、持续与失败恢复的成本和效果怎样判断？](#detail-section-14)
  - [Q05 · 哪些设计可复用，怎样检验分层诊断收据的新方向？](#detail-section-15)
  - [Q06 · 谁适合试用，哪些情况必须停止依赖建议？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：帮助在WSL连接Windows本地模型的开发者集中排查IP、端口和API问题，交付诊断线索与配置草稿而非自动修复。

原有流程是手工查WSL/Windows地址、用TCP与HTTP命令定位、读取模型列表并编辑settings。插件集中线索，保留服务端和实际生成验收责任。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| host_reach | WSL到Windows常见本地模型端口诊断 | 仅WSL，TCP开放不等于生成可用 |
| 模型与上下文信息 | 查看Ollama及OpenAI模型端点 | 部分设置为行解析，容量回退需核对 |
| provider草稿 | 输出可粘贴baseURL与YAML | 模型ID及容量仍需人工替换 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18、DSH工具与提示服务 | 启动必需 | 加载host_reach与指引 | 无法正常注册 |
| WSL环境 | 操作必需 | 允许Windows宿主诊断 | 非WSL明确拒绝 |
| Windows本地模型服务和网络可达性 | 目标必需 | TCP/HTTP探测 | 仅返回关闭或API失败 |
| PowerShell互操作 | 宿主IP回退可选 | resolv.conf无候选时读取IPv4 | 返回空候选，仍尝试默认地址 |
| settings.yaml和准确模型配置 | 对照可选、采用配置必需 | 上下文/默认模型检查 | 无记录或解析失败时信息不完整 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认允许探测目标服务，保留现有设置副本 | 服务、端口和监听范围已知 |
| 加载 | 用户安装固定包，重启并使用新会话 | host_reach可用且识别WSL |
| 诊断 | 选择明确profile/host，读TCP与API分别结果 | 错端口不被当作模型可用 |
| 配置/恢复 | 用户核对模型ID和容量再粘贴，失败回退原设置 | 真正生成任务另作验收，插件不自动写配置 |

作者建议监听0.0.0.0只是可能的网络修复，读者还需自行判断暴露范围和访问控制，不能机械照抄。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主与本地模型机器资源，插件增量金额未知 | 安装、确认WSL和网络模式、设置备份 | 不启动模型生成，不代表模型部署无成本 |
| 持续使用 | 顺序TCP/HTTP请求与少量本地读取 | 判断分层结果，替换占位模型和容量 | 缺少诊断耗时与成功率样本 |
| 失败恢复 | 重复探测和服务排障 | 核查防火墙、端口身份并恢复原配置 | 外层超时不保证内部工作同步停止 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 减少手工拼接 | 集中IP、端口、models与配置提示 | 定位成功率和节省的人时 |
| 区分TCP/API | 404等HTTP状态单独记录 | 模型生成、认证及流式是否可用 |
| 避免容量误配 | 比较设置与所取num_ctx | 元数据回退是否等于实际运行容量 |

配套本地模型和GPU成本属于环境，当前材料不支持金额或ROI估算。应记录整个排障任务的失败重试与手工修正后再比较收益。

> **思考**：主ok、建议URL和模板仍可由TCP开放触发，apiReady不代表生成可用；固定模板容量、元数据回退和未传播取消信号限制诊断可信度，均为静态判断未复现。详见[Q02](#research-q02)和[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把WSL宿主发现、常见服务探测、HTTP模型状态和配置草稿合在DSH工具中，较手工nc/curl减少切换，并区分TCP开放与models API状态。集成价值不等于新探测算法。详见[Q02](#research-q02)。

把WSL宿主发现、常见服务探测、HTTP模型状态和配置草稿合在DSH工具中，较手工nc/curl减少切换，并区分TCP开放与models API状态。集成价值不等于新探测算法。详见[Q02](#research-q02)。

可复用的设计是把探测核心与DSH注册分开、HTTP helper支持注入fetchFn、对HTTP状态和模型ID形成结构结果，并把undefined显式转null以满足lossless JSON。测试对404分层和容量对照有具体断言，但本轮只读，不能称运行通过。共享wsl-host注明来自kit的同步副本，复用时应保留上游归属和同步责任。

<a id="detail-section-5"></a>

### 1.4 主要限制

主ok、建议URL和模板仍可由TCP开放触发，apiReady不代表生成可用；固定模板容量、元数据回退和未传播取消信号限制诊断可信度，均为静态判断未复现。详见[Q02](#research-q02)和[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合有WSL到Windows本地模型连接问题且能手工检查设置的人试用，先限单服务，YAML当草稿；API或容量不符、探测取消失控就停止依赖建议。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为源码支持的分层诊断与配置提示集成；实际生成可用性与排障收益未证实。进一步分层诊断收据为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/hostsvc.js、lib/providers.js、lib/wsl-host.js、test/hostsvc.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取固定版本入口、探测、provider、WSL helper和测试定义；不执行网络诊断、模型请求、目标测试或宿主冒烟。
- 下一步：进一步探讨可从错误端口、401、models成功但生成失败和慢响应夹具入手，比较分层诊断与模板误配置，记录取消后的实际活动和总排障时间。

**分析版本**

- **仓库**：[173787247/dsh-wsl-hostsvc](https://github.com/173787247/dsh-wsl-hostsvc)
- **版本号**：0.4.3（[固定提交 ef261f7](https://github.com/173787247/dsh-wsl-hostsvc/tree/ef261f7a5d03f4beae08bd250f980941903e6304)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索分层诊断收据，仅按已完成的TCP、API、认证和授权生成检查给相应强度建议，并统一预算和取消；新增请求与GPU负担，尚未验证。详见[Q05](#research-q05)。

进一步探讨可从错误端口、401、models成功但生成失败和慢响应夹具入手，比较分层诊断与模板误配置，记录取消后的实际活动和总排障时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 232 | — | — | 1516 |
| .js | source | 4 | 820 | 751 | 19 | — |
| .js | test | 1 | 152 | 140 | 5 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-hostsvc/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-hostsvc/issues?q=is%3Aissue+created%3A2026-09-22T04%3A47%3A36.102Z..2026-10-22T04%3A47%3A36.102Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-hostsvc/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A47%3A36.102Z..2026-10-22T04%3A47%3A36.102Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查WSL到Windows模型服务诊断的分层准确性、集成增量与采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要此诊断，输入如何成为服务与配置建议？

**研究主题**：场景与需求、功能与机制

#### 完整回答

适用对象是在WSL运行DSH、希望连接Windows侧本地模型的开发者。常见困难是localhost、NAT宿主IP与监听接口混淆，以及端口可达后仍不能生成。输入为服务profile、可选port/hosts与是否显示provider模板，交付物是逐host端口结果、API状态、模型ID、上下文差异及建议，不是自动修复后的可用模型。

工具加载时检测WSL，非WSL返回明确错误。执行先从resolv.conf取nameserver作为候选，必要时用固定PowerShell查Windows IPv4，与loopback和host.docker.internal形成默认集合；对服务和host顺序TCP探测。首个开放地址成为服务URL，之后读取Ollama tags/ps/show或OpenAI models。另读~/.dsh/settings.yaml做轻量行解析并对照num_ctx，最终构造可粘贴YAML和提示。合格诊断需区分TCP、HTTP、模型元数据和最终生成，不把建议URL当完成配置。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:36-55](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/README.md#L36-L55)

作者定义目标服务和输出材料。

<details>
<summary>查看原文（20行）</summary>

```text
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

**依据 2 · 源码核查**：[index.js:7-29](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/index.js#L7-L29)

WSL门控、系统提示与工具接线。

<details>
<summary>查看原文（23行）</summary>

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();

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

**依据 3 · 源码核查**：[lib/hostsvc.js:209-250](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/lib/hostsvc.js#L209-L250)

候选地址、顺序TCP探测及Ollama信息读取。

<details>
<summary>查看原文（42行）</summary>

```text
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
  }

  const openServices = services.filter((s) => s.open);
  const primary = openServices[0];

  let ollamaModels = [];
  let ollamaLoaded = [];
  let ollamaPsOk = null;
  let ollamaPsError = "";
  const ollamaSvc = openServices.find((s) => s.id === "ollama");
  if (ollamaSvc?.suggestedBaseURL) {
    ollamaModels = await fetchOllamaModelNames(ollamaSvc.suggestedBaseURL);
    const ps = await fetchOllamaPs(ollamaSvc.suggestedBaseURL);
    ollamaPsOk = ps.ok;
    ollamaPsError = ps.error || "";
    ollamaLoaded = ps.models || [];
```

</details>

**依据 4 · 源码核查**：[lib/hostsvc.js:253-281](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/lib/hostsvc.js#L253-L281)

设置读取和上下文对照。

<details>
<summary>查看原文（29行）</summary>

```text
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
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 相对手工探测有何增量，关键误判来自哪里？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是把WSL宿主发现、四种常见服务端口、HTTP模型列表和配置提示放进同一DSH工具结果，减少手工查IP、nc/curl、模型列表和配置片段之间的切换。源码明确将HTTP404标成tcpOpen而apiNotReady，比单看端口亮灯更有诊断价值。它没有发聊天生成请求，因此“apiReady”仅是模型列表端点的2xx及JSON读取，不是认证、流式生成、工具调用或上下文容量验收。

关键限制是主结果ok和suggestedBaseURL仍只依赖任一TCP端口开放，provider模板也从openServices生成，未过滤apiReady。错误进程占据常用端口时，读者仍可能得到貌似可粘贴的配置。模板模型ID是REPLACE_WITH占位符，contextWindow/maxTokens为固定默认，不自动采用探测实值。Ollama show回落model_info的context_length可能是模型理论长度而非运行num_ctx，不能无条件解释为实际上下文。对照设置采用行扫描而非完整YAML解析，多provider同模型ID或复杂语法也可能歧义。以上是静态条件风险，未复现。

#### 证据与依据

**依据 1 · 源码核查**：[lib/hostsvc.js:227-238](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/lib/hostsvc.js#L227-L238)

服务URL和主选择只依据TCP开放。

<details>
<summary>查看原文（12行）</summary>

```text
    services.push({
      id: spec.id,
      label: spec.label,
      port: spec.port,
      open: Boolean(hit),
      host: hit?.host || "",
      suggestedBaseURL: hit ? `http://${hit.host}:${spec.port}${spec.path}` : "",
    });
  }

  const openServices = services.filter((s) => s.open);
  const primary = openServices[0];
```

</details>

**依据 2 · 源码核查**：[lib/hostsvc.js:285-308](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/lib/hostsvc.js#L285-L308)

API结果与provider模板生成使用不同条件。

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

**依据 3 · 源码核查**：[lib/providers.js:2-33](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/lib/providers.js#L2-L33)

模板模型占位符和固定上下文值。

<details>
<summary>查看原文（32行）</summary>

```text
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

**依据 4 · 源码核查**：[lib/providers.js:230-240](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/lib/providers.js#L230-L240)

num_ctx缺失会回落模型元数据。

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[lib/providers.js:324-354](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/lib/providers.js#L324-L354)

apiReady以models响应状态和JSON读取定义。

<details>
<summary>查看原文（31行）</summary>

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
```

</details>

#### 缺口

- 未量化不同WSL网络模式、认证服务器和错误端口下建议的准确率。
  **影响**：不能把诊断便利写成配置成功率提升。
  **进一步探讨**：可用已知服务身份的端口夹具，对照TCP、models和生成三个层级的结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · WSL、宿主服务与安装条件怎样影响启动和恢复？

**研究主题**：依赖、兼容与流程

#### 完整回答

插件包无外部运行依赖列表，入口需要DSH tools与systemPrompt服务，Node声明>=18。真正生效依赖WSL、可达Windows服务和正确网络/防火墙设置；PowerShell只是宿主IP探测回退而非每次都必需。它读取设置文件但不写入，也不自动打开端口或修改防火墙。提示中提到gpu_doctor/net_doctor等配套工具，当前包没有定义这些工具，不能作为已安装能力。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18、DSH工具与提示服务 | 启动必需 | 加载host_reach与指引 | 无法正常注册 |
| WSL环境 | 操作必需 | 允许Windows宿主诊断 | 非WSL明确拒绝 |
| Windows本地模型服务和网络可达性 | 目标必需 | TCP/HTTP探测 | 仅返回关闭或API失败 |
| PowerShell互操作 | 宿主IP回退可选 | resolv.conf无候选时读取IPv4 | 返回空候选，仍尝试默认地址 |
| settings.yaml和准确模型配置 | 对照可选、采用配置必需 | 上下文/默认模型检查 | 无记录或解析失败时信息不完整 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认允许探测目标服务，保留现有设置副本 | 服务、端口和监听范围已知 |
| 加载 | 用户安装固定包，重启并使用新会话 | host_reach可用且识别WSL |
| 诊断 | 选择明确profile/host，读TCP与API分别结果 | 错端口不被当作模型可用 |
| 配置/恢复 | 用户核对模型ID和容量再粘贴，失败回退原设置 | 真正生成任务另作验收，插件不自动写配置 |

作者建议监听0.0.0.0只是可能的网络修复，读者还需自行判断暴露范围和访问控制，不能机械照抄。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:14-21](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/package.json#L14-L21)

ESM和Node要求。

```text
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "test": "node --test test/*.test.js"
  },
```

**依据 2 · 源码核查**：[lib/wsl-host.js:21-41](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/lib/wsl-host.js#L21-L41)

WSL识别和固定PowerShell执行。

<details>
<summary>查看原文（21行）</summary>

```text
export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) return true;
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
  }
}

export function distroName({ env = process.env } = {}) {
  return env.WSL_DISTRO_NAME || "WSL";
}

export async function runPowerShell(script, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("powershell.exe");
  const { stdout, stderr } = await execFileAsync(
    bin,
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { timeout: timeoutMs, windowsHide: true, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
  return { stdout: String(stdout ?? ""), stderr: String(stderr ?? "") };
```

</details>

**依据 3 · 源码核查**：[lib/hostsvc.js:170-192](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/lib/hostsvc.js#L170-L192)

宿主IP发现回退。

<details>
<summary>查看原文（23行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/hostsvc.js:253-267](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/lib/hostsvc.js#L253-L267)

只读settings且解析失败回退空映射。

<details>
<summary>查看原文（15行）</summary>

```text
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
```

</details>

**依据 5 · 作者声明**：[README.md:90-96](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/README.md#L90-L96)

作者使用和监听调整建议。

```text
WSL UI from Windows browser: use kit `scripts/restart-dsh-web.sh` and open **http://127.0.0.1:3081/** (relay; dsh itself binds `127.0.0.1:3080` only).

## Usage

Ask the agent to run `host_reach` (`profile: ollama|lmstudio|vllm|llama|all`, optional `port`, `includeProviders`).

If nothing opens: on Windows bind beyond loopback (e.g. `OLLAMA_HOST=0.0.0.0:11434`) or enable WSL mirrored networking, then re-probe.
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续与失败恢复的成本和效果怎样判断？

**研究主题**：效果与总成本

#### 完整回答

合格任务是一项连接故障被正确定位到网络、API或模型配置层，而非找到一个开放端口。代码顺序执行服务×host的TCP探测，每个默认1.5秒；后续HTTP和PowerShell也各有独立超时。入口声明默认15秒工具预算，但execute没有接收或传播宿主exec.signal，所有阶段总时长可超过这个外层预算，取消是否停止网络工作取决于宿主而非本函数。不能把单个超时当作端到端完成时限。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主与本地模型机器资源，插件增量金额未知 | 安装、确认WSL和网络模式、设置备份 | 不启动模型生成，不代表模型部署无成本 |
| 持续使用 | 顺序TCP/HTTP请求与少量本地读取 | 判断分层结果，替换占位模型和容量 | 缺少诊断耗时与成功率样本 |
| 失败恢复 | 重复探测和服务排障 | 核查防火墙、端口身份并恢复原配置 | 外层超时不保证内部工作同步停止 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 减少手工拼接 | 集中IP、端口、models与配置提示 | 定位成功率和节省的人时 |
| 区分TCP/API | 404等HTTP状态单独记录 | 模型生成、认证及流式是否可用 |
| 避免容量误配 | 比较设置与所取num_ctx | 元数据回退是否等于实际运行容量 |

配套本地模型和GPU成本属于环境，当前材料不支持金额或ROI估算。应记录整个排障任务的失败重试与手工修正后再比较收益。

#### 证据与依据

**依据 1 · 源码核查**：[lib/hostsvc.js:140-155](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/lib/hostsvc.js#L140-L155)

每个TCP探测默认1.5秒。

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

**依据 2 · 源码核查**：[index.js:25-29](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/index.js#L25-L29)

外层预算与execute不接收信号的静态边界。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

**依据 3 · 源码核查**：[lib/hostsvc.js:220-226](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/lib/hostsvc.js#L220-L226)

服务/host串行探测。

```text
  for (const spec of servicesSpec) {
    let hit = null;
    for (const host of hosts) {
      const t = await probe(host, spec.port);
      targets.push({ ...t, service: spec.id });
      if (t.open && !hit) hit = t;
    }
```

**依据 4 · 源码核查**：[lib/providers.js:243-250](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/lib/providers.js#L243-L250)

Ollama show独立超时。

```text
export async function fetchOllamaShow(baseURL, model, { timeoutMs = 4000, fetchFn = fetch } = {}) {
  const root = String(baseURL).replace(/\/v1\/?$/, "");
  try {
    const res = await fetchFn(`${root}/api/show`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: model }),
      signal: AbortSignal.timeout(timeoutMs),
```

#### 缺口

- 缺少真实多目标慢失败时的端到端耗时与取消行为。
  **影响**：不能确认15秒预算与内部活动一致，也不能计算单位排障成本。
  **进一步探讨**：可从不可达host集合和延迟HTTP夹具入手，观察工具结束后连接是否继续以及人工定位时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些设计可复用，怎样检验分层诊断收据的新方向？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可复用的设计是把探测核心与DSH注册分开、HTTP helper支持注入fetchFn、对HTTP状态和模型ID形成结构结果，并把undefined显式转null以满足lossless JSON。测试对404分层和容量对照有具体断言，但本轮只读，不能称运行通过。共享wsl-host注明来自kit的同步副本，复用时应保留上游归属和同步责任。

由Q02/Q04可推导未验证的“分层诊断收据”假设。每项候选若分别保留地址来源、TCP、模型列表、认证和可选生成探测状态，并只在对应层达标时生成相应强度的配置建议，可能减少“端口通就能用”的误读。现版本已有tcpOpen/apiReady基础，新增是建议门槛和全链预算/取消，而非再堆探测。代价是可选生成会占模型/GPU资源并需用户明确授权，认证处理也有秘密边界。最小对照可用错误进程、401、200空列表、有效列表但生成失败等夹具，比较现有模板与分层建议的误配置率、操作时间和请求成本；若不能降低误配置或额外负担超过收益，就不应采用。

#### 证据与依据

**依据 1 · 源码核查**：[test/hostsvc.test.js:93-116](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/test/hostsvc.test.js#L93-L116)

静态断言覆盖容量和404，不扩写成当前通过。

<details>
<summary>查看原文（24行）</summary>

```text
  it("parses ollama num_ctx and settings contextWindow", () => {
    assert.equal(parseOllamaNumCtx({ parameters: "num_ctx 32768\nnum_gpu 99" }), 32768);
    const map = parseSettingsContextWindows(`
llm-pi-ai:
  providers:
    ollama:
      models:
        - id: qwen38-27b-local
          contextWindow: 131072
`);
    assert.equal(map["qwen38-27b-local"], 131072);
    assert.equal(compareCtx(131072, 8192).ctxMatch, "mismatch");
    assert.equal(compareCtx(8192, 8192).ctxMatch, "ok");
    assert.equal(compareCtx(null, 8192).ctxMatch, "unknown");
  });

  it("marks http 404 as tcpOpen but not apiReady", async () => {
    const result = await fetchOpenAiModels("http://127.0.0.1:8000/v1", {
      fetchFn: async () => ({ ok: false, status: 404, json: async () => ({}) }),
    });
    assert.equal(result.tcpOpen, true);
    assert.equal(result.apiReady, false);
    assert.equal(result.httpStatus, 404);
    assert.equal(result.error, "http_404");
```

</details>

**依据 2 · 源码核查**：[lib/hostsvc.js:158-167](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/lib/hostsvc.js#L158-L167)

lossless输出转换。

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

**依据 3 · 源码核查**：[lib/wsl-host.js:1-4](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/lib/wsl-host.js#L1-L4)

共享模块的kit同步归属。

```text
// Canonical copy — sync to plugins via dsh-wsl-kit/scripts/sync-wsl-common.mjs
import { existsSync, readFileSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
```

**依据 4 · 源码核查**：[lib/providers.js:324-354](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/lib/providers.js#L324-L354)

现有HTTP状态字段是进一步分层的起点。

<details>
<summary>查看原文（31行）</summary>

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
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 谁适合试用，哪些情况必须停止依赖建议？

**研究主题**：采用判断

#### 完整回答

在WSL中确有Windows本地模型连接问题、能手工核对配置的开发者适合小范围试用。先选单个已知服务和允许探测的host，分别检查TCP、HTTP模型列表和实际模型ID；YAML只当草稿，替换占位值、核对上下文并保留回退副本。当前推荐trial，因为诊断集成有用且不自动写设置，但不能证明生成服务可用。

若工具把错误进程的开放端口当作可用baseURL、容量建议与实际运行不符、外层取消后仍长时间探测，或需要通过扩大网络暴露才能勉强工作，应停止照搬建议并回到服务端及网络配置核对。系统提示中的云模型速度建议是作者启发式，不能升级为跨硬件模型推荐。边界依据Q02，超时与恢复成本依据Q04。

#### 证据与依据

**依据 1 · 源码核查**：[lib/hostsvc.js:306-328](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/lib/hostsvc.js#L306-L328)

模板和启发式建议不自动配置，且存在网络暴露建议。

<details>
<summary>查看原文（23行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/providers.js:46-67](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/lib/providers.js#L46-L67)

模板模型和容量字段须人工替换。

<details>
<summary>查看原文（22行）</summary>

```text
export function buildProviderBlock(id, baseURL, meta = PROVIDER_META[id]) {
  if (!meta || !baseURL) return null;
  return {
    id,
    baseURL,
    apiKeyEnv: meta.apiKeyEnv,
    displayName: meta.displayName,
    yaml: [
      `    ${id}:`,
      `      displayName: ${meta.displayName}`,
      `      apiKeyEnv: ${meta.apiKeyEnv}`,
      `      api: openai-completions`,
      `      baseURL: ${baseURL}`,
      `      compat:`,
      `        supportsDeveloperRole: false`,
      `        maxTokensField: max_tokens`,
      `      models:`,
      `        - id: ${meta.defaultModel}`,
      `          name: ${meta.displayName}`,
      `          contextWindow: ${meta.contextWindow}`,
      `          maxTokens: ${meta.maxTokens}`,
    ].join("\n"),
```

</details>

**依据 3 · 源码核查**：[index.js:11-15](https://github.com/173787247/dsh-wsl-hostsvc/blob/ef261f7a5d03f4beae08bd250f980941903e6304/index.js#L11-L15)

系统提示含固定模型与配套工具建议。

```text
  ctx.systemPrompt.section({
    name: "tool:host_reach",
    order: 114,
    text: "Use host_reach to probe Windows-host local LLMs from WSL (Ollama 11434, LM Studio 1234, vLLM 8000, llama-server 8080). Paste providerSnippets into ~/.dsh/settings.yaml under llm-pi-ai.providers; keep contextWindow ≤ Ollama n_ctx. If local chat is slow or idle-times out, switch the session to deepseek-flash and run gpu_doctor for VRAM. Follow connectivityPlaybook when HTTPS or DNS also fails.",
  });
```

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
