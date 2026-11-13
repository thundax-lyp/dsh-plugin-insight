# dsh-ppt

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[f2263f5](https://github.com/STARDUSTLC666/dsh-ppt/tree/f2263f5260cf9453d1ad5d3c9a85c55ee3999c70)

<!-- BEGIN META -->
[![GitHub ★ 36](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/STARDUSTLC666/dsh-ppt) [![npm 30d 29,827](https://img.shields.io/static/v1?label=npm+30d&message=29%2C827&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ppt) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ppt)
<!-- END META -->

> **功能**：在 DSH 从大纲或结构化资料生成 HTML、可编辑 PPTX 与工程文件，并维护修订和分享。

> **亮点**：[Q01](#research-q01) 以工程快照生成浏览器和 Office 两种交付。[Q02](#research-q02) 用修订、哈希和另存限制误覆盖。

> **主要限制**：[Q02](#research-q02) 外部编辑无法合并回 JSON，逐文件提交的失败恢复也有边界。[Q03](#research-q03) 实际版式受渲染器和字体影响。[Q04](#research-q04) 分享包保留绑定摘录。

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
  - [Q01 · 从 DSH 会话制作多格式演示，能少做哪些重复工作？](#detail-section-11)
  - [Q02 · 多次编辑和外部 Office 修改时，怎样处理文件一致性与冲突？](#detail-section-12)
  - [Q03 · 预览、PPTX 实际渲染和视觉模型检查各需要什么？](#detail-section-13)
  - [Q04 · 如何试用分享交付，能否在下载前降低来源摘录误发？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在 DSH 会话中把周报、方案或答辩材料交付为可放映网页与可编辑演示。

独立 HTML 或浏览器演示与 Office 文稿各自编辑，变更后需要人工同步两份成品。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 多格式生成 | 输出 HTML、PPTX 与 JSON | 共用工程快照 |
| 版本化编辑 | 保存、核对和另存 | Office 外部改动保留在原件 |
| 实际渲染 | 检查 PPTX 页图与字体 | 需要可用渲染后端 |
| 分享导出 | 交付页面、演示和讲稿 | 已绑定的摘录可能随包交付 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容的 DSH 和 Node、Office Kit | 是 | 工作台与 PPTX 导出 | 先核版本和宿主 |
| LibreOffice Kit 与有效渲染后端 | 实际 PPTX 渲染时 | 生成 PNG 或 PDF | 改用目标软件查看原件 |
| 宿主附件及图文模型 | 模型视觉检查时 | 接收页图和上下文 | 人工检查页图 |

#### 操作流程

| 步骤 | 谁操作 | 操作与结果 | 失败处理 |
| --- | --- | --- | --- |
| 准备 | 用户 | 选用合成材料和明确输出位置 | 检查空目录 |
| 生成与编辑 | 模型工具与用户 | 查看三件套并核对工程修订 | 冲突后回读，外部编辑另存 |
| 交付 | 用户 | 选择分享包或工程包并检查内容 | 保留原件并拆分交付 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地生成与依赖 | 核 DSH、字体和 Office 兼容 | 启动耗时未测 |
| 持续 | 本地渲染、可选模型请求 | 看版式、修订和材料摘录 | 真实费用未测 |
| 退出 | 项目与成品文件 | 核对外部改动，保留原件 | 强制中断恢复未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 双格式产出 | 同一快照生成 HTML 和 PPTX | 跨软件展示效果 |
| 修订保护 | 修订、哈希、锁及另存 | 崩溃恢复和多用户场景 |
| 分包交付 | 白名单及修订前后核查 | 实际误发率及净收益 |

> **思考**：[Q02](#research-q02) 外部编辑无法合并回 JSON，逐文件提交的失败恢复也有边界。[Q03](#research-q03) 实际版式受渲染器和字体影响。[Q04](#research-q04) 分享包保留绑定摘录。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 以工程快照生成浏览器和 Office 两种交付。[Q02](#research-q02) 用修订、哈希和另存限制误覆盖。

[Q01](#research-q01) 源快照及成品哈希支撑 [Q02](#research-q02) 的版本判断。[Q03](#research-q03) 的实际渲染有独立输入和收据；[Q04](#research-q04) 按登记项目及修订下载。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 外部编辑无法合并回 JSON，逐文件提交的失败恢复也有边界。[Q03](#research-q03) 实际版式受渲染器和字体影响。[Q04](#research-q04) 分享包保留绑定摘录。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先从四页合成稿试用，按 [Q02](#research-q02) 验证外部编辑后拒绝覆盖，按 [Q03](#research-q03) 比对目标软件字体和版式。可带走独立成品。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持同源导出、工作台修订与分包。DSH 实机、跨客户端一致性、失败恢复、试用净收益和分享预览假设待验证。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、skills/dsh-ppt/scripts/deck-advanced.mjs、skills/dsh-ppt/scripts/deck-core.mjs、skills/dsh-ppt/scripts/deck-render.mjs、src/execution.ts、src/index.ts、src/visual-model.ts、src/workbench.ts、templates/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根 DSH 插件挂载、代表生成、修订落盘、实际渲染和模型请求、工作台下载。尚未执行插件、跑目标渲染器或审计所有模板与宿主权限。
- 下一步：用合成项目对比同源生成和手工同步。核对过期修订、外部 Office 修改、异常中断、跨客户端版式，以及下载包中的合成敏感标记。

**分析版本**

- **仓库**：[STARDUSTLC666/dsh-ppt](https://github.com/STARDUSTLC666/dsh-ppt)
- **版本号**：0.20.5（[固定提交 f2263f5](https://github.com/STARDUSTLC666/dsh-ppt/tree/f2263f5260cf9453d1ad5d3c9a85c55ee3999c70)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 在下载前列出各文件携带的来源摘录并允许选择移除项，检验是否减少误发和返工。

用合成项目对比同源生成和手工同步。核对过期修订、外部 Office 修改、异常中断、跨客户端版式，以及下载包中的合成敏感标记。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 14 | 4295 | 3963 | 196 | — |
| .mjs | test | 25 | 2776 | 2550 | 37 | — |
| .md | source | 32 | 1955 | — | — | 34279 |
| .js | source | 17 | 5003 | 4868 | 127 | — |
| .ts | source | 12 | 1841 | 1702 | 80 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/STARDUSTLC666/dsh-ppt/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/STARDUSTLC666/dsh-ppt/issues?q=is%3Aissue+created%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)

暂未获取：近30天关闭。

统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对 DSH 会话中的演示生成、修订和分享，判断多格式制作能否减少重复劳动，并确定实际渲染与材料披露的边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 从 DSH 会话制作多格式演示，能少做哪些重复工作？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

对于要交付可浏览和可编辑两种版本的周报、答辩或方案演示，用户可以将标题加大纲、结构化页面或模板交给模型工具。Host 校验输入后将请求交给生成器，规范化页面、嵌入资产、分配工程与页面标识，再从同一快照生成 HTML、PPTX 和带成品哈希的工程 JSON。生成成功后尝试登记到 DSH 工作台，登记失败只记警告。相比独立手写 HTML 再编辑 PowerPoint，生成链减少初次制作时的双份维护。后续在 Office 修改会触发 Q02 的边界。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:44-75](https://github.com/STARDUSTLC666/dsh-ppt/blob/f2263f5260cf9453d1ad5d3c9a85c55ee3999c70/src/index.ts#L44-L75)

挂载工作台、Skill 和工具，生成成功后登记项目。

<details>
<summary>查看原文（32行）</summary>

```text

  const resolved = resolvePptConfig(config)
  const warn = (message: string): void => { ctx.logger?.warn?.(message) }
  const disposers: Array<() => void> = []
  const workbench = typeof ctx.inject === 'function' ? new PptWorkbench() : undefined
  if (workbench) {
    installPptWorkbench(ctx, workbench)
    ctx.inject?.(['llm'], host => {
      workbench.coaching.setModel(nativeCoachingModel(host.llm))
      host.effect?.(() => () => workbench.coaching.setModel())
    })
    ctx.inject?.(['llm', 'attachments'], host => {
      workbench.visual.setModel(nativeVisualModel(host.llm, host.attachments))
      host.effect?.(() => () => workbench.visual.setModel())
    })
    disposers.push(() => { workbench.coaching.dispose(); workbench.visual.dispose() })
  }

  // 技能注册：单个技能文件缺失只告警，不弄崩宿主启动。
  try {
    disposers.push(registerPptSkill(ctx))
  } catch (error) {
    warn('[dsh-ppt] 技能加载失败：' + (error instanceof Error ? error.message : String(error)))
  }

  for (const definition of buildPptTools(resolved)) {
    const execute = definition.execute
    disposers.push(ctx.tools.register({ ...definition, async execute(args, exec) {
      const result = await execute(args, exec)
      try { await workbench?.remember(result, args, exec) } catch (error) { warn('[dsh-ppt] 项目索引未更新：' + (error instanceof Error ? error.message : String(error))) }
      return result
    } }))
```

</details>

**依据 2 · 源码核查**：[src/execution.ts:50-78](https://github.com/STARDUSTLC666/dsh-ppt/blob/f2263f5260cf9453d1ad5d3c9a85c55ee3999c70/src/execution.ts#L50-L78)

校验生成参数并把输出位置和取消信号交给引擎。

<details>
<summary>查看原文（29行）</summary>

```text
    async create(rawArgs: unknown, exec?: PptExecution) {
      exec?.signal?.throwIfAborted()
      const args = asRecord(rawArgs) as unknown as PptCreateArgs
      if (typeof args.title !== 'string' || args.title.trim() === '') throw new Error('dsh-ppt：title 不能为空')
      const hasContent = typeof args.content === 'string' && args.content.trim() !== ''
      const hasSlides = Array.isArray(args.slides) && args.slides.length > 0
      if (!hasContent && !hasSlides && !args.template) throw new Error('dsh-ppt：content 不能为空（或用 slides / template 传结构化幻灯片）')
      const engine = await loadEngine()
      // Check cancellation after loading and before artifact commit inside the async engine.
      exec?.signal?.throwIfAborted()
      const cwd = exec?.agent?.session.header.cwd ?? process.cwd()
      const outputDir = typeof args.outputDir === 'string' && args.outputDir.trim() !== '' ? args.outputDir.trim() : config.outputDir
      return (engine.buildDeckAsync ?? engine.buildDeck)({
        title: args.title.trim(),
        content: typeof args.content === 'string' ? args.content : '',
        slides: hasSlides ? args.slides : undefined,
        theme: typeof args.theme === 'string' && args.theme.trim() !== '' ? args.theme.trim() : (config.defaultTheme || undefined),
        lang: typeof args.lang === 'string' && args.lang.trim() !== '' ? args.lang.trim() : (config.defaultLang || undefined),
        motion: args.motion,
        outputDir: resolve(cwd, outputDir || '.'),
        fileName: typeof args.fileName === 'string' && args.fileName.trim() !== '' ? args.fileName.trim() : undefined,
        overwrite: args.overwrite === true,
        maxSlides: config.maxSlides,
        template: args.template,
        brand: args.brand,
        dataModel: args.dataModel,
        cwd,
        signal: exec?.signal,
      })
```

</details>

**依据 3 · 源码核查**：[skills/dsh-ppt/scripts/deck-advanced.mjs:313-329](https://github.com/STARDUSTLC666/dsh-ppt/blob/f2263f5260cf9453d1ad5d3c9a85c55ee3999c70/skills/dsh-ppt/scripts/deck-advanced.mjs#L313-L329)

校验快照、生成 PPTX、从同一快照渲染 HTML 并写成品哈希。

<details>
<summary>查看原文（17行）</summary>

```text
async function generate(manifest, signal) {
  abort(signal)
  validateSnapshot(manifest, manifest.assets)
  collectAssets(manifest)
  manifest.slideCount = manifest.slides.length
  manifest.quality = checkManifest(manifest)
  if (manifest.quality.errorCount) fail(manifest.quality.issues.filter(i => i.severity === 'error').map(i => `第 ${i.slide} 页：${i.message}`).join('；'))
  const theme = brandedTheme(manifest), language = resolveLanguage(manifest.language)
  const json = documentBytes(manifest)
  const pptx = await exportPptx(manifest, theme, language, signal)
  abort(signal)
  return { json, pptx, manifest, theme, language }
}
function commit(paths, data) {
  const html = renderHtml(data.manifest, data.theme, data.language, paths)
  data.manifest.artifacts = { html: hash(html), pptx: hash(data.pptx) }
  commitDeckArtifacts([{ path: paths.json, data: documentBytes(data.manifest), encoding: 'utf8' }, { path: paths.html, data: html, encoding: 'utf8' }, { path: paths.pptx, data: data.pptx }])
```

</details>

**依据 4 · 源码核查**：[skills/dsh-ppt/scripts/deck-advanced.mjs:359-384](https://github.com/STARDUSTLC666/dsh-ppt/blob/f2263f5260cf9453d1ad5d3c9a85c55ee3999c70/skills/dsh-ppt/scripts/deck-advanced.mjs#L359-L384)

模板及结构化数据规范化、稳定的工程和页面身份、文件冲突处理。

<details>
<summary>查看原文（26行）</summary>

```text
export async function buildDeckAsync(options = {}) {
  abort(options.signal)
  validateRawSlides(options.slides)
  const scenario = options.template ? scenarios.find(s => s.id === options.template) : undefined
  if (options.template && !scenario) fail('未知 template，请使用 weekly / defense / project / pitch')
  const input = { ...options, theme: options.theme || scenario?.theme,
    ...(!options.content?.trim() && !options.slides?.length && scenario ? { slides: templateSlides(scenario, String(options.title ?? ''), options.lang) } : {}) }
  const cwd = resolve(options.cwd || '.')
  const dataModel = options.dataModel ? normalizeDataModel(options.dataModel, { cwd, allowFiles:true }) : undefined
  if (dataModel && (!Array.isArray(input.slides) || !input.slides.length)) fail('数据绑定需使用结构化 slides / Data binding requires structured slides')
  const prepared = dataModel ? prepareDataSlides(input.slides, dataModel, normalizeSlides, resolveLanguage(input.lang).id) : undefined
  const normalized = normalizeBuildOptions({ ...input, ...(prepared ? { slides:prepared } : {}) })
  if(prepared) normalized.deck.slides = prepared
  const assets = {}
  const brand = normalizeBrand(options.brand, assets, cwd)
  const manifest = { version: DECK_VERSION, schemaVersion: 1, deckId: randomUUID(), revision: 0,
    title: normalized.title, theme: normalized.theme.id, language: normalized.language.id, motion: normalized.motion,
    ...(scenario ? { template: scenario.id } : {}), ...(brand ? { brand } : {}), ...(dataModel ? {dataModel} : {}), assets, history: [],
    slides: embedSlides(normalized.deck.slides, assets, cwd).map(s => ({ ...s, id: randomUUID() })) }
  const data = await generate(manifest, options.signal)
  mkdirSync(normalized.outputDir, { recursive: true })
  // Resolve collisions after asynchronous rendering; an earlier call may have committed meanwhile.
  const file = resolveDeckFileName(normalized.outputDir, normalized.fileName, normalized.overwrite)
  const paths = pathsFor(resolve(normalized.outputDir, file + '.json'))
  withLock(paths.json, () => { abort(options.signal); commit(paths, data) })
  return result(manifest, paths)
```

</details>

#### 缺口

- 真实宿主能否顺利完成模型到工作台的交接，及其耗时尚未测量。
  **影响**：影响实际采用及效果判断。
  **进一步探讨**：用四页合成简报分别走插件与两份手工制作，比较创建步骤、修改次数及三份输出的内容。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 多次编辑和外部 Office 修改时，怎样处理文件一致性与冲突？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

修改可带期望修订号。保存时先查 HTML/PPTX 与 JSON 中的哈希，渲染完再持锁核对工程指纹及成品哈希后提交。若外部成品改过或缺失，同名写回会拒绝，另存从 JSON 生成新副本并保留原文件，Office 手工编辑不会进入副本。三份文件先各写临时文件、再逐个改名，捕获改名异常时尝试恢复旧内容。逐个提交与尽力回滚留有异常退出和回滚自身失败的窗口，外部编辑器也不参与该锁。工具执行处按工作目录解析输出路径，应明确检查落盘目录。

#### 证据与依据

**依据 1 · 源码核查**：[skills/dsh-ppt/scripts/deck-advanced.mjs:303-312](https://github.com/STARDUSTLC666/dsh-ppt/blob/f2263f5260cf9453d1ad5d3c9a85c55ee3999c70/skills/dsh-ppt/scripts/deck-advanced.mjs#L303-L312)

创建排他锁文件并在正常返回或抛错时释放。

<details>
<summary>查看原文（10行）</summary>

```text
function pathsFor(jsonPath) {
  const base = jsonPath.slice(0, -5)
  return { html: base + '.html', pptx: base + '.pptx', json: jsonPath }
}
function withLock(path, commit) {
  const lock = path + '.dsh-ppt-lock'
  let fd
  try { fd = openSync(lock, 'wx') } catch { fail('该工程正在被另一次修改，请稍后重试：' + path) }
  try { return commit() } finally { closeSync(fd); rmSync(lock, { force: true }) }
}
```

</details>

**依据 2 · 源码核查**：[skills/dsh-ppt/scripts/deck-advanced.mjs:351-356](https://github.com/STARDUSTLC666/dsh-ppt/blob/f2263f5260cf9453d1ad5d3c9a85c55ee3999c70/skills/dsh-ppt/scripts/deck-advanced.mjs#L351-L356)

检查外部成品哈希及旧工程兼容处理。

```text
function artifactProblem(manifest, paths) {
  if (!manifest.artifacts) return '旧工程没有成品校验记录，无法确认外部修改；请另存副本，保留原文件。'
  for (const kind of ['html', 'pptx']) {
    try { if (hash(readFileSync(paths[kind])) === manifest.artifacts[kind]) continue } catch {}
    return kind.toUpperCase() + ' 已在外部修改或缺失，不会覆盖；请另存副本。副本从 JSON 生成，不导入 Office 手工修改。'
  }
```

**依据 3 · 源码核查**：[skills/dsh-ppt/scripts/deck-advanced.mjs:422-448](https://github.com/STARDUSTLC666/dsh-ppt/blob/f2263f5260cf9453d1ad5d3c9a85c55ee3999c70/skills/dsh-ppt/scripts/deck-advanced.mjs#L422-L448)

修订、指纹、持锁二次核查与另存分支。

<details>
<summary>查看原文（27行）</summary>

```text
function expected(manifest, revision) {
  if (revision !== undefined && (!Number.isInteger(revision) || revision !== manifest.revision)) fail(`修订号冲突：当前 revision=${manifest.revision}，请重新读取工程后修改`)
}
async function saveRevision(state, next, signal, saveAs = false, preserveUndo = false) {
  if (!saveAs) { const problem = artifactProblem(state.manifest, pathsFor(state.path)); if (problem) fail(problem) }
  next.version = DECK_VERSION; next.schemaVersion = 1; next.revision = state.manifest.revision + 1
  if (saveAs) { next.deckId = randomUUID(); next.revision = 0; next.history = preserveUndo ? [snapshot(state.manifest)] : [] }
  const data = await generate(next, signal)
  let paths = pathsFor(state.path)
  withLock(state.path, () => {
    abort(signal)
    if (hash(readFileSync(state.path)) !== state.fingerprint) fail('工程已被其他操作修改，请重新读取后重试')
    if (saveAs) {
      const file = resolveDeckFileName(dirname(state.path), basename(state.path, '.json') + '-dsh', false)
      paths = pathsFor(resolve(dirname(state.path), file + '.json'))
    } else {
      const problem = artifactProblem(state.manifest, paths); if (problem) fail(problem)
    }
    commit(paths, data)
  })
  return result(next, paths)
}

export async function editDeck(options = {}) {
  abort(options.signal)
  const state = readDocument(options.deckPath, options.cwd), current = state.manifest
  expected(current, options.expectedRevision)
```

</details>

**依据 4 · 源码核查**：[skills/dsh-ppt/scripts/deck-core.mjs:907-957](https://github.com/STARDUSTLC666/dsh-ppt/blob/f2263f5260cf9453d1ad5d3c9a85c55ee3999c70/skills/dsh-ppt/scripts/deck-core.mjs#L907-L957)

临时写入、逐个提交、清理及尽力恢复。

<details>
<summary>查看原文（51行）</summary>

```text
export function commitDeckArtifacts(artifacts) {
  const stamp = process.pid.toString(36) + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
  const items = artifacts.map((item, index) => ({ ...item, tempPath: item.path + '.' + stamp + '-' + index + '.tmp' }))
  const removeTemp = (item) => {
    try {
      rmSync(item.tempPath, { force: true })
    } catch {}
  }

  // 阶段 0：记下已有产物内容用于回滚；读不出来（如被同名目录占用）先报错，不碰任何文件。
  const previous = new Map()
  for (const item of items) {
    if (!existsSync(item.path)) continue
    try {
      previous.set(item.path, readFileSync(item.path))
    } catch (error) {
      throw new Error('dsh-ppt：三件套写入失败（' + item.path + ' 已存在但无法读取），原文件未改动：' + error.message)
    }
  }

  // 阶段 1：全部写临时文件；这一步失败时目标文件尚未被改动。
  let written = 0
  try {
    for (const item of items) {
      writeFileSync(item.tempPath, item.data, item.encoding)
      written += 1
    }
  } catch (error) {
    for (const item of items.slice(0, written + 1)) removeTemp(item)
    throw new Error('dsh-ppt：写入临时文件失败（' + items[written].path + '），原三件套未改动：' + error.message)
  }

  // 阶段 2：逐个 rename 提交；中途失败则把已提交的目标回滚成旧内容。
  const committed = []
  try {
    for (const item of items) {
      renameSync(item.tempPath, item.path)
      committed.push(item)
    }
  } catch (error) {
    const failedPath = items[committed.length].path
    for (const item of items) removeTemp(item)
    for (const item of committed) {
      try {
        const previousData = previous.get(item.path)
        if (previousData === undefined) rmSync(item.path, { force: true })
        else writeFileSync(item.path, previousData)
      } catch {}
    }
    throw new Error('dsh-ppt：提交三件套失败（' + failedPath + '），已回滚为原文件：' + error.message)
  }
```

</details>

**依据 5 · 源码核查**：[src/execution.ts:50-78](https://github.com/STARDUSTLC666/dsh-ppt/blob/f2263f5260cf9453d1ad5d3c9a85c55ee3999c70/src/execution.ts#L50-L78)

输出目录按传入值与工作目录解析。

<details>
<summary>查看原文（29行）</summary>

```text
    async create(rawArgs: unknown, exec?: PptExecution) {
      exec?.signal?.throwIfAborted()
      const args = asRecord(rawArgs) as unknown as PptCreateArgs
      if (typeof args.title !== 'string' || args.title.trim() === '') throw new Error('dsh-ppt：title 不能为空')
      const hasContent = typeof args.content === 'string' && args.content.trim() !== ''
      const hasSlides = Array.isArray(args.slides) && args.slides.length > 0
      if (!hasContent && !hasSlides && !args.template) throw new Error('dsh-ppt：content 不能为空（或用 slides / template 传结构化幻灯片）')
      const engine = await loadEngine()
      // Check cancellation after loading and before artifact commit inside the async engine.
      exec?.signal?.throwIfAborted()
      const cwd = exec?.agent?.session.header.cwd ?? process.cwd()
      const outputDir = typeof args.outputDir === 'string' && args.outputDir.trim() !== '' ? args.outputDir.trim() : config.outputDir
      return (engine.buildDeckAsync ?? engine.buildDeck)({
        title: args.title.trim(),
        content: typeof args.content === 'string' ? args.content : '',
        slides: hasSlides ? args.slides : undefined,
        theme: typeof args.theme === 'string' && args.theme.trim() !== '' ? args.theme.trim() : (config.defaultTheme || undefined),
        lang: typeof args.lang === 'string' && args.lang.trim() !== '' ? args.lang.trim() : (config.defaultLang || undefined),
        motion: args.motion,
        outputDir: resolve(cwd, outputDir || '.'),
        fileName: typeof args.fileName === 'string' && args.fileName.trim() !== '' ? args.fileName.trim() : undefined,
        overwrite: args.overwrite === true,
        maxSlides: config.maxSlides,
        template: args.template,
        brand: args.brand,
        dataModel: args.dataModel,
        cwd,
        signal: exec?.signal,
      })
```

</details>

#### 缺口

- 外部编辑、强制退出或磁盘错误下实际遗留状态未知。
  **影响**：影响实际采用及效果判断。
  **进一步探讨**：在一次性目录分别制造过期修订、外部 PPTX 修改、提交中断，逐项对照文件哈希与锁，并保留原始 PPTX。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 预览、PPTX 实际渲染和视觉模型检查各需要什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

固定清单给出 DSH 和 Node 版本、Office Kit 和可选 LibreOffice Kit。HTML 是同源浏览器成品。实际 PPTX 渲染读入独立快照，检查引擎版本和后端，逐页校验输入哈希、页码和 PNG 尺寸，记录缺失字体，并在发布结果前重查源文件。视觉检查另需宿主模型与附件服务、能接收文本和图片的模型，每批最多两张且单图最多 4 MiB，页图和文本随请求交给配置的服务。模型限流、截断或认证失败会报错。LibreOffice 页图及模型建议仍需对照目标 PowerPoint/WPS 的字体、版式和实际文件。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:6-20](https://github.com/STARDUSTLC666/dsh-ppt/blob/f2263f5260cf9453d1ad5d3c9a85c55ee3999c70/package.json#L6-L20)

固定包版本、入口与 Node/DSH 版本。

<details>
<summary>查看原文（15行）</summary>

```text
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./skills/*": "./skills/*",
    "./deck-core": "./skills/dsh-ppt/scripts/deck-core.mjs",
    "./deck-advanced": "./skills/dsh-ppt/scripts/deck-advanced.mjs",
    "./deck-render": "./skills/dsh-ppt/scripts/deck-render.mjs",
    "./client": "./lib/client.js",
    "./build-deck": "./skills/dsh-ppt/scripts/build-deck.mjs",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
```

</details>

**依据 2 · 源码核查**：[package.json:33-51](https://github.com/STARDUSTLC666/dsh-ppt/blob/f2263f5260cf9453d1ad5d3c9a85c55ee3999c70/package.json#L33-L51)

生成和可选渲染组件及发布文件。

<details>
<summary>查看原文（19行）</summary>

```text
  "scripts": {
    "build": "tsc -p tsconfig.json && node scripts/build-client.mjs && node scripts/build-updates.mjs",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "npm run build && node --test \"test/*.test.mjs\"",
    "test:core": "node --test \"test/*.test.mjs\"",
    "smoke:cli": "node skills/dsh-ppt/scripts/build-deck.mjs --title \"DSH PPT Smoke\" --content @smoke/sample-deck.md --theme data --lang zh --out .smoke-deck"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-sidebar"
      ]
    }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:44-64](https://github.com/STARDUSTLC666/dsh-ppt/blob/f2263f5260cf9453d1ad5d3c9a85c55ee3999c70/src/index.ts#L44-L64)

按宿主模型与附件能力接入视觉检查。

<details>
<summary>查看原文（21行）</summary>

```text

  const resolved = resolvePptConfig(config)
  const warn = (message: string): void => { ctx.logger?.warn?.(message) }
  const disposers: Array<() => void> = []
  const workbench = typeof ctx.inject === 'function' ? new PptWorkbench() : undefined
  if (workbench) {
    installPptWorkbench(ctx, workbench)
    ctx.inject?.(['llm'], host => {
      workbench.coaching.setModel(nativeCoachingModel(host.llm))
      host.effect?.(() => () => workbench.coaching.setModel())
    })
    ctx.inject?.(['llm', 'attachments'], host => {
      workbench.visual.setModel(nativeVisualModel(host.llm, host.attachments))
      host.effect?.(() => () => workbench.visual.setModel())
    })
    disposers.push(() => { workbench.coaching.dispose(); workbench.visual.dispose() })
  }

  // 技能注册：单个技能文件缺失只告警，不弄崩宿主启动。
  try {
    disposers.push(registerPptSkill(ctx))
```

</details>

**依据 4 · 源码核查**：[skills/dsh-ppt/scripts/deck-render.mjs:154-224](https://github.com/STARDUSTLC666/dsh-ppt/blob/f2263f5260cf9453d1ad5d3c9a85c55ee3999c70/skills/dsh-ppt/scripts/deck-render.mjs#L154-L224)

检查可用引擎、输入快照、逐页结果、字体记录及提交前源哈希。

<details>
<summary>查看原文（71行）</summary>

```text
  const format = options.format ?? 'png'
  if (!['png', 'pdf', 'both'].includes(format)) fail('format 需为 png / pdf / both')
  const width = integer(options.width, 1440, 320, 3840, 'width')
  const timeoutMs = integer(options.timeoutMs, 120000, 1000, 300000, 'timeoutMs')
  const base = options.outputDir === undefined ? join(dirname(pptxPath), `${basename(pptxPath, extname(pptxPath))}-render`) : absolute(options.outputDir, 'outputDir')
  let kit
  try { kit = await loadKit() } catch (error) { abort(options.signal); if (missingDependency(error)) return unavailable(error); throw error }
  abort(options.signal)
  if (kit.ENGINE_VERSION !== RENDERER_VERSION || typeof kit.createConverter !== 'function') return unavailable(new Error(`需要 ${RENDERER_PACKAGE}@${RENDERER_VERSION}，当前模块版本为 ${String(kit.ENGINE_VERSION ?? '未知')}`))
  const input = readBounded(pptxPath, INPUT_LIMIT, 'PPTX'), sourceSha256 = sha256(input), shape = geometry(input, width)
  let converter
  try { converter = await kit.createConverter({ timeoutMs, maxInputBytes: INPUT_LIMIT, maxOutputBytes: OUTPUT_LIMIT, maxArchiveEntries: 20000, maxUncompressedBytes: 512 * 1024 * 1024, fontMetadataCacheDirectory: false }) }
  catch (error) { abort(options.signal); if (missingDependency(error)) return unavailable(error); throw error }
  let root, staging, committed = false
  const deadline = new AbortController()
  const timer = setTimeout(() => deadline.abort(Object.assign(new Error(`PPTX 渲染超过 ${timeoutMs}ms`), { code: 'timeout' })), timeoutMs)
  timer.unref()
  const operationSignal = options.signal ? AbortSignal.any([options.signal, deadline.signal]) : deadline.signal
  try {
    abort(operationSignal)
    root = reserveDirectory(base)
    staging = join(root, `.partial-${randomUUID()}`)
    mkdirSync(staging)
    const snapshot = join(staging, 'source.pptx')
    writeFileSync(snapshot, input, { flag: 'wx' })
    const destination = join(root, 'artifacts'), budget = { bytes: 0 }, fonts = []
    const receipt = { schemaVersion: 1, producer: 'dsh-ppt-render', status: 'rendered', visual: 'not-verified', createdAt: new Date().toISOString(),
      renderer: { package: RENDERER_PACKAGE, version: RENDERER_VERSION, backend: converter.backend },
      source: { sha256: sourceSha256, byteLength: input.length }, format, slideCount: shape.slideCount, missingFonts: [], pngs: [] }
    if (!['native', 'wasm'].includes(converter.backend)) fail('引擎未返回有效 backend')
    if (format !== 'pdf') {
      const images = await converter.renderImages({ inputPath: snapshot, outputDir: join(staging, 'pages'), pages: 'all', dpi: shape.dpi, maxPages: PAGE_LIMIT, maxPixels: 16777216, maxDimension: 8192 }, operationSignal)
      abort(operationSignal)
      if (images.sourceSha256 !== sourceSha256 || !Number.isSafeInteger(images.pageCount) || images.pageCount < 1 || images.pageCount > PAGE_LIMIT || images.images?.length !== images.pageCount) fail('引擎未返回完整且匹配输入的逐页图片')
      receipt.slideCount = images.pageCount
      fonts.push(images.missingFonts ?? [])
      const seen = new Set()
      for (const item of images.images) {
        const { record, bytes } = fileRecord(staging, item.path, budget)
        if (!Number.isSafeInteger(item.page) || item.page < 1 || item.page > images.pageCount || seen.has(item.page)) fail('引擎返回重复或无效页码')
        seen.add(item.page)
        if (bytes.length < 24 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE) || bytes.readUInt32BE(16) !== item.width || bytes.readUInt32BE(20) !== item.height || item.width * item.height > 16777216) fail('引擎PNG格式或尺寸不匹配')
        receipt.pngs.push({ page: item.page, ...record, width: item.width, height: item.height })
      }
      receipt.pngs.sort((a, b) => a.page - b.page)
      const manifest = { ...images, inputPath: pptxPath, images: images.images.map(item => ({ ...item, path: join(destination, relativeFile(staging, item.path)) })) }
      const manifestPath = join(staging, 'pages', 'manifest.json')
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
      receipt.manifest = fileRecord(staging, manifestPath, budget).record
    }
    if (format !== 'png') {
      const pdfPath = join(staging, 'document.pdf'), exported = await converter.convert({ inputPath: snapshot, outputPath: pdfPath }, operationSignal)
      abort(operationSignal)
      const { record, bytes } = fileRecord(staging, pdfPath, budget)
      if (!bytes.subarray(0, 5).equals(Buffer.from('%PDF-'))) fail('引擎未生成有效PDF')
      receipt.pdf = record
      fonts.push(exported.missingFonts ?? [])
    }
    receipt.missingFonts = fontNames(fonts)
    abort(operationSignal)
    unlinkSync(snapshot)
    writeFileSync(join(staging, 'render-receipt.json'), JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' })
    // Await native cleanup before publishing the output directory.
    await converter.dispose()
    converter = undefined
    abort(operationSignal)
    if (sha256(readBounded(pptxPath, INPUT_LIMIT, 'PPTX')) !== sourceSha256) fail('PPTX 在渲染期间已修改，请重新渲染', 'source-changed')
    if (existsSync(destination)) fail('本次渲染提交目录发生冲突')
    renameSync(staging, destination)
    staging = undefined
    committed = true
```

</details>

**依据 5 · 源码核查**：[src/visual-model.ts:31-60](https://github.com/STARDUSTLC666/dsh-ppt/blob/f2263f5260cf9453d1ad5d3c9a85c55ee3999c70/src/visual-model.ts#L31-L60)

限制输入与输出、向配置的模型路由提交页图和文本并处理失败。

<details>
<summary>查看原文（30行）</summary>

```text
    async inspect(route, system, input, images, signal) {
      if (!images.length || images.length > 2 || images.some(i => i.data.byteLength > 4 * 1024 * 1024)) throw new Error('每次视觉检查需 1–2 张、每张不超过 4 MiB / Image request limit')
      if (!llm.listProviders().some((p: any) => p.id === route.provider)) throw new Error('模型服务已停用 / Model provider is unavailable')
      const active = AbortSignal.any([signal, AbortSignal.timeout(120_000)])
      let stream: AsyncIterator<any> | undefined
      try {
        const info: any = await abortable(llm.resolveModelInfo(route.provider, route.model, active), active)
        const prepared: any = await abortable(llm.prepareCall({ ...route, maxTokens: 6000,
          ...(info?.reasoning?.efforts?.some((v: any) => v.id === 'off') ? { reasoningEffort: 'off' } : {}) }, active), active)
        if (!prepared.inputModalities?.includes('image') || !prepared.inputModalities?.includes('text')) throw new VisualCallError('所选模型不能读取图片，请选择视觉模型 / Choose a model with image input')
        const refs: any = await abortable(attachments.saveImages(images.map(i => ({ data: i.data, mediaType: 'image/png', name: i.name }))), active)
        if (!Array.isArray(refs) || refs.length !== images.length) throw new VisualCallError('图片存储未完成 / Image admission failed')
        active.throwIfAborted()
        stream = prepared.stream({ ...prepared.config, system, tools: [], signal: active,
          messages: [{ role: 'user', content: [{ type: 'text', text: input }, ...refs.map(attachment => ({ type: 'image', attachment }))] }],
        })[Symbol.asyncIterator]()
        const blocks = new Map<number,string>(); let complete = false
        for (;;) {
          const part: any = await abortable(stream!.next(), active)
          if (part.done) break
          const chunk = part.value
          if (chunk.type === 'tool-call-delta' || chunk.type === 'block-end' && chunk.block?.type === 'tool-call') throw new VisualCallError('视觉检查不允许工具调用 / Unexpected tool call')
          if (chunk.type === 'text-delta') blocks.set(chunk.index, (blocks.get(chunk.index) || '') + String(chunk.text || ''))
          if (chunk.type === 'block-end' && chunk.block?.type === 'text') blocks.set(chunk.index, String(chunk.block.text || ''))
          if ([...blocks.values()].reduce((n,t) => n + t.length, 0) > 30_000) throw new VisualCallError('视觉结果过长 / Visual output limit')
          if (chunk.type === 'finish') {
            if (chunk.reason?.kind === 'max-tokens') throw new VisualCallError('视觉模型达到输出上限，未采纳截断结果；请缩小检查范围或选择更快的模型 / Vision output limit reached; truncated results were not adopted. Review fewer slides or choose a faster model')
            if (chunk.reason?.failure?.code === 'AUTH') throw new VisualCallError('视觉模型认证失败，请检查 DSH 中的凭据 / Vision model authentication failed; check the DSH credential')
            if (chunk.reason?.failure?.code === 'RATE_LIMIT') throw new VisualCallError('视觉模型服务限流，未自动重试 / Vision model rate limited; no automatic retry')
            if (chunk.reason?.kind !== 'stop') throw new VisualCallError('视觉模型未完整返回结果，未自动重试；请检查模型服务 / Vision model did not complete; no automatic retry. Check the model service')
```

</details>

#### 缺口

- 目标设备的字体和视觉一致性、调用费用、模型数据留存与延迟未测。
  **影响**：影响实际采用及效果判断。
  **进一步探讨**：用合成页先独立打开 HTML 和 PPTX，记录渲染后端及缺失字体，再由用户选择是否开启视觉模型并记录服务和用量。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何试用分享交付，能否在下载前降低来源摘录误发？

**研究主题**：新假设与验证、采用判断、效果与总成本

#### 完整回答

先用可丢弃项目和四页合成材料，对照独立制作及人工修改，确认外部编辑后的处理与目标客户端版式。下载有类型白名单、修订核对及文件体积上限。分享包包含 HTML、PPTX 和逐页讲稿，仍带已绑定来源摘录和用户内容。工程包另带 JSON，可能含完整导入材料。给客户前检查实际 HTML、PPTX 备注和讲稿。可在下载前列出各文件暴露的来源摘录并让用户确认移除项，比较误发数、审批时间及返工次数。当前观察到下载说明和格式分包，未验证该界面假设。

#### 证据与依据

**依据 1 · 源码核查**：[src/workbench.ts:256-276](https://github.com/STARDUSTLC666/dsh-ppt/blob/f2263f5260cf9453d1ad5d3c9a85c55ee3999c70/src/workbench.ts#L256-L276)

下载类型白名单与修订、讲稿的处理。

<details>
<summary>查看原文（21行）</summary>

```text
  async fetchDownload(request: Request): Promise<Response> {
    if (request.method !== 'GET') return fail(405, '请使用 GET')
    const denied = originVerdict(request)
    if (denied) return denied
    try {
      const params = new URL(request.url).searchParams, kind = params.get('kind')
      if (!['html', 'pptx', 'json', 'bundle', 'share', 'notes', 'coaching', 'data', 'visual'].includes(String(kind))) return fail(400, '不支持此文件类型')
      const { entry, manifest, files, engine } = await this.project(params.get('id'))
      if (String(manifest.revision) !== params.get('revision')) return fail(409, '项目已被修改，请重新打开后下载')
      request.signal.throwIfAborted()
      let name: string, bytes: Uint8Array
      if(kind === 'visual') {
        bytes = strToU8(this.visual.markdown({ id: entry.id, path: entry.path, manifest, engine }, params.get('run'))); name = basename(entry.path,'.json') + '-visual-review.md'
      } else if(kind === 'data') {
        bytes=strToU8(engine.dataReport(manifest));name=basename(entry.path,'.json')+'-data-lineage.md'
      } else if (kind === 'coaching') {
        bytes = strToU8(this.coaching.markdown({ id: entry.id, manifest }, params.get('run')))
        name = basename(entry.path, '.json') + '-rehearsal.md'
      } else if (kind === 'notes') {
        bytes = strToU8(speakerNotes({...manifest,slides:manifest.slides.map((slide:any)=>({...slide,notes:engine.dataNotes(manifest,slide)}))}))
        name = basename(entry.path, '.json') + '-speaker-notes.md'
```

</details>

**依据 2 · 源码核查**：[src/workbench.ts:277-305](https://github.com/STARDUSTLC666/dsh-ppt/blob/f2263f5260cf9453d1ad5d3c9a85c55ee3999c70/src/workbench.ts#L277-L305)

分享包和工程包、体积限制、已绑定内容与修订复查。

<details>
<summary>查看原文（29行）</summary>

```text
      } else if (kind === 'bundle' || kind === 'share') {
        const entries: Record<string, Uint8Array> = {}
        let total = 0
        const selected = kind === 'share' ? [files.html, files.pptx] : Object.values(files)
        const add = (name: string, content: Uint8Array) => { total += content.byteLength; if (total > BUNDLE_LIMIT) return false; entries[name] = content; return true }
        for (const path of selected) {
          if (!existsSync(path)) return fail(400, '成品文件不完整，请先保存一次再下载成品包')
          const content = ordinaryFile(path), exported = kind === 'share' && path === files.html ? shareHtml(content) : content
          if (!add(basename(path), exported)) return fail(413, '成品包超过 128 MiB，请分别下载文件')
        }
        // An allowlist of registered sibling files; never walk project directories.
        if (kind === 'share') {
          const notes = speakerNotes({...manifest,slides:manifest.slides.map((slide:any)=>({...slide,notes:engine.dataNotes(manifest,slide)}))})
          if (!add(basename(entry.path, '.json') + '-speaker-notes.md', strToU8(notes))) return fail(413, '成品包超过 128 MiB，请分别下载文件')
        }
        const details = kind === 'share'
          ? '演示文稿分享包 / Presentation share bundle\n\nPPTX: 在 PowerPoint / WPS 中打开。 / Open in PowerPoint or WPS.\nHTML: 解压后用浏览器离线放映。 / Extract and open in a browser for offline playback.\nMarkdown: 当前修订的逐页讲稿。 / Speaker notes for this revision.\n\n此包不含 JSON 工程或完整导入材料。HTML、PPTX 备注和讲稿保留已绑定的来源摘录及用户填写内容。\nThe project JSON and complete imported materials are not included. HTML, PPTX notes and speaker notes retain bound source excerpts and authored content.\n'
          : '演示文稿工程包 / Presentation project bundle\n\nPPTX: 在 PowerPoint / WPS 中编辑。 / Edit in PowerPoint or WPS.\nHTML: 解压后用浏览器打开，支持离线放映。 / Extract and open in a browser for offline playback.\nJSON: 保留以便继续在 DSH 中编辑；其中可能包含完整导入材料。 / Keep for future DSH edits; this project may contain complete imported materials.\n'
        if (!add('README.txt', strToU8(details + '\n修订 / Revision: ' + manifest.revision + '\n'))) return fail(413, '成品包超过 128 MiB，请分别下载文件')
        // PPTX and embedded images are already compressed; store to avoid a large
        // synchronous recompression on the host's event loop.
        bytes = zipSync(entries, { level: 0 })
        name = basename(entry.path, '.json') + (kind === 'share' ? '-share.zip' : '-delivery.zip')
      } else {
        const path = files[kind as keyof typeof files]
        bytes = ordinaryFile(path); name = basename(path)
      }
      request.signal.throwIfAborted()
      if ((await this.project(entry.id)).manifest.revision !== manifest.revision) return fail(409, '项目已被修改，请重新打开后下载')
```

</details>

**依据 3 · 源码核查**：[src/workbench.ts:314-337](https://github.com/STARDUSTLC666/dsh-ppt/blob/f2263f5260cf9453d1ad5d3c9a85c55ee3999c70/src/workbench.ts#L314-L337)

Host 路由注册、请求方法、动作头、来源判定与请求上限。

<details>
<summary>查看原文（24行）</summary>

```text
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') return fail(405, '请使用 POST')
    if (request.headers.get('x-dsh-ppt-action') !== '1' || request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return fail(403, '请从演示文稿面板操作')
    const denied = originVerdict(request)
    if (denied) return denied
    try {
      const reader = request.body?.getReader()
      if (!reader) return fail(400, '缺少请求内容')
      let size = 0; const chunks: Uint8Array[] = []
      try { for (;;) { const { value, done } = await reader.read(); if (done) break; size += value.byteLength; if (size > REQUEST_LIMIT) { await reader.cancel(); return fail(413, '图片或请求超过 12 MiB，请压缩后重试') } chunks.push(value) } } finally { reader.releaseLock() }
      const body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
      if (!body || typeof body !== 'object' || Array.isArray(body)) return fail(400, '请求必须是对象')
      return json(200, await this.action(body, request.signal))
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return fail(/修订号冲突|已被修改|工程已被修改|正在被另一次|其他操作修改/.test(message) ? 409 : 400, message)
    }
  }
}

export function installPptWorkbench(ctx: any, workbench: PptWorkbench): void {
  ctx.inject?.(['connection'], (host: any) => {
    host.connection?.fetch?.register({ path: PPT_WORKBENCH_ROUTE, methods: ['POST'], requestBody: 'buffered', fetch: (request: Request) => workbench.fetch(request) })
    host.connection?.fetch?.register({ path: PPT_DOWNLOAD_ROUTE, methods: ['GET'], requestBody: 'buffered', fetch: (request: Request) => workbench.fetchDownload(request) })
```

</details>

#### 缺口

- 合作者从包名或下载提示判断摘录暴露范围的准确度及试用净收益未知。
  **影响**：影响实际采用及效果判断。
  **进一步探讨**：对同一合成资料比较现有下载提示与逐文件摘录预览，由不同操作者生成交付并核对三种载体中的合成敏感标记。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
