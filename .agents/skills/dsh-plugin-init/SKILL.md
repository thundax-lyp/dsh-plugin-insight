---
name: dsh-plugin-init
description: 初始化 DSH 插件研究档案，从业务场景、问题、安装与效果依赖、流程复杂度、总成本和任务收益形成分层洞察。适用于 dsh-plugin-insight 首次建档；已有基线时使用 dsh-plugin-update。
---

# 初始化 DSH 插件研究数据

本 Skill 在 `dsh-plugin-insight` 工程中使用，所有数据脚本从工程根目录运行。
它依赖共享的 `docs/01-design/`、`schemas/` 和 `scripts/`，工程规则见 `docs/00-governance/`；不要只复制 Skill 文件夹。

开始前阅读[数据契约](../../../docs/01-design/DATA-CONTRACT.md)、
[研究规范](../../../docs/01-design/RESEARCH-STANDARD.md)、
[输出标准](../../../docs/01-design/OUTPUT-STANDARD.md)。
GitHub 来源读取、版本比较和 PR 操作依赖当前环境可用的 GitHub Skill 或插件；
按其实际能力执行，不假设存在特定 Skill 名称。本 Skill 不另定义 Git 工作流，仓库约束见根 `AGENTS.md`。

1. **检查基线与工作范围。** 检查当前档案、工作区及用户指定的来源和研究范围。
   已有基线时改用更新 Skill，保留无关文件和人工修改。需要新建分支时遵循根 `AGENTS.md`。数据工具使用工程指定的 Node.js 版本，首次执行前运行 `npm ci --ignore-scripts`。
2. **固定来源和采集截止时间。** 用户未指定来源时，使用研究规范中的两个默认目录。
   优先通过 GitHub 插件读取仓库、精确提交和该提交下的目录文件，保存原始结果。
   优先采集结构化条目，补充 README 和 CATALOG。记录分页、截断、访问失败及覆盖范围。
   本机有已认证的 `gh` 时，也可使用可选采集脚本：
   ```sh
   node scripts/capture-github.mjs awesome-dsh-plugin/awesome-dsh-plugin --out data/snapshots/<run_id>/awesome-dsh-plugin.json
   ```
   脚本仅采集部分根目录文件及文件树，其他目录条目仍需读取；使用 GitHub 插件时无需安装 `gh`。
3. **识别与分类。** 提取候选条目，核对仓库数字 ID 和稳定组件 ID 后去重。
   同仓库的不同子包分别建档；改名或移动路径保留原身份。区分插件、工具、技能、资料、
   占位项目和未知类型，赋予技术主类、业务主类及多标签。
4. **围绕任务价值分层研究。** 先为成功识别的条目建目录级档案；按用户范围选择重点插件或专题。
   明确谁在什么场景下完成什么任务、原有办法及合格交付标准，再按研究规范核查安装／效果依赖、
   用户／后台／失败恢复流程、首次与持续使用成本、实际结果及适用边界。围绕同一任务与基线比较，
   判断插件减少了什么负担、引入了什么条件，以及哪些用户值得采用。
   成本以合格任务为单位，纳入失败重试、人工复核和修正，现金与人工时间分别记录；未知项不编造。
   源码、架构、测试及创新分析用于支撑这些判断，按影响选择核查深度；只有实际执行才记录本地／宿主验证。
   从事实推进到解释与决策，证据不足时形成可验证假设，不强行输出洞察或扩大为全量运行测评。
5. **准备观察批次与证据。** 按数据契约生成观察批次，按共享输出标准保存证据和初始化报告。
   可参考[合成示例](../../../examples/observations.json)理解字段。
   采集失败记入 `errors`，不要编造或删除条目；结论绑定实际核查的版本指纹。
   按研究规范对最影响采用的一项主张做关键质疑，核对收益归因、负担去向和承诺范围；
   按[输出标准的三层输出](../../../docs/01-design/OUTPUT-STANDARD.md#先分析再归纳与推荐)，
   先完成单插件详情，再提炼分类列表中的“用途／亮点／关键质疑／建议”四标签短评，最后生成推荐页。
   区分“什么值得装”与“本周最值得试”的证据门槛，说明适用条件与优先验证，并同步 README 入口。
   按输出标准在报告中呈现插件采用画像、洞察和专题比较，同步 README 的实际产物入口；不新增未定义的 Schema 字段。
6. **生成并应用初始化计划。**
   ```sh
   node scripts/plugin-data.mjs plan --mode init --observations data/observations/<run_id>.json --out /tmp/dsh-init-plan.json
   ```
   检查计划中的重复身份、分类不确定性、来源覆盖和结论证据。需要修正时修改观察批次并重新生成。
   计划符合用户授权的初始化范围后应用并校验：
   ```sh
   node scripts/plugin-data.mjs apply --plan /tmp/dsh-init-plan.json
   node scripts/plugin-data.mjs validate
   npm test
   ```

按共享输出标准完成初始化统计、报告和交付验收。
初始化研究数据不等于安装第三方插件，也不自动安排定期研究或发布结果。
