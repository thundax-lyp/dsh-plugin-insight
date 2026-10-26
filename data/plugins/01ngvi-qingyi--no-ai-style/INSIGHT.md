# no-ai-style

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[1e11eb6](https://github.com/01NGVI-QINGYI/no-ai-style/tree/1e11eb699fbc3745a03fae8672921019569d85bf)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style)
<!-- END META -->

> **实现功能**：提供英中日写作审阅、润色和起草Skill，附DSH模式插入按钮与离线词法/锚点检查。

> **核心亮点**：将阅读契约、事实边界、最小编辑和回查门槛与三模式交付接合，比单句润色提示更有审阅结构。详见[Q01](#research-q01)。

> **风险与缺陷**：词法flags和数字multiset不能证明语义等价；按钮只是提示插入，自动执行与宿主引用保护有具体契约条件。详见[Q03](#research-q03)。

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
  - [Q01 · “去AI味”在这里具体指什么，交付标准如何限定？](#detail-section-11)
  - [Q02 · Skill与按钮分别做什么，引用草稿怎样保护？](#detail-section-12)
  - [Q03 · 两个离线脚本能够证明哪些结论？](#detail-section-13)
  - [Q04 · 工程证据与阶段成本如何判断？](#detail-section-14)
  - [Q05 · 怎样采用，可推导什么可证伪方向？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合需保留学术事实、引用与不确定性的作者，在授权段落内审阅和轻改英中日文稿。验收对象是改写后的命题及证据边界，仍由作者复核。

直接基线是通用润色提示加作者逐句核对。此Skill增加有优先级的阅读/事实/回查门槛和明确三模式，但执行仍依模型，须用同一批文稿比较事实越界、读者问题与复核时间。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| `no-ai-style` Skill | audit/revise/compose | Agent遵循，不能自动认证忠实 |
| 模式按钮 | 前插本地化指令 | 不直接改稿/调用模型；旧版有引用拒插 |
| 可选audit脚本 | 词法/缺口候选 | 非检测器，不自动删除 |
| 可选anchor脚本 | 数值/引用锚点变化 | Counter不保语义关系 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH及filesystem Skill provider | Skill必需 | 读取包内规则 | 没有provider则无法依该入口加载 |
| locale/slots/inputActions | 按钮可选 | 前插模式指令 | 旧引用草稿拒绝setDraft回退 |
| 宿主模型与授权源文 | 写作必需 | 审阅/改写 | 插件不补事实和外部证据 |
| Python3.9+ | 离线脚本可选 | flags和anchors | 可人工比对，脚本不证明同义 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 定义范围 | 作者保留原文，指定读者/体裁和不可改事实 | 只处理授权段落 |
| audit | Agent列可读性与证据问题 | 必要限定保留，不按改量凑字 |
| revise/compose | Agent依据材料写作 | 缺证据明确标记 |
| 回查 | 作者逐命题、数字、引文比对 | 发现升级主张即回退/缩窄 |
| 按钮失败 | 用户保留富引用并检查宿主动作 | 不为插入而删除证据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH Skill provider/可选Web UI，脚本另需Python3.9+；金额未知 | 明确体裁/授权段落、语言、不可改锚点与原文备份，工时未知 | 插件不自带写作模型或论文来源 |
| 持续使用 | 宿主模型读取Skill/材料并生成；可选本地正则/计数扫描 | 审阅flags与前后命题/证据对应，实际耗时未知 | Python不联网不等整体模型处理不外发；token/价格依宿主，净节时未知 |
| 失败恢复 | 保留原文、重生成/复查与宿主上下文，金额未知 | 回退无据改写、恢复丢锚点/引用并请作者澄清 | 相同锚点不保证同义；已采用的错误文稿需另行纠正，恢复工时未知 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 事实优先写作 | gate/模式/回查指令 | 真实模型遵循与语义忠实率 |
| 机械检查 | pattern/数字Counter | 不保证没有问题/等义 |
| GUI指令插入 | 新旧宿主保护分支 | 具体宿主引用/最新草稿契约 |

> **思考**：词法flags和数字multiset不能证明语义等价；按钮只是提示插入，自动执行与宿主引用保护有具体契约条件。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将阅读契约、事实边界、最小编辑和回查门槛与三模式交付接合，比单句润色提示更有审阅结构。详见[Q01](#research-q01)。

将阅读契约、事实边界、最小编辑和回查门槛与三模式交付接合，比单句润色提示更有审阅结构。详见[Q01](#research-q01)。

生产函数测试和引用拒绝/throw防护可借鉴，指令token存在性与模型效果必须分开。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

词法flags和数字multiset不能证明语义等价；按钮只是提示插入，自动执行与宿主引用保护有具体契约条件。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

作者留原文并逐命题复核的可控范围试用，先audit再授权编辑。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

模式/事实优先和插入保护设计可核；语义忠实仍需模型/作者，离线脚本仅提示，命题收据假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、src/client.cjs、lib/client.js、skills/no-ai-style/SKILL.md、skills/no-ai-style/references/evidence-boundary.md、skills/no-ai-style/references/voice-contract.md、skills/no-ai-style/references/release-check.md、skills/no-ai-style/references/language-notes.md、skills/no-ai-style/scripts/audit_prose.py、skills/no-ai-style/scripts/compare_anchors.py、skills/no-ai-style/tests/test_no_ai_style.py、tests/client-smoke.cjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整Skill248行、provider16行、两Python脚本、证据/声音/提交参考及CJK指引；完整client源和发布插入关键链，Python测试及client smoke代表分支，不运行。
- 下一步：用 [Q05](#research-q05) 的A/B互换、相关改因果、删null与中文语气反例，比较数字multiset检查、人工Claim-Equilibrium与命题收据原型；原型假设未验证。

**分析版本**

- **仓库**：[01NGVI-QINGYI/no-ai-style](https://github.com/01NGVI-QINGYI/no-ai-style)
- **版本号**：1.2.2（[固定提交 1e11eb6](https://github.com/01NGVI-QINGYI/no-ai-style/tree/1e11eb699fbc3745a03fae8672921019569d85bf)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

从锚点不保关系推导命题级变更收据，按换对象/因果升级/删null等反例比较误改和人工负担，未验证。详见[Q05](#research-q05)。

用 [Q05](#research-q05) 的A/B互换、相关改因果、删null与中文语气反例，比较数字multiset检查、人工Claim-Equilibrium与命题收据原型；原型假设未验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 375 | 335 | 15 | — |
| .md | source | 10 | 902 | — | — | 6391 |
| .mjs | source | 1 | 11 | 9 | 0 | — |
| .md | example | 2 | 61 | — | — | 375 |
| .cjs | source | 1 | 349 | 313 | 15 | — |
| .cjs | test | 1 | 274 | 239 | 13 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style/issues?q=is%3Aissue+created%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：写作Skill怎样在改善阅读时守事实边界，UI插入与离线检查各自能够提供什么保证？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · “去AI味”在这里具体指什么，交付标准如何限定？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是英/中/日学术与职业文稿更可读且不改变事实承诺，不是AI检测器规避或把他人文字伪装原创。audit只列问题、revise仅授权范围、compose依据已有材料起草；默认轻改、好段不凑改量，ready只在请求提交检查时结合现有材料给出。合格交付需读者路径改善、引用/数字/方法/不利结果/不确定性保留，未证据项仍标gap，而非句式更自信或脚本零告警。

相对一句“润色”或通用词表替换，已有贡献是把reading contract→truth boundary→读者路径→语言调整→backcheck的有序门槛，以及[EVIDENCE GAP]/[INTERPRETATION FLAG]、三种交付模式接合。主张强度保护优先于风格是可借鉴方法设计；它仍是给模型/人的指令，不是语义忠实验证器。作者声音参照只用于已有样本，不推断身份/经历。

#### 证据与依据

**依据 1 · 源码核查**：[skills/no-ai-style/SKILL.md:28-53](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/skills/no-ai-style/SKILL.md#L28-L53)

优先级与三模式。

<details>
<summary>查看原文（26行）</summary>

```text
- Gates are ordered priorities, not a checklist. When gates conflict,
  **Gate 2 (truth boundary) always wins**. Gate 3 and Gate 4 defer to
  Gate 1 (reading contract). Gate 5 overrides any earlier change that
  cannot be verified.
- Prefer the smallest edit that satisfies the reading contract. Do not
  fix problems the user did not ask about.
- Open only the reference file needed for the current task.
- Identify a specific reading problem before changing a passage. If no
  relevant problem is present, keep it; editing does not need a quota.

## Decide the operating mode

Infer the mode from the request; do not ask when intent is clear.

| Mode | Trigger | Allowed work | Deliver |
| --- | --- | --- | --- |
| `audit` | inspect, critique, identify problems; ready to submit, final check, publish | Read and report; do not edit source files | Prioritized findings; when readiness is requested, add a verdict and unresolved risks |
| `revise` | polish, humanize, tighten, rewrite, no-ai-style | Edit the authorized passage only | Revised text and a brief change summary |
| `compose` | draft from notes, tables, findings | Write from given material, marking unknowns | Draft with unresolved-evidence notes if needed |

If the user requests only a translation, preserve source meaning,
register, qualifiers, and citations before attempting stylistic
changes. If only a response is needed, do not create or modify files.

## Five gates

```

</details>

**依据 2 · 源码核查**：[skills/no-ai-style/SKILL.md:71-98](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/skills/no-ai-style/SKILL.md#L71-L98)

事实/证据保护。

<details>
<summary>查看原文（28行）</summary>

```text

- Measurements, counts, units, percentages, uncertainty intervals,
  p-values, model names, dates, population definitions, outcome
  definitions, and citation locators.
- Research design, sampling, procedures, registered hypotheses,
  exclusions, ethics information, and the distinction between planned
  and completed work.
- Negative, null, conflicting, and inconclusive observations, when
  relevant to the inquiry.
- Scope and strength of inference: association is not causation; lack
  of detected significance is not proof of equivalence.

Never invent a citation, DOI, author, quotation, test result, method,
approval, participant, or source verification. If a necessary item is
unknown, label it unresolved rather than hiding the gap with
persuasive language. See `references/evidence-boundary.md`.

### Gate 3 — Rebuild the reader's path

For each paragraph, state its job in a few words: define, motivate,
claim, support, interpret, qualify, compare, or transition. If two
paragraphs perform the same job, combine or differentiate them. Put
the necessary point where readers can find it; give it support
nearby; end with the consequence for the argument.

Classify passages for revision:

- `KEEP` — essential claim, evidence, limitation, or purposeful voice.
```

</details>

**依据 3 · 源码核查**：[skills/no-ai-style/SKILL.md:155-194](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/skills/no-ai-style/SKILL.md#L155-L194)

回查门槛。

<details>
<summary>查看原文（40行）</summary>

```text
Run these checks **in order of priority**. If 5.1 (anchors) or 5.2
(claim strength) fails, do not continue stylistic polishing or deliver
the affected revision. Revert or narrow the unsupported change, or
report the failure and the required author input.

**5.1 Anchors unchanged.** Compare before/after with
`scripts/compare_anchors.py` or by reading. Every number, unit,
citation locator, model name, and date must match or have a documented
reason to change.

**5.2 Claim strength preserved or narrowed.** For every substantive
claim, check: did the revision make the claim *stronger*? If the
original said "associated with," the revision must not say "causes."
If the original reported a null result, the revision must not delete
it. Use the `Claim-Equilibrium` procedure in
`references/evidence-boundary.md`.

**5.3 Caveats still accessible.** Relevant limitations and contrary
evidence must remain at a location a reader can find. Relocate a caveat only when readers can still interpret the claim correctly
where it appears; keep essential scope in the abstract itself.

**5.4 Coherence after edits.** Terminology, scope, tense, paragraph
links, and genre-specific register are consistent from opening to
close. Compare changed passages with the source in both directions:
identify reading problems still present, and information or intentional
expression the edit damaged. Restore a useful construction when its
replacement is less precise or less recognizably the author’s. Stop
when the requested problems are resolved; do not manufacture another pass.

**5.5 Delivery surface clean.** The final artifact must not reference
discarded conversations or options that were never implemented.
Required historical records (changelogs, migration notes, audit
trails) are retained. Apply the check separately to each surface:
title, abstract, commit message, PR description, body, captions, tags.

**5.6 Original authorship.** The output is not a mechanical
paraphrase of another author's prose. Attribution is maintained where
needed.

Treat script findings as review flags; check the text and underlying evidence before accepting edits.
```

</details>

**依据 4 · 源码核查**：[skills/no-ai-style/SKILL.md:220-236](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/skills/no-ai-style/SKILL.md#L220-L236)

交付与检测器边界。

<details>
<summary>查看原文（17行）</summary>

```text
  `考えられる` or `示唆される`.

## Response contract

- `audit`: compact finding table with impact, evidence from the text,
  and a suggested action; do not output a secretly edited manuscript. If
  asked whether an artifact is ready, add `ready`, `ready with reservations`,
  or `not ready`, followed by unresolved material issues.
- `revise`: usable revised prose first, then explain only material
  changes; flag any unverifiable claim or fact requiring approval.
- `compose`: requested draft, followed by explicit open questions.
  Use two markers:
  - `[EVIDENCE GAP]` — missing data; blocks release until the
    author supplies it.
  - `[INTERPRETATION FLAG]` — data present but ambiguous; author
    confirmation is enough to proceed.
For requests to 'remove AI traces' or 'avoid plagiarism', improve clarity and
```

</details>

**依据 5 · 源码核查**：[skills/no-ai-style/references/voice-contract.md:1-25](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/skills/no-ai-style/references/voice-contract.md#L1-L25)

作者样本边界。

<details>
<summary>查看原文（25行）</summary>

```text
# Using the author’s samples

Read this reference when the user supplies their own prose or requests
consistency across a document. A sample helps settle an editing choice;
it does not authorize collecting more material or inventing a biography.

For a disputed change, compare the draft with a relevant sample. Is the
same construction used intentionally there? Does it serve the same
purpose here? Repeated terminology, an unusual sentence opening, or a
long explanation may be useful to this author and audience. Preserve it
unless the requested edit calls for a change or it obscures the meaning.

Explain a material choice with a short observation from the supplied
text: for example, “The methods sections use impersonal constructions,
so this revision keeps that register.” Do not turn a single occurrence
into a rule for the writer’s entire body of work. A venue requirement
applies to that venue; a preference in an email need not govern a paper.

Without a relevant sample, follow the draft’s established register and
the user’s requested intensity. Offer an alternative when either choice
would be reasonable. Do not generate a voice profile or separate style
files unless requested.

Personal experiences, institutional roles, and positions must come from
the author’s material. Quoted or borrowed language retains attribution.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Skill与按钮分别做什么，引用草稿怎样保护？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

host用dsh-skill-filesystem注册独立provider，includeDefaultRoots=false、bundledSkillDir包内skills、watch=false，不写用户项目Skill根。client按钮仅把本地化自然语言模式指令前插草稿，Cancel不改；没有调用模型或确定性执行Skill的专用host action，真正Skill选择/遵循仍依宿主Agent。GUI入口可缺席而Skill provider仍可用。

新inputActions.insertText分支可captureInsertion并强制[0,0]，宿主返回true才关闭，throw/false显示错误，依宿主revision语义保留富引用。capture不存在或抛错会以空span额外字段继续尝试，故不能从本插件独立保证CAS总存在。旧setDraft分支在occurrences非空时明确拒绝以免flatten；普通文本用渲染时draft拼前缀，没有该分支revision参数，宿主状态/渲染时序影响最新草稿。busy判断、Escape composing保护和事件清理有实际代码。

当前包未声明宿主版本范围；filesystem peer为 >=0.1.0-rc.6 <0.3.0，React/ReactDOM18为可选peer，实际宿主兼容未确认；可选UI需locale/slot/输入actions。Python3.9+仅给可选脚本，Skill本身依原宿主模型和文件读取权限。watch=false意味着包内容更新需按宿主reload策略，不是热监测。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-16](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/index.js#L1-L16)

provider范围和watch。

<details>
<summary>查看原文（16行）</summary>

```text
import { fileURLToPath } from "node:url";
import { apply as applyFilesystemProvider } from "@deepseek-ai/dsh-skill-filesystem";

const skillsRoot = fileURLToPath(new URL("./skills/", import.meta.url));

export const name = "no-ai-style";
export const inject = ["skills", "agents"];

export function apply(ctx) {
  applyFilesystemProvider(ctx, {
    providerName: name,
    includeDefaultRoots: false,
    bundledSkillDir: skillsRoot,
    watch: false,
  });
}
```

</details>

**依据 2 · 源码核查**：[src/client.cjs:186-247](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/src/client.cjs#L186-L247)

新旧插入动作。

<details>
<summary>查看原文（62行）</summary>

```text
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);

  const insert = () => {
    if (!selected) return;
    if (input && input.phase && input.phase !== 'plain') {
      setFeedback(t('error.busy'));
      return;
    }
    const draft = input && typeof input.draft === 'string' ? input.draft : '';
    const prefix = t(`prompt.${selected}`);
    const insertion = `${prefix}${draft.length > 0 ? '\n\n' : ''}`;
    const actions = inputActions || {};

    // Newer DSH releases expose a revision-guarded splice. It inserts at [0, 0]
    // and leaves the rest of the draft, including reference chips, intact.
    if (typeof actions.insertText === 'function') {
      let captured = {};
      if (typeof actions.captureInsertion === 'function') {
        try { captured = actions.captureInsertion() || {}; } catch { captured = {}; }
      }
      const span = { ...captured, start: 0, end: 0 };
      // A host action is not this plugin's contract to trust: a throw here would
      // escape the click handler, and React answers that by unmounting the slot
      // entry, taking the composer button with it. A refusal is recoverable.
      let applied = false;
      try {
        applied = actions.insertText(insertion, span) === true;
      } catch {
        setFeedback(t('error.unavailable'));
        return;
      }
      if (!applied) {
        setFeedback(t('error.changed'));
        return;
      }
      dismiss(false);
      return;
    }

    // Older DSH exposes only setDraft, which flattens rich references. Keep
    // ordinary text intact, but refuse that fallback when references are present.
    const occurrences = input && Array.isArray(input.occurrences) ? input.occurrences : [];
    if (occurrences.length > 0) {
      setFeedback(t('error.references'));
      return;
    }
    if (typeof actions.setDraft !== 'function') {
      setFeedback(t('error.unavailable'));
      return;
    }
    try {
      actions.setDraft(`${insertion}${draft}`);
    } catch {
      setFeedback(t('error.unavailable'));
      return;
    }
    dismiss(false);
  };

  const options = MODES.map((mode) => h('button', {
```

</details>

**依据 3 · 源码核查**：[lib/client.js:196-254](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/lib/client.js#L196-L254)

发布bundle同链。

<details>
<summary>查看原文（59行）</summary>

```text
      const insert = () => {
        if (!selected) return;
        if (input && input.phase && input.phase !== 'plain') {
          setFeedback(t('error.busy'));
          return;
        }
        const draft = input && typeof input.draft === 'string' ? input.draft : '';
        const prefix = t(`prompt.${selected}`);
        const insertion = `${prefix}${draft.length > 0 ? '\n\n' : ''}`;
        const actions = inputActions || {};
    
        // Newer DSH releases expose a revision-guarded splice. It inserts at [0, 0]
        // and leaves the rest of the draft, including reference chips, intact.
        if (typeof actions.insertText === 'function') {
          let captured = {};
          if (typeof actions.captureInsertion === 'function') {
            try { captured = actions.captureInsertion() || {}; } catch { captured = {}; }
          }
          const span = { ...captured, start: 0, end: 0 };
          // A host action is not this plugin's contract to trust: a throw here would
          // escape the click handler, and React answers that by unmounting the slot
          // entry, taking the composer button with it. A refusal is recoverable.
          let applied = false;
          try {
            applied = actions.insertText(insertion, span) === true;
          } catch {
            setFeedback(t('error.unavailable'));
            return;
          }
          if (!applied) {
            setFeedback(t('error.changed'));
            return;
          }
          dismiss(false);
          return;
        }
    
        // Older DSH exposes only setDraft, which flattens rich references. Keep
        // ordinary text intact, but refuse that fallback when references are present.
        const occurrences = input && Array.isArray(input.occurrences) ? input.occurrences : [];
        if (occurrences.length > 0) {
          setFeedback(t('error.references'));
          return;
        }
        if (typeof actions.setDraft !== 'function') {
          setFeedback(t('error.unavailable'));
          return;
        }
        try {
          actions.setDraft(`${insertion}${draft}`);
        } catch {
          setFeedback(t('error.unavailable'));
          return;
        }
        dismiss(false);
      };
    
      const options = MODES.map((mode) => h('button', {
        key: mode,
```

</details>

**依据 4 · 源码核查**：[src/client.cjs:296-349](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/src/client.cjs#L296-L349)

UI服务/样式生命周期。

<details>
<summary>查看原文（54行）</summary>

```text
  // therefore caught: a missing surface costs the button, never the GUI.
  ctx.effect(() => {
    try {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
      return () => style.remove();
    } catch {
      return () => {};
    }
  }, 'no-ai-style: composer styles');

  ctx.inject(['locale'], (localeCtx) => {
    // One effect per dictionary, each guarded on its own, so a single rejection
    // cannot cost the others. A profile with no locale service renders
    // dictionary keys instead of copy: degraded, not broken.
    const registerCopy = (...args) => {
      const label = typeof args[1] === 'string' ? args[1] : 'zh/en';
      ctx.effect(() => {
        try {
          return localeCtx.locale.register(...args);
        } catch {
          return () => {};
        }
      }, `no-ai-style: ${label} copy`);
    };
    registerCopy(NS, { zh, en });
    // DSH language packs can add Japanese. Registering this dictionary lets
    // the UI follow that locale without changing the user's global language list.
    registerCopy(NS, 'ja', ja);
    registerCopy(NS, 'ja-JP', ja);
  });

  ctx.inject(['slots'], (slotsCtx) => {
    const slots = slotsCtx.slots;
    return slots.inject('conversation.input.right', () => {
      try {
        return slots.register({
          name: 'conversation.input.right',
          id: 'no-ai-style-mode-picker',
          order: 65,
          locale: NS,
        }, ModePicker);
      } catch {
        return () => {};
      }
    });
  });
}

exports.name = 'no-ai-style';
exports.inject = [];
exports.apply = apply;
```

</details>

**依据 5 · 源码核查**：[package.json:26-42](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/package.json#L26-L42)

DSH/UI范围。

<details>
<summary>查看原文（17行）</summary>

```text
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-slots",
        "react",
        "react-dom"
      ]
    }
  },
  "keywords": [
    "dsh-plugin",
```

</details>

**依据 6 · 源码核查**：[package.json:58-74](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/package.json#L58-L74)

当前peer及可选React边界，不能继承旧engines范围。

<details>
<summary>查看原文（17行）</summary>

```text
  },
  "license": "MIT",
  "author": "01NGVI-QINGYI",
  "peerDependencies": {
    "@deepseek-ai/dsh-skill-filesystem": ">=0.1.0-rc.6 <0.3.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "react": {
      "optional": true
    },
    "react-dom": {
      "optional": true
    }
  }
}
```

</details>

#### 缺口

- 部署宿主insertText/captureInsertion与setDraft的最新草稿/引用契约
  **影响**：按钮拒绝分支可查，但跨版本插入是否总保留最新引用和正文需对应ABI支持
  **进一步探讨**：对照固定宿主输入动作契约，用草稿变更/带引用和拒绝动作记录核边界

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 两个离线脚本能够证明哪些结论？

**研究主题**：缺陷与关键质疑

#### 完整回答

audit_prose逐行用短正则找空前言、泛背景、叠加不确定和会话残留，按语言或auto扫描，屏蔽URL/HTML注释/代码围栏并报告未闭合位置；flags是审阅候选，不自动删改。strict只因high告警非零，常见风格low/medium不阻断；INTERPRETATION FLAG是medium，意为仍需作者判断，不是机器通过即ready。未命中词表不证明没有问题、文本由人写或未抄袭。

compare_anchors按正则抽数字/若干单位、年份日期、数值引用和DOI的Counter差集，忽略三反引号代码。可发现某些数字/引文值变化，却不绑定数值到对象/位置，交换两组结果仍可能同一multiset；不捕捉因果/否定/人群变化，模型名或作者年引用也不因Skill要求就全部被算法抽出。相同anchors和strict退出0不能证明命题等价。脚本自己caution和evidence-boundary明确人工逐命题比对，故缺口在自动保证范围有限，不能把它误写为作者承诺自动验证语义。

Skill的“没证据不ready”可改善审阅纪律，但执行由模型/人负责；未提供真实文稿盲评/跨语言忠实率或对抗幻觉数据，不能把规则/样例和测试token存在当已实现质量提升。

#### 证据与依据

**依据 1 · 源码核查**：[skills/no-ai-style/scripts/audit_prose.py:15-42](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/skills/no-ai-style/scripts/audit_prose.py#L15-L42)

短模式与marker。

<details>
<summary>查看原文（28行）</summary>

```text
# Severity reflects review priority, not a probability of AI authorship.
PATTERNS = {
    "en": [
        ("empty-preface", "low", r"\b(?:it is worth noting that|needless to say|it goes without saying)\b", "Consider whether the sentence can begin with the actual claim."),
        ("generic-scene-setting", "low", r"\b(?:in today's (?:fast[- ]paced|rapidly changing) world|in the modern era)\b", "Replace generic scene-setting with relevant context."),
        ("stacked-uncertainty", "medium", r"\b(?:may potentially|might possibly|could perhaps)\b", "Choose the level of uncertainty supported by the evidence."),
        ("empty-evaluation", "low", r"\b(?:a groundbreaking breakthrough|a highly significant and important)\b", "Supply concrete evidence or remove the evaluation."),
        ("conversation-residue", "medium", r"\b(?:as you requested,? (?:i|we) (?:did not|removed|avoided)|per your instructions,? without)\b", "Describe the final work, unless the history is part of the deliverable."),
    ],
    "zh": [
        ("empty-preface", "low", r"(?:众所周知|不难发现|值得一提的是)", "检查是否可以直接写出实质内容。"),
        ("generic-scene-setting", "low", r"(?:随着时代的不断发展|在当今快速发展的时代)", "用与研究问题直接相关的背景代替。"),
        ("stacked-uncertainty", "medium", r"(?:可能或许|也许可能|可能有可能)", "保留证据要求的单一限定。"),
        ("conversation-residue", "medium", r"(?:按照你的要求[，,]?我们(?:删除|没有使用|避免)|根据之前的要求[，,]?已(?:去掉|删去))", "区分真实变更记录和不必要的对话回声。"),
    ],
    "ja": [
        ("empty-preface", "low", r"(?:言うまでもなく|周知のとおり)", "必要な根拠や主張を先に示せるか確認してください。"),
        ("stacked-uncertainty", "medium", r"(?:可能性があるかもしれない|示唆される可能性があるかもしれない)", "根拠に合う不確実性の表現を選んでください。"),
        ("conversation-residue", "medium", r"(?:ご指示どおり[、,]?(?:削除|使用せず)|先ほどのご要望に従い)", "必要な変更履歴か、単なる会話の残りか判定してください。"),
    ],
}

PLACEHOLDER = re.compile(r"\[(?:VERIFY|TODO|REF\?|CITATION NEEDED|EVIDENCE GAP|INTERPRETATION FLAG)(?::[^\]]*)?\]", re.IGNORECASE)
FENCE = re.compile(r"^ {0,3}(`{3,}|~{3,})(.*)$")


def scan(content: str, lang: str = "auto") -> list[dict]:
    """Return inspectable issues; leave source text unchanged."""
```

</details>

**依据 2 · 源码核查**：[skills/no-ai-style/scripts/audit_prose.py:45-108](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/skills/no-ai-style/scripts/audit_prose.py#L45-L108)

扫描屏蔽/定位。

<details>
<summary>查看原文（64行）</summary>

```text
    fence_token = None
    comment_open = None
    for line_no, line in enumerate(content.splitlines(), start=1):
        # Strip blockquote markers without shifting reported source columns.
        prefix = re.match(r"^(?: {0,3}>[ \t]?)+", line)
        offset = prefix.end() if prefix else 0
        body = line[offset:]
        if fence_token is not None:
            char, length, opening_line, opening_column = fence_token
            if re.fullmatch(r" {0,3}" + re.escape(char) + "{" + str(length) + r",}[ \t]*", body):
                fence_token = None
            continue
        # Mask complete and multiline HTML comments, retaining visible text.
        visible = list(body)
        cursor = 0
        while cursor < len(body):
            if comment_open is not None:
                end = body.find("-->", cursor)
                stop = len(body) if end < 0 else end + 3
                visible[cursor:stop] = " " * (stop - cursor)
                cursor = stop
                if end < 0:
                    break
                comment_open = None
            else:
                start = body.find("<!--", cursor)
                if start < 0:
                    break
                comment_open = (line_no, offset + start + 1)
                cursor = start
        visible_body = "".join(visible)
        match = FENCE.match(visible_body)
        if match:
            token, info = match.groups()
            if token[0] != "`" or "`" not in info:
                fence_token = (token[0], len(token), line_no, offset + match.start(1) + 1)
                continue
        inspected = " " * offset + visible_body
        # Mask URLs in place so reported columns still locate the source text.
        inspected = re.sub(r"https?://\S+", lambda m: " " * len(m.group(0)), inspected)
        for m in PLACEHOLDER.finditer(inspected):
            result.append({"line": line_no, "start": m.start() + 1,
                           "rule": "unresolved-placeholder",
                           "severity": "medium" if m.group(0).upper().startswith("[INTERPRETATION FLAG") else "high",
                           "match": m.group(0),
                           "advice": "Request author clarification for this interpretation." if m.group(0).upper().startswith("[INTERPRETATION FLAG") else "Resolve or explicitly disclose this missing item before publication."})
        for region in active:
            for rule, severity, pattern, advice in PATTERNS[region]:
                for m in re.finditer(pattern, inspected, re.IGNORECASE):
                    result.append({"line": line_no, "start": m.start() + 1, "rule": rule,
                                   "severity": severity, "match": m.group(0), "advice": advice})
    if fence_token is not None:
        char, length, line_no, column = fence_token
        result.append({"line": line_no, "start": column,
                       "rule": "unclosed-code-fence", "severity": "high",
                       "match": char * length,
                       "advice": "Close this fence and scan again; the remaining fenced content was excluded."})
    if comment_open is not None:
        line_no, column = comment_open
        result.append({"line": line_no, "start": column,
                       "rule": "unclosed-html-comment", "severity": "high",
                       "match": "<!--",
                       "advice": "Close this comment and scan again; its contents were excluded."})
    return sorted(result, key=lambda item: (item["line"], item["start"], item["rule"]))
```

</details>

**依据 3 · 源码核查**：[skills/no-ai-style/scripts/audit_prose.py:111-136](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/skills/no-ai-style/scripts/audit_prose.py#L111-L136)

strict语义。

<details>
<summary>查看原文（26行）</summary>

```text
def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("file", type=Path)
    parser.add_argument("--lang", choices=["auto", "en", "zh", "ja"], default="auto")
    parser.add_argument("--format", choices=["text", "json"], default="text")
    parser.add_argument("--strict", action="store_true", help="Exit 1 for unresolved evidence markers or unclosed markup")
    args = parser.parse_args()
    try:
        content = args.file.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as exc:
        parser.error(f"cannot read input: {exc}")
    findings = scan(content, args.lang)
    if args.format == "json":
        print(json.dumps({"file": str(args.file), "findings": findings,
                          "note": "Heuristic review flags, not a plagiarism/AI detector."}, ensure_ascii=False, indent=2))
    else:
        print(f"{args.file}: {len(findings)} review flag(s)")
        for f in findings:
            print(f"  {f['line']}:{f['start']} [{f['severity']}/{f['rule']}] {f['match']!r}: {f['advice']}")
        if not findings:
            print("  No listed patterns found. Factual and ethical checks remain necessary.")
    return int(args.strict and any(f["severity"] == "high" for f in findings))


if __name__ == "__main__":
    raise SystemExit(main())
```

</details>

**依据 4 · 源码核查**：[skills/no-ai-style/scripts/compare_anchors.py:15-40](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/skills/no-ai-style/scripts/compare_anchors.py#L15-L40)

正则/Counter。

<details>
<summary>查看原文（26行）</summary>

````text
# Preserve common result-bearing symbols and identifiers; exclude bare prose.
ANCHOR = re.compile(
    r"(?<!\w)(?:10\.\d{4,9}/[-._;()/:A-Za-z0-9]+|"
    r"(?:p\s*[<=>]\s*)?\d+(?:\.\d+)?\s*(?:%|％|ms|s|kg|mg|mm|cm|km|Hz|GB|MB|CI|SD|SE)|"
    r"(?:19|20)\d{2}(?:[-/]\d{1,2}(?:[-/]\d{1,2})?)?|"
    r"\d+(?:\.\d+)?(?:e[+-]?\d+)?|"
    r"\[(?:\d+(?:\s*[,–-]\s*\d+)*)\])(?!\w)",
    flags=re.IGNORECASE,
)
# A deliberately straightforward extractor that makes no assumptions about meaning.
# See README: read changes manually, especially if numeric values move between sections.


def anchors(text: str) -> Counter[str]:
    # Ignore fenced code, which may contain dozens of irrelevant literal numbers.
    clean = re.sub(r"(?ms)^\s*```.*?^\s*```\s*$", "", text)
    found = [x.group(0).strip() for x in ANCHOR.finditer(clean)]
    return Counter(found)


def compare(before: str, after: str) -> dict:
    b, a = anchors(before), anchors(after)
    missing, added = b - a, a - b
    return {"removed_anchors": dict(sorted(missing.items())),
            "added_anchors": dict(sorted(added.items())),
            "caution": "Differences require human review; equal anchors do not ensure equal meaning."}
````

</details>

**依据 5 · 源码核查**：[skills/no-ai-style/references/evidence-boundary.md:18-43](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/skills/no-ai-style/references/evidence-boundary.md#L18-L43)

人工命题流程。

<details>
<summary>查看原文（26行）</summary>

```text

1. **Inventory anchors.** Copy or record key numbers, units, sample sizes,
   dates, model identifiers, citations, outcomes, and uncertainty markers
   before revising. Run `scripts/compare_anchors.py` when files are present,
   then manually inspect items the script cannot recognize.
2. **Express the proposition.** For each key sentence, record who or what
   is involved, what is asserted, on which population, over which time,
   according to which data or reference.
3. **Map evidence.** Point to a supplied table, figure, analysis output,
   method section, or checked source. If evidence is missing, label
   `[EVIDENCE GAP]` and block release until it is supplied.
4. **Compare inference force.** Ask if the revised version strengthens a
   modal, changes an association into a causal relationship, generalizes
   beyond the sample, turns a plan into a result, or adds a recommendation.
   When present evidence allows multiple readings, label
   `[INTERPRETATION FLAG]` pending author choice.
5. **Account for inconvenient facts.** Track negative or null outcomes,
   contradictory evidence, confounds, imprecision, and scope restrictions.
   A moved limitation must still be accessible; an omitted necessary
   limitation is a failed check.
6. **Decide.** Accept edits only when the revised proposition is entailed
   by or no stronger than the evidence-supported original, or a specific
   justified factual change is explicitly documented. Otherwise revert,
   narrow the language, or report `VERIFY`.

## High-risk changes
```

</details>

**依据 6 · 源码核查**：[skills/no-ai-style/references/evidence-boundary.md:61-63](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/skills/no-ai-style/references/evidence-boundary.md#L61-L63)

数值相同不等命题等价。

```text
Checking numeric anchors alone never establishes claim equivalence.
The human reviewer must still inspect scope, attribution, causal language,
modality, and missing qualifiers.
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程证据与阶段成本如何判断？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

可选脚本纯标准库、只读文本；Python测试直接导入生产函数，覆盖语言patterns、真实hedge不误标、代码/注释/URL定位和部分anchors变化。另一些测试只检查Skill含特定规则，文件已有说明不是模型行为测试。client-smoke加载生产bundle并用mock React/host检查三语言、legacy、新revision span、引用拒绝/取消和宿主throw；能守接线设计，不是浏览器交互或写作效果对照。本次只读测试不执行。



成本以一份授权范围内可读且事实忠实的稿为单位，须计模型重写、失败回退与作者逐命题/引用复核。audit只列问题，revise/compose由Agent依据授权写作；Python脚本不联网并不证明宿主模型不外发。没有盲评忠实率、金额或人工耗时，不能据零告警推出固定净收益。

#### 证据与依据

**依据 1 · 源码核查**：[skills/no-ai-style/tests/test_no_ai_style.py:1-113](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/skills/no-ai-style/tests/test_no_ai_style.py#L1-L113)

生产scanner/anchor测试。

<details>
<summary>查看原文（113行）</summary>

`````text
"""Offline behavior checks for No AI Style's optional utilities."""
import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load(name):
    spec = importlib.util.spec_from_file_location(name, ROOT / 'scripts' / f'{name}.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


audit = load('audit_prose')
compare = load('compare_anchors')


class TestAuditor(unittest.TestCase):
    def test_empty_intro(self):
        self.assertIn('empty-preface', {r['rule'] for r in audit.scan('It is worth noting that 18 users participated.', 'en')})

    def test_protect_real_hedge(self):
        self.assertEqual(audit.scan('The findings may suggest an association.', 'en'), [])

    def test_redundant_modal_english(self):
        self.assertIn('stacked-uncertainty', [r['rule'] for r in audit.scan('This may potentially be useful.', 'en')])

    def test_chinese(self):
        self.assertTrue(audit.scan('众所周知，这个问题可能或许存在。', 'zh'))

    def test_japanese(self):
        self.assertTrue(audit.scan('可能性があるかもしれない。', 'ja'))

    def test_skip_code_block(self):
        self.assertEqual(audit.scan('```\nIt is worth noting that\n```', 'en'), [])

    def test_flag_placeholder(self):
        x = audit.scan('The result was meaningful [VERIFY: numerical estimate].')
        self.assertEqual(x[0]['severity'], 'high')

    def test_evidence_gap_is_high_severity(self):
        flagged = audit.scan('There were [EVIDENCE GAP: missing sample counts].')
        self.assertEqual(flagged[0]['severity'], 'high')

    def test_interpretation_flag_is_medium_severity(self):
        flagged = audit.scan('This effect has [INTERPRETATION FLAG: unclear direction].')
        self.assertEqual(flagged[0]['severity'], 'medium')

    def test_no_banlist(self):
        self.assertEqual(audit.scan('We found no statistically significant difference.', 'en'), [])


class TestMarkup(unittest.TestCase):
    def test_multiline_comments_and_visible_suffix(self):
        rows = audit.scan('<!--\nIt is worth noting that hidden.\n--> It is worth noting that visible.', 'en')
        self.assertEqual([(r['line'], r['start'], r['rule']) for r in rows], [(3, 5, 'empty-preface')])

    def test_inline_comment_preserves_columns(self):
        line = '<!-- hidden --> It is worth noting that visible.'
        rows = audit.scan(line, 'en')
        self.assertEqual(rows[0]['start'], line.index('It is') + 1)

    def test_multiple_comments(self):
        self.assertEqual(audit.scan('<!-- needless to say --> clean <!-- might possibly -->', 'en'), [])

    def test_unclosed_fence_is_reported(self):
        rows = audit.scan('```python\nIt is worth noting that hidden.', 'en')
        self.assertEqual([(r['line'], r['rule'], r['severity']) for r in rows], [(1, 'unclosed-code-fence', 'high')])

    def test_shorter_fence_does_not_close(self):
        rows = audit.scan('````\n```\nIt is worth noting that hidden.\n````\nIt is worth noting that visible.', 'en')
        self.assertEqual([r['line'] for r in rows], [5])

    def test_quoted_tilde_fence_and_crlf(self):
        rows = audit.scan('> ~~~\r\n> It is worth noting that hidden.\r\n> ~~~\r\nIt is worth noting that visible.', 'en')
        self.assertEqual([r['line'] for r in rows], [4])

    def test_unclosed_comment_is_reported(self):
        rows = audit.scan('<!--\nIt is worth noting that hidden.', 'en')
        self.assertEqual([(r['rule'], r['severity']) for r in rows], [('unclosed-html-comment', 'high')])

    def test_url_mask_preserves_columns(self):
        line = 'https://example.org/path It is worth noting that visible.'
        self.assertEqual(audit.scan(line, 'en')[0]['start'], line.index('It is') + 1)

    def test_markup_in_code_does_not_start_comment(self):
        self.assertEqual(audit.scan('```html\n<!--\n```\nPlain text.', 'en'), [])


class TestAnchors(unittest.TestCase):
    def test_detect_numeric_change(self):
        r = compare.compare('Accuracy was 81%.', 'Accuracy was 88%.')
        self.assertIn('81%', r['removed_anchors'])
        self.assertIn('88%', r['added_anchors'])

    def test_no_change(self):
        r = compare.compare('In 2025 we tested 30 participants.', 'We tested 30 participants in 2025.')
        self.assertEqual(r['removed_anchors'], {})
        self.assertEqual(r['added_anchors'], {})

    def test_citations(self):
        r = compare.compare('see [12]', 'see [13]')
        self.assertTrue(r['removed_anchors'] or r['added_anchors'])

    def test_ignores_code(self):
        r = compare.compare('```\n500\n```\nResult 20%', '```\n900\n```\nResult 20%')
        self.assertEqual(r['removed_anchors'], {})


class TestSkillInstructions(unittest.TestCase):
    """Instruction checks; not a model behavior test."""
`````

</details>

**依据 2 · 源码核查**：[skills/no-ai-style/tests/test_no_ai_style.py:116-174](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/skills/no-ai-style/tests/test_no_ai_style.py#L116-L174)

指令存在性测试。

<details>
<summary>查看原文（59行）</summary>

```text
    def setUpClass(cls):
        cls.skill = (ROOT / 'SKILL.md').read_text(encoding='utf-8')
        cls.lang = (ROOT / 'references' / 'language-notes.md').read_text(encoding='utf-8')

    def test_chinese_academic_rules_present(self):
        for token in ('**Chinese academic:**', '笔者认为', '研究表明',
                      '相关', '导致', '倾向于'):
            self.assertIn(token, self.skill)

    def test_multilingual_evidential_hedges(self):
        for token in ('`may`', '`suggest`', '`可能`', '`或许`',
                      '`示唆する`', '`と考えられる`'):
            self.assertIn(token, self.skill)

    def test_backcheck_failure_behavior(self):
        self.assertIn('If 5.1 (anchors) or 5.2', self.skill)
        self.assertIn('report the failure and the required author input', self.skill)
        self.assertNotIn('Stop at the first failure', self.skill)

    def test_delivery_surface_wording(self):
        self.assertIn('must not reference\ndiscarded conversations', self.skill)
        self.assertNotIn('must not advertise', self.skill)

    def test_language_notes_chinese_distinctions(self):
        for token in ('笔者认为', '研究表明', '相关', '导致', '可能', '或许'):
            self.assertIn(token, self.lang)


class TestCompactGuidance(unittest.TestCase):
    """Keep boundaries actionable and avoid repeated disclaimer paragraphs."""

    @classmethod
    def setUpClass(cls):
        cls.skill = (ROOT / 'SKILL.md').read_text(encoding='utf-8')
        cls.readme = (ROOT.parents[1] / 'README.md').read_text(encoding='utf-8')

    def test_single_readme_detector_boundary(self):
        self.assertEqual(self.readme.lower().count('ai-detector'), 1)
        self.assertNotIn('plagiarism or AI-authorship certificates', self.readme)

    def test_backcheck_remains_operational(self):
        for phrase in ('Gate 2 (truth boundary) always wins',
                       'If 5.1 (anchors) or 5.2',
                       'report the failure and the required author input',
                       'Treat script findings as review flags'):
            self.assertIn(phrase, self.skill)

    def test_attribution_and_unknown_markers_remain(self):
        for phrase in ('retain attribution', '[EVIDENCE GAP]', '[INTERPRETATION FLAG]'):
            self.assertIn(phrase, self.skill)
        self.assertIn('blocks `ready`', self.readme)

    def test_no_repeated_defensive_script_language(self):
        self.assertNotIn('A clean report is not proof', self.skill)
        self.assertNotIn('never certify plagiarism freedom', self.skill)


if __name__ == '__main__':
    unittest.main()
```

</details>

**依据 3 · 源码核查**：[tests/client-smoke.cjs:125-176](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/tests/client-smoke.cjs#L125-L176)

新旧插入与取消mock。

<details>
<summary>查看原文（52行）</summary>

```text
};
hookState.length = 0;
const legacyWrites = [];
const legacyProps = {
  t: (key) => translated[key] || key,
  useInput: (select) => select({ draft: 'keep this suffix', phase: 'plain', occurrences: [] }),
  inputActions: { setDraft: (text) => legacyWrites.push(text) },
};
let tree = chooseMode(legacyProps, 'audit');
findButton(tree, (item) => item.children.includes(translated['button.insert'])).props.onClick();
assert.deepEqual(legacyWrites, [
  `${translated['prompt.audit']}\n\nkeep this suffix`,
]);

hookState.length = 0;
let insertedText;
let insertedSpan;
const modernProps = {
  t: (key) => key,
  useInput: (select) => select({ draft: 'existing text', phase: 'plain', occurrences: [{ source: 'file' }] }),
  inputActions: {
    captureInsertion: () => ({ draftRev: 17, start: 4, end: 8 }),
    insertText: (text, span) => { insertedText = text; insertedSpan = span; return true; },
  },
};
tree = chooseMode(modernProps, 'revise');
findButton(tree, (item) => item.children.includes('button.insert')).props.onClick();
assert.equal(insertedText, 'prompt.revise\n\n');
assert.deepEqual({ ...insertedSpan }, { draftRev: 17, start: 0, end: 0 });

hookState.length = 0;
let flattenedReference = false;
const referencedProps = {
  t: (key) => key,
  useInput: (select) => select({ draft: 'text', phase: 'plain', occurrences: [{ source: 'file' }] }),
  inputActions: { setDraft() { flattenedReference = true; } },
};
tree = chooseMode(referencedProps, 'compose');
findButton(tree, (item) => item.children.includes('button.insert')).props.onClick();
assert.equal(flattenedReference, false);
assert.ok(flatten(render(referencedProps)).some((node) => node.props && node.props.role === 'alert'));

hookState.length = 0;
let cancelledWrite = false;
const cancelProps = {
  t: (key) => key,
  useInput: (select) => select({ draft: 'leave this alone', phase: 'plain', occurrences: [] }),
  inputActions: { setDraft() { cancelledWrite = true; } },
};
tree = chooseMode(cancelProps, 'compose');
findButton(tree, (item) => item.children.includes('button.cancel')).props.onClick();
assert.equal(cancelledWrite, false);
```

</details>

**依据 4 · 源码核查**：[tests/client-smoke.cjs:247-274](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/tests/client-smoke.cjs#L247-L274)

宿主拒绝防throw。

<details>
<summary>查看原文（28行）</summary>

```text
// --- a host whose setDraft throws -------------------------------------------
hookState.length = 0;
assert.doesNotThrow(() => {
  const hostile = chooseMode({
    t: (key) => english[key] || key,
    useInput: (select) => select({ draft: 'text', phase: 'plain', occurrences: [] }),
    inputActions: { setDraft() { throw new Error('host refused'); } },
  }, 'audit');
  findButton(hostile, (item) => item.children.includes(english['button.insert'])).props.onClick();
}, 'a throwing setDraft must not reach the error boundary');

// --- apply() against a profile whose optional services misbehave -------------
// The web shell treats a throwing apply as a boot failure, so a broken optional
// service must cost the button, never the GUI.
assert.doesNotThrow(() => {
  plugin.apply({
    effect(fn) { fn(); return () => {}; },
    inject(names, callback) {
      if (names[0] === 'locale') {
        callback({ locale: { register() { throw new Error('no locale'); } } });
      } else {
        callback({ slots: { inject(name, setup) { return setup(); }, register() { throw new Error('slot taken'); } } });
      }
    },
  });
}, 'apply() must survive every optional service failing');

console.log('client smoke passed: slot and locale wiring, prepend without replacement, rich-reference safety, cancel, trigger label, zh/en/ja x 3 modes, empty draft, absent draft, hostile host, hostile apply');
```

</details>

**依据 5 · 源码核查**：[skills/no-ai-style/SKILL.md:43-53](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/skills/no-ai-style/SKILL.md#L43-L53)

文件授权/三模式。

<details>
<summary>查看原文（11行）</summary>

```text
| --- | --- | --- | --- |
| `audit` | inspect, critique, identify problems; ready to submit, final check, publish | Read and report; do not edit source files | Prioritized findings; when readiness is requested, add a verdict and unresolved risks |
| `revise` | polish, humanize, tighten, rewrite, no-ai-style | Edit the authorized passage only | Revised text and a brief change summary |
| `compose` | draft from notes, tables, findings | Write from given material, marking unknowns | Draft with unresolved-evidence notes if needed |

If the user requests only a translation, preserve source meaning,
register, qualifiers, and citations before attempting stylistic
changes. If only a response is needed, do not create or modify files.

## Five gates

```

</details>

#### 缺口

- 真实跨语言文稿在同条件模型/读者下的可读性收益、事实忠实与人工复核工时
  **影响**：不能把有门槛的提示流程排名为比通用润色已验证更优
  **进一步探讨**：固定文稿/模型与盲评标准，对照通用润色和原稿，计语义越界/未改问题/工时

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样采用，可推导什么可证伪方向？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可作为有人工作者复核的写作流程试用，先audit列出问题再决定revise范围，留原文并核原始证据；严禁将锚点相同、零flags或更自然文风作事实/原创认证。需要自动交付无需作者复核、或目标是检测器规避的人群不适用。旧DSH带引用时拒插是保护，可直接在保留引用的宿主流程明确输入指令，不能为过按钮删掉必要证据。

由Counter不保关系和模式提示可推“命题级变更收据”方向——在已有锚点旁记录对象/关系/模态/来源/段落，逐项说明改写依据和作者批准状态，保留小改优先而非再堆禁词。基线为数字multiset+人工Claim-Equilibrium。最小反例包括A/B结果互换、相关改因果、删除null结果、同数不同人群、模型名改写、CJK证据语气与代码中的重要值。若新增收据仍漏这些越界或人工工时显著增加却不减少误改，则否定收益假设；比较盲评忠实、阅读问题解决和复核时间，方向未验证不计已有能力。

#### 证据与依据

**依据 1 · 源码核查**：[skills/no-ai-style/scripts/compare_anchors.py:25-40](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/skills/no-ai-style/scripts/compare_anchors.py#L25-L40)

锚点基线。

<details>
<summary>查看原文（16行）</summary>

````text
# See README: read changes manually, especially if numeric values move between sections.


def anchors(text: str) -> Counter[str]:
    # Ignore fenced code, which may contain dozens of irrelevant literal numbers.
    clean = re.sub(r"(?ms)^\s*```.*?^\s*```\s*$", "", text)
    found = [x.group(0).strip() for x in ANCHOR.finditer(clean)]
    return Counter(found)


def compare(before: str, after: str) -> dict:
    b, a = anchors(before), anchors(after)
    missing, added = b - a, a - b
    return {"removed_anchors": dict(sorted(missing.items())),
            "added_anchors": dict(sorted(added.items())),
            "caution": "Differences require human review; equal anchors do not ensure equal meaning."}
````

</details>

**依据 2 · 源码核查**：[skills/no-ai-style/references/evidence-boundary.md:18-43](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/skills/no-ai-style/references/evidence-boundary.md#L18-L43)

人工关系审查基线。

<details>
<summary>查看原文（26行）</summary>

```text

1. **Inventory anchors.** Copy or record key numbers, units, sample sizes,
   dates, model identifiers, citations, outcomes, and uncertainty markers
   before revising. Run `scripts/compare_anchors.py` when files are present,
   then manually inspect items the script cannot recognize.
2. **Express the proposition.** For each key sentence, record who or what
   is involved, what is asserted, on which population, over which time,
   according to which data or reference.
3. **Map evidence.** Point to a supplied table, figure, analysis output,
   method section, or checked source. If evidence is missing, label
   `[EVIDENCE GAP]` and block release until it is supplied.
4. **Compare inference force.** Ask if the revised version strengthens a
   modal, changes an association into a causal relationship, generalizes
   beyond the sample, turns a plan into a result, or adds a recommendation.
   When present evidence allows multiple readings, label
   `[INTERPRETATION FLAG]` pending author choice.
5. **Account for inconvenient facts.** Track negative or null outcomes,
   contradictory evidence, confounds, imprecision, and scope restrictions.
   A moved limitation must still be accessible; an omitted necessary
   limitation is a failed check.
6. **Decide.** Accept edits only when the revised proposition is entailed
   by or no stronger than the evidence-supported original, or a specific
   justified factual change is explicitly documented. Otherwise revert,
   narrow the language, or report `VERIFY`.

## High-risk changes
```

</details>

**依据 3 · 源码核查**：[skills/no-ai-style/SKILL.md:155-194](https://github.com/01NGVI-QINGYI/no-ai-style/blob/1e11eb699fbc3745a03fae8672921019569d85bf/skills/no-ai-style/SKILL.md#L155-L194)

回查/最小修改。

<details>
<summary>查看原文（40行）</summary>

```text
Run these checks **in order of priority**. If 5.1 (anchors) or 5.2
(claim strength) fails, do not continue stylistic polishing or deliver
the affected revision. Revert or narrow the unsupported change, or
report the failure and the required author input.

**5.1 Anchors unchanged.** Compare before/after with
`scripts/compare_anchors.py` or by reading. Every number, unit,
citation locator, model name, and date must match or have a documented
reason to change.

**5.2 Claim strength preserved or narrowed.** For every substantive
claim, check: did the revision make the claim *stronger*? If the
original said "associated with," the revision must not say "causes."
If the original reported a null result, the revision must not delete
it. Use the `Claim-Equilibrium` procedure in
`references/evidence-boundary.md`.

**5.3 Caveats still accessible.** Relevant limitations and contrary
evidence must remain at a location a reader can find. Relocate a caveat only when readers can still interpret the claim correctly
where it appears; keep essential scope in the abstract itself.

**5.4 Coherence after edits.** Terminology, scope, tense, paragraph
links, and genre-specific register are consistent from opening to
close. Compare changed passages with the source in both directions:
identify reading problems still present, and information or intentional
expression the edit damaged. Restore a useful construction when its
replacement is less precise or less recognizably the author’s. Stop
when the requested problems are resolved; do not manufacture another pass.

**5.5 Delivery surface clean.** The final artifact must not reference
discarded conversations or options that were never implemented.
Required historical records (changelogs, migration notes, audit
trails) are retained. Apply the check separately to each surface:
title, abstract, commit message, PR description, body, captions, tags.

**5.6 Original authorship.** The output is not a mechanical
paraphrase of another author's prose. Attribution is maintained where
needed.

Treat script findings as review flags; check the text and underlying evidence before accepting edits.
```

</details>

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
