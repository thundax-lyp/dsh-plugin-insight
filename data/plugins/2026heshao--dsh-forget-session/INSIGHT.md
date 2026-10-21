# dsh-forget-session

> 在 DSH 会话菜单中遗忘会话，清理活动会话、日志目录与投影缓存并复查残留。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[64796c9](https://github.com/2026heshao/dsh-forget-session/tree/64796c9b1423972ae54d2cfa230acc6c4d546c0e)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-forget-session) [![npm 30d 283](https://img.shields.io/static/v1?label=npm+30d&message=283&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-forget-session) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-forget-session)
<!-- END META -->

**使用建议**：只在备份过的可丢弃会话上先验证删除后刷新、重启和守卫结束状态；需要可恢复整理时优先归档。保留告警并核对工件清理，不把成功提示当数据全部擦除证明。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
  - [源码索引](#detail-section-7)
- [未来设计假设（未验证）](#detail-section-8)
- [辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

源码支持跨活体/持久层的清理编排；无法据此保证所有副本、并发写入或第三方记忆都被删除。删除对账假设未实现，未执行任何真实删除。

[重点创新推演与最小验证](#innovation)

- **用途**：面向明确需要删除本地会话痕迹的用户；交付物是会话不再出现在列表且对应本地工件已清理的可核查结果。

采用建议：只在备份过的可丢弃会话上先验证删除后刷新、重启和守卫结束状态；需要可恢复整理时优先归档。保留告警并核对工件清理，不把成功提示当数据全部擦除证明。

参照宿主归档、手工rm目录和只移除UI行；本项解决多层残留和重建，不应与可恢复回滚或法规意义的数据销毁等同。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **Host 路由**：Typert delete会话遗忘与工件清理
- **界面**：会话菜单两次确认并显示结果警告
- **后台**：迟到写回有限窗口复查与占用重试

**流程与依赖**

依赖workspace registry、sessions、Typert和本机文件权限；日志路径编码复制宿主实现，Windows文件占用和服务dispose时序决定删除结果，未涉及外部账号。

菜单第一次置待确认→第二次请求delete→停活动与摘索引→flush并detach→重试删盘→清投影→安排复查→client移除行/刷新并提示warning；失败步骤不统一回滚，用户须查看剩余告警。

**效果与成本**

常规操作两次点击，失败需要读警告并核对目录/缓存；守卫持续约130秒并重复文件系统检查。首次无外部服务费用，误删恢复成本高且无法从本插件保证恢复，未测大日志删除耗时。

减少用户手动寻找日志与残影的负担，尤其针对占用和迟到写回；价值依赖宿主内部结构稳定，完整遗忘的责任仍包含备份、第三方记忆与文件清理复核。

- **思考**：调用返回ok:true能否作为彻底遗忘证明？host多步骤失败收集warnings后继续，并在未来守卫中补删；投影总表采用读改写而非与宿主共用事务。支持正常占用恢复不代表每一步必成功，客户端摘要也只反映当前结果。验证需跨守卫窗口与重启，不能只看行消失。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对归档仅改变可见性及手工删日志，贡献在把会话活体、工作区记账、日志和投影几个所有权串起来，先释放写句柄再删盘并观察迟到重建。该恢复编排适合解释“列表消失却重启复活”的问题，不是通用安全擦除。

相对归档仅改变可见性及手工删日志，贡献在把会话活体、工作区记账、日志和投影几个所有权串起来，先释放写句柄再删盘并观察迟到重建。该恢复编排适合解释“列表消失却重启复活”的问题，不是通用安全擦除。

值得借鉴lib/index.js中先flush/detach后删除与验证性重试的顺序。风险在对宿主私有store、投影JSON布局耦合，cleanProjectionCache整表读改写可能与并发宿主写入竞争；这是需控制实验核实的并发风险，不推定已有数据损坏。

<a id="detail-section-5"></a>

### 主要限制

调用返回ok:true能否作为彻底遗忘证明？host多步骤失败收集warnings后继续，并在未来守卫中补删；投影总表采用读改写而非与宿主共用事务。支持正常占用恢复不代表每一步必成功，客户端摘要也只反映当前结果。验证需跨守卫窗口与重启，不能只看行消失。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查host清理、路径编码、重试/守卫与client确认；未运行删除、未验证44.7兼容，第三方记忆和备份不在清理证明范围。
- 下一步：在隔离profile创建活动/归档/置顶/未知cwd会话，模拟文件占用和迟到写回，等守卫结束再重启检查列表、日志及投影；同时并发写其他会话防止总表丢更新。最终确认若仍漏报残留，否定状态对账假设。

**分析版本**

- **仓库**：[2026heshao/dsh-forget-session](https://github.com/2026heshao/dsh-forget-session)
- **版本号**：2.2.1（[固定提交 64796c9b](https://github.com/2026heshao/dsh-forget-session/tree/64796c9b1423972ae54d2cfa230acc6c4d546c0e)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

### 源码索引

- [lib/index.js](https://github.com/2026heshao/dsh-forget-session/blob/64796c9b1423972ae54d2cfa230acc6c4d546c0e/lib/index.js)
- [lib/client.js](https://github.com/2026heshao/dsh-forget-session/blob/64796c9b1423972ae54d2cfa230acc6c4d546c0e/lib/client.js)

<a id="detail-section-8"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：将“已请求/清理中/确认无残留/需人工处理”作为删除结果状态，并保存最小非内容审计记录，守卫完成后再给最终确认。来源是异步补删与同步ok之间的语义差；代价是删除任务自身的生命周期及审计保留策略。

在隔离profile创建活动/归档/置顶/未知cwd会话，模拟文件占用和迟到写回，等守卫结束再重启检查列表、日志及投影；同时并发写其他会话防止总表丢更新。最终确认若仍漏报残留，否定状态对账假设。

<a id="detail-section-9"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 201 | — | — | 2514 |
| .js | source | 2 | 737 | 512 | 179 | — |
| .mjs | test | 1 | 117 | 82 | 19 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/2026heshao/dsh-forget-session/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
