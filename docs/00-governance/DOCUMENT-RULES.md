# 文档规则

## 目的与适用范围

本规则定义 `dsh-plugin-insight` 的文档分类、命名、真相源、读取、写作及同步方式。
沿用 Convivium 文档治理中可复用的原则，并按本工程的研究数据与 Skill 边界适配；
Convivium 的会议设计、运行时角色和专用工程门禁不构成本工程规则。

## 约束与读取顺序

根 `AGENTS.md` 是唯一仓库任务路由入口，只保存长期协作要求、必读依据和带链接的关键提醒。
完整规则由对应文档维护，Skill 负责应用规则，不另建规则真相源。
已有且未变化的文档可复用上下文，只加载当前任务涉及的规则和直接依赖。

当前文档按约束对象和执行职责维护：

| 目录 | 职责 |
|---|---|
| `docs/00-governance/` | 约束整个工程的文档、提交、PR 与协作规则 |
| `.agents/skills/_shared/references/` | 两个 Skill 共用的数据契约 |
| `.agents/skills/dsh-plugin-insight/references/` | 单插件研究方法、分类、证据边界与分析维度 |
| `.agents/skills/dsh-plugin-init/references/` | 研究产物、README、汇总推荐及交付标准 |

约束整个工程协作的规则归 docs；指导研究执行的参考资料归对应 Skill。
每份文档只维护一个真相源，其他入口按需引用，不复制。两个 Skill 共用的数据契约放入 _shared。
未确认材料须标记状态，确认后迁入对应真相源；不能从设计推断已经实现，
也不能用单次命令成功证明业务就绪。

发现冲突时按职责、适用范围和已经确认的依据消解，不能用更新时间或当前代码自动覆盖正式规则。
可依据现有授权与明确依据消解的冲突直接修正；确需用户决策的未决项先记录具体分歧。
不因套用文档结构而给已有授权的正常工作增加确认步骤。

## 当前真相源

| 真相源 | 唯一维护的内容 |
|---|---|
| [DOCUMENT-RULES.md](DOCUMENT-RULES.md) | 文档职责、命名、读取、生命周期及同步规则 |
| [DATA-CONTRACT.md](../../.agents/skills/_shared/references/DATA-CONTRACT.md) | 研究身份、字段语义、版本证据、关联依赖及增量不变量 |
| [RESEARCH-STANDARD.md](../../.agents/skills/dsh-plugin-insight/references/RESEARCH-STANDARD.md) | 分类含义、研究维度、证据边界及判断方法 |
| [OUTPUT-STANDARD.md](../../.agents/skills/dsh-plugin-init/references/OUTPUT-STANDARD.md) | 研究文件位置、命名、报告结构、统计及交付验收 |
| [COMMIT-RULES.md](COMMIT-RULES.md) | 提交授权、范围、消息格式、验证及历史安全 |
| [PR-RULES.md](PR-RULES.md) | 分支、PR、评审、CI 与合并边界 |

机器结构约束以 `.agents/skills/_shared/schemas/` 内的 JSON Schema 为准，数据契约解释字段和不变量；
各 Skill 的 `scripts/` 与 `_shared/scripts/` 实现校验和增量行为。修改任何一方时检查其余相关部分，发现不一致须修正。
Schema 统一放在 `.agents/skills/_shared/schemas/`，由设计文档与两个 Skill 引用，不复制第二份。
数据契约在共享 references 维护，研究规范归洞察 Skill，输出标准归列表编排 Skill；相互引用保持单一真相源。

## 工程文档与研究产物

`docs/00-governance/` 保存工程治理规则；Skill 的 `references/` 保存研究执行规范、数据契约与必要的操作说明。
`data/` 保存作为工程交付内容的插件研究档案、观察批次、证据和运行报告。
研究产物与工程治理、研究设计文档分别维护，不因其具有“调研”性质另行迁移，也不能自行改变规则。
其文件位置与报告结构统一由 OUTPUT-STANDARD 定义；研究输入示例放在列表编排 Skill 的 `assets/`，不维护合成观察测试数据。

治理文档不保存一次采集的结果、阶段进度、临时计划或任务完成历史。
根 `AGENTS.md` 不维护 Current State、依赖版本清单或测试结果；普通交付不要求改写它。
根 `README.md` 是脚本生成的研究成果导航，按 OUTPUT-STANDARD 从发布输入生成摘要、出处和子页面链接，版式来自 .agents/skills/dsh-plugin-init/assets/templates/publication/*.md，不手写工程使用说明；
它与 AGENTS 的任务路由职责不同，不替代需求、规则、档案或报告。

## 命名与语言

- `docs/` 与 Skill 的 `references/` 下文档使用大写英文单词及连字符，正文使用中文；类型、字段、协议、命令和工具名保留原文。
- 固定入口保留 `README.md`、`AGENTS.md`；Skill 入口保留 `SKILL.md`。
- 新增专项需求、接口、实现设计可使用 `*-REQUIREMENTS.md`、`*-INTERFACE.md`、`*-DESIGN.md`；
  当前数据契约、研究规范与输出设计保留 `DATA-CONTRACT.md`、`RESEARCH-STANDARD.md`、`OUTPUT-STANDARD.md`，目录归属按职责判断。
- 工程验证使用 `*-EVIDENCE.md` 或 `*-IMPLEMENTATION-COVERAGE.md`，操作说明使用 `HOW-TO-*.md`。
- 未确认和历史材料在文件名或开头明确标记 DRAFT、RESEARCH、ARCHIVE 等状态，说明能否作为实现依据。
- `data/` 的运行产物遵循 OUTPUT-STANDARD，Schema、代码遵循各自工具约定，不套用工程文档命名。
- 明确区分事实、确认规则、候选方案、推断与未验证项；同一规则只保留一个当前真相源。

## 文档内容要求

以下是必须覆盖的语义，不要求机械设置同名章节，不为无关内容填充空模板：

- 需求：目的、范围、非目标、行为规则、验收标准及相关依据。
- 契约：边界与所有权、调用方式、数据与状态、错误与权限、兼容策略及相关依据。
- 设计：关联需求和契约、职责依赖、状态与失败处理、安全与观测、验收方式。
- 工程验证：日期、范围、验证对象及版本／环境、实际执行、结果、未覆盖项和收口边界。
- 操作：前置条件、步骤或脚本入口、成功判据、失败处理及恢复方式。

研究报告的必填内容只由 OUTPUT-STANDARD 定义，不在此重复。
引用现有脚本作为执行入口，不在操作文档中复制会独立漂移的实现。

## 生命周期与同步

讨论或未确认方案明确标记状态；确认后将长期结论迁入对应治理或设计真相源。
工程验证与稳定操作按实际需要确定文档归属。迁移后删除重复当前口径或明确归档。
只创建当前工作需要的文档，不提前铺设空目录、空规则或执行手册。

变更收口时按影响检查：

- 研究方法、数据语义、输出要求：对应 Skill 的 references 真相源，以及研究 Skill 的相关步骤。
- 外部 Skill／插件依赖：相关 Skill 入口。
- 提交规则：COMMIT-RULES；PR 规则：PR-RULES 及 PR 模板；读取路由变化时同步根 `AGENTS.md`。
- 数据字段、枚举、不变量：数据契约、Schema、脚本、示例及相关数据校验。
- 产品行为、边界契约、实现方案：相关需求、接口或设计，存在时按职责同步。
- 验证或运行方式：相关验证材料或操作入口，不将新结果写入治理文档。
- 读取路由、入口约束、文档迁移：根 `AGENTS.md`、README 及所有实际引用。

仅落实既有规则的实现补齐，不顺手改写无关治理文档。
本地 Markdown 文件链接须检查目标存在；锚点、远程 URL、HTML 和扩展语法在文档审阅中核对。
研究导航生成器已核对输入引用的页面存在及输出一致性，并接入 CI；它不等于通用 Markdown 链接检查器。
其他本地链接和锚点继续人工核对，不得把有限自动检查描述成全部文档的持续保证。

## Skill 边界

项目 Skill 统一放在仓库根 `.agents/skills/`，供当前工程直接使用；根 `AGENTS.md` 提供任务读取路由。
每个 Skill 使用独立目录及 `SKILL.md` 入口，不在旧 `skills/` 目录保留重复副本。
Skill 保存触发条件、重复执行步骤及特有约束，共同规则通过链接引用。
个人跨仓库 Skill 不作为本工程交付；Skill 不充当唯一产品需求或数据契约。
修改入口及共享资源路径时检查研究 Skill 的相对引用，避免单独复制后依赖失效。

专用脚本放在对应 Skill 的 `scripts/`，发布模板与输入示例放在其 `assets/`。
两个 Skill 复用的脚本与 Schema 统一放在 `.agents/skills/_shared/`；该目录是共享资源，不注册第三个 Skill。
工程根目录不保留 `scripts/`、`templates/`、`schemas/` 或 `examples/` 的重复入口。
本项目不维护 testcase 或合成测试档案；CI 保留真实研究数据结构、检查点摘要与生成结果一致性校验。
根 `package.json` 继续集中声明依赖与命令，根 `data/` 保存研究结果，`docs/` 保存工程治理规则，Skill 的 `references/` 保存研究执行依据。
