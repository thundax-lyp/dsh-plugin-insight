# dsh-md-annotator

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[75f7f4d](https://github.com/3361805598-gif/dsh-md-annotator/tree/75f7f4d7c7cad205ed7cda7b687774e0db8a4254)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/3361805598-gif/dsh-md-annotator)
<!-- END META -->

> **实现功能**：在 Better Sidebar 中预览和编辑 Markdown，添加块/选区批注并整理到所属会话草稿。

> **核心亮点**：将文件预览、块/选区批注、源码编辑与模型草稿连接，保留人对发送控制；增量是审稿交接而非新的Markdown标准。详见[Q01](#research-q01)。

> **风险与缺陷**：原文件冲突保护不等批注永久保存，刷新/重启会失运行期草稿；复杂语法和无法唯一重锚只保留stale，需读者主动导出核对。详见[Q03](#research-q03)。

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
  - [Q01 · 谁在什么审稿任务中获益，增加什么？](#detail-section-11)
  - [Q02 · 文件、批注、保存与草稿怎样流动？](#detail-section-12)
  - [Q03 · 不丢稿和重锚定保证到哪里？](#detail-section-13)
  - [Q04 · 依赖、成本与工程可借鉴点是什么？](#detail-section-14)
  - [Q05 · 还能探索什么，当前怎样采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：文稿审阅者需要将指向原文的意见交回模型，合格结果是批注正确、源码不误覆盖、报告进入正确草稿并由用户发送。详见[Q01](#research-q01)。

外部编辑器与手工复制行号/原文，插件减少DSH与审稿材料切换但保留人发送和冲突合并责任。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Markdown编辑/预览 | 审读源码 | 2MiB、UTF8与语法子集 |
| 块/选区批注 | 指向原文意见 | 失配标stale，运行期状态 |
| 条件保存 | 防外部覆盖 | 依fs版本契约 |
| 草稿报告 | 交给模型改稿 | 不自动发，须核对归属 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| Better Sidebar指定版本 | viewer承载 | 未安装不激活 |
| DSH workspaceFiles/fs/认证 | 读取与条件保存 | 版本/权限契约需匹配 |
| conversation/sessions | 所属草稿 | 归属不清不能交接 |
| 可选localStorage | 偏好持久化 | 不保存批注和源码草稿 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 安装Sidebar和插件 | 用户 | viewer接管md |
| 阅读批注/编辑 | 用户 | 引用与当前原文一致 |
| 条件保存并看冲突 | 用户/宿主 | version与实际文件对应 |
| 汇总到草稿后检查 | 用户 | 所属会话正确再发送 |
| 退出前导出 | 用户 | 源码保存、批注JSON保留 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Sidebar与宿主、打包资源 | 安装、理解批注/保存边界 | 需匹配Sidebar和宿主；安装/边界学习时间未知 |
| 持续使用 | 文档解析、卡片布局和版本轮询 | 审稿、导出，效率未测 | 解析/布局/轮询资源与审稿导出工时未计量 |
| 失败恢复 | 草稿/批注副本及文件回读 | 合并外部修改、手工重锚和恢复 | 批注/草稿备份与外部修改重锚恢复工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 准确批注 | 内容/邻接签名 | 不唯一标stale，非语义定位 |
| 防误覆盖 | replaceIfVersion和uncertain回读 | 依宿主fs契约 |
| 模型交接 | owner会话setDraft | 人决定发送，批注不持久 |

> **思考**：原文件冲突保护不等批注永久保存，刷新/重启会失运行期草稿；复杂语法和无法唯一重锚只保留stale，需读者主动导出核对。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将文件预览、块/选区批注、源码编辑与模型草稿连接，保留人对发送控制；增量是审稿交接而非新的Markdown标准。详见[Q01](#research-q01)。

将文件预览、块/选区批注、源码编辑与模型草稿连接，保留人对发送控制；增量是审稿交接而非新的Markdown标准。详见[Q01](#research-q01)。

完整读与版本校验、未知保存结果先回读和保守stale值得借鉴；宿主fs/Sidebar兼容和UI布局仍需核对。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

原文件冲突保护不等批注永久保存，刷新/重启会失运行期草稿；复杂语法和无法唯一重锚只保留stale，需读者主动导出核对。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议有备份文稿的小范围试用，先验块引用/归属和冲突，结束前保存源码导出批注；复杂语法或导出不可靠时回外部编辑器。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

条件保存、保守重锚及草稿交接有源码支持；运行期批注不持久。可恢复快照为未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/src/entry.js、lib/src/files.js、lib/src/documents.js、lib/src/store.js、lib/src/sidebar.js、test/host.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交viewer入口、完整文件读取、Host保存、文档store、重锚和草稿交接；未逐行审计全部渲染布局，不运行浏览器/测试。
- 下一步：进一步探讨从外部修改、保存结果不确定、重复块重锚和刷新丢运行态四类样例入手，比较正确审稿交接和恢复成本。

**分析版本**

- **仓库**：[3361805598-gif/dsh-md-annotator](https://github.com/3361805598-gif/dsh-md-annotator)
- **版本号**：0.9.0（[固定提交 75f7f4d](https://github.com/3361805598-gif/dsh-md-annotator/tree/75f7f4d7c7cad205ed7cda7b687774e0db8a4254)）
- **版本日期**：2026-09-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究绑定会话/文件版本的可恢复审稿快照，恢复仅作待核对草稿，用重载/改写/重复块比较错挂和敏感残留。当前未验证。详见[Q05](#research-q05)。

进一步探讨从外部修改、保存结果不确定、重复块重锚和刷新丢运行态四类样例入手，比较正确审稿交接和恢复成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 272 | — | — | 4193 |
| .js | source | 14 | 4297 | 3863 | 296 | — |
| .mjs | source | 1 | 68 | 43 | 21 | — |
| .mjs | test | 6 | 600 | 543 | 31 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/3361805598-gif/dsh-md-annotator/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/3361805598-gif/dsh-md-annotator/issues?q=is%3Aissue+created%3A2026-09-22T05%3A11%3A18.756Z..2026-10-22T05%3A11%3A18.756Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/3361805598-gif/dsh-md-annotator/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A11%3A18.756Z..2026-10-22T05%3A11%3A18.756Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本如何把Markdown块批注和源码编辑交接到DSH会话，其保存、重锚定与生命周期边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在什么审稿任务中获益，增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在DSH阅读或修改Markdown方案、研究稿和说明文件的人，任务是对具体块/选区提出必须改、建议改或疑问，再把有上下文的意见交回当前文件所属会话。合格交付是批注指向正确原文、保存源码不覆盖他人修改、汇总进入正确会话草稿且由用户决定发送。

简单替代是外部编辑器加行号批注，或在聊天手工复制原文。插件将预览、源码、批注卡和报告草稿放在Better Sidebar文件入口，共享同会话同文件状态，减少搬运。它没有完整富文本或GFM，也不创建协作审稿服务器；关键增量是源码位置与模型草稿的交接，而不是新的Markdown解析理论。appendReport明确只setDraft，不自动send，这保留了人对发送内容的控制。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-16](https://github.com/3361805598-gif/dsh-md-annotator/blob/75f7f4d7c7cad205ed7cda7b687774e0db8a4254/README.md#L1-L16)

作者任务、批注类型与不自动发送。

<details>
<summary>查看原文（16行）</summary>

```text
# dsh-md-annotator

面向 DeepSeek Harness Web UI 的 Markdown 批注插件。通过 The Better Sidebar 打开 `.md` / `.markdown` 文件后，可进行 Markdown 预览、块级批注、选区批注、源码编辑、保存和批注报告整理。0.9.0 起重新接入 `dsh-better-sidebar`，由其负责文件路由与面板承载。

## 功能

- 通过 The Better Sidebar 打开 Markdown 文件，切换「预览」与「源码」模式；源码支持 Cmd/Ctrl+S 保存；
- 解析标题、段落、列表项（逐项）、表格、代码块、引用和水平线；支持常用内联 Markdown；
- 悬停块或列表项后添加批注，也可以在同一段落或列表项内选中文字添加选区批注；批注支持「必须改 / 建议改 / 疑问」类型；
- 批注以右侧卡片显示，按原文位置排列并自动避让；橙色虚线从被批注的文字或段落连接到对应卡片，悬停时加粗；支持原文引用、复制、编辑、删除及单条写入草稿。保留批注高亮、计数和可拖动的批注清单，支持清空和 JSON 导出；
- 批注栏与正文一起滚动，侧栏宽度变化时重新排列；窄侧栏可横向滚动，也可使用官方分栏放大或全屏查看；
- 将全部、所选或单条批注整理为结构化报告，写入该文件所属会话的输入框草稿，不自动发送；
- 独立设置「增强预览」「写入草稿后清空批注」和「报告前缀」；设置保存在本插件自己的版本化 localStorage 空间；
- 文件重新生成后按块内容与邻接上下文重定位批注，失配项标记为「原文已变化」；
- 同一会话和文件的多个视图共享文档草稿、版本和批注；不同会话隔离。

```

</details>

**依据 2 · 源码核查**：[lib/src/sidebar.js:1-6](https://github.com/3361805598-gif/dsh-md-annotator/blob/75f7f4d7c7cad205ed7cda7b687774e0db8a4254/lib/src/sidebar.js#L1-L6)

报告追加到ownerSessionId草稿。

```text
function appendReport(conversation, sessions, ownerSessionId, report) {
  const scope = sessions.scope(ownerSessionId)
  if (!scope) throw new Error("会话不可用")
  const input = conversation.input.for(scope)
  const current = input.state.getSnapshot().draft
  input.setDraft(current.trim() === "" ? report : current + "\n\n" + report)
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件、批注、保存与草稿怎样流动？

**研究主题**：功能与机制

#### 完整回答

客户端等betterSidebar、remote.workspaceFiles、conversation和sessions，注册md/markdown viewer优先级20并自定义读取。文件按64KiB窗口读取，绑定每页version和absolutePath，结束再stat，超过2MiB或非UTF8/NUL拒绝，不把截断文本放入可保存编辑器。文档store按会话/绝对路径共享草稿、版本和批注；解析块后批注ref包含内容及邻接上下文签名，重读时保守重锚。

源码保存走独立/dsh-md-annotator/api/save，先宿主requestRejection，再验证POST/JSON、正文上限、会话和Markdown扩展；按sandboxPolicy解析workspaceRoot，拒绝非普通文件并核对真实目标包含关系，最后fs.writeText replaceIfVersion。客户端冲突保留draft，结果不确定先读回，比对实际content等于submitted才视为已保存。报告不写原文件，追加到文件所属会话草稿。

#### 证据与依据

**依据 1 · 源码核查**：[lib/src/entry.js:3-23](https://github.com/3361805598-gif/dsh-md-annotator/blob/75f7f4d7c7cad205ed7cda7b687774e0db8a4254/lib/src/entry.js#L3-L23)

viewer加载与依赖。

<details>
<summary>查看原文（21行）</summary>

```text
const inject = ["betterSidebar", "remote", "remote.workspaceFiles", "conversation", "sessions"]
function apply(context) {
  const documents = createDocumentStore((file, signal) => readDocument(context.remote, file, signal), postDocument)
  let storage
  try { storage = window.localStorage } catch (_) {}
  const runtime = {
    documents: documents, settings: createSettings(storage),
    append: (sessionId, report) => appendReport(context.conversation, context.sessions, sessionId, report)
  }
  context.effect(() => context.betterSidebar.registerFileViewer({
    id: "dsh-md-annotator:markdown", title: "Markdown 批注",
    exts: ["md", "markdown"], priority: 20, fetchStrategy: "custom",
    load: async (path, scope, signal) => {
      const file = { sessionId: scope.sessionId, path: path }
      const result = await context.remote.workspaceFiles.stat(file.sessionId, path, signal)
      checkAborted(signal)
      if (!result.ok) throw fileError(result.error.code, failureText(result.error))
      return { doc: documents.get(scope.sessionId, result.value.absolutePath, file), version: result.value.version }
    },
    component: props => React.createElement(BetterMarkdownViewer, Object.assign({}, props, { runtime: runtime, remote: context.remote }))
  }))
```

</details>

**依据 2 · 源码核查**：[lib/src/files.js:48-90](https://github.com/3361805598-gif/dsh-md-annotator/blob/75f7f4d7c7cad205ed7cda7b687774e0db8a4254/lib/src/files.js#L48-L90)

完整分页读取与版本复核。

<details>
<summary>查看原文（43行）</summary>

```text
async function readDocument(remote, file, signal) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      let offset = 0
      let version
      let absolutePath
      const chunks = []
      let windowSize = 64 * 1024
      for (;;) {
        checkAborted(signal)
        const result = await remote.workspaceFiles.readBytes(file.sessionId, file.path, { offset: offset, length: windowSize }, signal)
        checkAborted(signal)
        if (!result.ok) {
          if (result.error.code === "workspace-file/too-large" && windowSize > 1) { windowSize = Math.max(1, Math.floor(windowSize / 2)); continue }
          throw fileError(result.error.code, failureText(result.error))
        }
        const page = result.value
        if (page.bytes > MAX_DOCUMENT_BYTES) throw fileError("too-large", "文件超过 2 MiB")
        if (version !== undefined && (version !== page.version || absolutePath !== page.absolutePath)) throw fileError("changed-during-read", "读取期间文件已变化，请重新加载")
        version = page.version
        absolutePath = page.absolutePath
        if (page.offset !== offset || typeof page.data !== "string") throw fileError("invalid-page", "文件服务返回无效字节窗口")
        const raw = atob(page.data)
        const bytes = Uint8Array.from(raw, ch => ch.charCodeAt(0))
        offset += bytes.length
        if (offset > MAX_DOCUMENT_BYTES) throw fileError("too-large", "文件超过 2 MiB")
        chunks.push(bytes)
        if (page.eof) break
        if (bytes.length === 0) throw fileError("invalid-page", "文件读取未前进")
      }
      // A file can change after the final window's pre-read stat.
      const last = await remote.workspaceFiles.stat(file.sessionId, file.path, signal)
      checkAborted(signal)
      if (!last.ok) throw fileError(last.error.code, failureText(last.error))
      if (last.value.version !== version) throw fileError("changed-during-read", "读取期间文件已变化，请重新加载")
      const bytes = new Uint8Array(offset)
      let position = 0
      chunks.forEach(chunk => { bytes.set(chunk, position); position += chunk.length })
      let content
      try { content = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes) }
      catch (_) { throw fileError("not-text", "文件不是有效 UTF-8 文本") }
      if (content.includes("\0")) throw fileError("not-text", "文件包含 NUL，不能作为 Markdown 编辑")
      return { content: content, version: version, absolutePath: absolutePath }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:16-41](https://github.com/3361805598-gif/dsh-md-annotator/blob/75f7f4d7c7cad205ed7cda7b687774e0db8a4254/lib/index.js#L16-L41)

版本条件保存及路径/类型检查。

<details>
<summary>查看原文（26行）</summary>

```text
export async function saveDocument(ctx, payload, signal) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new SaveError("bad-request", "请求必须为 JSON 对象")
  const { sessionId, path, content, baseVersion } = payload
  if (typeof sessionId !== "string" || !sessionId || sessionId.length > 1024 ||
      typeof path !== "string" || !path || path.length > 8192 || path.includes("\0") ||
      typeof content !== "string" || typeof baseVersion !== "string" || !baseVersion || baseVersion.length > 2048) {
    throw new SaveError("bad-request", "sessionId、path、content 和 baseVersion 无效")
  }
  if (!/\.(md|markdown)$/i.test(path)) throw new SaveError("invalid-extension", "只支持 Markdown 文件")
  if (content.includes("\0") || /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(content)) throw new SaveError("not-text", "内容不是有效 UTF-8 文本")
  if (Buffer.byteLength(content, "utf8") > MAX_BYTES) throw new SaveError("too-large", "文件超过 2 MiB", 413)
  const session = ctx.sessions.get(sessionId)
  if (!session) throw new SaveError("session-not-found", "会话不存在", 404)
  const policy = ctx.sandboxPolicy.resolve({ session })
  const cwd = policy.workspaceRoot
  if (typeof cwd !== "string" || !cwd) throw new SaveError("unknown-workspace", "会话没有工作区", 403)
  const root = await ctx.fs.resolve(cwd, { signal })
  const entry = await ctx.fs.lstat(path, { cwd }, signal)
  if (!entry) throw new SaveError("not-found", "文件已不存在", 404)
  if (entry.type !== "file") throw new SaveError("not-regular-file", "只允许保存已有普通文件，不能保存符号链接", 403)
  const target = await ctx.fs.resolve(path, { cwd, signal })
  if (!ctx.fs.contains(root, target)) throw new SaveError("outside-workspace", "文件不在会话工作区内", 403)
  const info = await ctx.fs.stat(target, signal)
  if (!info || info.type !== "file") throw new SaveError("not-found", "文件已不存在或类型已变化", 404)
  const result = await ctx.fs.writeText(target, content, { kind: "replaceIfVersion", version: baseVersion }, signal, policy)
  return { absolutePath: ctx.fs.processPath(target), version: result.version }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:62-88](https://github.com/3361805598-gif/dsh-md-annotator/blob/75f7f4d7c7cad205ed7cda7b687774e0db8a4254/lib/index.js#L62-L88)

宿主认证、方法和请求解析。

<details>
<summary>查看原文（27行）</summary>

```text
export function createSaveHandler(ctx) {
  return async (req, res) => {
    const controller = new AbortController()
    const abort = () => controller.abort()
    req.once("aborted", abort)
    try {
      // Official authority/origin AND authenticated browser-session checks.
      const rejection = ctx.connection.requestRejection(req)
      if (rejection !== undefined) throw new SaveError(rejection === 401 ? "unauthorized" : "forbidden", "请求未通过身份或来源验证", rejection)
      if (req.method !== "POST") throw new SaveError("method-not-allowed", "只支持 POST", 405)
      if (!/^application\/json(?:\s*;|$)/i.test(req.headers["content-type"] || "")) throw new SaveError("content-type", "需要 application/json", 415)
      const chunks = []
      let size = 0
      for await (const chunk of req) {
        const bytes = Buffer.from(chunk)
        size += bytes.length
        if (size > MAX_REQUEST_BYTES) throw new SaveError("too-large", "请求体过大", 413)
        chunks.push(bytes)
      }
      let payload
      try { payload = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks))) }
      catch { throw new SaveError("bad-json", "JSON 请求无效") }
      json(res, 200, { ok: true, value: await saveDocument(ctx, payload, controller.signal) })
    } catch (error) {
      if (res.destroyed) return
      const e = failure(error)
      json(res, e.status, { ok: false, error: { code: e.code, message: e.message } })
```

</details>

**依据 5 · 源码核查**：[lib/src/documents.js:85-108](https://github.com/3361805598-gif/dsh-md-annotator/blob/75f7f4d7c7cad205ed7cda7b687774e0db8a4254/lib/src/documents.js#L85-L108)

uncertain回读与保留冲突。

<details>
<summary>查看原文（24行）</summary>

```text
      doc.save = async () => {
        const s = doc.getSnapshot()
        if (!s.dirty || !s.version || s.loading || s.saveState === "saving" || s.conflict || lifecycle.signal.aborted) return
        const submitted = s.draft
        if (new TextEncoder().encode(submitted).length > MAX_DOCUMENT_BYTES) { doc.update({ error: "草稿超过 2 MiB，不能保存", saveState: "failed" }); return }
        doc.update({ saveState: "saving", error: null })
        function saved(value, content) {
          if (lifecycle.signal.aborted) return
          doc.update(current => ({ content: content, version: value.version, dirty: current.draft !== content, saveState: "saved", conflict: false, error: null }))
        }
        try {
          const value = await write({ sessionId: doc.file.sessionId, path: doc.file.path, content: submitted, baseVersion: s.version }, lifecycle.signal)
          saved(value, submitted)
        } catch (error) {
          if (lifecycle.signal.aborted) return
          if (error.code === "uncertain") {
            try {
              const actual = await read(doc.file, lifecycle.signal)
              if (actual.content === submitted) { saved(actual, actual.content); return }
              doc.update({ conflict: true, saveState: "failed", error: "保存结果与草稿不同；草稿已保留，请下载或重新加载核对" })
              return
            } catch (_) { /* Keep the uncertain result and prevent blind retry. */ }
          }
          doc.update({ saveState: "failed", conflict: error.code === "conflict" || error.code === "uncertain", error: failureText(error) })
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 不丢稿和重锚定保证到哪里？

**研究主题**：缺陷与关键质疑

#### 完整回答

保存的防冲突机制保护的是原文件写入，不代表批注或未保存草稿永久可靠。README明确文档草稿、批注和视图状态只在运行期，刷新/重启/停用前需保存或导出JSON；settings localStorage仅保存增强预览、清空策略和前缀，不保存全部审稿内容。beforeunload只在hasDirty时提示，也不能当浏览器崩溃恢复。

重锚定若内容和邻接签名不能唯一匹配则标stale，而不是猜最近同名块，这是合理收缩；签名是有限hash/上下文并非语义理解，移动、重复或改写仍可能失配。源码解析仅CommonMark子集，复杂嵌套、转义表格等可能显示与作者预期不同，批注选区也有同段/同列表项约束。保存条件和containment正确性还依赖宿主fs版本/真实路径语义，不把片段检查当原子OS隔离保证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:66-85](https://github.com/3361805598-gif/dsh-md-annotator/blob/75f7f4d7c7cad205ed7cda7b687774e0db8a4254/README.md#L66-L85)

作者生命周期、解析和持久化边界。

<details>
<summary>查看原文（20行）</summary>

````text

## 保存、冲突和生命周期限制

- 单文件完整读取上限为 **2 MiB**。超限文件不会以截断内容进入可保存编辑器；
- 保存使用官方文件版本条件。外部修改导致版本冲突时保留本地源码草稿并提示处理，不自动覆盖；
- 文件草稿、批注和视图状态保存在本次插件运行期内；刷新、重启 DSH 或停用插件前应先保存源码并导出批注 JSON；
- 本插件不提供批注持久化、JSON 导入、富文本编辑、完整 GFM 或自动发送；
- 卸载时撤销 viewer 注册，重新打开文件后由 Better Sidebar 内置预览接管；
- 每 3 秒检查文件版本，保护未保存草稿；未保存标记显示在编辑器内；
- 停用或卸载：

```sh
dsh plugin --profile web remove dsh-md-annotator
```

## 解析与引用说明

内联解析器为 CommonMark 子集，支持 ATX 标题、段落、列表、表格、代码围栏、引用、水平线，以及 `` `code` ``、`**粗体**`、`*斜体*`、`~~删除线~~` 和 `[文本](链接)`。不支持 setext 标题、嵌套列表、内联 HTML、列表项内代码围栏或引用、表格单元格转义管道符。

批注引用采用版本化 `v1:…` 格式，包含内容和邻接上下文签名。文件重新生成后按原文与上下文重锚定，同名块不会静默错挂；无法匹配时保留批注并标记「原文已变化」。
````

</details>

**依据 2 · 源码核查**：[lib/src/documents.js:18-30](https://github.com/3361805598-gif/dsh-md-annotator/blob/75f7f4d7c7cad205ed7cda7b687774e0db8a4254/lib/src/documents.js#L18-L30)

settings只保存三项偏好。

<details>
<summary>查看原文（13行）</summary>

```text
function createSettings(storage) {
  const defaults = { enabled: true, clearAfterSend: true, reportPrefix: "" }
  let restored
  try { restored = JSON.parse(storage.getItem("dsh-md-annotator.settings.v1") || "null") } catch (_) {}
  function valid(value) {
    return { enabled: typeof value?.enabled === "boolean" ? value.enabled : true,
      clearAfterSend: typeof value?.clearAfterSend === "boolean" ? value.clearAfterSend : true,
      reportPrefix: typeof value?.reportPrefix === "string" ? value.reportPrefix.slice(0, 4000) : "" }
  }
  const atom = createAtom(Object.assign({}, defaults, valid(restored)))
  atom.set = patch => {
    atom.update(valid(Object.assign({}, atom.getSnapshot(), patch)))
    try { storage.setItem("dsh-md-annotator.settings.v1", JSON.stringify(atom.getSnapshot())) } catch (_) { /* privacy mode: keep in memory */ }
```

</details>

**依据 3 · 源码核查**：[lib/src/store.js:182-199](https://github.com/3361805598-gif/dsh-md-annotator/blob/75f7f4d7c7cad205ed7cda7b687774e0db8a4254/lib/src/store.js#L182-L199)

重锚失败保留stale。

<details>
<summary>查看原文（18行）</summary>

```text
 * Re-anchor notes against freshly parsed blocks: the addressed index is
 * accepted only when BOTH the source matches AND (for versioned refs) the
 * context signature matches — so a duplicate that slid into the same index is
 * not silently accepted. On mismatch, relocate by (source + signature); fall
 * back to marking stale. Pure and idempotent.
 */
function reanchorNotes(blocks, notes, refIndex) {
  const index = refIndex === undefined ? buildRefIndex(blocks) : refIndex
  return notes.map((n) => {
    const d = decodeRef(n.ref)
    if (d === null) return Object.assign({}, n, { stale: true })
    if (resolveSource(blocks, n.ref) === n.source) {
      if (d.sig === undefined || sigAtRef(index, d) === d.sig) return Object.assign({}, n, { stale: false })
      // signature mismatch → a different (duplicate) block now sits here; fall through
    }
    const located = locateBlockItem(blocks, n.source, d.sig, index)
    if (located !== null) return Object.assign({}, n, { ref: located.ref, start: located.start, end: located.end, stale: false })
    return Object.assign({}, n, { stale: true })
```

</details>

**依据 4 · 源码核查**：[lib/src/entry.js:24-27](https://github.com/3361805598-gif/dsh-md-annotator/blob/75f7f4d7c7cad205ed7cda7b687774e0db8a4254/lib/src/entry.js#L24-L27)

beforeunload与dispose范围。

```text
  context.effect(() => {
    const beforeUnload = event => { if (documents.hasDirty()) { event.preventDefault(); event.returnValue = "" } }
    window.addEventListener("beforeunload", beforeUnload)
    return () => { window.removeEventListener("beforeunload", beforeUnload); documents.dispose() }
```

#### 缺口

- 目标宿主fs版本条件和复杂文档重锚误配率未独立核查。
  **影响**：无法对所有文稿给出无误覆盖或零丢稿保证。
  **进一步探讨**：固定宿主文件版本契约，并构造重复/移动/改写块与保存竞争样例逐项核对。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、成本与工程可借鉴点是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

README和manifest绑定Better Sidebar>=0.19.1<0.20，optional peer是避免重复实例，不表示没有该服务也有完整功能；客户端inject会等它。DSH Web、workspaceFiles分页/stat、conversation.input、fs.replaceIfVersion及认证服务是效果依赖。安装路线主要是本地tgz，打包前构建拼接client；Node>=20，开发需pnpm。

可借鉴的是完全读取边界、条件写入、保存不确定先读回、不唯一锚点标stale，以及草稿与发送分离。host测试用假fs和版本冲突模拟，能检查调用契约但本轮只读，没有真实宿主执行。首次成本是准备Sidebar、打包安装和学习批注；持续成本为文档解析、卡片布局与每三秒版本检查，批注汇总发送后仍占模型上下文；失败恢复需导出批注/下载草稿、核对外部修改并手工合并。没有审稿合格率和计时对照，不把可视编辑等同效率提高。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-27](https://github.com/3361805598-gif/dsh-md-annotator/blob/75f7f4d7c7cad205ed7cda7b687774e0db8a4254/README.md#L18-L27)

依赖与optional peer语义。

<details>
<summary>查看原文（10行）</summary>

```text

- DSH Web profile；
- `dsh-better-sidebar >=0.19.1 <0.20.0`，以及 DSH `0.1.5-rc.1+`；旧 alpha 环境需先升级；
- Node.js ≥ 20，pnpm ≥ 10（仅用于源码构建、测试和打包）；
- 通过 `ctx.betterSidebar.registerFileViewer` 注册 Markdown 预览器，优先级 20；右侧栏与底部工作台共用；
- Better Sidebar 声明为 optional peer，避免重复实例；客户端通过 inject 等待其服务，未安装或被禁用时不激活预览器。

## 安装

前置：已安装可正常运行的 DSH Web profile 和上述兼容版本的 The Better Sidebar。
```

</details>

**依据 2 · 源码核查**：[lib/src/entry.js:3-23](https://github.com/3361805598-gif/dsh-md-annotator/blob/75f7f4d7c7cad205ed7cda7b687774e0db8a4254/lib/src/entry.js#L3-L23)

实际客户端依赖和注册。

<details>
<summary>查看原文（21行）</summary>

```text
const inject = ["betterSidebar", "remote", "remote.workspaceFiles", "conversation", "sessions"]
function apply(context) {
  const documents = createDocumentStore((file, signal) => readDocument(context.remote, file, signal), postDocument)
  let storage
  try { storage = window.localStorage } catch (_) {}
  const runtime = {
    documents: documents, settings: createSettings(storage),
    append: (sessionId, report) => appendReport(context.conversation, context.sessions, sessionId, report)
  }
  context.effect(() => context.betterSidebar.registerFileViewer({
    id: "dsh-md-annotator:markdown", title: "Markdown 批注",
    exts: ["md", "markdown"], priority: 20, fetchStrategy: "custom",
    load: async (path, scope, signal) => {
      const file = { sessionId: scope.sessionId, path: path }
      const result = await context.remote.workspaceFiles.stat(file.sessionId, path, signal)
      checkAborted(signal)
      if (!result.ok) throw fileError(result.error.code, failureText(result.error))
      return { doc: documents.get(scope.sessionId, result.value.absolutePath, file), version: result.value.version }
    },
    component: props => React.createElement(BetterMarkdownViewer, Object.assign({}, props, { runtime: runtime, remote: context.remote }))
  }))
```

</details>

**依据 3 · 源码核查**：[test/host.mjs:1-19](https://github.com/3361805598-gif/dsh-md-annotator/blob/75f7f4d7c7cad205ed7cda7b687774e0db8a4254/test/host.mjs#L1-L19)

模拟fs与版本检查范围。

<details>
<summary>查看原文（19行）</summary>

```text
import assert from 'node:assert/strict'
import { Readable } from 'node:stream'
import { saveDocument, createSaveHandler, apply, MAX_BYTES } from '../lib/index.js'
const calls = []
function context(overrides = {}) {
  return {
    sessions: { get: id => id === 's' ? { id, header: { cwd: '/untrusted-header' } } : undefined },
    sandboxPolicy: { resolve: () => ({ workspaceRoot: '/w', mode: 'workspace-write' }) },
    connection: { requestRejection: () => undefined },
    fs: {
      resolve: async (path, options) => { calls.push(['resolve', path, options]); return { uri: path === '/w' ? '/w' : path.startsWith('/') ? path : '/w/' + path } },
      lstat: async () => ({ type: 'file' }),
      contains: (root, file) => file.uri.startsWith(root.uri + '/'),
      stat: async () => ({ type: 'file', version: 'v1' }),
      processPath: target => target.uri,
      writeText: async (...args) => { calls.push(['write', ...args]); if (args[2].version !== 'v1') throw Object.assign(Error('stale'), { code: 'FS_STALE_VERSION' }); return { version: 'v2' } },
      ...overrides
    }
  }
```

</details>

**依据 4 · 源码核查**：[lib/src/documents.js:98-108](https://github.com/3361805598-gif/dsh-md-annotator/blob/75f7f4d7c7cad205ed7cda7b687774e0db8a4254/lib/src/documents.js#L98-L108)

不确定保存的读回防盲重试。

<details>
<summary>查看原文（11行）</summary>

```text
        } catch (error) {
          if (lifecycle.signal.aborted) return
          if (error.code === "uncertain") {
            try {
              const actual = await read(doc.file, lifecycle.signal)
              if (actual.content === submitted) { saved(actual, actual.content); return }
              doc.update({ conflict: true, saveState: "failed", error: "保存结果与草稿不同；草稿已保留，请下载或重新加载核对" })
              return
            } catch (_) { /* Keep the uncertain result and prevent blind retry. */ }
          }
          doc.update({ saveState: "failed", conflict: error.code === "conflict" || error.code === "uncertain", error: failureText(error) })
```

</details>

#### 缺口

- 缺少大型Markdown、密集批注和多视图下的耗时/内存及审稿结果对照。
  **影响**：不能量化集成便利是否超过布局与恢复负担。
  **进一步探讨**：与手工复制行号流程比较正确批注、改稿合格率、人工时间和冲突恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 还能探索什么，当前怎样采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向是为批注和未保存源码提供显式可恢复快照，绑定会话、文件真实版本与来源hash，恢复时只作为待核对草稿，不能直接覆盖新文件或自动发送。推导来自现有条件保存和stale机制已经强调身份/版本，但临时审稿内容仍在刷新时丢失。最小验证用同一批移动/重复块、外部改写和浏览器重载样例，对比是否正确恢复到待核对状态及是否造成错挂；若恢复误导用户以为已保存或增加敏感残留，应否定方案。

当前建议熟悉Better Sidebar的个人用户在有Git/独立备份的文稿试用。先核对块/选区引用、报告所属会话、外部冲突与uncertain回读；结束前导出批注并保存源码。若文档语法超出子集、会话归属不清或刷新前无法可靠导出，就回外部编辑器。批注仅运行期保留、依赖精确Sidebar版本，尚不适合直接用于唯一重要稿件；试用价值是有备份和可导出条件下的人机审稿交接。

#### 证据与依据

**依据 1 · 源码核查**：[lib/src/store.js:182-199](https://github.com/3361805598-gif/dsh-md-annotator/blob/75f7f4d7c7cad205ed7cda7b687774e0db8a4254/lib/src/store.js#L182-L199)

恢复需保留保守stale语义。

<details>
<summary>查看原文（18行）</summary>

```text
 * Re-anchor notes against freshly parsed blocks: the addressed index is
 * accepted only when BOTH the source matches AND (for versioned refs) the
 * context signature matches — so a duplicate that slid into the same index is
 * not silently accepted. On mismatch, relocate by (source + signature); fall
 * back to marking stale. Pure and idempotent.
 */
function reanchorNotes(blocks, notes, refIndex) {
  const index = refIndex === undefined ? buildRefIndex(blocks) : refIndex
  return notes.map((n) => {
    const d = decodeRef(n.ref)
    if (d === null) return Object.assign({}, n, { stale: true })
    if (resolveSource(blocks, n.ref) === n.source) {
      if (d.sig === undefined || sigAtRef(index, d) === d.sig) return Object.assign({}, n, { stale: false })
      // signature mismatch → a different (duplicate) block now sits here; fall through
    }
    const located = locateBlockItem(blocks, n.source, d.sig, index)
    if (located !== null) return Object.assign({}, n, { ref: located.ref, start: located.start, end: located.end, stale: false })
    return Object.assign({}, n, { stale: true })
```

</details>

**依据 2 · 源码核查**：[lib/src/documents.js:85-108](https://github.com/3361805598-gif/dsh-md-annotator/blob/75f7f4d7c7cad205ed7cda7b687774e0db8a4254/lib/src/documents.js#L85-L108)

草稿和已保存版本明确分开。

<details>
<summary>查看原文（24行）</summary>

```text
      doc.save = async () => {
        const s = doc.getSnapshot()
        if (!s.dirty || !s.version || s.loading || s.saveState === "saving" || s.conflict || lifecycle.signal.aborted) return
        const submitted = s.draft
        if (new TextEncoder().encode(submitted).length > MAX_DOCUMENT_BYTES) { doc.update({ error: "草稿超过 2 MiB，不能保存", saveState: "failed" }); return }
        doc.update({ saveState: "saving", error: null })
        function saved(value, content) {
          if (lifecycle.signal.aborted) return
          doc.update(current => ({ content: content, version: value.version, dirty: current.draft !== content, saveState: "saved", conflict: false, error: null }))
        }
        try {
          const value = await write({ sessionId: doc.file.sessionId, path: doc.file.path, content: submitted, baseVersion: s.version }, lifecycle.signal)
          saved(value, submitted)
        } catch (error) {
          if (lifecycle.signal.aborted) return
          if (error.code === "uncertain") {
            try {
              const actual = await read(doc.file, lifecycle.signal)
              if (actual.content === submitted) { saved(actual, actual.content); return }
              doc.update({ conflict: true, saveState: "failed", error: "保存结果与草稿不同；草稿已保留，请下载或重新加载核对" })
              return
            } catch (_) { /* Keep the uncertain result and prevent blind retry. */ }
          }
          doc.update({ saveState: "failed", conflict: error.code === "conflict" || error.code === "uncertain", error: failureText(error) })
```

</details>

**依据 3 · 源码核查**：[lib/src/sidebar.js:1-6](https://github.com/3361805598-gif/dsh-md-annotator/blob/75f7f4d7c7cad205ed7cda7b687774e0db8a4254/lib/src/sidebar.js#L1-L6)

草稿交接不自动发送。

```text
function appendReport(conversation, sessions, ownerSessionId, report) {
  const scope = sessions.scope(ownerSessionId)
  if (!scope) throw new Error("会话不可用")
  const input = conversation.input.for(scope)
  const current = input.state.getSnapshot().draft
  input.setDraft(current.trim() === "" ? report : current + "\n\n" + report)
```

#### 缺口

- 持久恢复方案的敏感数据保留与错挂风险未评估。
  **影响**：只作为假设，不影响当前能力宣称。
  **进一步探讨**：固定恢复快照字段和清理选项，先用非敏感冲突/重载样例验收。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
