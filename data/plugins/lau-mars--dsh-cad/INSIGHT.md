# dsh-cad

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[7cdf502](https://github.com/LAU-MARS/dsh-cad/tree/7cdf502c4636abba20a7ef3ae0b1d47b346b92a1)

<!-- BEGIN META -->
[![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LAU-MARS/dsh-cad) [![npm 30d 7,499](https://img.shields.io/static/v1?label=npm+30d&message=7%2C499&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cad) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cad)
<!-- END META -->

> **功能**：在 DSH Web 查看 CAD 文件，并提供几何分析与建模工具。

> **亮点**：[Q01](#research-q01) 把场景和任务留在同一次会话。[Q02](#research-q02) 分开处理工具结果和浏览器路由。

> **主要限制**：[Q03](#research-q03) 的 Node 读取接受绝对路径，Python 脚本从宿主启动进程。使用者需独立核工具权限和部署隔离。

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
  - [Q01 · 聊天内预览为图纸复核增加什么？](#detail-section-11)
  - [Q02 · 浏览器拿到场景要满足什么条件？](#detail-section-12)
  - [Q03 · 文件读取和脚本有什么采用限制？](#detail-section-13)
  - [Q04 · 如何验证预览减少切换并保持几何正确？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要在 DSH 对话中查看小型 CAD 零件的工程师。

以独立 CAD 查看器为基线，对照文件、单位和几何。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| CAD 预览 | 在会话查看场景 | 需要路由，尺寸另验 |
| 脚本工具 | 执行工具请求 | Python 使用宿主进程，独立核权限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools 和浏览器路由 | 预览需要 | 注册工具并读取场景 | 分开查工具结果和 URL |
| 小型已知模型和独立查看器 | 验证需要 | 确认几何 | 不以画面判断精度 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 核工具权限和测试环境 | 无敏感资料 |
| 验证 | 加载已知模型 | 位置、尺寸与预期相符 |
| 退出 | 停用并查临时文件 | 保留独立查看器 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 环境未知 | 备样本并核权限 | 隔离条件先验 |
| 持续 | GPU、文件和模型未知 | 检查几何与单位 | 未实测 |
| 恢复 | 重算未知 | 停用并查临时文件 | 外部工具另核 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 预览 | 场景输出与路由 | 实际几何质量 |
| 退出 | 作用域清理路由 | 真实环境残留 |

> **思考**：[Q03](#research-q03) 的 Node 读取接受绝对路径，Python 脚本从宿主启动进程。使用者需独立核工具权限和部署隔离。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把场景和任务留在同一次会话。[Q02](#research-q02) 分开处理工具结果和浏览器路由。

[Q02](#research-q02) 的路由批次能撤除已注册部分，并区别工具返回和页面可见性。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的 Node 读取接受绝对路径，Python 脚本从宿主启动进程。使用者需独立核工具权限和部署隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先核可读路径与脚本权限，再选择是否在可丢弃环境试小模型。保留原 CAD 验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 CAD 场景、工具与路由。真实转换精度和权限未验。

- 已检查：作者 README、包清单、源码路径 README.md、src/tools/cad-view.ts、client/index.tsx、src/index.ts、src/routes.ts、src/tools/util.ts、src/tools/cad-script.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查代表预览、脚本入口和路径。未运行 CAD、模型、浏览器或外部引擎。
- 下一步：按 [Q04](#research-q04) 对照几何和错误路径，再核脚本及可达文件。

**分析版本**

- **仓库**：[LAU-MARS/dsh-cad](https://github.com/LAU-MARS/dsh-cad)
- **版本号**：0.17.0（[固定提交 7cdf502](https://github.com/LAU-MARS/dsh-cad/tree/7cdf502c4636abba20a7ef3ae0b1d47b346b92a1)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 用已知几何和损坏样本对照，若错件或人工复核增加，保留原工具。

按 [Q04](#research-q04) 对照几何和错误路径，再核脚本及可达文件。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 856 | — | — | 11780 |
| .tsx | source | 8 | 3080 | 2574 | 335 | — |
| .ts | source | 62 | 12752 | 10430 | 1513 | — |
| .mjs | source | 5 | 395 | 315 | 45 | — |
| .js | source | 55 | 13168 | 12065 | 969 | — |
| .cjs | source | 10 | 5384 | 4170 | 966 | — |
| .ts | test | 29 | 4206 | 3419 | 401 | — |
| .mjs | test | 5 | 268 | 212 | 39 | — |
| .tsx | test | 4 | 494 | 404 | 46 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/LAU-MARS/dsh-cad/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 内嵌 CAD 预览的实际链路和文件、脚本权限边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 聊天内预览为图纸复核增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要在 DSH 对话里检查小型 CAD 零件的工程师，可调用 cad_view 将文件转成场景、保存预览 ID，再由 Web 工具卡访问。相对反复导出并切到外部 CAD 查看器，这使文件和当前工具结果留在同一次会话。可视检查能帮助发现错文件或明显形状错误，尺寸、单位、制造约束仍应在原 CAD 工具核对。若任务只需准确尺寸，独立工具仍是基线。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-19](https://github.com/LAU-MARS/dsh-cad/blob/7cdf502c4636abba20a7ef3ae0b1d47b346b92a1/README.md#L17-L19)

作者概述预览与建模。

```text
A CAD plugin for [DeepSeek Harness (dsh)](https://github.com/deepseek-ai/deepseek-harness):
an **embedded 3D/2D CAD viewer** plus a **native parametric modeling tool family**
(OCCT kernel) in the Web UI, letting the agent build and inspect CAD geometry
```

**依据 2 · 源码核查**：[src/tools/cad-view.ts:84-109](https://github.com/LAU-MARS/dsh-cad/blob/7cdf502c4636abba20a7ef3ae0b1d47b346b92a1/src/tools/cad-view.ts#L84-L109)

文件解析、格式转换、场景保存和 URL。

<details>
<summary>查看原文（26行）</summary>

```text
    async execute(args, exec: unknown) {
      const resolved = resolveSessionPath(args.path, exec, deps.workspaceRoot)
      const name = basename(resolved)
      const format = detectFormat(name)
      if (format === null) {
        throw new Error(
          `unsupported CAD format: ${name} — supported extensions are .stl .obj .step .stp .iges .igs .brep .dcprt .dxf .svg`,
        )
      }
      const buffer = await loadCadFile(resolved)
      const scene = await convert(buffer, format, name)
      const stats = sceneStats(scene)
      const viewId = await deps.store.put(scene)
      const kind: '3d' | '2d' = is3DFormat(format) ? '3d' : '2d'
      const sceneUrlBase = deps.ensureSceneRoute()
      // Optional fields spread conditionally: an explicit undefined value
      // would fail the registry's lossless-JSON output validation.
      return {
        viewId,
        kind,
        format,
        file: resolved,
        ...(sceneUrlBase === null ? {} : { sceneUrl: `${sceneUrlBase}/${viewId}` }),
        ...(stats.triangles === undefined ? {} : { triangles: stats.triangles }),
        ...(stats.meshes === undefined ? {} : { meshes: stats.meshes }),
        ...(stats.entities === undefined ? {} : { entities: stats.entities }),
```

</details>

**依据 3 · 源码核查**：[client/index.tsx:72-80](https://github.com/LAU-MARS/dsh-cad/blob/7cdf502c4636abba20a7ef3ae0b1d47b346b92a1/client/index.tsx#L72-L80)

Web 卡片注册。

```text
  })

  // Chat tool rows: keyed toolview entries (a keyed hit replaces the generic
  // row). `locale` tags the entry for the conversation namespace's `t` seat.
  for (const key of CAD_TOOL_KEYS) {
    ctx.slots.inject('tool.call.toolview', () =>
      ctx.slots.register({ name: 'tool.call.toolview', key, locale: 'conversation' }, CadCallRow as unknown as (props: never) => JSX.Element),
    )
  }
```

#### 缺口

- 真实格式精度和审阅收益未测。
  **影响**：不能据场景可渲染推出精确几何。
  **进一步探讨**：用已知小模型和独立查看器对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 浏览器拿到场景要满足什么条件？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

根宿主要求 tools，将 cad_view 和其他工具注册。浏览器预览还依赖可取得的 webServer 或 httpServer。启动时会短周期重试注册，部分注册抛错时撤已注册项；按需工具也可再找路由。cad_view 仍能返回 viewId，但未取得路由时不含 sceneUrl。场景路由通过 ID 查存储，未知 ID 404，命中条件头可 304。卸载清定时器、工具与路由。工具返回和可打开画面是两个验收点。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:48-95](https://github.com/LAU-MARS/dsh-cad/blob/7cdf502c4636abba20a7ef3ae0b1d47b346b92a1/src/index.ts#L48-L95)

按需注册、回滚和启动重试。

<details>
<summary>查看原文（48行）</summary>

```text
  let routeDisposers: Array<() => void> = []
  /** Idempotently register the scene routes; returns the JSON base or null. */
  const ensureSceneRoute = (): string | null => {
    if (routeDisposers.length > 0) return '/dsh-cad/scene'
    const scope = ctx as { get?: (name: string) => unknown }
    const server = (scope.get?.('webServer') ?? scope.get?.('httpServer')) as
      | { register: (route: SceneRoute) => () => void }
      | undefined
    if (server === undefined) return null
    const pending: Array<() => void> = []
    try {
      pending.push(registerSceneRoute(server, store))
      pending.push(registerBinRoute(server, binStore))
      pending.push(registerDemoRoute(server))
      pending.push(registerDocsRoute(server, registry, binStore))
      pending.push(registerDocsDeleteRoute(server, registry))
      pending.push(registerAssemblyRoute(server, registry))
      pending.push(registerFeatureTreeRoute(server, registry))
    } catch (error) {
      // Roll back the partial batch, or the next attempt trips the duplicate
      // guard on the routes that did register.
      for (const dispose of pending) dispose()
      throw error
    }
    routeDisposers = pending
    return '/dsh-cad/scene'
  }

  // The demo route backs the CAD editor's startup fetch (before any tool
  // call), so registration must not wait for the first tool use. The web
  // composition may provide the HTTP server after our activation, so retry
  // briefly; fiber ordering decides the exact moment.
  let attempts = 0
  const retry = setInterval(() => {
    if (routeDisposers.length > 0 || ++attempts > 200) {
      clearInterval(retry)
      return
    }
    try {
      ensureSceneRoute()
    } catch {
      /* the lazy path (first tool use) still covers late availability */
    }
  }, 100)
  try {
    ensureSceneRoute()
  } catch {
    /* registers lazily at first tool use */
```

</details>

**依据 2 · 源码核查**：[src/index.ts:107-125](https://github.com/LAU-MARS/dsh-cad/blob/7cdf502c4636abba20a7ef3ae0b1d47b346b92a1/src/index.ts#L107-L125)

工具注册及清理。

<details>
<summary>查看原文（19行）</summary>

```text
  const disposers = [
    ctx.tools.register(cadView),
    ctx.tools.register(cadInfo),
    ...modelTools.map((tool) => ctx.tools.register(tool)),
    ctx.tools.register(cadFreeCad),
    ctx.tools.register(cadFusion),
    ctx.tools.register(cadOnshape),
    ctx.tools.register(cadImage),
    ctx.tools.register(cadScript),
  ]

  ctx.effect(() => {
    return () => {
      clearInterval(retry)
      for (const dispose of disposers) dispose()
      for (const dispose of routeDisposers) dispose()
      routeDisposers = []
    }
  })
```

</details>

**依据 3 · 源码核查**：[src/tools/cad-view.ts:93-109](https://github.com/LAU-MARS/dsh-cad/blob/7cdf502c4636abba20a7ef3ae0b1d47b346b92a1/src/tools/cad-view.ts#L93-L109)

仅路由可用时返回 URL。

<details>
<summary>查看原文（17行）</summary>

```text
      const buffer = await loadCadFile(resolved)
      const scene = await convert(buffer, format, name)
      const stats = sceneStats(scene)
      const viewId = await deps.store.put(scene)
      const kind: '3d' | '2d' = is3DFormat(format) ? '3d' : '2d'
      const sceneUrlBase = deps.ensureSceneRoute()
      // Optional fields spread conditionally: an explicit undefined value
      // would fail the registry's lossless-JSON output validation.
      return {
        viewId,
        kind,
        format,
        file: resolved,
        ...(sceneUrlBase === null ? {} : { sceneUrl: `${sceneUrlBase}/${viewId}` }),
        ...(stats.triangles === undefined ? {} : { triangles: stats.triangles }),
        ...(stats.meshes === undefined ? {} : { meshes: stats.meshes }),
        ...(stats.entities === undefined ? {} : { entities: stats.entities }),
```

</details>

**依据 4 · 源码核查**：[src/routes.ts:33-64](https://github.com/LAU-MARS/dsh-cad/blob/7cdf502c4636abba20a7ef3ae0b1d47b346b92a1/src/routes.ts#L33-L64)

场景查找、404 和条件缓存。

<details>
<summary>查看原文（32行）</summary>

```text
/** Register the scene route on the shared HTTP server. Returns a disposer. */
export function registerSceneRoute(server: { register: (route: SceneRoute) => () => void }, store: SceneStore): () => void {
  return server.register({
    kind: 'prefix',
    path: SCENE_ROUTE_PATH,
    handler: async (req: IncomingMessage, res: ServerResponse) => {
      const url = new URL(req.url ?? '/', 'http://localhost')
      const segments = url.pathname.split('/').filter((segment) => segment !== '')
      // ['/dsh-cad', 'scene', '<viewId>'] → viewId is the 3rd segment.
      const viewId = segments[2]
      if (req.method !== 'GET' || viewId === undefined) {
        res.writeHead(404, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ error: 'not found' }))
        return
      }
      const scene = await store.get(viewId)
      if (scene === null) {
        res.writeHead(404, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ error: 'unknown scene' }))
        return
      }
      const etag = store.etag(scene)
      if (req.headers['if-none-match'] === etag) {
        res.writeHead(304)
        res.end()
        return
      }
      const body = Buffer.from(JSON.stringify(scene))
      res.writeHead(200, {
        'content-type': 'application/json',
        'content-length': body.length,
        'cache-control': 'private, max-age=31536000, immutable',
```

</details>

#### 缺口

- 未验真实 Web、重载或其他访问身份。
  **影响**：不能确认所有场景路由可达和隔离。
  **进一步探讨**：在隔离宿主对照有无 HTTP 服务及重载。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 文件读取和脚本有什么采用限制？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

路径解析直接保留绝对路径，相对路径优先会话 cwd。cad_view 和 cad_info 通过 Node 文件 API 读二进制，所核辅助函数未对绝对路径加工作区范围检查。根包还注册 cad_script，Python 分支把内容写临时文件，再用宿主进程权限启动系统 Python，超时杀子进程。JS 分支有 vm 超时和同步结果要求，不能把这些机制当作宿主强沙箱。实际工具准入与运行权限应单独核验。

观察阶段先核部署是否能限定工具与访问边界。若获准试用，使用可丢弃的宿主、测试目录及无敏感小模型，只核预览链，先确认其他工具权限。外部工具、GPU 和模型费用未知，首次准备、手工几何对照和退出后的临时文件处理是实际成本。若路径可越出预期范围或场景与独立结果不符，应停用并改用原查看器。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/util.ts:22-45](https://github.com/LAU-MARS/dsh-cad/blob/7cdf502c4636abba20a7ef3ae0b1d47b346b92a1/src/tools/util.ts#L22-L45)

路径处理与 Node 二进制读取。

<details>
<summary>查看原文（24行）</summary>

```text
export function sessionCwdOf(exec: unknown): string | null {
  const cwd = (exec as { agent?: { session?: { header?: { cwd?: unknown } } | null } | undefined })?.agent?.session?.header?.cwd
  return typeof cwd === 'string' && path.isAbsolute(cwd) ? cwd : null
}

/**
 * Resolve a model-supplied path against the SESSION workspace first, falling
 * back to the process-cwd workspace root on hosts without session metadata.
 */
export function resolveSessionPath(input: string, exec: unknown, fallbackRoot: string): string {
  if (path.isAbsolute(input)) return input
  return path.join(sessionCwdOf(exec) ?? fallbackRoot, input)
}

/** Load a CAD file buffer, failing with model-friendly errors. */
export async function loadCadFile(resolvedPath: string): Promise<Buffer> {
  let info
  try {
    info = await stat(resolvedPath)
  } catch {
    throw new Error(`CAD file not found: ${resolvedPath}`)
  }
  if (!info.isFile()) throw new Error(`not a file: ${resolvedPath}`)
  return readFile(resolvedPath)
```

</details>

**依据 2 · 源码核查**：[src/index.ts:104-115](https://github.com/LAU-MARS/dsh-cad/blob/7cdf502c4636abba20a7ef3ae0b1d47b346b92a1/src/index.ts#L104-L115)

脚本工具默认注册。

<details>
<summary>查看原文（12行）</summary>

```text
  const cadImage = createCadImageTool({ store, workspaceRoot, ensureSceneRoute })
  const cadScript = createCadScriptTool({ workspaceRoot })

  const disposers = [
    ctx.tools.register(cadView),
    ctx.tools.register(cadInfo),
    ...modelTools.map((tool) => ctx.tools.register(tool)),
    ctx.tools.register(cadFreeCad),
    ctx.tools.register(cadFusion),
    ctx.tools.register(cadOnshape),
    ctx.tools.register(cadImage),
    ctx.tools.register(cadScript),
```

</details>

**依据 3 · 源码核查**：[src/tools/cad-script.ts:61-72](https://github.com/LAU-MARS/dsh-cad/blob/7cdf502c4636abba20a7ef3ae0b1d47b346b92a1/src/tools/cad-script.ts#L61-L72)

JS 超时与同步结果限制。

<details>
<summary>查看原文（12行）</summary>

```text
  let completion: unknown
  try {
    completion = vm.runInContext(code, context, { timeout: timeoutMs })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { ok: false, stdout: truncate(lines.join('\n')), error: message }
  }
  // Thenable check instead of instanceof Promise: the vm realm has its own
  // Promise class, so realm-crossing promises fail instanceof.
  if (completion !== undefined && completion !== null && typeof (completion as { then?: unknown }).then === 'function') {
    return { ok: false, stdout: truncate(lines.join('\n')), error: 'asynchronous completion value — keep the script synchronous (no await)' }
  }
```

</details>

**依据 4 · 源码核查**：[src/tools/cad-script.ts:121-149](https://github.com/LAU-MARS/dsh-cad/blob/7cdf502c4636abba20a7ef3ae0b1d47b346b92a1/src/tools/cad-script.ts#L121-L149)

Python 临时脚本、进程启动和超时。

<details>
<summary>查看原文（29行）</summary>

```text
  const dir = path.join(workspaceRoot, '.dsh-cad', 'tmp')
  await mkdir(dir, { recursive: true })
  const file = path.join(dir, `eval-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.py`)
  await writeFile(file, code, 'utf8')
  try {
    return await new Promise<EvalOutcome>((resolve) => {
      let child
      try {
        child = spawn(python.cmd, [...python.args, file], { cwd: workspaceRoot })
      } catch (error) {
        resolve({ ok: false, stdout: '', error: `failed to launch ${python.cmd}: ${error instanceof Error ? error.message : String(error)} — retry with language: "js"` })
        return
      }
      let stdout = ''
      let stderr = ''
      child.stdout.on('data', (chunk: Buffer) => {
        if (stdout.length < OUTPUT_CAP) stdout += chunk.toString('utf8')
      })
      child.stderr.on('data', (chunk: Buffer) => {
        if (stderr.length < OUTPUT_CAP) stderr += chunk.toString('utf8')
      })
      const timer = setTimeout(() => {
        child.kill()
        resolve({ ok: false, stdout: truncate(stdout), stderr: truncate(stderr), error: `python timed out after ${timeoutMs} ms` })
      }, timeoutMs)
      child.on('error', (error) => {
        clearTimeout(timer)
        resolve({ ok: false, stdout: truncate(stdout), error: `failed to launch ${python.cmd}: ${error.message} — retry with language: "js"` })
      })
```

</details>

#### 缺口

- 宿主是否限制各工具及其文件可达范围未实测。
  **影响**：不能把部署目录当安全边界。
  **进一步探讨**：用无敏感副本分别核允许、拒绝路径和子进程权限。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证预览减少切换并保持几何正确？

**研究主题**：新假设与验证

#### 完整回答

假设聊天内预览能减少复核往返。给两组相同的公开样例，包含已知单位的 STL、STEP 和一个损坏文件，比较聊天内和独立查看器的定位时间、正确零件、边界尺寸和失败提示。Web 无路由时单测工具返回，不能混入成功数。若错件、单位判断或复核时间更差，则保留独立查看器。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/cad-view.ts:84-109](https://github.com/LAU-MARS/dsh-cad/blob/7cdf502c4636abba20a7ef3ae0b1d47b346b92a1/src/tools/cad-view.ts#L84-L109)

可固定格式、预览 ID 和可选 URL。

<details>
<summary>查看原文（26行）</summary>

```text
    async execute(args, exec: unknown) {
      const resolved = resolveSessionPath(args.path, exec, deps.workspaceRoot)
      const name = basename(resolved)
      const format = detectFormat(name)
      if (format === null) {
        throw new Error(
          `unsupported CAD format: ${name} — supported extensions are .stl .obj .step .stp .iges .igs .brep .dcprt .dxf .svg`,
        )
      }
      const buffer = await loadCadFile(resolved)
      const scene = await convert(buffer, format, name)
      const stats = sceneStats(scene)
      const viewId = await deps.store.put(scene)
      const kind: '3d' | '2d' = is3DFormat(format) ? '3d' : '2d'
      const sceneUrlBase = deps.ensureSceneRoute()
      // Optional fields spread conditionally: an explicit undefined value
      // would fail the registry's lossless-JSON output validation.
      return {
        viewId,
        kind,
        format,
        file: resolved,
        ...(sceneUrlBase === null ? {} : { sceneUrl: `${sceneUrlBase}/${viewId}` }),
        ...(stats.triangles === undefined ? {} : { triangles: stats.triangles }),
        ...(stats.meshes === undefined ? {} : { meshes: stats.meshes }),
        ...(stats.entities === undefined ? {} : { entities: stats.entities }),
```

</details>

**依据 2 · 源码核查**：[src/routes.ts:43-57](https://github.com/LAU-MARS/dsh-cad/blob/7cdf502c4636abba20a7ef3ae0b1d47b346b92a1/src/routes.ts#L43-L57)

路由错误可作为对照条件。

<details>
<summary>查看原文（15行）</summary>

```text
      if (req.method !== 'GET' || viewId === undefined) {
        res.writeHead(404, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ error: 'not found' }))
        return
      }
      const scene = await store.get(viewId)
      if (scene === null) {
        res.writeHead(404, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ error: 'unknown scene' }))
        return
      }
      const etag = store.etag(scene)
      if (req.headers['if-none-match'] === etag) {
        res.writeHead(304)
        res.end()
```

</details>

#### 缺口

- 未执行几何与流程对照。
  **影响**：不应据功能存在承诺减少返工。
  **进一步探讨**：保存样例真值及可复核的结果。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
