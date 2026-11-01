# DS Harness Remote

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[9f08f43](https://github.com/liguobao/ds-harness-remote/tree/9f08f43be1f2af03d0b511f8143f13eb25926921)

<!-- BEGIN META -->
[![GitHub ★ 1,156](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C156&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/liguobao/ds-harness-remote)
<!-- END META -->

> **功能**：为 DSH 和其他工作区提供跨设备远程访问。

> **亮点**：整合跨设备连接与原工作区访问，宿主保留原会话和工具。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：加密不限制已授权终端副作用；Linux 安装方式可使 Host 和远程工具以 root 运行。[Q03](#research-q03)

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
  - [Q01 · 跨设备继续同一环境增加什么？](#detail-section-11)
  - [Q02 · 设备身份如何约束终端分发？](#detail-section-12)
  - [Q03 · 加密通道能否约束已授权终端的副作用？](#detail-section-13)
  - [Q04 · 如何受控试用和退出？](#detail-section-14)
  - [Q05 · 怎样减少断连后的重复写操作？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要离开电脑继续本机 DSH 会话的个人；基线是 VPN 和本地网页。[Q01](#research-q01)

使用可信 VPN 访问 DSH 网页或回到电脑。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 远程访问 | 继续 Host 会话 | 设备需受信 |
| 远程终端 | 控制 Host shell | 开关与运行身份关键 |
| RPC | 转发及错误响应 | 断线不回滚 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 兼容 Host 和受信设备 | 必需 | 原会话 | 停止连接 |
| 可用网络与中继 | 远程需要 | 双向通信 | 回本机 |
| 低权限运行环境 | 试用需要 | 限制副作用 | 不启用终端 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 准备 | 检查 Host 用户和设备 | 不可信则停止 |
| 试用 | 无副作用任务 | 核对会话 |
| 断线 | 回 Host 检查结果 | 未知不盲重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 网络和设备 | 配对与权限配置 | 不同安装身份不同 |
| 持续 | 中继、模型费用未知 | 设备维护 | 效率未测 |
| 恢复 | 上游任务副作用 | 本机对账 | 断线不回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 终端授权 | 开关与设备归属 | 全部 RPC 安全 |
| 远程任务 | 作者描述同一宿主 | 网络中断后结果 |

> **思考**：加密不限制已授权终端副作用；Linux 安装方式可使 Host 和远程工具以 root 运行。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：整合跨设备连接与原工作区访问，宿主保留原会话和工具。[Q01](#research-q01) [Q02](#research-q02)

终端开关与设备归属限制连接，RPC 有在途上限；业务副作用仍由 Host 权限决定。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

加密不限制已授权终端副作用；Linux 安装方式可使 Host 和远程工具以 root 运行。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

低权限隔离工作区验证设备与终端；不明结果先回 Host 对账。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持终端开关、设备归属和 RPC 限流；未运行设备或网络。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/plugin/src/terminal-policy.ts、packages/plugin/src/rpc-router.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 526 个指定扩展名文件、排除 11、错误 0；静态检查终端与 RPC，未运行设备。
- 下一步：固定 Host 和客户端，在隔离环境核验设备授权、断线及上游结果。

**分析版本**

- **仓库**：[liguobao/ds-harness-remote](https://github.com/liguobao/ds-harness-remote)
- **版本号**：0.6.0（[固定提交 9f08f43](https://github.com/liguobao/ds-harness-remote/tree/9f08f43be1f2af03d0b511f8143f13eb25926921)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：显示设备、请求及 Host 结果状态可减少断线误重试；需对照现有 RPC。[Q05](#research-q05)

固定 Host 和客户端，在隔离环境核验设备授权、断线及上游结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 46 | 13165 | — | — | 148958 |
| .tsx | source | 57 | 16424 | 14764 | 1012 | — |
| .ts | source | 264 | 62413 | 56108 | 2289 | — |
| .js | source | 4 | 464 | 429 | 18 | — |
| .mjs | source | 14 | 891 | 746 | 69 | — |
| .ts | test | 135 | 34605 | 32117 | 626 | — |
| .ts | example | 2 | 665 | 613 | 14 | — |
| .md | example | 2 | 61 | — | — | 355 |
| .mjs | test | 1 | 86 | 83 | 0 | — |
| .mjs | example | 1 | 56 | 54 | 2 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/liguobao/ds-harness-remote/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：跨设备远程访问如何连接授权设备与本机终端，断线和权限边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨设备继续同一环境增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要在手机或其他电脑继续本机 DSH 会话的个人，可使用远程客户端连接工作电脑；基线是已有 VPN 加 DSH 网页或回电脑操作。作者描述优先 P2P 并可中继、共享原工作区与工具；这减少切换和网络配置的一部分，实际连通与效率未测。远程设备拿到的是本机环境能力，不是独立低权限会话。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:30-55](https://github.com/liguobao/ds-harness-remote/blob/9f08f43be1f2af03d0b511f8143f13eb25926921/README.md#L30-L55)

作者描述同一环境与连接方式。

<details>
<summary>查看原文（26行）</summary>

```text
## Connect once. Ready whenever you are.

Continue using your DeepSeek Harness instance from a phone, computer, or browser.

Return to the same Harness session from whichever device is with you.

Harness keeps running on your work computer, with the same workspaces, tools, and project setup.

DS Harness Remote is simply another window into that environment.

The DeepSeek Harness desktop edition is supported. Install the latest release:

`ds-harness-remote@0.6.0`

## Features

- Access your local Harness instance remotely from the web, a PC, or a mobile device: DSH first, with Codex, Cursor, and Antigravity support too.
- Use the native DeepSeek Harness interface without a separate desktop conversation UI.
- Create workspaces, configure models, and switch conversation models with the same smooth workflow as local use.
- Support DeepSeek Harness Desktop, ready to use after installation.
- Run a terminal-only [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) profile as a Host.
- No public listening port or public IP is required on the Harness Host. Connect from anywhere with internet access over a bidirectional end-to-end encrypted channel.
- Prefer P2P connections, use TURN relay nodes worldwide, and fall back to Server Relay when needed.
- Access workspace files, read-only previews, remote terminals, and authorized local development-service previews through the native Harness sidebar.
- Remote Agent tools let native Harness Agents discover Hosts and workspaces, create and manage Harness sessions, read history, wait for execution, request interruption, and transfer authorized files; CodeX/ACP supports workspace discovery only ([details](packages/plugin/README.md#remote-agent-tools)).
- CodeX and ACP terminals use the Host's default shell in the session directory and restore the terminal screen on reconnect.
```

</details>

**依据 2 · 源码核查**：[package.json:1-5](https://github.com/liguobao/ds-harness-remote/blob/9f08f43be1f2af03d0b511f8143f13eb25926921/package.json#L1-L5)

包身份和远程定位。

```text
{
  "name": "ds-harness-remote",
  "version": "0.6.0",
  "description": "P2P-based, end-to-end encrypted remote access to DeepSeek Harness, CodeX, Claude Code, Pi, and other workspaces from web and mobile clients.",
  "keywords": [
```

#### 缺口

- 未运行宿主、设备、网络或远程终端
  **影响**：不能证明配对、加密、隔离和任务结果
  **进一步探讨**：固定各端版本，用隔离主机验证授权、终端和断连

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 设备身份如何约束终端分发？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

终端策略检查 Host 的远程终端开关，解析 session 和 terminal ID，以服务端维护的 deviceId 关联所有权并拒绝其他设备的冲突；RPC 路由限制在途请求数并将异常转换成响应。配对、身份和传输保护是连接边界，但静态代码不能证明用户设备本身安全或所有 RPC 权限正确。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/terminal-policy.ts:6-19](https://github.com/liguobao/ds-harness-remote/blob/9f08f43be1f2af03d0b511f8143f13eb25926921/packages/plugin/src/terminal-policy.ts#L6-L19)

终端操作集合及设备所有权。

<details>
<summary>查看原文（14行）</summary>

```text
export const TERMINAL_CALLS = new Set(['terminal/environment', 'terminal/shells', 'terminal/list',
  'terminal/create', 'terminal/write', 'terminal/resize', 'terminal/rename', 'terminal/close'])
export const TERMINAL_STREAMS = new Set(['terminal/follow', 'terminal/retain'])
const id = z.string().regex(/^[A-Za-z0-9_:-]{1,256}$/)

/** Host-lifetime device ownership survives transport reconnects; never supplied by the client. */
export class TerminalPolicy {
  private static readonly claims = new WeakMap<Map<string, string>, Map<string, object>>()
  private readonly attachments = new Map<string, { id: string; claim?: object }>()
  private readonly claims: Map<string, object>
  constructor(private readonly enabled: boolean | (() => boolean), private readonly deviceId: string,
    private readonly owners: Map<string, string>) {
    this.claims = TerminalPolicy.claims.get(owners) ?? new Map()
    TerminalPolicy.claims.set(owners, this.claims)
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/terminal-policy.ts:28-45](https://github.com/liguobao/ds-harness-remote/blob/9f08f43be1f2af03d0b511f8143f13eb25926921/packages/plugin/src/terminal-policy.ts#L28-L45)

启用检查和归属判断。

<details>
<summary>查看原文（18行）</summary>

```text
  check(endpoint: string, payload: unknown): { key?: string; created?: boolean; claim?: object } {
    if (!(typeof this.enabled === 'function' ? this.enabled() : this.enabled)) throw new RpcError('TERMINAL_DISABLED',
      'Remote terminal is disabled on this Host. Enable Remote terminal in the Host Remote settings; the switch saves and applies immediately. / 远程终端未开启，请在 Host 的 Remote 设置中开启「远程终端」，开关切换后立即保存并生效。')
    for (const [key, attachment] of this.attachments) if (this.owners.get(key) !== this.deviceId || this.claims.get(key) !== attachment.claim) this.attachments.delete(key)
    const args = z.object({ args: z.record(z.string(), z.unknown()) }).strict().parse(payload).args
    const rawSessionId = args.agentId ?? args.sessionId
    const sessionId = id.parse(rawSessionId)
    // CodeX sessions are deliberately opaque keys here. Their thread/cwd
    // authority is resolved by the CodeX Host domain, never by Harness lookup.
    const codexSession = parseCodexSessionId(sessionId)
    void codexSession
    if (endpoint === 'terminal/environment' || endpoint === 'terminal/shells' || endpoint === 'terminal/list') return {}
    const request = endpoint === 'terminal/create' ? z.object({ id }).passthrough().parse(args.request) : undefined
    const terminalId = id.parse(request?.id ?? args.id)
    const key = `${sessionId}/${terminalId}`
    if (endpoint === 'terminal/create') {
      if (this.owners.has(key) && this.owners.get(key) !== this.deviceId) this.deny()
      if (!this.owners.has(key) && this.owners.size >= 256) throw new RpcError('RATE_LIMITED', 'Too many retained remote terminals.')
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/rpc-router.ts:112-143](https://github.com/liguobao/ds-harness-remote/blob/9f08f43be1f2af03d0b511f8143f13eb25926921/packages/plugin/src/rpc-router.ts#L112-L143)

在途请求限制与错误处理。

<details>
<summary>查看原文（32行）</summary>

```text
    if (this.active >= this.maxPending) {
      return createRpcError(request.id, 'RATE_LIMITED', 'Too many Host requests are already pending.', undefined, true)
    }
    this.active += 1
    const startedAt = performance.now()
    try {
      const result = await this.invoke(request.payload.method, request.payload.params)
      const subMethod = typeof (request.payload.params as Record<string, unknown> | undefined)?.method === 'string'
        ? String((request.payload.params as Record<string, unknown>).method)
        : undefined
      this.logger?.info('host rpc ok', {
        method: request.payload.method,
        ...(subMethod ? { subMethod } : {}),
        durationMs: Math.round(performance.now() - startedAt),
      })
      return createRpcResponse(request.id, result)
    } catch (error: unknown) {
      const response = errorResponse(request.id, error)
      const failedEndpoint = !request.payload.method.startsWith('workspace.upload.')
        && typeof (request.payload.params as Record<string, unknown> | undefined)?.endpoint === 'string'
        ? String((request.payload.params as Record<string, unknown>).endpoint)
        : undefined
      this.logger?.warn('host rpc failed', {
        method: request.payload.method,
        ...(failedEndpoint ? { endpoint: failedEndpoint } : {}),
        durationMs: Math.round(performance.now() - startedAt),
        code: response.payload.code,
        retryable: response.payload.retryable,
      })
      return response
    } finally {
      this.active -= 1
```

</details>

#### 缺口

- 未运行宿主、设备、网络或远程终端
  **影响**：不能证明配对、加密、隔离和任务结果
  **进一步探讨**：固定各端版本，用隔离主机验证授权、终端和断连

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 加密通道能否约束已授权终端的副作用？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不能。端到端加密保护传输，但启用并授权的远程终端仍在 Host 环境运行命令；连接断开或撤销设备不能自动回滚已执行的文件或外部操作。作者特别指出 Linux 安装器的服务和远程工具以 root 运行，授权范围需与该实际身份一起判断；断线结果不明时应先在 Host 对账。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/terminal-policy.ts:28-45](https://github.com/liguobao/ds-harness-remote/blob/9f08f43be1f2af03d0b511f8143f13eb25926921/packages/plugin/src/terminal-policy.ts#L28-L45)

终端开关和设备归属。

<details>
<summary>查看原文（18行）</summary>

```text
  check(endpoint: string, payload: unknown): { key?: string; created?: boolean; claim?: object } {
    if (!(typeof this.enabled === 'function' ? this.enabled() : this.enabled)) throw new RpcError('TERMINAL_DISABLED',
      'Remote terminal is disabled on this Host. Enable Remote terminal in the Host Remote settings; the switch saves and applies immediately. / 远程终端未开启，请在 Host 的 Remote 设置中开启「远程终端」，开关切换后立即保存并生效。')
    for (const [key, attachment] of this.attachments) if (this.owners.get(key) !== this.deviceId || this.claims.get(key) !== attachment.claim) this.attachments.delete(key)
    const args = z.object({ args: z.record(z.string(), z.unknown()) }).strict().parse(payload).args
    const rawSessionId = args.agentId ?? args.sessionId
    const sessionId = id.parse(rawSessionId)
    // CodeX sessions are deliberately opaque keys here. Their thread/cwd
    // authority is resolved by the CodeX Host domain, never by Harness lookup.
    const codexSession = parseCodexSessionId(sessionId)
    void codexSession
    if (endpoint === 'terminal/environment' || endpoint === 'terminal/shells' || endpoint === 'terminal/list') return {}
    const request = endpoint === 'terminal/create' ? z.object({ id }).passthrough().parse(args.request) : undefined
    const terminalId = id.parse(request?.id ?? args.id)
    const key = `${sessionId}/${terminalId}`
    if (endpoint === 'terminal/create') {
      if (this.owners.has(key) && this.owners.get(key) !== this.deviceId) this.deny()
      if (!this.owners.has(key) && this.owners.size >= 256) throw new RpcError('RATE_LIMITED', 'Too many retained remote terminals.')
```

</details>

**依据 2 · 作者声明**：[README.md:46-55](https://github.com/liguobao/ds-harness-remote/blob/9f08f43be1f2af03d0b511f8143f13eb25926921/README.md#L46-L55)

作者描述加密与远程终端。

<details>
<summary>查看原文（10行）</summary>

```text
- Access your local Harness instance remotely from the web, a PC, or a mobile device: DSH first, with Codex, Cursor, and Antigravity support too.
- Use the native DeepSeek Harness interface without a separate desktop conversation UI.
- Create workspaces, configure models, and switch conversation models with the same smooth workflow as local use.
- Support DeepSeek Harness Desktop, ready to use after installation.
- Run a terminal-only [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) profile as a Host.
- No public listening port or public IP is required on the Harness Host. Connect from anywhere with internet access over a bidirectional end-to-end encrypted channel.
- Prefer P2P connections, use TURN relay nodes worldwide, and fall back to Server Relay when needed.
- Access workspace files, read-only previews, remote terminals, and authorized local development-service previews through the native Harness sidebar.
- Remote Agent tools let native Harness Agents discover Hosts and workspaces, create and manage Harness sessions, read history, wait for execution, request interruption, and transfer authorized files; CodeX/ACP supports workspace discovery only ([details](packages/plugin/README.md#remote-agent-tools)).
- CodeX and ACP terminals use the Host's default shell in the session directory and restore the terminal screen on reconnect.
```

</details>

**依据 3 · 作者声明**：[README.md:122-128](https://github.com/liguobao/ds-harness-remote/blob/9f08f43be1f2af03d0b511f8143f13eb25926921/README.md#L122-L128)

作者说明 Linux 服务以 root 运行。

```text
### Plugin installer

The sole installer is `scripts/install.sh`:

- **Linux:** requires root; reuses an existing DSH or bootstraps private Node.js/DSH, accepts a one-time Host registration token, and enables/starts a systemd system service. The Host and remote tools run as **root**; grant access only to trusted accounts.
- **macOS:** run as a normal user; reuses Desktop's official launcher or an existing CLI, without installing DSH or creating services.
- Windows users use official Plugin management or existing Harness commands; no Windows installer is provided.
```

#### 缺口

- 未运行宿主、设备、网络或远程终端
  **影响**：不能证明配对、加密、隔离和任务结果
  **进一步探讨**：固定各端版本，用隔离主机验证授权、终端和断连

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何受控试用和退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 Host、受信任设备和可用网络，P2P 失败可能使用中继；具体认证、授权和运行用户需检查。先用独立低权限工作区和无副作用任务核验设备、终端开关与断线恢复，未知结果先查 Host；若设备不再可信或运行身份不符合预期，关闭远程并回本地。服务器、中继、模型和人工核查成本未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:46-55](https://github.com/liguobao/ds-harness-remote/blob/9f08f43be1f2af03d0b511f8143f13eb25926921/README.md#L46-L55)

作者描述网络与远程能力。

<details>
<summary>查看原文（10行）</summary>

```text
- Access your local Harness instance remotely from the web, a PC, or a mobile device: DSH first, with Codex, Cursor, and Antigravity support too.
- Use the native DeepSeek Harness interface without a separate desktop conversation UI.
- Create workspaces, configure models, and switch conversation models with the same smooth workflow as local use.
- Support DeepSeek Harness Desktop, ready to use after installation.
- Run a terminal-only [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) profile as a Host.
- No public listening port or public IP is required on the Harness Host. Connect from anywhere with internet access over a bidirectional end-to-end encrypted channel.
- Prefer P2P connections, use TURN relay nodes worldwide, and fall back to Server Relay when needed.
- Access workspace files, read-only previews, remote terminals, and authorized local development-service previews through the native Harness sidebar.
- Remote Agent tools let native Harness Agents discover Hosts and workspaces, create and manage Harness sessions, read history, wait for execution, request interruption, and transfer authorized files; CodeX/ACP supports workspace discovery only ([details](packages/plugin/README.md#remote-agent-tools)).
- CodeX and ACP terminals use the Host's default shell in the session directory and restore the terminal screen on reconnect.
```

</details>

**依据 2 · 作者声明**：[README.md:122-128](https://github.com/liguobao/ds-harness-remote/blob/9f08f43be1f2af03d0b511f8143f13eb25926921/README.md#L122-L128)

安装方式及用户身份。

```text
### Plugin installer

The sole installer is `scripts/install.sh`:

- **Linux:** requires root; reuses an existing DSH or bootstraps private Node.js/DSH, accepts a one-time Host registration token, and enables/starts a systemd system service. The Host and remote tools run as **root**; grant access only to trusted accounts.
- **macOS:** run as a normal user; reuses Desktop's official launcher or an existing CLI, without installing DSH or creating services.
- Windows users use official Plugin management or existing Harness commands; no Windows installer is provided.
```

**依据 3 · 源码核查**：[packages/plugin/src/terminal-policy.ts:28-45](https://github.com/liguobao/ds-harness-remote/blob/9f08f43be1f2af03d0b511f8143f13eb25926921/packages/plugin/src/terminal-policy.ts#L28-L45)

终端开关。

<details>
<summary>查看原文（18行）</summary>

```text
  check(endpoint: string, payload: unknown): { key?: string; created?: boolean; claim?: object } {
    if (!(typeof this.enabled === 'function' ? this.enabled() : this.enabled)) throw new RpcError('TERMINAL_DISABLED',
      'Remote terminal is disabled on this Host. Enable Remote terminal in the Host Remote settings; the switch saves and applies immediately. / 远程终端未开启，请在 Host 的 Remote 设置中开启「远程终端」，开关切换后立即保存并生效。')
    for (const [key, attachment] of this.attachments) if (this.owners.get(key) !== this.deviceId || this.claims.get(key) !== attachment.claim) this.attachments.delete(key)
    const args = z.object({ args: z.record(z.string(), z.unknown()) }).strict().parse(payload).args
    const rawSessionId = args.agentId ?? args.sessionId
    const sessionId = id.parse(rawSessionId)
    // CodeX sessions are deliberately opaque keys here. Their thread/cwd
    // authority is resolved by the CodeX Host domain, never by Harness lookup.
    const codexSession = parseCodexSessionId(sessionId)
    void codexSession
    if (endpoint === 'terminal/environment' || endpoint === 'terminal/shells' || endpoint === 'terminal/list') return {}
    const request = endpoint === 'terminal/create' ? z.object({ id }).passthrough().parse(args.request) : undefined
    const terminalId = id.parse(request?.id ?? args.id)
    const key = `${sessionId}/${terminalId}`
    if (endpoint === 'terminal/create') {
      if (this.owners.has(key) && this.owners.get(key) !== this.deviceId) this.deny()
      if (!this.owners.has(key) && this.owners.size >= 256) throw new RpcError('RATE_LIMITED', 'Too many retained remote terminals.')
```

</details>

#### 缺口

- 未运行宿主、设备、网络或远程终端
  **影响**：不能证明配对、加密、隔离和任务结果
  **进一步探讨**：固定各端版本，用隔离主机验证授权、终端和断连

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样减少断连后的重复写操作？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：对远程写操作展示来源设备、请求关联和可核实的 Host 结果状态，可能减少断线后误重试。已有设备归属、RPC 上限和错误响应是反证；请求 ID 或网络响应本身不能保证外部副作用恰好一次。对照现有界面，模拟命令已执行但响应丢失、设备撤销及重连，测重复率、误报和对账时间；无改进则否定。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/terminal-policy.ts:28-45](https://github.com/liguobao/ds-harness-remote/blob/9f08f43be1f2af03d0b511f8143f13eb25926921/packages/plugin/src/terminal-policy.ts#L28-L45)

已有设备归属与开关。

<details>
<summary>查看原文（18行）</summary>

```text
  check(endpoint: string, payload: unknown): { key?: string; created?: boolean; claim?: object } {
    if (!(typeof this.enabled === 'function' ? this.enabled() : this.enabled)) throw new RpcError('TERMINAL_DISABLED',
      'Remote terminal is disabled on this Host. Enable Remote terminal in the Host Remote settings; the switch saves and applies immediately. / 远程终端未开启，请在 Host 的 Remote 设置中开启「远程终端」，开关切换后立即保存并生效。')
    for (const [key, attachment] of this.attachments) if (this.owners.get(key) !== this.deviceId || this.claims.get(key) !== attachment.claim) this.attachments.delete(key)
    const args = z.object({ args: z.record(z.string(), z.unknown()) }).strict().parse(payload).args
    const rawSessionId = args.agentId ?? args.sessionId
    const sessionId = id.parse(rawSessionId)
    // CodeX sessions are deliberately opaque keys here. Their thread/cwd
    // authority is resolved by the CodeX Host domain, never by Harness lookup.
    const codexSession = parseCodexSessionId(sessionId)
    void codexSession
    if (endpoint === 'terminal/environment' || endpoint === 'terminal/shells' || endpoint === 'terminal/list') return {}
    const request = endpoint === 'terminal/create' ? z.object({ id }).passthrough().parse(args.request) : undefined
    const terminalId = id.parse(request?.id ?? args.id)
    const key = `${sessionId}/${terminalId}`
    if (endpoint === 'terminal/create') {
      if (this.owners.has(key) && this.owners.get(key) !== this.deviceId) this.deny()
      if (!this.owners.has(key) && this.owners.size >= 256) throw new RpcError('RATE_LIMITED', 'Too many retained remote terminals.')
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/rpc-router.ts:112-143](https://github.com/liguobao/ds-harness-remote/blob/9f08f43be1f2af03d0b511f8143f13eb25926921/packages/plugin/src/rpc-router.ts#L112-L143)

已有 RPC 成功与错误响应。

<details>
<summary>查看原文（32行）</summary>

```text
    if (this.active >= this.maxPending) {
      return createRpcError(request.id, 'RATE_LIMITED', 'Too many Host requests are already pending.', undefined, true)
    }
    this.active += 1
    const startedAt = performance.now()
    try {
      const result = await this.invoke(request.payload.method, request.payload.params)
      const subMethod = typeof (request.payload.params as Record<string, unknown> | undefined)?.method === 'string'
        ? String((request.payload.params as Record<string, unknown>).method)
        : undefined
      this.logger?.info('host rpc ok', {
        method: request.payload.method,
        ...(subMethod ? { subMethod } : {}),
        durationMs: Math.round(performance.now() - startedAt),
      })
      return createRpcResponse(request.id, result)
    } catch (error: unknown) {
      const response = errorResponse(request.id, error)
      const failedEndpoint = !request.payload.method.startsWith('workspace.upload.')
        && typeof (request.payload.params as Record<string, unknown> | undefined)?.endpoint === 'string'
        ? String((request.payload.params as Record<string, unknown>).endpoint)
        : undefined
      this.logger?.warn('host rpc failed', {
        method: request.payload.method,
        ...(failedEndpoint ? { endpoint: failedEndpoint } : {}),
        durationMs: Math.round(performance.now() - startedAt),
        code: response.payload.code,
        retryable: response.payload.retryable,
      })
      return response
    } finally {
      this.active -= 1
```

</details>

#### 缺口

- 未运行宿主、设备、网络或远程终端
  **影响**：不能证明配对、加密、隔离和任务结果
  **进一步探讨**：固定各端版本，用隔离主机验证授权、终端和断连

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
