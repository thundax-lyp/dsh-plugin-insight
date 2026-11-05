# cosyncing

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e6b9fa2](https://github.com/cosyncing/cosyncing/tree/e6b9fa29b1ad65d28f7a8fe9480e231856251e82)

<!-- BEGIN META -->
[![GitHub ★ 65](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=65&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/cosyncing/cosyncing)
<!-- END META -->

> **功能**：通过自托管 broker 查看和控制 CLI 编码 Agent 会话，并跨自有设备同步

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 支持的增量是自托管多端broker统一会话入口，配对与撤销设备，并将DSH可写前台契约映射为共享transcript/审批/选择。generation、cookie和mutationRevision在await后重验，读/写失败语义分开，减少失权旧操作和副作用重试风险；未等同实际任务效率改善。

> **主要限制**：[Q03](#research-q03) DSH适配仍experimental且只有两个确切资格版本，不提供后台只读Observe；非图片文件是cosyncing限制，README归因Host不适用于0.2。命令单发不等于外部恰一次，模糊创建/取消仍需native对账；配对默认含drive/files，不能当低权限读卡器。

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
  - [Q01 · 谁需要统一多端控制，原生DSH浏览器和SSH还缺什么？](#detail-section-11)
  - [Q02 · 设备授权和DSH凭据如何接到前台提示、选择与断连？](#detail-section-12)
  - [Q03 · 哪些承诺必须收窄，超时、后台和附件怎样处理？](#detail-section-13)
  - [Q04 · 具体怎么用，首次持续、失败恢复和退出代价是什么？](#detail-section-14)
  - [Q05 · 哪些机制可借鉴，怎样验证新的交接改进？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：目标是已经在自己的工作机运行CLI编码Agent、希望离开终端后从桌面或手机查看同一会话并回答权限/问题的人。根项目是自托管broker、Flutter客户端与多Agent适配器组成的应用/桥接基础设施，不是装入DSH的插件bundle。package private工作区汇集broker/protocol/adapters，DSH经外部HTTP/WebSocket接入；根组件身份应为infrastructure。

相对SSH/tmux，它把历史、流式回复、工具与审批组织成可交互GUI；相对原生DSH web，它的主要增量是同一入口管理不同Agent、配对自有设备及共享前台会话控制，而不是新增DSH模型或文件执行能力。DSH原生API、会话状态、权限服务和模型运行是上游能力。不同Agent控制语义不相同，不能因README“十二种”就认为十二种都完成同样双向同步。

DSH明确是实验适配，仅前台live attach，多个前台客户端共享Host transcript和控制；没有后台只读Observe凭据。合格结果是换设备后接上相同native session、已接收提示不重发、审批答到正确等待项，离开最后前台时本地订阅退出但native任务继续。这不是多人租户隔离或只读审计平台。

SSH/tmux和各Agent原生Web UI提供远程进入与原生控制；cosyncing新增跨Agent统一GUI、设备配对及共享前台控制。DSH模型/权限/持久session来自上游，根不是DSH插件bundle。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 自托管broker与Flutter客户端 | 统一多Agent会话GUI | 不同适配器能力不同，根不是DSH插件 |
| 设备配对/撤销与角色 | 自有设备受控接入 | 默认含drive/files；不隔离上游租户 |
| DSH前台live共享 | 同native会话历史、提示、审批与选择 | 实验确切版本，无只读后台Observe |
| DSH图片输入 | 可信暂存字节传给Host | 非图片整提示拒绝，不代表Host无文件上传 |
| 托管Host接线 | 仅管理自己启动的进程 | 所有权需证明，外部Host不接管 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Bun>=1.4.3、匹配broker/client契约 | broker必需 | 服务与客户端协议 | 版本不匹配需拒绝/升级核对 |
| DSH web确切0.1.0-rc.6或0.2.0-rc.2 | 本题DSH路径 | 原生会话/权限/模型与认证 | 其他同family仍unverified |
| 上游cookie与owner-only存储 | 0.2必需 | 对Host可写API授权 | 损坏/不安全拒绝，不自行签发 |
| 已配对可信设备 | 跨设备访问必需 | observe/drive/files角色 | QR默认不是只读，需按强权限保管 |
| 用户自有proxy/VPN/tunnel | 跨设备连通另需 | 安全可达broker | 不由配对URL自动配置 |
| Flutter及原生Agent | 源码客户端/对应功能 | GUI与真实模型执行 | broker不会提供模型订阅或执行隔离 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 开发者固定broker/client/DSH与隔离项目 | 不与既有broker争同一Host |
| 授权 | 本机配对，隐藏输入DSH启动URL | 区分设备role与上游可写cookie |
| 连接 | 用户配置可信网络，前台live接同session | 第二端历史一致，审批关联正确 |
| 驱动 | 显式发送提示/权限/命令 | 未知结果查native，不自动重发 |
| 退出 | 撤销设备、断enrollment、停broker | 外部Host继续；各端内容分别管理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 主机/网络/域名及Agent订阅，金额未知 | PATH、版本、配对和网络配置 | 本轮未安装耗时 |
| 持续 | 主机常开、模型调用与历史/附件存储 | 升级契约、cookie/设备与代理维护 | 无任务效率或费用节省实测 |
| 失败 | 重连/排障和重复动作损失风险 | 区分配对/role/enrollment/Host，native对账 | 超时不能证明未执行 |
| 退出 | 已传内容无法收回 | 设备撤销、退出服务与各端数据处理 | broker撤销不等于上游全局撤销或取消 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 跨端会话 | broker共享前台控制能力与native身份关联 | 当前设备端到端GUI一致性 |
| 权限选择 | 宿主advertised preset且拒绝后不继续 | 全部宿主版本与并发用户效果 |
| 减少误重试 | generation guard与非幂等写单发 | 外部效果恰一次/取消完成 |
| 设备控制 | role表与持久撤销后关socket | 所有WS/文件表面的安全审计 |
| 输入附件 | image字节与可信inbox打开 | 一般文件尚不支持，非Host缺失 |

> **思考**：[Q03](#research-q03) DSH适配仍experimental且只有两个确切资格版本，不提供后台只读Observe；非图片文件是cosyncing限制，README归因Host不适用于0.2。命令单发不等于外部恰一次，模糊创建/取消仍需native对账；配对默认含drive/files，不能当低权限读卡器。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 支持的增量是自托管多端broker统一会话入口，配对与撤销设备，并将DSH可写前台契约映射为共享transcript/审批/选择。generation、cookie和mutationRevision在await后重验，读/写失败语义分开，减少失权旧操作和副作用重试风险；未等同实际任务效率改善。

公共契约、明确capability差异、DSH端点白名单、epoch/credential重验与持久撤销有借鉴价值。统计含多Agent/生成契约与测试，默认JS/TS不覆盖全部Dart；本轮无测试/宿主验收，作者证据分层保留，见 [Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) DSH适配仍experimental且只有两个确切资格版本，不提供后台只读Observe；非图片文件是cosyncing限制，README归因Host不适用于0.2。命令单发不等于外部恰一次，模糊创建/取消仍需native对账；配对默认含drive/files，不能当低权限读卡器。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅对确切DSH版本、可信设备与非敏感项目做前台live交接。配对默认含drive/files，先验权限/历史/撤销；不依赖后台通知或把只读观察当弱凭据。失败和未知结果退回native确认，见 [Q03](#research-q03)、[Q04](#research-q04)。

相对SSH/tmux，它把历史、流式回复、工具与审批组织成可交互GUI；相对原生DSH web，它的主要增量是同一入口管理不同Agent、配对自有设备及共享前台会话控制，而不是新增DSH模型或文件执行能力。DSH原生API、会话状态、权限服务和模型运行是上游能力。不同Agent控制语义不相同，不能因README“十二种”就认为十二种都完成同样双向同步。

DSH明确是实验适配，仅前台live attach，多个前台客户端共享Host transcript和控制；没有后台只读Observe凭据。合格结果是换设备后接上相同native session、已接收提示不重发、审批答到正确等待项，离开最后前台时本地订阅退出但native任务继续。这不是多人租户隔离或只读审计平台。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

根为infrastructure，DSH外置实验适配。固定源码核心授权与前台控制路径已核查，未运行测试或宿主；只建议确切版本、可信设备、非敏感项目限定试用，不能推广为全Agent/后台/多租户验收。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、docs/supported_agents/dsh.md、packages/typescript/adapters/dsh/src/index.ts、packages/typescript/adapters/dsh/src/compatibility.ts、packages/typescript/adapters/dsh/src/implementation.ts、packages/typescript/adapters/dsh/src/remote.ts、packages/typescript/adapters/dsh/src/remote-host.ts、packages/typescript/adapters/dsh/src/observe.ts、packages/typescript/adapters/dsh/src/drive.ts、packages/typescript/adapters/dsh/src/auth.ts、packages/typescript/broker/src/security/route-authorization.ts、packages/typescript/broker/src/security/dsh-credentials.ts、packages/typescript/broker/src/transport/transport-pairing.ts、packages/typescript/broker/src/runtime/runtime.ts、packages/typescript/broker/src/runtime/managed-host.ts、packages/typescript/adapters/dsh/test/test-dsh-drive.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根基础设施研究，以broker配对/HTTP角色/撤销和DSH0.2前台prompt、权限、generation、附件主链为代表；未全审十二适配器、Flutter UI、所有WS/文件路由与各平台托管signal。
- 下一步：隔离项目固定三端版本，验证双前台历史/审批、接受后丢响应、generation失权等待、撤销socket、图片/非图片拒绝和外部Host不被停止；分别记录adapter与可见UI结果。本轮未执行。

**分析版本**

- **仓库**：[cosyncing/cosyncing](https://github.com/cosyncing/cosyncing)
- **版本号**：0.8.5（[固定提交 e6b9fa2](https://github.com/cosyncing/cosyncing/tree/e6b9fa29b1ad65d28f7a8fe9480e231856251e82)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 以native session/requestId显示动作回执和unknown状态卡，跨设备只读对账后由用户显式提交新动作；利用已有身份与generation而不建第二执行账本。以接受后丢响应/切设备/重启反证，若现有UI等价或关联不稳定则修正。未实现未验证。

隔离项目固定三端版本，验证双前台历史/审批、接受后丢响应、generation失权等待、撤销socket、图片/非图片拒绝和外部Host不被停止；分别记录adapter与可见UI结果。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 92 | 12973 | — | — | 110931 |
| .md | test | 1 | 29 | — | — | 139 |
| .js | source | 5 | 21839 | 20091 | 1465 | — |
| .ts | source | 562 | 270669 | 202737 | 54579 | — |
| .ts | test | 328 | 176978 | 148584 | 19509 | — |
| .md | example | 1 | 14 | — | — | 83 |
| .ts | example | 8 | 1872 | 1661 | 156 | — |
| .mjs | source | 9 | 2894 | 2108 | 623 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/cosyncing/cosyncing/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/cosyncing/cosyncing/issues?q=is%3Aissue+created%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/cosyncing/cosyncing/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：研究根broker/客户端桥接基础设施，以设备授权和DSH实验前台链核查核心增量与边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要统一多端控制，原生DSH浏览器和SSH还缺什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是已经在自己的工作机运行CLI编码Agent、希望离开终端后从桌面或手机查看同一会话并回答权限/问题的人。根项目是自托管broker、Flutter客户端与多Agent适配器组成的应用/桥接基础设施，不是装入DSH的插件bundle。package private工作区汇集broker/protocol/adapters，DSH经外部HTTP/WebSocket接入；根组件身份应为infrastructure。

相对SSH/tmux，它把历史、流式回复、工具与审批组织成可交互GUI；相对原生DSH web，它的主要增量是同一入口管理不同Agent、配对自有设备及共享前台会话控制，而不是新增DSH模型或文件执行能力。DSH原生API、会话状态、权限服务和模型运行是上游能力。不同Agent控制语义不相同，不能因README“十二种”就认为十二种都完成同样双向同步。

DSH明确是实验适配，仅前台live attach，多个前台客户端共享Host transcript和控制；没有后台只读Observe凭据。合格结果是换设备后接上相同native session、已接收提示不重发、审批答到正确等待项，离开最后前台时本地订阅退出但native任务继续。这不是多人租户隔离或只读审计平台。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:52-59](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/README.md#L52-L59)

作者描述自托管broker和跨设备任务。

```text

Synchronize and control your agents — from CLI to GUI, from desktop to phone. Pick up right where you left
off, anywhere. cosyncing keeps your coding agents in sync across your own network.

The broker runs on the machine where your agents work. It watches their sessions and serves
a client that shows each one — grouped by project, with its transcript, diffs, commands, and any
prompt waiting on you. Read a session, answer a prompt, or take over. No account to create, no
hosted service between the client and the broker.
```

**依据 2 · 作者声明**：[README.md:77-92](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/README.md#L77-L92)

多适配器语义与实验DSH区别。

<details>
<summary>查看原文（16行）</summary>

```text

One protocol covers all twelve. Per-agent control differs: a Claude Code session in your own terminal
syncs with the app in both directions, including approvals, once setup installs its mod; without the mod it opens read-only until
you take over. See [supported-agent setup](docs/supported_agents/README.md) for versions and
installation, and [adapter support](docs/protocol/adapter-support.md) for the capability matrix.

Foreground clients can join the same broker-owned Codex, Pi, omp, or Reasonix Drive session without starting a
second native Resume. A Claude Code session without the mod keeps its Observe/Take-over flow on
another client, while OpenCode keeps its shared-live behavior. Background Observe connections stay read-only.

**Experimental:** Eight provisional adapters are available to source contributors.
[Kimi Code](docs/supported_agents/kimi.md) observes every session on a
`kimi web` server read-only, drives the ones cosyncing created — prompts, approvals, model selection —
and takes over the ones it did not, explicitly. [DeepSeek Harness](docs/supported_agents/dsh.md)
connects to a `dsh web` host and gives active foreground clients a shared transcript and control
surface, with model and reasoning-effort selection, permission presets, the host's own slash commands,
```

</details>

**依据 3 · 源码核查**：[package.json:1-22](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/package.json#L1-L22)

private工作区应用/适配器结构。

<details>
<summary>查看原文（22行）</summary>

```text
{
  "name": "cosyncing",
  "version": "0.8.5",
  "private": true,
  "packageManager": "bun@1.4.3",
  "license": "Apache-2.0",
  "type": "module",
  "description": "cosyncing \u2014 view and drive CLI coding-agent sessions through your own broker.",
  "workspaces": [
    "packages/typescript/protocol",
    "packages/typescript/adapter-api",
    "packages/typescript/crypto",
    "packages/typescript/transport",
    "packages/typescript/transport-wire",
    "packages/typescript/acp-client",
    "packages/typescript/opencode-wire",
    "packages/typescript/broker",
    "packages/typescript/pi-engine",
    "packages/typescript/adapters/*",
    "apps/poc-ui"
  ],
  "scripts": {
```

</details>

**依据 4 · 源码核查**：[packages/typescript/adapters/dsh/src/implementation.ts:467-508](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/adapters/dsh/src/implementation.ts#L467-L508)

DSH只有live、前台保留、共享控制的能力声明。

<details>
<summary>查看原文（42行）</summary>

```text
   * The host is EXTERNAL: `dsh web` runs with or without this broker, so its
   * lifecycle is governed by proven ownership rather than by assumption. See
   * {@link DshAdapter.describeManagedHost}.
   */
  readonly integration = {
    externalHost: { managed: true as const },
    sessionRetention: 'foreground' as const,
  };
  /**
   * `live` only. dsh has no client-driven resume (the host attaches sessions)
   * and no native artifact signal. Approvals are per tool call, which is what
   * the host asks for.
   *
   * `supportsModelSwitch` is true: `session.models` and `session.selectModel`
   * are wired, and a per-prompt override is applied as the durable session
   * selection the host actually models.
   *
   * `supportsNativeFileInput` is true with a real limit behind it. The host
   * takes inline image bytes on the prompt and has no route for anything else,
   * so the adapter delivers images and refuses other types outright. This flag
   * governs whether the client offers an attach control at all, and it is a
   * per-agent fact rather than a per-file one — leaving it false would remove
   * the only affordance that reaches the host's image intake, so an honest
   * immediate refusal for a non-image is the better trade.
   *
   * `observe` is NOT offered: dsh serves one undifferentiated client contract, so
   * an "observe" attach would hold the same full Drive authority as `live` and
   * the word would be a lie. A genuinely read-only connection needs an upstream
   * read-only credential first.
   */
  readonly capabilities: AgentCapabilities = {
    integrationKind: 'http-websocket',
    attachModes: ['live'],
    supportsObserve: false,
    supportsResume: false,
    supportsLiveAttach: true,
    supportsCrossClientDriveSharing: true,
    supportsNativeArtifact: false,
    supportsNativeFileInput: true,
    supportsModelSwitch: true,
    permissionGranularity: 'per-tool',
  };
```

</details>

**依据 5 · 源码核查**：[packages/typescript/broker/src/runtime/runtime.ts:1249-1266](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/broker/src/runtime/runtime.ts#L1249-L1266)

broker实际注册DshAdapter。

<details>
<summary>查看原文（18行）</summary>

```text
// INSTALLED SERVICE carries `COSYNCING_DSH_MANAGED_HOST=1` in its durable
// environment, so a packaged cosyncing starts, supervises, and stops the host
// its agent needs; a FOREGROUND broker has no such environment unless the
// operator sets it, so a source checkout observes and touches nothing by
// default. Neither posture can reach a host it did not start: authorization
// only permits acting on a process this broker can prove is its own. dsh is
// server-first: one host
// process owns the append-only session log and every client (its own browser UI
// included) is a peer of it, so there is no ownership arbitration, no resume to
// offer, and no observe mode — the host serves one undifferentiated client
// contract, and calling a full-authority connection "observe" would be a lie.
// Registered UNCONDITIONALLY, for the reason given above Kimi. The old
// `COSYNCING_ENABLE_DSH` gate carried a second reason as well — with no host
// running, every action on the row fails — but that is a diagnosis to SHOW,
// not a registration question. An operator who has not started `dsh web` is
// better served by an agent that says so than by one that stays invisible
// unless they already knew to set a variable.
registry.register(new DshAdapter(dshAdapterOptions()));
```

</details>

#### 缺口

- 没有本轮手机/浏览器任务对比，也未完整审阅十二适配器；多端改善属于机制可解释的条件判断。
  **影响**：实现与作者材料不能替代当前设备、宿主和真实任务验收。
  **进一步探讨**：固定broker/client/DSH版本与网络配置，在隔离账号和项目完成本题边界的端到端验证。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 设备授权和DSH凭据如何接到前台提示、选择与断连？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

broker设备配对与DSH enrollment是两层不同信任。配对offer默认5分钟、一次接受，QR绑定broker身份公钥；accept检查过期/已用/身份碰撞，生成数据密钥与token hash，先持久候选peer再发表内存与offer已用状态。默认peer roles为observe/drive/files，并非仅观察。HTTP路由表按方法区分观察、驱动、文件与owner-only，broker二进制更新另需独立update grant；runtime实际调用路由授权。设备撤销先处理wake登记、持久revokedAt和authGeneration，再失效WS tickets、关peer socket和清暂存/邮箱，不能只删除客户端图标。

DSH 0.2由启动URL交换宿主签名cookie，cosyncing保存的是按host/profile scope分开的cookie而非启动token，owner-only原子文件校验拒绝损坏/不安全状态。它不持有签名权，不自行续长cookie；托管child的启动URL只留内存。原生Host授权仍是可写全权，配对设备的broker角色不把上游凭据变只读。

适配器按只读探测区分0.1点式RPC和0.2 Typert Remote，确切资格版本分别0.1.0-rc.6和0.2.0-rc.2。0.2 unary只允许冻结endpoint集合，流式follow/control走mux而非错误降级POST。prompt建立独立requestId，区别carrier rpcId，mode默认queue；用户选择的模型/权限是持久session状态，应先应用、再提示。observe层在await目录读取前捕获mutationRevision，回来再guard；未提供preset或权限命令、切换返回error就拒绝，不悄悄用旧权限继续执行。

remote-host.call在等待auth前捕获carrier/mux/clientId和cookie，等待后核对授权是否变化。只读host-scoped读允许跨连接；epoch-bound投影晚到丢弃；non-idempotent-write发出前要求当前ready，发出后不把成功答复因连接变化改写失败。撤销/新握手会重基线，阻止旧catalog读唤醒已经失权的操作。DSH前台最后离开时订阅结束，native任务继续，跨设备接回依靠历史和新的权威握手，而不是把旧局部输出接着当完整结果。

#### 证据与依据

**依据 1 · 源码核查**：[packages/typescript/broker/src/transport/transport-pairing.ts:149-152](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/broker/src/transport/transport-pairing.ts#L149-L152)

默认peer角色与配对常量。

```text
const PAIRING_ACCEPT_MAX_FAILURES = 10;
const PAIRING_ACCEPT_FAILURE_WINDOW_MS = 60 * 1000;
const PAIRING_ACCEPT_FAILURE_MAX_BUCKETS = 1000;
const DEFAULT_PEER_ROLES: readonly PeerRole[] = ['observe', 'drive', 'files'];
```

**依据 2 · 源码核查**：[packages/typescript/broker/src/transport/transport-pairing.ts:193-253](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/broker/src/transport/transport-pairing.ts#L193-L253)

五分钟offer、QR身份与URL。

<details>
<summary>查看原文（61行）</summary>

```text
    pairingId: string;
    qr: string;
    expiresAt: string;
    brokerPeerId: string;
    broker?: QrBrokerDescriptor;
  } {
    // An offer that could never be accepted is refused before a device scans it.
    this.assertStoreWritable();
    for (const [id, offer] of this.offers) {
      if (offer.expiresAt <= this.now()) this.offers.delete(id);
    }
    const keys = loadOrCreateLocalKeyStore(this.keyDir, 'broker', {
      ensureDirectory: ensureOwnerOnlyDirectory,
      read: readLocalKeyStoreForPermissionConvergence,
      secureExisting: enforceOwnerOnlyFile,
      write: atomicWriteOwnerOnly,
    });
    const pairingId = this.uniquePairingId();
    const brokerPeerId = this.uniqueBrokerPeerId();
    const brokerPeerToken = randomBytes(24).toString('base64url');
    const expiresAt = this.now() + (this.opts.ttlMs ?? 5 * 60 * 1000);
    // The broker descriptor stays OUT of the QR and in the response beside it. A QR is scanned off a
    // terminal, so every byte is symbol area: the descriptor costs 154 payload characters, which is the
    // difference between a 73-column symbol and an 85-column one — wider than the 80-column terminal it is
    // printed into, and a wrapped QR is not a QR. Nothing reads it from here: the Dart parser drops the
    // field, and the client learns the same version/contract from `/api/health`, from the pairing-accept
    // response, and from the WebSocket hello's compatibility handshake, all of which it must complete
    // anyway. `parseQrPairingPayload` still accepts the field so payloads stored by older brokers parse.
    let brokerUrl: string | undefined;
    try {
      brokerUrl = normalizePairingBrokerUrl(input.brokerUrl);
    } catch (error) {
      throw new PairingHttpError(
        400,
        'PAIRING_INVALID_INPUT',
        error instanceof PairingBrokerUrlError ? error.message : 'brokerUrl is invalid',
      );
    }
    const qr = createQrPairingPayload({
      version: 3,
      brokerId: brokerPeerId,
      pairingId,
      // V3 commits the broker identity key. The accept response must prove
      // possession before a client stores the returned endpoint or secret.
      publicKey: keys.identity.publicKey,
      transport: { kind: 'broker-url', ...(brokerUrl ? { url: brokerUrl } : {}) },
    });
    this.offers.set(pairingId, {
      pairingId,
      ...(input.clientLabel ? { label: input.clientLabel } : {}),
      brokerPeerId,
      brokerPeerToken,
      qr,
      createdAt: this.now(),
      expiresAt,
    });
    return {
      pairingId,
      qr,
      brokerPeerId,
      expiresAt: new Date(expiresAt).toISOString(),
```

</details>

**依据 3 · 源码核查**：[packages/typescript/broker/src/transport/transport-pairing.ts:276-344](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/broker/src/transport/transport-pairing.ts#L276-L344)

accept拒绝重用/过期并先持久再发布。

<details>
<summary>查看原文（69行）</summary>

```text
    wrappedDataKey: WrappedDataKey;
    brokerProof: PairingAcceptanceProof;
  } {
    assertPairingId(pairingId);
    this.assertPairingAcceptAllowed(pairingId);
    const offer = this.offers.get(pairingId);
    if (!offer) {
      this.recordPairingAcceptFailure(pairingId);
      throw new PairingHttpError(404, 'PAIRING_NOT_FOUND', 'pairing offer not found');
    }
    if (offer.acceptedPeerId) {
      this.recordPairingAcceptFailure(pairingId);
      throw new PairingHttpError(
        409,
        'PAIRING_ALREADY_ACCEPTED',
        'this pairing QR was already used — generate a new one and review connected devices',
      );
    }
    if (offer.expiresAt <= this.now()) {
      this.offers.delete(pairingId);
      this.recordPairingAcceptFailure(pairingId);
      throw new PairingHttpError(410, 'PAIRING_EXPIRED', 'pairing offer expired');
    }
    let input: PairingAcceptanceInput;
    try {
      input = validatePairingAcceptanceInput(rawInput);
    } catch (error) {
      this.recordPairingAcceptFailure(pairingId);
      if (error instanceof PairingHttpError) throw error;
      throw new PairingHttpError(400, 'PAIRING_INVALID_INPUT', 'pairing acceptance is invalid');
    }
    const { peerId, peerToken, identityPublicKey, exchangePublicKey } = input;
    if (!this.clientPeerIdAvailable(peerId)) {
      this.recordPairingAcceptFailure(pairingId);
      throw new PairingHttpError(409, 'PAIRING_ALREADY_ACCEPTED', 'peer identity collides with an existing endpoint');
    }
    const keys = loadOrCreateLocalKeyStore(this.keyDir, 'broker', {
      ensureDirectory: ensureOwnerOnlyDirectory,
      read: readLocalKeyStoreForPermissionConvergence,
      secureExisting: enforceOwnerOnlyFile,
      write: atomicWriteOwnerOnly,
    });
    const dataKey = generateDataKey();
    const wrappedDataKey = wrapDataKeyForPeer(dataKey, exchangePublicKey);
    const previousPeer = this.peers.get(peerId);
    const peer: AcceptedTransportPeer = {
      peerId,
      ...(offer.label ? { label: offer.label } : {}),
      identityPublicKey,
      peerTokenHash: tokenHash(peerToken),
      brokerPeerId: offer.brokerPeerId,
      brokerPeerTokenHash: tokenHash(offer.brokerPeerToken),
      brokerIdentityPublicKey: keys.identity.publicKey,
      dataKey: serializeDataKey(dataKey),
      wrappedDataKey,
      acceptedAt: new Date(this.now()).toISOString(),
      authGeneration: previousPeer ? previousPeer.authGeneration + 1 : 1,
      roles: [...DEFAULT_PEER_ROLES],
    };
    // Persist a candidate snapshot before publishing either in-memory mutation. A failed write or
    // rename leaves the one-use offer pending and the peer registry unchanged.
    const candidatePeers = new Map(this.peers);
    candidatePeers.set(peerId, peer);
    this.save(candidatePeers);
    this.peers.set(peerId, peer);
    offer.acceptedPeerId = peerId;
    this.pairingAcceptFailures.delete(pairingId);
    const broker = {
      peerId: peer.brokerPeerId,
```

</details>

**依据 4 · 源码核查**：[packages/typescript/broker/src/security/route-authorization.ts:46-69](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/broker/src/security/route-authorization.ts#L46-L69)

显式HTTP策略和未列路由拒绝。

<details>
<summary>查看原文（24行）</summary>

```text
const DRIVE: PeerRoutePolicy = { kind: 'peer', allOf: ['drive'] };
const FILES: PeerRoutePolicy = { kind: 'peer', allOf: ['files'] };
const OBSERVE_FILES: PeerRoutePolicy = { kind: 'peer', allOf: ['observe', 'files'] };
const UPDATE: PeerRoutePolicy = { kind: 'update' };
const PI_INTEGRATION: PeerRoutePolicy = { kind: 'integration', integration: 'pi' };
const OMP_INTEGRATION: PeerRoutePolicy = { kind: 'integration', integration: 'omp' };

/**
 * Exhaustive client HTTP policy. A route may have multiple entries when its
 * read and mutation methods intentionally have different authority.
 * Unlisted methods and paths are denied to every non-owner principal.
 */
export const BROKER_ROUTE_POLICIES: readonly RoutePolicyEntry<BrokerRoute>[] = [
  { route: '/api/connection/identity-proof', methods: ['POST'], policy: PUBLIC },
  { route: '/api/connection/check', methods: ['GET'], policy: OBSERVE },
  { route: '/api/connection/check/ws', methods: ['GET'], policy: OBSERVE },
  { route: '/api/connection/configuration', methods: ['GET','POST'], policy: OWNER_ONLY },
  { route: '/api/storage', methods: ['GET'], policy: OWNER_ONLY },
  { route: '/api/storage/scans', methods: ['POST'], policy: OWNER_ONLY },
  { route: '/api/storage/scans/{id}', methods: ['GET'], policy: OWNER_ONLY },
  { route: '/api/storage/items', methods: ['GET'], policy: OWNER_ONLY },
  { route: '/api/storage/cleanup-plans', methods: ['POST'], policy: OWNER_ONLY },
  { route: '/api/storage/cleanup-jobs', methods: ['POST'], policy: OWNER_ONLY },
  { route: '/api/storage/cleanup-jobs/{id}', methods: ['GET'], policy: OWNER_ONLY },
```

</details>

**依据 5 · 源码核查**：[packages/typescript/broker/src/runtime/runtime.ts:6211-6216](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/broker/src/runtime/runtime.ts#L6211-L6216)

runtime调用实际路由授权。

```text

    if (principal) {
      const denied = requestAuthorizationDenied(principal, path, req.method);
      if (denied) return denied;
    }

```

**依据 6 · 源码核查**：[packages/typescript/broker/src/runtime/runtime.ts:6655-6686](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/broker/src/runtime/runtime.ts#L6655-L6686)

撤销持久化、关socket及清暂存/邮箱。

<details>
<summary>查看原文（32行）</summary>

```text
    if (revokeTransportPeer && req.method === 'DELETE') {
      const peerId = decodeURIComponent(revokeTransportPeer[1]!);
      // A peer store this broker must not rewrite refuses before anything, wake registrations included.
      try {
        transportPairings.assertStoreWritable();
      } catch (err) {
        if (err instanceof PairingHttpError) return json({ error: err.message, code: err.code }, err.status);
        throw err;
      }
      // Remove durable peer-owned wake registrations before committing the
      // credential revocation. If this write fails, the peer remains active
      // and the owner receives an error that can be retried; a committed
      // revocation can therefore never leave a durable wake destination behind.
      wakePush.revokePeer(peerId);
      const revocation = transportPairings.revokeWithState(peerId);
      if (revocation) {
        wsAuthTickets.invalidatePeer(revocation.peerId);
        closePeerSockets(revocation.peerId);
        uploadStaging.revokeCredentialIdentity(revocation.credentialIdentity);
        const revokedEndpointIds = new Set([revocation.peerId, revocation.brokerPeerId]);
        for (const endpointId of revokedEndpointIds) {
          transportMailboxes.delete(endpointId);
          transportControlReplayCaches.delete(endpointId);
        }
        for (const [mailboxId, mailbox] of transportMailboxes) {
          const retained = mailbox.filter((envelope) =>
            envelope.queuedBy !== `peer:${revocation.peerId}`
            && !revokedEndpointIds.has(envelope.from ?? '')
            && !revokedEndpointIds.has(envelope.to ?? ''));
          if (retained.length) transportMailboxes.set(mailboxId, retained);
          else transportMailboxes.delete(mailboxId);
        }
```

</details>

**依据 7 · 源码核查**：[packages/typescript/broker/src/security/dsh-credentials.ts:1-27](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/broker/src/security/dsh-credentials.ts#L1-L27)

DSH cookie存储与token/签名权限区别。

<details>
<summary>查看原文（27行）</summary>

```text
/**
 * DeepSeek Harness session cookies, held by the broker.
 *
 * `dsh web` hands out one cookie per authenticated browser, valid by default for
 * thirty days, and it is the ONLY thing that authenticates an API or WebSocket
 * request to a 0.2 host. cosyncing earns one either by exchanging the launch URL
 * its own managed host printed, or by exchanging a URL an operator pasted for a
 * host they started themselves. Either way the cookie has to outlive the process
 * that earned it, because the host outlives the broker: without persistence every
 * broker restart would need a fresh token, and an external host has no way to
 * print one again without its owner going and looking.
 *
 * WHAT THIS IS NOT.
 *
 * It is not a place that mints credentials. The cookie is an HMAC under the
 * HOST's signing secret, so possession of this file proves nothing an attacker
 * could not already use — which is exactly why it is owner-only, atomic, and
 * refused rather than repaired when it looks wrong. Nothing here can produce a
 * cookie, and nothing here can extend one.
 *
 * It does not hold the launch token. That token is the host's root credential for
 * one process's lifetime and is kept in the adapter's memory alone, so a broker
 * crash cannot leave a mint-on-demand URL on disk.
 *
 * WHY SCOPES RATHER THAN ONE FILE: an operator with a laptop host and a review
 * host has two enrollments, and a store that held "the dsh cookie" would quietly
 * log one out by enrolling the other.
```

</details>

**依据 8 · 源码核查**：[packages/typescript/broker/src/security/dsh-credentials.ts:114-145](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/broker/src/security/dsh-credentials.ts#L114-L145)

损坏或不支持存储拒绝而非忽略。

<details>
<summary>查看原文（32行）</summary>

```text
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new DshCredentialStateError('dsh-sessions-malformed');
  }
  const row = parsed as Record<string, unknown>;
  if (row.schemaVersion !== DSH_SESSIONS_SCHEMA_VERSION) {
    throw new DshCredentialStateError('dsh-sessions-schema-unsupported');
  }
  const sessions = row.sessions;
  if (!sessions || typeof sessions !== 'object' || Array.isArray(sessions)) {
    throw new DshCredentialStateError('dsh-sessions-malformed');
  }
  const entries = Object.entries(sessions as Record<string, unknown>);
  if (entries.length > DSH_MAX_ENROLLMENTS) throw new DshCredentialStateError('dsh-sessions-too-large');
  const accepted: Record<string, DshStoredSession> = {};
  for (const [scope, stored] of entries) {
    // A malformed ENTRY is refused, not dropped: silently discarding an
    // enrollment would log an operator out of a host they did not log out of,
    // and the repair for "this file is corrupt" (`cosyncing repair`) is a
    // different action from "your enrollment vanished for no stated reason".
    if (!validStoredSession(stored)) throw new DshCredentialStateError('dsh-sessions-malformed');
    accepted[scope] = stored;
  }
  return { schemaVersion: DSH_SESSIONS_SCHEMA_VERSION, sessions: accepted };
}

/** Read the file, refusing anything unsafe. A missing file is an empty store, not an error. */
export function readDshSessionFile(target = dshSessionsPath()): DshSessionFile {
  const inspection = inspectOwnerOnlyFile(target);
  if (inspection.status === 'missing') return { schemaVersion: DSH_SESSIONS_SCHEMA_VERSION, sessions: {} };
  if (inspection.status === 'unsafe') throw new DshCredentialStateError('dsh-sessions-unsafe');
  if (inspection.status === 'unreadable') throw new DshCredentialStateError('dsh-sessions-unreadable');
```

</details>

**依据 9 · 源码核查**：[packages/typescript/adapters/dsh/src/remote.ts:44-69](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/adapters/dsh/src/remote.ts#L44-L69)

0.2 unary endpoint白名单。

<details>
<summary>查看原文（26行）</summary>

```text
 * Endpoints this adapter may call.
 *
 * Every entry is one cosyncing feature, and each was read out of the host's own
 * generated descriptor array rather than inferred from a route name. Adding a
 * line here means adding the feature it serves, its fixture sample, and its
 * test; that is the point of the list.
 */
export const DSH_REMOTE_ENDPOINTS = Object.freeze([
  '$events/result',
  'commands/execute',
  'commands/list',
  'permissionPresets/catalog',
  'session/attachment',
  'session/cancel',
  'session/create',
  'session/list',
  'session/modelCatalog',
  'session/page',
  'session/projections',
  'session/prompt',
  'session/rename',
  'session/selectModel',
  'session/updateQueue',
  'userQuestions/answer',
  'workspace/initializeDefault',
] as const);
```

</details>

**依据 10 · 源码核查**：[packages/typescript/adapters/dsh/src/remote-host.ts:449-477](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/adapters/dsh/src/remote-host.ts#L449-L477)

独立prompt requestId与non-idempotent-write策略。

<details>
<summary>查看原文（29行）</summary>

```text
  async prompt(sessionId: string, input: Parameters<DshSessionChannel['prompt']>[1], options: DshPromptOptions = {}): Promise<void> {
    const images = [
      ...(input.images ?? []),
      ...dshStagedImages(input.files ?? [], options.imageLimits, options.sessionCwd),
    ];
    const content: unknown[] = [
      { type: 'text', text: input.text ?? '' },
      ...dshImageParts(images, options.imageLimits),
    ];
    // The prompt's own identity, minted HERE rather than reused from the carrier:
    // `session/prompt` requires a client `requestId`, and the envelope's rpcId
    // identifies THIS request, not the turn it started. They are different ids
    // with different lifetimes and must never be collapsed.
    const requestId = this.options.newRequestId();
    options.onRpcId?.(requestId);
    // `non-idempotent-write`, for the reason the 0.1 driver gives for the same
    // flag on a create: a prompt whose receipt was lost in a reconnect may
    // already have started a turn, and a caller told "retryable" starts a second
    // one. The write guard in `call()` is what keeps it from being sent into an
    // epoch that ended during authentication.
    const outcome = await this.link.call<unknown>('session/prompt', DshRemoteArgs.prompt({
      requestId,
      sessionId,
      mode: options.mode ?? 'queue',
      content,
      ...(options.clientTimeZone ? { clientTimeZone: options.clientTimeZone } : {}),
    }), { generationLoss: 'non-idempotent-write' });
    if (!outcome.ok) throw new DshDriveError('prompt', outcome.failure);
  }
```

</details>

**依据 11 · 源码核查**：[packages/typescript/adapters/dsh/src/remote-host.ts:766-839](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/adapters/dsh/src/remote-host.ts#L766-L839)

auth等待前后generation和cookie核对。

<details>
<summary>查看原文（74行）</summary>

```text
    options?: { signal?: AbortSignal; generationLoss?: DshGenerationLossPolicy },
  ): Promise<DshOutcome<T>> {
    const policy = options?.generationLoss ?? 'epoch-bound';
    const carrier = this.generation;
    const mux = this.mux;
    const clientId = this.events?.currentGeneration?.clientId;
    // The credential in hand when this call started, if it had one. Getting to
    // an authenticated state is `ensure()`'s JOB, so a call that entered with
    // nothing and left holding the enrollment's cookie succeeded rather than
    // lost its epoch; what the fence has to catch is holding one credential,
    // waiting, and finding the enrollment now holds a different one (or none),
    // because those bytes would go out under an authorization the caller never
    // saw. A renewal in flight trips this too, which costs one refused call
    // per renewal -- and renewals are bounded by the expiry window, so the
    // refusal cannot loop.
    const cookieAtEntry = this.auth.cookieHeader();
    // Authenticated BEFORE the request, not merely headed by whatever header the
    // session happens to be holding. The credential on disk is the whole point of
    // a broker restart against a surviving host, and a request that raced past the
    // first load would answer a healthy, enrolled host with its own 401 — which
    // this method then correctly reads as a refused credential, and the operator
    // watches a working host be called broken.
    const auth = await this.auth.ensure();
    if (auth.state !== 'authenticated') {
      return transportFailure('unauthenticated', {
        retryable: auth.state !== 'rejected' && auth.state !== 'blocked',
        detail: auth.detail,
      });
    }
    if (cookieAtEntry !== null && cookieAtEntry !== this.auth.cookieHeader()) {
      // The enrollment itself moved while this call was authenticating. Headers
      // are read per request, so the bytes WOULD go out under the new credential
      // while the caller's picture of the host was taken under the old one.
      return transportFailure('generation-lost', {
        retryable: policy !== 'non-idempotent-write',
        detail: 'the DeepSeek Harness enrollment changed while the call was authenticating, so it was not issued',
      });
    }
    if (policy === 'non-idempotent-write') {
      if (!this.isReady || this.generation !== carrier || this.mux !== mux) {
        return transportFailure('generation-lost', {
          retryable: true,
          detail: 'the DeepSeek Harness host stopped being ready; the write was not sent',
        });
      }
    } else if (policy === 'epoch-bound'
      && (this.mux !== mux || this.generation !== carrier || clientId !== this.events?.currentGeneration?.clientId)) {
      return transportFailure('generation-lost', {
        retryable: true,
        detail: 'the DeepSeek Harness generation ended while the call was authenticating',
      });
    }
    const outcome = await this.remote.call<T>(endpoint, args, {
      ...(options?.signal ? { signal: options.signal } : {}),
      ...(policy === 'epoch-bound' ? {} : { generationLoss: policy }),
    });
    if (policy === 'epoch-bound'
      && outcome.ok
      && (this.mux !== mux || this.generation !== carrier || clientId !== this.events?.currentGeneration?.clientId)) {
      // The answer is real, but it describes a host this caller is no longer
      // talking to. The transport is asked to abort in flight and normally
      // obliges; a response that was already on its way back when the carrier
      // died still arrives, and handing it over is worse than refusing it: the
      // caller has already been told to re-baseline, so a projection read that
      // lands late would be folded into a picture it does not belong to.
      //
      // Writes are exempt on purpose. A successful write response is the host
      // saying the write HAPPENED, and reporting a failure there is what
      // produces the second prompt.
      return transportFailure('generation-lost', {
        retryable: true,
        detail: 'the DeepSeek Harness generation ended while the call was in flight, so its answer was discarded',
      });
    }
```

</details>

**依据 12 · 源码核查**：[packages/typescript/adapters/dsh/src/observe.ts:859-869](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/adapters/dsh/src/observe.ts#L859-L869)

等待中的操作revision guard。

<details>
<summary>查看原文（11行）</summary>

```text
  /** Catalog reads may survive authority loss; their waiting mutation may not. */
  private mutationGuard(action: string): () => void {
    const revision = this.mutationRevision;
    return () => {
      this.assertMutable(action);
      if (revision !== this.mutationRevision) {
        throw new Error(`cannot ${action}: the DeepSeek Harness event authority changed; submit a new operation`);
      }
    };
  }

```

</details>

**依据 13 · 源码核查**：[packages/typescript/adapters/dsh/src/observe.ts:969-1003](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/adapters/dsh/src/observe.ts#L969-L1003)

宿主权限模式拒绝与真实命令接线。

<details>
<summary>查看原文（35行）</summary>

```text
    if (mode === undefined) return;
    this.assertMutable('select a permission mode');
    const select = await this.permissionSelect();
    guard();
    if (!select) {
      throw new Error(
        'this DeepSeek Harness deployment composes no permission service, so it has no permission mode to select',
      );
    }
    if (!select.options.some((option) => option.value === mode)) {
      throw new Error(`the DeepSeek Harness host does not offer the permission mode "${mode}"`);
    }
    if (select.currentValue === mode) return;
    const roster = await this.channel.listCommands(this.info.id);
    guard();
    if (!roster.some((command) => command.name === DSH_PERMISSION_COMMAND)) {
      throw new Error(
        'this DeepSeek Harness host advertises permission modes but no command to switch them, so the mode was not changed',
      );
    }
    // The roster read above AWAITED. Re-guard before the switch it authorized —
    // a permission preset is durable session state, and applying one on a lost
    // generation would change how the session approves tools while this
    // connection no longer speaks for it.
    this.assertMutable('select a permission mode');
    const execution = await this.channel.executeCommand(this.info.id, `/${DSH_PERMISSION_COMMAND} ${mode}`);
    if (execution?.result.kind === 'error') {
      throw new Error(
        execution.result.text
          ? `the DeepSeek Harness host refused the permission mode "${mode}": ${execution.result.text}`
          : `the DeepSeek Harness host refused the permission mode "${mode}"`,
      );
    }
  }

```

</details>

#### 缺口

- 本轮未真实配对/撤销设备、运行DSH或浏览器；未完整审计所有WS消息和文件路由授权。
  **影响**：实现与作者材料不能替代当前设备、宿主和真实任务验收。
  **进一步探讨**：固定broker/client/DSH版本与网络配置，在隔离账号和项目完成本题边界的端到端验证。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些承诺必须收窄，超时、后台和附件怎样处理？

**研究主题**：缺陷与关键质疑

#### 完整回答

当前DSH支持不能外推到所有0.2版本。compatibility明列两个qualified版本，family-recognised可用但仍unverified；其他版本可能拒绝。README将一般文件不支持归因Host仅接受图片，但DSH专页后文明确0.2 Host有file上传receipt，限制属于cosyncing。本轮以实现为准：dshStagedImages先拒非image，再要求session cwd内专用inbox、真实父目录和O_NOFOLLOW打开、fstat正规文件/大小匹配；拒绝整个prompt，避免只剩文字而用户以为文件已传。不要把文件路径文字等同已上传字节。

没有DSH只读Observe：同一个原生可写cookie用于API及socket，适配器只向用户暴露明确live前台接入。背景resident tab释放订阅，只有回到前台重附着/历史追赶；不能拿它做无人值守后台审批接收保证。多个前台共享控制意味着模型和权限选择会改变同一个native session，不是每客户端隔离偏好，需要单任务协调。

提示和命令的网络异常不等于操作没发生。0.2 prompt有requestId，已发后不因generation loss自动重试；命令execute不重试避免compact等副作用重复。源码注释称“EXACTLY ONCE”，应准确解释为本客户端单次发送、不自动重试，不是外部效果恰一次证明。session.create也显式指出deadline仍可能留下已建会话但无回执的未知结果，需要对照session.list而非放大timeout或自动重发。cancel请求返回同样不证明上游所有工具/外部副作用已停止。

broker在用户账号下运行，聚合历史、cookie和文件访问；它不是执行隔离边界，也不承诺项目/租户间隔离。网络由用户提供proxy/VPN/tunnel，配对和payload加密不能代替安全连接配置/客户端终端保护。撤销设备阻止后续broker入口，不能撤回已读取内容或抹除DSH里已提交的提示。

托管Host声明按pid/start/boot/地址身份在每次signal前重证，只停自己启动的进程；本轮抽读ownership决策与文档，未对各平台signal和PID复用做实验。凭据拒绝/地址故障应由操作者处理，不把健康外部Host杀掉重建当恢复。

#### 证据与依据

**依据 1 · 源码核查**：[packages/typescript/adapters/dsh/src/compatibility.ts:28-43](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/adapters/dsh/src/compatibility.ts#L28-L43)

qualified是两个确切版本而非最低版本范围。

<details>
<summary>查看原文（16行）</summary>

```text
export type DshContractFamily = typeof DSH_CONTRACT_FAMILIES[number];

/**
 * Versions this build was actually captured against. Each row is evidence, not
 * a range: 0.1.0-rc.6 produced `test/fixtures/dsh-0.1.0-rc.6.json` and
 * 0.2.0-rc.2 produced `test/fixtures/dsh-0.2.0-rc.2.json`.
 */
export const DSH_QUALIFIED_VERSIONS: Readonly<Record<DshContractFamily, readonly string[]>> = Object.freeze({
  'legacy-0.1': Object.freeze(['0.1.0-rc.6']),
  'remote-0.2': Object.freeze(['0.2.0-rc.2']),
});

/** The version this build's primary (current) fixtures and mappings were captured against. */
export const DSH_CURRENT_VERSION = '0.2.0-rc.2';

/**
```

</details>

**依据 2 · 作者声明**：[docs/supported_agents/dsh.md:227-249](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/docs/supported_agents/dsh.md#L227-L249)

专页说明一般文件限制是adapter、未知prompt不自动重试。

<details>
<summary>查看原文（23行）</summary>

```text
Still deferred: non-image file attachments, background Observe subscriptions,
session fork and search, subagents, workspace and settings mutation, goals as a
first-class surface, credential and agent-preset management, and some
DSH-specific message presentation.

Non-image file attachments are cosyncing's limitation, not the host's. The 0.2
host takes files: its prompt content parts include a `file` part that references
a receipt minted by an upload endpoint, so the intake exists upstream. The
cosyncing adapter ships images and nothing else, and refuses other types
outright rather than sending a prompt that mentions a file the agent never
received. That refusal is the correct behaviour for the types it does not
support and should not be read as a statement about DSH. A path is not a
substitute for uploading either way: DSH may run on another machine, where a
broker-local path names nothing it can open.

New rc.2 prompts use distinct request identities across broker restarts and
connection replacements. The native host deduplicates these identities against
queued and durable user messages. Ambiguous prompt failures still require an
explicit new user action; cosyncing does not automatically retry the prompt.

The upstream host exposes one writable client contract rather than a separate
read-only Observe credential, so cosyncing accepts only an explicit foreground
`live` attach.
```

</details>

**依据 3 · 源码核查**：[packages/typescript/adapters/dsh/src/drive.ts:593-654](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/adapters/dsh/src/drive.ts#L593-L654)

拒非图片与inbox/O_NOFOLLOW/正规文件/大小检查。

<details>
<summary>查看原文（62行）</summary>

```text
  files: NonNullable<PromptInput['files']>,
  limits: DshImageLimits | undefined,
  sessionCwd: string | undefined,
): { data: string; mimeType: string; name?: string }[] {
  if (files.length === 0) return [];
    const refuse = (message: string): never => {
      throw new DshDriveError('prompt', { kind: 'rpc', code: 'attachment-unsupported', message });
    };
    const allowed = limits?.mediaTypes;
    const isImage = (mimeType: string): boolean =>
      allowed && allowed.length > 0
        ? allowed.includes(mimeType)
        : mimeType.startsWith('image/');
    for (const file of files) {
      if (!isImage(file.mimeType.trim().toLowerCase())) refuse(DSH_FILE_UNSUPPORTED);
    }
    if (!sessionCwd) refuse('this DeepSeek Harness session has no workspace to stage an attachment in');
    let inbox: string;
    try {
      inbox = realpathSync(resolve(sessionCwd!, PRODUCT_IDENTITY.repositoryDirectoryName, 'inbox'));
    } catch {
      return refuse(DSH_FILE_UNTRUSTED);
    }
    const maxBytes = limits?.maxImageBytes;
    return files.map((file) => {
      if (!file.brokerPath) refuse(DSH_FILE_UNSTAGED);
      const staged = resolve(file.brokerPath!);
      // Resolve the PARENT, never the leaf. Calling `realpathSync` on the file
      // itself is already a follow — it would report the target's location and
      // hide exactly the substitution being defended against.
      let parent: string;
      try {
        parent = realpathSync(dirname(staged));
      } catch {
        return refuse(DSH_FILE_UNTRUSTED);
      }
      if (parent !== inbox) refuse(DSH_FILE_UNTRUSTED);
      // O_NOFOLLOW makes the leaf decision ATOMIC WITH THE OPEN: the kernel
      // fails with ELOOP if the final component is a symlink at the instant it
      // is opened, so there is no window in which a checked path can be swapped
      // for a link. Checking first and opening second cannot achieve this — the
      // fd would then be the attacker's target and `fstat` would call it a
      // perfectly ordinary regular file. Every staged file the broker writes is
      // a real file, so refusing links outright costs nothing.
      let fd: number;
      try {
        fd = openSync(staged, constants.O_RDONLY | constants.O_NOFOLLOW);
      } catch {
        return refuse(DSH_FILE_UNTRUSTED);
      }
      try {
        const stat = fstatSync(fd);
        if (!stat.isFile()) refuse(DSH_FILE_UNTRUSTED);
        if (typeof maxBytes === 'number' && stat.size > maxBytes) {
          refuse(`"${file.name ?? 'image'}" is larger than the ${maxBytes} bytes this DeepSeek Harness host accepts for one image.`);
        }
        // The broker recorded the size it staged. Bytes that disagree with the
        // record are not the attachment the user picked.
        if (typeof file.size === 'number' && file.size !== stat.size) refuse(DSH_FILE_UNTRUSTED);
        const bytes = Buffer.alloc(stat.size);
        let read = 0;
        while (read < stat.size) {
```

</details>

**依据 4 · 源码核查**：[packages/typescript/adapters/dsh/src/implementation.ts:490-508](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/adapters/dsh/src/implementation.ts#L490-L508)

不提供只读Observe凭据。

<details>
<summary>查看原文（19行）</summary>

```text
   * immediate refusal for a non-image is the better trade.
   *
   * `observe` is NOT offered: dsh serves one undifferentiated client contract, so
   * an "observe" attach would hold the same full Drive authority as `live` and
   * the word would be a lie. A genuinely read-only connection needs an upstream
   * read-only credential first.
   */
  readonly capabilities: AgentCapabilities = {
    integrationKind: 'http-websocket',
    attachModes: ['live'],
    supportsObserve: false,
    supportsResume: false,
    supportsLiveAttach: true,
    supportsCrossClientDriveSharing: true,
    supportsNativeArtifact: false,
    supportsNativeFileInput: true,
    supportsModelSwitch: true,
    permissionGranularity: 'per-tool',
  };
```

</details>

**依据 5 · 源码核查**：[packages/typescript/adapters/dsh/src/observe.ts:1363-1380](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/adapters/dsh/src/observe.ts#L1363-L1380)

单发不自动重试的命令路径说明，不能扩大为外部恰一次。

<details>
<summary>查看原文（18行）</summary>

```text
   *
   * EXACTLY ONCE is the property that matters, so this issues a single
   * `commands/execute` and never retries: the host mints a `commandId` and
   * appends the lifecycle records the moment it accepts the line, and a
   * transport failure after that point is indistinguishable from one before it.
   * A retry could compact a session twice or switch a permission preset the
   * user did not ask for a second time.
   *
   * The line is composed from the ADVERTISED name plus the caller's argument
   * text; the name is re-checked against the live roster so a stale picker
   * cannot send an unknown slash line into the host's parser.
   */
  async runCommand(name: string, args?: string, input?: CommandInput): Promise<CommandResult | void> {
    if (DSH_LOCAL_COMMANDS.includes(name)) {
      this.assertMutable(`run "${name}"`);
      await this.channel.cancel(this.info.id);
      return;
    }
```

</details>

**依据 6 · 源码核查**：[packages/typescript/adapters/dsh/src/drive.ts:482-511](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/adapters/dsh/src/drive.ts#L482-L511)

create承认deadline后的未知结果。

<details>
<summary>查看原文（30行）</summary>

```text
  async create(workspaceId: string): Promise<{ sessionId: string; agentPreset?: string }> {
    // Aborting a create mid-flight does not un-create it upstream: the caller
    // would see a retryable failure for a session that exists and retry into a
    // duplicate. A generation rotation is not a reason to abandon a write whose
    // outcome is already decided on the host.
    //
    // This removes generation loss as an ARTIFICIAL cause of an unknown outcome.
    // It does not remove every one: the unary deadline still applies, so a host
    // that creates the session and answers after it leaves the same ambiguity by
    // a different route. Resolving that needs an outcome-unknown result the
    // caller can reconcile against session.list, not a longer timeout.
    const outcome = await this.rpc.call<{ sessionId?: unknown; agentPreset?: unknown }>(
      'session.create',
      { workspaceId },
      { generationLoss: 'non-idempotent-write' },
    );
    if (!outcome.ok) throw new DshDriveError('session create', outcome.failure);
    const sessionId = typeof outcome.value?.sessionId === 'string' ? outcome.value.sessionId : '';
    if (!sessionId) {
      throw new DshDriveError('session create', {
        kind: 'transport',
        reason: 'invalid-envelope',
        retryable: false,
        detail: 'session.create returned no sessionId',
      });
    }
    return {
      sessionId,
      ...(typeof outcome.value?.agentPreset === 'string' ? { agentPreset: outcome.value.agentPreset } : {}),
    };
```

</details>

**依据 7 · 源码核查**：[packages/typescript/broker/src/runtime/managed-host.ts:252-284](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/broker/src/runtime/managed-host.ts#L252-L284)

pid/start/boot身份决策。

<details>
<summary>查看原文（33行）</summary>

```text
 * The ownership decision, as a pure function of three inputs.
 *
 * Split out from every effect on purpose: this is the assertion that a process
 * may be killed, and it should be readable, and testable, without a process
 * table anywhere in sight.
 */
export function classifyManagedHost(
  record: ManagedHostOwnership | null,
  live: LiveProcess,
  identityKey: string,
): ManagedHostVerdict {
  if (live.state === 'unknown') return 'indeterminate';
  if (live.state === 'absent') return 'absent';
  const identity = live.identity;
  if (!record) return 'foreign';
  if (record.identityKey !== identityKey) return 'foreign';
  if (record.pid !== identity.pid) return 'foreign';
  if (record.start !== identity.start) return 'foreign';
  // Before the start token means anything: a tick count from a previous boot is
  // not comparable with one from this boot.
  if (record.boot !== identity.boot) return 'foreign';
  // The command name is NOT compared — a host may rename itself, and both of
  // ours do (module header). BOTH sides are still required to be present, and
  // the asymmetry matters: dropping the comparison must not turn a malformed
  // record into a passing one. A live identity with no command name is a read
  // that never reached a process; a RECORD with none was never written by
  // `startManagedHost`, which takes its fields from a live read, so it is
  // synthetic or damaged. Either way the proof is incomplete, and an incomplete
  // proof authorizes nothing.
  if (record.comm.length === 0 || identity.comm.length === 0) return 'foreign';
  return 'owned';
}

```

</details>

**依据 8 · 作者声明**：[docs/supported_agents/dsh.md:155-170](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/docs/supported_agents/dsh.md#L155-L170)

前台释放/native继续与身份失败边界。

<details>
<summary>查看原文（16行）</summary>

```text
- A background resident tab does not keep a DSH subscription. Foregrounding it
  refreshes the roster, reattaches explicitly in live mode and catches up from
  history, while its cached transcript and unsent draft remain resident.
  A visible window retains its subscription when input focus moves elsewhere;
  hiding it releases transport, and returning it to view resumes the session.
  A page restored at browser startup waits for its authoritative roster attach
  instruction before joining, so a delayed roster cannot cause an implicit
  attachment to a live-only host.
  After the last foreground client leaves, the broker's reconnect grace ends
  even when native work or a decision is pending. Its adapter subscription then
  closes and unanswered interactions return to the host; the native session keeps
  running independently.
- The adapter fails closed when host identity cannot be verified or a session
  has been removed. A malformed roster is reported as a contract failure;
  it cannot falsely remove an attached durable session after a native agent
  becomes inactive.
```

</details>

#### 缺口

- 跨平台托管signal、真实网络失联/审批超时和多客户端并发效果未验收；README与DSH专页的附件归因矛盾需要保留说明。
  **影响**：实现与作者材料不能替代当前设备、宿主和真实任务验收。
  **进一步探讨**：固定broker/client/DSH版本与网络配置，在隔离账号和项目完成本题边界的端到端验证。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 具体怎么用，首次持续、失败恢复和退出代价是什么？

**研究主题**：采用判断、效果与总成本

#### 完整回答

适合能维护自有broker网络的开发者，在非敏感项目上把一个确切支持的DSH主机和一台可信设备做前台交接试用。原生DSH web已经够用或仅偶尔SSH的人，不一定值得多维护一套broker与Flutter客户端。根0.8.5、Bun1.4.3、Flutter3.44.3是固定源码声明，不推断当前发布制品可用；DSH实验路径供源码贡献者，不能把一键installer宣传等同该适配器已获完整可见UI验收。

首次固定broker/client契约与DSH0.2.0-rc.2，确认只启动一套broker避免抢同一native agent；已有外部DSH先通过隐藏提示/stdin提交launch URL，不把root credential放命令行。先本机配对测试，确认设备默认有drive/files，再按需要提供自己维护的HTTPS/VPN连接，二维码broker URL只是告知地址，不会探测或持久设置网络。开始前保存native session ID与版本，验证从第二个前台加入同一历史、正确答权限、一次提示只产生一次原生user message。

现金是已有Agent模型/订阅、持续开机主机、网络/域名/代理与存储，金额未知；broker自托管不等于免费运行模型。人工是PATH/原生Host、cookie/设备文件安全、跨平台制品和契约升级、连接失效重基线与UI偏差排障。十二适配器目录并不意味着维护成本平均或全部都本轮验证。

失败先区分设备配对、broker角色、网络可达、DSH enrollment与Host状态；重新入网/入籍后提交新操作，不能把等待旧目录的写入自动恢复。模糊结果先到native历史确认。退出先撤销设备并断开DSH enrollment，停止broker服务，确认只托管进程被停止；外部Host和native session继续存在，历史、缓存和已下载图片需各端自行处理。不要把删除broker凭据当上游撤销成功或数据清除证据。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-10](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/package.json#L1-L10)

根版本/Bun工作区。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "cosyncing",
  "version": "0.8.5",
  "private": true,
  "packageManager": "bun@1.4.3",
  "license": "Apache-2.0",
  "type": "module",
  "description": "cosyncing \u2014 view and drive CLI coding-agent sessions through your own broker.",
  "workspaces": [
    "packages/typescript/protocol",
```

</details>

**依据 2 · 作者声明**：[README.md:119-139](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/README.md#L119-L139)

Bun、local默认和用户自有连通方案。

<details>
<summary>查看原文（21行）</summary>

```text
version-checked. See [supported-agent setup](docs/supported_agents/README.md) for each runtime.

## Prerequisites

The server runs with [Bun](https://bun.sh) 1.4.3 or newer. The one-command installers acquire it
when needed; Node.js/npm are not required. The broker is local-only by
default. Cross-device use requires a proxy, tunnel, VPN,
mesh network, or another [operator-owned connectivity method](docs/connectivity/README.md).
For a simple private route, see [Tailscale Serve](docs/connectivity/tailscale-serve.md); for a
self-managed overlay, see [WireGuard or EasyTier](docs/connectivity/wireguard-easytier.md). After
`cosyncing setup`, you can also copy
`https://github.com/cosyncing/cosyncing/tree/main/docs/connectivity` to a coding agent and ask it to
configure your chosen method while keeping the broker bound to loopback.
[Tokdash](https://github.com/JingbiaoMei/tokdash) is optional but strongly recommended for quota
tracking and warnings.

See [installation prerequisites](docs/installation/prerequisites.md) for Linux and macOS commands,
WSL notes, and Tokdash setup. For the signed one-liner installers, see
[installing with cosyncing's own installer](docs/installation/script-install.md).

## Install
```

</details>

**依据 3 · 作者声明**：[docs/supported_agents/dsh.md:53-95](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/docs/supported_agents/dsh.md#L53-L95)

不并行broker、隐藏输入enrollment与恢复条件。

<details>
<summary>查看原文（43行）</summary>

````text

Do not start a full source broker alongside an installed broker that owns the
same native agents. Stop the installed service for the review window and
restore it afterward.

## Signing in to a 0.2 host

A 0.2 host protects its API. The address of a host you started yourself answers
nothing until you present the one-time URL that `dsh web` printed when it
started, so cosyncing asks you for that URL once and keeps the session cookie the
host issues for it.

```bash
cosyncing dsh connect
# Paste the URL dsh printed. It is read silently and never stored.

printf '%s' "$DSH_LAUNCH_URL" | cosyncing dsh connect
cosyncing dsh status
cosyncing dsh disconnect
```

The URL is a credential that grants full control of that host, so it is accepted
only from a hidden prompt or from stdin — never from the command line, where it
would sit in your shell history and in the process list. What cosyncing stores is
the cookie the host issued, in its own credential file, scoped to that address and
that host's profile: a second host does not share it, a second cosyncing install
does not read it, and the file is written owner-only.

An already attached session resumes after successful re-enrollment through a fresh
authenticated handshake and session baseline. Disconnect keeps it withdrawn until
a usable credential is supplied again. A retained managed-launch token cannot
undo a withdrawal or a refused enrollment; renewal resumes after successful
re-enrollment. Requests waiting on catalog reads are fenced when event authority
ends or the connection closes. After recovery, submit a new prompt or command;
the old request cannot resume merely because readiness returns.

The cookie outlives both processes. Restart the broker, or restart the host, and
cosyncing is still signed in — no re-paste, and no new launch URL to go hunting
for. A host cosyncing starts for itself needs no `dsh connect` at all: the launch
URL it prints goes straight from the child process to the adapter that configured
that address, and the exchange runs on its own.

`cosyncing doctor` reads the same enrollment the running broker uses, so it never
````

</details>

**依据 4 · 作者声明**：[README.md:171-184](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/README.md#L171-L184)

pair URL与设备撤销操作。

<details>
<summary>查看原文（14行）</summary>

```text
npm distribution ended at **0.6.6**; use the installers above for new installations or [migration](docs/installation/script-install.md#npm-installations).

### After setup

`cosy pair --broker-url https://cosy.example.com` includes that client-reachable origin in a
five-minute, one-use QR code. The URL is not persisted or probed. Omit the flag for an
authentication-only offer when the client already knows its broker URL. See the
[connectivity chooser](docs/connectivity/README.md). Scan the QR from a client to grant access;
`cosy devices list` lists paired devices, and `cosy devices revoke <id>` revokes one.

After setup, `cosy doctor` diagnoses the machine without changing it, and `cosy status` summarizes
install, service, agents, and sessions.

## Client
```

</details>

**依据 5 · 作者声明**：[docs/supported_agents/dsh.md:251-288](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/docs/supported_agents/dsh.md#L251-L288)

托管进程只管理自己所有的Host。

<details>
<summary>查看原文（38行）</summary>

```text
## Managed hosts

An installed cosyncing service starts `dsh web` when none is running, restarts
it if it crashes, and stops it when the service stops. A foreground broker does
the same when `COSYNCING_DSH_MANAGED_HOST=1` is set in its environment.

The start passes `--no-open`, verified against a real 0.2 host, and the child runs
without a display handoff, so a managed launch does not pop a browser window every
time the broker restarts. On 0.2 the launch URL that child prints is what signs
cosyncing in, automatically; the token in it is held in memory only, and the
cookie it earns is what persists.

Only a locally launchable configuration is managed. Point the adapter at a host
on another machine and cosyncing observes it without ever trying to start or
stop it.

Authorization is not ownership. The broker acts only on a process it can prove
it started — pid, a start token that survives pid reuse, the boot it started
in, and the address the claim was recorded for must all match, re-proved
immediately before every signal. The command name is recorded as evidence but
is not part of the proof: a process can rename itself at runtime, so a check
that trusted it would reject a host that is genuinely ours. Anything else is left running
and reported: a host you started yourself is never stopped, replaced, or
reconfigured, and neither is one the machine will not let it identify.
`cosyncing doctor` reports what it found either way, but what it tells you to do
depends on the address you are pointed at. Where cosyncing manages that address
it points at the service rather than offering a `dsh web` command, since
starting one by hand would race its recovery. Point the adapter anywhere else —
another port, another machine — and it names that address for you to start, and
still offers no `dsh web`: that command takes no address, so it would start a
host at the default one instead. Not the host you are diagnosing, and possibly
the one the service already manages.

Authenticated service failures such as 5xx responses, service RPC failures, and
timeouts follow the normal owned-host recovery policy. Missing or refused
enrollment, unsafe credential storage, and address/Host-Origin faults require
operator intervention and do not terminate a healthy owned host. An unsupported
optional capability affects its own control rather than restarting the host.
```

</details>

**依据 6 · 源码核查**：[packages/typescript/broker/src/transport/transport-pairing.ts:379-435](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/broker/src/transport/transport-pairing.ts#L379-L435)

撤销generation与后续token拒绝机制。

<details>
<summary>查看原文（57行）</summary>

```text
  revoke(peerId: string): boolean {
    return this.revokeWithState(peerId) !== undefined;
  }

  /** Persist revocation before publishing it to memory. */
  revokeWithState(peerId: string): RevokedTransportPeer | undefined {
    this.assertStoreWritable();
    const refused = this.refusedPeers.get(peerId);
    const peer = refused?.peer ?? this.peers.get(peerId);
    if (!peer || peer.revokedAt) return undefined;
    const revocation = { authGeneration: peer.authGeneration + 1, revokedAt: new Date(this.now()).toISOString() };
    const revoked: AcceptedTransportPeer = { ...peer, ...revocation };
    if (refused) {
      // A refused record keeps every field it was stored with; only the revocation is added.
      const record: RefusedTransportPeer = { peer: revoked, stored: { ...refused.stored, ...revocation } };
      this.save(this.peers, new Map(this.refusedPeers).set(peerId, record));
      this.refusedPeers.set(peerId, record);
    } else {
      const candidatePeers = new Map(this.peers);
      candidatePeers.set(peerId, revoked);
      this.save(candidatePeers);
      this.peers.set(peerId, revoked);
    }
    return {
      peerId: revoked.peerId,
      brokerPeerId: revoked.brokerPeerId,
      authGeneration: revoked.authGeneration,
      credentialIdentity: `peer-token:${revoked.brokerPeerTokenHash}`,
    };
  }

  verifyPeerToken(peerId: string, peerToken: string): 'unknown' | 'ok' | 'forbidden' {
    const peer = this.peerForEndpoint(peerId);
    if (!peer) return 'unknown';
    if (peer.revokedAt) return 'forbidden';
    const hash = peer.peerId === peerId ? peer.peerTokenHash : peer.brokerPeerTokenHash;
    return safeTokenHashEquals(hash, tokenHash(peerToken)) ? 'ok' : 'forbidden';
  }

  verifyAnyPeerToken(peerToken: string): 'unknown' | 'ok' {
    return this.authenticatePeerToken(peerToken) ? 'ok' : 'unknown';
  }

  authenticatePeerToken(peerToken: string): AuthenticatedTransportPeer | undefined {
    const tokenHashValue = tokenHash(peerToken);
    for (const peer of this.peers.values()) {
      if (peer.revokedAt) continue;
      if (!safeTokenHashEquals(peer.brokerPeerTokenHash, tokenHashValue)) continue;
      return {
        peerId: peer.peerId,
        authGeneration: peer.authGeneration,
        roles: new Set(peer.roles),
        credentialIdentity: `peer-token:${peer.brokerPeerTokenHash}`,
      };
    }
    return undefined;
  }
```

</details>

#### 缺口

- 本轮没有安装/费用/耗时或退出测试；试用必须先验证契约和凭据边界，不升级install。
  **影响**：实现与作者材料不能替代当前设备、宿主和真实任务验收。
  **进一步探讨**：固定broker/client/DSH版本与网络配置，在隔离账号和项目完成本题边界的端到端验证。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些机制可借鉴，怎样验证新的交接改进？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可借鉴的不是把所有Agent API一并开放，而是broker-owned扁平契约与每适配器能力声明、显式拒绝未实现端点；DSH区分RPC identity与turn requestId，晚到读不能复活旧操作，非幂等写不因载体换代伪造失败。设备撤销先持久状态再关连接、enrollment写入排队按当前授权核对，也能迁移到其他自托管跨端工具。仍要注意它只控制后续授权，并不取消已发命令效果。

DSH drive测试明确注入所有I/O、无原生进程或网络；它能验证answer/echo关联与await期间失权，不证明可见Flutter客户端和真实Host。专页分别记真实host采样、脚本provider、provider-backed adapter以及少量浏览器结果，并明确剩余model-backed browser恢复/交互验收未完成；这些是作者材料，未作为本轮执行。根体量含Flutter/Dart、TS、生成contracts、适配器和测试；默认JS/TS统计不覆盖全部Dart，不能从LOC/用例数量推导支持质量。

新方向是为前台交接增加可核对的“动作结果状态卡”：区分未发送、已接受待结果、结果未知、native历史已确认、仅本地失联；发生未知时显示native session与requestId，允许只读对账后由用户显式决定新动作。依据是现有generation guard和native identity已提供关联材料，而当前create deadline仍承认未知，用户看到通用失败易重发。相对自动重试，它增加可见验收；相对新建第二任务账本，应只保存关联回执和观察，不自称掌握上游终止真相。

最小验证在prompt/command/create被Host接受后丢响应、设备切换和broker重启，要求两端状态不显示“未执行”，对账只读且不自动补发；若native历史无法区分同内容多次动作，则保持unknown并证明用户可安全退出。若当前UI已有等价完整回执，或上游无法提供稳定关联，则修正/放弃方案。未实现未验证，不计现版贡献。

#### 证据与依据

**依据 1 · 源码核查**：[packages/typescript/adapters/dsh/src/remote.ts:44-69](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/adapters/dsh/src/remote.ts#L44-L69)

冻结endpoint只实现明确功能。

<details>
<summary>查看原文（26行）</summary>

```text
 * Endpoints this adapter may call.
 *
 * Every entry is one cosyncing feature, and each was read out of the host's own
 * generated descriptor array rather than inferred from a route name. Adding a
 * line here means adding the feature it serves, its fixture sample, and its
 * test; that is the point of the list.
 */
export const DSH_REMOTE_ENDPOINTS = Object.freeze([
  '$events/result',
  'commands/execute',
  'commands/list',
  'permissionPresets/catalog',
  'session/attachment',
  'session/cancel',
  'session/create',
  'session/list',
  'session/modelCatalog',
  'session/page',
  'session/projections',
  'session/prompt',
  'session/rename',
  'session/selectModel',
  'session/updateQueue',
  'userQuestions/answer',
  'workspace/initializeDefault',
] as const);
```

</details>

**依据 2 · 源码核查**：[packages/typescript/adapters/dsh/src/remote-host.ts:459-477](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/adapters/dsh/src/remote-host.ts#L459-L477)

turn请求身份独立。

<details>
<summary>查看原文（19行）</summary>

```text
    // `session/prompt` requires a client `requestId`, and the envelope's rpcId
    // identifies THIS request, not the turn it started. They are different ids
    // with different lifetimes and must never be collapsed.
    const requestId = this.options.newRequestId();
    options.onRpcId?.(requestId);
    // `non-idempotent-write`, for the reason the 0.1 driver gives for the same
    // flag on a create: a prompt whose receipt was lost in a reconnect may
    // already have started a turn, and a caller told "retryable" starts a second
    // one. The write guard in `call()` is what keeps it from being sent into an
    // epoch that ended during authentication.
    const outcome = await this.link.call<unknown>('session/prompt', DshRemoteArgs.prompt({
      requestId,
      sessionId,
      mode: options.mode ?? 'queue',
      content,
      ...(options.clientTimeZone ? { clientTimeZone: options.clientTimeZone } : {}),
    }), { generationLoss: 'non-idempotent-write' });
    if (!outcome.ok) throw new DshDriveError('prompt', outcome.failure);
  }
```

</details>

**依据 3 · 源码核查**：[packages/typescript/adapters/dsh/src/observe.ts:859-869](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/adapters/dsh/src/observe.ts#L859-L869)

旧操作mutationRevision拒绝。

<details>
<summary>查看原文（11行）</summary>

```text
  /** Catalog reads may survive authority loss; their waiting mutation may not. */
  private mutationGuard(action: string): () => void {
    const revision = this.mutationRevision;
    return () => {
      this.assertMutable(action);
      if (revision !== this.mutationRevision) {
        throw new Error(`cannot ${action}: the DeepSeek Harness event authority changed; submit a new operation`);
      }
    };
  }

```

</details>

**依据 4 · 源码核查**：[packages/typescript/adapters/dsh/src/auth.ts:915-969](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/adapters/dsh/src/auth.ts#L915-L969)

存储变更在提交时重验授权，防晚到清理新凭据。

<details>
<summary>查看原文（55行）</summary>

```text
   * Queue a store mutation and authorize it at the instant it commits.
   *
   * `authorized` runs after every earlier mutation has finished, so it sees the
   * store as this session is about to write it. Returning false means the scope
   * moved on while this operation waited, and the write is dropped rather than
   * applied: the credential it carries belongs to a launch nobody owns or a
   * cookie something newer already replaced.
   */
  private queueStore(authorized: () => boolean, mutate: (store: DshCredentialStore) => Promise<void>): Promise<void> {
    const store = this.store;
    if (!store) return Promise.resolve();
    const run = async (): Promise<void> => {
      if (!authorized()) return;
      await mutate(store);
    };
    // The chain never rejects: a failed write is reported by the caller's detail,
    // and an aborted chain would strand every credential write behind it.
    const next = this.storeQueue.then(run, run);
    this.storeQueue = next.then(() => undefined, () => undefined);
    return next;
  }

  private persist(cookie: DshCookie, authorized: () => boolean): Promise<boolean> {
    if (!this.store) return Promise.resolve(false);
    let written = false;
    return this.queueStore(
      () => authorized() && this.cookie === cookie,
      async (store) => {
        try {
          await store.save(this.scope, cookie);
          written = true;
        } catch {
          // Authentication WORKED; only remembering it failed. Saying so is worth
          // more than pretending it did not, and worth more than blocking a
          // session that is live right now.
          this.detailValue = 'the DeepSeek Harness session is active but could not be stored for the next start';
        }
      },
    ).then(() => written);
  }

  private clearStored(authorized: () => boolean = () => true): Promise<void> {
    if (!this.store) return Promise.resolve();
    // Captured now: clearing a scope that has since acquired a NEW cookie would
    // delete someone else's credential, and an expired-cookie clear racing a
    // successful exchange is exactly that race.
    const expected = this.cookie;
    return this.queueStore(
      () => authorized() && this.cookie === expected,
      async (store) => {
        try {
          await store.clear(this.scope);
        } catch {
          /* already unusable */
        }
```

</details>

**依据 5 · 源码核查**：[packages/typescript/adapters/dsh/test/test-dsh-drive.ts:1-17](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/packages/typescript/adapters/dsh/test/test-dsh-drive.ts#L1-L17)

作者测试注入I/O、无进程网络的范围。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * The write boundary: exactly what goes on the wire when the app drives a dsh
 * session, and what refuses rather than half-lands.
 *
 * Two things get the most attention here. First, ANSWER CORRELATION: a question
 * or approval is answered by echoing the rpcId of the frame that asked, and the
 * payload carries the resource ids the host needs — get either half wrong and
 * the answer silently settles nothing. Second, ECHO CORRELATION: dsh stamps the
 * prompt's rpcId onto the `user/message` it produces, which is the one handle
 * that lets an optimistic bubble converge instead of doubling.
 *
 * All I/O injected; no dsh process and no network.
 *
 *   bun run packages/typescript/adapters/dsh/test/test-dsh-drive.ts   (exit 0 = all pass)
 */
export {};
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
```

</details>

**依据 6 · 作者声明**：[docs/supported_agents/dsh.md:174-215](https://github.com/cosyncing/cosyncing/blob/e6b9fa29b1ad65d28f7a8fe9480e231856251e82/docs/supported_agents/dsh.md#L174-L215)

作者分别标注真实Host/脚本/模型/浏览器证据，仍experimental。

<details>
<summary>查看原文（42行）</summary>

```text
"0.2" here means one build: `0.2.0-rc.2`, the version the contract was captured
from and the version every 0.2 result below was re-checked against. A different
0.2 build, including stable 0.2.0 or another release
candidate, has not been qualified and is not covered by the statements below.

What was captured from a running `0.2.0-rc.2` host and re-checked against one:
starting a host without a browser window opening, becoming authenticated to it
with nothing typed, reading its session roster, opening a session and reading
its history through the snapshot cut, holding a live follow subscription open on
it while a client reconnects, creating a session on a host that has no workspace
registered, keeping the credential across a broker restart, and enrolling a host
cosyncing does not own without touching that host's process.

Additional contract captures used a disposable `0.2.0-rc.2` host and a local
scripted provider. They exercised user echoes, streamed and settled text,
follow replacement during partial output, read-tool results, approval allow/reject, blocking questions,
timed questions and late answers, and image-only and caption-plus-image admission
and durable readback. These captures made no real model requests and prove the
adapter path, rather than provider-backed or visible browser acceptance.

Native Windows x64 and macOS arm64 passes also exercised basic managed launch,
authentication, roster/history reads and external enrollment without a model request. A separate
Linux pass made the real host fail at startup with disposable invalid configuration:
three recovery attempts failed, then supervision refused further launches. These
results cover basic lifecycle and startup suspension, rather than client UI or
failure during a model turn.

Separate provider-backed turns on a disposable Linux host exercised the actual
adapter prompt path: streamed and settled replies, read-tool results, approval
allow/reject, blocking questions, continued questions with late answers, image-only
and caption-plus-image input, carrier replacement during output, and interruption.
An owned process was also terminated during real streamed output: normal recovery
started a replacement, cleared stale partial output, and completed a new turn after
the consumer read the replacement history baseline. These are adapter outcomes;
they do not qualify visible browser behavior.

A local scripted-provider browser pass verified shared completed turns in two
foreground cosyncing clients and the native browser, visible read-tool input and
output, and an approval answered through cosyncing. Model-backed browser outcomes
and the remaining browser recovery and interaction scenarios remain acceptance
work. A successful login, roster read, or transport test does not qualify those
scenarios. The adapter remains experimental pending that evidence.
```

</details>

#### 缺口

- 本轮未运行作者测试或查看Flutter动作结果全UI，状态卡是否已有等价行为仍需验证；不把研究假设写成现版功能。
  **影响**：实现与作者材料不能替代当前设备、宿主和真实任务验收。
  **进一步探讨**：固定broker/client/DSH版本与网络配置，在隔离账号和项目完成本题边界的端到端验证。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
