# @awiki/dsh-plugin

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[60db12b](https://github.com/AgentConnect/dsh-awiki/tree/60db12b72181668b8ea1a270bddb279bb0f50ed7)

<!-- BEGIN META -->
[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AgentConnect/dsh-awiki) [![npm 30d 1,529](https://img.shields.io/static/v1?label=npm+30d&message=1%2C529&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin)
<!-- END META -->

> **实现功能**：将AWiki身份、私信、群聊与邮件接入DSH，提供Web界面和通信工具。

> **核心亮点**：整合独立身份和 IM Core、Host 公共 DTO、通信工具与界面，并增加会话/租户范围控制。它相对“在独立 AWiki 客户端收发消息，再人工复制给模型并把生成结果复制回去”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **风险与缺陷**：可选入站监听会把外部消息触发 Agent；效果发生后再失败可能导致重放，且底层密钥、网络和租户服务不由本插件证明。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

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
  - [Q01 · 目标用户、反复任务、原有办法与合格结果是什么？](#detail-section-11)
  - [Q02 · 入口、调用链、数据和状态如何实现核心能力？](#detail-section-12)
  - [Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？](#detail-section-14)
  - [Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？](#detail-section-15)
  - [Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？](#detail-section-16)
  - [Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？](#detail-section-17)
  - [Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？](#detail-section-18)
  - [Q09 · 对谁值得观察或试用，成功与停止标准是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已经使用 AWiki 身份与通信、希望在 DSH 中处理消息的用户可用它把 AWiki 身份、私信、群聊、邮件、摘要与可选入站 Agent 监听接到 DSH 工具和 Web 界面；合格结果是操作绑定正确身份和租户，发送对象与内容经授权，收发结果和未知状态可追踪。详见[Q01](#research-q01)。

基线是在独立 AWiki 客户端收发消息，再人工复制给模型并把生成结果复制回去。本项的价值主要来自整合独立身份和 IM Core、Host 公共 DTO、通信工具与界面，并增加会话/租户范围控制；尚无同任务、同资源与同验收口径的运行对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| AWiki 身份接入 | 在 DSH 中呈现并选择 AWiki 身份和租户。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 消息与邮件工具 | 读取和经授权发送私信、群聊与邮件。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 可选入站Agent | 允许白名单来源触发受范围约束的 Agent 处理。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| ANP Identity 与 IM Core Node原生依赖 | 必需 | 身份密钥、账户绑定和消息存储 | native/版本不匹配时停止主插件 |
| AWiki租户服务、网络与Host私有stateRoot | 通信必需 | 收发消息/邮件并隔离租户 | 网络未知保留效果未知 |
| 默认模型与exact allowlist | 摘要/入站Agent必需 | 总结与受限自动回复 | 默认关闭监听，未授权来源不触发 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 加载identity和Core，再选择/恢复明确租户身份 | DID、账户和私有目录一致 |
| 2 | 读取消息；发送前复核对象/内容/租户 | 回执绑定消息ID，未知效果不盲重发 |
| 3 | 可选listener仅在白名单与故障演练后启用 | turn失败不提交水位，已发生工具效果有独立阶段记录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | AWiki服务/网络、native存储和可选模型 | 注册/恢复身份、配置租户和发送审批 | 设备恢复与安全审阅小时未知 |
| 持续使用 | 消息流量、摘要/Agent模型调用与缓存 | 复核发送、维护allowlist和处理设备状态 | 每百条消息费用与人工分钟未知 |
| 失败恢复 | 重复模型调用/消息发送风险 | 按incoming/message ID查Core与水位后重试 | Agent工具效果可能已发生但回复未提交 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一通信入口 | 工具与Web界面整合身份、消息和邮件 | 跨设备/租户真实可用性 |
| 会话/租户fence | 源码有tools/pre-execute等范围控制 | 所有工具与listener路径是否同样覆盖 |
| 入站Agent | 允许白名单消息触发处理 | 副作用幂等、恶意内容与失败重放 |

> **思考**：可选入站监听会把外部消息触发 Agent；效果发生后再失败可能导致重放，且底层密钥、网络和租户服务不由本插件证明。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：整合独立身份和 IM Core、Host 公共 DTO、通信工具与界面，并增加会话/租户范围控制。它相对“在独立 AWiki 客户端收发消息，再人工复制给模型并把生成结果复制回去”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

整合独立身份和 IM Core、Host 公共 DTO、通信工具与界面，并增加会话/租户范围控制。它相对“在独立 AWiki 客户端收发消息，再人工复制给模型并把生成结果复制回去”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

固定源码把关键职责收敛到 lib/index.js 及其相邻模块，便于追踪入口与状态。可借鉴的是显式宿主接线与配置边界；移植仍需重做 API 兼容、权限、持久化和“可选listener仅在白名单与故障演练后启用｜turn失败不提交水位，已发生工具效果有独立阶段记录”验证。详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

可选入站监听会把外部消息触发 Agent；效果发生后再失败可能导致重放，且底层密钥、网络和租户服务不由本插件证明。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有AWiki需求者可在关闭入站监听的前提下试用收发工具，先固定身份、审批和失败重放边界。 采用结论是试用，不是安装保证；成功与停止标准见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为源码支持的宿主接线与流程组合；效果、兼容和恢复没有真实宿主证据。未来方向保持未验证，不计入当前贡献。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查固定提交的作者材料、包清单、关键源码和完整组件 inventory；未运行插件、测试、安装、外部服务或真实宿主任务。
- 下一步：用假AWiki服务和两个租户注入50条消息、断网/重启/模型失败，记录错租户操作、重复发送、重复工具副作用和水位丢失；任一跨租户或未知效果自动重放即停止。

**分析版本**

- **仓库**：[AgentConnect/dsh-awiki](https://github.com/AgentConnect/dsh-awiki)
- **版本号**：0.3.18（[固定提交 60db12b](https://github.com/AgentConnect/dsh-awiki/tree/60db12b72181668b8ea1a270bddb279bb0f50ed7)）
- **版本日期**：2026-10-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未来可探索：可将入站消息ID、身份、租户和每个副作用阶段绑定到执行日志，对未知效果禁止自动重放。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

用假AWiki服务和两个租户注入50条消息、断网/重启/模型失败，记录错租户操作、重复发送、重复工具副作用和水位丢失；任一跨租户或未知效果自动重放即停止。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 31 | 3753 | — | — | 54860 |
| .js | source | 99 | 70466 | 67949 | 2945 | — |
| .mjs | source | 21 | 3045 | 2903 | 55 | — |
| .tsx | source | 22 | 6863 | 6423 | 72 | — |
| .ts | source | 73 | 20845 | 18413 | 1061 | — |
| .tsx | test | 20 | 6368 | 5817 | 54 | — |
| .ts | test | 102 | 21558 | 19925 | 361 | — |
| .mjs | test | 3 | 231 | 223 | 3 | — |
| .ts | example | 10 | 2536 | 2385 | 33 | — |
| .md | test | 1 | 7 | — | — | 266 |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AgentConnect/dsh-awiki/issues?q=is%3Aissue+created%3A2026-09-22T15%3A12%3A48.159Z..2026-10-22T15%3A12%3A48.159Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AgentConnect/dsh-awiki/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T15%3A12%3A48.159Z..2026-10-22T15%3A12%3A48.159Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确认 @awiki/dsh-plugin 在固定版本中实际实现了什么、相对基线的贡献与关键限制，并给出有证据边界的采用和未来验证结论。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目标用户、反复任务、原有办法与合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

目标用户是已经使用 AWiki 身份与通信、希望在 DSH 中处理消息的用户。反复任务是把 AWiki 身份、私信、群聊、邮件、摘要与可选入站 Agent 监听接到 DSH 工具和 Web 界面。原有办法为在独立 AWiki 客户端收发消息，再人工复制给模型并把生成结果复制回去。合格结果必须达到“操作绑定正确身份和租户，发送对象与内容经授权，收发结果和未知状态可追踪”，不能以安装成功、工具注册或一次演示替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/AgentConnect/dsh-awiki/blob/60db12b72181668b8ea1a270bddb279bb0f50ed7/README.md#L1-L19)

作者材料限定目标任务和操作入口；研究回答另加合格交付标准。

<details>
<summary>查看原文（19行）</summary>

```text
# @awiki/dsh-plugin

AWiki account, authorization, recovery, and messaging for
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). The package installs one Host
service, its IM Core provider, the model tools, and a Web client with a draggable AWiki Me launcher.
General DID documents and private keys are managed by the independent
`@agent-network-protocol/dsh-anp-identity` plugin and injected through Cordis.

[中文说明](./README.zh.md)

Identity-entry failures preserve the currently mounted form and local pending identity material. The
phone and OTP never enter browser persistence, controller snapshots, or public
Remote results. Closed registration, unavailable verification state, and commit conflicts each give
a safe next action without exposing remote response details. The exact Node error
`short_handle_invite_required` returns registration to the editable identity form and shows the fixed
invitation notice; neither Handle length nor remote error text selects that UI.

The two plugins deliberately own different state. ANP Identity owns the multi-DID Store, DID
documents, private keys, and publication transactions. AWiki IM Core owns Handle/account bindings,
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、调用链、数据和状态如何实现核心能力？

**研究主题**：功能与机制

#### 完整回答

lib/index.js 中的固定片段显示关键入口、注册或生命周期接线，包清单限定加载组件。实际链路围绕“加载identity和Core，再选择/恢复明确租户身份｜DID、账户和私有目录一致；读取消息；发送前复核对象/内容/租户｜回执绑定消息ID，未知效果不盲重发；可选listener仅在白名单与故障演练后启用｜turn失败不提交水位，已发生工具效果有独立阶段记录”推进，状态发生在插件配置、宿主服务或外部目标中。静态路径只能证明机制存在，不能证明注册后所有分支可运行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1301-1318](https://github.com/AgentConnect/dsh-awiki/blob/60db12b72181668b8ea1a270bddb279bb0f50ed7/lib/index.js#L1301-L1318)

关键源码片段支持入口、注册或生命周期接线。

<details>
<summary>查看原文（18行）</summary>

```text
* @param service - shared deployment AWiki service invoked by each tool.
*/
function registerAwikiTools(ctx, service) {
	ctx.on("tools/pre-execute", (exec, next) => {
		if (exec.name === "awiki_send_message") return Promise.resolve({
			kind: "ask",
			reason: "Send a text message through the deployment AWiki identity"
		});
		if (exec.name === "awiki_send_attachment") return Promise.resolve({
			kind: "ask",
			reason: "Send an attachment through the deployment AWiki identity"
		});
		if (exec.name === "awiki_mail_mark_read") return Promise.resolve({
			kind: "ask",
			reason: "Mark the explicitly selected AWiki mail messages as read"
		});
		if (exec.name === "awiki_mail_send") return Promise.resolve({
			kind: "ask",
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/AgentConnect/dsh-awiki/blob/60db12b72181668b8ea1a270bddb279bb0f50ed7/package.json#L1-L26)

包清单绑定版本、入口和宿主声明。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "@awiki/dsh-plugin",
  "version": "0.3.18",
  "description": "AWiki identity and messaging plugin for DeepSeek Harness",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./provider": {
      "types": "./lib/types/provider.d.ts",
      "default": "./lib/provider.js"
    },
    "./provider-api": {
      "types": "./lib/types/provider-api.d.ts",
      "default": "./lib/types/provider-api.js"
    },
    "./model-proxy-contract": {
      "types": "./lib/types/model-proxy-contract.d.ts",
      "default": "./lib/types/model-proxy-contract.js"
    },
    "./summary-provider": {
      "types": "./lib/types/summary-provider.d.ts",
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？

**研究主题**：贡献与相对优势

#### 完整回答

研究者识别的增量是整合独立身份和 IM Core、Host 公共 DTO、通信工具与界面，并增加会话/租户范围控制。参照是“在独立 AWiki 客户端收发消息，再人工复制给模型并把生成结果复制回去”。贡献归属于本插件的集成、状态编排或工作流封装，不把外部服务、上游算法或子组件能力重复算作原创，也不从功能数量推断用户收益。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1301-1318](https://github.com/AgentConnect/dsh-awiki/blob/60db12b72181668b8ea1a270bddb279bb0f50ed7/lib/index.js#L1301-L1318)

源码证明本插件承担接线或编排，而非仅有文字描述。

<details>
<summary>查看原文（18行）</summary>

```text
* @param service - shared deployment AWiki service invoked by each tool.
*/
function registerAwikiTools(ctx, service) {
	ctx.on("tools/pre-execute", (exec, next) => {
		if (exec.name === "awiki_send_message") return Promise.resolve({
			kind: "ask",
			reason: "Send a text message through the deployment AWiki identity"
		});
		if (exec.name === "awiki_send_attachment") return Promise.resolve({
			kind: "ask",
			reason: "Send an attachment through the deployment AWiki identity"
		});
		if (exec.name === "awiki_mail_mark_read") return Promise.resolve({
			kind: "ask",
			reason: "Mark the explicitly selected AWiki mail messages as read"
		});
		if (exec.name === "awiki_mail_send") return Promise.resolve({
			kind: "ask",
```

</details>

**依据 2 · 作者声明**：[README.md:1-19](https://github.com/AgentConnect/dsh-awiki/blob/60db12b72181668b8ea1a270bddb279bb0f50ed7/README.md#L1-L19)

README 提供作者主张，用于与源码可见机制分开比较。

<details>
<summary>查看原文（19行）</summary>

```text
# @awiki/dsh-plugin

AWiki account, authorization, recovery, and messaging for
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). The package installs one Host
service, its IM Core provider, the model tools, and a Web client with a draggable AWiki Me launcher.
General DID documents and private keys are managed by the independent
`@agent-network-protocol/dsh-anp-identity` plugin and injected through Cordis.

[中文说明](./README.zh.md)

Identity-entry failures preserve the currently mounted form and local pending identity material. The
phone and OTP never enter browser persistence, controller snapshots, or public
Remote results. Closed registration, unavailable verification state, and commit conflicts each give
a safe next action without exposing remote response details. The exact Node error
`short_handle_invite_required` returns registration to the editable identity form and shows the fixed
invitation notice; neither Handle length nor remote error text selects that UI.

The two plugins deliberately own different state. ANP Identity owns the multi-DID Store, DID
documents, private keys, and publication transactions. AWiki IM Core owns Handle/account bindings,
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？

**研究主题**：缺陷与关键质疑

#### 完整回答

最有力支持是固定源码确有相应接线；最关键反例或其他解释是可选入站监听会把外部消息触发 Agent；效果发生后再失败可能导致重放，且底层密钥、网络和租户服务不由本插件证明。若失败后不能判断副作用是否已发生，局部自动化可能把恢复负担转移给用户。该问题不直接否定插件，但会把适用范围收窄到可隔离、可回读的任务。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1301-1318](https://github.com/AgentConnect/dsh-awiki/blob/60db12b72181668b8ea1a270bddb279bb0f50ed7/lib/index.js#L1301-L1318)

源码显示关键状态边界，也说明为什么需要运行时故障验证。

<details>
<summary>查看原文（18行）</summary>

```text
* @param service - shared deployment AWiki service invoked by each tool.
*/
function registerAwikiTools(ctx, service) {
	ctx.on("tools/pre-execute", (exec, next) => {
		if (exec.name === "awiki_send_message") return Promise.resolve({
			kind: "ask",
			reason: "Send a text message through the deployment AWiki identity"
		});
		if (exec.name === "awiki_send_attachment") return Promise.resolve({
			kind: "ask",
			reason: "Send an attachment through the deployment AWiki identity"
		});
		if (exec.name === "awiki_mail_mark_read") return Promise.resolve({
			kind: "ask",
			reason: "Mark the explicitly selected AWiki mail messages as read"
		});
		if (exec.name === "awiki_mail_send") return Promise.resolve({
			kind: "ask",
```

</details>

#### 缺口

- 缺少针对“可选入站监听会把外部消息触发 Agent；效果发生后再失败可能导致重放，且底层密钥、网络和租户服务不由本插件证明”的固定版本故障注入记录
  **影响**：无法确认核心贡献在异常路径仍成立
  **进一步探讨**：用假AWiki服务和两个租户注入50条消息、断网/重启/模型失败，记录错租户操作、重复发送、重复工具副作用和水位丢失；任一跨租户或未知效果自动重放即停止。 本题重点观察异常是否改变贡献结论。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？

**研究主题**：依赖、兼容与流程

#### 完整回答

关键依赖分别是：ANP Identity 与 IM Core Node原生依赖｜必需｜身份密钥、账户绑定和消息存储｜native/版本不匹配时停止主插件；AWiki租户服务、网络与Host私有stateRoot｜通信必需｜收发消息/邮件并隔离租户｜网络未知保留效果未知；默认模型与exact allowlist｜摘要/入站Agent必需｜总结与受限自动回复｜默认关闭监听，未授权来源不触发。启动者负责版本与权限，使用者负责输入和验收，维护者负责外部服务/API 漂移。失败恢复按“可选listener仅在白名单与故障演练后启用｜turn失败不提交水位，已发生工具效果有独立阶段记录”执行；包依赖存在或工具可注册都不表示业务已经办结。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-26](https://github.com/AgentConnect/dsh-awiki/blob/60db12b72181668b8ea1a270bddb279bb0f50ed7/package.json#L1-L26)

包清单提供运行时、依赖和分发边界。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "@awiki/dsh-plugin",
  "version": "0.3.18",
  "description": "AWiki identity and messaging plugin for DeepSeek Harness",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./provider": {
      "types": "./lib/types/provider.d.ts",
      "default": "./lib/provider.js"
    },
    "./provider-api": {
      "types": "./lib/types/provider-api.d.ts",
      "default": "./lib/types/provider-api.js"
    },
    "./model-proxy-contract": {
      "types": "./lib/types/model-proxy-contract.d.ts",
      "default": "./lib/types/model-proxy-contract.js"
    },
    "./summary-provider": {
      "types": "./lib/types/summary-provider.d.ts",
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1301-1318](https://github.com/AgentConnect/dsh-awiki/blob/60db12b72181668b8ea1a270bddb279bb0f50ed7/lib/index.js#L1301-L1318)

源码提供实际宿主接线，用于区分声明依赖与调用依赖。

<details>
<summary>查看原文（18行）</summary>

```text
* @param service - shared deployment AWiki service invoked by each tool.
*/
function registerAwikiTools(ctx, service) {
	ctx.on("tools/pre-execute", (exec, next) => {
		if (exec.name === "awiki_send_message") return Promise.resolve({
			kind: "ask",
			reason: "Send a text message through the deployment AWiki identity"
		});
		if (exec.name === "awiki_send_attachment") return Promise.resolve({
			kind: "ask",
			reason: "Send an attachment through the deployment AWiki identity"
		});
		if (exec.name === "awiki_mail_mark_read") return Promise.resolve({
			kind: "ask",
			reason: "Mark the explicitly selected AWiki mail messages as read"
		});
		if (exec.name === "awiki_mail_send") return Promise.resolve({
			kind: "ask",
```

</details>

#### 缺口

- 真实宿主中的依赖失效顺序与部分成功状态未观测
  **影响**：无法确认重试是否会重复副作用
  **进一步探讨**：用假AWiki服务和两个租户注入50条消息、断网/重启/模型失败，记录错租户操作、重复发送、重复工具副作用和水位丢失；任一跨租户或未知效果自动重放即停止。 另逐项切断依赖并回读部分成功状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？

**研究主题**：效果与总成本

#### 完整回答

成本必须以“操作绑定正确身份和租户，发送对象与内容经授权，收发结果和未知状态可追踪”为合格单位。三阶段投入为：首次使用｜AWiki服务/网络、native存储和可选模型｜注册/恢复身份、配置租户和发送审批｜设备恢复与安全审阅小时未知；持续使用｜消息流量、摘要/Agent模型调用与缓存｜复核发送、维护allowlist和处理设备状态｜每百条消息费用与人工分钟未知；失败恢复｜重复模型调用/消息发送风险｜按incoming/message ID查Core与水位后重试｜Agent工具效果可能已发生但回复未提交。当前源码只支持机制存在，效果维度为“统一通信入口｜工具与Web界面整合身份、消息和邮件｜跨设备/租户真实可用性；会话/租户fence｜源码有tools/pre-execute等范围控制｜所有工具与listener路径是否同样覆盖；入站Agent｜允许白名单消息触发处理｜副作用幂等、恶意内容与失败重放”。没有合格数、总尝试、人工分钟与现金/资源量，因此不能计算单位成本、节时或ROI。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/AgentConnect/dsh-awiki/blob/60db12b72181668b8ea1a270bddb279bb0f50ed7/README.md#L1-L19)

作者材料支持操作范围，不提供同条件成本或合格率。

<details>
<summary>查看原文（19行）</summary>

```text
# @awiki/dsh-plugin

AWiki account, authorization, recovery, and messaging for
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). The package installs one Host
service, its IM Core provider, the model tools, and a Web client with a draggable AWiki Me launcher.
General DID documents and private keys are managed by the independent
`@agent-network-protocol/dsh-anp-identity` plugin and injected through Cordis.

[中文说明](./README.zh.md)

Identity-entry failures preserve the currently mounted form and local pending identity material. The
phone and OTP never enter browser persistence, controller snapshots, or public
Remote results. Closed registration, unavailable verification state, and commit conflicts each give
a safe next action without exposing remote response details. The exact Node error
`short_handle_invite_required` returns registration to the editable identity form and shows the fixed
invitation notice; neither Handle length nor remote error text selects that UI.

The two plugins deliberately own different state. ANP Identity owns the multi-DID Store, DID
documents, private keys, and publication transactions. AWiki IM Core owns Handle/account bindings,
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/AgentConnect/dsh-awiki/blob/60db12b72181668b8ea1a270bddb279bb0f50ed7/package.json#L1-L26)

包清单支持本地/外部资源与依赖边界的定性判断。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "@awiki/dsh-plugin",
  "version": "0.3.18",
  "description": "AWiki identity and messaging plugin for DeepSeek Harness",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./provider": {
      "types": "./lib/types/provider.d.ts",
      "default": "./lib/provider.js"
    },
    "./provider-api": {
      "types": "./lib/types/provider-api.d.ts",
      "default": "./lib/types/provider-api.js"
    },
    "./model-proxy-contract": {
      "types": "./lib/types/model-proxy-contract.d.ts",
      "default": "./lib/types/model-proxy-contract.js"
    },
    "./summary-provider": {
      "types": "./lib/types/summary-provider.d.ts",
```

</details>

#### 缺口

- 缺少按合格任务统计的总尝试、失败、人工分钟与现金/资源量
  **影响**：无法比较总成本与净收益
  **进一步探讨**：用假AWiki服务和两个租户注入50条消息、断网/重启/模型失败，记录错租户操作、重复发送、重复工具副作用和水位丢失；任一跨租户或未知效果自动重放即停止。 同时按合格交付数汇总总尝试、人工分钟和资源量。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？

**研究主题**：工程质量与复用

#### 完整回答

固定源码把核心职责落在 lib/index.js 及相邻模块，入口可追踪；inventory 仅作规模和静态候选索引。可复用的是“整合独立身份和 IM Core、Host 公共 DTO、通信工具与界面，并增加会话/租户范围控制”的显式接线方式。移植必须重做宿主API、权限、状态持久化和“可选listener仅在白名单与故障演练后启用｜turn失败不提交水位，已发生工具效果有独立阶段记录”验证，不能从测试脚本存在推断当前环境可靠。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1301-1318](https://github.com/AgentConnect/dsh-awiki/blob/60db12b72181668b8ea1a270bddb279bb0f50ed7/lib/index.js#L1301-L1318)

固定源码用于评价职责和宿主耦合。

<details>
<summary>查看原文（18行）</summary>

```text
* @param service - shared deployment AWiki service invoked by each tool.
*/
function registerAwikiTools(ctx, service) {
	ctx.on("tools/pre-execute", (exec, next) => {
		if (exec.name === "awiki_send_message") return Promise.resolve({
			kind: "ask",
			reason: "Send a text message through the deployment AWiki identity"
		});
		if (exec.name === "awiki_send_attachment") return Promise.resolve({
			kind: "ask",
			reason: "Send an attachment through the deployment AWiki identity"
		});
		if (exec.name === "awiki_mail_mark_read") return Promise.resolve({
			kind: "ask",
			reason: "Mark the explicitly selected AWiki mail messages as read"
		});
		if (exec.name === "awiki_mail_send") return Promise.resolve({
			kind: "ask",
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/AgentConnect/dsh-awiki/blob/60db12b72181668b8ea1a270bddb279bb0f50ed7/package.json#L1-L26)

包清单用于确认版本、分发与依赖面。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "@awiki/dsh-plugin",
  "version": "0.3.18",
  "description": "AWiki identity and messaging plugin for DeepSeek Harness",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./provider": {
      "types": "./lib/types/provider.d.ts",
      "default": "./lib/provider.js"
    },
    "./provider-api": {
      "types": "./lib/types/provider-api.d.ts",
      "default": "./lib/types/provider-api.js"
    },
    "./model-proxy-contract": {
      "types": "./lib/types/model-proxy-contract.d.ts",
      "default": "./lib/types/model-proxy-contract.js"
    },
    "./summary-provider": {
      "types": "./lib/types/summary-provider.d.ts",
```

</details>

#### 缺口

- 未执行仓库测试、安装和真实宿主压力/升级验证
  **影响**：维护性和异常恢复只能作源码级判断
  **进一步探讨**：用假AWiki服务和两个租户注入50条消息、断网/重启/模型失败，记录错租户操作、重复发送、重复工具副作用和水位丢失；任一跨租户或未知效果自动重放即停止。 在此之外记录构建、卸载和宿主升级后的回归面积。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？

**研究主题**：新假设与验证

#### 完整回答

由“整合独立身份和 IM Core、Host 公共 DTO、通信工具与界面，并增加会话/租户范围控制”和“可选入站监听会把外部消息触发 Agent；效果发生后再失败可能导致重放，且底层密钥、网络和租户服务不由本插件证明”推导的新方向是可将入站消息ID、身份、租户和每个副作用阶段绑定到执行日志，对未知效果禁止自动重放。它不是当前能力。最小验证为用假AWiki服务和两个租户注入50条消息、断网/重启/模型失败，记录错租户操作、重复发送、重复工具副作用和水位丢失；任一跨租户或未知效果自动重放即停止。 若合格结果不改善、误差/副作用越界或恢复负担高于“在独立 AWiki 客户端收发消息，再人工复制给模型并把生成结果复制回去”，即削弱或推翻假设。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1301-1318](https://github.com/AgentConnect/dsh-awiki/blob/60db12b72181668b8ea1a270bddb279bb0f50ed7/lib/index.js#L1301-L1318)

假设只以已实现机制和边界为推导起点，不表示源码已经实现新方向。

<details>
<summary>查看原文（18行）</summary>

```text
* @param service - shared deployment AWiki service invoked by each tool.
*/
function registerAwikiTools(ctx, service) {
	ctx.on("tools/pre-execute", (exec, next) => {
		if (exec.name === "awiki_send_message") return Promise.resolve({
			kind: "ask",
			reason: "Send a text message through the deployment AWiki identity"
		});
		if (exec.name === "awiki_send_attachment") return Promise.resolve({
			kind: "ask",
			reason: "Send an attachment through the deployment AWiki identity"
		});
		if (exec.name === "awiki_mail_mark_read") return Promise.resolve({
			kind: "ask",
			reason: "Mark the explicitly selected AWiki mail messages as read"
		});
		if (exec.name === "awiki_mail_send") return Promise.resolve({
			kind: "ask",
```

</details>

#### 缺口

- 假设尚无实现、需求频率或效果数据
  **影响**：不能计入插件贡献、创新效果或商业机会
  **进一步探讨**：用假AWiki服务和两个租户注入50条消息、断网/重启/模型失败，记录错租户操作、重复发送、重复工具副作用和水位丢失；任一跨租户或未知效果自动重放即停止。 只验证最小原型，不改变当前能力状态。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得观察或试用，成功与停止标准是什么？

**研究主题**：采用判断

#### 完整回答

当前结论为小范围试用。已有AWiki需求者可在关闭入站监听的前提下试用收发工具，先固定身份、审批和失败重放边界。 试用成功标准是“操作绑定正确身份和租户，发送对象与内容经授权，收发结果和未知状态可追踪”，并且 跨设备/租户真实可用性、所有工具与listener路径是否同样覆盖、副作用幂等、恶意内容与失败重放 有可接受结果；停止标准包括发生可选入站监听会把外部消息触发 Agent；效果发生后再失败可能导致重放，且底层密钥、网络和租户服务不由本插件证明所述核心风险、出现未知副作用自动重试，或总人工/资源成本高于“在独立 AWiki 客户端收发消息，再人工复制给模型并把生成结果复制回去”。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/AgentConnect/dsh-awiki/blob/60db12b72181668b8ea1a270bddb279bb0f50ed7/README.md#L1-L19)

作者材料限定可操作范围；采用结论由研究者结合限制给出。

<details>
<summary>查看原文（19行）</summary>

```text
# @awiki/dsh-plugin

AWiki account, authorization, recovery, and messaging for
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). The package installs one Host
service, its IM Core provider, the model tools, and a Web client with a draggable AWiki Me launcher.
General DID documents and private keys are managed by the independent
`@agent-network-protocol/dsh-anp-identity` plugin and injected through Cordis.

[中文说明](./README.zh.md)

Identity-entry failures preserve the currently mounted form and local pending identity material. The
phone and OTP never enter browser persistence, controller snapshots, or public
Remote results. Closed registration, unavailable verification state, and commit conflicts each give
a safe next action without exposing remote response details. The exact Node error
`short_handle_invite_required` returns registration to the editable identity form and shows the fixed
invitation notice; neither Handle length nor remote error text selects that UI.

The two plugins deliberately own different state. ANP Identity owns the multi-DID Store, DID
documents, private keys, and publication transactions. AWiki IM Core owns Handle/account bindings,
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1301-1318](https://github.com/AgentConnect/dsh-awiki/blob/60db12b72181668b8ea1a270bddb279bb0f50ed7/lib/index.js#L1301-L1318)

源码证据只支撑窄范围试用/观察，不构成安装验收。

<details>
<summary>查看原文（18行）</summary>

```text
* @param service - shared deployment AWiki service invoked by each tool.
*/
function registerAwikiTools(ctx, service) {
	ctx.on("tools/pre-execute", (exec, next) => {
		if (exec.name === "awiki_send_message") return Promise.resolve({
			kind: "ask",
			reason: "Send a text message through the deployment AWiki identity"
		});
		if (exec.name === "awiki_send_attachment") return Promise.resolve({
			kind: "ask",
			reason: "Send an attachment through the deployment AWiki identity"
		});
		if (exec.name === "awiki_mail_mark_read") return Promise.resolve({
			kind: "ask",
			reason: "Mark the explicitly selected AWiki mail messages as read"
		});
		if (exec.name === "awiki_mail_send") return Promise.resolve({
			kind: "ask",
```

</details>

#### 缺口

- 未有真实用户频率、迁移意愿与固定版本宿主验收
  **影响**：不能升级为持续安装或生产采用
  **进一步探讨**：用假AWiki服务和两个租户注入50条消息、断网/重启/模型失败，记录错租户操作、重复发送、重复工具副作用和水位丢失；任一跨租户或未知效果自动重放即停止。 试用结束还需访谈目标用户的重复频率与退出意愿。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
