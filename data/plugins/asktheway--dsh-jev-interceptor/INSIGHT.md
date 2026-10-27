# dsh-jev-interceptor

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[7d98ee7](https://github.com/AskTheWay/dsh-jev-interceptor/tree/7d98ee78ca2e9417894ceb2a00903d67f8f84b12)

<!-- BEGIN META -->
[![GitHub ★ 31](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=31&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AskTheWay/dsh-jev-interceptor) [![npm 30d 2,667](https://img.shields.io/static/v1?label=npm+30d&message=2%2C667&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-jev-interceptor) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-jev-interceptor)
<!-- END META -->

> **实现功能**：为 DSH 工具调用提供 Jev 风险判断、审批辅助、语义会话保留与决策遥测。

> **核心亮点**：核心贡献是把 typed decision fan-out 接入 DSH 多个决策点，并用 delegate、同会话 callId 证据绑定、空白名单和按价值保留限制权限与信息损失；贡献在宿主编排而非 Jev 模型原创，效果优势尚未实测。详见[Q03](#research-q03)。

> **风险与缺陷**：确认缺陷是图像卸载 listener 在 shadow 模式也可能直接追加磁盘不可逆的 `image/offload` 事件；该能力虽默认关闭，但开启后会违反“shadow 只记录”的核心承诺。详见[Q04](#research-q04)。

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
  - [Q01 · 谁在什么任务中会反复需要该插件，原有办法与合格结果是什么？](#detail-section-11)
  - [Q02 · 风险判断、预批准、语义保留和停滞提醒如何接入宿主并形成数据流？](#detail-section-12)
  - [Q03 · 相比原生 waterfall、生成式 auto-review 和 FIFO 保留，源码可确认的增量是什么？](#detail-section-13)
  - [Q04 · 哪个缺陷或前提最可能使 shadow 只观察、不干预的核心承诺失效？](#detail-section-14)
  - [Q05 · 启动、持续生效和失败恢复依赖什么，操作负担由谁承担？](#detail-section-15)
  - [Q06 · 一次合格决策的效果与总成本可确认到什么程度？](#detail-section-16)
  - [Q07 · 实现是否可靠且可维护，哪些设计可借鉴、移植要付出什么？](#detail-section-17)
  - [Q08 · 从现有贡献与 shadow 缺口可推导什么新设计，如何证伪？](#detail-section-18)
  - [Q09 · 对哪些人值得观察或试用，采用条件、成功与停止标准是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合在隔离 DSH profile 中频繁调用工具、愿意审阅 shadow 遥测并逐步校准的开发者；需要把每次外部写入都保持纯人工确认，或不能向外部服务发送有界参数摘要时不适用。详见[Q01](#research-q01)。

作者给出的直接基线是 DSH pre-execute 默认 allow、experimental/auto-review 的生成式 LLM 分类，以及 session-reference 的 FIFO 丢弃和最长优先截断；本轮只将这些作为作者声明，未独立核查相同 DSH 提交或做同任务效果排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 工具调用 guard | 分类风险、不可逆性、任务匹配与注入嫌疑，映射为 delegate/ask/deny | 需启用主 row 与 provider；只读/排除工具短路；源码检查不等于分类准确 |
| 证据门控预批准 | 对已有明确授权且可逆的白名单工具返回一次性批准 | 默认白名单为空；需同会话 callId、工具匹配和新鲜参数摘要；guard 自身升级永不自动批 |
| 语义会话保留 | 在引用会话字节预算内按任务价值优先保留消息 | 独立 row 默认关闭；依赖 sessionQuery 和上游 resolver；先 shadow 再 enforce |
| 停滞提醒 | 识别同一工具换参数连续失败并向 Agent 注入换路提醒 | 默认关闭；双问题高置信且 enforce 才注入，不否决工具结果 |
| 图像卸载预规划 | 高 token 压力时对候选图打分并提前 offload | 默认关闭；当前 shadow 也可能产生不可逆事件，修复前不应启用 |
| 遥测、校准与影响归因 | 保存概率、延迟、token、成本和批准一致性，生成统计与阈值建议 | 本地 JSONL best-effort 写入；写失败不阻止动作，作者数据不是本轮实测 |
| Web 控制面与 9 个命令 | 查看状态、日志、统计、校准、归因并切换开关/模式 | UI 依赖 connection/settings/client 服务；持久化失败时可能仅本次运行生效 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node.js >=20.3 与兼容 DSH/Cordis API | 安装必需 | 加载 bundle、事件、命令、设置与 session 服务 | 可能无法加载；版本矩阵未知 |
| TypeSafe、OpenRouter 或自定义 decisions endpoint | 分类必需 | 回答 typed decision questions | 多数挂点降级为 stock；可用性和数据政策未知 |
| API key/credential seam | 分类必需 | 认证 provider 请求 | JevClient 记录 no-key 降级并回到 stock |
| settings/connection/client 注入 | 控制面需要 | 设置持久化、Web panel 与 API | 部分设置仅内存生效或无 UI |
| sessionQuery 与 web-app 的上游 session row | 语义引用需要 | 读取会话并替换 FIFO 保留 | 评分或接管不可用；单关替代 row 会留下空缺 |
| 人工审阅 shadow 遥测 | 效果依赖 | 校准阈值并决定是否 enforce | 不能把分类结果安全升级为执行策略 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户安装 bundle，核对 Node/DSH 版本，配置 provider 与 key | 插件可加载；无 key 时确认回到 stock |
| 安全起点 | 保持主 row 为 shadow、图像卸载关闭、预批白名单为空 | 工具行为与 stock 相同，只有审计数据增加 |
| 观察 | 用户运行正常任务并查看 stats/log/calibrate/impact | 记录可回指 callId、延迟、分数与人工决定 |
| 有限试用 | 仅对可逆、可重建工具逐项加入白名单；session retention 单独 shadow 后 enforce | 每类动作通过预设成功与停止标准 |
| 故障恢复 | 关闭能力或整个 bundle，等待 cooldown 并核对原生 row | provider 故障回到 stock；session-reference 恢复存在 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 外部 Jev provider/API key；金额与免费额度未独立核实 | 安装、配置、shadow 观察、阈值与白名单审读；耗时未知 | Node/DSH 兼容矩阵与 provider 数据政策未知 |
| 持续使用 | 未短路调用的网络、token 与本地 JSONL 存储 | 处理 ask/deny、查看日志和校准；频率未知 | 缓存、只读短路和并发上限可限制部分成本 |
| 失败恢复 | provider 重试、cooldown 与回到 stock 后的重复审批 | 诊断服务、核对丢失遥测与 session row 恢复 | 分类失败通常降级；遥测写失败会被吞掉 |
| 升级或退出 | 迁移成本未知 | DSH alpha API 变化时重验；禁用 session 接管需关闭整个 bundle | 单独关闭替代 row 会留下功能空缺 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 工具风险分流 | 源码实现 typed 风险、不可逆、任务匹配与注入问题，并映射 delegate/ask/deny | 分类准确率、漏拦截、误拦截与真实安全收益 |
| 证据门控预批 | 源码要求白名单、同会话 callId、工具匹配和新鲜参数摘要 | 是否实际减少审批点击；作者 dogfood 明确为 0/0 样本 |
| 会话信息保留 | 源码在固定字节预算内按消息价值选择丢弃和截断 | 最终任务质量是否优于 FIFO |
| 成本与延迟 | 源码记录 token、成本和延迟，作者提供一组 dogfood 数据 | 同条件基线、真实账单和单位合格任务成本 |
| shadow 安全 | guard、preapprove、retention、stagnation 各有模式门 | 图像卸载分支已确认不满足全局 shadow 承诺 |

> **思考**：确认缺陷是图像卸载 listener 在 shadow 模式也可能直接追加磁盘不可逆的 `image/offload` 事件；该能力虽默认关闭，但开启后会违反“shadow 只记录”的核心承诺。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：核心贡献是把 typed decision fan-out 接入 DSH 多个决策点，并用 delegate、同会话 callId 证据绑定、空白名单和按价值保留限制权限与信息损失；贡献在宿主编排而非 Jev 模型原创，效果优势尚未实测。详见[Q03](#research-q03)。

核心贡献是把 typed decision fan-out 接入 DSH 多个决策点，并用 delegate、同会话 callId 证据绑定、空白名单和按价值保留限制权限与信息损失；贡献在宿主编排而非 Jev 模型原创，效果优势尚未实测。详见[Q03](#research-q03)。

纯决策矩阵、fail-delegate、PendingAsks 的 session/call/tool/新鲜度绑定、集中式重试/冷却/并发/LRU，以及串行 best-effort 遥测值得复用。主要代价是对多项 DSH alpha API 和私有 resolver renderer 的耦合，且分散的 mode 门已在图像卸载形成确认遗漏。移植时应优先建立统一 effect gate 和跨模式契约测试。详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

确认缺陷是图像卸载 listener 在 shadow 模式也可能直接追加磁盘不可逆的 `image/offload` 事件；该能力虽默认关闭，但开启后会违反“shadow 只记录”的核心承诺。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议只在隔离 profile 试用。保持 `imageOffloadEnabled: false`、预批白名单为空和主插件 shadow，先验证所有挂点零状态变化与故障回到 stock；再对可逆、可重建工具逐项扩范围。任何 shadow 副作用、无遥测有效动作或 session-reference 缺失都应停止。详见[Q09](#research-q09)。

采用建议：建议只在隔离 profile 试用。保持 `imageOffloadEnabled: false`、预批白名单为空和主插件 shadow，先验证所有挂点零状态变化与故障回到 stock；再对可逆、可重建工具逐项扩范围。任何 shadow 副作用、无遥测有效动作或 session-reference 缺失都应停止。详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持保守的 guard/preapprove 组合、语义会话保留、停滞提醒、遥测与校准。性能、成本和真实安全效果仍是作者声明或机制推断；本轮确认图像卸载 opt-in 在 shadow 下缺少 enforce 门，因此全局 shadow 不干预承诺不能覆盖该分支。未来 effect gate 仅为未验证设计假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.ts、src/config.ts、src/guard.ts、src/matrix.ts、src/preapprove.ts、src/jev.ts、src/session-reference.ts、src/retention.ts、src/stagnation.ts、src/image-offload.ts、src/telemetry.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 README.md、package.json、cordis.patch.yml、核心 TypeScript 源码、准备材料及完整组件 inventory；未安装、未运行目标代码或测试，未访问真实 DSH Host、Jev provider 或用户遥测。作者给出的性能、价格、dogfood 与测试数量未作为本轮执行证据。
- 下一步：最小可证伪验证应先补图像卸载跨模式契约：在临时会话中触发 token 压力，枚举 disabled、shadow、enforce 与 provider 成功/失败，比较事件日志、磁盘对象和会话状态哈希。shadow 出现任何非遥测状态变化即失败；随后再对全部挂点运行同一动作矩阵，并以真实 Host 记录误拦截、漏拦截、人工分钟、合格交付和总成本。

**分析版本**

- **仓库**：[AskTheWay/dsh-jev-interceptor](https://github.com/AskTheWay/dsh-jev-interceptor)
- **版本号**：0.6.0（[固定提交 7d98ee7](https://github.com/AskTheWay/dsh-jev-interceptor/tree/7d98ee78ca2e9417894ceb2a00903d67f8f84b12)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是由 Host 提供统一 effect gate，让所有模型建议动作携带 mode、provenance、evidence 与 reversible，并在单一副作用边界强制 shadow 只记录；动作矩阵中任何 shadow 状态变化都应否定实现。详见[Q08](#research-q08)。

最小可证伪验证应先补图像卸载跨模式契约：在临时会话中触发 token 压力，枚举 disabled、shadow、enforce 与 provider 成功/失败，比较事件日志、磁盘对象和会话状态哈希。shadow 出现任何非遥测状态变化即失败；随后再对全部挂点运行同一动作矩阵，并以真实 Host 记录误拦截、漏拦截、人工分钟、合格交付和总成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 634 | — | — | 9126 |
| .mjs | source | 4 | 357 | 317 | 27 | — |
| .ts | source | 22 | 5813 | 4079 | 1395 | — |
| .js | source | 1 | 219 | 158 | 36 | — |
| .tsx | source | 2 | 1390 | 1252 | 59 | — |
| .ts | test | 14 | 2293 | 2015 | 93 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/AskTheWay/dsh-jev-interceptor/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/AskTheWay/dsh-jev-interceptor/issues?q=is%3Aissue+created%3A2026-09-24T08%3A19%3A16.810Z..2026-10-24T08%3A19%3A16.810Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/AskTheWay/dsh-jev-interceptor/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-24T08%3A19%3A16.810Z..2026-10-24T08%3A19%3A16.810Z)



统计日期：2026-10-24。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本是否以可审计、可降级的 System-1 分类机制改善 DSH 的工具审批与上下文保留，同时不会在观察模式或故障路径中引入新的行为风险？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在什么任务中会反复需要该插件，原有办法与合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

作者面向经常让 DSH Agent 调用有副作用工具、又希望减少逐次审批摩擦的开发者，以及频繁通过 @session 引用旧会话而受字节预算影响的用户。作者给出的基线分别是原生 pre-execute 默认放行或生成式 auto-review，以及 session-reference 的 FIFO 丢弃。源码确认插件确有工具前置判断、预批准、语义保留、停滞提醒和观测入口，但本轮未运行真实任务，不能确认它比人工审批、固定规则或原生 FIFO 更快、更准。合格结果至少应满足低风险调用不绕过其他监听器，高风险或疑似注入调用升级或拒绝，预批准只发生在已有用户授权、可逆且有新鲜参数证据时，引用会话仍遵守字节预算，shadow 不产生行为变化，服务失败回到原生路径并留下可审计记录。偶发工具调用、不能向外部分类服务发送参数摘要或无法承担配置与复核的人群不适合直接采用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-30](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/README.md#L18-L30)

作者描述工具审批场景、原生与生成式 auto-review 基线及预期决策形态；性能表仍是作者声明。

<details>
<summary>查看原文（13行）</summary>

```text
**What it does, in one breath:** before a tool call runs, Jev classifies its risk, irreversibility, task-fit, and injection-suspicion in one ~$0.00002 request — confident high-risk calls get denied, medium ones escalate to a human, and clearly-granted reversible ones stop wasting your clicks on approval dialogs. And when an `@session` snapshot gets injected, Jev scores every message's value for the citing task so the **error traceback survives the byte budget instead of the oldest small talk**. Every doubt, every timeout, every missing key degrades to stock dsh behavior. Nothing to configure away, nothing that can widen a permission.

## Why this exists

dsh ships **zero per-call risk classification** — the pre-execute waterfall's default is a bare `allow`. Its only built-in precedent, `experimental/auto-review`, does the classification with a *generative* LLM: one full model request per tool call, temperature 0, hand-rolled JSON text protocol, self-described as slow, expensive, and experimental. That's a System-2 scribe doing a System-1 reflex's job:

| | auto-review (generative LLM) | dsh-jev-interceptor (Jev) |
|---|---|---|
| Decision shape | emits JSON token-by-token, then parses it and prays | typed `choice`/`noul` answers — type errors are structurally impossible |
| Cost per call | one **full LLM request** | **~$0.00002** (measured: 501 input tokens) |
| Latency | seconds | ~100ms provider-side (TypeSafe-reported p50); ~1s end-to-end from outside US-West |
| Uncertainty | buried in prose | per-question probability distributions + calibrated confidence |
| Failure path | parse fallback → deny | low confidence → `next()` — **it never guesses** |
```

</details>

**依据 2 · 作者声明**：[README.md:36-42](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/README.md#L36-L42)

作者描述 @session 的 FIFO 信息损失和语义保留目标，并将 shadow 定义为反事实观察。

```text
## The FIFO pain point nobody talks about

When you `@`-mention a past session in dsh, the harness injects a bounded snapshot of it — and when that snapshot exceeds its byte budget, it drops messages **oldest-first**. Pure FIFO. Zero semantics. The bug report you pasted at the top of the session and the three-line question that started it all? Dropped first. The "thanks!" and "ok, continue"? Kept — they were newer.

dsh's own retention code is honest about it: drop the oldest, then truncate the longest, done. This plugin's `jev-session-reference` row takes that decision over (by subclassing the upstream resolver, so `@`-completion, budgets, spill, and cancellation stay inherited): one Jev fan-out scores each droppable message — *noise / background / relevant / critical* — and the drop order becomes **least valuable first**, with truncation cutting padding before substance. Checkpoints and the newest message stay protected exactly as upstream; the byte budget is honored exactly as upstream; and with `sessionReferenceEnabled: false` (the default) the row renders **byte-for-byte like stock**.

In shadow mode you get the receipts before trusting it: every injection logs the counterfactual — which messages FIFO dropped that scoring would have kept — then flip to `enforce`.
```

**依据 3 · 源码核查**：[src/config.ts:121-155](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/config.ts#L121-L155)

源码默认停用插件、采用 shadow、留空预批白名单，并将停滞检测等能力设为 opt-in。

<details>
<summary>查看原文（35行）</summary>

```text
export const DEFAULTS = {
  enabled: false,
  mode: 'shadow' as const,
  provider: 'typesafe' as const,
  apiKeyEnv: 'TYPESAFE_API_KEY',
  timeoutMs: 1500,
  cooldownMs: 60_000,
  failureThreshold: 3,
  maxConcurrency: 4,
  cacheSize: 512,
  recentMessages: 6,
  preapproveRecentMessages: 3,
  recentMessageChars: 300,
  argsHeadChars: 2048,
  argsTailChars: 512,
  guardEnabled: true,
  guardReadOnlyTools: [...DEFAULT_READ_ONLY_TOOLS],
  guardExcludeTools: [] as string[],
  guardConfidenceMin: 0.6,
  guardDenyConfidence: 0.85,
  guardIrreversibleCeiling: 0.2,
  guardIrreversibleDenyFloor: 0.5,
  guardInjectionAskThreshold: 0.8,
  preapproveEnabled: true,
  preapproveToolAllowlist: [] as string[],
  preapproveAutoApproveMin: 0.85,
  preapproveIrreversibleMax: 0.15,
  preapproveInjectionSuspectMax: 0.5,
  stagnationEnabled: false,
  stagnationWindow: 8,
  stagnationTriggerCount: 4,
  stagnationFailureRatioMin: 0.75,
  stagnationConfidenceMin: 0.85,
  stagnationCooldownMs: 300_000,
  stagnationArgsPreviewChars: 160,
```

</details>

#### 缺口

- 缺少同任务、同宿主、同预算的人工审批、auto-review 与 FIFO 对照
  **影响**：不能判断端到端收益、误拦截、漏拦截或信息保留改善
  **进一步探讨**：在隔离 profile 记录每任务完成时间、人工点击、误拦截、漏拦截和引用信息保留率

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 风险判断、预批准、语义保留和停滞提醒如何接入宿主并形成数据流？

**研究主题**：功能与机制

#### 完整回答

主插件在 apply 中创建共享 Jev 客户端、遥测、待审批参数证据和批准追踪，再注册 tools/pre-execute、approval/request、agent/pre-step、tools/post-execute、session/event 等监听器。guard 对非只读、非排除工具提取有界参数首尾和最近消息，向 Jev 一次 fan-out 询问风险、不可逆性、任务匹配和注入嫌疑，再由纯决策矩阵映射为 delegate、ask 或 deny；shadow 始终走 next。guard 的 ask/deny 同时把会话、callId、工具和参数摘要存入有界 PendingAsks。预批准只有在白名单命中、callId 对应的新鲜证据存在且不是同插件 guard 的升级时，才再次分类授权范围、可逆性和注入嫌疑；enforce 且通过才返回 allowed-once。会话引用由 bundle 禁用原 row、挂载同服务名子类；启用后 prepare 评分可丢弃消息，enforce 用低分优先丢弃，shadow 调用上游 renderer 并记录反事实。停滞检测先用数值门，再分类无进展与同类失败，只有 enforce 注入提醒。共享客户端对缺 key、冷却、超时、HTTP 或响应解析错误返回 null，多数调用方回到原生路径；遥测写入本地 JSONL。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:278-319](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/index.ts#L278-L319)

入口注册 guard 与 preapprove 监听器并传入共享客户端、阈值、遥测及 PendingAsks。

<details>
<summary>查看原文（42行）</summary>

```text
  // Optional seams resolved defensively: the plugin loads in every profile.

  if (settings.guardEnabled) {
    ctx.on('tools/pre-execute', createGuardListener({
      readOnlyTools: settings.readOnlyTools,
      excludeTools: settings.excludeTools,
      thresholds: {
        confidenceMin: settings.guardConfidenceMin,
        denyConfidence: settings.guardDenyConfidence,
        irreversibleCeiling: settings.guardIrreversibleCeiling,
        irreversibleDenyFloor: settings.guardIrreversibleDenyFloor,
        injectionAskThreshold: settings.guardInjectionAskThreshold,
      },
      recentMessages: settings.recentMessages,
      recentMessageChars: settings.recentMessageChars,
      argsHeadChars: settings.argsHeadChars,
      argsTailChars: settings.argsTailChars,
      jev,
      telemetry,
      pendingAsks,
      live,
      // Resolved per event: a capture here could miss a service that activates later.
      permissionPresets: () => ctx.get('permissionPresets'),
    }))
  }

  if (settings.preapproveEnabled) {
    ctx.on('approval/request', createPreapproveListener({
      allowlist: settings.preapproveToolAllowlist,
      thresholds: {
        autoApproveMin: settings.preapproveAutoApproveMin,
        irreversibleMax: settings.preapproveIrreversibleMax,
        injectionSuspectMax: settings.preapproveInjectionSuspectMax,
      },
      recentMessages: settings.preapproveRecentMessages,
      recentMessageChars: settings.recentMessageChars,
      jev,
      telemetry,
      pendingAsks,
      live,
      trace: approvalTrace,
    }), { prepend: true })
```

</details>

**依据 2 · 源码核查**：[src/guard.ts:230-247](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/guard.ts#L230-L247)

guard 将工具名、有界参数摘要、最近消息和 cwd 作为 state，并绑定会话与 callId 发起分类。

<details>
<summary>查看原文（18行）</summary>

```text
  const session = exec.agent.session
  const state = {
    tool: exec.name,
    args_preview: headTailPreview(canonicalArguments(exec.arguments), deps.argsHeadChars, deps.argsTailChars),
    recent: digestRecent(session.deriveMessages(), deps.recentMessages, deps.recentMessageChars),
    cwd: session.header.cwd ?? '',
  }

  const answers = await deps.jev.classify({
    tag: 'guard',
    mode: live.mode,
    tool: exec.name,
    sessionId: session.id,
    callId: exec.callId,
    state,
    questions: GUARD_QUESTIONS,
    signal: exec.signal,
  })
```

</details>

**依据 3 · 源码核查**：[src/preapprove.ts:92-116](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/preapprove.ts#L92-L116)

预批准先排除 guard 自身升级和非白名单工具，且只有 enforce 的 auto-approve 返回 allowed-once。

<details>
<summary>查看原文（25行）</summary>

```text
export function createPreapproveListener(
  deps: PreapproveDeps,
): (req: ApprovalRequestEvent, next: () => Promise<ApprovalOutcome>) => Promise<ApprovalOutcome> {
  return async (req, next) => {
    const live = deps.live()
    if (!live.enabled) return next()
    // Our guard's escalation is a request FOR the human; auto-approving it would defeat the guard.
    if (req.reason !== undefined && req.reason.startsWith('jev-guard:')) return next()
    if (!deps.allowlist.has(req.toolName)) return next()

    let verdict: PreapproveVerdict | undefined
    try {
      verdict = await evaluatePreapprove(deps, live, req)
    } catch {
      // Our own failure must land on the human answerer; next() errors are not ours to swallow.
      verdict = undefined
    }
    deps.trace?.noteVerdict(
      req.agent.session.id,
      req.callId === undefined ? undefined : String(req.callId),
      verdict === undefined ? 'not-evaluated' : verdict.kind,
    )
    if (verdict === undefined) return next()
    if (live.mode === 'enforce' && verdict.kind === 'auto-approve') return 'allowed-once'
    return next()
```

</details>

**依据 4 · 源码核查**：[src/session-reference.ts:372-415](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/session-reference.ts#L372-L415)

会话保留有分数时按 mode 选择评分结果或上游渲染，无分数回退上游。

<details>
<summary>查看原文（44行）</summary>

```text
  /** Render with scores where available; delegate to the inherited renderer otherwise. */
  private renderScored(
    upstream: (sources: readonly PreparedSourceLike[], maxReferenceBytes: number) => RenderedSourceLike[],
    sources: readonly PreparedSourceLike[],
    maxReferenceBytes: number,
  ): RenderedSourceLike[] {
    if (this.scoring === undefined) return upstream(sources, maxReferenceBytes)
    const rendered: RenderedSourceLike[] = []
    for (const source of sources) {
      const scores = this.scoreCache.get(cacheKey(source.input.sessionId, source.snapshot))
      if (scores === undefined) {
        rendered.push(...upstream([source], maxReferenceBytes))
        continue
      }
      // The scored selection (drop policy driven by value scores). CJK-heavy
      // snapshots widen the protection band: mid-band scores vary more in
      // CJK (measured), so protect strictly-above 0.5 instead of the Latin
      // default 0.6 — fewer ambiguous messages sacrificed to the budget.
      const projected = projectConversation(source.snapshot)
      const cjkShare = cjkRatio(projected.map(item => item.text).join(''))
      const protectAbove = cjkShare >= 0.3
        ? 0.5
        : 0.6
      const scored = retainScoredSession(source.snapshot, source.input.label, maxReferenceBytes, scores, { protectAbove })
      if (scored === undefined) {
        // Scoring cannot resize past what FIFO could; upstream raises the same error.
        rendered.push(...upstream([source], maxReferenceBytes))
        continue
      }
      // The FIFO counterfactual is computed once per source and shared with
      // the comparison record; when it cannot fit, the comparison is simply
      // skipped (upstream would raise the same budget error anyway).
      const fifo = retainScoredSession(source.snapshot, source.input.label, maxReferenceBytes, null)
      if (this.scoring.mode === 'enforce') {
        if (fifo !== undefined) this.recordComparison(source, scored, fifo, scores)
        rendered.push({ ...scored, capturedFormatVersion: source.snapshot.session.version })
        continue
      }
      // Shadow: the real render stays the upstream bytes; the scored selection
      // is only the recorded counterfactual.
      const upstreamRendered = upstream([source], maxReferenceBytes)
      if (fifo !== undefined) this.recordComparison(source, scored, fifo, scores)
      rendered.push(...upstreamRendered)
    }
```

</details>

**依据 5 · 源码核查**：[src/jev.ts:151-178](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/jev.ts#L151-L178)

客户端先解析 key、冷却、缓存和并发许可，任何未满足条件均返回降级。

<details>
<summary>查看原文（28行）</summary>

```text
    const key = await this.resolveKey()
    if (key === undefined || key.length === 0) return degrade('no-key')
    if (this.gate.open()) return degrade('cooldown')

    const cacheKey = createHash('sha256')
      .update(JSON.stringify([this.model, call.state, call.questions]))
      .digest('hex')
    const hit = this.cache.get(cacheKey)
    if (hit !== undefined) {
      // A hit reuses the ANSWERS only: usage and latency belong to the
      // original billable call, so recording them again would multiply the
      // reported token count and cost by every reuse.
      return {
        answers: hit.answers,
        model: hit.model,
        latencyMs: 0,
        inputTokens: undefined,
        costUsd: undefined,
        cached: true,
      }
    }

    if (call.signal?.aborted) return degrade('aborted')
    const acquired = await this.semaphore.acquire(
      call.signal ?? new AbortController().signal,
      this.timeoutMs - (this.now() - started),
    )
    if (acquired !== 'acquired') return degrade(acquired === 'aborted' ? 'aborted' : 'timeout')
```

</details>

#### 缺口

- 宿主事件顺序、waterfall 组合和 bundle 覆盖在目标 DSH 上未运行确认
  **影响**：完整源码链路不能直接等同为真实挂载和行为可用
  **进一步探讨**：对每个事件记录上游、本插件、下游监听器顺序及最终决策

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比原生 waterfall、生成式 auto-review 和 FIFO 保留，源码可确认的增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

研究者可确认的技术增量不是分类模型本身，而是把外部 typed decision API 嵌入多个 DSH 决策点，并用保守组合规则约束权限。最有价值的部分是 guard 永不返回 allow，低置信或故障均 delegate；预批准必须绑定同会话、同 callId、同工具的新鲜参数证据，且明确拒绝自动批准本插件自己的高风险升级；会话保留在继承原 resolver 的同时，把消息价值评分转换为低价值优先丢弃和按价值截断；影子遥测、校准和批准结果相关性形成从观察到阈值调整的闭环。这些属于宿主接线、证据绑定和决策编排的增量，Jev 模型及 DSH 原始 hook/resolver 不归插件原创。作者声称更便宜、更快且为生态首个 System-1 插件；本轮未核查全生态、供应商基准或同条件效果，所以不确认首个、200 倍/400 倍或收益排名。源码能支持机制差异，不能支持准确率、端到端节时或真实安全提升。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-34](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/README.md#L22-L34)

作者给出原生/auto-review 参照及性能、首创主张；这些主张没有被本轮独立验证。

<details>
<summary>查看原文（13行）</summary>

```text
dsh ships **zero per-call risk classification** — the pre-execute waterfall's default is a bare `allow`. Its only built-in precedent, `experimental/auto-review`, does the classification with a *generative* LLM: one full model request per tool call, temperature 0, hand-rolled JSON text protocol, self-described as slow, expensive, and experimental. That's a System-2 scribe doing a System-1 reflex's job:

| | auto-review (generative LLM) | dsh-jev-interceptor (Jev) |
|---|---|---|
| Decision shape | emits JSON token-by-token, then parses it and prays | typed `choice`/`noul` answers — type errors are structurally impossible |
| Cost per call | one **full LLM request** | **~$0.00002** (measured: 501 input tokens) |
| Latency | seconds | ~100ms provider-side (TypeSafe-reported p50); ~1s end-to-end from outside US-West |
| Uncertainty | buried in prose | per-question probability distributions + calibrated confidence |
| Failure path | parse fallback → deny | low confidence → `next()` — **it never guesses** |

Jev's maker TypeSafe reports up to **200× faster / 400× cheaper** than LLMs on classification workflows — and this plugin is that number, landed in a real agent harness, with receipts in `/jev-stats`.

We believe this is the **first System-1 decision plugin in the dsh ecosystem**. The full map of where decision models fit in dsh — this plugin's two hooks plus eleven more verified hooks (semantic model routing, context-retention scoring, image-offload pre-planning, worker-report verification...) — is in [docs/jev-usage-points.md](docs/jev-usage-points.md).
```

</details>

**依据 2 · 源码核查**：[src/matrix.ts:79-118](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/matrix.ts#L79-L118)

纯矩阵只产生 delegate、ask、deny，低置信不会直接执行放行。

<details>
<summary>查看原文（40行）</summary>

```text
export function decideGuard(answers: GuardAnswers, thresholds: GuardThresholds): GuardAction {
  const { risk, irreversible, injectionSuspect } = answers
  // 证据摘要统一附在中文结论后；reason 行首的 `jev-guard:` 前缀是安全协议
  // （preapprove 靠它识别并跳过本插件的升级，绝不自动批 guard 的 ask），不可移除。
  const evidence = guardEvidence(answers)
  if (injectionSuspect.noul >= thresholds.injectionAskThreshold) {
    return {
      kind: 'ask',
      reason: `jev-guard: 工具输入疑似提示注入，升级人工确认（${evidence}）`,
    }
  }
  if (risk.choice === 'high') {
    if (risk.confidence >= thresholds.denyConfidence && irreversible.noul >= thresholds.irreversibleDenyFloor) {
      return {
        kind: 'deny',
        reason: `jev-guard: 高风险且不可逆，已拦截（${evidence}）`,
      }
    }
    return {
      kind: 'ask',
      reason: `jev-guard: 高风险调用，需人工确认（${evidence}）`,
    }
  }
  if (risk.choice === 'medium') {
    if (risk.confidence < thresholds.confidenceMin) return { kind: 'delegate' }
    return {
      kind: 'ask',
      reason: `jev-guard: 中风险调用，需人工确认（${evidence}）`,
    }
  }
  // risk.choice === 'low': low confidence never acts either — it delegates to
  // stock behavior rather than escalating on a guess. Only NEW adverse
  // evidence (irreversibility) escalates a low-risk classification.
  if (irreversible.noul >= thresholds.irreversibleCeiling) {
    return {
      kind: 'ask',
      reason: `jev-guard: 风险低但可能不可逆，需人工确认（${evidence}）`,
    }
  }
  return { kind: 'delegate' }
```

</details>

**依据 3 · 源码核查**：[src/preapprove.ts:125-155](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/preapprove.ts#L125-L155)

预批准要求 callId 和匹配的新鲜 PendingAsks，再把参数摘要与最近消息送入分类。

<details>
<summary>查看原文（31行）</summary>

```text
async function evaluatePreapprove(
  deps: PreapproveDeps,
  live: LiveSettings,
  req: ApprovalRequestEvent,
): Promise<PreapproveVerdict | undefined> {
  const session = req.agent.session
  // Without captured arguments the only grant evidence left is the model's
  // own ask reason; judge that for a human, never for an auto-approval.
  if (req.callId === undefined) return undefined
  const pending = deps.pendingAsks.take(session.id, req.callId, req.toolName)
  if (pending === undefined) return undefined

  const state = {
    tool: req.toolName,
    ask_reason: req.reason ?? '',
    args_preview: pending.argsPreview,
    recent: digestRecent(session.deriveMessages(), deps.recentMessages, deps.recentMessageChars),
    cwd: session.header.cwd ?? '',
  }

  const result = await deps.jev.classify({
    tag: 'preapprove',
    mode: live.mode,
    tool: req.toolName,
    sessionId: session.id,
    callId: req.callId === undefined ? undefined : String(req.callId),
    state,
    questions: PREAPPROVE_QUESTIONS,
    signal: req.signal,
  })
  if (result === null) return undefined
```

</details>

**依据 4 · 源码核查**：[src/retention.ts:159-180](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/retention.ts#L159-L180)

评分保留将 FIFO 改为低分优先丢弃，未评分消息以中性分回退到 FIFO 次序。

<details>
<summary>查看原文（22行）</summary>

```text
  // Phase 1 — drop whole messages until the preview fits. Upstream drops the
  // first droppable (FIFO); scored mode drops the LOWEST-SCORED droppable,
  // oldest first on ties (so unscored items degrade back to FIFO order).
  // Scores are keyed by ORIGINAL projection index; positions shift on every
  // splice, so lookups go through each item's stable `originalIndex`.
  while (size() > maxBytes) {
    const droppable = droppableIndices(retained)
    if (droppable.length === 0) break
    let dropIndex = droppable[0]
    if (scores !== null) {
      // Protection band: never sacrifice a protected message while any
      // lower-scored droppable remains; when everything left is protected
      // the band is exhausted and lowest-score still wins (budget wins).
      const protectAbove = options?.protectAbove
      let bestScore = Number.POSITIVE_INFINITY
      for (const index of droppable) {
        const item = retained[index]
        if (item === undefined) continue
        const score = scores.get(item.originalIndex)
        // Unsourced indices score as neutral; the oldest-first tiebreak keeps
        // behavior FIFO-equivalent among them.
        const value = score === undefined ? 0.5 : score
```

</details>

#### 缺口

- 未独立读取固定版本 DSH 原生 auto-review/session-reference，也未做生态完整检索
  **影响**：限制相对优势、贡献归属和原创性判断
  **进一步探讨**：以同一 DSH 提交建立规则、生成式审核、Jev 与 FIFO 基线并做同任务比较
- 未测分类正确性和最终任务质量
  **影响**：不能把结构差异升级为效果优势
  **进一步探讨**：建立盲标工具调用集与引用会话任务，比较正确决策和最终答案保真度

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪个缺陷或前提最可能使 shadow 只观察、不干预的核心承诺失效？

**研究主题**：缺陷与关键质疑

#### 完整回答

固定源码揭示一个直接破坏 shadow 只记录、不执行任何干预承诺的控制流缺口。imageOffloadEnabled 为 true 时，主入口注册图像卸载 listener；listener 只检查 live.enabled，随后在压力和候选门通过、Jev 给出低价值高置信评分后，直接追加 image/offload 事件，没有检查 live.mode 是否为 enforce。因此 enabled=true、mode=shadow、imageOffloadEnabled=true 时，shadow 仍可能改变会话持久状态。源码注释还明确说 image/offload 在磁盘上不可逆。影响范围受三个条件限制：图像卸载默认关闭；需要 token 压力、足够候选图和成功分类；本轮没有运行宿主，不能声称已实际丢失图像。但一旦用户显式打开该能力，全局 shadow 安全叙述与控制流不一致，足以改变采用建议。另一个结构风险是 bundle 禁用上游 session-reference 并依赖私有同步 renderer 覆盖；作者已说明单独禁用替代 row 会导致无 session-reference，这是已知运维边界。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:50-57](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/README.md#L50-L57)

作者把 shadow 明确定义为只观察、记录每个决策而不执行干预。

````text
```yaml
# in your profile's cordis.patch.yml
- id: jev-interceptor
  name: dsh-jev-interceptor
  config:
    enabled: true
    mode: shadow            # watch mode first: records every decision, enforces nothing
    provider: typesafe      # or 'openrouter' (works today, no waitlist) | 'custom'
````

**依据 2 · 源码核查**：[src/config.ts:85-94](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/config.ts#L85-L94)

图像卸载被标为磁盘不可逆并默认关闭。

<details>
<summary>查看原文（10行）</summary>

```text
  /** Image-offload pre-planning master switch; default off (irreversible on disk). */
  imageOffloadEnabled?: boolean
  /** Token-pressure ratio [0,1] to trigger pre-planning (default 0.75). */
  imageOffloadPressureThreshold?: number
  /** Minimum unoffloaded candidate images to score (default 3). */
  imageOffloadMinCandidates?: number
  /** A message is sacrificial only when its score answer ≤ this (default 0.33). */
  imageOffloadSacrificeScoreMax?: number
  /** Sacrificial probability floor [0,1] (default 0.8). */
  imageOffloadSacrificeProbMin?: number
```

</details>

**依据 3 · 源码核查**：[src/image-offload.ts:73-93](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/image-offload.ts#L73-L93)

listener 只检查 enabled、压力和候选数量，没有检查 enforce 模式。

<details>
<summary>查看原文（21行）</summary>

```text
export function createImageOffloadListener(
  deps: ImageOffloadDeps,
): (payload: { agent: Agent; messages: unknown[]; turn: number; step: number; signal: AbortSignal }, next: () => Promise<PreStepDecision>) => Promise<PreStepDecision> {
  return async (payload, next) => {
    const live = deps.live()
    if (!live.enabled) return next()
    const agent = payload.agent
    const session = agent.session

    // L1: pressure gate — read the token meter's latest measurement.
    const tokenMeter = (session as unknown as { tokenMeter?: { totalTokens: number; contextWindow: number } }).tokenMeter
    if (tokenMeter === undefined) return next()
    const contextWindow = tokenMeter.contextWindow || 0
    if (contextWindow <= 0) return next()
    const pressure = tokenMeter.totalTokens / contextWindow
    if (pressure < deps.pressureThreshold) return next()

    // L2: candidate gate — need enough unoffloaded images to be worth a Jev call.
    const candidates = collectImageCandidates(session)
    const imageCount = candidates.reduce((sum, c) => sum + c.imageIndexes.length, 0)
    if (imageCount < deps.minCandidates) return next()
```

</details>

**依据 4 · 源码核查**：[src/image-offload.ts:148-164](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/image-offload.ts#L148-L164)

满足分类门后直接追加 image/offload 事件，无 shadow 分支。

<details>
<summary>查看原文（17行）</summary>

```text
    if (toOffload.length > 0) {
      // L5: land image/offload events in the exact upstream format.
      for (const target of toOffload) {
        ;(session as unknown as { append: (type: string, data: unknown) => void }).append('image/offload', { targets: [target] })
      }
      deps.telemetry.record({
        ts: new Date().toISOString(),
        tag: 'guard',
        mode: live.mode,
        sessionId: session.id,
        action: 'skipped',
        detail: `image-offload: pre-planned ${toOffload.reduce((s, t) => s + t.imageIndexes.length, 0)} images at pressure ${(pressure * 100).toFixed(0)}%`,
        latencyMs: result.latencyMs,
      })
    }

    return next()
```

</details>

**依据 5 · 源码核查**：[cordis.patch.yml:6-16](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/cordis.patch.yml#L6-L16)

bundle 注释明确替换上游 session-reference 后不能只停用替代 row。

<details>
<summary>查看原文（11行）</summary>

```text
# Rows 2-3 take over the upstream session-reference row by subclassing its
# resolver: the replacement inherits @-mention discovery, the remote
# candidates face, budgets, spill, and cancellation unchanged, and
# `sessionReferenceEnabled: false` (default) renders byte-for-byte like the
# upstream resolver. Correct way to remove this takeover: disable the whole
# bundle layer (setBundleEnabled false), which restores the original row —
# disabling only the jev-session-reference row would leave the original row
# overridden and no session-reference plugin active.
#
# The session-reference override only matches in profiles that stack the
# web-app layer (where the upstream row lives), such as the web and demo
```

</details>

#### 缺口

- 未在真实 Host 复现 shadow 下的事件投影与磁盘结果
  **影响**：影响实际后果严重度，但不改变固定源码中的控制流缺口
  **进一步探讨**：在临时会话放入可丢弃测试图像，分别以 shadow/enforce 触发压力并比较事件日志、磁盘对象和最终消息

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复依赖什么，操作负担由谁承担？

**研究主题**：依赖、兼容与流程

#### 完整回答

安装层要求 Node.js 20.3+、DSH 的 Cordis、commands、credentials、tools、settings、session-reference 等 peer API，以及 web 客户端注入项。核心分类要求 TypeSafe、OpenRouter 或自定义 decisions endpoint 和 API key；无 key、服务故障、超时或解析失败时，JevClient 返回降级，guard、preapprove 和 session scoring 多数回原生行为。工具 guard 还依赖 agent/session、permission preset 和事件 waterfall；语义引用要求 web-app 中上游 session-reference row 可被 bundle 替换，并依赖 sessionQuery。UI 与配置持久化依赖 connection/settings 服务，但失败时部分功能仅内存生效。用户需安装 bundle、保持 shadow、配置 provider/key、查看统计与日志，再决定是否 enforce。预批准还必须显式填写工具白名单；默认空白名单不会自动批准。会话保留与停滞检测分别需要额外 opt-in。失败恢复主要是返回 stock、等待 cooldown、关闭功能或禁用整个 bundle；session-reference 接管不能只关替代 row。外部服务数据策略、key 权限、目标 DSH 版本兼容矩阵和升级迁移没有本轮运行证据。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:48-80](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/package.json#L48-L80)

包声明 Node 版本、bundle/client 接线和多个 DSH peer 依赖。

<details>
<summary>查看原文（33行）</summary>

```text
  "engines": {
    "node": ">=20.3.0"
  },
  "license": "MIT",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-sidebar"
      ]
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/dsh-client-connection": "*",
    "@deepseek-ai/dsh-commands": "*",
    "@deepseek-ai/dsh-compaction": "*",
    "@deepseek-ai/dsh-credentials": "*",
    "@deepseek-ai/dsh-home-paths": "*",
    "@deepseek-ai/dsh-launch-environment": "*",
    "@deepseek-ai/dsh-llm": "*",
    "@deepseek-ai/dsh-output-retention": "*",
    "@deepseek-ai/dsh-session-query": "*",
    "@deepseek-ai/dsh-session-reference": "*",
    "@deepseek-ai/dsh-settings": "*",
    "@deepseek-ai/dsh-tools": "*",
    "@deepseek-ai/dsh-typert-protocol": "*",
    "@deepseek-ai/schemastery": "*"
```

</details>

**依据 2 · 源码核查**：[src/config.ts:121-155](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/config.ts#L121-L155)

默认配置固定 provider、超时、冷却、并发、空预批白名单与若干 opt-in。

<details>
<summary>查看原文（35行）</summary>

```text
export const DEFAULTS = {
  enabled: false,
  mode: 'shadow' as const,
  provider: 'typesafe' as const,
  apiKeyEnv: 'TYPESAFE_API_KEY',
  timeoutMs: 1500,
  cooldownMs: 60_000,
  failureThreshold: 3,
  maxConcurrency: 4,
  cacheSize: 512,
  recentMessages: 6,
  preapproveRecentMessages: 3,
  recentMessageChars: 300,
  argsHeadChars: 2048,
  argsTailChars: 512,
  guardEnabled: true,
  guardReadOnlyTools: [...DEFAULT_READ_ONLY_TOOLS],
  guardExcludeTools: [] as string[],
  guardConfidenceMin: 0.6,
  guardDenyConfidence: 0.85,
  guardIrreversibleCeiling: 0.2,
  guardIrreversibleDenyFloor: 0.5,
  guardInjectionAskThreshold: 0.8,
  preapproveEnabled: true,
  preapproveToolAllowlist: [] as string[],
  preapproveAutoApproveMin: 0.85,
  preapproveIrreversibleMax: 0.15,
  preapproveInjectionSuspectMax: 0.5,
  stagnationEnabled: false,
  stagnationWindow: 8,
  stagnationTriggerCount: 4,
  stagnationFailureRatioMin: 0.75,
  stagnationConfidenceMin: 0.85,
  stagnationCooldownMs: 300_000,
  stagnationArgsPreviewChars: 160,
```

</details>

**依据 3 · 源码核查**：[src/jev.ts:151-197](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/jev.ts#L151-L197)

无 key、冷却、超时、请求和解析错误都通过 null 降级，缓存与 semaphore 限制资源。

<details>
<summary>查看原文（47行）</summary>

```text
    const key = await this.resolveKey()
    if (key === undefined || key.length === 0) return degrade('no-key')
    if (this.gate.open()) return degrade('cooldown')

    const cacheKey = createHash('sha256')
      .update(JSON.stringify([this.model, call.state, call.questions]))
      .digest('hex')
    const hit = this.cache.get(cacheKey)
    if (hit !== undefined) {
      // A hit reuses the ANSWERS only: usage and latency belong to the
      // original billable call, so recording them again would multiply the
      // reported token count and cost by every reuse.
      return {
        answers: hit.answers,
        model: hit.model,
        latencyMs: 0,
        inputTokens: undefined,
        costUsd: undefined,
        cached: true,
      }
    }

    if (call.signal?.aborted) return degrade('aborted')
    const acquired = await this.semaphore.acquire(
      call.signal ?? new AbortController().signal,
      this.timeoutMs - (this.now() - started),
    )
    if (acquired !== 'acquired') return degrade(acquired === 'aborted' ? 'aborted' : 'timeout')
    try {
      const outcome = await this.request(call, key, started)
      if (typeof outcome === 'string') {
        if (outcome === 'caller-aborted') return degrade('aborted')
        if (outcome === 'timeout') this.countFailure('timeout')
        else this.countFailure(outcome)
        return degrade(outcome === 'retryable' ? 'http-error' : outcome)
      }
      this.gate.onSuccess()
      const result: ClassifyResult = {
        ...outcome,
        latencyMs: this.now() - started,
        cached: false,
      }
      this.cache.set(cacheKey, result)
      return result
    } finally {
      this.semaphore.release()
    }
```

</details>

**依据 4 · 作者声明**：[README.md:92-113](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/README.md#L92-L113)

作者说明故障降级、接管禁用方式、遥测和空预批白名单。

<details>
<summary>查看原文（22行）</summary>

```text
## Safety model (the part you should actually read)

- **Never `allow`.** "No objection" is expressed as `next()`, so downstream listeners (external hooks, auto-review) keep their veto.
- **Fail-closed everywhere.** No key / provider cooldown / timeout / parse mismatch / internal error → delegate to stock behavior. The approval service's `never` policy is enforced upstream of every listener, so this plugin structurally cannot relax it.
- **Evidence-gated auto-approval.** `allowed-once` requires captured argument evidence: only a call the guard escalated (fresh pending entry, matching session and tool) can be auto-approved. Hook asks and sandbox escalations carry no arguments and always go to the human.
- **Injection-aware.** Tool arguments enter the Jev `state` data field only; `instructions` are fixed strings; a suspected-injection answer *escalates* rather than suppresses. (Jev's maker acknowledges adversarial inputs can sway classifiers — so denial here is an accelerator, never the last line of defense.)
- **Bounded input.** Head+tail argument previews and trailing-message digests — Jev's own guidance is to filter in code and send only what a question needs.
- **Resilient by construction.** Wall-clock timeout per attempt, single retry on 429/529, cooldown after consecutive failures (timeouts count), concurrency cap, LRU decision cache, queue-bound semaphore. A dead provider costs you zero behavior, not your harness.
- **Takeover rows disable as a layer.** The `jev-session-reference` row replaces the upstream `session-reference` row; toggling only this row off in the Plugins UI would leave *no* session-reference active. Remove the takeover by disabling the whole `dsh-jev-interceptor` bundle layer (`setBundleEnabled(false)`), which restores the upstream row.
- **Explainable enforcement.** Every `ask`/`deny` carries a human-readable reason with the full evidence summary (`jev-guard: 中风险调用，需人工确认（risk=medium 0.72 · irrev=0.30 · inj=0.01）`) straight into the approval card and the denied tool result. The `jev-guard:` prefix is a safety protocol — the pre-approver refuses to auto-approve its sibling's escalations.
- **Observable.** Every decision lands in `<dsh-home>/plugins/dsh-jev-interceptor/telemetry.jsonl` (honoring `$DSH_HOME`), with `callId` correlation and full-precision `scores` for calibration replays; the log rotates at 20 MB. `/jev-stats` aggregates per hook, `/jev-log` shows per-decision detail, and the Web panel charts it all.
- **Calibratable, not guessed.** `/jev-calibrate` replays your shadow telemetry through the *same* decision matrix and suggests threshold moves (±0.05 steps, ≥30 samples for routine moves — ≥10 once a mis-approval danger signal appears, tighten-only; injection thresholds never relaxed, nothing auto-applied).

All of this is enforced by **130 tests**, including adversarial-review regression cases (a concurrency leak that could hang the tool pipeline, cross-session callId collisions, evidence-free auto-approval).

## Configure

Everything is a config field — timeouts, cooldown, concurrency, cache, per-hook thresholds, tool lists — see the `Config` schema in `src/config.ts`. Notable defaults:

- read-only tools (`read`, `read_image`, `grep`, `glob`, `todo_write`) short-circuit with **zero cost**;
- the Auto permission preset is left entirely to `auto-review` (no double review, no double billing);
- the pre-approval allowlist starts **empty** — until you name tools in `preapproveToolAllowlist`, nothing is ever auto-approved.
```

</details>

#### 缺口

- 缺少 DSH 版本矩阵、provider SLA/数据保留条款和自定义 endpoint 兼容测试
  **影响**：影响长期维护、隐私合规和持续可用性判断
  **进一步探讨**：固定 Host 版本并逐服务断连，记录加载、降级和恢复；另核对 provider 数据政策

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 一次合格决策的效果与总成本可确认到什么程度？

**研究主题**：效果与总成本

#### 完整回答

源码支持有界输入、只读工具短路、缓存、并发上限、单次重试、冷却和本地遥测，这些机制能限制请求量与故障传播；它也支持从日志汇总延迟、token、成本和批准一致性。但本轮没有独立运行，无法确认分类正确率、审批点击减少、语义保留提升、实际延迟或单位合格任务成本。作者披露 14 个活跃日、221 次决策及成本/延迟等 dogfood 数据，同时承认预批准路径 0/0 无样本；这些是作者声明，不是本轮执行证据。首次成本包括安装、API key、provider/阈值配置、shadow 观察与人工审读；持续成本包括每个未短路分类请求的网络、token、延迟、本地 JSONL 写入以及人工处理 ask/deny；失败恢复包括 provider 诊断、cooldown 等待、回到 stock 后重新审批，以及核对 shadow 图像卸载风险。现金价格、实际工作量、错误代价和日志增长频率均未知，不能填零或称低成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:82-90](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/README.md#L82-L90)

作者披露 dogfood 样本、成本和延迟，也明确预批准 0/0 无样本。

```text
## Receipts (real usage, not benchmarks)

One month of dogfooding (2026-09-22 → 10-22, 14 active days, 6 sessions, 221 decisions — `/jev-impact` renders this from your own telemetry any time):

- the pre-approve path never fired all month, so the mis-approval metric has **no samples yet** (0/0, honestly rendered as "无样本" rather than "0") — what *was* exercised: 2 uncertain calls escalated to the human, 0 high-risk calls missed
- total decision cost: **$0.0041** (96,684 input tokens across 92 billed decisions; p50 1110ms, p95 1454ms)
- 128 decisions degraded to stock behavior (no key for most of the window, 9 timeouts) at **zero behavioral cost** — the fail-closed posture doing exactly what it promises

Calibration closes its own loop: every `/jev-calibrate` run snapshots the report; the next run tells you which of its previous suggestions you adopted (`✓ 已采纳`), ignored, or manually overrode (`↔`), and how the agreement buckets moved since.
```

**依据 2 · 源码核查**：[src/jev.ts:155-197](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/jev.ts#L155-L197)

源码确认缓存命中不重复计费、并发许可和错误降级。

<details>
<summary>查看原文（43行）</summary>

```text
    const cacheKey = createHash('sha256')
      .update(JSON.stringify([this.model, call.state, call.questions]))
      .digest('hex')
    const hit = this.cache.get(cacheKey)
    if (hit !== undefined) {
      // A hit reuses the ANSWERS only: usage and latency belong to the
      // original billable call, so recording them again would multiply the
      // reported token count and cost by every reuse.
      return {
        answers: hit.answers,
        model: hit.model,
        latencyMs: 0,
        inputTokens: undefined,
        costUsd: undefined,
        cached: true,
      }
    }

    if (call.signal?.aborted) return degrade('aborted')
    const acquired = await this.semaphore.acquire(
      call.signal ?? new AbortController().signal,
      this.timeoutMs - (this.now() - started),
    )
    if (acquired !== 'acquired') return degrade(acquired === 'aborted' ? 'aborted' : 'timeout')
    try {
      const outcome = await this.request(call, key, started)
      if (typeof outcome === 'string') {
        if (outcome === 'caller-aborted') return degrade('aborted')
        if (outcome === 'timeout') this.countFailure('timeout')
        else this.countFailure(outcome)
        return degrade(outcome === 'retryable' ? 'http-error' : outcome)
      }
      this.gate.onSuccess()
      const result: ClassifyResult = {
        ...outcome,
        latencyMs: this.now() - started,
        cached: false,
      }
      this.cache.set(cacheKey, result)
      return result
    } finally {
      this.semaphore.release()
    }
```

</details>

**依据 3 · 源码核查**：[src/telemetry.ts:80-118](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/telemetry.ts#L80-L118)

遥测使用作者设定的单价估算、20MB 轮转阈值并串行 best-effort 写 JSONL。

<details>
<summary>查看原文（39行）</summary>

```text
/** Price used to estimate cost when the provider does not report one (USD per input megatok); Jev published rate. */
const JEV_USD_PER_MTOK = 0.042

/** Rotate the log above this size (bytes). */
const ROTATE_BYTES = 20 * 1024 * 1024

/** 尾部按块读取的翻倍上限：病态长行也最多读 2MB（recentEntries 的窗口封顶）。 */
const TAIL_CHUNK_MAX_BYTES = 2 * 1024 * 1024

/**
 * File-backed telemetry writer; `/jev-stats` aggregates by re-reading the log.
 */
export class Telemetry {
  private readonly file: string
  private dirReady: Promise<void> | undefined
  /** 串行写队列：并发 appendFile 的完成顺序无保证，链式追加保证日志顺序。 */
  private writeQueue: Promise<void> = Promise.resolve()
  private rotated = false

  /**
   * @param dir - directory for `telemetry.jsonl` (created on first write).
   */
  constructor(dir: string) {
    this.file = join(dir, 'telemetry.jsonl')
  }

  /**
   * Append one record. Never throws: a telemetry failure is swallowed because
   * the decision path already committed. Writes are chained so records land in
   * the log in the order they were recorded.
   * @param entry - the record to persist.
   */
  record(entry: TelemetryEntry): void {
    this.writeQueue = this.writeQueue
      .then(() => this.ready())
      .then(() => appendFile(this.file, `${JSON.stringify(entry)}\n`, 'utf8'))
      .catch(() => {
        // Telemetry is best-effort; nothing downstream depends on it.
      })
```

</details>

#### 缺口

- 缺同任务基线、真实 provider 账单、人工复核时间、误拦截/漏拦截和合格交付数
  **影响**：效果与单位合格任务成本保持未知
  **进一步探讨**：按代表性工具调用批次同时记录总现金支出、端到端时长、人工分钟、合格数和失败重试

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现是否可靠且可维护，哪些设计可借鉴、移植要付出什么？

**研究主题**：工程质量与复用

#### 完整回答

值得借鉴的部分是把模型判断与宿主动作分开：matrix 是纯函数，guard 只把无异议映射为 delegate；PendingAsks 用 sessionId、callId、tool 和 10 分钟新鲜度绑定批准证据；JevClient 集中处理超时、重试、冷却、并发、LRU 和缓存计费去重；遥测写入串行且 best-effort，不让观测失败反向破坏已作出的决策。session retention 保留原预算和保护规则，只替换丢弃优先级。维护风险同样具体：插件耦合多个 alpha 版 DSH 包与私有 resolver 方法覆盖；主插件和 session row 各自创建 JevClient，配置与行为边界分散；图像卸载遗漏 enforce 门已形成确认缺陷；遥测吞错意味着用户可能在没有观测记录时仍执行动作。本轮没有用作者声明的测试数量替代对应行为验收。移植时应把副作用收口到统一 effect gate、以公开 Host 接口替代私有覆写，并增加跨模式契约测试。

#### 证据与依据

**依据 1 · 源码核查**：[src/guard.ts:43-84](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/guard.ts#L43-L84)

PendingAsks 按 session/call/tool/新鲜度绑定证据，并在读取时一次性删除。

<details>
<summary>查看原文（42行）</summary>

```text
/**
 * Bounded store of guard escalations keyed by `sessionId:callId` — provider
 * call ids are NOT unique across concurrent sessions (they can collide as
 * `call_0` in parallel subagent loops), so the session id must disambiguate.
 * The pre-approval answerer consumes an entry only when it is fresh and its
 * tool matches the request, so a stale or mismatched entry never supplies the
 * argument evidence for an auto-approval.
 */
export class PendingAsks {
  private readonly asks = new Map<string, PendingAsk>()

  /**
   * Record one escalation.
   * @param sessionId - session that owns the escalated call.
   * @param callId - the escalated tool call.
   * @param ask - bounded context for the pre-approval question.
   */
  set(sessionId: string, callId: string, ask: Omit<PendingAsk, 'createdAt'>): void {
    if (this.asks.size >= 64) {
      const oldest = this.asks.keys().next()
      if (oldest.done !== true) this.asks.delete(oldest.value)
    }
    this.asks.set(`${sessionId}\0${callId}`, { ...ask, createdAt: Date.now() })
  }

  /**
   * Take (remove) the context recorded for one call, but only when it is
   * fresh and belongs to the asking tool.
   * @param sessionId - session that owns the approval request.
   * @param callId - the call being approved.
   * @param toolName - the tool the approval question names.
   * @returns the matching fresh context, or `undefined` (the entry is
   *   dropped either way — a miss must never be retried against stale data).
   */
  take(sessionId: string, callId: string, toolName: string): PendingAsk | undefined {
    const key = `${sessionId}\0${callId}`
    const ask = this.asks.get(key)
    this.asks.delete(key)
    if (ask === undefined) return undefined
    if (ask.tool !== toolName) return undefined
    if (Date.now() - ask.createdAt > PENDING_ASK_STALE_MS) return undefined
    return ask
```

</details>

**依据 2 · 源码核查**：[src/jev.ts:155-197](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/jev.ts#L155-L197)

客户端集中实现缓存、并发、冷却和降级边界。

<details>
<summary>查看原文（43行）</summary>

```text
    const cacheKey = createHash('sha256')
      .update(JSON.stringify([this.model, call.state, call.questions]))
      .digest('hex')
    const hit = this.cache.get(cacheKey)
    if (hit !== undefined) {
      // A hit reuses the ANSWERS only: usage and latency belong to the
      // original billable call, so recording them again would multiply the
      // reported token count and cost by every reuse.
      return {
        answers: hit.answers,
        model: hit.model,
        latencyMs: 0,
        inputTokens: undefined,
        costUsd: undefined,
        cached: true,
      }
    }

    if (call.signal?.aborted) return degrade('aborted')
    const acquired = await this.semaphore.acquire(
      call.signal ?? new AbortController().signal,
      this.timeoutMs - (this.now() - started),
    )
    if (acquired !== 'acquired') return degrade(acquired === 'aborted' ? 'aborted' : 'timeout')
    try {
      const outcome = await this.request(call, key, started)
      if (typeof outcome === 'string') {
        if (outcome === 'caller-aborted') return degrade('aborted')
        if (outcome === 'timeout') this.countFailure('timeout')
        else this.countFailure(outcome)
        return degrade(outcome === 'retryable' ? 'http-error' : outcome)
      }
      this.gate.onSuccess()
      const result: ClassifyResult = {
        ...outcome,
        latencyMs: this.now() - started,
        cached: false,
      }
      this.cache.set(cacheKey, result)
      return result
    } finally {
      this.semaphore.release()
    }
```

</details>

**依据 3 · 源码核查**：[src/telemetry.ts:89-118](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/telemetry.ts#L89-L118)

日志串行写入且吞掉观测错误，避免改变决策路径但可能造成审计空洞。

<details>
<summary>查看原文（30行）</summary>

```text
/**
 * File-backed telemetry writer; `/jev-stats` aggregates by re-reading the log.
 */
export class Telemetry {
  private readonly file: string
  private dirReady: Promise<void> | undefined
  /** 串行写队列：并发 appendFile 的完成顺序无保证，链式追加保证日志顺序。 */
  private writeQueue: Promise<void> = Promise.resolve()
  private rotated = false

  /**
   * @param dir - directory for `telemetry.jsonl` (created on first write).
   */
  constructor(dir: string) {
    this.file = join(dir, 'telemetry.jsonl')
  }

  /**
   * Append one record. Never throws: a telemetry failure is swallowed because
   * the decision path already committed. Writes are chained so records land in
   * the log in the order they were recorded.
   * @param entry - the record to persist.
   */
  record(entry: TelemetryEntry): void {
    this.writeQueue = this.writeQueue
      .then(() => this.ready())
      .then(() => appendFile(this.file, `${JSON.stringify(entry)}\n`, 'utf8'))
      .catch(() => {
        // Telemetry is best-effort; nothing downstream depends on it.
      })
```

</details>

**依据 4 · 源码核查**：[src/session-reference.ts:214-245](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/session-reference.ts#L214-L245)

实现通过运行时覆盖继承类私有同步 renderer，并以 super.prepare 保持回退。

<details>
<summary>查看原文（32行）</summary>

```text
    // Shadow the inherited (TS-private, synchronous) renderer with the scored
    // one. The inherited implementation stays the fallback for every render
    // without scores, so the default is byte-for-byte upstream behavior.
    const self = this as unknown as {
      renderSources: (sources: readonly PreparedSourceLike[], maxReferenceBytes: number) => RenderedSourceLike[]
    }
    const upstream = self.renderSources.bind(self)
    self.renderSources = (sources, maxReferenceBytes) => this.renderScored(upstream, sources, maxReferenceBytes)
  }

  /**
   * Pre-warm message scores before the inherited preparation renders the
   * snapshot synchronously. Scoring failures are swallowed: no scores means
   * the render keeps the upstream retention.
   * @param agent - agent entering the model step.
   * @param content - already host-normalized readable message content.
   * @param references - structured source sessions in mention order.
   * @param signal - optional cancellation boundary for the active turn.
   * @returns the inherited preparation result.
   */
  override async prepare(
    agent: Agent,
    content: ContentBlock[],
    references: SessionReferenceInput[],
    signal?: AbortSignal,
  ): Promise<{ content: ContentBlock[]; additionalContext?: UserMessage }> {
    try {
      await this.prewarmScores(agent, content, references, signal)
    } catch {
      // Scoring is best-effort; retention falls back to upstream FIFO.
    }
    return super.prepare(agent, content, references, signal)
```

</details>

**依据 5 · 源码核查**：[src/image-offload.ts:148-164](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/image-offload.ts#L148-L164)

确认副作用路径缺少统一 mode gate。

<details>
<summary>查看原文（17行）</summary>

```text
    if (toOffload.length > 0) {
      // L5: land image/offload events in the exact upstream format.
      for (const target of toOffload) {
        ;(session as unknown as { append: (type: string, data: unknown) => void }).append('image/offload', { targets: [target] })
      }
      deps.telemetry.record({
        ts: new Date().toISOString(),
        tag: 'guard',
        mode: live.mode,
        sessionId: session.id,
        action: 'skipped',
        detail: `image-offload: pre-planned ${toOffload.reduce((s, t) => s + t.imageIndexes.length, 0)} images at pressure ${(pressure * 100).toFixed(0)}%`,
        latencyMs: result.latencyMs,
      })
    }

    return next()
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 从现有贡献与 shadow 缺口可推导什么新设计，如何证伪？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把所有模型建议到宿主副作用统一经过一个不可绕过的 effect gate。动作必须携带 mode、provenance、evidence、reversible，并由 Host 在 effect 边界强制规定 shadow 只能记录、enforce 才能提交。这可能同时减少跨挂点模式漂移并提升审批审计完整性。相对当前实现的增量不是再加分类问题，而是把 guard、preapprove、session retention、image offload 和 stagnation 分散的 mode 判断收敛为单一能力令牌。推导链是核心 guard、preapprove、stagnation 已分别实现 shadow 门，session retention 也显式区分；唯独图像卸载直接 append 事件，证明靠每个 listener 自律会漂移。最小验证是动作矩阵测试，枚举每个挂点在 disabled、shadow、enforce 与 provider 成功、失败下的事件日志和持久状态。成功判据是 shadow 的宿主状态哈希逐字节不变、只有审计记录增加，enforce 动作都带可回指证据；任一 shadow 状态变化或无 provenance 的 enforce 动作都推翻设计实现。代价是改造 Host 接口和迁移现有插件，且无法证明分类本身更准确。

#### 证据与依据

**依据 1 · 源码核查**：[src/guard.ts:189-211](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/guard.ts#L189-L211)

guard 在 listener 内检查 live.mode，shadow 始终委托下游。

<details>
<summary>查看原文（23行）</summary>

```text
export function createGuardListener(
  deps: GuardDeps,
): (exec: ToolExecution, next: () => Promise<PreToolDecision>) => Promise<PreToolDecision> {
  return async (exec, next) => {
    const live = deps.live()
    if (!live.enabled) return next()
    let action: GuardAction | undefined
    try {
      action = await evaluateGuard(deps, live, exec)
      // evaluateGuard returns undefined when the call should simply delegate.
    } catch {
      // Our own failure must degrade to stock behavior; next() errors are not ours to swallow.
      action = undefined
    }
    if (action === undefined || action.kind === 'delegate') return next()
    if (live.mode === 'shadow') return next()
    if (action.kind === 'ask') {
      // evaluateGuard already recorded the bounded preview for the pre-approval question.
      return { kind: 'ask', reason: action.reason }
    }
    // info.reason 是上游 ToolErrorInfo 专设的用户可见通道（durable 投影保留、
    // model-facing content 不含）：把同一份拦截理由送进审计与面板回放。
    return { kind: 'deny', reason: action.reason, info: { ...GUARD_DENY_INFO, reason: action.reason } }
```

</details>

**依据 2 · 源码核查**：[src/preapprove.ts:109-116](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/preapprove.ts#L109-L116)

预批准也在 listener 内各自实现 enforce 门。

```text
    deps.trace?.noteVerdict(
      req.agent.session.id,
      req.callId === undefined ? undefined : String(req.callId),
      verdict === undefined ? 'not-evaluated' : verdict.kind,
    )
    if (verdict === undefined) return next()
    if (live.mode === 'enforce' && verdict.kind === 'auto-approve') return 'allowed-once'
    return next()
```

**依据 3 · 源码核查**：[src/session-reference.ts:405-415](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/session-reference.ts#L405-L415)

会话保留在 renderer 内分别处理 enforce 与 shadow。

<details>
<summary>查看原文（11行）</summary>

```text
      if (this.scoring.mode === 'enforce') {
        if (fifo !== undefined) this.recordComparison(source, scored, fifo, scores)
        rendered.push({ ...scored, capturedFormatVersion: source.snapshot.session.version })
        continue
      }
      // Shadow: the real render stays the upstream bytes; the scored selection
      // is only the recorded counterfactual.
      const upstreamRendered = upstream([source], maxReferenceBytes)
      if (fifo !== undefined) this.recordComparison(source, scored, fifo, scores)
      rendered.push(...upstreamRendered)
    }
```

</details>

**依据 4 · 源码核查**：[src/image-offload.ts:148-164](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/image-offload.ts#L148-L164)

图像卸载为分散门控遗漏提供可核查反例。

<details>
<summary>查看原文（17行）</summary>

```text
    if (toOffload.length > 0) {
      // L5: land image/offload events in the exact upstream format.
      for (const target of toOffload) {
        ;(session as unknown as { append: (type: string, data: unknown) => void }).append('image/offload', { targets: [target] })
      }
      deps.telemetry.record({
        ts: new Date().toISOString(),
        tag: 'guard',
        mode: live.mode,
        sessionId: session.id,
        action: 'skipped',
        detail: `image-offload: pre-planned ${toOffload.reduce((s, t) => s + t.imageIndexes.length, 0)} images at pressure ${(pressure * 100).toFixed(0)}%`,
        latencyMs: result.latencyMs,
      })
    }

    return next()
```

</details>

#### 缺口

- effect gate 的 Host API、性能开销和第三方插件迁移兼容性未实现或实测
  **影响**：假设的工程可行性和净收益未知
  **进一步探讨**：先以测试适配层包装现有五类动作，运行全模式动作矩阵再决定是否进入 Host API

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对哪些人值得观察或试用，采用条件、成功与停止标准是什么？

**研究主题**：采用判断

#### 完整回答

结论为试用，不是值得安装。适合愿意在隔离 DSH profile 中审阅每次决策、工具调用频繁且希望比较生成式审核或人工审批成本的开发者。初始条件应保持 imageOffloadEnabled=false、预批准白名单为空、主插件使用 shadow，并只收集 guard、retention、停滞的反事实遥测；随后对少量可逆、可重建工具逐项加入白名单，独立人工核对授权范围。语义 session retention 也应先 shadow 对照 FIFO，再单独 enforce。不适合处理不可恢复外部写入、严格禁止把工具参数摘要发往第三方、无法维护 DSH alpha 接口兼容或希望一装即自动安全的用户。成功标准包括 shadow 零状态变化、provider 故障回到 stock、误拦截与漏拦截在预设阈值内、人工审批分钟和总成本相对基线下降；停止标准包括任何 shadow 副作用、guard 升级被自动批准、无遥测的有效动作或 DSH 升级后 session-reference 缺失。图像卸载在 enforce 门修复并通过跨模式宿主测试前不应开启。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:44-80](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/README.md#L44-L80)

作者给出安装、shadow-first、观察命令和切换 enforce 的操作路径。

<details>
<summary>查看原文（37行）</summary>

````text
## The 60-second tour

```sh
dsh plugin --profile <name> add dsh-jev-interceptor
```

```yaml
# in your profile's cordis.patch.yml
- id: jev-interceptor
  name: dsh-jev-interceptor
  config:
    enabled: true
    mode: shadow            # watch mode first: records every decision, enforces nothing
    provider: typesafe      # or 'openrouter' (works today, no waitlist) | 'custom'
```

**No YAML needed.** Once installed, control everything from the chat box — commands persist to the profile and take effect on the next tool call, no reload:

```
/jev-on                 # enable (starts in shadow mode — records, never acts)
/jev-stats              # watch what it decides, with full probability distributions
/jev-log 20 --json      # the last N decisions, one per line; --json/--csv export
/jev-calibrate          # shadow-data threshold advice (never auto-applies)
/jev-mode enforce       # promote once the numbers look right
/jev-off                # back to stock behavior
```

Use your agent normally. In shadow mode every decision lands in telemetry with its full probability distribution; `/jev-stats` summarizes:

```
[guard] calls: 41  degraded: 0  cached: 9
  actions: delegate=33 ask=6 deny=2
  input tokens: 18234  est. cost: $0.000766
  latency: p50 247ms  p95 512ms  max 611ms
```

Happy with the numbers? Flip `mode: enforce`. That's the whole rollout plan — **shadow first, then trust, never guess**.
````

</details>

**依据 2 · 源码核查**：[src/config.ts:121-155](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/config.ts#L121-L155)

默认值支持从停用、shadow、空白名单和关闭高风险 opt-in 开始。

<details>
<summary>查看原文（35行）</summary>

```text
export const DEFAULTS = {
  enabled: false,
  mode: 'shadow' as const,
  provider: 'typesafe' as const,
  apiKeyEnv: 'TYPESAFE_API_KEY',
  timeoutMs: 1500,
  cooldownMs: 60_000,
  failureThreshold: 3,
  maxConcurrency: 4,
  cacheSize: 512,
  recentMessages: 6,
  preapproveRecentMessages: 3,
  recentMessageChars: 300,
  argsHeadChars: 2048,
  argsTailChars: 512,
  guardEnabled: true,
  guardReadOnlyTools: [...DEFAULT_READ_ONLY_TOOLS],
  guardExcludeTools: [] as string[],
  guardConfidenceMin: 0.6,
  guardDenyConfidence: 0.85,
  guardIrreversibleCeiling: 0.2,
  guardIrreversibleDenyFloor: 0.5,
  guardInjectionAskThreshold: 0.8,
  preapproveEnabled: true,
  preapproveToolAllowlist: [] as string[],
  preapproveAutoApproveMin: 0.85,
  preapproveIrreversibleMax: 0.15,
  preapproveInjectionSuspectMax: 0.5,
  stagnationEnabled: false,
  stagnationWindow: 8,
  stagnationTriggerCount: 4,
  stagnationFailureRatioMin: 0.75,
  stagnationConfidenceMin: 0.85,
  stagnationCooldownMs: 300_000,
  stagnationArgsPreviewChars: 160,
```

</details>

**依据 3 · 源码核查**：[src/image-offload.ts:148-164](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/image-offload.ts#L148-L164)

确认图像卸载当前不适合进入试用范围。

<details>
<summary>查看原文（17行）</summary>

```text
    if (toOffload.length > 0) {
      // L5: land image/offload events in the exact upstream format.
      for (const target of toOffload) {
        ;(session as unknown as { append: (type: string, data: unknown) => void }).append('image/offload', { targets: [target] })
      }
      deps.telemetry.record({
        ts: new Date().toISOString(),
        tag: 'guard',
        mode: live.mode,
        sessionId: session.id,
        action: 'skipped',
        detail: `image-offload: pre-planned ${toOffload.reduce((s, t) => s + t.imageIndexes.length, 0)} images at pressure ${(pressure * 100).toFixed(0)}%`,
        latencyMs: result.latencyMs,
      })
    }

    return next()
```

</details>

**依据 4 · 源码核查**：[src/jev.ts:151-197](https://github.com/AskTheWay/dsh-jev-interceptor/blob/7d98ee78ca2e9417894ceb2a00903d67f8f84b12/src/jev.ts#L151-L197)

故障降级、缓存与并发边界可作为试用验收点。

<details>
<summary>查看原文（47行）</summary>

```text
    const key = await this.resolveKey()
    if (key === undefined || key.length === 0) return degrade('no-key')
    if (this.gate.open()) return degrade('cooldown')

    const cacheKey = createHash('sha256')
      .update(JSON.stringify([this.model, call.state, call.questions]))
      .digest('hex')
    const hit = this.cache.get(cacheKey)
    if (hit !== undefined) {
      // A hit reuses the ANSWERS only: usage and latency belong to the
      // original billable call, so recording them again would multiply the
      // reported token count and cost by every reuse.
      return {
        answers: hit.answers,
        model: hit.model,
        latencyMs: 0,
        inputTokens: undefined,
        costUsd: undefined,
        cached: true,
      }
    }

    if (call.signal?.aborted) return degrade('aborted')
    const acquired = await this.semaphore.acquire(
      call.signal ?? new AbortController().signal,
      this.timeoutMs - (this.now() - started),
    )
    if (acquired !== 'acquired') return degrade(acquired === 'aborted' ? 'aborted' : 'timeout')
    try {
      const outcome = await this.request(call, key, started)
      if (typeof outcome === 'string') {
        if (outcome === 'caller-aborted') return degrade('aborted')
        if (outcome === 'timeout') this.countFailure('timeout')
        else this.countFailure(outcome)
        return degrade(outcome === 'retryable' ? 'http-error' : outcome)
      }
      this.gate.onSuccess()
      const result: ClassifyResult = {
        ...outcome,
        latencyMs: this.now() - started,
        cached: false,
      }
      this.cache.set(cacheKey, result)
      return result
    } finally {
      this.semaphore.release()
    }
```

</details>

#### 缺口

- 未完成安装、Host 核心功能、禁用/卸载及效果验收
  **影响**：不能给 install 结论，试用价值仍依赖真实环境
  **进一步探讨**：按隔离 profile 的动作矩阵收集真实宿主证据后复核

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
