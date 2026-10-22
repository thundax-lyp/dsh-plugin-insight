# DSH RotaKit

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[17a02c0](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/tree/17a02c085af35ab08ceb3075b003a981afa76d5c)

<!-- BEGIN META -->
[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy) [![npm 30d 577](https://img.shields.io/static/v1?label=npm+30d&message=577&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-rotakit) [![最新发布 2026-10-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-rotakit)
<!-- END META -->

> **实现功能**：把本机 WorkBuddy/CodeBuddy 账号组成模型池，提供 Chat、Responses、Messages 本地代理与积分状态。

> **核心亮点**：作者署名说明账号池、凭据解密与部分加固来自 MIT 上游；本项目可辨识增量是多协议同调度链、工具/流兼容投影和管理界面组合，仍需实际任务与上游差异对照。详见[Q01](#research-q01)。

> **风险与缺陷**：input_image 被转成文本占位，数组工具输出只抽文本，工具声明只保留 function；HTTP 200 可伴随语义丢失。粘性键也由相同开头文本构成，TTL/容量与“永不失效”表述不一致。详见[Q03](#research-q03)。

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
  - [Q01 · 此改编项目解决哪类账号接入，哪些贡献应归上游？](#detail-section-11)
  - [Q02 · 三协议和多账号调度如何组合，哪些状态决定账号选择？](#detail-section-12)
  - [Q03 · Responses 工具与多模态信息转译会丢失什么？](#detail-section-13)
  - [Q04 · 接入、持续使用和失败恢复的成本与条件有哪些？](#detail-section-14)
  - [Q05 · 如何从协议投影限制推导可证伪的改进，而不重复上游账号池？](#detail-section-15)
  - [Q06 · 什么条件下可隔离试用，何时不应把兼容响应当任务成功？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：供已登录本人账号的用户在兼容客户端复用调度与故障转移；合格结果须验证完整模型/工具任务。详见[Q01](#research-q01)。

手工切账号或上游单协议池可提供部分能力；本改编组合三协议，但不能把上游调度/凭据基础和未经验证的兼容效果全部归己。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 本地账号池 | 轮转/冷却/额度门槛 | 本人账号与上游条件、费用未知 |
| 三协议代理 | 兼容不同客户端 | 图片和自定义工具可能静默降级 |
| 积分面板 | 查看余额、状态与自动化 | 显示不等于任务成功或经济收益 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 本人本机登录快照与上游条件 | 必需 | 取得账号/额度与模型服务 | 无可服务账号或需重新登录 |
| DSH/Node、兼容客户端 | 按接入方式需要 | 运行 shim 与三协议调用 | 接入失败或协议不符 |
| 本地监听/密钥和网络边界 | 必需 | 保护代理和账号 | LAN 开关下要另审访问 |
| 真实工具任务回归 | 采用需要 | 验转换是否保真 | 200/正文不足以证明成功 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 本人核账号、服务条款、地区、模型和本地密钥 | 只用获授权账号与明确成本 |
| 接入 | 配一个隔离客户端先试文本请求 | 路由与调度状态可追溯 |
| 回归 | 依次试函数工具、图像/自由工具和流中断 | 结果与客户端任务完成一致 |
| 复盘 | 记录积分、换号、失败和人工修复 | 不用 200 当全部成功，异常撤回 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本人 WorkBuddy/CodeBuddy 账号、DSH/Node 与上游可达；金额未知 | 核条款、登录态、密钥和协议客户端；耗时未知 | 不同地区/模型能力需匹配 |
| 持续使用 | 上游积分、刷新/重试与代理进程；价格未知 | 看冷却、重新登录、核工具任务和兼容；频率未知 | 作者奖励机制不保证免费 |
| 失败恢复 | 额外请求/积分与服务中断；数值未知 | 区分限流、余额、凭据和协议损失；耗时未知 | HTTP 200 可能不是完整成功 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多账号调度 | 冷却/额度/租约/粘性与统一路由源码 | 可用率、节省人工切换时间 |
| 三协议兼容 | Chat/Responses/Messages 路由与流转换 | 图片/自由工具/复杂历史保真率 |
| 积分可见性 | 状态与余额接口/面板 | 实际净成本、奖励持续性 |

> **思考**：input_image 被转成文本占位，数组工具输出只抽文本，工具声明只保留 function；HTTP 200 可伴随语义丢失。粘性键也由相同开头文本构成，TTL/容量与“永不失效”表述不一致。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：作者署名说明账号池、凭据解密与部分加固来自 MIT 上游；本项目可辨识增量是多协议同调度链、工具/流兼容投影和管理界面组合，仍需实际任务与上游差异对照。详见[Q01](#research-q01)。

作者署名说明账号池、凭据解密与部分加固来自 MIT 上游；本项目可辨识增量是多协议同调度链、工具/流兼容投影和管理界面组合，仍需实际任务与上游差异对照。详见[Q01](#research-q01)。

把协议层与调度层分离可借鉴；静默丢失不可表示信息会放大兼容成功的表象，应有能力协商和明确降级。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

input_image 被转成文本占位，数组工具输出只抽文本，工具声明只保留 function；HTTP 200 可伴随语义丢失。粘性键也由相同开头文本构成，TTL/容量与“永不失效”表述不一致。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察，本人账号与明确上游条件下隔离验证实际客户端闭环和积分成本；不以返回码或余额面板单独判断可用。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持三协议路由与转换/调度分层；多模态和自定义工具存在格式降级，真实客户端闭环与经济性未本轮独立验证；假设未实现。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/protocol-compat.js、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README、package、lib/protocol-compat.js 与 lib/index.js 的目标段落；巨大打包代码未逐行全审，未执行目标测试/宿主或调用账号；旧 META 仅复用。
- 下一步：构造图像、自由工具、乱序/缺失结果、截断 SSE 与相同开头不同会话的协议夹具；在本人测试账号下记录保真、任务完成、额度与重试成本。

**分析版本**

- **仓库**：[2861292267/DSH-Official-WorkBuddy-Credit-Proxy](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy)
- **版本号**：2.4.2（[固定提交 17a02c0](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/tree/17a02c085af35ab08ceb3075b003a981afa76d5c)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是能力协商并对不能保真的请求显式拒绝/标注降级，另为图像与自由格式工具补受测通路；用协议契约夹具测失真、误拒绝和延迟。详见[Q05](#research-q05)。

构造图像、自由工具、乱序/缺失结果、截断 SSE 与相同开头不同会话的协议夹具；在本人测试账号下记录保真、任务完成、额度与重试成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 3290 | — | — | 43510 |
| .js | source | 8 | 24593 | 15501 | 8786 | — |
| .mjs | source | 8 | 1168 | 792 | 294 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：RotaKit 改编版如何复用本地账号池服务三协议，协议投影和成本边界能否支撑真实工具任务？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 此改编项目解决哪类账号接入，哪些贡献应归上游？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标人群是已在本机登录自己 WorkBuddy/CodeBuddy 账号、希望在 DSH 或兼容客户端复用一个模型入口的用户。合格交付是选择到有额度且具备目标模型能力的账号，三协议请求/工具轮按预期完成，并能明确计费与失败原因；HTTP 200 或一段正文不是完整验收。作者明示基于 XDTrees 的账号池、其他项目的凭据解密与 shim 加固，因此这些既有基础不能全算新贡献。可辨识的本项目增量是把 Chat、Responses、Messages 转译到同一个调度链并做界面/积分管理组合；原有办法是手工切账号或分别部署单协议代理，收益需与上游池或手工操作同条件比较。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-29](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/README.md#L1-L29)

作者场景、多账号机制和来源署名。

<details>
<summary>查看原文（29行）</summary>

```text
# RotaKit · DSH 官方版 WorkBuddy 积分池

把本机登录过的 **WorkBuddy / CodeBuddy 账号**合并成一个自动故障转移的 DeepSeek Harness 模型池，附带一整套积分自动化。

你在桌面端登过几个号，池里就有几个号 —— 不用手动录入，不用一个个切换。哪个号限流了、积分用完了、令牌失效了，请求自动落到下一个能用的号上。

池子同时说 **OpenAI Chat / OpenAI Responses / Anthropic Messages** 三种协议，所以 DSH、Codex、Claude Code 以及任何 OpenAI / Anthropic SDK 客户端都能直接接进来，共用同一个账号池。

> **来源与署名。** RotaKit 是独立维护的改编版，基于 [`XDTrees/dsh-workbuddy-xdpool`](https://github.com/XDTrees/dsh-workbuddy-xdpool)（MIT，作者 **XDTrees**）。账号凭据解密移植自 [`dingminhua/dsh-connect-workbuddy`](https://github.com/dingminhua/dsh-connect-workbuddy)，shim 的加固与错误映射参照 [`corrinehu/dsh-workbuddy-connect`](https://github.com/corrinehu/dsh-workbuddy-connect)，两者均为 MIT。原版文档见 [`UPSTREAM-README.md`](UPSTREAM-README.md)。

---

## 功能总览

### 一、多账号池

| 能力 | 说明 |
|---|---|
| **自动发现账号** | 读本机桌面端登录快照（国内 / 国际两套），一个文件一个号，无需手动导入 |
| **按权重选号** | 空闲越久的账号权重越高；取权重最高的前 5 个再洗牌，避免长尾账号被反复抽中 |
| **会话粘性** | 同一对话固定用同一个账号，缓存不失效；账号不可用时自动换绑并固定新号 |
| **在途租约** | 同一账号并发超过 2 个请求时让路，避免把限流风险堆在一个号上 |
| **冷却分级** | 429（限流）与 5xx（网关故障）分开计数 —— 网关抖动不再污染限流历史 |
| **按模型冷却** | 某个模型被限流只影响该模型，同账号其他模型照常可用 |
| **凭据熔断** | 连续 3 次被拒的账号移出池 30 分钟，并标「需重新登录」，不再无声消失 |
| **额度门槛** | 余额低于可服务门槛（默认 50）的账号自动跳过 —— **余额恢复后自动回到池中**，无需任何操作 |
| **积分保留** | 可给单账号设保留线，低于该线不再派活 |
| **手动停用** | 可停用指定账号，与自动跳过分开管理 |
| **选号预算** | 单次请求最多尝试 8 个**不同**账号；同一请求内不会重复选到同一账号 |
```

</details>

**依据 2 · 作者声明**：[README.md:80-105](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/README.md#L80-L105)

三协议与作者的工具/流兼容说明。

<details>
<summary>查看原文（26行）</summary>

```text

| 协议 | 路径 | 谁在用 |
|---|---|---|
| **OpenAI Chat** | `/v1/chat/completions` | DSH 本体、普通客户端 |
| **OpenAI Responses** | `/v1/responses` | **Codex**、任何 Responses 客户端 |
| **Anthropic Messages** | `/v1/messages` | **Claude Code**、Anthropic SDK |

翻译层与调度层是分开的：新协议只负责把请求转成 chat 体、把回答转回去，**调度逻辑一行都不重复**。
好处是改轮换策略时三条路由同时生效，不会有人掉队；协议出 bug 也只会是翻译错，不会串到调度。

几个不显然的实现点（都是实测踩出来的）：

- **工具调用在 `response.output` 里出现两次** —— Codex 靠读最终响应判断「这轮要不要继续」，
  只在流事件里发 `output_item.done` 而 `output` 数组里没有，Codex 会认为模型只是说了句话，
  于是**结束回合等人输入**，表现为「任务做到一半停了」
- **工具调用的「调用」与「结果」先配对再发送** —— 上游拒绝「结果早于调用」和「调用没有结果」，
  而客户端传来的历史里两种都真实存在（会话被中断、被裁剪过）
- **对话不以工具轮开头** —— 裁剪过的历史第一条可能就是助手工具调用，上游直接拒；
  补一条用户轮在最前面，而不是删掉工具调用（后面的结果是真的）
- **Anthropic 的 `stop_reason` 不是装饰** —— 模型要用工具时必须报 `tool_use`，
  报成 `end_turn` 客户端会认为回合结束，刚拿到的 `tool_use` 块永远不会被执行
- **`max_tokens` 有地板** —— 池里是**推理模型**，思考计入 `max_tokens`。
  实测（同一提示词，各 6 次）：`max_tokens=16` 时只有 1/6 能产出内容、`64` 时 3/6、`256` 以上 6/6 ——
  预算被思考吃光时上游返回 `finish_reason: length` 且 **`content` 完全为空**，
  客户端收到一个语法完整、内容为空、无法分辨原因的回复。所以低于 512 的预算会被抬高
  （预算仍是上限不是配额，要 64 token 照样得到简短回复，只是**至少能得到**）
```

</details>

**依据 3 · 源码核查**：[lib/protocol-compat.js:1-29](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/lib/protocol-compat.js#L1-L29)

转译层说明复用同一 Chat 调度链，且部分移植自上游。

<details>
<summary>查看原文（29行）</summary>

```text
/*
 * Protocol compatibility layer for dsh-rotakit.
 *
 * The shim speaks OpenAI chat completions. Everything real - account rotation,
 * cooldowns, credit reserves, context compaction - lives behind
 * `/v1/chat/completions`. Two other protocols are widely asked for and neither
 * is served by the WorkBuddy upstream:
 *
 *   - the OpenAI **Responses** API (`/v1/responses`), which is the only shape
 *     Codex speaks;
 *   - the **Anthropic Messages** API (`/v1/messages`), which is the shape every
 *     Anthropic-SDK client speaks.
 *
 * Both are pure translation problems. Rather than reimplementing rotation for
 * each one, this module converts an incoming request into a chat body, lets the
 * shim's existing loop do the work, and converts the chat stream back. That is
 * the whole reason the module is separate from `index.js`: the translation must
 * not be entangled with the scheduling, or a protocol bug would look like a
 * pool bug.
 *
 * Why this shape rather than an in-process call: the shim's own chat handler
 * decides which account serves a request. Anything that bypassed it would also
 * bypass cooldowns and reserves. The translations here are deliberately dumb -
 * they carry no scheduling state at all.
 *
 * Ported from the standalone WorkBuddy Pool's Responses bridge (2.1.0), which
 * had it working against live Codex traffic; kept byte-compatible on the wire
 * so a client that worked against that endpoint works against this one.
 */
```

</details>

#### 缺口

- 未独立审阅上游代码差异或同条件真实任务
  **影响**：不能给原创范围百分比与节省工时结论
  **进一步探讨**：按固定上游提交做功能差异和真实客户端任务对照

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 三协议和多账号调度如何组合，哪些状态决定账号选择？

**研究主题**：功能与机制

#### 完整回答

本地 HTTP shim 对 Chat、Responses 和 Anthropic Messages 分别注册路由；Responses/Messages 转成 Chat 请求，再走同一 chat handler，让账号扫描、额度门槛/保留、冷却、在途租约、粘性和换号逻辑复用。凭据由本机既有登录快照发现，shim 默认绑回环，Bearer 或 x-api-key 进统一鉴权；Web 客户端还展示积分和状态。粘性键由 system 与首条 user 内容哈希得到，默认缓存 30 分钟、最多 512 条，单账号在途上限为 2；两段开头相同的不同会话可能共享绑定，截断开头可能改变绑定。作者 README 的“缓存不失效”不等于源码的有限 TTL/容量。实际可用性还受上游模型网关、地区账号、额度和协议支持影响。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:3186-3237](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/lib/index.js#L3186-L3237)

粘性 TTL、容量、并发上限及会话键形成。

<details>
<summary>查看原文（52行）</summary>

```text
const STICKY_TTL_MS = 18e5;
/**
* Cap on tracked conversations.
*
* The map is keyed by conversation, so without a bound a long-running process
* would hold one entry per conversation it had ever seen. Well above the number
* that can be in flight at once.
*/
const STICKY_MAX = 512;
/**
* How many requests one account may have in flight before it is passed over.
*
* `acquire` selects on `lastUsedAt`, which only moves once a request has
* succeeded. Concurrent requests therefore all read the same idle picture and can
* be handed the same account, which is exactly when an upstream rate limit bites.
*
* The bound is 2, not 1, because of the tension with stickiness: a conversation
* pinned to an account for its prompt cache will send its next turn there, and
* refusing to do that the moment one request is in flight would discard the
* cache benefit on every overlap. Two tolerates the ordinary case - a follow-up
* begun while the previous turn is still streaming - while still refusing to pile
* requests onto one account.
*/
const IN_FLIGHT_LIMIT = 2;
/**
* A stable identity for one conversation, derived from its opening.
*
* The client sends no conversation id, so the key has to come from the content.
* The system prompt plus the first user message is the part that does not change
* as the conversation grows: hashing the whole message list would produce a
* different key every turn, which is the opposite of what a sticky binding needs.
*
* Returns undefined when there is nothing stable to key on, and the caller then
* falls back to ordinary rotation.
*/
function conversationKeyOf(parsed) {
	if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return void 0;
	const messages = parsed["messages"];
	if (!Array.isArray(messages) || messages.length === 0) return void 0;
	let system = "";
	let firstUser = "";
	for (const entry of messages) {
		if (typeof entry !== "object" || entry === null) continue;
		const content = typeof entry["content"] === "string" ? entry["content"] : "";
		if (content === "") continue;
		if (entry["role"] === "system" && system === "") system = content;
		else if (entry["role"] === "user" && firstUser === "") firstUser = content;
		if (system !== "" && firstUser !== "") break;
	}
	if (system === "" && firstUser === "") return void 0;
	return createHash("sha256").update(system).update("\u0000").update(firstUser).digest("hex").slice(0, 16);
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:8464-8489](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/lib/index.js#L8464-L8489)

统一令牌/主账号鉴权和计费路径。

<details>
<summary>查看原文（26行）</summary>

```text
	function presentedToken(req) {
		const header = req.headers.authorization;
		if (typeof header === "string") {
			const match = /^Bearer\s+(.+)$/i.exec(header.trim());
			if (match !== null) return match[1];
		}
		const apiKey = req.headers["x-api-key"];
		return typeof apiKey === "string" ? apiKey.trim() : apiKey;
	}
	/**
	 * 鉴权 + IP 白名单 + 每日配额的统一入口。
	 * 三条判据的先后是有意的：宿主密钥永远放行；托管密钥先比 hash，
	 * 再比启用状态、IP、配额。「key 不存在」不该告诉对方「IP 不在白名单」。
	 */
	function resolvePrincipal(req) {
		const token = presentedToken(req);
		const master = tokenOk(token);
		if (pro !== undefined) return pro.authorize(req, token, master);
		return master
			? { ok: true, principal: { kind: "master", id: "master", name: "宿主密钥" } }
			: { ok: false, status: 401, code: "unauthorized", message: "missing or invalid Authorization bearer" };
	}
	/** 只有真正打模型的路径才计入每日配额，/healthz 与 /v1/models 不计。 */
	function countsTowardQuota(path) {
		return path === "/v1/chat/completions" || path === "/v1/chat/completions/" || path === "/v1/responses" || path === "/v1/responses/" || path === "/v1/messages" || path === "/v1/messages/";
	}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:8490-8535](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/lib/index.js#L8490-L8535)

shim 绑定端口与回环默认。

<details>
<summary>查看原文（46行）</summary>

```text
	const server = createServer((req, res) => {
		handle(req, res);
	});
	/**
	* The bound port is fixed per region, for the same reason the secret above is.
	*
	* `listen(0)` returns a different port on every load, while the host caches the
	* baseUrl it resolved from the catalog. A plugin reload - which the loader
	* performs whenever an entry's revision changes - therefore left the host
	* pointed at a port nothing was listening on, and every request failed with a
	* connection error until the catalog happened to be re-read. Fixing the port
	* keeps that URL valid across reloads. The superseded instance releases it in
	* `close()`, and the retry covers the moment before it does; a port that stays
	* busy falls back to an ephemeral one rather than refusing to start.
	*/
	const PREFERRED_PORT = options.port ?? (region === "global" ? 8121 : 8120);
	const listenOn = (port) => new Promise((resolve, reject) => {
		const onError = (error) => {
			server.removeListener("listening", onListening);
			reject(error);
		};
		const onListening = () => {
			server.removeListener("error", onError);
			resolve();
		};
		server.once("error", onError);
		server.once("listening", onListening);
		server.listen(port, LAN_ENABLED === true ? "0.0.0.0" : "127.0.0.1");
	});
	const ready = (async () => {
		for (let attempt = 0; attempt < 10; attempt += 1) {
			try {
				await listenOn(PREFERRED_PORT);
				return;
			} catch (error) {
				if (error?.code !== "EADDRINUSE") throw error;
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
		}
		logger?.warn(`dsh-rotakit: shim port ${String(PREFERRED_PORT)} is busy; falling back to an ephemeral port, which a reload will invalidate`);
		await listenOn(0);
	})();
	const baseUrl = () => {
		const address = server.address();
		if (address === null || typeof address === "string") throw new Error("workbuddy shim has no listening address");
		return `http://127.0.0.1:${address.port}`;
```

</details>

**依据 4 · 源码核查**：[lib/index.js:8666-8691](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/lib/index.js#L8666-L8691)

三协议路由与同一 Chat 调度入口。

<details>
<summary>查看原文（26行）</summary>

```text
			if (req.method === "POST" && (url === "/v1/chat/completions" || url === "/v1/chat/completions/")) {
				await chatCompletions(req, res);
				return;
			}
			/**
			* The Responses API, which is the only shape Codex speaks.
			*
			* Served by translating the request into a chat body and handing it to the
			* SAME loop the chat route uses, so rotation, cooldowns, credit reserves and
			* context compaction all apply unchanged. A separate implementation would
			* have had to re-derive every one of those, and would silently diverge from
			* the chat path the first time one of them changed.
			*/
			if (req.method === "POST" && (url === "/v1/responses" || url === "/v1/responses/")) {
				await viaResponses(req, res);
				return;
			}
			/**
			* The Anthropic Messages API, which every Anthropic-SDK client speaks.
			*
			* Same approach as Responses: translate in, translate out, and let the chat
			* loop keep owning the scheduling.
			*/
			if (req.method === "POST" && (url === "/v1/messages" || url === "/v1/messages/")) {
				await viaAnthropic(req, res);
				return;
```

</details>

**依据 5 · 作者声明**：[README.md:15-29](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/README.md#L15-L29)

作者对池调度能力的介绍。

<details>
<summary>查看原文（15行）</summary>

```text
### 一、多账号池

| 能力 | 说明 |
|---|---|
| **自动发现账号** | 读本机桌面端登录快照（国内 / 国际两套），一个文件一个号，无需手动导入 |
| **按权重选号** | 空闲越久的账号权重越高；取权重最高的前 5 个再洗牌，避免长尾账号被反复抽中 |
| **会话粘性** | 同一对话固定用同一个账号，缓存不失效；账号不可用时自动换绑并固定新号 |
| **在途租约** | 同一账号并发超过 2 个请求时让路，避免把限流风险堆在一个号上 |
| **冷却分级** | 429（限流）与 5xx（网关故障）分开计数 —— 网关抖动不再污染限流历史 |
| **按模型冷却** | 某个模型被限流只影响该模型，同账号其他模型照常可用 |
| **凭据熔断** | 连续 3 次被拒的账号移出池 30 分钟，并标「需重新登录」，不再无声消失 |
| **额度门槛** | 余额低于可服务门槛（默认 50）的账号自动跳过 —— **余额恢复后自动回到池中**，无需任何操作 |
| **积分保留** | 可给单账号设保留线，低于该线不再派活 |
| **手动停用** | 可停用指定账号，与自动跳过分开管理 |
| **选号预算** | 单次请求最多尝试 8 个**不同**账号；同一请求内不会重复选到同一账号 |
```

</details>

#### 缺口

- 未连接真实上游或观察多会话绑定/换号
  **影响**：不能证明可用率、缓存省钱与粘性正确率
  **进一步探讨**：隔离模拟相同开头/截断会话与额度/冷却事件，记录选号及真实客户端输出

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Responses 工具与多模态信息转译会丢失什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

inputToMessages 把 tool call/result 配对、为缺失结果补一条说明，有利于通过 Chat 上游格式；但它对 input_image 只写文本占位，对数组工具输出抽出文本，图片等内容结构会丢失。toolsToChat 仅保留 type=function 声明，custom/free-form 工具可能不在可用工具列表中；历史中自定义工具调用的自由文本 input 虽能进入 Chat function arguments，却不能推出端到端自由格式工具语义完整。缺结果被合成说明可避免上游拒绝，但它不是实际工具结果。由此模型正文和 HTTP 200 可能掩盖图像/工具能力的静默降级。这是固定源码的格式投影判断，未对目标客户端作本轮独立验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/protocol-compat.js:69-134](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/lib/protocol-compat.js#L69-L134)

工具调用/结果的收集与自由文本参数转换。

<details>
<summary>查看原文（66行）</summary>

```text
	for (const item of input) {
		if (item === null || typeof item !== "object") continue;
		const type = item.type ?? "message";

		if (type === "function_call" || type === "custom_tool_call" || type === "local_shell_call") {
			const id = callIdOf(item) ?? `call_${String(calls.size + 1)}`;
			/* A shell call arrives as its own type, with the command in a different field. */
			const name = item.name ?? (type === "local_shell_call" ? "shell" : "unknown");
			/**
			 * Where the payload lives depends on the item type, and reading the wrong
			 * field is silent: the call still goes upstream, just with `{}` for its
			 * arguments.
			 *
			 *  - `function_call`        -> `arguments` (a JSON string)
			 *  - `local_shell_call`     -> `action`   (an object)
			 *  - `custom_tool_call`     -> `input`    (a FREE-FORM string, not JSON)
			 *
			 * The third case is the one that used to break Codex. Its `apply_patch`
			 * and shell tools are declared free-form, so the model's output arrives in
			 * `input` - and this code only consulted `arguments`/`action`, leaving
			 * `args === "{}"`. The upstream accepted the request, the model was handed
			 * an empty patch body and answered "I received an empty patch request",
			 * and nothing in the log looked wrong: HTTP 200, a normal tool call, a
			 * plausible reply. Verified against codex-rs (protocol/src/items.rs), where
			 * the free-form variant carries `input`.
			 *
			 * `input` is passed through verbatim rather than JSON-stringified when it
			 * is already a string, because a free-form payload is the raw text the
			 * tool must receive - quoting it would hand the tool a JSON string
			 * literal instead of a patch.
			 */
			const rawArgs = typeof item.arguments === "string"
				? item.arguments
				: (item.action !== void 0
					? JSON.stringify(item.action)
					: (typeof item.input === "string" ? item.input : (item.input === void 0 ? "{}" : JSON.stringify(item.input))));
			const args = rawArgs === "" ? "{}" : rawArgs;
			const entry = {
				role: "assistant",
				content: null,
				tool_calls: [{ id, type: "function", function: { name, arguments: args } }]
			};
			conversation.push(entry);
			calls.set(id, entry);
			continue;
		}

		if (type === "function_call_output" || type === "custom_tool_call_output") {
			const id = callIdOf(item);
			/**
			 * A structured output must keep its content-item shape.
			 *
			 * `output` is a string for `function_call_output`, but a free-form
			 * `custom_tool_call_output` may carry an ARRAY of content items (text,
			 * images). JSON-stringifying that array turns it into a literal blob the
			 * model then reads as `[{"type":"text",...}]` instead of as content - the
			 * caller's structure is lost even though the bytes survive. Arrays are
			 * therefore flattened to their text parts; anything else keeps the old
			 * behaviour.
			 */
			const output = typeof item.output === "string"
				? item.output
				: (item.output === void 0 ? "" : (Array.isArray(item.output) ? blocksToText(item.output) : JSON.stringify(item.output)));
			if (id === undefined) continue;
			results.set(id, { role: "tool", tool_call_id: id, content: output === "" ? "(no output)" : output });
			continue;
```

</details>

**依据 2 · 源码核查**：[lib/protocol-compat.js:137-156](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/lib/protocol-compat.js#L137-L156)

图片转换为文本占位，其他未知内容丢弃。

<details>
<summary>查看原文（20行）</summary>

```text
		if (type !== "message") continue;
		const role = item.role === "developer" ? "system" : (item.role ?? "user");
		let content;
		if (typeof item.content === "string") {
			content = item.content;
		} else if (Array.isArray(item.content)) {
			content = item.content
				.map((part) => {
					if (typeof part === "string") return part;
					if (part === null || typeof part !== "object") return "";
					if (part.type === "input_text" || part.type === "output_text" || part.type === "text") return part.text ?? "";
					if (part.type === "input_image") return typeof part.image_url === "string" ? `[image: ${part.image_url}]` : "[image]";
					return "";
				})
				.filter((s) => s !== "")
				.join("\n");
		} else {
			content = "";
		}
		conversation.push({ role, content });
```

</details>

**依据 3 · 源码核查**：[lib/protocol-compat.js:159-194](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/lib/protocol-compat.js#L159-L194)

缺失结果合成、孤立结果丢弃和对话开头补轮。

<details>
<summary>查看原文（36行）</summary>

```text
	/*
	 * Each call is followed immediately by its result, and a call whose result
	 * never arrived gets a synthesised one. A missing result makes the upstream
	 * reject the whole request, and the model would otherwise believe the tool
	 * ran and invent its output.
	 */
	for (const entry of conversation) {
		messages.push(entry);
		const call = entry.tool_calls?.[0];
		if (call === undefined) continue;
		const answer = results.get(call.id);
		if (answer === undefined) {
			messages.push({
				role: "tool",
				tool_call_id: call.id,
				content: "(this tool call was interrupted and produced no result)"
			});
			continue;
		}
		messages.push(answer);
		results.delete(call.id);
	}

	/* A result whose call is absent entirely is dropped rather than inventing a
	 * call for it: a fabricated assistant turn would misrepresent what the model
	 * asked for. */
	const firstToolish = messages.findIndex((m) => m.role === "assistant" && m.tool_calls !== undefined);
	const firstUser = messages.findIndex((m) => m.role === "user");
	if (firstToolish >= 0 && (firstUser < 0 || firstUser > firstToolish)) {
		messages.splice(firstToolish, 0, {
			role: "user",
			content: "(the conversation was resumed partway through; the tool work below continues it)"
		});
	}

	return messages;
```

</details>

**依据 4 · 源码核查**：[lib/protocol-compat.js:197-225](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/lib/protocol-compat.js#L197-L225)

仅 function 类型工具声明进入 Chat。

<details>
<summary>查看原文（29行）</summary>

```text
/** Responses tools are flat; chat nests them under `function`. */
export function toolsToChat(tools) {
	if (!Array.isArray(tools)) return undefined;
	const out = tools
		.filter((t) => t !== null && typeof t === "object" && t.type === "function")
		.map((t) => (typeof t.function === "object" && t.function !== null
			? t
			: { type: "function", function: { name: t.name, description: t.description, parameters: t.parameters } }))
		.filter((t) => typeof t.function?.name === "string" && t.function.name !== "");
	return out.length === 0 ? undefined : out;
}

/** Build the chat body one Responses request becomes. */
export function responsesToChatBody(body) {
	const chat = {
		model: body.model,
		messages: inputToMessages(body.input, body.instructions),
		max_tokens: body.max_output_tokens ?? body.max_tokens,
		temperature: body.temperature,
		top_p: body.top_p,
		stream: true
	};
	const tools = toolsToChat(body.tools);
	if (tools !== undefined) {
		chat.tools = tools;
		chat.tool_choice = body.tool_choice ?? "auto";
	}
	for (const key of Object.keys(chat)) if (chat[key] === undefined) delete chat[key];
	return chat;
```

</details>

#### 缺口

- 真实图像、自定义工具、混合内容及流中断契约未测
  **影响**：不能宣称所有兼容客户端的工具闭环可用
  **进一步探讨**：构造协议契约夹具并在真实客户端比较输入、事件、结果与最终状态

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 接入、持续使用和失败恢复的成本与条件有哪些？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

首次需本人已登录的 WorkBuddy/CodeBuddy 账号、本地凭据可读、DSH bundle/Node 兼容、可达上游及明确服务条款和地区条件；shim 默认本机回环，但另有可选 LAN 开关，跨机器使用要另审网络与密钥边界。持续成本是上游积分消耗、模型倍率/额度变化、扫描与余额刷新、账号重登、协议/SDK 兼容维护以及失败换号重试；自动签到/任务奖励并不能保证免费或稳定额度。失败恢复要分辨限流、积分耗尽、令牌失效、模型不支持、工具投影失败及端口漂移，回查原始请求和状态。金额、账号可用率、token/积分单价、复核时长和恢复成功率均未测。README 的实测数字属于作者报告，不是本轮独立测量。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-37](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/package.json#L1-L37)

版本、Node 与包入口。

<details>
<summary>查看原文（37行）</summary>

```text
{
  "name": "dsh-rotakit",
  "displayName": "DSH RotaKit",
  "description": "Merge every locally signed-in WorkBuddy account into DeepSeek Harness as one auto-failing-over model pool, serving OpenAI Chat, OpenAI Responses and Anthropic Messages from the same pool (multi-account rotation, live credits, daily check-in and model catalog).",
  "version": "2.4.2",
  "license": "MIT",
  "author": "XDTrees (upstream); adapted by 2861292267",
  "homepage": "https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy#readme",
  "bugs": {
    "url": "https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy.git"
  },
  "keywords": [
    "dsh-plugin",
    "deepseek-harness",
    "workbuddy",
    "codebuddy",
    "model-provider",
    "multi-account",
    "failover",
    "openai-compatible",
    "responses-api",
    "codex",
    "anthropic",
    "claude-code"
  ],
  "type": "module",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "bin": {
    "dsh-rotakit": "lib/bin.js"
```

</details>

**依据 2 · 作者声明**：[README.md:1-35](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/README.md#L1-L35)

本人账号、额度与池机制的作者声明。

<details>
<summary>查看原文（35行）</summary>

```text
# RotaKit · DSH 官方版 WorkBuddy 积分池

把本机登录过的 **WorkBuddy / CodeBuddy 账号**合并成一个自动故障转移的 DeepSeek Harness 模型池，附带一整套积分自动化。

你在桌面端登过几个号，池里就有几个号 —— 不用手动录入，不用一个个切换。哪个号限流了、积分用完了、令牌失效了，请求自动落到下一个能用的号上。

池子同时说 **OpenAI Chat / OpenAI Responses / Anthropic Messages** 三种协议，所以 DSH、Codex、Claude Code 以及任何 OpenAI / Anthropic SDK 客户端都能直接接进来，共用同一个账号池。

> **来源与署名。** RotaKit 是独立维护的改编版，基于 [`XDTrees/dsh-workbuddy-xdpool`](https://github.com/XDTrees/dsh-workbuddy-xdpool)（MIT，作者 **XDTrees**）。账号凭据解密移植自 [`dingminhua/dsh-connect-workbuddy`](https://github.com/dingminhua/dsh-connect-workbuddy)，shim 的加固与错误映射参照 [`corrinehu/dsh-workbuddy-connect`](https://github.com/corrinehu/dsh-workbuddy-connect)，两者均为 MIT。原版文档见 [`UPSTREAM-README.md`](UPSTREAM-README.md)。

---

## 功能总览

### 一、多账号池

| 能力 | 说明 |
|---|---|
| **自动发现账号** | 读本机桌面端登录快照（国内 / 国际两套），一个文件一个号，无需手动导入 |
| **按权重选号** | 空闲越久的账号权重越高；取权重最高的前 5 个再洗牌，避免长尾账号被反复抽中 |
| **会话粘性** | 同一对话固定用同一个账号，缓存不失效；账号不可用时自动换绑并固定新号 |
| **在途租约** | 同一账号并发超过 2 个请求时让路，避免把限流风险堆在一个号上 |
| **冷却分级** | 429（限流）与 5xx（网关故障）分开计数 —— 网关抖动不再污染限流历史 |
| **按模型冷却** | 某个模型被限流只影响该模型，同账号其他模型照常可用 |
| **凭据熔断** | 连续 3 次被拒的账号移出池 30 分钟，并标「需重新登录」，不再无声消失 |
| **额度门槛** | 余额低于可服务门槛（默认 50）的账号自动跳过 —— **余额恢复后自动回到池中**，无需任何操作 |
| **积分保留** | 可给单账号设保留线，低于该线不再派活 |
| **手动停用** | 可停用指定账号，与自动跳过分开管理 |
| **选号预算** | 单次请求最多尝试 8 个**不同**账号；同一请求内不会重复选到同一账号 |

### 二、模型目录

- 从上游实时拉取，带**积分倍率、免费 / 夜间折扣标签、图片能力、思考档位、上下文窗口**
- 标记「**无可用账号**」的模型：某模型没人能服务时一眼可见
- 标记「**成本未知**」：上游未公布倍率时不再默默留空
```

</details>

**依据 3 · 作者声明**：[README.md:285-300](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/README.md#L285-L300)

作者的本机账号和服务条款说明。

<details>
<summary>查看原文（16行）</summary>

```text
## 安全须知

- 插件只**读取**本机桌面端已经存在的登录态，**不发起**任何登录流程。卡片内扫码是**可选操作**，只在明确点击后打开，走的是桌面客户端自己的接口，**没有绕过任何鉴权**，消耗的是你自己的账号与积分。
- 令牌只在**本机内存与回环 shim** 之间传递，卡片上显示的账号一律脱敏。
- shim 只绑 `127.0.0.1`，强制回环来源校验。
- **管理接口的写操作要求 JSON 请求体**：跨站页面发不出 JSON POST（预检不被批准），
  而它发得出的表单 POST 无法声明 `application/json` —— 所以本机的账号启停、冷却清除、
  插件自更新等操作不会被网页越权调用。
- **二维码内容经过净化**：上游返回的登录二维码先按 SVG 解析并剥掉 `script` / `on*` /
  `href` 等可执行部分才注入 DOM，不直接信任上游返回的标记。

---

## 免责声明

本项目**仅供个人学习和研究使用**，仅驱动使用者自己的账号在本机调用。请遵守 WorkBuddy 的服务条款；因使用本项目产生的任何后果由使用者自行承担。
```

</details>

**依据 4 · 源码核查**：[lib/index.js:8494-8535](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/lib/index.js#L8494-L8535)

固定端口、重载回退和可选 LAN 绑定。

<details>
<summary>查看原文（42行）</summary>

```text
	* The bound port is fixed per region, for the same reason the secret above is.
	*
	* `listen(0)` returns a different port on every load, while the host caches the
	* baseUrl it resolved from the catalog. A plugin reload - which the loader
	* performs whenever an entry's revision changes - therefore left the host
	* pointed at a port nothing was listening on, and every request failed with a
	* connection error until the catalog happened to be re-read. Fixing the port
	* keeps that URL valid across reloads. The superseded instance releases it in
	* `close()`, and the retry covers the moment before it does; a port that stays
	* busy falls back to an ephemeral one rather than refusing to start.
	*/
	const PREFERRED_PORT = options.port ?? (region === "global" ? 8121 : 8120);
	const listenOn = (port) => new Promise((resolve, reject) => {
		const onError = (error) => {
			server.removeListener("listening", onListening);
			reject(error);
		};
		const onListening = () => {
			server.removeListener("error", onError);
			resolve();
		};
		server.once("error", onError);
		server.once("listening", onListening);
		server.listen(port, LAN_ENABLED === true ? "0.0.0.0" : "127.0.0.1");
	});
	const ready = (async () => {
		for (let attempt = 0; attempt < 10; attempt += 1) {
			try {
				await listenOn(PREFERRED_PORT);
				return;
			} catch (error) {
				if (error?.code !== "EADDRINUSE") throw error;
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
		}
		logger?.warn(`dsh-rotakit: shim port ${String(PREFERRED_PORT)} is busy; falling back to an ephemeral port, which a reload will invalidate`);
		await listenOn(0);
	})();
	const baseUrl = () => {
		const address = server.address();
		if (address === null || typeof address === "string") throw new Error("workbuddy shim has no listening address");
		return `http://127.0.0.1:${address.port}`;
```

</details>

**依据 5 · 作者声明**：[README.md:90-105](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/README.md#L90-L105)

作者的小样本输出预算试验声明。

<details>
<summary>查看原文（16行）</summary>

```text
几个不显然的实现点（都是实测踩出来的）：

- **工具调用在 `response.output` 里出现两次** —— Codex 靠读最终响应判断「这轮要不要继续」，
  只在流事件里发 `output_item.done` 而 `output` 数组里没有，Codex 会认为模型只是说了句话，
  于是**结束回合等人输入**，表现为「任务做到一半停了」
- **工具调用的「调用」与「结果」先配对再发送** —— 上游拒绝「结果早于调用」和「调用没有结果」，
  而客户端传来的历史里两种都真实存在（会话被中断、被裁剪过）
- **对话不以工具轮开头** —— 裁剪过的历史第一条可能就是助手工具调用，上游直接拒；
  补一条用户轮在最前面，而不是删掉工具调用（后面的结果是真的）
- **Anthropic 的 `stop_reason` 不是装饰** —— 模型要用工具时必须报 `tool_use`，
  报成 `end_turn` 客户端会认为回合结束，刚拿到的 `tool_use` 块永远不会被执行
- **`max_tokens` 有地板** —— 池里是**推理模型**，思考计入 `max_tokens`。
  实测（同一提示词，各 6 次）：`max_tokens=16` 时只有 1/6 能产出内容、`64` 时 3/6、`256` 以上 6/6 ——
  预算被思考吃光时上游返回 `finish_reason: length` 且 **`content` 完全为空**，
  客户端收到一个语法完整、内容为空、无法分辨原因的回复。所以低于 512 的预算会被抬高
  （预算仍是上限不是配额，要 64 token 照样得到简短回复，只是**至少能得到**）
```

</details>

#### 缺口

- 没有真实账单、积分、任务成功率和人工恢复统计
  **影响**：不能推导每次合格模型任务净成本
  **进一步探讨**：在本人测试账号且明确条款下记录同模型任务的积分、错误、重试和人工时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何从协议投影限制推导可证伪的改进，而不重复上游账号池？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

将协议转换与账号调度分层可复用，避免三路由各自复制冷却/额度逻辑；缺失工具结果显式补语句也优于默默冒充成功。然而转换器对不可表示的图像和自定义工具默认降级，可能让调用表面成功。未验证假设是先对模型/上游能力与客户端请求做协商，对不可表示字段明确拒绝或标注降级，只有能保真的字段才投影；为图像和自由工具提供受测转换路径。最小实验用图像、自由格式工具、乱序/缺失结果、截断 SSE、不同客户端和同模型构造真值样例，比较语义保真、拒绝正确率、任务完成率与额外延迟。严格拒绝可能减少可服务请求，也须量化。

#### 证据与依据

**依据 1 · 源码核查**：[lib/protocol-compat.js:1-29](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/lib/protocol-compat.js#L1-L29)

转换层与调度层分离的目的。

<details>
<summary>查看原文（29行）</summary>

```text
/*
 * Protocol compatibility layer for dsh-rotakit.
 *
 * The shim speaks OpenAI chat completions. Everything real - account rotation,
 * cooldowns, credit reserves, context compaction - lives behind
 * `/v1/chat/completions`. Two other protocols are widely asked for and neither
 * is served by the WorkBuddy upstream:
 *
 *   - the OpenAI **Responses** API (`/v1/responses`), which is the only shape
 *     Codex speaks;
 *   - the **Anthropic Messages** API (`/v1/messages`), which is the shape every
 *     Anthropic-SDK client speaks.
 *
 * Both are pure translation problems. Rather than reimplementing rotation for
 * each one, this module converts an incoming request into a chat body, lets the
 * shim's existing loop do the work, and converts the chat stream back. That is
 * the whole reason the module is separate from `index.js`: the translation must
 * not be entangled with the scheduling, or a protocol bug would look like a
 * pool bug.
 *
 * Why this shape rather than an in-process call: the shim's own chat handler
 * decides which account serves a request. Anything that bypassed it would also
 * bypass cooldowns and reserves. The translations here are deliberately dumb -
 * they carry no scheduling state at all.
 *
 * Ported from the standalone WorkBuddy Pool's Responses bridge (2.1.0), which
 * had it working against live Codex traffic; kept byte-compatible on the wire
 * so a client that worked against that endpoint works against this one.
 */
```

</details>

**依据 2 · 源码核查**：[lib/protocol-compat.js:69-194](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/lib/protocol-compat.js#L69-L194)

工具历史修复和内容投影。

<details>
<summary>查看原文（126行）</summary>

```text
	for (const item of input) {
		if (item === null || typeof item !== "object") continue;
		const type = item.type ?? "message";

		if (type === "function_call" || type === "custom_tool_call" || type === "local_shell_call") {
			const id = callIdOf(item) ?? `call_${String(calls.size + 1)}`;
			/* A shell call arrives as its own type, with the command in a different field. */
			const name = item.name ?? (type === "local_shell_call" ? "shell" : "unknown");
			/**
			 * Where the payload lives depends on the item type, and reading the wrong
			 * field is silent: the call still goes upstream, just with `{}` for its
			 * arguments.
			 *
			 *  - `function_call`        -> `arguments` (a JSON string)
			 *  - `local_shell_call`     -> `action`   (an object)
			 *  - `custom_tool_call`     -> `input`    (a FREE-FORM string, not JSON)
			 *
			 * The third case is the one that used to break Codex. Its `apply_patch`
			 * and shell tools are declared free-form, so the model's output arrives in
			 * `input` - and this code only consulted `arguments`/`action`, leaving
			 * `args === "{}"`. The upstream accepted the request, the model was handed
			 * an empty patch body and answered "I received an empty patch request",
			 * and nothing in the log looked wrong: HTTP 200, a normal tool call, a
			 * plausible reply. Verified against codex-rs (protocol/src/items.rs), where
			 * the free-form variant carries `input`.
			 *
			 * `input` is passed through verbatim rather than JSON-stringified when it
			 * is already a string, because a free-form payload is the raw text the
			 * tool must receive - quoting it would hand the tool a JSON string
			 * literal instead of a patch.
			 */
			const rawArgs = typeof item.arguments === "string"
				? item.arguments
				: (item.action !== void 0
					? JSON.stringify(item.action)
					: (typeof item.input === "string" ? item.input : (item.input === void 0 ? "{}" : JSON.stringify(item.input))));
			const args = rawArgs === "" ? "{}" : rawArgs;
			const entry = {
				role: "assistant",
				content: null,
				tool_calls: [{ id, type: "function", function: { name, arguments: args } }]
			};
			conversation.push(entry);
			calls.set(id, entry);
			continue;
		}

		if (type === "function_call_output" || type === "custom_tool_call_output") {
			const id = callIdOf(item);
			/**
			 * A structured output must keep its content-item shape.
			 *
			 * `output` is a string for `function_call_output`, but a free-form
			 * `custom_tool_call_output` may carry an ARRAY of content items (text,
			 * images). JSON-stringifying that array turns it into a literal blob the
			 * model then reads as `[{"type":"text",...}]` instead of as content - the
			 * caller's structure is lost even though the bytes survive. Arrays are
			 * therefore flattened to their text parts; anything else keeps the old
			 * behaviour.
			 */
			const output = typeof item.output === "string"
				? item.output
				: (item.output === void 0 ? "" : (Array.isArray(item.output) ? blocksToText(item.output) : JSON.stringify(item.output)));
			if (id === undefined) continue;
			results.set(id, { role: "tool", tool_call_id: id, content: output === "" ? "(no output)" : output });
			continue;
		}

		if (type !== "message") continue;
		const role = item.role === "developer" ? "system" : (item.role ?? "user");
		let content;
		if (typeof item.content === "string") {
			content = item.content;
		} else if (Array.isArray(item.content)) {
			content = item.content
				.map((part) => {
					if (typeof part === "string") return part;
					if (part === null || typeof part !== "object") return "";
					if (part.type === "input_text" || part.type === "output_text" || part.type === "text") return part.text ?? "";
					if (part.type === "input_image") return typeof part.image_url === "string" ? `[image: ${part.image_url}]` : "[image]";
					return "";
				})
				.filter((s) => s !== "")
				.join("\n");
		} else {
			content = "";
		}
		conversation.push({ role, content });
	}

	/*
	 * Each call is followed immediately by its result, and a call whose result
	 * never arrived gets a synthesised one. A missing result makes the upstream
	 * reject the whole request, and the model would otherwise believe the tool
	 * ran and invent its output.
	 */
	for (const entry of conversation) {
		messages.push(entry);
		const call = entry.tool_calls?.[0];
		if (call === undefined) continue;
		const answer = results.get(call.id);
		if (answer === undefined) {
			messages.push({
				role: "tool",
				tool_call_id: call.id,
				content: "(this tool call was interrupted and produced no result)"
			});
			continue;
		}
		messages.push(answer);
		results.delete(call.id);
	}

	/* A result whose call is absent entirely is dropped rather than inventing a
	 * call for it: a fabricated assistant turn would misrepresent what the model
	 * asked for. */
	const firstToolish = messages.findIndex((m) => m.role === "assistant" && m.tool_calls !== undefined);
	const firstUser = messages.findIndex((m) => m.role === "user");
	if (firstToolish >= 0 && (firstUser < 0 || firstUser > firstToolish)) {
		messages.splice(firstToolish, 0, {
			role: "user",
			content: "(the conversation was resumed partway through; the tool work below continues it)"
		});
	}

	return messages;
```

</details>

**依据 3 · 源码核查**：[lib/protocol-compat.js:197-225](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/lib/protocol-compat.js#L197-L225)

工具声明过滤。

<details>
<summary>查看原文（29行）</summary>

```text
/** Responses tools are flat; chat nests them under `function`. */
export function toolsToChat(tools) {
	if (!Array.isArray(tools)) return undefined;
	const out = tools
		.filter((t) => t !== null && typeof t === "object" && t.type === "function")
		.map((t) => (typeof t.function === "object" && t.function !== null
			? t
			: { type: "function", function: { name: t.name, description: t.description, parameters: t.parameters } }))
		.filter((t) => typeof t.function?.name === "string" && t.function.name !== "");
	return out.length === 0 ? undefined : out;
}

/** Build the chat body one Responses request becomes. */
export function responsesToChatBody(body) {
	const chat = {
		model: body.model,
		messages: inputToMessages(body.input, body.instructions),
		max_tokens: body.max_output_tokens ?? body.max_tokens,
		temperature: body.temperature,
		top_p: body.top_p,
		stream: true
	};
	const tools = toolsToChat(body.tools);
	if (tools !== undefined) {
		chat.tools = tools;
		chat.tool_choice = body.tool_choice ?? "auto";
	}
	for (const key of Object.keys(chat)) if (chat[key] === undefined) delete chat[key];
	return chat;
```

</details>

**依据 4 · 源码核查**：[lib/index.js:8666-8691](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/lib/index.js#L8666-L8691)

三协议复用统一处理入口。

<details>
<summary>查看原文（26行）</summary>

```text
			if (req.method === "POST" && (url === "/v1/chat/completions" || url === "/v1/chat/completions/")) {
				await chatCompletions(req, res);
				return;
			}
			/**
			* The Responses API, which is the only shape Codex speaks.
			*
			* Served by translating the request into a chat body and handing it to the
			* SAME loop the chat route uses, so rotation, cooldowns, credit reserves and
			* context compaction all apply unchanged. A separate implementation would
			* have had to re-derive every one of those, and would silently diverge from
			* the chat path the first time one of them changed.
			*/
			if (req.method === "POST" && (url === "/v1/responses" || url === "/v1/responses/")) {
				await viaResponses(req, res);
				return;
			}
			/**
			* The Anthropic Messages API, which every Anthropic-SDK client speaks.
			*
			* Same approach as Responses: translate in, translate out, and let the chat
			* loop keep owning the scheduling.
			*/
			if (req.method === "POST" && (url === "/v1/messages" || url === "/v1/messages/")) {
				await viaAnthropic(req, res);
				return;
```

</details>

#### 缺口

- 能力协商和拒绝路径未实现或对照测试
  **影响**：不能记作现有插件效果
  **进一步探讨**：隔离原型按契约夹具比较静默失真与正确拒绝

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么条件下可隔离试用，何时不应把兼容响应当任务成功？

**研究主题**：采用判断

#### 完整回答

在本人账号、上游条件清楚且客户端只用可确认的文本/函数子集时，可隔离观察同一模型的 Chat、Responses、Messages 调用，并跟踪额度与失败换号。涉及图片、自定义工具、复杂历史与自动积分动作时，先做端到端契约验证；不要因 HTTP 200、文本输出或界面显示余额就认定模型任务、工具执行和经济性成立。当前建议 observe，原因是依赖上游账号/政策和协议投影存在静默损失。本轮只读固定源码，未登录、调用模型、执行目标测试、验证条款或独立效果。

#### 证据与依据

**依据 1 · 源码核查**：[lib/protocol-compat.js:137-156](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/lib/protocol-compat.js#L137-L156)

图片/复杂内容的降级。

<details>
<summary>查看原文（20行）</summary>

```text
		if (type !== "message") continue;
		const role = item.role === "developer" ? "system" : (item.role ?? "user");
		let content;
		if (typeof item.content === "string") {
			content = item.content;
		} else if (Array.isArray(item.content)) {
			content = item.content
				.map((part) => {
					if (typeof part === "string") return part;
					if (part === null || typeof part !== "object") return "";
					if (part.type === "input_text" || part.type === "output_text" || part.type === "text") return part.text ?? "";
					if (part.type === "input_image") return typeof part.image_url === "string" ? `[image: ${part.image_url}]` : "[image]";
					return "";
				})
				.filter((s) => s !== "")
				.join("\n");
		} else {
			content = "";
		}
		conversation.push({ role, content });
```

</details>

**依据 2 · 源码核查**：[lib/protocol-compat.js:197-225](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/lib/protocol-compat.js#L197-L225)

工具声明子集。

<details>
<summary>查看原文（29行）</summary>

```text
/** Responses tools are flat; chat nests them under `function`. */
export function toolsToChat(tools) {
	if (!Array.isArray(tools)) return undefined;
	const out = tools
		.filter((t) => t !== null && typeof t === "object" && t.type === "function")
		.map((t) => (typeof t.function === "object" && t.function !== null
			? t
			: { type: "function", function: { name: t.name, description: t.description, parameters: t.parameters } }))
		.filter((t) => typeof t.function?.name === "string" && t.function.name !== "");
	return out.length === 0 ? undefined : out;
}

/** Build the chat body one Responses request becomes. */
export function responsesToChatBody(body) {
	const chat = {
		model: body.model,
		messages: inputToMessages(body.input, body.instructions),
		max_tokens: body.max_output_tokens ?? body.max_tokens,
		temperature: body.temperature,
		top_p: body.top_p,
		stream: true
	};
	const tools = toolsToChat(body.tools);
	if (tools !== undefined) {
		chat.tools = tools;
		chat.tool_choice = body.tool_choice ?? "auto";
	}
	for (const key of Object.keys(chat)) if (chat[key] === undefined) delete chat[key];
	return chat;
```

</details>

**依据 3 · 作者声明**：[README.md:285-300](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/README.md#L285-L300)

作者强调本人账号和条款。

<details>
<summary>查看原文（16行）</summary>

```text
## 安全须知

- 插件只**读取**本机桌面端已经存在的登录态，**不发起**任何登录流程。卡片内扫码是**可选操作**，只在明确点击后打开，走的是桌面客户端自己的接口，**没有绕过任何鉴权**，消耗的是你自己的账号与积分。
- 令牌只在**本机内存与回环 shim** 之间传递，卡片上显示的账号一律脱敏。
- shim 只绑 `127.0.0.1`，强制回环来源校验。
- **管理接口的写操作要求 JSON 请求体**：跨站页面发不出 JSON POST（预检不被批准），
  而它发得出的表单 POST 无法声明 `application/json` —— 所以本机的账号启停、冷却清除、
  插件自更新等操作不会被网页越权调用。
- **二维码内容经过净化**：上游返回的登录二维码先按 SVG 解析并剥掉 `script` / `on*` /
  `href` 等可执行部分才注入 DOM，不直接信任上游返回的标记。

---

## 免责声明

本项目**仅供个人学习和研究使用**，仅驱动使用者自己的账号在本机调用。请遵守 WorkBuddy 的服务条款；因使用本项目产生的任何后果由使用者自行承担。
```

</details>

#### 缺口

- 真实客户端任务成功、额度成本和服务条件未独立核实
  **影响**：不能普遍推荐持续安装或生产代理
  **进一步探讨**：本人隔离账号先跑完整工具闭环与成本记录

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
