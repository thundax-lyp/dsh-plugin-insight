# DSH-Think-zh

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[2ba0a1e](https://github.com/Len7183/DSH-Think-zh/tree/2ba0a1e338410b44c07f221087907e210ad65b59)

<!-- BEGIN META -->
[![GitHub ★ 49](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=49&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Len7183/DSH-Think-zh)
<!-- END META -->

> **功能**：通过可切换语言提示影响模型 reasoning 与回复语言，支持静态及可选每轮注入。

> **亮点**：把语言提示接成profile可切换设置与两条投递通道，继承Host提示/模型机制。见 [Q03](#research-q03)。

> **主要限制**：默认en不强制英文；custom覆盖档位，image-first每轮幂等缺口；排首和强制措辞不保证模型服从。见 [Q01](#research-q01)、[Q02](#research-q02)。

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
  - [Q01 · 设置档位如何影响请求，是锁定英文或中文思考吗？](#detail-section-11)
  - [Q02 · “最高优先级”、幂等与退出是否有真实程序保证？](#detail-section-12)
  - [Q03 · 比手写语言提示多做什么，兼容和总成本如何？](#detail-section-13)
  - [Q04 · 怎样有限试用，最值得证伪哪个方向？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：中文用户想读可见reasoning，手写语言提示为直接替代。见 [Q01](#research-q01)。

原生系统/用户消息中手写语言要求，必要时按任务选择。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 静态提示 | 配置语言要求 | 模型可不服从 |
| en档 | 回复跟随提问 | 不强制英文思考 |
| zh档 | 请求中文可见reasoning | custom非空优先 |
| per-turn | 用户text加同要求 | image-first幂等缺口 |
| GUI保存 | await form/回读 | Host持久/volatile合同 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22.19 | 声明 | Host模块 | 不在声明范围 |
| schemastery模块/volatile>=3.18.3 | 模块必需/动态能力 | schema与现读 | 无模块无法import，缺方法退重挂 |
| systemPrompt | 硬依赖 | 静态section | apply等待/失败日志 |
| agent/pre-step | 每轮可选 | 用户文字前缀 | 只注册存在不证明触发 |
| DSH rc.6/0.1.2/0.1.7 | 作者分级 | 静态/每轮/GUI | 无engines.dsh保证 |
| Web slots/locale/remote/configForms/React | GUI必需 | 切档持久 | 可保留配置静态使用 |
| 可见reasoning模型 | 需求前提 | 观察语言 | 不保证内部思维可见 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 独立profile固定模型 | 纯文本非敏感题 |
| 配置 | 静态on/每轮off/zh/custom空 | await保存与回读 |
| 核请求 | 查真实system section | 不把GUI当生效证明 |
| 对照 | 看语言/答案/代码原文 | 质量下降回原生 |
| 退出 | 禁通道重挂/移插件 | 核下一请求不含指令 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 环境/模型费用未知 | profile/请求核验 | lib已有无prepare |
| 持续使用 | 每请求附加token/延迟未知 | 模型服从/升级维护 | 字符不等token |
| 失败恢复 | 重试模型费用未知 | 看日志/保存/实际请求 | 未自动检验输出 |
| 退出 | 历史已发内容留存 | 重挂/核提示移除 | section生命周期未独验 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 语言选择 | en回复条款/zh思考条款 | 模型服从/正确率 |
| 即时切档 | volatile现读 | Host保存/版本实际合同 |
| 每轮投递 | 首user首text前缀 | image-first重复 |
| 置顶 | order+assemble重排 | 最终优先级/其他插件 |
| 总收益 | 减复制的假设 | 可读性与token净收益 |

> **思考**：默认en不强制英文；custom覆盖档位，image-first每轮幂等缺口；排首和强制措辞不保证模型服从。见 [Q01](#research-q01)、[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把语言提示接成profile可切换设置与两条投递通道，继承Host提示/模型机制。见 [Q03](#research-q03)。

volatile探测/保存回读有用；幂等守卫索引须与写入一致，提示位置不等模型约束。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认en不强制英文；custom覆盖档位，image-first每轮幂等缺口；排首和强制措辞不保证模型服从。见 [Q01](#research-q01)、[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

纯文本静态先试，明确zh与custom空，核请求/质量/移除，失配回原生提示。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

配置/GUI保存/静态与per-turn及发行关键链已核；未运行目标/Host/模型。

- 已检查：作者 README、包清单、源码路径 README.md、client.js、lib/index.js、lib/preturn.js、package.json、src/config.ts、src/index.ts、src/injector.ts、src/preturn.ts、src/runtime.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核Host配置/volatile/section/assemble/pre-step、Web form写回和发行lib关键链；未审固定Host内部生命周期/全UI样式，未运行目标/模型。
- 下一步：五类决策回放及同模型语言/正确性/token对照，未执行。

**分析版本**

- **仓库**：[Len7183/DSH-Think-zh](https://github.com/Len7183/DSH-Think-zh)
- **版本号**：1.1.1（[固定提交 2ba0a1e](https://github.com/Len7183/DSH-Think-zh/tree/2ba0a1e338410b44c07f221087907e210ad65b59)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

对齐第一text索引幂等并呈现通道/文本版本，五输入对照；原生检查器足够则组合。见 [Q04](#research-q04)。

五类决策回放及同模型语言/正确性/token对照，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 237 | — | — | 3448 |
| .js | source | 8 | 678 | 479 | 182 | — |
| .ts | source | 6 | 446 | 252 | 161 | — |
| .ts | test | 7 | 870 | 810 | 10 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/Len7183/DSH-Think-zh/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：思考语言档位与实际请求投递、幂等/持久/模型服从边界如何对应？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 设置档位如何影响请求，是锁定英文或中文思考吗？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向希望读可见reasoning并保留代码/日志原文的中文DSH用户，基线是手写系统/用户语言提示。合格需实际请求含所选指令、可见输出语言按偏好、最终答案正确与原文不被错误翻译；不是证明模型内部思维语言或因中文就更可信。

默认thinkingLanguage=en但不是强制英文：只注入中文书写的“回复跟随最近实质提问”条款，思考语言交给模型；zh才加全程简体中文思考/覆盖工具前后等要求。自定义injectionText非空trim后整段覆盖档位，所以GUI切zh可能不改变真实提示。injectPrompt默认true、injectPerTurn默认false，两个开关只在apply时决定挂载，只有文本provider在每次请求resolveConfig现读volatile。

Host等systemPrompt再apply，section order=-1000000，text是函数；assemble处理器await next后找该section并非原地移到首位。per-turn可独立启用，在agent/pre-step await next得到enter决策，若非aborted，找第一条user来源（无source时role=user）的消息，复制messages/content，在其中第一个text块前加标记与同一指令。它不新增工具或模型服务，不拦截/翻译返回reasoning，也不校验模型服从。

Web configForms.get(dsh-think-zh)提供实际form，General设置行根据snapshot.writable禁用，await form.set后非true会回读快照判断失败并显示错误。持久化委托Host configForms，README称写profile cordis.patch.yml；本插件没有直接文件写入。下一请求可读新volatile不等正在生成的一轮被重写。

#### 证据与依据

**依据 1 · 源码核查**：[src/config.ts:12-39](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/src/config.ts#L12-L39)

en实际不约束思考、zh文本。

<details>
<summary>查看原文（28行）</summary>

```text
/** 思考语言可选档位；顺序即设置页下拉顺序（默认档在前）。 */
export const THINKING_LANGUAGES = ['en', 'zh'] as const
export type ThinkingLanguage = (typeof THINKING_LANGUAGES)[number]
/** 默认档（1.1.0 起）：默认英文——只注入回复跟随条款，思考语言交还模型。 */
export const DEFAULT_THINKING_LANGUAGE: ThinkingLanguage = 'en'

const HEADER = '语言要求（强制，最高优先级）：'
/** 默认英文档只约束回复：跟随最近一条实质提问，工具输出与引用不改变回复语言。 */
const EN_INJECTION_TEXT = `${HEADER}
1. 回复使用与用户提问相同的语言，并跟随其最近一条实质提问；无法判断时默认简体中文。代码、标识符、文件路径、命令与报错原文保持原样，不翻译；工具输出与引用不改变回复语言。`
/**
 * 简体中文档文本（1.1.1 全中文版）：三条中文强制条款（思考语言 + 覆盖范围 + 回复语言）。
 *
 * 2026-10-18 实测（deepseek-flash / reasoningEffort max / 英文提问 / 实际工作区）：
 * 全英文版中文思考 2/10，「英文强制段 + 中文重申」混合版 7/10，本全中文版效果见提交记录。
 * 对静态 section 服从弱的模型仍应叠加 injectPerTurn。
 */
const ZH_INJECTION_TEXT = `${HEADER}
1. 思考（reasoning）必须全程使用简体中文，从第一个字起就是中文，不得出现英文推理，禁止先英文思考再翻译。
2. 分析、计划、工具调用前后的推理、错误排查与自我检查，全部使用简体中文；提问、代码、日志、文件名或工具结果为英文时也不例外。
3. 回复使用与用户提问相同的语言；无法判断时默认简体中文。代码、标识符、文件路径、命令与报错原文保持原样，不翻译。`

/**
 * 按档位生成强制指令：`zh` 为三条中文思考强制，`en` 只保留回复条款（同样中文表述）。
 * @param language - 归一化后的档位。
 */
export function injectionTextFor(language: ThinkingLanguage): string {
  return language === 'en' ? EN_INJECTION_TEXT : ZH_INJECTION_TEXT
```

</details>

**依据 2 · 源码核查**：[src/config.ts:57-89](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/src/config.ts#L57-L89)

真实默认与volatile能力探测。

<details>
<summary>查看原文（33行）</summary>

```text
export const DEFAULT_CONFIG: ResolvedConfig = {
  injectPrompt: true,
  injectionText: DEFAULT_INJECTION_TEXT,
  injectPerTurn: false,
  thinkingLanguage: DEFAULT_THINKING_LANGUAGE,
}

/**
 * schemastery 的 `.volatile()` 是 ≥3.18.3 的能力；宿主内置更旧版本时模块加载期直接
 * 调用会在 import 期抛 TypeError、插件整体加载失败（与「静态注入兼容 0.1.0-rc.6」的
 * 承诺冲突）。加载期做特性探测，不支持时字段退化为普通值——仅失去「设置页改完即时
 * 切换」，静态注入不受影响。
 */
export const VOLATILE_SUPPORTED = typeof (z.string() as { volatile?: unknown }).volatile === 'function'

/**
 * 对 schema 字段应用 `.volatile()`（宿主支持时）；不支持时原样返回普通字段。
 * @param field - 待修饰的 schema 字段。
 */
export function applyVolatile<T>(field: T): T {
  if (typeof (field as { volatile?: unknown } | undefined)?.volatile === 'function') {
    return (field as unknown as { volatile: () => T }).volatile()
  }
  return field
}

/** 宿主 Loader 解析 profile patch 中本条目 config 所用的 schema。 */
export const Config = z.object({
  injectPrompt: z.boolean().default(DEFAULT_CONFIG.injectPrompt),
  injectionText: z.string().default(''),
  injectPerTurn: z.boolean().default(DEFAULT_CONFIG.injectPerTurn),
  thinkingLanguage: applyVolatile(z.string().default(DEFAULT_THINKING_LANGUAGE)),
})
```

</details>

**依据 3 · 源码核查**：[src/config.ts:110-126](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/src/config.ts#L110-L126)

现读配置/自定义覆盖。

<details>
<summary>查看原文（17行）</summary>

```text
 * 此时按 `thinkingLanguage` 生成文本。
 *
 * 输入统一先解 volatile 引用：宿主 schema 解析后，volatile 字段（连带其默认值）
 * 一律是 `{ get() }` 引用，直接当值用会静默回退默认档。
 */
export function resolveConfig(input?: RawConfigInput): ResolvedConfig {
  const resolved: ResolvedConfig = {
    injectPrompt: toBoolean(readVolatile(input?.injectPrompt), DEFAULT_CONFIG.injectPrompt),
    injectionText: '',
    injectPerTurn: toBoolean(readVolatile(input?.injectPerTurn), DEFAULT_CONFIG.injectPerTurn),
    thinkingLanguage: normalizeThinkingLanguage(readVolatile(input?.thinkingLanguage)),
  }
  const rawText = readVolatile(input?.injectionText)
  const custom = typeof rawText === 'string' ? rawText.trim() : ''
  resolved.injectionText = custom.length > 0 ? custom : injectionTextFor(resolved.thinkingLanguage)
  return resolved
}
```

</details>

**依据 4 · 源码核查**：[src/index.ts:24-45](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/src/index.ts#L24-L45)

挂载开关一次判断/文本现读。

<details>
<summary>查看原文（22行）</summary>

```text
export const inject: readonly string[] = ['systemPrompt']

/** 插件入口：按配置挂载注入器（静态 section + 可选 per-turn 用户消息注入）。 */
export function apply(ctx: MinimalContext, config?: RawConfigInput): void {
  if (!VOLATILE_SUPPORTED) {
    ctx.logger.warn?.(
      'dsh-think-zh: 宿主 schemastery < 3.18.3，thinkingLanguage 为普通字段，「思考语言」设置改完只随插件重挂生效（静态注入不受影响）',
    )
  }
  warnInvalidThinkingLanguage(ctx, config)
  // 开关只判一次；注入文本在提供者内现读 resolveConfig——thinkingLanguage 是 volatile
  // 字段，设置页改完的下一份请求即生效（两次调用是设计使然而非重复计算）。
  const resolved = resolveConfig(config)
  // 每次现读：thinkingLanguage 是 volatile 字段，设置页改完的下一份请求即生效。
  const currentText = (): string => resolveConfig(config).injectionText
  // 两个通道相互独立：静态注入关掉时，per-turn 仍可单独承担指令投递。
  if (resolved.injectPrompt) {
    registerLanguageInjection(ctx, currentText)
  }
  if (resolved.injectPerTurn) {
    registerPerTurnNudge(ctx, currentText)
  }
```

</details>

**依据 5 · 源码核查**：[src/injector.ts:32-45](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/src/injector.ts#L32-L45)

section实际注册。

<details>
<summary>查看原文（14行）</summary>

```text
export function registerLanguageInjection(ctx: MinimalContext, text: () => string): () => void {
  if (typeof ctx.systemPrompt?.section !== 'function') {
    ctx.logger.error(
      `dsh-think-zh: systemPrompt 服务不可用，语言指令未注入。请确认插件声明了 inject: ["systemPrompt"] 且宿主已注册该服务。`,
    )
    return () => {}
  }
  try {
    const disposer = ctx.systemPrompt.section({ ...SECTION_SPEC, text })
    registerAssemblyHoist(ctx)
    return disposer
  } catch (error: unknown) {
    ctx.logger.error(`dsh-think-zh: 注册 system prompt section（${PROMPT_SECTION_NAME}）失败: ${String(error)}`)
    return () => {}
```

</details>

**依据 6 · 源码核查**：[src/injector.ts:58-79](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/src/injector.ts#L58-L79)

assemble重排。

<details>
<summary>查看原文（22行）</summary>

```text
function registerAssemblyHoist(ctx: MinimalContext): void {
  if (typeof ctx.on !== 'function') return
  try {
    ctx.on('system-prompt/assemble', async (assembly, _context, next): Promise<AssembledPromptLike> => {
      const assembled = await next()
      const sections = assembled?.sections
      if (!Array.isArray(sections)) return assembled
      const index = sections.findIndex((section) => section?.name === PROMPT_SECTION_NAME)
      // 已在首位（幂等）或被其他插件抑制时不动宿主决策。
      if (index <= 0) return assembled
      const ours = sections[index]
      if (!ours) return assembled
      // 非原地重排：拷贝重建，兼容冻结数组与共享引用（与 preturn 的拷贝姿态一致）。
      return {
        ...assembled,
        sections: [ours, ...sections.slice(0, index), ...sections.slice(index + 1)],
      }
    })
  } catch (error: unknown) {
    ctx.logger.error(`dsh-think-zh: 注册 system-prompt/assemble 置顶兜底失败: ${String(error)}`)
  }
}
```

</details>

**依据 7 · 源码核查**：[src/preturn.ts:28-76](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/src/preturn.ts#L28-L76)

实际pre-step复制注入。

<details>
<summary>查看原文（49行）</summary>

```text
export function registerPerTurnNudge(ctx: MinimalContext, text: () => string): void {
  if (typeof ctx.on !== 'function') {
    ctx.logger.error('dsh-think-zh: agent/pre-step 瀑布不可用，per-turn 语言指令未注册。宿主可能不提供该瀑布。')
    return
  }
  try {
    ctx.on('agent/pre-step', async (payload, next): Promise<PreStepDecisionLike> => {
      // 瀑布契约要求处理器调用 next() 传递决策，不得短路；aborted 只跳过指令改写，
      // 链路行为（含中止语义）交由宿主自查。
      const decision = await next()
      if (!decision || decision.kind !== 'enter' || !Array.isArray(decision.messages) || decision.messages.length === 0) {
        return decision
      }
      if (payload?.signal?.aborted) {
        return decision
      }
      // 宿主消息缺省 source 字段时按 role 回退判定（类型声明两者均可选）。
      const index = decision.messages.findIndex(
        (msg) => !!msg && (msg.source ? msg.source.kind === 'user' : msg.role === 'user'),
      )
      if (index === -1) {
        return decision
      }
      const msg = decision.messages[index]
      if (!msg || !Array.isArray(msg.content)) {
        return decision
      }
      const isText = (block: { type?: string; text?: string } | undefined): block is { type: 'text'; text: string } =>
        !!block && block.type === 'text' && typeof block.text === 'string'
      // 幂等判定收窄为首文本块前缀：现行实现只在首个文本块打标；全文子串匹配会把
      // 用户正文恰好出现标记字样（如粘贴本插件 README）的消息误判为已注入而跳过注入。
      const firstBlock = msg.content[0]
      if (isText(firstBlock) && firstBlock.text.startsWith(`[${PRETURN_MARK}] `)) {
        return decision
      }
      const blockIndex = msg.content.findIndex(isText)
      if (blockIndex === -1) {
        return decision
      }
      const messages = decision.messages.slice()
      messages[index] = {
        ...msg,
        content: msg.content.map((block, i) => {
          if (i !== blockIndex || !isText(block)) return block
          return { ...block, text: `[${PRETURN_MARK}] ${text()}\n\n${block.text}` }
        }),
      }
      return { ...decision, messages }
    }, { prepend: true })
```

</details>

**依据 8 · 源码核查**：[client.js:216-230](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/client.js#L216-L230)

设置结果等待/回读。

<details>
<summary>查看原文（15行）</summary>

```text
      /** 提交选择：写 volatile 字段；返回值非 true 时回读快照确认，确实未落盘才提示重试。 */
      const select = async (id) => {
        triggerRef.current?.focus()
        setOpen(false)
        if (id === activeId || disabled) return
        setPending(true)
        setFailed(false)
        try {
          const accepted = await form.set(FIELD, id)
          if (accepted !== true && pickId(form.getSnapshot()) !== id) setFailed(true)
        } catch {
          setFailed(true)
        } finally {
          setPending(false)
        }
```

</details>

**依据 9 · 源码核查**：[client.js:301-324](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/client.js#L301-L324)

form/设置行与清理接线。

<details>
<summary>查看原文（24行）</summary>

```text
    return {
      inject: ['slots', 'locale', 'remote', 'configForms'],
      /**
       * 注册设置行与字典。
       * @param ctx - client cordis 上下文。
       */
      apply(ctx) {
        ctx.effect(() => {
          ensureStyles()
          return () => {
            if (typeof document === 'undefined') return
            document.querySelector('style[data-plugin-css="' + STYLE_ID + '"]')?.remove()
          }
        }, 'dsh-think-zh: settings row styles')
        const form = ctx.configForms.get(NAMESPACE)
        ctx.effect(() => ctx.locale.register(LOCALE_NS, DICT), 'dsh-think-zh: dictionary')
        /** 组件身份在 apply 期固定（form 经闭包注入，避免每次渲染重挂）。 */
        const Row = (props) => h(ThinkingLanguageRow, { ...props, form })
        ctx.slots.inject('settings.general.item', () =>
          ctx.slots.register(
            { name: 'settings.general.item', id: 'thinking-language', order: 5, locale: LOCALE_NS },
            Row,
          ),
        )
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · “最高优先级”、幂等与退出是否有真实程序保证？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

语言要求只是提示文字，“强制/最高优先级”不能替代模型提供者或宿主规则，也不能把排第一当模型必定服从。其他插件仍可能抑制/改写section或在瀑布上层继续重排；本组件找不到section会原样返回。作者README明确不能100%锁死，源码注释有特定模型语言测试计数但没有本次可复现输入输出原件，不据此推断当前模型通用成功率。

per-turn幂等有多模态反例：守卫只检查msg.content[0]是否text且带前缀，实际写入却findIndex第一个text。若content[0]是image而content[1]是text，每次处理复制后的决策都会再次给同一text加前缀；纯文本首块已经标记时才幂等。用户自己以标记开头则可跳过，标记不是信任边界；没有文字的user消息不向后顺延。src与发行lib/preturn.js同样逻辑，README“首文本块幂等”不能无条件采信。

apply无按session/preset/provider的过滤，提示作用于Host实际传播到此上下文的请求，不是单会话开关或多用户偏好。没有独立HTTP授权面；设置写权限和跨窗口冲突归Host snapshot/form合同。volatile读取异常回默认en，未知档位也回en（即不管思考），可以静默失去中文要求；旧schemastery缺volatile会警告并退普通字段，更新需重挂。

section注册或pre-step注册失败只记error并跳过，UI没有逐请求注入成功回执。仅检查ctx.on存在不能证明Host实际支持/触发某event；不存在的事件可注册但从不投递，不能保证一定报错。卸载Client样式有effect清除，事件/slot依赖Cordis生命周期；Host apply忽略registerLanguageInjection返回disposer，section是否由Host自动绑定上下文未独立核，不能据函数返回就宣称卸载全部提示已移除。已发送请求/历史不回滚，关闭两个通道需按配置重挂后看实际请求。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:8-20](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/README.md#L8-L20)

作者锁定宣称与明确限制。

<details>
<summary>查看原文（13行）</summary>

```text
DeepSeek Harness（DSH）插件：**把模型的思考（reasoning）语言锁定为所选档位**（简体中文 / 默认英文），档位在
**设置 → 通用设置 →「思考语言」**里随时切换；回复语言跟随提问语言。

## 项目解决什么问题

DeepSeek Harness 默认的思考语言常常为英文，这不利于中文使用者阅读推理过程、复核结论。
本插件在每次请求的 system prompt 中注入一条精简的强制语言指令，使：

- **思考语言可控**：两档可选——「简体中文」强制思考用简体中文，「默认英文」只约束回复、把思考语言交还模型；
- **回复跟随提问语言**：中文提问用中文答，英文提问用英文答，判断不出语言倾向时默认简体中文；
- **代码、标识符、文件路径、命令等保持原文**，不翻译。

> **限制声明**：思考语言本质是模型自身行为，插件只能通过「注入强制指令」影响，无法在程序上 100% 锁死；模型是否遵守超出插件控制范围。
```

</details>

**依据 2 · 源码核查**：[src/injector.ts:58-79](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/src/injector.ts#L58-L79)

仅重排现有section。

<details>
<summary>查看原文（22行）</summary>

```text
function registerAssemblyHoist(ctx: MinimalContext): void {
  if (typeof ctx.on !== 'function') return
  try {
    ctx.on('system-prompt/assemble', async (assembly, _context, next): Promise<AssembledPromptLike> => {
      const assembled = await next()
      const sections = assembled?.sections
      if (!Array.isArray(sections)) return assembled
      const index = sections.findIndex((section) => section?.name === PROMPT_SECTION_NAME)
      // 已在首位（幂等）或被其他插件抑制时不动宿主决策。
      if (index <= 0) return assembled
      const ours = sections[index]
      if (!ours) return assembled
      // 非原地重排：拷贝重建，兼容冻结数组与共享引用（与 preturn 的拷贝姿态一致）。
      return {
        ...assembled,
        sections: [ours, ...sections.slice(0, index), ...sections.slice(index + 1)],
      }
    })
  } catch (error: unknown) {
    ctx.logger.error(`dsh-think-zh: 注册 system-prompt/assemble 置顶兜底失败: ${String(error)}`)
  }
}
```

</details>

**依据 3 · 源码核查**：[src/preturn.ts:44-75](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/src/preturn.ts#L44-L75)

content[0]检测与findIndex写入不一致。

<details>
<summary>查看原文（32行）</summary>

```text
      // 宿主消息缺省 source 字段时按 role 回退判定（类型声明两者均可选）。
      const index = decision.messages.findIndex(
        (msg) => !!msg && (msg.source ? msg.source.kind === 'user' : msg.role === 'user'),
      )
      if (index === -1) {
        return decision
      }
      const msg = decision.messages[index]
      if (!msg || !Array.isArray(msg.content)) {
        return decision
      }
      const isText = (block: { type?: string; text?: string } | undefined): block is { type: 'text'; text: string } =>
        !!block && block.type === 'text' && typeof block.text === 'string'
      // 幂等判定收窄为首文本块前缀：现行实现只在首个文本块打标；全文子串匹配会把
      // 用户正文恰好出现标记字样（如粘贴本插件 README）的消息误判为已注入而跳过注入。
      const firstBlock = msg.content[0]
      if (isText(firstBlock) && firstBlock.text.startsWith(`[${PRETURN_MARK}] `)) {
        return decision
      }
      const blockIndex = msg.content.findIndex(isText)
      if (blockIndex === -1) {
        return decision
      }
      const messages = decision.messages.slice()
      messages[index] = {
        ...msg,
        content: msg.content.map((block, i) => {
          if (i !== blockIndex || !isText(block)) return block
          return { ...block, text: `[${PRETURN_MARK}] ${text()}\n\n${block.text}` }
        }),
      }
      return { ...decision, messages }
```

</details>

**依据 4 · 源码核查**：[lib/preturn.js:28-59](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/lib/preturn.js#L28-L59)

发行同样块索引控制流。

<details>
<summary>查看原文（32行）</summary>

```text
            // 宿主消息缺省 source 字段时按 role 回退判定（类型声明两者均可选）。
            const index = decision.messages.findIndex((msg) => !!msg && (msg.source ? msg.source.kind === 'user' : msg.role === 'user'));
            if (index === -1) {
                return decision;
            }
            const msg = decision.messages[index];
            if (!msg || !Array.isArray(msg.content)) {
                return decision;
            }
            const isText = (block) => !!block && block.type === 'text' && typeof block.text === 'string';
            // 幂等判定收窄为首文本块前缀：现行实现只在首个文本块打标；全文子串匹配会把
            // 用户正文恰好出现标记字样（如粘贴本插件 README）的消息误判为已注入而跳过注入。
            const firstBlock = msg.content[0];
            if (isText(firstBlock) && firstBlock.text.startsWith(`[${PRETURN_MARK}] `)) {
                return decision;
            }
            const blockIndex = msg.content.findIndex(isText);
            if (blockIndex === -1) {
                return decision;
            }
            const messages = decision.messages.slice();
            messages[index] = {
                ...msg,
                content: msg.content.map((block, i) => {
                    if (i !== blockIndex || !isText(block))
                        return block;
                    return { ...block, text: `[${PRETURN_MARK}] ${text()}\n\n${block.text}` };
                }),
            };
            return { ...decision, messages };
        }, { prepend: true });
    }
```

</details>

**依据 5 · 源码核查**：[src/runtime.ts:18-27](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/src/runtime.ts#L18-L27)

读取异常回undefined。

<details>
<summary>查看原文（10行）</summary>

```text
export function readVolatile<T>(ref: unknown): T | undefined {
  try {
    if (ref !== null && typeof ref === 'object' && typeof (ref as VolatileLike<T>).get === 'function') {
      return (ref as VolatileLike<T>).get()
    }
    return ref as T | undefined
  } catch {
    return undefined
  }
}
```

</details>

**依据 6 · 源码核查**：[src/index.ts:26-45](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/src/index.ts#L26-L45)

不按session过滤且忽略disposer。

<details>
<summary>查看原文（20行）</summary>

```text
/** 插件入口：按配置挂载注入器（静态 section + 可选 per-turn 用户消息注入）。 */
export function apply(ctx: MinimalContext, config?: RawConfigInput): void {
  if (!VOLATILE_SUPPORTED) {
    ctx.logger.warn?.(
      'dsh-think-zh: 宿主 schemastery < 3.18.3，thinkingLanguage 为普通字段，「思考语言」设置改完只随插件重挂生效（静态注入不受影响）',
    )
  }
  warnInvalidThinkingLanguage(ctx, config)
  // 开关只判一次；注入文本在提供者内现读 resolveConfig——thinkingLanguage 是 volatile
  // 字段，设置页改完的下一份请求即生效（两次调用是设计使然而非重复计算）。
  const resolved = resolveConfig(config)
  // 每次现读：thinkingLanguage 是 volatile 字段，设置页改完的下一份请求即生效。
  const currentText = (): string => resolveConfig(config).injectionText
  // 两个通道相互独立：静态注入关掉时，per-turn 仍可单独承担指令投递。
  if (resolved.injectPrompt) {
    registerLanguageInjection(ctx, currentText)
  }
  if (resolved.injectPerTurn) {
    registerPerTurnNudge(ctx, currentText)
  }
```

</details>

**依据 7 · 源码核查**：[src/config.ts:70-89](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/src/config.ts#L70-L89)

缺volatile能力退化。

<details>
<summary>查看原文（20行）</summary>

```text
export const VOLATILE_SUPPORTED = typeof (z.string() as { volatile?: unknown }).volatile === 'function'

/**
 * 对 schema 字段应用 `.volatile()`（宿主支持时）；不支持时原样返回普通字段。
 * @param field - 待修饰的 schema 字段。
 */
export function applyVolatile<T>(field: T): T {
  if (typeof (field as { volatile?: unknown } | undefined)?.volatile === 'function') {
    return (field as unknown as { volatile: () => T }).volatile()
  }
  return field
}

/** 宿主 Loader 解析 profile patch 中本条目 config 所用的 schema。 */
export const Config = z.object({
  injectPrompt: z.boolean().default(DEFAULT_CONFIG.injectPrompt),
  injectionText: z.string().default(''),
  injectPerTurn: z.boolean().default(DEFAULT_CONFIG.injectPerTurn),
  thinkingLanguage: applyVolatile(z.string().default(DEFAULT_THINKING_LANGUAGE)),
})
```

</details>

**依据 8 · 源码核查**：[client.js:307-324](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/client.js#L307-L324)

Client样式/字典/槽清理。

<details>
<summary>查看原文（18行）</summary>

```text
      apply(ctx) {
        ctx.effect(() => {
          ensureStyles()
          return () => {
            if (typeof document === 'undefined') return
            document.querySelector('style[data-plugin-css="' + STYLE_ID + '"]')?.remove()
          }
        }, 'dsh-think-zh: settings row styles')
        const form = ctx.configForms.get(NAMESPACE)
        ctx.effect(() => ctx.locale.register(LOCALE_NS, DICT), 'dsh-think-zh: dictionary')
        /** 组件身份在 apply 期固定（form 经闭包注入，避免每次渲染重挂）。 */
        const Row = (props) => h(ThinkingLanguageRow, { ...props, form })
        ctx.slots.inject('settings.general.item', () =>
          ctx.slots.register(
            { name: 'settings.general.item', id: 'thinking-language', order: 5, locale: LOCALE_NS },
            Row,
          ),
        )
```

</details>

#### 缺口

- 固定Host section生命周期/瀑布触发、configForms持久与模型输出未运行验收。
  **影响**：不能保证每请求注入、卸载全移除、跨会话偏好隔离或模型语言服从。
  **进一步探讨**：隔离profile核两会话/两个通道/卸载请求，并以image-first多次pre-step与模型语言任务对照。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 比手写语言提示多做什么，兼容和总成本如何？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

增量是将语言提示做成profile设置、动态文本provider与可选per-step投递，并试图在组装层置顶；语言要求文本、模型服从与推理能力来自原模型和Host，未形成新语言控制算法。手写系统提示/会话消息是直接替代，若用户只偶尔要中文，独立插件必要性有限。切换GUI/减少重复输入不改变组织分工、业务交付验收或供给/计价/服务责任；可见reasoning偏好也不足以证明此前受语言限制的人群已经进入新任务，业务创新未识别。

1.1.1 MIT，Node>=22.19，schemastery>=3.18.3声明为optional peer但Host import必须可解析；volatile探测只兼容模块存在且缺方法，不兼容模块完全缺失。README分级静态>=DSH0.1.0-rc.6、per-turn>=0.1.2、GUI>=0.1.7，是作者依赖说明，package无engines.dsh声明。Web还需slots/locale/remote/configForms，静态Host可用于无Web环境。仓库已有lib入口/注入器与client.js，scripts没有prepare等安装期构建脚本，本次不执行构建/测试。

首次固定profile和模型，先用默认静态、明确选zh并清空custom，核真实请求与code/原文保持；只有确认静态不服从才研究per-turn。持续成本是每请求附加文本token/模型延迟及偏好/Host升级维护，字符数不等token、更不等零开销。两通道并用可能重复指令和改变用户消息语义/缓存，收益不能用源码字符量推算。失败看保存错误/Host日志/请求，回原生提示；退出要移除/禁通道并重挂，已发内容和历史仍留Host。现金与人工未知，不填零。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-15](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/package.json#L1-L15)

版本与许可。

<details>
<summary>查看原文（15行）</summary>

```text
{
  "name": "dsh-think-zh",
  "version": "1.1.1",
  "description": "让模型的思考语言锁定为所选档位（简体中文 / 默认英文），档位在「设置 → 通用设置 → 思考语言」里随时切换；回复语言跟随提问语言。",
  "keywords": [
    "deepseek",
    "deepseek-harness",
    "dsh",
    "plugin",
    "cordis",
    "chinese",
    "reasoning",
    "settings"
  ],
  "license": "MIT",
```

</details>

**依据 2 · 源码核查**：[package.json:45-73](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/package.json#L45-L73)

无安装期脚本、Node和schemastery peer。

<details>
<summary>查看原文（29行）</summary>

```text
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "lint": "eslint src tests client.js eslint.config.js",
    "test": "vitest run",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-settings-general",
        "@deepseek-ai/dsh-client-locale"
      ]
    }
  },
  "engines": {
    "node": ">=22.19"
  },
  "peerDependencies": {
    "@deepseek-ai/schemastery": ">=3.18.3"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/schemastery": {
      "optional": true
    }
```

</details>

**依据 3 · 源码核查**：[README.md:45-50](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/README.md#L45-L50)

作者分级Host能力要求。

```text
前置条件（分级要求，按用到的能力取高者）：

- DeepSeek Harness **≥ 0.1.0-rc.6**：静态 system prompt 注入（`injectPrompt`、`injectionText`）。
- **≥ 0.1.2**：每轮用户消息注入（`injectPerTurn`，需 `agent/pre-step` 瀑布）。
- **≥ 0.1.7**：「思考语言」设置项（依赖官方 settings 服务的 volatile 字段）。
- 源码方式另需 Node.js ≥ 22.19 与 pnpm（`dsh plugin` 内部调用 pnpm）。
```

**依据 4 · 源码核查**：[src/config.ts:9-9](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/src/config.ts#L9-L9)

实际运行import。

```text
import z from '@deepseek-ai/schemastery'
```

**依据 5 · 源码核查**：[src/index.ts:24-45](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/src/index.ts#L24-L45)

静态/每轮挂载。

<details>
<summary>查看原文（22行）</summary>

```text
export const inject: readonly string[] = ['systemPrompt']

/** 插件入口：按配置挂载注入器（静态 section + 可选 per-turn 用户消息注入）。 */
export function apply(ctx: MinimalContext, config?: RawConfigInput): void {
  if (!VOLATILE_SUPPORTED) {
    ctx.logger.warn?.(
      'dsh-think-zh: 宿主 schemastery < 3.18.3，thinkingLanguage 为普通字段，「思考语言」设置改完只随插件重挂生效（静态注入不受影响）',
    )
  }
  warnInvalidThinkingLanguage(ctx, config)
  // 开关只判一次；注入文本在提供者内现读 resolveConfig——thinkingLanguage 是 volatile
  // 字段，设置页改完的下一份请求即生效（两次调用是设计使然而非重复计算）。
  const resolved = resolveConfig(config)
  // 每次现读：thinkingLanguage 是 volatile 字段，设置页改完的下一份请求即生效。
  const currentText = (): string => resolveConfig(config).injectionText
  // 两个通道相互独立：静态注入关掉时，per-turn 仍可单独承担指令投递。
  if (resolved.injectPrompt) {
    registerLanguageInjection(ctx, currentText)
  }
  if (resolved.injectPerTurn) {
    registerPerTurnNudge(ctx, currentText)
  }
```

</details>

**依据 6 · 源码核查**：[lib/index.js:19-37](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/lib/index.js#L19-L37)

发行实际入口。

<details>
<summary>查看原文（19行）</summary>

```text
export const inject = ['systemPrompt'];
/** 插件入口：按配置挂载注入器（静态 section + 可选 per-turn 用户消息注入）。 */
export function apply(ctx, config) {
    if (!VOLATILE_SUPPORTED) {
        ctx.logger.warn?.('dsh-think-zh: 宿主 schemastery < 3.18.3，thinkingLanguage 为普通字段，「思考语言」设置改完只随插件重挂生效（静态注入不受影响）');
    }
    warnInvalidThinkingLanguage(ctx, config);
    // 开关只判一次；注入文本在提供者内现读 resolveConfig——thinkingLanguage 是 volatile
    // 字段，设置页改完的下一份请求即生效（两次调用是设计使然而非重复计算）。
    const resolved = resolveConfig(config);
    // 每次现读：thinkingLanguage 是 volatile 字段，设置页改完的下一份请求即生效。
    const currentText = () => resolveConfig(config).injectionText;
    // 两个通道相互独立：静态注入关掉时，per-turn 仍可单独承担指令投递。
    if (resolved.injectPrompt) {
        registerLanguageInjection(ctx, currentText);
    }
    if (resolved.injectPerTurn) {
        registerPerTurnNudge(ctx, currentText);
    }
```

</details>

**依据 7 · 源码核查**：[client.js:301-324](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/client.js#L301-L324)

Web服务条件。

<details>
<summary>查看原文（24行）</summary>

```text
    return {
      inject: ['slots', 'locale', 'remote', 'configForms'],
      /**
       * 注册设置行与字典。
       * @param ctx - client cordis 上下文。
       */
      apply(ctx) {
        ctx.effect(() => {
          ensureStyles()
          return () => {
            if (typeof document === 'undefined') return
            document.querySelector('style[data-plugin-css="' + STYLE_ID + '"]')?.remove()
          }
        }, 'dsh-think-zh: settings row styles')
        const form = ctx.configForms.get(NAMESPACE)
        ctx.effect(() => ctx.locale.register(LOCALE_NS, DICT), 'dsh-think-zh: dictionary')
        /** 组件身份在 apply 期固定（form 经闭包注入，避免每次渲染重挂）。 */
        const Row = (props) => h(ThinkingLanguageRow, { ...props, form })
        ctx.slots.inject('settings.general.item', () =>
          ctx.slots.register(
            { name: 'settings.general.item', id: 'thinking-language', order: 5, locale: LOCALE_NS },
            Row,
          ),
        )
```

</details>

#### 缺口

- 相同任务中文可读性/正确率、模型服从、token与维护净收益未量化。
  **影响**：不能证明中文思考提升答案质量或一般优于手写提示。
  **进一步探讨**：同模型/effort固定纯文本与多模态题，对原生提示、静态、per-turn分开比较语言/正确性/费用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样有限试用，最值得证伪哪个方向？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可条件试用：已有DSH的中文用户在独立profile、纯文本非敏感题先只开静态并明确选zh、清空custom，核实际system段及可见reasoning/最终答案是否符合语言和原文保持。它比每次复制要求多了profile设置与现读，但默认en并不保证英文，也不代表关全部插件影响。若质量下降、语言仍不服从或卸载请求留指令，就回原生一次性语言提示并核移除，勿把可见中文当推理正确。

候选方向是复用pre-step第一text的实际索引做幂等标记，并让每请求可观察本次采用哪个通道/文本版本，而不是再加更强措辞。依据是image-first重复与custom覆盖会让GUI选择和真实投递不同。最小对照先以纯文本、image-first、无text、用户标记前缀、volatile切档五类决策做静态原文回放，再经授权以同模型比较原生提示/静态/per-turn的语言、最终正确性和token。若Host已有原生请求语言/提示检查器就直接组合；若补幂等后仍不服从或可读性收益不抵token/质量变化，不继续增加语言插件复杂度。

#### 证据与依据

**依据 1 · 源码核查**：[src/preturn.ts:44-75](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/src/preturn.ts#L44-L75)

索引对齐可证伪改进。

<details>
<summary>查看原文（32行）</summary>

```text
      // 宿主消息缺省 source 字段时按 role 回退判定（类型声明两者均可选）。
      const index = decision.messages.findIndex(
        (msg) => !!msg && (msg.source ? msg.source.kind === 'user' : msg.role === 'user'),
      )
      if (index === -1) {
        return decision
      }
      const msg = decision.messages[index]
      if (!msg || !Array.isArray(msg.content)) {
        return decision
      }
      const isText = (block: { type?: string; text?: string } | undefined): block is { type: 'text'; text: string } =>
        !!block && block.type === 'text' && typeof block.text === 'string'
      // 幂等判定收窄为首文本块前缀：现行实现只在首个文本块打标；全文子串匹配会把
      // 用户正文恰好出现标记字样（如粘贴本插件 README）的消息误判为已注入而跳过注入。
      const firstBlock = msg.content[0]
      if (isText(firstBlock) && firstBlock.text.startsWith(`[${PRETURN_MARK}] `)) {
        return decision
      }
      const blockIndex = msg.content.findIndex(isText)
      if (blockIndex === -1) {
        return decision
      }
      const messages = decision.messages.slice()
      messages[index] = {
        ...msg,
        content: msg.content.map((block, i) => {
          if (i !== blockIndex || !isText(block)) return block
          return { ...block, text: `[${PRETURN_MARK}] ${text()}\n\n${block.text}` }
        }),
      }
      return { ...decision, messages }
```

</details>

**依据 2 · 源码核查**：[src/config.ts:110-126](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/src/config.ts#L110-L126)

custom覆盖/volatile文本。

<details>
<summary>查看原文（17行）</summary>

```text
 * 此时按 `thinkingLanguage` 生成文本。
 *
 * 输入统一先解 volatile 引用：宿主 schema 解析后，volatile 字段（连带其默认值）
 * 一律是 `{ get() }` 引用，直接当值用会静默回退默认档。
 */
export function resolveConfig(input?: RawConfigInput): ResolvedConfig {
  const resolved: ResolvedConfig = {
    injectPrompt: toBoolean(readVolatile(input?.injectPrompt), DEFAULT_CONFIG.injectPrompt),
    injectionText: '',
    injectPerTurn: toBoolean(readVolatile(input?.injectPerTurn), DEFAULT_CONFIG.injectPerTurn),
    thinkingLanguage: normalizeThinkingLanguage(readVolatile(input?.thinkingLanguage)),
  }
  const rawText = readVolatile(input?.injectionText)
  const custom = typeof rawText === 'string' ? rawText.trim() : ''
  resolved.injectionText = custom.length > 0 ? custom : injectionTextFor(resolved.thinkingLanguage)
  return resolved
}
```

</details>

**依据 3 · 源码核查**：[client.js:216-230](https://github.com/Len7183/DSH-Think-zh/blob/2ba0a1e338410b44c07f221087907e210ad65b59/client.js#L216-L230)

保存回读可复用。

<details>
<summary>查看原文（15行）</summary>

```text
      /** 提交选择：写 volatile 字段；返回值非 true 时回读快照确认，确实未落盘才提示重试。 */
      const select = async (id) => {
        triggerRef.current?.focus()
        setOpen(false)
        if (id === activeId || disabled) return
        setPending(true)
        setFailed(false)
        try {
          const accepted = await form.set(FIELD, id)
          if (accepted !== true && pickId(form.getSnapshot()) !== id) setFailed(true)
        } catch {
          setFailed(true)
        } finally {
          setPending(false)
        }
```

</details>

#### 缺口

- 候选幂等修复与语言/正确性对照未执行，Host原生检查器未核。
  **影响**：不计当前贡献，不承诺更优。
  **进一步探讨**：先核现成请求检查能力与五类输入，再决定小修或回原生提示。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
