# dsh-tingdong

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[a2bf5ae](https://github.com/AIcivilization/dsh-tingdong/tree/a2bf5aecb0e6720c9d8a6810d06d31d5f139d0a4)

<!-- BEGIN META -->
[![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-tingdong)
<!-- END META -->

> **实现功能**：把英文音频或文档制成逐句听力课，提供翻译讲解、音轨、练习、间隔复习与导出。

> **核心亮点**：将本地识别、逐句讲解、音轨和复习状态组织成可校订的自有材料听力课，贡献在制课到练习的流程衔接；ASR/TTS/LLM与莱特纳方法不是本项目原创。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：“原文一个字不改”主要是提示词与数量门，cleanup只要求英文词数至少60%，不能证明语义保持；“掌握”只是box>=4的自评状态。材料整理和练习活动都不能直接证明真实听力收益。参见[Q03](#research-q03)。

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
  - [Q01 · 谁需要听读语言学习，相对手工或宿主原生办法增加什么？](#detail-section-11)
  - [Q02 · ASR、翻译、词汇复习与学习记录如何从入口形成完整调用链，依赖失效怎么办？](#detail-section-12)
  - [Q03 · 什么实现边界最可能使听读语言学习的贡献不成立，哪些工程设计可复用？](#detail-section-13)
  - [Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？](#detail-section-14)
  - [Q05 · 可从ASR、翻译、词汇复习与学习记录的限制推导什么可证伪改进？](#detail-section-15)
  - [Q06 · 哪些用户可以受控采用听读语言学习，何时应停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向用自己英文音频/文档练听力的中文学习者，交付为可校订句子、时间轴、双语讲解与复习队列；学习记录中的“掌握”是软件规则，不是语言能力测评。

播放器+字幕+翻译+记忆卡可完成相近任务；本插件改变交接和课程记录，不保证优于相同学习时长。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| tingdong_import | 导入音频/文件夹并制课 | ffmpeg/ASR/可选LLM，需审校时间轴 |
| tingdong_import_text | 导入英文文本课 | 原文/AI整理及TTS；词数门非语义保真 |
| tingdong_lessons | 查询课程及学习进度 | 活动/自评状态非能力测评 |
| tingdong_sentences | 读取句子讲解与困难项 | 翻译和识别需与原件复核 |
| 文档确认与留档 | 导入前估计、保留原件/raw/整理文本 | 可提取英文，扫描PDF需先OCR |
| 精听/复习队列 | 盲听、自评、选义和听写 | SRS规则不证迁移效果 |
| 音轨与磨耳朵 | 连续播放及重复练习 | CPU/存储/TTS；Edge文字外发 |
| 字幕/配音导出 | 离线复习与记录 | 编码/TTS资源，时间对齐需核 |
| 句子修订 | 修改/合拆句与补讲解 | 需用户审英文，改材后核音轨/进度 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20、Harness或CLI | 必需 | 面板与课程存储 | 独立模式需另配模型 |
| ffmpeg和本地ASR模型 | 音频制课必需 | 解码/识别与时间轴 | 缺少不能完整导入音频 |
| 可用LLM路由 | 双语讲解/AI整理需要 | 校对和逐句教学 | 可先保留英文，翻译缺句后补 |
| TTS引擎及模型/网络 | 文档音轨/配音需要 | Edge或Kokoro合成 | Edge文字外发，本地需下载与CPU |
| 原文/音频核对能力 | 效果必需 | 纠正ASR与翻译错误 | 错误可能进入练习与复习 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 配置模型、ffmpeg与本地资源 | 设置页状态仅作准备信号 |
| 2 | 导入音频或先确认文档卡片 | 抽查提取/整理与时间轴 |
| 3 | 逐句核对翻译后开始练习 | 缺句/错句先修，不把ready当语义正确 |
| 4 | 按规则复习并做外部盲听检查 | 学习进度与真实迁移分开验收 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | ASR/TTS模型、ffmpeg及磁盘，金额未知 | 配置并校订样本课程 | 有本地和云语音不同路径 |
| 持续使用 | 模型批次/重试token、CPU合成、音轨存储 | 每天练习与修错的时间 | 作者单案例制课速度非普遍指标 |
| 失败恢复 | 重新识别/补译/生成音轨 | 核对原始、整理后和练习版本 | 部分成功需继续，不应重复全导入 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 制课 | ASR/翻译/文档留档与断点机制 | 真实识别/讲解准确率 |
| 原文保护 | doc翻译强制en=s.text，清理有词数门 | 词数>=60%不保证语义或逐字保真 |
| 复习 | 莱特纳间隔和自评计数 | 对未见材料的听力提升 |

> **思考**：“原文一个字不改”主要是提示词与数量门，cleanup只要求英文词数至少60%，不能证明语义保持；“掌握”只是box>=4的自评状态。材料整理和练习活动都不能直接证明真实听力收益。参见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将本地识别、逐句讲解、音轨和复习状态组织成可校订的自有材料听力课，贡献在制课到练习的流程衔接；ASR/TTS/LLM与莱特纳方法不是本项目原创。参见[Q01](#research-q01)、[Q02](#research-q02)。

将本地识别、逐句讲解、音轨和复习状态组织成可校订的自有材料听力课，贡献在制课到练习的流程衔接；ASR/TTS/LLM与莱特纳方法不是本项目原创。参见[Q01](#research-q01)、[Q02](#research-q02)。

保留原件、分阶段持久化、缺句缩批重试和文档en回原句可借鉴；数量门无法替代语义保真，学习状态需独立评价校准。

<a id="detail-section-5"></a>

### 1.4 主要限制

“原文一个字不改”主要是提示词与数量门，cleanup只要求英文词数至少60%，不能证明语义保持；“掌握”只是box>=4的自评状态。材料整理和练习活动都不能直接证明真实听力收益。参见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可让能核对英文与译文的个人用短篇低敏感材料试用，先修ASR/翻译再练习；考试成绩承诺、无能力审校或要求原文严格保真的任务先观察。课程错误、时间轴漂移或费用超预算即停止制课。参见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

制课与复习状态可核；原文保真、教学质量及能力迁移未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、plugin/index.js、plugin/tools.js、lib/importer.js、lib/docprep.js、lib/translate.js、lib/srs.js、lib/store.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读Host接线、导入留档、文档清理、逐句翻译、SRS及存储；未完整审计所有音轨/SSH/导出分支或运行模型。
- 下一步：选已知原文短材料核对整理/译文及时间轴，记录全部制课成本；在相同时间下测陌生音频与延迟结果。

**分析版本**

- **仓库**：[AIcivilization/dsh-tingdong](https://github.com/AIcivilization/dsh-tingdong)
- **版本号**：0.5.1（[固定提交 a2bf5ae](https://github.com/AIcivilization/dsh-tingdong/tree/a2bf5aecb0e6720c9d8a6810d06d31d5f139d0a4)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可在文档整理加入逐段文本对齐收据，把删除/替换交人工确认，学习效果另用未见音频盲测与延迟复测。对照同词数但语义改写样本及相同学习时长，若保真错误或迁移成绩不改善则否定；假设未验证且增加审校成本。参见[Q05](#research-q05)。

选已知原文短材料核对整理/译文及时间轴，记录全部制课成本；在相同时间下测陌生音频与延迟结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 35 | 6429 | 5312 | 718 | — |
| .md | source | 1 | 169 | — | — | 3121 |
| .js | test | 8 | 892 | 790 | 26 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AIcivilization/dsh-tingdong/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 a2bf5aecb0e6720c9d8a6810d06d31d5f139d0a4 和截止 2026-10-23T01:41:11Z 范围内，听读语言学习能为明确用户提供什么可核查增量，其关键限制、总成本和采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要听读语言学习，相对手工或宿主原生办法增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

中文母语学习者有自己的英文音频/文章，希望从被动播放转为逐句听、释义、修错和复习。原办法是播放器+字幕/翻译+记忆卡，插件把制课和状态交接合成一套，合格结果是对齐原声且可校订的课，而非自动证明“一听就懂”。已有码名与自评状态仅代表活动记录，需陌生材料迁移测试。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:8-27](https://github.com/AIcivilization/dsh-tingdong/blob/a2bf5aecb0e6720c9d8a6810d06d31d5f139d0a4/README.md#L8-L27)

作者场景与导入流程

<details>
<summary>查看原文（20行）</summary>

````text
把英文有声读物（MP3）或英文文档变成听力课，练到**听到英文就知道是什么意思**。
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（dsh）插件，也能脱离 DSH 单独用。

## 安装

```bash
dsh plugin --profile desktop add dsh-tingdong    # 装进 DSH（把 desktop 换成你的 profile 名，先完全退出 DSH）
npm i -g dsh-tingdong                            # 命令行版：不开 DSH 也能用
dsh plugin --profile desktop add github:AIcivilization/dsh-tingdong   # 源码安装
```

- **能力分类**：工具与能力（英语听力学习）
- **运行要求**：Node.js ≥ 20；DSH web / desktop profile；解码 MP3 需要 [ffmpeg](https://ffmpeg.org)（Mac：`brew install ffmpeg`）
- **许可证**：[MIT](LICENSE)
- **数据边界**：课程和学习进度都在本机 `~/.dsh/dsh-tingdong/`；识别用 DSH 自带语音输入模型（音频不上传）；讲解和朗读用你在 DSH 里选的大模型；Edge 语音组件需联网（文字会发到微软服务器，详见下方导出说明）

## 它做什么

首页有两个入口：**导入音频**（有声书、讲座、引导音频）和**导入文档**（文章、手册、书）。

````

</details>

**依据 2 · 源码核查**：[lib/srs.js:1-11](https://github.com/AIcivilization/dsh-tingdong/blob/a2bf5aecb0e6720c9d8a6810d06d31d5f139d0a4/lib/srs.js#L1-L11)

复习算法为简化莱特纳而非语言测量

<details>
<summary>查看原文（11行）</summary>

```text
// lib/srs.js — 间隔复习：一句话要在不同的日子里「一听就懂」好几次，才算真的会了
//
// 简化的莱特纳盒子：听懂了升一格、隔得更久再考；没听懂打回第 0 格，一分钟后再来一次。
// 第 4 格（≥ 7 天后还能听懂）算「掌握」。

const MIN = 60 * 1000
const DAY = 24 * 60 * MIN

/** 第 n 格之后多久再考 */
export const INTERVALS = [1 * MIN, 10 * MIN, 1 * DAY, 3 * DAY, 7 * DAY, 16 * DAY, 35 * DAY, 90 * DAY]
export const MASTERED_BOX = 4
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · ASR、翻译、词汇复习与学习记录如何从入口形成完整调用链，依赖失效怎么办？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Host接当前LLM路由与guarded面板，Importer把音频排队、本地ASR后批量翻译；文档先提取留raw/原文件、估算并确认，再整理分课和朗读。translate缺句缩小批次重试并允许部分完成，store原子JSON记录课程与进度。需Node、音频时ffmpeg/ASR，讲解时模型及文档音轨的TTS；先配置和抽查，再练习与补译，失败从已有状态继续。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/index.js:42-61](https://github.com/AIcivilization/dsh-tingdong/blob/a2bf5aecb0e6720c9d8a6810d06d31d5f139d0a4/plugin/index.js#L42-L61)

当前模型路由与服务接线

<details>
<summary>查看原文（20行）</summary>

```text
export function apply(ctx, config = {}) {
  const cfg = config || {}
  let llm
  let defaults
  let version = ''
  readPkgJson().then(p => { version = p.version || '' })

  // 每次翻译时取当前模型：配置优先，否则 DSH 的默认模型（用户在 DSH 里换了模型就跟着换）
  const route = () => {
    if (cfg.provider && cfg.model) return { provider: cfg.provider, model: cfg.model }
    try {
      const sel = defaults && defaults.currentSelection()
      return sel && sel.provider && sel.model ? { provider: sel.provider, model: sel.model } : null
    } catch { return null }
  }

  ctx.inject(['llm'], (c) => {
    c.effect(() => {
      llm = c.llm || (c.get && c.get('llm'))
      return () => { llm = undefined }
```

</details>

**依据 2 · 源码核查**：[lib/importer.js:119-140](https://github.com/AIcivilization/dsh-tingdong/blob/a2bf5aecb0e6720c9d8a6810d06d31d5f139d0a4/lib/importer.js#L119-L140)

文档预处理不调用AI且留档

<details>
<summary>查看原文（22行）</summary>

```text
  async prepareDoc(file, o) {
    const ext = (/\.[a-z0-9]+$/i.exec(o.name || '') || ['.txt'])[0].toLowerCase()
    const r = file ? await extractText(file, o.name) : { type: '粘贴的文字', text: String(o.text || '') }
    if (r.scanned) throw Object.assign(new Error('这是扫描版 PDF（每页都是图片），读不出文字。先用手机或电脑的文字识别（OCR）、或让 AI 把它转成文字（.txt），再导入。'), { status: 400 })
    const text = r.text.trim()
    if ((text.match(/[A-Za-z]+/g) || []).length < 20) throw Object.assign(new Error('文档里几乎没有英文'), { status: 400 })
    if (text.length > MAX_CHARS) {
      throw Object.assign(new Error(`太长了：约 ${Math.round(text.length / 6 / 1000)} 千词。一次最多约 6 万词（${MAX_CHARS / 1000} 千字符，相当于 7 小时左右的朗读），拆成几份导入。`), { status: 400 })
    }
    // 已经是「# 章节」格式的 Markdown 不用 AI 再整理
    const formatted = (ext === '.md' || ext === '.markdown' || !file) && /^#\s+\S/m.test(text)
    const llm = this.deps.llm()
    const docId = createHash('sha1').update(text).digest('hex').slice(0, 12)
    const dir = join(dataRoot(), 'docs', docId)
    await mkdir(dir, { recursive: true })
    if (file) await copyFile(file, join(dir, `original${ext}`))
    if (o.removeSource && file) await rm(file, { force: true })
    await writeFile(join(dir, 'raw.txt'), text)
    // 粘贴的文字没有文件名：标题留空，整理后用第一章的标题
    const title = file ? (o.name || '').replace(/\.[a-z0-9]+$/i, '').replace(/[_]+/g, ' ').trim() : (o.title || '')
    const meta = {
      docId, name: o.name || '粘贴的文字', title, type: r.type, ext, pages: r.pages || null,
```

</details>

**依据 3 · 源码核查**：[lib/translate.js:114-140](https://github.com/AIcivilization/dsh-tingdong/blob/a2bf5aecb0e6720c9d8a6810d06d31d5f139d0a4/lib/translate.js#L114-L140)

缩批重试与部分完成

<details>
<summary>查看原文（27行）</summary>

```text
  await pool(batches.map(batch => async () => {
    let missing = batch
    for (let attempt = 0; attempt < 3 && missing.length; attempt++) {
      // 第一次整批；之后把缺的拆成小批再试
      const parts = attempt === 0 ? [missing] : chunk(missing, Math.max(3, Math.ceil(size / (2 * attempt))))
      const still = []
      for (const part of parts) {
        if (opt.signal && opt.signal.aborted) throw new Error('已取消')
        try {
          const got = await runBatch(llm, part, contextFor(part[0]), opt.hint, opt.signal, opt.doc)
          for (const s of part) {
            const item = got.get(s.i)
            if (item && (item.zh || item.skip)) { apply(s, item); done++ } else still.push(s)
          }
        } catch (e) {
          if (opt.signal && opt.signal.aborted) throw e
          errors.push(e.message)
          still.push(...part)
        }
        if (opt.onProgress) opt.onProgress(done, total)
        if (opt.onBatch) await opt.onBatch()
      }
      missing = still
    }
  }), opt.concurrency || 3)

  return { failed: total - done, errors: [...new Set(errors)].slice(0, 5) }
```

</details>

**依据 4 · 源码核查**：[lib/store.js:18-31](https://github.com/AIcivilization/dsh-tingdong/blob/a2bf5aecb0e6720c9d8a6810d06d31d5f139d0a4/lib/store.js#L18-L31)

原子写及队列

<details>
<summary>查看原文（14行）</summary>

```text
/** 先写临时文件再改名：写到一半断电也不会把课程弄坏 */
async function writeJson(path, value) {
  const tmp = `${path}.${process.pid}.${randomUUID().slice(0, 8)}.tmp`
  await writeFile(tmp, JSON.stringify(value, null, 1))
  await rename(tmp, path)
}

// 同一课的写入排队，免得翻译进度和界面评分同时写把对方覆盖掉
const queues = new Map()
function serial(id, fn) {
  const prev = queues.get(id) || Promise.resolve()
  const next = prev.then(fn, fn)
  queues.set(id, next.catch(() => {}))
  return next
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么实现边界最可能使听读语言学习的贡献不成立，哪些工程设计可复用？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

关键质疑是教材是否忠实及练习统计是否可代表效果。文档清理只用词数阈值接受，不查语义等价；即使单词数量接近也可替换关键否定词。文档翻译路径强制英文回原句是正向保护，但更早整理仍会改变材料。SRS按自评升box且box>=4标掌握，不检查未见句理解。工程可借鉴原始留档、部分补译与进程隔离，需保留这些边界。

#### 证据与依据

**依据 1 · 源码核查**：[lib/docprep.js:140-154](https://github.com/AIcivilization/dsh-tingdong/blob/a2bf5aecb0e6720c9d8a6810d06d31d5f139d0a4/lib/docprep.js#L140-L154)

60%词数门和fallback

<details>
<summary>查看原文（15行）</summary>

```text
    const want = words(chunk)
    for (let attempt = 0; attempt < 2; attempt++) {
      if (o.signal && o.signal.aborted) throw new Error('已取消')
      try {
        const text = stripWrapper(await llm.complete({ system: SYSTEM, user, maxTokens: 16000, signal: o.signal }))
        const got = words(text)
        if (want < 30 || got >= want * 0.6) { out[k] = ensureStructure(text); return }
      } catch (e) {
        if (o.signal && o.signal.aborted) throw e
        if (attempt === 1) warnings.push(`第 ${k + 1} 段整理失败（${e.message}），用了原文`)
      }
    }
    if (!out[k]) {
      out[k] = ensureStructure(plainTidy(chunk))
      if (!warnings.some(w => w.startsWith(`第 ${k + 1} 段`))) warnings.push(`第 ${k + 1} 段 AI 整理后少了很多内容，改用原文（可能留有页眉页码）`)
```

</details>

**依据 2 · 源码核查**：[lib/translate.js:101-107](https://github.com/AIcivilization/dsh-tingdong/blob/a2bf5aecb0e6720c9d8a6810d06d31d5f139d0a4/lib/translate.js#L101-L107)

文档路径保留原英文

```text
  // 文档课：英文是准确的书面原文，不让模型改；也没有「非讲话」
  const apply = (s, item) => {
    s.en = opt.doc ? s.text : (item.en || s.text)
    s.zh = item.zh
    s.words = item.words
    s.sound = item.sound
    s.skip = opt.doc ? false : item.skip
```

**依据 3 · 源码核查**：[lib/srs.js:14-34](https://github.com/AIcivilization/dsh-tingdong/blob/a2bf5aecb0e6720c9d8a6810d06d31d5f139d0a4/lib/srs.js#L14-L34)

自评驱动box和掌握标记

<details>
<summary>查看原文（21行）</summary>

```text
export function grade(card, g, now = Date.now()) {
  const c = { box: 0, seen: 0, good: 0, again: 0, ...(card || {}) }
  c.seen++
  c.last = now
  c.lastGrade = g
  if (g >= 2) {
    c.good++
    c.box = Math.min(c.box + 1, INTERVALS.length - 1)
    c.due = now + INTERVALS[c.box]
  } else if (g === 1) {
    c.box = Math.max(1, Math.min(c.box, 2))
    c.due = now + INTERVALS[1]
  } else {
    c.again++
    c.box = 0
    c.due = now + INTERVALS[0]
  }
  return c
}

export const isMastered = c => Boolean(c && c.box >= MASTERED_BOX)
```

</details>

#### 缺口

- 语义保真和陌生材料听力迁移未独立测量
  **影响**：不能支持严格原文或能力提升主张
  **进一步探讨**：核对原始/整理文本并做同时间学习对照及延迟盲测

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？

**研究主题**：效果与总成本

#### 完整回答

首次需准备ffmpeg、ASR/TTS和模型路由，并审校短课程；持续成本是LLM翻译/重试、音轨CPU与每天练习；失败恢复需补缺句、改时间轴/文本并重新生成相关音轨。保留原始文档有助纠错却增加存储，Edge会外发文字。没有每合格课程或每正确句的金额/工时数据，作者案例只能作为声明。

#### 证据与依据

**依据 1 · 源码核查**：[lib/translate.js:114-140](https://github.com/AIcivilization/dsh-tingdong/blob/a2bf5aecb0e6720c9d8a6810d06d31d5f139d0a4/lib/translate.js#L114-L140)

最多三轮且并发模型调用

<details>
<summary>查看原文（27行）</summary>

```text
  await pool(batches.map(batch => async () => {
    let missing = batch
    for (let attempt = 0; attempt < 3 && missing.length; attempt++) {
      // 第一次整批；之后把缺的拆成小批再试
      const parts = attempt === 0 ? [missing] : chunk(missing, Math.max(3, Math.ceil(size / (2 * attempt))))
      const still = []
      for (const part of parts) {
        if (opt.signal && opt.signal.aborted) throw new Error('已取消')
        try {
          const got = await runBatch(llm, part, contextFor(part[0]), opt.hint, opt.signal, opt.doc)
          for (const s of part) {
            const item = got.get(s.i)
            if (item && (item.zh || item.skip)) { apply(s, item); done++ } else still.push(s)
          }
        } catch (e) {
          if (opt.signal && opt.signal.aborted) throw e
          errors.push(e.message)
          still.push(...part)
        }
        if (opt.onProgress) opt.onProgress(done, total)
        if (opt.onBatch) await opt.onBatch()
      }
      missing = still
    }
  }), opt.concurrency || 3)

  return { failed: total - done, errors: [...new Set(errors)].slice(0, 5) }
```

</details>

**依据 2 · 源码核查**：[lib/importer.js:131-136](https://github.com/AIcivilization/dsh-tingdong/blob/a2bf5aecb0e6720c9d8a6810d06d31d5f139d0a4/lib/importer.js#L131-L136)

原件和raw留档

```text
    const docId = createHash('sha1').update(text).digest('hex').slice(0, 12)
    const dir = join(dataRoot(), 'docs', docId)
    await mkdir(dir, { recursive: true })
    if (file) await copyFile(file, join(dir, `original${ext}`))
    if (o.removeSource && file) await rm(file, { force: true })
    await writeFile(join(dir, 'raw.txt'), text)
```

**依据 3 · 作者声明**：[README.md:147-154](https://github.com/AIcivilization/dsh-tingdong/blob/a2bf5aecb0e6720c9d8a6810d06d31d5f139d0a4/README.md#L147-L154)

作者单案例性能报告

````text
npm install
npm test
```

- `lib/asr-worker.js` 识别子进程（sherpa-onnx 是同步推理，放在 DSH 主进程里会卡界面）
- `lib/translate.js` 校对 + 翻译 + 生词 + 听音提示；缺句自动缩小批次重试，失败的留空，之后可「补全翻译」
- `lib/tracks.js` 声音轨：原声按句截取拼接；朗读交给 `lib/tts-worker.js` 子进程（Kokoro / macOS say），`lib/pcm.js` 统一拼接编码并出时间表
- `lib/srs.js` 间隔复习；`lib/store.js` 原子写入的 JSON 存储；`lib/today.js` 今日学习（按用户时区算日期）
````

#### 缺口

- 全流程token、重试、审校工时与学习效果未知
  **影响**：无法判断相对手工字幕的净成本
  **进一步探讨**：同长度材料记录制课全调用与修错时间，按合格句分摊

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可从ASR、翻译、词汇复习与学习记录的限制推导什么可证伪改进？

**研究主题**：新假设与验证

#### 完整回答

未验证方案为可审文本对齐加独立学习评估。当前数量门只能拦大面积删字，因此先做逐段差异定位、保留删改理由与人工接受，避免错材传播；然后在相同练习时长比较插件/播放器字幕对陌生音频的理解。若仍漏改关键含义、审校过重或迁移不提高即否定，并单独记录延迟复测，不能用box自证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/docprep.js:140-154](https://github.com/AIcivilization/dsh-tingdong/blob/a2bf5aecb0e6720c9d8a6810d06d31d5f139d0a4/lib/docprep.js#L140-L154)

数量门的改进切入点

<details>
<summary>查看原文（15行）</summary>

```text
    const want = words(chunk)
    for (let attempt = 0; attempt < 2; attempt++) {
      if (o.signal && o.signal.aborted) throw new Error('已取消')
      try {
        const text = stripWrapper(await llm.complete({ system: SYSTEM, user, maxTokens: 16000, signal: o.signal }))
        const got = words(text)
        if (want < 30 || got >= want * 0.6) { out[k] = ensureStructure(text); return }
      } catch (e) {
        if (o.signal && o.signal.aborted) throw e
        if (attempt === 1) warnings.push(`第 ${k + 1} 段整理失败（${e.message}），用了原文`)
      }
    }
    if (!out[k]) {
      out[k] = ensureStructure(plainTidy(chunk))
      if (!warnings.some(w => w.startsWith(`第 ${k + 1} 段`))) warnings.push(`第 ${k + 1} 段 AI 整理后少了很多内容，改用原文（可能留有页眉页码）`)
```

</details>

**依据 2 · 源码核查**：[lib/srs.js:19-34](https://github.com/AIcivilization/dsh-tingdong/blob/a2bf5aecb0e6720c9d8a6810d06d31d5f139d0a4/lib/srs.js#L19-L34)

自评进度需外部结果校准

<details>
<summary>查看原文（16行）</summary>

```text
  if (g >= 2) {
    c.good++
    c.box = Math.min(c.box + 1, INTERVALS.length - 1)
    c.due = now + INTERVALS[c.box]
  } else if (g === 1) {
    c.box = Math.max(1, Math.min(c.box, 2))
    c.due = now + INTERVALS[1]
  } else {
    c.again++
    c.box = 0
    c.due = now + INTERVALS[0]
  }
  return c
}

export const isMastered = c => Boolean(c && c.box >= MASTERED_BOX)
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些用户可以受控采用听读语言学习，何时应停止？

**研究主题**：采用判断

#### 完整回答

建议有英文审校能力者先用短音频、公开文章试用，手核ASR、时间轴和翻译，再检查复习队列；只求自动成课且不能纠错者暂缓。成功为课程忠实且练习流程可用，听力提升另行盲测；材料丢义、时间轴错位、云外发不合要求或预算失控就停用对应制课能力，并导出/备份本地课程。

#### 证据与依据

**依据 1 · 源码核查**：[lib/importer.js:119-140](https://github.com/AIcivilization/dsh-tingdong/blob/a2bf5aecb0e6720c9d8a6810d06d31d5f139d0a4/lib/importer.js#L119-L140)

原始留档提供复核依据

<details>
<summary>查看原文（22行）</summary>

```text
  async prepareDoc(file, o) {
    const ext = (/\.[a-z0-9]+$/i.exec(o.name || '') || ['.txt'])[0].toLowerCase()
    const r = file ? await extractText(file, o.name) : { type: '粘贴的文字', text: String(o.text || '') }
    if (r.scanned) throw Object.assign(new Error('这是扫描版 PDF（每页都是图片），读不出文字。先用手机或电脑的文字识别（OCR）、或让 AI 把它转成文字（.txt），再导入。'), { status: 400 })
    const text = r.text.trim()
    if ((text.match(/[A-Za-z]+/g) || []).length < 20) throw Object.assign(new Error('文档里几乎没有英文'), { status: 400 })
    if (text.length > MAX_CHARS) {
      throw Object.assign(new Error(`太长了：约 ${Math.round(text.length / 6 / 1000)} 千词。一次最多约 6 万词（${MAX_CHARS / 1000} 千字符，相当于 7 小时左右的朗读），拆成几份导入。`), { status: 400 })
    }
    // 已经是「# 章节」格式的 Markdown 不用 AI 再整理
    const formatted = (ext === '.md' || ext === '.markdown' || !file) && /^#\s+\S/m.test(text)
    const llm = this.deps.llm()
    const docId = createHash('sha1').update(text).digest('hex').slice(0, 12)
    const dir = join(dataRoot(), 'docs', docId)
    await mkdir(dir, { recursive: true })
    if (file) await copyFile(file, join(dir, `original${ext}`))
    if (o.removeSource && file) await rm(file, { force: true })
    await writeFile(join(dir, 'raw.txt'), text)
    // 粘贴的文字没有文件名：标题留空，整理后用第一章的标题
    const title = file ? (o.name || '').replace(/\.[a-z0-9]+$/i, '').replace(/[_]+/g, ' ').trim() : (o.title || '')
    const meta = {
      docId, name: o.name || '粘贴的文字', title, type: r.type, ext, pages: r.pages || null,
```

</details>

**依据 2 · 源码核查**：[lib/srs.js:41-50](https://github.com/AIcivilization/dsh-tingdong/blob/a2bf5aecb0e6720c9d8a6810d06d31d5f139d0a4/lib/srs.js#L41-L50)

复习队列可核但不是效果证据

<details>
<summary>查看原文（10行）</summary>

```text
export function reviewQueue(ids, cards, { now = Date.now(), newLimit = 15, limit = 60 } = {}) {
  const due = []
  const fresh = []
  for (const i of ids) {
    const c = cards[i]
    if (!c) fresh.push(i)
    else if (c.due <= now) due.push(i)
  }
  due.sort((a, b) => cards[a].due - cards[b].due)
  return [...due, ...fresh.slice(0, newLimit)].slice(0, limit)
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
