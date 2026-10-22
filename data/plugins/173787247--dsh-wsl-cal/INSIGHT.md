# dsh-wsl-cal

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[675bc5c](https://github.com/173787247/dsh-wsl-cal/tree/675bc5cc7efaf79a171e205e4f570ac2b945bb13)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-cal)
<!-- END META -->

> **实现功能**：通过本地khal读取日历列表、今日日程和未来指定天数的安排。

> **核心亮点**：lib/cal.js查找khal，分别调用printcalendars和list，限制未来天数、超时与输出长度；Host注册状态、日历与日程工具。

> **风险与缺陷**：把已有日历读取接入会话有便利，安装它不能自动把企业日历同步进来。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：已有khal日历的用户希望在会话内查询近期安排，交付应与本地日历一致，不误以为已创建事件。

此前未入档；直接khal或原生日历更直观，本项适合希望在技术会话中顺手查询的人。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **模型工具**：cal_status、cal_calendars、cal_today、cal_list。

**流程与依赖**

需要khal可执行文件、有效日历配置和同步数据，任务准确性依赖时区与数据新鲜度；日程文本会进入模型上下文。

查状态和日历列表，再问今天或未来N天，人工对照关键会议；失败先在同环境检查khal配置，不改写日程。

**兼容条件**

0.1.1，Node>=18及本地khal；README顶部仍有0.1.0字样，版本以固定package为准，属可选套件项。

**效果与成本**

首次部署khal和同步账户是主要负担；日常CLI开销低但同步失败需要排查，模型读取日程仍会消耗上下文。

> **思考**：把已有日历读取接入会话有便利，安装它不能自动把企业日历同步进来。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：lib/cal.js查找khal，分别调用printcalendars和list，限制未来天数、超时与输出长度；Host注册状态、日历与日程工具。

独立CLI执行器限制输出和超时，calendarCount未知用null；路径探测依赖bash环境，CLI与宿主环境不一致需核实。

<a id="detail-section-4"></a>

## 4 使用建议

适合已配置khal的人，先核对本地日期、时区与日历数量；空输出先确认同步与过滤，不直接判断没有安排。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读查询不配置同步或创建事件；khal配置缺失、时区与同步延迟会影响结果，未做真实日历验收。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用跨时区、全天、重复和空日历样本核对日期范围与截断，记录漏项并区分配置错误和真正无事件。

**分析版本**

固定提交 [675bc5c](https://github.com/173787247/dsh-wsl-cal/tree/675bc5cc7efaf79a171e205e4f570ac2b945bb13)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 116 | — | — | 450 |
| .js | source | 2 | 197 | 181 | 2 | — |
| .js | test | 1 | 6 | 6 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-cal/issues) 查看。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
