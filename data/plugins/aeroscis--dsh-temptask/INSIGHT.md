# dsh-temptask

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[1116ec7](https://github.com/Aeroscis/dsh-temptask/tree/1116ec7ff1af2dcf104dc34d883548c413064e25)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Aeroscis/dsh-temptask) [![npm 30d 1,309](https://img.shields.io/static/v1?label=npm+30d&message=1%2C309&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@aeroscis/dsh-temptask) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@aeroscis/dsh-temptask)
<!-- END META -->

> **实现功能**：为临时任务创建独立目录和DSH工作区，提供清理、转正搬迁与会话历史重建。

> **核心亮点**：把临时到正式的目录、工作区和对话生命周期串起来，增量超出单一新会话按钮；会话seed及归档由宿主提供，插件不改旧日志。

> **风险与缺陷**：转正是否原子保留全部工作？历史携带失败可继续完成搬迁；目录move失败前可能已取消会话，README“什么都没改”范围过宽。跨卷复制删除和工作区重建也存在部分失败/回滚失败分支。

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

> **用途**：一次性试验需快速开始，成果保留时目录和对话可追溯；隔离目录不是进程或权限沙箱。

手动建目录与宿主新会话更透明但繁琐；插件聚合生命周期，也扩大一次操作副作用。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **用户命令**：/temptask创建、清理、转正及修复。
- **界面**：侧栏临时任务与确认/结果面板。
- **Host 路由**：任务生命周期管理接口。
- **事件监听**：会话与工作区状态挂钩。

**流程与依赖**

DSH workspaces/agents/commands/webServer与本地文件系统；跨卷/占用文件和宿主seed语义决定边界。

创建目录→工作区→会话，清理先取消会话再删目录处理节点；转正搬目录后建新工作区和历史会话，旧日志保留。

**效果与成本**

首次设置根目录/会话策略；持续临时磁盘、复制和迁移核对成本，无实测清理收益。

可能减少试验目录杂乱并保留上下文，代价是删除/搬迁责任更集中。

> **思考**：转正是否原子保留全部工作？历史携带失败可继续完成搬迁；目录move失败前可能已取消会话，README“什么都没改”范围过宽。跨卷复制删除和工作区重建也存在部分失败/回滚失败分支。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把临时到正式的目录、工作区和对话生命周期串起来，增量超出单一新会话按钮；会话seed及归档由宿主提供，插件不改旧日志。

把临时到正式的目录、工作区和对话生命周期串起来，增量超出单一新会话按钮；会话seed及归档由宿主提供，插件不改旧日志。

删除路径一致性校验、原子任务记录、完整/部分迁移结果分开有价值；多阶段动作不是全事务。 源码依据：[src/index.ts](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/src/index.ts)、[src/host.ts](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/src/host.ts)、[src/tasks.ts](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/src/tasks.ts)、[src/promote.ts](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/src/promote.ts)、[src/seed.ts](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/src/seed.ts)、[src/commands.ts](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/src/commands.ts)。

<a id="detail-section-5"></a>

### 1.4 主要限制

转正是否原子保留全部工作？历史携带失败可继续完成搬迁；目录move失败前可能已取消会话，README“什么都没改”范围过宽。跨卷复制删除和工作区重建也存在部分失败/回滚失败分支。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在可丢弃目录验证清理和转正，保留重要文件备份。把历史结果卡当迁移验收依据，不能只看新目录出现。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[Aeroscis/dsh-temptask](https://github.com/Aeroscis/dsh-temptask)
- **版本号**：0.5.0（[固定提交 1116ec7f](https://github.com/Aeroscis/dsh-temptask/tree/1116ec7ff1af2dcf104dc34d883548c413064e25)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/host.ts、src/tasks.ts、src/promote.ts、src/seed.ts、src/commands.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读src/index.ts、src/host.ts、src/tasks.ts、src/promote.ts、src/seed.ts、src/commands.ts；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：临时副本验证跨卷、目录占用、seed无完成边界、建workspace失败和回滚失败；核对文件与完整历史而非只看成功提示。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由多阶段转正推导，可预生成迁移计划与持久化阶段日志，把目录成功、会话重建和旧节点归档分开确认并可恢复。未验证；逐阶段注入故障，所有产物应可定位且不重复取消/搬迁。

临时副本验证跨卷、目录占用、seed无完成边界、建workspace失败和回滚失败；核对文件与完整历史而非只看成功提示。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：0d42449d78b96f07cfc345a98e4fb6236e762724215cdd700bff1ac32ad4b71d。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 1067 | — | — | 19636 |
| .js | source | 16 | 5577 | 4322 | 1255 | — |
| .mjs | source | 7 | 3881 | 3170 | 389 | — |
| .tsx | source | 1 | 3157 | 2355 | 626 | — |
| .ts | source | 15 | 4392 | 3032 | 974 | — |

排除 1 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/Aeroscis/dsh-temptask/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
