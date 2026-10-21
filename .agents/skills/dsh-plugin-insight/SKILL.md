---
name: dsh-plugin-insight
description: 显式调用时研究一个固定版本的 DSH 插件，识别技术或业务核心贡献、检验关键质疑并推导新创新假设，交付证据、详细分析和观察批次。可由用户独立调用，或由已显式启动的列表编排 Skill 调用。
---

# 单插件洞察

由子 Agent 执行，仅处理父 Agent 分配的稳定组件及其固定版本，不隐式扩展为整轮清单扫描。
用户独立调用本 Skill 时，由当前父 Agent 完成输入确认并分派子 Agent 执行洞察，接收并核对交付后返回；不因此启动整轮研究。
使用[数据契约](../_shared/references/DATA-CONTRACT.md)、[研究规范](references/RESEARCH-STANDARD.md)
及[输出标准](../dsh-plugin-init/references/OUTPUT-STANDARD.md)。依赖整个工程及当前可用的 GitHub Skill 或插件，不假设特定外部 Skill 名称。
命令从工程根执行，Node 遵循 `.node-version`；Git 协作按根 AGENTS。

专用工具为 [代码统计脚本](scripts/plugin-inventory.mjs)、[材料准备脚本](scripts/prepare-plugin-materials.mjs)与 [META 采集脚本](scripts/capture-plugin-meta.mjs)，
共同复用 [共享脚本和 Schema](../_shared)。从工程根用 package.json 中的命令运行。

1. **确定输入边界。** 获取稳定组件 ID、注册表中的 plugin-slug、轮次目录、仓库／组件路径、固定版本、检查时间、目标研究深度、来源材料和输出位置。
   父 Agent 分派本 Skill 给子 Agent 执行，多个子 Agent 可并行分析不同插件；职责与共享写入边界遵循[列表编排 Skill 的多 Agent 协作](../dsh-plugin-init/SKILL.md#多-agent-协作)。只处理父 Agent 分配的组件和独占本轮输出，父 Agent 统一验收与暂存，不自行改动共享 WORK／SESSION 或扩展委派。
   编排调用提供会话截止时间及当前快照中的分析、证据和基线摘要，不要求历史会话或 runs 归档。独立调用缺少身份或版本时先核对 GitHub 来源，确定后再分析；不得编造 ID。
2. **识别并核查贡献。** 按研究规范的核心主线，区分作者主张和研究者识别的贡献，核对已有参照、上游归属与具体增量；明确谁在什么场景完成什么任务、原有办法和合格交付物。
   围绕核心贡献核查安装／效果依赖、用户／后台／异常流程、首次／持续／迁移成本及效果条件，深度按主张相关性选择。
   成本包括失败、重试和人工复核，现金与人工时间分列。源码与测试支撑判断，只有实际运行才记录执行证据。
   按研究规范先执行 `npm run inventory:plugin -- --root <readonly-checkout> --ref <commit> --component <path> --out data/runs/<round>/snapshots/<plugin-slug>/INVENTORY.json`；`data/runs/` 是本地运行目录，不进入 Git。
   根组件省略 component；只有抽读快照时用 --snapshot 替代 root/ref 并明确子集，不把抽读行数写成完整 LOC。
   行数复用 Node CLI sloc，Markdown行／字与各 JS／TS 扩展名分开；检查生产／测试／示例及生成／第三方排除。
   核查 Skill入口、Agent/Preset、工具／命令、后台／UI候选及未解析点；补查配置、依赖、持久化与副作用。
   不把字面量候选、提示角色或运行实例当作已确认定义数量。详情补充有源码依据的代码评价与可借鉴处、成立条件和复用代价。
   inventory 后可使用材料准备器固定身份、checkout、作者材料、目录条目、统计摘要和待人工核查的源码候选：
   ```sh
   npm run prepare:plugin -- \
     --session data/runs/<round>/SESSION.json --plugin <plugin_id> \
     --checkout <readonly-checkout> \
     --inventory data/runs/<round>/snapshots/<plugin-slug>/INVENTORY.json \
     --out data/runs/<round>/snapshots/<plugin-slug>/MATERIALS.json
   ```
   有本地目录条目原件时可重复传入 `--directory-entry <file>`。该脚本只生成机械材料索引，不创建 observation、finding、研究深度或报告；
   checkout 必须位于固定提交且无改动，身份／版本／组件与 inventory 不一致时停止。
3. **质疑与创新推演。** 检验最影响贡献成立的关键假设，核对归因、反例与其他解释；通过已有方案比较、机制推广／组合／替换或业务流程重组，尝试提出有推导依据的新创新假设及最小验证。状态和论证按研究规范、输出标准处理，不强凑创新，不以采用风险清单代替贡献分析。
   编排只将所选的新项和待更新项传入本 Skill，确认未变的已有项不调用；独立调用或因依赖等变化入选时，即使代码版本未变也完整分析。内部核对当前快照的结论是否仍适用；当前证据仅在版本、环境和适用范围匹配时复用。INSIGHT 按输出标准只展示当前状态，不开展版本差异研究或回顾旧稿。
   按本 Skill 的[百分制创新评分标准](references/RESEARCH-STANDARD.md#创新评分标准innovation-v1)分别评技术与业务创新；逐项说明参照、增量及限制，不将新假设计入插件贡献。评分写入观察批次的innovation_scores，数值与理由仅存JSON，不写入INSIGHT；未知项按数据契约处理，不自动评分。
4. **保存单项交付。** 原始材料写入本地 `data/runs/<round>/snapshots/<plugin-slug>/`，本轮完整洞察写入本地 `data/runs/<round>/insights/<plugin-slug>.md`，
   观察批次写入 `data/runs/<round>/observations/<plugin-slug>.json`，使用新批次 ID；批次只含本组件成功观察及其错误。
   详情须包含唯一一组“用途／亮点／思考／建议”四标签，正文以贡献、关键质疑、新创新假设与最小验证为主线，相关场景、依赖、流程、成本用于支撑论证，保留验证边界。
   **按阅读目的组织正文。** 名称与功能摘要后给使用建议及实际核查状态；源码核查不能写成运行验证，不为补齐版式安排真实宿主验证。先回答适用场景、替代办法、能力、流程、依赖与兼容，再解释效果、成本和主要限制，随后放工程亮点与源码依据，最后放核查说明、分析版本与辅助统计。提交链接显示短 SHA，完整链接目标与版本绑定保留；不展示历史对照和“最后更新”徽章。
   短篇优先合并成“使用建议／能力与限制／工程分析／核查说明”四部分，不将一两句话拆成十多个章节；短评给结论，正文只补原因、实例和证据。长篇提供页内目录，先完整组织“当前插件分析”，再独立展开“未来设计假设（未验证）”，不要把推演混入已实现能力；已有贡献、待验证假设与探索性设想的状态必须保留。工程统计放文末或折叠区，不打断使用判断。
   显式提交本轮复核的 findings 与时间，不以空数组直接继承旧点评。可参考合成示例，但不能导入为真实数据。
   不使用整轮生成器从静态候选或通用段落批量产生上述语义；若使用装配工具，输入必须是本项已完成且人工核对过的结构化分析，缺字段时失败而不是从旧结论猜测。
   `npm run assemble:insight -- --work <WORK.json> --plugin <id> --analysis <ANALYSIS.json>` 只装配本项人工分析；必填字段由脚本校验，源码路径必须实际存在。
   ANALYSIS 包含 name、summary、scenario、mechanism、conclusion_status、contribution、critical_question、innovation_hypothesis、conclusion_findings、innovation_scores、scope、distribution、cost、adoption、value、engineering、dependencies、workflow、baseline、verification、source_paths、capabilities、technical_category、business_category；可选 trial_summary 必须由人工明确给出。conclusion_status 单独说明贡献与假设的结论状态；研究范围展示、版本日期口径和创新推演的重点呈现遵循输出标准。contribution、critical_question、innovation_hypothesis 分别承载输出标准要求的贡献论证、关键质疑和假设推演（无贡献判断／无新假设时写明原因）；三者必须由人工完成论证，装配器同时将原文写入报告及同名 findings，绑定本次源码证据、当前 code 指纹、复核时间和 current 状态；conclusion_findings 必须显式包含 contribution、critical_question、innovation_hypothesis 三个对象，各仅有人工选择的 topic 与 basis（使用档案 Schema 现有枚举），不重复正文；innovation_hypothesis 的 basis 必须为 unverified，引用推导材料不表示假设已经验证。装配器不从静态候选推断这些内容；额外证据、跨插件依赖及其他判断性质仍须人工逐条补充并校验。innovation_scores为technical／business对象，各含criteria、rationale、basis；分项键和上限遵循评分标准，人工给定分项，脚本只计算轴总分并绑定版本、时间及源码证据，评分不装配进Markdown。distribution保留为JSON分析材料，不装配为独立章节；按输出标准将影响贡献或建议的事实人工归入对应论证、建议或依赖条件。脚本不生成研究或采用判断、不自动暂存完成状态，已有交付拒绝覆盖。
5. **核对并返回。** 执行观察批次结构校验，人工检查证据引用、身份、版本、可比条件及贡献—质疑—假设的推导语义，验收要求以输出标准为准。
   同时检查读者是否能先看到建议与核查状态、长短篇展开是否合适、目录与章节是否一致，确认合并章节没有丢失证据、条件或假设状态。只做展示重生成时由列表编排 Skill 读取当前原稿并生成，不修改正式原稿或检查点摘要。
   返回人工确认的正向能力清单（带固定版本，未发现／未确认项不填0），以及基于项目自身 README／包描述的功能摘要（最多80字符，含来源URL与版本，不掺评价），以及稳定 ID、版本、实际完成深度、证据／详情／观察批次路径、未验证项及错误；受阻时返回已保存材料、稳定原因代码、可读原因、自包含问题详情和具体下一步，由父Agent登记正式受阻状态；不自行重试已被编排器跳过的项。
   返回的是本轮暂存记录，不代表已经覆盖正式快照。编排先校验所有可合并记录，最后合并到唯一当前快照；未通过的项不替换有效记录。
   不自行 plan／apply、不改会话状态、不生成全轮分类或推荐页、不改 README；这些由列表编排负责。
   支撑当前结论的分析与必要证据由编排在合并时落入正式位置；确认无当前引用后，本轮过程材料可清理，无需永久保留每轮副本。
   用户单独唤起时，子 Agent 向父 Agent 返回交付文件，父 Agent 核对后回复用户；不因存在会话而自动入档或宣称队列完成。

本 Skill 仅接受用户显式调用或已显式启动的编排 Skill 的明确流程调用，不从普通讨论中自动触发。
它不自动安装插件、启动付费实验、提交或发布。
