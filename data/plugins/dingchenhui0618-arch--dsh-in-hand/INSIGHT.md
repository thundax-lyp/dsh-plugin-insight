# 掌上 DSH

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[3484991](https://github.com/dingchenhui0618-arch/dsh-in-hand/tree/3484991a9668c18919019067a634944648f2b0a5)

<!-- BEGIN META -->
[![GitHub ★ 69](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=69&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dingchenhui0618-arch/dsh-in-hand) [![npm 30d 6,966](https://img.shields.io/static/v1?label=npm+30d&message=6%2C966&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-in-hand) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-in-hand)
<!-- END META -->

> **功能**：为 DSH 提供手机网页，查看会话与任务、继续对话、处理一次审批和提问，并收发附件。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持把同一宿主会话、一次审批和选项提问延伸到手机的集成贡献，判定手机不在线时不认领、超时和桌面中止交还由明确状态机处理。相较回桌面或只读监控，它改变人机交接地点；尚无端到端时延或成功率结果，不能称已验证提效。

> **主要限制**：[Q03](#research-q03) 显示设备撤销不是准入认证，匿名请求可自动取得新身份，部署的真实门禁在独立中继。[Q02](#research-q02) 显示认领后关页面不立即交还，[Q04](#research-q04) 显示发送回执丢失不能保证重试去重。因此可远程点击不等于身份和结果都可确定，未经部署核验不支持公网控制推荐。

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
  - [Q01 · 手机页如何复用宿主会话，相比桌面和只读监控改变什么？](#detail-section-11)
  - [Q02 · 手机审批与提问如何一次结算、超时和桌面竞争如何退回？](#detail-section-12)
  - [Q03 · 设备撤销与换路票据实际建立了什么信任边界？](#detail-section-13)
  - [Q04 · 文件、上传和通知把数据交给谁，有哪些副作用？](#detail-section-14)
  - [Q05 · 部署、持续运行及恢复成本和效果证据如何约束选择？](#detail-section-15)
  - [Q06 · 已查机制能支持什么新假设，怎样证伪？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向离开桌面仍需看任务、续写消息和处理待办的 DSH 单用户，提供浏览器手机入口。原办法是回桌面操作，或只读监控后再回桌面；合格交付是同一会话接受正确输入、审批明确结算且异常可辨。独立用户频率与节时未测，见 [Q01](#research-q01)。

比较基线为桌面 DSH 操作和只读状态监控，不为其他手机客户端作未经核实的功能断言。生成、会话管理、工具和文件服务属于宿主继承能力；本组件的增量是移动展示和人机交接，不是更强模型或独立任务执行器。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 手机会话页面 | 查看同一宿主会话并继续发送消息 | 依赖 sessionController；失去回执时先查会话再重发 |
| 一次审批 | 手机允许一次或拒绝工具调用 | 认领时需在线；关页面不立即释放已认领请求 |
| 选项提问回答 | 提交选项与自定义答案 | 答案先校验后结算，超时交还宿主 |
| 交付文件查看 | 打开宿主附件或被引用路径 | 路径有类型/大小/真实位置限制；附件id授权依赖宿主 |
| 文件和图片上传 | 向同一会话交接附件 | 会话绑定token/receipt；取消不代表写入回滚 |
| 设备列表与撤销 | 标记已识别设备并拒绝旧cookie | 不是准入认证，账本在内存，新身份会自动发放 |
| 换路票据 | 局域网与中继入口切换 | v3受众/HMAC/短期票；重放记账不跨重启 |
| 可选待办通知 | 把待办摘要发向配置通道或Push订阅 | 截短不是脱敏，HTTP成功不保证送达 |
| 桌面监控面板 | 显示任务快照并标注陈旧数据 | 与独立手机页不同实现，只读监控入口 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node与DSH宿主 | 启动必需 | 包声明Node≥20、DSH≥0.2.1-rc.2且<0.3.0 | 声明不证明各版本接口兼容 |
| webServer与会话控制服务 | 页面/对话必需 | 路由挂载、prompt/cancel等宿主操作 | 会话服务缺失时对话报错，不能由页面加载推断功能齐全 |
| 可信网络或已验证中继 | 写入口使用必需 | 承担访问准入及加密链路 | 宿主端口可达者可获新设备身份，未核实则不开放公网 |
| 宿主attachments/fileUploads | 附件操作必需 | 接收与读取文件/图像 | 操作失败或不可用，授权与残留需宿主依据 |
| 通知通道或浏览器推送 | 可选 | 离屏提醒 | 未配置可保留页面操作；外发需接受摘要经通道处理 |
| 共享票据密钥及中继版本 | 换路时必需 | 两端互认短期票 | 密钥只在内存回退或版本不合可能切换失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户安装profile并重启，确认端口只暴露给可信路径 | 未验证中继不开放公网写入口 |
| 连接 | 手机打开页面，核对同一会话及当前数据 | 陈旧快照不是当前成功状态 |
| 交接 | 手机提交消息、审批或选项，宿主控制服务接受 | 只以明确接收/结算判断，不把网络失败当未执行 |
| 恢复 | 用户查询会话和审批实际状态，再决定重试或回桌面 | 关闭页面不会撤销已接受消息及工具决定 |
| 退出 | 用户停用bundle并限制网络入口，回到桌面 | 已外发摘要、附件和工具副作用需另行核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本机宿主与手机；远程另有服务器/域名/网络资源，金额未知 | 安装重启、端口检查、中继/TLS/隧道部署与配对，工时未知 | 不装原生App不等于无需运维 |
| 持续 | 宿主运行、隧道和可选通知资源，单位成本未知 | 宿主/中继升级、浏览器后台与密钥管理 | 手机是否及时在线和收到通知尚无结果 |
| 失败恢复 | 失败重试与上传存储资源，数量未知 | 查消息是否已接收、审批结果、附件残留并回桌面 | 回执丢失不能直接重发，可能重复 |
| 退出 | 原宿主继续运行，外发数据不可撤回 | 停用插件、收紧网络入口及清理不再需要配置 | 已接受消息/工具决定不由停用回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 移动交接 | 手机请求调用同一宿主会话服务 | 是否减少等待和回桌面次数 |
| 审批结算 | 内存broker同步只结算一次并有超时/abort路径 | 真实宿主竞争结果、锁屏后等待时延 |
| 文件与附件 | 路径白名单/realpath及会话上传记录 | 宿主端到端授权与取消后残留 |
| 离屏提醒 | 摘要外发及HTTP层结果判断 | 供应商业务回执与用户最终送达 |
| 总体收益 | 作者有页面演示与功能说明 | 无本次合格率、节时或ROI对照 |

> **思考**：[Q03](#research-q03) 显示设备撤销不是准入认证，匿名请求可自动取得新身份，部署的真实门禁在独立中继。[Q02](#research-q02) 显示认领后关页面不立即交还，[Q04](#research-q04) 显示发送回执丢失不能保证重试去重。因此可远程点击不等于身份和结果都可确定，未经部署核验不支持公网控制推荐。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持把同一宿主会话、一次审批和选项提问延伸到手机的集成贡献，判定手机不在线时不认领、超时和桌面中止交还由明确状态机处理。相较回桌面或只读监控，它改变人机交接地点；尚无端到端时延或成功率结果，不能称已验证提效。

[Q02](#research-q02) 复用broker处理审批与提问、先校验再消费、同步结算与墓碑错误码，值得借鉴为明确的人机交接状态机；[Q04](#research-q04) 上传按会话锁定和真实路径检查也有具体设计价值。移植需理解宿主waterfall与文件契约，不能只复制UI。index.js同时承载路由、状态与通知等多职责，旧SECURITY未跟上当前实现，增加人工追踪和文档误判负担；这些限制不由静态统计或测试脚本数量抵消。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示设备撤销不是准入认证，匿名请求可自动取得新身份，部署的真实门禁在独立中继。[Q02](#research-q02) 显示认领后关页面不立即交还，[Q04](#research-q04) 显示发送回执丢失不能保证重试去重。因此可远程点击不等于身份和结果都可确定，未经部署核验不支持公网控制推荐。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前建议观察。[Q03](#research-q03) 的中继准入尚未核实，[Q02](#research-q02) 和 [Q04](#research-q04) 的状态未知需要用户主动辨别。熟悉单用户可信网络者可先研究只读与无敏感副作用的消息；出现匿名直连、撤销误判、回执不明或重复消息时停用手机写入口并回桌面，先核对宿主实际状态。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持移动会话接入、一次审批/提问交接及受限文件路径读取；外部中继、真实浏览器兼容和任务收益未验收。身份准入与结果未知限制采用，未来状态契约是待验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/page.html、lib/client.js、lib/files.js、lib/ticket.js、SECURITY.md、docs/deploy/README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交下定向检查index.js的服务接线、审批/提问、设备/票据、消息/上传/文件和通知发送关键路径，以及page.html发送和审批回执、client监控、files与ticket模块。index与page为长文件，本次只对上述范围做源码分析，不声称全仓安全审计；完整组件统计采用INVENTORY。未核查独立中继和宿主实现。
- 下一步：仅源码检查，未安装、运行目标代码、执行其检查脚本或真实宿主/手机验收。作者截图、CI徽章及部署示例不是本次执行证据；未来验证保持待验证。

**分析版本**

- **仓库**：[dingchenhui0618-arch/dsh-in-hand](https://github.com/dingchenhui0618-arch/dsh-in-hand)
- **版本号**：1.8.25（[固定提交 3484991](https://github.com/dingchenhui0618-arch/dsh-in-hand/tree/3484991a9668c18919019067a634944648f2b0a5)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 的未验证假设是把准入、在线认领和消息提交分别做成持久授权、可失效租约与稳定请求id状态契约。以清cookie/重启后撤销仍生效、断连后只交还一次、丢回执重试不重复消息为判据，同时记录移动网络误中断；若仍可匿名写入或重复执行便推翻充分性。它需要宿主/中继协作，属于未来设计而非已有贡献。

仅源码检查，未安装、运行目标代码、执行其检查脚本或真实宿主/手机验收。作者截图、CI徽章及部署示例不是本次执行证据；未来验证保持待验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 4046 | — | — | 68552 |
| .js | source | 7 | 7717 | 6005 | 1452 | — |
| .mjs | source | 46 | 17581 | 14413 | 2569 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/dingchenhui0618-arch/dsh-in-hand/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/dingchenhui0618-arch/dsh-in-hand/issues?q=is%3Aissue+created%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/dingchenhui0618-arch/dsh-in-hand/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：手机端接入宿主会话与一次审批，如何缩短离桌面时的人机交接，以及信任边界和恢复机制是否足以支持采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 手机页如何复用宿主会话，相比桌面和只读监控改变什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

面向离开桌面仍需查看任务、补充消息和处理一次审批的 DSH 使用者，组件交付的是手机浏览器页面与宿主控制入口，并非另一个独立 Agent。原办法是回桌面操作，或在只读监控中发现待办后再回桌面；增量是将已有会话运行时的交接延伸到手机。合格结果应是同一会话接受预期消息、审批只结算一次、断连后能辨别状态，不能仅以页面能打开衡量。真实离桌面任务频率与耗时收益尚无独立用户数据。

package 的 bundle 和 web client 声明与 apply 的 webServer 注入支持真实插件身份。宿主注册手机 HTTP 入口，chat/send 形成 sessionId、mode、content 请求，再调用 sessionController.prompt；手机页 send 经同源 POST 调用该入口，只有 accepted=true 才清草稿。生成、会话存储与工具执行能力由宿主提供，插件负责展示、请求整形与交接，不能把这些继承能力算作自身模型创新。桌面 lib/client.js 则是读取 /taskwatch/data 的监控面板，它和独立手机页面并非同一个界面实现。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:55-61](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/package.json#L55-L61)

bundle与web client共同声明插件入口。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
```

**依据 2 · 源码核查**：[lib/index.js:1487-1498](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L1487-L1498)

apply读取宿主运行时服务与webServer。

<details>
<summary>查看原文（12行）</summary>

```text
export function apply(ctx, config) {
  const settings = config && typeof config === 'object' ? config : {}
  const approvalConfig = resolveApprovalConfig(settings, (msg) => {
    console.error('dsh-in-hand: ' + msg)
  })
  const jobsSvc = ctx.get('jobs')
  const agentsSvc = ctx.get('agents')
  const sessionsSvc = ctx.get('sessions')
  const goalsSvc = ctx.get('goals')
  const subagentsSvc = ctx.get('subagents')
  const titlesSvc = ctx.get('sessionTitle')
  const rawWebServer = ctx.get('webServer')
```

</details>

**依据 3 · 源码核查**：[lib/index.js:3142-3159](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L3142-L3159)

消息整形后调用宿主prompt，明确检查accepted，不在插件内调用LLM。

<details>
<summary>查看原文（18行）</summary>

```text
            nowRequested = wantNow
            const request = {
              requestId: randomUUID(),
              sessionId,
              mode: (wantNow || body.mode === 'steer') ? 'steer' : 'queue',
              content,
            }
            if (asText(body.timeZone)) request.clientTimeZone = asText(body.timeZone)
            const value = await chatOf().prompt(request, lifetime.signal)
            if (!value || value.accepted !== true) throw new Error('宿主未接收消息，请重试')
            for (const { key, record } of locked) if (pendingUploads.get(key) === record) pendingUploads.delete(key)
            if (!res.destroyed && !res.writableEnded) json(res, 200, { ok: true, accepted: true })
          } catch (e) {
            if (!res.destroyed && !res.writableEnded) {
              // 老客户端只认 200 + {error}，保持原契约；带 now 的新语义失败用 502，
              // 让调用方能和「参数不对」（仍是 200 + 文本）分开。
              if (nowRequested) failJson(res, 502, 'host-rejected', '立即发送失败：' + why(e))
              else json(res, 200, { error: why(e) })
```

</details>

**依据 4 · 源码核查**：[lib/page.html:5404-5438](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/page.html#L5404-L5438)

手机页面send真实调用chat/send，确认接收后才清草稿。

<details>
<summary>查看原文（35行）</summary>

```text
async function send(text, opts){
  var o = opts || {}
  text = String(text == null ? $('input').value : text)
  if (S.agentView) { notice('子代理会话只读，不能发送', 2000); return }
  if (sendingSessions[S.sessionId]) return
  if (!text.trim() && !S.attachments.length) return
  if (S.attachments.some(function(a){ return a.status === 'uploading' })) { attachmentNotice('附件还在上传，请稍等'); return }
  if (S.attachments.some(function(a){ return a.status === 'compressing' })) { attachmentNotice('图片还在压缩，请稍等'); return }
  if (S.attachments.some(function(a){ return a.status === 'error' })) { attachmentNotice('请重试或移除上传失败的附件'); return }
  if (!S.sessionId) await ensureSession()
  if (!S.sessionId) { attachmentNotice('请先新建或选择一个会话'); return }
  var sessionId = S.sessionId, draft = S.attachments, attached = draft.slice()
  sendingSessions[sessionId] = true
  S.pending = text
  S.pendingAttachments = attached
  renderPending()
  $('input').value = ''
  autoGrow(); syncSend(); attachmentNotice('')
  try {
    var payload = {
      sessionId: sessionId,
      text: text,
      attachments: attached.map(function(a){ return a.upload }),
      timeZone: (Intl.DateTimeFormat().resolvedOptions().timeZone || '')
    }
    if (o.now) payload.now = true
    if (o.now && o.interrupt) payload.interrupt = true
    var result = await post('/taskwatch/chat/send', payload)
    if (!result || result.accepted !== true) throw new Error('宿主尚未接受消息，请重试')
    attached.forEach(function(a){ var i = draft.indexOf(a); if (i >= 0) draft.splice(i, 1) })
    // 发送成功才清草稿：失败时下面会把原文放回输入框，草稿必须还在。
    clearDraft(sessionId)
    if (S.sessionId === sessionId) { S.running = true; renderAttachmentTray(); wakeComposer() }
    else attached.forEach(releaseAttachment)
    refreshQueue(true)
```

</details>

**依据 5 · 源码核查**：[lib/client.js:77-107](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/client.js#L77-L107)

桌面客户端读取同源监控数据，说明与手机页职责区别。

<details>
<summary>查看原文（31行）</summary>

```text
    function useSnapshot() {
      var pair = React.useState(null)
      var snap = pair[0]
      var setSnap = pair[1]
      var epair = React.useState(null)
      var err = epair[0]
      var setErr = epair[1]
      React.useEffect(function () {
        var alive = true
        var timer = null
        // 响应序号：只接受最新一次请求的结果。并发轮询加上宿主 2 秒 TTL，
        // 较早发出的请求完全可能晚回来，不能让它把新快照覆盖成旧的。
        var seq = 0
        function tick() {
          // 面板挂在后台窗口时不必再打服务器。这个面板的典型用法就是
          // 「GUI 最小化、拿手机看」，此时继续每 3 秒请求纯属白耗。
          if (document.hidden) return
          var mine = ++seq
          // no-cache（不是 no-store）：让浏览器带上 If-None-Match，
          // 内容没变时宿主回 304，桌面这一半也省下整份 JSON。
          fetch('/taskwatch/data', { cache: 'no-cache' }).then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status)
            return r.json()
          }).then(function (value) {
            if (!alive || mine !== seq) return
            setSnap(value)
            setErr(null)
          }, function (e) {
            if (!alive || mine !== seq) return
            setErr(e && e.message ? e.message : String(e))
          })
```

</details>

**依据 6 · 作者声明**：[README.md:36-46](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/README.md#L36-L46)

作者描述离桌面继续会话与审批场景，作为目标用户线索。

<details>
<summary>查看原文（11行）</summary>

```text
## 为什么用它

- **不用公网 IP**：电脑在 NAT 后面也能连上，路由器不用做端口映射。
- **能接着聊**：还是桌面上那批会话，手机上回一句就继续，逐字看着它跑。
- **能批一次**：手机在线时，待批准卡片直接给「批准一次 / 拒绝」；超时或手机切走就自动退回桌面（v1.8.0）。
- **拍一张直接发**：输入框旁的相机键唤起系统相机，拍完就在输入区看到缩略图、大小和取消；发送前在手机上压到长边 1600、保留拍摄方向，原图不出手机（仍走本机收件箱，不进云端，v1.8.9）。
- **等待和交付物都在这一页**：哪件事在等你、进度到哪，展开就能看；生成好的图和 PDF 直接打开。

## 从只读监控长成手机客户端

它起初只是一份只读的**任务监控页**——让你在手机上瞄一眼 DSH 有几个任务在跑、有没有事在等你；后来接上了 DSH 自己的会话运行时，长成了手机浏览器里的 DSH 客户端：左上角会话列表、右上角新建对话、输入框上方是当前会话的实时指标（轮次 / 步数 / token/s / Token 消耗 / 缓存命中率 / 上下文占用），可以直接对话、逐字跟随输出、随时打断；再往后，手机上还能**一次性批准 / 拒绝一次工具调用**、**回答选项式提问**。
```

</details>

#### 缺口

- 没有固定任务集下与回桌面操作的对照。
  **影响**：移动入口已实现不代表总体等待或人工投入下降。
  **进一步探讨**：记录离桌面待办的处理时延、误操作、回桌面次数和恢复工时，与同任务桌面流程比较。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 手机审批与提问如何一次结算、超时和桌面竞争如何退回？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

审批与提问使用同一 broker 思路：begin 创建内存请求及计时器，settle 先检查 settled 再同步标记完成并解析等待；重复手机决定返回409，已超时或交还返回410。approvalGate 在手机在线且请求未中止时认领，手机允许一次或拒绝后把结果交还宿主；超时、宿主 signal abort 和内部错误走 next() 交给后续处理。questionGate 先校验答案再消费，避免无效回答用掉请求。两类分别订阅宿主 waterfall 事件，说明这一机制已经接到真实入口。审批一次性只限此插件进程的请求状态，不证明任何外部工具副作用只发生一次。

在线条件有容易影响采用的时间边界。phoneOnline 由打开的审批 SSE 或最近15秒手机轮询判断，且只在认领前检查。SSE close 处理仅移除连接，并没有 settle 已经认领的请求。因此“手机切走立刻退回桌面”不能从代码得出；已认领的请求可能继续等待默认120秒，直到超时、宿主中止或手机决定。页面关闭后15秒内的新请求也可能凭旧心跳被认领。它是有上限的等待转移，不是持续在线租约。

此外，手机页把409和410都显示为“已由桌面处理”，但409也可表示本手机第一次提交已成功、回执丢失后再次提交；410还可只是超时。不能从这个文案断言桌面一定做出了决定。高危确认属于页面确认步骤，后端决定仍只收id与allow/reject，不能把二次点击称为服务端新增权限边界。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:914-954](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L914-L954)

同步settle与claim区分已由手机、超时及桌面中止状态。

<details>
<summary>查看原文（41行）</summary>

```text
  function settle(d, outcome, by, extra) {
    if (d.settled) return false
    d.settled = true
    d.settledBy = by
    d.settledAt = now()
    if (d.timer) { clearTimeout(d.timer); d.timer = null }
    if (d.signal && d.onAbort) {
      try { d.signal.removeEventListener('abort', d.onAbort) } catch { /* 已移除 */ }
      d.onAbort = null
    }
    try { audit(auditEntry(d, outcome, by, extra)) } catch { /* 审计失败不影响决定 */ }
    const result = { outcome, delegated: by !== 'phone', by, ...(extra || {}) }
    try { onSettled(d, result) } catch { /* 推送失败不影响决定 */ }
    d.resolve(result)
    return true
  }

  /** 所有「还能不能决定」的判定都收在这里，decide() 与 answer() 共用 ——
   *  这样 404 / 409 / 410 三档对两种决定完全一致，不会各自漂移。 */
  function claim(id) {
    sweep()
    const d = decisions.get(asText(id))
    if (!d) {
      return { error: { status: 404, body: { ok: false, code: 'unknown-id', error: '未知的请求（可能已经过期）' } } }
    }
    const asked = d.kind === 'question' ? '这次提问' : '这次审批'
    if (d.settled) {
      if (d.settledBy === 'phone') {
        return { error: { status: 409, body: { ok: false, code: 'already-decided', error: asked + '已经处理过了' } } }
      }
      return { error: { status: 410, body: { ok: false, code: 'expired-or-delegated', error: asked + '已过期或已交还桌面' } } }
    }
    if (now() >= d.expiresAt) {
      settle(d, 'delegated', 'timeout')
      return { error: { status: 410, body: { ok: false, code: 'expired-or-delegated', error: asked + '已过期或已交还桌面' } } }
    }
    if (d.signal && d.signal.aborted) {
      settle(d, 'cancelled', 'desktop')
      return { error: { status: 410, body: { ok: false, code: 'expired-or-delegated', error: asked + '已过期或已交还桌面' } } }
    }
    return { decision: d }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:988-1011](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L988-L1011)

计时器、abort和允许一次/拒绝的实际结算。

<details>
<summary>查看原文（24行）</summary>

```text
      decisions.set(id, d)
      d.timer = setTimeout(() => settle(d, 'delegated', 'timeout'), timeoutMs)
      if (d.timer && typeof d.timer.unref === 'function') d.timer.unref()
      if (signal) {
        d.signal = signal
        if (signal.aborted) {
          settle(d, 'cancelled', 'desktop')
        } else {
          d.onAbort = () => settle(d, 'cancelled', 'desktop')
          try { signal.addEventListener('abort', d.onAbort, { once: true }) } catch { /* 不是标准 AbortSignal */ }
        }
      }
      return { id, expiresAt, promise }
    },
    decide(id, decision) {
      // 防御性再判一次：即使路由层被改坏，broker 也只接受这两个词。
      if (decision !== 'allow' && decision !== 'reject') {
        return { status: 400, body: { ok: false, code: 'bad-request', error: 'decision 只能是 allow 或 reject' } }
      }
      const got = claim(id)
      if (got.error) return got.error
      const outcome = decision === 'allow' ? 'allowed-once' : 'rejected'
      settle(got.decision, outcome, 'phone')
      return { status: 200, body: { ok: true, outcome } }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1114-1166](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L1114-L1166)

认领只检查当时在线，最终根据delegated返回next或手机结果。

<details>
<summary>查看原文（53行）</summary>

```text
      const aborted = Boolean(req && req.signal && req.signal.aborted)
      if (approveFromPhone && !aborted && isPhoneOnline()) {
        claim = broker.begin({ session, toolName, reason, signal: req ? req.signal : null, risk })
        entry.id = claim.id
        entry.expiresAt = claim.expiresAt
        entry.canDecide = true
        onPending(pendingKey, entry)
        pendingByDecision.set(claim.id, entry)
        try {
          onBroadcast({
            type: 'approval',
            state: 'pending',
            id: claim.id,
            session,
            toolName,
            reason: String(reason).slice(0, 240),
            risk,
            expiresAt: claim.expiresAt,
          })
        } catch { /* 推送失败不影响等待 */ }
      }
    } catch (e) {
      // 内部异常也要留审计：outcome=error / by=error。错误消息可能带命令内容，
      // 所以只记会话与工具名，不把 e.message 写进去。
      try {
        audit({
          at: new Date(now()).toISOString(),
          session,
          toolName,
          outcome: 'error',
          by: 'error',
        })
      } catch { /* 审计失败不影响主链路 */ }
      try { onError(e, { session, toolName, reason }) } catch { /* 观测失败不影响主链路 */ }
      if (pendingKey) onRelease(pendingKey)
      return await next()
    }

    if (!claim) {
      try { return await next() } finally { if (pendingKey) onRelease(pendingKey) }
    }

    const result = await claim.promise
    if (entry) {
      entry.canDecide = false
      entry.settled = true
    }
    pendingByDecision.delete(claim.id)
    if (result.delegated) {
      try { return await next() } finally { if (pendingKey) onRelease(pendingKey) }
    }
    if (pendingKey) onRelease(pendingKey)
    return result.outcome
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1411-1426](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L1411-L1426)

提问先校验内容再调用broker.answer。

<details>
<summary>查看原文（16行）</summary>

```text
    /** 手机提交答案。先校验内容再认领：400 不能被当成"用掉了一次机会"。 */
    answer(id, answers) {
      const key = asText(id)
      const d = broker.decisions.get(key)
      if (d && d.kind === 'question') {
        const checked = validateAnswers(d.questions, answers)
        if (!checked.ok) {
          return {
            status: 400,
            body: { ok: false, code: 'bad-request', field: checked.field, error: checked.error },
          }
        }
        return broker.answer(key, checked.answers)
      }
      // 未知 id / 过期 / 已交还 / 已答过 / 不是提问：统一交给 broker 判，错误码与审批一致。
      return broker.answer(key, answers)
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1624-1633](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L1624-L1633)

在线条件为SSE或15秒心跳，并非持续会话租约。

<details>
<summary>查看原文（10行）</summary>

```text
  // 「有手机在线」的判据只复用手头已有的两条现成通道：
  //   · 手机页每 5 秒打一次 /taskwatch/data?view=phone（桌面 GUI 打的是不带
  //     view 的同一个接口，故意不算在线，否则桌面开着面板会让手机审批空等 120 秒）；
  //   · 手机页可见时保持一条 /taskwatch/approvals/stream SSE，隐藏时关闭
  //     （页面 stopPolling 里一起收），所以锁屏 / 切走就等于离线。
  // TTL 15 秒覆盖三次漏拍；没有任何连接或最近活动就立刻 next()。
  let phoneLastSeenAt = 0
  const approvalStreams = new Set()
  const markPhoneSeen = () => { phoneLastSeenAt = Date.now() }
  const phoneOnline = () => approvalStreams.size > 0 || (Date.now() - phoneLastSeenAt) <= PHONE_ONLINE_TTL_MS
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1705-1746](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L1705-L1746)

审批和提问均实际订阅宿主事件。

<details>
<summary>查看原文（42行）</summary>

```text
  const approvalGate = createApprovalGate({
    approveFromPhone: approvalConfig.approveFromPhone,
    timeoutMs: approvalConfig.timeoutMs,
    highRiskPatterns: approvalConfig.highRiskPatterns,
    isPhoneOnline: phoneOnline,
    audit: writeAudit,
    onPending(key, entry) { approvals.set(key, entry); notifyPoke() },
    onRelease(key) { approvals.delete(key); notifyPoke() },
    onBroadcast: broadcastApproval,
    onError(error) {
      // 审计由 gate 自己写入（outcome=error / by=error），这里只留一条运维日志。
      console.error('dsh-in-hand: 审批内部异常，已交还桌面：' + why(error))
    },
  })

  // approval/request 是 waterfall：认领成功才返回 allowed-once / rejected，
  // 其余所有失败路径（离线 / 超时 / abort / 内部异常）都必须交还 next()。
  ctx.on('approval/request', (req, next) => approvalGate.handle(req, next))

  // ── 手机端回答选项式提问（v1.8.3）──────────────────────────────────────────
  //
  // user-questions/request 与 approval/request 一样是 waterfall：不调 next() 就是
  // 认领。这里刻意**复用**审批那套 broker / 超时 / 审计 / 在线判断 / SSE，
  // 只把"带回什么"从 allowed-once 换成 { answers }。四条失败语义逐条对齐：
  // 离线立刻 next()、超时 next() 且审计 by=timeout、abort 立刻交还、内部异常 next()。
  //
  // 待回答项仍然进同一个 `questions` Map —— /taskwatch/data 的 pending 里两种卡
  // 用 kind 区分（approval / question），页面不需要第二套清单接口。
  const questionGate = createQuestionGate({
    enabled: approvalConfig.approveFromPhone,
    timeoutMs: approvalConfig.timeoutMs,
    isPhoneOnline: phoneOnline,
    audit: writeAudit,
    onPending(key, entry) { questions.set(key, entry); notifyPoke() },
    onRelease(key) { questions.delete(key); notifyPoke() },
    onBroadcast: broadcastApproval,
    onError(error) {
      console.error('dsh-in-hand: 提问内部异常，已交还桌面：' + why(error))
    },
  })

  ctx.on('user-questions/request', (request, next) => questionGate.handle(request, next))
```

</details>

**依据 7 · 源码核查**：[lib/index.js:2487-2499](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L2487-L2499)

SSE关闭只删除连接，不结束已认领请求。

<details>
<summary>查看原文（13行）</summary>

```text
        approvalStreams.add(res)
        markPhoneSeen()
        const heartbeat = setInterval(() => {
          try { res.write(': ping\n\n') } catch { /* 连接已断，close 事件会收尾 */ }
        }, 20 * 1000)
        if (heartbeat && typeof heartbeat.unref === 'function') heartbeat.unref()
        const done = () => {
          clearInterval(heartbeat)
          approvalStreams.delete(res)
        }
        req.on('close', done)
        res.on('close', done)
        res.on('error', done)
```

</details>

**依据 8 · 源码核查**：[lib/page.html:7093-7107](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/page.html#L7093-L7107)

409/410合并成桌面已处理文案，失败后允许重试。

<details>
<summary>查看原文（15行）</summary>

```text
    if (r.ok && j && j.ok) {
      finishApproval(el, decision === 'allow' ? '已提交 · 允许一次' : '已提交 · 拒绝')
      return
    }
    if (r.status === 409 || r.status === 410) {
      finishApproval(el, '已由桌面处理')
      return
    }
    throw new Error((j && j.error) || ('HTTP ' + r.status))
  } catch (e) {
    for (var k = 0; k < buttons.length; k++) buttons[k].disabled = false
    if (hint) {
      hint.hidden = false
      hint.className = 'approval-hint bad'
      hint.textContent = '提交失败，可重试 · 120 秒无响应会退回桌面'
```

</details>

#### 缺口

- 宿主处理链对abort与next的最终表现尚无当前版本运行记录。
  **影响**：只能确认本插件结算逻辑，不能保证桌面竞争和工具执行最终结果。
  **进一步探讨**：在隔离会话记录手机先处理、桌面先处理、锁屏、超时与回执丢失的完整事件序列。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 设备撤销与换路票据实际建立了什么信任边界？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

宿主设备账本是识别与撤销记号，不是新设备准入认证。apply 内创建 ledger，ensureDevice 遇到未识别或没有cookie的请求自动生成随机身份并放行；仅已记录且revoked的旧身份返回401。删除cookie再访问宿主端口会得到新身份，重启也不保留该内存账本。故不能把“撤销设备”理解为永久禁止那台手机接入。实际身份与公网准入必须由前置中继、网络暴露范围和运维配置承担；部署文档明确中继令牌与插件无关，本轮未审查中继仓库，不能声称配对码和TLS链路已安全验收。

换路票据当前是v3，绑定lan/remote受众、HMAC、到期时间与进程内重放表；v2兼容有明确2027年截止，不能照抄SECURITY仍写v2和1.7.x的现状说明。redeem 在同步函数内校验并记账，避免同一事件循环并发插入；但guard为内存Map，上限满时会淘汰仍未过期的最旧项，重启或另一进程也不共享。一次性保证必须限定为该进程仍保存对应记录时，不能扩大为跨节点或持久严格一次性。票据证明来源和时效，不替代宿主整体访问认证。

这些边界直接影响手机控制能否交给不受信网络或多人使用。当前适合研究单用户、可信网络中的交接设计，未经独立核验中继与宿主暴露范围时应停留观察。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1500-1513](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L1500-L1513)

设备账本在apply内新建，静态资源放行。

<details>
<summary>查看原文（14行）</summary>

```text
  // ── 设备身份与闸门（v1.8.7，P4）────────────────────────────────────────
  //
  // 所有 /taskwatch 动态路由统一在注册层包一层：先认设备，再进原 handler。
  // 放在注册层而不是每个 handler 里，是因为漏包一条就是一个后门；静态资源
  // （外壳 / SW / 图标 / manifest）必须放行，否则被撤销的设备连错误页都拿不到。
  const deviceLedger = createDeviceLedger()
  let devicePublicUrl = ''
  const DEVICE_OPEN_PATHS = new Set([
    '/taskwatch',
    '/taskwatch/sw.js',
    '/taskwatch/manifest.webmanifest',
    '/taskwatch/icon-192.png',
    '/taskwatch/icon-512.png',
  ])
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1559-1586](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L1559-L1586)

旧撤销cookie拒绝，未知身份自动新建并放行。

<details>
<summary>查看原文（28行）</summary>

```text
  /** 认设备：没有就发一张新身份（老客户端不会因此下线），被撤销则回 ok:false。
   *  老会话（有 tw-route 换路标记、没有 twd）在这里补绑，不踢下线。 */
  function ensureDevice(req, res) {
    const cookies = readCookies(req)
    const via = requestVia(req)
    const ua = asText(req && req.headers && req.headers['user-agent'])
    const raw = asText(cookies[DEVICE_COOKIE])
    const found = raw ? deviceLedger.find(raw) : null
    if (found && found.record.revoked) {
      return {
        ok: false, revoked: true, id: found.id, record: found.record,
        digest: deviceLedger.digest(found.id), via, fresh: false,
      }
    }
    let id = found ? found.id : ''
    let record = id ? deviceLedger.touch(id, { ua, via }) : null
    let fresh = false
    if (!record) {
      id = randomUUID()
      record = deviceLedger.ensure(id, { ua, via })
      fresh = true
      // 老会话补绑：v1.6–v1.8.6 的页面只有 tw-route 标记，没有设备 cookie。
      if (cookies['tw-route']) deviceLedger.bind(id, { via, kind: 'legacy-session' })
      addCookie(res, deviceCookie(id))
    }
    const info = { id, record, fresh, via, digest: deviceLedger.digest(id) }
    try { req.taskwatchDevice = info } catch { /* 只读请求对象 */ }
    return { ok: true, ...info }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1598-1613](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L1598-L1613)

动态路由统一包设备闸门，但闸门本身不是准入认证。

<details>
<summary>查看原文（16行）</summary>

```text
  const webServer = rawWebServer && typeof rawWebServer.register === 'function'
    ? {
        register(route) {
          const path = String((route && route.path) || '')
          if (!route || route.kind !== 'exact' || DEVICE_OPEN_PATHS.has(path)) {
            return rawWebServer.register(route)
          }
          const inner = route.handler
          return rawWebServer.register({
            ...route,
            handler: (req, res) => {
              const gate = ensureDevice(req, res)
              if (!gate.ok) { deviceRejected(res); return }
              return inner(req, res)
            },
          })
```

</details>

**依据 4 · 源码核查**：[lib/ticket.js:40-55](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/ticket.js#L40-L55)

当前v3受众及v2截止常量。

<details>
<summary>查看原文（16行）</summary>

```text
export const TICKET_TTL_MS = 60 * 1000
/** 允许 60 秒 TTL + 时钟偏差；超过这个跨度的一律当伪造/过期，不给无限期票。 */
export const TICKET_MAX_AGE_MS = 180 * 1000
/** 当前签发的票版本；TICKET_VERSIONS 是"本进程能验"的版本清单（能力声明用）。 */
export const TICKET_VERSION = 3
export const TICKET_VERSIONS = [3, 2]
/** 受众：校验方身份。中继只收 remote，插件宿主只收 lan。 */
export const TICKET_AUD_REMOTE = 'remote'
export const TICKET_AUD_LAN = 'lan'
export const TICKET_AUDIENCES = [TICKET_AUD_REMOTE, TICKET_AUD_LAN]
/**
 * v2 过渡期截止点（UTC）：这之后插件与中继都不再接受 v2 票。
 * 选 2027-01-01 是给"用户可能几周才升级一次"留足时间，同时给一个能写进文档的硬日期。
 * 两侧代码用的是同一个日期 —— 改日期必须两边一起改，否则会出现"一边认、一边不认"。
 */
export const TICKET_V2_SUNSET_AT = Date.UTC(2027, 0, 1, 0, 0, 0)
```

</details>

**依据 5 · 源码核查**：[lib/ticket.js:148-170](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/ticket.js#L148-L170)

重放记录内存化，容量满淘汰最旧未过期项。

<details>
<summary>查看原文（23行）</summary>

```text
export function createReplayGuard({ now = Date.now, max = 8192, sweepMs = 30 * 1000, autoSweep = true } = {}) {
  const seen = new Map()
  let nextSweep = now() + sweepMs
  /** 删掉所有已过期的记录。now 可注入，测试里不必真等 60 秒。 */
  const prune = (at = now()) => {
    for (const [key, exp] of seen) if (exp <= at) seen.delete(key)
    nextSweep = at + sweepMs
    return seen.size
  }
  /** 第一次见到 key → true（并立即写入）；重复 → false。原子：查与写在同一个函数体内。 */
  const claim = (key, expMs) => {
    if (typeof key !== 'string' || !key) return false
    const at = now()
    if (at >= nextSweep || seen.size >= max) prune(at)
    if (seen.has(key)) return false
    // 上限兜底：全是未过期记录时丢最早的一条（票本身只有 60 秒寿命，丢掉的几乎都是残留）。
    while (seen.size >= max) {
      const oldest = seen.keys().next().value
      if (oldest === undefined) break
      seen.delete(oldest)
    }
    seen.set(key, Math.max(Number(expMs) || 0, at + 1000))
    return true
```

</details>

**依据 6 · 源码核查**：[lib/ticket.js:194-220](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/ticket.js#L194-L220)

验证受众、签名、时间及同步claim的实际链。

<details>
<summary>查看原文（27行）</summary>

```text
export function redeemTicket(secret, ticket, {
  aud,
  guard,
  now = Date.now,
  v2SunsetAt = TICKET_V2_SUNSET_AT,
} = {}) {
  const parsed = parseTicket(ticket)
  if (!parsed) return { ok: false, reason: 'format', version: 0, aud: '' }
  const meta = { version: parsed.version, aud: parsed.aud }
  if (!guard) return { ok: false, reason: 'format', ...meta }
  if (!normalizeSecret(secret)) return { ok: false, reason: 'signature', ...meta }
  if (parsed.version === 3) {
    if (aud && parsed.aud !== aud) return { ok: false, reason: 'audience', ...meta }
    if (!signatureOk(secret, parsed)) return { ok: false, reason: 'signature', ...meta }
  } else {
    // v2 没有受众，只能靠过渡期之内的"短期 + 单次"兜着。
    if (!(now() < v2SunsetAt)) return { ok: false, reason: 'v2-sunset', ...meta }
    if (!signatureOk(secret, parsed)) return { ok: false, reason: 'signature', ...meta }
  }
  const at = now()
  if (!(parsed.expMs > at)) return { ok: false, reason: 'expired', ...meta }
  if (parsed.expMs - at > TICKET_MAX_AGE_MS) return { ok: false, reason: 'window', ...meta }
  // 记账用 "版本:受众:nonce"：同一 nonce 换个受众也不能再兑一次。
  if (!guard.claim(parsed.version + ':' + (parsed.aud || '-') + ':' + parsed.nonce, parsed.expMs)) {
    return { ok: false, reason: 'replay', ...meta }
  }
  return { ok: true, reason: '', ...meta }
```

</details>

**依据 7 · 作者声明**：[docs/deploy/README.md:32-51](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/docs/deploy/README.md#L32-L51)

作者把公网准入放在独立中继与反向隧道，非本插件认证。

<details>
<summary>查看原文（20行）</summary>

````text
```text
手机 / 外网
  └─ HTTPS  https://dsh.example.com        nginx：TLS 终止、关 SSE 缓冲
       └─ http://127.0.0.1:3099            中继：令牌鉴权 + 路径白名单
            └─ http://127.0.0.1:3080       服务器上的 sshd 反向隧道端口
                 └─ ssh -R 隧道            由你的电脑主动连出
                      └─ 127.0.0.1:3080    DSH Web（dsh-in-hand 插件）
```

三个关键决定：

1. **中继跑在服务器上**，不在你家电脑上。这样公网入口只有 nginx 的 443，
   中继和隧道都只听 `127.0.0.1`；升级中继不用回家开电脑。
2. **反向隧道搬到 3080**（不是 3099）。服务器上的 `3080` 是 sshd 开的回环端口，
   中继的 `RELAY_UPSTREAM` 就指向它。
3. **中继有自己的令牌**，和 DSH 插件无关。它管的是「谁能通过这个公网入口」，
   手机第一次用令牌或 6 位配对码换一张 30 天 cookie。

> 本插件自己**不做鉴权**，只监听回环。所以 **绝对不要把 DSH 的 3080 直接暴露到公网**，
> 公网只能经过中继这一层。
````

</details>

**依据 8 · 作者声明**：[SECURITY.md:31-48](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/SECURITY.md#L31-L48)

旧安全说明仍写v2与旧边界，不应代替当前源码判断。

<details>
<summary>查看原文（18行）</summary>

```text
## 鉴权现状（照实写）

**插件层：没有令牌、没有 basic auth、没有 `remoteAddress` 检查。** `lib/index.js` 里搜不到
任何 `isLoopback` / `Authorization` / cookie 校验；`/taskwatch/chat/*` 这些**写**入口和
`/taskwatch/data` 这类只读入口在鉴权上一视同仁。这是有意的分工（见 `lib/index.js` 第 855 行
起的注释：TLS + 令牌由中继承担），代价是：**谁能连上宿主端口，谁就能驱动 agent。**

「看起来像门禁、其实不是」的四处，写清免得误判：

1. **换路票据**（`lib/ticket.js`）：`v2.<exp>.<nonce>.<hmac>`，HMAC-SHA256，密钥在
   `<家目录>/.dsh/taskwatch-ticket.key`（`TASKWATCH_TICKET_SECRET` 可覆盖；没有就生成 32 字节随机值，
   POSIX 下 `chmod 600`，Windows 下 `icacls /inheritance:r /grant:r <user>:F`）。TTL **60 秒**，
   最大跨度 180 秒。它证明「这张票是本机签的、没被改过、还没过期」，**不是**「这张票只能用一次」：
   跨进程无法共享已用状态，只在各进程内做 nonce 去重（上限 1024 条）。窗口期内理论可重放一次——
   代码注释里自己写明白了。
2. **跨站门禁**（`isCrossSite`）：只加在 `POST /taskwatch/ticket` 一条上，看 `Sec-Fetch-Site` 与
   `Origin` 是否与 `Host` 同源。**`curl` 或任何非浏览器客户端不带 `Origin` 就直接放行**——
   它挡的是浏览器里的第三方页面，不是人。
```

</details>

#### 缺口

- 独立中继的认证、配对、路径白名单和会话撤销未在本次材料中核实。
  **影响**：不能推荐公网或多人部署，也不能把插件设备账本当作身份系统。
  **进一步探讨**：在明确部署拓扑与固定中继版本后，核验绕过中继、清cookie、撤销和重启后的访问结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 文件、上传和通知把数据交给谁，有哪些副作用？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

路径下载有两种边界：默认允许根下文件，resolveTarget 再用realpath复查；带sessionId时从该会话可见消息中的绝对路径构造集合，resolveSessionTarget要求请求路径已被引用，符号链接真实目标也须在集合中，再检查类型和大小。会话消息出现路径因此成为放行条件，不能理解成用户逐文件批准；模型可见文本也可能扩大这份集合。附件id分支直接委托宿主附件服务读取，限制为宿主接口与大小，不沿同一会话路径白名单。没有本轮宿主侧实现检查，不能声称所有附件id读都按会话隔离。

上传走宿主图像/文件服务，插件记录与sessionId绑定的不透明token或receipt；send校验整批归属并锁定，只有宿主accepted才消费，失败解锁。这避免同一进程的附件重复消费，但文本发送每次都在服务器新建requestId，页面网络失败保留草稿允许重试；当宿主已接收而回执丢失时，本组件未保留可供重试复用的稳定请求标识，因此不能保证消息只发送一次。用户应先查同一会话再重发。取消传递也不证明宿主副作用停止或上传文件被回滚。

通知属于可选外发通道。源码从待办标题和detail截取摘要，移除控制字符、折叠空白，并未识别敏感路径或秘密；随后把同一文本发往飞书、Server酱或自配webhook。截短不是脱敏，若说明前部已有敏感信息仍会进入通道。响应被取消读取且只按HTTP 2xx判成功，因此测试“发送成功”不证明手机最终收到。SECURITY旧稿“没有对外请求/只写密钥”等说法与现有通知、审计等代码不一致，不能继承为保密承诺。

#### 证据与依据

**依据 1 · 源码核查**：[lib/files.js:175-195](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/files.js#L175-L195)

默认路径真实位置、类型及大小检查。

<details>
<summary>查看原文（21行）</summary>

```text
  let real
  try {
    real = realpathSync(abs)
  } catch {
    return { ok: false, error: 'not-found' }
  }
  // 复查真实路径：根目录里存在指向外部的符号链接时，上面的字符串检查会放行。
  if (!list.some((r) => withinRoot(real, r))) return { ok: false, error: 'outside-roots' }

  let st
  try {
    st = statSync(real)
  } catch {
    return { ok: false, error: 'not-found' }
  }
  if (!st.isFile()) return { ok: false, error: 'not-a-file' }
  if (st.size > MAX_BYTES) return { ok: false, error: 'too-large', bytes: st.size }

  const base = basename(real)
  const name = sniffed && types.ext && !base.toLowerCase().endsWith(types.ext) ? base + types.ext : base
  return { ok: true, abs: real, mime: types.mime, bytes: st.size, name, kind: kindOf(types.mime) }
```

</details>

**依据 2 · 源码核查**：[lib/files.js:263-273](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/files.js#L263-L273)

会话白名单来自消息可见text中的绝对路径。

<details>
<summary>查看原文（11行）</summary>

```text
/** 会话消息 → 路径集合。只读 `text`（页面里能看见的那部分），不看工具参数。 */
export function buildSessionWhitelist(messages, home, platform = process.platform) {
  const set = new Set()
  for (const m of Array.isArray(messages) ? messages : []) {
    if (!m || typeof m !== 'object') continue
    for (const p of pathsInText(m.text)) {
      const key = pathKey(p, home, platform)
      if (key) set.add(key)
    }
  }
  return set
```

</details>

**依据 3 · 源码核查**：[lib/files.js:284-334](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/files.js#L284-L334)

会话路径、符号链接目标、文件类型与大小的实际边界。

<details>
<summary>查看原文（51行）</summary>

```text
export function resolveSessionTarget(input, allowed, opts = {}) {
  const {
    home = homedir(),
    platform = process.platform,
    limit = MAX_SESSION_BYTES,
    statSync: stat = statSync,
    realpathSync: realpath = realpathSync,
  } = opts
  if (typeof input !== 'string' || !input.trim()) return { ok: false, error: 'missing-path' }
  if (input.indexOf('\u0000') >= 0) return { ok: false, error: 'bad-path' }
  const text = input.trim()
  // `..` 直接在字符串层拒掉：即使归一化后恰好落回白名单，也不接受穿越写法。
  if (/(^|[\\/])\.\.([\\/]|$)/.test(text)) return { ok: false, error: 'outside-roots', reason: 'traversal' }
  const raw = expandHome(text, home)
  if (!isAbsolute(raw)) return { ok: false, error: 'not-absolute' }
  const abs = resolve(raw)
  const key = platform === 'win32' ? abs.toLowerCase() : abs
  const has = allowed && typeof allowed.has === 'function' ? (k) => allowed.has(k) : () => false
  if (!has(key)) return { ok: false, error: 'outside-roots', reason: 'not-referenced' }

  let real
  try {
    real = realpath(abs)
  } catch {
    // 断链 / 不存在：`realpath` 会抛，这里统一按 not-found（路由映射成 403）。
    return { ok: false, error: 'not-found' }
  }
  let st
  try {
    st = stat(real)
  } catch {
    return { ok: false, error: 'not-found' }
  }
  if (!st.isFile()) return { ok: false, error: 'not-a-file', reason: 'not-a-file' }
  // 符号链接：请求路径在白名单里不代表它指向的地方也在。真实路径必须自己也被引用过。
  const realKey = platform === 'win32' ? real.toLowerCase() : real
  if (realKey !== key && !has(realKey)) return { ok: false, error: 'outside-roots', reason: 'symlink-escape' }
  if (st.size > limit) return { ok: false, error: 'too-large', bytes: st.size }

  // 类型仍走原白名单（含魔数识别）；.svg / .html / .js 不放宽。
  let types = mimeFor(real)
  let sniffed = false
  if (!types.ok && types.error === 'unsupported-type') {
    types = sniffMime(real)
    sniffed = true
  }
  if (!types.ok) return { ok: false, error: types.error, ext: types.ext }

  const base = basename(real)
  const name = sniffed && types.ext && !base.toLowerCase().endsWith(types.ext) ? base + types.ext : base
  return { ok: true, abs: real, mime: types.mime, bytes: st.size, name, kind: kindOf(types.mime) }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:2292-2318](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L2292-L2318)

附件id路径直接调用宿主readFileStream，未在此分支绑定sessionId。

<details>
<summary>查看原文（27行）</summary>

```text
        if (id) {
          const store = ctx.get('attachments')
          if (!store) { fail('host-without-attachments', 501); return }
          const label = (url.searchParams.get('name') || '').replace(/["\\\r\n]/g, '_')

          if (url.searchParams.get('kind') === 'file') {
            try {
              const chunks = []
              let total = 0
              for await (const chunk of store.readFileStream({ attachmentId: id })) {
                total += chunk.length
                if (total > MAX_BYTES) { fail('too-large', 413, { bytes: total }); return }
                chunks.push(Buffer.from(chunk))
              }
              const body = Buffer.concat(chunks)
              if (wantInfo) {
                send(res, 200, 'application/json; charset=utf-8', JSON.stringify({
                  name: label || id, bytes: body.length, mime: 'application/octet-stream', kind: 'file',
                }))
                return
              }
              send(res, 200, 'application/octet-stream', body, {
                'cache-control': 'private, max-age=300',
                'content-disposition': dispositionFor('application/octet-stream', label || id),
              })
            } catch (e) {
              fail('attachment-read-failed', 404, { detail: why(e) })
```

</details>

**依据 5 · 源码核查**：[lib/index.js:2874-2907](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L2874-L2907)

上传保存并产生与会话绑定的token/receipt。

<details>
<summary>查看原文（34行）</summary>

```text
            await requireUploadAgent(sessionId)
            lifetime.signal.throwIfAborted()
            const measure = { bytes: 0 }
            if (kind === 'image') {
              if (!IMAGE_TYPES.has(mime)) throw new Error('只支持 PNG、JPEG、WEBP、GIF 图片')
              const store = ctx.get('attachments')
              if (!store || typeof store.saveImage !== 'function') throw new Error('宿主没有图片附件服务')
              const ref = await store.saveImage({ data: await readBytes(req, MAX_BYTES, lifetime.signal, measure), mediaType: mime, ...(name ? { name } : {}) })
              lifetime.signal.throwIfAborted()
              if (!ref || !Number.isSafeInteger(ref.bytes) || ref.bytes < 0 || ref.bytes > MAX_BYTES) throw new Error('图片处理后超过 32 MB 或附件信息无效')
              const token = randomUUID()
              rememberUpload('image:' + token, { sessionId, kind, ref, bytes: Math.max(measure.bytes, ref.bytes), createdAt: Date.now() })
              json(res, 200, { ok: true, upload: {
                kind: 'image', token, name: ref.name || name || '图片', bytes: ref.bytes,
                mime: ref.mediaType, width: ref.width, height: ref.height,
              } })
              return
            }
            const uploads = ctx.get('fileUploads')
            if (!uploads || typeof uploads.uploadStream !== 'function') throw new Error('宿主没有文件上传服务')
            const value = await uploads.uploadStream({
              sessionId,
              data: limitedChunks(req, MAX_BYTES, lifetime.signal, measure),
              signal: lifetime.signal,
              ...(name ? { name } : {}),
            })
            lifetime.signal.throwIfAborted()
            if (!value || !asText(value.receiptId) || !value.file || value.file.bytes !== measure.bytes) throw new Error('宿主返回了无效的文件上传信息')
            rememberUpload('file:' + value.receiptId, { sessionId, kind, ref: value.file, bytes: measure.bytes, createdAt: Date.now() })
            json(res, 200, { ok: true, upload: {
              kind: 'file', receiptId: String(value.receiptId),
              name: value.file && value.file.name ? value.file.name : name || '文件',
              bytes: value.file && value.file.bytes ? value.file.bytes : 0,
            } })
```

</details>

**依据 6 · 源码核查**：[lib/index.js:3077-3091](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L3077-L3091)

附件批次归属校验和发送锁定。

<details>
<summary>查看原文（15行）</summary>

```text
            // 先原子校验/锁定整批元数据，再做异步读盘，失败时解锁而不消费。
            for (const item of uploads) {
              if (!item || typeof item !== 'object') throw new Error('附件格式无效')
              const kind = asText(item.kind)
              if (kind !== 'image' && kind !== 'file') throw new Error('附件类型无效')
              const key = kind + ':' + asText(kind === 'image' ? item.token : item.receiptId)
              const record = pendingUploads.get(key)
              if (!record || record.sessionId !== sessionId || record.kind !== kind) throw new Error('附件已失效或不属于当前会话，请重新上传')
              if (seen.has(key)) throw new Error('请勿重复添加同一个附件')
              if (record.sending) throw new Error('附件正在发送，请勿重复提交')
              seen.add(key)
              totalBytes += record.bytes
              if (totalBytes > MAX_BYTES) throw new Error('每条消息的附件总大小不能超过 32 MB')
              record.sending = true
              locked.push({ key, record, item })
```

</details>

**依据 7 · 源码核查**：[lib/index.js:3142-3163](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L3142-L3163)

每次请求生成新requestId，accepted后消费附件；无原请求id重试入口。

<details>
<summary>查看原文（22行）</summary>

```text
            nowRequested = wantNow
            const request = {
              requestId: randomUUID(),
              sessionId,
              mode: (wantNow || body.mode === 'steer') ? 'steer' : 'queue',
              content,
            }
            if (asText(body.timeZone)) request.clientTimeZone = asText(body.timeZone)
            const value = await chatOf().prompt(request, lifetime.signal)
            if (!value || value.accepted !== true) throw new Error('宿主未接收消息，请重试')
            for (const { key, record } of locked) if (pendingUploads.get(key) === record) pendingUploads.delete(key)
            if (!res.destroyed && !res.writableEnded) json(res, 200, { ok: true, accepted: true })
          } catch (e) {
            if (!res.destroyed && !res.writableEnded) {
              // 老客户端只认 200 + {error}，保持原契约；带 now 的新语义失败用 502，
              // 让调用方能和「参数不对」（仍是 200 + 文本）分开。
              if (nowRequested) failJson(res, 502, 'host-rejected', '立即发送失败：' + why(e))
              else json(res, 200, { error: why(e) })
            }
          } finally {
            for (const { record } of locked) record.sending = false
            lifetime.dispose()
```

</details>

**依据 8 · 源码核查**：[lib/index.js:4922-4959](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L4922-L4959)

通知摘要只有截短和空白清理，并非敏感信息识别。

<details>
<summary>查看原文（38行）</summary>

```text
function notifyBrief(item) {
  if (item && item.kind === 'question') {
    return '提问 · ' + clipNotifyText(asText(item.title), NOTIFY_REASON_MAX)
  }
  const name = asText(item && item.title) || '(tool)'
  const reason = clipNotifyText(asText(item && item.detail), NOTIFY_REASON_MAX)
  return name + (reason ? ' · ' + reason : '')
}

/** 折叠空白、去掉控制字符、按字符数截断并补省略号。 */
export function clipNotifyText(raw, max = NOTIFY_REASON_MAX) {
  const flat = String(raw == null ? '' : raw)
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!flat) return ''
  return flat.length > max ? flat.slice(0, max) + '…' : flat
}

/** 正文口径（纯函数，测试直接钉住）：
 *    1 件事等你：pwsh · 删除 build/cache 下的…
 *    3 件事等你：
 *    · pwsh · 删除 build/cache 下的过期产物
 *    · 提问 · 发布窗口
 *    · pwsh · 在仓库根目录执行 npm publish…
 *    还有 2 件
 *  已 settle 的条目不算「等你」，和 /taskwatch/data 的口径一致。 */
export function buildNotifyText(pending) {
  const list = Array.isArray(pending) ? pending.filter((p) => p && !p.settled) : []
  if (!list.length) return ''
  const head = list.length + ' 件事等你'
  if (list.length === 1) return (head + '：' + notifyBrief(list[0])).slice(0, NOTIFY_TEXT_MAX)
  const shown = list.slice(0, 3)
  const lines = [head + '：']
  for (const item of shown) lines.push('· ' + notifyBrief(item))
  if (list.length > shown.length) lines.push('还有 ' + (list.length - shown.length) + ' 件')
  const text = lines.join('\n')
  return text.length > NOTIFY_TEXT_MAX ? text.slice(0, NOTIFY_TEXT_MAX) + '…' : text
```

</details>

**依据 9 · 源码核查**：[lib/index.js:5033-5055](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L5033-L5055)

通知向外POST并按HTTP状态判断，不读取供应商业务回执。

<details>
<summary>查看原文（23行）</summary>

```text
  async function attempt(channel, text) {
    const payload = buildNotifyPayload(channel, text)
    // serverchan 的地址永远由 key 现拼（文件里没有 URL）；其余通道用存下来的地址。
    const target = channel && channel.type === 'serverchan'
      ? (channel.key ? serverchanEndpoint(channel.key, serverchanBase) : '')
      : (channel && channel.url)
    if (!target) return { ok: false, status: 0, error: '没有可用的地址或 SendKey' }
    const controller = new AbortController()
    const timer = setTimeout(() => { try { controller.abort() } catch { /* 已结束 */ } }, Math.max(1, timeoutMs))
    if (timer && typeof timer.unref === 'function') timer.unref()
    try {
      const response = await fetchImpl(target, {
        method: 'POST',
        headers: { 'content-type': payload.contentType, 'user-agent': 'dsh-in-hand-notify' },
        body: payload.body,
        signal: controller.signal,
        redirect: 'follow',
      })
      const status = response && typeof response.status === 'number' ? response.status : 0
      // 回执不读、不记：对方返回什么与我们无关，而回执文本有可能把地址带回来。
      try { if (response && response.body && typeof response.body.cancel === 'function') await response.body.cancel() } catch { /* 已关闭 */ }
      if (status >= 200 && status < 300) return { ok: true, status, error: '' }
      return { ok: false, status, error: status ? 'HTTP ' + status : '发送失败' }
```

</details>

**依据 10 · 作者声明**：[SECURITY.md:74-84](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/SECURITY.md#L74-L84)

旧稿无外发及只写一个文件的陈述不能作为当前结论。

<details>
<summary>查看原文（11行）</summary>

```text
## 数据与副作用

- **写**：插件只写一个文件——票据密钥 `<家目录>/.dsh/taskwatch-ticket.key`（见上）。
  它不写会话、不写配置、不做存档；状态全在内存（`pendingUploads`、票据 Map、ETag 缓存）。
- **读**：自己的 `lib/` 资源（`page.html`、`sw.js`、manifest、图标）；白名单根下的交付文件；
  通过宿主服务读会话、附件、任务、子代理、目标。不列目录。
- **网络**：`lib/` 里**没有任何对外请求**（无 `fetch`、无 `node:http` 客户端）。所有网络行为都是
  「响应手机/中继发来的请求」。
- **遥测**：无。不上传对局、不上报使用情况、不带账号信息。
- **真正的重副作用是「替你在宿主上点按钮」**：`/chat/send` 等于用宿主权限驱动 agent，
  而 DSH 默认 preset 往往是 `danger-full-access`——这条是设计，也是本插件最该被认真对待的能力。
```

</details>

#### 缺口

- 宿主附件读取的会话授权以及文件写入后取消的回滚语义未核实。
  **影响**：不能把本插件参数校验提升为端到端数据隔离或无残留保证。
  **进一步探讨**：读取对应宿主固定实现并在隔离环境检查跨会话id、断连和取消后状态。
- 通知供应商业务成功与实际送达未取得结果。
  **影响**：HTTP2xx只能证明被服务接受到该层，不证明用户看到通知。
  **进一步探讨**：对固定通知通道核对业务回执与收件侧结果，敏感任务先关闭外发通道。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 部署、持续运行及恢复成本和效果证据如何约束选择？

**研究主题**：效果与总成本、依赖、兼容与流程、采用判断

#### 完整回答

启动声明为Node至少20、DSH至少0.2.1-rc.2且低于0.3.0，但会话发送、附件与审批依赖具体宿主服务契约，声明版本不是兼容验收。局域网直连依赖可信网络；远程使用还要独立中继、域名/TLS、隧道及凭据管理，用户承担主机和网络运维。手机浏览器、系统后台限制、推送服务也影响是否及时看到卡片。演示截图与作者说明只能证明所声称交互，不能计算任务处理成功率或节时。

首次投入是安装重启、检查端口暴露范围、部署或复用中继、配对和确认消息/审批链；持续投入是宿主和中继升级、网络与浏览器状态、密钥和通知配置管理；恢复投入是查清已处理审批、未知消息回执和缓存/上传残留。现金与人工工时均缺少计量，不能用“不装App”推断低成本。停止手机入口应关闭或限制相关网络入口并停用bundle，回到桌面会话；此前已被宿主接受的消息、工具决定和外发通知不能通过关页面撤销。

当前建议观察。离桌面交接有明确机制增量，但Q03的准入由外部部署承担，Q02的离线认领与Q04的回执未知又要求额外人工核对。若已有可信单用户网络，可先研究只读状态与一条无敏感副作用的消息，合格判据为同会话内容一致、异常提示与实际状态可对应；任何匿名直连、撤销后误以为禁用或重复消息现象，都应停止手机写入口并退回桌面。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:33-35](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/package.json#L33-L35)

声明Node与DSH范围，不能替代运行结果。

```text
  "engines": {
    "node": ">=20",
    "dsh": ">=0.2.1-rc.2 <0.3.0"
```

**依据 2 · 作者声明**：[docs/deploy/README.md:32-51](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/docs/deploy/README.md#L32-L51)

远程拓扑包含TLS、中继、反向隧道，说明额外运维条件。

<details>
<summary>查看原文（20行）</summary>

````text
```text
手机 / 外网
  └─ HTTPS  https://dsh.example.com        nginx：TLS 终止、关 SSE 缓冲
       └─ http://127.0.0.1:3099            中继：令牌鉴权 + 路径白名单
            └─ http://127.0.0.1:3080       服务器上的 sshd 反向隧道端口
                 └─ ssh -R 隧道            由你的电脑主动连出
                      └─ 127.0.0.1:3080    DSH Web（dsh-in-hand 插件）
```

三个关键决定：

1. **中继跑在服务器上**，不在你家电脑上。这样公网入口只有 nginx 的 443，
   中继和隧道都只听 `127.0.0.1`；升级中继不用回家开电脑。
2. **反向隧道搬到 3080**（不是 3099）。服务器上的 `3080` 是 sshd 开的回环端口，
   中继的 `RELAY_UPSTREAM` 就指向它。
3. **中继有自己的令牌**，和 DSH 插件无关。它管的是「谁能通过这个公网入口」，
   手机第一次用令牌或 6 位配对码换一张 30 天 cookie。

> 本插件自己**不做鉴权**，只监听回环。所以 **绝对不要把 DSH 的 3080 直接暴露到公网**，
> 公网只能经过中继这一层。
````

</details>

**依据 3 · 源码核查**：[lib/index.js:2651-2657](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L2651-L2657)

运行时查找sessionController，缺失则对话不可用。

```text
      const svc = ctx.get('sessionController')
      if (svc === undefined) {
        if (!chatWarned) {
          chatWarned = true
          console.error('dsh-in-hand: 没有 sessionController 服务，对话接口会返回错误（只读页面不受影响）')
        }
        throw new Error('这个部署没有 sessionController 服务，对话功能不可用')
```

**依据 4 · 源码核查**：[lib/index.js:1559-1586](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L1559-L1586)

未知设备自动放行使网络边界成为采用前提。

<details>
<summary>查看原文（28行）</summary>

```text
  /** 认设备：没有就发一张新身份（老客户端不会因此下线），被撤销则回 ok:false。
   *  老会话（有 tw-route 换路标记、没有 twd）在这里补绑，不踢下线。 */
  function ensureDevice(req, res) {
    const cookies = readCookies(req)
    const via = requestVia(req)
    const ua = asText(req && req.headers && req.headers['user-agent'])
    const raw = asText(cookies[DEVICE_COOKIE])
    const found = raw ? deviceLedger.find(raw) : null
    if (found && found.record.revoked) {
      return {
        ok: false, revoked: true, id: found.id, record: found.record,
        digest: deviceLedger.digest(found.id), via, fresh: false,
      }
    }
    let id = found ? found.id : ''
    let record = id ? deviceLedger.touch(id, { ua, via }) : null
    let fresh = false
    if (!record) {
      id = randomUUID()
      record = deviceLedger.ensure(id, { ua, via })
      fresh = true
      // 老会话补绑：v1.6–v1.8.6 的页面只有 tw-route 标记，没有设备 cookie。
      if (cookies['tw-route']) deviceLedger.bind(id, { via, kind: 'legacy-session' })
      addCookie(res, deviceCookie(id))
    }
    const info = { id, record, fresh, via, digest: deviceLedger.digest(id) }
    try { req.taskwatchDevice = info } catch { /* 只读请求对象 */ }
    return { ok: true, ...info }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:3142-3163](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L3142-L3163)

回执未知与副作用恢复应计入人工投入。

<details>
<summary>查看原文（22行）</summary>

```text
            nowRequested = wantNow
            const request = {
              requestId: randomUUID(),
              sessionId,
              mode: (wantNow || body.mode === 'steer') ? 'steer' : 'queue',
              content,
            }
            if (asText(body.timeZone)) request.clientTimeZone = asText(body.timeZone)
            const value = await chatOf().prompt(request, lifetime.signal)
            if (!value || value.accepted !== true) throw new Error('宿主未接收消息，请重试')
            for (const { key, record } of locked) if (pendingUploads.get(key) === record) pendingUploads.delete(key)
            if (!res.destroyed && !res.writableEnded) json(res, 200, { ok: true, accepted: true })
          } catch (e) {
            if (!res.destroyed && !res.writableEnded) {
              // 老客户端只认 200 + {error}，保持原契约；带 now 的新语义失败用 502，
              // 让调用方能和「参数不对」（仍是 200 + 文本）分开。
              if (nowRequested) failJson(res, 502, 'host-rejected', '立即发送失败：' + why(e))
              else json(res, 200, { error: why(e) })
            }
          } finally {
            for (const { record } of locked) record.sending = false
            lifetime.dispose()
```

</details>

#### 缺口

- 没有同任务全部尝试、处理时延、人工核对和部署费用记录。
  **影响**：无法判定端到端收益是否足以覆盖部署与恢复负担。
  **进一步探讨**：固定一组离桌面任务记录等待、失败、重复、回桌面次数与现金/工时，保留全部尝试。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 已查机制能支持什么新假设，怎样证伪？

**研究主题**：新假设与验证、采用判断

#### 完整回答

由Q02认领后不持续观察在线状态、Q03设备身份自动发放及Q04发送回执未知，可提出未验证设计假设：把接入身份、审批认领和消息提交拆成由服务器维护的三个明确状态契约。准入应由有固定授权依据的服务拒绝未配对身份，撤销记录须跨重启保留；审批应持有可失效的在线租约，租约失效决定交还；消息由客户端生成稳定请求id，服务端提供按id查询已接收状态，重试复用同id。相对当前的cookie记号、一次在线检查和每次新UUID，这保留了用户决定是否重试需要的信息。它不是当前插件能力，不能写进正向能力表或创新分。

最小验证分三组：撤销后清cookie及重启不能重新获得写准入；认领后关闭SSE和轮询在规定租约时间内只交还一次；宿主接收消息后丢弃HTTP回执，客户端以同id重试不能产生第二条消息。还要核对正常移动网络抖动是否造成频繁误撤销或误交还。若加入状态后仍可匿名重获写权、发生双重决定/重复消息，或为维持租约带来的误中断高于原流程，则削弱方案。实际能否节省人工仍需Q05同任务成本对照，不能由协议样例通过推出商业价值。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1559-1586](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L1559-L1586)

自动身份补发支持将准入与设备展示分离的假设。

<details>
<summary>查看原文（28行）</summary>

```text
  /** 认设备：没有就发一张新身份（老客户端不会因此下线），被撤销则回 ok:false。
   *  老会话（有 tw-route 换路标记、没有 twd）在这里补绑，不踢下线。 */
  function ensureDevice(req, res) {
    const cookies = readCookies(req)
    const via = requestVia(req)
    const ua = asText(req && req.headers && req.headers['user-agent'])
    const raw = asText(cookies[DEVICE_COOKIE])
    const found = raw ? deviceLedger.find(raw) : null
    if (found && found.record.revoked) {
      return {
        ok: false, revoked: true, id: found.id, record: found.record,
        digest: deviceLedger.digest(found.id), via, fresh: false,
      }
    }
    let id = found ? found.id : ''
    let record = id ? deviceLedger.touch(id, { ua, via }) : null
    let fresh = false
    if (!record) {
      id = randomUUID()
      record = deviceLedger.ensure(id, { ua, via })
      fresh = true
      // 老会话补绑：v1.6–v1.8.6 的页面只有 tw-route 标记，没有设备 cookie。
      if (cookies['tw-route']) deviceLedger.bind(id, { via, kind: 'legacy-session' })
      addCookie(res, deviceCookie(id))
    }
    const info = { id, record, fresh, via, digest: deviceLedger.digest(id) }
    try { req.taskwatchDevice = info } catch { /* 只读请求对象 */ }
    return { ok: true, ...info }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1114-1166](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L1114-L1166)

当前一次在线判断与等待Promise支持租约化认领的推导。

<details>
<summary>查看原文（53行）</summary>

```text
      const aborted = Boolean(req && req.signal && req.signal.aborted)
      if (approveFromPhone && !aborted && isPhoneOnline()) {
        claim = broker.begin({ session, toolName, reason, signal: req ? req.signal : null, risk })
        entry.id = claim.id
        entry.expiresAt = claim.expiresAt
        entry.canDecide = true
        onPending(pendingKey, entry)
        pendingByDecision.set(claim.id, entry)
        try {
          onBroadcast({
            type: 'approval',
            state: 'pending',
            id: claim.id,
            session,
            toolName,
            reason: String(reason).slice(0, 240),
            risk,
            expiresAt: claim.expiresAt,
          })
        } catch { /* 推送失败不影响等待 */ }
      }
    } catch (e) {
      // 内部异常也要留审计：outcome=error / by=error。错误消息可能带命令内容，
      // 所以只记会话与工具名，不把 e.message 写进去。
      try {
        audit({
          at: new Date(now()).toISOString(),
          session,
          toolName,
          outcome: 'error',
          by: 'error',
        })
      } catch { /* 审计失败不影响主链路 */ }
      try { onError(e, { session, toolName, reason }) } catch { /* 观测失败不影响主链路 */ }
      if (pendingKey) onRelease(pendingKey)
      return await next()
    }

    if (!claim) {
      try { return await next() } finally { if (pendingKey) onRelease(pendingKey) }
    }

    const result = await claim.promise
    if (entry) {
      entry.canDecide = false
      entry.settled = true
    }
    pendingByDecision.delete(claim.id)
    if (result.delegated) {
      try { return await next() } finally { if (pendingKey) onRelease(pendingKey) }
    }
    if (pendingKey) onRelease(pendingKey)
    return result.outcome
```

</details>

**依据 3 · 源码核查**：[lib/index.js:2487-2499](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L2487-L2499)

关闭连接不结算请求，提供失效触发点线索。

<details>
<summary>查看原文（13行）</summary>

```text
        approvalStreams.add(res)
        markPhoneSeen()
        const heartbeat = setInterval(() => {
          try { res.write(': ping\n\n') } catch { /* 连接已断，close 事件会收尾 */ }
        }, 20 * 1000)
        if (heartbeat && typeof heartbeat.unref === 'function') heartbeat.unref()
        const done = () => {
          clearInterval(heartbeat)
          approvalStreams.delete(res)
        }
        req.on('close', done)
        res.on('close', done)
        res.on('error', done)
```

</details>

**依据 4 · 源码核查**：[lib/index.js:3142-3153](https://github.com/dingchenhui0618-arch/dsh-in-hand/blob/3484991a9668c18919019067a634944648f2b0a5/lib/index.js#L3142-L3153)

服务端临时请求id支持稳定提交标识与查询的改进方向。

<details>
<summary>查看原文（12行）</summary>

```text
            nowRequested = wantNow
            const request = {
              requestId: randomUUID(),
              sessionId,
              mode: (wantNow || body.mode === 'steer') ? 'steer' : 'queue',
              content,
            }
            if (asText(body.timeZone)) request.clientTimeZone = asText(body.timeZone)
            const value = await chatOf().prompt(request, lifetime.signal)
            if (!value || value.accepted !== true) throw new Error('宿主未接收消息，请重试')
            for (const { key, record } of locked) if (pendingUploads.get(key) === record) pendingUploads.delete(key)
            if (!res.destroyed && !res.writableEnded) json(res, 200, { ok: true, accepted: true })
```

</details>

#### 缺口

- 租约、持久撤销和请求查询尚未实现，且需要宿主或中继协作。
  **影响**：只能作为待验证协议设计，不代表本组件已有安全或可靠性能力。
  **进一步探讨**：先对固定异常序列检查单次结算和去重，再比较移动网络下的误中断与维护负担。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
