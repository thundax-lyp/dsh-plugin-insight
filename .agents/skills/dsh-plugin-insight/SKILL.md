---
name: dsh-plugin-insight
description: 显式调用时研究一个固定版本的 DSH 插件，分析场景、替代办法、依赖、流程、总成本与采用价值，交付证据、详细分析和观察批次。可由用户独立调用，或由已显式启动的列表编排 Skill 调用。
---

# 单插件洞察

仅处理一个稳定组件及其固定版本，不隐式扩展为整轮清单扫描。
使用[数据契约](../_shared/references/DATA-CONTRACT.md)、[研究规范](references/RESEARCH-STANDARD.md)
及[输出标准](../dsh-plugin-init/references/OUTPUT-STANDARD.md)。依赖整个工程及当前可用的 GitHub Skill 或插件，不假设特定外部 Skill 名称。
命令从工程根执行，Node 遵循 `.node-version`；Git 协作按根 AGENTS。

专用工具为 [代码统计脚本](scripts/plugin-inventory.mjs)与 [META 采集脚本](scripts/capture-plugin-meta.mjs)，
共同复用 [共享脚本和 Schema](../_shared)。从工程根用 package.json 中的命令运行。

1. **确定输入边界。** 获取稳定组件 ID、仓库／组件路径、固定版本、检查时间、目标研究深度、来源材料和输出位置。
   编排调用还提供会话截止时间与旧详情。独立调用缺少身份或版本时先核对 GitHub 来源，确定后再分析；不得编造 ID。
2. **完整重新分析。** 明确谁在什么频率的场景完成什么任务，原有办法和合格交付物是什么。
   核查安装／效果依赖、用户／后台／异常流程、首次／持续／迁移成本及效果条件。
   成本包括失败、重试和人工复核，现金与人工时间分列。源码与测试支撑判断，只有实际运行才记录执行证据。
   按研究规范先执行 `npm run inventory:plugin -- --root <readonly-checkout> --ref <commit> --component <path> --out data/snapshots/<run_id>/<component>-inventory.json`。
   根组件省略 component；只有抽读快照时用 --snapshot 替代 root/ref 并明确子集，不把抽读行数写成完整 LOC。
   行数复用 Node CLI sloc，Markdown行／字与各 JS／TS 扩展名分开；检查生产／测试／示例及生成／第三方排除。
   核查 Skill入口、Agent/Preset、工具／命令、后台／UI候选及未解析点；补查配置、依赖、持久化与副作用。
   不把字面量候选、提示角色或运行实例当作已确认定义数量。详情补充有源码依据的代码评价与可借鉴处、成立条件和复用代价。
3. **形成关键质疑。** 核对收益归因、负担去向、承诺范围及复杂性必要性；给出反例、适用条件、决策影响和最小验证。
   对比历史时区分插件变化与判断变化，版本未变也重新分析；旧证据仅在版本、环境和适用范围匹配时复用。
4. **保存单项交付。** 原始材料写入 `data/snapshots/<run_id>/`，完整洞察写入 `data/reports/<run_id>.md`，
   观察批次写入 `data/observations/<run_id>.json`，使用新批次 ID；批次只含本组件成功观察及其错误。
   详情须包含唯一一组“用途／亮点／关键质疑／建议”四标签，展开场景、依赖、流程、成本和验证边界。
   显式提交本轮复核的 findings 与时间，不以空数组直接继承旧点评。可参考合成示例，但不能导入为真实数据。
5. **核对并返回。** 执行观察批次结构校验，人工检查证据引用、身份、版本、可比条件及语义。
   返回稳定 ID、版本、实际完成深度、证据／详情／观察批次路径、未验证项及错误；受阻时返回已保存材料和具体下一步。
   不自行 plan／apply、不改会话状态、不生成全轮分类或推荐页、不改 README；这些由列表编排负责。
   用户单独唤起时，交付文件后停止，不因存在会话而自动入档或宣称队列完成。

本 Skill 仅接受用户显式调用或已显式启动的编排 Skill 的明确流程调用，不从普通讨论中自动触发。
它不自动安装插件、启动付费实验、提交或发布。
