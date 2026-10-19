# dsh-plugin-insight

DSH 插件目录、分类、证据与增量研究。本 README 是研究输出的统一入口。

## 研究出处

插件发现和目录研究以以下两个 GitHub 仓库为起点：

- [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
- [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness)

具体研究会记录实际读取的文件、固定提交及采集时间，并继续追溯到目标插件的源码、发布和验证证据。
目录收录不等于插件当前可用，也不代表这些来源认可本项目的点评。

## 研究结果入口

最新为 **2026-10-19 的 3 插件源码级冒烟**，完成 3／3；不是全量目录或实测收益排名。

- [本周什么值得试](data/reports/20261019T074011Z-smoke-recommendations.md)：项目记忆优先试、发票整理条件试、TaskSwarm 继续观察；暂无安装推荐。
- [业务分类与四标签短评](data/reports/20261019T074011Z-smoke-catalog.md)。
- 单插件详情：[InvoiceFlowAI](data/reports/20261019T074011Z-smoke-invoice.md)、[TaskSwarm](data/reports/20261019T074011Z-smoke-taskswarm.md)、[dsh-project-memory](data/reports/20261019T074011Z-smoke-memory.md)。
- [轮次报告](data/reports/20261019T074011Z-smoke.md)／[会话进度](data/sessions/20261019T074011Z-smoke.json)／[当前档案](data/catalog.json)。
- 历史报告：[首次两插件样例](data/reports/20261019T065545Z-init.md)。

尚未安装目标插件或执行真实业务任务，没有合格率、耗时和实际账单；合成示例不计入研究结果。

## 工程与 Skill

项目 Skill 放在 `.agents/skills/`：

- [dsh-plugin-init](.agents/skills/dsh-plugin-init/SKILL.md)：建立首次数据基线，分层采集与研究。
- [dsh-plugin-insight](.agents/skills/dsh-plugin-insight/SKILL.md)：单插件固定版本洞察，交付证据、详情和观察批次。

两个 Skill 共享[数据契约](docs/01-design/DATA-CONTRACT.md)、[研究规范](docs/01-design/RESEARCH-STANDARD.md)、
[输出标准](docs/01-design/OUTPUT-STANDARD.md)、JSON Schema 和 Node.js ES Module 脚本。
数据与研究设计放在 `docs/01-design/`，工程治理规则放在 `docs/00-governance/`。文档分类、命名与维护遵循
[文档规则](docs/00-governance/DOCUMENT-RULES.md)。请将 Skill 与整个工程一起使用，入口里的相对引用依赖工程目录。
GitHub 操作复用环境中可用的 GitHub Skill 或插件；提交与 PR 交付遵循
[提交规则](docs/00-governance/COMMIT-RULES.md)和[PR 规则](docs/00-governance/PR-RULES.md)，读取路由见 `AGENTS.md`。

## 使用

项目 Node.js 固定为 `24.19.0`，与本次读取的 Codex 工作区依赖运行时一致。
版本由 `.node-version` 指定，`package.json` 的 `engines.node` 与之同步，CI 读取同一文件。
当前 shell 的默认 Node 可能不同，执行前切换到指定版本；后续 Codex 运行时升级需重新核实并同步，
不假设项目会自动跟随升级。GitHub 采集优先使用 GitHub 插件；可选采集脚本才需要已认证的 `gh` CLI。

```sh
node --version
npm ci --ignore-scripts
npm run check
```

也可通过以下可选脚本采集，它不会执行目标仓库代码：

```sh
node scripts/capture-github.mjs OWNER/REPO --out /tmp/repo-snapshot.json
```

按共享规范准备 observation（示例只用于理解结构），然后先计划再应用：

```sh
node scripts/plugin-data.mjs plan --mode init --observations YOUR_OBSERVATIONS.json --out /tmp/dsh-plan.json
node scripts/plugin-data.mjs apply --plan /tmp/dsh-plan.json
node scripts/plugin-data.mjs validate
```

已有基线使用 `--mode update`。计划保存基础档案摘要，基础档案发生变化时必须重新计划。
证据与来源保留历史，未检查的插件保留原样，抓取失败记录为错误；依赖变化的结论标为
`needs_review`。更新后的档案、observations、证据文件与研究报告应一起进入版本管理。

CI 的必需检查 `Repository checks` 同时运行工作流语法、数据校验、合成示例检查、脚本行为测试
及变更空白检查。Schema 校验保证结构与引用一致性，不证明研究结论真实，也不等于真实 DSH 验收。

## 许可证

本项目采用 [CC0-1.0](LICENSE)。
