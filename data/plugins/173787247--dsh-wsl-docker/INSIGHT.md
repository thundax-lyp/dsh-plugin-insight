# dsh-wsl-docker

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[89b19c3](https://github.com/173787247/dsh-wsl-docker/tree/89b19c3428df8dffa4c6771050e774bf1f1eb22b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-docker)
<!-- END META -->

> **功能**：在WSL查询Docker CLI/context/daemon、推理相关容器与GPU线索，并探固定8000端口的models状态。

> **亮点**：集中Docker上下文与推理线索减少手工接线，不是GPU或API完整验收。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **主要限制**：404也health ok且遮蔽专门错误提示，空DeviceRequests可判GPU，内部8000暴露/远程context与固定本机探测错配。详见[Q02](#research-q02)。

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
  - [Q01 · 面向谁，daemon到推理候选诊断如何走？](#detail-section-11)
  - [Q02 · 贡献和404/GPU/端口关键误判是什么？](#detail-section-12)
  - [Q03 · 依赖、读取范围与读者流程是什么？](#detail-section-13)
  - [Q04 · 三阶段成本和效果如何评价？](#detail-section-14)
  - [Q05 · 工程点、分级就绪收据假设与采用结论？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Docker Desktop/WSL/推理容器混淆时做初筛，实际context/端点/模型就绪另核。

手动Docker CLI/结构inspect与HTTP协议检查可替代；整合方便但当前假绿灯可增加排障成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| daemon初筛 | context/serverVersion | 总ok只版本非空 |
| 容器线索 | ps/名称/端口 | 内部exposed不等hostpublished |
| GPU线索 | inspect正则/最多3个 | 字段存在不等设备配置/可用 |
| HTTP | 固定127.0.0.1:8000/models | 404也ok，非协议/模型就绪 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18/DSH tools/systemPrompt | 必需 | doctor工具/指引 | 注册不等实际Docker链可用 |
| WSL/bash/Docker CLI | 必需 | context/version/ps/info/inspect | 错误变空串，需另核原因 |
| 目标Docker daemon/context权限 | 必需 | 元数据盘点 | 可远程context，localhost探测不一定同目标 |
| 原生fetch与本地/vLLM实际地址 | HTTP分支必需 | GET /v1/models | 固定127.0.0.1:8000，不跟映射/认证走 |
| 上游host_reach/gpu_doctor | 建议可选 | 深入核API/显存 | 本工具不执行/不包含它们 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 定义 | 明确CLI context/daemon位置及目标容器 | 不混Desktop/WSL/远程daemon |
| 盘点 | 先focusdaemon，再看容器字段 | 空串可能失败，不当无容器 |
| 核证 | 对照inspect结构/真实端口映射和API协议 | 404/DeviceRequests字段存在非就绪 |
| 恢复 | 按具体失败点查日志/权限/配置 | 未确认不另起推理栈/改GPU/运行示例 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | WSL/Docker环境，金额未知 | context/权限/端点定位 | 不自动安装/启动容器 |
| 持续使用 | 顺序最多多次15秒CLI与2.5秒HTTP | 阅读候选/对照真实GPU/模型协议 | 外层默认15秒不覆盖最坏总链 |
| 失败恢复 | 重查daemon/容器日志/端点 | 区分CLI错误/空结果/API错误 | 不据空串/health ok盲改环境 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| daemon初筛 | CLI路径/context/serverVersion | 每条命令真实错误与目标身份 |
| 推理候选 | 名称/镜像/端口启发式 | 实际vLLM/模型/GPU工作状态 |
| API线索 | 固定地址HTTP状态 | OpenAI协议/认证/模型加载/完整任务 |

> **思考**：404也health ok且遮蔽专门错误提示，空DeviceRequests可判GPU，内部8000暴露/远程context与固定本机探测错配。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：集中Docker上下文与推理线索减少手工接线，不是GPU或API完整验收。详见[Q01](#research-q01)与[Q02](#research-q02)。

纯core/Host注册分离、focus缩小读取、execFile固定参数、依赖注入run/fetch便于受控材料核查、只读建议分开，均可复用。问题在一组强命名布尔压平了错误与就绪层级。

<a id="detail-section-5"></a>

### 1.4 主要限制

404也health ok且遮蔽专门错误提示，空DeviceRequests可判GPU，内部8000暴露/远程context与固定本机探测错配。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，修404/GPU/端口/吞错误谓词和分层收据后再评估受控试用。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持Docker上下文、容器与推理端点线索的集中查询；404、空GPU请求字段和内部端口可能被误判为健康条件，不能证明推理就绪。结构化映射和分级就绪收据尚未验证。

- 已检查：作者 README、包清单、源码路径 index.js、lib/docker.js、package.json、lib/wsl-host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定index/docker完整主逻辑与同hashwsl-host检测；未运行Docker/HTTP/目标测试，不证明真实daemon/模型协议。
- 下一步：进一步探讨用空设备/404/401/200HTML/端口映射/remotecontext/命令失败慢响应夹具核谓词，再对照完整受控诊断。

**分析版本**

- **仓库**：[173787247/dsh-wsl-docker](https://github.com/173787247/dsh-wsl-docker)
- **版本号**：0.2.2（[固定提交 89b19c3](https://github.com/173787247/dsh-wsl-docker/tree/89b19c3428df8dffa4c6771050e774bf1f1eb22b)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨context/映射结构解析与daemon/设备/HTTP协议分级收据、总deadline，反例仍假绿灯则证伪实现。详见[Q05](#research-q05)。

进一步探讨用空设备/404/401/200HTML/端口映射/remotecontext/命令失败慢响应夹具核谓词，再对照完整受控诊断。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 133 | — | — | 775 |
| .js | source | 3 | 330 | 298 | 2 | — |
| .js | test | 1 | 60 | 54 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-docker/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-docker/issues?q=is%3Aissue+created%3A2026-09-22T07%3A59%3A44.342Z..2026-10-22T07%3A59%3A44.342Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-docker/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A59%3A44.342Z..2026-10-22T07%3A59%3A44.342Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核Docker上下文/容器/GPU/API诊断真实谓词，分离只读线索、daemon可达和推理就绪。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向谁，daemon到推理候选诊断如何走？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向WSL里混淆Docker Desktop/Engine context、或排查vLLM/OpenAI容器的人。输入focus all/daemon/vllm，输出CLI路径/context/serverVersion、运行容器/GPU线索和固定端口health/建议。成功诊断需先锁定实际daemon/容器/映射，再确认API语义与模型可用；daemon版本非推理服务就绪。

WSL检测后工具调用core.execute，顺序command -v docker、context show、version；serverVersion非空为daemonOk。非daemon模式docker ps/info，按名字/镜像/8000字样筛候选，最多inspect3个作GPU正则；候选或focusvllm时GET127.0.0.1:8000/v1/models。结果顶层ok只daemonOk，format/hints提示另配host_reach/gpu_doctor，不实际修复。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:7-29](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/index.js#L7-L29)

工具注册/分发。

<details>
<summary>查看原文（23行）</summary>

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:docker_doctor",
    order: 120,
    text: "Use docker_doctor for Docker Desktop vs WSL daemon confusion, and for vLLM/OpenAI containers on port 8000 (focus=vllm). Pair with host_reach when checking baseURL.",
  });

  ctx.tools.register({
    name: "docker_doctor",
    description: "Diagnose Docker in WSL (Desktop vs Engine) and list vLLM/OpenAI-like containers (port 8000). Use focus=vllm for LLM containers.",
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

**依据 2 · 源码核查**：[lib/docker.js:148-188](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/lib/docker.js#L148-L188)

CLI/daemon/容器。

<details>
<summary>查看原文（41行）</summary>

```text
export async function execute(args = {}, deps = {}) {
  const focus = ["all", "daemon", "vllm"].includes(args?.focus) ? args.focus : "all";
  const runFn = deps.run || run;
  const which = await runFn("bash", ["-lc", "command -v docker || true"]);
  if (!which) {
    return {
      ok: false,
      error: "docker CLI not found in WSL",
      containers: [],
      vllmHints: buildVllmHints([], { daemonOk: false }),
      portHealth: null,
      advice: [
        "Install Docker Engine in WSL, or install Docker Desktop and enable WSL integration.",
        "For local LLM ports without Docker, use host_reach (Ollama/LM Studio/llama-server).",
      ],
    };
  }

  const context = await runFn("docker", ["context", "show"]);
  const serverVersion = await runFn("docker", ["version", "--format", "{{.Server.Version}}"]);
  const daemonOk = Boolean(serverVersion);
  const advice = [];
  if (!daemonOk) advice.push("CLI present but daemon not reachable — start Docker Desktop or dockerd.");
  if (/desktop/i.test(context)) advice.push("Context looks like Docker Desktop.");
  else if (context) advice.push(`Active context: ${context}`);

  let containers = [];
  let gpuHint = "";
  let gpuOnHits = null;
  let portHealth = null;
  if (daemonOk && focus !== "daemon") {
    const ps = await runFn("docker", [
      "ps",
      "--format",
      "{{.Names}}\t{{.Image}}\t{{.Ports}}",
    ]);
    containers = parseContainers(ps);
    if (focus === "vllm") containers = containers.filter((c) => looksLikeVllm(c) || c.publishes8000);
    const runtime = await runFn("docker", ["info", "--format", "{{.Runtimes}}"]);
    if (/nvidia/i.test(runtime)) gpuHint = "nvidia runtime present";
    else gpuHint = "nvidia runtime not obvious — check Docker Desktop GPU / nvidia-container-toolkit";
```

</details>

**依据 3 · 源码核查**：[lib/docker.js:190-229](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/lib/docker.js#L190-L229)

inspect/HTTP/总结果。

<details>
<summary>查看原文（40行）</summary>

```text
    const hits = containers.filter(looksLikeVllm);
    if (hits.length) {
      let anyGpu = false;
      let inspected = false;
      for (const c of hits.slice(0, 3)) {
        const raw = await runFn("docker", ["inspect", c.name]);
        if (raw) {
          inspected = true;
          if (containerHasGpuRuntime(raw)) anyGpu = true;
        }
      }
      if (inspected) gpuOnHits = anyGpu;
    }

    const publish8000 = containers.some((c) => c.publishes8000) || focus === "vllm";
    if (publish8000 || hits.length) {
      portHealth = await probeHttpHealth("http://127.0.0.1:8000/v1/models", {
        fetchFn: deps.fetchFn,
      });
    }
  }

  const vllmHints = focus === "daemon" ? [] : buildVllmHints(containers, { daemonOk, portHealth, gpuOnHits });
  if (daemonOk && focus !== "daemon") {
    advice.push("Cross-check OpenAI port with host_reach (profile=vllm or all) from a dsh session.");
    advice.push("If GPU VRAM looks exhausted, run gpu_doctor before starting another inference stack.");
  }

  return {
    ok: daemonOk,
    which,
    context,
    serverVersion,
    gpuHint,
    gpuOnHits,
    containers: focus === "daemon" ? [] : containers,
    portHealth,
    vllmHints,
    advice,
  };
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 贡献和404/GPU/端口关键误判是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是把Docker上下文与推理相关线索集中，帮助发现“有CLI不等daemon可达”，且不执行安装/启动/删除。底层仍是命令/字符串启发式，不是服务健康验收。

probeHttpHealth把所有>0且<500状态算ok，包括401/404，buildVllmHints先if ok，后面的404专门提示分支在生产probe结果下不可到达；与包描述404不等APIready的意图冲突。只等response头，不读models JSON/认证/模型列表，HTTP200错误页面也ok。顶层ok只daemonVersion非空，即API失败仍可整条ok。

containerHasGpuRuntime只正则匹配DeviceRequests字段字样，空数组/null也可true，不解析非空device/capabilities；最多3候选anyGpu为true不代表每个候选或实际CUDA可用。parseContainers把8000/tcp内部暴露也叫publishes8000，不要求宿主发布；实际映射18000->8000或远程context仍只探本机8000，可能探错服务。名字含openai/llm也仅候选。

run把全部CLI异常吞为空串，不保退出码/stderr/timeout，空列表可来自权限/失败而非无容器。每条命令固定15秒且顺序多次，外层工具timeout默认15秒，执行未传exec.signal；Host取消/总deadline不能保证终止剩余诊断。

#### 证据与依据

**依据 1 · 源码核查**：[lib/docker.js:87-98](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/lib/docker.js#L87-L98)

HTTP小于500全ok。

<details>
<summary>查看原文（12行）</summary>

```text
export async function probeHttpHealth(url, { timeoutMs = 2500, fetchFn = fetch } = {}) {
  try {
    const res = await fetchFn(url, { signal: AbortSignal.timeout(timeoutMs) });
    return { ok: res.status > 0 && res.status < 500, status: res.status, error: "", url };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : String(err),
      url,
    };
  }
```

</details>

**依据 2 · 源码核查**：[lib/docker.js:118-129](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/lib/docker.js#L118-L129)

404分支被ok遮蔽。

<details>
<summary>查看原文（12行）</summary>

```text
  if (portHealth) {
    if (portHealth.ok) {
      hints.unshift(`HTTP health ${portHealth.url} → status ${portHealth.status}.`);
    } else if (Number(portHealth.status) === 404) {
      hints.unshift(
        `HTTP ${portHealth.url} → 404: TCP/publish open but /v1/models not ready (wrong image, still loading, or non-OpenAI listener). Align with host_reach apiReady=false; check logs then host_reach profile=vllm.`,
      );
    } else {
      hints.unshift(
        `HTTP health ${portHealth.url} failed (${portHealth.error || portHealth.status}). Port publish ≠ API ready — check logs; then host_reach profile=vllm.`,
      );
    }
```

</details>

**依据 3 · 源码核查**：[lib/docker.js:218-226](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/lib/docker.js#L218-L226)

总ok仅daemon。

```text
  return {
    ok: daemonOk,
    which,
    context,
    serverVersion,
    gpuHint,
    gpuOnHits,
    containers: focus === "daemon" ? [] : containers,
    portHealth,
```

**依据 4 · 源码核查**：[lib/docker.js:82-84](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/lib/docker.js#L82-L84)

GPU仅字段正则。

```text
export function containerHasGpuRuntime(inspectJson) {
  const text = typeof inspectJson === "string" ? inspectJson : JSON.stringify(inspectJson || {});
  return /HostConfig.*?Runtime.*?nvidia|"Runtime"\s*:\s*"nvidia"|DeviceRequests|nvidia.com\/gpu/i.test(text);
```

**依据 5 · 源码核查**：[lib/docker.js:64-79](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/lib/docker.js#L64-L79)

端口/名称启发式。

<details>
<summary>查看原文（16行）</summary>

```text
function parseContainers(psOut) {
  if (!psOut) return [];
  return psOut
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = "", image = "", ports = ""] = line.split("\t");
      const publishes8000 = /(?:^|[\s,])(?:0\.0\.0\.0:|:::|127\.0\.0\.1:)?8000->|\b8000\/tcp\b/.test(ports);
      return { name, image, ports, publishes8000 };
    });
}

function looksLikeVllm(c) {
  const blob = `${c.name} ${c.image} ${c.ports}`.toLowerCase();
  return /vllm|openai|8000|llm/.test(blob) && /8000|vllm|openai/.test(blob);
```

</details>

**依据 6 · 源码核查**：[lib/docker.js:190-208](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/lib/docker.js#L190-L208)

前三anyGPU/固定地址。

<details>
<summary>查看原文（19行）</summary>

```text
    const hits = containers.filter(looksLikeVllm);
    if (hits.length) {
      let anyGpu = false;
      let inspected = false;
      for (const c of hits.slice(0, 3)) {
        const raw = await runFn("docker", ["inspect", c.name]);
        if (raw) {
          inspected = true;
          if (containerHasGpuRuntime(raw)) anyGpu = true;
        }
      }
      if (inspected) gpuOnHits = anyGpu;
    }

    const publish8000 = containers.some((c) => c.publishes8000) || focus === "vllm";
    if (publish8000 || hits.length) {
      portHealth = await probeHttpHealth("http://127.0.0.1:8000/v1/models", {
        fetchFn: deps.fetchFn,
      });
```

</details>

**依据 7 · 源码核查**：[lib/docker.js:51-61](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/lib/docker.js#L51-L61)

吞命令错误。

<details>
<summary>查看原文（11行）</summary>

```text
async function run(cmd, args) {
  try {
    const { stdout } = await execFileAsync(cmd, args, {
      timeout: 15_000,
      encoding: "utf8",
      maxBuffer: 2 * 1024 * 1024,
    });
    return String(stdout).trim();
  } catch {
    return "";
  }
```

</details>

**依据 8 · 源码核查**：[index.js:25-29](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/index.js#L25-L29)

无signal分发。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

#### 缺口

- 当前context到被探HTTP端点的身份、完整OpenAI响应和实际GPU/模型可用性未核。
  **影响**：不能据health/GPU true判断能推理。
  **进一步探讨**：可先结构解析context/inspect映射与DeviceRequests，再核目标models/认证/受控完整请求，不探无关服务。
- 命令失败的真实退出码/权限/超时被折叠。
  **影响**：空结果不能定位根因。
  **进一步探讨**：可从每命令observed/error/unknown收据与总deadline取消入手，避免把错误误记为不存在。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、读取范围与读者流程是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

包0.2.2/Node>=18依WSL、bash、Docker CLI/daemon和对应权限；检测只env/内核，不证明Docker integration。公共wsl-host副本hash与已读一致，当前只用detectWsl。原生execFile和fetch不走Host受管subprocess/网络策略，Docker context可指远程daemon，查询可能跨本机边界。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18/DSH tools/systemPrompt | 必需 | doctor工具/指引 | 注册不等实际Docker链可用 |
| WSL/bash/Docker CLI | 必需 | context/version/ps/info/inspect | 错误变空串，需另核原因 |
| 目标Docker daemon/context权限 | 必需 | 元数据盘点 | 可远程context，localhost探测不一定同目标 |
| 原生fetch与本地/vLLM实际地址 | HTTP分支必需 | GET /v1/models | 固定127.0.0.1:8000，不跟映射/认证走 |
| 上游host_reach/gpu_doctor | 建议可选 | 深入核API/显存 | 本工具不执行/不包含它们 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 定义 | 明确CLI context/daemon位置及目标容器 | 不混Desktop/WSL/远程daemon |
| 盘点 | 先focusdaemon，再看容器字段 | 空串可能失败，不当无容器 |
| 核证 | 对照inspect结构/真实端口映射和API协议 | 404/DeviceRequests字段存在非就绪 |
| 恢复 | 按具体失败点查日志/权限/配置 | 未确认不另起推理栈/改GPU/运行示例 |

容器名/镜像/端口输出进入模型，inspect全文虽然仅正则后丢弃仍被进程读取；不要为了盘点直接提权。代码给docker run示例只是文字，不代表授权启动下载镜像或占显存；本轮不运行任何命令/HTTP。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-4](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/package.json#L1-L4)

版本。

```text
{
  "name": "dsh-wsl-docker",
  "version": "0.2.2",
  "description": "Docker Desktop vs WSL context doctor; vLLM :8000 health with HTTP 404 ≠ API ready.",
```

**依据 2 · 源码核查**：[package.json:16-18](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/package.json#L16-L18)

Node。

```text
  "engines": {
    "node": ">=18"
  },
```

**依据 3 · 源码核查**：[lib/wsl-host.js:21-27](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/lib/wsl-host.js#L21-L27)

检测。

```text
export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) return true;
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
  }
```

**依据 4 · 源码核查**：[lib/docker.js:151-167](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/lib/docker.js#L151-L167)

原生CLIcontext。

<details>
<summary>查看原文（17行）</summary>

```text
  const which = await runFn("bash", ["-lc", "command -v docker || true"]);
  if (!which) {
    return {
      ok: false,
      error: "docker CLI not found in WSL",
      containers: [],
      vllmHints: buildVllmHints([], { daemonOk: false }),
      portHealth: null,
      advice: [
        "Install Docker Engine in WSL, or install Docker Desktop and enable WSL integration.",
        "For local LLM ports without Docker, use host_reach (Ollama/LM Studio/llama-server).",
      ],
    };
  }

  const context = await runFn("docker", ["context", "show"]);
  const serverVersion = await runFn("docker", ["version", "--format", "{{.Server.Version}}"]);
```

</details>

**依据 5 · 源码核查**：[lib/docker.js:194-208](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/lib/docker.js#L194-L208)

inspect/HTTP。

<details>
<summary>查看原文（15行）</summary>

```text
      for (const c of hits.slice(0, 3)) {
        const raw = await runFn("docker", ["inspect", c.name]);
        if (raw) {
          inspected = true;
          if (containerHasGpuRuntime(raw)) anyGpu = true;
        }
      }
      if (inspected) gpuOnHits = anyGpu;
    }

    const publish8000 = containers.some((c) => c.publishes8000) || focus === "vllm";
    if (publish8000 || hits.length) {
      portHealth = await probeHttpHealth("http://127.0.0.1:8000/v1/models", {
        fetchFn: deps.fetchFn,
      });
```

</details>

**依据 6 · 源码核查**：[lib/docker.js:136-142](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/lib/docker.js#L136-L142)

示例仅hints。

```text
  if (!hits.length) {
    hints.unshift(
      "No obvious vLLM/OpenAI container on :8000. Example: docker run --gpus all -p 8000:8000 vllm/vllm-openai:latest --model <HF_ID>",
    );
  } else {
    hints.unshift(
      `Possible vLLM-related container(s): ${hits.map((c) => c.name).join(", ")}. Confirm /v1 with host_reach (profile=vllm).`,
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 三阶段成本和效果如何评价？

**研究主题**：效果与总成本

#### 完整回答

代码只查询而不启动GPU/容器，所以本轮诊断不必产生模型推理费；仍有多个Docker CLI进程、daemon查询/可能远程延迟、inspect输出与模型阅读。每条命令2MiB缓冲、15秒timeout有局部上限，但最多多次串行不是总15秒。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | WSL/Docker环境，金额未知 | context/权限/端点定位 | 不自动安装/启动容器 |
| 持续使用 | 顺序最多多次15秒CLI与2.5秒HTTP | 阅读候选/对照真实GPU/模型协议 | 外层默认15秒不覆盖最坏总链 |
| 失败恢复 | 重查daemon/容器日志/端点 | 区分CLI错误/空结果/API错误 | 不据空串/health ok盲改环境 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| daemon初筛 | CLI路径/context/serverVersion | 每条命令真实错误与目标身份 |
| 推理候选 | 名称/镜像/端口启发式 | 实际vLLM/模型/GPU工作状态 |
| API线索 | 固定地址HTTP状态 | OpenAI协议/认证/模型加载/完整任务 |

相较手动context/version/ps/inspect，统一入口可能省接线，但误把404/GPU字段/内部端口当就绪可浪费后续排障或另起栈成本。效益要计正确定位率和避免错误修复的人时，不能只统计doctor ok。

#### 证据与依据

**依据 1 · 源码核查**：[lib/docker.js:51-61](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/lib/docker.js#L51-L61)

局部timeout/buffer。

<details>
<summary>查看原文（11行）</summary>

```text
async function run(cmd, args) {
  try {
    const { stdout } = await execFileAsync(cmd, args, {
      timeout: 15_000,
      encoding: "utf8",
      maxBuffer: 2 * 1024 * 1024,
    });
    return String(stdout).trim();
  } catch {
    return "";
  }
```

</details>

**依据 2 · 源码核查**：[lib/docker.js:166-208](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/lib/docker.js#L166-L208)

串行诊断链。

<details>
<summary>查看原文（43行）</summary>

```text
  const context = await runFn("docker", ["context", "show"]);
  const serverVersion = await runFn("docker", ["version", "--format", "{{.Server.Version}}"]);
  const daemonOk = Boolean(serverVersion);
  const advice = [];
  if (!daemonOk) advice.push("CLI present but daemon not reachable — start Docker Desktop or dockerd.");
  if (/desktop/i.test(context)) advice.push("Context looks like Docker Desktop.");
  else if (context) advice.push(`Active context: ${context}`);

  let containers = [];
  let gpuHint = "";
  let gpuOnHits = null;
  let portHealth = null;
  if (daemonOk && focus !== "daemon") {
    const ps = await runFn("docker", [
      "ps",
      "--format",
      "{{.Names}}\t{{.Image}}\t{{.Ports}}",
    ]);
    containers = parseContainers(ps);
    if (focus === "vllm") containers = containers.filter((c) => looksLikeVllm(c) || c.publishes8000);
    const runtime = await runFn("docker", ["info", "--format", "{{.Runtimes}}"]);
    if (/nvidia/i.test(runtime)) gpuHint = "nvidia runtime present";
    else gpuHint = "nvidia runtime not obvious — check Docker Desktop GPU / nvidia-container-toolkit";

    const hits = containers.filter(looksLikeVllm);
    if (hits.length) {
      let anyGpu = false;
      let inspected = false;
      for (const c of hits.slice(0, 3)) {
        const raw = await runFn("docker", ["inspect", c.name]);
        if (raw) {
          inspected = true;
          if (containerHasGpuRuntime(raw)) anyGpu = true;
        }
      }
      if (inspected) gpuOnHits = anyGpu;
    }

    const publish8000 = containers.some((c) => c.publishes8000) || focus === "vllm";
    if (publish8000 || hits.length) {
      portHealth = await probeHttpHealth("http://127.0.0.1:8000/v1/models", {
        fetchFn: deps.fetchFn,
      });
```

</details>

**依据 3 · 源码核查**：[lib/docker.js:218-229](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/lib/docker.js#L218-L229)

总ok语义。

<details>
<summary>查看原文（12行）</summary>

```text
  return {
    ok: daemonOk,
    which,
    context,
    serverVersion,
    gpuHint,
    gpuOnHits,
    containers: focus === "daemon" ? [] : containers,
    portHealth,
    vllmHints,
    advice,
  };
```

</details>

#### 缺口

- 无daemon拓扑/映射/错误场景的误判率、总延迟与手工诊断人时对照。
  **影响**：不能承诺快速定位或准确健康结论。
  **进一步探讨**：可用固定命令响应/404/空GPU/remotecontext夹具核状态，再测受控只读诊断总资源和恢复人时。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程点、分级就绪收据假设与采用结论？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

纯core/Host注册分离、focus缩小读取、execFile固定参数、依赖注入run/fetch便于受控材料核查、只读建议分开，均可复用。问题在一组强命名布尔压平了错误与就绪层级。

可探讨未验证的“daemon/容器/GPU/API分级收据”。每条命令保退出码/错误/时间与目标context；解析inspect JSON实际非空设备请求/PortBindings，区分内部exposed与宿主published，选择同daemon实际映射地址。HTTP区分可达/鉴权/协议正确/models存在/受控推理，各有unknown/不自动升级；404应明确非APIready，200需schema，不把anyGPU泛化所有容器。加总deadline和signal。相对当前正则/固定端口，可减少错服务和假绿灯；代价是Docker/平台版本解析、权限与受控验证开销。用DeviceRequests空/null、404/401/200HTML、18000映射、远程context、ps失败及慢命令反例研究；任一仍称API/GPU就绪则否证该收据实现，先修谓词。

推荐observe。只读盘点整合有价值，但HTTP404、GPU/端口误判与吞错误需先修，现有ok不能用于判断推理栈可用。继续从结构解析/分层状态/目标映射入手，再评估受控试用；错目标、异常当空、API非协议却ok或超时未停止即停，不据此启动新容器/改GPU或填生产baseURL。

#### 证据与依据

**依据 1 · 源码核查**：[lib/docker.js:148-150](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/lib/docker.js#L148-L150)

依赖注入。

```text
export async function execute(args = {}, deps = {}) {
  const focus = ["all", "daemon", "vllm"].includes(args?.focus) ? args.focus : "all";
  const runFn = deps.run || run;
```

**依据 2 · 源码核查**：[lib/docker.js:87-98](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/lib/docker.js#L87-L98)

就绪谓词起点。

<details>
<summary>查看原文（12行）</summary>

```text
export async function probeHttpHealth(url, { timeoutMs = 2500, fetchFn = fetch } = {}) {
  try {
    const res = await fetchFn(url, { signal: AbortSignal.timeout(timeoutMs) });
    return { ok: res.status > 0 && res.status < 500, status: res.status, error: "", url };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : String(err),
      url,
    };
  }
```

</details>

**依据 3 · 源码核查**：[lib/docker.js:64-84](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/lib/docker.js#L64-L84)

结构解析起点。

<details>
<summary>查看原文（21行）</summary>

```text
function parseContainers(psOut) {
  if (!psOut) return [];
  return psOut
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = "", image = "", ports = ""] = line.split("\t");
      const publishes8000 = /(?:^|[\s,])(?:0\.0\.0\.0:|:::|127\.0\.0\.1:)?8000->|\b8000\/tcp\b/.test(ports);
      return { name, image, ports, publishes8000 };
    });
}

function looksLikeVllm(c) {
  const blob = `${c.name} ${c.image} ${c.ports}`.toLowerCase();
  return /vllm|openai|8000|llm/.test(blob) && /8000|vllm|openai/.test(blob);
}

export function containerHasGpuRuntime(inspectJson) {
  const text = typeof inspectJson === "string" ? inspectJson : JSON.stringify(inspectJson || {});
  return /HostConfig.*?Runtime.*?nvidia|"Runtime"\s*:\s*"nvidia"|DeviceRequests|nvidia.com\/gpu/i.test(text);
```

</details>

**依据 4 · 源码核查**：[lib/docker.js:190-208](https://github.com/173787247/dsh-wsl-docker/blob/89b19c3428df8dffa4c6771050e774bf1f1eb22b/lib/docker.js#L190-L208)

目标/层级起点。

<details>
<summary>查看原文（19行）</summary>

```text
    const hits = containers.filter(looksLikeVllm);
    if (hits.length) {
      let anyGpu = false;
      let inspected = false;
      for (const c of hits.slice(0, 3)) {
        const raw = await runFn("docker", ["inspect", c.name]);
        if (raw) {
          inspected = true;
          if (containerHasGpuRuntime(raw)) anyGpu = true;
        }
      }
      if (inspected) gpuOnHits = anyGpu;
    }

    const publish8000 = containers.some((c) => c.publishes8000) || focus === "vllm";
    if (publish8000 || hits.length) {
      portHealth = await probeHttpHealth("http://127.0.0.1:8000/v1/models", {
        fetchFn: deps.fetchFn,
      });
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
