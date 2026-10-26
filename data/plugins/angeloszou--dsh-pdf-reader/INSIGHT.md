# DSH PDF Reader

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[ffecd36](https://github.com/AngelosZou/dsh-pdf-reader/tree/ffecd361b7f2803fdccd1cf92149aad3e11a3271)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AngelosZou/dsh-pdf-reader) [![npm 30d 722](https://img.shields.io/static/v1?label=npm+30d&message=722&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-pdf-reader) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-pdf-reader)
<!-- END META -->

> **实现功能**：提供PDF内容扫描、单页文本与图像混合读取，以及区域渲染工具。

> **核心亮点**：以内容画像选择文本或区域渲染，将PyMuPDF能力组织成扫描、混读和精读工具；贡献在适配与路由，不是新的PDF解析算法。[Q03](#research-q03)

> **风险与缺陷**：缓存名缺少完整bbox、DPI与源路径，同起点区域或同名PDF可发生路径重合；尚未运行复现其读图影响。[Q04](#research-q04)

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
  - [Q01 · 哪些PDF任务适用，合格交付是什么？](#detail-section-11)
  - [Q02 · 文本与图像路由如何实现？](#detail-section-12)
  - [Q03 · 相对直接提取或整页截图有什么增量？](#detail-section-13)
  - [Q04 · 最影响完整读图主张的限制是什么？](#detail-section-14)
  - [Q05 · 如何启动，依赖失效怎样处理？](#detail-section-15)
  - [Q06 · 合格任务的成本与效果支持到哪里？](#detail-section-16)
  - [Q07 · 哪些设计可复用，哪些可靠性边界需要注意？](#detail-section-17)
  - [Q08 · 由缓存和预算限制推导什么设计假设？](#detail-section-18)
  - [Q09 · 什么人适合试用，应如何验收？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合在DSH中阅读含图表、公式与双栏布局的论文，输出需人工核对原页。

比较基线为直接PyMuPDF文本提取加手工截图，以及整页截图。未做同模型效果排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

|能力|主要用途|使用条件与边界|
|---|---|---|
|pdf_scan|按页识别文本和图形候选|启发式，不保证完整|
|pdf_read_page|文本与区域图混读|需后续read_image消费图片|
|pdf_render_region|局部精读|人工/模型选bbox，缓存需核对|

#### 启动与依赖

|依赖或条件|是否必需|用途|缺失或不满足时|
|---|---|---|---|
|Node>=20、Cordis服务|启动必需|注册工具及启动进程|无法加载|
|Python+pymupdf|操作必需|解析与渲染|返回安装提示|
|pymupdf4llm|可选|Markdown补充|仍可提取文本|
|支持read_image的模型工具|读图必需|消费PNG|仅得到本地路径|

#### 启动步骤

|步骤|执行者与动作|成功判据或失败处理|
|---|---|---|
|准备|用户加载插件并准备Python库|缺库按warning处理|
|扫描|模型调用pdf_scan|得到页内容画像|
|读取|模型mixed读取后read_image|核对原页和区域路径|
|验收|用户检查数值与公式|不清楚则显式裁剪重读|

#### 成本

|阶段|现金与资源成本|人工与时间投入|已知条件与未知项|
|---|---|---|---|
|首次使用|Python库与本地存储，金额未知|配置解释器与加载插件，耗时未知|需要pymupdf|
|持续使用|解析、PNG及模型图像，金额未知|核对图表数字与页码，耗时未知|多区域没有任务级预算|
|失败恢复|重新渲染与模型重读，金额未知|检查同名文件及缓存，耗时未知|缓存键可能重合|

#### 效果

|效果项|当前证据支持|尚不能确定|
|---|---|---|
|布局材料|源码同时提取文本和生成区域图|模型理解正确率|
|预算|每区域按面积求DPI|总任务token与节省|
|完整性|扫描图形、表格与字体|启发式漏检率|

> **思考**：缓存名缺少完整bbox、DPI与源路径，同起点区域或同名PDF可发生路径重合；尚未运行复现其读图影响。[Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：以内容画像选择文本或区域渲染，将PyMuPDF能力组织成扫描、混读和精读工具；贡献在适配与路由，不是新的PDF解析算法。[Q03](#research-q03)

以内容画像选择文本或区域渲染，将PyMuPDF能力组织成扫描、混读和精读工具；贡献在适配与路由，不是新的PDF解析算法。[Q03](#research-q03)

可复用的是无shell argv、UTF-8输出、AbortSignal和120秒终止上限组成的子进程边界，以及对依赖缺失给出可操作说明。它们可迁移到其他本地文档助手，但依赖宿主subprocess/timer语义。返回JSON解析失败被显式处理，不能把进程结果无条件当成功。需要改进内容寻址缓存和多图任务预算；仓库未提供本次可核实的测试执行结果。

<a id="detail-section-5"></a>

### 1.4 主要限制

缓存名缺少完整bbox、DPI与源路径，同起点区域或同名PDF可发生路径重合；尚未运行复现其读图影响。[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

适合已经有Python环境且经常读图表论文的人在非关键材料上小范围试用。先选含双栏、公式、扫描页和同名文件的样本；核对页码、裁剪对应关系和关键数字，遇到缓存重合时给输入PDF不同basename，或顺序清理会话cwd下.dsh-pdf-reader后重读并立即核对；工具没有独立out-dir参数，单纯移动同名输入到不同目录不能隔离缓存。只有本文本路径存在、局部截图机制可核查，尚未证实跨论文准确率；需要精确合同、统计表或出版引用时始终回到原页。 [Q09](#research-q09)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查源码中的文本与图像路由；理解效果未经运行验证，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/tools.js、lib/python.js、lib/runner.js、lib/pdf_helper.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取入口、解释器探测、进程及Python渲染主路径，未执行目标代码；启发式准确率及模型图像上限未独立验证。
- 下一步：固定问题集比较文本、整页、区域输入，加入同名文件和同起点bbox，核对内容正确率与总预算。

**分析版本**

- **仓库**：[AngelosZou/dsh-pdf-reader](https://github.com/AngelosZou/dsh-pdf-reader)
- **版本号**：0.2.0（[固定提交 ffecd36](https://github.com/AngelosZou/dsh-pdf-reader/tree/ffecd361b7f2803fdccd1cf92149aad3e11a3271)）
- **版本日期**：2026-08-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是用PDF内容摘要、页码、完整bbox及DPI作为缓存键，并让每个问题共享总图像预算，能减少误用旧图与过量裁剪。它从当前缓存冲突及逐区域独立预算推导，不是本版已有能力。最小验证用同basename两PDF、同起点不同bbox及图表密集页，对比现版和新缓存策略，检查路径唯一性、读图正确率、总图像token和人工复核；若只有磁盘增量而无错误或总成本改善，否定其采用优势。 [Q08](#research-q08)

固定问题集比较文本、整页、区域输入，加入同名文件和同起点bbox，核对内容正确率与总预算。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 213 | — | — | 2153 |
| .js | source | 4 | 343 | 256 | 62 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/AngelosZou/dsh-pdf-reader/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本的PDF文本与区域渲染能否在有限图像预算下支持可靠论文阅读？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些PDF任务适用，合格交付是什么？

**研究主题**：场景与需求

#### 完整回答

适合阅读双栏论文、矢量图及表格的研究者。作者将任务拆为整篇扫描、单页混读及区域细读，合格结果应能追溯页码、读出关键数字与公式并检查布局。简单替代是PyMuPDF提取文本再手工截图；本插件把两条通路统一为模型工具，但不代替用户核对原页。扫描件需要模型辨图，项目没有实现独立OCR流水线。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:38-66](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/README.md#L38-L66)

作者明确工具及preview/content/refine流程。

<details>
<summary>查看原文（29行）</summary>

```text
## Tools

| Tool | What it does |
| --- | --- |
| `pdf_scan` | Per-page content profile — columns, figures (vector regions), raster images, tables, text characters, hasGraphics, formulaRisk, hasTextLayer. Use first to decide how each page should be read. |
| `pdf_read_page` | Read one page. `mode=mixed` is the one-shot: a low-res `fullPage` preview + the page text + every auto-detected figure/table region as high-DPI PNGs (paths, cached in `.dsh-pdf-reader`). `mode=auto`/`text`/`render` force a single path. |
| `pdf_render_region` | Targeted high-res render of a `[x0,y0,x1,y1]` region at budget-filling DPI (or an explicit `dpi`), returning its path for `read_image`. |

## Recommended workflow

The tools are built around a **preview → content → refine** loop so large PDFs
stay cheap and no layout is lost to flattening:

1. **Preview (whole page, low-res).** Call `pdf_read_page --mode mixed` for a page.
   It returns a low-res **`fullPage`** render (the whole layout — formulas, table
   gridlines, figure placement, two-column order) plus the page's **text**. Look at
   the preview to see *what* is on the page before spending high-res budget on it.
2. **Content (auto, cached).** The same `mixed` call auto-detects every figure and
   table region and renders each as a high-DPI PNG. All PNGs are written to
   **`<cwd>/.dsh-pdf-reader`** and returned **only as paths** — heavy/long content
   lives in the cache, never inlined into your context. Feed the paths to
   `read_image`.
3. **Refine (on demand).** If a specific area is still too small, or was not
   auto-cropped (an uncropped formula, a crowded table cell, a sub-figure), zoom it
   with `pdf_render_region` on the exact `[x0,y0,x1,y1]` you read off the `fullPage`
   preview.

Start any document with `pdf_scan` (whole-document overview) to plan which pages
are text-only vs figure/table/formula-rich, then apply the loop per page.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文本与图像路由如何实现？

**研究主题**：功能与机制

#### 完整回答

入口注册三个工具，调用前按已激活venv、PATH及项目venv寻找能import pymupdf的解释器。JS以argv调用Python helper，输出JSON；scan统计图形、文本层及字体，mixed提取文本并渲染去重区域和全页，将PNG路径交给后续read_image。auto仅返回最大候选或文本，不是全覆盖模式。输出是待模型理解的材料，不能把渲染成功等同阅读正确。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tools.js:30-46](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/tools.js#L30-L46)

解释器探测、进程及JSON边界。

<details>
<summary>查看原文（17行）</summary>

```text
async function runHelper(ctx, exec, argv, limits = TOOL_CAPS) {
  const cwd = sessionCwd(exec)
  const env = await resolvePdfPython(ctx.subprocess, ctx.fs, ctx.timer, cwd, exec?.signal)
  if (!env.ready) return { ok: false, warning: env.warning, missing: env.missing }

  const out = await runPython(
    ctx.subprocess, ctx.timer,
    [env.interpreter, HELPER, ...argv],
    cwd, limits, exec?.signal,
  )
  if (out.timedOut) return { ok: false, error: `PDF helper timed out after ${limits.doneCapMs}ms; the process tree was terminated.` }
  if (out.exitCode !== 0) return { ok: false, error: (out.stderr || 'PDF helper failed').trim() }
  try {
    return JSON.parse(out.stdout)
  } catch {
    return { ok: false, error: 'PDF helper returned malformed JSON: ' + out.stdout.slice(0, 200) }
  }
```

</details>

**依据 2 · 源码核查**：[lib/pdf_helper.py:345-393](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/pdf_helper.py#L345-L393)

mixed的具体数据链路。

<details>
<summary>查看原文（49行）</summary>

```text
def cmd_read(args):
    import pymupdf as m
    doc = m.open(args.pdf)
    page_num = args.page
    page = doc[page_num - 1]
    profile = scan_page(doc, page_num)
    mode = args.mode or "auto"
    # route on THIS page's actual graphics (figures/raster/tables) — not on a
    # document-level "is LaTeX" flag, which would render every page.
    has_gfx = bool(profile["hasGraphics"])
    result = {"ok": True, "page": page_num, "mode": mode, "profile": profile}

    # mode=mixed: cover the WHOLE page in one call — the extracted text AND every
    # figure/raster/table region (deduped) as high-DPI PNGs, PLUS a full-page
    # reference render so 2-D layout (display formulas, table gridlines, figure
    # placement) that text extraction flattens is never lost.
    if mode == "mixed":
        text = page.get_text("text").strip()
        md = None
        try:
            import pymupdf4llm
            md = pymupdf4llm.to_markdown(doc.path, pages=[page_num])
        except Exception:
            md = None
        pdf_base = os.path.basename(args.pdf)
        cands = [(r, "figure") for r in profile.get("figures", [])]
        cands += [(r, "raster") for r in profile.get("rasterImages", [])]
        cands += [(t["bbox"], "table") for t in profile.get("tables", [])]
        # results tables whose cell text is dense with scientific notation are a
        # reliable signal that find_tables often misses (it mis-reports the plot
        # grids instead). Add the block and its neighboring header/cell rows.
        cands += [(list(r), "table") for r, _lbl in _table_from_blocks(page)]
        regions = _dedupe_regions(cands)
        images = []
        for rect, label in regions:
            img = _render_region_image(page, rect, args.out_dir, pdf_base, page_num)
            img["label"] = label
            images.append(img)
        result["kind"] = "mixed"
        result["text"] = text
        result["textChars"] = len(text)
        result["formulaRisk"] = profile["formulaRisk"]
        if md:
            result["markdown"] = md
        result["regions"] = images
        result["fullPage"] = _render_region_image(
            page, page.rect, args.out_dir, pdf_base, page_num)
        doc.close()
        return result
```

</details>

**依据 3 · 源码核查**：[lib/pdf_helper.py:412-439](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/pdf_helper.py#L412-L439)

auto仅选最大区域。

<details>
<summary>查看原文（28行）</summary>

```text
    # render the region (explicit or best) at area-budget dpi
    import pymupdf as m
    if args.region:
        rect = m.Rect(args.region)
        reason = "explicit-region"
    else:
        (bbox, label) = best_region(profile)
        if bbox is None:
            bbox = page.rect
            label = "full-page"
        rect = bbox
        reason = f"auto-{label}"
    dpi = args.dpi or round(area_dpi(rect.width, rect.height))
    pm = page.get_pixmap(clip=rect, matrix=m.Matrix(dpi / 72.0, dpi / 72.0))
    os.makedirs(args.out_dir, exist_ok=True)
    path = os.path.join(args.out_dir,
                        f"{os.path.basename(args.pdf)}-p{page_num}-{int(rect.x0)}x{int(rect.y0)}.png")
    pm.save(path)
    doc.close()
    result["kind"] = "image"
    result["region"] = list(rect)
    result["reason"] = reason
    result["path"] = path
    result["dpi"] = dpi
    result["width"] = pm.width
    result["height"] = pm.height
    result["pixels"] = pm.width * pm.height
    result["budget"] = PIXEL_BUDGET
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对直接提取或整页截图有什么增量？

**研究主题**：贡献与相对优势

#### 完整回答

相对纯文本脚本，增量是利用矢量绘图、嵌入图片与表格候选选择区域，并以面积换算DPI填充固定像素预算。相对整页截图，局部图像可以保留更高局部清晰度；实际理解收益尚无同预算对照。解析与光栅化来自PyMuPDF，贡献归于路由和DSH工具编排，不能归为新PDF解析器或全球首创。

#### 证据与依据

**依据 1 · 源码核查**：[lib/pdf_helper.py:110-174](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/pdf_helper.py#L110-L174)

候选区域来自既有PyMuPDF接口及启发式。

<details>
<summary>查看原文（65行）</summary>

```text
def scan_page(doc, page_num):
    page = doc[page_num - 1]
    pr = page.rect
    page_area = pr.get_area() or 1.0
    # "meaningful graphics" = a cluster covering >=1% of the page; this skips
    # small logos, CC badges, and decorative rules that would otherwise trigger
    # a pointless render of a mostly-text page.
    mini = 0.01 * page_area
    img_rects = []
    try:
        for img in page.get_images(full=True):
            xref = img[0]
            for r in page.get_image_rects(xref):
                if r.get_area() >= mini:
                    img_rects.append(list(r))
    except Exception:
        pass
    draw_clusters = []
    try:
        draws = page.get_drawings()
        # include THIN connector lines/arrows too: they belong to their figure.
        # filter on the LARGER dimension, not the area: a connector arrow is a
        # zero-width or zero-height line whose rect area is ~0, but it is the
        # very element that bridges a figure's components. Dropping it (as an
        # area filter would) splits one flowchart into a big cluster plus a tiny
        # orphan that falls below min_area and is lost — clipping the bbox.
        # cluster first (proximity merges lines into their figure), then keep
        # only clusters >=1% of the page (drops logos/decorative rules).
        all_items = [d["rect"] for d in draws
                     if max(d["rect"].width, d["rect"].height) > 2.0]
        draw_clusters = [list(r) for r in _cluster_rects(all_items, gap=10.0, min_area=mini)]
    except Exception:
        pass

    tables = []
    try:
        for t in page.find_tables().tables:
            tables.append({"bbox": list(t.bbox), "rows": t.row_count,
                           "cols": t.col_count})
    except Exception:
        pass

    fs = _math_fonts(page)
    ts = _text_stats(page)
    producer = (doc.metadata or {}).get("producer", "") or ""
    latex = ("pdftex" in producer.lower() or "latex" in producer.lower()
             or bool(fs["mathFonts"]))

    return {
        "page": page_num,
        "size": [round(pr.width, 1), round(pr.height, 1)],
        "columns": _columns(page),
        "figures": draw_clusters,
        "rasterImages": img_rects,
        "tables": tables,
        "math": {"fonts": fs["fonts"], "mathFonts": fs["mathFonts"],
                 "likelyLatex": latex},
        # this page has a visual element text extraction cannot convey
        "hasGraphics": bool(draw_clusters or img_rects or tables),
        # text extraction may still garble stacked formulas; flag it so the
        # agent can choose to render a specific equation region if exact
        # structure is needed (pymupdf extracts inline math well, though).
        "formulaRisk": latex and bool(fs["mathFonts"]),
        "text": ts,
    }
```

</details>

**依据 2 · 源码核查**：[lib/pdf_helper.py:177-178](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/pdf_helper.py#L177-L178)

面积预算公式。

```text
def area_dpi(w_pt, h_pt, budget=PIXEL_BUDGET):
    return 72.0 * (budget / max(1.0, w_pt * h_pt)) ** 0.5
```

#### 缺口

- 没有相同模型同预算的题目正确率对照
  **影响**：不能证实token最优或内容完整
  **进一步探讨**：以同组图表问题比较文本、整页和区域三种输入，统计正确率及图像数

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 最影响完整读图主张的限制是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

缓存命名存在确定的碰撞条件。_render_region_image只以PDF basename、页码及区域左上角整数坐标命名，未包含源绝对路径、右下角、DPI或内容摘要。mixed先写区域再写全页；如果某候选左上角取整为0,0，后写全页会复用相同路径。同名不同目录PDF及同起点不同范围也会冲突。这是静态可证明的命名重合，未运行复现其模型影响。启发式还会遗漏无图形候选的公式或误判表格，不能承诺所有细节完整。

#### 证据与依据

**依据 1 · 源码核查**：[lib/pdf_helper.py:258-271](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/pdf_helper.py#L258-L271)

缓存键仅使用起点与basename。

<details>
<summary>查看原文（14行）</summary>

```text
def _render_region_image(page, rect, out_dir, pdf_base, page_num, dpi_override=None):
    """Render one rect at the area-budget dpi and save a PNG; return its dict."""
    import pymupdf as m
    if rect.is_empty or rect.get_area() <= 0:
        rect = page.rect
    dpi = dpi_override or round(area_dpi(rect.width, rect.height))
    pm = page.get_pixmap(clip=rect, matrix=m.Matrix(dpi / 72.0, dpi / 72.0))
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir,
                        f"{pdf_base}-p{page_num}-{int(rect.x0)}x{int(rect.y0)}.png")
    pm.save(path)
    return {"bbox": list(rect), "path": path, "dpi": dpi, "width": pm.width,
            "height": pm.height, "pixels": pm.width * pm.height,
            "budget": PIXEL_BUDGET, "scaled": (pm.width * pm.height > PIXEL_BUDGET)}
```

</details>

**依据 2 · 源码核查**：[lib/pdf_helper.py:379-391](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/pdf_helper.py#L379-L391)

区域写入后写入全页。

<details>
<summary>查看原文（13行）</summary>

```text
        for rect, label in regions:
            img = _render_region_image(page, rect, args.out_dir, pdf_base, page_num)
            img["label"] = label
            images.append(img)
        result["kind"] = "mixed"
        result["text"] = text
        result["textChars"] = len(text)
        result["formulaRisk"] = profile["formulaRisk"]
        if md:
            result["markdown"] = md
        result["regions"] = images
        result["fullPage"] = _render_region_image(
            page, page.rect, args.out_dir, pdf_base, page_num)
```

</details>

**依据 3 · 作者声明**：[README.md:98-109](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/README.md#L98-L109)

作者也承认公式、表格启发式边界。

<details>
<summary>查看原文（12行）</summary>

```text
## Limitations

- **`page.find_tables()` false-positives** on plot grids and diagrams, so tables
  are primarily read by rendering (the reliable path); Markdown tables from
  `pymupdf4llm` are a best-effort extra.
- Formula detection is heuristic (fonts + LaTeX producer). PyMuPDF decodes inline
  math well, but stacked fractions can still be imperfect — use
  `pdf_render_region` on an equation when exact structure is needed.
- A whole page renders to only ~83 DPI-equivalent at the budget; the tools never
  do that for a two-column page — they crop regions instead, and body text uses
  extraction.
- Large PDFs are parsed into memory.
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何启动，依赖失效怎样处理？

**研究主题**：依赖、兼容与流程

#### 完整回答

启动需要Node>=20、Cordis宿主tools/subprocess/fs/timer服务及Python+pymupdf。pymupdf4llm是可选Markdown补充；模型还必须能读取本地PNG，单独注册本插件不会消费图片。缺少解释器或库时返回含安装命令的warning，不会在工具内自动安装。路径由会话cwd解析，可读绝对路径，权限界限主要依赖宿主。手动依赖安装和图像核对由用户负责。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:11-19](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/index.js#L11-L19)

真实注入和注册。

```text
import { registerPdfTools } from './tools.js'

export const name = 'dsh-pdf-reader'

export const inject = ['tools', 'subprocess', 'fs', 'timer']

export function apply(ctx) {
  registerPdfTools(ctx)
}
```

**依据 2 · 源码核查**：[lib/python.js:83-99](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/python.js#L83-L99)

缺依赖返回结构化warning。

<details>
<summary>查看原文（17行）</summary>

```text
/** Resolve a ready interpreter+pymupdf, or a clear actionable warning. */
export async function resolvePdfPython(subprocess, fs, timer, cwd, signal) {
  const candidates = await listInterpreters(subprocess, fs, cwd)
  for (const interpreter of candidates) {
    const pym = await probeImport(subprocess, timer, interpreter, 'pymupdf', signal)
    if (pym.ok) {
      const four = await probeImport(subprocess, timer, interpreter, 'pymupdf4llm', signal)
      return { ready: true, interpreter, pymupdf: true, pymupdf4llm: four.ok }
    }
  }
  // figure out which was missing (python vs pymupdf) for a clearer message
  return {
    ready: false,
    warning: buildWarning(candidates),
    missing: ['a Python interpreter with the `pymupdf` package'],
    interpreter: candidates[0] ?? null,
  }
```

</details>

**依据 3 · 作者声明**：[README.md:111-115](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/README.md#L111-L115)

运行条件。

```text
## Requirements

- Node ≥ 20, `@deepseek-ai/cordis` ^4, `@deepseek-ai/dsh-tools` (peer deps,
  provided by the harness).
- Python 3 + `pymupdf` (optional `pymupdf4llm`).
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 合格任务的成本与效果支持到哪里？

**研究主题**：效果与总成本

#### 完整回答

一次合格任务是按原页核对论文中一组图表数值、公式和页码。首次需安装Python库及加载插件；持续使用每次helper启动、解析及渲染消耗本地CPU、磁盘与模型图像输入；mixed可生成多个区域，640k只是单图目标而非任务总预算。失败恢复需清理可能冲突的PNG并重读原页，人工时间不能忽略。未获得现金、耗时、正确率或重试频率数据，无法计算合格任务单位成本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/pdf_helper.py:377-391](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/pdf_helper.py#L377-L391)

mixed区域数量决定图片数量。

<details>
<summary>查看原文（15行）</summary>

```text
        regions = _dedupe_regions(cands)
        images = []
        for rect, label in regions:
            img = _render_region_image(page, rect, args.out_dir, pdf_base, page_num)
            img["label"] = label
            images.append(img)
        result["kind"] = "mixed"
        result["text"] = text
        result["textChars"] = len(text)
        result["formulaRisk"] = profile["formulaRisk"]
        if md:
            result["markdown"] = md
        result["regions"] = images
        result["fullPage"] = _render_region_image(
            page, page.rect, args.out_dir, pdf_base, page_num)
```

</details>

**依据 2 · 源码核查**：[lib/runner.js:20-35](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/runner.js#L20-L35)

每次进程、输出上限及120秒超时。

<details>
<summary>查看原文（16行）</summary>

```text
  const handle = subprocess.spawn({
    argv,
    cwd,
    stdio: {
      stdin: 'ignore',
      stdout: { maxBytes: 8 * 1024 * 1024 },
      stderr: { maxBytes: 512 * 1024 },
    },
    graceMs: l.graceMs,
    signal,
    env: { PYTHONIOENCODING: 'utf-8', PYTHONDONTWRITEBYTECODE: '1' },
  })
  const done = new Promise((resolve) => {
    const timeout = timer.timeout(() => {
      handle.terminate()
      resolve({ exitCode: null, stdout: '', stderr: '', timedOut: true })
```

</details>

#### 缺口

- 缺少端到端耗时、模型计费和人工核对数据
  **影响**：不能认定阅读更便宜或更正确
  **进一步探讨**：同一问题集记录所有图片、失败及复核时间后再比较

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪些设计可复用，哪些可靠性边界需要注意？

**研究主题**：工程质量与复用

#### 完整回答

可复用的是无shell argv、UTF-8输出、AbortSignal和120秒终止上限组成的子进程边界，以及对依赖缺失给出可操作说明。它们可迁移到其他本地文档助手，但依赖宿主subprocess/timer语义。返回JSON解析失败被显式处理，不能把进程结果无条件当成功。需要改进内容寻址缓存和多图任务预算；仓库未提供本次可核实的测试执行结果。

#### 证据与依据

**依据 1 · 源码核查**：[lib/runner.js:14-53](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/runner.js#L14-L53)

进程和超时设计。

<details>
<summary>查看原文（40行）</summary>

```text
export function runPython(subprocess, timer, argv, cwd, limits = DEFAULT_LIMITS, signal) {
  // Merge partial limits with the defaults: callers may pass only `doneCapMs`
  // (e.g. the import probe in python.js). `subprocess.spawn` validates that
  // `graceMs` is a positive finite number, so an omitted field (undefined)
  // would be rejected — fill it from the defaults instead of forwarding it.
  const l = { ...DEFAULT_LIMITS, ...(limits || {}) }
  const handle = subprocess.spawn({
    argv,
    cwd,
    stdio: {
      stdin: 'ignore',
      stdout: { maxBytes: 8 * 1024 * 1024 },
      stderr: { maxBytes: 512 * 1024 },
    },
    graceMs: l.graceMs,
    signal,
    env: { PYTHONIOENCODING: 'utf-8', PYTHONDONTWRITEBYTECODE: '1' },
  })
  const done = new Promise((resolve) => {
    const timeout = timer.timeout(() => {
      handle.terminate()
      resolve({ exitCode: null, stdout: '', stderr: '', timedOut: true })
    }, l.doneCapMs)
    handle.done.then(
      (outcome) => {
        timeout()
        resolve({
          exitCode: outcome.exitCode,
          stdout: handle.collected?.stdout?.readFrom(0).text ?? '',
          stderr: handle.collected?.stderr?.readFrom(0).text ?? '',
          timedOut: false,
        })
      },
      () => {
        timeout()
        resolve({ exitCode: null, stdout: '', stderr: '', timedOut: false })
      },
    )
  })
  return done
```

</details>

**依据 2 · 源码核查**：[lib/tools.js:40-45](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/tools.js#L40-L45)

非零退出与JSON异常。

```text
  if (out.timedOut) return { ok: false, error: `PDF helper timed out after ${limits.doneCapMs}ms; the process tree was terminated.` }
  if (out.exitCode !== 0) return { ok: false, error: (out.stderr || 'PDF helper failed').trim() }
  try {
    return JSON.parse(out.stdout)
  } catch {
    return { ok: false, error: 'PDF helper returned malformed JSON: ' + out.stdout.slice(0, 200) }
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由缓存和预算限制推导什么设计假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是用PDF内容摘要、页码、完整bbox及DPI作为缓存键，并让每个问题共享总图像预算，能减少误用旧图与过量裁剪。它从当前缓存冲突及逐区域独立预算推导，不是本版已有能力。最小验证用同basename两PDF、同起点不同bbox及图表密集页，对比现版和新缓存策略，检查路径唯一性、读图正确率、总图像token和人工复核；若只有磁盘增量而无错误或总成本改善，否定其采用优势。

#### 证据与依据

**依据 1 · 源码核查**：[lib/pdf_helper.py:258-271](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/pdf_helper.py#L258-L271)

命名与预算的推导起点。

<details>
<summary>查看原文（14行）</summary>

```text
def _render_region_image(page, rect, out_dir, pdf_base, page_num, dpi_override=None):
    """Render one rect at the area-budget dpi and save a PNG; return its dict."""
    import pymupdf as m
    if rect.is_empty or rect.get_area() <= 0:
        rect = page.rect
    dpi = dpi_override or round(area_dpi(rect.width, rect.height))
    pm = page.get_pixmap(clip=rect, matrix=m.Matrix(dpi / 72.0, dpi / 72.0))
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir,
                        f"{pdf_base}-p{page_num}-{int(rect.x0)}x{int(rect.y0)}.png")
    pm.save(path)
    return {"bbox": list(rect), "path": path, "dpi": dpi, "width": pm.width,
            "height": pm.height, "pixels": pm.width * pm.height,
            "budget": PIXEL_BUDGET, "scaled": (pm.width * pm.height > PIXEL_BUDGET)}
```

</details>

**依据 2 · 源码核查**：[lib/pdf_helper.py:379-391](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/pdf_helper.py#L379-L391)

多区域预算的推导起点。

<details>
<summary>查看原文（13行）</summary>

```text
        for rect, label in regions:
            img = _render_region_image(page, rect, args.out_dir, pdf_base, page_num)
            img["label"] = label
            images.append(img)
        result["kind"] = "mixed"
        result["text"] = text
        result["textChars"] = len(text)
        result["formulaRisk"] = profile["formulaRisk"]
        if md:
            result["markdown"] = md
        result["regions"] = images
        result["fullPage"] = _render_region_image(
            page, page.rect, args.out_dir, pdf_base, page_num)
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 什么人适合试用，应如何验收？

**研究主题**：采用判断

#### 完整回答

适合已经有Python环境且经常读图表论文的人在非关键材料上小范围试用。先选含双栏、公式、扫描页和同名文件的样本；核对页码、裁剪对应关系和关键数字，遇到缓存重合时给输入PDF不同basename，或顺序清理会话cwd下.dsh-pdf-reader后重读并立即核对；工具没有独立out-dir参数，单纯移动同名输入到不同目录不能隔离缓存。只有本文本路径存在、局部截图机制可核查，尚未证实跨论文准确率；需要精确合同、统计表或出版引用时始终回到原页。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tools.js:102-137](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/tools.js#L102-L137)

工具入口支持mixed与显式区域。

<details>
<summary>查看原文（36行）</summary>

```text
  ctx.tools.register(
    tool({
      name: 'pdf_read_page',
      description:
        'Read one page of a PDF. Recommended per-page workflow: ' +
        '(1) PREVIEW — mode="mixed" returns a low-res full-page render (fullPage) plus the ' +
        'extracted text, so you see the whole layout (formulas, table gridlines, figure ' +
        'placement) without burning the token budget; ' +
        '(2) CONTENT — mode="mixed" also auto-detects every figure/table region and renders it ' +
        'as a high-DPI PNG. All PNGs are saved to <cwd>/.dsh-pdf-reader and returned only as ' +
        'PATHS (never inlined), so long/heavy content stays in the cache, not in your context — ' +
        'read them via read_image; ' +
        '(3) REFINE — if a specific area is still too small or was not auto-cropped (an ' +
        'uncropped formula, a crowded table cell, a sub-figure), zoom it with pdf_render_region ' +
        'on the exact [x0,y0,x1,y1] bbox you read off the fullPage preview. ' +
        'For a whole-document overview first run pdf_scan. mode="auto" returns just the largest ' +
        'figure/table image (or the text) per the page profile; mode="text" forces extraction; ' +
        'mode="render" forces a render of an explicit region. Needs Python+pymupdf.',
      parameters: objectParams({
        pdf_path: { type: 'string', description: 'Absolute or session-relative PDF path.' },
        page: { type: 'number', description: '1-based page number to read.' },
        mode: { type: 'string', description: '"auto" (default), "text", "mixed", or "render".', enum: ['auto', 'text', 'mixed', 'render'] },
        dpi: { type: 'number', description: 'Optional DPI override for a render; default fills the budget.' },
        region: { type: 'array', description: '[x0,y0,x1,y1] in points, for mode=render.', items: { type: 'number' } },
      }, ['pdf_path', 'page']),
      timeoutMs: 120_000,
      async execute(args, exec) {
        const a = args ?? {}
        const cwd = sessionCwd(exec)
        if (!a.pdf_path || !a.page) return { ok: false, error: 'pdf_path and page are required' }
        const argv = ['read', absPath(a.pdf_path, cwd), String(a.page), '--out-dir', path.join(cwd, '.dsh-pdf-reader')]
        if (a.mode) argv.push('--mode', a.mode)
        if (a.dpi) argv.push('--dpi', String(a.dpi))
        if (Array.isArray(a.region) && a.region.length === 4) argv.push('--region', ...a.region.map(String))
        return runHelper(ctx, exec, argv)
      },
```

</details>

**依据 2 · 源码核查**：[lib/pdf_helper.py:258-271](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/pdf_helper.py#L258-L271)

试用须覆盖缓存碰撞条件。

<details>
<summary>查看原文（14行）</summary>

```text
def _render_region_image(page, rect, out_dir, pdf_base, page_num, dpi_override=None):
    """Render one rect at the area-budget dpi and save a PNG; return its dict."""
    import pymupdf as m
    if rect.is_empty or rect.get_area() <= 0:
        rect = page.rect
    dpi = dpi_override or round(area_dpi(rect.width, rect.height))
    pm = page.get_pixmap(clip=rect, matrix=m.Matrix(dpi / 72.0, dpi / 72.0))
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir,
                        f"{pdf_base}-p{page_num}-{int(rect.x0)}x{int(rect.y0)}.png")
    pm.save(path)
    return {"bbox": list(rect), "path": path, "dpi": dpi, "width": pm.width,
            "height": pm.height, "pixels": pm.width * pm.height,
            "budget": PIXEL_BUDGET, "scaled": (pm.width * pm.height > PIXEL_BUDGET)}
```

</details>

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
