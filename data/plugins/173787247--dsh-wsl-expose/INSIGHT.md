# dsh-wsl-expose

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[d731e52](https://github.com/173787247/dsh-wsl-expose/tree/d731e529bce9e050b4a7ef378e67e3cc497b563c)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-expose)
<!-- END META -->

> **实现功能**：诊断WSL端口访问方式，提供端口转发建议并可添加或删除Windows portproxy。

> **核心亮点**：把诊断、命令预览和受限执行整合为单一流程；相对手工netsh降低参数拼接负担，尚不能证明对所有WSL网络模式有效。

> **风险与缺陷**：apply仅添加portproxy，展示的防火墙命令没有一并执行；返回ok不能证明局域网访问已经打通，默认监听地址为0.0.0.0也扩大了暴露范围。

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

> **用途**：需要从Windows或局域网访问WSL服务时，明确监听地址和转发路径，避免盲目修改网络设置。

手工netsh、Windows localhost转发或现有中继；插件不能把这些不同路径视为完全等价。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：wsl_expose：建议、添加和删除端口转发。

**流程与依赖**

需要WSL地址检测、PowerShell和Windows管理员权限；防火墙策略由用户另行处理。

先读advise输出，确认服务与监听范围，再决定是否apply，结束后remove并复查实际规则。

**效果与成本**

维护管理员权限、网络规则及地址变化是主要成本，误配后的恢复时间未测。

把诊断、命令预览和受限执行整合为单一流程；相对手工netsh降低参数拼接负担，尚不能证明对所有WSL网络模式有效。 apply仅添加portproxy，展示的防火墙命令没有一并执行；返回ok不能证明局域网访问已经打通，默认监听地址为0.0.0.0也扩大了暴露范围。

> **思考**：apply仅添加portproxy，展示的防火墙命令没有一并执行；返回ok不能证明局域网访问已经打通，默认监听地址为0.0.0.0也扩大了暴露范围。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把诊断、命令预览和受限执行整合为单一流程；相对手工netsh降低参数拼接负担，尚不能证明对所有WSL网络模式有效。

把诊断、命令预览和受限执行整合为单一流程；相对手工netsh降低参数拼接负担，尚不能证明对所有WSL网络模式有效。

参数校验和命令预览便于审查；配置成功与端到端可达应有不同状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

apply仅添加portproxy，展示的防火墙命令没有一并执行；返回ok不能证明局域网访问已经打通，默认监听地址为0.0.0.0也扩大了暴露范围。

<a id="detail-section-6"></a>

### 1.5 使用建议

先只看建议；确需局域网转发时限制监听地址，另查防火墙，完成后检查删除规则是否生效。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献：把诊断、命令预览和受限执行整合为单一流程；相对手工netsh降低参数拼接负担，尚不能证明对所有WSL网络模式有效。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

- 已检查：作者 README、包清单、源码路径 index.js、lib/expose.js、lib/expose-net.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查端口转发逻辑，未执行任何网络或防火墙修改；目录名expose与包名portproxy不同，按仓库身份研究。 固定checkout的注册候选与关键主张定向抽读；未逐行完整审阅全部源码、测试、依赖及外部参照，未运行目标代码。评分仅针对文中明确的CLI/API/人工流程参照；跨场景迁移为解释性判断。
- 下一步：分别在NAT和mirrored环境验证advise、apply、remove，再从目标客户端检查可达性及回滚；防火墙拒绝时不得宣称配置完成。

**分析版本**

- **仓库**：[173787247/dsh-wsl-expose](https://github.com/173787247/dsh-wsl-expose)
- **版本号**：0.2.2（[固定提交 d731e52](https://github.com/173787247/dsh-wsl-expose/tree/d731e529bce9e050b4a7ef378e67e3cc497b563c)）
- **版本日期**：2026-10-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

本次未提出新创新假设；先补充转发后可达性与回滚验证，比增加更多网络配置开关更有价值。

分别在NAT和mirrored环境验证advise、apply、remove，再从目标客户端检查可达性及回滚；防火墙拒绝时不得宣称配置完成。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 183 | — | — | 1181 |
| .js | source | 4 | 290 | 265 | 5 | — |
| .js | test | 1 | 48 | 44 | 2 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-expose/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
