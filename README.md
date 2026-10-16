# dsh-plugin-insight

DSH 插件目录、分类、证据与增量研究。当前提供两个仓库内 Skill：

- [dsh-plugin-init](skills/dsh-plugin-init/SKILL.md)：建立首次数据基线，分层采集与研究。
- [dsh-plugin-update](skills/dsh-plugin-update/SKILL.md)：检查变化，增量更新并标记受影响结论。

两个 Skill 共享[数据契约](docs/00-governance/data-contract.md)、[研究规范](docs/00-governance/research-standard.md)、
[输出标准](docs/00-governance/output-standard.md)、JSON Schema 和 Python 脚本。
共同规范统一放在 `docs/00-governance/`。请将 Skill 与整个工程一起使用，入口里的相对引用依赖工程目录。
Git 工作流通过 [GD／GitHub 操作指令](docs/00-governance/git-operations.md)处理；研究 Skill 不另建提交流程。
本仓库未附带真实插件研究结果；`examples/observations.json` 是合成数据，不计入目录。

## 使用

需要 Python 3.10+。GitHub 采集优先使用 GitHub 插件；使用可选采集脚本时才需要已认证的 `gh` CLI。

```sh
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements-dev.txt
python3 scripts/plugin_data.py validate
python3 -m unittest discover -s tests -v
```

也可通过以下可选脚本采集，它不会执行目标仓库代码：

```sh
python3 scripts/capture_github.py OWNER/REPO --out /tmp/repo-snapshot.json
```

按共享规范准备 observation（示例只用于理解结构），然后先计划再应用：

```sh
python3 scripts/plugin_data.py plan --mode init --observations YOUR_OBSERVATIONS.json --out /tmp/dsh-plan.json
python3 scripts/plugin_data.py apply --plan /tmp/dsh-plan.json
python3 scripts/plugin_data.py validate
```

已有基线使用 `--mode update`。计划保存基础档案摘要，基础档案发生变化时必须重新计划。
证据与来源保留历史，未检查的插件保留原样，抓取失败记录为错误；依赖变化的结论标为
`needs_review`。更新后的档案、observations、证据文件与研究报告应一起进入版本管理。

CI 的必需检查 `Repository checks` 同时运行工作流语法、数据校验、合成示例检查、脚本行为测试
及变更空白检查。Schema 校验保证结构与引用一致性，不证明研究结论真实，也不等于真实 DSH 验收。
