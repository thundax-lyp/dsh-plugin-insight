# 插件研究工程约定

本仓库维护 DSH 插件研究数据、两个显式调用的研究 Skill 及其共享工具。
文档职责、命名、真相源及同步要求以
[文档规则](docs/00-governance/DOCUMENT-RULES.md)为准。根入口只维护任务路由和关键协作提醒。
已读取且未变化的依据可复用上下文，只加载当前任务涉及的规则及直接依赖。

## 任务路由

| 任务 | 必读依据 |
|---|---|
| 编写、迁移或整理工程文档 | [文档规则](docs/00-governance/DOCUMENT-RULES.md)及所修改文档的直接依据 |
| 首轮／后续整轮列表研究及断点恢复 | [列表编排 Skill](.agents/skills/dsh-plugin-init/SKILL.md)及其引用的共享规范 |
| 单插件研究 | [洞察 Skill](.agents/skills/dsh-plugin-insight/SKILL.md)及其引用的共享规范 |
| 数据字段、身份、证据、增量逻辑或 Schema 修改 | [数据契约](.agents/skills/_shared/references/DATA-CONTRACT.md)及相关 Schema、脚本 |
| 分类或研究方法调整 | [研究规范](.agents/skills/dsh-plugin-insight/references/RESEARCH-STANDARD.md) |
| 研究产物、README 输出入口或交付验收 | [输出标准](.agents/skills/dsh-plugin-init/references/OUTPUT-STANDARD.md) |
| 暂存、提交、提交消息或历史修改 | [提交规则](docs/00-governance/COMMIT-RULES.md) |
| 分支、PR、评审、CI 或合并 | [PR 规则](docs/00-governance/PR-RULES.md) |

工程治理规则在 `docs/00-governance/` 维护；数据契约在 `.agents/skills/_shared/references/` 维护，研究方法与输出规范分别由洞察和列表编排 Skill 的 `references/` 维护。
README 是生成的研究成果入口；工程执行从本文件路由，生成输入和命令见输出标准。
共同要求只在对应真相源维护，Skill 负责应用；新增 Skill 同样遵循共享输出标准。
修改数据或工具时按文档规则同步相关依据，不因普通任务完成更新根入口。

## 协作与验证

- 保留无关文件与用户已有修改，合成示例不得导入为真实研究。
- 提交授权与范围遵循 COMMIT-RULES；修改完成默认留在工作区，不自动提交。
- main 交付和合并遵循 PR-RULES，不绕过保护；提交、推送、PR、合并授权分别判断。
- Skill 专用脚本与资源随 Skill 存放，共享资源位置遵循 DOCUMENT-RULES；本项目不维护 testcase。
- 共享脚本使用 `.mjs`，依赖与命令由根 `package.json` 维护，Node 版本遵循 `.node-version`。
- 提交前运行 `npm run check`，覆盖档案、观察批次及检查点和生成一致性。
- 保留 CI 的 `Repository checks` 名称，main 分支保护依赖该检查；明确区分本地结果和远端 CI。
