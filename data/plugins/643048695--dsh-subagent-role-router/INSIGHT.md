# dsh-subagent-role-router

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[2c30dfe](https://github.com/643048695/dsh-subagent-role-router/tree/2c30dfed05224635b618c00fe41b19e2b5f139cb)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/643048695/dsh-subagent-role-router)
<!-- END META -->

> **功能**：为 DSH 子代理按角色分配候补模型，支持请求失败切换、fork 历史窗口和运行中换模。

> **亮点**：它把角色启发式、候补占用、请求级切换和人工下次请求覆盖连接到 DSH 子代理派发层，减少分散维护路由约定的入口；可追溯机制见[Q01](#research-q01)、[Q02](#research-q02)和[Q04](#research-q04)，节费效果尚无对照。

> **主要限制**：出生时的角色与豁免并不等于完整运行期路由契约。单角色候补可能回全局失败池，preset/cwd 豁免运行中仅按标签复核，白名单写回又会留下持久配置；这些源码边界使严格隔离场景不宜直接采用，实际影响尚未复现。见[Q02](#research-q02)至[Q04](#research-q04)。

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
  - [Q01 · 谁需要角色路由，相对逐次指定模型具体增加什么？](#detail-section-11)
  - [Q02 · 派发、候补池与失败切换如何连接，是否提供并发硬上限？](#detail-section-12)
  - [Q03 · fork 切片和豁免能保留什么，会丢失什么？](#detail-section-13)
  - [Q04 · 安装、白名单同步和运行中切换依赖什么，退出会留下什么？](#detail-section-14)
  - [Q05 · 效果与全周期成本有多少依据，怎样做有限试用？](#detail-section-15)
  - [Q06 · 哪些设计可借鉴，可推导什么可证伪的新假设？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有多模型额度、反复委派探索与修补任务的 DSH 操作者，可集中配置角色路由；合格结果仍须逐项核对模型与交付。见[Q01](#research-q01)。

基线是逐次显式指定 provider/model 或继承父会话。作者明确承认默认注入、基础分配、故障转移与可见性继承自上游，本次未独立核查上游版本；不把这些全部算原创。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 角色与候补路由 | 为探索、规划、修补选择模型 | 正则分类；显式派发路由优先；不是工具权限控制 |
| 忙闲与冷却选择 | 优先较空闲且未冷却的路由 | 软分摊；全冷却仍派发；没有硬并发上限 |
| 请求失败切换 | 在允许错误类别下换候补 | 有次数限制；单角色候补可回全局池 |
| fork 完成轮窗口 | 缩减可表示的分叉种子 | 保留最近完成轮及可用摘要，不能保证早期语义完整 |
| 子代理运行中换模 | 从下一请求起覆盖模型和推理强度 | 需 Web 界面及本机后端；状态只在内存 |
| 出生豁免 | 按名称、预设或目录跳过出生路由 | 运行期仅按标签复核；非完整生命周期豁免 |
| 原生白名单镜像 | 将配置的模型写入宿主允许列表 | 会替换持久配置；退出需人工核对还原 |
| 短模型名修复 | 唯一匹配时补足配置中的完整模型 ID | 多匹配时不改，不保证供应商可用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node >=20、包声明的 DSH settings/subagent/llm 版本 | 启动必需 | 加载 Cordis 插件和请求事件 | 声明不等于运行通过，先核对目标宿主 |
| provider/model、密钥、额度与兼容推理强度 | 路由执行必需 | 实际完成模型请求 | 回继承或请求报错，配置错误也可能自动换候补 |
| Web client 插槽、设置服务与本机 webServer | 界面操作必需 | 设置卡、实时选模和白名单写回 | 后端路由与界面能力分别受限 |
| 宿主 fork driver 和可映射事件 | 部分切片路径必需 | 产生窗口 seed | 回退原历史，不保证缩减 |
| 白名单备份及权限约定 | 安全采用条件 | 核对持久配置影响 | 卸载后需人工恢复原名单 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 操作者保存 profile 和白名单，核对版本及模型路由 | 能说明每条候补权限、费用与用途 |
| 加载 | 宿主加载 bundle、服务包装和 Web 客户端 | 设置与子代理控件出现；实际加载本轮未验证 |
| 派发 | 操作者先给明确角色标签，插件选择路由 | 核对实际模型，混合任务改用显式指定 |
| 恢复 | 插件按错误类别有限切换，操作者检查告警 | 候补耗尽不掩盖原错；发生越界即停用 |
| 退出 | 操作者停用并核对原生白名单 | 包装及内存清理之外另恢复持久名单 |

**效果与成本**

多模型配置、请求重试、故障排查和白名单恢复均由操作者承担，金额与耗时未知；首次、持续、恢复及退出的完整成本表见[Q05](#research-q05)。

已检查路由、有限切换及下一请求覆盖的机制，但没有同任务节费或交付提升证据；效果与不能确定之处见[Q05](#research-q05)。

> **思考**：出生时的角色与豁免并不等于完整运行期路由契约。单角色候补可能回全局失败池，preset/cwd 豁免运行中仅按标签复核，白名单写回又会留下持久配置；这些源码边界使严格隔离场景不宜直接采用，实际影响尚未复现。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它把角色启发式、候补占用、请求级切换和人工下次请求覆盖连接到 DSH 子代理派发层，减少分散维护路由约定的入口；可追溯机制见[Q01](#research-q01)、[Q02](#research-q02)和[Q04](#research-q04)，节费效果尚无对照。

租约结算、自己持有的包装才撤销、下次请求人工覆盖与自动切换分层值得借鉴；宿主事件与私有 fork driver 带来适配负担。持久白名单恢复与豁免跨阶段一致性不完整，不能用监听器清理推断卸载完全无残留。见[Q04](#research-q04)、[Q06](#research-q06)。

<a id="detail-section-5"></a>

### 1.4 主要限制

出生时的角色与豁免并不等于完整运行期路由契约。单角色候补可能回全局失败池，preset/cwd 豁免运行中仅按标签复核，白名单写回又会留下持久配置；这些源码边界使严格隔离场景不宜直接采用，实际影响尚未复现。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察。确有多模型委派需求者，后续可在独立 profile 备份白名单，关闭切片和自动失败切换检查明确标签及人工覆盖，再逐项验证边界；出现越界、约束遗漏或额外费用不可接受时停用并恢复白名单，退回逐次显式指定。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

角色分配、软负载选择和下一请求覆盖有固定源码依据；运行期豁免、配置恢复与效果仍有边界。设计假设未实现、未验证，采用结论为观察。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、lib/fork-window.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交的包入口、Cordis patch、服务包装、候补与失败路径、窗口模块及 Web 轮询被定向阅读；没有对 4375 行客户端和所有测试做完整审计。
- 下一步：后续先在隔离 profile 比较单角色池加全局池、preset/cwd 豁免、显式模型、fork、全冷却与卸载恢复；再用同任务同预算对比合格率、总请求与纠错时间。出现越界或早期约束遗漏即停止，不以 token 减少替代质量。

**分析版本**

- **仓库**：[643048695/dsh-subagent-role-router](https://github.com/643048695/dsh-subagent-role-router)
- **版本号**：4.1.0（[固定提交 2c30dfe](https://github.com/643048695/dsh-subagent-role-router/tree/2c30dfed05224635b618c00fe41b19e2b5f139cb)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是保存一次派发的允许路由、豁免来源与预算契约，让出生、fork、失败切换统一读取，可能减少跨阶段越界；以有限用例矩阵比较越界数、合格率和配置负担，若显式路由已足够或复杂度增加却无改善则放弃。推导与否定条件见[Q06](#research-q06)。

后续先在隔离 profile 比较单角色池加全局池、preset/cwd 豁免、显式模型、fork、全冷却与卸载恢复；再用同任务同预算对比合格率、总请求与纠错时间。出现越界或早期约束遗漏即停止，不以 token 减少替代质量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 1414 | — | — | 35110 |
| .js | source | 3 | 6758 | 4761 | 1749 | — |
| .mjs | test | 9 | 3021 | 2418 | 306 | — |
| .mjs | source | 1 | 110 | 60 | 38 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/643048695/dsh-subagent-role-router/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/643048695/dsh-subagent-role-router/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/643048695/dsh-subagent-role-router/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：角色路由能否让多模型 DSH 委派更可控，其候补、豁免和持久配置边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要角色路由，相对逐次指定模型具体增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向已经在 DSH 中反复委派探索、规划与代码修补任务，并拥有多条可用模型路由的操作者。合格结果首先是把任务送到事先选定的模型，同时保留人工显式选择；模型便宜或强弱是否适配任务还要另行判断。作者用探索与修补的差异解释需求，但没有在本次材料中给出真实用户的任务频率、成本对照或失败率。因此“减少每次指定路由的操作”有实现依据，“更省钱且交付更好”仍是效果假设。

简单基线是每次派发显式填写 provider/model，或者全部继承父会话。routeDelegation 在显式提供 model 或 provider 时直接保留请求；否则判定角色并选择角色池，缺省再落全局模型配置。detectRole 使用标签和提示文本正则，依序检查探索、规划、修补，未分类默认修补。它没有调用分类模型，也不核实任务实际是否只读；“审查并修改代码”这类混合措辞可能先命中探索，标签需要由操作者校准。角色是路由标签，不能视为工具权限隔离。

具体增量是把路由约定集中在派发服务，配合候补占用、运行期失败处理、子代理界面换模与 fork 种子切片。README 明确将默认注入、多模型分配、故障转移和可见性归于上游原作；这些不能全部计作本项目原创。本次检查能确认新增机制在当前实现中存在，未独立对照上游固定源码，因此对“相对原作新增”的归属仅按作者署名说明保留。对只有一个模型或很少派发子代理的人，集中配置可能比逐次显式指定更费事。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-13](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/README.md#L5-L13)

作者说明目标和上游归属，不能证明真实收益。

```text
为 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 的子代理（subagent）派发选择路由：**按角色分流**、**每个角色可配多个候补并按忙闲顺延**、多模型轮换、跨供应商故障转移，并为 fork 类派发做**活跃窗口切片**。

当创建子代理时未显式指定 `model` 时，本插件按配置注入路由 —— 因此所有 `subagent`、`subagent_fork` 以及任何省略 `agentOptions` 的工具调用都会经过它。显式传参的覆盖始终生效；配置缺失或不完整时保持原有行为（子代理继承父会话路由）。

> ### 来源与署名
>
> 本项目基于 [**dingminhua/dsh-subagent-default-model**](https://github.com/dingminhua/dsh-subagent-default-model)（MIT，Copyright (c) 2026 **LaoDing**）二次开发。
>
> 原作提供了本项目的基础能力：默认模型注入、多模型分配策略、跨供应商故障转移、路由可见性。本项目在其之上新增了**按角色路由**、**角色候补池（忙闲顺延 / 溢出并发 / 失败冷却）**、**fork 活跃窗口切片**、**agent-teams 豁免**四项能力。原作的版权与许可声明完整保留在 [LICENSE](LICENSE) 中。
```

**依据 2 · 源码核查**：[lib/index.js:370-387](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L370-L387)

顺序正则和默认 patch 支持启发式分类边界。

<details>
<summary>查看原文（18行）</summary>

```text
	const lower = text.toLowerCase();
	if (/\[\s*explore\s*\]|^explore\b|role\s*:\s*explore|【探索】|探索[:：]/.test(lower) || /\[\s*scout\s*\]|^scout\b/.test(lower)) return "explore";
	if (/\[\s*plan\s*\]|^plan\b|role\s*:\s*plan|【规划】|规划[:：]/.test(lower) || /\[\s*planner\s*\]|^planner\b/.test(lower)) return "plan";
	if (/\[\s*patch\s*\]|^patch\b|role\s*:\s*patch|【修补】|修补[:：]/.test(lower) || /\[\s*coder\s*\]|^coder\b/.test(lower)) return "patch";

	// BTW ("旁问") is read-only exploration / question answering
	if (label && label.startsWith("michengai-btw:")) return "explore";

	if (/\b(explore|scout|investigate|audit|explain|analyze|review)\b/.test(lower) || /探索|调研|排查|侦察|解释|不理解|怎么回事|分析|审查/.test(text)) return "explore";
	if (/\b(plan|architect|design)\b/.test(lower) || /规划|架构|方案|设计/.test(text)) return "plan";
	if (/\b(patch|implement|fix|refactor|write_code)\b/.test(lower) || /修补|编写|修改代码|实现|落地/.test(text)) return "patch";
	
	// In 3-role mode, all unclassified subagent tasks default to the General-purpose (patch) role!
	return "patch";
}

function getSafeDenyList(parent, desiredDeny) {
	try {
```

</details>

**依据 3 · 源码核查**：[lib/index.js:588-608](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L588-L608)

显式路由保留、角色池与基础池回退的真实分支。

<details>
<summary>查看原文（21行）</summary>

```text
 *   callers that cannot observe settlement — a fork/BTW branch, for example,
 *   hands back no receipt, so reserving a lane there would leak it.
 * @returns {{request: object, lease?: object}} routed request and optional lease.
 */
function routeDelegation(state, request, label, reserve = true) {
	if (!request || teamIdentity(label || request.label, request.persona)) return { request };
	// Token/depth controls alone are not an explicit model selection.
	const explicit = request.agentOptions;
	if (explicit?.model || explicit?.provider) return { request };

	const section = state.getSection?.();
	const role = detectRole(label || request.label, request.prompt);
	const pool = section?.roleMode === true ? resolveRolePool(section, role) : [];
	const picked = pool.length > 0 ? pickPoolEntry(state, pool) : void 0;
	if (picked === void 0) {
		// Base pool / single-model form: unchanged behaviour, no lane involved.
		const route = defaultModel(state);
		if (!route) return { request };
		return { request: { ...request, agentOptions: { ...explicit, ...route } } };
	}
	const lease = reserve ? acquireLane(state, picked.entry, role) : void 0;
```

</details>

#### 缺口

- 缺少目标用户任务频率和同条件收益数据
  **影响**：不能断言配置负担会被实际节省抵消
  **进一步探讨**：以真实重复委派任务对比逐次指定与集中配置，记录纠错和合格结果。
- 未独立固定上游实现作逐行比较
  **影响**：新增归属不能升级为独立证明的原创性
  **进一步探讨**：后续固定上游版本，比较相同派发与恢复入口。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 派发、候补池与失败切换如何连接，是否提供并发硬上限？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

实际入口是 apply 注入 subagents 服务后，包裹 start、startContinuable、startActivation。非团队、未命中出生豁免的请求进入 routeDelegation；显式 provider 或 model 不参与自动选择。角色池先过滤冷却中的路由，再取在途计数最小者，同负载取原始顺序靠前者。计数键为 provider/model，相同路由即使在不同角色池也共用占用。租约在派发抛错、返回 Promise 拒绝或 receipt.result 结束时归还；没有结束信号则立即归还，不谎称仍有精确占用。

池长度不是并发上限。三个候补面对第四个任务仍会选择最小占用路由，不排队、不拒绝；所有候补冷却时发出警告后仍选择一个。因此它提供忙闲分摊与尽力保持派发，不能替代供应商限流器、预算上限或排队系统。fork 的一次性路径特意不占租约，因为拿不到完成回执，故该路径也不提供相同的负载计数保证。

agent/request-error 在子代理来源、非团队、未取消且错误属于允许类别时记冷却，并在候选池间切换；认证错误和明确模型不可用也可能触发，普通 INVALID_REQUEST 不直接遍历所有模型。每个运行记录已尝试候选和切换次数，池耗尽把真实错误交回宿主；重建请求时丢弃旧 reasoningEffort，按目标配置重设。调用重试并不证明已有工具副作用可以安全重复，具体重试范围还依赖宿主请求循环。

重要边界在 failoverView。只有角色池至少有两项才选角色池，否则使用全局 models。因而“单角色候补配置 + 多条全局模型”可能在运行失败时跨入全局池，而不是严格保持角色集合；代码旁注所说“角色内切换”不能概括此分支。出生时显式路由虽然不被注入替换，但运行期失败监听没有“出生显式选择”的统一豁免标记；需要固定模型且不能跨供应商的人应关闭自动失败切换，而不能只依赖派发参数。这里是源码分支推导，未在宿主复现。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:495-516](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L495-L516)

冷却全部耗尽仍派发、最小负载选择。

<details>
<summary>查看原文（22行）</summary>

```text
	const now = Date.now();
	const usable = entries
		.map((entry, index) => ({ entry, index }))
		.filter(({ entry }) => (state.cooldowns.get(routeKey(entry)) ?? 0) <= now);

	let candidates = usable;
	if (candidates.length === 0) {
		// Everything is cooling down. Keep serving, but say so.
		state.onCoolingExhausted?.();
		candidates = entries.map((entry, index) => ({ entry, index }));
	}

	let best = candidates[0];
	for (const candidate of candidates) {
		const load = state.slots.get(routeKey(candidate.entry)) ?? 0;
		const bestLoad = state.slots.get(routeKey(best.entry)) ?? 0;
		if (load < bestLoad || (load === bestLoad && candidate.index < best.index)) best = candidate;
	}
	return best;
}

/**
```

</details>

**依据 2 · 源码核查**：[lib/index.js:535-575](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L535-L575)

租约获取、回执结算和无信号归还。

<details>
<summary>查看原文（41行）</summary>

```text
function acquireLane(state, entry, role) {
	const key = routeKey(entry);
	state.slots.set(key, (state.slots.get(key) ?? 0) + 1);
	let released = false;
	const give = () => {
		if (released) return;
		released = true;
		const left = (state.slots.get(key) ?? 1) - 1;
		if (left > 0) state.slots.set(key, left);
		else state.slots.delete(key);
	};
	return {
		entry,
		/**
		 * Hold the lane until the child settles, then give it back.
		 *
		 * `subagent/end` is emit-only and cannot be awaited from a plugin, so the
		 * receipt's `result` promise is the one settle signal available. A child
		 * that never settles keeps its lane occupied — by design: that lane IS
		 * busy, and the pool then shares work across the remaining lanes instead
		 * of pretending the stuck model is free.
		 *
		 * @param {object} receipt - the value returned by startActivation.
		 */
		bind(receipt) {
			if (receipt?.childId !== void 0) state.roleOfChild.set(receipt.childId, role);
			const result = receipt?.result;
			if (result === void 0 || result === null || typeof result.then !== "function") {
				// No settle signal: give the lane back at once rather than leak it.
				give();
				return;
			}
			Promise.resolve(result).then(give, give);
		},
		/** Give the lane back immediately (dispatch threw before a receipt existed). */
		release() {
			give();
		}
	};
}

```

</details>

**依据 3 · 源码核查**：[lib/index.js:622-653](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L622-L653)

角色池至少两项才优先，否则回全局池。

<details>
<summary>查看原文（32行）</summary>

```text
function failoverView(state, agent) {
	const section = state.getSection?.();
	if (section === void 0 || section === null) return void 0;
	if (section.failoverEnabled === false) return void 0;
	// An exempt plugin child runs on whatever it was born with (or on the route
	// its plugin pinned): switching it mid-run would break exactly the promise
	// the exemption list makes.
	if (agent !== void 0 && isExemptAgent(state, agent)) return void 0;
	// An explicit pick from the Web UI wins over the automatic switch. Silently
	// rerouting a model the user just named is the exact complaint this feature
	// exists to fix, and the cooldown bookkeeping would then blame the candidate
	// the user chose for a failure that belongs to the route being left behind.
	if (agent !== void 0 && state.childRoutes.has(agent.id)) return void 0;
	// A subagent that was placed on a ROLE pool must fail over INSIDE that pool:
	// its lanes are the alternatives the user actually chose for this kind of
	// work. Falling back to the base pool here would silently drag a general-
	// purpose task onto an unrelated model that the role was configured to avoid.
	const role = agent === void 0 ? void 0 : state.roleOfChild.get(agent.id);
	const rolePool = section.roleMode === true && role !== void 0 ? resolveRolePool(section, role) : [];
	const entries = rolePool.length >= 2
		? rolePool
		: (Array.isArray(section.models)
			? section.models.map((entry) => resolveEntry(section, entry)).filter((entry) => entry !== void 0)
			: []);
	// A pool of <2 models has nothing to switch to; keep the parent route.
	if (entries.length < 2) return void 0;
	return { entries, strategy: section.strategy === "random" ? "random" : "round-robin" };
}

/** True only for a SUBAGENT-origin agent (the durable session header marker). */
function teamIdentity(label, persona) {
	return (typeof label === "string" && label.startsWith("agent-teams:"))
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1210-1245](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L1210-L1245)

触发范围、冷却与有限切换。

<details>
<summary>查看原文（36行）</summary>

```text
	const disposeRequestError = ctx.on("agent/request-error", (payload, next) => {
		const { agent, turn, step, failure, signal } = payload;
		if (signal?.aborted) return next();
		if (!isSubagentAgent(agent)) return next();
		if (failure === void 0) return next();
		// Two ways in: the route was unreachable (rate limit, quota, transport…)
		// or the route cannot serve this request at all (model not allowed for
		// this account, unknown model, unsupported effort). The second class is
		// skipped-and-cooled exactly like the first — see CANDIDATE_UNUSABLE_CODES.
		if (!FAILOVER_ELIGIBLE_CODES.includes(failure.code) && !isUnusableCandidate(failure)) return next();
		// An exempt plugin child must not even COOL its route down: its failure
		// says nothing about the model's health for everyone else, and a cooldown
		// recorded here would silently skew the next ordinary delegation.
		if (isExemptAgent(state, agent)) return next();
		// Cool the failing route down BEFORE deciding whether anything can be
		// switched to: a role pool with a single lane cannot fail over at all,
		// yet its model still deserves to be skipped by the NEXT delegation
		// instead of being handed the next task while it is still rate-limited.
		noteCooldown(ctx, state, agent, failure);
		const view = failoverView(state, agent);
		if (view === void 0) return next();
		const current = pending.get(agent.id);
		// The primary already failed (that triggered the first switch), so the
		// remaining candidates are the other pool entries: at most
		// `entries.length - 1` switches, then let the real error surface.
		if (current !== void 0 && current.count >= view.entries.length - 1) return next(); // pool exhausted
		const index = nextFailoverIndex(view, agent, current);
		// Remember every pool entry this run has already been switched to, so a
		// candidate that fails again is not selected a second time.
		const tried = new Set(current?.tried ?? []);
		tried.add(index);
		pending.set(agent.id, {
			index,
			tried,
			count: (current?.count ?? 0) + 1
		});
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1304-1324](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L1304-L1324)

请求改路由和清理。

<details>
<summary>查看原文（21行）</summary>

```text
	const disposeRequest = ctx.on("agent/request", async (payload, next) => {
		const { agent } = payload;
		if (!isSubagentAgent(agent)) return next();
		const current = pending.get(agent.id);
		if (current === void 0) return next();
		const view = failoverView(state, agent);
		if (view === void 0) return next();
		const target = view.entries[current.index];
		if (target === void 0) return next();
		const seed = await next();
		if (seed === void 0 || seed === null) return seed;
		const { reasoningEffort: _inherited, ...rest } = seed;
		const switched = { ...rest, provider: target.provider, model: target.model };
		if (target.reasoningEffort !== void 0) switched.reasoningEffort = target.reasoningEffort;
		return switched;
	});

	// Drop per-agent state once the subagent is disposed.
	const disposeDisposed = ctx.on("agent/disposed", ({ agent }) => {
		pending.delete(agent.id);
	});
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1956-2024](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L1956-L2024)

实际服务包装和租约接线。

<details>
<summary>查看原文（69行）</summary>

```text
		const wrapped = function(...args) {
			const spec = key === "start" ? null : args[0];
			const request = key === "start" ? args[1] : spec?.request;
			const label = spec?.label || request?.label;
			if (request) noteBirthSeen(spec, request);
			// Keep the native "a child may pick a model" gate in step with this
			// page before the child is built: the tool schema only carries
			// provider/model/reasoning_effort while that gate is enabled, and it
			// only accepts routes listed there.
			if (request) syncHostWhitelistSoon(ctx, state);
			const team = teamIdentity(label, request?.persona);
			let lease;
			if (request && !team) {
				// Exempt plugin children: recognized by their BIRTH identity
				// (label / agentPreset / cwd, exact-prefix rules). No lanes, no
				// role pools, no default-model injection — the rule may pin a
				// birth model, and an explicit agentOptions on the spawn still
				// wins over the pin.
				const exempt = exemptRuleForBirth(state, spec, request);
				if (exempt !== void 0) {
					const pinned = exemptBirthModel(exempt);
					if (pinned && !request.agentOptions?.model && !request.agentOptions?.provider) {
						const request0 = { ...request, agentOptions: { ...request.agentOptions, ...pinned } };
						if (key === "start") args[1] = request0;
						else args[0] = { ...spec, request: request0 };
					}
				} else {
					const routed = routeDelegation(state, request, label);
					lease = routed.lease;
					if (key === "start") args[1] = routed.request;
					else args[0] = { ...spec, request: routed.request };
				}
			} else if (request && team) {
				// Agent-teams spawn: no lanes, no failover — only the optional
				// birth model, mirroring how routeDelegation writes agentOptions
				// for plain subagents (an explicit agentOptions still wins).
				const birth = teamBirthModel(state);
				if (birth && !request.agentOptions?.model && !request.agentOptions?.provider) {
					const request0 = { ...request, agentOptions: { ...request.agentOptions, ...birth } };
					if (key === "start") args[1] = request0;
					else args[0] = { ...spec, request: request0 };
				}
			}
			let dispatched;
			try {
				dispatched = state.delegation.run({ team }, () => original.apply(this, args));
			} catch (error) {
				// Dispatch failed before any receipt existed: give the lane back now
				// instead of leaking it (a leaked lane would look like a permanently
				// busy model and skew every later spillover decision).
				lease?.release();
				throw error;
			}
			if (lease !== void 0) {
				// `startActivation` returns a receipt synchronously; `start` returns a
				// promise. Handle both without assuming either.
				if (dispatched !== null && typeof dispatched === "object" && typeof dispatched.then === "function") {
					Promise.resolve(dispatched).then(
						(receipt) => lease.bind(receipt),
						() => lease.release()
					);
				} else {
					lease.bind(dispatched);
				}
			}
			return dispatched;
		};
		raw[key] = wrapped;
		restorers.push(() => { if (raw[key] === wrapped) raw[key] = original; });
```

</details>

#### 缺口

- 宿主请求循环在失败前后的副作用范围未在本次固定材料中验证
  **影响**：不能将模型请求重试写为端到端任务幂等恢复
  **进一步探讨**：用目标宿主记录故障前后请求与工具执行，检查重复副作用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · fork 切片和豁免能保留什么，会丢失什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

切片按最近 N 个已完成 turn/end 边界取种子，正在执行的尾部事件不进入窗口；如果完成轮数不超阈值，则保留原 seed。窗口之前最近一次压缩摘要可转成插件来源的用户消息插入，窗口内事件深拷贝、重新连续编号，并映射 surfaceOp、sourceEventSeqs、developer 的 headerSeq。无法映射替换范围或来源关系就返回 null，调用方保留原始 seed。一轮没有被部分切开，与语义信息完整是两回事。窗口外尚未进入压缩摘要的早期要求会被丢掉；只保留最新几轮不能保证任务、约束和证据都仍齐备。

包裹 fork.prepareContinuable 时先让宿主准备再替换种子；一次性 fork.start 则尝试懒加载宿主 in-process driver，找不到时走原 provider，保留原历史。因此“兼容失败时退回原历史”有源码支持，但不能保证所有长会话都缩短，也没有本次 token 节约或质量数据。

豁免规则出生时可按 label、agentPreset、cwd 前缀匹配，并可钉住出生模型；运行中 isExemptAgent 只从子会话标签判定，未保存 preset/cwd 的命中状态。由此，只有 preset/cwd 命中、标签不命中的子代理，出生时跳过路由仍可能在后续符合条件的请求错误中进入全局失败切换。fork provider 的独立 start 包装还调用 routeDelegation，普通出生豁免没有在该函数统一判断，不能据 README 把全部 fork 入口视为同一豁免契约。团队另有 label/persona 识别，且自动失败切换和上下文注入排除团队；这并不自动修复普通豁免的阶段差异。

这里最值得采用的保守原则是“无法正确重编号就用原历史”。但协议可表示与语义足够应分别验收；需要早期业务约束、严格供应商隔离或依靠 preset/cwd 豁免的场景，应先关闭切片和自动失败切换，或等待完整生命周期豁免得到证据支持。

#### 证据与依据

**依据 1 · 源码核查**：[lib/fork-window.js:64-100](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/fork-window.js#L64-L100)

完成轮边界与窗口取值。

<details>
<summary>查看原文（37行）</summary>

```text
			return null;
		}

		// Strictly isolate completed turns: find the last turn/end in the event log
		const lastTurnEndIdx = events.findLastIndex((e) => e && e.type === "turn/end");
		if (lastTurnEndIdx === -1) {
			// No completed turns found
			return null;
		}

		// Discard any in-flight / uncompleted events after the last turn/end
		const completedEvents = events.slice(0, lastTurnEndIdx + 1);

		// Collect all completed turn end indices
		const turnEndIndices = [];
		for (let i = 0; i < completedEvents.length; i++) {
			if (completedEvents[i]?.type === "turn/end") {
				turnEndIndices.push(i);
			}
		}

		const totalCompletedTurns = turnEndIndices.length;
		if (totalCompletedTurns <= turnsLimit) {
			// No slicing needed; caller preserves full seed
			return null;
		}

		// Calculate window boundary: take the last `turnsLimit` turns
		const prevTurnEndIdx = turnEndIndices[totalCompletedTurns - turnsLimit - 1];
		const windowStartIdx = prevTurnEndIdx + 1;
		const windowEndIdx = lastTurnEndIdx;

		const rawWindow = completedEvents.slice(windowStartIdx, windowEndIdx + 1);
		if (rawWindow.length === 0) {
			return null;
		}

```

</details>

**依据 2 · 源码核查**：[lib/fork-window.js:102-136](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/fork-window.js#L102-L136)

旧压缩摘要的保留方式。

<details>
<summary>查看原文（35行）</summary>

```text
		let priorSummary = null;
		for (let i = windowStartIdx - 1; i >= 0; i--) {
			const ev = completedEvents[i];
			if (ev?.type === "compaction/summary" && ev.data?.summary) {
				priorSummary = {
					summary: ev.data.summary,
					time: ev.time,
					compactionId: ev.data.compactionId
				};
				break;
			}
		}

		const resultSeed = [];
		let nextSeq = 0;

		// A summary may be a string or native content blocks; never stringify blocks.
		if (priorSummary) {
			const content = typeof priorSummary.summary === "string"
				? [{ type: "text", text: priorSummary.summary }]
				: priorSummary.summary;
			if (!Array.isArray(content) || content.length === 0) return null;
			resultSeed.push({
				type: "user/message",
				seq: nextSeq++,
				time: priorSummary.time ?? Date.now(),
				data: {
					id: `summary-compaction-${priorSummary.compactionId || randomUUID().slice(0, 8)}`,
					role: "user",
					content: JSON.parse(JSON.stringify(content)),
					source: { kind: "plugin:dsh-subagent-role-router", form: "prior-compaction-summary" }
				},
				surfaceOp: "append"
			});
		}
```

</details>

**依据 3 · 源码核查**：[lib/fork-window.js:153-203](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/fork-window.js#L153-L203)

引用映射失败即返回原种子的信号。

<details>
<summary>查看原文（51行）</summary>

```text

			if (isSurfaceEligibleType(cloned.type)) {
				// Surface-eligible events MUST have surfaceOp
				if (!cloned.surfaceOp) {
					cloned.surfaceOp = "append";
				} else if (typeof cloned.surfaceOp === "object" && cloned.surfaceOp.op === "replace") {
					const newStart = oldSeqToNewSeq.get(cloned.surfaceOp.startSeq);
					const newEnd = oldSeqToNewSeq.get(cloned.surfaceOp.endSeq);
					if (newStart === undefined || newEnd === undefined) {
						// Replacement points outside the retained window; cannot be safely represented
						return null;
					}
					cloned.surfaceOp.startSeq = newStart;
					cloned.surfaceOp.endSeq = newEnd;
				}

				// Remap sourceEventSeqs if present
				if (Array.isArray(cloned.sourceEventSeqs)) {
					const mappedSources = cloned.sourceEventSeqs
						.map((s) => oldSeqToNewSeq.get(s))
						.filter((s) => s !== undefined && s < curSeq);

					if (mappedSources.length !== cloned.sourceEventSeqs.length) {
						// Source event sequences in replacement cannot be fully resolved
						return null;
					}

					if (mappedSources.length > 0) {
						cloned.sourceEventSeqs = mappedSources;
					} else {
						delete cloned.sourceEventSeqs;
					}
				}

				// Check message source invariants
				if (cloned.type === "user/message") {
					if (!cloned.data?.source?.kind) {
						cloned.data = cloned.data || {};
						cloned.data.source = { kind: "user" };
					}
				} else if (cloned.type === "developer/message") {
					if (cloned.data?.headerSeq !== undefined) {
						const newHeaderSeq = oldSeqToNewSeq.get(cloned.data.headerSeq);
						if (newHeaderSeq !== undefined) {
							cloned.data.headerSeq = newHeaderSeq;
						} else {
							return null;
						}
					}
				}
			} else {
```

</details>

**依据 4 · 源码核查**：[lib/index.js:937-965](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L937-L965)

出生三种维度的豁免。

<details>
<summary>查看原文（29行）</summary>

```text
export function ruleMatches(rule, identity) {
	const pattern = typeof rule?.pattern === "string" ? rule.pattern.trim() : "";
	if (pattern === "") return false;
	const kind = rule?.match === "preset" || rule?.match === "cwd" ? rule.match : "label";
	const value = identity?.[kind];
	return typeof value === "string" && value.startsWith(pattern);
}

/** Collect the birth identity a spawn wrapper can see for one request. */
function birthIdentity(spec, request) {
	return {
		label: (spec && typeof spec.label === "string" && spec.label) || (request && typeof request.label === "string" && request.label) || "",
		preset: request?.agentPreset,
		cwd: request?.cwd
	};
}

/** The first exemption rule matching this spawn's birth identity, or undefined. */
export function exemptRuleForBirth(state, spec, request) {
	const section = state.getSection?.();
	const rules = section && Array.isArray(section.exemptRules) ? section.exemptRules : [];
	if (rules.length === 0) return void 0;
	const identity = birthIdentity(spec, request);
	for (const rule of rules) {
		if (ruleMatches(rule, identity)) return rule;
	}
	return void 0;
}

```

</details>

**依据 5 · 源码核查**：[lib/index.js:1077-1087](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L1077-L1087)

运行中只按 label 匹配。

<details>
<summary>查看原文（11行）</summary>

```text
/** True when a RUNNING child's own label matches a label-kind exemption rule. */
export function isExemptAgent(state, agent) {
	const section = state.getSection?.();
	if (!section || !Array.isArray(section.exemptRules) || section.exemptRules.length === 0) return false;
	const label = childExemptLabel(agent);
	if (typeof label !== "string" || label === "") return false;
	for (const rule of section.exemptRules) {
		if (ruleMatches(rule, { label })) return true;
	}
	return false;
}
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1881-1917](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L1881-L1917)

fork 的独立路由与切片包装。

<details>
<summary>查看原文（37行）</summary>

```text
function hookForkProvider(raw, state) {
	const fork = raw.getProvider?.("fork");
	if (!fork || fork[HOOKED_FORK]) return;
	const originalStart = fork.start;
	const originalPrepare = fork.prepareContinuable;
	const restore = [];
	const slice = (request, seed) => {
		const section = state.getSection?.() ?? {};
		if (section.forkWindowSlicing === false || state.delegation.getStore()?.team) return null;
		return safeWindowSeed(request.parent, section.forkWindowTurns, seed);
	};
	if (typeof originalPrepare === "function") {
		const wrapped = async function(request) {
			const prepared = await originalPrepare.call(this, request);
			if (!Array.isArray(prepared?.seed)) return prepared;
			const seed = slice(request, prepared.seed);
			return seed === null ? prepared : { ...prepared, seed };
		};
		fork.prepareContinuable = wrapped;
		restore.push(() => { if (fork.prepareContinuable === wrapped) fork.prepareContinuable = originalPrepare; });
	}
	if (typeof originalStart === "function") {
		const wrapped = async function(request) {
			if (teamIdentity(request?.label, request?.persona) || state.delegation.getStore()?.team) {
				return originalStart.call(this, request);
			}
			// A fork branch hands back no receipt, so a lane reserved here could
			// never be returned. Route it through the pool but do not occupy a lane.
			request = routeDelegation(state, request, request?.label, false).request;
			const seed = slice(request);
			if (seed !== null) {
				// Load the host's own driver lazily; external plugin resolution must
				// never turn an optional optimization into a boot-time crash.
				const driver = nativeForkDriver(state);
				if (driver) return driver(request, { seed });
			}
			return originalStart.call(this, request);
```

</details>

#### 缺口

- 没有同任务长会话切片的语义保真对照
  **影响**：不能声称减少历史后仍保持原交付质量
  **进一步探讨**：构造早期约束只出现一次的任务，比对完整历史和切片的遗漏率。
- 出生豁免到运行期切换的差异未做真实宿主复现
  **影响**：源码说明触发条件，实际影响仍依赖宿主入口和标签
  **进一步探讨**：在 preset/cwd 单独命中的子代理中注入可控请求失败，记录实际路由。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、白名单同步和运行中切换依赖什么，退出会留下什么？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

这是原生 DSH 插件。package 的 dsh.bundle 指向 Cordis patch，patch 插入同名插件，main 导出 lib/index.js，Web client 通过宿主插槽挂载。包声明 Node >=20，并对 settings、subagent、llm 及 Web 组件声明分段的 0.1.7/0.2.x 兼容区间；版本声明不能替代目标宿主验收。路由效果还依赖操作者配置的 provider/model、密钥、额度和支持的推理强度，这些不是安装包自动提供的。

运行中换模由 Web 控件发起、loopback HTTP 端点写入 childRoutes，再由 agent/request 的最后覆盖改写下一次模型请求；不会撤销已发出的请求或重跑已完成步骤。override 在子代理 disposed 或插件卸载时清理，重启也不持久保留。前端轮询有卸载清理，服务包装恢复也先核对当前值仍为自身包装，避免直接覆盖后来插件的替换。

必须注意它不只是读配置。syncHostWhitelist 从本插件配置推导 desired，并调用 settings.update 启用原生模型白名单、用 desired 替换 allowedModels；原名单与本配置不同会写入，未见先保存旧名单、取并集或卸载恢复旧值。空 desired 又直接跳过，因此清空本插件模型不等于清空曾写入的宿主名单。启动延迟尝试与每次派发的异步同步都能触发该写回；同步不等待派发完成，故不能把首次派发前名单必已同步当作保证。

退出应同时检查内存改路由和宿主持久设置。停用插件会还原包装、监听和内存状态，但操作者需另行核对并恢复原生子代理白名单，必要时保留安装前配置备份。GET 白名单诊断端点自身还会调用同步，因此查看诊断不是纯读操作。此副作用在隔离 profile 尚可人工核对，在共享或严格受控配置上不宜直接采用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:33-43](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/package.json#L33-L43)

运行时与入口声明。

<details>
<summary>查看原文（11行）</summary>

```text
  "engines": {
    "node": ">=20"
  },
  "type": "module",
  "main": "lib/index.js",
  "icon": "icons/plugin-icon-128.png",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
```

</details>

**依据 2 · 源码核查**：[package.json:57-85](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/package.json#L57-L85)

bundle/client 接线与 peer 兼容声明。

<details>
<summary>查看原文（29行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-primitives",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-settings"
      ]
    }
  },
  "dependencies": {
    "@deepseek-ai/schemastery": ">=3.18.1 <4.0.0"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-settings": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.2.1-0 || >=0.2.1-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-subagent": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.2.1-0 || >=0.2.1-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-llm": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.2.1-0 || >=0.2.1-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-connection": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.2.1-0 || >=0.2.1-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-locale": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.2.1-0 || >=0.2.1-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-slots": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.2.1-0 || >=0.2.1-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-primitives": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.2.1-0 || >=0.2.1-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-conversation": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.2.1-0 || >=0.2.1-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-settings": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.2.1-0 || >=0.2.1-rc.1 <0.3.0-0"
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:6-8](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/cordis.patch.yml#L6-L8)

注册实际插件行。

```text
- insert:
    - id: dsh-subagent-role-router
      name: 'dsh-subagent-role-router'
```

**依据 4 · 源码核查**：[lib/index.js:748-773](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L748-L773)

持久白名单替换、空名单与已同步分支。

<details>
<summary>查看原文（26行）</summary>

```text
export async function syncHostWhitelist(ctx, state) {
	const desired = hostWhitelistModels(state?.getSection?.());
	if (desired.length === 0) return { synced: false, reason: "no-models" };
	const get = (name) => {
		try {
			return typeof ctx?.get === "function" ? ctx.get(name, false) : void 0;
		} catch (_error) {
			return void 0;
		}
	};
	let current;
	try {
		current = get("subagentModelSelection")?.current?.();
	} catch (_error) {
		// `current()` throws when the gate is enabled with an empty list; treat
		// that as "not in sync yet" and write the real value.
		current = void 0;
	}
	if (current && current.enabled === true && sameWhitelist(current.allowedModels, desired)) {
		return { synced: false, reason: "in-sync" };
	}
	const settings = get("settings");
	if (!settings || typeof settings.update !== "function") return { synced: false, reason: "no-settings" };
	await settings.update(NATIVE_WHITELIST_ID, { enabled: true, allowedModels: desired });
	return { synced: true, models: desired };
}
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1665-1699](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L1665-L1699)

下一请求覆盖和子代理结束清理。

<details>
<summary>查看原文（35行）</summary>

```text
function installChildRouteOverride(ctx, state) {
	const disposeRequest = ctx.on("agent/request", async (payload, next) => {
		const seed = await next();
		const { agent } = payload;
		// Broad child gate on purpose: plain subagents AND agent-teams members
		// can be re-routed mid-run (teams are excluded from the AUTOMATIC
		// failover by `isSubagentAgent`; an explicit user pick is not automatic).
		if (!isChildAgent(agent)) return seed;
		const id = agent?.id;
		const override = typeof id === "string"
			? (state.childRoutes.get(id) || (id.startsWith("session-") ? state.childRoutes.get(id.slice(8)) : state.childRoutes.get("session-" + id)))
			: void 0;
		if (override === void 0) return seed;
		if (seed === void 0 || seed === null) return seed;
		// Drop the inherited effort: it belongs to the route being replaced, and a
		// provider whose thinking level must agree with the effort rejects the
		// mismatch outright (see the same note in `installFailover`).
		const { reasoningEffort: _inherited, ...rest } = seed;
		const switched = { ...rest, provider: override.provider, model: override.model };
		if (override.reasoningEffort !== void 0) switched.reasoningEffort = override.reasoningEffort;
		return switched;
	});

	const disposeDisposed = ctx.on("agent/disposed", ({ agent }) => {
		if (typeof agent?.id === "string") {
			state.childRoutes.delete(agent.id);
			if (agent.id.startsWith("session-")) state.childRoutes.delete(agent.id.slice(8));
			else state.childRoutes.delete("session-" + agent.id);
		}
	});

	ctx.effect(() => () => {
		disposeRequest();
		disposeDisposed();
	}, "dsh-subagent-role-router: child route override");
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1789-1804](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L1789-L1804)

GET 诊断内调用同步产生写副作用。

<details>
<summary>查看原文（16行）</summary>

```text
			if (req.method === "GET" && pathname === `${OVERRIDE_PATH}/whitelist`) {
				const desired = hostWhitelistModels(state.getSection?.());
				let current;
				try {
					current = ctx.get("subagentModelSelection", false)?.current?.();
				} catch (error) {
					current = { error: String(error?.message ?? error) };
				}
				let outcome;
				try {
					outcome = await syncHostWhitelist(ctx, state);
				} catch (error) {
					outcome = { synced: false, reason: "error", message: String(error?.message ?? error) };
				}
				writeJson(res, 200, { ok: true, build: ROUTER_BUILD, value: { desired, current, outcome, last: state.lastWhitelistSync ?? null, routes: state.routeSeen ?? [] } });
				return;
```

</details>

**依据 7 · 源码核查**：[lib/index.js:2136-2165](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L2136-L2165)

注入、延迟同步和卸载清理范围。

<details>
<summary>查看原文（30行）</summary>

```text
	// Attach the method wrapper only while the service exists. Cordis re-runs
	// this child fiber if the provider is replaced, while settings stay served.
	ctx.inject(["subagents"], (subagentCtx) => {
		installSubagentWrapper(subagentCtx, state);
	});

	// Mirror this page's models into the native subagent model gate. Retried a
	// few times because a profile reload mounts `settings` and the gate's own
	// config in an order we do not control; each attempt is idempotent, so a
	// reload that changes nothing writes nothing.
	ctx.effect(() => {
		const timers = [2000, 8000, 20000].map((delay) => setTimeout(() => {
			syncHostWhitelistSoon(ctx, state, (error) => {
				ctx.logger.warn("[dsh-subagent-role-router] could not sync the native subagent model whitelist:", error);
			});
		}, delay));
		return () => {
			for (const timer of timers) clearTimeout(timer);
		};
	});

	ctx.effect(() => () => {
		state.rrCursor = 0;
		// Drop every lane/cooldown/role record on unload: a hot reload must not
		// inherit stale occupancy, or the pool would look permanently busy.
		state.slots.clear();
		state.cooldowns.clear();
		state.roleOfChild.clear();
		state.childRoutes.clear();
	});
```

</details>

**依据 8 · 源码核查**：[lib/client.js:3230-3271](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/client.js#L3230-L3271)

前端路由轮询及清理。

<details>
<summary>查看原文（42行）</summary>

```text
          }
          srrLog("PICKER_OPEN", info);
        }, 140);
        return function () { if (typeof clearTimeout === "function") clearTimeout(timer); };
      }, [open]);

      // Poll the live route: the child may fail over, finish, or be switched by
      // another window. One tiny loopback JSON per tick.
      React.useEffect(function () {
        if (!isSubagent) {
          setRoute(null);
          return;
        }
        var alive = true;
        var tick = function () {
          liveRouteGet(sessionId).then(function (body) {
            if (!alive) return;
            if (body && body.ok === true && body.value) setRoute(body.value);
            else setRoute(null);
            // Why this exists: a child page that shows NO control at all is
            // indistinguishable, from the outside, between "the picker never
            // mounted" (not detected as a subagent), "mounted but the route
            // endpoint says not-live", and "mounted with a route but the panel
            // is empty". One line per poll separates those three.
            srrLog("PICKER_POLL", {
              sid: sessionId,
              isSubagent: isSubagent,
              ok: Boolean(body && body.ok === true),
              hasValue: Boolean(body && body.value),
              code: body && body.error ? body.error.code : undefined
            });
          });
        };
        tick();
        if (typeof setInterval !== "function") return function () { alive = false; };
        var timer = setInterval(tick, LIVE_ROUTE_POLL_MS);
        return function () {
          alive = false;
          if (typeof clearInterval === "function") clearInterval(timer);
        };
      }, [isSubagent, sessionId]);

```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 效果与全周期成本有多少依据，怎样做有限试用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

当前材料支持路由选择、有限失败切换、上下文裁剪和下次请求覆盖这些机制，不支持已兑现的节时、节费或合格率提升。作者对廉价模型承担探索的解释是合理任务假设，但费用取决于实际模型、重试、上下文长度和返工。README 的测试条目说明作者提供了验证资产；本次没有执行测试，也未独立确认这些测试的通过情况，因此不按测试数量升级可用性证据。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 需要模型服务额度；金额未知 | 配置角色、候补、密钥、版本并备份白名单；耗时未知 | 不提供现成供应商资格 |
| 持续使用 | 各模型请求、失败重试与历史输入费用未知 | 校准混合任务标签，检查实际路由和交付 | 候补数量不限制总并发或费用 |
| 失败恢复 | 有限切换仍可能付出多次请求成本 | 修复凭据、移除坏候补、核对已发生副作用 | 全冷却仍派发，耗尽交回宿主错误 |
| 升级与退出 | 迁移和回退的资源量未知 | 还原宿主白名单，核对其他插件及 fork 入口 | 停用不自动恢复持久名单 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 集中路由 | 符合条件的派发不需逐次指定模型 | 用户实际减少多少改派和输入 |
| 容错 | 符合错误类别时有限切换并告警 | 总合格率是否增加、是否重复副作用 |
| 缩短 fork 历史 | 可表示时使用最近完成轮窗口 | 早期约束遗漏、token 和耗时净变化 |
| 运行中改派 | 内存覆盖改变下一次请求 | 目标模型是否可用、剩余任务是否更好 |

建议暂列观察。想尝试的高级用户可在独立 profile 中先固定白名单备份，只配明确标签任务，关闭自动失败切换和切片，验证显式选择与界面改派，再分别验证候补失败与历史窗口；这是一条后续验证路径，不是本轮完成的试用。出现候补越界、白名单意外变化、早期约束遗漏或额外重试成本无法接受时停止，恢复配置并退回每次显式指定模型。核心豁免和持久配置边界尚未得到完整运行证据，故不直接给安装或一般试用推荐。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:37-54](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/README.md#L37-L54)

作者任务和收益解释属于声明。

<details>
<summary>查看原文（18行）</summary>

```text
| 角色 | 干什么活 | 典型场景 |
| --- | --- | --- |
| **explore（探索）** | 只读的调查、搜索、解释、审查 | 搜代码、查资料、解释一段逻辑 |
| **plan（规划）** | 出方案、做设计、拆任务 | 架构设计、制定实施计划 |
| **patch（修补）** | 真正动代码、写实现 | 改文件、修 bug、写新功能 |

**为什么值得这么做**：不同活对模型的要求不一样。探索类任务读得多、写得少，用便宜快的小模型就够；修补类任务要精确改代码，值得上最强的模型。把它们混在一起用同一个模型，要么探索时浪费贵模型，要么改代码时用了个不够聪明的。

角色判定分四级，从明确到模糊：

1. **显式标签** —— 标签或提示词里写了 `[explore]`、`[plan]`、`[patch]`（也认 `[scout]`、`[planner]`、`[coder]`，以及中文的 `【探索】`、`规划:`、`修补:` 等写法）。
2. **来源识别** —— 旁问（BTW）插件的标签 `michengai-btw:` 一律判为 explore，因为旁问天然是只读问答。
3. **关键词兜底** —— 提示词里出现 `explore`/`investigate`/`audit`/`explain`/`探索`/`排查`/`解释`/`不理解` 等判为 explore；`plan`/`design`/`架构`/`规划`/`方案`/`设计` 判为 plan；`patch`/`implement`/`fix`/`refactor`/`修补`/`实现` 判为 patch。
4. **兜底默认** —— 都没命中时判为 **patch**（通用型）。这是刻意的：拿不准的活按「要动代码」对待，宁可给它一个更强的模型，也不要让一个真正要改代码的任务落到弱模型上。

**配置**：开启 `roleMode`，然后为三个角色各填 `provider` / `model` / `effort`（共 9 个字段），或改用功能六的候补队列（`exploreModels` / `planModels` / `patchModels`）让同一角色可以同时跑多个子代理。某个角色留空时**回落到 `models` 列表**（即功能二的多模型策略），因此可以只配你想区别对待的角色。

**与功能二、三的关系**：角色路由在**派发时**决定「这个子代理去哪个模型」；功能二的策略决定「多个子代理之间怎么分配」；功能三在**运行中**决定「这条路由挂了换哪条」。三者独立，可以同时开。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:495-516](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L495-L516)

冷却与忙闲并非成本硬上限。

<details>
<summary>查看原文（22行）</summary>

```text
	const now = Date.now();
	const usable = entries
		.map((entry, index) => ({ entry, index }))
		.filter(({ entry }) => (state.cooldowns.get(routeKey(entry)) ?? 0) <= now);

	let candidates = usable;
	if (candidates.length === 0) {
		// Everything is cooling down. Keep serving, but say so.
		state.onCoolingExhausted?.();
		candidates = entries.map((entry, index) => ({ entry, index }));
	}

	let best = candidates[0];
	for (const candidate of candidates) {
		const load = state.slots.get(routeKey(candidate.entry)) ?? 0;
		const bestLoad = state.slots.get(routeKey(best.entry)) ?? 0;
		if (load < bestLoad || (load === bestLoad && candidate.index < best.index)) best = candidate;
	}
	return best;
}

/**
```

</details>

**依据 3 · 源码核查**：[lib/index.js:748-773](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L748-L773)

白名单恢复是实际退出负担。

<details>
<summary>查看原文（26行）</summary>

```text
export async function syncHostWhitelist(ctx, state) {
	const desired = hostWhitelistModels(state?.getSection?.());
	if (desired.length === 0) return { synced: false, reason: "no-models" };
	const get = (name) => {
		try {
			return typeof ctx?.get === "function" ? ctx.get(name, false) : void 0;
		} catch (_error) {
			return void 0;
		}
	};
	let current;
	try {
		current = get("subagentModelSelection")?.current?.();
	} catch (_error) {
		// `current()` throws when the gate is enabled with an empty list; treat
		// that as "not in sync yet" and write the real value.
		current = void 0;
	}
	if (current && current.enabled === true && sameWhitelist(current.allowedModels, desired)) {
		return { synced: false, reason: "in-sync" };
	}
	const settings = get("settings");
	if (!settings || typeof settings.update !== "function") return { synced: false, reason: "no-settings" };
	await settings.update(NATIVE_WHITELIST_ID, { enabled: true, allowedModels: desired });
	return { synced: true, models: desired };
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1210-1245](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L1210-L1245)

失败重试可能产生额外请求。

<details>
<summary>查看原文（36行）</summary>

```text
	const disposeRequestError = ctx.on("agent/request-error", (payload, next) => {
		const { agent, turn, step, failure, signal } = payload;
		if (signal?.aborted) return next();
		if (!isSubagentAgent(agent)) return next();
		if (failure === void 0) return next();
		// Two ways in: the route was unreachable (rate limit, quota, transport…)
		// or the route cannot serve this request at all (model not allowed for
		// this account, unknown model, unsupported effort). The second class is
		// skipped-and-cooled exactly like the first — see CANDIDATE_UNUSABLE_CODES.
		if (!FAILOVER_ELIGIBLE_CODES.includes(failure.code) && !isUnusableCandidate(failure)) return next();
		// An exempt plugin child must not even COOL its route down: its failure
		// says nothing about the model's health for everyone else, and a cooldown
		// recorded here would silently skew the next ordinary delegation.
		if (isExemptAgent(state, agent)) return next();
		// Cool the failing route down BEFORE deciding whether anything can be
		// switched to: a role pool with a single lane cannot fail over at all,
		// yet its model still deserves to be skipped by the NEXT delegation
		// instead of being handed the next task while it is still rate-limited.
		noteCooldown(ctx, state, agent, failure);
		const view = failoverView(state, agent);
		if (view === void 0) return next();
		const current = pending.get(agent.id);
		// The primary already failed (that triggered the first switch), so the
		// remaining candidates are the other pool entries: at most
		// `entries.length - 1` switches, then let the real error surface.
		if (current !== void 0 && current.count >= view.entries.length - 1) return next(); // pool exhausted
		const index = nextFailoverIndex(view, agent, current);
		// Remember every pool entry this run has already been switched to, so a
		// candidate that fails again is not selected a second time.
		const tried = new Set(current?.tried ?? []);
		tried.add(index);
		pending.set(agent.id, {
			index,
			tried,
			count: (current?.count ?? 0) + 1
		});
```

</details>

**依据 5 · 源码核查**：[lib/fork-window.js:80-100](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/fork-window.js#L80-L100)

裁剪输入范围不等于交付效果。

<details>
<summary>查看原文（21行）</summary>

```text
			if (completedEvents[i]?.type === "turn/end") {
				turnEndIndices.push(i);
			}
		}

		const totalCompletedTurns = turnEndIndices.length;
		if (totalCompletedTurns <= turnsLimit) {
			// No slicing needed; caller preserves full seed
			return null;
		}

		// Calculate window boundary: take the last `turnsLimit` turns
		const prevTurnEndIdx = turnEndIndices[totalCompletedTurns - turnsLimit - 1];
		const windowStartIdx = prevTurnEndIdx + 1;
		const windowEndIdx = lastTurnEndIdx;

		const rawWindow = completedEvents.slice(windowStartIdx, windowEndIdx + 1);
		if (rawWindow.length === 0) {
			return null;
		}

```

</details>

#### 缺口

- 没有同预算合格任务成本、耗时及人工纠错数据
  **影响**：不能形成持续采用的经济性结论
  **进一步探讨**：固定任务验收、模型与预算，对比逐次指定和自动路由，统计全部失败与返工。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些设计可借鉴，可推导什么可证伪的新假设？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可借鉴的是将派发时选择、请求失败切换、下一请求人工覆盖分层，并用租约结算避免派发异常后留下永久占用；监听与包装撤销时核对自身所有权，也有助于多插件共存。移植需要宿主暴露等价的服务包装、请求瀑布和子代理生命周期，并不能直接复制成任何 Agent 框架通用组件。

关键欠缺是路由契约跨阶段不统一。出生时保存的角色只供部分失败路径读取；preset/cwd 豁免没有成为运行期完整身份；模型白名单则是插件主动接管的全局持久设置。由此推导一个未验证假设：给每次派发建立明确的路由契约，保存允许模型集合、豁免来源、是否允许跨供应商、预算和历史保留条件，让出生、fork、失败切换和人工改派都读取同一契约，会比各阶段重新识别更容易保证边界。它不是已有能力，也不等于已证明应建立通用平台。

最小验证先用带明确角色和豁免的有限用例矩阵，包括单角色候补加全局池、仅 preset/cwd 命中、显式模型、团队、fork、全部冷却和退出恢复。比较当前分散规则与契约方案，记录越界路由数、遗漏早期约束数、总模型请求、合格交付和人工改派时间；保持同模型、同任务和预算。只有越界归零且合格率不降、人工配置负担可接受才支持方案。若现有显式参数已经充分，或契约增加配置却不减少错误，应放弃复杂化并保留简单显式路由。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:535-575](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L535-L575)

租约结算是可复用错误恢复结构。

<details>
<summary>查看原文（41行）</summary>

```text
function acquireLane(state, entry, role) {
	const key = routeKey(entry);
	state.slots.set(key, (state.slots.get(key) ?? 0) + 1);
	let released = false;
	const give = () => {
		if (released) return;
		released = true;
		const left = (state.slots.get(key) ?? 1) - 1;
		if (left > 0) state.slots.set(key, left);
		else state.slots.delete(key);
	};
	return {
		entry,
		/**
		 * Hold the lane until the child settles, then give it back.
		 *
		 * `subagent/end` is emit-only and cannot be awaited from a plugin, so the
		 * receipt's `result` promise is the one settle signal available. A child
		 * that never settles keeps its lane occupied — by design: that lane IS
		 * busy, and the pool then shares work across the remaining lanes instead
		 * of pretending the stuck model is free.
		 *
		 * @param {object} receipt - the value returned by startActivation.
		 */
		bind(receipt) {
			if (receipt?.childId !== void 0) state.roleOfChild.set(receipt.childId, role);
			const result = receipt?.result;
			if (result === void 0 || result === null || typeof result.then !== "function") {
				// No settle signal: give the lane back at once rather than leak it.
				give();
				return;
			}
			Promise.resolve(result).then(give, give);
		},
		/** Give the lane back immediately (dispatch threw before a receipt existed). */
		release() {
			give();
		}
	};
}

```

</details>

**依据 2 · 源码核查**：[lib/index.js:622-653](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L622-L653)

角色集合在失败路径中的选择条件。

<details>
<summary>查看原文（32行）</summary>

```text
function failoverView(state, agent) {
	const section = state.getSection?.();
	if (section === void 0 || section === null) return void 0;
	if (section.failoverEnabled === false) return void 0;
	// An exempt plugin child runs on whatever it was born with (or on the route
	// its plugin pinned): switching it mid-run would break exactly the promise
	// the exemption list makes.
	if (agent !== void 0 && isExemptAgent(state, agent)) return void 0;
	// An explicit pick from the Web UI wins over the automatic switch. Silently
	// rerouting a model the user just named is the exact complaint this feature
	// exists to fix, and the cooldown bookkeeping would then blame the candidate
	// the user chose for a failure that belongs to the route being left behind.
	if (agent !== void 0 && state.childRoutes.has(agent.id)) return void 0;
	// A subagent that was placed on a ROLE pool must fail over INSIDE that pool:
	// its lanes are the alternatives the user actually chose for this kind of
	// work. Falling back to the base pool here would silently drag a general-
	// purpose task onto an unrelated model that the role was configured to avoid.
	const role = agent === void 0 ? void 0 : state.roleOfChild.get(agent.id);
	const rolePool = section.roleMode === true && role !== void 0 ? resolveRolePool(section, role) : [];
	const entries = rolePool.length >= 2
		? rolePool
		: (Array.isArray(section.models)
			? section.models.map((entry) => resolveEntry(section, entry)).filter((entry) => entry !== void 0)
			: []);
	// A pool of <2 models has nothing to switch to; keep the parent route.
	if (entries.length < 2) return void 0;
	return { entries, strategy: section.strategy === "random" ? "random" : "round-robin" };
}

/** True only for a SUBAGENT-origin agent (the durable session header marker). */
function teamIdentity(label, persona) {
	return (typeof label === "string" && label.startsWith("agent-teams:"))
```

</details>

**依据 3 · 源码核查**：[lib/index.js:937-965](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L937-L965)

出生规则携带比运行期更多的身份维度。

<details>
<summary>查看原文（29行）</summary>

```text
export function ruleMatches(rule, identity) {
	const pattern = typeof rule?.pattern === "string" ? rule.pattern.trim() : "";
	if (pattern === "") return false;
	const kind = rule?.match === "preset" || rule?.match === "cwd" ? rule.match : "label";
	const value = identity?.[kind];
	return typeof value === "string" && value.startsWith(pattern);
}

/** Collect the birth identity a spawn wrapper can see for one request. */
function birthIdentity(spec, request) {
	return {
		label: (spec && typeof spec.label === "string" && spec.label) || (request && typeof request.label === "string" && request.label) || "",
		preset: request?.agentPreset,
		cwd: request?.cwd
	};
}

/** The first exemption rule matching this spawn's birth identity, or undefined. */
export function exemptRuleForBirth(state, spec, request) {
	const section = state.getSection?.();
	const rules = section && Array.isArray(section.exemptRules) ? section.exemptRules : [];
	if (rules.length === 0) return void 0;
	const identity = birthIdentity(spec, request);
	for (const rule of rules) {
		if (ruleMatches(rule, identity)) return rule;
	}
	return void 0;
}

```

</details>

**依据 4 · 源码核查**：[lib/index.js:1077-1087](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L1077-L1087)

运行期身份信息不等价。

<details>
<summary>查看原文（11行）</summary>

```text
/** True when a RUNNING child's own label matches a label-kind exemption rule. */
export function isExemptAgent(state, agent) {
	const section = state.getSection?.();
	if (!section || !Array.isArray(section.exemptRules) || section.exemptRules.length === 0) return false;
	const label = childExemptLabel(agent);
	if (typeof label !== "string" || label === "") return false;
	for (const rule of section.exemptRules) {
		if (ruleMatches(rule, { label })) return true;
	}
	return false;
}
```

</details>

**依据 5 · 源码核查**：[lib/index.js:2023-2032](https://github.com/643048695/dsh-subagent-role-router/blob/2c30dfed05224635b618c00fe41b19e2b5f139cb/lib/index.js#L2023-L2032)

只撤销自身包装。

<details>
<summary>查看原文（10行）</summary>

```text
		raw[key] = wrapped;
		restorers.push(() => { if (raw[key] === wrapped) raw[key] = original; });
	}
	raw[WRAPPED] = state;
	ctx.effect(() => () => {
		off();
		for (const restore of restorers) restore();
		for (const cleanup of state.forkCleanups.splice(0)) cleanup();
		if (raw[WRAPPED] === state) delete raw[WRAPPED];
	});
```

</details>

#### 缺口

- 路由契约方案未实现也未比较
  **影响**：只能作为从已查边界推导的设计假设
  **进一步探讨**：先完成有限用例矩阵，再判断减少越界是否值得新增配置。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
