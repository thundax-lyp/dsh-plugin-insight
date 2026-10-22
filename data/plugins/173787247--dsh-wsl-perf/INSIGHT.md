# dsh-wsl-perf

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[c6aac1e](https://github.com/173787247/dsh-wsl-perf/tree/c6aac1e77224a9a81a1103ba199bd6b5785e654c)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-perf)
<!-- END META -->

> **实现功能**：从WSL读取Windows宿主CPU、内存、磁盘及高内存进程指标。

> **核心亮点**：相对在Windows任务管理器人工查看，增量是将宿主资源快照接入Agent；指标与采集机制继承Windows接口，不是新监控算法。

> **风险与缺陷**：高内存进程列表不等于高CPU列表，cpuSec是累计CPU时间；单次CPU快照不足以定位持续瓶颈，缺字段又会被num归零。

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

> **用途**：WSL开发者排查整机资源紧张，需要区分Windows宿主与Linux侧指标。

任务管理器或直接Get-CimInstance/Get-Process。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：win_perf：Windows宿主资源快照。

**流程与依赖**

需要WSL、Windows PowerShell和CIM访问；共用wsl-host桥接来自套件，宿主指标不能替代WSL内部资源视图。

调用快照、核对时间与指标单位，再人工判断进程；不自动结束进程或修改资源配置。

**效果与成本**

PowerShell启动、CIM查询和人工解释为主要成本；未测采样开销或诊断收益。

相对在Windows任务管理器人工查看，增量是将宿主资源快照接入Agent；指标与采集机制继承Windows接口，不是新监控算法。 高内存进程列表不等于高CPU列表，cpuSec是累计CPU时间；单次CPU快照不足以定位持续瓶颈，缺字段又会被num归零。

> **思考**：高内存进程列表不等于高CPU列表，cpuSec是累计CPU时间；单次CPU快照不足以定位持续瓶颈，缺字段又会被num归零。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对在Windows任务管理器人工查看，增量是将宿主资源快照接入Agent；指标与采集机制继承Windows接口，不是新监控算法。

相对在Windows任务管理器人工查看，增量是将宿主资源快照接入Agent；指标与采集机制继承Windows接口，不是新监控算法。

纯归一化和执行层分离利于测试；共用模板保留无关参数，缺失数值归零会丢失证据状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

高内存进程列表不等于高CPU列表，cpuSec是累计CPU时间；单次CPU快照不足以定位持续瓶颈，缺字段又会被num归零。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合偶发诊断；先确认CPU累计值与内存排序含义，再作处置。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献：相对在Windows任务管理器人工查看，增量是将宿主资源快照接入Agent；指标与采集机制继承Windows接口，不是新监控算法。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

- 已检查：作者 README、包清单、源码路径 index.js、lib/perf-exec.js、lib/perf.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查入口、采集脚本和归一化；未采集机器指标。
- 下一步：与同一时段任务管理器及两次进程采样对照，测试权限拒绝、进程退出和缺失字段；若额外采样仍不能改善归因则否定假设。

**分析版本**

- **仓库**：[173787247/dsh-wsl-perf](https://github.com/173787247/dsh-wsl-perf)
- **版本号**：0.1.0（[固定提交 c6aac1e](https://github.com/173787247/dsh-wsl-perf/tree/c6aac1e77224a9a81a1103ba199bd6b5785e654c)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：连续两次采样并保留缺失值，可把累计CPU时间转为区间占用并减少缺失当零的误判；尚未实现。

与同一时段任务管理器及两次进程采样对照，测试权限拒绝、进程退出和缺失字段；若额外采样仍不能改善归因则否定假设。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 115 | — | — | 408 |
| .js | source | 4 | 214 | 180 | 12 | — |
| .js | test | 1 | 43 | 40 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-perf/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
