# dsh-subagent

> 把 Qoder 与 QoderCN 命令行注册为 DSH 子代理，提供委派、模型回退和进度查询。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[f5b8d34](https://github.com/1373700184/dsh-subagent/tree/f5b8d34882618c9cab7bdf012e7d04f72a7ae849)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1373700184/dsh-subagent) · [![npm 30d 22](https://img.shields.io/static/v1?label=npm+30d&message=22&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-subagent)
<!-- END META -->

**使用建议**：已有 Qoder 订阅且能用隔离目录的开发者可先试只读任务；设置单次硬超时，确认权限模式，并检查最终文件或答案，先别让模型回退承担不可重复的写操作。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、流程与依赖](#detail-section-3)
  - [效果、成本与限制](#detail-section-4)
  - [核心贡献与工程亮点](#detail-section-5)
  - [使用判断](#detail-section-6)
  - [能力、流程与成本](#detail-section-7)
  - [工程贡献](#detail-section-8)
  - [核查说明与分析版本](#detail-section-9)
- [未来设计假设（未验证）](#detail-section-10)
- [辅助信息](#detail-section-11)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 场景与替代办法

已有 Qoder 订阅的开发者在 DSH 父任务里分派具有完整输入的独立代码任务，交付最终文本与可查询运行记录。

参照是直接运行Qoder CLI和DSH上游通用SubagentProvider；本次不对其他CLI插件做性能优劣比较。

<a id="detail-section-3"></a>

### 能力、流程与依赖

lib/index.js 的 QoderJsonProvider 把文本提示经 stdin 交给一次性 CLI，将 stream-json result 折叠为宿主结果；ActivityLedger 与状态工具、探测路由共享运行 ID，模型链按首次事件与失败结算切换。

- **模型工具**：qoder/qodercn委派绑定及qoder_subagent_status查询。
- **用户命令**：按提供方名注册斜杠委派入口。
- **Host 路由**：CLI探测、刷新与活动读取。
- **界面**：Web设置与有界动作面板。
- **后台**：一次性CLI执行与模型链回退。

依赖DSH的subagents/tools/commands，连接服务支撑设置探测；本机对应CLI须可执行且登录；子任务不继承父上下文。

父Agent经工具或斜杠生成委派→按模型链spawn→stdin提示→解析事件并刷新面板→收敛result或失败记录→父Agent核对交付；静默时可唤醒父任务，不能据此直接宣布完成。

package 与 cordis.patch 提供 web 客户端及两个 dsh-tool-subagent 绑定；只有 qoder-json driver，NO_START_CAPABILITIES 不承诺续话或结构化输出。

<a id="detail-section-4"></a>

### 效果、成本与限制

价值是把外部订阅执行接回父任务和进度界面；是否省钱或提速取决于上下文交接、重试和复核成本，源码不能证明收益。

首次需各CLI安装登录、版本与权限检查；每任务需要补写上下文和人工验收，模型回退可能重复消耗额度。现金取决于外部订阅，人工时间没有同条件测量；内存账本24次运行、每次200事件会截断，长期审计另需存档。

模型回退是否真的限制整次任务等待？start 中 deadline 只限制 firstEvent 的等待和失败后的切换；一旦任何 JSON 事件使 firstEvent ready，代码直接 await run.handle().result，而 timeoutSeconds 默认不设。因此先输出元数据再卡住的 CLI 可能超过 allowedWaitSeconds，静默提醒不等于总预算终止。默认 bypass_permissions、POSIX 只杀直接子进程，也要求隔离目录与结果验收。

<a id="detail-section-5"></a>

### 核心贡献与工程亮点

相对手工在 Qoder CLI 与 DSH 之间搬运任务，新增的是 qoder-json 提供方适配、斜杠委派入口、有界动作账本及模型链尝试记录。子进程结果与取消句柄复用 @deepseek-ai/dsh-subagent helpers，不能把上游结算机制算作本插件原创；同一运行 ID 贯穿父侧查询与前端，减少定位运行的手工交接。

QoderJsonProvider 与 QoderJsonRun 分离，ActivityLedger 设明确上限，stderr留4096字符，ctx.effect管理注册；可复用运行ID和账本结构，但复用时需修订全程deadline、末尾无换行JSON及进程树取消语义。

源码依据：[lib/index.js](https://github.com/1373700184/dsh-subagent/blob/f5b8d34882618c9cab7bdf012e7d04f72a7ae849/lib/index.js)、[src/client.js](https://github.com/1373700184/dsh-subagent/blob/f5b8d34882618c9cab7bdf012e7d04f72a7ae849/src/client.js)、[cordis.patch.yml](https://github.com/1373700184/dsh-subagent/blob/f5b8d34882618c9cab7bdf012e7d04f72a7ae849/cordis.patch.yml)、[package.json](https://github.com/1373700184/dsh-subagent/blob/f5b8d34882618c9cab7bdf012e7d04f72a7ae849/package.json)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：已有 Qoder 订阅的开发者在 DSH 父任务里分派具有完整输入的独立代码任务，交付最终文本与可查询运行记录。

- **建议**：待验证假设：将等待预算拆成首事件、业务进度、最终交付三个阶段，并把任务输出契约与 deadline 一起交给 Run，可减少“有活动但无限等待”。依据是当前 firstEvent 与最终结果有不同生命周期；新增的是明确的业务阶段与统一截止，并非现有能力。用仅吐元数据、持续心跳但无结果、正常完成三类伪 CLI 对照，观察超时是否覆盖全过程、取消后是否残留子进程、合格任务是否误杀；若完成率下降且无等待收益，否定该设计。

已有 Qoder 订阅且能用隔离目录的开发者可先试只读任务；设置单次硬超时，确认权限模式，并检查最终文件或答案，先别让模型回退承担不可重复的写操作。

**核查状态**：已抽读固定版本源码，未安装、运行目标插件或真实宿主验收。贡献是固定源码中可见的协议与进度适配；实际成功率、费用和宿主取消尚未验证。未来验收契约是假设。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **模型工具**：qoder/qodercn委派绑定及qoder_subagent_status查询。
- **用户命令**：按提供方名注册斜杠委派入口。
- **Host 路由**：CLI探测、刷新与活动读取。
- **界面**：Web设置与有界动作面板。
- **后台**：一次性CLI执行与模型链回退。

- **思考**：模型回退是否真的限制整次任务等待？start 中 deadline 只限制 firstEvent 的等待和失败后的切换；一旦任何 JSON 事件使 firstEvent ready，代码直接 await run.handle().result，而 timeoutSeconds 默认不设。因此先输出元数据再卡住的 CLI 可能超过 allowedWaitSeconds，静默提醒不等于总预算终止。默认 bypass_permissions、POSIX 只杀直接子进程，也要求隔离目录与结果验收。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：相对手工在 Qoder CLI 与 DSH 之间搬运任务，新增的是 qoder-json 提供方适配、斜杠委派入口、有界动作账本及模型链尝试记录。子进程结果与取消句柄复用 @deepseek-ai/dsh-subagent helpers，不能把上游结算机制算作本插件原创；同一运行 ID 贯穿父侧查询与前端，减少定位运行的手工交接。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- 版本号：0.5.2；版本日期：2026-10-21（固定提交日期，北京时间；不是包发布日期）。
- 固定版本：[f5b8d348](https://github.com/1373700184/dsh-subagent/tree/f5b8d34882618c9cab7bdf012e7d04f72a7ae849)；本次截止 2026-10-21T03:00:27Z。
- 已检查：README、package与以上源码路径及固定组件统计。
- 未执行：目标代码、目标测试、安装、真实宿主或第三方服务验证。
- 范围限制：抽读提供方、Run、状态账本、前端与bundle；未运行CLI、未核实订阅收费或完整进程树清理。
- 证据边界：源码与作者说明不等于独立效果验证；GitHub/npm指标不证明采用或收益。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：06fbe1646dabc9966d45b9589492e55b4e17386a008fff7feb04a1fdb13b5ac0。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 1580 | 1416 | 113 | — |
| .md | source | 1 | 84 | — | — | 1171 |
| .mjs | source | 1 | 30 | 28 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：将等待预算拆成首事件、业务进度、最终交付三个阶段，并把任务输出契约与 deadline 一起交给 Run，可减少“有活动但无限等待”。依据是当前 firstEvent 与最终结果有不同生命周期；新增的是明确的业务阶段与统一截止，并非现有能力。用仅吐元数据、持续心跳但无结果、正常完成三类伪 CLI 对照，观察超时是否覆盖全过程、取消后是否残留子进程、合格任务是否误杀；若完成率下降且无等待收益，否定该设计。

下一步在隔离宿主记录CLI版本、全程耗时、取消残留与输出断言，覆盖spawn失败、元数据后卡住和首模型产生副作用后失败；本轮仅源码检查。

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1373700184/dsh-subagent/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/1373700184/dsh-subagent/issues?q=is%3Aissue+created%3A2026-09-21T03%3A08%3A40.997Z..2026-10-21T03%3A08%3A40.997Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1373700184/dsh-subagent/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T03%3A08%3A40.997Z..2026-10-21T03%3A08%3A40.997Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
