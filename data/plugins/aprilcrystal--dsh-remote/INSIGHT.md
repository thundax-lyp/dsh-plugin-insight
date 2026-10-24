# dsh-openai-bridge（dsh-remote）

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[76ad90a](https://github.com/AprilCrystal/dsh-remote/tree/76ad90aab2e54d5c07319ce544ba144be99421f5)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：提供 OpenAI 兼容会话接口和手机面板，可继续 DSH 会话、浏览文件、处理审批及管理模型与上下文。

> **核心亮点**：相对远程桌面或无状态聊天API，插件把已有DSH会话暴露为兼容模型选择项，并用手机面板补足审批、队列和上下文交互，减少两端重新建立背景的交接。能力本身来自宿主agent、session和权限服务；兼容HTTP只是会话控制面，不是独立模型服务或安全沙箱。[Q01](#research-q01)

> **风险与缺陷**：远程操作是否始终处于预期只读边界决定采用风险。openAgent仅对created会话尝试set预设，异常被catch记录后仍return agent，已存在会话不重钉权限；因此“桥驱动会话都只读”不能概括实际代码。read-only也不约束保密性和网络外发，token及IP白名单并不按每会话细分权限。首句相同的隐式映射还会合并会话，应显式选session。[Q02](#research-q02)

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
  - [Q01 · HTTP到宿主会话的调用链和贡献是什么？](#detail-section-11)
  - [Q02 · token、配对、权限和审批真正隔离什么？](#detail-section-12)
  - [Q03 · 使用与恢复成本怎样影响采用？](#detail-section-13)
  - [Q04 · 会话能力令牌与强制权限确认能否收窄影响？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向希望从手机继续桌面DSH会话的单机用户，用兼容客户端或网页面板远程输入、查看会话并处理特定控制操作。

替代是远程桌面或在手机新建独立聊天。桥保留宿主任务上下文和部分控制，交换条件是新增网络控制面、身份和会话映射维护，本次未比较真机操作时间和任务成功率。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| OpenAI兼容会话接口 | 从兼容客户端继续DSH任务 | 显式session最稳，首句相同会隐式碰撞 |
| 手机面板 | 查看会话、文件及操作控制 | 共享token与客户闸门，权限需另核对 |
| 配对与代理识别 | 降低单独token泄漏影响 | IP地址不是密码学设备身份 |
| 审批参与 | 手机与桌面并行回应请求 | 取决于approvalScope，不能当额外权限保证 |
| 预设切换握手 | 桌面码确认手机请求 | 默认排除全盘权限，但失败和旧会话需验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 宿主webServer/agents/sessions/权限服务 | 核心必需 | 会话控制和权限 | 动态读取不代表跨版本保证 |
| 非空共享token | 桥挂载必需 | HTTP与面板认证 | 空值只挂本机setup |
| IP配对及可信代理配置 | 默认远程必需 | 判断客户地址 | 地址可变或可冒认，不是强设备身份 |
| TLS或可信加密通道 | 敏感远程访问必需 | 保护token和会话内容 | plain HTTP会明文传输 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 本机生成token并设代理/加密边界 | setup仅本机，远端来源可信 |
| 配对 | 本机查看码，手机提交 | 仅预期客户地址获准 |
| 续聊 | 远端显式选择会话并发送 | 正确session、当前权限和原始任务一致 |
| 审批 | 用户在对应界面判断 | 胜出一次，其他结果不重复执行 |
| 恢复 | 断线后核对队列和真实副作用 | 不把重连当未执行而盲重发 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主、手机、代理/TLS，金额未知 | token、配对、可信代理与权限范围核对 | 不应只验证登录成功 |
| 持续使用 | 模型任务、网络和设备白名单 | 管理地址变化、秘密轮换及审批 | read-only不限制读取与外发 |
| 失败恢复 | 断线、重连与重试资源未知 | 核对会话、现实副作用和权限 | 隐式会话首句碰撞、重复任务成本未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 远程续聊 | 显式session选择与串行followup | 跨端任务一致性与断线行为 |
| 文件面板 | realpath根检查与认证入口 | 所有读写路径及宿主权限边界 |
| 审批协同 | desktop与面板并行争取结果 | 真机时序、正确会话和权限预设 |

> **思考**：远程操作是否始终处于预期只读边界决定采用风险。openAgent仅对created会话尝试set预设，异常被catch记录后仍return agent，已存在会话不重钉权限；因此“桥驱动会话都只读”不能概括实际代码。read-only也不约束保密性和网络外发，token及IP白名单并不按每会话细分权限。首句相同的隐式映射还会合并会话，应显式选session。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对远程桌面或无状态聊天API，插件把已有DSH会话暴露为兼容模型选择项，并用手机面板补足审批、队列和上下文交互，减少两端重新建立背景的交接。能力本身来自宿主agent、session和权限服务；兼容HTTP只是会话控制面，不是独立模型服务或安全沙箱。[Q01](#research-q01)

相对远程桌面或无状态聊天API，插件把已有DSH会话暴露为兼容模型选择项，并用手机面板补足审批、队列和上下文交互，减少两端重新建立背景的交接。能力本身来自宿主agent、session和权限服务；兼容HTTP只是会话控制面，不是独立模型服务或安全沙箱。[Q01](#research-q01)

不直接导入宿主包可减小安装解析耦合，动态服务、oncePerKey与串行链处理会话竞争，realpath根校验比文本路径检查可靠。安全语义仍依赖代理、共享token和权限服务；预设设置异常只告警与fail-closed目标不符。复用应把身份、会话授权和权限确认做成明确协议，不能只复制HTTP外壳。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

远程操作是否始终处于预期只读边界决定采用风险。openAgent仅对created会话尝试set预设，异常被catch记录后仍return agent，已存在会话不重钉权限；因此“桥驱动会话都只读”不能概括实际代码。read-only也不约束保密性和网络外发，token及IP白名单并不按每会话细分权限。首句相同的隐式映射还会合并会话，应显式选session。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，在隔离非敏感profile核对TLS和代理来源，显式选择session，并测试新会话权限set失败会被拒绝。不要把IP配对当设备证书或把只读当保密沙箱；旧会话需检查当前权限。缺少可靠加密或权限验证时不扩大访问范围。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

远程会话及多层闸门接线有源码支持；IP配对不是密码学设备身份，明文传输与广泛会话/读取能力需部署边界。新会话权限设定失败仍可继续，旧会话保留自身权限。能力令牌假设未实现。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/panel.js、lib/client-gate.js、lib/peer.js、lib/permission-gate.js、lib/lan-proxy.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查README/清单、index认证/会话映射/创建权限、panel认证/文件根/审批接线、client-gate、peer及LAN代理关键段；模型和上下文控制、完整面板及所有文件写入未全面审计，未执行目标代码。
- 下一步：在隔离profile验证空token、未知IP、代理缺失标记、权限set抛错、旧会话权限、同首句双请求和断线重连；然后以可撤销任务验收手机/桌面审批与会话一致性。本轮未执行。

**分析版本**

- **仓库**：[AprilCrystal/dsh-remote](https://github.com/AprilCrystal/dsh-remote)
- **版本号**：0.1.0（[固定提交 76ad90a](https://github.com/AprilCrystal/dsh-remote/tree/76ad90aab2e54d5c07319ce544ba144be99421f5)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是配对后签发限定session、读/发/审批能力和有效期的设备令牌，创建会话时必须确认权限预设成功再接收首请求，已有会话显式展示并确认当前权限。用权限set抛错、同首句双客户端、撤销设备和会话越权矩阵测试，要求失败关闭且不串会话；若能力分拆破坏正常续聊或代理无法绑定身份，应收窄方案而非承诺完整隔离。[Q04](#research-q04)

在隔离profile验证空token、未知IP、代理缺失标记、权限set抛错、旧会话权限、同首句双请求和断线重连；然后以可撤销任务验收手机/桌面审批与会话一致性。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1989 | — | — | 23609 |
| .js | source | 14 | 7921 | 5629 | 1832 | — |
| .mjs | test | 18 | 5388 | 4122 | 577 | — |
| .mjs | source | 1 | 303 | 225 | 59 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/AprilCrystal/dsh-remote/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：手机和兼容接口如何驱动现有会话，身份、权限和映射边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · HTTP到宿主会话的调用链和贡献是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

HTTP入口先通过客户闸门与Bearer校验，从请求messages选最新用户文本。model字段的显式sessionId优先，否则按首用户文本派生稳定会话；每session串行确保agent并followup，兼容客户端因此能接续宿主已有日志。面板补充兼容协议没有的审批与队列控制。相对手机独立新聊天或远程桌面，增量是跨入口任务交接，不是新的模型服务。首句相同的独立聊天会共享隐式session，串行只避免并行冲突，不消除语义串台，应显式选择会话。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1284-1312](https://github.com/AprilCrystal/dsh-remote/blob/76ad90aab2e54d5c07319ce544ba144be99421f5/lib/index.js#L1284-L1312)

显式session优先、首句映射与串行驱动是生产入口。

<details>
<summary>查看原文（29行）</summary>

```text
    const prompt = lastUserText(messages)
    if (prompt === '') {
      res.writeHead(400, { 'content-type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify({ error: { message: 'no user message', type: 'invalid_request_error' } }))
      return
    }

    const model = typeof body?.model === 'string' && body.model !== '' ? body.model : ADVERTISED_MODEL
    const stream = body?.stream === true
    // An explicitly selected session wins. Falling back to the opening-message
    // hash keeps the synthetic `dsh-agent` entry working, but that inference is
    // ambiguous — two conversations sharing an opening line would otherwise
    // merge into one session and interleave their turns.
    const sessionId = sessionIdFromModel(model) ?? sessionIdFor(messages)
    const completionId = `chatcmpl-${randomUUID().replaceAll('-', '')}`
    const created = Math.floor(Date.now() / 1000)

    try {
      await serialize(sessionId, async () => {
        const agent = await ensureAgent(sessionId)
        const session = agent.session

        // Chatbox resends the whole history every turn; the harness already
        // holds the prior turns, so only the newest message is forwarded — with
        // the earlier ones as a preamble when this session is brand new.
        const preamble = transcriptPreamble(messages)
        const text = preamble === '' ? prompt : `${preamble}\n\nUser: ${prompt}`
        const streamed = await driveTurn(agent, text, (delta) => {
          if (stream) writeEvent(res, chunkFrame(completionId, created, model, { content: delta }, null))
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1348-1374](https://github.com/AprilCrystal/dsh-remote/blob/76ad90aab2e54d5c07319ce544ba144be99421f5/lib/index.js#L1348-L1374)

客户闸门覆盖/v1路由分派。

<details>
<summary>查看原文（27行）</summary>

```text
    let url
    try {
      url = new URL(req.url ?? '/', 'http://bridge.invalid')
    } catch {
      res.writeHead(400)
      res.end()
      return
    }
    // Before the token check, because a device that has never been approved
    // cannot pass it anyway: it gets the refusal, or the form that fixes it.
    if (clientGate.check(req, res, url)) return
    const pathname = url.pathname
    if (pathname === `${BASE_PATH}/models` && (req.method === 'GET' || req.method === 'HEAD')) {
      void handleModels(req, res).catch((error) => {
        ctx.logger.warn(`openai-bridge: /v1/models failed: ${String(error)}`)
        if (!res.headersSent) {
          res.writeHead(500, { 'content-type': 'application/json; charset=utf-8' })
          res.end(JSON.stringify({ error: { message: String(error), type: 'internal_error' } }))
        }
      })
      return
    }
    if (pathname === `${BASE_PATH}/chat/completions` && req.method === 'POST') {
      void handleCompletions(req, res)
      return
    }
    res.writeHead(404, { 'content-type': 'application/json; charset=utf-8' })
```

</details>

#### 缺口

- 真机兼容客户端的映射和断线行为未验收。
  **影响**：不能宣称跨端续聊绝不串台或重复。
  **进一步探讨**：双客户端同首句及显式session对照，核对完整日志。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · token、配对、权限和审批真正隔离什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

空token只挂本机setup，Bearer长度匹配后timingSafeEqual，默认远程还需IP配对，trustedProxies影响地址解析。它降低单独token泄漏影响，但IP可变且并非设备证书。openAgent仅对新建会话尝试设read-only，set异常只告警然后返回agent；已存在会话保持原权限。因此不能笼统保证桥驱动会话都只读，且read-only本来不阻止读取和网络外发。面板审批按cwd或all范围参与，与桌面结果Promise.race，权限仍需要明确作用域和人的判断。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:565-583](https://github.com/AprilCrystal/dsh-remote/blob/76ad90aab2e54d5c07319ce544ba144be99421f5/lib/index.js#L565-L583)

无token挂载范围明确收窄。

<details>
<summary>查看原文（19行）</summary>

```text
  const configuredToken = typeof config?.token === 'string' ? config.token.trim() : ''
  const fileToken = configuredToken === '' ? readTokenFile(ctx) : ''
  const token = configuredToken !== '' ? configuredToken : fileToken
  const tokenSource = configuredToken !== '' ? 'config' : (fileToken !== '' ? 'file' : 'none')

  if (token === '') {
    // Nothing but the loopback-only setup page mounts. Keeping everything else
    // unmounted is what makes "no token" mean "not installed here" rather than
    // "installed but locked" — and it is why an unconfigured plugin still cannot
    // touch the approval flow.
    ctx.logger.info(`openai-bridge: no token (config empty, no token file); mounting only the loopback setup page at ${setupPath}`)
    try {
      installSetup(ctx, { setupPath, panelPath, tokenSource, token: '', trustedProxies })
    } catch (error) {
      ctx.logger.warn(`openai-bridge: setup page failed to mount: ${String(error)}`)
    }
    return
  }

```

</details>

**依据 2 · 源码核查**：[lib/index.js:728-753](https://github.com/AprilCrystal/dsh-remote/blob/76ad90aab2e54d5c07319ce544ba144be99421f5/lib/index.js#L728-L753)

权限只对created尝试，失败仍返回agent，是关键边界。

<details>
<summary>查看原文（26行）</summary>

```text
  const openAgent = async (sessionId) => {
    const selection = ctx.get('agentDefaultModel').currentSelection()
    const { agent, created } = await acquireAgent(ctx, {
      sessionId,
      cwd,
      presetId: agentPreset,
      agentOptions: { provider: selection.provider, model: selection.model },
      installSelection,
    })
    // Pin the preset ONLY on a session this bridge just created, so the sandbox
    // boundary is in force before the first tool call. Pinning unconditionally
    // meant every message sent from the panel rewrote the session's permission
    // preset — including on a conversation the operator was working in on the
    // desktop, which silently flipped their session to read-only mid-use. A
    // resumed session already carries whatever preset it was created with, and
    // that choice belongs to whoever made it.
    if (created) {
      try {
        ctx.get('permissionPresets').set(agent.session, permissionPreset)
      } catch (error) {
        ctx.logger.warn(`openai-bridge: could not pin permission preset "${permissionPreset}": ${String(error)}`)
      }
    }
    return agent
  }

```

</details>

**依据 3 · 源码核查**：[lib/client-gate.js:4-24](https://github.com/AprilCrystal/dsh-remote/blob/76ad90aab2e54d5c07319ce544ba144be99421f5/lib/client-gate.js#L4-L24)

作者明确IP配对的价值及非强身份限制。

<details>
<summary>查看原文（21行）</summary>

```text
 * WHY THIS EXISTS. The token is the only secret between the LAN and this
 * machine, and a token that travels in a URL (a bookmark, a screenshot, a chat
 * message, a shared clipboard) leaks silently. This gate makes that leak
 * insufficient on its own: a peer that has never been approved is refused
 * *everything* until somebody at the machine reads a code off the loopback-only
 * setup page and types it on the device. So a leaked token buys an attacker
 * nothing until a human is standing at the computer.
 *
 * WHAT IT IS NOT. It is not a boundary against someone already on the LAN. ARP
 * spoofing can impersonate an approved address, DHCP hands a phone a new address
 * without asking, and a dual-stack or multi-homed device arrives under a
 * different spelling each time. Approving an address approves whoever can claim
 * it. Its real value is that a leaked token is no longer enough by itself.
 *
 * WHAT IS PERSISTED, AND WHAT IS NOT. The allowlist is on disk, so an approval
 * survives a restart. The pending codes are NOT: a code lives in memory for its
 * TTL, and a restart clears every un-approved device. That asymmetry is
 * deliberate — a code is a short-lived secret shown on the machine, and nothing
 * that short-lived belongs in a file.
 *
 * @module dsh-openai-bridge/client-gate
```

</details>

**依据 4 · 源码核查**：[lib/panel.js:398-420](https://github.com/AprilCrystal/dsh-remote/blob/76ad90aab2e54d5c07319ce544ba144be99421f5/lib/panel.js#L398-L420)

审批作用域检查与并行决定链实际存在。

<details>
<summary>查看原文（23行）</summary>

```text
  const panelOwns = (req) => {
    if (approvalCwd === undefined) return true
    const cwd = req?.agent?.session?.header?.cwd
    return typeof cwd === 'string' && resolve(cwd) === resolve(approvalCwd)
  }

  ctx.on('approval/request', (req, next) => {
    if (!panelOwns(req)) return next()
    const downstream = next()
    const id = `ap-${String(++approvalSeq)}`
    const mine = new Promise((settle) => {
      pending.set(id, {
        id,
        toolName: typeof req.toolName === 'string' ? req.toolName : 'tool',
        reason: typeof req.reason === 'string' ? req.reason : undefined,
        sessionId: req.agent?.session?.id === undefined ? undefined : String(req.agent.session.id),
        createdAt: Date.now(),
        decide: (outcome) => { pending.delete(id); settle(outcome) },
      })
      req.signal?.addEventListener('abort', () => { pending.delete(id) }, { once: true })
    })
    return Promise.race([downstream, mine]).finally(() => { pending.delete(id) })
  }, { prepend: true })
```

</details>

#### 缺口

- 权限set失败时宿主继承的实际预设及代理部署未验证。
  **影响**：不能给出默认受限的执行保证。
  **进一步探讨**：使set抛错并检查首工具权限，验证已有宽权限session和代理来源。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 使用与恢复成本怎样影响采用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

安装本身是plain ESM，但仍依赖宿主多个动态服务；手机访问还需网络入口、可信代理来源和token/地址配对维护。LAN代理默认HTTP，面板cookie只有HttpOnly与SameSite，不提供传输加密，敏感使用必须额外可信加密通道。首次要核对权限与端口，持续需秘密轮换、设备地址变化和模型预算，失败需对账队列与现实副作用，金额和时间未知。建议先观察并验收权限失败关闭，再在隔离非敏感session续聊；read-only不能作为保密性承诺。

#### 证据与依据

**依据 1 · 源码核查**：[lib/lan-proxy.js:77-106](https://github.com/AprilCrystal/dsh-remote/blob/76ad90aab2e54d5c07319ce544ba144be99421f5/lib/lan-proxy.js#L77-L106)

代理转发到HTTP上游并写来源头，身份配置与加密是不同问题。

<details>
<summary>查看原文（30行）</summary>

```text
    const headers = {}
    for (const [name, value] of Object.entries(req.headers)) {
      if (value === undefined) continue
      if (HOP_BY_HOP.has(name.toLowerCase())) continue
      headers[name] = value
    }
    const client = normalize(req.socket?.remoteAddress)
    headers['x-forwarded-for'] = headers['x-forwarded-for']
      ? `${headers['x-forwarded-for']}, ${client}`
      : client
    headers['x-forwarded-proto'] = 'http'
    headers['x-forwarded-host'] = req.headers.host ?? ''
    headers['x-forwarded-port'] = String(origin.port)
    return headers
  }

  const server = createServer((req, res) => {
    state.requests += 1
    const upstream = httpRequest(
      {
        host: origin.hostname,
        port: Number(origin.port),
        method: req.method,
        path: req.url,
        headers: forwarded(req),
      },
      (answer) => {
        res.writeHead(answer.statusCode ?? 502, answer.headers)
        // Piped, not buffered: the panel streams and a buffered proxy would hold
        // every event until the connection closed.
```

</details>

**依据 2 · 源码核查**：[lib/panel.js:2596-2608](https://github.com/AprilCrystal/dsh-remote/blob/76ad90aab2e54d5c07319ce544ba144be99421f5/lib/panel.js#L2596-L2608)

cookie安全属性不替代TLS。

<details>
<summary>查看原文（13行）</summary>

```text
          'cache-control': 'no-store',
          'referrer-policy': 'no-referrer',
          location: query === '' ? target : `${target}?${query}`,
          // `SameSite=Lax`, NOT Strict. Tapping the sign-in link in another app
          // makes the whole navigation cross-site, and a Strict cookie is
          // withheld for the redirect that follows — the request then arrives
          // unauthenticated and 401s. Lax still refuses to attach the cookie to
          // cross-site POSTs, so the panel's state-changing endpoints stay
          // CSRF-safe.
          'set-cookie': `${COOKIE_NAME}=${token}; Path=${basePath}; HttpOnly; SameSite=Lax`,
        })
        res.end()
        return
```

</details>

**依据 3 · 源码核查**：[lib/peer.js:143-173](https://github.com/AprilCrystal/dsh-remote/blob/76ad90aab2e54d5c07319ce544ba144be99421f5/lib/peer.js#L143-L173)

可信代理与来源链需要部署匹配，未转发可识别客户时拒绝。

<details>
<summary>查看原文（31行）</summary>

```text
 */
export function resolvePeer(req, trustedProxies) {
  const socketPeer = normalizePeer(req?.socket?.remoteAddress)
  const matchers = parseTrustedProxies(trustedProxies)
  if (matchers.length === 0 || !isTrustedProxy(socketPeer, matchers)) {
    return { address: socketPeer, viaProxy: false, unforwarded: false }
  }

  const hops = parseForwardedFor(req?.headers?.['x-forwarded-for'])
  // A trusted address carrying NO forwarding markers at all is a direct request
  // from that address — normally this machine's own browser opening the setup
  // console, which must not be refused merely because a proxy is also
  // configured. The markers are what tell the two apart: a real proxy adds at
  // least one of them, and ours adds all three.
  const marked =
    hops.length > 0 ||
    req?.headers?.['x-forwarded-proto'] !== undefined ||
    req?.headers?.['x-forwarded-host'] !== undefined
  if (!marked) return { address: socketPeer, viaProxy: false, unforwarded: false }

  // Walk from the right: the last hop is the one our trusted proxy appended, and
  // anything it did not itself add is either an earlier proxy or the client.
  for (let index = hops.length - 1; index >= 0; index -= 1) {
    const hop = normalizePeer(stripPort(hops[index]))
    if (hop === '') continue
    if (isTrustedProxy(hop, matchers)) continue
    return { address: hop, viaProxy: true, unforwarded: false }
  }
  // Forwarded, but with no address we may believe: the hop dropped the client.
  return { address: '', viaProxy: true, unforwarded: true }
}
```

</details>

#### 缺口

- 现场TLS、手机网络和真实任务恢复成本未知。
  **影响**：不能推荐直接开放敏感宿主。
  **进一步探讨**：明确传输拓扑并在隔离任务演练断线、撤销和token轮换。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 会话能力令牌与强制权限确认能否收窄影响？

**研究主题**：新假设与验证

#### 完整回答

共享token与地址许可把多种控制放进同一主体，而权限设置失败仍继续，适合推导未验证的会话能力方案。配对后签发限定session、读/发送/审批与有效期的令牌，新建会话先确认预设成功，旧会话显示当前权限并要求授权。新增授权与撤销存储会增加配置复杂度，不保证兼容所有OpenAI客户端。最小实验覆盖跨session访问、set失败、设备撤销和同首句请求，要求越权拒绝、无串会话且正常续聊可用；若令牌无法被兼容客户端携带，应保留有限API而不放宽安全边界。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:728-753](https://github.com/AprilCrystal/dsh-remote/blob/76ad90aab2e54d5c07319ce544ba144be99421f5/lib/index.js#L728-L753)

权限确认缺口是fail-closed改进的来源。

<details>
<summary>查看原文（26行）</summary>

```text
  const openAgent = async (sessionId) => {
    const selection = ctx.get('agentDefaultModel').currentSelection()
    const { agent, created } = await acquireAgent(ctx, {
      sessionId,
      cwd,
      presetId: agentPreset,
      agentOptions: { provider: selection.provider, model: selection.model },
      installSelection,
    })
    // Pin the preset ONLY on a session this bridge just created, so the sandbox
    // boundary is in force before the first tool call. Pinning unconditionally
    // meant every message sent from the panel rewrote the session's permission
    // preset — including on a conversation the operator was working in on the
    // desktop, which silently flipped their session to read-only mid-use. A
    // resumed session already carries whatever preset it was created with, and
    // that choice belongs to whoever made it.
    if (created) {
      try {
        ctx.get('permissionPresets').set(agent.session, permissionPreset)
      } catch (error) {
        ctx.logger.warn(`openai-bridge: could not pin permission preset "${permissionPreset}": ${String(error)}`)
      }
    }
    return agent
  }

```

</details>

**依据 2 · 源码核查**：[lib/panel.js:92-100](https://github.com/AprilCrystal/dsh-remote/blob/76ad90aab2e54d5c07319ce544ba144be99421f5/lib/panel.js#L92-L100)

面板所有能力共用同token，提供能力拆分的推导依据。

```text
/** Whether this request carries the panel credential, in a header or the cookie. */
function authenticated(req, token) {
  const cookies = parseCookies(req.headers['cookie'])
  if (cookies.get(COOKIE_NAME) === token) return true
  const header = req.headers['authorization']
  if (typeof header !== 'string') return false
  const match = /^Bearer\s+(.+)$/iu.exec(header.trim())
  return match !== null && match[1] === token
}
```

#### 缺口

- 客户端能否携带会话级能力及撤销一致性未知。
  **影响**：方案可能需要分开兼容API与高级面板。
  **进一步探讨**：先实现有限能力原型，测试兼容协议和失效传播。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
