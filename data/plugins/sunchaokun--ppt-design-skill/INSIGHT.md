# PPT Design Skill

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[cbf7ef1](https://github.com/sunchaokun/PPT-Design-Skill/tree/cbf7ef1324a026b29e2b77b71e2034554ddd3e22)

<!-- BEGIN META -->
[![GitHub ★ 399](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=399&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sunchaokun/PPT-Design-Skill)
<!-- END META -->

> **功能**：为演示作者提供需求、视觉方向和主题锁定到 PPTX 生成、逐页 PNG 审阅返工及交付记录的方法，生成依赖外部 pptx-designer。

> **亮点**：方向/主题/双门返工和清旧渲染/状态记录增强可复核过程，非自动视觉评分或新PPT渲染算法。见[Q02](#research-q02)、[Q03](#research-q03)。

> **主要限制**：默认安装把skill内容直接复制，但validator仍repo/skill路径假设，安装后schema找错；pip/import检测不保证render/版本，PASS记录非视觉/用户确认。见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 服务谁，Build/FreeStyle/VI与替代差别？](#detail-section-11)
  - [Q02 · 确认、Theme/runtime与渲染如何接线？](#detail-section-12)
  - [Q03 · QA核记录还是视觉/内容正确？](#detail-section-13)
  - [Q04 · 交付成本、采用和退出？](#detail-section-14)
  - [Q05 · 现trace上的可证伪生产方向？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为愿确认方向并验收稿件的演示作者，把brief、逐页规划、生成和PNG返工组织成可交付流程。见[Q01](#research-q01)。

一句话PPT生成或现模板手工调整；本Skill增量是设计/审阅/交付组织，PPT原生生成归外部引擎。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 设计方法 | brief→方向/Theme/页目标 | 人批准方向，非独立生成器 |
| 外部生成编排 | Build/FreeStyle/VI | 实际库/主题/模板API另核 |
| 渲染 | COM或LO+Poppler出PDF/PNG | 数量非空≠视觉正确，需字体/环境 |
| QA记录 | 状态/分数/trace与原型审计 | 安装路径缺口，记录不证真实确认/质量 |

**流程与依赖**

Agent/Python/外部库/renderer/fonts和内容素材权限；安装校验路径需先修，依赖表见[Q04](#research-q04)。

固定环境→确认brief/方向→P01/全稿生成看图返工→当前产物/用户验收交付；步骤见[Q04](#research-q04)。

**效果与成本**

环境/路径修复、内容与视觉逐页返工、可选模型图片与渲染成本未知；表见[Q04](#research-q04)。

过程/新鲜render/记录可核，客户接受、编辑体验与净返工节时未独立测；表见[Q04](#research-q04)。

> **思考**：默认安装把skill内容直接复制，但validator仍repo/skill路径假设，安装后schema找错；pip/import检测不保证render/版本，PASS记录非视觉/用户确认。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：方向/主题/双门返工和清旧渲染/状态记录增强可复核过程，非自动视觉评分或新PPT渲染算法。见[Q02](#research-q02)、[Q03](#research-q03)。

隔离初始化拒覆盖、渲染清旧/数页、状态原子记录值得保留；repo根硬编码和记录型门禁须与安装/当前产物验收分开。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认安装把skill内容直接复制，但validator仍repo/skill路径假设，安装后schema找错；pip/import检测不保证render/版本，PASS记录非视觉/用户确认。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察优先；熟悉Python/审稿者可隔离repo/venv先核安装schema/库/字体/render，再小样，缺环境/模板冲突/MUST不达停止正式交付，保旧版和源稿修后重渲染。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

新项无baseline。固定源码支持Skill方法/辅助脚本，真实生成归外部库，已定位正常安装布局QA路径缺口；未执行/视觉独验。先观察并修/核安装与环境，不凭自评PASS作客户交付。

- 已检查：作者 README、包清单、源码路径 README.md、skill/SKILL.md、installer/install.py、skill/references/public-api.md、skill/references/install-and-runtime.md、skill/references/qa-and-delivery.md、skill/scripts/init_presentation_task.py、skill/scripts/check_runtime.py、skill/scripts/run_visual_workflow.py、skill/scripts/render_pptx.ps1、skill/scripts/validate_visual_pack.py、skill/scripts/validate_runtime_trace.py、skill/scripts/validate_acceptance_record.py、skill/scripts/audit_visual_review_records.py、skill/schemas/runtime-trace.schema.json、skill/schemas/acceptance-record.schema.json、evals/003-scientific-research/visual-review.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：新项无旧findings/依赖。核Skill核心方法/public-api/runtime/QA，installer全流程、init/runtime/状态脚本、acceptance/trace schema+validator、visual_pack路径/原型验证、review audit、固定git show PowerShell render与scientific自评。未完整审其它audit/installer平台路径、所有case图或外部pptx-designer实现，不执行目标。
- 下一步：后续隔离复制安装布局对照repo validators，再固定venv/库/fonts/renderer样稿生成、编辑/PNG盲审与陈旧review故障，比较现模板净成本。

**分析版本**

- **仓库**：[sunchaokun/PPT-Design-Skill](https://github.com/sunchaokun/PPT-Design-Skill)
- **版本号**：版本口径未统一：README / init 声明 1.5，installer 横幅 1.4（[固定提交 cbf7ef1](https://github.com/sunchaokun/PPT-Design-Skill/tree/cbf7ef1324a026b29e2b77b71e2034554ddd3e22)）
- **版本日期**：2026-09-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向在现trace上绑定当前build/主题/字体/实际产物摘要与验收失效，测陈旧误交付/返工，先修路径；见[Q05](#research-q05)。

后续隔离复制安装布局对照repo validators，再固定venv/库/fonts/renderer样稿生成、编辑/PNG盲审与陈旧review故障，比较现模板净成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 42 | 3028 | — | — | 21256 |
| .md | example | 61 | 1341 | — | — | 9611 |
| .js | example | 2 | 155 | 150 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/sunchaokun/PPT-Design-Skill/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：视觉交付方法与真实脚本门禁能支持什么，安装后QA和外部引擎有哪些边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 服务谁，Build/FreeStyle/VI与替代差别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是ppt-design-skill方法/工具包，真实entry_type为skill，不是DSH原生插件或独立PPT生成引擎。README标1.5，init脚本也写1.5，但installer仍有1.4字符串，研究身份以固定cbf7ef…为准，不把打印版本当完整发行对应。新项baseline路径不存在，无旧findings/依赖可读复核。

面向已有内容/受众与交付目标、愿意人工确认视觉方向的演示作者/分析师。相对一句话让LLM吐PPT代码或直接用模板填内容，增量是brief→domain/page plan→方向比较→Theme Lock→生成→PNG双门复核/返工及交付材料，不以“PPTX能打开”当完成。简单探索明确可走快速draft，不强迫所有轻量任务一套客户交付流程。

Build Mode逐页/元素显式布局，FreeStyle走generate_ppt(query/content)快速编排，VI Build依现模板/品牌约束；这些模式的实际生成都交外部已发布pptx-designer，native可编辑、主题合并/生成能力主要归该库，不计本Skill新渲染算法。Library候选也不能覆盖受众/领域/品牌决定。

合格结果是PPTX、可复现build/content、PDF、PNG及可解释review，内容来源和每页可读性正确、重要对象可编辑、用户接受方向，不能仅靠自评分数/脚本退出码。提供给客户/科研的内容真实性和图表数据须另核，设计方法不验证科学结论或授权素材本身。

#### 证据与依据

**依据 1 · 源码核查**：[skill/SKILL.md:1-19](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/SKILL.md#L1-L19)

真实Skill身份/外部引擎归属。

<details>
<summary>查看原文（19行）</summary>

```text
---
name: ppt-design-skill
description: Design, generate, review, and revise editable PowerPoint presentations through a rigorous brief-to-PNG workflow using the public pptx-designer Python library.
metadata:
  short-description: Design and visually review editable PowerPoint decks
  category: design
  tags: [ppt, powerpoint, presentation, deck, slides, design, python, editable]
---

# PPT Design Skill

This skill is a presentation design director and delivery workflow. The
`pptx-designer` Python package is the rendering engine; this skill decides
what should be designed, how it should be structured, how it should look, and
whether the rendered result actually satisfies the user's need.

The design framework below keeps the mature design judgment, content rules,
domain paradigms, and quality standards that make the workflow reliable. The
implementation engine is the public `pptx-designer` Python library.
```

</details>

**依据 2 · 源码核查**：[skill/SKILL.md:38-71](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/SKILL.md#L38-L71)

任务初始化、先确认和交付定义。

<details>
<summary>查看原文（34行）</summary>

```text
## Stop before writing code

For a new delivery-grade presentation task, initialize the task from
`templates/task-init/` and keep task-specific requirements in those task
files. Run `init_presentation_task.py` from the loaded Skill's `scripts/`
directory (use its absolute path if the working directory is the project):
`python <skill-root>/scripts/init_presentation_task.py --project <project-root>
--name <lowercase-task-slug>`. It creates an isolated
`<project-root>/ppt_tasks/<task-slug>/` and refuses to overwrite it. Do not
begin implementation while a required research or direction decision remains
unresolved.

For a delivery-grade deck, do not write the build script until these decisions
are explicit:

- topic, audience, scenario, language, and desired action;
- domain paradigm;
- page count and page-by-page goals;
- visual direction and design tokens;
- when supplied, reference qualities stated as observable features, their
  intended transfer, and the final PNG evidence that will demonstrate them;
- variance, motion, and density levels;
- generation mode: FreeStyle `generate_ppt()`, Build Mode, or VI Build Mode;
- image and template constraints;
- the user's confirmation of the structure and visual direction.

The only acceptable shortcut is an explicitly requested quick exploratory draft.

## Non-negotiable outcome

A PPTX file that merely runs successfully is not complete. A task is complete
only after the deck has been rendered through the confirmed `PPTX -> PDF ->
PNG` path, the LLM has inspected the PNG output, material visual issues have
been revised, and the user has confirmed the final direction or result.
```

</details>

**依据 3 · 源码核查**：[README.md:9-22](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/README.md#L9-L22)

作者1.5及引擎声明。

<details>
<summary>查看原文（14行）</summary>

```text
一个以设计决策和交付质量为核心的 PowerPoint skill。PPTX 的实际生成由已发布的
[`pptx-designer`](https://pypi.org/project/pptx-designer/) Python 标准库
负责；本 Skill 负责需求确认、结构设计、视觉方案、生成编排、PNG 视觉验收
以及返工交付。

<p align="center">
  <img src="https://img.shields.io/badge/version-1.5-111827?style=flat-square" alt="Version 1.5">
  <img src="https://img.shields.io/badge/engine-pptx--designer-2563EB?style=flat-square" alt="pptx-designer engine">
  <img src="https://img.shields.io/badge/output-PPTX%20%7C%20PDF%20%7C%20PNG-C2414C?style=flat-square" alt="PPTX PDF PNG output">
</p>

[English README](docs/README_EN.md) · [中文使用手册](docs/usage-guide.md) ·
[真实案例](examples/README.md) · [安装说明](installer/README.md)

```

</details>

**依据 4 · 源码核查**：[skill/references/public-api.md:1-19](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/references/public-api.md#L1-L19)

公共外部API。

<details>
<summary>查看原文（19行）</summary>

````text
# Curated `pptx-designer` contract

Install the published package and use only public, documented imports. The
package requires Python 3.10+.

## Top-level pipeline

```python
from pptx_designer import (
    Presentation, extract_design_context, extract_design_dna, fetch_image, generate_ppt,
    merge_vi_design_context, validate_resolved_theme,
)
```

- `generate_ppt(query, style=..., output=...)` is the quick path.
- `generate_ppt(content={...}, style=..., output=...)` is the structured path.
- `Presentation(template_path=None, theme=..., strict_theme=False)` creates a
  16:9 presentation and can attach a theme context.
- `extract_design_dna(path)` analyzes an existing presentation.
````

</details>

**依据 5 · 源码核查**：[skill/references/public-api.md:28-47](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/references/public-api.md#L28-L47)

候选主题与真正resolved theme。

<details>
<summary>查看原文（20行）</summary>

````text
```python
from pptx_designer import PALETTES, STYLES, TYPOGRAPHY, recommend_styles
from pptx_designer.renderer.theme import ThemeComposer
from pptx_designer.search.adapters import search_color, search_style, search_typography
```

- Use `recommend_styles()` and the search functions before direction lock to
  generate candidate vocabulary and options.
- Use `ThemeComposer().compose(...)` after direction lock to pin explicit
  palette, font, decoration, layout, mood, and seed choices.
- Store the `ThemeComposer().compose(...)` result as the resolved theme. It is
  the only object accepted by `generate_ppt(theme=...)`; a Theme Lock is a
  separate skill-level design record and must not be passed directly.
- In ordinary Build Mode, use `Presentation(theme=resolved_theme,
  strict_theme=True)` and semantic roles. A local `C` override is permitted
  only for an explained page-level semantic need; derive it from the current
  resolved theme rather than a stale hard-coded token set.
- Treat library suggestions as candidates. They do not understand every user
  nuance, and a generic preset must not override a domain paradigm or brand
  constraint.
````

</details>

**依据 6 · 源码核查**：[installer/install.py:18-21](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/installer/install.py#L18-L21)

打印1.4版本字符串。

```text

SKILL_NAME = "ppt-design-skill"
SKILL_VERSION = "1.4"
ROOT = Path(__file__).resolve().parents[1]
```

#### 缺口

- 真实客户采用、净返工/节时和编辑体验未独立验证
  **影响**：方法具体不等比模板/通用PPT助手更好或客户可用
  **进一步探讨**：同brief比较现模板/通用生成与该Skill，盲看可读性、人工修订时间和对象编辑任务。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 确认、Theme/runtime与渲染如何接线？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

Skill要求先从task-init建隔离目录，init_presentation_task的模板根相对scripts parents[1]，目标必须在project内、slug合法且目录已存在拒覆盖；因此该初始化路径与安装后的Skill布局兼容。Theme Lock是设计记录，不是API对象；要另调用ThemeComposer.compose得到resolved theme，记录seed、fingerprint、实际package version/module path，再交generate/Presentation strict_theme；VI模板锁冲突应先解决。方法/库契约都有来源，但本轮未安装外部库验证签名/效果。

installer把skill目录内容整体copy到目标专用Skill根，先完整staging，再删旧目标后replace；复制失败保旧有意义，但删旧后rename失败没有旧版自动回滚，固定.installing路径亦非跨进程互斥。默认随后pip install --upgrade pptx-designer（可加images/ai-images，无精确pin），pip失败仅WARN仍main return0；安装打印成功不等引擎可用或版本固定。

runtime文档要求Python>=3.10、pptx-designer>=1.0.0b8并核实际module path/主题能力，check_runtime只检查Python/import模块和报告版本，不强制该最低库版本。LibreOffice/Poppler可选fallback是否找到单独报告，COM只实际render时测；check_runtime的ok不含fallback_ready，故检测返回0不能证明PPTX→PNG完整链可用。

render_pptx.ps1真实先从PPTX ZIP数slide XML、清同名旧PDF/slide PNG，尝试Windows PowerPoint COM存PDF并逐页PNG，不行再LibreOffice→PDF/Poppler逐页渲染，最终核PNG数量与非空。清旧产物避免把旧图当新图，这是实在保护；字体、库/COM/LibreOffice版本与模板都可能影响实际视觉，不能从文件数推画面正确。图片生成可选需provider/key或本地素材；.env/API成本与素材隐私应按用户范围处理。

#### 证据与依据

**依据 1 · 源码核查**：[skill/scripts/init_presentation_task.py:15-17](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/scripts/init_presentation_task.py#L15-L17)

安装布局下模板根/版本。

```text

SKILL_VERSION = "1.5"
TASK_TEMPLATE = Path(__file__).resolve().parents[1] / "templates" / "task-init"
```

**依据 2 · 源码核查**：[skill/scripts/init_presentation_task.py:48-88](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/scripts/init_presentation_task.py#L48-L88)

目录限制、拒覆盖与manifest。

<details>
<summary>查看原文（41行）</summary>

```text
    if not project.is_dir():
        fail(f"project directory does not exist: {project}")
    if not SLUG_RE.fullmatch(args.name):
        fail("name must be a lowercase slug using letters, digits, '-' or '_'")
    if not TASK_TEMPLATE.is_dir():
        fail(f"task template is missing: {TASK_TEMPLATE}")

    if args.destination:
        destination = args.destination.expanduser().resolve()
        try:
            destination.relative_to(project)
        except ValueError:
            fail("destination must be inside the project directory")
    else:
        destination = project / "ppt_tasks" / args.name

    if destination.exists():
        fail(f"refusing to overwrite existing task: {destination}")

    destination.parent.mkdir(parents=True, exist_ok=True)
    copytree(TASK_TEMPLATE, destination)
    manifest = {
        "task_id": str(uuid.uuid4()),
        "task_name": args.name,
        "skill": "ppt-design-skill",
        "skill_version": SKILL_VERSION,
        "template_source": "skill/templates/task-init",
        "project_root": str(project),
        "task_root": str(destination),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    (destination / ".task-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"[OK] initialized task -> {destination}")
    print(json.dumps(manifest, ensure_ascii=False))
    return 0


if __name__ == "__main__":
```

</details>

**依据 3 · 源码核查**：[skill/SKILL.md:93-107](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/SKILL.md#L93-L107)

Theme/实际版本记录与build。

<details>
<summary>查看原文（15行）</summary>

```text
5. Lock the selected direction in a versioned **Theme Lock**: mood, visual
   thesis, palette intent, typography intent, grid, spacing, density, image
   treatment, chart language, page archetypes, and forbidden patterns. A Theme
   Lock is a project design record, not a `pptx-designer` API object. Resolve
   it once with `ThemeComposer.compose(...)`, save the resulting complete
   **resolved theme**, and pass that object to the generation API.
6. Present the structure and visual direction for confirmation before building
   a delivery-grade deck, unless the user explicitly requests a one-shot draft.
7. Generate a reproducible Python build script or structured `content` using documented public
   `pptx_designer` APIs. Record the Theme Lock version, resolved-theme source,
   seed, package version, and module path with the generation result.
8. Run the generation path and perform basic structural checks.
9. Export the PPTX to PDF and PNG using `skill/scripts/render_pptx.ps1`.
10. Inspect the rendered PNGs directly using two gates. **Gate 1 is visual
   effect first**: ask whether the result looks client-ready at a glance, with a
```

</details>

**依据 4 · 源码核查**：[skill/references/public-api.md:51-75](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/references/public-api.md#L51-L75)

resolved theme与VI合并契约。

<details>
<summary>查看原文（25行）</summary>

````text
```python
from pptx_designer import (
    Presentation, extract_design_context, merge_vi_design_context,
    validate_resolved_theme,
)
from pptx_designer.renderer.theme import ThemeComposer

resolved_theme = ThemeComposer().compose(style="dark-tech", seed=17)
validate_resolved_theme(resolved_theme)
prs = Presentation(theme=resolved_theme, strict_theme=True)

template_context = extract_design_context(template_path)
page_context = {"page_role": "content"}  # Add only approved page-level fields.
# For a supplied template, locked template fields win over later inputs.
vi_context = merge_vi_design_context(template_context, resolved_theme, page_context)
if vi_context["diagnostics"]["conflicts"]:
    raise ValueError("Revise the theme/page context; it attempted to override a template lock")
```

When `theme=resolved_theme` is passed to `generate_ppt()`, do not also pass
`style`, palette atoms, or `style_seed`; those are discovery inputs and are
ignored for an already resolved theme.

## Build Mode modules

````

</details>

**依据 5 · 源码核查**：[installer/install.py:24-47](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/installer/install.py#L24-L47)

staging→删旧→replace。

<details>
<summary>查看原文（24行）</summary>

```text

def copy_bundle(destination: Path, force: bool) -> bool:
    if destination.exists() and not force:
        print(f"[SKIP] {destination} exists; use --force to replace it")
        return False
    destination.parent.mkdir(parents=True, exist_ok=True)
    # A skill installation is a complete bundle, not an additive overlay.
    # Older releases shipped a ``src/ppt_pro_max`` tree and legacy entrypoint
    # files. Replace the dedicated skill directory so those files cannot be
    # discovered as part of the new Skill runtime path.
    staging = destination.with_name(f".{destination.name}.installing")
    if staging.exists():
        shutil.rmtree(staging)
    shutil.copytree(
        SOURCE,
        staging,
        ignore=shutil.ignore_patterns("__pycache__", "*.pyc"),
    )
    # Build the replacement completely before removing the current bundle. If
    # copying fails, the existing installation is left intact.
    if destination.exists():
        shutil.rmtree(destination)
    staging.replace(destination)
    print(f"[OK] skill bundle -> {destination}")
```

</details>

**依据 6 · 源码核查**：[installer/install.py:50-67](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/installer/install.py#L50-L67)

外部库无pin upgrade。

<details>
<summary>查看原文（18行）</summary>

```text

def install_python_package(with_images: bool = False, with_ai_images: bool = False) -> bool:
    package = "pptx-designer"
    extras = []
    if with_images:
        extras.append("images")
    if with_ai_images:
        extras.append("ai-images")
    if extras:
        package += "[" + ",".join(extras) + "]"
    before = installed_package_version("pptx-designer")
    print(f"Checking pptx-designer (installed: {before or 'missing'})...")
    result = subprocess.run([sys.executable, "-m", "pip", "install", "--upgrade", package], check=False)
    if result.returncode == 0:
        after = installed_package_version("pptx-designer") or "unknown version"
        status = "updated" if before and before != after else "ready"
        print(f"[OK] pptx-designer {after} ({status})")
    return result.returncode == 0
```

</details>

**依据 7 · 源码核查**：[installer/install.py:148-162](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/installer/install.py#L148-L162)

先复制、pip失败warn仍成功。

<details>
<summary>查看原文（15行）</summary>

```text
    if not args.no_global:
        for key in keys:
            destination = global_path(PLATFORMS[key], home) / SKILL_NAME
            if copy_bundle(destination, args.force):
                installed.append(destination)
    if args.project:
        for key in keys:
            destination = project_path(PLATFORMS[key], args.target) / SKILL_NAME
            if copy_bundle(destination, args.force):
                installed.append(destination)
    if not args.no_pip and not install_python_package(args.images, args.ai_images):
        print("[WARN] pip installation failed")
    if args.render_deps:
        install_render_deps()
    print(f"Installed {SKILL_NAME} {SKILL_VERSION}: {len(installed)} skill bundle(s). Restart the coding assistant to reload skills.")
```

</details>

**依据 8 · 源码核查**：[skill/scripts/check_runtime.py:12-40](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/scripts/check_runtime.py#L12-L40)

模块探测/渲染缺失不纳入ok。

<details>
<summary>查看原文（29行）</summary>

```text
    print(f"Python: {sys.version.split()[0]}")
    ok = sys.version_info >= (3, 10)
    print(f"  {'OK' if ok else 'MISSING'} Python >= 3.10")

    for module, label in (
        ("pptx_designer", "pptx-designer"),
        ("pptx", "python-pptx"),
        ("PIL", "Pillow"),
    ):
        try:
            loaded = importlib.import_module(module)
            version = getattr(loaded, "__version__", "")
            suffix = f" {version}" if version else ""
            print(f"  OK {label}{suffix}")
        except Exception as exc:  # pragma: no cover - diagnostic path
            ok = False
            print(f"  MISSING {label}: {exc}")

    fallback_ready = True
    for command, label in (("soffice", "LibreOffice"), ("pdftoppm", "Poppler pdftoppm")):
        found = resolve_executable(command)
        fallback_ready = fallback_ready and bool(found)
        print(f"  {'OK' if found else 'MISSING'} {label}{f' ({found})' if found else ''}")

    if fallback_ready:
        print("  OK LibreOffice + Poppler fallback renderer is available.")
    else:
        print("  INFO Fallback renderer is unavailable; PowerPoint COM is checked only by render_pptx.ps1.")
    return 0 if ok else 1
```

</details>

**依据 9 · 源码核查**：[skill/references/install-and-runtime.md:17-29](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/references/install-and-runtime.md#L17-L29)

最低版本/实际模块要求。

<details>
<summary>查看原文（13行）</summary>

````text
```

Use `skill/scripts/check_runtime.py` before a generation task. It reports
missing Python or rendering dependencies without silently changing the user's
environment.

For a theme-guided task, record the installed package version and module path
before generation. The requested package version is not sufficient evidence:

```powershell
python -c "import pptx_designer; print(pptx_designer.__version__); print(pptx_designer.__file__)"
```

````

</details>

**依据 10 · 源码核查**：[skill/scripts/render_pptx.ps1:1-50](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/scripts/render_pptx.ps1#L1-L50)

数页/清旧/非空数量。

<details>
<summary>查看原文（50行）</summary>

```text
param(
    [Parameter(Mandatory = $true)][string]$InFile,
    [string]$OutDir = ""
)

$ErrorActionPreference = "Stop"
$inputPath = (Resolve-Path -LiteralPath $InFile).Path
if ([string]::IsNullOrWhiteSpace($OutDir)) {
    $OutDir = Join-Path (Split-Path -Parent $inputPath) ("render_" + [IO.Path]::GetFileNameWithoutExtension($inputPath))
}
$outPath = [IO.Path]::GetFullPath($OutDir)
New-Item -ItemType Directory -Force -Path $outPath | Out-Null
$pdfPath = Join-Path $outPath ([IO.Path]::GetFileNameWithoutExtension($inputPath) + ".pdf")
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-PptxSlideCount {
    $archive = [System.IO.Compression.ZipFile]::OpenRead($inputPath)
    try {
        $count = @($archive.Entries | Where-Object {
            $_.FullName -match '^ppt/slides/slide\d+\.xml$'
        }).Count
        if ($count -lt 1) { throw "No slide XML files found in $inputPath" }
        return $count
    } finally {
        $archive.Dispose()
    }
}

function Clear-PreviousRenderArtifacts {
    if (Test-Path -LiteralPath $pdfPath) {
        [System.IO.File]::Delete($pdfPath)
    }
    Get-ChildItem -LiteralPath $outPath -File -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -match '^slide(?:\d+|-\d+)\.png$' } |
        ForEach-Object { [System.IO.File]::Delete($_.FullName) }
}

function Assert-RenderedSlides([int]$ExpectedCount) {
    $slides = @(Get-ChildItem -LiteralPath $outPath -File -Filter 'slide*.png' |
        Where-Object { $_.Name -match '^slide\d+\.png$' })
    if ($slides.Count -ne $ExpectedCount) {
        throw "Expected $ExpectedCount rendered PNGs, found $($slides.Count) in $outPath"
    }
    foreach ($slide in $slides) {
        if ($slide.Length -le 0) { throw "Rendered PNG is empty: $($slide.FullName)" }
    }
}

$sourceSlideCount = Get-PptxSlideCount
Clear-PreviousRenderArtifacts
```

</details>

**依据 11 · 源码核查**：[skill/scripts/render_pptx.ps1:52-75](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/scripts/render_pptx.ps1#L52-L75)

COM导出。

<details>
<summary>查看原文（24行）</summary>

```text
function Export-WithPowerPoint {
    $ppt = $null
    $pres = $null
    try {
        $ppt = New-Object -ComObject PowerPoint.Application
        # Do not force Visible here: some Office builds reject hiding the
        # application window when launched through COM.
        $pres = $ppt.Presentations.Open($inputPath, $false, $false, $false)
        # SaveAs with ppSaveAsPDF (32) is more compatible with PowerPoint COM
        # than ExportAsFixedFormat on installations with strict COM binding.
        $pres.SaveAs($pdfPath, 32)
        for ($i = 1; $i -le $pres.Slides.Count; $i++) {
            $png = Join-Path $outPath ("slide{0:D2}.png" -f $i)
            $pres.Slides.Item($i).Export($png, "PNG", 1280, 720)
        }
        Write-Output ("EXPORTED via PowerPoint: {0} slides -> {1}" -f $pres.Slides.Count, $outPath)
        return $true
    } finally {
        if ($pres) { $pres.Close() }
        if ($ppt) { $ppt.Quit() }
        if ($pres) { [Runtime.InteropServices.Marshal]::ReleaseComObject($pres) | Out-Null }
        if ($ppt) { [Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null }
    }
}
```

</details>

**依据 12 · 源码核查**：[skill/scripts/render_pptx.ps1:115-145](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/scripts/render_pptx.ps1#L115-L145)

fallback与最终检查。

<details>
<summary>查看原文（31行）</summary>

```text
$rendered = $false
try {
    [void](Export-WithPowerPoint)
    $rendered = $true
} catch {
    Write-Warning ("PowerPoint COM unavailable or failed: " + $_.Exception.Message)
}

if (-not $rendered) {
    try {
        $soffice = Resolve-RenderExecutable "soffice"
        $pdftoppm = Resolve-RenderExecutable "pdftoppm"
        if (-not $soffice) { throw "LibreOffice (soffice) was not found" }
        if (-not $pdftoppm) { throw "Poppler (pdftoppm) was not found" }
        & $soffice --headless --convert-to pdf --outdir $outPath $inputPath | Out-Null
        if (-not (Test-Path -LiteralPath $pdfPath)) {
            throw "LibreOffice did not create $pdfPath"
        }
        for ($i = 1; $i -le $sourceSlideCount; $i++) {
            $prefix = Join-Path $outPath ("slide{0:D2}" -f $i)
            & $pdftoppm -png -r 96 -f $i -l $i -singlefile $pdfPath $prefix
            if ($LASTEXITCODE -ne 0) { throw "Poppler failed to render slide $i" }
        }
        Write-Output ("EXPORTED via LibreOffice + Poppler -> {0}" -f $outPath)
    } catch {
        Write-Error $_
        exit 1
    }
}

Assert-RenderedSlides -ExpectedCount $sourceSlideCount
```

</details>

#### 缺口

- 外部引擎实际版本/API、字体/渲染兼容与换版恢复未运行
  **影响**：固定Skill不固定生成环境，模块可import不等完整交付链通过
  **进一步探讨**：隔离venv固定库/renderer/font，核版本路径、生成→重开→PNG和可编辑任务，失败保旧Skill/输出副本。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · QA核记录还是视觉/内容正确？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

QA文档明确视觉由LLM看PNG，不是独立视觉模型/评分服务/自动返工引擎；先看视觉主张/焦点/密度，再查overflow/可读/要求等硬问题，用户仍最终主观批准。run_visual_workflow是持久状态机且非法跳转拒，非valid prototype_status会BLOCKED，写temp/fsync/replace；但confirm/pass是调用者CLI动作，不核真实用户确认、实际PNG或图像质量。状态PASS不能单独代交付验收。

acceptance_record验证schema、六criteria唯一、分数相加、PASS>=9且readability/editability>=1；runtime_trace验证列表无重复、P01/最终gate关系、失败理由和VI module path。它们证明字段/数值一致，不证明证据文字真实、用户确认或每条MUST实际通过；trace核心必填无PPTX/PNG内容hash，schema留extensions可自扩，不等已有强制产物绑定。

更具体的默认安装缺口：installer直接copy ROOT/skill内容到例如~/.codex/skills/ppt-design-skill，校验脚本却ROOT=__file__.parents[2]再拼ROOT/skill/schemas。repo中skill/scripts→repo→skill/schemas成立；安装后scripts→父skills目录→父skills/skill/schemas，而实际schemas在ppt-design-skill/schemas。validate_acceptance_record/validate_runtime_trace无schema路径参数，会读错；visual_pack虽解析--root，main仍用全局SCHEMA_DIR/INDEXES且未用args.root改变，正常安装布局不能据repo内校验通过认安装后QA可用。此为静态路径推导，未运行复现；不扩大为所有初始化/渲染都坏。

prototype validator核source/preview/recipe/objectmap文件存在、PPTX slide id范围、license_status/context_allowed字段；review audit仅核单PPTX/页数文字和部分render路径，不独立鉴定授权/视觉。scientific eval自称LLM PNG review、READY_FOR_USER_CONFIRMATION，记录r1/r2返工过程但不是最终用户验收或正确性评测。应保留作者证据价值，同时不把自评PASS/数量当质量效果或外部引擎原生可编辑已独立检查。

#### 证据与依据

**依据 1 · 源码核查**：[skill/references/qa-and-delivery.md:1-17](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/references/qa-and-delivery.md#L1-L17)

明确人工/LLM视觉而非评分服务。

<details>
<summary>查看原文（17行）</summary>

```text
# QA and delivery

Visual QA is performed by the LLM reviewing rendered PNGs. This skill does not
implement a separate visual model, scoring service, or automatic visual
revision engine.

## Basic structural checks

Before visual review:

- the build script exits successfully;
- the PPTX exists at the requested path;
- the PPTX can be reopened;
- slide count and page size are reasonable;
- expected images exist;
- SVG errors are absent and warnings are understood;
- important content is not a single rasterized page image.
```

</details>

**依据 2 · 源码核查**：[skill/scripts/run_visual_workflow.py:11-73](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/scripts/run_visual_workflow.py#L11-L73)

真实状态/CLI条件与原子记录。

<details>
<summary>查看原文（63行）</summary>

```text
STATES = {"INIT", "ROUTED", "DIRECTION_PENDING", "PLANNED", "P01_PENDING", "P01_PASS", "P01_REVISION", "BLOCKED", "REVIEW_PENDING", "PASS"}
TRANSITIONS = {
    "INIT": {"route": "ROUTED"},
    "ROUTED": {"directions": "DIRECTION_PENDING"},
    "DIRECTION_PENDING": {"confirm": "PLANNED", "block": "BLOCKED"},
    "PLANNED": {"p01": "P01_PENDING"},
    "P01_PENDING": {"pass": "P01_PASS", "revise": "P01_REVISION", "block": "BLOCKED"},
    "P01_REVISION": {"p01": "P01_PENDING"},
    "P01_PASS": {"review": "REVIEW_PENDING"},
    "REVIEW_PENDING": {"pass": "PASS", "revise": "PLANNED", "block": "BLOCKED"},
    "BLOCKED": {"resume": "ROUTED"},
}


def write_atomic(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, name = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            json.dump(value, handle, ensure_ascii=False, indent=2)
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(name, path)
    finally:
        if os.path.exists(name):
            os.unlink(name)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("state_file", type=Path)
    parser.add_argument("action", choices=sorted({a for actions in TRANSITIONS.values() for a in actions}))
    parser.add_argument("--prototype-status", choices=["valid", "stale", "invalid", "blocked"])
    args = parser.parse_args()
    now = datetime.now(timezone.utc).isoformat()
    state = json.loads(args.state_file.read_text(encoding="utf-8")) if args.state_file.exists() else {"status": "INIT", "attempt": 0, "history": []}
    current = state.get("status", "INIT")
    if args.prototype_status and args.prototype_status != "valid" and current != "BLOCKED" and args.action != "resume":
        state.update({"status": "BLOCKED", "attempt": state.get("attempt", 0) + 1, "updated_at": now})
        state.setdefault("history", []).append({
            "from": current,
            "action": "preflight_block",
            "to": "BLOCKED",
            "prototype_status": args.prototype_status,
            "at": now,
        })
        write_atomic(args.state_file, state)
        print(json.dumps(state, ensure_ascii=False))
        return 1
    if current not in STATES or args.action not in TRANSITIONS.get(current, {}):
        print(f"ERROR: action {args.action!r} is invalid from {current!r}")
        return 1
    next_state = TRANSITIONS[current][args.action]
    state.update({"status": next_state, "attempt": state.get("attempt", 0) + 1, "updated_at": now})
    state.setdefault("history", []).append({"from": current, "action": args.action, "to": next_state, "at": now})
    write_atomic(args.state_file, state)
    print(json.dumps(state, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

</details>

**依据 3 · 源码核查**：[skill/scripts/validate_acceptance_record.py:9-33](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/scripts/validate_acceptance_record.py#L9-L33)

repo根假设与分数schema规则。

<details>
<summary>查看原文（25行）</summary>

```text
ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))
from validate_visual_pack import ValidationError, check_schema, load_json  # noqa: E402


def validate_record(record: dict) -> None:
    schema = load_json(ROOT / "skill/schemas/acceptance-record.schema.json")
    check_schema(record, schema, root=schema)
    criteria = record["criteria"]
    ids = [item["id"] for item in criteria]
    if len(ids) != len(set(ids)):
        raise ValidationError("criteria IDs must be unique")
    score_sum = sum(item["score"] for item in criteria)
    if record["score"] != score_sum:
        raise ValidationError(f"score must equal criteria sum ({score_sum})")
    required_ids = {"visual_thesis", "composition", "material", "readability", "editability", "reproducibility"}
    if set(ids) != required_ids:
        raise ValidationError(f"criteria IDs must be exactly {sorted(required_ids)}")
    if record["status"] == "PASS":
        if record["score"] < 9:
            raise ValidationError("PASS requires score >= 9")
        lower_bounds = {item["id"]: item["score"] for item in criteria}
        if lower_bounds["readability"] < 1 or lower_bounds["editability"] < 1:
            raise ValidationError("PASS requires readability and editability >= 1")
    elif record["status"] == "NEEDS_REVISION" and record["score"] >= 9:
```

</details>

**依据 4 · 源码核查**：[skill/scripts/validate_runtime_trace.py:9-33](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/scripts/validate_runtime_trace.py#L9-L33)

repo根假设与gate一致性。

<details>
<summary>查看原文（25行）</summary>

```text
ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))
from validate_visual_pack import ValidationError, check_schema, load_json  # noqa: E402


def validate_trace(trace: dict) -> None:
    schema = load_json(ROOT / "skill/schemas/runtime-trace.schema.json")
    check_schema(trace, schema, root=schema)
    for field in ("prototype_ids", "recipe_ids", "composition_ids"):
        values = trace.get(field, [])
        if len(values) != len(set(values)):
            raise ValidationError(f"{field} must not contain duplicates")
    p01 = trace["p01_gate"]
    final = trace["final_visual_gate"]
    if p01 == "BLOCKED" and final == "PASS":
        raise ValidationError("final_visual_gate cannot PASS when p01_gate is BLOCKED")
    if final == "PASS" and p01 != "PASS":
        raise ValidationError("final_visual_gate PASS requires p01_gate PASS")
    if final != "PASS" and not trace.get("failure_reason"):
        raise ValidationError("failure_reason is required when final_visual_gate is not PASS")
    if trace["mode"] == "vi_build" and not trace.get("package_module_path"):
        raise ValidationError("vi_build traces require package_module_path")


def main() -> int:
```

</details>

**依据 5 · 源码核查**：[skill/schemas/runtime-trace.schema.json:6-29](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/schemas/runtime-trace.schema.json#L6-L29)

必填记录/可选theme/扩展非输出hash。

<details>
<summary>查看原文（24行）</summary>

```text
  "additionalProperties": false,
  "required": ["run_id", "mode", "prototype_ids", "recipe_ids", "seed", "package_version", "p01_gate", "final_visual_gate"],
  "properties": {
    "run_id": { "type": "string", "minLength": 1 },
    "mode": { "type": "string", "enum": ["build", "freestyle", "vi_build"] },
    "prototype_ids": { "type": "array", "items": { "type": "string" } },
    "recipe_ids": { "type": "array", "items": { "type": "string" } },
    "rendering_pack": { "type": "string" },
    "composition_ids": { "type": "array", "items": { "type": "string" } },
    "grammar_lock_version": { "type": "string" },
    "theme_lock_version": { "type": "string" },
    "resolved_theme_fingerprint": { "type": "string" },
    "seed": { "type": "integer" },
    "package_version": { "type": "string", "minLength": 1 },
    "package_module_path": { "type": "string" },
    "svg_assistance": { "type": "array", "items": { "type": "object" } },
    "p01_gate": { "$ref": "#/$defs/gate" },
    "final_visual_gate": { "$ref": "#/$defs/gate" },
    "failure_reason": { "type": "string" },
    "extensions": { "type": "object" }
  },
  "$defs": {
    "gate": { "type": "string", "enum": ["PASS", "NEEDS_REVISION", "BLOCKED"] }
  }
```

</details>

**依据 6 · 源码核查**：[installer/install.py:18-47](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/installer/install.py#L18-L47)

安装真实copy布局。

<details>
<summary>查看原文（30行）</summary>

```text

SKILL_NAME = "ppt-design-skill"
SKILL_VERSION = "1.4"
ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "skill"


def copy_bundle(destination: Path, force: bool) -> bool:
    if destination.exists() and not force:
        print(f"[SKIP] {destination} exists; use --force to replace it")
        return False
    destination.parent.mkdir(parents=True, exist_ok=True)
    # A skill installation is a complete bundle, not an additive overlay.
    # Older releases shipped a ``src/ppt_pro_max`` tree and legacy entrypoint
    # files. Replace the dedicated skill directory so those files cannot be
    # discovered as part of the new Skill runtime path.
    staging = destination.with_name(f".{destination.name}.installing")
    if staging.exists():
        shutil.rmtree(staging)
    shutil.copytree(
        SOURCE,
        staging,
        ignore=shutil.ignore_patterns("__pycache__", "*.pyc"),
    )
    # Build the replacement completely before removing the current bundle. If
    # copying fails, the existing installation is left intact.
    if destination.exists():
        shutil.rmtree(destination)
    staging.replace(destination)
    print(f"[OK] skill bundle -> {destination}")
```

</details>

**依据 7 · 源码核查**：[installer/install.py:147-156](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/installer/install.py#L147-L156)

实际目标技能目录。

<details>
<summary>查看原文（10行）</summary>

```text
    home = Path.home()
    if not args.no_global:
        for key in keys:
            destination = global_path(PLATFORMS[key], home) / SKILL_NAME
            if copy_bundle(destination, args.force):
                installed.append(destination)
    if args.project:
        for key in keys:
            destination = project_path(PLATFORMS[key], args.target) / SKILL_NAME
            if copy_bundle(destination, args.force):
```

</details>

**依据 8 · 源码核查**：[skill/scripts/validate_visual_pack.py:11-17](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/scripts/validate_visual_pack.py#L11-L17)

repo根schema/index路径。

```text
ROOT = Path(__file__).resolve().parents[2]
SCHEMA_DIR = ROOT / "skill" / "schemas"
INDEXES = {
    "packs": ROOT / "skill" / "references" / "visual-rendering-packs" / "rendering_packs_index.json",
    "compositions": ROOT / "skill" / "references" / "composition-recipes" / "composition_index.json",
    "prototypes": ROOT / "skill" / "templates" / "case-prototype-index.json",
}
```

**依据 9 · 源码核查**：[skill/scripts/validate_visual_pack.py:224-234](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/scripts/validate_visual_pack.py#L224-L234)

--root解析但main用全局。

<details>
<summary>查看原文（11行）</summary>

```text
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=ROOT)
    args = parser.parse_args()
    errors = validate_schema_files() + validate_indexes()
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1
    print("OK: schema files and empty/runtime indexes are valid")
    return 0

```

</details>

**依据 10 · 源码核查**：[skill/scripts/validate_visual_pack.py:113-137](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/scripts/validate_visual_pack.py#L113-L137)

原型文件/页数和授权字段。

<details>
<summary>查看原文（25行）</summary>

```text
        raise ValidationError(f"{record_label}: missing case root {record['case_root']}")
    for field in ("source_paths", "preview_paths", "recipe_paths", "object_map_paths"):
        for rel in record[field]:
            resolved = relative_inside(case_root, rel)
            if not resolved.is_file():
                raise ValidationError(f"{record_label}.{field}: missing file {rel}")
    source_pptx = [relative_inside(case_root, rel) for rel in record["source_paths"] if rel.lower().endswith(".pptx")]
    if not source_pptx:
        raise ValidationError(f"{record_label}.source_paths: at least one PPTX is required")
    slide_count = pptx_slide_count(source_pptx[0])
    for slide_id in record["slide_ids"]:
        match = re.fullmatch(r"P(\d+)", slide_id)
        if not match or int(match.group(1)) > slide_count:
            raise ValidationError(f"{record_label}.slide_ids: {slide_id} is outside PPTX slide count {slide_count}")
    if record.get("license_status") != "verified" or record.get("context_allowed") is not True:
        if record_label.startswith("prototype["):
            raise ValidationError(f"{record_label}: unverified or disallowed evidence must remain blocked")
    if not record_path.is_file():
        raise ValidationError(f"{record_label}: missing record file {record_path}")


def validate_indexes() -> list[str]:
    errors: list[str] = []
    loaded: dict[str, dict[str, Any]] = {}
    for label, path in INDEXES.items():
```

</details>

**依据 11 · 源码核查**：[skill/scripts/audit_visual_review_records.py:20-40](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/scripts/audit_visual_review_records.py#L20-L40)

review审计局限。

<details>
<summary>查看原文（21行）</summary>

```text
    pptx_files = sorted((case_root / "output").glob("*.pptx"))
    errors: list[str] = []
    if not review.is_file():
        return {"case_id": case_root.name, "status": "BLOCKED", "errors": ["missing visual-review.md"]}
    if len(pptx_files) != 1:
        errors.append(f"expected one output PPTX, found {len(pptx_files)}")
    if len(pptx_files) == 1:
        pages = pptx_pages(pptx_files[0])
        text = review.read_text(encoding="utf-8")
        page_claims = [int(value) for value in re.findall(r"(?:\b|/)(\d+) slides\b|(?:\b|/)(\d+) pages\b", text) for value in value if value]
        if page_claims and pages not in page_claims:
            errors.append(f"review page claim {page_claims} does not match PPTX page count {pages}")
        for rel in re.findall(r"`(rendered/[^`]*slide0?1\.png)`", text):
            if not (case_root / rel).is_file():
                errors.append(f"missing review render path: {rel}")
        result = {"case_id": case_root.name, "pptx_slide_count": pages, "status": "PASS" if not errors else "BLOCKED", "errors": errors}
        return result
    return {"case_id": case_root.name, "status": "BLOCKED", "errors": errors}


def main() -> int:
```

</details>

**依据 12 · 源码核查**：[evals/003-scientific-research/visual-review.md:1-9](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/evals/003-scientific-research/visual-review.md#L1-L9)

作者自评待用户确认。

```text
# Visual review — scientific research results deck

## Status

`READY_FOR_USER_CONFIRMATION`

This is an LLM visual review of the rendered PNG files in `rendered-r3/`.
It is not an automated visual-QA score and does not replace final user review.

```

**依据 13 · 源码核查**：[evals/003-scientific-research/visual-review.md:38-47](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/evals/003-scientific-research/visual-review.md#L38-L47)

作者返工与科学有效性限制。

<details>
<summary>查看原文（10行）</summary>

```text
The first rendered version was **not** accepted: its results and discussion pages
were structurally correct but materially underfilled. The revision added a cover
signal map, a question-to-validation band, result interpretation/boundary bands,
and a three-part discussion structure. The second revision also fixed wrapped
`CONTROL` / `TREATMENT` labels. The current `rendered-r3/` PNGs are ready for user
confirmation for this evaluation brief.

This test validates domain-specific art direction and narrative switching; it does
not claim that the skill can verify the scientific validity of supplied data or
independently assess image-generation quality.
```

</details>

#### 缺口

- 安装后schema路径错误、渲染版本差异及审阅记录对应当前产物未实测
  **影响**：常规安装QA不能直接信任，交付与采用需先修/核路径，视觉仍独立审
  **进一步探讨**：临时目标复制布局分别repo/installed运行validators（另授权），改路径后核当前PPTX/PDF/PNG摘要与审阅，不能绕过看图。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 交付成本、采用和退出？

**研究主题**：采用判断、效果与总成本

#### 完整回答

先观察常规安装交付链；能读Python/手工复核PPT的作者可在隔离repo/venv做试验，但先处理已定位校验路径和版本/renderer问题。不能让客户交付任务首次才发现schema找错或缺COM/fallback；如果只要快速草稿，可用FreeStyle/现模板并显式标草稿，别冒充完整交付。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 可读Skill/支持执行与看图的Agent | 方法必需 | 规划/生成编排/PNG复核 | 不是独立服务自动完成 |
| Python>=3.10、实际pptx-designer合约 | 生成必需 | 外部引擎/主题 | pip成功/import不够，核版本路径 |
| PowerPoint COM或LO+Poppler/字体 | PNG交付必需 | 重开、PDF/逐页预览 | check_runtime0不证明可渲染 |
| 修正/核对安装后schema路径 | 记录校验必需 | acceptance/trace/pack | repo通过不能替安装布局 |
| 内容/模板/图片授权与方向批准 | 业务必需 | 事实/品牌/视觉目标 | 自评/字段verified不代许可 |
| 图片provider/key | AI图才需 | 可选生成 | 另有费用/数据边界，无key用本地 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 环境小样 | 固定venv/库/字体/renderer、核安装路径 | 真正生成/重开/逐页图可读 |
| 需求决策 | 用户确认brief/页目标/方向/模板 | 未决不写客户build |
| 首版P01 | 生成样页并看PNG | 视觉主张/可读/原生编辑满足 |
| 全稿返工 | 逐页双门、改源重渲染 | 当前图对应当前稿、MUST全过 |
| 交付退出 | 保PPTX/build/PDF/PNG/review和环境版本 | 用户接受；卸Skill不清客户文件/凭据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 外部库/Office或系统包/字体未知 | 环境与路径修复、学习API/方向确认 | 自动pip非精确pin |
| 持续使用 | 模型/图片/渲染与本地资源未知 | 内容审阅、逐页视觉/品牌返工 | 无净节时/客户接受对照 |
| 失败恢复 | 重建/重渲染、版本/副本未知 | 修API/字体/主题与QA记录 | 安装删旧后rename无自动回滚 |
| 升级退出 | venv/模板/素材/输出存储未知 | 固定版本与迁移客户成果/key | pip升级不只影响Skill目录 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 设计流程 | 方向/Theme/逐页返工规则 | 客户喜好/净返工改进 |
| 新鲜渲染 | 清旧文件、数页/非空检查 | 图像可读/内容正确或编辑体验 |
| QA记录 | schema/分数/状态一致性 | 真实确认/PNG质量及安装后可用 |
| 可编辑成果 | 外部引擎API/样例build方法 | 当前产物原生对象/字体兼容独验 |

发现库/模块路径不对、安装校验schema缺失、无法渲染、模板冲突或材料MUST未达时，停止正式交付，保源稿/旧版本和输出，先修环境/路径并重渲染逐页核对；用户未接受方向只能交明确草稿，不能用PASS字段替认可。

#### 证据与依据

**依据 1 · 源码核查**：[skill/SKILL.md:38-71](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/SKILL.md#L38-L71)

交付/确认要求。

<details>
<summary>查看原文（34行）</summary>

```text
## Stop before writing code

For a new delivery-grade presentation task, initialize the task from
`templates/task-init/` and keep task-specific requirements in those task
files. Run `init_presentation_task.py` from the loaded Skill's `scripts/`
directory (use its absolute path if the working directory is the project):
`python <skill-root>/scripts/init_presentation_task.py --project <project-root>
--name <lowercase-task-slug>`. It creates an isolated
`<project-root>/ppt_tasks/<task-slug>/` and refuses to overwrite it. Do not
begin implementation while a required research or direction decision remains
unresolved.

For a delivery-grade deck, do not write the build script until these decisions
are explicit:

- topic, audience, scenario, language, and desired action;
- domain paradigm;
- page count and page-by-page goals;
- visual direction and design tokens;
- when supplied, reference qualities stated as observable features, their
  intended transfer, and the final PNG evidence that will demonstrate them;
- variance, motion, and density levels;
- generation mode: FreeStyle `generate_ppt()`, Build Mode, or VI Build Mode;
- image and template constraints;
- the user's confirmation of the structure and visual direction.

The only acceptable shortcut is an explicitly requested quick exploratory draft.

## Non-negotiable outcome

A PPTX file that merely runs successfully is not complete. A task is complete
only after the deck has been rendered through the confirmed `PPTX -> PDF ->
PNG` path, the LLM has inspected the PNG output, material visual issues have
been revised, and the user has confirmed the final direction or result.
```

</details>

**依据 2 · 源码核查**：[installer/install.py:24-67](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/installer/install.py#L24-L67)

替换/外部pip成本。

<details>
<summary>查看原文（44行）</summary>

```text

def copy_bundle(destination: Path, force: bool) -> bool:
    if destination.exists() and not force:
        print(f"[SKIP] {destination} exists; use --force to replace it")
        return False
    destination.parent.mkdir(parents=True, exist_ok=True)
    # A skill installation is a complete bundle, not an additive overlay.
    # Older releases shipped a ``src/ppt_pro_max`` tree and legacy entrypoint
    # files. Replace the dedicated skill directory so those files cannot be
    # discovered as part of the new Skill runtime path.
    staging = destination.with_name(f".{destination.name}.installing")
    if staging.exists():
        shutil.rmtree(staging)
    shutil.copytree(
        SOURCE,
        staging,
        ignore=shutil.ignore_patterns("__pycache__", "*.pyc"),
    )
    # Build the replacement completely before removing the current bundle. If
    # copying fails, the existing installation is left intact.
    if destination.exists():
        shutil.rmtree(destination)
    staging.replace(destination)
    print(f"[OK] skill bundle -> {destination}")
    return True


def install_python_package(with_images: bool = False, with_ai_images: bool = False) -> bool:
    package = "pptx-designer"
    extras = []
    if with_images:
        extras.append("images")
    if with_ai_images:
        extras.append("ai-images")
    if extras:
        package += "[" + ",".join(extras) + "]"
    before = installed_package_version("pptx-designer")
    print(f"Checking pptx-designer (installed: {before or 'missing'})...")
    result = subprocess.run([sys.executable, "-m", "pip", "install", "--upgrade", package], check=False)
    if result.returncode == 0:
        after = installed_package_version("pptx-designer") or "unknown version"
        status = "updated" if before and before != after else "ready"
        print(f"[OK] pptx-designer {after} ({status})")
    return result.returncode == 0
```

</details>

**依据 3 · 源码核查**：[skill/scripts/check_runtime.py:12-40](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/scripts/check_runtime.py#L12-L40)

runtime探测局限。

<details>
<summary>查看原文（29行）</summary>

```text
    print(f"Python: {sys.version.split()[0]}")
    ok = sys.version_info >= (3, 10)
    print(f"  {'OK' if ok else 'MISSING'} Python >= 3.10")

    for module, label in (
        ("pptx_designer", "pptx-designer"),
        ("pptx", "python-pptx"),
        ("PIL", "Pillow"),
    ):
        try:
            loaded = importlib.import_module(module)
            version = getattr(loaded, "__version__", "")
            suffix = f" {version}" if version else ""
            print(f"  OK {label}{suffix}")
        except Exception as exc:  # pragma: no cover - diagnostic path
            ok = False
            print(f"  MISSING {label}: {exc}")

    fallback_ready = True
    for command, label in (("soffice", "LibreOffice"), ("pdftoppm", "Poppler pdftoppm")):
        found = resolve_executable(command)
        fallback_ready = fallback_ready and bool(found)
        print(f"  {'OK' if found else 'MISSING'} {label}{f' ({found})' if found else ''}")

    if fallback_ready:
        print("  OK LibreOffice + Poppler fallback renderer is available.")
    else:
        print("  INFO Fallback renderer is unavailable; PowerPoint COM is checked only by render_pptx.ps1.")
    return 0 if ok else 1
```

</details>

**依据 4 · 源码核查**：[skill/scripts/validate_runtime_trace.py:9-33](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/scripts/validate_runtime_trace.py#L9-L33)

已定位安装schema路径。

<details>
<summary>查看原文（25行）</summary>

```text
ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))
from validate_visual_pack import ValidationError, check_schema, load_json  # noqa: E402


def validate_trace(trace: dict) -> None:
    schema = load_json(ROOT / "skill/schemas/runtime-trace.schema.json")
    check_schema(trace, schema, root=schema)
    for field in ("prototype_ids", "recipe_ids", "composition_ids"):
        values = trace.get(field, [])
        if len(values) != len(set(values)):
            raise ValidationError(f"{field} must not contain duplicates")
    p01 = trace["p01_gate"]
    final = trace["final_visual_gate"]
    if p01 == "BLOCKED" and final == "PASS":
        raise ValidationError("final_visual_gate cannot PASS when p01_gate is BLOCKED")
    if final == "PASS" and p01 != "PASS":
        raise ValidationError("final_visual_gate PASS requires p01_gate PASS")
    if final != "PASS" and not trace.get("failure_reason"):
        raise ValidationError("failure_reason is required when final_visual_gate is not PASS")
    if trace["mode"] == "vi_build" and not trace.get("package_module_path"):
        raise ValidationError("vi_build traces require package_module_path")


def main() -> int:
```

</details>

**依据 5 · 源码核查**：[skill/references/qa-and-delivery.md:110-144](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/references/qa-and-delivery.md#L110-L144)

返工和交付内容。

<details>
<summary>查看原文（35行）</summary>

````text

- hierarchy and first-read message;
- alignment, spacing, balance, and safe margins;
- readability at 16:9 presentation scale;
- text overflow, clipping, and overlap;
- chart, diagram, and image legibility;
- palette, typography, contrast, and consistency;
- domain and audience fit;
- whether the page looks deliberate rather than generic.
- whether the rendered deck reflects the resolved theme rather than a stale
  token set or default fallback.

Apply a higher bar to whitespace: first identify the intended role of the empty
area (focus, pacing, hierarchy, or image breathing room). If no such role is
visible, treat a large unoccupied region as a design defect and mark the page
`NEEDS_REVISION`. Every page should have a clear visual anchor and a complete
takeaway. Minimalism means reducing nonessential elements, not delivering a
partially planned page.

Example issue record:

```text
Visual review: NEEDS_REVISION
Requirement: R2 [MUST]
Slide 4, right chart: labels are too small and the chart has six low-value categories.
Cause: chart region is too narrow for the selected data.
Action: keep the four material categories, enlarge labels, and rerender.
```

Do not claim `PASS` while a material issue remains. After every material
revision, rerun the build, render, and PNG review.

## Delivery package

For a delivery-grade task, provide:
````

</details>

#### 缺口

- 安装路径修正、客户接受/返工/编辑净成本未对照
  **影响**：观察为先，不推荐未核环境直接客户交付
  **进一步探讨**：隔离样稿盲审/编辑与现模板对照，修好路径后再评估扩大。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 现trace上的可证伪生产方向？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是“与当前产物绑定的验收包”：把实际加载引擎/字体/renderer与resolved theme、build/内容源摘要、PPTX/PDF/每页PNG摘要，绑定用户方向批准和逐页MUST证据；源稿/模板/主题/renderer变化使相关验收失效，不允许旧review自动沿用。

已有task manifest、Theme fingerprint、runtime trace、原型文件/页数检查和清旧render是基础，不声称从无到有造QA。新增在成果/审阅记录一致性和改动失效，而不是造一个新的视觉打分器；先修repo假设路径再谈增加功能。它仍不能算法证明审美、事实/图片许可或用户真实接受，需保明确人工审查。

最小对照故意改build/字体/主题但保旧review、替换同名PNG、只改页数不变的内容，比较现记录与绑定包：陈旧验收检出、误阻、重渲染/复核时间和新增记录负担；再独立盲审看是否减少客户退稿。若现流程已发现同错误，或绑定只加文件不减误交付且成本更高，否定独立方向，完善现有Skill即可。未实现/测收益，不计当前能力。

#### 证据与依据

**依据 1 · 源码核查**：[skill/scripts/init_presentation_task.py:65-88](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/scripts/init_presentation_task.py#L65-L88)

已有manifest。

<details>
<summary>查看原文（24行）</summary>

```text
        fail(f"refusing to overwrite existing task: {destination}")

    destination.parent.mkdir(parents=True, exist_ok=True)
    copytree(TASK_TEMPLATE, destination)
    manifest = {
        "task_id": str(uuid.uuid4()),
        "task_name": args.name,
        "skill": "ppt-design-skill",
        "skill_version": SKILL_VERSION,
        "template_source": "skill/templates/task-init",
        "project_root": str(project),
        "task_root": str(destination),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    (destination / ".task-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"[OK] initialized task -> {destination}")
    print(json.dumps(manifest, ensure_ascii=False))
    return 0


if __name__ == "__main__":
```

</details>

**依据 2 · 源码核查**：[skill/schemas/runtime-trace.schema.json:6-29](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/schemas/runtime-trace.schema.json#L6-L29)

已有runtime/theme记录。

<details>
<summary>查看原文（24行）</summary>

```text
  "additionalProperties": false,
  "required": ["run_id", "mode", "prototype_ids", "recipe_ids", "seed", "package_version", "p01_gate", "final_visual_gate"],
  "properties": {
    "run_id": { "type": "string", "minLength": 1 },
    "mode": { "type": "string", "enum": ["build", "freestyle", "vi_build"] },
    "prototype_ids": { "type": "array", "items": { "type": "string" } },
    "recipe_ids": { "type": "array", "items": { "type": "string" } },
    "rendering_pack": { "type": "string" },
    "composition_ids": { "type": "array", "items": { "type": "string" } },
    "grammar_lock_version": { "type": "string" },
    "theme_lock_version": { "type": "string" },
    "resolved_theme_fingerprint": { "type": "string" },
    "seed": { "type": "integer" },
    "package_version": { "type": "string", "minLength": 1 },
    "package_module_path": { "type": "string" },
    "svg_assistance": { "type": "array", "items": { "type": "object" } },
    "p01_gate": { "$ref": "#/$defs/gate" },
    "final_visual_gate": { "$ref": "#/$defs/gate" },
    "failure_reason": { "type": "string" },
    "extensions": { "type": "object" }
  },
  "$defs": {
    "gate": { "type": "string", "enum": ["PASS", "NEEDS_REVISION", "BLOCKED"] }
  }
```

</details>

**依据 3 · 源码核查**：[skill/scripts/render_pptx.ps1:29-50](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/scripts/render_pptx.ps1#L29-L50)

清旧render防陈旧基础。

<details>
<summary>查看原文（22行）</summary>

```text
function Clear-PreviousRenderArtifacts {
    if (Test-Path -LiteralPath $pdfPath) {
        [System.IO.File]::Delete($pdfPath)
    }
    Get-ChildItem -LiteralPath $outPath -File -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -match '^slide(?:\d+|-\d+)\.png$' } |
        ForEach-Object { [System.IO.File]::Delete($_.FullName) }
}

function Assert-RenderedSlides([int]$ExpectedCount) {
    $slides = @(Get-ChildItem -LiteralPath $outPath -File -Filter 'slide*.png' |
        Where-Object { $_.Name -match '^slide\d+\.png$' })
    if ($slides.Count -ne $ExpectedCount) {
        throw "Expected $ExpectedCount rendered PNGs, found $($slides.Count) in $outPath"
    }
    foreach ($slide in $slides) {
        if ($slide.Length -le 0) { throw "Rendered PNG is empty: $($slide.FullName)" }
    }
}

$sourceSlideCount = Get-PptxSlideCount
Clear-PreviousRenderArtifacts
```

</details>

**依据 4 · 源码核查**：[skill/scripts/validate_acceptance_record.py:16-33](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/scripts/validate_acceptance_record.py#L16-L33)

当前验收是记录语义。

<details>
<summary>查看原文（18行）</summary>

```text
    check_schema(record, schema, root=schema)
    criteria = record["criteria"]
    ids = [item["id"] for item in criteria]
    if len(ids) != len(set(ids)):
        raise ValidationError("criteria IDs must be unique")
    score_sum = sum(item["score"] for item in criteria)
    if record["score"] != score_sum:
        raise ValidationError(f"score must equal criteria sum ({score_sum})")
    required_ids = {"visual_thesis", "composition", "material", "readability", "editability", "reproducibility"}
    if set(ids) != required_ids:
        raise ValidationError(f"criteria IDs must be exactly {sorted(required_ids)}")
    if record["status"] == "PASS":
        if record["score"] < 9:
            raise ValidationError("PASS requires score >= 9")
        lower_bounds = {item["id"]: item["score"] for item in criteria}
        if lower_bounds["readability"] < 1 or lower_bounds["editability"] < 1:
            raise ValidationError("PASS requires readability and editability >= 1")
    elif record["status"] == "NEEDS_REVISION" and record["score"] >= 9:
```

</details>

**依据 5 · 源码核查**：[skill/scripts/audit_visual_review_records.py:20-40](https://github.com/sunchaokun/PPT-Design-Skill/blob/cbf7ef1324a026b29e2b77b71e2034554ddd3e22/skill/scripts/audit_visual_review_records.py#L20-L40)

当前粗粒度成果审计。

<details>
<summary>查看原文（21行）</summary>

```text
    pptx_files = sorted((case_root / "output").glob("*.pptx"))
    errors: list[str] = []
    if not review.is_file():
        return {"case_id": case_root.name, "status": "BLOCKED", "errors": ["missing visual-review.md"]}
    if len(pptx_files) != 1:
        errors.append(f"expected one output PPTX, found {len(pptx_files)}")
    if len(pptx_files) == 1:
        pages = pptx_pages(pptx_files[0])
        text = review.read_text(encoding="utf-8")
        page_claims = [int(value) for value in re.findall(r"(?:\b|/)(\d+) slides\b|(?:\b|/)(\d+) pages\b", text) for value in value if value]
        if page_claims and pages not in page_claims:
            errors.append(f"review page claim {page_claims} does not match PPTX page count {pages}")
        for rel in re.findall(r"`(rendered/[^`]*slide0?1\.png)`", text):
            if not (case_root / rel).is_file():
                errors.append(f"missing review render path: {rel}")
        result = {"case_id": case_root.name, "pptx_slide_count": pages, "status": "PASS" if not errors else "BLOCKED", "errors": errors}
        return result
    return {"case_id": case_root.name, "status": "BLOCKED", "errors": errors}


def main() -> int:
```

</details>

#### 缺口

- 产物绑定/失效包未实现，客户需求/收益未知
  **影响**：仅修正假设，不能当新产品方向已成立
  **进一步探讨**：上述陈旧样本和盲审测误交付/返工净时间，收益不抵则止。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
