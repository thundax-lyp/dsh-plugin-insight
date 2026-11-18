# DSH Remote Web UI（DamonKoy 分叉）

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[3647a33](https://github.com/DamonKoy/dsh-web-ui/tree/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/DamonKoy/dsh-web-ui)
<!-- END META -->

> **功能**：在 DSH Web 侧栏生成手机配对码，在手机页面打开会话，并从本机界面检查同系列插件更新。

> **亮点**：[Q01](#research-q01) 把侧栏配对、工作区跳转和小屏消息操作排成一条可跟踪的流程。手机客户端通过白名单复用宿主方法，并把非交互事件通过 SSE 送出。

> **主要限制**：[Q02](#research-q02) 的移动 SSE 只在握手验证设备，代码没有接入撤销时取消已连订阅。[Q01](#research-q01) 的工作区别名用于导航，不能作为隔离边界。[Q03](#research-q03) 的总开关还与公网隧道开关分开。

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
  - [Q01 · 手机上怎样接续现有工作区，相对直接访问桌面 Web 多了哪些步骤？](#detail-section-11)
  - [Q02 · 配对刷新、撤销和 API 门控覆盖请求与既有事件流吗？](#detail-section-12)
  - [Q03 · 本地试用、隧道与关闭路径分别依赖什么？](#detail-section-13)
  - [Q04 · 一键更新实际改哪个 profile，退出零能确认什么？](#detail-section-14)
  - [Q05 · 哪一类远程场景可受益，如何验证风险足以影响采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用 DSH Web 的开发者离开桌面后，可能想用手机看正在进行的会话、选择模型或接着发一条指令。

对照手机直接打开桌面 DSH Web 和回到桌面后继续。直接打开仍需访问地址与现有授权，且使用完整布局；回到桌面保留原有信任边界但无法在途中接续。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 扫码配对 | 从电脑发起手机入口并绑定设备 | 本机签发、目标需可达，令牌过期或使用后失效 |
| 小屏会话 | 在手机读取历史、选择模型或提交提示 | 需要配对、ApiProxy 及宿主授权 |
| 设备撤销 | 停止后拒绝重新发起的请求 | 既有事件流终止需要单独核查 |
| 公共隧道 | 按需发布可达的公网 URL | 总开关和隧道开关分开，默认不启用 |
| 本机版本检查 | 查阅状态并针对当前 profile 操作升级 | 回环控制，链接安装拒绝执行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web Cordis 主机、客户端及槽位 | 必需 | 装配两端与侧栏入口 | 无注册或面板入口 |
| WebServer 和 ApiProxy | 手机数据必需 | 公开页面并转发受限会话方法 | 手机路由或数据能力缺失 |
| 能从手机到达的 LAN 地址 | 本地路径需要 | 将二维码地址转化为连接 | 首选检查监听和防火墙 |
| cloudflared 或独立公共 URL | 公共路径按需 | 将外部网络接到本机 | 地址失效或隧道进程未拉起 |
| 确认归属的 npm 发行与 profile | 更新按需 | 检查并更新包 | 本地链接触发拒绝，包名不能证明分叉身份 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户确认隔离 profile、工作区和手机网络 | 面板可见，目标不存在真实敏感数据 |
| 配对 | 从本机发起二维码，手机打开并接受 | 确认进入目标工作区，旧码不可复用 |
| 使用 | 在小屏看回话并发一条无副作用消息 | 观察新请求与事件流均能进行 |
| 撤销 | 用户停止配对，检查设备与已有事件流 | 分别观察新请求、旧流；公共测试另关隧道 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 桌面宿主、局域网及设备资源，实际金额未知 | 核 profile、依赖和防火墙，从本机完成配对 | 手机连通与宿主版本未实测 |
| 持续 | SSE、主机与可选隧道的网络和资源占用未知 | 处理重连、设备上限与更新复核 | 远程效果与延迟无同任务数据 |
| 失败恢复 | 可另行保留工作区与 profile 副本 | 复核停用／撤销、退出公网地址、恢复原发布物 | 已连事件流止流及升级回滚需验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 小屏接续 | 一次配对导航到移动工作区，并代理部分会话方法 | 目标设备浏览器和实际操作耗时 |
| 设备撤销 | 停止清会话，后续新请求查设备 | 已有事件流何时真正断开 |
| 本机更新 | 查版本移动并报告部分不成功状态 | 更新全量依赖和重启后插件可用性 |

> **思考**：[Q02](#research-q02) 的移动 SSE 只在握手验证设备，代码没有接入撤销时取消已连订阅。[Q01](#research-q01) 的工作区别名用于导航，不能作为隔离边界。[Q03](#research-q03) 的总开关还与公网隧道开关分开。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把侧栏配对、工作区跳转和小屏消息操作排成一条可跟踪的流程。手机客户端通过白名单复用宿主方法，并把非交互事件通过 SSE 送出。

[Q02](#research-q02) 把令牌签发、设备管理和方法检查分别接线，暴露可区分的失败状态。[Q04](#research-q04) 重新解析并对比更新前后已知版本，避免把退出零直接当成功。不同退出动作需要宿主和网络分别观测。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的移动 SSE 只在握手验证设备，代码没有接入撤销时取消已连订阅。[Q01](#research-q01) 的工作区别名用于导航，不能作为隔离边界。[Q03](#research-q03) 的总开关还与公网隧道开关分开。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议先关注此方案。做受控验证时只用临时 Web profile、无真实数据工作区及隔离局域网，先验证新请求和已连事件流都能在撤销后结束，再评估长期远程接入。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持手机配对、电话端工作区与会话操作、按方法转发以及本机版本检查。既有流的撤销、宿主鉴权和真实网络兼容仍待验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-remote-web-ui/README.md、packages/dsh-remote-web-ui/src/client/index.ts、packages/dsh-remote-web-ui/src/routes.ts、packages/dsh-remote-web-ui/src/client/deep-link.ts、packages/dsh-remote-web-ui/src/pairing.ts、packages/dsh-remote-web-ui/src/mobile-api.ts、packages/dsh-remote-web-ui/src/index.ts、packages/dsh-remote-web-ui/src/gate.ts、packages/dsh-remote-web-ui/package.json、packages/dsh-remote-web-ui/cordis.patch.yml、packages/dsh-remote-web-ui/tsdown.config.ts、packages/dsh-remote-web-ui/src/tunnel.ts、packages/dsh-remote-web-ui/src/update.ts、packages/dsh-remote-web-ui/src/update-routes.ts、shared/tsdown.client.ts 及固定范围 inventory；组件：packages/dsh-remote-web-ui。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查 DamonKoy 分叉固定提交的 remote 子包与共享构建映射。没有运行目标代码、发布包、真实 Web 宿主、手机端或隧道，也没有对外暴露端点。
- 下一步：按 [Q05](#research-q05) 对照同一任务及两台设备，观察配对、切换、停止与踢出设备后的 HTTP 回执和已有流，并交叉检查工作区授权。

**分析版本**

- **仓库**：[DamonKoy/dsh-web-ui](https://github.com/DamonKoy/dsh-web-ui)
- **版本号**：0.1.16（[固定提交 3647a33](https://github.com/DamonKoy/dsh-web-ui/tree/3647a33fa467e0335260468614f6eed04b196c38)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出同一个设备撤销信号既拒绝新请求，也结束已打开的事件流，并让本机界面显示切断完成时间。通过两台设备与不同退出动作验证是否确实减少撤销后继续收帧。

按 [Q05](#research-q05) 对照同一任务及两台设备，观察配对、切换、停止与踢出设备后的 HTTP 回执和已有流，并交叉检查工作区授权。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 570 | — | — | 7937 |
| .ts | source | 27 | 6028 | 4133 | 1441 | — |
| .tsx | source | 15 | 2682 | 2107 | 426 | — |
| .ts | test | 12 | 2568 | 2236 | 211 | — |
| .tsx | test | 5 | 1124 | 918 | 90 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+is%3Aopen) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z)

暂未获取：近30天新建。

统计日期：2026-11-18。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：让已经运行 DSH Web 的开发者用手机接续一次会话时，此组件增加了哪些连接和交互能力，什么条件会妨碍安全试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 手机上怎样接续现有工作区，相对直接访问桌面 Web 多了哪些步骤？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

在电脑上发起 DSH 会话后，要离开桌面的开发者可先从本机侧栏生成配对链接，再让手机从小屏页面接续一次工作区选择或消息提交。直接在手机打开桌面 Web 需要找到地址并使用完整界面；此组件把可用地址、配对状态和当前工作区进门位置放在同一个流程。侧栏有旧槽位及新槽位两条注册路径。宿主签发 URL 时带 pair 以及可选 workspace；浏览器接受成功后删除令牌查询，在移动 UA 上转入 /m，并保留 workspace。

手机接口按白名单接出工作区与会话列表、历史、搜索、提交提示和切换模型等能力，调用由宿主 ApiProxy 执行。工作区查询参数指导界面导航，服务端 accept 保存的设备项只有创建及活跃时间；接口通过设备 ID 放行，再按方法与载荷转发，当前插件入口未用原二维码工作区约束每次调用。不能把一个工作区的扫码入口当作设备级授权范围。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/client/index.ts:112-154](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/client/index.ts#L112-L154)

根据槽位和 enabled 注册侧栏动作。

<details>
<summary>查看原文（43行）</summary>

```text
  // Sidebar foot entry: the shell declares 'sidebar.remote' in unconstrained
  // order, so registration is declaration-aware — slots.inject waits on the
  // declaration, removes the contribution when it collapses, and re-runs
  // after a redeclaration. The entry follows the plugin's enabled setting:
  // toggling it off removes the trigger, toggling it back on re-registers it.
  ctx.slots.inject('sidebar.remote', () => {
    let disposeEntry: (() => void) | undefined
    const syncEntry = (): void => {
      if (enabled() && disposeEntry === undefined) {
        disposeEntry = ctx.slots.register({ name: 'sidebar.remote', locale: NS }, RemoteEntry)
      } else if (!enabled() && disposeEntry !== undefined) {
        disposeEntry()
        disposeEntry = undefined
      }
    }
    const unsubscribe = settingsScope.subscribe(syncEntry)
    syncEntry()
    return () => {
      unsubscribe()
      disposeEntry?.()
    }
  })

  // Current shells declare `sidebar.footer.action` instead of the legacy
  // `sidebar.remote` seat; this fallback registers the same entry there when
  // the legacy seat never arrives (declaration-aware: only one of the two
  // injects ever fires, so the trigger can never render twice).
  ctx.slots.inject('sidebar.footer.action', () => {
    let disposeEntry: (() => void) | undefined
    const syncEntry = (): void => {
      if (enabled() && disposeEntry === undefined) {
        disposeEntry = ctx.slots.register({ name: 'sidebar.footer.action', id: 'remote-web-ui', locale: NS }, FooterRemoteEntry)
      } else if (!enabled() && disposeEntry !== undefined) {
        disposeEntry()
        disposeEntry = undefined
      }
    }
    const unsubscribe = settingsScope.subscribe(syncEntry)
    syncEntry()
    return () => {
      unsubscribe()
      disposeEntry?.()
    }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:250-275](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/routes.ts#L250-L275)

本机签发携带令牌和可选工作区的 URL。

<details>
<summary>查看原文（26行）</summary>

```text
  const handleIssue = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (!requireMethod(req, res, 'POST')) return
    if (!loopbackFence(req)) {
      writeJson(res, 403, { ok: false, code: 'forbidden' })
      return
    }
    const body = await readJsonBody(req)
    const payload = parsePairPayload(issuePayloadSchema, body)
    if (payload === undefined) {
      writeJson(res, 400, { ok: false, code: 'bad-payload' })
      return
    }
    const { workspaceId, address } = payload
    try {
      const { token, expiresAt } = service.issue(workspaceId, address)
      // The default base is the public (tunneled) URL when configured — a
      // phone anywhere can reach it — and the first LAN interface otherwise.
      // An explicit address always names a LAN literal.
      const base = address === undefined ? (service.publicBaseUrl ?? service.lanBaseUrl) : service.lanBaseUrlFor(address)
      if (base === undefined) throw new Error('remote-web-ui: base unavailable')
      const workspaceQuery = workspaceId === undefined ? '' : `&workspace=${encodeURIComponent(workspaceId)}`
      writeJson(res, 200, {
        ok: true,
        url: `${base}/?pair=${token}${workspaceQuery}`,
        token,
        expiresAt,
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/client/deep-link.ts:77-104](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/client/deep-link.ts#L77-L104)

接受后剥离令牌并对移动 UA 导航到独立入口。

<details>
<summary>查看原文（28行）</summary>

```text
/** Accept the token, then enter the matching desktop/mobile surface. */
async function runAccept(token: string, page: PageSurface): Promise<void> {
  let ok = false
  try {
    const result = await acceptPair(token)
    ok = result.ok
    if (!ok) sessionStorage.setItem(PAIR_FAILED_MARKER, 'failed')
  } catch {
    sessionStorage.setItem(PAIR_FAILED_MARKER, 'failed')
  }
  // Drop the token from the URL either way: an accepted token is consumed
  // (a re-scan would 409), and a failed one must not loop.
  const url = new URL(page.href)
  url.searchParams.delete('pair')
  page.replaceState(`${url.pathname}${url.search}${url.hash}`)
  if (ok) {
    // Phones land on the standalone simplified surface (the full desktop UI
    // is not built for small screens). Keep the workspace target so the
    // mobile surface can open the intended workspace instead of losing the
    // QR context at this navigation boundary.
    if (isMobileSurface()) {
      url.pathname = '/m'
      page.navigate(`${url.pathname}${url.search}${url.hash}`)
    } else {
      page.reload()
    }
  }
}
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:240-257](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/pairing.ts#L240-L257)

设备会话保存创建和活跃时间，未携带原工作区。

<details>
<summary>查看原文（18行）</summary>

```text
  accept(token: string): AcceptResult {
    const record = this.tokens.get(token)
    if (record === undefined || record.consumed || this.stopped || this.clock.now() > record.expiresAt) {
      return { ok: false, code: record?.consumed === true ? 'used' : 'invalid' }
    }
    record.consumed = true
    const deviceId = this.clock.randomToken()
    const now = this.clock.now()
    if (this.devices.size >= this.config.maxDevices) {
      // Evict the oldest session (FIFO) before binding a new device.
      let oldest: { id: string; createdAt: number } | undefined
      for (const [id, session] of this.devices) {
        if (oldest === undefined || session.createdAt < oldest.createdAt) oldest = { id, createdAt: session.createdAt }
      }
      if (oldest !== undefined) this.devices.delete(oldest.id)
    }
    this.devices.set(deviceId, { createdAt: now, lastSeenAt: now })
    this.notify()
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/mobile-api.ts:30-48](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/mobile-api.ts#L30-L48)

允许的移动方法及单独读取本地配置。

<details>
<summary>查看原文（19行）</summary>

```text
/** Methods the phone surface may call. Everything else is refused. */
const MOBILE_ALLOWLIST = new Set([
  'workspace.list',
  'session.create',
  'session.list',
  'session.history',
  'session.search',
  'session.prompt',
  'session.models',
  'session.selectModel',
  'session.rename',
])

/**
 * Locally answered display-preference method (the phone's read-only
 * surface preferences; never proxied to the host ApiProxy and never a
 * settings-domain write).
 */
const MOBILE_PREFERENCES_METHOD = 'mobile.preferences'
```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/mobile-api.ts:117-161](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/mobile-api.ts#L117-L161)

请求经设备及方法门控后按载荷交给宿主。

<details>
<summary>查看原文（45行）</summary>

```text
  const handleMethod = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (req.method !== 'POST') {
      res.writeHead(405)
      res.end()
      return
    }
    if (!gateOk(req)) {
      writeJson(res, 403, { ok: false, error: { code: 'unpaired', message: 'mobile session is not paired' } })
      return
    }
    const pathname = new URL(req.url ?? '/', 'http://x').pathname
    if (!pathname.startsWith(MOBILE_API_METHOD_PREFIX)) {
      writeJson(res, 404, { ok: false, error: { code: 'not-found', message: 'unknown mobile api path' } })
      return
    }
    const method = pathname.slice(MOBILE_API_METHOD_PREFIX.length)
    const local = method === MOBILE_PREFERENCES_METHOD
    if (!MOBILE_ALLOWLIST.has(method) && !local) {
      writeJson(res, 403, { ok: false, error: { code: 'forbidden', message: `method ${method} is not exposed to the mobile surface` } })
      return
    }
    let envelope: unknown
    try {
      envelope = await readJsonBody(req)
    } catch {
      writeJson(res, 400, { ok: false, error: { code: 'bad-request', message: 'invalid json body' } })
      return
    }
    const parsed = envelope as { rpcId?: unknown; payload?: unknown }
    const rpcId = typeof parsed?.rpcId === 'string' ? parsed.rpcId : ''
    if (rpcId === '') {
      writeJson(res, 400, { ok: false, error: { code: 'bad-request', message: 'missing rpcId' } })
      return
    }
    if (local) {
      writeJson(res, 200, {
        type: 'server-response',
        rpcId,
        result: { ok: true, value: { mobileEnterToSend: mobileEnterToSend() } },
      })
      return
    }
    try {
      const response = await dispatch(apiProxy, method, parsed?.payload, rpcId)
      writeJson(res, 200, response)
```

</details>

#### 缺口

- 同版本手机真实任务未执行
  **影响**：不能确认模型权限、会话投影和小屏操作在目标宿主都可用
  **进一步探讨**：在两份无敏感数据工作区分别扫码并核对授权和导航行为。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配对刷新、撤销和 API 门控覆盖请求与既有事件流吗？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

配对服务签发新码时清空旧码，接受后将记录标为已消费，过期或已消费均拒绝。默认令牌十分钟，设备上限四台，超过上限按创建时间移除最早设备。接受路由校验 Host/同站来源和 JSON 体，并按连接对端 IP 限流，发 HttpOnly、SameSite=Lax 的设备 Cookie；LAN 地址以 HTTP 生成，Cookie 没有 Secure 属性，部署时应把链路明文暴露单独计入。停止配对清空令牌和设备。非回环通用 API 默认走设备门控；专用移动接口另查设备存活。连接活动可刷新 presence，界面显示离线与设备撤销是不同状态。

新的移动 POST 与新连 SSE 会在撤销后拒绝相同 Cookie。已经打开的移动事件流仅在握手时检查 Cookie，后续循环只检查传输是否关闭，本地断开才 abort 宿主订阅。由此可以确认此入口没有逐帧或撤销事件检查；能否依赖上游关流还未核验，不能按点击停止就断开既有流来验收。设备上限踢除也有相同检查边界。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:110-119](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/index.ts#L110-L119)

缺省有效期、设备上限和 LAN 门控参数。

<details>
<summary>查看原文（10行）</summary>

```text
export const Config: z<Config> = z.object({
  tokenTtlMs: z.number().step(1).min(60_000).default(10 * 60_000),
  offlineAfterMs: z.number().step(1).min(5_000).default(25_000),
  maxDevices: z.number().step(1).min(1).max(64).default(4),
  cookieName: z.string().min(1).default('dsh_pair'),
  requirePairingForLan: z.boolean().default(true),
  publicBaseUrl: z.string(),
  autoTunnel: z.boolean().default(false),
  mobileEnterToSend: z.boolean().default(true),
  enabled: z.boolean().default(true),
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:31-59](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/routes.ts#L31-L59)

可信 Host 及浏览器跨站标记校验。

<details>
<summary>查看原文（29行）</summary>

```text
export function isTrustedApiRequest(request: IncomingMessage, trustedHosts: readonly string[]): boolean {
  const host = request.headers.host
  if (typeof host !== 'string') return false
  let hostUrl: URL
  try {
    hostUrl = new URL(`http://${host}`)
  } catch {
    return false
  }
  const hostname = hostUrl.hostname
  const trusted = isLoopbackClient(request) || trustedHosts.some(entry => {
    // A port-less entry matches the hostname on any port; an exact host:port
    // entry matches that authority verbatim (WHATWG normalization both sides).
    const entryUrl = new URL(`http://${entry}`)
    return entryUrl.port === '' ? entryUrl.hostname === hostname : entryUrl.host === hostUrl.host
  })
  if (!trusted) return false
  // Cross-site fence: an explicit cross-site marker is refused regardless of
  // Origin (modern browsers label the initiator on every fetch).
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  // Origin fence: when a browser attaches an Origin it must be exactly this
  // authority; absent Origin is fine — the Host fence already bound it.
  const origin = request.headers.origin
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:234-248](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/routes.ts#L234-L248)

接受次数按连接对端 IP 节流。

<details>
<summary>查看原文（15行）</summary>

```text
  /** Per-source-IP accept rate limit (brute-force defense in depth). */
  const acceptAttempts = new Map<string, { count: number; windowStart: number }>()
  const ACCEPT_MAX_ATTEMPTS = 10
  const ACCEPT_WINDOW_MS = 30_000
  const rateLimitAccept = (req: IncomingMessage): boolean => {
    const ip = (req.socket as { remoteAddress?: string } | undefined)?.remoteAddress ?? 'unknown'
    const nowMs = Date.now()
    const entry = acceptAttempts.get(ip)
    if (entry === undefined || nowMs - entry.windowStart > ACCEPT_WINDOW_MS) {
      acceptAttempts.set(ip, { count: 1, windowStart: nowMs })
      return false
    }
    entry.count += 1
    return entry.count > ACCEPT_MAX_ATTEMPTS
  }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:294-321](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/routes.ts#L294-L321)

配对请求校验及 Cookie 布置。

<details>
<summary>查看原文（28行）</summary>

```text
  const handleAccept = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (!requireMethod(req, res, 'POST')) return
    if (!lanFence(req)) {
      writeJson(res, 403, { ok: false, code: 'forbidden' })
      return
    }
    if (rateLimitAccept(req)) {
      writeJson(res, 429, { ok: false, code: 'rate-limited' })
      return
    }
    const body = await readJsonBody(req)
    const payload = parsePairPayload(acceptPayloadSchema, body)
    if (payload === undefined) {
      writeJson(res, 400, { ok: false, code: 'bad-payload' })
      return
    }
    const result = service.accept(payload.token)
    if (!result.ok) {
      writeJson(res, result.code === 'used' ? 409 : 404, { ok: false, code: result.code })
      return
    }
    res.writeHead(200, {
      'content-type': 'application/json; charset=utf-8',
      'set-cookie': [
        `${service.config.cookieName}=${result.deviceId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${String(COOKIE_MAX_AGE_SEC)}`,
      ],
    })
    res.end(JSON.stringify({ ok: true, deviceId: result.deviceId }))
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:216-230](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/pairing.ts#L216-L230)

刷新时清除旧令牌。

<details>
<summary>查看原文（15行）</summary>

```text
    const now = this.clock.now()
    const token = this.clock.randomToken()
    this.tokens.clear()
    this.stopped = false
    this.tokenSerial += 1
    this.tokens.set(token, {
      id: `t${this.tokenSerial}`,
      issuedAt: now,
      expiresAt: now + this.config.tokenTtlMs,
      consumed: false,
      ...(workspaceId !== undefined ? { workspaceId } : {}),
      ...(address !== undefined ? { address } : {}),
    })
    this.notify()
    return { token, expiresAt: now + this.config.tokenTtlMs }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:240-285](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/pairing.ts#L240-L285)

一次接受、上限踢除、清空会话及刷新活跃时间。

<details>
<summary>查看原文（46行）</summary>

```text
  accept(token: string): AcceptResult {
    const record = this.tokens.get(token)
    if (record === undefined || record.consumed || this.stopped || this.clock.now() > record.expiresAt) {
      return { ok: false, code: record?.consumed === true ? 'used' : 'invalid' }
    }
    record.consumed = true
    const deviceId = this.clock.randomToken()
    const now = this.clock.now()
    if (this.devices.size >= this.config.maxDevices) {
      // Evict the oldest session (FIFO) before binding a new device.
      let oldest: { id: string; createdAt: number } | undefined
      for (const [id, session] of this.devices) {
        if (oldest === undefined || session.createdAt < oldest.createdAt) oldest = { id, createdAt: session.createdAt }
      }
      if (oldest !== undefined) this.devices.delete(oldest.id)
    }
    this.devices.set(deviceId, { createdAt: now, lastSeenAt: now })
    this.notify()
    return { ok: true, deviceId }
  }

  /**
   * Stop remote control: revoke every device session and clear the token.
   * The phone's next gated /api request 403s; the panel falls back to
   * stopped until a fresh QR is issued.
   */
  stop(): void {
    this.tokens.clear()
    this.devices.clear()
    this.stopped = true
    this.notify()
  }

  /**
   * The api/gate path: record activity for a device id and report whether
   * the request may proceed. Unknown or revoked ids (including any device
   * after stop()) are refused.
   * @param deviceId - the cookie value of the requesting device.
   * @returns true when the device session is live and was refreshed.
   */
  touchDevice(deviceId: string): boolean {
    const session = this.devices.get(deviceId)
    if (session === undefined || this.stopped) return false
    session.lastSeenAt = this.clock.now()
    this.notify()
    return true
```

</details>

**依据 7 · 源码核查**：[packages/dsh-remote-web-ui/src/gate.ts:106-120](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/gate.ts#L106-L120)

通用 API 在非回环且强制配对时校验设备。

<details>
<summary>查看原文（15行）</summary>

```text
export function makeGateListener(
  service: PairingService,
  requirePairingForLan: boolean | (() => boolean) = true,
  enabled: boolean | (() => boolean) = true,
): (request: IncomingMessage, method: string | undefined, next: () => boolean | Promise<boolean>) => boolean | Promise<boolean> {
  return (request, _method, next) => {
    if (isLoopbackClient(request)) return next()
    const active = typeof enabled === 'function' ? enabled() : enabled
    if (!active) return false
    const require = typeof requirePairingForLan === 'function' ? requirePairingForLan() : requirePairingForLan
    if (!require) return next()
    const deviceId = readCookie(request.headers.cookie, service.config.cookieName)
    if (deviceId === undefined) return false
    return service.touchDevice(deviceId) ? next() : false
  }
```

</details>

**依据 8 · 源码核查**：[packages/dsh-remote-web-ui/src/mobile-api.ts:172-219](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/mobile-api.ts#L172-L219)

移动 SSE 仅在打开时核验设备，循环无再查。

<details>
<summary>查看原文（48行）</summary>

```text
  /** Bridge the host mux stream over SSE: one `data:` frame per mux frame. */
  const handleEvents = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (req.method !== 'GET') {
      res.writeHead(405)
      res.end()
      return
    }
    if (!gateOk(req)) {
      res.writeHead(403)
      res.end('forbidden')
      return
    }
    res.writeHead(200, {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
    })
    const controller = new AbortController()
    let closed = false
    const heartbeat = setInterval(() => {
      if (closed) return
      try {
        res.write(': ping\n\n')
      } catch {
        // The write failed; the close handler tears the subscription down.
      }
    }, eventsHeartbeatMs)
    const onClose = (): void => {
      if (closed) return
      closed = true
      controller.abort()
      clearInterval(heartbeat)
    }
    res.on('close', onClose)
    req.on('close', onClose)
    try {
      const frames = apiProxy.events.mux({ rpcId: RpcId(`mobile-mux-${Date.now().toString(36)}`), payload: {} }, controller.signal)
      for await (const frame of frames) {
        if (closed) break
        res.write(`data: ${JSON.stringify(frame)}\n\n`)
      }
    } catch {
      // The stream ended or errored; the EventSource reconnects.
    } finally {
      controller.abort()
      clearInterval(heartbeat)
    }
    if (!closed) res.end()
```

</details>

#### 缺口

- 实际代理、浏览器及已有 SSE 的撤销效果未复现
  **影响**：同一台手机可能没有新请求权限，但既有事件流仍要独立检查
  **进一步探讨**：在两台测试设备中记录撤销时已连 SSE、新 SSE、新 POST 三路回执。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地试用、隧道与关闭路径分别依赖什么？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

包清单导出宿主与 Web 两面，Cordis 补丁将真实包行注入 DSH；构建配置还产生手机入口，宿主注册需要 webServer，并按 apiProxy 是否存在决定是否注册手机数据代理。局域网路径在 webServer 监听 0.0.0.0 时为本机 IPv4 地址建立 HTTP URL；路由不通或防火墙阻拦时仍不可用。若提供手工公共 URL 或开启自动隧道，可不改变本地监听就组成配对链接。自动路径使用 cloudflared 快速隧道，以实际端口的回环 HTTP 为上游；隧道失败或重启时清理旧地址。

总开关关闭会撤销设备、注销路由并清理 presence 计时，plugin 存续期间通用门控仍阻断非回环 API。控制流先依据 autoTunnel 处理隧道，再依据 enabled 处理设备和路由；因此当自动隧道开关仍为真时，不能把关闭总开关当作关闭公网监听。显式关闭 autoTunnel 或卸载时的 dispose 才会调用 stop。公共入口上线需要用户验证提供方、公共暴露和访问控制，当前结论只支持隔离范围内的评估计划。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/package.json:43-59](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/package.json#L43-L59)

声明 DSH patch 与 Web 注入，依赖 cloudflared。

<details>
<summary>查看原文（17行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-sidebar"
      ],
      "platform": "web"
    }
  },
  "dependencies": {
    "cloudflared": "^0.7.3",
    "clsx": "^2.1.1",
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/cordis.patch.yml:8-10](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/cordis.patch.yml#L8-L10)

实际插件行。

```text
- insert:
    - id: remote-web-ui
      name: '@linxin666/dsh-remote-web-ui'
```

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/tsdown.config.ts:1-18](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/tsdown.config.ts#L1-L18)

主机、客户端及手机伴随构建。

<details>
<summary>查看原文（18行）</summary>

```text
import { clientBundle, mobileBundle } from '../../shared/tsdown.client.ts'

export default clientBundle('@linxin666/dsh-remote-web-ui', ['src/index.ts', 'src/invariant.ts'], {
  libExternal: [
    /^@deepseek-ai\/dsh-host-apiproxy/,
    '@deepseek-ai/dsh-client-connection',
    '@deepseek-ai/dsh-client-locale',
    '@deepseek-ai/dsh-client-runtime',
    '@deepseek-ai/dsh-client-ui-primitives',
    '@deepseek-ai/dsh-client-ui-settings',
    '@deepseek-ai/dsh-client-ui-sidebar',
    '@deepseek-ai/dsh-client-ui-slots',
    '@deepseek-ai/dsh-host-webserver',
    '@deepseek-ai/dsh-invariants',
    '@deepseek-ai/dsh-settings',
  ],
  companions: [mobileBundle('@linxin666/dsh-remote-web-ui', 'src/mobile/index.tsx')],
})
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:195-221](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/index.ts#L195-L221)

隧道阶段映射、卸载回收与 LAN 地址生成。

<details>
<summary>查看原文（27行）</summary>

```text
  tunnel.onPhase((info: TunnelInfo) => {
    if (!autoTunnel) return
    if (info.phase === 'running' && info.url !== undefined) {
      service.setPublicBaseUrl(info.url)
      service.setTunnelStatus({ state: 'running', url: info.url })
    } else if (info.phase === 'starting') {
      // A restart mints a NEW hostname: the previous URL dies with the old
      // process, so clear it now rather than advertising a dead link.
      service.setPublicBaseUrl(undefined)
      service.setTunnelStatus({ state: 'starting' })
    } else if (info.phase === 'failed') {
      service.setPublicBaseUrl(undefined)
      service.setTunnelStatus(info.error === undefined ? { state: 'failed' } : { state: 'failed', error: info.error })
    }
  })
  ctx.effect(() => () => {
    tunnel.dispose()
  }, 'remote-web-ui: auto tunnel')
  // The bind facts are known by now (webServer is an inject edge): the LAN
  // bases are frozen per process, matching the CLI's once-per-invocation
  // sampling stance. The QR can only advertise addresses the fence accepts;
  // every interface gets its own base URL so a multi-homed machine can pick
  // the network the phone can actually reach.
  const lanBases = ctx.webServer.host === '0.0.0.0'
    ? lanIPv4Addresses().map(address => ({ address, base: `http://${address}:${String(ctx.webServer.port)}` }))
    : []
  service.setLanBases(lanBases)
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:302-309](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/index.ts#L302-L309)

只在 ApiProxy 存在时挂接手机数据层。

```text
  const routes = [
    ...makeRoutes({ service, lanAddresses }),
    ...makeMobileRoutes(),
    ...(apiProxy !== undefined
      ? makeMobileApiRoutes({ service, apiProxy, mobileEnterToSend: () => resolve().mobileEnterToSend })
      : []),
    ...updateRoutes,
  ]
```

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:320-365](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/index.ts#L320-L365)

隧道由独立设置同步，总开关清设备与路由。

<details>
<summary>查看原文（46行）</summary>

```text
    // The auto tunnel owns the public base while enabled: the minted URL
    // lands in the service through the tunnel's phase listener. The manual
    // publicBaseUrl applies only when the auto tunnel is off.
    autoTunnel = value.autoTunnel === true
    if (autoTunnel) {
      if (value.publicBaseUrl !== undefined) {
        console.warn('remote-web-ui: autoTunnel is on — ignoring the manually configured publicBaseUrl')
      }
      tunnel.start(`http://127.0.0.1:${String(ctx.webServer.port)}`)
    } else {
      tunnel.stop()
      // A malformed public base is ignored with a warning — LAN-only behavior
      // stays intact rather than silently minting unusable QR links.
      if (value.publicBaseUrl !== undefined && !isHttpUrl(value.publicBaseUrl)) {
        console.warn(`remote-web-ui: ignoring malformed publicBaseUrl ${JSON.stringify(value.publicBaseUrl)} (expected https://host[:port])`)
        service.setPublicBaseUrl(undefined)
      } else {
        service.setPublicBaseUrl(value.publicBaseUrl)
      }
    }
    const enabled = value.enabled
    if (!enabled) service.stop()
    if (disposeRoutes === undefined && enabled) {
      disposeRoutes = ctx.effect(
        () => {
          const disposers = routes.map(route => ctx.webServer.register(route))
          return () => { for (const dispose of disposers) dispose() }
        },
        'remote-web-ui: pairing routes',
      )
    } else if (disposeRoutes !== undefined && !enabled) {
      disposeRoutes()
      disposeRoutes = undefined
    }
    if (disposeSweep === undefined && enabled) {
      disposeSweep = ctx.effect(
        () => {
          const timer = nodeSetInterval(() => { service.sweep() }, SWEEP_INTERVAL_MS)
          timer.unref()
          return () => { clearInterval(timer) }
        },
        'remote-web-ui: presence sweep',
      )
    } else if (disposeSweep !== undefined && !enabled) {
      disposeSweep()
      disposeSweep = undefined
```

</details>

**依据 7 · 源码核查**：[packages/dsh-remote-web-ui/src/tunnel.ts:59-64](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/tunnel.ts#L59-L64)

快速隧道禁用子进程自更新。

```text
/** Default factory: the cloudflared package's quick tunnel (no account). */
function defaultFactory(targetUrl: string): TunnelHandle {
  // `--no-autoupdate`: the binary must never upgrade itself out from under
  // the manager (a self-updated binary would break the pinned lifecycle).
  return Tunnel.quick(targetUrl, { '--no-autoupdate': true })
}
```

**依据 8 · 源码核查**：[packages/dsh-remote-web-ui/src/tunnel.ts:120-140](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/tunnel.ts#L120-L140)

明确停止和卸载行为。

<details>
<summary>查看原文（21行）</summary>

```text
  start(targetUrl: string): void {
    if (this.targetUrl === targetUrl && (this.phase === 'starting' || this.phase === 'running')) return
    this.teardown()
    this.stopping = false
    this.targetUrl = targetUrl
    this.attempts = 0
    this.attempt()
  }

  /** Stop the tunnel for good: no restarts, no state. */
  stop(): void {
    this.teardown()
    this.stopping = false
    this.targetUrl = undefined
    this.setPhase('stopped')
  }

  /** Alias of {@link stop} for plugin-effect disposal. */
  dispose(): void {
    this.stop()
  }
```

</details>

#### 缺口

- 宿主编译产物、手机网络和 cloudflared 服务未验证
  **影响**：设备兼容、首次联网成本及撤销暴露无法从源码量化
  **进一步探讨**：在隔离网络核对无隧道路径，若另行评估隧道，应跟踪禁用与卸载后公网 URL 和进程。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 一键更新实际改哪个 profile，退出零能确认什么？

**研究主题**：工程质量与复用、功能与机制、效果与总成本

#### 完整回答

更新路由在本机回环并通过来源检查时提供状态和执行。主机模块解析当前包或聚合包清单，向上寻找命名匹配的 profile，再拒绝文件、链接或找不到 profile 的开发安装。正常路径在目标 profile 目录运行 pnpm update --latest，候补是 corepack pnpm 及 npx，Windows 使用 shell 以启动脚本包装；这一步会变更依赖而非仅查询。

成功退出后重新解析当前清单并查询包版本。已知的某个目标版本发生变化即可成功返回，程序没有证明所有包都移动到最新；若有新版本但无一移动，则报 stale，注册表或版本查验失效会报 verify-failed。该路径不自动完成浏览器刷新以后对 DSH 的运行验证，也未提供恢复旧 profile 的事务。当前 fork 的固定清单是 0.1.16 且使用上游命名；仅凭这个副本的名称不能把注册表发行当作当前代码的升级路径。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:247-269](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/index.ts#L247-L269)

从宿主模块图解析清单，更新控制栅栏只接受回环条件。

<details>
<summary>查看原文（23行）</summary>

```text
  const requireFromHost = createRequire(import.meta.url)
  const resolveAnchorPath = (): string | undefined => resolveAnchorManifest(specifier => {
    try {
      return requireFromHost.resolve(specifier)
    } catch {
      return undefined
    }
  })
  const updateRoutes = makeUpdateRoutes({
    // Control endpoints are host-surface only: a LAN/phone origin must never
    // trigger a real install on this machine.
    fence: request => isTrustedApiRequest(request, []),
    check: () => checkUpdates({
      anchorManifestPath: resolveAnchorPath(),
      resolve: specifier => {
        try {
          return requireFromHost.resolve(specifier)
        } catch {
          return undefined
        }
      },
      fetchLatest: name => fetchLatestVersion(name, fetch),
    }),
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:270-299](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/index.ts#L270-L299)

选择更新目标，拒绝本地链接，然后启动经复查的更新。

<details>
<summary>查看原文（30行）</summary>

```text
    run: async (): Promise<UpdateRunResult> => {
      const target = resolveUpdateTarget({ anchorManifestPath: resolveAnchorPath() })
      if ('error' in target) {
        const code = target.error
        return {
          ok: false,
          exitCode: null,
          output: '',
          error: code === 'not-found' ? 'dsh-web-ui aggregate not installed' : 'local link install — update unavailable',
          errorCode: code,
        }
      }
      // Verify the versions actually moved after a green pnpm exit: the pnpm
      // 11 minimumReleaseAge gate can silently keep the installed versions
      // (same-day releases), which a plain exit-0 check would report as
      // success — the user then restarts and nothing changed.
      return runUpdateVerified({
        run: { profileDir: target.profileDir, packages: target.packages },
        check: {
          anchorManifestPath: resolveAnchorPath(),
          resolve: specifier => {
            try {
              return requireFromHost.resolve(specifier)
            } catch {
              return undefined
            }
          },
          fetchLatest: name => fetchLatestVersion(name, fetch),
        },
      })
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/update.ts:123-145](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/update.ts#L123-L145)

查找 profile 与识别链接安装。

<details>
<summary>查看原文（23行）</summary>

```text
export function findProfile(anchorManifestPath: string): FoundProfile | undefined {
  let dir = dirname(anchorManifestPath)
  for (let depth = 0; depth < PROFILE_WALK_DEPTH; depth++) {
    const manifest = readManifest(join(dir, 'package.json'))
    const name = manifest?.name
    if (typeof name === 'string' && name.startsWith(PROFILE_NAME_PREFIX)) {
      return { name: name.slice(PROFILE_NAME_PREFIX.length), dir }
    }
    const parent = dirname(dir)
    if (parent === dir) return undefined
    dir = parent
  }
  return undefined
}

/** A package version spec in a manifest dependencies map. */
type DependencySpec = string | { version: string } | undefined

/** Whether a dependency spec is a local link/file/dev-mode install. */
export function isLinkedSpec(spec: DependencySpec): boolean {
  if (typeof spec !== 'string') return false
  return /^(?:link|file):|^\.{1,2}(?:[/\\]|$)/.test(spec)
}
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/update.ts:422-445](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/update.ts#L422-L445)

工作目录、系统执行及回退命令。

<details>
<summary>查看原文（24行）</summary>

```text
export function runUpdate(deps: UpdateRunDeps): Promise<UpdateRunResult> {
  return new Promise((resolve) => {
    const spawnImpl = deps.spawnImpl ?? spawn
    const packages = deps.packages
    const platform = deps.platform ?? process.platform
    // Windows ships pnpm/corepack/npx as .cmd shims; Node's spawn cannot
    // start .cmd files directly (ENOENT even when installed), so route
    // them through cmd.exe there. POSIX spawns stay shell-free.
    const spawnOptions: Record<string, unknown> = {
      cwd: deps.profileDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      ...(platform === 'win32' ? { shell: true } : {}),
    }
    // Ordered fallback chain: each is tried only when the previous one is
    // missing on PATH (ENOENT on the spawn error event, never on close).
    // `--latest` is required: dsh plugin writes exact-version specs (e.g.
    // "0.1.12" without a range), and plain `pnpm update` treats an exact spec
    // as pinned — it prints "Already up to date" and exits 0 without moving
    // the installed version, so the panel would report a false success.
    const candidates: ReadonlyArray<{ command: string; args: string[] }> = [
      { command: 'pnpm', args: ['update', '--latest', ...packages] },
      { command: 'corepack', args: ['pnpm', 'update', '--latest', ...packages] },
      { command: 'npx', args: ['--yes', 'pnpm', 'update', '--latest', ...packages] },
    ]
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/update.ts:580-632](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/update.ts#L580-L632)

进程退出后按已知前后版本复查，任一匹配版本移动即可成功。

<details>
<summary>查看原文（53行）</summary>

```text
export async function runUpdateVerified(deps: UpdateRunVerifiedDeps): Promise<UpdateRunResult> {
  // Pre-run snapshot: the installed versions the update starts from. Only
  // successfully-read versions are recorded — a read failure (VERSION_UNKNOWN)
  // is not a baseline and must not look like a version that "moved", or a
  // green exit that left everything in place could be mistaken for success.
  const before = new Map<string, string>()
  for (const name of deps.run.packages) {
    const version = readInstalledVersion(deps.check.resolve, name)
    if (version !== VERSION_UNKNOWN) before.set(name, version)
  }
  const result = await runUpdate(deps.run)
  if (!result.ok) return result
  // Re-resolve the anchor after the run: pnpm removes the old version's
  // .pnpm directory, so a boot-time captured path no longer reads. Fall back
  // to the provided path only when nothing resolves now.
  const anchorManifestPath = resolveAnchorManifest(deps.check.resolve) ?? deps.check.anchorManifestPath
  const status = await checkUpdates({ ...deps.check, anchorManifestPath })
  // A green exit with no comparable result is not a success: registry probe
  // outage, missing anchor, or a non-npm install mode all mean the post-run
  // check could not verify anything.
  if (status.error !== undefined || status.mode !== 'npm') {
    return {
      ...result,
      ok: false,
      errorCode: 'verify-failed',
      error: 'pnpm exited 0 but the post-run version check could not verify the install',
    }
  }
  // A package "moved" only when a known pre-run version differs from a known
  // post-run version. A read failure on either side (VERSION_UNKNOWN) is not
  // evidence of movement and must not turn a no-op update into a success; a
  // package without a pre-run baseline is ignored — only the packages pnpm
  // was told to update count as evidence.
  const moved = status.packages.some(packageStatus => {
    const beforeVersion = before.get(packageStatus.name)
    if (beforeVersion === undefined || packageStatus.current === VERSION_UNKNOWN) return false
    return packageStatus.current !== beforeVersion
  })
  if (moved) return result
  // Nothing moved. A green exit is only a true no-op when the post-run check
  // proves the install is already current: every probe succeeded and nothing
  // is outdated. If a probe failed we cannot tell "already up to date" from
  // "a gate silently kept it back", so report verify-failed rather than a
  // false success.
  if (status.outdated) {
    // stale: the check ran, a newer release exists, and no package moved
    // (e.g. the minimumReleaseAge gate kept everything in place).
    return {
      ...result,
      ok: false,
      errorCode: 'stale',
      error: 'pnpm exited 0 but the installed versions did not change',
    }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/package.json:95-98](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/package.json#L95-L98)

提交携带的清单仓库地址仍指上游。

```text
  "repository": {
    "type": "git",
    "url": "https://github.com/zhu1090093659/dsh-web-ui.git"
  }
```

#### 缺口

- 当前分支与同名发布包的构建产物无归属证据
  **影响**：升级可能改变来源和依赖，需要单独验收
  **进一步探讨**：保留 profile 和锁文件，只在确认归属和来源的隔离实例中复核升级及重启。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪一类远程场景可受益，如何验证风险足以影响采用？

**研究主题**：采用判断、新假设与验证、贡献与相对优势

#### 完整回答

确有离开桌面后想从手机看会话或提问的开发者可观察此方案。相对直接访问桌面 Web，它把一次性配对和适合小屏的操作集放入同一个工作流。当前已连流的撤销时间、工作区作用域和公网撤出边界不明，建议保持观察。若要做后续对照，应使用临时 profile、两份无真实内容的工作区和一段测试任务，仅在隔离 LAN 对比配对小屏与现有访问路径的可达性、交互步骤和重连情况，避免将包升级、隧道和远程操作混为同一次试用。

待验证的改进是把设备撤销信号改成共享取消源，由会话表同一事件同时阻断新的请求及关闭该设备的已连事件流，并在面板显示真正的结束时间。以两台设备已订阅事件、停止及达到设备上限为对照，分别记录新请求 403、已有流的最后一帧时间及误关其他设备的次数。若当前宿主已独立即时结束所有撤销流，或新方案主要增加误关和重连负担，则不成立。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-remote-web-ui/README.md:19-37](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/README.md#L19-L37)

作者定位移动配对、同工作区入口和终止请求。

<details>
<summary>查看原文（19行）</summary>

```text
- **Entry**: a phone icon in the sidebar foot, next to the settings button.
- **Panel**: "移动端远程控制" title, "扫码或在手机上打开链接，即可远程控制当前工作区"
  subtitle, a "手机扫码连接" card with the status area ("等待手机连接" + status
  badge), a large QR code, the "无法扫码？可以在手机上打开链接" hint, and three
  buttons: 停止 / 刷新二维码 / 复制链接.
- **Phone side**: scanning the QR binds the phone with a one-time,
  time-limited token and lands it on the **standalone mobile surface at
  `/m`** — a thin client purpose-built for a small screen (see
  [Screenshots](#screenshots)), not the desktop UI squeezed into a phone.
  The link carries a `workspace` parameter so the phone lands in the same
  workspace the desktop was looking at.
- **Security**: one active one-time token (a refresh invalidates the old
  link; an accepted token cannot be reused; tokens expire). 停止 revokes
  every paired device and the current token — paired devices are cut off on
  their next request. When the plugin's `requirePairingForLan` gate is on
  (default), every non-loopback `/api` request must carry a live paired
  device cookie, so the QR is the only way into a LAN-exposed dsh web.
- **Live status**: the desktop panel mirrors the pairing state in real time
  (waiting → connected → disconnected) over an SSE stream.
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/mobile-api.ts:179-219](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/mobile-api.ts#L179-L219)

允许明确构造已订阅流与后续请求两个对照通道。

<details>
<summary>查看原文（41行）</summary>

```text
    if (!gateOk(req)) {
      res.writeHead(403)
      res.end('forbidden')
      return
    }
    res.writeHead(200, {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
    })
    const controller = new AbortController()
    let closed = false
    const heartbeat = setInterval(() => {
      if (closed) return
      try {
        res.write(': ping\n\n')
      } catch {
        // The write failed; the close handler tears the subscription down.
      }
    }, eventsHeartbeatMs)
    const onClose = (): void => {
      if (closed) return
      closed = true
      controller.abort()
      clearInterval(heartbeat)
    }
    res.on('close', onClose)
    req.on('close', onClose)
    try {
      const frames = apiProxy.events.mux({ rpcId: RpcId(`mobile-mux-${Date.now().toString(36)}`), payload: {} }, controller.signal)
      for await (const frame of frames) {
        if (closed) break
        res.write(`data: ${JSON.stringify(frame)}\n\n`)
      }
    } catch {
      // The stream ended or errored; the EventSource reconnects.
    } finally {
      controller.abort()
      clearInterval(heartbeat)
    }
    if (!closed) res.end()
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:248-270](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/pairing.ts#L248-L270)

上限与整体停止给出不同撤销试验入口。

<details>
<summary>查看原文（23行）</summary>

```text
    if (this.devices.size >= this.config.maxDevices) {
      // Evict the oldest session (FIFO) before binding a new device.
      let oldest: { id: string; createdAt: number } | undefined
      for (const [id, session] of this.devices) {
        if (oldest === undefined || session.createdAt < oldest.createdAt) oldest = { id, createdAt: session.createdAt }
      }
      if (oldest !== undefined) this.devices.delete(oldest.id)
    }
    this.devices.set(deviceId, { createdAt: now, lastSeenAt: now })
    this.notify()
    return { ok: true, deviceId }
  }

  /**
   * Stop remote control: revoke every device session and clear the token.
   * The phone's next gated /api request 403s; the panel falls back to
   * stopped until a fresh QR is issued.
   */
  stop(): void {
    this.tokens.clear()
    this.devices.clear()
    this.stopped = true
    this.notify()
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:320-352](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-remote-web-ui/src/index.ts#L320-L352)

隧道与主开关不同步的验证点。

<details>
<summary>查看原文（33行）</summary>

```text
    // The auto tunnel owns the public base while enabled: the minted URL
    // lands in the service through the tunnel's phase listener. The manual
    // publicBaseUrl applies only when the auto tunnel is off.
    autoTunnel = value.autoTunnel === true
    if (autoTunnel) {
      if (value.publicBaseUrl !== undefined) {
        console.warn('remote-web-ui: autoTunnel is on — ignoring the manually configured publicBaseUrl')
      }
      tunnel.start(`http://127.0.0.1:${String(ctx.webServer.port)}`)
    } else {
      tunnel.stop()
      // A malformed public base is ignored with a warning — LAN-only behavior
      // stays intact rather than silently minting unusable QR links.
      if (value.publicBaseUrl !== undefined && !isHttpUrl(value.publicBaseUrl)) {
        console.warn(`remote-web-ui: ignoring malformed publicBaseUrl ${JSON.stringify(value.publicBaseUrl)} (expected https://host[:port])`)
        service.setPublicBaseUrl(undefined)
      } else {
        service.setPublicBaseUrl(value.publicBaseUrl)
      }
    }
    const enabled = value.enabled
    if (!enabled) service.stop()
    if (disposeRoutes === undefined && enabled) {
      disposeRoutes = ctx.effect(
        () => {
          const disposers = routes.map(route => ctx.webServer.register(route))
          return () => { for (const dispose of disposers) dispose() }
        },
        'remote-web-ui: pairing routes',
      )
    } else if (disposeRoutes !== undefined && !enabled) {
      disposeRoutes()
      disposeRoutes = undefined
```

</details>

#### 缺口

- 没有真实用户任务或多设备对照
  **影响**：不能估计准备时间、防误操作收益和撤出负担
  **进一步探讨**：做一次离开桌面继续工作的受控回放，记录每次拒绝和退出。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
