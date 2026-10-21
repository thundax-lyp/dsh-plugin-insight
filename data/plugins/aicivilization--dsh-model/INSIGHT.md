# dsh-model

> 聚合多种模型来源为统一鉴权端点，提供模型目录、来源登录、组合切换与DSH管理页。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[2a11586](https://github.com/AIcivilization/dsh-model/tree/2a1158693225c1e9297dfddfc6b7abbfa7b106e7)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AIcivilization/dsh-model) [![npm 30d 2,009](https://img.shields.io/static/v1?label=npm+30d&message=2%2C009&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-model) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-model)
<!-- END META -->

**使用建议**：适合能维护本地daemon的多来源用户在临时profile试用。先核对账号允许的接入方式、设备key撤销及真实工具流；不据来源标签承诺免费或稳定额度。

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

- **用途**：多账号/本机模型用户需要统一连接和额度回退，合格请求须保留模型语义、授权与工具流，不是只拿到HTTP成功。

- **建议**：由输出前回退边界推导，可将组合限制为经验证兼容任务能力集，返回最终来源/回退原因，并把未知结果与可重试失败区分。未验证；相同工具任务注入限流/断流，若结果归属或副作用重复不清则否定。

适合能维护本地daemon的多来源用户在临时profile试用。先核对账号允许的接入方式、设备key撤销及真实工具流；不据来源标签承诺免费或稳定额度。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

各自原生provider配置少中间层但重复；聚合便于管理，代价是更多运行组件。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：来源、key与模型组合管理页。
- **后台**：引擎daemon和来源/额度维护。

**流程与依赖**

Node、外部引擎、各来源授权与网络、OS服务管理、DSH配置；效果受模型能力/配额/上游协议变化影响。

setup装引擎daemon与key，授权来源并选模型，客户端调用统一端点，组合按条件回退并记录失败，用户对账与维护来源。

**效果与成本**

首次账号授权、引擎服务和配置迁移，持续额度/调用现金成本与服务维护；未测总成本，所谓免费不覆盖全部来源或本机计算。

可能减少客户端配置重复，增加统一端点的运维与故障集中责任，未有独立采用/收益实测。

- **思考**：统一可用性是否掩盖不同模型与账户条件？combo允许换模型，虽避免输出后再换，但不同上下文/工具语义和未知请求结果需验收；setup含系统服务、凭据和配置修改，多阶段部分失败不等于全量回滚。README免费/订阅可转接均未在本轮核实。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对每个客户端配置多个provider，增量是端点、设备鉴权、来源管理和组合回退一体化。核心模型转接依赖CLIProxyAPI等上游，不应把模型供给与账号额度归为插件创新。

相对每个客户端配置多个provider，增量是端点、设备鉴权、来源管理和组合回退一体化。核心模型转接依赖CLIProxyAPI等上游，不应把模型供给与账号额度归为插件创新。

key按设备撤销、输出后停止回退、setup依赖失败后停止可借鉴；引擎/bridge/DSH三层状态与凭据需要明确所有权，步骤成功不代表整套服务健康。 源码依据：[plugin/index.js](https://github.com/AIcivilization/dsh-model/blob/2a1158693225c1e9297dfddfc6b7abbfa7b106e7/plugin/index.js)、[src/daemon/core.ts](https://github.com/AIcivilization/dsh-model/blob/2a1158693225c1e9297dfddfc6b7abbfa7b106e7/src/daemon/core.ts)、[src/commands/setup.ts](https://github.com/AIcivilization/dsh-model/blob/2a1158693225c1e9297dfddfc6b7abbfa7b106e7/src/commands/setup.ts)、[src/keys.ts](https://github.com/AIcivilization/dsh-model/blob/2a1158693225c1e9297dfddfc6b7abbfa7b106e7/src/keys.ts)、[src/combo.ts](https://github.com/AIcivilization/dsh-model/blob/2a1158693225c1e9297dfddfc6b7abbfa7b106e7/src/combo.ts)。

<a id="detail-section-5"></a>

### 主要限制

统一可用性是否掩盖不同模型与账户条件？combo允许换模型，虽避免输出后再换，但不同上下文/工具语义和未知请求结果需验收；setup含系统服务、凭据和配置修改，多阶段部分失败不等于全量回滚。README免费/订阅可转接均未在本轮核实。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AIcivilization/dsh-model](https://github.com/AIcivilization/dsh-model)
- **版本号**：0.22.1（[固定提交 2a115869](https://github.com/AIcivilization/dsh-model/tree/2a1158693225c1e9297dfddfc6b7abbfa7b106e7)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 plugin/index.js、src/daemon/core.ts、src/commands/setup.ts、src/keys.ts、src/combo.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读plugin/index.js、src/daemon/core.ts、src/commands/setup.ts、src/keys.ts、src/combo.ts；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：临时环境验证部分setup失败、key撤销、流中断/限流、组合工具调用与卸载恢复；按合格任务统计全体重试费用。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由输出前回退边界推导，可将组合限制为经验证兼容任务能力集，返回最终来源/回退原因，并把未知结果与可重试失败区分。未验证；相同工具任务注入限流/断流，若结果归属或副作用重复不清则否定。

临时环境验证部分setup失败、key撤销、流中断/限流、组合工具调用与卸载恢复；按合格任务统计全体重试费用。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：d2a5b7fa95e8180c43559291a76e1562673434f0fed978921b16991aa4ff198e。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 1522 | 1385 | 91 | — |
| .md | source | 5 | 956 | — | — | 15100 |
| .mjs | source | 1 | 44 | 31 | 8 | — |
| .ts | source | 86 | 13823 | 10410 | 2464 | — |
| .ts | test | 29 | 2465 | 2215 | 90 | — |

排除 85 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AIcivilization/dsh-model/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AIcivilization/dsh-model/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AIcivilization/dsh-model/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
