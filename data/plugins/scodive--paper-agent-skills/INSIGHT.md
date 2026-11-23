# Paper-Agent-Skills

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[f719e06](https://github.com/Scodive/Paper-Agent-Skills/tree/f719e067d3d1b00227f462a0eba9e0c23105979c)

<!-- BEGIN META -->
[![GitHub ★ 22](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=22&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Scodive/Paper-Agent-Skills)
<!-- END META -->

> **功能**：为 DSH 注册论文修订、审稿回复和演示故事板技能，并捆绑 Python 材料与编辑校验工具。

> **亮点**：[Q02](#research-q02) 的材料摘要、精确行匹配和落盘前验证把写作建议接成可核对的编辑流程；[Q03](#research-q03) 明确机械通过与科学正确性分开。

> **主要限制**：[Q03](#research-q03) 的数值与证据存在性校验不能保证方法、指标和单位相符，科学论证仍由Agent和研究者承担。

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
  - [Q01 · 三个Skill是否真正注册，论文任务由模型还是脚本完成？](#detail-section-11)
  - [Q02 · 修订如何绑定材料并拒绝错位编辑，结果写在哪里？](#detail-section-12)
  - [Q03 · 证据检查比直接改稿增加什么，能证明科学主张成立吗？](#detail-section-13)
  - [Q04 · 首次、持续和失败恢复有哪些负担，适合怎样的试用？](#detail-section-14)
  - [Q05 · 可否将数值匹配提升为方法、指标与单位绑定，如何证伪？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有稿件、实验记录和参考文献的研究者，在 DSH 中准备可追查的修订、回复和展示材料。

直接让Agent改稿或手工逐条复制修订意见。固定证据和位置约束增加可追溯性，也增加结构化响应与人工审阅负担。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 论文修订Skill | 准备材料、生成精确编辑和差异 | 宿主Agent负责写作与科学判断，Python工具只机械校验 |
| 审稿回复Skill | 导出逐点回复任务与行动状态约定 | 不自动提交，不证明实验已做 |
| 演示故事板Skill | 从论文组织页面信息、来源与讲稿 | 输出storyboard，不渲染PowerPoint |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH skills服务及包声明的宿主版本 | 插件必需 | 注册三个provider条目 | 无法装载；实际兼容未运行 |
| Python3.10+及脚本requirements | 执行工具必需 | 材料解析与校验 | runner提示缺依赖，需配置虚拟环境 |
| 宿主Agent与模型 | 完整改稿必需 | 阅读、判断、产生response | 脚本只prepare，不会自主写稿 |
| 原稿、实验记录及文献摘录 | 有据改稿必需 | 建立主张和证据关系 | 保留缺口，书目键不能代替全文支持 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 用户装载bundle并准备Python环境 | Skill可发现，资源runner路径明确 |
| 2 | 工具prepare生成新run | 摘要与材料匹配，输入改变时新建run |
| 3 | Agent读全文和证据，写response | 各分块覆盖，未知与未做实验保留 |
| 4 | 工具validate/apply/check，用户审阅diff | 机械拒绝先修正，科学语义由用户核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 环境/磁盘资源未知 | 配Python、整理证据 | 工具无独立模型key，宿主模型费用未知 |
| 持续使用 | 模型与材料副本资源未知 | 全文阅读、结构化响应及语义复核 | 没有端到端节时数据 |
| 失败恢复 | 重新生成与模型调用未知 | 修正错位/证据错误，新建输出目录 | 原稿和旧run可保留 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 编辑一致性 | bundle/原文/重叠/证据ID验证 | 真实复杂稿件误拒率 |
| 科学核查 | 明确保留host_agent判断和科学未确认状态 | 论证正确性、引用真实性 |
| 展示与回复 | Skill约定storyboard和逐点回复 | 完整PPT或审稿结果改善 |

> **思考**：[Q03](#research-q03) 的数值与证据存在性校验不能保证方法、指标和单位相符，科学论证仍由Agent和研究者承担。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 的材料摘要、精确行匹配和落盘前验证把写作建议接成可核对的编辑流程；[Q03](#research-q03) 明确机械通过与科学正确性分开。

[Q02](#research-q02) 可借鉴材料摘要与编辑原文匹配，把准备、响应和产物分离。[Q03](#research-q03) 的机械/科学状态分离值得保留；移植时不要把逐文件发布称为单次原子提交，也不要把证据ID当语义支持证明。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的数值与证据存在性校验不能保证方法、指标和单位相符，科学论证仍由Agent和研究者承担。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先选一份有已知错误的稿件副本，核对diff和未解决项；科学证据不一致时停止应用，返回人工逐条修订。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

Skill接线与机械校验已检查，论文质量收益未验证；语义字段扩展为未实现假设。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、lib/index.js、README.md、skills/academic-paper-writing/SKILL.md、skills/academic-paper-writing/scripts/paper_agent.py、skills/academic-paper-writing/scripts/runtime/paper_agent/workflow.py、skills/academic-paper-writing/scripts/runtime/paper_agent/storage.py、skills/rebuttal-writing/SKILL.md、skills/presentation-slides/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件，重点追查论文修订安装资源的Python路径；rebuttal和slides只核查任务导出与约定，不宣称与论文修订具有同等行为证据。
- 下一步：未运行目标。后续可用同数异义及真实稿件人工标注对照语义错配检出、误拒和总时间，反例见[Q05](#research-q05)。

**分析版本**

- **仓库**：[Scodive/Paper-Agent-Skills](https://github.com/Scodive/Paper-Agent-Skills)
- **版本号**：0.2.0（[固定提交 f719e06](https://github.com/Scodive/Paper-Agent-Skills/tree/f719e067d3d1b00227f462a0eba9e0c23105979c)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 推导把主张绑定方法、数据集、split、指标和单位的未验证改进，以语义错配检出、误拒和总人工时间共同检验。

未运行目标。后续可用同数异义及真实稿件人工标注对照语义错配检出、误拒和总时间，反例见[Q05](#research-q05)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 24 | 1397 | — | — | 10811 |
| .md | example | 1 | 21 | — | — | 95 |
| .js | source | 1 | 124 | 71 | 41 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Scodive/Paper-Agent-Skills/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Scodive/Paper-Agent-Skills/issues?q=is%3Aissue+created%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Scodive/Paper-Agent-Skills/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z)



统计日期：2026-11-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：带证据ID和精确编辑的论文流程比直接改稿增加哪些约束，又保留哪些科学判断责任？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 三个Skill是否真正注册，论文任务由模型还是脚本完成？

**研究主题**：场景与需求、功能与机制、依赖、兼容与流程

#### 完整回答

根bundle挂载lib/index.js，入口要求skills服务并registerProvider。provider列出academic-paper-writing、presentation-slides和rebuttal-writing，将每个安装目录设为resourceBase，并在get时读取相应SKILL正文；这使模型可发现和按需读取资源，而不是只把三个名字写在README。若skills服务缺失则没有注册前提，读取文件失败也没有本地兜底技能。

核心受众是已经有稿件、实验记录和参考文献的研究者，合格修订交付包括精确差异、建议、未解决项与机械检查报告。脚本负责材料打包和编辑校验，实际全文审阅和写作仍由宿主Agent完成，不会自己调用模型。发布资源里的runner把同目录runtime放入Python导入路径，缺yaml或fitz时给依赖安装提示；这让安装后的Skill不必依赖源码仓库。

三个能力有不同结果边界。修订能输出修改副本与diff；rebuttal命令准备任务，Agent再写回复和动作记录，不自动提交；slides只产storyboard和讲稿，并非已渲染PPT。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:24-31](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/lib/index.js#L24-L31)

固定三个Skill及资源目录。

```text
/** Directories under `skills/`, one per skill, in catalog order. */
const SKILL_NAMES = ['academic-paper-writing', 'presentation-slides', 'rebuttal-writing']

/** Absolute skill directory (the skill's resource base). */
const skillDir = (name) => fileURLToPath(new URL(`../skills/${name}/`, import.meta.url))

/** Location of a skill's SKILL.md. */
const skillFile = (name) => new URL(`../skills/${name}/SKILL.md`, import.meta.url)
```

**依据 2 · 源码核查**：[lib/index.js:81-123](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/lib/index.js#L81-L123)

list/get的资源基址与skills provider注册。

<details>
<summary>查看原文（43行）</summary>

```text
function candidateFor(skill) {
  return {
    name: skill.name,
    description: skill.description,
    invocation: { modelInvocable: true, userInvocable: true },
    provider: PROVIDER_NAME,
    source: 'bundled',
    resourceBase: { kind: 'directory', path: skillDir(skill.name) },
    rank: BUNDLED_SKILL_RANK,
    locator: skill.name,
  }
}

/** Provider registered on `ctx.skills`. */
const provider = {
  name: PROVIDER_NAME,
  async list() {
    const skills = await Promise.all(SKILL_NAMES.map(readSkill))
    return skills.map(candidateFor)
  },
  async get(candidate) {
    const skill = await readSkill(candidate.locator ?? candidate.name)
    return {
      name: skill.name,
      description: skill.description,
      invocation: { modelInvocable: true, userInvocable: true },
      provider: PROVIDER_NAME,
      source: 'bundled',
      resourceBase: { kind: 'directory', path: skillDir(skill.name) },
      content: skill.content,
    }
  },
}

/** Cordis plugin name. */
export const name = 'paper-agent-skills'

/** Service required by the bundled provider. */
export const inject = ['skills']

/** Register the Paper-Agent skill provider on `ctx.skills`. */
export function apply(ctx) {
  ctx.skills.registerProvider(() => provider)
```

</details>

**依据 3 · 源码核查**：[skills/academic-paper-writing/scripts/paper_agent.py:1-15](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/skills/academic-paper-writing/scripts/paper_agent.py#L1-L15)

安装资源内Python入口和缺依赖提示。

<details>
<summary>查看原文（15行）</summary>

```text
#!/usr/bin/env python3
"""Run the bundled Paper-Agent tools from any working directory."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / 'runtime'))
try:
    from paper_agent.cli import main
except ModuleNotFoundError as exc:
    if exc.name in {'yaml', 'fitz'}:
        raise SystemExit('Missing dependency: install scripts/requirements.txt in a Python virtual environment.') from None
    raise

if __name__ == '__main__':
    raise SystemExit(main())
```

</details>

**依据 4 · 作者声明**：[skills/academic-paper-writing/SKILL.md:33-63](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/skills/academic-paper-writing/SKILL.md#L33-L63)

宿主Agent执行写作，脚本不调用模型。

<details>
<summary>查看原文（31行）</summary>

````text
## Revision workflow

Read [the revision contract](references/revision.md) when preparing or responding
to a revision package. From a repository checkout:

```bash
python3 src/main.py prepare --paper paper.tex --experiments results.csv --references refs.bib --out runs/review-01
```

Read the generated `agent_task.md`, complete `manuscript.txt`, all chunks and
`materials.json`. Write `response.json` matching `response.schema.json`, then:

```bash
python3 src/main.py apply --run runs/review-01 --response runs/review-01/response.json
python3 src/main.py check --run runs/review-01
```

With an installed distribution, replace `python3 src/main.py` with `paper-agent`.
The scripts do not invoke a model; the host agent performs review and writing.

- Anchor suggestions and claim assessments to original lines and evidence IDs.
- Make focused edits; retain notation, methods and supported conclusions.
- Do not invent experiments, numeric outcomes, citations or completed revisions.
- Bibliographic metadata alone cannot establish source support. Read the source
  excerpt or mark the claim as needing evidence; a matching key is insufficient.
- Check whether evidence uses the same method, dataset, split, metric and units.
  A matching number alone cannot establish support or statistical significance.
- Treat writing patterns as contextual examples, never mandatory contribution
  counts, sentence lengths, or guarantees of publication quality.
- Conference requirements must include venue, year, track, submission stage and
  official source. Do not rely on a timeless page-limit table.
````

</details>

**依据 5 · 作者声明**：[skills/presentation-slides/SKILL.md:20-23](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/skills/presentation-slides/SKILL.md#L20-L23)

storyboard而非PowerPoint的输出约定。

```text
Use `paper-agent` instead of `python3 src/main.py` after installation. The command
exports complete manuscript text and this skill for the host agent. Write
`storyboard.md` with slide titles, messages, source locators and speaker notes.
This workflow produces a storyboard, not a rendered PowerPoint file.
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 修订如何绑定材料并拒绝错位编辑，结果写在哪里？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

prepare对稿件、实验与文献的原始字节求摘要，解析后复查输入未变，再把源副本、全文、分块、材料JSON和任务说明存入新目录。bundle_id绑定输入和标准化材料；load_run核对manifest文件摘要。response须匹配bundle_id、声明覆盖全部分块，所有编辑必须位于有效原稿行内，原文逐字匹配且不得重叠。这些机制主要避免拿旧稿响应改新稿、遗漏材料引用或误应用位置。覆盖全部chunk的声明仍不证明Agent认真读过全文。

apply_response先validate再从末尾应用编辑，随后写到新的results目录，包含revised、response、建议、claim_evidence、diff和checks，不覆盖原始稿件。storage拒绝既存输出目录；其临时目录完成后逐文件rename，异常会清理目标，但这不是一次目录rename的对外原子提交，不应承诺外部观察者永远看不到中间目录。应用后保留输入和结果manifest，可在复核失败时回到原稿与旧run，而非自动回写实验。

#### 证据与依据

**依据 1 · 源码核查**：[skills/academic-paper-writing/scripts/runtime/paper_agent/workflow.py:97-144](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/skills/academic-paper-writing/scripts/runtime/paper_agent/workflow.py#L97-L144)

输入字节摘要和解析后复查。

<details>
<summary>查看原文（48行）</summary>

```text
def prepare(paper, out, experiments=None, references=None, skills_dir=None, patterns=None, runner_command=None):
    paper = Path(paper).resolve()
    sources = [("paper", paper)]
    if experiments is not None:
        sources.append(("experiments", Path(experiments).resolve()))
    if references is not None:
        sources.append(("references", Path(references).resolve()))
    if patterns is not None:
        sources.append(("learned_patterns", Path(patterns).resolve()))
    inputs = [{"role": role, "original_path": str(path), "sha256": digest(path.read_bytes()),
               "snapshot": f"sources/{role}{path.suffix.lower()}"} for role, path in sources]
    text, pages, warnings = load_paper(paper)
    results, result_warnings = load_experiments(experiments)
    bibliography, ref_warnings = load_references(references)
    loaded = load_skills(skills_dir, ["academic-paper-writing"])
    pieces = chunks(text, pages)
    learned = []
    if patterns is not None:
        learned = read_json(patterns)
        if not isinstance(learned, list) or any(
                not isinstance(x, dict) or x.get("schema_version") != 1 or
                not isinstance(x.get("patterns"), list) or not isinstance(x.get("source"), dict) or
                not x["source"].get("sha256") for x in learned):
            raise ValidationError("Learned patterns need the source-anchored schema; reimport legacy patterns")
    # Verify the bytes also after parsing, so a concurrent input edit cannot bind
    # stale normalized materials to a newer source snapshot.
    for (_, path), record in zip(sources, inputs):
        if digest(path.read_bytes()) != record["sha256"]:
            raise ValidationError(f"Input changed while preparing: {path}")
    materials = {"schema_version": 1, "paper": {"chunks": pieces, "pages": pages,
                                                "line_count": len(text.splitlines()),
                                                "output_suffix": ".tex" if paper.suffix.lower() == ".tex" else ".md"},
                 "experiments": results, "references": bibliography,
                 "skills": [{"name": s["name"], "sha256": s["sha256"]} for s in loaded],
                 "learned_patterns": learned,
                 "warnings": warnings + result_warnings + ref_warnings}
    bundle_id = digest(json_text({"inputs": inputs, "materials": materials}))
    materials["bundle_id"] = bundle_id
    baseline = {"state": "prepared_awaiting_agent_review",
                "original": check_manuscript(text, results, bibliography), "warnings": materials["warnings"]}
    with new_directory(out) as stage:
        (stage / "sources").mkdir()
        (stage / "chunks").mkdir()
        for (_, path), record in zip(sources, inputs):
            raw = path.read_bytes()
            if digest(raw) != record["sha256"]:
                raise ValidationError(f"Input changed while preparing: {path}")
            (stage / record["snapshot"]).write_bytes(raw)
```

</details>

**依据 2 · 源码核查**：[skills/academic-paper-writing/scripts/runtime/paper_agent/workflow.py:158-185](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/skills/academic-paper-writing/scripts/runtime/paper_agent/workflow.py#L158-L185)

完整材料、manifest与load_run校验。

<details>
<summary>查看原文（28行）</summary>

```text
        (stage / "manuscript.txt").write_text(text, encoding="utf-8")
        write_json(stage / "materials.json", materials)
        write_json(stage / "response.schema.json", RESPONSE_SCHEMA)
        write_json(stage / "baseline.json", baseline)
        (stage / "baseline.md").write_text(report_markdown(baseline), encoding="utf-8")
        import shlex
        runner = runner_command or "paper-agent"
        target = shlex.quote(str(Path(out).absolute()))
        answer = shlex.quote(str(Path(out).absolute() / "response.json"))
        (stage / "agent_task.md").write_text(TASK.format(
            bundle_id=bundle_id,
            apply_command=f"{runner} apply --run {target} --response {answer}",
            check_command=f"{runner} check --run {target}"), encoding="utf-8")
        write_json(stage / "manifest.json", {"schema_version": 1, "bundle_id": bundle_id,
                                             "inputs": inputs, "files": file_hashes(stage)})
    return {"run": str(Path(out).absolute()), "bundle_id": bundle_id, "chunks": len(pieces),
            "baseline_findings": len(baseline["original"]["findings"])}


def load_run(run):
    run = Path(run).resolve()
    manifest = read_json(run / "manifest.json")
    if not isinstance(manifest, dict) or manifest.get("schema_version") != 1:
        raise ValidationError("Unsupported run manifest")
    verify_files(run, manifest)
    materials = read_json(run / "materials.json")
    if materials.get("bundle_id") != manifest.get("bundle_id"):
        raise ValidationError("Bundle and manifest do not match")
```

</details>

**依据 3 · 源码核查**：[skills/academic-paper-writing/scripts/runtime/paper_agent/workflow.py:222-280](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/skills/academic-paper-writing/scripts/runtime/paper_agent/workflow.py#L222-L280)

bundle/chunk/行号/原文/重叠和新数值拒绝。

<details>
<summary>查看原文（59行）</summary>

```text
def validate_response(response, materials, text):
    _shape(response, RESPONSE_SCHEMA, "response")
    if response["bundle_id"] != materials["bundle_id"]:
        raise ValidationError("Response belongs to a different input bundle")
    piece_ids = {c["id"] for c in materials["paper"]["chunks"]}
    if set(response["reviewed_chunks"]) != piece_ids:
        raise ValidationError("reviewed_chunks must cover every manuscript chunk exactly once")
    evidence = {e["evidence_id"]: e for e in materials["experiments"] + materials["references"]}
    lines = text.splitlines()
    for group in ("suggestions", "edits", "claim_reviews"):
        ids = set()
        for item in response[group]:
            if "id" in item:
                if item["id"] in ids:
                    raise ValidationError(f"Duplicate {group} id: {item['id']}")
                ids.add(item["id"])
            start, end = item["start_line"], item["end_line"]
            if not 1 <= start <= end <= len(lines):
                raise ValidationError(f"{group}: line range outside manuscript: {start}-{end}")
            unknown = set(item["evidence_ids"]) - piece_ids - evidence.keys()
            if unknown:
                raise ValidationError(f"Unknown evidence IDs: {sorted(unknown)}")
            if group == "claim_reviews":
                original = "\n".join(lines[start - 1:end])
                if item["claim"] not in original:
                    raise ValidationError("Claim review quote is absent from the stated line range")
                cited = [evidence[k] for k in item["evidence_ids"] if k in evidence]
                if item["status"] == "supported" and not any(_usable(e) for e in cited):
                    raise ValidationError("A supported claim needs a completed result or source excerpt")
                if item["status"] == "not_run" and not any(e.get("status") == "not_run" for e in cited):
                    raise ValidationError("not_run assessment needs a not_run record")
    previous_end = 0
    for edit in sorted(response["edits"], key=lambda e: e["start_line"]):
        start, end = edit["start_line"], edit["end_line"]
        if start <= previous_end:
            raise ValidationError("Overlapping edits are not allowed")
        previous_end = end
        original = "\n".join(lines[start - 1:end])
        if original != edit["original"]:
            raise ValidationError(f"Edit {edit['id']}: original does not match snapshot lines")
        replacement = edit["replacement"]
        if "\r" in replacement:
            raise ValidationError("Replacement must use LF line endings")
        cited = [evidence[k] for k in edit["evidence_ids"] if k in evidence]
        if edit["kind"] == "evidence_correction" and not any(_usable(e) for e in cited):
            raise ValidationError(f"Edit {edit['id']}: correction needs completed results or source excerpt")
        added_keys = citations(replacement) - citations(original)
        known = {r["id"] for r in materials["references"]}
        if added_keys - known:
            raise ValidationError(f"Edit {edit['id']}: new unresolved citations: {sorted(added_keys - known)}")
        # Comparing numeric values rather than formatting allows 90 -> 90.0.
        old = Counter(numeric_value(t) for t in numbers(original))
        for token in numbers(replacement):
            value = numeric_value(token)
            if old[value]:
                old[value] -= 1
                continue
            if not any(_supports_number(token, e) for e in cited):
                raise ValidationError(f"Edit {edit['id']}: new number {token} lacks cited completed evidence")
```

</details>

**依据 4 · 源码核查**：[skills/academic-paper-writing/scripts/runtime/paper_agent/workflow.py:319-351](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/skills/academic-paper-writing/scripts/runtime/paper_agent/workflow.py#L319-L351)

验证后输出副本、diff与报告。

<details>
<summary>查看原文（33行）</summary>

```text
def apply_response(run, response_path, out=None):
    run, manifest, materials, text = load_run(run)
    response = validate_response(read_json(response_path), materials, text)
    revised = revise(text, response["edits"])
    report = _make_report(materials, text, revised, response)
    out = Path(out).absolute() if out else run / "results"
    suffix = materials["paper"]["output_suffix"]
    with new_directory(out) as stage:
        (stage / f"revised{suffix}").write_text(revised, encoding="utf-8")
        write_json(stage / "response.json", response)
        write_json(stage / "suggestions.json", response["suggestions"])
        write_json(stage / "claim_evidence.json", {"provenance": "host_agent_judgment",
                                                   "line_coordinates": "original manuscript",
                                                   "claims": response["claim_reviews"]})
        suggestions = ["# Revision suggestions", "", response["summary"], ""]
        for item in response["suggestions"]:
            suggestions += [f"## {item['id']} [{item['severity']}; {item['status']}] L{item['start_line']}-L{item['end_line']}",
                            "", item["issue"], "", item["recommendation"], "",
                            f"Evidence: {', '.join(item['evidence_ids']) or 'none; needs evidence/editorial judgment'}", ""]
        (stage / "suggestions.md").write_text("\n".join(suggestions) + "\n", encoding="utf-8")
        diff = "".join(difflib.unified_diff(text.splitlines(keepends=True), revised.splitlines(keepends=True),
                                          fromfile="original", tofile=f"revised{suffix}"))
        (stage / "changes.diff").write_text(diff, encoding="utf-8")
        write_json(stage / "checks.json", report)
        (stage / "checks.md").write_text(report_markdown(report), encoding="utf-8")
        write_json(stage / "manifest.json", {"schema_version": 1, "bundle_id": manifest["bundle_id"],
                                             "run_manifest_sha256": digest((run / "manifest.json").read_bytes()),
                                             "files": file_hashes(stage)})
    pending = len(report["agent_review"]["pending_suggestions"])
    count = len(report["revised"]["findings"])
    return {"results": str(out), "edits": len(response["edits"]),
            "remaining_findings": count + pending, "mechanical_findings": count,
            "pending_agent_issues": pending, "state": report["state"]}
```

</details>

**依据 5 · 源码核查**：[skills/academic-paper-writing/scripts/runtime/paper_agent/storage.py:38-56](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/skills/academic-paper-writing/scripts/runtime/paper_agent/storage.py#L38-L56)

拒绝覆盖、临时目录与逐文件发布，失败清理。

<details>
<summary>查看原文（19行）</summary>

```text
@contextmanager
def new_directory(target):
    """Publish a complete directory; never reuse or overwrite an existing run."""
    target = Path(target).absolute()
    if target.exists() or target.is_symlink():
        raise ValidationError(f"Output already exists; choose a new directory: {target}")
    target.parent.mkdir(parents=True, exist_ok=True)
    staging = Path(tempfile.mkdtemp(prefix=".paper-agent-", dir=target.parent))
    try:
        yield staging
        target.mkdir()
        try:
            for child in staging.iterdir():
                os.rename(child, target / child.name)
        except BaseException:
            shutil.rmtree(target)
            raise
    finally:
        shutil.rmtree(staging, ignore_errors=True)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 证据检查比直接改稿增加什么，能证明科学主张成立吗？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

相对直接让Agent覆写论文，此流程把原稿行号、实验/文献ID和编辑原因放进可机器核对的响应，再拒绝未知ID、无原文匹配、无证据新增数值及未解决引用键。它不是简单提示词包装，因为验证在落盘前执行；但它也不是科学正确性判定器。supported主张只要求至少有completed记录或excerpt，新增数值只检查所引记录可支持该数值，并未在此处强制绑定方法、数据集、split、指标和单位的语义一致性。

Skill本身要求人工/Agent核对这些语义条件，并明确BibTeX元数据不足以证明引用支持；这是重要责任分工，不能把文字要求当已执行的强制验证。保留旧数值也不一定触发新增数值检查，所以语义改写仍要审阅。报告将scientific_validation写为not_established，并把assessment_provenance标成host_agent_judgment，与此边界一致。

README列出的40项测试、固定响应重放与一例合成DSH任务属于作者报告，不能算本轮复现，也不支持真实论文质量或接收率提升。修订能通过机械门槛，并不意味着实验真的跑过、引用真的读对或结论足以投稿。

#### 证据与依据

**依据 1 · 源码核查**：[skills/academic-paper-writing/scripts/runtime/paper_agent/workflow.py:244-292](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/skills/academic-paper-writing/scripts/runtime/paper_agent/workflow.py#L244-L292)

supported只需可用记录；数值校验未在此强制语义tuple。

<details>
<summary>查看原文（49行）</summary>

```text
            if group == "claim_reviews":
                original = "\n".join(lines[start - 1:end])
                if item["claim"] not in original:
                    raise ValidationError("Claim review quote is absent from the stated line range")
                cited = [evidence[k] for k in item["evidence_ids"] if k in evidence]
                if item["status"] == "supported" and not any(_usable(e) for e in cited):
                    raise ValidationError("A supported claim needs a completed result or source excerpt")
                if item["status"] == "not_run" and not any(e.get("status") == "not_run" for e in cited):
                    raise ValidationError("not_run assessment needs a not_run record")
    previous_end = 0
    for edit in sorted(response["edits"], key=lambda e: e["start_line"]):
        start, end = edit["start_line"], edit["end_line"]
        if start <= previous_end:
            raise ValidationError("Overlapping edits are not allowed")
        previous_end = end
        original = "\n".join(lines[start - 1:end])
        if original != edit["original"]:
            raise ValidationError(f"Edit {edit['id']}: original does not match snapshot lines")
        replacement = edit["replacement"]
        if "\r" in replacement:
            raise ValidationError("Replacement must use LF line endings")
        cited = [evidence[k] for k in edit["evidence_ids"] if k in evidence]
        if edit["kind"] == "evidence_correction" and not any(_usable(e) for e in cited):
            raise ValidationError(f"Edit {edit['id']}: correction needs completed results or source excerpt")
        added_keys = citations(replacement) - citations(original)
        known = {r["id"] for r in materials["references"]}
        if added_keys - known:
            raise ValidationError(f"Edit {edit['id']}: new unresolved citations: {sorted(added_keys - known)}")
        # Comparing numeric values rather than formatting allows 90 -> 90.0.
        old = Counter(numeric_value(t) for t in numbers(original))
        for token in numbers(replacement):
            value = numeric_value(token)
            if old[value]:
                old[value] -= 1
                continue
            if not any(_supports_number(token, e) for e in cited):
                raise ValidationError(f"Edit {edit['id']}: new number {token} lacks cited completed evidence")
    return response


def _usable(entry):
    return entry.get("status") == "completed" or bool(entry.get("excerpt"))


def _supports_number(token, entry):
    if entry.get("status") == "completed":
        return numeric_match(token, entry)
    if entry.get("excerpt"):
        return numeric_value(token) in {numeric_value(t) for t in numbers(entry["excerpt"])}
```

</details>

**依据 2 · 源码核查**：[skills/academic-paper-writing/scripts/runtime/paper_agent/workflow.py:303-316](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/skills/academic-paper-writing/scripts/runtime/paper_agent/workflow.py#L303-L316)

报告区分机械与科学验证及host_agent判断来源。

<details>
<summary>查看原文（14行）</summary>

```text
def _make_report(materials, text, revised, response):
    original_check = check_manuscript(text, materials["experiments"], materials["references"])
    revised_check = check_manuscript(revised, materials["experiments"], materials["references"])
    pending = [s for s in response["suggestions"] if s["status"] != "addressed"]
    # Never call this "passed" or "scientifically validated": unresolved findings can remain.
    return {"schema_version": 1, "bundle_id": materials["bundle_id"],
            "state": "revision_applied_with_findings" if revised_check["findings"] or pending else "revision_applied",
            "mechanical_validation": "response_validated", "scientific_validation": "not_established",
            "original": original_check, "revised": revised_check,
            "agent_review": {"summary": response["summary"], "assessment_provenance": "host_agent_judgment",
                             "reviewed_chunks": len(response["reviewed_chunks"]),
                             "total_chunks": len(materials["paper"]["chunks"]), "edits": len(response["edits"]),
                             "pending_suggestions": pending},
            "warnings": materials["warnings"]}
```

</details>

**依据 3 · 作者声明**：[skills/academic-paper-writing/SKILL.md:53-63](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/skills/academic-paper-writing/SKILL.md#L53-L63)

提示要求语义核对和来源摘录。

<details>
<summary>查看原文（11行）</summary>

```text
- Anchor suggestions and claim assessments to original lines and evidence IDs.
- Make focused edits; retain notation, methods and supported conclusions.
- Do not invent experiments, numeric outcomes, citations or completed revisions.
- Bibliographic metadata alone cannot establish source support. Read the source
  excerpt or mark the claim as needing evidence; a matching key is insufficient.
- Check whether evidence uses the same method, dataset, split, metric and units.
  A matching number alone cannot establish support or statistical significance.
- Treat writing patterns as contextual examples, never mandatory contribution
  counts, sentence lengths, or guarantees of publication quality.
- Conference requirements must include venue, year, track, submission stage and
  official source. Do not rely on a timeless page-limit table.
```

</details>

**依据 4 · 作者声明**：[README.md:46-60](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/README.md#L46-L60)

作者验证区分测试、重放和合成任务，否认科学效果证明。

<details>
<summary>查看原文（15行）</summary>

```text
## Validation

Observed results on the supplied synthetic fixture; engineering checks and live agent execution are reported separately.

| Evaluation | Observed result | Scope |
| --- | --- | --- |
| Automated test suite | 40/40 passed | Ingestion, integrity, rejection rules, and standalone bundles |
| Remote installation | 3/3 skills; 49 bundle files matched | Public GitHub source installed with skills CLI |
| GitHub Actions | 2/2 jobs passed | Python 3.10 and 3.13; [run](https://github.com/Scodive/Paper-Agent-Skills/actions/runs/42018848565) |
| Invalid response scenarios | 9/9 rejected | Unknown evidence, unsupported numbers, stale edits, and related cases |
| Fixed-response replay | 5 → 0 mechanical findings; 2 pending items retained | Pre-authored response, not a new model run |
| Live DSH skill loading | 3/3 skills loaded | DSH 0.2.2-rc.1; skills installed by skills CLI 1.7.6 |
| Live DSH paper revision | 5 → 0 mechanical findings; 6 edits; 3 pending items retained | One independently generated synthetic-case response |

The live DSH process completed successfully and its artifacts passed an independent recheck. Rebuttal and slide skills were loaded but did not receive end-to-end behavioral evaluation. These results **do not establish writing-quality gains, scientific correctness, or acceptance-rate improvements**.
```

</details>

#### 缺口

- 缺少真实论文中语义错误检出和误拒率的结果。
  **影响**：不能判断严格结构约束是否改善最终学术质量。
  **进一步探讨**：对有人工标注的真实修订任务比较漏检、误拒、人工时间和保留的未解决项。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续和失败恢复有哪些负担，适合怎样的试用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

已有可合法提供的单稿件和实验表的研究者，可先在副本上试验修订流程。首次需确认Node/DSH版本、Python3.10+和相应依赖，准备实验记录与文献摘录；持续使用仍要让宿主Agent读全文、审阅变化和逐条处理证据缺口。工具不需要独立模型key并不意味着整个任务无模型费用，模型由宿主承担，具体金额和耗时没有同任务材料。

失败恢复应先看输入摘要、bundle_id、编辑位置或新数值拒绝的具体原因，修正响应后在新输出目录应用；不要删除拒绝规则来接受一次看似流畅的改稿。输入变化应新prepare。退出可保留原稿和diff后停止使用，结果不会自动提交论文或审稿系统。若模型把空缺实验写成完成、supported的证据方法与正文不同，或为通过检查大量重写证据，应停止应用并回到人工逐条改稿。

推荐有界试用修订而非承诺全部论文任务。rebuttal与slides主要提供工作约定，作者也说明其端到端行为尚未同等评估。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-29](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/README.md#L11-L29)

安装与宿主声明。

<details>
<summary>查看原文（19行）</summary>

````text
Python 3.10+ and Node.js are required for this installation path. Install all three skills into the shared agent directory, which DSH can discover:

```bash
npx skills add Scodive/Paper-Agent-Skills --agent universal --skill '*' --copy --yes
python3 -m venv .paper-agent-venv
.paper-agent-venv/bin/python -m pip install -r .agents/skills/academic-paper-writing/scripts/requirements.txt
```

Each skill includes its executable tools and readable runtime. A source checkout is not required after installation. Other supported agents can be selected through the skills CLI.

### As a DeepSeek Harness (dsh) plugin

The same three skills also ship as a DSH plugin bundle, which registers them as a bundled skill provider in the model's skill catalog:

```bash
dsh plugin --profile web add dsh-paper-agent-skills
```

Either installation path works. The plugin bundle requires DSH 0.2.1 or newer and needs no build step.
````

</details>

**依据 2 · 作者声明**：[README.md:35-44](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/README.md#L35-L44)

输出副本和输入格式约定。

<details>
<summary>查看原文（10行）</summary>

```text
> Use academic-paper-writing to revise paper.tex against results.csv and references.bib. Use .paper-agent-venv/bin/python. Complete preparation, full-text review, edit application, and checks. Save the run to runs/review-01 and retain unresolved evidence gaps.

Read the outputs in `runs/review-01/results/`:

- `suggestions.md` — recommendations and unresolved items.
- `revised.md` or `revised.tex` — the revised manuscript.
- `changes.diff` — the exact edits.
- `checks.md` — mechanical checks and evidence limitations.

Inputs: Markdown, single-file TeX, or text-based PDF; experiment records in JSON/CSV; references in BibTeX/JSON. See [input formats](docs/input-formats.md).
```

</details>

**依据 3 · 源码核查**：[skills/academic-paper-writing/scripts/runtime/paper_agent/workflow.py:222-280](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/skills/academic-paper-writing/scripts/runtime/paper_agent/workflow.py#L222-L280)

失败拒绝条件可定位。

<details>
<summary>查看原文（59行）</summary>

```text
def validate_response(response, materials, text):
    _shape(response, RESPONSE_SCHEMA, "response")
    if response["bundle_id"] != materials["bundle_id"]:
        raise ValidationError("Response belongs to a different input bundle")
    piece_ids = {c["id"] for c in materials["paper"]["chunks"]}
    if set(response["reviewed_chunks"]) != piece_ids:
        raise ValidationError("reviewed_chunks must cover every manuscript chunk exactly once")
    evidence = {e["evidence_id"]: e for e in materials["experiments"] + materials["references"]}
    lines = text.splitlines()
    for group in ("suggestions", "edits", "claim_reviews"):
        ids = set()
        for item in response[group]:
            if "id" in item:
                if item["id"] in ids:
                    raise ValidationError(f"Duplicate {group} id: {item['id']}")
                ids.add(item["id"])
            start, end = item["start_line"], item["end_line"]
            if not 1 <= start <= end <= len(lines):
                raise ValidationError(f"{group}: line range outside manuscript: {start}-{end}")
            unknown = set(item["evidence_ids"]) - piece_ids - evidence.keys()
            if unknown:
                raise ValidationError(f"Unknown evidence IDs: {sorted(unknown)}")
            if group == "claim_reviews":
                original = "\n".join(lines[start - 1:end])
                if item["claim"] not in original:
                    raise ValidationError("Claim review quote is absent from the stated line range")
                cited = [evidence[k] for k in item["evidence_ids"] if k in evidence]
                if item["status"] == "supported" and not any(_usable(e) for e in cited):
                    raise ValidationError("A supported claim needs a completed result or source excerpt")
                if item["status"] == "not_run" and not any(e.get("status") == "not_run" for e in cited):
                    raise ValidationError("not_run assessment needs a not_run record")
    previous_end = 0
    for edit in sorted(response["edits"], key=lambda e: e["start_line"]):
        start, end = edit["start_line"], edit["end_line"]
        if start <= previous_end:
            raise ValidationError("Overlapping edits are not allowed")
        previous_end = end
        original = "\n".join(lines[start - 1:end])
        if original != edit["original"]:
            raise ValidationError(f"Edit {edit['id']}: original does not match snapshot lines")
        replacement = edit["replacement"]
        if "\r" in replacement:
            raise ValidationError("Replacement must use LF line endings")
        cited = [evidence[k] for k in edit["evidence_ids"] if k in evidence]
        if edit["kind"] == "evidence_correction" and not any(_usable(e) for e in cited):
            raise ValidationError(f"Edit {edit['id']}: correction needs completed results or source excerpt")
        added_keys = citations(replacement) - citations(original)
        known = {r["id"] for r in materials["references"]}
        if added_keys - known:
            raise ValidationError(f"Edit {edit['id']}: new unresolved citations: {sorted(added_keys - known)}")
        # Comparing numeric values rather than formatting allows 90 -> 90.0.
        old = Counter(numeric_value(t) for t in numbers(original))
        for token in numbers(replacement):
            value = numeric_value(token)
            if old[value]:
                old[value] -= 1
                continue
            if not any(_supports_number(token, e) for e in cited):
                raise ValidationError(f"Edit {edit['id']}: new number {token} lacks cited completed evidence")
```

</details>

**依据 4 · 源码核查**：[skills/academic-paper-writing/scripts/runtime/paper_agent/storage.py:38-43](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/skills/academic-paper-writing/scripts/runtime/paper_agent/storage.py#L38-L43)

不覆盖旧run。

```text
@contextmanager
def new_directory(target):
    """Publish a complete directory; never reuse or overwrite an existing run."""
    target = Path(target).absolute()
    if target.exists() or target.is_symlink():
        raise ValidationError(f"Output already exists; choose a new directory: {target}")
```

**依据 5 · 作者声明**：[skills/rebuttal-writing/SKILL.md:22-35](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/skills/rebuttal-writing/SKILL.md#L22-L35)

回复与行动状态由Agent承担，不自动提交。

<details>
<summary>查看原文（14行）</summary>

```text
Use `paper-agent` instead of `python3 src/main.py` after installation. Read all
inputs and write `rebuttal.md` plus `actions.json` in the exported directory.
The command prepares a task; it does not automatically generate or submit a reply.

- Split reviews into individual points. Assess misunderstanding, valid flaw,
  missing evidence, experiment request and presentation issue on their merits.
- Link factual responses to manuscript lines and actual supplied evidence.
- Track actions as proposed, not_run, completed or verified. Never describe an
  experiment as performed or a manuscript change as applied until it exists.
- When new results are supplied, use the academic revision workflow to check
  result consistency. A rebuttal example is not experimental evidence.
- Acknowledge genuine limitations and state what the evidence cannot resolve.
- Keep replies specific and professional. Do not invent reviewer score changes
  or promise that a response will reverse a decision.
```

</details>

#### 缺口

- 未取得各类真实任务的耗时、费用和写作效果。
  **影响**：不支持持续采用收益承诺，slides/rebuttal范围应更窄。
  **进一步探讨**：先用一份已知含错误的稿件比较原始人工流程，记录检查和修正总时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可否将数值匹配提升为方法、指标与单位绑定，如何证伪？

**研究主题**：新假设与验证

#### 完整回答

[Q03](#research-q03) 的机械校验能阻止无来源新增数字，但同一个数字可以来自不同数据集或指标。可据此提出未验证假设：在现有证据ID之外，为改动的科学主张显式绑定方法、数据集、split、指标和单位，再把这些字段与原文关联，可能减少“数字存在但论据不相干”的放行。额外字段和审阅成本需要由研究者承担，此组件当前没有该完整强制机制。

最小验证采用一组同数异义、单位变换、确有支持及仅编辑措辞的配对响应，在不换模型和材料的条件下，对比现有校验与语义字段审阅。观察不当supported检出、正确改稿误拒、人工补标与总耗时。若增强版未改善语义错配检出，或误拒与补标成本使合格修订总负担更大，就不支持改进价值；不能只数多了多少字段或拒绝了多少响应。

#### 证据与依据

**依据 1 · 源码核查**：[skills/academic-paper-writing/scripts/runtime/paper_agent/workflow.py:244-292](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/skills/academic-paper-writing/scripts/runtime/paper_agent/workflow.py#L244-L292)

当前supported和数值匹配的机械边界。

<details>
<summary>查看原文（49行）</summary>

```text
            if group == "claim_reviews":
                original = "\n".join(lines[start - 1:end])
                if item["claim"] not in original:
                    raise ValidationError("Claim review quote is absent from the stated line range")
                cited = [evidence[k] for k in item["evidence_ids"] if k in evidence]
                if item["status"] == "supported" and not any(_usable(e) for e in cited):
                    raise ValidationError("A supported claim needs a completed result or source excerpt")
                if item["status"] == "not_run" and not any(e.get("status") == "not_run" for e in cited):
                    raise ValidationError("not_run assessment needs a not_run record")
    previous_end = 0
    for edit in sorted(response["edits"], key=lambda e: e["start_line"]):
        start, end = edit["start_line"], edit["end_line"]
        if start <= previous_end:
            raise ValidationError("Overlapping edits are not allowed")
        previous_end = end
        original = "\n".join(lines[start - 1:end])
        if original != edit["original"]:
            raise ValidationError(f"Edit {edit['id']}: original does not match snapshot lines")
        replacement = edit["replacement"]
        if "\r" in replacement:
            raise ValidationError("Replacement must use LF line endings")
        cited = [evidence[k] for k in edit["evidence_ids"] if k in evidence]
        if edit["kind"] == "evidence_correction" and not any(_usable(e) for e in cited):
            raise ValidationError(f"Edit {edit['id']}: correction needs completed results or source excerpt")
        added_keys = citations(replacement) - citations(original)
        known = {r["id"] for r in materials["references"]}
        if added_keys - known:
            raise ValidationError(f"Edit {edit['id']}: new unresolved citations: {sorted(added_keys - known)}")
        # Comparing numeric values rather than formatting allows 90 -> 90.0.
        old = Counter(numeric_value(t) for t in numbers(original))
        for token in numbers(replacement):
            value = numeric_value(token)
            if old[value]:
                old[value] -= 1
                continue
            if not any(_supports_number(token, e) for e in cited):
                raise ValidationError(f"Edit {edit['id']}: new number {token} lacks cited completed evidence")
    return response


def _usable(entry):
    return entry.get("status") == "completed" or bool(entry.get("excerpt"))


def _supports_number(token, entry):
    if entry.get("status") == "completed":
        return numeric_match(token, entry)
    if entry.get("excerpt"):
        return numeric_value(token) in {numeric_value(t) for t in numbers(entry["excerpt"])}
```

</details>

**依据 2 · 作者声明**：[skills/academic-paper-writing/SKILL.md:56-59](https://github.com/Scodive/Paper-Agent-Skills/blob/f719e067d3d1b00227f462a0eba9e0c23105979c/skills/academic-paper-writing/SKILL.md#L56-L59)

现有指令已经要求方法/数据/单位核对，可作为推广依据。

```text
- Bibliographic metadata alone cannot establish source support. Read the source
  excerpt or mark the claim as needing evidence; a matching key is insufficient.
- Check whether evidence uses the same method, dataset, split, metric and units.
  A matching number alone cannot establish support or statistical significance.
```

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
