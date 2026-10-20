# No AI Style

> 以写作 Skill 和输入框入口帮助润色中英日专业文本，保留事实、引文与不确定性。

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style) · [![最后更新 昨天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E6%98%A8%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style/commits)
<!-- END META -->

## 版本

固定提交 [a64e811bf0aa255189a0df2011a6a392c5d59966](https://github.com/01NGVI-QINGYI/no-ai-style/tree/a64e811bf0aa255189a0df2011a6a392c5d59966)

## 用途与采用点评

- **用途**：论文与专业文档作者需要减少机械表达，同时保留事实承诺和引用。
- **亮点**：filesystem provider 暴露内嵌 Skill；审阅与改写模式区分权限，真相边界优先于文风。
- **思考**：权限模式与事实优先级值得采用；提示词约束不是保真保证，仍由作者承担复核。
- **建议**：先用带数字和引用的旧稿试改，逐项对照事实与限定词，不把文风自然当作内容可靠。

## 场景与替代办法

论文与专业文档作者需要减少机械表达，同时保留事实承诺和引用。

直接提示模型也能润色；该项目把反复使用的保真与授权规则固定为可携带 Skill。

## 依赖与流程

需兼容 DSH 的 skills、agents 与 filesystem provider；效果依赖写作模型和原稿依据。

选择仅审阅或改写模式，提供段落及依据；人工检查变化后才写回正式稿。

## 成本与效果

不需额外写作服务，但仍消耗所用模型调用和逐句复核时间；没有成本实测。

权限模式与事实优先级值得采用；提示词约束不是保真保证，仍由作者承担复核。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：1f53722d244977f223c5fa4961fde0ecae04b36a362bdb7befe3c7369b00591e。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 375 | 335 | 15 | — |
| .md | source | 10 | 876 | — | — | 6066 |
| .mjs | source | 1 | 11 | 9 | 0 | — |
| .md | example | 2 | 61 | — | — | 375 |
| .cjs | source | 1 | 349 | 313 | 15 | — |
| .cjs | test | 1 | 274 | 239 | 13 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **Skill**：内嵌 no-ai-style 写作审阅与润色 Skill。
- **界面**：包清单声明 Web 客户端写作入口。

## 工程亮点

短入口复用宿主 Skill provider，规则正文与客户端入口分离，迁移需验证加载路径。

## 分发与兼容

清单为 no-ai-style 1.2.1，声明 DSH 版本区间与 skill-filesystem peer 依赖。

## 历史对照

当前快照此前没有该稳定身份的研究档案。直接提示模型也能润色；该项目把反复使用的保真与授权规则固定为可携带 Skill。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查 Skill 正文与 provider 接线，未测量事实保真率或评审一致性。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用十段带统计和限制条件的文本，比较普通润色提示与本 Skill 的事实改动及复核时间。

## 活跃度

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 0](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style/issues?q=is%3Aissue+created%3A2026-09-20T02%3A56%3A18.533Z..2026-10-20T02%3A56%3A18.533Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T02%3A56%3A18.533Z..2026-10-20T02%3A56%3A18.533Z) · [![近30天更新 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=0&color=grey&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style/issues?q=is%3Aissue+updated%3A2026-09-20T02%3A56%3A18.533Z..2026-10-20T02%3A56%3A18.533Z)

统计日期：2026-10-20。
