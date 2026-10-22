# dsh-auto-shutdown

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[a2af408](https://github.com/873360545/dsh-auto-shutdown/tree/a2af408455e31a0acf4021e3383d1384dcb7aebc)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：在Windows设置中启用一次性触发，在根会话轮次结束后安排关机并提供取消倒计时。

> **核心亮点**：相对人工守候后关机，增量是将root轮次边界、单次锁存和原生取消窗口组合为可配置交接；系统关机命令是既有能力，插件贡献在触发条件与用户干预入口。

> **风险与缺陷**：“一次且重启不再触发”是否保证？disarm捕获settings写入错误后仍继续scheduleShutdown，持久开关可能仍为true；turn-stopping也不证明业务任务成功或待保存数据完成。fired只在当前进程防重复，不能把它当跨重启事务锁。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Windows用户让Agent运行任务后离开，希望结束时关机；合格行为是仅在授权会话真正到达合适终点、其它工作可保存时安排一次，并能可靠取消。

手工shutdown计时简单但无法看任务状态；插件增加事件触发与取消入口，也引入事件语义和持久化失败风险。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **事件监听**：root agent/turn-stopping触发一次性计划。
- **界面**：通用设置开关和原生取消倒计时窗口。

**流程与依赖**

Windows shutdown.exe、PowerShell、DSH>=0.2.1作者声明的agents/settings事件；取消弹窗依赖交互桌面，后台会话与权限仍需宿主验证。

用户启用并选延迟，root轮次停下且其它Agent未running时尝试复位开关、安排关机并显示取消窗口；用户取消执行shutdown /a，关闭窗口则继续原计划。

**效果与成本**

无模型额外调用；首次确定延迟与取消方式，关机会影响整机其它任务。真实节电和等待时间未测，错误触发的恢复成本可能超过便利。

可减少任务后人工守候，但只看到Agent轮次边界，不能保证业务办结与全机空闲。

> **思考**：“一次且重启不再触发”是否保证？disarm捕获settings写入错误后仍继续scheduleShutdown，持久开关可能仍为true；turn-stopping也不证明业务任务成功或待保存数据完成。fired只在当前进程防重复，不能把它当跨重启事务锁。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对人工守候后关机，增量是将root轮次边界、单次锁存和原生取消窗口组合为可配置交接；系统关机命令是既有能力，插件贡献在触发条件与用户干预入口。

相对人工守候后关机，增量是将root轮次边界、单次锁存和原生取消窗口组合为可配置交接；系统关机命令是既有能力，插件贡献在触发条件与用户干预入口。

同步锁存避免同进程事件并发触发，绝对SystemRoot路径降低PATH歧义；弹窗只负责取消而不再次安排也清晰。关键维护点是持久复位必须成为外部动作前置条件，错误日志不能替代阻断。 源码依据：[lib/index.js](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/lib/index.js)、[lib/popup.js](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/lib/popup.js)、[assets/notify.ps1](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/assets/notify.ps1)、[lib/client.js](https://github.com/873360545/dsh-auto-shutdown/blob/a2af408455e31a0acf4021e3383d1384dcb7aebc/lib/client.js)。

<a id="detail-section-5"></a>

### 1.4 主要限制

“一次且重启不再触发”是否保证？disarm捕获settings写入错误后仍继续scheduleShutdown，持久开关可能仍为true；turn-stopping也不证明业务任务成功或待保存数据完成。fired只在当前进程防重复，不能把它当跨重启事务锁。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用作者提供的dryrun路径在临时环境检查事件和复位，不直接在有未保存任务的主机启用。确认取消命令与设置写入失败行为后再决定使用。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[873360545/dsh-auto-shutdown](https://github.com/873360545/dsh-auto-shutdown)
- **版本号**：0.3.0（[固定提交 a2af4084](https://github.com/873360545/dsh-auto-shutdown/tree/a2af408455e31a0acf4021e3383d1384dcb7aebc)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/popup.js、assets/notify.ps1、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：仅在隔离mock/dryrun验证root/子Agent、其它running、设置写失败、同进程重启和取消失败分支；真实关机测试需专用空闲机器另行安排。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由持久复位与外部关机分离推导，可在复位失败时停止安排关机，并将触发限定为用户选定会话与显式完成标记，保留可观察的计划ID。未验证假设是减少错误时机关机；模拟设置写失败、失败轮、其它应用未保存和重启，若仍出现未经条件满足的计划则否定。

仅在隔离mock/dryrun验证root/子Agent、其它running、设置写失败、同进程重启和取消失败分支；真实关机测试需专用空闲机器另行安排。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：260b66a172055c98d892a35f2fa7a78990b0d7f78ddd189b854d304f2782d128。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 363 | 282 | 53 | — |
| .md | source | 1 | 148 | — | — | 1020 |
| .mjs | source | 1 | 130 | 111 | 7 | — |
| .mjs | test | 1 | 78 | 68 | 7 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/873360545/dsh-auto-shutdown/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/873360545/dsh-auto-shutdown/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/873360545/dsh-auto-shutdown/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
