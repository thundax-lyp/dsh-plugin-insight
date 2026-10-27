# dock-markdown

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[64cbfd8](https://github.com/AKS1st/dock-markdown/tree/64cbfd89b2e008ca3bd2c42a8f167e46ee7b3b54)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AKS1st/dock-markdown) [![npm 30d 878](https://img.shields.io/static/v1?label=npm+30d&message=878&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dock-markdown) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dock-markdown)
<!-- END META -->

> **实现功能**：dock 体系的 Markdown Web 查看器，支持 GFM、消毒 HTML、大纲与相对资源解析/编辑切换。

> **核心亮点**：在 dock 文件域提供一体化 Markdown 阅读、大纲、相对资源与编辑切换。详见[Q01](#research-q01)。

> **风险与缺陷**：受信 Host/Origin 调用方可传任意 basePath+相对 ref，在宿主可读且≤20MiB时取回文件；路由缺文件级授权，详见[Q02](#research-q02)。

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
  - [Q01 · 查看器提供何种阅读体验？](#detail-section-11)
  - [Q02 · 资源解析 API 能读取哪些主机文件？](#detail-section-12)
  - [Q03 · 消毒后仍有哪些内容/资源边界？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH dock 工作台阅读 README/文档并跳转编辑或相对资源。

dock-editor 纯文本查看 Markdown；此包增加预览、大纲和资源解析。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| Markdown UI | 阅读/编辑 | dock 依赖 |
| resolve 路由 | 相对资源 | 任意文件读取缺口 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| dock/files/editor | 必需 | 打开、读取和编辑文档 | 无法在 dock 预览 |
| marked 与 DOMPurify | 预览必需 | Markdown 渲染与 HTML 消毒 | 无法按当前实现渲染 |
| DSH Web sessions | 相对资源路由所需 | 提供会话来源路径 | 源码可能回退 cwd，安全边界需核 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 授权 | 绑定打开文档 | 任意 basePath 拒绝 |
| 路径 | 拒绝 .. 越界 | 测试文件不可跨读 |
| UI | 相对图/链接回归 | 功能保留 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 需 dock/files/editor 及 Web sessions、marked/DOMPurify；安装与版本成本未知 | 配置插件并审查 Host resolve 路径授权/同源边界；耗时未知 | 路由风险应按受信同源调用方与宿主可读权限界定 |
| 持续使用 | Markdown 渲染和每图至多20MiB读取/base64占用内存与传输；实际峰值未知 | 用户核图片/链接与大纲，管理员监控资源和外链；工时未知 | 大文档性能及链接安全性未实测 |
| 失败恢复 | 错误资源解析/越界读取可能带来文件暴露处置与重新加载；金额未知 | 收紧路由、排查可读文件和日志、回归相对资源；耗时未知 | 实际部署授权与受影响文件范围需环境核查 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 阅读 | GFM+大纲 | 真实 UX |
| 资源解析 | 图片/内部链接 | 路径越界风险 |
| HTML 消毒 | DOMPurify | 外链/CSS 跟踪 |

> **思考**：受信 Host/Origin 调用方可传任意 basePath+相对 ref，在宿主可读且≤20MiB时取回文件；路由缺文件级授权，详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在 dock 文件域提供一体化 Markdown 阅读、大纲、相对资源与编辑切换。详见[Q01](#research-q01)。

在 dock 文件域提供一体化 Markdown 阅读、大纲、相对资源与编辑切换。详见[Q01](#research-q01)。

Host 注册 POST resolve Web 路由，Client 从 editor API 读文档并在 DOM 中解析资源；无模型工具。

<a id="detail-section-5"></a>

### 1.4 主要限制

受信 Host/Origin 调用方可传任意 basePath+相对 ref，在宿主可读且≤20MiB时取回文件；路由缺文件级授权，详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前不要在含敏感文件的 profile 中采用；先修路由文件授权和 traversal，再隔离测试功能。详见[Q02](#research-q02)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态源码显示：经 Host/Origin 约束的受信调用方可用任意 basePath/相对 ref 解析宿主进程可读且≤20MiB的文件并取回 base64；缺会话文件授权。外层授权依赖部署，未活宿主复现。

- 已检查：作者 README、包清单、源码路径 README.md、README.en.md、package.json、src/index.ts、src/client/MarkdownView.tsx、src/client/index.ts、src/client/hooks.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交 README、Host 路由及客户端渲染；未向活宿主发请求或读敏感文件。 普通安装、宿主加载及目标测试属本轮范围边界，具体机制/效果未知仍在逐题缺口保留。 父侧已接受受信调用方的条件性静态路径限制；外层授权未知，未称公网无认证。
- 下一步：隔离非敏感样例复现 traversal、修复授权后回归；Web UI 验外链与大图资源成本。

**分析版本**

- **仓库**：[AKS1st/dock-markdown](https://github.com/AKS1st/dock-markdown)
- **版本号**：0.1.2（[固定提交 64cbfd8](https://github.com/AKS1st/dock-markdown/tree/64cbfd89b2e008ca3bd2c42a8f167e46ee7b3b54)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将解析授权绑定会话中真实打开文件及允许根、禁止 traversal 并限制资源类型，可保留体验且收紧读权限；待验证。详见[Q02](#research-q02)。

隔离非敏感样例复现 traversal、修复授权后回归；Web UI 验外链与大图资源成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 4725 | 4179 | 565 | — |
| .md | source | 2 | 128 | — | — | 1374 |
| .ts | source | 5 | 849 | 495 | 281 | — |
| .tsx | source | 1 | 501 | 398 | 70 | — |
| .mjs | source | 1 | 52 | 38 | 12 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AKS1st/dock-markdown/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AKS1st/dock-markdown/issues?q=is%3Aissue+created%3A2026-09-22T07%3A05%3A54.280Z..2026-10-22T07%3A05%3A54.280Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AKS1st/dock-markdown/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A05%3A54.280Z..2026-10-22T07%3A05%3A54.280Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 Markdown 查看/相对资源解析的可用性与 /dock-markdown/resolve 任意文件读取边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 查看器提供何种阅读体验？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

客户端作为 dock-files 的 markdown 文件查看器读取 dock-editor 的 fs.read，marked 将 GFM 转 HTML，再由 DOMPurify.sanitize 后注入视图；它可构建 h1–h6 大纲、解析相对图片为 data URL、把内部链接交 workbench.openPath、切换到 dock-editor 编辑。Host /dock-markdown/resolve 按 Markdown 所在目录、git 根、session cwd 优先级解析。能证明静态实现与依赖链，实际 UI 兼容和大文档性能未测试。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-32](https://github.com/AKS1st/dock-markdown/blob/64cbfd89b2e008ca3bd2c42a8f167e46ee7b3b54/README.md#L5-L32)

作者列查看器功能和 dock 依赖。

<details>
<summary>查看原文（28行）</summary>

```text
> **DSH 生态中最好的 Markdown 查看插件 —— 没有之一。** GFM 渲染、DOMPurify 消毒、文档大纲、相对路径图片/链接解析、一键切编辑，读 README、看文档、审稿子，dock-markdown 让 Markdown 在 DSH 里第一次有了「编辑器级」体验。

dock 系列的 Markdown 查看插件：为 dock-files 文件域注册 `markdown` 文件查看器（md / markdown / mdx）与对应的编辑器区视图。通过 dock-editor 的 `/desk-editor/fs.read` 读取文件内容，用 marked + DOMPurify 渲染为消毒后的 HTML，并提供一键切换到 dock-editor 编辑。

## 效果预览

![dock-markdown Markdown 查看视图](assets/image.png)

## 功能

- **Markdown 渲染**：marked（GFM）+ DOMPurify 消毒，输出纯静态 HTML。
- **相对路径资源解析**：Markdown 中的相对图片与内部跳转链接按「Markdown 所在目录 → 当前路径所在 git 仓库根目录 → 会话工作区根目录」的优先级解析；图片以内联 data URL 展示，内部链接点击后通过工作台打开目标文件，`#锚点` 链接平滑滚动到对应标题。
- **文档大纲**：工具栏 ☰ 按钮展开/收起大纲栏，按标题层级缩进列出 h1–h6，点击跳转到对应标题，滚动时高亮当前所在章节。
- **查看器切换**：工具栏按钮一键在「查看」与「编辑」（dock-editor）之间切换。
- **主题适配**：排版样式使用 DSH 主题 token，跟随亮/暗主题。
- **代码块 / 表格 / 引用**等常用 GFM 元素均有排版样式。

## 依赖

| 依赖 | 类型 | 说明 |
| --- | --- | --- |
| [dock](https://github.com/AKS1st/dock) >= 0.1.0 | peer（必需） | 工作台外壳：编辑器区视图、浮窗、`ctx.workbench` 由它提供 |
| [dock-files](https://github.com/AKS1st/dock-files) >= 0.1.0 | peer（必需） | 文件域服务：dock-markdown 作为 `markdown` 查看器被分发打开 |
| [dock-editor](https://github.com/AKS1st/dock-editor) >= 0.1.0 | peer（必需） | 提供 `/desk-editor/fs.read` 读取文件内容，以及「一键切编辑」的目标编辑器视图 |
| DSH Web 环境 | 运行时 | 必需，客户端平台为 Web |
| `cordis` ^4.0.0-rc.7 | peer | 插件框架（DSH 自带） |
| `react` ^18.2.0 | peer（可选） | 客户端渲染需要；未提供时查看器 UI 不激活 |
| `marked` / `dompurify` | 内置（构建打包） | GFM 渲染与消毒，随插件打包，无需单独安装 |
```

</details>

**依据 2 · 源码核查**：[src/client/MarkdownView.tsx:229-273](https://github.com/AKS1st/dock-markdown/blob/64cbfd89b2e008ca3bd2c42a8f167e46ee7b3b54/src/client/MarkdownView.tsx#L229-L273)

marked/DOMPurify 和大纲。

<details>
<summary>查看原文（45行）</summary>

```text
  // Render Markdown → sanitized HTML once the content is available.
  useEffect(() => {
    if (content === null || binary) {
      setHtml(null)
      return
    }
    try {
      const raw = marked.parse(content, { async: false, gfm: true, breaks: true }) as string
      setHtml(DOMPurify.sanitize(raw))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
      setHtml(null)
    }
  }, [content, binary])

  // Resolve relative image/link references through the host and rebuild the
  // display HTML. Runs once per document plus once per resolution arrival.
  useEffect(() => {
    if (html === null || path === undefined) {
      setDisplayHtml(null)
      setOutline([])
      return
    }
    const docKey = `${path}\u0000${sessionId ?? ''}`
    if (docKeyRef.current !== docKey) {
      // A different file: drop the previous document's resolution state.
      docKeyRef.current = docKey
      requestedRef.current.clear()
      setResolutions({})
      setOutline([])
      setActiveHeading(null)
    }

    const doc = new DOMParser().parseFromString(`<div class="dock-md">${html}</div>`, 'text/html')

    // Heading ids so `#anchor` links / outline items can scroll; collect the
    // outline entries once per document (html does not change when image
    // resolutions arrive).
    const slugger = makeSlugger()
    const items: OutlineItem[] = []
    for (const heading of doc.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
      const id = slugger(heading.textContent ?? '')
      heading.id = id
      items.push({ id, depth: Number(heading.tagName.slice(1)), text: (heading.textContent ?? '').trim() })
    }
```

</details>

**依据 3 · 源码核查**：[src/client/MarkdownView.tsx:279-368](https://github.com/AKS1st/dock-markdown/blob/64cbfd89b2e008ca3bd2c42a8f167e46ee7b3b54/src/client/MarkdownView.tsx#L279-L368)

相对资源请求与 HTML 属性改写。

<details>
<summary>查看原文（90行）</summary>

```text
    // Collect the relative references used by images and internal links.
    // A link target like `docs/a.md#section` resolves `docs/a.md` (the
    // fragment only matters inside the target document, which opens at top).
    const refs = new Set<string>()
    for (const img of doc.querySelectorAll('img[src]')) {
      const src = img.getAttribute('src')
      if (src !== null && isRelativeRef(src)) refs.add(src)
    }
    for (const anchor of doc.querySelectorAll('a[href]')) {
      const href = anchor.getAttribute('href')
      if (href !== null && isRelativeRef(href)) {
        const at = href.indexOf('#')
        refs.add(at === -1 ? href : href.slice(0, at))
      }
    }

    // Ask the host to resolve each new reference (first match wins:
    // Markdown dir → git repo root → workspace root).
    for (const ref of refs) {
      if (requestedRef.current.has(ref)) continue
      requestedRef.current.add(ref)
      const kind = refKindOf(ref)
      void (async () => {
        const apply = (resolution: Resolution): void => {
          setResolutions((previous) => ({ ...previous, [ref]: resolution }))
        }
        try {
          const response = await fetch('/dock-markdown/resolve', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ sessionId, basePath: path, ref, kind }),
          })
          const json = (await response.json()) as ResolveResponse
          // A stale response for a previously open file must not leak in.
          if (docKeyRef.current !== docKey) return
          if (json.ok !== true || json.value === undefined) {
            throw new Error(json.error?.message ?? 'resolve failed')
          }
          const value = json.value
          if (!value.found) {
            apply({ status: 'missing' })
          } else if (value.kind === 'image' && value.dataUrl !== undefined) {
            apply({ status: 'ok', kind: 'image', dataUrl: value.dataUrl, mime: value.mime ?? '', size: value.size ?? 0 })
          } else if (value.kind === 'image' && value.tooLarge === true) {
            apply({ status: 'ok', kind: 'image', tooLarge: true, size: value.size ?? 0 })
          } else if (value.kind === 'link' && value.path !== undefined) {
            apply({ status: 'ok', kind: 'link', path: value.path })
          } else {
            apply({ status: 'missing' })
          }
        } catch {
          if (docKeyRef.current !== docKey) return
          apply({ status: 'missing' })
        }
      })()
    }

    // Rewrite attributes from the current resolution state, then serialize.
    for (const img of doc.querySelectorAll('img[src]')) {
      const src = img.getAttribute('src')
      if (src === null || !isRelativeRef(src)) continue
      const resolution = resolutions[src]
      if (resolution?.status === 'ok' && resolution.kind === 'image' && resolution.dataUrl !== undefined) {
        img.setAttribute('src', resolution.dataUrl)
      } else {
        img.setAttribute('src', PLACEHOLDER_SRC)
      }
      if (resolution?.status === 'ok' && resolution.kind === 'image' && resolution.tooLarge === true) {
        img.setAttribute('title', `image too large (${resolution.size} bytes, over the 20 MiB limit)`)
      }
    }
    for (const anchor of doc.querySelectorAll('a[href]')) {
      const href = anchor.getAttribute('href')
      if (href === null) continue
      if (href.startsWith('#')) {
        anchor.setAttribute('data-md-anchor', href.slice(1))
        continue
      }
      if (!isRelativeRef(href)) continue
      anchor.setAttribute('data-md-rel', href)
      const at = href.indexOf('#')
      const ref = at === -1 ? href : href.slice(0, at)
      const resolution = resolutions[ref]
      if (resolution?.status === 'ok' && resolution.kind === 'link') {
        anchor.setAttribute('data-md-path', resolution.path)
      }
    }

    setDisplayHtml(doc.body.innerHTML)
  }, [html, resolutions, path, sessionId])
```

</details>

**依据 4 · 源码核查**：[src/index.ts:231-255](https://github.com/AKS1st/dock-markdown/blob/64cbfd89b2e008ca3bd2c42a8f167e46ee7b3b54/src/index.ts#L231-L255)

路径候选顺序。

<details>
<summary>查看原文（25行）</summary>

```text
/**
 * The candidate absolute paths for a relative ref, in priority order:
 * Markdown dir → git repo root of the Markdown file → session workspace
 * root. Each base also tries the URL-decoded spelling of the ref; duplicate
 * candidates are dropped.
 */
async function resolveCandidates(cwd: string, baseFile: string, ref: string): Promise<string[]> {
  const bases = [dirname(baseFile)]
  const repoRoot = await gitRootOf(dirname(baseFile))
  if (repoRoot !== null) bases.push(repoRoot)
  bases.push(cwd)
  const candidates: string[] = []
  const seen = new Set<string>()
  const spellings = decodedRefOf(ref) === ref ? [ref] : [ref, decodedRefOf(ref)]
  for (const base of bases) {
    for (const spelling of spellings) {
      const candidate = resolve(base, spelling)
      if (!seen.has(candidate)) {
        seen.add(candidate)
        candidates.push(candidate)
      }
    }
  }
  return candidates
}
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 资源解析 API 能读取哪些主机文件？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

/dock-markdown/resolve 接受请求体中的任意绝对 basePath 和相对 ref；isValidRef 拒绝绝对路径与 URL scheme，却不拒绝 .. 路径段，resolveCandidates 又直接 path.resolve(base, ref)，不验证候选仍位于 Markdown 目录、git 根或 session cwd。kind=image 时对存在、宿主进程可读且 ≤20 MiB 的文件 readFile 并返回 base64 dataUrl，mime 只按扩展推断；basePath 也没有核对确为当前打开的 Markdown。Host/Origin 检查约束请求来源为受信 Web 源，但本路由未授权到会话已打开文件；部署外层授权未知。因此受信同源页面中的脚本或可操控调用方在宿主可读和大小上限内可构造路径读取工作区外文件；这是源码级数据暴露风险，尚未用活宿主复现。应在服务端限定授权路径、验证 basePath 与会话/已打开文件关系，并禁止 traversal。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:95-111](https://github.com/AKS1st/dock-markdown/blob/64cbfd89b2e008ca3bd2c42a8f167e46ee7b3b54/src/index.ts#L95-L111)

绝对 basePath 无工作区 containment。

<details>
<summary>查看原文（17行）</summary>

```text
function requireAbsolute(path: string): string {
  if (!path.startsWith('/') && !/^[A-Za-z]:[\\/]/.test(path)) {
    throw new WbError('fs-error', `"${path}" is not an absolute path`, 400)
  }
  return path
}

/**
 * Resolve a caller-supplied absolute path for READING: no workspace
 * containment — Markdown files can live anywhere on the host (the
 * conversation context may mention paths outside the session workspace),
 * and their relative assets must be servable wherever the file lives.
 */
function resolveReadPath(raw: string): string {
  requireAbsolute(raw)
  return resolve(raw)
}
```

</details>

**依据 2 · 源码核查**：[src/index.ts:155-169](https://github.com/AKS1st/dock-markdown/blob/64cbfd89b2e008ca3bd2c42a8f167e46ee7b3b54/src/index.ts#L155-L169)

Host/Origin 来源检查。

<details>
<summary>查看原文（15行）</summary>

```text
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

**依据 3 · 源码核查**：[src/index.ts:237-265](https://github.com/AKS1st/dock-markdown/blob/64cbfd89b2e008ca3bd2c42a8f167e46ee7b3b54/src/index.ts#L237-L265)

候选 path.resolve 与 ref 验证未禁 ..。

<details>
<summary>查看原文（29行）</summary>

```text
async function resolveCandidates(cwd: string, baseFile: string, ref: string): Promise<string[]> {
  const bases = [dirname(baseFile)]
  const repoRoot = await gitRootOf(dirname(baseFile))
  if (repoRoot !== null) bases.push(repoRoot)
  bases.push(cwd)
  const candidates: string[] = []
  const seen = new Set<string>()
  const spellings = decodedRefOf(ref) === ref ? [ref] : [ref, decodedRefOf(ref)]
  for (const base of bases) {
    for (const spelling of spellings) {
      const candidate = resolve(base, spelling)
      if (!seen.has(candidate)) {
        seen.add(candidate)
        candidates.push(candidate)
      }
    }
  }
  return candidates
}

/** A relative filesystem reference from Markdown: no URL scheme, no leading
 *  '/', '\' or drive letter, no control characters. */
function isValidRef(ref: string): boolean {
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(ref)) return false
  if (ref.startsWith('/') || ref.startsWith('\\') || ref.startsWith('#') || ref.startsWith('~')) return false
  if (/^[A-Za-z]:[\\/]/.test(ref)) return false
  if (/^[A-Za-z][A-Za-z0-9+.-]*:/.test(ref)) return false
  return true
```

</details>

**依据 4 · 源码核查**：[src/index.ts:272-310](https://github.com/AKS1st/dock-markdown/blob/64cbfd89b2e008ca3bd2c42a8f167e46ee7b3b54/src/index.ts#L272-L310)

请求体/读任意匹配文件并返回 base64。

<details>
<summary>查看原文（39行）</summary>

```text
async function endpointResolve(ctx: WbContext, payload: unknown): Promise<unknown> {
  const sessionId = stringOrUndefined(payload, 'sessionId')
  const rawBase = stringOrUndefined(payload, 'basePath')
  const ref = stringOrUndefined(payload, 'ref')
  const kind = stringOrUndefined(payload, 'kind')
  if (rawBase === undefined) throw new WbError('bad-request', 'resolve requires a "basePath"')
  if (ref === undefined) throw new WbError('bad-request', 'resolve requires a "ref"')
  if (kind !== 'image' && kind !== 'link') {
    throw new WbError('bad-request', 'resolve requires kind "image" or "link"')
  }
  if (!isValidRef(ref)) throw new WbError('bad-request', `invalid relative ref "${ref}"`)

  const cwd = sessionCwdOf(ctx, sessionId)
  // The Markdown file may live anywhere on the host (reads are unconfined).
  const base = resolveReadPath(rawBase)
  const candidates = await resolveCandidates(cwd, base, ref)

  for (const candidate of candidates) {
    const target = resolve(candidate)
    const info = await stat(target).catch(() => undefined)
    if (info === undefined || !info.isFile()) continue

    if (kind === 'link') {
      return { found: true, kind: 'link', path: target }
    }
    if (info.size > IMAGE_LIMIT_BYTES) {
      return { found: true, kind: 'image', tooLarge: true, size: info.size }
    }
    const buffer = await readFile(target).catch((error) => {
      throw new WbError('fs-error', `cannot read "${target}": ${messageOf(error)}`, 400)
    })
    const mime = mimeOfPath(target)
    return {
      found: true,
      kind: 'image',
      dataUrl: `data:${mime};base64,${buffer.toString('base64')}`,
      mime,
      size: info.size,
    }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:334-340](https://github.com/AKS1st/dock-markdown/blob/64cbfd89b2e008ca3bd2c42a8f167e46ee7b3b54/src/index.ts#L334-L340)

未知 session 回退 process.cwd。

```text
function sessionCwdOf(ctx: WbContext, sessionId: string | undefined): string {
  if (sessionId !== undefined) {
    const cwd = ctx.sessions.get(sessionId)?.header.cwd
    if (cwd !== undefined && cwd !== '') return cwd
  }
  return process.cwd()
}
```

#### 缺口

- 未向运行中 DSH 发送构造请求。
  **影响**：实际部署的 Web 认证/同源脚本可达性未知。
  **进一步探讨**：隔离测试非敏感测试文件的 ../ traversal，修服务端授权后回归。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 消毒后仍有哪些内容/资源边界？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

DOMPurify 在 marked 之后调用，为 HTML 标签 XSS 提供一层过滤；随后浏览器 DOMParser 改写相对图片/链接并序列化，没有再次调用 DOMPurify。外部绝对图片 URL 不会走 Host 相对解析，可由浏览器直接请求；README 也承认默认允许 style 属性可能造成 CSS 外联追踪。内联图片单张上限 20 MiB，base64 会加大返回体和浏览器内存，重复引用/文档复杂度可能进一步增加成本。采用前应优先修复 Host 路径越界，之后在隔离环境验证 sanitize/外链策略与大图性能。

成本分期：首次使用涉及需 dock/files/editor 及 Web sessions、marked/DOMPurify；安装与版本成本未知，人工需配置插件并审查 Host resolve 路径授权/同源边界；耗时未知；持续使用涉及Markdown 渲染和每图至多20MiB读取/base64占用内存与传输；实际峰值未知，人工需用户核图片/链接与大纲，管理员监控资源和外链；工时未知；失败恢复涉及错误资源解析/越界读取可能带来文件暴露处置与重新加载；金额未知，人工需收紧路由、排查可读文件和日志、回归相对资源；耗时未知。金额、频次、实际耗时均未有同条件证据，不能填0或推算单位收益。

创新假设推导：Q02 源码允许调用方提供 basePath 与 ref，在宿主进程可读且不超过大小上限时读文件；相对当前同源路由检查，若把 basePath 绑定会话已打开文档和允许根、拒绝 .. 及符号链接逃逸，可保留相对资源而收窄可读集合。代价是授权状态同步、链接兼容与路径规范化。最小证伪：同源模拟打开一份 Markdown，再分别解析合法相对图、../越界文件和指向根外的符号链接；若合法图失效或越界仍回传 base64，假设失败。该试验仅是拟议方案，不能推断公网可调用。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/MarkdownView.tsx:229-242](https://github.com/AKS1st/dock-markdown/blob/64cbfd89b2e008ca3bd2c42a8f167e46ee7b3b54/src/client/MarkdownView.tsx#L229-L242)

marked 后 DOMPurify。

<details>
<summary>查看原文（14行）</summary>

```text
  // Render Markdown → sanitized HTML once the content is available.
  useEffect(() => {
    if (content === null || binary) {
      setHtml(null)
      return
    }
    try {
      const raw = marked.parse(content, { async: false, gfm: true, breaks: true }) as string
      setHtml(DOMPurify.sanitize(raw))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
      setHtml(null)
    }
  }, [content, binary])
```

</details>

**依据 2 · 源码核查**：[src/client/MarkdownView.tsx:279-368](https://github.com/AKS1st/dock-markdown/blob/64cbfd89b2e008ca3bd2c42a8f167e46ee7b3b54/src/client/MarkdownView.tsx#L279-L368)

只处理相对引用、后续 DOM 改写。

<details>
<summary>查看原文（90行）</summary>

```text
    // Collect the relative references used by images and internal links.
    // A link target like `docs/a.md#section` resolves `docs/a.md` (the
    // fragment only matters inside the target document, which opens at top).
    const refs = new Set<string>()
    for (const img of doc.querySelectorAll('img[src]')) {
      const src = img.getAttribute('src')
      if (src !== null && isRelativeRef(src)) refs.add(src)
    }
    for (const anchor of doc.querySelectorAll('a[href]')) {
      const href = anchor.getAttribute('href')
      if (href !== null && isRelativeRef(href)) {
        const at = href.indexOf('#')
        refs.add(at === -1 ? href : href.slice(0, at))
      }
    }

    // Ask the host to resolve each new reference (first match wins:
    // Markdown dir → git repo root → workspace root).
    for (const ref of refs) {
      if (requestedRef.current.has(ref)) continue
      requestedRef.current.add(ref)
      const kind = refKindOf(ref)
      void (async () => {
        const apply = (resolution: Resolution): void => {
          setResolutions((previous) => ({ ...previous, [ref]: resolution }))
        }
        try {
          const response = await fetch('/dock-markdown/resolve', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ sessionId, basePath: path, ref, kind }),
          })
          const json = (await response.json()) as ResolveResponse
          // A stale response for a previously open file must not leak in.
          if (docKeyRef.current !== docKey) return
          if (json.ok !== true || json.value === undefined) {
            throw new Error(json.error?.message ?? 'resolve failed')
          }
          const value = json.value
          if (!value.found) {
            apply({ status: 'missing' })
          } else if (value.kind === 'image' && value.dataUrl !== undefined) {
            apply({ status: 'ok', kind: 'image', dataUrl: value.dataUrl, mime: value.mime ?? '', size: value.size ?? 0 })
          } else if (value.kind === 'image' && value.tooLarge === true) {
            apply({ status: 'ok', kind: 'image', tooLarge: true, size: value.size ?? 0 })
          } else if (value.kind === 'link' && value.path !== undefined) {
            apply({ status: 'ok', kind: 'link', path: value.path })
          } else {
            apply({ status: 'missing' })
          }
        } catch {
          if (docKeyRef.current !== docKey) return
          apply({ status: 'missing' })
        }
      })()
    }

    // Rewrite attributes from the current resolution state, then serialize.
    for (const img of doc.querySelectorAll('img[src]')) {
      const src = img.getAttribute('src')
      if (src === null || !isRelativeRef(src)) continue
      const resolution = resolutions[src]
      if (resolution?.status === 'ok' && resolution.kind === 'image' && resolution.dataUrl !== undefined) {
        img.setAttribute('src', resolution.dataUrl)
      } else {
        img.setAttribute('src', PLACEHOLDER_SRC)
      }
      if (resolution?.status === 'ok' && resolution.kind === 'image' && resolution.tooLarge === true) {
        img.setAttribute('title', `image too large (${resolution.size} bytes, over the 20 MiB limit)`)
      }
    }
    for (const anchor of doc.querySelectorAll('a[href]')) {
      const href = anchor.getAttribute('href')
      if (href === null) continue
      if (href.startsWith('#')) {
        anchor.setAttribute('data-md-anchor', href.slice(1))
        continue
      }
      if (!isRelativeRef(href)) continue
      anchor.setAttribute('data-md-rel', href)
      const at = href.indexOf('#')
      const ref = at === -1 ? href : href.slice(0, at)
      const resolution = resolutions[ref]
      if (resolution?.status === 'ok' && resolution.kind === 'link') {
        anchor.setAttribute('data-md-path', resolution.path)
      }
    }

    setDisplayHtml(doc.body.innerHTML)
  }, [html, resolutions, path, sessionId])
```

</details>

**依据 3 · 源码核查**：[src/index.ts:173-191](https://github.com/AKS1st/dock-markdown/blob/64cbfd89b2e008ca3bd2c42a8f167e46ee7b3b54/src/index.ts#L173-L191)

20 MiB 图片限制与 MIME 推断。

<details>
<summary>查看原文（19行）</summary>

```text
/** Cap for a single image read (same as dock-images): 20 MiB keeps the data URL reasonable. */
const IMAGE_LIMIT_BYTES = 20 * 1024 * 1024

/** MIME type inferred from the file extension (lowercased, no dot). */
function mimeOfPath(path: string): string {
  const at = path.lastIndexOf('.')
  if (at === -1) return 'application/octet-stream'
  const ext = path.slice(at + 1).toLowerCase()
  switch (ext) {
    case 'png': return 'image/png'
    case 'jpg':
    case 'jpeg': return 'image/jpeg'
    case 'gif': return 'image/gif'
    case 'webp': return 'image/webp'
    case 'bmp': return 'image/bmp'
    case 'svg': return 'image/svg+xml'
    case 'ico': return 'image/x-icon'
    case 'avif': return 'image/avif'
    default: return 'application/octet-stream'
```

</details>

**依据 4 · 作者声明**：[README.md:56-60](https://github.com/AKS1st/dock-markdown/blob/64cbfd89b2e008ca3bd2c42a8f167e46ee7b3b54/README.md#L56-L60)

作者承认 style/非工作区访问取舍。

```text
## 安全

`marked` 输出的原始 HTML 一律经 `DOMPurify.sanitize()`（默认白名单）消毒后才写入 DOM，`dangerouslySetInnerHTML` 只用于消毒后的结果。已知取舍：DOMPurify 默认允许 `style` 属性，恶意 Markdown 理论上可用 CSS 做外联跟踪——如需更严格可加 `FORBID_ATTR: ['style']`。

相对路径资源不受会话工作区限制：Markdown 文件可能位于主机的任何位置（对话上下文可提及工作区外的文件，如 `~/.dsh/skills/...`），其相对图片 / 内部链接按「Markdown 所在目录 → git 仓库根目录 → 会话工作区根目录」优先级解析，只要候选是存在的文件即可读取。
```

#### 缺口

- 未用恶意 Markdown 或大图在目标 UI 测试。
  **影响**：浏览器加载外链/CSS 与内存表现未知。
  **进一步探讨**：隔离构造外链、样式和大图检查网络/CSP/内存。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
