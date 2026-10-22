# dock-images

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[b98f391](https://github.com/AKS1st/dock-images/tree/b98f3910c59af6f30c742b0ddc001315c2c176ee)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock-images) [![npm 30d 1,028](https://img.shields.io/static/v1?label=npm+30d&message=1%2C028&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-images) [![最新发布 2026-09-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-images)
<!-- END META -->

> **实现功能**：在dock工作台打开本地图片，整文件经Host转base64给浏览器img显示，支持缩放/旋转/拖动。

> **核心亮点**：把成熟图片解码和视图操作接入dock，减少切应用；非新图像技术或通用文件授权。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：Host不限制图片类型/工作区，fence通过可取进程可读绝对文件；stat/read分离和像素/解码错误缺口使体积cap不足。详见[Q02](#research-q02)。

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
  - [Q01 · 适合谁，文件域到图像查看主链是什么？](#detail-section-11)
  - [Q02 · 贡献和读取授权/资源缺陷是什么？](#detail-section-12)
  - [Q03 · 依赖、隐私和读者步骤是什么？](#detail-section-13)
  - [Q04 · 三阶段成本效果如何比较？](#detail-section-14)
  - [Q05 · 工程价值、受限读取收据假设和采用建议？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已用dock/files的用户内嵌看授权图片，不编辑原图。

系统/浏览器图片查看器可替代；dock减少切换，也引入HTTP文件授权、base64和多窗口资源。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 文件派发 | 图片扩展名到image视图 | 只Client过滤，Host未知类型也读 |
| 读取 | 绝对路径/base64 | 不限工作区，20MiB预检非像素预算 |
| 查看变换 | 缩放/旋转/拖动 | 只显示不改文件，缺解码错误 |
| SVG | img dataURL | 不innerHTML但非通用净化/隔离 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web webServer/sessions/webRuntime | Host必需 | 文件read POST | sessions cwd只是回传元数据，不限读路径 |
| dock-base workbench及dock-files files | Client必需 | 注册image查看器/视图 | package标可选不等功能可缺；缺服务不激活 |
| React/匹配浏览器图片解码 | 必需 | 图像/缩放/拖动 | 格式声明不保证所有浏览器可解码 |
| 进程本地读取权限/明确文件授权 | 必需 | 原生readFile | 可读绝对路径不限工作区/图片类型 |
| 受信宿主访问与资源预算 | 必需 | 防不当读取/大图 | fence非身份认证，20MiB非像素预算 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定三件dock组件和宿主，核HTTP可见范围 | 先无敏感小图片，目标路径明确 |
| 打开 | 经文件域选择已授权图片 | 核图片内容/目标，读取成功非解码成功 |
| 查看 | 缩放/旋转/拖动只是显示变换 | 不写原图，不据格式名假定安全 |
| 恢复 | 关闭失败/资源过大的视图 | 解码失败缺UI回执，先核文件/浏览器再重开 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | dock组件/兼容Web，金额未知 | 版本/读取授权和网络范围核对 | 独立系统查看器可替代 |
| 持续使用 | 整文件Buffer/base64/JSON/浏览器解码 | 选择图片、管理窗口 | base64膨胀约4/3且还有解码像素，多窗口累加 |
| 失败恢复 | 网络/解码重复及资源回收 | 核错误、关闭/重开 | cancelled只丢迟到结果不取消请求/Host读取 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 内嵌看图 | 文件域/视图注册和img dataURL | 真实版本渲染/格式解码兼容 |
| 不改原图 | CSS变换/原生只读 | 不等受限文件授权 |
| SVG路径 | img src非innerHTML | 浏览器/源文件全部内容风险与资源 |

> **思考**：Host不限制图片类型/工作区，fence通过可取进程可读绝对文件；stat/read分离和像素/解码错误缺口使体积cap不足。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把成熟图片解码和视图操作接入dock，减少切应用；非新图像技术或通用文件授权。详见[Q01](#research-q01)与[Q02](#research-q02)。

把成熟图片解码和视图操作接入dock，减少切应用；非新图像技术或通用文件授权。详见[Q01](#research-q01)与[Q02](#research-q02)。

effect登记Host路由和Client文件域/视图可统一清理；动态标题按React文本渲染，SVG仅img路径、缩放clamp、路径变化丢迟到避免常见串图，均可复用。绝对路径宽读和像素未限是独立边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

Host不限制图片类型/工作区，fence通过可取进程可读绝对文件；stat/read分离和像素/解码错误缺口使体积cap不足。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，核原始API文件授权/非图片拒绝和资源/解码状态后再评估小图试用。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持dock内图片派发、整文件显示与视图变换；Host宽绝对路径读取、stat/read竞态和像素/解码状态限制授权与资源保证。特定文件能力及读取/解码收据尚未验证。

- 已检查：作者 README、包清单、源码路径 src/client/index.ts、src/index.ts、src/client/ImageView.tsx、package.json、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定Host及Client注册/ImageView完整读取，覆盖fence/路径/MIME/资源/状态；未对照全部发布制品或上游file授权实现，不运行目标。
- 下一步：进一步探讨先用非图片/链接/替换/大像素/慢读/清路径/迟到夹具核API与显示收据，再比较资源和查看人时。

**分析版本**

- **仓库**：[AKS1st/dock-images](https://github.com/AKS1st/dock-images)
- **版本号**：0.1.3（[固定提交 b98f391](https://github.com/AKS1st/dock-images/tree/b98f3910c59af6f30c742b0ddc001315c2c176ee)）
- **版本日期**：2026-09-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨特定文件能力/同句柄字节与像素限制及解码状态收据，授权/格式解析成本未验证。详见[Q05](#research-q05)。

进一步探讨先用非图片/链接/替换/大像素/慢读/清路径/迟到夹具核API与显示收据，再比较资源和查看人时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 494 | 464 | 32 | — |
| .md | source | 2 | 116 | — | — | 901 |
| .ts | source | 3 | 645 | 384 | 204 | — |
| .tsx | source | 1 | 140 | 125 | 0 | — |
| .mjs | source | 1 | 46 | 38 | 6 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dock-images/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dock-images/issues?q=is%3Aissue+created%3A2026-09-22T07%3A29%3A41.447Z..2026-10-22T07%3A29%3A41.447Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dock-images/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A29%3A41.447Z..2026-10-22T07%3A29%3A41.447Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核dock图像读取/显示，区分Client格式派发与Host实际文件权限、字节/像素预算和解码收据。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适合谁，文件域到图像查看主链是什么？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向已用dock文件工作台、希望不用切应用查看本地图片的人。输入open seed绝对path/title与sessionId，输出img视图和缩放/旋转/拖动。合格结果应看见正确授权图并明确错误、资源可控；不会编辑/保存图片，显示成功也不证明其他查看器效果最佳。

Client硬等workbench/files，注册image扩展名和编辑器视图。ImageView POST /dock-images/read，Host先请求头fence/POST/方法，取绝对路径resolve，stat小于20MiB后整文件read/base64和按扩展名MIME回传。Client造dataURL给img src，CSS transform控制视图，路径变化重置并丢弃迟到旧请求。SVG不innerHTML是具体实现，不是通用SVG净化器。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:17-35](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/client/index.ts#L17-L35)

硬服务。

<details>
<summary>查看原文（19行）</summary>

```text
export const inject = ['workbench', 'files']

/** Local structural face of ctx.files (avoid type dependency on dock-files). */
interface FilesService {
  registerFileViewer(def: {
    id: string
    exts?: string[]
    default?: boolean
    icon?: { color?: string; path?: string; viewBox?: string }
  }): () => void
}

/** Client plugin body. */
export function apply(ctx: WorkbenchContext): void {
  const workbench = ctx.get<WorkbenchService>('workbench')
  const files = ctx.get<FilesService>('files')
  // inject guarantees both services are present when this applies; guard
  // anyway so a broken runtime degrades instead of throwing.
  if (workbench === undefined || files === undefined) return
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:47-66](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/client/index.ts#L47-L66)

文件域/视图注册。

<details>
<summary>查看原文（20行）</summary>

```text
  ctx.effect(() => files.registerFileViewer({
    id: 'image',
    exts: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'ico', 'avif'],
    icon: {
      color: '#a074c4',
      viewBox: '0 0 16 16',
      path: 'M5.20 2.40h5.60a2.8 2.8 0 0 1 2.8 2.8v5.60a2.8 2.8 0 0 1 -2.8 2.8h-5.60a2.8 2.8 0 0 1 -2.8 -2.8v-5.60a2.8 2.8 0 0 1 2.8 -2.8zM5.80 4.00h4.40a1.8 1.8 0 0 1 1.8 1.8v4.40a1.8 1.8 0 0 1 -1.8 1.8h-4.40a1.8 1.8 0 0 1 -1.8 -1.8v-4.40a1.8 1.8 0 0 1 1.8 -1.8zM10.3 4.4a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8zM4.3 11.9L6.7 8l1.5 1.8 1-1.2 2.8 3.3z',
    },
  }), 'dock-images: file viewer')

  // The view that receives open seeds ({ path, title }). It stays registered
  // as an editor-area view because floating windows resolve their view
  // through this registry; opening itself is always floating (dock-files
  // dispatches { mode: 'floating' }).
  ctx.effect(() => workbench.registerEditorView({
    id: 'image',
    title: 'Image',
    order: 120,
    component: ImageView,
  }), 'dock-images: view')
```

</details>

**依据 3 · 源码核查**：[src/index.ts:225-256](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/index.ts#L225-L256)

Host读取主链。

<details>
<summary>查看原文（32行）</summary>

```text
export function apply(ctx: WbContext): void {
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: '/dock-images',
    handler: async (req, res) => {
      if (!isTrustedRequest(req, ctx.webRuntime.trustedHosts)) {
        writeJson(res, 403, { ok: false, error: { code: 'forbidden', message: 'forbidden' } })
        return
      }
      if (req.method !== 'POST') {
        writeJson(res, 405, { ok: false, error: { code: 'bad-request', message: 'method not allowed' } })
        return
      }
      const pathname = new URL(req.url ?? '/', 'http://dsh.internal').pathname
      const method = pathname.startsWith('/dock-images/') ? pathname.slice('/dock-images/'.length) : undefined
      if (method === undefined || method.includes('/')) {
        writeError(res, new WbError('not-found', `unknown /dock-images method "${method}"`, 404))
        return
      }
      try {
        const payload = await readJsonBody(req)
        if (method === 'read') {
          const sessionId = stringOrUndefined(payload, 'sessionId')
          const raw = stringOrUndefined(payload, 'path')
          if (raw === undefined) {
            writeError(res, new WbError('bad-request', 'read requires a "path"', 400))
            return
          }
          const cwd = sessionCwdOf(ctx, sessionId)
          const path = resolveReadPath(raw)
          const image = await readImageBase64(path)
          writeOk(res, { image, cwd })
```

</details>

**依据 4 · 源码核查**：[src/index.ts:123-141](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/index.ts#L123-L141)

stat/read/base64。

<details>
<summary>查看原文（19行）</summary>

```text
/** Whole-file read as base64; rejects files over the size cap up front. */
async function readImageBase64(path: string): Promise<{
  content: string
  mime: string
  size: number
}> {
  const info = await stat(path).catch((error) => {
    throw new WbError('fs-error', `cannot read "${path}": ${messageOf(error)}`, 400)
  })
  if (info.isDirectory()) {
    throw new WbError('fs-error', `"${path}" is a directory`, 400)
  }
  if (info.size > IMAGE_LIMIT_BYTES) {
    throw new WbError('too-large', `"${path}" is ${info.size} bytes, over the ${IMAGE_LIMIT_BYTES}-byte image limit`, 413)
  }
  const buffer = await readFile(path).catch((error) => {
    throw new WbError('fs-error', `cannot read "${path}": ${messageOf(error)}`, 400)
  })
  return { content: buffer.toString('base64'), mime: mimeOfPath(path), size: info.size }
```

</details>

**依据 5 · 源码核查**：[src/client/ImageView.tsx:53-84](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/client/ImageView.tsx#L53-L84)

请求/变换。

<details>
<summary>查看原文（32行）</summary>

```text
  useEffect(() => {
    setTransform(INITIAL_TRANSFORM)
    setDragging(false)
    if (path === undefined) return
    let cancelled = false
    setDataUrl(null)
    setSize(0)
    setError(null)
    void (async () => {
      try {
        const response = await fetch('/dock-images/read', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sessionId, path }),
        })
        const json = (await response.json()) as ReadResponse
        if (json.ok !== true || json.value === undefined) throw new Error(json.error?.message ?? 'read failed')
        if (cancelled) return
        const image = json.value.image
        setDataUrl(`data:${image.mime};base64,${image.content}`)
        setSize(image.size)
      } catch (cause) {
        if (cancelled) return
        setError(cause instanceof Error ? cause.message : String(cause))
      }
    })()
    return () => { cancelled = true }
  }, [path, sessionId])

  const zoom = (factor: number) => setTransform((current) => ({ ...current, scale: clampScale(current.scale * factor) }))
  const rotate = (degrees: number) => setTransform((current) => ({ ...current, rotation: current.rotation + degrees }))
  const reset = () => setTransform(INITIAL_TRANSFORM)
```

</details>

**依据 6 · 源码核查**：[src/client/ImageView.tsx:129-137](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/client/ImageView.tsx#L129-L137)

img渲染。

```text
        : createElement('div', {
          style: INLINE.stage,
          onWheel,
          onPointerDown,
          onPointerMove,
          onPointerUp: stopDragging,
          onPointerCancel: stopDragging,
        },
        createElement('img', { style: imageStyle, src: dataUrl, alt: title, draggable: false }),
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 贡献和读取授权/资源缺陷是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

增量在dock文件域里直接浮窗看图，并复用宿主主题/生命周期；成熟浏览器解码与变换不是新图像技术。README最佳/终极为作者自评，无对照依据。

Host明确设计不限工作区，sessionCwd只回传，不参与文件授权。更重要的是服务端根本不要求图片扩展名/魔数，未知后缀MIME octet-stream也base64返回；因此fence通过的调用者可请求进程能读、非目录且预检<=20MiB的任意绝对文件，UI扩展名过滤不限制原始HTTP能力。Host/Origin/header fence减跨站风险，非远端身份或逐文件授权，外层认证范围未知。stat跟随链接，resolve不realpath围栏；不能称工作区隔离，这一宽范围应明确给读者。

20MiB检查在stat和readFile分离，文件变大/被替换时未在同一受控句柄限制实际读字节，size还用旧stat。只拒目录未拒其他特殊文件，可能阻塞；压缩体积不限制像素/动画解码内存。Client没有img onError/onLoad状态，HTTP成功但格式/内容解码失败无明确错误；取消只布尔标记不AbortController，Host无读timeout。path变undefined先return在清旧dataURL前，也可能残留旧图而title无目标。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:78-93](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/index.ts#L78-L93)

任意绝对路径。

<details>
<summary>查看原文（16行）</summary>

```text
function requireAbsolute(path: string): string {
  if (!path.startsWith('/') && !/^[A-Za-z]:[\\/]/.test(path)) {
    throw new WbError('fs-error', `"${path}" is not an absolute path`, 400)
  }
  return path
}

/**
 * Resolve a caller-supplied absolute path for READING: no workspace
 * containment — viewers open images anywhere on the host, because the
 * conversation context can mention paths outside the session workspace.
 */
function resolveReadPath(raw: string): string {
  requireAbsolute(raw)
  return resolve(raw)
}
```

</details>

**依据 2 · 源码核查**：[src/index.ts:104-141](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/index.ts#L104-L141)

未知MIME/原生读取限制。

<details>
<summary>查看原文（38行）</summary>

```text
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
  }
}

/** Whole-file read as base64; rejects files over the size cap up front. */
async function readImageBase64(path: string): Promise<{
  content: string
  mime: string
  size: number
}> {
  const info = await stat(path).catch((error) => {
    throw new WbError('fs-error', `cannot read "${path}": ${messageOf(error)}`, 400)
  })
  if (info.isDirectory()) {
    throw new WbError('fs-error', `"${path}" is a directory`, 400)
  }
  if (info.size > IMAGE_LIMIT_BYTES) {
    throw new WbError('too-large', `"${path}" is ${info.size} bytes, over the ${IMAGE_LIMIT_BYTES}-byte image limit`, 413)
  }
  const buffer = await readFile(path).catch((error) => {
    throw new WbError('fs-error', `cannot read "${path}": ${messageOf(error)}`, 400)
  })
  return { content: buffer.toString('base64'), mime: mimeOfPath(path), size: info.size }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:247-256](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/index.ts#L247-L256)

cwd不约束读。

<details>
<summary>查看原文（10行）</summary>

```text
          const sessionId = stringOrUndefined(payload, 'sessionId')
          const raw = stringOrUndefined(payload, 'path')
          if (raw === undefined) {
            writeError(res, new WbError('bad-request', 'read requires a "path"', 400))
            return
          }
          const cwd = sessionCwdOf(ctx, sessionId)
          const path = resolveReadPath(raw)
          const image = await readImageBase64(path)
          writeOk(res, { image, cwd })
```

</details>

**依据 4 · 源码核查**：[src/index.ts:182-195](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/index.ts#L182-L195)

header围栏。

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[src/client/index.ts:47-49](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/client/index.ts#L47-L49)

仅Client扩展名过滤。

```text
  ctx.effect(() => files.registerFileViewer({
    id: 'image',
    exts: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'ico', 'avif'],
```

**依据 6 · 源码核查**：[src/client/ImageView.tsx:53-79](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/client/ImageView.tsx#L53-L79)

取消/undefined路径。

<details>
<summary>查看原文（27行）</summary>

```text
  useEffect(() => {
    setTransform(INITIAL_TRANSFORM)
    setDragging(false)
    if (path === undefined) return
    let cancelled = false
    setDataUrl(null)
    setSize(0)
    setError(null)
    void (async () => {
      try {
        const response = await fetch('/dock-images/read', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sessionId, path }),
        })
        const json = (await response.json()) as ReadResponse
        if (json.ok !== true || json.value === undefined) throw new Error(json.error?.message ?? 'read failed')
        if (cancelled) return
        const image = json.value.image
        setDataUrl(`data:${image.mime};base64,${image.content}`)
        setSize(image.size)
      } catch (cause) {
        if (cancelled) return
        setError(cause instanceof Error ? cause.message : String(cause))
      }
    })()
    return () => { cancelled = true }
```

</details>

**依据 7 · 源码核查**：[src/client/ImageView.tsx:125-137](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/client/ImageView.tsx#L125-L137)

无img解码错误处理。

<details>
<summary>查看原文（13行）</summary>

```text
    error !== null
      ? createElement('div', { style: INLINE.err }, error)
      : dataUrl === null
        ? createElement('div', { style: INLINE.empty }, 'Reading…')
        : createElement('div', {
          style: INLINE.stage,
          onWheel,
          onPointerDown,
          onPointerMove,
          onPointerUp: stopDragging,
          onPointerCancel: stopDragging,
        },
        createElement('img', { style: imageStyle, src: dataUrl, alt: title, draggable: false }),
```

</details>

#### 缺口

- 宿主外层认证/访问可达性与本地文件逐项授权未由组件证明。
  **影响**：宽绝对路径API不能只按图片查看器理解风险。
  **进一步探讨**：可固定Host认证/部署和授权文件范围，核原始POST及不相关文件拒绝，不只看UI。
- 大像素/特殊文件、stat读取变化与浏览器解码资源上界未知。
  **影响**：20MiB不能保证内存或延迟可控。
  **进一步探讨**：可先同句柄字节读取/regular-file/像素预算设计，再用无敏感受控样本研究。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、隐私和读者步骤是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

包dock-images0.1.3/Node>=20，peer声明dock-base>=0.2、dock-files>=0.1和React，虽标optional但Client硬注入workbench/files，实际看图不能缺。Host用Node原生fs，浏览器拿到全部base64，与直接在本机系统查看器不同，会经宿主HTTP传到客户端；远程Web会把文件内容交远端浏览器。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web webServer/sessions/webRuntime | Host必需 | 文件read POST | sessions cwd只是回传元数据，不限读路径 |
| dock-base workbench及dock-files files | Client必需 | 注册image查看器/视图 | package标可选不等功能可缺；缺服务不激活 |
| React/匹配浏览器图片解码 | 必需 | 图像/缩放/拖动 | 格式声明不保证所有浏览器可解码 |
| 进程本地读取权限/明确文件授权 | 必需 | 原生readFile | 可读绝对路径不限工作区/图片类型 |
| 受信宿主访问与资源预算 | 必需 | 防不当读取/大图 | fence非身份认证，20MiB非像素预算 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定三件dock组件和宿主，核HTTP可见范围 | 先无敏感小图片，目标路径明确 |
| 打开 | 经文件域选择已授权图片 | 核图片内容/目标，读取成功非解码成功 |
| 查看 | 缩放/旋转/拖动只是显示变换 | 不写原图，不据格式名假定安全 |
| 恢复 | 关闭失败/资源过大的视图 | 解码失败缺UI回执，先核文件/浏览器再重开 |

查看器不调用模型/上传第三方API，但访问控制和客户端位置决定谁拿到图像。README允许工作区外图片是明确取舍，不能推论为允许任意敏感文件读取。源码分析src，未独立对照所有发布lib字节。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-4](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/package.json#L1-L4)

版本。

```text
{
  "name": "dock-images",
  "version": "0.1.3",
  "description": "Image viewer for the dock file explorer: renders PNG, JPEG, GIF, WebP, BMP, SVG, ICO and AVIF files.",
```

**依据 2 · 源码核查**：[src/index.ts:12-19](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/index.ts#L12-L19)

原生fs和硬服务。

```text
import { readFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'node:http'

export const name = 'dock-images'

/** Services required before mounting. */
export const inject = ['webServer', 'sessions', 'webRuntime']
```

**依据 3 · 源码核查**：[src/client/index.ts:17-35](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/client/index.ts#L17-L35)

实际Client依赖。

<details>
<summary>查看原文（19行）</summary>

```text
export const inject = ['workbench', 'files']

/** Local structural face of ctx.files (avoid type dependency on dock-files). */
interface FilesService {
  registerFileViewer(def: {
    id: string
    exts?: string[]
    default?: boolean
    icon?: { color?: string; path?: string; viewBox?: string }
  }): () => void
}

/** Client plugin body. */
export function apply(ctx: WorkbenchContext): void {
  const workbench = ctx.get<WorkbenchService>('workbench')
  const files = ctx.get<FilesService>('files')
  // inject guarantees both services are present when this applies; guard
  // anyway so a broken runtime degrades instead of throwing.
  if (workbench === undefined || files === undefined) return
```

</details>

**依据 4 · 源码核查**：[src/client/ImageView.tsx:63-73](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/client/ImageView.tsx#L63-L73)

HTTP全内容到浏览器。

<details>
<summary>查看原文（11行）</summary>

```text
        const response = await fetch('/dock-images/read', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sessionId, path }),
        })
        const json = (await response.json()) as ReadResponse
        if (json.ok !== true || json.value === undefined) throw new Error(json.error?.message ?? 'read failed')
        if (cancelled) return
        const image = json.value.image
        setDataUrl(`data:${image.mime};base64,${image.content}`)
        setSize(image.size)
```

</details>

**依据 5 · 作者声明**：[README.md:54-54](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/README.md#L54-L54)

作者读路径范围。

```text
`/dock-images` 路由只接受受信任来源（回环地址 / trustedHosts + 同源检查）的 POST；读取路径只要求是绝对路径、不限定会话工作区——对话上下文可能提及工作区外的图片（如 `~/.dsh/skills/...`），查看器可打开它们查看。
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 三阶段成本效果如何比较？

**研究主题**：效果与总成本

#### 完整回答

本地文件整读+base64+JSON+浏览器dataURL后解码，文本传输约原字节4/3而内存还含原Buffer/字符串/像素与多窗口副本。20MiB输入cap降低单次常见体积但不是全过程内存/总并发限制。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | dock组件/兼容Web，金额未知 | 版本/读取授权和网络范围核对 | 独立系统查看器可替代 |
| 持续使用 | 整文件Buffer/base64/JSON/浏览器解码 | 选择图片、管理窗口 | base64膨胀约4/3且还有解码像素，多窗口累加 |
| 失败恢复 | 网络/解码重复及资源回收 | 核错误、关闭/重开 | cancelled只丢迟到结果不取消请求/Host读取 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 内嵌看图 | 文件域/视图注册和img dataURL | 真实版本渲染/格式解码兼容 |
| 不改原图 | CSS变换/原生只读 | 不等受限文件授权 |
| SVG路径 | img src非innerHTML | 浏览器/源文件全部内容风险与资源 |

缩放上限8倍仅CSS显示，不降低实际解码内存；原图只读和CSS变换可减少误改，但重要文件能否安全查看取决读取范围/格式/资源和宿主。应比较同图片在dock与系统查看器完成查看/错误恢复的人时与内存，不以支持扩展名数量推导最佳。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:123-141](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/index.ts#L123-L141)

整文件/base64。

<details>
<summary>查看原文（19行）</summary>

```text
/** Whole-file read as base64; rejects files over the size cap up front. */
async function readImageBase64(path: string): Promise<{
  content: string
  mime: string
  size: number
}> {
  const info = await stat(path).catch((error) => {
    throw new WbError('fs-error', `cannot read "${path}": ${messageOf(error)}`, 400)
  })
  if (info.isDirectory()) {
    throw new WbError('fs-error', `"${path}" is a directory`, 400)
  }
  if (info.size > IMAGE_LIMIT_BYTES) {
    throw new WbError('too-large', `"${path}" is ${info.size} bytes, over the ${IMAGE_LIMIT_BYTES}-byte image limit`, 413)
  }
  const buffer = await readFile(path).catch((error) => {
    throw new WbError('fs-error', `cannot read "${path}": ${messageOf(error)}`, 400)
  })
  return { content: buffer.toString('base64'), mime: mimeOfPath(path), size: info.size }
```

</details>

**依据 2 · 源码核查**：[src/client/ImageView.tsx:22-24](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/client/ImageView.tsx#L22-L24)

缩放上限。

```text
const INITIAL_TRANSFORM: Transform = { scale: 1, rotation: 0, x: 0, y: 0 }
const MIN_SCALE = 0.1
const MAX_SCALE = 8
```

**依据 3 · 源码核查**：[src/client/ImageView.tsx:63-79](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/client/ImageView.tsx#L63-L79)

请求和取消。

<details>
<summary>查看原文（17行）</summary>

```text
        const response = await fetch('/dock-images/read', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sessionId, path }),
        })
        const json = (await response.json()) as ReadResponse
        if (json.ok !== true || json.value === undefined) throw new Error(json.error?.message ?? 'read failed')
        if (cancelled) return
        const image = json.value.image
        setDataUrl(`data:${image.mime};base64,${image.content}`)
        setSize(image.size)
      } catch (cause) {
        if (cancelled) return
        setError(cause instanceof Error ? cause.message : String(cause))
      }
    })()
    return () => { cancelled = true }
```

</details>

**依据 4 · 源码核查**：[src/client/ImageView.tsx:109-113](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/client/ImageView.tsx#L109-L113)

显示变换。

```text
  const imageStyle = {
    ...INLINE.img,
    cursor: dragging ? 'grabbing' : 'grab',
    transform: `translate(${transform.x}px, ${transform.y}px) rotate(${transform.rotation}deg) scale(${transform.scale})`,
  }
```

#### 缺口

- 无同图多窗口峰值内存、解码失败率及与系统查看器的人时对照。
  **影响**：不能承诺大图低资源或最佳体验。
  **进一步探讨**：可用固定无敏感格式/像素/体积阶梯与多窗口，核实际内容/错误及资源恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程价值、受限读取收据假设和采用建议？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

effect登记Host路由和Client文件域/视图可统一清理；动态标题按React文本渲染，SVG仅img路径、缩放clamp、路径变化丢迟到避免常见串图，均可复用。绝对路径宽读和像素未限是独立边界。

可探讨未验证的“授权读取/解码收据”。由文件域给短期特定文件能力，Host真实regular-file句柄、授权根/用户选取边界和同句柄字节cap；按实际内容类型/像素预算拒绝，源hash/实际大小返回。Client AbortController传播，img加载/解码明确状态，无目标清图，读取/显示都要回执。相对现有header+path可减少非图片外读/竞态及无声错误，代价是文件服务兼容/授权状态和格式解析成本。用非图片、链接/替换、大像素、慢读、路径清空与迟到夹具研究；未通过不泛称SVG安全/整文件cap绝对。

推荐observe。dock内查看有便利，但宽HTTP读取授权、实际字节/像素和错误状态应先澄清；继续可先限制原始API非图片与文件授权，再研究小图试用。出现非目标内容可取、远端暴露范围不明、资源失控或旧图残留/无解码错误时停止读取，回系统查看器核源文件。本轮未打开真实图。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:225-264](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/index.ts#L225-L264)

effect路由。

<details>
<summary>查看原文（40行）</summary>

```text
export function apply(ctx: WbContext): void {
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: '/dock-images',
    handler: async (req, res) => {
      if (!isTrustedRequest(req, ctx.webRuntime.trustedHosts)) {
        writeJson(res, 403, { ok: false, error: { code: 'forbidden', message: 'forbidden' } })
        return
      }
      if (req.method !== 'POST') {
        writeJson(res, 405, { ok: false, error: { code: 'bad-request', message: 'method not allowed' } })
        return
      }
      const pathname = new URL(req.url ?? '/', 'http://dsh.internal').pathname
      const method = pathname.startsWith('/dock-images/') ? pathname.slice('/dock-images/'.length) : undefined
      if (method === undefined || method.includes('/')) {
        writeError(res, new WbError('not-found', `unknown /dock-images method "${method}"`, 404))
        return
      }
      try {
        const payload = await readJsonBody(req)
        if (method === 'read') {
          const sessionId = stringOrUndefined(payload, 'sessionId')
          const raw = stringOrUndefined(payload, 'path')
          if (raw === undefined) {
            writeError(res, new WbError('bad-request', 'read requires a "path"', 400))
            return
          }
          const cwd = sessionCwdOf(ctx, sessionId)
          const path = resolveReadPath(raw)
          const image = await readImageBase64(path)
          writeOk(res, { image, cwd })
          return
        }
        writeError(res, new WbError('not-found', `unknown /dock-images method "${method}"`, 404))
      } catch (error) {
        writeError(res, error)
      }
    },
  }), 'dock-images: /dock-images routes')
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:37-66](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/client/index.ts#L37-L66)

effect注册。

<details>
<summary>查看原文（30行）</summary>

```text
  ctx.effect(() => workbench.registerPlugin({
    id: 'dock-images',
    title: 'Images',
    description: 'Image viewer for the dock file explorer: renders PNG, JPEG, GIF, WebP, BMP, SVG, ICO and AVIF files.',
    hasEntry: false,
  }), 'dock-images: plugin metadata')

  // Register the file domain's image viewer for raster/image extensions,
  // with the explorer icon for those types: a picture glyph (rounded frame +
  // sun + mountain, single evenodd path in a 16×16 viewBox) tinted purple.
  ctx.effect(() => files.registerFileViewer({
    id: 'image',
    exts: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'ico', 'avif'],
    icon: {
      color: '#a074c4',
      viewBox: '0 0 16 16',
      path: 'M5.20 2.40h5.60a2.8 2.8 0 0 1 2.8 2.8v5.60a2.8 2.8 0 0 1 -2.8 2.8h-5.60a2.8 2.8 0 0 1 -2.8 -2.8v-5.60a2.8 2.8 0 0 1 2.8 -2.8zM5.80 4.00h4.40a1.8 1.8 0 0 1 1.8 1.8v4.40a1.8 1.8 0 0 1 -1.8 1.8h-4.40a1.8 1.8 0 0 1 -1.8 -1.8v-4.40a1.8 1.8 0 0 1 1.8 -1.8zM10.3 4.4a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8zM4.3 11.9L6.7 8l1.5 1.8 1-1.2 2.8 3.3z',
    },
  }), 'dock-images: file viewer')

  // The view that receives open seeds ({ path, title }). It stays registered
  // as an editor-area view because floating windows resolve their view
  // through this registry; opening itself is always floating (dock-files
  // dispatches { mode: 'floating' }).
  ctx.effect(() => workbench.registerEditorView({
    id: 'image',
    title: 'Image',
    order: 120,
    component: ImageView,
  }), 'dock-images: view')
```

</details>

**依据 3 · 源码核查**：[src/client/ImageView.tsx:53-80](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/client/ImageView.tsx#L53-L80)

状态/迟到。

<details>
<summary>查看原文（28行）</summary>

```text
  useEffect(() => {
    setTransform(INITIAL_TRANSFORM)
    setDragging(false)
    if (path === undefined) return
    let cancelled = false
    setDataUrl(null)
    setSize(0)
    setError(null)
    void (async () => {
      try {
        const response = await fetch('/dock-images/read', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sessionId, path }),
        })
        const json = (await response.json()) as ReadResponse
        if (json.ok !== true || json.value === undefined) throw new Error(json.error?.message ?? 'read failed')
        if (cancelled) return
        const image = json.value.image
        setDataUrl(`data:${image.mime};base64,${image.content}`)
        setSize(image.size)
      } catch (cause) {
        if (cancelled) return
        setError(cause instanceof Error ? cause.message : String(cause))
      }
    })()
    return () => { cancelled = true }
  }, [path, sessionId])
```

</details>

**依据 4 · 源码核查**：[src/client/ImageView.tsx:115-137](https://github.com/AKS1st/dock-images/blob/b98f3910c59af6f30c742b0ddc001315c2c176ee/src/client/ImageView.tsx#L115-L137)

渲染/收据假设。

<details>
<summary>查看原文（23行）</summary>

```text
  return createElement('div', { style: INLINE.wrap },
    createElement('div', { style: INLINE.head },
      createElement('span', { style: INLINE.title, title: path }, title),
      sizeText !== '' ? createElement('span', { style: INLINE.meta }, sizeText) : null,
      createElement('div', { style: INLINE.toolbar, 'aria-label': 'Image controls' },
        createElement('button', { type: 'button', style: INLINE.button, onClick: () => rotate(-90), title: 'Rotate counterclockwise', 'aria-label': 'Rotate counterclockwise' }, '↶'),
        createElement('button', { type: 'button', style: INLINE.button, onClick: () => rotate(90), title: 'Rotate clockwise', 'aria-label': 'Rotate clockwise' }, '↷'),
        createElement('button', { type: 'button', style: INLINE.button, onClick: reset, title: 'Reset image', 'aria-label': 'Reset image' }, '↺'),
      ),
    ),
    error !== null
      ? createElement('div', { style: INLINE.err }, error)
      : dataUrl === null
        ? createElement('div', { style: INLINE.empty }, 'Reading…')
        : createElement('div', {
          style: INLINE.stage,
          onWheel,
          onPointerDown,
          onPointerMove,
          onPointerUp: stopDragging,
          onPointerCancel: stopDragging,
        },
        createElement('img', { style: imageStyle, src: dataUrl, alt: title, draggable: false }),
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
