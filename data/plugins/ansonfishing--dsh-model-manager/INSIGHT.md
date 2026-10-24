# dsh-model-manager

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[d9c6b17](https://github.com/Ansonfishing/dsh-model-manager/tree/d9c6b17c2a71528bbdd3faf9b7eb506cb7854dff)

<!-- BEGIN META -->
[![npm 30d 311](https://img.shields.io/static/v1?label=npm+30d&message=311&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-model-manager) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-model-manager)
<!-- END META -->

> **实现功能**：在 DSH 管理本地推理服务、参数 Profile、GPU 检测和性能测试。

> **核心亮点**：将终端参数、服务登记和测速聚合为 DSH 工作流，框架 adapter 与校验分层便于维护；贡献为操作集成，未证明降低 OOM 或提升推理吞吐。[Q01](#research-q01) [Q02](#research-q02)

> **风险与缺陷**：托管停止只检查 PID 存活，死 PID 又退为端口 fuser，可能作用于复用进程或新占用者；11437 没有服务端硬保护。KV warning 也不包含权重和多卡完整预算。均是静态边界，未实测损害。[Q03](#research-q03)

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
  - [Q01 · 管理器如何改变本地推理工作流？](#detail-section-11)
  - [Q02 · Profile、启动停止与测速怎样接线？](#detail-section-12)
  - [Q03 · 停止与估算能保证什么，采用成本是什么？](#detail-section-13)
  - [Q04 · 能否以进程租约提高停止可靠性？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：同时维护多套本地推理服务的用户可集中管理端口、参数与测速，仍需框架和设备运维知识。[Q01](#research-q01)

终端脚本和框架原生命令可完成相同底层操作；插件贡献在组织与提示，不替代框架正确性和运维责任。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 服务登记与健康 | 集中查看推理实例 | 登记不等于启动或所有权证明 |
| 托管启动 | 从Profile启动框架 | 可执行文件、权重及GPU就绪 |
| 停止服务 | 终止登记PID或端口 | 有复用风险，外部需force |
| 参数Profile | 留存、加载和导入配置 | 校验有警告与硬错误之分 |
| GPU检测与KV预警 | 辅助资源配置 | KV未含权重，多卡估算受限 |
| 短请求测速 | 记录请求吞吐 | 含总响应时延，非纯decode |
| 满上下文热测速 | 对照长上下文表现 | 服务容量与框架接口需匹配 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools、webServer 与 Web slots | 启动必需 | 工具路由和面板 | 对应入口不可用 |
| 框架可执行文件与权重 | 启动推理必需 | llama/SGLang/vLLM | 服务不起 |
| CUDA/python 或 nvidia-smi | GPU检测必需 | 卡与容量信息 | 检测降级，校验可能跳过 |
| kill/fuser 与进程权限 | 停止必需 | PID或端口终止 | 失败需人工处理 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 运维者配置框架、模型与设备 | 原生命令可运行 |
| 登记 | 用户保存 Profile 与服务 | 参数校验、端口身份一致 |
| 测试 | 用户隔离启动和测速 | 健康与实际指标符合口径 |
| 停止 | 运维者核对目标后执行 | 仅目标服务退出，异常人工接管 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | GPU、权重、框架环境，金额未知 | 配置可执行文件与模型参数，耗时未知 | 设备与框架各自兼容 |
| 持续使用 | 电力、显存、测速请求资源未知 | 复核 Profile 与性能口径 | KV 估算不是完整预算 |
| 失败恢复 | 重启和重测资源未知 | 核对 PID/端口、恢复服务 | 可能中断当前推理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 参数集中管理 | Profile 保存与 adapter | 实际配置正确率和节时 |
| 性能测量 | 短请求与热测量机制 | 跨框架同条件可比性 |
| 资源预警 | KV 粗估 warning | 权重、多卡与真实 OOM 预测 |
| 精确停止 | 比名称 pkill 范围窄 | PID/端口复用下所有权保障 |

> **思考**：托管停止只检查 PID 存活，死 PID 又退为端口 fuser，可能作用于复用进程或新占用者；11437 没有服务端硬保护。KV warning 也不包含权重和多卡完整预算。均是静态边界，未实测损害。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将终端参数、服务登记和测速聚合为 DSH 工作流，框架 adapter 与校验分层便于维护；贡献为操作集成，未证明降低 OOM 或提升推理吞吐。[Q01](#research-q01) [Q02](#research-q02)

将终端参数、服务登记和测速聚合为 DSH 工作流，框架 adapter 与校验分层便于维护；贡献为操作集成，未证明降低 OOM 或提升推理吞吐。[Q01](#research-q01) [Q02](#research-q02)

adapter、校验和执行依赖分离值得复用，持久化 Profile 能保留操作上下文。停止精度不能只由不使用 pkill 推出，必须补进程身份与各入口授权一致性；短测速也需标明总请求口径。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

托管停止只检查 PID 存活，死 PID 又退为端口 fuser，可能作用于复用进程或新占用者；11437 没有服务端硬保护。KV warning 也不包含权重和多卡完整预算。均是静态边界，未实测损害。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在隔离端口登记已有服务、保存参数并核对测速口径。停止前独立检查 PID 和端口当前占用者，关键共享推理服务先用原生运维流程。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

集中管理机制有源码支持；进程所有权与显存准入保障有限，真实硬件及宿主未验证。租约方案为假设。

- 已检查：作者 README、包清单、源码路径 index.js、lib/lifecycle.js、lib/safety.js、lib/validate.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Host 入口、生命周期、停止计划和校验源码；未执行目标代码、进程操作或硬件测试。
- 下一步：隔离端口核查启动失败、PID复用、端口抢占、停止确认、显存预测和两种测速口径，未执行。

**分析版本**

- **仓库**：[Ansonfishing/dsh-model-manager](https://github.com/Ansonfishing/dsh-model-manager)
- **版本号**：1.0.0（[固定提交 d9c6b17](https://github.com/Ansonfishing/dsh-model-manager/tree/d9c6b17c2a71528bbdd3faf9b7eb506cb7854dff)）
- **版本日期**：2026-09-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可把进程身份租约和入口一致的确认契约加入 stop，身份不符即拒绝端口级自动停止；以复用与抢占验证不误伤，若正常恢复代价过大则否定。未实现。[Q04](#research-q04)

隔离端口核查启动失败、PID复用、端口抢占、停止确认、显存预测和两种测速口径，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 237 | — | — | 2213 |
| .js | source | 12 | 3903 | 3431 | 346 | — |
| .mjs | test | 12 | 2023 | 1565 | 285 | — |
| .js | test | 3 | 2332 | 2129 | 181 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Ansonfishing/dsh-model-manager/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-24。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：检验集中管理推理服务的增量及停止、资源校验的可靠性边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 管理器如何改变本地推理工作流？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标用户是维护多套 llama.cpp、SGLang 或 vLLM 本地服务的人，反复需要找启动参数、识别 GPU 与端口并比较性能。合格交付是目标服务用可追溯参数运行、能检查健康与性能且停止时不影响其他任务。相对终端历史和笔记，它把服务注册、命名参数和测速放到 DSH 面板及模型工具入口，改变的是操作与参数整理流程，没有增加推理引擎本身能力。Profile 的模型框架 GPU 组合和参数来源说明有助于减少重新拼命令，但真实节时和减少 OOM 需要同设备任务验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-37](https://github.com/Ansonfishing/dsh-model-manager/blob/d9c6b17c2a71528bbdd3faf9b7eb506cb7854dff/README.md#L9-L37)

作者列明多框架管理、Profile、GPU 与测速任务。

<details>
<summary>查看原文（29行）</summary>

````text
## 为什么

本地同时跑几个推理服务(llama.cpp / SGLang / vLLM)时,参数散落在终端历史和笔记本里:这个模型该配哪套 `-c` / `-np`?显存到底够不够?哪个框架在这张卡上能起?

装好本插件,这些答案都在一个面板里:

- 之前:翻终端历史、手动算 KV、等 OOM 才知道配置超了;
- 之后:服务注册表一眼看清谁在哪张卡上跑,参数 Profile 保存前就校验显存,一键测速对比 tok/s。

## 快速开始

**前提**:DSH(带 web)+ pnpm;GPU 检测需要 python3(缺失时自动回退 `nvidia-smi`)。

```bash
cd ~/.dsh/profiles/web                      # 你的 DSH web profile 目录
pnpm add github:Ansonfishing/dsh-model-manager
```

然后在 `package.json` 的 `dsh.profile.bundles` 数组里加上 `"dsh-model-manager"`,重启 `dsh`。会话视图出现「模型管理」tab,就好了。

## 功能

- **服务注册表**——登记本地推理服务(端口、框架、模型、GPU),健康检查实时显示,一键停止。
- **参数 Profile**——每个「模型 × 框架 × GPU」组合的命名参数版本(llama.cpp / SGLang / vLLM)。参数表按 9 个逻辑组固定排序(模型→上下文→KV→投机解码→采样→性能→并行→服务→其他);同模型×同框架的不同量化按参数并集展示、行位对齐,本版本未设的参数以灰行标注「其他量化:值」,量化间差异一眼可见。推荐值走「同量化实跑值 → 同模型兄弟量化 → 官方最佳实践」三级溯源链,每格标注来源,无依据不臆造。
- **GPU 检测**——自动枚举显卡(`libcuda` 主源,`nvidia-smi` 回退);卡编号 = `CUDA_VISIBLE_DEVICES` 值。
- **显存校验**——保存 Profile 时按 `-c` / `-np` 估算 KV 占用,超出目标卡容量立刻 warning。
- **一键测速**——对已运行服务发固定 prompt(非流式 256 token),记录 tok/s;另有满上下文热测速(先校验实际可用上下文 ≥ 目标,再流式 warmup + 测量,记 TTFB / prefill / decode)。
- **安全红线**——绝不 `pkill`;停止外部服务需显式 force + 面板两次点击二次确认;11437(DSH 自身推理端口)停止时额外提示「将中断当前会话」。

````

</details>

**依据 2 · 源码核查**：[index.js:183-204](https://github.com/Ansonfishing/dsh-model-manager/blob/d9c6b17c2a71528bbdd3faf9b7eb506cb7854dff/index.js#L183-L204)

模型工具确实将登记接到 manager，非纯展示面板。

<details>
<summary>查看原文（22行）</summary>

```text
  tools.register(
    makeTool({
      name: "mm_server_register",
      description:
        "把一个已在本机运行的推理服务(llama.cpp / vLLM / SGLang)登记进模型管理器。" +
        "参数:port(必填)、framework(llama|vllm|sglang,必填)、model(模型显示名)、gpu(CUDA_VISIBLE_DEVICES 值;" +
        "取值为 CUDA 设备序号 0/1/…,双卡传 \"1,0\" 字符串,以面板「获取显卡」检测的实际落卡为准)、note(备注)。" +
        "只登记不启动;健康状态用 mm_server_list 查看。",
      parameters: {
        type: "object",
        properties: {
          port: { type: "number", description: "服务端口(1–65535)" },
          framework: { type: "string", enum: ["llama", "vllm", "sglang"] },
          model: { type: "string", description: "模型显示名" },
          gpu: { type: ["number", "string"], description: "CUDA_VISIBLE_DEVICES 值(0/1/…,双卡 \"1,0\")" },
          note: { type: "string", description: "备注" },
        },
        required: ["port", "framework"],
      },
      async execute(args) {
        const e = manager.register(args);
        return `已登记:${e.port} [${e.framework}] ${e.model || "-"}(managed=${e.managed}${e.gpu !== null && e.gpu !== undefined ? `, gpu=${e.gpu}` : ""})`;
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Profile、启动停止与测速怎样接线？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

saveProfile 从注册表和 GPU 检测值取得校验上下文，errors 阻断、warnings 提示，按名称更新持久化 Profile。start 从 Profile 和框架 adapter 拼启动参数并 spawn，保存 pid 和服务登记。stop 先依服务登记形成 kill 或 fuser argv，执行后移除登记。外部服务要求 force，托管服务按 PID 存活判断走 TERM，否则退为端口 fuser。固定短测速发本地 OpenAI 兼容请求，并以返回 completion_tokens 与总响应时间计算 tok/s，因此它混合了请求延迟和生成过程，不是纯解码速度；满上下文热测速是另一个口径，不能混排。该分层便于替换 adapter 和执行依赖，仍需 Linux 工具、CUDA/python 或 nvidia-smi、框架可执行文件、模型权重及设备容量。

#### 证据与依据

**依据 1 · 源码核查**：[lib/lifecycle.js:156-176](https://github.com/Ansonfishing/dsh-model-manager/blob/d9c6b17c2a71528bbdd3faf9b7eb506cb7854dff/lib/lifecycle.js#L156-L176)

校验和 Profile 保存可追踪到注册表、GPU 与状态。

<details>
<summary>查看原文（21行）</summary>

```text
  function saveProfile(input) {
    const reg = loadRegistry().map((e) => ({ port: e.port }));
    // 显存校验用检测值(CUDA 序编号→GiB);NVML 降级(cards=null)时不传,回退内置表
    const g = loadGpus();
    const gpuCap = g && Array.isArray(g.cards) && g.cards.length
      ? Object.fromEntries(g.cards.map((c) => [c.index, c.memGb]))
      : undefined;
    const v = validateProfile(input, { registry: reg, gpuCap });
    if (!v.ok) {
      throw new Error(`profile 校验失败 (validation): ${v.errors.join(";")}`);
    }
    const list = loadProfiles();
    const existing = list.find((p) => p.name === input.name);
    const profile = {
      ...input,
      id: existing ? existing.id : `p-${Date.now()}-${randomUUID().slice(0, 8)}`,
      active: existing ? existing.active : false,
      updatedAt: new Date().toISOString(),
    };
    if (existing) {
      list.splice(list.indexOf(existing), 1, profile);
```

</details>

**依据 2 · 源码核查**：[lib/lifecycle.js:520-576](https://github.com/Ansonfishing/dsh-model-manager/blob/d9c6b17c2a71528bbdd3faf9b7eb506cb7854dff/lib/lifecycle.js#L520-L576)

托管启动形成真实子进程与 PID 登记。

<details>
<summary>查看原文（57行）</summary>

```text
  function start({ profile: ref, port, gpu } = {}) {
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error(`port 非法: ${port}`);
    }
    const prof = loadProfiles().find((p) => p.id === ref || p.name === ref);
    if (!prof) throw new Error(`profile 不存在 (not found): ${ref}`);
    if (!adapters[prof.framework]) {
      throw new Error(`未知 framework (unknown): ${prof.framework}(支持 llama / sglang / vllm)`);
    }
    let reg = loadRegistry();
    const existing = reg.find((e) => e.port === port);
    if (existing) {
      // 死托管记录自动清理:managed 且记录的 pid 已亡(或无 pid)→ 删除后继续启动。
      // 外部(非托管)条目维持原拒绝——面板走「停止(fuser)」清理,不替用户盲删。
      const staleManaged = existing.managed && (existing.pid == null || !pidAlive(Number(existing.pid)));
      if (!staleManaged) {
        throw new Error(`port ${port} 已被注册表占用 (in use)`);
      }
      saveRegistry(reg.filter((e) => e.port !== port));
    }
    // gpu 口径 = CUDA_VISIBLE_DEVICES 值:显式传参优先;缺省取 profile.gpu;再缺省 0。
    // 双卡表达:gpu 为 null 或字符串 "1,0"(多卡逗号串)直接透传;单卡仍为数字 0/1。
    const g = gpu !== undefined
      ? (gpu === null ? "1,0" : gpu)
      : (prof.gpu !== undefined ? (prof.gpu === null ? "1,0" : prof.gpu) : 0);
    const built = getAdapter(prof.framework).buildArgs(prof, { port });
    // exe 解析链:profile.exePath → frameworks.json[fw].exe → adapter.defaultExe
    const fwExe = ((loadFrameworks()[prof.framework]) || {}).exe || "";
    const exe = (prof.exePath || fwExe) || built.exe;
    const args = built.args;
    // flashinfer-python 与 flashinfer-cubin 版本不一致时,sglang/vllm import 即崩
    // (实测事故:flashinfer-python 与 flashinfer-cubin 版本不一致 → import 即 RuntimeError)。
    // 与手动启动命令一致地跳过 cubin 版本检查;根本修复=pip 对齐版本。
    const skipFlashinferCheck = prof.framework === "sglang" || prof.framework === "vllm";
    const opts = {
      cwd: home,
      env: {
        ...process.env,
        CUDA_VISIBLE_DEVICES: String(g),
        ...(skipFlashinferCheck ? { FLASHINFER_DISABLE_VERSION_CHECK: "1" } : {}),
      },
      port,
    };
    const child = spawnImpl(exe, args, opts);
    const pid = child && child.pid;
    if (!pid) throw new Error("spawn 未返回 pid,无法登记托管");
    writeFileSync(join(home, "servers", `${port}.pid`), String(pid));
    register({
      port,
      framework: prof.framework,
      model: prof.model || prof.name,
      gpu: g,
      note: `managed:${prof.name}`,
      managed: true,
      pid,
    });
    return loadRegistry().find((e) => e.port === port);
```

</details>

**依据 3 · 源码核查**：[lib/lifecycle.js:302-332](https://github.com/Ansonfishing/dsh-model-manager/blob/d9c6b17c2a71528bbdd3faf9b7eb506cb7854dff/lib/lifecycle.js#L302-L332)

短测速用完整请求耗时与 completion_tokens，限定性能含义。

<details>
<summary>查看原文（31行）</summary>

```text
    const t0 = Date.now();
    let res;
    try {
      res = await fetch(`${base}/v1/chat/completions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model: model || reg.model || "local",
          messages: [{ role: "user", content: BENCH_PROMPT }],
          max_tokens: Number(maxTokens) || 256,
          temperature: 0.8,
          stream: false,
        }),
        signal: AbortSignal.timeout(180000),
      });
    } catch (err) {
      throw new Error(`测速请求失败 (request failed): ${err instanceof Error ? err.message : String(err)}`);
    }
    const ms = Date.now() - t0;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`测速失败 (http ${res.status}): ${JSON.stringify(data).slice(0, 200)}`);
    const tokens = data.usage && data.usage.completion_tokens;
    if (!Number.isInteger(tokens) || tokens < 1) {
      throw new Error("服务未返回 usage.completion_tokens(usage missing),无法计速");
    }
    const tps = ms > 0 ? Math.round(((tokens - 1) / (ms / 1000)) * 10) / 10 : null;
    const entry = {
      at: new Date().toISOString(), port, profile, model,
      tokens, ms, tps, maxTokens: Number(maxTokens) || 256,
    };
    saveBench([...loadBench(), entry]);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 停止与估算能保证什么，采用成本是什么？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

停止策略比 pkill 名称匹配更窄，但并不等于已验证进程所有权。托管 PID 仅用 kill(pid,0) 判断存活，未核对启动时间或可执行文件；PID 复用时可能命中其他进程。托管记录的 PID 已死时会直接 fuser -k 端口，不要求外部 force，端口若被新服务占用就可能停止新占用者。保护端口数组为空，11437 只是 UI 提示，工具路径没有第二次点击语义，不能把面板护栏当全部入口保障。显存估算只计算 KV，不含权重，多卡直接跳过单卡 warning；没有警告不表示可启动。采用成本包括权重存储、GPU显存电力、框架环境、参数复核及失败重启，金额耗时未知。适合已有 Linux/CUDA 运维能力者先用登记和 Profile，再在隔离端口验证停止；不适合把 warning 当准入证明或自动管理关键共享服务。

#### 证据与依据

**依据 1 · 源码核查**：[lib/safety.js:4-17](https://github.com/Ansonfishing/dsh-model-manager/blob/d9c6b17c2a71528bbdd3faf9b7eb506cb7854dff/lib/safety.js#L4-L17)

保护集合为空，PID 仅检测存活而非身份。

<details>
<summary>查看原文（14行）</summary>

```text
/** 受保护端口(仅作 UI 标记,不阻断停止)。当前为空——所有端口一视同仁。 */
export const DEFAULT_PROTECTED_PORTS = [];

/** 真实 pid 存活检查:kill(pid, 0) 探测;EPERM=存活(无权限),ESRCH=不存在。 */
export function realPidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return !!(err && err.code === "EPERM");
  }
}

```

</details>

**依据 2 · 源码核查**：[lib/safety.js:42-56](https://github.com/Ansonfishing/dsh-model-manager/blob/d9c6b17c2a71528bbdd3faf9b7eb506cb7854dff/lib/safety.js#L42-L56)

托管死 PID 退为 fuser，不需 force，说明端口重占条件风险。

<details>
<summary>查看原文（15行）</summary>

```text

  if (!entry) {
    throw new Error(`port ${port} 未注册 (unregistered),拒绝盲杀——请先 mm_server_register`);
  }
  if (entry.managed) {
    if (entry.pid && pidAlive(entry.pid)) {
      return ["kill", "-TERM", String(entry.pid)];
    }
    return ["fuser", "-k", `${port}/tcp`];
  }
  if (!force) {
    throw new Error(`port ${port} 是外部服务(非本插件启动),需 force=true 确认后用 fuser -k 停止`);
  }
  return ["fuser", "-k", `${port}/tcp`];
}
```

</details>

**依据 3 · 源码核查**：[lib/validate.js:71-89](https://github.com/Ansonfishing/dsh-model-manager/blob/d9c6b17c2a71528bbdd3faf9b7eb506cb7854dff/lib/validate.js#L71-L89)

KV 粗估排除权重，多卡跳过，限定预防 OOM 的承诺。

<details>
<summary>查看原文（19行）</summary>

```text
  // KV 显存粗估:llama 用 -c 总预算,其他框架用 contextWindow(单请求预算)
  const ctxTokens = profile.framework === "llama"
    ? Number(val("-c")) || 0
    : Number(profile.contextWindow) || 0;
  const kvBytesPerToken = Number(profile.kvBytesPerToken) || 65536; // 缺省按 bf16 上限估
  // 显存容量:优先检测值(gpuCap,编号=CUDA 序),缺省回退内置表
  // 双卡:gpu 为字符串(如 "1,0")或 null 时不单卡估(多卡合计容量不适用单卡公式),跳过单卡 warning
  const singleGpu = Number.isInteger(profile.gpu) ? profile.gpu : null;
  const cap = singleGpu !== null
    ? (gpuCap && Number.isFinite(gpuCap[singleGpu]) ? gpuCap[singleGpu] : GPU_CAP_GB[singleGpu])
    : undefined;
  if (ctxTokens > 0 && cap) {
    const kvGb = (ctxTokens * kvBytesPerToken) / 1e9;
    if (kvGb > cap - 1) {
      warnings.push(
        `KV 估算 ~${kvGb.toFixed(0)}G,超出 GPU ${singleGpu} 的 ${cap}G 容量(KV 单独估算,` +
        `未计权重,实际 OOM 风险更高)——例:262K bf16 KV ≈ 49G,超出 48G 卡容量必崩`
      );
    }
```

</details>

#### 缺口

- 真实环境 PID/端口重占与停止后的残留行为未验证。
  **影响**：不能确认精确停止不会影响其他服务。
  **进一步探讨**：隔离环境构造旧登记与新端口占用，观察是否拒绝错误目标。
- 未测资源成本与 OOM 预测误差。
  **影响**：不能确认配置校验改善端到端启动成功率。
  **进一步探讨**：按框架和量化对照实际峰值显存与估算，计入失败恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 能否以进程租约提高停止可靠性？

**研究主题**：新假设与验证

#### 完整回答

可提出未验证的启动身份租约，在托管登记中绑定 PID、启动时间、可执行文件与随机实例令牌，停止前确认身份，PID 已亡或端口重占时默认拒绝自动 fuser。外部服务保持明确授权，所有入口共用同一确认契约。推导来自当前只验证存活与端口的限制，新增代价是跨平台身份读取、状态迁移和无法确认时的人工接管。最小验证构造 PID 复用、端口抢占、服务重启与旧登记，要求错误目标不被终止且正确服务可停止；若平台身份不可稳定取得或常使正常恢复无法办结，则设计需收窄。当前插件没有该租约，不得算现有安全保障。

#### 证据与依据

**依据 1 · 源码核查**：[lib/safety.js:7-17](https://github.com/Ansonfishing/dsh-model-manager/blob/d9c6b17c2a71528bbdd3faf9b7eb506cb7854dff/lib/safety.js#L7-L17)

存活检查缺身份绑定，是租约推导依据。

<details>
<summary>查看原文（11行）</summary>

```text
/** 真实 pid 存活检查:kill(pid, 0) 探测;EPERM=存活(无权限),ESRCH=不存在。 */
export function realPidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return !!(err && err.code === "EPERM");
  }
}

```

</details>

**依据 2 · 源码核查**：[lib/lifecycle.js:137-144](https://github.com/Ansonfishing/dsh-model-manager/blob/d9c6b17c2a71528bbdd3faf9b7eb506cb7854dff/lib/lifecycle.js#L137-L144)

统一 stop 接口可作为新契约的单一实施点。

```text
  async function stop(port, { force = false } = {}) {
    const entry = loadRegistry().find((e) => e.port === port) || null;
    // stopPlan 内部:未注册 → 托管/外部,依次判定并抛错
    const argv = stopPlan(port, entry, { force, pidAlive });
    assertNoPkill(argv);
    await execImpl(argv);
    saveRegistry(loadRegistry().filter((e) => e.port !== port));
    return { port, argv };
```

#### 缺口

- 跨平台进程身份取得与令牌传播未验证。
  **影响**：租约可行性与恢复负担未知。
  **进一步探讨**：先做 Linux 隔离原型，再评估多平台降级策略。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
