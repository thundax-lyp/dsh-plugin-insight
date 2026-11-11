# dsh-meme

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[48e10fe](https://github.com/yyh-001/dsh-meme/tree/48e10fedf1951d84c9eca4247f5c5bbc2ae38871)

<!-- BEGIN META -->
[![GitHub ★ 552](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=552&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yyh-001/dsh-meme) [![npm 30d 77,268](https://img.shields.io/static/v1?label=npm+30d&message=77%2C268&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-meme) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-meme)
<!-- END META -->

> **功能**：在 DeepSeek Harness 会话中搜索和发送表情包，并管理、自建或导入图库。

> **亮点**：[Q01](#research-q01) 搜索、筛图库、选图与当前草稿接在同一界面，用户可选择先留草稿再提交。

> **主要限制**：[Q02](#research-q02) 不同会话的候选结果和投递方不同，工具返回不能证明接收端状态。[Q03](#research-q03) 收录时文件可能先于索引存在。

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
  - [Q01 · Web 选图如何影响已有草稿与提交？](#detail-section-11)
  - [Q02 · AI 的候选和渠道实际投递如何衔接？](#detail-section-12)
  - [Q03 · 本地收录与对外访问如何影响成本和恢复？](#detail-section-13)
  - [Q04 · 如何在现有手动流程上验证防误发增量？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：常在 DSH Web 聊天里配图的用户，可以在输入框旁选图库图片并和已有草稿一起发送。

手工从图库文件夹选择并上传可以准确挑图。插件增加聊天内筛选及草稿接线，收益取决于图库质量和宿主或渠道支持。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Web 选图 | 筛选并插入草稿 | 直接提交由设置控制 |
| AI 找图 | 按情绪和词查候选 | 实际投递因渠道而异 |
| 收录 | 给自有图库写图片和索引 | 模型仅在自动识别路径需要 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web、Node 和图库 | 本机试用必需 | 加载输入选择与本地资源 | 改手工上传 |
| 识图模型 | 自动补分类时需要 | 提取标签和说明 | 提供人工分类 |
| 实际渠道工具 | IM 试用需要 | 投递候选图片 | 仅在本地 Web 验证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 使用者选非敏感测试图库并关闭点击即发送 | 先留草稿核对 |
| 选图 | 筛选候选并插入原草稿 | 检查已有文字和图片 |
| 退出 | 错图、草稿变化或仅出描述时回原流程 | 通过手工上传确认目标内容 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地存储和插件资源未知 | 配测试图库与设置 | 宿主兼容未验 |
| 持续 | 识图与渠道处理费用未知 | 核对候选和维护标签 | 节时未知 |
| 失败恢复 | 备份和索引资源未测 | 核查落盘与发送 | 收录失败需检查残留 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话内选图 | 候选筛选与草稿接线 | 真实用户误发率 |
| 渠道配图 | 输出区分 Web 标记及外部工具 | 接收端投递 |
| 图库收录 | 文件、SQLite 与索引刷新 | 异常后恢复速度 |

> **思考**：[Q02](#research-q02) 不同会话的候选结果和投递方不同，工具返回不能证明接收端状态。[Q03](#research-q03) 收录时文件可能先于索引存在。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 搜索、筛图库、选图与当前草稿接在同一界面，用户可选择先留草稿再提交。

先保留宿主插入锚点，再回退追加草稿。图库文件和索引分步写入，接收端也需独立读回。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 不同会话的候选结果和投递方不同，工具返回不能证明接收端状态。[Q03](#research-q03) 收录时文件可能先于索引存在。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用一条非敏感草稿核对图片与文字，发现错图或标记未渲染时暂停选择器并手工上传。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定提交已核查 Web 草稿分支、候选和收录路径。渠道投递、接收端及恢复行为未运行验证。

- 已检查：作者 README、包清单、源码路径 client.js、index.js、memes.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本只读抽查 Web 选图、渠道投递指引和图库收录；未安装或运行宿主、渠道、识图与测试。
- 下一步：在隔离会话比较两种点击设置，再分别对收录索引与渠道投递注入失败并核对可见状态。

**分析版本**

- **仓库**：[yyh-001/dsh-meme](https://github.com/yyh-001/dsh-meme)
- **版本号**：0.1.80（[固定提交 48e10fe](https://github.com/yyh-001/dsh-meme/tree/48e10fedf1951d84c9eca4247f5c5bbc2ae38871)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 将 IM 图片候选、目标会话与用户确认绑定，可能减少错图和错目标，需用目标切换对照验证。

在隔离会话比较两种点击设置，再分别对收录索引与渠道投递注入失败并核对可见状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 870 | — | — | 13197 |
| .js | source | 9 | 9433 | 6994 | 2309 | — |
| .cjs | source | 1 | 10 | 10 | 1 | — |
| .tsx | source | 2 | 412 | 334 | 81 | — |
| .mjs | test | 48 | 9964 | 8158 | 1076 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/yyh-001/dsh-meme/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 25](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=25&color=737b86&logo=github)](https://github.com/yyh-001/dsh-meme/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 27](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=27&color=737b86&logo=github)](https://github.com/yyh-001/dsh-meme/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：经常在 DSH 对话中配图的用户能否准确选择已知图片，控制何时发送，并发现渠道或图库失败？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Web 选图如何影响已有草稿与提交？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

在 DSH Web 对话里常用固定图片回应的用户，可以用输入旁选图面板筛图库、情绪与关键词。一条合格消息应保留原草稿，配上预期图片并在用户想发送时才提交。客户端将候选说明制成描述标记，设置关闭点击即发送时，先使用宿主插入锚点插到光标处，API 缺失或失败则把标记追加到草稿。若设置开启，拼好草稿后即尝试调用宿主 submit，并关闭面板，错误捕获没有向用户提供失败说明。相比到外部目录翻找并上传，选图进入当前草稿，减少路径切换。最终标记如何显示还取决于宿主及插件匹配，不能把草稿出现等同于对方收到图片。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-36](https://github.com/yyh-001/dsh-meme/blob/48e10fedf1951d84c9eca4247f5c5bbc2ae38871/README.md#L24-L36)

作者介绍选择器、手动和主动配图及渠道差异。

<details>
<summary>查看原文（13行）</summary>

```text
> [!IMPORTANT]
> **dsh-meme 是 DeepSeek Harness 的插件，不是独立应用。**  
> 需要先装好 DSH，再通过插件市场或 CLI 装进某个 profile；社区开源项目，并非 DeepSeek 官方产品。

## 功能

- 😊 **一键发图** — 输入框旁点 😊，搜索、按图库或情绪筛选，点一张直接发送；设置页可关掉「点图直接发送」，关闭后点一张只把 `[表情: 描述]` 插到输入框光标处，按回车和文字一起发出，手滑也不会误发。
- 🎭 **主动斗图** — AI 会按聊天情绪自己找图接梗，不用等你开口；设置页可选「主动发图」四档：关闭 / 看气氛 / 活跃 / 每轮都发，也能改写提示词调整风格。
- 📱 **IM / 手机斗图** — QQ、微信、飞书等经 dsh-im 接入后，表情包以原生图片消息发出，不用写文字标记；手机/平板经电脑局域网 IP 打开 DSH Web，设置页打开「局域网访问图库」即可收发（默认关）。QQ 大图容易被客户端当图片消息拉伸，可打开「QQ 发图尺寸」把发送副本缩到 200–450px，Web 仍用原图。
- 🧠 **学会新图** — 上传图片后说「把这张图入库」，AI 自动识别分类和描述；也可以把图片文件直接拷进图库目录，点「扫描新增」一键入库（动图 GIF 建议走这条，原始动画保留；文件改名/删除后扫描会顺手清理失效记录）。
- 🗂️ **整理图库** — 跟 AI 说「列一下表情包清单」「帮我查查重复」「把这张改成 work 分类」——内置 `meme_list` / `meme_update` 维护工具，改分类/描述/关键词不用手动翻面板（删除留在面板，防误删）。
- 📦 **管理与分享** — 多图库开关、上传与编辑、ZIP 导入导出、市场安装与更新。
- 🚀 **开箱即用** — 内置大肥鱼图库（24 张），核心功能零第三方运行依赖，使用 Node 内置 SQLite；QQ 缩图是可选能力（dsh-im 已自带 sharp，未安装时按原图发送）。
```

</details>

**依据 2 · 源码核查**：[package.json:31-48](https://github.com/yyh-001/dsh-meme/blob/48e10fedf1951d84c9eca4247f5c5bbc2ae38871/package.json#L31-L48)

清单将当前客户端和宿主依赖声明给 Web profile。

<details>
<summary>查看原文（18行）</summary>

```text
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "platform": "web"
    }
```

</details>

**依据 3 · 源码核查**：[client.js:2790-2817](https://github.com/yyh-001/dsh-meme/blob/48e10fedf1951d84c9eca4247f5c5bbc2ae38871/client.js#L2790-L2817)

生成标记，优先插入并在失败时追加。

<details>
<summary>查看原文（28行）</summary>

```text
      const markerOf = (m) => {
        const desc = (m.caption || m.keywords || m.tag || '表情包').slice(0, 80)
        return '[表情: ' + desc + ']'
      }
      const draftOf = () => (inputState && typeof inputState.draft === 'string' ? inputState.draft : '')
      // 光标处插入优先:宿主公开的 insertText 需要同一轮拿到的插入锚点(captureInsertion),
      // 不会覆盖草稿,也不会把已有的 quote chip 清掉。拿不到这套 API、或者当前 phase 冻结
      // (模型还在输出)时插入会失败,退回 setDraft 追加 —— 与旧版拼法一致,至少不丢草稿。
      const insert = (m) => {
        if (!m) return
        const marker = markerOf(m)
        let inserted = false
        try {
          if (actions && typeof actions.captureInsertion === 'function' && typeof actions.insertText === 'function') {
            inserted = actions.insertText(marker, actions.captureInsertion()) === true
          }
        } catch (e) { inserted = false }
        if (!inserted) {
          const cur = draftOf()
          setText(cur.trim() ? cur + '\n' + marker : marker)
        }
        store.set(false)
        // 面板一关焦点就掉到 body 了,直接敲回车不会发;顺手把焦点还给输入框,
        // 让「选图 → 接着打字 → 回车」一串动作不用再点一下。宿主结构变了就静默跳过。
        try {
          const editor = document.querySelector('[data-composer-card] [contenteditable="true"]')
          if (editor && typeof editor.focus === 'function') editor.focus()
        } catch (e) { /* 纯增强 */ }
```

</details>

**依据 4 · 源码核查**：[client.js:2819-2843](https://github.com/yyh-001/dsh-meme/blob/48e10fedf1951d84c9eca4247f5c5bbc2ae38871/client.js#L2819-L2843)

直接提交分支及图库、情绪、关键词筛选接线。

<details>
<summary>查看原文（25行）</summary>

```text
      // 设置开启时:拼草稿并立即发送
      const sendNow = (m) => {
        if (!m) return
        const cur = draftOf()
        const marker = markerOf(m)
        setText(cur.trim() ? cur + '\n' + marker : marker)
        try { if (actions && actions.submit) actions.submit() } catch (e) {}
        store.set(false)
      }
      const pick = (m) => {
        if (data.pickerSendOnClick !== false) sendNow(m)
        else insert(m)
      }

      // 多选 chip:点一下选中(只看它),再点取消;一个都不选 = 不筛
      const toggle = (list, setList, id) => setList(list.includes(id) ? list.filter((x) => x !== id) : list.concat([id]))
      const clearAll = () => { setQ(''); setSelPacks([]); setSelTags([]) }
      const hasFilter = !!(q.trim() || selPacks.length || selTags.length)
      const selCount = selPacks.length + selTags.length
      // 展开状态记到模块级:面板关掉再打开不用重新展开(同一页面会话内)
      const toggleFilters = () => { const next = !showFilters; pickerFiltersOpen = next; setShowFilters(next) }

      const tagCounts = pickerTagCounts(data.memes, selPacks)
      const rows = pickerFilter(data.memes, selPacks, selTags, q)
      const cells = rows.slice(0, PICKER_MAX_CELLS)
```

</details>

#### 缺口

- 未在真实宿主验证草稿、引用或发送状态。
  **影响**：无法保证宿主更新后仍保留草稿和焦点。
  **进一步探讨**：用含引用和前后文字的草稿，在直接与预览两档核对发出内容。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · AI 的候选和渠道实际投递如何衔接？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

候选选择使用关键词、标签及有条件的情绪抽样，适合减少本地图库查找范围；错标或关键词缺失仍会漏图或给出不合语境的候选。Web 模式返回描述标记，模型需要把对应文本写入回复，IM 模式要求把候选磁盘路径交给独立渠道工具。QQ 服务存在时，另一分支解析已存路径并调用 sendImage；这里没有 await，返回已发送只证明调用没有同步抛错，不能当远端确认。纯文字模式拒绝直接发送，模型指令也约束不要输出标记或调用渠道，但跨插件权限和真实投递由实际渠道决定。只在单独 Web 会话试用时无需验证外部渠道，若试 IM 则需要单独验收目标会话、返回工具和接收端。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1119-1168](https://github.com/yyh-001/dsh-meme/blob/48e10fedf1951d84c9eca4247f5c5bbc2ae38871/index.js#L1119-L1168)

候选按关键词、标签查询，只有条件满足时回退至情绪类别。

<details>
<summary>查看原文（50行）</summary>

```text
    search({ query = '', tag = '', limit = 8 } = {}) {
      const n = Math.max(1, Math.min(Number(limit) || 8, 30))
      const q = String(query || '').trim()
      const t = String(tag || '').trim().toLowerCase()
      const rows = []
      if (q) {
        const found = sampler.search(q, n, t)
        for (const row of found.memes) rows.push(row)
      } else {
        const sampled = sampler.sampleMood(t, '', n)
        for (const row of sampled.memes) rows.push(row)
      }
      const memes = rows
        .map((row) => {
          const info = packInfoOf(row)
          return {
            path: absMemePath(row),
            tag: row.tag,
            caption: row.caption || row.file_name || '',
            keywords: row.keywords || '',
            pack: info.pack,
            packName: info.packName,
          }
        })
        .filter((m) => m.path)
      return { ok: true, query: q, memes }
    },
    /**
     * 挑一张:先按关键词精确检索;查不到(且给了 tag)再按情绪抽;query/tag 都没给、
     * 或都没命中就返回 ok:false + reason/tags/tagStats,让调用方决定换词还是别配图
     * (不会瞎塞一张)。
     */
    pick({ query = '', tag = '', limit = 8 } = {}) {
      const q = String(query || '').trim()
      const t = String(tag || '').trim().toLowerCase()
      if (!q && !t) return pickFailure('没有给关键词(query)或情绪桶(tag)')
      const direct = memeService.search({ query: q, tag: t, limit })
      if (direct.memes.length > 0) {
        const first = direct.memes[0]
        return { ok: true, path: first.path, tag: first.tag, caption: first.caption, keywords: first.keywords, pack: first.pack, packName: first.packName }
      }
      if (q && t) {
        // 关键词没命中时,给个情绪桶兜底(但只挑 tag 匹配的,不跨情绪乱给)
        const byTag = memeService.search({ query: '', tag: t, limit })
        if (byTag.memes.length > 0) {
          const first = byTag.memes[0]
          return { ok: true, path: first.path, tag: first.tag, caption: first.caption, keywords: first.keywords, pack: first.pack, packName: first.packName }
        }
      }
      return pickFailure(q ? `没找到「${q}」相关的图` : '没有打开的图库')
```

</details>

**依据 2 · 源码核查**：[index.js:1206-1215](https://github.com/yyh-001/dsh-meme/blob/48e10fedf1951d84c9eca4247f5c5bbc2ae38871/index.js#L1206-L1215)

QQ 发送服务或 Web 路由存在时注册工具。

<details>
<summary>查看原文（10行）</summary>

```text
  const sendImage = qq !== undefined && typeof qq.sendImage === 'function'
    ? (path, caption) => qq.sendImage(path, caption)
    : null
  if (sendImage || urlPrefix) {
    registerToolWhenReady(ctx, 'send_meme', () => {
      registerSendMemeTool(ctx, sampler, sendImage, urlPrefix, imToolOptions())
      console.log(`[dsh-expression] send_meme 已注册(${sendImage ? 'QQ' : 'Web'}通道${!sendImage && hasImDelivery() ? '+IM' : ''},${urlPrefix || '无路由'})`)
    })
  } else {
    console.log('[dsh-expression] 无可用发送通道(需要 dsh-companion 的 QQ 或 webServer),未注册 send_meme')
```

</details>

**依据 3 · 源码核查**：[memes.js:927-962](https://github.com/yyh-001/dsh-meme/blob/48e10fedf1951d84c9eca4247f5c5bbc2ae38871/memes.js#L927-L962)

直接发送路径验证、同步调用和纯文字分支。

<details>
<summary>查看原文（36行）</summary>

```text
      if (action === 'send') {
        if (textMode) {
          return { ok: false, message: '当前发送方式是「纯文字」,不发图片;直接用文字接梗/描述即可' }
        }
        if (!path) {
          return { ok: false, message: 'send 需要 path——先 search 看候选,再挑一张发' }
        }
        let absolute
        try {
          absolute = memes.resolveStored(path)
        } catch (error) {
          return { ok: false, message: '未知路径: ' + path + ' —— 用 search 的候选 path' }
        }
        if (prepareSendPath) {
          try {
            const prepared = await prepareSendPath(absolute, { mode: 'direct' })
            if (typeof prepared === 'string' && prepared) absolute = prepared
          } catch { /* 缩图失败按原图发送 */ }
        }
        if (sendImage) {
          try {
            sendImage(absolute)
            return { ok: true, message: '已发送表情包', path }
          } catch (error) {
            return { ok: false, message: '发送失败: ' + (error instanceof Error ? error.message : String(error)) }
          }
        }
        return { ok: false, message: '没有可用发送通道: ' + absolute }
      }

      // 这一轮来自 dsh-im 的 IM 渠道时,图片只能作为原生图片发出:
      // [表情: 描述] 标记只有 Web 前端会配图,IM 聊天里它只是一行方括号文字。
      // 所以候选要带上绝对路径,交给 dsh-im 的 dsh_im_return_file 投递。
      const imChannel = !sendImage && imChannelOf ? imChannelOf(exec?.agent?.session) : null
      // 纯文字模式:Web/IM 都不发图;候选不带路径,免得模型顺手把 path 交给投递工具
      const imMode = !textMode && !sendImage && !!imChannel
```

</details>

**依据 4 · 源码核查**：[memes.js:1022-1034](https://github.com/yyh-001/dsh-meme/blob/48e10fedf1951d84c9eca4247f5c5bbc2ae38871/memes.js#L1022-L1034)

不同会话工具输出不同投递指引。

<details>
<summary>查看原文（13行）</summary>

```text
      const howToSend = textMode
        ? '发图:当前发送方式是「纯文字」,不发图片——不要写 [表情: ...] 或 [任何描述] 这类方括号标记,不要调用 dsh_im_return_file 或 qqbot_send_file,也不要把图片路径贴进回复;把下面某一行「描述=」的原文用进你的文字回复里,接梗/吐槽/卖萌即可。'
        : chanceNote +
          (imageMode ? '当前发送方式是「图片」:挑好图就必须真的发出去,不能只写文字描述。' : '') +
          (imMode
            ? (chanceBlocked ? '发图:只在用户明确要图时,把挑中的那一行 path 原样传给 dsh_im_return_file(path=...)' : '发图:把挑中的那一行 path 原样传给 dsh_im_return_file(path=...)') +
              '——它会作为 ' + imLabel +
              ' 原生图片消息发出' + (chanceBlocked ? '。' : ';不用等用户要求,现在就能主动发。') +
              '回复正文只写普通文字:不要写 [表情: ...] 或 [任何描述] 这类方括号标记,不要写 markdown 图片或把本地路径贴进回复,也不用解释图片投递过程——图片会由渠道自己发出。'
            : webMode
              ? (chanceBlocked ? '发图:只在用户明确要图时,把下面某一行的 [表情: ...] 整段原样写进回复' : '发图:把下面某一行的 [表情: ...] 整段原样写进回复') +
                '(描述抄候选原文,可加一两句文字,不要加网址)。候选 JSON 里的 path/library 只是出处信息,用户问「这图哪个库的/文件叫什么」可以引用;发图仍然只写 [表情: 描述],不要把路径贴进回复。' +
                '如果本会话的工具表里有 qqbot_send_file(QQ 官方机器人的 dsh-qqbot 插件),说明当前是 QQ 机器人会话:此时不要写 [表情: ...] 标记,把挑中候选的 absPath(绝对路径)原样传给 qqbot_send_file 的 file_path 参数发出,正文只写普通文字、不要贴路径;若它返回路径白名单拒绝,提示用户在 dsh-qqbot 配置的 sendFile.extraRoots 里加上图库目录(通常是 ~/.dsh/meme-packs)。'
```

</details>

#### 缺口

- 未执行 IM 或 QQ，且未核对外部渠道的确认语义。
  **影响**：不能从本包工具结果确认接收端收到。
  **进一步探讨**：在单独测试聊天核对所选图片、目标、返回状态和接收端。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地收录与对外访问如何影响成本和恢复？

**研究主题**：工程质量与复用、依赖、兼容与流程、效果与总成本

#### 完整回答

没有手工分类时，收录把图片字节交给识图服务并取标签和说明。随后文件先写个人图库，SQLite 再插入元数据，最终刷新索引。数据库插入失败后返回错误，该 catch 分支没有删除已写文件，图库中可能留下未索引文件。模型不可用时可改用明确分类走人工路径，并对失败文件单独核对。路由会根据 Host 判定回环、显式信任域名或启用局域网后的本地地址；这只说明本包 Host 策略，不建立终端用户身份，也不说明反向代理部署已隔离。资源代价分图库占用、可选识图和渠道处理，人工代价分准备标签、验证发图和索引排错；当前没有单次任务测量。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1501-1523](https://github.com/yyh-001/dsh-meme/blob/48e10fedf1951d84c9eca4247f5c5bbc2ae38871/index.js#L1501-L1523)

没有标签才调用识图，随后先写文件。

<details>
<summary>查看原文（23行）</summary>

```text
          if (buf.byteLength === 0 || buf.byteLength > 8 * 1024 * 1024) return { ok: false, message: '图片大小超限(≤8MB)' }
          // 未指定分类时自动识图(学图即识图)
          let auto = false
          let animInfo = null
          if (!tag) {
            const sel = recognizeSelection()
            const r = await recognizeImageBytes(ctx.get('llm'), sel, buf, mime, fileName)
            auto = true
            animInfo = r.animation
            if (!tag) tag = r.tag
            if (!caption) caption = r.caption
            if (!keywords) keywords = r.keywords
          }
          if (!tag || !validTagRe.test(tag)) return { ok: false, message: '分类无效(tag 只能小写字母/数字/-/_),请手动指定 tag' }
          // 落点固定「我的收藏」稳定库:内置包升级、订阅库更新都碰不到它。
          // 附件是 GIF 但字节已不是 GIF → 宿主聊天通道把它压成了单帧,结果里要给用户保真路径。
          const targetRoot = ensureUserPack()
          const redirected = resolve(targetRoot) !== resolve(memes.root)
          const gifFlattened = !imageUrl && /\.gif$/i.test(refName) && mime !== 'image/gif'
          const name = Date.now() + '_' + Math.floor(Math.random() * 1000) + ext
          const rel = 'memes/' + tag + '/' + name
          mkdirSync(join(targetRoot, 'memes', tag), { recursive: true })
          writeFileSync(join(targetRoot, rel), buf)
```

</details>

**依据 2 · 源码核查**：[index.js:1524-1539](https://github.com/yyh-001/dsh-meme/blob/48e10fedf1951d84c9eca4247f5c5bbc2ae38871/index.js#L1524-L1539)

SQLite 写入及刷新在文件之后，异常返回失败。

<details>
<summary>查看原文（16行）</summary>

```text
          if (redirected) {
            const w = openIndexWriter(targetRoot)
            try {
              w.prepare('INSERT INTO memes (path, tag, file_name, caption, keywords, mtime, captioned_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
                .run(rel, tag, name, caption, keywords, Date.now(), Date.now())
            } finally { try { w.close() } catch { /* 已关闭 */ } }
          } else {
            adminDb.prepare('INSERT INTO memes (path, tag, file_name, caption, keywords, mtime, captioned_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
              .run(rel, tag, name, caption, keywords, Date.now(), Date.now())
          }
          memes.refresh()
          return { ok: true, path: rel, tag, url: ROUTE + '/' + (redirected ? USER_PACK_ID + '/' : '') + rel, message: '已收录: [' + tag + '] ' + (caption || name) + (auto ? ' (AI 自动识别' + (animInfo ? ',动图 ' + animInfo.frameCount + ' 帧' + (animInfo.filmstrip ? ',已抽帧给模型' : '') : '') + ')' : '') + ' → ' + rel
            + ';已存入「' + USER_PACK_NAME + '」图库'
            + (gifFlattened ? ';注意:这张 GIF 在聊天上传时已被压成单帧,想保留动画请用设置面板上传,或把 GIF 文件放进图库目录后点「扫描新增」' : '') }
        } catch (error) {
          return { ok: false, message: '收录失败: ' + (error instanceof Error ? error.message : String(error)) }
```

</details>

**依据 3 · 源码核查**：[index.js:169-183](https://github.com/yyh-001/dsh-meme/blob/48e10fedf1951d84c9eca4247f5c5bbc2ae38871/index.js#L169-L183)

Host 策略及局域网默认开关。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * 不是允许的来源就自己回 403 并返回 true,调用方直接 return。
 * allowLan = 设置页「允许局域网访问图库」开关(默认关):打开后本机/局域网 IP
 * 字面量的 Host 也放行,手机、平板才能看到表情包(issue #54);关闭时行为与旧版一致。
 * 显式配置的可信域名(DSH_MEME_TRUSTED_HOSTS / config.allowedHosts)始终放行(issue #56),
 * 用于反向代理部署;名单为空时域名形式的 Host 仍拒绝(DNS rebinding 防线)。
 */
export function denyNonLoopback(req, res, allowLan = false) {
  if (hostIsLoopback(req)) return false
  if (hostIsTrusted(req)) return false
  if (allowLan && hostIsLocalLan(req)) return false
  const body = JSON.stringify({ ok: false, error: '拒绝: 只接受本机(回环地址)请求。手机/局域网访问请在设置页打开「允许局域网访问图库」;反向代理域名请用 DSH_MEME_TRUSTED_HOSTS 或插件配置 allowedHosts 显式声明。' })
  res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(body)
  return true
```

</details>

**依据 4 · 源码核查**：[package.json:50-66](https://github.com/yyh-001/dsh-meme/blob/48e10fedf1951d84c9eca4247f5c5bbc2ae38871/package.json#L50-L66)

工具依赖、可选 sharp 和 Node 版本约束。

<details>
<summary>查看原文（17行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": "*"
  },
  "optionalDependencies": {
    "sharp": "^0.35.5"
  },
  "keywords": [
    "dsh-plugin",
    "dsh-meme",
    "deepseek-harness",
    "meme",
    "emoticon",
    "sticker"
  ],
  "license": "MIT",
  "engines": {
    "node": ">=22.13.0"
```

</details>

#### 缺口

- 未复现磁盘与数据库不同步，也未验证实际代理的认证和转发。
  **影响**：无法判断异常修复耗时或公网部署的访问边界。
  **进一步探讨**：在隔离图库让索引写入失败，核对文件残留与重新扫描；网络能力用目标部署另验。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何在现有手动流程上验证防误发增量？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先在本机测试会话关闭点击即发送和主动配图，用少量非敏感图片搜索并插入带原文字的草稿。用户能看清楚候选、确认已选图和发出的消息后再保留。若出现错图、原稿改变或只显示描述标记，改回手工上传并停用自动配图。针对 IM 的改进假设是将本次选中的图库条目、目标会话和确认一起绑定给投递动作。现有 Web 预览和 IM 路径提示可作对照，但目前只是选图和工具调用。用模拟接收者对照错图、错目标、重复确认成本，尤其在切换会话后验证旧选择是否失效。误发未下降或人工等待明显增加时维持手动选择。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:2798-2831](https://github.com/yyh-001/dsh-meme/blob/48e10fedf1951d84c9eca4247f5c5bbc2ae38871/client.js#L2798-L2831)

Web 已具备草稿插入与直接提交切换。

<details>
<summary>查看原文（34行）</summary>

```text
      const insert = (m) => {
        if (!m) return
        const marker = markerOf(m)
        let inserted = false
        try {
          if (actions && typeof actions.captureInsertion === 'function' && typeof actions.insertText === 'function') {
            inserted = actions.insertText(marker, actions.captureInsertion()) === true
          }
        } catch (e) { inserted = false }
        if (!inserted) {
          const cur = draftOf()
          setText(cur.trim() ? cur + '\n' + marker : marker)
        }
        store.set(false)
        // 面板一关焦点就掉到 body 了,直接敲回车不会发;顺手把焦点还给输入框,
        // 让「选图 → 接着打字 → 回车」一串动作不用再点一下。宿主结构变了就静默跳过。
        try {
          const editor = document.querySelector('[data-composer-card] [contenteditable="true"]')
          if (editor && typeof editor.focus === 'function') editor.focus()
        } catch (e) { /* 纯增强 */ }
      }
      // 设置开启时:拼草稿并立即发送
      const sendNow = (m) => {
        if (!m) return
        const cur = draftOf()
        const marker = markerOf(m)
        setText(cur.trim() ? cur + '\n' + marker : marker)
        try { if (actions && actions.submit) actions.submit() } catch (e) {}
        store.set(false)
      }
      const pick = (m) => {
        if (data.pickerSendOnClick !== false) sendNow(m)
        else insert(m)
      }
```

</details>

**依据 2 · 源码核查**：[memes.js:1022-1034](https://github.com/yyh-001/dsh-meme/blob/48e10fedf1951d84c9eca4247f5c5bbc2ae38871/memes.js#L1022-L1034)

IM 投递指引交路径，未包含用户确认流程。

<details>
<summary>查看原文（13行）</summary>

```text
      const howToSend = textMode
        ? '发图:当前发送方式是「纯文字」,不发图片——不要写 [表情: ...] 或 [任何描述] 这类方括号标记,不要调用 dsh_im_return_file 或 qqbot_send_file,也不要把图片路径贴进回复;把下面某一行「描述=」的原文用进你的文字回复里,接梗/吐槽/卖萌即可。'
        : chanceNote +
          (imageMode ? '当前发送方式是「图片」:挑好图就必须真的发出去,不能只写文字描述。' : '') +
          (imMode
            ? (chanceBlocked ? '发图:只在用户明确要图时,把挑中的那一行 path 原样传给 dsh_im_return_file(path=...)' : '发图:把挑中的那一行 path 原样传给 dsh_im_return_file(path=...)') +
              '——它会作为 ' + imLabel +
              ' 原生图片消息发出' + (chanceBlocked ? '。' : ';不用等用户要求,现在就能主动发。') +
              '回复正文只写普通文字:不要写 [表情: ...] 或 [任何描述] 这类方括号标记,不要写 markdown 图片或把本地路径贴进回复,也不用解释图片投递过程——图片会由渠道自己发出。'
            : webMode
              ? (chanceBlocked ? '发图:只在用户明确要图时,把下面某一行的 [表情: ...] 整段原样写进回复' : '发图:把下面某一行的 [表情: ...] 整段原样写进回复') +
                '(描述抄候选原文,可加一两句文字,不要加网址)。候选 JSON 里的 path/library 只是出处信息,用户问「这图哪个库的/文件叫什么」可以引用;发图仍然只写 [表情: 描述],不要把路径贴进回复。' +
                '如果本会话的工具表里有 qqbot_send_file(QQ 官方机器人的 dsh-qqbot 插件),说明当前是 QQ 机器人会话:此时不要写 [表情: ...] 标记,把挑中候选的 absPath(绝对路径)原样传给 qqbot_send_file 的 file_path 参数发出,正文只写普通文字、不要贴路径;若它返回路径白名单拒绝,提示用户在 dsh-qqbot 配置的 sendFile.extraRoots 里加上图库目录(通常是 ~/.dsh/meme-packs)。'
```

</details>

#### 缺口

- 确认绑定机制未实现也未验证。
  **影响**：无法量化误发与打断成本变化。
  **进一步探讨**：让测试会话在选图后切换目标，对照确认前后实际接收对象和耗时。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
