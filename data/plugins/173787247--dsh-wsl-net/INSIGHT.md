# dsh-wsl-net

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[c3f0f1c](https://github.com/173787247/dsh-wsl-net/tree/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-net)
<!-- END META -->

> **实现功能**：检查WSL代理、DSH进程环境与常见服务连通性，并给出修复建议。

> **核心亮点**：把当前进程、DSH进程和子进程的代理差异显式化，相对只看Shell环境更接近故障来源；不是自动网络修复保证。

> **风险与缺陷**：检测到的DSH PID可能不是当前会话所属进程，子进程补环境也不会修复已运行宿主；探测成功不保证所有目标和模型调用成功。

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

> **用途**：Agent或npm无法联网时，区分代理未继承、端口不可达和目标HTTPS失败。

env、进程环境和curl逐项排查；插件汇总故障链但仍需确认目标实例。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：net_doctor：代理与网络诊断。
- **后台**：可为子进程补充代理相关环境。

**流程与依赖**

依赖/proc、pgrep、网络探测及宿主子进程钩子；代理凭据与目标服务策略独立维护。

先查环境，再查代理监听和目标探测；审阅生成的修复步骤后人工重启对应宿主。

**效果与成本**

网络探测、超时等待和环境维护人工为主，探测也产生真实出站请求，未测恢复率。

把当前进程、DSH进程和子进程的代理差异显式化，相对只看Shell环境更接近故障来源；不是自动网络修复保证。 检测到的DSH PID可能不是当前会话所属进程，子进程补环境也不会修复已运行宿主；探测成功不保证所有目标和模型调用成功。

> **思考**：检测到的DSH PID可能不是当前会话所属进程，子进程补环境也不会修复已运行宿主；探测成功不保证所有目标和模型调用成功。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把当前进程、DSH进程和子进程的代理差异显式化，相对只看Shell环境更接近故障来源；不是自动网络修复保证。

把当前进程、DSH进程和子进程的代理差异显式化，相对只看Shell环境更接近故障来源；不是自动网络修复保证。

环境快照、脱敏与建议函数分层可复用，多个进程的来源信息需要可追溯。

<a id="detail-section-5"></a>

### 1.4 主要限制

检测到的DSH PID可能不是当前会话所属进程，子进程补环境也不会修复已运行宿主；探测成功不保证所有目标和模型调用成功。

<a id="detail-section-6"></a>

### 1.5 使用建议

先核对报告中的进程和代理地址，修复后在实际DSH会话验证；不要只重开Shell就认为宿主已更新。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献：把当前进程、DSH进程和子进程的代理差异显式化，相对只看Shell环境更接近故障来源；不是自动网络修复保证。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

- 已检查：作者 README、包清单、源码路径 index.js、lib/net.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读环境解析、入口及建议；未读取用户运行进程的环境或主动探测外网。 固定checkout的注册候选与关键主张定向抽读；未逐行完整审阅全部源码、测试、依赖及外部参照，未运行目标代码。评分仅针对文中明确的CLI/API/人工流程参照；跨场景迁移为解释性判断。
- 下一步：同时运行代理配置不同的两个宿主，核对PID和环境来源；与手工指定进程检查比较误归因，明确无权读取状态。

**分析版本**

- **仓库**：[173787247/dsh-wsl-net](https://github.com/173787247/dsh-wsl-net)
- **版本号**：0.5.2（[固定提交 c3f0f1c](https://github.com/173787247/dsh-wsl-net/tree/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：以宿主实例身份而非进程名匹配诊断对象，可减少多实例下的错误环境归因。

同时运行代理配置不同的两个宿主，核对PID和环境来源；与手工指定进程检查比较误归因，明确无权读取状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 234 | — | — | 1564 |
| .js | source | 2 | 668 | 614 | 26 | — |
| .js | test | 1 | 260 | 238 | 31 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-net/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-net/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-net/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
