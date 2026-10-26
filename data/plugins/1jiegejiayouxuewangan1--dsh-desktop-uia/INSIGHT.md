# dsh-desktop-uia

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[8237631](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/tree/8237631e1dc7d1aaf37466e9682bf3299ad53cd0)

<!-- BEGIN META -->
[![npm 30d 516](https://img.shields.io/static/v1?label=npm+30d&message=516&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-desktop-uia) [![最新发布 2026-10-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-06&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-desktop-uia)
<!-- END META -->

> **实现功能**：通过 Windows UI Automation 暴露桌面观察、动作与审批。

> **核心亮点**：把 UIA 的观察、选择、审批、执行和反馈接入 DSH，而非裸坐标点击；增量是工具契约、风险分类和日志，平台 UIA 非原创。 参见[Q03](#research-q03)。

> **风险与缺陷**：自绘控件、焦点、DPI、多屏、UIPI 和选择器漂移会错目标。审批后目标仍可变化；剪贴板/发送/删除有不可逆副作用，后置快照不能撤销。 参见[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 桌面控制适合哪些 Windows 任务？](#detail-section-11)
  - [Q02 · 快照、审批、执行与反馈如何闭环？](#detail-section-12)
  - [Q03 · dsh-desktop-uia 相对简单替代的独立增量是什么？](#detail-section-13)
  - [Q04 · 焦点和 UI 漂移如何误操作？](#detail-section-14)
  - [Q05 · dsh-desktop-uia 启动、持续使用与失败恢复依赖什么？](#detail-section-15)
  - [Q06 · 每个合格桌面任务成本多少？](#detail-section-16)
  - [Q07 · 审批和日志是否可信？](#detail-section-17)
  - [Q08 · 可撤销意图能否降低误操作？](#detail-section-18)
  - [Q09 · dsh-desktop-uia 适合观察、试用还是安装，停止条件是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向操作无 API Windows 应用的用户。输入是窗口/元素、动作和文本；合格结果是身份明确、写动作获批、后置快照证明变化且日志可追。替代是人工、PowerShell 或专用 API。

参见[Q01](#research-q01)。

人工、PowerShell 或应用 API；API 更稳，UIA 只在缺 API 时占优。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 快照 | 窗口/UIA 树 | 自绘可能不可见 |
| 动作 | 输入/键鼠/窗口 | 需审批 |
| 等待启动 | 同步状态/进程 | 焦点需核对 |
| 审计 | 策略和日志 | 需脱敏 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Windows UIA | 必需 | 观察操作 | 自绘控件受限 |
| DSH slot | 必需 | 工具设置 | 漂移丢入口 |
| 选择器/审批 | 效果必需 | 约束目标 | 漂移仍危险 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 观察 | 快照身份 | 状态明确 |
| 计划/批准 | 说明预期变化 | 目标未变 |
| 执行/恢复 | 复查差分，错则撤销 | 无跨应用副作用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 隔离环境 | 建策略 | 适配未知 |
| 持续 | token/日志 | 审批等待 | 时延未知 |
| 恢复 | 错误动作代价 | 撤销审计 | 可能不可逆 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 无 API 覆盖 | UIA 工具接线 | 成功率未测 |
| 安全反馈 | 审批日志后置观察 | TOCTOU 未测 |
| 设置 | 可调策略 | 误配放大风险 |

> **思考**：自绘控件、焦点、DPI、多屏、UIPI 和选择器漂移会错目标。审批后目标仍可变化；剪贴板/发送/删除有不可逆副作用，后置快照不能撤销。 参见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 UIA 的观察、选择、审批、执行和反馈接入 DSH，而非裸坐标点击；增量是工具契约、风险分类和日志，平台 UIA 非原创。 参见[Q03](#research-q03)。

把 UIA 的观察、选择、审批、执行和反馈接入 DSH，而非裸坐标点击；增量是工具契约、风险分类和日志，平台 UIA 非原创。 参见[Q03](#research-q03)。

authorize 集中绑定工具、动作、窗口、理由和执行，后置观察比直接点击可审计。仍需验证 fail closed、批准绑定与日志脱敏。 参见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

自绘控件、焦点、DPI、多屏、UIPI 和选择器漂移会错目标。审批后目标仍可变化；剪贴板/发送/删除有不可逆副作用，后置快照不能撤销。 参见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察。仅隔离账户做无破坏单应用，只读先行、写逐步审批；错窗、批准后漂移仍执行或日志泄密即停。 参见[Q04](#research-q04)、[Q06](#research-q06)与[Q09](#research-q09)。

参见[Q01](#research-q01)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 Windows UIA 快照、动作、审批和日志闭环的判断；DPI、多屏、UIPI、自绘控件与批准后切窗未在 Windows 验证，状态绑定意图仍待随机漂移实验，见[Q08](#research-q08)。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/tools.js、lib/approval.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 README、入口、工具、审批源码；不运行 Windows。 未运行目标插件、测试、外部服务或真实 Host；源码存在不等于运行通过。
- 下一步：只读后故障注入批准切窗；未批准写、错窗或泄密即停。

**分析版本**

- **仓库**：[1jiegejiayouxuewangan1/dsh-desktop-uia](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia)
- **版本号**：1.1.3（[固定提交 8237631](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/tree/8237631e1dc7d1aaf37466e9682bf3299ad53cd0)）
- **版本日期**：2026-10-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

写动作绑定窗口句柄、元素指纹、前置哈希和撤销策略；条件变化即拒绝并显示差分。若动态 UI 假拒绝过高则否定。 参见[Q08](#research-q08)。

只读后故障注入批准切窗；未批准写、错窗或泄密即停。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 858 | — | — | 11088 |
| .js | source | 9 | 3224 | 2603 | 438 | — |
| .mjs | source | 1 | 302 | 241 | 31 | — |
| .mjs | test | 13 | 2284 | 1994 | 109 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 8237631e1dc7d1aaf37466e9682bf3299ad53cd0 上判断 dsh-desktop-uia 的核心贡献、关键质疑、采用边界及可证伪的新设计假设。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌面控制适合哪些 Windows 任务？

**研究主题**：场景与需求

#### 完整回答

面向操作无 API Windows 应用的用户。输入是窗口/元素、动作和文本；合格结果是身份明确、写动作获批、后置快照证明变化且日志可追。替代是人工、PowerShell 或专用 API。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:117-120](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/blob/8237631e1dc7d1aaf37466e9682bf3299ad53cd0/README.md#L117-L120)

作者说明审批安全。

```text
## Approval and safety

A write action passes two layers:

```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 快照、审批、执行与反馈如何闭环？

**研究主题**：功能与机制

#### 完整回答

Host 注册工具组，PowerShell/.NET UIA 获取树并执行动作；snapshot 观察，authorize 按风险批准，动作后反馈和记录；设置页管理模式与日志。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:71-74](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/blob/8237631e1dc7d1aaf37466e9682bf3299ad53cd0/lib/index.js#L71-L74)

注册服务工具设置。

```text
export function apply(ctx, config = {}) {
  const logger = ctx.logger
  const store = new Store({
    dir: typeof config.storageDir === 'string' && config.storageDir !== '' ? config.storageDir : resolveStorageDir(process.env),
```

**依据 2 · 源码核查**：[lib/approval.js:47-50](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/blob/8237631e1dc7d1aaf37466e9682bf3299ad53cd0/lib/approval.js#L47-L50)

集中审批执行。

```text
export async function authorize({ ctx, store, toolName, action, window, reason, exec }) {
  const settings = store.settings
  const policy = settings.approval
  const processName = typeof window?.process === 'string' ? window.process : ''
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · dsh-desktop-uia 相对简单替代的独立增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

把 UIA 的观察、选择、审批、执行和反馈接入 DSH，而非裸坐标点击；增量是工具契约、风险分类和日志，平台 UIA 非原创。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:71-74](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/blob/8237631e1dc7d1aaf37466e9682bf3299ad53cd0/lib/index.js#L71-L74)

注册服务工具设置。

```text
export function apply(ctx, config = {}) {
  const logger = ctx.logger
  const store = new Store({
    dir: typeof config.storageDir === 'string' && config.storageDir !== '' ? config.storageDir : resolveStorageDir(process.env),
```

**依据 2 · 源码核查**：[lib/approval.js:47-50](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/blob/8237631e1dc7d1aaf37466e9682bf3299ad53cd0/lib/approval.js#L47-L50)

集中审批执行。

```text
export async function authorize({ ctx, store, toolName, action, window, reason, exec }) {
  const settings = store.settings
  const policy = settings.approval
  const processName = typeof window?.process === 'string' ? window.process : ''
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 焦点和 UI 漂移如何误操作？

**研究主题**：缺陷与关键质疑

#### 完整回答

自绘控件、焦点、DPI、多屏、UIPI 和选择器漂移会错目标。审批后目标仍可变化；剪贴板/发送/删除有不可逆副作用，后置快照不能撤销。

#### 证据与依据

**依据 1 · 源码核查**：[lib/approval.js:47-50](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/blob/8237631e1dc7d1aaf37466e9682bf3299ad53cd0/lib/approval.js#L47-L50)

集中审批执行。

```text
export async function authorize({ ctx, store, toolName, action, window, reason, exec }) {
  const settings = store.settings
  const policy = settings.approval
  const processName = typeof window?.process === 'string' ? window.process : ''
```

**依据 2 · 作者声明**：[README.md:117-120](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/blob/8237631e1dc7d1aaf37466e9682bf3299ad53cd0/README.md#L117-L120)

作者说明审批安全。

```text
## Approval and safety

A write action passes two layers:

```

#### 缺口

- 批准到执行间目标变化是否拒绝
  **影响**：可能错应用输入或不可逆操作
  **进一步探讨**：批准后切窗、重排、改 DPI/权限，检查 fail closed

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-desktop-uia 启动、持续使用与失败恢复依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

依赖 Windows、PowerShell/.NET UIA、DSH 工具/设置 slot 和同级权限。持续依赖稳定选择器；失败须停止后续、核对应用、人工撤销并保护日志敏感内容。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:71-74](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/blob/8237631e1dc7d1aaf37466e9682bf3299ad53cd0/lib/index.js#L71-L74)

注册服务工具设置。

```text
export function apply(ctx, config = {}) {
  const logger = ctx.logger
  const store = new Store({
    dir: typeof config.storageDir === 'string' && config.storageDir !== '' ? config.storageDir : resolveStorageDir(process.env),
```

**依据 2 · 作者声明**：[README.md:117-120](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/blob/8237631e1dc7d1aaf37466e9682bf3299ad53cd0/README.md#L117-L120)

作者说明审批安全。

```text
## Approval and safety

A write action passes two layers:

```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 每个合格桌面任务成本多少？

**研究主题**：效果与总成本

#### 完整回答

单位是一段流程在正确窗口完成且无未授权副作用。首次建选择器；持续含快照 token、审批和等待；恢复可能重建文档。缺各应用成功率、误点率与恢复分钟。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:117-120](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/blob/8237631e1dc7d1aaf37466e9682bf3299ad53cd0/README.md#L117-L120)

作者说明审批安全。

```text
## Approval and safety

A write action passes two layers:

```

**依据 2 · 源码核查**：[lib/approval.js:47-50](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/blob/8237631e1dc7d1aaf37466e9682bf3299ad53cd0/lib/approval.js#L47-L50)

集中审批执行。

```text
export async function authorize({ ctx, store, toolName, action, window, reason, exec }) {
  const settings = store.settings
  const policy = settings.approval
  const processName = typeof window?.process === 'string' ? window.process : ''
```

#### 缺口

- 任务成功率、动作 P95、误点率、审批数、恢复分钟
  **影响**：无法给出合格任务单位成本、成功率、节时或 ROI
  **进一步探讨**：三类应用各二十任务对比人工

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 审批和日志是否可信？

**研究主题**：工程质量与复用

#### 完整回答

authorize 集中绑定工具、动作、窗口、理由和执行，后置观察比直接点击可审计。仍需验证 fail closed、批准绑定与日志脱敏。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:71-74](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/blob/8237631e1dc7d1aaf37466e9682bf3299ad53cd0/lib/index.js#L71-L74)

注册服务工具设置。

```text
export function apply(ctx, config = {}) {
  const logger = ctx.logger
  const store = new Store({
    dir: typeof config.storageDir === 'string' && config.storageDir !== '' ? config.storageDir : resolveStorageDir(process.env),
```

**依据 2 · 源码核查**：[lib/approval.js:47-50](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/blob/8237631e1dc7d1aaf37466e9682bf3299ad53cd0/lib/approval.js#L47-L50)

集中审批执行。

```text
export async function authorize({ ctx, store, toolName, action, window, reason, exec }) {
  const settings = store.settings
  const policy = settings.approval
  const processName = typeof window?.process === 'string' ? window.process : ''
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 可撤销意图能否降低误操作？

**研究主题**：新假设与验证

#### 完整回答

写动作绑定窗口句柄、元素指纹、前置哈希和撤销策略；条件变化即拒绝并显示差分。若动态 UI 假拒绝过高则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/approval.js:47-50](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/blob/8237631e1dc7d1aaf37466e9682bf3299ad53cd0/lib/approval.js#L47-L50)

集中审批执行。

```text
export async function authorize({ ctx, store, toolName, action, window, reason, exec }) {
  const settings = store.settings
  const policy = settings.approval
  const processName = typeof window?.process === 'string' ? window.process : ''
```

**依据 2 · 作者声明**：[README.md:117-120](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/blob/8237631e1dc7d1aaf37466e9682bf3299ad53cd0/README.md#L117-L120)

作者说明审批安全。

```text
## Approval and safety

A write action passes two layers:

```

#### 缺口

- 状态绑定能否降错且假拒绝低
  **影响**：新方向仍是推演，不能计入插件当前贡献或效果
  **进一步探讨**：百次随机窗口变化，错目标零且假拒绝<10%

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · dsh-desktop-uia 适合观察、试用还是安装，停止条件是什么？

**研究主题**：采用判断

#### 完整回答

建议观察。仅隔离账户做无破坏单应用，只读先行、写逐步审批；错窗、批准后漂移仍执行或日志泄密即停。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:117-120](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/blob/8237631e1dc7d1aaf37466e9682bf3299ad53cd0/README.md#L117-L120)

作者说明审批安全。

```text
## Approval and safety

A write action passes two layers:

```

**依据 2 · 源码核查**：[lib/approval.js:47-50](https://github.com/1jiegejiayouxuewangan1/dsh-desktop-uia/blob/8237631e1dc7d1aaf37466e9682bf3299ad53cd0/lib/approval.js#L47-L50)

集中审批执行。

```text
export async function authorize({ ctx, store, toolName, action, window, reason, exec }) {
  const settings = store.settings
  const policy = settings.approval
  const processName = typeof window?.process === 'string' ? window.process : ''
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
