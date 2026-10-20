# No AI Style

> 以写作 Skill 和输入框入口帮助润色中英日专业文本，保留事实、引文与不确定性。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[a64e811](https://github.com/01NGVI-QINGYI/no-ai-style/tree/a64e811bf0aa255189a0df2011a6a392c5d59966)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style)
<!-- END META -->

**使用建议**：先用带数字和引用的旧稿试改，逐项对照事实与限定词，不把文风自然当作内容可靠。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：论文与专业文档作者需要减少机械表达，同时保留事实承诺和引用。

直接提示模型也能润色；该项目把反复使用的保真与授权规则固定为可携带 Skill。

## 能力与限制

- **Skill**：内嵌 no-ai-style 写作审阅与润色 Skill。
- **界面**：包清单声明 Web 客户端写作入口。

**流程与依赖**

需兼容 DSH 的 skills、agents 与 filesystem provider；效果依赖写作模型和原稿依据。

选择仅审阅或改写模式，提供段落及依据；人工检查变化后才写回正式稿。

**兼容条件**

清单为 no-ai-style 1.2.1，声明 DSH 版本区间与 skill-filesystem peer 依赖。

**效果与成本**

不需额外写作服务，但仍消耗所用模型调用和逐句复核时间；没有成本实测。

- **思考**：权限模式与事实优先级值得采用；提示词约束不是保真保证，仍由作者承担复核。

## 工程分析

- **亮点**：filesystem provider 暴露内嵌 Skill；审阅与改写模式区分权限，真相边界优先于文风。

短入口复用宿主 Skill provider，规则正文与客户端入口分离，迁移需验证加载路径。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查 Skill 正文与 provider 接线，未测量事实保真率或评审一致性。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用十段带统计和限制条件的文本，比较普通润色提示与本 Skill 的事实改动及复核时间。

**分析版本**

固定提交 [a64e811](https://github.com/01NGVI-QINGYI/no-ai-style/tree/a64e811bf0aa255189a0df2011a6a392c5d59966)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 375 | 335 | 15 | — |
| .md | source | 10 | 876 | — | — | 6066 |
| .mjs | source | 1 | 11 | 9 | 0 | — |
| .md | example | 2 | 61 | — | — | 375 |
| .cjs | source | 1 | 349 | 313 | 15 | — |
| .cjs | test | 1 | 274 | 239 | 13 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-20），可前往 [GitHub Issues](https://github.com/01NGVI-QINGYI/no-ai-style/issues) 查看。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
