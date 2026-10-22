# dsh-restart-planner

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[31562ec](https://github.com/7gzgn/dsh-restart-planner/tree/31562ec5555d6e93a81c251b39d173b5d80c03c6)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：让 DSH Agent 排程宿主重启，由独立 helper 等待、重拉、体检并可投递继续提示。

> **核心亮点**：相对Agent要求用户手动重启，贡献是把自重启拆为排程、独立交接和重拉体检，使调用方可先返回。自动续接参考dsh-restart思路，适配0.2的sessionController.prompt；进程管理能力来自系统，新增是DSH恢复生命周期与报告。

> **风险与缺陷**：日志静默是否等于会话安全提交，续话是否恰好一次？静默是时间启发式，maxWait到期仍可动手；强杀不能保证最后写入。resume每次尝试生成新requestId，网络超时可能已接受，deliverResume会重试；成功后删标记失败又会再次投，因此“失败保留”不能宣称无重放。健康检查也不证明原任务业务恢复。

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

Agent安装或修改插件后需要无人值守重载，先返回安排，再由宿主外helper重启并留报告；原任务续接需要核对结果。

参照人工重启、launcher脚本和dsh-restart的续接思路；不以作者测试通过数证明当前平台可靠。

<a id="detail-section-3"></a>

### 1.2 能力、流程与依赖

core构造显式目标计划与授权标记，Windows经Explorer交接helper、POSIX detached；helper延迟/等日志静默后强停重拉；resume保存会话标记，启动后用sessionController.prompt queue投递。

- **模型工具**：self_restart排程/状态/取消/续接。
- **后台**：独立helper、重拉体检和启动续话标记。

DSH tools/userQuestions/sessionController及模型会话，Windows PowerShell/Explorer或POSIX进程；日志目录静默依赖宿主写入行为。

Agent排程→可选询问→解析目标/写授权→helper报到→延迟和静默等待→强停/重拉/体检→新宿主读resume→queue继续→删标记；错误保留日志。

零第三方运行依赖的工具/CLI，DSH0.2范围；作者Windows实测，macOS/Linux未实测，不能把代码存在当平台通过。

<a id="detail-section-4"></a>

### 1.3 效果、成本与限制

减少等待人工重启的阻塞，但进程存活与端口健康不等于业务继续成功。

首次核对目标、launcher、恢复会话与权限；每次停机、强杀和续接复核增加人工成本，现金无新增必需服务，无恢复时延独立测量。

日志静默是否等于会话安全提交，续话是否恰好一次？静默是时间启发式，maxWait到期仍可动手；强杀不能保证最后写入。resume每次尝试生成新requestId，网络超时可能已接受，deliverResume会重试；成功后删标记失败又会再次投，因此“失败保留”不能宣称无重放。健康检查也不证明原任务业务恢复。

<a id="detail-section-5"></a>

### 1.4 核心贡献与工程亮点

相对Agent要求用户手动重启，贡献是把自重启拆为排程、独立交接和重拉体检，使调用方可先返回。自动续接参考dsh-restart思路，适配0.2的sessionController.prompt；进程管理能力来自系统，新增是DSH恢复生命周期与报告。

dry-run不放helper、临时目录闸、显式目标和授权文件、取消标记有价值；resume写删与随机请求ID缺稳定幂等，复用需重新设计未知结果处理。

源码依据：[lib/index.js](https://github.com/7gzgn/dsh-restart-planner/blob/31562ec5555d6e93a81c251b39d173b5d80c03c6/lib/index.js)、[lib/core.js](https://github.com/7gzgn/dsh-restart-planner/blob/31562ec5555d6e93a81c251b39d173b5d80c03c6/lib/core.js)、[lib/resume.js](https://github.com/7gzgn/dsh-restart-planner/blob/31562ec5555d6e93a81c251b39d173b5d80c03c6/lib/resume.js)、[lib/plan.js](https://github.com/7gzgn/dsh-restart-planner/blob/31562ec5555d6e93a81c251b39d173b5d80c03c6/lib/plan.js)、[lib/helper.mjs](https://github.com/7gzgn/dsh-restart-planner/blob/31562ec5555d6e93a81c251b39d173b5d80c03c6/lib/helper.mjs)、[lib/helper.ps1](https://github.com/7gzgn/dsh-restart-planner/blob/31562ec5555d6e93a81c251b39d173b5d80c03c6/lib/helper.ps1)、[package.json](https://github.com/7gzgn/dsh-restart-planner/blob/31562ec5555d6e93a81c251b39d173b5d80c03c6/package.json)。

<a id="detail-section-6"></a>

### 1.5 用途与适用场景

> **用途**：Agent安装或修改插件后需要无人值守重载，先返回安排，再由宿主外helper重启并留报告；原任务续接需要核对结果。

<a id="detail-section-7"></a>

### 1.6 能力、流程与成本

**能力**

- **模型工具**：self_restart排程/状态/取消/续接。
- **后台**：独立helper、重拉体检和启动续话标记。

> **思考**：日志静默是否等于会话安全提交，续话是否恰好一次？静默是时间启发式，maxWait到期仍可动手；强杀不能保证最后写入。resume每次尝试生成新requestId，网络超时可能已接受，deliverResume会重试；成功后删标记失败又会再次投，因此“失败保留”不能宣称无重放。健康检查也不证明原任务业务恢复。

<a id="detail-section-8"></a>

### 1.7 工程贡献

> **亮点**：相对Agent要求用户手动重启，贡献是把自重启拆为排程、独立交接和重拉体检，使调用方可先返回。自动续接参考dsh-restart思路，适配0.2的sessionController.prompt；进程管理能力来自系统，新增是DSH恢复生命周期与报告。

<a id="detail-section-9"></a>

### 1.8 使用建议

需要自动重载的维护者先在隔离宿主看计划与报告；显式确认任务可中断、保留工作，先关自动续话检查重拉，再验证未知结果不重复投递。

**核查状态**：已抽读固定版本源码，未安装、运行目标插件或真实宿主验收。源码确认排程、取消、dry-run与恢复标记；未运行helper或真实宿主，作者Windows实测未复现；恢复去重设计是假设。

<a id="detail-section-10"></a>

### 1.9 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：0.4.6；版本日期：2026-10-18（固定提交日期，北京时间；不是包发布日期）。
- 固定版本：[31562ec5](https://github.com/7gzgn/dsh-restart-planner/tree/31562ec5555d6e93a81c251b39d173b5d80c03c6)；本次截止 2026-10-21T03:36:14Z。
- 已检查：README、package与以上源码路径及固定组件统计。
- 未执行：目标代码、目标测试、安装、真实宿主或第三方服务验证。
- 范围限制：抽读index/core/resume、helper流程与计划；不运行状态脚本、dry-run或真实重启，跨平台和持久化保证未验证。
- 证据边界：源码与作者说明不等于独立效果验证；GitHub/npm指标不证明采用或收益。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：1e082ebdbe5400f70c8c739848a12cccba0d5b522f1e85dd2cd3240c6fc3e3a5。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 3 | 722 | 597 | 76 | — |
| .js | source | 4 | 1672 | 1122 | 457 | — |
| .md | source | 1 | 220 | — | — | 2908 |
| .mjs | example | 2 | 93 | 60 | 22 | — |
| .mjs | test | 1 | 694 | 560 | 85 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 2 未来设计假设（未验证）

待验证假设：每个排程持久化唯一resume requestId，并在未知结果先查询原请求、获落盘屏障后才重启，可减少续话重复与末尾事件丢失。由当前随机ID重试和静默观察推导，未实现。用prompt已接受但响应丢失、标记删除失败、持续写日志三类对照，测重复turn、遗漏与等待；宿主不支持查询时应保留unknown请人核对。

隔离宿主验证helper跨树存活、取消、目标退出、持续日志、超时未知、重复resume与标记删除失败；本轮无执行。

<a id="detail-section-12"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/7gzgn/dsh-restart-planner/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
