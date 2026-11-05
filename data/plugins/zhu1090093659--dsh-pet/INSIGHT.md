# dsh-pet

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[c41934c](https://github.com/zhu1090093659/dsh-pet/tree/c41934cc74b37e6bc9934c8473d765bae584d503)

<!-- BEGIN META -->
[![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-pet) [![npm 30d 135,425](https://img.shields.io/static/v1?label=npm+30d&message=135%2C425&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-pet) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-pet)
<!-- END META -->

> **功能**：在 DSH 网页界面显示响应会话活动的宠物，支持切换形象、摸头喂食、命名和状态气泡。

> **亮点**：插件把宿主活动投影、资源注册与可拆卸网页挂件组合，使状态反馈和形象扩展不必写死在单个角色组件里。它提供陪伴和状态查看入口，不把完成回合奖励解释为任务质量，亦不将宠物/Live2D概念归为原创。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：最影响采用的是反馈是否比原生状态增加价值而不分散注意。全局动作跟最新事件、气泡可优先当前会话，completed和测试情绪都只反映宿主结构状态；若读者把它当验收依据就会误解。积分/位置又是best-effort保存，128MiB只是部分位图预算，不能承诺业务可靠性或零资源成本。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 相对静态挂件或原生状态显示，宠物增加什么反馈？](#detail-section-11)
  - [Q02 · 多会话和子Agent活动如何成为动画及工作奖励？](#detail-section-12)
  - [Q03 · 喂食、位置与隐藏怎样保存，关闭是否恢复？](#detail-section-13)
  - [Q04 · 自定义资产和渲染器如何加载，访问与资源消耗有什么边界？](#detail-section-14)
  - [Q05 · 谁值得试用，能否推导低干扰反馈验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向偏好可选视觉陪伴的DSH网页用户，在等待/工具执行等阶段以动画和气泡显示活动，并提供摸头、喂食和形象设置；它不执行或验收业务任务。[Q01](#research-q01)

参照原生会话文字状态、静态宠物挂件或不显示额外装饰。插件新增事件联动、多会话气泡和互动状态，但不改变模型推理或任务结果，是否更愉快/少干扰取决于用户偏好和设备。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 浮动宠物与气泡 | 在网页显示会话活动 | 不等同独立桌面进程或任务验收 |
| 多会话反馈 | 查看顶层会话状态并优先当前会话 | 全局动画跟最新事件，子Agent不另列导航气泡 |
| 摸头与喂食 | 增加装饰积分并反馈反应 | 冷却/库存限制，积分不是业务绩效 |
| 改名与布局 | 保存per-pet名字、选择和位置 | 尽力持久化，成功响应不保证已写盘 |
| 隐藏/召唤与主开关 | 缩小显示或停用挂件 | 主关闭才同时拆路由/UI/poll，漏事件不补放 |
| 资源注册表 | 加载内置/自定义宠物及覆盖 | 同ID后层覆盖，查diagnostics和来源 |
| sprite2d/frames2d/Live2D路径 | 适配不同资产播放 | Live2D需额外Core，frames预算非总内存保证 |
| 受限资源路由 | 给浏览器加载注册文件 | 集合、realpath、大小及访问门限制，不是全面安全审计 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH >=0.2.2-rc.1、Node >=24.9.0 | 包声明的运行条件 | 加载host/client及当前事件接口 | 未核实目标版本兼容前不外推旧版可用 |
| webServer与客户端连接/设置/会话服务 | 网页挂件必需 | HTTP状态、资源和UI挂载 | 没有网页服务不是独立桌面宠物替代 |
| 内置或有效manifest与资源文件 | 渲染必需 | 角色动画和文案 | 无效条目跳过，查diagnostics及实际生效来源 |
| 可写DSH_HOME | 状态跨重启保留所需 | 名称、积分、位置与选择 | 写失败仍可内存运行，不能承诺持久保存 |
| 浏览器解码/Canvas或相应fallback能力 | 按renderer | 图片和帧序列播放 | 设备资源需实测，不把缓存预算当整进程限制 |
| 用户提供的Core/模型材料与适用使用许可 | Live2D路径所需 | 加载Live2D运行时和模型 | 缺Core走指引，先用内置2D避免扩大配置范围 |

服务访问依赖loopback同源或宿主可选配对通道，不是租户权限模型。[Q03](#research-q03) [Q04](#research-q04)

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户在符合声明的DSH网页环境加载内置2D | registry有有效形象且UI出现，目标环境仍需实际确认 |
| 状态检查 | 用户跑一次普通等待/工具/结束流程 | 动画/气泡与会话事件相符，不能据done认定验收 |
| 互动 | 用户摸头/喂食、改名和拖动 | 返回反应并核对库存/位置，重启检查实际保存 |
| 退出 | 用户分别测试隐藏/召唤与主开关 | 隐藏保留召唤；主关闭卸载UI/轮询及host路由 |
| 扩展 | 用户再考虑自定义帧或Live2D | 先查来源/diagnostics和资源负担，无效包退回内置形象 |

主开关与可见性不是同一状态，关闭期间漏过活动不补放。[Q02](#research-q02) [Q03](#research-q03)

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 插件/内置资产下载和本地存储；金额未知 | 兼容核对、选形象和摆放；耗时未知 | 不需额外账号支撑内置2D，但不能据此称总成本为零 |
| 持续 | 前台轮询、动画解码、CPU/GPU内存与电力；用量未知 | 看状态或被打断、调气泡强度 | 128MiB非整插件硬上限，Live2D另有资源 |
| 失败恢复 | 资源重载/重新解码和状态文件存储 | 查无效manifest、恢复内置形象、核对重启状态 | best-effort写盘可丢非关键积分/布局 |
| 扩展/退出 | 自定义资源与运行时存储，许可成本未知 | 核对素材使用条件、主关闭/移除插件 | 内置2D试用更容易收缩范围，无主任务数据迁移依赖 |

没有注意力/性能对照，不推导节时、心理或单位任务收益。[Q04](#research-q04) [Q05](#research-q05)

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 状态联动 | 官方事件和流帧投影到状态机 | 真实宿主时序/丢事件表现和理解准确性 |
| 互动与保存 | 冷却/库存/名称/布局规则有实现 | 写盘失败下跨重启保留，不是可靠计量 |
| 可退出界面 | disabled解除host路由并卸载client/poll | 当前环境关闭后的真实资源回收量 |
| 陪伴和低干扰 | 可配置形象、气泡与交互 | 长期喜好、注意力和任务质量改善 |

只解释机制，不把作者历史性能注释或演示当本轮复现。[Q01](#research-q01) [Q04](#research-q04)

> **思考**：最影响采用的是反馈是否比原生状态增加价值而不分散注意。全局动作跟最新事件、气泡可优先当前会话，completed和测试情绪都只反映宿主结构状态；若读者把它当验收依据就会误解。积分/位置又是best-effort保存，128MiB只是部分位图预算，不能承诺业务可靠性或零资源成本。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：插件把宿主活动投影、资源注册与可拆卸网页挂件组合，使状态反馈和形象扩展不必写死在单个角色组件里。它提供陪伴和状态查看入口，不把完成回合奖励解释为任务质量，亦不将宠物/Live2D概念归为原创。[Q01](#research-q01) [Q02](#research-q02)

事件投影、状态机、互动ledger和资源表分层使规则可独立检查；客户端跨bundle teardown槽与renderer幂等清理值得借鉴，移植需同样释放poll、订阅、位图和晚到异步结果。文件服务的注册集合/realpath/大小检查有具体边界，不能替代第三方资源审计；best-effort持久化与内存去重适合装饰状态，不能直接复制成业务账本。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

最影响采用的是反馈是否比原生状态增加价值而不分散注意。全局动作跟最新事件、气泡可优先当前会话，completed和测试情绪都只反映宿主结构状态；若读者把它当验收依据就会误解。积分/位置又是best-effort保存，128MiB只是部分位图预算，不能承诺业务可靠性或零资源成本。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

喜欢视觉陪伴的DSH网页用户可先只用内置2D，观察状态是否对应会话、互动是否合意、重启是否保留非关键设置，并测试主开关。不要把done或积分当任务验收；若遮挡操作、持续分心、资源明显增长或反馈误导，就关气泡或主关闭并回原生会话状态，不为装饰数据承担重要风险。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查网页挂载、事件投影、互动ledger、资源访问和清理机制。真实宿主画面、性能、长期陪伴或效率效果未验证；仅建议可逆的小范围偏好试用。低干扰策略为未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/client/index.ts、src/routes.ts、src/event-projection.ts、src/service.ts、src/ledger.ts、src/persist.ts、src/client/ui-teardown.ts、src/registry.ts、src/pair-access.ts、src/loopback.ts、src/client/renderers/frames2d.ts、src/client/renderers/live2d/runtime.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：inventory覆盖固定组件树，人工定向核查host/client入口、活动投影、奖励/互动、持久化、路由文件范围、renderer预算和teardown。未逐一审计全部玩法、语音/装饰扩展、图片许可或全部渲染器视觉；未构建、安装、启动或运行目标测试，不把测试文件数量当效果。
- 下一步：后续可在同用户固定多会话任务中交叉比较原生状态、完整宠物和克制策略，记录漏看、打断、发现时间、主任务质量及资源；另核对主关闭和重启恢复。若重要事件漏看增加或无净偏好收益则停止。本轮未执行。

**分析版本**

- **仓库**：[zhu1090093659/dsh-pet](https://github.com/zhu1090093659/dsh-pet)
- **版本号**：0.4.15（[固定提交 c41934c](https://github.com/zhu1090093659/dsh-pet/tree/c41934cc74b37e6bc9934c8473d765bae584d503)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究按用户主任务收敛提示强度，保留状态事实和展开入口，优先凸显等待过久/需要用户动作等边界。用同用户交叉比较原生状态、当前宠物和克制策略的漏看、发现时间、无关打断及主任务质量；若漏报增加或用户不愿保留，应否定收益。该策略未实现或验证，不把可爱动画当效率证明。[Q05](#research-q05)

后续可在同用户固定多会话任务中交叉比较原生状态、完整宠物和克制策略，记录漏看、打断、发现时间、主任务质量及资源；另核对主关闭和重启恢复。若重要事件漏看增加或无净偏好收益则停止。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 55 | 4146 | — | — | 60032 |
| .mjs | source | 1 | 150 | 109 | 34 | — |
| .mjs | test | 2 | 310 | 267 | 14 | — |
| .cjs | source | 1 | 169 | 138 | 21 | — |
| .ts | source | 56 | 13501 | 9141 | 3598 | — |
| .ts | test | 42 | 10145 | 8463 | 890 | — |
| .tsx | test | 10 | 3844 | 3136 | 431 | — |
| .tsx | source | 11 | 3951 | 2884 | 919 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-pet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-pet/issues?q=is%3Aissue+created%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：这个DSH网页宠物怎样把会话活动变成可关闭的陪伴反馈，其互动积分、资源加载与状态持久化有哪些实际边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对静态挂件或原生状态显示，宠物增加什么反馈？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是DSH网页界面的陪伴插件，不是独立桌面进程，也不是能替用户完成任务的Agent。它给等待模型的人一个浮动宠物，把会话准备、思考、工具调用、回复与结束状态转成动画和气泡，另有摸头、喂食、改名、位置和形象选择。可核查的合格结果是界面显示与实际会话活动一致、交互能关闭且不妨碍主任务；“更开心”“提高效率”或长期陪伴效果属于需要用户体验证据的主张。

相对静态角色贴图和原生文字状态，增量在于宿主事件接线、分会话反馈、互动状态与可扩展资源注册表。host读取registry并创建PetService，注册状态/交互/资源接口；client把PetDockEntry挂到自有DOM容器，轮询host状态并随生命周期卸载。图片/模型资源不需要每次更改宿主代码，但registry、manifest和渲染器仍有特定契约。并不声称宠物动画概念或Live2D技术由本组件原创。

适合偏好轻量视觉反馈、愿意把它当可选装饰的DSH网页用户；需要安静界面、使用屏幕阅读或资源紧张设备的人，原生状态条可能更实用。本轮没有运行浏览器或目标插件，不评价实际画面、可访问性或注意力收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-43](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/README.md#L18-L43)

作者声明多宠物、状态和互动场景，不作为陪伴或效率实测。

<details>
<summary>查看原文（26行）</summary>

```text
> A registry-driven desktop companion for DeepSeek Harness — featuring the built-in anime whale girl plus one-click installs for any custom Live2D or sprite pet from the Workshop.

While the AI model thinks, you wait — your desktop companion swims and interacts on screen. It dynamically tracks the official DeepSeek Harness session lifecycle, switching fluid animations during waiting, thinking, tool execution (Bash, code editing, web searches), reply generation, celebration on success, and alert on error; you can pat its head, feed it dried fish, and watch affinity grow. Pets are driven by an extensible asset registry rather than hard-coded logic: each pet consists of a `pet.json` manifest and an atlas image (or Live2D model pack), auto-discovered by the host at startup.

Re-engineered from desktop companion concepts into an official DSH cordis bundle (host backend + client frontend in a single integrated package).

## Features

| Feature | Description |
|---|---|
| Multi-pet registry | The host scans built-in `assets/`, the hatch-pet custom pets directory, and composed config entries; each pet is a manifest plus an atlas |
| Pet selection in settings | Visual preview cards list every registered pet (built-in assets plus user directories — the installed set); switching persists and the sprite swaps immediately. The page sits under Settings → Web Extensions → Pet, or in the standalone first-level Pet section without that parent |
| Per-pet naming | Rename from the hover panel; each pet keeps its own name (stored per pet id, migrated from the legacy flat name) |
| State animation | Official session activity → manifest-defined sequences of 9-state tracks; each track finishes its full duration before the sequence advances and the complete sequence loops |
| Head-pat interaction | Click the pet → bubble feedback + affinity +1 (10s cooldown) |
| Feeding | Hover panel 喂食 (Feed) → consumes 1 dried fish + affinity +5 (30s cooldown) |
| Treat economy | Dried-fish stock (cap 20): +1 every 30 rounds of work, +1 every 300 minutes (5 hours) — 10x rarer than the original cadence |
| Affinity | +1 per round completed; 9 levels: 幼鲸 → 伙伴 → 挚友 → 深海羁绊 → 心有灵犀 → 传说羁绊 → 神话羁绊 → 永恒之契 → 鲸生共渡 (capped at 999,999,999) |
| Dragging | Hold and drag the pet to reposition; position persisted |
| Hide/Summon | The hover panel sits below the pet (lifted above the status bubbles when there is no room below) and provides 隐藏 (Hide); after hiding, a 召唤{name} (Summon {name}) button appears |
| Witty remarks | Built-in remark library (10 lines per event) plus per-pet custom lines; success lines rotate by persisted success counts and cooldown lines by persisted rejection counts |
| Status bubbles | Only one top-level session speaks by default — the session the GUI is currently on when it is reported, otherwise the most recently active one — and the rest collapse behind a +N badge on the main bubble instead of stacking a tall column; hover the bubble (or tap the badge, for touch) to fan every session's bubble out above it and click one to jump to its session; subagent sessions report through their spawning conversation and never occupy a bubble of their own; transient interaction feedback temporarily takes priority. Bubble copy comes from generous rotating pools per scene (waiting / thinking / writing / done / failed...), tool calls map onto per-family witty lines carrying the real argument hint (e.g. 跑跑 npm test), and a long-lived scene re-phrases itself every few seconds. The pet's own status bubbles can be silenced in Settings > Pet > Status bubbles, which leaves the row to a plugin driving its own bubble surface; announcements pushed through `pet.announce` keep rendering either way |
| Inner whispers | 碎碎念: while a session streams, the pet occasionally speaks its inner voice through that session's own bubble — a fresh whisper takes over the bubble and marks it with 「」 quotes — sharing the same DeepSeek-blue glass as every status bubble, so stacked bubbles never clash — instead of stacking a second bubble — category lines woken by the SITUATION (thinking / writing / the running tool family) plus outcome lines woken only by structured results (test green from a passed test tool, error from a failed tool result, completion from a completed turn) — never from the model's words, so a discussion that merely mentions a keyword cannot wake a mood, and a whisper never quotes real content (no tool names, paths or model text); paced by cooldowns (9 s category, 5 s outcome) and an 8 s display TTL, the status copy returns after a few seconds |
| Multi-session activity | The pet is host-global: the most recent meaningful event drives the sprite animation while every active top-level session reports its own state in a separate bubble; completed turns from every session (subagents included) contribute affinity and treats |
| Voice packs and panel DIY | A per-pet voice.json plus the global $DSH_HOME/pets/.voice.json override replace every bubble word and the hover panel (button labels, stat formats, button visibility, affinity rank names); merge precedence per-pet > global > built-in, broken packs warn and never reject a pet |
| Plugin panel actions | A sibling plugin registers its own action into the hover panel's action row through the in-process pet service (`ctx.pet.registerPanelAction({ id, label, onSelect })`); the pet renders the button and dispatches the click back to the plugin's own callback, and the action goes away with the registration |
```

</details>

**依据 2 · 源码核查**：[src/index.ts:364-405](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/index.ts#L364-L405)

host实际加载registry、创建服务并注册接口，不只是资源文件。

<details>
<summary>查看原文（42行）</summary>

```text
function applyImpl(ctx: Context, config: PetPluginConfig = {}): void {
  const registry = config.registry
    ?? loadPetRegistry({
      packageRoot: petPackageRoot(import.meta.url),
      ...(config.pets === undefined ? {} : { extra: config.pets }),
    })
  const service = new PetService(ctx, {
    ...config,
    enabled: readLive(config.enabled, PET_FORM_DEFAULTS.enabled),
    decorationEnabled: readLive(config.decorationEnabled, PET_FORM_DEFAULTS.decorationEnabled),
    statusBubbles: statusBubbleMode(readLive<PetStatusBubbleMode | undefined>(config.statusBubbles, undefined)),
    registry,
  })
  // The mirror back into the settings document (see syncSettingsFromPet) has to
  // address the row that serves this plugin's config, which an aggregate bundle
  // renames; the id is resolved lazily, once the composition serves it.
  service.settingsNamespaceProvider = () => servedRow(ctx)?.ns

  // The effective settings ARE this row's own config: the Host serves one form
  // per profile entry from `Config` above, and every edit is committed into the
  // running config, so the plugin re-reads the section here instead of holding
  // a separate settings document (0.1.6 registered one through
  // settings.installSection/register and re-resolved it on every change). The
  // display fields additionally read the persisted layout and the profile layer,
  // so a mount with a config that never set them cannot reset a dragged
  // position to the schema defaults (see displayField).
  const current = (): PetSettingsSection =>
    petSettingsSection(config, service.selectedPetId(), service.display(), servedRow(ctx)?.user)
  // The browser half talks to the pet through same-origin JSON endpoints and
  // loads each pet's atlas from the registry's own media route (RPC domains
  // are platform-registered, so the pet serves its own API — the same
  // pattern as dsh-remote-web-ui's /api/pair family). The routes are
  // registered while the plugin is enabled; toggling the setting off makes
  // the pet API disappear until it is re-enabled.
  const routes = makePetRoutes({ service, ctx })
  let disposeRoutes: (() => void) | undefined
  const syncRoutes = (): void => {
    const enabled = current().enabled ?? true
    if (disposeRoutes === undefined && enabled) {
      disposeRoutes = ctx.effect(
        () => {
          const disposers = routes.map((route) => ctx.webServer.register(route))
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:623-655](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/client/index.ts#L623-L655)

浏览器自有容器挂载PetDockEntry，说明界面真实入口与网页范围。

<details>
<summary>查看原文（33行）</summary>

```text
      // instances that predate the teardown registry, so this mount is the
      // page's only [data-dsh-pet-root].
      takeoverPetUiTeardown()
      for (const stale of Array.from(document.querySelectorAll('div[data-dsh-pet-root]'))) {
        stale.remove()
      }
      const container = document.createElement('div')
      container.dataset.dshPetRoot = ''
      container.dataset.dshPlugin = 'pet'
      document.body.appendChild(container)
      const petRoot = createRoot(container)
      // The sprite chrome portals into THIS root (not document.body): the
      // root then owns the whole surface, so a root-keyed suppressor (the
      // portrait mobile layer, which hides [data-dsh-plugin="pet"]) really
      // hides the sprite instead of missing the portaled float.
      //
      // The floating surface has no session-scoped locale seat, so it must be
      // handed the framework one explicitly. Resolving its copy from the
      // plugin's own zh/en dictionary keyed on <html lang> sent every
      // registered language except English to Chinese: a ru/ja/de page showed a
      // Chinese panel while the settings card beside it was translated. Binding
      // the 'pet' namespace instead follows the active language, the English
      // fallback, and every language pack that registers a dictionary for it
      // (the settings section label already resolves through the same seat).
      const renderPet = (): void => {
        petRoot.render(createElement(PetDockEntry, {
          ...injected(),
          t: ctx.locale.bind(NS),
          // The active locale rides the same mount as the translate seat so a
          // pet-declared English rank name follows the UI language.
          lang: ctx.locale.getLocale().active,
          portalTarget: container,
        }))
```

</details>

**依据 4 · 源码核查**：[src/routes.ts:574-614](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/routes.ts#L574-L614)

状态、宠物列表、互动、可见性和配置动作实际映射服务。

<details>
<summary>查看原文（41行）</summary>

```text
export function makePetRoutes(deps: { service: PetService; ctx: Context; assetCaps?: PetAssetCaps } & PetRuntimeRoots): WebRoute[] {
  const { service, ctx } = deps
  const apiRoutes: WebRoute[] = [
    getRoute(ctx, PET_API_PREFIX + '/state', (req) => {
      // The browser half reports the GUI's current session id so the bubble
      // stack can lead with the session the user is actually looking at.
      const current = new URL(req.url ?? '/', 'http://pet.local').searchParams.get('current')
      return service.state(current === null || current === '' ? undefined : current)
    }),
    getRoute(ctx, PET_API_PREFIX + '/pets', () => service.pets()),
    getRoute(ctx, PET_API_PREFIX + '/diagnostics', () => service.diagnostics()),
    postRoute(ctx, PET_API_PREFIX + '/interact', (body) => {
      const kind = body.kind as PetInteraction | undefined
      if (kind !== 'pet' && kind !== 'feed') return Promise.reject(new Error('invalid-kind'))
      return service.interact(kind)
    }),
    postRoute(ctx, PET_API_PREFIX + '/set-visible', (body) => {
      const visible = body.visible
      if (typeof visible !== 'boolean') return Promise.reject(new Error('invalid-visible'))
      return service.setVisible(visible)
    }),
    postRoute(ctx, PET_API_PREFIX + '/set-config', (body) => service.setConfig({
      ...(typeof body.size === 'number' ? { size: body.size } : {}),
      ...(typeof body.right === 'number' ? { right: body.right } : {}),
      ...(typeof body.bottom === 'number' ? { bottom: body.bottom } : {}),
      ...(typeof body.visible === 'boolean' ? { visible: body.visible } : {}),
    })),
    postRoute(ctx, PET_API_PREFIX + '/set-name', (body) => {
      const name = body.name
      if (typeof name !== 'string') return Promise.reject(new Error('invalid-name'))
      return service.setName(name)
    }),
    postRoute(ctx, PET_API_PREFIX + '/set-skin', (body) => {
      const skin = body.skin
      if (skin !== undefined && typeof skin !== 'string') return Promise.reject(new Error('invalid-skin'))
      return service.setSkin(skin === undefined || skin === '' ? undefined : skin)
    }),
    postRoute(ctx, PET_API_PREFIX + '/set-pet', (body) => {
      const petId = body.petId
      if (typeof petId !== 'string') return Promise.reject(new Error('invalid-pet'))
      return service.setPetId(petId)
```

</details>

#### 缺口

- 没有实际宿主视觉、可访问性或用户偏好/干扰程度数据。
  **影响**：无法判断它是否比原生状态更易理解或更适合长期使用。
  **进一步探讨**：让同一用户在原生状态、静态挂件与事件宠物三种条件下观察状态理解和打断次数。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 多会话和子Agent活动如何成为动画及工作奖励？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

投影层按官方事件类型处理：turn/start与step/start进入waiting，assistant/message进入review，tool/call记录callId并显示工具线索，tool/result依据结构化error/isError决定失败或继续思考；turn/end的completed给done并携带turn号，error/中断/token上限等另映射失败，aborted回idle。它不是分析模型文本来判断任务正确。工具名看似测试且结果未标错可以触发通过情绪，但这仍是事件分类，不证明测试覆盖、业务验收或整项任务通过。

服务同时消费session/event与进程内assistant-stream。每个会话有投影/状态机，最新有意义活动决定全局宠物动画；最多保留12份会话活动。顶层会话可有独立气泡，GUI当前会话优先排在前；origin=subagent不单列可导航气泡，但其完成事件仍能记奖励。单个宠物的动作与首位气泡因此可能代表不同选择逻辑，不能当成精确任务监控仪表。

官方completedTurn按sessionId+turn去重，rewardedTurns保存在内存Map；重复或更早turn不再加分，session disposed时清理该Map。legacy done只在尚未观察官方事件时发奖励，并用五秒间隔限制重复，避免官方与兼容事件同时加分。关闭时解除活动订阅并丢弃瞬时活动，错过的终止事件不尝试补放。它提供运行期去重，不构成跨重启、日志重放下的持久exactly-once承诺；本轮未验证宿主重放行为，不据内存Map直接宣称已发生重复奖励。

#### 证据与依据

**依据 1 · 源码核查**：[src/event-projection.ts:103-160](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/event-projection.ts#L103-L160)

官方事件按工具身份和结构结果投影，而非从模型文本判断成败。

<details>
<summary>查看原文（58行）</summary>

```text
    case 'turn/start':
      runtime.activeTools.clear()
      runtime.testCalls.clear()
      runtime.stepHadFailure = false
      return { input: { phase: 'waiting', line: runtime.voice.scene('prepare', nowMs) } }
    case 'step/start':
      runtime.activeTools.clear()
      runtime.stepHadFailure = false
      return { input: { phase: 'waiting', line: runtime.voice.scene('waiting', nowMs) } }
    case 'assistant/message':
      return { input: { phase: 'review', line: runtime.voice.scene('review', nowMs) } }
    case 'tool/call': {
      const callId = String(event.data.callId)
      runtime.activeTools.add(callId)
      // A test-looking call is remembered so its result (the only place the
      // outcome is known) can wake the test-green mood later.
      if (looksLikeTestTool(event.data.name, event.data.arguments)) runtime.testCalls.add(callId)
      const whisper = runtime.whispers.feed(whisperCategoryOf(toolCategory(event.data.name)), nowMs)
      return {
        input: {
          phase: 'tool',
          line: runtime.voice.tool(
            event.data.name,
            displayToolName(event.data.name),
            toolArgHint(event.data.name, event.data.arguments),
            nowMs,
          ),
        },
        ...(whisper === undefined ? {} : { whisper }),
      }
    }
    case 'tool/result': {
      // Session format V4 moved the call identity and the outcome onto the
      // tool-role message root; the content blocks no longer carry either.
      const { message } = event.data
      const callId = String(message.toolCallId)
      const failed = event.data.error !== undefined || message.isError === true
      const wasTest = runtime.testCalls.delete(callId)
      runtime.activeTools.delete(callId)
      runtime.stepHadFailure ||= failed
      const whisper = failed
        ? runtime.whispers.result('fail', nowMs)
        : wasTest
          ? runtime.whispers.result('pass', nowMs)
          : undefined
      const whisperSpread = whisper === undefined ? {} : { whisper }
      if (runtime.activeTools.size > 0) {
        return {
          input: {
            phase: 'tool',
            line: runtime.voice.toolRemaining(runtime.activeTools.size, nowMs),
          },
          ...whisperSpread,
        }
      }
      return runtime.stepHadFailure
        ? { input: { phase: 'failed', line: runtime.voice.scene('toolFailed', nowMs) }, ...whisperSpread }
        : { input: { phase: 'thinking', line: runtime.voice.scene('toolResult', nowMs) }, ...whisperSpread }
```

</details>

**依据 2 · 源码核查**：[src/event-projection.ts:162-194](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/event-projection.ts#L162-L194)

completed才携带completedTurn，aborted与未知结尾回idle。

<details>
<summary>查看原文（33行）</summary>

```text
    case 'turn/end': {
      runtime.activeTools.clear()
      runtime.testCalls.clear()
      switch (event.data.reason.kind) {
        case 'completed': {
          const whisper = runtime.whispers.result('done', nowMs)
          return {
            input: { phase: 'done', line: runtime.voice.scene('done', nowMs) },
            completedTurn: event.data.turn,
            ...(whisper === undefined ? {} : { whisper }),
          }
        }
        case 'error': {
          const whisper = runtime.whispers.result('fail', nowMs)
          return {
            input: { phase: 'failed', line: runtime.voice.scene('failed', nowMs) },
            ...(whisper === undefined ? {} : { whisper }),
          }
        }
        case 'max-tokens':
          return { input: { phase: 'failed', line: runtime.voice.scene('maxTokens', nowMs) } }
        case 'interrupted':
          return { input: { phase: 'failed', line: runtime.voice.scene('interrupted', nowMs) } }
        case 'blocked':
          return { input: { phase: 'waiting', line: runtime.voice.scene('blocked', nowMs) } }
        case 'aborted':
          // A stopped session settles to idle without a bubble: the pet
          // visibly calms down and the session drops out of the bubble stack.
          return { input: { phase: 'idle' } }
        default:
          // TurnEndReasonMap is merge-extensible; a newer ending must not
          // leave the pet showing stale in-progress work.
          return { input: { phase: 'idle' } }
```

</details>

**依据 3 · 源码核查**：[src/service.ts:641-680](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/service.ts#L641-L680)

官方与legacy/stream事件接线，官方优先控制奖励。

<details>
<summary>查看原文（40行）</summary>

```text
        this.ctx.on('session/event', (session: Session, event: SessionEvent) => {
          const runtime = this.activityOf(session).runtime
          // `activity/status` is an optional compatibility input. It is not
          // declared as a durable event type by this package because current
          // Harness installations publish the official session vocabulary.
          if ((event.type as string) === 'activity/status') {
            const payload = ((event as unknown as { data?: unknown }).data ?? {}) as ActivityStatusEventLike
            if (typeof payload.phase !== 'string' || !isActivityPhase(payload.phase)) return
            this.applyActivity(session, {
              phase: payload.phase,
              ...(typeof payload.line === 'string' ? { line: payload.line } : {}),
              ...(typeof payload.phrase === 'string' ? { phrase: payload.phrase } : {}),
            })
            // On a legacy-only stream the compatibility event owns turn
            // rewards. Once any official activity is observed, turn/end owns
            // them and a derived legacy `done` cannot double-count.
            if (payload.phase === 'done' && !runtime.officialEventsSeen) {
              this.rewardLegacyTurn()
            }
            return
          }

          const transition = projectOfficialEvent(event, runtime)
          if (transition === undefined) return
          runtime.officialEventsSeen = true
          this.officialEventSessions.add(session)
          this.applyActivity(session, transition.input, transition.whisper)
          if (transition.completedTurn !== undefined) {
            this.rewardTurn(String(session.id), transition.completedTurn)
          }
        }),
        this.ctx.on('agent/assistant-stream', ({ agent, frame }: { agent: { session: Session }; frame: AssistantStreamFrame }) => {
          const session = agent.session
          const runtime = this.activityOf(session).runtime
          const transition = projectAssistantStreamFrame(frame, runtime)
          if (transition === undefined) return
          runtime.officialEventsSeen = true
          this.officialEventSessions.add(session)
          this.applyActivity(session, transition.input, transition.whisper)
        }),
```

</details>

**依据 4 · 源码核查**：[src/service.ts:731-749](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/service.ts#L731-L749)

最新事件驱动全局动画，并修剪到MAX_SESSION_BUBBLES。

<details>
<summary>查看原文（19行）</summary>

```text
  private applyActivity(session: Session, input: PetStateInput, whisper?: string): void {
    const activity = this.activityOf(session)
    activity.lastInput = input
    if (whisper !== undefined) activity.whisper = { text: whisper, at: Date.now() }
    activity.machine.onActivityStatus(input)
    activity.machine.onSessionActive()
    // Move to the tail so map order reads most-recent-last, then trim the
    // oldest session states beyond the bubble cap. The display session is
    // reassigned below, so trimming its stale predecessor is safe.
    this.sessionActivity.delete(session)
    this.sessionActivity.set(session, activity)
    while (this.sessionActivity.size > MAX_SESSION_BUBBLES) {
      const oldest = this.sessionActivity.keys().next().value
      if (oldest === undefined) break
      this.sessionActivity.delete(oldest)
    }
    this.displaySession = session
    this.machine.onActivityStatus(input)
    this.machine.onSessionActive()
```

</details>

**依据 5 · 源码核查**：[src/service.ts:1058-1095](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/service.ts#L1058-L1095)

顶层气泡与GUI当前会话优先、subagent跳过气泡的实际投影。

<details>
<summary>查看原文（38行）</summary>

```text
  private view(currentSessionId?: string): PetStateView {
    const snapshot = this.machine.render()
    const entry = this.activeEntry()
    // One bubble per concurrently active TOP-LEVEL session. The GUI's current
    // session leads the stack when reported (the browser half passes its
    // session list's 'current'); everything else keeps the most recent
    // meaningful event order. Subagent children render no bubble of their own
    // (their activity already shows through the spawning conversation's
    // bubble/display, and the bubble buttons navigate to GUI sessions, which
    // subagents are not). Sessions whose own machine has settled (no bubble
    // copy) drop out, so a finished turn does not leave a stale bubble behind.
    const sessions: PetSessionView[] = []
    for (const [session, activity] of [...this.sessionActivity.entries()].reverse()) {
      if (sessions.length >= MAX_SESSION_BUBBLES) break
      if (session.header?.origin === 'subagent') continue
      const perSession = activity.machine.render()
      if (perSession.bubble === undefined) continue
      // Each session's whisper rides its own bubble while fresh; an expired
      // whisper simply stops appearing (the client's 2 s poll drops it).
      const whisper = activity.whisper
      const freshWhisper = whisper !== undefined && Date.now() - whisper.at < WHISPER_TTL_MS
        ? whisper.text
        : undefined
      sessions.push({
        sessionId: String(session.id),
        animation: perSession.animation,
        bubble: perSession.bubble,
        phase: perSession.phase,
        ...(freshWhisper === undefined ? {} : { whisper: freshWhisper }),
      })
    }
    // The browser half reports the session the user is currently on; that
    // session's bubble leads the stack (its whisper then speaks on the
    // collapsed single bubble). An unreported or absent session keeps the
    // legacy most-recent-first order.
    if (currentSessionId !== undefined) {
      const index = sessions.findIndex(session => session.sessionId === currentSessionId)
      if (index > 0) sessions.unshift(sessions.splice(index, 1)[0]!)
```

</details>

**依据 6 · 源码核查**：[src/ledger.ts:64-68](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/ledger.ts#L64-L68)

session+turn去重Map是内存字段，不能推为持久去重。

```text
  private current: PetPersist
  /** Completed turns already rewarded, per session (turn numbers are per-session). */
  private rewardedTurns = new Map<string, number>()
  private lastLegacyTurnRewardAt = 0
  private dirty = false
```

**依据 7 · 源码核查**：[src/ledger.ts:217-237](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/ledger.ts#L217-L237)

官方turn单调去重与legacy五秒限制，说明具体重复控制范围。

<details>
<summary>查看原文（21行）</summary>

```text
   * Award the completed-turn reward once per session+turn (idempotent) and
   * run the treat settlement that work output feeds. Returns true when the
   * snapshot changed.
   */
  rewardTurn(sessionId: string, turn: number, nowMs: number): boolean {
    const last = this.rewardedTurns.get(sessionId) ?? 0
    if (turn <= last) return false
    this.rewardedTurns.set(sessionId, turn)
    let changed = this.applyTurnReward()
    if (this.settleTreats(nowMs)) changed = true
    return changed
  }

  /** Preserve turn rewards for installations that only emit legacy activity. */
  rewardLegacyTurn(nowMs: number): boolean {
    // A legacy done snapshot may repeat during the celebration window.
    if (nowMs - this.lastLegacyTurnRewardAt < 5_000) return false
    this.lastLegacyTurnRewardAt = nowMs
    let changed = this.applyTurnReward()
    if (this.settleTreats(nowMs)) changed = true
    return changed
```

</details>

**依据 8 · 源码核查**：[src/service.ts:681-708](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/service.ts#L681-L708)

session disposal清理与禁用后丢弃瞬时状态，不补放漏过事件。

<details>
<summary>查看原文（28行）</summary>

```text
        this.ctx.on('session/disposed', (session: Session) => {
          this.ledger.forgetSession(String(session.id))
          this.officialEventSessions.delete(session)
          this.sessionActivity.delete(session)
          if (session !== this.displaySession) return
          // The display session is gone: fall back to the most recent
          // remaining session's last input, or settle to idle when none.
          this.displaySession = undefined
          const remaining = [...this.sessionActivity.entries()].at(-1)
          if (remaining !== undefined) {
            const [nextSession, activity] = remaining
            this.displaySession = nextSession
            if (activity.lastInput !== undefined) this.machine.onActivityStatus(activity.lastInput)
            this.machine.onSessionActive()
          } else {
            this.machine.onSessionDisposed()
          }
        }),
      ]
      return () => { for (const dispose of disposers) dispose() }
    })()
  }

  /** Drop transient activity because terminal events missed while disabled cannot be replayed safely. */
  private resetActivity(): void {
    this.displaySession = undefined
    this.sessionActivity.clear()
    this.machine.onSessionDisposed()
```

</details>

#### 缺口

- 重启、热更新和宿主事件丢失/重放时的状态一致性未实测。
  **影响**：宠物可能不能反映精确历史进度，不能作为任务验收或持久计量来源。
  **进一步探讨**：用固定宿主的重复、乱序、禁用期间完成及重启场景检查显示和奖励，不先假设会重放。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 喂食、位置与隐藏怎样保存，关闭是否恢复？

**研究主题**：依赖、兼容与流程、工程质量与复用、缺陷与关键质疑

#### 完整回答

互动先在内存ledger结算。喂食先处理可获得的鱼干，再检查冷却；冷却拒绝时不消耗库存，库存不足时返回零收益；成功才扣库存并更新亲密度。显示位置、大小和气泡比例在服务端限制范围，改名按petId保存。它是本地装饰性状态，不是金融余额、生产工作量或用户绩效记录；奖励回合数只代表观测到的completed事件。

持久化保存当前pet、名字、外观、互动/鱼干与显示设置到DSH_HOME下pet.json，写临时文件后rename；读取对数字做限制并兼容旧命名，损坏/不可读/解析错误则回默认值。service.flush捕获写入错误并不抛出，互动API仍能返回内存结果。因而“成功喂食”“已拖到某位置”不等于已经可靠写盘，后续重启可能回到旧值或默认值；本轮没有复现丢失，也不把临时rename描述成断电或多进程事务保证。

visible仅隐藏/召唤显示，enabled是主开关。host关闭enabled后取消路由和活动订阅并重置瞬时状态；client响应设置卸载React root、容器、轮询和会话监听。页全局teardown槽让新bundle先卸载旧UI，防止热更新残留重复宠物。重新启用可以重新挂载并恢复已成功保存的配置，不能恢复禁用期间没消费的活动。只隐藏不等于完全停止后台服务，应以主开关区分。

#### 证据与依据

**依据 1 · 源码核查**：[src/ledger.ts:249-290](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/ledger.ts#L249-L290)

冷却拒绝先于库存消耗，成功才更新状态，支持实际互动规则。

<details>
<summary>查看原文（42行）</summary>

```text
  /**
   * Pet or feed the pet. Feeding settles first, then gates on the feed
   * cooldown before spending stock — a feed inside the cooldown must not burn
   * a treat for nothing.
   */
  interact(kind: PetInteraction, nowMs: number): LedgerInteractionResult {
    if (kind === 'feed') this.settleTreats(nowMs)
    const before = this.current.affinity
    const outcome = applyInteraction(before, kind, nowMs, this.affinityConfig)
    // Reactions come from the picker pools (custom per-pet slots override
    // the built-in library per slot); outcome.reaction stays the fallback
    // copy for direct applyInteraction callers.
    if (kind === 'feed' && !outcome.accepted) {
      this.current = { ...this.current, affinity: outcome.affinity }
      this.dirty = true
      return {
        reaction: this.picker.pickAt('feedCooldown', before.feedRejects),
        delta: 0,
        affinity: this.affinityView(nowMs),
      }
    }
    if (kind === 'feed') {
      const consume = consumeTreat(this.current.treats)
      if (!consume.ok) {
        return {
          reaction: this.picker.pick('noTreats'),
          delta: 0,
          affinity: this.affinityView(nowMs),
        }
      }
      this.current = { ...this.current, treats: consume.ledger }
      this.dirty = true
    }
    this.current = { ...this.current, affinity: outcome.affinity }
    this.dirty = true
    const count = kind === 'pet'
      ? outcome.accepted ? before.pets : before.petRejects
      : before.feeds
    return {
      reaction: this.picker.pickAt(outcome.accepted ? kind : 'petCooldown', count),
      delta: outcome.delta,
      affinity: this.affinityView(nowMs),
```

</details>

**依据 2 · 源码核查**：[src/service.ts:752-757](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/service.ts#L752-L757)

互动返回ledger结果，dirty后调用best-effort flush。

```text
  /** RPC: pet or feed the pet. */
  async interact(kind: PetInteraction): Promise<PetInteractResult> {
    const nowMs = Date.now()
    const result = this.ledger.interact(kind, nowMs)
    if (this.ledger.takeDirty()) this.flush()
    return result
```

**依据 3 · 源码核查**：[src/service.ts:975-994](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/service.ts#L975-L994)

位置/大小限制和per-pet改名更新有实际服务端路径。

<details>
<summary>查看原文（20行）</summary>

```text
  async setConfig(patch: Partial<PetDisplayConfig>): Promise<{ ok: true; display: PetDisplayConfig }> {
    const next = { ...this.ledger.snapshot.display, ...patch }
    next.size = Math.round(Math.min(DISPLAY_SIZE_MAX, Math.max(DISPLAY_SIZE_MIN, next.size)))
    next.right = Math.round(Math.min(DISPLAY_INSET_MAX, Math.max(0, next.right)))
    next.bottom = Math.round(Math.min(DISPLAY_INSET_MAX, Math.max(0, next.bottom)))
    next.bubbleScale = Math.min(BUBBLE_SCALE_MAX, Math.max(BUBBLE_SCALE_MIN, next.bubbleScale))
    this.ledger.setDisplay(next)
    this.flush()
    this.syncSettingsFromPet()
    return { ok: true, display: this.ledger.snapshot.display }
  }

  /** RPC: rename the selected pet (trimmed, 1–20 chars, per-pet storage). */
  async setName(name: string): Promise<{ ok: true; name: string } | { ok: false; error: string }> {
    const trimmed = name.trim()
    if (trimmed === '') return { ok: false, error: 'name-empty' }
    if (trimmed.length > PET_NAME_MAX_LENGTH) return { ok: false, error: 'name-too-long' }
    this.ledger.setPetName(this.selectedPetId(), trimmed)
    this.flush()
    return { ok: true, name: trimmed }
```

</details>

**依据 4 · 源码核查**：[src/persist.ts:217-280](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/persist.ts#L217-L280)

读取校验/错误回默认、临时写后rename，限定持久化保证。

<details>
<summary>查看原文（64行）</summary>

```text
export function loadPetPersist(dir: string = petHomeDir()): PetPersist {
  try {
    const raw = readFileSync(join(dir, 'pet.json'), 'utf8')
    const parsed = JSON.parse(raw) as PetPersistDocument
    const base = emptyPersist()
    const rawAffinity = (parsed.affinity ?? {}) as Partial<AffinityState>
    const affinity: AffinityState = {
      points: clamp(finiteNum(rawAffinity.points, 0), AFFINITY_MAX),
      lastPetAt: clamp(finiteNum(rawAffinity.lastPetAt, 0), Number.MAX_SAFE_INTEGER),
      lastFeedAt: clamp(finiteNum(rawAffinity.lastFeedAt, 0), Number.MAX_SAFE_INTEGER),
      pets: clamp(finiteNum(rawAffinity.pets, 0), Number.MAX_SAFE_INTEGER),
      feeds: clamp(finiteNum(rawAffinity.feeds, 0), Number.MAX_SAFE_INTEGER),
      petRejects: clamp(finiteNum(rawAffinity.petRejects, 0), Number.MAX_SAFE_INTEGER),
      feedRejects: clamp(finiteNum(rawAffinity.feedRejects, 0), Number.MAX_SAFE_INTEGER),
      turns: clamp(finiteNum(rawAffinity.turns, 0), Number.MAX_SAFE_INTEGER),
    }
    const rawTreats = (parsed.treats ?? {}) as Partial<TreatLedger>
    const treats: TreatLedger = {
      treats: clamp(finiteNum(rawTreats.treats, 0), defaultTreatConfig.maxTreats),
      lastTreatGrantAt: clamp(finiteNum(rawTreats.lastTreatGrantAt, 0), Number.MAX_SAFE_INTEGER),
      turnsAtLastTreatGrant: clamp(finiteNum(rawTreats.turnsAtLastTreatGrant, 0), Number.MAX_SAFE_INTEGER),
    }
    const rawDisplay = (parsed.display ?? {}) as Partial<PetDisplayConfig>
    const display: PetDisplayConfig = {
      visible: typeof rawDisplay.visible === 'boolean' ? rawDisplay.visible : base.display.visible,
      // The settings schema requires whole pixels; drag positions are
      // clamped but not integral, so round at the persistence boundary.
      size: Math.round(Math.min(DISPLAY_SIZE_MAX, Math.max(DISPLAY_SIZE_MIN, finiteNum(rawDisplay.size, base.display.size)))),
      right: Math.round(clamp(finiteNum(rawDisplay.right, base.display.right), DISPLAY_INSET_MAX)),
      bottom: Math.round(clamp(finiteNum(rawDisplay.bottom, base.display.bottom), DISPLAY_INSET_MAX)),
      // Fractional on purpose: the multiplier is a ratio, not a pixel count.
      bubbleScale: Math.min(BUBBLE_SCALE_MAX, Math.max(BUBBLE_SCALE_MIN, finiteNum(rawDisplay.bubbleScale, base.display.bubbleScale))),
    }
    const petId = typeof parsed.petId === 'string' && parsed.petId.trim() !== ''
      ? parsed.petId.trim()
      : base.petId
    const names = loadPetNames(parsed)
    // Legacy migration: pre-registry installs persisted one flat `name`
    // field. Move it onto the selected pet (the legacy whale-girl unless the
    // file already names another pet) so renames survive the upgrade.
    if (typeof parsed.name === 'string' && parsed.name.trim() !== '' && names[petId] === undefined) {
      names[petId] = parsed.name.trim().slice(0, PET_NAME_MAX_LENGTH)
    }
    return {
      petId,
      names,
      skins: loadPetSkins(parsed),
      affinity,
      treats,
      display,
      gameplay: loadGameplay(parsed),
    }
  } catch {
    return emptyPersist()
  }
}

/** Atomically persist state (write temp + rename). */
export function savePetPersist(data: PetPersist, dir: string = petHomeDir()): void {
  mkdirSync(dir, { recursive: true })
  const target = join(dir, 'pet.json')
  const tmp = `${target}.tmp`
  writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8')
  renameSync(tmp, target)
```

</details>

**依据 5 · 源码核查**：[src/service.ts:1156-1161](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/service.ts#L1156-L1161)

写盘失败被捕获，内存继续工作，不代表已经持久化。

```text
  private flush(): void {
    try {
      savePetPersist(this.ledger.snapshot, this.persistDir)
    } catch {
      // Persistence is best-effort; the in-memory ledger keeps working.
    }
```

**依据 6 · 源码核查**：[src/index.ts:398-424](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/index.ts#L398-L424)

enabled控制host路由注册/注销并同步服务。

<details>
<summary>查看原文（27行）</summary>

```text
  const routes = makePetRoutes({ service, ctx })
  let disposeRoutes: (() => void) | undefined
  const syncRoutes = (): void => {
    const enabled = current().enabled ?? true
    if (disposeRoutes === undefined && enabled) {
      disposeRoutes = ctx.effect(
        () => {
          const disposers = routes.map((route) => ctx.webServer.register(route))
          return () => { for (const dispose of disposers) dispose() }
        },
        'pet: routes',
      )
    } else if (disposeRoutes !== undefined && !enabled) {
      disposeRoutes()
      disposeRoutes = undefined
    }
  }
  // Apply the row's config to the running service: pet.json mirrors the live
  // display the drag / hide / summon interactions write (see
  // syncSettingsFromPet), so a section the settings surface never touched
  // resolves back to exactly what the pet already shows (the composition
  // 'base' of the pre-0.1.7 section).
  const syncSettings = (): void => {
    const section = current()
    service.applySettingsSection(section)
    service.setEnabled(section.enabled ?? true)
    syncRoutes()
```

</details>

**依据 7 · 源码核查**：[src/client/index.ts:662-695](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/client/index.ts#L662-L695)

关闭与fiber清理卸载root、容器、poll和订阅。

<details>
<summary>查看原文（34行）</summary>

```text
      let uiGone = false
      disposeUi = () => {
        if (uiGone) return
        uiGone = true
        clearUiTeardown?.()
        clearUiTeardown = undefined
        unsubscribeLocale()
        petRoot.unmount()
        container.remove()
        disposePoll()
        disposeSessionWatch()
        disposeUi = undefined
      }
      // The slot teardown is the takeover hook a later apply body runs; it
      // marks this instance terminal so a late settings callback from the
      // still-draining instance cannot remount a second pet.
      clearUiTeardown = registerPetUiTeardown(() => {
        uiDead = true
        disposeUi?.()
      })
    } else if (!uiDead && !enabled() && disposeUi !== undefined) {
      disposeUi()
      disposeUi = undefined
    }
  }
  // The settings subscription and the pet UI lifetime follow the fiber
  // (issue #785): disposal drops the subscription and tears the UI down
  // (terminal), so a hot-reloaded or re-injected bundle never leaves the
  // previous React root, container, or poll loop behind on document.body.
  const unsubscribeSettings = settingsForm.subscribe(syncUi)
  ctx.effect(
    () => () => {
      unsubscribeSettings()
      // Release the deferred form's retry timer and its mirror subscription so a
```

</details>

**依据 8 · 源码核查**：[src/client/ui-teardown.ts:29-46](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/client/ui-teardown.ts#L29-L46)

跨bundle槽注册/接管前一实例，属于可复用生命周期机制。

<details>
<summary>查看原文（18行）</summary>

```text
export function registerPetUiTeardown(teardown: () => void): () => void {
  const slot = globalThis as TeardownSlot
  slot[SLOT] = teardown
  return () => {
    if (slot[SLOT] === teardown) slot[SLOT] = undefined
  }
}

/**
 * Run the previous instance's teardown if one is registered, so the
 * re-applying instance becomes the sole owner of the page-global pet
 * root. No-op when the previous fiber already tore down cleanly.
 */
export function takeoverPetUiTeardown(): void {
  const slot = globalThis as TeardownSlot
  const teardown = slot[SLOT]
  slot[SLOT] = undefined
  teardown?.()
```

</details>

#### 缺口

- 文件不可写/损坏、页面重挂载及不同宿主设置层的真实恢复行为未验证。
  **影响**：不能保证积分、名字和位置永不丢失；应把重要业务状态留在原系统。
  **进一步探讨**：在副本数据目录检查失败提示、重启回读、隐藏/禁用的资源差异和再启用结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 自定义资产和渲染器如何加载，访问与资源消耗有什么边界？

**研究主题**：功能与机制、工程质量与复用、效果与总成本

#### 完整回答

registry按内置assets、兼容的自定义宠物目录、DSH_HOME/pets和组合配置加载；后层同ID覆盖前层并记录warning，坏manifest跳过而不是把所有宠物都停掉。使用者要核对实际生效ID/来源，不能以同名显示判断仍是原内置资产。asset handler先过访问门，再限定已注册资源集合、manifest或允许预览；文件realpath必须在宠物目录内，读取前检查大小，ETag允许复验。这里能确认目标路由的文件范围控制，不宣称任意第三方资源已经过全面安全审计。

访问门接受符合socket地址、Host及浏览器同源标记的loopback请求；远端可由宿主可选的配对服务提供额外许可。它不是按每个小说/项目或租户细分的权限；配对服务未加载时没有额外远端通道，不能把该路由当公开互联网资源服务。保护效果仍依赖实际宿主部署与配对实现，本轮未做攻击实验。

frames2d优先缓存解码位图，128MiB是保留预算而非整个插件硬内存上限：播放预取窗口及等待绘制的帧被保护，窗口本身超预算时可暂时超过；其他浏览器资源和Live2D内存不计入该变量。卸载会取消定时器、释放已缓存位图并处理晚到解码。客户端只在标签可见时轮询，回到前台立即刷新。Live2D另需用户提供Core运行时，加载失败返回不可用并走指引；本轮不核实第三方授权条款或模型权利，也不把源码注释的历史数字当本轮性能测量。

因此内置2D是更小的试用范围；自定义大帧序列和Live2D需要额外文件、运行时与CPU/GPU内存预算。没有设备/帧数/分辨率下的实测，不称零开销或承诺低性能设备流畅。

#### 证据与依据

**依据 1 · 源码核查**：[src/registry.ts:1130-1181](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/registry.ts#L1130-L1181)

来源层次与同ID覆盖记录，不能把同ID当固定同资产。

<details>
<summary>查看原文（52行）</summary>

```text
export function loadPetRegistry(options: PetRegistryOptions): PetRegistry {
  const { packageRoot, assetPrefix = '/pet' } = options
  const warnings: string[] = []
  const diagnostics: PetRegistryDiagnostic[] = []
  const byId = new Map<string, PetEntry>()
  const builtinIds = new Set<string>()

  for (const entry of scanPetDir(join(packageRoot, 'assets'), { assetPrefix, warnings, diagnostics })) {
    if (byId.has(entry.id)) {
      warnings.push('duplicate built-in pet id ' + entry.id + '; the first one wins')
      continue
    }
    byId.set(entry.id, entry)
    builtinIds.add(entry.id)
  }

  const petsDir = options.petsDir ?? codexPetsDir()
  if (petsDir !== '') {
    for (const entry of scanPetDir(petsDir, { assetPrefix, warnings, diagnostics })) {
      if (byId.has(entry.id)) warnings.push('custom pet ' + entry.id + ' overrides the built-in one')
      byId.set(entry.id, entry)
    }
  }

  // The pet-center user directory ranks above the legacy hatch-pet source.
  const dshPetsDir = options.dshPetsDir ?? join(dshHome(), 'pets')
  let globalVoice: VoicePack | undefined
  if (dshPetsDir !== '') {
    for (const entry of scanPetDir(dshPetsDir, { assetPrefix, warnings, diagnostics })) {
      if (byId.has(entry.id)) warnings.push('user pet ' + entry.id + ' overrides an earlier registration')
      byId.set(entry.id, entry)
    }
    // The global voice override layers under every per-pet pack (M4, #677).
    globalVoice = loadVoicePackFile(join(dshPetsDir, '.voice.json'), { warnings, diagnostics })
  }

  for (const manifest of options.extra ?? []) {
    const raw = manifest.spritesheetPath
    const dir = raw === undefined || isAbsolute(raw)
      ? join(packageRoot, 'assets', 'extra')
      : dirname(resolve(packageRoot, raw))
    // petAtlasFile joins entry.dir (already the spritesheet's parent when the
    // path is package-relative) with entry.spritesheetPath, so the stored path
    // must be the basename only — otherwise the directory segment is applied
    // twice and the atlas 404s.
    const source = raw === undefined || isAbsolute(raw)
      ? manifest
      : { ...manifest, spritesheetPath: basename(raw) }
    const entry = resolvePetManifest(source, dir, { assetPrefix, warnings })
    if (entry === undefined) continue
    if (byId.has(entry.id)) warnings.push('composed pet ' + entry.id + ' overrides an earlier registration')
    byId.set(entry.id, entry)
```

</details>

**依据 2 · 源码核查**：[src/routes.ts:207-218](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/routes.ts#L207-L218)

资源handler先访问门，再构建注册文件集合。

<details>
<summary>查看原文（12行）</summary>

```text
function assetHandler(ctx: Context, registry: PetRegistry, caps: PetAssetCaps): WebRoute['handler'] {
  const aliases = dirAliases(registry)
  // The servable match is a Set probe instead of a linear scan: a full live2d
  // closure routinely exceeds a hundred files, each fetched through this
  // handler per mount. The registry is an immutable snapshot, so the sets are
  // built once per handler.
  const servableById = new Map<string, ReadonlySet<string>>(
    registry.entries.map(entry => [entry.id, new Set(entry.servable)]),
  )
  return ((req: IncomingMessage, res: ServerResponse) => {
    if (!guard(ctx, req, res)) return
    if (req.method !== 'GET' && req.method !== 'HEAD') {
```

</details>

**依据 3 · 源码核查**：[src/routes.ts:263-330](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/routes.ts#L263-L330)

集合匹配、realpath包含、读前大小和ETag保护的实际路径。

<details>
<summary>查看原文（68行）</summary>

```text
    const rel = rest.join('/')
    let file: string | undefined
    let synthesized = false
    if (rest.length === 1 && rest[0] === MANIFEST_FILE) {
      const manifestFile = join(entry.dir, MANIFEST_FILE)
      file = existsSync(manifestFile) ? manifestFile : undefined
      if (file === undefined) synthesized = true
    } else if (rest.length > 0 && servableById.get(entry.id)?.has(rel)) {
      file = join(entry.dir, rel)
    } else if (rest.length === 2 && rest[0] === PREVIEW_DIR && PREVIEW_PATTERN.test(rest[1]!)) {
      const preview = join(entry.dir, PREVIEW_DIR, rest[1]!)
      file = existsSync(preview) ? preview : undefined
    }
    if (synthesized) {
      const body = Buffer.from(JSON.stringify(petEntryView(entry, registry.globalVoice), null, 2), 'utf8')
      res.writeHead(200, {
        'content-type': 'application/json; charset=utf-8',
        'content-length': String(body.byteLength),
        'cache-control': 'no-cache',
      })
      if (req.method === 'HEAD') {
        res.end()
        return
      }
      res.end(body)
      return
    }
    if (file === undefined) {
      res.writeHead(404)
      res.end()
      return
    }
    // realpath containment: a symlink escaping the pet directory is refused.
    const resolved = containedRealpath(entry.dir, file)
    if (resolved === undefined) {
      res.writeHead(403)
      res.end()
      return
    }
    // Enforce the size ceiling before the file is read into memory.
    const cap = rest.length === 1 && rest[0] === MANIFEST_FILE
      ? caps.manifest
      : IMAGE_EXTENSIONS.has(extensionOf(rel)) ? caps.image : caps.model
    let stat: ReturnType<typeof statSync>
    try {
      stat = statSync(resolved)
      if (stat.size > cap) {
        res.writeHead(413)
        res.end()
        return
      }
    } catch {
      res.writeHead(404)
      res.end()
      return
    }
    // 'no-cache' forces revalidation before every reuse, and the validator
    // lets repeat requests settle as 304 — atlases and frames are the largest
    // payloads the plugin serves (up to the 20 MB image cap), and without a
    // validator every remount or page load would re-download them in full.
    const etag = weakEtag(stat)
    if (revalidated(req, res, etag)) return
    return readFile(resolved).then((body) => {
      res.writeHead(200, {
        'content-type': mimeFor(resolved),
        'content-length': String(body.byteLength),
        'cache-control': 'no-cache',
        etag,
```

</details>

**依据 4 · 源码核查**：[src/pair-access.ts:37-40](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/pair-access.ts#L37-L40)

loopback或配对服务额外许可，不是多租户资源授权。

```text
 */
export function isPairedOrLoopbackAllowed(ctx: LookupCtx, request: IncomingMessage): boolean {
  if (isLoopbackRequest(request)) return true
  return lookupPairing(ctx)?.isPairedDevice(request) === true
```

**依据 5 · 源码核查**：[src/loopback.ts:44-62](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/loopback.ts#L44-L62)

socket/Host/sec-fetch-site/Origin判定，而不是信任转发地址。

<details>
<summary>查看原文（19行）</summary>

```text
export function isLoopbackRequest(request: IncomingMessage): boolean {
  if (!isLoopbackAddress(request.socket.remoteAddress)) return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  let hostUrl: URL
  try {
    hostUrl = new URL('http://' + host)
  } catch {
    return false
  }
  if (!isLoopbackHostname(hostUrl.hostname)) return false
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = request.headers.origin
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
```

</details>

**依据 6 · 源码核查**：[src/client/renderers/frames2d.ts:84-95](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/client/renderers/frames2d.ts#L84-L95)

128MiB变量是解码帧保留预算，不是整进程上限。

<details>
<summary>查看原文（12行）</summary>

```text
 * Retention budget for decoded frame bitmaps, in bytes.
 *
 * The budget is expressed in bytes rather than in frames because a frame's
 * decoded footprint is `width * height * 4` and published pets differ by more
 * than an order of magnitude (a 512x683 frame is 1.33 MB, a 128x128 frame is
 * 64 KB): a frame count would be either useless for small atlases or too tight
 * for large ones. 128 MiB holds this repository's longest shipped track (78
 * frames, 104 MB) in full, so a running loop still re-decodes nothing, while
 * capping a pet that played every track of every skin at roughly a tenth of
 * the ~1.7 GB the unbounded memo reached.
 */
const MAX_RETAINED_BYTES = 128 * 1024 * 1024
```

</details>

**依据 7 · 源码核查**：[src/client/renderers/frames2d.ts:360-398](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/client/renderers/frames2d.ts#L360-L398)

保护播放窗口并按预算逐步回收，存在窗口超预算条件。

<details>
<summary>查看原文（39行）</summary>

```text
    /**
     * Release decoded bitmaps until the retained footprint is back under
     * MAX_RETAINED_BYTES. Two properties keep this from breaking playback:
     *
     * - The playing track's look-ahead window, plus the frame a draw is waiting
     *   on, are never released. Releasing one would hand a closed bitmap to
     *   `drawImage`, and re-decoding it would stall the next tick.
     * - Frames of any other track go first. That is what keeps a running loop
     *   warm under a budget smaller than two whole tracks: eviction reclaims the
     *   track the pet left instead of eating the cycle it is playing.
     *
     * When the protected window alone exceeds the budget nothing is released —
     * a pet whose frames are that large cannot be bounded further without
     * breaking playback, and the overshoot is then exactly one window.
     */
    function enforceRetentionBudget(): void {
      if (retainedBytes <= MAX_RETAINED_BYTES) return
      const def = config.tracks[track]
      const playing = new Set<string>(def === undefined ? [] : def.frames)
      const protectedUrls = new Set<string>()
      if (pinned !== undefined) protectedUrls.add(pinned)
      if (def !== undefined) {
        const end = Math.min(def.frames.length, frameIndex + 1 + PREFETCH_AHEAD)
        for (let index = frameIndex; index < end; index += 1) {
          const url = def.frames[index]
          if (url !== undefined) protectedUrls.add(url)
        }
      }
      // Pass 1 reclaims frames of tracks the pet is not playing; pass 2 is the
      // backstop for a single track larger than the whole budget.
      for (const foreignOnly of [true, false]) {
        for (const [url, entry] of decoding) {
          if (retainedBytes <= MAX_RETAINED_BYTES) return
          if (entry.bytes === undefined || protectedUrls.has(url)) continue
          if (foreignOnly && playing.has(url)) continue
          releaseFrame(entry.frame)
          retainedBytes -= entry.bytes
          decoding.delete(url)
        }
```

</details>

**依据 8 · 源码核查**：[src/client/renderers/frames2d.ts:548-568](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/client/renderers/frames2d.ts#L548-L568)

卸载取消定时器和释放位图/队列，源码清理不等同实测无泄漏。

<details>
<summary>查看原文（21行）</summary>

```text
    let disposedOnce = false
    const dispose = (): void => {
      if (disposedOnce) return
      disposedOnce = true
      disposed = true
      unsubscribe()
      if (timer !== undefined) clearTimeout(timer)
      if (watchdog !== undefined) clearInterval(watchdog)
      // Release every retained bitmap and drain the pool. Queued-but-unstarted
      // frames resolve as no-ops (the gate skips decodeFrame once disposed), and
      // a decode that lands after this loop is closed by the resolution guard
      // above, so teardown leaves nothing pending and nothing retained.
      for (const queued of frameQueue.splice(0)) queued.release()
      for (const entry of decoding.values()) releaseFrame(entry.frame)
      decoding.clear()
      retainedBytes = 0
      canvas?.remove()
      img?.remove()
    }
    ctx.onCleanup(dispose)

```

</details>

**依据 9 · 源码核查**：[src/client/index.ts:465-495](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/client/index.ts#L465-L495)

可见标签启动轮询，隐藏停止，前台返回刷新。

<details>
<summary>查看原文（31行）</summary>

```text
      const disposePoll = ctx.effect(() => {
        // Poll only while the tab is visible: the host snapshot does not
        // change while the page is hidden, so a background interval would
        // only burn RPCs (browser throttling is an unreliable backstop).
        // Coming back to the tab refreshes the pet immediately instead of
        // waiting out the next 2 s cycle.
        let timer: number | undefined
        const stop = (): void => {
          if (timer !== undefined) {
            window.clearInterval(timer)
            timer = undefined
          }
        }
        const start = (): void => {
          if (timer === undefined && document.visibilityState === 'visible') {
            timer = window.setInterval(pollNow, POLL_MS)
          }
        }
        const onVisibility = (): void => {
          if (document.visibilityState === 'visible') {
            pollNow()
            start()
          } else {
            stop()
          }
        }
        start()
        document.addEventListener('visibilitychange', onVisibility)
        return () => {
          stop()
          document.removeEventListener('visibilitychange', onVisibility)
```

</details>

**依据 10 · 源码核查**：[src/client/renderers/live2d/runtime.ts:89-115](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/client/renderers/live2d/runtime.ts#L89-L115)

Core/vendor懒加载失败回不可用，不替用户提供所有运行时。

<details>
<summary>查看原文（27行）</summary>

```text
/**
 * Ensure the Cubism Core global exists, injecting the runtime-route script
 * once when absent. Resolves false when the user has not installed the core
 * (a normal state — the renderer turns it into install guidance).
 */
export function ensureCubismCore(probe: Live2dRuntimeProbe = {}): Promise<boolean> {
  if (typeof window !== 'undefined' && window.Live2DCubismCore !== undefined) return Promise.resolve(true)
  if (probe.inject !== undefined) {
    return probe.inject(CORE_URL)
      .then(() => typeof window !== 'undefined' && window.Live2DCubismCore !== undefined)
      .catch(() => false)
  }
  corePromise ??= defaultInjector(CORE_URL)
    .then(() => typeof window !== 'undefined' && window.Live2DCubismCore !== undefined)
    .catch(() => false)
  return corePromise
}

/** Ensure the plugin vendor bundle global exists (same caching discipline). */
export function ensureLive2dVendor(probe: Live2dRuntimeProbe = {}): Promise<Live2dVendor | undefined> {
  if (typeof window !== 'undefined' && window.__dshPetLive2d !== undefined) return Promise.resolve(window.__dshPetLive2d)
  if (probe.inject !== undefined) {
    return probe.inject(VENDOR_URL)
      .then(() => typeof window !== 'undefined' ? window.__dshPetLive2d : undefined)
      .catch(() => undefined)
  }
  vendorPromise ??= defaultInjector(VENDOR_URL)
```

</details>

**依据 11 · 源码核查**：[src/registry.ts:889-918](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/registry.ts#L889-L918)

坏manifest或无法解析renderer的条目被跳过，语音包另作可选降级。

<details>
<summary>查看原文（30行）</summary>

```text
    const manifestFile = join(dir, name, 'pet.json')
    if (!existsSync(manifestFile)) continue
    const parsed = readPetJson(manifestFile, options)
    if (parsed === undefined) continue
    const entryDir = join(dir, name)
    const verdict = parsePetManifest(parsed, entryDir)
    for (const diagnostic of verdict.diagnostics) {
      options.diagnostics?.push({ level: diagnostic.level, source: entryDir, message: diagnostic.message })
      options.warnings?.push(diagnostic.message)
    }
    if (!verdict.ok) continue
    let entry: PetEntry | undefined
    if (verdict.manifest.renderer === 'live2d') {
      entry = resolveLive2dEntry(verdict.manifest, entryDir, options)
    } else if (verdict.manifest.renderer === 'frames2d') {
      entry = resolveFrames2dEntry(verdict.manifest, entryDir, options)
    } else {
      const legacy = flattenV2Sprite2d(verdict.manifest)
      if (legacy === undefined) {
        const note = 'pet ' + verdict.manifest.id + ': sprite2d.atlasRows only supports 9 or 11 under the v1 compat resolver'
        options.diagnostics?.push({ level: 'error', source: entryDir, message: note })
        options.warnings?.push(note)
        continue
      }
      entry = resolvePetManifest(legacy, entryDir, options)
    }
    if (entry === undefined) continue
    // Optional voice pack (voice.json) — pure content, warn-and-drop (M4).
    const voice = loadVoicePackFile(join(entryDir, 'voice.json'), options)
    entries.push({ ...entry, ...(voice === undefined ? {} : { voice }) })
```

</details>

#### 缺口

- 不同设备、资源包和宿主版本的帧率、内存、耗电及可访问性未测。
  **影响**：不能据128MiB预算或懒加载就保证总体资源负担和体验。
  **进一步探讨**：比较内置sprite、frames2d大包、Live2D与禁用状态，记录前台/后台内存CPU及主任务响应。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁值得试用，能否推导低干扰反馈验证？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

喜欢可选视觉陪伴、使用满足声明版本的DSH网页端且设备资源充足的人，可先只用内置2D宠物试用。观察等待/工具/完成/错误是否与会话一致，摸头/喂食后重启核对非关键状态，分别测试隐藏与enabled关闭；不把宠物done或亲密度当业务完成证据。出现持续分心、遮挡主操作、明显资源增长或状态误解时，先关气泡或用主开关停用，回原生会话状态；不为保住装饰积分承担重要数据风险。

一个值得验证的方向是按用户主任务与当前会话调整提示强度，而不改变后台状态事实：默认只在等待过久、错误/需要用户动作等边界显著提示，其余动画/碎碎念更克制，并保留展开全部会话入口。推导来自最新活动驱动全局动画、当前会话优先气泡和原生状态已有信息三个事实；现有状态气泡可关、配置可调，但不等于已有按任务价值自适应的策略。减少提示可能也降低可见性或陪伴感，不能预设一定更好。

最小验证让同一用户在固定多会话任务中交叉比较原生状态、当前完整宠物和克制策略，记录需要关注事件的发现时间/漏看数、无关打断、主任务正确率及资源负担，同时收集用户是否愿意保留的主观选择。若减少气泡导致重要错误漏看，或没有降低干扰却失去用户偏好，应否定该策略。它是未来设计假设，不作为当前效率或心理收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/service.ts:731-749](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/service.ts#L731-L749)

全局动画跟最新活动，支持研究多会话提示归属。

<details>
<summary>查看原文（19行）</summary>

```text
  private applyActivity(session: Session, input: PetStateInput, whisper?: string): void {
    const activity = this.activityOf(session)
    activity.lastInput = input
    if (whisper !== undefined) activity.whisper = { text: whisper, at: Date.now() }
    activity.machine.onActivityStatus(input)
    activity.machine.onSessionActive()
    // Move to the tail so map order reads most-recent-last, then trim the
    // oldest session states beyond the bubble cap. The display session is
    // reassigned below, so trimming its stale predecessor is safe.
    this.sessionActivity.delete(session)
    this.sessionActivity.set(session, activity)
    while (this.sessionActivity.size > MAX_SESSION_BUBBLES) {
      const oldest = this.sessionActivity.keys().next().value
      if (oldest === undefined) break
      this.sessionActivity.delete(oldest)
    }
    this.displaySession = session
    this.machine.onActivityStatus(input)
    this.machine.onSessionActive()
```

</details>

**依据 2 · 源码核查**：[src/service.ts:1058-1095](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/service.ts#L1058-L1095)

当前会话气泡优先且可有多会话状态，已有信息选择是改进参照。

<details>
<summary>查看原文（38行）</summary>

```text
  private view(currentSessionId?: string): PetStateView {
    const snapshot = this.machine.render()
    const entry = this.activeEntry()
    // One bubble per concurrently active TOP-LEVEL session. The GUI's current
    // session leads the stack when reported (the browser half passes its
    // session list's 'current'); everything else keeps the most recent
    // meaningful event order. Subagent children render no bubble of their own
    // (their activity already shows through the spawning conversation's
    // bubble/display, and the bubble buttons navigate to GUI sessions, which
    // subagents are not). Sessions whose own machine has settled (no bubble
    // copy) drop out, so a finished turn does not leave a stale bubble behind.
    const sessions: PetSessionView[] = []
    for (const [session, activity] of [...this.sessionActivity.entries()].reverse()) {
      if (sessions.length >= MAX_SESSION_BUBBLES) break
      if (session.header?.origin === 'subagent') continue
      const perSession = activity.machine.render()
      if (perSession.bubble === undefined) continue
      // Each session's whisper rides its own bubble while fresh; an expired
      // whisper simply stops appearing (the client's 2 s poll drops it).
      const whisper = activity.whisper
      const freshWhisper = whisper !== undefined && Date.now() - whisper.at < WHISPER_TTL_MS
        ? whisper.text
        : undefined
      sessions.push({
        sessionId: String(session.id),
        animation: perSession.animation,
        bubble: perSession.bubble,
        phase: perSession.phase,
        ...(freshWhisper === undefined ? {} : { whisper: freshWhisper }),
      })
    }
    // The browser half reports the session the user is currently on; that
    // session's bubble leads the stack (its whisper then speaks on the
    // collapsed single bubble). An unreported or absent session keeps the
    // legacy most-recent-first order.
    if (currentSessionId !== undefined) {
      const index = sessions.findIndex(session => session.sessionId === currentSessionId)
      if (index > 0) sessions.unshift(sessions.splice(index, 1)[0]!)
```

</details>

**依据 3 · 源码核查**：[src/index.ts:398-424](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/index.ts#L398-L424)

主开关实际解除路由并同步服务，提供明确退出路径。

<details>
<summary>查看原文（27行）</summary>

```text
  const routes = makePetRoutes({ service, ctx })
  let disposeRoutes: (() => void) | undefined
  const syncRoutes = (): void => {
    const enabled = current().enabled ?? true
    if (disposeRoutes === undefined && enabled) {
      disposeRoutes = ctx.effect(
        () => {
          const disposers = routes.map((route) => ctx.webServer.register(route))
          return () => { for (const dispose of disposers) dispose() }
        },
        'pet: routes',
      )
    } else if (disposeRoutes !== undefined && !enabled) {
      disposeRoutes()
      disposeRoutes = undefined
    }
  }
  // Apply the row's config to the running service: pet.json mirrors the live
  // display the drag / hide / summon interactions write (see
  // syncSettingsFromPet), so a section the settings surface never touched
  // resolves back to exactly what the pet already shows (the composition
  // 'base' of the pre-0.1.7 section).
  const syncSettings = (): void => {
    const section = current()
    service.applySettingsSection(section)
    service.setEnabled(section.enabled ?? true)
    syncRoutes()
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:662-684](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/src/client/index.ts#L662-L684)

客户端禁用卸载可作为有边界试用的退出条件。

<details>
<summary>查看原文（23行）</summary>

```text
      let uiGone = false
      disposeUi = () => {
        if (uiGone) return
        uiGone = true
        clearUiTeardown?.()
        clearUiTeardown = undefined
        unsubscribeLocale()
        petRoot.unmount()
        container.remove()
        disposePoll()
        disposeSessionWatch()
        disposeUi = undefined
      }
      // The slot teardown is the takeover hook a later apply body runs; it
      // marks this instance terminal so a late settings callback from the
      // still-draining instance cannot remount a second pet.
      clearUiTeardown = registerPetUiTeardown(() => {
        uiDead = true
        disposeUi?.()
      })
    } else if (!uiDead && !enabled() && disposeUi !== undefined) {
      disposeUi()
      disposeUi = undefined
```

</details>

**依据 5 · 作者声明**：[README.md:39-43](https://github.com/zhu1090093659/dsh-pet/blob/c41934cc74b37e6bc9934c8473d765bae584d503/README.md#L39-L43)

作者说明气泡开关与多会话/第三方发布能力，不能等同价值自适应已实现。

```text
| Status bubbles | Only one top-level session speaks by default — the session the GUI is currently on when it is reported, otherwise the most recently active one — and the rest collapse behind a +N badge on the main bubble instead of stacking a tall column; hover the bubble (or tap the badge, for touch) to fan every session's bubble out above it and click one to jump to its session; subagent sessions report through their spawning conversation and never occupy a bubble of their own; transient interaction feedback temporarily takes priority. Bubble copy comes from generous rotating pools per scene (waiting / thinking / writing / done / failed...), tool calls map onto per-family witty lines carrying the real argument hint (e.g. 跑跑 npm test), and a long-lived scene re-phrases itself every few seconds. The pet's own status bubbles can be silenced in Settings > Pet > Status bubbles, which leaves the row to a plugin driving its own bubble surface; announcements pushed through `pet.announce` keep rendering either way |
| Inner whispers | 碎碎念: while a session streams, the pet occasionally speaks its inner voice through that session's own bubble — a fresh whisper takes over the bubble and marks it with 「」 quotes — sharing the same DeepSeek-blue glass as every status bubble, so stacked bubbles never clash — instead of stacking a second bubble — category lines woken by the SITUATION (thinking / writing / the running tool family) plus outcome lines woken only by structured results (test green from a passed test tool, error from a failed tool result, completion from a completed turn) — never from the model's words, so a discussion that merely mentions a keyword cannot wake a mood, and a whisper never quotes real content (no tool names, paths or model text); paced by cooldowns (9 s category, 5 s outcome) and an 8 s display TTL, the status copy returns after a few seconds |
| Multi-session activity | The pet is host-global: the most recent meaningful event drives the sprite animation while every active top-level session reports its own state in a separate bubble; completed turns from every session (subagents included) contribute affinity and treats |
| Voice packs and panel DIY | A per-pet voice.json plus the global $DSH_HOME/pets/.voice.json override replace every bubble word and the hover panel (button labels, stat formats, button visibility, affinity rank names); merge precedence per-pet > global > built-in, broken packs warn and never reject a pet |
| Plugin panel actions | A sibling plugin registers its own action into the hover panel's action row through the in-process pet service (`ctx.pet.registerPanelAction({ id, label, onSelect })`); the pet renders the button and dispatches the click back to the plugin's own callback, and the action goes away with the registration |
```

#### 缺口

- 克制反馈是否减少打断而不漏报，以及用户是否偏好，缺少对照。
  **影响**：不能把可爱形象或事件反馈直接认定为注意力/效率改善。
  **进一步探讨**：对同一用户交叉比较发现时间、漏看、打断、主任务质量与保留选择；无净收益则放弃假设。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
