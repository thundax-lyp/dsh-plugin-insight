# dsh-gomoku

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[26fdf6e](https://github.com/omdsh-dev/dsh-gomoku/tree/26fdf6e99c95447f250ab51478fbc694b6024e8d)

<!-- BEGIN META -->
[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-gomoku) [![npm 30d 1,338](https://img.shields.io/static/v1?label=npm+30d&message=1%2C338&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yejiming/dsh-gomoku) [![最新发布 2026-10-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yejiming/dsh-gomoku)
<!-- END META -->

> **功能**：在 DSH 侧边栏提供 15×15 人机与双 AI 五子棋对局。

> **亮点**：[Q01](#research-q01) 将模型对弈、棋盘状态和暂停接管整合进 DSH conversation view；没有搜索算法，棋力提升未证实。

> **主要限制**：主机与客户端都能拒绝非法落点，模型宣和仍可直接结束棋局。暂停约束浏览器状态，服务端生成和费用是否同时停下仍未知。[Q02](#research-q02)

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
  - [Q01 · 插件如何接入 DSH 并完成一局对弈，核心贡献相对普通聊天是什么？](#detail-section-11)
  - [Q02 · 棋盘规则、模型输出校验及暂停/重试能否保证局面安全？](#detail-section-12)
  - [Q03 · 什么条件下值得试用，如何判断模型棋力和交互价值？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在 DSH 内观察模型棋路或演示双模型对局的用户。

普通聊天提示模型下棋或独立网页棋盘；未做对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件/限制 |
|---|---|---|
| 棋盘对局 | 人机、双AI对弈 | 依赖 DSH Web profile |
| 模型落子 | 按提示生成候选步 | LLM 非确定，费用/效果未测 |
| 暂停接管 | 中断 AI 过程并手动落子 | 竞态边界未运行验证 |

**流程与依赖**

| 依赖 | 必需性 | 边界 |
|---|---|---|
| DSH Web profile 与 client renderer | 必需 | 版本兼容未在目标环境运行 |
| 宿主 llm、webServer | 对局必需 | 模型请求和路由行为未验证 |
| 模型提供方/凭据 | 对局必需 | 用量、访问与安全边界依模型和宿主设置 |
| Jev API Key | 可选 | store 声明只存页面内存，实际网络行为未测 |

| 步骤 | 操作 | 结果/失败边界 |
|---|---|---|
| 安装 | 在 DSH profile 添加 bundle | 目标环境兼容未验 |
| 开局 | 选模式、双方模型与提示词 | client store 保存局面；模型列表可能失败 |
| 落子 | host 请求模型并返回候选 | 有超时/输出/尝试上限，未运行验证 |
| 暂停/恢复 | 暂停后可手动落子，再继续 | 竞态行为需宿主验证 |

**效果与成本**

| 阶段 | 现金成本 | 人工成本 | 未知 |
|---|---|---|---|
| 使用 | 模型 API token 费用，具体依服务 | 配置模型、提示词 | 实际单局费用未知 |
| 持续 | 每次 AI 落子请求 | 观察对局与错误 | 延迟及重试频度未知 |
| 退出 | 可移除 profile 插件 | 保存/迁移对局未核实 | 数据清理语义未知 |

| 效果 | 代码支持 | 未知 |
|---|---|---|
| 对局交互 | 棋盘、模型选择、暂停接管 | 可用性与真实稳定性 |
| 模型棋力 | 无搜索，依赖 LLM 输出 | 胜率与推理质量 |
| 工作流整合 | conversation view 接入 DSH | 是否减少切换成本 |

> **思考**：主机与客户端都能拒绝非法落点，模型宣和仍可直接结束棋局。暂停约束浏览器状态，服务端生成和费用是否同时停下仍未知。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将模型对弈、棋盘状态和暂停接管整合进 DSH conversation view；没有搜索算法，棋力提升未证实。

[Q02](#research-q02) 请求有超时、输出和尝试限制，client 暂停支持手动接管；异常输出、取消竞态和目标宿主兼容仍未知。

<a id="detail-section-5"></a>

### 1.4 主要限制

主机与客户端都能拒绝非法落点，模型宣和仍可直接结束棋局。暂停约束浏览器状态，服务端生成和费用是否同时停下仍未知。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在隔离 profile 小规模体验并记录合法落子率、延迟与费用；若不稳定或推理展示造成误解，停止将其用于评测。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认 DSH host/client 接线及对局交互设计；模型效果、宿主运行、费用与可靠性均未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.ts、src/client/index.ts、src/client/store.ts、src/jev-shared.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定提交的 README、bundle/patch、host/client/store 源码与准入接线。没有安装、运行目标插件或调用模型。
- 下一步：在隔离 profile 测试合法/非法输出、断流重试、超时、暂停期间响应与恢复；记录费用、延迟、胜率并与普通提示对照。

**分析版本**

- **仓库**：[omdsh-dev/dsh-gomoku](https://github.com/omdsh-dev/dsh-gomoku)
- **版本号**：0.0.3（[固定提交 26fdf6e](https://github.com/omdsh-dev/dsh-gomoku/tree/26fdf6e99c95447f250ab51478fbc694b6024e8d)）
- **版本日期**：2026-10-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 将双方模型对弈置于工作流侧栏或能降低切换成本，但用户价值尚待对照验证。

在隔离 profile 测试合法/非法输出、断流重试、超时、暂停期间响应与恢复；记录费用、延迟、胜率并与普通提示对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 1963 | 1699 | 349 | — |
| .md | source | 2 | 374 | — | — | 7027 |
| .ts | source | 9 | 1668 | 1162 | 409 | — |
| .tsx | source | 2 | 557 | 469 | 59 | — |
| .mjs | test | 3 | 373 | 305 | 60 | — |
| .ts | test | 4 | 509 | 450 | 4 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-gomoku/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-gomoku/issues?q=is%3Aissue+created%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-gomoku/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z)



统计日期：2026-11-16。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本 dsh-gomoku 的 DSH 接线、对局安全与采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件如何接入 DSH 并完成一局对弈，核心贡献相对普通聊天是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、工程质量与复用

#### 完整回答

dsh-gomoku 通过 profile bundle patch 同时安装 host 与 browser 部分：host 注入 webServer/llm 并提供棋盘、模型列表和落子路由，client 注册 conversation view 展示 15×15 棋盘与对局状态。人机和双 AI 对战、暂停接管及双方推理展示是主要交互增量；它不含搜索算法，不能据此认为模型棋力提升。目标 DSH 环境的安装和路由行为未实测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-12](https://github.com/omdsh-dev/dsh-gomoku/blob/26fdf6e99c95447f250ab51478fbc694b6024e8d/README.md#L7-L12)

作者描述 15×15 对局、无搜索及双方提示词。

```text
总是让 AI 帮你写代码、做表格？这次换它陪你下棋。`@yejiming/dsh-gomoku` 是 DeepSeek Harness 的五子棋插件：在 DSH 侧边栏摆上一盘 15×15 的棋盘，让 DeepSeek 或任何你配置好的模型执子对弈。

这里没有搜索算法，也没有启发式剪枝——每一步落子都来自 LLM 纯粹的推理与判断，堪称对模型「思考能力」最直观的考验。最过瘾的当属双 AI 对战：让两个模型同台厮杀，谁的推理更缜密、更懂审时度势，一局见分晓。

想更进一步？黑、白两方的系统提示词可以分别编辑，约束 AI 落子前的思维链，亲眼看着棋力在你的「调教」下节节攀升——输赢先不论，围观棋路、偷师几手也不亏。

```

**依据 2 · 源码核查**：[package.json:37-47](https://github.com/omdsh-dev/dsh-gomoku/blob/26fdf6e99c95447f250ab51478fbc694b6024e8d/package.json#L37-L47)

声明 DSH bundle 与 client 注入。

<details>
<summary>查看原文（11行）</summary>

```text
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-conversation"
      ],
      "platform": "web"
    },
    "engines": {
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-9](https://github.com/omdsh-dev/dsh-gomoku/blob/26fdf6e99c95447f250ab51478fbc694b6024e8d/cordis.patch.yml#L1-L9)

profile patch 装入插件两端。

```text
# The dsh-gomoku bundle patch: activates the plugin as a profile layer.
# The single row covers both halves of this package: the node half runs in
# the host, and the browser half (lib/client.js) ships in the same package,
# loading under this same id through the dsh.client declaration in
# package.json. There is no separate ui-gomoku package, so no second row
# belongs here (duplicate ids fail the load).
- insert:
    - id: gomoku
      name: '@yejiming/dsh-gomoku'
```

**依据 4 · 源码核查**：[src/index.ts:519-527](https://github.com/omdsh-dev/dsh-gomoku/blob/26fdf6e99c95447f250ab51478fbc694b6024e8d/src/index.ts#L519-L527)

host apply 接入宿主服务。

```text
export function apply(ctx: Context, config: Config): void {
  const resolved: Required<Config> = {
    moveTimeoutMs: config.moveTimeoutMs,
    maxMoveOutputTokens: config.maxMoveOutputTokens,
    maxMoveAttempts: config.maxMoveAttempts,
  }

  /** Collect the request body into a parsed JSON value. */
  const readJson = async (req: IncomingMessage): Promise<unknown> => {
```

**依据 5 · 源码核查**：[src/client/index.ts:23-35](https://github.com/omdsh-dev/dsh-gomoku/blob/26fdf6e99c95447f250ab51478fbc694b6024e8d/src/client/index.ts#L23-L35)

client 注册 conversation view。

<details>
<summary>查看原文（13行）</summary>

```text
export const inject = ['locale', 'slots']

/**
 * Client plugin body: register the gomoku dictionaries and the
 * conversation-view tab. The registration rides the slot service's effect
 * wrapper, so plugin unload removes the tab.
 * @param ctx - client root context.
 */
export function apply(ctx: Context): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'gomoku: dictionaries')
  const t = ctx.locale.bind(NS)
  ctx.slots.inject('conversation.view', () => ctx.slots.register({
    name: 'conversation.view',
```

</details>

#### 缺口

- 目标宿主安装兼容及路由访问边界未实测
  **影响**：影响对效果、安全边界或采用建议的判断
  **进一步探讨**：在隔离 DSH profile 按问题描述进行针对性验证

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 棋盘规则、模型输出校验及暂停/重试能否保证局面安全？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

主机要求棋盘为 225 个 0/1/2 数组、合法执子方及已知模型配置。回复经解析得到整数坐标后，对本次请求棋盘仅检查边界与空格；客户端用当前局面再检一次，还在黑棋首步要求中心点，胜负及满盘由本地状态推进。反例是模型主动输出 draw 时，服务器转发后客户端直接把对局记为和棋，不会复核棋盘已满。可用于演示，不能据此认定规则裁判全面。

服务端先为单次 HTTP 落子建一个 AbortController 和截止计时，然后最多尝试三次，每次以可配置 token 上限读取。畸形、超预算或非法回复带来纠错分支，部分流错误也可在预算内重试，非暂时性错误结束。3,000,000 ms 是缺省的整次请求截止时间，尝试共用，调用者可覆盖。浏览器另为本地拒绝的中心点路径最多三次重新发请求，因此不能把后端次数直接当整个棋步费用上界。

暂停会 abort 浏览器请求并清 thinking，用户可接手；回复还须匹配 generation、seq、轮到的棋色及 thinking 状态。浏览器 watchdog 在超时时将结果记录为中断并保留重试入口。未实测浏览器取消是否会让后端提供方停止生成并停止计费。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:77-83](https://github.com/omdsh-dev/dsh-gomoku/blob/26fdf6e99c95447f250ab51478fbc694b6024e8d/src/index.ts#L77-L83)

配置落子超时、输出上限和尝试预算。

```text
  // per request, so the UI no longer exposes them.
  moveTimeoutMs: z.number().step(1).min(1000).default(3_000_000),
  // Generous by default: reasoning models count their thinking toward the
  // output budget, and a truncated reply is only salvageable when the JSON
  // itself survives the cut.
  maxMoveOutputTokens: z.number().step(1).min(8).default(32_000),
  maxMoveAttempts: z.number().step(1).min(1).max(3).default(3),
```

**依据 2 · 源码核查**：[src/client/store.ts:279-282](https://github.com/omdsh-dev/dsh-gomoku/blob/26fdf6e99c95447f250ab51478fbc694b6024e8d/src/client/store.ts#L279-L282)

暂停可切断在途 AI 落子并开放手动接管。

```text
/**
 * Toggle manual-takeover (pause) mode. Pausing cuts off any in-flight AI
 * move (the board stays fully playable for both sides, and the interrupted
 * request's catch path only records a log entry — it can never touch the
```

**依据 3 · 作者声明**：[README.md:14-20](https://github.com/omdsh-dev/dsh-gomoku/blob/26fdf6e99c95447f250ab51478fbc694b6024e8d/README.md#L14-L20)

作者说明无禁手规则、暂停接管。

```text

## 主要功能

- **人机与双 AI 对弈**：支持执黑、执白、双 AI 对弈三种模式，15×15 无禁手规则（双三、双四、长连均合法，连成五子及以上即胜）。对弈模式与新开局按钮位于棋盘下方。
- **黑白 AI 分别设置**：黑、白两方可分别选择模型与思考档位（Off / High / Max），互不影响；模型不支持所选档位时自动回落其默认档位。
- **思考过程分侧展示**：黑、白两方的思考记录分别列在棋盘左右两侧（与各自的 AI 设置同侧），默认折叠，点击某手可展开该步的完整推理文本。
- **暂停与手动接管**：棋盘下方【新开局】按钮右侧的【暂停】按钮可随时中断 AI 思考（两者均为「图标 + 文字」的胶囊按钮：⟳ 新开局、⏸ 暂停、▶ 继续，暂停中按钮转为琥珀色高亮）；暂停期间你可为黑白双方轮流落子，没有步数限制，再次点击【继续】后 AI 恢复思考。
```

**依据 4 · 源码核查**：[src/index.ts:240-247](https://github.com/omdsh-dev/dsh-gomoku/blob/26fdf6e99c95447f250ab51478fbc694b6024e8d/src/index.ts#L240-L247)

在主机按请求棋面检查空格和范围。

```text
 * @param row - intersection row.
 * @param col - intersection column.
 * @returns true when the move may be played.
 */
export function isLegalMove(board: readonly number[], row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE
    && board[row * BOARD_SIZE + col] === EMPTY
}
```

**依据 5 · 源码核查**：[src/index.ts:446-497](https://github.com/omdsh-dev/dsh-gomoku/blob/26fdf6e99c95447f250ab51478fbc694b6024e8d/src/index.ts#L446-L497)

验证棋面尺寸、格值和请求预算。

<details>
<summary>查看原文（52行）</summary>

```text
export function validateMoveRequest(value: unknown): MoveRequestBody {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('请求体必须是 JSON 对象')
  }
  const candidate = value as Record<string, unknown>
  if (typeof candidate.provider !== 'string' || candidate.provider.length === 0) {
    throw new Error('provider 必须是非空字符串')
  }
  if (typeof candidate.model !== 'string' || candidate.model.length === 0) {
    throw new Error('model 必须是非空字符串')
  }
  if (candidate.provider === JEV_PROVIDER) {
    if (candidate.model !== JEV_MODEL) throw new Error('不支持的 Jev 模型')
    if (!isValidJevApiKey(candidate.jevApiKey)) throw new Error('请先设置有效的 Jev API Key')
  } else if (candidate.jevApiKey !== undefined) {
    throw new Error('Jev API Key 只能用于 Jev 模型')
  }
  if (candidate.side !== 'black' && candidate.side !== 'white') {
    throw new Error('side 必须是 "black" 或 "white"')
  }
  if (candidate.thinking !== undefined && candidate.thinking !== 'off'
    && candidate.thinking !== 'high' && candidate.thinking !== 'max') {
    throw new Error('thinking 必须是 "off"、"high" 或 "max"')
  }
  if (candidate.moveTimeoutMs !== undefined
    && (typeof candidate.moveTimeoutMs !== 'number'
      || !Number.isInteger(candidate.moveTimeoutMs) || candidate.moveTimeoutMs < 1000)) {
    throw new Error('moveTimeoutMs 必须是 >= 1000 的整数毫秒数')
  }
  if (candidate.maxMoveOutputTokens !== undefined
    && (typeof candidate.maxMoveOutputTokens !== 'number'
      || !Number.isInteger(candidate.maxMoveOutputTokens) || candidate.maxMoveOutputTokens < 8)) {
    throw new Error('maxMoveOutputTokens 必须是 >= 8 的整数')
  }
  const board = candidate.board
  if (!Array.isArray(board) || board.length !== BOARD_SIZE * BOARD_SIZE
    || board.some(cell => cell !== EMPTY && cell !== BLACK && cell !== WHITE)) {
    throw new Error(`board 必须是 ${BOARD_SIZE * BOARD_SIZE} 个 0/1/2 组成的数组`)
  }
  const system = candidate.system
  if (system !== undefined && typeof system !== 'string') {
    throw new Error('system 必须是字符串')
  }
  return {
    provider: candidate.provider,
    model: candidate.model,
    side: candidate.side,
    board: board as number[],
    ...(candidate.provider === JEV_PROVIDER ? { jevApiKey: (candidate.jevApiKey as string).trim() } : {}),
    ...(typeof system === 'string' ? { system } : {}),
    ...(candidate.thinking !== undefined ? { thinking: candidate.thinking } : {}),
    ...(candidate.moveTimeoutMs !== undefined ? { moveTimeoutMs: candidate.moveTimeoutMs } : {}),
```

</details>

**依据 6 · 源码核查**：[src/index.ts:572-641](https://github.com/omdsh-dev/dsh-gomoku/blob/26fdf6e99c95447f250ab51478fbc694b6024e8d/src/index.ts#L572-L641)

整次请求共用信号、错误重试、结果分支及清理。

<details>
<summary>查看原文（70行）</summary>

```text
          if (req.method === 'POST' && segments.length === 1 && segments[0] === 'move') {
            const request = validateMoveRequest(await readJson(req))
            // Per-request overrides stand; absent values fall back to the
            // deployment policy from the loader config.
            const effectiveTimeoutMs = request.moveTimeoutMs ?? resolved.moveTimeoutMs
            const effectiveMaxTokens = request.maxMoveOutputTokens ?? resolved.maxMoveOutputTokens
            const controller = new AbortController()
            const timer = setTimeout(
              () => { controller.abort(new Error('gomoku: AI 落子超时')) },
              effectiveTimeoutMs,
            )
            try {
              const system = request.system !== undefined && request.system.trim().length > 0
                ? request.system
                : DEFAULT_SYSTEM_PROMPT
              let lastText: string | undefined
              let lastReason: string | undefined
              let lastReasoning = ''
              for (let attempt = 1; attempt <= resolved.maxMoveAttempts; attempt += 1) {
                const user = buildMoveUserMessage(request, lastText, lastReason)
                let attemptText: MoveAttemptText
                try {
                  attemptText = await streamMoveText(ctx, request, system, user, effectiveMaxTokens, controller.signal)
                } catch (error) {
                  // A transient stream failure (the connection dropped
                  // mid-response, a provider rate limit, ...) is worth one more
                  // attempt — the model never saw a completed reply, so retry
                  // without corrective feedback. The last attempt falls through
                  // to the bounded failure response below instead of a raw 400.
                  if (!isRetryableMoveFailure(error)) throw error
                  lastText = undefined
                  lastReason = error instanceof Error ? error.message : String(error)
                  // A failed stream carries no usable reasoning; drop any
                  // earlier attempt's text so the error response stays honest.
                  lastReasoning = ''
                  ctx.logger.warn('gomoku: transient AI move failure: %s', lastReason)
                  if (attempt < resolved.maxMoveAttempts) continue
                  break
                }
                const text = attemptText.text
                lastReasoning = attemptText.reasoning
                const reply = parseMoveReply(text)
                if (reply.kind === 'move') {
                  if (!isLegalMove(request.board, reply.row, reply.col)) {
                    lastText = text
                    lastReason = `目标交叉点 [${reply.row}, ${reply.col}] 已被占用或越界`
                    continue
                  }
                  writeJson(200, { move: { row: reply.row, col: reply.col }, reasoning: lastReasoning })
                  return
                }
                if (reply.kind === 'draw') {
                  writeJson(200, { draw: true, reasoning: lastReasoning })
                  return
                }
                if (reply.kind === 'error') {
                  writeJson(200, { error: `AI 报告：${reply.message}`, reasoning: lastReasoning })
                  return
                }
                lastText = text
                lastReason = attemptText.truncated
                  ? 'AI 回复被截断（超过最大输出长度），可能未输出完整的 JSON'
                  : reply.reason
              }
              writeJson(200, {
                error: `AI 连续 ${resolved.maxMoveAttempts} 次未能完成落子（最后原因：${lastReason ?? '未知'}）`,
                reasoning: lastReasoning,
              })
            } finally {
              clearTimeout(timer)
```

</details>

**依据 7 · 源码核查**：[src/client/store.ts:192-219](https://github.com/omdsh-dev/dsh-gomoku/blob/26fdf6e99c95447f250ab51478fbc694b6024e8d/src/client/store.ts#L192-L219)

当前棋面和中心点等提交检查。

<details>
<summary>查看原文（28行）</summary>

```text
 * The pure place-transition: put the current turn's stone at (row, col) and
 * advance the game. Returns null when the move is illegal or the game is
 * settled; the caller commits the result. (The thinking flag is NOT a guard
 * here — callers own it; an AI reply arrives while thinking is still set.)
 *
 * Freestyle rules with one house rule: black's opening move (moveCount 0,
 * always black) must land on the tengen (board center) intersection.
 */
function placed(game: GameState, row: number, col: number): GameState | null {
  if (gameOver(game)) return null
  if (!isLegalMove(game.board, row, col)) return null
  if (game.moveCount === 0 && game.turn === BLACK
    && (row !== TENGEN.row || col !== TENGEN.col)) {
    return null
  }
  const board = [...game.board] as Cell[]
  const color = game.turn
  board[row * BOARD_SIZE + col] = color
  const base: GameState = {
    ...game,
    board,
    lastMove: { row, col },
    moveCount: game.moveCount + 1,
    turn: color === BLACK ? WHITE : BLACK,
  }
  if (winsAt(board, row, col)) return { ...base, winner: color }
  if (!hasEmpty(board)) return { ...base, draw: true }
  return base
```

</details>

**依据 8 · 源码核查**：[src/client/store.ts:286-295](https://github.com/omdsh-dev/dsh-gomoku/blob/26fdf6e99c95447f250ab51478fbc694b6024e8d/src/client/store.ts#L286-L295)

暂停清 in-flight 状态。

<details>
<summary>查看原文（10行）</summary>

```text
export function togglePause(): void {
  const { game, settings } = snapshot
  if (gameOver(game)) return
  if (game.paused) {
    commitGame({ ...game, paused: false })
    if (isAiTurn(settings.mode, game.turn)) scheduleAi()
  } else {
    abort?.abort()
    commitGame({ ...game, paused: true, thinking: false })
  }
```

</details>

**依据 9 · 源码核查**：[src/client/store.ts:369-415](https://github.com/omdsh-dev/dsh-gomoku/blob/26fdf6e99c95447f250ab51478fbc694b6024e8d/src/client/store.ts#L369-L415)

watchdog、generation、seq 与中断回执。

<details>
<summary>查看原文（47行）</summary>

```text
  commitGame({ ...game, thinking: true })
  const controller = new AbortController()
  abort = controller
  const seq = ++requestSeq
  // Watchdog: if the request stays silent past the node half's own deadline
  // plus margin, abort it — the catch below then records an interruption
  // instead of leaving the board stuck on "AI 思考中" forever.
  const watchdog = window.setTimeout(() => {
    if (gen === generation && seq === requestSeq) controller.abort()
  }, settings.moveTimeoutMs + WATCHDOG_MARGIN_MS)
  const system = sidePromptOf(settings, turn)
  requestAiMove({
    provider: model.provider,
    model: model.model,
    side: sideOf(turn),
    board: [...game.board],
    ...(model.provider === JEV_PROVIDER
      ? { jevApiKey: settings.jevApiKey }
      : { thinking: sideThinkingOf(settings, turn) }),
    moveTimeoutMs: settings.moveTimeoutMs,
    maxMoveOutputTokens: settings.maxMoveOutputTokens,
    ...(system !== undefined ? { system } : {}),
  }, controller.signal)
    .then((reply: MoveResponse) => {
      window.clearTimeout(watchdog)
      if (gen !== generation || seq !== requestSeq) return
      applyAiReply(reply, turn, gen, attempt)
    })
    .catch((error: unknown) => {
      window.clearTimeout(watchdog)
      if (gen !== generation || seq !== requestSeq) return
      const current = snapshot.game
      if (current.turn !== turn) return
      // An aborted request (watchdog or an external abort) is an
      // interruption, not a model failure: the user gets a dedicated status
      // and a retry, and the stale promise can never touch the board.
      if ((error as { name?: string } | null)?.name === 'AbortError') {
        commitGame({
          ...current,
          thinking: false,
          log: [...current.log, {
            n: current.moveCount + 1, side: sideOf(turn), move: null, reasoning: '', interrupted: true,
          }],
        })
        return
      }
      const message = error instanceof Error ? error.message : String(error)
```

</details>

**依据 10 · 源码核查**：[src/client/store.ts:425-471](https://github.com/omdsh-dev/dsh-gomoku/blob/26fdf6e99c95447f250ab51478fbc694b6024e8d/src/client/store.ts#L425-L471)

迟到、非法、额外重试及模型宣和。

<details>
<summary>查看原文（47行）</summary>

```text
function applyAiReply(reply: MoveResponse, turn: Cell, gen: number, attempt: number): void {
  const { game, settings } = snapshot
  // `thinking` guards stale replies landing after an interruption (the seq
  // guard above already filtered superseded requests).
  if (game.turn !== turn || !game.thinking) return
  if (reply.move !== undefined) {
    const next = placed(game, reply.move.row, reply.move.col)
    if (next !== null) {
      const withLog: GameState = {
        ...next,
        // placed() spreads the in-flight game (thinking still true); the
        // move has now settled, so the flag must drop before commit or the
        // board stays locked on "AI 思考中".
        thinking: false,
        log: [...next.log, {
          n: next.moveCount,
          side: sideOf(turn),
          move: `${reply.move.row},${reply.move.col}`,
          reasoning: reply.reasoning ?? '',
        }],
      }
      commitGame(withLog)
      if (!gameOver(withLog) && isAiTurn(settings.mode, withLog.turn)) {
        window.setTimeout(() => { if (gen === generation) scheduleAi() }, 350)
      }
      return
    }
    // The node half only checks board legality; the client-side house rules
    // (the tengen opening) can still reject a reply, so retry within the
    // attempt budget before failing the move. Clear the thinking flag first
    // so the re-entrant scheduleAi can pass its own in-flight guard.
    if (attempt < MAX_AI_ATTEMPTS) {
      commitGame({ ...game, thinking: false })
      window.setTimeout(() => { if (gen === generation) scheduleAi(attempt + 1) }, 200)
      return
    }
  }
  if (reply.draw === true) {
    commitGame({ ...game, thinking: false, draw: true })
    return
  }
  const error = reply.error ?? 'unknown error'
  commitGame({
    ...game,
    thinking: false,
    log: [...game.log, { n: game.moveCount + 1, side: sideOf(turn), move: null, reasoning: reply.reasoning ?? '', error }],
  })
```

</details>

#### 缺口

- 异常输出、重复/过期响应和真实取消语义未运行验证
  **影响**：影响对效果、安全边界或采用建议的判断
  **进一步探讨**：在隔离 DSH profile 按问题描述进行针对性验证

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么条件下值得试用，如何判断模型棋力和交互价值？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

适合用小范围非敏感对局演示人机和双模型轮换。在临时 profile 先用固定模型、低预算和已知局面验证黑棋首步、非法落点、错误宣和及暂停晚到回复。每次请求可能有多个 provider 尝试，客户端在本地拒绝时又可另发请求，按实际调用、延迟与人工判断计量。没有用量和胜率证据。若模型随意宣和、超时或用户误把推理文本当准确解释，就停止评测，保留棋局并退回独立棋盘。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-12](https://github.com/omdsh-dev/dsh-gomoku/blob/26fdf6e99c95447f250ab51478fbc694b6024e8d/README.md#L7-L12)

作者描述对局和推理过程观摩定位。

```text
总是让 AI 帮你写代码、做表格？这次换它陪你下棋。`@yejiming/dsh-gomoku` 是 DeepSeek Harness 的五子棋插件：在 DSH 侧边栏摆上一盘 15×15 的棋盘，让 DeepSeek 或任何你配置好的模型执子对弈。

这里没有搜索算法，也没有启发式剪枝——每一步落子都来自 LLM 纯粹的推理与判断，堪称对模型「思考能力」最直观的考验。最过瘾的当属双 AI 对战：让两个模型同台厮杀，谁的推理更缜密、更懂审时度势，一局见分晓。

想更进一步？黑、白两方的系统提示词可以分别编辑，约束 AI 落子前的思维链，亲眼看着棋力在你的「调教」下节节攀升——输赢先不论，围观棋路、偷师几手也不亏。

```

**依据 2 · 源码核查**：[src/index.ts:77-83](https://github.com/omdsh-dev/dsh-gomoku/blob/26fdf6e99c95447f250ab51478fbc694b6024e8d/src/index.ts#L77-L83)

每步请求上限。

```text
  // per request, so the UI no longer exposes them.
  moveTimeoutMs: z.number().step(1).min(1000).default(3_000_000),
  // Generous by default: reasoning models count their thinking toward the
  // output budget, and a truncated reply is only salvageable when the JSON
  // itself survives the cut.
  maxMoveOutputTokens: z.number().step(1).min(8).default(32_000),
  maxMoveAttempts: z.number().step(1).min(1).max(3).default(3),
```

**依据 3 · 源码核查**：[src/client/store.ts:67-70](https://github.com/omdsh-dev/dsh-gomoku/blob/26fdf6e99c95447f250ab51478fbc694b6024e8d/src/client/store.ts#L67-L70)

Jev key 仅存页面内存。

```text
/** The user-adjustable settings, kept across tab switches. */
export interface SettingsState {
  /** Page-memory only; shared by both Jev selectors, never persisted. */
  jevApiKey: string
```

**依据 4 · 源码核查**：[src/index.ts:575-641](https://github.com/omdsh-dev/dsh-gomoku/blob/26fdf6e99c95447f250ab51478fbc694b6024e8d/src/index.ts#L575-L641)

请求期限和模型调用尝试范围。

<details>
<summary>查看原文（67行）</summary>

```text
            // deployment policy from the loader config.
            const effectiveTimeoutMs = request.moveTimeoutMs ?? resolved.moveTimeoutMs
            const effectiveMaxTokens = request.maxMoveOutputTokens ?? resolved.maxMoveOutputTokens
            const controller = new AbortController()
            const timer = setTimeout(
              () => { controller.abort(new Error('gomoku: AI 落子超时')) },
              effectiveTimeoutMs,
            )
            try {
              const system = request.system !== undefined && request.system.trim().length > 0
                ? request.system
                : DEFAULT_SYSTEM_PROMPT
              let lastText: string | undefined
              let lastReason: string | undefined
              let lastReasoning = ''
              for (let attempt = 1; attempt <= resolved.maxMoveAttempts; attempt += 1) {
                const user = buildMoveUserMessage(request, lastText, lastReason)
                let attemptText: MoveAttemptText
                try {
                  attemptText = await streamMoveText(ctx, request, system, user, effectiveMaxTokens, controller.signal)
                } catch (error) {
                  // A transient stream failure (the connection dropped
                  // mid-response, a provider rate limit, ...) is worth one more
                  // attempt — the model never saw a completed reply, so retry
                  // without corrective feedback. The last attempt falls through
                  // to the bounded failure response below instead of a raw 400.
                  if (!isRetryableMoveFailure(error)) throw error
                  lastText = undefined
                  lastReason = error instanceof Error ? error.message : String(error)
                  // A failed stream carries no usable reasoning; drop any
                  // earlier attempt's text so the error response stays honest.
                  lastReasoning = ''
                  ctx.logger.warn('gomoku: transient AI move failure: %s', lastReason)
                  if (attempt < resolved.maxMoveAttempts) continue
                  break
                }
                const text = attemptText.text
                lastReasoning = attemptText.reasoning
                const reply = parseMoveReply(text)
                if (reply.kind === 'move') {
                  if (!isLegalMove(request.board, reply.row, reply.col)) {
                    lastText = text
                    lastReason = `目标交叉点 [${reply.row}, ${reply.col}] 已被占用或越界`
                    continue
                  }
                  writeJson(200, { move: { row: reply.row, col: reply.col }, reasoning: lastReasoning })
                  return
                }
                if (reply.kind === 'draw') {
                  writeJson(200, { draw: true, reasoning: lastReasoning })
                  return
                }
                if (reply.kind === 'error') {
                  writeJson(200, { error: `AI 报告：${reply.message}`, reasoning: lastReasoning })
                  return
                }
                lastText = text
                lastReason = attemptText.truncated
                  ? 'AI 回复被截断（超过最大输出长度），可能未输出完整的 JSON'
                  : reply.reason
              }
              writeJson(200, {
                error: `AI 连续 ${resolved.maxMoveAttempts} 次未能完成落子（最后原因：${lastReason ?? '未知'}）`,
                reasoning: lastReasoning,
              })
            } finally {
              clearTimeout(timer)
```

</details>

**依据 5 · 源码核查**：[src/client/store.ts:425-471](https://github.com/omdsh-dev/dsh-gomoku/blob/26fdf6e99c95447f250ab51478fbc694b6024e8d/src/client/store.ts#L425-L471)

人工核对和棋与退场的必要性。

<details>
<summary>查看原文（47行）</summary>

```text
function applyAiReply(reply: MoveResponse, turn: Cell, gen: number, attempt: number): void {
  const { game, settings } = snapshot
  // `thinking` guards stale replies landing after an interruption (the seq
  // guard above already filtered superseded requests).
  if (game.turn !== turn || !game.thinking) return
  if (reply.move !== undefined) {
    const next = placed(game, reply.move.row, reply.move.col)
    if (next !== null) {
      const withLog: GameState = {
        ...next,
        // placed() spreads the in-flight game (thinking still true); the
        // move has now settled, so the flag must drop before commit or the
        // board stays locked on "AI 思考中".
        thinking: false,
        log: [...next.log, {
          n: next.moveCount,
          side: sideOf(turn),
          move: `${reply.move.row},${reply.move.col}`,
          reasoning: reply.reasoning ?? '',
        }],
      }
      commitGame(withLog)
      if (!gameOver(withLog) && isAiTurn(settings.mode, withLog.turn)) {
        window.setTimeout(() => { if (gen === generation) scheduleAi() }, 350)
      }
      return
    }
    // The node half only checks board legality; the client-side house rules
    // (the tengen opening) can still reject a reply, so retry within the
    // attempt budget before failing the move. Clear the thinking flag first
    // so the re-entrant scheduleAi can pass its own in-flight guard.
    if (attempt < MAX_AI_ATTEMPTS) {
      commitGame({ ...game, thinking: false })
      window.setTimeout(() => { if (gen === generation) scheduleAi(attempt + 1) }, 200)
      return
    }
  }
  if (reply.draw === true) {
    commitGame({ ...game, thinking: false, draw: true })
    return
  }
  const error = reply.error ?? 'unknown error'
  commitGame({
    ...game,
    thinking: false,
    log: [...game.log, { n: game.moveCount + 1, side: sideOf(turn), move: null, reasoning: reply.reasoning ?? '', error }],
  })
```

</details>

#### 缺口

- 模型棋力、用户价值、费用、延迟和凭据运行行为均未实测
  **影响**：影响对效果、安全边界或采用建议的判断
  **进一步探讨**：在隔离 DSH profile 按问题描述进行针对性验证

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
