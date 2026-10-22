# chicheng-cron

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[99a223e](https://github.com/534119219/chicheng-cron/tree/99a223edfa090afa2f1f05c77526a53a0f277961)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-cron)
<!-- END META -->

> **实现功能**：在 DSH Web 配置 cron 定时脚本、Skill 与 Agent 任务，查看历史并发送完成通知。

> **核心亮点**：相对系统cron加独立日志脚本，增量是把DSH Skill/Agent与普通脚本放进一个有历史、输出查看和通知的界面，并整理headless会话。cron语法、进程执行与推送服务为既有机制；贡献是统一任务生命周期和DSH交接，而非新调度算法。

> **风险与缺陷**：进程退出0能否代表Agent任务成功？executeRun以退出码和timeout状态结算并触发成功归档，缺少业务产物断言；attach/archive通过开始时间定位会话的路径还需并发验证。超时直接child.kill不能证明整棵后代进程停止，且Web停机错过时点不补跑，关键任务不能只靠绿色历史。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 场景与替代办法](#detail-section-2)
  - [1.2 能力、流程与依赖](#detail-section-3)
  - [1.3 效果、成本与限制](#detail-section-4)
  - [1.4 核心贡献与工程亮点](#detail-section-5)
  - [1.5 用途与适用场景](#detail-section-6)
  - [1.6 能力、流程与成本](#detail-section-7)
  - [1.7 工程贡献](#detail-section-8)
  - [1.8 使用建议](#detail-section-9)
  - [1.9 核查说明与分析版本](#detail-section-10)
- [2 未来设计假设（未验证）](#detail-section-11)
- [3 辅助信息](#detail-section-12)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 场景与替代办法

需要周期性本机脚本或Agent任务的人，在GUI配置时间、cwd、超时与通知，交付任务输出和运行记录；适用于允许错过时点且宿主持久在线的自动化。

参照系统cron+日志/通知脚本与手动headless DSH；不把外部通知适配归本插件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与依赖

lib/index.js解析cron并周期扫描，spawn shell/python/node或headless DSH；持久化任务与运行记录，输出限512KiB，运行后可推送、挂工作区与归档会话。

- **Host 路由**：任务配置、立即运行与历史输出API。
- **界面**：任务编辑和执行历史。
- **后台**：cron多类型调度、可选通知与会话整理。

持续运行的DSH Web与headless CLI、模型凭据、相关Skill；通知可选pushNotifier或messaging服务，具体可用性需宿主确认。

保存cron及任务→计算触发点→spawn并捕获输出→写历史→可选推送→可选会话分组/成功归档；失败保留输出，停机时点不补跑。

web bundle，任务和历史在DSH_HOME/cron，Agent/Skill使用headless profile；Python需探测可用解释器。

<a id="detail-section-4"></a>

### 1.3 效果、成本与限制

把周期执行和DSH会话管理集中起来，减少手工启动与找日志；不能保证漏跑补偿、幂等或业务成功。

首次需配置工作目录、解释器、headless模型与时区；持续承担模型调用、失败重试、输出复核及历史文件清理。现金由模型和通知渠道决定；人工节省未测，任务断言会增加配置时间。

进程退出0能否代表Agent任务成功？executeRun以退出码和timeout状态结算并触发成功归档，缺少业务产物断言；attach/archive通过开始时间定位会话的路径还需并发验证。超时直接child.kill不能证明整棵后代进程停止，且Web停机错过时点不补跑，关键任务不能只靠绿色历史。

<a id="detail-section-5"></a>

### 1.4 核心贡献与工程亮点

相对系统cron加独立日志脚本，增量是把DSH Skill/Agent与普通脚本放进一个有历史、输出查看和通知的界面，并整理headless会话。cron语法、进程执行与推送服务为既有机制；贡献是统一任务生命周期和DSH交接，而非新调度算法。

输出有界且标截断、任务存储用临时文件rename、调度与执行函数分离便于复用；需区分进程done与业务ok，避免通知和自动归档掩盖验收缺口。

源码依据：[lib/index.js](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js)、[lib/client.js](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/client.js)、[cordis.patch.yml](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/cordis.patch.yml)、[package.json](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/package.json)。

<a id="detail-section-6"></a>

### 1.5 用途与适用场景

> **用途**：需要周期性本机脚本或Agent任务的人，在GUI配置时间、cwd、超时与通知，交付任务输出和运行记录；适用于允许错过时点且宿主持久在线的自动化。

<a id="detail-section-7"></a>

### 1.6 能力、流程与成本

**能力**

- **Host 路由**：任务配置、立即运行与历史输出API。
- **界面**：任务编辑和执行历史。
- **后台**：cron多类型调度、可选通知与会话整理。

> **思考**：进程退出0能否代表Agent任务成功？executeRun以退出码和timeout状态结算并触发成功归档，缺少业务产物断言；attach/archive通过开始时间定位会话的路径还需并发验证。超时直接child.kill不能证明整棵后代进程停止，且Web停机错过时点不补跑，关键任务不能只靠绿色历史。

<a id="detail-section-8"></a>

### 1.7 工程贡献

> **亮点**：相对系统cron加独立日志脚本，增量是把DSH Skill/Agent与普通脚本放进一个有历史、输出查看和通知的界面，并整理headless会话。cron语法、进程执行与推送服务为既有机制；贡献是统一任务生命周期和DSH交接，而非新调度算法。

<a id="detail-section-9"></a>

### 1.8 使用建议

适合可重复、可撤销的个人定时任务；先用不改文件的任务检查时间、工作目录、超时、输出与通知，再尝试写操作，关键任务另配完成检查。

**核查状态**：已抽读固定版本源码，未安装、运行目标插件或真实宿主验收。源码支持多类型调度与记录；脚本执行、真实通知、会话归属及业务结果未验证。未来运行身份与交付断言是假设。

<a id="detail-section-10"></a>

### 1.9 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：0.1.1；版本日期：2026-08-26（固定提交日期，北京时间；不是包发布日期）。
- 固定版本：[99a223ed](https://github.com/534119219/chicheng-cron/tree/99a223edfa090afa2f1f05c77526a53a0f277961)；本次截止 2026-10-21T03:00:27Z。
- 已检查：README、package与以上源码路径及固定组件统计。
- 未执行：目标代码、目标测试、安装、真实宿主或第三方服务验证。
- 范围限制：抽读cron解析、executeRun/spawn、持久化与UI接线；未运行任务或host，不核实任何推送服务实效。
- 证据边界：源码与作者说明不等于独立效果验证；GitHub/npm指标不证明采用或收益。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：44ab7acdce82b04a4772c49ca48c49930b1f0e4a72bd925d8b486d841e1eed6b。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 113 | — | — | 1254 |
| .md | example | 1 | 23 | — | — | 196 |
| .js | source | 2 | 2623 | 2292 | 172 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 2 未来设计假设（未验证）

待验证假设：每次调度生成显式runId并贯穿headless会话、产物与通知，增加任务定义中的输出断言，可减少误归档和“exit0但未交付”。由当前runId记录与基于时间找会话之间的缺口推导。对照并发两次同类Agent、exit0不写产物、超时生成子进程三类任务，验证归属准确率、漏交付率与残留；需要用户定义合格产物，不能自动猜验收。

隔离目录验证跨日时区、重启漏跑、并发Agent的会话归属、exit0无产物、子进程超时与通知失败；本轮不执行目标任务。

<a id="detail-section-12"></a>

## 3 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/534119219/chicheng-cron/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/534119219/chicheng-cron/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/534119219/chicheng-cron/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
