# DSH LSP Actions

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b12c9dd](https://github.com/PerryLink/dsh-lsp-actions/tree/b12c9dd7615759aeacc07d72218c5343f6b24d05)

<!-- BEGIN META -->
[![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-lsp-actions) [![npm 30d 7,242](https://img.shields.io/static/v1?label=npm+30d&message=7%2C242&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lsp-actions) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lsp-actions)
<!-- END META -->

> **功能**：在 DSH 中调用语言服务器诊断、补全、格式化和符号重命名等操作。

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 显示，插件把语言服务器能力接入模型并按工作区、项目标记路由。

> **主要限制**：[Q03](#research-q03) 显示，多文件重命名是逐项写入，部分失败时需检查已经改动的文件。

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
  - [Q01 · 相对构建日志和外部编辑器，工具提供什么？](#detail-section-11)
  - [Q02 · 如何确定服务器、文件和能力路径？](#detail-section-12)
  - [Q03 · 何时产生实际写入，宿主依赖和失败是什么？](#detail-section-13)
  - [Q04 · 如何比较一个诊断任务的成本与收益？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用 DSH 排查代码的开发者可以对当前项目文件获取语言服务器反馈。

IDE 和构建日志可提供独立反馈，插件增加对话内调用。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 诊断与补全 | 提供只读语言反馈 | 需匹配服务器 |
| 格式化与重命名 | 应用服务器编辑 | 经宿主写入策略，重命名可部分生效 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools、fs、subprocess | 必需 | 挂载工具和调用服务器 | Host 无法正常接线 |
| 受信任的语言服务器 | 查询所需 | 提供语言能力 | 无匹配工具响应 |
| 独立编辑器组合 | 可选 | 挂载 stdio | 默认不启用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 选一个服务器和测试仓库 | 映射可核对 |
| 诊断 | 使用只读工具并对照 IDE | 内容位置一致 |
| 退出 | 停用挂载 | 原工作区无改动 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 服务器及下载资源未知 | 配置和验证路由 | 耗时未知 |
| 持续 | 服务器内存和模型开销未知 | 检查诊断和位置 | 实际节约待测 |
| 恢复 | 重跑资源未知 | 检查盘面并回退 IDE | 多文件写可能已部分生效 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 诊断 | 真实语言服务器入口 | 一致性和延迟 |
| 项目区分 | 按工作区和标志路由 | 不同配置实际表现 |
| 写入 | 宿主策略与逐文件检查 | 多文件完整恢复 |

> **思考**：[Q03](#research-q03) 显示，多文件重命名是逐项写入，部分失败时需检查已经改动的文件。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 显示，插件把语言服务器能力接入模型并按工作区、项目标记路由。

应用先验证命令和 fiber 代际，读写使用宿主 FS 策略，重命名预检并不提供跨文件原子性。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示，多文件重命名是逐项写入，部分失败时需检查已经改动的文件。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先试只读诊断，待验明服务器与文件范围后再单独评估写操作。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认工具和写入边界，未运行宿主和服务器。

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/tools.ts、src/runner.ts、src/host.ts、package.json、tsconfig.json、cordis.patch.yml、README.en.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 0.5.19，核查工具、路由和写入路径。未运行语言服务器或编辑器。
- 下一步：用同一项目和目标文件比较诊断、时延与回退。

**分析版本**

- **仓库**：[PerryLink/dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)
- **版本号**：0.5.19（[固定提交 b12c9dd](https://github.com/PerryLink/dsh-lsp-actions/tree/b12c9dd7615759aeacc07d72218c5343f6b24d05)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 验证对话内诊断能否减少复制和回查；若额外启动与排查抵消节约则放弃。

用同一项目和目标文件比较诊断、时延与回退。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 3646 | — | — | 41556 |
| .mjs | example | 2 | 450 | 386 | 40 | — |
| .js | example | 3 | 414 | 330 | 40 | — |
| .md | example | 2 | 144 | — | — | 1392 |
| .mjs | source | 9 | 702 | 517 | 125 | — |
| .ts | source | 27 | 7124 | 5112 | 1592 | — |
| .ts | test | 26 | 6368 | 5533 | 314 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/PerryLink/dsh-lsp-actions/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/PerryLink/dsh-lsp-actions/issues?q=is%3Aissue+created%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/PerryLink/dsh-lsp-actions/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z)



统计日期：2026-11-12。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 如何通过语言服务器获得诊断和重构建议，什么情况下可安全处理建议？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对构建日志和外部编辑器，工具提供什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要解释某个源码文件问题的开发者可以在 DSH 调用语言服务器诊断，获得按文件和位置表达的反馈，并继续请求格式化或符号处理。相比构建后再找日志，增量是把编辑器式语言操作连接到代理工具；原有 IDE 和构建仍用于独立复核。

#### 证据与依据

**依据 1 · 作者声明**：[README.en.md:39-39](https://github.com/PerryLink/dsh-lsp-actions/blob/b12c9dd7615759aeacc07d72218c5343f6b24d05/README.en.md#L39-L39)

作者说明对语言服务器和编辑器通道的定位。

```text
`dsh-lsp-actions` connects the feedback loop an agent needs while it writes code to real language servers: diagnostics, formatting, completion, code actions, symbols, signature help, inlay hints, and rename are answered by the same servers your IDE uses (`typescript-language-server`, gopls, pyright, rust-analyzer, ...). The official `ctx.lsp` seam covers navigation (go-to-definition, references, implementation, hover) only; this plugin completes the action surface — and packages it as the stable editor action protocol (`lsp.actions.*`), so editors such as VS Code can consume those capabilities without implementing LSP themselves. It mounts as a single host row (`id: lsp-actions`, `inject: [tools, fs, subprocess]`), spawns server processes lazily, and routes every write through the official `fs/write-intent` waterfall and sandbox approval.
```

**依据 2 · 源码核查**：[src/index.ts:196-212](https://github.com/PerryLink/dsh-lsp-actions/blob/b12c9dd7615759aeacc07d72218c5343f6b24d05/src/index.ts#L196-L212)

实际注册八类工具和可选 stdio。

<details>
<summary>查看原文（17行）</summary>

```text
  // Service Provider — registers the eight LSP action tools plus the optional editor JSON-RPC transport through a scoped ctx.effect.
  ctx.effect(() => {
    registerDiagnosticsTool(ctx, runner, resolved)
    registerCompletionTool(ctx, runner, resolved)
    registerFormatTool(ctx, runner, sandbox, resolved)
    registerCodeActionTool(ctx, runner, resolved)
    registerSymbolsTool(ctx, runner, resolved)
    registerSignatureTool(ctx, runner, resolved)
    registerInlayHintsTool(ctx, runner, resolved)
    registerRenameTool(ctx, runner, sandbox, resolved)
    // The IDE integration backend: `lsp.actions.list` / `lsp.actions.run` / `lsp.events` over
    // JSON-RPC stdio. Only composed when the deployment opts in (editor.enabled) — a Web or CLI
    // composition must never claim stdout. Every registration here is effect-scoped, so stopping
    // or updating the plugin tears down the transport, the listeners, and the cache.
    const editor = resolved.editor.enabled
      ? startEditorProtocol(ctx, runner, sandbox, resolved)
      : undefined
```

</details>

#### 缺口

- 未跑语言服务器和宿主
  **影响**：未验证诊断是否与当前 IDE 一致
  **进一步探讨**：对同项目文件比较两者的诊断内容

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何确定服务器、文件和能力路径？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

挂载时先解析可执行文件，异步检查完成后验证原 fiber 代际再注册。每次调用读取可选 LSP 服务，能力需要时回退到自己的 stdio 客户端；带项目标志的服务器可按最近标记决定路由。文件经宿主 fs 在会话工作区内解析，拒绝越界并限制文档读取字节。默认未配置语言服务器，不能从工具已注册推断它可服务目标语言。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:11-20](https://github.com/PerryLink/dsh-lsp-actions/blob/b12c9dd7615759aeacc07d72218c5343f6b24d05/cordis.patch.yml#L11-L20)

配置默认空表和关闭编辑器。

<details>
<summary>查看原文（10行）</summary>

```text
- insert:
    - id: lsp-actions
      name: dsh-lsp-actions
      inject: [tools, fs, subprocess]
      config:
        servers: {}
        editor:
          enabled: false
          requestTimeoutMs: 60000
          diagnosticsCacheMaxFiles: 64
```

</details>

**依据 2 · 源码核查**：[src/index.ts:173-195](https://github.com/PerryLink/dsh-lsp-actions/blob/b12c9dd7615759aeacc07d72218c5343f6b24d05/src/index.ts#L173-L195)

预解析命令、检查 fiber 代际、可选 seam。

<details>
<summary>查看原文（23行）</summary>

```text
  // Resolve every executable BEFORE registering anything: a bad later command must not publish an
  // earlier tool, matching the official lsp-stdio load contract.
  //
  // A02 generation guard: the executable probe (PATH lookups plus `--version` spawns) is the widest
  // async window in the family, and a mount disposed or reloaded inside it used to run the effect
  // creation below against a dead fiber (INACTIVE_EFFECT). Capture the fiber's generation before the
  // await and register nothing when it changed — the fiber is gone, so there is nothing to own.
  // A context without a fiber (direct `apply()` callers such as tests and programmatic mounting) has
  // no generation to defend, so the guard stays inert there and the load contract is unchanged.
  const generation = ctx.fiber?.uid
  const servers = await resolveServers(ctx, resolved.servers as Record<string, ResolvedServerEntry>)
  if (generation !== undefined && ctx.fiber?.uid !== generation) return
  const sandbox = new FormatSandboxController(ctx)
  const client = new LspActionClient(ctx.subprocess, ctx.fs, resolved.maxDocumentBytes, message => ctx.logger('lsp-actions').warn(message))
  // `ctx.lsp` is an optional capability: typed required by the seam package, absent at runtime in
  // compositions without a provider. Consume it structurally and lazily, never by import or by an
  // apply-time snapshot — the seam may load after this plugin or be re-added mid-session.
  // Consumer — resolves the optional ctx.lsp seam lazily and drives the stdio client over ctx.subprocess/ctx.fs per call.
  const getSeam = (): SeamService | undefined => ctx.get('lsp') as unknown as SeamService | undefined
  // The fs seam drives project-marker routing: a file whose nearest ancestor holds a marker some
  // entry declares (`projectMarkers`) is served by that entry instead of the extension default.
  const runner = createActionRunner({ getSeam, client, servers, fs: ctx.fs })

```

</details>

**依据 3 · 源码核查**：[src/runner.ts:138-149](https://github.com/PerryLink/dsh-lsp-actions/blob/b12c9dd7615759aeacc07d72218c5343f6b24d05/src/runner.ts#L138-L149)

按标记路由及调用顺序。

<details>
<summary>查看原文（12行）</summary>

```text
/** The project resolver used when no server entry declares a marker (no filesystem access at all). */
async function noProjectMarker(): Promise<string | undefined> {
  return undefined
}

/** The route for one request: the nearest claimed project marker decides, then globs/extensions. */
async function routeForFile(options: RunnerOptions, request: RunnerRequest, signal?: AbortSignal): Promise<ServerRoute | undefined> {
  const projectMarker = await options.projectMarker(request.filePath, request.workspaceRoot, signal)
  return routeFile(options.servers, request.filePath, projectMarker)
}

/** Serve one action: seam first, then the own client, failing loud where fallback is wrong. */
```

</details>

**依据 4 · 源码核查**：[src/host.ts:85-112](https://github.com/PerryLink/dsh-lsp-actions/blob/b12c9dd7615759aeacc07d72218c5343f6b24d05/src/host.ts#L85-L112)

工作区 containment 和字节限制。

<details>
<summary>查看原文（28行）</summary>

```text
  throwIfAborted(signal)
  let target: FsTarget
  try {
    target = await fs.resolve(filePath, {
      cwd: workspace.canonicalPath,
      ...signal === undefined ? {} : { signal },
    })
  } catch (error: unknown) {
    throwIfAborted(signal)
    throw new Error(`source "${filePath}" cannot be resolved: ${messageOf(error)}`, { cause: error })
  }
  throwIfAborted(signal)
  if (!fs.contains(workspace.target, target)) {
    throw new Error(`source "${filePath}" resolves outside the workspace`)
  }
  const info = await fs.stat(target, signal).catch((error: unknown) => {
    throwIfAborted(signal)
    throw error
  })
  throwIfAborted(signal)
  const chunks: string[] = []
  let bytes = 0
  try {
    const stream = await fs.streamText(target, signal)
    for await (const chunk of stream) {
      throwIfAborted(signal)
      bytes += Buffer.byteLength(chunk)
      if (bytes > maxDocumentBytes) break
```

</details>

#### 缺口

- 未观察多个语言服务器共存和启动异常
  **影响**：不能确认项目标志总会选中预期服务器
  **进一步探讨**：用同扩展名不同项目验证诊断源

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 何时产生实际写入，宿主依赖和失败是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

格式化与重命名会实际写入，补全只提供候选。格式化先检查沙箱策略，再通过宿主 fs/write-intent 写文件。重命名写入前验证所有目标及边界，但实际按文件顺序写；若后续冲突，前面可能已经更新，代码会报告已写数量而未提供全局回滚。编辑器 stdio 默认关闭，宿主工具启用不等于编辑器接入已可用。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:196-216](https://github.com/PerryLink/dsh-lsp-actions/blob/b12c9dd7615759aeacc07d72218c5343f6b24d05/src/index.ts#L196-L216)

工具与编辑器 transport 分支。

<details>
<summary>查看原文（21行）</summary>

```text
  // Service Provider — registers the eight LSP action tools plus the optional editor JSON-RPC transport through a scoped ctx.effect.
  ctx.effect(() => {
    registerDiagnosticsTool(ctx, runner, resolved)
    registerCompletionTool(ctx, runner, resolved)
    registerFormatTool(ctx, runner, sandbox, resolved)
    registerCodeActionTool(ctx, runner, resolved)
    registerSymbolsTool(ctx, runner, resolved)
    registerSignatureTool(ctx, runner, resolved)
    registerInlayHintsTool(ctx, runner, resolved)
    registerRenameTool(ctx, runner, sandbox, resolved)
    // The IDE integration backend: `lsp.actions.list` / `lsp.actions.run` / `lsp.events` over
    // JSON-RPC stdio. Only composed when the deployment opts in (editor.enabled) — a Web or CLI
    // composition must never claim stdout. Every registration here is effect-scoped, so stopping
    // or updating the plugin tears down the transport, the listeners, and the cache.
    const editor = resolved.editor.enabled
      ? startEditorProtocol(ctx, runner, sandbox, resolved)
      : undefined
    return async () => {
      await editor?.dispose()
      await client.disposeAll()
    }
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:215-242](https://github.com/PerryLink/dsh-lsp-actions/blob/b12c9dd7615759aeacc07d72218c5343f6b24d05/src/tools.ts#L215-L242)

格式化实际按观察与写入策略执行。

<details>
<summary>查看原文（28行）</summary>

```text
      // Resolve the per-call sandbox policy (approved mode > session override > backend default)
      // BEFORE anything executes, so a read-only session never pays for a server round-trip.
      const sandboxPolicy = await sandbox.resolvePolicy('lsp_format', args, exec)
      if (sandboxPolicy !== undefined && sandboxPolicy.mode === 'read-only') {
        throw new LspActionError(
          `${sandboxDenialMarker(sandboxPolicy.mode)}\n${escalationHintMarker('operation')}`,
          'LSP_ACTION_READ_ONLY',
        )
      }
      const request = await prepareRequest(ctx, config, filePath, workspaceRoot, exec)
      // Record the present observation so the write-intent policy can guard against staleness.
      if (request.source.version !== undefined) {
        ctx.emit('fs/observed', request.source.target, { kind: 'present', version: request.source.version }, exec)
      }
      const range = parseOptionalRange(args.range)
      const result = await runner.formatDocument({ ...request, range }, exec.signal)
      if (result.edits.length === 0) {
        return { kind: 'unchanged' as const, file_path: filePath }
      }
      const newText = applyEdits(request.source.text, result.edits)
      const intent = await ctx.waterfall('fs/write-intent', request.source.target, exec, () => undefined)
      let outcome
      try {
        outcome = await ctx.fs.writeText(request.source.target, newText, intent, exec.signal, sandboxPolicy)
      } catch (error) {
        throw mapWriteFailure(sandbox.mapError(error, sandboxPolicy), 'lsp_format')
      }
      ctx.emit('fs/observed', request.source.target, { kind: 'present', version: outcome.version }, exec)
```

</details>

**依据 3 · 源码核查**：[src/tools.ts:430-489](https://github.com/PerryLink/dsh-lsp-actions/blob/b12c9dd7615759aeacc07d72218c5343f6b24d05/src/tools.ts#L430-L489)

重命名检查边界、逐文件写入与部分失败。

<details>
<summary>查看原文（60行）</summary>

```text
      // The per-call sandbox policy resolves BEFORE anything executes, so a read-only session
      // never pays for a server round-trip — the same fail-fast contract as lsp_format.
      const sandboxPolicy = await sandbox.resolvePolicy('lsp_rename', args, exec)
      if (sandboxPolicy !== undefined && sandboxPolicy.mode === 'read-only') {
        throw new LspActionError(
          `${sandboxDenialMarker(sandboxPolicy.mode)}\n${escalationHintMarker('operation')}`,
          'LSP_ACTION_READ_ONLY',
        )
      }
      const request = await prepareRequest(ctx, config, filePath, workspaceRoot, exec)
      const result = await runner.rename({ ...request, position }, newName, exec.signal)
      const targets = Object.entries(result.edits)
      if (targets.length === 0) {
        return { kind: 'unchanged' as const, file_path: filePath, new_name: newName }
      }
      // Pre-flight: read, contain, observe, and apply every target BEFORE the first write, so an
      // out-of-workspace edit or an overlapping/out-of-bounds edit fails before any byte is
      // written. No-op files (the edit applies to nothing) are dropped.
      const planned: Array<{ filePath: string; target: FsTarget; before: string; after: string; edits: number }> = []
      for (const [uri, edits] of targets) {
        const relative = workspaceRelativePath(request.workspace, uri)
        if (relative === undefined) {
          throw new LspActionError(
            `the language server's rename edits a file outside the workspace (${uri}); refusing to apply it`,
            'LSP_ACTION_CONFLICT',
          )
        }
        const source = await readHostSource(ctx.fs, relative, request.workspace, config.maxDocumentBytes, exec.signal)
        if (source.version !== undefined) {
          ctx.emit('fs/observed', source.target, { kind: 'present', version: source.version }, exec)
        }
        const after = applyEdits(source.text, edits)
        if (after !== source.text) {
          planned.push({ filePath: relative, target: source.target, before: source.text, after, edits: edits.length })
        }
      }
      if (planned.length === 0) {
        return { kind: 'unchanged' as const, file_path: filePath, new_name: newName }
      }
      let appliedEdits = 0
      let written = 0
      const diffs: Array<{ file_path: string; before: string; after: string }> = []
      for (const file of planned) {
        const intent = await ctx.waterfall('fs/write-intent', file.target, exec, () => undefined)
        try {
          const outcome = await ctx.fs.writeText(file.target, file.after, intent, exec.signal, sandboxPolicy)
          ctx.emit('fs/observed', file.target, { kind: 'present', version: outcome.version }, exec)
          appliedEdits += file.edits
          written += 1
          diffs.push({ file_path: file.filePath, before: outcome.before ?? file.before, after: outcome.after })
        } catch (error) {
          const mapped = mapWriteFailure(sandbox.mapError(error, sandboxPolicy), 'lsp_rename')
          if (mapped instanceof LspActionError && mapped.code === 'LSP_ACTION_CONFLICT' && written > 0) {
            throw new LspActionError(
              `${mapped.message} (${written} of ${planned.length} file${planned.length === 1 ? '' : 's'} were already updated)`,
              'LSP_ACTION_CONFLICT',
              { cause: error },
            )
          }
          throw mapped
```

</details>

#### 缺口

- 未实测并发重命名与沙箱
  **影响**：无法保证运行时所有冲突都可按预期识别
  **进一步探讨**：在可丢弃仓库制造并发变更，检查磁盘与报告

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何比较一个诊断任务的成本与收益？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

在独立 profile 配置可信服务器，只试读已知语法错误的文件。与 IDE 或本地构建比较是否拿到相同位置和解释，分别记录配置、首次启动、稳定查询和故障恢复。假设是代理直接获得诊断减少手工复制，但若冷启动和核对抵消节约，放弃假设。遇到错误服务器、诊断缺失或任何意外写入，禁用并回到 IDE。

#### 证据与依据

**依据 1 · 作者声明**：[README.en.md:259-259](https://github.com/PerryLink/dsh-lsp-actions/blob/b12c9dd7615759aeacc07d72218c5343f6b24d05/README.en.md#L259-L259)

作者列出服务器配置与超时选项。

```text
Each `servers` entry is an `LspServerEntry`: `command` (executable resolved on PATH at load) and `extensionToLanguage` (`".ts"` → `typescript`) are required; optional `fileGlobs`, `projectMarkers`, `args`, `env`, `initializationOptions`, `configuration`, `formattingOptions`, `maxMessageBytes`, `maxStderrBytes`, `killGraceMs`, `shutdownTimeoutMs`, `diagnosticsSettleMs`, `diagnosticsDebounceMs`, and `idleTimeoutMs` (`0` = keep the server process alive, which is also the default) tune the built-in stdio client.
```

**依据 2 · 源码核查**：[src/index.ts:182-195](https://github.com/PerryLink/dsh-lsp-actions/blob/b12c9dd7615759aeacc07d72218c5343f6b24d05/src/index.ts#L182-L195)

服务器解析和运行器依赖。

<details>
<summary>查看原文（14行）</summary>

```text
  const generation = ctx.fiber?.uid
  const servers = await resolveServers(ctx, resolved.servers as Record<string, ResolvedServerEntry>)
  if (generation !== undefined && ctx.fiber?.uid !== generation) return
  const sandbox = new FormatSandboxController(ctx)
  const client = new LspActionClient(ctx.subprocess, ctx.fs, resolved.maxDocumentBytes, message => ctx.logger('lsp-actions').warn(message))
  // `ctx.lsp` is an optional capability: typed required by the seam package, absent at runtime in
  // compositions without a provider. Consume it structurally and lazily, never by import or by an
  // apply-time snapshot — the seam may load after this plugin or be re-added mid-session.
  // Consumer — resolves the optional ctx.lsp seam lazily and drives the stdio client over ctx.subprocess/ctx.fs per call.
  const getSeam = (): SeamService | undefined => ctx.get('lsp') as unknown as SeamService | undefined
  // The fs seam drives project-marker routing: a file whose nearest ancestor holds a marker some
  // entry declares (`projectMarkers`) is served by that entry instead of the extension default.
  const runner = createActionRunner({ getSeam, client, servers, fs: ctx.fs })

```

</details>

**依据 3 · 源码核查**：[src/tools.ts:77-90](https://github.com/PerryLink/dsh-lsp-actions/blob/b12c9dd7615759aeacc07d72218c5343f6b24d05/src/tools.ts#L77-L90)

诊断工具的目标参数。

<details>
<summary>查看原文（14行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'lsp_diagnostics',
    description:
      'Request compiler/analyzer diagnostics (errors, warnings, hints) for a file from its language server. Returns severity, zero-based range, message, and source per diagnostic, capped at maxDiagnostics. Read-only.',
    parameters: {
      file_path: { type: 'string', required: true, description: 'The source file to diagnose, relative to the workspace or absolute.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          kind: { type: 'string', required: true, const: 'diagnostics' },
          file_path: { type: 'string', required: true },
```

</details>

#### 缺口

- 未测资源与响应耗时
  **影响**：不能确认长期净收益
  **进一步探讨**：记录相同诊断任务的多次响应与对照

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
