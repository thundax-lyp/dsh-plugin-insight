# dsh-meme

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[b09aa39](https://github.com/yyh-001/dsh-meme/tree/b09aa39a42eacf6ebfbc354b27348447f4c83f16)

<!-- BEGIN META -->
[![GitHub ★ 427](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=427&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yyh-001/dsh-meme) [![npm 30d 37,800](https://img.shields.io/static/v1?label=npm+30d&message=37%2C800&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-meme) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-meme)
<!-- END META -->

> **功能**：在 DSH 中检索和发送表情图，并用视觉模型收录图片、维护多图库与元数据。

> **亮点**：把多图库关键词检索、视觉学图和聊天展示串联，减少用户离开对话找文件的一个环节；实际选择是关键词/情绪采样，不声称个性化学习。见[Q01](#research-q01)至[Q03](#research-q03)。

> **主要限制**：候选或描述标记不等于正确图片已送达，重复描述可影响身份，QQ回调也未等待异步结果；学图文件和索引分步写需要核对。见[Q02](#research-q02)与[Q03](#research-q03)。

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
  - [Q01 · 谁用它完成什么任务，图片选择是否个性化？](#detail-section-11)
  - [Q02 · Web与IM发送怎样到达可见图片，失败如何表达？](#detail-section-12)
  - [Q03 · 学图与修改会写什么，自动主动发图怎样控制？](#detail-section-13)
  - [Q04 · 依赖、流程和全周期成本效果是什么？](#detail-section-14)
  - [Q05 · 什么人可试用，什么假设值得验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在DSH或接入IM的聊天里找图并维护个人图库的人，可把检索和收录放进同一流程，合格结果是正确图片实际显示。见[Q01](#research-q01)。

直接替代是文件夹查图或IM原生表情收藏。插件的增量是聊天工具、跨库检索与描述维护接线；最高分随机抽图和模型看描述不等于长期个性化推荐。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| send_meme | 关键词或情绪检索候选 | Web只搜索后写标记，IM依赖外部投递；不是个性化学习 |
| learn_meme | 明确收录附件或URL图片 | 自动识图需要视觉模型并外发图片；文件与索引非共同事务 |
| meme_list | 只读查图库与元数据 | 受启用库和关键词/分类条件影响 |
| meme_update | 修改分类、描述与关键词 | 只改索引，不移动文件或改图片 |
| Web表情展示 | 标记按描述配图 | 重名/截断可影响身份，未命中降为描述 |
| 主动发图提示 | 调整模型聊天风格 | 可关提示，关提示不等于注销全部工具 |

**流程与依赖**

启动与依赖表集中在[Q04](#research-q04)，区分Node内置SQLite、视觉模型、外部IM投递和可选sharp；Web标记成功不能替代渠道验收。

使用顺序应由小图库Web显示开始，再独立验收收录和IM投递。执行者、成功标准与失败动作见[Q04](#research-q04)，结果未知时先核状态再重试。

**效果与成本**

成本应按一次正确图片被看到且可维护核算，自动识图另计模型费用，候选次数不能代替任务完成数。阶段表见[Q04](#research-q04)。

机制支持的是检索和展示路径，正确率、个体偏好和真实送达仍属不同验证对象；效果表见[Q04](#research-q04)。

> **思考**：候选或描述标记不等于正确图片已送达，重复描述可影响身份，QQ回调也未等待异步结果；学图文件和索引分步写需要核对。见[Q02](#research-q02)与[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把多图库关键词检索、视觉学图和聊天展示串联，减少用户离开对话找文件的一个环节；实际选择是关键词/情绪采样，不声称个性化学习。见[Q01](#research-q01)至[Q03](#research-q03)。

工具候选附图库出处、包内写入重定向到包外收藏、图片字节嗅探与视觉JSON校验值得借鉴。描述身份、未await回调和文件/索引分步写使结果确认仍薄弱，不能以“已发送/已收录”消息代替核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

候选或描述标记不等于正确图片已送达，重复描述可影响身份，QQ回调也未等待异步结果；学图文件和索引分步写需要核对。见[Q02](#research-q02)与[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在私人测试会话关闭不需要的主动提示，检验唯一/重名描述和一次明确收录，再验收IM接收；错图、意外发图或索引异常时停用并保留备份。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认候选、Web渲染与学图/元数据工具；真实接收显示、识图质量和恢复效果未验证。稳定图片身份是未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、index.js、memes.js、client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核查关键词与情绪候选、启用图库采样、send/learn/update、Web标记与选择器、系统提示注入、视觉调用和落盘；未全审远程市场ZIP/镜像、安全路由或外部IM实现。
- 下一步：隔离图库验证同描述错图、文本降级、异步投递拒绝、索引失败与明确收录意图，记录实际接收结果、误图、修正及模型费用；本轮未执行。

**分析版本**

- **仓库**：[yyh-001/dsh-meme](https://github.com/yyh-001/dsh-meme)
- **版本号**：0.1.67（[固定提交 b09aa39](https://github.com/yyh-001/dsh-meme/tree/b09aa39a42eacf6ebfbc354b27348447f4c83f16)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可检验图库ID加内容摘要的稳定引用与分阶段投递记录是否降低错图和未确认误报；新增协议和隐私负担未验证。见[Q05](#research-q05)。

隔离图库验证同描述错图、文本降级、异步投递拒绝、索引失败与明确收录意图，记录实际接收结果、误图、修正及模型费用；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 731 | — | — | 11206 |
| .js | source | 9 | 8790 | 6579 | 2081 | — |
| .cjs | source | 1 | 10 | 10 | 1 | — |
| .tsx | source | 2 | 412 | 334 | 81 | — |
| .mjs | test | 40 | 8292 | 6757 | 918 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/yyh-001/dsh-meme/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=21&color=737b86&logo=github)](https://github.com/yyh-001/dsh-meme/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=21&color=737b86&logo=github)](https://github.com/yyh-001/dsh-meme/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：dsh-meme能否把可维护图库里的合适图片交付到正确聊天渠道，搜索、学图和自动提示有哪些证据边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁用它完成什么任务，图片选择是否个性化？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

dsh-meme给希望在DSH或已接入IM聊天中选择表情图、持续整理个人图库的人提供原生插件入口。合格结果是选中的合适图片在目标渠道实际显示，出处可查，收录和修改后索引仍能查到正确图片。相对在文件夹或外部表情面板找图再复制，它把检索、候选、渠道提示和图库维护放到同一聊天流程。

选择机制不是用户画像推荐。searchRows把查询分词，在描述、关键词和文件名中计子串命中数，未命中再用双字组合，最高分同档内随机；只给情绪时按情绪桶抽样。多图库sampler跨启用包取候选，模型再根据描述选择是否贴切。这里有关键词匹配与模型语境判断，但没有从用户反馈训练偏好、个体长期排序或独立效果数据，不能称已实现个性化推荐。

内置图库、社区图库与模型识图分别承担素材、供给与描述生成，本插件的增量在检索/维护/展示接线，不把图库作者内容和模型能力算原创。只偶尔发图、已有成熟IM表情收藏的人，原渠道工具可能已够用；对工作会话主动插图是否合适也需用户决定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-28](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/README.md#L20-L28)

作者描述选择、主动聊天与图库维护用途。

```text
## 能做什么

- **一键发图**：输入框旁点 😊，搜索、按图库或情绪筛选，点一张就发送。
- **主动斗图**：AI 会按聊天情绪自己找图接梗，不用等你开口；设置页可开关「AI 主动发表情」或改写提示词调整风格。
- **IM / 手机斗图**：QQ、微信、飞书等经 dsh-im 接入后，表情包以原生图片消息发出，不用写文字标记；手机/平板经电脑局域网 IP 打开 DSH Web，设置页打开「局域网访问图库」即可收发（默认关，见下文）。QQ 大图容易被客户端当图片消息拉伸，可在设置页打开「QQ 发图尺寸」，发送前把副本缩到 200–450px，Web 仍用原图。
- **学会新图**：上传图片后说「把这张图入库」，AI 自动识别分类和描述；也可以把图片文件直接拷进图库目录，点「扫描新增」一键入库（动图 GIF 建议走这条，原始动画保留；文件改名/删除后扫描会顺手清理失效记录）。
- **整理图库**：跟 AI 说「列一下表情包清单」「帮我查查重复」「把这张改成 work 分类」——内置 `meme_list` / `meme_update` 维护工具，改分类/描述/关键词不用手动翻面板（删除留在面板，防误删）。
- **管理与分享**：多图库开关、上传与编辑、ZIP 导入导出、市场安装与更新。
- **开箱即用**：内置大肥鱼图库（24 张），核心功能零第三方运行依赖，使用 Node 内置 SQLite；QQ 缩图是可选能力（dsh-im 已自带 sharp，未安装时按原图发送）。
```

**依据 2 · 源码核查**：[memes.js:382-406](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/memes.js#L382-L406)

实际关键词评分与最高分随机采样，不是个体学习。

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

**依据 3 · 源码核查**：[index.js:754-819](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/index.js#L754-L819)

启用图库采样及出处标注。

<details>
<summary>查看原文（66行）</summary>

```text
  // send_meme 抽候选则跨所有打开的图库——这里包一层 sampler 给工具用。
  const packRows = () => {
    try { return listAllPacks() } catch { return [] }
  }
  const activePackId = () => {
    const s = readSettings()
    const packs = packRows()
    return s.packId || (packs.find((p) => resolve(p.path) === resolve(memes.root)) || {}).id || ''
  }
  const enabledIds = () => enabledPackIds(readSettings(), packRows(), activePackId())
  // 给单库快路径的行补上图库标注(跨库合并路径在下面就地标):候选带 library,
  // 模型答得出「这图哪个库的」(issue #53)。不改 path,只加字段。
  const annotatePack = (rows, pack) => rows.map((row) => ({ ...row, packId: pack.id, packName: pack.name }))
  // 临时打开某图库跑一句查询,完事即关(包内图库不能常驻连接,issue #43);失败返回 null
  const withStore = (path, fn) => {
    let store = null
    try {
      store = new MemesStore(path)
      return fn(store)
    } catch { return null } finally { if (store) store.close() }
  }
  const sampler = {
    get root() { return memes.root },
    list: (...a) => memes.list(...a),
    replace: (...a) => memes.replace(...a),
    sampleMood(tag, query, n) {
      const ids = enabledIds()
      if (ids.length === 0) {
        const { memes: rows, tags } = memes.list()
        return { mood: resolveMoodName(tag, query, tags), memes: [], tags, reason: '当前没有打开任何图库，去设置页把要用的图库开关打开' }
      }
      const packs = packRows()
      if (ids.length === 1) {
        const hit = packs.find((p) => p.id === ids[0]) || null
        const r = hit
          ? (hit.id === activePackId()
              ? memes.sampleMood(tag, query, n)
              : withStore(hit.path, (store) => store.sampleMood(tag, query, n)))
          : null
        if (r) return { ...r, memes: annotatePack(r.memes, hit) }
        return memes.sampleMood(tag, query, n)
      }
      const per = Math.max(1, Math.ceil(n / ids.length))
      const merged = []
      let mood = ''
      let tags = []
      for (const id of ids) {
        const hit = packs.find((p) => p.id === id)
        if (!hit) continue
        let store = null
        try {
          store = new MemesStore(hit.path)
          const one = store.sampleMood(tag, query, per)
          mood = mood || one.mood
          tags = one.tags.length ? one.tags : tags
          for (const row of one.memes) {
            // 非当前图库的路径带上包前缀,QQ 通道发图时按前缀找对图库;
            // 所有行都带上图库标注(候选出处信息,issue #53)
            merged.push(id === activePackId()
              ? { ...row, packId: hit.id, packName: hit.name }
              : { ...row, path: id + '/' + row.path, packId: hit.id, packName: hit.name })
          }
        } catch { /* 坏包跳过,不影响其他图库 */ } finally { if (store) store.close() }
      }
      if (!mood) return { mood: null, memes: [], tags }
      return { mood, memes: pickShuffled(merged, n), tags }
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:10-13](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/cordis.patch.yml#L10-L13)

原生bundle以旧内部ID挂载新包。

```text
# memeRoot,其他用户安装后指向不存在的目录,插件直接起不来。
- insert:
    - id: dsh-expression
      name: dsh-meme
```

#### 缺口

- 没有同任务发图与图库维护对照或个体反馈学习记录。
  **影响**：不能证明相关性、节时或长期推荐收益。
  **进一步探讨**：用固定聊天任务比较原工具与插件的正确图片、误图及人工检索时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Web与IM发送怎样到达可见图片，失败如何表达？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

Web模式中send_meme强制执行search，不直接投递。它返回候选描述与路径，要求模型把[表情: 描述]写进回复；浏览器从图库建立caption/关键词索引，扫描消息文本后把标记装饰成img。用户点选择器也先把描述标记拼入草稿并submit，而不是上传原图附件。匹配不到就显示描述文本，所以“工具找到候选”不证明读者已看到图片。

Web可见图还受描述身份影响。精确caption优先于关键词减少误配，但跨图库重复描述、截断成相同前80字或元数据变化时，标记本身没有稳定文件ID，不能保证显示的就是模型挑选或过去发出的同一图。当前是可解释的描述查找设计，而非逐图片身份投递保证。图像失败也可能只留下描述，不一定有投递失败提示。

IM模式返回磁盘绝对路径供dsh_im_return_file或qqbot_send_file等外部工具投递，原生送达依赖那些插件、渠道与路径白名单。本插件也可走companion QQ的sendImage，但该分支调用回调后立即返回“已发送”，没有await返回值；若回调是异步的，其后拒绝不会被同步try/catch捕获。因此返回成功不能作远端已收图证明，这里是静态调用边界，未复现真实丢图。纯文字模式阻止直接send并去候选路径，但对模型遵守提示及其他独立发送工具的约束仍非完整权限门禁。

#### 证据与依据

**依据 1 · 源码核查**：[memes.js:869-914](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/memes.js#L869-L914)

Web只搜索，QQ回调未await及IM分支。

<details>
<summary>查看原文（46行）</summary>

```text
    async execute(args, exec) {
      const action = webMode ? 'search' : (args.action === 'send' ? 'send' : 'search')
      const query = typeof args.query === 'string' ? args.query.trim() : ''
      const tag = typeof args.tag === 'string' ? args.tag.trim().toLowerCase() : ''
      const path = typeof args.path === 'string' ? args.path.trim() : ''
      const limit = clampLimit(args.limit)
      const sendMode = normalizeSendMode(sendModeOf())
      const textMode = sendMode === 'text'
      const imageMode = sendMode === 'image'

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

**依据 2 · 源码核查**：[memes.js:960-975](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/memes.js#L960-L975)

不同渠道候选字段与外部投递要求。

<details>
<summary>查看原文（16行）</summary>

```text
        if (textMode) return rows.map((m) => ({ tag: m.tag, caption: captionOf(m), library: libraryOf(m) }))
        if (imMode) return rows.map((m, i) => ({ path: sendable(i), tag: m.tag, caption: captionOf(m), library: libraryOf(m) }))
        return webMode
          ? rows.map((m, i) => ({ caption: captionOf(m), path: m.path, absPath: sendable(i), library: libraryOf(m) }))
          : rows.map((m, i) => ({ path: m.path, absPath: sendable(i), tag: m.tag, caption: m.caption, library: libraryOf(m) }))
      }
      const howToSend = textMode
        ? '发图:当前发送方式是「纯文字」,不发图片——不要写 [表情: ...] 或 [任何描述] 这类方括号标记,不要调用 dsh_im_return_file 或 qqbot_send_file,也不要把图片路径贴进回复;把下面某一行「描述=」的原文用进你的文字回复里,接梗/吐槽/卖萌即可。'
        : (imageMode ? '当前发送方式是「图片」:挑好图就必须真的发出去,不能只写文字描述。' : '') +
          (imMode
            ? '发图:把挑中的那一行 path 原样传给 dsh_im_return_file(path=...)——它会作为 ' + imLabel +
              ' 原生图片消息发出;不用等用户要求,现在就能主动发。回复正文只写普通文字:不要写 [表情: ...] 或 [任何描述] 这类方括号标记,不要写 markdown 图片或把本地路径贴进回复,也不用解释图片投递过程——图片会由渠道自己发出。'
            : webMode
              ? '发图:把下面某一行的 [表情: ...] 整段原样写进回复(描述抄候选原文,可加一两句文字,不要加网址)。候选 JSON 里的 path/library 只是出处信息,用户问「这图哪个库的/文件叫什么」可以引用;发图仍然只写 [表情: 描述],不要把路径贴进回复。' +
                '如果本会话的工具表里有 qqbot_send_file(QQ 官方机器人的 dsh-qqbot 插件),说明当前是 QQ 机器人会话:此时不要写 [表情: ...] 标记,把挑中候选的 absPath(绝对路径)原样传给 qqbot_send_file 的 file_path 参数发出,正文只写普通文字、不要贴路径;若它返回路径白名单拒绝,提示用户在 dsh-qqbot 配置的 sendFile.extraRoots 里加上图库目录(通常是 ~/.dsh/meme-packs)。'
              : '用 send + path 发出。')
```

</details>

**依据 3 · 源码核查**：[client.js:2507-2517](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/client.js#L2507-L2517)

选择器实际发送描述标记文本。

<details>
<summary>查看原文（11行）</summary>

```text
      // 点击:发 [表情: 描述] 文本,前端按描述配图。
      const send = async (m) => {
        if (!m) return
        // 纯文本:[表情: 描述] —— 模型只看到文字;前端按描述配图。
        const setText = (text) => { try { if (actions && actions.setDraft) actions.setDraft(text) } catch (e) {} }
        const desc = (m.caption || m.keywords || m.tag || '表情包').slice(0, 80)
        const text = '[表情: ' + desc + ']'
        const cur = inputState && typeof inputState.draft === 'string' ? inputState.draft : ''
        setText(cur.trim() ? cur + '\n' + text : text)
        try { if (actions && actions.submit) actions.submit() } catch (e) {}
        store.set(false)
```

</details>

**依据 4 · 源码核查**：[client.js:2667-2679](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/client.js#L2667-L2679)

caption/文件名/截断描述与关键词索引。

<details>
<summary>查看原文（13行）</summary>

```text
      const captions = new Map()
      const keywords = new Map()
      for (const row of rows || []) {
        const url = toUrl(row)
        addIndexKey(captions, row.caption, url)
        addIndexKey(captions, row.file_name, url)
        addIndexKey(captions, String(row.caption || '').slice(0, 80), url)
        addIndexKey(captions, String(row.caption || '').slice(0, 100), url)
        const kw = String(row.keywords || '')
        addIndexKey(keywords, kw, url)
        for (const word of kw.split(/\s+/)) addIndexKey(keywords, word, url)
      }
      return { caption: captions, keyword: keywords }
```

</details>

**依据 5 · 源码核查**：[client.js:2954-3000](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/client.js#L2954-L3000)

标记到图片或描述降级的实际DOM分支。

<details>
<summary>查看原文（47行）</summary>

```text
          const parent = node.parentElement
          if (!parent || parent.dataset.memeDecorated) continue
          const text = node.nodeValue || ''
          MEME_TEXT_RE.lastIndex = 0
          const matches = []
          let m
          while ((m = MEME_TEXT_RE.exec(text))) matches.push(m)
          if (matches.length === 0) continue
          const needsLookup = matches.some((hit) => !hit[2])
          if (needsLookup && !memeIndex) {
            loadMemeIndex()
            continue
          }
          parent.dataset.memeDecorated = '1'
          decoratedAny = true
          const frag = document.createDocumentFragment()
          const imgs = []
          let last = 0
          for (const hit of matches) {
            if (hit.index > last) frag.appendChild(document.createTextNode(text.slice(last, hit.index)))
            const src = hit[2] || findMemeUrl(hit[1])
            if (src) {
              const img = document.createElement('img')
              img.src = src
              img.alt = hit[0].slice(0, 60)
              img.title = hit[0].slice(0, 60)
              img.dataset.memeImg = foldCaption(hit[1]) // 去重用的描述标记
              img.style.cssText = 'max-width:180px;max-height:180px;border-radius:10px;display:block;margin:8px 0'
              // 图在聊天流里常常一屏放不下:懒加载省首屏解码,异步解码避免长任务卡渲染。
              img.loading = 'lazy'
              img.decoding = 'async'
              frag.appendChild(img)
              frag.appendChild(ghostFor(hit[0]))
              imgs.push(img)
            } else {
              // 无命中:降级只显示描述原文,不把 [表情: ...] 标记裸露给用户。方括号单独用 ghost
              // 藏起来——可见的只有描述本身,而 textContent 仍是替换前那个 [表情: x] 逐字不差,
              // 否则比对 textContent 的插件照样会把这条打回(issue #22 第 2 条)。
              const at = hit[0].indexOf(']') - hit[1].length
              frag.appendChild(ghostFor(hit[0].slice(0, at)))
              frag.appendChild(document.createTextNode(hit[1]))
              frag.appendChild(ghostFor(hit[0].slice(at + hit[1].length)))
            }
            last = hit.index + hit[0].length
          }
          if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)))
          parent.replaceChild(frag, node)
```

</details>

#### 缺口

- 外部IM工具与渠道返回及实际图片接收未核查。
  **影响**：不能把路径候选或本地回调当送达。
  **进一步探讨**：以固定文件摘要核对渠道结果与接收端图片，记录未确认结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 学图与修改会写什么，自动主动发图怎样控制？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

learn_meme的工具描述要求用户明确收录，执行本身读取指定或最近一张用户图片附件，也允许http(s) URL。没有手工tag时调用默认视觉模型，检查image输入能力，保存图片附件后发识图请求，解析JSON分类、描述和关键词；GIF尝试采样胶片条帮助理解动作。此过程会把图片发送给配置的模型，描述仅是模型生成标注，不保证分类或梗理解正确。

收录先写图片文件再INSERT SQLite索引，当前目标是插件包内图库时重定向到包外“我的收藏”以避免升级丢失。文件系统和SQLite不是共同事务，索引写入失败后可能留下已写文件；再次收录产生新随机时间名，没有按内容摘要幂等去重。手工扫描可成为核对线索，但本轮未验证所有异常修复。URL下载在arrayBuffer全部读取后才检查8MiB，故不是对网络读入内存的严格流式上界。

meme_update校验路径和字段，只改索引元数据，不移动图片。模型侧没有删除工具，可降低误删入口，但学图的“只在明确要求时使用”是工具描述而非每次硬确认；应看实际宿主工具权限。系统提示注入默认鼓励主动发图，可用promptEnabled=false关闭这段注入，并有auto/text/image模式。关提示不等于注销工具，不能写成彻底阻止发图。设置写入直接覆盖JSON且异常吞掉，用户应读回确认，不能只依据界面点击认定持久保存。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1222-1289](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/index.js#L1222-L1289)

明确收录描述、附件/URL读取及事后大小检查。

<details>
<summary>查看原文（68行）</summary>

```text
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
        tag: { type: 'string', description: '手动指定分类,如 angry/happy(可选,默认自动识别)' },
        caption: { type: 'string', description: '手动指定描述(可选,默认自动识别)' },
        keywords: { type: 'string', description: '手动指定搜索关键词,空格分隔(可选,默认自动识别)' },
      },
      output: {
        schema: { type: 'json' },
        render: (_args, value) => [{ type: 'text', text: value.message }],
      },
      async execute(args, exec) {
        const imageUrl = typeof args.imageUrl === 'string' ? args.imageUrl.trim() : ''
        const attachmentId = typeof args.attachmentId === 'string' ? args.attachmentId.trim() : ''
        let tag = typeof args.tag === 'string' ? args.tag.trim().toLowerCase() : ''
        let caption = String(args.caption || '').trim().slice(0, 200)
        let keywords = String(args.keywords || '').trim().slice(0, 200)
        try {
          let buf
          let mime
          let fileName
          let ext
          let refName = '' // 附件原始文件名:附件是 .gif 而字节不是 GIF = 聊天通道压平了动图
          if (!imageUrl) {
            const refs = userImageRefs(exec)
            const ref = attachmentId
              ? refs.find((r) => String(r.attachmentId) === attachmentId)
              : refs[refs.length - 1]
            if (!ref) {
              return { ok: false, message: attachmentId
                ? '找不到附件 ' + attachmentId + '(必须是本次对话上传的图片)'
                : '对话里没有用户图片附件' }
            }
            const stored = await ctx.get('attachments').readImage(ref)
            buf = stored.data
            // MIME/扩展名以字节嗅探为准,附件元数据只作兜底:元数据与真实字节不符时
            // (如 JPEG 标成 image/gif)照元数据落盘会让图片路由返回错误的 Content-Type(issue #36)。
            mime = sniffImageMime(buf) || String(stored.ref.mediaType || '')
            ext = extByMime(mime)
            if (!ext) {
              const named = stored.ref.name && stored.ref.name.includes('.') ? '.' + stored.ref.name.split('.').pop().toLowerCase() : ''
              ext = IMAGE_EXTS.includes(named) ? named : '.jpg'
            }
            fileName = stored.ref.name || 'meme' + ext
            refName = String(stored.ref.name || '')
          } else {
            if (!/^https?:\/\//i.test(imageUrl)) return { ok: false, message: 'imageUrl 必须是 http(s) 链接' }
            const res = await fetch(imageUrl, { signal: AbortSignal.timeout(15000), redirect: 'follow' })
            if (!res.ok) return { ok: false, message: '下载失败: HTTP ' + res.status }
            const ctype = String(res.headers.get('content-type') || '')
            const m = /image\/(jpeg|png|gif|webp)/.exec(ctype)
            const declared = m ? IMAGE_KEY_MIME[m[1]] : ''
            if (!declared) return { ok: false, message: '该 URL 不是图片(jpg/png/gif/webp)' }
            buf = Buffer.from(await res.arrayBuffer())
            if (buf.byteLength === 0 || buf.byteLength > 8 * 1024 * 1024) return { ok: false, message: '图片大小超限(≤8MB)' }
            // 响应头 Content-Type 同样只是声明:字节能嗅出来就以字节为准(issue #36,与附件分支同一处理)
            mime = sniffImageMime(buf) || declared
            ext = extByMime(mime) || '.jpg'
            fileName = imageUrl.split('/').pop() || 'meme' + ext
          }
          if (buf.byteLength === 0 || buf.byteLength > 8 * 1024 * 1024) return { ok: false, message: '图片大小超限(≤8MB)' }
```

</details>

**依据 2 · 源码核查**：[index.js:1290-1328](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/index.js#L1290-L1328)

视觉模型调用、包外重定向与文件先写后索引。

<details>
<summary>查看原文（39行）</summary>

```text
          // 未指定分类时自动识图(学图即识图)
          let auto = false
          let animInfo = null
          if (!tag) {
            const sel = ctx.agentDefaultModel && typeof ctx.agentDefaultModel.currentSelection === 'function'
              ? ctx.agentDefaultModel.currentSelection() : null
            const r = await recognizeImageBytes(ctx.get('llm'), sel, buf, mime, fileName)
            auto = true
            animInfo = r.animation
            if (!tag) tag = r.tag
            if (!caption) caption = r.caption
            if (!keywords) keywords = r.keywords
          }
          if (!tag || !validTagRe.test(tag)) return { ok: false, message: '分类无效(tag 只能小写字母/数字/-/_),请手动指定 tag' }
          // 落点:当前图库在插件包内(升级会被清空)时改写「我的收藏」。附件是 GIF
          // 但字节已不是 GIF → 宿主聊天通道把它压成了单帧,结果里要给用户保真路径。
          const targetRoot = writeTarget()
          const redirected = resolve(targetRoot) !== resolve(memes.root)
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

**依据 3 · 源码核查**：[index.js:1453-1501](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/index.js#L1453-L1501)

真实视觉调用、GIF处理及JSON解析。

<details>
<summary>查看原文（49行）</summary>

```text
    async function recognizeImageBytes(llm, sel, buf, mime, fileName) {
      const provider = sel && sel.provider
      const model = sel && sel.model
      if (!llm || !provider || !model) throw new Error('未配置模型,无法识图')
      const info = await llm.resolveModelInfo(provider, model)
      const modalities = info && info.inputModalities
      if (!Array.isArray(modalities) || !modalities.includes('image')) {
        throw new Error('当前模型「' + model + '」不支持图片输入,无法识图')
      }
      // 先 materialize 默认配置(reasoningEffort 等),否则 stream 时配置比对不一致报错
      // (历史教训: prepared LLM call config changed before adapter dispatch)
      const base = await llm.resolveCallConfig({ provider, model, maxTokens: 4096 })
      const prepared = await llm.prepareCall(base)
      const prompt = '你是表情包分类助手。识别这张表情包图片,只输出 JSON(不要任何其他文字):\n' +
        '{"tag":"分类(小写英文,参考: angry生气 happy开心 sad难过 shy害羞 confused困惑 surprised惊讶 sleep睡觉 work上班 like喜欢 see看看 meow喵喵 speechless无语),选最贴切的一个","caption":"一句话中文描述这张图表达的情绪/梗","keywords":"3-5个中文搜索词,空格分隔"}\n'
      const anim = detectAnimation(buf)
      const strip = anim && anim.format === 'gif' ? buildAnimationFilmstrip(buf, { maxFrames: ANIM_DEFAULT_FRAMES }) : null
      const animNote = anim ? animationModelNote(anim, strip) : ''
      const textPart = { type: 'text', text: animNote ? prompt + '\n\n' + animNote : prompt }
      let imagePart
      if (strip) {
        const rawName = fileName || 'meme'
        const dot = rawName.lastIndexOf('.')
        const baseName = dot > 0 ? rawName.slice(0, dot) : 'meme'
        imagePart = { type: 'image', attachment: await ctx.get('attachments').saveImage({ data: strip.png, mediaType: 'image/png', name: baseName + '-frames.png' }) }
      } else {
        imagePart = { type: 'image', attachment: await ctx.get('attachments').saveImage({ data: buf, mediaType: mime, name: fileName }) }
      }
      let out = ''
      let reason = ''
      for await (const chunk of prepared.stream({ ...base, messages: [{ role: 'user', content: [textPart, imagePart] }] })) {
        if (chunk.type === 'text-delta') out += chunk.text
        else if (chunk.type === 'reasoning-delta') reason += chunk.text
        else if (chunk.type === 'finish' && chunk.reason && chunk.reason.kind === 'error') {
          throw new Error('模型调用失败: ' + (chunk.reason.failure && chunk.reason.failure.message || JSON.stringify(chunk.reason.failure)))
        }
      }
      // 思考型模型可能把 JSON 写在 reasoning 里,正文为空时兜底解析
      const m = /\{[\s\S]*\}/.exec(out) || /\{[\s\S]*\}/.exec(reason)
      if (!m) throw new Error('模型未返回有效 JSON')
      const parsed = JSON.parse(m[0])
      const tag = String(parsed.tag || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 20)
      const caption = String(parsed.caption || '').trim().slice(0, 200)
      const keywords = String(parsed.keywords || '').trim().slice(0, 200)
      if (!tag) throw new Error('模型未给出分类')
      return {
        tag, caption, keywords,
        animation: anim ? { format: anim.format, frameCount: anim.frameCount, totalMs: anim.totalMs, filmstrip: !!strip } : null,
      }
```

</details>

**依据 4 · 源码核查**：[index.js:1412-1449](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/index.js#L1412-L1449)

元数据写工具只改SQLite索引。

<details>
<summary>查看原文（38行）</summary>

```text
    registerToolWhenReady(ctx, 'meme_update', () => ctx.tools.register(defineTool({
      name: 'meme_update',
      description: '修改图库里一张表情包的元数据:分类/描述/关键词任选,至少给一项。只改索引不改图片文件。path 用 meme_list 或 send_meme 候选里的原样。',
      parameters: {
        path: { type: 'string', description: '要改的那张图的 path(meme_list/send_meme 候选里的原样)' },
        tag: { type: 'string', description: '新分类(可选,小写字母/数字/-/_)' },
        caption: { type: 'string', description: '新描述(可选,一句话中文)' },
        keywords: { type: 'string', description: '新关键词(可选,空格分隔)' },
      },
      output: {
        schema: { type: 'json' },
        render: (_args, value) => [{ type: 'text', text: value.message }],
      },
      execute(args) {
        const path = String(args.path || '').trim()
        const tag = args.tag != null ? String(args.tag).trim().toLowerCase() : null
        const caption = args.caption != null ? String(args.caption).trim().slice(0, 200) : null
        const keywords = args.keywords != null ? String(args.keywords).trim().slice(0, 200) : null
        if (!path) return { ok: false, message: '缺少 path——先用 meme_list 找到那张图' }
        if (tag == null && caption == null && keywords == null) {
          return { ok: false, message: '至少给一项要改的字段(tag/caption/keywords)' }
        }
        if (tag != null && !validTagRe.test(tag)) return { ok: false, message: 'tag 只能是小写字母/数字/-/_' }
        const located = locateMemePath(path)
        if (!located) return { ok: false, message: '找不到这张图: ' + path + '(path 用 meme_list/send_meme 候选里的原样)' }
        const row = withStore(located.pack.path, (store) => store.list().memes.find((m) => m.path === located.rel))
        if (!row) return { ok: false, message: '索引里没有这张图: ' + path }
        const nextTag = tag ?? row.tag
        const nextCaption = caption ?? (row.caption || '')
        const nextKeywords = keywords ?? (row.keywords || '')
        const w = openIndexWriter(located.pack.path)
        try {
          w.prepare('UPDATE memes SET tag = ?, caption = ?, keywords = ? WHERE path = ?')
            .run(nextTag, nextCaption, nextKeywords, located.rel)
        } finally { try { w.close() } catch { /* 已关闭 */ } }
        if (resolve(located.pack.path) === resolve(memes.root)) memes.refresh()
        return { ok: true, path, tag: nextTag, caption: nextCaption, keywords: nextKeywords, message: '已更新: [' + nextTag + '] ' + nextCaption + (nextKeywords ? '(关键词: ' + nextKeywords + ')' : '') }
      },
```

</details>

**依据 5 · 源码核查**：[index.js:556-564](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/index.js#L556-L564)

设置覆盖及异常吞掉。

```text
  const settingsFile = join(dshHome(), '.dsh', 'dsh-expression.json')
  const readSettings = () => {
    try { return JSON.parse(readFileSync(settingsFile, 'utf8')) } catch (e) { return {} }
  }
  const writeSettings = (patch) => {
    try {
      mkdirSync(join(dshHome(), '.dsh'), { recursive: true })
      writeFileSync(settingsFile, JSON.stringify({ ...readSettings(), ...patch }, null, 2))
    } catch (e) {}
```

**依据 6 · 源码核查**：[index.js:637-658](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/index.js#L637-L658)

默认提示注入及关闭边界。

<details>
<summary>查看原文（22行）</summary>

```text
  // ---- 陪伴模式:系统提示注入,模型根据对话情绪主动斗图 ----
  // 设置页可整段关掉这项注入(settings.promptEnabled === false),关掉后模型不再主动斗图。
  // IM 会话(dsh-im)追加投递规则:候选路径交给 dsh_im_return_file,不要写标记。
  ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
    const assembled = await next()
    const settingsNow = readSettings()
    if (settingsNow.promptEnabled === false) return assembled
    const sendMode = normalizeSendMode(settingsNow.sendMode)
    const channel = hasImDelivery() ? imChannelOfSession(context?.agent?.session) : null
    const custom = settingsNow.companionPrompt
    let text = custom || DEFAULT_COMPANION_PROMPT
    if (sendMode === 'text') {
      // 纯文字:默认提示词里的发图指令全部压掉(仍保留斗图语气),也不追加 IM 投递规则
      text = text + '\n\n' + TEXT_MODE_RULE
    } else if (channel) {
      // IM 会话:默认提示词整段换成 IM 版([表情:] 那条在 IM 里是错的);
      // 用户自定义提示词则保留原文,只在末尾补投递规则。
      text = custom ? custom + '\n\n' + imCompanionRules(channel) : imCompanionPrompt(channel)
    }
    if (sendMode === 'image') text = text + '\n\n' + IMAGE_MODE_RULE
    assembled.sections.push({ name: 'dsh-expression:companion', text })
    return assembled
```

</details>

#### 缺口

- 宿主对写工具的权限确认与收录失败恢复未验收。
  **影响**：不能保证用户意图强制约束或自动修复残留。
  **进一步探讨**：隔离图库验证未授权调用、索引写失败、重复收录及设置写失败后的读回。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、流程和全周期成本效果是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

本包使用Node内置SQLite及DSH tools、webServer、attachments等接口，核心搜图不要求另建向量库；自动识图要有可用的视觉模型，IM发原图还要外部投递插件。QQ缩图依赖可选sharp，缺失可退原图，不应把这一降级误解为平台排版保证。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node≥22.13和DSH工具/HTTP接口 | 核心必需 | SQLite图库与工具注册 | 不兼容时不可据目录收录视为可用 |
| 图库文件及index.db | 搜图必需 | 索引元数据与真实文件 | 文件或索引不一致可能查不到/显示不出 |
| 支持image的默认模型与attachments | 自动学图必需 | 生成标签、描述与关键词 | 手工tag可避开自动识别分支，自动效果未知 |
| dsh-im/qqbot/companion及路径权限 | 相应IM投递必需 | 发送原生图片 | 候选路径不是送达，渠道另验收 |
| sharp | QQ缩图可选 | 缩小副本并保留Web原图 | 缺失或失败回原图 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份包外图库和设置，决定是否主动发图 | 不希望自动插图则关闭提示并读回 |
| 加载 | 安装bundle，确认工具与Web资源 | 本轮未安装，不以按钮存在验收 |
| 选择 | 用户/模型搜索候选并核描述和图库 | 没有贴切图回纯文字 |
| 交付 | Web标记显示或IM外部工具投递 | 接收端实际图片与所选文件一致 |
| 收录 | 用户明确选图收录并复核标签 | 文件和索引同时查到，失败先核状态再重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 图库下载、磁盘、宿主安装；金额未知 | 备份、选图库、设主动行为和渠道权限 | 不必把社区图片当作已许可全部用途 |
| 持续使用 | 搜图与Web解码；自动学图另有模型调用 | 核标签、误图、重复与渠道显示 | 无实际token/费用与节时记录 |
| 失败恢复 | 重下、重识别或索引修复 | 核图片/数据库/发送结果，避免不明结果重试 | 文件与索引非共同事务，投递确认依赖渠道 |
| 退出 | 包外图库与设置保留 | 停用插件及主动提示，另决定备份/删除图库 | 卸载代码不等于删除图片或外部模型数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 找图与候选 | 关键词评分、情绪采样、多图库 | 相关性优于原办法或个性化收益 |
| Web展示 | 标记按描述查图并DOM渲染 | 同描述身份一致与全宿主兼容 |
| 学图维护 | 真实视觉请求和SQLite元数据写入 | 分类质量、重复率与失败恢复成功率 |

合格单位是正确图片被目标接收者看到且可继续管理，不是一次search返回或一条“已发送”。代码MIT不代替各图库图片的使用许可，README也要求分别查看。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:50-67](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/package.json#L50-L67)

DSH依赖、sharp可选和Node版本声明。

<details>
<summary>查看原文（18行）</summary>

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
  },
```

</details>

**依据 2 · 源码核查**：[memes.js:8-8](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/memes.js#L8-L8)

Node内置SQLite实际导入。

```text
import { DatabaseSync } from 'node:sqlite'
```

**依据 3 · 源码核查**：[index.js:1453-1465](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/index.js#L1453-L1465)

自动识图依赖视觉模型。

<details>
<summary>查看原文（13行）</summary>

```text
    async function recognizeImageBytes(llm, sel, buf, mime, fileName) {
      const provider = sel && sel.provider
      const model = sel && sel.model
      if (!llm || !provider || !model) throw new Error('未配置模型,无法识图')
      const info = await llm.resolveModelInfo(provider, model)
      const modalities = info && info.inputModalities
      if (!Array.isArray(modalities) || !modalities.includes('image')) {
        throw new Error('当前模型「' + model + '」不支持图片输入,无法识图')
      }
      // 先 materialize 默认配置(reasoningEffort 等),否则 stream 时配置比对不一致报错
      // (历史教训: prepared LLM call config changed before adapter dispatch)
      const base = await llm.resolveCallConfig({ provider, model, maxTokens: 4096 })
      const prepared = await llm.prepareCall(base)
```

</details>

**依据 4 · 作者声明**：[README.md:108-135](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/README.md#L108-L135)

工具与外部IM投递说明，属作者边界。

<details>
<summary>查看原文（28行）</summary>

````text
**动图读取**：`learn_meme` 和上传识图会把 GIF 采样成多帧胶片条再送模型，caption 能描述动作；原图仍保留动画。WebP / APNG 只读元数据、按第一帧识别。

**IM 投递**：接入 dsh-im 后，`send_meme` 候选带绝对路径，模型调用 `dsh_im_return_file` 发原生图片；Web 聊天仍用 `[表情: 描述]`。通过 [dsh-companion](https://github.com/yyh-001/dsh-companion) 也可接 QQ。

**QQ 官方机器人（[dsh-qqbot](https://github.com/tencent-connect/dsh-qqbot)）**：候选带 `absPath`，交给 `qqbot_send_file` 的 `file_path`。dsh-qqbot 默认有路径白名单，需要把图库目录加进 `sendFile.extraRoots`：

```yaml
# qqbot profile 的 cordis.patch.yml（或「设置 → QQ 机器人」）
- id: im-qqbot
  config:
    sendFile:
      extraRoots:
        - C:\Users\<你>\.dsh\meme-packs
        - C:\Users\<你>\.dsh\profiles\<profile>\node_modules\dsh-meme\memes
```

`C:\Users\<你>` 在 Linux/macOS 上换成 `~`；图库放哪就加哪个目录，内置图库的路径也要加。

### 给其它插件的只读取图服务

同进程插件可用 `ctx.get('dshMeme')` 直接检索/挑图（只读）：

| 方法 | 返回 |
| --- | --- |
| `packs()` | 已启用图库 `{ id, name, count, path }[]` |
| `search({ query, tag, limit })` | `{ ok, query, memes: [{ path, tag, caption, keywords, pack, packName }] }` |
| `pick({ query, tag })` | 命中 `{ ok: true, path, tag, caption, keywords, pack, packName }`；否则 `{ ok: false, reason, tags, tagStats }` |

````

</details>

#### 缺口

- 缺同任务相关性、接收显示和全周期费用数据。
  **影响**：不能量化节时或投递可靠性。
  **进一步探讨**：对同批聊天任务记录误图、搜图次数、识图修正、模型费用及接收确认。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么人可试用，什么假设值得验证？

**研究主题**：采用判断、新假设与验证

#### 完整回答

有明确聊天用途、愿意维护图库并能核对显示结果的DSH用户，可先在私人测试会话试用一个小图库。先关闭不需要的主动发图，选一个唯一描述图片试Web；再放入重复描述图验证实际显示，收录一张明确允许外发的非敏感图片，核文件和索引。IM另用测试接收者验证原图与路径权限，不能直接迁移Web成功结论。

如果出现错图、只显示文字、未经预期主动插图，或文件写入与索引状态不一致，就停用该功能，保留图库与数据库备份，必要时纯文字回复。对正式客服或工作渠道，没有先验收发送身份和接收结果时，不应把它当可靠的生产投递系统。识图标签不准先人工修改，不靠重复模型调用掩盖问题。

可提出未验证的“稳定图片身份交付”假设。当前Web以描述文本重新找图，直接渠道回调也不是送达确认；可把候选绑定图库ID、图片内容摘要和消息内稳定引用，再分别记录已选、已请求投递和已确认显示。相对描述标记，它可能减少重名与更新后历史错图，但新增协议、历史引用与隐私元数据负担。

最小验证用重复描述、前80字相同、重命名/删图、渠道异步拒绝和重载场景，对比当前方案与稳定引用，记录错图、未确认误报和恢复时间。若稳定引用并未降低错误、却让旧消息或跨渠道不可恢复，就推翻或收窄假设；不把该设计算成现有投递能力。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:2667-2679](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/client.js#L2667-L2679)

描述与截断索引支持稳定身份假设。

<details>
<summary>查看原文（13行）</summary>

```text
      const captions = new Map()
      const keywords = new Map()
      for (const row of rows || []) {
        const url = toUrl(row)
        addIndexKey(captions, row.caption, url)
        addIndexKey(captions, row.file_name, url)
        addIndexKey(captions, String(row.caption || '').slice(0, 80), url)
        addIndexKey(captions, String(row.caption || '').slice(0, 100), url)
        const kw = String(row.keywords || '')
        addIndexKey(keywords, kw, url)
        for (const word of kw.split(/\s+/)) addIndexKey(keywords, word, url)
      }
      return { caption: captions, keyword: keywords }
```

</details>

**依据 2 · 源码核查**：[memes.js:898-906](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/memes.js#L898-L906)

非等待回调支持分离发送请求与确认。

```text
        if (sendImage) {
          try {
            sendImage(absolute)
            return { ok: true, message: '已发送表情包', path }
          } catch (error) {
            return { ok: false, message: '发送失败: ' + (error instanceof Error ? error.message : String(error)) }
          }
        }
        return { ok: false, message: '没有可用发送通道: ' + absolute }
```

**依据 3 · 源码核查**：[index.js:1304-1328](https://github.com/yyh-001/dsh-meme/blob/b09aa39a42eacf6ebfbc354b27348447f4c83f16/index.js#L1304-L1328)

文件与索引失败窗口支持状态核对。

<details>
<summary>查看原文（25行）</summary>

```text
          // 落点:当前图库在插件包内(升级会被清空)时改写「我的收藏」。附件是 GIF
          // 但字节已不是 GIF → 宿主聊天通道把它压成了单帧,结果里要给用户保真路径。
          const targetRoot = writeTarget()
          const redirected = resolve(targetRoot) !== resolve(memes.root)
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

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
