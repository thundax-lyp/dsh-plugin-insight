# dsh-domain-bridge

> 为 DSH 顶层会话提供域寻址、消息投递、分级暂停与模型分派。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[e948e99](https://github.com/1Lany2a/dsh-domain-role/tree/e948e99bf82747965084673a9d10d41b88bab974/plugins/dsh-domain-bridge)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/1Lany2a/dsh-domain-role) [![npm 30d 372](https://img.shields.io/static/v1?label=npm+30d&message=372&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-domain-bridge) [![首次发布 2026-10-18](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-domain-bridge)
<!-- END META -->

**使用建议**：适合确有顶层会话分工的项目；先用无副作用消息验证暂停与恢复，正式任务自行加完成确认和幂等标识。

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

贡献机制有固定源码支持；效果与采用收益为条件性解释，后续设计假设尚未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：多个顶层会话按项目领域分工，需要明确负责人和暂停期间可追踪消息；交付是有回执的任务交接。

采用建议：适合确有顶层会话分工的项目；先用无副作用消息验证暂停与恢复，正式任务自行加完成确认和幂等标识。

参照原生父子代理通讯和人工顶层会话信使；没有对其他分布式任务队列做可靠性比较。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：send_to_domain、claim_domain、set_domain_state、withdraw_domain_message（源码定义）
- **后台**：顶层域寻址与四级暂停队列

**流程与依赖**

需要声明范围内 DSH agents/sessionController 与可写 home/state、域注册表；框架脚本属于外部共享工具，不能仅看组件包就保证完整体系安装。

注册域负责人，发送时解析声明并检查四级政策；暂停则排队，可撤回；恢复重评全部作用域并投递；离线唤醒需要模型接线，用户仍负责交接内容与完成验收。

**效果与成本**

持久化队列和注册表需维护；followup/steer 可触发模型回合，inject 仅注入不代表立刻处理。人工包括冲突裁决、失效声明和任务回执核对。

减少人肉转发并明确负责人的价值较具体；交付责任仍在任务执行者，通讯成功不是任务成功。

- **思考**：“落盘队列”是否等于可靠交接最关键。messaging.js 的 delivered 表示投递成功，不是收件方完成；rewriteInbox 用固定 .tmp 重写，不能从原子 rename 推出多写者事务保证。暂停也拦不住 GUI 或宿主直接 resume，因此不能承诺系统级停机。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对宿主子树内通讯及人工搬运，实际补上顶层会话寻址和职责声明；把在线事实、暂停政策、终结生命周期分开，避免将暂停误作离线。不是全局调度器，约束只覆盖插件介导路径。

相对宿主子树内通讯及人工搬运，实际补上顶层会话寻址和职责声明；把在线事实、暂停政策、终结生命周期分开，避免将暂停误作离线。不是全局调度器，约束只覆盖插件介导路径。

core/pause.js 将scope/key显式分离并在恢复时重评 OR，值得借鉴政策与事实分离；core/messaging.js 的队列重写和撤回路径需要并发验证，不能把其他注册表的锁保证迁移到 inbox。 源码：[plugins/dsh-domain-bridge/lib/core/messaging.js](https://github.com/1Lany2a/dsh-domain-role/blob/e948e99bf82747965084673a9d10d41b88bab974/plugins/dsh-domain-bridge/lib/core/messaging.js)、[plugins/dsh-domain-bridge/lib/core/pause.js](https://github.com/1Lany2a/dsh-domain-role/blob/e948e99bf82747965084673a9d10d41b88bab974/plugins/dsh-domain-bridge/lib/core/pause.js)、[plugins/dsh-domain-bridge/lib/bridge.js](https://github.com/1Lany2a/dsh-domain-role/blob/e948e99bf82747965084673a9d10d41b88bab974/plugins/dsh-domain-bridge/lib/bridge.js)。

<a id="detail-section-5"></a>

### 主要限制

“落盘队列”是否等于可靠交接最关键。messaging.js 的 delivered 表示投递成功，不是收件方完成；rewriteInbox 用固定 .tmp 重写，不能从原子 rename 推出多写者事务保证。暂停也拦不住 GUI 或宿主直接 resume，因此不能承诺系统级停机。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 plugins/dsh-domain-bridge/lib/core/messaging.js、plugins/dsh-domain-bridge/lib/core/pause.js、plugins/dsh-domain-bridge/lib/bridge.js 及固定范围 inventory；组件：plugins/dsh-domain-bridge。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定提交的所列核心实现与作者材料；未运行插件、安装、测试或真实宿主验收，未确认独立用户效果。
- 下一步：双会话交接同一带副作用任务，在暂停恢复、投递后崩溃与并发撤回中检查队列、执行次数和回执；若不能由稳定业务ID去重则不把“已投递”升级为办结保证。

**分析版本**

- **仓库**：[1Lany2a/dsh-domain-role](https://github.com/1Lany2a/dsh-domain-role)
- **版本号**：0.8.4（[固定提交 e948e99](https://github.com/1Lany2a/dsh-domain-role/tree/e948e99bf82747965084673a9d10d41b88bab974)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：增加消息业务ID与收件方完成回执，区分已投递/已接受/已完成，能减少恢复时重复执行。源自当前队列状态和投递语义的差距；需要收件方幂等登记，增加持久化与清理负担。

双会话交接同一带副作用任务，在暂停恢复、投递后崩溃与并发撤回中检查队列、执行次数和回执；若不能由稳定业务ID去重则不把“已投递”升级为办结保证。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 980 | — | — | 22345 |
| .js | source | 12 | 8980 | 6897 | 1649 | — |
| .mjs | test | 5 | 6340 | 5365 | 524 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/1Lany2a/dsh-domain-role/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
