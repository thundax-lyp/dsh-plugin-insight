# dsh-wsl-port

> 检查WSL本地TCP监听及IP，并提供Windows访问DSH的排障步骤。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[7846224](https://github.com/173787247/dsh-wsl-port/tree/7846224bc8959b5588011846142af8c8a9c308b1)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-port)
<!-- END META -->

**使用建议**：适合故障分层第一步；3081裸地址与带认证入口须区分，完整登录访问后才算恢复。

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

已有贡献：把本地监听检查和DSH特定操作手册合成诊断入口；不执行Windows端连接测试，也不自动修复网络。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：Windows无法打开WSL服务时，需要先分辨本地无监听与跨系统访问链路问题。

- **建议**：待验证假设：把Linux监听、Windows中继和带认证UI检查分成独立证据，可减少把监听当办结；需要安全传递状态而非把token写入报告。

采用建议：适合故障分层第一步；3081裸地址与带认证入口须区分，完整登录访问后才算恢复。

ss/hostname与手工Windows浏览器连通性检查。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：port_doctor：WSL监听、IP与排障建议。

**流程与依赖**

需要WSL、hostname与ss；DSH特定建议另依赖kit脚本、relay和对应宿主版本，不由本插件创建。

检查端口与IP，人工对照playbook，必要时运行套件健康和重启脚本，再从Windows确认真实访问。

**效果与成本**

检查成本较低，失败定位和重启为人工成本；无跨端恢复率测量。

把本地监听检查和DSH特定操作手册合成诊断入口；不执行Windows端连接测试，也不自动修复网络。 监听成立只证明Linux局部状态；建议绑定套件脚本与特定端口，Windows中继是否可达和认证是否通过没有观测。

- **思考**：监听成立只证明Linux局部状态；建议绑定套件脚本与特定端口，Windows中继是否可达和认证是否通过没有观测。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：把本地监听检查和DSH特定操作手册合成诊断入口；不执行Windows端连接测试，也不自动修复网络。

把本地监听检查和DSH特定操作手册合成诊断入口；不执行Windows端连接测试，也不自动修复网络。

检查函数允许注入exec便于隔离测试；UI手册同时进入uiPlaybook和advice导致展示重复，端口字符串匹配不如解析结构稳健。

<a id="detail-section-5"></a>

### 主要限制

监听成立只证明Linux局部状态；建议绑定套件脚本与特定端口，Windows中继是否可达和认证是否通过没有观测。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 index.js、lib/port.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查入口、监听匹配与建议生成；未探测本机端口或Windows连接。
- 下一步：构造Linux监听但Windows不可达、中继正常但认证失败等场景，与单独ss报告比较诊断定位及恢复步骤；本轮不启动服务。

**分析版本**

- **仓库**：[173787247/dsh-wsl-port](https://github.com/173787247/dsh-wsl-port)
- **版本号**：0.2.2（[固定提交 7846224](https://github.com/173787247/dsh-wsl-port/tree/7846224bc8959b5588011846142af8c8a9c308b1)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：把Linux监听、Windows中继和带认证UI检查分成独立证据，可减少把监听当办结；需要安全传递状态而非把token写入报告。

构造Linux监听但Windows不可达、中继正常但认证失败等场景，与单独ss报告比较诊断定位及恢复步骤；本轮不启动服务。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 185 | — | — | 1112 |
| .js | source | 3 | 246 | 224 | 6 | — |
| .js | test | 1 | 40 | 37 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-port/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-port/issues?q=is%3Aissue+created%3A2026-09-20T09%3A42%3A17.575Z..2026-10-20T09%3A42%3A17.575Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-port/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T09%3A42%3A17.575Z..2026-10-20T09%3A42%3A17.575Z)



统计日期：2026-10-20。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
