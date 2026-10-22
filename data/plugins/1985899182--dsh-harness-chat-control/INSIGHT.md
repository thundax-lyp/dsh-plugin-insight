# dsh-harness-chat-control

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[aa3f9ed](https://github.com/1985899182/dsh-harness-chat-control/tree/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/1985899182/dsh-harness-chat-control)
<!-- END META -->

> **实现功能**：为DSH对话提供原生引用胶囊、独立侧栏追问及用户消息原位编辑，复用固定Better Sidebar和宿主会话能力。

> **核心亮点**：将原生注释胶囊、用户明确发送、带历史侧会话与surface替换接在同一DSH交互中，减少复制和重复开会话。详见[Q02](#research-q02)。

> **风险与缺陷**：prompt/cancel/info直接按ID取得agent，未复用history/model的sidechat身份核查；Host/Origin围栏不等于授权。子会话继承cwd/options且自然语言边界不隔离工具，编辑与发送缺意图nonce。详见[Q03](#research-q03)、[Q05](#research-q05)。

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
  - [Q01 · 引用、编辑和侧栏追问适合什么任务？](#detail-section-11)
  - [Q02 · 关键机制和实际亮点是什么？](#detail-section-12)
  - [Q03 · Host来源、会话身份和继承边界是否足够？](#detail-section-13)
  - [Q04 · 启动依赖与使用步骤是什么？](#detail-section-14)
  - [Q05 · 原位编辑、回收和共享状态的工程边界是什么？](#detail-section-15)
  - [Q06 · 成本效果、推荐和可继续探讨的方向是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向DSH Desktop长对话阅读者。选中回答片段或整条回答先放入原生注释胶囊，用户补问题后在原会话发；也可新建侧边会话讨论术语，不把新回答直接写回主会话。编辑用户消息则在同会话用新的可见分支替换，避免重复会话堆积。

合格结果要引用文本完整且不混进Markdown控制符、发送由用户明确触发、不同侧栏标签的引用/模型/消息相互对应，修改目标不误选同文消息。主侧展示分开不等于工具权限或工作区副作用隔离。若侧边继续调用相同工具，仍可影响相同资源。

基线是手工复制片段到新对话或原对话、再补充上下文。胶囊和带上下文的侧栏减少复制/找消息负担；不过继承的历史比选中片段多，可能带额外敏感信息和token，不能把只选一段当只有一段进入侧会话。

客户端把引用注册成原生annotation reference，用detectLength/draftRev定位插入，先走inputTriggers scoped controller再走原生引用事件。失败保留原draft并返回false，不把clipboard token降级当普通文本发送，这个失败封闭策略能避免不可解析的引用标记污染问题。

侧栏打开先创建空子会话并停放引用/问题draft，不直接调用prompt；用户点击发送才入队。Host复制父历史seed和当前输出快照，子会话origin=subagent，复制cwd、options和preset setup。首联络把boundary作为plugin来源inject，再将用户问题followup，区分参考上下文和当前请求；后续走followup。语义边界是提示，不是工具权限隔离。

项目内嵌锁定Better Sidebar实现，并替换侧栏composer/转录适配，复用原生模型/权限/停止状态。为每次引用开独立标签，把注册的sidechat definition.multiple置true。贡献是引用与原生会话/编辑事件的一致接线，不是新模型能力；vendored来源声明只有版本与检查日期，没有上游Git提交，因此本轮可追溯本仓固定实现，不扩大为已核上游同版本所有内容。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 原生引用 | 片段/整回答变胶囊 | 插入失败不降级普通token |
| 侧栏追问 | 空thread后用户发送，独立标签 | 继承上下文/权限，不是工具隔离 |
| 模型/停止 | 复用原生状态和选择 | API目标身份验证需一致 |
| 原位编辑 | 普通会话surface替换 | 历史/副作用不删除，同文交错需核 |
| 内嵌Sidebar | 固定实现减少外部版本漂移 | 共享注册和内部API仍有耦合 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH/Harness 0.2.0-rc.2与对应Desktop | 作者目标版本 | 原生注释/会话/布局接口 | 升级后需重核内部API，非通用网页插件 |
| Better Sidebar 0.24.1依赖和内嵌实现 | 必需 | 侧栏服务、转录与标签 | 不能仅复制client，其他版本并存仍需核冲突 |
| Node>=20、pnpm10或11 | 包/作者安装条件 | ESM与依赖安装 | 不自动扩展到任意运行时 |
| webServer、agents、preset、persistence等 | Host能力 | 子会话/模型/历史与编辑 | 缺服务返回错误，界面可见不等于可用 |
| 原生input/slots和React | 客户端条件 | 胶囊/发送/模型选择 | 插入失败保留draft，不降级纯token |
| 可信宿主与模型/工具权限 | 使用条件 | 控制数据披露和会话操作 | 来源围栏不替代账户授权 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 固定安装 | 按目标Desktop/Harness锁定依赖并挂bundle | 作者兼容表只作声明 |
| 原会话引用 | 选片段，检查胶囊并补问题 | 用户发送前不产生回答 |
| 侧栏引用 | 每次开独立空thread/tab | 核引用和当前模型/会话对应 |
| 编辑 | 先停止生成，再编辑用户消息发送 | 原目标surface替换，无重复错位 |
| 维护 | 版本变化时核注释、tabs、编辑和路由 | 冲突时停用并保留会话记录 |

本轮不执行安装/测试或真实会话，README的Desktop实测记录保留作者身份。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 固定宿主/Sidebar与多个peer包 | 核原生注释、路由权限和兼容 | 安装兼容人工时间/金额未知 |
| 持续使用 | 侧会话继承历史、所选模型/工具调用 | 管理侧会话/选中内容和目标 | 上下文token/并行副作用成本未量化，不只发选中片段 |
| 失败恢复 | 既有工具副作用与旧事件仍保留 | 检查错tab、编辑surface、注册冲突/升级 | 关闭标签不撤销已发生副作用，恢复时间/费用未知 |

#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 降复制负担 | 原生胶囊、空thread后由用户发送 | 作者UI声明，无本轮操作耗时测量 |
| 独立阅读追问 | 多tab和独立会话展示 | 同cwd/options，不等于权限隔离 |
| 原位修正 | surfaceOp替换与来源链 | 不是历史删除或副作用回滚 |

> **思考**：prompt/cancel/info直接按ID取得agent，未复用history/model的sidechat身份核查；Host/Origin围栏不等于授权。子会话继承cwd/options且自然语言边界不隔离工具，编辑与发送缺意图nonce。详见[Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将原生注释胶囊、用户明确发送、带历史侧会话与surface替换接在同一DSH交互中，减少复制和重复开会话。详见[Q02](#research-q02)。

将原生注释胶囊、用户明确发送、带历史侧会话与surface替换接在同一DSH交互中，减少复制和重复开会话。详见[Q02](#research-q02)。

编辑请求要求普通会话、非running，校验目标seq/文本。它先arm一次性session.append wrapper，下一个匹配用户消息时重新算surfaceRange，调用原append但把surfaceOp变replace并记sourceEventSeqs，然后恢复原函数；超时两分钟或dispose也恢复。它修改的是模型/界面的可见surface，并不是删除旧事件、撤销旧工具副作用或抹去历史数据。

并发arm同session会恢复旧record再覆盖新record，匹配主要依靠editedText。相同文本且多个编辑源交错时，源码无法仅凭字符串证明消费的是同一UI意图；已有range重算避免部分陈旧目标，但没有请求nonce贯穿arm与实际发送。不能因此断言一定错改，只指出一致性条件。

路由注册失败会逐个清理，停用也dispose路由及编辑/model临时状态。客户端替换descriptor在清理时只在仍是自己wrapper时恢复，减少覆盖他插件新值；重试timer清理。但definition.multiple=true直接改共享注册对象，未见配套恢复原multiple；所有内嵌/替换做法依赖内部接口和其他Sidebar版本的协作。HMR还清本包clientModules缓存再重建，不等于公开稳定API。

<a id="detail-section-5"></a>

### 1.4 主要限制

prompt/cancel/info直接按ID取得agent，未复用history/model的sidechat身份核查；Host/Origin围栏不等于授权。子会话继承cwd/options且自然语言边界不隔离工具，编辑与发送缺意图nonce。详见[Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，先统一所有侧会话API目标核查并确认宿主授权、编辑意图绑定和共享Sidebar恢复，再考虑固定版本可信单人环境评估。详见[Q06](#research-q06)。

合格结果要引用文本完整且不混进Markdown控制符、发送由用户明确触发、不同侧栏标签的引用/模型/消息相互对应，修改目标不误选同文消息。主侧展示分开不等于工具权限或工作区副作用隔离。若侧边继续调用相同工具，仍可影响相同资源。

基线是手工复制片段到新对话或原对话、再补充上下文。胶囊和带上下文的侧栏减少复制/找消息负担；不过继承的历史比选中片段多，可能带额外敏感信息和token，不能把只选一段当只有一段进入侧会话。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码支持已描述的入口、接线与数据流；贡献和采用价值为源码级解释，运行效果、真实宿主兼容与收益对照尚未验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/client.js、vendor/dsh-better-sidebar-0.24.1/NOTICE.md、package.json、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定lib关键引用/继承/路由/编辑/注册恢复链、包/bundle/README与vendor来源声明；不全6k行审计，不运行安装/作者校验或真实会话。
- 下一步：进一步探讨应按本项缺口执行：可继续读同版本Host路由/agents权限链，并用无敏感普通会话/sidechat ID比较拒绝点。；用无副作用工具与冲突旧指令语料比较继承/只引用两方案。；用固定长会话与多个同文片段比较操作次数、正确归属和模型输入量。；受控交错请求对照错误目标与额外操作负担。

**分析版本**

- **仓库**：[1985899182/dsh-harness-chat-control](https://github.com/1985899182/dsh-harness-chat-control)
- **版本号**：0.3.4（[固定提交 aa3f9ed](https://github.com/1985899182/dsh-harness-chat-control/tree/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索绑定parent/child的能力句柄、编辑nonce/预期surface版本和显式继承选择，比较错目标、误执行与额外操作；未实现。详见[Q06](#research-q06)。

进一步探讨应按本项缺口执行：可继续读同版本Host路由/agents权限链，并用无敏感普通会话/sidechat ID比较拒绝点。；用无副作用工具与冲突旧指令语料比较继承/只引用两方案。；用固定长会话与多个同文片段比较操作次数、正确归属和模型输入量。；受控交错请求对照错误目标与额外操作负担。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 6333 | 5145 | 1004 | — |
| .md | source | 5 | 464 | — | — | 6618 |
| .mjs | source | 2 | 1324 | 1207 | 64 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1985899182/dsh-harness-chat-control/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查固定版本原生引用、侧栏子会话和原位编辑的便利与身份/继承/一致性边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 引用、编辑和侧栏追问适合什么任务？

**研究主题**：场景与需求

#### 完整回答

面向DSH Desktop长对话阅读者。选中回答片段或整条回答先放入原生注释胶囊，用户补问题后在原会话发；也可新建侧边会话讨论术语，不把新回答直接写回主会话。编辑用户消息则在同会话用新的可见分支替换，避免重复会话堆积。

合格结果要引用文本完整且不混进Markdown控制符、发送由用户明确触发、不同侧栏标签的引用/模型/消息相互对应，修改目标不误选同文消息。主侧展示分开不等于工具权限或工作区副作用隔离。若侧边继续调用相同工具，仍可影响相同资源。

基线是手工复制片段到新对话或原对话、再补充上下文。胶囊和带上下文的侧栏减少复制/找消息负担；不过继承的历史比选中片段多，可能带额外敏感信息和token，不能把只选一段当只有一段进入侧会话。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-10](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/README.md#L5-L10)

当前固定版本复核。两种引用形式作者目标。

```text
让 DSH Desktop 的对话交互接近 ChatGPT。

> **项目目标：复刻 ChatGPT 的两种引用对话形式。**
>
> 1. **主对话引用**：在当前会话引用回答，输入问题后继续在原会话中回答。
> 2. **侧边栏引用对话**：把引用带到 Better Sidebar，在独立侧边会话中追问，主会话保持不变。
```

**依据 2 · 作者声明**：[README.md:28-37](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/README.md#L28-L37)

当前固定版本复核。胶囊、侧栏和原位编辑作者说明。

<details>
<summary>查看原文（10行）</summary>

```text
- **主对话引用**：引用整条回答或选中的片段；不会把 Markdown 标记（如 `>`、`---`）污染到正文。
- **原生注释胶囊**：引用在输入框中显示为 `1 条注释` 胶囊，用户可先编辑问题、移除引用，再决定是否发送。
- **内置侧边栏**：直接内置并锁定 `dsh-better-sidebar@0.24.1` 的 `SideChatView`、转录映射和样式；未安装 Better Sidebar 时也能使用，已安装其他版本时仍由本项目的侧边实现生效。
- **侧边栏引用**：沿用 Better Sidebar 原生对话布局和 DSH 原生会话/模型能力；主会话与侧边会话相互独立。
- **侧边原生对话栏**：权限、模型菜单、停止和发送状态都由原生对话栏负责，避免重复事件导致整页卡死。
- **模型选择**：侧边会话直接使用原生模型选择器，模型设置只作用于当前侧边会话。
- **编辑并重发**：用户消息点击铅笔后回到原生输入框；发送后在原会话位置覆盖显示新的分支，不创建一串重复新会话。
- **停止回答**：复用 DSH 原生停止/发送状态，引用和侧边栏不会拦截或重复提交原生事件。

插件只增加引用胶囊、入口和会话路由；侧边栏的布局、转录和会话生命周期来自锁定的 Better Sidebar 0.24.1 源码，避免外部插件版本冲突。
```

</details>

**依据 3 · 源码核查**：[lib/index.js:745-784](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/index.js#L745-L784)

当前固定版本复核。继承seed/options/cwd而非只有选中片段。

<details>
<summary>查看原文（40行）</summary>

```text
		"sidechat.start": async (payload) => {
			const sessionId = requireSidechatString(payload, "sessionId");
			const rawQuestion = payload.question;
			const question = typeof rawQuestion === "string" ? rawQuestion.trim() : "";
			const parent = liveThreadAgent(ctx, sessionId);
			if (parent === void 0) throw new SidechatModelError("sidechat-error", `parent session "${sessionId}" is not running`, 409);
			const parentSession = parent.session;
			const parentEvents = sessionLogEvents(parentSession) ?? [];
			const inheritance = buildSidechatInheritance(parentEvents);
			const { agentPreset, setup } = await composeChildSetup(ctx, resolvePresetId(parentSession.header ?? {}, parentEvents));
			const childId = `session-${randomUUID()}`;
			const label = question === "" ? SIDE_NEW_THREAD_TITLE : sideLabel(question);
			const descriptor = snapshotSubagentDescriptor({
				mode: "continuable",
				provider: "sidechat",
				label,
				...parent.options.provider === void 0 ? {} : { agentProvider: parent.options.provider },
				...parent.options.model === void 0 ? {} : { agentModel: parent.options.model }
			});
			const descriptorEvent = {
				type: "subagent/descriptor",
				seq: inheritance.seed.length,
				time: Date.now(),
				data: descriptor
			};
			const seed = [...inheritance.seed, descriptorEvent];
			const options = {
				sessionId: childId,
				meta: {
					...parentSession.header.cwd === void 0 ? {} : { cwd: parentSession.header.cwd },
					parentSession: parentSession.id,
					seedLength: seed.length,
					origin: "subagent",
					delegationDepth: (parentSession.header.delegationDepth ?? 0) + 1,
					...agentPreset === void 0 ? {} : { agentPreset }
				},
				seed,
				agentOptions: { ...parent.options },
				setup,
				signal: AbortSignal.timeout(CREATE_TIMEOUT_MS)
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 关键机制和实际亮点是什么？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

客户端把引用注册成原生annotation reference，用detectLength/draftRev定位插入，先走inputTriggers scoped controller再走原生引用事件。失败保留原draft并返回false，不把clipboard token降级当普通文本发送，这个失败封闭策略能避免不可解析的引用标记污染问题。

侧栏打开先创建空子会话并停放引用/问题draft，不直接调用prompt；用户点击发送才入队。Host复制父历史seed和当前输出快照，子会话origin=subagent，复制cwd、options和preset setup。首联络把boundary作为plugin来源inject，再将用户问题followup，区分参考上下文和当前请求；后续走followup。语义边界是提示，不是工具权限隔离。

项目内嵌锁定Better Sidebar实现，并替换侧栏composer/转录适配，复用原生模型/权限/停止状态。为每次引用开独立标签，把注册的sidechat definition.multiple置true。贡献是引用与原生会话/编辑事件的一致接线，不是新模型能力；vendored来源声明只有版本与检查日期，没有上游Git提交，因此本轮可追溯本仓固定实现，不扩大为已核上游同版本所有内容。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:870-919](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/client.js#L870-L919)

当前固定版本复核。原生插入及拒绝纯文本fallback。

<details>
<summary>查看原文（50行）</summary>

```text
      const occurrences = Array.isArray(snapshot?.occurrences) ? snapshot.occurrences : []
      const detectLength = typeof snapshot?.detectText === 'string'
        ? snapshot.detectText.length
        : draft.length - occurrences.reduce((total, occurrence) => {
            const length = Number(occurrence?.length)
            return Number.isFinite(length) && length > 1 ? total + length - 1 : total
          }, 0)
      return {
        draft,
        draftRev: Number.isInteger(snapshot?.draftRev) ? snapshot.draftRev : undefined,
        occurrences,
        detectLength: Math.max(0, detectLength)
      }
    }

    function createReferenceInserter(ctx, sessions, inputBridge) {
      return (sessionId, text) => {
        const clean = clampText(text)
          if (clean === '' || sessionId === undefined || sessionId === null) return false
          const record = inputBridge?.get(sessionId)
        const resolved = inputForSession(ctx, sessions, sessionId)
        const snapshot = inputSnapshotOf(resolved?.input, record)
        const reference = annotationReference(clean)
        const span = snapshot.draftRev === undefined
          ? undefined
          : {
              // `insertReference` consumes detect-projection offsets.  Keep
              // the span at the logical editor end even when earlier chips
              // have a longer clipboard projection.
              start: snapshot.detectLength,
              end: snapshot.detectLength,
              draftRev: snapshot.draftRev
            }

        if (resolved?.actx !== undefined && span !== undefined) {
          const inputTriggers = safeGet(ctx, 'inputTriggers')
          const controller = typeof inputTriggers?.sessionOf === 'function'
            ? inputTriggers.sessionOf(resolved.actx)
            : undefined
          try {
            if (controller?.execute?.({ insert: reference }, span) === true) return true
          } catch (error) {
            console.warn(`[${PLUGIN_ID}] native reference insertion failed`, error)
          }
          try {
            if (resolved.actx.bail?.(resolved.actx, 'slash/input-insert-reference', {
              reference,
              span
            }) === true) return true
          } catch (error) {
```

</details>

**依据 2 · 源码核查**：[lib/client.js:2261-2284](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/client.js#L2261-L2284)

当前固定版本复核。创建空线程、停放引用且不prompt。

<details>
<summary>查看原文（24行）</summary>

```text
    function dropSidechatSeed(sessionId, childId) {
      if (typeof sessionId !== 'string' || sessionId === '') return
      const queue = PENDING_SIDECHAT_SEEDS.get(sessionId)
      if (queue === undefined) return
      const index = queue.findIndex((entry) => entry.childId === childId)
      if (index < 0) return
      queue.splice(index, 1)
      if (queue.length === 0) PENDING_SIDECHAT_SEEDS.delete(sessionId)
    }

    async function openNativeSideChat(ctx, sessionId, referenceText, question = '', draftController) {
      if (sessionId === undefined || sessionId === null) throw new Error('当前没有可用会话。')
      const service = safeGet(ctx, 'betterSidebar')
      const features = Array.isArray(service?.features) ? service.features : []
      if (typeof service?.openTab !== 'function'
        || typeof service?.getSnapshot !== 'function'
        || typeof service?.subscribeState !== 'function'
        || (features.length > 0 && (!features.includes('targetedOpen') || !features.includes('stateSubscription')))) {
        throw new Error('需要先安装并启用 dsh-better-sidebar@0.24.1。')
      }
      const scope = { sessionId: String(sessionId) }
      // Mint the thread first: the gesture must not depend on the tab view
      // mounting, nor on that tab being the focused one, before it can resolve.
      const childId = await sidechatNative.startSidechatThread(scope.sessionId)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:729-734](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/index.js#L729-L734)

当前固定版本复核。inject与followup分离。

```text
function admitFirstContact(agent, injectionText, question, blocks = textPrompt(question)) {
	agent.inject(createIdentifiedUserMessage({
		content: textPrompt(injectionText),
		source: { kind: `plugin:${SIDE_INJECTION_PLUGIN}` }
	}));
  admitFollowup(agent, blocks);
```

**依据 4 · 源码核查**：[lib/index.js:745-808](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/index.js#L745-L808)

当前固定版本复核。子会话seed/options/首次边界。

<details>
<summary>查看原文（64行）</summary>

```text
		"sidechat.start": async (payload) => {
			const sessionId = requireSidechatString(payload, "sessionId");
			const rawQuestion = payload.question;
			const question = typeof rawQuestion === "string" ? rawQuestion.trim() : "";
			const parent = liveThreadAgent(ctx, sessionId);
			if (parent === void 0) throw new SidechatModelError("sidechat-error", `parent session "${sessionId}" is not running`, 409);
			const parentSession = parent.session;
			const parentEvents = sessionLogEvents(parentSession) ?? [];
			const inheritance = buildSidechatInheritance(parentEvents);
			const { agentPreset, setup } = await composeChildSetup(ctx, resolvePresetId(parentSession.header ?? {}, parentEvents));
			const childId = `session-${randomUUID()}`;
			const label = question === "" ? SIDE_NEW_THREAD_TITLE : sideLabel(question);
			const descriptor = snapshotSubagentDescriptor({
				mode: "continuable",
				provider: "sidechat",
				label,
				...parent.options.provider === void 0 ? {} : { agentProvider: parent.options.provider },
				...parent.options.model === void 0 ? {} : { agentModel: parent.options.model }
			});
			const descriptorEvent = {
				type: "subagent/descriptor",
				seq: inheritance.seed.length,
				time: Date.now(),
				data: descriptor
			};
			const seed = [...inheritance.seed, descriptorEvent];
			const options = {
				sessionId: childId,
				meta: {
					...parentSession.header.cwd === void 0 ? {} : { cwd: parentSession.header.cwd },
					parentSession: parentSession.id,
					seedLength: seed.length,
					origin: "subagent",
					delegationDepth: (parentSession.header.delegationDepth ?? 0) + 1,
					...agentPreset === void 0 ? {} : { agentPreset }
				},
				seed,
				agentOptions: { ...parent.options },
				setup,
				signal: AbortSignal.timeout(CREATE_TIMEOUT_MS)
			};
			const agents = ctx.get("agents");
			if (agents?.create === void 0) throw new SidechatModelError("sidechat-error", "the agents service is unavailable", 503);
			let handle;
			try {
				handle = await agents.create(options);
			} catch (error) {
				throw new SidechatModelError("sidechat-error", `thread creation failed: ${error instanceof Error ? error.message : String(error)}`, 500);
			}
			threadDisposers.set(childId, () => handle.dispose());
			const titles = ctx.get("sessionTitle");
			const pinTitle = (label) => {
				if (titles === void 0) return;
				try {
					titles.rename(handle.agent.session, label);
				} catch {}
			};
			if (question === "") {
				if (inheritance.snapshot !== null) pendingSnapshots.set(childId, inheritance.snapshot);
				pinTitle(SIDE_NEW_THREAD_TITLE);
			} else {
				const promptParts = [SIDE_BOUNDARY_PROMPT];
				if (inheritance.snapshot !== null) promptParts.push(inheritance.snapshot);
				admitFirstContact(handle.agent, promptParts.join("\n\n"), question);
```

</details>

**依据 5 · 源码核查**：[lib/client.js:2042-2052](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/client.js#L2042-L2052)

当前固定版本复核。multiple注册变更。

<details>
<summary>查看原文（11行）</summary>

```text
    }

    /**
     * Better Sidebar registers `sidechat` as a single page kind, so the
     * native right Sidebar treats every open of that kind as "show the page
     * that is already open" and focuses the first tab; only closing it frees
     * the kind again.  The host-supported multi-instance switch is the same
     * one the built-in terminal/browser kinds use, and it is what gives each
     * side conversation its own tab.
     */
    function ensureMultiTabSidechat(ctx) {
```

</details>

**依据 6 · 作者声明**：[vendor/dsh-better-sidebar-0.24.1/NOTICE.md:1-16](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/vendor/dsh-better-sidebar-0.24.1/NOTICE.md#L1-L16)

当前固定版本复核。内嵌来源作者声明。

<details>
<summary>查看原文（16行）</summary>

```text
# Vendored sidechat implementation

This project embeds the `SideChatView`, sidechat transcript mapping, sidechat
core helpers, locale chrome, icons, and CSS from `dsh-better-sidebar@0.24.1`.
The code is kept in the private client module and the host runtime so the
sidechat tab and its `/sidebar/api/sidechat.*` lifecycle are owned by this
plugin even when another Better Sidebar version is installed.

Upstream source: <https://github.com/omdsh-dev/DSH-better-sidebar>

The embedded implementation was inspected from the published package on
2026-10-08. Changes made here are limited to the project-owned API adapter and
the reference-chip draft bridge; the panel layout and sidechat interaction
remain the upstream implementation.

See [LICENSE](./LICENSE) for the upstream MIT license.
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Host来源、会话身份和继承边界是否足够？

**研究主题**：缺陷与关键质疑

#### 完整回答

trustedRequest要求Host为loopback或trustedHosts、拒绝Sec-Fetch-Site cross-site及null Origin，但无Origin直接允许；有Origin只比较hostname，不比较scheme/port。它是请求来源围栏，不是用户认证或每会话权限授权。不能把可伪造的Host或缺Origin当可信客户端身份，也不能仅据这些源码声称某部署已经对外暴露。

sidechatChildOf会检查subagent origin、parentSession和sidechat descriptor，history/model链使用这一验证。但sidechat.prompt先直接agents.get(childId)，冷恢复只从持久化读preset并resume；cancel/info也直接拿输入childId找agent，没有同等sidechat身份核对。对已能通过Host围栏且知道有效ID的调用方，代码层不能保证操作只落本插件创建的侧会话；目标如果是普通会话，cancel可触达普通agent，prompt还可能注入侧会话boundary。宿主服务是否另有权限/身份拒绝需另核，未实际调用或复现越权。

继承父options/preset/cwd后用自然语言说“旧指令仅参考”，不会移除工具能力或构成沙箱。主会话看起来不变，也不能证明资源不被侧会话改变。引用、历史与图片仍进入所选模型，需按数据披露范围判断。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:239-267](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/index.js#L239-L267)

当前固定版本复核。Host/Origin fence与无Origin放行。

<details>
<summary>查看原文（29行）</summary>

```text
function trustedAuthority(hostUrl, trustedHosts) {
  for (const entry of Array.isArray(trustedHosts) ? trustedHosts : []) {
    const entryUrl = parseAuthority(entry)
    if (entryUrl === undefined) continue
    if (entryUrl.hostname === hostUrl.hostname) {
      if (entryUrl.port === '' || entryUrl.port === hostUrl.port) return true
    }
    if (entryUrl.host === hostUrl.host) return true
  }
  return false
}

/** Same Host/Origin fence used by Better Sidebar's own JSON routes. */
function trustedRequest(ctx, req) {
  const authority = typeof req?.headers?.host === 'string' ? req.headers.host : ''
  const hostUrl = parseAuthority(authority)
  if (hostUrl === undefined) return false
  const runtime = getService(ctx, 'webRuntime')
  const trustedHosts = runtime?.trustedHosts || []
  if (!isLoopbackHostname(hostUrl.hostname) && !trustedAuthority(hostUrl, trustedHosts)) return false
  if (req?.headers?.['sec-fetch-site'] === 'cross-site') return false
  const origin = req?.headers?.origin
  if (origin === undefined) return true
  if (origin === 'null') return false
  try {
    return new URL(origin).hostname === hostUrl.hostname
  } catch {
    return false
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:923-941](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/index.js#L923-L941)

当前固定版本复核。严格child身份辅助函数。

<details>
<summary>查看原文（19行）</summary>

```text
function sidechatChildOf(ctx, childId) {
  const agents = getService(ctx, 'agents')
  const agent = agents?.get?.(childId)
  if (agent !== undefined) {
    const header = agent.session?.header
    const parentSession = header?.parentSession || header?.parentSessionId
    if (header?.origin !== 'subagent' || typeof parentSession !== 'string' || parentSession === '') return undefined
    if (!descriptorIsSidechat(sessionLogEvents(agent.session))) return undefined
    return { agent }
  }
  const persistence = getService(ctx, 'sessionPersistence')
  if (!persistenceReadable(persistence)) return undefined
  return readPersistedSession(persistence, childId).then((persisted) => {
    const meta = persisted.header || {}
    const parentSession = meta.parentSession || meta.parentSessionId
    if (meta.origin !== 'subagent' || typeof parentSession !== 'string' || parentSession === '') return undefined
    if (!descriptorIsSidechat(persisted.events)) return undefined
    return { agent: undefined }
  }).catch(() => undefined)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:596-606](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/index.js#L596-L606)

当前固定版本复核。冷恢复只重建preset。

<details>
<summary>查看原文（11行）</summary>

```text
async function composePersistedSetup(ctx, childId) {
	const persistence = ctx.get("sessionPersistence");
	if (persistence === void 0) return () => Promise.resolve();
	const persisted = await readPersistedSession(persistence, childId);
	const presetId = resolvePresetId(persisted.header ?? {}, persisted.events ?? []);
	const presets = ctx.get("agentPresets");
	if (presets === void 0 || presetId === void 0) return () => Promise.resolve();
	const resolved = await presets.resolve(presetId);
	return async (agentCtx) => {
		await presets.mount(agentCtx, resolved.id);
	};
```

</details>

**依据 4 · 源码核查**：[lib/index.js:813-845](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/index.js#L813-L845)

当前固定版本复核。prompt直接live lookup或resume。

<details>
<summary>查看原文（33行）</summary>

```text
		"sidechat.prompt": async (payload) => {
			const childId = requireSidechatString(payload, "childId");
			const images = sidechatImageParts(payload.images);
			const rawText = payload?.text;
			if (typeof rawText !== "string") throw new SidechatModelError("bad-request", "missing or invalid \"text\"");
			const text = rawText.trim();
			if (text === "" && images.length === 0) throw new SidechatModelError("bad-request", "text or images are required");
			let agent = liveThreadAgent(ctx, childId);
			if (agent === void 0) {
				const agents = ctx.get("agents");
				if (agents?.resume === void 0) throw new SidechatModelError("sidechat-error", "the agents service is unavailable", 503);
				const setup = await composePersistedSetup(ctx, childId);
				try {
					const handle = await agents.resume({
						resumeSessionId: childId,
						setup
					});
					threadDisposers.set(childId, () => handle.dispose());
					agent = handle.agent;
				} catch (error) {
					throw new SidechatModelError("sidechat-error", `thread resume failed: ${error instanceof Error ? error.message : String(error)}`, 500);
				}
			}
			const admit = async () => {
				await assertSidechatImageModel(ctx, agent, images.length > 0);
				const blocks = await sidechatPromptContent(ctx, text, images);
				if (boundaryDelivered(sessionLogEvents(agent.session) ?? [])) admitFollowup(agent, blocks);
				else {
					const parts = [SIDE_BOUNDARY_PROMPT];
					const snapshot = pendingSnapshots.get(childId);
					pendingSnapshots.delete(childId);
					if (snapshot !== void 0) parts.push(snapshot);
					admitFirstContact(agent, parts.join("\n\n"), text, blocks);
```

</details>

**依据 5 · 源码核查**：[lib/index.js:866-905](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/index.js#L866-L905)

当前固定版本复核。cancel/info按ID取任意live agent。

<details>
<summary>查看原文（40行）</summary>

```text
		"sidechat.cancel": async (payload) => {
			const agent = liveThreadAgent(ctx, requireSidechatString(payload, "childId"));
			if (agent !== void 0) agent.cancel({ kind: "user" }, { keepInbox: true });
			return { accepted: true };
		},
		"sidechat.dispose": async (payload) => {
			const childId = requireSidechatString(payload, "childId");
			pendingSnapshots.delete(childId);
			const dispose = threadDisposers.get(childId);
			if (dispose !== void 0) {
				threadDisposers.delete(childId);
				try {
					await dispose();
				} catch {}
			}
			return { accepted: true };
		},
		"sidechat.info": async (payload) => {
			const childId = requireSidechatString(payload, "childId");
			const agent = liveThreadAgent(ctx, childId);
			if (agent !== void 0) {
				const preset = agent.session.header.agentPreset;
				return {
					live: true,
					status: agent.status,
					...agent.options.provider === void 0 ? {} : { provider: agent.options.provider },
					...agent.options.model === void 0 ? {} : { model: agent.options.model },
					...preset === void 0 ? {} : { preset }
				};
			}
			const persistence = ctx.get("sessionPersistence");
			if (persistence !== void 0) try {
				const persisted = await readPersistedSession(persistence, childId);
				const preset = persisted.events === void 0
					? undefined
					: resolvePresetId(persisted.header ?? {}, persisted.events);
				return {
					live: false,
					...preset === void 0 ? {} : { preset }
				};
```

</details>

**依据 6 · 源码核查**：[lib/index.js:289-295](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/index.js#L289-L295)

当前固定版本复核。边界为自然语言指令。

```text
const SIDE_BOUNDARY_PROMPT = `Side conversation boundary.

Everything before this boundary is inherited history from the parent session: its completed turns, its pending question, and — if the parent was mid-turn — its in-progress output frozen at the moment this side conversation started. It is reference context only. It is not your current task.

Do not continue, execute, or complete any instructions, plans, tool calls, approvals, edits, or requests from before this boundary. Only messages submitted after this boundary are active user instructions for this side conversation.

Mode: this is a continuable side conversation. Your answers stay in this side thread and are viewed in the side panel; they are never delivered into the parent session.`;
```

**依据 7 · 源码核查**：[lib/index.js:771-784](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/index.js#L771-L784)

当前固定版本复核。cwd与options继承。

<details>
<summary>查看原文（14行）</summary>

```text
			const options = {
				sessionId: childId,
				meta: {
					...parentSession.header.cwd === void 0 ? {} : { cwd: parentSession.header.cwd },
					parentSession: parentSession.id,
					seedLength: seed.length,
					origin: "subagent",
					delegationDepth: (parentSession.header.delegationDepth ?? 0) + 1,
					...agentPreset === void 0 ? {} : { agentPreset }
				},
				seed,
				agentOptions: { ...parent.options },
				setup,
				signal: AbortSignal.timeout(CREATE_TIMEOUT_MS)
```

</details>

#### 缺口

- 宿主部署授权、agents服务内部目标权限未在该仓库得到证明。
  **影响**：无法确定具体部署访问面或跨会话操作是否实际可达。
  **进一步探讨**：可继续读同版本Host路由/agents权限链，并用无敏感普通会话/sidechat ID比较拒绝点。
- 继承历史对模型遵守boundary和工具副作用的影响没有受控对照。
  **影响**：不能把提示当权限隔离或保证不会延续旧任务。
  **进一步探讨**：用无副作用工具与冲突旧指令语料比较继承/只引用两方案。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动依赖与使用步骤是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

依赖或条件为DSH/Harness 0.2.0-rc.2与对应Desktop，是否必需为作者目标版本，用途为原生注释/会话/布局接口，缺失或不满足时为升级后需重核内部API，非通用网页插件。
依赖或条件为Better Sidebar 0.24.1依赖和内嵌实现，是否必需为必需，用途为侧栏服务、转录与标签，缺失或不满足时为不能仅复制client，其他版本并存仍需核冲突。
依赖或条件为Node>=20、pnpm10或11，是否必需为包/作者安装条件，用途为ESM与依赖安装，缺失或不满足时为不自动扩展到任意运行时。
依赖或条件为webServer、agents、preset、persistence等，是否必需为Host能力，用途为子会话/模型/历史与编辑，缺失或不满足时为缺服务返回错误，界面可见不等于可用。
依赖或条件为原生input/slots和React，是否必需为客户端条件，用途为胶囊/发送/模型选择，缺失或不满足时为插入失败保留draft，不降级纯token。
依赖或条件为可信宿主与模型/工具权限，是否必需为使用条件，用途为控制数据披露和会话操作，缺失或不满足时为来源围栏不替代账户授权。

步骤为固定安装，执行者与动作为按目标Desktop/Harness锁定依赖并挂bundle，成功判据或失败处理为作者兼容表只作声明。
步骤为原会话引用，执行者与动作为选片段，检查胶囊并补问题，成功判据或失败处理为用户发送前不产生回答。
步骤为侧栏引用，执行者与动作为每次开独立空thread/tab，成功判据或失败处理为核引用和当前模型/会话对应。
步骤为编辑，执行者与动作为先停止生成，再编辑用户消息发送，成功判据或失败处理为原目标surface替换，无重复错位。
步骤为维护，执行者与动作为版本变化时核注释、tabs、编辑和路由，成功判据或失败处理为冲突时停用并保留会话记录。

本轮不执行安装/测试或真实会话，README的Desktop实测记录保留作者身份。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:52-78](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/package.json#L52-L78)

当前固定版本复核。固定Better Sidebar依赖与大量peer。

<details>
<summary>查看原文（27行）</summary>

```text
        "@deepseek-ai/dsh-client-modules",
        "dsh-better-sidebar"
      ]
    }
  },
  "dependencies": {
    "dsh-better-sidebar": "0.24.1"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-api-session-controller": "0.2.0-rc.2",
    "@deepseek-ai/dsh-attachment": "0.2.0-rc.2",
    "@deepseek-ai/dsh-client-ui-chat": "0.2.0-rc.2",
    "@deepseek-ai/dsh-client-ui-conversation": "0.2.0-rc.2",
    "@deepseek-ai/dsh-client-ui-input-trigger": "0.2.0-rc.2",
    "@deepseek-ai/dsh-client-ui-model-selection": "0.2.0-rc.2",
    "@deepseek-ai/dsh-client-locale": "0.2.0-rc.2",
    "@deepseek-ai/dsh-client-ui-slots": "0.2.0-rc.2",
    "@deepseek-ai/dsh-client-modules": "0.2.0-rc.2",
    "@deepseek-ai/dsh-client-ui-layout": "0.2.0-rc.2",
    "@deepseek-ai/dsh-client-ui-primitives": "0.2.0-rc.2",
    "@deepseek-ai/dsh-client-ui-sidebar": "0.2.0-rc.2",
    "@deepseek-ai/dsh-client-ui-session": "0.2.0-rc.2",
    "@deepseek-ai/dsh-llm": "0.2.0-rc.2",
    "@deepseek-ai/dsh-subagent": "0.2.0-rc.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
```

</details>

**依据 2 · 源码核查**：[package.json:87-92](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/package.json#L87-L92)

当前固定版本复核。Node/pnpm和MIT。

```text
  "engines": {
    "node": ">=20",
    "pnpm": ">=10 <12"
  },
  "license": "MIT"
}
```

**依据 3 · 源码核查**：[cordis.patch.yml:1-4](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/cordis.patch.yml#L1-L4)

当前固定版本复核。Host多服务注入。

```text
- insert:
    - id: harness-chat-control
      name: dsh-harness-chat-control
      inject: [clientModules, webServer, webRuntime, llm, sessionController, agents, agentPresets, sessionPersistence, sessionTitle]
```

**依据 4 · 作者声明**：[README.md:39-49](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/README.md#L39-L49)

当前固定版本复核。作者兼容版本表。

<details>
<summary>查看原文（11行）</summary>

```text
## 适配版本

| 组件 | 版本 |
| --- | --- |
| DSH Desktop（Windows） | `0.11.0` / `0.12.0` |
| DeepSeek Harness / `@deepseek-ai/dsh` | `0.2.0-rc.2` |
| `dsh-better-sidebar` | **`0.24.1`** |
| Node.js | `>=20` |
| pnpm | `10.x` 或 `11.x` |

`dsh-better-sidebar@0.24.1` 面向 Harness `0.2.0-rc.2`。使用 DSH Desktop `0.11.0` / `0.12.0`（内置 Harness `0.2.0-rc.2`）时请固定为 `0.24.1`。
```

</details>

**依据 5 · 作者声明**：[README.md:99-99](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/README.md#L99-L99)

当前固定版本复核。作者Desktop三tab实测，不当本轮验收。

```text
当前里程碑：**`v0.3.4`**，适配上表中的 DSH Desktop `0.11.0` / `0.12.0` 与 Harness `0.2.0-rc.2`，并内置 `dsh-better-sidebar@0.24.1` 的侧边对话实现。本版在右侧栏标签的右键菜单中增加“关闭其他标签 / 关闭右侧标签 / 关闭左侧标签”：菜单项通过宿主 `sidebar.right.tab.menu.item` 插槽注册，关闭统一走宿主的 `closeIn`，左右顺序以实际标签栏为准，没有可关闭目标时对应项自动置灰。同时保留 v0.3.3 的侧边对话多标签修复：插件在安装时和每次打开前把 `sidechat` 标签类型切换为宿主原生的多实例模式（与内置终端、浏览器相同的 `multiple` 开关），每次引用都会创建独立的侧边对话标签，引用多个名词时可同时并列多个对话。已在 DSH Desktop `0.12.0`（内置 Harness `0.2.0-rc.2`）实测：连续三次在主对话选中文本并点击“在侧边聊天中提问”，侧边栏依次出现三个各自的侧边对话标签，每个标签保留自己的引用注释且互不覆盖；三个批量关闭项在同一窗口验证通过。升级 DSH 或 Harness 主版本后，请重新验证原生 Slots、侧边对话 API 和状态接口。
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 原位编辑、回收和共享状态的工程边界是什么？

**研究主题**：工程质量与复用

#### 完整回答

编辑请求要求普通会话、非running，校验目标seq/文本。它先arm一次性session.append wrapper，下一个匹配用户消息时重新算surfaceRange，调用原append但把surfaceOp变replace并记sourceEventSeqs，然后恢复原函数；超时两分钟或dispose也恢复。它修改的是模型/界面的可见surface，并不是删除旧事件、撤销旧工具副作用或抹去历史数据。

并发arm同session会恢复旧record再覆盖新record，匹配主要依靠editedText。相同文本且多个编辑源交错时，源码无法仅凭字符串证明消费的是同一UI意图；已有range重算避免部分陈旧目标，但没有请求nonce贯穿arm与实际发送。不能因此断言一定错改，只指出一致性条件。

路由注册失败会逐个清理，停用也dispose路由及编辑/model临时状态。客户端替换descriptor在清理时只在仍是自己wrapper时恢复，减少覆盖他插件新值；重试timer清理。但definition.multiple=true直接改共享注册对象，未见配套恢复原multiple；所有内嵌/替换做法依赖内部接口和其他Sidebar版本的协作。HMR还清本包clientModules缓存再重建，不等于公开稳定API。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1178-1208](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/index.js#L1178-L1208)

当前固定版本复核。目标校验、busy拒绝与arm。

<details>
<summary>查看原文（31行）</summary>

```text
      const payload = await readJsonBody(req)
      const sessionId = requireField(payload, 'sessionId')
      const text = payload?.text
      if (typeof text !== 'string' || text.trim() === '' || text.length > MAX_EDIT_TEXT_LENGTH) {
        throw new SidechatModelError('bad-request', 'missing or invalid "text"')
      }
      const targetText = typeof payload?.targetText === 'string' ? payload.targetText : ''
      if (targetText.length > MAX_EDIT_TEXT_LENGTH) {
        throw new SidechatModelError('bad-request', 'invalid "targetText"')
      }
      const rawStartSeq = payload?.startSeq
      if (rawStartSeq !== undefined && (!Number.isSafeInteger(rawStartSeq) || rawStartSeq < 0)) {
        throw new SidechatModelError('bad-request', 'invalid "startSeq"')
      }
      const agent = await resolveOrdinaryAgent(ctx, sessionId)
      const session = agent?.session
      if (agent === undefined || session === undefined) {
        throw new SidechatModelError('session-unavailable', '当前会话尚未加载，请先打开当前对话后重试', 409)
      }
      if (session.header?.origin === 'subagent') {
        throw new SidechatModelError('session-unavailable', '侧边子会话不支持修改主对话消息', 409)
      }
      if (agent.status === 'running') {
        throw new SidechatModelError('agent-busy', '当前会话仍在生成，请先停止后再修改', 409)
      }
      const range = sessionEditRange(session, rawStartSeq, targetText)
      if (range === undefined) {
        throw new SidechatModelError('message-not-found', '找不到要修改的用户消息，请刷新当前会话后重试', 404)
      }
      arm(session, sessionId, range, targetText, text)
      writeOk(res, { sessionId, armed: true })
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1127-1165](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/index.js#L1127-L1165)

当前固定版本复核。一次性append wrapper、重算与timeout。

<details>
<summary>查看原文（39行）</summary>

```text
  const arm = (session, sessionId, range, targetText, editedText) => {
    restore(armed.get(sessionId))
    const original = session.append
    if (typeof original !== 'function') throw new SidechatModelError('unavailable', '当前会话不支持原地修改', 503)
    const record = {
      session,
      sessionId,
      original,
      range,
      targetText,
      editedText,
      restored: false,
      consumed: false,
      timer: undefined,
      wrapper: undefined
    }
    record.wrapper = function sessionEditAppend(type, data, ...opts) {
      const matches = !record.consumed
        && type === 'user/message'
        && data?.source?.kind === 'user'
        && (record.editedText === '' || textFromMessage(data) === record.editedText)
      if (!matches) return record.original.call(this, type, data, ...opts)

      const currentRange = sessionEditRange(session, record.range.startSeq, record.targetText)
      if (currentRange === undefined) {
        restore(record)
        return record.original.call(this, type, data, ...opts)
      }
      record.consumed = true
      restore(record)
      return record.original.call(this, type, data, {
        surfaceOp: { op: 'replace', startSeq: currentRange.startSeq, endSeq: currentRange.endSeq },
        sourceEventSeqs: currentRange.sourceEventSeqs
      })
    }
    session.append = record.wrapper
    record.timer = setTimeout(() => restore(record), PENDING_SELECTION_TTL_MS)
    record.timer.unref?.()
    armed.set(sessionId, record)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1498-1526](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/index.js#L1498-L1526)

当前固定版本复核。注册回滚与停用清理。

<details>
<summary>查看原文（29行）</summary>

```text
    } catch (error) {
      try { disposeModelRoute?.() } finally {
        try { disposeHistoryRoute?.() } finally {
          try { disposeSessionEditRoute?.() } finally {
            for (const dispose of disposeSidechatApi.splice(0)) {
              try { dispose?.() } catch {}
            }
            modelRoute.dispose()
            sessionEditRoute.dispose()
          }
        }
      }
      throw error
    }
    return () => {
      try { disposeModelRoute?.() } finally {
        try { disposeHistoryRoute?.() } finally {
          try { disposeSessionEditRoute?.() } finally {
            for (const dispose of disposeSidechatApi.splice(0)) {
              try { dispose?.() } catch {}
            }
            modelRoute.dispose()
            sessionEditRoute.dispose()
          }
        }
      }
    }
  }
  if (typeof ctx?.effect === 'function') ctx.effect(registerRoute, 'dsh-harness-chat-control: sidechat host routes')
```

</details>

**依据 4 · 源码核查**：[lib/client.js:2078-2083](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/client.js#L2078-L2083)

当前固定版本复核。descriptor只恢复自己的wrapper。

```text
      let offService

      // Cordis guards undeclared context properties.  `betterSidebar` is
      // provided by the bundled Better Sidebar shell at runtime, but it is
      // intentionally not part of this plugin's inject contract (the shell
      // may be absent until its own client fiber has run).  Always resolve it
```

**依据 5 · 源码核查**：[lib/client.js:2161-2169](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/client.js#L2161-L2169)

当前固定版本复核。timer/订阅/记录清理。

```text
        const host = typeof window !== 'undefined' ? window : globalThis
        if (typeof host?.setTimeout !== 'function') break
        const timer = host.setTimeout(() => {
          timers.delete(timer)
          install()
        }, delay)
        timers.add(timer)
      }
      install()
```

**依据 6 · 源码核查**：[lib/client.js:2042-2052](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/client.js#L2042-L2052)

当前固定版本复核。共享multiple直接改。

<details>
<summary>查看原文（11行）</summary>

```text
    }

    /**
     * Better Sidebar registers `sidechat` as a single page kind, so the
     * native right Sidebar treats every open of that kind as "show the page
     * that is already open" and focuses the first tab; only closing it frees
     * the kind again.  The host-supported multi-instance switch is the same
     * one the built-in terminal/browser kinds use, and it is what gives each
     * side conversation its own tab.
     */
    function ensureMultiTabSidechat(ctx) {
```

</details>

**依据 7 · 源码核查**：[lib/index.js:1553-1571](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/index.js#L1553-L1571)

当前固定版本复核。本包client缓存重建。

<details>
<summary>查看原文（19行）</summary>

```text
      if (clientModules.pkgMeta?.entries && typeof clientModules.pkgMeta.delete === 'function') {
        for (const [key, value] of clientModules.pkgMeta.entries()) {
          if (key.endsWith(`\u0000${name}`) || value?.packageName === name) clientModules.pkgMeta.delete(key)
        }
      }
      if (clientModules.sources?.entries && typeof clientModules.sources.delete === 'function') {
        for (const [key, value] of clientModules.sources.entries()) {
          if (value?.packageName === name) clientModules.sources.delete(key)
        }
      }
      clientModules.table?.delete?.(name)

      // Reconcile a late-mounted package before asking for its content hash.
      if (clientModules.dirty?.add && typeof clientModules.flush === 'function') {
        clientModules.dirty.add(name)
        clientModules.flush((error) => errors.push(error instanceof Error ? error.message : String(error)))
      }
      const revision = typeof clientModules.rebuilt === 'function'
        ? clientModules.rebuilt(name)
```

</details>

#### 缺口

- 多编辑源同文本交错、热更和他Sidebar并存没有本轮事件轨迹。
  **影响**：不保证每次arm与发送意图一一绑定，也不判现有实现必然冲突。
  **进一步探讨**：固定两个编辑nonce、相同文本/不同目标与插件停用次序，比较surface来源和注册恢复。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本效果、推荐和可继续探讨的方向是什么？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

阶段为首次，现金与资源成本为固定宿主/Sidebar与多个peer包，人工与时间投入为核原生注释、路由权限和兼容，已知条件与未知项为安装兼容人工时间/金额未知。
阶段为持续使用，现金与资源成本为侧会话继承历史、所选模型/工具调用，人工与时间投入为管理侧会话/选中内容和目标，已知条件与未知项为上下文token/并行副作用成本未量化，不只发选中片段。
阶段为失败恢复，现金与资源成本为既有工具副作用与旧事件仍保留，人工与时间投入为检查错tab、编辑surface、注册冲突/升级，已知条件与未知项为关闭标签不撤销已发生副作用，恢复时间/费用未知。

目标为降复制负担，源码支持的增量为原生胶囊、空thread后由用户发送，证据边界为作者UI声明，无本轮操作耗时测量。
目标为独立阅读追问，源码支持的增量为多tab和独立会话展示，证据边界为同cwd/options，不等于权限隔离。
目标为原位修正，源码支持的增量为surfaceOp替换与来源链，证据边界为不是历史删除或副作用回滚。

先观察。引用接线、无自动发送和编辑恢复有明确设计，但会话目标校验在不同API间不一致、Host围栏仅来源检查，共享Sidebar注册变更及多版本适配也增加维护负担。可信单人固定版本可继续源码评估，不直接把它作为安全分离工作流推荐安装。

可探讨“引用意图与子会话能力收据”。创建时发绑定parent/child/nonce的句柄，prompt/cancel/model/history全部复核同一来源和权限；编辑arm与发送共享一次性nonce/预期surface版本，侧会话显式选择只引用或继承上下文，并给工具能力独立授权。它可能减少错会话和无意继承，但会增加UI与协议复杂度。

假设未实现。最小对照是普通ID/侧会话ID交叉请求、两个同文编辑的交错、多tab切换和旧指令继承，记录拒绝点、错误目标、上下文量、误执行和操作数；若只是新增确认而未减少错误，不计有效创新。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:745-784](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/index.js#L745-L784)

当前固定版本复核。继承历史/配置的持续成本。

<details>
<summary>查看原文（40行）</summary>

```text
		"sidechat.start": async (payload) => {
			const sessionId = requireSidechatString(payload, "sessionId");
			const rawQuestion = payload.question;
			const question = typeof rawQuestion === "string" ? rawQuestion.trim() : "";
			const parent = liveThreadAgent(ctx, sessionId);
			if (parent === void 0) throw new SidechatModelError("sidechat-error", `parent session "${sessionId}" is not running`, 409);
			const parentSession = parent.session;
			const parentEvents = sessionLogEvents(parentSession) ?? [];
			const inheritance = buildSidechatInheritance(parentEvents);
			const { agentPreset, setup } = await composeChildSetup(ctx, resolvePresetId(parentSession.header ?? {}, parentEvents));
			const childId = `session-${randomUUID()}`;
			const label = question === "" ? SIDE_NEW_THREAD_TITLE : sideLabel(question);
			const descriptor = snapshotSubagentDescriptor({
				mode: "continuable",
				provider: "sidechat",
				label,
				...parent.options.provider === void 0 ? {} : { agentProvider: parent.options.provider },
				...parent.options.model === void 0 ? {} : { agentModel: parent.options.model }
			});
			const descriptorEvent = {
				type: "subagent/descriptor",
				seq: inheritance.seed.length,
				time: Date.now(),
				data: descriptor
			};
			const seed = [...inheritance.seed, descriptorEvent];
			const options = {
				sessionId: childId,
				meta: {
					...parentSession.header.cwd === void 0 ? {} : { cwd: parentSession.header.cwd },
					parentSession: parentSession.id,
					seedLength: seed.length,
					origin: "subagent",
					delegationDepth: (parentSession.header.delegationDepth ?? 0) + 1,
					...agentPreset === void 0 ? {} : { agentPreset }
				},
				seed,
				agentOptions: { ...parent.options },
				setup,
				signal: AbortSignal.timeout(CREATE_TIMEOUT_MS)
```

</details>

**依据 2 · 源码核查**：[lib/index.js:923-941](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/index.js#L923-L941)

当前固定版本复核。统一目标核验的现有基线。

<details>
<summary>查看原文（19行）</summary>

```text
function sidechatChildOf(ctx, childId) {
  const agents = getService(ctx, 'agents')
  const agent = agents?.get?.(childId)
  if (agent !== undefined) {
    const header = agent.session?.header
    const parentSession = header?.parentSession || header?.parentSessionId
    if (header?.origin !== 'subagent' || typeof parentSession !== 'string' || parentSession === '') return undefined
    if (!descriptorIsSidechat(sessionLogEvents(agent.session))) return undefined
    return { agent }
  }
  const persistence = getService(ctx, 'sessionPersistence')
  if (!persistenceReadable(persistence)) return undefined
  return readPersistedSession(persistence, childId).then((persisted) => {
    const meta = persisted.header || {}
    const parentSession = meta.parentSession || meta.parentSessionId
    if (meta.origin !== 'subagent' || typeof parentSession !== 'string' || parentSession === '') return undefined
    if (!descriptorIsSidechat(persisted.events)) return undefined
    return { agent: undefined }
  }).catch(() => undefined)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1127-1165](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/index.js#L1127-L1165)

当前固定版本复核。nonce/版本编辑方案基线。

<details>
<summary>查看原文（39行）</summary>

```text
  const arm = (session, sessionId, range, targetText, editedText) => {
    restore(armed.get(sessionId))
    const original = session.append
    if (typeof original !== 'function') throw new SidechatModelError('unavailable', '当前会话不支持原地修改', 503)
    const record = {
      session,
      sessionId,
      original,
      range,
      targetText,
      editedText,
      restored: false,
      consumed: false,
      timer: undefined,
      wrapper: undefined
    }
    record.wrapper = function sessionEditAppend(type, data, ...opts) {
      const matches = !record.consumed
        && type === 'user/message'
        && data?.source?.kind === 'user'
        && (record.editedText === '' || textFromMessage(data) === record.editedText)
      if (!matches) return record.original.call(this, type, data, ...opts)

      const currentRange = sessionEditRange(session, record.range.startSeq, record.targetText)
      if (currentRange === undefined) {
        restore(record)
        return record.original.call(this, type, data, ...opts)
      }
      record.consumed = true
      restore(record)
      return record.original.call(this, type, data, {
        surfaceOp: { op: 'replace', startSeq: currentRange.startSeq, endSeq: currentRange.endSeq },
        sourceEventSeqs: currentRange.sourceEventSeqs
      })
    }
    session.append = record.wrapper
    record.timer = setTimeout(() => restore(record), PENDING_SELECTION_TTL_MS)
    record.timer.unref?.()
    armed.set(sessionId, record)
```

</details>

**依据 4 · 源码核查**：[lib/client.js:2261-2284](https://github.com/1985899182/dsh-harness-chat-control/blob/aa3f9edbb59276e1a2dc0a3e520f6281afd0b424/lib/client.js#L2261-L2284)

当前固定版本复核。现有明确发送边界。

<details>
<summary>查看原文（24行）</summary>

```text
    function dropSidechatSeed(sessionId, childId) {
      if (typeof sessionId !== 'string' || sessionId === '') return
      const queue = PENDING_SIDECHAT_SEEDS.get(sessionId)
      if (queue === undefined) return
      const index = queue.findIndex((entry) => entry.childId === childId)
      if (index < 0) return
      queue.splice(index, 1)
      if (queue.length === 0) PENDING_SIDECHAT_SEEDS.delete(sessionId)
    }

    async function openNativeSideChat(ctx, sessionId, referenceText, question = '', draftController) {
      if (sessionId === undefined || sessionId === null) throw new Error('当前没有可用会话。')
      const service = safeGet(ctx, 'betterSidebar')
      const features = Array.isArray(service?.features) ? service.features : []
      if (typeof service?.openTab !== 'function'
        || typeof service?.getSnapshot !== 'function'
        || typeof service?.subscribeState !== 'function'
        || (features.length > 0 && (!features.includes('targetedOpen') || !features.includes('stateSubscription')))) {
        throw new Error('需要先安装并启用 dsh-better-sidebar@0.24.1。')
      }
      const scope = { sessionId: String(sessionId) }
      // Mint the thread first: the gesture must not depend on the tab view
      // mounting, nor on that tab being the focused one, before it can resolve.
      const childId = await sidechatNative.startSidechatThread(scope.sessionId)
```

</details>

#### 缺口

- 没有人工复制与胶囊/侧栏相同任务的效率、token和错目标率对照。
  **影响**：无法量化收益或并行上下文成本。
  **进一步探讨**：用固定长会话与多个同文片段比较操作次数、正确归属和模型输入量。
- 能力句柄、编辑nonce和可选继承方案未实现。
  **影响**：不计当前权限隔离或评分优势。
  **进一步探讨**：受控交错请求对照错误目标与额外操作负担。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
