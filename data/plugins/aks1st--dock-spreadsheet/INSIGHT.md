# dock-spreadsheet

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[8ad1eea](https://github.com/AKS1st/dock-spreadsheet/tree/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7)

<!-- BEGIN META -->
[![npm 30d 413](https://img.shields.io/static/v1?label=npm+30d&message=413&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-spreadsheet) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-spreadsheet)
<!-- END META -->

> **实现功能**：在DSH dock-files中只读预览XLSX、XLS、ODS、CSV与TSV，支持切表、搜索筛选、坐标检查和显式链接导航。

> **核心亮点**：整合成熟解析/网格库到dock文件查看协议，保偏移行列坐标、预览受限标记与安全文本/生命周期，减少外开表格切换。详见[Q02](#research-q02)。

> **风险与缺陷**：只读和同源不等授权隔离，允许工作区外绝对路径；20MiB/5000行256列不限制全书主线程解析，显示字符串排序也非数值计算。详见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 适合什么表格工作，合格交付与替代办法是什么？](#detail-section-11)
  - [Q02 · 宿主读取与dock扩展如何组成查看流程？](#detail-section-12)
  - [Q03 · 同源、绝对路径与只读分别保证到哪？](#detail-section-13)
  - [Q04 · 预览性能、语义与交互实现有什么取舍？](#detail-section-14)
  - [Q05 · 安装和三阶段成本有哪些硬条件？](#detail-section-15)
  - [Q06 · 推荐条件与下一步探索方向是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合在DSH dock-files工作流查看本地XLSX/XLS/ODS/CSV/TSV数据、按当前工作表查找/筛选并引用单元格坐标的用户。基线下载/另开桌面电子表格，或文本预览CSV；这里把同文件只读网格嵌回dock，不需上传第三方服务。

合格交付是保留实际行列坐标、明确预览范围和格式化/缓存文本，切表/筛选/选择时不把视图顺序误作原坐标。不是编辑、保存、协同或公式/宏计算引擎，不复刻颜色/合并/图表/打印版式；用于财务验算或最新公式结果时应回到有计算与来源核验的工具。作者29项真实容器浏览器检查是作者报告，本轮仅检查代码和测试设计。

另开桌面表格/CSV文本预览；本项交付同文件只读网格，不改变验算或编辑结果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 五格式查看 | 同屏表格网格 | 无公式/宏/样式重算 |
| 搜索筛选/排序 | 当前表预览数据 | 文本排序，非整书搜索 |
| 坐标/范围 | 引用原行列 | 每表5000行256列投影 |
| 原字节读取 | 本地文件到浏览器 | 工作区外路径/Host信任需明确 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=20、DSH Web、webServer/webRuntime | 读取路由 | 应是可信可控Host |
| dock-base>=0.2/dock-files>=0.1顶层启用 | viewer注册/文件seed | 仅下载peer不等挂载 |
| 平台React18/Cordis契约与预构建lib | 网格UI/生命周期 | 可选peer不保证兼容所有版本 |
| UTF-8 CSV/TSV，支持格式/绝对路径 | 数据入口 | 不猜编码/不计算公式 |



#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | base/files/viewer依次顶层安装重启 | 包可解析、契约匹配 |
| 选择文件 | dock-files打开支持格式 | 确认目标绝对路径/权限 |
| 查看 | 切表/筛选/选坐标 | 注意字符串排序/缓存值/预览受限 |
| 链接导航 | 需要时Ctrl/Meta点击 | 目的站另审查 |
| 退出升级 | 销毁table/abort fetch/样式计数 | 升级重新核三方契约/原坐标 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 三插件包、内联解析/网格bundle、Host读取权限 | 配置可信Host/顶层加载/格式样例 | 实际安装时间/包传输费用未知 |
| 持续使用 | Host整文件与浏览器完整解析/网格内存CPU | 辨缓存/截断与排序语义，核敏感路径 | 无直接LLM/外传解析API不等总会话费用0；大书资源未知 |
| 失败恢复 | abort网络/重载/重新读文件与重建table | 查编码/权限/契约、回滚固定版本 | 同步解析不能即时cancel，恢复耗时未知 |



#### 效果

| 目标 | 已实现增量 | 边界 |
| --- | --- | --- |
| 同屏预览 | 五格式网格/搜索/切表 | 不是完整电子表格应用 |
| 坐标可引用 | 偏移列字母/rowLabel保留 | 只投影预览范围 |
| 降低第三方上传 | 同源原字节/本地浏览器解析 | Host跨工作区读/显式链接另有边界 |

MIT v0.1.0，Git/lib可消费，不需安装时postinstall构建；开发改变src需重建同步。

> **思考**：只读和同源不等授权隔离，允许工作区外绝对路径；20MiB/5000行256列不限制全书主线程解析，显示字符串排序也非数值计算。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：整合成熟解析/网格库到dock文件查看协议，保偏移行列坐标、预览受限标记与安全文本/生命周期，减少外开表格切换。详见[Q02](#research-q02)。

整合成熟解析/网格库到dock文件查看协议，保偏移行列坐标、预览受限标记与安全文本/生命周期，减少外开表格切换。详见[Q02](#research-q02)。

5000行/256列限制在完整parseWorkbook之后gridSheet投影；XLSX压缩文件上限20MiB不等解压/整书内存或解析时间上限。解析/CSV转换同步跑主线程，AbortController只取消网络，不能中断已开始同步解析；虚拟滚动减少DOM，不减少前置全书解析。工作表数也未限，恶意复杂文件不能仅靠预览上限判安全。

gridSheet raw=false取格式化/缓存显示值再转字符串，列sorter固定string。数值/日期排序因此是显示文本词典序，非数值/时间语义；搜索只作用当前已预览表，不能说完整工作簿搜索。第一行保数据不猜表头，偏移坐标被保留，truncated明确展示，是可借鉴处；公式不会被插件重算，缓存过期仍可能显示旧值。

表未初始化时保留termRef并tableBuilt补用，清列筛选会clearHeaderFilter，切表销毁旧table/清选中，虚拟DOM回收去border但保检查值，style引用计数清理。文本节点/React文本避免工作簿HTML成markup；链接仅http(s)/www自动识别、Ctrl/Meta点击明确打开且noopener/noreferrer，不代表链接目的站安全或不发生外部请求。作者测试覆盖解析/偏移、React+Tabulator和请求拒绝路径，但没有理由把其通过数当全恶意文件安全证明。

<a id="detail-section-5"></a>

### 1.4 主要限制

只读和同源不等授权隔离，允许工作区外绝对路径；20MiB/5000行256列不限制全书主线程解析，显示字符串排序也非数值计算。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可信私有Host普通文件可试用，先核三方加载/路径权限、缓存与字符串排序；公开Host/恶意大书/验算不宜直接依赖。详见[Q06](#research-q06)。

合格交付是保留实际行列坐标、明确预览范围和格式化/缓存文本，切表/筛选/选择时不把视图顺序误作原坐标。不是编辑、保存、协同或公式/宏计算引擎，不复刻颜色/合并/图表/打印版式；用于财务验算或最新公式结果时应回到有计算与来源核验的工具。作者29项真实容器浏览器检查是作者报告，本轮仅检查代码和测试设计。

采用建议：可信私有Host普通文件可试用，先核三方加载/路径权限、缓存与字符串排序；公开Host/恶意大书/验算不宜直接依赖。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。集成与坐标/文本细节清晰，宿主授权/主线程解析和显示语义需保持边界。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/client/index.ts、src/client/contract.ts、src/client/workbook.ts、src/client/SpreadsheetView.tsx、src/client/links.ts、lib/index.js、lib/client.js、tsdown.config.mjs、tests/spreadsheet.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整Host、workbook/links/UI/register、type-only契约开头、built关键对应与作者测试设计；未全审第三方内置解析库，不运行测试/浏览器/宿主/真实文件。
- 下一步：可继续合成文件身份/授权/增长与多表压缩预算矩阵，比较坐标、排序语义与取消资源，不用真实秘密文件。

**分析版本**

- **仓库**：[AKS1st/dock-spreadsheet](https://github.com/AKS1st/dock-spreadsheet)
- **版本号**：0.1.0（[固定提交 8ad1eea](https://github.com/AKS1st/dock-spreadsheet/tree/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7)）
- **版本日期**：2026-10-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索授权文件快照、有限读取/Worker解析预算与明确缓存/排序口径的预览收据，以资源和坐标语义共同证伪；未实现。详见[Q06](#research-q06)。

可继续合成文件身份/授权/增长与多表压缩预算矩阵，比较坐标、排序语义与取消资源，不用真实秘密文件。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 265 | — | — | 4733 |
| .js | source | 2 | 43324 | 43169 | 284 | — |
| .mjs | source | 2 | 19 | 19 | 1 | — |
| .ts | source | 6 | 635 | 406 | 190 | — |
| .tsx | source | 1 | 229 | 198 | 21 | — |
| .mjs | test | 3 | 355 | 305 | 36 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dock-spreadsheet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dock-spreadsheet/issues?q=is%3Aissue+created%3A2026-09-22T10%3A02%3A59.944Z..2026-10-22T10%3A02%3A59.944Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dock-spreadsheet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T10%3A02%3A59.944Z..2026-10-22T10%3A02%3A59.944Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核五格式只读贡献、三方viewer契约、路径/身份与解析预算、坐标/排序语义、成本及可证伪预览方案。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适合什么表格工作，合格交付与替代办法是什么？

**研究主题**：场景与需求

#### 完整回答

适合在DSH dock-files工作流查看本地XLSX/XLS/ODS/CSV/TSV数据、按当前工作表查找/筛选并引用单元格坐标的用户。基线下载/另开桌面电子表格，或文本预览CSV；这里把同文件只读网格嵌回dock，不需上传第三方服务。

合格交付是保留实际行列坐标、明确预览范围和格式化/缓存文本，切表/筛选/选择时不把视图顺序误作原坐标。不是编辑、保存、协同或公式/宏计算引擎，不复刻颜色/合并/图表/打印版式；用于财务验算或最新公式结果时应回到有计算与来源核验的工具。作者29项真实容器浏览器检查是作者报告，本轮仅检查代码和测试设计。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/workbook.ts:26-46](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/client/workbook.ts#L26-L46)

坐标/范围和字符串数据。

<details>
<summary>查看原文（21行）</summary>

```text
/** Preserve spreadsheet coordinates: first row is data, never inferred headers. */
export function gridSheet(book: WorkBook, name: string): GridSheet {
  const sheet = book.Sheets[name]
  if (!sheet) throw new Error('工作表不存在')
  const reference = sheet['!ref']
  if (!reference) return { name, columns: [], rows: [], truncated: false }
  const range = utils.decode_range(reference)
  const lastRow = Math.min(range.e.r, range.s.r + MAX_ROWS - 1)
  const lastColumn = Math.min(range.e.c, range.s.c + MAX_COLUMNS - 1)
  const values = utils.sheet_to_json<(string | number | boolean | null)[]>(sheet, {
    header: 1, defval: '', raw: false,
    range: { s: range.s, e: { r: lastRow, c: lastColumn } },
  })
  const columns = Array.from({ length: lastColumn - range.s.c + 1 }, (_, index) => utils.encode_col(range.s.c + index))
  const rows = values.map((valuesRow, index) => {
    const row: Record<string, string | number> = { rowLabel: range.s.r + index + 1 }
    columns.forEach((_, column) => { row[`c${column}`] = String(valuesRow?.[column] ?? '') })
    return row
  })
  return { name, columns, rows, truncated: range.e.r > lastRow || range.e.c > lastColumn }
}
```

</details>

**依据 2 · 源码核查**：[src/client/SpreadsheetView.tsx:151-164](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/client/SpreadsheetView.tsx#L151-L164)

选择使用原rowLabel。

<details>
<summary>查看原文（14行）</summary>

```text
    table.on('cellClick', (_event, cell) => {
      const field = cell.getColumn().getField()
      if (!field?.startsWith('c')) return
      const index = Number(field.slice(1))
      const letter = sheet.columns[index]
      if (letter === undefined) return
      selectedElementRef.current?.classList.remove('ds-selected-cell')
      const cellElement = cell.getElement()
      cellElement.classList.add('ds-selected-cell')
      selectedElementRef.current = cellElement
      const row = cell.getRow().getData() as Record<string, unknown>
      setSelected({ address: `${letter}${row.rowLabel}`, value: String(cell.getValue() ?? '') })
    })
    return () => { tableRef.current = null; selectedElementRef.current = null; table.destroy() }
```

</details>

**依据 3 · 作者声明**：[README.md:7-9](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/README.md#L7-L9)

作者范围声明。

```text
**为 [dock-files](https://github.com/AKS1st/dock-files) 提供只读在线表格查看器。** 在 [dock](https://github.com/AKS1st/dock) 工作台内打开 XLSX、XLS、ODS、CSV 和 TSV 文件，无需将文件上传到外部服务。使用成熟的 [SheetJS CE](https://docs.sheetjs.com/)、[Papa Parse](https://www.papaparse.com/) 和 [Tabulator](https://tabulator.info/) 实现解析、虚拟滚动与交互；没有 CDN 运行时依赖。

> **范围声明：只读预览。** 本插件不编辑/保存文件，不计算公式或运行宏，也不复刻源文件的字体、颜色、合并单元格、图表或打印布局。
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主读取与dock扩展如何组成查看流程？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

Host注入webServer/webRuntime，effect注册/dock-spreadsheet前缀，只接受POST /read；requestPath限定JSON绝对路径和五类后缀，返回原始字节，不是模型工具或任意命令。client从seed.path发同源请求，AbortController在路径变化/卸载中止fetch，并检查aborted才写state；不自动监听磁盘更新。

client注入workbench/files，注册无独立入口的元信息、扩展名viewer和spreadsheet editor view。依赖顶层dock-base与dock-files真正挂载；package可选peer不等运行可省。拷贝的contract仅type import，运行协作走ctx.get注册，不值导入另一个插件bundle。

SheetJS负责Excel/ODS、Papa负责严格UTF-8 CSV/TSV，Tabulator负责虚拟网格/交互；原创新增主要是多格式在dock协议的只读组合、偏移坐标与生命周期/安全文本细节，不将成熟库能力归为新解析算法。两端lib关键路径与src相符，构建内联依赖/CSS，平台React外置，无运行CDN。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:48-92](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/index.ts#L48-L92)

Host路径/读取路由。

<details>
<summary>查看原文（45行）</summary>

```text
async function requestPath(req: IncomingMessage): Promise<string> {
  let body = ''
  for await (const chunk of req) {
    body += Buffer.from(chunk).toString('utf8')
    if (Buffer.byteLength(body) > MAX_REQUEST_BYTES) throw new ReadError(413, 'too-large', 'request too large')
  }
  let path: unknown
  try { path = (JSON.parse(body) as { path?: unknown }).path } catch { throw new ReadError(400, 'bad-request', 'invalid JSON request') }
  if (typeof path !== 'string' || !isAbsolute(path) || !EXTENSIONS.has(extname(path).toLowerCase())) {
    throw new ReadError(400, 'bad-request', 'absolute spreadsheet path required')
  }
  return resolve(path)
}

export async function readSpreadsheet(path: string): Promise<Buffer> {
  const file = await open(path, 'r')
  try {
    const info = await file.stat()
    if (!info.isFile()) throw new ReadError(400, 'bad-request', 'not a regular file')
    if (info.size > MAX_FILE_BYTES) throw new ReadError(413, 'too-large', 'spreadsheet exceeds 20 MiB limit')
    const bytes = await file.readFile()
    if (bytes.length > MAX_FILE_BYTES) throw new ReadError(413, 'too-large', 'spreadsheet exceeds 20 MiB limit')
    return bytes
  } finally { await file.close() }
}

export function apply(ctx: Context): void {
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix', path: '/dock-spreadsheet',
    handler: async (req, res) => {
      if (!trusted(req, ctx.webRuntime.trustedHosts)) return fail(res, 403, 'forbidden', 'forbidden')
      if (req.method !== 'POST' || new URL(req.url ?? '/', 'http://dsh.internal').pathname !== '/dock-spreadsheet/read') {
        return fail(res, 404, 'not-found', 'unknown route')
      }
      try {
        const path = await requestPath(req)
        const bytes = await readSpreadsheet(path)
        res.writeHead(200, { 'content-type': 'application/octet-stream', 'content-length': bytes.length, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' })
        res.end(bytes)
      } catch (cause) {
        if (cause instanceof ReadError) fail(res, cause.status, cause.code, cause.message)
        else fail(res, 400, 'fs-error', cause instanceof Error ? cause.message : 'read failed')
      }
    },
  }), 'dock-spreadsheet: read route')
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:5-24](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/client/index.ts#L5-L24)

三类注册。

<details>
<summary>查看原文（20行）</summary>

```text
export const inject = ['workbench', 'files']
interface FilesService {
  registerFileViewer(def: { id: string; exts: string[]; icon?: { color?: string; path?: string; viewBox?: string } }): () => void
}
export function apply(ctx: WorkbenchContext): void {
  const workbench = ctx.get<WorkbenchService>('workbench')
  const files = ctx.get<FilesService>('files')
  if (!workbench || !files) return
  ctx.effect(() => workbench.registerPlugin({
    id: 'dock-spreadsheet', title: 'Spreadsheet',
    description: 'Read-only spreadsheet viewer for dock-files', hasEntry: false,
  }), 'dock-spreadsheet: metadata')
  ctx.effect(() => files.registerFileViewer({
    id: 'spreadsheet', exts: ['xlsx', 'xls', 'ods', 'csv', 'tsv'],
    icon: { color: '#398663' },
  }), 'dock-spreadsheet: file viewer')
  ctx.effect(() => workbench.registerEditorView({
    id: 'spreadsheet', title: 'Spreadsheet', order: 130, component: SpreadsheetView,
  }), 'dock-spreadsheet: view')
}
```

</details>

**依据 3 · 源码核查**：[src/client/SpreadsheetView.tsx:98-123](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/client/SpreadsheetView.tsx#L98-L123)

获取/abort/状态。

<details>
<summary>查看原文（26行）</summary>

```text
  useEffect(mountStyles, [])
  useEffect(() => {
    setBook(null); setSheetName(''); setQuery(''); setError(''); setFiltersVisible(false); setSelected(null); setVisibleRows(0)
    if (!path) { setError('未指定表格文件'); return }
    const controller = new AbortController()
    setLoading(true)
    void (async () => {
      try {
        const response = await fetch('/dock-spreadsheet/read', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ path }), signal: controller.signal,
        })
        if (!response.ok) {
          const result = await response.json() as ReadError
          throw new Error(result.error?.message ?? `读取失败 (${response.status})`)
        }
        const parsed = parseWorkbook(await response.arrayBuffer(), path)
        if (controller.signal.aborted) return
        setBook(parsed)
        setSheetName(parsed.SheetNames[0] ?? '')
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : String(cause))
      } finally { if (!controller.signal.aborted) setLoading(false) }
    })()
    return () => controller.abort()
  }, [path])
```

</details>

**依据 4 · 源码核查**：[src/client/contract.ts:1-21](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/client/contract.ts#L1-L21)

type-only契约。

<details>
<summary>查看原文（21行）</summary>

```text
/**
 * Vendored copy of the dock workbench contract (AKS1st/dock, src/client/contract.ts).
 *
 * This plugin imports the contract types type-only; the file is copied here so
 * the repo builds standalone without a package dependency on the dock base
 * (`dock` is not published to npm; `link:` devDependencies would break clean
 * clones). Keep this file in sync with the upstream contract when it changes.
 */
/**
 * Public contract of the dock base (client side).
 *
 * Feature plugins consume this contract via type-only import
 * (`import type {} from './contract.ts'`), which also pulls
 * in the `Context.workbench` augmentation below — the single restatement
 * point, so plugins never re-declare the service on their own (purity gate
 * friendly: type-only imports are erased at build time).
 *
 * Runtime collaboration happens exclusively through `ctx.workbench` method
 * calls; value-importing another plugin's bundle is forbidden by the
 * client-bundle purity convention.
 */
```

</details>

**依据 5 · 源码核查**：[tsdown.config.mjs:1-16](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/tsdown.config.mjs#L1-L16)

库打包/平台外置。

<details>
<summary>查看原文（16行）</summary>

```text
const id = 'dock-spreadsheet'
const external = ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', 'cordis', '@deepseek-ai/dsh-client-ui-slots', '@deepseek-ai/dsh-client-web-react', '@deepseek-ai/dsh-client-ui-primitives', '@deepseek-ai/dsh-client-runtime/client']
export default [{
  entry: ['src/index.ts'], outDir: 'lib', format: ['esm'], platform: 'node',
  target: 'es2022', fixedExtension: false, dts: false, clean: false,
}, {
  entry: { client: 'src/client/index.ts' }, outDir: 'lib', format: 'cjs',
  platform: 'browser', target: 'es2022', dts: false, sourcemap: true,
  clean: false, deps: { onlyBundle: ['xlsx', 'tabulator-tables', 'papaparse'], alwaysBundle: ['xlsx', 'tabulator-tables', 'papaparse'], neverBundle: external },
  outputOptions: {
    entryFileNames: 'client.js',
    banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(id)}, factory: (require) => {`,
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
}]
```

</details>

**依据 6 · 源码核查**：[lib/index.js:79-104](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/lib/index.js#L79-L104)

分发读取路径一致。

<details>
<summary>查看原文（26行）</summary>

```text
async function readSpreadsheet(path) {
	const file = await open(path, "r");
	try {
		const info = await file.stat();
		if (!info.isFile()) throw new ReadError(400, "bad-request", "not a regular file");
		if (info.size > 20971520) throw new ReadError(413, "too-large", "spreadsheet exceeds 20 MiB limit");
		const bytes = await file.readFile();
		if (bytes.length > 20971520) throw new ReadError(413, "too-large", "spreadsheet exceeds 20 MiB limit");
		return bytes;
	} finally {
		await file.close();
	}
}
function apply(ctx) {
	ctx.effect(() => ctx.webServer.register({
		kind: "prefix",
		path: "/dock-spreadsheet",
		handler: async (req, res) => {
			if (!trusted(req, ctx.webRuntime.trustedHosts)) return fail(res, 403, "forbidden", "forbidden");
			if (req.method !== "POST" || new URL(req.url ?? "/", "http://dsh.internal").pathname !== "/dock-spreadsheet/read") return fail(res, 404, "not-found", "unknown route");
			try {
				const bytes = await readSpreadsheet(await requestPath(req));
				res.writeHead(200, {
					"content-type": "application/octet-stream",
					"content-length": bytes.length,
					"cache-control": "no-store",
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 同源、绝对路径与只读分别保证到哪？

**研究主题**：缺陷与关键质疑

#### 完整回答

trusted检查Host为loopback或trustedHosts、拒绝Sec-Fetch-Site=cross-site，Origin存在时只比较host；Origin缺失仍可通过。它不核socket对端地址、不在插件路由校验登录/会话/目标授权，Host字符串与浏览器来源约束不能单独充当身份认证。实际外围DSH是否先做登录/访问隔离需核宿主，不能把静态缺口说成已部署未授权读取。

允许任意满足后缀的宿主绝对路径，明确不约束工作区；open('r')会跟随符号链接，fstat核的是打开对象为普通文件，后缀不是内容/信任鉴别。对原文件不写是实际性质，但服务用户能读的表格/伪装后缀文件可能出现在客户端；保密环境须先明确信任边界。

文件大小先fstat再readFile再检查bytes.length，拒绝通常大于20MiB文件并finally关闭，但文件在stat后增长时完整readFile仍先分配，后检查不是严格读取内存预算。请求体8KiB上限也是拼接chunk后检查，非请求耗时/并发总量限制。fs-error返回Error.message可能带路径。不提供文件保存API，并不能推论读取/解析无资源或信息暴露风险。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:21-40](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/index.ts#L21-L40)

头部来源检查非身份/对端鉴别。

<details>
<summary>查看原文（20行）</summary>

```text
function trusted(req: IncomingMessage, trustedHosts: readonly string[]): boolean {
  const host = req.headers.host
  if (!host || req.headers['sec-fetch-site'] === 'cross-site') return false
  let target: URL
  try { target = new URL(`http://${host}`) } catch { return false }
  const octets = target.hostname.split('.')
  const loopback = target.hostname === 'localhost' || target.hostname === '[::1]'
    || (octets.length === 4 && octets[0] === '127'
      && octets.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255))
  const allowed = trustedHosts.some((entry) => {
    try {
      const configured = new URL(`http://${entry}`)
      return configured.host === target.host || (!configured.port && configured.hostname === target.hostname)
    } catch { return false }
  })
  if (!loopback && !allowed) return false
  if (typeof req.headers.origin === 'string') {
    try { if (new URL(req.headers.origin).host !== target.host) return false } catch { return false }
  }
  return true
```

</details>

**依据 2 · 源码核查**：[src/index.ts:48-71](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/index.ts#L48-L71)

后缀/跟随链接/先读后检。

<details>
<summary>查看原文（24行）</summary>

```text
async function requestPath(req: IncomingMessage): Promise<string> {
  let body = ''
  for await (const chunk of req) {
    body += Buffer.from(chunk).toString('utf8')
    if (Buffer.byteLength(body) > MAX_REQUEST_BYTES) throw new ReadError(413, 'too-large', 'request too large')
  }
  let path: unknown
  try { path = (JSON.parse(body) as { path?: unknown }).path } catch { throw new ReadError(400, 'bad-request', 'invalid JSON request') }
  if (typeof path !== 'string' || !isAbsolute(path) || !EXTENSIONS.has(extname(path).toLowerCase())) {
    throw new ReadError(400, 'bad-request', 'absolute spreadsheet path required')
  }
  return resolve(path)
}

export async function readSpreadsheet(path: string): Promise<Buffer> {
  const file = await open(path, 'r')
  try {
    const info = await file.stat()
    if (!info.isFile()) throw new ReadError(400, 'bad-request', 'not a regular file')
    if (info.size > MAX_FILE_BYTES) throw new ReadError(413, 'too-large', 'spreadsheet exceeds 20 MiB limit')
    const bytes = await file.readFile()
    if (bytes.length > MAX_FILE_BYTES) throw new ReadError(413, 'too-large', 'spreadsheet exceeds 20 MiB limit')
    return bytes
  } finally { await file.close() }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:82-89](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/index.ts#L82-L89)

字节返回与fs错误。

```text
      try {
        const path = await requestPath(req)
        const bytes = await readSpreadsheet(path)
        res.writeHead(200, { 'content-type': 'application/octet-stream', 'content-length': bytes.length, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' })
        res.end(bytes)
      } catch (cause) {
        if (cause instanceof ReadError) fail(res, cause.status, cause.code, cause.message)
        else fail(res, 400, 'fs-error', cause instanceof Error ? cause.message : 'read failed')
```

#### 缺口

- 实际DSH外围鉴权、监听范围和代理头策略未在本组件内确定。
  **影响**：不能保证公开Host安全，也不能声称已复现越权。
  **进一步探讨**：按部署固定宿主版本核路由前认证/隔离，使用合成文件和无秘密请求矩阵。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 预览性能、语义与交互实现有什么取舍？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

5000行/256列限制在完整parseWorkbook之后gridSheet投影；XLSX压缩文件上限20MiB不等解压/整书内存或解析时间上限。解析/CSV转换同步跑主线程，AbortController只取消网络，不能中断已开始同步解析；虚拟滚动减少DOM，不减少前置全书解析。工作表数也未限，恶意复杂文件不能仅靠预览上限判安全。

gridSheet raw=false取格式化/缓存显示值再转字符串，列sorter固定string。数值/日期排序因此是显示文本词典序，非数值/时间语义；搜索只作用当前已预览表，不能说完整工作簿搜索。第一行保数据不猜表头，偏移坐标被保留，truncated明确展示，是可借鉴处；公式不会被插件重算，缓存过期仍可能显示旧值。

表未初始化时保留termRef并tableBuilt补用，清列筛选会clearHeaderFilter，切表销毁旧table/清选中，虚拟DOM回收去border但保检查值，style引用计数清理。文本节点/React文本避免工作簿HTML成markup；链接仅http(s)/www自动识别、Ctrl/Meta点击明确打开且noopener/noreferrer，不代表链接目的站安全或不发生外部请求。作者测试覆盖解析/偏移、React+Tabulator和请求拒绝路径，但没有理由把其通过数当全恶意文件安全证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/workbook.ts:13-45](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/client/workbook.ts#L13-L45)

全解析后投影/显示字符串。

<details>
<summary>查看原文（33行）</summary>

```text
export function parseWorkbook(bytes: ArrayBuffer | Uint8Array, filename = ''): WorkBook {
  if (/\.(?:csv|tsv)$/i.test(filename)) {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes).replace(/^\uFEFF/, '')
    const delimiter = /\.tsv$/i.test(filename) ? '\t' : ','
    const parsed = Papa.parse<string[]>(text, { delimiter, skipEmptyLines: false })
    if (parsed.errors.length) throw new Error(`分隔文本格式错误：${parsed.errors[0]?.message}`)
    const book = utils.book_new()
    utils.book_append_sheet(book, utils.aoa_to_sheet(parsed.data), 'Sheet1')
    return book
  }
  return read(bytes, { type: 'array', dense: true, cellText: true, cellDates: false })
}

/** Preserve spreadsheet coordinates: first row is data, never inferred headers. */
export function gridSheet(book: WorkBook, name: string): GridSheet {
  const sheet = book.Sheets[name]
  if (!sheet) throw new Error('工作表不存在')
  const reference = sheet['!ref']
  if (!reference) return { name, columns: [], rows: [], truncated: false }
  const range = utils.decode_range(reference)
  const lastRow = Math.min(range.e.r, range.s.r + MAX_ROWS - 1)
  const lastColumn = Math.min(range.e.c, range.s.c + MAX_COLUMNS - 1)
  const values = utils.sheet_to_json<(string | number | boolean | null)[]>(sheet, {
    header: 1, defval: '', raw: false,
    range: { s: range.s, e: { r: lastRow, c: lastColumn } },
  })
  const columns = Array.from({ length: lastColumn - range.s.c + 1 }, (_, index) => utils.encode_col(range.s.c + index))
  const rows = values.map((valuesRow, index) => {
    const row: Record<string, string | number> = { rowLabel: range.s.r + index + 1 }
    columns.forEach((_, column) => { row[`c${column}`] = String(valuesRow?.[column] ?? '') })
    return row
  })
  return { name, columns, rows, truncated: range.e.r > lastRow || range.e.c > lastColumn }
```

</details>

**依据 2 · 源码核查**：[src/client/SpreadsheetView.tsx:125-179](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/client/SpreadsheetView.tsx#L125-L179)

string排序/状态和销毁。

<details>
<summary>查看原文（55行）</summary>

```text
  useEffect(() => {
    const element = gridRef.current
    if (!element || !sheet || sheet.columns.length === 0) return
    selectedElementRef.current = null
    setSelected(null)
    setVisibleRows(sheet.rows.length)
    const columns: ColumnDefinition[] = [
      { title: '#', field: 'rowLabel', width: 65, frozen: true, hozAlign: 'right', headerSort: false },
      ...sheet.columns.map((letter, index) => ({
        title: letter, field: `c${index}`, minWidth: 110, width: 160,
        sorter: 'string' as const, headerFilter: 'input' as const, formatter: linkFormatter,
      })),
    ]
    const table = new Tabulator(element, {
      data: sheet.rows, columns, layout: 'fitData', height: '100%',
      placeholder: '工作表为空', movableColumns: false,
    })
    tableRef.current = table
    table.on('tableBuilt', () => applyTerm(table, termRef.current))
    table.on('dataFiltered', (_filters, rows) => setVisibleRows(rows.length))
    // Virtual scrolling can recycle a selected DOM cell for another row. Drop
    // only its border on redraw; the inspector keeps the last selected value.
    table.on('renderStarted', () => {
      selectedElementRef.current?.classList.remove('ds-selected-cell')
      selectedElementRef.current = null
    })
    table.on('cellClick', (_event, cell) => {
      const field = cell.getColumn().getField()
      if (!field?.startsWith('c')) return
      const index = Number(field.slice(1))
      const letter = sheet.columns[index]
      if (letter === undefined) return
      selectedElementRef.current?.classList.remove('ds-selected-cell')
      const cellElement = cell.getElement()
      cellElement.classList.add('ds-selected-cell')
      selectedElementRef.current = cellElement
      const row = cell.getRow().getData() as Record<string, unknown>
      setSelected({ address: `${letter}${row.rowLabel}`, value: String(cell.getValue() ?? '') })
    })
    return () => { tableRef.current = null; selectedElementRef.current = null; table.destroy() }
  }, [sheet])

  useEffect(() => {
    const table = tableRef.current
    if (!table || !isReady(table)) return
    if (!filtersVisible) table.clearHeaderFilter()
    table.redraw(true)
  }, [filtersVisible])

  useEffect(() => {
    const term = query.trim().toLocaleLowerCase()
    termRef.current = term
    const table = tableRef.current
    if (table) applyTerm(table, term)
  }, [query, sheet])
```

</details>

**依据 3 · 源码核查**：[src/client/SpreadsheetView.tsx:56-77](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/client/SpreadsheetView.tsx#L56-L77)

安全文本与显式导航。

<details>
<summary>查看原文（22行）</summary>

```text
function linkFormatter(cell: CellComponent): HTMLElement {
  const wrapper = document.createElement('span')
  wrapper.className = 'ds-cell'
  for (const segment of splitLinks(String(cell.getValue() ?? ''))) {
    if (segment.url === undefined) {
      wrapper.append(document.createTextNode(segment.text))
      continue
    }
    const anchor = document.createElement('a')
    anchor.className = 'ds-url'
    anchor.href = segment.url
    anchor.target = '_blank'
    anchor.rel = 'noopener noreferrer'
    anchor.textContent = segment.text
    anchor.title = `Ctrl/⌘+点击打开：${segment.url}`
    anchor.addEventListener('click', (event) => {
      event.preventDefault()
      if (event.ctrlKey || event.metaKey) window.open(anchor.href, '_blank', 'noopener,noreferrer')
    })
    wrapper.append(anchor)
  }
  return wrapper
```

</details>

**依据 4 · 源码核查**：[src/client/SpreadsheetView.tsx:207-226](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/client/SpreadsheetView.tsx#L207-L226)

标签键盘/预览范围。

<details>
<summary>查看原文（20行）</summary>

```text
      createElement('div', { className: 'ds-sheet-tabs', role: 'tablist', 'aria-label': '工作表' },
        ...(book?.SheetNames ?? []).map((name) => createElement('button', {
          key: name, type: 'button', role: 'tab', className: 'ds-sheet-tab', 'aria-selected': sheetName === name,
          tabIndex: sheetName === name ? 0 : -1, title: name, onClick: () => setSheetName(name),
          onKeyDown: (event: { key: string; preventDefault(): void; currentTarget: HTMLButtonElement }) => {
            const names = book?.SheetNames ?? []
            const index = names.indexOf(name)
            const next = event.key === 'ArrowRight' ? (index + 1) % names.length
              : event.key === 'ArrowLeft' ? (index - 1 + names.length) % names.length
                : event.key === 'Home' ? 0 : event.key === 'End' ? names.length - 1 : -1
            if (next < 0 || next === index) return
            event.preventDefault()
            const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('.ds-sheet-tab')
            buttons?.[next]?.focus()
            setSheetName(names[next] ?? name)
          },
        }, name)),
      ),
      sheet ? createElement('span', { className: 'ds-sheet-status', title: sheet.truncated ? `仅预览前 ${MAX_ROWS} 行 / ${MAX_COLUMNS} 列` : undefined },
        `${visibleRows} / ${sheet.rows.length} 行 · ${sheet.columns.length} 列${sheet.truncated ? ' · 预览受限' : ''}`) : null,
```

</details>

**依据 5 · 源码核查**：[src/client/links.ts:20-49](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/client/links.ts#L20-L49)

有限URL策略。

<details>
<summary>查看原文（30行）</summary>

```text
const CANDIDATE = /(?:https?:\/\/|www\.)[^\s<>"'`\\]+/gi
const TRAILING_PUNCTUATION = /[.,;:!?。，、；：！？]+$/
const BALANCED_PAIRS: readonly (readonly [string, string])[] = [['(', ')'], ['[', ']'], ['{', '}']]

function countOf(text: string, character: string): number {
  let total = 0
  for (const current of text) if (current === character) total += 1
  return total
}

/**
 * Strip trailing characters that belong to the surrounding sentence rather than
 * to the URL: sentence punctuation, and closing brackets that are unbalanced.
 * Balanced brackets stay, so `.../wiki/Foo_(bar)` keeps its parenthesis.
 */
function trimCandidate(candidate: string): string {
  let url = candidate.replace(TRAILING_PUNCTUATION, '')
  for (let guard = 0; guard < 8; guard += 1) {
    const last = url.at(-1)
    const pair = BALANCED_PAIRS.find(([, close]) => close === last)
    if (pair === undefined) break
    if (countOf(url, pair[0]) >= countOf(url, pair[1])) break
    url = url.slice(0, -1)
  }
  return url
}

/** The absolute URL a candidate opens as: `www.` gets an explicit https scheme. */
function absoluteUrl(candidate: string): string {
  return /^www\./i.test(candidate) ? `https://${candidate}` : candidate
```

</details>

**依据 6 · 源码核查**：[tests/spreadsheet.test.mjs:101-119](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/tests/spreadsheet.test.mjs#L101-L119)

作者请求测试范围。

<details>
<summary>查看原文（19行）</summary>

```text
test('host serves raw spreadsheet bytes and refuses cross-site requests', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'dock-spreadsheet-'))
  try {
    const path = join(dir, 'test.xlsx')
    const payload = write(workbook, { type: 'buffer', bookType: 'xlsx' })
    await writeFile(path, payload)
    assert.deepEqual(await readSpreadsheet(path), payload)
    const ok = await handle(path)
    assert.equal(ok.status, 200)
    assert.equal(ok.headers['content-type'], 'application/octet-stream')
    assert.equal(read(ok.body, { type: 'buffer' }).SheetNames.length, 2)
    assert.equal((await handle(path, { 'sec-fetch-site': 'cross-site' })).status, 403)
    assert.equal((await handle(join(dir, 'test.exe'))).status, 400)
    assert.equal((await handle('relative.xlsx')).status, 400)
    const oversized = join(dir, 'large.xlsx')
    await writeFile(oversized, Buffer.alloc(MAX_FILE_BYTES + 1))
    assert.equal((await handle(oversized)).status, 413)
  } finally { await rm(dir, { recursive: true, force: true }) }
})
```

</details>

#### 缺口

- 压缩展开/多表/长单元格的CPU和内存曲线、交互阻塞时间未知。
  **影响**：不能保证20MiB以内都流畅或可即时取消。
  **进一步探讨**：以无秘密受控规模工作簿比较解析与投影/DOM三阶段耗时内存，并设终止预算。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安装和三阶段成本有哪些硬条件？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=20、DSH Web、webServer/webRuntime | 读取路由 | 应是可信可控Host |
| dock-base>=0.2/dock-files>=0.1顶层启用 | viewer注册/文件seed | 仅下载peer不等挂载 |
| 平台React18/Cordis契约与预构建lib | 网格UI/生命周期 | 可选peer不保证兼容所有版本 |
| UTF-8 CSV/TSV，支持格式/绝对路径 | 数据入口 | 不猜编码/不计算公式 |

#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | base/files/viewer依次顶层安装重启 | 包可解析、契约匹配 |
| 选择文件 | dock-files打开支持格式 | 确认目标绝对路径/权限 |
| 查看 | 切表/筛选/选坐标 | 注意字符串排序/缓存值/预览受限 |
| 链接导航 | 需要时Ctrl/Meta点击 | 目的站另审查 |
| 退出升级 | 销毁table/abort fetch/样式计数 | 升级重新核三方契约/原坐标 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 三插件包、内联解析/网格bundle、Host读取权限 | 配置可信Host/顶层加载/格式样例 | 实际安装时间/包传输费用未知 |
| 持续使用 | Host整文件与浏览器完整解析/网格内存CPU | 辨缓存/截断与排序语义，核敏感路径 | 无直接LLM/外传解析API不等总会话费用0；大书资源未知 |
| 失败恢复 | abort网络/重载/重新读文件与重建table | 查编码/权限/契约、回滚固定版本 | 同步解析不能即时cancel，恢复耗时未知 |

#### 效果

| 目标 | 已实现增量 | 边界 |
| --- | --- | --- |
| 同屏预览 | 五格式网格/搜索/切表 | 不是完整电子表格应用 |
| 坐标可引用 | 偏移列字母/rowLabel保留 | 只投影预览范围 |
| 降低第三方上传 | 同源原字节/本地浏览器解析 | Host跨工作区读/显式链接另有边界 |

MIT v0.1.0，Git/lib可消费，不需安装时postinstall构建；开发改变src需重建同步。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:41-71](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/package.json#L41-L71)

依赖/构建与peer。

<details>
<summary>查看原文（31行）</summary>

```text
  },
  "license": "MIT",
  "engines": {
    "node": ">=20"
  },
  "peerDependencies": {
    "cordis": "^4.0.0-rc.7",
    "dock-base": ">=0.2.0",
    "dock-files": ">=0.1.0",
    "react": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "dock-base": {
      "optional": true
    },
    "dock-files": {
      "optional": true
    },
    "react": {
      "optional": true
    }
  },
  "devDependencies": {
    "papaparse": "^5.7.0",
    "tabulator-tables": "^6.3.1",
    "xlsx": "https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz",
    "@types/node": "^22.0.0",
    "@types/papaparse": "^5.5.2",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.3.7",
    "@types/tabulator-tables": "^6.3.6",
```

</details>

**依据 2 · 源码核查**：[tsdown.config.mjs:1-16](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/tsdown.config.mjs#L1-L16)

预构建内容。

<details>
<summary>查看原文（16行）</summary>

```text
const id = 'dock-spreadsheet'
const external = ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', 'cordis', '@deepseek-ai/dsh-client-ui-slots', '@deepseek-ai/dsh-client-web-react', '@deepseek-ai/dsh-client-ui-primitives', '@deepseek-ai/dsh-client-runtime/client']
export default [{
  entry: ['src/index.ts'], outDir: 'lib', format: ['esm'], platform: 'node',
  target: 'es2022', fixedExtension: false, dts: false, clean: false,
}, {
  entry: { client: 'src/client/index.ts' }, outDir: 'lib', format: 'cjs',
  platform: 'browser', target: 'es2022', dts: false, sourcemap: true,
  clean: false, deps: { onlyBundle: ['xlsx', 'tabulator-tables', 'papaparse'], alwaysBundle: ['xlsx', 'tabulator-tables', 'papaparse'], neverBundle: external },
  outputOptions: {
    entryFileNames: 'client.js',
    banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(id)}, factory: (require) => {`,
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
}]
```

</details>

**依据 3 · 源码核查**：[src/client/SpreadsheetView.tsx:15-22](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/client/SpreadsheetView.tsx#L15-L22)

样式生命周期。

```text
function mountStyles(): () => void {
  if (styleUsers++ === 0) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = tabulatorCss + viewerCss
    document.head.append(style)
  }
  return () => { if (--styleUsers === 0) document.getElementById(styleId)?.remove() }
```

**依据 4 · 源码核查**：[src/client/index.ts:5-24](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/client/index.ts#L5-L24)

加载服务条件。

<details>
<summary>查看原文（20行）</summary>

```text
export const inject = ['workbench', 'files']
interface FilesService {
  registerFileViewer(def: { id: string; exts: string[]; icon?: { color?: string; path?: string; viewBox?: string } }): () => void
}
export function apply(ctx: WorkbenchContext): void {
  const workbench = ctx.get<WorkbenchService>('workbench')
  const files = ctx.get<FilesService>('files')
  if (!workbench || !files) return
  ctx.effect(() => workbench.registerPlugin({
    id: 'dock-spreadsheet', title: 'Spreadsheet',
    description: 'Read-only spreadsheet viewer for dock-files', hasEntry: false,
  }), 'dock-spreadsheet: metadata')
  ctx.effect(() => files.registerFileViewer({
    id: 'spreadsheet', exts: ['xlsx', 'xls', 'ods', 'csv', 'tsv'],
    icon: { color: '#398663' },
  }), 'dock-spreadsheet: file viewer')
  ctx.effect(() => workbench.registerEditorView({
    id: 'spreadsheet', title: 'Spreadsheet', order: 130, component: SpreadsheetView,
  }), 'dock-spreadsheet: view')
}
```

</details>

#### 缺口

- 相比桌面表格应用的完成时间、坐标引用差错和大书资源没有独立对照。
  **影响**：不量化效率/费用收益。
  **进一步探讨**：固定五格式/偏移/缓存/截断任务，比较同屏与外部查看正确率/耗时。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 推荐条件与下一步探索方向是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

有条件试用，适合可信私有Host内的普通只读表格浏览；不适合公开/不可信宿主、恶意复杂文件或要求公式最新值/数值排序的验算工作。基础与files契约需同时核，边界并不因UI顺畅而消失。

核心质疑是文件读取/解析预算与路径授权不能从视图只读推出。可探索“有授权快照与解析预算的预览收据”，由宿主明确授权后返回固定文件身份/时间/范围，有限字节读取；浏览器Worker解析具超时/内存策略，UI显示缓存/截断/数据类型及排序口径，不把猜测类型静默当真值。

未实现。对照当前版和原型，合成外部路径/符号链接/源增长、多表压缩/大字符/坏编码、缓存公式和数值文本混列，记录授权拒绝、进程资源、取消后工作、坐标/排序正确性。反例是Worker复制增加内存、快照过期使用户误认实时数据、类型推断错误重排标识符。若预算后仍持续解析/越界读取，或改善流畅却损失正确坐标/显示语义，假设被反证。授权与性能分别验收，不把未来方案算现有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:62-71](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/index.ts#L62-L71)

文件身份/预算推导。

<details>
<summary>查看原文（10行）</summary>

```text
export async function readSpreadsheet(path: string): Promise<Buffer> {
  const file = await open(path, 'r')
  try {
    const info = await file.stat()
    if (!info.isFile()) throw new ReadError(400, 'bad-request', 'not a regular file')
    if (info.size > MAX_FILE_BYTES) throw new ReadError(413, 'too-large', 'spreadsheet exceeds 20 MiB limit')
    const bytes = await file.readFile()
    if (bytes.length > MAX_FILE_BYTES) throw new ReadError(413, 'too-large', 'spreadsheet exceeds 20 MiB limit')
    return bytes
  } finally { await file.close() }
```

</details>

**依据 2 · 源码核查**：[src/client/workbook.ts:13-45](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/client/workbook.ts#L13-L45)

解析/语义推导。

<details>
<summary>查看原文（33行）</summary>

```text
export function parseWorkbook(bytes: ArrayBuffer | Uint8Array, filename = ''): WorkBook {
  if (/\.(?:csv|tsv)$/i.test(filename)) {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes).replace(/^\uFEFF/, '')
    const delimiter = /\.tsv$/i.test(filename) ? '\t' : ','
    const parsed = Papa.parse<string[]>(text, { delimiter, skipEmptyLines: false })
    if (parsed.errors.length) throw new Error(`分隔文本格式错误：${parsed.errors[0]?.message}`)
    const book = utils.book_new()
    utils.book_append_sheet(book, utils.aoa_to_sheet(parsed.data), 'Sheet1')
    return book
  }
  return read(bytes, { type: 'array', dense: true, cellText: true, cellDates: false })
}

/** Preserve spreadsheet coordinates: first row is data, never inferred headers. */
export function gridSheet(book: WorkBook, name: string): GridSheet {
  const sheet = book.Sheets[name]
  if (!sheet) throw new Error('工作表不存在')
  const reference = sheet['!ref']
  if (!reference) return { name, columns: [], rows: [], truncated: false }
  const range = utils.decode_range(reference)
  const lastRow = Math.min(range.e.r, range.s.r + MAX_ROWS - 1)
  const lastColumn = Math.min(range.e.c, range.s.c + MAX_COLUMNS - 1)
  const values = utils.sheet_to_json<(string | number | boolean | null)[]>(sheet, {
    header: 1, defval: '', raw: false,
    range: { s: range.s, e: { r: lastRow, c: lastColumn } },
  })
  const columns = Array.from({ length: lastColumn - range.s.c + 1 }, (_, index) => utils.encode_col(range.s.c + index))
  const rows = values.map((valuesRow, index) => {
    const row: Record<string, string | number> = { rowLabel: range.s.r + index + 1 }
    columns.forEach((_, column) => { row[`c${column}`] = String(valuesRow?.[column] ?? '') })
    return row
  })
  return { name, columns, rows, truncated: range.e.r > lastRow || range.e.c > lastColumn }
```

</details>

**依据 3 · 源码核查**：[src/client/SpreadsheetView.tsx:106-122](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/client/SpreadsheetView.tsx#L106-L122)

网络abort边界推导。

<details>
<summary>查看原文（17行）</summary>

```text
        const response = await fetch('/dock-spreadsheet/read', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ path }), signal: controller.signal,
        })
        if (!response.ok) {
          const result = await response.json() as ReadError
          throw new Error(result.error?.message ?? `读取失败 (${response.status})`)
        }
        const parsed = parseWorkbook(await response.arrayBuffer(), path)
        if (controller.signal.aborted) return
        setBook(parsed)
        setSheetName(parsed.SheetNames[0] ?? '')
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : String(cause))
      } finally { if (!controller.signal.aborted) setLoading(false) }
    })()
    return () => controller.abort()
```

</details>

#### 缺口

- 授权快照/Worker预算和显式类型排序未实现。
  **影响**：不是现有隔离或性能保证。
  **进一步探讨**：最小原型以合成矩阵比较资源上界与语义正确率。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
