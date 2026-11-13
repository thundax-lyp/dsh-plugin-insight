# OpenWrite

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[019e71d](https://github.com/LiPu-jpg/Openwrite/tree/019e71dc7cfe0af3e128119fe486732a92b9214b)

<!-- BEGIN META -->
[![GitHub ★ 948](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=948&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LiPu-jpg/Openwrite) [![npm 30d 9,011](https://img.shields.io/static/v1?label=npm+30d&message=9%2C011&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openwrite) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openwrite)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供长篇小说写作预设、创作工作台与 Core 桥接。

> **亮点**：[Q01](#research-q01) 把作品、原会话和写作 Core 连入同一宿主，[Q02](#research-q02) 按固定产物管理本地运行环境。

> **主要限制**：[Q02](#research-q02) 运行环境恢复与 [Q03](#research-q03) 的稿件、任务和模型状态需要分别核对。

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
  - [Q01 · 写作界面如何选作品并落到 Core？](#detail-section-11)
  - [Q02 · 托管环境和故障恢复对稿件能证明什么？](#detail-section-12)
  - [Q03 · 如何对账一次单章修订并识别冲突？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长篇作者希望在 DSH 管理稿件、资料和审稿任务，并能独立复核单章修订。

直接使用独立写作工具、备份稿件，在不同界面人工传递章节及审稿结果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 写作预设 | 组织当前作者任务 | 版本归属检查 |
| Core 桥 | 运行写作与修订 | 需要兼容模型和作品 |
| 运行时 | 安装或连接 Core | ready 不代表稿件状态 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 与工作区注册 | 必需 | 宿主、作品和工具 | 拒绝业务请求 |
| Core 与版本匹配环境 | 需要 | 写作与审稿 | 停止启动 |
| 已授权模型及稿件副本 | 试用需要 | 生成与恢复 | 回人工 |

| 步骤 | 谁操作 | 操作与结果 | 失败处理 |
| --- | --- | --- | --- |
| 准备 | 作者 | 选空白副本和精确版本 | 不动真稿 |
| 写作 | 作者 | 提交一章并保留任务 ID | 查实际正文与回执 |
| 退出 | 作者 | 从备份继续人工编辑 | 不盲重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 环境和下载 | 核模型与宿主 | 真实兼容未知 |
| 持续 | 模型和存储 | 审稿与校正 | 单位合格章节未测 |
| 恢复 | 可能重复推理 | 核稿件及任务 | 跨边界不保证一致 |
| 退出 | 稿件及副本 | 备份后停用 | 已发请求需查回执 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 作品范围 | 工作区解析和拒绝 | 真实部署鉴权 |
| Core 环境 | SHA、健康和代次 | 跨平台安装 |
| 修订 | 锁与正文指纹 | 恢复和净写作收益 |

> **思考**：[Q02](#research-q02) 运行环境恢复与 [Q03](#research-q03) 的稿件、任务和模型状态需要分别核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把作品、原会话和写作 Core 连入同一宿主，[Q02](#research-q02) 按固定产物管理本地运行环境。

[Q02](#research-q02) 不把探测超时作为进程已死；[Q03](#research-q03) 锁、版本和 checkpoint 只覆盖各自步骤。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 运行环境恢复与 [Q03](#research-q03) 的稿件、任务和模型状态需要分别核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 有备份才试单章，先验证工作区与模型目的地，异常以原任务和文件对账。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认组合挂载、工作区路由、版本健康门以及 Core 局部修订保护。真实安装和跨故障点恢复未验。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、packages/openwrite-bridge/src/domain.ts、packages/openwrite-bridge/src/index.ts、packages/openwrite-bridge/src/managed-runtime.ts、plugin.mjs、release/runtime-manifest.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查根组合、工作区、托管运行时及固定 wheel 三个成员。未运行目标、真实宿主或模型。
- 下一步：隔离作品测试切换、健康超时和中断，分别观察正文、模型和任务账。

**分析版本**

- **仓库**：[LiPu-jpg/Openwrite](https://github.com/LiPu-jpg/Openwrite)
- **版本号**：0.2.38（[固定提交 019e71d](https://github.com/LiPu-jpg/Openwrite/tree/019e71dc7cfe0af3e128119fe486732a92b9214b)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 测试只读恢复预览能否降低盲目重试，对照现有任务和版本页。

隔离作品测试切换、健康超时和中断，分别观察正文、模型和任务账。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 111 | 11274 | — | — | 186801 |
| .mjs | source | 36 | 6462 | 5384 | 839 | — |
| .mjs | test | 18 | 5665 | 4549 | 858 | — |
| .ts | source | 42 | 16993 | 15010 | 1261 | — |
| .ts | test | 16 | 1692 | 1478 | 99 | — |
| .tsx | test | 30 | 8075 | 7078 | 351 | — |
| .tsx | source | 31 | 14733 | 13251 | 815 | — |

</details>

**活跃度**

[![近30天新建 54](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=54&color=737b86&logo=github)](https://github.com/LiPu-jpg/Openwrite/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 54](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=54&color=737b86&logo=github)](https://github.com/LiPu-jpg/Openwrite/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：作者怎样在 DSH 管理单章修订，哪些工作区、运行时和稿件状态必须分别验证？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 写作界面如何选作品并落到 Core？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

长篇作者可以在 DSH 使用固定版本预设、写作桥及 Studio，而不用在独立 Core 与对话间搬运稿件。根补丁加载这三个部分，根入口按版本及 ownership marker 管理预设。桥从宿主 connection 判别浏览器请求，workspaceRegistry 按 ID 解析真实根目录，业务路由拒绝缺失、无服务或未知 ID。全局 viewerRoot 仅用于失效通知，未知 ID 回全局桶不能解释为业务写入成功。Core 提供写作流程，宿主包提供工作区和权限接线。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:29-36](https://github.com/LiPu-jpg/Openwrite/blob/019e71dc7cfe0af3e128119fe486732a92b9214b/README.md#L29-L36)

作者说明长篇工作台及配置需求。

```text
这是 [OpenWrite](https://github.com/LiPu-jpg/Openwrite/tree/native-core) 的 dsh 插件版本。
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 提供 Agent 与交互界面，OpenWrite Core 提供小说领域能力；人物、设定、大纲、正文和评审保存在本地作品目录。

长篇小说的规划、写作、审稿和改稿都在 dsh 里的三个原生工作台页签完成：**创作**（正文、批注、版本）、**资料**（人物、设定、大纲、研究）、**任务**（模型、导入导出）。适合愿意自己配置模型、在本机管理稿件的作者与工作室；不适合期待开箱即用的云端成品、或不愿提供模型 API Key 的场景。

## 快速安装

**运行要求**：dsh 宿主（精确版本见下）· Node ≥ 22.19 · macOS arm64/x64、Linux x64、Windows x64 · 首次使用会下载 uv、Python 3.12 与锁定依赖 · 真正写稿与审稿需要你自己的模型 API Key。
```

**依据 2 · 源码核查**：[cordis.patch.yml:1-9](https://github.com/LiPu-jpg/Openwrite/blob/019e71dc7cfe0af3e128119fe486732a92b9214b/cordis.patch.yml#L1-L9)

预设、managed bridge 与面板实际组合。

```text
- insert:
    - id: openwrite-bundle
      name: dsh-openwrite
    - id: openwrite-bridge
      name: dsh-openwrite/bridge
      config:
        mode: managed
    - id: studio-panel
      name: ./packages/studio-panel/lib/index.js
```

**依据 3 · 源码核查**：[plugin.mjs:140-165](https://github.com/LiPu-jpg/Openwrite/blob/019e71dc7cfe0af3e128119fe486732a92b9214b/plugin.mjs#L140-L165)

版本绑定、归属标记及已有预设保护。

<details>
<summary>查看原文（26行）</summary>

```text
export async function apply(ctx) {
  const home = resolveDshHome()
  const source = fileURLToPath(new URL('./presets/openwrite/', import.meta.url))
  const version = JSON.parse(await readFile(new URL('./package.json', import.meta.url), 'utf8')).version
  const id = `openwrite-${version.replace(/[^a-z0-9-]/g, '-')}`
  const destination = join(home, '.agent-presets', id)
  const managedRoot = join(home, 'openwrite')
  const leases = join(managedRoot, 'preset-leases', id)
  await mkdir(leases, { recursive: true })
  await mkdir(join(home, '.agent-presets'), { recursive: true })
  const lease = join(leases, `${process.pid}-${randomUUID()}.json`)
  const withLock = async operation => {
    const release = await lock(leases, { realpath: false, stale: 30_000, retries: { retries: 30, minTimeout: 100, maxTimeout: 500 } })
    try { return await operation() } finally { await release() }
  }
  const marker = join(destination, '.openwrite-managed.json')
  await withLock(async () => {
    const existing = await readFile(marker, 'utf8').then(JSON.parse).catch(() => null)
    if (existing) {
      if (existing.source !== await digestShipped(source, destination)) {
        throw new Error(`OpenWrite preset ${id} was modified; copy it to a custom preset before reinstalling this version`)
      }
    }
    if (!existing) {
      if (await lstat(destination).then(() => true).catch(error => { if (error.code === 'ENOENT') return false; throw error })) {
        throw new Error(`OpenWrite preset ${id} already exists without an ownership marker; preserve it under a custom preset name first`)
```

</details>

**依据 4 · 源码核查**：[packages/openwrite-bridge/src/index.ts:102-112](https://github.com/LiPu-jpg/Openwrite/blob/019e71dc7cfe0af3e128119fe486732a92b9214b/packages/openwrite-bridge/src/index.ts#L102-L112)

懒取宿主工作区。

<details>
<summary>查看原文（11行）</summary>

```text
export function apply(ctx: Context, config: Config) {
  validateConfig(config)
  // The web host process mounts ctx.workspaceRegistry. Resolve it lazily on
  // every call: plugin start order must not strand the lookup, an absent
  // registry (null) fails closed in the domain, and ctx.inject(['webServer',
  // ...]) would silently never fire if we inject-required a second service.
  const resolveWorkspace = (workspaceId: string): string | undefined | null => {
    const registry = ctx.get('workspaceRegistry')
    if (registry === undefined) return null
    return registry.get(workspaceId as WorkspaceId)?.path
  }
```

</details>

**依据 5 · 源码核查**：[packages/openwrite-bridge/src/index.ts:177-192](https://github.com/LiPu-jpg/Openwrite/blob/019e71dc7cfe0af3e128119fe486732a92b9214b/packages/openwrite-bridge/src/index.ts#L177-L192)

真实连接鉴权和运行时入口。

<details>
<summary>查看原文（16行）</summary>

```text
  const authorizeRequest = (headers: Record<string, string | string[] | undefined>): number | undefined => {
    const connection = ctx.get('connection')
    return connection ? connection.requestRejection({ headers }) : 503
  }
  const domain = new NovelDomainService(ctx, { authorizeRequest, baseUrl: config.baseUrl, timeoutMs: config.timeoutMs, outputDir: config.outputDir, resolveWorkspace,
    ...(runtime ? { connect: () => runtime.ensure() }
      : config.authToken ? { connect: async () => ({ baseUrl: config.baseUrl, token: config.authToken }) } : {}),
  })
  ctx.effect(() => () => runtime?.dispose(), 'openwrite: owned runtime cleanup')
  ctx.inject(['webServer'], webCtx => webCtx.effect(() => webCtx.webServer.register({
    kind: 'exact', path: '/studio-panel/runtime', handler: async (req, res) => {
      const respond = (code: number, data: unknown) => { res.writeHead(code, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(JSON.stringify(data)) }
      const rejection = authorizeRequest(req.headers)
      if (rejection !== undefined) { respond(rejection, { error: 'dsh browser authentication required', message: 'dsh browser authentication required', code: 'AUTHENTICATION_REQUIRED' }); return }
      if (req.method === 'GET') { respond(200, runtime?.status() ?? { phase: 'ready', message: 'Using an external writing environment' }); return }
      if (req.method !== 'POST' || req.headers['x-openwrite-studio'] !== '1') { respond(405, { error: 'Method not allowed', message: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }); return }
```

</details>

**依据 6 · 源码核查**：[packages/openwrite-bridge/src/domain.ts:422-451](https://github.com/LiPu-jpg/Openwrite/blob/019e71dc7cfe0af3e128119fe486732a92b9214b/packages/openwrite-bridge/src/domain.ts#L422-L451)

全局观察桶和业务 workspace 解析分开。

<details>
<summary>查看原文（30行）</summary>

```text
  /**
   * The workspace a browser view belongs to, for invalidation only.
   *
   * An unknown or absent workspace id resolves to the global bucket rather
   * than to a rejection: the payload of a global path does not depend on the
   * workspace, so a stale id must not turn a readable answer into an error.
   */
  private viewerRoot(id: string | undefined): string {
    if (id === undefined || id === '') return LEGACY_ROOT_KEY
    if (this.resolveWorkspace === undefined) return LEGACY_ROOT_KEY
    const root = this.resolveWorkspace(id)
    return root === undefined || root === null ? LEGACY_ROOT_KEY : root
  }

  private resolveBrowserWorkspace(id: string | undefined): { root: string, id: string } | { rejection: WorkspaceRejection } {
    if (id === undefined) {
      return { rejection: { status: 400, code: 'WORKSPACE_CONTEXT_MISSING', message: 'missing workspace id (x-dsh-workspace-id header or ?workspace= param)' } }
    }
    if (this.resolveWorkspace === undefined) {
      return { rejection: { status: 503, code: 'WORKSPACE_REGISTRY_UNAVAILABLE', message: 'host workspaceRegistry service is not available' } }
    }
    const root = this.resolveWorkspace(id)
    if (root === null) {
      return { rejection: { status: 503, code: 'WORKSPACE_REGISTRY_UNAVAILABLE', message: 'host workspaceRegistry service is not available' } }
    }
    if (root === undefined) {
      return { rejection: { status: 400, code: 'WORKSPACE_UNKNOWN', message: `workspace id is not registered: ${id}` } }
    }
    return { root, id }
  }
```

</details>

#### 缺口

- 未运行宿主鉴权和工作区切换
  **影响**：不能证明全部路由在目标环境隔离
  **进一步探讨**：以两个空作品测试未知、缺失和无权 ID

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 托管环境和故障恢复对稿件能证明什么？

**研究主题**：依赖、兼容与流程、工程质量与复用、缺陷与关键质疑

#### 完整回答

ManagedRuntime 读取当前清单，对 wheel、依赖锁和可选依赖 wheels 验证 SHA，按清单及 Python 配置生成环境标识。自带 Python 路径和默认 uv 建环境分开，健康接口还须匹配 Core 和 API。工作中的旧服务健康超时被视为未知，保留现有连接；有确定失活才停止旧进程并进入恢复。服务 ready 是环境与连接事实，不能据此确认中断前章节、任务状态和模型计费都已一致。

#### 证据与依据

**依据 1 · 源码核查**：[release/runtime-manifest.json:1-8](https://github.com/LiPu-jpg/Openwrite/blob/019e71dc7cfe0af3e128119fe486732a92b9214b/release/runtime-manifest.json#L1-L8)

固定 Core 5.8.31 及 contract 版本。

```text
{
  "schema": 1,
  "dsh": "0.1.2-rc.1",
  "uv_version": "0.11.19",
  "python_version": "3.12.13",
  "core_version": "5.8.31",
  "contract_version": 1,
  "platforms": {
```

**依据 2 · 源码核查**：[packages/openwrite-bridge/src/managed-runtime.ts:626-648](https://github.com/LiPu-jpg/Openwrite/blob/019e71dc7cfe0af3e128119fe486732a92b9214b/packages/openwrite-bridge/src/managed-runtime.ts#L626-L648)

校验 artifact 并绑定环境代次。

<details>
<summary>查看原文（23行）</summary>

```text
  private async prepare(signal: AbortSignal): Promise<BackendConnection> {
    const manifest = JSON.parse(await readFile(join(this.artifacts, 'runtime-manifest.json'), 'utf8')) as RuntimeManifest
    const platform = manifest.platforms[`${process.platform}-${process.arch}`]
    if (this.pythonPath && !isAbsolute(this.pythonPath)) throw new Error('pythonPath / OPENWRITE_PYTHON must be an absolute path to a Python executable, without command-line arguments')
    if (this.pythonModulePaths.length && !this.pythonPath) throw new Error('pythonModulePaths requires pythonPath or OPENWRITE_PYTHON')
    if (this.pythonModulePaths.some(path => !isAbsolute(path))) throw new Error('pythonModulePaths must contain absolute dependency directory paths')
    if (!this.pythonPath && !platform) throw new UnsupportedRuntimePlatformError(`${process.platform}/${process.arch}`)
    if (!manifest.wheel || !manifest.requirements) throw new Error('The package is missing Core or dependency checksums')
    const wheel = join(this.artifacts, manifest.wheel.file)
    const requirements = join(this.artifacts, manifest.requirements.file)
    if (await sha256(wheel) !== manifest.wheel.sha256 || await sha256(requirements) !== manifest.requirements.sha256) {
      throw new Error('Package verification failed; reinstall OpenWrite')
    }
    for (const artifact of manifest.dependency_wheels ?? []) {
      if (await sha256(join(this.artifacts, artifact.file)) !== artifact.sha256) throw new Error('Platform dependency verification failed; reinstall OpenWrite')
    }
    await mkdir(this.root, { recursive: true, mode: 0o700 })
    const unlock = await this.lock(signal)
    let python: string
    try {
      const generation = createHash('sha256').update(JSON.stringify(manifest))
        .update(this.pythonPath ? JSON.stringify({ pythonPath: this.pythonPath, pythonModulePaths: this.pythonModulePaths }) : '').digest('hex').slice(0, 24)
      const destination = join(this.root, 'environments', generation)
```

</details>

**依据 3 · 源码核查**：[packages/openwrite-bridge/src/managed-runtime.ts:652-695](https://github.com/LiPu-jpg/Openwrite/blob/019e71dc7cfe0af3e128119fe486732a92b9214b/packages/openwrite-bridge/src/managed-runtime.ts#L652-L695)

自带 Python 与托管安装分别验证。

<details>
<summary>查看原文（44行）</summary>

```text
        coreRoot = join(destination, 'core')
        const complete = await readFile(join(destination, '.complete'), 'utf8').catch(() => '') === generation
        try {
          if (!complete) {
            await rm(destination, { recursive: true, force: true })
            await mkdir(coreRoot, { recursive: true })
            // Core is a pure-Python wheel. Install only its verified contents in
            // our directory: no pip/uv, dependency resolution, or author-site writes.
            for (const [name, bytes] of Object.entries(unzipSync(await readFile(wheel)))) {
              signal.throwIfAborted()
              const target = resolve(coreRoot, name)
              if (isAbsolute(name) || !target.startsWith(coreRoot + sep)) throw new Error('Invalid Core wheel path')
              if (name.endsWith('/')) await mkdir(target, { recursive: true })
              else { await mkdir(dirname(target), { recursive: true }); await writeFile(target, bytes) }
            }
          }
          this.update('installing', 'Checking the supplied Python and its dependencies; no runtime downloads')
          await this.command(python, ['-I', '-B', '-X', 'utf8', '-c',
            'import json, sys; assert sys.version_info >= (3, 10), "Python >=3.10 is required"; sys.path[:0] = json.loads(sys.argv[1]); from tools.studio_http import health_payload; from tools.studio import create_server; h = health_payload(); assert h["core_version"] == sys.argv[2] and h["contract_version"] == int(sys.argv[3]), "Core version or API mismatch"',
            JSON.stringify([coreRoot, ...this.pythonModulePaths]), manifest.core_version, String(manifest.contract_version)],
          AbortSignal.any([signal, AbortSignal.timeout(120_000)]))
          if (!complete) await writeFile(join(destination, '.complete'), generation)
        } catch (error) {
          if (!complete) await rm(destination, { recursive: true, force: true })
          signal.throwIfAborted()
          throw new Error(`Supplied Python is not ready: ${sanitizeDiagnostic(error instanceof Error ? error.message : String(error))}. Prepare its dependencies first; see docs/INSTALL.md#bring-your-own-python. No uv or Python download was attempted.`)
        }
      } else {
        if (!platform) throw new UnsupportedRuntimePlatformError(`${process.platform}/${process.arch}`)
        python = join(destination, process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python')
        if (await readFile(join(destination, '.complete'), 'utf8').catch(() => '') !== generation) {
          const uv = await this.extract(platform.uv, signal)
          const basePython = await this.extract(platform.python, signal)
          this.update('installing', 'Installing isolated dependencies; first use may take several minutes')
          await rm(destination, { recursive: true, force: true })
          try {
            await this.command(uv, ['venv', '--python', basePython, destination], signal)
            await this.command(uv, ['pip', 'sync', '--python', python, '--require-hashes', '--only-binary', ':all:',
              ...(manifest.dependency_wheels?.length ? ['--find-links', join(this.artifacts, 'wheels')] : []), requirements], signal)
            await this.command(uv, ['pip', 'install', '--python', python, '--no-deps', wheel], signal)
            await this.command(python, ['-I', '-c', 'from tools.studio_http import health_payload; from tools.studio import create_server; assert health_payload()["contract_version"] == 1'], signal)
            await writeFile(join(destination, '.complete'), generation)
          } catch (error) { await rm(destination, { recursive: true, force: true }); throw error }
        }
```

</details>

**依据 4 · 源码核查**：[packages/openwrite-bridge/src/managed-runtime.ts:775-786](https://github.com/LiPu-jpg/Openwrite/blob/019e71dc7cfe0af3e128119fe486732a92b9214b/packages/openwrite-bridge/src/managed-runtime.ts#L775-L786)

实际健康接口和版本一致性。

<details>
<summary>查看原文（12行）</summary>

```text
      const connection = { baseUrl: `http://127.0.0.1:${port}`, token }
      const health = await fetch(connection.baseUrl + '/api/health', {
        headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.any([signal, AbortSignal.timeout(10_000)]),
      })
      const result = await health.json() as Record<string, unknown>
      if (!health.ok || result.core_version !== manifest.core_version || result.contract_version !== manifest.contract_version) {
        throw new Error('Writing backend version or API mismatch; reinstall OpenWrite')
      }
      this.connection = connection
      started = true
      if (!this.recovered) this.restartAttempts = 0
      this.update('ready', this.recovered
```

</details>

**依据 5 · 源码核查**：[packages/openwrite-bridge/src/managed-runtime.ts:284-311](https://github.com/LiPu-jpg/Openwrite/blob/019e71dc7cfe0af3e128119fe486732a92b9214b/packages/openwrite-bridge/src/managed-runtime.ts#L284-L311)

超时未知与确认失活走不同分支。

<details>
<summary>查看原文（28行）</summary>

```text
  private async verifyConnection(connection: BackendConnection): Promise<BackendConnection> {
    const liveness = await this.probeLiveness(connection)
    // Only a *confirmed* dead backend justifies tearing it down. A probe that
    // merely timed out is ambiguous — a backend busy running chapter_write or
    // review answers /api/health late — and killing it destroys exactly the
    // in-flight work this recovery path exists to protect.
    if (liveness === 'alive') {
      if (this.closed) throw new Error('OpenWrite was removed')
      const current = this.connection
      if (current) return current
      return this.queueRestart()
    }
    if (liveness === 'unknown') {
      // Keep serving the cached connection and let the real request decide; a
      // slow health answer is not a reason to invalidate a working backend.
      const current = this.connection
      if (current) return current
      return this.queueRestart()
    }
    if (this.connection !== connection) return this.queueRestart()
    this.connection = undefined
    const child = this.child
    this.child = undefined
    if (child) await stopOwnedProcess(child).catch(() => {})
    if (this.closed) throw new Error('OpenWrite was removed')
    if (!this.allowRevive) throw new Error('Setup was cancelled; retry when ready')
    this.update('recovering', 'The writing backend is unresponsive; recovering')
    return this.queueRestart()
```

</details>

#### 缺口

- 未执行当前安装、连接超时或进程故障
  **影响**：不能保证重启与跨操作恢复
  **进一步探讨**：以隔离作品和假 Core 模拟健康慢答和确实退出

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何对账一次单章修订并识别冲突？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

只读当前 Core 5.8.31 wheel 的三个成员，证据在 CORE-WHEEL-INSPECTION.json。project_lock 的 acquire 用排他创建和心跳，revision_service 的 create_selection 有预期正文指纹校验，task_runner 的 checkpoint 在 committing 之外检查取消。这些是局部保护，不能把模型请求、稿件提交和任务回执看成一个事务。以独立副本试一章，比较改稿前后、原任务 ID、实际提交和模型回执。假设把这三类状态放进只读恢复预览，可降低错重试，若现有版本/任务页能同效或无误判改善则不添加。模型现金、首次环境和人工审稿分别记录。异常先查看文件和回执，退回备份。

#### 证据与依据

**依据 1 · 源码核查**：[release/runtime-manifest.json:1-8](https://github.com/LiPu-jpg/Openwrite/blob/019e71dc7cfe0af3e128119fe486732a92b9214b/release/runtime-manifest.json#L1-L8)

固定观察对象 Core 版本。

```text
{
  "schema": 1,
  "dsh": "0.1.2-rc.1",
  "uv_version": "0.11.19",
  "python_version": "3.12.13",
  "core_version": "5.8.31",
  "contract_version": 1,
  "platforms": {
```

**依据 2 · 源码核查**：[packages/openwrite-bridge/src/managed-runtime.ts:284-311](https://github.com/LiPu-jpg/Openwrite/blob/019e71dc7cfe0af3e128119fe486732a92b9214b/packages/openwrite-bridge/src/managed-runtime.ts#L284-L311)

运行时恢复只能确认连接范围。

<details>
<summary>查看原文（28行）</summary>

```text
  private async verifyConnection(connection: BackendConnection): Promise<BackendConnection> {
    const liveness = await this.probeLiveness(connection)
    // Only a *confirmed* dead backend justifies tearing it down. A probe that
    // merely timed out is ambiguous — a backend busy running chapter_write or
    // review answers /api/health late — and killing it destroys exactly the
    // in-flight work this recovery path exists to protect.
    if (liveness === 'alive') {
      if (this.closed) throw new Error('OpenWrite was removed')
      const current = this.connection
      if (current) return current
      return this.queueRestart()
    }
    if (liveness === 'unknown') {
      // Keep serving the cached connection and let the real request decide; a
      // slow health answer is not a reason to invalidate a working backend.
      const current = this.connection
      if (current) return current
      return this.queueRestart()
    }
    if (this.connection !== connection) return this.queueRestart()
    this.connection = undefined
    const child = this.child
    this.child = undefined
    if (child) await stopOwnedProcess(child).catch(() => {})
    if (this.closed) throw new Error('OpenWrite was removed')
    if (!this.allowRevive) throw new Error('Setup was cancelled; retry when ready')
    this.update('recovering', 'The writing backend is unresponsive; recovering')
    return this.queueRestart()
```

</details>

**依据 3 · 作者声明**：[README.md:72-75](https://github.com/LiPu-jpg/Openwrite/blob/019e71dc7cfe0af3e128119fe486732a92b9214b/README.md#L72-L75)

作者说明精确版本和 profile 备份。

```text
- 需要复现或回退时安装精确版本：`dsh-openwrite@<精确版本>` 与 GitHub Release 的同名 `.tgz` 为同一份已验收产物。
- 宿主的原生升级保护补丁尚未进入正式宿主，插件侧的停机升级工具不等于宿主原生安装命令已有保护。
- 若旧客户端在 0.2 宿主上激活失败，桌面端可能触发 profile 恢复。恢复后：关闭桌面端并备份当前 profile，从自己的 `cordis.patch.yml.bak-*` 备份恢复 patch，同时恢复原 `package.json` 的 `dsh.profile.bundles` 列表。安装包和作品目录通常仍在；不要用出厂模板覆盖其他插件配置。也不要靠给旧子包授权来代替升级——`dsh-openwrite` 的版本豁免不覆盖 `@dsh-novel/studio-panel@<ver>`。
- 卸载：停止 dsh 后执行 `dsh plugin --profile web remove -w dsh-openwrite`。作品、配置、凭据和会话默认保留。
```

#### 缺口

- 中断点跨正文、任务和计费的恢复一致性未验证
  **影响**：不宜用于无备份真稿或盲目重试
  **进一步探讨**：在测试副本分别在模型、正文和任务提交阶段制造中断，按同一原 ID 对账

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
