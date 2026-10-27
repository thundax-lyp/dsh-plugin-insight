# orchd项目任务面板

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[1d01737](https://github.com/7bder/dsh-plugin-orchd/tree/1d01737c5656cfc01d74be30ba6e1ffd2a8114e8)

<!-- BEGIN META -->
[![npm 30d 359](https://img.shields.io/static/v1?label=npm+30d&message=359&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-orchd) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-orchd)
<!-- END META -->

> **功能**：在DSH右侧栏只读查看当前项目的orchd任务、依赖图、想法和审查时间线。

> **亮点**：将CLI任务状态映射成会话绑定侧栏，并以参数白名单和去身份环境限制读调用，任务引擎由项目提供。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：命令白名单不是项目Python沙箱；Web前缀来源栅栏未统一验证，安装确认还会注入真实用户消息。见 [Q03](#research-q03)。

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
  - [Q01 · 侧栏对何种用户有增量？](#detail-section-11)
  - [Q02 · 项目与只读命令如何约束？](#detail-section-12)
  - [Q03 · 只读保证覆盖哪些边界？](#detail-section-13)
  - [Q04 · 依赖与总负担是什么？](#detail-section-14)
  - [Q05 · 如何验证边界及当前采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有orchd项目在对话旁查任务与依赖，以正确项目、新鲜数据和无意外写入为结果。

直接orchd CLI和人工查定义是替代，插件新增同屏与诊断而非新任务引擎。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 项目只读面板 | 查任务与依赖 | 依赖可信项目引擎 |
| 四态诊断 | 区分安装/初始化/就绪/异常 | 数据有TTL而非实时推送 |
| 接入提示 | 将常量指令交给agent | 确认后真实消息，有会话副作用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH侧栏/workspaceRegistry/webServer | 启动/展示必需 | 会话绑定和路由 | 无项目不应猜路径 |
| Python与项目orchd | 查阅必需 | 执行读命令 | 给接入/异常状态 |
| 可信固定引擎与HTTP边界 | 安全使用必需 | 保持只读与会话隔离 | 未验收不远程暴露 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户确认引擎/Python/工作树 | 四态与真实项目一致 |
| 2 | 用户刷新查板并核对hash/账本 | 零写且数据时间清楚 |
| 3 | 管理员验证来源/会话切换与禁用 | 无越界读取/注入，否则停止暴露 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Python/宿主/项目引擎资源未知 | 布局、权限和零写验收 | 无引擎需独立接入 |
| 持续使用 | 轮询spawn与缓存资源 | 维护引擎兼容和数据新鲜度 | 大项目CPU/时延未测 |
| 失败恢复 | 超时/重查资源未知 | 区分项目、Python、引擎与HTTP问题 | 不等于自动恢复任务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 状态查阅 | 会话项目与多视图接线 | 查错/节时收益 |
| 只读收敛 | 命令/flags/env限制 | 外部引擎实际零写 |
| 边界 | 路径不由请求提供 | Web来源与会话权限 |

> **思考**：命令白名单不是项目Python沙箱；Web前缀来源栅栏未统一验证，安装确认还会注入真实用户消息。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将CLI任务状态映射成会话绑定侧栏，并以参数白名单和去身份环境限制读调用，任务引擎由项目提供。见 [Q01](#research-q01)、[Q02](#research-q02)。

fail-closed命令形状与去会话身份环境值得借鉴；项目引擎应固定hash并验收。/orchd与/api栅栏分离需要独立访问控制，confirm只是误触保护。

<a id="detail-section-5"></a>

### 1.4 主要限制

命令白名单不是项目Python沙箱；Web前缀来源栅栏未统一验证，安装确认还会注入真实用户消息。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察；先验收来源/会话权限和引擎零写，受信本地项目再决定试用。见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持只读命令限制与侧栏接线；当前引擎零写和Web来源边界未验收；能力凭据为假设。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/routes.js、lib/orchd-cli.js、lib/install-entry.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码抽查host、路由、CLI和安装提示；不运行项目引擎、目标代码、攻击测试或宿主，不继承作者冒烟为本轮验收。
- 下一步：固定引擎hash检查文件/账本/git零变更，再验收未认证/跨源/跨会话与卸载。

**分析版本**

- **仓库**：[7bder/dsh-plugin-orchd](https://github.com/7bder/dsh-plugin-orchd)
- **版本号**：0.1.1（[固定提交 1d01737](https://github.com/7bder/dsh-plugin-orchd/tree/1d01737c5656cfc01d74be30ba6e1ffd2a8114e8)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证的只读策略/引擎hash/来源状态凭据，可能帮助发现边界漂移；用引擎变更和请求矩阵证伪。见 [Q05](#research-q05)。

固定引擎hash检查文件/账本/git零变更，再验收未认证/跨源/跨会话与卸载。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 15 | 7321 | 5275 | 1590 | — |
| .md | source | 1 | 121 | — | — | 1318 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/7bder/dsh-plugin-orchd/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：orchd只读侧栏是否能降低任务状态查阅负担，其只读与会话边界依赖什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 侧栏对何种用户有增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合已经用orchd管理项目任务、希望对话时同屏查看任务、依赖与审查的人。合格结果是面板对应当前会话的真实项目且数据新鲜度清楚，不是画出DAG就表示依赖正确。相对运行orchd CLI再切回会话，增量是会话绑定的只读可视化、状态分类和错误原因；任务管理引擎本体来自项目，不算此插件贡献。没有已有orchd流程的人需先付引擎接入成本，不能把面板当独立任务平台。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-23](https://github.com/7bder/dsh-plugin-orchd/blob/1d01737c5656cfc01d74be30ba6e1ffd2a8114e8/README.md#L1-L23)

作者只读侧栏与视图

<details>
<summary>查看原文（23行）</summary>

```text
# dsh-plugin-orchd

Read-only **orchd** panel for the DeepSeek Harness (DSH) **right sidebar**: open a project session and see that
project's task board, dependency graph, ideas and review timeline next to the conversation.
No project configuration — the plugin derives the project from the session.

把 [orchd](https://github.com/7bder/orchd-core) 的项目状态带进 DSH 右侧栏的**只读面板**：

> 点开一个项目会话，面板自动检测这个项目有没有用 orchd。
> 装了 → 同屏显示任务看板、依赖图、想法与审查时间线；没装 → 给一个接入入口。

**面板没有任何写操作**：`claim` / `done` / `review` / `merge` / `amend` 一律不出现在 UI 里。

---

## 面板内容

| 视图 | 内容 |
|---|---|
| **四态检测** | `未安装` / `未初始化` / `就绪` / `异常`，每种状态各自点名原因，不是一句「出错了」 |
| **看板** | 状态分布、待办 / 在途 / 终态，状态条即筛选器；关键词、筛选、排序；800+ 任务虚拟滚动 |
| **任务详情** | 目标、验收标准、验证命令、写范围、上游依赖与下游引用（可点跳转）、审查事件时间线 |
| **依赖图** | DAG：聚焦闭包 / 活跃子图 / 含终态全图；环、自依赖与悬空上游**显式标注**，不静默少画 |
```

</details>

**依据 2 · 源码核查**：[lib/index.js:16-23](https://github.com/7bder/dsh-plugin-orchd/blob/1d01737c5656cfc01d74be30ba6e1ffd2a8114e8/lib/index.js#L16-L23)

工作区与Web服务接线

```text
import { normalizeConfig } from './config.js'
import { CACHE_MODULE_LOADED_AT, createProjectCaches } from './cache.js'
import { createCliInvoker } from './cli-invoke.js'
import { API_PREFIX, loadContext, routes } from './routes.js'
import { INSTALL_COMMAND, buildInstallPrompt, buildUserMessage } from './install-entry.js'

export const name = 'dsh-plugin-orchd'
export const inject = ['webServer', 'workspaceRegistry']
```

#### 缺口

- 没有状态查阅频率和查错时间对照
  **影响**：实际便利性未知
  **进一步探讨**：同项目用CLI/侧栏查任务依赖，计错误率和耗时

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 项目与只读命令如何约束？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

路由只接session及业务参数，由宿主会话解析项目，不让浏览器传任意路径。CLI封装以固定白名单匹配完整参数形状，危险flags直接拒绝，随后spawn项目自带Python入口；环境另以白名单构造，禁自动清理、身份留痕和pycache。工作树与引擎入口可分别位于容器/主工作树，resolveLauncher依存在顺序选取。可借鉴的是限制调用意图并保留具体拒绝原因，比UI不显示写按钮更强；但最终Python代码仍来自项目，引擎本身的副作用契约是外部信任前提。

#### 证据与依据

**依据 1 · 源码核查**：[lib/routes.js:109-118](https://github.com/7bder/dsh-plugin-orchd/blob/1d01737c5656cfc01d74be30ba6e1ffd2a8114e8/lib/routes.js#L109-L118)

项目只由会话推导

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * 公共前半段：项目根推导 → 校验 → 四态检测（带缓存）。
 * 所有路由都走同一次推导，**绝不使用请求里的路径**。
 */
export async function loadContext(deps, sessionId, { refresh = false } = {}) {
  const { ctx, config, caches } = deps

  const resolution = await resolveProjectRoot(ctx, sessionId, config)
  if (resolution.error !== undefined) {
    return { ok: false, error: { kind: 'broken', reason: resolution.error.reason, message: reasonText(resolution.error.reason), details: resolution.error.detail } }
```

</details>

**依据 2 · 源码核查**：[lib/orchd-cli.js:20-55](https://github.com/7bder/dsh-plugin-orchd/blob/1d01737c5656cfc01d74be30ba6e1ffd2a8114e8/lib/orchd-cli.js#L20-L55)

只读环境和命令白名单

<details>
<summary>查看原文（36行）</summary>

```text
export const CHILD_ENV = Object.freeze({
  /** 关闭僵尸会话自动回收（`status` 会做 prune_orphans + auto_clean）。 */
  ORCHD_AUTO_CLEAN: 'off',
  /** 关闭回收留痕的 stderr 输出，保证 stdout 干净。 */
  ORCHD_QUIET: '1',
  /** 避免中文在管道下的编码异常。 */
  PYTHONIOENCODING: 'utf-8',
  /** 不在项目内产生 `__pycache__`（插件自己的加固，非引擎要求）。 */
  PYTHONDONTWRITEBYTECODE: '1'
})

/**
 * 读命令白名单（fail-closed）。
 *
 * 每一项声明允许的参数形态；`args` 里 `:task-id` 之类的占位符由调用方按自身语义校验，
 * 这里只做「形状」匹配：固定词必须逐字相等，`<>` 表示一个自由参数。
 *
 * 刻意**不**包含（docs/03 第 4.1/4.3/9 节的理由）：
 *   - `request`：本参考项目 `config.allow_auto_claim: true`，会真的认领任务（高危）；
 *   - `watchdog --takeover` / `doctor --fix`：flag 触发的写路径；
 *   - `session current`：会写 `last_seen`；
 *   - `git` / `check`：前者是写操作的入口，后者昂贵。
 */
export const READ_WHITELIST = Object.freeze([
  { name: 'status', shapes: [[], ['--all'], ['<task-id>'], ['--text']], why: '全局快照 / 单任务卡片' },
  { name: 'show', shapes: [['<task-id>']], why: 'status <id> 的别名' },
  { name: 'pool', shapes: [[], ['--all']], why: '就绪池 / 下游阻塞数（FR-7.3）' },
  { name: 'review', shapes: [['--task', '<task-id>', '--show']], why: '审查意见历史（FR-8.3）' },
  { name: 'validate', shapes: [[], ['<path>']], why: '定义层合法性（broken 判定辅助）' },
  // `ideas` 只有 `list` 一个子命令（实测 `ideas --help`：usage: orchd ideas [-h] {list} ...），
  // 且它只读 JSON。`idea`（单数）才是写命令（propose / confirm / drop），**不在白名单**。
  { name: 'ideas', shapes: [['list']], why: 'IDEAS 清单（title/id/status，FR-13）' }
])

/** 结构性危险词：即使出现在白名单命令的额外参数里也直接拒绝。 */
const FORBIDDEN_TOKENS = new Set(['--fix', '--takeover', '--auto-claim', '--write', '--force'])
```

</details>

**依据 3 · 源码核查**：[lib/orchd-cli.js:62-89](https://github.com/7bder/dsh-plugin-orchd/blob/1d01737c5656cfc01d74be30ba6e1ffd2a8114e8/lib/orchd-cli.js#L62-L89)

完整参数形状匹配

<details>
<summary>查看原文（28行）</summary>

```text
export function checkWhitelist(argv) {
  if (!Array.isArray(argv) || argv.length === 0) {
    return { ok: false, reason: 'not-whitelisted', detail: { argv } }
  }
  for (const token of argv) {
    if (typeof token === 'string' && FORBIDDEN_TOKENS.has(token)) {
      return { ok: false, reason: 'dangerous-flag', detail: { argv, token } }
    }
  }

  const entry = READ_WHITELIST.find((item) => item.name === argv[0])
  if (entry === undefined) {
    return { ok: false, reason: 'not-whitelisted', detail: { argv, allowed: READ_WHITELIST.map((item) => item.name) } }
  }

  const rest = argv.slice(1)
  const matches = entry.shapes.some((shape) => {
    if (shape.length !== rest.length) return false
    return shape.every((token, index) => {
      // `<...>` 是一个自由参数（调用方负责校验其内容，例如 task id 只允许 [a-z0-9-]）
      if (token.startsWith('<') && token.endsWith('>')) return true
      return token === rest[index]
    })
  })

  return matches
    ? { ok: true }
    : { ok: false, reason: 'argument-not-allowed', detail: { argv, allowedShapes: entry.shapes } }
```

</details>

**依据 4 · 源码核查**：[lib/orchd-cli.js:213-238](https://github.com/7bder/dsh-plugin-orchd/blob/1d01737c5656cfc01d74be30ba6e1ffd2a8114e8/lib/orchd-cli.js#L213-L238)

执行项目引擎而非内置只读解释器

<details>
<summary>查看原文（26行）</summary>

```text
  const cwd = typeof workDir === 'string' && workDir !== '' ? workDir : root
  const chosenLauncher = resolveLauncherPath(cwd, root, containerRoot ?? null)
  const launcher = chosenLauncher.path
  const command = python.path
  const commandArgs = [...(python.args ?? []), launcher, ...argv]

  const startedAt = Date.now()
  return await new Promise((resolve) => {
    let settled = false
    const finish = (value) => {
      if (settled) return
      settled = true
      // launcher / launcherSource 一并带出：回退发生时诊断区能直接看出用的是哪一份入口
      resolve({ ...value, elapsedMs: Date.now() - startedAt, argv, launcher, launcherSource: chosenLauncher.source })
    }

    let child
    try {
      child = spawnImpl(command, commandArgs, {
        // cwd 必须是主工作树（见函数头注释的 E036 说明）
        cwd,
        windowsHide: true,
        // env 是**白名单式**构造：只带出必要变量 + 我们的只读开关，
        // 绝不把宿主的 ORCHD_SESSION_ID（若存在）传下去（FR-10.1）。
        env: buildChildEnv(),
        stdio: ['ignore', 'pipe', 'pipe']
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 只读保证覆盖哪些边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

只读是对插件选择的命令形状及当前引擎约定的保证，不是执行任意项目Python的操作系统沙箱。若项目引擎变更，status等命令仍可能有新副作用，需绑定版本验收。HTTP边界也需收窄：host注释说明web的/ orchd前缀不在/api信任栅栏，插件主要靠不接路径参数收敛；本次抽查入口未见统一connection.requestRejection。安装入口虽不直接安装，却通过显式confirm发送真实用户消息并可能唤醒agent，不能把全部面板路径理解为无会话副作用。confirm布尔值防误触不等于调用者认证。未执行跨源攻击或宿主外壳检查，不能判漏洞可利用，但Web暴露前必须验收来源/会话访问控制。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:3-9](https://github.com/7bder/dsh-plugin-orchd/blob/1d01737c5656cfc01d74be30ba6e1ffd2a8114e8/lib/index.js#L3-L9)

作者明确Web前缀栅栏边界

```text
 *
 * 依据 docs/02 第 3.1 节：
 *   - 全部注册都走 「ctx.effect(() => disposer, label)」，保证插件禁用时零残留（FR-12.3）；
 *   - 配置非法只记 warning 并降级到默认值，**不阻止插件挂载**；
 *   - 「/orchd/」 前缀避开 「/api」 与 「/plugins」；
 *   - 请求来源校验在 desktop profile 下由外壳代做（docs/04 第 7.1 节），
 *     web profile 下 「/orchd/」 不在 「/api」 栅栏内，因此插件自己只做「不接受路径参数」的收敛。
```

**依据 2 · 源码核查**：[lib/install-entry.js:99-107](https://github.com/7bder/dsh-plugin-orchd/blob/1d01737c5656cfc01d74be30ba6e1ffd2a8114e8/lib/install-entry.js#L99-L107)

注入真实用户消息

```text
export function injectInstallPrompt({ ctx, sessionId, text }) {
  const support = probeInjectSupport(ctx, sessionId)
  if (support.supported !== true) {
    return { injected: false, reason: support.reason }
  }
  const agent = ctx.get('agents').get(sessionId)
  const message = buildUserMessage(text)
  agent.steer(message)
  return { injected: true, reason: null, messageId: message.id }
```

**依据 3 · 源码核查**：[lib/routes.js:824-840](https://github.com/7bder/dsh-plugin-orchd/blob/1d01737c5656cfc01d74be30ba6e1ffd2a8114e8/lib/routes.js#L824-L840)

confirm字段检查

<details>
<summary>查看原文（17行）</summary>

```text
 * POST /orchd/api/install-inject —— 执行注入（FR-3.2）。
 *
 * ⚠ 本端点**只能由用户的显式确认动作触发**：`/context`、`/board`、`/ideas` 等任何轮询/刷新
 * 路径都不得调用它（FR-3.3/FR-3.5）。注入的是**插件内常量模板**（NFR-2.4），
 * 且插件自身不执行 `git clone` / `install.py`（AC-3.2）。
 */
async function handleInstallInject(deps, req, res) {
  const startedAt = Date.now()
  const body = await readJsonBody(req)
  const sessionId = typeof body?.session === 'string' ? body.session : ''
  if (sessionId === '') {
    sendJson(res, 400, envelope({ ok: false, startedAt, error: { kind: 'bad_request', reason: 'missing-session', message: 'body field `session` is required' } }))
    return
  }
  // 防御：只有用户确认时前端才带 confirm=true（避免被轮询误触发）
  if (body?.confirm !== true) {
    sendJson(res, 400, envelope({ ok: false, startedAt, error: { kind: 'bad_request', reason: 'confirm-required', message: 'injection requires explicit `confirm: true`' } }))
```

</details>

**依据 4 · 源码核查**：[lib/orchd-cli.js:231-238](https://github.com/7bder/dsh-plugin-orchd/blob/1d01737c5656cfc01d74be30ba6e1ffd2a8114e8/lib/orchd-cli.js#L231-L238)

项目自带代码以宿主权限运行

```text
      child = spawnImpl(command, commandArgs, {
        // cwd 必须是主工作树（见函数头注释的 E036 说明）
        cwd,
        windowsHide: true,
        // env 是**白名单式**构造：只带出必要变量 + 我们的只读开关，
        // 绝不把宿主的 ORCHD_SESSION_ID（若存在）传下去（FR-10.1）。
        env: buildChildEnv(),
        stdio: ['ignore', 'pipe', 'pipe']
```

#### 缺口

- Web来源/会话访问控制与当前引擎零写未验证
  **影响**：不支持远程暴露或绝对只读宣称
  **进一步探讨**：固定引擎版本，对合法/跨源/未认证请求及文件hash做验收

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖与总负担是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需DSH右侧栏席位、workspaceRegistry/webServer、项目orchd安装与Python。插件不捆绑引擎，缺引擎仅给接入入口；安装提示是另一个由用户/agent执行的流程，包含项目写入。持续查阅会spawn Python，TTL缓存降低调用量但引入陈旧窗口，不能当实时推送。首次需核对布局、Python与引擎，持续需维护外部引擎兼容；失败排障要区分未装、未初始化、超时与异常。现金/CPU/人工时没有负载实测，未知。禁用应释放路由、缓存与前端席位，当前仅源码生命周期设计，未做卸载验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:61-75](https://github.com/7bder/dsh-plugin-orchd/blob/1d01737c5656cfc01d74be30ba6e1ffd2a8114e8/README.md#L61-L75)

Python与项目引擎前提

<details>
<summary>查看原文（15行）</summary>

```text
- **DSH** 提供右侧栏面板席位（`sidebarRightTabs` + `sidebar.right.pane.tab`，session 作用域）。
- **项目侧装了 orchd**（项目根或容器主工作树下有 `.orchd/`）。没装的话面板会给出接入入口，不会静默失败。
- **Python 3** 在 PATH 上（`python` / `py -3` / `python3` 依次探测，也可在配置里写死 `pythonPath`）——
  面板跑的是**项目自带的**引擎入口 `python <项目>/.orchd/__main__.py`，插件不自带、不安装引擎。

## 只读保证

这是硬约束，不是口号：

- 命令白名单 **fail-closed**：不在白名单里的子进程调用根本不 spawn，被拒时记一行结构化日志。
- 子进程环境**剥掉会话身份**，读命令不会带出任何会被引擎当成「有人在动这个任务」的变量。
- 不直读账本、不碰锁、不写项目文件；面板不做文件导出（诊断信息只复制到剪贴板）。
- 开发期在**真引擎、真账本、真 git 仓库**上跑只读冒烟：比对工作区文件哈希、账本事件数、`git status`，要求零变更。

## 配置
```

</details>

**依据 2 · 作者声明**：[README.md:82-91](https://github.com/7bder/dsh-plugin-orchd/blob/1d01737c5656cfc01d74be30ba6e1ffd2a8114e8/README.md#L82-L91)

TTL和配置边界

<details>
<summary>查看原文（10行）</summary>

```text
| `requestTimeoutMs` | `20000` | 单次引擎调用超时（超时与「引擎报错」在 UI 上是两种状态） |
| `cacheTtlMs` / `pollTtlMs` / `detectTtlMs` | `5000` / `30000` / `10000` | 看板 / 轮询 / 四态检测的缓存 TTL |
| `maxProjectContexts` | `8` | 每会话项目上下文的 LRU 上限 |
| `orchdCoreRepo` | `null` | 接入入口里展示的引擎仓库地址 |
| `allowRoots` | `[]` | 调试用白名单；空 = 不额外收敛 |

## HTTP API

面板的数据全部来自插件自己注册的 8 条同源路由（会话绑定，前端只传 `sessionId`，不传路径）：

```

</details>

**依据 3 · 源码核查**：[lib/index.js:35-58](https://github.com/7bder/dsh-plugin-orchd/blob/1d01737c5656cfc01d74be30ba6e1ffd2a8114e8/lib/index.js#L35-L58)

缓存、CLI与effect路由生命周期

<details>
<summary>查看原文（24行）</summary>

```text
export function apply(ctx, rawConfig) {
  const { config, warnings } = normalizeConfig(rawConfig)
  for (const warning of warnings) ctx.logger?.warn?.(`orchd-tasks: config: ${warning}`)

  const caches = createProjectCaches(config)
  const cli = createCliInvoker(config, undefined, ctx.logger)
  const host = {
    moduleLoadedAt: MODULE_LOADED_AT,
    // cache.js 的求值时刻。HMR 级联重载时两个值会一起刷新；
    // 面板底部的「宿主模块」行只显示 moduleLoadedAt，这里同时回传以便分辨是哪个模块被换了。
    cacheModuleLoadedAt: CACHE_MODULE_LOADED_AT,
    pid: process.pid,
    uptimeMs: Math.round(process.uptime() * 1000)
  }
  const deps = { ctx, config, caches, cli, host }

  ctx.effect(
    () => routes(deps, (route) => ctx.webServer.register(route)),
    `orchd-tasks: prefix ${API_PREFIX}`
  )

  // ── 安装入口 A 路径的斜杠命令（P1b，FR-3.2）──────────────────────────────
  //
  // 用 **软注入** `ctx.inject(['commands'], …)`：命令服务缺失时回调不执行，插件照常加载
```

</details>

**依据 4 · 源码核查**：[lib/orchd-cli.js:249-255](https://github.com/7bder/dsh-plugin-orchd/blob/1d01737c5656cfc01d74be30ba6e1ffd2a8114e8/lib/orchd-cli.js#L249-L255)

超时kill

```text
    const timer = setTimeout(() => {
      timedOut = true
      try {
        child.kill()
      } catch {
        /* 忽略：可能已退出 */
      }
```

#### 缺口

- 大项目轮询CPU与错误恢复工时未知
  **影响**：总成本与新鲜度收益未知
  **进一步探讨**：固定任务规模测CLI调用量、时延、缓存陈旧和人工排障

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证边界及当前采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是将“插件只读策略+实际引擎hash+来源校验结果+数据采集时间”作为面板能力凭据，能比笼统只读说明更快发现边界漂移。最小实验更换引擎、改变status副作用、切换项目与模拟未认证请求，对照当前面板，测错误项目/陈旧数据/越界调用是否被发现及运维成本；若无需这些标记也同样可控则不增加复杂度。当前建议观察，尤其Web远程暴露前先验收来源与会话权限。受信本地项目可评估只读查阅，但先验证工作区hash、账本事件数和git状态无变化；确认安装提示属于额外用户消息，不自动批准执行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/orchd-cli.js:20-55](https://github.com/7bder/dsh-plugin-orchd/blob/1d01737c5656cfc01d74be30ba6e1ffd2a8114e8/lib/orchd-cli.js#L20-L55)

可复核的只读策略

<details>
<summary>查看原文（36行）</summary>

```text
export const CHILD_ENV = Object.freeze({
  /** 关闭僵尸会话自动回收（`status` 会做 prune_orphans + auto_clean）。 */
  ORCHD_AUTO_CLEAN: 'off',
  /** 关闭回收留痕的 stderr 输出，保证 stdout 干净。 */
  ORCHD_QUIET: '1',
  /** 避免中文在管道下的编码异常。 */
  PYTHONIOENCODING: 'utf-8',
  /** 不在项目内产生 `__pycache__`（插件自己的加固，非引擎要求）。 */
  PYTHONDONTWRITEBYTECODE: '1'
})

/**
 * 读命令白名单（fail-closed）。
 *
 * 每一项声明允许的参数形态；`args` 里 `:task-id` 之类的占位符由调用方按自身语义校验，
 * 这里只做「形状」匹配：固定词必须逐字相等，`<>` 表示一个自由参数。
 *
 * 刻意**不**包含（docs/03 第 4.1/4.3/9 节的理由）：
 *   - `request`：本参考项目 `config.allow_auto_claim: true`，会真的认领任务（高危）；
 *   - `watchdog --takeover` / `doctor --fix`：flag 触发的写路径；
 *   - `session current`：会写 `last_seen`；
 *   - `git` / `check`：前者是写操作的入口，后者昂贵。
 */
export const READ_WHITELIST = Object.freeze([
  { name: 'status', shapes: [[], ['--all'], ['<task-id>'], ['--text']], why: '全局快照 / 单任务卡片' },
  { name: 'show', shapes: [['<task-id>']], why: 'status <id> 的别名' },
  { name: 'pool', shapes: [[], ['--all']], why: '就绪池 / 下游阻塞数（FR-7.3）' },
  { name: 'review', shapes: [['--task', '<task-id>', '--show']], why: '审查意见历史（FR-8.3）' },
  { name: 'validate', shapes: [[], ['<path>']], why: '定义层合法性（broken 判定辅助）' },
  // `ideas` 只有 `list` 一个子命令（实测 `ideas --help`：usage: orchd ideas [-h] {list} ...），
  // 且它只读 JSON。`idea`（单数）才是写命令（propose / confirm / drop），**不在白名单**。
  { name: 'ideas', shapes: [['list']], why: 'IDEAS 清单（title/id/status，FR-13）' }
])

/** 结构性危险词：即使出现在白名单命令的额外参数里也直接拒绝。 */
const FORBIDDEN_TOKENS = new Set(['--fix', '--takeover', '--auto-claim', '--write', '--force'])
```

</details>

**依据 2 · 源码核查**：[lib/routes.js:59-65](https://github.com/7bder/dsh-plugin-orchd/blob/1d01737c5656cfc01d74be30ba6e1ffd2a8114e8/lib/routes.js#L59-L65)

采集时间与elapsed可形成状态锚点

```text
/** 统一包络的构造器。 */
export function envelope({ ok, data, error, startedAt }) {
  const elapsedMs = Date.now() - startedAt
  return {
    ok,
    ...(ok ? { data } : { error }),
    meta: { fetchedAt: new Date().toISOString(), elapsedMs }
```

**依据 3 · 源码核查**：[lib/install-entry.js:99-107](https://github.com/7bder/dsh-plugin-orchd/blob/1d01737c5656cfc01d74be30ba6e1ffd2a8114e8/lib/install-entry.js#L99-L107)

安装注入是独立动作

```text
export function injectInstallPrompt({ ctx, sessionId, text }) {
  const support = probeInjectSupport(ctx, sessionId)
  if (support.supported !== true) {
    return { injected: false, reason: support.reason }
  }
  const agent = ctx.get('agents').get(sessionId)
  const message = buildUserMessage(text)
  agent.steer(message)
  return { injected: true, reason: null, messageId: message.id }
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
