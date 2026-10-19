# 三插件 Init 冒烟：流程与输出样例

会话 `20261019T074011Z-smoke`，2026-10-19，目标仅 3 个 DSH 插件。先固定清单，再逐项完整分析并入档，最后归纳分类与推荐。

## 阅读入口

- [本周什么值得试](RECOMMENDATIONS.md)：项目记忆优先试、发票整理条件试、并行开发继续观察；暂无安装推荐。
- [业务分类与四标签短评](views/CATALOG.md)。
- 详情：[InvoiceFlowAI](insights/ethanyoq--invoice-downloader--dsh-invoice-downloader.md)、[TaskSwarm](insights/february2015--dsh-taskswarm.md)、[dsh-project-memory](insights/00080000--dsh-project-memory.md)。

## 范围、来源和版本

默认两个来源：[awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/tree/13dcda27177db72e1004b6116f0d589675176fba) 与 [awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness/tree/cd4faf97da814f06fab4a5e307e5ba0f62c638af)。
本轮只定向读取 primary 三个结构化条目，secondary 的 README／CATALOG 用于交叉发现；不声称全目录完整，因此两来源的 complete 均为 false，不能推断其他条目删除或生态趋势。

| 组件 | 固定提交 | 公开 npm latest | 本轮比较标记 |
|---|---|---|---|
| InvoiceFlowAI 的 DSH 组件 | 8fe3a1147c619268b41f1480e73c4fa38d97db69 | 200／0.1.1 | unchanged |
| TaskSwarm | 032e2c9d228c20cab65fe0ea061d78a7c753ab8c | 404 | unchanged |
| dsh-project-memory | fe7ac6cab91784a34996aede007d3586f0ff2def | 200／0.6.2 | added |

“新增”指新增研究对象，不表示本周新发布。3 组件／3 仓库，全部为 plugin、source 深度；业务分类办公运营 1、软件交付 2，技术类工具集成／工作流／记忆各 1。
比较基线从此前 2 条真实档案的元数据重建，[比较快照](snapshots/COMPARISON-BASELINE.json)不是伪造的已执行历史会话，其 pending 不代表本轮待办；旧报告[保留](../2026-10-19-01/REPORT.md)。本轮多出一个目标，范围差异明确，不做全量数量趋势。

## 插件变化与判断变化

前两项提交和分发状态未变，仍重新阅读相同固定版本的原始材料并重新提交全部 6 条判断。InvoiceFlowAI 维持条件试用，TaskSwarm 维持观察；表达更明确地纳入摊薄配置成本、评审和集成负担。没有新增运行证据让建议升级。
项目记忆新增 6 条判断，发现目录 tarball 0.4.0 与源码／npm 0.6.2 的版本差异，以及“零成本”不能覆盖提示与本地维护负担。推荐优先级基于有限样本的试验价值，不能当作同条件性能比较。

## 入档和断点结果

[本轮会话](SESSION.json)：3／3 complete，blocked 0，pending 0；3 个观察批次逐项通过 plan／apply／checkpoint。每次 checkpoint 后从新进程读取 next，完成数从 1 到 2 到 3，最终 next 为 null。

观察批次：[发票](observations/ethanyoq--invoice-downloader--dsh-invoice-downloader.json)、[并行开发](observations/february2015--dsh-taskswarm.json)、[项目记忆](observations/00080000--dsh-project-memory.json)。当前档案累计 3 插件、18 条当前判断；历史来源和证据保留。TaskSwarm npm 404 记入该观察批次 errors，不删除源码档案。

[实际执行记录](snapshots/SMOKE-EXECUTION.json)包含最终 next 和重复 checkpoint 拒绝结果，重复登记后会话摘要未变。本轮验证独立进程恢复和已完成项跳过，没有模拟断电、真实进程崩溃或多人认领。CLI 的 block／retry 等行为由工程测试覆盖，不冒充本轮插件运行。

## 验证与未覆盖

固定版本来源、源码与发布元数据已核查。前两项复用提交未变的原始源码快照，第三项抽读 18 个文档／源码／契约测试文件。Python npm 查询遇到系统证书链错误后，改用 curl 默认 TLS 校验成功完成读取，没有残留网络缺口。

`npm run check` 通过：档案、所有观察批次和会话检查点校验通过，本项目 32 项行为测试通过；这些不是三个目标插件的测试或宿主验收。目标插件均未安装、未运行其测试、未启动真实宿主、未调用付费模型；未测量合格率、速度、模型账单和实际业务收益，未核查独立采用反馈。下一步应只选择一项按推荐页的小规模试验补齐效果证据。

原始材料见[来源与范围记录](snapshots/SCOPE.json)、[primary 目录](snapshots/AWESOME-DSH-PLUGIN.json)、[secondary 目录](snapshots/AWESOME-DEEPSEEK-HARNESS.json)。第三方原始内容保留其许可证，不自动适用本项目 CC0。
