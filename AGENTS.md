# 插件研究工程约定

本仓库维护 DSH 插件研究数据、两个 Skill 及其共享工具。
文档职责、命名、真相源及同步要求以
[文档规则](docs/00-governance/DOCUMENT-RULES.md)为准。根入口只维护任务路由和关键协作提醒。
已读取且未变化的依据可复用上下文，只加载当前任务涉及的规则及直接依赖。

## 任务路由

| 任务 | 必读依据 |
|---|---|
| 编写、迁移或整理工程文档 | [文档规则](docs/00-governance/DOCUMENT-RULES.md)及所修改文档的直接依据 |
| 首次研究建档 | [初始化 Skill](.agents/skills/dsh-plugin-init/SKILL.md)及其引用的共享规范 |
| 已有基线刷新 | [更新 Skill](.agents/skills/dsh-plugin-update/SKILL.md)及其引用的共享规范 |
| 数据字段、身份、证据、增量逻辑或 Schema 修改 | [数据契约](docs/00-governance/DATA-CONTRACT.md)及相关 Schema、脚本 |
| 分类或研究方法调整 | [研究规范](docs/00-governance/RESEARCH-STANDARD.md) |
| 研究产物或交付验收 | [输出标准](docs/00-governance/OUTPUT-STANDARD.md) |
| Git、GitHub 来源采集或 PR 操作 | [Git 操作指令](docs/00-governance/GIT-OPERATIONS.md) |

共同要求只在治理真相源维护，Skill 负责应用；新增 Skill 同样遵循共享输出标准。
修改数据或工具时按文档规则同步相关依据，不因普通任务完成更新根入口。

## 协作与验证

- 保留无关文件与用户已有修改，合成示例不得导入为真实研究。
- Git 操作交给可用 GD 指令，GitHub 来源与 PR 操作可使用 GitHub 插件；不猜测 GD 调用语法。
- 受保护 main 的变更通过分支和 PR 提交，合并沿用用户授权范围。
- 共享脚本使用 `.mjs`，依赖与命令由根 `package.json` 维护，Node 版本遵循 `.node-version`。
- 提交前运行 `npm run check`，覆盖档案、观察批次及行为测试。
- 保留 CI 的 `Repository checks` 名称，main 分支保护依赖该检查；明确区分本地结果和远端 CI。
