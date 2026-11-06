# dsh-gov-portal

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[04a69c1](https://github.com/ExElectron/dsh-gov-portal/tree/04a69c142d6f308306f0797fb4bf2abac4cc691c)

<!-- BEGIN META -->
[![GitHub ★ 55](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=55&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ExElectron/dsh-gov-portal)
<!-- END META -->

> **功能**：通过宿主 apiProxy 连接 DSH 会话、模型、权限和统计的独立政务风 WebUI。

> **亮点**：把现成Host能力接到独立政务风客户端与重新组织的入口，未增加政务业务或新执行引擎。见 [Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：自起HTTP无身份围栏，权限写全局默认且忽略结果，审批忽略accepted，turn结束可能被标办结；1:1宣称超过已核。见 [Q02](#research-q02)。

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
  - [Q01 · 门户是否接真实工具型Agent，政务术语代表什么业务？](#detail-section-11)
  - [Q02 · 新增HTTP入口、权限和审批失败是否与原Web等价？](#detail-section-12)
  - [Q03 · 相对原生Web贡献在哪里，接入维护与经济结构如何判断？](#detail-section-13)
  - [Q04 · 当前是否值得用于真实事项，什么方向应先验证？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：偏好政务门户外观的单用户操作已有DSH，工单/卷宗是会话呈现而非真实政务业务。见 [Q01](#research-q01)。

DSH原Web已提供会话、权限、模型和审批；另可用原UI扩展布局。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话提交 | 使用真实Agent | 仅text，继承Host |
| 事件回执 | 文本/工具/轨迹 | 断流补帧未证 |
| 模型/模式 | 调Host目录与选择 | 协议兼容需核 |
| 权限 | 改新会话默认 | 非当前会话独立范围 |
| 审批/问题 | respond用户选择 | accepted未检查 |
| 历史/导出 | 查Host会话JSONL | 新入口身份未约束 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Host apiProxy固定合同 | 正常模式必需 | 会话/模型/权限/事件 | 版本未锁定，不能推定1:1 |
| Node ^22.19或>=24 | 必需 | 独立HTTP服务 | 不在声明运行环境 |
| 127.0.0.1:3081空闲 | 默认 | 门户访问 | 冲突只日志 |
| 原Web3080 | fallback所需 | 透传回退 | 不保证安全/TLS等价 |
| 浏览器fetch/SSE | 必需 | unary/流与审批 | 断流恢复未验 |
| 可写~/.dsh配置 | 持久化所需 | 端口/计数 | 不按DSH_HOME/profile隔离 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 隔离profile并保留原Web | 不开放局域网 |
| 新会话 | 选工作区/模式/权限 | 全局默认写入另核 |
| 提交 | text到session.prompt | 以Host事件核接收 |
| 审批 | 用户respond | 必须核accepted非门户文字 |
| 结束/退出 | 原Web核真实结果/停服务 | 恢复全局默认及遗留状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Host/浏览器资源未知 | 核身份/协议/权限 | 不是独立Agent服务 |
| 持续使用 | 原模型/工具账单未知 | 跟Host协议与双配置 | 无净收益测量 |
| 失败恢复 | 重试任务费用未知 | 原Web对账审批/断流 | 不信盖章/批准文字 |
| 退出 | 会话/配置保留 | 还原权限/温度与停插件 | 不回滚工作区修改 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 真实接线 | prompt/SSE/respond到Host | 全能力1:1/版本兼容 |
| 政务风 | 会话改名与门户布局 | 真实政务业务未提供 |
| 权限 | 动态默认预设写入 | UI与实际一致需核 |
| 审批 | allowed-once/rejected提交 | accepted被忽略 |
| 办结 | turn/end呈现 | 不等独立任务验收 |

> **思考**：自起HTTP无身份围栏，权限写全局默认且忽略结果，审批忽略accepted，turn结束可能被标办结；1:1宣称超过已核。见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把现成Host能力接到独立政务风客户端与重新组织的入口，未增加政务业务或新执行引擎。见 [Q01](#research-q01)、[Q03](#research-q03)。

动态wire适配和按会话渲染可借鉴；认证边界、回执和恢复不能从内部API继承推定。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

自起HTTP无身份围栏，权限写全局默认且忽略结果，审批忽略accepted，turn结束可能被标办结；1:1宣称超过已核。见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅非敏感本机隔离观察，核原Web退路、权限/过期审批/断流，不开放多人；不符就停并恢复默认。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核客户端→Host真实接线与关键失败；未运行固定Host、模型或安全/政务验收。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、docs/harness-integration.md、lib/index.js、package.json、public/js/api.js、public/js/app.js、public/js/store.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整Host路由/配置/fallback/生命周期，浏览器API封装、创建/提交/流/审批/完成主链；未全审外观/配置导入/Markdown渲染、固定Host apiProxy和所有命名空间，未运行目标。
- 下一步：原Web/现门户/可信合同原型对五故障比较误放行、错误完成和恢复时间；未执行。

**分析版本**

- **仓库**：[ExElectron/dsh-gov-portal](https://github.com/ExElectron/dsh-gov-portal)
- **版本号**：0.1.0（[固定提交 04a69c1](https://github.com/ExElectron/dsh-gov-portal/tree/04a69c142d6f308306f0797fb4bf2abac4cc691c)）
- **版本日期**：2026-08-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

先用可信客户端合同补认证、会话权限、审批回执与结束/验收分离，以五故障和原Web对照，官方扩展点足够就不复制协议。见 [Q04](#research-q04)。

原Web/现门户/可信合同原型对五故障比较误放行、错误完成和恢复时间；未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 1039 | — | — | 12607 |
| .js | source | 8 | 3447 | 2932 | 377 | — |
| .mjs | source | 2 | 650 | 521 | 61 | — |
| .mjs | test | 9 | 932 | 774 | 108 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/ExElectron/dsh-gov-portal/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/ExElectron/dsh-gov-portal/issues?q=is%3Aissue+created%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ExElectron/dsh-gov-portal/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：门户是否接真实DSH工具循环，新增入口、权限和回执有哪些边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 门户是否接真实工具型Agent，政务术语代表什么业务？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它是以Cordis插件托管的独立Web客户端，默认127.0.0.1:3081，面向希望用政务门户风格操作已有DSH的个人用户。工单/卷宗/督办是会话、历史、轨迹的呈现名称，不是已接政务事项、机构身份或审批业务系统。基线是DSH原Web；合格结果应同一任务与会话权限下真实收发、审批和结果一致，不凭红章判断办结。

bundle注入apiProxy，Host起独立Node HTTP服务。浏览器unary封装rpcId和payload，Host用域别名映射后动态调用api[domain][method]，结果回Client；文本提交走session.prompt，模型和工具循环由已有DSH执行。门户自身没有新增自主Agent引擎。events.mux桥接为SSE，前端按当前sessionId过滤文本/工具/轨迹/审批/问题帧；审批以rpcId和approvalId回应allowed-once或rejected。因此存在真实宿主接线，不能由此推出“全部能力1:1完成验收”。

UI有明确偏差：提交仅发送text，所谓上下文轮数保存在配置，未在此提交链实施；温度尝试多个命名空间且失败静默。turn/end reason=completed甚至reason缺失就显示准予办结并可盖章，它表示本轮结束，不是独立验收任务或政府办理决定。README所列测试是作者报告，本次未运行宿主、真实对话或截图。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:1-5](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/README.md#L1-L5)

作者用途与独立UI。

```text
# dsh-gov-portal · Deepseek Harness 综合智能办事平台

一个以**中国地方政务网站视觉规范**为设计基准的独立 WebUI 插件：在独立端口（默认 **3081**）提供政务风办事大厅界面，通过宿主进程内的 **apiProxy 网关** 1:1 对接 DeepSeek Harness 的会话、模型、模式、权限、统计等**全部真实 Agent 能力**（零业务硬编码）。

界面采用可复用的政务服务门户设计语言，完整设计规范见 [`docs/design-system.md`](docs/design-system.md)；宿主集成面调研见 [`docs/harness-integration.md`](docs/harness-integration.md)。
```

**依据 2 · 源码核查**：[cordis.patch.yml:1-9](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/cordis.patch.yml#L1-L9)

宿主apiProxy注入。

```text
# dsh-gov-portal bundle patch layer：向 profile 插入本插件行。
# loader 将 import 包 main（lib/index.js 的默认导出插件），
# 在宿主进程内拉起 3081 政务平台并桥接 ctx.apiProxy。
# inject: [apiProxy] 声明对宿主 API 网关的依赖 —— Cordis 会等
# apiProxy 激活后再挂载本插件，保证桥接服务可用。
- insert:
    - id: gov-portal
      name: 'dsh-gov-portal'
      inject: [apiProxy]
```

**依据 3 · 源码核查**：[lib/index.js:174-197](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/lib/index.js#L174-L197)

同进程API与SSE。

<details>
<summary>查看原文（24行）</summary>

```text
 * 若该服务不存在，则把请求原样回退转发到主 GUI（fallbackBase）。
 */
async function handleApi(ctx, req, res, url, config) {
  const api = ctx.apiProxy ?? ctx.get?.('apiProxy', false) ?? ctx.get?.('apiProxy')
  if (!api) {
    if (!config.fallbackBase) return json(res, 502, { error: '宿主 apiProxy 服务不可用' })
    return forwardToFallback(req, res, config.fallbackBase)
  }

  const pathname = url.pathname

  // —— 流：GET /api/events.mux | /api/events.host ——
  if ((pathname === '/api/events.mux' || pathname === '/api/events.host') && req.method === 'GET') {
    const method = pathname.slice(5)
    try {
      const stream = api.events[method === 'events.mux' ? 'mux' : 'host'](
        { rpcId: uuid(), payload: {} },
        req.signal,
      )
      return await pipeSse(stream, method, res, req.signal)
    } catch (error) {
      return json(res, 500, { error: String(error?.message ?? error) })
    }
  }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:238-268](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/lib/index.js#L238-L268)

动态unary分派。

<details>
<summary>查看原文（31行）</summary>

```text
  // —— 通用 unary：POST /api/<domain>.<method> ——
  const match = UNARY_PATTERN.exec(pathname)
  if (!match) return json(res, 404, { error: `unknown api path ${pathname}` })
  const [, domainRaw, sub] = match
  const domain = DOMAIN_ALIASES[domainRaw] ?? domainRaw
  const handler = api[domain]?.[sub]
  if (typeof handler !== 'function') {
    return json(res, 404, { error: `unknown method ${domainRaw}.${sub}` })
  }
  const rpcId = typeof body?.rpcId === 'string' && body.rpcId ? body.rpcId : uuid()
  const method = `${domain}.${sub}`
  try {
    const outcome = await handler(
      { rpcId, payload: body?.payload ?? {} },
      req.signal,
    )
    return json(res, 200, {
      type: 'server-response',
      rpcId: outcome.rpcId ?? rpcId,
      result: outcome.result ?? { ok: true, value: outcome },
    })
  } catch (error) {
    return json(res, 500, {
      type: 'server-response',
      rpcId,
      result: {
        ok: false,
        error: { code: 'internal', message: String(error?.message ?? error) },
      },
    })
  }
```

</details>

**依据 5 · 源码核查**：[public/js/api.js:27-46](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/public/js/api.js#L27-L46)

客户端信封与错误。

<details>
<summary>查看原文（20行）</summary>

```text
  /** unary 调用：返回 {ok:true, value} | {ok:false, error}（业务错误不抛异常） */
  async function unary (method, payload = {}, signal) {
    const body = { type: 'client-request', rpcId: uuid(), method, payload }
    let resp
    try {
      resp = await fetch(`${BASE}/api/${method}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        signal,
      })
      if (!resp.ok) return { ok: false, error: { code: 'transport', message: `HTTP ${resp.status}` } }
      const full = await resp.json()
      if (full?.type !== 'server-response') return { ok: false, error: { code: 'transport', message: '响应信封格式错误' } }
      if (full.rpcId !== body.rpcId) return { ok: false, error: { code: 'transport', message: 'rpcId 不匹配' } }
      return full.result
    } catch (error) {
      return { ok: false, error: { code: 'transport', message: String(error?.message ?? error) } }
    }
  }
```

</details>

**依据 6 · 源码核查**：[public/js/app.js:1084-1125](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/public/js/app.js#L1084-L1125)

实际提交只发text。

<details>
<summary>查看原文（42行）</summary>

```text
  /* ================= 提交办理 ================= */
  async function submitPrompt () {
    const text = $('promptInput').value.trim()
    if (!text) { $('promptInput').focus(); return }
    const ok = await ensureSession()
    if (!ok) return
    $('btnSubmit').disabled = true

    try {
      // 权限预设：会话创建时已按所选值设置宿主默认；会话内切换通过设置面板完成，
      // 此处不再向会话发送任何权限消息（避免浪费模型 Token）。
      // 温度/上下文轮数 → 写入宿主设置（若有修改）
      const cfg = GOVConfig.get('agent')
      if (cfg.temperature !== '' && cfg.temperature !== null && cfg.temperature !== undefined) {
        await tryApplyTemperature(Number(cfg.temperature))
      }

      // 提交正文（仅此一条消息进入 Agent）
      const res = await DSHApi.sessions.prompt({
        sessionId: S.sessionId,
        mode: 'queue',
        content: [{ type: 'text', text }],
        clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
      if (!res.ok) {
        addTrajectoryLine(`提交失败：${res.error?.message ?? ''}`)
      } else if (res.value?.command) {
        addTrajectoryLine(`命令已执行：${res.value.command.text ?? ''}`)
      }
      // 不再本地回显：由 user/message 事件权威渲染，避免同一条消息显示两遍
      $('promptInput').value = ''
      $('welcomeBox').style.display = 'none'
    } finally {
      $('btnSubmit').disabled = false
    }
  }

  /** 温度写入：尝试多个可能的宿主设置命名空间（失败静默） */
  async function tryApplyTemperature (temp) {
    const desc = await DSHApi.settings.describe({})
    if (!desc.ok) return
    const candidates = desc.value.namespaces.filter(n => ['agent-default-model', 'llm-defaults', 'agent', 'model'].includes(n.ns))
```

</details>

**依据 7 · 源码核查**：[public/js/app.js:759-801](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/public/js/app.js#L759-L801)

当前会话帧路由。

<details>
<summary>查看原文（43行）</summary>

```text
            onError: err => { console.warn('[gov-portal] mux 流中断：', err?.message); resolve() },
          })
        })
        if (!S.stopMux) await new Promise(r => setTimeout(r, Number(GOVConfig.get('agent.wsRetryMs')) || 3000))
      }
    })()
  }

  function onMuxFrame (frame) {
    const p = frame.payload ?? {}
    switch (p.type) {
      case 'session/event':
        if (p.sessionId === S.sessionId) handleSessionEvent(p.event, p.view, {})
        if (p.sessionId === S.sessionId) appendTrail(p.event)
        break
      case 'session/projection':
        if (p.sessionId === S.sessionId) applyProjections({ [p.key]: p.value })
        break
      case 'session/subscribed':
        if (p.sessionId === S.sessionId && !S.lastSeq) S.lastSeq = p.lastSeq
        break
      case 'approval/requested':
        if (p.sessionId === S.sessionId) showApproval(frame.rpcId, p)
        break
      case 'question/requested':
        if (p.sessionId === S.sessionId) showQuestion(frame.rpcId, p)
        break
      case 'session/queue':
        if (p.sessionId === S.sessionId && p.items?.length) {
          const n = p.items.filter(i => i.placement === 'queued').length
          if (n) addTrajectoryLine(`队列中还有 ${n} 项待办，将按序受理…`)
        }
        break
      case 'stream/error':
        addTrajectoryLine(`事件流错误：${p.error?.message ?? ''}`)
        break
      case 'approval/resolved':
      case 'question/resolved':
        break
      default:
        break
    }
  }
```

</details>

**依据 8 · 源码核查**：[public/js/app.js:1191-1221](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/public/js/app.js#L1191-L1221)

审批响应实际接线。

<details>
<summary>查看原文（31行）</summary>

```text
  function showApproval (rpcId, p) {
    const item = { rpcId, payload: p }
    S.approvalQueue.push(item)
    if (S.dialogOpen) return
    processApprovalQueue()
  }

  function processApprovalQueue () {
    const item = S.approvalQueue.shift()
    if (!item) { S.dialogOpen = false; return }
    S.dialogOpen = true
    const p = item.payload
    const body = `
      <div class="kv"><span class="k">会话：</span><span class="v">${GOV.escape((p.sessionId ?? '').slice(0, 12))}…</span></div>
      <div class="kv"><span class="k">工具名称：</span><span class="v"><b>${GOV.escape(p.toolName ?? '—')}</b></span></div>
      ${p.callId ? `<div class="kv"><span class="k">调用编号：</span><span class="v">${GOV.escape(p.callId.slice(0, 12))}…</span></div>` : ''}
      ${p.reason ? `<div class="approval-reason">审批理由：${GOV.escape(p.reason)}</div>` : ''}
      <div style="margin-top:10px;font-size:13px;color:#666">该工具调用需要您的审批。请选择：</div>`
    showDialog('沙箱操作审批', body, [
      ['准予执行（本次）', '', async () => {
        await DSHApi.respond(item.rpcId, { sessionId: p.sessionId, approvalId: p.approvalId, outcome: 'allowed-once' })
        addTrajectoryLine(`已准予工具 ${p.toolName} 本次执行`)
        processApprovalQueue()
      }],
      ['不予批准', 'red', async () => {
        await DSHApi.respond(item.rpcId, { sessionId: p.sessionId, approvalId: p.approvalId, outcome: 'rejected' })
        addTrajectoryLine(`已驳回工具 ${p.toolName} 的调用申请`)
        processApprovalQueue()
      }],
    ], { red: true })
  }
```

</details>

**依据 9 · 源码核查**：[public/js/app.js:832-849](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/public/js/app.js#L832-L849)

完成或缺reason盖章。

<details>
<summary>查看原文（18行）</summary>

```text
      case 'turn/end': {
        S.running = false
        S.blank = false
        const reason = D.reason
        const kind = typeof reason === 'string' ? reason : reason?.kind
        if (kind === 'completed' || kind === undefined) {
          setWoStatus('【准予办结】', true)
          if (GOVConfig.get('agent.stampOnFinish') && !opts.historical) stamp()
        } else {
          const label = { aborted: '中止', blocked: '受阻', error: '办理失败', 'max-tokens': '输出超限', interrupted: '中断' }[kind] ?? kind ?? '结束'
          setWoStatus(`【${label}】`, true)
          addTrajectoryLine(`本轮结束：${kind ?? '—'}`)
        }
        addTrajectoryLine(`第 ${D.turn} 轮办结`)
        break
      }
      case 'step/start':
        addTrajectoryLine(`第 ${D.turn} 轮第 ${D.step} 步：开始调度模型`)
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 新增HTTP入口、权限和审批失败是否与原Web等价？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不等价。默认loopback是网络收敛，但这个自起HTTP入口未见token、Origin/Host拒绝或用户身份校验，直接访问者可调用暴露的apiProxy方法；并非复用原Web fetch carrier的完整访问围栏。/plugin的allowedOrigin仅决定CORS响应头，不拒绝请求；配置PUT只验证port就合并全部body，可改host/fallbackBase并持久化。把host改0.0.0.0会扩大可达面，不能据“政务”命名推断多用户认证、隔离或审计。实际权限策略仍由DSH工具决定；此处不宣称已突破宿主沙箱。

创建会话前的权限下拉会写宿主permission.defaultPreset这个全局新会话默认，不只作用门户当前会话。settings.update返回值未检查即把本地hostPermissionDefault记成所选值，写失败可能使显示意图与真正新会话权限不同；还影响其他客户端后续新会话。审批按钮也未检查respond返回accepted，就记录已准予/已驳回，网络/过期请求错误会产生误导回执。

SSE断流会循环重连，但连接不带上次seq，代码没有在重连后补history的动作；是否宿主自动重放未核，不能承诺不漏帧。HTTP侧把req.signal直接传给异步流而未从req/res关闭构造AbortController，原生IncomingMessage通常没有该signal；退订、背压和停插件时活跃流释放需运行验证。退出只close已保存server，异步加载配置/监听尚未完成就dispose时也没有disposed守卫。

fallback用http.request并重写Host头，保留请求头转发；不能把它当自动继承主Web所有安全与TLS行为，https地址仍用http.request不构成正确TLS上游。端口错误仅日志，页面状态文字也不是Host已可用证据。配置在固定~/.dsh/gov-portal.json，不遵循自定义DSH_HOME/profile隔离；前端外观localStorage按origin保存。未把这些边界外推成已发生入侵或真实漏帧。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:35-44](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/lib/index.js#L35-L44)

默认监听与回退。

<details>
<summary>查看原文（10行）</summary>

```text

const DEFAULT_CONFIG = {
  /** 本插件监听端口 */
  port: 3081,
  /** 监听地址；改为 0.0.0.0 将允许局域网访问（存在安全风险，请自行评估） */
  host: '127.0.0.1',
  /** apiProxy 缺失时回退转发到主 GUI 的地址（一般无需改动） */
  fallbackBase: 'http://127.0.0.1:3080',
}

```

</details>

**依据 2 · 源码核查**：[lib/index.js:309-356](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/lib/index.js#L309-L356)

CORS非拒绝与配置合并。

<details>
<summary>查看原文（48行）</summary>

```text
  } catch { /* ignore */ }
  return undefined
}

async function handlePluginEndpoint(ctx, req, res, url, state) {
  const origin = allowedOrigin(req)
  const cors = origin ? { 'access-control-allow-origin': origin, vary: 'Origin' } : {}
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'access-control-allow-methods': 'GET,POST,PUT,OPTIONS',
      'access-control-allow-headers': 'content-type',
      ...cors,
    })
    return res.end()
  }
  const pathname = url.pathname

  if (pathname === '/plugin/config') {
    if (req.method === 'GET') return json(res, 200, state.config, cors)
    if (req.method === 'PUT') {
      try {
        const body = await readJsonBody(req, 1024 * 1024)
        const port = Number(body.port)
        if (!Number.isInteger(port) || port < 1 || port > 65535) {
          return json(res, 400, { error: 'port 必须是 1-65535 的整数' })
        }
        const next = { ...state.config, ...body, port }
        state.config = next
        await saveConfig(next)
        return json(res, 200, {
          saved: true,
          config: next,
          note: '端口等监听参数修改后需重启 dsh（插件）才能生效',
        }, cors)
      } catch (error) {
        return json(res, 400, { error: error.message }, cors)
      }
    }
    return json(res, 405, { error: 'method not allowed' }, cors)
  }

  if (pathname === '/plugin/status') {
    const api = ctx.apiProxy ?? ctx.get?.('apiProxy', false) ?? ctx.get?.('apiProxy')
    const status = {
      plugin: name,
      version: '0.1.0',
      apiProxy: Boolean(api),
      fallbackBase: state.config.fallbackBase,
```

</details>

**依据 3 · 源码核查**：[lib/index.js:435-461](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/lib/index.js#L435-L461)

HTTP分派无身份围栏。

<details>
<summary>查看原文（27行）</summary>

```text
    const server = http.createServer((req, res) => {
      void (async () => {
        try {
          const url = new URL(req.url, `http://${req.headers.host || `${merged.host}:${merged.port}`}`)
          if (url.pathname.startsWith('/api/')) {
            return await handleApi(ctx, req, res, url, merged)
          }
          if (url.pathname.startsWith('/plugin/')) {
            return await handlePluginEndpoint(ctx, req, res, url, state)
          }
          return await serveStatic(req, res, url)
        } catch (error) {
          if (!res.headersSent) json(res, 500, { error: String(error?.message ?? error) })
          else { try { res.end() } catch { /* ignore */ } }
        }
      })()
    })

    server.on('error', error => {
      log('监听失败：', error.message)
    })

    server.listen(merged.port, merged.host, () => {
      state.server = server
      log(`政务平台已上线：http://${merged.host === '0.0.0.0' ? '127.0.0.1' : merged.host}:${merged.port}/`)
      const api = ctx.apiProxy ?? ctx.get?.('apiProxy', false) ?? ctx.get?.('apiProxy')
      log('apiProxy 桥：', api ? '已接入宿主 API 网关（1:1 能力）' : '未检测到，回退转发主 GUI')
```

</details>

**依据 4 · 源码核查**：[public/js/app.js:646-668](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/public/js/app.js#L646-L668)

全局权限默认写与结果未检查。

<details>
<summary>查看原文（23行）</summary>

```text
  async function createNewSession () {
    // 权限预设：把所选权限写入宿主「新会话默认」设置（settings.permission.defaultPreset），
    // 新工单会话创建时宿主即按此预设初始化（零 Token 消耗，不发任何权限消息）。
    const wantPreset = $('selPermission')?.value
    if (wantPreset && wantPreset !== S.hostPermissionDefault) {
      const desc = await DSHApi.settings.describe({})
      if (desc.ok) {
        const pns = desc.value.namespaces.find(n => n.ns === 'permission')
        await DSHApi.settings.update({ ns: 'permission', patch: { defaultPreset: wantPreset }, expectedRevision: pns?.revision })
        S.hostPermissionDefault = wantPreset
      }
    }

    const preset = $('selPreset')?.value || undefined
    const cwd = S.workDir || undefined
    const res = await DSHApi.sessions.create({ agentPreset: preset || undefined, ...(cwd ? { cwd } : {}) })
    if (!res.ok) {
      alert(`工单创建失败：${res.error?.message ?? ''}`)
      return false
    }
    S.sessionId = res.value.sessionId
    S.agentPreset = res.value.agentPreset
    S.blank = true
```

</details>

**依据 5 · 源码核查**：[public/js/app.js:1209-1220](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/public/js/app.js#L1209-L1220)

审批未检查receipt。

<details>
<summary>查看原文（12行）</summary>

```text
    showDialog('沙箱操作审批', body, [
      ['准予执行（本次）', '', async () => {
        await DSHApi.respond(item.rpcId, { sessionId: p.sessionId, approvalId: p.approvalId, outcome: 'allowed-once' })
        addTrajectoryLine(`已准予工具 ${p.toolName} 本次执行`)
        processApprovalQueue()
      }],
      ['不予批准', 'red', async () => {
        await DSHApi.respond(item.rpcId, { sessionId: p.sessionId, approvalId: p.approvalId, outcome: 'rejected' })
        addTrajectoryLine(`已驳回工具 ${p.toolName} 的调用申请`)
        processApprovalQueue()
      }],
    ], { red: true })
```

</details>

**依据 6 · 源码核查**：[public/js/app.js:753-766](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/public/js/app.js#L753-L766)

断流只重连。

<details>
<summary>查看原文（14行）</summary>

```text
    void (async () => {
      while (!S.stopMux) {
        await new Promise(resolve => {
          DSHApi.openStream('events.mux', frame => onMuxFrame(frame), {
            onOpen: () => { /* 流已建立 */ },
            onClose: () => resolve(),
            onError: err => { console.warn('[gov-portal] mux 流中断：', err?.message); resolve() },
          })
        })
        if (!S.stopMux) await new Promise(r => setTimeout(r, Number(GOVConfig.get('agent.wsRetryMs')) || 3000))
      }
    })()
  }

```

</details>

**依据 7 · 源码核查**：[lib/index.js:141-171](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/lib/index.js#L141-L171)

SSE signal与写流。

<details>
<summary>查看原文（31行）</summary>

```text
async function pipeSse(iterable, method, res, signal) {
  res.writeHead(200, {
    'content-type': 'text/event-stream; charset=utf-8',
    'cache-control': 'no-store',
    connection: 'keep-alive',
    'x-accel-buffering': 'no',
  })
  const heartbeat = setInterval(() => res.write(': ping\n\n'), 25000)
  let aborted = false
  const onAbort = () => { aborted = true }
  signal?.addEventListener?.('abort', onAbort)
  try {
    for await (const frame of iterable) {
      if (aborted || res.writableEnded) break
      res.write(encodeSseFrame(method, frame.rpcId, frame.payload))
    }
  } catch (error) {
    if (!aborted && !res.writableEnded) {
      res.write(encodeSseFrame(method, uuid(), {
        type: 'stream/error',
        error: { code: 'internal', message: String(error?.message ?? error) },
      }))
    }
  } finally {
    clearInterval(heartbeat)
    signal?.removeEventListener?.('abort', onAbort)
    if (!res.writableEnded) res.end()
  }
}

/**
```

</details>

**依据 8 · 源码核查**：[lib/index.js:275-299](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/lib/index.js#L275-L299)

http fallback和Host改写。

<details>
<summary>查看原文（25行）</summary>

```text
function forwardToFallback(req, res, base) {
  const target = new URL(req.url, base)
  const headers = { ...req.headers, host: new URL(base).host }
  delete headers['content-length']
  const upstream = http.request(
    {
      hostname: target.hostname,
      port: target.port || (target.protocol === 'https:' ? 443 : 80),
      path: target.pathname + target.search,
      method: req.method,
      headers,
    },
    upstreamRes => {
      res.writeHead(upstreamRes.statusCode ?? 502, upstreamRes.headers)
      upstreamRes.pipe(res)
    },
  )
  upstream.on('error', error => {
    if (!res.headersSent) json(res, 502, { error: `fallback upstream error: ${error.message}` })
    else res.end()
  })
  req.pipe(upstream)
}

/* ------------------------------------------------------------------ */
```

</details>

**依据 9 · 源码核查**：[lib/index.js:422-434](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/lib/index.js#L422-L434)

dispose/startup竞态。

<details>
<summary>查看原文（13行）</summary>

```text
export default function GovPortal(ctx, config = {}) {
  const state = { config: null }

  ctx.on('dispose', () => {
    try { state.server?.close() } catch { /* ignore */ }
  })

  // 启动即异步完成配置加载与监听；失败只记录日志，不拖垮整个 dsh。
  void (async () => {
    const fileConfig = await loadConfig()
    const merged = { ...DEFAULT_CONFIG, ...fileConfig, ...config }
    state.config = merged

```

</details>

**依据 10 · 源码核查**：[lib/index.js:32-34](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/lib/index.js#L32-L34)

配置固定home路径。

```text
const PUBLIC_DIR = path.join(__dirname, '..', 'public')

const CONFIG_PATH = path.join(os.homedir(), '.dsh', 'gov-portal.json')
```

#### 缺口

- 宿主apiProxy方法内部身份/能力约束和重放语义未按固定Host核验。
  **影响**：不能认证所有方法1:1、完整隔离或确认漏帧；新增HTTP访问层缺校验已由插件源码确认。
  **进一步探讨**：先固定Host审apiProxy合同，以未认证请求/拒绝权限/断流/过期审批/停用矩阵核真正回执。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对原生Web贡献在哪里，接入维护与经济结构如何判断？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

增量是政务门户呈现、会话/历史/模型/权限/设置等常用入口重新组织，以及在独立端口接现有apiProxy。会话持久化、模型目录、工具循环和沙箱审批是继承DSH，不是插件新增治理能力。作者集成文档也注明依据本机DSH0.1.0-rc.6与另一remote-web-ui参考；其设计笔记不是当前宿主全部接口仍一致的证明。

Node声明^22.19或>=24；包没有锁定DSH peer兼容矩阵，实际需Host提供apiProxy且签名匹配、3081端口空闲、用户目录可写及浏览器支持fetch/SSE。fallback默认主GUI3080，但bundle注入通常先等apiProxy，不能把缺依赖回退当所有loader环境都会启动。没有新模型服务凭据，但运行真实Agent仍消耗原模型/工具资源；“零依赖”只指本包无额外npm依赖，不是脱离DSH。

首次成本是隔离profile、核权限默认/审批/错误与原Web对照；持续需要追wire合同、界面状态和端口，双份配置/浏览器存储及异步事件增加排障。失败后回原Web核真实会话和审批，避免门户“已批准/办结”误导；停插件不回滚全局权限默认、温度设置、会话、工作区或配置。现金需按真实模型与工具账单，未测门户净收益/时延。

相对原Web，界面换名和独立端口没有改变谁提供计算、如何计价/池化、服务责任或风险承担，未识别经济结构创新。也无材料证明政务风使新群体能可靠办理真实事项；业务标签不应据外观归为已落地政务服务。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-25](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/package.json#L1-L25)

版本/定位/Node。

<details>
<summary>查看原文（25行）</summary>

```text
{
  "name": "dsh-gov-portal",
  "version": "0.1.0",
  "description": "Deepseek Harness 综合智能办事平台 — 独立政务风 WebUI（默认端口 3081），通过宿主 apiProxy 1:1 对接 dsh 的会话/模型/权限/统计等全部 Agent 能力",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "files": [
    "lib",
    "public",
    "cordis.patch.yml"
  ],
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "license": "MIT"
}
```

</details>

**依据 2 · 源码核查**：[docs/harness-integration.md:1-12](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/docs/harness-integration.md#L1-L12)

集成笔记的版本/参考来源。

<details>
<summary>查看原文（12行）</summary>

```text
# dsh 运行时集成面全解：Cordis 插件在 3081 独立端口拉起 HTTP+WebSocket，并把浏览器消息 1:1 派发进 dsh Agent

> 目标：在 DeepSeek Harness (dsh) 运行时内开发一个 Cordis 插件，插件在独立端口 **3081** 起自己的 HTTP + WebSocket 服务，浏览器页面的消息真实进入 dsh 的 Agent Loop，**1:1 复用 dsh 的会话、模型、权限、模式、统计能力，绝不硬编码**。
>
> 本文档仅讲集成面（不写业务实现）。所有代码摘录均来自本机已安装的 dsh **0.1.0-rc.6** 与参考插件 `@linxin666/dsh-remote-web-ui@0.1.14`，路径与行号可复核。
>
> 相关键路径：
> - dsh CLI：`C:\Users\17151\AppData\Roaming\npm\node_modules\@deepseek-ai\dsh`（`lib/bin.js`、`lib/profile-boot-DG5t9aNs.js`、`lib/plugin-9h8shc4d.js`、`config/agent-presets/`）
> - 依赖包：`...\@deepseek-ai\dsh\node_modules\@deepseek-ai\` 下 `dsh-host-webserver`、`dsh-host-apiproxy`、`dsh-client-connection`、`dsh-api-gateway`、`dsh-typert-protocol`、`dsh-agent`、`dsh-agent-loop`、`dsh-session`、`dsh-session-stats`、`dsh-session-projection`、`dsh-token-meter`、`dsh-settings`(+`dsh-settings-file`)、`dsh-permission-presets`、`dsh-sandbox-policy`、`dsh-headless`、`dsh-web-app`、`dsh-api-remotes`、`dsh-base` 等
> - 参考插件：`C:\Users\17151\.dsh\profiles\web\node_modules\@linxin666\dsh-remote-web-ui\`（`lib/index.js` 2151 行 = 宿主侧；`lib/mobile.js` = 移动端页面+客户端；`cordis.patch.yml` = bundle patch）
> - 用户 profile：`C:\Users\17151\.dsh\profiles\web\`（`package.json` 的 `dsh.profile.bundles`、`cordis.patch.yml`、`settings.yaml`——注意 settings.yaml 其实在 `$DSH_HOME` 即 `C:\Users\17151\.dsh\settings.yaml`）

```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:4-9](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/cordis.patch.yml#L4-L9)

依赖门控。

```text
# inject: [apiProxy] 声明对宿主 API 网关的依赖 —— Cordis 会等
# apiProxy 激活后再挂载本插件，保证桥接服务可用。
- insert:
    - id: gov-portal
      name: 'dsh-gov-portal'
      inject: [apiProxy]
```

**依据 4 · 源码核查**：[public/js/store.js:119-139](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/public/js/store.js#L119-L139)

本地配置与保存失败。

<details>
<summary>查看原文（21行）</summary>

```text
  let cache = null

  function load () {
    if (cache) return cache
    try {
      const raw = localStorage.getItem(KEY)
      cache = raw ? deepMerge(JSON.parse(JSON.stringify(DEFAULTS)), JSON.parse(raw)) : JSON.parse(JSON.stringify(DEFAULTS))
    } catch {
      cache = JSON.parse(JSON.stringify(DEFAULTS))
    }
    return cache
  }

  function save (patch) {
    const cfg = load()
    if (patch) deepMerge(cfg, patch)
    try { localStorage.setItem(KEY, JSON.stringify(cfg)) } catch (e) { console.warn('[gov-portal] 配置保存失败：', e) }
    return cfg
  }

  function get (path) {
```

</details>

**依据 5 · 源码核查**：[lib/index.js:104-119](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/lib/index.js#L104-L119)

Host配置非事务写入。

<details>
<summary>查看原文（16行）</summary>

```text
  } catch (error) {
    log('读取插件配置失败，使用默认值：', error.message)
    return {}
  }
}

async function saveConfig(cfg) {
  await mkdir(path.dirname(CONFIG_PATH), { recursive: true })
  await writeFile(CONFIG_PATH, JSON.stringify(cfg, null, 2), 'utf8')
}

/* ------------------------------------------------------------------ */
/* API 桥：把 /api/* 请求分发给 ctx.apiProxy                          */
/* ------------------------------------------------------------------ */

const UNARY_PATTERN = /^\/api\/([a-z][a-zA-Z0-9]*)\.([a-zA-Z][a-zA-Z0-9]*)$/
```

</details>

#### 缺口

- 当前Host兼容、真实使用需求、总成本与可访问性未测。
  **影响**：不能认为替换原Web普遍更方便或更可靠。
  **进一步探讨**：同任务原Web/门户比较权限误判、审批成功、错误恢复、导航时间和模型账单。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 当前是否值得用于真实事项，什么方向应先验证？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前观察，仅适合非敏感单用户隔离profile核UI接线，不用作真实政务或远程多人工作门户。保持127.0.0.1，不开放局域网，先确认原Web可回退，再对读会话、创建无副作用测试会话、故意拒绝审批和断流核回执；不把danger-full-access当解决UI错误的办法。若状态不符、原权限默认被改或审批receipt不被确认，停门户用原Web核真实状态并恢复原默认设置。

可验证方向是先补可信客户端合同，不扩政务功能：复用Host受支持的认证/连接层，明确会话级权限而非改全局默认，只有respond.accepted才显示批准，并把turn结束与任务验收分开。依据是现有独立HTTP、默认权限写入和回执误判。最小对照在原Web、现门户与合同原型各做未认证访问、权限更新失败、过期审批、断流补历史及reason缺失五种故障，检查错误放行、错误完成提示和人工恢复时间。若官方客户端已有可配置布局满足需求，就采用其扩展点而不长期复制整个协议客户端。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:435-461](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/lib/index.js#L435-L461)

访问层改进依据。

<details>
<summary>查看原文（27行）</summary>

```text
    const server = http.createServer((req, res) => {
      void (async () => {
        try {
          const url = new URL(req.url, `http://${req.headers.host || `${merged.host}:${merged.port}`}`)
          if (url.pathname.startsWith('/api/')) {
            return await handleApi(ctx, req, res, url, merged)
          }
          if (url.pathname.startsWith('/plugin/')) {
            return await handlePluginEndpoint(ctx, req, res, url, state)
          }
          return await serveStatic(req, res, url)
        } catch (error) {
          if (!res.headersSent) json(res, 500, { error: String(error?.message ?? error) })
          else { try { res.end() } catch { /* ignore */ } }
        }
      })()
    })

    server.on('error', error => {
      log('监听失败：', error.message)
    })

    server.listen(merged.port, merged.host, () => {
      state.server = server
      log(`政务平台已上线：http://${merged.host === '0.0.0.0' ? '127.0.0.1' : merged.host}:${merged.port}/`)
      const api = ctx.apiProxy ?? ctx.get?.('apiProxy', false) ?? ctx.get?.('apiProxy')
      log('apiProxy 桥：', api ? '已接入宿主 API 网关（1:1 能力）' : '未检测到，回退转发主 GUI')
```

</details>

**依据 2 · 源码核查**：[public/js/app.js:646-668](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/public/js/app.js#L646-L668)

权限范围依据。

<details>
<summary>查看原文（23行）</summary>

```text
  async function createNewSession () {
    // 权限预设：把所选权限写入宿主「新会话默认」设置（settings.permission.defaultPreset），
    // 新工单会话创建时宿主即按此预设初始化（零 Token 消耗，不发任何权限消息）。
    const wantPreset = $('selPermission')?.value
    if (wantPreset && wantPreset !== S.hostPermissionDefault) {
      const desc = await DSHApi.settings.describe({})
      if (desc.ok) {
        const pns = desc.value.namespaces.find(n => n.ns === 'permission')
        await DSHApi.settings.update({ ns: 'permission', patch: { defaultPreset: wantPreset }, expectedRevision: pns?.revision })
        S.hostPermissionDefault = wantPreset
      }
    }

    const preset = $('selPreset')?.value || undefined
    const cwd = S.workDir || undefined
    const res = await DSHApi.sessions.create({ agentPreset: preset || undefined, ...(cwd ? { cwd } : {}) })
    if (!res.ok) {
      alert(`工单创建失败：${res.error?.message ?? ''}`)
      return false
    }
    S.sessionId = res.value.sessionId
    S.agentPreset = res.value.agentPreset
    S.blank = true
```

</details>

**依据 3 · 源码核查**：[public/js/app.js:1209-1220](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/public/js/app.js#L1209-L1220)

回执判据依据。

<details>
<summary>查看原文（12行）</summary>

```text
    showDialog('沙箱操作审批', body, [
      ['准予执行（本次）', '', async () => {
        await DSHApi.respond(item.rpcId, { sessionId: p.sessionId, approvalId: p.approvalId, outcome: 'allowed-once' })
        addTrajectoryLine(`已准予工具 ${p.toolName} 本次执行`)
        processApprovalQueue()
      }],
      ['不予批准', 'red', async () => {
        await DSHApi.respond(item.rpcId, { sessionId: p.sessionId, approvalId: p.approvalId, outcome: 'rejected' })
        addTrajectoryLine(`已驳回工具 ${p.toolName} 的调用申请`)
        processApprovalQueue()
      }],
    ], { red: true })
```

</details>

**依据 4 · 源码核查**：[public/js/app.js:832-849](https://github.com/ExElectron/dsh-gov-portal/blob/04a69c142d6f308306f0797fb4bf2abac4cc691c/public/js/app.js#L832-L849)

结束不等于任务验收。

<details>
<summary>查看原文（18行）</summary>

```text
      case 'turn/end': {
        S.running = false
        S.blank = false
        const reason = D.reason
        const kind = typeof reason === 'string' ? reason : reason?.kind
        if (kind === 'completed' || kind === undefined) {
          setWoStatus('【准予办结】', true)
          if (GOVConfig.get('agent.stampOnFinish') && !opts.historical) stamp()
        } else {
          const label = { aborted: '中止', blocked: '受阻', error: '办理失败', 'max-tokens': '输出超限', interrupted: '中断' }[kind] ?? kind ?? '结束'
          setWoStatus(`【${label}】`, true)
          addTrajectoryLine(`本轮结束：${kind ?? '—'}`)
        }
        addTrajectoryLine(`第 ${D.turn} 轮办结`)
        break
      }
      case 'step/start':
        addTrajectoryLine(`第 ${D.turn} 轮第 ${D.step} 步：开始调度模型`)
```

</details>

#### 缺口

- 可信连接/会话权限/补帧改造未实现和验证。
  **影响**：只是生产化候选，不计当前贡献或安全保证。
  **进一步探讨**：先查固定Host官方连接扩展点，再以五故障与原Web对照决定维护必要性。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
