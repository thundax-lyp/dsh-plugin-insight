# DSH × Blender

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[f9f115f](https://github.com/sixtysevenlf/dsh-blender-plugin/tree/f9f115f86b3c40fbe8d3dba811283acf71df03f9)

<!-- BEGIN META -->
[![GitHub ★ 1,329](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C329&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sixtysevenlf/dsh-blender-plugin)
<!-- END META -->

> **实现功能**：将DSH连接到Blender GUI或持久无头会话，执行建模、取帧、检查和导出。

> **核心亮点**：[Q01](#research-q01)、[Q03](#research-q03) 将持久Python、实时取帧与不把skipped/degraded当pass的验收语义连接，增量是可见迭代和明确交付边界，未证明任务质量或速度胜出。

> **风险与缺陷**：[Q02](#research-q02) /act请求异常后的worker fallback不能证明GUI未执行，也不能保证两个场景等价；在响应未知时必须先对账，持久修改可能已发生。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 启动与依赖](#detail-section-4)
  - [1.4 启动步骤](#detail-section-5)
  - [1.5 成本](#detail-section-6)
  - [1.6 效果](#detail-section-7)
  - [1.7 工程亮点](#detail-section-8)
  - [1.8 主要限制](#detail-section-9)
  - [1.9 使用建议](#detail-section-10)
  - [1.10 核查说明与分析版本](#detail-section-11)
- [2 未来设计假设（未验证）](#detail-section-12)
- [3 辅助信息](#detail-section-13)
- [4 研究问题与完整回答](#detail-section-14)
  - [Q01 · GUI与headless闭环适合什么3D任务？](#detail-section-15)
  - [Q02 · 工具如何执行代码，取消与fallback有哪些边界？](#detail-section-16)
  - [Q03 · 验收gate的贡献是否足以保证3D交付？](#detail-section-17)
  - [Q04 · 安装和持久修改的成本怎样限制采用？](#detail-section-18)
  - [Q05 · 变更票据与场景快照能否降低未知结果损失？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：具备Blender验收能力的创作者在持久场景中迭代建模并核对视觉与几何交付。

人工Blender或单次Python脚本是简单基线；不把作者调用毫秒数当端到端建模收益。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Python与取帧 | 持久场景迭代 | 具有真实写入和执行权限 |
| headless worker | 无GUI交互 | 不能假定与GUI场景相同 |
| 多态gate | 拒绝未检查的假通过 | 覆盖由任务和阈值决定 |

**流程与依赖**

<a id="detail-section-4"></a>

### 1.3 启动与依赖

| 条件 | 用途 | 退路 |
|---|---|---|
| DSH与Node20+ | 工具及后端 | 先确认匹配版本 |
| Blender4/5与GUI addon | 执行和图像反馈 | headless需单独场景核对 |
| 备份与人工验收 | 控制持久修改风险 | 未知结果先查原场景 |

<a id="detail-section-5"></a>

### 1.4 启动步骤

| 步骤 | 执行者与判据 | 失败处理 |
|---|---|---|
| 一次性场景连桥 | 用户按GUI doctor核对 | 不以health代完整验收 |
| 小改动后取帧 | 用户确认同一场景和视角 | 未知响应先查结果 |
| 几何与导出验收 | 创作者核对目标标准 | degraded/skipped不交付 |

**效果与成本**

<a id="detail-section-6"></a>

### 1.5 成本

| 阶段 | 现金／资源 | 人工／时间 |
|---|---|---|
| 首次 | Node/DSH/Blender资源，未知 | addon、profile与场景配置，未知 |
| 持续 | 渲染、模型调用、存储，未知 | 视角/几何/导出复核，未知 |
| 失败恢复 | 部分渲染与重试资源，未知 | 备份恢复、GUI/worker对账，未知 |

<a id="detail-section-7"></a>

### 1.6 效果

| 任务 | 源码支持 | 缺口 |
|---|---|---|
| 持久迭代 | Python执行与取帧入口 | 实际帧延迟、任务质量 |
| 验收交付 | skipped/degraded不放行 | 检查范围和已知缺陷检出率 |

> **思考**：[Q02](#research-q02) /act请求异常后的worker fallback不能证明GUI未执行，也不能保证两个场景等价；在响应未知时必须先对账，持久修改可能已发生。

<a id="detail-section-8"></a>

### 1.7 工程亮点

> **亮点**：[Q01](#research-q01)、[Q03](#research-q03) 将持久Python、实时取帧与不把skipped/degraded当pass的验收语义连接，增量是可见迭代和明确交付边界，未证明任务质量或速度胜出。

[Q01](#research-q01)、[Q03](#research-q03) 将持久Python、实时取帧与不把skipped/degraded当pass的验收语义连接，增量是可见迭代和明确交付边界，未证明任务质量或速度胜出。

gate空包不通过、取消signal传递值得复用；但客户端取消网络不等于撤销Blender修改，迁移必须设计请求对账而非盲目fallback。

<a id="detail-section-9"></a>

### 1.8 主要限制

[Q02](#research-q02) /act请求异常后的worker fallback不能证明GUI未执行，也不能保证两个场景等价；在响应未知时必须先对账，持久修改可能已发生。

<a id="detail-section-10"></a>

### 1.9 使用建议

[Q04](#research-q04) 当前观察；先用一次性.blend场景验证GUI连接、暂停、headless和响应中断后状态，未核清前不直接接生产资产。

<a id="detail-section-11"></a>

### 1.10 核查说明与分析版本

**核查状态**：已检查源码。

已核查工具、HTTP取消、addon执行与gate聚合；未运行，未知结果风险未复现，票据快照是假设。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、runtime/gate.py、addon/dsh_blender_bridge.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定源码与作者安装材料；未运行Blender、addon、目标脚本/测试，未做视觉、加工或宿主验收。
- 下一步：隔离.blend中注入响应丢失并核对GUI/worker，另对已知视觉和装配缺陷测gate覆盖；未执行。

**分析版本**

- **仓库**：[sixtysevenlf/dsh-blender-plugin](https://github.com/sixtysevenlf/dsh-blender-plugin)
- **版本号**：2.6.1（[固定提交 f9f115f](https://github.com/sixtysevenlf/dsh-blender-plugin/tree/f9f115f86b3c40fbe8d3dba811283acf71df03f9)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-12"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证假设是场景revision与请求票据绑定、超时先查状态后重试，用响应丢失实验比较重复修改、错配和恢复成本；成本过高或无改善即停止。

隔离.blend中注入响应丢失并核对GUI/worker，另对已知视觉和装配缺陷测gate覆盖；未执行。

<a id="detail-section-13"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 32 | 9713 | — | — | 150862 |
| .md | example | 1 | 50 | — | — | 669 |
| .js | source | 4 | 5222 | 3649 | 1570 | — |
| .mjs | source | 21 | 7267 | 5777 | 1348 | — |
| .ts | source | 2 | 3383 | 2216 | 1112 | — |
| .mjs | test | 33 | 4895 | 3819 | 777 | — |
| .md | test | 1 | 241 | — | — | 3377 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/sixtysevenlf/dsh-blender-plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=19&color=737b86&logo=github)](https://github.com/sixtysevenlf/dsh-blender-plugin/issues?q=is%3Aissue+created%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z) [![近30天关闭 20](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=20&color=737b86&logo=github)](https://github.com/sixtysevenlf/dsh-blender-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z)



统计日期：2026-10-27。

<a id="detail-section-14"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查Blender持久观察修改闭环、验收语义与未知执行结果边界。

<a id="research-q01"></a>

<a id="detail-section-15"></a>

### Q01 · GUI与headless闭环适合什么3D任务？

**研究主题**：场景与需求、采用判断

#### 完整回答

面向已有Blender基础、能判断场景结果的3D创作者或技术美术，在同一GUI场景中让Agent观察画面、执行局部Python并再次看图；没有GUI时用持久headless worker。合格交付应同时满足约定视角下的外观、装配几何及导出可用性，而不是只拿到一张帧或工具ok。简单基线是人工Blender操作或一次性Python脚本。增量在持续会话的观察—局部修改—再观察，能发现离线脚本难以直接看到的问题，但美术质量与几何可靠性仍需人制定验收。作者报告的毫秒级时延未独立复现，也不能代表完整建模任务耗时。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-5](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/f9f115f86b3c40fbe8d3dba811283acf71df03f9/README.md#L5-L5)

作者限定GUI优先与持久headless fallback。

```text
DSH × Blender connects DeepSeek Harness to Blender so an agent can build, inspect, validate, and export 3D scenes in a real Blender session. The normal workflow is GUI-first: start Blender, connect the addon, and let the agent look, change, and verify. When no GUI is available, a persistent headless session provides the same interactive loop, including frames.
```

**依据 2 · 作者声明**：[README.md:19-27](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/f9f115f86b3c40fbe8d3dba811283acf71df03f9/README.md#L19-L27)

功能主张中的观察、装配和同视角验收，未当运行证据。

```text

- **GUI-first interactive modeling.** The agent works against the Blender session you are looking at. It can inspect the scene, run Python in a persistent kernel, take a viewport or custom-angle frame, and iterate one step at a time.
- **Headless fallback with visual feedback.** If Blender has no GUI, start a persistent worker and the agent can still execute code and get Workbench frames. This is a fallback path, not the default; it exists so the agent is never blind.
- **Reference-image measurement.** Measure silhouettes, holes, symmetry, readable features, and scale from a reference image before modeling. If no scale is known, the tools return pixel units instead of inventing millimeters.
- **Assembly audit and repair.** Validate an assembly manifest, classify clashes, hidden overlaps, contacts, gaps, floating parts, and contained parts, apply safe repairs, gate the result, and export GLB, FBX, or OBJ with a manifest and merge ledger.
- **Blockout and video-reference packs.** Build low-poly blockouts from declarative parts, render orthographic and perspective reference views, and produce a turntable MP4 for video models such as Seedance.
- **Visual acceptance and delivery gates.** Compare renders against references from the same camera, report defects with crops and measurements, run defect-injection evaluation, and block delivery when the gate is not pass.
- **Automation and long jobs.** Run one-shot headless scripts, long background jobs, parameter searches, and batch validation without occupying the GUI.
- **Native selection.** Select objects or collections in Blender and send them into the current DSH draft.
```

**依据 3 · 源码核查**：[src/index.ts:1682-1707](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/f9f115f86b3c40fbe8d3dba811283acf71df03f9/src/index.ts#L1682-L1707)

do工具声明持久执行、可取帧及非并发安全。

<details>
<summary>查看原文（26行）</summary>

```text
  ctx.effect(() => ctx.tools.register(vTool({
    name: 'blender_rt_do',
    description: '实时驱动 Blender：在持久内核 K 里执行 Python（或直接跑 .py 文件），可选立刻回一帧视口。只补 op 没有的局部编辑；有 plan op 先用 op。'
      + 'GUI 可用时走 addon；传 session 时在持久无头 worker 里 exec+see（GUI 不可达自动降级，不是异步 job）；每步约 50–150 ms。'
      + HINT_KERNEL
      + ' 异常也会回传 partial stdout / stderr / traceback（诊断信息不丢）；'
      + ' file 参数可直接执行工作区脚本（等价 K.run(path)，支持 WSL / Windows / 相对 .blend 三种路径）；'
      + ' 内置路径辅助 K.win_path / K.wsl_path / K.blend_path / K.out_dir；'
      + ' ④ 返回的 ms 即**主线程占用**，>1 s 会提示改走 blender_rt_headless / blender_rt_worker。'
      + ' **P0 无头交互**：GUI 不在线或传 session 时，自动降级到持久无头会话（exec + Workbench see，同一 worker 热路径；不是 job/异步）。'
      + '第一次会冷启动 worker，之后每步 ~50–150ms；session 名固定即复用同一个 Blender 会话。',
    parameters: {
      code: { type: 'string', description: 'Python 代码（在 Blender 主线程执行；预置 bpy/math/mathutils/Vector 与持久内核 K）。与 file 二选一' },
      file: { type: 'string', description: '要执行的 .py 文件路径（WSL / Windows / 相对当前 .blend 均可）—— 长脚本用这个，不必塞进入参' },
      see: { type: 'boolean', description: '是否同时回一帧视口（默认 true）' },
      max_size: { type: 'integer', description: '回帧最长边像素，默认 560' },
      force: { type: 'boolean', description: '回帧与上一帧 hash 完全相同时默认**不重复附图**；传 true 强制重发' },
      session: { type: 'string', description: '无头交互会话名（复用同一 blender -b）' },
      auto: { type: 'boolean', description: 'GUI 不可用时降级无头 session（默认 true）' },
      preload: { type: 'string', description: '无头 session 预载模块（逗号分隔）' },
      from: { type: 'string', description: '无头 see 相机位置 "x,y,z"' },
      look_at: { type: 'string', description: '无头 see 看向点 "x,y,z"' },
    },
    output: { schema: ANY_SCHEMA, render: renderOne },
    isConcurrencySafe: () => false,
    timeoutMs: T.act,
```

</details>

<a id="research-q02"></a>

<a id="detail-section-16"></a>

### Q02 · 工具如何执行代码，取消与fallback有哪些边界？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

apply注册包内Skill、解析配置并可自动启动后端；工具通过loopback HTTP连接后端，再由Blender addon主线程执行Python。do可传code或file，有session则直用持久headless；GUI/act请求抛异常且auto未关闭时尝试doViaSession。这是真实修改场景和执行任意Python的权限面，不能当只读建模建议。withTimeout组合宿主signal与本地超时会取消fetch，但不证明已发送的Blender操作回滚或停止。关键风险是/act响应丢失或超时后，GUI可能已经产生副作用，而fallback在另一worker重做；两个会话场景也不必相同。因此未知结果先核对原场景再重试，不能直接将fallback成功当原GUI已完成。未进行故障复现，此为源码可见条件风险。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:454-473](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/f9f115f86b3c40fbe8d3dba811283acf71df03f9/src/index.ts#L454-L473)

超时与宿主取消作用于fetch链路。

<details>
<summary>查看原文（20行）</summary>

```text
async function withTimeout(path: string, init: any, timeoutMs: number): Promise<Response> {
  const ac = new AbortController()
  const ext = execSignal()
  let fired = false
  const timer = setTimeout(() => { fired = true; ac.abort() }, timeoutMs)
  const signal = ext ? AbortSignal.any([ext, ac.signal]) : ac.signal
  try {
    return await fetch(path, { ...(init || {}), signal })
  } catch (e) {
    if (!fired && ext && ext.aborted) throw new Error(ABORT_HINT)
    throw e
  } finally {
    clearTimeout(timer)
  }
}

async function backendJson(port: number, path: string, timeoutMs = 20000, init?: any): Promise<any> {
  const r = await withTimeout(base(port) + path, init, timeoutMs)
  const text = await r.text()
  try { return JSON.parse(text) } catch (e) { return { ok: false, raw: text.slice(0, 500) } }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1499-1515](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/f9f115f86b3c40fbe8d3dba811283acf71df03f9/src/index.ts#L1499-L1515)

Skill、配置及自动后端启动。

<details>
<summary>查看原文（17行）</summary>

```text
export function apply(ctx: any, config: Config): void {
  // v2.2.0：随包 skill 自动注册（可选能力；失败不影响工具面）。
  // 放在 degraded 分支之前 —— 即使 schemastery 解析失败、工具降级，技能内容也仍然可用。
  registerBundledSkill(ctx)

  // v1.0.1+S11（issue #10）：解析失败 ⇒ 降级但不消失（见 registerSchemaDiagnostic）。
  if (!z) { registerSchemaDiagnostic(ctx); return }

  // 防御性读配置：schema 正常时宿主会补默认值，但降级/宿主差异都不该让这里再抛。
  const cfgIn: any = (config && typeof config === 'object') ? config : {}
  const port = Number.isFinite(Number(cfgIn.port)) && Number(cfgIn.port) > 0 ? Number(cfgIn.port) : resolveHttpPort()
  const autoStart = cfgIn.autoStart === undefined ? true : !!cfgIn.autoStart

  // v2.6.1：dsh-TUI 宿主半边（契约 v2.3 增补 §S6）。各块按接缝是否存在启用；Web / headless 上什么都不做。
  if (cfgIn.tui !== false) registerTuiHost(ctx, { port: port, holder: HOLDER })

  void (async () => { if (autoStart && !paused) await ensureBackend(port) })()
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1708-1732](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/f9f115f86b3c40fbe8d3dba811283acf71df03f9/src/index.ts#L1708-L1732)

session分支与GUI异常后的headless fallback。

<details>
<summary>查看原文（25行）</summary>

```text
    async execute(args: any) {
      if (!(await ensureBackend(port))) return { text: '后端不可用（127.0.0.1:' + String(port) + '）。' + BACKEND_HINT }
      const code = String((args && args.code) || '')
      const file = (args && args.file) ? String(args.file) : null
      if (!code && !file) return { text: '需要 code 或 file 之一' }
      const sessOpts = {
        code: code, file: file, session: args && args.session, preload: args && args.preload,
        see: !(args && args.see === false), max_size: args && args.max_size,
        from: args && args.from, look_at: args && args.look_at, lens: args && args.lens,
        ortho: args && args.ortho, ortho_scale: args && args.ortho_scale, view_size: args && args.view_size,
      }
      // P0：显式 session → 不探 GUI，直接持久无头会话（exec + see，同一 turn 内可连续调用）
      if (args && args.session) {
        const s = await doViaSession(ctx, port, sessOpts)
        return s || { text: '无头交互会话失败：worker 不可用（先 blender_rt_worker op=start name=' + String(args.session) + '）' }
      }
      const body: any = { code: code }
      if (file) body.file = file
      let r: any = null
      try { r = await backendPost(port, '/act', body, 180000) } catch (e) {
        if (!(args && args.auto === false)) {
          const s = await doViaSession(ctx, port, sessOpts)
          if (s) return s
        }
        throw e
```

</details>

**依据 4 · 源码核查**：[addon/dsh_blender_bridge.py:2874-2893](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/f9f115f86b3c40fbe8d3dba811283acf71df03f9/addon/dsh_blender_bridge.py#L2874-L2893)

Python exec的实际执行链。

<details>
<summary>查看原文（20行）</summary>

```text
        """Execute arbitrary Blender Python code"""
        # This is powerful but potentially dangerous - use with caution
        try:
            # Create a local namespace for execution
            namespace = {"bpy": bpy}

            # Capture stdout during execution, and return it as result
            capture_buffer = io.StringIO()
            with redirect_stdout(capture_buffer):
                exec(code, namespace)

            captured_output = capture_buffer.getvalue()
            return {"executed": True, "result": captured_output}
        except Exception as e:
            # Give the caller the same detail we have: exception type, message,
            # and a full traceback (with line numbers into the submitted code),
            # instead of collapsing everything into one string. Callers that ran
            # a multi-line script otherwise cannot tell which line failed.
            tb = traceback.format_exc()
            raise Exception(
```

</details>

#### 缺口

- 未核对GUI响应丢失后真实副作用与worker场景对应
  **影响**：不能保证重试幂等或跨会话等价
  **进一步探讨**：隔离文件中执行有标记的非幂等变更并注入响应中断，回读GUI与worker各自结果

<a id="research-q03"></a>

<a id="detail-section-17"></a>

### Q03 · 验收gate的贡献是否足以保证3D交付？

**研究主题**：贡献与相对优势、缺陷与关键质疑、工程质量与复用

#### 完整回答

相对只发Python脚本，整合取帧、测量与gate让Agent可以对照参照图和装配约束迭代；gate._aggregate对任一fail/error给fail，对degraded或skipped给degraded，空包也degraded，避免“没量过”变绿色。这种明确未判定语义值得复用，尤其不能把doctor连接健康与视觉/几何验收混淆。门控仍取决于所选检查、相机、分辨率和阈值是否覆盖目标；一张同视角渲染通过可能漏掉背面接触、隐藏干涉或实际导出拓扑问题。它减少假通过的接口歧义，不证明所有视觉质量、工程加工条件或用户需求都被覆盖。复制gate时需保留未检查降级语义并核对每个子门回执，而不是只复制顶层ok。

#### 证据与依据

**依据 1 · 源码核查**：[runtime/gate.py:480-494](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/f9f115f86b3c40fbe8d3dba811283acf71df03f9/runtime/gate.py#L480-L494)

fail、degraded、skipped和空包的实际聚合。

<details>
<summary>查看原文（15行）</summary>

```text
def _aggregate(states):
    """整包三态（v3 · F8 收紧）：任一 fail/error ⇒ fail；否则任一 **degraded 或 skipped** ⇒ degraded；否则 pass。

    最小修（Lead 决议）：**任一门 skipped 或 degraded 都导致顶层 degraded，fail 优先** ——
    旧口径 `pass + skipped = pass` 被否决（"没量过干涉"不许拿绿，也不许为"健康默认 preset"降标准）。
    至少在有一门真 pass 且没有任何 fail/error/degraded/skipped 时才给 pass；
    一门都没有（空包）也一律 degraded —— "什么都没查"不给通过结论。
    """
    if any(s in ("fail", "error") for s in states):
        return "fail"
    if any(s in ("degraded", "skipped") for s in states):
        return "degraded"
    if not any(s == "pass" for s in states):
        return "degraded"
    return "pass"
```

</details>

**依据 2 · 作者声明**：[README.md:105-121](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/f9f115f86b3c40fbe8d3dba811283acf71df03f9/README.md#L105-L121)

doctor与headless帧是连接验收，不是3D业务完整验收。

<details>
<summary>查看原文（17行）</summary>

```text
    The only acceptance criterion for the GUI route is doctor returning kind equal to ok. If it does not, the plugin is not installed correctly.

    After DSH restarts, you can also use blender_viewport with op equal to launch. It starts Blender, enables the addon, and connects automatically.

    Headless-only route (no addon):

        blender_rt_worker(op="start", name="smoke")
        blender_rt_worker(op="see", name="smoke")

    A returned frame means the headless fallback is working. The doctor bpy round-trip is expected to be unreachable in this mode.

## Tools

The plugin exposes 15 tools. All planning, audit, assembly, export, and evaluation operations live under blender_rt_plan, so the tool list stays small.

### Interaction and control

```

</details>

#### 缺口

- 没有参照图、装配缺陷和导出验收的独立覆盖结果
  **影响**：不能判断gate对目标错误的检出率
  **进一步探讨**：约定任务后注入已知缺陷，分别检查图像/几何/导出门并核对漏检

<a id="research-q04"></a>

<a id="detail-section-18"></a>

### Q04 · 安装和持久修改的成本怎样限制采用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次需DSH、Node20以上、Blender4或5；GUI还需本仓库addon并保持连接，headless只需可执行Blender，但仍有启动、场景载入和帧计算成本。持续包括模型上下文、渲染资源、场景复核、文件与导出管理；失败可能留下部分修改，需保存.blend备份、核对原场景与结果，再选择恢复或重试。暂停AI写操作的白名单有助人为接管，但不能把暂停当自动撤销。未量化GPU/CPU、模型费用与人工分钟。鉴于未知结果fallback与持久副作用，当前建议观察，先在一次性场景验证连接、暂停和响应中断语义；生产文件不应直接交给未验收链路。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:31-39](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/f9f115f86b3c40fbe8d3dba811283acf71df03f9/README.md#L31-L39)

作者环境要求与GUI addon前提。

```text

**Before anything else: install the bundled addon first.** Use only the addon shipped in this repository: **addon/dsh_blender_bridge.py**. Do not install MCP for Blender or any other Blender addon. Install and enable this addon in Blender before the other steps. If the installation below does not work, first check that this exact addon is installed, enabled, and connected.

### Requirements

- DSH (DeepSeek Harness) installed and working.
- Node.js 20 or newer for the backend.
- Blender 4.x or 5.x. GUI mode requires the bundled addon (install it first); headless mode only needs the Blender executable.
- Optional: a DSH source checkout if you want to rebuild the plugin.
```

**依据 2 · 源码核查**：[src/index.ts:1708-1732](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/f9f115f86b3c40fbe8d3dba811283acf71df03f9/src/index.ts#L1708-L1732)

持久代码执行与异常fallback决定恢复成本。

<details>
<summary>查看原文（25行）</summary>

```text
    async execute(args: any) {
      if (!(await ensureBackend(port))) return { text: '后端不可用（127.0.0.1:' + String(port) + '）。' + BACKEND_HINT }
      const code = String((args && args.code) || '')
      const file = (args && args.file) ? String(args.file) : null
      if (!code && !file) return { text: '需要 code 或 file 之一' }
      const sessOpts = {
        code: code, file: file, session: args && args.session, preload: args && args.preload,
        see: !(args && args.see === false), max_size: args && args.max_size,
        from: args && args.from, look_at: args && args.look_at, lens: args && args.lens,
        ortho: args && args.ortho, ortho_scale: args && args.ortho_scale, view_size: args && args.view_size,
      }
      // P0：显式 session → 不探 GUI，直接持久无头会话（exec + see，同一 turn 内可连续调用）
      if (args && args.session) {
        const s = await doViaSession(ctx, port, sessOpts)
        return s || { text: '无头交互会话失败：worker 不可用（先 blender_rt_worker op=start name=' + String(args.session) + '）' }
      }
      const body: any = { code: code }
      if (file) body.file = file
      let r: any = null
      try { r = await backendPost(port, '/act', body, 180000) } catch (e) {
        if (!(args && args.auto === false)) {
          const s = await doViaSession(ctx, port, sessOpts)
          if (s) return s
        }
        throw e
```

</details>

**依据 3 · 源码核查**：[addon/dsh_blender_bridge.py:1101-1124](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/f9f115f86b3c40fbe8d3dba811283acf71df03f9/addon/dsh_blender_bridge.py#L1101-L1124)

AI暂停与只读白名单边界。

<details>
<summary>查看原文（24行）</summary>

```text
# v2.5：暂停 AI 操作（N 面板按钮）——暂停后 socket 上除只读命令外全部拒绝。
PAUSE_SAFE_COMMANDS = frozenset({
    "ping", "drain_human_activity", "describe_node_type", "bpy_api_lookup",
    "get_activity_state", "get_selection", "get_collections",
})


def _ai_paused():
    try:
        return bool(getattr(bpy.context.scene, "dshbb_ai_paused", False))
    except Exception:
        return False


def _is_pause_safe_command(cmd):
    """只读命令在白名单里；其余（execute_code / 资产下载 / 生成 / 导入）在暂停时拒绝。"""
    cmd = str(cmd or "")
    if cmd in PAUSE_SAFE_COMMANDS:
        return True
    if cmd.startswith("get_"):
        return True
    return False


```

</details>

<a id="research-q05"></a>

<a id="detail-section-19"></a>

### Q05 · 变更票据与场景快照能否降低未知结果损失？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是为每个修改请求绑定场景revision、请求ID和修改前快照，超时后先查询票据状态和场景摘要；只有确认未执行才重试或切worker。这由Q02的未知结果fallback与Q04的持久副作用推导，增量在事务对账，而非更强建模能力。需要后端和addon共同保存结果、限定快照成本与过期清理，不能只在客户端生成随机ID。最小验证对三个非幂等变更注入响应丢失，比较现有路径与票据路径的重复修改、场景错配和恢复分钟；若无法显著减少错配或快照成本过高，停止。这是未来设计，不记入已实现贡献。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1724-1732](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/f9f115f86b3c40fbe8d3dba811283acf71df03f9/src/index.ts#L1724-L1732)

GUI请求异常后fallback是需要对账的具体路径。

```text
      const body: any = { code: code }
      if (file) body.file = file
      let r: any = null
      try { r = await backendPost(port, '/act', body, 180000) } catch (e) {
        if (!(args && args.auto === false)) {
          const s = await doViaSession(ctx, port, sessOpts)
          if (s) return s
        }
        throw e
```

**依据 2 · 源码核查**：[runtime/gate.py:480-494](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/f9f115f86b3c40fbe8d3dba811283acf71df03f9/runtime/gate.py#L480-L494)

现有门控可报告未知，但不提供请求幂等证据。

<details>
<summary>查看原文（15行）</summary>

```text
def _aggregate(states):
    """整包三态（v3 · F8 收紧）：任一 fail/error ⇒ fail；否则任一 **degraded 或 skipped** ⇒ degraded；否则 pass。

    最小修（Lead 决议）：**任一门 skipped 或 degraded 都导致顶层 degraded，fail 优先** ——
    旧口径 `pass + skipped = pass` 被否决（"没量过干涉"不许拿绿，也不许为"健康默认 preset"降标准）。
    至少在有一门真 pass 且没有任何 fail/error/degraded/skipped 时才给 pass；
    一门都没有（空包）也一律 degraded —— "什么都没查"不给通过结论。
    """
    if any(s in ("fail", "error") for s in states):
        return "fail"
    if any(s in ("degraded", "skipped") for s in states):
        return "degraded"
    if not any(s == "pass" for s in states):
        return "degraded"
    return "pass"
```

</details>

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
