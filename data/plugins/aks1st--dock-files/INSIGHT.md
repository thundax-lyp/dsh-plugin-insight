# dock-files

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[d24224b](https://github.com/AKS1st/dock-files/tree/d24224beb8cf024a9c6e79fe97445001d73150b8)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock-files) [![npm 30d 1,336](https://img.shields.io/static/v1?label=npm+30d&message=1%2C336&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-files) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-files)
<!-- END META -->

> **实现功能**：为 DSH Dock 添加当前会话工作目录浏览、文件打开及上传下载和文件管理入口。

> **核心亮点**：相对系统文件管理器，贡献在当前会话上下文与Dock查看器衔接；基础文件及信任围栏代码注明来自dsh-better-sidebar，主要是集成适配，不宣称原创文件安全机制。[Q01](#research-q01)

> **风险与缺陷**：浏览器Host/Origin围栏明确不是身份认证；普通操作缺sessionId时回退process.cwd，probe又刻意不做工作区限制，不能把“会话范围”宣传当统一强隔离保证。[Q03](#research-q03)

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
  - [Q01 · 当前会话文件联动的独立增量在哪里？](#detail-section-11)
  - [Q02 · 路径、桥接和上传怎样到达文件系统？](#detail-section-12)
  - [Q03 · 会话范围和浏览器围栏是否等同认证隔离？](#detail-section-13)
  - [Q04 · 为什么先观察再考虑文件写入？](#detail-section-14)
  - [Q05 · 统一会话和认证要求会否降低错目录风险？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有dock-base工作区、希望在会话旁查看与整理文件的用户；合格结果是打开正确会话目录并在明确范围内完成文件操作。

系统文件管理器不依赖DSH，但需手动定位目录；宿主原生文件树可替代部分查看，Dock桥接增加统一查看器和传输便利。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 工作区浏览和打开 | 在Dock查看会话文件 | 依赖正确cwd及查看器 |
| 新建、重命名、复制、移动、删除 | 文件整理 | 写前备份，范围与会话须核对 |
| 上传下载 | 交换文件与目录 | 分块偏移和大小约束，资源峰值未测 |
| 聊天打开桥接 | 把资源地址送到Dock | 包装宿主方法，兼容需核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| dock-base及匹配DSH Web服务 | 必需 | Dock和Host API | 面板/文件操作不可用 |
| 当前会话及正确cwd | 安全使用必需 | 工作区定位和范围判断 | 部分操作回退进程cwd，需警惕错目录 |
| 本地可信访问环境 | 必需条件 | 缩小非认证路由暴露 | Host/Origin不等于身份认证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 准备dock-base并加载插件 | 文件面板指向预期会话目录 |
| 2 | 先浏览、打开小文件，再试副本上传 | 地址和查看器匹配 |
| 3 | 写前核对cwd并备份 | 错误偏移/范围拒绝，失败查目标与临时文件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Dock依赖与本地资源 | 核对环境、目录及权限 | 安装耗时未知 |
| 持续使用 | 上传临时文件、zip和传输资源 | 核对目标、冲突及查看器 | 大目录内存峰值未测 |
| 失败恢复 | 临时文件清理/重传 | 验证偏移、源目标和副本 | 文件删除不等于系统回收站 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话文件联动 | cwd与资源地址桥接 | 当前宿主打开正确率 |
| 范围和传输约束 | realpath、分块偏移与大小上限 | 所有部署下身份隔离和竞态安全 |

> **思考**：浏览器Host/Origin围栏明确不是身份认证；普通操作缺sessionId时回退process.cwd，probe又刻意不做工作区限制，不能把“会话范围”宣传当统一强隔离保证。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对系统文件管理器，贡献在当前会话上下文与Dock查看器衔接；基础文件及信任围栏代码注明来自dsh-better-sidebar，主要是集成适配，不宣称原创文件安全机制。[Q01](#research-q01)

相对系统文件管理器，贡献在当前会话上下文与Dock查看器衔接；基础文件及信任围栏代码注明来自dsh-better-sidebar，主要是集成适配，不宣称原创文件安全机制。[Q01](#research-q01)

路径canonicalization和不存在目标的父目录处理值得借鉴，分块失败truncate回已提交字节让重试边界清楚。另一方面同一API混合严格会话要求与process.cwd回退，授权模型需统一；bridge包装原openResource必须在生命周期恢复，增加宿主耦合。

<a id="detail-section-5"></a>

### 1.4 主要限制

浏览器Host/Origin围栏明确不是身份认证；普通操作缺sessionId时回退process.cwd，probe又刻意不做工作区限制，不能把“会话范围”宣传当统一强隔离保证。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

当前建议观察，先确认本地访问边界和当前会话cwd。若要试验，只用可丢弃目录与文件副本，先核对缺失会话和路径越界行为，再考虑写操作。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的设计解释，效果未独立验证；未来设计假设尚未实现或验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/client/openBridge.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查Host路径解析、围栏、分块上传与openBridge；不做渗透测试，不推断已被利用。
- 下一步：在隔离目录覆盖无sessionId、失效会话、外链符号链接、冲突名、上传中断和禁用恢复；检查拒绝、目标文件及残留，不执行真实用户文件操作。

**分析版本**

- **仓库**：[AKS1st/dock-files](https://github.com/AKS1st/dock-files)
- **版本号**：0.4.0（[固定提交 d24224b](https://github.com/AKS1st/dock-files/tree/d24224beb8cf024a9c6e79fe97445001d73150b8)）
- **版本日期**：2026-10-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是将写操作统一要求有效sessionId，并复用宿主认证通道，减少错目录及裸本地请求；用缺失、失效会话和符号链接任务比较拒绝正确性与操作负担，若破坏合法恢复且收益不足则否定。[Q05](#research-q05)

在隔离目录覆盖无sessionId、失效会话、外链符号链接、冲突名、上传中断和禁用恢复；检查拒绝、目标文件及残留，不执行真实用户文件操作。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 3600 | 3300 | 314 | — |
| .md | source | 2 | 135 | — | — | 2500 |
| .ts | source | 10 | 3231 | 2499 | 498 | — |
| .tsx | source | 2 | 1476 | 1281 | 121 | — |
| .ts | test | 1 | 143 | 132 | 15 | — |
| .mjs | source | 1 | 48 | 38 | 8 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/AKS1st/dock-files/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：AKS1st/dock-files 固定组件如何完成目标任务，贡献在何种边界成立，是否适合可控试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 当前会话文件联动的独立增量在哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户在DSH会话产生文件后，需要核对和交付，系统文件管理器需另找目录，原生文件树可能已经满足部分需求。插件将会话cwd与Dock查看器接起来并增加传输、整理操作，合格结果是打开和操作正确文件。源码明确基础辅助代码来自dsh-better-sidebar，因此价值在独立集成与桥接，而非原创文件系统隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1-15](https://github.com/AKS1st/dock-files/blob/d24224beb8cf024a9c6e79fe97445001d73150b8/src/index.ts#L1-L15)

功能、来源归属和会话范围主张。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Host half of dock-files: the /wb-files JSON API — single-level directory
 * listing, a stat probe (existence + directory flag, used by the client's
 * chat open-path bridge), plus the file-manager mutations (new file/folder,
 * rename, copy, move, delete), browser-trust fenced like the /api gateway.
 * Stripped and simplified from dsh-better-sidebar (MIT): fs-tree / wire /
 * trust-fence helpers are copied here because the plugin must not depend on
 * another plugin's internals.
 *
 * All operations are conversation-scoped: requests carry a sessionId and
 * the session's authoritative cwd comes from the session store (falling
 * back to the process cwd while a session is hydrating). Every target path
 * is canonicalized with realpath and must stay inside the session
 * workspace; writes never overwrite — colliding names get a numeric suffix.
 */
```

</details>

**依据 2 · 源码核查**：[src/client/openBridge.ts:80-97](https://github.com/AKS1st/dock-files/blob/d24224beb8cf024a9c6e79fe97445001d73150b8/src/client/openBridge.ts#L80-L97)

会话资源地址转换。

<details>
<summary>查看原文（18行）</summary>

```text
/** Build a Harness file resource address using b67's per-segment encoding. */
export function sessionResourceAddress(sessionId: string, cwd: string | undefined, path: string): string {
  const normalized = path.replace(/\\/g, '/')
  if (!isAbsoluteWorkspacePath(normalized)) {
    const relative = normalized.replace(/^(?:\.\/)+/, '').replace(/^\/+/, '')
    return `dsh-resource://file/session/${encodeSegment(sessionId)}/${encodePath(relative)}`
  }
  const root = cwd?.replace(/\\/g, '/').replace(/\/+$/, '') ?? ''
  if (root !== '' && normalized === root) {
    return `dsh-resource://file/session/${encodeSegment(sessionId)}/`
  }
  if (root !== '' && normalized.startsWith(`${root}/`)) {
    return `dsh-resource://file/session/${encodeSegment(sessionId)}/${encodePath(normalized.slice(root.length + 1))}`
  }
  const unc = normalized.startsWith('//')
  const absolute = normalized.replace(/^\/+/, '')
  return `dsh-resource://file/absolute/${unc ? '/' : ''}${encodePath(absolute)}`
}
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 路径、桥接和上传怎样到达文件系统？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Host以webServer、sessions和webRuntime为依赖；多数目标经过realpath并与cwd比较，防止简单路径和符号链接越界。Client包装sidebarRight.openResource，探测文件存在后在可用查看器打开，其他路径保留原逻辑。上传每块要求offset等于received，失败truncate到已确认长度，便于核对后重传。这些代码支持机制，不证明真实多客户端竞态安全。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:183-207](https://github.com/AKS1st/dock-files/blob/d24224beb8cf024a9c6e79fe97445001d73150b8/src/index.ts#L183-L207)

canonical路径范围检查。

<details>
<summary>查看原文（25行）</summary>

```text
/**
 * Confine a caller-supplied absolute path to the session workspace: the
 * canonical (symlink-resolved) path must equal the canonical session cwd or
 * live under it (separator boundary). Any escape — `..`, a symlink pointing
 * out of the workspace, or an unrelated absolute path — is rejected 403.
 * Returns the canonical target path, so callers operate on the real path.
 */
async function resolveWorkspacePath(cwd: string, raw: string): Promise<string> {
  const root = await realpath(cwd).catch(() => resolve(cwd))
  requireAbsolute(raw)
  let target: string
  try {
    target = await realpath(raw)
  } catch {
    // A not-yet-existing target (e.g. a future write): canonicalize the
    // parent directory and re-append the basename, then check containment.
    const parent = await realpath(dirname(raw)).catch(() => dirname(raw))
    target = join(parent, basename(raw))
  }
  const rel = relative(root, target)
  if (rel === '' || (rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel))) {
    return target
  }
  throw new WbError('forbidden', `path is outside the session workspace: "${raw}"`, 403)
}
```

</details>

**依据 2 · 源码核查**：[src/index.ts:645-670](https://github.com/AKS1st/dock-files/blob/d24224beb8cf024a9c6e79fe97445001d73150b8/src/index.ts#L645-L670)

分块偏移和失败回退。

<details>
<summary>查看原文（26行）</summary>

```text
async function receiveUploadChunk(req: IncomingMessage, upload: UploadSession, offset: number): Promise<number> {
  if (offset !== upload.received) throw new WbError('bad-request', 'chunk offset does not match received bytes', 409)
  if (offset > upload.size) throw new WbError('bad-request', 'chunk offset exceeds upload size', 400)
  const file = await open(upload.tempPath, 'r+')
  let received = 0
  upload.activeChunk += 1
  try {
    for await (const chunk of req) {
      upload.lastActivity = Date.now()
      const buffer = Buffer.from(chunk)
      received += buffer.length
      if (received > MAX_UPLOAD_CHUNK_BYTES || offset + received > upload.size) {
        throw new WbError('bad-request', 'upload chunk is too large', 400)
      }
      if (buffer.length > 0) await file.write(buffer, 0, buffer.length, offset + received - buffer.length)
    }
    await file.sync()
    upload.received += received
    upload.lastActivity = Date.now()
    return upload.received
  } catch (error) {
    await truncate(upload.tempPath, upload.received).catch(() => undefined)
    throw error
  } finally {
    upload.activeChunk -= 1
    await file.close().catch(() => undefined)
```

</details>

**依据 3 · 源码核查**：[src/client/openBridge.ts:137-155](https://github.com/AKS1st/dock-files/blob/d24224beb8cf024a9c6e79fe97445001d73150b8/src/client/openBridge.ts#L137-L155)

资源打开桥接。

<details>
<summary>查看原文（19行）</summary>

```text
export function bridgeChatOpens(
  sidebarRight: SidebarRightFace,
  workbench: WorkbenchService,
  files: FilesService,
  mode: OpenSourceMode = 'dock',
  sessions?: SessionsFace,
): () => void {
  if (mode === 'harness' || sessions === undefined) return () => undefined
  const original = sidebarRight.openResource
  let generation = 0
  let active = true
  sidebarRight.openResource = async function openResource(address: string, options?: OpenResourceOptions): Promise<void> {
    const requestGeneration = generation
    const path = resourcePath(address, sessions as SessionsFace)
    if (path !== undefined) {
      try {
        const probe = await probePath(path)
        if (active && requestGeneration === generation && probe.exists && !probe.isDir && files.canOpen(path)) {
          workbench.openPath(path)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 会话范围和浏览器围栏是否等同认证隔离？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不是。isTrustedRequest注释明确不提供认证，缺Origin时仍可通过可信Host条件。sessionCwdOf在会话不存在或缺失时使用process.cwd，和上传下载的requireSessionCwd要求不同。probe明确不做工作区限制，仅返回存在/目录标志。以上是源码可确认的边界差异，并未复现攻击；部署不能把这些路由当成受宿主cookie完整保护的api。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:712-727](https://github.com/AKS1st/dock-files/blob/d24224beb8cf024a9c6e79fe97445001d73150b8/src/index.ts#L712-L727)

围栏限制与无Origin条件。

<details>
<summary>查看原文（16行）</summary>

```text
/** DNS-rebinding / cross-site defense (not authentication). */
function isTrustedRequest(request: IncomingMessage, trustedHosts: readonly string[]): boolean {
  const host = header(request.headers, 'host')
  if (host === undefined) return false
  const hostUrl = parseAuthority(host)
  if (hostUrl === undefined) return false
  if (!isLoopbackHostname(hostUrl.hostname) && !isTrustedAuthority(hostUrl, trustedHosts)) return false
  if (header(request.headers, 'sec-fetch-site') === 'cross-site') return false
  const origin = header(request.headers, 'origin')
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
}
```

</details>

**依据 2 · 源码核查**：[src/index.ts:748-765](https://github.com/AKS1st/dock-files/blob/d24224beb8cf024a9c6e79fe97445001d73150b8/src/index.ts#L748-L765)

宽松cwd回退与严格会话要求并存。

<details>
<summary>查看原文（18行）</summary>

```text
/** Resolve a session's authoritative working directory. */
function sessionCwdOf(ctx: WbContext, sessionId: string | undefined): string {
  if (sessionId !== undefined) {
    const cwd = ctx.sessions.get(sessionId)?.header.cwd
    if (cwd !== undefined && cwd !== '') return cwd
  }
  return process.cwd()
}

/** Require a live session with an authoritative, non-empty workspace. */
function requireSessionCwd(ctx: WbContext, sessionId: string | undefined): string {
  if (sessionId === undefined) throw new WbError('bad-request', 'missing "sessionId"', 400)
  const session = ctx.sessions.get(sessionId)
  if (session === undefined) throw new WbError('not-found', 'session not found', 404)
  if (typeof session.header.cwd !== 'string' || session.header.cwd === '') {
    throw new WbError('bad-request', 'session cwd is empty', 400)
  }
  return session.header.cwd
```

</details>

**依据 3 · 源码核查**：[src/index.ts:907-918](https://github.com/AKS1st/dock-files/blob/d24224beb8cf024a9c6e79fe97445001d73150b8/src/index.ts#L907-L918)

probe例外。

<details>
<summary>查看原文（12行）</summary>

```text
        if (method === 'probe') {
          // Routing probe for the client chat open-path bridge: stat an
          // absolute path and report existence + directory flag without
          // listing anything. No workspace confinement — the decision is a
          // routing heuristic (workbench viewer vs native opener), and the
          // existence of a path the page already displays is not sensitive.
          const raw = stringOf(payload, 'path')
          requireAbsolute(raw)
          const info = await stat(raw).catch(() => undefined)
          writeOk(res, info === undefined
            ? { exists: false, isDir: false }
            : { exists: true, isDir: info.isDirectory() })
```

</details>

#### 缺口

- 具体宿主是否另加全局认证及风险利用条件未知
  **影响**：决定本地/远程部署是否可接受
  **进一步探讨**：核对路由挂载的真实认证路径，在隔离profile发送缺cookie和失效会话请求。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 为什么先观察再考虑文件写入？

**研究主题**：效果与总成本、采用判断

#### 完整回答

文件管理有明确便利，但误目录、删除和覆盖处理的失败代价超过单纯UI美化。当前应先核对身份边界及session cwd，用副本验证传输和冲突；已有文件树足够时无需承担额外桥接。资源包括临时上传、目录zip和本地I/O，人工成本包括核对路径与失败后的源目标状态，尚无量化数据。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:921-947](https://github.com/AKS1st/dock-files/blob/d24224beb8cf024a9c6e79fe97445001d73150b8/src/index.ts#L921-L947)

新建、重命名、移动与删除都到达真实文件管理。

<details>
<summary>查看原文（27行）</summary>

```text
        if (method === 'create') {
          const parent = stringOf(payload, 'parent')
          const kind = stringOf(payload, 'kind')
          if (kind !== 'file' && kind !== 'dir') {
            throw new WbError('bad-request', 'kind must be "file" or "dir"', 400)
          }
          writeOk(res, await createEntry(cwd, parent, kind, stringOrUndefined(payload, 'locale')))
          return
        }
        if (method === 'rename') {
          const path = stringOf(payload, 'path')
          const name = stringOf(payload, 'name')
          writeOk(res, await renameEntry(cwd, path, name))
          return
        }
        if (method === 'copy' || method === 'move') {
          const sources = stringArrayOf(payload, 'sources')
          const dest = stringOf(payload, 'dest')
          const value = method === 'copy'
            ? await copyEntries(cwd, sources, dest)
            : await moveEntries(cwd, sources, dest)
          writeOk(res, value)
          return
        }
        if (method === 'remove') {
          const paths = stringArrayOf(payload, 'paths')
          writeOk(res, await removeEntries(cwd, paths))
```

</details>

**依据 2 · 源码核查**：[src/index.ts:645-670](https://github.com/AKS1st/dock-files/blob/d24224beb8cf024a9c6e79fe97445001d73150b8/src/index.ts#L645-L670)

中断上传恢复需要状态核对。

<details>
<summary>查看原文（26行）</summary>

```text
async function receiveUploadChunk(req: IncomingMessage, upload: UploadSession, offset: number): Promise<number> {
  if (offset !== upload.received) throw new WbError('bad-request', 'chunk offset does not match received bytes', 409)
  if (offset > upload.size) throw new WbError('bad-request', 'chunk offset exceeds upload size', 400)
  const file = await open(upload.tempPath, 'r+')
  let received = 0
  upload.activeChunk += 1
  try {
    for await (const chunk of req) {
      upload.lastActivity = Date.now()
      const buffer = Buffer.from(chunk)
      received += buffer.length
      if (received > MAX_UPLOAD_CHUNK_BYTES || offset + received > upload.size) {
        throw new WbError('bad-request', 'upload chunk is too large', 400)
      }
      if (buffer.length > 0) await file.write(buffer, 0, buffer.length, offset + received - buffer.length)
    }
    await file.sync()
    upload.received += received
    upload.lastActivity = Date.now()
    return upload.received
  } catch (error) {
    await truncate(upload.tempPath, upload.received).catch(() => undefined)
    throw error
  } finally {
    upload.activeChunk -= 1
    await file.close().catch(() => undefined)
```

</details>

#### 缺口

- 写入恢复、真实权限和大目录成本未测
  **影响**：阻止当前直接扩大采用范围
  **进一步探讨**：以可丢弃目录验收认证、范围、备份和退出残留。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 统一会话和认证要求会否降低错目录风险？

**研究主题**：新假设与验证

#### 完整回答

未验证假设要求所有写请求拥有有效sessionId，并通过宿主认证通道，只读probe也显式标明范围。当前两种cwd解析和独立围栏是推导起点。实验覆盖会话加载中、失效、缺字段及外链路径，比较错误写入和合法任务拒绝；如果严格路径妨碍恢复，可单独设计只读降级而不放宽写权限。收益与负担未验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:748-765](https://github.com/AKS1st/dock-files/blob/d24224beb8cf024a9c6e79fe97445001d73150b8/src/index.ts#L748-L765)

不一致会话要求是可检验设计参照。

<details>
<summary>查看原文（18行）</summary>

```text
/** Resolve a session's authoritative working directory. */
function sessionCwdOf(ctx: WbContext, sessionId: string | undefined): string {
  if (sessionId !== undefined) {
    const cwd = ctx.sessions.get(sessionId)?.header.cwd
    if (cwd !== undefined && cwd !== '') return cwd
  }
  return process.cwd()
}

/** Require a live session with an authoritative, non-empty workspace. */
function requireSessionCwd(ctx: WbContext, sessionId: string | undefined): string {
  if (sessionId === undefined) throw new WbError('bad-request', 'missing "sessionId"', 400)
  const session = ctx.sessions.get(sessionId)
  if (session === undefined) throw new WbError('not-found', 'session not found', 404)
  if (typeof session.header.cwd !== 'string' || session.header.cwd === '') {
    throw new WbError('bad-request', 'session cwd is empty', 400)
  }
  return session.header.cwd
```

</details>

**依据 2 · 源码核查**：[src/index.ts:712-727](https://github.com/AKS1st/dock-files/blob/d24224beb8cf024a9c6e79fe97445001d73150b8/src/index.ts#L712-L727)

独立信任围栏为认证改进基础。

<details>
<summary>查看原文（16行）</summary>

```text
/** DNS-rebinding / cross-site defense (not authentication). */
function isTrustedRequest(request: IncomingMessage, trustedHosts: readonly string[]): boolean {
  const host = header(request.headers, 'host')
  if (host === undefined) return false
  const hostUrl = parseAuthority(host)
  if (hostUrl === undefined) return false
  if (!isLoopbackHostname(hostUrl.hostname) && !isTrustedAuthority(hostUrl, trustedHosts)) return false
  if (header(request.headers, 'sec-fetch-site') === 'cross-site') return false
  const origin = header(request.headers, 'origin')
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
}
```

</details>

#### 缺口

- 统一模型尚未实现验证
  **影响**：不是现有安全保证
  **进一步探讨**：先以隔离路由原型比较拒绝正确率。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
