# dsh-wsl-gpu

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[3a682db](https://github.com/173787247/dsh-wsl-gpu/tree/3a682db355d8d1b9063b975e7a18900a4ae4aa74)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-gpu)
<!-- END META -->

> **实现功能**：汇总WSL的nvidia-smi显存数据和常见本地推理端口线索，给出静态排障提示。

> **核心亮点**：把设备和端口线索放在同一报告，减少手工收集。详见[Q01](#research-q01)。

> **风险与缺陷**：仅loopback探测可能漏Windows NAT，端口标签/争用及固定CUDA建议是启发，整体超时未向子任务传递。详见[Q03](#research-q03)。

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
  - [Q01 · GPU doctor解决什么，是否真的诊断显存争用？](#detail-section-11)
  - [Q02 · 执行链、探测范围和成功语义是什么？](#detail-section-12)
  - [Q03 · 超时、数值和硬件建议的边界有哪些？](#detail-section-13)
  - [Q04 · 工程与分阶段成本如何判断？](#detail-section-14)
  - [Q05 · 怎样采用，继续探讨从哪里开始？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本地NVIDIA推理前排查设备可见性/显存与监听服务。详见[Q01](#research-q01)。

nvidia-smi加TCP手动检查；当前是聚合报告，不是GPU资源控制。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| NVIDIA查询 | 设备/显存 | 不是框架验收 |
| TCP探测 | 监听线索 | 不是归属/协议证明 |
| 静态建议 | 排障方向 | 不执行修复 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| Node>=18/宿主tools | 执行入口 | ABI匹配 |
| nvidia-smi/驱动 | GPU数据 | PATH/权限/字段支持 |
| loopback监听 | TCP线索 | NAT/自定义端口遗漏 |
| 配套工具 | 建议排查 | 本插件不保证存在 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 调用前核范围 | 用户 | WSL/主机正确 |
| 收集报告 | gpu_doctor | query与targets分别看 |
| 核进程/模型 | 用户/外部工具 | 不靠端口标签推断 |
| 按证据处理 | 用户 | 变更另有恢复方案 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 驱动/nvidia-smi/宿主 | 核真实主机范围 | 驱动/工具和探测范围先核；准备工时未知 |
| 持续使用 | 最多两进程、八TCP及报告token | 判读顺序超时与真实主机范围 | 无远端API调用；最多两进程八TCP的实际延迟未测 |
| 失败恢复 | 无插件持久改动 | 建议引起的外部变更另管 | 停服务/改驱动属外部操作；恢复成本未知 |


#### 效果

| 目标 | 支持 | 边界 |
| --- | --- | --- |
| GPU可见性 | -L和CSV | 非CUDA任务验收 |
| 显存压力 | 55/85%阈值 | 非模型峰值预测 |
| 服务线索 | 四端口TCP | 非协议/同GPU证明 |

> **思考**：仅loopback探测可能漏Windows NAT，端口标签/争用及固定CUDA建议是启发，整体超时未向子任务传递。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把设备和端口线索放在同一报告，减少手工收集。详见[Q01](#research-q01)。

把设备和端口线索放在同一报告，减少手工收集。详见[Q01](#research-q01)。

依赖注入测试和JSON清洗可借鉴，需分层成功语义与统一deadline。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

仅loopback探测可能漏Windows NAT，端口标签/争用及固定CUDA建议是启发，整体超时未向子任务传递。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

作为排障线索试用，原始query/targets和进程归属优先。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

查询/格式/探测链可核，监听数不证明同GPU争用，ok不保证查询或CUDA任务可用。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/gpu.js、lib/wsl-host.js、test/gpu.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整index/252行gpu/57行wsl-host/151行测试及README/package，只读不执行诊断或smoke。
- 下一步：从占端口非推理/多GPU/NAT/query失败和超时反例核证据分层。

**分析版本**

- **仓库**：[173787247/dsh-wsl-gpu](https://github.com/173787247/dsh-wsl-gpu)
- **版本号**：0.2.2（[固定提交 3a682db](https://github.com/173787247/dsh-wsl-gpu/tree/3a682db355d8d1b9063b975e7a18900a4ae4aa74)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究分层证据/协议及GPU归属与总预算取消，比较误诊和排障时间，未验证。详见[Q05](#research-q05)。

从占端口非推理/多GPU/NAT/query失败和超时反例核证据分层。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 183 | — | — | 1011 |
| .js | source | 3 | 388 | 343 | 13 | — |
| .mjs | source | 2 | 44 | 42 | 0 | — |
| .js | test | 1 | 151 | 139 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-gpu/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-gpu/issues?q=is%3Aissue+created%3A2026-09-22T07%3A10%3A45.556Z..2026-10-22T07%3A10%3A45.556Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-gpu/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A10%3A45.556Z..2026-10-22T07%3A10%3A45.556Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：GPU可见性、显存与TCP线索能支持什么结论，如何避免把启发提示当真实争用证明？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · GPU doctor解决什么，是否真的诊断显存争用？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向WSL本地NVIDIA推理排障，汇总nvidia-smi设备列表、CSV显存/利用率/compute_cap和常见推理端口监听，再给Blackwell与显存阈值提示。减少用户先查GPU再查端口再手工解释的步骤，基线是直接nvidia-smi与TCP探测，并无新的GPU遥测或资源调度机制。

端口11434/1234/8000/8080只是按惯例命名，不识别实际协议、进程、模型是否加载或绑定哪张GPU；多监听不证明争同一GPU，单监听更不能保证exclusive VRAM。建议文本“fine for exclusive VRAM use”强于探测事实，使用者应将其读为进一步排查线索。工具不卸模型、不停止服务、不装驱动。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:29-64](https://github.com/173787247/dsh-wsl-gpu/blob/3a682db355d8d1b9063b975e7a18900a4ae4aa74/index.js#L29-L64)

工具查询汇总。

<details>
<summary>查看原文（36行）</summary>

```text
  ctx.tools.register({
    name: "gpu_doctor",
    description:
      "Probe nvidia-smi (VRAM/util/compute_cap), flag Blackwell/5080 needs, and check if multiple local LLM ports are open on the same machine.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        probeInference: {
          type: "boolean",
          description: "Also TCP-probe Ollama/LM Studio/vLLM/llama ports (default true).",
        },
      },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: true,
      },
      render: (_args, value) => [{ type: "text", text: formatGpuReport(value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args = {}) {
      const doProbe = args.probeInference !== undefined ? Boolean(args.probeInference) : probeInference;
      const smi = await runNvidiaSmi();
      const query = smi.ok ? await runNvidiaQuery() : { ok: false, gpus: [] };
      const inference = doProbe
        ? await probeInferencePorts({
            hosts: ["127.0.0.1", "localhost"],
            timeoutMs: probeTimeoutMs,
          })
        : [];
      const report = { wsl, smi, query, inference };
      report.advice = buildGpuAdvice(report);
      report.ok = Boolean(smi.ok);
```

</details>

**依据 2 · 源码核查**：[lib/gpu.js:7-13](https://github.com/173787247/dsh-wsl-gpu/blob/3a682db355d8d1b9063b975e7a18900a4ae4aa74/lib/gpu.js#L7-L13)

固定端口标签。

```text
/** Local LLM ports often fighting for the same VRAM on Windows. */
export const INFERENCE_PORTS = {
  ollama: { port: 11434, label: "Ollama" },
  lmstudio: { port: 1234, label: "LM Studio" },
  vllm: { port: 8000, label: "vLLM" },
  llama: { port: 8080, label: "llama-server / Unsloth Desktop" },
};
```

**依据 3 · 源码核查**：[lib/gpu.js:141-161](https://github.com/173787247/dsh-wsl-gpu/blob/3a682db355d8d1b9063b975e7a18900a4ae4aa74/lib/gpu.js#L141-L161)

监听数推争用建议。

<details>
<summary>查看原文（21行）</summary>

```text
  const tips = [];
  if (openOnes.length >= 2) {
    tips.push(
      `Multiple inference listeners open: ${openOnes.map((s) => `${s.id}:${s.port}`).join(", ")}. On ~16GB cards (e.g. RTX 5080) avoid running Ollama + vLLM + llama-server/Unsloth Desktop at once — stop extras before loading another large GGUF.`,
    );
  } else if (openOnes.length === 1) {
    tips.push(
      `Only ${openOnes[0].id} (:${openOnes[0].port}) looks open — fine for exclusive VRAM use. Pair with host_reach for baseURL.`,
    );
  } else {
    tips.push(
      "No common inference ports open on probed hosts (11434/1234/8000/8080). Start Ollama / Unsloth Desktop / vLLM on Windows, then re-run gpu_doctor or host_reach.",
    );
  }
  return tips;
}

export function buildGpuAdvice(report) {
  const tips = [];
  if (!report.wsl) {
    tips.push("Not running in WSL; GPU bridging advice applies to WSL2 + Windows NVIDIA driver.");
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 执行链、探测范围和成功语义是什么？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

apply检测WSL并注册gpu_doctor及固定引导；非WSL仍可调用，只在建议加说明。执行先用PATH中的nvidia-smi -L，成功才请求七字段CSV，之后可选按四服务、每服务两host顺序TCP连接，host固定127.0.0.1和localhost。probeInference参数可关，配置默认开；这不扫描NAT的Windows主机地址，localhost解析也不保证覆盖所有地址。

Node>=18 ESM，tools/systemPrompt宿主服务、NVIDIA工具/驱动与权限为实际依赖。report.ok仅等smi.ok，query失败或端口不可达仍ok；结构化query.error保留，但formatGpuReport在smi成功时不显式打印query.error，可能只看见设备列表和泛化建议，不能以绿色ok当CUDA运行/模型加载成功。read-only execFile固定参数且无shell，无修改命令。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:14-27](https://github.com/173787247/dsh-wsl-gpu/blob/3a682db355d8d1b9063b975e7a18900a4ae4aa74/index.js#L14-L27)

配置和固定指导。

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 20_000);
  const probeTimeoutMs = positive(config.probeTimeoutMs, 1_200);
  const probeInference = config.probeInference !== false;
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:gpu_doctor",
    order: 120,
    text: [
      "Use gpu_doctor before local inference or CUDA installs: nvidia-smi in WSL, VRAM pressure, Blackwell/sm_120 hints, and whether Ollama/vLLM/llama-server ports compete on one GPU.",
      "Pair with host_reach for baseURL and docker_doctor focus=vllm for containers.",
    ].join(" "),
  });
```

</details>

**依据 2 · 源码核查**：[index.js:49-65](https://github.com/173787247/dsh-wsl-gpu/blob/3a682db355d8d1b9063b975e7a18900a4ae4aa74/index.js#L49-L65)

实际调用和ok。

<details>
<summary>查看原文（17行）</summary>

```text
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args = {}) {
      const doProbe = args.probeInference !== undefined ? Boolean(args.probeInference) : probeInference;
      const smi = await runNvidiaSmi();
      const query = smi.ok ? await runNvidiaQuery() : { ok: false, gpus: [] };
      const inference = doProbe
        ? await probeInferencePorts({
            hosts: ["127.0.0.1", "localhost"],
            timeoutMs: probeTimeoutMs,
          })
        : [];
      const report = { wsl, smi, query, inference };
      report.advice = buildGpuAdvice(report);
      report.ok = Boolean(smi.ok);
      return toLosslessJson(report);
```

</details>

**依据 3 · 源码核查**：[lib/gpu.js:18-48](https://github.com/173787247/dsh-wsl-gpu/blob/3a682db355d8d1b9063b975e7a18900a4ae4aa74/lib/gpu.js#L18-L48)

固定命令与各自超时。

<details>
<summary>查看原文（31行）</summary>

```text
export async function runNvidiaSmi({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout, stderr } = await execFileFn("nvidia-smi", ["-L"], {
      timeout: 10_000,
      encoding: "utf8",
    });
    return { ok: true, listing: String(stdout || "").trim(), stderr: String(stderr || "").trim() };
  } catch (err) {
    const out = {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
    if (err && typeof err === "object" && "code" in err && err.code != null) {
      out.code = err.code;
    }
    return out;
  }
}

export async function runNvidiaQuery({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn(
      "nvidia-smi",
      [`--query-gpu=${QUERY_FIELDS}`, "--format=csv,noheader,nounits"],
      { timeout: 10_000, encoding: "utf8" },
    );
    const csv = String(stdout || "").trim();
    return { ok: true, csv, gpus: parseGpuCsv(csv) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err), gpus: [] };
  }
```

</details>

**依据 4 · 源码核查**：[lib/gpu.js:118-138](https://github.com/173787247/dsh-wsl-gpu/blob/3a682db355d8d1b9063b975e7a18900a4ae4aa74/lib/gpu.js#L118-L138)

顺序端口循环。

<details>
<summary>查看原文（21行）</summary>

```text
 */
export async function probeInferencePorts({
  hosts = ["127.0.0.1"],
  ports = INFERENCE_PORTS,
  probeFn = probeTcp,
  timeoutMs = 1200,
} = {}) {
  const services = [];
  for (const [id, meta] of Object.entries(ports)) {
    let open = false;
    const targets = [];
    for (const host of hosts) {
      const r = await probeFn(host, meta.port, timeoutMs);
      targets.push(r);
      if (r.open) open = true;
    }
    services.push({ id, label: meta.label, port: meta.port, open, targets });
  }
  return services;
}

```

</details>

**依据 5 · 源码核查**：[lib/gpu.js:216-241](https://github.com/173787247/dsh-wsl-gpu/blob/3a682db355d8d1b9063b975e7a18900a4ae4aa74/lib/gpu.js#L216-L241)

文本render边界。

<details>
<summary>查看原文（26行）</summary>

```text
      );
    }
    if (!(report.query?.gpus || []).length && report.query?.csv) {
      lines.push(report.query.csv);
    }
  } else {
    lines.push(`nvidia-smi: fail (${report.smi?.error || "unknown"})`);
  }
  if (report.inference?.length) {
    lines.push("inferencePorts:");
    for (const s of report.inference) {
      lines.push(`  ${s.id} :${s.port} ${s.open ? "OPEN" : "closed"}`);
    }
  }
  for (const tip of report.advice || []) lines.push(`- ${tip}`);
  return lines.join("\n");
}

function num(v) {
  const cleaned = String(v ?? "").replace(/[^\d.-]/g, "");
  if (!cleaned || cleaned === "-" || cleaned === "." || cleaned === "-.") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/**
```

</details>

**依据 6 · 源码核查**：[package.json:14-18](https://github.com/173787247/dsh-wsl-gpu/blob/3a682db355d8d1b9063b975e7a18900a4ae4aa74/package.json#L14-L18)

Node入口。

```text
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
  },
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 超时、数值和硬件建议的边界有哪些？

**研究主题**：缺陷与关键质疑

#### 完整回答

两次nvidia-smi各自硬编码10秒，四服务乘两host顺序探测默认可再占约9.6秒，整体最坏超过默认工具timeoutMs20秒。宿主超时与内部调用没有signal衔接，execute不接signal传给execFile或socket；超时后内部探测是否继续由具体宿主决定，不能把外层timeout当严格总预算。并发标safe表示无状态写入，但多次查询可增加进程/socket负荷。

CSV简单按逗号分栏且不足七列跳过，数字清洗非数字字符后Number，N/A变null并输出unknown，积极避免NaN；但未严格校验取值域/CSV引号。显存55%/85%和型号名/compute>=12判Blackwell都只是启发，无法替代框架CUDA支持矩阵或模型实际峰值显存。CUDA12.8/13与切deepseek-flash等是固定文本建议，不是运行时测过驱动/框架/云模型可用，配套host_reach/docker_doctor也不核已装。

#### 证据与依据

**依据 1 · 源码核查**：[lib/gpu.js:18-48](https://github.com/173787247/dsh-wsl-gpu/blob/3a682db355d8d1b9063b975e7a18900a4ae4aa74/lib/gpu.js#L18-L48)

两个10秒。

<details>
<summary>查看原文（31行）</summary>

```text
export async function runNvidiaSmi({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout, stderr } = await execFileFn("nvidia-smi", ["-L"], {
      timeout: 10_000,
      encoding: "utf8",
    });
    return { ok: true, listing: String(stdout || "").trim(), stderr: String(stderr || "").trim() };
  } catch (err) {
    const out = {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
    if (err && typeof err === "object" && "code" in err && err.code != null) {
      out.code = err.code;
    }
    return out;
  }
}

export async function runNvidiaQuery({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn(
      "nvidia-smi",
      [`--query-gpu=${QUERY_FIELDS}`, "--format=csv,noheader,nounits"],
      { timeout: 10_000, encoding: "utf8" },
    );
    const csv = String(stdout || "").trim();
    return { ok: true, csv, gpus: parseGpuCsv(csv) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err), gpus: [] };
  }
```

</details>

**依据 2 · 源码核查**：[lib/gpu.js:54-93](https://github.com/173787247/dsh-wsl-gpu/blob/3a682db355d8d1b9063b975e7a18900a4ae4aa74/lib/gpu.js#L54-L93)

CSV与阈值。

<details>
<summary>查看原文（40行）</summary>

```text
export function parseGpuCsv(csv) {
  const gpus = [];
  for (const line of String(csv || "").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed.split(",").map((p) => p.trim());
    if (parts.length < 7) continue;
    const [name, driver, total, used, free, util, computeCap] = parts;
    const memoryTotalMiB = num(total);
    const memoryUsedMiB = num(used);
    const memoryFreeMiB = num(free);
    gpus.push({
      name,
      driver,
      memoryTotalMiB,
      memoryUsedMiB,
      memoryFreeMiB,
      utilizationGpu: num(util),
      computeCap,
      blackwellLike: isBlackwellLike(name, computeCap),
      vramPressure: classifyVramPressure(memoryUsedMiB, memoryTotalMiB),
    });
  }
  return gpus;
}

export function isBlackwellLike(name, computeCap) {
  const n = String(name || "");
  if (/50[89]0|Blackwell|RTX\s*50/i.test(n)) return true;
  const cap = parseFloat(String(computeCap || ""));
  return Number.isFinite(cap) && cap >= 12.0;
}

export function classifyVramPressure(usedMiB, totalMiB) {
  if (!Number.isFinite(usedMiB) || !Number.isFinite(totalMiB) || totalMiB <= 0) return "unknown";
  const ratio = usedMiB / totalMiB;
  if (ratio >= 0.85) return "high";
  if (ratio >= 0.55) return "medium";
  return "low";
}
```

</details>

**依据 3 · 源码核查**：[lib/gpu.js:96-138](https://github.com/173787247/dsh-wsl-gpu/blob/3a682db355d8d1b9063b975e7a18900a4ae4aa74/lib/gpu.js#L96-L138)

socket局部超时和顺序。

<details>
<summary>查看原文（43行）</summary>

```text
  return new Promise((resolve) => {
    const sock = createConnection({ host, port });
    const done = (open, error) => {
      try {
        sock.destroy();
      } catch {
        /* ignore */
      }
      // dsh requires lossless JSON — never emit undefined fields.
      const row = { host, port, open };
      if (error != null && error !== "") row.error = String(error);
      resolve(row);
    };
    sock.setTimeout(timeoutMs);
    sock.on("connect", () => done(true));
    sock.on("timeout", () => done(false, "timeout"));
    sock.on("error", (err) => done(false, err.message));
  });
}

/**
 * Probe well-known inference ports on localhost (+ optional Windows host IP).
 */
export async function probeInferencePorts({
  hosts = ["127.0.0.1"],
  ports = INFERENCE_PORTS,
  probeFn = probeTcp,
  timeoutMs = 1200,
} = {}) {
  const services = [];
  for (const [id, meta] of Object.entries(ports)) {
    let open = false;
    const targets = [];
    for (const host of hosts) {
      const r = await probeFn(host, meta.port, timeoutMs);
      targets.push(r);
      if (r.open) open = true;
    }
    services.push({ id, label: meta.label, port: meta.port, open, targets });
  }
  return services;
}

```

</details>

**依据 4 · 源码核查**：[lib/gpu.js:174-213](https://github.com/173787247/dsh-wsl-gpu/blob/3a682db355d8d1b9063b975e7a18900a4ae4aa74/lib/gpu.js#L174-L213)

固定GPU/框架/云建议。

<details>
<summary>查看原文（40行）</summary>

```text
  for (const g of gpus) {
    if (g.blackwellLike) {
      tips.push(
        `${g.name}: Blackwell-class (compute ${g.computeCap || "?"}). Prefer CUDA 12.8+/13.x wheels or toolkits that ship sm_120; older cu118 builds often fail to use the GPU.`,
      );
      tips.push(
        "Building llama.cpp / Unsloth Desktop backends: use the Windows CUDA Toolkit already on PATH (nvcc), not a random Linux nvidia-driver package inside WSL.",
      );
    }
    if (g.vramPressure === "high") {
      tips.push(
        `VRAM pressure high on ${g.name}: ${g.memoryUsedMiB}/${g.memoryTotalMiB} MiB used. Unload idle models or close other inference servers before starting another.`,
      );
    } else if (g.vramPressure === "medium") {
      tips.push(
        `VRAM medium on ${g.name}: ${g.memoryUsedMiB}/${g.memoryTotalMiB} MiB — a second 20B+ GGUF may OOM; check open inference ports below.`,
      );
    }
  }

  if (!gpus.length && report.query?.ok) {
    tips.push("Query returned no parseable GPU rows; raw CSV may still be useful above.");
  }

  tips.push("For PyTorch, install a CUDA build that matches the driver; CPU-only wheels will ignore the GPU.");
  tips.push(...buildContentionAdvice(report.inference || []));
  tips.push("Docker GPU for vLLM: ensure Docker Desktop GPU support, then docker_doctor focus=vllm + host_reach.");
  tips.push(
    "If DSH chat feels stuck on a local 27B (pi-ai idle timeout / Deep diving), run host_reach (ctx + ollamaLoaded) then switch the session to deepseek-flash.",
  );
  return tips;
}

export function formatGpuReport(report) {
  const lines = ["gpu_doctor"];
  lines.push(`wsl: ${report.wsl}`);
  if (report.smi?.ok) {
    lines.push("nvidia-smi: ok");
    if (report.smi.listing) lines.push(report.smi.listing);
    for (const g of report.query?.gpus || []) {
```

</details>

**依据 5 · 源码核查**：[index.js:49-59](https://github.com/173787247/dsh-wsl-gpu/blob/3a682db355d8d1b9063b975e7a18900a4ae4aa74/index.js#L49-L59)

外层timeout无signal透传。

<details>
<summary>查看原文（11行）</summary>

```text
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args = {}) {
      const doProbe = args.probeInference !== undefined ? Boolean(args.probeInference) : probeInference;
      const smi = await runNvidiaSmi();
      const query = smi.ok ? await runNvidiaQuery() : { ok: false, gpus: [] };
      const inference = doProbe
        ? await probeInferencePorts({
            hosts: ["127.0.0.1", "localhost"],
            timeoutMs: probeTimeoutMs,
```

</details>

#### 缺口

- 同版本宿主工具总超时后的任务取消契约及目标框架真实GPU支持
  **影响**：不能由timeout配置和静态建议保证立即停止或CUDA可用
  **进一步探讨**：只读宿主取消契约，并按固定驱动/框架版本核官方支持和真实错误材料

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程与分阶段成本如何判断？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

纯模块使用可注入execFileFn/probeFn，测试直接导入生产CSV、阈值、建议、端口聚合和lossless JSON，覆盖N/A与非有限值转null，利于宿主输出可序列化。测试并不证明实际GPU/端口协议和总超时，scripts smoke只作为作者工具存在，本次不执行。wsl-host里PowerShell/cmd辅助函数没有被gpu执行链调用，不应列为实际Windows进程扫描。

首次需可用NVIDIA驱动和PATH工具、宿主ABI，调用前确认本地扫描被允许；持续每次最多两进程与八次TCP握手，输出设备/驱动信息进模型上下文，无独立远端API费。最坏延迟主要是顺序超时，未给真实基准。恢复无插件持久文件或GPU配置回滚，停止调用即可；依据建议停服务/改驱动是外部人工变更，需独立判断和恢复。

#### 证据与依据

**依据 1 · 源码核查**：[test/gpu.test.js:1-151](https://github.com/173787247/dsh-wsl-gpu/blob/3a682db355d8d1b9063b975e7a18900a4ae4aa74/test/gpu.test.js#L1-L151)

生产函数注入/输出测试。

<details>
<summary>查看原文（151行）</summary>

```text
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildContentionAdvice,
  buildGpuAdvice,
  classifyVramPressure,
  formatGpuReport,
  isBlackwellLike,
  parseGpuCsv,
  probeInferencePorts,
  runNvidiaQuery,
} from "../lib/gpu.js";

describe("parseGpuCsv", () => {
  it("parses nounits CSV and flags 5080", () => {
    const csv =
      "NVIDIA GeForce RTX 5080, 591.86, 16303, 14000, 2303, 45, 12.0";
    const [g] = parseGpuCsv(csv);
    assert.equal(g.name, "NVIDIA GeForce RTX 5080");
    assert.equal(g.memoryTotalMiB, 16303);
    assert.equal(g.memoryUsedMiB, 14000);
    assert.equal(g.vramPressure, "high");
    assert.equal(g.blackwellLike, true);
    assert.equal(g.computeCap, "12.0");
  });

  it("marks older cards non-blackwell", () => {
    const [g] = parseGpuCsv("NVIDIA GeForce RTX 4090, 560.00, 24564, 1000, 23564, 5, 8.9");
    assert.equal(g.blackwellLike, false);
    assert.equal(g.vramPressure, "low");
  });
});

describe("isBlackwellLike / classifyVramPressure", () => {
  it("detects by name or compute cap", () => {
    assert.equal(isBlackwellLike("RTX 5090", "10.0"), true);
    assert.equal(isBlackwellLike("Tesla T4", "12.0"), true);
    assert.equal(isBlackwellLike("Tesla T4", "7.5"), false);
  });

  it("classifies ratios", () => {
    assert.equal(classifyVramPressure(9000, 16000), "medium");
    assert.equal(classifyVramPressure(14000, 16000), "high");
    assert.equal(classifyVramPressure(1000, 16000), "low");
  });
});

describe("buildGpuAdvice", () => {
  it("advises when smi fails", () => {
    const advice = buildGpuAdvice({ wsl: true, smi: { ok: false, error: "ENOENT" } });
    assert.ok(advice.some((t) => /nvidia-smi missing|Windows NVIDIA/i.test(t)));
  });

  it("adds blackwell and contention tips", () => {
    const advice = buildGpuAdvice({
      wsl: true,
      smi: { ok: true, listing: "GPU 0" },
      query: {
        ok: true,
        gpus: parseGpuCsv("NVIDIA GeForce RTX 5080, 591.86, 16303, 2000, 14303, 10, 12.0"),
      },
      inference: [
        { id: "ollama", port: 11434, open: true },
        { id: "llama", port: 8080, open: true },
      ],
    });
    assert.ok(advice.some((t) => /Blackwell|sm_120/i.test(t)));
    assert.ok(advice.some((t) => /Multiple inference/i.test(t)));
  });
});

describe("buildContentionAdvice", () => {
  it("handles zero / one / many open ports", () => {
    assert.match(buildContentionAdvice([])[0], /No common inference/);
    assert.match(buildContentionAdvice([{ id: "ollama", port: 11434, open: true }])[0], /Only ollama/);
    assert.match(
      buildContentionAdvice([
        { id: "ollama", port: 11434, open: true },
        { id: "vllm", port: 8000, open: true },
      ])[0],
      /Multiple inference/,
    );
  });
});

describe("probeInferencePorts", () => {
  it("marks open when probe succeeds on any host", async () => {
    const services = await probeInferencePorts({
      hosts: ["127.0.0.1", "localhost"],
      ports: { ollama: { port: 11434, label: "Ollama" } },
      probeFn: async (host, port) => ({ host, port, open: host === "localhost" }),
    });
    assert.equal(services[0].open, true);
    assert.equal(services[0].targets.length, 2);
  });
});

describe("runNvidiaQuery", () => {
  it("parses via injected execFile", async () => {
    const result = await runNvidiaQuery({
      execFileFn: async () => ({
        stdout: "NVIDIA GeForce RTX 5080, 591.86, 16303, 100, 16203, 1, 12.0\n",
      }),
    });
    assert.equal(result.ok, true);
    assert.equal(result.gpus[0].blackwellLike, true);
  });
});

describe("formatGpuReport", () => {
  it("includes VRAM line and ports", () => {
    const text = formatGpuReport({
      wsl: true,
      smi: { ok: true, listing: "GPU 0: NVIDIA" },
      query: {
        gpus: parseGpuCsv("NVIDIA GeForce RTX 5080, 591.86, 16303, 100, 16203, 1, 12.0"),
      },
      inference: [{ id: "ollama", port: 11434, open: true }],
      advice: ["ok tip"],
    });
    assert.match(text, /nvidia-smi: ok/);
    assert.match(text, /\[blackwell\]/);
    assert.match(text, /ollama :11434 OPEN/);
    assert.match(text, /ok tip/);
  });
});

describe("toLosslessJson", () => {
  it("strips NaN/undefined so JSON round-trips", async () => {
    const { toLosslessJson } = await import("../lib/gpu.js");
    const dirty = {
      ok: true,
      n: Number.NaN,
      miss: undefined,
      nested: [{ open: true, error: undefined, util: Infinity }],
    };
    const clean = toLosslessJson(dirty);
    const again = JSON.parse(JSON.stringify(clean));
    assert.deepEqual(clean, again);
    assert.equal(clean.n, null);
    assert.equal(clean.miss, null);
    assert.equal(clean.nested[0].util, null);
  });

  it("parseGpuCsv never emits NaN", () => {
    const [g] = parseGpuCsv("GPU, 1.0, N/A, N/A, N/A, N/A, 12.0");
    assert.equal(g.memoryTotalMiB, null);
    assert.equal(g.utilizationGpu, null);
    assert.equal(g.vramPressure, "unknown");
  });
});
```

</details>

**依据 2 · 源码核查**：[lib/gpu.js:243-252](https://github.com/173787247/dsh-wsl-gpu/blob/3a682db355d8d1b9063b975e7a18900a4ae4aa74/lib/gpu.js#L243-L252)

lossless清洗。

<details>
<summary>查看原文（10行）</summary>

```text
 */
export function toLosslessJson(value) {
  return JSON.parse(
    JSON.stringify(value, (_key, v) => {
      if (typeof v === "number" && !Number.isFinite(v)) return null;
      if (v === undefined) return null;
      return v;
    }),
  );
}
```

</details>

**依据 3 · 源码核查**：[lib/wsl-host.js:34-53](https://github.com/173787247/dsh-wsl-gpu/blob/3a682db355d8d1b9063b975e7a18900a4ae4aa74/lib/wsl-host.js#L34-L53)

未调用的Windows辅助。

<details>
<summary>查看原文（20行）</summary>

```text
export async function runPowerShell(script, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("powershell.exe");
  const { stdout, stderr } = await execFileAsync(
    bin,
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { timeout: timeoutMs, windowsHide: true, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
  return { stdout: String(stdout ?? ""), stderr: String(stderr ?? "") };
}

export async function runCmd(args, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("cmd.exe");
  const { stdout, stderr } = await execFileAsync(bin, args, {
    timeout: timeoutMs,
    windowsHide: true,
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
  });
  return { stdout: String(stdout ?? ""), stderr: String(stderr ?? "") };
}
```

</details>

**依据 4 · 源码核查**：[index.js:53-61](https://github.com/173787247/dsh-wsl-gpu/blob/3a682db355d8d1b9063b975e7a18900a4ae4aa74/index.js#L53-L61)

实际执行范围。

```text
      const doProbe = args.probeInference !== undefined ? Boolean(args.probeInference) : probeInference;
      const smi = await runNvidiaSmi();
      const query = smi.ok ? await runNvidiaQuery() : { ok: false, gpus: [] };
      const inference = doProbe
        ? await probeInferencePorts({
            hosts: ["127.0.0.1", "localhost"],
            timeoutMs: probeTimeoutMs,
          })
        : [];
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样采用，继续探讨从哪里开始？

**研究主题**：新假设与验证、采用判断

#### 完整回答

需要汇总WSL GPU可见性与本地监听线索者可试用，先看原始CSV/query.error与targets，再核进程/GPU归属及框架错误，不按端口数量直接停服务或以ok推模型能跑。Windows NAT服务需结合真正host地址，远端或自定义端口不在默认探测范围。

可研究证据分层诊断——设备可见、查询成功、TCP可达、协议识别、模型加载、GPU进程归属分开报告；结合总deadline和abort传递，同时保留unknown而非“exclusive”措辞。基线是当前smi ok和监听数建议，最小反例为任意HTTP占8080、服务CPU运行、多GPU各用一张、-L成功CSV不支持、NAT远端服务和外层超时。比较误告警、漏诊、排障工时及取消后额外执行时间，方向尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/gpu.js:141-161](https://github.com/173787247/dsh-wsl-gpu/blob/3a682db355d8d1b9063b975e7a18900a4ae4aa74/lib/gpu.js#L141-L161)

端口建议基线。

<details>
<summary>查看原文（21行）</summary>

```text
  const tips = [];
  if (openOnes.length >= 2) {
    tips.push(
      `Multiple inference listeners open: ${openOnes.map((s) => `${s.id}:${s.port}`).join(", ")}. On ~16GB cards (e.g. RTX 5080) avoid running Ollama + vLLM + llama-server/Unsloth Desktop at once — stop extras before loading another large GGUF.`,
    );
  } else if (openOnes.length === 1) {
    tips.push(
      `Only ${openOnes[0].id} (:${openOnes[0].port}) looks open — fine for exclusive VRAM use. Pair with host_reach for baseURL.`,
    );
  } else {
    tips.push(
      "No common inference ports open on probed hosts (11434/1234/8000/8080). Start Ollama / Unsloth Desktop / vLLM on Windows, then re-run gpu_doctor or host_reach.",
    );
  }
  return tips;
}

export function buildGpuAdvice(report) {
  const tips = [];
  if (!report.wsl) {
    tips.push("Not running in WSL; GPU bridging advice applies to WSL2 + Windows NVIDIA driver.");
```

</details>

**依据 2 · 源码核查**：[index.js:53-65](https://github.com/173787247/dsh-wsl-gpu/blob/3a682db355d8d1b9063b975e7a18900a4ae4aa74/index.js#L53-L65)

成功/预算基线。

<details>
<summary>查看原文（13行）</summary>

```text
      const doProbe = args.probeInference !== undefined ? Boolean(args.probeInference) : probeInference;
      const smi = await runNvidiaSmi();
      const query = smi.ok ? await runNvidiaQuery() : { ok: false, gpus: [] };
      const inference = doProbe
        ? await probeInferencePorts({
            hosts: ["127.0.0.1", "localhost"],
            timeoutMs: probeTimeoutMs,
          })
        : [];
      const report = { wsl, smi, query, inference };
      report.advice = buildGpuAdvice(report);
      report.ok = Boolean(smi.ok);
      return toLosslessJson(report);
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
