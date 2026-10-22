# dsh-restart-dock

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[bb74ab5](https://github.com/7gzgn/dsh-restart-dock/tree/bb74ab5d5eafdd97cec75a0be759346fdcacece7)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：在 DSH 显示可拖动贴边的刷新和重启按钮，提供延迟选择与重启状态。

> **核心亮点**：相对找托盘/快捷方式重启，把客户端刷新与宿主重启明确拆成两个界面动作，并加入延迟、状态轮询与进程树报告。独立helper和Windows重拉为既有系统机制，增量是DSH入口及确定目标的恢复接线。

> **风险与缺陷**：延迟倒计时能否保证当前任务安全落盘？代码只等待设定延迟并强停进程，没有宿主排空或会话提交确认；请求来源护栏也只是本地Web信任控制，不证明任何正在执行任务可中断。只实现Windows重启，helper在job/Explorer失败时可能降级；进程回来了仍不证明插件初始化和业务任务已恢复。

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

Windows DSH用户改完宿主插件后主动重载进程，或仅刷新客户端；交付窗口/宿主恢复状态，不承诺继续旧任务。

参照手动托盘重启和独立launcher脚本；与planner的自动排程面向不同入口，未作实测优劣比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与依赖

client以overlay注册小框，刷新调用location.reload，重启经同源自定义头POST；host写pending并spawn PowerShell，relaunch.ps1探测明确进程树、交接独立副本、强停重拉并写报告。

- **Host 路由**：状态、重启与bundle健康接口。
- **界面**：可拖动贴边刷新/重启小框及延迟选择。
- **后台**：Windows独立helper强停与原命令重拉。

DSH webServer/overlay槽位、Windows WMI/PowerShell/Explorer及原可执行命令；请求自定义头与同源判定需宿主网络部署吻合。

用户选刷新或重启→选择延迟/取消→host确认来源和平台→pending/helper→强停指定树→重拉原命令→status恢复后客户端刷新；不自动投继续消息。

DSH>=0.2.1-rc.2声明，Windows PowerShell；其他平台重启返回501，刷新可用，源码说明的作者实测未复现。

<a id="detail-section-4"></a>

### 1.3 效果、成本与限制

减少寻找重启入口的摩擦，但不能替代优雅退出、会话保存或自动续话。

首次确认平台、原命令与helper存活；每次重启打断活动任务且需人工复核恢复，现金无新增服务证据，停机/返工时间未测。

延迟倒计时能否保证当前任务安全落盘？代码只等待设定延迟并强停进程，没有宿主排空或会话提交确认；请求来源护栏也只是本地Web信任控制，不证明任何正在执行任务可中断。只实现Windows重启，helper在job/Explorer失败时可能降级；进程回来了仍不证明插件初始化和业务任务已恢复。

<a id="detail-section-5"></a>

### 1.4 核心贡献与工程亮点

相对找托盘/快捷方式重启，把客户端刷新与宿主重启明确拆成两个界面动作，并加入延迟、状态轮询与进程树报告。独立helper和Windows重拉为既有系统机制，增量是DSH入口及确定目标的恢复接线。

目标由显式CallerPid/TargetPid而非全局按名杀、inFlight锁有过期、报告保留失败阶段值得借鉴；PowerShell交接与宿主状态需要真实平台验证。

源码依据：[lib/index.js](https://github.com/7gzgn/dsh-restart-dock/blob/bb74ab5d5eafdd97cec75a0be759346fdcacece7/lib/index.js)、[lib/relaunch.ps1](https://github.com/7gzgn/dsh-restart-dock/blob/bb74ab5d5eafdd97cec75a0be759346fdcacece7/lib/relaunch.ps1)、[client.js](https://github.com/7gzgn/dsh-restart-dock/blob/bb74ab5d5eafdd97cec75a0be759346fdcacece7/client.js)、[package.json](https://github.com/7gzgn/dsh-restart-dock/blob/bb74ab5d5eafdd97cec75a0be759346fdcacece7/package.json)。

<a id="detail-section-6"></a>

### 1.5 用途与适用场景

> **用途**：Windows DSH用户改完宿主插件后主动重载进程，或仅刷新客户端；交付窗口/宿主恢复状态，不承诺继续旧任务。

<a id="detail-section-7"></a>

### 1.6 能力、流程与成本

**能力**

- **Host 路由**：状态、重启与bundle健康接口。
- **界面**：可拖动贴边刷新/重启小框及延迟选择。
- **后台**：Windows独立helper强停与原命令重拉。

> **思考**：延迟倒计时能否保证当前任务安全落盘？代码只等待设定延迟并强停进程，没有宿主排空或会话提交确认；请求来源护栏也只是本地Web信任控制，不证明任何正在执行任务可中断。只实现Windows重启，helper在job/Explorer失败时可能降级；进程回来了仍不证明插件初始化和业务任务已恢复。

<a id="detail-section-8"></a>

### 1.7 工程贡献

> **亮点**：相对找托盘/快捷方式重启，把客户端刷新与宿主重启明确拆成两个界面动作，并加入延迟、状态轮询与进程树报告。独立helper和Windows重拉为既有系统机制，增量是DSH入口及确定目标的恢复接线。

<a id="detail-section-9"></a>

### 1.8 使用建议

Windows上需要手动重载插件的人先检查没有任务写入；先验证状态与取消、保留工作，再测试重启，macOS/Linux只期待刷新。

**核查状态**：已抽读固定版本源码，未安装、运行目标插件或真实宿主验收。源码确认UI、请求护栏及Windows进程流程；未执行重启或验证真实进程存活，未来会话排空假设未验证。

<a id="detail-section-10"></a>

### 1.9 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：0.1.3；版本日期：2026-10-20（固定提交日期，北京时间；不是包发布日期）。
- 固定版本：[bb74ab5d](https://github.com/7gzgn/dsh-restart-dock/tree/bb74ab5d5eafdd97cec75a0be759346fdcacece7)；本次截止 2026-10-21T03:36:14Z。
- 已检查：README、package与以上源码路径及固定组件统计。
- 未执行：目标代码、目标测试、安装、真实宿主或第三方服务验证。
- 范围限制：抽读host/client及PowerShell目标探测/重拉；未调用任何重启接口、脚本或进程操作。
- 证据边界：源码与作者说明不等于独立效果验证；GitHub/npm指标不证明采用或收益。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：4933f38b09112153190d428a91bb5973d9d7f94ae8c03209407e6382e25d6d39。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1306 | 1009 | 200 | — |
| .md | source | 1 | 118 | — | — | 1609 |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 2 未来设计假设（未验证）

待验证假设：重启前让宿主报告活动任务和持久化屏障，并给用户明确“强制/等待”的选择，可减少延迟够了但会话仍写入的中断。依据是当前时间等待与状态轮询，未实现屏障。用持续日志写入、后台子进程和空闲三类对照，测丢失事件、恢复时间与取消有效性；屏障不可达时需明确强制语义。

隔离Windows测试取消、job交接、目标失效、子进程残留、重拉失败与活动会话落盘；本轮仅源码。

<a id="detail-section-12"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/7gzgn/dsh-restart-dock/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
