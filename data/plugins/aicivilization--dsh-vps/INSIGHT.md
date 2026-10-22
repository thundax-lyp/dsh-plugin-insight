# dsh-vps

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[d4223e0](https://github.com/AIcivilization/dsh-vps/tree/d4223e07717dce3832d0233a6a12edfceb3fde27)

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/AIcivilization/dsh-vps) [![npm 30d 3,485](https://img.shields.io/static/v1?label=npm+30d&message=3%2C485&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vps) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-vps)
<!-- END META -->

> **实现功能**：在VPS部署DSH并提供登录网关、HTTPS、远程安装和升级回滚管理页面。

> **核心亮点**：相比裸反代，增量是将登录门、DSH会话认证、远程部署与可恢复升级串为管理流程。TLS/systemd/DSH能力归上游，插件承担安全接线和运维责任。

> **风险与缺陷**：“原生界面全部可用”是否保持原信任边界？网关注入ownsHost使公网页获得本来loopback拥有者分类，因此认证门必须覆盖HTTP/WS/插件控制路径。远程安装拉main脚本，固定研究SHA不约束未来下载内容；SSH断线后后台仍运行，未知结果不能直接重装。源码不是公网渗透/恢复验收。

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

> **用途**：管理员希望从公网使用自管DSH，合格部署需认证、代理和特权接口一致且升级可恢复；页面能打开不等于全部权限/生命周期验收。

手工SSH+反代可控但步骤多；此工具整合登录与宿主适配，安全边界仍需独立审查。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：VPS部署与本机状态管理页。
- **Host 路由**：SSH部署和网关管理接线。
- **后台**：登录网关代理与DSH子进程管理。

**流程与依赖**

Linux systemd、root部署权限、SSH/Caddy、可达包/脚本源和DSH认证协议；效果依赖管理员配置与每次升级兼容。

本地表单或服务器脚本部署，建立登录/HTTPS与服务，用户授权后通过gate使用DSH；升级前备份/自检，失败查状态并恢复，不能盲重试。

**效果与成本**

VPS/TLS域名/模型调用现金成本与管理员值守、升级回归、备份恢复工时分列；没有可用性SLO或总成本实测。

减少手动组合部署步骤，但公开暴露与持续升级责任没有消失。

> **思考**：“原生界面全部可用”是否保持原信任边界？网关注入ownsHost使公网页获得本来loopback拥有者分类，因此认证门必须覆盖HTTP/WS/插件控制路径。远程安装拉main脚本，固定研究SHA不约束未来下载内容；SSH断线后后台仍运行，未知结果不能直接重装。源码不是公网渗透/恢复验收。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相比裸反代，增量是将登录门、DSH会话认证、远程部署与可恢复升级串为管理流程。TLS/systemd/DSH能力归上游，插件承担安全接线和运维责任。

相比裸反代，增量是将登录门、DSH会话认证、远程部署与可恢复升级串为管理流程。TLS/systemd/DSH能力归上游，插件承担安全接线和运维责任。

gateway与remote install分层、scrypt/HMAC会话与服务管理可借鉴；HTML信任注入及动态下载是关键耦合，成功健康端点只说明局部状态。 源码依据：[plugin/index.mjs](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/plugin/index.mjs)、[plugin/remote-install.mjs](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/plugin/remote-install.mjs)、[gate/server.js](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/gate/server.js)、[install.sh](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/install.sh)、[LICENSE](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/LICENSE)。

<a id="detail-section-5"></a>

### 1.4 主要限制

“原生界面全部可用”是否保持原信任边界？网关注入ownsHost使公网页获得本来loopback拥有者分类，因此认证门必须覆盖HTTP/WS/插件控制路径。远程安装拉main脚本，固定研究SHA不约束未来下载内容；SSH断线后后台仍运行，未知结果不能直接重装。源码不是公网渗透/恢复验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合能维护Linux服务器的管理员在测试VPS验证。先核对登录覆盖、特权接口和备份恢复，再配置公网；远程安装断线先查服务器日志与服务状态。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[AIcivilization/dsh-vps](https://github.com/AIcivilization/dsh-vps)
- **版本号**：1.16.1（[固定提交 d4223e07](https://github.com/AIcivilization/dsh-vps/tree/d4223e07717dce3832d0233a6a12edfceb3fde27)）
- **版本日期**：2026-10-15（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 plugin/index.mjs、plugin/remote-install.mjs、gate/server.js、install.sh、LICENSE 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读plugin/index.mjs、plugin/remote-install.mjs、gate/server.js、install.sh、LICENSE；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：一次性测试VPS覆盖安装/卸载、认证过期与WS/插件API、断线重连、升级失败回滚、凭据日志脱敏与备份可恢复。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由登录与宿主信任提升绑定推导，可输出版本化权限/代理覆盖清单，并固定远程脚本摘要与安装任务ID，重连先查询状态再决定重试。未验证；逐路由未登录/过期cookie/WS与断线恢复测试，若特权路径漏门或重复安装则否定。

一次性测试VPS覆盖安装/卸载、认证过期与WS/插件API、断线重连、升级失败回滚、凭据日志脱敏与备份可恢复。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：d75cd36e7bd37b1574323bfc287d94013f7bffb487d30c4b2a62a5856db3c925。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 693 | — | — | 7872 |
| .js | source | 3 | 5860 | 4592 | 580 | — |
| .mjs | source | 5 | 697 | 583 | 69 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AIcivilization/dsh-vps/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=grey&logo=github&style=flat)](https://github.com/AIcivilization/dsh-vps/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) [![近30天关闭 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/AIcivilization/dsh-vps/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
