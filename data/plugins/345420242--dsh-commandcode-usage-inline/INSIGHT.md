# dsh-commandcode-usage-inline

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[67ae018](https://github.com/345420242/dsh-commandcode-usage-inline/tree/67ae01891935472467cdf77562861062e91d9b5b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/345420242/dsh-commandcode-usage-inline)
<!-- END META -->

> **实现功能**：在对话输入区旁显示 Command Code 五小时、周额度和 credits。

> **核心亮点**：把额度决策放到发送动作旁，优势是位置和一眼可见，不改变 provider 的计量、刷新或账户语义。 详见[Q03](#research-q03)。

> **风险与缺陷**：完全依赖另一插件的 Remote 契约；一分钟轮询可能显示旧值，账户切换、返回字段漂移和离线恢复未证实。 详见[Q04](#research-q04)。

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
  - [Q01 · 场景：适合频繁使用 Command Code、需要发消息前查看短窗/周限额与 credits 的用户？](#detail-section-11)
  - [Q02 · 机制：客户端调用已安装 provider 的 Remote commandcode/report，解析数据后在输入区渲染徽标和详情，每 60 秒更新并展示错误态。？](#detail-section-12)
  - [Q03 · 贡献：把额度决策放到发送动作旁，优势是位置和一眼可见，不改变 provider 的计量、刷新或账户语义。？](#detail-section-13)
  - [Q04 · 局限：完全依赖另一插件的 Remote 契约？](#detail-section-14)
  - [Q05 · 依赖：必须先有 @mars-sea/dsh-commandcode-provider、对应登录/凭据及 conversation UI 注入点？](#detail-section-15)
  - [Q06 · 成本与效果：额外成本主要是每分钟一次本地 Remote 请求和界面占位？](#detail-section-16)
  - [Q07 · 工程：错误态与紧凑/展开层次清楚，适合做薄客户端？](#detail-section-17)
  - [Q08 · 假设：若徽标显示 last-updated 与账户标识，并在页面隐藏时停止轮询，可降低陈旧额度导致的错误决策。？](#detail-section-18)
  - [Q09 · 采用：可在单账户非关键 profile 试用，先断开 provider、切换账户并等待两个轮询周期？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合频繁使用 Command Code、需要发消息前查看短窗/周限额与 credits 的用户；偶尔查看可直接用 provider 报告。 详见[Q01](#research-q01)。

适合频繁使用 Command Code、需要发消息前查看短窗/周限额与 credits 的用户；偶尔查看可直接用 provider 报告。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

#### 能力明细

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 界面 | 输入区内嵌额度徽标与详情弹层 | 多窗口轮询倍增、账户切换和上游 schema 变化后的显示正确性未测 |
| 后台 | 每 60 秒轮询 provider 的 commandcode/report | 多窗口轮询倍增、账户切换和上游 schema 变化后的显示正确性未测 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| Command Code provider | 必需 | 提供 report Remote | 徽标进入错误态 |
| conversation UI slot | 必需 | 输入区渲染 | 无可见入口 |
| 账户会话 | 必需 | 额度来源 | 切换语义未知 |

#### 启动步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 加载 | 确认 provider 已启动 | 首个 report 成功 |
| 查看 | 徽标看短窗/周额度 | 展开核 credits/更新时间 |
| 刷新 | 等待 60 秒轮询 | 错误态不沿用旧结论 |
| 恢复 | 修复 provider 后再拉取 | 以官方账单复核 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 轮询 | 每窗口每分钟 Remote 请求 | 观察错误/恢复 | 上游是否联网未知 |
| 界面 | 输入区占位 | 理解三个口径 | 多账户混淆风险 |
| 故障 | 陈旧或缺失数据 | 转查 provider/官方账单 | 恢复时延未测 |

#### 效果

| 效果项 | 源码支持 | 验证指标 |
| --- | --- | --- |
| 发送前额度感知 | 状态就在输入区 | 查看次数/决策耗时 |
| 细分口径 | 5h、周、credits 同屏 | 与官方账单差值 |
| 侧栏替代 | 位置更近但无新数据 | 任务完成时间差 |

> **思考**：完全依赖另一插件的 Remote 契约；一分钟轮询可能显示旧值，账户切换、返回字段漂移和离线恢复未证实。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把额度决策放到发送动作旁，优势是位置和一眼可见，不改变 provider 的计量、刷新或账户语义。 详见[Q03](#research-q03)。

把额度决策放到发送动作旁，优势是位置和一眼可见，不改变 provider 的计量、刷新或账户语义。 详见[Q03](#research-q03)。

错误态与紧凑/展开层次清楚，适合做薄客户端；应对响应 schema 做版本协商并在徽标标注采样时间。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

完全依赖另一插件的 Remote 契约；一分钟轮询可能显示旧值，账户切换、返回字段漂移和离线恢复未证实。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可在单账户非关键 profile 试用，先断开 provider、切换账户并等待两个轮询周期；不能把徽标当账单最终依据。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可确认输入区徽标、详情弹层及 60 秒 report 轮询；未连接 Command Code provider 或真实账户，故不确认额度口径、刷新及时性、多窗口请求量及账单一致性。

- 已检查：作者 README、包清单、源码路径 README.md、dsh/index.js、dsh/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 README.md、dsh/index.js、dsh/client.js 与 prepared inventory；未安装、未运行、未访问真实账号/设备/服务。多窗口轮询倍增、账户切换和上游 schema 变化后的显示正确性未测。
- 下一步：下一步只做本项可证伪实验：在 1/3 个窗口各运行 10 分钟，模拟 provider 断连和账户切换，记录请求数、恢复时间、账户标识和更新时间。

**分析版本**

- **仓库**：[345420242/dsh-commandcode-usage-inline](https://github.com/345420242/dsh-commandcode-usage-inline)
- **版本号**：0.1.0（[固定提交 67ae018](https://github.com/345420242/dsh-commandcode-usage-inline/tree/67ae01891935472467cdf77562861062e91d9b5b)）
- **版本日期**：2026-09-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

若徽标显示 last-updated 与账户标识，并在页面隐藏时停止轮询，可降低陈旧额度导致的错误决策。 详见[Q08](#research-q08)。

下一步只做本项可证伪实验：在 1/3 个窗口各运行 10 分钟，模拟 provider 断连和账户切换，记录请求数、恢复时间、账户标识和更新时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 609 | 520 | 56 | — |
| .md | source | 1 | 53 | — | — | 482 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/345420242/dsh-commandcode-usage-inline/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：内联额度徽标能否比侧栏信息更及时而不制造轮询噪声和错误确信？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 场景：适合频繁使用 Command Code、需要发消息前查看短窗/周限额与 credits 的用户？

**研究主题**：场景与需求

#### 完整回答

适合频繁使用 Command Code、需要发消息前查看短窗/周限额与 credits 的用户；偶尔查看可直接用 provider 报告。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/345420242/dsh-commandcode-usage-inline/blob/67ae01891935472467cdf77562861062e91d9b5b/README.md#L1-L5)

固定提交复核：场景相关声明与实现入口。

```text
# dsh-commandcode-usage-inline

**Inline** Command Code plan usage badge for the DSH composer toolbar — a one-line readout right beside the model selector, zero screen space beyond a compact pill.

![示意] composer 工具栏: `CC 5h 12% | 周 34% | 剩 1826`
```

#### 缺口

- 多窗口轮询倍增、账户切换和上游 schema 变化后的显示正确性未测
  **影响**：场景结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在 1/3 个窗口各运行 10 分钟，模拟 provider 断连和账户切换，记录请求数、恢复时间、账户标识和更新时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 机制：客户端调用已安装 provider 的 Remote commandcode/report，解析数据后在输入区渲染徽标和详情，每 60 秒更新并展示错误态。？

**研究主题**：功能与机制

#### 完整回答

客户端调用已安装 provider 的 Remote commandcode/report，解析数据后在输入区渲染徽标和详情，每 60 秒更新并展示错误态。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/client.js:1-10](https://github.com/345420242/dsh-commandcode-usage-inline/blob/67ae01891935472467cdf77562861062e91d9b5b/dsh/client.js#L1-L10)

固定提交复核：机制相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
// dsh/client.js — DSH Client 半边
//
// 在 `conversation.input.right` Slot (与 dsh-musage 同一位置: composer 卡内,
// model select 紧邻左侧) 渲染 Command Code 套餐用量: 5h 窗口已用% | 周窗口
// 已用% | 剩余 credits。数据来自 @mars-sea/dsh-commandcode-provider 已经
// mount 好的 `commandcode/report` Remote (accounts[].report.credits /
// .plan / .account), 本插件只做展示, 不重复请求 Command Code API。
//
// 行为:
//   - 当前会话 provider 是 commandcode 时显示徽章; 其它 provider 隐藏
```

</details>

#### 缺口

- 多窗口轮询倍增、账户切换和上游 schema 变化后的显示正确性未测
  **影响**：机制结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在 1/3 个窗口各运行 10 分钟，模拟 provider 断连和账户切换，记录请求数、恢复时间、账户标识和更新时间

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 贡献：把额度决策放到发送动作旁，优势是位置和一眼可见，不改变 provider 的计量、刷新或账户语义。？

**研究主题**：贡献与相对优势

#### 完整回答

把额度决策放到发送动作旁，优势是位置和一眼可见，不改变 provider 的计量、刷新或账户语义。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/345420242/dsh-commandcode-usage-inline/blob/67ae01891935472467cdf77562861062e91d9b5b/README.md#L1-L5)

固定提交复核：贡献相关声明与实现入口。

```text
# dsh-commandcode-usage-inline

**Inline** Command Code plan usage badge for the DSH composer toolbar — a one-line readout right beside the model selector, zero screen space beyond a compact pill.

![示意] composer 工具栏: `CC 5h 12% | 周 34% | 剩 1826`
```

#### 缺口

- 多窗口轮询倍增、账户切换和上游 schema 变化后的显示正确性未测
  **影响**：贡献结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在 1/3 个窗口各运行 10 分钟，模拟 provider 断连和账户切换，记录请求数、恢复时间、账户标识和更新时间

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 局限：完全依赖另一插件的 Remote 契约？

**研究主题**：缺陷与关键质疑

#### 完整回答

完全依赖另一插件的 Remote 契约；一分钟轮询可能显示旧值，账户切换、返回字段漂移和离线恢复未证实。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/client.js:1-10](https://github.com/345420242/dsh-commandcode-usage-inline/blob/67ae01891935472467cdf77562861062e91d9b5b/dsh/client.js#L1-L10)

固定提交复核：局限相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
// dsh/client.js — DSH Client 半边
//
// 在 `conversation.input.right` Slot (与 dsh-musage 同一位置: composer 卡内,
// model select 紧邻左侧) 渲染 Command Code 套餐用量: 5h 窗口已用% | 周窗口
// 已用% | 剩余 credits。数据来自 @mars-sea/dsh-commandcode-provider 已经
// mount 好的 `commandcode/report` Remote (accounts[].report.credits /
// .plan / .account), 本插件只做展示, 不重复请求 Command Code API。
//
// 行为:
//   - 当前会话 provider 是 commandcode 时显示徽章; 其它 provider 隐藏
```

</details>

#### 缺口

- 多窗口轮询倍增、账户切换和上游 schema 变化后的显示正确性未测
  **影响**：局限结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在 1/3 个窗口各运行 10 分钟，模拟 provider 断连和账户切换，记录请求数、恢复时间、账户标识和更新时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 依赖：必须先有 @mars-sea/dsh-commandcode-provider、对应登录/凭据及 conversation UI 注入点？

**研究主题**：依赖、兼容与流程

#### 完整回答

必须先有 @mars-sea/dsh-commandcode-provider、对应登录/凭据及 conversation UI 注入点；本插件不直接校验上游账单。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/345420242/dsh-commandcode-usage-inline/blob/67ae01891935472467cdf77562861062e91d9b5b/README.md#L1-L5)

固定提交复核：依赖相关声明与实现入口。

```text
# dsh-commandcode-usage-inline

**Inline** Command Code plan usage badge for the DSH composer toolbar — a one-line readout right beside the model selector, zero screen space beyond a compact pill.

![示意] composer 工具栏: `CC 5h 12% | 周 34% | 剩 1826`
```

#### 缺口

- 多窗口轮询倍增、账户切换和上游 schema 变化后的显示正确性未测
  **影响**：依赖结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在 1/3 个窗口各运行 10 分钟，模拟 provider 断连和账户切换，记录请求数、恢复时间、账户标识和更新时间

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本与效果：额外成本主要是每分钟一次本地 Remote 请求和界面占位？

**研究主题**：效果与总成本

#### 完整回答

额外成本主要是每分钟一次本地 Remote 请求和界面占位；上游真实 API 频率、CPU 与多窗口倍增量未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/345420242/dsh-commandcode-usage-inline/blob/67ae01891935472467cdf77562861062e91d9b5b/README.md#L1-L5)

固定提交复核：成本与效果相关声明与实现入口。

```text
# dsh-commandcode-usage-inline

**Inline** Command Code plan usage badge for the DSH composer toolbar — a one-line readout right beside the model selector, zero screen space beyond a compact pill.

![示意] composer 工具栏: `CC 5h 12% | 周 34% | 剩 1826`
```

#### 缺口

- 多窗口轮询倍增、账户切换和上游 schema 变化后的显示正确性未测
  **影响**：成本与效果结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在 1/3 个窗口各运行 10 分钟，模拟 provider 断连和账户切换，记录请求数、恢复时间、账户标识和更新时间

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 工程：错误态与紧凑/展开层次清楚，适合做薄客户端？

**研究主题**：工程质量与复用

#### 完整回答

错误态与紧凑/展开层次清楚，适合做薄客户端；应对响应 schema 做版本协商并在徽标标注采样时间。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/client.js:1-10](https://github.com/345420242/dsh-commandcode-usage-inline/blob/67ae01891935472467cdf77562861062e91d9b5b/dsh/client.js#L1-L10)

固定提交复核：工程相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
// dsh/client.js — DSH Client 半边
//
// 在 `conversation.input.right` Slot (与 dsh-musage 同一位置: composer 卡内,
// model select 紧邻左侧) 渲染 Command Code 套餐用量: 5h 窗口已用% | 周窗口
// 已用% | 剩余 credits。数据来自 @mars-sea/dsh-commandcode-provider 已经
// mount 好的 `commandcode/report` Remote (accounts[].report.credits /
// .plan / .account), 本插件只做展示, 不重复请求 Command Code API。
//
// 行为:
//   - 当前会话 provider 是 commandcode 时显示徽章; 其它 provider 隐藏
```

</details>

#### 缺口

- 多窗口轮询倍增、账户切换和上游 schema 变化后的显示正确性未测
  **影响**：工程结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在 1/3 个窗口各运行 10 分钟，模拟 provider 断连和账户切换，记录请求数、恢复时间、账户标识和更新时间

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 假设：若徽标显示 last-updated 与账户标识，并在页面隐藏时停止轮询，可降低陈旧额度导致的错误决策。？

**研究主题**：新假设与验证

#### 完整回答

若徽标显示 last-updated 与账户标识，并在页面隐藏时停止轮询，可降低陈旧额度导致的错误决策。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/345420242/dsh-commandcode-usage-inline/blob/67ae01891935472467cdf77562861062e91d9b5b/README.md#L1-L5)

固定提交复核：假设相关声明与实现入口。

```text
# dsh-commandcode-usage-inline

**Inline** Command Code plan usage badge for the DSH composer toolbar — a one-line readout right beside the model selector, zero screen space beyond a compact pill.

![示意] composer 工具栏: `CC 5h 12% | 周 34% | 剩 1826`
```

#### 缺口

- 多窗口轮询倍增、账户切换和上游 schema 变化后的显示正确性未测
  **影响**：假设结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在 1/3 个窗口各运行 10 分钟，模拟 provider 断连和账户切换，记录请求数、恢复时间、账户标识和更新时间

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 采用：可在单账户非关键 profile 试用，先断开 provider、切换账户并等待两个轮询周期？

**研究主题**：采用判断

#### 完整回答

可在单账户非关键 profile 试用，先断开 provider、切换账户并等待两个轮询周期；不能把徽标当账单最终依据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/345420242/dsh-commandcode-usage-inline/blob/67ae01891935472467cdf77562861062e91d9b5b/README.md#L1-L5)

固定提交复核：采用相关声明与实现入口。

```text
# dsh-commandcode-usage-inline

**Inline** Command Code plan usage badge for the DSH composer toolbar — a one-line readout right beside the model selector, zero screen space beyond a compact pill.

![示意] composer 工具栏: `CC 5h 12% | 周 34% | 剩 1826`
```

#### 缺口

- 多窗口轮询倍增、账户切换和上游 schema 变化后的显示正确性未测
  **影响**：采用结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在 1/3 个窗口各运行 10 分钟，模拟 provider 断连和账户切换，记录请求数、恢复时间、账户标识和更新时间

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
