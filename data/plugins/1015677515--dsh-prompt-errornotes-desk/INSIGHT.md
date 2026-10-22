# Prompt Desk

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[fab9373](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/tree/fab9373ac396e430316b09693b654051583e9713)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk)
<!-- END META -->

> **实现功能**：在对话标题栏编辑全局与会话提示词，并把模型自报错误收为待确认经验草稿。

> **核心亮点**：index.js 逐个尝试认错标记，跳过不合法的首次出现，要求同一行按错误经过、教训顺序解析；结果先入待确认队列，采纳后才注入。

> **风险与缺陷**：跳过无效早期标记能修正漏采路径，但采集更多草稿未必改善后续任务；经验质量仍依赖人工取舍。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：经常纠正同类行为的用户需要维护少量可复用教训，合格结果是正确经验被下轮读取且可撤回。

相比前次 c76ffa0 提交，本轮确认解析器会继续扫描后续标记；维持人工确认建议。普通 AGENTS.md 编辑更简单，候选队列主要减少整理步骤。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **界面**：提示词与错误经验编辑、候选采纳。
- **后台**：有界近期经验与会话提示进入系统提示。

**流程与依赖**

需要 systemPrompt 与 webServer 服务、浏览器 UI 及可写 DSH_HOME；全局提示保存会影响其他会话，效果依赖模型遵循经过确认的经验。

面板编辑提示，模型输出产生候选，用户修改并采纳，下轮函数式构建注入；漏采时先检查同一行双标签，不反复重写全局文件。

**兼容条件**

包版本仍为1.2.1，GitHub-only 分发；新提交不能由版本号未变推断无变化。Host 路由和浏览器端均须加载。

**效果与成本**

模型每轮接收近期经验会增加输入量；人工确认、归类和消除冲突是持续成本。没有实测费用或重复错误下降比例。

> **思考**：跳过无效早期标记能修正漏采路径，但采集更多草稿未必改善后续任务；经验质量仍依赖人工取舍。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：index.js 逐个尝试认错标记，跳过不合法的首次出现，要求同一行按错误经过、教训顺序解析；结果先入待确认队列，采纳后才注入。

parseConfession 与 parseConfessionAt 分离定位与校验，队列按内容去重并限长；Host 写入与 Client 展示分开，原子文件替换不等于并发编辑无冲突。

<a id="detail-section-4"></a>

## 4 使用建议

已有用户应重点检查先引用标记再真正认错的消息，先只保留少量能复现的教训，并确认禁用或删除后的注入变化。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：格式匹配不能判定错误是否真实或教训是否可迁移；未执行流式事件、并发面板编辑和宿主验证。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：以句中引用、合法第二标记、换行教训、模板回显与重复消息组成样本，统计候选准确率，并比较开启前后的真实重复错误。

**分析版本**

固定提交 [fab9373](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/tree/fab9373ac396e430316b09693b654051583e9713)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1046 | — | — | 14231 |
| .js | source | 2 | 2703 | 1347 | 1167 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
