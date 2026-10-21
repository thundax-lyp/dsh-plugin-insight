# dsh-snapshot-manager

> 在DSH轮次边界保存增量文件快照，支持恢复文件并分叉到对应对话切点重新开始。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[8fcce84](https://github.com/985451842/dsh-snapshot-manager/tree/8fcce843ca288b8cc4639d15e1c9f1abfdd467dd)

<!-- BEGIN META -->
[![npm 30d 816](https://img.shields.io/static/v1?label=npm+30d&message=816&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-snapshot-manager) [![首次发布 2026-10-10](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-10-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-snapshot-manager)
<!-- END META -->

**使用建议**：先在可丢弃项目测试快照和dryRun。核对排除项、对象摘要与并发写，真正回退前保存独立备份并查看恢复/删除清单；不要视为数据库或全机备份。

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

- **用途**：Agent连续修改后结果不对，开发者想回到某轮之前并修改提问重来；合格结果是目标文件内容和对话切点一致，且其它会话改动不被误删。

- **建议**：由扫描与存对象分两次读推导，可单次读同时算摘要并存对象，采集期间记录文件版本，发布快照前复核变化；对话继续执行前可等待最小基线。未验证假设是减少混合时点快照。注入扫描/读取之间并发写与同size/mtime变化，要求所有对象摘要一致，若不满足则否定。

先在可丢弃项目测试快照和dryRun。核对排除项、对象摘要与并发写，真正回退前保存独立备份并查看恢复/删除清单；不要视为数据库或全机备份。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

Git提交可稳定固定版本但不含会话，单独fork不恢复文件；此插件结合两者便利但没有同等事务保证。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **事件监听**：轮次开始快照与会话改动日志。
- **界面**：时间线、恢复预览和编辑重来入口。
- **Host 路由**：快照capture/preview/restore/prune/gc接口。

**流程与依赖**

依赖session事件、可信cwd、可读写项目、足够存储；对话回退需要sessionController。会话子集只记录识别的工具改动，shell间接改动不全。

轮开始异步采集，用户选快照先预览全部或会话子集，默认尝试生成恢复点，再逐项恢复/删除，按需fork并重发编辑输入；查看失败与warnings再继续。

**效果与成本**

首次全扫描、持续hash/磁盘存储与链回溯成本，默认超大文件不存；恢复多文件可能部分失败，人工核对/补救成本需单列，无实测性能。

可缩短错误改动后的手工回退和重新提问流程，但文件恢复与对话fork非同一原子事务，失败时需人工核对。

- **思考**：内容寻址对象是否始终对应采集哈希？capture先scanWorkspace算hash，再readFile取bytes交putObject，而putObject不复核内容摘要；两次读之间若有并发写，hash名与bytes可能不一致。size+毫秒mtime复用也不是全量内容验证，turn/start排队不冻结工作区。因此“回到本轮之前”需要并发与一致性验证，不能仅凭CAS命名认定。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对单独git restore或会话fork，增量是把文件状态与用户提问切点联系，提供预览、会话改动子集和恢复点。CAS与增量链为成熟存储设计，插件贡献在对话/工作区同步恢复流程。

相对单独git restore或会话fork，增量是把文件状态与用户提问切点联系，提供预览、会话改动子集和恢复点。CAS与增量链为成熟存储设计，插件贡献在对话/工作区同步恢复流程。

真实用户来源与runtime注入区分、提问标签与fork切点分离、增量链和预览可借鉴。恢复点失败仅警告仍继续，恢复逐文件操作与fork可能部分成功；复用时需明确事务和内容完整性边界。 源码依据：[lib/host.js](https://github.com/985451842/dsh-snapshot-manager/blob/8fcce843ca288b8cc4639d15e1c9f1abfdd467dd/lib/host.js)、[lib/client.js](https://github.com/985451842/dsh-snapshot-manager/blob/8fcce843ca288b8cc4639d15e1c9f1abfdd467dd/lib/client.js)、[test/journal.test.mjs](https://github.com/985451842/dsh-snapshot-manager/blob/8fcce843ca288b8cc4639d15e1c9f1abfdd467dd/test/journal.test.mjs)、[test/rel-path.test.mjs](https://github.com/985451842/dsh-snapshot-manager/blob/8fcce843ca288b8cc4639d15e1c9f1abfdd467dd/test/rel-path.test.mjs)。

<a id="detail-section-5"></a>

### 主要限制

内容寻址对象是否始终对应采集哈希？capture先scanWorkspace算hash，再readFile取bytes交putObject，而putObject不复核内容摘要；两次读之间若有并发写，hash名与bytes可能不一致。size+毫秒mtime复用也不是全量内容验证，turn/start排队不冻结工作区。因此“回到本轮之前”需要并发与一致性验证，不能仅凭CAS命名认定。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[985451842/dsh-snapshot-manager](https://github.com/985451842/dsh-snapshot-manager)
- **版本号**：0.2.4（[固定提交 8fcce843](https://github.com/985451842/dsh-snapshot-manager/tree/8fcce843ca288b8cc4639d15e1c9f1abfdd467dd)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/host.js、lib/client.js、test/journal.test.mjs、test/rel-path.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：隔离项目覆盖并发写、哈希/内容一致、超限与排除、恢复点失败、部分文件写失败和fork失败；恢复后逐文件摘要及对话切点均核对。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由扫描与存对象分两次读推导，可单次读同时算摘要并存对象，采集期间记录文件版本，发布快照前复核变化；对话继续执行前可等待最小基线。未验证假设是减少混合时点快照。注入扫描/读取之间并发写与同size/mtime变化，要求所有对象摘要一致，若不满足则否定。

隔离项目覆盖并发写、哈希/内容一致、超限与排除、恢复点失败、部分文件写失败和fork失败；恢复后逐文件摘要及对话切点均核对。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：06e1aa474f073c9490db164c9d1d9e067bcadc8d4fee91db08687eae69dc4185。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 3752 | 2770 | 790 | — |
| .md | source | 1 | 277 | — | — | 4247 |
| .mjs | test | 2 | 126 | 110 | 2 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/985451842/dsh-snapshot-manager/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
