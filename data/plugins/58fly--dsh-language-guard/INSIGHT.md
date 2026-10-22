# dsh-language-guard

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[c2460eb](https://github.com/58fly/dsh-language-guard/tree/c2460ebb2d208e8e70f5a2c59c35e2ea2eb85763)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/58fly/dsh-language-guard) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-language-guard)
<!-- END META -->

> **实现功能**：在系统提示、周期提醒和界面快捷入口中锁定模型输出语言。

> **核心亮点**：生成层约束、自动跟随界面语言、热更新与可验证 session log 形成闭环，且不外发对话内容。 详见[Q03](#research-q03)。

> **风险与缺陷**：本质仍是提示约束，不能改写 tools schema 或保证模型服从；与 dsh-context 同位提示会重复耗 token，周期 notice 在 UI 可见。 详见[Q04](#research-q04)。

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
  - [Q01 · 场景：适合希望推理、回答和工具描述长期保持同一语言的会话？](#detail-section-11)
  - [Q02 · 机制：三段 systemPrompt section 按 Basic/Strong/Periodic 装配，Periodic 在 agent/pre-step 每 N 轮加入 notice？](#detail-section-12)
  - [Q03 · 贡献：生成层约束、自动跟随界面语言、热更新与可验证 session log 形成闭环，且不外发对话内容。？](#detail-section-13)
  - [Q04 · 局限：本质仍是提示约束，不能改写 tools schema 或保证模型服从？](#detail-section-14)
  - [Q05 · 依赖：需要 DSH=0.2.1-rc.2、Node 22.19+/24、systemPrompt 与 settings/Client slots？](#detail-section-15)
  - [Q06 · 成本与效果：Basic/Strong 每次请求增加固定提示字符，Periodic 再按 N 轮加 notice？](#detail-section-16)
  - [Q07 · 工程：固定 section 顺序、保留 decision 字段、跳过 subagent 和日志验证脚本体现边界意识？](#detail-section-17)
  - [Q08 · 假设：按模型服从率自适应从 Basic 升 Strong、连续合格后降级，比固定三档更省 token，但必须避免用模型自评作为唯一判据。？](#detail-section-18)
  - [Q09 · 采用：可在非关键会话试用 Basic，并从 session log 验证 section 数和实际语言？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合希望推理、回答和工具描述长期保持同一语言的会话；只需翻译已显示推理时官方 cot-translation 更直接。 详见[Q01](#research-q01)。

适合希望推理、回答和工具描述长期保持同一语言的会话；只需翻译已显示推理时官方 cot-translation 更直接。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

#### 能力明细

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 用户命令 | /language 查询、临时切换或重置本次运行语言 | 不同模型/工具调用下的语言服从率、token 增量与 prompt-cache 影响未测 |
| 界面 | 插件配置卡和侧栏语言菜单 | 不同模型/工具调用下的语言服从率、token 增量与 prompt-cache 影响未测 |
| 事件监听 | agent/pre-step 周期提醒与 settings/document-updated 热更新 | 不同模型/工具调用下的语言服从率、token 增量与 prompt-cache 影响未测 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH systemPrompt | 必需 | 注入三段约束 | 核心失效 |
| settings/Client slots | 配置时 | 热更新与菜单 | 仅默认配置 |
| dsh-context 共存 | 可选冲突 | 同位置语言提示 | 重复 token |

#### 启动步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 选语言 | Auto 或 Manual | 核面板 resolved 值 |
| 选强度 | 先 Basic | 发送一条消息 |
| 验真 | 读 session system/message | 核 sections 与语言 |
| 调优 | 违规才升 Strong/Periodic | 清除重复 prompt |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 每请求 | 2或3段系统提示 | 选择强度 | 精确 token 未测 |
| Periodic | 每 N 轮一个 notice | 设置 3-50 间隔 | 聊天可见 |
| 切换配置 | 新增 system node/缓存变化 | 减少频繁切换 | cache 影响未知 |

#### 效果

| 效果项 | 源码支持 | 验证指标 |
| --- | --- | --- |
| 输出一致性 | 生成层约束 | 语言违规率 |
| 无需外部翻译 | 零网络/不读对话 | 外发字节为0 |
| cot-translation 对照 | 作用层不同 | 原始语言与显示语言任务成功率 |

> **思考**：本质仍是提示约束，不能改写 tools schema 或保证模型服从；与 dsh-context 同位提示会重复耗 token，周期 notice 在 UI 可见。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：生成层约束、自动跟随界面语言、热更新与可验证 session log 形成闭环，且不外发对话内容。 详见[Q03](#research-q03)。

生成层约束、自动跟随界面语言、热更新与可验证 session log 形成闭环，且不外发对话内容。 详见[Q03](#research-q03)。

固定 section 顺序、保留 decision 字段、跳过 subagent 和日志验证脚本体现边界意识；仍需对第三方 prompt 冲突做组合测试。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

本质仍是提示约束，不能改写 tools schema 或保证模型服从；与 dsh-context 同位提示会重复耗 token，周期 notice 在 UI 可见。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可在非关键会话试用 Basic，并从 session log 验证 section 数和实际语言；清理 dsh-context 重复约束后再评估 Strong/Periodic。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持三段 systemPrompt、Periodic pre-step 提醒、/language 覆盖及配置热更新；本轮未让模型生成或读取真实 session log，因此语言服从率、token 增量和缓存影响仍是实验问题。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/cycle.js、lib/commands.js、client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 README.md、lib/index.js、lib/cycle.js、lib/commands.js、client.js 与 prepared inventory；未安装、未运行、未访问真实账号/设备/服务。不同模型/工具调用下的语言服从率、token 增量与 prompt-cache 影响未测。
- 下一步：下一步只做本项可证伪实验：对 3 个模型各跑 100 轮含工具描述的中英混合任务，统计语言违规率、输入 token、缓存命中和 Periodic notice 次数。

**分析版本**

- **仓库**：[58fly/dsh-language-guard](https://github.com/58fly/dsh-language-guard)
- **版本号**：0.3.4（[固定提交 c2460eb](https://github.com/58fly/dsh-language-guard/tree/c2460ebb2d208e8e70f5a2c59c35e2ea2eb85763)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

按模型服从率自适应从 Basic 升 Strong、连续合格后降级，比固定三档更省 token，但必须避免用模型自评作为唯一判据。 详见[Q08](#research-q08)。

下一步只做本项可证伪实验：对 3 个模型各跑 100 轮含工具描述的中英混合任务，统计语言违规率、输入 token、缓存命中和 Periodic notice 次数。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 33 | 11154 | — | — | 159526 |
| .js | source | 7 | 2440 | 1693 | 560 | — |
| .mjs | source | 8 | 1890 | 1395 | 289 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/58fly/dsh-language-guard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/58fly/dsh-language-guard/issues?q=is%3Aissue+created%3A2026-09-22T16%3A03%3A14.785Z..2026-10-22T16%3A03%3A14.785Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/58fly/dsh-language-guard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T16%3A03%3A14.785Z..2026-10-22T16%3A03%3A14.785Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：生成层语言锁定能否以可控 token 成本提高跨轮一致性而不与其他提示冲突？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 场景：适合希望推理、回答和工具描述长期保持同一语言的会话？

**研究主题**：场景与需求

#### 完整回答

适合希望推理、回答和工具描述长期保持同一语言的会话；只需翻译已显示推理时官方 cot-translation 更直接。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/58fly/dsh-language-guard/blob/c2460ebb2d208e8e70f5a2c59c35e2ea2eb85763/README.md#L1-L5)

固定提交复核：场景相关声明与实现入口。

```text
# Language Guard (dsh-language-guard)

**English** | [简体中文](README.zh.md)

> Make the DSH agent think and answer in the language you choose — Simplified Chinese by default, three strength levels, effective on the next message, zero dependencies, no build step.
```

#### 缺口

- 不同模型/工具调用下的语言服从率、token 增量与 prompt-cache 影响未测
  **影响**：场景结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：对 3 个模型各跑 100 轮含工具描述的中英混合任务，统计语言违规率、输入 token、缓存命中和 Periodic notice 次数

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 机制：三段 systemPrompt section 按 Basic/Strong/Periodic 装配，Periodic 在 agent/pre-step 每 N 轮加入 notice？

**研究主题**：功能与机制

#### 完整回答

三段 systemPrompt section 按 Basic/Strong/Periodic 装配，Periodic 在 agent/pre-step 每 N 轮加入 notice；/language 提供内存覆盖。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-10](https://github.com/58fly/dsh-language-guard/blob/c2460ebb2d208e8e70f5a2c59c35e2ea2eb85763/lib/index.js#L1-L10)

固定提交复核：机制相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * dsh-language-guard —— Host 半。
 *
 * 职责：
 * 1. 注册三个常驻 system prompt section（head / mid / tail），切档只切 `text()` 的返回值；
 * 2. D 档注册 `agent/pre-step` 监听，每 N 轮追加一条语言自检提醒；
 * 3. 提供 `/language` 斜杠命令与设置表单（settings 服务懒注入）；
 * 4. 自动语言模式（0.2.0）：读界面语言，按 `languageMode` 决定是否跟随。
 *
 * 合规边界（docs/decisions/01-mechanism.md 第 1 节）：
```

</details>

#### 缺口

- 不同模型/工具调用下的语言服从率、token 增量与 prompt-cache 影响未测
  **影响**：机制结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：对 3 个模型各跑 100 轮含工具描述的中英混合任务，统计语言违规率、输入 token、缓存命中和 Periodic notice 次数

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 贡献：生成层约束、自动跟随界面语言、热更新与可验证 session log 形成闭环，且不外发对话内容。？

**研究主题**：贡献与相对优势

#### 完整回答

生成层约束、自动跟随界面语言、热更新与可验证 session log 形成闭环，且不外发对话内容。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/58fly/dsh-language-guard/blob/c2460ebb2d208e8e70f5a2c59c35e2ea2eb85763/README.md#L1-L5)

固定提交复核：贡献相关声明与实现入口。

```text
# Language Guard (dsh-language-guard)

**English** | [简体中文](README.zh.md)

> Make the DSH agent think and answer in the language you choose — Simplified Chinese by default, three strength levels, effective on the next message, zero dependencies, no build step.
```

#### 缺口

- 不同模型/工具调用下的语言服从率、token 增量与 prompt-cache 影响未测
  **影响**：贡献结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：对 3 个模型各跑 100 轮含工具描述的中英混合任务，统计语言违规率、输入 token、缓存命中和 Periodic notice 次数

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 局限：本质仍是提示约束，不能改写 tools schema 或保证模型服从？

**研究主题**：缺陷与关键质疑

#### 完整回答

本质仍是提示约束，不能改写 tools schema 或保证模型服从；与 dsh-context 同位提示会重复耗 token，周期 notice 在 UI 可见。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-10](https://github.com/58fly/dsh-language-guard/blob/c2460ebb2d208e8e70f5a2c59c35e2ea2eb85763/lib/index.js#L1-L10)

固定提交复核：局限相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * dsh-language-guard —— Host 半。
 *
 * 职责：
 * 1. 注册三个常驻 system prompt section（head / mid / tail），切档只切 `text()` 的返回值；
 * 2. D 档注册 `agent/pre-step` 监听，每 N 轮追加一条语言自检提醒；
 * 3. 提供 `/language` 斜杠命令与设置表单（settings 服务懒注入）；
 * 4. 自动语言模式（0.2.0）：读界面语言，按 `languageMode` 决定是否跟随。
 *
 * 合规边界（docs/decisions/01-mechanism.md 第 1 节）：
```

</details>

#### 缺口

- 不同模型/工具调用下的语言服从率、token 增量与 prompt-cache 影响未测
  **影响**：局限结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：对 3 个模型各跑 100 轮含工具描述的中英混合任务，统计语言违规率、输入 token、缓存命中和 Periodic notice 次数

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 依赖：需要 DSH>=0.2.1-rc.2、Node 22.19+/24、systemPrompt 与 settings/Client slots？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要 DSH>=0.2.1-rc.2、Node 22.19+/24、systemPrompt 与 settings/Client slots；自动模式只能读取 DSH 界面语言而非 OS。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/58fly/dsh-language-guard/blob/c2460ebb2d208e8e70f5a2c59c35e2ea2eb85763/README.md#L1-L5)

固定提交复核：依赖相关声明与实现入口。

```text
# Language Guard (dsh-language-guard)

**English** | [简体中文](README.zh.md)

> Make the DSH agent think and answer in the language you choose — Simplified Chinese by default, three strength levels, effective on the next message, zero dependencies, no build step.
```

#### 缺口

- 不同模型/工具调用下的语言服从率、token 增量与 prompt-cache 影响未测
  **影响**：依赖结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：对 3 个模型各跑 100 轮含工具描述的中英混合任务，统计语言违规率、输入 token、缓存命中和 Periodic notice 次数

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本与效果：Basic/Strong 每次请求增加固定提示字符，Periodic 再按 N 轮加 notice？

**研究主题**：效果与总成本

#### 完整回答

Basic/Strong 每次请求增加固定提示字符，Periodic 再按 N 轮加 notice；切换层级会追加新 system node，实际 token/缓存影响未计量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/58fly/dsh-language-guard/blob/c2460ebb2d208e8e70f5a2c59c35e2ea2eb85763/README.md#L1-L5)

固定提交复核：成本与效果相关声明与实现入口。

```text
# Language Guard (dsh-language-guard)

**English** | [简体中文](README.zh.md)

> Make the DSH agent think and answer in the language you choose — Simplified Chinese by default, three strength levels, effective on the next message, zero dependencies, no build step.
```

#### 缺口

- 不同模型/工具调用下的语言服从率、token 增量与 prompt-cache 影响未测
  **影响**：成本与效果结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：对 3 个模型各跑 100 轮含工具描述的中英混合任务，统计语言违规率、输入 token、缓存命中和 Periodic notice 次数

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 工程：固定 section 顺序、保留 decision 字段、跳过 subagent 和日志验证脚本体现边界意识？

**研究主题**：工程质量与复用

#### 完整回答

固定 section 顺序、保留 decision 字段、跳过 subagent 和日志验证脚本体现边界意识；仍需对第三方 prompt 冲突做组合测试。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-10](https://github.com/58fly/dsh-language-guard/blob/c2460ebb2d208e8e70f5a2c59c35e2ea2eb85763/lib/index.js#L1-L10)

固定提交复核：工程相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * dsh-language-guard —— Host 半。
 *
 * 职责：
 * 1. 注册三个常驻 system prompt section（head / mid / tail），切档只切 `text()` 的返回值；
 * 2. D 档注册 `agent/pre-step` 监听，每 N 轮追加一条语言自检提醒；
 * 3. 提供 `/language` 斜杠命令与设置表单（settings 服务懒注入）；
 * 4. 自动语言模式（0.2.0）：读界面语言，按 `languageMode` 决定是否跟随。
 *
 * 合规边界（docs/decisions/01-mechanism.md 第 1 节）：
```

</details>

#### 缺口

- 不同模型/工具调用下的语言服从率、token 增量与 prompt-cache 影响未测
  **影响**：工程结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：对 3 个模型各跑 100 轮含工具描述的中英混合任务，统计语言违规率、输入 token、缓存命中和 Periodic notice 次数

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 假设：按模型服从率自适应从 Basic 升 Strong、连续合格后降级，比固定三档更省 token，但必须避免用模型自评作为唯一判据。？

**研究主题**：新假设与验证

#### 完整回答

按模型服从率自适应从 Basic 升 Strong、连续合格后降级，比固定三档更省 token，但必须避免用模型自评作为唯一判据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/58fly/dsh-language-guard/blob/c2460ebb2d208e8e70f5a2c59c35e2ea2eb85763/README.md#L1-L5)

固定提交复核：假设相关声明与实现入口。

```text
# Language Guard (dsh-language-guard)

**English** | [简体中文](README.zh.md)

> Make the DSH agent think and answer in the language you choose — Simplified Chinese by default, three strength levels, effective on the next message, zero dependencies, no build step.
```

#### 缺口

- 不同模型/工具调用下的语言服从率、token 增量与 prompt-cache 影响未测
  **影响**：假设结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：对 3 个模型各跑 100 轮含工具描述的中英混合任务，统计语言违规率、输入 token、缓存命中和 Periodic notice 次数

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 采用：可在非关键会话试用 Basic，并从 session log 验证 section 数和实际语言？

**研究主题**：采用判断

#### 完整回答

可在非关键会话试用 Basic，并从 session log 验证 section 数和实际语言；清理 dsh-context 重复约束后再评估 Strong/Periodic。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/58fly/dsh-language-guard/blob/c2460ebb2d208e8e70f5a2c59c35e2ea2eb85763/README.md#L1-L5)

固定提交复核：采用相关声明与实现入口。

```text
# Language Guard (dsh-language-guard)

**English** | [简体中文](README.zh.md)

> Make the DSH agent think and answer in the language you choose — Simplified Chinese by default, three strength levels, effective on the next message, zero dependencies, no build step.
```

#### 缺口

- 不同模型/工具调用下的语言服从率、token 增量与 prompt-cache 影响未测
  **影响**：采用结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：对 3 个模型各跑 100 轮含工具描述的中英混合任务，统计语言违规率、输入 token、缓存命中和 Periodic notice 次数

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
