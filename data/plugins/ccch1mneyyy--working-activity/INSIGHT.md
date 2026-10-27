# working-activity

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[8999ac3](https://github.com/ccch1mneyyy/working-activity/tree/8999ac3312df3a8d9e0b09ce81eb26d16ccab695)

<!-- BEGIN META -->
[![GitHub ★ 667](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=667&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ccch1mneyyy/working-activity) [![npm 30d 133](https://img.shields.io/static/v1?label=npm+30d&message=133&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/pi-working-activity) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/pi-working-activity)
<!-- END META -->

> **功能**：为 pi 与 DSH 提供实时工具活动、模型自述、耗时和收尾统计的工作状态行。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 的增量是把工具事件、耗时和实时自述集中成可消费的状态投影，降低查找活动的步骤；不证明编码任务更快。

> **主要限制**：[Q03](#research-q03) 默认自述增加上下文和输出，且活动结束不等于交付通过；宿主事件与客户端版本会影响显示。

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
  - [Q01 · 两套适配服务什么任务，贡献归属在哪里？](#detail-section-11)
  - [Q02 · 真实活动和模型自述如何进入界面？](#detail-section-12)
  - [Q03 · 兼容和持续开销的边界是什么？](#detail-section-13)
  - [Q04 · 谁值得试用，如何证明有用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长时间编码任务操作者需要看懂当前活动，原办法是转圈提示和完整日志。

宿主原状态提示与日志；模型自述只是意图，不作为代码完成证据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 工具活动 | 查看正在执行的动作 | 只表示活动不保证结果 |
| 模型自述 | 显示模型当前意图 | 可关闭，会增加提示与输出 |
| 会话投影 | 供界面读取工作状态 | 客户端需实际消费 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 子包及相应宿主事件 | DSH必需 | 接收工具和会话活动 | 状态缺失或降级 |
| TUI槽或客户端投影消费 | 显示必需其一 | 呈现状态行 | 无人消费不产生可见价值 |
| 模型自述 | 可选 | 显示意图短句 | 关闭仍可看事件活动 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 接入 | 用户安装DSH子包 | 不是根pi包 |
| 运行 | Agent执行工具，插件生成状态 | 与真实工具一致 |
| 核对 | 用户对比日志与状态 | 停止不代表验收通过 |
| 退出 | 用户关闭自述或卸载 | 回宿主状态和日志 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 插件及宿主资源 | 选择正确包和界面 | 用时未知 |
| 持续使用 | 自述额外token与绘制 | 观察状态并核对 | 资源和token增量未测 |
| 失败恢复 | 重试绘制和排障 | 禁用并查日志 | 跨版本恢复未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 工作可见性 | 事件到状态投影接通 | 用户误判断是否减少 |
| 生命周期 | 会话释放和卸载清理 | 真实多端兼容 |

> **思考**：[Q03](#research-q03) 默认自述增加上下文和输出，且活动结束不等于交付通过；宿主事件与客户端版本会影响显示。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 的增量是把工具事件、耗时和实时自述集中成可消费的状态投影，降低查找活动的步骤；不证明编码任务更快。

[Q02](#research-q02) 持久事件与瞬态流分开处理、作用域释放和按需计时器可借鉴；移植需匹配宿主事件语义而非只复制文案。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 默认自述增加上下文和输出，且活动结束不等于交付通过；宿主事件与客户端版本会影响显示。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先仅事件模式，以工具日志为事实核对；若增加干扰或误导，回宿主原状态。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

事件与投影接线有源码支持，跨界面运行和用户误判断收益未验证。

- 已检查：作者 README、包清单、源码路径 README.md、packages/activity/working-activity/package.json、packages/activity/working-activity/src/index.ts、packages/activity/working-activity/src/projection.ts、extensions/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根仓库含pi与DSH两包，重点读DSH实际接线，根统计不能等同DSH组件规模；未核全部Web渲染。
- 下一步：比较原状态、仅事件、加自述三组误取消、延迟识别及额外token；未执行。

**分析版本**

- **仓库**：[ccch1mneyyy/working-activity](https://github.com/ccch1mneyyy/working-activity)
- **版本号**：1.9.0（[固定提交 8999ac3](https://github.com/ccch1mneyyy/working-activity/tree/8999ac3312df3a8d9e0b09ce81eb26d16ccab695)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出分开显示已观察活动与模型意图；若不能减少误取消和卡住误判，增加文案没有成立的收益。

比较原状态、仅事件、加自述三组误取消、延迟识别及额外token；未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 2077 | — | — | 30212 |
| .ts | source | 22 | 8301 | 5733 | 2127 | — |
| .ts | test | 27 | 6573 | 4934 | 1010 | — |
| .mjs | source | 6 | 2142 | 1626 | 363 | — |
| .tsx | source | 1 | 94 | 36 | 53 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/ccch1mneyyy/working-activity/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/ccch1mneyyy/working-activity/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ccch1mneyyy/working-activity/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：工作状态能否减少等待误判，同时保持活动与成果边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 两套适配服务什么任务，贡献归属在哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

仓库同时发布 pi CLI 扩展和 DSH 插件，两者源码、安装和运行时独立；根 package 是 pi，DSH 包在子目录，不能把根包安装命令直接用于 DSH。目标用户是长时间等待编码 Agent 的操作者，合格结果是知道当前活动和持续时间，而不是证明代码任务完成。相对固定转圈或查看完整日志，事件驱动状态把工具、模型自述和耗时放到一行，增量是可读可见性；随机文案和工具次数不代表生产效率。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-26](https://github.com/ccch1mneyyy/working-activity/blob/8999ac3312df3a8d9e0b09ce81eb26d16ccab695/README.md#L3-L26)

双平台适配与目录身份。

<details>
<summary>查看原文（24行）</summary>

````text
面向编码 agent 的实时工作状态行。同一套设计维护两个平台适配，分别以独立 npm 包发布：

| 平台 | npm 包 | 源码 | 安装 |
|---|---|---|---|
| pi CLI | `pi-working-activity` | [`extensions/index.ts`](extensions/index.ts) | `pi install npm:pi-working-activity` |
| DeepSeek Harness（DSH） | `dsh-working-activity` | [`packages/activity/working-activity/`](packages/activity/working-activity/) | `dsh plugin --profile <profile> add dsh-working-activity` |

作者：chimney（[@ccch1mneyyy](https://github.com/ccch1mneyyy)）。社区项目，非 DeepSeek 官方项目。

两个版本共享同一套状态行理念——实时工具活动、耗时、模型自述与收尾统计——但运行时、配置与安装方式各自独立。pi 版是无构建的 pi 扩展；DSH 版是 cordis 宿主插件，另带一个可选的 Web 客户端条目，覆盖 TUI、Web UI 与桌面 GUI 三个界面。

## 目录结构

```
extensions/                              pi 版扩展（唯一源码，无构建）
tests/                                   pi 版测试
package.json                             pi 版包（发布 pi-working-activity）
packages/activity/working-activity/      DSH 版插件（发布 dsh-working-activity）
packages/activity/working-activity-alpha2-compat/
                                         隔离的 DSH 0.1.2-alpha.2 兼容夹具
packages/activity/working-activity-rc2-compat/
                                         隔离的 DSH 0.2.1-rc.2 兼容夹具（peer 覆盖 0.2.0-rc.2）
patches/webui-working-activity.patch      历史 Web runtime 补丁（保留仅作历史参考，当前构建不使用）
docs/dsh-working-activity.md             DSH 版完整文档
````

</details>

**依据 2 · 作者声明**：[README.md:39-45](https://github.com/ccch1mneyyy/working-activity/blob/8999ac3312df3a8d9e0b09ce81eb26d16ccab695/README.md#L39-L45)

DSH独立安装和投影来源。

````text
DSH：

```sh
dsh plugin --profile <profile> add dsh-working-activity
```

DSH 包是自挂载 bundle，安装后无需手动挂载。TUI、Web UI 与 GUI 读取 `workingActivity` 会话投影；Web 端不再需要 runtime 补丁。
````

**依据 3 · 源码核查**：[packages/activity/working-activity/src/index.ts:485-494](https://github.com/ccch1mneyyy/working-activity/blob/8999ac3312df3a8d9e0b09ce81eb26d16ccab695/packages/activity/working-activity/src/index.ts#L485-L494)

会话事件实际驱动活动输出。

<details>
<summary>查看原文（10行）</summary>

```text
  ctx.on('session/event', (session, event) => {
    const runtime = runtimeFor(session)
    runtime.tracker.onSessionEvent(event)
    // Re-key the live overlay onto the fold's new state object: `apply`
    // returns a fresh cell per fold, so without this the overlay would stay on
    // the previous cell and a read right after a durable event (a tool
    // starting, say) would lose the freshest `⏵` line until the next frame.
    noteLiveOverlay(session, runtime.tracker)
    feed(runtime, runtime.tracker.render())
  })
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 真实活动和模型自述如何进入界面？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

DSH apply 在可选 tuiPrompt 上注册 activity 槽，无 TUI 时不报错；默认 narrate 把自述约定放入 systemPrompt。sessionProjections 注册 createActivityProjection 供客户端读，会话事件进入 ActivityTracker 渲染；瞬态 assistant-stream 单独处理，再把模型自述覆盖到投影状态，避免只依赖持久日志漏掉正在生成内容。会话释放清理运行时，卸载停止每个计时器。这里确认事件到投影与TUI槽的接线，未核实际Web客户端渲染，因此跨所有界面兼容只是作者说明，不是本轮验收。

#### 证据与依据

**依据 1 · 源码核查**：[packages/activity/working-activity/src/index.ts:229-251](https://github.com/ccch1mneyyy/working-activity/blob/8999ac3312df3a8d9e0b09ce81eb26d16ccab695/packages/activity/working-activity/src/index.ts#L229-L251)

TUI 槽和模型自述提示词入口。

<details>
<summary>查看原文（23行）</summary>

```text
  // Optional TUI seam: no TUI composed -> no slot, no error. The register()
  // call is itself effect-owned, so fiber disposal unregisters the slot.
  const prompt = ctx.get('tuiPrompt', false) as TuiPromptLike | undefined
  const promptHandle = prompt?.register('activity', undefined)
  // With no prompt slot, no debug trace and publish off, `publish` would queue
  // an empty microtask per session event and `armTimer` would keep a per-session
  // timer alive for a line nobody consumes. The projection and live-overlay
  // paths do not use `publish`/`armTimer`, so the whole line sink can be skipped.
  const hasLineSink = promptHandle !== undefined || debugLogPath !== undefined || resolved.publish

  // The `⏵` self-narration contract rides the stable system-prompt sections:
  // injected when the systemPrompt service is composed (agent assemblies
  // always mount it), removed with this fiber. The text is resolved at every
  // assembly in the live language, so a `/lang` switch applies to the next
  // turn without rebuilding the agent.
  if (resolved.narrate) {
    ctx.inject(['systemPrompt'], (promptCtx) => {
      promptCtx.systemPrompt.section({
        name: 'working-activity:narrate',
        order: 60,
        text: () => t('narrate-instruction'),
      })
    })
```

</details>

**依据 2 · 源码核查**：[packages/activity/working-activity/src/index.ts:326-338](https://github.com/ccch1mneyyy/working-activity/blob/8999ac3312df3a8d9e0b09ce81eb26d16ccab695/packages/activity/working-activity/src/index.ts#L326-L338)

投影注册。

<details>
<summary>查看原文（13行）</summary>

```text
        register(definition: unknown): () => void
        /** Present on the current line; the rc.6-era registry has no state read. */
        stateOf?: (session: Session, key: string) => unknown
      }
    }).sessionProjections
    if (registry === undefined) return
    projectionService = registry
    registry.register(createActivityProjection({
      trackerConfig,
      customActions: resolved.customActions,
      lang: langNow,
      live: state => (state !== null && typeof state === 'object' ? liveNarration.get(state) : undefined),
    }))
```

</details>

**依据 3 · 源码核查**：[packages/activity/working-activity/src/index.ts:485-534](https://github.com/ccch1mneyyy/working-activity/blob/8999ac3312df3a8d9e0b09ce81eb26d16ccab695/packages/activity/working-activity/src/index.ts#L485-L534)

持久与瞬态事件、释放和计时器清理。

<details>
<summary>查看原文（50行）</summary>

```text
  ctx.on('session/event', (session, event) => {
    const runtime = runtimeFor(session)
    runtime.tracker.onSessionEvent(event)
    // Re-key the live overlay onto the fold's new state object: `apply`
    // returns a fresh cell per fold, so without this the overlay would stay on
    // the previous cell and a read right after a durable event (a tool
    // starting, say) would lose the freshest `⏵` line until the next frame.
    noteLiveOverlay(session, runtime.tracker)
    feed(runtime, runtime.tracker.render())
  })

  // Live model output. On the current host line the durable `assistant/chunk`
  // event this plugin used to fold is gone — streamed deltas arrive as
  // transient `agent/assistant-stream` frames instead — so the realtime half of
  // the line (first-token promotion, `⏵` narration, tok/s) rides on these
  // frames. Subscribed through a cast so the one build still loads on older
  // corridors, where the event never fires and the durable path above carries
  // the line.
  // The cursor that orders frames lives with the emitting agent, so a replaced
  // agent (whose revision restarts at 1) is never mistaken for a stale one.
  ctx.on('agent/assistant-stream' as never, (({ agent, frame }: { agent: Agent; frame: unknown }) => {
    const runtime = runtimeFor(agent.session)
    feedStreamFrame(runtime.tracker, agent, frame)
    // Hand the live facts to the projected value as well: a projection folds
    // committed events only, so without this overlay the line a client reads
    // would never carry the model's own `⏵` words — nor learn that the first
    // token already arrived (frames never fold; see src/projection.ts).
    noteLiveOverlay(agent.session, runtime.tracker)
    feed(runtime, runtime.tracker.render())
  }) as never)

  ctx.on('session/disposed', (session) => {
    const runtime = runtimes.get(session)
    if (runtime !== undefined) stopTimer(runtime)
    runtimes.delete(session)
    if (slotSession === session) slotSession = undefined
  })

  ctx.on('agent/status', ({ agent, status }) => {
    const runtime = runtimeFor(agent.session)
    runtime.tracker.onAgentStatus(status)
    feed(runtime, runtime.tracker.render())
  })

  // No interval: each session's next redraw is armed from its own tracker
  // (`nextWakeAt`), so idle and settled lines hold no timer at all. The effect
  // disposer stops every pending wake-up when this fiber unloads.
  ctx.effect(() => () => {
    for (const runtime of runtimes.values()) stopTimer(runtime)
  }, 'working-activity session timers')
```

</details>

#### 缺口

- Web和桌面最终渲染未实测
  **影响**：不能保证所有客户端显示一致
  **进一步探讨**：同宿主会话核对工具开始、流式自述、结束和恢复

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 兼容和持续开销的边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

接入必须安装正确的 DSH 子包，且宿主提供相应事件、投影与可选TUI服务。瞬态流事件不持久化，代码依靠 live overlay 补实时状态；旧宿主不发该事件时只用持久路径，恢复后的实时细节可能与进行中不同。默认自述改变系统提示并要求模型输出状态，不应宣称零 token 开销；关闭 narrate 可保留事件驱动部分。日志、计时器和绘制消耗资源但无实测金额或CPU，不能从无固定 interval 推断零负担。工作状态的 done 仅是 Agent 活动停止，不替代用户验收；插件失配时可关闭并回看宿主日志。

#### 证据与依据

**依据 1 · 源码核查**：[packages/activity/working-activity/src/index.ts:239-251](https://github.com/ccch1mneyyy/working-activity/blob/8999ac3312df3a8d9e0b09ce81eb26d16ccab695/packages/activity/working-activity/src/index.ts#L239-L251)

默认自述会注入提示。

<details>
<summary>查看原文（13行）</summary>

```text
  // The `⏵` self-narration contract rides the stable system-prompt sections:
  // injected when the systemPrompt service is composed (agent assemblies
  // always mount it), removed with this fiber. The text is resolved at every
  // assembly in the live language, so a `/lang` switch applies to the next
  // turn without rebuilding the agent.
  if (resolved.narrate) {
    ctx.inject(['systemPrompt'], (promptCtx) => {
      promptCtx.systemPrompt.section({
        name: 'working-activity:narrate',
        order: 60,
        text: () => t('narrate-instruction'),
      })
    })
```

</details>

**依据 2 · 源码核查**：[packages/activity/working-activity/src/index.ts:496-514](https://github.com/ccch1mneyyy/working-activity/blob/8999ac3312df3a8d9e0b09ce81eb26d16ccab695/packages/activity/working-activity/src/index.ts#L496-L514)

瞬态帧与持久路径区别。

<details>
<summary>查看原文（19行）</summary>

```text
  // Live model output. On the current host line the durable `assistant/chunk`
  // event this plugin used to fold is gone — streamed deltas arrive as
  // transient `agent/assistant-stream` frames instead — so the realtime half of
  // the line (first-token promotion, `⏵` narration, tok/s) rides on these
  // frames. Subscribed through a cast so the one build still loads on older
  // corridors, where the event never fires and the durable path above carries
  // the line.
  // The cursor that orders frames lives with the emitting agent, so a replaced
  // agent (whose revision restarts at 1) is never mistaken for a stale one.
  ctx.on('agent/assistant-stream' as never, (({ agent, frame }: { agent: Agent; frame: unknown }) => {
    const runtime = runtimeFor(agent.session)
    feedStreamFrame(runtime.tracker, agent, frame)
    // Hand the live facts to the projected value as well: a projection folds
    // committed events only, so without this overlay the line a client reads
    // would never carry the model's own `⏵` words — nor learn that the first
    // token already arrived (frames never fold; see src/projection.ts).
    noteLiveOverlay(agent.session, runtime.tracker)
    feed(runtime, runtime.tracker.render())
  }) as never)
```

</details>

**依据 3 · 源码核查**：[packages/activity/working-activity/src/index.ts:529-534](https://github.com/ccch1mneyyy/working-activity/blob/8999ac3312df3a8d9e0b09ce81eb26d16ccab695/packages/activity/working-activity/src/index.ts#L529-L534)

按需计时器和卸载清理。

```text
  // No interval: each session's next redraw is armed from its own tracker
  // (`nextWakeAt`), so idle and settled lines hold no timer at all. The effect
  // disposer stops every pending wake-up when this fiber unloads.
  ctx.effect(() => () => {
    for (const runtime of runtimes.values()) stopTimer(runtime)
  }, 'working-activity session timers')
```

**依据 4 · 源码核查**：[packages/activity/working-activity/package.json:1-15](https://github.com/ccch1mneyyy/working-activity/blob/8999ac3312df3a8d9e0b09ce81eb26d16ccab695/packages/activity/working-activity/package.json#L1-L15)

DSH子包身份。

<details>
<summary>查看原文（15行）</summary>

```text
{
  "name": "dsh-working-activity",
  "description": "Live model working-status line: playful copy, running tool, elapsed time, and a context/todos/jobs HUD — for TUI, Web UI, and the desktop GUI",
  "version": "0.7.0",
  "type": "module",
  "main": "lib/types/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/types/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
```

</details>

#### 缺口

- 自述增量 token 与误导用户比例未知
  **影响**：无法证明降低端到端成本
  **进一步探讨**：比较关闭自述、仅事件和完整模式的费用及错误中断

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁值得试用，如何证明有用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

经常运行长编码任务、难区分等待与卡住的 DSH 用户可以先仅启用事件状态，再决定是否要模型自述；短任务或不看状态栏者收益有限。未验证方向是把“观察到的活动”与“模型自述的意图”分别显示，避免语言文案让用户以为发生了实际进展。固定同一任务比较宿主原状态、仅事件、事件加自述，记录误取消、发现卡住时间、额外 token 和干扰。若只是文案更热闹而没有减少误判，停用自述或整个插件，回宿主状态和日志。

#### 证据与依据

**依据 1 · 源码核查**：[packages/activity/working-activity/src/index.ts:485-514](https://github.com/ccch1mneyyy/working-activity/blob/8999ac3312df3a8d9e0b09ce81eb26d16ccab695/packages/activity/working-activity/src/index.ts#L485-L514)

事件与模型自述来源不同。

<details>
<summary>查看原文（30行）</summary>

```text
  ctx.on('session/event', (session, event) => {
    const runtime = runtimeFor(session)
    runtime.tracker.onSessionEvent(event)
    // Re-key the live overlay onto the fold's new state object: `apply`
    // returns a fresh cell per fold, so without this the overlay would stay on
    // the previous cell and a read right after a durable event (a tool
    // starting, say) would lose the freshest `⏵` line until the next frame.
    noteLiveOverlay(session, runtime.tracker)
    feed(runtime, runtime.tracker.render())
  })

  // Live model output. On the current host line the durable `assistant/chunk`
  // event this plugin used to fold is gone — streamed deltas arrive as
  // transient `agent/assistant-stream` frames instead — so the realtime half of
  // the line (first-token promotion, `⏵` narration, tok/s) rides on these
  // frames. Subscribed through a cast so the one build still loads on older
  // corridors, where the event never fires and the durable path above carries
  // the line.
  // The cursor that orders frames lives with the emitting agent, so a replaced
  // agent (whose revision restarts at 1) is never mistaken for a stale one.
  ctx.on('agent/assistant-stream' as never, (({ agent, frame }: { agent: Agent; frame: unknown }) => {
    const runtime = runtimeFor(agent.session)
    feedStreamFrame(runtime.tracker, agent, frame)
    // Hand the live facts to the projected value as well: a projection folds
    // committed events only, so without this overlay the line a client reads
    // would never carry the model's own `⏵` words — nor learn that the first
    // token already arrived (frames never fold; see src/projection.ts).
    noteLiveOverlay(agent.session, runtime.tracker)
    feed(runtime, runtime.tracker.render())
  }) as never)
```

</details>

**依据 2 · 作者声明**：[README.md:106-119](https://github.com/ccch1mneyyy/working-activity/blob/8999ac3312df3a8d9e0b09ce81eb26d16ccab695/README.md#L106-L119)

自述与收尾统计的作者说明。

<details>
<summary>查看原文（14行）</summary>

````text
### 模型自述

默认开启。扩展通过 `before_agent_start` 向模型注入约定：每个步骤开始时写 `⏵ 你在做什么（≤20 字）`。扩展实时解析流式输出，把自述显示在 Working 行。可在配置中设 `"narrate": false` 或执行 `/activity narrate off` 关闭。

```
⏵ 查一下报错原因        →  Working 行：查一下报错原因 · 搜搜 error.log
⏵ 给补丁跑个验证        →  Working 行：给补丁跑个验证 · 跑命令 node test
```

### 配速与收尾摘要

- 思考中：`嗯… · 总1m23s`
- 工具中：`改改 file.ts · 3s`
- 结束后：底部状态区显示 `搞定 ✓ · 4 工具 · 想3s 干2s`，对话区末尾通知 `⏱ 总用时 1m23s · 4 工具 · 想12s 干11s`
````

</details>

#### 缺口

- 分离活动和意图是否减少误判断未知
  **影响**：属于设计假设而非已有收益
  **进一步探讨**：以误取消和人工判断准确性对照，不数文案数量

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
