# dsh-agy

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[5a03ffb](https://github.com/chaos-03x/dsh-agy/tree/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9)

<!-- BEGIN META -->
[![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chaos-03x/dsh-agy) [![npm 30d 1,799](https://img.shields.io/static/v1?label=npm+30d&message=1%2C799&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agy) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agy)
<!-- END META -->

> **功能**：为 DSH 接入 Google Antigravity 模型服务，提供 OAuth、账号池、额度与用量管理及独立 CLI。

> **亮点**：可核查的贡献是将OAuth账号池、模型请求适配、流式交付边界和宿主错误语义接到DSH，并以同一runtime连接管理面与调用面。成熟OAuth/加密和外部模型能力不应算作插件原创；自动轮换指后续账号选择，不等于所有请求内部无缝恢复。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：最关键的限制是本地可见调用不等于远端执行事实。端点fallback与内部重采样使一个DSH调用可能包含多次请求，取消或未交付文本不证明服务端未处理；配额缓存和有限缓冲账本也不提供实时账单。账号凭据、接口兼容和恢复判断仍由用户承担，当前不能承诺稳定、省额度或安全重试。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 相比手工接入服务，插件贡献和真实类型是什么？](#detail-section-11)
  - [Q02 · OAuth与本地凭据管理如何处理账号，导出是否撤销授权？](#detail-section-12)
  - [Q03 · 多账号选择、429与流式重试怎样影响同一请求？](#detail-section-13)
  - [Q04 · 配额/用量/界面提供什么信息，兼容与运维成本在哪里？](#detail-section-14)
  - [Q05 · 当前何种用户可采用，能否从未知结果推导可证伪改进？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有可访问Antigravity账号的DSH技术用户，把模型请求、OAuth账号与额度状态接入同一宿主界面，另可用CLI管理账号。[Q01](#research-q01)

参照手动管理访问令牌、编写请求转换及失败后人工选择账号，或留在原服务客户端。插件新增宿主接线与池状态组织，外部模型推理和账号配额不由插件创造；没有同条件任务对照证明总成本或可靠性更好。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| agy模型适配器 | 通过DSH llm接口发起模型请求 | 外部账号和服务必须可用，未验收当前环境 |
| OAuth授权与刷新 | 维护账号访问令牌 | 回调匹配不代表整体安全审计；本地保存长期秘密 |
| 账号池选择 | 按会话、族额度与冷却选择账号 | 不增加服务权限或原有配额，宿主重试影响后续调用 |
| 流式错误处理 | 缓冲未交付内容并区分重试边界 | 没有文本不证明服务端未处理，部分交付失败终止 |
| 账号存储 | 加密refresh与proxy、持锁更新文件 | 主密钥同用户可读取，不能视为OS隔离 |
| 凭据导入/导出 | 在管理面和CLI迁移账号 | blob只是编码，按秘密保管；删除不撤销远端授权 |
| 额度与用量管理 | 显示窗口、请求/token和故障信息 | 缓存与估计，统计有限缓冲，不是完整账单 |
| 设置与徽章 | 在DSH内配置账号/模型/预算等 | 依赖宿主设置/RPC，徽章按偏好启用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH llm、Cordis及兼容dsh-llm接口 | 宿主接入必需 | 注册adapter及处理错误/流 | peer声明不等于所有宿主版本已验收 |
| Node及构建/安装制品 | 运行必需 | 执行provider、CLI及管理面 | package声明>=20.18.1，README源码开发要求>=22，需按目标环境核对 |
| 当前可授权且能访问模型的账号 | 生成必需 | OAuth、刷新和外部服务请求 | 无凭据、认证挑战或额度耗尽时停止，不能以池替代资格 |
| DSH凭据文档与可写本地数据目录 | 账号保存必需 | 主密钥、加密refresh/proxy、统计与配置 | 密钥丢失/权限错误需先查，不能用空库掩盖 |
| 账号代理或环境网络路径 | 按用户网络条件 | 数据面与控制面访问 | 失败先定位路由，不能把TCP探测等同模型成功 |
| 宿主连接/设置/附件服务 | 相应界面/多模态操作必需 | 管理RPC与附件解析 | 缺服务会降级或拒绝特定功能，不能外推文本兼容 |

本轮不验证当前Google服务资格、访问条款、价格或可用性；只据固定源码说明所需条件。[Q02](#research-q02) [Q04](#research-q04)

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对宿主/制品及账号可用条件 | 不以安装/目录出现代替实际调用 |
| 授权 | 用户发起OAuth，经已发起state与verifier交换并保存账号 | 失败先检查授权状态，blob始终按秘密处理 |
| 请求 | 宿主调用agy，适配器解析附件、选账号并发送 | 流与错误按真实交付边界返回 |
| 失败 | 用户核对是否部分输出/远端结果未知及账号冷却 | 不盲目无限重放，回服务原入口确认账号状态 |
| 退出 | 用户移除本地账号与插件，并另行撤销远端授权 | 本地删除不等于Google侧令牌已失效 |

当前建议观察，以上是后续验收路径而非本轮已运行步骤。[Q05](#research-q05)

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主/构建与账号测试请求；费用未知 | 授权、密钥保管、网络和兼容核对；耗时未知 | 不将OAuth登录等同取得全部模型权限 |
| 持续 | 模型、配额查询、健康探测和本地记录；用量未知 | 处理额度/认证挑战、协议变化和升级 | force刷新可增加控制面请求，缓存不是免费额度 |
| 失败恢复 | 端点fallback/重采样可能增加调用与计算；金额未知 | 辨别部分输出和结果未知、查询账号并停止错误重发 | requestId不构成远端幂等证据 |
| 退出/迁移 | 备份/导出秘密的保管空间 | 分别清理本地与撤销远端授权 | blob是编码数据，失窃后不能只删本地文件 |

没有全尝试费用和合格任务数，不计算单位成本或宣称便宜。[Q03](#research-q03) [Q04](#research-q04)

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 宿主模型接入 | adapter注册与共享runtime注入可追溯 | 当前制品/宿主/账号是否可完成真实任务 |
| 账号选择 | 会话pin、族配额、冷却和并发占用参与筛选 | 真实可用率及是否比人工切换减少总负担 |
| 流式恢复边界 | 缓冲、首次文本交付与终止错误分支明确 | 远端取消、计费和重复执行事实 |
| 配额/用量展示 | 分类刷新结果、burn估计及缓冲账本存在 | 实时额度与账单一致性，故障期间记录完整性 |

机制判断不升级为服务可用或同条件收益结果。[Q01](#research-q01) [Q03](#research-q03)

> **思考**：最关键的限制是本地可见调用不等于远端执行事实。端点fallback与内部重采样使一个DSH调用可能包含多次请求，取消或未交付文本不证明服务端未处理；配额缓存和有限缓冲账本也不提供实时账单。账号凭据、接口兼容和恢复判断仍由用户承担，当前不能承诺稳定、省额度或安全重试。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：可核查的贡献是将OAuth账号池、模型请求适配、流式交付边界和宿主错误语义接到DSH，并以同一runtime连接管理面与调用面。成熟OAuth/加密和外部模型能力不应算作插件原创；自动轮换指后续账号选择，不等于所有请求内部无缝恢复。[Q01](#research-q01) [Q03](#research-q03)

可以借鉴按“内容是否已交给消费者”选择重试的边界，以及在async generator finally释放in-flight占用、丢弃尝试不提交签名的设计。移植必须连同宿主错误语义与工具执行边界核对，不能把没有输出等同远端没有副作用。账号mutate持锁重读与统计soft-fail分层保护热路径；但有限缓冲会丢计数，不可直接用作完整计费审计。指纹字段与实际请求头要逐项追踪，不按名称推断所有身份参数生效。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

最关键的限制是本地可见调用不等于远端执行事实。端点fallback与内部重采样使一个DSH调用可能包含多次请求，取消或未交付文本不证明服务端未处理；配额缓存和有限缓冲账本也不提供实时账单。账号凭据、接口兼容和恢复判断仍由用户承担，当前不能承诺稳定、省额度或安全重试。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

当前先观察。已有账号的技术用户若另行验证，应使用专用账号和非敏感短任务，逐项确认授权、模型目录、输出与错误提示；保留凭据和导出秘密的安全边界。出现认证挑战、长期额度阻塞或部分输出后断流时，停止自动重放，回原服务检查账号和任务结果。退出需本地移除和远端撤销分别完成。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持模型适配、凭据管理、账号筛选与流式错误处理机制；未登录、调用外部服务、构建或验收目标宿主。建议观察；分层尝试记录为未验证改进假设。

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/plugin-common.ts、README.md、package.json、tsdown.config.ts、src/oauth/authorize.ts、src/web/management.ts、src/oauth/exchange.ts、src/store/keyring.ts、src/store/accounts.ts、src/oauth/blob.ts、src/session.ts、src/adapter/adapter.ts、src/oauth/constants.ts、src/client/index.ts、src/stats.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：inventory覆盖固定提交组件树；人工定向核查provider入口、构建配置、共享runtime、OAuth/本地存储、账号筛选/失败报告、关键流式重试、配额与统计及UI注册。未审计全部多模态转换、协议解析细节或管理RPC安全边界；未构建、登录、执行目标及其测试，不声称外部服务实际可用。
- 下一步：后续可先在受控模拟流中验证错误/交付/未知三类状态和分层尝试记录，再在另行允许的专用账号任务中核对可取得的远端记录。观察错误重发、部分输出识别及记录开销；模拟不证明远端幂等。本轮未执行。

**分析版本**

- **仓库**：[chaos-03x/dsh-agy](https://github.com/chaos-03x/dsh-agy)
- **版本号**：0.4.6（[固定提交 5a03ffb](https://github.com/chaos-03x/dsh-agy/tree/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究无凭据/正文的分层尝试记录，关联逻辑调用、sendAttempt、各端点尝试及已交付/结果未知状态。以端点拒绝、发出后断连、工具语法失败和首次文本后断流对照操作判断与错误重发；若仍把未知写成未执行或记录负担抵消改善，则否定该方向。它不是已有能力，也不能提供远端幂等保证。[Q05](#research-q05)

后续可先在受控模拟流中验证错误/交付/未知三类状态和分层尝试记录，再在另行允许的专用账号任务中核对可取得的远端记录。观察错误重发、部分输出识别及记录开销；模拟不证明远端幂等。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 1297 | — | — | 27904 |
| .js | source | 1 | 6 | 4 | 1 | — |
| .mjs | source | 2 | 111 | 62 | 42 | — |
| .ts | source | 61 | 20408 | 12883 | 6192 | — |
| .mts | source | 15 | 2405 | 1766 | 464 | — |
| .ts | test | 25 | 13092 | 10359 | 1644 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/chaos-03x/dsh-agy/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：这个Google Antigravity接入适配器怎样向DSH提供模型调用，在账号/额度/流式输出变化时保留何种正确性与凭据边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比手工接入服务，插件贡献和真实类型是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

dsh-agy是DSH模型供应商适配插件，另有独立账号管理CLI和宿主设置界面，不是Agent/Skill定义包。目标用户是已有可访问Antigravity账号、想在DSH统一模型接口中使用该服务并管理账号状态的人。合格结果是模型请求和流式输出正确进入DSH，账号/模型选择可解释，失败不会被误作已完成回答；安装成功、账号列表出现或配额徽章可见都不是这个结果。

入口apply注入llm，构造共享runtime后注册agy adapter；plugin-common把账号会话、失败报告、请求占用计数、动态预算和用量记录接到适配器。它承担OAuth/刷新、请求翻译、流式解析及错误映射，模型推理与额度由外部服务提供。相对手工管理令牌、自己编写服务请求转换并逐次换账号，贡献是将这些状态管理和宿主错误语义组合到同一调用路径；并不证明外部模型变强或总成本变低。

package入口指向lib构建产物，tsdown配置把src入口构建到对应位置，当前研究针对固定源码及构建配置，未构建或核验发布制品。README中“自动429轮换”等应结合实际代码理解：池状态会更新，是否再次调用取决于适配器错误和宿主重试规则，不是任意失败都内部自动换号成功。只需要单一稳定供应商或不愿托管OAuth长期凭据的用户，原服务入口或已有受支持的接入方式可能更轻。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:12-25](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/index.ts#L12-L25)

apply经共享runtime注册agy模型适配器，确认为provider插件入口。

<details>
<summary>查看原文（14行）</summary>

```text
export const name = 'dsh-agy'

export const inject = ['llm']

export function apply(ctx: Context): void {
  if (isAgyDisabled()) {
    ctx.logger.warn('[dsh-agy] disabled by DSH_AGY_DISABLE=1 — skipping registration')
    return
  }
  ctx.effect(async () => {
    const { adapter } = await createAgyRuntime(ctx)
    const registration = ctx.llm.registerAdapter([AGY_PROVIDER], adapter)
    return () => registration()
  })
```

</details>

**依据 2 · 源码核查**：[src/plugin-common.ts:187-210](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/plugin-common.ts#L187-L210)

会话/失败/请求计数/预算/用量实际注入AgyAdapter，不仅是README能力名。

<details>
<summary>查看原文（24行）</summary>

```text
  const sessions = new AgySessionManager({
    store,
    recordUsage: (record) => { stats.record(record) },
    onRotate: () => { invalidateModelCache() },
  })
  // Optional background health probe (DSH_AGY_HEALTH_INTERVAL_MS), off by default.
  const healthIntervalMs = Number(process.env.DSH_AGY_HEALTH_INTERVAL_MS ?? 0)
  if (Number.isFinite(healthIntervalMs) && healthIntervalMs > 0) {
    sessions.startHealthProbe(healthIntervalMs)
  }
  const adapter = new AgyAdapter({
    getSession: (model, conversationKey) => sessions.getSession(model, undefined, conversationKey),
    reportFailure: (kind, session, info) => sessions.reportFailure(kind, session, info),
    markSuccess: (session) => sessions.markSuccess(session),
    resolveAttachments: () => ctx.get('attachments') as AgyAttachmentStore | undefined,
    noteRequestStarted: (account) => sessions.noteRequestStarted(account),
    noteRequestSettled: (account) => sessions.noteRequestSettled(account),
    modelVisibility,
    thinkingBudgetFor: (level) => thinkingBudget.budgetFor(level),
    claudeBudgetFor: () => thinkingBudget.claudeBudget(),
    tieredBudgetFor: () => thinkingBudget.tieredBudget(),
    maxInlineBytes: () => multimodalConfig.maxInlineBytes(),
    recordUsage: (record) => { stats.record({ ...record, source: 'chat' }) },
  })
```

</details>

**依据 3 · 作者声明**：[README.md:6-39](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/README.md#L6-L39)

作者声明OAuth、账号池、UI和用量场景，不作为效果及可用性验证。

<details>
<summary>查看原文（34行）</summary>

```text
Google Antigravity (agy) access for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness):
OAuth authentication, a multi-account pool with automatic 429 rotation, device
fingerprinting, and both CLI and web management.

> 中文文档：[docs/README_zh.md](docs/README_zh.md)

## Features

- **OAuth login**: one-click sign-in via browser OAuth callback, with headless
  paste-URL mode and a remote paste-credential blob channel.
- **Two management surfaces**: web and CLI, either one works, core features are
  the same.
- **Multi-account pool**: encrypted account store, usage-aware account
  selection (family-scoped quotas, OMP-aligned ranking), automatic rotation on
  rate limits, per-account cooldown to the real reset time, per-account device
  fingerprints.
- **Inline Settings UI**: an Antigravity section inside DSH Settings with five
  tabs — accounts (login, activation, grouped 5-hour/weekly quota windows, test
  calls, fingerprint and proxy management), models (per-model visibility), config
  (thinking budgets, multimodal inline limit), usage (cumulative token and request
  statistics), and credentials (import/export).
  No separate page: the surface only exists where DSH Settings does.
- **Quota badge in the session header**: the tightest of the active account's
  tracked windows (5-hour vs weekly) as a single figure, with the per-window
  breakdown and reset walls on hover. It reads the same grouped quota windows the
  Settings section shows, so the header and the panel cannot disagree.
- **Model visibility toggles**: hide individual models from the DSH model
  selector. Blacklist semantics — only models you switch off are hidden, so
  models the server adds later stay visible.
- **Usage statistics**: input / output / cache-read / cache-write tokens,
  request counts, failures, rate limits, rotations, latency and
  time-to-first-token, aggregated by account and by model. Includes calls that
  never pass through DSH (CLI, verification, test calls), which no
  session-based statistic can see.
```

</details>

**依据 4 · 源码核查**：[tsdown.config.ts:1-22](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/tsdown.config.ts#L1-L22)

src入口构建到lib，说明源码与包入口关系，不证明构建已运行。

<details>
<summary>查看原文（22行）</summary>

```text
import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/cli/index.ts', 'src/web/plugin.ts'],
    outDir: 'lib',
    format: ['esm'],
    platform: 'node',
    target: 'es2024',
    dts: true,
    clean: true,
  },
  {
    entry: { client: 'src/client/index.ts' },
    outDir: 'lib',
    format: ['cjs'],
    platform: 'browser',
    target: 'es2024',
    dts: false,
    clean: false,
    // `react` and the DSH platform modules are shared into the frozen module
    // table by the shell (packages/client/web/src/platform.ts PLATFORM_MODULES):
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · OAuth与本地凭据管理如何处理账号，导出是否撤销授权？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

授权流程构造Google OAuth地址和PKCE challenge，state中携带verifier与project元数据；web端只接受pendingAuth中发起过的state，收到回调后先消费一次性state，再把预期verifier传给exchange核对，然后交换令牌并更新本地账号。可以确认流程有发起/回调匹配，不能仅凭使用PKCE就认定整体账号体系通过安全审计；本轮未登录或测试回调，也不判断远端当前访问资格。

本地账号store使用codec加密refresh与proxy字段，以临时文件加rename保存，mutate在跨进程锁内重新读取再修改；codec为AES-256-GCM，主密钥保存在DSH凭据文档的AGY_MASTER_KEY。POSIX会拒绝不是0600的凭据文件，Windows路径跳过该mode检查。加密在静态存储上形成一道防护，不是抵抗同用户进程：能读密钥和账号文件的进程仍可解密，运行时也必须有明文访问令牌。本轮未读取任何用户账号文件或凭据。

导出的credential blob只是带版本/provider标签的base64url JSON，里面可以含access/refresh token；可粘贴不是加密或脱敏，必须当作账号秘密保存。README明确删除本地数据不撤销Google侧令牌，退出还要用户在账号侧撤销授权。CLI/Web共享的数据位置方便管理，也增加备份和导出泄露后的处理责任；不能把logout或卸载等同于远端授权已失效。

#### 证据与依据

**依据 1 · 源码核查**：[src/oauth/authorize.ts:25-44](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/oauth/authorize.ts#L25-L44)

授权地址使用S256 challenge及state，支持发起流程描述。

<details>
<summary>查看原文（20行）</summary>

```text
export async function authorizeAntigravity(
  redirectUri: string,
  projectId = '',
): Promise<AntigravityAuthorization> {
  const { verifier, challenge } = generatePkcePair()

  const url = new URL(OAUTH_AUTHORIZE_URL)
  const { clientId } = resolveAgyClientCredentials()
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('scope', AGY_SCOPES.join(' '))
  url.searchParams.set('code_challenge', challenge)
  url.searchParams.set('code_challenge_method', 'S256')
  const state = encodeState({ verifier, projectId: projectId || '' })
  url.searchParams.set('state', state)
  url.searchParams.set('access_type', 'offline')
  url.searchParams.set('prompt', 'consent')

  return { url: url.toString(), verifier, projectId: projectId || '', state }
```

</details>

**依据 2 · 源码核查**：[src/web/management.ts:682-705](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/web/management.ts#L682-L705)

回调查询pending state、一次性消费并传expected.verifier，再更新账号。

<details>
<summary>查看原文（24行）</summary>

```text
    async handleCallback(params) {
      const code = params.get('code')
      const state = params.get('state')
      if (!code || !state) return { ok: false, error: 'Missing code or state parameter' }
      const expected = pendingAuth.get(state)
      if (expected === undefined) {
        return { ok: false, error: 'Unknown or expired authorization — please start a new login.' }
      }
      // One-time use: consume the issued state regardless of the exchange result.
      pendingAuth.delete(state)
      const redirectUri = `${baseUrl()}/agy/oauth-callback`
      const result = await exchangeAntigravity(code, state, redirectUri, expected.verifier)
      if (result.type === 'failed') return { ok: false, error: result.error }
      await upsertImportedAccount(store, {
        accessToken: result.access,
        refreshToken: result.refresh.split('|')[0]!,
        tokenType: 'Bearer',
        expiresAt: new Date(result.expires).toISOString(),
        authMethod: 'oauth',
        email: result.email ?? null,
        projectId: result.projectId || null,
        clientId: result.clientId || null,
      }, { overwriteExisting: true })
      return { ok: true, email: result.email ?? null }
```

</details>

**依据 3 · 源码核查**：[src/oauth/exchange.ts:240-256](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/oauth/exchange.ts#L240-L256)

交换前核对verifier，不能据此推断未审计的全部安全条件。

<details>
<summary>查看原文（17行）</summary>

```text
export async function exchangeAntigravity(
  code: string,
  state: string,
  redirectUri: string,
  expectedVerifier?: string,
  routing: AccountRouting = {},
): Promise<TokenExchangeResult> {
  try {
    const { verifier, projectId } = decodeState<OAuthState>(state)
    if (!verifier) {
      return { type: 'failed', error: 'Missing PKCE verifier in state' }
    }
    // The caller issued this authorization URL (the CLI holds the verifier;
    // the web entry stores it per state). A state from a different login — or
    // one fabricated by an attacker — must not be exchangeable into the store.
    if (expectedVerifier && verifier !== expectedVerifier) {
      return { type: 'failed', error: 'State does not match the issued authorization' }
```

</details>

**依据 4 · 源码核查**：[src/store/keyring.ts:1-54](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/store/keyring.ts#L1-L54)

密钥位置及AES-GCM codec是静态加密机制，未提供OS用户隔离。

<details>
<summary>查看原文（54行）</summary>

```text
/**
 * Master-key management and AES-256-GCM secret codec for the account store.
 *
 * The master key lives in the DSH credentials document (`~/.dsh/.credentials.yaml`,
 * 0600) under `AGY_MASTER_KEY` so both the in-harness plugin (via
 * `ctx.credentials`) and the standalone `dsh-agy` CLI (direct file read) can
 * encrypt and decrypt the same account store.
 */

import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'
import { readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { existsSync, mkdirSync, statSync } from 'node:fs'
import { Document, isMap, isScalar, parseDocument, type YAMLMap } from 'yaml'

export const MASTER_KEY_REF = 'AGY_MASTER_KEY'

/** Encrypt/decrypt secrets at rest. */
export interface SecretCodec {
  encrypt(plaintext: string): string
  decrypt(payload: string): string
}

const ENC_PREFIX = 'enc:v1:'

/** AES-256-GCM codec; ciphertext format `enc:v1:<iv-b64>:<tag-b64>:<data-b64>`. */
export function createAesGcmCodec(key: Buffer): SecretCodec {
  if (key.length !== 32) {
    throw new Error(`createAesGcmCodec: master key must be 32 bytes, got ${key.length}`)
  }
  return {
    encrypt(plaintext: string): string {
      const iv = randomBytes(12)
      const cipher = createCipheriv('aes-256-gcm', key, iv)
      const data = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
      const tag = cipher.getAuthTag()
      return `${ENC_PREFIX}${iv.toString('base64url')}:${tag.toString('base64url')}:${data.toString('base64url')}`
    },
    decrypt(payload: string): string {
      if (!payload.startsWith(ENC_PREFIX)) {
        throw new Error('decrypt: payload is not in encrypted format')
      }
      const [, , ivB64 = '', tagB64 = '', dataB64 = ''] = payload.split(':')
      const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(ivB64, 'base64url'))
      decipher.setAuthTag(Buffer.from(tagB64, 'base64url'))
      const plain = Buffer.concat([decipher.update(Buffer.from(dataB64, 'base64url')), decipher.final()])
      return plain.toString('utf8')
    },
  }
}

/** Derive a 32-byte key from an arbitrary master-key string (SHA-256). */
export function deriveKey(masterKey: string): Buffer {
  return createHash('sha256').update(masterKey, 'utf8').digest()
```

</details>

**依据 5 · 源码核查**：[src/store/keyring.ts:175-200](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/store/keyring.ts#L175-L200)

POSIX权限检查与Windows跳过规则，限定文件权限保证。

<details>
<summary>查看原文（26行）</summary>

```text
/**
 * POSIX owner-only enforcement. Windows mode bits never report 0600 (and
 * chmod is a no-op there), so the check is skipped on win32; the encrypted
 * account file and credentials document remain the only defense-in-depth
 * layer on that platform.
 */
export function assertOwnerOnly(file: string): void {
  if (process.platform === 'win32') return
  const mode = statSync(file).mode & 0o777
  if (mode !== 0o600) {
    throw new Error(
      `dsh-agy: ${file} is readable beyond its owner (mode ${mode.toString(8)}); ` +
        'run "chmod 600" before starting again',
    )
  }
}

/**
 * Load the master key from the DSH credentials document. Returns undefined when
 * the document or the reference is absent.
 */
export function loadMasterKey(dshHome: string): string | undefined {
  const file = join(dshHome, '.credentials.yaml')
  if (!existsSync(file)) return undefined
  assertOwnerOnly(file)
  return readCredentialsDocument(file).get(MASTER_KEY_REF)
```

</details>

**依据 6 · 源码核查**：[src/store/accounts.ts:83-92](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/store/accounts.ts#L83-L92)

实际加密refresh与proxy字段，其他账号元数据不因此都被加密。

<details>
<summary>查看原文（10行）</summary>

```text
/** Encrypt one account's refresh/proxy fields (plaintext stays plaintext if no codec change). */
function encryptAccount(account: ManagedAccount, codec: SecretCodec): ManagedAccount {
  let out = account
  if (!isEncrypted(out.refresh)) {
    out = { ...out, refresh: codec.encrypt(out.refresh) }
  }
  if (out.proxy && !isEncrypted(out.proxy)) {
    out = { ...out, proxy: codec.encrypt(out.proxy) }
  }
  return out
```

</details>

**依据 7 · 源码核查**：[src/store/accounts.ts:269-275](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/store/accounts.ts#L269-L275)

mutate持锁重读后更新，降低陈旧状态覆盖。

```text
  async mutate<T>(fn: (storage: AccountStorageV4) => T | Promise<T>): Promise<T> {
    this.ensureFile()
    return this.lock.withLock(this.file, async () => {
      const { storage } = this.readAndMigrateUnlocked()
      const result = await fn(storage)
      this.writeUnlocked(storage)
      return result
```

**依据 8 · 源码核查**：[src/oauth/blob.ts:35-45](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/oauth/blob.ts#L35-L45)

blob为base64url JSON，不是加密导出。

<details>
<summary>查看原文（11行）</summary>

```text
/** Encode a provider + raw OAuth token response into a single-line blob. */
export function encodeCredentialBlob(provider: string, tokens: CredentialBlobTokens): string {
  if (!provider || !provider.trim()) {
    throw new Error('encodeCredentialBlob: a non-empty provider is required')
  }
  if (!tokens || typeof tokens !== 'object' || !tokens.access_token) {
    throw new Error('encodeCredentialBlob: tokens with an access_token are required')
  }
  const payload = { v: CREDENTIAL_BLOB_VERSION, provider: provider.trim(), tokens }
  const json = JSON.stringify(payload)
  return `${CREDENTIAL_BLOB_PREFIX}${Buffer.from(json, 'utf8').toString('base64url')}`
```

</details>

**依据 9 · 作者声明**：[README.md:136-156](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/README.md#L136-L156)

作者明确本地删除和远端撤销不同，退出需分别处理。

<details>
<summary>查看原文（21行）</summary>

````text
## Uninstall

```sh
# 1. Remove the DSH plugin from a profile
dsh plugin --profile web remove dsh-agy

# 2. Uninstall the CLI
npm uninstall -g dsh-agy

# 3. Optional: delete local account data (the whole agy data folder)
dsh-agy logout              # remove accounts first (or skip)
rm -rf ~/.dsh/agy           # accounts, usage stats, model visibility, thinking budgets, recent ring
# remove only the AGY_MASTER_KEY line from ~/.dsh/.credentials.yaml — keep other keys!
# (an upgrade from ≤0.4 may leave legacy files in ~/.dsh itself: rm -f ~/.dsh/agy-*.json)

# 4. Optional: revoke the Google-side authorization
#    Google account security → Third-party access → revoke "Antigravity"
```

Deleting local files does **not** revoke Google-side tokens; the refresh token stays
valid until it expires or you revoke it in your Google account security settings.
````

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 多账号选择、429与流式重试怎样影响同一请求？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

请求先解析本地附件，再按模型族和会话标识选择账号；会话pin在可用时复用原账号，否则按启用、支持模型、冷却、族限流和额度状态筛选。活跃账号优先且参考in-flight计数，所有候选阻塞时分别报告临时阻塞或额度耗尽。一次streamInner选定账号后，不会在同一条已开始输出的流里任意切换账号；失败报告更新池和pin，让后续宿主重试/请求重新选择。适配器把软限流映射为RATE_LIMIT、明确额度耗尽映射终止额度错误，5xx映射SERVER，认证失败映射INVALID_CREDENTIAL；实际宿主是否重试仍依赖兼容版本的错误策略。

“一个调用一次上游请求”并不严格成立。fetchAgyFirstOk在若干端点间遇429/403/503或网络异常时继续尝试，复用同一请求init；识别到特定会话累积错误时sendAttempt最多再发一次并改变派生session generation和requestId。另有最多三次MALFORMED_FUNCTION_CALL内部重采样：在没有text-delta交给DSH前缓存非文本chunk与签名，丢弃不完整尝试后重发；首次文本出现就交付缓存并进入直接流式输出，正常纯工具调用则在流结束才交付缓存。已交付后的普通流失败返回终止UPSTREAM，避免宿主自动重放部分内容；未交付的idle超时则可返回TIMEOUT。

这些是消费者输出边界，不是远端执行或计费的事务边界。网络异常、超时、取消或没有用户文本不证明远端从未接受请求；requestId存在也不证明上游幂等去重。端点尝试与上层重试会增加实际请求/计算，不能把本地一条usage记录直接当每个网络尝试都精确计数。取消传fetch/parser信号并尝试body.cancel，只证明本端停止路径，不能证明服务端推理或计费停止。

指纹也须按接线而非名称判断。reportFailure的限流分支可能创建/更新fingerprint，生成请求头只明确发送User-Agent和X-Goog-Api-Client等字段，不能将存储中deviceId的存在解释成全部身份字段已发送或访问必然通过。其长期有效性和服务端反应未知，不能拿自动轮换替代账号资格或服务可用性验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/session.ts:813-895](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/session.ts#L813-L895)

pin、活跃账号和族额度/冷却筛选，以及全部阻塞分类的实际选择路径。

<details>
<summary>查看原文（83行）</summary>

```text
    // Conversation affinity: reuse the account this conversation is already
    // pinned to while it is fresh and healthy, so one conversation stays on one
    // account. A quota-exhausted family or a cooldown breaks the pin and
    // re-ranks, mirroring OMP's pinned-until-unusable: the pin holds until the
    // account is actually spent (a measured zero, not the soft-drain threshold
    // `isFamilyDrained` applies when ranking), so the pin and the active-account
    // preference below agree on when to let go.
    const pinnedKey = this.affinityFor(conversationKey, now)
    if (pinnedKey !== null) {
      const lastIndex = storage.accounts.findIndex((a) => this.accountKey(a) === pinnedKey)
      if (lastIndex !== -1) {
        const last = storage.accounts[lastIndex]!
        if (
          last.enabled !== false &&
          isModelSupportedByAccount(last, model) &&
          !isCoolingDown(last, now) &&
          !isFamilyRateLimited(last, familyKey, now) &&
          !isFamilyQuotaExhausted(last, family, now)
        ) {
          return { account: last, index: lastIndex }
        }
      }
    }
    const eligible = storage.accounts
      .map((account, index) => ({ account, index }))
      .filter(({ account }) => account.enabled !== false && isModelSupportedByAccount(account, model))
    if (eligible.length === 0) return undefined

    // Prioritize the active account as long as it is enabled, supports the model,
    // not cooling down, not family rate-limited, and not quota-exhausted.
    const active = storage.accounts[storage.activeIndex]
    const isActiveUsable = (acc: ManagedAccount | undefined): acc is ManagedAccount =>
      acc !== undefined
      && acc.enabled !== false
      && isModelSupportedByAccount(acc, model)
      && !isCoolingDown(acc, now)
      && !isFamilyRateLimited(acc, familyKey, now)
      && !isFamilyQuotaExhausted(acc, family, now)

    if (isActiveUsable(active) && this.inFlightCount(this.accountKey(active), now) < MAX_IN_FLIGHT_PER_ACCOUNT) {
      return { account: active, index: storage.activeIndex }
    }

    const ranked = rankPoolCandidates(eligible, model, now, storage.activeIndex)
    // Prefer an account with in-flight headroom so concurrent conversations
    // spread across the pool; fall back to plain ranking when every candidate is
    // saturated (see `inFlight` for why this is a preference, not a gate).
    const picked =
      ranked.find((candidate) =>
        candidate.blockedUntil === null
        && this.inFlightCount(this.accountKey(candidate.account), now) < MAX_IN_FLIGHT_PER_ACCOUNT)
      ?? ranked.find((candidate) => candidate.blockedUntil === null)
    if (!picked) {
      const quotaExhausted = (account: ManagedAccount): boolean => {
        if (account.cooldownReason === 'quota-exhausted' && (account.coolingDownUntil ?? 0) > now) return true
        const quota = familyQuotaFor(account, family, now)
        if (!quota) return false
        // BOTH windows, matching `rankPoolCandidates`, which blocks on a spent week
        // as well as on a spent 5-hour bucket. Reading only `remainingFraction`
        // here classified a weekly-decided block as retryable, and that path ends
        // at `RATE_LIMIT` + a ~5-day `providerRetryAfterMs`, which DSH's 10s retry
        // cap turns into giving up on the turn — a quota condition reported to the
        // user as a rate limit.
        const spent = (fraction: number | undefined, resetTime: string | undefined): boolean => {
          if (typeof fraction !== 'number' || fraction > 0 || !resetTime) return false
          const resetAt = Date.parse(resetTime)
          return !Number.isNaN(resetAt) && resetAt > now
        }
        return spent(quota.remainingFraction, quota.resetTime)
          || spent(quota.weeklyFraction, quota.weeklyResetTime)
      }
      const retryable = ranked.filter((candidate) => !quotaExhausted(candidate.account))
      const blocked = retryable.length > 0 ? retryable : ranked
      const blockedUntil = Math.min(...blocked.map((candidate) => candidate.blockedUntil ?? now))
      throw new AgyPoolBlockedError(retryable.length > 0 ? 'retryable' : 'quota-exhausted', blockedUntil)
    }
    if (picked.index !== storage.activeIndex) {
      storage.activeIndex = picked.index
      await this.store.mutate((s) => {
        s.activeIndex = picked.index
      })
    }
    return { account: picked.account, index: picked.index }
```

</details>

**依据 2 · 源码核查**：[src/adapter/adapter.ts:416-466](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/adapter/adapter.ts#L416-L466)

选定session和账号后进入一次请求流，并用finally释放占用。

<details>
<summary>查看原文（51行）</summary>

```text
    const conversationKey = options.sessionId === undefined ? undefined : String(options.sessionId)
    let session: AgyAccountSession | undefined
    try {
      session = await this.options.getSession(options.model, conversationKey)
    } catch (error) {
      if (error instanceof AgyAuthError) {
        if (error.kind === 'transport') {
          throw new LlmError(error.message, 'TRANSPORT', { cause: error })
        }
        if (error.kind === 'rate-limit') {
          throw new LlmError(error.message, 'RATE_LIMIT', {
            requestId: ProviderRequestId(generateAntigravityRequestId()),
          })
        }
        throw new LlmError(error.message, 'INVALID_CREDENTIAL', { cause: error })
      }
      if (error instanceof AgyPoolBlockedError) {
        if (error.kind === 'quota-exhausted') {
          throw new LlmError(error.message, QUOTA_EXCEEDED_CODE)
        }
        const delta = Math.ceil(error.blockedUntil - Date.now())
        const providerRetryAfterMs = Number.isFinite(delta) && delta > 0 ? delta : 1
        throw new LlmError(error.message, 'RATE_LIMIT', {
          providerRetryAfterMs,
          requestId: ProviderRequestId(generateAntigravityRequestId()),
        })
      }
      throw error
    }
    if (!session) {
      throw new LlmError(
        'No agy account configured — run `dsh-agy login` to authenticate.',
        'NO_CREDENTIAL',
      )
    }

    const multimodalFiles = await resolveMultimodalFiles(options, { maxBytes: this.options.maxInlineBytes?.() })
    // The account is now fixed for this request; take the in-flight slot that the
    // `stream` wrapper releases (see its comment for why release lives there).
    holder.account = session.account
    this.options.noteRequestStarted?.(session.account)
    // `conversationKey` is resolved above and shared with account affinity.
    // Standalone CLI callers leave `options.sessionId` unset, so the upstream
    // session id degrades to the per-account value rather than inventing a
    // conversation.
    const conversationAccount = ledgerAccountKey(session)
    // Streaming dispatch: the account proxy MUST carry the generation request
    // (it carried only the control-plane calls before, so a proxied account
    // silently generated from the host's real IP), and the streaming
    // dispatcher drops the per-gap body timeout a reasoning pause would trip.
    const routing = { proxyUrl: session.account.proxy, streaming: true }
```

</details>

**依据 3 · 源码核查**：[src/adapter/adapter.ts:562-639](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/adapter/adapter.ts#L562-L639)

HTTP错误映射、池失败报告与宿主重试职责分离。

<details>
<summary>查看原文（78行）</summary>

```text
      if (!response.ok) {
        const classified = classifyHttpError(response.status, response.headers, bodyText)
        await this.options.reportFailure(classified.kind, session, {
          retryAfterMs: classified.retryAfterMs,
          status: response.status,
          rateLimitCategory: classified.rateLimitCategory,
          resetTime: classified.resetTime,
          model: options.model,
          verificationUrl: classified.verificationUrl,
        })
        this.recordUsage(session, options.model, {
          ok: false,
          rateLimited: classified.kind === 'rate-limit',
          reason: classified.kind,
        }, attemptStartedAt)
        if (classified.kind === 'rate-limit') {
          // soft/rate limits are retryable by the harness (RATE_LIMIT + delay);
          // daily quota exhaustion is terminal (QUOTA, 24h cooldown already set).
          if (classified.rateLimitCategory === 'quota_exhausted') {
            throw new LlmError(
              `agy daily quota exhausted (${response.status}): ${classified.message ?? ''}`,
              QUOTA_EXCEEDED_CODE,
            )
          }
          throw new LlmError(
            `agy rate-limited (${response.status}): ${classified.message ?? ''}`,
            'RATE_LIMIT',
            {
              providerRetryAfterMs: classified.retryAfterMs ?? undefined,
              requestId: ProviderRequestId(generateAntigravityRequestId()),
            },
          )
        }
        if (classified.kind === 'verification-required') {
          // Recoverable, so deliberately NOT INVALID_CREDENTIAL: the account is
          // parked for a timed window, not disabled, and the pool moves on. The
          // appeal link goes in the message because a message is the only channel
          // DSH surfaces to the user.
          //
          // Deliberately NO `providerRetryAfterMs`: the park IS the cooldown, and a
          // delay above DSH's `maxDelayMs` makes its `normal` retry mode give up
          // outright (`llm-retry`: `providerRetryAfterMs > maxDelayMs` -> `next()`),
          // turning a recoverable challenge into a failed turn. With no delay DSH
          // backs off locally and retries, and that retry lands on another account
          // because this one is already parked.
          const appeal = classified.verificationUrl ? ` Verify at: ${classified.verificationUrl}` : ''
          throw new LlmError(
            `agy account needs verification (${response.status}): ${classified.message ?? ''}${appeal}`,
            'RATE_LIMIT',
            {
              requestId: ProviderRequestId(generateAntigravityRequestId()),
            },
          )
        }
        if (classified.kind === 'auth-failure') {
          throw new LlmError(
            `agy authentication failed (${response.status}) — run \`dsh-agy login\``,
            'INVALID_CREDENTIAL',
          )
        }
        // 5xx upstream failures (e.g. 503 "No capacity available") are transient:
        // the DSH retry policy honors SERVER but treats UPSTREAM as terminal, so
        // classifying 5xx as UPSTREAM kills the turn with zero retries. Non-5xx
        // transient/request errors (404, generic 400, other 4xx) stay terminal.
        if (classified.status !== undefined && classified.status >= 500) {
          throw new LlmError(
            `agy upstream error (${response.status}): ${classified.message ?? ''}`,
            SERVER_ERROR_CODE,
            {
              providerRetryAfterMs: classified.retryAfterMs ?? undefined,
              requestId: ProviderRequestId(generateAntigravityRequestId()),
            },
          )
        }
        throw new LlmError(
          `agy upstream error (${response.status}): ${classified.message ?? ''}`,
          UPSTREAM_ERROR_CODE,
        )
```

</details>

**依据 4 · 源码核查**：[src/oauth/constants.ts:77-128](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/oauth/constants.ts#L77-L128)

端点fallback会在跳过状态/网络异常后继续，单次send不等于单次网络尝试。

<details>
<summary>查看原文（52行）</summary>

```text
 * Statuses that mean "this endpoint is not usable for this attempt"; skip to the
 * next one in the chain. 429/403 = rate/quota/entitlement wall, 503 = capacity
 * rejection (e.g. "No capacity available for model ..."). A 503 skipped here
 * still reaches the caller when every endpoint fails, where the classifier marks
 * it transient and the adapter surfaces it as a retryable SERVER error.
 */
export const AGY_ENDPOINT_SKIP_STATUSES = new Set([429, 403, 503])

/** Routing of the requests being tried (see {@link AccountRouting}). */
export type AgyFallbackOptions = Pick<AccountRouting, 'proxyUrl'>
/**
 * Try each runtime endpoint in order, skipping unusable ones (429/403/503/network).
 * Returns the first other response (2xx or a real error like 400/401); when
 * every endpoint is unusable, returns the last skipped response so the caller's
 * classifier can still produce a meaningful error (a returned 503 becomes a
 * retryable SERVER failure rather than being swallowed here).
 *
 * When every endpoint fails at the network level, the LAST error is rethrown so
 * its cause survives (a generic "all endpoints failed" hid DNS/TLS/timeout).
 */
export async function fetchAgyFirstOk(
  urlPath: string,
  init: RequestInit,
  fetchImpl: typeof fetch = proxiedFetch,
  options: AgyFallbackOptions = {},
): Promise<Response> {
  let lastSkipped: Response | null = null
  let lastNetworkError: unknown
  for (const baseEndpoint of AGY_ENDPOINT_FALLBACKS) {
    try {
      const response = await fetchImpl(`${baseEndpoint}${urlPath}`, init)
      if (!AGY_ENDPOINT_SKIP_STATUSES.has(response.status)) return response
      // Prefer keeping a 429 or 503 response from earlier production endpoints
      // rather than letting the internal autopush sandbox 403 (which always fails for
      // consumer accounts with "no license") overwrite the real rate-limit/capacity signal.
      if (!lastSkipped || (baseEndpoint !== AGY_ENDPOINT_AUTOPUSH && (response.status === 429 || response.status === 503))) {
        lastSkipped = response
      }
    } catch (error) {
      lastNetworkError = error
      // Fail-closed only while an explicit per-account proxy is in effect: the
      // request must not be retried on another endpoint or go direct.
      if (isProxyRouted(options)) {
        const { isProxyUnreachableError } = await import('../proxy.ts')
        if (isProxyUnreachableError(error)) throw error
      }
      // network error — try the next endpoint
    }
  }
  if (lastSkipped) return lastSkipped
  if (lastNetworkError !== undefined) throw lastNetworkError
  throw new Error('all agy endpoints failed')
```

</details>

**依据 5 · 源码核查**：[src/adapter/adapter.ts:482-539](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/adapter/adapter.ts#L482-L539)

识别累积错误后最多一次派生session重发；每次send生成requestId而非远端幂等证明。

<details>
<summary>查看原文（58行）</summary>

```text
    const sendAttempt = async (attemptStartedAt: number): Promise<{ response: Response; bodyText?: string }> => {
      for (let attempt = 0; ; attempt++) {
        const generation = conversationKey !== undefined && conversationAccount !== undefined
          ? currentSessionGeneration(conversationAccount, conversationKey)
          : 0
        // One id per attempt, carried by the body. A resend under a bumped
        // session generation is a new upstream request, so it gets a new id.
        const requestId = generateAntigravityRequestId()
        const body = toAgyRequestBody(options, {
          projectId: session.account.projectId,
          sessionId:
            deriveAntigravitySessionId(session.account.email, conversationKey, generation) ?? undefined,
          requestId,
          ...(this.options.thinkingBudgetFor === undefined
            ? {}
            : { thinkingBudgetFor: this.options.thinkingBudgetFor }),
          ...(this.options.claudeBudgetFor === undefined
            ? {}
            : { claudeBudgetFor: this.options.claudeBudgetFor }),
          ...(this.options.tieredBudgetFor === undefined
            ? {}
            : { tieredBudgetFor: this.options.tieredBudgetFor }),
          ...(images.size > 0 ? { images } : {}),
          ...(multimodalFiles.size > 0 ? { multimodalFiles } : {}),
        })
        let response: Response
        try {
          response = await fetchAgyFirstOk(
            '/v1internal:streamGenerateContent?alt=sse',
            {
              method: 'POST',
              headers: buildRequestHeaders(session),
              body: JSON.stringify(body),
              signal: options.signal,
            },
            accountFetch(routing),
            routing,
          )
        } catch (error) {
          const classified = classifyFetchError(error, { proxyUrl: session.account.proxy })
          await this.options.reportFailure(classified.kind, session)
          // A transport failure consumed no tokens, but it is a real attempt
          // against this account's quota — record the request, not the usage.
          this.recordUsage(session, options.model, { ok: false, reason: 'network-error' }, attemptStartedAt)
          throw new LlmError(classified.message ?? 'agy fetch failed', 'TRANSPORT', { cause: error })
        }
        if (response.ok) return { response }
        const bodyText = await response.text().catch(() => undefined)
        if (
          attempt === 0
          && conversationKey !== undefined
          && conversationAccount !== undefined
          && isSessionAccumulationOverflow(response.status, bodyText)
        ) {
          bumpSessionGeneration(conversationAccount, conversationKey)
          continue
        }
        return { response, bodyText }
```

</details>

**依据 6 · 源码核查**：[src/adapter/adapter.ts:719-754](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/adapter/adapter.ts#L719-L754)

首个text-delta交付、正常尾部缓存交付与取消路径。

<details>
<summary>查看原文（36行）</summary>

```text
          if (yieldedDirect) {
            // Past the hand-off, so this chunk leaves immediately: its signature
            // commits here rather than at stream end. A `functionCall` can arrive
            // after the first `text-delta`, so a mid-body death must not cost the
            // consumer a signature it was already delivered.
            if (pendingSignatures.length !== 0) commitSignatures()
            yield chunk
          } else if (chunk.type === 'text-delta') {
            yieldedDirect = true
            commitSignatures()
            // TTFT is when the CONSUMER first sees output, not when the parser
            // first produced it: a buffered turn holds every chunk until this
            // point, so measuring at parse time would under-report the user's
            // wait by the whole thinking period.
            ttftMs = Date.now() - attemptStartedAt
            for (const buffered of drainBuffer()) yield buffered
            yield chunk
          } else {
            bufferedChunks.push(chunk)
          }
        }

        // Commit whatever the turn left buffered (a tool-call or completed
        // reasoning turn never emits a text-delta, so it ends up here).
        if (ttftMs === undefined) ttftMs = Date.now() - attemptStartedAt
        commitSignatures()
        for (const buffered of drainBuffer()) yield buffered

        await this.options.markSuccess?.(session)
        this.recordUsage(session, options.model, { ok: true, usage, ttftMs, actualModel: actualModelVersion }, attemptStartedAt)
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          this.recordUsage(session, options.model, { ok: false, reason: 'aborted', usage }, attemptStartedAt)
          await response.body?.cancel().catch(() => {})
          throw new LlmError('agy stream aborted', 'ABORTED', { cause: error })
```

</details>

**依据 7 · 源码核查**：[src/adapter/adapter.ts:757-809](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/adapter/adapter.ts#L757-L809)

未交付idle超时与最多三次malformed重试，取消退避也映射ABORTED。

<details>
<summary>查看原文（53行）</summary>

```text
        // Idle watchdog (parse.ts): the streaming dispatcher runs with
        // `bodyTimeout: 0` on purpose, so a body that stops producing bytes has
        // no other reclaim. While nothing has been handed to the consumer, a
        // retry replays a turn the user never saw — that one is worth DSH's
        // retryable TIMEOUT, with the account still absorbing the transient
        // through `reportFailure`. Past the first committed chunk the turn is
        // content the consumer already holds, so it falls through to the same
        // terminal UPSTREAM as any other mid-body death.
        if (error instanceof AgyStreamIdleTimeoutError && !yieldedDirect) {
          await this.options.reportFailure('network-error', session)
          this.recordUsage(session, options.model, { ok: false, reason: 'network-error', usage }, attemptStartedAt)
          await response.body?.cancel().catch(() => {})
          throw new LlmError(
            `${error.message} — nothing was delivered, retrying`,
            'TIMEOUT',
            { cause: error },
          )
        }

        // MALFORMED_FUNCTION_CALL is a transient model syntax fluke during tool calling.
        // If no text chunks were committed to DSH, discard the buffered chunks, record
        // this attempt's usage, and retry after a short linear wait. Across at most
        // 3 retries the whole schedule is 1.2s, so the shape buys nothing here;
        // what matters is that the first re-sample is not immediate.
        const isMalformed = error instanceof UnmappedFinishReasonError && error.reason === 'MALFORMED_FUNCTION_CALL'
        if (isMalformed && !yieldedDirect && malformedAttempt < MAX_MALFORMED_RETRIES) {
          // Bill the tokens this attempt really spent. `usage` arrives because
          // parseAgySse flushes its stashed totals before propagating an
          // unmapped finishReason; it stays undefined when the stream died too
          // early to report any.
          this.recordUsage(session, options.model, { ok: false, reason: 'request-error', usage }, attemptStartedAt)
          // Abandon the body. The streaming dispatcher runs with `bodyTimeout: 0`
          // (a reasoning pause must not be killed mid-turn), so nothing else
          // reclaims this connection: leaving it unread can pin one per discarded
          // attempt. `parseAgySse`'s finally has already released the reader
          // lock, so cancelling is safe here.
          await response.body?.cancel().catch(() => {})
          // Abort-aware, and converted here rather than in a shared helper: a
          // `catch` block never catches exceptions thrown by its own body, so
          // awaiting the sleep inside this handler would let an abort landing in
          // the backoff escape the generator as a raw `DOMException`. Every other
          // abort path in this adapter reports the typed `ABORTED` code, which is
          // what DSH's retry policy reads, so dropping it here would give the
          // same cancellation two different shapes.
          try {
            await sleepWithSignal(200 * (malformedAttempt + 1), options.signal)
          } catch (sleepError) {
            if (sleepError instanceof DOMException && sleepError.name === 'AbortError') {
              throw new LlmError('agy stream aborted', 'ABORTED', { cause: sleepError })
            }
            throw sleepError
          }
          continue
```

</details>

**依据 8 · 源码核查**：[src/adapter/adapter.ts:818-837](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/adapter/adapter.ts#L818-L837)

普通中途失败终止UPSTREAM，不把部分交付重新当安全重试。

<details>
<summary>查看原文（20行）</summary>

```text
        const unmappedFinish = error instanceof UnmappedFinishReasonError
        await this.options.reportFailure(unmappedFinish ? 'request-error' : 'network-error', session)
        // `usage` is defined here exactly when the stream died with an unmapped
        // finishReason or the idle watchdog fired: `parseAgySse` flushes its
        // stashed totals before propagating those two and no other. A mid-body
        // socket death and the EOF completeness guard produce none, so the value
        // is `undefined` there and passing it is a no-op — the retry path bills
        // the same way.
        this.recordUsage(session, options.model, { ok: false, reason: unmappedFinish ? 'request-error' : 'network-error', usage }, attemptStartedAt)
        await response.body?.cancel().catch(() => {})
        // Deliberately UPSTREAM (terminal), not TRANSPORT: content may already
        // have been emitted, and DSH's retry policy honours TRANSPORT, so retrying
        // here would replay a partially-delivered turn. The account-level report
        // above already absorbs the transient case by cooling/rotating. The cause
        // code is still surfaced so the socket failure is legible in session events.
        throw new LlmError(
          error instanceof Error ? describeFetchError(error) : 'agy stream parse failed',
          UPSTREAM_ERROR_CODE,
          { cause: error },
        )
```

</details>

**依据 9 · 源码核查**：[src/session.ts:1174-1199](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/session.ts#L1174-L1199)

fingerprint变化与冷却/轮换在限流失败路径，不能独立证明服务端认可。

<details>
<summary>查看原文（26行）</summary>

```text
      if (kind === 'rate-limit' && info?.rateLimitCategory !== 'soft_rate_limit') {
        if (!account.fingerprint) {
          account.fingerprint = generateFingerprint(undefined, fpResolvedVersion)
          account.fingerprintHistory = recordFingerprintVersion(account.fingerprintHistory, account.fingerprint, 'initial')
        } else {
          if (fpCachedVersion) updateFingerprintVersion(account.fingerprint, fpCachedVersion)
          if (fingerprintMode() !== 'stable' && consecutive >= 2) {
            const fresh = generateFingerprint(undefined, fpResolvedVersion)
            account.fingerprintHistory = recordFingerprintVersion(account.fingerprintHistory, fresh, 'regenerated')
            account.fingerprint = fresh
          }
        }
      }

      if (decision.action === 'rotate' || decision.action === 'cool') {
        const currentIndex = storage.accounts.findIndex((a) => this.accountKey(a) === key)
        const familyKey = familyKeyOf(info?.model)
        const nextIndex = pickNextAccountIndex(storage.accounts, currentIndex >= 0 ? currentIndex : storage.activeIndex, Date.now(), familyKey)
        if (nextIndex !== storage.activeIndex) {
          storage.activeIndex = nextIndex
          nextIndexToRotate = nextIndex
        }
        // Only conversations pinned to the failed account are freed; a pin on
        // another account was never this failure's business.
        this.clearAffinityForAccount(key)
      }
```

</details>

**依据 10 · 源码核查**：[src/adapter/adapter.ts:222-236](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/adapter/adapter.ts#L222-L236)

实际请求头只读取指定impersonation字段，存储字段不是发送证明。

<details>
<summary>查看原文（15行）</summary>

```text
export function buildRequestHeaders(session: AgyAccountSession): Record<string, string> {
  return {
    authorization: `Bearer ${session.auth.access}`,
    'content-type': 'application/json',
    accept: 'text/event-stream',
    // Exactly the two impersonation HEADERS, named individually rather than
    // spread. `session.impersonation.clientMetadata` is a body message and must
    // not become a header — and it is deliberately not added to this envelope
    // either: the only `metadata` field the official descriptor evidences is on
    // the control-plane calls (`LoadCodeAssistRequest`/`OnboardUserRequest`), so
    // on this generate request the identity carrier is the body's existing
    // `userAgent`/`requestType` pair.
    'User-Agent': session.impersonation['User-Agent'],
    'X-Goog-Api-Client': session.impersonation['X-Goog-Api-Client'],
  }
```

</details>

#### 缺口

- 当前上游对重复requestId、端点重发、取消后的执行和用量结果没有独立记录。
  **影响**：无法证明重试是exactly-once、无额外额度消耗或调用已停止，恢复建议必须保留UNKNOWN状态。
  **进一步探讨**：在专用账号及固定任务中关联每个端点尝试、本地交付和远端可取得记录；无法关联时保留结果未知，不盲目无限重试。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 配额/用量/界面提供什么信息，兼容与运维成本在哪里？

**研究主题**：效果与总成本、依赖、兼容与流程、工程质量与复用

#### 完整回答

设置界面实际注册到settings.section，额度徽章由用户偏好开启并在清理时解除；数据显示和调度共享runtime，但显示额度与调度缓存仍有各自刷新语义。refreshLimits默认仅测过期账号，显式force绕过TTL，失败保留上次窗口并返回measured/failed/skipped。剩余fraction不是剩余token容量；burn估计需要两次至少间隔五分钟且下降的样本，第一次或重置上涨不给消耗速度。故缓存比例与预计耗尽不是实时可用性、保证用量或账单。

用量账本由adapter和session注入的recordUsage汇总，正常调用、某些失败与轮换事件分别记录。stats先缓冲再持锁重读叠加，落盘失败不阻断生成并保留待重试；缓冲有上限，会丢最早条目。它适合诊断本地看到的请求与token信息，不是永久完整审计账本，更不能把未知远端usage当零成本。本轮没有比较账本与服务端计费，也没有断电持久性验证。

环境要区分源码和安装包。package声明Node>=20.18.1，而README源码开发要求>=22，peer约束Cordis及dsh-llm；本轮不挑一个假定所有组合都兼容，使用者应核对目标宿主、构建与依赖实际要求。账号要能完成当前OAuth和模型服务调用，附件/界面等还依赖宿主服务。私有内部接口、客户端身份和模型元数据变化可能要求持续维护，源码接口存在不证明外部服务长期支持。

首次成本包括配置宿主/账号/密钥和测试授权；持续包括模型请求、控制面配额/健康查询、重试、凭据保管和升级；失败包括网络/认证排查与结果核对；退出需本地移除和远端撤销分别完成。没有价格、有效任务数、人工时间和同期质量比较，不称免费或便宜，也不把账号池等同额外可用额度。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:2558-2600](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/client/index.ts#L2558-L2600)

额度徽章按偏好注册，设置页及清理有真实宿主接线。

<details>
<summary>查看原文（43行）</summary>

```text
  const registerBadge = (): void => {
    if (badgeDisposer !== null) return
    badgeDisposer = ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register({
      name: 'conversation.session.header.actions',
      id: 'agy-quota-badge',
      order: 8,
      label: () => t('title'),
    }, () => h(AgyQuotaBadge, { rpc, t })))
  }

  const unregisterBadge = (): void => {
    if (badgeDisposer !== null) {
      badgeDisposer()
      badgeDisposer = null
    }
  }

  // Opt-in: only register when user preference has enabled the badge
  void rpc.call('ui.prefs.get', {}).then((prefs) => {
    if (prefs?.conversationBadge) {
      registerBadge()
    }
  }).catch(() => {})

  const onBadgePrefChange = (enabled: boolean): void => {
    if (enabled) {
      registerBadge()
    } else {
      unregisterBadge()
    }
  }

  ctx.effect(() => ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'agy',
    order: 30,
    locale: NS,
    label: () => t('title'),
  }, () => h(AgySettings, { rpc, t, lang, onBadgePrefChange }))), 'dsh-agy: Settings section')

  ctx.effect(() => () => {
    unregisterBadge()
  }, 'dsh-agy: quota badge cleanup')
```

</details>

**依据 2 · 源码核查**：[src/session.ts:637-681](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/session.ts#L637-L681)

显示窗口刷新区分TTL/force，失败保留旧缓存并返回分类结果。

<details>
<summary>查看原文（45行）</summary>

```text
  async refreshLimits(
    storage: AccountStorageV4,
    options: { force?: boolean } = {},
  ): Promise<LimitsRefreshResult> {
    const now = Date.now()
    // A separate staleness rule: `isQuotaStale` is driven by the SCHEDULING
    // cache, which a solo account never fills, so reusing it would report
    // "stale" on every call and re-probe continuously. `force` bypasses it for
    // an explicit user request, which is the only thing that may spend an
    // upstream call inside the TTL.
    const candidates = storage.accounts.filter((account) => account.enabled !== false)
    const targets = options.force === true
      ? candidates
      : candidates.filter((account) => isLimitsStale(account, now))
    if (targets.length === 0) {
      return { measured: [], failed: [], skipped: candidates.length }
    }

    const probes = await Promise.all(targets.map(async (account) => {
      const key = this.accountKey(account)
      try {
        // The SHARED probe: the scheduling path joins the same in-flight promise
        // for this account, so one cycle pays one round trip and both caches read
        // the same groups. It only carries the FETCH — this path still writes
        // `cachedLimits` and nothing else.
        const groups = await this.probeQuotaSummary(account)
        if (groups.length === 0) return { key, ok: false as const }
        return { key, ok: true as const, groups, updatedAt: Date.now() }
      } catch {
        // Best-effort: a failed probe leaves the previous windows in place.
        return { key, ok: false as const }
      }
    }))

    const updates = probes.filter((probe): probe is
      { key: string, ok: true, groups: QuotaGroup[], updatedAt: number } => probe.ok)
    const failed = probes.filter((probe) => !probe.ok).map((probe) => probe.key)
    // Report the skip count so a caller can distinguish "nothing was due" from
    // "everything failed" — the two read identically on screen otherwise.
    // Counted over the same eligible set the early return uses, so a disabled
    // account never inflates it into a phantom "still fresh".
    const result: LimitsRefreshResult = {
      measured: updates.map((update) => update.key),
      failed,
      skipped: candidates.length - targets.length,
```

</details>

**依据 3 · 源码核查**：[src/session.ts:128-168](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/session.ts#L128-L168)

fraction变化估计不是容量；首次、短间隔和非下降样本不产生burn。

<details>
<summary>查看原文（41行）</summary>

```text
 * One quota-fraction snapshot, for the burn rate. Memory only.
 *
 * Upstream reports windows as a remaining FRACTION with no capacity, so the
 * only honest way to a "how long until this runs dry" figure is the fraction's
 * own rate of change: keep the previous snapshot, and the next one yields
 * fraction-per-hour.
 */
export interface LimitSample {
  at: number
  /** bucketId -> remaining fraction; null fractions are omitted. */
  fractions: Record<string, number>
}

/** Two samples closer than this are noise (a forced refresh seconds apart). */
export const MIN_BURN_SAMPLE_MS = 5 * 60 * 1000

/**
 * Fraction-per-hour per window bucket, from two snapshots.
 *
 * Pure and exported for a direct unit test. Rules:
 * - the FIRST sample yields nothing (no baseline yet), and so does a pair
 *   closer than `MIN_BURN_SAMPLE_MS` — two probes seconds apart measure the
 *   probe jitter, not the burn;
 * - a RISING fraction is a reset (or refresh noise), never negative burn;
 * - a bucket with no baseline simply has no rate yet.
 *
 * Returns null when no bucket produced a rate, so the caller can keep the
 * previous rates instead of overwriting them with an empty read.
 */
export function sampleLimitBurn(prev: LimitSample | undefined, next: LimitSample): Record<string, number> | null {
  if (prev === undefined) return null
  const elapsedH = (next.at - prev.at) / 3_600_000
  if (elapsedH < MIN_BURN_SAMPLE_MS / 3_600_000) return null
  const perHour: Record<string, number> = {}
  for (const [bucketId, fraction] of Object.entries(next.fractions)) {
    const before = prev.fractions[bucketId]
    if (before !== undefined && before > fraction) {
      perHour[bucketId] = (before - fraction) / elapsedH
    }
  }
  return Object.keys(perHour).length > 0 ? perHour : null
```

</details>

**依据 4 · 源码核查**：[src/plugin-common.ts:168-210](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/plugin-common.ts#L168-L210)

usage由会话/adapter接线，账本落盘错误降级不阻断生成。

<details>
<summary>查看原文（43行）</summary>

```text
  const stats = new UsageStats({
    // The ring's persistence half: every captured record is handed to the
    // store (write-behind there, still I/O-free here).
    persistRecent: (entry) => { recentStore.capture(entry) },
    onFlushError: (error) => {
      ctx.logger.warn(
        `[dsh-agy] usage ledger could not be written (${stats.path}): `
        + `${error instanceof Error ? error.message : String(error)} — counts are buffered and will retry`,
      )
    },
  })
  const modelVisibility = new ModelVisibility()
  const thinkingBudget = new ThinkingBudgetStore()
  const multimodalConfig = new MultimodalConfigStore()
  // The adapter's model-list cache is keyed to no account (see
  // `AgyAdapter.invalidateModelCache`), so every event that can switch the
  // account discovery rides must drop it. The adapter does not exist yet when
  // the session manager is constructed, hence the late-bound reference.
  let invalidateModelCache: () => void = () => {}
  const sessions = new AgySessionManager({
    store,
    recordUsage: (record) => { stats.record(record) },
    onRotate: () => { invalidateModelCache() },
  })
  // Optional background health probe (DSH_AGY_HEALTH_INTERVAL_MS), off by default.
  const healthIntervalMs = Number(process.env.DSH_AGY_HEALTH_INTERVAL_MS ?? 0)
  if (Number.isFinite(healthIntervalMs) && healthIntervalMs > 0) {
    sessions.startHealthProbe(healthIntervalMs)
  }
  const adapter = new AgyAdapter({
    getSession: (model, conversationKey) => sessions.getSession(model, undefined, conversationKey),
    reportFailure: (kind, session, info) => sessions.reportFailure(kind, session, info),
    markSuccess: (session) => sessions.markSuccess(session),
    resolveAttachments: () => ctx.get('attachments') as AgyAttachmentStore | undefined,
    noteRequestStarted: (account) => sessions.noteRequestStarted(account),
    noteRequestSettled: (account) => sessions.noteRequestSettled(account),
    modelVisibility,
    thinkingBudgetFor: (level) => thinkingBudget.budgetFor(level),
    claudeBudgetFor: () => thinkingBudget.claudeBudget(),
    tieredBudgetFor: () => thinkingBudget.tieredBudget(),
    maxInlineBytes: () => multimodalConfig.maxInlineBytes(),
    recordUsage: (record) => { stats.record({ ...record, source: 'chat' }) },
  })
```

</details>

**依据 5 · 源码核查**：[src/stats.ts:596-617](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/stats.ts#L596-L617)

record缓存有上限，超过后丢旧项，不是无限可靠审计。

<details>
<summary>查看原文（22行）</summary>

```text
  record(record: UsageRecord): void {
    this.noteRecent(record)
    this.pending.push(record)
    // Cap the backlog: unbounded growth is the one failure mode a diagnostic
    // ledger must not have (see `maxPending`).
    if (this.maxPending > 0 && this.pending.length > this.maxPending) {
      this.pending.splice(0, this.pending.length - this.maxPending)
    }
    // Count-based flushing is a throughput optimisation, so it is suspended
    // while writes are failing. Without this a persistent failure made EVERY
    // `record()` attempt a full synchronous flush (stat + lock + read + write),
    // turning the generation hot path into I/O — the exact opposite of this
    // class's contract. The timer below keeps retrying instead.
    if (
      this.flushFailedSince === undefined
      && this.flushEvery > 0
      && this.pending.length >= this.flushEvery
    ) {
      this.flush()
      return
    }
    this.armTimer()
```

</details>

**依据 6 · 源码核查**：[src/stats.ts:694-733](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/stats.ts#L694-L733)

持锁重读叠加和落盘失败重试保留，仍受maxPending上限。

<details>
<summary>查看原文（40行）</summary>

```text
  flush(): void {
    if (this.timer !== undefined) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
    const batch = this.pending
    if (batch.length === 0) return
    this.pending = []
    const now = this.now()
    try {
      this.ensureFile(now)
      this.lock.withLock(this.file, () => {
        // Re-read under the lock and replay this batch onto the fresh state:
        // that is what makes concurrent writers additive instead of last-write-wins.
        const doc = this.readFile()
        for (const record of batch) applyRecord(doc, record, now)
        this.writeFile(doc)
      })
      this.lastFlushError = undefined
      this.flushFailedSince = undefined
    } catch (error) {
      // A failed flush must not lose the counts or break a generation: put the
      // batch back so the next flush retries it, and surface the reason once.
      this.pending = [...batch, ...this.pending]
      if (this.maxPending > 0 && this.pending.length > this.maxPending) {
        this.pending.splice(0, this.pending.length - this.maxPending)
      }
      this.lastFlushError = error
      if (this.flushFailedSince === undefined) {
        this.flushFailedSince = now
        try {
          this.onFlushError?.(error)
        } catch {
          // The reporter must never break a flush path.
        }
      }
      // Only the timer retries now; `record()` stops triggering immediate
      // flushes until one succeeds.
      this.armTimer()
    }
```

</details>

**依据 7 · 作者声明**：[README.md:126-156](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/README.md#L126-L156)

源码开发和退出要求为作者说明，未作为本轮运行结果。

<details>
<summary>查看原文（31行）</summary>

````text
### Path C: Local Development & Link

```sh
git clone https://github.com/chaos-03x/dsh-agy.git
cd dsh-agy && pnpm install && pnpm run build
dsh plugin --profile web link .
```

Requires Node >= 22.

## Uninstall

```sh
# 1. Remove the DSH plugin from a profile
dsh plugin --profile web remove dsh-agy

# 2. Uninstall the CLI
npm uninstall -g dsh-agy

# 3. Optional: delete local account data (the whole agy data folder)
dsh-agy logout              # remove accounts first (or skip)
rm -rf ~/.dsh/agy           # accounts, usage stats, model visibility, thinking budgets, recent ring
# remove only the AGY_MASTER_KEY line from ~/.dsh/.credentials.yaml — keep other keys!
# (an upgrade from ≤0.4 may leave legacy files in ~/.dsh itself: rm -f ~/.dsh/agy-*.json)

# 4. Optional: revoke the Google-side authorization
#    Google account security → Third-party access → revoke "Antigravity"
```

Deleting local files does **not** revoke Google-side tokens; the refresh token stays
valid until it expires or you revoke it in your Google account security settings.
````

</details>

#### 缺口

- 模型与控制面调用的实际费用、全尝试数、成功率和排障工时未知。
  **影响**：不能比较它与官方客户端/其他接入方式的单位合格任务成本或可靠性。
  **进一步探讨**：在明确账号条件后记录固定任务全部尝试、失败、控制面查询与人工投入，再与可比基线比较。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 当前何种用户可采用，能否从未知结果推导可证伪改进？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前建议观察。它适合已有合法可访问账号、愿意管理OAuth凭据和外部接口兼容性的技术用户继续核查；本轮未登录或发请求，不能据README和源码就建议把重要生产任务切到该接入。若另行安排小范围验证，应先用单一专用账号、非敏感短任务确认登录/模型目录/输出和错误提示，人工核对每次失败与重试。遇认证挑战、长期额度阻塞、输出已部分交付或凭据来源不清，应停止自动重放，回服务原入口及账号状态检查；退出时分别处理本地账号删除与远端授权撤销。

一个有依据的改进假设是分开记录逻辑DSH调用、sendAttempt、每个端点的网络尝试及“已接收/已交付/结果未知”，以不含令牌和正文的关联记录向用户解释一次失败。推导依据是当前端点fallback能让一条send覆盖多个网络尝试，malformed可内部重采样，usage则在较高层记录；消费者没有收到文本并不等于远端没有工作。该追踪若能区分部分交付和远端未知，可能减少用户重复发起及误解额度消耗，但不是当前已确认能力，也不提供远端幂等或计费保证。

最小验证可在隔离的模拟HTTP/流环境设计端点拒绝、发出请求后断连、工具语法错误、首次文本后断流四类案例，对照现有错误消息与分层记录。统计操作者能否正确识别安全重试/应停止/远端未知、重复发起数、记录开销；再在另行允许的真实专用账号任务中核对可取得的服务记录。若trace仍把未知标成未执行，或没有减少错误重发且维护成本增加，应否定改进收益。模拟仅验证本地解释，不证明真实服务不重复计算。

#### 证据与依据

**依据 1 · 源码核查**：[src/oauth/constants.ts:97-128](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/oauth/constants.ts#L97-L128)

端点层循环与上层调用的粒度不同，为分层尝试记录提供推导。

<details>
<summary>查看原文（32行）</summary>

```text
export async function fetchAgyFirstOk(
  urlPath: string,
  init: RequestInit,
  fetchImpl: typeof fetch = proxiedFetch,
  options: AgyFallbackOptions = {},
): Promise<Response> {
  let lastSkipped: Response | null = null
  let lastNetworkError: unknown
  for (const baseEndpoint of AGY_ENDPOINT_FALLBACKS) {
    try {
      const response = await fetchImpl(`${baseEndpoint}${urlPath}`, init)
      if (!AGY_ENDPOINT_SKIP_STATUSES.has(response.status)) return response
      // Prefer keeping a 429 or 503 response from earlier production endpoints
      // rather than letting the internal autopush sandbox 403 (which always fails for
      // consumer accounts with "no license") overwrite the real rate-limit/capacity signal.
      if (!lastSkipped || (baseEndpoint !== AGY_ENDPOINT_AUTOPUSH && (response.status === 429 || response.status === 503))) {
        lastSkipped = response
      }
    } catch (error) {
      lastNetworkError = error
      // Fail-closed only while an explicit per-account proxy is in effect: the
      // request must not be retried on another endpoint or go direct.
      if (isProxyRouted(options)) {
        const { isProxyUnreachableError } = await import('../proxy.ts')
        if (isProxyUnreachableError(error)) throw error
      }
      // network error — try the next endpoint
    }
  }
  if (lastSkipped) return lastSkipped
  if (lastNetworkError !== undefined) throw lastNetworkError
  throw new Error('all agy endpoints failed')
```

</details>

**依据 2 · 源码核查**：[src/adapter/adapter.ts:482-539](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/adapter/adapter.ts#L482-L539)

sendAttempt重发与派生session变化，需要区别逻辑调用与上游尝试。

<details>
<summary>查看原文（58行）</summary>

```text
    const sendAttempt = async (attemptStartedAt: number): Promise<{ response: Response; bodyText?: string }> => {
      for (let attempt = 0; ; attempt++) {
        const generation = conversationKey !== undefined && conversationAccount !== undefined
          ? currentSessionGeneration(conversationAccount, conversationKey)
          : 0
        // One id per attempt, carried by the body. A resend under a bumped
        // session generation is a new upstream request, so it gets a new id.
        const requestId = generateAntigravityRequestId()
        const body = toAgyRequestBody(options, {
          projectId: session.account.projectId,
          sessionId:
            deriveAntigravitySessionId(session.account.email, conversationKey, generation) ?? undefined,
          requestId,
          ...(this.options.thinkingBudgetFor === undefined
            ? {}
            : { thinkingBudgetFor: this.options.thinkingBudgetFor }),
          ...(this.options.claudeBudgetFor === undefined
            ? {}
            : { claudeBudgetFor: this.options.claudeBudgetFor }),
          ...(this.options.tieredBudgetFor === undefined
            ? {}
            : { tieredBudgetFor: this.options.tieredBudgetFor }),
          ...(images.size > 0 ? { images } : {}),
          ...(multimodalFiles.size > 0 ? { multimodalFiles } : {}),
        })
        let response: Response
        try {
          response = await fetchAgyFirstOk(
            '/v1internal:streamGenerateContent?alt=sse',
            {
              method: 'POST',
              headers: buildRequestHeaders(session),
              body: JSON.stringify(body),
              signal: options.signal,
            },
            accountFetch(routing),
            routing,
          )
        } catch (error) {
          const classified = classifyFetchError(error, { proxyUrl: session.account.proxy })
          await this.options.reportFailure(classified.kind, session)
          // A transport failure consumed no tokens, but it is a real attempt
          // against this account's quota — record the request, not the usage.
          this.recordUsage(session, options.model, { ok: false, reason: 'network-error' }, attemptStartedAt)
          throw new LlmError(classified.message ?? 'agy fetch failed', 'TRANSPORT', { cause: error })
        }
        if (response.ok) return { response }
        const bodyText = await response.text().catch(() => undefined)
        if (
          attempt === 0
          && conversationKey !== undefined
          && conversationAccount !== undefined
          && isSessionAccumulationOverflow(response.status, bodyText)
        ) {
          bumpSessionGeneration(conversationAccount, conversationKey)
          continue
        }
        return { response, bodyText }
```

</details>

**依据 3 · 源码核查**：[src/adapter/adapter.ts:776-809](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/adapter/adapter.ts#L776-L809)

内部重采样可能增加尝试，而无用户输出不代表上游未处理。

<details>
<summary>查看原文（34行）</summary>

```text
        // MALFORMED_FUNCTION_CALL is a transient model syntax fluke during tool calling.
        // If no text chunks were committed to DSH, discard the buffered chunks, record
        // this attempt's usage, and retry after a short linear wait. Across at most
        // 3 retries the whole schedule is 1.2s, so the shape buys nothing here;
        // what matters is that the first re-sample is not immediate.
        const isMalformed = error instanceof UnmappedFinishReasonError && error.reason === 'MALFORMED_FUNCTION_CALL'
        if (isMalformed && !yieldedDirect && malformedAttempt < MAX_MALFORMED_RETRIES) {
          // Bill the tokens this attempt really spent. `usage` arrives because
          // parseAgySse flushes its stashed totals before propagating an
          // unmapped finishReason; it stays undefined when the stream died too
          // early to report any.
          this.recordUsage(session, options.model, { ok: false, reason: 'request-error', usage }, attemptStartedAt)
          // Abandon the body. The streaming dispatcher runs with `bodyTimeout: 0`
          // (a reasoning pause must not be killed mid-turn), so nothing else
          // reclaims this connection: leaving it unread can pin one per discarded
          // attempt. `parseAgySse`'s finally has already released the reader
          // lock, so cancelling is safe here.
          await response.body?.cancel().catch(() => {})
          // Abort-aware, and converted here rather than in a shared helper: a
          // `catch` block never catches exceptions thrown by its own body, so
          // awaiting the sleep inside this handler would let an abort landing in
          // the backoff escape the generator as a raw `DOMException`. Every other
          // abort path in this adapter reports the typed `ABORTED` code, which is
          // what DSH's retry policy reads, so dropping it here would give the
          // same cancellation two different shapes.
          try {
            await sleepWithSignal(200 * (malformedAttempt + 1), options.signal)
          } catch (sleepError) {
            if (sleepError instanceof DOMException && sleepError.name === 'AbortError') {
              throw new LlmError('agy stream aborted', 'ABORTED', { cause: sleepError })
            }
            throw sleepError
          }
          continue
```

</details>

**依据 4 · 源码核查**：[src/adapter/adapter.ts:818-837](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/src/adapter/adapter.ts#L818-L837)

已可能交付的中途失败被终止，说明交付状态是恢复判断的关键。

<details>
<summary>查看原文（20行）</summary>

```text
        const unmappedFinish = error instanceof UnmappedFinishReasonError
        await this.options.reportFailure(unmappedFinish ? 'request-error' : 'network-error', session)
        // `usage` is defined here exactly when the stream died with an unmapped
        // finishReason or the idle watchdog fired: `parseAgySse` flushes its
        // stashed totals before propagating those two and no other. A mid-body
        // socket death and the EOF completeness guard produce none, so the value
        // is `undefined` there and passing it is a no-op — the retry path bills
        // the same way.
        this.recordUsage(session, options.model, { ok: false, reason: unmappedFinish ? 'request-error' : 'network-error', usage }, attemptStartedAt)
        await response.body?.cancel().catch(() => {})
        // Deliberately UPSTREAM (terminal), not TRANSPORT: content may already
        // have been emitted, and DSH's retry policy honours TRANSPORT, so retrying
        // here would replay a partially-delivered turn. The account-level report
        // above already absorbs the transient case by cooling/rotating. The cause
        // code is still surfaced so the socket failure is legible in session events.
        throw new LlmError(
          error instanceof Error ? describeFetchError(error) : 'agy stream parse failed',
          UPSTREAM_ERROR_CODE,
          { cause: error },
        )
```

</details>

**依据 5 · 作者声明**：[README.md:151-156](https://github.com/chaos-03x/dsh-agy/blob/5a03ffb595d2e60ee7a9fe621d4aef07fa91abc9/README.md#L151-L156)

远端授权撤销与本地删除不同，退出条件不能混同。

````text
# 4. Optional: revoke the Google-side authorization
#    Google account security → Third-party access → revoke "Antigravity"
```

Deleting local files does **not** revoke Google-side tokens; the refresh token stays
valid until it expires or you revoke it in your Google account security settings.
````

#### 缺口

- 分层记录是否降低操作错误，以及真实服务是否有可关联执行/计费记录未知。
  **影响**：该方向只能是解释与恢复假设，不能宣称exactly-once或已改善成本。
  **进一步探讨**：先用受控故障案例验证状态表达，再在明确授权条件下核查真实记录；保留不可观测部分。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
