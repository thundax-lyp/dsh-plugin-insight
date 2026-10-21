# ETeams

> 为 DeepSeek Harness 提供领队拆解、成员子会话接力和任务看板。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[cd6bc01](https://github.com/2507483326/dsh-eteams/tree/cd6bc01ae511901e26c2b47d0a71e471dce262fd)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/2507483326/dsh-eteams) · [![npm 30d 1445](https://img.shields.io/static/v1?label=npm+30d&message=1%2C445&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-eteams)
<!-- END META -->

**使用建议**：适合可拆分且验收条件清晰的任务；先用无外部副作用的任务验证重启、唤醒失败和重复汇报处理，再评估长期使用。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [核查说明与分析版本](#detail-section-5)
- [未来设计假设（未验证）](#detail-section-6)
- [辅助信息](#detail-section-7)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：需要多个角色接力完成代码或文档任务的用户，将验收条件与成员职责落实到可追踪任务；交付应是通过合同验收的成果。

适合可拆分且验收条件清晰的任务；先用无外部副作用的任务验证重启、唤醒失败和重复汇报处理，再评估长期使用。

**核查状态**：已实现机制有源码支持；贡献价值为条件性解释，未来设计假设未验证。本轮仅作固定版本源码核查，未安装、运行目标代码或验收宿主。

<a id="detail-section-3"></a>

### 能力、流程与成本

参照手工建立多个会话并人工转交任务，未完整比较其他多Agent框架，不主张全球独创。

任务、attempt、事件和邮件持久化到SQLite；锁内同步事务提交状态，提交后异步唤醒；独立子会话执行、角色模型路由与启动存活对账组成调度闭环。


Node内置node:sqlite和DSH agents/sessions等宿主服务；成员需要配置模型；持久数据库和工作目录需可写。

建立角色和团队，领队创建有验收条件的任务，执行链派发子会话，成员领取并报告，事务写入事件/邮件后唤醒后续成员；启动期对账处理残余在办尝试。

现金主要是多成员模型调用，人工包括角色与合同配置、冲突协调、失败重试和验收；SQLite迁移及宿主API变动形成持续维护成本。

将隐藏交接显式化便于追责与恢复；成员数量、事件数量和完成状态不证明最终成果达标。

- **后台**：合同、执行链、成员尝试和持久邮件；SQLite状态及启动期在办会话对账

- **思考**：持久任务状态能否可靠区分会话死亡与观测失败？reconcile.liveAgentIds在服务缺失或抛错时返回空集合，超过60秒宽限的在办attempt会被挂起。该分支可能把宿主暂时不可观测写成业务状态；没有实测故障注入，不能宣称重启恢复无误。

<a id="detail-section-4"></a>

### 工程贡献

assignment将同步事务和异步spawn/wake分开，事件与邮箱同事务落库；db保留迁移版本与WAL设置。可借鉴提交后唤醒模式，但需要审查未知结果与重复执行边界，不能只复制状态机。 源码依据：[src/host/runtime/assignment.ts](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/assignment.ts#L138)、[src/host/runtime/reconcile.ts](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/runtime/reconcile.ts#L66)、[src/host/state/db.ts](https://github.com/2507483326/dsh-eteams/blob/cd6bc01ae511901e26c2b47d0a71e471dce262fd/src/host/state/db.ts#L86)。

- **亮点**：相对手工多会话交接，增量是将合同、执行链、尝试令牌及交接邮件纳入一致状态，再异步唤醒成员；唤醒失败不回滚已提交邮件，保留后续读取机会。并非仅用角色提示词模拟团队。

<a id="detail-section-5"></a>

### 核查说明与分析版本

- **仓库**：[2507483326/dsh-eteams](https://github.com/2507483326/dsh-eteams)
- **版本号**：0.2.21（[固定提交 cd6bc01](https://github.com/2507483326/dsh-eteams/tree/cd6bc01ae511901e26c2b47d0a71e471dce262fd)）
- **版本日期**：2026-09-22（固定提交日期，北京时间；不是包发布日期）
- **实际范围**：固定提交源码抽读与作者材料核查；没有执行目标代码、测试、安装或真实宿主验收，没有确认独立用户效果。
- **来源**：作者README与上述固定版本源码；未确认独立采用效果，目录收录与下载统计不作效果证据。

<a id="detail-section-6"></a>

## 未来设计假设（未验证）

待验证假设：存活对账采用存活/死亡/未知三态，未知只记录观测故障，连续权威缺席后才暂停任务，可降低恢复期误挂起；由现有事务状态与空集合降级反例推导，代价是更迟发现真实死亡。

最小验证：注入agents.list抛错、延迟注册、真实死亡及重复邮件，比较现有空集合方案与三态对账的误暂停率、检测延迟和重复副作用；若误暂停不降或死亡延迟不可接受则否定。

<a id="detail-section-7"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 18 | 3433 | — | — | 128614 |
| .mjs | source | 11 | 883 | 616 | 208 | — |
| .cjs | source | 6 | 209 | 185 | 23 | — |
| .ts | source | 110 | 31122 | 21522 | 8194 | — |
| .tsx | source | 68 | 14256 | 9579 | 4318 | — |
| .ts | test | 53 | 19078 | 15907 | 1891 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2507483326/dsh-eteams/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/2507483326/dsh-eteams/issues?q=is%3Aissue+created%3A2026-09-21T02%3A00%3A40.637Z..2026-10-21T02%3A00%3A40.637Z)

暂未获取：近30天关闭。

统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
