# @pbfuzz/dsh-kanalyzer

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[0c65a84](https://github.com/sgzeng/pbfuzz/tree/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-kanalyzer)

<!-- BEGIN META -->
[![GitHub ★ 18](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=18&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sgzeng/pbfuzz) [![npm 30d 436](https://img.shields.io/static/v1?label=npm+30d&message=436&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@pbfuzz/dsh-kanalyzer) [![最新发布 2026-10-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@pbfuzz/dsh-kanalyzer)
<!-- END META -->

> **功能**：为 DSH 提供 C/C++ LLVM bitcode 准备、KAMain 静态可达分析及调用关系查询。

> **亮点**：把 bitcode、后台进度、静态距离和源位置组织成可复用服务，让调用者追查分析线索。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：默认副本不约束 shell 的所有副作用，缺距离也不构成不可达证明。[Q03](#research-q03)

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
  - [Q01 · 为什么把可达分析接进 DSH？](#detail-section-11)
  - [Q02 · prepare 到 query 如何保持任务可追踪？](#detail-section-12)
  - [Q03 · 何时不能把未找到路径写成不可达？](#detail-section-13)
  - [Q04 · 什么小样本能决定是否采用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为 C/C++ 目标位置核对候选调用关系与静态距离。

手工编译 LLVM bitcode、跑 KAMain 并解析 dump；需要更强结论时用运行覆盖对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| KAnalyzer | 静态可达和调用图 | LLVM/KAMain；缺距离不作强否定 |

**流程与依赖**

| 依赖 | 用途 | 条件 |
| --- | --- | --- |
| Linux x86-64、LLVM 14 与 KAMain | 分析 bitcode | 构建版本匹配 |
| wllvm/LTO 或可用 bitcode | 准备输入 | 需完整依赖图 |

| 步骤 | 操作 | 验收 |
| --- | --- | --- |
| 准备 | 可信源码和 buildCmd | 获得 bitcode |
| 分析 | 明确目标再 query | 回读源行及覆盖 |

**效果与成本**

| 阶段 | 资源 | 边界 |
| --- | --- | --- |
| 首次分析 | 构建、磁盘与静态分析 | 大项目时延未测 |
| 重跑 | 可复用缓存 | 需检查新鲜度 |

| 结果 | 支持 | 待测 |
| --- | --- | --- |
| 可达线索 | 源映射和距离状态 | 真实路径和性能 |

> **思考**：默认副本不约束 shell 的所有副作用，缺距离也不构成不可达证明。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 bitcode、后台进度、静态距离和源位置组织成可复用服务，让调用者追查分析线索。[Q01](#research-q01) [Q02](#research-q02)

作业进度、memo 与引擎缓存分层，隔离副本有回滚价值，但 shell 仍需要独立权限约束。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认副本不约束 shell 的所有副作用，缺距离也不构成不可达证明。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在可信小项目核对一条已知路径；没有距离时保留未知并使用动态覆盖。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持准备、作业和查询路径。当前未执行 LLVM、KAMain 或 DSH。

- 已检查：作者 README、包清单、源码路径 README.md、packages/dsh-kanalyzer/package.json、packages/dsh-kanalyzer/src/host/tools.ts、packages/dsh-kanalyzer/src/index.ts、packages/dsh-kanalyzer/src/host/runtime.ts、packages/dsh-kanalyzer/src/core/query.ts 及固定范围 inventory；组件：packages/dsh-kanalyzer。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定子包的挂载、准备、作业、缓存和静态结果解释。未调用外部工具。
- 下一步：记录目标、入口、作业日志和动态命中，对照 no_distance 与真实结果。

**分析版本**

- **仓库**：[sgzeng/pbfuzz](https://github.com/sgzeng/pbfuzz)
- **版本号**：0.1.0（[固定提交 0c65a84](https://github.com/sgzeng/pbfuzz/tree/0c65a84a0138133bfb33303ba041f47edfa0aa59)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

用静态结果排序动态探针，比较命中与漏检；在相同已知夹具上检验。尚未验证。[Q04](#research-q04)

记录目标、入口、作业日志和动态命中，对照 no_distance 与真实结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 3 | 322 | 220 | 83 | — |
| .md | source | 4 | 392 | — | — | 3743 |
| .ts | source | 29 | 6840 | 4165 | 2268 | — |
| .ts | test | 29 | 3904 | 2994 | 537 | — |
| .tsx | source | 1 | 395 | 358 | 17 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/sgzeng/pbfuzz/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/sgzeng/pbfuzz/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)

暂未获取：近30天关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：C/C++ 工程师能否用 KAnalyzer 生成可核查的静态可达线索，并理解构建与否定结论的边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 为什么把可达分析接进 DSH？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要定位 C/C++ 目标行或分支的工程师，可让代理先获得可分析 bitcode，再查询调用关系和静态距离，从候选路径中决定下一轮测试。合格结果是能回指 bitcode、入口、目标和证据范围。相比手工编译、调用 KAMain 并解析 dump，插件增加可复用服务、源位置映射和面向模型的查询；静态算法来自 KAMain。纯文本查找足以定位符号时，无需承担完整 LLVM 构建。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:94-103](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/README.md#L94-L103)

作者定义独立分析组件及其使用位置。

<details>
<summary>查看原文（10行）</summary>

```text

- **`@pbfuzz/dsh-pbfuzz`** — the campaign FSM (PLAN → IMPLEMENT → EXECUTE → REFLECT, "PIER"),
  its tools (`pbfuzz_campaign`, `pbfuzz_plan`, `pbfuzz_fuzz`, `pbfuzz_reflect`, …), the state
  guards that keep the model from tampering with engine-owned evidence, and the settings/dashboard
  UI. It runs as a native Cordis plugin — no Claude-Code-style hooks, no compatibility layer.
- **`@pbfuzz/dsh-kanalyzer`** *(optional)* — a general-purpose LLVM static-analysis plugin
  (reachability, call graphs) that `dsh-pbfuzz` consumes when static analysis is turned on.
- **`engine/`** — the Python sidecar that actually runs the target: generates inputs, executes
  them, judges the oracle, and is the sole writer of `metrics.json`. It speaks JSON-RPC over
  stdio and never runs model-written code outside a resource-bounded sandbox.
```

</details>

**依据 2 · 源码核查**：[packages/dsh-kanalyzer/package.json:2-10](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-kanalyzer/package.json#L2-L10)

组件身份、功能和仓库路径。

```text
  "name": "@pbfuzz/dsh-kanalyzer",
  "version": "0.1.0",
  "description": "General-purpose LLVM static-analysis plugin for DeepSeek Harness: builds analysable bitcode and runs kernel-analyzer (KAMain) reachability analysis behind ctx.kanalyzer",
  "type": "module",
  "license": "PolyForm-Noncommercial-1.0.0",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/sgzeng/pbfuzz.git",
    "directory": "packages/dsh-kanalyzer"
```

**依据 3 · 源码核查**：[packages/dsh-kanalyzer/src/host/tools.ts:120-139](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-kanalyzer/src/host/tools.ts#L120-L139)

真实查询选择和参数。

<details>
<summary>查看原文（20行）</summary>

```text
  op: { type: 'string', required: true, enum: ['callers', 'callees', 'functionAt', 'critical', 'branches', 'distances', 'functions', 'reach'] },
  bitcode: { type: 'string', required: true },
  fn: { type: 'string' },
  location: { type: 'string' },
  file: { type: 'string' },
  limit: { type: 'integer' },
} as const

/**
 * Build the `ctx.kanalyzer.query()` discriminated request from `kanalyzer_query`'s validated,
 * flat arguments. This is a genuine transform, not a cast: each `op` needs a different field
 * subset, which the flat parameter schema (one `op` sibling, not an `oneOf` keyed by it) cannot
 * itself express.
 * @param args - validated arguments (see {@link QUERY_PARAMS}).
 * @returns the discriminated query request.
 * @throws when the op's required field (`location` for `functionAt`, `fn` for callers/callees) is missing.
 */
function toQueryRequest(args: InferArgs<typeof QUERY_PARAMS>): QueryRequest {
  if (args.op === 'reach') {
    if (args.location === undefined && args.fn === undefined) throw new Error('reach needs `location` (file:line) or `fn`')
```

</details>

#### 缺口

- 未与手工调用对照。
  **影响**：不能量化找到候选路径的收益。
  **进一步探讨**：用已知可达与间接调用样本做对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · prepare 到 query 如何保持任务可追踪？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 注册 KanalyzerRuntime 服务，并按宿主能力装配工具和命令。prepare 支持默认隔离构建、LTO 或 wllvm，模型调用等待一段时间后可返回 job ID；工具说明要求随后读 job_output。构建进程接收取消信号。prepare 对相同身份和未见更新的输入可复用 bitcode，其判断基于路径、memo 与新文件扫描，不能当作字节级证明。analyze 读取存在的 bitcode 和格式有效的目标，按 bitcode 摘要、引擎提交及选项构建结果缓存并提供日志读取。query 从生成的映射与距离资料给出调用者或可达标记。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-kanalyzer/src/index.ts:121-129](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-kanalyzer/src/index.ts#L121-L129)

真实服务及工具注册。

```text
  ctx.plugin(KanalyzerRuntime, { config: () => source(), writeStatus, packageRoot: PACKAGE_ROOT })
  ctx.inject(['kanalyzer'], (rctx) => {
    runtime = rctx.kanalyzer
    refreshInstallStatus()
    rctx.effect(() => () => { runtime = undefined })
  })

  ctx.inject(['tools', 'kanalyzer'], (tctx) => { registerTools(tctx) })
  ctx.inject(['commands', 'kanalyzer'], (cctx) => { registerCommands(cctx, () => source(), PACKAGE_ROOT) })
```

**依据 2 · 源码核查**：[packages/dsh-kanalyzer/src/host/tools.ts:250-267](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-kanalyzer/src/host/tools.ts#L250-L267)

等待窗口和后台 prepare 交接。

<details>
<summary>查看原文（18行）</summary>

```text
    description: 'Build a C/C++ project into the whole-program LLVM bitcode KAMain analyses (it reads neither source nor executables). By default the build runs in an isolated copy at <repo>/.kanalyzer/tree with every sanitizer flag stripped and -O0 -g -fPIC forced, so your own build tree and binaries are untouched and the analysis is not swamped by sanitizer check branches; a compiler-name shim on PATH means a build script that hardcodes CC=clang works unpatched, so pass the project\'s own build command as-is and never prepend a clean step. Parallelism is set for you. mode "wllvm" (default) wraps the compiler and needs `program`; mode "lto" is faster and needs no extract-bc. Static libraries the program links must be LTO archives listed in ltoLibs, or the call graph is silently truncated. Returns the bitcode path, inferred entries (LLVMFuzzerTestOneInput, else main), the tree it built in and a note to relay to the user. Waits waitSec (default 10) and then returns {jobId, status:"running"}: follow it with job_output, which streams compile progress and finally the same result as RESULT {json}. An identical repeat call against an unchanged tree returns the previous bitcode in seconds (cached: true).',
    parameters: PREPARE_PARAMS,
    output: jsonOutput,
    async execute(args, exec) {
      const started = k.prepareJob(toPrepareRequest(args), jobCaller(exec), {
        ...(args.isolate !== undefined ? { isolate: args.isolate } : {}),
        ...(args.force !== undefined ? { force: args.force } : {}),
      })
      // With no job registry there is nothing to detach to, so the only honest option is to wait.
      if (started.jobId === undefined) return toJsonObject(await started.result)
      const settled = await settleWithin(started.result, Math.max(1, args.waitSec ?? DEFAULT_PREPARE_WAIT_SEC) * 1000)
      if (settled.done) return toJsonObject(settled.value)
      return toJsonObject({
        jobId: started.jobId,
        status: 'running',
        ...(started.tree !== undefined ? { tree: started.tree } : {}),
        hint: `The build is still running as job ${started.jobId}. You are notified when it finishes; job_output ${started.jobId} shows compile progress now and the final RESULT {json} afterwards. Do not start it again — get on with something else in the meantime.`,
      })
```

</details>

**依据 3 · 源码核查**：[packages/dsh-kanalyzer/src/host/runtime.ts:757-776](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-kanalyzer/src/host/runtime.ts#L757-L776)

准备 memo 和同步副本。

<details>
<summary>查看原文（20行）</summary>

```text
    // Reuse: the same build against a checkout nothing has touched since produces the same
    // bitcode, and a repeat of this exact call used to cost the full build again.
    if (!force) {
      const hit = await this.readPrepareMemo(iso.memo, identity)
      if (hit !== undefined && existsSync(hit.result.bitcode) && !(await anyFileNewer(repo, hit.preparedAt))) {
        for (const bc of hit.result.allBitcode) this.prepared.set(bc, { repo, aliases: isolate ? [iso.tree] : [] })
        return decorate(hit.result, true)
      }
    }

    await mkdir(iso.root, { recursive: true })
    // Everything this plugin writes into the workspace lives under one hidden directory, and none
    // of it belongs in the user's history.
    await writeFile(join(iso.root, '.gitignore'), '*\n').catch(() => { /* read-only workspace */ })
    let buildRoot = repo
    let buildCwd = callerCwd
    let buildCmd = req.buildCmd
    if (isolate) {
      if (force) await rm(iso.tree, { recursive: true, force: true })
      await this.syncTree(repo, iso.tree, signal)
```

</details>

**依据 4 · 源码核查**：[packages/dsh-kanalyzer/src/host/runtime.ts:918-951](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-kanalyzer/src/host/runtime.ts#L918-L951)

日志、分析校验与缓存。

<details>
<summary>查看原文（34行）</summary>

```text
  analyze(request: AnalyzeRequest, caller?: JobCaller): Promise<AnalyzeResult> {
    // KAMain already streams its verbose log to a file, so making the job readable costs nothing
    // and turns a silent multi-minute analysis into one the user can watch.
    const tail = new FileTail()
    return this.asJob(
      `kanalyzer analyze ${basename(request.bitcode)} (${String(request.targets.length)} target(s))`,
      signal => this.doAnalyze(request, signal, tail),
      caller,
      { readOutput: () => tail.read(), outputLimitBytes: JOB_OUTPUT_LIMIT },
    )
  }

  /** @inheritdoc */
  index(bitcode: string): Promise<AnalyzeResult> {
    return this.analyze({ bitcode, targets: [], dumps: { bidMappingAndFuncInfo: true, callerCalleeBothWays: true, policy: false, distance: false, criticalBranch: false, annotatedIr: false } })
  }

  private async doAnalyze(req: AnalyzeRequest, signal: AbortSignal, tail?: FileTail): Promise<AnalyzeResult> {
    const started = Date.now()
    const cfg = this.options.config()
    const options = resolveOptions(req, optionDefaults(cfg))
    const fail = (reason: string, outputDir = ''): AnalyzeResult => ({
      status: 'error', targets: [], criticalBranches: [], reachableFunctions: 0, totalFunctions: 0,
      entriesUsed: options.entries, outputDir, dumpFiles: [], elapsedMs: Date.now() - started, cached: false, reason,
    })
    const st = await this.status()
    if (!st.installed) return fail(`KAMain is not built (${this.binary} missing). Press Build in the kanalyzer settings or run /kanalyzer build.`)
    if (!existsSync(req.bitcode)) return fail(`bitcode not found: ${req.bitcode}`)
    const bad = options.targets.filter(t => targetListEntry(t) === undefined)
    if (bad.length > 0) return fail(`malformed target(s), expected file:line: ${bad.join(', ')}`)

    const notes = await this.bitcodeNotes(req.bitcode)
    const key = cacheKey(await this.digestOf(req.bitcode), st.commit ?? 'unknown', options)
    const cacheDir = join(this.installDir, 'cache', key)
```

</details>

#### 缺口

- 未观察真实作业恢复。
  **影响**：取消与并发缓存行为未验。
  **进一步探讨**：运行可信小项目，记录 job ID、最后结果、取消及重跑。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 何时不能把未找到路径写成不可达？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

适配目标依赖 Linux x86-64 及 LLVM 14/KAMain。默认副本在项目的 .kanalyzer/tree 下，仍由 /bin/sh -c 跑用户提供的 buildCmd，是构建工作区隔离而非安全沙箱。绝对路径、网络或脚本副作用需另限制；isolate:false 直接在原树构建。静态库若缺匹配 bitcode，调用图可能不完整。query 区分 no_block、reaches、exit_only、no_distance；源码注释列出间接调用、调用深度和缺回边等限制。没有 distance 只意味着此材料找不到路径，既不能替代运行命中，也不能单独支持排除候选。首次编译和分析需 CPU、磁盘及工具链，memo 可减少重复但时延和命中率未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-30](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/README.md#L26-L30)

作者给 LLVM 14 前提。

````text
Optional static analysis (C/C++ reachability; needs an LLVM 14 toolchain, see
[`packages/dsh-kanalyzer`](packages/dsh-kanalyzer)):

```sh
npx @deepseek-ai/dsh@latest plugin --profile web add @pbfuzz/dsh-kanalyzer
````

**依据 2 · 源码核查**：[packages/dsh-kanalyzer/src/host/tools.ts:250-250](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-kanalyzer/src/host/tools.ts#L250-L250)

工具说明隔离、外部静态库及截断边界。

```text
    description: 'Build a C/C++ project into the whole-program LLVM bitcode KAMain analyses (it reads neither source nor executables). By default the build runs in an isolated copy at <repo>/.kanalyzer/tree with every sanitizer flag stripped and -O0 -g -fPIC forced, so your own build tree and binaries are untouched and the analysis is not swamped by sanitizer check branches; a compiler-name shim on PATH means a build script that hardcodes CC=clang works unpatched, so pass the project\'s own build command as-is and never prepend a clean step. Parallelism is set for you. mode "wllvm" (default) wraps the compiler and needs `program`; mode "lto" is faster and needs no extract-bc. Static libraries the program links must be LTO archives listed in ltoLibs, or the call graph is silently truncated. Returns the bitcode path, inferred entries (LLVMFuzzerTestOneInput, else main), the tree it built in and a note to relay to the user. Waits waitSec (default 10) and then returns {jobId, status:"running"}: follow it with job_output, which streams compile progress and finally the same result as RESULT {json}. An identical repeat call against an unchanged tree returns the previous bitcode in seconds (cached: true).',
```

**依据 3 · 源码核查**：[packages/dsh-kanalyzer/src/host/runtime.ts:799-808](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-kanalyzer/src/host/runtime.ts#L799-L808)

buildCmd 实际通过 shell 执行。

<details>
<summary>查看原文（10行）</summary>

```text
    // that re-exports CC=clang has to land on one of them for any of this to take effect.
    env.PATH = `${iso.shim}:${env.PATH ?? '/usr/bin:/bin'}`
    const since = Date.now() - 2000
    const build = await run('/bin/sh', ['-c', buildCmd], {
      cwd: buildCwd, env, signal, maxBuffered: 256 * 1024,
      ...(progress !== undefined ? { onOutput: (chunk: string) => { progress.onOutput(chunk) } } : {}),
    })
    if (signal.aborted) throw new Error('prepare cancelled')
    const tail = (build.stderr || build.stdout).slice(-1500)
    if (build.exitCode !== 0) throw new Error(`build command failed (exit ${String(build.exitCode)}):\n${tail}`)
```

</details>

**依据 4 · 源码核查**：[packages/dsh-kanalyzer/src/core/query.ts:201-221](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-kanalyzer/src/core/query.ts#L201-L221)

明示缺距离和映射的解释边界。

<details>
<summary>查看原文（21行）</summary>

```text
const NOTES = {
  noAnalysis:
    'No targeted kanalyzer_analyze is on record for this bitcode, so there is no distance table to read — '
    + 'this empty answer says nothing about the program. Run kanalyzer_analyze with the target first.',
  noDistance:
    'KAMain recorded no distance for these blocks. That is NOT proof the code cannot reach the target: '
    + 'the distance pass skips indirect call sites with more than 50 type-compatible candidates (nginx\'s own '
    + '`rc = ph->handler(r)` phase dispatch is one), never propagates through return edges, stops at the '
    + 'call-stack-length limit, and only falls back to type-based callers for a function with no direct caller. '
    + 'Say "KAMain found no static path" and give the evidence, not "unreachable".',
  exitOnly:
    'Every block here is marked -1: KAMain found it leads to a program exit (an `unreachable` terminator or a '
    + 'noreturn call — with a sanitizer-instrumented bitcode, usually its own abort stub) and its backward search '
    + 'from the target did not reach it. Strong negative evidence, still bounded by the call-depth limit.',
  noBlock:
    'No basic block maps to that line: after optimisation the line owns no instruction of its own (a declaration, '
    + 'a brace, or a `return` merged into a shared block). This says nothing about reachability — the answer is '
    + 'for the block that actually covers the line.',
  callersDump:
    'KAMain lists a function\'s direct callers when it has any, and otherwise every call site whose signature is '
    + 'type-compatible — a superset that includes functions which cannot really call it. Not a path proof.',
```

</details>

**依据 5 · 源码核查**：[packages/dsh-kanalyzer/src/core/query.ts:260-265](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-kanalyzer/src/core/query.ts#L260-L265)

四种 verdict 生成。

```text
/** @returns the verdict the coverage supports, on its own terms. */
function verdictOf(c: ReachCoverage): ReachVerdict {
  if (c.blocks === 0) return 'no_block'
  if (c.withDistance > 0) return 'reaches'
  if (c.exitOnly > 0 && c.absent === 0) return 'exit_only'
  return 'no_distance'
```

#### 缺口

- 未查实际编译链与引擎支持。
  **影响**：对具体 C++ 间接调用不能确认覆盖。
  **进一步探讨**：对照已知动态命中，记录分析中的 no_distance 和映射状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么小样本能决定是否采用？

**研究主题**：采用判断、新假设与验证

#### 完整回答

先选可丢弃的可信 C 项目，明确入口、可达行、退出分支和一个间接调用。核对工具生成的 bitcode、作业输出、目标与 query 返回。环境依赖不符、构建有不可控副作用或项目不能复现时停用，回到手工受控 LLVM 或运行测试。可研究用静态结果决定优先补哪些动态探针，而非删除无距离候选；相同目标上比较动态命中率、发现时长和漏检。若增加构建成本但没有改善命中，或错排实际路径，就不采用。尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-kanalyzer/src/core/query.ts:201-221](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-kanalyzer/src/core/query.ts#L201-L221)

现有结果承认不能作强排除。

<details>
<summary>查看原文（21行）</summary>

```text
const NOTES = {
  noAnalysis:
    'No targeted kanalyzer_analyze is on record for this bitcode, so there is no distance table to read — '
    + 'this empty answer says nothing about the program. Run kanalyzer_analyze with the target first.',
  noDistance:
    'KAMain recorded no distance for these blocks. That is NOT proof the code cannot reach the target: '
    + 'the distance pass skips indirect call sites with more than 50 type-compatible candidates (nginx\'s own '
    + '`rc = ph->handler(r)` phase dispatch is one), never propagates through return edges, stops at the '
    + 'call-stack-length limit, and only falls back to type-based callers for a function with no direct caller. '
    + 'Say "KAMain found no static path" and give the evidence, not "unreachable".',
  exitOnly:
    'Every block here is marked -1: KAMain found it leads to a program exit (an `unreachable` terminator or a '
    + 'noreturn call — with a sanitizer-instrumented bitcode, usually its own abort stub) and its backward search '
    + 'from the target did not reach it. Strong negative evidence, still bounded by the call-depth limit.',
  noBlock:
    'No basic block maps to that line: after optimisation the line owns no instruction of its own (a declaration, '
    + 'a brace, or a `return` merged into a shared block). This says nothing about reachability — the answer is '
    + 'for the block that actually covers the line.',
  callersDump:
    'KAMain lists a function\'s direct callers when it has any, and otherwise every call site whose signature is '
    + 'type-compatible — a superset that includes functions which cannot really call it. Not a path proof.',
```

</details>

**依据 2 · 源码核查**：[packages/dsh-kanalyzer/src/host/runtime.ts:935-951](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-kanalyzer/src/host/runtime.ts#L935-L951)

有固定输入条件供对照。

<details>
<summary>查看原文（17行）</summary>

```text
  private async doAnalyze(req: AnalyzeRequest, signal: AbortSignal, tail?: FileTail): Promise<AnalyzeResult> {
    const started = Date.now()
    const cfg = this.options.config()
    const options = resolveOptions(req, optionDefaults(cfg))
    const fail = (reason: string, outputDir = ''): AnalyzeResult => ({
      status: 'error', targets: [], criticalBranches: [], reachableFunctions: 0, totalFunctions: 0,
      entriesUsed: options.entries, outputDir, dumpFiles: [], elapsedMs: Date.now() - started, cached: false, reason,
    })
    const st = await this.status()
    if (!st.installed) return fail(`KAMain is not built (${this.binary} missing). Press Build in the kanalyzer settings or run /kanalyzer build.`)
    if (!existsSync(req.bitcode)) return fail(`bitcode not found: ${req.bitcode}`)
    const bad = options.targets.filter(t => targetListEntry(t) === undefined)
    if (bad.length > 0) return fail(`malformed target(s), expected file:line: ${bad.join(', ')}`)

    const notes = await this.bitcodeNotes(req.bitcode)
    const key = cacheKey(await this.digestOf(req.bitcode), st.commit ?? 'unknown', options)
    const cacheDir = join(this.installDir, 'cache', key)
```

</details>

#### 缺口

- 缺静态与动态联合对照。
  **影响**：仅能建议在已知样本上试用。
  **进一步探讨**：记录覆盖与时间，再扩大到真实项目。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
