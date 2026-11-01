# DSH Tavern

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[2a8e613](https://github.com/flizzywine/dsh-tavern/tree/2a8e61360625069031b624560e28389b0ea0f20b)

<!-- BEGIN META -->
[![GitHub ★ 1,416](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C416&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/flizzywine/dsh-tavern) [![npm 30d 1,395](https://img.shields.io/static/v1?label=npm+30d&message=1%2C395&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-profile-tavern) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-profile-tavern)
<!-- END META -->

> **功能**：基于 DSH 的人物卡角色对话应用，分离正文生成与后台状态结算。

> **亮点**：将卡片、对话与变量后台结算组合，并隔离正文与派生状态失败。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：正文完成不保证变量结算或第三方卡片脚本兼容。[Q03](#research-q03)

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
  - [Q01 · 酒馆适合谁，和普通聊天相比做了什么？](#detail-section-11)
  - [Q02 · 前台提交与后台变量结算怎样保持版本边界？](#detail-section-12)
  - [Q03 · 正文成功是否保证变量结算和卡片脚本成功？](#detail-section-13)
  - [Q04 · 远程、资产与模型的成本和风险怎样处理？](#detail-section-14)
  - [Q05 · 已有回执和重试之外如何帮助用户判断过期结算？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用人物卡和世界书进行角色对话的用户；基线是普通聊天或其他酒馆工具。[Q01](#research-q01)

普通聊天手动维护角色设定与状态。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 角色资产 | 对话设定 | 不保证所有脚本兼容 |
| 正文 | 生成并保存剧情 | 模型与内容质量未知 |
| 后台 | 更新变量状态 | 失败或过期需核查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| DSH 与模型 | 必需 | 对话及后台 | 无法生成 |
| 可信人物卡及资源 | 卡片功能需要 | 角色和状态 | 简化或停止 |
| 备份与预算 | 试用需要 | 恢复及费用管理 | 不运行 |
| 可信网络或 VPN | 远程时需要 | 保护访问 | 留在本机 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 用户备份数据、设置模型预算并选可信卡 | 备份可读、来源可信 |
| 2 | 本机开启对话并观察正文 | 生成失败则检查宿主与模型 |
| 3 | 检查变量回执与版本 | 失败或过期时由用户决定是否重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主与模型 | 配卡与备份 | 兼容逐项核实 |
| 持续 | 前后台模型调用 | 检查故事和状态 | 延迟与费用未测 |
| 恢复 | 重试可能再付费 | 查看回执 | 不保证所有脚本兼容 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 正文 | checkpoint 与 revision | 文学质量和速度 |
| 结算 | 版本比较与 stale 状态 | 所有卡片语义正确 |

> **思考**：正文完成不保证变量结算或第三方卡片脚本兼容。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将卡片、对话与变量后台结算组合，并隔离正文与派生状态失败。[Q01](#research-q01) [Q02](#research-q02)

正文与派生结算分开，版本过期不作为当前结果；回执与重试仍需用户判断。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

正文完成不保证变量结算或第三方卡片脚本兼容。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

本机可信卡先测正文、回执与恢复，远程时保护凭证。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持正文 revision 与 stale 判断；未运行宿主、模型或第三方卡。

- 已检查：作者 README、包清单、源码路径 README.md、docs/feature-inventory.md、docs/adr/0006-foreground-commits-before-derived-settlement.md、tavern-plugin/package.json、tavern-plugin/lib/domain/story-timeline.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 2655 文件、409 排除、零解析错误；仅静态追踪关键时间线和文档，未运行目标。
- 下一步：固定版本与可信卡，在隔离数据测试正文成功、后台失败、回退和重试。

**分析版本**

- **仓库**：[flizzywine/dsh-tavern](https://github.com/flizzywine/dsh-tavern)
- **版本号**：3.2.0（[固定提交 2a8e613](https://github.com/flizzywine/dsh-tavern/tree/2a8e61360625069031b624560e28389b0ea0f20b)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：在已有回执和版本保护之外展示过期前后差异，可帮助用户决定是否重算。[Q05](#research-q05)

固定版本与可信卡，在隔离数据测试正文成功、后台失败、回退和重试。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 97 | 14089 | 12721 | 964 | — |
| .md | source | 111 | 7825 | — | — | 162102 |
| .js | source | 1126 | 274318 | 233699 | 34021 | — |
| .cjs | source | 256 | 40249 | 33648 | 6208 | — |
| .md | example | 12 | 567 | — | — | 10140 |
| .mjs | example | 81 | 4249 | 3840 | 302 | — |
| .js | example | 2 | 69 | 59 | 7 | — |
| .mjs | test | 962 | 83240 | 76494 | 2829 | — |
| .ts | source | 4 | 274 | 248 | 6 | — |
| .md | test | 3 | 267 | — | — | 6643 |
| .cjs | example | 1 | 118 | 109 | 4 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/flizzywine/dsh-tavern/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 112](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=112&color=737b86&logo=github)](https://github.com/flizzywine/dsh-tavern/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 112](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=112&color=737b86&logo=github)](https://github.com/flizzywine/dsh-tavern/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：角色对话前台和变量后台怎样提交，兼容与重试的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 酒馆适合谁，和普通聊天相比做了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

喜欢人物卡和世界书角色对话的用户可在 DSH 使用角色资产与状态展示；作者描述前台正文与后台变量结算分工。相对普通聊天可组织角色状态，但需要兼容的卡、模型和资源，作者对速度、质量的宣称没有本轮实测。文档明确卡片格式支持不代表全部第三方脚本兼容。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-24](https://github.com/flizzywine/dsh-tavern/blob/2a8e61360625069031b624560e28389b0ea0f20b/README.md#L10-L24)

作者描述产品、分工及性能宣称。

<details>
<summary>查看原文（15行）</summary>

```text
# DSH Tavern

**基于 DSH（DeepSeek Harness）的 Agent 酒馆。兼容 SillyTavern 生态，人物卡导入就能玩。**

更快 · 更稳 · 更鲜活 · 所有模型都能用 · 手机也能玩

[![观看 3 分钟实机演示：兼容酒馆生态，更快、更稳、更鲜活](docs/images/readme/promo-video.jpg)](https://www.bilibili.com/video/BV1MHaU6NE7S/)

[下载安装](#快速开始) · [使用文档](https://github.com/flizzywine/dsh-tavern/wiki) · [宣传视频](https://www.bilibili.com/video/BV1MHaU6NE7S/) · [Discord 交流群](https://discord.gg/hYAEjKnpra)

- **兼容 SillyTavern 生态**：人物卡、世界书、预设、正则美化、MVU、酒馆助手脚本，导入就能用。
- **更快**：一轮约 10 秒，缓存命中率 95% 以上。
- **更稳**：状态栏不再掉格式。变量由后台按规则结算，每轮附更新结果，失败可单独重试；更新与重装都保留数据。
- **更鲜活**：同样的模型、同样的预设，比原版酒馆更有活人感。因为前台模型只管写正文，变量结算等任务性工作交给后台模型。
- **手机也能玩**：Android 手机直接安装；电脑上运行的酒馆，手机扫码就能远程游玩。
```

</details>

**依据 2 · 作者声明**：[docs/feature-inventory.md:50-58](https://github.com/flizzywine/dsh-tavern/blob/2a8e61360625069031b624560e28389b0ea0f20b/docs/feature-inventory.md#L50-L58)

作者说明卡片、MVU 和脚本兼容边界。

```text

| 酒馆资源或能力 | 当前支持 | 需要说明的边界 |
| --- | --- | --- |
| 人物卡 | 导入 PNG / JSON，查看与编辑，导出 JSON | 支持卡片格式不等于支持卡内全部第三方脚本；不宣称支持 PNG 导出。 |
| 世界书 | 导入、编辑和关联；支持常驻背景与按规则召回 | 保留字段不等于完整复现原酒馆的全部触发语义。 |
| 预设 | 导入、选择、编辑提示词与正则，用于游玩正文 | 按 DSH Tavern 的方式应用，效果可能与原酒馆不同；无需预设也能开始。 |
| 正则 | 使用人物卡及预设中的受支持正则处理与美化内容 | 按具体规则、作用位置与运行支持判断效果。 |
| MVU | 后台变量结算、更新回执与右侧常驻状态栏 | 需要人物卡具备相应结构和资源，不保证任意卡或脚本自动适配。 |
| 前端美化 | 正文内 HTML 展示与人物卡状态面板 | 展示 HTML 不等于实现所有浏览器脚本和酒馆宿主接口。 |
```

#### 缺口

- 未运行 DSH、模型、人物卡或移动端
  **影响**：不能确认第三方兼容、生成质量和真实延迟
  **进一步探讨**：固定宿主、卡片和模型，测试前台提交、失败恢复与过期结果

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 前台提交与后台变量结算怎样保持版本边界？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

timeline 的正文提交创建 checkpoint、增加 revision，并把后台状态设为 pending；完成操作时核对 branch/revision，不匹配的 running 操作标 stale。设计文档说明正文成功不等待派生结算，结算失败保留正文、可手动重试。这是静态路径与设计，不证明所有持久化故障下数据安全。

#### 证据与依据

**依据 1 · 源码核查**：[tavern-plugin/lib/domain/story-timeline.js:19-20](https://github.com/flizzywine/dsh-tavern/blob/2a8e61360625069031b624560e28389b0ea0f20b/tavern-plugin/lib/domain/story-timeline.js#L19-L20)

比较 branch 和 revision。

```text
function sameBasedOn(left, right) {
  return str(left && left.branchId) === str(right && right.branchId) && Number(left && left.revision) === Number(right && right.revision)
```

**依据 2 · 源码核查**：[tavern-plugin/lib/domain/story-timeline.js:203-220](https://github.com/flizzywine/dsh-tavern/blob/2a8e61360625069031b624560e28389b0ea0f20b/tavern-plugin/lib/domain/story-timeline.js#L203-L220)

正文 checkpoint 和 revision 及后台 pending。

<details>
<summary>查看原文（18行）</summary>

```text
  function commitBody(chat, operation) {
    chat.timeline.checkpoints.push({
      id: makeId('checkpoint'),
      turn: operation.turn,
      userText: operation.userText,
      beforeRevision: Math.max(0, Number(operation.beforeRevision) || 0),
      participants: clone(operation.beforeParticipants),
      committedAt: now()
    })
    chat.timeline.checkpoints = chat.timeline.checkpoints.slice(-40)
    chat.candidates = null
    chat.timeline.revision++
    operation.status = 'completed'
    operation.completedAt = now()
    operation.committedBranchId = chat.timeline.branchId
    operation.committedRevision = chat.timeline.revision
    operation.background = { phase: 'pending', role: 'settlement', updatedAt: now() }
  }
```

</details>

**依据 3 · 源码核查**：[tavern-plugin/lib/domain/story-timeline.js:644-655](https://github.com/flizzywine/dsh-tavern/blob/2a8e61360625069031b624560e28389b0ea0f20b/tavern-plugin/lib/domain/story-timeline.js#L644-L655)

过期操作标 stale。

<details>
<summary>查看原文（12行）</summary>

```text
  function complete(input) {
    // Scoped callers supply detached selected rows, indexed by original floor.
    // Normalize metadata without serializing an N-element sparse array.
    const scoped = Array.isArray(input?.messageIndices)
    const chat = ensure(scoped ? {...input.chat, messages: []} : input && input.chat)
    if (scoped) {
      chat.messages = createScopedMessages(input.chat.messages.length,
        input.messageIndices.map(id => [id, clone(input.chat.messages[id])]))
    }
    const operation = chat.timeline.operations[str(input && input.operationId)]
    if (operation === undefined || operation.status !== 'running' || !sameBasedOn(operation.basedOn, input && input.basedOn) || !sameBasedOn(operation.basedOn, basedOn(chat))) {
      if (operation !== undefined && operation.status === 'running') operation.status = 'stale'
```

</details>

**依据 4 · 作者声明**：[docs/adr/0006-foreground-commits-before-derived-settlement.md:8-16](https://github.com/flizzywine/dsh-tavern/blob/2a8e61360625069031b624560e28389b0ea0f20b/docs/adr/0006-foreground-commits-before-derived-settlement.md#L8-L16)

设计说明提交与失败边界。

```text
ADR 0004 把前台正文与后台结算设计成原子 Round。实践中，后台 Agent 偶发未调用提交工具时，系统会撤销已经成功且来之不易的正文；失败状态还会阻塞下一轮。后台派生工作的可靠性因此错误地成为正文可用性的前置条件。

## 决定

Foreground Turn 成功后立即提交正文、checkpoint 与新的 Story Timeline revision。状态结算是绑定该正文 branch/revision 的派生 Background Operation：成功时只提交姿势、变量和回执；失败时保留正文、记录错误并提供手动重试，但不阻塞下一次 Foreground Turn。

正文重新生成采用同一边界：新正文一旦生成和提交成功，就替换旧正文与模型 Surface；随后的结算失败不得触发 `replacement.abort`。只有前台生成、正文校验或正文提交失败时才恢复旧正文。

任何结算结果在应用前必须同时匹配其绑定的 branch 与 revision。若用户已回退、重新生成或提交了下一轮正文，旧结算结果成为 stale，不得覆盖当前派生状态。旧版停留在 `foreground-completed` 的存档在读取时惰性迁移为已提交正文，使既有失败会话也能继续。
```

#### 缺口

- 未运行 DSH、模型、人物卡或移动端
  **影响**：不能确认第三方兼容、生成质量和真实延迟
  **进一步探讨**：固定宿主、卡片和模型，测试前台提交、失败恢复与过期结果

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 正文成功是否保证变量结算和卡片脚本成功？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

否。前台和后台分离允许正文成功而状态暂时落后，迟到结果可标 stale；文档描述回执区分失败、部分成功和过期，并允许重试。资产格式兼容不意味着第三方脚本、模型输出或变量语义正确；用户应查看回执再决定是否重试，不应把旧状态当成本轮确认结果。

#### 证据与依据

**依据 1 · 作者声明**：[docs/adr/0006-foreground-commits-before-derived-settlement.md:10-22](https://github.com/flizzywine/dsh-tavern/blob/2a8e61360625069031b624560e28389b0ea0f20b/docs/adr/0006-foreground-commits-before-derived-settlement.md#L10-L22)

作者描述失败、重试和过期。

<details>
<summary>查看原文（13行）</summary>

```text
## 决定

Foreground Turn 成功后立即提交正文、checkpoint 与新的 Story Timeline revision。状态结算是绑定该正文 branch/revision 的派生 Background Operation：成功时只提交姿势、变量和回执；失败时保留正文、记录错误并提供手动重试，但不阻塞下一次 Foreground Turn。

正文重新生成采用同一边界：新正文一旦生成和提交成功，就替换旧正文与模型 Surface；随后的结算失败不得触发 `replacement.abort`。只有前台生成、正文校验或正文提交失败时才恢复旧正文。

任何结算结果在应用前必须同时匹配其绑定的 branch 与 revision。若用户已回退、重新生成或提交了下一轮正文，旧结算结果成为 stale，不得覆盖当前派生状态。旧版停留在 `foreground-completed` 的存档在读取时惰性迁移为已提交正文，使既有失败会话也能继续。

## 结果

- 后台失败不会让成功正文消失，也不会锁死下一轮。
- 每轮正文都有独立 checkpoint，显式回退仍按正文逐轮工作。
- 后台状态允许暂时落后于正文；最新轮次可重试结算，过期结果直接丢弃。
```

</details>

**依据 2 · 作者声明**：[docs/feature-inventory.md:307-313](https://github.com/flizzywine/dsh-tavern/blob/2a8e61360625069031b624560e28389b0ea0f20b/docs/feature-inventory.md#L307-L313)

作者描述回执、重试和召回限制。

```text
| 编号 | 文档主题 | 入口 / 类型 | 要介绍的内容与边界 |
| --- | --- | --- | --- |
| D01 | 人物姿势 | 本局设置 → 功能 / 自动 | 后台每轮总结人物位置、动作和姿势，交给前台保持前后一致，并显示在酒馆状态里；在本局设置中开关。 |
| D02 | MVU 变量与常驻状态栏 | 界面 / 自动 | 支持的 MVU 卡后台更新变量，状态栏常驻右侧；卡片本身需要对应资源。 |
| D03 | 阅读本轮变量结算回执 | 界面：正文下方变量回执 | 展开变更前后值、原因、脚本联动与失败项；区分已更新、未变化、部分成功、过期和中断。 |
| D04 | 重试后台结算 | 界面：状态栏 / 变量回执 | 后台结算和变量结算失败时重试；不要求为了重试状态而重写已经满意的正文。 |
| D05 | 世界书自动补充背景 | 自动 | 常驻条目与关键词召回；主词、辅助条件、正则等按已实现规则处理；当前召回有数量与冷却限制。 |
```

**依据 3 · 作者声明**：[docs/feature-inventory.md:50-58](https://github.com/flizzywine/dsh-tavern/blob/2a8e61360625069031b624560e28389b0ea0f20b/docs/feature-inventory.md#L50-L58)

脚本兼容限制。

```text

| 酒馆资源或能力 | 当前支持 | 需要说明的边界 |
| --- | --- | --- |
| 人物卡 | 导入 PNG / JSON，查看与编辑，导出 JSON | 支持卡片格式不等于支持卡内全部第三方脚本；不宣称支持 PNG 导出。 |
| 世界书 | 导入、编辑和关联；支持常驻背景与按规则召回 | 保留字段不等于完整复现原酒馆的全部触发语义。 |
| 预设 | 导入、选择、编辑提示词与正则，用于游玩正文 | 按 DSH Tavern 的方式应用，效果可能与原酒馆不同；无需预设也能开始。 |
| 正则 | 使用人物卡及预设中的受支持正则处理与美化内容 | 按具体规则、作用位置与运行支持判断效果。 |
| MVU | 后台变量结算、更新回执与右侧常驻状态栏 | 需要人物卡具备相应结构和资源，不保证任意卡或脚本自动适配。 |
| 前端美化 | 正文内 HTML 展示与人物卡状态面板 | 展示 HTML 不等于实现所有浏览器脚本和酒馆宿主接口。 |
```

#### 缺口

- 未运行 DSH、模型、人物卡或移动端
  **影响**：不能确认第三方兼容、生成质量和真实延迟
  **进一步探讨**：固定宿主、卡片和模型，测试前台提交、失败恢复与过期结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 远程、资产与模型的成本和风险怎样处理？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH、模型、人物卡资源和本地存储；远程端口作者明确说明具远程代码执行能力，token 是凭证且普通 HTTP 不加密。先在本机用可信卡与非敏感内容测试，配置模型预算和数据备份；需要远程时按作者建议使用可信内网或加密 VPN。兼容、实际费用和移动端运行未测，异常时停止并恢复备份。

#### 证据与依据

**依据 1 · 源码核查**：[tavern-plugin/package.json:1-18](https://github.com/flizzywine/dsh-tavern/blob/2a8e61360625069031b624560e28389b0ea0f20b/tavern-plugin/package.json#L1-L18)

包与运行依赖。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "dsh-tavern-plugin",
  "version": "3.2.0",
  "private": true,
  "type": "module",
  "main": "lib/index.js",
  "dependencies": {
    "jsdom": "26.1.0",
    "@jsquash/jpeg": "1.6.0",
    "@jsquash/png": "3.1.1",
    "@jsquash/webp": "1.5.0",
    "@deepseek-ai/dsh-subagent": ">=0.2.0-rc.1 <0.3.0",
    "@deepseek-ai/dsh-tools": ">=0.2.0-rc.1 <0.3.0",
    "@deepseek-ai/dsh-typert-protocol": ">=0.2.0-rc.1 <0.3.0",
    "chevrotain": "^11.2.0",
    "marked": "16.3.0",
    "yaml": "2.9.0",
    "acorn": "8.15.0",
```

</details>

**依据 2 · 作者声明**：[README.md:211-215](https://github.com/flizzywine/dsh-tavern/blob/2a8e61360625069031b624560e28389b0ea0f20b/README.md#L211-L215)

作者声明远程访问与安全边界。

```text
仅 CLI 生效，不改变桌面版 / Android 宿主。可与 `DSH_TAVERN_PORT` 一起使用；不支持通配地址（`0.0.0.0` / `::`）、域名、URL 或带作用域 ID 的 IPv6（如 `fe80::1%eth0`）。地址必须已分配给本机，否则启动失败，不会回退到其他网卡。

`status`、`open`、重复 `start` 和 `stop` 使用进程记录里的实际地址，不需要重复设置变量。**每次新启动（包括 `restart`、更新后的重新启动）都读取当次环境变量**；希望持续使用同一地址，请在启动环境中保留它。取消变量后运行 `restart` 即恢复仅本机访问（PowerShell：`Remove-Item Env:DSH_TAVERN_BIND`）。旧版进程记录没有地址时仍按 `127.0.0.1` 处理。

**安全：这个端口具有远程代码执行能力，token 是访问凭证。** 仅在可信内网或 VPN 使用，不要直接暴露到公网，不要分享完整 token 链接；普通 HTTP 不加密，跨不可信网络应使用可信加密 VPN。此配置不会关闭鉴权，也不会自动更改防火墙、路由或 VPN。其他设备应打开启动输出中的完整地址。如果启用了 Node 环境代理（`NODE_USE_ENV_PROXY=1`），请把绑定地址加入 `NO_PROXY`（IPv6 的 URL 主机为 `[地址]`），避免自检及带 token 的链接验证经过代理；工具不会替你修改代理配置。
```

**依据 3 · 作者声明**：[README.md:20-24](https://github.com/flizzywine/dsh-tavern/blob/2a8e61360625069031b624560e28389b0ea0f20b/README.md#L20-L24)

作者描述卡片、后台与移动端。

```text
- **兼容 SillyTavern 生态**：人物卡、世界书、预设、正则美化、MVU、酒馆助手脚本，导入就能用。
- **更快**：一轮约 10 秒，缓存命中率 95% 以上。
- **更稳**：状态栏不再掉格式。变量由后台按规则结算，每轮附更新结果，失败可单独重试；更新与重装都保留数据。
- **更鲜活**：同样的模型、同样的预设，比原版酒馆更有活人感。因为前台模型只管写正文，变量结算等任务性工作交给后台模型。
- **手机也能玩**：Android 手机直接安装；电脑上运行的酒馆，手机扫码就能远程游玩。
```

#### 缺口

- 未运行 DSH、模型、人物卡或移动端
  **影响**：不能确认第三方兼容、生成质量和真实延迟
  **进一步探讨**：固定宿主、卡片和模型，测试前台提交、失败恢复与过期结果

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 已有回执和重试之外如何帮助用户判断过期结算？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：在用户要重试时展示原正文版本、当前版本与差异摘要，并要求用户决定是否重算，可能减少把过期结果误应用于新剧情。现有 timeline 已检查 branch/revision、已有回执显示过期和重试入口，故不是新增过期保护；未穷尽等价 UI，摘要可能遗漏语义。对照现有回执，用回退、重生成和连续发言场景测误判断、恢复时间和额外模型成本；无改进或误导增加则否定。

#### 证据与依据

**依据 1 · 源码核查**：[tavern-plugin/lib/domain/story-timeline.js:19-20](https://github.com/flizzywine/dsh-tavern/blob/2a8e61360625069031b624560e28389b0ea0f20b/tavern-plugin/lib/domain/story-timeline.js#L19-L20)

已有版本比较。

```text
function sameBasedOn(left, right) {
  return str(left && left.branchId) === str(right && right.branchId) && Number(left && left.revision) === Number(right && right.revision)
```

**依据 2 · 源码核查**：[tavern-plugin/lib/domain/story-timeline.js:644-655](https://github.com/flizzywine/dsh-tavern/blob/2a8e61360625069031b624560e28389b0ea0f20b/tavern-plugin/lib/domain/story-timeline.js#L644-L655)

已有 stale 检测。

<details>
<summary>查看原文（12行）</summary>

```text
  function complete(input) {
    // Scoped callers supply detached selected rows, indexed by original floor.
    // Normalize metadata without serializing an N-element sparse array.
    const scoped = Array.isArray(input?.messageIndices)
    const chat = ensure(scoped ? {...input.chat, messages: []} : input && input.chat)
    if (scoped) {
      chat.messages = createScopedMessages(input.chat.messages.length,
        input.messageIndices.map(id => [id, clone(input.chat.messages[id])]))
    }
    const operation = chat.timeline.operations[str(input && input.operationId)]
    if (operation === undefined || operation.status !== 'running' || !sameBasedOn(operation.basedOn, input && input.basedOn) || !sameBasedOn(operation.basedOn, basedOn(chat))) {
      if (operation !== undefined && operation.status === 'running') operation.status = 'stale'
```

</details>

**依据 3 · 作者声明**：[docs/feature-inventory.md:307-312](https://github.com/flizzywine/dsh-tavern/blob/2a8e61360625069031b624560e28389b0ea0f20b/docs/feature-inventory.md#L307-L312)

作者说明已有回执与重试。

```text
| 编号 | 文档主题 | 入口 / 类型 | 要介绍的内容与边界 |
| --- | --- | --- | --- |
| D01 | 人物姿势 | 本局设置 → 功能 / 自动 | 后台每轮总结人物位置、动作和姿势，交给前台保持前后一致，并显示在酒馆状态里；在本局设置中开关。 |
| D02 | MVU 变量与常驻状态栏 | 界面 / 自动 | 支持的 MVU 卡后台更新变量，状态栏常驻右侧；卡片本身需要对应资源。 |
| D03 | 阅读本轮变量结算回执 | 界面：正文下方变量回执 | 展开变更前后值、原因、脚本联动与失败项；区分已更新、未变化、部分成功、过期和中断。 |
| D04 | 重试后台结算 | 界面：状态栏 / 变量回执 | 后台结算和变量结算失败时重试；不要求为了重试状态而重写已经满意的正文。 |
```

#### 缺口

- 未运行 DSH、模型、人物卡或移动端
  **影响**：不能确认第三方兼容、生成质量和真实延迟
  **进一步探讨**：固定宿主、卡片和模型，测试前台提交、失败恢复与过期结果

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
