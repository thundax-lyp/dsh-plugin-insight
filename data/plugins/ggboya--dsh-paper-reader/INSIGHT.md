# DSH Paper Reader

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[87ee321](https://github.com/GGboya/dsh-paper-reader/tree/87ee32184a9ffb214f635e6838f05e05f347eb8d)

<!-- BEGIN META -->
[![GitHub ★ 49](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=49&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/GGboya/dsh-paper-reader) [![npm 30d 9,422](https://img.shields.io/static/v1?label=npm+30d&message=9%2C422&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ggboy123/dsh-paper-reader) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ggboy123/dsh-paper-reader)
<!-- END META -->

> **功能**：在 DSH 联动 PDF 文献库、分块检索与论文会话，提供可回查的页码跳转入口。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 核对了文献、转录和会话入口相连，能够把检索片段和页码带回阅读流程。

> **主要限制**：[Q03](#research-q03) 页码是块起点，旧链接的目标缺失时可能打开其他文档，范围选择只限制附加上下文。需核对文献身份、页及原句。

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
  - [Q01 · 伴读比人工复制 PDF 片段增加什么？](#detail-section-11)
  - [Q02 · PDF 怎样变成可搜和带页码的证据？](#detail-section-12)
  - [Q03 · 论文会话如何约束引用，哪些结果会漏或误？](#detail-section-13)
  - [Q04 · 如何低成本试读、恢复并退出？](#detail-section-14)
  - [Q05 · 固定正反例能否验证引用可回查？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：读论文的 DSH 用户想针对一处方法或结论提问，并用原始 PDF 的具体页码和句子复核。

人工在 PDF 查找并复制原句到对话，手记页码，再回原文核对。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：transcribe_pdf、search_paper 等论文工具
- **界面**：Web PDF 文献库、页码与伴读
- **Agent/Preset**：可选论文伴读 preset
- **Host 路由**：阅读器与会话投递

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH Tools 和 Node | 启动必需 | 加载论文工具 | Host 注册失败 |
| Web 和 SessionController 等宿主服务 | 伴读界面必需 | 阅读器和原生会话 | 只能使用已有工具或无法投递 |
| 可读 PDF 与独立文献库 | 基本任务必需 | 提取和保存转录 | 搜索无可用文本 |
| MinerU、嵌入或重排端点 | 可选 | 扫描或提高检索召回 | 按配置失败或降回关键词 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选公开 PDF 并保存原件 | 身份和页数可核 |
| 加载 | Host 载入插件，用户从阅读器打开文献 | 文献、会话及工具可见 |
| 执行 | 用户查固定原句并点回引用 | 确认命中、页和原句 |
| 验收 | 用户逐条核对，失败回原 PDF | 保留可独立复核的证据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH、PDF、转录空间 | 导入、选文献和检查文本层 | 配置人时及缓存尺寸未知 |
| 持续使用 | 模型与可选外部服务请求 | 逐条核对引用和附加范围 | 实际请求费用、检索成功率未知 |
| 失败恢复 | 原始 PDF、备用缓存或原阅读器 | 恢复文献和手工定位 | 修复时长和复杂文献成本未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 同会话伴读 | 有 Host 工具和文献会话 | 实际学习效果与节时 |
| 页码回查 | 有索引、链接基址与阅读器跳页 | 跨页、过期链接和模型引用准确性 |
| 受限附加范围 | 有正文预算和装配降级标识 | 模型结论准确性及外部隐私边界 |

> **思考**：[Q03](#research-q03) 页码是块起点，旧链接的目标缺失时可能打开其他文档，范围选择只限制附加上下文。需核对文献身份、页及原句。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 核对了文献、转录和会话入口相连，能够把检索片段和页码带回阅读流程。

会话默认论文、显示链接、检索页码和资料装配分层实现。缓存和论文目标变化都需读者复查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 页码是块起点，旧链接的目标缺失时可能打开其他文档，范围选择只限制附加上下文。需核对文献身份、页及原句。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q01](#research-q01) 先用公开短 PDF 试查一处原句，核对文献、页码和文字。[Q03](#research-q03) 若旧链接打开其他文献、片段找不到或附加范围降级，停止引用该回答，回原 PDF 人工核查。[Q04](#research-q04) 外部端点只用于允许发送的材料。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认 Host 论文工具、转录、页码及范围和阅读器回退。真实模型引用、资料隔离和业务收益待验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.ts、src/tools.ts、src/transcribe.ts、reader/index.html、src/host.ts、src/search.ts、src/scope.ts、src/embed.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根插件的 PDF 文本转录、检索、阅读器页码与范围问答。翻译、媒体、认证、外部端点、知识图谱及真实学习效果未完整验证。
- 下一步：固定源码。下一步用两篇小型公开 PDF 分别制造跨页唯一词、论文改名和范围受限，比较工具命中、实际页面和引用正确性。

**分析版本**

- **仓库**：[GGboya/dsh-paper-reader](https://github.com/GGboya/dsh-paper-reader)
- **版本号**：1.8.2（[固定提交 87ee321](https://github.com/GGboya/dsh-paper-reader/tree/87ee32184a9ffb214f635e6838f05e05f347eb8d)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 用跨页关键词、错域文献与过期链接的成对例子，可以验证自动引用在具体阅读任务的准确性。

固定源码。下一步用两篇小型公开 PDF 分别制造跨页唯一词、论文改名和范围受限，比较工具命中、实际页面和引用正确性。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 32 | 6017 | — | — | 107072 |
| .mjs | source | 3 | 655 | 543 | 57 | — |
| .js | example | 1 | 9 | 6 | 1 | — |
| .mjs | example | 1 | 60 | 38 | 16 | — |
| .js | source | 1 | 2056 | 1614 | 401 | — |
| .ts | source | 25 | 12127 | 9081 | 2393 | — |
| .mjs | test | 56 | 25640 | 20742 | 3582 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/GGboya/dsh-paper-reader/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断阅读 PDF 论文的 DSH 用户，能否以同一论文内的页码证据复核旁读回答，并识别索引、检索和跨文档的边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 伴读比人工复制 PDF 片段增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

逐段阅读论文的研究者可在同一 DSH 界面提问、查页和继续阅读。作者声称回答会标页并高亮，固定根 bundle 和 Host 壳实际注册工具和 Web 路由。相对在 PDF 阅读器手工找页、复制给另一个会话再返回，该路径提供文献、片段和跳转基址。合格任务是文档、证据原句与页码都能匹配，而阅读和模型理解仍需用户确认。短文只问一处时，人工复制仍简单。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-28](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/README.md#L22-L28)

作者的工作台、跳转与范围主张

```text
- 📚 **三栏工作台**：专题文献库 + PDF 阅读器 + 右侧原生对话；安装后不改动官方界面，侧栏只多一行开关
- 💬 **带页码的伴读**：回答必带页码，点页码跳回原文并高亮；选中文字即问；支持历史对话
- 🌙 **PDF 深色模式**：dsh 切深色时 PDF 一起变深（默认跟随）；设置面板与阅读器「A」按钮同源、四档强度可调。实现是整页反色 + 色相回正，**图片/照片会明显褪色偏色**（实测纯红 `[255,0,0]` → 浅粉 `[229,134,134]`，不是真负片；已知代价，可一键关闭）；下载/导出始终是原文
- 🗂️ **按论文分文件夹**：每篇论文的 PDF/译文/转录/学习档案收进 `<专题>/<论文>/`；旧库有一条**幂等、可中断、可回滚**的迁移（先复制后删，先出干跑报告再执行）
- 🌳 **嵌套子专题**：专题下可建子专题、任意层嵌套；可改名、可移动到另一父专题；删除非空专题仍走「清空计划 + 手输确认」
- 🎯 **按范围提问**：提问时可指定范围（本篇 / 所在专题含子专题），只把该范围的目录内容与检索命中交给模型；范围外内容不出现，截断会明确说明
- 🤖 **可选教练式带读**：专用 preset 制定分步计划；你读原文、作答，AI 点评追问，当前阶段答好才继续，学习进度跨会话累积
```

**依据 2 · 源码核查**：[package.json:32-43](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/package.json#L32-L43)

根 bundle 与 Web 客户端

<details>
<summary>查看原文（12行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web"
    }
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:7-18](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/cordis.patch.yml#L7-L18)

实际插件与可选伴读 preset

<details>
<summary>查看原文（12行）</summary>

```text
- insert:
    - id: dsh-paper-reader
      name: '@ggboy123/dsh-paper-reader'

    # dsh 0.2.x 的声明式 preset：随 bundle 安装并在 profile 启动时注册，
    # 不再复制到已废弃的 $DSH_HOME/.agent-presets/。
    - id: preset-paper-reader
      name: '@deepseek-ai/dsh-agent-preset'
      config:
        id: paper-reader
        name: 论文伴读
        description: 可选的教练式论文伴读：你先独立阅读，AI 只负责出题、校验和追问薄弱点；每个阶段答好才继续，不灌输内容，只在你真正卡住时才讲解（每篇论文一份 .study.json 学习档案）。
```

</details>

**依据 4 · 源码核查**：[src/index.ts:11-22](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/src/index.ts#L11-L22)

Host 工具与 Web 服务接线

<details>
<summary>查看原文（12行）</summary>

```text
// 等宿主的工具注册服务（ctx.tools）就绪后再运行。
export const inject = ['tools']

export function apply(ctx: Context, config: PluginConfig = {}) {
  registerTools(ctx, config)
  console.log(`[dsh-paper-reader] registered tools: list_papers, transcribe_pdf, search_paper, study_progress, study_update`)

  // webServer 是可选服务（web profile 有，headless 没有）：出现时再挂路由。
  // connection/sessionController/workspaceController/workspaceRegistry 同属 web profile（cordis 要求访问前先声明 inject）。
  ctx.inject(['webServer', 'connection', 'sessionController', 'workspaceController', 'workspaceRegistry'], (rctx) => {
    registerRoutes(rctx, config)
  })
```

</details>

**依据 5 · 源码核查**：[src/tools.ts:86-102](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/src/tools.ts#L86-L102)

文献链接基址的构造

<details>
<summary>查看原文（17行）</summary>

```text
/** 某篇论文的阅读器链接基址（拼 &page=N 即跳转链接）；origin 未捕获到时为 null。 */
function readerUrl(ref: PaperRef): string | null {
  const o = readerOrigin()
  if (!o) return null
  return `${o}/paper-reader/?topic=${encodeURIComponent(ref.topic)}&name=${encodeURIComponent(ref.name)}`
}

/** 输出 schema 里的 readerUrl 字段声明（nullable：没有任何浏览器请求过时尚未捕获 origin）。 */
const readerUrlSchema = {
  oneOf: [{ type: 'string' }, { type: 'null' }],
  required: true,
  description:
    '阅读器链接基址。引用页码时在末尾拼 &page=N 生成跳转链接；要定位到具体段落再拼 &q=<该段落原文短引文，3~8个词，URL编码>，点击会高亮对应片段。为 null 时本次不带链接。',
} as const

/** render 文本尾部统一带出的链接基址行（preset 规定了用法，这里只暴露值）。 */
const readerUrlLine = (url: string | null) => (url ? `\n阅读器链接基址：${url}` : '')
```

</details>

#### 缺口

- 缺人工 PDF 检索与工作台的同任务比较。
  **影响**：不能量化定位人时、交付质量及学习收益。
  **进一步探讨**：用一篇短论文和一条已知证据核对阅读与跳转。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · PDF 怎样变成可搜和带页码的证据？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具先定位库内论文，再读已有转录。没有转录才自动调用解析，PDF 文本层存文本、页区间与元数据；文本过少时按配置尝试 MinerU。检索以分块和关键词为基础，已配嵌入和重排可补候选。工具回传块、页码和可为空的 readerUrl；模型按 preset 指示构造链接。阅读器接收 page 和短原句，片段匹配失败会退回该页。这链能帮助复核，但链接是否生成、内容是否证明结论需另查。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:337-360](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/src/tools.ts#L337-L360)

转录读取、缺失补录与检索

<details>
<summary>查看原文（24行）</summary>

```text
    execute: async (args, exec) => {
      const ref = locate(dataDir, args, exec)
      let cached = await readTranscript(ref)
      if (!cached) {
        const mineru = await resolveMineruConfig(config.mineru)
        await transcribePaper(ref, { source: 'auto', mineru })
        cached = await readTranscript(ref)
      }
      if (!cached) throw new Error('转录失败，无法检索')
      const chunks = chunkText(cached.text, 1500)
      const k = Math.max(1, Math.min(args.k ?? 5, 8))
      // 折叠项 1（查询侧 LaTeX 归一化）：投影侧只对 MinerU 产物做紧凑写法归一化，
      // 因此查询侧的同名变体也**只对 MinerU 来源的论文**追加；原查询永远保留 →
      // pdfjs/旧缓存论文既不丢命中也不引入新行为（与改造前逐字节一致）。
      const producer = (await readTranscriptMeta(ref))?.producer ?? null
      const variants = queryVariantsFor(producer, args.query)
      const compact = variants.length > 1 ? variants[1]! : null
      // 关键词快搜捞 shortlist（宽召回）→ 可选语义召回 → 既有重排 → top-k。
      // 凭据每次现查（设置面板保存即生效）；未配置时三段都退回纯关键词，行为与改造前一致。
      const rerankClient = await resolveRerankClient(config.typesafe)
      const embedCfg = await resolveEmbedConfig(config.embed)
      const wideRecall = Boolean(rerankClient) || embedCfg.enabled
      const recallSize = wideRecall ? Math.max(k, shortlistSize) : k
      let hits = searchChunksMulti(chunks, cached.pages, variants, recallSize)
```

</details>

**依据 2 · 源码核查**：[src/transcribe.ts:338-363](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/src/transcribe.ts#L338-L363)

本地缓存和扫描件回退

<details>
<summary>查看原文（26行）</summary>

```text
/** pdfjs 提取并落盘（.txt + .pages.json + .transcript.json），并清理 MinerU 富产物。 */
async function parseAndStorePdfjs(ref: PaperRef, mineru: ResolvedMineru): Promise<Transcript> {
  try {
    const t = await extractLocal(ref.pdfPath)
    await writeFile(ref.txtPath, t.text, 'utf8')
    await writeFile(ref.pagesPath, JSON.stringify({ pageCount: t.pageCount, pages: t.pages }, null, 2), 'utf8')
    await writeFile(ref.transcriptPath, JSON.stringify(pdfjsTranscriptMeta(t), null, 2), 'utf8')
    // 非 MinerU 来源重写成功后删除 MinerU 富产物（避免富产物与文本不同源，AC-C9）
    await rm(ref.mineruMdPath, { force: true })
    await rm(ref.mineruJsonPath, { force: true })
    return t
  } catch (err) {
    // 扫描件/文本过短：若 MinerU 已配置可用 → 自动兜底改走 MinerU（S10）
    if (err instanceof ShortTextError && mineru.config.mode !== 'off') {
      const fallback: Producer = mineru.config.mode === 'cloud' ? 'mineru-cloud' : 'mineru-local'
      try {
        return await parseAndStoreMineru(ref, fallback, mineru.config)
      } catch (mineruErr) {
        // MinerU 兜底也失败：报扫描件错误 + MinerU 指引，不静默吞掉
        throw new ShortTextError(`${err.message}（已尝试 MinerU 兜底也失败：${mineruErr instanceof Error ? mineruErr.message : String(mineruErr)}）`)
      }
    }
    if (err instanceof ShortTextError) {
      throw new ShortTextError(`${err.message}（可在「设置 → 论文伴读」启用 MinerU 后端自动解析扫描件，或换文本型 PDF、手动放置同名 .txt 缓存）`)
    }
    throw err
```

</details>

**依据 3 · 源码核查**：[src/tools.ts:384-419](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/src/tools.ts#L384-L419)

可选重排、降级和输出

<details>
<summary>查看原文（36行）</summary>

```text
      const fused = embedding.hits.length > 0
      if (fused) hits = fuseHybridCandidates(hits, embedding.hits, recallSize)
      if (!wideRecall) hits = hits.slice(0, k)
      if (embedding.degraded) {
        console.warn('[dsh-paper-reader] 嵌入检索降级为纯关键词:', embedding.degraded)
      }
      let reranked = false
      if (rerankClient && hits.length > k) {
        try {
          hits = await rerankHits(rerankClient, args.query, hits, k, config.typesafe?.deadlineMs ?? 1500)
          reranked = true
        } catch (e) {
          // 超预算/网络/鉴权任何失败都退回关键词 top-k（结果已算好，零成本降级）
          console.warn('[dsh-paper-reader] 检索重排失败，退回关键词排序:', e)
          hits = hits.slice(0, k)
        }
      }
      if (!reranked) hits = hits.slice(0, k)
      // 展示序：融合路径在**选定 top-k 之后**恢复原文顺序（重排成功路径在 rerankHits 内部已做）；
      // 纯关键词路径维持相关性序不变（既有行为，未配置嵌入/重排时逐字节一致）。
      if (fused && !reranked) hits = hits.slice().sort((a, b) => a.chunk.index - b.chunk.index)
      return {
        paper: `${ref.topic}/${ref.name}`,
        query: args.query,
        totalChunks: chunks.length,
        hits: hits.map((h) => ({ chunk: h.chunk.index, page: h.page, text: h.chunk.text })),
        reranked,
        compactQuery: compact,
        embedding: {
          configured: embedding.configured,
          used: embedding.used,
          fromCache: embedding.fromCache,
          degraded: embedding.degraded,
        },
        readerUrl: readerUrl(ref),
      }
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:35-44](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/cordis.patch.yml#L35-L44)

引用格式和默认论文属于提示词协议

<details>
<summary>查看原文（10行）</summary>

```text
                - transcribe_pdf: extract a paper's full text (cached, with a per-page index).
                - search_paper: search one paper's transcript; returns chunks with page numbers.
                - study_progress: read the student's learning record for a paper (plan + quiz history), stored in <论文>.study.json next to the PDF.
                - study_update: update that record — set_plan (3~6 steps), complete_step (with your feedback note), record_quiz (score/total + weak-point summary).

                Tool results carry a `阅读器链接基址` (readerUrl) line. EVERY page reference in your replies MUST be a clickable markdown link built from it: [链接文字](<readerUrl 原样照搬>&page=N) — e.g. [第 4 页](…&page=4). Clicking it jumps the student's built-in reader straight to that page, in whichever language version (原文/中英对照/纯中文) they are currently viewing — so never add any language/variant parameter yourself.

                When pointing at a specific passage (a re-read assignment, the evidence for an answer), ALSO append a quote parameter so the reader highlights the exact passage: &q=<a verbatim 3~8 word phrase lifted from that passage, URL-encoded, e.g. &q=inexpensive%20commodity%20hardware>. Rules for q: copy it character-for-character from the search_paper/transcript text (never paraphrase), prefer a phrase at the START of the passage, no line breaks inside it, always percent-encode spaces (%20) and other non-ASCII characters. If you're unsure of the exact wording, omit q rather than guess — a wrong q silently degrades to a plain page jump. Bare "（第 N 页）" text citations are a formatting failure; always link. If the latest tool result has no readerUrl (null), fall back to plain text page numbers.

                A paper-reader plugin session is bound to one paper: every paper tool auto-locates it when you omit topic/name, so NEVER ask the user which paper they mean there — just call the tool. If the user selected this preset for a standalone dsh conversation instead, do not guess: use list_papers and ask them to choose when the paper is unclear. Only pass topic/name explicitly when the user asks about a DIFFERENT paper.
```

</details>

**依据 5 · 源码核查**：[reader/index.html:3474-3491](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/reader/index.html#L3474-L3491)

跳页及高亮失败的回退

<details>
<summary>查看原文（18行）</summary>

```text
async function jumpTo(page, q) {
  const p0 = Math.max(1, (page | 0) || 1);
  if (pageMode === 'paged') {
    if (!pdfDoc) return;
    const p = Math.min(p0, pdfDoc.numPages);
    if (p !== curPage) { curPage = p; await rerender(); }
    if (!(q && highlightSnippet(p, q))) flashPage();
    return;
  }
  for (let i = 0; i < 100; i++) {
    if (pdfDoc && origPageNode(Math.min(p0, pdfDoc.numPages))) {
      const p = Math.min(p0, pdfDoc.numPages);
      if (lazyView) await ensureLazyPage(p);
      if (!(q && highlightSnippet(p, q))) jumpToPage(p);
      return;
    }
    await new Promise((r) => setTimeout(r, 100));
  }
```

</details>

#### 缺口

- 尚未对固定版真实 PDF 和模型测引用。
  **影响**：可构造 URL 不表示每次都会生成有效证据链接。
  **进一步探讨**：对可确认的原句分别点页码及高亮。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 论文会话如何约束引用，哪些结果会漏或误？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

缺显式目标时工具从会话 ID 解出默认论文，有显式目标时仍走通常查找。范围参数限制附加材料的组装，而既有会话历史及可用工具没有在这一分支被改写，装配异常还可无范围正文地继续。关键词命中按分块起点映射页码，跨页块的实际命中可能在下一页。搜索直接读取文本和页表，未经过转录入口的元数据大小校验；写盘分步发生时可能看到不一致缓存。若引用 URL 的目标论文不在库内，浏览器会用上次或首篇论文并继续传入页码和高亮参数，页面成功打开也应核对文档身份。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:52-63](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/src/tools.ts#L52-L63)

缺省会话绑定与显式定位

<details>
<summary>查看原文（12行）</summary>

```text
function locate(dataDir: string, args: LocateArgs, exec?: { agent?: { id?: string } }): PaperRef {
  const refArgs: { path?: string; topic?: string; name?: string } = {}
  if (args.path) refArgs.path = args.path
  if (args.topic) refArgs.topic = args.topic
  if (args.name) refArgs.name = args.name
  // 未指定论文时回退到「当前会话绑定的论文」：伴读会话 id 形如 dpr-<base64url(topic/name)>-N，
  // 工具执行上下文里的 agent.id 就是会话 id。直接在输入框提问（不经选中即问）时靠它定位。
  if (!refArgs.path && !refArgs.name) {
    const paper = paperFromSessionId(exec?.agent?.id)
    if (paper) return resolvePaper(dataDir, { topic: paper.topic, name: paper.name })
  }
  return resolvePaper(dataDir, refArgs)
```

</details>

**依据 2 · 源码核查**：[src/host.ts:1901-1933](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/src/host.ts#L1901-L1933)

范围块、降级和会话投递

<details>
<summary>查看原文（33行）</summary>

```text
      // 范围块：**追加**（不传 scope 时这段完全不存在 ⇒ 既有文案逐字不变，回归项 C2）
      let scopeInfo: Record<string, unknown> | null = null
      if (scope) {
        try {
          const ctx = buildScopeContext(dataDir, ref, scope, body.question)
          lines.push(ctx.block)
          if (scopeBusy(ctx.scopePath)) {
            lines.push(`（提示：该范围内的目录正在被修改，本次只给了 ${ctx.papers.length - ctx.omitted} 篇）`)
          }
          scopeInfo = {
            kind: scope.kind,
            path: ctx.scopePath,
            papers: ctx.papers.length - ctx.omitted,
            omitted: ctx.omitted,
            truncated: ctx.truncated,
            chars: ctx.totalChars,
            coverage: ctx.papers.map((p) => ({ path: p.path, coverage: p.coverage })),
          }
        } catch (err) {
          if (isManageError(err)) { libFail(res, err); return }
          // 读路径 fail-soft：范围装配失败不阻断提问，降级成「只说范围、不给内容」并如实标注
          lines.push(`【提问范围】${scope.kind === 'topic' ? scope.topic : '当前论文'}（范围内容装配失败，已在无范围内容的情况下提问）`)
          scopeInfo = { kind: scope.kind, path: scope.kind === 'topic' ? scope.topic : `${ref.topic}/${ref.name}`, degraded: true }
        }
      }
      lines.push(`用户的问题：${body.question}`)
      const prompt = lines.join('\n')
      await sc.prompt({
        sessionId,
        content: [{ type: 'text', text: prompt }],
        requestId: randomUUID(),
      }, AbortSignal.timeout(30_000))
      json(res, 200, { ok: true, sessionId, n, ...(scopeInfo ? { scope: scopeInfo } : {}) })
```

</details>

**依据 3 · 源码核查**：[src/search.ts:33-49](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/src/search.ts#L33-L49)

分块不以页边界划分

<details>
<summary>查看原文（17行）</summary>

```text
export function chunkText(text: string, size = 1500): Chunk[] {
  const paras = text.split('\n\n')
  const chunks: Chunk[] = []
  let cur = ''
  let curStart = 0
  // offset 追踪：每段在原文中的起点（paras 之间由 \n\n 连接）
  let offset = 0
  const flush = (end: number) => {
    if (cur.length > 0) chunks.push({ index: chunks.length + 1, start: curStart, end, text: cur })
    cur = ''
  }
  for (const raw of paras) {
    const p = raw.trim()
    const pStart = offset + (raw.length - raw.trimStart().length)
    offset += raw.length + 2 // +2 为 \n\n
    if (p === '') continue
    if (cur.length > 0 && cur.length + p.length > size) flush(pStart - 2)
```

</details>

**依据 4 · 源码核查**：[src/search.ts:72-102](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/src/search.ts#L72-L102)

词项得分及块起点页码

<details>
<summary>查看原文（31行）</summary>

```text
export function pageForOffset(pages: PageSpan[] | null, pos: number): number | null {
  if (!pages || pages.length === 0) return null
  let best: PageSpan | undefined
  for (const span of pages) {
    if (pos >= span.start && pos < span.end) return span.page
    if (!best || span.start <= pos) best = span
  }
  return best?.page ?? null
}

export interface SearchHit {
  chunk: Chunk
  score: number
  page: number | null
}

/** 关键词检索：按词项出现频次 × 词长打分，top-k 后按原文顺序返回（移植 pdfqa）。 */
export function searchChunks(chunks: Chunk[], pages: PageSpan[] | null, query: string, k = 5): SearchHit[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  const hits: SearchHit[] = []
  for (const chunk of chunks) {
    const lc = chunk.text.toLowerCase()
    let score = 0
    for (const t of terms) {
      score += countOccurrences(lc, t) * t.length // 长词权重高
    }
    if (score > 0) hits.push({ chunk, score, page: pageForOffset(pages, chunk.start) })
  }
  hits.sort((a, b) => b.score - a.score)
  const top = hits.slice(0, k)
  top.sort((a, b) => a.chunk.index - b.chunk.index) // 按原文顺序返回
```

</details>

**依据 5 · 源码核查**：[src/transcribe.ts:227-245](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/src/transcribe.ts#L227-L245)

转录元数据检查

<details>
<summary>查看原文（19行）</summary>

```text
  const pages = await readPages(ref)
  let producer: Producer = 'legacy'
  let backend: string | null = null
  let corrupted = false
  try {
    const raw = JSON.parse(await readFile(ref.transcriptPath, 'utf8')) as unknown
    if (isRecord(raw)) {
      const p = raw['producer']
      if (p === 'pdfjs' || p === 'mineru-local' || p === 'mineru-cloud') producer = p
      const engine = isRecord(raw['engine']) ? raw['engine'] : null
      if (engine) {
        if (typeof engine['backend'] === 'string') backend = engine['backend']
        else if (typeof engine['modelVersion'] === 'string') backend = engine['modelVersion']
      }
      const tb = isRecord(raw['text']) ? raw['text']['bytes'] : undefined
      if (typeof tb === 'number' && tb !== Buffer.byteLength(text, 'utf8')) corrupted = true
    }
  } catch { /* transcript.json 缺失/损坏 → legacy，不判损坏 */ }
  return { text, pages, producer, backend, corrupted }
```

</details>

**依据 6 · 源码核查**：[src/transcribe.ts:527-533](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/src/transcribe.ts#L527-L533)

搜索读取接口未做该校验

```text
export async function readTranscript(ref: PaperRef): Promise<{ text: string; pages: PageSpan[] | null } | null> {
  try {
    const text = await readFile(ref.txtPath, 'utf8')
    return { text, pages: await readPages(ref) }
  } catch {
    return null
  }
```

**依据 7 · 源码核查**：[reader/index.html:4837-4858](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/reader/index.html#L4837-L4858)

深链接目标缺失时选择其他论文

<details>
<summary>查看原文（22行）</summary>

```text
  const pTopic = params.get('topic'), pName = params.get('name');
  // 伴读会话里的跳转链接（[重读第 N 页](…?page=N)）经此直达目标页
  const pPage = +(params.get('page') || 0) || undefined;
  const pQ = params.get('q') || undefined;
  await loadThemeConfig();          // 深色配置（服务端唯一一份；失败自动降级到镜像）
  const lib = await api('/library');
  if (lib.topics.length === 0) {
    $('empty').style.display = 'block';
    $('empty').innerHTML = '文献库为空。<br>在左侧文献库树上传 PDF 或新建专题即可开始。';
    return;
  }
  let target = null;
  if (pTopic && pName && lib.papers.some((p) => p.topic === pTopic && p.name === pName)) target = { topic: pTopic, name: pName };
  else {
    const last = JSON.parse(localStorage.getItem('dpr.last') || 'null');
    if (last && lib.papers.some((p) => p.topic === last.topic && p.name === last.name)) target = last;
    else target = lib.papers[0];
  }
  if (target) {
    current = target;               // 范围记忆的键带 topic/name（避免跨论文串味）
    setAskScopeMode(askScopeMode());
    await openPaper(target.topic, target.name, { page: pPage, q: pQ });
```

</details>

#### 缺口

- 缺跨页、过期链接与混合缓存的独立复现。
  **影响**：无法知道误页或误文献频率，不能把范围 UI 当隔离。
  **进一步探讨**：用两个 PDF、跨页词和已改名论文测试，每条按文献、页、原句核对。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何低成本试读、恢复并退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

基本路径需匹配的 DSH Host、Node、可读 PDF 和可写入库副本。嵌入、重排和扫描处理属于可选扩展，嵌入路径会把输入文本送到所选端点。先用公开文本型 PDF，保留原件与版本。若缺页码、目标不对或有范围降级，停用自动引用，直接用 PDF 查找并从原件重新建立缓存。扫描件、未公开稿和需要严格页码的任务应先验证外部服务与实际引文。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:16-23](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/package.json#L16-L23)

Node 与 Host 入口

```text
  "engines": {
    "node": "^22.19.0 || >=24"
  },
  "main": "./dist/index.js",
  "exports": {
    ".": "./dist/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
```

**依据 2 · 源码核查**：[package.json:72-80](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/package.json#L72-L80)

PDF.js 及 DSH peer

```text
  "dependencies": {
    "@typesafe-ai/sdk": "^0.6.0",
    "pdfjs-dist": "^6.3.289",
    "undici": "^8.10.2"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/dsh-tools": ">=0.2.0-rc.2 <0.3.0-0"
  },
```

**依据 3 · 源码核查**：[src/transcribe.ts:304-320](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/src/transcribe.ts#L304-L320)

文本层提取失败条件

<details>
<summary>查看原文（17行）</summary>

```text
/** 本地提取（不落盘）。文本过少抛 ShortTextError，供上层做 MinerU 兜底。 */
async function extractLocal(pdfPath: string): Promise<Transcript> {
  let data: RawExtract
  try {
    data = await extractWithPdfjs(pdfPath)
  } catch (err) {
    if (err instanceof ScannedPdfError) {
      // 文案只描述「发生了什么」，可执行指引由上层按 MinerU 是否启用补充（见 parseAndStorePdfjs）。
      // 不再声称「视觉转录兜底尚未实现」——1.3.0 起 MinerU 就是那个兜底（验证报告 O2）。
      throw new ShortTextError('本地提取的文本过少，该 PDF 可能是扫描件（没有可用文本层）。')
    }
    throw new Error(`PDF 文本提取失败：${err instanceof Error ? err.message : String(err)}`)
  }
  if (data.text.length < 1000) {
    throw new ShortTextError(`转录结果过短(${data.text.length} 字符)，疑似失败，请重试`)
  }
  return { text: data.text, pages: data.pages, pageCount: data.pageCount, chars: data.chars, source: 'local', producer: 'pdfjs', backend: null }
```

</details>

**依据 4 · 源码核查**：[src/scope.ts:23-31](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/src/scope.ts#L23-L31)

范围正文预算

```text
export const MAX_CONTEXT_CHARS = 40_000
export const MAX_PER_DOC = 8_000
export const MAX_MANIFEST = 2_000
export const MAX_PAPERS_IN_SCOPE = 12
export const MAX_HITS_PER_PAPER = 3
/** 正文/命中装配时给「段标题 + 末尾说明行」预留的余量：保证 `block.length` 也不越 MAX_CONTEXT_CHARS。 */
const BLOCK_RESERVE = 400
/** 论文正文的来源优先级（MinerU 的版面重排质量最好） */
export const BODY_SOURCES = ['.mineru.md', '.txt'] as const
```

**依据 5 · 源码核查**：[src/embed.ts:143-156](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/src/embed.ts#L143-L156)

配置端点会接收检索输入文本

<details>
<summary>查看原文（14行）</summary>

```text
export async function requestEmbeddings(req: EmbedRequest, texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return []
  const timeoutMs = req.timeoutMs ?? EMBED_DEFAULTS.timeoutMs
  const fetchImpl = req.fetchImpl ?? fetch
  const signals: AbortSignal[] = [AbortSignal.timeout(timeoutMs)]
  if (req.signal) signals.push(req.signal)
  let res: Response
  try {
    res = await fetchImpl(embeddingsUrl(req.baseUrl), {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${req.apiKey}` },
      body: JSON.stringify({ model: req.model, input: texts, encoding_format: 'float' }),
      signal: signals.length === 1 ? signals[0]! : AbortSignal.any(signals),
    })
```

</details>

#### 缺口

- 缺大 PDF 的提取时间、缓存空间、模型或端点用量。
  **影响**：无法估算长文和多文献的总成本。
  **进一步探讨**：从公开文本 PDF 记录转录、查询、复核和错误恢复时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 固定正反例能否验证引用可回查？

**研究主题**：新假设与验证

#### 完整回答

准备两篇公开小 PDF，一篇让唯一词出现在第二页开头并与第一页短段合成一个块，另一篇含相同词但结论相反。先比较关键词结果页与实际原文，然后改名一篇，点击旧链接检查是否退到其他论文。另将专题范围限制到一篇，观察装配及模型引用。若出现错页、错文献或范围外断言无法从原文复核，则否定当前条件下自动引用可靠。

#### 证据与依据

**依据 1 · 源码核查**：[src/search.ts:89-103](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/src/search.ts#L89-L103)

关键词页码计算是反例点

<details>
<summary>查看原文（15行）</summary>

```text
export function searchChunks(chunks: Chunk[], pages: PageSpan[] | null, query: string, k = 5): SearchHit[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  const hits: SearchHit[] = []
  for (const chunk of chunks) {
    const lc = chunk.text.toLowerCase()
    let score = 0
    for (const t of terms) {
      score += countOccurrences(lc, t) * t.length // 长词权重高
    }
    if (score > 0) hits.push({ chunk, score, page: pageForOffset(pages, chunk.start) })
  }
  hits.sort((a, b) => b.score - a.score)
  const top = hits.slice(0, k)
  top.sort((a, b) => a.chunk.index - b.chunk.index) // 按原文顺序返回
  return top
```

</details>

**依据 2 · 源码核查**：[src/host.ts:1901-1924](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/src/host.ts#L1901-L1924)

范围处理的可观测分支

<details>
<summary>查看原文（24行）</summary>

```text
      // 范围块：**追加**（不传 scope 时这段完全不存在 ⇒ 既有文案逐字不变，回归项 C2）
      let scopeInfo: Record<string, unknown> | null = null
      if (scope) {
        try {
          const ctx = buildScopeContext(dataDir, ref, scope, body.question)
          lines.push(ctx.block)
          if (scopeBusy(ctx.scopePath)) {
            lines.push(`（提示：该范围内的目录正在被修改，本次只给了 ${ctx.papers.length - ctx.omitted} 篇）`)
          }
          scopeInfo = {
            kind: scope.kind,
            path: ctx.scopePath,
            papers: ctx.papers.length - ctx.omitted,
            omitted: ctx.omitted,
            truncated: ctx.truncated,
            chars: ctx.totalChars,
            coverage: ctx.papers.map((p) => ({ path: p.path, coverage: p.coverage })),
          }
        } catch (err) {
          if (isManageError(err)) { libFail(res, err); return }
          // 读路径 fail-soft：范围装配失败不阻断提问，降级成「只说范围、不给内容」并如实标注
          lines.push(`【提问范围】${scope.kind === 'topic' ? scope.topic : '当前论文'}（范围内容装配失败，已在无范围内容的情况下提问）`)
          scopeInfo = { kind: scope.kind, path: scope.kind === 'topic' ? scope.topic : `${ref.topic}/${ref.name}`, degraded: true }
        }
```

</details>

**依据 3 · 源码核查**：[reader/index.html:4848-4858](https://github.com/GGboya/dsh-paper-reader/blob/87ee32184a9ffb214f635e6838f05e05f347eb8d/reader/index.html#L4848-L4858)

陈旧目标下的文献回退

<details>
<summary>查看原文（11行）</summary>

```text
  let target = null;
  if (pTopic && pName && lib.papers.some((p) => p.topic === pTopic && p.name === pName)) target = { topic: pTopic, name: pName };
  else {
    const last = JSON.parse(localStorage.getItem('dpr.last') || 'null');
    if (last && lib.papers.some((p) => p.topic === last.topic && p.name === last.name)) target = last;
    else target = lib.papers[0];
  }
  if (target) {
    current = target;               // 范围记忆的键带 topic/name（避免跨论文串味）
    setAskScopeMode(askScopeMode());
    await openPaper(target.topic, target.name, { page: pPage, q: pQ });
```

</details>

#### 缺口

- 该对照没有运行。
  **影响**：不能量化引用准确性或定位时间。
  **进一步探讨**：先检查小型跨页样本的输出和实际阅读器目标。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
