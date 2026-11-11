# dsh-ponytail

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[7223820](https://github.com/Wenaixi/dsh-ponytail/tree/7223820c9d7f78f4be1ada285fbf953d7867518c)

<!-- BEGIN META -->
[![GitHub ★ 42](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=42&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Wenaixi/dsh-ponytail) [![npm 30d 5,421](https://img.shields.io/static/v1?label=npm+30d&message=5%2C421&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wenaixi/dsh-ponytail) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wenaixi/dsh-ponytail)
<!-- END META -->

> **功能**：将 Ponytail 工程指令和专门 Skill 接入 DSH，并提供会话内模式切换。

> **亮点**：[Q01](#research-q01) 将上游工程规则适配成 DSH 提示段、Skill 目录与会话模式。

> **主要限制**：[Q02](#research-q02) 默认 off 的新具名会话可回退 full，[Q03](#research-q03) 本地基线锁定不足以证明供应商缓存。

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
  - [Q01 · 插件把哪些工程规则接进代理，和手写提示有什么区别？](#detail-section-11)
  - [Q02 · 模式关闭和会话基线具体如何相互作用？](#detail-section-12)
  - [Q03 · 前缀与缓存、维护成本之间能推断什么？](#detail-section-13)
  - [Q04 · 如何限定采用，怎样验证低负担切档？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望减少过度实现的开发者可以在隔离会话观察小修复的任务范围及真实提示。

项目已有规则和手工提示也能约束修改范围；插件把规则接入宿主并提供切档，效果仍由模型和任务验收决定。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 工程提示 | 约束实现范围 | 由模型执行，效果需验收 |
| 会话切档 | 调整当前工程指令 | 原系统段保持基线 |
| Skill 开关 | 控制目录候选 | 需宿主技能服务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH、Skills 和提示服务 | 必需 | 注册目录与系统段 | 继续项目规则 |
| 具名会话和可写状态 | 跨轮切档需要 | 保存基线与有效模式 | 逐轮核对实际请求 |
| 模型 usage | 缓存验证需要 | 观察实际命中 | 保留未知 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者使用隔离 profile | 记录默认与提示 |
| 对照 | 同一任务切档并检查输出 | 修改范围和测试符合要求 |
| 退出 | 默认关闭不符或结果退化时停用 | 回项目提示 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主与模型资源未知 | 配置模式和命令 | 兼容未验 |
| 持续 | 附加提示及缓存未知 | 核对输出与规则 | 无净 token 记录 |
| 失败恢复 | 重试未知 | 查看提示与持久状态 | 关闭需真实读回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 规则接入 | 系统提示段和技能注册 | 实际代码收益 |
| 模式切换 | 基线和当轮消息分开 | 供应商缓存与模型服从 |

> **思考**：[Q02](#research-q02) 默认 off 的新具名会话可回退 full，[Q03](#research-q03) 本地基线锁定不足以证明供应商缓存。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将上游工程规则适配成 DSH 提示段、Skill 目录与会话模式。

基线与当前模式分离可借鉴，明确 off 在新会话初始化中仍被空值回退覆盖。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 默认 off 的新具名会话可回退 full，[Q03](#research-q03) 本地基线锁定不足以证明供应商缓存。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用隔离小修复观察真实提示，发现默认关闭反例就停用并回原有规则。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码及构建入口已核查基线、关闭与提醒。未运行真实宿主或缓存指标。

- 已检查：作者 README、包清单、源码路径 src/ponytail.ts、lib/ponytail.js、lib/ponytail-state.js、lib/ponytail-instructions.js、src/ponytail-instructions.ts、src/ponytail-commands.ts、src/ponytail-state.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定包构建、模式、提示与 Skill 接线。未执行目标插件、宿主、模型或缓存测试。
- 下一步：比较默认 off、运行中 off、重启和模板变动下的实际请求、usage 与代码验收。

**分析版本**

- **仓库**：[Wenaixi/dsh-ponytail](https://github.com/Wenaixi/dsh-ponytail)
- **版本号**：5.6.2（[固定提交 7223820](https://github.com/Wenaixi/dsh-ponytail/tree/7223820c9d7f78f4be1ada285fbf953d7867518c)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 分开保存明确关闭与未初始化，并记录真实前缀，可能让切档可查。

比较默认 off、运行中 off、重启和模板变动下的实际请求、usage 与代码验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 28 | 1999 | — | — | 27447 |
| .js | source | 10 | 2820 | 2198 | 593 | — |
| .mjs | test | 2 | 2514 | 2014 | 242 | — |
| .mjs | source | 5 | 1081 | 850 | 159 | — |
| .ts | source | 9 | 2709 | 1883 | 592 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-11），可前往 [GitHub Issues](https://github.com/Wenaixi/dsh-ponytail/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：希望约束 DSH 代理过度实现的人能否用 Ponytail 在已有会话切档，并核对默认关闭和模型缓存承诺？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件把哪些工程规则接进代理，和手写提示有什么区别？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

经常让 DSH 代理维护代码、希望小任务优先复用现有函数的开发者，可以用一个明确修复来比较改动范围和测试结果。手写项目规则也能要求少加抽象，插件在系统提示中插入上游 Ponytail 梯子，并通过 provider 向宿主提供可按设置启用和切换语言的 Skill。原贡献归上游；DSH 适配额外组织了宿主提示、目录和会话模式接线。它改变模型收到的约束，不检查最终改动是否通过测试。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-22](https://github.com/Wenaixi/dsh-ponytail/blob/7223820c9d7f78f4be1ada285fbf953d7867518c/README.md#L16-L22)

作者说明上游来源、梯子与缓存主张。

```text
A DeepSeek Harness (DSH) port of [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail), maintained independently (ADR-0010). Injects the 7-rung ladder directly into system prompts, provides 6 specialized skills, and registers zero tools.

## What it is

A counter-weight to LLM boilerplate and over-engineering: deletion over addition, boring over clever, and fewest files possible. Challenge requirements before writing code (YAGNI), prioritize existing functions and standard libraries, and solve in one line when possible.

Features a **Zero Cache Miss Architecture** (ADR-0012): session baseline is locked permanently, and dynamic intensity switches take effect via turn-end reminders, leaving historical prompt / KV cache 100% untouched across long conversations. Ships as a pure `dsh.bundle`, writes zero garbage to your home root, uninstalls cleanly, and rebuilds itself through HMR.
```

**依据 2 · 源码核查**：[src/ponytail.ts:260-275](https://github.com/Wenaixi/dsh-ponytail/blob/7223820c9d7f78f4be1ada285fbf953d7867518c/src/ponytail.ts#L260-L275)

实际 provider 注册及启用和语言闭包。

<details>
<summary>查看原文（16行）</summary>

```text
  // SkillProvider 注册：深模块构造函数接收已解析的 providerName 与 skillDir（优先级归 entry）
  const skills = (ctx as unknown as { skills: { registerProvider: (factory: (control: SkillProviderControl) => SkillProvider) => () => void } }).skills
  skills.registerProvider((control) => {
    providerInstance = new PonytailProvider(ctx, control, {
      providerName: resolved.providerName ?? 'ponytail',
      skillDir,
      // 物理隐藏接线（评审 Important #1 修复）：UI 禁用技能 → state 内存集 → provider.list/get
      // 同步过滤。此前从未传入，UI 改开关对模型侧目录无效（静默失效，跨会话仍放行）。
      // 失效闭环：POST 变更点直调 invalidateSkills() → providerInstance.invalidate() → 宿主重扫。
      isSkillEnabled: (name) => state.isSkillEnabled(name),
      // 描述语言每次现读：显式值原样；未配置跟随宿主 locale.preference（effectiveSkillLang）。
      // 闭包化读取让下一次 list/get 立刻拿到新语言（配合下方监听里的 invalidate 生效）。
      getDescriptionLang: () => effectiveSkillLang(),
    })
    return providerInstance
  })
```

</details>

**依据 3 · 源码核查**：[src/ponytail.ts:367-400](https://github.com/Wenaixi/dsh-ponytail/blob/7223820c9d7f78f4be1ada285fbf953d7867518c/src/ponytail.ts#L367-L400)

系统段与模型请求前事件接线。

<details>
<summary>查看原文（34行）</summary>

```text
  // Always-on 注入：systemPrompt section（order: 50 位于 persona 与工具之间）
  // 经高阶出口 renderPromptSection 统一处理会话基线锁定（ADR-0012）与无状态直读（ADR-0003）
  const systemPrompt = (ctx as unknown as { systemPrompt: { section: (section: { name: string; order: number; text: string | ((context?: unknown) => string) }) => () => void } }).systemPrompt
  systemPrompt.section({
    name: 'ponytail',
    order: 50,
    text: (context?: unknown) => renderPromptSection(skillDir, state, context),
  })

  // 轮次协作者深模块：完整封装指令路由、waterfall 穿透、变动对比、原地通知替换与发射标记
  const coordinator = createTurnCoordinator({
    state,
    skillDir,
    logger: ctx.logger,
    getDefaultMode: () =>
      resolvePriority({
        envRaw,
        patchMode: readPatchMode(),
      }).effective,
    sink: configSink,
    updateDefaultMode: (mode) => {
      patchOverride = mode
    },
    writeDefaultMode: (mode) => configSink.writeDefaultMode(mode),
  })

  // 监听 agent/pre-step waterfall（模型请求前拦截）与 session/event（直接投递消息兜底）
  anyCtx.on('agent/pre-step', (...args: unknown[]) => {
    const [payload, next] = args as [unknown, () => Promise<unknown>]
    return coordinator.handlePreStep(payload, next)
  })
  anyCtx.on('session/event', (...args: unknown[]) => {
    const [session, event] = args
    coordinator.handleSessionEvent(session, event)
```

</details>

#### 缺口

- 未用同模型对照实际代码质量。
  **影响**：不能推断文件数、代码量和缺陷改善。
  **进一步探讨**：比较同一小修复在项目规则、lite 和 full 的实际 diff 与验收。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模式关闭和会话基线具体如何相互作用？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

运行入口把有效默认 off 转成 null。首次具名会话若没有持久旧状态，getSession 用 current ?? full 初始化 baseline、effective 和 lastEmitted，三个均变 full。具名提示从 baseline 取段，无名路径才用全局 null 直接返回空。这形成一条可检查的反例：在默认 off 且没有历史状态的新具名会话，仍可能渲染 full，而状态三者相同也没有转换通知。对已经 active 的会话，关闭操作修改 effective，原 baseline 不重写，下一次可用模型请求通过提醒要求回普通模式。应检查实际装配提示和发送消息，而不能只看设置。

#### 证据与依据

**依据 1 · 源码核查**：[lib/ponytail.js:203-210](https://github.com/Wenaixi/dsh-ponytail/blob/7223820c9d7f78f4be1ada285fbf953d7867518c/lib/ponytail.js#L203-L210)

实际包把 off 初始化为 null。

```text
    }).effective;
    const skillDir = resolveDefaultSkillDir(resolved.skillDir);
    // 等级状态唯一归属：get()/set()/syncFromFile() 三方法，闭包态随 HMR 重建
    const state = createPonytailState({ sink: configSink, storage: createDiskStorage(profileDir), profileDir });
    // 会话启动对齐（对齐上游 ponytail-activate.js SessionStart 语义）：
    // 每次会话启动都按 resolvePriority()（env > patch > full）重写 flag，
    // 因此 /ponytail <档> 只在本会话生效，跨会话持久化必须用 /ponytail default <档>。
    state.set(initialMode === 'off' ? null : initialMode);
```

**依据 2 · 源码核查**：[lib/ponytail-state.js:267-285](https://github.com/Wenaixi/dsh-ponytail/blob/7223820c9d7f78f4be1ada285fbf953d7867518c/lib/ponytail-state.js#L267-L285)

新会话 null 回退 full，切档只变 effective。

<details>
<summary>查看原文（19行）</summary>

```text
            // 全新会话诞生：基线锁定为当前全局模式（或 full）
            const baseline = current ?? 'full';
            state = {
                sessionId: key,
                baselineMode: baseline,
                effectiveMode: baseline,
                lastEmittedMode: baseline,
                explicitlySet: false,
            };
            sessions.set(key, state);
            savePersistedSessions(sessions);
            return state;
        },
        setSessionMode(sessionId, mode) {
            const key = normalizeSessionKey(sessionId);
            const session = this.getSession(key);
            const normalized = mode === 'off' ? null : normalizeMode(mode ?? '') ?? mode;
            session.effectiveMode = normalized;
            session.explicitlySet = true; // 用户在该会话内显式输入过命令，标记保护
```

</details>

**依据 3 · 源码核查**：[lib/ponytail-instructions.js:97-111](https://github.com/Wenaixi/dsh-ponytail/blob/7223820c9d7f78f4be1ada285fbf953d7867518c/lib/ponytail-instructions.js#L97-L111)

具名提示和无名全局走不同判断。

<details>
<summary>查看原文（15行）</summary>

```text
    // 提取会话目标（单一真源接缝，消除跨模块重复探针）
    const sessionId = resolveSessionId(context);
    if (sessionId && typeof state.getSession === 'function') {
        // 具名会话：锁定初始基线 baselineMode，绝不随切档变动，100% 保护会话前缀缓存（ADR-0012）
        const sessionState = state.getSession(sessionId);
        const baseMode = sessionState.baselineMode;
        if (!baseMode || baseMode === 'off')
            return '';
        return render(skillDir, baseMode);
    }
    // 无会话目标时（单会话全局模式 / 单元测试裸调 / 外部直接读取）：走全局单例出口
    const mode = state.get();
    if (!mode || mode === 'off')
        return '';
    return render(skillDir, mode);
```

</details>

**依据 4 · 源码核查**：[src/ponytail-instructions.ts:130-143](https://github.com/Wenaixi/dsh-ponytail/blob/7223820c9d7f78f4be1ada285fbf953d7867518c/src/ponytail-instructions.ts#L130-L143)

关闭通过后置提醒表达。

<details>
<summary>查看原文（14行）</summary>

```text
export function renderModeUpdate(
  newMode: string | null,
  previousMode: string | null = null,
  skillDir?: string,
): string {
  const prev = previousMode ? ` (superseding previous level: ${previousMode})` : ''

  if (!newMode || newMode === 'off') {
    return [
      '<system-reminder>',
      `Ponytail mode has been switched OFF${prev}.`,
      'Normal development mode applies for this session until explicitly reactivated. Follow standard engineering practices without ponytail ladder constraints.',
      '</system-reminder>',
    ].join('\n')
```

</details>

#### 缺口

- 未在目标宿主捕获首次具名模型请求。
  **影响**：反例为固定控制流推导，实际宿主 sessionId 传递还需复现。
  **进一步探讨**：用默认 off 的新 profile 对照具名和无名请求，查看前缀和通知。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 前缀与缓存、维护成本之间能推断什么？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

切档协调器先解析用户文本，继续下游 pre-step，只有进入模型调用时才消费转换并添加或替换模式消息。它不重写插件自身的基线模式，但段内容由 render 重新读 Skill 文件，模板改变也可能改变实际字节。供应商缓存受完整请求前缀、模型和有效期影响，README 的零缓存破坏不能由当前模式代码单独证明。退出提醒也仍是提示词要求。使用者需要付出插件初始化和模式配置、额外提示 token、输出复核和冲突排查。持久会话写失败被吞掉，重启后还需确认是否恢复原模式，当前没有真实缓存账单。

#### 证据与依据

**依据 1 · 源码核查**：[src/ponytail-commands.ts:256-278](https://github.com/Wenaixi/dsh-ponytail/blob/7223820c9d7f78f4be1ada285fbf953d7867518c/src/ponytail-commands.ts#L256-L278)

命令处理、透传和进入模型时消费状态。

<details>
<summary>查看原文（23行）</summary>

```text
  async function handlePreStep(payload: unknown, next: () => Promise<unknown>): Promise<unknown> {
    const raw = payload as { messages?: unknown } | undefined
    const sessionId = resolveSessionId(payload)

    // 1. 尝试解析并分发指令
    try {
      if (raw?.messages) {
        dispatcher.dispatchMessages(raw.messages, sessionId)
      }
    } catch (err: unknown) {
      env.logger.warn?.(`[ponytail] agent/pre-step 处理失败（仍会调用 next()，不拦截请求）：${String(err)}`)
    }

    // 2. 必须且只能穿透下游 waterfall（断链守卫）
    const downstream = (await next()) as { kind: string; messages: unknown[] } | unknown
    if (!downstream || typeof downstream !== 'object' || (downstream as { kind?: string }).kind !== 'enter') {
      return downstream
    }

    const decision = downstream as { kind: string; messages: unknown[] }

    // 3. 变动检测与原子发射标记（深模块原子事务接缝，消除两步时序外泄）
    const transition = env.state.consumeSessionTransition(sessionId)
```

</details>

**依据 2 · 源码核查**：[src/ponytail-commands.ts:285-311](https://github.com/Wenaixi/dsh-ponytail/blob/7223820c9d7f78f4be1ada285fbf953d7867518c/src/ponytail-commands.ts#L285-L311)

添加或替换模式提醒，不改插件基线。

<details>
<summary>查看原文（27行）</summary>

```text
      const updateMsg = {
        id: randomUUID(),
        role: 'user',
        content: [{ type: 'text', text: noticeText }],
        source: {
          kind: 'ponytail-mode-update',
          mode: transition.effectiveMode,
          previousMode: transition.previousMode,
        },
      }

      // 4. 原地替换或追加（严守单通知幂等不变量，对齐 dsh-tool-skill）
      const msgs = Array.isArray(decision.messages) ? [...decision.messages] : []
      const existingIdx = msgs.findIndex(
        (m: unknown) =>
          Boolean(m && typeof m === 'object' && (m as { source?: { kind?: string } }).source?.kind === 'ponytail-mode-update'),
      )
      if (existingIdx !== -1) {
        msgs[existingIdx] = updateMsg
      } else {
        msgs.push(updateMsg)
      }

      return {
        ...decision,
        messages: msgs,
      }
```

</details>

**依据 3 · 源码核查**：[src/ponytail-instructions.ts:79-87](https://github.com/Wenaixi/dsh-ponytail/blob/7223820c9d7f78f4be1ada285fbf953d7867518c/src/ponytail-instructions.ts#L79-L87)

每次渲染从当前 Skill 文件取文本。

```text
export function render(skillDir: string, mode: string): string {
  if (INDEPENDENT_MODES.has(mode)) {
    return 'PONYTAIL active - level: ' + mode + '. Behavior is defined by the /ponytail-' + mode + ' skill.'
  }
  try {
    const raw = readFileSync(getMainSkillPath(skillDir), 'utf8')
    return 'PONYTAIL active - level: ' + mode + '\n\n' + filterSkillBodyForMode(raw, mode)
  } catch {
    return getFallbackInstructions(mode)
```

**依据 4 · 源码核查**：[src/ponytail-state.ts:223-234](https://github.com/Wenaixi/dsh-ponytail/blob/7223820c9d7f78f4be1ada285fbf953d7867518c/src/ponytail-state.ts#L223-L234)

会话持久化失败仅影响外部可见性。

<details>
<summary>查看原文（12行）</summary>

```text
  function savePersistedSessions(map: Map<string, SessionModeState>): void {
    try {
      const obj: Record<string, SessionModeState> = {}
      for (const [k, v] of map.entries()) {
        if (k !== DEFAULT_SESSION_ID) obj[k] = v
      }
      if (typeof storage.writeSessions === 'function') {
        storage.writeSessions(obj)
      }
    } catch {
      // best-effort：存储写失败不阻断内存与会话
    }
```

</details>

#### 缺口

- 未取得供应商缓存命中、持久重启或提示冲突日志。
  **影响**：无法确认命中率、净 token 和关闭效果。
  **进一步探讨**：同时比较实际请求字节、供应商 usage 和模型输出验收。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何限定采用，怎样验证低负担切档？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前适合在隔离 DSH profile 观察一个已有明确验收的小修复。先确认新会话的默认关闭和当轮切档在真实请求中的表现，再比较是否保留测试、边界和清晰结构。发现默认关闭仍注入、实际回复依旧按旧模式或修复遗漏关键条件时，停用插件并回项目原有提示。待验证设计是将未初始化状态和明确 off 分开存储，并给新会话保存实际前缀摘要与当轮模式。对照默认 off、历史 active 切 off、重启和模板变动，测意外注入、提示字节、usage 与任务通过率。即使本段稳定，仍需供应商返回才能确认缓存。

#### 证据与依据

**依据 1 · 源码核查**：[lib/ponytail-state.js:267-285](https://github.com/Wenaixi/dsh-ponytail/blob/7223820c9d7f78f4be1ada285fbf953d7867518c/lib/ponytail-state.js#L267-L285)

默认回退和 effective 更新提供可复现的对照。

<details>
<summary>查看原文（19行）</summary>

```text
            // 全新会话诞生：基线锁定为当前全局模式（或 full）
            const baseline = current ?? 'full';
            state = {
                sessionId: key,
                baselineMode: baseline,
                effectiveMode: baseline,
                lastEmittedMode: baseline,
                explicitlySet: false,
            };
            sessions.set(key, state);
            savePersistedSessions(sessions);
            return state;
        },
        setSessionMode(sessionId, mode) {
            const key = normalizeSessionKey(sessionId);
            const session = this.getSession(key);
            const normalized = mode === 'off' ? null : normalizeMode(mode ?? '') ?? mode;
            session.effectiveMode = normalized;
            session.explicitlySet = true; // 用户在该会话内显式输入过命令，标记保护
```

</details>

**依据 2 · 源码核查**：[src/ponytail-commands.ts:285-311](https://github.com/Wenaixi/dsh-ponytail/blob/7223820c9d7f78f4be1ada285fbf953d7867518c/src/ponytail-commands.ts#L285-L311)

现有切档提醒作为基准。

<details>
<summary>查看原文（27行）</summary>

```text
      const updateMsg = {
        id: randomUUID(),
        role: 'user',
        content: [{ type: 'text', text: noticeText }],
        source: {
          kind: 'ponytail-mode-update',
          mode: transition.effectiveMode,
          previousMode: transition.previousMode,
        },
      }

      // 4. 原地替换或追加（严守单通知幂等不变量，对齐 dsh-tool-skill）
      const msgs = Array.isArray(decision.messages) ? [...decision.messages] : []
      const existingIdx = msgs.findIndex(
        (m: unknown) =>
          Boolean(m && typeof m === 'object' && (m as { source?: { kind?: string } }).source?.kind === 'ponytail-mode-update'),
      )
      if (existingIdx !== -1) {
        msgs[existingIdx] = updateMsg
      } else {
        msgs.push(updateMsg)
      }

      return {
        ...decision,
        messages: msgs,
      }
```

</details>

#### 缺口

- 状态和前缀摘要设计未实现。
  **影响**：还不能确定能否同时减少误注入与重复说明。
  **进一步探讨**：同一宿主和模型记录四种状态迁移的实际请求。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
