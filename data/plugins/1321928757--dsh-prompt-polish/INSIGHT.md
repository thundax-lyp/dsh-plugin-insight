# dsh-prompt-polish

> 在输入栏调用宿主模型重写草稿，支持策略、语言、上下文与人工确认采纳。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[c894ae3](https://github.com/1321928757/dsh-prompt-polish/tree/c894ae3de6590542f8353b76e314656a4a3fe3a0)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1321928757/dsh-prompt-polish) [![npm 30d 358](https://img.shields.io/static/v1?label=npm+30d&message=358&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-prompt-polish) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-prompt-polish)
<!-- END META -->

**使用建议**：先不带历史改写普通草稿，对照检查否定、数字和交付限制；需要上下文时再开启，并人工决定是否采用。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：用户反复组织复杂请求，希望提交前改善表达并保留原意；验收标准是约束无遗漏，而非文字更长。

此前未入档；直接编辑或要求当前会话润色是较低配置的替代，本项增量在输入栏确认、取消与历史管理。

## 能力与限制

- **界面**：优化按钮、设置、结果确认与近期历史。
- **后台**：当前模型流式优化及取消请求。

**流程与依赖**

需要宿主模型、计费账号和UI/会话服务；敏感草稿及启用的上下文会发送至当前模型供应方。模型质量决定语义忠实度。

输入草稿，选择策略和语言，等待优化，比较原稿后采纳或保留；超时先检查是否仍有请求，避免连续发起重试。

**兼容条件**

0.4.1，声明DSH 0.2.0-rc.2到0.3.0前；多项宿主服务及typert/UI适配构成效果前提，不能因peer可选就理解为功能无依赖。

**效果与成本**

每次优化额外调用模型，携带历史扩大输入；核对语义、重试和放弃结果都应计入成本，没有实测节省时间。

- **思考**：确认式采纳比自动替换更可控；同一模型改写并不保证比直接发送原请求更好。

## 工程分析

- **亮点**：lib/index.js 收集启用的目标、任务和历史，在字符预算内构建请求，调用宿主llm.stream；客户端展示结果，采纳由用户决定。

runId到AbortController的映射与finally清理便于取消，区分截断、取消和错误；超时分支是否终止底层流需宿主实测。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：未证实改写改善下游任务；上下文可能带入无关信息，超时停止等待不应直接当成服务端计费已停止。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：固定一批含否定与数值的请求，盲评语义保留和后续交付率，记录优化调用、失败和人工复核总耗时。

**分析版本**

固定提交 [c894ae3](https://github.com/1321928757/dsh-prompt-polish/tree/c894ae3de6590542f8353b76e314656a4a3fe3a0)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1827 | — | — | 16263 |
| .js | source | 4 | 2333 | 2032 | 193 | — |
| .mjs | source | 1 | 115 | 112 | 2 | — |
| .mjs | test | 4 | 474 | 432 | 3 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/1321928757/dsh-prompt-polish/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
