---
name: dsh-plugin-init
description: 从指定目录来源初始化 DSH 插件研究档案，建立稳定身份、技术与业务分类、版本证据和分层点评。适用于 dsh-plugin-insight 的首次建档；已有基线时使用 dsh-plugin-update。
---

# 初始化 DSH 插件研究数据

本 Skill 在 `dsh-plugin-insight` 工程中使用，所有数据脚本从工程根目录运行。
它依赖共享的 `docs/00-governance/`、`schemas/` 和 `scripts/`，不要只复制 Skill 文件夹。

开始前阅读[数据契约](../../../docs/00-governance/DATA-CONTRACT.md)、
[研究规范](../../../docs/00-governance/RESEARCH-STANDARD.md)、
[输出标准](../../../docs/00-governance/OUTPUT-STANDARD.md)和[Git 操作指令](../../../docs/00-governance/GIT-OPERATIONS.md)。
Git 与 GitHub 操作交给已安装的 GD 指令或 GitHub 插件；本 Skill 不定义另一套提交流程。

1. **检查基线与工作范围。** 检查当前档案、工作区及用户指定的来源和研究范围。
   已有基线时改用更新 Skill，保留无关文件和人工修改。需要新建分支时，按共享 Git
   指令处理。数据工具需要 Python 环境及 `requirements-dev.txt` 中的依赖。
2. **固定来源和采集截止时间。** 用户未指定来源时，使用研究规范中的两个默认目录。
   优先通过 GitHub 插件读取仓库、精确提交和该提交下的目录文件，保存原始结果。
   优先采集结构化条目，补充 README 和 CATALOG。记录分页、截断、访问失败及覆盖范围。
   本机有已认证的 `gh` 时，也可使用可选采集脚本：
   ```sh
   python3 scripts/capture_github.py awesome-dsh-plugin/awesome-dsh-plugin --out data/snapshots/<run_id>/awesome-dsh-plugin.json
   ```
   脚本仅采集部分根目录文件及文件树，其他目录条目仍需读取；使用 GitHub 插件时无需安装 `gh`。
3. **识别与分类。** 提取候选条目，核对仓库数字 ID 和稳定组件 ID 后去重。
   同仓库的不同子包分别建档；改名或移动路径保留原身份。区分插件、工具、技能、资料、
   占位项目和未知类型，赋予技术主类、业务主类及多标签。
4. **分层研究。** 为成功识别的条目建立目录级档案；按请求和优先级补充源码核查及深度点评。
   研究问题、机制、创新归属、工程画像、同类差异和采用条件。只有实际执行后才能记录
   本地测试或真实宿主验收，作者声明不能写成已验证结果。
5. **准备观察批次与证据。** 按数据契约生成观察批次，按共享输出标准保存证据和初始化报告。
   可参考[合成示例](../../../examples/observations.json)理解字段。
   采集失败记入 `errors`，不要编造或删除条目；结论绑定实际核查的版本指纹。
6. **生成并应用初始化计划。**
   ```sh
   python3 scripts/plugin_data.py plan --mode init --observations data/observations/<run_id>.json --out /tmp/dsh-init-plan.json
   ```
   检查计划中的重复身份、分类不确定性、来源覆盖和结论证据。需要修正时修改观察批次并重新生成。
   计划符合用户授权的初始化范围后应用并校验：
   ```sh
   python3 scripts/plugin_data.py apply --plan /tmp/dsh-init-plan.json
   python3 scripts/plugin_data.py validate
   python3 -m unittest discover -s tests -v
   ```

按共享输出标准完成初始化统计、报告和交付验收，按共享 Git 指令处理版本管理。
初始化研究数据不等于安装第三方插件，也不自动安排定期研究或发布结果。
