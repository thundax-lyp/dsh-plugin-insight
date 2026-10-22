# dsh-wsl-wininput

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[eaa10e6](https://github.com/173787247/dsh-wsl-wininput/tree/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-wininput)
<!-- END META -->

> **实现功能**：让 WSL 中的 DSH 按窗口和 UI Automation 元素定向发送 Windows 输入。

> **核心亮点**：相对全局键鼠模拟，它强调先选窗口/元素再执行，可在部分路径避免抢焦点；相对完整 RPA，它是单工具、零长期服务的轻量桥。贡献是 WSL 到 Windows UIA/输入的窄接口与结构化回执，不是新的 UI Automation 算法。 参见[Q03](#research-q03)。

> **风险与缺陷**：最关键风险是目标解析错误后仍产生真实输入。窗口标题可能重复，元素树会变化，坐标受 DPI/多屏影响；非前台输入并非所有应用都支持，管理员窗口还受权限边界。源码级参数检查不能证明真实应用收到动作，也未看到统一的用户审批或动作后结构差异验证。 参见[Q04](#research-q04)。

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
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · WSL 内定向控制 Windows 窗口适合什么自动化任务？](#detail-section-11)
  - [Q02 · win_invoke 如何跨 WSL、PowerShell 与 UI Automation 执行动作？](#detail-section-12)
  - [Q03 · dsh-wsl-wininput 相对简单替代的独立增量是什么？](#detail-section-13)
  - [Q04 · 窗口匹配、焦点、权限和坐标会造成哪些误操作？](#detail-section-14)
  - [Q05 · dsh-wsl-wininput 启动、持续使用与失败恢复依赖什么？](#detail-section-15)
  - [Q06 · 一次合格 Windows 动作的延迟与恢复成本是什么？](#detail-section-16)
  - [Q07 · 参数约束、目标解析和回执设计是否足以复用？](#detail-section-17)
  - [Q08 · 能否用读后写验证与幂等动作令牌降低误点？](#detail-section-18)
  - [Q09 · dsh-wsl-wininput 适合观察、试用还是安装，停止条件是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向 DSH 运行在 WSL、但需要操作明确 Windows 窗口或控件的用户。输入是窗口选择器、UIA 属性或按键/点击动作；合格结果是目标窗口被唯一识别，动作落在预期元素，最好不抢前台焦点，并返回足够信息确认执行。简单替代是手动操作、普通 SendKeys 或桌面自动化框架。

参见[Q01](#research-q01)。

基线是手动桌面操作或全局 SendKeys；前者可靠但不可自动化，后者简单却容易抢焦点或打到错误窗口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| UIA 元素调用 | 按属性定位后 Invoke | 依赖稳定 Automation 元素和权限 |
| 窗口定向按键 | 向选择的 Windows 窗口发键 | 应用可能不接受后台输入 |
| 窗口定向点击 | 在目标窗口计算点击位置 | DPI、多屏和布局变化需验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Windows + WSL | 必需 | 运行 DSH 与目标桌面 | 非 WSL 返回不适用 |
| 标准路径 PowerShell | 必需 | 跨边界执行 Windows 脚本 | 找不到时工具失败 |
| UIA 可访问的目标应用 | 特定动作必需 | 按元素定位与 Invoke | 自绘/提权应用可能不可见 |
| 唯一窗口/元素选择器 | 效果必需 | 避免把输入发错目标 | 多匹配应拒绝并重查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 确认 WSL 和 PowerShell，打开低风险目标 | 平台检测通过 |
| 定位 | 提供窗口与元素条件 | 只得到一个可解释目标；多匹配停止 |
| 执行 | 调用 Invoke 或定向按键/点击 | 回执标出目标和执行方式 |
| 验收/恢复 | 读取目标状态，异常时重新定位而非盲重试 | 状态符合预期或人工撤销 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 无需常驻服务；资源金额未知 | 配置环境和学习选择器 | 兼容应用范围未知 |
| 持续使用 | 每次 PowerShell/UIA 进程与枚举 | 构造参数并核对回执 | P95 延迟未知 |
| 失败恢复 | 误输入可能有业务代价 | 重新定位、撤销和处理权限 | 恢复时长取决于目标应用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 定向输入 | 源码按窗口/元素执行而非全局广播 | 真实应用命中率未测 |
| 减少抢焦点 | 部分 UIA 模式可不移动光标 | 并非所有应用支持 |
| 轻量部署 | 无常驻 Windows 服务 | 每次进程开销未知 |

> **思考**：最关键风险是目标解析错误后仍产生真实输入。窗口标题可能重复，元素树会变化，坐标受 DPI/多屏影响；非前台输入并非所有应用都支持，管理员窗口还受权限边界。源码级参数检查不能证明真实应用收到动作，也未看到统一的用户审批或动作后结构差异验证。 参见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对全局键鼠模拟，它强调先选窗口/元素再执行，可在部分路径避免抢焦点；相对完整 RPA，它是单工具、零长期服务的轻量桥。贡献是 WSL 到 Windows UIA/输入的窄接口与结构化回执，不是新的 UI Automation 算法。 参见[Q03](#research-q03)。

相对全局键鼠模拟，它强调先选窗口/元素再执行，可在部分路径避免抢焦点；相对完整 RPA，它是单工具、零长期服务的轻量桥。贡献是 WSL 到 Windows UIA/输入的窄接口与结构化回执，不是新的 UI Automation 算法。 参见[Q03](#research-q03)。

模块把 WSL 检测、宿主进程、参数/格式与具体执行分离，工具面较窄，便于审计。可借鉴的是元素模式优先于坐标，但执行脚本仍承担大量 Windows 特例；没有长期缓存可减少陈旧句柄，却增加每次启动成本。源码测试存在，本轮未运行，不能把兼容声明写成已验证。 参见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

最关键风险是目标解析错误后仍产生真实输入。窗口标题可能重复，元素树会变化，坐标受 DPI/多屏影响；非前台输入并非所有应用都支持，管理员窗口还受权限边界。源码级参数检查不能证明真实应用收到动作，也未看到统一的用户审批或动作后结构差异验证。 参见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察。仅在低风险、可撤销的桌面任务和唯一窗口选择器上评估；先禁用坐标路径，用计算器/记事本验证元素 Invoke、超时和权限拒绝。任何多匹配仍执行或无状态回执的写动作都应停止。 参见[Q04](#research-q04)、[Q06](#research-q06)与[Q09](#research-q09)。

参见[Q01](#research-q01)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 WSL 到 Windows 输入桥的工具契约与边界判断；焦点、键盘布局、剪贴板和跨权限窗口上的实际落点未在 Windows/WSL 验证，带前置状态的输入意图仍属假设，见[Q08](#research-q08)。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/wininput.js、lib/wininput-exec.js、lib/wsl-host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 README、工具入口、WSL/PowerShell 桥和执行脚本；不运行 Windows side effects。 未运行目标插件、测试、外部服务或真实 Host；源码存在不等于运行通过。
- 下一步：先用同名双窗口和可自动读回的状态测试唯一匹配、拒绝与幂等；任何多匹配仍执行、提权越界或读回不符即停止。

**分析版本**

- **仓库**：[173787247/dsh-wsl-wininput](https://github.com/173787247/dsh-wsl-wininput)
- **版本号**：0.1.0（[固定提交 eaa10e6](https://github.com/173787247/dsh-wsl-wininput/tree/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可为写动作增加先读后写协议：返回目标窗口/元素指纹，用户或代理提交带短期 nonce 的动作，执行后再次读取属性并比对预期；重复 nonce 拒绝。它可能减少错窗口和盲重试，但会增加一次往返并依赖可观察状态。 参见[Q08](#research-q08)。

先用同名双窗口和可自动读回的状态测试唯一匹配、拒绝与幂等；任何多匹配仍执行、提权越界或读回不符即停止。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 129 | — | — | 623 |
| .js | source | 4 | 427 | 361 | 30 | — |
| .js | test | 1 | 50 | 46 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-wininput/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-wininput/issues?q=is%3Aissue+created%3A2026-09-22T16%3A02%3A19.147Z..2026-10-22T16%3A02%3A19.147Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-wininput/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T16%3A02%3A19.147Z..2026-10-22T16%3A02%3A19.147Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41 上判断 dsh-wsl-wininput 的核心贡献、关键质疑、采用边界及可证伪的新设计假设。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · WSL 内定向控制 Windows 窗口适合什么自动化任务？

**研究主题**：场景与需求

#### 完整回答

面向 DSH 运行在 WSL、但需要操作明确 Windows 窗口或控件的用户。输入是窗口选择器、UIA 属性或按键/点击动作；合格结果是目标窗口被唯一识别，动作落在预期元素，最好不抢前台焦点，并返回足够信息确认执行。简单替代是手动操作、普通 SendKeys 或桌面自动化框架。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-18](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/README.md#L15-L18)

作者给出 UIA、按键和点击用法。

````text
## Usage

```
win_invoke action=invoke pid=1234 expectName="Save" expectType=Button
````

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · win_invoke 如何跨 WSL、PowerShell 与 UI Automation 执行动作？

**研究主题**：功能与机制

#### 完整回答

插件注册 win_invoke 工具，把结构化参数交给 lib/wininput，定位 Windows PowerShell 后启动脚本执行层；执行层枚举窗口和 UIA 元素，优先调用元素模式，也支持向指定窗口发送按键和点击。WSL 宿主模块负责平台检测、路径和超时。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:17-20](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/index.js#L17-L20)

入口注册单一 win_invoke 模型工具。

```text
  ctx.tools.register({
    name: "win_invoke",
    description: "Targeted Windows input from WSL: invoke a UI Automation element by handle, type text into a window, or click a window-relative point.",
    parameters: core.parameters(),
```

**依据 2 · 源码核查**：[lib/wininput.js:4-7](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/lib/wininput.js#L4-L7)

中间层限定可执行动作并提供参数与输出契约。

```text
export const ACTIONS = ["invoke", "type", "key", "click", "scroll"];

export function assertAction(action) {
  if (!ACTIONS.includes(action)) {
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · dsh-wsl-wininput 相对简单替代的独立增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对全局键鼠模拟，它强调先选窗口/元素再执行，可在部分路径避免抢焦点；相对完整 RPA，它是单工具、零长期服务的轻量桥。贡献是 WSL 到 Windows UIA/输入的窄接口与结构化回执，不是新的 UI Automation 算法。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:17-20](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/index.js#L17-L20)

入口注册单一 win_invoke 模型工具。

```text
  ctx.tools.register({
    name: "win_invoke",
    description: "Targeted Windows input from WSL: invoke a UI Automation element by handle, type text into a window, or click a window-relative point.",
    parameters: core.parameters(),
```

**依据 2 · 源码核查**：[lib/wininput.js:4-7](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/lib/wininput.js#L4-L7)

中间层限定可执行动作并提供参数与输出契约。

```text
export const ACTIONS = ["invoke", "type", "key", "click", "scroll"];

export function assertAction(action) {
  if (!ACTIONS.includes(action)) {
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 窗口匹配、焦点、权限和坐标会造成哪些误操作？

**研究主题**：缺陷与关键质疑

#### 完整回答

最关键风险是目标解析错误后仍产生真实输入。窗口标题可能重复，元素树会变化，坐标受 DPI/多屏影响；非前台输入并非所有应用都支持，管理员窗口还受权限边界。源码级参数检查不能证明真实应用收到动作，也未看到统一的用户审批或动作后结构差异验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wininput.js:4-7](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/lib/wininput.js#L4-L7)

中间层限定可执行动作并提供参数与输出契约。

```text
export const ACTIONS = ["invoke", "type", "key", "click", "scroll"];

export function assertAction(action) {
  if (!ACTIONS.includes(action)) {
```

**依据 2 · 作者声明**：[README.md:15-18](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/README.md#L15-L18)

作者给出 UIA、按键和点击用法。

````text
## Usage

```
win_invoke action=invoke pid=1234 expectName="Save" expectType=Button
````

#### 缺口

- 真实 Windows 应用、DPI、多屏、前后台和管理员权限组合下的目标准确率
  **影响**：误输入可能修改错误应用且难以自动撤销
  **进一步探讨**：用同名双窗口、移动窗口、125%/150% DPI、前后台和提权窗口构造矩阵，记录拒绝、唯一命中和实际状态变化

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-wsl-wininput 启动、持续使用与失败恢复依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

启动要求 Windows+WSL、标准路径 PowerShell 和可访问目标进程；UIA 模式依赖应用暴露稳定 Automation 属性。失败恢复要区分找不到窗口、多个匹配、元素陈旧、超时和动作已部分生效，用户需重新读取目标状态再决定是否重试。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:17-20](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/index.js#L17-L20)

入口注册单一 win_invoke 模型工具。

```text
  ctx.tools.register({
    name: "win_invoke",
    description: "Targeted Windows input from WSL: invoke a UI Automation element by handle, type text into a window, or click a window-relative point.",
    parameters: core.parameters(),
```

**依据 2 · 作者声明**：[README.md:15-18](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/README.md#L15-L18)

作者给出 UIA、按键和点击用法。

````text
## Usage

```
win_invoke action=invoke pid=1234 expectName="Save" expectType=Button
````

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 一次合格 Windows 动作的延迟与恢复成本是什么？

**研究主题**：效果与总成本

#### 完整回答

合格任务是一条动作作用到唯一预期目标且状态符合预期。首次要配置 WSL/PowerShell 和学习选择器；持续成本是每次 PowerShell 进程、UIA 枚举与模型选择参数；失败恢复包括重新定位、撤销误输入和处理焦点变化。没有多应用成功率、P95 延迟、误目标率和人工恢复分钟数。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-18](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/README.md#L15-L18)

作者给出 UIA、按键和点击用法。

````text
## Usage

```
win_invoke action=invoke pid=1234 expectName="Save" expectType=Button
````

**依据 2 · 源码核查**：[lib/wininput.js:4-7](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/lib/wininput.js#L4-L7)

中间层限定可执行动作并提供参数与输出契约。

```text
export const ACTIONS = ["invoke", "type", "key", "click", "scroll"];

export function assertAction(action) {
  if (!ACTIONS.includes(action)) {
```

#### 缺口

- 每动作 PowerShell 启动时延、UIA 枚举时延、成功率、误目标率和恢复分钟数
  **影响**：无法给出合格任务单位成本、成功率、节时或 ROI
  **进一步探讨**：对三类应用各执行 100 个可验证动作，与手工及全局 SendKeys 比较 P50/P95、错误和恢复

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 参数约束、目标解析和回执设计是否足以复用？

**研究主题**：工程质量与复用

#### 完整回答

模块把 WSL 检测、宿主进程、参数/格式与具体执行分离，工具面较窄，便于审计。可借鉴的是元素模式优先于坐标，但执行脚本仍承担大量 Windows 特例；没有长期缓存可减少陈旧句柄，却增加每次启动成本。源码测试存在，本轮未运行，不能把兼容声明写成已验证。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:17-20](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/index.js#L17-L20)

入口注册单一 win_invoke 模型工具。

```text
  ctx.tools.register({
    name: "win_invoke",
    description: "Targeted Windows input from WSL: invoke a UI Automation element by handle, type text into a window, or click a window-relative point.",
    parameters: core.parameters(),
```

**依据 2 · 源码核查**：[lib/wininput.js:4-7](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/lib/wininput.js#L4-L7)

中间层限定可执行动作并提供参数与输出契约。

```text
export const ACTIONS = ["invoke", "type", "key", "click", "scroll"];

export function assertAction(action) {
  if (!ACTIONS.includes(action)) {
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 能否用读后写验证与幂等动作令牌降低误点？

**研究主题**：新假设与验证

#### 完整回答

可为写动作增加先读后写协议：返回目标窗口/元素指纹，用户或代理提交带短期 nonce 的动作，执行后再次读取属性并比对预期；重复 nonce 拒绝。它可能减少错窗口和盲重试，但会增加一次往返并依赖可观察状态。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wininput.js:4-7](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/lib/wininput.js#L4-L7)

中间层限定可执行动作并提供参数与输出契约。

```text
export const ACTIONS = ["invoke", "type", "key", "click", "scroll"];

export function assertAction(action) {
  if (!ACTIONS.includes(action)) {
```

**依据 2 · 作者声明**：[README.md:15-18](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/README.md#L15-L18)

作者给出 UIA、按键和点击用法。

````text
## Usage

```
win_invoke action=invoke pid=1234 expectName="Save" expectType=Button
````

#### 缺口

- 读后写 nonce 是否能覆盖常见误操作而不过度增加交互
  **影响**：新方向仍是推演，不能计入插件当前贡献或效果
  **进一步探讨**：原型要求目标指纹和预期属性，若误目标降为零且中位延迟增加低于 300ms则支持，否则否定

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · dsh-wsl-wininput 适合观察、试用还是安装，停止条件是什么？

**研究主题**：采用判断

#### 完整回答

建议观察。仅在低风险、可撤销的桌面任务和唯一窗口选择器上评估；先禁用坐标路径，用计算器/记事本验证元素 Invoke、超时和权限拒绝。任何多匹配仍执行或无状态回执的写动作都应停止。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-18](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/README.md#L15-L18)

作者给出 UIA、按键和点击用法。

````text
## Usage

```
win_invoke action=invoke pid=1234 expectName="Save" expectType=Button
````

**依据 2 · 源码核查**：[lib/wininput.js:4-7](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/lib/wininput.js#L4-L7)

中间层限定可执行动作并提供参数与输出契约。

```text
export const ACTIONS = ["invoke", "type", "key", "click", "scroll"];

export function assertAction(action) {
  if (!ACTIONS.includes(action)) {
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
