# dsh-drag-and-drop

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[c20646a](https://github.com/AKIRACOD/dsh-drag-and-drop/tree/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AKIRACOD/dsh-drag-and-drop)
<!-- END META -->

> **功能**：为 DSH Web 拖入文件/文件夹生成可删除路径 chip，并在发送时插入会话草稿。

> **亮点**：兼顾非图片路径 chip 和图片原生附件，免手输路径；详见[Q01](#research-q01)。

> **主要限制**：隐藏路径唯一元数据候选可静默选错；pending不绑定拖入session，切会话可能把路径放入新会话；Host搜索根/候选需外围授权而局部遍历上限不是总IO预算。均为静态控制流核查，未作越权或错投复现。详见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 拖放如何转成待发送的绝对路径？](#detail-section-11)
  - [Q02 · 浏览器隐藏路径时，定位可保证是被拖入的原文件吗？](#detail-section-12)
  - [Q03 · Host授权、跨会话暂存与读取资源边界是什么？](#detail-section-13)
  - [Q04 · 首次、持续与失败恢复成本和效果怎样？](#detail-section-14)
  - [Q05 · 推荐条件和可继续探讨的来源绑定方案是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH Web 拖入本地文件或目录，以原路径交给后续 Agent 工具。

手工复制/键入绝对路径，或上传文件副本进入聊天。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 拖放 chip UI | 缓存/删除文件路径并发送 | 本机 DSH Web，路径入会话 |
| Host locator route | 按元数据/指纹定位 | 本路由未显式会话授权；资源预算有限 |
| 复本选择器 | 多个候选时用户选路 | 单候选无选择/内容核对 |
| 原生图片保留 | 纯图交 composer 原通道 | 混合 drop 需另测 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web runtime/conversation/webServer | 必需 | UI 和 Host 定位路由 | 插件无法按声明工作 |
| 本机文件/目录可读权限 | 定位必需 | stat/摘要/搜索 | 找不到或不可匹配 |
| 系统索引命令 | 可选 | 扩大与加速搜索 | 回退有界遍历 |
| 用户对路径的确认 | 歧义/高风险时必要 | 防错文件进入会话 | 单候选自动选可能错 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 管理员安装 Web bundle、核会话搜索根 | 插件/client 与 route 可见 |
| 拖入 | 用户拖文件/目录，纯图由原生 composer 处理 | 路径 chip 可删除 |
| 核对发送 | 用户核 chip 全路径，点击 Send 或正常发送 | 消息含期望路径 |
| 恢复 | 错配时撤回并核下游是否访问错误文件 | 重新定位/手工输入 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH Web bundle 与可选系统索引；费用未知 | 安装刷新、核权限与搜索根；工时未知 | 原路径不一定由浏览器给出 |
| 持续使用 | 歧义候选指纹、索引命令和有界遍历耗 CPU/IO；数值未知 | 核 chip/选择复本；耗时未知 | 单候选不核内容 |
| 失败恢复 | 错路径需重搜/重发，可能增加资源；金额未知 | 撤回消息、确认下游是否读错文件；耗时未知 | 实际错配率未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 文件/目录路径 chip | Q01 UI 源码实现 | 真实浏览器兼容 |
| 定位原件 | Q02 分级搜索/摘要 | 唯一候选错配频率 |
| 搜索界限 | Q03 体积/候选/遍历上限 | 实际 IO/延迟 |

> **思考**：隐藏路径唯一元数据候选可静默选错；pending不绑定拖入session，切会话可能把路径放入新会话；Host搜索根/候选需外围授权而局部遍历上限不是总IO预算。均为静态控制流核查，未作越权或错投复现。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：兼顾非图片路径 chip 和图片原生附件，免手输路径；详见[Q01](#research-q01)。

三阶段定位与浏览器chip提供清楚分层，但单候选免内容核对、全局pending跨当前会话、请求自带搜索根/候选会影响路径身份。4MiB请求及部分候选/单根遍历上限是局部限制，完整指纹和多根总IO并未统一限时。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

隐藏路径唯一元数据候选可静默选错；pending不绑定拖入session，切会话可能把路径放入新会话；Host搜索根/候选需外围授权而局部遍历上限不是总IO预算。均为静态控制流核查，未作越权或错投复现。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察，继续可从可信本机Host、明确session归属及合成同名/异步切换场景研究来源匹配；不作原件身份保证或远端文件上传工具。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。定位/路径chip增量成立，唯一候选来源证明、会话归属与总IO预算存在具体静态边界，来源会话绑定假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/locator.ts、src/client/index.ts、src/client/drop-items.ts、src/client/locator.ts、src/fingerprint.ts、tests/locator.spec.ts、src/platform-search.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态审阅；未在浏览器拖放、运行 Host 或探测外部部署鉴权。
- 下一步：隔离构造同名同尺寸诱饵与多副本，核来源/选择；测 Host 非法根、外层鉴权和 IO。

**分析版本**

- **仓库**：[AKIRACOD/dsh-drag-and-drop](https://github.com/AKIRACOD/dsh-drag-and-drop)
- **版本号**：0.2.0（[固定提交 c20646a](https://github.com/AKIRACOD/dsh-drag-and-drop/tree/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5)）
- **版本日期**：2026-08-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索绑定拖入session与Host授权根的来源确认交接，统一候选/摘要IO预算；同名诱饵、异步切换与取消反例若仍错路径/错会话则反证。未实现。详见[Q05](#research-q05)。

隔离构造同名同尺寸诱饵与多副本，核来源/选择；测 Host 非法根、外层鉴权和 IO。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 603 | — | — | 5921 |
| .js | source | 21 | 2541 | 2416 | 108 | — |
| .mjs | source | 3 | 149 | 127 | 8 | — |
| .ts | source | 19 | 1357 | 1200 | 29 | — |
| .ts | test | 9 | 420 | 378 | 11 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AKIRACOD/dsh-drag-and-drop/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AKIRACOD/dsh-drag-and-drop/issues?q=is%3Aissue+created%3A2026-09-22T08%3A39%3A25.300Z..2026-10-22T08%3A39%3A25.300Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AKIRACOD/dsh-drag-and-drop/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T08%3A39%3A25.300Z..2026-10-22T08%3A39%3A25.300Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实拖放本地路径的三阶段定位、错误匹配与 Host 文件探测边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 拖放如何转成待发送的绝对路径？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

client 全页捕获非纯图片 drop；若浏览器给 file URI 直接转换，否则按 workspace/常用目录/系统索引/有界遍历向 Host locator 查找。结果作为可删除 chip 暂存，发送时把路径逐行前置到草稿并 submit；纯图片继续由 DSH 原生 composer 接收。插件不上传或复制原文件，但路径文本进入会话，文件后续读取取决于 DSH 工具。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-55](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/README.md#L14-L55)

chip、新 Send、图片保留与定位设计。

<details>
<summary>查看原文（42行）</summary>

```text
## What's new in this fork (v0.2.0)

This is a maintained fork of [omdsh-dev/dsh-drag-and-drop](https://github.com/omdsh-dev/dsh-drag-and-drop) (formerly bill9109/dsh-drag-and-drop) with a different drop experience:

- **File chips, not path text.** Dropped documents and folders now appear as removable chips in a bar right above the composer — the input box stays empty and free for typing (no more `C:\...\file.docx` pasted into your message).
- **Send without typing.** The chip bar has its own **Send** button: drop a file, click it, and the resolved paths are prepended to the outgoing message automatically. Enter and the normal send button still work when you type alongside files.
- **No more "images only" toast.** Dropping a document no longer triggers the composer's misleading "仅支持 PNG、JPG、WebP、GIF" error.
- **Images stay native.** Image-only drops keep the original behavior (thumbnail attachments through the composer).

## Why this exists

A browser never hands a web page the real filesystem path of a dropped file — it exposes only a local file URI when it feels like it, and often nothing at all, for security. DSH, though, operates on real files: its tools read, run, and patch actual paths on the machine. Drop a file into an ordinary web input and you get either an upload (a copy that silently breaks the file's relationship with its neighboring dependencies) or a hand-typed path that is easy to get wrong.

This plugin closes that gap on the machine running DSH. It converts the browser's local file URI into the native absolute path, and when the browser hides the path entirely it resolves the file back to its real location — through the current Workspace, registered Workspaces, the OS file index, and a bounded directory search — then writes that path into the current conversation input. The file never leaves its directory.

## Features

- Drag files onto any part of the Web UI to attach their original absolute paths as chips above the composer
- Full-page dim + blur hint while dragging
- Supports files and folders; drag multiple items at once — one chip per item
- Dropped documents render as removable chips; the input box stays clean for typing
- Send just the dropped files with the chip bar's **Send** button — no typing required
- Document drops never trigger the composer's "images only" toast; image-only drops keep native thumbnails
- Native paths on macOS, Linux, and Windows
- POSIX paths, Windows drive-letter paths, and UNC network paths
- No uploading, moving, or copying of files
- Locates files in the current Workspace and registered Workspaces first
- When the browser hides the original path, uses the local file index and bounded directory search
- Computes content fingerprints only when multiple candidates exist
- When several byte-identical copies cannot be told apart automatically, lets the user pick the path
- Failed lookups surface as a dismissible plugin toast (auto-dismisses after 8s; hovering pauses the timer)
- Writes the draft via DSH's input-state service instead of touching the input DOM

## Usage

Drag files or folders from Finder, a Linux file manager, or Windows Explorer onto any part of the DSH Web UI.

Release the mouse when the full-page drag hint appears; each dropped item becomes a removable chip in the bar above the composer (hover a chip to see the full resolved path, click × to remove it).

To send just the dropped files, click **Send** in the chip bar — the resolved paths are prepended to the message automatically. If you also type a message, the paths are prepended when you press Enter or click the normal send button.

Image-only drops keep the native behavior (image attachments).
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:226-255](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/client/index.ts#L226-L255)

直取路径/Host 定位与失败 toast。

<details>
<summary>查看原文（30行）</summary>

```text
async function resolveDrop(ctx: ClientContext, dataTransfer: DataTransfer, toast: FileDropToast, addPending: (paths: readonly string[]) => void): Promise<void> {
  const direct = pathsFromDrop(dataTransfer)
  if (direct.length > 0) { addPending(direct); return }

  const { directories, files } = droppedItems(dataTransfer)
  const entries = [
    ...directories.map(directory => ({ name: directory.name, locate: () => locateDroppedDirectory(directory, ctx.workspaces, currentWorkspacePath(ctx)) })),
    ...files.map(file => ({ name: file.name, locate: () => locateDroppedFile(file, ctx.workspaces, currentWorkspacePath(ctx)) })),
  ]
  const found: string[] = []
  const failures: string[] = []
  for (const entry of entries) {
    try {
      const result = await entry.locate()
      if (result.status === 'found') found.push(result.path)
      else if (result.status === 'choose') {
        const selected = await choosePath(entry.name, result.candidates)
        if (selected === undefined) failures.push(entry.name)
        else found.push(selected)
      } else if (result.status === 'error') {
        failures.push(`${entry.name}（${result.message}）`)
      } else {
        failures.push(entry.name)
      }
    } catch (error) {
      failures.push(`${entry.name}（${error instanceof Error ? error.message : String(error)}）`)
    }
  }
  if (found.length > 0) addPending(found)
  if (failures.length > 0) toast.showError(`未能定位原始路径：${failures.join('、')}`)
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:258-340](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/client/index.ts#L258-L340)

chip 缓存、草稿插入、纯图片回退。

<details>
<summary>查看原文（83行）</summary>

```text
export function apply(ctx: ClientContext): void {
  let dragDepth = 0
  let nextId = 0
  const pending: PendingItem[] = []
  const overlay = createOverlay()
  const toast = createFileDropToast()
  const suppressToast = suppressImageFormatToast()

  const bar = createFileBar((id) => {
    const index = pending.findIndex(item => item.id === id)
    if (index !== -1) pending.splice(index, 1)
    bar.render(pending)
  }, () => {
    const input = flushPending()
    if (input !== undefined) input.submit('queue')
  })

  const addPending = (paths: readonly string[]): void => {
    for (const path of paths) {
      if (pending.some(item => item.path === path)) continue
      pending.push({ id: nextId++, name: fileNameOf(path), path })
    }
    bar.render(pending)
  }

  const flushPending = (): SessionInput | undefined => {
    if (pending.length === 0) return undefined
    const input = currentInput(ctx)
    if (input === undefined) return undefined
    const text = pending.map(item => item.path).join('\n')
    const draft = input.state.getSnapshot().draft
    input.setDraft(draft.trim() === '' ? text : `${text}\n${draft}`)
    pending.length = 0
    bar.render([])
    return input
  }

  const onDragEnter = (event: DragEvent): void => {
    if (!hasFilePayload(event)) return
    dragDepth += 1
    overlay.setActive(true)
  }
  const onDragOver = (event: DragEvent): void => {
    if (!hasFilePayload(event)) return
    event.preventDefault()
    if (event.dataTransfer !== null) event.dataTransfer.dropEffect = 'copy'
    overlay.setActive(true)
  }
  const onDragLeave = (event: DragEvent): void => {
    if (!hasFilePayload(event)) return
    dragDepth = Math.max(0, dragDepth - 1)
    if (dragDepth === 0) overlay.setActive(false)
  }
  const onDrop = (event: DragEvent): void => {
    if (!hasFilePayload(event)) return
    event.preventDefault()
    const dataTransfer = event.dataTransfer
    dragDepth = 0
    overlay.setActive(false)
    if (dataTransfer === null) return
    if (isImageOnlyDrop(dataTransfer)) return
    event.stopPropagation()
    // OS file drags do not fire a DOM `dragend`, and stopPropagation skips the
    // composer's own drop handler, so reset the composer's drop overlay by
    // dispatching the event its reset listener listens for.
    window.dispatchEvent(new Event('dragend'))
    void resolveDrop(ctx, dataTransfer, toast, addPending)
  }
  const onKeyDown = (event: KeyboardEvent): void => {
    if (pending.length === 0) return
    if (event.key !== 'Enter' || event.shiftKey) return
    if (event.isComposing || event.keyCode === 229) return
    flushPending()
  }
  const onPointerDown = (event: PointerEvent): void => {
    if (pending.length === 0) return
    const target = event.target
    if (!(target instanceof Element)) return
    const button = target.closest('button')
    if (button === null || button.disabled) return
    if (button.closest('[data-composer-card]') === null) return
    if (button.getAttribute('aria-haspopup') === 'listbox') return
    flushPending()
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 浏览器隐藏路径时，定位可保证是被拖入的原文件吗？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

Host 在元数据阶段以文件名和大小匹配候选；若恰有一个候选直接返回，不读取内容作证明。多个候选才进行抽样/全 SHA-256 或目录结构/内容摘要，最终多份相同内容可弹选择器。因此浏览器隐藏真实路径且搜索范围漏掉原件、或仅找到同名同尺寸其他文件时，单候选会被当成“原路径”，可能将错误文件路径插入会话。索引/递归有时间、候选和深度上限，属于速度/覆盖折中。

#### 证据与依据

**依据 1 · 源码核查**：[src/locator.ts:46-98](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/locator.ts#L46-L98)

候选过滤、排序和搜索优先级。

<details>
<summary>查看原文（53行）</summary>

```text
async function validateCandidates(item: DroppedEntryMeta, paths: readonly string[]): Promise<Candidate[]> {
  const candidates: Candidate[] = []
  for (const path of [...new Set(paths)].slice(0, MAX_CANDIDATES)) {
    try {
      const info = await stat(path)
      const kindMatches = item.kind === 'file' ? info.isFile() && info.size === item.size : info.isDirectory()
      if (kindMatches && basename(path) === item.name) candidates.push({ path: normalize(path), mtimeMs: info.mtimeMs })
    } catch { /* Candidate disappeared between lookup and validation. */ }
  }
  return candidates.sort((a, b) => item.kind === 'file'
    ? Math.abs(a.mtimeMs - item.lastModified) - Math.abs(b.mtimeMs - item.lastModified) || a.path.localeCompare(b.path)
    : a.path.localeCompare(b.path))
}

async function directCandidates(item: DroppedEntryMeta, roots: readonly string[]): Promise<Candidate[]> {
  const paths = await Promise.all(roots.map(root => directCandidate(root, item.name, item.kind)))
  return validateCandidates(item, paths.filter(path => path !== undefined))
}

async function recursiveCandidates(item: DroppedEntryMeta, roots: readonly string[]): Promise<Candidate[]> {
  const paths: string[] = []
  for (const root of roots) paths.push(...await walkByName(root, item.name, item.kind))
  return validateCandidates(item, paths)
}

function pathsInside(paths: readonly string[], roots: readonly string[]): string[] {
  const canonicalRoots = roots.map(root => resolve(root))
  return paths.filter(path => {
    const candidate = resolve(path)
    return canonicalRoots.some(root => candidate === root || candidate.startsWith(`${root}${sep}`))
  })
}

async function metadataCandidates(item: DroppedEntryMeta, request: LocateRequest): Promise<Candidate[]> {
  const current = request.currentWorkspacePath
  const workspaceRoots = [...new Set(request.workspacePaths ?? [])].filter(root => typeof root === 'string' && root !== '')
  const otherWorkspaces = workspaceRoots.filter(root => root !== current)
  const commonRoots = [join(homedir(), 'Desktop'), join(homedir(), 'Documents'), join(homedir(), 'Downloads')]

  const rootGroups = [current === undefined ? [] : [current], otherWorkspaces, commonRoots]
  const indexedPaths = await indexedSearch(item.name)
  for (const roots of rootGroups) {
    const direct = await directCandidates(item, roots)
    if (direct.length > 0) return direct
    const indexed = await validateCandidates(item, pathsInside(indexedPaths, roots))
    if (indexed.length > 0) return indexed
    const recursive = await recursiveCandidates(item, roots)
    if (recursive.length > 0) return recursive
  }
  const globalIndexed = await validateCandidates(item, indexedPaths)
  if (globalIndexed.length > 0) return globalIndexed
  return recursiveCandidates(item, await broadSearchRoots())
}
```

</details>

**依据 2 · 源码核查**：[src/locator.ts:131-174](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/locator.ts#L131-L174)

单候选直接 found，多候选才摘要。

<details>
<summary>查看原文（44行）</summary>

```text
export async function locate(request: LocateRequest): Promise<LocateResponse> {
  if (request.file.name === '') return { status: 'error', message: 'invalid dropped entry metadata' }
  if ((request.file as { kind?: string }).kind === undefined) {
    request = { ...request, file: { ...request.file, kind: 'file' } as DroppedFileMeta }
  }

  if (request.file.kind === 'directory') {
    if (request.phase === 'metadata') {
      const candidates = await metadataCandidates(request.file, request)
      if (candidates.length === 0) return { status: 'not-found' }
      if (candidates.length === 1) return { status: 'found', path: candidates[0].path }
      return { status: 'directory-structure-required', candidates: candidates.map(candidate => candidate.path) }
    }
    if (request.phase === 'directory-structure') return locateDirectoryStructure(request)
    if (request.phase !== 'directory-content' || request.candidates === undefined || request.directorySamples === undefined) {
      return { status: 'error', message: 'invalid directory phase' }
    }
    const expected = directoryContentDigest(request.directorySamples)
    const paths = request.directorySamples.map(sample => sample.path)
    const matched: string[] = []
    for (const path of request.candidates.slice(0, MAX_CANDIDATES)) {
      try { if (await nodeDirectoryContentDigest(path, paths) === expected) matched.push(path) } catch { /* Ignore unreadable directories. */ }
    }
    if (matched.length === 0) return { status: 'not-found' }
    if (matched.length === 1) return { status: 'found', path: matched[0] }
    return { status: 'choose', candidates: matched }
  }

  if (!Number.isSafeInteger(request.file.size) || request.file.size < 0) return { status: 'error', message: 'invalid dropped-file metadata' }
  if (request.phase === 'metadata') {
    const candidates = await metadataCandidates(request.file, request)
    if (candidates.length === 0) return { status: 'not-found' }
    if (candidates.length === 1) return { status: 'found', path: candidates[0].path }
    return { status: 'sample-required', candidates: candidates.map(candidate => candidate.path) }
  }
  if ((request.phase !== 'sample' && request.phase !== 'full') || request.digest === undefined || request.candidates === undefined) {
    return { status: 'error', message: 'digest phase requires candidates and digest' }
  }
  const matched = await matchingFileDigest(request.candidates, request.digest, request.phase, request.file)
  if (matched.length === 0) return { status: 'not-found' }
  if (matched.length === 1) return { status: 'found', path: matched[0] }
  if (request.phase === 'sample' && request.file.size <= SMALL_FILE_BYTES) return { status: 'choose', candidates: matched }
  if (request.phase === 'sample') return { status: 'full-required', candidates: matched }
  return { status: 'choose', candidates: matched }
```

</details>

**依据 3 · 作者声明**：[README.md:128-145](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/README.md#L128-L145)

作者明述单候选不读内容、复本 chooser。

<details>
<summary>查看原文（18行）</summary>

```text
## Candidate confirmation

Candidates are first filtered by:

- the full file name
- the file size

Modification time is used only for ranking candidates, never as identity.

If only one candidate remains, the plugin uses that path directly without reading the file's content.

If multiple candidates remain, the plugin compares sampled fingerprints from the beginning, middle, and end of the files. Only when sampled fingerprints of large files still collide does it compute a full SHA-256.

If several paths correspond to byte-identical files, the plugin shows the list of paths and lets the user choose which one to insert.

Folders are first searched by name only. A unique candidate is returned directly without traversing the browser directory; multiple same-name candidates are compared by sorted relative path, project type, and file size. For directories that are structurally identical, content samples of up to 24 deterministically chosen files are computed; if still identical, the user picks the path. Directory traversal processes at most 10,000 entries and 32 levels deep, and never follows symlinks or Windows junctions.

Each search level first checks the direct children of the search root, then queries the OS index within that scope, and only then recurses into directories. The priority of the current Workspace, other Workspaces, and common directories is preserved.
```

</details>

#### 缺口

- 未以同名同尺寸诱饵/搜索范围外原件复现错配
  **影响**：错路径频率和下游误读文件影响未知
  **进一步探讨**：隔离构造唯一诱饵与被拖原件，核返回路径与用户选择

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Host授权、跨会话暂存与读取资源边界是什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

Host exact POST路由只检查请求体4MiB和方法，未见路由内身份/工作区授权。metadata的currentWorkspacePath/workspacePaths来自客户端，sample/full的candidates也可由请求携带，Host据此stat、遍历或读指纹。外层webServer准入需由具体宿主确认；仅在可达且Host服务身份有相应文件权限等条件下形成路径/资源探测面，不据此断言公网开放或已发生未授权读取。

client的pending数组由整个apply实例持有，没有绑定拖入时的session。resolveDrop异步完成后才addPending；flushPending又读取那一刻的currentInput。因此拖入后定位期间或发送前切会话，旧路径可能进入新当前会话。清空pending发生于setDraft之后，额外Send再submit；这不是逐会话草稿隔离。路径不会被此插件上传为文件，但会成为模型可见的路径文字，下游文件访问责任仍需核。

遍历上限20000项/深12只约束一次walkByName，各root分别重置，根数及多阶段不构成统一请求预算。系统索引命令有3秒/1MiB局部限制，完整文件指纹读到EOF，无总字节或取消deadline；directory-structure候选循环也未先slice到100，不能将4MiB请求上限和候选上限推广为所有阶段IO有界。源码只保证局部限制与失败忽略，不保证超大文件/恶意目录可及时停止。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:8-47](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/index.ts#L8-L47)

4MiB 限制、POST 与 route；无本路由身份字段。

<details>
<summary>查看原文（40行）</summary>

```text
export const MAX_BODY_BYTES = 4 * 1024 * 1024

async function readJson(req: IncomingMessage): Promise<LocateRequest> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > MAX_BODY_BYTES) throw new Error('request body too large')
    chunks.push(buffer)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as LocateRequest
}

function sendJson(res: ServerResponse, status: number, body: LocateResponse): void {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  })
  res.end(JSON.stringify(body))
}

export function apply(ctx: Context): void {
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: FILE_DROP_ROUTE,
    handler: async (req, res) => {
      if (req.method !== 'POST') {
        sendJson(res, 405, { status: 'error', message: 'method not allowed' })
        return
      }
      try {
        sendJson(res, 200, await locate(await readJson(req)))
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        sendJson(res, 400, { status: 'error', message })
      }
    },
  }), 'file-drop: locator route')
```

</details>

**依据 2 · 源码核查**：[src/locator.ts:79-109](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/locator.ts#L79-L109)

client 提供 workspace 根及指纹路径。

<details>
<summary>查看原文（31行）</summary>

```text
async function metadataCandidates(item: DroppedEntryMeta, request: LocateRequest): Promise<Candidate[]> {
  const current = request.currentWorkspacePath
  const workspaceRoots = [...new Set(request.workspacePaths ?? [])].filter(root => typeof root === 'string' && root !== '')
  const otherWorkspaces = workspaceRoots.filter(root => root !== current)
  const commonRoots = [join(homedir(), 'Desktop'), join(homedir(), 'Documents'), join(homedir(), 'Downloads')]

  const rootGroups = [current === undefined ? [] : [current], otherWorkspaces, commonRoots]
  const indexedPaths = await indexedSearch(item.name)
  for (const roots of rootGroups) {
    const direct = await directCandidates(item, roots)
    if (direct.length > 0) return direct
    const indexed = await validateCandidates(item, pathsInside(indexedPaths, roots))
    if (indexed.length > 0) return indexed
    const recursive = await recursiveCandidates(item, roots)
    if (recursive.length > 0) return recursive
  }
  const globalIndexed = await validateCandidates(item, indexedPaths)
  if (globalIndexed.length > 0) return globalIndexed
  return recursiveCandidates(item, await broadSearchRoots())
}

async function matchingFileDigest(candidates: readonly string[], digest: string, phase: 'sample' | 'full', file: DroppedFileMeta): Promise<string[]> {
  const matched: string[] = []
  for (const path of candidates.slice(0, MAX_CANDIDATES)) {
    try {
      const actual = phase === 'sample' ? await sampleFingerprint(path, file.size) : await fullFingerprint(path)
      if (actual === digest) matched.push(path)
    } catch { /* Unreadable candidates are not matches. */ }
  }
  return matched
}
```

</details>

**依据 3 · 源码核查**：[src/locator.ts:159-174](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/locator.ts#L159-L174)

请求携带候选用于 sample/full。

<details>
<summary>查看原文（16行）</summary>

```text
  if (!Number.isSafeInteger(request.file.size) || request.file.size < 0) return { status: 'error', message: 'invalid dropped-file metadata' }
  if (request.phase === 'metadata') {
    const candidates = await metadataCandidates(request.file, request)
    if (candidates.length === 0) return { status: 'not-found' }
    if (candidates.length === 1) return { status: 'found', path: candidates[0].path }
    return { status: 'sample-required', candidates: candidates.map(candidate => candidate.path) }
  }
  if ((request.phase !== 'sample' && request.phase !== 'full') || request.digest === undefined || request.candidates === undefined) {
    return { status: 'error', message: 'digest phase requires candidates and digest' }
  }
  const matched = await matchingFileDigest(request.candidates, request.digest, request.phase, request.file)
  if (matched.length === 0) return { status: 'not-found' }
  if (matched.length === 1) return { status: 'found', path: matched[0] }
  if (request.phase === 'sample' && request.file.size <= SMALL_FILE_BYTES) return { status: 'choose', candidates: matched }
  if (request.phase === 'sample') return { status: 'full-required', candidates: matched }
  return { status: 'choose', candidates: matched }
```

</details>

**依据 4 · 作者声明**：[README.md:89-161](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/README.md#L89-L161)

搜索上限与隐私宣称。

<details>
<summary>查看原文（73行）</summary>

```text
## Troubleshooting

| Symptom | Resolution |
| --- | --- |
| Dropping a file inserts nothing | Drag again and confirm the full-page hint appears. Verify the bundle is in the profile (`dsh --profile web --dump-config | grep drag-and-drop`) and that the Web UI was restarted + hard-refreshed after installing |
| Wrong path inserted when several copies share a name | Candidates are filtered by full file name and size, then content-sampled only among the survivors. If byte-identical copies remain, the plugin shows a chooser — pick the correct path there |
| Path resolution is slow on a large disk | Install the platform index (Linux: `plocate`; Windows: Everything CLI) and keep files inside a Workspace or a common directory. Every search is bounded: 3s per index command, at most 100 candidates, at most 20,000 directory entries per root |
| macOS/Linux: dropping a folder resolves nothing | Folders are matched by name against Workspaces and common directories; a folder outside every searchable root cannot be located when the browser hides the path — move it into a Workspace or install the OS index |
| Plugin does not load after install | Restart the Web UI and hard-refresh the browser — the client bundle only loads on a fresh page load with the plugin in `__DSH_BOOT__` |

## Path resolution

If the browser exposes a local file URI, the plugin converts it directly into the operating system's native path.

If the browser hides the original path for security reasons, the plugin locates the file in this order:

1. The current Workspace
2. Other registered Workspaces
3. Desktop, Documents, and Downloads
4. The operating system's file index
5. A bounded, platform-specific directory search

System indexes used per platform:

- macOS: Spotlight
- Linux: `plocate` first, then `locate`
- Windows: Everything CLI first, then PowerShell

On Linux, when the system index returns no candidates, the plugin also searches the user home directory and mount points under `/mnt` and `/media`.

On Windows, when the system index returns no candidates, the plugin also searches the user directory and available fixed disks.

To keep searches bounded:

- a single external index command times out after 3 seconds
- at most 100 candidate paths are kept
- each recursive search root visits at most 20,000 directory entries
- unreadable directories and files are ignored

## Candidate confirmation

Candidates are first filtered by:

- the full file name
- the file size

Modification time is used only for ranking candidates, never as identity.

If only one candidate remains, the plugin uses that path directly without reading the file's content.

If multiple candidates remain, the plugin compares sampled fingerprints from the beginning, middle, and end of the files. Only when sampled fingerprints of large files still collide does it compute a full SHA-256.

If several paths correspond to byte-identical files, the plugin shows the list of paths and lets the user choose which one to insert.

Folders are first searched by name only. A unique candidate is returned directly without traversing the browser directory; multiple same-name candidates are compared by sorted relative path, project type, and file size. For directories that are structurally identical, content samples of up to 24 deterministically chosen files are computed; if still identical, the user picks the path. Directory traversal processes at most 10,000 entries and 32 levels deep, and never follows symlinks or Windows junctions.

Each search level first checks the direct children of the search root, then queries the OS index within that scope, and only then recurses into directories. The priority of the current Workspace, other Workspaces, and common directories is preserved.

## Privacy & file access

The plugin never:

- uploads files
- copies files
- moves files
- modifies files
- deletes files

In most cases the plugin only reads file metadata.

Only when multiple candidates share the same name and size does it read a small amount of content to compute sampled fingerprints, and only when large files cannot be told apart by sampling does it read the full content to compute SHA-256.

All resolution and fingerprinting happens locally on the machine running DSH.
```

</details>

**依据 5 · 源码核查**：[src/client/index.ts:211-300](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/client/index.ts#L211-L300)

当前会话动态读取与全实例pending/异步定位发送，未绑定拖入时session。

<details>
<summary>查看原文（90行）</summary>

```text
type SessionInput = ReturnType<IConversation['input']['for']>

function currentInput(ctx: ClientContext): SessionInput | undefined {
  const sessionId = ctx.sessions.list.getSnapshot().current
  if (sessionId === undefined) return undefined
  const scope = ctx.sessions.scope(sessionId)
  const conversation = ctx.get('conversation')
  return scope === undefined || conversation === undefined ? undefined : conversation.input.for(scope)
}

function currentWorkspacePath(ctx: ClientContext): string | undefined {
  const sessionId = ctx.sessions.list.getSnapshot().current
  return sessionId === undefined ? undefined : ctx.sessions.list.getSnapshot().byId[sessionId]?.cwd
}

async function resolveDrop(ctx: ClientContext, dataTransfer: DataTransfer, toast: FileDropToast, addPending: (paths: readonly string[]) => void): Promise<void> {
  const direct = pathsFromDrop(dataTransfer)
  if (direct.length > 0) { addPending(direct); return }

  const { directories, files } = droppedItems(dataTransfer)
  const entries = [
    ...directories.map(directory => ({ name: directory.name, locate: () => locateDroppedDirectory(directory, ctx.workspaces, currentWorkspacePath(ctx)) })),
    ...files.map(file => ({ name: file.name, locate: () => locateDroppedFile(file, ctx.workspaces, currentWorkspacePath(ctx)) })),
  ]
  const found: string[] = []
  const failures: string[] = []
  for (const entry of entries) {
    try {
      const result = await entry.locate()
      if (result.status === 'found') found.push(result.path)
      else if (result.status === 'choose') {
        const selected = await choosePath(entry.name, result.candidates)
        if (selected === undefined) failures.push(entry.name)
        else found.push(selected)
      } else if (result.status === 'error') {
        failures.push(`${entry.name}（${result.message}）`)
      } else {
        failures.push(entry.name)
      }
    } catch (error) {
      failures.push(`${entry.name}（${error instanceof Error ? error.message : String(error)}）`)
    }
  }
  if (found.length > 0) addPending(found)
  if (failures.length > 0) toast.showError(`未能定位原始路径：${failures.join('、')}`)
}

export function apply(ctx: ClientContext): void {
  let dragDepth = 0
  let nextId = 0
  const pending: PendingItem[] = []
  const overlay = createOverlay()
  const toast = createFileDropToast()
  const suppressToast = suppressImageFormatToast()

  const bar = createFileBar((id) => {
    const index = pending.findIndex(item => item.id === id)
    if (index !== -1) pending.splice(index, 1)
    bar.render(pending)
  }, () => {
    const input = flushPending()
    if (input !== undefined) input.submit('queue')
  })

  const addPending = (paths: readonly string[]): void => {
    for (const path of paths) {
      if (pending.some(item => item.path === path)) continue
      pending.push({ id: nextId++, name: fileNameOf(path), path })
    }
    bar.render(pending)
  }

  const flushPending = (): SessionInput | undefined => {
    if (pending.length === 0) return undefined
    const input = currentInput(ctx)
    if (input === undefined) return undefined
    const text = pending.map(item => item.path).join('\n')
    const draft = input.state.getSnapshot().draft
    input.setDraft(draft.trim() === '' ? text : `${text}\n${draft}`)
    pending.length = 0
    bar.render([])
    return input
  }

  const onDragEnter = (event: DragEvent): void => {
    if (!hasFilePayload(event)) return
    dragDepth += 1
    overlay.setActive(true)
  }
  const onDragOver = (event: DragEvent): void => {
```

</details>

**依据 6 · 源码核查**：[src/fingerprint.ts:36-52](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/fingerprint.ts#L36-L52)

fullFingerprint读取到EOF，无字节总量或deadline。

<details>
<summary>查看原文（17行）</summary>

```text
export async function fullFingerprint(path: string): Promise<string> {
  const handle = await open(path, 'r')
  try {
    const hash = createHash('sha256')
    const buffer = Buffer.allocUnsafe(256 * 1024)
    let position = 0
    while (true) {
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, position)
      if (bytesRead === 0) break
      hash.update(buffer.subarray(0, bytesRead))
      position += bytesRead
    }
    return hash.digest('hex')
  } finally {
    await handle.close()
  }
}
```

</details>

**依据 7 · 源码核查**：[src/platform-search.ts:7-39](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/platform-search.ts#L7-L39)

系统命令局部超时和输出限制，不是整个定位请求预算。

<details>
<summary>查看原文（33行）</summary>

```text
const execFileAsync = promisify(execFile)
const COMMAND_TIMEOUT_MS = 3000
export const PLATFORM_MAX_CANDIDATES = 100

export interface PlatformSearchHost {
  readonly platform: NodeJS.Platform
  readonly home: string
  commandExists(command: string): Promise<boolean>
  exec(command: string, args: readonly string[]): Promise<string>
  windowsDrives(): Promise<readonly string[]>
}

const host: PlatformSearchHost = {
  platform: platform(),
  home: homedir(),
  async commandExists(command) {
    if (command.includes('/') || command.includes('\\')) {
      try { await access(command, constants.X_OK); return true } catch { return false }
    }
    const probe = platform() === 'win32' ? 'where.exe' : '/usr/bin/env'
    const args = platform() === 'win32' ? [command] : ['sh', '-c', 'command -v "$1" >/dev/null 2>&1', 'sh', command]
    try { await execFileAsync(probe, args, { timeout: 1000 }); return true } catch { return false }
  },
  async exec(command, args) {
    const { stdout } = await execFileAsync(command, [...args], {
      timeout: COMMAND_TIMEOUT_MS,
      maxBuffer: 1024 * 1024,
      windowsHide: true,
    })
    return stdout
  },
  async windowsDrives() {
    try {
```

</details>

#### 缺口

- 外围Host准入与共享实例多会话条件取决具体宿主，跨会话路径误投的实际发生频率未知。
  **影响**：不能把客户端当前会话或本路由方法检查当身份授权/逐会话隔离。
  **进一步探讨**：可先从明确宿主访问策略、固定session归属和合成异步切换事件序列研究。
- 多根与完整摘要的实际总IO/取消代价未量化。
  **影响**：局部上限不能承诺总请求资源。
  **进一步探讨**：可用合成大目录/文件与取消记录比较总预算和正确来源匹配，不读取私人文件。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续与失败恢复成本和效果怎样？

**研究主题**：效果与总成本

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH Web bundle 与可选系统索引；费用未知 | 安装刷新、核权限与搜索根；工时未知 | 原路径不一定由浏览器给出 |
| 持续使用 | 歧义候选指纹、索引命令和有界遍历耗 CPU/IO；数值未知 | 核 chip/选择复本；耗时未知 | 单候选不核内容 |
| 失败恢复 | 错路径需重搜/重发，可能增加资源；金额未知 | 撤回消息、确认下游是否读错文件；耗时未知 | 实际错配率未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 文件/目录路径 chip | Q01 UI 源码实现 | 真实浏览器兼容 |
| 定位原件 | Q02 分级搜索/摘要 | 唯一候选错配频率 |
| 搜索界限 | Q03 体积/候选/遍历上限 | 实际 IO/延迟 |

相对手贴路径的收益是少手工定位，不能从chip出现推导文件身份正确或任务已完成。每轮索引、指纹与错误路径的人工恢复都应计入。同名/范围漏原件及切会话是必要反例，金额、延迟与错投频率未知，不能填零或承诺节省。

#### 证据与依据

**依据 1 · 源码核查**：[src/locator.ts:79-174](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/locator.ts#L79-L174)

多阶段定位、单候选与摘要读取成本。

<details>
<summary>查看原文（96行）</summary>

```text
async function metadataCandidates(item: DroppedEntryMeta, request: LocateRequest): Promise<Candidate[]> {
  const current = request.currentWorkspacePath
  const workspaceRoots = [...new Set(request.workspacePaths ?? [])].filter(root => typeof root === 'string' && root !== '')
  const otherWorkspaces = workspaceRoots.filter(root => root !== current)
  const commonRoots = [join(homedir(), 'Desktop'), join(homedir(), 'Documents'), join(homedir(), 'Downloads')]

  const rootGroups = [current === undefined ? [] : [current], otherWorkspaces, commonRoots]
  const indexedPaths = await indexedSearch(item.name)
  for (const roots of rootGroups) {
    const direct = await directCandidates(item, roots)
    if (direct.length > 0) return direct
    const indexed = await validateCandidates(item, pathsInside(indexedPaths, roots))
    if (indexed.length > 0) return indexed
    const recursive = await recursiveCandidates(item, roots)
    if (recursive.length > 0) return recursive
  }
  const globalIndexed = await validateCandidates(item, indexedPaths)
  if (globalIndexed.length > 0) return globalIndexed
  return recursiveCandidates(item, await broadSearchRoots())
}

async function matchingFileDigest(candidates: readonly string[], digest: string, phase: 'sample' | 'full', file: DroppedFileMeta): Promise<string[]> {
  const matched: string[] = []
  for (const path of candidates.slice(0, MAX_CANDIDATES)) {
    try {
      const actual = phase === 'sample' ? await sampleFingerprint(path, file.size) : await fullFingerprint(path)
      if (actual === digest) matched.push(path)
    } catch { /* Unreadable candidates are not matches. */ }
  }
  return matched
}

async function locateDirectoryStructure(request: LocateRequest): Promise<LocateResponse> {
  if (request.file.kind !== 'directory' || request.file.structure === undefined || request.candidates === undefined) {
    return { status: 'error', message: 'directory structure phase requires candidates and structure' }
  }
  const candidates = request.candidates
  const expected = directoryStructureDigest(request.file.structure)
  const matched: string[] = []
  let samplePaths = selectDirectorySamplePaths(request.file.structure.entries)
  for (const path of candidates) {
    try {
      const actual = await nodeDirectoryStructureDigest(path)
      if (actual.digest === expected) { matched.push(path); samplePaths = actual.paths }
    } catch { /* Ignore unreadable directories. */ }
  }
  if (matched.length === 0) return { status: 'not-found' }
  if (matched.length === 1) return { status: 'found', path: matched[0] }
  if (samplePaths.length === 0) return { status: 'choose', candidates: matched }
  return { status: 'directory-content-required', candidates: matched, paths: samplePaths }
}

export async function locate(request: LocateRequest): Promise<LocateResponse> {
  if (request.file.name === '') return { status: 'error', message: 'invalid dropped entry metadata' }
  if ((request.file as { kind?: string }).kind === undefined) {
    request = { ...request, file: { ...request.file, kind: 'file' } as DroppedFileMeta }
  }

  if (request.file.kind === 'directory') {
    if (request.phase === 'metadata') {
      const candidates = await metadataCandidates(request.file, request)
      if (candidates.length === 0) return { status: 'not-found' }
      if (candidates.length === 1) return { status: 'found', path: candidates[0].path }
      return { status: 'directory-structure-required', candidates: candidates.map(candidate => candidate.path) }
    }
    if (request.phase === 'directory-structure') return locateDirectoryStructure(request)
    if (request.phase !== 'directory-content' || request.candidates === undefined || request.directorySamples === undefined) {
      return { status: 'error', message: 'invalid directory phase' }
    }
    const expected = directoryContentDigest(request.directorySamples)
    const paths = request.directorySamples.map(sample => sample.path)
    const matched: string[] = []
    for (const path of request.candidates.slice(0, MAX_CANDIDATES)) {
      try { if (await nodeDirectoryContentDigest(path, paths) === expected) matched.push(path) } catch { /* Ignore unreadable directories. */ }
    }
    if (matched.length === 0) return { status: 'not-found' }
    if (matched.length === 1) return { status: 'found', path: matched[0] }
    return { status: 'choose', candidates: matched }
  }

  if (!Number.isSafeInteger(request.file.size) || request.file.size < 0) return { status: 'error', message: 'invalid dropped-file metadata' }
  if (request.phase === 'metadata') {
    const candidates = await metadataCandidates(request.file, request)
    if (candidates.length === 0) return { status: 'not-found' }
    if (candidates.length === 1) return { status: 'found', path: candidates[0].path }
    return { status: 'sample-required', candidates: candidates.map(candidate => candidate.path) }
  }
  if ((request.phase !== 'sample' && request.phase !== 'full') || request.digest === undefined || request.candidates === undefined) {
    return { status: 'error', message: 'digest phase requires candidates and digest' }
  }
  const matched = await matchingFileDigest(request.candidates, request.digest, request.phase, request.file)
  if (matched.length === 0) return { status: 'not-found' }
  if (matched.length === 1) return { status: 'found', path: matched[0] }
  if (request.phase === 'sample' && request.file.size <= SMALL_FILE_BYTES) return { status: 'choose', candidates: matched }
  if (request.phase === 'sample') return { status: 'full-required', candidates: matched }
  return { status: 'choose', candidates: matched }
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:258-300](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/client/index.ts#L258-L300)

暂存、人工删除与当前会话草稿交接。

<details>
<summary>查看原文（43行）</summary>

```text
export function apply(ctx: ClientContext): void {
  let dragDepth = 0
  let nextId = 0
  const pending: PendingItem[] = []
  const overlay = createOverlay()
  const toast = createFileDropToast()
  const suppressToast = suppressImageFormatToast()

  const bar = createFileBar((id) => {
    const index = pending.findIndex(item => item.id === id)
    if (index !== -1) pending.splice(index, 1)
    bar.render(pending)
  }, () => {
    const input = flushPending()
    if (input !== undefined) input.submit('queue')
  })

  const addPending = (paths: readonly string[]): void => {
    for (const path of paths) {
      if (pending.some(item => item.path === path)) continue
      pending.push({ id: nextId++, name: fileNameOf(path), path })
    }
    bar.render(pending)
  }

  const flushPending = (): SessionInput | undefined => {
    if (pending.length === 0) return undefined
    const input = currentInput(ctx)
    if (input === undefined) return undefined
    const text = pending.map(item => item.path).join('\n')
    const draft = input.state.getSnapshot().draft
    input.setDraft(draft.trim() === '' ? text : `${text}\n${draft}`)
    pending.length = 0
    bar.render([])
    return input
  }

  const onDragEnter = (event: DragEvent): void => {
    if (!hasFilePayload(event)) return
    dragDepth += 1
    overlay.setActive(true)
  }
  const onDragOver = (event: DragEvent): void => {
```

</details>

#### 缺口

- 没有同条件输入效率、总IO及错路径恢复人时对照。
  **影响**：不量化生产力或成本收益。
  **进一步探讨**：可从固定合成文件、多副本和会话切换序列比较正确路径交付及恢复总成本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 推荐条件和可继续探讨的来源绑定方案是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议观察。拖放与分阶段指纹有真实便利，但隐藏来源单候选自动采纳、全实例pending缺session归属和Host候选路径授权会影响交付正确性。继续探讨可先锁定可信本机Host和明确当前会话，用用户可逐条核对的合成文件比较，不能将其当唯一来源证明或远端浏览器上传工具。

相对当前全局pending/单候选自动接受，可推导“来源与会话绑定的路径交接”。drop开始即保存session/root能力，完成时若当前会话变化则留原会话待确认而不自动发送；隐藏路径时单候选也比浏览器可读样本或明确向用户确认，Host根与摘要候选绑定真实会话授权和统一IO/取消预算。代价是多一次交互或读取，无法拿到可靠样本的目录必须标未知。该方案未实现，不计现有贡献。

最小反例包括同名同尺寸诱饵、原件不在搜索范围、路径换代、多份相同内容、定位中切session、非法根和超大完整hash。若仍静默错选或向别的会话发路径，来源/会话假设被反证；若预算过早截断令匹配质量或人工负担更差，则资源改进假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[src/locator.ts:46-98](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/locator.ts#L46-L98)

候选过滤、排序和搜索优先级。

<details>
<summary>查看原文（53行）</summary>

```text
async function validateCandidates(item: DroppedEntryMeta, paths: readonly string[]): Promise<Candidate[]> {
  const candidates: Candidate[] = []
  for (const path of [...new Set(paths)].slice(0, MAX_CANDIDATES)) {
    try {
      const info = await stat(path)
      const kindMatches = item.kind === 'file' ? info.isFile() && info.size === item.size : info.isDirectory()
      if (kindMatches && basename(path) === item.name) candidates.push({ path: normalize(path), mtimeMs: info.mtimeMs })
    } catch { /* Candidate disappeared between lookup and validation. */ }
  }
  return candidates.sort((a, b) => item.kind === 'file'
    ? Math.abs(a.mtimeMs - item.lastModified) - Math.abs(b.mtimeMs - item.lastModified) || a.path.localeCompare(b.path)
    : a.path.localeCompare(b.path))
}

async function directCandidates(item: DroppedEntryMeta, roots: readonly string[]): Promise<Candidate[]> {
  const paths = await Promise.all(roots.map(root => directCandidate(root, item.name, item.kind)))
  return validateCandidates(item, paths.filter(path => path !== undefined))
}

async function recursiveCandidates(item: DroppedEntryMeta, roots: readonly string[]): Promise<Candidate[]> {
  const paths: string[] = []
  for (const root of roots) paths.push(...await walkByName(root, item.name, item.kind))
  return validateCandidates(item, paths)
}

function pathsInside(paths: readonly string[], roots: readonly string[]): string[] {
  const canonicalRoots = roots.map(root => resolve(root))
  return paths.filter(path => {
    const candidate = resolve(path)
    return canonicalRoots.some(root => candidate === root || candidate.startsWith(`${root}${sep}`))
  })
}

async function metadataCandidates(item: DroppedEntryMeta, request: LocateRequest): Promise<Candidate[]> {
  const current = request.currentWorkspacePath
  const workspaceRoots = [...new Set(request.workspacePaths ?? [])].filter(root => typeof root === 'string' && root !== '')
  const otherWorkspaces = workspaceRoots.filter(root => root !== current)
  const commonRoots = [join(homedir(), 'Desktop'), join(homedir(), 'Documents'), join(homedir(), 'Downloads')]

  const rootGroups = [current === undefined ? [] : [current], otherWorkspaces, commonRoots]
  const indexedPaths = await indexedSearch(item.name)
  for (const roots of rootGroups) {
    const direct = await directCandidates(item, roots)
    if (direct.length > 0) return direct
    const indexed = await validateCandidates(item, pathsInside(indexedPaths, roots))
    if (indexed.length > 0) return indexed
    const recursive = await recursiveCandidates(item, roots)
    if (recursive.length > 0) return recursive
  }
  const globalIndexed = await validateCandidates(item, indexedPaths)
  if (globalIndexed.length > 0) return globalIndexed
  return recursiveCandidates(item, await broadSearchRoots())
}
```

</details>

**依据 2 · 源码核查**：[src/locator.ts:131-174](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/locator.ts#L131-L174)

单候选直接 found，多候选才摘要。

<details>
<summary>查看原文（44行）</summary>

```text
export async function locate(request: LocateRequest): Promise<LocateResponse> {
  if (request.file.name === '') return { status: 'error', message: 'invalid dropped entry metadata' }
  if ((request.file as { kind?: string }).kind === undefined) {
    request = { ...request, file: { ...request.file, kind: 'file' } as DroppedFileMeta }
  }

  if (request.file.kind === 'directory') {
    if (request.phase === 'metadata') {
      const candidates = await metadataCandidates(request.file, request)
      if (candidates.length === 0) return { status: 'not-found' }
      if (candidates.length === 1) return { status: 'found', path: candidates[0].path }
      return { status: 'directory-structure-required', candidates: candidates.map(candidate => candidate.path) }
    }
    if (request.phase === 'directory-structure') return locateDirectoryStructure(request)
    if (request.phase !== 'directory-content' || request.candidates === undefined || request.directorySamples === undefined) {
      return { status: 'error', message: 'invalid directory phase' }
    }
    const expected = directoryContentDigest(request.directorySamples)
    const paths = request.directorySamples.map(sample => sample.path)
    const matched: string[] = []
    for (const path of request.candidates.slice(0, MAX_CANDIDATES)) {
      try { if (await nodeDirectoryContentDigest(path, paths) === expected) matched.push(path) } catch { /* Ignore unreadable directories. */ }
    }
    if (matched.length === 0) return { status: 'not-found' }
    if (matched.length === 1) return { status: 'found', path: matched[0] }
    return { status: 'choose', candidates: matched }
  }

  if (!Number.isSafeInteger(request.file.size) || request.file.size < 0) return { status: 'error', message: 'invalid dropped-file metadata' }
  if (request.phase === 'metadata') {
    const candidates = await metadataCandidates(request.file, request)
    if (candidates.length === 0) return { status: 'not-found' }
    if (candidates.length === 1) return { status: 'found', path: candidates[0].path }
    return { status: 'sample-required', candidates: candidates.map(candidate => candidate.path) }
  }
  if ((request.phase !== 'sample' && request.phase !== 'full') || request.digest === undefined || request.candidates === undefined) {
    return { status: 'error', message: 'digest phase requires candidates and digest' }
  }
  const matched = await matchingFileDigest(request.candidates, request.digest, request.phase, request.file)
  if (matched.length === 0) return { status: 'not-found' }
  if (matched.length === 1) return { status: 'found', path: matched[0] }
  if (request.phase === 'sample' && request.file.size <= SMALL_FILE_BYTES) return { status: 'choose', candidates: matched }
  if (request.phase === 'sample') return { status: 'full-required', candidates: matched }
  return { status: 'choose', candidates: matched }
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:258-300](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/client/index.ts#L258-L300)

会话绑定方案的当前全局pending/动态currentInput基线。

<details>
<summary>查看原文（43行）</summary>

```text
export function apply(ctx: ClientContext): void {
  let dragDepth = 0
  let nextId = 0
  const pending: PendingItem[] = []
  const overlay = createOverlay()
  const toast = createFileDropToast()
  const suppressToast = suppressImageFormatToast()

  const bar = createFileBar((id) => {
    const index = pending.findIndex(item => item.id === id)
    if (index !== -1) pending.splice(index, 1)
    bar.render(pending)
  }, () => {
    const input = flushPending()
    if (input !== undefined) input.submit('queue')
  })

  const addPending = (paths: readonly string[]): void => {
    for (const path of paths) {
      if (pending.some(item => item.path === path)) continue
      pending.push({ id: nextId++, name: fileNameOf(path), path })
    }
    bar.render(pending)
  }

  const flushPending = (): SessionInput | undefined => {
    if (pending.length === 0) return undefined
    const input = currentInput(ctx)
    if (input === undefined) return undefined
    const text = pending.map(item => item.path).join('\n')
    const draft = input.state.getSnapshot().draft
    input.setDraft(draft.trim() === '' ? text : `${text}\n${draft}`)
    pending.length = 0
    bar.render([])
    return input
  }

  const onDragEnter = (event: DragEvent): void => {
    if (!hasFilePayload(event)) return
    dragDepth += 1
    overlay.setActive(true)
  }
  const onDragOver = (event: DragEvent): void => {
```

</details>

**依据 4 · 源码核查**：[src/locator.ts:79-109](https://github.com/AKIRACOD/dsh-drag-and-drop/blob/c20646ad6d4ee4c4a0ef12163a074716e17a7ba5/src/locator.ts#L79-L109)

来源根与摘要请求的授权基线。

<details>
<summary>查看原文（31行）</summary>

```text
async function metadataCandidates(item: DroppedEntryMeta, request: LocateRequest): Promise<Candidate[]> {
  const current = request.currentWorkspacePath
  const workspaceRoots = [...new Set(request.workspacePaths ?? [])].filter(root => typeof root === 'string' && root !== '')
  const otherWorkspaces = workspaceRoots.filter(root => root !== current)
  const commonRoots = [join(homedir(), 'Desktop'), join(homedir(), 'Documents'), join(homedir(), 'Downloads')]

  const rootGroups = [current === undefined ? [] : [current], otherWorkspaces, commonRoots]
  const indexedPaths = await indexedSearch(item.name)
  for (const roots of rootGroups) {
    const direct = await directCandidates(item, roots)
    if (direct.length > 0) return direct
    const indexed = await validateCandidates(item, pathsInside(indexedPaths, roots))
    if (indexed.length > 0) return indexed
    const recursive = await recursiveCandidates(item, roots)
    if (recursive.length > 0) return recursive
  }
  const globalIndexed = await validateCandidates(item, indexedPaths)
  if (globalIndexed.length > 0) return globalIndexed
  return recursiveCandidates(item, await broadSearchRoots())
}

async function matchingFileDigest(candidates: readonly string[], digest: string, phase: 'sample' | 'full', file: DroppedFileMeta): Promise<string[]> {
  const matched: string[] = []
  for (const path of candidates.slice(0, MAX_CANDIDATES)) {
    try {
      const actual = phase === 'sample' ? await sampleFingerprint(path, file.size) : await fullFingerprint(path)
      if (actual === digest) matched.push(path)
    } catch { /* Unreadable candidates are not matches. */ }
  }
  return matched
}
```

</details>

#### 缺口

- 来源/会话能力与统一预算方案未实现。
  **影响**：不将预期正确性改进计入当前插件。
  **进一步探讨**：可按合成反例分别核来源一致、session一致与资源代价。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
