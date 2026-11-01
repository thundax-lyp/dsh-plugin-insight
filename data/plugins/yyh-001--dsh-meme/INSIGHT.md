# dsh-meme

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[dec558d](https://github.com/yyh-001/dsh-meme/tree/dec558d450575752eeaffeced9a6a6f2cfdc2f6c)

<!-- BEGIN META -->
[![GitHub ★ 472](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=472&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yyh-001/dsh-meme) [![npm 30d 46,775](https://img.shields.io/static/v1?label=npm+30d&message=46%2C775&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-meme) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-meme)
<!-- END META -->

> **功能**：在 DSH 会话中搜索、展示和维护表情图库。

> **亮点**：[Q02](#research-q02) 将图片候选、展示和元数据维护带入 DSH 会话，相对手工找文件减少切换，但依赖匹配和渠道。

> **主要限制**：[Q03](#research-q03) 文本匹配和随机候选不保证正确图；收录失败可能留文件，IM 投递还依赖其他工具。

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
  - [Q01 · 用户和依赖是什么？](#detail-section-11)
  - [Q02 · 候选怎样搜索、展示和收录？](#detail-section-12)
  - [Q03 · 风险和失败边界是什么？](#detail-section-13)
  - [Q04 · 成本与可验证假设是什么？](#detail-section-14)
  - [Q05 · 如何试用和退出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 用户希望在 DSH 聊天中找对图、展示图并维护个人图库。

用户离开会话手动浏览图片文件、挑选并通过聊天渠道发送。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 候选检索 | 在图库中按词与情绪找图 | 词匹配随机候选，需用户核对 |
| 图库收录 | 保存用户图片并更新索引 | 文件与数据库分步写入，失败需检查残留 |
| 图片展示 | Web 标记配图或交 IM 工具 | 依赖对应客户端和渠道，不保证送达 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH、工具服务和 Node | 必需 | 注册工具并读取索引 | 无法搜索或显示 |
| 已启用且可读取图库 | 找图必需 | 提供图片及元数据 | 无候选或缺图 |
| Web 客户端或 IM 发送工具 | 对应渠道必需 | 显示或投递图片 | 可能只显示文字或发送失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 配置 | 用户创建小图库并检查发送设置 | 图片和索引可读取 |
| 测试 | 使用关键词查找并查看图 | 图与描述一致 |
| 收录 | 用户明确要求保存测试图 | 文件和索引一致 |
| 异常 | 停用并检查图库备份 | 返回纯文字和人工核查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地存储与运行资源 | 准备图库和标注 | 时间未知 |
| 持续使用 | 模型、图片和可选缩图资源 | 筛选及维护 | 真实使用频率未知 |
| 失败恢复 | 文件和索引检查 | 清理残留与修正错图 | 实际损失未知 |
| 退出 | 图库备份和保留资源 | 禁用并核对个人图片 | 停用不等于删除数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话内找图 | 词匹配与候选返回 | 错图率与用户满意度 |
| 图库维护 | 文件写入及索引刷新 | 异常后两者一致性 |

> **思考**：[Q03](#research-q03) 文本匹配和随机候选不保证正确图；收录失败可能留文件，IM 投递还依赖其他工具。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将图片候选、展示和元数据维护带入 DSH 会话，相对手工找文件减少切换，但依赖匹配和渠道。

[Q02](#research-q02) 通过索引和标记连接工具与前端，[Q03](#research-q03) 渠道不同且写文件与数据库存在失败间隙。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 文本匹配和随机候选不保证正确图；收录失败可能留文件，IM 投递还依赖其他工具。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 用少量非敏感图片试用并核对渠道设置，错图或索引不一致时停用和核查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持候选检索、Web 标记渲染与图库收录；实际配图、跨渠道送达和效果未验证。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、index.js、memes.js、client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅静态检查固定源码的搜索、展示与收录主路径，未运行 DSH、浏览器或 IM。
- 下一步：在隔离 DSH、测试图库与目标客户端验证搜索、显示、明确收录及失败恢复。

**分析版本**

- **仓库**：[yyh-001/dsh-meme](https://github.com/yyh-001/dsh-meme)
- **版本号**：0.1.72（[固定提交 dec558d](https://github.com/yyh-001/dsh-meme/tree/dec558d450575752eeaffeced9a6a6f2cfdc2f6c)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设在 AI 主动向 IM 发图前，增加候选图片与目标聊天的用户确认，可降低误发；现有手动 Web 选图已支持草稿缩略预览，不能算作此假设。需对照误发率和等待成本。

在隔离 DSH、测试图库与目标客户端验证搜索、显示、明确收录及失败恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 852 | — | — | 12499 |
| .js | source | 9 | 9211 | 6851 | 2226 | — |
| .cjs | source | 1 | 10 | 10 | 1 | — |
| .tsx | source | 2 | 412 | 334 | 81 | — |
| .mjs | test | 41 | 8782 | 7166 | 962 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/yyh-001/dsh-meme/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 25](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=25&color=737b86&logo=github)](https://github.com/yyh-001/dsh-meme/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 26](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=26&color=737b86&logo=github)](https://github.com/yyh-001/dsh-meme/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查表情候选如何检索、显示与收录，以及发送渠道、数据一致性和成本边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户和依赖是什么？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

dsh-meme 面向希望在 DSH 聊天中查找、展示和维护表情图库的个人用户。合格结果是图与描述相符、在目标渠道可见，用户明确要求收录时对应文件和索引一致；依赖 DSH 工具与 Web/发送通道、Node 的 SQLite 和可读取图库，IM 原生图片还需对应投递工具。包与说明不证明当前宿主、图库或渠道实际可用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-5](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/package.json#L2-L5)

包名、版本与能力描述。

```text
  "name": "dsh-meme",
  "version": "0.1.72",
  "description": "DeepSeek Harness 表情包插件：输入框一键发图（图库/情绪多选筛选、悬浮大图预览）、多图库开关、情绪与关键词搜图、AI 学图，图库可从市场一键安装或导入/导出 ZIP。",
  "icon": "icon.jpg",
```

**依据 2 · 源码核查**：[package.json:37-57](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/package.json#L37-L57)

DSH 客户端、工具依赖及可选 sharp。

<details>
<summary>查看原文（21行）</summary>

```text
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
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": "*"
  },
  "optionalDependencies": {
    "sharp": "^0.35.5"
  },
  "keywords": [
    "dsh-plugin",
```

</details>

**依据 3 · 作者声明**：[README.md:29-36](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/README.md#L29-L36)

作者说明图库、学图与依赖。

```text

- 😊 **一键发图** — 输入框旁点 😊，搜索、按图库或情绪筛选；点一张放进输入框（插在光标处，输入框上方能看到选中的图），按回车和文字一起发出；手滑不会直接发出去，`Shift+点` 才是立即发送。
- 🎭 **主动斗图** — AI 会按聊天情绪自己找图接梗，不用等你开口；设置页可开关「AI 主动发表情」、设发图概率（0–100%）或改写提示词调整风格。
- 📱 **IM / 手机斗图** — QQ、微信、飞书等经 dsh-im 接入后，表情包以原生图片消息发出，不用写文字标记；手机/平板经电脑局域网 IP 打开 DSH Web，设置页打开「局域网访问图库」即可收发（默认关）。QQ 大图容易被客户端当图片消息拉伸，可打开「QQ 发图尺寸」把发送副本缩到 200–450px，Web 仍用原图。
- 🧠 **学会新图** — 上传图片后说「把这张图入库」，AI 自动识别分类和描述；也可以把图片文件直接拷进图库目录，点「扫描新增」一键入库（动图 GIF 建议走这条，原始动画保留；文件改名/删除后扫描会顺手清理失效记录）。
- 🗂️ **整理图库** — 跟 AI 说「列一下表情包清单」「帮我查查重复」「把这张改成 work 分类」——内置 `meme_list` / `meme_update` 维护工具，改分类/描述/关键词不用手动翻面板（删除留在面板，防误删）。
- 📦 **管理与分享** — 多图库开关、上传与编辑、ZIP 导入导出、市场安装与更新。
- 🚀 **开箱即用** — 内置大肥鱼图库（24 张），核心功能零第三方运行依赖，使用 Node 内置 SQLite；QQ 缩图是可选能力（dsh-im 已自带 sharp，未安装时按原图发送）。
```

**依据 4 · 作者声明**：[README.md:104-106](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/README.md#L104-L106)

作者说明数据位置与发送方式。

```text
默认扫描 `~/.dsh/meme-packs`，设置存 `~/.dsh/dsh-expression.json`，升级保留。ZIP 支持常规压缩和纯图片目录。

**发送方式**只影响 AI：自动按渠道（Web 写标记、IM 发原图）、纯文字不发图、图片要求每次真发。**发图概率**默认关；打开后每轮按所选概率决定 AI 是否主动发图（仅「自动」发送方式生效），你明确要图时不受概率限制。**QQ 发图尺寸**默认关；打开后 QQ/IM 发送前把长边缩到所选尺寸（默认 300px），Web 聊天仍用原图，GIF 保留动画——QQ 官方机器人没有表情消息类型，缩小后更容易被客户端按表情渲染，平板端不会拉伸满屏。**表情排布**只影响前端：并排（默认）或图独占一行。
```

#### 缺口

- 目标宿主、图库与渠道可用性
  **影响**：影响选图与显示
  **进一步探讨**：用小型私有测试图库验证

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 候选怎样搜索、展示和收录？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

Host 在通道就绪时注册 send_meme；跨已启用图库读取索引，按描述、关键词和文件名的词匹配评分，没命中再尝试二字组合，在最高分中随机取候选。Web 模式返回表情描述标记，客户端将标记映射成图片，并通过 /dsh-memes 路由从索引白名单读取；IM 模式提供路径，需另一个渠道工具投递。learn_meme 接收用户图片附件或 URL，写图片与索引并刷新；异常返回收录失败。相比切出聊天手动查文件，它把查找和维护放到工具与界面中，但模型挑选和前端匹配不能保证用户看到正确图。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1115-1136](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/index.js#L1115-L1136)

通道下注册 send_meme。

<details>
<summary>查看原文（22行）</summary>

```text
    tagStats: () => sampler.tagStats(),
  })
  const qq = ctx.get('companionQq')
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
  }

  // companionQq 迟到时补挂(静态插件与 companion 装载顺序不定)。
  const register = () => {
    if (sendImage || urlPrefix) return
    const qqNow = ctx.get('companionQq')
    if (qqNow !== undefined && typeof qqNow.sendImage === 'function') {
      registerToolWhenReady(ctx, 'send_meme', () => {
        registerSendMemeTool(ctx, sampler, (path, caption) => qqNow.sendImage(path, caption), urlPrefix, imToolOptions())
```

</details>

**依据 2 · 源码核查**：[index.js:895-934](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/index.js#L895-L934)

按已启用图库合并搜索。

<details>
<summary>查看原文（40行）</summary>

```text
    search(query, n, tag) {
      const ids = enabledIds()
      if (ids.length === 0) {
        const { tags } = memes.list()
        return { query: String(query || '').trim().toLowerCase(), memes: [], tags, reason: '当前没有打开任何图库，去设置页把要用的图库开关打开' }
      }
      const packs = packRows()
      const active = activePackId()
      if (ids.length === 1) {
        const hit = packs.find((p) => p.id === ids[0]) || null
        if (hit) {
          const base = hit.id === active
            ? memes.search(query, n, tag)
            : withStore(hit.path, (store) => {
                const all = store.list(tag)
                return { ...searchRows(annotatePack(all.memes, hit), query, n), tags: all.tags }
              })
          if (base) return base
        }
        return memes.search(query, n, tag)
      }
      const merged = []
      let tags = []
      for (const id of ids) {
        const hit = packs.find((p) => p.id === id)
        if (!hit) continue
        let store = null
        try {
          store = new MemesStore(hit.path)
          const one = store.list(tag)
          tags = one.tags.length ? one.tags : tags
          for (const row of one.memes) {
            // 非当前图库的路径带上包前缀,QQ 通道发图时按前缀找对图库
            merged.push(id === active
              ? { ...row, packId: hit.id, packName: hit.name }
              : { ...row, path: id + '/' + row.path, packId: hit.id, packName: hit.name })
          }
        } catch { /* 坏包跳过,不影响其他图库 */ } finally { if (store) store.close() }
      }
      return { ...searchRows(merged, query, n), tags }
```

</details>

**依据 3 · 源码核查**：[memes.js:404-428](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/memes.js#L404-L428)

词匹配、二字回退及随机候选。

<details>
<summary>查看原文（25行）</summary>

```text
export function searchRows(rows, query, limit = 8) {
  const tokens = keywordTokens(query)
  if (tokens.length === 0) return { query: '', tokens: [], memes: [] }
  const scan = (words) => {
    const hits = []
    for (const row of rows) {
      const hay = rowHay(row)
      let score = 0
      for (const w of words) if (hay.includes(w)) score++
      if (score > 0) hits.push({ row, score })
    }
    return hits
  }
  let hits = scan(tokens)
  if (hits.length === 0) {
    const grams = biGrams(tokens)
    if (grams.length) hits = scan(grams)
  }
  if (hits.length === 0) return { query: tokens.join(' '), tokens, memes: [] }
  const best = Math.max(...hits.map((h) => h.score))
  return {
    query: tokens.join(' '),
    tokens,
    memes: pickRandom(hits.filter((h) => h.score === best).map((h) => h.row), limit),
  }
```

</details>

**依据 4 · 源码核查**：[memes.js:900-918](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/memes.js#L900-L918)

工具注册和 Web 模式行为。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'send_meme',
    description: '发一张表情包。两种搜法:①只给 tag(情绪)→ 从该情绪里随机抽;②给 query(关键词)→ 在 caption/关键词/图名里搜,想找特定的图(「猫」「比心」「摸鱼」)就用这个;两个都给 = 在该情绪里按关键词筛,最准。' +
      '流程:给 tag/query → 系统返回若干张候选(带 caption,数量用 limit 自己定) → 看描述觉得贴就发;不满意再 search 换一批,还不行就换词/换情绪或回文字。' +
      '情绪字典: ' + MOOD_DICT + '。' +
      (webMode
        ? (imReady
            ? '发送方式看工具结果末尾的说明:Web 聊天把 [表情: 描述] 原样写进回复(描述抄候选原文,不要带网址);IM(QQ/微信等)聊天调用 dsh_im_return_file 传候选的 path 发原生图片,不要写 [表情: ...] 标记。'
            : '挑中后把 [表情: 描述] 原样写进回复(描述必须抄候选原文,不要带网址)——自己编的描述前端配不上图。')
        : '两步:search 看候选,再用 send + path 发出。') +
      '发送方式以设置里的「发送方式」下拉框为准(自动/纯文字/图片),每次结果末尾的「发图」说明会告诉你怎么发。' +
      '气氛对了就主动发;发完短接,让图自己说话。',
    parameters,
    output: {
      schema: { type: 'json' },
      render: (_args, value) => [{ type: 'text', text: value.message }],
    },
    async execute(args, exec) {
      const action = webMode ? 'search' : (args.action === 'send' ? 'send' : 'search')
```

</details>

**依据 5 · 源码核查**：[memes.js:959-1000](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/memes.js#L959-L1000)

IM 路径与 Web 标记分支。

<details>
<summary>查看原文（42行）</summary>

```text
      // 这一轮来自 dsh-im 的 IM 渠道时,图片只能作为原生图片发出:
      // [表情: 描述] 标记只有 Web 前端会配图,IM 聊天里它只是一行方括号文字。
      // 所以候选要带上绝对路径,交给 dsh-im 的 dsh_im_return_file 投递。
      const imChannel = !sendImage && imChannelOf ? imChannelOf(exec?.agent?.session) : null
      // 纯文字模式:Web/IM 都不发图;候选不带路径,免得模型顺手把 path 交给投递工具
      const imMode = !textMode && !sendImage && !!imChannel
      const imLabel = imMode ? (IM_CHANNEL_LABELS[imChannel] || 'IM') : ''

      const captionOf = (m) => String(m.caption || m.file_name || '').slice(0, 80)
      /** 候选的绝对路径:IM 投递工具要的是磁盘路径,不能是图库内的相对路径/包前缀路径 */
      const absolutePathOf = (m) => {
        try {
          return memes.resolveStored(m.path)
        } catch {
          return String(m.path || '')
        }
      }
      /** 候选所属图库:跨库合并时 sampler 会给每行标 packName/packId(issue #53) */
      const libraryOf = (m) => String(m.packName || m.packId || '')

      /** 发送前预处理候选路径(QQ 缩图);纯文字模式不需要路径,直接跳过。 */
      const preparePaths = async (rows, mode, channel) => {
        if (!prepareSendPath || textMode) return rows.map(absolutePathOf)
        return Promise.all(rows.map(async (m) => {
          const abs = absolutePathOf(m)
          try {
            const prepared = await prepareSendPath(abs, { mode, channel: channel || '' })
            return typeof prepared === 'string' && prepared ? prepared : abs
          } catch { return abs }
        }))
      }
      const lines = (rows, paths) => rows.map((m, i) => {
        const caption = captionOf(m)
        const sendable = paths[i] || absolutePathOf(m)
        // 纯文字模式:只给描述,不给 [表情: …] 标记也不给路径——标记在前端仍会配成图
        if (textMode) return (i + 1) + '. 描述=' + caption + ' | 分类=' + m.tag
        // IM 模式不要用 "[tag] caption" 的方括号样式:模型会照着把方括号抄进回复,
        // 而 IM 客户端只把方括号里的文字显示出来(用户看到的是 [无语死鱼脸] 之类)。
        if (imMode) return (i + 1) + '. path=' + sendable + ' | 分类=' + m.tag + ' | 描述=' + caption
        return webMode
          ? (i + 1) + '. [表情: ' + caption + ']'
          : (i + 1) + '. path=' + absolutePathOf(m) + ' | [' + m.tag + '] ' + caption
```

</details>

**依据 6 · 源码核查**：[client.js:2995-3003](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/client.js#L2995-L3003)

前端识别表情标记。

```text
      // 表情文本渲染:[表情: 描述] 或旧格式 [表情: 描述](url) → 图片。
      // 无 url 时先按描述精确匹配图库;失败再按分词在 caption/关键词里做包含匹配
      // 兜底(模型偶尔不抄候选原文、自己编描述);仍无命中显示描述原文,
      // 不把 [表情: ...] 标记裸露在气泡里(历史教训:社区反馈「表情显示不出来」)。
      const MEME_TEXT_RE = /\[表情:\s*([^\]]+)\](?:\((https?:\/\/[^\s)]+)\))?/g
      // acceptNode 用不带 g 的副本。带 g 的正则 test() 会推进 lastIndex,下一个文本节点从
      // 上次的位置往后找——于是「这一条运气不好」的消息被静默跳过、永远不出图,还得等下一轮
      // 扫描碰巧把游标绕回 0(历史 bug:表现就是「表情有时显示不出来」)。
      const MEME_TEXT_TEST = /\[表情:\s*([^\]]+)\](?:\((https?:\/\/[^\s)]+)\))?/
```

**依据 7 · 源码核查**：[index.js:785-813](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/index.js#L785-L813)

按索引白名单读取图片。

<details>
<summary>查看原文（29行）</summary>

```text
          // 每次请求动态构建白名单:静态快照会漏掉新上传的图(历史教训:上传后 404 图片不显示)
          let allowed = null
          let routeStore = null
          try {
            routeStore = new MemesStore(root)
            allowed = new Set(routeStore.list().memes.map((m) => m.path))
          } catch {
            allowed = null
          } finally {
            if (routeStore) routeStore.close()
          }
          if (!stored || !allowed || !allowed.has(stored)) {
            res.writeHead(404, { 'Content-Type': 'text/plain' })
            res.end('not found')
            return
          }
          try {
            const file = join(root, stored)
            const bytes = readFileSync(file)
            const ext = stored.includes('.') ? stored.split('.').pop().toLowerCase() : ''
            res.writeHead(200, {
              'Content-Type': MIME[ext] || 'application/octet-stream',
              'Content-Length': String(bytes.byteLength),
              'Cache-Control': 'public, max-age=3600',
            })
            res.end(bytes)
          } catch {
            res.writeHead(404, { 'Content-Type': 'text/plain' })
            res.end('not found')
```

</details>

**依据 8 · 源码核查**：[index.js:1308-1319](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/index.js#L1308-L1319)

注册 learn_meme 与图片来源。

<details>
<summary>查看原文（12行）</summary>

```text
    // 与 send_meme 一样走 registerToolWhenReady:冷启动时 ctx.tools 未就绪,
    // 同步 register 静默无效,learn_meme 会跟着一起缺席(issue #51)。
    registerToolWhenReady(ctx, 'learn_meme', () => ctx.tools.register(defineTool({
      name: 'learn_meme',
      description: '把一张图片收录进表情包图库(自动学图)。' +
        '仅当用户明确要求收藏/收录/保存这张图时使用(如「收藏这个表情」「收进图库」)。' +
        '用户发表情/发图是斗图,不是收藏请求——不要自动收录,正常回应即可。' +
        '插件会自动识别图片内容(分类/描述/关键词)后存入图库;tag/caption/keywords 可选,手动指定优先。' +
        '用户刚发的图片附件:直接调用即可,不必传 attachmentId(id 不会出现在 prompt 里,默认收录最近一张用户图)。也可用 attachmentId 或 http(s) imageUrl。',
      parameters: {
        attachmentId: { type: 'string', description: '可选。对话附件 id;不传则收录最近一张用户图片' },
        imageUrl: { type: 'string', description: '可选。图片 http(s) URL,与附件二选一' },
```

</details>

**依据 9 · 源码核查**：[index.js:1396-1416](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/index.js#L1396-L1416)

写文件、索引、刷新及失败返回。

<details>
<summary>查看原文（21行）</summary>

```text
          const gifFlattened = !imageUrl && /\.gif$/i.test(refName) && mime !== 'image/gif'
          const name = Date.now() + '_' + Math.floor(Math.random() * 1000) + ext
          const rel = 'memes/' + tag + '/' + name
          mkdirSync(join(targetRoot, 'memes', tag), { recursive: true })
          writeFileSync(join(targetRoot, rel), buf)
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
            + (redirected ? ';已存入「我的收藏」(内置图库随插件升级会被清空)' : '')
            + (gifFlattened ? ';注意:这张 GIF 在聊天上传时已被压成单帧,想保留动画请用设置面板上传,或把 GIF 文件放进图库目录后点「扫描新增」' : '') }
        } catch (error) {
          return { ok: false, message: '收录失败: ' + (error instanceof Error ? error.message : String(error)) }
```

</details>

#### 缺口

- 前端实际匹配、图片显示和目标渠道投递
  **影响**：决定用户是否得到正确图
  **进一步探讨**：隔离环境用已知图库做查找、显示和收录验收

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 风险和失败边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

搜索是词匹配及随机选择而非已证实的个性化推荐；模型需采用返回描述，Web 匹配不到可退回文字，IM 不具 Web 标记渲染而需其他投递工具。主动发图指导由设置和渠道影响，使用者需要核对实际行为。收录先写文件再写数据库，异常时返回失败，不能据此保证没有残留文件或索引不一致；图库坏包在跨库检索中跳过。URL 收录会请求外部地址，图库和备份亦可能包含私人图片；关闭展示并不等于清理数据。

#### 证据与依据

**依据 1 · 源码核查**：[memes.js:404-428](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/memes.js#L404-L428)

匹配和随机选择。

<details>
<summary>查看原文（25行）</summary>

```text
export function searchRows(rows, query, limit = 8) {
  const tokens = keywordTokens(query)
  if (tokens.length === 0) return { query: '', tokens: [], memes: [] }
  const scan = (words) => {
    const hits = []
    for (const row of rows) {
      const hay = rowHay(row)
      let score = 0
      for (const w of words) if (hay.includes(w)) score++
      if (score > 0) hits.push({ row, score })
    }
    return hits
  }
  let hits = scan(tokens)
  if (hits.length === 0) {
    const grams = biGrams(tokens)
    if (grams.length) hits = scan(grams)
  }
  if (hits.length === 0) return { query: tokens.join(' '), tokens, memes: [] }
  const best = Math.max(...hits.map((h) => h.score))
  return {
    query: tokens.join(' '),
    tokens,
    memes: pickRandom(hits.filter((h) => h.score === best).map((h) => h.row), limit),
  }
```

</details>

**依据 2 · 源码核查**：[client.js:3223-3224](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/client.js#L3223-L3224)

未命中降级为描述。

```text
              // 无命中:降级只显示描述原文,不把 [表情: ...] 标记裸露给用户。方括号单独用 ghost
              // 藏起来——可见的只有描述本身,而 textContent 仍是替换前那个 [表情: x] 逐字不差,
```

**依据 3 · 源码核查**：[memes.js:959-965](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/memes.js#L959-L965)

IM 与 Web 投递不同。

```text
      // 这一轮来自 dsh-im 的 IM 渠道时,图片只能作为原生图片发出:
      // [表情: 描述] 标记只有 Web 前端会配图,IM 聊天里它只是一行方括号文字。
      // 所以候选要带上绝对路径,交给 dsh-im 的 dsh_im_return_file 投递。
      const imChannel = !sendImage && imChannelOf ? imChannelOf(exec?.agent?.session) : null
      // 纯文字模式:Web/IM 都不发图;候选不带路径,免得模型顺手把 path 交给投递工具
      const imMode = !textMode && !sendImage && !!imChannel
      const imLabel = imMode ? (IM_CHANNEL_LABELS[imChannel] || 'IM') : ''
```

**依据 4 · 源码核查**：[index.js:925-934](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/index.js#L925-L934)

坏图库跳过。

<details>
<summary>查看原文（10行）</summary>

```text
          tags = one.tags.length ? one.tags : tags
          for (const row of one.memes) {
            // 非当前图库的路径带上包前缀,QQ 通道发图时按前缀找对图库
            merged.push(id === active
              ? { ...row, packId: hit.id, packName: hit.name }
              : { ...row, path: id + '/' + row.path, packId: hit.id, packName: hit.name })
          }
        } catch { /* 坏包跳过,不影响其他图库 */ } finally { if (store) store.close() }
      }
      return { ...searchRows(merged, query, n), tags }
```

</details>

**依据 5 · 源码核查**：[index.js:1363-1364](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/index.js#L1363-L1364)

URL 收录发起网络请求。

```text
            if (!/^https?:\/\//i.test(imageUrl)) return { ok: false, message: 'imageUrl 必须是 http(s) 链接' }
            const res = await fetch(imageUrl, { signal: AbortSignal.timeout(15000), redirect: 'follow' })
```

**依据 6 · 源码核查**：[index.js:1396-1416](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/index.js#L1396-L1416)

文件、索引和异常顺序。

<details>
<summary>查看原文（21行）</summary>

```text
          const gifFlattened = !imageUrl && /\.gif$/i.test(refName) && mime !== 'image/gif'
          const name = Date.now() + '_' + Math.floor(Math.random() * 1000) + ext
          const rel = 'memes/' + tag + '/' + name
          mkdirSync(join(targetRoot, 'memes', tag), { recursive: true })
          writeFileSync(join(targetRoot, rel), buf)
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
            + (redirected ? ';已存入「我的收藏」(内置图库随插件升级会被清空)' : '')
            + (gifFlattened ? ';注意:这张 GIF 在聊天上传时已被压成单帧,想保留动画请用设置面板上传,或把 GIF 文件放进图库目录后点「扫描新增」' : '') }
        } catch (error) {
          return { ok: false, message: '收录失败: ' + (error instanceof Error ? error.message : String(error)) }
```

</details>

**依据 7 · 作者声明**：[README.md:104-106](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/README.md#L104-L106)

设置与数据路径。

```text
默认扫描 `~/.dsh/meme-packs`，设置存 `~/.dsh/dsh-expression.json`，升级保留。ZIP 支持常规压缩和纯图片目录。

**发送方式**只影响 AI：自动按渠道（Web 写标记、IM 发原图）、纯文字不发图、图片要求每次真发。**发图概率**默认关；打开后每轮按所选概率决定 AI 是否主动发图（仅「自动」发送方式生效），你明确要图时不受概率限制。**QQ 发图尺寸**默认关；打开后 QQ/IM 发送前把长边缩到所选尺寸（默认 300px），Web 聊天仍用原图，GIF 保留动画——QQ 官方机器人没有表情消息类型，缩小后更容易被客户端按表情渲染，平板端不会拉伸满屏。**表情排布**只影响前端：并排（默认）或图独占一行。
```

#### 缺口

- 真实客户端配图准确率及失败后的残留
  **影响**：影响误图和数据维护
  **进一步探讨**：用测试库核对文件、索引和渠道结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 成本与可验证假设是什么？

**研究主题**：效果与总成本、新假设与验证

#### 完整回答

需要准备与标注图片、维护图库、检查误匹配，SQLite、本地文件、可选缩图和模型工具调用消耗资源。没有本次找图时间、匹配准确率或用户满意度对照，无法声称节时或个性化有效。现有 Web 手动选图已有草稿缩略预览，默认由用户发送，Shift 点击仍可直发；不能将手动预览说成新方案。未验证假设：给 AI 在 IM 主动发表情的路径增加候选图片及目标聊天的用户确认，可能减少错图和误发，但会打断对话并增加等待；现有读取的 IM 指导让模型选候选后交给 dsh_im_return_file，未见此人工确认步骤，其他渠道和宿主权限机制未完整审计。对照同一测试集记录 AI 实际误发率、确认等待时间与取消率；误发率未下降或等待超可接受阈值则否定。

#### 证据与依据

**依据 1 · 源码核查**：[memes.js:404-428](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/memes.js#L404-L428)

词匹配及最高分随机候选。

<details>
<summary>查看原文（25行）</summary>

```text
export function searchRows(rows, query, limit = 8) {
  const tokens = keywordTokens(query)
  if (tokens.length === 0) return { query: '', tokens: [], memes: [] }
  const scan = (words) => {
    const hits = []
    for (const row of rows) {
      const hay = rowHay(row)
      let score = 0
      for (const w of words) if (hay.includes(w)) score++
      if (score > 0) hits.push({ row, score })
    }
    return hits
  }
  let hits = scan(tokens)
  if (hits.length === 0) {
    const grams = biGrams(tokens)
    if (grams.length) hits = scan(grams)
  }
  if (hits.length === 0) return { query: tokens.join(' '), tokens, memes: [] }
  const best = Math.max(...hits.map((h) => h.score))
  return {
    query: tokens.join(' '),
    tokens,
    memes: pickRandom(hits.filter((h) => h.score === best).map((h) => h.row), limit),
  }
```

</details>

**依据 2 · 源码核查**：[client.js:2646-2653](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/client.js#L2646-L2653)

手动选择默认插入草稿并由用户发送，Shift 点击直发。

```text
      // 点一张:默认把 [表情: 描述] 插进输入框,由用户自己发送(issue #61)。
      // 旧行为是「拼草稿 + 立即 submit」,手滑点一下就发出去了,而且会把正在打的字一起发走;
      // 现在插入草稿,用户能接着写、能改顺序,按回车才发。Shift+点保留旧的一键直发。
      // 纯文本标记:模型只看到文字,前端按描述配图 —— 与 AI 侧发送的约定一致。
      const setText = (text) => { try { if (actions && actions.setDraft) actions.setDraft(text) } catch (e) {} }
      const markerOf = (m) => {
        const desc = (m.caption || m.keywords || m.tag || '表情包').slice(0, 80)
        return '[表情: ' + desc + ']'
```

**依据 3 · 源码核查**：[client.js:2817-2826](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/client.js#L2817-L2826)

现有草稿标记缩略预览。

<details>
<summary>查看原文（10行）</summary>

```text
    /**
     * 输入框上方的「将发送」表情条(issue #61)。
     *
     * 选图不再直接发出去,而是把 `[表情: 描述]` 标记插进草稿;光看标记文字分不清是哪张,
     * 这条把草稿里现存的标记解析出来画成缩略图,点 × 就从草稿里删掉对应那一段。
     *
     * 不带自己的 state:内容完全由草稿派生 —— 用户改字、删标记、宿主发送后清空草稿,
     * 这条都自动跟着变,不会出现「已经发了条还在」。
     * `resolveMemeUrl` 用 apply 里那份索引(悬停面板打开过一次就有);冷启动时索引还没到,
     * 退化成描述文字,不影响删除。
```

</details>

**依据 4 · 源码核查**：[index.js:588-603](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/index.js#L588-L603)

IM 主动选候选并交 dsh_im_return_file 的模型指导。

<details>
<summary>查看原文（16行）</summary>

```text
  const imNoInlineImageRule = (label) => '- 回复正文只写普通聊天的文字:不要写 [表情: …] 或 [任何描述] 这类方括号标记,不要写 markdown 图片(![]()),更不要把本地文件路径贴进回复——' + label + ' 里这些只会显示成难看的文字,图片会由 dsh_im_return_file 作为原生消息发出;\n'
  const imCompanionPrompt = (channel) => {
    const label = IM_CHANNEL_LABELS[channel] || 'IM'
    return '斗图规则:主动斗图,不要等用户开口:\n' +
      '- 聊天气氛合适就主动用 send_meme 拿候选,再把挑中的候选 path(绝对路径)交给 dsh_im_return_file,让它作为 ' + label + ' 原生图片消息发出,发图优先于纯文字;\n' +
      imNoInlineImageRule(label) +
      '- 也不用在正文里解释图片投递过程(不必说「图已排队/等发出」),发完保持简短,让图自己说话,不啰嗦不复述;\n' +
      '- 不用等用户先授权、先说明「可以发表情」,直接发;情绪到点、接梗、吐槽、卖萌时都主动甩图,别冷场,对方说正事/干活时克制。'
  }
  /** 用户自定义过提示词时不动原文,只在末尾补 IM 的投递方式 */
  const imCompanionRules = (channel) => {
    const label = IM_CHANNEL_LABELS[channel] || 'IM'
    return '当前对话来自 ' + label + '(IM 聊天):\n' +
      '- 发图方式是先调用 send_meme 拿候选,再把挑中的候选 path(工具结果里的绝对路径)传给 dsh_im_return_file,让它作为 ' + label + ' 原生图片消息发出;\n' +
      imNoInlineImageRule(label) +
      '- 不用等用户先授权:气氛合适就直接 send_meme → dsh_im_return_file 主动发;对方说正事/干活时克制。'
```

</details>

**依据 5 · 源码核查**：[memes.js:900-911](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/memes.js#L900-L911)

工具结果指导 Web 标记与 IM 路径。

<details>
<summary>查看原文（12行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'send_meme',
    description: '发一张表情包。两种搜法:①只给 tag(情绪)→ 从该情绪里随机抽;②给 query(关键词)→ 在 caption/关键词/图名里搜,想找特定的图(「猫」「比心」「摸鱼」)就用这个;两个都给 = 在该情绪里按关键词筛,最准。' +
      '流程:给 tag/query → 系统返回若干张候选(带 caption,数量用 limit 自己定) → 看描述觉得贴就发;不满意再 search 换一批,还不行就换词/换情绪或回文字。' +
      '情绪字典: ' + MOOD_DICT + '。' +
      (webMode
        ? (imReady
            ? '发送方式看工具结果末尾的说明:Web 聊天把 [表情: 描述] 原样写进回复(描述抄候选原文,不要带网址);IM(QQ/微信等)聊天调用 dsh_im_return_file 传候选的 path 发原生图片,不要写 [表情: ...] 标记。'
            : '挑中后把 [表情: 描述] 原样写进回复(描述必须抄候选原文,不要带网址)——自己编的描述前端配不上图。')
        : '两步:search 看候选,再用 send + path 发出。') +
      '发送方式以设置里的「发送方式」下拉框为准(自动/纯文字/图片),每次结果末尾的「发图」说明会告诉你怎么发。' +
      '气氛对了就主动发;发完短接,让图自己说话。',
```

</details>

**依据 6 · 作者声明**：[README.md:73-79](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/README.md#L73-L79)

图库管理与发送设置。

```text
## 图库管理

打开 **设置 → 表情包**：

- **图库** — 卡片显示张数与占用大小，点卡片管理图片；分类下拉按真实分类筛选；「扫描新增」收编手动拷进目录的图片并清理失效记录。卡片开关决定 AI 能否使用该图库，可多选。支持新建、导入/导出 ZIP、投稿、删除和更新。
- **发现** — 预览市场图库并一键安装（Release ZIP 校验 SHA-256）。
- **设置** — 改扫描目录、AI 主动发表情、提示词、发送方式（自动/纯文字/图片）、发图概率（开关 + 0/10/20/30/50/70/100%）、QQ 发图尺寸（开关 + 200/300/400/450px 长边）、表情排布（并排/独占一行）、局域网访问、`AGENTS.md`。
```

#### 缺口

- 真实错误率与维护耗时
  **影响**：不能量化收益
  **进一步探讨**：同图库对照人工找图与插件

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何试用和退出？

**研究主题**：采用判断

#### 完整回答

有私人聊天需求且能维护图库的 DSH 用户可先用少量非敏感图片，明确关闭不需要的主动发送，验证关键词、图片显示和收录结果。相对离开聊天查文件，它将候选与图库管理接入会话，但不证明跨渠道送达。若出现错图、仅显示文字、意外主动插图或索引不一致，停用相关功能并检查图库备份，回到纯文字；不要把失败当成没有写入。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:73-79](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/README.md#L73-L79)

作者说明图库开关与发送设置。

```text
## 图库管理

打开 **设置 → 表情包**：

- **图库** — 卡片显示张数与占用大小，点卡片管理图片；分类下拉按真实分类筛选；「扫描新增」收编手动拷进目录的图片并清理失效记录。卡片开关决定 AI 能否使用该图库，可多选。支持新建、导入/导出 ZIP、投稿、删除和更新。
- **发现** — 预览市场图库并一键安装（Release ZIP 校验 SHA-256）。
- **设置** — 改扫描目录、AI 主动发表情、提示词、发送方式（自动/纯文字/图片）、发图概率（开关 + 0/10/20/30/50/70/100%）、QQ 发图尺寸（开关 + 200/300/400/450px 长边）、表情排布（并排/独占一行）、局域网访问、`AGENTS.md`。
```

**依据 2 · 源码核查**：[memes.js:923-940](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/memes.js#L923-L940)

发送模式和路径检查。

<details>
<summary>查看原文（18行）</summary>

```text
      const sendMode = normalizeSendMode(sendModeOf())
      const textMode = sendMode === 'text'
      const imageMode = sendMode === 'image'
      // 发图概率只约束「自动」模式下的主动发图;纯文字本来就不发,图片模式要求每次真发。
      const chanceBlocked = !textMode && !imageMode && chanceBlockedFor(exec?.agent?.session)

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
```

</details>

**依据 3 · 源码核查**：[index.js:1396-1416](https://github.com/yyh-001/dsh-meme/blob/dec558d450575752eeaffeced9a6a6f2cfdc2f6c/index.js#L1396-L1416)

写入及失败分支。

<details>
<summary>查看原文（21行）</summary>

```text
          const gifFlattened = !imageUrl && /\.gif$/i.test(refName) && mime !== 'image/gif'
          const name = Date.now() + '_' + Math.floor(Math.random() * 1000) + ext
          const rel = 'memes/' + tag + '/' + name
          mkdirSync(join(targetRoot, 'memes', tag), { recursive: true })
          writeFileSync(join(targetRoot, rel), buf)
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
            + (redirected ? ';已存入「我的收藏」(内置图库随插件升级会被清空)' : '')
            + (gifFlattened ? ';注意:这张 GIF 在聊天上传时已被压成单帧,想保留动画请用设置面板上传,或把 GIF 文件放进图库目录后点「扫描新增」' : '') }
        } catch (error) {
          return { ok: false, message: '收录失败: ' + (error instanceof Error ? error.message : String(error)) }
```

</details>

#### 缺口

- 目标环境发送设置与文件状态
  **影响**：影响实际退出和恢复
  **进一步探讨**：先核对设置和备份，在测试库中试验

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
