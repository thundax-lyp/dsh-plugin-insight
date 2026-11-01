# dsh-wsl-gpu

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[6c48ff1](https://github.com/173787247/dsh-wsl-gpu/tree/6c48ff1d5bea1cd92667374d464bce90fa77f682)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-gpu)
<!-- END META -->

> **功能**：在 WSL 中汇总 NVIDIA GPU 与本地推理端口线索。

> **亮点**：[Q01](#research-q01) 集中设备与端口线索，[Q02](#research-q02) 将结果输出给模型。

> **主要限制**：[Q03](#research-q03) 顶层 ok 只看设备列表命令，端口不证明进程、协议或 GPU 独占。

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
  - [Q01 · GPU doctor 对 WSL 用户相对手工排查有什么作用？](#detail-section-11)
  - [Q02 · 工具如何采集 GPU 和服务线索并返回？](#detail-section-12)
  - [Q03 · ok、端口和固定建议可以证明什么？](#detail-section-13)
  - [Q04 · 依赖、权限和具体采用的边界是什么？](#detail-section-14)
  - [Q05 · 如何避免把监听端口误当 GPU 争用证据？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL 用户在本地推理或 CUDA 配置前检查 GPU 与服务。

手工运行 nvidia-smi、检查监听端口并验证实际负载。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| NVIDIA 查询 | 读取设备及显存 | 不等于负载通过 |
| TCP 探测 | 检查固定端口 | 不证明协议或 GPU 归属 |
| 启发式建议 | 提示压力和可能竞争 | 需人工验证 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| DSH tools 与 systemPrompt | 必需 | 注册与提示 | 工具不可用 |
| nvidia-smi 和 NVIDIA 驱动 | 设备查询需要 | 列设备与显存 | 报失败 |
| loopback 服务端口 | 可选 | TCP 线索 | 未探测其他网络 |
| 用户权限及真实负载 | 结论核验需要 | 确认协议与 GPU 归属 | 保持未知 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认设备和信息分享范围 | 敏感信息先脱敏 |
| 采集 | 核 nvidia-smi 和 TCP 原始结果 | 失败不当成可用 |
| 对照 | 独立核服务协议、进程和负载 | 未知不判独占 |
| 处理 | 用户决定是否变更驱动或服务 | 先确认影响与退路 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 准备 | 设备和工具成本未知 | 核授权和驱动 | 环境未测 |
| 采集 | 本地进程、TCP 与结果 token 成本未知 | 等待并核原始结果 | 顺序超时无总取消证明 |
| 处理 | 驱动或服务变更成本未知 | 独立确认与恢复 | 建议不执行变更 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| GPU | 调列表与 CSV 查询 | 模型能否运行 |
| 服务 | 固定 loopback TCP 连接 | 服务协议或 GPU 归属 |
| 建议 | 基于固定阈值与端口数 | 真实独占、争用或修复效果 |

> **思考**：[Q03](#research-q03) 顶层 ok 只看设备列表命令，端口不证明进程、协议或 GPU 独占。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 集中设备与端口线索，[Q02](#research-q02) 将结果输出给模型。

[Q02](#research-q02) 进程和端口顺序执行且未传总取消，[Q03](#research-q03) ok 和端口仅表示有限状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 顶层 ok 只看设备列表命令，端口不证明进程、协议或 GPU 独占。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 将其作为排障线索并核原始设备、服务协议和进程；归属不明时不据建议停止服务。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已静态核查工具入口、采集、超时及建议代表链；未运行探测。

- 已检查：作者 README、包清单、源码路径 index.js、lib/gpu.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定清单、工具入口和 GPU helper；未执行 nvidia-smi、TCP 探测、宿主或外部工具。
- 下一步：[Q05](#research-q05) 先核已有工具，再在多 GPU 和错误监听端口对照。

**分析版本**

- **仓库**：[173787247/dsh-wsl-gpu](https://github.com/173787247/dsh-wsl-gpu)
- **版本号**：0.2.2（[固定提交 6c48ff1](https://github.com/173787247/dsh-wsl-gpu/tree/6c48ff1d5bea1cd92667374d464bce90fa77f682)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设逐层显示协议和 GPU 归属有助减少误诊；未验证。

[Q05](#research-q05) 先核已有工具，再在多 GPU 和错误监听端口对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 183 | — | — | 1011 |
| .js | source | 3 | 388 | 343 | 13 | — |
| .mjs | source | 2 | 44 | 42 | 0 | — |
| .js | test | 1 | 151 | 139 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-gpu/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 GPU、监听端口与启发式建议的证据边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · GPU doctor 对 WSL 用户相对手工排查有什么作用？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

index.js:20-32 将其定位为本地推理或 CUDA 安装前的 GPU 与监听端口排查。用户原可分别运行 nvidia-smi 并检查服务端口；该工具集中结果和启发式建议，GPU 驱动、CUDA 与服务本身不是插件提供。未验证排障是否更快，输出无法代替真实模型执行和服务健康检查。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:20-32](https://github.com/173787247/dsh-wsl-gpu/blob/6c48ff1d5bea1cd92667374d464bce90fa77f682/index.js#L20-L32)

作者的工具提示及注册。

<details>
<summary>查看原文（13行）</summary>

```text
  ctx.systemPrompt.section({
    name: "tool:gpu_doctor",
    order: 120,
    text: [
      "Use gpu_doctor before local inference or CUDA installs: nvidia-smi in WSL, VRAM pressure, Blackwell/sm_120 hints, and whether Ollama/vLLM/llama-server ports compete on one GPU.",
      "Pair with host_reach for baseURL and docker_doctor focus=vllm for containers.",
    ].join(" "),
  });

  ctx.tools.register({
    name: "gpu_doctor",
    description:
      "Probe nvidia-smi (VRAM/util/compute_cap), flag Blackwell/5080 needs, and check if multiple local LLM ports are open on the same machine.",
```

</details>

**依据 2 · 源码核查**：[lib/gpu.js:18-47](https://github.com/173787247/dsh-wsl-gpu/blob/6c48ff1d5bea1cd92667374d464bce90fa77f682/lib/gpu.js#L18-L47)

运行设备列表及 CSV 查询。

<details>
<summary>查看原文（30行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/gpu.js:119-136](https://github.com/173787247/dsh-wsl-gpu/blob/6c48ff1d5bea1cd92667374d464bce90fa77f682/lib/gpu.js#L119-L136)

集中端口探测。

<details>
<summary>查看原文（18行）</summary>

```text
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
```

</details>

#### 缺口

- 未测真实故障或用户排障
  **影响**：无法证明节时和可运行
  **进一步探讨**：与手工查询及实际模型运行对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具如何采集 GPU 和服务线索并返回？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

index.js:14-18 配置整体工具 timeout、端口 timeout 与默认探测开关；29-65 注册 gpu_doctor，先后执行 nvidia-smi -L、条件式 CSV，再逐个探测 127.0.0.1 与 localhost 的四个端口，将报告和建议序列化。gpu.js:18-47 两次 nvidia-smi 各有固定 10 秒超时；119-135 的端口和两个主机顺序等待，每次有 probeTimeoutMs。源码没有把工具整体 timeout 或 AbortSignal 传入这些子步骤，因此单项限时不等于整体取消已被落实。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:14-18](https://github.com/173787247/dsh-wsl-gpu/blob/6c48ff1d5bea1cd92667374d464bce90fa77f682/index.js#L14-L18)

工具和端口超时配置。

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 20_000);
  const probeTimeoutMs = positive(config.probeTimeoutMs, 1_200);
  const probeInference = config.probeInference !== false;
  const wsl = detectWsl();
```

**依据 2 · 源码核查**：[index.js:29-65](https://github.com/173787247/dsh-wsl-gpu/blob/6c48ff1d5bea1cd92667374d464bce90fa77f682/index.js#L29-L65)

注册、顺序采集与总结果。

<details>
<summary>查看原文（37行）</summary>

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
      return toLosslessJson(report);
```

</details>

**依据 3 · 源码核查**：[lib/gpu.js:18-47](https://github.com/173787247/dsh-wsl-gpu/blob/6c48ff1d5bea1cd92667374d464bce90fa77f682/lib/gpu.js#L18-L47)

两次进程查询与各自超时。

<details>
<summary>查看原文（30行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/gpu.js:119-136](https://github.com/173787247/dsh-wsl-gpu/blob/6c48ff1d5bea1cd92667374d464bce90fa77f682/lib/gpu.js#L119-L136)

逐端口逐主机顺序探测。

<details>
<summary>查看原文（18行）</summary>

```text
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
```

</details>

#### 缺口

- 未运行宿主、驱动与网络
  **影响**：不能证明总期限和真实连通性
  **进一步探讨**：使用假进程和套接字测超时与取消。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · ok、端口和固定建议可以证明什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

index.js:54-65 将 report.ok 设为 smi.ok，即使 CSV 查询失败或端口不可达也可能为 true；gpu.js:95-112 只做 TCP connect，标签依据固定端口表，不核应用协议、进程或 GPU 归属，且工具只探测 127.0.0.1 与 localhost。139-153 中单个开放端口被描述为适合独占 VRAM，多个端口给出争用提示，均不能证明真实 GPU 独占或争用；171、198 的 CUDA 建议亦不是工作负载验收。显存压力使用 55%/85% 阈值，是粗线索而非峰值或 OOM 预测。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:52-65](https://github.com/173787247/dsh-wsl-gpu/blob/6c48ff1d5bea1cd92667374d464bce90fa77f682/index.js#L52-L65)

顶层 ok 仅由 smi 决定，目标仅 loopback。

<details>
<summary>查看原文（14行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/gpu.js:7-13](https://github.com/173787247/dsh-wsl-gpu/blob/6c48ff1d5bea1cd92667374d464bce90fa77f682/lib/gpu.js#L7-L13)

固定服务端口标签。

```text
/** Local LLM ports often fighting for the same VRAM on Windows. */
export const INFERENCE_PORTS = {
  ollama: { port: 11434, label: "Ollama" },
  lmstudio: { port: 1234, label: "LM Studio" },
  vllm: { port: 8000, label: "vLLM" },
  llama: { port: 8080, label: "llama-server / Unsloth Desktop" },
};
```

**依据 3 · 源码核查**：[lib/gpu.js:87-112](https://github.com/173787247/dsh-wsl-gpu/blob/6c48ff1d5bea1cd92667374d464bce90fa77f682/lib/gpu.js#L87-L112)

压力阈值与 TCP 探测。

<details>
<summary>查看原文（26行）</summary>

```text
export function classifyVramPressure(usedMiB, totalMiB) {
  if (!Number.isFinite(usedMiB) || !Number.isFinite(totalMiB) || totalMiB <= 0) return "unknown";
  const ratio = usedMiB / totalMiB;
  if (ratio >= 0.85) return "high";
  if (ratio >= 0.55) return "medium";
  return "low";
}

function probeTcp(host, port, timeoutMs = 1200) {
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
```

</details>

**依据 4 · 源码核查**：[lib/gpu.js:139-153](https://github.com/173787247/dsh-wsl-gpu/blob/6c48ff1d5bea1cd92667374d464bce90fa77f682/lib/gpu.js#L139-L153)

独占和竞争的启发式建议。

<details>
<summary>查看原文（15行）</summary>

```text
export function buildContentionAdvice(services = []) {
  const openOnes = services.filter((s) => s.open);
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
```

</details>

**依据 5 · 源码核查**：[lib/gpu.js:171-200](https://github.com/173787247/dsh-wsl-gpu/blob/6c48ff1d5bea1cd92667374d464bce90fa77f682/lib/gpu.js#L171-L200)

CUDA 与后续建议。

<details>
<summary>查看原文（30行）</summary>

```text
  tips.push("nvidia-smi works — CUDA-capable devices are visible to Linux processes.");

  const gpus = report.query?.gpus || [];
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
```

</details>

#### 缺口

- 未验证协议、实际进程和 GPU 归属
  **影响**：不能依据 ok 或端口数判定推理可用或独占
  **进一步探讨**：独立核服务协议、进程和实际 GPU 负载。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、权限和具体采用的边界是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json 的 Node 要求及 WSL/nvidia-smi 工具是环境条件；结果包含设备、驱动、显存和本地端口信息，分享到模型或他人可能暴露环境。不会因探测结果自动更改驱动或服务，但采集和逐次等待耗时、上下文 token 和人工复核成本未测；建议中停止服务或调整驱动是需要用户另行判断的外部操作。先在已授权 WSL 主机试运行并核原始输出；查询失败、服务不在 loopback 或归属不明时保留未知，不据建议直接停服务。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-17](https://github.com/173787247/dsh-wsl-gpu/blob/6c48ff1d5bea1cd92667374d464bce90fa77f682/package.json#L1-L17)

插件定位和 Node 要求。

<details>
<summary>查看原文（17行）</summary>

```text
{
  "name": "dsh-wsl-gpu",
  "version": "0.2.2",
  "description": "DeepSeek Harness tool: GPU/VRAM doctor for WSL \u2014 nvidia-smi, Blackwell hints, inference port contention.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/173787247/dsh-wsl-gpu.git"
  },
  "bugs": {
    "url": "https://github.com/173787247/dsh-wsl-gpu/issues"
  },
  "homepage": "https://github.com/173787247/dsh-wsl-gpu#readme",
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
```

</details>

**依据 2 · 源码核查**：[index.js:52-65](https://github.com/173787247/dsh-wsl-gpu/blob/6c48ff1d5bea1cd92667374d464bce90fa77f682/index.js#L52-L65)

采集范围和报告。

<details>
<summary>查看原文（14行）</summary>

```text
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

**依据 3 · 源码核查**：[lib/gpu.js:139-153](https://github.com/173787247/dsh-wsl-gpu/blob/6c48ff1d5bea1cd92667374d464bce90fa77f682/lib/gpu.js#L139-L153)

建议涉及停止服务。

<details>
<summary>查看原文（15行）</summary>

```text
export function buildContentionAdvice(services = []) {
  const openOnes = services.filter((s) => s.open);
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
```

</details>

**依据 4 · 源码核查**：[lib/gpu.js:163-180](https://github.com/173787247/dsh-wsl-gpu/blob/6c48ff1d5bea1cd92667374d464bce90fa77f682/lib/gpu.js#L163-L180)

驱动与 CUDA 建议。

<details>
<summary>查看原文（18行）</summary>

```text
  if (!report.smi?.ok) {
    tips.push(
      "nvidia-smi missing or failed inside WSL. Install/update the Windows NVIDIA driver with WSL support; do not install a conflicting Linux driver in the distro.",
    );
    tips.push("After driver update, restart WSL (`wsl --shutdown`) and re-open the distro.");
    return tips;
  }

  tips.push("nvidia-smi works — CUDA-capable devices are visible to Linux processes.");

  const gpus = report.query?.gpus || [];
  for (const g of gpus) {
    if (g.blackwellLike) {
      tips.push(
        `${g.name}: Blackwell-class (compute ${g.computeCap || "?"}). Prefer CUDA 12.8+/13.x wheels or toolkits that ship sm_120; older cu118 builds often fail to use the GPU.`,
      );
      tips.push(
        "Building llama.cpp / Unsloth Desktop backends: use the Windows CUDA Toolkit already on PATH (nvcc), not a random Linux nvidia-driver package inside WSL.",
```

</details>

#### 缺口

- 未测试工具和真实环境
  **影响**：无法保证兼容、延迟或安全变更
  **进一步探讨**：对照实际设备和服务状态后再决定。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何避免把监听端口误当 GPU 争用证据？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有报告已显示设备查询、各服务标签和端口开放状态，并给出固定建议；仅再列端口或添加通用警告没有增量。未验证设想是提供可选的分层诊断收据，分别标明 TCP 连通、协议识别、服务进程身份和实际 GPU 进程归属，每层标注证据来源与未知，由用户决定继续观察或单独核进程；不自动停止服务。对照现有输出，在非对应服务占用端口、单端口多进程、多 GPU、Windows NAT 和驱动故障场景测误诊、漏诊与排障时间；若不能证明归属却显示竞争/独占，或额外采样带来过高隐私与耗时则否定。先核宿主及配套工具是否已有等价信息。

#### 证据与依据

**依据 1 · 源码核查**：[lib/gpu.js:7-13](https://github.com/173787247/dsh-wsl-gpu/blob/6c48ff1d5bea1cd92667374d464bce90fa77f682/lib/gpu.js#L7-L13)

已有端口标签。

```text
/** Local LLM ports often fighting for the same VRAM on Windows. */
export const INFERENCE_PORTS = {
  ollama: { port: 11434, label: "Ollama" },
  lmstudio: { port: 1234, label: "LM Studio" },
  vllm: { port: 8000, label: "vLLM" },
  llama: { port: 8080, label: "llama-server / Unsloth Desktop" },
};
```

**依据 2 · 源码核查**：[lib/gpu.js:95-112](https://github.com/173787247/dsh-wsl-gpu/blob/6c48ff1d5bea1cd92667374d464bce90fa77f682/lib/gpu.js#L95-L112)

已有 TCP 探测。

<details>
<summary>查看原文（18行）</summary>

```text
function probeTcp(host, port, timeoutMs = 1200) {
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
```

</details>

**依据 3 · 源码核查**：[lib/gpu.js:139-153](https://github.com/173787247/dsh-wsl-gpu/blob/6c48ff1d5bea1cd92667374d464bce90fa77f682/lib/gpu.js#L139-L153)

已有独占与争用建议。

<details>
<summary>查看原文（15行）</summary>

```text
export function buildContentionAdvice(services = []) {
  const openOnes = services.filter((s) => s.open);
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
```

</details>

**依据 4 · 源码核查**：[index.js:52-65](https://github.com/173787247/dsh-wsl-gpu/blob/6c48ff1d5bea1cd92667374d464bce90fa77f682/index.js#L52-L65)

已有 GPU 与端口统一报告。

<details>
<summary>查看原文（14行）</summary>

```text
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

#### 缺口

- 未核外部配套工具和无原型
  **影响**：增量、权限及收益未知
  **进一步探讨**：先核现有功能再用受控多进程场景对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
