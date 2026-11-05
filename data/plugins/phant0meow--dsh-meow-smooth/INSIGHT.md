# dsh-meow-smooth 喵丝滑

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[b9e5f4e](https://github.com/Phant0Meow/dsh-meow-smooth/tree/b9e5f4e7eda445b06aaf205018b1ace448d88029)

<!-- BEGIN META -->
[![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Phant0Meow/dsh-meow-smooth) [![npm 30d 3,298](https://img.shields.io/static/v1?label=npm+30d&message=3%2C298&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/meow-smooth) [![最新发布 2026-09-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/meow-smooth)
<!-- END META -->

> **功能**：为 DSH 网页提供移动输入与侧栏交互、会话提醒，以及可选的响应压缩代理。

> **亮点**：它把触屏换行、运行中queue/steer发送、侧栏手势和未决交互提醒接到现有宿主状态，给手机参与任务补充入口；主要复用原生提交与布局机制。已有增量是交互适配，不能解释为模型响应提速或后台通知必达，见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：提醒与可逆性最影响采用。非error的长回合达到工具数阈值也会生成“任务完成”，不证明业务成功；缩放、history与推送订阅的状态也不由总disposer完整还原，用户不能把通知或停用当验收保证，见 [Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 谁需要移动端增强，相对原生 UI 和远程访问工具增加什么？](#detail-section-11)
  - [Q02 · 移动输入、手势和运行中发送如何实际接到宿主状态？](#detail-section-12)
  - [Q03 · 通知、未决交互恢复及可选压缩代理的真实边界是什么？](#detail-section-13)
  - [Q04 · 从安装、授权到持续维护和退出的成本是否适合试用？](#detail-section-14)
  - [Q05 · 怎样验证多增强插件共存的可逆交互假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有受控远程 DSH 入口、用手机浏览器或 PWA 参与任务的人，增强输入、侧栏与提醒；不负责提供网络隧道或加快模型推理。

对照原生DSH界面与已有远程连接入口。本组件改变手机交互与提醒步骤，不创造模型能力；作者亲测和压缩比例不能当本轮可用性/性能结果，见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 触屏普通Enter换行 | 避免移动编辑时直接走原生发送keydown | 粗指针且非IME/修饰键；本轮未做设备验证 |
| 运行中发送按钮 | 复用原生queue或steer | 草稿非空、会话服务存在；缺服务可能no-op |
| 侧栏与返回手势 | 窄屏开合原生侧栏 | 全局触摸与history接管，会改变普通返回行为 |
| pending投影与提醒 | 查未决交互并跳回会话 | orphan可能无法应答，通知受权限/后台和队列限制 |
| 可选JSON压缩代理 | 压缩未编码的特定API响应 | 默认关闭、loopback监听，不加快模型推理 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH网页Host与slots/layout/sessions/conversation | UI及Host对应部分必需 | 装配、布局、原生提交及pending | 缺槽位/布局早退；缺会话提交可降为no-op，需核对结果 |
| Node与构建环境 | Host必需；GitHub源码安装需构建 | esbuild产出Host/Client；构建target=node22 | package未声明严格engines，不能推断兼容任意Node |
| web-push与浏览器通知能力 | 系统Push特定功能必需 | VAPID、订阅和推送 | 未授权或API不可用则降级，提醒非必达 |
| HTTPS/PWA、SW与Push服务 | 后台/关闭页面提醒按需 | secure context订阅与后台展示 | 普通页面通知不能替代关闭后的推送链 |
| webhook服务及配置 | 可选 | 无Push订阅/发送失败时兜底 | 外部服务费用与到达未知，失败静默 |
| 本地代理端口与受控远程入口 | 代理/跨设备按需 | 特定JSON压缩与网络转发 | 默认代理关闭，插件不替代隧道与访问授权 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份profile，选择安装来源并重启 | 固定版本与构建入口可追溯，本轮不作安装保证 |
| UI试用 | 用户先不授通知权限、不启代理，用可丢弃会话 | 普通Enter、IME、queue/steer与侧栏符合预期，草稿无误发送 |
| 按需通知 | 用户审权限和通道，Host投影，Client订阅 | 实际设备收到并跳到正确会话，提醒不替代结果验收 |
| 停止与恢复 | 用户移除并重启、刷新页面，按需撤站点权限 | 核对缩放/返回、SW订阅和Host状态，不把UI=off当全停 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 构建/Host与网络资源，金额未知 | 备份安装、重启、目标设备输入/手势检查 | Git源码与npm路径不同，无本轮安装耗时 |
| 持续使用 | 轮询、Push和可选webhook/代理资源，费用未知 | 宿主DOM升级、同类插件冲突和通知权限维护 | 不能以UI插件推断免费或轻量 |
| 失败恢复 | 重试网络和未决记录状态未知 | 查真实会话、orphan、结束原因和通道配置 | 通知失败可静默，不重建失效审批RPC |
| 退出 | Host持久文件及浏览器订阅仍可能保留 | 移除重启、刷新、按需撤权限和站点状态 | 总disposer不完整还原viewport/history/SW |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 手机输入与侧栏 | Enter、运行中按钮和手势接原生状态 | 目标设备可用性、误发送率及无障碍影响 |
| 提醒覆盖 | pending投影、系统通知、Push及webhook路径 | 设备展示与用户看见，非error完成标签的业务含义 |
| 访问加速 | 可选特定JSON gzip与已有编码透传 | 实际压缩比、CPU及端到端响应时间；不影响模型推理速度 |
| 退出恢复 | 有单实例回调和部分监听清理 | 热停用完整还原与多插件共存结果 |

> **思考**：提醒与可逆性最影响采用。非error的长回合达到工具数阈值也会生成“任务完成”，不证明业务成功；缩放、history与推送订阅的状态也不由总disposer完整还原，用户不能把通知或停用当验收保证，见 [Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它把触屏换行、运行中queue/steer发送、侧栏手势和未决交互提醒接到现有宿主状态，给手机参与任务补充入口；主要复用原生提交与布局机制。已有增量是交互适配，不能解释为模型响应提速或后台通知必达，见 [Q01](#research-q01)、[Q02](#research-q02)。

可借鉴的是复用原生输入提交与布局、单实例先拆旧的资源清单、审计pending补充客户端状态，以及代理避免双重编码。局限在全局DOM/viewport/history所有权不完整，Host推送与UI开关也不是同一个生命周期；结束状态和通知到达应与业务验收分开，见 [Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

提醒与可逆性最影响采用。非error的长回合达到工具数阈值也会生成“任务完成”，不证明业务成功；缩放、history与推送订阅的状态也不由总disposer完整还原，用户不能把通知或停用当验收保证，见 [Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在独立profile用可丢弃会话检查输入、IME和运行中queue/steer；如果依赖缩放或普通返回导航，应先保留原生界面。通知和代理分开按需启用，提醒后回会话核对真实结束原因。出现误发送、交互冲突或无法恢复原状就移除并重启、刷新页面，按需另撤浏览器订阅和权限，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查输入、运行中提交、手势、Host审计与通知及可选压缩链路。它包含Host状态与网络组件，不能绝对称纯客户端。真实移动可用性、性能收益、通知到达及完整卸载恢复均未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、build.mjs、src/index.ts、src/client.ts、src/run-send.tsx、src/sidebar-gesture.ts、src/back-guard.ts、src/notify-client.ts、src/notify-host.ts、src/auth-gate.ts、src/compress-proxy.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码级检查Host/Client装配、输入和运行中提交、手势/返回、审计与通知、鉴权及可选代理；没有运行目标代码、e2e脚本、浏览器或真实宿主。作者自测、通知到达与压缩比例不作为本轮实测。
- 下一步：后续在授权的目标手机与隔离profile对照原生/本插件/叠加另一增强，记录输入误发送、缩放返回、通知真实结束与安装停用恢复，并另测JSON字节、CPU和端到端延迟；本轮未执行。

**分析版本**

- **仓库**：[Phant0Meow/dsh-meow-smooth](https://github.com/Phant0Meow/dsh-meow-smooth)
- **版本号**：0.8.1（[固定提交 b9e5f4e](https://github.com/Phant0Meow/dsh-meow-smooth/tree/b9e5f4e7eda445b06aaf205018b1ace448d88029)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未来可把每项增强放入独立资源作用域，保存并按所有权恢复页面状态，对不可撤回状态明确刷新或撤权限。用原生、本插件及叠加另一增强的安装/重复apply/停用样本检查误发送和残留；恢复覆盖其他插件状态即削弱假设。该方向尚未验证，见 [Q05](#research-q05)。

后续在授权的目标手机与隔离profile对照原生/本插件/叠加另一增强，记录输入误发送、缩放返回、通知真实结束与安装停用恢复，并另测JSON字节、CPU和端到端延迟；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 55 | 9868 | 8409 | 1144 | — |
| .md | source | 5 | 543 | — | — | 7635 |
| .ts | source | 9 | 5552 | 3692 | 1675 | — |
| .tsx | source | 2 | 219 | 138 | 67 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Phant0Meow/dsh-meow-smooth/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：移动交互和通知怎样接入DSH，哪些语义、恢复与性能边界约束其采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要移动端增强，相对原生 UI 和远程访问工具增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是已经在远端电脑运行DSH、用手机浏览器或PWA查看和参与任务的用户。作者的场景是窄屏输入、侧边栏、运行中插话及离开页面后的提醒；“作者亲测好用”和手机像原生App是作者体验，不是本轮可用性或性能测试。合格结果应是草稿、会话和原生提交语义不被改变，用户能进入侧栏、回应审批和识别真实任务状态，停用后能恢复普通浏览器行为。

相对只用Tailscale等网络入口，本插件实际增加页面交互与通知适配；它不建立通用远程网络，也不加快模型推理。相对原生DSH UI，粗指针Enter阻断原发送路径而保留浏览器换行，另有运行中按钮调用原生queue/steer提交，侧栏手势只切已有布局状态。这些是UI交接增量，不是新增Agent能力。移动附件等功能也尽量复用宿主管线；本轮主要核查输入、手势、通知与可选压缩，不把全部宣传特性算作已验收。

README“纯客户端自包含”的定位已不足以描述当前版本：Host入口实际安装审计投影、状态路由、Web Push及订阅持久化，并可在本进程启动压缩代理。即使不改DSH源码，仍增加Host网络、磁盘和浏览器状态，因此采用者必须同时评估这些条件。现有原生界面已满足需要、依赖浏览器缩放或正常返回导航的人，可能不值得接受默认交互变化。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-16](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/README.md#L3-L16)

作者提出手机远程使用、通知及自用体验；不是独立效果实测。

<details>
<summary>查看原文（14行）</summary>

```text
## 简介

dsh（DeepSeek Harness）前端体验增强插件，**零 dsh 本体改动**，纯客户端自包含。
装上之后，dsh 在手机上像原生 App 一样好摸，在电脑上也有更舒服的小细节。

tailscale实现手机端远程连接dsh（插件包含tailscale配置踩坑指导，AI看完应该可以帮你快速实现手机连接dsh，你就不用自己从零开始踩坑了。）

手机端ui交互优化，让手机端dsh真正可用。你可以躺着coding了。

电脑、手机都支持的通知系统。AI跑任务，你切出去刷b站了，AI跑完任务或者中途提问，会发通知给你。

还有一些ui交互方面的细节优化。

作者自己在用，亲测好用，非常提高幸福感。
```

</details>

**依据 2 · 源码核查**：[src/client.ts:1452-1477](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/client.ts#L1452-L1477)

触屏Enter只阻断keydown传播，保留原生换行。

<details>
<summary>查看原文（26行）</summary>

```text
/** 触屏 Enter → 换行：capture 阶段只断官方发送路径（stopPropagation，
 *  React root 收不到 keydown → 官方 submit 不触发），默认行为留给浏览器
 *  原生插入换行（v5.3 重写，详见函数内注释）。
 *  Shift/Ctrl/Alt/Meta+Enter、IME 选词（isComposing/keyCode 229）放行。 */
function onKeyDownCapture(event: KeyboardEvent): void {
  if (event.key !== 'Enter' || event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) return
  if (event.isComposing || event.keyCode === 229) return
  // 输入区判定见 composerEditableOf：新版是 Lexical contenteditable。
  // 这里只 stopPropagation、不 preventDefault——浏览器原生换行会被 Lexical 的
  // beforeinput 路径接住（insertParagraph → INSERT_PARAGRAPH_COMMAND →
  // selection.insertLineBreak()），且不会触发挂在 KEY_ENTER_COMMAND 上的提交。
  if (composerEditableOf(event.target) === null) return
  if (!isCoarsePointer()) return
  noteFold('keyEnter', true)
  // 只断官方发送路径，把换行还给浏览器（2026-08-25 v5.3 重写，修"换行
  // 丢失/跳回"）：旧实现 preventDefault + 手动改 DOM value + setSelectionRange
  // + 派发合成 InputEvent——与本体受控层（textarea value={draft}）产生
  // DOM/state 不一致窗口，commit 前任何其他重渲染都会用旧 draft 写回
  // textarea（换行被抹掉="换不到"；晚一步覆盖="换到了又跳回"），且绕过
  // 官方 beforeinput 编辑跟踪与 Safari 布局修复。实际只需 stopPropagation：
  // 官方的 Enter→submit 挂在 React root 的 keydown 上，document capture
  // 断传播即收不到、不会发送；不 preventDefault 则 WebKit 原生插入换行，
  // beforeinput/input/onChange/mirror 全走原生节奏零竞争。
  event.stopPropagation()
}

```

</details>

**依据 3 · 源码核查**：[src/run-send.tsx:27-59](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/run-send.tsx#L27-L59)

运行中按钮读取原生状态与busyEnter，选择queue/steer。

<details>
<summary>查看原文（33行）</summary>

```text

export function RunSendButton({
  useSession, useInput, submitMode, useBusyEnter,
}: RunSendButtonProps): ReactNode {
  const running = useSession((snapshot) => {
    const s = snapshot as { running?: boolean } | null | undefined
    return s?.running === true
  })
  const draft = useInput((snapshot) => {
    const s = snapshot as { draft?: string } | null | undefined
    return s?.draft ?? ''
  })
  const busyEnter = useBusyEnter()
  // steering 可用性用 useSession standardProp 内部推导（对齐官方：非子代理会话才可 steer）。
  const steeringAvailable = useSession((snapshot) => {
    const s = snapshot as { subagent?: unknown } | null | undefined
    return s?.subagent === null || s?.subagent === undefined
  })
  // disabled 只由空草稿驱动，真正不可点。
  const disabled = draft.trim() === ''

  const dispatchRunEnter = (): void => {
    // 运行＝按 busyEnter 设置，steering 不可用（子代理等）时退化为 queue，与官方 ComposerSubmissionPolicy.resolve 对齐；
    // 非运行瞬间（回合刚结束）＝普通发送（官方 resolve 亦退化为 queue）。
    const mode: RunSendMode = running && steeringAvailable ? (busyEnter ?? 'queue') : 'queue'
    submitMode(mode)
  }

  // 空闲不渲染（hooks 已全部调用完，条件 return 在末尾）：只有官方主按钮变
  // 停止的运行期，第二个箭头才出现——平时与官方按钮并列两个箭头太丑。
  if (!running) return null

  return (
```

</details>

**依据 4 · 源码核查**：[src/index.ts:120-146](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/index.ts#L120-L146)

Host实际安装通知与可选代理，反驳绝对纯客户端理解。

<details>
<summary>查看原文（27行）</summary>

```text
export function apply(ctx: any, config?: Config): void {
  // cordis 严格模式：ctx.<service> 属性必须经 inject 声明；可选服务用
  // ctx.get(name) 读全局 store（未注册返回 undefined → 对应能力降级）。
  // rc.6 include 装配下 ctx.get 不命中未声明服务（实测 404）→ 先试
  // 属性访问（inject 已声明），再回退 ctx.get；两版 cordis 都兼容。
  let webServer: WebServerFace | undefined
  try { webServer = ctx.webServer as WebServerFace | undefined } catch { webServer = undefined }
  if (webServer === undefined && typeof ctx.get === 'function') {
    try { webServer = ctx.get('webServer') as WebServerFace | undefined } catch { webServer = undefined }
  }
  const sessions = typeof ctx.get === 'function' ? ctx.get('sessions') : undefined
  // 通知模块（需求 15）：长任务完成队列 + PWA 资源 + Web Push 推送器。
  const notify = installNotifyHost(ctx, config)
  // 压缩代理（config.proxy.enabled，默认关闭）：手机访问加速，零本体改动。
  // targetPort 自动从 dsh --port 解析；随插件 fiber 销毁（热重载/卸载即停）。
  // 版本自适应 if 框架：先按旧版行为同步启动 gzip 模式（旧版 dsh 路径与
  // 历史完全一致），随后异步探测官方 gzip（dsh 0.1.2+ webserver 内置）——
  // 探测到即 setMode('passthrough') 切纯透传（同一 server，零断流），
  // tailscale serve 指向无需变动；探测不到保持 gzip 模式（保守回退）。
  // 探测路径本身跨版本存活（见 compress-proxy.ts 的 GZIP_PROBE_PATHS）。
  const proxyCfg = config?.proxy
  if (proxyCfg?.enabled === true) {
    const targetPort = proxyCfg.targetPort ?? resolveTargetPort()
    const { server, setMode } = startCompressProxy({
      port: proxyCfg.port ?? 8444,
      targetPort,
    })
```

</details>

**依据 5 · 源码核查**：[src/notify-host.ts:362-418](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/notify-host.ts#L362-L418)

当前Host会读取或生成VAPID并保存订阅状态。

<details>
<summary>查看原文（57行）</summary>

```text
  let vapidPublicKey: string | undefined = config?.vapidPublicKey
  let vapidPrivateKey: string | undefined = config?.vapidPrivateKey
  let pushReady: Promise<boolean> | undefined
  const ensurePush = (): Promise<boolean> => {
    pushReady ??= (async () => {
      try {
        const imported = await import('web-push') as { default?: WebPushMod } & WebPushMod
        const mod = imported.default ?? imported
        if (vapidPublicKey === undefined || vapidPrivateKey === undefined) {
          const dir = dataDir()
          const file = join(dir, 'vapid.json')
          if (existsSync(file)) {
            const saved = JSON.parse(readFileSync(file, 'utf8')) as { publicKey?: string; privateKey?: string }
            vapidPublicKey = saved.publicKey
            vapidPrivateKey = saved.privateKey
          }
        }
        if (vapidPublicKey === undefined || vapidPrivateKey === undefined) {
          const keys = mod.generateVAPIDKeys()
          vapidPublicKey = keys.publicKey
          vapidPrivateKey = keys.privateKey
          mkdirSync(dataDir(), { recursive: true })
          writeFileSync(join(dataDir(), 'vapid.json'), JSON.stringify(keys, null, 2), 'utf8')
        }
        // subject 不能是 localhost——Apple APNs 明确拒绝 localhost subject
        // （web-push 会 warn "will result in a BadJwtToken error"，实测 403
        // BadJwtToken）。用仓库 URL 作合法 subject（2026-08-20 实测修复）。
        mod.setVapidDetails('https://github.com/Phant0Meow/dsh-meow-smooth', vapidPublicKey, vapidPrivateKey)
        pushMod = mod
        return true
      } catch (error) {
        console.warn(`[meow-smooth] web push unavailable: ${String(error).slice(0, 160)}`)
        return false
      }
    })()
    return pushReady
  }
  const pushEnabled = (): boolean => pushMod !== undefined

  // --- 订阅持久化（文件 JSON 数组，按 endpoint 去重） ---
  const subscriptionsFile = join(dataDir(), 'subscriptions.json')
  let subscriptions: { endpoint: string; keys?: { p256dh?: string; auth?: string }; expirationTime?: number | null }[] = []
  /** 客户端诊断上报队列（iOS 真机无 console：client 权限链路状态 POST 到
   *  /diag-log，服务器侧 GET /diag 查看；上限 100 条防泄漏）。 */
  const diagLog: { at: number; msg: string }[] = []
  try {
    if (existsSync(subscriptionsFile)) {
      const parsed = JSON.parse(readFileSync(subscriptionsFile, 'utf8'))
      if (Array.isArray(parsed)) subscriptions = parsed.slice(0, SUBSCRIPTIONS_CAP)
    }
  } catch {
    subscriptions = []
  }
  const saveSubscriptions = (): void => {
    try {
      mkdirSync(dataDir(), { recursive: true })
      writeFileSync(subscriptionsFile, JSON.stringify(subscriptions.slice(0, SUBSCRIPTIONS_CAP), null, 2), 'utf8')
```

</details>

#### 缺口

- 没有同设备同任务的原生UI/插件可用性与总耗时对照。
  **影响**：不能声称更顺滑、更快或显著减少误操作。
  **进一步探讨**：在目标手机上比较草稿编辑、切会话、审批及退出操作的完成率、错误和人工时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 移动输入、手势和运行中发送如何实际接到宿主状态？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

这是原生DSH插件的Host/Client组合。package根入口与client导出分别指向lib/index.js、lib/client.js，bundle patch插入meow-smooth；构建器将两个TS入口打包，Client包装成宿主ModuleLoader.load并复用shell的React单例，Host把web-push留作运行时外部依赖。不能把源码目录直接存在解释为已加载。

Client apply先调用window上的旧实例dispose，随后检查UI关闭参数及slots/layout服务，再注入CSS与文档级输入监听。粗指针的普通Enter只stopPropagation，不preventDefault，IME选词及修饰键放行；这保留浏览器与编辑器原有换行管线，而非手工改草稿DOM。运行中按钮通过standard props读取running/draft/subagent，空草稿禁用，支持steer时使用busyEnter否则queue；slot注入把submitMode接到conversation.input.for(actx).submit(mode)。若会话或conversation服务缺失会显示按钮但降级为no-op并告警，所以看到按钮不证明提交成功。

侧栏由粗指针、热区和方向阈值识别，选区存在时放行；松手后根据位移切原生窄档/宽档或收起。浏览器抢走的返回手势走history哨兵与popstate，再转成侧栏开合，而不是离开页面。通知Client通过sessions.open跳回会话，Host /pending投影供轮询；客户端每三秒查询并在重新可见时补查。依赖的是宿主布局、会话、conversation和DOM结构，宿主更新或同类插件改DOM均可能改变行为，不能从零源码改动推断无耦合。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:18-44](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/package.json#L18-L44)

实际Host/Client导出及bundle声明。

<details>
<summary>查看原文（27行）</summary>

```text
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/index.js",
    "lib/index.js.map",
    "lib/client.js",
    "lib/client.js.map",
    "cordis.patch.yml",
    "scripts/feishu-relay.mjs",
    "scripts/feishu-relay.config.example.json",
    "assets/icon-180.png",
    "assets/icon-512.png"
  ],
  "license": "MIT",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-9](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/cordis.patch.yml#L1-L9)

bundle插入运行入口。

```text
# meow-smooth bundle patch: inserts this plugin into a profile's layer stack.
# Applied when a profile lists this bundle (or copied by hand for manual
# installs). Rows reference the package by name so Node resolution finds the
# installed code.
- insert:
    - id: meow-smooth
      name: 'meow-smooth'
      config:
        enabled: true
```

**依据 3 · 源码核查**：[build.mjs:26-64](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/build.mjs#L26-L64)

Host与Client的构建目标、React单例和web-push外部化。

<details>
<summary>查看原文（39行）</summary>

```text
const hostOptions = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  nodePaths,
  // web-push 是 CJS（内部 require('crypto')）：bundle 进 ESM 会产出动态
  // require 崩溃（实测）。保持 external，运行时由 Node 的 ESM-CJS
  // interop 从插件 node_modules 加载（package.json dependencies 声明）。
  external: ['web-push'],
  outfile: 'lib/index.js',
  sourcemap: true,
  logLevel: 'info',
};

const clientOptions = {
  entryPoints: ['src/client.ts'],
  bundle: true,
  platform: 'browser',
  format: 'cjs',
  target: 'es2022',
  nodePaths,
  // run-send.tsx 含 JSX；显式给 .tsx 指定 JSX loader。
  loader: { '.tsx': 'tsx' },
  outfile: 'lib/client.js',
  // react 走 shell 单例（ModuleLoader 的 require 解析到 seed 里的 react），
  // 不能打进 bundle——否则双 React 实例会崩掉 slots 渲染。
  external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
  banner: {
    js: [
      'window.__ModuleLoader__.load({',
      '  id: "meow-smooth",',
      '  factory: (require) => {',
      '    var module = { exports: {} };',
      '    var exports = module.exports;',
    ].join('\n'),
  },
  footer: {
```

</details>

**依据 4 · 源码核查**：[src/client.ts:2450-2490](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/client.ts#L2450-L2490)

单实例拆除、UI开关和依赖前置检查。

<details>
<summary>查看原文（41行）</summary>

```text
  // 新实例是全新状态，两边的 syncSidebarFurl 轮询互踢 furl 标记，边栏陷入
  // "展开到细条⇄收到 0"的永动循环。与手势模块 __meowSmoothGestureDispose
  // 同款协议：新实例入口先拆旧实例全部运行期资源，再安装自己。
  const w = window as unknown as Record<string, unknown>
  ;(w.__meowSmoothClientDispose as (() => void) | undefined)?.()
  // 降级看门狗（放在一切早退之前）：无论 apply 走到哪个结局都保持运行，
  // bug 态（孤儿 FAB + 样式表丢失）在页面最底一行以纯文本现形。
  installBugWatch()
  /** 本实例登记的拆除函数清单（安装完成后打包挂 window）。 */
  const disposers: Array<() => void> = []
  // UI 注入开关（2026-08-20 为"录优化前原生界面素材"加，轻量 URL 方案）：
  // URL 带 ?meow-smooth-ui=off 时跳过全部 UI 注入（CSS/锁缩放/设置改造/事件
  // 委托/横幅/通知 client 桥），界面完全原生；host 侧压缩代理/审计投影/pending
  // 路由不受影响（手机 HTTPS 入口仍由 8445 代理提供服务，无需重启 3080）。
  // 录原生素材：手机访问 https://<tailscale 域名>/?meow-smooth-ui=off
  // 恢复优化版：去掉 query 刷新即可。（上方入口拆除已先于本 return 执行：
  // ui=off 的执行同样接管清理责任，旧实例不会残留。）
  if (new URLSearchParams(window.location.search).get('meow-smooth-ui') === 'off') {
    console.log('[meow-smooth] UI injection OFF (meow-smooth-ui=off) — native UI only')
    document.documentElement.dataset.meowApplyStage = 'exit:ui-off'
    applyLogPush(`#${applyN} exit:ui-off`)
    return
  }
  // 服务可用性前置检查（原在监听器安装之后）：缺失时不留下"半安装"状态
  // ——要么完整安装（拆除函数挂 window），要么什么都不装。
  const slots = ctx?.slots
  if (slots === undefined || typeof slots.inject !== 'function') {
    console.warn('[meow-smooth] slots service unavailable; sidebar auto-collapse disabled')
    document.documentElement.dataset.meowApplyStage = 'exit:no-slots'
    applyLogPush(`#${applyN} exit:no-slots`)
    return
  }
  const layout = ctx?.layout as ILayout | undefined
  if (layout === undefined || typeof layout.toggleSidebar !== 'function') {
    console.warn('[meow-smooth] layout service unavailable; sidebar auto-collapse disabled')
    document.documentElement.dataset.meowApplyStage = 'exit:no-layout'
    applyLogPush(`#${applyN} exit:no-layout`)
    return
  }
  // CSS 常驻全局（折叠由 data 属性驱动，规则在即生效）。先移除上一份同
  // 标记样式（双实例时期每次热替换都追加一份，无限堆积）。
```

</details>

**依据 5 · 源码核查**：[src/client.ts:1452-1477](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/client.ts#L1452-L1477)

Enter/IME和粗指针条件。

<details>
<summary>查看原文（26行）</summary>

```text
/** 触屏 Enter → 换行：capture 阶段只断官方发送路径（stopPropagation，
 *  React root 收不到 keydown → 官方 submit 不触发），默认行为留给浏览器
 *  原生插入换行（v5.3 重写，详见函数内注释）。
 *  Shift/Ctrl/Alt/Meta+Enter、IME 选词（isComposing/keyCode 229）放行。 */
function onKeyDownCapture(event: KeyboardEvent): void {
  if (event.key !== 'Enter' || event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) return
  if (event.isComposing || event.keyCode === 229) return
  // 输入区判定见 composerEditableOf：新版是 Lexical contenteditable。
  // 这里只 stopPropagation、不 preventDefault——浏览器原生换行会被 Lexical 的
  // beforeinput 路径接住（insertParagraph → INSERT_PARAGRAPH_COMMAND →
  // selection.insertLineBreak()），且不会触发挂在 KEY_ENTER_COMMAND 上的提交。
  if (composerEditableOf(event.target) === null) return
  if (!isCoarsePointer()) return
  noteFold('keyEnter', true)
  // 只断官方发送路径，把换行还给浏览器（2026-08-25 v5.3 重写，修"换行
  // 丢失/跳回"）：旧实现 preventDefault + 手动改 DOM value + setSelectionRange
  // + 派发合成 InputEvent——与本体受控层（textarea value={draft}）产生
  // DOM/state 不一致窗口，commit 前任何其他重渲染都会用旧 draft 写回
  // textarea（换行被抹掉="换不到"；晚一步覆盖="换到了又跳回"），且绕过
  // 官方 beforeinput 编辑跟踪与 Safari 布局修复。实际只需 stopPropagation：
  // 官方的 Enter→submit 挂在 React root 的 keydown 上，document capture
  // 断传播即收不到、不会发送；不 preventDefault 则 WebKit 原生插入换行，
  // beforeinput/input/onChange/mirror 全走原生节奏零竞争。
  event.stopPropagation()
}

```

</details>

**依据 6 · 源码核查**：[src/run-send.tsx:27-65](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/run-send.tsx#L27-L65)

运行状态、空草稿和queue/steer选择。

<details>
<summary>查看原文（39行）</summary>

```text

export function RunSendButton({
  useSession, useInput, submitMode, useBusyEnter,
}: RunSendButtonProps): ReactNode {
  const running = useSession((snapshot) => {
    const s = snapshot as { running?: boolean } | null | undefined
    return s?.running === true
  })
  const draft = useInput((snapshot) => {
    const s = snapshot as { draft?: string } | null | undefined
    return s?.draft ?? ''
  })
  const busyEnter = useBusyEnter()
  // steering 可用性用 useSession standardProp 内部推导（对齐官方：非子代理会话才可 steer）。
  const steeringAvailable = useSession((snapshot) => {
    const s = snapshot as { subagent?: unknown } | null | undefined
    return s?.subagent === null || s?.subagent === undefined
  })
  // disabled 只由空草稿驱动，真正不可点。
  const disabled = draft.trim() === ''

  const dispatchRunEnter = (): void => {
    // 运行＝按 busyEnter 设置，steering 不可用（子代理等）时退化为 queue，与官方 ComposerSubmissionPolicy.resolve 对齐；
    // 非运行瞬间（回合刚结束）＝普通发送（官方 resolve 亦退化为 queue）。
    const mode: RunSendMode = running && steeringAvailable ? (busyEnter ?? 'queue') : 'queue'
    submitMode(mode)
  }

  // 空闲不渲染（hooks 已全部调用完，条件 return 在末尾）：只有官方主按钮变
  // 停止的运行期，第二个箭头才出现——平时与官方按钮并列两个箭头太丑。
  if (!running) return null

  return (
    <button
      type="button"
      data-meow-run-send
      data-disabled={disabled || undefined}
      title="插话或排队发送"
      aria-label="插话或排队发送"
```

</details>

**依据 7 · 源码核查**：[src/client.ts:2731-2754](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/client.ts#L2731-L2754)

slot调用实际会话submit，缺服务静默no-op。

<details>
<summary>查看原文（24行）</summary>

```text
    name: 'conversation.input.right',
    id: 'meow-smooth-run-send',
    order: 999,
    inject: (sessionId: SessionId): {
      submitMode: (mode: RunSendMode) => void
      useBusyEnter: () => RunSendMode | undefined
    } => {
      // 服务缺失时降级为 no-op 提交而非抛错：inject 抛错会让 slot entry 崩溃（渲染边界吞掉并弃用该条目），按钮直接消失。
      // 与 QueueDock 同构取 actx→conversation，但此处会话/服务偶发缺失不应让整个按钮消失，改为静默降级并告警。
      const actx = ctx.sessions.scope(sessionId)
      const conversation = actx?.get('conversation')
      if (actx === undefined || conversation === undefined) {
        console.warn(`[meow-smooth] run-send inject degraded for session "${sessionId}" (actx=${actx !== undefined}, conversation=${conversation !== undefined})`)
        return {
          submitMode: () => {},
          useBusyEnter,
        }
      }
      return {
        submitMode: (mode: RunSendMode) => { conversation.input.for(actx).submit(mode) },
        useBusyEnter,
      }
    },
  }, RunSendButton))
```

</details>

**依据 8 · 源码核查**：[src/sidebar-gesture.ts:253-321](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/sidebar-gesture.ts#L253-L321)

触摸方向、选区及松手动作实际分派。

<details>
<summary>查看原文（69行）</summary>

```text
  // --- 方向判定（touchmove capture，非 passive 才能拦历史导航手势）---
  const onTouchMove = (event: TouchEvent): void => {
    if (phase !== 'pending' || event.touches.length !== 1) return
    // 文本选区在场 → 可能是选区手柄拖动（PWA 里 cancelable=true，一旦
    // committed+preventDefault 手柄就冻结拖不动）：回 idle 放行原生行为，
    // 本序列不再参与识别。2026-08-25 选区手柄 bug 修复的一部分。
    const sel = document.getSelection()
    if (sel !== null && sel.type === 'Range') {
      phase = 'idle'
      return
    }
    const touch = event.touches[0]
    const dx = touch.clientX - sx
    const dy = touch.clientY - sy
    if (Math.abs(dx) >= SWIPE_MIN && Math.abs(dx) > Math.abs(dy) * AXIS_RATIO) {
      // 横向主导滑动确认 → 进入 committed（后续 preventDefault 阻断浏览器
      // 边缘历史导航；识别期零 DOM 写入，无任何性能负担）。
      phase = 'committed'
      note(`committed dx=${Math.round(dx)} zone=${startZone}`)
      if (event.cancelable) event.preventDefault()
    } else if (Math.abs(dy) > SWIPE_MIN && Math.abs(dy) > Math.abs(dx)) {
      phase = 'idle' // 纵向主导 → 放行原生滚动
    }
  }

  // --- 松手：按累计位移分派动作 ---
  const onTouchEnd = (event: TouchEvent): void => {
    if (phase !== 'committed') {
      // 轻点外部收起（v6.3，猫猫定稿"点侧边栏外面一律收回"）：pending 态
      // 原地松手 = tap。起手在"侧边栏外部的窗口区"（startZone=window，仅
      // 侧边栏在场时会置）且位移/时长都是 tap 量级 → 收起到 0 档。
      //
      // 为什么必须走 touch 而不能只靠 client.ts 的 click 收起：第三方插件
      // 常在自家表面的 touchstart 上 preventDefault（femo 剧本画布为掐灭
      // 安卓长按选字即如此）——浏览器对被取消的 touch 序列不再派生任何鼠
      // 标事件，click 永远不来，onClickDismissSidebar 对那些表面失明。本
      // 模块的 document 级 touch 监听是 passive 捕获，不受影响，是唯一可
      // 靠通道。与 click 路径的去重：本分支先收到 0 档，随后到达的 click
      // 命中 onClickDismissSidebar 的"collapsed+furled=无事可做"早退。
      // touchcancel（浏览器接管）不算 tap。
      const tap = phase === 'pending' && startZone === 'window' && event.type !== 'touchcancel'
      phase = 'idle'
      if (tap) {
        const touch = event.changedTouches[0]
        const dx = (touch?.clientX ?? sx) - sx
        const dy = (touch?.clientY ?? sy) - sy
        if (Math.hypot(dx, dy) <= TAP_SLOP && performance.now() - sT <= TAP_MAX_MS) {
          note(`tap-dismiss dx=${Math.round(dx)} dy=${Math.round(dy)} ms=${Math.round(performance.now() - sT)}`)
          collapseToZero()
        }
      }
      return
    }
    phase = 'idle'
    const touch = event.changedTouches[0]
    const dx = (touch?.clientX ?? sx) - sx
    if (Math.abs(dx) < SWIPE_MIN) return // 位移不足（理论上 committed 已保证）
    note(`swipe dx=${Math.round(dx)} zone=${startZone} furled=${deps.isFurled()} collapsed=${collapsedNow()}`)
    if (dx > 0) {
      // 向右：开细条 / 开宽档（长划跳级；细条在场再划即宽档）。
      if (startZone === 'edge' && deps.isFurled()) {
        if (dx >= LONG_SWIPE) openWide()
        else openNarrow()
      } else if (startZone === 'rail') {
        openWide()
      }
      return
    }
    // 向左：在场即收起到 0（宽档空白处/右侧窗口；细条仅右侧窗口）。
```

</details>

**依据 9 · 源码核查**：[src/back-guard.ts:63-92](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/back-guard.ts#L63-L92)

history哨兵与popstate转成边栏动作。

<details>
<summary>查看原文（30行）</summary>

```text
  const pushSentry = (): void => {
    history.pushState({ [SENTRY_FLAG]: true }, '', location.href)
  }

  // 排障轨迹（环形 16 条）：真机无 console，返回接管分派问题靠
  // window.__meowBackGuardTrace 定位（与手势模块 __meowGestureTrace 同款）。
  const trace: string[] = []
  ;(w).__meowBackGuardTrace = trace
  const note = (msg: string): void => {
    trace.push(`${Date.now() % 100000} ${msg}`)
    if (trace.length > 16) trace.shift()
  }

  /** 一次返回到达：恢复哨兵防护 + 翻译成边栏开关（手势忙时只恢复防护）。 */
  const onPopState = (event: PopStateEvent): void => {
    if (isSentryState(event.state)) return // 落回哨兵：无视觉变化，不动
    pushSentry()
    const g = deps.gesture()
    if (g === undefined) {
      note('back: no-gesture-api')
      return
    }
    if (g.busy()) {
      note('back: gesture-busy')
      return
    }
    const open = g.isOpen()
    note(`back: isOpen=${open} → ${open ? 'close' : 'open'}`)
    if (open) g.collapseToZero()
    else g.open()
```

</details>

**依据 10 · 源码核查**：[src/client.ts:2164-2180](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/client.ts#L2164-L2180)

pending轮询及可见性补查。

<details>
<summary>查看原文（17行）</summary>

```text
function installPendingBanner(
  open: ((sessionId: string) => void) | undefined,
  refresh: (() => Promise<void>) | undefined,
): () => void {
  openSession = open
  refreshSessions = refresh
  void pollHostApprovals()
  const pollTick = window.setInterval(() => { void pollHostApprovals() }, 3000)
  const onVisibility = (): void => {
    if (document.visibilityState === 'visible') void pollHostApprovals()
  }
  document.addEventListener('visibilitychange', onVisibility)
  return (): void => {
    window.clearInterval(pollTick)
    document.removeEventListener('visibilitychange', onVisibility)
  }
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 通知、未决交互恢复及可选压缩代理的真实边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

通知是尽力提醒，不是业务完成或交互可应答证明。Host监听审计流投影pending，并在启动扫描asked未decided和tool/call未result的历史项，恢复项标orphan=true；这只能帮助发现可能遗留的交互，原来的内存RPC可能已不存在，不能重建有效批准/回答。动态pending与订阅等路由使用authGate：新宿主调用connection.requestRejection，旧宿主退回Host/Origin fence，connection缺失拒绝503。代码有接闸，但本轮没有独立验证其与各宿主版本的完整等价。

系统通知要求浏览器能力和权限，页面可见时不弹；后台PWA还需secure context、Service Worker、Push订阅和外部推送服务。Host sendPush的delivered只表示至少一次发送调用无异常，不证明设备展示或用户看见；webhook失败静默。焦点抑制、完成队列十分钟TTL和二十条上限、浏览器本地去重都会改变可见范围，所以不能保证任何时刻每个事件都收到。

更具体的源码限制是turn/end：error被单独记失败后返回；其他reason只要当前计数达到阈值（默认七次工具调用），分支就生成completed和“任务完成”，没有继续筛选正常stop。因而取消或截断的长回合也可能走完成分支，这是条件推导，未在本轮复现；提醒不能当作合格任务验收。

压缩代理默认关闭，开启后仅对接受gzip、尚未编码的POST /api JSON响应压缩，SSE和WebSocket透传，监听loopback并保留Host/Origin头。它减少的候选是传输字节，不是模型计算；70–90%压缩与蜂窝“流畅”是作者声明，无本轮样本、CPU和端到端延迟测量。启用它仍增加同Host进程内的网络组件和排障条件。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:284-332](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/index.ts#L284-L332)

启动恢复的交互标orphan而非恢复可应答RPC。

<details>
<summary>查看原文（49行）</summary>

```text
  // 无重复；孤儿项打 orphan 标记，客户端据此提示"可能已失效"）---
  try {
    if (sessions !== undefined && typeof sessions.list === 'function') {
      for (const session of sessions.list()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 宿主会话事件结构未输入
        const events: any[] | undefined = sessionEventsOf(session)
        if (!Array.isArray(events)) continue
        const decided = new Set<string>()
        for (const event of events) {
          if (event?.type === 'approval/decided' && typeof event.data?.id === 'string') {
            decided.add(event.data.id)
          }
        }
        for (const event of events) {
          if (event?.type !== 'approval/asked') continue
          const id: unknown = event.data?.id
          if (typeof id !== 'string' || id === '') continue
          if (decided.has(id) || pending.has(id)) continue
          const callId: unknown = event.data?.callId
          pending.set(id, {
            sessionId: session.id,
            approvalId: id,
            toolName: typeof event.data?.toolName === 'string' ? event.data.toolName : '',
            ...(typeof callId === 'string' ? { callId } : {}),
            askedAt: Date.now(),
            orphan: true,
          })
        }
        // 提问孤儿恢复：tool/call(ask_user_question) 无配对 tool/result。
        const decidedCalls = new Set<string>()
        for (const event of events) {
          const resultCallId: unknown = event?.data?.message?.source?.callId
          if (event?.type === 'tool/result' && typeof resultCallId === 'string') {
            decidedCalls.add(resultCallId)
          }
        }
        for (const event of events) {
          if (event?.type !== 'tool/call' || event.data?.name !== 'ask_user_question') continue
          const callId: unknown = event.data?.callId
          if (typeof callId !== 'string' || callId === '') continue
          if (decidedCalls.has(callId) || pendingQuestions.has(callId)) continue
          pendingQuestions.set(callId, {
            sessionId: session.id,
            callId,
            askedAt: Date.now(),
            planReview: planReviewOf(event.data?.arguments),
            orphan: true,
            ...(sessionTitleOf(session) !== '' ? { title: sessionTitleOf(session) } : {}),
          })
```

</details>

**依据 2 · 源码核查**：[src/index.ts:365-380](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/index.ts#L365-L380)

pending实际包装authGate。

<details>
<summary>查看原文（16行）</summary>

```text
  if (webServer !== undefined && typeof webServer.register === 'function') {
    // 鉴权闸（2026-09-13 安全修复）：/pending 暴露未决审批细节（含命令
    // 文本），必须与官方 /api 同闸（connection.requestRejection）。
    const connection = connectionAuthOf(ctx)
    const dispose = webServer.register({
      kind: 'exact',
      path: '/plugins/meow-smooth/pending',
      handler: authGate(connection, (req: unknown, res: { writeHead: (code: number, headers: Record<string, string>) => void; end: (body?: string) => void }) => {
        try {
          // 页面聚焦上报（x-meow-focus 头：1=页面聚焦）：任一页面聚焦时
          // host 抑制 Web Push 系统通知（卡片气泡负责提醒）。
          const headers = (req as { headers?: Record<string, string | undefined> })?.headers
          const focus = headers?.['x-meow-focus']
          if (focus === '1' || focus === '0') {
            notify.noteFocus(headers?.['host'], focus === '1')
          }
```

</details>

**依据 3 · 源码核查**：[src/auth-gate.ts:118-155](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/auth-gate.ts#L118-L155)

现代鉴权、旧Host fence与缺服务拒绝。

<details>
<summary>查看原文（38行）</summary>

```text
 * - connection 整个缺失：保守拒绝（503）。
 *
 * 泛型 R 透传各路由 handler 自己声明的 res 类型（writeHead 的 headers
 * 参数可可选可必选，各处不一；闸身只用字面量调用，兼容两种形态）。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function authGate<R extends { writeHead: (...args: any[]) => void; end: (...args: any[]) => void }>(
  connection: ConnectionAuthFace | undefined,
  handler: (req: unknown, res: R) => void,
): (req: unknown, res: R) => void {
  return (req, res) => {
    const reject = connection?.requestRejection
    if (typeof reject === 'function') {
      const rejection = reject.call(connection, req)
      if (rejection !== undefined) {
        res.writeHead(rejection, { 'content-type': 'text/plain; charset=utf-8' })
        res.end(rejection === 401 ? 'unauthorized' : 'forbidden')
        return
      }
      handler(req, res)
      return
    }
    // 旧版宿主（≤0.1.2）：connection 存在但没有 requestRejection →
    // 复刻旧版官方 /api 的 Host fence；trustedHosts 缺省为空（等价于
    // 官方默认 config.trustedHosts = []，loopback 永远放行）。
    if (connection !== undefined) {
      if (!legacyHostFence(req, connection.trustedHosts ?? [])) {
        res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' })
        res.end('forbidden')
        return
      }
      handler(req, res)
      return
    }
    res.writeHead(503, { 'content-type': 'text/plain; charset=utf-8' })
    res.end('meow-smooth: authentication service unavailable')
  }
}
```

</details>

**依据 4 · 源码核查**：[src/notify-client.ts:102-129](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/notify-client.ts#L102-L129)

浏览器权限与页面hidden才尝试系统通知。

<details>
<summary>查看原文（28行）</summary>

```text
 * @returns 通知模块句柄。
 */
export function installNotifyClient(deps: NotifyClientDeps): NotifyClientHandle {
  const openSession = deps.openSession
  // 已通知的 pending id（pending 消失即移除 → 重新出现可再通知）。
  let lastPendingIds = new Set<string>()

  /** 弹一条系统通知（页面 hidden + 权限 granted 才弹）。 */
  const notify = (
    title: string,
    body: string,
    tag: string,
    sessionId?: string,
  ): void => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
    if (!document.hidden) return
    try {
      const n = new Notification(title, { body, tag, icon: ICON_URL })
      n.onclick = () => {
        window.focus()
        if (sessionId !== undefined) openSession?.(sessionId)
        n.close()
      }
    } catch {
      // 通知被系统拒绝/受限：静默（横幅仍在）。
    }
  }

```

</details>

**依据 5 · 源码核查**：[src/notify-client.ts:160-192](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/notify-client.ts#L160-L192)

secure Push路径注册SW并上报订阅。

<details>
<summary>查看原文（33行）</summary>

```text
    if (!pushSupported || Notification.permission !== 'granted') {
      reportDiag(`sub-skip perm=${typeof Notification === 'undefined' ? 'no-Notification' : Notification.permission}`)
      return
    }
    if (subscribeRetries >= MAX_SUBSCRIBE_RETRIES) return
    subscribeRetries += 1
    try {
      const registration = await navigator.serviceWorker.register('/plugins/meow-smooth/sw.js', { scope: '/' })
      const existing = await registration.pushManager.getSubscription()
      const subscription = existing ?? await (async () => {
        const res = await fetch('/plugins/meow-smooth/push-config', { cache: 'no-store' })
        if (!res.ok) { reportDiag('sub-config-http-err'); return null }
        const data = await res.json() as { enabled?: boolean; publicKey?: string }
        if (data.enabled !== true || typeof data.publicKey !== 'string') {
          reportDiag(`sub-config-bad enabled=${data.enabled} key=${typeof data.publicKey}`)
          return null
        }
        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(data.publicKey) as Uint8Array<ArrayBuffer>,
        })
      })()
      if (subscription !== null) {
        await fetch('/plugins/meow-smooth/push-subscribe', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(subscription.toJSON()),
        })
        reportDiag(existing !== null ? 'sub-existed-report-ok' : 'sub-subscribed-report-ok')
        subscribeRetries = MAX_SUBSCRIBE_RETRIES // 上报成功即停
      } else {
        reportDiag('sub-null (no subscription produced)')
      }
```

</details>

**依据 6 · 源码核查**：[src/notify-host.ts:443-477](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/notify-host.ts#L443-L477)

推送发送结果与webhook兜底，不是设备展示回执。

<details>
<summary>查看原文（35行）</summary>

```text
  }

  /** 向全部订阅推送一条通知（payload 加密；404/410 清失效订阅）。
   *  @returns 是否至少一个订阅送达（true=有订阅且发送无异常；false=
   *  无订阅或全部失败——调用方据此决定 webhook 兜底）。 */
  const sendPush = async (payload: PushPayload): Promise<boolean> => {
    if (!(await ensurePush()) || subscriptions.length === 0) return false
    let delivered = false
    const body = JSON.stringify(payload)
    for (const sub of subscriptions) {
      try {
        await pushMod!.sendNotification(sub as never, body, { TTL: 3600 })
        delivered = true
      } catch (error) {
        const status = (error as { statusCode?: number })?.statusCode
        if (status === 404 || status === 410) {
          subscriptions = subscriptions.filter(item => item.endpoint !== sub.endpoint)
          saveSubscriptions()
        } else {
          console.warn(`[meow-smooth] push failed (${status ?? 'unknown'}): ${String(error).slice(0, 160)}`)
        }
      }
    }
    return delivered
  }

  /** 发送决策：任一 DSH 页面聚焦（用户在看着）→ 不推 Web Push 也不发
   *  webhook（卡片气泡负责提醒，避免打扰）；无聚焦页面 → Web Push 优先。
   *  webhook 再按 webhookMode 决定：'fallback' 仅在无订阅或全部失败时发
   *  （Bark 兜底），'always' 每次都发（与桌面推送并行的第二通道）。 */
  const deliver = async (payload: PushPayload): Promise<void> => {
    if (anyFocusedRecently()) return
    const delivered = await sendPush(payload)
    if (!delivered || webhookMode === 'always') sendWebhook(payload)
  }
```

</details>

**依据 7 · 源码核查**：[src/notify-host.ts:479-499](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/notify-host.ts#L479-L499)

webhook通道失败静默。

<details>
<summary>查看原文（21行）</summary>

```text
  /** 通用 webhook 通道（Bark 等）：POST { title, body, group, icon?, url?,
   *  kind, sessionId }；未配置或失败静默。group 供 Bark 通知分组折叠；
   *  icon/url 由 webhookIconUrl/webhookAppUrl 配置（Bark 支持通知图标与
   *  点击跳转）。 */
  const webhookMode = config?.webhookMode ?? 'fallback'
  const webhookUrl = config?.webhookUrl
  const webhookIconUrl = config?.webhookIconUrl
  const webhookAppUrl = config?.webhookAppUrl
  const sendWebhook = (payload: PushPayload): void => {
    if (typeof webhookUrl !== 'string' || webhookUrl === '') return
    try {
      const body: Record<string, unknown> = { ...payload, group: 'dsh' }
      if (typeof webhookIconUrl === 'string' && webhookIconUrl !== '') body.icon = webhookIconUrl
      if (typeof webhookAppUrl === 'string' && webhookAppUrl !== '') body.url = webhookAppUrl
      void fetch(webhookUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      }).catch(() => { /* webhook 失败静默 */ })
    } catch {
      // webhook 失败静默
```

</details>

**依据 8 · 源码核查**：[src/notify-host.ts:568-635](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/notify-host.ts#L568-L635)

非error结束分支达到工具数阈值就生成completed，未继续区分结束原因。

<details>
<summary>查看原文（68行）</summary>

```text
              // 2026-08-20 修双弹——此前 q:<sessionId>:<callId> 与页面内
              // 通知 tag 不同，同一提问 SW 与页面内各弹一条不合并。
              tag: `q:${sessionId}:question`,
              sessionId,
            }
            pushOnce(`q:${sessionId}:${callId}`, () => { void deliver(payload) })
          }
          return
        }
        if (event?.type === 'turn/end') {
          // 运行失败通知（2026-08-22）：reason.kind=error 是 dsh 语义下的
          // 最终失败（重试耗尽/不可重试；单步内自动重试不关回合）。判定
          // 必须在 turnCalls 查找之前——插件热重载/中途装配后没有该回合
          // 的计数，失败照样要通知。aborted/blocked/max-tokens/interrupted
          // （用户取消/暂停/截断/崩溃修复标记）不算失败，不通知。
          const reason = data?.reason as
            | { kind?: unknown; error?: { message?: unknown; code?: unknown } }
            | undefined
          if (reason?.kind === 'error') {
            const turn = typeof data?.turn === 'number' ? data.turn : 0
            const rawMessage = typeof reason.error?.message === 'string' ? reason.error.message : ''
            const code = typeof reason.error?.code === 'string' ? reason.error.code : ''
            const title = sessionTitle(sessionId)
            const item: CompletionEvent = {
              id: `${sessionId}:${turn}:error`,
              sessionId,
              toolCalls: 0,
              at: Date.now(),
              kind: 'failed',
              ...(rawMessage !== ''
                ? { message: rawMessage.length > 120 ? `${rawMessage.slice(0, 120)}…` : rawMessage }
                : {}),
              ...(code !== '' ? { code } : {}),
              ...(title !== '' ? { title } : {}),
            }
            completions.push(item)
            if (completions.length > EVENTS_CAP) completions.shift()
            const payload: PushPayload = {
              kind: 'failed',
              title: title === '' ? '未命名会话' : title,
              body: item.message !== undefined ? `运行失败：${item.message}` : 'AI 回合因错误中断，点击查看…',
              tag: `f:${item.id}`,
              sessionId,
            }
            pushOnce(`f:${item.id}`, () => { void deliver(payload) })
            return
          }
          const current = turnCalls.get(sessionId)
          if (current === undefined) return
          turnCalls.delete(sessionId)
          if (current.calls < threshold) return
          const item: CompletionEvent = {
            id: `${sessionId}:${current.turn}`,
            sessionId,
            toolCalls: current.calls,
            at: Date.now(),
          }
          completions.push(item)
          if (completions.length > EVENTS_CAP) completions.shift()
          const title = sessionTitle(sessionId)
          const payload: PushPayload = {
            kind: 'completed',
            title: title === '' ? '未命名会话' : title,
            body: `任务完成（${current.calls} 次工具调用），点击查看…`,
            tag: `c:${item.id}`,
            sessionId,
          }
          pushOnce(`c:${item.id}`, () => { void deliver(payload) })
```

</details>

**依据 9 · 源码核查**：[src/notify-host.ts:107-109](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/notify-host.ts#L107-L109)

完成队列TTL和cap。

```text
const EVENTS_TTL_MS = 10 * 60_000
const EVENTS_CAP = 20
const SUBSCRIPTIONS_CAP = 64
```

**依据 10 · 源码核查**：[src/compress-proxy.ts:61-103](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/compress-proxy.ts#L61-L103)

只对特定JSON响应压缩并避免重复编码。

<details>
<summary>查看原文（43行）</summary>

```text
  setMode: (mode: CompressProxyMode) => void
} {
  const { port, targetPort } = options
  let mode: CompressProxyMode = options.mode ?? 'gzip'
  const server = http.createServer((req, res) => {
    const upstream = http.request(
      {
        host: '127.0.0.1',
        port: targetPort,
        path: req.url,
        method: req.method,
        // Host/Origin/Accept-Encoding 等全部原样透传：信任围栏按原 Host 校验，
        // 手机域名（node.tailxxxx.ts.net:8443）在 trusted-host 白名单内放行。
        headers: { ...req.headers },
      },
      (up) => {
        const contentType = up.headers['content-type'] ?? ''
        const wantsGzip = (req.headers['accept-encoding'] ?? '').includes('gzip')
        const isUnaryJson = req.method === 'POST'
          && (req.url ?? '').startsWith('/api/')
          && contentType.includes('application/json')
        // 防双重压缩：上游已带 content-encoding（dsh 0.1.2+ 官方 gzip）
        // 时无论 mode 一律透传——再压一层浏览器解开后是内层 gzip 字节流。
        const upstreamEncoded = up.headers['content-encoding'] !== undefined
        if (mode === 'gzip' && isUnaryJson && wantsGzip && !upstreamEncoded) {
          const headers = { ...up.headers }
          delete headers['content-length']
          res.writeHead(up.statusCode ?? 200, { ...headers, 'content-encoding': 'gzip', 'vary': 'accept-encoding' })
          up.pipe(zlib.createGzip()).pipe(res)
        } else {
          res.writeHead(up.statusCode ?? 200, up.headers)
          up.pipe(res)
        }
      },
    )
    upstream.on('error', (error) => {
      // headersSent 之后再 writeHead 会 throw ERR_HTTP_HEADERS_SENT（响应
      // 中途上游断开时复现，进程级致命）：已开始响应只能掐掉这条连接。
      if (res.headersSent) {
        res.destroy()
        return
      }
      res.writeHead(502, { 'content-type': 'text/plain' })
```

</details>

**依据 11 · 源码核查**：[src/compress-proxy.ts:159-163](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/compress-proxy.ts#L159-L163)

代理仅监听127.0.0.1。

```text
  })

  server.listen(port, '127.0.0.1', () => {
    console.log(`[meow-smooth] compress proxy on 127.0.0.1:${port} -> 127.0.0.1:${targetPort} (mode: ${mode})`)
  })
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 从安装、授权到持续维护和退出的成本是否适合试用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合已经有受控远程DSH入口且能接受移动交互变化的人，以隔离profile和可丢弃会话试用UI。首次按作者说明选择GitHub现场构建或npm制品安装，再重启；package未声明严格宿主peer版本，README主要提到0.1.5，代码又适配新版DOM，不能据此保证任意当前DSH兼容。本轮未联网确认npm制品与固定源码对应。

持续成本包括浏览器/宿主升级和同类UI插件共存检查，通知另需权限、HTTPS/PWA或webhook服务及凭据管理，代理另需端口和反代配置。Host会在DSH_HOME下.meow-smooth保存VAPID与订阅，通知内容可能发给所配置的第三方通道；无费用和吞吐数据，不能因为UI插件而填零成本。首轮只看UI时可以暂不授予系统通知权限、不启代理，再逐项确认需要的通道。

最影响可逆性的已知设计是缩放与导航接管。lockViewport修改或创建viewport meta并锁缩放，键盘/滚轮缩放也被拦；粗指针返回通过history哨兵转为侧栏开关。单实例disposers主要由下一次apply调用window回调拆除，Client结尾未把总回调交给ctx.effect；viewport内容没有保存并恢复，通知dispose移除监听但不取消Push订阅或注销SW，返回guard清理只移除监听。因此热停用不应被理解为页面状态完全回到安装前。移除后需重启Host并刷新页面，按需另行撤浏览器通知/站点数据和确认Host持久状态。

用户应先核对草稿、普通换行/修饰键、运行中queue/steer、切会话及侧栏，再检查通知是否对应真实会话和结束原因。若必须依赖页面缩放/正常返回、出现误发送或无法恢复原生交互，立即停止试用并使用移除后的新页面或原生profile。UI=off刷新可以对照Client效果，但Host通知和路由仍在，不能当整插件禁用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:80-106](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/README.md#L80-L106)

作者安装、重启与兼容说明；不是本轮宿主验收。

<details>
<summary>查看原文（27行）</summary>

````text
**从 GitHub 安装**：源码在 `src/`，`lib/` 不入仓库，安装时 npm 会触发 `prepare` 脚本现场构建，装完即用。

```powershell
dsh plugin --profile web add github:Phant0Meow/dsh-meow-smooth
```

**从 npm 安装**：包内已含构建产物 `lib/index.js` 与 `lib/client.js`，安装时不再构建。

```powershell
dsh plugin --profile web add meow-smooth
```

两种方式装完都会自动挂载，重启 DSH web 后启用，无需手工编辑任何组合文件。

> npm 源 `dsh plugin --profile web add meow-smooth` 自 `0.6.1` 起恢复可用；`0.6.0` 及更早版本的 `package.json` 带 BOM 会解析失败，请避开。GitHub 源始终最新，推荐优先使用。

## 卸载

```powershell
dsh plugin --profile web remove meow-smooth
```

彻底移除，重启 DSH web 后不再加载。

## 兼容性

支持 **dsh 0.1.5**（含最新的 `0.1.5-rc.1`），同时向下兼容旧版本——升级 dsh 不需要改本插件，也不需要改配置，手机端链接（tailscale serve 指向）照旧。
````

</details>

**依据 2 · 源码核查**：[package.json:46-61](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/package.json#L46-L61)

prepare构建与web-push依赖。

<details>
<summary>查看原文（16行）</summary>

```text
  "scripts": {
    "prepare": "node build.mjs",
    "build": "node build.mjs",
    "typecheck": "tsc -p tsconfig.json",
    "watch": "node build.mjs --watch",
    "link-workspace": "powershell -ExecutionPolicy Bypass -File scripts/link-workspace.ps1"
  },
  "dependencies": {
    "web-push": "^3.6.7"
  },
  "devDependencies": {
    "@types/node": "^26.4.0",
    "@types/react": "^19.2.18",
    "esbuild": "^0.25.0",
    "typescript": "^7.0.2"
  }
```

</details>

**依据 3 · 源码核查**：[src/notify-host.ts:113-117](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/notify-host.ts#L113-L117)

Host状态目录明确不只浏览器内存。

```text
function dataDir(): string {
  const home = process.env.DSH_HOME ?? join(homedir(), '.dsh')
  return join(home, '.meow-smooth')
}

```

**依据 4 · 源码核查**：[src/client.ts:1480-1518](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/client.ts#L1480-L1518)

viewport修改与桌面缩放拦截。

<details>
<summary>查看原文（39行）</summary>

```text
function lockViewport(): void {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]')
  const want = 'maximum-scale=1, user-scalable=no'
  if (meta !== null) {
    const content = meta.getAttribute('content') ?? ''
    if (!content.includes('user-scalable')) {
      meta.setAttribute('content', `${content.replace(/,\s*$/, '')}, ${want}`)
    } else if (!content.includes('maximum-scale=1')) {
      meta.setAttribute('content', `${content.replace(/user-scalable=[^,]+/g, 'user-scalable=no')}, maximum-scale=1`)
    }
  } else {
    const created = document.createElement('meta')
    created.name = 'viewport'
    created.content = `width=device-width, initial-scale=1, ${want}`
    document.head.appendChild(created)
  }
}

/** 电脑端尽力拦截页面缩放（需求 15）。
 *
 * 桌面浏览器（Chrome/Edge/Firefox/Safari）的 Ctrl+滚轮 / 触控板捏合 /
 * Ctrl+± / Ctrl+0 页面缩放是浏览器级行为，网页 JS 无法强制禁止（与
 * 手机端 viewport meta 不同，平台限制）。能锁就锁：wheel(ctrlKey) 与
 * keydown(Ctrl+±0) 的 preventDefault——对部分环境/未来版本有效，无效
 * 也无害；只拦 Ctrl 修饰的缩放手势与缩放按键，绝不拦普通滚轮（不破坏
 * 正常滚动）与普通按键。缩放检测提示层已按用户要求移除（UX 干扰）。
 */
function lockDesktopZoom(): () => void {
  const onWheel = (event: WheelEvent): void => {
    if (event.ctrlKey) event.preventDefault()
  }
  const onKeyDown = (event: KeyboardEvent): void => {
    if (!(event.ctrlKey || event.metaKey)) return
    const code = event.code
    if (code === 'Equal' || code === 'Minus' || code === 'Digit0'
      || code === 'NumpadAdd' || code === 'NumpadSubtract' || code === 'Numpad0') {
      event.preventDefault()
    }
  }
```

</details>

**依据 5 · 源码核查**：[src/client.ts:2454-2473](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/client.ts#L2454-L2473)

UI=off仅关闭Client注入，Host不受影响。

<details>
<summary>查看原文（20行）</summary>

```text
  ;(w.__meowSmoothClientDispose as (() => void) | undefined)?.()
  // 降级看门狗（放在一切早退之前）：无论 apply 走到哪个结局都保持运行，
  // bug 态（孤儿 FAB + 样式表丢失）在页面最底一行以纯文本现形。
  installBugWatch()
  /** 本实例登记的拆除函数清单（安装完成后打包挂 window）。 */
  const disposers: Array<() => void> = []
  // UI 注入开关（2026-08-20 为"录优化前原生界面素材"加，轻量 URL 方案）：
  // URL 带 ?meow-smooth-ui=off 时跳过全部 UI 注入（CSS/锁缩放/设置改造/事件
  // 委托/横幅/通知 client 桥），界面完全原生；host 侧压缩代理/审计投影/pending
  // 路由不受影响（手机 HTTPS 入口仍由 8445 代理提供服务，无需重启 3080）。
  // 录原生素材：手机访问 https://<tailscale 域名>/?meow-smooth-ui=off
  // 恢复优化版：去掉 query 刷新即可。（上方入口拆除已先于本 return 执行：
  // ui=off 的执行同样接管清理责任，旧实例不会残留。）
  if (new URLSearchParams(window.location.search).get('meow-smooth-ui') === 'off') {
    console.log('[meow-smooth] UI injection OFF (meow-smooth-ui=off) — native UI only')
    document.documentElement.dataset.meowApplyStage = 'exit:ui-off'
    applyLogPush(`#${applyN} exit:ui-off`)
    return
  }
  // 服务可用性前置检查（原在监听器安装之后）：缺失时不留下"半安装"状态
```

</details>

**依据 6 · 源码核查**：[src/client.ts:2764-2773](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/client.ts#L2764-L2773)

总disposer挂window供下次apply调用，未接ctx.effect。

<details>
<summary>查看原文（10行）</summary>

```text

  // 打包挂 window：下一次模块执行（热替换/rev 更新）在入口调用，拆除本
  // 实例全部运行期资源（见 apply 入口注释）。单项失败不阻断其余拆除。
  w.__meowSmoothClientDispose = (): void => {
    for (const fn of disposers.splice(0)) {
      try { fn() } catch { /* 尽力而为 */ }
    }
    delete w.__meowSmoothClientDispose
  }
}
```

</details>

**依据 7 · 源码核查**：[src/back-guard.ts:101-113](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/back-guard.ts#L101-L113)

dispose只移除监听，没有撤回history记录。

<details>
<summary>查看原文（13行）</summary>

```text

  const dispose = (): void => {
    window.removeEventListener('popstate', onPopState)
    window.removeEventListener('pageshow', onPageShow)
  }

  // 安装：当前记录已是哨兵（驻留哨兵时刷新页面）则不叠加推入，栈深恒 2。
  if (!isSentryState(history.state)) pushSentry()
  window.addEventListener('popstate', onPopState)
  window.addEventListener('pageshow', onPageShow)
  ;(w as unknown as Record<string, unknown>).__meowSmoothBackGuardDispose = dispose
  return dispose
}
```

</details>

**依据 8 · 源码核查**：[src/notify-client.ts:328-343](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/notify-client.ts#L328-L343)

通知dispose移除监听，未注销SW或取消订阅。

<details>
<summary>查看原文（16行）</summary>

```text
    dispose(): void {
      document.removeEventListener('pointerdown', requestPermissionOnGesture, { capture: true })
      document.removeEventListener('keydown', requestPermissionOnGesture, { capture: true })
      if (window.isSecureContext) {
        window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
        window.removeEventListener('appinstalled', onAppInstalled)
      }
      if (onVisibleResubscribe !== null) {
        document.removeEventListener('visibilitychange', onVisibleResubscribe)
      }
      if (onSwMessage !== null) {
        navigator.serviceWorker?.removeEventListener('message', onSwMessage)
      }
    },
  }
}
```

</details>

#### 缺口

- 没有目标设备可用性、无障碍表现及卸载后状态恢复实测，也没有通知服务费用记录。
  **影响**：只能建议有明确退路的有限UI试用，不能支持持续安装或保证完整恢复。
  **进一步探讨**：在目标手机记录放大/返回需求与任务完成，并对移除重启、刷新和撤权限逐项回读。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证多增强插件共存的可逆交互假设？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

已有可借鉴设计是复用原生提交和布局语义，以及“新apply先拆旧实例”的显式资源列表；输入普通Enter只断发送路径而保留编辑器原生换行，比手工改draft DOM更少争夺受控状态。Host把审计pending与客户端帧补充结合也有用，但orphan记录不能冒充可恢复审批。

由Q04的viewport、history和订阅残留，以及Q02的全局监听和宿主DOM耦合，推导未验证假设：把每个增强作为可独立开关的资源作用域，安装时保存被修改的页面状态，停用时按实际所有权撤回；对无法撤回的浏览器状态明确要求刷新或撤权限，可降低多插件共存时“关了但仍影响页面”的问题。额外成本包括状态快照、冲突检测和宿主版本适配，若错误恢复覆盖其他插件的新状态，反而更危险。

最小验证在同一设备和profile比较原生、仅本插件、叠加另一个侧栏/输入增强三种条件，分别做安装、重复apply、服务缺失早退、停用、刷新和撤权限。观察草稿/提交、缩放与返回、重复监听、资源残留和恢复耗时。成功条件是停用后明确恢复自己拥有的状态且不改写其他插件状态；任何误发送、历史导航丢失或恢复覆盖他人设置都推翻该保证。该实验未执行，不能用源码中的“单实例”注释替代实测。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.ts:2450-2490](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/client.ts#L2450-L2490)

先拆旧实例再检查依赖，支持作用域化但不是完全恢复证明。

<details>
<summary>查看原文（41行）</summary>

```text
  // 新实例是全新状态，两边的 syncSidebarFurl 轮询互踢 furl 标记，边栏陷入
  // "展开到细条⇄收到 0"的永动循环。与手势模块 __meowSmoothGestureDispose
  // 同款协议：新实例入口先拆旧实例全部运行期资源，再安装自己。
  const w = window as unknown as Record<string, unknown>
  ;(w.__meowSmoothClientDispose as (() => void) | undefined)?.()
  // 降级看门狗（放在一切早退之前）：无论 apply 走到哪个结局都保持运行，
  // bug 态（孤儿 FAB + 样式表丢失）在页面最底一行以纯文本现形。
  installBugWatch()
  /** 本实例登记的拆除函数清单（安装完成后打包挂 window）。 */
  const disposers: Array<() => void> = []
  // UI 注入开关（2026-08-20 为"录优化前原生界面素材"加，轻量 URL 方案）：
  // URL 带 ?meow-smooth-ui=off 时跳过全部 UI 注入（CSS/锁缩放/设置改造/事件
  // 委托/横幅/通知 client 桥），界面完全原生；host 侧压缩代理/审计投影/pending
  // 路由不受影响（手机 HTTPS 入口仍由 8445 代理提供服务，无需重启 3080）。
  // 录原生素材：手机访问 https://<tailscale 域名>/?meow-smooth-ui=off
  // 恢复优化版：去掉 query 刷新即可。（上方入口拆除已先于本 return 执行：
  // ui=off 的执行同样接管清理责任，旧实例不会残留。）
  if (new URLSearchParams(window.location.search).get('meow-smooth-ui') === 'off') {
    console.log('[meow-smooth] UI injection OFF (meow-smooth-ui=off) — native UI only')
    document.documentElement.dataset.meowApplyStage = 'exit:ui-off'
    applyLogPush(`#${applyN} exit:ui-off`)
    return
  }
  // 服务可用性前置检查（原在监听器安装之后）：缺失时不留下"半安装"状态
  // ——要么完整安装（拆除函数挂 window），要么什么都不装。
  const slots = ctx?.slots
  if (slots === undefined || typeof slots.inject !== 'function') {
    console.warn('[meow-smooth] slots service unavailable; sidebar auto-collapse disabled')
    document.documentElement.dataset.meowApplyStage = 'exit:no-slots'
    applyLogPush(`#${applyN} exit:no-slots`)
    return
  }
  const layout = ctx?.layout as ILayout | undefined
  if (layout === undefined || typeof layout.toggleSidebar !== 'function') {
    console.warn('[meow-smooth] layout service unavailable; sidebar auto-collapse disabled')
    document.documentElement.dataset.meowApplyStage = 'exit:no-layout'
    applyLogPush(`#${applyN} exit:no-layout`)
    return
  }
  // CSS 常驻全局（折叠由 data 属性驱动，规则在即生效）。先移除上一份同
  // 标记样式（双实例时期每次热替换都追加一份，无限堆积）。
```

</details>

**依据 2 · 源码核查**：[src/client.ts:2764-2773](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/client.ts#L2764-L2773)

现有disposer所有权入口。

<details>
<summary>查看原文（10行）</summary>

```text

  // 打包挂 window：下一次模块执行（热替换/rev 更新）在入口调用，拆除本
  // 实例全部运行期资源（见 apply 入口注释）。单项失败不阻断其余拆除。
  w.__meowSmoothClientDispose = (): void => {
    for (const fn of disposers.splice(0)) {
      try { fn() } catch { /* 尽力而为 */ }
    }
    delete w.__meowSmoothClientDispose
  }
}
```

</details>

**依据 3 · 源码核查**：[src/client.ts:1480-1498](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/client.ts#L1480-L1498)

viewport直接修改且未留原值，为可逆状态假设的依据。

<details>
<summary>查看原文（19行）</summary>

```text
function lockViewport(): void {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]')
  const want = 'maximum-scale=1, user-scalable=no'
  if (meta !== null) {
    const content = meta.getAttribute('content') ?? ''
    if (!content.includes('user-scalable')) {
      meta.setAttribute('content', `${content.replace(/,\s*$/, '')}, ${want}`)
    } else if (!content.includes('maximum-scale=1')) {
      meta.setAttribute('content', `${content.replace(/user-scalable=[^,]+/g, 'user-scalable=no')}, maximum-scale=1`)
    }
  } else {
    const created = document.createElement('meta')
    created.name = 'viewport'
    created.content = `width=device-width, initial-scale=1, ${want}`
    document.head.appendChild(created)
  }
}

/** 电脑端尽力拦截页面缩放（需求 15）。
```

</details>

**依据 4 · 源码核查**：[src/run-send.tsx:46-59](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/run-send.tsx#L46-L59)

调用原生提交语义而非复制会话执行器。

<details>
<summary>查看原文（14行）</summary>

```text
  const disabled = draft.trim() === ''

  const dispatchRunEnter = (): void => {
    // 运行＝按 busyEnter 设置，steering 不可用（子代理等）时退化为 queue，与官方 ComposerSubmissionPolicy.resolve 对齐；
    // 非运行瞬间（回合刚结束）＝普通发送（官方 resolve 亦退化为 queue）。
    const mode: RunSendMode = running && steeringAvailable ? (busyEnter ?? 'queue') : 'queue'
    submitMode(mode)
  }

  // 空闲不渲染（hooks 已全部调用完，条件 return 在末尾）：只有官方主按钮变
  // 停止的运行期，第二个箭头才出现——平时与官方按钮并列两个箭头太丑。
  if (!running) return null

  return (
```

</details>

**依据 5 · 源码核查**：[src/back-guard.ts:63-92](https://github.com/Phant0Meow/dsh-meow-smooth/blob/b9e5f4e7eda445b06aaf205018b1ace448d88029/src/back-guard.ts#L63-L92)

history接管具有真实用户导航影响。

<details>
<summary>查看原文（30行）</summary>

```text
  const pushSentry = (): void => {
    history.pushState({ [SENTRY_FLAG]: true }, '', location.href)
  }

  // 排障轨迹（环形 16 条）：真机无 console，返回接管分派问题靠
  // window.__meowBackGuardTrace 定位（与手势模块 __meowGestureTrace 同款）。
  const trace: string[] = []
  ;(w).__meowBackGuardTrace = trace
  const note = (msg: string): void => {
    trace.push(`${Date.now() % 100000} ${msg}`)
    if (trace.length > 16) trace.shift()
  }

  /** 一次返回到达：恢复哨兵防护 + 翻译成边栏开关（手势忙时只恢复防护）。 */
  const onPopState = (event: PopStateEvent): void => {
    if (isSentryState(event.state)) return // 落回哨兵：无视觉变化，不动
    pushSentry()
    const g = deps.gesture()
    if (g === undefined) {
      note('back: no-gesture-api')
      return
    }
    if (g.busy()) {
      note('back: gesture-busy')
      return
    }
    const open = g.isOpen()
    note(`back: isOpen=${open} → ${open ? 'close' : 'open'}`)
    if (open) g.collapseToZero()
    else g.open()
```

</details>

#### 缺口

- 独立作用域及恢复策略是否减少冲突尚无运行对照。
  **影响**：只能作为设计假设，不能计入当前已实现能力或评分增量。
  **进一步探讨**：使用所列三种共存条件检查错误恢复、误发送及总人工排障时间。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
