# 插件研究工程约定

本仓库维护两个 Skill 及其共享资源。首次建档阅读 `skills/dsh-plugin-init/SKILL.md`，
已有基线更新阅读 `skills/dsh-plugin-update/SKILL.md`。
共同规则统一放在 `docs/00-governance/`：

- `data-contract.md`：身份、字段、版本、证据及增量规则。
- `research-standard.md`：分类、研究维度与证据边界。
- `output-standard.md`：文件命名与位置、报告结构、模式统计及交付验收。
- `git-operations.md`：GD／GitHub 操作指令。

执行任一研究 Skill 前阅读这些共享规范。共同要求只在治理文档维护；
Skill 只保留触发条件、步骤及特有约束。新增 Skill 同样遵循输出标准。
修改数据或工具时同步相关治理规范；结构约束由 `schemas/` 和 `scripts/` 执行。
`examples/observations.json` 是合成示例，不得导入为真实研究。保留无关 IDE 文件。

Git 操作交给可用 GD 指令，GitHub 来源读取与 PR 操作可使用 GitHub 插件。
以当前环境实际能力为准，不猜测 GD 调用语法；按共享操作指令完成工作流。
受保护 main 的变更通过分支和 PR 提交。

提交前运行 `python3 scripts/plugin_data.py validate` 和
`python3 -m unittest discover -s tests -v`。
保留 CI 的 `Repository checks` 名称，main 分支保护依赖该检查。
