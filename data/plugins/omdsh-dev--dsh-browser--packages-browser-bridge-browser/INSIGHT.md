# dsh-bridge-browser

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f7bafd3](https://github.com/omdsh-dev/dsh-browser/tree/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser)

<!-- BEGIN META -->
[![GitHub ★ 987](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=987&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-browser)
<!-- END META -->

> **功能**：连接DSH与浏览器扩展，提供侧栏会话、页面操作、截图和开发者工具。

> **亮点**：[Q01](#research-q01)、[Q03](#research-q03)、[Q04](#research-q04)支持桥把现有登录页面与DSH会话连接起来，按能力暴露工具、图像附件和首消息前权限选择。相对复制网页有可解释交接增量；没有独立节时/业务成功数据。

> **主要限制**：[Q02](#research-q02)、[Q03](#research-q03)表明本地免token信任Chrome扩展来源类别，Host调用使用owner身份，不是唯一扩展/多用户隔离。超时或连接替换可能发生在网页动作之后，取消不是回滚；重试前必须核真实页面。

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
  - [Q01 · 谁需要浏览器桥，它如何从插件接线到已登录页面？](#detail-section-11)
  - [Q02 · 本地发现和连接认证究竟信任谁，连接替换后发生什么？](#detail-section-12)
  - [Q03 · 超时取消、截图与开发者工具如何交付，何处仍可能已有副作用？](#detail-section-13)
  - [Q04 · 延迟会话、权限选择、工作区和删除能否混为一个成功状态？](#detail-section-14)
  - [Q05 · 什么用户值得试用，首次、持续、恢复和退出由谁承担？](#detail-section-15)
  - [Q06 · 从连接和状态边界能推导什么可证伪方向？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：这是 DSH 的原生 Host 桥插件，负责让浏览器扩展在侧栏进行会话，并将模型的浏览器工具调用送到用户明确控制的标签页。适合已有登录状态、需要在会话中查看页面并完成可核查操作的 DSH 用户。合格结果是目标标签正确、实际网页结果可回读；出现工具回复或会话消息并不等于业务操作办结。

人工浏览加复制到聊天、普通网页读取或独立无头浏览器；比较复用登录和页面/会话交接，不把DSH上游loop、扩展DOM及成熟协议认作桥原创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 页面快照与操作 | 从会话查看/操作受控标签 | 扩展执行，网页实际状态验收 |
| 截图附件 | 图像交给模型 | Host附件服务，超限可重新JPEG截图 |
| 开发者工具 | 页面JS、样式、console和网络 | 动态能力/独立授权，敏感字段可显式请求 |
| Host会话控制 | 权限/模型/命令/Skill清单 | owner通道，非模型新工具 |
| 延迟会话/分组 | 首消息才持久、归组 | 临时ID进程内，分组失败可降级 |
| purge | 归档并清理会话 | 独占持久层，失败可能部分完成 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=24、DSH rc.5及声明peers | 启动必需 | Gateway/Peer/工具与Web | 入口缺API拒绝，不保证其他版本 |
| 同仓库浏览器扩展 | 操作必需 | 控制标签和审批/执行 | 未连接报bridge-closed |
| 单用户可信本地profile | 本文试用前提 | 限定owner通道信任 | 不扩大到多人或不可信公网 |
| token | 非Chrome本地免token场景必需 | 自有桥认证 | 无有效token拒绝，无自动到期 |
| Host附件服务 | 截图/图像才必需 | 持久图像与模型投影 | 无服务截图失败 |
| Host持久层独占写 | purge才必需 | 归档并清理会话 | 被持有则拒绝，不等关闭 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户固定Host/扩展和独立profile | 不执行未核远程脚本，不导入重要账号 |
| 连接 | 用户发现/选择实例与受控标签 | 核真实Host、标签与认证条件 |
| 会话 | 首prompt创建并应用权限/模型 | provisional不是持久成功 |
| 操作 | 先读页面再可逆测试 | 用真实网页回读判定，不靠工具绿 |
| 中断退出 | 停重试、查页面、断扩展/桥 | 不撤网页既有变化，purge另行处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Host/构建/浏览器金额未知 | profile、版本、发现和标签权限 | private workspace不等单npm即用 |
| 持续使用 | 模型快照/图像/磁盘未知 | 审批和双端升级 | 字符数非固定token账单 |
| 失败恢复 | 重读/重试资源未知 | 网页副作用、连接/权限/Session核对 | 取消非回滚，失败可能已执行 |
| 退出 | 保留会话/附件资源未知 | 断开卸扩展/桥、按需换token | purge实际删除，不当关闭 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 登录页面交接 | 工具转发到已有扩展 | 同任务成功率/时间改善 |
| 取消与权限 | 到期帧及首prompt屏障 | 已发生动作可恢复/无重复 |
| 图像 | Host附件投影 | 目标模型费用与图像理解质量 |
| 延迟会话 | 进程内ID到真实创建 | 中断/跨进程场景实际恢复 |

> **思考**：[Q02](#research-q02)、[Q03](#research-q03)表明本地免token信任Chrome扩展来源类别，Host调用使用owner身份，不是唯一扩展/多用户隔离。超时或连接替换可能发生在网页动作之后，取消不是回滚；重试前必须核真实页面。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q03](#research-q03)、[Q04](#research-q04)支持桥把现有登录页面与DSH会话连接起来，按能力暴露工具、图像附件和首消息前权限选择。相对复制网页有可解释交接增量；没有独立节时/业务成功数据。

请求ID/截止/取消跨传输、事件坏则断连、首消息权限屏障与独占持久层purge有可复用价值；owner Peer和来源类别认证、部分清理状态必须跟随迁移。非全Host/扩展审计。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)、[Q03](#research-q03)表明本地免token信任Chrome扩展来源类别，Host调用使用owner身份，不是唯一扩展/多用户隔离。超时或连接替换可能发生在网页动作之后，取消不是回滚；重试前必须核真实页面。

<a id="detail-section-6"></a>

### 1.5 使用建议

能维护双端版本的用户先在独立本地profile做无敏感页面阅读和可逆操作，核Host实例、目标标签与权限选择。用网页回读验结果；断线或超时后先人工对账，无法确认就停止并退回手动。关闭不等purge，保留所需会话/附件。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持桥、Host会话/工具和扩展部分执行边界；未执行目标，未全审Host/扩展。可在本地独立profile小范围试用，动作凭证仍为未验证假设。

- 已检查：作者 README、包清单、源码路径 extensions/dsh-browser/src/background/authorization.ts、extensions/dsh-browser/src/background/tools.ts、packages/browser/bridge-browser/README.md、packages/browser/bridge-browser/package.json、packages/browser/bridge-browser/src/browser-context.ts、packages/browser/bridge-browser/src/devtools-tools.ts、packages/browser/bridge-browser/src/index.ts、packages/browser/bridge-browser/src/remote-host-api.ts、packages/browser/bridge-browser/src/screenshot-tools.ts、packages/browser/bridge-browser/src/server.ts、packages/browser/bridge-browser/src/session-deferral.ts、packages/browser/bridge-browser/src/session-purge.ts、packages/browser/bridge-browser/src/session-workspace.ts、packages/browser/bridge-browser/src/token.ts、packages/browser/bridge-browser/src/tools.ts 及固定范围 inventory；组件：packages/browser/bridge-browser。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核组件README/package、index/tools/server/token、上下文注入、截图/devtools、remote-host-api关键dispatch、deferral/workspace/purge；补查同仓库扩展导航取消与授权函数。未审完整扩展/Host API权限或安装脚本全部修改。
- 下一步：仅固定源码；未执行插件、浏览器、模型、目标测试或安装。普通加载/冒烟属scope_boundary；独立业务效果与具体状态竞态仍是实际研究缺口。

**分析版本**

- **仓库**：[omdsh-dev/dsh-browser](https://github.com/omdsh-dev/dsh-browser)
- **版本号**：0.0.7（[固定提交 f7bafd3](https://github.com/omdsh-dev/dsh-browser/tree/f7bafd3191e96745cb94a1074d189e23a30b3d3b)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06)提出未验证的高副作用动作凭证与重连只读核对，区分已派发/未知后再重试；测试站点比较重复提交与恢复耗时，无净收益就收窄或放弃，不计当前已有贡献。

仅固定源码；未执行插件、浏览器、模型、目标测试或安装。普通加载/冒烟属scope_boundary；独立业务效果与具体状态竞态仍是实际研究缺口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 292 | — | — | 5227 |
| .ts | source | 18 | 4859 | 3635 | 909 | — |
| .js | source | 1 | 180 | 160 | 9 | — |
| .ts | test | 18 | 4766 | 4214 | 166 | — |

</details>

**活跃度**

[![Issue 未关闭 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=16&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-browser/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=9&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-browser/issues?q=is%3Aissue+created%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-browser/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断浏览器桥的真实接线、连接信任、会话持久与网页副作用边界是否支持受限使用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要浏览器桥，它如何从插件接线到已登录页面？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

这是 DSH 的原生 Host 桥插件，负责让浏览器扩展在侧栏进行会话，并将模型的浏览器工具调用送到用户明确控制的标签页。适合已有登录状态、需要在会话中查看页面并完成可核查操作的 DSH 用户。合格结果是目标标签正确、实际网页结果可回读；出现工具回复或会话消息并不等于业务操作办结。

入口声明 webServer、typertGateway、connection、tools 与 agents，加载时实际检查 wireStream 和 createPeer，注册自己的升级路由、会话事件、普通浏览器工具和截图；开发者工具根据当前扩展声明动态注册/卸载。执行使用同仓库扩展，不是桥本身实现 DOM 操作，DSH 的推理循环和附件服务也不是本组件新造。跟随页面的快照经 BrowserContextInjector 进入下一次用户消息使用的上下文，替换尚未领取的旧快照，不主动唤醒闲置 Agent。

相对人工复制网页和另开聊天，它可复用真实浏览器登录状态，并把页面与会话交接接在一起；相对独立无头浏览器，减少重新登录的条件性负担，却使用真实账号权限。文本快照用编号控件，截图走图像附件，两条通道不能混称纯文本系统。网页内容仍是不可信数据，保留登录也不证明不会误操作。偶发只查公开信息时，手动浏览或普通网页读取可能更省维护。

#### 证据与依据

**依据 1 · 作者声明**：[packages/browser/bridge-browser/README.md:5-8](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/README.md#L5-L8)

作者定位桥、登录浏览器、文本/图像通道。

```text
The **browser-operation bridge** for dsh mounts a token-authenticated WebSocket carrier (`/ext/bridge`) for the browser extension, projects its calls onto DSH Typert Remotes, follows Session and Remote Event streams, and registers tools for reading and operating the controlled tab, capturing screenshots, and using developer tools. The browser retains its login state, and the side panel provides the conversation UI.

Page snapshots contain structured text with numbered controls and masked form fields. Actions target element numbers or selectors. Screenshots and chat images use DSH's durable attachment service; deferred sessions expose image limits when the host mounts that service.

```

**依据 2 · 源码核查**：[packages/browser/bridge-browser/src/index.ts:175-195](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/index.ts#L175-L195)

入口检查真实 Host API 后挂载。

<details>
<summary>查看原文（21行）</summary>

```text
 * @param ctx - Cordis context.
 * @param config - plugin config (schema defaults applied).
 */
export async function apply(ctx: Context, config: Config): Promise<void> {
  const resolved = resolveConfig(config)

  const gateway = ctx.get('typertGateway') as unknown as GatewayCandidate | undefined
  const connection = ctx.get('connection') as unknown as HostConnectionLike | undefined
  if (gateway === undefined || !hasRemoteWireStream(gateway)) {
    throw new Error('bridge-browser: dsh 0.2.1-rc.5 is required (Gateway wireStream unavailable)')
  }
  if (connection === undefined || typeof connection.createPeer !== 'function') {
    throw new Error('bridge-browser: dsh 0.2.1-rc.5 is required (connection.createPeer unavailable)')
  }
  const tokenRes = await resolveToken(resolved.token)
  mountBridge(ctx, resolved, tokenRes, createRemoteHostApi(gateway, connection))
}

function mountBridge(
  ctx: Context,
  resolved: ResolvedConfig,
```

</details>

**依据 3 · 源码核查**：[packages/browser/bridge-browser/src/index.ts:313-354](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/index.ts#L313-L354)

普通/截图注册与扩展声明驱动开发者工具。

<details>
<summary>查看原文（42行）</summary>

```text
  // the real URL, which keeps discovery to a bounded probe list. Remote
  // deployments bind a concrete interface address and are skipped: their
  // clients cannot use a 127.0.0.1 answer anyway.
  mountDiscoveryBeacon(ctx, resolved, hostPort)

  ctx.effect(() => {
    const disposers = registerBrowserTools(ctx, server, {
      toolTimeoutMs: resolved.toolTimeoutMs,
      snapshotMaxChars: resolved.snapshotMaxChars,
      maxInteractiveItems: resolved.maxInteractiveItems,
    })
    const disposeScreenshot = registerScreenshotTool(ctx, server, {
      toolTimeoutMs: resolved.toolTimeoutMs,
    })
    return () => {
      disposeScreenshot()
      for (const dispose of disposers.values()) dispose()
    }
  }, 'bridge-browser: browser tools')

  // High-privilege developer-tools group: registered only while the connected
  // extension advertises the capability (Chrome builds), so a Firefox or older
  // extension never offers tools it cannot serve. The extension keeps its own
  // approval policy in front of every call.
  const devToolsCall = createBrowserToolCall(server, resolved.toolTimeoutMs)
  let devToolsDisposers: Map<string, () => void> | undefined
  const syncDevToolsTools = (): void => {
    const supported = server.devToolsSupported()
    if (supported === (devToolsDisposers !== undefined)) return
    if (!supported) {
      for (const dispose of devToolsDisposers?.values() ?? []) dispose()
      devToolsDisposers = undefined
      ctx.logger.info('browser bridge: extension without developer-tools support; devtools tools unregistered')
      return
    }
    devToolsDisposers = registerBrowserDevTools(ctx, devToolsCall, {
      toolTimeoutMs: resolved.toolTimeoutMs,
      devToolsMaxChars: resolved.devToolsMaxChars,
    })
    ctx.logger.info('browser bridge: developer-tools group registered for the connected extension')
  }
  ctx.effect(() => () => {
```

</details>

**依据 4 · 源码核查**：[packages/browser/bridge-browser/src/browser-context.ts:35-62](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/browser-context.ts#L35-L62)

快照消息与尚未领取上下文替换。

<details>
<summary>查看原文（28行）</summary>

```text
    'The user chose to follow the newly active browser tab. The browser page context was refreshed immediately after that choice.',
    'The following is an already completed browser_snapshot of the current page. Use its stable indices directly for the next request; do not take an immediate duplicate snapshot unless required context is missing.',
    snapshot,
  ].join('\n\n')
  return createUserMessage({
    content: [{ type: 'text', text }],
    source: {
      kind: BROWSER_CONTEXT_KIND,
      form: 'snapshot',
      sections: [{ name: 'browser-page', text }],
    },
  })
}

/** Supersede pending tab context through the durable Inbox command surface. */
function injectLatestSnapshot(agent: Agent, snapshot: string): void {
  for (const message of agent.inbox.nextStep) {
    if (message.source.kind === BROWSER_CONTEXT_KIND
      && message.source.form === 'snapshot') {
      agent.inbox.remove(message.id)
    }
  }
  agent.inject(createBrowserSnapshotMessage(snapshot))
}

/** Deliver followed-page snapshots to live or not-yet-materialized Agents. */
export class BrowserContextInjector {
  private readonly pending = new Map<string, string>()
```

</details>

**依据 5 · 源码核查**：[packages/browser/bridge-browser/src/tools.ts:43-53](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/tools.ts#L43-L53)

实际工具执行转发并携带session。

<details>
<summary>查看原文（11行）</summary>

```text
export function createBrowserToolCall(
  bridge: BridgeServer,
  toolTimeoutMs: number,
): (exec: Pick<ToolRunContext, 'agent' | 'signal'>, name: string, args: Record<string, unknown>) => Promise<TextResult> {
  return async (exec, name, args) => {
    const sessionId = exec.agent === undefined ? undefined : String(exec.agent.id)
    const result = sessionId === undefined
      ? await bridge.requestTool(name, args, exec.signal, toolTimeoutMs)
      : await bridge.requestTool(name, args, exec.signal, toolTimeoutMs, sessionId)
    return normalizeTextResult(result, name)
  }
```

</details>

#### 缺口

- 真实任务中复用登录和页面交接是否减少人审/返工尚无对照。
  **影响**：不能从工具接线推出节时或业务成功率。
  **进一步探讨**：以相同网页任务比较手动浏览加聊天与桥，记录正确结果、全部人审及失败恢复时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地发现和连接认证究竟信任谁，连接替换后发生什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

升级路由在 /api 信任栅栏之外，自行要求首帧 hello。非本地连接和 Firefox 等来源必须带 token；本地地址且 Origin 以 chrome-extension:// 开头则免 token，代码没有将此例外限定为某个扩展 ID。这挡住普通网页伪造扩展 Origin 的浏览器场景，但认证的是扩展来源类别，不应当成唯一扩展身份或多用户鉴权。token 默认随机生成、以原 UTF-8 字节定时比较并写 0600 文件；固定 token 可复用，轮换和有效期不能凭文件权限自动成立。

更重要的是桥接 Host API 创建 principal=owner、interactions=answer 的 Peer，不只是读取页面的低权限通道。非本地请求即使持 token 也被禁止设置/凭据等 PRIVILEGED_METHODS；本地扩展连接不受这层远端限制。认证成功因此意味着要信任浏览器扩展能够驱动相应 Host 会话、命令和权限操作，而不是信任每次模型动作。自动发现只公开无秘密的实例地址、pid 和启动时间，不能当作授权。

桥只有一个活跃扩展连接，新认证连接会替换旧连接，清定时器、中止事件并将进行中工具拒为 bridge-closed。事件流失败会主动关连接以触发重建，避免看似健康却失去事件。传输失败不说明网页动作没执行，重连后应先核页面和会话状态；本次没有证明任意来源能利用这些条件，也不把单连接设计描述成已复现越权。

#### 证据与依据

**依据 1 · 源码核查**：[packages/browser/bridge-browser/src/server.ts:305-332](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/server.ts#L305-L332)

hello与本地Chrome来源类别免token。

<details>
<summary>查看原文（28行）</summary>

```text
      if (helloTimer !== undefined) {
        // Pending state: only `hello` is legal.
        if (frame.t !== 'hello') {
          ws.close(1008, 'hello first')
          return
        }
        // Zero-config local mode: loopback sockets skip the token (the
        // extension auto-discovers the bridge and connects without setup).
        // WebSockets have no same-origin policy, so a malicious page could
        // open a cross-origin socket to 127.0.0.1 with a loopback remote —
        // the loopback shortcut therefore requires a chrome-extension://
        // Origin (only extension contexts can present one; pages cannot
        // forge the header). Firefox moz-extension:// origins contain a
        // per-install UUID rather than the manifest's stable Gecko ID, so
        // they are not an identity boundary and must present the bearer token.
        // Non-loopback remotes must also present the bearer token.
        const loopbackNoToken = isLoopbackAddress(remoteAddress)
          && typeof origin === 'string'
          && origin.startsWith('chrome-extension://')
        if (!loopbackNoToken && !verifyToken(this.deps.token, frame.token)) {
          ws.close(4002, 'bad token')
          return
        }
        clearTimeout(helloTimer)
        helloTimer = undefined
        this.promote(ws, remoteAddress, frame.caps)
        return
      }
```

</details>

**依据 2 · 源码核查**：[packages/browser/bridge-browser/src/token.ts:35-44](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/token.ts#L35-L44)

原字符串字节比较，不hex截断。

<details>
<summary>查看原文（10行）</summary>

```text
 */
export function verifyToken(expected: string, actual: string): boolean {
  // UTF-8 byte comparison, not hex decoding: hex would silently truncate
  // non-hex configured tokens (Buffer.from('fixed-token','hex') is empty)
  // and collapse 'deadbeef-team' to 'deadbeef', losing token entropy.
  const expectedBuf = Buffer.from(expected, 'utf8')
  const actualBuf = Buffer.from(actual, 'utf8')
  if (expectedBuf.length === 0 || expectedBuf.length !== actualBuf.length) return false
  return timingSafeEqual(expectedBuf, actualBuf)
}
```

</details>

**依据 3 · 源码核查**：[packages/browser/bridge-browser/src/token.ts:76-100](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/token.ts#L76-L100)

0600持久与配置/已有token优先。

<details>
<summary>查看原文（25行）</summary>

```text
  await chmod(temp, 0o600)
  await rename(temp, file)
}

/**
 * Resolve the bridge token: an explicitly configured token wins; otherwise the
 * persisted file is reused when present, and a fresh token is generated and
 * persisted otherwise.
 * @param configured - token from plugin config, or undefined.
 * @param file - token file path (injectable for tests).
 * @returns `{ token, file, generated }` where `generated` records whether a new token was minted.
 */
export async function resolveToken(
  configured: string | undefined,
  file: string = tokenFilePath(),
): Promise<{ token: string; file: string; generated: boolean }> {
  if (configured !== undefined && configured.length > 0) {
    return { token: configured, file, generated: false }
  }
  const persisted = await readTokenFile(file)
  if (persisted !== undefined && persisted.length > 0) return { token: persisted, file, generated: false }
  const token = generateToken()
  await writeTokenFile(token, file)
  return { token, file, generated: true }
}
```

</details>

**依据 4 · 源码核查**：[packages/browser/bridge-browser/src/remote-host-api.ts:138-160](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/remote-host-api.ts#L138-L160)

Host调用使用owner Peer。

<details>
<summary>查看原文（23行）</summary>

```text
  constructor(
    private readonly gateway: TypertGatewayLike,
    connection: HostConnectionLike,
  ) {
    // Interactions default to `answer`; the bridge answers user-question
    // waterfalls for sessions it created, so it names that explicitly.
    this.peer = connection.createPeer({ principal: { kind: 'owner' }, interactions: 'answer' })
    this.fetchHandler = connection.createSharedFetchHandler('/api')
  }

  /**
   * Dispatch one Remote call as this connection's Peer. dsh 0.2.1 requires the
   * Peer on every carrier and in-process invocation; one helper keeps the
   * identity from drifting between call sites.
   */
  private invoke(request: {
    readonly namespace: string
    readonly method: string
    readonly args: Readonly<Record<string, unknown>>
    readonly signal?: AbortSignal
  }): Promise<unknown> {
    return this.gateway.invoke({ ...request, peer: this.peer })
  }
```

</details>

**依据 5 · 源码核查**：[packages/browser/bridge-browser/src/server.ts:42-58](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/server.ts#L42-L58)

远端禁止的高权限方法集合。

<details>
<summary>查看原文（17行）</summary>

```text
 * Gateway methods the /api carrier pins to loopback (mirror of
 * client-connection's PRIVILEGED_METHODS; kept verbatim so the two fences
 * cannot drift). The bridge rejects these for non-loopback remotes even with
 * a valid token.
 */
const PRIVILEGED_METHODS = new Set([
  'host.pickDirectory',
  'host.openPath',
  'settings.describe',
  'settings.openDocument',
  'settings.update',
  'settings.replace',
  'settings.mutate',
  'credentials.describe',
  'credentials.set',
  'credentials.unset',
])
```

</details>

**依据 6 · 源码核查**：[packages/browser/bridge-browser/src/server.ts:430-439](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/server.ts#L430-L439)

非loopback方法拒绝条件。

<details>
<summary>查看原文（10行）</summary>

```text
    const conn = this.current
    /* v8 ignore next -- replacement race: a frame can land between a socket
    replacement and the next promotion; the re-check keeps the handler total */
    if (conn === null) return
    const forbidden = PRIVILEGED_METHODS.has(frame.method) && !isLoopbackAddress(conn.remoteAddress)
    if (forbidden) {
      sendFrame(conn.ws, { t: 'rpc.result', id: frame.id, ok: false, error: { code: 'forbidden', message: 'method is loopback-only' } })
      return
    }
    if (frame.method === BRIDGE_INJECT_BROWSER_SNAPSHOT_METHOD) {
```

</details>

**依据 7 · 源码核查**：[packages/browser/bridge-browser/src/server.ts:347-374](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/server.ts#L347-L374)

事件流失效主动关闭。

<details>
<summary>查看原文（28行）</summary>

```text
    const abort = new AbortController()
    const ping = setInterval(() => { sendFrame(ws, { t: 'ping' }) }, this.deps.pingIntervalMs ?? PING_INTERVAL_MS)
    const pump = (async () => {
      try {
        for await (const frame of this.deps.api.events(abort.signal)) {
          if (ws.readyState !== WebSocket.OPEN) break
          sendFrame(ws, {
            t: 'event',
            frame,
          })
        }
      } catch (error: unknown) {
        if (!abort.signal.aborted && ws.readyState === WebSocket.OPEN) {
          sendFrame(ws, { t: 'error', code: 'stream-failed', message: String(error) })
          // An authenticated socket without its Remote streams is unusable but
          // otherwise appears healthy to the extension. Closing the generation
          // activates its bounded reconnect loop and rebuilds every follower.
          ws.close(1011, 'event stream failed')
        }
      }
    })()
    this.current = { ws, remoteAddress, clientCaps, abort, pump, ping }
    sendFrame(ws, { t: 'hello.ok', caps: this.deps.caps })
    // Notify only after the new connection owns the slot, so a listener reading
    // `devToolsSupported()` sees the capability that just arrived.
    this.deps.onCapsChange?.(clientCaps)
    ws.once('close', () => {
      clearInterval(ping)
```

</details>

**依据 8 · 源码核查**：[packages/browser/bridge-browser/src/server.ts:523-540](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/server.ts#L523-L540)

单连接替换及进行中调用拒绝。

<details>
<summary>查看原文（18行）</summary>

```text

  /** Close the current connection (if any) and settle its in-flight calls. */
  private replaceConnection(): void {
    const conn = this.current
    if (conn === null) return
    this.current = null
    clearInterval(conn.ping)
    conn.abort.abort()
    if (conn.ws.readyState === WebSocket.OPEN || conn.ws.readyState === WebSocket.CONNECTING) {
      conn.ws.close(4000, 'replaced')
    }
    for (const [id, pending] of this.pendingTools) {
      clearTimeout(pending.timer)
      this.pendingTools.delete(id)
      pending.reject(new BridgeToolError('bridge-closed', 'the extension connection was replaced'))
    }
  }
}
```

</details>

**依据 9 · 源码核查**：[packages/browser/bridge-browser/src/index.ts:283-309](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/index.ts#L283-L309)

无token发现路由仅公布地址/实例。

<details>
<summary>查看原文（27行）</summary>

```text
  ctx.effect(() => () => server.close(), 'bridge-browser: bridge server')

  // Zero-config discovery endpoint: the extension fetches this to learn the
  // bridge WebSocket URL without any manual configuration. The URL carries no
  // secret (loopback connections skip the token); non-loopback deployments
  // keep requiring the token on the WS itself. `pid`/`startedAt` let the
  // extension tell several local instances apart without any extra endpoint.
  const hostPort = (): number | undefined => {
    const port = ctx.webServer.port
    return typeof port === 'number' ? port : undefined
  }
  const configRoute: WebRoute = {
    kind: 'exact',
    path: BRIDGE_CONFIG_PATH,
    handler: (_req, res) => {
      const port = hostPort()
      if (port === undefined) {
        res.writeHead(503)
        res.end()
        return
      }
      const body = JSON.stringify(bridgeConfigPayload(port, INSTANCE_INFO))
      res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' })
      res.end(body)
    },
  }
  ctx.effect(() => ctx.webServer.register(configRoute), 'bridge-browser: /ext/bridge-config route')
```

</details>

#### 缺口

- 目标部署的代理remoteAddress、浏览器扩展归属和多实例连接选择未获独立核查。
  **影响**：不能把本地便利认证扩大为公网或多人隔离保证。
  **进一步探讨**：在目标部署核地址传递和扩展归属，只在专用本地profile验证无效token、非扩展Origin及连接替换，不使用真实敏感会话。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 超时取消、截图与开发者工具如何交付，何处仍可能已有副作用？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

桥在派发前拒绝已取消信号，为每个请求生成 ID 与 expiresAt；调用方取消或超时会先发 tool.cancel 再停止等待。扩展补充源码也检查 signal 与到期时间，并在浏览器导航前检查目标是否仍允许。可是导航先调用 chrome.tabs.update 等实际 API，等待后才再次检查取消；若此时报告取消，导航可能已经发生。这不是事务撤销，写表单、发送或删除更不能靠重试恢复。

截图工具先经桥拿图，再调用 Host attachments.saveImages；没有附件服务会失败。PNG 因入库大小限制失败时会重新截图为 JPEG 一次，两次不保证同一瞬间画面，且不是原PNG无损压缩重试。成功后图像附件与文字摘要经 projectContent 投给模型；文本快照字符预算与附件图像预算都不能换算成固定 token 或收费。

开发者工具只有扩展声明支持才出现在模型清单，可执行页面 JavaScript、修改样式/属性并读网络信息；敏感header/body有逐调用显示开关，不能宣称永不外发凭据。补查扩展授权函数确认开发者工具不由普通站点信任或 unrestrictedAccess 自动放行，但仍允许独立设置/会话授权跳过逐次弹窗。桥不独立执行审批，不能从工具描述中的“需要批准”证明所有动作都有人点过。网页/网络/截图内容会进入 DSH 的上下文和持久附件，模型外发依宿主配置，未作全链路秘密保护审计。

#### 证据与依据

**依据 1 · 源码核查**：[packages/browser/bridge-browser/src/server.ts:197-246](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/server.ts#L197-L246)

派发前取消、ID/截止、超时取消帧。

<details>
<summary>查看原文（50行）</summary>

```text
    sessionId?: string,
  ): Promise<unknown> {
    const conn = this.current
    if (conn === null) {
      throw new BridgeToolError('bridge-closed', 'no browser extension is connected to the bridge')
    }
    // A caller that already aborted must not dispatch: the abort listener
    // below does not replay for pre-aborted signals, so the call would be
    // sent to the extension and executed despite the cancellation.
    if (signal.aborted) {
      throw new BridgeToolError('bridge-closed', 'tool call cancelled before dispatch')
    }
    const id = randomUUID()
    const expiresAt = Date.now() + timeoutMs
    return new Promise<unknown>((resolve, reject) => {
      let timer: NodeJS.Timeout
      const settle = (error: BridgeToolError): void => {
        clearTimeout(timer)
        this.pendingTools.delete(id)
        signal.removeEventListener('abort', onAbort)
        reject(error)
      }
      const cancel = (error: BridgeToolError): void => {
        // The extension may be paused on a user approval after the caller has
        // stopped waiting. Withdraw that approval before settling locally so
        // a late click cannot execute an expired action.
        sendFrame(conn.ws, { t: 'tool.cancel', id })
        settle(error)
      }
      const onAbort = (): void => {
        cancel(new BridgeToolError('bridge-closed', 'tool call cancelled before the extension answered'))
      }
      timer = setTimeout(() => {
        cancel(new BridgeToolError('timeout', `browser action "${name}" timed out after ${timeoutMs}ms`))
      }, timeoutMs)
      signal.addEventListener('abort', onAbort, { once: true })
      this.pendingTools.set(id, { resolve, reject, timer })
      conn.ws.send(JSON.stringify({
        t: 'tool.call',
        id,
        name,
        args,
        expiresAt,
        ...(sessionId === undefined ? {} : { sessionId }),
      } satisfies BridgeFrame), (error) => {
        /* v8 ignore next -- teardown race: when the write fails, the socket's
        close handler settles the same call with the same code; the callback
        path is a defensive second settle, covered via the close path */
        if (error != null) {
          settle(new BridgeToolError('bridge-closed', `bridge socket failed before delivery: ${error.message}`))
```

</details>

**依据 2 · 源码核查**：[extensions/dsh-browser/src/background/tools.ts:254-299](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/tools.ts#L254-L299)

导航前检查但API完成后仍可报取消，副作用不撤销。

<details>
<summary>查看原文（46行）</summary>

```text
): Promise<ToolAnswer | undefined> {
  if (call.name === 'browser_snapshot') return tabMetadataSnapshot(tabId, windowId, tabTitle, tabUrl, budget.maxChars)
  if (!TAB_NATIVE_TOOLS.has(call.name)) return undefined
  if (isCancelled(call, signal)) return cancelled()
  if (targetStillAllowed?.() === false) return targetChanged()

  let operation: Promise<unknown>
  let text: string
  try {
    switch (call.name) {
      case 'browser_navigate': {
        const requested = parseHttpUrl(call.args.url)
        if (requested === undefined) {
          return { ok: false, error: { code: 'action-failed', message: 'url must be a complete http or https URL.' } }
        }
        commitAction?.()
        operation = chrome.tabs.update(tabId, { url: requested.href })
        text = `Navigating to ${requested.href}. Call browser_snapshot again after the page loads.`
        break
      }
      case 'browser_back':
        commitAction?.()
        operation = chrome.tabs.goBack(tabId)
        text = 'Navigating through browser history. Call browser_snapshot again after the page loads.'
        break
      case 'browser_forward':
        commitAction?.()
        operation = chrome.tabs.goForward(tabId)
        text = 'Navigating through browser history. Call browser_snapshot again after the page loads.'
        break
      case 'browser_reload':
        commitAction?.()
        operation = chrome.tabs.reload(tabId)
        text = 'The page is reloading. Call browser_snapshot again after it loads.'
        break
      default:
        return undefined
    }
    resetTabSnapshot(tabId)
    await operation
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : String(error)
    return unavailable(`The browser-level operation failed: ${detail}`)
  }
  if (isCancelled(call, signal)) return cancelled()
  if (targetStillAllowed?.() === false) return targetChanged()
```

</details>

**依据 3 · 源码核查**：[extensions/dsh-browser/src/background/tools.ts:339-343](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/tools.ts#L339-L343)

接收侧到期与signal检查。

```text

function isCancelled(call: ToolCall, signal: AbortSignal | undefined): boolean {
  return signal?.aborted === true
    || (call.expiresAt !== undefined && Date.now() >= call.expiresAt)
}
```

**依据 4 · 源码核查**：[packages/browser/bridge-browser/src/screenshot-tools.ts:66-83](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/screenshot-tools.ts#L66-L83)

Host附件服务与媒体入库。

<details>
<summary>查看原文（18行）</summary>

```text
  const storeImage = async (image: ScreenshotImage): Promise<ImageAttachmentRef> => {
    const attachments = ctx.get('attachments') as
      | { saveImages(inputs: ReadonlyArray<{ data: Uint8Array; mediaType: string }>): Promise<readonly ImageAttachmentRef[]> }
      | undefined
    if (attachments === undefined) {
      throw new Error('No attachment store is mounted, so the screenshot cannot be returned as an image.')
    }
    const mediaType = image.mediaType
    if (!SUPPORTED_MEDIA_TYPES.has(mediaType)) {
      throw new Error(`The browser returned an unsupported screenshot media type: ${mediaType}`)
    }
    const data = Buffer.from(image.data, 'base64')
    const [ref] = await attachments.saveImages([{ data: new Uint8Array(data), mediaType }])
    return ref as ImageAttachmentRef
  }

  const tool = defineTool({
    name: 'browser_screenshot',
```

</details>

**依据 5 · 源码核查**：[packages/browser/bridge-browser/src/screenshot-tools.ts:120-160](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/screenshot-tools.ts#L120-L160)

PNG超限重新截图JPEG及投影图像。

<details>
<summary>查看原文（41行）</summary>

```text
        return [{ type: 'text' as const, text: result.text }]
      },
    },
    execute: async (args, exec) => {
      const a = args as { format?: 'png' | 'jpeg'; quality?: number }
      const wireArgs = (format: 'png' | 'jpeg', quality?: number): Record<string, unknown> => ({
        format,
        ...(format === 'jpeg' && quality !== undefined ? { quality } : {}),
      })

      const format = a.format ?? 'png'
      const result = await requestScreenshot(exec, wireArgs(format, a.quality))
      let ref: ImageAttachmentRef
      try {
        ref = await storeImage(result.image)
      } catch (error) {
        // A lossless png can exceed the per-image byte limit on large or
        // hidpi viewports; retry once as jpeg before giving up.
        if (format === 'png' && isAdmissionLimit(error)) {
          const fallback = await requestScreenshot(exec, wireArgs('jpeg', 80))
          ref = await storeImage(fallback.image)
        } else {
          throw error
        }
      }

      const summary = `Captured the controlled tab viewport (${ref.width}x${ref.height} ${ref.mediaType}, ${formatBytes(ref.bytes)}).`
      const metadata = {
        attachmentId: ref.attachmentId,
        mediaType: ref.mediaType,
        bytes: ref.bytes,
        width: ref.width,
        height: ref.height,
      }
      projections.set(exec as object, [
        { type: 'image', attachment: ref },
        { type: 'text', text: summary },
      ])
      return { text: summary, image: metadata }
    },
    projectContent: (exec) => projections.get(exec as object),
```

</details>

**依据 6 · 源码核查**：[packages/browser/bridge-browser/src/devtools-tools.ts:169-182](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/devtools-tools.ts#L169-L182)

页面JS工具真实调用。

<details>
<summary>查看原文（14行）</summary>

```text

  const consoleEval = (): ToolDefinition => defineTool({
    name: 'browser_console_eval',
    description: `Run JavaScript in the page's own context, as typing in the DevTools console would. Prefer a single expression; use an async IIFE and awaitPromise for multi-step work. ${APPROVAL_NOTE} ${UNTRUSTED_CONTENT_WARNING}`,
    parameters: {
      expression: { type: 'string', required: true, description: 'JavaScript source evaluated in the page context.' },
      frame: FRAME_PARAMETER,
      awaitPromise: { type: 'boolean', description: 'Wait for a returned promise to settle and return its value.' },
      includePreview: { type: 'boolean', description: 'Include a property preview when the value cannot be returned by value.' },
      maxChars: { type: 'number', description: 'Cap on the rendered result characters.' },
    },
    timeoutMs: options.toolTimeoutMs,
    output: TEXT_OUTPUT,
    execute: (args, exec) => call(exec, 'browser_console_eval', compact(args as Record<string, unknown>)),
```

</details>

**依据 7 · 源码核查**：[packages/browser/bridge-browser/src/devtools-tools.ts:229-251](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/devtools-tools.ts#L229-L251)

敏感header/body按调用开关。

<details>
<summary>查看原文（23行）</summary>

```text
    name: 'browser_devtools_get_request',
    description: `Inspect one captured request in full: request and response headers (sensitive names redacted by default), post data, timing breakdown, and optionally the response body. ${APPROVAL_NOTE} ${UNTRUSTED_CONTENT_WARNING}`,
    parameters: {
      index: { type: 'number', required: true, description: 'Request index from browser_devtools_list_requests.' },
      includeBody: { type: 'boolean', description: 'Also fetch the response body.' },
      maxChars: { type: 'number', description: 'Cap on the rendered result characters.' },
      includeSensitiveHeaders: { type: 'boolean', description: 'Show Authorization, Cookie, Set-Cookie, and similar values instead of [redacted].' },
      includeSensitiveBody: { type: 'boolean', description: 'Show bodies of authentication-looking requests instead of [redacted].' },
    },
    timeoutMs: options.toolTimeoutMs,
    output: TEXT_OUTPUT,
    execute: (args, exec) => call(exec, 'browser_devtools_get_request', compact(args as Record<string, unknown>)),
  })

  const requestBody = (): ToolDefinition => defineTool({
    name: 'browser_devtools_request_body',
    description: `Fetch the request payload or response body of one captured request, pretty-printing JSON when possible. ${APPROVAL_NOTE} ${UNTRUSTED_CONTENT_WARNING}`,
    parameters: {
      index: { type: 'number', required: true, description: 'Request index from browser_devtools_list_requests.' },
      kind: { type: 'string', enum: ['request', 'response'], description: 'Which body to read. Defaults to response.' },
      maxChars: { type: 'number', description: 'Cap on the returned characters; the extension caps bodies at 64 KB.' },
      includeSensitiveBody: { type: 'boolean', description: 'Show bodies of authentication-looking requests instead of [redacted].' },
    },
```

</details>

**依据 8 · 源码核查**：[extensions/dsh-browser/src/background/authorization.ts:324-339](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/authorization.ts#L324-L339)

devtools独立授权与普通信任分离。

<details>
<summary>查看原文（16行）</summary>

```text
 * Developer tools are their own consent surface: unrestricted access and the
 * persistent origin allowlist deliberately do not cover them, so enabling
 * either can never hand the model the debugger. Ordinary actions keep the
 * existing shortcut semantics.
 *
 * @param input - the prompt plus the policy state it is evaluated against.
 * @returns the authorization to apply, or `'prompt'` when the user must decide.
 */
export function resolveApprovalGate(input: ApprovalGateInput): ApprovalAuthorization | 'prompt' {
  if (input.prompt.devTools === true) {
    if (input.devToolsSessionGrant || input.devToolsAllowed) return 'approved'
    return 'prompt'
  }
  if (input.unrestrictedAccess || input.coveredByTrustedOrigins) return 'approved'
  return 'prompt'
}
```

</details>

#### 缺口

- 网页非幂等动作在超时、切标签或断线中的实际结果与对账行为未测。
  **影响**：不能承诺无重复提交或取消即无副作用，强写任务不宜直接扩大。
  **进一步探讨**：在无价值测试站点记录动作实际发生时点与回执，注入超时/替换/切页，比较先读后重试与盲重试。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 延迟会话、权限选择、工作区和删除能否混为一个成功状态？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

默认 session.create 只保留进程内 provisional ID，浏览历史为空，首条 prompt 才按原payload创建真实会话。materialize 创建成功后先重放 pending permission preset，再重放模型选择，两者成功才删除临时记录并让 prompt 继续；失败返回错误，不应静默按默认权限运行。重复 prompt 共用 materializing promise，桥还按session排列 prompt/cancel，避免取消先于真实会话创建。临时ID不是已保存会话，也不是重启后恢复保证。

权限切换最终通过 Host 原生 /permission 命令，命令与 Skill 清单属于侧栏控制词汇而不是模型新工具。工作区分组则是尽力行为，先 mkdir 并 workspace.create；失败只警告且本生命周期缓存该失败，后续会话仍可能成功但不分组，不能用“有会话”推“指定目录已生效”。已有明确 workspace 的请求保留其选择。

会话 purge 不是隐藏条目，它会取得持久层独占写句柄，先归档再删除目录里除锁文件外的内容；运行/被其他runtime持有则拒绝。删除失败可能已归档或已部分清理，release也可能另失败，错误明确区分而不回滚。需要保留聊天时应避免用 purge 代替关闭浏览器。普通未安排宿主加载/冒烟只作为研究范围，不将其单独列成开放机制问题。

#### 证据与依据

**依据 1 · 源码核查**：[packages/browser/bridge-browser/src/session-deferral.ts:81-120](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/session-deferral.ts#L81-L120)

创建→权限→模型→删除provisional屏障。

<details>
<summary>查看原文（40行）</summary>

```text
  async function materialize(sessionId: string, entry: ProvisionalEntry, signal: AbortSignal): Promise<HostRpcResult> {
    if (!entry.materialized) {
      const created = await api.call({
        rpcId: crypto.randomUUID(),
        method: 'session.create',
        payload: { ...entry.payload, sessionId },
        signal,
      })
      if (!created.ok) return created
      entry.materialized = true
    }
    // All prompts share this barrier, including those arriving during selection.
    // A changed choice must also succeed before any queued prompt is admitted:
    // the permission preset first, so the prompt never runs under the wrong
    // sandbox/approval knobs, then the model selection.
    while (entry.pendingPreset !== undefined) {
      const preset = entry.pendingPreset
      const applied = await api.call({
        rpcId: crypto.randomUUID(),
        method: 'session.setPermission',
        payload: { sessionId, preset },
        signal,
      })
      if (!applied.ok) return applied
      if (entry.pendingPreset === preset) delete entry.pendingPreset
    }
    while (entry.selection !== undefined) {
      const selection = entry.selection
      const selected = await api.call({
        rpcId: crypto.randomUUID(),
        method: 'session.selectModel',
        payload: { sessionId, ...selection },
        signal,
      })
      if (!selected.ok) return selected
      if (entry.selection === selection) delete entry.selection
    }
    provisional.delete(sessionId)
    return { ok: true, value: { sessionId } }
  }
```

</details>

**依据 2 · 源码核查**：[packages/browser/bridge-browser/src/session-deferral.ts:198-219](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/session-deferral.ts#L198-L219)

首prompt共享materialize并等待结果。

<details>
<summary>查看原文（22行）</summary>

```text
      }
      if (call.method !== 'session.prompt') return api.call(call)
      const sessionId = sessionIdOf(call.payload)
      if (sessionId === undefined) return api.call(call)
      const entry = provisional.get(sessionId)
      if (entry === undefined) return api.call(call)
      const existing = materializing.get(sessionId)
      const pending = existing ?? materialize(sessionId, entry, call.signal)
      if (existing === undefined) {
        materializing.set(sessionId, pending)
        void pending.then(
          () => { materializing.delete(sessionId) },
          () => { materializing.delete(sessionId) },
        )
      }
      const created = await pending
      if (!created.ok) return created
      return api.call(call)
    },
    events: signal => api.events(signal),
    respond: (rpcId, result, signal) => api.respond(rpcId, result, signal),
  }
```

</details>

**依据 3 · 源码核查**：[packages/browser/bridge-browser/src/server.ts:403-426](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/server.ts#L403-L426)

按session保留RPC到达顺序。

<details>
<summary>查看原文（24行）</summary>

```text
    }
  }

  /**
   * Preserve prompt/cancel arrival order per session. In particular, the
   * first prompt may still be materializing a provisional session; its cancel
   * must not reach the gateway until that admission has completed.
   */
  private routeRpc(frame: Extract<ClientFrame, { t: 'rpc' }>): void {
    const sessionId = orderedSessionId(frame)
    if (sessionId === undefined) {
      void this.handleRpc(frame)
      return
    }
    const previous = this.orderedSessionRpcs.get(sessionId) ?? Promise.resolve()
    const task = previous.then(
      () => this.handleRpc(frame),
      () => this.handleRpc(frame),
    )
    this.orderedSessionRpcs.set(sessionId, task)
    const clear = (): void => {
      if (this.orderedSessionRpcs.get(sessionId) === task) this.orderedSessionRpcs.delete(sessionId)
    }
    void task.then(clear, clear)
```

</details>

**依据 4 · 源码核查**：[packages/browser/bridge-browser/src/session-workspace.ts:30-64](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/session-workspace.ts#L30-L64)

分组失败缓存/警告，不阻断会话。

<details>
<summary>查看原文（35行）</summary>

```text
): BrowserHostApi {
  if (workspacePath === '') return api

  let workspacePromise: Promise<string | undefined> | undefined
  const ensureWorkspace = (): Promise<string | undefined> => {
    if (workspacePromise !== undefined) return workspacePromise
    workspacePromise = (async () => {
      try {
        await mkdir(workspacePath, { recursive: true })
        const response = await api.call({
          rpcId: randomUUID(),
          method: 'workspace.create',
          payload: { path: workspacePath },
          signal: new AbortController().signal,
        })
        if (!response.ok) {
          warn(
            `browser bridge: workspace.create failed for "${workspacePath}" `
            + `(${response.error.code}: ${response.error.message}); sessions will remain ungrouped`,
          )
          return undefined
        }
        const value = response.value
        if (!isRecord(value) || !isRecord(value.workspace) || typeof value.workspace.workspaceId !== 'string') {
          warn(`browser bridge: workspace.create returned an invalid response; sessions will remain ungrouped`)
          return undefined
        }
        return value.workspace.workspaceId
      } catch (error: unknown) {
        warn(
          `browser bridge: could not prepare session workspace "${workspacePath}": `
          + `${String(error)}; sessions will remain ungrouped`,
        )
        return undefined
      }
```

</details>

**依据 5 · 源码核查**：[packages/browser/bridge-browser/src/session-workspace.ts:68-76](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/session-workspace.ts#L68-L76)

明确workspace保留及注入cwd替换。

```text

  return {
    async call(call: HostRpcCall): Promise<HostRpcResult> {
      if (call.method !== 'session.create' || !isRecord(call.payload)) return api.call(call)
      if (call.payload.workspaceId !== undefined) return api.call(call)
      const workspaceId = await ensureWorkspace()
      if (workspaceId === undefined) return api.call(call)
      const payload: Record<string, unknown> = { ...call.payload, workspaceId }
      delete payload.cwd
```

**依据 6 · 源码核查**：[packages/browser/bridge-browser/src/remote-host-api.ts:348-367](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/remote-host-api.ts#L348-L367)

Host原生命令切换权限。

<details>
<summary>查看原文（20行）</summary>

```text
   * Switch the Session's permission preset through the Host's own
   * `/permission` command, so the preset selection and both knob events land
   * in the Session log exactly as a Web GUI selection would.
   */
  private async sessionSetPermission(call: HostRpcCall): Promise<HostRpcResult> {
    if (!isRecord(call.payload)) return badRequest('session.setPermission payload must be an object')
    const sessionId = sessionIdOf(call.payload)
    const preset = typeof call.payload.preset === 'string' ? call.payload.preset.trim() : ''
    if (sessionId === undefined) return badRequest('session.setPermission requires a non-empty sessionId')
    if (preset === '') return badRequest('session.setPermission requires a preset')
    try {
      const catalog = adaptPermissionCatalog(await this.invoke({
        namespace: 'permissionPresets', method: 'catalog', args: {}, signal: call.signal,
      }))
      if (!catalog.options.some((option) => option.value === preset)) {
        return badRequest(`unknown permission preset ${JSON.stringify(preset)}`)
      }
      const executed = await this.runCommand(sessionId, permissionSwitchLine(preset), call)
      if (!executed.ok) return executed
      return { ok: true, value: { preset, ...(executed.value as Record<string, unknown>) } }
```

</details>

**依据 7 · 源码核查**：[packages/browser/bridge-browser/src/session-purge.ts:109-153](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/session-purge.ts#L109-L153)

独占句柄、先归档、删除和部分失败状态。

<details>
<summary>查看原文（45行）</summary>

```text
  let ownership: { close(): Promise<void> }
  try {
    ownership = await deps.acquireOwnership(sessionId)
  } catch (error: unknown) {
    // Match the public error identity across independently loaded runtime
    // copies without depending on a private JSONL lock implementation.
    if (error instanceof Error && error.name === 'SessionAlreadyOwnedError') {
      throw new SessionPurgeError(
        'running',
        'session is still owned by a runtime; release the session or restart that runtime, then retry deletion',
      )
    }
    throw new SessionPurgeError('internal', `could not acquire exclusive session ownership: ${String(error)}`)
  }
  let failure: unknown
  let archived = false
  try {
    // The public archive API checks existence. Calling it after deletion
    // succeeds only accidentally when its header cache already knows this id.
    await deps.archiveSession(sessionId)
    archived = true
    for (const target of targets) {
      if (!(await lstat(target)).isDirectory()) throw new Error(`session directory changed: ${target}`)
      // Re-scan after write-open: opening an old log may materialize V3.
      for (const entry of await readdir(target)) {
        if (entry === SESSION_LOCK_FILENAME) continue
        await rm(path.join(target, entry), { recursive: true, force: true })
      }
    }
  } catch (error: unknown) {
    failure = new SessionPurgeError('internal', archived
      ? `session was archived, but durable cleanup failed: ${String(error)}`
      : `could not archive session; durable data was preserved: ${String(error)}`, { cause: error })
  } finally {
    try {
      await ownership.close()
    } catch (error: unknown) {
      failure = failure === undefined
        ? new SessionPurgeError('internal', `session was archived and cleared, but ownership release failed: ${String(error)}`, { cause: error })
        : new SessionPurgeError('internal', `${String(failure)}; ownership release also failed: ${String(error)}`, {
          cause: new AggregateError([failure, error], 'session purge and ownership release failed'),
        })
    }
  }
  if (failure !== undefined) throw failure
```

</details>

#### 缺口

- 延迟创建后权限失败、排队取消和归档/清理部分失败的跨进程状态没有实际对照。
  **影响**：不能把provisional/已创建/已执行/已删除统一称成功或可无损恢复。
  **进一步探讨**：用可丢弃会话测试权限切换拒绝、创建后断线和持久层占用，回读真实Session与文件，不直接重复purge。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么用户值得试用，首次、持续、恢复和退出由谁承担？

**研究主题**：采用判断、效果与总成本、依赖、兼容与流程

#### 完整回答

适合能维护 DSH 与浏览器扩展版本的单用户，在本地非敏感测试站点先做页面阅读和可逆操作；不适合直接把个人重要账号交给模型或暴露给不可信网络。包是 private workspace 的0.0.7桥，声明 Node>=24、DSH^0.2.1-rc.5和同版peers，实际入口也检查新API。安装器模式会下载/build工作区、注册web profile、复制扩展并要求用户加载，不能把npm名当独立公共即装包；远程脚本URL来自作者文档，本文不执行也不保证与固定提交字节相同。

首次承担Host/扩展构建、profile、标签授权与token/发现核对；持续承担模型上下文/图像、Host存储、浏览器资源和审批复核。默认快照32000字符、90秒工具预算是资源条件，不是准确token账单或端到端延迟；网页实时状态、语言和模型会影响成本。失败要查页面究竟已执行什么、连接是否被替换、会话是否真实创建，再决定重读或停止。现金、人工时间和合格率没有实测，不能说零配置因此零成本。

可控起点是独立浏览器profile与本地Host，核目标标签、只读快照和拒绝/取消，在测试站点核可逆点击后回读。出现标签不符、权限选择未生效、断线后副作用不明就停止，让人检查网页；退回手动操作与原生DSH会话。退出要断开/卸扩展与桥，按需要轮换token并保留会话/附件，关闭不撤网站已发生变化；purge是另一项破坏性动作。

#### 证据与依据

**依据 1 · 源码核查**：[packages/browser/bridge-browser/package.json:1-11](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/package.json#L1-L11)

private组件、版本、Node/DSH条件。

<details>
<summary>查看原文（11行）</summary>

```text
{
  "name": "@yuxianglin/dsh-bridge-browser",
  "description": "Browser bridge: authenticated WebSocket transport, page controls, screenshots, and developer tools through the user's browser extension",
  "version": "0.0.7",
  "author": "Yuxiang Lin",
  "license": "MIT",
  "private": true,
  "engines": {
    "node": ">=24",
    "dsh": "^0.2.1-rc.5"
  },
```

</details>

**依据 2 · 作者声明**：[packages/browser/bridge-browser/README.md:27-55](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/README.md#L27-L55)

作者安装路径、固定Host与加载扩展。

<details>
<summary>查看原文（29行）</summary>

````text

The remote installer downloads an installer-managed workspace, builds the plugin, and registers its official bundle in the local dsh `web` profile. It requires neither Git nor a local clone:

```sh
curl -fsSL https://raw.githubusercontent.com/Lum1104/dsh-browser/refs/heads/main/scripts/install.sh | bash
cd ~/.dsh/dsh-browser && pnpm start
```

On Windows, run the PowerShell installer instead:

```powershell
$s="$env:TEMP\dsh-install.ps1"; irm https://raw.githubusercontent.com/Lum1104/dsh-browser/refs/heads/main/scripts/install.ps1 -OutFile $s; powershell -NoProfile -ExecutionPolicy Bypass -File $s
cd $HOME\.dsh\dsh-browser; pnpm start
```

Developers can instead clone the repository and run `./scripts/install.sh` followed by `pnpm start` from that checkout. The local mode uses the current branch without downloading or overwriting source files. Both installation modes register the same profile bundle; build tools resolve only from the selected workspace and never from a parent checkout or parent `node_modules` directory.

The workspace targets the latest public dsh release, currently pinned to 0.2.1-rc.5. Older DSH releases are not supported:

```sh
npx @deepseek-ai/dsh@0.2.1-rc.5 web
```

The package manifest declares that support itself: `engines.dsh` (`^0.2.1-rc.5`) and `dsh.manifestVersion: 1` let dsh refuse an incompatible host before loading the plugin, and the Plugins page reads the localized title and description from `locale/en.json` / `locale/zh.json` plus the icon from `icon.svg` without activating the plugin.

The installer copies the unpacked extension to `~/.dsh/browser-extension` and opens `chrome://extensions`. Load that stable directory in Chrome and use the side panel. Loopback connections are discovered automatically and require no token entry; non-loopback deployments still require the configured bearer token.

## Host methods the panel drives

````

</details>

**依据 3 · 源码核查**：[packages/browser/bridge-browser/src/index.ts:60-79](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/index.ts#L60-L79)

工具/快照/条目预算默认。

<details>
<summary>查看原文（20行）</summary>

```text

/** Default per-tool-call budget (ms). */
const DEFAULT_TOOL_TIMEOUT_MS = 90_000

/** Default cap on interactive inventory items per snapshot. */
const DEFAULT_MAX_INTERACTIVE_ITEMS = 60

/** Default cap on one developer-tools result's rendered characters. */
const DEFAULT_DEVTOOLS_MAX_CHARS = 24_000

/** Default directory backing the browser extension's session group. */
const DEFAULT_SESSION_WORKSPACE_PATH = dshHomePath('browser-sessions')

/** Durable session storage root written by the JSONL persistence plugin. */
const SESSIONS_ROOT = dshHomePath('sessions')

/** Default: sessions materialize only on the first message (open-and-close leaves no trace). */
const DEFAULT_DEFER_SESSION_CREATE = true

/** Default: advertise a fixed-port discovery beacon so a random host port stays discoverable. */
```

</details>

**依据 4 · 源码核查**：[packages/browser/bridge-browser/src/server.ts:197-230](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/server.ts#L197-L230)

失败/取消负担关联真实派发。

<details>
<summary>查看原文（34行）</summary>

```text
    sessionId?: string,
  ): Promise<unknown> {
    const conn = this.current
    if (conn === null) {
      throw new BridgeToolError('bridge-closed', 'no browser extension is connected to the bridge')
    }
    // A caller that already aborted must not dispatch: the abort listener
    // below does not replay for pre-aborted signals, so the call would be
    // sent to the extension and executed despite the cancellation.
    if (signal.aborted) {
      throw new BridgeToolError('bridge-closed', 'tool call cancelled before dispatch')
    }
    const id = randomUUID()
    const expiresAt = Date.now() + timeoutMs
    return new Promise<unknown>((resolve, reject) => {
      let timer: NodeJS.Timeout
      const settle = (error: BridgeToolError): void => {
        clearTimeout(timer)
        this.pendingTools.delete(id)
        signal.removeEventListener('abort', onAbort)
        reject(error)
      }
      const cancel = (error: BridgeToolError): void => {
        // The extension may be paused on a user approval after the caller has
        // stopped waiting. Withdraw that approval before settling locally so
        // a late click cannot execute an expired action.
        sendFrame(conn.ws, { t: 'tool.cancel', id })
        settle(error)
      }
      const onAbort = (): void => {
        cancel(new BridgeToolError('bridge-closed', 'tool call cancelled before the extension answered'))
      }
      timer = setTimeout(() => {
        cancel(new BridgeToolError('timeout', `browser action "${name}" timed out after ${timeoutMs}ms`))
```

</details>

**依据 5 · 源码核查**：[packages/browser/bridge-browser/src/session-purge.ts:124-141](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/session-purge.ts#L124-L141)

退出关闭和删除持久内容不同。

<details>
<summary>查看原文（18行）</summary>

```text
  let archived = false
  try {
    // The public archive API checks existence. Calling it after deletion
    // succeeds only accidentally when its header cache already knows this id.
    await deps.archiveSession(sessionId)
    archived = true
    for (const target of targets) {
      if (!(await lstat(target)).isDirectory()) throw new Error(`session directory changed: ${target}`)
      // Re-scan after write-open: opening an old log may materialize V3.
      for (const entry of await readdir(target)) {
        if (entry === SESSION_LOCK_FILENAME) continue
        await rm(path.join(target, entry), { recursive: true, force: true })
      }
    }
  } catch (error: unknown) {
    failure = new SessionPurgeError('internal', archived
      ? `session was archived, but durable cleanup failed: ${String(error)}`
      : `could not archive session; durable data was preserved: ${String(error)}`, { cause: error })
```

</details>

#### 缺口

- 同任务的正确结果、人审/恢复时间及真实总费用未知。
  **影响**：不能推荐持续安装或把快照字符/等待预算当实测收益。
  **进一步探讨**：在相同站点/模型预算对照手动浏览加聊天，统计正确交付、全部重试及复核；若无净收益则退回原流程。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 从连接和状态边界能推导什么可证伪方向？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

当前已有可借鉴的是把请求ID、截止时间和取消帧一起跨桥传递，事件流坏就关闭重建，以及首消息前完成权限选择屏障。它们复用成熟协议/生命周期方法；不是模型更聪明，也不因工具数和实现复杂就形成创新。最关键的未闭合点是“调用失败”与“网页未执行”不同。

未验证方向是为高副作用操作保留接收、授权、实际派发和结果未知的动作凭证，并在重连时只读核对目标页面再允许重试。相比只有bridge-closed/timeout的回执，增量是把重试责任绑定到可核实状态；它不能保证任意网站有可靠幂等键或提供撤销，会增加协议、隐私与本地保留成本。若只是做只读浏览，这套状态负担可能不值得。

最小实验在有请求日志的测试站点按同任务/预算比较现协议与凭证核对，注入已派发后丢响应、批准后超时、切标签和连接替换。观察重复提交、误判未执行、人审恢复耗时及留存敏感信息；若副作用误判不降或恢复更慢则收窄为高风险操作，仍无收益就放弃。此方向本次未实现，不计入当前贡献或评分。

#### 证据与依据

**依据 1 · 源码核查**：[packages/browser/bridge-browser/src/server.ts:210-240](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/server.ts#L210-L240)

当前协议已有ID/到期/取消。

<details>
<summary>查看原文（31行）</summary>

```text
    const expiresAt = Date.now() + timeoutMs
    return new Promise<unknown>((resolve, reject) => {
      let timer: NodeJS.Timeout
      const settle = (error: BridgeToolError): void => {
        clearTimeout(timer)
        this.pendingTools.delete(id)
        signal.removeEventListener('abort', onAbort)
        reject(error)
      }
      const cancel = (error: BridgeToolError): void => {
        // The extension may be paused on a user approval after the caller has
        // stopped waiting. Withdraw that approval before settling locally so
        // a late click cannot execute an expired action.
        sendFrame(conn.ws, { t: 'tool.cancel', id })
        settle(error)
      }
      const onAbort = (): void => {
        cancel(new BridgeToolError('bridge-closed', 'tool call cancelled before the extension answered'))
      }
      timer = setTimeout(() => {
        cancel(new BridgeToolError('timeout', `browser action "${name}" timed out after ${timeoutMs}ms`))
      }, timeoutMs)
      signal.addEventListener('abort', onAbort, { once: true })
      this.pendingTools.set(id, { resolve, reject, timer })
      conn.ws.send(JSON.stringify({
        t: 'tool.call',
        id,
        name,
        args,
        expiresAt,
        ...(sessionId === undefined ? {} : { sessionId }),
```

</details>

**依据 2 · 源码核查**：[packages/browser/bridge-browser/src/server.ts:523-540](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/server.ts#L523-L540)

连接替换只报bridge-closed。

<details>
<summary>查看原文（18行）</summary>

```text

  /** Close the current connection (if any) and settle its in-flight calls. */
  private replaceConnection(): void {
    const conn = this.current
    if (conn === null) return
    this.current = null
    clearInterval(conn.ping)
    conn.abort.abort()
    if (conn.ws.readyState === WebSocket.OPEN || conn.ws.readyState === WebSocket.CONNECTING) {
      conn.ws.close(4000, 'replaced')
    }
    for (const [id, pending] of this.pendingTools) {
      clearTimeout(pending.timer)
      this.pendingTools.delete(id)
      pending.reject(new BridgeToolError('bridge-closed', 'the extension connection was replaced'))
    }
  }
}
```

</details>

**依据 3 · 源码核查**：[extensions/dsh-browser/src/background/tools.ts:254-299](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/tools.ts#L254-L299)

实际API与取消回执可能跨越。

<details>
<summary>查看原文（46行）</summary>

```text
): Promise<ToolAnswer | undefined> {
  if (call.name === 'browser_snapshot') return tabMetadataSnapshot(tabId, windowId, tabTitle, tabUrl, budget.maxChars)
  if (!TAB_NATIVE_TOOLS.has(call.name)) return undefined
  if (isCancelled(call, signal)) return cancelled()
  if (targetStillAllowed?.() === false) return targetChanged()

  let operation: Promise<unknown>
  let text: string
  try {
    switch (call.name) {
      case 'browser_navigate': {
        const requested = parseHttpUrl(call.args.url)
        if (requested === undefined) {
          return { ok: false, error: { code: 'action-failed', message: 'url must be a complete http or https URL.' } }
        }
        commitAction?.()
        operation = chrome.tabs.update(tabId, { url: requested.href })
        text = `Navigating to ${requested.href}. Call browser_snapshot again after the page loads.`
        break
      }
      case 'browser_back':
        commitAction?.()
        operation = chrome.tabs.goBack(tabId)
        text = 'Navigating through browser history. Call browser_snapshot again after the page loads.'
        break
      case 'browser_forward':
        commitAction?.()
        operation = chrome.tabs.goForward(tabId)
        text = 'Navigating through browser history. Call browser_snapshot again after the page loads.'
        break
      case 'browser_reload':
        commitAction?.()
        operation = chrome.tabs.reload(tabId)
        text = 'The page is reloading. Call browser_snapshot again after it loads.'
        break
      default:
        return undefined
    }
    resetTabSnapshot(tabId)
    await operation
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : String(error)
    return unavailable(`The browser-level operation failed: ${detail}`)
  }
  if (isCancelled(call, signal)) return cancelled()
  if (targetStillAllowed?.() === false) return targetChanged()
```

</details>

**依据 4 · 源码核查**：[packages/browser/bridge-browser/src/session-deferral.ts:92-118](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/session-deferral.ts#L92-L118)

权限与模型屏障是现有可复用设计。

<details>
<summary>查看原文（27行）</summary>

```text
    // All prompts share this barrier, including those arriving during selection.
    // A changed choice must also succeed before any queued prompt is admitted:
    // the permission preset first, so the prompt never runs under the wrong
    // sandbox/approval knobs, then the model selection.
    while (entry.pendingPreset !== undefined) {
      const preset = entry.pendingPreset
      const applied = await api.call({
        rpcId: crypto.randomUUID(),
        method: 'session.setPermission',
        payload: { sessionId, preset },
        signal,
      })
      if (!applied.ok) return applied
      if (entry.pendingPreset === preset) delete entry.pendingPreset
    }
    while (entry.selection !== undefined) {
      const selection = entry.selection
      const selected = await api.call({
        rpcId: crypto.randomUUID(),
        method: 'session.selectModel',
        payload: { sessionId, ...selection },
        signal,
      })
      if (!selected.ok) return selected
      if (entry.selection === selection) delete entry.selection
    }
    provisional.delete(sessionId)
```

</details>

#### 缺口

- 动作凭证是否减少非幂等重试且值得协议/留存负担未知。
  **影响**：不能称需求已确认或已经解决网页事务问题。
  **进一步探讨**：在可丢弃站点预设误提交与恢复时间阈值对照，失败则缩小/停止。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
