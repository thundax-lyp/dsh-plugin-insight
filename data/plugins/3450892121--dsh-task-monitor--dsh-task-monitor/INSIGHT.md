# 任务监控与 Git 操作面板

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[e628e3e](https://github.com/3450892121/dsh-task-monitor/tree/e628e3ea76cf0f7f0a3489b93c9f00271daeb791/dsh-task-monitor)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/3450892121/dsh-task-monitor)
<!-- END META -->

> **实现功能**：在 DSH 右侧汇总任务活动，并提供 Git 提交、推送与 GitHub 发布入口。

> **核心亮点**：相对翻聊天记录与终端，贡献是按会话聚合技能/MCP/文件/网页并连接Git工作流；将可见活动与工作区状态放到同一面板降低切换。没有发现活动记录自动约束代码验收的机制。

> **风险与缺陷**：最强质疑是“只读监控”边界与实际实现冲突：README安全段称不落盘、不外联、只有只读Git，但index.js:474-505写令牌并实际建/删临时仓库，1053-1103提供写Git和发布路由。环回/工作区检查存在，仍不能把显式UI写操作描述成无副作用。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 使用建议](#detail-section-5)
  - [1.5 核查说明与分析版本](#detail-section-6)
- [2 未来设计假设（未验证）](#detail-section-7)
- [3 辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH Desktop开发者查看会话活动、文件产出和Git状态，必要时手工提交/发布；合格交付物是可回查活动和已核实Git结果，活动计数不等于代码完成。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

参照宿主聊天记录、jobs和Git终端；源码UI与Host聚合是增量，不等于严格任务完成门禁。

宿主分类会话事件、读取工作区Git状态，经/taskmonitor本地POST路由供shell.overlay面板；同一实现还含commit/push/switch、GitHub登录建仓和令牌存储。


依赖DSH desktop/web客户端slots、session、workspaceRegistry、subprocess和Git；GitHub发布另需网络、令牌和仓库权限，自动代理探测也会改变网络路径。安装说明主要Windows本地junction。

面板拉取会话活动→用户打开Git对话框→选择分支/说明/是否含未暂存变更→提交或推送。GitHub登录可导入系统凭据或保存PAT到~/.dsh/task-monitor-github-token；细粒度令牌验证可能建删临时仓库。失败后由用户检查远端和本地HEAD，不应把重试当原操作未发生。

初装涉及本地链接、宿主重启、Git和凭据；运行有Git查询、远端检查和代理探测成本。令牌虽mode0600仍为明文credential-store格式；需备份/清理职责。暂无人时或可靠性收益数据。

价值在减少会话与Git工具之间的切换；无法据此推导更高交付合格率。现有README边界不一致显著增加采用判断成本。

**能力**

- **界面**：独立任务活动面板及Git操作对话框。
- **Host 路由**：本地活动查询、Git提交推送和GitHub授权发布路由。

> **思考**：最强质疑是“只读监控”边界与实际实现冲突：README安全段称不落盘、不外联、只有只读Git，但index.js:474-505写令牌并实际建/删临时仓库，1053-1103提供写Git和发布路由。环回/工作区检查存在，仍不能把显式UI写操作描述成无副作用。

<a id="detail-section-4"></a>

### 1.3 工程贡献

工作区canonical路径注册检查、环回同站校验和push-failed-after-commit部分成功结果值得借鉴。tokenCanCreateRepo在删除失败时吞错，可能留下临时仓库；复制该探测方式前需改成无写验证或显式清理责任。

@local/dsh-task-monitor 0.8.0，private包，主要本地桌面配置；npm热度不适用。README结构描述与当前源码副作用不一致。

固定源码依据：[dsh-task-monitor/index.js L474–505](https://github.com/3450892121/dsh-task-monitor/blob/e628e3ea76cf0f7f0a3489b93c9f00271daeb791/dsh-task-monitor/index.js#L474-L505)；[dsh-task-monitor/index.js L1053–1103](https://github.com/3450892121/dsh-task-monitor/blob/e628e3ea76cf0f7f0a3489b93c9f00271daeb791/dsh-task-monitor/index.js#L1053-L1103)。上述贡献与关键质疑均限定于这些固定源码，不把测试文件存在当运行通过。

> **亮点**：相对翻聊天记录与终端，贡献是按会话聚合技能/MCP/文件/网页并连接Git工作流；将可见活动与工作区状态放到同一面板降低切换。没有发现活动记录自动约束代码验收的机制。

<a id="detail-section-5"></a>

### 1.4 使用建议

仅在读懂当前Git/GitHub写副作用后于临时仓库验证；把监控活动当辅助线索，提交推送仍须核对差异、目标分支和结果。

核查状态：源码支持本文所述机制与有限集成贡献；效果、宿主兼容和独立采用未验证。未来设计假设仅为推演，未实现、未验证。 只执行研究工程的统计/装配与结构验证，未安装插件、运行目标代码/测试或做真实宿主验收。

<a id="detail-section-6"></a>

### 1.5 核查说明与分析版本

**核查状态**：已检查源码。

- 版本依据：仓库：[3450892121/dsh-task-monitor](https://github.com/3450892121/dsh-task-monitor)；固定提交：[e628e3ea](https://github.com/3450892121/dsh-task-monitor/tree/e628e3ea76cf0f7f0a3489b93c9f00271daeb791)；版本号：0.8.0；版本日期：2026-10-10（固定提交日期，北京时间，非包发布日期）。
- 已检查与未覆盖范围：限定dsh-task-monitor组件，核查宿主路由/凭据/写Git与客户端；未创建仓库、写凭据或执行Git动作。
- 证据限制：作者功能摘要来自固定版本README；未核实独立用户采用、同条件效果或端到端收益。版本、证据原文与inventory绑定保存在本项JSON；GitHub/npm统计仅作背景，不构成采用证明。

<a id="detail-section-7"></a>

## 2 未来设计假设（未验证）

待验证假设：将监控视图与写操作能力分开激活，要求每次Git/GitHub操作显示目标仓库、将变文件和远端结果，可能既保留便利又使用户理解副作用。由当前读活动与写权限混在一套入口推导；增加设置和确认负担。

最小验证与否定条件：在临时仓库和测试账号核验只打开面板、登录、提交后推送失败三种路径；要求只打开面板不写Git，用户能辨认令牌存储与登录建删仓行为，部分成功保留真实HEAD。若后台副作用不透明或重试导致重复提交/孤儿仓库，则暂缓采用写功能。

<a id="detail-section-8"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 3182 | 2872 | 169 | — |
| .md | source | 1 | 70 | — | — | 1436 |

排除 0 项；解析错误 0 项。统计为固定Git范围，源码抽读不冒充全面审计；JS/TS与Markdown分别计量。默认排除为启发式，不能从LOC推算原创量或工时。

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/3450892121/dsh-task-monitor/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/3450892121/dsh-task-monitor/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/3450892121/dsh-task-monitor/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
