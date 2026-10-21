# dsh-subagent

> 把 Qoder、OpenCode、Pi 等外部 CLI 注册为 DSH 子代理，提供模型回退与进度查询。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[a0b1147](https://github.com/1373700184/dsh-subagent/tree/a0b1147ed7a752c119c79d2d73e3adc2161b3588)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1373700184/dsh-subagent) · [![npm 30d 22](https://img.shields.io/static/v1?label=npm+30d&message=22&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-subagent) · **脚本有更新，待重新洞察**
<!-- END META -->

**使用建议**：已有对应CLI且能隔离工作目录的人先试只读任务；为每驱动设置硬超时，检查错误事件、最终输出和取消后进程，不让自动回退承担不可重复写入。

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

- **用途**：已有外部CLI环境的开发者在DSH父任务中委派独立代码任务，显式交接上下文并核对最终文本/文件。

- **建议**：待验证假设：为每驱动定义错误终态与产物断言，并把绝对截止传播到Run，可减少“exit0但错误”和有活动无限等的误报。依据是当前usesResultEvent分叉与首事件后直接await，尚未实现。对照错误后exit0、心跳但无结果、无换行终帧和正常交付，测误报完成、超时覆盖与取消残留；若统一规则伤害合法CLI语义，应返回驱动特定状态而非假装一致。

已有对应CLI且能隔离工作目录的人先试只读任务；为每驱动设置硬超时，检查错误事件、最终输出和取消后进程，不让自动回退承担不可重复写入。

核查状态：当前固定源码支持三JSON驱动、账本与委派接线；所有11类结论和两轴评分重新复核，未运行CLI、宿主或计费对照。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

参照各CLI直接执行和DSH通用SubagentProvider；不对CLI模型能力或价格作外部优劣判断。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：qoder/qodercn/opencode/pi委派绑定及状态查询。
- **用户命令**：各提供方斜杠委派入口。
- **Host 路由**：CLI模型探测、刷新与活动读取。
- **界面**：Web参数设置和动作进度面板。
- **后台**：三JSON驱动的一次性执行与模型回退。

**流程与依赖**

lib/index.js以DRIVERS表适配qoder-json/opencode-json/pi-json，外部进程stdin接提示，各事件映射到sink与有界ledger；Provider复用宿主句柄，客户端按runId查状态，patch绑定四个委派工具。

DSH subagents/tools/commands及连接服务，本机各CLI、Pi node launcher和登录环境；权限与模型支持由具体驱动决定。

完整任务提示→指定提供方→按模型链spawn对应CLI→事件sink/账本→终结结果或失败→父Agent验收；静默可通知父侧，不能视为总预算终止。

bundle绑定qoder/qodercn/opencode/pi；三driver均一次性，不继承父上下文、不承诺续话/结构化输出能力；README部分默认说明与实际patch须分别核对。

**效果与成本**

首次安装登录各CLI、配置版本和权限；每次补写上下文、失败回退及结果复核可能增加额度与人工。24次运行/200事件账本有截断，无长期审计或单位任务成本测量。

价值是统一外部执行与父侧可见性；费用/速度/质量受CLI、上下文交接与重试影响，进度活动不能证明交付。

- **思考**：同一完成状态是否有一致保证？本版本OpenCode/Pi仍在usesResultEvent=false且exitCode=0时判completed，错误事件只记录不必然改变结算；Qoder依赖result。deadline仍仅控制firstEvent等待与失败后切换，首JSON后等待结果可超过allowedWaitSeconds。副作用失败后自动换模型、默认放权和只杀直接子进程要求独立验收。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对手动在各CLI间搬运任务，增量是把三种JSON协议统一到DSH子代理结果、状态查询和模型链；新增DRIVERS/sink抽象减少每类CLI重复生命周期代码。子代理句柄/结算复用DSH上游helper，CLI模型能力属于外部工具，不能算插件原创或由数量推导质量。

相对手动在各CLI间搬运任务，增量是把三种JSON协议统一到DSH子代理结果、状态查询和模型链；新增DRIVERS/sink抽象减少每类CLI重复生命周期代码。子代理句柄/结算复用DSH上游helper，CLI模型能力属于外部工具，不能算插件原创或由数量推导质量。

Provider/Run和DRIVERS/sink分离、有界ledger及stderr尾部便于借鉴；复用应增加驱动终结契约、末尾无换行处理、全程deadline与进程树取消。

固定源码依据：[lib/index.js](https://github.com/1373700184/dsh-subagent/blob/a0b1147ed7a752c119c79d2d73e3adc2161b3588/lib/index.js)、[src/client.js](https://github.com/1373700184/dsh-subagent/blob/a0b1147ed7a752c119c79d2d73e3adc2161b3588/src/client.js)、[cordis.patch.yml](https://github.com/1373700184/dsh-subagent/blob/a0b1147ed7a752c119c79d2d73e3adc2161b3588/cordis.patch.yml)、[package.json](https://github.com/1373700184/dsh-subagent/blob/a0b1147ed7a752c119c79d2d73e3adc2161b3588/package.json)。

<a id="detail-section-5"></a>

### 主要限制

同一完成状态是否有一致保证？本版本OpenCode/Pi仍在usesResultEvent=false且exitCode=0时判completed，错误事件只记录不必然改变结算；Qoder依赖result。deadline仍仅控制firstEvent等待与失败后切换，首JSON后等待结果可超过allowedWaitSeconds。副作用失败后自动换模型、默认放权和只杀直接子进程要求独立验收。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：0.7.2；版本日期：2026-10-21（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[a0b1147e](https://github.com/1373700184/dsh-subagent/tree/a0b1147ed7a752c119c79d2d73e3adc2161b3588)；本轮基准：2026-10-21T04:06:46Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：抽读Provider/Run、三驱动、账本、探测、前端与patch；未跑CLI、目标测试或宿主，不核实订阅额度和真实费用。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

待验证假设：为每驱动定义错误终态与产物断言，并把绝对截止传播到Run，可减少“exit0但错误”和有活动无限等的误报。依据是当前usesResultEvent分叉与首事件后直接await，尚未实现。对照错误后exit0、心跳但无结果、无换行终帧和正常交付，测误报完成、超时覆盖与取消残留；若统一规则伤害合法CLI语义，应返回驱动特定状态而非假装一致。

隔离宿主对三协议覆盖错误后exit0、仅元数据卡住、无换行终帧、取消后子进程与失败回退重复写入；本轮不执行目标代码。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 1703 | 1532 | 119 | — |
| .md | source | 1 | 96 | — | — | 1391 |
| .mjs | source | 1 | 30 | 28 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/1373700184/dsh-subagent/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
