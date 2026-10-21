# dsh-draft-attachments

> 将 DSH 输入框未发送的附件保存到 IndexedDB，并在会话输入区重挂载时恢复。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[f285e67](https://github.com/2026heshao/dsh-draft-attachments/tree/f285e67bab926ee3083ee7b3858aa28a6092ec8a)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-draft-attachments) [![npm 30d 23](https://img.shields.io/static/v1?label=npm+30d&message=23&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-draft-attachments) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-draft-attachments)
<!-- END META -->

**使用建议**：可先用可丢弃附件验证切换、重启、发送后不复活及超限行为，再用于常用流程；敏感附件要把浏览器持久保存纳入清理习惯，不能把它当跨设备草稿同步。

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

已核查浏览器持久化与恢复通道，贡献是补齐附件草稿生命周期；恢复/清空竞态及浏览器额度未实测，代次提交假设未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：适合经常带图片或文件准备问题、期间切换会话的用户；合格结果是未发送附件按原顺序恢复且发送后不再出现。

采用建议：可先用可丢弃附件验证切换、重启、发送后不复活及超限行为，再用于常用流程；敏感附件要把浏览器持久保存纳入清理习惯，不能把它当跨设备草稿同步。

参照官方文字localStorage草稿与仅内存附件、用户手工重传；插件复用宿主intake，不替代上传后端或改变文件权限。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：conversation.input.dock不可见哨兵保存与恢复附件草稿

**流程与依赖**

必需浏览器 IndexedDB、File/Blob、DSH conversation服务和input dock；存储额度、同源策略与输入提交锁决定恢复效果，缺服务直接跳过，未跨浏览器验证。

添加附件→捕获字节/去抖保存→切换时冲刷→挂载读盘→输入仍空才建草稿→官方输入回填；发送或手动删除触发空集合删除记录。被提交锁拒绝时释放新草稿，等待下一次挂载再试。

**效果与成本**

本地保存附件字节增加浏览器存储和读取内存，单附件30MB过滤可见；源码声明120MB会话上限但捕获循环未见合计上限检查，不能把README额度护栏当已完全落实。首次需启用插件，额度失败与恢复不成功需手动重传。

高频切换用户有望少重复选择附件；遇到存储失败仅静默退化并不自动满足“不会丢”的目标，实际收益应按成功恢复率而非注册成功判断。

- **思考**：决定贡献成立的是“恢复”和“空集合清除”是否有一致的顺序。源码中恢复 effect 异步 loadDraft，另一个 effect 同时观察当前空 attachmentIds 并安排删除；恢复仅看 liveInputRef 和 restored 标记，未发现跨两个操作的持久化代次协议。常规快速读盘可能正常，浏览器慢存储和快速切换应作为证伪场景，当前不能直接断言必丢。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对宿主仅内存附件和用户手动重新上传，插件把字节与元数据按 sessionId 保存，在重新挂载时通过官方入口重建草稿而不是 patch 核心函数。这是有针对性的流程修补，价值在减少中断后的准备重做，不是新的数据库或上传协议。

相对宿主仅内存附件和用户手动重新上传，插件把字节与元数据按 sessionId 保存，在重新挂载时通过官方入口重建草稿而不是 patch 核心函数。这是有针对性的流程修补，价值在减少中断后的准备重做，不是新的数据库或上传协议。

lib/client.js 通过官方slot和createDrafts降低侵入性，回填拒绝时release草稿减少资源泄漏，适合借鉴为输入草稿扩展。saveDraft将事务错误吞为完成、openDb失败Promise长期缓存，以及异步run缺序列化，都会增加故障排查和重试成本；这些是源码边界而非本次运行失败。

<a id="detail-section-5"></a>

### 主要限制

决定贡献成立的是“恢复”和“空集合清除”是否有一致的顺序。源码中恢复 effect 异步 loadDraft，另一个 effect 同时观察当前空 attachmentIds 并安排删除；恢复仅看 liveInputRef 和 restored 标记，未发现跨两个操作的持久化代次协议。常规快速读盘可能正常，浏览器慢存储和快速切换应作为证伪场景，当前不能直接断言必丢。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 lib/client.js、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查全部核心 client 持久化/恢复路径和空 host 入口，未运行 IndexedDB、未做切换/崩溃恢复或上传验收；README 的44.7兼容是作者声明。
- 下一步：固定同组图片与文件，延迟IndexedDB读写并快速切换/发送/删除，逐次核对字节哈希、顺序、发送后零复活及内存；与禁用插件手动重传比较。若代次机制仍出现旧写覆盖删除或显著拖慢发送，否定假设。

**分析版本**

- **仓库**：[2026heshao/dsh-draft-attachments](https://github.com/2026heshao/dsh-draft-attachments)
- **版本号**：1.0.1（[固定提交 f285e67b](https://github.com/2026heshao/dsh-draft-attachments/tree/f285e67bab926ee3083ee7b3858aa28a6092ec8a)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

### 源码索引

- [lib/client.js](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/client.js)
- [lib/index.js](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/index.js)

<a id="detail-section-8"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：以每会话恢复阶段和单调代次约束持久化，恢复结束前不把初始空输入判为用户删除，旧异步捕获不得覆盖较新删除。来自两个独立 effect 的竞态问题；新增状态只应围绕 sessionId，不应把用户发送动作延后。

固定同组图片与文件，延迟IndexedDB读写并快速切换/发送/删除，逐次核对字节哈希、顺序、发送后零复活及内存；与禁用插件手动重传比较。若代次机制仍出现旧写覆盖删除或显著拖慢发送，否定假设。

<a id="detail-section-9"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 314 | 223 | 79 | — |
| .md | source | 1 | 44 | — | — | 777 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/2026heshao/dsh-draft-attachments/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
