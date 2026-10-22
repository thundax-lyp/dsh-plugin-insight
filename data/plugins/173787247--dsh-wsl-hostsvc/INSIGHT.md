# dsh-wsl-hostsvc

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[ef261f7](https://github.com/173787247/dsh-wsl-hostsvc/tree/ef261f7a5d03f4beae08bd250f980941903e6304)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-hostsvc)
<!-- END META -->

> **实现功能**：从WSL探测Windows端本地模型服务，并生成连接与上下文配置建议。

> **核心亮点**：把传输连通、API就绪和配置生成串联，相比只看TCP端口更接近模型接入需求；没有证明真实生成成功。

> **风险与缺陷**：models接口就绪不证明聊天、工具调用或目标上下文大小可用，自动生成配置仍需核对模型实际能力。

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

> **用途**：本地模型运行在Windows而DSH运行于WSL时，找到实际可用的服务地址。

手工curl模型列表和检查网络地址；插件聚合配置提示，不替代服务自身健康检查。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：host_reach：本地模型服务探测与配置建议。

**流程与依赖**

依赖Windows模型服务、WSL网络互通与API格式；模型和驱动由外部环境提供。

运行探测，核对目标IP和模型ID，人工审查配置片段，再做小任务验证。

**效果与成本**

探测请求与配置人工为主，模型加载及实际推理的资源成本另计，未测成功率。

把传输连通、API就绪和配置生成串联，相比只看TCP端口更接近模型接入需求；没有证明真实生成成功。 models接口就绪不证明聊天、工具调用或目标上下文大小可用，自动生成配置仍需核对模型实际能力。

> **思考**：models接口就绪不证明聊天、工具调用或目标上下文大小可用，自动生成配置仍需核对模型实际能力。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把传输连通、API就绪和配置生成串联，相比只看TCP端口更接近模型接入需求；没有证明真实生成成功。

把传输连通、API就绪和配置生成串联，相比只看TCP端口更接近模型接入需求；没有证明真实生成成功。

明确区分TCP与API就绪可借鉴；配置生成应保留实测能力与经验建议的边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

models接口就绪不证明聊天、工具调用或目标上下文大小可用，自动生成配置仍需核对模型实际能力。

<a id="detail-section-6"></a>

### 1.5 使用建议

优先核对apiReady而非仅TCP，再确认模型ID和真实上下文上限。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献：把传输连通、API就绪和配置生成串联，相比只看TCP端口更接近模型接入需求；没有证明真实生成成功。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

- 已检查：作者 README、包清单、源码路径 index.js、lib/hostsvc.js、lib/providers.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读host_reach、服务探测与provider建议，未访问本地模型端口。 固定checkout的注册候选与关键主张定向抽读；未逐行完整审阅全部源码、测试、依赖及外部参照，未运行目标代码。评分仅针对文中明确的CLI/API/人工流程参照；跨场景迁移为解释性判断。
- 下一步：未来用仅开放端口、只支持models、实际可生成三种服务对照误判率；本轮不启动推理。

**分析版本**

- **仓库**：[173787247/dsh-wsl-hostsvc](https://github.com/173787247/dsh-wsl-hostsvc)
- **版本号**：0.4.3（[固定提交 ef261f7](https://github.com/173787247/dsh-wsl-hostsvc/tree/ef261f7a5d03f4beae08bd250f980941903e6304)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：将探测拆为TCP、模型列表、最小生成三层，可能减少配置看似正确但首个任务失败的情况；最后一层需单独执行授权。

未来用仅开放端口、只支持models、实际可生成三种服务对照误判率；本轮不启动推理。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 232 | — | — | 1516 |
| .js | source | 4 | 820 | 751 | 19 | — |
| .js | test | 1 | 152 | 140 | 5 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-hostsvc/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
