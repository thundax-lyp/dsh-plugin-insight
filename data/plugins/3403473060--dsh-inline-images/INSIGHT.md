# dsh-inline-images

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[79f8ba7](https://github.com/3403473060/dsh-inline-images/tree/79f8ba778441c86738dedba574f5911fd2b5b2be)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/3403473060/dsh-inline-images)
<!-- END META -->

> **实现功能**：将助手文本中的绝对图片路径改写成可加载的本地路由，并提供灯箱和尺寸设置。

> **核心亮点**：对话正文图片、尺寸面板和灯箱一体化。详见[Q01](#research-q01)。

> **风险与缺陷**：URL 中 token 可见且请求 p 未绑定已确认文件；回环地址对异机浏览器可能失效。详见[Q02](#research-q02)和[Q03](#research-q03)。

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
  - [Q01 · 本地图片如何出现在消息正文，实际触发与呈现范围是什么？](#detail-section-11)
  - [Q02 · 图片字节路由如何限制读取，token 是否等于用户授权？](#detail-section-12)
  - [Q03 · 本机 URL 与远程 Web 客户端、格式和设置有何边界？](#detail-section-13)
  - [Q04 · 首次、持续和失败恢复分别由谁承担？](#detail-section-14)
  - [Q05 · 如何以可证伪对照改进可用性和文件访问边界？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在 DSH 对话正文预览本机截图或生成图片时自动展示，省去手动打开文件。详见[Q01](#research-q01)。

助手回复绝对图片路径仅呈现文本，用户手动打开；插件自动改写为图片和灯箱。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 扫描 | 自动改写 | 仅 block-end 绝对路径 |
| 路由 | 读取图片 | 可见 token/任意后缀匹配路径 |
| UI | 放大和尺寸 | 依浏览器 slots |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| llm/webServer/fs | 预览必需 | 扫描/读图 | 不渲染或无路由 |
| Typert/credentials | 设置保存必需 | 尺寸持久化 | 默认值/写失败 |
| UI slots/浏览器 | 灯箱/面板必需 | 交互 | 仅文本/无 UI |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 安装 | 构建并挂载 | 服务齐全 |
| 使用 | 输出真实绝对路径 | 内联加载且不跨文件 |
| 故障 | 查 400/404/远程回环 | 停用或还原原文本 |

**效果与成本**

#### 成本

| 阶段 | 本插件具体动作 | 现金/资源 | 人工/时间 | 未知与恢复 |
| --- | --- | --- | --- | --- |
| 首次 | 构建、安装、验证本机/远程浏览器 | 本地磁盘/构建资源；购买费用未见，未知 | 配 Host 服务与路径样本；工时未知 | 安装/兼容失败需卸载/定位，耗时未知 |
| 持续 | 扫描 block-end、stat 候选、按请求读图 | CPU/IO/网络，每次默认最多 20 MiB；金额未知 | 查看误改写和权限；工时未知 | 图片请求量/缓存收益未知 |
| 失败恢复 | 诊断 400/404/回环地址、重设尺寸或停用 | 重试读图和构建可能增加资源；金额未知 | 追日志、还原配置/路由；工时未知 | 部分配置保存和访问边界恢复需实测 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 自动预览 | 绝对路径改写 | 远程浏览器可用性 |
| 灯箱/尺寸 | UI 组件和 Remote 设置 | 跨版本行为 |
| 访问限制 | token/后缀/大小 | 文件级授权 |

> **思考**：URL 中 token 可见且请求 p 未绑定已确认文件；回环地址对异机浏览器可能失效。详见[Q02](#research-q02)和[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：对话正文图片、尺寸面板和灯箱一体化。详见[Q01](#research-q01)。

对话正文图片、尺寸面板和灯箱一体化。详见[Q01](#research-q01)。

宿主扫描、路由、Typert 设置和客户端 UI 贯通；授权边界只靠可见全局 token，且路径按请求参数重新读。详见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

URL 中 token 可见且请求 p 未绑定已确认文件；回环地址对异机浏览器可能失效。详见[Q02](#research-q02)和[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅在可信隔离环境试用，先核 Host 外围访问边界与远程客户端，再评估稳定性和资源。详见[Q04](#research-q04)与[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码能确认改写/读取链；硬编码回环地址和可见 token 的任意路径读取是采用前须核的边界。目标 Host/浏览器未运行。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/client.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.md、src/index.ts、src/client.ts、package.json；未运行目标 DSH/浏览器或攻击性测试。旧 META 复用。
- 下一步：隔离本机/远程浏览器测格式、路径/重复路径、缺失文件、大小上限、token 改 p/重放、尺寸部分写入与卸载恢复。

**分析版本**

- **仓库**：[3403473060/dsh-inline-images](https://github.com/3403473060/dsh-inline-images)
- **版本号**：1.0.0（[固定提交 79f8ba7](https://github.com/3403473060/dsh-inline-images/tree/79f8ba778441c86738dedba574f5911fd2b5b2be)）
- **版本日期**：2026-08-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

用会话/路径绑定的短期标识与相对 URL，同时改善访问边界和远程客户端可用性；以改路径/重放/本机异机对照证伪。详见[Q05](#research-q05)。

隔离本机/远程浏览器测格式、路径/重复路径、缺失文件、大小上限、token 改 p/重放、尺寸部分写入与卸载恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 31 | 26 | 1 | — |
| .js | source | 2 | 469 | 462 | 11 | — |
| .md | source | 1 | 31 | — | — | 378 |
| .ts | source | 2 | 422 | 371 | 24 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/3403473060/dsh-inline-images/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**内联图片是否在不同客户端可靠呈现，回环读取如何约束文件访问？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 本地图片如何出现在消息正文，实际触发与呈现范围是什么？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

作者目标是把助手回复中的本地图片路径改成 Markdown 图片而非只显示字符串。固定源码只在 llm/stream 的 block-end 文本块、且 options.purpose 为空时扫描；接受绝对盘符、UNC 和 POSIX 路径及常见 Markdown/反引号形式，并用 fs.stat 过滤非文件，再替换为带本机 URL 的图片标记。客户端另注册灯箱和设置面板。它不读取任意相对路径，不处理其它流块；浏览器和目标 Host 的实际渲染未在本轮运行。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-13](https://github.com/3403473060/dsh-inline-images/blob/79f8ba778441c86738dedba574f5911fd2b5b2be/README.md#L1-L13)

功能和格式声明

<details>
<summary>查看原文（13行）</summary>

```text
# dsh-inline-images 对话内联图片

让 DeepSeek Harness 的对话**直接显示本地图片**:LLM 回复中输出的本地图片路径(截图、生成图等)会在**消息正文里**自动渲染成图片 —— 不再只是一串看不到的路径文本。

![示例](assets/screenshots/demo.png)

## 功能

- **消息正文内联渲染**:扫描助手回复文本中的本地图片路径(`C:\...` 盘符、UNC、POSIX、`![](本地路径)`、反引号包裹),把真实存在的图片改写成同源回环 URL,产品 MarkdownText 直接在正文渲染。
- **支持 9 种格式**:png / jpg / jpeg / webp / gif / svg / avif / bmp / ico。
- **点击放大灯箱**:点击正文图片 → 全屏大图;点背景或按 Esc 关闭。
- **可调尺寸**:设置 → 内联图片,调整正文图片最大宽/高(64–2400 px,默认 640×420),持久化到凭证存储(`INLINE_IMAGE_MAX_WIDTH` / `INLINE_IMAGE_MAX_HEIGHT`)。
- **安静降级**:不存在的路径、示例/占位路径(路径、xx、... 等)静默跳过,不影响对话;消息内容仍是纯文本 URL,纯文本模型适配器不会拒绝。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:126-169](https://github.com/3403473060/dsh-inline-images/blob/79f8ba778441c86738dedba574f5911fd2b5b2be/src/index.ts#L126-L169)

路径候选识别

<details>
<summary>查看原文（44行）</summary>

```text
function acceptable(path: string): boolean {
  if (path.length < 3) return false
  if (/^(https?:|data:|file:|mailto:)/i.test(path)) return false
  if (!IMAGE_EXT_RE.test(path)) return false
  if (!/^([A-Za-z]:[\\/]|\\\\|\/)/.test(path)) return false
  if (path.split(/[\\/]/).some(segment => PLACEHOLDER_SEGMENT.test(segment))) return false
  return true
}

function scanImagePathRanges(text: string): Array<{ path: string; rawStart: number; rawEnd: number }> {
  const found: Array<{ path: string; rawStart: number; rawEnd: number }> = []
  const seen = new Set<string>()
  const push = (raw: string, start: number, end: number) => {
    const path = normalizeCandidate(raw)
    if (!acceptable(path)) return
    if (seen.has(path)) return
    seen.add(path)
    found.push({ path, rawStart: start, rawEnd: end })
  }
  const mdRe = /!?\[[^\]]*\]\(\s*([^)\s][^)]*?)\s*\)/g
  let match: RegExpExecArray | null
  while ((match = mdRe.exec(text)) !== null) {
    const inner = match[1].trim()
    const quote = inner[0]
    const path = quote === '"' || quote === "'"
      ? (inner.indexOf(quote, 1) !== -1 ? inner.slice(1, inner.indexOf(quote, 1)) : inner)
      : inner
    push(path, match.index, match.index + match[0].length)
  }
  const bareRe = new RegExp('(?:[A-Za-z]:[\\\\/][^' + BARE_STOP + ']+|\\\\[^\\\\\\s]+[\\\\/][^' + BARE_STOP + ']+|\\/[^' + BARE_STOP + ']+)', 'g')
  while ((match = bareRe.exec(text)) !== null) {
    const path = normalizeCandidate(match[0])
    if (!acceptable(path)) continue
    let start = match.index
    let end = match.index + match[0].length
    if (text[start - 1] === '`' && text[end] === '`') {
      start -= 1
      end += 1
    }
    if (seen.has(path)) continue
    seen.add(path)
    found.push({ path, rawStart: start, rawEnd: end })
  }
  return found
```

</details>

**依据 3 · 源码核查**：[src/index.ts:226-276](https://github.com/3403473060/dsh-inline-images/blob/79f8ba778441c86738dedba574f5911fd2b5b2be/src/index.ts#L226-L276)

流末文本改写

<details>
<summary>查看原文（51行）</summary>

```text
  // llm/stream 包装
  if (llm !== undefined && webServer !== undefined) {
    ctx.on('llm/stream', (options: any, next: any) => {
      if (options?.purpose) return next()
      return rewriteStream(next, webServer.port, token, fs)
    })
  }

  void runtime
}

async function* rewriteStream(next: any, port: number, token: string, fs: Context['fs']) {
  const seenPaths = new Set<string>()
  for await (const chunk of next()) {
    if (chunk?.type === 'block-end' && chunk.block?.type === 'text' && typeof chunk.block.text === 'string') {
      try {
        const text = chunk.block.text
        const ranges = scanImagePathRanges(text)
        if (ranges.length > 0 && fs !== undefined) {
          let rewritten = text
          let changed = false
          const todo: Array<{ range: any; url: string }> = []
          for (const range of ranges) {
            if (seenPaths.has(range.path)) continue
            seenPaths.add(range.path)
            try {
              const target = await fs.resolve(range.path)
              const info = await fs.stat(target)
              if (info === undefined || info.type !== 'file') continue
            } catch {
              continue
            }
            todo.push({ range, url: 'http://127.0.0.1:' + port + ROUTE_PATH + '?t=' + token + '&p=' + encodeURIComponent(range.path) })
          }
          todo.sort((a, b) => b.range.rawStart - a.range.rawStart)
          for (const { range, url } of todo) {
            const before = rewritten
            rewritten = rewritten.slice(0, range.rawStart) + '![](' + url + ')' + rewritten.slice(range.rawEnd)
            if (rewritten !== before) changed = true
          }
          if (changed) {
            yield { ...chunk, block: { ...chunk.block, text: rewritten } }
            continue
          }
        }
      } catch (error) {
        console.error('[dsh-inline-images] 图片路径改写失败:', error)
      }
    }
    yield chunk
  }
```

</details>

**依据 4 · 源码核查**：[src/client.ts:111-145](https://github.com/3403473060/dsh-inline-images/blob/79f8ba778441c86738dedba574f5911fd2b5b2be/src/client.ts#L111-L145)

客户端 UI 注入

<details>
<summary>查看原文（35行）</summary>

```text
export function apply(ctx: Context): void {
  const slots = ctx.get('slots')
  if (slots === undefined) return

  slots.inject('shell.overlay', () => slots.register(
    { name: 'shell.overlay', id: 'inline-images-lightbox', order: 100, label: '图片灯箱' },
    () => React.createElement(ImageLightbox, null),
  ))
  slots.inject('settings.section', () => slots.register(
    { name: 'settings.section', id: 'inline-images', order: 35, label: '内联图片' },
    (props: any) => React.createElement(InlineSettings, { ...props, ctx }),
  ))

  if (typeof document !== 'undefined') {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target || target.tagName !== 'IMG') return
      const src = String((target as HTMLImageElement).src ?? '')
      if (src.indexOf('/plugins/dsh-inline-images/image') === -1) return
      event.preventDefault()
      event.stopPropagation()
      lightboxStore.open(src, (target as HTMLImageElement).alt || '图片')
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') lightboxStore.close()
    }
    document.addEventListener('click', onClick, true)
    document.addEventListener('keydown', onKey, true)
    ctx.effect(() => () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('keydown', onKey, true)
      if (styleTag !== null && styleTag.parentNode !== null) styleTag.parentNode.removeChild(styleTag)
    })
  }
}
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 图片字节路由如何限制读取，token 是否等于用户授权？

**研究主题：**功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

宿主路由检查 t 与进程启动时由 Math.random 生成的 token、路径扩展名，并以 fs.resolve/readBytes 读文件，默认最多 20 MiB 或附件配置的图片上限。改写 URL 将 token 和原始绝对路径放进消息正文。路由没有把 p 与原先 stat 通过的路径集合绑定，也未核特定会话、工作区、用户或来源；持有任一图片 URL 的调用方可把 p 换成宿主 fs 可访问的另一张受支持后缀图片。因此 token 是可见 bearer 值，不是逐文件授权。该判断是固定源码数据流风险，本轮未做动态利用；Host 路由外围认证/可达性未知。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:172-177](https://github.com/3403473060/dsh-inline-images/blob/79f8ba778441c86738dedba574f5911fd2b5b2be/src/index.ts#L172-L177)

token 生成

```text
export function apply(ctx: Context): void {
  const fs = ctx.get('fs')
  const attachments = ctx.get('attachments')
  const webServer = ctx.get('webServer')
  const llm = ctx.get('llm')
  const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
```

**依据 2 · 源码核查**：[src/index.ts:187-224](https://github.com/3403473060/dsh-inline-images/blob/79f8ba778441c86738dedba574f5911fd2b5b2be/src/index.ts#L187-L224)

图片路由检查与读取

<details>
<summary>查看原文（38行）</summary>

```text
  // 图片回环路由
  if (webServer !== undefined && fs !== undefined) {
    ctx.effect(() => webServer.register({
      kind: 'exact',
      path: ROUTE_PATH,
      async handler(req: any, res: any) {
        try {
          const raw = String(req.url ?? '')
          const at = raw.indexOf('?')
          const query: Record<string, string> = {}
          if (at !== -1) {
            for (const pair of raw.slice(at + 1).split('&')) {
              const eq = pair.indexOf('=')
              if (eq === -1) continue
              try { query[pair.slice(0, eq)] = decodeURIComponent(pair.slice(eq + 1).replace(/\+/g, ' ')) } catch { /* skip */ }
            }
          }
          if (query.t !== token || !query.p) {
            res.writeHead(400); res.end('bad request'); return
          }
          const mediaType = mediaTypeFor(query.p)
          if (mediaType === null) {
            res.writeHead(400); res.end('not an image path'); return
          }
          let maxBytes = 20 * 1024 * 1024
          if (attachments !== undefined) {
            try { maxBytes = attachments.imageLimits.maxImageBytes } catch { /* keep default */ }
          }
          const target = await fs.resolve(query.p)
          const bytes = await fs.readBytes(target, undefined, maxBytes)
          res.writeHead(200, { 'Content-Type': mediaType, 'Cache-Control': 'private, max-age=60' })
          res.end(bytes)
        } catch {
          try { res.writeHead(404); res.end('not found') } catch { /* dropped */ }
        }
      },
    }), 'dsh-inline-images: image route')
  }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:237-269](https://github.com/3403473060/dsh-inline-images/blob/79f8ba778441c86738dedba574f5911fd2b5b2be/src/index.ts#L237-L269)

token 和路径拼进消息 URL

<details>
<summary>查看原文（33行）</summary>

```text
async function* rewriteStream(next: any, port: number, token: string, fs: Context['fs']) {
  const seenPaths = new Set<string>()
  for await (const chunk of next()) {
    if (chunk?.type === 'block-end' && chunk.block?.type === 'text' && typeof chunk.block.text === 'string') {
      try {
        const text = chunk.block.text
        const ranges = scanImagePathRanges(text)
        if (ranges.length > 0 && fs !== undefined) {
          let rewritten = text
          let changed = false
          const todo: Array<{ range: any; url: string }> = []
          for (const range of ranges) {
            if (seenPaths.has(range.path)) continue
            seenPaths.add(range.path)
            try {
              const target = await fs.resolve(range.path)
              const info = await fs.stat(target)
              if (info === undefined || info.type !== 'file') continue
            } catch {
              continue
            }
            todo.push({ range, url: 'http://127.0.0.1:' + port + ROUTE_PATH + '?t=' + token + '&p=' + encodeURIComponent(range.path) })
          }
          todo.sort((a, b) => b.range.rawStart - a.range.rawStart)
          for (const { range, url } of todo) {
            const before = rewritten
            rewritten = rewritten.slice(0, range.rawStart) + '![](' + url + ')' + rewritten.slice(range.rawEnd)
            if (rewritten !== before) changed = true
          }
          if (changed) {
            yield { ...chunk, block: { ...chunk.block, text: rewritten } }
            continue
          }
```

</details>

#### 缺口

- 目标 Host 外围认证、fs.resolve 根限制与路由可达性未知
  **影响：**决定风险实际可利用范围
  **进一步探讨：**在隔离 Host 用已授权 URL 改 p 检访问边界

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本机 URL 与远程 Web 客户端、格式和设置有何边界？

**研究主题：**功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

改写器硬编码 http://127.0.0.1:<webServer.port>。若浏览器不运行在 DSH 服务同一机器，127.0.0.1 指向浏览器机器，因此 README 所称“同源”不能由源码普遍成立；代理/远程访问配置需单独测试。扩展名决定 Content-Type，未见字节内容验证。尺寸配置通过 Typert Remote 读写 credentials，设置 64–2400；读失败回落默认，setConfig 若先写宽度再写高度而后者失败会形成部分保存。客户端 CSS 只匹配该路由字符串，灯箱点击则用 src 子串识别。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-27](https://github.com/3403473060/dsh-inline-images/blob/79f8ba778441c86738dedba574f5911fd2b5b2be/README.md#L23-L27)

作者同源说法

```text
## 工作原理

1. `llm/stream` 包装器扫描文本块,`fs.stat` 确认文件存在。
2. 按原始区间把路径替换为 `![](http://127.0.0.1:<port>/plugins/dsh-inline-images/image?t=<token>&p=<path>)`。
3. webServer 路由实时读取文件字节返回(与页面同源,无 CSP/混合内容问题);token 每次激活随机生成。
```

**依据 2 · 源码核查**：[src/index.ts:55-65](https://github.com/3403473060/dsh-inline-images/blob/79f8ba778441c86738dedba574f5911fd2b5b2be/src/index.ts#L55-L65)

后缀 MIME

<details>
<summary>查看原文（11行）</summary>

```text
function mediaTypeFor(path: string): string | null {
  const lower = path.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.gif')) return 'image/gif'
  if (lower.endsWith('.svg')) return 'image/svg+xml'
  if (lower.endsWith('.avif')) return 'image/avif'
  if (lower.endsWith('.bmp')) return 'image/bmp'
  if (lower.endsWith('.ico')) return 'image/x-icon'
  return null
```

</details>

**依据 3 · 源码核查**：[src/index.ts:68-110](https://github.com/3403473060/dsh-inline-images/blob/79f8ba778441c86738dedba574f5911fd2b5b2be/src/index.ts#L68-L110)

配置读写

<details>
<summary>查看原文（43行）</summary>

```text
/** Remote service:正文图片最大尺寸配置。 */
export class InlineImagesRuntime extends TypertRemoteService {
  private readonly credentials: Context['credentials'] | undefined

  constructor(ctx: Context) {
    super(ctx, 'inlineImages')
    this.credentials = ctx.get('credentials')
  }

  async getConfig() {
    const read = async (ref: string, fallback: number): Promise<number> => {
      if (this.credentials === undefined) return fallback
      try {
        const resolved = await this.credentials.resolve(ref as never)
        if (resolved === undefined) return fallback
        const value = Number(resolved.value)
        return Number.isFinite(value) && value >= 64 ? Math.round(value) : fallback
      } catch {
        return fallback
      }
    }
    return {
      maxWidth: await read(REF_MAX_WIDTH, 640),
      maxHeight: await read(REF_MAX_HEIGHT, 420),
      formats: IMAGE_FORMATS,
    }
  }

  async setConfig(args: { maxWidth?: number; maxHeight?: number }) {
    if (this.credentials === undefined) throw new Error('凭证服务不可用,无法保存配置')
    if (typeof args.maxWidth === 'number') {
      const value = Math.round(args.maxWidth)
      if (!(value >= 64 && value <= 2400)) throw new Error('宽度需在 64-2400 之间')
      await this.credentials.set(REF_MAX_WIDTH as never, String(value))
    }
    if (typeof args.maxHeight === 'number') {
      const value = Math.round(args.maxHeight)
      if (!(value >= 64 && value <= 2400)) throw new Error('高度需在 64-2400 之间')
      await this.credentials.set(REF_MAX_HEIGHT as never, String(value))
    }
    return this.getConfig()
  }
}
```

</details>

**依据 4 · 源码核查**：[src/index.ts:187-218](https://github.com/3403473060/dsh-inline-images/blob/79f8ba778441c86738dedba574f5911fd2b5b2be/src/index.ts#L187-L218)

路由返回

<details>
<summary>查看原文（32行）</summary>

```text
  // 图片回环路由
  if (webServer !== undefined && fs !== undefined) {
    ctx.effect(() => webServer.register({
      kind: 'exact',
      path: ROUTE_PATH,
      async handler(req: any, res: any) {
        try {
          const raw = String(req.url ?? '')
          const at = raw.indexOf('?')
          const query: Record<string, string> = {}
          if (at !== -1) {
            for (const pair of raw.slice(at + 1).split('&')) {
              const eq = pair.indexOf('=')
              if (eq === -1) continue
              try { query[pair.slice(0, eq)] = decodeURIComponent(pair.slice(eq + 1).replace(/\+/g, ' ')) } catch { /* skip */ }
            }
          }
          if (query.t !== token || !query.p) {
            res.writeHead(400); res.end('bad request'); return
          }
          const mediaType = mediaTypeFor(query.p)
          if (mediaType === null) {
            res.writeHead(400); res.end('not an image path'); return
          }
          let maxBytes = 20 * 1024 * 1024
          if (attachments !== undefined) {
            try { maxBytes = attachments.imageLimits.maxImageBytes } catch { /* keep default */ }
          }
          const target = await fs.resolve(query.p)
          const bytes = await fs.readBytes(target, undefined, maxBytes)
          res.writeHead(200, { 'Content-Type': mediaType, 'Cache-Control': 'private, max-age=60' })
          res.end(bytes)
```

</details>

**依据 5 · 源码核查**：[src/index.ts:258-269](https://github.com/3403473060/dsh-inline-images/blob/79f8ba778441c86738dedba574f5911fd2b5b2be/src/index.ts#L258-L269)

回环 URL

<details>
<summary>查看原文（12行）</summary>

```text
            todo.push({ range, url: 'http://127.0.0.1:' + port + ROUTE_PATH + '?t=' + token + '&p=' + encodeURIComponent(range.path) })
          }
          todo.sort((a, b) => b.range.rawStart - a.range.rawStart)
          for (const { range, url } of todo) {
            const before = rewritten
            rewritten = rewritten.slice(0, range.rawStart) + '![](' + url + ')' + rewritten.slice(range.rawEnd)
            if (rewritten !== before) changed = true
          }
          if (changed) {
            yield { ...chunk, block: { ...chunk.block, text: rewritten } }
            continue
          }
```

</details>

**依据 6 · 源码核查**：[src/client.ts:101-143](https://github.com/3403473060/dsh-inline-images/blob/79f8ba778441c86738dedba574f5911fd2b5b2be/src/client.ts#L101-L143)

CSS/灯箱

<details>
<summary>查看原文（43行）</summary>

```text
let styleTag: HTMLStyleElement | null = null
function applyImageSizes(maxWidth: number, maxHeight: number) {
  if (typeof document === 'undefined') return
  if (styleTag === null) {
    styleTag = document.createElement('style')
    document.head.appendChild(styleTag)
  }
  styleTag.textContent = 'img[src*="/plugins/dsh-inline-images/image"] { max-width: ' + maxWidth + 'px !important; max-height: ' + maxHeight + 'px !important; object-fit: contain; border-radius: 8px; }'
}

export function apply(ctx: Context): void {
  const slots = ctx.get('slots')
  if (slots === undefined) return

  slots.inject('shell.overlay', () => slots.register(
    { name: 'shell.overlay', id: 'inline-images-lightbox', order: 100, label: '图片灯箱' },
    () => React.createElement(ImageLightbox, null),
  ))
  slots.inject('settings.section', () => slots.register(
    { name: 'settings.section', id: 'inline-images', order: 35, label: '内联图片' },
    (props: any) => React.createElement(InlineSettings, { ...props, ctx }),
  ))

  if (typeof document !== 'undefined') {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target || target.tagName !== 'IMG') return
      const src = String((target as HTMLImageElement).src ?? '')
      if (src.indexOf('/plugins/dsh-inline-images/image') === -1) return
      event.preventDefault()
      event.stopPropagation()
      lightboxStore.open(src, (target as HTMLImageElement).alt || '图片')
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') lightboxStore.close()
    }
    document.addEventListener('click', onClick, true)
    document.addEventListener('keydown', onKey, true)
    ctx.effect(() => () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('keydown', onKey, true)
      if (styleTag !== null && styleTag.parentNode !== null) styleTag.parentNode.removeChild(styleTag)
    })
```

</details>

#### 缺口

- 两字段写入失败的恢复语义未测
  **影响：**尺寸可能半更新
  **进一步探讨：**注入第二写失败并重读配置

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续和失败恢复分别由谁承担？

**研究主题：**效果与总成本、采用判断

#### 完整回答

首次需要构建/安装 bundle、确认 Host 具有 llm、webServer、fs、Typert 与浏览器 slots，并测试本机路径；现金价格未见，安装与检查工时未知。持续使用中每段 block-end 文本扫描路径、对候选 stat，浏览器请求再读图片字节（每请求上限默认 20 MiB），客户端保存两项凭证设置；真实 CPU、IO、带宽成本未测。失败时需查看文本是否被改写、路由 400/404、远程浏览器回环地址和部分配置保存，必要时停用插件/还原原文本；重试请求与人工排查成本未知。不能将“无付费 API”推断为零成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-27](https://github.com/3403473060/dsh-inline-images/blob/79f8ba778441c86738dedba574f5911fd2b5b2be/README.md#L15-L27)

安装与请求流程

<details>
<summary>查看原文（13行）</summary>

````text
## 构建与安装

```sh
pnpm install
pnpm run build
dsh plugin --profile web add ./dsh-inline-images
```

## 工作原理

1. `llm/stream` 包装器扫描文本块,`fs.stat` 确认文件存在。
2. 按原始区间把路径替换为 `![](http://127.0.0.1:<port>/plugins/dsh-inline-images/image?t=<token>&p=<path>)`。
3. webServer 路由实时读取文件字节返回(与页面同源,无 CSP/混合内容问题);token 每次激活随机生成。
````

</details>

**依据 2 · 源码核查**：[src/index.ts:187-276](https://github.com/3403473060/dsh-inline-images/blob/79f8ba778441c86738dedba574f5911fd2b5b2be/src/index.ts#L187-L276)

读取与流扫描

<details>
<summary>查看原文（90行）</summary>

```text
  // 图片回环路由
  if (webServer !== undefined && fs !== undefined) {
    ctx.effect(() => webServer.register({
      kind: 'exact',
      path: ROUTE_PATH,
      async handler(req: any, res: any) {
        try {
          const raw = String(req.url ?? '')
          const at = raw.indexOf('?')
          const query: Record<string, string> = {}
          if (at !== -1) {
            for (const pair of raw.slice(at + 1).split('&')) {
              const eq = pair.indexOf('=')
              if (eq === -1) continue
              try { query[pair.slice(0, eq)] = decodeURIComponent(pair.slice(eq + 1).replace(/\+/g, ' ')) } catch { /* skip */ }
            }
          }
          if (query.t !== token || !query.p) {
            res.writeHead(400); res.end('bad request'); return
          }
          const mediaType = mediaTypeFor(query.p)
          if (mediaType === null) {
            res.writeHead(400); res.end('not an image path'); return
          }
          let maxBytes = 20 * 1024 * 1024
          if (attachments !== undefined) {
            try { maxBytes = attachments.imageLimits.maxImageBytes } catch { /* keep default */ }
          }
          const target = await fs.resolve(query.p)
          const bytes = await fs.readBytes(target, undefined, maxBytes)
          res.writeHead(200, { 'Content-Type': mediaType, 'Cache-Control': 'private, max-age=60' })
          res.end(bytes)
        } catch {
          try { res.writeHead(404); res.end('not found') } catch { /* dropped */ }
        }
      },
    }), 'dsh-inline-images: image route')
  }

  // llm/stream 包装
  if (llm !== undefined && webServer !== undefined) {
    ctx.on('llm/stream', (options: any, next: any) => {
      if (options?.purpose) return next()
      return rewriteStream(next, webServer.port, token, fs)
    })
  }

  void runtime
}

async function* rewriteStream(next: any, port: number, token: string, fs: Context['fs']) {
  const seenPaths = new Set<string>()
  for await (const chunk of next()) {
    if (chunk?.type === 'block-end' && chunk.block?.type === 'text' && typeof chunk.block.text === 'string') {
      try {
        const text = chunk.block.text
        const ranges = scanImagePathRanges(text)
        if (ranges.length > 0 && fs !== undefined) {
          let rewritten = text
          let changed = false
          const todo: Array<{ range: any; url: string }> = []
          for (const range of ranges) {
            if (seenPaths.has(range.path)) continue
            seenPaths.add(range.path)
            try {
              const target = await fs.resolve(range.path)
              const info = await fs.stat(target)
              if (info === undefined || info.type !== 'file') continue
            } catch {
              continue
            }
            todo.push({ range, url: 'http://127.0.0.1:' + port + ROUTE_PATH + '?t=' + token + '&p=' + encodeURIComponent(range.path) })
          }
          todo.sort((a, b) => b.range.rawStart - a.range.rawStart)
          for (const { range, url } of todo) {
            const before = rewritten
            rewritten = rewritten.slice(0, range.rawStart) + '![](' + url + ')' + rewritten.slice(range.rawEnd)
            if (rewritten !== before) changed = true
          }
          if (changed) {
            yield { ...chunk, block: { ...chunk.block, text: rewritten } }
            continue
          }
        }
      } catch (error) {
        console.error('[dsh-inline-images] 图片路径改写失败:', error)
      }
    }
    yield chunk
  }
```

</details>

**依据 3 · 源码核查**：[src/client.ts:54-99](https://github.com/3403473060/dsh-inline-images/blob/79f8ba778441c86738dedba574f5911fd2b5b2be/src/client.ts#L54-L99)

配置 UI

<details>
<summary>查看原文（46行）</summary>

```text
function InlineSettings(props: any) {
  const remote = props.ctx.remote as any
  const [maxWidth, setMaxWidth] = React.useState(640)
  const [maxHeight, setMaxHeight] = React.useState(420)
  const [status, setStatus] = React.useState<{ kind: string; text: string } | null>(null)

  React.useEffect(() => {
    let alive = true
    remote.inlineImages.getConfig().then((cfg: any) => {
      if (!alive) return
      setMaxWidth(cfg.maxWidth ?? 640)
      setMaxHeight(cfg.maxHeight ?? 420)
      applyImageSizes(cfg.maxWidth ?? 640, cfg.maxHeight ?? 420)
    }).catch(() => applyImageSizes(640, 420))
    return () => { alive = false }
  }, [remote])

  const save = () => {
    setStatus(null)
    remote.inlineImages.setConfig({ args: { maxWidth: Number(maxWidth) || 640, maxHeight: Number(maxHeight) || 420 } }).then((cfg: any) => {
      setMaxWidth(cfg.maxWidth)
      setMaxHeight(cfg.maxHeight)
      applyImageSizes(cfg.maxWidth, cfg.maxHeight)
      setStatus({ kind: 'ok', text: '正文图片最大尺寸已更新为 ' + cfg.maxWidth + '×' + cfg.maxHeight })
    }).catch((err: any) => {
      setStatus({ kind: 'err', text: '保存失败: ' + String(err?.message ?? err) })
    })
  }

  const inputStyle: React.CSSProperties = { width: 70, padding: '4px 8px', marginRight: 4 }
  const btnStyle: React.CSSProperties = { padding: '6px 14px', cursor: 'pointer' }

  return el('div', { style: { display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 640 } },
    el('div', { style: { fontSize: 12, opacity: 0.7, lineHeight: 1.5 } },
      'LLM 回复中写出的本地图片路径(如 C:\\截图\\a.png)会在消息正文里直接渲染成图片。可在此调整正文图片的最大显示尺寸;点击正文图片可放大查看原图。支持格式:png/jpg/jpeg/webp/gif/svg/avif/bmp/ico。'
    ),
    el('div', { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } },
      el('span', { style: { fontSize: 13 } }, '正文图片最大尺寸:'),
      el('input', { type: 'number', min: 64, max: 2400, value: maxWidth, title: '宽度 px', onChange: (e: any) => setMaxWidth(e.target.value), style: inputStyle }),
      el('span', null, '×'),
      el('input', { type: 'number', min: 64, max: 2400, value: maxHeight, title: '高度 px', onChange: (e: any) => setMaxHeight(e.target.value), style: inputStyle }),
      el('button', { style: btnStyle, onClick: save }, '应用'),
      status ? el('span', { style: { fontSize: 12, color: status.kind === 'ok' ? '#2e9e5b' : '#d64545' } }, status.text) : null
    )
  )
}
```

</details>

#### 缺口

- 目标请求频率/图片大小/CPU 开销未知
  **影响：**高频扫描和读取可能累积资源
  **进一步探讨：**固定消息/图片集量测 stat 数、读取字节与耗时

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何以可证伪对照改进可用性和文件访问边界？

**研究主题：**新假设与验证、采用判断、缺陷与关键质疑

#### 完整回答

已知事实是当前 URL 含可见 token 和任意 p，且固定回环主机；同时产品价值来自自动展示图片。相对当前做法的设计假设：在服务端为已 stat 的图片签发短时、按会话/路径绑定的不可猜标识，并由浏览器可达的同源相对 URL 请求，可保留内联成功率，同时阻止改 p 读取其它图片并支持远程 Web。条件是 Host 能提供会话身份、可信文件读取与相对路由；代价是标识表、过期清理、跨会话缓存及资源消耗。最小对照在隔离本机/远程客户端各测合法图片、修改路径、重放旧会话 URL、同名新文件、20 MiB 边界；当前实现与原型分别记录显示成功率/错误率、额外状态和访问结果。若相对路由仍无法在远程加载，或改路径/跨会话重放仍可读取，安全与可用性增量假设被证伪；若标识管理开销超过受益场景，也应限制采用。固定版无此方案，本轮未实现或动态利用。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:187-224](https://github.com/3403473060/dsh-inline-images/blob/79f8ba778441c86738dedba574f5911fd2b5b2be/src/index.ts#L187-L224)

当前路由访问边界

<details>
<summary>查看原文（38行）</summary>

```text
  // 图片回环路由
  if (webServer !== undefined && fs !== undefined) {
    ctx.effect(() => webServer.register({
      kind: 'exact',
      path: ROUTE_PATH,
      async handler(req: any, res: any) {
        try {
          const raw = String(req.url ?? '')
          const at = raw.indexOf('?')
          const query: Record<string, string> = {}
          if (at !== -1) {
            for (const pair of raw.slice(at + 1).split('&')) {
              const eq = pair.indexOf('=')
              if (eq === -1) continue
              try { query[pair.slice(0, eq)] = decodeURIComponent(pair.slice(eq + 1).replace(/\+/g, ' ')) } catch { /* skip */ }
            }
          }
          if (query.t !== token || !query.p) {
            res.writeHead(400); res.end('bad request'); return
          }
          const mediaType = mediaTypeFor(query.p)
          if (mediaType === null) {
            res.writeHead(400); res.end('not an image path'); return
          }
          let maxBytes = 20 * 1024 * 1024
          if (attachments !== undefined) {
            try { maxBytes = attachments.imageLimits.maxImageBytes } catch { /* keep default */ }
          }
          const target = await fs.resolve(query.p)
          const bytes = await fs.readBytes(target, undefined, maxBytes)
          res.writeHead(200, { 'Content-Type': mediaType, 'Cache-Control': 'private, max-age=60' })
          res.end(bytes)
        } catch {
          try { res.writeHead(404); res.end('not found') } catch { /* dropped */ }
        }
      },
    }), 'dsh-inline-images: image route')
  }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:237-269](https://github.com/3403473060/dsh-inline-images/blob/79f8ba778441c86738dedba574f5911fd2b5b2be/src/index.ts#L237-L269)

当前 URL 拼装

<details>
<summary>查看原文（33行）</summary>

```text
async function* rewriteStream(next: any, port: number, token: string, fs: Context['fs']) {
  const seenPaths = new Set<string>()
  for await (const chunk of next()) {
    if (chunk?.type === 'block-end' && chunk.block?.type === 'text' && typeof chunk.block.text === 'string') {
      try {
        const text = chunk.block.text
        const ranges = scanImagePathRanges(text)
        if (ranges.length > 0 && fs !== undefined) {
          let rewritten = text
          let changed = false
          const todo: Array<{ range: any; url: string }> = []
          for (const range of ranges) {
            if (seenPaths.has(range.path)) continue
            seenPaths.add(range.path)
            try {
              const target = await fs.resolve(range.path)
              const info = await fs.stat(target)
              if (info === undefined || info.type !== 'file') continue
            } catch {
              continue
            }
            todo.push({ range, url: 'http://127.0.0.1:' + port + ROUTE_PATH + '?t=' + token + '&p=' + encodeURIComponent(range.path) })
          }
          todo.sort((a, b) => b.range.rawStart - a.range.rawStart)
          for (const { range, url } of todo) {
            const before = rewritten
            rewritten = rewritten.slice(0, range.rawStart) + '![](' + url + ')' + rewritten.slice(range.rawEnd)
            if (rewritten !== before) changed = true
          }
          if (changed) {
            yield { ...chunk, block: { ...chunk.block, text: rewritten } }
            continue
          }
```

</details>

**依据 3 · 作者声明**：[README.md:1-13](https://github.com/3403473060/dsh-inline-images/blob/79f8ba778441c86738dedba574f5911fd2b5b2be/README.md#L1-L13)

内联目标场景

<details>
<summary>查看原文（13行）</summary>

```text
# dsh-inline-images 对话内联图片

让 DeepSeek Harness 的对话**直接显示本地图片**:LLM 回复中输出的本地图片路径(截图、生成图等)会在**消息正文里**自动渲染成图片 —— 不再只是一串看不到的路径文本。

![示例](assets/screenshots/demo.png)

## 功能

- **消息正文内联渲染**:扫描助手回复文本中的本地图片路径(`C:\...` 盘符、UNC、POSIX、`![](本地路径)`、反引号包裹),把真实存在的图片改写成同源回环 URL,产品 MarkdownText 直接在正文渲染。
- **支持 9 种格式**:png / jpg / jpeg / webp / gif / svg / avif / bmp / ico。
- **点击放大灯箱**:点击正文图片 → 全屏大图;点背景或按 Esc 关闭。
- **可调尺寸**:设置 → 内联图片,调整正文图片最大宽/高(64–2400 px,默认 640×420),持久化到凭证存储(`INLINE_IMAGE_MAX_WIDTH` / `INLINE_IMAGE_MAX_HEIGHT`)。
- **安静降级**:不存在的路径、示例/占位路径(路径、xx、... 等)静默跳过,不影响对话;消息内容仍是纯文本 URL,纯文本模型适配器不会拒绝。
```

</details>

#### 缺口

- 提议方案需要目标 Host 会话/URL 机制支持
  **影响：**设计可行性未知
  **进一步探讨：**先在隔离原型核身份与相对 URL

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
