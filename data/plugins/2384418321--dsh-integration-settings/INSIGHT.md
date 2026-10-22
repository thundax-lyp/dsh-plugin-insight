# dsh-integration-settings

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[758bd55](https://github.com/2384418321/dsh-integration-settings/tree/758bd55a04613b3e6b1033456376f5450698c82c)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：在设置页管理 MCP 网关、凭据探测与 thinking 配置。

> **核心亮点**：提供 profile 定位、受管块合并、网关表单/探测与 thinking 选项；贡献是 DSH 配置与 UI 接线，不是网关协议。 参见[Q03](#research-q03)。

> **风险与缺陷**：可能格式正确却写错 profile，或覆盖用户并发编辑。探测会外发凭据；保存不等于重启生效。压缩客户端也降低审计透明度。 参见[Q04](#research-q04)。

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
  - [Q01 · 设置面板服务什么配置任务？](#detail-section-11)
  - [Q02 · profile、受管块和探测如何协作？](#detail-section-12)
  - [Q03 · dsh-integration-settings 相对简单替代的独立增量是什么？](#detail-section-13)
  - [Q04 · 错 profile/泄密如何破坏配置？](#detail-section-14)
  - [Q05 · dsh-integration-settings 启动、持续使用与失败恢复依赖什么？](#detail-section-15)
  - [Q06 · 安全变更成本怎样算？](#detail-section-16)
  - [Q07 · 受管块与定时器是否可靠？](#detail-section-17)
  - [Q08 · 声明式事务能否替代直接写？](#detail-section-18)
  - [Q09 · dsh-integration-settings 适合观察、试用还是安装，停止条件是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向集中配置 MCP 网关和 thinking 的用户。输入是目标 profile、端点/凭据和策略；合格结果是只写正确 patch 管理块，重启读回一致，探测不泄密且可恢复。替代是手工 YAML。

参见[Q01](#research-q01)。

手工 YAML 可版本控制审 diff，步骤多但不会自动探测。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 网关管理 | 增删改配置 | 核对 profile |
| 凭据探测 | 检查端点 | 外部请求 |
| thinking | 调整模型选项 | 依赖提供商 |
| 受管块 | 限制写范围 | 并发需拒绝 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH rc.2 profile/slot | 必需 | 定位和面板 | 漂移错写 |
| 可写 patch/providers | 必需 | 持久化 | 并发需 CAS |
| 网络凭据/重启副本 | 探测/恢复 | 验证和恢复 | 秘密外发风险 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 预检 | 显示路径和哈希 | 确认作用域 |
| 计划/写入 | 审脱敏 diff 后原子存 | 块外不变 |
| 重启/恢复 | 读回，失败还原 | 凭据不泄露 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 账号成本未知 | 识别备份 | 环境工时未知 |
| 持续 | 探测网络 | 维护重启 | 请求量未知 |
| 恢复 | 不可启动/泄密 | 还原吊销 | 成功率未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 可视配置 | 进入 settings | 生效未证 |
| 受管写 | 限制块范围 | 并发未测 |
| 探测 | 反馈状态 | 有网络副作用 |

> **思考**：可能格式正确却写错 profile，或覆盖用户并发编辑。探测会外发凭据；保存不等于重启生效。压缩客户端也降低审计透明度。 参见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：提供 profile 定位、受管块合并、网关表单/探测与 thinking 选项；贡献是 DSH 配置与 UI 接线，不是网关协议。 参见[Q03](#research-q03)。

提供 profile 定位、受管块合并、网关表单/探测与 thinking 选项；贡献是 DSH 配置与 UI 接线，不是网关协议。 参见[Q03](#research-q03)。

受管块比重写 YAML 安全，移除无关 UI 缩面。仍需验证 CAS、原子写、脱敏、探测超时和 dispose 定时器。 参见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

可能格式正确却写错 profile，或覆盖用户并发编辑。探测会外发凭据；保存不等于重启生效。压缩客户端也降低审计透明度。 参见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察。先只读确认 profile 和受管块并禁自动探测；备份 profile 只改无秘密测试端点。错 profile、块外变化、泄密、无授权探测或回滚失败即停。 参见[Q04](#research-q04)、[Q06](#research-q06)与[Q09](#research-q09)。

参见[Q01](#research-q01)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认 profile 解析、受管块合并、网关/思考设置与周期刷新；双 profile、并发 patch、秘密遮蔽和重启读回未写真实配置验证，CAS 离线事务仍待实验，见[Q08](#research-q08)。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 README、Host 入口、受管块、定时器与客户端；不写 profile/连网关。 未运行目标插件、测试、外部服务或真实 Host；源码存在不等于运行通过。
- 下一步：保存前后字节 diff 后重启读回；块外变化、错 profile、泄密或恢复不一致即停。

**分析版本**

- **仓库**：[2384418321/dsh-integration-settings](https://github.com/2384418321/dsh-integration-settings)
- **版本号**：0.2.10-dsh.4（[固定提交 758bd55](https://github.com/2384418321/dsh-integration-settings/tree/758bd55a04613b3e6b1033456376f5450698c82c)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

记录真实路径/内容哈希，生成脱敏 diff、重启要求和回滚包；确认后 CAS 写，探测另授权。若并发错写不归零则否定。 参见[Q08](#research-q08)。

保存前后字节 diff 后重启读回；块外变化、错 profile、泄密或恢复不一致即停。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1267 | — | — | 17370 |
| .js | source | 2 | 9435 | 9024 | 356 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/2384418321/dsh-integration-settings/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 758bd55a04613b3e6b1033456376f5450698c82c 上判断 dsh-integration-settings 的核心贡献、关键质疑、采用边界及可证伪的新设计假设。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 设置面板服务什么配置任务？

**研究主题**：场景与需求

#### 完整回答

面向集中配置 MCP 网关和 thinking 的用户。输入是目标 profile、端点/凭据和策略；合格结果是只写正确 patch 管理块，重启读回一致，探测不泄密且可恢复。替代是手工 YAML。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:117-120](https://github.com/2384418321/dsh-integration-settings/blob/758bd55a04613b3e6b1033456376f5450698c82c/README.md#L117-L120)

作者说明设计。

```text
## 设计要点

### MCP 管理
DSH 没有「MCP 注册表」这种东西：**一个 MCP 服务器就是 profile patch 里的一条 loader 行**。
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · profile、受管块和探测如何协作？

**研究主题**：功能与机制

#### 完整回答

Host apply 注册路由并解析 profile/patch；applyManagedBlock 替换标记块，网关管理写条目并探测；settings.section 呈现表单，后台定时刷新。该分叉移除 Skill/人设 UI。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:9322-9325](https://github.com/2384418321/dsh-integration-settings/blob/758bd55a04613b3e6b1033456376f5450698c82c/lib/index.js#L9322-L9325)

注册设置和后台。

```text
function apply(ctx) {
  setHostContext(ctx);
  let queue = Promise.resolve();
  const serialize = (task) => {
```

**依据 2 · 源码核查**：[lib/index.js:7656-7659](https://github.com/2384418321/dsh-integration-settings/blob/758bd55a04613b3e6b1033456376f5450698c82c/lib/index.js#L7656-L7659)

限定受管块替换。

```text
function applyManagedBlock(patchText, block) {
  const text = dropEmptyPatchPlaceholder(patchText || "");
  const start = text.indexOf(START_MARK);
  if (start === -1) {
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · dsh-integration-settings 相对简单替代的独立增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

提供 profile 定位、受管块合并、网关表单/探测与 thinking 选项；贡献是 DSH 配置与 UI 接线，不是网关协议。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:9322-9325](https://github.com/2384418321/dsh-integration-settings/blob/758bd55a04613b3e6b1033456376f5450698c82c/lib/index.js#L9322-L9325)

注册设置和后台。

```text
function apply(ctx) {
  setHostContext(ctx);
  let queue = Promise.resolve();
  const serialize = (task) => {
```

**依据 2 · 源码核查**：[lib/index.js:7656-7659](https://github.com/2384418321/dsh-integration-settings/blob/758bd55a04613b3e6b1033456376f5450698c82c/lib/index.js#L7656-L7659)

限定受管块替换。

```text
function applyManagedBlock(patchText, block) {
  const text = dropEmptyPatchPlaceholder(patchText || "");
  const start = text.indexOf(START_MARK);
  if (start === -1) {
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 错 profile/泄密如何破坏配置？

**研究主题**：缺陷与关键质疑

#### 完整回答

可能格式正确却写错 profile，或覆盖用户并发编辑。探测会外发凭据；保存不等于重启生效。压缩客户端也降低审计透明度。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:7656-7659](https://github.com/2384418321/dsh-integration-settings/blob/758bd55a04613b3e6b1033456376f5450698c82c/lib/index.js#L7656-L7659)

限定受管块替换。

```text
function applyManagedBlock(patchText, block) {
  const text = dropEmptyPatchPlaceholder(patchText || "");
  const start = text.indexOf(START_MARK);
  if (start === -1) {
```

**依据 2 · 作者声明**：[README.md:117-120](https://github.com/2384418321/dsh-integration-settings/blob/758bd55a04613b3e6b1033456376f5450698c82c/README.md#L117-L120)

作者说明设计。

```text
## 设计要点

### MCP 管理
DSH 没有「MCP 注册表」这种东西：**一个 MCP 服务器就是 profile patch 里的一条 loader 行**。
```

#### 缺口

- 双 profile 与并发编辑是否错写/覆盖
  **影响**：破坏启动配置或凭据错作用域
  **进一步探讨**：两个 profile 并发改哈希，检查拒绝且块外字节不变

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-integration-settings 启动、持续使用与失败恢复依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

依赖 DSH rc.2 布局、settings slot、可写 patch/providers；探测依赖网络凭据。持续含 6h 刷新；恢复需变更前副本、目标路径证据、重启和可能吊销。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:9322-9325](https://github.com/2384418321/dsh-integration-settings/blob/758bd55a04613b3e6b1033456376f5450698c82c/lib/index.js#L9322-L9325)

注册设置和后台。

```text
function apply(ctx) {
  setHostContext(ctx);
  let queue = Promise.resolve();
  const serialize = (task) => {
```

**依据 2 · 作者声明**：[README.md:117-120](https://github.com/2384418321/dsh-integration-settings/blob/758bd55a04613b3e6b1033456376f5450698c82c/README.md#L117-L120)

作者说明设计。

```text
## 设计要点

### MCP 管理
DSH 没有「MCP 注册表」这种东西：**一个 MCP 服务器就是 profile patch 里的一条 loader 行**。
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 安全变更成本怎样算？

**研究主题**：效果与总成本

#### 完整回答

单位是一项变更写对 profile、重启生效且可回滚。首次确认路径凭据；持续含探测和维护；恢复 diff/还原/重启。缺错 profile 率、请求量和恢复分钟。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:117-120](https://github.com/2384418321/dsh-integration-settings/blob/758bd55a04613b3e6b1033456376f5450698c82c/README.md#L117-L120)

作者说明设计。

```text
## 设计要点

### MCP 管理
DSH 没有「MCP 注册表」这种东西：**一个 MCP 服务器就是 profile patch 里的一条 loader 行**。
```

**依据 2 · 源码核查**：[lib/index.js:7656-7659](https://github.com/2384418321/dsh-integration-settings/blob/758bd55a04613b3e6b1033456376f5450698c82c/lib/index.js#L7656-L7659)

限定受管块替换。

```text
function applyManagedBlock(patchText, block) {
  const text = dropEmptyPatchPlaceholder(patchText || "");
  const start = text.indexOf(START_MARK);
  if (start === -1) {
```

#### 缺口

- 变更分钟、重启数、探测量、错profile率和回滚率
  **影响**：无法给出合格任务单位成本、成功率、节时或 ROI
  **进一步探讨**：十个变更对比 YAML 与面板

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 受管块与定时器是否可靠？

**研究主题**：工程质量与复用

#### 完整回答

受管块比重写 YAML 安全，移除无关 UI 缩面。仍需验证 CAS、原子写、脱敏、探测超时和 dispose 定时器。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:9322-9325](https://github.com/2384418321/dsh-integration-settings/blob/758bd55a04613b3e6b1033456376f5450698c82c/lib/index.js#L9322-L9325)

注册设置和后台。

```text
function apply(ctx) {
  setHostContext(ctx);
  let queue = Promise.resolve();
  const serialize = (task) => {
```

**依据 2 · 源码核查**：[lib/index.js:7656-7659](https://github.com/2384418321/dsh-integration-settings/blob/758bd55a04613b3e6b1033456376f5450698c82c/lib/index.js#L7656-L7659)

限定受管块替换。

```text
function applyManagedBlock(patchText, block) {
  const text = dropEmptyPatchPlaceholder(patchText || "");
  const start = text.indexOf(START_MARK);
  if (start === -1) {
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 声明式事务能否替代直接写？

**研究主题**：新假设与验证

#### 完整回答

记录真实路径/内容哈希，生成脱敏 diff、重启要求和回滚包；确认后 CAS 写，探测另授权。若并发错写不归零则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:7656-7659](https://github.com/2384418321/dsh-integration-settings/blob/758bd55a04613b3e6b1033456376f5450698c82c/lib/index.js#L7656-L7659)

限定受管块替换。

```text
function applyManagedBlock(patchText, block) {
  const text = dropEmptyPatchPlaceholder(patchText || "");
  const start = text.indexOf(START_MARK);
  if (start === -1) {
```

**依据 2 · 作者声明**：[README.md:117-120](https://github.com/2384418321/dsh-integration-settings/blob/758bd55a04613b3e6b1033456376f5450698c82c/README.md#L117-L120)

作者说明设计。

```text
## 设计要点

### MCP 管理
DSH 没有「MCP 注册表」这种东西：**一个 MCP 服务器就是 profile patch 里的一条 loader 行**。
```

#### 缺口

- CAS 事务能否消除覆盖且不显著变慢
  **影响**：新方向仍是推演，不能计入插件当前贡献或效果
  **进一步探讨**：二十并发/双profile任务，错写零且时间<20%

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · dsh-integration-settings 适合观察、试用还是安装，停止条件是什么？

**研究主题**：采用判断

#### 完整回答

建议观察。先只读确认 profile 和受管块并禁自动探测；备份 profile 只改无秘密测试端点。错 profile、块外变化、泄密、无授权探测或回滚失败即停。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:117-120](https://github.com/2384418321/dsh-integration-settings/blob/758bd55a04613b3e6b1033456376f5450698c82c/README.md#L117-L120)

作者说明设计。

```text
## 设计要点

### MCP 管理
DSH 没有「MCP 注册表」这种东西：**一个 MCP 服务器就是 profile patch 里的一条 loader 行**。
```

**依据 2 · 源码核查**：[lib/index.js:7656-7659](https://github.com/2384418321/dsh-integration-settings/blob/758bd55a04613b3e6b1033456376f5450698c82c/lib/index.js#L7656-L7659)

限定受管块替换。

```text
function applyManagedBlock(patchText, block) {
  const text = dropEmptyPatchPlaceholder(patchText || "");
  const start = text.indexOf(START_MARK);
  if (start === -1) {
```

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
