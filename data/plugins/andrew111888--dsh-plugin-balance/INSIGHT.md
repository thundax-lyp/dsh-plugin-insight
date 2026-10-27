# dsh-plugin-balance

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[96bb159](https://github.com/Andrew111888/dsh-plugin-balance/tree/96bb1592c949456aa37ccc3a296085f59df2ee9c)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Andrew111888/dsh-plugin-balance) [![npm 30d 1,245](https://img.shields.io/static/v1?label=npm+30d&message=1%2C245&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-balance) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-balance)
<!-- END META -->

> **实现功能**：DSH Web 额度悬浮窗，整合多供应商查询、会话 token 统计与费用估算。

> **核心亮点**：把额度和 DSH 会话事件统一展示、按模型/日期做本地估算。详见[Q02](#research-q02)。

> **风险与缺陷**：自定义 baseUrl 由请求提供、key 由宿主凭据解析并以 Bearer 发给该地址，缺源绑定与组件内访问控制。详见[Q03](#research-q03)。

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
  - [Q01 · 额度、token 用量和费用估算是同一种数据吗？](#detail-section-11)
  - [Q02 · 宿主代理、计数存储和 Web 呈现如何结合？](#detail-section-12)
  - [Q03 · 自定义额度代理的凭据流向是否受约束？](#detail-section-13)
  - [Q04 · 费用估算和安装依赖有何持续维护成本？](#detail-section-14)
  - [Q05 · 怎样试点而不误用账单数字或泄漏密钥？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人/团队粗看供应商余额、DSH 消耗和预算趋势，需与正式账单分开。

供应商控制台和 DSH 原生日志；本包减少多页面查看但不能替代账单。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 供应商额度 | 看余额/套餐 | API 可用性与密钥风险 |
| DSH token | 本地会话用量 | 不等于账户总用量 |
| 费用估算 | 粗预算 | 静态价目/固定汇率 |

**流程与依赖**

| 条件 | 用途 | 失败时 |
| --- | --- | --- |
| DSH credentials/webServer/会话 | 查询和统计 | 无数据 |
| 供应商 API/密钥 | 余额 | 查询错误 |
| 持续价目/汇率校准 | 费用 | 估算偏离 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 安全核查 | 假 key 测自定义 URL | 不向任意域泄露 |
| 数据核查 | 同期事件/厂商账单对齐 | 来源和误差明确 |
| 展示 | 余额/用量/估算分开 | 无财务误用 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 部署 | DSH 服务、凭据和浏览器 | 兼容/权限 |
| 持续 | 上游查询、本地 JSON、价目维护 | 对账误差 |
| 安全 | 限制自定义代理与缓存隔离 | 真实可达性 |

| 结果 | 源码支持 | 未证实 |
| --- | --- | --- |
| 额度 | 多供应商代理 | 当前 API 可用 |
| 用量 | 本地事件累计 | 全部事件覆盖 |
| 费用 | 固定价目计算 | 真实账单一致 |

> **思考**：自定义 baseUrl 由请求提供、key 由宿主凭据解析并以 Bearer 发给该地址，缺源绑定与组件内访问控制。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把额度和 DSH 会话事件统一展示、按模型/日期做本地估算。详见[Q02](#research-q02)。

把额度和 DSH 会话事件统一展示、按模型/日期做本地估算。详见[Q02](#research-q02)。

自定义查询路由允许调用方指定 baseUrl/path，凭据由宿主 providerId 解析，Authorization 发至该 URL；缓存键无身份/密钥。费用和汇率内嵌常数。

<a id="detail-section-5"></a>

### 1.4 主要限制

自定义 baseUrl 由请求提供、key 由宿主凭据解析并以 Bearer 发给该地址，缺源绑定与组件内访问控制。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先禁自定义任意 URL，以假 key 试验并同官方账单对账；只把费用视为估算。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持多源展示，但自定义地址可与宿主凭据组合外发，硬编码价目不等于现行账单；未运行。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：审阅固定提交 README、包、Host/Client 源码；未调用供应商 API 或 DSH 事件。
- 下一步：隔离 canary 目标与假凭据核代理边界，单/多用户核缓存；固定会话重放和同期官方账单核误差，价目保留来源日期。

**分析版本**

- **仓库**：[Andrew111888/dsh-plugin-balance](https://github.com/Andrew111888/dsh-plugin-balance)
- **版本号**：1.4.4（[固定提交 96bb159](https://github.com/Andrew111888/dsh-plugin-balance/tree/96bb1592c949456aa37ccc3a296085f59df2ee9c)）
- **版本日期**：2026-08-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将供应商域名与密钥引用管理员绑定、隔离缓存、价目注明版本可提高安全和对账可信度；尚未实现。详见[Q05](#research-q05)。

隔离 canary 目标与假凭据核代理边界，单/多用户核缓存；固定会话重放和同期官方账单核误差，价目保留来源日期。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 934 | — | — | 9558 |
| .js | source | 2 | 3835 | 3512 | 216 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Andrew111888/dsh-plugin-balance/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/Andrew111888/dsh-plugin-balance/issues?q=is%3Aissue+created%3A2026-09-22T05%3A46%3A57.585Z..2026-10-22T05%3A46%3A57.585Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Andrew111888/dsh-plugin-balance/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A46%3A57.585Z..2026-10-22T05%3A46%3A57.585Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分外部额度、本地 token 和静态价格估算，并审自定义代理密钥边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 额度、token 用量和费用估算是同一种数据吗？

**研究主题**：场景与需求

#### 完整回答

悬浮窗混合三类来源：外部供应商余额/套餐接口、DSH 会话事件中的本地 token 消耗，以及内置价目和固定汇率推得的估算费用。它们不能互相当作对账真值：外部账户可能含其它客户端用量，本地日志可能缺模型或历史，估算不等于实际账单。合格结果应标明来源、更新时间、货币及覆盖范围，供粗略预算，不用于财务结算。基线是厂商控制台账单与 DSH 原生日志。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-55](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/README.md#L15-L55)

作者功能和显示。

<details>
<summary>查看原文（41行）</summary>

```text
## ✨ 项目介绍

`dsh-plugin-balance` 是一个 DSH（DeepSeek Harness）Web 插件，在**输入框正上方**显示一个小悬浮窗，可以：

- **查询 LLM 账户余额 / 套餐用量**：支持 DeepSeek 官方、**OpenCode Go**、OpenAI，以及任意自定义额度接口。
- **OpenCode Go**：主窗口直接显示 **5h / 每周 / 每月** 三个用量百分比徽章（按用量高低自动变色：绿 → 黄 → 红）。
- **DSH 会话 token 用量统计**：你的 DSH 对话一共消耗了多少 token，按 **每天 / 每月 / 总共** 累计，并**按模型**拆分，持久化到磁盘。
- **费用估算**：按 DeepSeek（峰谷价）、Kimi、GLM 等官方价对 token 用量估算费用。

悬浮窗可拖动、自动适配亮/暗主题，折叠成小胶囊后仍保留**刷新按钮**。

## 🖼 预览

**① 动画演示** —— 悬停展开 / 移开收起（弹簧动画），直观感受交互

![动画演示](docs/preview-anim.gif)

**② 用量明细** —— OpenCode Go 5h / 每周 / 每月 用量与重置时间

![用量明细](docs/preview-usage.png)

**③ Token 用量统计** —— 今日 / 本月 / 总共 + 最近 7 天柱状图 + 按模型统计 + 费用估算

![Token 统计](docs/preview-tokens.png)

**④ 实际效果** —— 对话框内的悬浮窗

![实际效果](docs/preview-context.png)

**⑤ 余额类型** —— 自动识别 DeepSeek 官方余额 / 套餐（OpenCode Go）用量

![余额类型](docs/preview-balance-type.png)

## 功能一览

| 模块 | 说明 |
| --- | --- |
| 账户类型 | DeepSeek 官方（`/user/balance`）、**OpenCode Go**（经宿主代理查 `/usage`）、OpenAI `credit_grants`，或从 DSH 模型列表同步的**自定义额度接口** |
| OpenCode Go 展示 | 主行显示 5h / 每周 / 每月 百分比徽章；折叠胶囊只显示百分比；明细面板带重置时间 |
| Token 用量 | 今日 / 本月 / 总共 的 token 数、最近 7 天迷你柱状图、**按模型**拆分（入 / 出 / 缓存命中） |
| 费用估算 | `≈¥` 徽章（官方价：DeepSeek 峰谷=空闲×2，北京 9:00–12:00、14:00–18:00；Kimi K2/K3、GLM 4.x/5.x 恒价；非人民币官方价按汇率 7.2 折算） |
```

</details>

**依据 2 · 作者声明**：[README.md:118-126](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/README.md#L118-L126)

作者会话用量来源。

```text
## 🧮 Token 用量与费用

主进程半监听 DSH 会话事件流（`session/event`），把每次请求上报的 token 用量（未命中输入 + 缓存写、缓存命中、输出）按 **日期 / 月份 / 模型** 折叠累计，并持久化到 `~/.dsh/storages/dsh-plugin-balance-usage.json`。

- 幂等：同一 `turn:step` 的新样本替换旧样本；重载 / 重启后重放日志不会重复计数。
- 模型归属按每个请求的 `request/header` 精确记录（会话中途切换模型也不会归错桶）。
- 费用按各厂商官方价计（DeepSeek 峰谷；Kimi K2/K3、GLM 4.x/5.x 恒价，非人民币价按 ~7.2 折算），按每个样本的**发生时刻**精确计价（详见界面内提示）。
- 提供给前端：`GET /api/dsh-plugin-balance/tokens`。
- 存储为 `version 9`：旧版数据不再估算折算，而是从会话事件流（含磁盘归档日志）精确重放重建。
```

**依据 3 · 源码核查**：[lib/index.js:20-42](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/lib/index.js#L20-L42)

外部余额接口。

<details>
<summary>查看原文（23行）</summary>

```text
const PROVIDERS = {
  deepseek: {
    credentialRefs: ["DEEPSEEK_API_KEY"],
    url: "https://api.deepseek.com/user/balance",
    kind: "balance",
    missingCredential: "未配置 DEEPSEEK_API_KEY（可在 DSH 凭据或环境变量中设置）",
    parse: parseDeepSeekPayload,
  },
  "opencode-go": {
    credentialRefs: ["OPENCODE_GO_API_KEY", "OPENCODE_API_KEY"],
    url: "https://opencode.ai/zen/go/v1/usage",
    kind: "usage",
    missingCredential: "未配置 OPENCODE_GO_API_KEY（可在 DSH 凭据或环境变量中设置）",
    parse: parseOpenCodeGoPayload,
  },
  "openai": {
    credentialRefs: ["OPENAI_API_KEY"],
    url: "https://api.openai.com/v1/dashboard/billing/credit_grants",
    kind: "balance",
    missingCredential: "未配置 OPENAI_API_KEY（可在 DSH 凭据或环境变量中设置）",
    parse: parseOpenAiPayload,
  },
};
```

</details>

**依据 4 · 源码核查**：[lib/index.js:453-520](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/lib/index.js#L453-L520)

静态价目、固定汇率与估算说明。

<details>
<summary>查看原文（68行）</summary>

```text
const USD_TO_CNY = 7.2;
function cny(usd) { return Number((usd * USD_TO_CNY).toFixed(2)); }
function flatRates(usdHit, usdMiss, usdOut) {
  const h = cny(usdHit);
  const m = cny(usdMiss);
  const o = cny(usdOut);
  return { idle: { hit: h, miss: m, out: o }, peak: { hit: h, miss: m, out: o } };
}
const zeroRates = () => ({ idle: { hit: 0, miss: 0, out: 0 }, peak: { hit: 0, miss: 0, out: 0 } });
const MODEL_PRICING = [
  // ── DeepSeek 官方（人民币峰谷价，2026-08-17 生效）──
  { match: ["v4-flash-vision-exp"], source: "DeepSeek 官方", rates: { idle: { hit: 0.05, miss: 1.5, out: 4.5 }, peak: { hit: 0.1, miss: 3.0, out: 9.0 } } },
  { match: ["v4-flash"], source: "DeepSeek 官方", rates: { idle: { hit: 0.05, miss: 1.5, out: 4.5 }, peak: { hit: 0.1, miss: 3.0, out: 9.0 } } },
  { match: ["v4-pro"], source: "DeepSeek 官方", rates: { idle: { hit: 0.15, miss: 4.5, out: 13.5 }, peak: { hit: 0.3, miss: 9.0, out: 27.0 } } },
  // ── Kimi / Moonshot（官方美元价折算）──
  { match: ["k3"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.3, 3.0, 15.0) },
  { match: ["k2.7"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.19, 0.95, 4.0) },
  { match: ["k2.6"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.16, 0.95, 4.0) },
  { match: ["k2.5"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.1, 0.6, 3.0) },
  { match: ["thinking-turbo", "k2-turbo", "k2-thinking"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.3, 1.15, 8.0) },
  { match: ["k2"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.15, 0.6, 2.5) },
  { match: ["moonshot", "kimi"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.15, 0.6, 2.5) },
  // ── GLM / Z.AI（官方美元价折算；先精确型号后泛化）──
  { match: ["glm-5.3", "glm-5.2", "glm-5.1"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.26, 1.4, 4.4) },
  { match: ["glm-5-turbo"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.24, 1.2, 4.0) },
  { match: ["glm-5v-turbo"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.24, 1.2, 4.0) },
  { match: ["glm-5"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.2, 1.0, 3.2) },
  { match: ["glm-4.7-flashx"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.01, 0.07, 0.4) },
  { match: ["glm-4.7-flash"], source: "GLM 官方(免费)", rates: zeroRates() },
  { match: ["glm-4.7"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.11, 0.6, 2.2) },
  { match: ["glm-4.6v"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.05, 0.3, 0.9) },
  { match: ["glm-4.6"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.11, 0.6, 2.2) },
  { match: ["glm-4.5-airx"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.22, 1.1, 4.5) },
  { match: ["glm-4.5-air"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.03, 0.2, 1.1) },
  { match: ["glm-4.5-x"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.45, 2.2, 8.9) },
  { match: ["glm-4.5-flash"], source: "GLM 官方(免费)", rates: zeroRates() },
  { match: ["glm-4.5v"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.11, 0.6, 1.8) },
  { match: ["glm-4.5"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.11, 0.6, 2.2) },
  { match: ["glm-4-32b"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.05, 0.1, 0.1) },
  { match: ["glm"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.11, 0.6, 2.2) },
  // ── LongCat（美团，OpenCode Go 价目表美元价折算）──
  { match: ["longcat"], source: "LongCat 官方(≈×7.2)", rates: flatRates(0.006, 0.3, 1.2) },
  // ── MiMo（小米，OpenCode Go 价目表美元价折算）──
  { match: ["mimo-v2.5-pro"], source: "MiMo 官方(≈×7.2)", rates: flatRates(0.003625, 0.435, 0.87) },
  { match: ["mimo-v2"], source: "MiMo 官方(≈×7.2)", rates: flatRates(0.0028, 0.14, 0.28) },
  // ── MiniMax（官方美元价折算；缓存写入按未命中单价近似）──
  { match: ["minimax-m3", "minimax-m2.7", "minimax-m2.5", "minimax"], source: "MiniMax 官方(≈×7.2)", rates: flatRates(0.06, 0.3, 1.2) },
  // ── Muse Spark（OpenCode Go 价目表美元价折算）──
  { match: ["muse-spark", "muse"], source: "Muse 官方(≈×7.2)", rates: flatRates(0.002, 0.1, 0.2) },
  // ── Qwen（阿里，≤256K 档美元价折算；>256K 长上下文单价更高未区分）──
  { match: ["qwen3.8-max"], source: "Qwen 官方(≈×7.2)", rates: flatRates(0.25, 2.0, 6.0) },
  { match: ["qwen3.7-max"], source: "Qwen 官方(≈×7.2)", rates: flatRates(0.5, 2.5, 7.5) },
  { match: ["qwen3.7-plus"], source: "Qwen 官方(≈×7.2)", rates: flatRates(0.04, 0.4, 1.6) },
  { match: ["qwen3.6-plus", "qwen3.5-plus"], source: "Qwen 官方(≈×7.2)", rates: flatRates(0.05, 0.5, 3.0) },
  // ── GPT 5.6 Luna（OpenAI，≤272K 档美元价折算）──
  { match: ["gpt-5.6-luna", "gpt-5.6"], source: "OpenAI 官方(≈×7.2)", rates: flatRates(0.02, 0.2, 1.2) },
  // ── Grok（xAI，OpenCode Go 价目表美元价折算）──
  { match: ["grok"], source: "Grok 官方(≈×7.2)", rates: flatRates(0.3, 2.0, 6.0) },
  // ── Hy3（腾讯混元，OpenCode Go 价目表美元价折算）──
  { match: ["hy3"], source: "Hy3 官方(≈×7.2)", rates: flatRates(0.035, 0.14, 0.58) },
  // ── Ox Alpha Free（免费）──
  { match: ["ox-alpha"], source: "免费", rates: zeroRates() },
];
const PRICING_INFO = {
  currency: "CNY",
  source: "DeepSeek/Kimi/GLM 各厂商官方定价页",
  peakWindow: "北京时间 9:00–12:00、14:00–18:00",
  note: "费用按各厂商官方价估算（统一人民币，非人民币官方价按汇率 7.2 折算）：DeepSeek 有峰谷（北京时间 9:00–12:00、14:00–18:00 高峰=空闲×2），其余恒价。覆盖 OpenCode Go 全部模型（DeepSeek/Kimi/GLM/Qwen/MiniMax/MiMo/LongCat/Grok/GPT-5.6/Hy3 等）；未收录模型不计费。",
```

</details>

#### 缺口

- 未对官方账单及会话日志对账。
  **影响**：误差范围未知。
  **进一步探讨**：同一期间逐模型对照供应商导出账单与原始 DSH 事件。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主代理、计数存储和 Web 呈现如何结合？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

Host 以 credentials 服务解析供应商 key，GET /query 代理请求并作 30 秒缓存；另监听 session/event，把 token 按 turn:step 替换累加到本地 JSON，并按模型和日期展开。Web client 30 分钟刷余额、60 秒刷 token，显示悬浮卡与费用面板。增量是把多供应商额度和 DSH 本地会话统计放在同一 UI，而不是厂商 API 余额或定价算法自身。README 称重放日志可重建与精准模型归属，需真实重放数据核验。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:20-45](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/lib/index.js#L20-L45)

供应商定义和缓存。

<details>
<summary>查看原文（26行）</summary>

```text
const PROVIDERS = {
  deepseek: {
    credentialRefs: ["DEEPSEEK_API_KEY"],
    url: "https://api.deepseek.com/user/balance",
    kind: "balance",
    missingCredential: "未配置 DEEPSEEK_API_KEY（可在 DSH 凭据或环境变量中设置）",
    parse: parseDeepSeekPayload,
  },
  "opencode-go": {
    credentialRefs: ["OPENCODE_GO_API_KEY", "OPENCODE_API_KEY"],
    url: "https://opencode.ai/zen/go/v1/usage",
    kind: "usage",
    missingCredential: "未配置 OPENCODE_GO_API_KEY（可在 DSH 凭据或环境变量中设置）",
    parse: parseOpenCodeGoPayload,
  },
  "openai": {
    credentialRefs: ["OPENAI_API_KEY"],
    url: "https://api.openai.com/v1/dashboard/billing/credit_grants",
    kind: "balance",
    missingCredential: "未配置 OPENAI_API_KEY（可在 DSH 凭据或环境变量中设置）",
    parse: parseOpenAiPayload,
  },
};

const CACHE_MS = 30 * 1000;
const cache = new Map();
```

</details>

**依据 2 · 源码核查**：[lib/index.js:790-927](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/lib/index.js#L790-L927)

Host 查询路由。

<details>
<summary>查看原文（138行）</summary>

```text
  try {
    url = new URL(req.url || "/", "http://localhost");
  } catch {
    sendJson(res, 400, { error: { code: "BAD_REQUEST", message: "无效的请求地址" } });
    return;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: { code: "METHOD_NOT_ALLOWED", message: "仅支持 GET" } });
    return;
  }
  const providerId = url.searchParams.get("provider") || "deepseek";
  const provider = PROVIDERS[providerId];
  const forceFresh = url.searchParams.get("fresh") === "1";

  // Custom / DSH-synced vendor: baseUrl + path + kind are sent by the client
  // (auto-filled from the DSH model settings where possible); the credential is
  // resolved server-side from the vendor's configured apiKeyEnv.
  if (!provider) {
    const baseUrl = url.searchParams.get("baseUrl");
    const kind = url.searchParams.get("kind") === "usage" ? "usage" : "balance";
    if (typeof baseUrl !== "string" || !/^https?:\/\//.test(baseUrl)) {
      sendJson(res, 400, { error: { code: "BAD_CUSTOM_CONFIG", message: "自定义厂商需要 http(s) 的 baseUrl" } });
      return;
    }
    const headerKey = req.headers["x-dsh-balance-key"] && typeof req.headers["x-dsh-balance-key"] === "string"
      ? req.headers["x-dsh-balance-key"].trim()
      : "";
    let credential;
    if (headerKey) {
      credential = { ref: "client-header", value: headerKey };
    } else {
      const settings = providerSettings(ctx, providerId) || {};
      const refs = typeof settings.apiKeyEnv === "string" && settings.apiKeyEnv
        ? [settings.apiKeyEnv]
        : [providerId.toUpperCase().replace(/-/g, "_") + "_API_KEY"];
      credential = await resolveCredential(ctx, refs);
    }
    if (!credential) {
      sendJson(res, 502, { error: { code: "MISSING_CREDENTIAL", message: `未配置 ${providerId} 的 API Key（apiKeyEnv）` } });
      return;
    }

    const userPath = url.searchParams.get("path");
    const candidates = [];
    if (typeof userPath === "string" && userPath !== "" && userPath.startsWith("/")) {
      candidates.push(userPath);
    } else {
      // No second config: try the common quota/balance paths automatically,
      // first JSON that yields non-empty balance/usage wins.
      const balancePaths = [
        "/v1/dashboard/billing/usage",
        "/v1/dashboard/billing/subscription",
        "/v1/dashboard/billing/credit_grants",
        "/v1/user/balance",
        "/user/balance",
        "/api/user/self",
        "/api/user/balance",
        "/v1/balance",
      ];
      const usagePaths = ["/v1/usage", "/usage"];
      const list = kind === "usage" ? usagePaths.concat(balancePaths) : balancePaths.concat(usagePaths);
      for (const item of list) candidates.push(item);
    }

    const proxyUrl = providerProxyUrl(ctx, providerId);
    const tried = [];
    for (const path of candidates) {
      const urls = [];
      const joined = joinBasePath(baseUrl, path);
      urls.push(joined);
      const origin = originOf(baseUrl);
      if (origin && path.startsWith("/api/")) {
        urls.push(origin + path);
      }
      for (const url of urls) {
        const cacheKey = providerId + "|" + url + "|" + kind;
        const cached = cache.get(cacheKey);
        if (!forceFresh && cached && Date.now() - cached.time < CACHE_MS) {
          sendJson(res, 200, cached.data);
          return;
        }
        const customProvider = {
          url,
          kind,
          parse: kind === "usage" ? parseOpenCodeGoPayload : parseCustomBalancePayload,
          credentialRefs: [credential.ref],
        };
        try {
          const data = await queryUpstream(customProvider, credential, proxyUrl);
          if (hasQueryData(data)) {
            cache.set(cacheKey, { time: Date.now(), data });
            sendJson(res, 200, data);
            return;
          }
          tried.push(url + "（返回为空）");
        } catch (error) {
          tried.push(url + "（" + (error?.message || error?.status || "失败") + "）");
        }
      }
    }
    sendJson(res, 502, { error: { code: "NO_QUOTA_ENDPOINT", message: `没有找到 ${providerId} 可用的额度接口，已尝试：${tried.join("、")}` } });
    return;
  }

  const cached = cache.get(providerId);
  if (!forceFresh && cached && Date.now() - cached.time < CACHE_MS) {
    sendJson(res, 200, cached.data);
    return;
  }

  const headerKey = req.headers["x-dsh-balance-key"] && typeof req.headers["x-dsh-balance-key"] === "string"
    ? req.headers["x-dsh-balance-key"].trim()
    : "";
  const credential = headerKey
    ? { ref: "client-header", value: headerKey }
    : await resolveCredential(ctx, provider.credentialRefs);
  if (!credential) {
    sendJson(res, 502, { error: { code: "MISSING_CREDENTIAL", message: provider.missingCredential } });
    return;
  }

  const proxyUrl = providerProxyUrl(ctx, providerId);
  try {
    const data = await queryUpstream(provider, credential, proxyUrl);
    cache.set(providerId, { time: Date.now(), data });
    sendJson(res, 200, data);
  } catch (error) {
    const status = Number(error?.status);
    const code = status === 401 ? "INVALID_CREDENTIAL"
      : status === 429 ? "RATE_LIMITED"
        : error?.timeout ? "UPSTREAM_TIMEOUT"
          : "UPSTREAM_ERROR";
    const message = status === 401 ? `${provider.credentialRefs[0]} 无效或未授权（401）`
      : status === 429 ? "请求过于频繁，请稍后再试（429）"
        : error?.timeout ? "上游查询超时"
          : error?.message || "上游查询失败";
    sendJson(res, 502, { error: { code, status, message } });
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:623-677](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/lib/index.js#L623-L677)

用量差量处理。

<details>
<summary>查看原文（55行）</summary>

```text
  const price = costOf(model, time, sample.in, sample.cacheRead, sample.out);
  const full = {
    in: sample.in,
    cacheRead: sample.cacheRead,
    out: sample.out,
    costPeak: price.peak,
    costOff: price.idle,
  };
  const prevRaw = store.steps[stepKey] || {};
  const prev = {
    in: Number(prevRaw.in) || 0,
    cacheRead: Number(prevRaw.cacheRead) || 0,
    out: Number(prevRaw.out) || 0,
    costPeak: Number(prevRaw.costPeak) || 0,
    costOff: Number(prevRaw.costOff) || 0,
  };
  store.steps[stepKey] = full;
  const d = {
    in: full.in - prev.in,
    cacheRead: full.cacheRead - prev.cacheRead,
    out: full.out - prev.out,
    costPeak: full.costPeak - prev.costPeak,
    costOff: full.costOff - prev.costOff,
  };
  if (!d.in && !d.cacheRead && !d.out && !d.costPeak && !d.costOff) return true;

  const day = dayKey(time);
  const month = monthKey(time);
  addDelta(store.days[day] || (store.days[day] = {}), modelKey, d);
  addDelta(store.months[month] || (store.months[month] = {}), modelKey, d);
  addDelta(store.total, modelKey, d);
  return true;
}
function sumBucket(bucket) {
  let input = 0;
  let cacheRead = 0;
  let output = 0;
  let costPeak = 0;
  let costOff = 0;
  for (const entry of Object.values(bucket || {})) {
    if (!entry || typeof entry !== "object") continue;
    input += Math.max(0, Number(entry.in) || 0);
    cacheRead += Math.max(0, Number(entry.cacheRead) || 0);
    output += Math.max(0, Number(entry.out) || 0);
    costPeak += Math.max(0, Number(entry.costPeak) || 0);
    costOff += Math.max(0, Number(entry.costOff) || 0);
  }
  return {
    in: input,
    cacheRead,
    out: output,
    tokens: input + cacheRead + output,
    costPeak,
    costOff,
    cost: costPeak + costOff,
```

</details>

**依据 4 · 源码核查**：[lib/client.js:21-29](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/lib/client.js#L21-L29)

前端刷新间隔。

```text
var DEFAULT_BASE_URL = "https://api.deepseek.com";
var DEFAULT_CUSTOM_PATH = "/user/balance";
var BALANCE_PATH = "/user/balance";
var HOST_ENDPOINT = "/api/dsh-plugin-balance/query";
var HOST_PROVIDERS_ENDPOINT = "/api/dsh-plugin-balance/providers";
var HOST_TOKENS_ENDPOINT = "/api/dsh-plugin-balance/tokens";
var REFRESH_MS = 30 * 60 * 1000;
var TOKENS_REFRESH_MS = 60 * 1000;
var GAP = 10;
```

**依据 5 · 作者声明**：[README.md:118-126](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/README.md#L118-L126)

作者持久统计描述。

```text
## 🧮 Token 用量与费用

主进程半监听 DSH 会话事件流（`session/event`），把每次请求上报的 token 用量（未命中输入 + 缓存写、缓存命中、输出）按 **日期 / 月份 / 模型** 折叠累计，并持久化到 `~/.dsh/storages/dsh-plugin-balance-usage.json`。

- 幂等：同一 `turn:step` 的新样本替换旧样本；重载 / 重启后重放日志不会重复计数。
- 模型归属按每个请求的 `request/header` 精确记录（会话中途切换模型也不会归错桶）。
- 费用按各厂商官方价计（DeepSeek 峰谷；Kimi K2/K3、GLM 4.x/5.x 恒价，非人民币价按 ~7.2 折算），按每个样本的**发生时刻**精确计价（详见界面内提示）。
- 提供给前端：`GET /api/dsh-plugin-balance/tokens`。
- 存储为 `version 9`：旧版数据不再估算折算，而是从会话事件流（含磁盘归档日志）精确重放重建。
```

#### 缺口

- 未运行 DSH 会话事件。
  **影响**：重启/多实例后幂等与覆盖率未知。
  **进一步探讨**：隔离重放并对照原始事件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自定义额度代理的凭据流向是否受约束？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

自定义 provider 分支允许请求方给任意 http(s) baseUrl 与 path；若未随请求头提供 key，会按 providerId 对应的 DSH 模型设置 apiKeyEnv 或推导变量名，经 credentials 服务取宿主密钥，再把它作为 Bearer 送至请求方指定 URL。组件内没见 baseUrl 与 provider 配置绑定/域名白名单，也未见该路由自身的访问控制。因此能调用此路由且能选中已配置 providerId 的主体可能把该供应商 key 发往其控制的站点；真实可达权限仍取决于 DSH Web 外层。这是源码级高优先核查项，未做网络验证。缓存键也没有 key/用户维度，共用服务下结果隔离需核。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:804-829](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/lib/index.js#L804-L829)

任意 baseUrl 与宿主凭据解析。

<details>
<summary>查看原文（26行）</summary>

```text
  // Custom / DSH-synced vendor: baseUrl + path + kind are sent by the client
  // (auto-filled from the DSH model settings where possible); the credential is
  // resolved server-side from the vendor's configured apiKeyEnv.
  if (!provider) {
    const baseUrl = url.searchParams.get("baseUrl");
    const kind = url.searchParams.get("kind") === "usage" ? "usage" : "balance";
    if (typeof baseUrl !== "string" || !/^https?:\/\//.test(baseUrl)) {
      sendJson(res, 400, { error: { code: "BAD_CUSTOM_CONFIG", message: "自定义厂商需要 http(s) 的 baseUrl" } });
      return;
    }
    const headerKey = req.headers["x-dsh-balance-key"] && typeof req.headers["x-dsh-balance-key"] === "string"
      ? req.headers["x-dsh-balance-key"].trim()
      : "";
    let credential;
    if (headerKey) {
      credential = { ref: "client-header", value: headerKey };
    } else {
      const settings = providerSettings(ctx, providerId) || {};
      const refs = typeof settings.apiKeyEnv === "string" && settings.apiKeyEnv
        ? [settings.apiKeyEnv]
        : [providerId.toUpperCase().replace(/-/g, "_") + "_API_KEY"];
      credential = await resolveCredential(ctx, refs);
    }
    if (!credential) {
      sendJson(res, 502, { error: { code: "MISSING_CREDENTIAL", message: `未配置 ${providerId} 的 API Key（apiKeyEnv）` } });
      return;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:832-890](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/lib/index.js#L832-L890)

拼路径、发送并缓存。

<details>
<summary>查看原文（59行）</summary>

```text
    const userPath = url.searchParams.get("path");
    const candidates = [];
    if (typeof userPath === "string" && userPath !== "" && userPath.startsWith("/")) {
      candidates.push(userPath);
    } else {
      // No second config: try the common quota/balance paths automatically,
      // first JSON that yields non-empty balance/usage wins.
      const balancePaths = [
        "/v1/dashboard/billing/usage",
        "/v1/dashboard/billing/subscription",
        "/v1/dashboard/billing/credit_grants",
        "/v1/user/balance",
        "/user/balance",
        "/api/user/self",
        "/api/user/balance",
        "/v1/balance",
      ];
      const usagePaths = ["/v1/usage", "/usage"];
      const list = kind === "usage" ? usagePaths.concat(balancePaths) : balancePaths.concat(usagePaths);
      for (const item of list) candidates.push(item);
    }

    const proxyUrl = providerProxyUrl(ctx, providerId);
    const tried = [];
    for (const path of candidates) {
      const urls = [];
      const joined = joinBasePath(baseUrl, path);
      urls.push(joined);
      const origin = originOf(baseUrl);
      if (origin && path.startsWith("/api/")) {
        urls.push(origin + path);
      }
      for (const url of urls) {
        const cacheKey = providerId + "|" + url + "|" + kind;
        const cached = cache.get(cacheKey);
        if (!forceFresh && cached && Date.now() - cached.time < CACHE_MS) {
          sendJson(res, 200, cached.data);
          return;
        }
        const customProvider = {
          url,
          kind,
          parse: kind === "usage" ? parseOpenCodeGoPayload : parseCustomBalancePayload,
          credentialRefs: [credential.ref],
        };
        try {
          const data = await queryUpstream(customProvider, credential, proxyUrl);
          if (hasQueryData(data)) {
            cache.set(cacheKey, { time: Date.now(), data });
            sendJson(res, 200, data);
            return;
          }
          tried.push(url + "（返回为空）");
        } catch (error) {
          tried.push(url + "（" + (error?.message || error?.status || "失败") + "）");
        }
      }
    }
    sendJson(res, 502, { error: { code: "NO_QUOTA_ENDPOINT", message: `没有找到 ${providerId} 可用的额度接口，已尝试：${tried.join("、")}` } });
```

</details>

**依据 3 · 源码核查**：[lib/index.js:726-755](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/lib/index.js#L726-L755)

请求 Authorization Bearer。

<details>
<summary>查看原文（30行）</summary>

```text
async function queryUpstream(provider, credential, proxyUrl) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  const useProxy = proxyUrl && !bypassProxyFor(provider.url, noProxyEntries());
  try {
    let status;
    let text;
    if (useProxy) {
      // Through a proxy we must use undici's own request(): the global fetch
      // rejects a ProxyAgent built by the separately-installed undici package
      // ("invalid onRequestStart method").
      const response = await undiciRequest(provider.url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${credential.value}`,
        },
        dispatcher: getDispatcher(proxyUrl),
        signal: controller.signal,
      });
      status = response.statusCode;
      text = await response.body.text();
    } else {
      const response = await fetch(provider.url, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${credential.value}`,
        },
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1111-1128](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/lib/index.js#L1111-L1128)

路由注册。

<details>
<summary>查看原文（18行）</summary>

```text
  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: "/api/dsh-plugin-balance/query",
    handler: (req, res) => handleRequest(ctx, req, res),
  }), "dsh-plugin-balance query route");

  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: "/api/dsh-plugin-balance/providers",
    handler: (req, res) => handleProviders(ctx, req, res),
  }), "dsh-plugin-balance providers route");

  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: "/api/dsh-plugin-balance/tokens",
    handler: (req, res) => handleTokens(usageStore, req, res),
  }), "dsh-plugin-balance tokens route");
}
```

</details>

#### 缺口

- 未核 DSH Web 外层鉴权及多用户模型。
  **影响**：实际攻击可达性未证实。
  **进一步探讨**：隔离测试用户身份、外部 canary URL 和 providerId 配置；勿用真密钥。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 费用估算和安装依赖有何持续维护成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

固定包 1.4.4 BSD-3-Clause，Node>=24、undici 与 DSH credentials/webServer/llm/settings/sessions。价目表、北京峰谷窗口及 USD_TO_CNY=7.2 写死在源码，账单价格/汇率可能随时间变化；本轮未核这些数字是否仍对应官方现价，故仅能称固定版本中的估算规则。OpenAI credit_grants 是否在具体账户有效也未试。多外部查询、凭据保管、本地 JSON 存储和事件重放构成运行成本。浏览器可把 key 存 localStorage，需按设备安全审阅。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-68](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/package.json#L1-L68)

运行时、依赖、发布。

<details>
<summary>查看原文（68行）</summary>

```text
{
  "name": "dsh-plugin-balance",
  "version": "1.4.4",
  "description": "DeepSeek / OpenCode Go / OpenAI 额度悬浮窗：输入框上方显示，支持 DSH 模型列表同步、自定义额度接口、可拖动、主题适配；内置 DSH 会话 token 用量统计（按 日/月/模型）与官方峰谷价费用估算。",
  "type": "module",
  "engines": {
    "node": ">=24.0.0"
  },
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/index.js",
    "lib/client.js",
    "scripts/build.sh",
    "cordis.patch.yml",
    "README.md",
    "README.en.md",
    "LICENSE",
    "CHANGES.md",
    "docs/preview.png",
    "docs/preview-usage.png",
    "docs/preview-tokens.png",
    "docs/preview-context.png",
    "docs/preview-balance-type.png",
    "docs/preview-anim.gif"
  ],
  "license": "BSD-3-Clause",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Andrew111888/dsh-plugin-balance.git"
  },
  "homepage": "https://github.com/Andrew111888/dsh-plugin-balance",
  "bugs": {
    "url": "https://github.com/Andrew111888/dsh-plugin-balance/issues"
  },
  "keywords": [
    "deepseek",
    "harness",
    "dsh",
    "dsh-plugin",
    "balance",
    "opencode",
    "usage",
    "tokens"
  ],
  "dependencies": {
    "undici": "^8.10.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-runtime"
      ]
    }
  },
  "scripts": {
    "build": "bash scripts/build.sh",
    "pack": "npm pack",
    "typecheck": "bash scripts/build.sh --check"
  }
```

</details>

**依据 2 · 作者声明**：[README.md:106-125](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/README.md#L106-L125)

作者依赖和估算解释。

<details>
<summary>查看原文（20行）</summary>

```text
> 需要 `webServer` 与 `credentials` 服务（web profile 的 `@deepseek-ai/dsh-web-app` 已提供）。主进程半依赖 `credentials`、`webServer`、`llm`、`settings`、`sessions`。

## ⚙️ 使用说明

点击**开关按钮**打开设置：

- **DeepSeek 官方余额**：Key 可留空（自动使用 DSH 的 `DEEPSEEK_API_KEY`），也可在浏览器填写（存于 `localStorage`）；支持自定义 `/user/balance` 基地址。
- **OpenCode Go 套餐用量**：无需填写，自动读取 DSH 凭据 `OPENCODE_GO_API_KEY`（缺省回退 `OPENCODE_API_KEY`）。
- **自定义额度接口**：可从 DSH 模型列表选厂商（自动带出 `baseURL` 与 `apiKeyEnv`），或手动填；密钥由宿主解析，不会发给浏览器。

点击**柱状图按钮**打开「TOKEN 使用量」面板：今日 / 本月 / 总共 + 最近 7 天柱状图 + 按模型统计 + 费用徽章。

## 🧮 Token 用量与费用

主进程半监听 DSH 会话事件流（`session/event`），把每次请求上报的 token 用量（未命中输入 + 缓存写、缓存命中、输出）按 **日期 / 月份 / 模型** 折叠累计，并持久化到 `~/.dsh/storages/dsh-plugin-balance-usage.json`。

- 幂等：同一 `turn:step` 的新样本替换旧样本；重载 / 重启后重放日志不会重复计数。
- 模型归属按每个请求的 `request/header` 精确记录（会话中途切换模型也不会归错桶）。
- 费用按各厂商官方价计（DeepSeek 峰谷；Kimi K2/K3、GLM 4.x/5.x 恒价，非人民币价按 ~7.2 折算），按每个样本的**发生时刻**精确计价（详见界面内提示）。
- 提供给前端：`GET /api/dsh-plugin-balance/tokens`。
```

</details>

**依据 3 · 源码核查**：[lib/index.js:453-520](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/lib/index.js#L453-L520)

硬编码价目和汇率。

<details>
<summary>查看原文（68行）</summary>

```text
const USD_TO_CNY = 7.2;
function cny(usd) { return Number((usd * USD_TO_CNY).toFixed(2)); }
function flatRates(usdHit, usdMiss, usdOut) {
  const h = cny(usdHit);
  const m = cny(usdMiss);
  const o = cny(usdOut);
  return { idle: { hit: h, miss: m, out: o }, peak: { hit: h, miss: m, out: o } };
}
const zeroRates = () => ({ idle: { hit: 0, miss: 0, out: 0 }, peak: { hit: 0, miss: 0, out: 0 } });
const MODEL_PRICING = [
  // ── DeepSeek 官方（人民币峰谷价，2026-08-17 生效）──
  { match: ["v4-flash-vision-exp"], source: "DeepSeek 官方", rates: { idle: { hit: 0.05, miss: 1.5, out: 4.5 }, peak: { hit: 0.1, miss: 3.0, out: 9.0 } } },
  { match: ["v4-flash"], source: "DeepSeek 官方", rates: { idle: { hit: 0.05, miss: 1.5, out: 4.5 }, peak: { hit: 0.1, miss: 3.0, out: 9.0 } } },
  { match: ["v4-pro"], source: "DeepSeek 官方", rates: { idle: { hit: 0.15, miss: 4.5, out: 13.5 }, peak: { hit: 0.3, miss: 9.0, out: 27.0 } } },
  // ── Kimi / Moonshot（官方美元价折算）──
  { match: ["k3"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.3, 3.0, 15.0) },
  { match: ["k2.7"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.19, 0.95, 4.0) },
  { match: ["k2.6"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.16, 0.95, 4.0) },
  { match: ["k2.5"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.1, 0.6, 3.0) },
  { match: ["thinking-turbo", "k2-turbo", "k2-thinking"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.3, 1.15, 8.0) },
  { match: ["k2"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.15, 0.6, 2.5) },
  { match: ["moonshot", "kimi"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.15, 0.6, 2.5) },
  // ── GLM / Z.AI（官方美元价折算；先精确型号后泛化）──
  { match: ["glm-5.3", "glm-5.2", "glm-5.1"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.26, 1.4, 4.4) },
  { match: ["glm-5-turbo"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.24, 1.2, 4.0) },
  { match: ["glm-5v-turbo"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.24, 1.2, 4.0) },
  { match: ["glm-5"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.2, 1.0, 3.2) },
  { match: ["glm-4.7-flashx"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.01, 0.07, 0.4) },
  { match: ["glm-4.7-flash"], source: "GLM 官方(免费)", rates: zeroRates() },
  { match: ["glm-4.7"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.11, 0.6, 2.2) },
  { match: ["glm-4.6v"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.05, 0.3, 0.9) },
  { match: ["glm-4.6"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.11, 0.6, 2.2) },
  { match: ["glm-4.5-airx"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.22, 1.1, 4.5) },
  { match: ["glm-4.5-air"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.03, 0.2, 1.1) },
  { match: ["glm-4.5-x"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.45, 2.2, 8.9) },
  { match: ["glm-4.5-flash"], source: "GLM 官方(免费)", rates: zeroRates() },
  { match: ["glm-4.5v"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.11, 0.6, 1.8) },
  { match: ["glm-4.5"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.11, 0.6, 2.2) },
  { match: ["glm-4-32b"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.05, 0.1, 0.1) },
  { match: ["glm"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.11, 0.6, 2.2) },
  // ── LongCat（美团，OpenCode Go 价目表美元价折算）──
  { match: ["longcat"], source: "LongCat 官方(≈×7.2)", rates: flatRates(0.006, 0.3, 1.2) },
  // ── MiMo（小米，OpenCode Go 价目表美元价折算）──
  { match: ["mimo-v2.5-pro"], source: "MiMo 官方(≈×7.2)", rates: flatRates(0.003625, 0.435, 0.87) },
  { match: ["mimo-v2"], source: "MiMo 官方(≈×7.2)", rates: flatRates(0.0028, 0.14, 0.28) },
  // ── MiniMax（官方美元价折算；缓存写入按未命中单价近似）──
  { match: ["minimax-m3", "minimax-m2.7", "minimax-m2.5", "minimax"], source: "MiniMax 官方(≈×7.2)", rates: flatRates(0.06, 0.3, 1.2) },
  // ── Muse Spark（OpenCode Go 价目表美元价折算）──
  { match: ["muse-spark", "muse"], source: "Muse 官方(≈×7.2)", rates: flatRates(0.002, 0.1, 0.2) },
  // ── Qwen（阿里，≤256K 档美元价折算；>256K 长上下文单价更高未区分）──
  { match: ["qwen3.8-max"], source: "Qwen 官方(≈×7.2)", rates: flatRates(0.25, 2.0, 6.0) },
  { match: ["qwen3.7-max"], source: "Qwen 官方(≈×7.2)", rates: flatRates(0.5, 2.5, 7.5) },
  { match: ["qwen3.7-plus"], source: "Qwen 官方(≈×7.2)", rates: flatRates(0.04, 0.4, 1.6) },
  { match: ["qwen3.6-plus", "qwen3.5-plus"], source: "Qwen 官方(≈×7.2)", rates: flatRates(0.05, 0.5, 3.0) },
  // ── GPT 5.6 Luna（OpenAI，≤272K 档美元价折算）──
  { match: ["gpt-5.6-luna", "gpt-5.6"], source: "OpenAI 官方(≈×7.2)", rates: flatRates(0.02, 0.2, 1.2) },
  // ── Grok（xAI，OpenCode Go 价目表美元价折算）──
  { match: ["grok"], source: "Grok 官方(≈×7.2)", rates: flatRates(0.3, 2.0, 6.0) },
  // ── Hy3（腾讯混元，OpenCode Go 价目表美元价折算）──
  { match: ["hy3"], source: "Hy3 官方(≈×7.2)", rates: flatRates(0.035, 0.14, 0.58) },
  // ── Ox Alpha Free（免费）──
  { match: ["ox-alpha"], source: "免费", rates: zeroRates() },
];
const PRICING_INFO = {
  currency: "CNY",
  source: "DeepSeek/Kimi/GLM 各厂商官方定价页",
  peakWindow: "北京时间 9:00–12:00、14:00–18:00",
  note: "费用按各厂商官方价估算（统一人民币，非人民币官方价按汇率 7.2 折算）：DeepSeek 有峰谷（北京时间 9:00–12:00、14:00–18:00 高峰=空闲×2），其余恒价。覆盖 OpenCode Go 全部模型（DeepSeek/Kimi/GLM/Qwen/MiniMax/MiMo/LongCat/Grok/GPT-5.6/Hy3 等）；未收录模型不计费。",
```

</details>

**依据 4 · 源码核查**：[lib/client.js:12-62](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/lib/client.js#L12-L62)

浏览器本地 key 路径。

<details>
<summary>查看原文（51行）</summary>

```text
var LEGACY_STORAGE_KEY = "dsh-balance.deepseek-api-key";
var STORAGE_URL = "dsh-balance.deepseek-base-url";
var STORAGE_PROVIDER = "dsh-balance.provider";
var STORAGE_PATH = "dsh-balance.custom-path";
var STORAGE_KIND = "dsh-balance.custom-kind";
var STORAGE_VENDOR = "dsh-balance.custom-vendor";
var STORAGE_CUSTOM_URL = "dsh-balance.custom-base-url";
var STORAGE_DRAG = "dsh-balance.drag-offset";
var STORAGE_COLLAPSED = "dsh-balance.collapsed";
var DEFAULT_BASE_URL = "https://api.deepseek.com";
var DEFAULT_CUSTOM_PATH = "/user/balance";
var BALANCE_PATH = "/user/balance";
var HOST_ENDPOINT = "/api/dsh-plugin-balance/query";
var HOST_PROVIDERS_ENDPOINT = "/api/dsh-plugin-balance/providers";
var HOST_TOKENS_ENDPOINT = "/api/dsh-plugin-balance/tokens";
var REFRESH_MS = 30 * 60 * 1000;
var TOKENS_REFRESH_MS = 60 * 1000;
var GAP = 10;
var Z_INDEX = 2147483000;

var PROVIDER_META = {
deepseek: {
label: "DeepSeek 官方余额",
shortLabel: "DeepSeek 余额",
description: "api.deepseek.com /user/balance",
},
"opencode-go": {
label: "OpenCode Go 套餐",
shortLabel: "OpenCode Go",
description: "opencode.ai/zen/go/v1 /usage",
},
custom: {
label: "自定义额度接口",
shortLabel: "自定义",
description: "自定义 baseURL + path",
},
};

var KNOWN_PROVIDERS = ["deepseek", "opencode-go", "custom"];

function providerKeyStorageKey(provider) {
return "dsh-balance.key." + provider;
}
function currentKeyStorageKey(provider, vendor) {
if (provider === "custom" && vendor && vendor !== "manual") return "dsh-balance.key.vendor." + vendor;
return providerKeyStorageKey(provider);
}
function readProviderKey(provider, vendor) {
var key = readStorage(currentKeyStorageKey(provider, vendor));
if (!key && provider === "deepseek") key = readStorage(LEGACY_STORAGE_KEY);
return key;
```

</details>

#### 缺口

- 未验证现价与账单接口。
  **影响**：费用估算误差未知。
  **进一步探讨**：捕获各官方价目版本并对账，给出版本/日期。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样试点而不误用账单数字或泄漏密钥？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先在隔离 DSH Web 禁用/限制自定义代理，测试内置只读余额和本地用量，并只用无生产密钥的 canary 验域名绕送；对每种数字注明来源和更新时间，与官方账单按相同时间窗核差。未实现的改进是假设自定义 URL 只能由可信管理配置固化且与凭据引用绑定、请求不接收任意 baseUrl，缓存按身份/凭据隔离；价目表带来源日期和变更提示。衡量对账误差、查询失败、凭据外发阻断、人工预算时间。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:804-890](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/lib/index.js#L804-L890)

当前自定义地址/密钥可由同次请求组合。

<details>
<summary>查看原文（87行）</summary>

```text
  // Custom / DSH-synced vendor: baseUrl + path + kind are sent by the client
  // (auto-filled from the DSH model settings where possible); the credential is
  // resolved server-side from the vendor's configured apiKeyEnv.
  if (!provider) {
    const baseUrl = url.searchParams.get("baseUrl");
    const kind = url.searchParams.get("kind") === "usage" ? "usage" : "balance";
    if (typeof baseUrl !== "string" || !/^https?:\/\//.test(baseUrl)) {
      sendJson(res, 400, { error: { code: "BAD_CUSTOM_CONFIG", message: "自定义厂商需要 http(s) 的 baseUrl" } });
      return;
    }
    const headerKey = req.headers["x-dsh-balance-key"] && typeof req.headers["x-dsh-balance-key"] === "string"
      ? req.headers["x-dsh-balance-key"].trim()
      : "";
    let credential;
    if (headerKey) {
      credential = { ref: "client-header", value: headerKey };
    } else {
      const settings = providerSettings(ctx, providerId) || {};
      const refs = typeof settings.apiKeyEnv === "string" && settings.apiKeyEnv
        ? [settings.apiKeyEnv]
        : [providerId.toUpperCase().replace(/-/g, "_") + "_API_KEY"];
      credential = await resolveCredential(ctx, refs);
    }
    if (!credential) {
      sendJson(res, 502, { error: { code: "MISSING_CREDENTIAL", message: `未配置 ${providerId} 的 API Key（apiKeyEnv）` } });
      return;
    }

    const userPath = url.searchParams.get("path");
    const candidates = [];
    if (typeof userPath === "string" && userPath !== "" && userPath.startsWith("/")) {
      candidates.push(userPath);
    } else {
      // No second config: try the common quota/balance paths automatically,
      // first JSON that yields non-empty balance/usage wins.
      const balancePaths = [
        "/v1/dashboard/billing/usage",
        "/v1/dashboard/billing/subscription",
        "/v1/dashboard/billing/credit_grants",
        "/v1/user/balance",
        "/user/balance",
        "/api/user/self",
        "/api/user/balance",
        "/v1/balance",
      ];
      const usagePaths = ["/v1/usage", "/usage"];
      const list = kind === "usage" ? usagePaths.concat(balancePaths) : balancePaths.concat(usagePaths);
      for (const item of list) candidates.push(item);
    }

    const proxyUrl = providerProxyUrl(ctx, providerId);
    const tried = [];
    for (const path of candidates) {
      const urls = [];
      const joined = joinBasePath(baseUrl, path);
      urls.push(joined);
      const origin = originOf(baseUrl);
      if (origin && path.startsWith("/api/")) {
        urls.push(origin + path);
      }
      for (const url of urls) {
        const cacheKey = providerId + "|" + url + "|" + kind;
        const cached = cache.get(cacheKey);
        if (!forceFresh && cached && Date.now() - cached.time < CACHE_MS) {
          sendJson(res, 200, cached.data);
          return;
        }
        const customProvider = {
          url,
          kind,
          parse: kind === "usage" ? parseOpenCodeGoPayload : parseCustomBalancePayload,
          credentialRefs: [credential.ref],
        };
        try {
          const data = await queryUpstream(customProvider, credential, proxyUrl);
          if (hasQueryData(data)) {
            cache.set(cacheKey, { time: Date.now(), data });
            sendJson(res, 200, data);
            return;
          }
          tried.push(url + "（返回为空）");
        } catch (error) {
          tried.push(url + "（" + (error?.message || error?.status || "失败") + "）");
        }
      }
    }
    sendJson(res, 502, { error: { code: "NO_QUOTA_ENDPOINT", message: `没有找到 ${providerId} 可用的额度接口，已尝试：${tried.join("、")}` } });
```

</details>

**依据 2 · 源码核查**：[lib/index.js:453-520](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/lib/index.js#L453-L520)

静态价格和汇率。

<details>
<summary>查看原文（68行）</summary>

```text
const USD_TO_CNY = 7.2;
function cny(usd) { return Number((usd * USD_TO_CNY).toFixed(2)); }
function flatRates(usdHit, usdMiss, usdOut) {
  const h = cny(usdHit);
  const m = cny(usdMiss);
  const o = cny(usdOut);
  return { idle: { hit: h, miss: m, out: o }, peak: { hit: h, miss: m, out: o } };
}
const zeroRates = () => ({ idle: { hit: 0, miss: 0, out: 0 }, peak: { hit: 0, miss: 0, out: 0 } });
const MODEL_PRICING = [
  // ── DeepSeek 官方（人民币峰谷价，2026-08-17 生效）──
  { match: ["v4-flash-vision-exp"], source: "DeepSeek 官方", rates: { idle: { hit: 0.05, miss: 1.5, out: 4.5 }, peak: { hit: 0.1, miss: 3.0, out: 9.0 } } },
  { match: ["v4-flash"], source: "DeepSeek 官方", rates: { idle: { hit: 0.05, miss: 1.5, out: 4.5 }, peak: { hit: 0.1, miss: 3.0, out: 9.0 } } },
  { match: ["v4-pro"], source: "DeepSeek 官方", rates: { idle: { hit: 0.15, miss: 4.5, out: 13.5 }, peak: { hit: 0.3, miss: 9.0, out: 27.0 } } },
  // ── Kimi / Moonshot（官方美元价折算）──
  { match: ["k3"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.3, 3.0, 15.0) },
  { match: ["k2.7"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.19, 0.95, 4.0) },
  { match: ["k2.6"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.16, 0.95, 4.0) },
  { match: ["k2.5"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.1, 0.6, 3.0) },
  { match: ["thinking-turbo", "k2-turbo", "k2-thinking"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.3, 1.15, 8.0) },
  { match: ["k2"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.15, 0.6, 2.5) },
  { match: ["moonshot", "kimi"], source: "Kimi 官方(≈×7.2)", rates: flatRates(0.15, 0.6, 2.5) },
  // ── GLM / Z.AI（官方美元价折算；先精确型号后泛化）──
  { match: ["glm-5.3", "glm-5.2", "glm-5.1"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.26, 1.4, 4.4) },
  { match: ["glm-5-turbo"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.24, 1.2, 4.0) },
  { match: ["glm-5v-turbo"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.24, 1.2, 4.0) },
  { match: ["glm-5"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.2, 1.0, 3.2) },
  { match: ["glm-4.7-flashx"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.01, 0.07, 0.4) },
  { match: ["glm-4.7-flash"], source: "GLM 官方(免费)", rates: zeroRates() },
  { match: ["glm-4.7"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.11, 0.6, 2.2) },
  { match: ["glm-4.6v"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.05, 0.3, 0.9) },
  { match: ["glm-4.6"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.11, 0.6, 2.2) },
  { match: ["glm-4.5-airx"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.22, 1.1, 4.5) },
  { match: ["glm-4.5-air"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.03, 0.2, 1.1) },
  { match: ["glm-4.5-x"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.45, 2.2, 8.9) },
  { match: ["glm-4.5-flash"], source: "GLM 官方(免费)", rates: zeroRates() },
  { match: ["glm-4.5v"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.11, 0.6, 1.8) },
  { match: ["glm-4.5"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.11, 0.6, 2.2) },
  { match: ["glm-4-32b"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.05, 0.1, 0.1) },
  { match: ["glm"], source: "GLM 官方(≈×7.2)", rates: flatRates(0.11, 0.6, 2.2) },
  // ── LongCat（美团，OpenCode Go 价目表美元价折算）──
  { match: ["longcat"], source: "LongCat 官方(≈×7.2)", rates: flatRates(0.006, 0.3, 1.2) },
  // ── MiMo（小米，OpenCode Go 价目表美元价折算）──
  { match: ["mimo-v2.5-pro"], source: "MiMo 官方(≈×7.2)", rates: flatRates(0.003625, 0.435, 0.87) },
  { match: ["mimo-v2"], source: "MiMo 官方(≈×7.2)", rates: flatRates(0.0028, 0.14, 0.28) },
  // ── MiniMax（官方美元价折算；缓存写入按未命中单价近似）──
  { match: ["minimax-m3", "minimax-m2.7", "minimax-m2.5", "minimax"], source: "MiniMax 官方(≈×7.2)", rates: flatRates(0.06, 0.3, 1.2) },
  // ── Muse Spark（OpenCode Go 价目表美元价折算）──
  { match: ["muse-spark", "muse"], source: "Muse 官方(≈×7.2)", rates: flatRates(0.002, 0.1, 0.2) },
  // ── Qwen（阿里，≤256K 档美元价折算；>256K 长上下文单价更高未区分）──
  { match: ["qwen3.8-max"], source: "Qwen 官方(≈×7.2)", rates: flatRates(0.25, 2.0, 6.0) },
  { match: ["qwen3.7-max"], source: "Qwen 官方(≈×7.2)", rates: flatRates(0.5, 2.5, 7.5) },
  { match: ["qwen3.7-plus"], source: "Qwen 官方(≈×7.2)", rates: flatRates(0.04, 0.4, 1.6) },
  { match: ["qwen3.6-plus", "qwen3.5-plus"], source: "Qwen 官方(≈×7.2)", rates: flatRates(0.05, 0.5, 3.0) },
  // ── GPT 5.6 Luna（OpenAI，≤272K 档美元价折算）──
  { match: ["gpt-5.6-luna", "gpt-5.6"], source: "OpenAI 官方(≈×7.2)", rates: flatRates(0.02, 0.2, 1.2) },
  // ── Grok（xAI，OpenCode Go 价目表美元价折算）──
  { match: ["grok"], source: "Grok 官方(≈×7.2)", rates: flatRates(0.3, 2.0, 6.0) },
  // ── Hy3（腾讯混元，OpenCode Go 价目表美元价折算）──
  { match: ["hy3"], source: "Hy3 官方(≈×7.2)", rates: flatRates(0.035, 0.14, 0.58) },
  // ── Ox Alpha Free（免费）──
  { match: ["ox-alpha"], source: "免费", rates: zeroRates() },
];
const PRICING_INFO = {
  currency: "CNY",
  source: "DeepSeek/Kimi/GLM 各厂商官方定价页",
  peakWindow: "北京时间 9:00–12:00、14:00–18:00",
  note: "费用按各厂商官方价估算（统一人民币，非人民币官方价按汇率 7.2 折算）：DeepSeek 有峰谷（北京时间 9:00–12:00、14:00–18:00 高峰=空闲×2），其余恒价。覆盖 OpenCode Go 全部模型（DeepSeek/Kimi/GLM/Qwen/MiniMax/MiMo/LongCat/Grok/GPT-5.6/Hy3 等）；未收录模型不计费。",
```

</details>

**依据 3 · 作者声明**：[README.md:118-126](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/README.md#L118-L126)

作者本地统计目标。

```text
## 🧮 Token 用量与费用

主进程半监听 DSH 会话事件流（`session/event`），把每次请求上报的 token 用量（未命中输入 + 缓存写、缓存命中、输出）按 **日期 / 月份 / 模型** 折叠累计，并持久化到 `~/.dsh/storages/dsh-plugin-balance-usage.json`。

- 幂等：同一 `turn:step` 的新样本替换旧样本；重载 / 重启后重放日志不会重复计数。
- 模型归属按每个请求的 `request/header` 精确记录（会话中途切换模型也不会归错桶）。
- 费用按各厂商官方价计（DeepSeek 峰谷；Kimi K2/K3、GLM 4.x/5.x 恒价，非人民币价按 ~7.2 折算），按每个样本的**发生时刻**精确计价（详见界面内提示）。
- 提供给前端：`GET /api/dsh-plugin-balance/tokens`。
- 存储为 `version 9`：旧版数据不再估算折算，而是从会话事件流（含磁盘归档日志）精确重放重建。
```

#### 缺口

- 域名绑定、价目版本化尚未实现。
  **影响**：不能当作当前安全/准确保障。
  **进一步探讨**：实现后用 canary 与账单对照。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
