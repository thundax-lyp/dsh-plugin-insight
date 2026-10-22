# ai-look-up

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[adb341c](https://github.com/1344738825/ai-look-up/tree/adb341c1d9899378caad2c3c2c37cf6cdd0cec49)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1344738825/ai-look-up)
<!-- END META -->

> **实现功能**：监测重复命令、连续失败与目标漂移，向会话注入复盘提示并可调用审查模型。

> **核心亮点**：index.js 监听会话事件，按spec.json阈值与冷却判定触发；可用宿主模型生成复盘建议，失败退回静态清单，另支持外部watcher通道。

> **风险与缺陷**：将行为信号转为可见提醒比静默循环更可控；提醒不是强制停止，错误诊断也可能把正常重试打断。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：长任务中Agent反复失败却继续调用工具，用户希望尽早提示停下来检查方向；成功标准应是减少无效尝试。

此前未入档；固定工具上限和人工检查是更简单对照。本项试图按行为触发，但没有同任务同预算结果。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **事件监听**：重复调用、失败、运行时长与目标漂移触发。
- **后台**：宿主llm复盘及可选外部watcher协议。

**流程与依赖**

依赖agent/session事件与注入API；模型审查依赖llm，外部通道依赖Python watcher、目录协议及独立凭据，数据可能离开主宿主。

运行任务、收集调用节奏、触发提示，人工或主模型决定调整；审查失败退回清单，重启后重新建立监测状态。

**兼容条件**

双端ZCode/Python hooks与DSH JS bundle，配置键及模型路由有差异；第三通道需另配key和watcher，不是安装即具备。

**效果与成本**

审查与周期提醒额外消耗模型及上下文；调阈值、确认误报、维护watcher产生人工和运维成本，没有实测净收益。

> **思考**：将行为信号转为可见提醒比静默循环更可控；提醒不是强制停止，错误诊断也可能把正常重试打断。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：index.js 监听会话事件，按spec.json阈值与冷却判定触发；可用宿主模型生成复盘建议，失败退回静态清单，另支持外部watcher通道。

共享spec降低双端参数漂移，模型审查失败有静态回退；内存会话状态与落盘第三通道需区分恢复能力。

<a id="detail-section-4"></a>

## 4 使用建议

先在非关键任务关闭第三通道，观察重复调用提醒的误报和冷却，再决定是否为审查增加预算。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：审查模型复用主会话供应商不构成独立真相；DSH内存状态随重启丢失，未验证降低循环或目标漂移的效果。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：回放已知正常重试和死循环任务，在相同预算下比较误报、无效调用及合格率，并检查审查超时和宿主重启。

**分析版本**

固定提交 [adb341c](https://github.com/1344738825/ai-look-up/tree/adb341c1d9899378caad2c3c2c37cf6cdd0cec49)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 512 | — | — | 7299 |
| .js | source | 2 | 1112 | 878 | 178 | — |
| .mjs | test | 2 | 1072 | 900 | 111 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/1344738825/ai-look-up/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
