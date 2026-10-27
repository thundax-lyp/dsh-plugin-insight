# dsh-audiobook

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[fad04c3](https://github.com/AIcivilization/dsh-audiobook/tree/fad04c389bc4dfa828267fb9fb31aaf756560a47)

<!-- BEGIN META -->
[![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-audiobook)
<!-- END META -->

> **实现功能**：搜索或导入读物并分段朗读，保存收听进度、位置心得，支持语音记录和AI讨论。

> **核心亮点**：把听书、断点、位置心得和可导出的读后感连成一个读书流程，原话与AI整理分离是可借鉴交接；TTS/ASR和书源能力来自上游。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：本地存储不等于全部本地处理，Edge文本和AI材料会外发；默认启动自动安装Edge组件。书源同ID重新导入会覆盖段落但保留进度，位置索引可能漂移；防剧透靠裁剪与提示，history/模型知识不能硬隔离。参见[Q03](#research-q03)。

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
  - [Q01 · 谁需要文档转有声书，相对手工或宿主原生办法增加什么？](#detail-section-11)
  - [Q02 · 提取、分段、TTS与播放状态如何从入口形成完整调用链，依赖失效怎么办？](#detail-section-12)
  - [Q03 · 什么实现边界最可能使文档转有声书的贡献不成立，哪些工程设计可复用？](#detail-section-13)
  - [Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？](#detail-section-14)
  - [Q05 · 可从提取、分段、TTS与播放状态的限制推导什么可证伪改进？](#detail-section-15)
  - [Q06 · 哪些用户可以受控采用文档转有声书，何时应停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：给希望在Harness中听书并随读记录想法的人，将有授权文本变成分段朗读、进度和位置关联心得；合格交付应保留原文顺序及笔记归属，AI读后感仍需用户审核。

电子书阅读器朗读+笔记应用可替代主要用途；本插件以Harness模型与位置心得连接形成便利。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| audiobook_search | 搜索书源或已知书线索 | 可选模型与可达书源，不证版权适用所有地区 |
| audiobook_download | 下载书源条目入书库 | 来源/授权和网络，临时原件导入后删 |
| audiobook_import | 导入本地文档 | 可提取文字，300MB上限，扫描/DRM受限 |
| audiobook_books | 查书架和进度 | 本地书库记录，不证明实际理解 |
| audiobook_text | 取章节/最近文字或全书找词 | 原文和段索引，需核上下文范围 |
| audiobook_goto | 跳到章/段位置 | 面板播放状态与进度同步需验 |
| audiobook_notes | 读取/整理心得 | AI整理需模型和用户事实审核 |
| audiobook_add_note | 添加位置心得 | 原话保留，位置更新后须核锚点 |
| 分段朗读 | 听书与续播 | 浏览器/Edge/Kokoro不同资源与外发条件 |
| 心得与AI讨论面板 | 录音/编辑/讨论/导出 | 本地ASR可选，AI与云语音文字外发，防剧透非硬保证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20与Harness/独立CLI | 必需 | 面板及书库 | 可独立serve，数据共用 |
| 可提取文字与阅读授权 | 必需 | 生成朗读段 | 扫描PDF/DRM不能直接读取 |
| 浏览器/Edge/Kokoro语音 | 至少一种 | 朗读 | Edge外发文本且非正式服务；本地需模型 |
| Python/uv及网络 | 默认Edge安装需要 | 启动后台安装edge-tts | edge:false可禁止自动安装 |
| 模型与本地ASR | AI讨论/语音心得需要 | 整理和语音转字 | 无模型可保留原话与浏览器听书 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 选择语音和数据边界，必要时edge:false | 先确认自动下载与文字外发政策 |
| 2 | 导入授权文本并抽查章节/段落 | 无文字层或乱码先修原件 |
| 3 | 听书、存进度并在当前位置记心得 | 原话/AI整理分开，引用位置正确 |
| 4 | 更新同书或恢复数据前做备份 | 核对段索引是否仍指向同原文 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 语音/ASR模型及Python组件下载、存储，金额未知 | 书源/格式、隐私和语音配置 | 默认后台安装额外供应链 |
| 持续使用 | TTS计算/网络、缓存及AI token | 校对提取文本、心得与AI整理 | 语音服务可变，无单位价格依据 |
| 失败恢复 | 重合成/重新导入及备份空间 | 核对进度/笔记位置与模型输出 | 同书覆盖段落而保留索引可能错位 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 连续听读 | 分段与进度JSON、语音分支 | 真实断点/跨设备一致性 |
| 带位置心得 | 原话/整理字段分离、章段引用 | 文本更新后锚点稳定 |
| 读书讨论 | 当前段上下文裁剪及防剧透提示 | 模型既有知识/历史对话泄露剧透 |

> **思考**：本地存储不等于全部本地处理，Edge文本和AI材料会外发；默认启动自动安装Edge组件。书源同ID重新导入会覆盖段落但保留进度，位置索引可能漂移；防剧透靠裁剪与提示，history/模型知识不能硬隔离。参见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把听书、断点、位置心得和可导出的读后感连成一个读书流程，原话与AI整理分离是可借鉴交接；TTS/ASR和书源能力来自上游。参见[Q01](#research-q01)、[Q02](#research-q02)。

把听书、断点、位置心得和可导出的读后感连成一个读书流程，原话与AI整理分离是可借鉴交接；TTS/ASR和书源能力来自上游。参见[Q01](#research-q01)、[Q02](#research-q02)。

原子JSON与队列、原话/整理分层便于复用；导入版本与锚点、跨进程写入和云服务边界需独立设计，不能把单文件原子性当整体事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

本地存储不等于全部本地处理，Edge文本和AI材料会外发；默认启动自动安装Edge组件。书源同ID重新导入会覆盖段落但保留进度，位置索引可能漂移；防剧透靠裁剪与提示，history/模型知识不能硬隔离。参见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可让有授权低敏感读物的个人先试用浏览器语音与单本书，抽查提取和断点再启AI/云语音。高敏感笔记、严格无剧透或频繁更新原文时先观察；更新书源前备份并核对位置。参见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

听读和位置心得链由源码支持；文本更新锚点、剧透隔离与实际语音效果未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、plugin/index.js、plugin/tools.js、lib/importer.js、lib/store.js、lib/edge.js、lib/notes.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读Host鉴权/工具、导入/存储、Edge安装和心得上下文；未逐一核查全部书源、导出目标或浏览器播放。
- 下一步：单本授权书对照章节/原文和续播，修改前段后检查笔记/进度；分别核云文字流与防剧透历史。

**分析版本**

- **仓库**：[AIcivilization/dsh-audiobook](https://github.com/AIcivilization/dsh-audiobook)
- **版本号**：0.6.0（[固定提交 fad04c3](https://github.com/AIcivilization/dsh-audiobook/tree/fad04c389bc4dfa828267fb9fb31aaf756560a47)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可给进度和笔记绑定原文段摘要及导入版本，更新时显式对齐或标为待重定位，同时将防剧透上下文与历史按阅读位置过滤。对照修改前段/回退进度/允许过剧透的历史，若锚点错位或泄露不降则否定；假设未验证，新增版本和人工对齐负担。参见[Q05](#research-q05)。

单本授权书对照章节/原文和续播，修改前段后检查笔记/进度；分别核云文字流与防剧透历史。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 28 | 5928 | 4867 | 724 | — |
| .md | source | 1 | 188 | — | — | 3536 |
| .js | test | 5 | 849 | 740 | 64 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AIcivilization/dsh-audiobook/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AIcivilization/dsh-audiobook/issues?q=is%3Aissue+created%3A2026-09-23T01%3A50%3A33.084Z..2026-10-23T01%3A50%3A33.084Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AIcivilization/dsh-audiobook/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-23T01%3A50%3A33.084Z..2026-10-23T01%3A50%3A33.084Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 fad04c389bc4dfa828267fb9fb31aaf756560a47 和截止 2026-10-23T01:41:11Z 范围内，文档转有声书能为明确用户提供什么可核查增量，其关键限制、总成本和采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要文档转有声书，相对手工或宿主原生办法增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

主要用户是把阅读、听书与随手想法分散在多个应用的个人。插件把书源/本地文本导入、朗读和位置心得接在同一面板，成功标准为听到正确原文、断点可续和笔记能回对应段。简单替代为电子书朗读器加笔记工具，新增价值在Harness交接和模型讨论，未有理解/节时对照证明。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:8-22](https://github.com/AIcivilization/dsh-audiobook/blob/fad04c389bc4dfa828267fb9fb31aaf756560a47/README.md#L8-L22)

作者听书与数据边界定位

<details>
<summary>查看原文（15行）</summary>

````text
**Turn any book into an audiobook inside [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (dsh).**
Search public-domain libraries (Project Gutenberg, Wikisource, Internet Archive, Standard Ebooks) by title, author, a character's name or a half-remembered plot, or import your own EPUB, PDF, TXT, DOCX or Markdown file, and listen in the sidebar — Microsoft Edge neural voices, offline Kokoro, or your device's own voices; adjustable speed; it remembers where you stopped.

**搜一本书，或者导入一本书，读给你听。** 书名、作者、角色名、大概的情节都能搜；声音、语速可选，自动记住听到哪。DSH 插件，也能脱离 DSH 单独用。

<p align="center"><img src="https://raw.githubusercontent.com/AIcivilization/dsh-audiobook/main/docs/screenshot.jpg" width="360" alt="搜书听在 DSH 右侧栏朗读一本书：正在读的段落高亮，底部是播放条"></p>

```bash
dsh plugin --profile desktop add dsh-audiobook
```

- **能力分类**：工具与能力（有声书朗读 / 读书笔记）
- **运行要求**：Node.js ≥ 20；DSH web / desktop profile；ffmpeg 可选（装了就把本地语音压成 MP3）
- **许可证**：[MIT](LICENSE)
- **数据边界**：书、进度、心得都存在 DSH 所在机器的 `~/.dsh/dsh-audiobook/`；微软 Edge 语音需联网（文字发到微软服务器，README 有说明），浏览器朗读文字不出设备，语音识别用 DSH 自带本地模型（声音不外传）
````

</details>

**依据 2 · 源码核查**：[lib/notes.js:1-9](https://github.com/AIcivilization/dsh-audiobook/blob/fad04c389bc4dfa828267fb9fb31aaf756560a47/lib/notes.js#L1-L9)

位置/原话/整理字段模型

```text
// lib/notes.js — 读书心得、和 AI 的讨论、读后感
//
// books/<id>/notes.json  { notes: [...], reviews: [...] }
//   note:   { id, title, titleBy: auto|ai|user, seg, chapter, quote, text（原话）, polished?（AI 整理后的，原话保留）,
//             source: voice|typed|ai, createdAt, updatedAt }
//   标题：记下时先按原话顺手起一个（auto），有模型就在后台换成 AI 起的简短标题（ai）；用户改过的（user）不再动
//   review: { id, text, createdAt }  读后感（AI 按你的心得写的）
// books/<id>/chat.json   { messages: [{ role: user|ai, text, seg, at }] }  「问 AI」的讨论记录（最多留 60 条）
// 只存文字：录音识别完就删。
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 提取、分段、TTS与播放状态如何从入口形成完整调用链，依赖失效怎么办？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Host提供guarded前缀路由，connection存在时调用requestRejection，否则仅允许loopback；tools注册搜索、下载、导入、书库、正文、跳转和心得入口。importDocument取文字→buildSegments→saveBook，朗读引擎再按段合成/播放。Node、可读文本和一种语音必需，AI/ASR为附加需求；先核隐私/自动安装，再导入抽查、听读保存，缺文字层须先外部OCR而非假定成功。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/index.js:133-168](https://github.com/AIcivilization/dsh-audiobook/blob/fad04c389bc4dfa828267fb9fb31aaf756560a47/plugin/index.js#L133-L168)

鉴权、自动Edge与工具/路由接线

<details>
<summary>查看原文（36行）</summary>

```text
  /** 不放行就直接回状态码，返回 true */
  const rejected = (req, res) => {
    let code
    if (connection && typeof connection.requestRejection === 'function') code = connection.requestRejection(req)
    else if (!isLoopback(req.socket && req.socket.remoteAddress)) code = 403
    if (code === undefined) return false
    res.statusCode = code
    res.end()
    return true
  }
  const guarded = (req, res) => (rejected(req, res) ? undefined : handle(req, res))

  // 微软 Edge 语音组件：没装就在后台自动装（几秒到一分钟），用户不用点
  if (cfg.edge !== false) {
    const t = setTimeout(() => ensureEdge().catch(e => { try { ctx.logger ? ctx.logger.warn(e.message) : console.warn(e.message) } catch { /* 忽略 */ } }), 3000)
    if (t.unref) t.unref()
    if (typeof ctx.effect === 'function') ctx.effect(() => () => clearTimeout(t))
  }

  ctx.inject(['webServer'], (c) => {
    const ws = c.webServer || (c.get && c.get('webServer'))
    if (!ws || typeof ws.register !== 'function') return
    const reg = () => ws.register({ kind: 'prefix', path: PREFIX, handler: guarded })
    if (typeof c.effect === 'function') c.effect(reg)
    else reg()
  })

  // 工具注册表：注册自己的 AI 工具，也用来找能导入心得的知识库插件
  let toolRegistry
  ctx.inject(['tools'], (c) => {
    const tools = c.tools || (c.get && c.get('tools'))
    if (!tools || typeof tools.register !== 'function') return
    toolRegistry = tools
    if (typeof c.effect === 'function') c.effect(() => () => { if (toolRegistry === tools) toolRegistry = undefined })
    registerTools(tools, { effect: typeof c.effect === 'function' ? fn => c.effect(fn) : null })
      .catch(e => console.warn('[dsh-audiobook] AI 工具注册失败', e))
```

</details>

**依据 2 · 源码核查**：[lib/importer.js:19-47](https://github.com/AIcivilization/dsh-audiobook/blob/fad04c389bc4dfa828267fb9fb31aaf756560a47/lib/importer.js#L19-L47)

导入到段落存储链

<details>
<summary>查看原文（29行）</summary>

```text
export async function importDocument(file, opt = {}) {
  const st = await stat(file).catch(() => null)
  if (!st) throw Object.assign(new Error(`找不到文件：${file}`), { status: 400 })
  if (st.isDirectory()) throw Object.assign(new Error('请给一个文件，不是文件夹'), { status: 400 })
  if (st.size > 300 * 1024 * 1024) throw Object.assign(new Error('文件太大（最多 300 MB）'), { status: 400 })
  let doc = await extractDocument(file, { name: opt.name })
  if (opt.transform) doc = opt.transform(doc)
  const { chapters, segs, chars } = buildSegments(doc.chapters)
  if (!segs.length) throw Object.assign(new Error('文档里没有可以朗读的文字'), { status: 400 })
  const title = (opt.title && String(opt.title).trim().slice(0, 120)) || doc.title
  // 编号按内容算：同一本书换个地方再导入，还是同一本，进度接得上
  const fingerprint = opt.fingerprint || createHash('sha1').update(segs.join('\n')).digest('hex')
  const id = makeId(title, fingerprint)
  const old = await getBook(id)
  const book = {
    id,
    version: 1,
    title,
    author: doc.author,
    format: doc.format,
    source: opt.source || file,
    chars,
    segCount: segs.length,
    chapters,
    createdAt: (old && old.createdAt) || Date.now(),
    ...(opt.extra || {}),
  }
  await saveBook(book, segs)
  return { ...summary(book, await getProgress(id)), existed: Boolean(old) }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么实现边界最可能使文档转有声书的贡献不成立，哪些工程设计可复用？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

核心质疑是位置关联与“本地/防剧透”承诺的范围。书源fingerprint固定source:ref，重导覆盖text/book而旧progress保留，新段落插入会使数字位置变化；笔记引用亦需核对。Edge和AI分别处理文字，自动安装会拉Python/edge-tts。context只到当前段但history带先前讨论，模型还可知道结局，所以防剧透是软约束。原子写及每文件队列可借鉴，但没有多文件事务。

#### 证据与依据

**依据 1 · 源码核查**：[lib/importer.js:69-72](https://github.com/AIcivilization/dsh-audiobook/blob/fad04c389bc4dfa828267fb9fb31aaf756560a47/lib/importer.js#L69-L72)

书源复用稳定ID

```text
      extra: { from: { source, ref } },
      // 同一本书再下一次（书源更新了、或者清理规则改了）还是同一本，进度接得上
      fingerprint: `${source}:${ref}`,
    })
```

**依据 2 · 源码核查**：[lib/store.js:54-70](https://github.com/AIcivilization/dsh-audiobook/blob/fad04c389bc4dfa828267fb9fb31aaf756560a47/lib/store.js#L54-L70)

覆盖文本保留进度

<details>
<summary>查看原文（17行）</summary>

```text
/** 存一本新书（书 + 朗读段）；同编号的书已存在时覆盖内容，进度保留 */
export async function saveBook(book, segs) {
  checkId(book.id)
  await mkdir(bookDir(book.id), { recursive: true })
  await serial(book.id + ':text', () => writeJson(textPath(book.id), { segs }, false))
  await serial(book.id + ':book', () => writeJson(bookPath(book.id), book))
  return book
}

/** 记下听到第几段（越界的夹到最后一段） */
export function setProgress(id, seg, total) {
  return serial(id + ':progress', async () => {
    const p = await getProgress(id)
    const max = Math.max(0, (total ?? Infinity) - 1)
    p.seg = Math.min(max, Math.max(0, Math.floor(Number(seg) || 0)))
    p.updatedAt = Date.now()
    await writeJson(progressPath(id), p)
```

</details>

**依据 3 · 源码核查**：[lib/notes.js:279-292](https://github.com/AIcivilization/dsh-audiobook/blob/fad04c389bc4dfa828267fb9fb31aaf756560a47/lib/notes.js#L279-L292)

阅读上下文与未按位置过滤的历史

<details>
<summary>查看原文（14行）</summary>

```text
  const s = Math.min(Math.max(0, Math.floor(Number(seg) || 0)), segs.length - 1)
  const ctx = contextText(book, segs, s)
  const history = (await getChat(id)).slice(-12)
  let material = `书：《${book.title}》${book.author ? `，${book.author}` : ''}\n用户正在听：${ctx.chapter}（全书第 ${s + 1}/${segs.length} 段）\n`
  if (ctx.prev) material += `\n【上一章「${ctx.prevChapter}」的结尾】\n${ctx.prev}\n`
  material += `\n【本章到用户正在听的位置为止】\n${ctx.body}\n`
  if (mode === 'notes') {
    const { notes } = await getNotes(id)
    material += `\n【用户这本书的读书心得（按位置排）】\n${notes.sort((a, b) => a.seg - b.seg).map(n => `- ${day(n.createdAt)} [${n.chapter}] 「${n.title || ''}」摘句「${n.quote}」：${n.polished || n.text}`).join('\n').slice(0, 8000) || '（还没有）'}\n`
  }
  const talk = history.length ? `\n【之前的讨论】\n${history.map(m => `${m.role === 'user' ? '用户' : '你'}：${m.text}`).join('\n')}\n` : ''
  const answer = String(await llm.complete({
    system: askSystem(spoilers) + (mode === 'notes' ? '\n- 这次围绕用户自己的读书心得聊：可以回应、追问、对比前后想法的变化，帮用户想得更深，不要只是夸' : ''),
    user: `${material}${talk}\n用户：${q}`,
```

</details>

**依据 4 · 源码核查**：[lib/edge.js:99-105](https://github.com/AIcivilization/dsh-audiobook/blob/fad04c389bc4dfa828267fb9fb31aaf756560a47/lib/edge.js#L99-L105)

联网安装Python组件

```text
  try { await run(venvPy, ['-m', 'pip', '--version'], { timeout: 30000 }) } catch {
    const getPip = join(edgeDir(), 'get-pip.py')
    await download('https://bootstrap.pypa.io/get-pip.py', getPip)
    await run(venvPy, [getPip, '-q', '--disable-pip-version-check'])
    await rm(getPip, { force: true })
  }
  await run(venvPy, ['-m', 'pip', 'install', '-q', '--disable-pip-version-check', '--upgrade', 'edge-tts'])
```

#### 缺口

- 原文更新、跨设备并发和剧透边界缺少真实验收
  **影响**：不能保证锚点或内容隔离
  **进一步探讨**：以修改段落和先读后回退的书测位置/历史，并核文字外发链

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？

**研究主题**：效果与总成本

#### 完整回答

首次需配置语音/可选ASR模型、审授权文本与自动安装；持续付出TTS、缓存、AI调用与人工核对；失败需重合成或修提取，并恢复位置/笔记。AI整理保留原话有助纠错但仍需审查。缺实际金额、合格朗读时长、错误率和人工工时，作者单设备等待数字不能外推。

#### 证据与依据

**依据 1 · 源码核查**：[lib/store.js:18-31](https://github.com/AIcivilization/dsh-audiobook/blob/fad04c389bc4dfa828267fb9fb31aaf756560a47/lib/store.js#L18-L31)

文件原子写和进程内队列

<details>
<summary>查看原文（14行）</summary>

```text
/** 先写临时文件再改名：写到一半断电也不会把书弄坏 */
async function writeJson(path, value, pretty = true) {
  const tmp = `${path}.${process.pid}.${randomUUID().slice(0, 8)}.tmp`
  await writeFile(tmp, pretty ? JSON.stringify(value, null, 1) : JSON.stringify(value))
  await rename(tmp, path)
}

// 同一个文件的写入排队，免得两个请求同时写把对方覆盖掉
const queues = new Map()
function serial(key, fn) {
  const prev = queues.get(key) || Promise.resolve()
  const next = prev.then(fn, fn)
  queues.set(key, next.catch(() => {}))
  return next
```

</details>

**依据 2 · 源码核查**：[lib/notes.js:302-319](https://github.com/AIcivilization/dsh-audiobook/blob/fad04c389bc4dfa828267fb9fb31aaf756560a47/lib/notes.js#L302-L319)

读后感依赖模型和人工事实边界

<details>
<summary>查看原文（18行）</summary>

```text
/** AI 按用户的心得写读后感：观点都来自用户，AI 只组织成文 */
export async function writeReview(llm, id) {
  if (!llm) throw bad('没有可用的模型：请在 DSH 里选一个默认模型')
  const book = await getBook(id)
  if (!book) throw bad('没有这本书', 404)
  const { notes } = await getNotes(id)
  if (!notes.length) throw bad('这本书还没有心得：先记几条，再来写读后感')
  const text = String(await llm.complete({
    system: `根据用户的读书心得，替用户写一篇读后感。
- 观点、感受全部来自用户的心得，不要编造用户没表达过的看法，也不要编造用户的经历和动作（比如「我几次合上书」）；可以补充必要的情节背景，让文章读得通
- 第一人称，自然朴实，800 字左右；可以引用心得里摘的原文
- 只输出读后感正文，第一行是标题`,
    user: `书：《${book.title}》${book.author ? `，${book.author}` : ''}\n\n用户的心得（按阅读顺序）：\n${notes.sort((a, b) => a.seg - b.seg).map(n => `- [${n.chapter}] 摘句「${n.quote}」：${n.polished || n.text}`).join('\n').slice(0, 12000)}`,
    maxTokens: 3000,
  })).trim()
  if (!text) throw new Error('模型没有返回内容')
  const review = { id: randomUUID().slice(0, 12), text, createdAt: Date.now() }
  await mutate(id, (j) => { j.reviews.unshift(review) })
```

</details>

**依据 3 · 源码核查**：[plugin/index.js:145-149](https://github.com/AIcivilization/dsh-audiobook/blob/fad04c389bc4dfa828267fb9fb31aaf756560a47/plugin/index.js#L145-L149)

默认后台安装的资源与供应链

```text
  // 微软 Edge 语音组件：没装就在后台自动装（几秒到一分钟），用户不用点
  if (cfg.edge !== false) {
    const t = setTimeout(() => ensureEdge().catch(e => { try { ctx.logger ? ctx.logger.warn(e.message) : console.warn(e.message) } catch { /* 忽略 */ } }), 3000)
    if (t.unref) t.unref()
    if (typeof ctx.effect === 'function') ctx.effect(() => () => clearTimeout(t))
```

#### 缺口

- 每合格小时朗读的资源/审校成本未知
  **影响**：不能量化相对阅读器的净收益
  **进一步探讨**：同书同语音对照导入、听读、位置恢复及笔记复核总投入

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可从提取、分段、TTS与播放状态的限制推导什么可证伪改进？

**研究主题**：新假设与验证

#### 完整回答

未验证设计是版本化内容锚点：进度与笔记既存seq也存原文摘要，重导执行可解释对齐并保留旧版；讨论历史按其阅读位置过滤。它针对当前source:ref稳定而段索引不稳定、history无过滤两处限制。对照插入/删段与回退阅读，出现错锚或剧透不减便否定，存储和人工确认成本须单列。

#### 证据与依据

**依据 1 · 源码核查**：[lib/store.js:54-70](https://github.com/AIcivilization/dsh-audiobook/blob/fad04c389bc4dfa828267fb9fb31aaf756560a47/lib/store.js#L54-L70)

数字进度与覆盖内容的关系

<details>
<summary>查看原文（17行）</summary>

```text
/** 存一本新书（书 + 朗读段）；同编号的书已存在时覆盖内容，进度保留 */
export async function saveBook(book, segs) {
  checkId(book.id)
  await mkdir(bookDir(book.id), { recursive: true })
  await serial(book.id + ':text', () => writeJson(textPath(book.id), { segs }, false))
  await serial(book.id + ':book', () => writeJson(bookPath(book.id), book))
  return book
}

/** 记下听到第几段（越界的夹到最后一段） */
export function setProgress(id, seg, total) {
  return serial(id + ':progress', async () => {
    const p = await getProgress(id)
    const max = Math.max(0, (total ?? Infinity) - 1)
    p.seg = Math.min(max, Math.max(0, Math.floor(Number(seg) || 0)))
    p.updatedAt = Date.now()
    await writeJson(progressPath(id), p)
```

</details>

**依据 2 · 源码核查**：[lib/notes.js:279-292](https://github.com/AIcivilization/dsh-audiobook/blob/fad04c389bc4dfa828267fb9fb31aaf756560a47/lib/notes.js#L279-L292)

历史上下文的重定位切入点

<details>
<summary>查看原文（14行）</summary>

```text
  const s = Math.min(Math.max(0, Math.floor(Number(seg) || 0)), segs.length - 1)
  const ctx = contextText(book, segs, s)
  const history = (await getChat(id)).slice(-12)
  let material = `书：《${book.title}》${book.author ? `，${book.author}` : ''}\n用户正在听：${ctx.chapter}（全书第 ${s + 1}/${segs.length} 段）\n`
  if (ctx.prev) material += `\n【上一章「${ctx.prevChapter}」的结尾】\n${ctx.prev}\n`
  material += `\n【本章到用户正在听的位置为止】\n${ctx.body}\n`
  if (mode === 'notes') {
    const { notes } = await getNotes(id)
    material += `\n【用户这本书的读书心得（按位置排）】\n${notes.sort((a, b) => a.seg - b.seg).map(n => `- ${day(n.createdAt)} [${n.chapter}] 「${n.title || ''}」摘句「${n.quote}」：${n.polished || n.text}`).join('\n').slice(0, 8000) || '（还没有）'}\n`
  }
  const talk = history.length ? `\n【之前的讨论】\n${history.map(m => `${m.role === 'user' ? '用户' : '你'}：${m.text}`).join('\n')}\n` : ''
  const answer = String(await llm.complete({
    system: askSystem(spoilers) + (mode === 'notes' ? '\n- 这次围绕用户自己的读书心得聊：可以回应、追问、对比前后想法的变化，帮用户想得更深，不要只是夸' : ''),
    user: `${material}${talk}\n用户：${q}`,
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些用户可以受控采用文档转有声书，何时应停止？

**研究主题**：采用判断

#### 完整回答

有合法读物且愿抽查的个人可先用单本低敏感书、浏览器朗读试用，再选择云语音或AI。需严格无外发、无剧透和稳定档案者暂缓。验收为章节顺序、断点和心得引用都对，更新前保留备份；错位、敏感文字外发或原话被错误整理就停用相关能力，卸载不删除书库。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:98-114](https://github.com/AIcivilization/dsh-audiobook/blob/fad04c389bc4dfa828267fb9fb31aaf756560a47/README.md#L98-L114)

工具与卸载留存说明

<details>
<summary>查看原文（17行）</summary>

````text

- 「帮我找那本主角叫贾宝玉的书来听」：AI 自己判断书名，用 `audiobook_search` 搜，`audiobook_download` 下进书架
- 「把我读《呼啸山庄》的心得整理一下」「我最近一个月的读书心得有什么共同点」：`audiobook_notes`
- 「把这个想法记到心得里」：`audiobook_add_note`
- 「把 ~/Downloads/三体.epub 导入搜书听」：`audiobook_import`
- 「我在听哪些书？听到哪了？」：`audiobook_books`
- 「刚才那段讲了什么？」「阿青第一次出场在哪？」「把第三章讲给我听」：`audiobook_text`，可以取刚听过的内容、在全书里找词、按章取正文
- 「跳到第十章」「跳到阿青出场的地方」：`audiobook_goto`。面板没在播放时几秒内就会跟上新位置

**更新 / 卸载**：在 DSH 的「设置 → 搜书听」里。卸载只移除插件，书和收听进度留在 `~/.dsh/dsh-audiobook`。

## 安装

装进 DSH（把 `desktop` 换成你的 profile 名；先完全退出 DSH）：

```bash
dsh plugin --profile desktop add dsh-audiobook
````

</details>

**依据 2 · 源码核查**：[lib/store.js:87-89](https://github.com/AIcivilization/dsh-audiobook/blob/fad04c389bc4dfa828267fb9fb31aaf756560a47/lib/store.js#L87-L89)

删除书库需显式操作

```text
export async function deleteBook(id) {
  await rm(bookDir(checkId(id)), { recursive: true, force: true })
}
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
