# dsh-worktable

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[56ffe0c](https://github.com/Aisland-SJL/dsh-worktable/tree/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content)

<!-- BEGIN META -->
[![GitHub ★ 801](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=801&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aisland-SJL/dsh-worktable)
<!-- END META -->

> **功能**：在 DSH 侧栏提供项目容器、分栏工作区和会话绑定的工作台插件

> **亮点**：显式项目、窗格、绑定、会话与目录身份减少旧结果串挂；owner 准入和 opaque-origin 目录预览将高权限私有 API 与不可信页面分开。贡献是生命周期与权限边界，不是项目文件隔离。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

> **主要限制**：绑定当前不保证内容版本，owner 文件写入仍可覆盖共享真实路径；撤销持久失败被吞掉，身份撤销也不会即时断开既有终端。新增鉴权不能掩盖这三类状态边界。[Q02](#research-q02) [Q04](#research-q04)

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
  - [Q01 · 项目容器如何减少旧结果串挂？](#detail-section-11)
  - [Q02 · 私有文件接口与终端是否依赖可确认身份？](#detail-section-12)
  - [Q03 · 不可信 HTML 的读取与撤销边界是什么？](#detail-section-13)
  - [Q04 · 绑定当前是否意味着文件内容与撤销持久安全？](#detail-section-14)
  - [Q05 · 使用路径、平台和总成本如何界定？](#detail-section-15)
  - [Q06 · 谁可以试用，哪项改进值得验证？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：同时管理多个 agent 项目与会话的个人开发者，将文件、网页、终端和结果集中到项目工作区。

宿主会话与独立文件/浏览器/终端窗口，或按目录猜产物归属；未执行同任务效率对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 项目与分栏工作区 | 集中多会话相关窗口 | localStorage按浏览器来源，不自动双端同步 |
| 结果身份挂载 | 将当前任务文件放到正确窗格 | 不保证真实文件内容隔离 |
| 目录预览 | opaque origin页面加载相对资源 | 整目录只读且仍可联网 |
| 终端 | 在工作目录运行本机shell | owner准入，全环境继承，既有连接不即时撤权 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22、DSH 0.2.0-rc.2 或0.2.1-rc.3 | 启动必需 | Host/client 接线 | 旧0.1不在支持范围；macOS 实验性 |
| 宿主 connection/admit 与 owner 身份 | 私有操作必需 | 文件、写入、终端准入 | 缺服务503，非owner403 |
| ws/node-pty | 终端必需 | 完整本机 shell | 缺失降级，不影响其他窗格 |
| 可信且不含秘密的预览目录 | 本地网页必需 | 授予整目录只读资源 | 不可信页面仍可联网外发 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户核 host/profile/命令所有者 | Desktop 退出后用自带 CLI |
| 2 | 用户建立两个低风险项目和不同会话 | 目录相同也不互接旧结果 |
| 3 | Agent 按当前 binding 输出任务结果 | 五项身份一致才挂载；失败保留待办 |
| 4 | 用户检查真实内容与预览目录，再启终端 | 错挂/撤销失败停止自动挂载；终端关闭确认 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主、浏览器和存储资源未知 | 建项目、布局、目录和会话，时长未知 | Web/Desktop 来源不自动同步 |
| 持续使用 | PTY、网页与媒体资源；模型任务另计 | 核绑定与实际文件归属 | 状态镜像无模型调用不代表任务无费用 |
| 失败恢复 | 重试与备份资源未知 | 查晚到结果、撤销存储、失效预览 | 共享真实路径可能覆盖 |
| 退出 | 存储与迁移资源未知 | 关闭连接、停用插件，保留项目和文件 | 切项目保活不等于撤销预览 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 结果归属 | project/pane/binding/session/folder 核对 | 内容被晚到写者修改后的正确性 |
| 权限与网页边界 | owner 准入、无same-origin sandbox、短期目录 token | 即时WS撤销、恶意本机竞态和总并发内存 |
| 多窗组织 | 侧栏与overlay、状态镜像 | 复杂业务合格率与净节时 |

> **思考**：绑定当前不保证内容版本，owner 文件写入仍可覆盖共享真实路径；撤销持久失败被吞掉，身份撤销也不会即时断开既有终端。新增鉴权不能掩盖这三类状态边界。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：显式项目、窗格、绑定、会话与目录身份减少旧结果串挂；owner 准入和 opaque-origin 目录预览将高权限私有 API 与不可信页面分开。贡献是生命周期与权限边界，不是项目文件隔离。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

身份准入默认拒绝、随机目录能力、单句柄限量读取和绑定创建回滚有明确复用价值；但撤销持久化吞错、全环境PTY和共享文件写入仍需承担。已检查发布 lib/index.js 含同一 owner admit、sandbox 与 token 路径，未据 TypeScript 单独推断发布行为。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

绑定当前不保证内容版本，owner 文件写入仍可覆盖共享真实路径；撤销持久失败被吞掉，身份撤销也不会即时断开既有终端。新增鉴权不能掩盖这三类状态边界。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

Windows 个人用户在精确支持版本从两个低风险项目试用，先验绑定和文件、再验预览及终端；错挂、旧结果复活或权限撤销不符要求时停止并回到原生会话和独立窗口。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

UI 绑定、owner 认证、目录 capability 和文件读取机制为固定源码支持；Windows 局部验收为作者报告，本轮未运行；内容版本与恢复为未验证假设。

- 已检查：作者 README、包清单、源码路径 01_content/README.md、01_content/package.json、01_content/src/index.ts、01_content/src/requestAuth.ts、01_content/src/previewFiles.ts、01_content/src/client/widgetMount.ts、01_content/src/client/SandboxedFrame.tsx、01_content/lib/index.js 及固定范围 inventory；组件：01_content。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅01_content组件27个tracked文件统计，重点源码为Host鉴权/PTY/写入、预览与绑定；检查发布lib相应入口。未运行目标、测试或模型；作者Windows局部结果不作本轮验证。
- 下一步：相同两项目分别注入共享路径改写、重绑晚到结果、localStorage满、预览撤销和WS身份撤销，记录错挂/旧内容误认、人工分钟与进程残留；任何边界不符即收缩功能。

**分析版本**

- **仓库**：[Aisland-SJL/dsh-worktable](https://github.com/Aisland-SJL/dsh-worktable)
- **版本号**：0.5.0（[固定提交 56ffe0c](https://github.com/Aisland-SJL/dsh-worktable/tree/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是在结果加入内容摘要/生成版本并提供可见撤销恢复状态，用同目录双项目、晚到结果、重绑与存储满矩阵检验错认和人工负担；指标不降就否定，不把它称为文件沙箱。[Q06](#research-q06)

相同两项目分别注入共享路径改写、重绑晚到结果、localStorage满、预览撤销和WS身份撤销，记录错挂/旧内容误认、人工分钟与进程残留；任何边界不符即收缩功能。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 4 | 586 | 463 | 96 | — |
| .mjs | test | 1 | 72 | 45 | 14 | — |
| .js | source | 2 | 24776 | 23353 | 1955 | — |
| .md | source | 1 | 111 | — | — | 3353 |
| .ts | source | 16 | 2636 | 2290 | 217 | — |
| .tsx | source | 3 | 6572 | 5856 | 502 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-28），可前往 [GitHub Issues](https://github.com/Aisland-SJL/dsh-worktable/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：项目多窗、身份绑定与 owner 鉴权/预览隔离能否形成可控个人工作流？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 项目容器如何减少旧结果串挂？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

面向同时维护多个 agent 项目/会话的个人使用者，把文件、终端、网页和产物窗格放在同一项目工作区；合格交付是当前任务结果进入正确窗格且能解释状态，不是控制室灯变绿。相对独立窗口和按目录猜归属，WidgetBindings 显式记录 projectId、paneId、bindingId、sessionId、folder；begin 校验窗格唯一性并在持久失败时回滚。resolve 只接受当前绑定及 version=2、三重 ID 和 window 一致的结果；因此同目录新项目不会自动接旧文件。贡献是 UI 所有权与生命周期协议，不是文件系统隔离。控制室状态来源是宿主快照镜像，不调用模型只描述该状态通道，不能推导全部任务无 token。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/README.md:5-18](https://github.com/Aisland-SJL/dsh-worktable/blob/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content/README.md#L5-L18)

作者定义项目工作区、状态订阅与存储；仅支持用途，不证明业务验收。

<details>
<summary>查看原文（14行）</summary>

```text
## 是什么

- **侧边栏「工作台」区块**：收纳用户自建项目与入驻插件项目，支持改名/图标/排序/显示隐藏、项目 × 对话绑定、项目文件夹。
- **分栏工作区引擎（自研）**：声明式布局预设（左栏/顶行/主行 + 右侧对话窗），窗格可拖拽分割、标签页模型；内置 资源管理器 / 终端 / 浏览器 / 动画 / 自定义窗口。
- **控制室**：默认自带项目（固定首位、不可删除），项目卡片网格镜像可见绑定项目的宿主状态（工作中/待你决定/已完成）；状态订阅不调用模型，计时与预览另有刷新机制。
- **项目独立挂载**：窗口任务使用项目 ID、窗格 ID 与绑定 ID 对应的专属结果文件；同一文件夹里的新项目仍从空白窗口开始，不自动读取其他项目的旧结果。
- **平台**：Windows 是本轮验证平台，范围见下方兼容说明；macOS 为实验性支持（核心文件路径代码已做跨平台适配，尚未真机端到端验证）。

## 技术底座

- Cordis 插件协议（客户端 bundle + 服务端路由 /api/worktable/*、终端 WebSocket）。
- 界面经 slot 座位协议注入侧边栏与 shell.overlay；对话窗复用宿主会话服务（新版 uiWorkspace.openSession，旧版 sessions.open）。
- 状态监控为宿主会话运行时快照的事件订阅镜像；视图/项目/绑定状态存 localStorage。
- 客户端：TypeScript + React（host externals）+ 原生 CSS；服务端：Node。
```

</details>

**依据 2 · 源码核查**：[01_content/src/client/widgetMount.ts:73-91](https://github.com/Aisland-SJL/dsh-worktable/blob/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content/src/client/widgetMount.ts#L73-L91)

创建绑定、校验窗格和持久化失败回滚。

<details>
<summary>查看原文（19行）</summary>

```text
  begin(projectId: string, spec: WidgetSpec, folder: string, sessionId: string, window: string): WidgetBinding[] {
    if (!this.storage) throw new Error('project storage unavailable')
    if (!folder || !sessionId || spec.id !== projectId) throw new Error('project folder or session unavailable')
    const targets = widgetTargets(spec)
    const selected = targets.find((t) => t.window === window)
    if (!selected || new Set(targets.map((t) => t.pane.id)).size !== targets.length) throw new Error('project window changed')
    const before = this.records[projectId]
    const next: Record<string, WidgetBinding> = Object.create(null)
    for (const t of targets) {
      const old = before?.[t.pane.id]
      // Unassigned windows can participate in one multi-window result. A manually revoked
      // window stays revoked until explicitly selected for another custom task.
      next[t.pane.id] = t === selected || !old || old.folder !== folder || (old.enabled && old.window !== t.window)
        ? { projectId, paneId: t.pane.id, window: t.window, folder, sessionId, bindingId: this.makeId(), enabled: true }
        : old
    }
    this.records[projectId] = next
    try { this.persist() } catch (error) { if (before) this.records[projectId] = before; else delete this.records[projectId]; throw error }
    return this.entries(projectId).filter((b) => b.sessionId === sessionId)
```

</details>

**依据 3 · 源码核查**：[01_content/src/client/widgetMount.ts:103-119](https://github.com/Aisland-SJL/dsh-worktable/blob/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content/src/client/widgetMount.ts#L103-L119)

当前绑定检查及结果对象身份准入。

<details>
<summary>查看原文（17行）</summary>

```text
  isCurrent(binding: WidgetBinding, spec: WidgetSpec | null | undefined, folder: string | undefined): boolean {
    const current = this.records[binding.projectId]?.[binding.paneId]
    return !!current?.enabled && current.bindingId === binding.bindingId && current.sessionId === binding.sessionId &&
      current.folder === folder && binding.folder === folder && spec?.id === binding.projectId &&
      widgetTargets(spec).filter((t) => t.pane.id === binding.paneId).length === 1
  }
  resolve(binding: WidgetBinding, raw: string, spec: WidgetSpec | null | undefined, folder: string | undefined):
    { target: WidgetTarget; item: { kind: 'html' | 'url' | 'file'; path: string } } | null {
    if (!this.isCurrent(binding, spec, folder)) return null
    try {
      const d = JSON.parse(raw)
      if (!d || Array.isArray(d) || d.version !== 2 || d.projectId !== binding.projectId ||
          d.paneId !== binding.paneId || d.bindingId !== binding.bindingId || d.window !== binding.window ||
          !['html', 'url', 'file'].includes(d.kind) || typeof d.path !== 'string' || !d.path.trim()) return null
      const target = widgetTargets(spec).find((t) => t.pane.id === binding.paneId)!
      return { target, item: { kind: d.kind, path: d.path.trim() } }
    } catch { return null }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 私有文件接口与终端是否依赖可确认身份？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

是，当前 Host wrapper 在每次私有 HTTP 请求读取 connection 并 await admit，只允许 owner；旧单 operator 无 principal 时要求 peer 严格等于 connection.operator。服务缺失、异常或身份不明返回503，非 owner 返回403，不开放兜底。WS 升级同样先调用 requestRejection，终端 spawn 在准入后，且卸载 terminate 所有连接并 kill shell；这是真实接线，不只是 helper 存在。边界是准入在建连时完成，既有 WS 消息没有逐次身份重验；README 也承认身份撤销后不立即断开。终端继承 process.env，owner 获得的是完整本机 shell，不是限制命令的沙箱。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/src/requestAuth.ts:1-18](https://github.com/Aisland-SJL/dsh-worktable/blob/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content/src/requestAuth.ts#L1-L18)

完整 fail-closed 身份判定。

<details>
<summary>查看原文（18行）</summary>

```text
/** Use the host's current authentication service for every request, never a cached grant. */
export async function requestRejection(ctx: any, req: any): Promise<number | undefined> {
  try {
    const connection = typeof ctx.get === 'function' ? ctx.get('connection') : undefined
    if (!connection) return 503
    if (typeof connection.admit === 'function') {
      const admission = await connection.admit(req)
      if (!admission || typeof admission !== 'object') return 503
      if ('rejection' in admission) return admission.rejection === 401 ? 401 : 403
      const peer = admission.peer
      // 0.2.1 has owner/non-owner principals. 0.2.0 has a single operator Peer.
      if (peer?.principal?.kind === 'owner') return undefined
      if (peer && peer === connection.operator && peer.principal === undefined) return undefined
      return 403
    }
  } catch {}
  // An unavailable or failed security service must not turn into public filesystem access.
  return 503
```

</details>

**依据 2 · 源码核查**：[01_content/src/index.ts:233-270](https://github.com/Aisland-SJL/dsh-worktable/blob/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content/src/index.ts#L233-L270)

WS 建连准入、spawn env 与消息写入。

<details>
<summary>查看原文（38行）</summary>

```text
  ctx.effect(() => webServer.registerUpgrade({
    path: '/api/worktable/term',
    handler: async (req: any, socket: any, head: any) => {
      let rejected = await requestRejection(ctx, req)
      if (disposed) rejected = 503
      if (rejected !== undefined) {
        socket.end(`HTTP/1.1 ${rejected} ${rejectionText(rejected)}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`)
        return
      }
      wss.handleUpgrade(req, socket, head, (ws: any) => {
        const u = new URL(req.url ?? '/', 'http://dsh.internal')
        const cwd = serverCwd(ctx, u.searchParams.get('sessionId') || undefined, u.searchParams.get('cwd') || undefined)
        const cols = clampDim(Number(u.searchParams.get('cols')), 80)
        const rows = clampDim(Number(u.searchParams.get('rows')), 24)
        let term: any = null
        try {
          const shell = spawnShell()
          term = pty.spawn(shell.cmd, shell.args, { name: 'xterm-256color', cols, rows, cwd, env: process.env })
          terminals.add(term)
        } catch (err) {
          try { ws.send('\r\n[worktable] 终端启动失败：' + String(err)) } catch {}
          try { ws.close() } catch {}
          return
        }
        term.onData((d: string) => { try { ws.send(d) } catch {} })
        term.onExit(() => { terminals.delete(term); try { ws.close() } catch {} })
        ws.on('message', (raw: any) => {
          const text = String(raw)
          try {
            const msg = JSON.parse(text)
            if (msg && msg.type === 'resize' && Number.isFinite(msg.cols) && Number.isFinite(msg.rows)) {
              term.resize(clampDim(msg.cols, cols), clampDim(msg.rows, rows))
              return
            }
          } catch {}
          try { term.write(text) } catch {}
        })
        ws.on('close', () => { terminals.delete(term); try { term.kill() } catch {} })
```

</details>

**依据 3 · 源码核查**：[01_content/src/index.ts:283-295](https://github.com/Aisland-SJL/dsh-worktable/blob/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content/src/index.ts#L283-L295)

HTTP wrapper 在 route.handler 前拒绝。

<details>
<summary>查看原文（13行）</summary>

```text
  const previews = createPreviewFiles()
  ctx.effect(() => () => previews.clear(), 'dsh-worktable: preview capabilities')
  // Direct WebServer routes do NOT inherit the host's /api authentication route.
  const register = (route: any, publicAsset = false) => ctx.effect(() => webServer.register({
    ...route,
    handler: async (req: any, res: any) => {
      if (!publicAsset && route.path !== HEALTH_PATH) {
        const rejected = await requestRejection(ctx, req)
        if (rejected !== undefined) { json(res, rejected, { error: rejectionText(rejected) }); return }
      }
      return route.handler(req, res)
    },
  }), 'dsh-worktable: ' + route.path)
```

</details>

**依据 4 · 源码核查**：[01_content/src/index.ts:220-225](https://github.com/Aisland-SJL/dsh-worktable/blob/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content/src/index.ts#L220-L225)

插件卸载清理连接和终端。

```text
  ctx.effect(() => () => {
    disposed = true
    for (const ws of wss.clients ?? []) { try { ws.terminate() } catch {} }
    for (const term of terminals) { try { term.kill() } catch {} }
    terminals.clear()
    try { wss.close() } catch {}
```

#### 缺口

- 已建立 WS 的身份撤销不能立即切断。
  **影响**：身份被收回与 shell 能力终止之间存在窗口，不适合把其视为动态多用户隔离终端。
  **进一步探讨**：在隔离 host 撤销 owner 后保持终端连接，确认操作窗口，并验证关闭插件/连接后 shell 终止；需要即时策略时先不启终端。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 不可信 HTML 的读取与撤销边界是什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

SandboxedFrame 不授 allow-same-origin，只允许 scripts/forms/downloads，使项目页无法直接共享主文档 origin 和存储。页面需要本地资源时由登录用户 POST mount 根目录，返回随机24字节 base64url capability；静态地址公开读取靠 token 授权，资源级 CORS=* 是为 opaque origin 提供目录静态资源，不代表私有 Host API 无需身份。previewFiles 拒绝路径分隔与目录穿越，并对 realpath、单句柄 dev/inode/size/mtime/ctime 在读取前后重验；单文件40MiB，128挂载，空闲30分钟过期。客户端换 URL、刷新与卸载撤销 token，Host 卸载清空；因此相对同源 iframe 有明确隔离增量。但 capability 授予整个所选目录及子目录，页面仍可联网；不能挂载包含秘密的目录，也不能把句柄复核称为抵御恶意本机写者 ABA 竞态的 OS 沙箱。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/src/client/SandboxedFrame.tsx:4-19](https://github.com/Aisland-SJL/dsh-worktable/blob/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content/src/client/SandboxedFrame.tsx#L4-L19)

sandbox 权限和输入 URL 验证。

<details>
<summary>查看原文（16行）</summary>

```text
const SANDBOX = 'allow-scripts allow-forms allow-downloads'
const SITE = '/api/worktable/site/'

/** Accept navigations, not executable URL schemes. Keep saved URLs free of capabilities. */
export function previewTarget(input: string, base: string) {
  const url = new URL(input, base)
  const own = new URL(base)
  const sameHost = url.protocol === own.protocol && url.host === own.host
  if (!['http:', 'https:'].includes(url.protocol) && !(sameHost && url.protocol === 'dsh-app:')) throw new Error('Unsupported preview URL')
  if (!sameHost || !url.pathname.startsWith(SITE)) return { url: url.href }
  const segments = url.pathname.slice(SITE.length).split('/')
  const root = decodeURIComponent(segments.shift() ?? '')
  if (!root) throw new Error('Missing preview directory')
  const relative = segments.map(decodeURIComponent)
  if (relative.some(s => s === '..' || /[\\/\0]/.test(s))) throw new Error('Invalid preview path')
  return { root, relative: relative.map(encodeURIComponent).join('/'), suffix: url.search + url.hash }
```

</details>

**依据 2 · 源码核查**：[01_content/src/client/SandboxedFrame.tsx:26-56](https://github.com/Aisland-SJL/dsh-worktable/blob/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content/src/client/SandboxedFrame.tsx#L26-L56)

申请随机目录地址、失败和卸载撤销，iframe 真正使用 sandbox。

<details>
<summary>查看原文（31行）</summary>

```text
  useEffect(() => {
    let alive = true
    let token: string | undefined
    const revoke = (value: string) => { void fetch('/api/worktable/preview', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ revoke: value }), keepalive: true,
    }).catch(() => {}) }
    setSrc('about:blank')
    setError('')
    void (async () => {
      if (!props.url || props.url === 'about:blank') return
      const target = previewTarget(props.url, location.href)
      if ('url' in target) { if (alive) setSrc(target.url!); return }
      const response = await fetch('/api/worktable/preview', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ root: target.root }),
      })
      if (!response.ok) throw new Error('Preview HTTP ' + response.status)
      const grant = await response.json()
      if (typeof grant.token !== 'string' || !/^[\w-]{32}$/.test(grant.token) || grant.base !== '/api/worktable/preview-static/' + grant.token + '/') throw new Error('Invalid preview grant')
      token = grant.token
      if (!alive) { revoke(token!); token = undefined; return }
      setSrc(hostPreviewUrl(grant.base + target.relative + target.suffix))
    })().catch(err => {
      if (token) { revoke(token); token = undefined }
      if (alive) setError(String(err))
    })
    return () => { alive = false; if (token) revoke(token) }
  }, [props.url, props.reloadKey])
  if (error) return <div className="dsh-wt_paneWip"><span className="dsh-wt_paneWipText">{error}</span></div>
  return <iframe key={props.reloadKey} className="dsh-wt_paneFrame" src={src}
    data-source-url={props.url} title={props.title ?? ''} sandbox={SANDBOX} referrerPolicy="no-referrer" />
```

</details>

**依据 3 · 源码核查**：[01_content/src/previewFiles.ts:5-45](https://github.com/Aisland-SJL/dsh-worktable/blob/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content/src/previewFiles.ts#L5-L45)

CSP、限额、token 和路径 containment。

<details>
<summary>查看原文（41行）</summary>

```text
export const PREVIEW_PREFIX = '/api/worktable/preview-static'
export const PREVIEW_SANDBOX = 'allow-scripts allow-forms allow-downloads'
export const PREVIEW_CSP = `sandbox ${PREVIEW_SANDBOX}; base-uri 'none'; object-src 'none'; frame-src 'none'`
export const PREVIEW_MAX_BYTES = 40 * 1024 * 1024
const IDLE_MS = 30 * 60 * 1000
const MAX_MOUNTS = 128

function inside(root: string, file: string): boolean {
  const rel = relative(root, file)
  return rel === '' || (!isAbsolute(rel) && rel !== '..' && !rel.startsWith('..' + sep))
}

/** Short-lived read-only capabilities. They grant one directory, never host APIs. */
export function createPreviewFiles(now = () => Date.now()) {
  const mounts = new Map<string, { root: string; touched: number }>()
  const prune = () => { for (const [key, item] of mounts) if (now() - item.touched >= IDLE_MS) mounts.delete(key) }
  return {
    async mount(root: string) {
      if (!isAbsolute(root)) throw new Error('Preview root must be absolute')
      const canonical = await realpath(root)
      if (!(await stat(canonical)).isDirectory()) throw new Error('Preview root is not a directory')
      prune()
      if (mounts.size >= MAX_MOUNTS) throw new Error('Too many open previews; close an unused preview first')
      const token = randomBytes(24).toString('base64url')
      mounts.set(token, { root: canonical, touched: now() })
      return token
    },
    revoke(token: string) { mounts.delete(token) },
    clear() { mounts.clear() },
    async file(token: string, segments: string[], headOnly = false) {
      prune()
      const mount = mounts.get(token)
      if (!mount) return null
      // Decode exactly once before this call; forbid separators embedded in a segment.
      if (segments.some(s => s === '..' || s.includes('/') || s.includes('\\') || s.includes('\0'))) return null
      let target = resolve(mount.root, ...segments)
      if (!inside(mount.root, target)) return null
      let info = await stat(target).catch(() => null)
      if (info?.isDirectory()) target = resolve(target, 'index.html')
      const canonical = await realpath(target).catch(() => null)
      if (!canonical || !inside(mount.root, canonical)) return null
```

</details>

**依据 4 · 源码核查**：[01_content/src/previewFiles.ts:46-89](https://github.com/Aisland-SJL/dsh-worktable/blob/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content/src/previewFiles.ts#L46-L89)

单句柄身份复核与读取上限。

<details>
<summary>查看原文（44行）</summary>

```text
      // Keep the read bound to one handle. Recheck path/identity around the read
      // to reject ordinary replacement races; this is not an OS filesystem jail
      // against an adversarial local process coordinating ABA path swaps.
      const handle = await open(canonical, 'r').catch(() => null)
      if (!handle) return null
      try {
        const before = await handle.stat({ bigint: true })
        if (!before.isFile()) return null
        const sameFile = (other: typeof before) => other.isFile()
          && other.dev === before.dev && other.ino === before.ino
          && other.size === before.size && other.mtimeNs === before.mtimeNs
          && other.ctimeNs === before.ctimeNs
        const stillValid = async () => {
          const current = await realpath(canonical)
          if (current !== canonical || !inside(mount.root, current)) return false
          const named = await stat(current, { bigint: true })
          const opened = await handle.stat({ bigint: true })
          return sameFile(named) && sameFile(opened)
            && mounts.get(token) === mount && now() - mount.touched < IDLE_MS
        }
        const tooLarge = () => Object.assign(new Error('file too large'), { status: 413 })
        if (before.size > BigInt(PREVIEW_MAX_BYTES)) throw tooLarge()
        if (!(await stillValid())) return null
        const chunks: Buffer[] = []
        let total = 0
        if (!headOnly) {
          // A file may grow after stat. Never allocate/read an unbounded body.
          while (total <= PREVIEW_MAX_BYTES) {
            const chunk = Buffer.alloc(Math.min(64 * 1024, PREVIEW_MAX_BYTES + 1 - total))
            const { bytesRead } = await handle.read(chunk, 0, chunk.length, total)
            if (!bytesRead) break
            total += bytesRead
            if (total > PREVIEW_MAX_BYTES) throw tooLarge()
            chunks.push(chunk.subarray(0, bytesRead))
          }
        }
        if (!(await stillValid()) || (!headOnly && BigInt(total) !== before.size)) return null
        mount.touched = now()
        return { path: canonical, size: Number(before.size), data: headOnly ? undefined : Buffer.concat(chunks, total) }
      } catch (error: any) {
        if (error?.status === 413) throw error
        return null
      } finally {
        await handle.close()
```

</details>

**依据 5 · 源码核查**：[01_content/src/index.ts:311-331](https://github.com/Aisland-SJL/dsh-worktable/blob/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content/src/index.ts#L311-L331)

公开静态 capability 仅 GET/HEAD，私有准入与此分开。

<details>
<summary>查看原文（21行）</summary>

```text
  register({
    kind: 'prefix', path: PREVIEW_PREFIX,
    handler: async (req: any, res: any) => {
      // A sandboxed document has an opaque origin. It can read only this capability's
      // static directory, without credentials; it cannot pass the host API admission.
      if (req.method !== 'GET' && req.method !== 'HEAD') { json(res, 405, { error: 'method not allowed' }); return }
      try {
        const parts = new URL(req.url ?? '/', 'http://dsh.internal').pathname.slice(PREVIEW_PREFIX.length + 1).split('/').map(decodeURIComponent)
        const file = await previews.file(parts.shift() ?? '', parts.filter(Boolean), req.method === 'HEAD')
        if (!file) { json(res, 404, { error: 'preview unavailable; refresh to reopen' }); return }
        const ext = (file.path.split('.').pop() || '').toLowerCase()
        res.writeHead(200, {
          'content-type': FILE_TYPES[ext] ?? 'application/octet-stream',
          'cache-control': 'no-store', 'referrer-policy': 'no-referrer',
          'content-security-policy': PREVIEW_CSP, 'x-content-type-options': 'nosniff',
          'access-control-allow-origin': '*',
        })
        res.end(file.data)
      } catch (err: any) { json(res, err?.status === 413 ? 413 : 404, { error: err?.status === 413 ? 'file too large' : 'preview unavailable' }) }
    },
  }, true)
```

</details>

#### 缺口

- 多并发40MiB资源的峰值内存与精确恶意本地竞态未验证。
  **影响**：单资源上限不是总内存预算，不能承诺高并发稳定或 OS 级隔离。
  **进一步探讨**：以隔离目录测并发、撤销与普通替换；出现内存压力先收小资源或关闭预览，不向敌对本机写者作保证。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 绑定当前是否意味着文件内容与撤销持久安全？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

不意味着。Host write 在 owner 认证后按请求路径 pathResolve 直接 writeFile，没有项目根沙箱；多个项目改同一真实路径仍互相覆盖。绑定只证明接收结果属于该 UI 关联，不证明内容没被其他写者改动。begin 的 persist 失败会回滚，而 revokePane 把 enabled=false 留在内存并吞掉 persist 错误；刷新后持久旧关联可能恢复，用户必须核对。这是具体失败可见性缺口，不应因新增身份认证而忽略。可信单用户也要把“有权限”“绑定当前”“文件当前内容”“业务验收”分开。可借鉴的部分是三重身份和创建回滚；复用应补撤销错误提示、版本摘要及稳定恢复，不只复制 ID。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/src/index.ts:493-508](https://github.com/Aisland-SJL/dsh-worktable/blob/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content/src/index.ts#L493-L508)

真实 writeFile 使用请求绝对路径，无项目 containment。

<details>
<summary>查看原文（16行）</summary>

```text
  register({
    kind: 'exact',
    path: '/api/worktable/write',
    handler: async (req: any, res: any) => {
      try {
        if (req.method !== 'POST') { res.writeHead(405); res.end(); return }
        const body = await readJsonBody(req)
        const p = typeof body.path === 'string' ? body.path : ''
        const content = typeof body.content === 'string' ? body.content : ''
        if (!p) { json(res, 400, { error: 'missing path' }); return }
        if (content.length > 20 * 1024 * 1024) { json(res, 413, { error: 'content too large' }); return }
        const abs = pathResolve(p)
        await import('node:fs/promises').then((m) => m.writeFile(abs, content, 'utf8'))
        json(res, 200, { ok: true })
      } catch (err) {
        json(res, (err as any).status ?? 500, { error: String(err) })
```

</details>

**依据 2 · 源码核查**：[01_content/src/client/widgetMount.ts:89-107](https://github.com/Aisland-SJL/dsh-worktable/blob/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content/src/client/widgetMount.ts#L89-L107)

创建回滚、撤销吞错和当前身份核查的不同语义。

<details>
<summary>查看原文（19行）</summary>

```text
    this.records[projectId] = next
    try { this.persist() } catch (error) { if (before) this.records[projectId] = before; else delete this.records[projectId]; throw error }
    return this.entries(projectId).filter((b) => b.sessionId === sessionId)
  }
  revokePane(projectId: string, paneId: string) {
    const b = this.records[projectId]?.[paneId]
    if (!b || !b.enabled) return
    this.records[projectId] = { ...this.records[projectId], [paneId]: { ...b, enabled: false } }
    try { this.persist() } catch { /* Revocation takes effect in memory even if storage is full. */ }
  }
  revokeProject(projectId: string) {
    if (!this.records[projectId]) return
    for (const b of this.entries(projectId)) this.revokePane(projectId, b.paneId)
  }
  isCurrent(binding: WidgetBinding, spec: WidgetSpec | null | undefined, folder: string | undefined): boolean {
    const current = this.records[binding.projectId]?.[binding.paneId]
    return !!current?.enabled && current.bindingId === binding.bindingId && current.sessionId === binding.sessionId &&
      current.folder === folder && binding.folder === folder && spec?.id === binding.projectId &&
      widgetTargets(spec).filter((t) => t.pane.id === binding.paneId).length === 1
```

</details>

#### 缺口

- 存储满后撤销失败的用户提示与刷新恢复未由本轮实机验证。
  **影响**：可能出现用户已关闭而持久记录仍启用的状态，需要人工核对。
  **进一步探讨**：故障注入 localStorage 写失败并刷新；任何旧结果复活即停止自动挂载，保留文件后清理绑定。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 使用路径、平台和总成本如何界定？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

package 的 0.5.0 只声明 Node>=22 与 DSH 0.2.0-rc.2/0.2.1-rc.3；旧0.1范围不再适用。网页和官方 Windows Desktop 的命令所有者不同，Desktop 要完整退出并用其自带 CLI，不能用独立 web CLI 管理。README 的 Windows 隔离验证、部分 Desktop 点测是作者报告；本轮无运行，macOS 仍实验性。终端依赖宿主 ws/node-pty，缺失降级；React 和 slots 耦合宿主。用户配置项目/目录/会话和布局，状态与媒体按浏览器来源保存在本机，不自动 Web/Desktop 同步。成本既含本地 PTY、媒体和网页网络，也含绑定复核和故障恢复；状态通道不调用模型不代表项目任务无费用。没有同任务对照，不能声称多窗提高净效率。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/package.json:1-21](https://github.com/Aisland-SJL/dsh-worktable/blob/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content/package.json#L1-L21)

真实组件版本、主入口和精确 engines。

<details>
<summary>查看原文（21行）</summary>

```text
{
  "name": "dsh-worktable",
  "description": "工作台 Worktable：DeepSeek Harness 侧边栏的 agent 级项目容器（应用抽屉）",
  "version": "0.5.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/Aisland-SJL/dsh-worktable.git",
    "directory": "01_content"
  },
  "engines": {
    "node": ">=22",
    "dsh": "0.2.0-rc.2 || 0.2.1-rc.3"
  },
  "license": "MIT",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
```

</details>

**依据 2 · 源码核查**：[01_content/README.md:24-39](https://github.com/Aisland-SJL/dsh-worktable/blob/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content/README.md#L24-L39)

作者当前兼容、安全与局部验收边界。

<details>
<summary>查看原文（16行）</summary>

```text
- HTTP 文件/目录/写入/Git/工作区与终端握手先通过宿主身份验证，仅放行 owner（0.2.0 使用单 operator 身份）；缺少可确认身份的服务时返回 503，不降级开放。health 仍可公开读取状态。以前直接用无登录 curl 调用这些接口的方式将被拒绝；不提供跳过鉴权开关。
- 候选 dev.1 已在 Windows 隔离数据目录验证 **DSH 0.2.0-rc.2 / 0.2.1-rc.3 网页端**的冷启动、加载、分栏、文件与网页资源；0.2.1 另测创建/写入、控制室绑定和终端，未发送模型请求。用户已在官方 Windows Desktop 0.2.1-rc.3 验证 dev.2 的项目打开、分栏缩放与侧栏设置弹窗正常；前轮新项目也已点测。正式包另做安装与回归检查，这些证据不等于双端全功能验收。
- 本版的 `engines.dsh` 与兼容矩阵只列上述两个 0.2 版本。旧 0.1.x 不在本版支持范围；下方 v0.4.0 的记录是历史范围，不代表 0.5.0 继续支持旧宿主。
- 折叠侧栏与展开侧栏共用一份弹窗层，使控制室新建项目、绑定、图标与删除弹窗不因侧栏收起而消失，避免重复渲染。
- 修复分栏 margin 的小数值被浏览器规范化后误判为外部改写，以及会话根更换后观察器仍盯着旧元素的问题。

### 网页隔离的影响与边界

- 浏览器/动画/自定义 HTML 窗格使用无 `allow-same-origin` 的 sandbox；网页不能直接读取 DSH 主页面及其同源存储；私有文件操作和终端接口仍需宿主身份校验。工作台自己的项目、布局和媒体存储不迁移、不删除。
- **可能受影响**：嵌入页面的 localStorage、IndexedDB、Cookie 登录、依赖同源的请求、弹出新窗口/顶层跳转，以及标注时自动读取 iframe 内文字。项目页内嵌 iframe/object 被限制；依赖这些能力的页面可能需要单独适配。网页窗口级标注仍可使用，但不能承诺保留逐元素文字提取。
- **已观察到的兼容限制**：Cesium 等库的 WebGL 纹理可能需要显式跨源加载。StarMap 的月球纹理已在独立项目中修复并验证，改动不包含在工作台安装包里；其他旧网页仍需各自检查。不会为恢复旧网页取消安全隔离。
- 本地 HTML 通过登录后创建的随机只读地址加载，允许读取该次选择目录内的资源（包括子目录），支持相对 CSS、JS 模块与 fetch；它不是“只能读当前 HTML 文件”。不要给不可信页面挂载含敏感文件的目录；页面仍可主动联网，隔离不等于阻止数据外发。
- 临时地址不写入项目存档，单资源最多 40 MiB，最多 128 个挂载，连续 30 分钟无读取后失效；失效后点击窗格刷新重新创建。关闭网页标签、刷新替换、组件卸载或插件卸载会撤销；仅关闭/切换项目仍沿用最多 6 个项目的保活池，不立即撤销仍挂载的页面。
- 预览使用同一文件句柄限量读取，读取前后复核真实路径、文件身份与状态；检测到替换、改写或撤销时不返回内容。此措施不是针对恶意本地写入者精确竞态的操作系统沙箱；40 MiB 是单资源限制，不是所有并发请求的总内存额度。
- 终端插件卸载时关闭本插件连接及 Shell。鉴权检查发生在每次 HTTP 请求/WS 建连；本轮没有实现宿主身份撤销后即时断开已有 WS 的机制。
- `npm run test:security` 覆盖鉴权、预览目录越界/生命周期、终端卸载；`npm run pack` 同时执行真实 Chromium 小数 margin 回归。需要本机安装 Edge/Chrome，或用 `DSH_TEST_CHROMIUM` 指定可执行文件。
```

</details>

**依据 3 · 源码核查**：[01_content/README.md:60-89](https://github.com/Aisland-SJL/dsh-worktable/blob/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content/README.md#L60-L89)

文件、shell、环境、依赖及不同安装所有者。

<details>
<summary>查看原文（30行）</summary>

```text
## 权限与外部服务（如实披露）

- **文件访问**：服务端读写工作区与用户指定的目录——文件窗目录列表、MD 编辑保存、项目文件夹 mkdir、站点静态托管、widget 产物读取。除用户当次操作外，插件在加载时、项目状态变化时、已登记窗口任务完成时会自动读取当前关联的 `.dsh-worktable/` 结果文件及其指定产物，并读取宿主提供的工作区数据（workspaces 路由）。不扫描根目录旧 `widget-result.json`；产物路径可来自任务结果，这不是文件系统沙箱。失败返回错误或降级。
- **网络**：① 更新检查向 api.github.com 发只读 GET（无凭据，请求仅含公开仓库名，不携带会话内容）；② 插件与宿主的通信走宿主自身的 API / WebSocket 通道；③ 网页窗加载用户指定的页面，页面自身可能发起任意网络请求；本版的隔离与存储限制见上节，不等同于完整浏览器页面的功能。
- **命令执行**：① 「源代码管理」窗运行 git 只读状态命令；② 「终端」窗经 node-pty 启动交互式 Shell（Windows 下为 PowerShell）——这是用户主动使用的完整终端：终端内执行的任何命令都可能读写文件、联网，行为等同用户本人操作。
- **凭据与环境**：插件代码不专门提取、存储或上传任何 API Key / Token / Cookie；但终端窗把宿主进程的完整环境变量传给子 Shell（其中可能包含敏感信息），终端内命令的行为不受插件约束。插件对 process.env 的读取用于运行参数（数据目录 DSH_HOME、终端默认 Shell SHELL 等），不将其外发。以上声明均有对应源码可查；本说明不是安全保证，高权限能力如实列出，使用风险由用户在自身环境评估。
- **外部依赖与边界**：无生产依赖；终端窗依赖宿主的 ws / node-pty（缺失时该窗降级提示，不影响其余功能）。不替换、不禁用任何官方插件。本插件不声称解决宿主自身的全部启动问题。

## 安装

### 网页端

方式 A（推荐，无需 Git）——直接安装 GitHub Release 的最新安装包：

    dsh plugin --profile web add "https://github.com/Aisland-SJL/dsh-worktable/releases/latest/download/dsh-worktable.tgz"

方式 B（想改源码用）——克隆仓库后用本地路径注册（`link:` 只接受本地路径，不要带空格）：

    git clone https://github.com/Aisland-SJL/dsh-worktable.git
    dsh plugin --profile web add "link:<克隆出来的 dsh-worktable 仓库目录的绝对路径>/01_content"

两种方式 `add` 都会把 `dsh-worktable` 注册进 profile 的 bundle 列表（写入 `~/.dsh`），装完重启 dsh web、刷新界面生效。

### Windows 官方桌面端

先保存任务，从应用菜单/托盘完整退出（只关窗口不够）；将占位路径替换为实际桌面端安装目录，在 PowerShell 执行，再手动重新打开应用：

    & "<桌面端安装目录>\resources\runtime\cli\bin\dsh.cmd" plugin --profile desktop add "https://github.com/Aisland-SJL/dsh-worktable/releases/download/v0.5.0/dsh-worktable-0.5.0.tgz"

不要以不固定版本的 npx 或网页端 CLI 代替桌面端自带 CLI；保留实际 DSH_HOME，勿把测试数据目录覆盖正式数据。新建控制室管理对话时，DSH 0.2 用户请选择分组，或直接绑定可用的现有对话。
```

</details>

#### 缺口

- 复杂布局下总操作时间、完整审批/子 agent/自动挂载闭环未证实。
  **影响**：不能把局部点测当完整业务成功或 macOS 兼容。
  **进一步探讨**：用两个低风险项目先核绑定/文件/布局，再覆盖实际审批与晚到产物；记录总人工分钟和错误挂载。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 谁可以试用，哪项改进值得验证？

**研究主题**：采用判断、新假设与验证

#### 完整回答

愿管理本地目录与会话的 Windows 个人开发者可在支持版本隔离 profile 试用两个低风险项目，先不启终端，逐项测重绑、旧结果、预览撤销再扩大。多用户共享高权限服务、无法区分网页外发与本地秘密目录的人，以及要求即时撤销既有终端身份的人先观察。未验证假设是在结果中增加内容摘要与生成版本、将撤销持久失败变成可见恢复状态，能同时减少晚到写者和刷新复活的复核负担。以同目录两项目、重绑、晚到结果、存储满和文件被其他项目改写对照当前身份协议；若错挂/旧内容误认不降或人工时间增加，否定扩展。该假设不把 UI 绑定升级为文件系统沙箱。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/src/client/widgetMount.ts:93-119](https://github.com/Aisland-SJL/dsh-worktable/blob/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content/src/client/widgetMount.ts#L93-L119)

撤销与内容未绑定的设计为假设依据。

<details>
<summary>查看原文（27行）</summary>

```text
  revokePane(projectId: string, paneId: string) {
    const b = this.records[projectId]?.[paneId]
    if (!b || !b.enabled) return
    this.records[projectId] = { ...this.records[projectId], [paneId]: { ...b, enabled: false } }
    try { this.persist() } catch { /* Revocation takes effect in memory even if storage is full. */ }
  }
  revokeProject(projectId: string) {
    if (!this.records[projectId]) return
    for (const b of this.entries(projectId)) this.revokePane(projectId, b.paneId)
  }
  isCurrent(binding: WidgetBinding, spec: WidgetSpec | null | undefined, folder: string | undefined): boolean {
    const current = this.records[binding.projectId]?.[binding.paneId]
    return !!current?.enabled && current.bindingId === binding.bindingId && current.sessionId === binding.sessionId &&
      current.folder === folder && binding.folder === folder && spec?.id === binding.projectId &&
      widgetTargets(spec).filter((t) => t.pane.id === binding.paneId).length === 1
  }
  resolve(binding: WidgetBinding, raw: string, spec: WidgetSpec | null | undefined, folder: string | undefined):
    { target: WidgetTarget; item: { kind: 'html' | 'url' | 'file'; path: string } } | null {
    if (!this.isCurrent(binding, spec, folder)) return null
    try {
      const d = JSON.parse(raw)
      if (!d || Array.isArray(d) || d.version !== 2 || d.projectId !== binding.projectId ||
          d.paneId !== binding.paneId || d.bindingId !== binding.bindingId || d.window !== binding.window ||
          !['html', 'url', 'file'].includes(d.kind) || typeof d.path !== 'string' || !d.path.trim()) return null
      const target = widgetTargets(spec).find((t) => t.pane.id === binding.paneId)!
      return { target, item: { kind: d.kind, path: d.path.trim() } }
    } catch { return null }
```

</details>

**依据 2 · 源码核查**：[01_content/src/index.ts:493-505](https://github.com/Aisland-SJL/dsh-worktable/blob/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content/src/index.ts#L493-L505)

共同实际路径允许写入，是内容版本需求的反例。

<details>
<summary>查看原文（13行）</summary>

```text
  register({
    kind: 'exact',
    path: '/api/worktable/write',
    handler: async (req: any, res: any) => {
      try {
        if (req.method !== 'POST') { res.writeHead(405); res.end(); return }
        const body = await readJsonBody(req)
        const p = typeof body.path === 'string' ? body.path : ''
        const content = typeof body.content === 'string' ? body.content : ''
        if (!p) { json(res, 400, { error: 'missing path' }); return }
        if (content.length > 20 * 1024 * 1024) { json(res, 413, { error: 'content too large' }); return }
        const abs = pathResolve(p)
        await import('node:fs/promises').then((m) => m.writeFile(abs, content, 'utf8'))
```

</details>

**依据 3 · 源码核查**：[01_content/README.md:32-38](https://github.com/Aisland-SJL/dsh-worktable/blob/56ffe0cd1c320cde9f6101c6b2e49ec60ad53a17/01_content/README.md#L32-L38)

目录授权、外发和既有 WS 界限决定采用条件。

```text
- 浏览器/动画/自定义 HTML 窗格使用无 `allow-same-origin` 的 sandbox；网页不能直接读取 DSH 主页面及其同源存储；私有文件操作和终端接口仍需宿主身份校验。工作台自己的项目、布局和媒体存储不迁移、不删除。
- **可能受影响**：嵌入页面的 localStorage、IndexedDB、Cookie 登录、依赖同源的请求、弹出新窗口/顶层跳转，以及标注时自动读取 iframe 内文字。项目页内嵌 iframe/object 被限制；依赖这些能力的页面可能需要单独适配。网页窗口级标注仍可使用，但不能承诺保留逐元素文字提取。
- **已观察到的兼容限制**：Cesium 等库的 WebGL 纹理可能需要显式跨源加载。StarMap 的月球纹理已在独立项目中修复并验证，改动不包含在工作台安装包里；其他旧网页仍需各自检查。不会为恢复旧网页取消安全隔离。
- 本地 HTML 通过登录后创建的随机只读地址加载，允许读取该次选择目录内的资源（包括子目录），支持相对 CSS、JS 模块与 fetch；它不是“只能读当前 HTML 文件”。不要给不可信页面挂载含敏感文件的目录；页面仍可主动联网，隔离不等于阻止数据外发。
- 临时地址不写入项目存档，单资源最多 40 MiB，最多 128 个挂载，连续 30 分钟无读取后失效；失效后点击窗格刷新重新创建。关闭网页标签、刷新替换、组件卸载或插件卸载会撤销；仅关闭/切换项目仍沿用最多 6 个项目的保活池，不立即撤销仍挂载的页面。
- 预览使用同一文件句柄限量读取，读取前后复核真实路径、文件身份与状态；检测到替换、改写或撤销时不返回内容。此措施不是针对恶意本地写入者精确竞态的操作系统沙箱；40 MiB 是单资源限制，不是所有并发请求的总内存额度。
- 终端插件卸载时关闭本插件连接及 Shell。鉴权检查发生在每次 HTTP 请求/WS 建连；本轮没有实现宿主身份撤销后即时断开已有 WS 的机制。
```

#### 缺口

- 内容版本及撤销恢复是否值得新增操作负担未知。
  **影响**：不能作为已实现能力或已确认市场机会。
  **进一步探讨**：先做五类故障矩阵和人工日志对照；收益不成立不扩为独立插件。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
