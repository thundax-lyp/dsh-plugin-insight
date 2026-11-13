# DSH × Blender

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[6c56147](https://github.com/sixtysevenlf/dsh-blender-plugin/tree/6c5614712972a5cbca52b13d4df9193d76e76b0d)

<!-- BEGIN META -->
[![GitHub ★ 2,017](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C017&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sixtysevenlf/dsh-blender-plugin) [![npm 30d 7,466](https://img.shields.io/static/v1?label=npm+30d&message=7%2C466&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-blender-plugin) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-blender-plugin)
<!-- END META -->

> **功能**：将 Blender 场景操作、观察、验证与渲染作业接入 DeepSeek Harness。

> **亮点**：[Q01](#research-q01) 将宿主工具、长作业和观察路径衔接；[Q03](#research-q03) 将机器验收的跳过及失败显式区分。Blender 渲染本身来自上游。

> **主要限制**：[Q02](#research-q02) 队列取消先改变状态，底层进程未必已停。[Q03](#research-q03) 不强制过门时，导出回执也不能作为验收记录。

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
  - [Q01 · DSH 的六工具接口如何连接 GUI 和长作业？](#detail-section-11)
  - [Q02 · wait 与 cancel 分别能证明何种状态？](#detail-section-12)
  - [Q03 · 如何确认场景和输出合格，并避免把降级视作通过？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：能独立审查 3D 场景的创作者，在 DSH 中希望跟踪一项 Blender 工作从执行到验收。

直接使用 Blender GUI 或后台脚本，手工同步命令、截图、作业和验收记录。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| GUI 操作 | 执行并观察活动场景 | 需要连通 addon |
| 无头作业 | 提交和收取渲染结果 | 回执按 job ID，取消需验进程 |
| 验收门 | 检出适用范围内的缺陷 | 按导出模式显式启用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH、Node 和 Gateway | 必需 | 注册、路由及队列 | 检查诊断或回原生 |
| Blender 与 GUI addon | GUI 需要 | 实时观察和操作 | 无头路径独立核验 |
| 独立场景与输出副本 | 试用前提 | 限制副作用 | 停止写入 |

| 步骤 | 谁操作 | 操作与结果 | 失败处理 |
| --- | --- | --- | --- |
| 准备 | 创作者 | 打开副本、核 Blender 版本 | 检查本机 Gateway |
| 提交 | 创作者 | 保留 job ID，等终态并收取 | 超时查原 ID |
| 验收 | 创作者 | 人工核文件、帧与门状态 | 回副本，不覆盖原始场景 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Blender、addon 与运行时 | 准备并核连接 | 兼容未知 |
| 持续 | 渲染、存储及模型 | 校验场景与输出 | 单位合格输出成本未知 |
| 恢复 | 可能持续运行的进程 | 核对作业、文件与状态 | 取消回执不保证退出 |
| 退出 | 副本与中间产物 | 清理测试输出 | 保持原场景 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 作业 | 提交、查询及收取接线 | 渲染可靠性 |
| 验收 | 失败和降级的区分 | 场景业务完整性 |
| 取消 | 队列和句柄处理 | 子进程及文件是否停写 |

> **思考**：[Q02](#research-q02) 队列取消先改变状态，底层进程未必已停。[Q03](#research-q03) 不强制过门时，导出回执也不能作为验收记录。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将宿主工具、长作业和观察路径衔接；[Q03](#research-q03) 将机器验收的跳过及失败显式区分。Blender 渲染本身来自上游。

[Q01](#research-q01) 实际工具注册比入口注释可靠；[Q02](#research-q02) 持久队列状态与底层取消应分别验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 队列取消先改变状态，底层进程未必已停。[Q03](#research-q03) 不强制过门时，导出回执也不能作为验收记录。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 仅在独立场景试一次渲染并验证过门与结果。[Q02](#research-q02) 状态未知时先核原 ID 和运行进程。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认作业接线、队列取消与验收门边界。真实 Blender 渲染、平台兼容和取消副作用未测。

- 已检查：作者 README、包清单、源码路径 README.md、runtime/core/queue/handler.ts、runtime/core/queue/manager.ts、runtime/py/core/gate_impl/plan.py、runtime/py/core/worker.py、runtime/py/export/deliver_impl/export.py、src/plugin.ts、src/tools/index.ts、src/tools/run/execute.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查六工具 Host 注册、代表性作业和取消、无头 Eevee 版本选择、过门与导出。未穷尽平台、Gateway 权限、算子及曲面，未运行目标代码。
- 下一步：在可重复小场景对比 GUI、无头、引擎切换、已知缺陷和取消，单独核实际进程和输出。

**分析版本**

- **仓库**：[sixtysevenlf/dsh-blender-plugin](https://github.com/sixtysevenlf/dsh-blender-plugin)
- **版本号**：3.1.0-alpha.1（[固定提交 6c56147](https://github.com/sixtysevenlf/dsh-blender-plugin/tree/6c5614712972a5cbca52b13d4df9193d76e76b0d)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 以进程实际退出和输出静止补足取消后的作业核对，对照当前回执后再判断增量。尚未验证。

在可重复小场景对比 GUI、无头、引擎切换、已知缺陷和取消，单独核实际进程和输出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 62 | 13865 | — | — | 241039 |
| .md | example | 2 | 58 | — | — | 739 |
| .mjs | source | 36 | 8637 | 7421 | 784 | — |
| .ts | source | 254 | 30971 | 27332 | 2359 | — |
| .js | source | 1 | 745 | 548 | 163 | — |
| .md | test | 3 | 529 | — | — | 21052 |
| .mjs | test | 15 | 4592 | 4079 | 264 | — |
| .ts | test | 133 | 20442 | 18275 | 610 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/sixtysevenlf/dsh-blender-plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 27](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=27&color=737b86&logo=github)](https://github.com/sixtysevenlf/dsh-blender-plugin/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 24](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=24&color=737b86&logo=github)](https://github.com/sixtysevenlf/dsh-blender-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：创作者如何在 DSH 提交、检查和收取 Blender 结果，何时不能将取消或导出回执视为成果状态？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH 的六工具接口如何连接 GUI 和长作业？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

用户在 DSH 让模型调用 Blender；相对手动在 Blender 执行脚本、截图和记录回执，增量在同一会话里组合执行与可检查结果。Host schema 不可用时走诊断；正常时注册生命周期和工具，实际是六项，旧名只有迁移提示。blender_run 先检查 Gateway，再提交参数，拿到作业回执；现场观察则属于独立的 see 工具。无头 worker 根据 bpy.app.version 选择 Eevee 标识，4.2 到 5.0 前用 NEXT，其余用旧拼法；这只说明选择逻辑，不能说明两版渲染质量相同或所有作业分支均走这一函数。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-5](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/6c5614712972a5cbca52b13d4df9193d76e76b0d/README.md#L5-L5)

作者描述 GUI 与无头用途。

```text
DSH × Blender connects DeepSeek Harness to Blender so an agent can build, inspect, validate, and export 3D scenes in a real Blender session. The normal workflow is GUI-first: start Blender, connect the addon, and let the agent look, change, and verify. When no GUI is available, background headless jobs (`blender_run(kind="headless")`) still execute scripts and return rendered frames.
```

**依据 2 · 源码核查**：[src/plugin.ts:54-77](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/6c5614712972a5cbca52b13d4df9193d76e76b0d/src/plugin.ts#L54-L77)

宿主依赖降级及生命周期装配。

<details>
<summary>查看原文（24行）</summary>

```text
export function apply(ctx: HostContext, config: Config): void {
  // v2.2.0：随包 skill 自动注册（可选能力；失败不影响工具面）。
  // 放在 degraded 分支之前 —— 即使 schemastery 解析失败、工具降级，技能内容也仍然可用。
  registerBundledSkill(ctx)

  // v1.0.1（issue #10）：解析失败 ⇒ 降级但不消失（见 registerSchemaDiagnostic）。
  if (!z) {
    registerSchemaDiagnostic(ctx)
    return
  }

  // 防御性读配置：schema 正常时宿主会补默认值，但降级/宿主差异都不该让这里再抛。
  const cfgIn = asRecord(config)
  const port =
    Number.isFinite(Number(cfgIn.port)) && Number(cfgIn.port) > 0
      ? Number(cfgIn.port)
      : resolveHttpPort()
  const autoStart = cfgIn.autoStart === undefined ? true : !!cfgIn.autoStart

  // 注册顺序必须保持 v2.6.2：TUI → 看护/后端 effects → 15 个工具。
  // Cordis 逆序释放 effects，先注册 TUI/生命周期、后注册工具，卸载时才会先释放工具再杀后端。
  registerTuiSurface(ctx, port, cfgIn)
  registerLifecycle(ctx, port, autoStart)
  registerToolSurface(ctx, port)
```

</details>

**依据 3 · 源码核查**：[src/tools/index.ts:11-23](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/6c5614712972a5cbca52b13d4df9193d76e76b0d/src/tools/index.ts#L11-L23)

实际六工具与迁移提示。

<details>
<summary>查看原文（13行）</summary>

```text
export function registerTools(ctx: HostContext, port: number): void {
  // 会话 → 算子 → 执行 → 观察 → 作业 → 只读检查
  registerSession(ctx, port)
  registerOp(ctx, port)
  registerPy(ctx, port)
  registerSee(ctx, port)
  registerRun(ctx, port)
  registerInspect(ctx, port)
  // 旧工具名不再注册；预执行 guard 把 UNKNOWN_TOOL 变成「改用哪个工具」的提示。
  ctx.effect(
    () => ctx.tools.guard((exec) => legacyToolHint(exec.name)),
    'dsh-blender-plugin: legacy-tool-migration-hint',
  )
```

</details>

**依据 4 · 源码核查**：[src/tools/run/execute.ts:149-172](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/6c5614712972a5cbca52b13d4df9193d76e76b0d/src/tools/run/execute.ts#L149-L172)

提交前检查 Gateway、返回 job 回执。

<details>
<summary>查看原文（24行）</summary>

```text
export async function executeRun(port: number, args: Record<string, unknown>): Promise<unknown> {
  const action = text(args.action).trim() || (present(args.kind) ? 'submit' : 'list')
  if (action === 'help') return { text: runHelp() }
  if (!ACTIONS.includes(action))
    return toolError(
      'invalid_params',
      '未知 blender_run action：' + action,
      '可用：' + ACTIONS.join(' | '),
    )
  if (!(await ensureBackend(port)))
    return toolError(
      'gateway_unreachable',
      'Gateway 不可用（127.0.0.1:' + String(port) + '）',
      BACKEND_HINT,
    )
  if (action === 'tune') return tune(port, args)

  if (action === 'submit') {
    const built = submitPayload(args)
    if (typeof built === 'string')
      return toolError('invalid_params', built, 'action=help 查看 render/headless 参数')
    const body = await postQueue(port, built, 60000)
    if (body.ok !== true) return failureOf(body, action)
    return { text: formatSubmit(body.job as Record<string, unknown>) }
```

</details>

**依据 5 · 源码核查**：[runtime/py/core/worker.py:88-108](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/6c5614712972a5cbca52b13d4df9193d76e76b0d/runtime/py/core/worker.py#L88-L108)

工作进程按版本切换渲染标识。

<details>
<summary>查看原文（21行）</summary>

```text
        info["fell_back_to_cpu"] = False
        return info
    if engine == "cycles":
        info.update(_gpu_setup(gpu_mode))
        try:
            sc.render.engine = "CYCLES"
            if info.get("configured"):
                sc.cycles.device = "GPU"
        except Exception as e:
            info["engine_set_err"] = str(e)[:80]
        info["after"] = {"engine": sc.render.engine}
        return info
    ee = getattr(sc, "eevee", None)
    try:
        sc.render.engine = "BLENDER_EEVEE_NEXT" if (4, 2, 0) <= bpy.app.version < (5, 0, 0) else "BLENDER_EEVEE"
        if ee is not None:
            if hasattr(ee, "use_raytracing"):
                ee.use_raytracing = True
            if hasattr(ee, "ray_tracing_method"):
                try:
                    ee.ray_tracing_method = "SCREEN"
```

</details>

#### 缺口

- 未运行两版本的无头和 GUI
  **影响**：无法确认目标场景能渲染并获得文件
  **进一步探讨**：用小场景在 Blender 4.2 及 5.x 分别提交和收取结果

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · wait 与 cancel 分别能证明何种状态？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

Gateway 的 JobSurface 按 submit、status、wait、collect、cancel 操作进入队列。wait 到时间返回当前快照和 waitTimedOut，作业并未因此取消。cancel 检查调用者授权，已终结时返回 alreadyFinished，否则先标为 canceled、清除 pid 和句柄，再调用 handle.cancel；异常被吞且没有在这一入口等待进程退出，仍持久化取消并 pump。队列 canceled 与渲染进程不再写文件是两个验收点。collect 有授权，status 和 wait 的本方法没有同样的授权检查；更外层的 Gateway 权限是否隔离状态查询仍待核实。

#### 证据与依据

**依据 1 · 源码核查**：[runtime/core/queue/handler.ts:42-72](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/6c5614712972a5cbca52b13d4df9193d76e76b0d/runtime/core/queue/handler.ts#L42-L72)

各操作到实际队列实现。

<details>
<summary>查看原文（31行）</summary>

```text
  async handle(caller: CallerIdentity, payload: QueuePayload): Promise<Record<string, unknown>> {
    const op = String(payload.op || 'list')
    try {
      if (op === 'submit') {
        const params = { ...payload }
        delete params.op
        const job = this.queue.submit(caller, params)
        return { ok: true, op, job }
      }
      if (op === 'status') {
        const job = this.queue.status(String(payload.id || ''))
        return job ? { ok: true, op, job } : { ok: false, op, code: 'queue_unknown_job' }
      }
      if (op === 'wait')
        return {
          ok: true,
          op,
          ...(await this.queue.wait(
            caller,
            String(payload.id || ''),
            Number(payload.timeout_ms) || 120000,
          )),
        }
      if (op === 'collect')
        return {
          ok: true,
          op,
          ...this.queue.collect(caller, String(payload.id || ''), Number(payload.tail) || 4000),
        }
      if (op === 'cancel')
        return { ok: true, op, ...this.queue.cancel(caller, String(payload.id || '')) }
```

</details>

**依据 2 · 源码核查**：[runtime/core/queue/manager.ts:166-192](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/6c5614712972a5cbca52b13d4df9193d76e76b0d/runtime/core/queue/manager.ts#L166-L192)

查询快照与等待超时，不尝试停止。

<details>
<summary>查看原文（27行）</summary>

```text
  status(id: string): JobRecord | null {
    const job = this.find(id)
    return job ? this.snapshot(job) : null
  }

  async wait(
    _caller: CallerIdentity,
    id: string,
    timeoutMs = WAIT_DEFAULT_MS,
  ): Promise<Record<string, unknown>> {
    const budget = Math.max(1000, Math.min(WAIT_MAX_MS, Number(timeoutMs) || WAIT_DEFAULT_MS))
    const t0 = Date.now()
    for (;;) {
      const job = this.find(id)
      if (!job)
        throw new QueueError(
          queueFailure(
            'queue_unknown_job',
            'No job has id ' + id,
            'Call op=list and use an existing jobId.',
          ),
        )
      if (terminalOf(job.state))
        return { job: this.snapshot(job), waitedMs: Date.now() - t0, waitTimedOut: false }
      if (Date.now() - t0 >= budget)
        return { job: this.snapshot(job), waitedMs: Date.now() - t0, waitTimedOut: true }
      await new Promise<void>((resolve) => setTimeout(resolve, 100))
```

</details>

**依据 3 · 源码核查**：[runtime/core/queue/manager.ts:196-243](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/6c5614712972a5cbca52b13d4df9193d76e76b0d/runtime/core/queue/manager.ts#L196-L243)

收取和取消授权；先转换状态后尝试取消句柄。

<details>
<summary>查看原文（48行）</summary>

```text
  collect(caller: CallerIdentity, id: string, tail = 4000): Record<string, unknown> {
    const job = this.find(id)
    if (!job)
      throw new QueueError(
        queueFailure(
          'queue_unknown_job',
          'No job has id ' + id,
          'Call op=list and use an existing jobId.',
        ),
      )
    this.authorize(caller, job, 'collect')
    const snap = this.snapshot(job)
    return {
      job: {
        ...snap,
        logs: { stdout: tailText(job.logs.stdout, tail), stderr: tailText(job.logs.stderr, tail) },
      },
    }
  }

  cancel(caller: CallerIdentity, id: string): Record<string, unknown> {
    const job = this.find(id)
    if (!job)
      throw new QueueError(
        queueFailure(
          'queue_unknown_job',
          'No job has id ' + id,
          'Call op=list and use an existing jobId.',
        ),
      )
    this.authorize(caller, job, 'cancel')
    if (terminalOf(job.state))
      return { job: this.snapshot(job), canceled: false, alreadyFinished: true }
    const handle = this.handles.get(job.id)
    this.transition(job, 'canceled', 'cancel requested by caller')
    job.finishedAt = this.now()
    job.pid = null
    this.handles.delete(job.id)
    if (handle) {
      try {
        handle.cancel()
      } catch {
        /* cancellation is idempotent */
      }
    }
    this.persist()
    this.pump()
    return { job: this.snapshot(job), canceled: true, alreadyFinished: false }
```

</details>

**依据 4 · 源码核查**：[src/tools/run/execute.ts:197-223](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/6c5614712972a5cbca52b13d4df9193d76e76b0d/src/tools/run/execute.ts#L197-L223)

工具区分 wait、collect 和 cancel。

<details>
<summary>查看原文（27行）</summary>

```text
  if (action === 'status') {
    const body = await postQueue(port, { op: 'status', id }, 60000)
    if (body.ok !== true) return failureOf(body, action)
    return { text: formatJob(body.job as Record<string, unknown>).join(String.fromCharCode(10)) }
  }
  if (action === 'wait') {
    const timeoutMs = Number(args.timeout_ms) || 120000
    const budget = Math.min(600000, Math.max(1000, timeoutMs)) + 30000
    const body = await postQueue(port, { op: 'wait', id, timeout_ms: timeoutMs }, budget)
    if (body.ok !== true) return failureOf(body, action)
    return {
      text: formatWait(body.job as Record<string, unknown>, body.waitedMs, body.waitTimedOut),
    }
  }
  if (action === 'collect') {
    const body = await postQueue(
      port,
      { op: 'collect', id, tail: Number(args.tail) || 4000 },
      60000,
    )
    if (body.ok !== true) return failureOf(body, action)
    return { text: formatCollect(body.job as Record<string, unknown>) }
  }
  // cancel
  const body = await postQueue(port, { op: 'cancel', id }, 60000)
  if (body.ok !== true) return failureOf(body, action)
  return { text: formatCancel(body) }
```

</details>

#### 缺口

- 未验证各作业种类的进程停止和 Gateway 外层访问
  **影响**：影响故障后是否能安全重提交或共享同一宿主
  **进一步探讨**：取消正在写输出的测试作业并独立观察进程、目录和两个会话的读取权限

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何确认场景和输出合格，并避免把降级视作通过？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

使用场景副本和独立输出目录，先确认 DSH、Gateway 和 addon 或无头 worker 正常。对一个包含已知几何缺陷的样例，人工核对帧、文件和适用的门规则。gate 聚合任一 fail/error 为 fail，存在 skipped/degraded 或没有 pass 都降级。普通 deliver_export 可以关闭强制过门，流程应明确 require_gate；未过门的产物不能仅凭文件存在算合格。维持直接用 Blender 及副本恢复作为退路。可试对 cancel 后增加进程已退出、文件不再变化的终止核验，比较当前 job 状态与双重收据能否避免错误重提；若当前监控已经等价或新增步骤不降低误判就不引入。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-27](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/6c5614712972a5cbca52b13d4df9193d76e76b0d/README.md#L21-L27)

作者划分现场观察与长任务。

```text
- **Headless jobs with visual feedback.** If Blender has no GUI, the agent submits a background headless job (`blender_run(kind="headless")`) and collects scripts, logs, and rendered frames from it. Live step-by-step interaction needs a GUI session; the job path exists so long or fresh-scene work still gets done.
- **Reference-image measurement.** Measure silhouettes, holes, symmetry, readable features, and scale from a reference image before modeling. If no scale is known, the tools return pixel units instead of inventing millimeters.
- **Parametric surfaces.** Build reproducible surface meshes from sections (loft), a profile swept along a rail, or a four-sided patch; run continuity, curvature, self-intersection, and thickness checks; then export GLB. The same spec yields the same `spec_hash` and vertices instead of hand-sculpted geometry.
- **Assembly audit and repair.** Validate an assembly manifest, classify clashes, hidden overlaps, contacts, gaps, floating parts, and contained parts, apply safe repairs, gate the result, and export GLB, FBX, or OBJ with a manifest and merge ledger.
- **Blockout and video-reference packs.** Build low-poly blockouts from declarative parts, render orthographic and perspective reference views, and produce a turntable MP4 for video models such as Seedance.
- **Visual acceptance and delivery gates.** Compare renders against references from the same camera, report defects with crops and measurements, run defect-injection evaluation, and block delivery when the gate is not pass.
- **Automation and long jobs.** `blender_run` submits render or headless work and returns a job id immediately; parameter searches and batch validation run inside the GUI session through `blender_op`. Neither occupies the GUI for the whole run.
```

**依据 2 · 源码核查**：[runtime/py/core/gate_impl/plan.py:285-299](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/6c5614712972a5cbca52b13d4df9193d76e76b0d/runtime/py/core/gate_impl/plan.py#L285-L299)

门状态聚合优先失败，跳过或空包降级。

<details>
<summary>查看原文（15行）</summary>

```text
def _aggregate(states):
    """整包三态（v3 收紧）：任一 fail/error ⇒ fail；否则任一 **degraded 或 skipped** ⇒ degraded；否则 pass。

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

**依据 3 · 源码核查**：[runtime/py/export/deliver_impl/export.py:35-62](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/6c5614712972a5cbca52b13d4df9193d76e76b0d/runtime/py/export/deliver_impl/export.py#L35-L62)

默认选择和强制门例外的实际分支。

<details>
<summary>查看原文（28行）</summary>

```text
def _dv_export_gate(require_gate, force_gate, gate_reason, gate_spec, gate_preset, gate_overrides, warn):
    """交付强制门（默认 false 兼容旧流程）；返回 (gate_rec, err)。"""
    # 交付强制门（默认 false 兼容旧流程；model_deliver / gate_deliver 会传 true）。
    # 下一个 minor 计划默认开启；现在不通过时回执明确写 gate_warning，不静默。
    if not require_gate:
        warn.append("gate_warning：require_gate=false —— 本次导出前未强制过门；流程化交付请用 gate_deliver 或 require_gate=true")
        return None, None
    K = _dv_kernel()
    gapi = getattr(K, "dsh_gate_api", None) if K is not None else None
    if gapi is None:
        return None, {"ok": False, "blocked": True, "error": "require_gate=true 但 K.dsh_gate_api 不存在",
                      "hint": "headless 预热：preload=\"gate\"（或先跑 blender_op(op=\"gate_run\")）"}
    if force_gate and not str(gate_reason or "").strip():
        return None, {"ok": False, "blocked": True,
                      "error": "force_gate=true 必须给 gate_reason（写进回执）"}
    try:
        gate_rec = gapi("run", {"spec": gate_spec, "preset": gate_preset,
                                "overrides": gate_overrides})
        if isinstance(gate_rec, str):
            gate_rec = json.loads(gate_rec)
    except Exception as e:
        return None, {"ok": False, "blocked": True,
                      "error": "gate_run 失败：%s: %s" % (type(e).__name__, str(e)[:220])}
    _gv = (gate_rec or {}).get("verdict")
    if _gv != "pass" and not force_gate:
        return None, {"ok": False, "blocked": True, "verdict": _gv, "gate": gate_rec,
                      "error": "安全门未通过（verdict=%s）：拒绝导出" % _gv,
                      "hint": "看 gate.failed/degraded/skipped；允许降级交付用 gate_deliver(allow_degraded=true)，强导必须 force_gate=true+gate_reason"}
```

</details>

**依据 4 · 源码核查**：[runtime/core/queue/manager.ts:226-243](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/6c5614712972a5cbca52b13d4df9193d76e76b0d/runtime/core/queue/manager.ts#L226-L243)

可对照当前取消语义。

<details>
<summary>查看原文（18行）</summary>

```text
    this.authorize(caller, job, 'cancel')
    if (terminalOf(job.state))
      return { job: this.snapshot(job), canceled: false, alreadyFinished: true }
    const handle = this.handles.get(job.id)
    this.transition(job, 'canceled', 'cancel requested by caller')
    job.finishedAt = this.now()
    job.pid = null
    this.handles.delete(job.id)
    if (handle) {
      try {
        handle.cancel()
      } catch {
        /* cancellation is idempotent */
      }
    }
    this.persist()
    this.pump()
    return { job: this.snapshot(job), canceled: true, alreadyFinished: false }
```

</details>

#### 缺口

- 合格场景的渲染和人工复核耗时未知
  **影响**：无法估算单位合格输出成本或节时
  **进一步探讨**：对相同场景分别记录手工与宿主辅助的提交、复核、重试、退出及资源开销

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
