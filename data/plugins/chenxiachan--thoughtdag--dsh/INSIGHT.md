# dsh-thoughtdag

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[cd267d2](https://github.com/chenxiachan/thoughtdag/tree/cd267d2306cf58cef691effdb2aa8bdc23f6a044/dsh)

<!-- BEGIN META -->
[![GitHub ★ 725](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=725&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chenxiachan/thoughtdag) [![npm 30d 5,918](https://img.shields.io/static/v1?label=npm+30d&message=5%2C918&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-thoughtdag) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-thoughtdag)
<!-- END META -->

> **功能**：将 ThoughtDAG 图形画布嵌入 DSH 并桥接会话读取和写回。

> **亮点**：[Q02](#research-q02) 将图节点映射为宿主会话动作；不是历史真实性或模型理解的证明。

> **主要限制**：[Q03](#research-q03) Host 检查不是完整鉴权，why 构建产物当前未验证；[Q02](#research-q02) 写回会改变会话。

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
  - [Q01 · 谁需要会话画布，与原生 DSH 有何区别？](#detail-section-11)
  - [Q02 · fork、inject 和 followup 如何变成宿主动作？](#detail-section-12)
  - [Q03 · Host 围栏和 why 功能能证明什么？](#detail-section-13)
  - [Q04 · 采用、失败和退出需要什么？](#detail-section-14)
  - [Q05 · 如何让画布写回更可审阅？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要组织历史会话和从图节点继续的 DSH 用户。

原生会话和手工笔记已能查看历史、继续对话；画布增加关系视图与桥接，但需人工核对。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话画布 | 整理历史 | 图关系需核对 |
| 分支和注入 | 继续或改变上下文 | 产生宿主状态 |
| why | 查询历史 | why.mjs 需构建，日志不证明原因 |
| Host 围栏 | 限定 Host | 不等于完整鉴权 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH Web 与 Node | 必需 | 宿主画布和桥 | 不可加载 |
| 构建 SPA | 必需 | 展示画布 | 无页面 |
| why 构建和索引 | 可选 | 历史查询 | 返回不可用 |
| 用户授权会话 | 写回必需 | fork 和继续 | 停止操作 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选隔离会话 | 核对敏感资料 |
| 浏览 | 用户查看节点与来源 | 回原文确认 |
| 写回 | 用户选分支和提示 | 核对目标和边界 |
| 退出 | 用户检查新会话 | 不假定副作用撤销 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | Node、构建和存储 | 兼容配置 | why 未构建 |
| 持续 | 模型与索引 | 复核关系 | 净收益未知 |
| 失败 | 在途会话和模型 | 核对写回状态 | 不盲重试 |
| 退出 | 会话和历史 | 清点分支与资料 | 无自动撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话视图 | 同源画布桥 | 阅读收益 |
| 写回 | fork/inject/prompt 路由 | 实际宿主成功 |
| why | 动态加载设计 | 构建产物和历史真实性 |

> **思考**：[Q03](#research-q03) Host 检查不是完整鉴权，why 构建产物当前未验证；[Q02](#research-q02) 写回会改变会话。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将图节点映射为宿主会话动作；不是历史真实性或模型理解的证明。

[Q02](#research-q02) 分支需完成轮次，inject 和 prompt 会改变宿主状态；[Q03](#research-q03) why 依赖构建产物。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) Host 检查不是完整鉴权，why 构建产物当前未验证；[Q02](#research-q02) 写回会改变会话。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 用隔离会话并核对引用；不明写回先回原文。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包静态核查，未构建 why、运行宿主或模型。

- 已检查：作者 README、包清单、源码路径 dsh/package.json、dsh/lib/index.js、dsh/lib/client.js、dsh/scripts/build.mjs 及固定范围 inventory；组件：dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 DSH 子包静态核查 host、client 和 build；未构建根 why 实现或运行宿主。
- 下一步：隔离 profile 构建并测试完成/开放轮次、写回、Host 限制与 why 缺失。

**分析版本**

- **仓库**：[chenxiachan/thoughtdag](https://github.com/chenxiachan/thoughtdag)
- **版本号**：0.5.27（[固定提交 cd267d2](https://github.com/chenxiachan/thoughtdag/tree/cd267d2306cf58cef691effdb2aa8bdc23f6a044)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提议写回前绑定目标与来源版本，以误操作和用户负担对照。

隔离 profile 构建并测试完成/开放轮次、写回、Host 限制与 why 缺失。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 2022 | 1514 | 442 | — |
| .md | source | 1 | 135 | — | — | 1625 |
| .mjs | source | 2 | 128 | 86 | 34 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/chenxiachan/thoughtdag/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=21&color=737b86&logo=github)](https://github.com/chenxiachan/thoughtdag/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=23&color=737b86&logo=github)](https://github.com/chenxiachan/thoughtdag/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 子包会话画布、写回和 why 构建边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要会话画布，与原生 DSH 有何区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向希望把 DSH 会话作为图形关系浏览、编辑并从某处继续的用户。原生会话列表、手工笔记和分支已有类似基础功能；本子包将画布嵌入宿主并桥接会话读写。图结构是用户或模型组织的表示，不证明每条关系或历史解释真实；画布不只是只读浏览，因为有 fork、inject 和 followup。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/package.json:1-16](https://github.com/chenxiachan/thoughtdag/blob/cd267d2306cf58cef691effdb2aa8bdc23f6a044/dsh/package.json#L1-L16)

子包身份和运行要求。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "dsh-thoughtdag",
  "version": "0.5.27",
  "description": "ThoughtDAG for DeepSeek Harness: turn the current DSH session into an editable thought graph on an infinite canvas. Source, releases and issues: github.com/chenxiachan/thoughtdag",
  "author": "Xia Chen",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/chenxiachan/thoughtdag.git",
    "directory": "dsh"
  },
  "homepage": "https://github.com/chenxiachan/thoughtdag/tree/main/dsh#readme",
  "bugs": "https://github.com/chenxiachan/thoughtdag/issues",
  "type": "module",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
```

</details>

**依据 2 · 源码核查**：[dsh/lib/index.js:1-26](https://github.com/chenxiachan/thoughtdag/blob/cd267d2306cf58cef691effdb2aa8bdc23f6a044/dsh/lib/index.js#L1-L26)

host 描述同源 SPA 和会话桥。

<details>
<summary>查看原文（26行）</summary>

```text
// dsh-thoughtdag host half — a plain Cordis plugin that mounts the
// ThoughtDAG SPA under a prefix on the EXISTING DSH web server (no second
// process, no second port) and bridges DSH sessions to the canvas.
//
// Layout of this file, mirroring dsh-synapse:
//   - the static ThoughtDAG build lives in ../dist-app (a Vite build with
//     base = the mount prefix, so every asset reference is already
//     /<prefix>/... and resolves through the routes registered below)
//   - /<prefix>/            the SPA shell (index.html)
//   - /<prefix>/<asset...>  static assets (prefix route, path-traversal safe)
//   - /<prefix>/api/...     the session bridge (Host-header fenced)
//
// The bridge's read direction feeds the ThoughtDAG dsh-session adapter:
// the adapter parses the same event JSONL a real ~/.dsh session log holds,
// so the bridge serves a session's durable events as that text.
//
// The write direction is how an edited canvas becomes the model's next
// context — through DSH's own primitives, never by touching a log:
//   POST /sessions/<id>/fork      { afterTurn | atSeq }  → a child session that
//                                 inherits the prefix up to that turn boundary
//                                 (sessionController.fork: the UI sees it too)
//   POST /sessions/<id>/inject    { text | blocks }      → model-facing context
//                                 for the next step (agent.inject: no wake,
//                                 shown in the transcript as injected context)
//   POST /sessions/<id>/followup  { text | blocks, mode } → a user prompt that
//                                 wakes the agent (sessionController.prompt)
```

</details>

**依据 3 · 源码核查**：[dsh/lib/client.js:252-260](https://github.com/chenxiachan/thoughtdag/blob/cd267d2306cf58cef691effdb2aa8bdc23f6a044/dsh/lib/client.js#L252-L260)

画布选择会话回宿主。

```text
        // the canvas forked or continued a session: stage it and go back to the
        // chat, which now shows exactly the context the canvas produced
        if (event.data.type === 'td:select-session' && typeof event.data.session === 'string') {
          // 0.1.2 renamed the selector: the ISessions contract exposes open(id);
          // older runtimes (0.1.1) still call it select
          const select = ctx.sessions.open ?? ctx.sessions.select
          select.call(ctx.sessions, event.data.session)
          if (event.data.close !== false) close()
          syncCurrent()
```

#### 缺口

- 未运行真实宿主和用户任务
  **影响**：不能证明理解或交接收益
  **进一步探讨**：固定会话比较原生时间线和画布的准确率及耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · fork、inject 和 followup 如何变成宿主动作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

host 会话桥为 POST 解析 session 和请求体；fork 可用指定序号或 afterTurn 的完成边界，不存在或仍开放的轮次被拒绝；inject 调 agent.inject，仅提供后续模型上下文；followup 通过 sessionController.prompt 提交用户内容并可能唤醒 Agent。画布视图因此能改变会话状态和触发后续动作，不是纯展示；一次请求 accepted 也不等于模型任务完成。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/lib/index.js:1125-1148](https://github.com/chenxiachan/thoughtdag/blob/cd267d2306cf58cef691effdb2aa8bdc23f6a044/dsh/lib/index.js#L1125-L1148)

按完成轮次 fork 或新建会话。

<details>
<summary>查看原文（24行）</summary>

```text
  // dsh mirror forks at the exact turn named by its user-message id, so later
  // turns (including sibling work) cannot leak into the branch. Otherwise a
  // fresh session receives the compiled canvas context.
  const continueId = typeof body?.harness?.session === 'string' && body.harness.session ? body.harness.session : null
  const forkId = typeof body?.harness?.forkSession === 'string' && body.harness.forkSession ? body.harness.forkSession : null
  const forkAnchor = typeof body?.harness?.forkAnchor === 'string' && body.harness.forkAnchor ? body.harness.forkAnchor : null
  let sessionId = null
  let forkedFrom = null
  if (continueId && (liveSession(ctx, continueId) || (await eventsOfSession(ctx, continueId)) !== null)) {
    sessionId = continueId
  } else if (forkId && forkAnchor) {
    const events = await eventsOfSession(ctx, forkId)
    if (events !== null) {
      const turn = turnsOf(events).find(t => t.userMessageId === forkAnchor)
      if (!turn) throw new HttpError(400, 'no such fork anchor: ' + forkAnchor)
      if (turn.endSeq === null) throw new HttpError(409, 'turn ' + turn.turn + ' is still open; a fork needs a completed turn')
      sessionId = (await ctx.sessionController.fork({ sessionId: forkId, atSeq: turn.endSeq })).sessionId
      forkedFrom = forkId
    }
  }
  if (!sessionId) {
    const cwd = typeof body?.harness?.cwd === 'string' && body.harness.cwd ? body.harness.cwd : null
    sessionId = (await ctx.sessionController.create(await sessionCreateRequest(cwd))).sessionId
  }
```

</details>

**依据 2 · 源码核查**：[dsh/lib/index.js:1676-1713](https://github.com/chenxiachan/thoughtdag/blob/cd267d2306cf58cef691effdb2aa8bdc23f6a044/dsh/lib/index.js#L1676-L1713)

显式 fork、inject、followup 路由。

<details>
<summary>查看原文（38行）</summary>

```text
      const write = /^\/sessions\/([^/]+)\/(fork|inject|followup)$/.exec(path)
      if (write !== null && req.method === 'POST') {
        const id = decodeURIComponent(write[1])
        const body = await readJson(req, MAX_WRITE_BODY_BYTES)
        if (write[2] === 'fork') {
          // the boundary: an explicit seq, or the end of a named turn
          let atSeq = typeof body?.atSeq === 'number' ? body.atSeq : undefined
          if (typeof body?.afterTurn === 'number') {
            const events = await eventsOfSession(ctx, id)
            if (events === null) return sendJson(res, 404, { error: 'no such session' })
            const t = turnsOf(events).find(x => x.turn === body.afterTurn)
            if (!t) return sendJson(res, 400, { error: 'no such turn: ' + body.afterTurn })
            if (t.endSeq === null) return sendJson(res, 409, { error: 'turn ' + body.afterTurn + ' is still open; a fork needs a completed turn' })
            atSeq = t.endSeq
          }
          try {
            const r = await ctx.sessionController.fork({ sessionId: id, ...(atSeq !== undefined ? { atSeq } : {}) })
            return sendJson(res, 200, { session: r.sessionId, parent: id, atSeq: atSeq ?? null })
          } catch (error) {
            const code = error?.code ?? error?.name ?? 'fork failed'
            return sendJson(res, /NOT_FOUND/.test(String(code)) ? 404 : 409, { error: String(error?.message ?? code), code })
          }
        }
        const content = contentOf(body)
        if (write[2] === 'inject') {
          const agent = await agentOf(ctx, id)
          const message = { id: 'td-' + randomUUID(), role: 'user', content, source: SOURCE }
          agent.inject(message)
          return sendJson(res, 200, { accepted: true, session: id, messageId: message.id })
        }
        // followup: a person's prompt from the canvas — the controller owns
        // the user source and the queue/steer semantics the UI uses
        const requestId = 'td-' + randomUUID()
        const mode = body?.mode === 'steer' ? 'steer' : 'queue'
        await ctx.sessionController.prompt({ requestId, sessionId: id, mode, content }, AbortSignal.timeout(30000))
        return sendJson(res, 200, { accepted: true, session: id, requestId, mode })
      }
      return sendJson(res, 404, { error: 'not found' })
```

</details>

**依据 3 · 源码核查**：[dsh/lib/client.js:252-260](https://github.com/chenxiachan/thoughtdag/blob/cd267d2306cf58cef691effdb2aa8bdc23f6a044/dsh/lib/client.js#L252-L260)

画布后选中会话。

```text
        // the canvas forked or continued a session: stage it and go back to the
        // chat, which now shows exactly the context the canvas produced
        if (event.data.type === 'td:select-session' && typeof event.data.session === 'string') {
          // 0.1.2 renamed the selector: the ISessions contract exposes open(id);
          // older runtimes (0.1.1) still call it select
          const select = ctx.sessions.open ?? ctx.sessions.select
          select.call(ctx.sessions, event.data.session)
          if (event.data.close !== false) close()
          syncCurrent()
```

#### 缺口

- 未运行 DSH 会话与下游工具
  **影响**：不能证明写回、审批或最终结果
  **进一步探讨**：隔离会话核查分叉点、注入内容、唤醒及实际后果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Host 围栏和 why 功能能证明什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

API 按 Host 字符串白名单接受 localhost、127.0.0.1 和配置主机；这是一个入口条件，不能单独当成用户身份认证、完整浏览器 origin 防护或所有网络安全。why 层动态 import ./why.mjs，加载失败记录错误并不注册；固定 checkout 的 dsh/lib 仅有 index.js 和 client.js，构建脚本将根 CLI 源打包成该文件，本轮未构建，故不声称 why 真实可用。即便历史索引可用，日志只能支持来源，不能单独证明修改动机。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/lib/index.js:1382-1394](https://github.com/chenxiachan/thoughtdag/blob/cd267d2306cf58cef691effdb2aa8bdc23f6a044/dsh/lib/index.js#L1382-L1394)

Host 白名单。

<details>
<summary>查看原文（13行）</summary>

```text
export async function apply(ctx, config) {
  const prefix = typeof config?.mountPrefix === 'string' && config.mountPrefix.startsWith('/') && config.mountPrefix.length > 1
    ? config.mountPrefix.replace(/\/+$/, '')
    : '/thoughtdag'
  const trustedHosts = new Set(['localhost', '127.0.0.1', ...[...(config?.trustedHosts ?? [])].map(h => String(h).trim().toLowerCase()).filter(Boolean)])

  // the interfaces the canvas registered (memory only: a restart forgets them, the canvas registers again at boot)
  let registeredProviders = []
  const api = async (req, res) => {
    try {
      const hostname = (typeof req.headers.host === 'string' ? req.headers.host : '').replace(/:\d+$/, '').toLowerCase()
      if (!trustedHosts.has(hostname)) return sendJson(res, 403, { error: 'untrusted Host header' })
      const url = new URL(req.url ?? '/', 'http://dsh.local')
```

</details>

**依据 2 · 源码核查**：[dsh/lib/index.js:1310-1336](https://github.com/chenxiachan/thoughtdag/blob/cd267d2306cf58cef691effdb2aa8bdc23f6a044/dsh/lib/index.js#L1310-L1336)

why 动态加载及失败。

<details>
<summary>查看原文（27行）</summary>

```text
const whyStatus = { loaded: false, tools: [], command: false, prompt: false, error: null }

// the harness's tool names: one family, no collision with its own read/find tools
const TOOL_NAMES = { why_check: 'why_check', why_file: 'why_file', find: 'why_find', recall_turn: 'why_recall' }
const PATH_ARGS = new Set(['path'])

const WHY_PROMPT = `ThoughtDAG why layer. The tools why_check, why_file, why_find and why_recall read the local index of past agent conversations (Claude Code, Codex, this harness) — evidence from session logs, not opinion.
- Before editing a file that may have history, call why_check(path); if it has history, why_file(path) lists the turns that changed it: when, what was asked, what changed, and what the answer said about it.
- why_find(phrase) finds where exact words were asked or answered; why_recall(session, turn) reads one turn in full.
Cite what you learn briefly; do not restate whole turns.`

/** the loaded why library, for the HTTP routes the canvas asks (null until installWhyLayer ran) */
let whyLib = null

async function installWhyLayer(ctx, config) {
  const wantTools = config?.whyTools !== false
  const wantPrompt = config?.whyPrompt !== false
  if (!wantTools && !wantPrompt) return
  let why
  try {
    why = await import('./why.mjs')
    why.setQuiet?.(true)
  } catch (error) {
    whyStatus.error = error instanceof Error ? error.message : String(error)
    ctx.logger.warn('[dsh-thoughtdag] why layer not loaded: ' + whyStatus.error)
    console.error('[dsh-thoughtdag] why layer not loaded: ' + whyStatus.error)
    return
```

</details>

**依据 3 · 源码核查**：[dsh/scripts/build.mjs:43-55](https://github.com/chenxiachan/thoughtdag/blob/cd267d2306cf58cef691effdb2aa8bdc23f6a044/dsh/scripts/build.mjs#L43-L55)

构建时生成 why.mjs。

<details>
<summary>查看原文（13行）</summary>

```text
// The why layer: the CLI's library, bundled for the host (Node), so the plugin
// registers the same four questions as native harness tools and a /why command
// esbuild is the one tool that cannot run as a node script: its installer
// overwrites bin/esbuild with the native binary on macOS and Linux (the JS
// shim survives only on Windows), so node on it dies with a SyntaxError. Its
// JS API locates the platform binary itself — the same flags as the root
// `cli:build`, resolved from the repo's own esbuild, still no shell anywhere.
const whyOut = resolve(__dirname, '../lib/why.mjs')
await createRequire(resolve(repo, 'package.json'))('esbuild').build({
  entryPoints: [resolve(repo, 'cli/src/lib.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
```

</details>

**依据 4 · 源码核查**：[dsh/lib/index.js:1312-1319](https://github.com/chenxiachan/thoughtdag/blob/cd267d2306cf58cef691effdb2aa8bdc23f6a044/dsh/lib/index.js#L1312-L1319)

why 指引来源及用途。

```text
// the harness's tool names: one family, no collision with its own read/find tools
const TOOL_NAMES = { why_check: 'why_check', why_file: 'why_file', find: 'why_find', recall_turn: 'why_recall' }
const PATH_ARGS = new Set(['path'])

const WHY_PROMPT = `ThoughtDAG why layer. The tools why_check, why_file, why_find and why_recall read the local index of past agent conversations (Claude Code, Codex, this harness) — evidence from session logs, not opinion.
- Before editing a file that may have history, call why_check(path); if it has history, why_file(path) lists the turns that changed it: when, what was asked, what changed, and what the answer said about it.
- why_find(phrase) finds where exact words were asked or answered; why_recall(session, turn) reads one turn in full.
Cite what you learn briefly; do not restate whole turns.`
```

#### 缺口

- 未构建、安装或验证宿主认证
  **影响**：无法证明 why 可用、远程保护和解释正确
  **进一步探讨**：隔离构建并核查产物、授权、空索引及来源回读。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用、失败和退出需要什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH Web、Node 版本、构建后的 SPA 和可访问会话；history/why 和模型代理还依赖对应构建、索引或外部服务。首次要明确会话和敏感资料范围，持续承担浏览、模型及写回审核；失败需核查实际会话是否已经 fork 或收到 prompt，不能只根据请求超时重试。退出要关面板并检查新会话与写入，卸载不撤销模型或外部操作。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/package.json:11-16](https://github.com/chenxiachan/thoughtdag/blob/cd267d2306cf58cef691effdb2aa8bdc23f6a044/dsh/package.json#L11-L16)

Node 与 host 入口。

```text
  "homepage": "https://github.com/chenxiachan/thoughtdag/tree/main/dsh#readme",
  "bugs": "https://github.com/chenxiachan/thoughtdag/issues",
  "type": "module",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
```

**依据 2 · 源码核查**：[dsh/package.json:23-32](https://github.com/chenxiachan/thoughtdag/blob/cd267d2306cf58cef691effdb2aa8bdc23f6a044/dsh/package.json#L23-L32)

构建和包内容。

<details>
<summary>查看原文（10行）</summary>

```text
  },
  "files": [
    "lib",
    "dist-app",
    "cordis.patch.yml",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "node scripts/build.mjs ..",
```

</details>

**依据 3 · 源码核查**：[dsh/lib/index.js:1125-1148](https://github.com/chenxiachan/thoughtdag/blob/cd267d2306cf58cef691effdb2aa8bdc23f6a044/dsh/lib/index.js#L1125-L1148)

fork 或创建会话。

<details>
<summary>查看原文（24行）</summary>

```text
  // dsh mirror forks at the exact turn named by its user-message id, so later
  // turns (including sibling work) cannot leak into the branch. Otherwise a
  // fresh session receives the compiled canvas context.
  const continueId = typeof body?.harness?.session === 'string' && body.harness.session ? body.harness.session : null
  const forkId = typeof body?.harness?.forkSession === 'string' && body.harness.forkSession ? body.harness.forkSession : null
  const forkAnchor = typeof body?.harness?.forkAnchor === 'string' && body.harness.forkAnchor ? body.harness.forkAnchor : null
  let sessionId = null
  let forkedFrom = null
  if (continueId && (liveSession(ctx, continueId) || (await eventsOfSession(ctx, continueId)) !== null)) {
    sessionId = continueId
  } else if (forkId && forkAnchor) {
    const events = await eventsOfSession(ctx, forkId)
    if (events !== null) {
      const turn = turnsOf(events).find(t => t.userMessageId === forkAnchor)
      if (!turn) throw new HttpError(400, 'no such fork anchor: ' + forkAnchor)
      if (turn.endSeq === null) throw new HttpError(409, 'turn ' + turn.turn + ' is still open; a fork needs a completed turn')
      sessionId = (await ctx.sessionController.fork({ sessionId: forkId, atSeq: turn.endSeq })).sessionId
      forkedFrom = forkId
    }
  }
  if (!sessionId) {
    const cwd = typeof body?.harness?.cwd === 'string' && body.harness.cwd ? body.harness.cwd : null
    sessionId = (await ctx.sessionController.create(await sessionCreateRequest(cwd))).sessionId
  }
```

</details>

**依据 4 · 源码核查**：[dsh/lib/index.js:1249-1256](https://github.com/chenxiachan/thoughtdag/blob/cd267d2306cf58cef691effdb2aa8bdc23f6a044/dsh/lib/index.js#L1249-L1256)

注入及提交后续请求。

```text
    const inheritsSessionContext = (continueId && sessionId === continueId) || forkedFrom
    const injectContext = inheritsSessionContext ? (typeof body?.harness?.extraContext === 'string' ? body.harness.extraContext : '') : context
    if (injectContext) agent.inject({ id: 'td-' + randomUUID(), role: 'user', content: [{ type: 'text', text: injectContext }], source: SOURCE })
    const promptContent = [{ type: 'text', text: question }]
    for (const img of Array.isArray(body?.images) ? body.images : []) {
      if (img && typeof img.data === 'string' && IMAGE_MEDIA.has(img.mimeType)) promptContent.push({ type: 'image', mediaType: img.mimeType, data: img.data })
    }
    await ctx.sessionController.prompt({ requestId, sessionId, mode: 'queue', content: promptContent }, AbortSignal.timeout(30000))
```

#### 缺口

- 未测实际依赖、模型费用及退出
  **影响**：不能保证兼容、净收益或撤销
  **进一步探讨**：隔离 profile 核对产物、任务费用及新会话状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何让画布写回更可审阅？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有 fork 限定完成轮次、宿主 prompt 和 inject 已保留会话语义；简单增加分支和提示不是新贡献。未验证方案是在写回前展示目标会话、原节点引用及拟注入内容，绑定可检验的版本并要求用户确认；若历史已变化则提示重新选择。对照现有画布测试误选会话、过期引用、误注入和人工时间；若误操作未减少或交互成本过高则否定，用户已授权的动作不应被重复询问。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/lib/index.js:1125-1148](https://github.com/chenxiachan/thoughtdag/blob/cd267d2306cf58cef691effdb2aa8bdc23f6a044/dsh/lib/index.js#L1125-L1148)

现有完成轮次 fork。

<details>
<summary>查看原文（24行）</summary>

```text
  // dsh mirror forks at the exact turn named by its user-message id, so later
  // turns (including sibling work) cannot leak into the branch. Otherwise a
  // fresh session receives the compiled canvas context.
  const continueId = typeof body?.harness?.session === 'string' && body.harness.session ? body.harness.session : null
  const forkId = typeof body?.harness?.forkSession === 'string' && body.harness.forkSession ? body.harness.forkSession : null
  const forkAnchor = typeof body?.harness?.forkAnchor === 'string' && body.harness.forkAnchor ? body.harness.forkAnchor : null
  let sessionId = null
  let forkedFrom = null
  if (continueId && (liveSession(ctx, continueId) || (await eventsOfSession(ctx, continueId)) !== null)) {
    sessionId = continueId
  } else if (forkId && forkAnchor) {
    const events = await eventsOfSession(ctx, forkId)
    if (events !== null) {
      const turn = turnsOf(events).find(t => t.userMessageId === forkAnchor)
      if (!turn) throw new HttpError(400, 'no such fork anchor: ' + forkAnchor)
      if (turn.endSeq === null) throw new HttpError(409, 'turn ' + turn.turn + ' is still open; a fork needs a completed turn')
      sessionId = (await ctx.sessionController.fork({ sessionId: forkId, atSeq: turn.endSeq })).sessionId
      forkedFrom = forkId
    }
  }
  if (!sessionId) {
    const cwd = typeof body?.harness?.cwd === 'string' && body.harness.cwd ? body.harness.cwd : null
    sessionId = (await ctx.sessionController.create(await sessionCreateRequest(cwd))).sessionId
  }
```

</details>

**依据 2 · 源码核查**：[dsh/lib/index.js:1676-1713](https://github.com/chenxiachan/thoughtdag/blob/cd267d2306cf58cef691effdb2aa8bdc23f6a044/dsh/lib/index.js#L1676-L1713)

现有直接写回路由。

<details>
<summary>查看原文（38行）</summary>

```text
      const write = /^\/sessions\/([^/]+)\/(fork|inject|followup)$/.exec(path)
      if (write !== null && req.method === 'POST') {
        const id = decodeURIComponent(write[1])
        const body = await readJson(req, MAX_WRITE_BODY_BYTES)
        if (write[2] === 'fork') {
          // the boundary: an explicit seq, or the end of a named turn
          let atSeq = typeof body?.atSeq === 'number' ? body.atSeq : undefined
          if (typeof body?.afterTurn === 'number') {
            const events = await eventsOfSession(ctx, id)
            if (events === null) return sendJson(res, 404, { error: 'no such session' })
            const t = turnsOf(events).find(x => x.turn === body.afterTurn)
            if (!t) return sendJson(res, 400, { error: 'no such turn: ' + body.afterTurn })
            if (t.endSeq === null) return sendJson(res, 409, { error: 'turn ' + body.afterTurn + ' is still open; a fork needs a completed turn' })
            atSeq = t.endSeq
          }
          try {
            const r = await ctx.sessionController.fork({ sessionId: id, ...(atSeq !== undefined ? { atSeq } : {}) })
            return sendJson(res, 200, { session: r.sessionId, parent: id, atSeq: atSeq ?? null })
          } catch (error) {
            const code = error?.code ?? error?.name ?? 'fork failed'
            return sendJson(res, /NOT_FOUND/.test(String(code)) ? 404 : 409, { error: String(error?.message ?? code), code })
          }
        }
        const content = contentOf(body)
        if (write[2] === 'inject') {
          const agent = await agentOf(ctx, id)
          const message = { id: 'td-' + randomUUID(), role: 'user', content, source: SOURCE }
          agent.inject(message)
          return sendJson(res, 200, { accepted: true, session: id, messageId: message.id })
        }
        // followup: a person's prompt from the canvas — the controller owns
        // the user source and the queue/steer semantics the UI uses
        const requestId = 'td-' + randomUUID()
        const mode = body?.mode === 'steer' ? 'steer' : 'queue'
        await ctx.sessionController.prompt({ requestId, sessionId: id, mode, content }, AbortSignal.timeout(30000))
        return sendJson(res, 200, { accepted: true, session: id, requestId, mode })
      }
      return sendJson(res, 404, { error: 'not found' })
```

</details>

#### 缺口

- 方案未实现、无用户实验
  **影响**：不能声称已确保来源或授权
  **进一步探讨**：在隔离会话模拟 stale 节点与误选目标进行盲测。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
