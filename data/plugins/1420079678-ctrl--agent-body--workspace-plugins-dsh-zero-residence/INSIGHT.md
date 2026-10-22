# @dsh-external/dsh-zero-residence

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[9403444](https://github.com/1420079678-ctrl/agent-body/tree/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence)

<!-- BEGIN META -->
[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)
<!-- END META -->

> **实现功能**：用确定性工具指针清单替换模型摘要，提供日志召回、近似上下文账本、强制压缩探针及异步PowerShell命令句柄。

> **核心亮点**：把确定性callId指针接入BasicCompactionEngine，提供owner/probe和日志召回，减少摘要步骤模型调用。详见[Q02](#research-q02)。

> **风险与缺陷**：recall对call/result首个同ID即返回、叙述无seq恢复且有限量截断，不能普遍无损；强制arm全局。fast直接pwsh无宿主策略/取消/配额，缺error监听，内存jobs不支持重载旧handle恢复。详见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 零驻留解决什么长会话问题，成功怎样判断？](#detail-section-11)
  - [Q02 · 指针压缩实际怎样实现，有哪些明确创新？](#detail-section-12)
  - [Q03 · “任意内容逐字恢复”受到哪些代码条件限制？](#detail-section-13)
  - [Q04 · zr_fast和账本的工程边界是什么？](#detail-section-14)
  - [Q05 · 安装与操作需要什么前提？](#detail-section-15)
  - [Q06 · 成本效果和推荐结论是什么，后续怎样探讨？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向工具结果很长、历史不断重复送模型的DSH会话。插件用确定性指针清单替代LLM压缩摘要，提供recall、近似token账本与强制压缩探针，并附带后台PowerShell命令句柄。场景应限于有可靠持久日志、能按需读取旧工具内容的可信环境。

成功须同时满足真实模型输入变短、当前任务仍有必要语义、被移除结果可准确找回，以及总调用/token/耗时不因反复recall增加。只是不调用摘要模型不能证明整个任务零成本，压缩比也不能替代任务正确率。

基线是宿主BasicCompactionEngine的摘要与近期保留。插件改变摘要算法，没有替换全部上下文生命周期，选择可压缩范围与保留依然靠基类。源注释里的511/1598步百分比是作者单机材料，不直接推广为本插件通用收益。

宿主LLM摘要及近期上下文保留、宿主受管同步/后台命令；本插件省摘要调用，但额外原件查找和任务治理成本需计入。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 指针摘要 | 免LLM摘要保留工具key | 非工具仅头部，无通用无损保证 |
| 召回 | 同ID检索日志事件data | 先匹配call/result、枚举/事件/输出有上限 |
| 账本 | 估算历史驻留与全局stats | 不等于provider usage/金额 |
| 强制压缩 | 下一钩子切overflow trigger | 全局flag不绑定发起agent |
| fast命令 | Host pwsh后台句柄 | 无宿主沙箱/cancel/配额和重载恢复 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools/llm/tokenMeter/sessions与BasicCompactionEngine | 核心 | 扩展压缩与工具 | 包optional peer不代表运行import可缺 |
| cordis/schemastery及相容模型消息格式 | 必需 | 服务/配置 | 需要同代API，不是通用LLM插件 |
| DSH_HOME持久sessions | 召回/账本 | 原文查找 | 缺日志或坏帧不支持无损宣称 |
| 支持zstdDecompressSync的Node | .zstd日志 | 帧解压 | engines>=18不足以保证此API存在 |
| pwsh及Host执行权限 | 仅fast | 异步命令 | 非PowerShell默认系统需额外准备 |
| 可信单用户环境与目录保护 | 使用前提 | 跨会话日志与命令输出 | 无插件会话隔离/命令沙箱 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定宿主、备份日志并核模型/schema | 不直接替换唯一生产压缩策略 |
| 限范围 | 先无敏感合成会话、engine可关闭 | 分开验证工具和压缩服务归属 |
| 指针 | 核call与result分别hash、叙述可恢复性 | 不能只看压缩比 |
| 压缩 | 逐会话核触发和retain，避免全局arm争用 | 探针构造成功不代表所有agent正在用 |
| fast | 如确需用，先核宿主策略与可控命令 | 无取消/配额前不运行长任务 |
| 收尾 | 核活进程、job文件与日志完整 | 卸载工具不当完成清理 |

包带lib可读，TS关键逻辑与分发lib对应；本轮不运行宿主、probe/smoke或任何命令工具。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Node zstd/pwsh与备份空间 | 核宿主压缩API/日志schema及工具兼容 | 迁移/兼容时间与金额未知 |
| 持续使用 | 本地manifest、同步遍历/全日志读取IO，按需recall进入模型 | 检查召回范围与内容 | 没有LLM摘要不等于无token/IO成本，实际费用未知 |
| 失败恢复 | 长进程/巨大job文件与再次召回资源 | 找错/丢key、历史语义丢失排查与job处理 | 无完整恢复/cancel收据，人工时间/金额未量化 |



#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 少摘要调用 | summarize纯本地构建指针 | 真实总任务token/质量未比较 |
| 保留原件线索 | callId和持久日志查找 | 首个call/result、上限和叙述恢复有缺口 |
| 非阻塞命令 | spawn后返回handle | 不缩短任务自身耗时，无宿主取消/配额 |
| 可见压缩诊断 | stats/probe/owner检查 | 全局近似账本不是指定任务实账 |

> **思考**：recall对call/result首个同ID即返回、叙述无seq恢复且有限量截断，不能普遍无损；强制arm全局。fast直接pwsh无宿主策略/取消/配额，缺error监听，内存jobs不支持重载旧handle恢复。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把确定性callId指针接入BasicCompactionEngine，提供owner/probe和日志召回，减少摘要步骤模型调用。详见[Q02](#research-q02)。

把确定性callId指针接入BasicCompactionEngine，提供owner/probe和日志召回，减少摘要步骤模型调用。详见[Q02](#research-q02)。

zr_fast直接spawn pwsh -NoProfile -NonInteractive -Command用户字符串，把stdout/stderr写job文件并立即返回handle。它没有经宿主subprocess/jobs/sandboxPolicy，也未传cwd/env/signal或超时、输出配额、并发上限、cancel动作；进程承接Host默认环境/目录。工具注册被effect回收不意味着正在跑的子进程被终止，子进程也可产生文件/网络副作用。

spawn的try/catch只覆盖同步异常，未见child.on(error)，像找不到pwsh的异步启动错误不能靠该catch可靠报告；这属于Node事件控制流静态风险，未实际触发。只监听exit落.exit，jobs Map每次apply新建，没有重载从磁盘恢复元数据，check先要求Map有id，故.exit不能实现注释所称的重载后旧handle查询。没有全局取消/卸载清理持有child；readTail先读全文件再slice，尾部显示不限制文件/内存成本。

ledger按事件累计histTok，在每request/header加到总量，没有把compaction shadow/替换范围从历史累积量里移除；因此是近似驻留模型，不是实际provider usage或账单。engineStats模块全局/落盘跨会话累计，不应当作指定会话独占收益；保存失败忽略。

<a id="detail-section-5"></a>

### 1.4 主要限制

recall对call/result首个同ID即返回、叙述无seq恢复且有限量截断，不能普遍无损；强制arm全局。fast直接pwsh无宿主策略/取消/配额，缺error监听，内存jobs不支持重载旧handle恢复。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，先验证原件恢复hash、会话范围和受控后台任务生命周期，勿当生产无损压缩/沙箱。详见[Q06](#research-q06)。

成功须同时满足真实模型输入变短、当前任务仍有必要语义、被移除结果可准确找回，以及总调用/token/耗时不因反复recall增加。只是不调用摘要模型不能证明整个任务零成本，压缩比也不能替代任务正确率。

基线是宿主BasicCompactionEngine的摘要与近期保留。插件改变摘要算法，没有替换全部上下文生命周期，选择可压缩范围与保留依然靠基类。源注释里的511/1598步百分比是作者单机材料，不直接推广为本插件通用收益。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。本地summary免模型调用成立，任意内容无损恢复、会话绑定及后台命令恢复/取消不由当前实现保证。

- 已检查：作者 README、包清单、源码路径 workspace/plugins/dsh-zero-residence/package.json、workspace/plugins/dsh-zero-residence/cordis.patch.yml、workspace/plugins/dsh-zero-residence/src/index.ts、workspace/plugins/dsh-zero-residence/lib/index.js 及固定范围 inventory；组件：workspace/plugins/dsh-zero-residence。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取组件TS核心指针/恢复/执行/账本/挂载链及分发lib关键恢复/命令对应、包/bundle；根README仅作者定位，不运行smoke/probe或读真实日志。
- 下一步：可继续从call/result同ID、非工具消息、晚事件/损坏帧、并发arm及缺pwsh/重载/取消序列入手，对比hash恢复和总任务usage/正确率。

**分析版本**

- **仓库**：[1420079678-ctrl/agent-body](https://github.com/1420079678-ctrl/agent-body)
- **版本号**：0.1.0（[固定提交 9403444](https://github.com/1420079678-ctrl/agent-body/tree/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索完整对象hash验收后再驱逐、session/type绑定指针与agent绑定arm，后台任务走宿主托管并持久化取消/恢复收据；未实现。详见[Q06](#research-q06)。

可继续从call/result同ID、非工具消息、晚事件/损坏帧、并发arm及缺pwsh/重载/取消序列入手，对比hash恢复和总任务usage/正确率。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 660 | 601 | 66 | — |
| .mjs | source | 3 | 182 | 167 | 4 | — |
| .ts | source | 1 | 696 | 542 | 107 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=grey&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=grey&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body/issues?q=is%3Aissue+created%3A2026-09-22T06%3A22%3A21.839Z..2026-10-22T06%3A22%3A21.839Z) [![近30天关闭 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A22%3A21.839Z..2026-10-22T06%3A22%3A21.839Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核固定版本确定性压缩、可恢复性契约、会话身份和后台命令边界，不把作者单机数字当普遍效果。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 零驻留解决什么长会话问题，成功怎样判断？

**研究主题：**场景与需求

#### 完整回答

面向工具结果很长、历史不断重复送模型的DSH会话。插件用确定性指针清单替代LLM压缩摘要，提供recall、近似token账本与强制压缩探针，并附带后台PowerShell命令句柄。场景应限于有可靠持久日志、能按需读取旧工具内容的可信环境。

成功须同时满足真实模型输入变短、当前任务仍有必要语义、被移除结果可准确找回，以及总调用/token/耗时不因反复recall增加。只是不调用摘要模型不能证明整个任务零成本，压缩比也不能替代任务正确率。

基线是宿主BasicCompactionEngine的摘要与近期保留。插件改变摘要算法，没有替换全部上下文生命周期，选择可压缩范围与保留依然靠基类。源注释里的511/1598步百分比是作者单机材料，不直接推广为本插件通用收益。

#### 证据与依据

**依据 1 · 作者声明**：[workspace/plugins/dsh-zero-residence/package.json:1-6](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/package.json#L1-L6)

作者零驻留目标。

```text
{
  "name": "@dsh-external/dsh-zero-residence",
  "version": "0.1.0",
  "description": "Zero-residence context engine for DeepSeek Harness: evicts large tool payloads from the live context into a queryable store, keeps only pointers, and reconstructs any of them verbatim on demand — so per-turn prompt tokens stop growing with the transcript.",
  "type": "module",
  "main": "./lib/index.js",
```

**依据 2 · 作者声明**：[workspace/plugins/dsh-zero-residence/src/index.ts:4-23](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L4-L23)

作者特定会话测量与速度归因。

<details>
<summary>查看原文（20行）</summary>

```text
 * ── 问题（本机实测） ──
 * 对一个 511 步的真实会话做成本分解：累计注意力积分 A = Σ n_t = 6.53e8 token，
 * 其中 **91.3% 来自「历史重发」**——每条消息在它之后的每一步都被重读一次。
 * 而行业全部省 token 手段（压缩、摘要、工具门控）都在优化「大小」，只覆盖 4.2%。
 * 默认的 compaction-basic 要攒到 contextWindow 的 80%（本机 = 80 万 token）才触发，
 * 且触发时还要花一次 LLM 调用来做**有损**摘要。
 *
 * ── 本引擎的颠覆点 ──
 * 覆写 `summarize()`（compaction-basic 唯一的子类定制钩子），把「有损 LLM 摘要」
 * 换成「**确定性零成本指针压缩**」：
 *   ① 零 LLM 调用 —— 不花一个 token、不花一秒等待；
 *   ② 无损 —— 被遮蔽内容 100% 可按 key 从持久会话日志重建（`zr_recall`）；
 *   ③ 可审计 —— 遮蔽清单本身就是账本。
 * 依据是零驻留原则：任何可确定性重建的信息，最优驻留时间为零。
 *
 * ── 速度侧（同一实测的另一半结论） ──
 * 同一 1,598 步的回归显示：上下文大小只解释 0.3% 的每步耗时（R²=0.003），
 * 而每步 14.3s 中 **工具执行占 8.69s（61%）**，2,765 次调用里 `pwsh` 一个工具
 * 独吞 79.1%（均值 16.19s，最长单次 1,799s）。故本插件同时提供 `zr_fast`：
 * 把阻塞式长命令变成即返句柄，直接掐掉延迟靶心。
```

</details>

**依据 3 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:353-376](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L353-L376)

继承基类并走基类压缩。

<details>
<summary>查看原文（24行）</summary>

```text
class ZeroResidenceEngine extends BasicCompactionEngine {
  private readonly headChars: number

  constructor(ctx: Context, config: Record<string, unknown>, headChars: number) {
    super(ctx, config as never)
    this.headChars = headChars
  }

  /**
   * 探针 + 强制触发。默认仍走基类的比例阈值；但可用 `zr_compact` 置位强制开关，
   * 下一步的 pre-step 会改走 `context-overflow` 路径——按官方契约该路径
   * "may force a useful balanced reduction even below the normal threshold"。
   */
  override async compactIfNeeded(
    agent: Agent,
    trigger: CompactionTrigger,
    signal: AbortSignal,
  ): Promise<CompactionResult | null> {
    probe.calls++
    probe.lastTrigger = trigger
    try {
      const useTrigger: CompactionTrigger = forceNextCompaction ? 'context-overflow' : trigger
      if (forceNextCompaction) { forceNextCompaction = false; probe.forced++ }
      const result = await super.compactIfNeeded(agent, useTrigger, signal)
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 指针压缩实际怎样实现，有哪些明确创新？

**研究主题：**功能与机制、贡献与相对优势

#### 完整回答

buildPointerManifest遍历压缩区messages，对JSON字符串作CJK/其他字符比例token估算，识别tool-call/result及callId。带callId条目不保正文，只留工具/role/估算量/key；其余保narrativeHeadChars头部。summarize纯本地构建text block，累计engineStats并落盘，不调用llm，所以确实免去这一步的模型摘要请求。

引擎构造auto阈值和retainTokens，默认schema阈值0.15、保40000 token，注释里0.3是旧说明而非生效默认。compactIfNeeded把全局forceNextCompaction转换成context-overflow trigger，再交基类；一次arm由下一个进入钩子的agent消费，并未绑定发起会话。

贡献是把确定性工具指针与现有compaction扩展点、诊断账本接线，可减少压缩步骤生成开销；不是“所有信息最优驻留零”理论已经得到业务验证。是否更好的关键信息保留取决于recall可靠性和任务分布，不能把无模型摘要直接称为语义无损。

#### 证据与依据

**依据 1 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:64-81](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L64-L81)

生效默认与token估算。

<details>
<summary>查看原文（18行）</summary>

```text
export const Config: z<Config> = z.object({
  engine: z.boolean().default(true),
  narrativeHeadChars: z.number().default(120),
  jobDir: z.string().default(''),
  thresholdRatio: z.number().default(0.15),
  retainTokens: z.number().default(40000),
})

/* ─────────────────────────── 基础度量 ─────────────────────────── */

const CJK = /[\u3000-\u303f\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff00-\uffef\u3040-\u30ff\uac00-\ud7af]/

/** 与 harness 自带 body_tokens 估算器同尺度（实测误差 <0.2%）。 */
function estimateTokens(text: string): number {
  let cjk = 0
  let other = 0
  for (const ch of text) { if (CJK.test(ch)) cjk++; else other++ }
  return Math.round(cjk + other / 4)
```

</details>

**依据 2 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:241-294](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L241-L294)

callId指针与叙述头。

<details>
<summary>查看原文（54行）</summary>

```text
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i] as unknown as { role?: string; content?: unknown }
    const blocks = Array.isArray(msg.content) ? (msg.content as Record<string, unknown>[]) : []
    const raw = JSON.stringify(msg)
    const tokens = estimateTokens(raw)
    shadowed += tokens

    let kind = msg.role ?? 'unknown'
    let tool: string | undefined
    let callId: string | undefined
    let head = ''
    for (const b of blocks) {
      const id = identify(b)
      if (id.tool !== undefined) tool = id.tool
      if (id.callId !== undefined) callId = id.callId
      // 以块类型判定真实角色：工具结果常以 user 角色回传，标签必须还原语义
      if (b.type === 'tool-result') kind = 'tool·result'
      else if (b.type === 'tool-call' && kind !== 'tool·result') kind = 'assistant·call'
      const t = blockText(b)
      if (head === '' && t !== '') head = t
    }
    if (tool !== undefined) kind = `${kind}·${tool}`

    const recoverable = callId !== undefined
    if (recoverable) pointerOnly++
    head = head.replace(/\s+/g, ' ').slice(0, recoverable ? 0 : headChars)

    const key = recoverable ? ` key=${callId}` : ''
    const preview = head === '' ? '' : ` 「${head}${head.length >= headChars ? '…' : ''}」`
    lines.push(`  #${i} ${kind} ≈${tokens.toLocaleString('en-US')} tok${key}${preview}`)
  }

  const total = shadowed
  const header = [
    '[零驻留遮蔽 · Zero-Residence Shadow]',
    `本段 ${messages.length} 条消息（≈${total.toLocaleString('en-US')} token）已从上下文驱逐。`,
    '原始内容完整保存在持久会话日志中，可逐字重建——信息未丢失，只是不再驻留。',
    `其中 ${pointerOnly} 条工具载荷仅保留指针（零驻留），叙述类保留头部 ${headChars} 字符。`,
    '',
    '重建索引：',
  ]
  const footer = [
    '',
    `重建任意条目：zr_recall key=<调用id>   （返回原始内容，零驻留代价）`,
    `查看本会话账本：zr_ledger`,
  ]
  const text = [...header, ...lines, ...footer].join('\n')
  return {
    text,
    shadowedTokens: total,
    manifestTokens: estimateTokens(text),
    entries: messages.length,
    pointerOnly,
  }
```

</details>

**依据 3 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:366-404](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L366-L404)

全局arm消费与本地summary。

<details>
<summary>查看原文（39行）</summary>

```text
  override async compactIfNeeded(
    agent: Agent,
    trigger: CompactionTrigger,
    signal: AbortSignal,
  ): Promise<CompactionResult | null> {
    probe.calls++
    probe.lastTrigger = trigger
    try {
      const useTrigger: CompactionTrigger = forceNextCompaction ? 'context-overflow' : trigger
      if (forceNextCompaction) { forceNextCompaction = false; probe.forced++ }
      const result = await super.compactIfNeeded(agent, useTrigger, signal)
      probe.lastOutcome = result === null
        ? `${useTrigger}: 返回 null（未达阈值或无可安全压缩区）`
        : `${useTrigger}: 遮蔽 ${result.shadowedTokenCount} token（seqs ${result.shadowedRange.start}–${result.shadowedRange.end}）`
      return result
    } catch (error: unknown) {
      probe.lastOutcome = `抛错：${error instanceof Error ? error.message : String(error)}`
      throw error
    }
  }

  protected override async summarize(
    input: { readonly tools?: readonly ToolSchema[]; readonly messages: readonly Message[] },
    _agent: Agent,
    _signal?: AbortSignal,
  ): Promise<ZRSummaryResult> {
    const built = buildPointerManifest(input.messages, this.headChars)
    engineStats.runs++
    engineStats.shadowed += built.shadowedTokens
    engineStats.manifest += built.manifestTokens
    engineStats.pointerOnly += built.pointerOnly
    persistStats()
    const block: ContentBlock = { type: 'text', text: built.text } as ContentBlock
    return {
      summary: [block],
      provider: 'zero-residence',
      model: 'deterministic-pointer',
      rawOutput: [block],
    }
```

</details>

**依据 4 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:545-557](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L545-L557)

引擎配置与挂载。

<details>
<summary>查看原文（13行）</summary>

```text
  /* ① 零驻留压缩引擎：覆盖本上下文的 compaction 服务 */
  if (config.engine) {
    try {
      const engine = new ZeroResidenceEngine(ctx as unknown as Context, {
        auto: true,
        thresholdRatio: config.thresholdRatio,
        retainTokens: config.retainTokens,
      }, headChars)
      engineInstance = engine
      engineMounted = true
      engineMountNote = '已挂载'
      ctx.logger.info('[zero-residence] 已挂载零驻留压缩引擎（确定性指针压缩，零 LLM 调用）')
      ctx.effect(() => () => { void engine }, 'zero-residence: compaction engine')
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · “任意内容逐字恢复”受到哪些代码条件限制？

**研究主题：**缺陷与关键质疑

#### 完整回答

manifest给每条消息本地#i，但只有带callId的条目有key，叙述内容只剩头部且zr_recall参数没有seq。recall不按manifest条目类型区分调用与结果，顺序扫描tool/call或tool/result，首个同ID匹配即return JSON.stringify(data)。通常调用在结果前，因此可能取回参数而非被遮蔽结果；它返回事件data序列化，也不是逐字原始日志字节或原消息整体。

默认跨所有listSessionIds结果查找，没有exec.agent会话绑定；只列最多约80个目录且遇session-目录不继续深挖，readSessionEvents召回只取首40000有效事件。压缩后较晚的key、其他命名或不可读/损坏日志可能无法找回，帧/行错误静默跳过；findSessionLog精确目录优先后还会模糊fallback。maxChars默认6000截断，调大没有范围约束。因此“100%可重建”不由当前控制流普遍支持。

同一工具对任意本地已列会话key开放，知道key不等于获得该会话内容许可。若多用户/多会话信任域分离，插件没有自身所有权检查。实际宿主工具授权和日志权限是外部前提，未读真实日志、未证明某部署越权。

#### 证据与依据

**依据 1 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:264-285](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L264-L285)

manifest叙述无key、提示任意恢复。

<details>
<summary>查看原文（22行）</summary>

```text
    const recoverable = callId !== undefined
    if (recoverable) pointerOnly++
    head = head.replace(/\s+/g, ' ').slice(0, recoverable ? 0 : headChars)

    const key = recoverable ? ` key=${callId}` : ''
    const preview = head === '' ? '' : ` 「${head}${head.length >= headChars ? '…' : ''}」`
    lines.push(`  #${i} ${kind} ≈${tokens.toLocaleString('en-US')} tok${key}${preview}`)
  }

  const total = shadowed
  const header = [
    '[零驻留遮蔽 · Zero-Residence Shadow]',
    `本段 ${messages.length} 条消息（≈${total.toLocaleString('en-US')} token）已从上下文驱逐。`,
    '原始内容完整保存在持久会话日志中，可逐字重建——信息未丢失，只是不再驻留。',
    `其中 ${pointerOnly} 条工具载荷仅保留指针（零驻留），叙述类保留头部 ${headChars} 字符。`,
    '',
    '重建索引：',
  ]
  const footer = [
    '',
    `重建任意条目：zr_recall key=<调用id>   （返回原始内容，零驻留代价）`,
    `查看本会话账本：zr_ledger`,
```

</details>

**依据 2 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:144-178](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L144-L178)

日志精确/模糊选择。

<details>
<summary>查看原文（35行）</summary>

```text
function findSessionLog(sessionId: string): string | null {
  const root = join(dshHome(), 'sessions')
  if (!existsSync(root)) return null
  const stack = [root]
  const candidates: Array<{ name: string; file: string }> = []
  while (stack.length > 0) {
    const dir = stack.pop() as string
    let entries: string[]
    try { entries = readdirSync(dir) } catch { continue }
    for (const e of entries) {
      const p = join(dir, e)
      let st
      try { st = statSync(p) } catch { continue }
      if (st.isDirectory()) { stack.push(p); continue }
      if (!e.startsWith('session.v') || !e.includes('jsonl')) continue
      const parts = dir.split(/[\\/]/)
      candidates.push({ name: parts[parts.length - 1] ?? '', file: p })
    }
  }
  if (candidates.length === 0) return null

  // ① 精确相等——唯一有资格直接胜出的匹配
  const exact = candidates.find((c) => c.name === sessionId)
  if (exact) return exact.file

  // ③ 空 id：取字典序最大的目录名（session id 前缀含时间，最新者最大）
  if (sessionId === '') {
    return [...candidates].sort((a, b) => a.name.localeCompare(b.name))[candidates.length - 1]!.file
  }

  // ② 子串：先取目录名最短的（最接近精确），同长取最新
  const fuzzy = candidates
    .filter((c) => c.name.includes(sessionId))
    .sort((a, b) => a.name.length - b.name.length || b.name.localeCompare(a.name))
  return fuzzy[0]?.file ?? null
```

</details>

**依据 3 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:183-201](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L183-L201)

读取与跳坏帧/行、事件上限。

<details>
<summary>查看原文（19行）</summary>

```text
function readSessionEvents(sessionId: string, limit = 200000): LogEvent[] {
  const file = findSessionLog(sessionId)
  if (file === null) return []
  const buf = readFileSync(file)
  const parts: string[] = []
  if (file.endsWith('.zstd')) {
    for (const f of scanZstdFrames(buf)) {
      try { parts.push(zlib.zstdDecompressSync(buf.subarray(f.start, f.end)).toString('utf8')) } catch { /* 单帧损坏不影响其余帧 */ }
    }
  } else {
    parts.push(buf.toString('utf8'))
  }
  const out: LogEvent[] = []
  for (const line of parts.join('').split('\n')) {
    if (line.trim() === '') continue
    try { out.push(JSON.parse(line) as LogEvent) } catch { /* 跳过撕裂行 */ }
    if (out.length >= limit) break
  }
  return out
```

</details>

**依据 4 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:425-442](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L425-L442)

同ID call/result首个返回。

<details>
<summary>查看原文（18行）</summary>

```text
/** 从会话日志里按调用 id 还原被遮蔽的工具原文。 */
function recallByCallId(callId: string, session?: string): { text: string; source: string } | null {
  if (callId.trim() === '') return null
  const ids = listSessionIds().filter(id => session === undefined || session === '' || id === session)
  for (const sessionId of ids) {
    for (const ev of readSessionEvents(sessionId, 40000)) {
      if (ev.type !== 'tool/result' && ev.type !== 'tool/call') continue
      const data = ev.data ?? {}
      const message = data.message as { content?: unknown } | undefined
      const blocks = Array.isArray(message?.content) ? message.content : []
      const matched = identify(data).callId === callId || blocks.some((block: unknown) =>
        block !== null && typeof block === 'object' && identify(block as Record<string, unknown>).callId === callId)
      if (!matched) continue
      const serialized = JSON.stringify(data)
      return { text: serialized, source: `${sessionId}/${ev.type}#${ev.seq ?? '?'}` }
    }
  }
  return null
```

</details>

**依据 5 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:445-464](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L445-L464)

session枚举上限。

<details>
<summary>查看原文（20行）</summary>

```text
function listSessionIds(): string[] {
  const root = join(dshHome(), 'sessions')
  if (!existsSync(root)) return []
  const ids: string[] = []
  const stack = [root]
  while (stack.length > 0 && ids.length < 80) {
    const dir = stack.pop() as string
    let entries: string[]
    try { entries = readdirSync(dir) } catch { continue }
    for (const e of entries) {
      const p = join(dir, e)
      let st
      try { st = statSync(p) } catch { continue }
      if (st.isDirectory()) {
        if (e.startsWith('session-')) { ids.push(e); continue }
        stack.push(p)
      }
    }
  }
  return ids
```

</details>

**依据 6 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:585-601](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L585-L601)

recall参数无seq、默认截断。

<details>
<summary>查看原文（17行）</summary>

```text
  /* ③ zr_recall —— 无损重建（零驻留的另一半：驱逐≠丢失） */
  const recall = defineTool({
    name: 'zr_recall',
    description: '重建被零驻留遮蔽的原始内容：按工具调用 id（key）或会话 seq 从持久会话日志中逐字还原。'
      + '被 zr 遮蔽的内容只是不再驻留，从未丢失——需要原文时用它取回。',
    parameters: {
      key: { type: 'string', description: '工具调用 id（被遮蔽清单里的 key=...）' },
      session: { type: 'string', description: '限定会话（可选，加速检索）' },
      maxChars: { type: 'number', description: '返回上限字符数，默认 6000' },
    },
    output: outStr,
    async execute(args: { key: string; session?: string; maxChars?: number }) {
      const found = recallByCallId(args.key, args.session)
      if (found === null) return `未在持久日志中找到 key=${args.key} 的原始内容。`
      const cap = args.maxChars ?? 6000
      const body = found.text.length > cap ? `${found.text.slice(0, cap)}\n…（共 ${found.text.length} 字符，已截断）` : found.text
      return `# zr_recall · ${args.key}\n来源: ${found.source}\n\n${body}`
```

</details>

**依据 7 · 源码核查**：[workspace/plugins/dsh-zero-residence/lib/index.js:358-375](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/lib/index.js#L358-L375)

分发lib同样首个匹配返回。

<details>
<summary>查看原文（18行）</summary>

```text
function recallByCallId(callId, session) {
    if (callId.trim() === '')
        return null;
    const ids = listSessionIds().filter(id => session === undefined || session === '' || id === session);
    for (const sessionId of ids) {
        for (const ev of readSessionEvents(sessionId, 40000)) {
            if (ev.type !== 'tool/result' && ev.type !== 'tool/call')
                continue;
            const data = ev.data ?? {};
            const message = data.message;
            const blocks = Array.isArray(message?.content) ? message.content : [];
            const matched = identify(data).callId === callId || blocks.some((block) => block !== null && typeof block === 'object' && identify(block).callId === callId);
            if (!matched)
                continue;
            const serialized = JSON.stringify(data);
            return { text: serialized, source: `${sessionId}/${ev.type}#${ev.seq ?? '?'}` };
        }
    }
```

</details>

#### 缺口

- 宿主持久日志事件schema与compaction被遮蔽消息的映射未有同源完整性证明。
  **影响：**不能保证召回目标结果、叙述或最近事件。
  **进一步探讨：**固定call/result同ID、超40k、损坏帧、同名目录和非工具消息，按内容hash对照manifest到原件。
- 跨会话访问权限的宿主策略未在组件内确定。
  **影响：**不推断真实泄漏，但不能认定默认跨库搜索安全。
  **进一步探讨：**核执行身份与会话所有权，受控不同信任域key测试拒绝点。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · zr_fast和账本的工程边界是什么？

**研究主题：**工程质量与复用、缺陷与关键质疑

#### 完整回答

zr_fast直接spawn pwsh -NoProfile -NonInteractive -Command用户字符串，把stdout/stderr写job文件并立即返回handle。它没有经宿主subprocess/jobs/sandboxPolicy，也未传cwd/env/signal或超时、输出配额、并发上限、cancel动作；进程承接Host默认环境/目录。工具注册被effect回收不意味着正在跑的子进程被终止，子进程也可产生文件/网络副作用。

spawn的try/catch只覆盖同步异常，未见child.on(error)，像找不到pwsh的异步启动错误不能靠该catch可靠报告；这属于Node事件控制流静态风险，未实际触发。只监听exit落.exit，jobs Map每次apply新建，没有重载从磁盘恢复元数据，check先要求Map有id，故.exit不能实现注释所称的重载后旧handle查询。没有全局取消/卸载清理持有child；readTail先读全文件再slice，尾部显示不限制文件/内存成本。

ledger按事件累计histTok，在每request/header加到总量，没有把compaction shadow/替换范围从历史累积量里移除；因此是近似驻留模型，不是实际provider usage或账单。engineStats模块全局/落盘跨会话累计，不应当作指定会话独占收益；保存失败忽略。

#### 证据与依据

**依据 1 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:531-538](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L531-L538)

jobs内存创建与目录。

```text
export function apply(ctx: Context, config: Config): void {
  boundCtx = ctx
  loadStats()
  const headChars = config.narrativeHeadChars
  const jobRoot = config.jobDir !== '' ? config.jobDir : join(dshHome(), 'zero-residence', 'jobs')
  const jobs = new Map<string, JobRecord>()

  try { mkdirSync(jobRoot, { recursive: true }) } catch { /* 目录已存在或不可写，工具调用时再报 */ }
```

**依据 2 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:419-422](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L419-L422)

tail先整文件读。

```text
function readTail(file: string, chars: number): string {
  if (!existsSync(file)) return ''
  const text = readFileSync(file, 'utf8')
  return text.length <= chars ? text : `…（已截断前 ${text.length - chars} 字符）\n${text.slice(-chars)}`
```

**依据 3 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:640-691](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L640-L691)

原生spawn、仅exit监听、check依赖Map和注册。

<details>
<summary>查看原文（52行）</summary>

```text
    async execute(args: { action: string; command?: string; id?: string; tailChars?: number }) {
      if (args.action === 'run') {
        if (args.command === undefined || args.command.trim() === '') return '缺少 command。'
        const id = `zr${Date.now().toString(36)}${randomBytes(2).toString('hex')}`
        const file = join(jobRoot, `${id}.log`)
        let fd: number
        try { fd = openSync(file, 'w') } catch (error: unknown) {
          return `无法创建输出文件：${error instanceof Error ? error.message : String(error)}`
        }
        let child
        try {
          // 注意：本机实测 `detached: true` 会让子进程秒退（exit 0、零输出），
          // 故只用 windowsHide 保证无窗口，不脱离父进程。详见 scripts/spawn-probe2.mjs。
          child = spawn('pwsh', ['-NoProfile', '-NonInteractive', '-Command', args.command], {
            windowsHide: true,
            stdio: ['ignore', fd, fd],
          })
        } catch (error: unknown) {
          closeSync(fd)
          return `启动失败：${error instanceof Error ? error.message : String(error)}`
        }
        child.on('exit', (code) => {
          try { closeSync(fd) } catch { /* 已关闭 */ }
          const r = jobs.get(id)
          if (r) r.exitCode = code
          // 落盘退出码，使 check 在插件重载后仍能判定完成
          try { writeFileSync(`${file}.exit`, String(code ?? -1)) } catch { /* 落盘失败不影响主流程 */ }
        })
        child.unref()
        jobs.set(id, { id, command: args.command, pid: child.pid ?? -1, file, startedAt: Date.now(), exitCode: null })
        return `已异步启动。句柄 id=${id}（pid ${child.pid ?? '?'}），输出 → ${file}\n`
          + `立即用 zr_fast action=check id=${id} 查看进度；不要在等待期间空转。`
      }
      if (args.action === 'check') {
        if (args.id === undefined) return '缺少 id。'
        const rec = jobs.get(args.id)
        if (rec === undefined) return `未知句柄 ${args.id}（本进程只记得住本次运行启动的句柄）。`
        // 退出码以落盘文件为准（内存态在插件重载后不保）
        const exitFile = `${rec.file}.exit`
        const code = rec.exitCode ?? (existsSync(exitFile) ? Number(readFileSync(exitFile, 'utf8').trim()) : null)
        const alive = code === null || Number.isNaN(code)
        const tail = readTail(rec.file, args.tailChars ?? 3000)
        return `# ${rec.id}  ${alive ? '运行中' : `已结束 (exit ${code})`}\n命令: ${rec.command}\n耗时: ${((Date.now() - rec.startedAt) / 1000).toFixed(1)}s\n\n${tail}`
      }
      if (args.action === 'list') {
        if (jobs.size === 0) return '本次运行尚无句柄。'
        return [...jobs.values()].map((r) => `${r.id}  ${r.exitCode === null ? '运行中' : `exit ${r.exitCode}`}  ${((Date.now() - r.startedAt) / 1000).toFixed(0)}s  ${r.command.slice(0, 70)}`).join('\n')
      }
      return `未知 action: ${args.action}（支持 run / check / list）`
    },
  })
  ctx.effect(() => ctx.tools.register(fast), 'zero-residence: zr_fast')
```

</details>

**依据 4 · 源码核查**：[workspace/plugins/dsh-zero-residence/lib/index.js:603-631](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/lib/index.js#L603-L631)

分发lib同样无error监听。

<details>
<summary>查看原文（29行）</summary>

```text
                let child;
                try {
                    // 注意：本机实测 `detached: true` 会让子进程秒退（exit 0、零输出），
                    // 故只用 windowsHide 保证无窗口，不脱离父进程。详见 scripts/spawn-probe2.mjs。
                    child = spawn('pwsh', ['-NoProfile', '-NonInteractive', '-Command', args.command], {
                        windowsHide: true,
                        stdio: ['ignore', fd, fd],
                    });
                }
                catch (error) {
                    closeSync(fd);
                    return `启动失败：${error instanceof Error ? error.message : String(error)}`;
                }
                child.on('exit', (code) => {
                    try {
                        closeSync(fd);
                    }
                    catch { /* 已关闭 */ }
                    const r = jobs.get(id);
                    if (r)
                        r.exitCode = code;
                    // 落盘退出码，使 check 在插件重载后仍能判定完成
                    try {
                        writeFileSync(`${file}.exit`, String(code ?? -1));
                    }
                    catch { /* 落盘失败不影响主流程 */ }
                });
                child.unref();
                jobs.set(id, { id, command: args.command, pid: child.pid ?? -1, file, startedAt: Date.now(), exitCode: null });
```

</details>

**依据 5 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:483-525](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L483-L525)

近似ledger累计逻辑和全局stats。

<details>
<summary>查看原文（43行）</summary>

```text
/** 当前会话的驻留账本：读持久日志重算 A 与三段分解。 */
export function computeLedger(sessionId: string): string {
  const events = readSessionEvents(sessionId)
  if (events.length === 0) return `未找到会话日志：${sessionId}（DSH_HOME=${dshHome()}）`
  events.sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0))
  const APPEND = new Set(['user/message', 'assistant/message', 'tool/result', 'agent/inbox/spliced'])
  let systemTok = 0
  let histTok = 0
  const steps: number[] = []
  let toolsSum = 0
  let sysSum = 0
  let histSum = 0
  for (const ev of events) {
    const t = ev.type ?? ''
    if (t === 'system/message') { systemTok = estimateTokens(JSON.stringify(ev.data ?? {})); continue }
    if (APPEND.has(t)) { histTok += estimateTokens(JSON.stringify(ev.data ?? {})); continue }
    if (t === 'request/header') {
      const header = (ev.data ?? {}) as Record<string, unknown>
      const toolsTok = estimateTokens(JSON.stringify(header.header ?? {}))
      steps.push(1)
      toolsSum += toolsTok
      sysSum += systemTok
      histSum += histTok
    }
  }
  const T = steps.length
  const A = toolsSum + sysSum + histSum
  const fmt = (n: number) => Math.round(n).toLocaleString('en-US')
  const pct = (n: number) => (A === 0 ? '0.0' : ((n / A) * 100).toFixed(1))
  return [
    `# 驻留账本 · ${sessionId}`,
    `模型请求数 T = ${T}`,
    `A = Σ n_t = ${fmt(A)} token （≈${(A / 1e6).toFixed(1)}M）`,
    `  ├ 请求头（工具 schema 等） ${pct(toolsSum)}%`,
    `  ├ system 前缀（每步重发） ${pct(sysSum)}%`,
    `  └ 历史重发（累积）        ${pct(histSum)}%`,
    '',
    `压缩引擎状态：${engineMounted ? '✅' : '⚠️'} ${engineMountNote}`,
    `pre-step 压缩钩子：被调用 ${probe.calls} 次｜最近 trigger=${probe.lastTrigger}｜结果：${probe.lastOutcome}｜强制触发 ${probe.forced} 次`,
    `本上下文 compaction 实际解析到：${resolveCompactionOwner()}`,
    `零驻留引擎已运行 ${engineStats.runs} 次，累计遮蔽 ${fmt(engineStats.shadowed)} token，`,
    `生成清单 ${fmt(engineStats.manifest)} token（压缩比 ${engineStats.shadowed === 0 ? 'n/a' : (engineStats.shadowed / Math.max(1, engineStats.manifest)).toFixed(1)}×），`,
    `其中 ${engineStats.pointerOnly} 条走纯指针（零驻留）。`,
```

</details>

**依据 6 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:307-329](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L307-L329)

全局stats直写与失败忽略。

<details>
<summary>查看原文（23行）</summary>

```text
/** 引擎已遮蔽的总量（进程内账本，供 zr_ledger 展示）。 */
interface EngineStats { runs: number; shadowed: number; manifest: number; pointerOnly: number }
const engineStats: EngineStats = { runs: 0, shadowed: 0, manifest: 0, pointerOnly: 0 }

/** 引擎挂载状态（自报，避免靠猜）。 */
let engineMounted = false
let engineMountNote = '未尝试挂载'
/** 计数器落盘：插件重载会重建模块级状态，不落盘就会把已发生的压缩数清零。 */
function statsPath(): string { return join(dshHome(), 'zero-residence', 'engine-stats.json') }

function persistStats(): void {
  try {
    const dir = join(dshHome(), 'zero-residence')
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    writeFileSync(statsPath(), JSON.stringify(engineStats))
  } catch { /* 落盘失败不影响压缩本身 */ }
}

function loadStats(): void {
  try {
    const p = statsPath()
    if (existsSync(p)) Object.assign(engineStats, JSON.parse(readFileSync(p, 'utf8')) as EngineStats)
  } catch { /* 首次运行无文件，保持零值 */ }
```

</details>

#### 缺口

- 异步spawn失败、插件停用与重载时的进程/文件状态未受控复现。
  **影响：**不能确认实际崩溃或遗留规模，不给完成/取消保证。
  **进一步探讨：**用不存在pwsh替身与长运行无副作用进程，比较error/exit、重载handle和停用清理。
- ledger近似值与实际输入usage/缓存计价没有对照。
  **影响：**不能据此宣称金额/延迟同比减少。
  **进一步探讨：**同任务保留provider输入usage与compaction surface变化，区分估算/缓存/实际计费。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安装与操作需要什么前提？

**研究主题：**依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools/llm/tokenMeter/sessions与BasicCompactionEngine | 核心 | 扩展压缩与工具 | 包optional peer不代表运行import可缺 |
| cordis/schemastery及相容模型消息格式 | 必需 | 服务/配置 | 需要同代API，不是通用LLM插件 |
| DSH_HOME持久sessions | 召回/账本 | 原文查找 | 缺日志或坏帧不支持无损宣称 |
| 支持zstdDecompressSync的Node | .zstd日志 | 帧解压 | engines>=18不足以保证此API存在 |
| pwsh及Host执行权限 | 仅fast | 异步命令 | 非PowerShell默认系统需额外准备 |
| 可信单用户环境与目录保护 | 使用前提 | 跨会话日志与命令输出 | 无插件会话隔离/命令沙箱 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定宿主、备份日志并核模型/schema | 不直接替换唯一生产压缩策略 |
| 限范围 | 先无敏感合成会话、engine可关闭 | 分开验证工具和压缩服务归属 |
| 指针 | 核call与result分别hash、叙述可恢复性 | 不能只看压缩比 |
| 压缩 | 逐会话核触发和retain，避免全局arm争用 | 探针构造成功不代表所有agent正在用 |
| fast | 如确需用，先核宿主策略与可控命令 | 无取消/配额前不运行长任务 |
| 收尾 | 核活进程、job文件与日志完整 | 卸载工具不当完成清理 |

包带lib可读，TS关键逻辑与分发lib对应；本轮不运行宿主、probe/smoke或任何命令工具。

#### 证据与依据

**依据 1 · 源码核查**：[workspace/plugins/dsh-zero-residence/package.json:29-46](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/package.json#L29-L46)

Node>=18与必需import对应peer。

<details>
<summary>查看原文（18行）</summary>

```text
    "node": ">=18"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-agent": ">=0.0.1-rc.1 <0.1.0 || >=0.1.0-rc.1 <0.2.0-0 || >=0.1.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-compaction": ">=0.0.1-rc.1 <0.1.0 || >=0.1.0-rc.1 <0.2.0-0 || >=0.1.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-compaction-basic": ">=0.0.1-rc.1 <0.1.0 || >=0.1.0-rc.1 <0.2.0-0 || >=0.1.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-llm": ">=0.0.1-rc.1 <0.1.0 || >=0.1.0-rc.1 <0.2.0-0 || >=0.1.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-tools": ">=0.0.1-rc.1 <0.1.0 || >=0.1.0-rc.1 <0.2.0-0 || >=0.1.1-rc.1 <0.2.0-0",
    "cordis": ">=4.0.0-rc <5",
    "schemastery": "^3.18.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-agent": {
      "optional": true
    },
    "@deepseek-ai/dsh-compaction": {
      "optional": true
    },
```

</details>

**依据 2 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:27-45](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L27-L45)

导入/注入与zlib。

<details>
<summary>查看原文（19行）</summary>

```text
import type { Context } from 'cordis'
import z from 'schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { BasicCompactionEngine } from '@deepseek-ai/dsh-compaction-basic'
import type { CompactionAgentContext, CompactionResult, CompactionTrigger } from '@deepseek-ai/dsh-compaction'
import type { ContentBlock, Message, ToolSchema } from '@deepseek-ai/dsh-llm'
import type { Agent } from '@deepseek-ai/dsh-agent'
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, openSync, closeSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'
import { randomBytes } from 'node:crypto'
import zlib from 'node:zlib'

export const name = '@dsh-external/dsh-zero-residence'
// 必须与 BasicCompactionEngine 的 static inject 一致：引擎是我们手动 new 的，
// cordis 不会自动施加它的注入，缺一个就会在 pre-step 抛
// "cannot get property \"tokenMeter\" without inject" 并被基类吞成警告——压缩永不触发。
export const inject = ['tools', 'llm', 'tokenMeter', 'sessions']
```

</details>

**依据 3 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:183-190](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L183-L190)

直接调用zstdDecompressSync。

```text
function readSessionEvents(sessionId: string, limit = 200000): LogEvent[] {
  const file = findSessionLog(sessionId)
  if (file === null) return []
  const buf = readFileSync(file)
  const parts: string[] = []
  if (file.endsWith('.zstd')) {
    for (const f of scanZstdFrames(buf)) {
      try { parts.push(zlib.zstdDecompressSync(buf.subarray(f.start, f.end)).toString('utf8')) } catch { /* 单帧损坏不影响其余帧 */ }
```

**依据 4 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:471-480](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L471-L480)

检查解析到的引擎归属。

<details>
<summary>查看原文（10行）</summary>

```text
function resolveCompactionOwner(): string {
  const c = boundCtx as unknown as { compaction?: object } | null
  if (c === null || c.compaction === undefined) return '无法解析（ctx.compaction 不可见）'
  const name = c.compaction.constructor?.name ?? '未知'
  // 按构造函数名判定（插件重载会换实例，instanceof 不可靠）
  if (name === 'ZeroResidenceEngine') {
    const same = engineInstance !== null && c.compaction === engineInstance
    return `${name} ✅ 零驻留引擎在管（${same ? '同一实例' : '重载后的实例，属正常'}）`
  }
  return `${name} ⚠️ 仍是基础引擎，零驻留未接管`
```

</details>

**依据 5 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:653-656](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L653-L656)

pwsh运行依赖。

```text
          child = spawn('pwsh', ['-NoProfile', '-NonInteractive', '-Command', args.command], {
            windowsHide: true,
            stdio: ['ignore', fd, fd],
          })
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本效果和推荐结论是什么，后续怎样探讨？

**研究主题：**效果与总成本、采用判断、新假设与验证

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Node zstd/pwsh与备份空间 | 核宿主压缩API/日志schema及工具兼容 | 迁移/兼容时间与金额未知 |
| 持续使用 | 本地manifest、同步遍历/全日志读取IO，按需recall进入模型 | 检查召回范围与内容 | 没有LLM摘要不等于无token/IO成本，实际费用未知 |
| 失败恢复 | 长进程/巨大job文件与再次召回资源 | 找错/丢key、历史语义丢失排查与job处理 | 无完整恢复/cancel收据，人工时间/金额未量化 |

#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 少摘要调用 | summarize纯本地构建指针 | 真实总任务token/质量未比较 |
| 保留原件线索 | callId和持久日志查找 | 首个call/result、上限和叙述恢复有缺口 |
| 非阻塞命令 | spawn后返回handle | 不缩短任务自身耗时，无宿主取消/配额 |
| 可见压缩诊断 | stats/probe/owner检查 | 全局近似账本不是指定任务实账 |

先观察。确定性指针摘要有可研究价值，但恢复契约、全局强制状态和任意Host命令/重载恢复边界使现版不宜作为生产长会话的无损压缩或安全后台任务方案直接推荐。作者单机节省数字不计独立证据。

可继续探讨“会话绑定且验收过的对象存储指针”。压缩前将被移除的完整消息对象按session/event/type/hash入库并回读校验，失败不驱逐；recall显式区分call/result并分页/校验，强制压缩绑定agent。后台任务另走宿主jobs/subprocess策略、持久元数据/输出配额与取消收据。

这是未实现假设。最小对照覆盖同ID call/result、叙述、40k后事件、损坏帧、并发arm、spawn缺失/重载/取消，记录hash恢复率、任务正确、总usage/IO/延迟和残留资源；若新存储/验证成本超过复用收益或仍需反复补上下文，需缩小压缩范围。

#### 证据与依据

**依据 1 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:387-404](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L387-L404)

无模型summary。

<details>
<summary>查看原文（18行）</summary>

```text
  protected override async summarize(
    input: { readonly tools?: readonly ToolSchema[]; readonly messages: readonly Message[] },
    _agent: Agent,
    _signal?: AbortSignal,
  ): Promise<ZRSummaryResult> {
    const built = buildPointerManifest(input.messages, this.headChars)
    engineStats.runs++
    engineStats.shadowed += built.shadowedTokens
    engineStats.manifest += built.manifestTokens
    engineStats.pointerOnly += built.pointerOnly
    persistStats()
    const block: ContentBlock = { type: 'text', text: built.text } as ContentBlock
    return {
      summary: [block],
      provider: 'zero-residence',
      model: 'deterministic-pointer',
      rawOutput: [block],
    }
```

</details>

**依据 2 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:425-442](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L425-L442)

恢复对象/类型校验基线。

<details>
<summary>查看原文（18行）</summary>

```text
/** 从会话日志里按调用 id 还原被遮蔽的工具原文。 */
function recallByCallId(callId: string, session?: string): { text: string; source: string } | null {
  if (callId.trim() === '') return null
  const ids = listSessionIds().filter(id => session === undefined || session === '' || id === session)
  for (const sessionId of ids) {
    for (const ev of readSessionEvents(sessionId, 40000)) {
      if (ev.type !== 'tool/result' && ev.type !== 'tool/call') continue
      const data = ev.data ?? {}
      const message = data.message as { content?: unknown } | undefined
      const blocks = Array.isArray(message?.content) ? message.content : []
      const matched = identify(data).callId === callId || blocks.some((block: unknown) =>
        block !== null && typeof block === 'object' && identify(block as Record<string, unknown>).callId === callId)
      if (!matched) continue
      const serialized = JSON.stringify(data)
      return { text: serialized, source: `${sessionId}/${ev.type}#${ev.seq ?? '?'}` }
    }
  }
  return null
```

</details>

**依据 3 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:366-376](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L366-L376)

会话绑定arm基线。

<details>
<summary>查看原文（11行）</summary>

```text
  override async compactIfNeeded(
    agent: Agent,
    trigger: CompactionTrigger,
    signal: AbortSignal,
  ): Promise<CompactionResult | null> {
    probe.calls++
    probe.lastTrigger = trigger
    try {
      const useTrigger: CompactionTrigger = forceNextCompaction ? 'context-overflow' : trigger
      if (forceNextCompaction) { forceNextCompaction = false; probe.forced++ }
      const result = await super.compactIfNeeded(agent, useTrigger, signal)
```

</details>

**依据 4 · 源码核查**：[workspace/plugins/dsh-zero-residence/src/index.ts:640-691](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence/src/index.ts#L640-L691)

任务托管基线。

<details>
<summary>查看原文（52行）</summary>

```text
    async execute(args: { action: string; command?: string; id?: string; tailChars?: number }) {
      if (args.action === 'run') {
        if (args.command === undefined || args.command.trim() === '') return '缺少 command。'
        const id = `zr${Date.now().toString(36)}${randomBytes(2).toString('hex')}`
        const file = join(jobRoot, `${id}.log`)
        let fd: number
        try { fd = openSync(file, 'w') } catch (error: unknown) {
          return `无法创建输出文件：${error instanceof Error ? error.message : String(error)}`
        }
        let child
        try {
          // 注意：本机实测 `detached: true` 会让子进程秒退（exit 0、零输出），
          // 故只用 windowsHide 保证无窗口，不脱离父进程。详见 scripts/spawn-probe2.mjs。
          child = spawn('pwsh', ['-NoProfile', '-NonInteractive', '-Command', args.command], {
            windowsHide: true,
            stdio: ['ignore', fd, fd],
          })
        } catch (error: unknown) {
          closeSync(fd)
          return `启动失败：${error instanceof Error ? error.message : String(error)}`
        }
        child.on('exit', (code) => {
          try { closeSync(fd) } catch { /* 已关闭 */ }
          const r = jobs.get(id)
          if (r) r.exitCode = code
          // 落盘退出码，使 check 在插件重载后仍能判定完成
          try { writeFileSync(`${file}.exit`, String(code ?? -1)) } catch { /* 落盘失败不影响主流程 */ }
        })
        child.unref()
        jobs.set(id, { id, command: args.command, pid: child.pid ?? -1, file, startedAt: Date.now(), exitCode: null })
        return `已异步启动。句柄 id=${id}（pid ${child.pid ?? '?'}），输出 → ${file}\n`
          + `立即用 zr_fast action=check id=${id} 查看进度；不要在等待期间空转。`
      }
      if (args.action === 'check') {
        if (args.id === undefined) return '缺少 id。'
        const rec = jobs.get(args.id)
        if (rec === undefined) return `未知句柄 ${args.id}（本进程只记得住本次运行启动的句柄）。`
        // 退出码以落盘文件为准（内存态在插件重载后不保）
        const exitFile = `${rec.file}.exit`
        const code = rec.exitCode ?? (existsSync(exitFile) ? Number(readFileSync(exitFile, 'utf8').trim()) : null)
        const alive = code === null || Number.isNaN(code)
        const tail = readTail(rec.file, args.tailChars ?? 3000)
        return `# ${rec.id}  ${alive ? '运行中' : `已结束 (exit ${code})`}\n命令: ${rec.command}\n耗时: ${((Date.now() - rec.startedAt) / 1000).toFixed(1)}s\n\n${tail}`
      }
      if (args.action === 'list') {
        if (jobs.size === 0) return '本次运行尚无句柄。'
        return [...jobs.values()].map((r) => `${r.id}  ${r.exitCode === null ? '运行中' : `exit ${r.exitCode}`}  ${((Date.now() - r.startedAt) / 1000).toFixed(0)}s  ${r.command.slice(0, 70)}`).join('\n')
      }
      return `未知 action: ${args.action}（支持 run / check / list）`
    },
  })
  ctx.effect(() => ctx.tools.register(fast), 'zero-residence: zr_fast')
```

</details>

#### 缺口

- 没有同任务基类摘要/指针方案的恢复hash、效果和总usage对照。
  **影响：**不证明无损或端到端省钱/提速。
  **进一步探讨：**匿名长会话固定任务，比较恢复目标正确、任务质量、input/cache usage和IO。
- 完整对象指针、agent绑定与宿主任务托管方案未实现。
  **影响：**不计当前可靠性或创新得分。
  **进一步探讨：**先最小异常序列验证失败不驱逐、可取消与重载恢复。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
