# dsh-domain-bridge

> 为 DSH 顶层会话提供域寻址、职责交接、分级暂停和模型选择。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[8ef0119](https://github.com/1Lany2a/dsh-domain-role/tree/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge)

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/1Lany2a/dsh-domain-role) [![npm 30d 372](https://img.shields.io/static/v1?label=npm+30d&message=372&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-domain-bridge) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-domain-bridge)
<!-- END META -->

**使用建议**：确有顶层会话分工时可评估；先明确谁负责确认任务接受与完成，不能仅凭delivered回执或暂停标记承担业务验收与系统禁用保证。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：多个顶层会话按项目/领域分工，由域声明定位负责人，在暂停期间保留待交接消息；合格交付应含任务接受与完成确认。

- **建议**：将消息业务ID与收件方接受/完成回执绑定，以单写者队列或版本条件提交状态，可能降低恢复重投的重复执行。用投递后进程中断、状态更新同时追加、并发撤回及坏政策文件反例，核对每业务ID最多执行一次且未知状态不自动重发；若只有投递日志而无收件幂等，则不能称办结保证。

确有顶层会话分工时可评估；先明确谁负责确认任务接受与完成，不能仅凭delivered回执或暂停标记承担业务验收与系统禁用保证。

核查状态：域寻址、四级政策和队列接线源码支持；并发消息可靠性与任务办结未验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

宿主子树消息、人工复制或成熟任务队列；本项针对顶层域协作，可靠消息和业务完成协议仍需补充。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：11项顶层会话/域声明/消息/暂停/模型分派工具。
- **用户命令**：register、initialize、handoff、retire、pause、resume、pause-all七命令。
- **Host 路由**：popup菜单和命令执行/健康路径。
- **界面**：域操作弹窗菜单。
- **后台**：暂停消息JSONL存储与恢复投递。

**流程与依赖**

bridge构建11个工具定义并让命令复用；域声明优先寻址，发送/接收端四级暂停OR叠加。拦截消息append至目标JSONL，恢复重评政策再投递并重写状态；七条命令与popup共用注册路径，含/resume。模型操作区分会话选择与全局默认。

DSH agents/sessionController、commands/webServer可选、可写home/state、域注册表与owner CLI接线；离线唤醒依赖模型/权限配置，新会话默认workspace-write。

认领域→解析目标→检查双端政策→投递或排队→人工恢复→重评全部作用域→投递并改状态；撤回仅pending，force越过政策时回执留痕，任务执行另行确认。

组件包以lib/bridge.js加载，runtime home/config/index等为外部配置；不把整仓其他框架脚本计组件原创与LOC，宿主服务缺失回api-unavailable。

**效果与成本**

现金随followup/steer触发模型回合，inject仅上下文不保证立即处理；人工是登记职责、冲突交接、坏文件处理、回执及重复执行核对。需维护home/state及注册表，不具实测单位任务收益。

减少人肉转发并把负责人和暂停原因显式化；收益取决于声明及时更新及收件方独立验收。

- **思考**：落盘能否保证交接不丢不重？若多个进程共享stateDir，append的追加与updateInboxStatus的整文件.tmp重写之间未见跨进程锁或版本条件，可能覆盖其他写者的新消息；投递后再落delivered也有崩溃窗口。暂停文件坏读降级paused=false虽报告error，仍可能放行。delivered只指消息送入，不是收件方接受任务或完成，GUI/宿主直接恢复又不受此政策控制。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相较宿主父子树内通信与人工转发，补充顶层职责声明、受政策约束的交接及可查询回执；把在线事实、暂停政策、生命周期分开，避免暂停等同离线。真正增量是协作寻址与责任入口，非通用可靠队列或系统级暂停。

相较宿主父子树内通信与人工转发，补充顶层职责声明、受政策约束的交接及可查询回执；把在线事实、暂停政策、生命周期分开，避免暂停等同离线。真正增量是协作寻址与责任入口，非通用可靠队列或系统级暂停。

命令/弹窗复用同一工具定义，避免多实现分叉；七命令注入作用域返回disposer减少HMR旧路由；队列冻结原信封和结构化发件人，恢复不重写业务语义。坏状态文件与并发重写仍需明确取舍。

固定源码依据：[plugins/dsh-domain-bridge/lib/bridge.js](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/lib/bridge.js)、[plugins/dsh-domain-bridge/lib/core/messaging.js](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/lib/core/messaging.js)、[plugins/dsh-domain-bridge/lib/core/pause.js](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/lib/core/pause.js)、[plugins/dsh-domain-bridge/lib/core/commands.js](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/lib/core/commands.js)、[plugins/dsh-domain-bridge/lib/core/registrations.js](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/lib/core/registrations.js)、[plugins/dsh-domain-bridge/package.json](https://github.com/1Lany2a/dsh-domain-role/blob/8ef0119937f5f9d18a0628a891dd086db6522834/plugins/dsh-domain-bridge/package.json)。

<a id="detail-section-5"></a>

### 主要限制

落盘能否保证交接不丢不重？若多个进程共享stateDir，append的追加与updateInboxStatus的整文件.tmp重写之间未见跨进程锁或版本条件，可能覆盖其他写者的新消息；投递后再落delivered也有崩溃窗口。暂停文件坏读降级paused=false虽报告error，仍可能放行。delivered只指消息送入，不是收件方接受任务或完成，GUI/宿主直接恢复又不受此政策控制。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：0.8.5；版本日期：2026-10-21（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[8ef01199](https://github.com/1Lany2a/dsh-domain-role/tree/8ef0119937f5f9d18a0628a891dd086db6522834)；本轮基准：2026-10-21T07:52:12Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：仅plugins/dsh-domain-bridge组件，入口/注册、消息存储、暂停、命令与运行时配置接线；未核外部owner CLI实现。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

将消息业务ID与收件方接受/完成回执绑定，以单写者队列或版本条件提交状态，可能降低恢复重投的重复执行。用投递后进程中断、状态更新同时追加、并发撤回及坏政策文件反例，核对每业务ID最多执行一次且未知状态不自动重发；若只有投递日志而无收件幂等，则不能称办结保证。

未运行目标。最小验证用双会话、稳定业务ID覆盖暂停/恢复、并发状态更新和未知投递，分别测消息到达、任务接受与实际执行次数。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 1039 | — | — | 24042 |
| .js | source | 12 | 9457 | 7292 | 1720 | — |
| .mjs | test | 6 | 6637 | 5614 | 547 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1Lany2a/dsh-domain-role/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/1Lany2a/dsh-domain-role/issues?q=is%3Aissue+created%3A2026-09-21T07%3A58%3A47.280Z..2026-10-21T07%3A58%3A47.280Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1Lany2a/dsh-domain-role/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T07%3A58%3A47.280Z..2026-10-21T07%3A58%3A47.280Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
