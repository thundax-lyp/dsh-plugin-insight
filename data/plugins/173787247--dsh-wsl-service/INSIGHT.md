# dsh-wsl-service

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[6dfdc4a](https://github.com/173787247/dsh-wsl-service/tree/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-service)
<!-- END META -->

> **实现功能**：从WSL查询Windows服务列表、状态、运行账户、进程和依赖关系。

> **核心亮点**：把服务概况和详细依赖接入对话，减少人工跨系统采集；服务控制与诊断结论仍不由插件提供。

> **风险与缺陷**：detail中依赖查询异常被吞掉为空数组，空依赖可能是未能读取而非确实没有；状态参数all被直接用于Status比较也需核对实际语义。

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

> **用途**：Agent排查Windows后台服务问题时，先收集状态和依赖证据再由用户决定修复。

直接Get-Service/CIM或服务管理器；插件聚合字段但不提供根因归因。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：win_services：服务列表与详细状态查询。

**流程与依赖**

需要WSL互操作、PowerShell、CIM服务和账户查询权限；数据只是即时快照。

先查列表，再按确切name请求detail，核对依赖与权限后人工执行修复。

**效果与成本**

跨进程查询、人工解释与重复采样成本，未证明平均修复时间下降。

把服务概况和详细依赖接入对话，减少人工跨系统采集；服务控制与诊断结论仍不由插件提供。 detail中依赖查询异常被吞掉为空数组，空依赖可能是未能读取而非确实没有；状态参数all被直接用于Status比较也需核对实际语义。

> **思考**：detail中依赖查询异常被吞掉为空数组，空依赖可能是未能读取而非确实没有；状态参数all被直接用于Status比较也需核对实际语义。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把服务概况和详细依赖接入对话，减少人工跨系统采集；服务控制与诊断结论仍不由插件提供。

把服务概况和详细依赖接入对话，减少人工跨系统采集；服务控制与诊断结论仍不由插件提供。

查询与规范化分离清楚，依赖方向命名直观；失败与空结果应区别。

<a id="detail-section-5"></a>

### 1.4 主要限制

detail中依赖查询异常被吞掉为空数组，空依赖可能是未能读取而非确实没有；状态参数all被直接用于Status比较也需核对实际语义。

<a id="detail-section-6"></a>

### 1.5 使用建议

先对已知服务核对detail；不要由停止状态或空依赖直接决定删除、重启。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献：把服务概况和详细依赖接入对话，减少人工跨系统采集；服务控制与诊断结论仍不由插件提供。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

- 已检查：作者 README、包清单、源码路径 index.js、lib/service-exec.js、lib/service.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读入口、PowerShell与字段规范化，未查询Windows服务或进行运行验收。
- 下一步：对已知依赖服务及无权限样例与原生命令对照，检查错误是否可区分；若模型仍把unknown当空则需调整展示。

**分析版本**

- **仓库**：[173787247/dsh-wsl-service](https://github.com/173787247/dsh-wsl-service)
- **版本号**：0.1.0（[固定提交 6dfdc4a](https://github.com/173787247/dsh-wsl-service/tree/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：每个依赖字段附带读取成功状态，可减少把未知依赖当无依赖的误诊；增加字段能否改善判断仍需试验。

对已知依赖服务及无权限样例与原生命令对照，检查错误是否可区分；若模型仍把unknown当空则需调整展示。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 117 | — | — | 424 |
| .js | source | 4 | 257 | 221 | 12 | — |
| .js | test | 1 | 36 | 32 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-service/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
