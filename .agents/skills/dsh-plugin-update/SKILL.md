---
name: dsh-plugin-update
description: 检查已有 DSH 插件研究档案的目录、源码、发布、兼容性和维护变化，按证据增量更新数据，并标记需要复核的关联结论。适用于基线建立后的刷新及新增条目。
---

# 检查并增量更新 DSH 插件研究数据

本 Skill 在 `dsh-plugin-insight` 工程根目录运行，依赖工程内的共享资源。
开始前阅读[数据契约](../../../docs/00-governance/DATA-CONTRACT.md)、
[研究规范](../../../docs/00-governance/RESEARCH-STANDARD.md)、
[输出标准](../../../docs/00-governance/OUTPUT-STANDARD.md)和[Git 操作指令](../../../docs/00-governance/GIT-OPERATIONS.md)。
Git 与 GitHub 操作交给已安装的 GD 指令或 GitHub 插件，不在本 Skill 内另建提交流程。

1. **检查现有基线。** 查看档案、历次检查记录和当前工作区，运行：
   ```sh
   python3 scripts/plugin_data.py validate
   ```
   空档案应使用初始化 Skill。保留人工研究与无关修改；受保护分支的变更按共享 Git 指令处理。
2. **检查来源和目标仓库。** 使用新的 `run_id` 与截止时间，遵守用户指定的检查范围。
   同时关注目录新增／移除，以及目标插件的源码、发布、兼容性和维护变化。
   优先通过 GitHub 插件获取固定提交、文件、版本和差异；本机有已认证的 `gh` 时也可
   使用 `scripts/capture_github.py`。保存新证据并与旧快照比较。
   目录仓库提交变化不代表所有插件都变化，应比较具体条目。记录分页限制、截断、
   权限和采集失败；不能从不完整结果中的缺席推断删除。
3. **匹配身份与来源状态。** 使用稳定仓库／组件 ID 处理改名和路径移动。
   已有基线中的新发现也使用更新模式。保留消失条目；成功完成相关来源比较后才能标记
   `removed_from_source`。归档状态与目录收录状态分别记录，避免混为一谈。
4. **分析并记录增量。** 检查差异的代码面积、功能面积和风险面积。
   只更新成功核查的事实与指纹，未检查的指纹字段省略。点评未变时提交 `findings: []`，
   脚本会保留旧结论。新增证据和来源快照使用新 ID，不覆盖历史。
   失败目标写入 `errors`，不要用失败结果替换插件档案；允许只有错误记录的批次。
5. **复核受影响结论。** 包括本插件点评、其他插件中的比较以及生态缺口判断。
   依赖已变化的结论标记为 `needs_review`；只有完成相应核查后才能更新依赖、证据和
   `reviewed_at`。旧版本测试不能证明新发布版本通过。缺少验证环境时保留待复核状态并说明边界。
6. **生成并应用更新计划。** 按共享输出标准保存本次产物和更新报告，然后运行：
   ```sh
   python3 scripts/plugin_data.py plan --mode update --observations data/observations/<run_id>.json --out /tmp/dsh-update-plan.json
   ```
   检查计划和候选档案，尤其是其他条目中被标记失效的关联结论。
   增量符合证据及用户授权范围后应用并校验：
   ```sh
   python3 scripts/plugin_data.py apply --plan /tmp/dsh-update-plan.json
   python3 scripts/plugin_data.py validate
   python3 -m unittest discover -s tests -v
   ```
   基础档案在计划后发生变化时，基于最新档案重新生成；不要强制覆盖或复用已应用的运行 ID。
   再次检查使用新 ID，内容未变时保留原点评。

按共享输出标准完成更新统计、报告和交付验收，按共享 Git 指令处理版本管理。
不为统一措辞重写全部研究；更新本地研究不自动安排未来检查、发布结果或合并 PR。
