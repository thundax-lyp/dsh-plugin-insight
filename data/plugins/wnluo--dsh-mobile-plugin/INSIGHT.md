# DSH Mobile Plugin

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[da27f47](https://github.com/WNLUO/dsh-mobile-plugin/tree/da27f478b4e5c3a0030f8db25ea54883435a0265)

<!-- BEGIN META -->
[![GitHub ★ 38](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=38&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WNLUO/dsh-mobile-plugin) [![npm 30d 75,541](https://img.shields.io/static/v1?label=npm+30d&message=75%2C541&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mobile-plugin) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mobile-plugin)
<!-- END META -->

> **功能**：提供手机连接 DSH 宿主的配对、会话、文件与远程控制接口。

> **亮点**：把会话事件、操作与配对凭据接到手机可访问的接口，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：旧设备权限兼容和协议 v2 条件同时存在，需确认部署实际走哪条路径，见 [Q02](#research-q02)。

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
  - [Q01 · 离开电脑时，手机能接续 DSH 的哪些操作？](#detail-section-11)
  - [Q02 · 配对之后，设备权限和信封协议如何生效？](#detail-section-12)
  - [Q03 · 手机发送超时后，宿主怎样避免重复提交？](#detail-section-13)
  - [Q04 · 如何用低风险操作估算接入收益？](#detail-section-14)
  - [Q05 · 在发送后显示宿主接受和运行结果的不同状态能否减少误操作？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合离开电脑后仍需查看或接续当前 DSH 会话的人，见 [Q01](#research-q01)。

从桌面继续会话，离开后用远程桌面查看和操作。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 移动配对 | 签发、访问与撤销 | 区分新旧设备记录 |
| 会话接续 | 发送提示并观察事件 | accepted 只确认接收 |
| 设备权限 | 限制移动路由 | 旧记录兼容全权 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 会话与路由服务 | 桌面继续使用 |
| 手机客户端和 LAN | 手机连接时 | 设备配对与会话流 | 先局域网验收 |
| 中转与协议兼容 | 跨网时 | 取决于实际凭据及协议 | 撤销测试凭据 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 本地测试会话 | 固定公开输入 |
| 试用 | 配对、查看、续写 | 桌面核对结果和权限 |
| 退出 | 撤销配对 | 确认手机无法再访问 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主补丁和手机客户端 | 配对及权限配置 | 未测时长 |
| 持续 | 设备维护与跨网链路 | 核对接收和完成 | 未测节省时间 |
| 恢复 | 凭据撤销和重配 | 检查会话是否已接受 | 重启去重未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话接续 | 发送与事件流 | 手机显示及断线 |
| 安全边界 | 权限检查及协议 v2 防降级 | 旧凭据和中转兼容 |

> **思考**：旧设备权限兼容和协议 v2 条件同时存在，需确认部署实际走哪条路径，见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把会话事件、操作与配对凭据接到手机可访问的接口，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

设备权限、协议 v2 和会话幂等分别限定能力，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

旧设备权限兼容和协议 v2 条件同时存在，需确认部署实际走哪条路径，见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在受控局域网比较同一个测试会话，记录配对、续写和撤销，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认挂载、设备权限和普通提示去重边界，未运行宿主、客户端或中转。

- 已检查：作者 README、包清单、源码路径 README.md、lib/routes/mobile-api.js、lib/mobile/auth.js、lib/mobile/permissions.js、lib/http/routing.js、lib/impl.js、lib/mobile/session-send.js、lib/mobile/session-cache.js、cordis.patch.yml、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对宿主挂载、移动路由、权限与普通消息回执，未运行客户端或跨网中转。
- 下一步：用新旧凭据比较只读、撤销和协议降级，再测同 ID 断线续写。

**分析版本**

- **仓库**：[WNLUO/dsh-mobile-plugin](https://github.com/WNLUO/dsh-mobile-plugin)
- **版本号**：0.5.41（[固定提交 da27f47](https://github.com/WNLUO/dsh-mobile-plugin/tree/da27f478b4e5c3a0030f8db25ea54883435a0265)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

按请求 ID 区分已接受和事件确认，弱网下对照重复发送，见 [Q05](#research-q05)。

用新旧凭据比较只读、撤销和协议降级，再测同 ID 断线续写。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 2173 | — | — | 28833 |
| .js | source | 173 | 45181 | 29240 | 13303 | — |
| .cjs | source | 42 | 10570 | 6549 | 3435 | — |
| .mjs | source | 12 | 2839 | 2014 | 628 | — |
| .tsx | source | 33 | 6428 | 4861 | 1289 | — |
| .ts | source | 24 | 8183 | 7199 | 833 | — |
| .mjs | test | 2 | 557 | 449 | 67 | — |
| .cjs | test | 222 | 56480 | 44056 | 7764 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/WNLUO/dsh-mobile-plugin/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确认宿主端的会话接续、设备权限、协议兼容和重试边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 离开电脑时，手机能接续 DSH 的哪些操作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合已经让 DSH 在电脑执行任务，离开电脑后要看同一个会话、回应批准或发送下一条消息的人。插件把配对、发送和事件流接入宿主，移动端基于这些路由完成操作。浏览器远程桌面可以访问整个桌面，本包增量是会话级操作、设备凭据与手机接口。文件和审批的界面质量、弱网表现及真实设备同步还需复验。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:29-54](https://github.com/WNLUO/dsh-mobile-plugin/blob/da27f478b4e5c3a0030f8db25ea54883435a0265/README.md#L29-L54)

作者描述查看、聊天、审批与文件。

<details>
<summary>查看原文（26行）</summary>

```text
## 功能

### 会话与工作区

- 新建、接着聊、改名、搜索会话，也能从任意一条分出分支单独往下走。
- 工作区建、改名、删除、置顶、归档都在手机上完成，手机端排的顺序会同步回电脑。
- 回复逐块流式到达，跑到一半就能看见内容，工具调用也是实时的。
- 手机上读过，电脑那边的未读绿点跟着消失；电脑侧边栏的展开、折叠状态同步到手机，两边结构一样。

### 不用回电脑也能操作

- **审批与提问**：电脑上会弹的卡手机同样有，权限请求、选择题、多选、自定义回答都能直接点。
- **排队插话**：正在跑的时候补一句，按队列排在当前这一步之后。
- **Git**：看状态和 diff、暂存、提交、推送、切分支，提交信息可以先让模型写。
- **文件**：浏览目录、读文件，也能把手机上的文件传回电脑，落在固定的收件目录。
- **插件**：手机上的插件市场里搜索、安装、更新、卸载；插件自己也能升级到新版。
- **模型**：随时换模型，看有哪些渠道和可用模型，本机自建的渠道也能直接在手机上配。
- **日程与子代理**：定时任务能看、新建、改、暂停恢复、立刻跑一次、删掉；看正在跑的子代理，打断它或者补一句话。

### 连接

- 两种连法：经 relay v2 隧道从公网连回来，或者同一个 Wi-Fi 下走局域网直连。
- 配对码与配对策略可选，设备凭据能单独吊销，也能一次把全部撤掉。
- iOS 离线推送可选，不配也不影响其它功能。

移动 API 只开手机需要的口子（`/api/mobile/v1/*`）—— 不暴露 shell、系统设置与任意文件写入。
```

</details>

**依据 2 · 源码核查**：[lib/routes/mobile-api.js:270-296](https://github.com/WNLUO/dsh-mobile-plugin/blob/da27f478b4e5c3a0030f8db25ea54883435a0265/lib/routes/mobile-api.js#L270-L296)

配对入口。

<details>
<summary>查看原文（27行）</summary>

```text
  // 刻意**不**包 `guarded`：配对之前手机手上还没有任何凭据，包上就是死循环。豁免理由与
  // /health 一样登记在 test/mobile-routes.test.cjs 的 PUBLIC_ROUTES。
  //
  // 这条路径与局域网那条 `/__lan_pair` 是同一件事的两个入口，签发的是同一种 HMAC token；
  // 差别只在网络路径。旧实现把它长在独立的中转进程里，换成 Rust 中转时整块漏了搬，
  // 于是手机上点「配对并添加」收到的是宿主的 405。
  registerRoute({
    kind: 'exact',
    path: '/api/mobile/v1/pair',
    handler: pairing.createPairHandler({
      state,
      core,
      credentials: credentialsEntry(),
      pairingApproval,
      // 配对响应顺手把宿主当前的直连候选带回去（与 `/connection-info` 同一份取值）：
      // 手输公网地址配对时没有二维码，这是手机拿到内网地址的唯一机会。
      lanCandidates: safeLanCandidates,
      ipv6Candidates: safeIpv6Candidates,
      lanPort: lanPortInUse,
      // 批量同步导入的新手机带着 `ticketId` 来配：从这张券表取券当票据（一次性）。不传它就
      // 只认得面板二维码那张 state 票据。
      transferTickets,
      // 配对成功即换码 + 换票据（§5.1）：谁截了二维码，那张图从这一刻起就没用了。
      rotatePairing,
      // 协议 v2 的配对封包里要下发实例历史密钥（HK）。取值器惰性生成并落盘。
      getHistoryKey,
      log: (...args) => console.warn('[dsh-mobile-plugin] [pair]', ...args),
```

</details>

**依据 3 · 源码核查**：[lib/routes/mobile-api.js:416-425](https://github.com/WNLUO/dsh-mobile-plugin/blob/da27f478b4e5c3a0030f8db25ea54883435a0265/lib/routes/mobile-api.js#L416-L425)

会话发送路由。

<details>
<summary>查看原文（10行）</summary>

```text
  // 会话文件：允许本会话 present 声明的路径及会话工作区内的文件（见 mobile/session-file.js）。
  route('/api/mobile/v1/session/file', sessionFile.handleSessionFile)
  // 文件浏览器按绝对路径取字节，范围是宿主已登记的工作区及当前会话的项目目录
  //（见 mobile/file-read.js 与 mobile/allowed-zone.js）。
  route('/api/mobile/v1/file/read', fileRead.handleFileRead)
  route('/api/mobile/v1/session/send', sessions.handleSend)
  // 「这一发到底进没进」：App 的离线发件箱在重发之前先问一句（按 clientMessageId 回查
  // 会话正文）。只读、只看最近一窗，见 mobile/session-delivery.js。
  route('/api/mobile/v1/session/delivery', sessionDelivery.handleSessionDelivery)
  // 正文水位探针：App 进对话前先问一句「这条会话的正文到哪个水位了」，跟本地缓存水位
```

</details>

**依据 4 · 源码核查**：[lib/routes/mobile-api.js:454-465](https://github.com/WNLUO/dsh-mobile-plugin/blob/da27f478b4e5c3a0030f8db25ea54883435a0265/lib/routes/mobile-api.js#L454-L465)

会话事件流路由。

<details>
<summary>查看原文（12行）</summary>

```text
  // 把某一档设成「新会话默认吃的那一档」：写宿主 settings 的 agent-preset-registry，
  // 与桌面端预设页那颗「设为默认」同一格（不是预设自己的属性）。
  route('/api/mobile/v1/agent-presets/default', agentPresets.handleAgentPresetDefault)
  route('/api/mobile/v1/session/new', sessions.handleNew)
  route('/api/mobile/v1/session/stream', stream.handleStream)
  route('/api/mobile/v1/events/stream', events.handleDeviceStream)
  route('/api/mobile/v1/question/respond', questions.handleQuestionRespond)
  route('/api/mobile/v1/approval/respond', approvals.handleApprovalRespond)
  // 「这类以后都同意」的本机规则账：读列表 + 逐条撤销（撤销页用）。
  route('/api/mobile/v1/approval/rules', approvals.handleApprovalRules)
  route('/api/mobile/v1/approval/rules/revoke', approvals.handleApprovalRuleRevoke)
  route('/api/mobile/v1/session/goal', sessions.handleGoalAction)
```

</details>

#### 缺口

- 未核手机安装和实际操作
  **影响**：只可确认宿主提供这些入口
  **进一步探讨**：用同一会话在桌面与测试手机对照一次批准和续写

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配对之后，设备权限和信封协议如何生效？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

宿主先识别设备凭据，已知撤销或过期的凭据直接失败。路由按设备权限位判断，未分类路由失败关闭。缺权限字段的旧记录保留全权兼容。启用信封且记录有 deviceKey 时，缺少 v2 协议标记会报 e2ee-required，兼容的旧凭据可继续旧协议。README 对中转明文的说明与源码的 v2 条件有差异，任何部署的保护程度都要核对凭据、路径和手机协议。

#### 证据与依据

**依据 1 · 源码核查**：[lib/mobile/auth.js:75-95](https://github.com/WNLUO/dsh-mobile-plugin/blob/da27f478b4e5c3a0030f8db25ea54883435a0265/lib/mobile/auth.js#L75-L95)

设备凭据及兼容鉴权分支。

<details>
<summary>查看原文（21行）</summary>

```text
function authOutcome(req) {
  const presented = presentedCredential(req);
  if (presented) {
    const state = loadRelayState();
    if (state && state.instanceId) {
      const known = credentials.lookup(presented, state.instanceId);
      if (known) {
        if (known.revokedAt) return { ok: false, reason: 'revoked' };
        if (known.expiresAt && known.expiresAt <= Date.now()) return { ok: false, reason: 'expired' };
        // 还剩不到一半就顺手续期：所有设备会在同一天集体掉线，而这件事完全可以用一次
        // 现成的调用避免 —— 用户不需要为此做任何事。
        try { credentials.renew(known); } catch { /* 续期失败不影响这一次请求 */ }
        return { ok: true, record: known };
      }
      // 查不到就是「本机没签发过它」：可能是中转签的凭据（那条库在中转那边），也可能是
      // 升级前的 HMAC token。两种都往下走旧令牌校验，不在这里判死。
    }
  }
  const m = /^Bearer\s+([^\s]+)$/.exec(req.headers.authorization || '');
  if (m && verifyMobileToken(m[1])) return { ok: true };
  return { ok: false, reason: 'unauthorized' };
```

</details>

**依据 2 · 源码核查**：[lib/mobile/permissions.js:102-113](https://github.com/WNLUO/dsh-mobile-plugin/blob/da27f478b4e5c3a0030f8db25ea54883435a0265/lib/mobile/permissions.js#L102-L113)

旧记录和显式权限数组不同。

<details>
<summary>查看原文（12行）</summary>

```text
 * 「这条请求能不能做」。`record` 缺 `permissions`（老凭据）或没有记录（升级前 HMAC）都放行。
 * `permission` 为 null/空串（BASE 路由）也放行。
 */
function hasPermission(record, permission) {
  if (!permission) return true;
  // 没有记录 = 升级前 HMAC 那种无状态通行证，它本来就等于全权，不能一刀切拦住。
  if (!record || typeof record !== 'object') return true;
  const granted = record.permissions;
  // 字段缺失 / null = 全权（向后兼容的命门，别用 || 把空数组合成缺失）。
  if (!Array.isArray(granted)) return true;
  return granted.includes(permission);
}
```

</details>

**依据 3 · 源码核查**：[lib/http/routing.js:196-224](https://github.com/WNLUO/dsh-mobile-plugin/blob/da27f478b4e5c3a0030f8db25ea54883435a0265/lib/http/routing.js#L196-L224)

分类拒绝、权限不足和 v2 头降级检查。

<details>
<summary>查看原文（29行）</summary>

```text
    if (resolvePermission) {
      const need = resolvePermission(req.url || req.originalUrl || '', req.method)
      if (need === 'unknown') {
        // 没分类的路由 fail-closed：宁可这条功能报错，也别给它开一个静默的全权口子。
        return sendJson(res, 403, { ok: false, error: { code: 'permission-unclassified', message: '这条接口没有登记所需权限，暂不放行' } })
      }
      if (need && (!hasPermission || !hasPermission(req.__dshRecord, need))) {
        const granted = req.__dshRecord && Array.isArray(req.__dshRecord.permissions) ? req.__dshRecord.permissions.slice() : null
        return sendJson(res, 403, {
          ok: false,
          error: { code: 'permission-denied', message: '这台设备没有执行该操作的权限', required: need, granted },
        })
      }
    }

    // **被动降级要被发现，不能悄悄变明文**（§8.3(7) 的 `e2ee-required`）。
    //
    // 判据：这枚凭据的记录里有 `deviceKey`（说明它当初是按协议 v2 配的），而这条请求没带
    // `X-Dsh-Proto` —— 中转把那个头删掉时就是这个形状。不判的话宿主会按老协议解析一个
    // 信封 JSON，得到一个「请求体不是合法 JSON」的 400，看起来像 App 的 bug。
    // 老 App 的凭据里没有 `deviceKey`，不受这一条影响。
    const authRecord = req.__dshRecord
    if (envelope && authRecord && authRecord.deviceKey && !isProto2(req)) {
      return sendJson(res, 400, { ok: false, error: { code: 'e2ee-required', message: '这条会话是加密的，请用信封重发' } })
    }
    // 协议 v2：只有带 `X-Dsh-Proto: 2` 的请求才走信封。老客户端没有这个头，一字不改地照旧。
    let sealed = null
    if (envelope && isProto2(req)) {
      let rawBody
```

</details>

**依据 4 · 源码核查**：[lib/impl.js:490-504](https://github.com/WNLUO/dsh-mobile-plugin/blob/da27f478b4e5c3a0030f8db25ea54883435a0265/lib/impl.js#L490-L504)

按 keyId 查宿主密钥及权限注入。

<details>
<summary>查看原文（15行）</summary>

```text
   */
  const envelope = {
    keyFor: (keyId) => credentials.findByKeyId(state.instanceId, keyId),
    readBody: (req) => readRawBody(req),
  }
  const guarded = createGuarded(ctx, authOutcome, activity.note, {
    onAuthorized: (req) => {
      const presented = presentedCredential(req)
      if (!presented) return
      const record = credentials.lookup(presented, state.instanceId)
      if (record) credentials.touch(record, { channel: viaChannel(req), meta: deviceMetaFromHeaders(req) })
    },
    envelope,
    permission: { resolve: permissions.resolvePermission, has: permissions.hasPermission }, // 逐路由按设备权限子集校验
  })
```

</details>

**依据 5 · 作者声明**：[README.md:120-135](https://github.com/WNLUO/dsh-mobile-plugin/blob/da27f478b4e5c3a0030f8db25ea54883435a0265/README.md#L120-L135)

作者写的远程定位和中转口径。

<details>
<summary>查看原文（16行）</summary>

```text
## 和别的方案比

**用手机浏览器开 DSH 的网页**：不用装东西，但每次都得记住地址，界面按桌面尺寸排，在手机上要靠缩放拖拽；没有推送，离开页面就什么都不知道；审批那种要点准的东西最难用。

**远程桌面**：本质还是操作那块屏幕，手机只是个显示器。网络断了就是黑屏，小屏上做任何事都要先放大。

**各家 AI 助手的手机 App**：那些跑在厂商的服务器上，会话、文件和额度都在别人那儿。这里连的是你自己电脑上那个 DSH，模型是你配的，文件在你硬盘上。

## 已知限制

写在这里的是我们确实还没做到的，不是待办清单的美化版。

- **iOS 的后台提醒不是随时都准**。系统不允许 App 常驻后台，所以任务完成通知靠 App 进后台那一段轮询加系统择机唤醒——被系统冻结或额度用尽时可能迟到，甚至这一轮收不到。配了离线推送才有稳定的兜底，没配只保证在前台与后台还有额度的时候提醒。
- **中转能看到明文**。链路是 WSS / HTTPS 加密的，但没有端到端加密，与 frp / ngrok 同一个模型。会话正文在中转上不落盘，但中转进程本身能解密。
- **中转默认不做隧道鉴权**：能连上中转端口的人就能接走隧道。要在公网上用，请开中转控制台的限制模式，或者只把端口暴露给可信网络。
- **承载手机连接的那个插件不能在手机上卸**。第三方插件的安装、升级、卸载都能在手机上做，但 `dsh-mobile-plugin` 自己卸掉这台手机就再也连不上了，所以入口不给；另外手机上卸完要等电脑下次启动 DSH 才真的不在。
```

</details>

#### 缺口

- 真实手机配对及中转数据可见性未实测
  **影响**：无法把新协议保护推广到所有部署
  **进一步探讨**：分别用新旧凭据核对权限不足、撤销、请求头被移除及中转可见数据

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 手机发送超时后，宿主怎样避免重复提交？

**研究主题**：工程质量与复用

#### 完整回答

普通提示有 clientMessageId 时按 sessionId 与消息 ID 合成键，插件上下文内共享首次 Promise。明确拒绝或 Promise 失败后释放，接受的记录在进程内保留。无 ID 时直接调用宿主。已识别的斜杠命令在普通提示去重之前独立执行。HTTP accepted 只表明宿主接受请求，需另看会话事件确认运行结果。

#### 证据与依据

**依据 1 · 源码核查**：[lib/mobile/session-send.js:79-89](https://github.com/WNLUO/dsh-mobile-plugin/blob/da27f478b4e5c3a0030f8db25ea54883435a0265/lib/mobile/session-send.js#L79-L89)

可选 ID 决定普通提示去重。

<details>
<summary>查看原文（11行）</summary>

```text
function promptOnce(ctx, clientMessageId, payload) {
  const rpcId = mobilePromptRpcId(clientMessageId);
  // 把这一发认回去的身份一起送进宿主的 prompt 请求（`request.requestId`，见
  // host-bridge/endpoints.js）。宿主要是不认识它，user 消息的 `source.rpcId` 就是那个
  // 端点自己生成的 `mobile-prompt-<uuid>` —— App 那边 `clientMessageId` 永远对不上，
  // 只能靠「同文本 + 同图数」猜着认领乐观行（实时帧里的图一旦漏读，张数对不上就彻底认领不了）。
  const request = clientMessageId ? { ...payload, requestId: rpcId } : payload;
  if (!clientMessageId) return callSessions(ctx, 'prompt', request, rpcId);
  // 同一个 clientMessageId 在本会话里只承诺一次：内核重试、以及隔了几分钟用户手点的
  // 那次，都拿同一份结果（口径见 session-cache 的 `promptOnceFor`）。
  return promptOnceFor(ctx, `${payload.sessionId}:${clientMessageId}`, () => callSessions(ctx, 'prompt', request, rpcId));
```

</details>

**依据 2 · 源码核查**：[lib/mobile/session-cache.js:310-354](https://github.com/WNLUO/dsh-mobile-plugin/blob/da27f478b4e5c3a0030f8db25ea54883435a0265/lib/mobile/session-cache.js#L310-L354)

上下文内存状态及失败释放。

<details>
<summary>查看原文（45行）</summary>

```text
function sendIdempotencyStateOf(ctx) {
  let state = sendIdempotency.get(ctx);
  if (!state) {
    state = new Map();
    sendIdempotency.set(ctx, state);
  }
  return state;
}

/**
 * 同一个投递 id 在一次会话里只真正跑一次：成功之后记录留到进程结束，失败立刻释放。
 *
 * 要防的是「请求超时、但那一发其实已经交给宿主了」这一档：App 会拿着同一个
 * clientMessageId 再发一次（内核重试或用户手点重试），第二次必须拿到第一次的结果，
 * 而不是让模型 / 子代理把同一句话再说一遍。
 *
 * **失败不占位**：`run` 回的信封不是成功（宿主明确拒绝，如 model-unavailable /
 * agent-busy）就当场删掉记录 —— 一次瞬时错误不能被固化成「这个 id 永远只回这一句错」；
 * 同理 `run` 抛错（传输层失败）也删。两条都必须是「真的再试一次」，否则活的路径只剩
 * 用户重开 App。
 *
 * @param {object} ctx 插件上下文（状态按 ctx 隔离）
 * @param {string} key 投递身份：主会话 `sessionId:clientMessageId`，子代理额外加前缀
 * @param {() => Promise<object>} run 真正发一次，回宿主信封（`{ result: { ok, value | error } }`）
 */
function promptOnceFor(ctx, key, run) {
  const state = sendIdempotencyStateOf(ctx);
  const existing = state.get(key);
  if (existing) return existing.promise;

  const promise = Promise.resolve().then(run);
  const record = { promise };
  state.set(key, record);
  const release = () => { if (state.get(key) === record) state.delete(key); };
  promise.then(
    (response) => {
      // 留下的这条记录就是「这一发已经交给宿主了」的回执；宿主明确拒绝（信封 ok 不为真）
      // 就当场释放 —— 一次业务错误不能被固化成「这个 id 永远只回这一句」。这里只看收没
      // 收下，不拆错误信封（拆信封在 envelope.js，本文件是零依赖的叶子）。
      const accepted = Boolean(response && response.result && response.result.ok === true);
      if (!accepted) release();
    },
    release,
  );
  return promise;
```

</details>

**依据 3 · 源码核查**：[lib/mobile/session-send.js:140-173](https://github.com/WNLUO/dsh-mobile-plugin/blob/da27f478b4e5c3a0030f8db25ea54883435a0265/lib/mobile/session-send.js#L140-L173)

命令分流和接受回执。

<details>
<summary>查看原文（34行）</summary>

```text
  // 客户端跳过「乐观 pending 气泡 + running 态」；未知命令/语法不符（execute 返回 undefined）
  // 与网关未组合时回退普通消息（对齐桌面 miss 落入默认 sink，`/foo` 仍按文本发送）。
  const singleText = singleTextOf(content);
  if (singleText !== null && singleText.trim().startsWith('/')) {
    const outcome = await executeCommand(ctx, body.sessionId, singleText.trim());
    if (outcome.error) {
      const failure = outcome.error.failure
        || { code: 'command-error', message: outcome.error.message || String(outcome.error), details: {} };
      return sendJson(res, 400, { ok: false, error: failure });
    }
    if (outcome.execution !== undefined) {
      return sendJson(res, 200, { ok: true, accepted: true, handledAs: 'command' });
    }
  }
  let promptResponse;
  try {
    promptResponse = await promptOnce(ctx, typeof body.clientMessageId === 'string' ? body.clientMessageId : '', {
      sessionId: body.sessionId,
      // 继续只接受 queue 模式（宿主 `prompt` 对空内容只在这一档放行）。
      ...(continuation ? { mode: 'queue' } : mode !== undefined ? { mode } : {}),
      content,
    });
  } catch (error) {
    const normalized = promptErrorObject(error);
    if (normalized.code === MODEL_UNAVAILABLE_ERROR.code) invalidateSessionModels(ctx, req, body.sessionId);
    return sendJson(res, 400, { ok: false, error: continuation ? continuationError(normalized) : normalized });
  }
  const { error } = unwrap(promptResponse);
  if (error) {
    const normalized = promptErrorObject(error);
    if (normalized.code === MODEL_UNAVAILABLE_ERROR.code) invalidateSessionModels(ctx, req, body.sessionId);
    return sendJson(res, 400, { ok: false, error: continuation ? continuationError(normalized) : normalized });
  }
  sendJson(res, 200, { ok: true, accepted: true });
```

</details>

#### 缺口

- 丢应答、重启及命令重复未复验
  **影响**：跨进程和独立命令路径不能继承普通提示去重结论
  **进一步探讨**：用可逆提示验证同 ID 重试，再重启并对照宿主会话记录

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何用低风险操作估算接入收益？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先用受控局域网和测试会话验证手机能查看并续写，同任务用桌面核对结果。需要兼容的 DSH 宿主、手机端及配对链路，桌面补丁与无头启动方式不同。记录首次安装、配对、事件等待、手工复核和设备撤销时间。若权限与预期不符，撤销测试凭据并回到桌面。真实跨网时再分别验证中转版本和兼容策略。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-21](https://github.com/WNLUO/dsh-mobile-plugin/blob/da27f478b4e5c3a0030f8db25ea54883435a0265/cordis.patch.yml#L1-L21)

桌面挂载和无头配置注释。

<details>
<summary>查看原文（21行）</summary>

```text
# dsh bundle patch：把移动 API 插进 profile 的层栈。
#
# 这一层**两种宿主都会加载**（桌面 GUI 走 DSH 内置插件管理器把它当 bundle；无头宿主
# 由 host.js 显式作为 overlay 加载），因此这里只放「两种宿主都需要」的行 —— 目前就是
# 挂载本插件自己这一行。宿主专属的行（不开浏览器、把目录选择器钉成 browse）在
# cordis.mobile-host.yml，只由 host.js 加载，桌面碰不到。
#
# 挂载本插件自己的那一行在这里：`dsh.profile.bundles` 只让这个包的 patch 成为叠加层，
# 它不会凭空挂载任何东西（没有 insert 行的话，插件装了但永远不会被载入 —— 不报错、
# 只是没有 /api/mobile/v1，也没有 sidecar）。桌面端装进 `~/.dsh/profiles/desktop` 后
# 插件就在 profile 的 node_modules 里，按包名解析得到的就是 lib/index.js。
#
# 无头宿主 host.js 会**在装载前把这一行摘掉**（见 host.js 的 dropBareNameSelfMounts）：
# 那个场景下插件不在自己的 node_modules 里，裸名解析不到，而 loader 对解析失败不是
# 「留一条警告」而是整棵树加载失败（实测 `plugin tree failed to load: failed to import
# loader entry dsh-mobile (dsh-mobile-plugin): Cannot find package 'dsh-mobile-plugin'`
# —— 服务器宿主曾因此完全起不来）。host.js 用绝对路径另插一行 `mobile-api`，那才是
# 无头宿主的挂载点。
- insert:
    - id: dsh-mobile
      name: 'dsh-mobile-plugin'
```

</details>

**依据 2 · 作者声明**：[README.md:62-77](https://github.com/WNLUO/dsh-mobile-plugin/blob/da27f478b4e5c3a0030f8db25ea54883435a0265/README.md#L62-L77)

作者给出宿主安装路径。

<details>
<summary>查看原文（16行）</summary>

````text
在 DSH 的 **设置 → 插件** 里搜索并安装 `dsh-mobile-plugin`，然后打开 **设置 → 移动端 → 打开配置页面** 做配对。插件市场负责检查和安装更新，通常更新后不用重启 DSH。

装完以后，**入口在 DSH 的「设置 → 移动端」**：点「打开配置页面」，那里有配对二维码、当前监听地址和中转状态。手机上的所有功能都从这一页开始。

### 无头 Host（Linux）

需要 Node.js、pnpm，以及可用的 DSH 插件宿主依赖。仓库里的 `host.js` 就是独立入口：

```sh
pnpm install --frozen-lockfile
DSH_HOME=/opt/dsh-mobile/.dsh DSH_MOBILE_PROFILE=mobile node host.js
```

`DSH_HOME` 是数据根目录，默认 `~/.dsh`；`DSH_MOBILE_PROFILE` 是 profile 名称，默认 `mobile`。无头 Host 的 Web 服务默认只监听 `127.0.0.1:3080`，不对局域网直接开放。

配置接口只限本机访问，看状态和拿配对信息：
````

</details>

**依据 3 · 源码核查**：[lib/index.js:98-125](https://github.com/WNLUO/dsh-mobile-plugin/blob/da27f478b4e5c3a0030f8db25ea54883435a0265/lib/index.js#L98-L125)

外壳委派请求并跟踪在途。

<details>
<summary>查看原文（28行）</summary>

```text
   */
  async function applyUpdate({ force = false, auto = false } = {}) {
    return updater.performUpdate({ runtime, base, hostService, updateState, force, auto, log, beforeInstall: snapshotRunning })
  }

  // 换代前要知道有没有请求在飞（见 runtime.drain）。webServer 没有中间件机制，所以包一层
  // register 把每条 handler 变成「进 +1 / 出 -1」（`wrapHandler` 认不出的形状原样放行）。
  //
  // 这层包装必须**可叠加**：别人后来也包一层时闭包着我们的包装，撤销时无条件还原会把
  // 别人的那层一起摘掉。所以只在「现在挂的就是我们这层」时才还原。
  ctx.effect(() => {
    const server = ctx.webServer
    const outer = server?.register
    if (typeof outer !== 'function') return () => {}
    const wrapper = function register(route) {
      return outer.call(this, runtime.wrapHandler(route))
    }
    server.register = wrapper
    return () => {
      if (server.register === wrapper) server.register = outer
      return runtime.detach()
    }
  }, 'dsh-mobile-plugin: generation runtime')

  const installedShellHash = () => updater.shellFingerprint(installedPackageDir())
  // 宿主半边的自检口（`shell/half-route.js`）：实现装载失败时整张控制面路由都不在，只有
  // 外壳还活着 —— 那是「它为什么没起来」唯一说得通的落点。
  ctx.effect(() => installHostHalf(ctx, runtime, { installedVersion, installedShellHash, runningShellHash }), 'dsh-mobile-plugin: host half self check')
```

</details>

#### 缺口

- 手机、桌面宿主与网络维护量没有测量
  **影响**：无法量化比远程桌面更省时的范围
  **进一步探讨**：对同一测试会话计时并记录失联后的恢复步骤

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 在发送后显示宿主接受和运行结果的不同状态能否减少误操作？

**研究主题**：新假设与验证

#### 完整回答

复用普通提示的请求 ID 做关联，显示等待宿主确认、已接受以及事件确认后的状态。模拟丢失一次响应和短时断网，用同一会话比较有无分状态提示时重复提交和误报完成的次数。若事件关联不完整，保留待核对状态并引导回看会话。

#### 证据与依据

**依据 1 · 源码核查**：[lib/mobile/session-send.js:79-89](https://github.com/WNLUO/dsh-mobile-plugin/blob/da27f478b4e5c3a0030f8db25ea54883435a0265/lib/mobile/session-send.js#L79-L89)

请求 ID 送入宿主，便于后续关联。

<details>
<summary>查看原文（11行）</summary>

```text
function promptOnce(ctx, clientMessageId, payload) {
  const rpcId = mobilePromptRpcId(clientMessageId);
  // 把这一发认回去的身份一起送进宿主的 prompt 请求（`request.requestId`，见
  // host-bridge/endpoints.js）。宿主要是不认识它，user 消息的 `source.rpcId` 就是那个
  // 端点自己生成的 `mobile-prompt-<uuid>` —— App 那边 `clientMessageId` 永远对不上，
  // 只能靠「同文本 + 同图数」猜着认领乐观行（实时帧里的图一旦漏读，张数对不上就彻底认领不了）。
  const request = clientMessageId ? { ...payload, requestId: rpcId } : payload;
  if (!clientMessageId) return callSessions(ctx, 'prompt', request, rpcId);
  // 同一个 clientMessageId 在本会话里只承诺一次：内核重试、以及隔了几分钟用户手点的
  // 那次，都拿同一份结果（口径见 session-cache 的 `promptOnceFor`）。
  return promptOnceFor(ctx, `${payload.sessionId}:${clientMessageId}`, () => callSessions(ctx, 'prompt', request, rpcId));
```

</details>

**依据 2 · 源码核查**：[lib/mobile/session-send.js:154-173](https://github.com/WNLUO/dsh-mobile-plugin/blob/da27f478b4e5c3a0030f8db25ea54883435a0265/lib/mobile/session-send.js#L154-L173)

成功回执仅为 accepted。

<details>
<summary>查看原文（20行）</summary>

```text
  let promptResponse;
  try {
    promptResponse = await promptOnce(ctx, typeof body.clientMessageId === 'string' ? body.clientMessageId : '', {
      sessionId: body.sessionId,
      // 继续只接受 queue 模式（宿主 `prompt` 对空内容只在这一档放行）。
      ...(continuation ? { mode: 'queue' } : mode !== undefined ? { mode } : {}),
      content,
    });
  } catch (error) {
    const normalized = promptErrorObject(error);
    if (normalized.code === MODEL_UNAVAILABLE_ERROR.code) invalidateSessionModels(ctx, req, body.sessionId);
    return sendJson(res, 400, { ok: false, error: continuation ? continuationError(normalized) : normalized });
  }
  const { error } = unwrap(promptResponse);
  if (error) {
    const normalized = promptErrorObject(error);
    if (normalized.code === MODEL_UNAVAILABLE_ERROR.code) invalidateSessionModels(ctx, req, body.sessionId);
    return sendJson(res, 400, { ok: false, error: continuation ? continuationError(normalized) : normalized });
  }
  sendJson(res, 200, { ok: true, accepted: true });
```

</details>

**依据 3 · 源码核查**：[lib/routes/mobile-api.js:454-465](https://github.com/WNLUO/dsh-mobile-plugin/blob/da27f478b4e5c3a0030f8db25ea54883435a0265/lib/routes/mobile-api.js#L454-L465)

事件流入口。

<details>
<summary>查看原文（12行）</summary>

```text
  // 把某一档设成「新会话默认吃的那一档」：写宿主 settings 的 agent-preset-registry，
  // 与桌面端预设页那颗「设为默认」同一格（不是预设自己的属性）。
  route('/api/mobile/v1/agent-presets/default', agentPresets.handleAgentPresetDefault)
  route('/api/mobile/v1/session/new', sessions.handleNew)
  route('/api/mobile/v1/session/stream', stream.handleStream)
  route('/api/mobile/v1/events/stream', events.handleDeviceStream)
  route('/api/mobile/v1/question/respond', questions.handleQuestionRespond)
  route('/api/mobile/v1/approval/respond', approvals.handleApprovalRespond)
  // 「这类以后都同意」的本机规则账：读列表 + 逐条撤销（撤销页用）。
  route('/api/mobile/v1/approval/rules', approvals.handleApprovalRules)
  route('/api/mobile/v1/approval/rules/revoke', approvals.handleApprovalRuleRevoke)
  route('/api/mobile/v1/session/goal', sessions.handleGoalAction)
```

</details>

#### 缺口

- 未检视手机实际重连及状态提示
  **影响**：不能断言当前界面缺少反馈
  **进一步探讨**：以测试客户端观察接收、断线和补看顺序

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
