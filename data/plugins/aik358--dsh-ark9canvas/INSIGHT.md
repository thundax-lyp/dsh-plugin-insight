# @a9i5k4/dsh-ark9canvas

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[adc7072](https://github.com/Aik358/dsh-ark9canvas/tree/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aik358/dsh-ark9canvas) [![npm 30d 851](https://img.shields.io/static/v1?label=npm+30d&message=851&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@a9i5k4/dsh-ark9canvas) [![最新发布 2026-09-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@a9i5k4/dsh-ark9canvas)
<!-- END META -->

> **功能**：提供Harness生图与改图工作台、Agent生图工具、人工审批、多渠道和生成记录。

> **亮点**：把图片生成的Agent意图与实际付费提交拆开，用面板批准再生成，辅以路径式改图和部分成功批次，改变人机交接位置；图片模型与API能力来自外部渠道。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：审批不是持久预算账本。prompt在createApproval截到500字符后用截断值生成，批准时startGeneration读取当前渠道而非冻结创建时渠道；任务落盘和审批/通知内存又不对称。源码支持这些状态限制，未复现实际错图或错账。参见[Q03](#research-q03)。

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
  - [Q01 · 谁需要画布任务与Agent审批，相对手工或宿主原生办法增加什么？](#detail-section-11)
  - [Q02 · 画布状态、模型执行与批准门如何从入口形成完整调用链，依赖失效怎么办？](#detail-section-12)
  - [Q03 · 什么实现边界最可能使画布任务与Agent审批的贡献不成立，哪些工程设计可复用？](#detail-section-13)
  - [Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？](#detail-section-14)
  - [Q05 · 可从画布状态、模型执行与批准门的限制推导什么可证伪改进？](#detail-section-15)
  - [Q06 · 哪些用户可以受控采用画布任务与Agent审批，何时应停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：供需要在Harness里反复生图/改图并人工控制付费请求的内容制作者使用。交付为保存的图片及参数记录；批准是一道调用前门，不是预算核算或图片质量验收。

直接图片API/独立绘图工具已有生图能力；插件价值主要在Harness交接、审批和记录，而非图片质量提升。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| ark9_generate_image | Agent文生图/参考图编辑 | 外部渠道，默认先审批；长prompt截断与渠道漂移限制 |
| ark9_list_images | 列最近输出路径/尺寸 | 本地输出目录，非所有远程任务结果 |
| 人工审批页 | 批准/拒绝待审请求 | 内存队列，尚非持久不可变授权 |
| 手动工作台 | 直接生成/改图及批次 | 按钮即提交，不走Agent审批 |
| 渠道/模型管理 | 配置API及拉模型列表 | key和兼容服务，价格/能力由上游定 |
| 提示词库 | 拉取用户JSON和收藏 | Host代理联网，不附第三方内容 |
| 生成记录/批次 | 查看部分成功与重试 | 未知账单先核查，不自动幂等 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Harness Web、tools/webServer/systemPrompt | 必需 | 工具、面板及结果通知 | 通知注入缺失会降级 |
| 兼容图片API渠道、key、model | 生图必需 | generations/edits请求 | 无配置返回引导；渠道收费未知 |
| 本地读写权限 | 必需 | 读取参考图并保存输出/配置/日志 | 写错误部分被吞，需人工核对 |
| Better Sidebar / CUA | 可选 | 侧栏及悬浮位置适配 | 独立FAB仍可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 配置渠道与输出目录，保留always审批 | 确认模型及费用政策 |
| 2 | Agent提交请求，用户核对并批准 | 核对提示词、参数与渠道；拒绝不提交该请求 |
| 3 | 后台生成，用户核对文件和批次结果 | 部分成功保留已出图，超时先查记录 |
| 4 | 需重试时先核查上游账单和已有输出 | 防止未知结果下重复付费 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 渠道余额及本地资源，金额未知 | 配置API/key/模型和审批流程 | 未核实各中转价格与能力 |
| 持续使用 | 每批最多10个独立图片请求、存储 | 逐请求批准、审图与选片 | 拒绝前不提交，已提交后账单仍由上游决定 |
| 失败恢复 | 超时后上游可能已计费，重复请求再收费 | 核对批次、文件、账单与重试 | 本地任务落盘不等于上游幂等恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 付费前人工门 | 默认工具先审批，不立即调用API | 跨重启/多会话通知及审批绑定可靠性 |
| 批量交付 | n:1子任务聚合、保存部分输出 | 渠道异步协议和计费一致性 |
| 上下文节制 | 默认返回路径而非base64 | 实际token节省与多轮编辑质量 |

> **思考**：审批不是持久预算账本。prompt在createApproval截到500字符后用截断值生成，批准时startGeneration读取当前渠道而非冻结创建时渠道；任务落盘和审批/通知内存又不对称。源码支持这些状态限制，未复现实际错图或错账。参见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把图片生成的Agent意图与实际付费提交拆开，用面板批准再生成，辅以路径式改图和部分成功批次，改变人机交接位置；图片模型与API能力来自外部渠道。参见[Q01](#research-q01)、[Q02](#research-q02)。

独立图片子任务和路径返回可借鉴；持久化需要原子写与失败确认，授权对象须冻结渠道和完整prompt。复用时还需会话所有权、幂等与账单unknown状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

审批不是持久预算账本。prompt在createApproval截到500字符后用截断值生成，批准时startGeneration读取当前渠道而非冻结创建时渠道；任务落盘和审批/通知内存又不对称。源码支持这些状态限制，未复现实际错图或错账。参见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察，先在低余额独立渠道评估审批对象、长提示词、渠道切换和超时查询。需要严格预算、敏感参考图或可靠跨会话通知时暂缓；不能把“审批超时未提交”扩为所有失败零扣费。参见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

付费前审批与批次实现可核；实际渠道效果、账单与状态恢复未验证。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh-CN.md、package.json、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版Host工具、审批、渠道、任务/日志持久化、通知和参考图读取；未实际生图或执行测试。
- 下一步：在无真实计费的可追踪渠道核对完整请求摘要、切换配置、重启和并发会话；真实账单及效果另需授权实验。

**分析版本**

- **仓库**：[Aik358/dsh-ark9canvas](https://github.com/Aik358/dsh-ark9canvas)
- **版本号**：0.4.1（[固定提交 adc7072](https://github.com/Aik358/dsh-ark9canvas/tree/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1)）
- **版本日期**：2026-09-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可将批准对象改为持久不可变请求摘要，绑定完整prompt、渠道标识、参数及价格上限，输出显式未知账单状态；重启与渠道切换对照中，若批准后实际提交参数不一致或重复计费未减少则否定。会增加状态迁移与上游幂等适配成本，假设未验证。参见[Q05](#research-q05)。

在无真实计费的可追踪渠道核对完整请求摘要、切换配置、重启和并发会话；真实账单及效果另需授权实验。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 487 | — | — | 5077 |
| .mjs | source | 2 | 178 | 145 | 24 | — |
| .js | source | 2 | 2096 | 1961 | 65 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/Aik358/dsh-ark9canvas/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1 和截止 2026-10-23T01:41:11Z 范围内，画布任务与Agent审批能为明确用户提供什么可核查增量，其关键限制、总成本和采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要画布任务与Agent审批，相对手工或宿主原生办法增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要反复生图/改图且想人工控制付费请求的内容制作者，是本插件明确适用人群。合格输出是所需图片保存且参数/费用可核，而非批准卡出现或API成功；原有办法是独立图片工具或直接API，新增价值在Harness内的人机付费交接。

作者主张避免Agent盲重试烧余额，并提供手动工作台。固定源码中的门控确实把用户决策放在API前，但工具不会阻塞到批准，而是立即返回待审并用后续通知反馈。与直接图片API脚本相比，贡献在交接和可见记录，是否减少坏图或费用需同任务对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:7-22](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/README.zh-CN.md#L7-L22)

作者付费审批定位

<details>
<summary>查看原文（16行）</summary>

```text
> **v0.4.0 更新** —— 界面双语（中/英文，面板标题栏与设置页一键切换）+ 全套线性 SVG 图标替换 emoji，贴合 DeepSeek Harness 视觉语言。进化路线图：[docs/ROADMAP.md](docs/ROADMAP.md)。 —— 生图工作台全面对齐参考设计：比例网格（同款质量预算 + 16px 对齐公式）、透明背景、批量生成最多 10 张（独立子任务，部分成功也返回已完成部分）、提示词库（自定义 JSON 来源）、多渠道聚合、生成记录持久化与一键重试、配置导入导出。

DeepSeek Harness Web GUI 的**生图插件**：Agent 用一个工具按需作画，你用浮窗工作台随手出图——而 Agent 发起的每一次生图，**默认都要等你批准**，没有人点头就不会计费。

**解决的问题**：图片 API 按次计费，而 Agent 发起的生图通常是盲跑——一次坏提示词自我重试、一个循环就能烧穿余额。本插件把人放回回路：工具调用会阻塞，直到你在面板批准（或拒绝/超时，返回明确文案且零扣费）；而工作台本身永远一键可达，你自己的操作不受门控。

---

## 30 秒亮点

| | |
|---|---|
| **默认审批门控** | Agent 每次生图都进面板「审批」页等你裁决——批准 / 拒绝 / 超时；拒绝与超时绝不扣费 |
| **一个工作台，两个家** | 开箱即得悬浮 FAB + 玻璃面板；装了 `dsh-better-sidebar` 自动注册为侧栏页签；与 `dsh-cua` 同时安装时自动堆叠在它的 FAB 上方 |
| **完整尺寸系统** | 比例网格（12 档 + auto）按质量预算 + 16px 对齐公式计算；手动 W×H 带 16 倍数吸附；gpt-image 系自动吸附三个原生尺寸 |
| **批量最多 10 张** | 每张图为独立子任务聚合成一个批次——部分成功也返回已完成部分，带 ok/fail 计数 |
```

</details>

**依据 2 · 源码核查**：[lib/index.js:410-424](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/lib/index.js#L410-L424)

真实工具行为为非阻塞待审

<details>
<summary>查看原文（15行）</summary>

```text
      // ---- 审批门控(非阻塞):提交审批 → 立即返回等待文案;批准后由决策处后台生成并注入通知 ----
      if (cfg.agentApproval !== 'never') {
        const refsCount = Array.isArray(args.images) ? args.images.filter(Boolean).length : 0
        const ap = createApproval(prompt, {
          size: args.size || cfg.size, quality: args.quality || cfg.quality,
          count: args.count || 1, model: args.model || ch.model || cfg.model,
          refs: refsCount, channel: ch.name,
        }, cfg.approvalTimeoutSec)
        // 把"批准后要做什么"挂到审批记录上,决策处批准时执行
        ap.exec = {
          images: Array.isArray(args.images) ? args.images.slice() : [],
          size: args.size, quality: args.quality, count: args.count,
          model: args.model, transparent: args.transparent, returnDataUrl: !!args.returnDataUrl,
        }
        return `ark9_generate_image: 生图请求已提交并等待用户审批(审批ID ${ap.id})。**请立即在回复中告诉用户**:「生图请求已发出,请到右下角 🖼️ Ark9 生图 → 审批 页批准(或拒绝);批准后会自动生成,结果会在这里汇报」。不要等待、不要重复调用本工具、不要假装已经生成。审批结果将在后续轮次注入,届时再向用户汇报。`
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 画布状态、模型执行与批准门如何从入口形成完整调用链，依赖失效怎么办？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

完整链路为Harness工具提交参数→内存approval→立即返回待审→面板批准→后台批次API→保存图片/日志→后续systemPrompt通知。需要Web/tools/systemPrompt、有效兼容渠道/key/model和本地读写；用户应先配独立小额渠道、保持always、核批准内容后生成，超时先查批次/账单再重试，通知失败不能当未生成。

生成参数进入approval记录，批准路由把状态改为approved后异步调用startGeneration；后者取当前cfg/channel。参考图路径由本机readFileSync读取，图片经外部渠道处理，不能把本地保存等同于不外发。任务/日志写JSON但approval和通知仅内存，重启恢复语义不一致。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:102-130](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/lib/index.js#L102-L130)

内存审批与截断prompt

<details>
<summary>查看原文（29行）</summary>

```text
// ---------- 审批(内存) ----------
const approvals = new Map()
/** 审批结果通知队列:批准后生成结果/用户拒绝/超时取消 → 经 systemPrompt.context 注入下一轮,模型看到后向用户汇报。 */
const pendingNotifications = [] // {text, at}
function pushNotification(text) {
  pendingNotifications.push({ text: String(text).slice(0, 2000), at: Date.now() })
  if (pendingNotifications.length > 20) pendingNotifications.splice(0, pendingNotifications.length - 20)
}
function createApproval(prompt, params, timeoutSec) {
  const id = 'ap_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8)
  const ap = {
    id, prompt: String(prompt).slice(0, 500), params: params || {},
    status: 'pending', createdAt: Date.now(), decidedAt: null,
    timeoutTimer: null,
  }
  // 超时自动取消(未扣费),并注入通知让模型提醒用户
  const sec = Math.max(5, Math.min(600, Math.floor(Number(timeoutSec) || 120)))
  ap.timeoutTimer = setTimeout(() => {
    if (ap.status !== 'pending') return
    ap.status = 'expired'
    ap.decidedAt = Date.now()
    pushNotification(`[Ark9 生图] 审批超时已取消:Agent 的生图请求「${ap.prompt}」等待 ${sec}s 无人处理,已取消、未扣费。如需该图可让用户重新发起。`)
  }, sec * 1000)
  approvals.set(id, ap)
  if (approvals.size > 50) {
    const oldest = [...approvals.values()].sort((a, b) => a.createdAt - b.createdAt)[0]
    if (oldest) { try { clearTimeout(oldest.timeoutTimer) } catch (_) {} approvals.delete(oldest.id) }
  }
  return ap
```

</details>

**依据 2 · 源码核查**：[lib/index.js:366-374](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/lib/index.js#L366-L374)

生成时读取当前渠道

```text
  function startGeneration(bodyObj, refs, count) {
    const ch = activeChannel(cfg)
    const n = Math.max(1, Math.min(10, Math.floor(Number(count) || 1)))
    const params = {
      model: bodyObj.model || ch.model || cfg.model, prompt: bodyObj.prompt,
      quality: bodyObj.quality || cfg.quality, size: bodyObj.size || cfg.size,
      background: bodyObj.background === 'transparent' ? 'transparent' : undefined,
    }
    return submitBatch(ch, params, refs, n)
```

**依据 3 · 源码核查**：[lib/index.js:604-640](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/lib/index.js#L604-L640)

批准后生成与保存链

<details>
<summary>查看原文（37行）</summary>

```text
          })
        }
        if (req.method === 'POST') {
          const body = await readJsonBody(req)
          const ap = approvals.get(body && body.id)
          if (!ap) return writeJson(res, 404, { error: 'approval not found' })
          if (ap.status !== 'pending') return writeJson(res, 200, { ok: true, status: ap.status })
          ap.status = body.decision === 'approve' ? 'approved' : 'denied'
          ap.decidedAt = Date.now()
          if (ap.timeoutTimer) { try { clearTimeout(ap.timeoutTimer) } catch (_) {} ap.timeoutTimer = null }
          // 决策后触发:批准→后台生成+注入通知;拒绝→注入通知(让模型向用户汇报)
          if (ap.status === 'denied') {
            pushNotification(`[Ark9 生图] 用户拒绝了 Agent 的生图请求「${ap.prompt}」。如用户仍想要图,询问其想如何调整(提示词/参数)后重新发起。`)
          } else if (ap.status === 'approved') {
            void (async () => {
              const exec = ap.exec || {}
              const refInputs = Array.isArray(exec.images) ? exec.images : []
              const refs = []
              for (const [i, r] of refInputs.entries()) {
                const norm = normalizeRef(r, i)
                if (norm) refs.push(norm)
              }
              const count = Math.max(1, Math.min(10, Math.floor(Number(exec.count) || 1)))
              const batchId = startGeneration({
                prompt: ap.prompt, model: exec.model, size: exec.size, quality: exec.quality,
                background: exec.transparent ? 'transparent' : undefined,
              }, refs, count)
              const view = await awaitTask(batchId, 420000)
              if (view.status === 'timeout') {
                pushNotification(`[Ark9 生图] 已批准的生成「${ap.prompt}」超时,批次 ${batchId} 仍在后台。可稍后查看面板「记录」或用 ark9_list_images。`)
                return
              }
              if (view.status === 'failed') {
                pushNotification(`[Ark9 生图] 已批准的生成「${ap.prompt}」失败: ${(view.error && view.error.message) || '未知错误'}。可调整后重新发起。`)
                return
              }
              const saved = await saveTaskResults(view, outputDir(cfg))
```

</details>

**依据 4 · 源码核查**：[lib/index.js:175-182](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/lib/index.js#L175-L182)

参考图可读取存在的本地文件

```text
function normalizeRef(input, idx) {
  const s = String(input || '')
  const m = s.match(/^data:(.*?);base64,(.*)$/s)
  if (m) return { contentType: m[1] || 'image/png', buf: Buffer.from(m[2], 'base64'), filename: `ref-${idx}.png` }
  const p = s.replace(/^file:\/\//, '')
  if (p && existsSync(p)) {
    try { return { contentType: 'image/png', buf: readFileSync(p), filename: path.basename(p) } } catch { return null }
  }
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么实现边界最可能使画布任务与Agent审批的贡献不成立，哪些工程设计可复用？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

关键限制是用户批准的东西是否等于上游收到的东西。创建审批仅保留500字符prompt，用ap.prompt执行；展示channel名称并未在ap.exec固定渠道，排队期间切换设置可能改变提交目标。通知队列全局消费且只保留近期项，不按发起session定向。工程上独立子任务与部分成功值得借鉴，但同步JSON覆盖和吞写错误不提供事务确认。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:110-124](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/lib/index.js#L110-L124)

prompt截断进入审批对象

<details>
<summary>查看原文（15行）</summary>

```text
function createApproval(prompt, params, timeoutSec) {
  const id = 'ap_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8)
  const ap = {
    id, prompt: String(prompt).slice(0, 500), params: params || {},
    status: 'pending', createdAt: Date.now(), decidedAt: null,
    timeoutTimer: null,
  }
  // 超时自动取消(未扣费),并注入通知让模型提醒用户
  const sec = Math.max(5, Math.min(600, Math.floor(Number(timeoutSec) || 120)))
  ap.timeoutTimer = setTimeout(() => {
    if (ap.status !== 'pending') return
    ap.status = 'expired'
    ap.decidedAt = Date.now()
    pushNotification(`[Ark9 生图] 审批超时已取消:Agent 的生图请求「${ap.prompt}」等待 ${sec}s 无人处理,已取消、未扣费。如需该图可让用户重新发起。`)
  }, sec * 1000)
```

</details>

**依据 2 · 源码核查**：[lib/index.js:413-423](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/lib/index.js#L413-L423)

exec未保存渠道标识

<details>
<summary>查看原文（11行）</summary>

```text
        const ap = createApproval(prompt, {
          size: args.size || cfg.size, quality: args.quality || cfg.quality,
          count: args.count || 1, model: args.model || ch.model || cfg.model,
          refs: refsCount, channel: ch.name,
        }, cfg.approvalTimeoutSec)
        // 把"批准后要做什么"挂到审批记录上,决策处批准时执行
        ap.exec = {
          images: Array.isArray(args.images) ? args.images.slice() : [],
          size: args.size, quality: args.quality, count: args.count,
          model: args.model, transparent: args.transparent, returnDataUrl: !!args.returnDataUrl,
        }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:627-640](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/lib/index.js#L627-L640)

批准使用ap.prompt

<details>
<summary>查看原文（14行）</summary>

```text
              const batchId = startGeneration({
                prompt: ap.prompt, model: exec.model, size: exec.size, quality: exec.quality,
                background: exec.transparent ? 'transparent' : undefined,
              }, refs, count)
              const view = await awaitTask(batchId, 420000)
              if (view.status === 'timeout') {
                pushNotification(`[Ark9 生图] 已批准的生成「${ap.prompt}」超时,批次 ${batchId} 仍在后台。可稍后查看面板「记录」或用 ark9_list_images。`)
                return
              }
              if (view.status === 'failed') {
                pushNotification(`[Ark9 生图] 已批准的生成「${ap.prompt}」失败: ${(view.error && view.error.message) || '未知错误'}。可调整后重新发起。`)
                return
              }
              const saved = await saveTaskResults(view, outputDir(cfg))
```

</details>

**依据 4 · 源码核查**：[lib/index.js:769-785](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/lib/index.js#L769-L785)

通知消费不检查发起会话

<details>
<summary>查看原文（17行）</summary>

```text
    const disposeCtx = ctx.systemPrompt.context({
      name: 'dsh:ark9-canvas-pre',
      order: 9990,
      text: (context) => {
        try {
          const arr = pendingNotifications.slice(-4)
          if (!arr.length) return ''
          const now = Date.now()
          // 只注入最近 10 分钟内、且尚未被消费的通知(取走即清)
          const fresh = arr.filter((n) => now - n.at <= 10 * 60 * 1000)
          if (!fresh.length) return ''
          // 按 id 消费:记录已注入过的
          const uniq = fresh.filter((n) => !(injectSeen.has(n)))
          uniq.forEach((n) => injectSeen.add(n))
          if (!uniq.length) return ''
          const body = uniq.map((n) => n.text).join('\n\n')
          return '<ark9_approval_notice>\n' + body + '\n</ark9_approval_notice>\n注意:以上是生图审批的最新结果,请据此刻你的角色向用户汇报(批准→报图片路径与效果;拒绝→询问想怎么改;超时→提醒可重新发起)。'
```

</details>

#### 缺口

- 渠道切换、重启与并发请求的真实行为缺少验收
  **影响**：付费控制可靠性不确定
  **进一步探讨**：以可追踪的mock渠道记录批准内容与实际提交，并对照重启/会话隔离

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？

**研究主题**：效果与总成本

#### 完整回答

首次投入是配置渠道/key/model、输出目录并确认审批流程；持续投入是图片API按次费用、本地存储及人工批准/审图；失败恢复还要查已计费上游、批次部分产出与文件保存，避免未知结果重发。金额、每合格图耗时和门控净节省未知，不能用默认审批保证所有错误零扣费。

一次合格任务应按用户选中的可用图片而非API200计量。n个子任务可能并行占费用，图片质量失败仍可能计费；保存失败、通知遗漏及重新生成会增加人工和现金负担。超时返回说明后台继续，必须先查已生成文件与上游状态再重试。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:438-456](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/lib/index.js#L438-L456)

批次等待、超时和日志

<details>
<summary>查看原文（19行）</summary>

```text
      const count = Math.max(1, Math.min(10, Math.floor(Number(args.count) || 1)))
      const batchId = startGeneration({
        prompt, model: args.model, size: args.size, quality: args.quality,
        background: args.transparent ? 'transparent' : undefined,
      }, refs, count)
      const view = await awaitTask(batchId)
      if (view.status === 'timeout') return `ark9_generate_image: 生成超时,批次 ${batchId} 仍在后台处理。可用 ark9_list_images 稍后查看产出。`
      if (view.status === 'failed') return 'ark9_generate_image: 生成失败 — ' + (view.error && view.error.message || '未知错误')

      const saved = await saveTaskResults(view, outputDir(cfg))
      const lines = saved.map((s) => `${s.index}. ${s.path || s.url}${s.width ? ` (${s.width}x${s.height}, ${s.sizeKB}KB)` : ''}`)
      let out = `图片生成成功,共 ${saved.length} 张${view.failCount ? `(另有 ${view.failCount} 张失败)` : ''}:\n${lines.join('\n')}\n\n已保存到 ${outputDir(cfg)}。引用某张图继续修改时,把它的路径传给 images 参数。`
      addLog({
        id: batchId, prompt: prompt.slice(0, 200),
        params: { size: args.size || cfg.size, quality: args.quality || cfg.quality, count, model: args.model || ch.model || cfg.model, refs: refs.length, transparent: !!args.transparent },
        status: view.failCount ? 'partial' : 'succeeded', ok: saved.length, fail: view.failCount || 0, total: count,
        images: saved.map((s) => ({ path: s.path, width: s.width, height: s.height, sizeKB: s.sizeKB })),
        error: view.failCount ? (view.error && view.error.message) || '' : '',
        source: 'agent', createdAt: Date.now(), finishedAt: Date.now(),
```

</details>

**依据 2 · 源码核查**：[lib/index.js:94-98](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/lib/index.js#L94-L98)

任务JSON写失败被吞

```text
function saveTasks() {
  try {
    mkdirSync(path.dirname(TASKS_FILE), { recursive: true })
    writeFileSync(TASKS_FILE, JSON.stringify([...tasks.values()]), 'utf-8')
  } catch {}
```

**依据 3 · 源码核查**：[lib/index.js:633-637](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/lib/index.js#L633-L637)

批准后超时仍在后台

```text
                pushNotification(`[Ark9 生图] 已批准的生成「${ap.prompt}」超时,批次 ${batchId} 仍在后台。可稍后查看面板「记录」或用 ark9_list_images。`)
                return
              }
              if (view.status === 'failed') {
                pushNotification(`[Ark9 生图] 已批准的生成「${ap.prompt}」失败: ${(view.error && view.error.message) || '未知错误'}。可调整后重新发起。`)
```

#### 缺口

- 每合格图现金支出、审图时间及重试率无数据
  **影响**：无法判断门控的净经济收益
  **进一步探讨**：同题材同预算对照直接调用与逐请求批准，计入等待和坏图

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可从画布状态、模型执行与批准门的限制推导什么可证伪改进？

**研究主题**：新假设与验证

#### 完整回答

从创建时展示channel而批准时重新读cfg、审批未落盘而任务落盘这两处不对称，可推导不可变授权对象。它须绑定完整内容摘要、channel ID、模型和数量，禁止隐式使用更新配置；上游超时保留unknown而不重发。最小实验应覆盖500字以上prompt与排队时改渠道，分别验证一致性和成本。

本假设尚未实现或运行验证。支持标准为批准后实际请求的完整内容/渠道/参数与批准对象一致且unknown结果不自动重发；任何长prompt被改、渠道漂移或重复付费无改善都会否定可靠性主张。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:110-125](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/lib/index.js#L110-L125)

当前审批对象与超时机制

<details>
<summary>查看原文（16行）</summary>

```text
function createApproval(prompt, params, timeoutSec) {
  const id = 'ap_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8)
  const ap = {
    id, prompt: String(prompt).slice(0, 500), params: params || {},
    status: 'pending', createdAt: Date.now(), decidedAt: null,
    timeoutTimer: null,
  }
  // 超时自动取消(未扣费),并注入通知让模型提醒用户
  const sec = Math.max(5, Math.min(600, Math.floor(Number(timeoutSec) || 120)))
  ap.timeoutTimer = setTimeout(() => {
    if (ap.status !== 'pending') return
    ap.status = 'expired'
    ap.decidedAt = Date.now()
    pushNotification(`[Ark9 生图] 审批超时已取消:Agent 的生图请求「${ap.prompt}」等待 ${sec}s 无人处理,已取消、未扣费。如需该图可让用户重新发起。`)
  }, sec * 1000)
  approvals.set(id, ap)
```

</details>

**依据 2 · 源码核查**：[lib/index.js:419-423](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/lib/index.js#L419-L423)

exec字段边界

```text
        ap.exec = {
          images: Array.isArray(args.images) ? args.images.slice() : [],
          size: args.size, quality: args.quality, count: args.count,
          model: args.model, transparent: args.transparent, returnDataUrl: !!args.returnDataUrl,
        }
```

**依据 3 · 源码核查**：[lib/index.js:366-374](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/lib/index.js#L366-L374)

当前配置依赖

```text
  function startGeneration(bodyObj, refs, count) {
    const ch = activeChannel(cfg)
    const n = Math.max(1, Math.min(10, Math.floor(Number(count) || 1)))
    const params = {
      model: bodyObj.model || ch.model || cfg.model, prompt: bodyObj.prompt,
      quality: bodyObj.quality || cfg.quality, size: bodyObj.size || cfg.size,
      background: bodyObj.background === 'transparent' ? 'transparent' : undefined,
    }
    return submitBatch(ch, params, refs, n)
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些用户可以受控采用画布任务与Agent审批，何时应停止？

**研究主题**：采用判断

#### 完整回答

内容制作者若只要便捷面板，可先比较手动图片工具；本插件的差异在默认Agent审批。因批准绑定、跨会话结果及恢复缺口影响核心付费控制，本轮不建议直接持续使用。评估时限定低敏感参考图和小额额度，出现参数/渠道不一致、未确认账单或通知错会话就停用并查本地记录。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:410-424](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/lib/index.js#L410-L424)

默认审批路径

<details>
<summary>查看原文（15行）</summary>

```text
      // ---- 审批门控(非阻塞):提交审批 → 立即返回等待文案;批准后由决策处后台生成并注入通知 ----
      if (cfg.agentApproval !== 'never') {
        const refsCount = Array.isArray(args.images) ? args.images.filter(Boolean).length : 0
        const ap = createApproval(prompt, {
          size: args.size || cfg.size, quality: args.quality || cfg.quality,
          count: args.count || 1, model: args.model || ch.model || cfg.model,
          refs: refsCount, channel: ch.name,
        }, cfg.approvalTimeoutSec)
        // 把"批准后要做什么"挂到审批记录上,决策处批准时执行
        ap.exec = {
          images: Array.isArray(args.images) ? args.images.slice() : [],
          size: args.size, quality: args.quality, count: args.count,
          model: args.model, transparent: args.transparent, returnDataUrl: !!args.returnDataUrl,
        }
        return `ark9_generate_image: 生图请求已提交并等待用户审批(审批ID ${ap.id})。**请立即在回复中告诉用户**:「生图请求已发出,请到右下角 🖼️ Ark9 生图 → 审批 页批准(或拒绝);批准后会自动生成,结果会在这里汇报」。不要等待、不要重复调用本工具、不要假装已经生成。审批结果将在后续轮次注入,届时再向用户汇报。`
```

</details>

**依据 2 · 源码核查**：[lib/index.js:769-785](https://github.com/Aik358/dsh-ark9canvas/blob/adc7072ad4d76ba2c57a81a8cdec85a0d42afdc1/lib/index.js#L769-L785)

全局结果通知边界

<details>
<summary>查看原文（17行）</summary>

```text
    const disposeCtx = ctx.systemPrompt.context({
      name: 'dsh:ark9-canvas-pre',
      order: 9990,
      text: (context) => {
        try {
          const arr = pendingNotifications.slice(-4)
          if (!arr.length) return ''
          const now = Date.now()
          // 只注入最近 10 分钟内、且尚未被消费的通知(取走即清)
          const fresh = arr.filter((n) => now - n.at <= 10 * 60 * 1000)
          if (!fresh.length) return ''
          // 按 id 消费:记录已注入过的
          const uniq = fresh.filter((n) => !(injectSeen.has(n)))
          uniq.forEach((n) => injectSeen.add(n))
          if (!uniq.length) return ''
          const body = uniq.map((n) => n.text).join('\n\n')
          return '<ark9_approval_notice>\n' + body + '\n</ark9_approval_notice>\n注意:以上是生图审批的最新结果,请据此刻你的角色向用户汇报(批准→报图片路径与效果;拒绝→询问想怎么改;超时→提醒可重新发起)。'
```

</details>

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
