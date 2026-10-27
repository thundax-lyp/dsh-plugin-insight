# dsh-invoice-tools

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[b1c8ee8](https://github.com/988hj7tczd-oss/dsh-invoice-tools/tree/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-invoice-tools) [![npm 30d 419](https://img.shields.io/static/v1?label=npm+30d&message=419&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-invoice-tools) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-invoice-tools)
<!-- END META -->

> **功能**：本地抽取电子发票PDF的XML/文本字段并作算术核对，汇总类别与重复提示，生成Markdown或xlsx.b64。

> **亮点**：把本地票据字段抽取、缺失/算术提示与报销草稿输出接入DSH工具，减少人工搬运。详见[Q01](#research-q01)。

> **主要限制**：旧缓存无TTL/版本失效，低置信及重复均入合计；XML高置信非验真，解压无显式输出预算。详见[Q03](#research-q03)。

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
  - [Q01 · 离线发票工具的实际交付是什么？](#detail-section-11)
  - [Q02 · 解析、缓存到汇总如何衔接？](#detail-section-12)
  - [Q03 · 高置信和重复提示为何不能直接放行？](#detail-section-13)
  - [Q04 · 处理边界和测试证明范围是什么？](#detail-section-14)
  - [Q05 · 首次、持续与失败恢复成本怎样看？](#detail-section-15)
  - [Q06 · 当前采用判断和继续探讨重点是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：电子票据用户希望辅助抄录和报销草稿整理，真实票据与资格仍需独立核对。详见[Q01](#research-q01)。

人工表格录入或成熟PDF/XML抽取器加脚本是替代，插件减少搬运但未证明总核对收益。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 本地票据字段 | XML/文本抽取 | 不是OCR或验真 |
| 核对和分组 | 算术/重复提示 | 不自动剔重放行 |
| 草稿生成 | md/xlsx.b64 | 缓存/批次需人确认 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| 匹配tools/fs与Node | 读取/注册/写守卫 | API需匹配 |
| 可解析XML/文本PDF | 字段抽取 | 扫描/加密跳过 |
| 原票与人工审核 | 确认字段/总额 | high非真值 |
| 独立作用域和备份输出 | 数据/恢复 | global/旧缓存有边界 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 准备独立样票与原件 | 用户 | 无敏感/可回看 |
| parse后逐字段核对 | Agent/用户 | 缺失和检查全看 |
| 显式files汇总 | 用户 | 人工剔重/低质 |
| 另存批次及解码 | 用户 | 总额与原票一致 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 匹配宿主/构建包 | 独立样票、备份与字段基线 | 需独立样票/原票备份/老宿主匹配；准备金额工时未知 |
| 持续使用 | 同步解析/解压/缓存 | 原票核对与b64解码，节时未知 | 无新增查验API费；同步解析/解压及逐票核对耗时未知 |
| 失败恢复 | 重启清缓存、重解析 | 保存批次、处理双格式部分成功 | 双格式半成功/同日输出恢复和重新解析工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 字段抽取 | XML/文本规则 | 非OCR/真实性判断 |
| 算术/重复提示 | 容差及分组 | 缺0/重复仍计总额 |
| 报销草稿 | md/xlsx.b64 | 缓存批次/同日文件需控制 |

> **思考**：旧缓存无TTL/版本失效，低置信及重复均入合计；XML高置信非验真，解压无显式输出预算。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把本地票据字段抽取、缺失/算术提示与报销草稿输出接入DSH工具，减少人工搬运。详见[Q01](#research-q01)。

纯逻辑拆分和fixture可查；实际Map无manifest所称TTL，需处理旧票失效、解压预算与批次事务。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

旧缓存无TTL/版本失效，低置信及重复均入合计；XML高置信非验真，解压无显式输出预算。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察；无敏感样票对照可继续研究，正式草稿也需显式files与原票复核，不把high或勾稽通过当放行。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

本地抽取/算术/草稿流程有源码支持；置信非准确率，旧缓存和重复累加影响总额，批次审核为未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/tools/invoice-parse.ts、src/tools/invoice-summary.ts、src/invoice-model.ts、src/pdf-extract.ts、src/summary.ts、tests/smoke.e2e.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：阅读固定两工具、入口、PDF解压/入口、字段关键规则、汇总和样例测试；不运行目标或作财务资格判定。
- 下一步：进一步从失效缓存、同名文件、重复总额、缺金额和压缩PDF探讨批次清单与确认结算机制。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-invoice-tools](https://github.com/988hj7tczd-oss/dsh-invoice-tools)
- **版本号**：0.1.1（[固定提交 b1c8ee8](https://github.com/988hj7tczd-oss/dsh-invoice-tools/tree/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究源hash/规则版本批次清单与待审核集合，确认条目才结算，并在受限worker限解压预算。当前未验证。详见[Q06](#research-q06)。

进一步从失效缓存、同名文件、重复总额、缺金额和压缩PDF探讨批次清单与确认结算机制。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 256 | — | — | 3253 |
| .ts | source | 6 | 1973 | 1547 | 290 | — |
| .ts | test | 1 | 539 | 441 | 56 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-invoice-tools/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-invoice-tools/issues?q=is%3Aissue+created%3A2026-09-22T05%3A32%3A30.074Z..2026-10-22T05%3A32%3A30.074Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-invoice-tools/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A32%3A30.074Z..2026-10-22T05%3A32%3A30.074Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本本地发票解析和报销草稿流程能支持哪些判断，字段、缓存和批次边界如何影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 离线发票工具的实际交付是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已有电子发票PDF、希望减少手工抄字段和整理报销草稿的DSH用户。工具解析内嵌XML优先、文本规则兜底，给结构化字段与勾稽提示，再按类别汇总并产Markdown或xlsx的base64文本。合格产物是可与原票逐项核对的草稿及明确跳过清单，不是发票真实性、可抵扣性或报销资格结论。没有查验网络接口，扫描件/图片明确跳过，README开头“PDF、图片”不能理解为已实现OCR。

简单替代是人工表格录入、成熟PDF/XML抽取器加汇总脚本。贡献在本地字段抽取、缺失/算术收据、会话缓存与宿主版本守卫写文件的流程组合，自写PDF解析器不是完整PDF语义突破。README单次搜索0结果不足以证明生态无人做，更不能作为原创评分依据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-17](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/README.md#L12-L17)

作者业务范围和生态主张。

```text
DSH（DeepSeek Harness）原生工具插件：读取工作区内的增值税电子发票文件（数电票/全电发票 PDF、图片），
结构化为 JSON（发票代码/号码/金额/税额/购买方/销售方/开票日期），多张汇总生成报销单（Markdown / xlsx）。
全程只读输入、写入输出文件；发票数据仅在本机处理，**不上传任何查验接口**；解析缓存按会话隔离
（工具无法取得会话上下文时回退为进程级缓存，详见「安全与隐私」）。

> 2026-08 调研结论：`dsh invoice payment 报销 发票` 实时搜索 0 结果，发票/报销方向无人做，本插件填补该空白。
```

**依据 2 · 源码核查**：[src/tools/invoice-parse.ts:84-108](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/tools/invoice-parse.ts#L84-L108)

图片跳过和XML/文本路由。

<details>
<summary>查看原文（25行）</summary>

```text
function parseOne(ctx: Context, path: string, name: string, bytes: Uint8Array): { invoice?: InvoiceData; skipped?: SkippedFile } {
  const kind = detectFileKind(bytes, name)
  if (kind === 'png' || kind === 'jpg') {
    return { skipped: { path, file: name, reason: 'image-without-ocr', detail: '纯图片无 OCR：首版不支持扫描件识别，见 README（后续可对接社区 vision 插件）' } }
  }
  if (kind === 'other') {
    return { skipped: { path, file: name, reason: 'unsupported-file-type', detail: `不支持的文件类型（检测到非 PDF/PNG/JPEG 内容，扩展名 ${name.split('.').pop() ?? ''}）` } }
  }
  // PDF
  const extraction = extractPdf(bytes)
  if (extraction.encrypted) {
    return { skipped: { path, file: name, reason: 'password-protected', detail: 'PDF 声明 /Encrypt（密码保护或加密），无法解析' } }
  }
  const xmlText = extraction.embeddedXml.length > 0 ? extraction.embeddedXml.join('\n') : ''
  if (xmlText.trim().length > 0) {
    const invoice = parseInvoiceFromXml(xmlText, name, extraction.text)
    if (invoice.invoiceNumber === '' && invoice.amount === 0 && invoice.total === 0) {
      return { skipped: { path, file: name, reason: 'unparsable', detail: '找到 XML 附件但未抽取到有效字段（附件 Schema 不在白名单内）' } }
    }
    return { invoice }
  }
  if (extraction.text.trim().length > 0) {
    return { invoice: parseInvoiceFromTextLines(extraction.text, name) }
  }
  return { skipped: { path, file: name, reason: 'empty-pdf', detail: 'PDF 无文本层且无 XML 附件（扫描件需 OCR）' } }
```

</details>

**依据 3 · 源码核查**：[src/tools/invoice-summary.ts:100-111](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/tools/invoice-summary.ts#L100-L111)

md和xlsx.b64输出。

<details>
<summary>查看原文（12行）</summary>

```text
  if (out === 'md' || out === 'both') {
    const md = renderMarkdown(invoices, summary, { generatedAt: new Date().toISOString() })
    const res = await writeGuardedText(ctx, `${base}.md`, md, signal)
    files.push({ path: res.absPath, kind: 'md', operation: res.operation, size: Buffer.byteLength(md, 'utf8') })
  }
  if (out === 'xlsx' || out === 'both') {
    const xlsxBytes = renderXlsx(invoices, summary)
    xlsxBase64 = Buffer.from(xlsxBytes).toString('base64')
    // DSH fs 服务仅提供 UTF-8 文本信道，xlsx 以 base64 文本落盘（README 提供解码命令）
    const b64Path = `${base}.xlsx.b64`
    const res = await writeGuardedText(ctx, b64Path, xlsxBase64, signal)
    files.push({ path: res.absPath, kind: 'xlsx', operation: res.operation, size: Buffer.byteLength(xlsxBase64, 'utf8') })
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 解析、缓存到汇总如何衔接？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

入口硬注入tools/fs并注册两个工具。invoice_parse由ctx.fs.resolve/stat/listDir/readBytes读取，目录最多三层、单文件16MiB；PDF对象扫描、Flate流和文本操作符由本地同步函数处理，XML标签白名单/文本正则映射InvoiceData，再做金额+税额与合计容差0.01等检查，结果按scope:绝对路径写模块Map。scope取exec.agent.id而非显式session header，缺失回global，不应超出对应宿主契约声称严格会话隔离。

invoice_summary只用已有缓存，不重读票据；files可按绝对路径、后缀或basename选第一命中，不给files则取scope全部积累结果，并把categories直接改在缓存对象上。金额汇总和重复组均生成后，md/xlsx.b64按固定日期文件名写；已有目标先read再replaceIfVersion，缺失createIfAbsent。需要匹配0.1.1-rc.2工具/fs依赖及Node>=22.18，工作区边界委托宿主fs，没有插件额外contains；发布lib由构建生成，未检查npm包不能断言缺产物。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:20-28](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/index.ts#L20-L28)

服务和两工具。

```text
export const name = 'invoice-tools'

/** 硬依赖：tools 注册表与文件系统服务（apply 时已就绪）。 */
export const inject = ['tools', 'fs']

export function apply(ctx: Context) {
  ctx.tools.register(invoiceParseTool(ctx))
  ctx.tools.register(invoiceSummaryTool(ctx))
  ctx.logger?.info('[invoice-tools] registered invoice_parse / invoice_summary')
```

**依据 2 · 源码核查**：[src/tools/invoice-parse.ts:64-79](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/tools/invoice-parse.ts#L64-L79)

目录深度。

<details>
<summary>查看原文（16行）</summary>

```text
/** 递归收集发票文件（目录深度上限 3）。 */
async function collectFiles(ctx: Context, target: Awaited<ReturnType<Context['fs']['resolve']>>, signal: AbortSignal | undefined, depth: number, acc: { name: string; target: Awaited<ReturnType<Context['fs']['resolve']>> }[]): Promise<void> {
  if (depth > 3) return
  const info = await ctx.fs.stat(target, signal)
  if (!info) return
  if (info.type === 'file') {
    const abs = ctx.fs.processPath(target)
    if (hasSupportedExt(abs)) acc.push({ name: abs.split('/').pop() ?? abs, target })
    return
  }
  if (info.type === 'directory') {
    const entries = await ctx.fs.listDir(target, signal)
    for (const entry of entries) {
      if (entry.type === 'file' && hasSupportedExt(entry.name)) acc.push({ name: entry.name, target: entry.target })
      else if (entry.type === 'directory') await collectFiles(ctx, entry.target, signal, depth + 1, acc)
    }
```

</details>

**依据 3 · 源码核查**：[src/tools/invoice-parse.ts:138-156](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/tools/invoice-parse.ts#L138-L156)

读字节/缓存。

<details>
<summary>查看原文（19行）</summary>

```text
  for (const file of files) {
    const absPath = ctx.fs.processPath(file.target)
    let bytes: Uint8Array
    try {
      bytes = await ctx.fs.readBytes(file.target, signal, MAX_BYTES)
    } catch (error) {
      skipped.push({ path: absPath, file: file.name, reason: 'unparsable', detail: `读取失败: ${error instanceof Error ? error.message : String(error)}` })
      continue
    }
    const r = parseOne(ctx, absPath, file.name, bytes)
    if (r.skipped) {
      skipped.push(r.skipped)
      continue
    }
    const invoice = r.invoice!
    invoice.checks = validateInvoice(invoice)
    if (!invoice.checks.every((c) => c.ok)) checksFailed += 1
    parseCache.set(`${scope}:${absPath}`, invoice)
    parsed.push({ ...invoice, path: absPath })
```

</details>

**依据 4 · 源码核查**：[src/tools/invoice-parse.ts:246-250](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/tools/invoice-parse.ts#L246-L250)

scope来源agent.id。

```text
    async execute(args, exec) {
      // schema 推断出的输出类型与业务类型形状不同，桥接返回（运行时数据本身就是 JSON 可序列化结构）
      // 会话维度：exec.agent.id 即会话 id（由代理循环设置）；拿不到时回退 global（进程级缓存）
      const sessionId = (exec as unknown as { agent?: { id?: string } } | undefined)?.agent?.id
      return runInvoiceParse(ctx, args, exec?.signal, sessionId) as any
```

**依据 5 · 源码核查**：[src/tools/invoice-summary.ts:57-91](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/tools/invoice-summary.ts#L57-L91)

缓存选择及类别原位修改。

<details>
<summary>查看原文（35行）</summary>

```text
  // 只可见当前会话作用域的缓存条目（跨会话隔离；无会话 id 时为 global 进程级）
  const scope = cacheScope(sessionId)
  const scopePrefix = `${scope}:`
  let invoices: InvoiceData[]
  if (args.files !== undefined && args.files.length > 0) {
    const matched: InvoiceData[] = []
    const missing: string[] = []
    for (const f of args.files) {
      const hit = [...parseCache.entries()].find(([key, inv]) => {
        if (!key.startsWith(scopePrefix)) return false
        const absPath = key.slice(scopePrefix.length)
        return absPath === f || absPath.endsWith(`/${f}`) || inv.source.file === f
      })
      if (hit) matched.push(hit[1])
      else missing.push(f)
    }
    if (missing.length > 0) {
      throw new Error(`以下文件尚未解析，请先运行 invoice_parse：${missing.join('、')}`)
    }
    invoices = matched
  } else {
    invoices = [...parseCache.entries()].filter(([key]) => key.startsWith(scopePrefix)).map(([, inv]) => inv)
  }
  if (invoices.length === 0) {
    throw new Error('当前会话没有可汇总的发票：请先运行 invoice_parse，或通过 files 参数指定已解析文件')
  }

  // 类别覆盖：按发票号码或源文件名匹配
  if (args.categories) {
    for (const inv of invoices) {
      const byNo = args.categories[inv.invoiceNumber]
      const byFile = args.categories[inv.source.file]
      if (byNo !== undefined) inv.category = byNo
      else if (byFile !== undefined) inv.category = byFile
    }
```

</details>

**依据 6 · 源码核查**：[src/tools/invoice-summary.ts:31-47](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/tools/invoice-summary.ts#L31-L47)

写版本守卫。

<details>
<summary>查看原文（17行）</summary>

```text
/** 写文本文件：已存在目标先 read，再带版本守卫写入；不存在则 createIfAbsent。 */
async function writeGuardedText(
  ctx: Context,
  relativePath: string,
  content: string,
  signal?: AbortSignal,
): Promise<{ operation: 'create' | 'update'; absPath: string }> {
  const target = await ctx.fs.resolve(relativePath, { signal })
  const info = await ctx.fs.stat(target, signal)
  if (info) {
    // 已存在目标先 read（遵循 read 策略），再以版本守卫覆盖
    await ctx.fs.readText(target, signal)
    await ctx.fs.writeText(target, content, { kind: 'replaceIfVersion', version: info.version }, signal)
    return { operation: 'update', absPath: ctx.fs.processPath(target) }
  }
  await ctx.fs.writeText(target, content, { kind: 'createIfAbsent' }, signal)
  return { operation: 'create', absPath: ctx.fs.processPath(target) }
```

</details>

**依据 7 · 源码核查**：[package.json:9-11](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/package.json#L9-L11)

Node下限。

```text
  "engines": {
    "node": ">=22.18.0"
  },
```

#### 缺口

- agent.id与会话身份、fs resolve默认cwd和访问授权由匹配宿主决定
  **影响**：源码自身不能保证多Agent同会话共享或多会话严格隔离
  **进一步探讨**：阅读指定DSH版本身份/fs契约，采用时显式限定文件与独立作用域

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 高置信和重复提示为何不能直接放行？

**研究主题**：缺陷与关键质疑

#### 完整回答

confidence只由抽取方法与四个关键字段是否缺失决定，XML/mixed完整即high，不是统计校准准确率或验真。XML解析正则标签不支持带冒号命名空间，取同名第一叶子，字段还可能混自多个附件；文本兜底取“发票”文本中最长8–20位数字，可能取错号。缺金额被填0、日期仅格式/粗范围，全部0可通过勾稽，缺失提醒与所有检查必须一起看；红字金额可解析却在非负检查失败，不能简单归为无效票。

重复组只是同票号+amount四舍五入两位的启发提示，汇总先把所有票加入合计再标重复，没有实际剔除；测试也明确四张含重复仍算445。不能把“保留首张建议剔除”写成已去重后总额。低confidence/检查失败照样留缓存并参与summary，重复文件列表或同名首命中也可能引入重复/错选。重新parse失败或文件被删除时没有删除旧Map条目，默认summary会继续用旧票；这直接限制作为正式报销总账的数据可靠性。

#### 证据与依据

**依据 1 · 源码核查**：[src/invoice-model.ts:138-161](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/invoice-model.ts#L138-L161)

标签正则与首叶子。

<details>
<summary>查看原文（24行）</summary>

```text
export function collectXmlTags(xml: string): Map<string, string> {
  const map = new Map<string, string>()
  const tagRe = /<\/?([A-Za-z_\u4e00-\u9fa5A-Z][A-Za-z0-9_\u4e00-\u9fa5.\-]*)(?:\s[^>]*)?>/g
  const stack: { tag: string; contentStart: number }[] = []
  let m: RegExpExecArray | null
  while ((m = tagRe.exec(xml)) !== null) {
    const token = m[0]
    const tag = m[1]
    if (token.startsWith('</')) {
      // 找最近未闭合的同名标签（最内层优先）
      let found = -1
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].tag === tag) {
          found = i
          break
        }
      }
      if (found >= 0) {
        const open = stack[found]
        stack.length = found
        const content = xml.slice(open.contentStart, m.index)
        // 叶子：内容不含子标签
        if (!content.includes('<') && content.trim().length > 0 && !map.has(tag)) {
          map.set(tag, content.trim())
```

</details>

**依据 2 · 源码核查**：[src/invoice-model.ts:225-233](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/invoice-model.ts#L225-L233)

最长数字兜底。

```text
  // 兜底：无"发票号码"标签时取文本中全部 8-20 位数字里最长者（全电票号 20 位，
  // 通常长于发票代码；无发票语义的普通文档会因其他关键字段缺失而降 confidence）。
  if (!fields.invoiceNumber) {
    const nums = [...t.matchAll(/[0-9]{8,20}/g)].map((x) => x[0])
    const best = nums.sort((a, b) => b.length - a.length)[0]
    if (best !== undefined && t.includes('发票')) {
      fields.invoiceNumber = best
      matchedRules.push('invoiceNumber-fallback')
    }
```

**依据 3 · 源码核查**：[src/invoice-model.ts:351-364](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/invoice-model.ts#L351-L364)

置信方法与缺失0。

<details>
<summary>查看原文（14行）</summary>

```text
  const missing = missingFields(fields)
  const confidence: InvoiceConfidence =
    (method === 'xml' || method === 'mixed') && missingKeyFields(fields).length === 0
      ? 'high'
      : method === 'regex'
        ? missingKeyFields(fields).length === 0 ? 'medium' : 'low'
        : missingKeyFields(fields).length === 0 ? 'high' : 'low'

  const invoice: InvoiceData = {
    invoiceCode: fields.invoiceCode ?? '',
    invoiceNumber: fields.invoiceNumber ?? '',
    amount: normalizeMoney(fields.amount ?? '') ?? 0,
    tax: normalizeMoney(fields.tax ?? '') ?? 0,
    total: normalizeMoney(fields.total ?? '') ?? 0,
```

</details>

**依据 4 · 源码核查**：[src/invoice-model.ts:385-397](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/invoice-model.ts#L385-L397)

仅算术/格式检查。

<details>
<summary>查看原文（13行）</summary>

```text
export function validateInvoice(invoice: InvoiceData): InvoiceCheck[] {
  const checks: InvoiceCheck[] = []
  const expected = invoice.amount + invoice.tax
  const diff = Math.abs(invoice.total - expected)
  checks.push({
    label: '勾稽(价税合计=金额+税额)',
    ok: diff <= TOTAL_TOLERANCE,
    detail: `合计 ${invoice.total.toFixed(2)} vs 金额+税额 ${expected.toFixed(2)}${diff > TOTAL_TOLERANCE ? `（差 ${diff.toFixed(2)}）` : ''}`,
  })
  checks.push({ label: '金额/税额非负', ok: invoice.amount >= 0 && invoice.tax >= 0, detail: `金额 ${invoice.amount.toFixed(2)} / 税额 ${invoice.tax.toFixed(2)}` })
  checks.push({ label: '票号格式', ok: /^[0-9]{8,20}$/.test(invoice.invoiceNumber), detail: invoice.invoiceNumber || '（空）' })
  checks.push({ label: '开票日期格式', ok: invoice.issueDate === '' || /^\d{4}-\d{2}-\d{2}$/.test(invoice.issueDate), detail: invoice.issueDate || '（空）' })
  return checks
```

</details>

**依据 5 · 源码核查**：[src/summary.ts:57-93](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/summary.ts#L57-L93)

先累加再仅标重复。

<details>
<summary>查看原文（37行）</summary>

```text
export function summarizeInvoices(invoices: InvoiceData[]): InvoiceSummary {
  const totals: SummaryTotals = { count: invoices.length, amount: 0, tax: 0, total: 0 }
  const catMap = new Map<string, CategoryTotal>()
  const dupMap = new Map<string, DuplicateGroup>()

  for (const inv of invoices) {
    totals.amount = round2(totals.amount + inv.amount)
    totals.tax = round2(totals.tax + inv.tax)
    totals.total = round2(totals.total + inv.total)

    const cat = inv.category ?? '未分类'
    const entry = catMap.get(cat) ?? { category: cat, count: 0, amount: 0, tax: 0, total: 0 }
    entry.count += 1
    entry.amount = round2(entry.amount + inv.amount)
    entry.tax = round2(entry.tax + inv.tax)
    entry.total = round2(entry.total + inv.total)
    catMap.set(cat, entry)

    if (/^[0-9]{8,20}$/.test(inv.invoiceNumber)) {
      const key = `${inv.invoiceNumber}@${inv.amount.toFixed(2)}`
      const group = dupMap.get(key) ?? {
        key,
        invoiceNumber: inv.invoiceNumber,
        amount: inv.amount,
        files: [],
        flagged: [],
      }
      group.files.push(inv.source.file)
      dupMap.set(key, group)
    }
  }

  const duplicates: DuplicateGroup[] = [...dupMap.values()]
    .filter((g) => g.files.length > 1)
    .map((g) => ({ ...g, flagged: g.files.slice(1) }))

  return { totals, byCategory: [...catMap.values()], duplicates }
```

</details>

**依据 6 · 源码核查**：[tests/smoke.e2e.ts:302-318](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/tests/smoke.e2e.ts#L302-L318)

重复仍计入合计的明确断言。

<details>
<summary>查看原文（17行）</summary>

```text
  const A = mk('A.pdf', '24412000000012345678', 100, 13, 113)
  const B = mk('B.pdf', '24412000000087654321', 200, 26, 226)
  const C = mk('C.pdf', '98765432101234567890', 50, 3, 53)
  const D = mk('D.pdf', '98765432101234567890', 50, 3, 53) // 与 C 同票号同金额 → 重复

  const summary = summarizeInvoices([A, B, C, D])
  assert.equal(summary.totals.count, 4)
  assert.equal(summary.totals.amount, 400)
  assert.equal(summary.totals.tax, 45)
  assert.equal(summary.totals.total, 445)

  // 重复检测
  assert.equal(summary.duplicates.length, 1)
  const dup = summary.duplicates[0]
  assert.equal(dup.invoiceNumber, '98765432101234567890')
  assert.equal(dup.amount, 50)
  assert.deepEqual(dup.flagged, ['D.pdf'])
```

</details>

**依据 7 · 源码核查**：[src/tools/invoice-parse.ts:143-155](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/tools/invoice-parse.ts#L143-L155)

失败跳过未清旧缓存。

<details>
<summary>查看原文（13行）</summary>

```text
    } catch (error) {
      skipped.push({ path: absPath, file: file.name, reason: 'unparsable', detail: `读取失败: ${error instanceof Error ? error.message : String(error)}` })
      continue
    }
    const r = parseOne(ctx, absPath, file.name, bytes)
    if (r.skipped) {
      skipped.push(r.skipped)
      continue
    }
    const invoice = r.invoice!
    invoice.checks = validateInvoice(invoice)
    if (!invoice.checks.every((c) => c.ok)) checksFailed += 1
    parseCache.set(`${scope}:${absPath}`, invoice)
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 处理边界和测试证明范围是什么？

**研究主题**：工程质量与复用

#### 完整回答

解析器、字段逻辑、汇总渲染与工具编排分开，合成fixture测试可检查字段和Zip/OOXML结构，金额/重复断言可直接读；它们不是多来源真实发票覆盖率。自写PDF不依赖xref不等对xref流或全部PDF语义鲁棒，源码同步inflateSync/inflateRawSync没有maxOutputLength，16MiB输入上限不约束解压后体积，畸形/高压缩流可能占用大量宿主内存或主线程。parseOne的同步异常不在readBytes catch内，不能无条件声称所有单票异常都不中断批量。

Map在当前源码无TTL/容量/清理，manifest“已有TTL/上限”与实际不符，缓存会持续保留敏感字段直到进程结束。写守卫可阻止悄悄覆盖并发版本，但按日期的固定输出会把同日不同批次写同文件，out=both先md后b64而非事务，第二步失败会留下部分产物；恢复需明确保存哪个批次。测试中的openpyxl分支是可选交叉校验，不把作者13case描述当本次执行结果。

#### 证据与依据

**依据 1 · 源码核查**：[src/pdf-extract.ts:374-402](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/pdf-extract.ts#L374-L402)

同步无显式输出限额解压。

<details>
<summary>查看原文（29行）</summary>

```text
/** 按 /Filter 链解码流（支持 FlateDecode / Fl / Flate；失败时回退原样）。 */
function decodeStream(bytes: Uint8Array): Uint8Array {
  try {
    return inflateSync(bytes)
  } catch {
    try {
      return inflateRawSync(bytes)
    } catch {
      return bytes
    }
  }
}

function filterChainOf(dict: Record<string, PdfValue> | undefined): string[] {
  if (!dict) return []
  const f = dict['Filter']
  if (!f) return []
  if (f.kind === 'name') return [f.name]
  if (f.kind === 'array') return f.items.filter((x) => x.kind === 'name').map((x) => (x as { name: string }).name)
  return []
}

function applyFilterChain(bytes: Uint8Array, filters: string[]): Uint8Array {
  let data = bytes
  for (const f of filters) {
    // 本版仅实现 FlateDecode；未知过滤器保持原样（上层会对不可解码内容降级处理）
    if (f === 'FlateDecode' || f === 'Fl') data = decodeStream(data)
  }
  return data
```

</details>

**依据 2 · 源码核查**：[src/tools/invoice-parse.ts:138-155](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/tools/invoice-parse.ts#L138-L155)

try只围读文件，随后同步解析。

<details>
<summary>查看原文（18行）</summary>

```text
  for (const file of files) {
    const absPath = ctx.fs.processPath(file.target)
    let bytes: Uint8Array
    try {
      bytes = await ctx.fs.readBytes(file.target, signal, MAX_BYTES)
    } catch (error) {
      skipped.push({ path: absPath, file: file.name, reason: 'unparsable', detail: `读取失败: ${error instanceof Error ? error.message : String(error)}` })
      continue
    }
    const r = parseOne(ctx, absPath, file.name, bytes)
    if (r.skipped) {
      skipped.push(r.skipped)
      continue
    }
    const invoice = r.invoice!
    invoice.checks = validateInvoice(invoice)
    if (!invoice.checks.every((c) => c.ok)) checksFailed += 1
    parseCache.set(`${scope}:${absPath}`, invoice)
```

</details>

**依据 3 · 源码核查**：[src/tools/invoice-parse.ts:22-29](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/tools/invoice-parse.ts#L22-L29)

模块Map无策略。

```text
/** 解析缓存：invoice_summary 缺省 files 时复用上次 parse 结果。
 *  key 为 `${scope}:${absPath}`，scope 为会话 id（工具执行上下文的 agent.id）——按会话隔离；
 *  无法取得会话上下文时回退 'global'（进程级缓存，README「安全与隐私」已如实说明）。 */
export const parseCache = new Map<string, InvoiceData>()

/** 缓存作用域：有会话 id 用会话 id；否则回退 'global'（进程级，见 README）。 */
export function cacheScope(sessionId: string | undefined | null): string {
  return sessionId && sessionId.length > 0 ? sessionId : 'global'
```

**依据 4 · 源码核查**：[src/tools/invoice-summary.ts:94-111](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/tools/invoice-summary.ts#L94-L111)

双文件顺序写。

<details>
<summary>查看原文（18行）</summary>

```text
  const summary = summarizeInvoices(invoices)
  const out = args.out ?? 'md'
  const base = reimbursementBaseName()
  const files: InvoiceSummaryResult['files'] = []
  let xlsxBase64: string | undefined

  if (out === 'md' || out === 'both') {
    const md = renderMarkdown(invoices, summary, { generatedAt: new Date().toISOString() })
    const res = await writeGuardedText(ctx, `${base}.md`, md, signal)
    files.push({ path: res.absPath, kind: 'md', operation: res.operation, size: Buffer.byteLength(md, 'utf8') })
  }
  if (out === 'xlsx' || out === 'both') {
    const xlsxBytes = renderXlsx(invoices, summary)
    xlsxBase64 = Buffer.from(xlsxBytes).toString('base64')
    // DSH fs 服务仅提供 UTF-8 文本信道，xlsx 以 base64 文本落盘（README 提供解码命令）
    const b64Path = `${base}.xlsx.b64`
    const res = await writeGuardedText(ctx, b64Path, xlsxBase64, signal)
    files.push({ path: res.absPath, kind: 'xlsx', operation: res.operation, size: Buffer.byteLength(xlsxBase64, 'utf8') })
```

</details>

**依据 5 · 源码核查**：[src/summary.ts:374-379](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/summary.ts#L374-L379)

日期固定文件名。

```text
export function reimbursementBaseName(date?: Date): string {
  const d = date ?? new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `报销单-${y}${m}${day}`
```

**依据 6 · 源码核查**：[tests/smoke.e2e.ts:176-210](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/tests/smoke.e2e.ts#L176-L210)

合成样例精确字段检查。

<details>
<summary>查看原文（35行）</summary>

```text
test('① XML 附件解析字段完整、勾稽通过、confidence=high', () => {
  const pdf = buildPdf({ textLines: TEXT_C, xml: XML_A })
  const extraction = extractPdf(pdf)
  assert.equal(extraction.encrypted, false)
  assert.ok(extraction.embeddedXml.length >= 1, '应提取到 XML 附件')
  assert.ok(extraction.embeddedXml[0].includes('InvoiceNo'))
  assert.ok(extraction.text.includes('发票号码'), '文本层应包含发票号码行')

  const inv = parseInvoiceFromXml(extraction.embeddedXml[0], 'A.pdf', extraction.text)
  assert.equal(inv.invoiceNumber, '24412000000012345678')
  assert.equal(inv.invoiceCode, '044001900111')
  assert.equal(inv.amount, 100)
  assert.equal(inv.tax, 13)
  assert.equal(inv.total, 113)
  assert.equal(inv.issueDate, '2024-01-05')
  assert.equal(inv.buyer.name, '北京示例科技有限公司')
  assert.equal(inv.buyer.taxId, '91110108MA01ABCDEF')
  assert.equal(inv.seller.name, '上海示例贸易有限公司')
  assert.equal(inv.seller.taxId, '91310115MA1K123456')
  assert.equal(inv.verifyUrl, 'https://inv-veri.chinatax.gov.cn/')
  assert.equal(inv.source.method, 'xml')
  assert.equal(inv.source.confidence, 'high')
  assert.deepEqual(inv.source.missing, [])

  const checks = validateInvoice(inv)
  const recon = checks.find((c) => c.label.startsWith('勾稽'))!
  assert.equal(recon.ok, true, '勾稽应通过')

  // 第二张（B）
  const pdfB = buildPdf({ xml: XML_B, textLines: [] })
  const extractedB = extractPdf(pdfB)
  const invB = parseInvoiceFromXml(extractedB.embeddedXml[0], 'B.pdf', extractedB.text)
  assert.equal(invB.total, 226)
  assert.equal(invB.tax, 26)
  assert.equal(invB.source.confidence, 'high')
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 首次、持续与失败恢复成本怎样看？

**研究主题**：效果与总成本

#### 完整回答

首次要安装构建/发布物、对齐老版宿主API，准备独立工作区与原票备份，并确认接收结果的Agent模型处理政策；插件无网络查验不等会话内容绝不发到模型服务，因为结构化发票会进入工具响应。持续不新增查验API费，但解析和压缩在宿主同步执行，批次文件数/解压输出无总预算，手工仍需对票号、金额、买卖方、缺失与重复逐项核对。xlsx.b64还需额外解码成真正xlsx。

恢复包括重启清Map、显式重新parse指定文件、备份同日输出和处理双格式半成功，不能只重试summary假定它读最新源文件。没有真实多版发票错误率、吞吐与抄录工时对照，节省和可处理票据比例未知。若人工核对成本接近手工表格，是否值得使用应按实际固定样本比较，而非零第三方解析库就认定低成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/invoice-parse.ts:155-156](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/tools/invoice-parse.ts#L155-L156)

数据进入工具响应。

```text
    parseCache.set(`${scope}:${absPath}`, invoice)
    parsed.push({ ...invoice, path: absPath })
```

**依据 2 · 源码核查**：[src/tools/invoice-summary.ts:61-81](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/tools/invoice-summary.ts#L61-L81)

只消费缓存。

<details>
<summary>查看原文（21行）</summary>

```text
  if (args.files !== undefined && args.files.length > 0) {
    const matched: InvoiceData[] = []
    const missing: string[] = []
    for (const f of args.files) {
      const hit = [...parseCache.entries()].find(([key, inv]) => {
        if (!key.startsWith(scopePrefix)) return false
        const absPath = key.slice(scopePrefix.length)
        return absPath === f || absPath.endsWith(`/${f}`) || inv.source.file === f
      })
      if (hit) matched.push(hit[1])
      else missing.push(f)
    }
    if (missing.length > 0) {
      throw new Error(`以下文件尚未解析，请先运行 invoice_parse：${missing.join('、')}`)
    }
    invoices = matched
  } else {
    invoices = [...parseCache.entries()].filter(([key]) => key.startsWith(scopePrefix)).map(([, inv]) => inv)
  }
  if (invoices.length === 0) {
    throw new Error('当前会话没有可汇总的发票：请先运行 invoice_parse，或通过 files 参数指定已解析文件')
```

</details>

**依据 3 · 源码核查**：[src/tools/invoice-summary.ts:105-120](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/tools/invoice-summary.ts#L105-L120)

base64产物与隐私说明。

<details>
<summary>查看原文（16行）</summary>

```text
  if (out === 'xlsx' || out === 'both') {
    const xlsxBytes = renderXlsx(invoices, summary)
    xlsxBase64 = Buffer.from(xlsxBytes).toString('base64')
    // DSH fs 服务仅提供 UTF-8 文本信道，xlsx 以 base64 文本落盘（README 提供解码命令）
    const b64Path = `${base}.xlsx.b64`
    const res = await writeGuardedText(ctx, b64Path, xlsxBase64, signal)
    files.push({ path: res.absPath, kind: 'xlsx', operation: res.operation, size: Buffer.byteLength(xlsxBase64, 'utf8') })
  }

  return {
    invoicesCount: invoices.length,
    summary,
    files,
    xlsxBase64,
    note:
      '隐私说明：发票数据仅在本机流转，不发起任何查验接口请求（查验为显式 opt-in，默认关闭）。解析缓存按会话隔离——工具无法取得会话上下文时回退为进程级缓存（见 README）。xlsx 以 base64 文本落盘，解码命令见 README。',
```

</details>

**依据 4 · 作者声明**：[README.md:128-138](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/README.md#L128-L138)

需解码及可选交叉校验。

<details>
<summary>查看原文（11行）</summary>

````text
DSH 文件系统服务提供 UTF-8 文本信道（无二进制写 API），故 `invoice_summary out='xlsx'` 生成的
xlsx（标准 OOXML ZIP，可由 Excel/WPS/openpyxl 打开）以 **base64 文本**落盘为 `报销单-<日期>.xlsx.b64`：

```bash
base64 -d 报销单-20260823.xlsx.b64 > 报销单-20260823.xlsx   # macOS/Linux
```

工具返回值同时携带 `xlsxBase64`，会话内可自行解码。文件头 `PK\x03\x04`、中央目录与
`xl/worksheets/sheet1.xml` 结构均由离线测试做结构断言；openpyxl 交叉验证在环境可用时执行，
缺失时测试显式打印 `-- SKIP openpyxl 交叉验证（python3/openpyxl 缺失）` 并计入 skipped
（node:test skip 语义，不再静默跳过）。
````

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前采用判断和继续探讨重点是什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先观察。原因是缓存身份/失效和TTL不闭合，失效旧票仍参与默认汇总，低质量和重复票未剔除、输出同日覆盖，且同步自写解析器未限解压输出；这些会直接影响发票草稿的可靠性和恢复。维护者可用无敏感、可丢弃样票比较字段抽取，但不宜让它自动生成唯一正式金额依据。若继续个人受控使用，应显式files、人工确认并另存输出，所有high、勾稽✓及重复总额都回原票核查。

值得讨论版本化票据批次清单，把源文件hash/解析规则版本/作用域绑定，失败旧缓存标失效，低置信与重复条目进入待审核集合，确认后才形成结算总额；解压移入受限worker并有展开上限。基线是当前内存Map加全部累加和人工表格，反例含改文件后parse失败、同名目录、重复票、全缺金额、命名空间XML和高压缩PDF。用字段错率、旧票混入/重复计入和恢复成本比较，仍为未验证假设，不宣称自动财务审核能力。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/invoice-summary.ts:57-91](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/tools/invoice-summary.ts#L57-L91)

当前缓存批次边界。

<details>
<summary>查看原文（35行）</summary>

```text
  // 只可见当前会话作用域的缓存条目（跨会话隔离；无会话 id 时为 global 进程级）
  const scope = cacheScope(sessionId)
  const scopePrefix = `${scope}:`
  let invoices: InvoiceData[]
  if (args.files !== undefined && args.files.length > 0) {
    const matched: InvoiceData[] = []
    const missing: string[] = []
    for (const f of args.files) {
      const hit = [...parseCache.entries()].find(([key, inv]) => {
        if (!key.startsWith(scopePrefix)) return false
        const absPath = key.slice(scopePrefix.length)
        return absPath === f || absPath.endsWith(`/${f}`) || inv.source.file === f
      })
      if (hit) matched.push(hit[1])
      else missing.push(f)
    }
    if (missing.length > 0) {
      throw new Error(`以下文件尚未解析，请先运行 invoice_parse：${missing.join('、')}`)
    }
    invoices = matched
  } else {
    invoices = [...parseCache.entries()].filter(([key]) => key.startsWith(scopePrefix)).map(([, inv]) => inv)
  }
  if (invoices.length === 0) {
    throw new Error('当前会话没有可汇总的发票：请先运行 invoice_parse，或通过 files 参数指定已解析文件')
  }

  // 类别覆盖：按发票号码或源文件名匹配
  if (args.categories) {
    for (const inv of invoices) {
      const byNo = args.categories[inv.invoiceNumber]
      const byFile = args.categories[inv.source.file]
      if (byNo !== undefined) inv.category = byNo
      else if (byFile !== undefined) inv.category = byFile
    }
```

</details>

**依据 2 · 源码核查**：[src/summary.ts:57-93](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/summary.ts#L57-L93)

当前合计与重复分离。

<details>
<summary>查看原文（37行）</summary>

```text
export function summarizeInvoices(invoices: InvoiceData[]): InvoiceSummary {
  const totals: SummaryTotals = { count: invoices.length, amount: 0, tax: 0, total: 0 }
  const catMap = new Map<string, CategoryTotal>()
  const dupMap = new Map<string, DuplicateGroup>()

  for (const inv of invoices) {
    totals.amount = round2(totals.amount + inv.amount)
    totals.tax = round2(totals.tax + inv.tax)
    totals.total = round2(totals.total + inv.total)

    const cat = inv.category ?? '未分类'
    const entry = catMap.get(cat) ?? { category: cat, count: 0, amount: 0, tax: 0, total: 0 }
    entry.count += 1
    entry.amount = round2(entry.amount + inv.amount)
    entry.tax = round2(entry.tax + inv.tax)
    entry.total = round2(entry.total + inv.total)
    catMap.set(cat, entry)

    if (/^[0-9]{8,20}$/.test(inv.invoiceNumber)) {
      const key = `${inv.invoiceNumber}@${inv.amount.toFixed(2)}`
      const group = dupMap.get(key) ?? {
        key,
        invoiceNumber: inv.invoiceNumber,
        amount: inv.amount,
        files: [],
        flagged: [],
      }
      group.files.push(inv.source.file)
      dupMap.set(key, group)
    }
  }

  const duplicates: DuplicateGroup[] = [...dupMap.values()]
    .filter((g) => g.files.length > 1)
    .map((g) => ({ ...g, flagged: g.files.slice(1) }))

  return { totals, byCategory: [...catMap.values()], duplicates }
```

</details>

**依据 3 · 源码核查**：[src/pdf-extract.ts:374-384](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/pdf-extract.ts#L374-L384)

展开缺预算。

<details>
<summary>查看原文（11行）</summary>

```text
/** 按 /Filter 链解码流（支持 FlateDecode / Fl / Flate；失败时回退原样）。 */
function decodeStream(bytes: Uint8Array): Uint8Array {
  try {
    return inflateSync(bytes)
  } catch {
    try {
      return inflateRawSync(bytes)
    } catch {
      return bytes
    }
  }
```

</details>

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
