# QA Skills

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[34b08d6](https://github.com/fishzjp/qa-skills/tree/34b08d6e4a7a2e72da0f01759b161b46d6776054)

<!-- BEGIN META -->
[![GitHub ★ 60](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=60&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/fishzjp/qa-skills)
<!-- END META -->

> **功能**：提供跨宿主测试工程 Skill 集合，组织需求、策略、用例、执行证据、回归与报告。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持将既有测试方法组织成12任务技能与core、阶段产物和机械门槛。贡献在流程与证据衔接，不是新测试引擎或自动保证缺陷检出。

> **主要限制**：[Q02](#research-q02)、[Q03](#research-q03)说明文件、Schema和路径存在不证明测试真实有效；重要语义仍需人工/Agent回原件。安装多目录切换非原子，外部工具和账号也不会随技能安装齐备。

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
  - [Q01 · 当前是测试Skill集合还是自动运行测试的DSH插件？](#detail-section-11)
  - [Q02 · 规划、执行、证据和续跑如何组织？](#detail-section-12)
  - [Q03 · 安装和长期使用有哪些可见负担与失败边界？](#detail-section-13)
  - [Q04 · 何时值得试用，怎样证明比自由测试提示更好？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：供已有Agent、测试环境和工具的开发/QA团队，把一个明确需求转成可复核策略、用例和真实运行报告；仅方法文本不代表测试系统已运行。

相对自由一句测试提示，增加职责、证据层级与续跑契约；相对测试框架，本集合不替代Playwright、pytest或真实环境。当前主分发是技能目录，遗留DSH插件非推荐新入口，见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 测试阶段Skill集 | 按需求分阶段组织测试工作 | 12任务技能不等12个独立Agent或自动执行器 |
| qa薄编排 | 文件状态、人工检查点与续跑 | 宿主支持才有子上下文，否则顺序衔接 |
| core证据与模板 | 对齐风险、用例和报告 | 规范文字不自动保证执行真实 |
| Python机械检查 | Schema、风险覆盖与文件引用 | 不证明证据语义，部分问题仅warning |
| 安装/卸载脚本 | 管理归属目录与版本标记 | 多目录非整组原子，中断需保留事务恢复 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 可加载Skill与读写文件的Agent宿主 | 必需 | 读取阶段与保存状态 | 目录存在不代表触发成功 |
| 全部技能与core同级资源 | 方法执行必需 | 共享证据/模板/脚本 | 单装可能断相对引用 |
| Python，可选PyYAML | 机械检查才需 | Schema与引用/覆盖检查 | 缺PyYAML会降级lint，不等全量解析 |
| 被测系统/账号与Playwright、pytest等 | 真实执行必需 | 浏览器/API任务 | 技能安装不会自动安装环境，缺失应受阻/移交 |
| 用户裁决与专业复核 | 关键歧义必需 | 意图、预算和缺陷定性 | 未决不能冒充已批准或通过 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 安装 | 用户选择宿主目录并保留core | 文件检查后另查真实装载，勿重复遗留插件 |
| 规划 | Agent按阶段产出并提交裁决点 | 风险、用例与预算有材料，未决保持未决 |
| 执行 | 工具或人工真实运行并回收结果 | 来源分报告与原件可查，不以写脚本代替执行 |
| 恢复退出 | 从最后完整阶段续跑，按归属卸载 | 中断锁/事务先保留恢复，测试外部副作用另行处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 模型与工具/环境资源金额未知 | 目录装载核对、账号和需求澄清 | 不自动安装执行器 |
| 持续 | 多阶段指令与模型调用成本未知 | 裁决、复核、产物维护和返工 | 作者预注入成本不直接外推 |
| 失败恢复 | 重跑/环境排障未知 | 读取文件状态、检查未决和中断事务 | 断电/SIGKILL无trap自动恢复 |
| 退出 | 卸载技能资源未知 | 保存自定义分支和项目测试产物 | 不撤销被测系统已发生动作 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 流程可追溯 | 阶段文件、裁决点和证据层级 | 真实宿主遵循与漏测改善 |
| 机械约束 | Schema、风险引用与文件存在检查 | 证据语义和用例真实执行 |
| 稳定性报告 | 首次通过/重试/隔离分开 | 是否减少团队噪声与全成本 |

> **思考**：[Q02](#research-q02)、[Q03](#research-q03)说明文件、Schema和路径存在不证明测试真实有效；重要语义仍需人工/Agent回原件。安装多目录切换非原子，外部工具和账号也不会随技能安装齐备。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持将既有测试方法组织成12任务技能与core、阶段产物和机械门槛。贡献在流程与证据衔接，不是新测试引擎或自动保证缺陷检出。

共享core、阶段文件衔接、裁决与事实分离以及安装暂存恢复可借鉴；形式检查与真实执行之间仍有语义边界。适配器保留不等当前npm分发，安装归属启发式也需用户核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)、[Q03](#research-q03)说明文件、Schema和路径存在不证明测试真实有效；重要语义仍需人工/Agent回原件。安装多目录切换非原子，外部工具和账号也不会随技能安装齐备。

<a id="detail-section-6"></a>

### 1.5 使用建议

从一项明确需求或单阶段开始，提供真实基线、环境和账号，保留原测试清单对照。核对Agent实际读取Skill与core，执行报告回查原件；不把Schema绿、重试绿和隔离后绿当任务健康。缺环境则明确移交，流程开销过大就退回阶段技能。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码与技能规则支持阶段、证据和安装恢复设计，未在真实宿主或被测系统执行。作者对照评测未独立复核；追加审计是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、.dsh/plugins/qa-skills.js、skills/qa/SKILL.md、skills/core/evidence.md、skills/core/scripts/validate_schema.py、skills/test-reliability/SKILL.md、skills/automated-e2e-testing/SKILL.md、scripts/verify_install.py、install.sh、uninstall.sh 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查当前README/分发、遗留DSH注册器、qa编排、证据规范、Schema路径检查、可靠性规则与安装卸载；未全面执行12阶段方法或独立复核作者评测原件。
- 下一步：未安装技能、运行目标脚本/测试/模型评测或被测系统。只有固定源码与技能规则；不声称真实宿主触发、端到端执行或收益通过。

**分析版本**

- **仓库**：[fishzjp/qa-skills](https://github.com/fishzjp/qa-skills)
- **版本号**：0.9.0（[固定提交 34b08d6](https://github.com/fishzjp/qa-skills/tree/34b08d6e4a7a2e72da0f01759b161b46d6776054)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)提出未验证的需求风险到用例再到真实运行原件的抽样语义审计，对照重要漏测/假通过与总工时调用成本。只扩字段不能证明改善，成本不抵结果就收窄或退出，不计已有贡献。

未安装技能、运行目标脚本/测试/模型评测或被测系统。只有固定源码与技能规则；不声称真实宿主触发、端到端执行或收益通过。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 133 | 85 | 36 | — |
| .md | source | 50 | 6379 | — | — | 116094 |
| .md | example | 14 | 2351 | — | — | 28332 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/fishzjp/qa-skills/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断测试工程Skill如何连接方法、真实执行与续跑产物，以及成本和验收边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 当前是测试Skill集合还是自动运行测试的DSH插件？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

当前主要交付是跨宿主测试工程Skill集合，12个任务技能与core共享资源，README已停止npm插件分发并指导安装技能目录；package private=true且保留.dsh适配器并不能覆盖当前分发约定。遗留适配器确有ctx.skills.register与resourceBase接线，core设为不可直接调用，因此不能说只有静态README，但也不能把保留入口当当前推荐安装路径。

适用者是已有编程Agent、需求/代码与测试环境，希望把需求澄清、风险策略、用例、执行证据、回归和报告串起来的开发/QA人员。相对临时一句“帮我测一下”，增量是阶段职责、显式产物、证据状态及人工裁决；相对Playwright或pytest本身，它不替代驱动器、账号、被测系统或运行环境。合格交付应有可复核用例、真实执行材料和未执行范围，而非一篇看起来完整的报告。

通用测试方法和工具是既有基础，贡献是将其组织为可加载技能与衔接契约。作者展示对照评测并承认装载/模型/成本限制，但本次未复核实验原始产物，不能把README数值作为独立效果结果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:69-77](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/README.md#L69-L77)

作者声明当前DSH技能目录安装且停止npm包分发。

````text
**DeepSeek Harness（dsh）**：克隆仓库后，直接安装到 dsh 的技能目录：

```bash
./install.sh --target ~/.dsh/skills
```

升级时 `git pull` 后重跑同一命令。项目已停止通过 npm 插件包分发；已有插件用户请先用 dsh 的插件管理器移除旧插件，再按上述方式安装，避免重复装载。

**手动复制**：把 `skills/` 下全部一级目录复制到宿主 skills 目录，保持各 skill 与 `core/` 同级；已有同名目录时先核对归属，避免覆盖其他内容。手动复制不生成版本标记。
````

**依据 2 · 源码核查**：[.dsh/plugins/qa-skills.js:101-132](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/.dsh/plugins/qa-skills.js#L101-L132)

保留适配器实际注册与core不可调用、缺依赖警告。

<details>
<summary>查看原文（32行）</summary>

```text
    skills.push({
      name: skill.name,
      description: skill.description,
      ...(skill.whenToUse ? { whenToUse: skill.whenToUse } : {}),
      content: skill.body,
      source: 'bundled',
      path: skillPath,
      // core 是共享知识库依赖单元：双不可调用，仅作为相对路径引用的落点存在
      ...(skill.name === DEPENDENCY_UNIT
        ? { invocation: { modelInvocable: false, userInvocable: false } }
        : {}),
      resourceBase: { kind: 'directory', path: skillDir },
    });
  }
  return skills;
};

/**
 * 插件入口：注册全部技能单元。每次注册都是随插件自身 fiber 销毁的 Cordis effect。
 * @param {import('@deepseek-ai/cordis').Context} ctx - 宿主注入的插件上下文。
 */
export function apply(ctx) {
  const skills = readSkills(ctx.logger);
  for (const skill of skills) ctx.skills.register(skill);

  // 安装完整性哨兵：缺 core 意味着引用路径断裂（其余 skill 的 ../core/*.md 会指向不存在目录）
  if (!skills.some((skill) => skill.name === DEPENDENCY_UNIT)) {
    ctx.logger.warn(
      `dsh-qa-skills: dependency unit "core" is missing from ${skillsDir}; relative references from other skills will break`,
    );
  }
  ctx.logger.info(`dsh-qa-skills: registered ${skills.length} skill unit(s) from ${skillsDir}`);
```

</details>

**依据 3 · 源码核查**：[skills/qa/SKILL.md:31-47](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/skills/qa/SKILL.md#L31-L47)

阶段、产物与人工检查点具体定义。

<details>
<summary>查看原文（17行）</summary>

```text
## 流水线与落盘产物（文件即流水线状态）

| # | 阶段 | skill | 落盘产物 | 人工检查点 |
|---|------|-------|---------|-----------|
| 0 | （旁路，可选）探索先行 | `exploratory-testing` | `{项目}/探索笔记_{主题}.md` | — |
| 1 | 需求理解 | `requirement-analysis` | `{项目}/需求模型.md`（含澄清记录） | ⏸ 澄清检查点：模糊/矛盾项等用户裁决 |
| 2 | 测试策略 | `test-strategy` | `{项目}/测试策略.md`（Risk Map + 两域 scope 含 type_scope）+ `专项移交_{轴}_{日期}.yaml`（有 handoff/blocked/外部执行器轴时） | ⏸ 预算裁决：full 预算裁剪触及 Critical 轴时呈现排序提案等用户裁决 |
| 3 | 用例编写 | `test-case-writing` | `{项目}/测试用例_markmap.md` + `测试用例.schema.yaml` | — |
| 4 | 用例审查 | `test-case-review` | 修订后用例文件 + 审查记录（重新抽取 Schema） | — |
| 5 | 执行 | `automated-e2e-testing` / `api-testing` / 手动 | 自动路径：执行代码或脚本（`playwright/` 或 API 测试脚本）+ **执行分报告** `测试报告_{来源}_{日期}.md`（命名见 `../core/report-template.md` 头注；至少 §2 执行统计 + §3 Bug 清单条目，字段按 report-template）；手动路径 `手动执行记录_{日期}.md` | ⏸ 执行策略裁决：确认 automation_plan 提案（手动/e2e/api）；手动路径执行后 ⏸ 结果回收（TC × 结果） |
| 6 | Bug 分析 | `bug-analysis`（有已确认 Bug 时） | 中间产物 `{项目}/Bug条目_{日期}.md`（条目结构与根因分析等五个扩展字段按 report-template §3）——此阶段**禁止新建或改写**最终测试报告 | ⏸ Bug 定性检查点：预期 vs 缺陷 |
| 7 | 回归验证 | `regression-testing`（有代码变更/Bug 修复时） | `{项目}/回归清单_{日期}.md` | — |
| 8 | 收尾报告 | 本 skill（按 `../core/report-template.md`） | `{项目}/测试报告_{日期}.md` | — |

> 旁路触发条件：文档缺失 / 系统陌生时，阶段 0 在阶段 1 之前先行，探索产出（系统理解 + 风险清单）作为需求建模输入。
>
> 手动执行路径无 skill 与自动产物——执行后按 ⏸ 结果回收检查点向用户索取结果，落盘 `手动执行记录_{日期}.md`（TC 编号 × 结果〔通过/失败/阻塞〕，失败附 Bug 编号或现象）：作为阶段 8 报告 §2 执行统计与 §3 Bug 清单的数据来源，防"未执行"列成为永久状态。
```

</details>

**依据 4 · 作者声明**：[README.md:228-240](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/README.md#L228-L240)

作者评测限制与预注入不等宿主形态。

<details>
<summary>查看原文（13行）</summary>

```text
- **E2E 真实执行**：真实浏览器里跑被测应用，不经裁判模型；无 skill 一侧包含没写出代码和跑不起来两种情形。
- **植入 Bug 检出率**：异构裁判口径，同源裁判下为 100%。
- **产出质量**：异构裁判评分，Δ+6.1pp（95% 置信区间跨零，主轮差异不显著；同源口径下显著）。
- **API 真实执行通过率 †**：修复评测缺陷后的干净复验（主模型 glm-5.2，n=3）：无/有 skill 100% / 99.2%，差距在噪声范围内、基本持平；另一轮弱模型结果为无 / 有 skill 0.30 / 0.67，有 skill 更优；两轮应分别解读。更早的反向结果经逐条失败归因，定案为评测侧缺陷而非 skill 缺陷，勘误见 [CHANGELOG](./CHANGELOG.md)。
- **Token 成本**：指令装载与工作流增加了成本。总 token 消耗比（任务级均值，含 skill 全量注入）：主模型轮 3.3×，弱模型轮最高 9.5×；对照实验显示，只注入核心标准文档时增益不复现——收益来自整套框架，不是某一份文档。
</details>

<details>
<summary><strong>预注册门判定与覆盖增益</strong></summary>

评测前预注册了通过门槛（防事后挑指标）：同源裁判口径通过 4/7，异构裁判口径通过 5/8（两侧门槛清单不同，其中一项在两个口径下方向相反）。覆盖增益（异构裁判）：用例编写 **+8.7pp**（95% CI [0.5, 15.4]）、全任务 **+13.2pp**（95% CI [2.8, 26.3]）、缺陷检出 **+9.7pp**（95% CI [3.3, 16.4]），均显著；同源口径 +3.8pp（裁判宽容偏差已量化并勘误，见 [CHANGELOG](./CHANGELOG.md)）。早期 +29pp 的单采样增益经多样本复验证实为噪声。

**口径边界**：评测时把 skill 全部指令一次性预注入，真实宿主是按需加载，不能直接据此推断所有宿主与模型的增益。真实宿主抽查（n=1）未观察到衰减，样本不足以证明两种装载方式等效。成对评审（两份产出对比打分）在三种裁判下平局都过多，胜率指标作废（机制问题）。
```

</details>

#### 缺口

- 未独立复核作者评测原始任务、模型与用户实际采用。
  **影响**：不能量化真实宿主增益或宣称跨模型一致有效。
  **进一步探讨**：在目标宿主用同需求/同预算对照是否减少漏测和返工，并保留原始执行证据。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 规划、执行、证据和续跑如何组织？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

qa是薄编排，宿主支持时每阶段独立上下文，仅读阶段Skill与上一阶段落盘产物；不支持则顺序会话以文件衔接，不具备一个自动持久工作流引擎。阶段清单规定需求模型、策略、用例双轨、审查、执行分报告、Bug中间条目、回归与最终报告。续跑读取流水线状态及完成判据，未决用户裁决不能当已批准；阶段4要有独立审查落款，不能只凭同名文件猜完成。

core证据规范区分静态代码、真实运行和意图裁决，根因推断不自动升级已验证。validate_schema是辅助机械门槛，比较用例编号、结构、风险覆盖与路径；check_path_refs对文件不存在只给warning，行号不核，且没有PyYAML会降级lint。它能减少格式与引用错误，不能证明风险结论真实、测试确实执行或断言正确。

可靠性Skill要求首次通过、重试救回与隔离数量分开，重试通过不是修复；这些是Agent应遵循的决策规则，不是自动配置CI的证明。执行仍需调用真实工具、账号和环境，并把结果写入报告，模型没有工具或只写脚本时不能算完成。

#### 证据与依据

**依据 1 · 源码核查**：[skills/qa/SKILL.md:23-29](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/skills/qa/SKILL.md#L23-L29)

上下文隔离的条件与单会话降级。

```text
## 编排会话模型（阶段间上下文隔离）

- **每个阶段运行在独立上下文中**（宿主支持子会话/子代理时）：只加载当前阶段 skill 的 SKILL.md + 按需 references + 上一阶段的落盘产物文件；任一时刻活跃指令 ≤ 1–2 个 skill（当前阶段 + 本编排）
- **主会话只持有流水线状态**：阶段清单、各产物文件路径、检查点状态——不加载任何阶段 skill 的领域知识
- **降级路径**：宿主不支持子会话、或用户在单会话内手动走流水线时，退化为**顺序会话 + 落盘文件衔接**——正确性不受影响（状态全在文件里），损失的只是上下文卫生
- **反模式**：单会话内顺序累加加载全部 SKILL.md（9 个 × 数百行指令同时在场）
- **注入式形态的例外**：预注入部署（评测或宿主一次性注入全部指令）下本节隔离机制不存在——此时**靠阶段顺序防串扰**：任一时刻只执行当前阶段的指令，其余在场文件视为未加载；"文件即流水线状态"的原则两形态通用（双形态声明见 `../core/evidence.md` 第 6 节）
```

**依据 2 · 源码核查**：[skills/qa/SKILL.md:31-51](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/skills/qa/SKILL.md#L31-L51)

阶段间产物、用户检查点和记忆边界。

<details>
<summary>查看原文（21行）</summary>

```text
## 流水线与落盘产物（文件即流水线状态）

| # | 阶段 | skill | 落盘产物 | 人工检查点 |
|---|------|-------|---------|-----------|
| 0 | （旁路，可选）探索先行 | `exploratory-testing` | `{项目}/探索笔记_{主题}.md` | — |
| 1 | 需求理解 | `requirement-analysis` | `{项目}/需求模型.md`（含澄清记录） | ⏸ 澄清检查点：模糊/矛盾项等用户裁决 |
| 2 | 测试策略 | `test-strategy` | `{项目}/测试策略.md`（Risk Map + 两域 scope 含 type_scope）+ `专项移交_{轴}_{日期}.yaml`（有 handoff/blocked/外部执行器轴时） | ⏸ 预算裁决：full 预算裁剪触及 Critical 轴时呈现排序提案等用户裁决 |
| 3 | 用例编写 | `test-case-writing` | `{项目}/测试用例_markmap.md` + `测试用例.schema.yaml` | — |
| 4 | 用例审查 | `test-case-review` | 修订后用例文件 + 审查记录（重新抽取 Schema） | — |
| 5 | 执行 | `automated-e2e-testing` / `api-testing` / 手动 | 自动路径：执行代码或脚本（`playwright/` 或 API 测试脚本）+ **执行分报告** `测试报告_{来源}_{日期}.md`（命名见 `../core/report-template.md` 头注；至少 §2 执行统计 + §3 Bug 清单条目，字段按 report-template）；手动路径 `手动执行记录_{日期}.md` | ⏸ 执行策略裁决：确认 automation_plan 提案（手动/e2e/api）；手动路径执行后 ⏸ 结果回收（TC × 结果） |
| 6 | Bug 分析 | `bug-analysis`（有已确认 Bug 时） | 中间产物 `{项目}/Bug条目_{日期}.md`（条目结构与根因分析等五个扩展字段按 report-template §3）——此阶段**禁止新建或改写**最终测试报告 | ⏸ Bug 定性检查点：预期 vs 缺陷 |
| 7 | 回归验证 | `regression-testing`（有代码变更/Bug 修复时） | `{项目}/回归清单_{日期}.md` | — |
| 8 | 收尾报告 | 本 skill（按 `../core/report-template.md`） | `{项目}/测试报告_{日期}.md` | — |

> 旁路触发条件：文档缺失 / 系统陌生时，阶段 0 在阶段 1 之前先行，探索产出（系统理解 + 风险清单）作为需求建模输入。
>
> 手动执行路径无 skill 与自动产物——执行后按 ⏸ 结果回收检查点向用户索取结果，落盘 `手动执行记录_{日期}.md`（TC 编号 × 结果〔通过/失败/阻塞〕，失败附 Bug 编号或现象）：作为阶段 8 报告 §2 执行统计与 §3 Bug 清单的数据来源，防"未执行"列成为永久状态。
>
> 阶段 6 的 `Bug条目_{日期}.md` 是**中转中间产物**：最终报告在阶段 8 才生成，此期间 Bug 条目无处追加——先落中转文件，阶段 8 拼装进报告 §3 后以报告为准，该文件归档留痕，不形成双数据源。阶段 2 生成的 `专项移交_{轴}_{日期}.yaml` 同样进入主会话的状态跟踪：后续任一阶段产出或用户反馈使移交轴状态变化时同步更新 yaml 内 `execution_status`，防移交包生成即失联。
>
> **跨会话知识**：阶段产出命中值得跨会话沉淀的 QA 知识（环境怪癖 / flaky 判定 / 缺陷模式等）时，按 `qa-memory` 判定写入项目 `.qa/` 知识库；会话内状态仍以落盘产物为准，两者不可互替。
```

</details>

**依据 3 · 源码核查**：[skills/qa/SKILL.md:61-70](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/skills/qa/SKILL.md#L61-L70)

明确续跑判据和未决裁决处理。

<details>
<summary>查看原文（10行）</summary>

```text
### 2. 断点检查（续跑）

续跑先读 `{项目}/流水线状态.md`：**未决区存在用户已回填的裁决时，先按裁决增量修订受影响阶段的产物**（更新需求模型假设、在 `budget_review` 补 `approved_by: 用户` 等——不重跑阶段），再按下述判据续跑；未回填的未决项维持保守分支并保持未决标记，不得当作已裁决。然后检查 `{项目}/` 下已有哪些落盘产物，从**最后一个完整阶段之后**继续，不重做已完成阶段。**阶段完成判据**（阶段 3/4 产物同名，凭判据区分，不凭文件存在性猜测）：

- 阶段 1：`需求模型.md` 存在
- 阶段 2：`测试策略.md` 存在且 `../core/scripts/validate_schema.py` V1–V5 通过（type_scope 含 handoff/blocked 轴或外部执行器时，对应 `专项移交_{轴}_{日期}.yaml` 应已生成）
- 阶段 3：用例双轨落盘且 `../core/scripts/validate_schema.py {用例文件}`（用例 Schema 单文件校验）通过
- 阶段 4：用例文件末尾含 **test-case-review 落款**的审查记录节「## 审查记录（test-case-review …）」且 Schema 已重新抽取校验——阶段 3 写时自审的同名「审查记录」节不算数（那是阶段 3 的完成标志，区分两者防续跑时静默跳过独立审查）
- 阶段 5：`测试报告_{来源}_{日期}.md`（自动路径）或 `手动执行记录_{日期}.md`（手动路径）落盘
- 阶段 6：`Bug条目_{日期}.md` 中转文件落盘；无 Bug 则在 `{项目}/流水线状态.md` 追加一行「阶段 6：无已确认 Bug，跳过」（跳过/未决等流水线状态统一记此文件——硬规则 3"状态全在文件"的续跑凭据，缺该行视为阶段未到）
```

</details>

**依据 4 · 源码核查**：[skills/core/evidence.md:16-38](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/skills/core/evidence.md#L16-L38)

代码、运行与用户决策的不同边界。

<details>
<summary>查看原文（23行）</summary>

````text
## 2. 三类裁决规则

证据等级解决"信什么"，裁决规则解决"冲突时听谁的"：

| 问题类型 | 裁决规则 |
|---------|---------|
| **静态问题**（代码是怎么写的） | E2 为王。E1 与 E2 冲突 → 默认以代码为准（测准声明），偏离记入附录并提交澄清 |
| **动态问题**（系统实际怎么表现） | E3 为王。E2 与 E3 冲突（代码与运行不符）→ 这本身就是发现（死代码 / 路径未覆盖 / 环境差异），转澄清或缺陷记录 |
| **意图问题**（应该是什么行为） | **用户在澄清环节的明确答复具有最终裁决力**，可推翻任何证据等级。裁决记入产物（澄清记录），后续 Skill 不得再用代码推翻已裁决项 |

> 注意：E0（用户初始陈述）是低证据，但用户**在澄清环节的裁决**不是证据、是决策——两者必须区分。前者可被代码推翻，后者不可。

## 3. 结论的状态标注

所有 Skill 的输出必须区分：

```text
Fact        事实（有证据支撑的确定结论）
Inference   推断（由证据合理推出，未直接验证）
Risk        风险（可能出问题，尚无证据）
Hypothesis  假设（待验证的猜想）
Verified    已验证（有 E3 及以上证据）
```
````

</details>

**依据 5 · 源码核查**：[skills/core/scripts/validate_schema.py:1-16](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/skills/core/scripts/validate_schema.py#L1-L16)

Schema/lint和用例编号检查范围。

<details>
<summary>查看原文（16行）</summary>

```text
#!/usr/bin/env python3
"""Test Case Schema 校验器（markmap ↔ schema.yaml 一致性）+ 测试策略类型域校验（V1–V5 + 覆盖门禁）.

模式一（用例 Schema，配套 core/schema-extraction.md，抽取 / 修订重抽后运行）：

    python3 validate_schema.py 测试用例_markmap.md 测试用例.schema.yaml

  1. YAML 可解析（转义纪律）——环境装有 PyYAML 时全量解析并检查枚举值；
     未安装时降级为基础 lint（引号配对 / 裸引号），仍能抓住
     "双引号值内裸放引号" 这类最常见的中断下游消费的解析错误
  2. TC 编号一致性——schema 中的 id 必须存在于 markmap（孤儿报错），
     markmap 中的编号缺失于 schema（遗漏告警，增量更新场景可接受但需人工确认）
  3. 占位符——title / steps / expected 等字段值出现 {xxx} / <xxx> / 「某某」即报错
     （用例可执行性红线，见 core/executability.md）
  4. 契约词表与结构——tags 词表外标签告警；module 编号与 TC 编号首段不一致报错；
     用例级 preconditions 与顶层 modules 表共享前置重复仅告警
```

</details>

**依据 6 · 源码核查**：[skills/core/scripts/validate_schema.py:256-273](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/skills/core/scripts/validate_schema.py#L256-L273)

路径不存在为warning、不核行号。

<details>
<summary>查看原文（18行）</summary>

```text
def check_path_refs(items, repo_root, ctx, warnings):
    """抽查 items 中 "文件.ext:行号" 指涉在 repo_root 下真实存在；缺失按告警不按错误。

    行号无法机械核对（代码会漂移），文件存在性是最便宜的反幻觉锚点：
    抓"穿了 V2/V3 合规外衣、指向不存在文件的幻觉证据"这一最高频伪造形态。
    """
    seen = set()
    for item in items:
        m = REPO_FILE_LOC_RE.search(item)
        if not m:
            continue
        rel = m.group(1)
        key = f"{ctx}:{rel}"
        if key in seen:
            continue
        seen.add(key)
        if not (repo_root / rel).is_file():
            warnings.append(f"{ctx}: 指涉文件不存在于 --repo-root 仓库: {rel}（核实是否幻觉证据或路径笔误）")
```

</details>

**依据 7 · 源码核查**：[skills/test-reliability/SKILL.md:69-74](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/skills/test-reliability/SKILL.md#L69-L74)

首次通过/重试/隔离分开且裁决在人。

```text
## 工作流四：重试策略与门禁语义（诚实语义硬规则）

- **重试绿 ≠ 修复**：重试通过只说明"失败是间歇性的"，不构成修复证据；重试救回的用例计入 `retry_passes`，与首次通过（`clean_passes`）分开统计
- **重试配置语义**：本地零重试暴露问题；CI 至多重试 1 次——**禁止靠调大 retries 或调大超时让用例变绿**；把 retries 调高当治理手段 = 把噪声计成信号，一律驳回并给替代方案（隔离 + 排期修根因）
- **发布门禁证据语义**：作为发布证据的套件结果必须声明三项——首次通过率、重试救回数、隔离数；三者任一缺失，门禁证据不合规
- 判定权在人：向用户呈现证据与选项（修 / 隔离 / 上抛），不替用户裁决"可以带病放行"
```

#### 缺口

- 真实宿主是否正确按需加载、严格执行阶段门禁与报告事实未验。
  **影响**：不能把契约齐全当自主QA已跑通。
  **进一步探讨**：观察一轮从需求到真实执行的装载记录、用户裁决与报告来源，抽查失败和未决路径。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安装和长期使用有哪些可见负担与失败边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

安装必须保留所有技能与core同级，相对路径资源缺失会使方法与脚本断链。verify_install检查身份、文件和core引用，明确不验证触发或产出质量；目录存在不说明Agent已读到技能。install先锁、全单元归属预检、暂存新旧目录，再逐个mv替换，并对可捕获失败倒序恢复；多目录切换不是整组原子，SIGKILL/断电不触发trap，需暂停宿主读取并保留事务目录恢复。不能因此承诺任何中断都自动回滚。

首次成本包括宿主工具、Python及可选PyYAML、Playwright/pytest等执行器、被测账号环境与需求澄清。技能安装本身不安装这些依赖。持续会产生多阶段阅读、生成产物、人工确认和模型调用成本；作者也报告全指令注入时成本增加，但本次没有可迁移到实际宿主的金额/耗时测量。简单单步任务宜直接用对应技能，避免整轮流程压过任务价值。

复制安装升级整体替换已归属目录，本地自定义应在仓库分支维护；链接模式更新仓库即改变技能内容但版本标记不自动刷新。卸载只移除识别归属的技能目录，不会替用户撤销被测系统已经发生的动作、自动删除项目测试产物或关闭所有外部执行器。遇到无法取得环境和账号，应交付明确受阻与可执行移交而非编造通过。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:91-107](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/README.md#L91-L107)

安装事务中断边界与文件存在不代表装载。

<details>
<summary>查看原文（17行）</summary>

````text
切换版本：在完整克隆中 `git fetch --tags`，执行 `git switch --detach <已发布-tag-或完整-commit>`，再重跑安装器；回退同理。先保存本地改动，确认该版本的安装脚本与目标目录归属兼容。旧版没有新安装器的恢复能力。

当前安装器先全量预检、暂存，再替换；可处理的复制/替换失败会恢复原内容和版本标记。**多目录切换不是整组原子操作，安装时请暂停宿主读取**。断电或 SIGKILL 无法触发回滚；出现 `.qa-skills.lock` 或 `.qa-skills.txn.*` 时，先检查其中 pid 是否仍运行，保留事务目录并按 [恢复说明](./RELEASING.md#安装失败恢复--installation-recovery)处理，不要直接删除备份。已有本框架目录会整体替换，本地自定义请在仓库分支维护。

### 2. 检查安装与装载

从克隆仓库运行文件级检查（使用宿主的实际目录，skills.sh 安装也适用）：

```bash
python3 scripts/verify_install.py ~/.agents/skills
```

请从与安装版本相同的 tag/commit 运行校验器。该检查验证完整单元、辅助文件与 core 引用，不调用模型，也不能证明宿主已装载或输出质量。

安装目标应包含下方[技能清单](#选择-skill)中的目录及 `core/`，例如 `qa/SKILL.md` 与 `core/executability.md`。**只有仓库 `install.sh` 会额外写入 `qa-skills.VERSION`（版本、commit、安装方式与来源）**，其他方式不能用该文件判断成功与否。

按宿主要求刷新技能或新开会话，试一句“请使用 test-strategy，为这个需求制定测试策略”。从宿主的装载记录确认 `test-strategy/SKILL.md` 及所需 `core/` 文件已读取；没有装载记录时，可要求 Agent 列出实际读取的文件路径。仅目录存在不代表触发已成功。
````

</details>

**依据 2 · 源码核查**：[scripts/verify_install.py:1-6](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/scripts/verify_install.py#L1-L6)

验证器明确只检查文件。

```text
#!/usr/bin/env python3
"""Check installed units and core references without invoking an agent or model.

Usage: python3 scripts/verify_install.py /path/to/host/skills
This verifies files, not triggering or output quality. It also works for skills.sh
installs, which do not create the repository installer's version marker.
```

**依据 3 · 源码核查**：[install.sh:148-183](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/install.sh#L148-L183)

锁、可捕获失败恢复及trap范围。

<details>
<summary>查看原文（36行）</summary>

```text
# A directory lock also serializes uninstall.sh. Never steal a stale lock automatically.
LOCK_DIR="$TARGET/.qa-skills.lock"
if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  echo "❌ Another install/uninstall is running, or an interrupted operation needs recovery: $LOCK_DIR" >&2
  exit 1
fi
TXN="" COMMITTED=false
TOUCHED=()
cleanup() {
  local rc=$? d i recovery_failed=false
  trap - EXIT HUP INT TERM
  if ! $COMMITTED && [ -n "$TXN" ]; then
    # Reverse only operations actually started. Existing entries are moved, never deleted first.
    i=${#TOUCHED[@]}
    while [ "$i" -gt 0 ]; do
      i=$((i - 1)); d="${TOUCHED[$i]}"
      if [ -e "$TXN/old/$d" ] || [ -L "$TXN/old/$d" ]; then
        rm -rf "$TARGET/$d" && mv "$TXN/old/$d" "$TARGET/$d" || recovery_failed=true
      elif [ ! -e "$TXN/new/$d" ] && [ ! -L "$TXN/new/$d" ]; then
        rm -rf "$TARGET/$d" || recovery_failed=true
      fi
    done
  fi
  if $recovery_failed; then
    echo "❌ Recovery failed. Keep the backup and lock; restore manually: $TXN/old" >&2
    exit 1
  fi
  [ -z "$TXN" ] || rm -rf "$TXN"
  rm -f "$LOCK_DIR/pid"
  rmdir "$LOCK_DIR"
  exit "$rc"
}
trap cleanup EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM
```

</details>

**依据 4 · 源码核查**：[install.sh:186-229](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/install.sh#L186-L229)

预检、暂存、版本标记与逐目录替换。

<details>
<summary>查看原文（44行）</summary>

```text
# Preflight every unit before changing any installed content.
for d in "${SKILL_DIRS[@]}"; do
  [ -d "$SRC_ROOT/$d" ] && [ -f "$SRC_ROOT/$d/SKILL.md" ] || {
    echo "❌ Incomplete source unit: $d" >&2; exit 1;
  }
  if { [ -e "$TARGET/$d" ] || [ -L "$TARGET/$d" ]; } && ! owns_unit "$d"; then
    echo "❌ 目标已存在同名 ${d}/，但不是本框架安装的目录，拒绝覆盖。" >&2
    exit 1
  fi
done
if [ -e "$TARGET/qa-skills.VERSION" ] || [ -L "$TARGET/qa-skills.VERSION" ]; then
  [ -f "$TARGET/qa-skills.VERSION" ] && [ ! -L "$TARGET/qa-skills.VERSION" ] || {
    echo "❌ Version marker must be a regular file: $TARGET/qa-skills.VERSION" >&2; exit 1;
  }
fi

TXN="$(mktemp -d "$TARGET/.qa-skills.txn.XXXXXX")"
mkdir "$TXN/new" "$TXN/old"
METHOD="copy"; $LINK && METHOD="link"
echo "安装目标：${TARGET}（方式：${METHOD}）"
for d in "${SKILL_DIRS[@]}"; do
  if $LINK; then
    ln -s "$SRC_ROOT/$d" "$TXN/new/$d"
  else
    cp -R "$SRC_ROOT/$d" "$TXN/new/$d"
    find "$TXN/new/$d" -type d -name '__pycache__' -prune -exec rm -rf {} +
    find "$TXN/new/$d" -type f -name '*.pyc' -delete
  fi
done

# Include provenance in the same rollback boundary as the content.
VERSION="$(git -C "$REPO_ROOT" describe --tags --always --dirty 2>/dev/null || echo unknown)"
COMMIT="$(git -C "$REPO_ROOT" rev-parse HEAD 2>/dev/null || echo unknown)"
{
  printf '%s (installed: %s)\n' "$VERSION" "$(date +%Y-%m-%d)"
  printf 'commit: %s\nmethod: %s\nsource: %s\n' "$COMMIT" "$METHOD" "$REPO_ROOT"
} > "$TXN/new/qa-skills.VERSION"

for d in "${SKILL_DIRS[@]}" qa-skills.VERSION; do
  TOUCHED+=("$d")
  if [ -e "$TARGET/$d" ] || [ -L "$TARGET/$d" ]; then
    mv "$TARGET/$d" "$TXN/old/$d"
  fi
  mv "$TXN/new/$d" "$TARGET/$d"
```

</details>

**依据 5 · 作者声明**：[README.md:109-124](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/README.md#L109-L124)

真实执行工具/环境需另备及人工裁决。

<details>
<summary>查看原文（16行）</summary>

````text
### 3. 提供输入，开始测试

第一次使用可先走 [会议室预约练习](./examples/first-task/README.md)：无需运行环境，包含完整输入、阶段请求和人工验收清单。

在被测项目中对 Agent 说：

```text
帮我测试这个需求：优惠券到期后自动结束。
需求：<替换为你的 PRD 路径>
代码：当前仓库；回归对比基线：main
先完成需求分析和测试策略，列出需要我确认的问题。
```

需求可以是文字、PRD、接口文档或已有用例。提供代码可补充实现证据；只有文档时会保留待确认项。进入执行阶段前，还需要可访问的测试环境、测试账号与运行工具：Web E2E 使用 Playwright，API 测试使用 Python / pytest 等，压测按需使用 k6。**安装 skill 不会同时安装这些工具或被测系统。**

完整流程会在需求澄清、执行策略、Bug 定性与预算裁决处等待你确认。只需要一步时，直接使用下面对应的请求。
````

</details>

**依据 6 · 源码核查**：[uninstall.sh:90-110](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/uninstall.sh#L90-L110)

卸载根据归属删除技能和标记，非被测动作撤销。

<details>
<summary>查看原文（21行）</summary>

```text
echo "将从 $TARGET 卸载："
for d in "${SKILL_DIRS[@]}"; do
  [ -e "$TARGET/$d" ] || [ -L "$TARGET/$d" ] || continue
  # 防误删：确认是我们装的（软链指向本仓库，或目录里有 SKILL.md/为 core）
  if [ -L "$TARGET/$d" ]; then
    [ "$(readlink "$TARGET/$d")" = "$SRC_ROOT/$d" ] || { echo "  跳过 ${d}（软链不指向本仓库）"; continue; }
  elif [ "$d" = "core" ]; then
    # 用本框架特有文件指纹识别，防误删同名无关目录：通用名两件缺一不可，
    # 且需含框架独创命名（test-type-matrix / clarify-pattern）至少其一
    if [ ! -f "$TARGET/$d/evidence.md" ] || [ ! -f "$TARGET/$d/report-template.md" ] \
       || { [ ! -f "$TARGET/$d/test-type-matrix.md" ] && [ ! -f "$TARGET/$d/clarify-pattern.md" ]; }; then
      echo "  跳过 ${d}（非本框架 core 目录）"; continue
    fi
  elif [ -f "$TARGET/$d/SKILL.md" ] && grep -q "^slug: ${d}$" "$TARGET/$d/SKILL.md" 2>/dev/null; then
    : # 本框架 skill（frontmatter slug 指纹与 install.sh 的归属校验一致）
  else
    echo "  跳过 ${d}（非本框架 skill 目录）"; continue
  fi
  rm -rf "$TARGET/$d"; echo "  移除 $d"
done
[ -f "$TARGET/qa-skills.VERSION" ] && rm -f "$TARGET/qa-skills.VERSION"
```

</details>

#### 缺口

- 没有本次实际安装、中断恢复及任务全成本记录。
  **影响**：不能称零依赖、低token或已验证恢复。
  **进一步探讨**：在可丢弃目录检查安装/回退，再用一项真实小任务计入模型、确认、执行和返工成本。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时值得试用，怎样证明比自由测试提示更好？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议已有测试环境和运行工具、需要可追溯策略及执行材料的小团队，从单一需求或单阶段试用，先保留原有测试清单为基线。验收关键不是文档更长，而是重要风险有真实用例、用例可执行、运行/未运行明确、首次通过与重试/隔离分开；有未决意图由人决定，不替用户放行。若只能产出模板、工具无法执行或人工确认开销超过漏测改善，应停止完整流程并退回阶段技能或原测试办法。

由文件即状态与形式校验仍可漏语义的边界，可提出未验证假设：为每项重要风险保留一个从需求证据到用例再到真实执行原件的抽样审计链接，按源材料复核而非只检查文件存在，可能更能发现“报告完整但没有测到”的假通过。与现有risk_ref和path检查相比增加的是运行原件到任务结论的语义核验，需额外人工成本，不能仅扩Schema就宣称完成。

以相同需求、模型、工具和预算比较自由提示、当前Skill与追加审计，盲查漏测、不可执行用例、假通过、人工修正时间和总调用量。若Skill或审计没有降低重要漏测/假通过，或成本增长无法接受，则收窄适用任务或退出。没有在本次运行该对照，也不声称作者预注入评测证明真实宿主等效。

#### 证据与依据

**依据 1 · 源码核查**：[skills/qa/SKILL.md:31-47](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/skills/qa/SKILL.md#L31-L47)

执行分报告、手动回收与人工检查点支撑试用判据。

<details>
<summary>查看原文（17行）</summary>

```text
## 流水线与落盘产物（文件即流水线状态）

| # | 阶段 | skill | 落盘产物 | 人工检查点 |
|---|------|-------|---------|-----------|
| 0 | （旁路，可选）探索先行 | `exploratory-testing` | `{项目}/探索笔记_{主题}.md` | — |
| 1 | 需求理解 | `requirement-analysis` | `{项目}/需求模型.md`（含澄清记录） | ⏸ 澄清检查点：模糊/矛盾项等用户裁决 |
| 2 | 测试策略 | `test-strategy` | `{项目}/测试策略.md`（Risk Map + 两域 scope 含 type_scope）+ `专项移交_{轴}_{日期}.yaml`（有 handoff/blocked/外部执行器轴时） | ⏸ 预算裁决：full 预算裁剪触及 Critical 轴时呈现排序提案等用户裁决 |
| 3 | 用例编写 | `test-case-writing` | `{项目}/测试用例_markmap.md` + `测试用例.schema.yaml` | — |
| 4 | 用例审查 | `test-case-review` | 修订后用例文件 + 审查记录（重新抽取 Schema） | — |
| 5 | 执行 | `automated-e2e-testing` / `api-testing` / 手动 | 自动路径：执行代码或脚本（`playwright/` 或 API 测试脚本）+ **执行分报告** `测试报告_{来源}_{日期}.md`（命名见 `../core/report-template.md` 头注；至少 §2 执行统计 + §3 Bug 清单条目，字段按 report-template）；手动路径 `手动执行记录_{日期}.md` | ⏸ 执行策略裁决：确认 automation_plan 提案（手动/e2e/api）；手动路径执行后 ⏸ 结果回收（TC × 结果） |
| 6 | Bug 分析 | `bug-analysis`（有已确认 Bug 时） | 中间产物 `{项目}/Bug条目_{日期}.md`（条目结构与根因分析等五个扩展字段按 report-template §3）——此阶段**禁止新建或改写**最终测试报告 | ⏸ Bug 定性检查点：预期 vs 缺陷 |
| 7 | 回归验证 | `regression-testing`（有代码变更/Bug 修复时） | `{项目}/回归清单_{日期}.md` | — |
| 8 | 收尾报告 | 本 skill（按 `../core/report-template.md`） | `{项目}/测试报告_{日期}.md` | — |

> 旁路触发条件：文档缺失 / 系统陌生时，阶段 0 在阶段 1 之前先行，探索产出（系统理解 + 风险清单）作为需求建模输入。
>
> 手动执行路径无 skill 与自动产物——执行后按 ⏸ 结果回收检查点向用户索取结果，落盘 `手动执行记录_{日期}.md`（TC 编号 × 结果〔通过/失败/阻塞〕，失败附 Bug 编号或现象）：作为阶段 8 报告 §2 执行统计与 §3 Bug 清单的数据来源，防"未执行"列成为永久状态。
```

</details>

**依据 2 · 源码核查**：[skills/core/scripts/validate_schema.py:256-273](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/skills/core/scripts/validate_schema.py#L256-L273)

文件存在性而非证据语义的检查边界。

<details>
<summary>查看原文（18行）</summary>

```text
def check_path_refs(items, repo_root, ctx, warnings):
    """抽查 items 中 "文件.ext:行号" 指涉在 repo_root 下真实存在；缺失按告警不按错误。

    行号无法机械核对（代码会漂移），文件存在性是最便宜的反幻觉锚点：
    抓"穿了 V2/V3 合规外衣、指向不存在文件的幻觉证据"这一最高频伪造形态。
    """
    seen = set()
    for item in items:
        m = REPO_FILE_LOC_RE.search(item)
        if not m:
            continue
        rel = m.group(1)
        key = f"{ctx}:{rel}"
        if key in seen:
            continue
        seen.add(key)
        if not (repo_root / rel).is_file():
            warnings.append(f"{ctx}: 指涉文件不存在于 --repo-root 仓库: {rel}（核实是否幻觉证据或路径笔误）")
```

</details>

**依据 3 · 源码核查**：[skills/test-reliability/SKILL.md:69-74](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/skills/test-reliability/SKILL.md#L69-L74)

真实通过语义与用户最终裁决。

```text
## 工作流四：重试策略与门禁语义（诚实语义硬规则）

- **重试绿 ≠ 修复**：重试通过只说明"失败是间歇性的"，不构成修复证据；重试救回的用例计入 `retry_passes`，与首次通过（`clean_passes`）分开统计
- **重试配置语义**：本地零重试暴露问题；CI 至多重试 1 次——**禁止靠调大 retries 或调大超时让用例变绿**；把 retries 调高当治理手段 = 把噪声计成信号，一律驳回并给替代方案（隔离 + 排期修根因）
- **发布门禁证据语义**：作为发布证据的套件结果必须声明三项——首次通过率、重试救回数、隔离数；三者任一缺失，门禁证据不合规
- 判定权在人：向用户呈现证据与选项（修 / 隔离 / 上抛），不替用户裁决"可以带病放行"
```

**依据 4 · 作者声明**：[README.md:238-240](https://github.com/fishzjp/qa-skills/blob/34b08d6e4a7a2e72da0f01759b161b46d6776054/README.md#L238-L240)

作者指出预注入与真实宿主不应直接等同。

```text
评测前预注册了通过门槛（防事后挑指标）：同源裁判口径通过 4/7，异构裁判口径通过 5/8（两侧门槛清单不同，其中一项在两个口径下方向相反）。覆盖增益（异构裁判）：用例编写 **+8.7pp**（95% CI [0.5, 15.4]）、全任务 **+13.2pp**（95% CI [2.8, 26.3]）、缺陷检出 **+9.7pp**（95% CI [3.3, 16.4]），均显著；同源口径 +3.8pp（裁判宽容偏差已量化并勘误，见 [CHANGELOG](./CHANGELOG.md)）。早期 +29pp 的单采样增益经多样本复验证实为噪声。

**口径边界**：评测时把 skill 全部指令一次性预注入，真实宿主是按需加载，不能直接据此推断所有宿主与模型的增益。真实宿主抽查（n=1）未观察到衰减，样本不足以证明两种装载方式等效。成对评审（两份产出对比打分）在三种裁判下平局都过多，胜率指标作废（机制问题）。
```

#### 缺口

- 同模型同任务下漏测、返工与全成本改善未知。
  **影响**：源码和方法本身不能担保企业QA收益。
  **进一步探讨**：保留盲审与原始运行材料，比较重要缺陷、假通过和总工时/调用量，不能只比分数或篇幅。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
