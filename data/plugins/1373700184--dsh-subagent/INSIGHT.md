# dsh-subagent

> 把 Qoder、OpenCode、Pi 等外部 CLI 注册为 DSH 子代理，提供模型回退与进度查询。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[24c9380](https://github.com/1373700184/dsh-subagent/tree/24c93805e443c9908b03f4c506d2fa76192383f2)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1373700184/dsh-subagent) · [![npm 30d 22](https://img.shields.io/static/v1?label=npm+30d&message=22&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-subagent)
<!-- END META -->

**使用建议**：已有对应CLI且能隔离工作目录的人先试只读任务；为每驱动设置硬超时，检查错误事件、最终输出和取消后进程，不让自动回退承担不可重复写入。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、流程与依赖](#detail-section-3)
  - [效果、成本与限制](#detail-section-4)
  - [核心贡献与工程亮点](#detail-section-5)
  - [使用判断](#detail-section-6)
  - [能力、流程与成本](#detail-section-7)
  - [工程贡献](#detail-section-8)
  - [核查说明与分析版本](#detail-section-9)
- [未来设计假设（未验证）](#detail-section-10)
- [辅助信息](#detail-section-11)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 场景与替代办法

已有外部CLI环境的开发者在DSH父任务中委派独立代码任务，显式交接上下文并核对最终文本/文件。

参照各CLI直接执行和DSH通用SubagentProvider；不对CLI模型能力或价格作外部优劣判断。

<a id="detail-section-3"></a>

### 能力、流程与依赖

lib/index.js以DRIVERS表适配qoder-json/opencode-json/pi-json，外部进程stdin接提示，各事件映射到sink与有界ledger；Provider复用宿主句柄，客户端按runId查状态，patch绑定四个委派工具。

- **模型工具**：qoder/qodercn/opencode/pi委派绑定及状态查询。
- **用户命令**：各提供方斜杠委派入口。
- **Host 路由**：CLI模型探测、刷新与活动读取。
- **界面**：Web参数设置和动作进度面板。
- **后台**：三JSON驱动的一次性执行与模型回退。

DSH subagents/tools/commands及连接服务，本机各CLI、Pi node launcher和登录环境；权限与模型支持由具体驱动决定。

完整任务提示→指定提供方→按模型链spawn对应CLI→事件sink/账本→终结结果或失败→父Agent验收；静默可通知父侧，不能视为总预算终止。

bundle绑定qoder/qodercn/opencode/pi；三driver均一次性，不继承父上下文、不承诺续话/结构化输出能力；README部分默认说明与实际patch须分别核对。

<a id="detail-section-4"></a>

### 效果、成本与限制

价值是统一外部执行与父侧可见性；费用/速度/质量受CLI、上下文交接与重试影响，进度活动不能证明交付。

首次安装登录各CLI、配置版本和权限；每次补写上下文、失败回退及结果复核可能增加额度与人工。24次运行/200事件账本有截断，无长期审计或单位任务成本测量。

三种CLI能否共享同一“完成”语义？Qoder依赖result事件，OpenCode/Pi usesResultEvent=false走进程退出与文本收敛，CLI错误事件仅记账时需核查是否最终仍判完成。总deadline仍只约束firstEvent和失败后切换，首个JSON后await结果不受该预算硬约束，timeoutSeconds默认空；默认放权、POSIX只杀直接子进程也要求隔离与硬超时。

<a id="detail-section-5"></a>

### 核心贡献与工程亮点

相对手动在各CLI间搬运任务，增量是把三种JSON协议统一到DSH子代理结果、状态查询和模型链；新增DRIVERS/sink抽象减少每类CLI重复生命周期代码。子代理句柄/结算复用DSH上游helper，CLI模型能力属于外部工具，不能算插件原创或由数量推导质量。

Provider/Run和DRIVERS/sink分离、有界ledger及stderr尾部便于借鉴；复用应增加驱动终结契约、末尾无换行处理、全程deadline与进程树取消。

源码依据：[lib/index.js](https://github.com/1373700184/dsh-subagent/blob/24c93805e443c9908b03f4c506d2fa76192383f2/lib/index.js)、[src/client.js](https://github.com/1373700184/dsh-subagent/blob/24c93805e443c9908b03f4c506d2fa76192383f2/src/client.js)、[cordis.patch.yml](https://github.com/1373700184/dsh-subagent/blob/24c93805e443c9908b03f4c506d2fa76192383f2/cordis.patch.yml)、[package.json](https://github.com/1373700184/dsh-subagent/blob/24c93805e443c9908b03f4c506d2fa76192383f2/package.json)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：已有外部CLI环境的开发者在DSH父任务中委派独立代码任务，显式交接上下文并核对最终文本/文件。

- **建议**：待验证假设：把每驱动的终结状态、业务输出断言与全程绝对deadline列成明确协议契约，再用相同故障矩阵校验，可减少“同一完成标识、不同实际保证”。由usesResultEvent差异和首事件后等待推导，未实现统一验收。用错误事件后exit0、只出元数据卡住、无换行终帧及正常完成分别喂三驱动，测误报完成、超时覆盖与取消残留；若兼容成本超过统一收益，应保留驱动专属状态而非强合并。

已有对应CLI且能隔离工作目录的人先试只读任务；为每驱动设置硬超时，检查错误事件、最终输出和取消后进程，不让自动回退承担不可重复写入。

**核查状态**：已抽读固定版本源码，未安装、运行目标插件或真实宿主验收。旧11 findings与两轴理由已逐项在当前源码重新核对；三驱动实现可见，未实际运行任何CLI或宿主，协议/费用与取消仍未验收。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **模型工具**：qoder/qodercn/opencode/pi委派绑定及状态查询。
- **用户命令**：各提供方斜杠委派入口。
- **Host 路由**：CLI模型探测、刷新与活动读取。
- **界面**：Web参数设置和动作进度面板。
- **后台**：三JSON驱动的一次性执行与模型回退。

- **思考**：三种CLI能否共享同一“完成”语义？Qoder依赖result事件，OpenCode/Pi usesResultEvent=false走进程退出与文本收敛，CLI错误事件仅记账时需核查是否最终仍判完成。总deadline仍只约束firstEvent和失败后切换，首个JSON后await结果不受该预算硬约束，timeoutSeconds默认空；默认放权、POSIX只杀直接子进程也要求隔离与硬超时。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：相对手动在各CLI间搬运任务，增量是把三种JSON协议统一到DSH子代理结果、状态查询和模型链；新增DRIVERS/sink抽象减少每类CLI重复生命周期代码。子代理句柄/结算复用DSH上游helper，CLI模型能力属于外部工具，不能算插件原创或由数量推导质量。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- 版本号：0.6.1；版本日期：2026-10-21（固定提交日期，北京时间；不是包发布日期）。
- 固定版本：[24c93805](https://github.com/1373700184/dsh-subagent/tree/24c93805e443c9908b03f4c506d2fa76192383f2)；本次截止 2026-10-21T03:36:14Z。
- 已检查：README、package与以上源码路径及固定组件统计。
- 未执行：目标代码、目标测试、安装、真实宿主或第三方服务验证。
- 范围限制：抽读Provider/Run、三驱动、账本、探测、前端与patch；未跑CLI、目标测试或宿主，不核实订阅额度和真实费用。
- 证据边界：源码与作者说明不等于独立效果验证；GitHub/npm指标不证明采用或收益。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：41a8f58fcb04f49b86fd84d3f38dc653bd24d90530da811c87a1b6864d561874。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 1683 | 1512 | 119 | — |
| .md | source | 1 | 84 | — | — | 1187 |
| .mjs | source | 1 | 30 | 28 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：把每驱动的终结状态、业务输出断言与全程绝对deadline列成明确协议契约，再用相同故障矩阵校验，可减少“同一完成标识、不同实际保证”。由usesResultEvent差异和首事件后等待推导，未实现统一验收。用错误事件后exit0、只出元数据卡住、无换行终帧及正常完成分别喂三驱动，测误报完成、超时覆盖与取消残留；若兼容成本超过统一收益，应保留驱动专属状态而非强合并。

隔离宿主对三协议覆盖错误后exit0、仅元数据卡住、无换行终帧、取消后子进程与失败回退重复写入；本轮不执行目标代码。

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1373700184/dsh-subagent/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/1373700184/dsh-subagent/issues?q=is%3Aissue+created%3A2026-09-21T03%3A39%3A49.720Z..2026-10-21T03%3A39%3A49.720Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1373700184/dsh-subagent/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T03%3A39%3A49.720Z..2026-10-21T03%3A39%3A49.720Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
