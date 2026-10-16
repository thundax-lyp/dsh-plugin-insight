# dsh-plugin-insight

DSH 插件目录、分类、证据与增量研究。本 README 是研究输出的统一入口。

## 研究出处

插件发现和目录研究以以下两个 GitHub 仓库为起点：

- [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
- [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness)

具体研究会记录实际读取的文件、固定提交及采集时间，并继续追溯到目标插件的源码、发布和验证证据。
目录收录不等于插件当前可用，也不代表这些来源认可本项目的点评。

## 研究结果入口

目前尚未建立真实研究基线，也没有研究报告；[当前插件档案与运行历史](data/catalog.json)为空。
初始化完成后，这里提供最新研究报告、分类概览、增量更新和历史报告的入口，并注明范围与截止时间。
合成示例不计入研究结果。

## 工程与 Skill

项目 Skill 放在 `.agents/skills/`：

- [dsh-plugin-init](.agents/skills/dsh-plugin-init/SKILL.md)：建立首次数据基线，分层采集与研究。
- [dsh-plugin-update](.agents/skills/dsh-plugin-update/SKILL.md)：检查变化，增量更新并标记受影响结论。

两个 Skill 共享[数据契约](docs/00-governance/DATA-CONTRACT.md)、[研究规范](docs/00-governance/RESEARCH-STANDARD.md)、
[输出标准](docs/00-governance/OUTPUT-STANDARD.md)、JSON Schema 和 Node.js ES Module 脚本。
共同规范统一放在 `docs/00-governance/`，文档分类、命名与维护遵循
[文档规则](docs/00-governance/DOCUMENT-RULES.md)。请将 Skill 与整个工程一起使用，入口里的相对引用依赖工程目录。
GitHub 操作复用环境中可用的 GitHub Skill 或插件；仓库级协作约束见 `AGENTS.md`。

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
