# UUMit remote access for DSH

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[9e64809](https://github.com/uumit-ai/dsh-uumit-remote/tree/9e64809f6db492f5eff4381cb90ddbbb7164c215)

<!-- BEGIN META -->
[![GitHub ★ 488](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=488&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/uumit-ai/dsh-uumit-remote) [![npm 30d 544](https://img.shields.io/static/v1?label=npm+30d&message=544&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@uumit-ai/dsh-uumit-remote) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@uumit-ai/dsh-uumit-remote)
<!-- END META -->

> **功能**：在 DSH 进程内连接 UUMit 通道，为网页实例提供配对、远程访问与邀请管理。

> **亮点**：它将平台配对、进程内通道、内部Cookie代理与本机管理组合，使远端访问同一网页实例且不直接拿到DSH Cookie。[Q01](#research-q01)、[Q02](#research-q02)

> **主要限制**：授权实时性依赖UUMit网关，本地沿用旧配置且WebSocket只握手准入；成员撤销不能仅凭源码说成现有连接立即终止。[Q03](#research-q03)

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
  - [Q01 · 远程访问面向谁，究竟开放了什么？](#detail-section-11)
  - [Q02 · 配对到远端请求如何完成认证与转发？](#detail-section-12)
  - [Q03 · “撤销下一次即拒”和私密凭据有什么边界？](#detail-section-13)
  - [Q04 · 接入、管理和断开要承担什么？](#detail-section-14)
  - [Q05 · 什么条件适合试用，如何检验授权生命周期？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有dsh web和UUMit账号的用户，可从手机或另一台电脑操作原实例。

参照独立隧道客户端与手工代理，本组件把配对和通道管理放入DSH；不提供每人独立DSH权限。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 设备配对与通道 | 建立原实例远程入口 | UUMit账号和网络必需 |
| HTTP与WebSocket代理 | 从远端操作DSH | 完整主人身份，不是每人隔离 |
| 本机授权管理 | 设置档位、邀请与撤销 | 本机认证浏览器；public需确认 |
| uumit_remote_access | 查看状态、发起配对、获取管理指引 | 不能替主人修改访问档位 |
| 断开与停用 | 结束设备或本地通道 | 平台失败需核实，已发生操作不回滚 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| dsh web>=0.2.1-rc.2、Node ^22.19或>=24 | 必需 | 网页与原生网络API | Desktop不支持 |
| UUMit账号、网关与通道节点 | 远程必需 | 配对和身份判定 | 远程可达与授权依赖平台 |
| connection与webServer | 必需 | 内部Cookie和本机管理 | 管理门拒绝或代理不可用 |
| 本机已认证浏览器 | 管理必需 | 配对、授权和断开 | 远端管理路径拒绝 |
| 原DSH模型与工具权限 | 任务条件 | 使用原会话和主机资源 | 远端拥有主人完整能力 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 主人启动独立web实例并加载 | 本机管理入口可达 |
| 配对 | 主人登录UUMit并核对码 | 正确设备与应用登记 |
| 授权 | 主人选择仅自己或受邀 | 明确远端完整权限，不把public当展示 |
| 访问 | 远端打开独立网址 | 正确实例、管理路径不可达 |
| 退出 | 主人断开并核平台结果 | 平台不可达时先停插件断本地通道 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 主机、包和账号资源，金额未知 | 配对核码、权限及实例确认 | beta行为和配置可能调整 |
| 持续 | 通道流量、原模型/工具及平台费用未知 | 账号与邀请管理、撤销复核 | 不是每人独立权限 |
| 失败恢复 | 重连与未完远程操作资源未知 | 停本地通道、核平台撤销 | 平台不通时unpair可能保留连接状态 |
| 退出 | 本地状态及平台设备记录 | 停用、撤销与备份核对 | 已发生文件/终端副作用不回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 无外部客户端的远程接入 | 进程内RemoteAgent和通道编排 | 实际网络与平台可达性 |
| 内部凭据隔离 | 请求Cookie替换及响应剥离 | 全平台安全保证 |
| 授权控制 | 档位准入和本机管理门 | 撤销对已有连接的传播窗口 |

> **思考**：授权实时性依赖UUMit网关，本地沿用旧配置且WebSocket只握手准入；成员撤销不能仅凭源码说成现有连接立即终止。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它将平台配对、进程内通道、内部Cookie代理与本机管理组合，使远端访问同一网页实例且不直接拿到DSH Cookie。[Q01](#research-q01)、[Q02](#research-q02)

[Q02](#research-q02) 有body的401不自动重放、内部Cookie不下发和本机管理隔离值得借鉴；[Q03](#research-q03) 逐请求规则不能等同既有WebSocket逐帧授权。

<a id="detail-section-5"></a>

### 1.4 主要限制

授权实时性依赖UUMit网关，本地沿用旧配置且WebSocket只握手准入；成员撤销不能仅凭源码说成现有连接立即终止。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

仅在独立web实例先试私有访问，核对配对、实例、管理隔离及撤销；不满足即停插件并回本机。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持配对、规则准入及内部代理；外部网关可用、安全和撤销传播未验收，清退方向为假设。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh-CN.md、package.json、index.js、src/agent.js、src/proxy/gate.js、src/proxy/loopback.js、src/proxy/inner-auth.js、src/control/store.js、src/ui/routes.js、src/tool.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查编排、配对存储、规则、HTTP/WS代理和管理工具；未运行平台、通道或完整FRP协议测试，不作安全审计结论。
- 下一步：在独立实例对照HTTP/WS授权撤销、平台故障与停用，记录活动连接和操作恢复，不使用真实重要数据。

**分析版本**

- **仓库**：[uumit-ai/dsh-uumit-remote](https://github.com/uumit-ai/dsh-uumit-remote)
- **版本号**：0.1.0-beta.3（[固定提交 9e64809](https://github.com/uumit-ai/dsh-uumit-remote/tree/9e64809f6db492f5eff4381cb90ddbbb7164c215)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索明确授权快照时效与活动连接清退状态，区分新请求拒绝和已有连接终止，以撤销及平台故障对照验证；未实现。[Q05](#research-q05)

在独立实例对照HTTP/WS授权撤销、平台故障与停用，记录活动连接和操作恢复，不使用真实重要数据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 247 | — | — | 3034 |
| .js | source | 20 | 4383 | 3796 | 257 | — |
| .js | test | 7 | 1669 | 1546 | 79 | — |
| .mjs | test | 2 | 372 | 336 | 17 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/uumit-ai/dsh-uumit-remote/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/uumit-ai/dsh-uumit-remote/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/uumit-ai/dsh-uumit-remote/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：远程完整DSH访问如何建立权限与内部认证，撤销和故障时边界是否清晰？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 远程访问面向谁，究竟开放了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已有本地dsh web、需要手机或另一台电脑继续操作的用户。相对另装隧道客户端并手工配置反向代理，它在DSH进程中完成UUMit配对、应用登记和通道，远端看到同一DSH而非复制会话。合格结果是被允许的人访问正确实例，同时本机主人能管理与撤销。它不是只读会话分享，终端、文件、设置等仍以主人身份操作；身份档位控制谁能进，未提供远端成员各自DSH权限隔离。作者明确Desktop不支持；UUMit登录、网关身份和公网可达性来自外部平台，不是本仓库独立实现。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:5-19](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/README.zh-CN.md#L5-L19)

作者场景、完整操作与web要求。

<details>
<summary>查看原文（15行）</summary>

```text
[DeepSeek Harness](https://www.npmjs.com/package/@deepseek-ai/dsh)（DSH）插件：不用安装 UUMit 客户端，在手机或其他电脑上，通过 [UUMit](https://uumit.com) 打开这台电脑上的 DSH。

装好插件后，点 DSH 侧栏底部设置按钮旁的「远程访问」，在 DSH 页面内弹出的面板里连接到 UUMit、选择谁能用。之后你和你邀请的人打开应用网址（形如 `https://dsh--<你的电脑>.<UUMit 地址域名>/`），看到的就是和本机一样的 DSH：对话、终端、文件、设置都可以用，设置会写回这台电脑。

![DSH 里的 UUMit 远程访问面板](assets/screenshot-1-panel.png)

插件运行在 DSH 自己的进程里，直接连 UUMit 的通道，不下载、不启动任何其他程序，也不在本机开放端口。

> **Beta**：这是预览版，以 `beta` 标签发布。1.0 之前行为和配置可能还会调整。

## 要求

- `dsh web`（DeepSeek Harness 0.2.1-rc.2 及以上）。DSH 桌面版不起 Web 服务，不支持。
- Node.js 22.19 及以上（与 DSH 相同）。
- 一个 UUMit 账号。
```

</details>

**依据 2 · 作者声明**：[README.zh-CN.md:45-57](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/README.zh-CN.md#L45-L57)

访问档位和Agent工具边界。

<details>
<summary>查看原文（13行）</summary>

```text
## 使用

1. 在本机打开 DSH，点侧栏底部设置按钮旁的「远程访问」（侧栏收起时是一个地球图标），管理面板会在 DSH 页面内弹出，不会另开窗口。入口没有出现时，可以打开 `<dsh web 地址>/uumit-remote/` 兜底页。
2. 点「连接到 UUMit」，在打开的网页里登录 UUMit，核对网页上的连接码与面板里一致后确认。打不开确认页时，可以在 UUMit 网页生成 8 位配对码填进来。
3. 连接后 DSH 会作为应用 `dsh` 出现在你的 UUMit 地址里，在「谁能用」里选择：
   - **仅自己**：只有你登录 UUMit 后能打开；
   - **我和我邀请的人**：可以生成邀请链接，或按手机号直接授权，随时撤销；
   - **所有人**：任何拿到网址的人都能以你的身份完整操作这个 DSH，面板会二次确认；
   - **关闭**。
4. 在任何地方打开面板里的「应用网址」即可使用。
5. 不用了可以点「断开这台电脑」，这台电脑会从你的 UUMit 设备中移除。

也可以让 DSH 里的 Agent 帮忙：插件注册了工具 `uumit_remote_access`（查看状态、发起连接、告诉你在哪里管理）。Agent 不能替你改「谁能用」。
```

</details>

**依据 3 · 源码核查**：[src/proxy/gate.js:186-195](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/src/proxy/gate.js#L186-L195)

远端HTML注入ownsHost设置写回主人。

<details>
<summary>查看原文（10行）</summary>

```text
const HOST_MODE_SCRIPT = '<script>window.__DSH_TRANSPORT__=Object.assign(window.__DSH_TRANSPORT__||{},{ownsHost:true});</script>'

/** 在 <head> 开标签之后注入宿主模式开关（设置写回主人电脑）。 */
export function injectHostMode(html) {
  const lower = html.toLowerCase()
  const start = lower.indexOf('<head')
  if (start < 0) return html
  const end = html.indexOf('>', start)
  if (end < 0) return html
  return html.slice(0, end + 1) + HOST_MODE_SCRIPT + html.slice(end + 1)
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配对到远端请求如何完成认证与转发？

**研究主题**：功能与机制

#### 完整回答

Host注入webServer与connection，创建Store、内部认证、回环代理、通道和RemoteAgent。配对成功保存设备凭据与配置，goOnline拉平台配置、登记服务并配置FRP通道；工作连接以函数逐请求读取最新本地规则。代理检查公开host/proto、身份头单值合法性与浏览器来源，拒远端管理路径；再用connection.authenticatedUrl兑换绑定本地地址的DSH Cookie，仅内存缓存。转发去掉远端Cookie/Origin及伪造转发头，添加内部Cookie和远程标记，响应剥离set-cookie；有body的401不自动重放，无body才刷新凭据重试，避免重复副作用。WebSocket沿同一准入和内部凭据升级。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:32-60](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/index.js#L32-L60)

实际编排和本地管理路由。

<details>
<summary>查看原文（29行）</summary>

```text
export function apply(ctx, config = {}) {
  const log = loggerOf(ctx)
  const origin = () => ctx.webServer.getOrigin()
  const store = new Store(config.home || defaultHome())
  const innerAuth = new InnerAuth(ctx.connection, origin)
  const proxy = new LoopbackProxy({ origin, innerAuth, log })
  const tunnelServer = createTunnelServer(proxy, log)
  const agent = new RemoteAgent({
    store,
    dshOrigin: origin,
    version: VERSION,
    config,
    log,
    onWorkConn: (stream, rule) => tunnelServer.accept(stream, rule),
  })

  const disposers = []
  const handler = createManagementHandler({ agent, connection: ctx.connection, log })
  disposers.push(
    ctx.webServer.register({
      kind: 'prefix',
      path: LOCAL_ONLY_PREFIX,
      handler: (req, res) =>
        handler(req, res).catch((err) => {
          log.warn?.(`management page failed: ${err && err.message}`)
          if (!res.headersSent) res.writeHead(500)
          res.end()
        }),
    }),
```

</details>

**依据 2 · 源码核查**：[src/agent.js:326-345](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/src/agent.js#L326-L345)

配对保存及上线。

<details>
<summary>查看原文（20行）</summary>

```text
  async _saveResult(result, webBase) {
    const config = result.config || {}
    this.store.saveCredentials({ deviceId: String(result.device_id), deviceCredential: String(result.device_credential), tunnelToken: String(config.tunnel_token || '') })
    this.store.saveSettings({
      api_base: this.apiBase,
      web_base: normalizeWebBase(webBase),
      device_id: String(result.device_id),
      handle: String(result.handle),
      address: config.address || null,
      edition: config.edition || null,
      device_name: deviceName(this.configuredDeviceName, this.env),
      paired_at: new Date(this.now()).toISOString(),
    })
    this.store.saveConfig(config)
    this.creds = this.store.loadCredentials()
    this.config = this.store.loadConfig()
    this.lastError = null
    this.log.info?.(`paired as device ${result.device_id} (handle ${result.handle})`)
    this.emit('change')
    await this.goOnline()
```

</details>

**依据 3 · 源码核查**：[src/agent.js:480-492](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/src/agent.js#L480-L492)

逐请求规则读取。

<details>
<summary>查看原文（13行）</summary>

```text
  activeRule(proxy) {
    const rule = this.rule()
    if (!rule || rule.proxy !== proxy || !this.desiredProxies().some((p) => p.name === proxy)) return null
    return rule
  }

  _onWorkConn(proxy, stream) {
    if (!this.activeRule(proxy)) {
      stream.destroy()
      return
    }
    // frps 会长时间复用同一条工作连接承载多次请求，规则必须逐请求读取
    this.onWorkConnCb(stream, () => this.activeRule(proxy))
```

</details>

**依据 4 · 源码核查**：[src/proxy/inner-auth.js:54-88](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/src/proxy/inner-auth.js#L54-L88)

内存凭据交换和超时。

<details>
<summary>查看原文（35行）</summary>

```text
  async get() {
    if (this.cookie) return this.cookie
    if (!this.pending) {
      this.pending = this._exchange().finally(() => {
        this.pending = null
      })
    }
    return this.pending
  }

  async _exchange() {
    const origin = this.origin()
    const target = new URL(this.connection.authenticatedUrl(`${origin}/`))
    if (target.origin !== new URL(origin).origin || target.pathname !== '/') throw new InnerAuthError('authenticated url does not point at this server')
    const transport = target.protocol === 'https:' ? https : http
    const res = await new Promise((resolve, reject) => {
      const req = transport.request(target, {
        method: 'GET',
        headers: { 'accept-encoding': 'identity' },
        agent: false,
        // 自己的监听地址；证书可能签给别的主机名
        rejectUnauthorized: false,
      }, (r) => {
        r.resume()
        resolve(r)
      })
      req.setTimeout(EXCHANGE_TIMEOUT_MS, () => req.destroy(new InnerAuthError('exchange timed out')))
      req.on('error', reject)
      req.end()
    })
    if (res.statusCode !== 303 && res.statusCode !== 302) throw new InnerAuthError(`exchange returned http ${res.statusCode}`)
    this.cookie = parseAuthCookies(res.headers['set-cookie'])
    return this.cookie
  }
}
```

</details>

**依据 5 · 源码核查**：[src/proxy/loopback.js:93-115](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/src/proxy/loopback.js#L93-L115)

转发头重写。

<details>
<summary>查看原文（23行）</summary>

```text
/** 构造发往 DSH 的请求头（扁平数组，保留同名多值）。 */
export function rewriteHeaders(req, { origin, cookie, meta, index, upgrade }) {
  const out = []
  const raw = req.rawHeaders
  for (let i = 0; i < raw.length; i += 2) {
    const name = raw[i].toLowerCase()
    if (DROP_REQUEST.has(name) || name.startsWith('sec-fetch-') || name.startsWith('x-uumit-')) continue
    if (name === 'x-forwarded-for' || name === 'accept-encoding') continue
    out.push(raw[i], raw[i + 1])
  }
  const host = new URL(origin).host
  out.push('Host', host, 'Sec-Fetch-Site', 'same-origin', 'Cookie', cookie, REMOTE_MARKER_HEADER, '1')
  const xff = req.headersDistinct['x-forwarded-for']
  if (xff && xff.length) out.push('X-Forwarded-For', xff.join(', '))
  out.push('X-Forwarded-Host', meta.host, 'X-Forwarded-Proto', meta.scheme)
  const ae = req.headers['accept-encoding']
  if (!index && ae) out.push('Accept-Encoding', ae)
  else out.push('Accept-Encoding', 'identity')
  if (upgrade) {
    out.push('Connection', 'Upgrade')
    if (req.headers.upgrade) out.push('Upgrade', req.headers.upgrade)
  }
  return out
```

</details>

**依据 6 · 源码核查**：[src/proxy/loopback.js:155-225](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/src/proxy/loopback.js#L155-L225)

准入、管理路径拒绝与401重试。

<details>
<summary>查看原文（71行）</summary>

```text
  /** 准入检查；返回 {meta} 或 {reject}。 */
  admit(req, rule, pathname) {
    const h = req.headersDistinct
    const meta = sharingMetadata(rule.entry, h)
    if (!meta) return { reject: { status: 400, body: 'invalid application sharing address', headers: { 'content-type': 'text/plain; charset=utf-8' } } }
    if (meta.legacy) return { reject: legacyRedirect(req, rule, meta) || rejectPayload('legacy') }
    if (isLocalOnlyPath(pathname)) return { reject: { status: 404, body: 'not found', headers: { 'content-type': 'text/plain; charset=utf-8' } } }
    if (!identityAllowed(h, rule.tier) || !browserContextAllowed(h, meta)) return { reject: rejectPayload('forbidden') }
    return { meta }
  }

  async handleRequest(req, res, rule) {
    const pathname = new URL(req.url, 'http://x').pathname
    const { meta, reject } = this.admit(req, rule, pathname)
    if (reject) return this._send(res, reject)
    let bodyText = null
    if (needsHostDesktopBody(req.method, pathname)) {
      bodyText = await readBody(req, 64 * 1024)
      const answer = hostDesktopAction(req.method, pathname, bodyText)
      if (answer) return this._send(res, { status: answer.status, body: answer.body, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } })
    } else {
      const answer = hostDesktopAction(req.method, pathname, null)
      if (answer) return this._send(res, { status: answer.status, body: answer.body, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } })
    }
    let cookie
    try {
      cookie = await this.innerAuth.get()
    } catch (err) {
      this.log.warn?.(`inner credential unavailable: ${err.message}`)
      return this._stale(req, res)
    }
    const index = isIndexRequest(req, pathname)
    const hasBody = !(req.method === 'GET' || req.method === 'HEAD') || Number(req.headers['content-length'] || 0) > 0 || !!req.headers['transfer-encoding']
    const forward = (cookieValue, body) =>
      new Promise((resolve, reject) => {
        const origin = this.origin()
        const target = new URL(origin)
        const transport = target.protocol === 'https:' ? https : http
        const up = transport.request({
          protocol: target.protocol,
          hostname: target.hostname.replace(/^\[|\]$/g, ''),
          port: target.port || (target.protocol === 'https:' ? 443 : 80),
          method: req.method,
          path: cleanPath(req.url),
          headers: rewriteHeaders(req, { origin, cookie: cookieValue, meta, index, upgrade: false }),
          agent: target.protocol === 'https:' ? this.agents.https : this.agents.http,
          setHost: false,
        })
        up.on('socket', (s) => {
          if (s.connecting) {
            const t = setTimeout(() => up.destroy(Object.assign(new Error('connect timed out'), { code: 'ETIMEDOUT' })), CONNECT_TIMEOUT_MS)
            s.once('connect', () => clearTimeout(t))
            s.once('close', () => clearTimeout(t))
          }
        })
        up.on('response', resolve)
        up.on('error', reject)
        if (body !== null) up.end(body)
        else if (hasBody) req.pipe(up)
        else up.end()
      })
    let upRes
    try {
      upRes = await forward(cookie, bodyText)
      if (upRes.statusCode === 401 && !hasBody) {
        upRes.resume()
        this.innerAuth.invalidate(cookie)
        cookie = await this.innerAuth.get()
        upRes = await forward(cookie, null)
      } else if (upRes.statusCode === 401) {
        this.innerAuth.invalidate(cookie)
```

</details>

**依据 7 · 源码核查**：[src/proxy/loopback.js:253-288](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/src/proxy/loopback.js#L253-L288)

WebSocket实际转发。

<details>
<summary>查看原文（36行）</summary>

```text
  async handleUpgrade(req, socket, head, rule) {
    const pathname = new URL(req.url, 'http://x').pathname
    const { meta, reject } = this.admit(req, rule, pathname)
    if (reject) return writeRaw(socket, reject)
    let cookie
    try {
      cookie = await this.innerAuth.get()
    } catch {
      return writeRaw(socket, { status: 503, body: 'dsh unavailable', headers: { 'content-type': 'text/plain; charset=utf-8' } })
    }
    const origin = this.origin()
    const target = new URL(origin)
    const port = Number(target.port) || (target.protocol === 'https:' ? 443 : 80)
    const host = target.hostname.replace(/^\[|\]$/g, '')
    const up = target.protocol === 'https:' ? tls.connect({ host, port, rejectUnauthorized: false }) : net.connect({ host, port })
    const headers = rewriteHeaders(req, { origin, cookie, meta, index: false, upgrade: true })
    let lines = `${req.method} ${cleanPath(req.url)} HTTP/1.1\r\n`
    for (let i = 0; i < headers.length; i += 2) lines += `${headers[i]}: ${headers[i + 1]}\r\n`
    up.once(target.protocol === 'https:' ? 'secureConnect' : 'connect', () => {
      up.write(lines + '\r\n')
      if (head && head.length) up.write(head)
      up.once('data', (first) => {
        // DSH 拒绝内部凭据时作废缓存，下一次升级重新兑换
        if (/^HTTP\/1\.1 401/.test(first.toString('latin1', 0, 16))) this.innerAuth.invalidate(cookie)
        socket.write(first)
        up.pipe(socket)
        socket.pipe(up)
      })
    })
    up.on('error', (err) => {
      this.log.warn?.(`websocket upstream failed: ${err.message}`)
      socket.destroy()
    })
    socket.on('error', () => up.destroy())
    socket.on('close', () => up.destroy())
    up.on('close', () => socket.destroy())
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · “撤销下一次即拒”和私密凭据有什么边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

本地identityAllowed检查的是平台注入头的形状、角色与档位，并未逐个请求在线查grant是否已撤销；成员撤销的实时生效依赖可信网关剥离伪造头并重新判断。平台配置暂不可达会沿旧快照维持通道，不能概括成任何异常都关闭。HTTP新请求会重新取本地规则，但已升级WebSocket只在握手准入，现有流是否即时中止取决通道或网关，源码不足以证明成员撤销即断现有连接。凭据文件0600/目录0700和原子写是可借鉴的本地保全，Windows权限位不生效，实际账户ACL需核实；内部HTTPS回环显式不校验证书，边界是信任本地origin而非远端证书保证。外部网关安全与在线性没有在本轮验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/proxy/gate.js:32-50](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/src/proxy/gate.js#L32-L50)

身份门校验头格式与tier。

<details>
<summary>查看原文（19行）</summary>

```text
/** 身份门：私有与授权档要求主人，或授权档带唯一合法授权的受邀成员；开放档只要求身份头完整合法。 */
export function identityAllowed(h, tier) {
  if (tier === 'public') {
    const type = single(h, 'x-uumit-caller-type')
    if (!['owner', 'user', 'agent', 'public'].includes(type)) return false
    return optionalUUID(h, 'x-uumit-caller-id') && optionalUUID(h, 'x-uumit-grant-id')
  }
  if (tier !== 'private' && tier !== 'granted') return false
  const type = single(h, 'x-uumit-caller-type')
  const id = single(h, 'x-uumit-caller-id')
  if (type === null || id === null) return false
  if (type === 'owner') {
    if (values(h, 'x-uumit-grant-id').length !== 0) return false
  } else if (type === 'user' && tier === 'granted') {
    if (!validUUID(single(h, 'x-uumit-grant-id'))) return false
  } else {
    return false
  }
  return validUUID(id)
```

</details>

**依据 2 · 源码核查**：[src/agent.js:382-406](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/src/agent.js#L382-L406)

配置失败沿用快照。

<details>
<summary>查看原文（25行）</summary>

```text
  async refreshConfig() {
    if (!this.creds) return
    let cfg
    try {
      cfg = await this.api.getConfig()
    } catch (err) {
      if (isCredentialRejected(err)) return this._markRevoked('config')
      this.lastError = describeError(err)
      this.emit('change')
      // 平台暂不可达时按上次快照维持通道
      if (this.config) this._applyTunnel(this.config)
      return
    }
    if (cfg.tunnel_token && cfg.tunnel_token !== this.creds.tunnelToken) {
      this.store.saveCredentials({ ...this.creds, tunnelToken: cfg.tunnel_token })
      this.creds = this.store.loadCredentials()
    }
    this.store.saveConfig(cfg)
    this.store.saveSettings({ address: cfg.address, handle: cfg.handle, edition: cfg.edition })
    const prevInterval = this.config?.serving_report_interval_sec
    this.config = this.store.loadConfig()
    if (prevInterval !== this.config.serving_report_interval_sec && this.timers.length) this._scheduleReport()
    this.lastError = null
    if (!this.service()) await this._registerService()
    this._applyTunnel(this.config)
```

</details>

**依据 3 · 源码核查**：[src/proxy/loopback.js:253-288](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/src/proxy/loopback.js#L253-L288)

升级后pipe无逐帧重新准入。

<details>
<summary>查看原文（36行）</summary>

```text
  async handleUpgrade(req, socket, head, rule) {
    const pathname = new URL(req.url, 'http://x').pathname
    const { meta, reject } = this.admit(req, rule, pathname)
    if (reject) return writeRaw(socket, reject)
    let cookie
    try {
      cookie = await this.innerAuth.get()
    } catch {
      return writeRaw(socket, { status: 503, body: 'dsh unavailable', headers: { 'content-type': 'text/plain; charset=utf-8' } })
    }
    const origin = this.origin()
    const target = new URL(origin)
    const port = Number(target.port) || (target.protocol === 'https:' ? 443 : 80)
    const host = target.hostname.replace(/^\[|\]$/g, '')
    const up = target.protocol === 'https:' ? tls.connect({ host, port, rejectUnauthorized: false }) : net.connect({ host, port })
    const headers = rewriteHeaders(req, { origin, cookie, meta, index: false, upgrade: true })
    let lines = `${req.method} ${cleanPath(req.url)} HTTP/1.1\r\n`
    for (let i = 0; i < headers.length; i += 2) lines += `${headers[i]}: ${headers[i + 1]}\r\n`
    up.once(target.protocol === 'https:' ? 'secureConnect' : 'connect', () => {
      up.write(lines + '\r\n')
      if (head && head.length) up.write(head)
      up.once('data', (first) => {
        // DSH 拒绝内部凭据时作废缓存，下一次升级重新兑换
        if (/^HTTP\/1\.1 401/.test(first.toString('latin1', 0, 16))) this.innerAuth.invalidate(cookie)
        socket.write(first)
        up.pipe(socket)
        socket.pipe(up)
      })
    })
    up.on('error', (err) => {
      this.log.warn?.(`websocket upstream failed: ${err.message}`)
      socket.destroy()
    })
    socket.on('error', () => up.destroy())
    socket.on('close', () => up.destroy())
    up.on('close', () => socket.destroy())
```

</details>

**依据 4 · 源码核查**：[src/control/store.js:29-65](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/src/control/store.js#L29-L65)

权限位与原子写边界。

<details>
<summary>查看原文（37行）</summary>

```text

  ensureDir() {
    if (!existsSync(this.dir)) mkdirSync(this.dir, { recursive: true, mode: 0o700 })
    try {
      chmodSync(this.dir, 0o700)
    } catch {
      // Windows 上权限位不生效
    }
  }

  path(name) {
    return join(this.dir, FILES[name] || name)
  }

  readJSON(name) {
    try {
      const v = JSON.parse(readFileSync(this.path(name), 'utf8'))
      return v && typeof v === 'object' ? v : null
    } catch {
      return null
    }
  }

  writeJSON(name, value) {
    this.writeRaw(name, JSON.stringify(value, null, 2) + '\n')
  }

  writeRaw(name, text) {
    this.ensureDir()
    const target = this.path(name)
    const tmp = `${target}.${process.pid}.${randomBytes(4).toString('hex')}.tmp`
    writeFileSync(tmp, text, { mode: 0o600 })
    try {
      chmodSync(tmp, 0o600)
    } catch {
      // Windows
    }
```

</details>

**依据 5 · 源码核查**：[src/proxy/inner-auth.js:64-84](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/src/proxy/inner-auth.js#L64-L84)

本地HTTPS不验服务器证书。

<details>
<summary>查看原文（21行）</summary>

```text
  async _exchange() {
    const origin = this.origin()
    const target = new URL(this.connection.authenticatedUrl(`${origin}/`))
    if (target.origin !== new URL(origin).origin || target.pathname !== '/') throw new InnerAuthError('authenticated url does not point at this server')
    const transport = target.protocol === 'https:' ? https : http
    const res = await new Promise((resolve, reject) => {
      const req = transport.request(target, {
        method: 'GET',
        headers: { 'accept-encoding': 'identity' },
        agent: false,
        // 自己的监听地址；证书可能签给别的主机名
        rejectUnauthorized: false,
      }, (r) => {
        r.resume()
        resolve(r)
      })
      req.setTimeout(EXCHANGE_TIMEOUT_MS, () => req.destroy(new InnerAuthError('exchange timed out')))
      req.on('error', reject)
      req.end()
    })
    if (res.statusCode !== 303 && res.statusCode !== 302) throw new InnerAuthError(`exchange returned http ${res.statusCode}`)
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 接入、管理和断开要承担什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要UUMit账号、dsh web>=0.2.1-rc.2、Node ^22.19或>=24及平台/通道网络；Desktop不支持。主人必须在本机已认证浏览器配对核码、选择仅自己或受邀人，public档二次确认后相当于匿名人可完整操作DSH，不能当普通展示链接。管理接口要求loopback地址/Host、无远程标记、connection认可；写入另需自定义头、同源元数据和JSON，服务缺失即拒。Agent工具只status/connect/manage，不改授权。持续成本包括DSH原任务模型费用、通道网络、主机在线和平台可能费用，金额与可用性未知。unpair先请求平台，平台不可达时保留本地连接状态而不假称断开，主人需先停用插件断本地通道再核实平台撤销；卸载/停用不会回滚已发生文件或终端操作。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:50-65](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/package.json#L50-L65)

Node与DSH范围。

<details>
<summary>查看原文（16行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "dsh": {
    "engines": {
      "dsh": ">=0.2.1-rc.2"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-sidebar"
      ]
    }
```

</details>

**依据 2 · 源码核查**：[src/ui/routes.js:43-62](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/src/ui/routes.js#L43-L62)

主人与写入门。

<details>
<summary>查看原文（20行）</summary>

```text
export function ownerRejection(req, connection) {
  if (req.headers[REMOTE_MARKER_HEADER] !== undefined) return 403
  if (!isLoopbackAddress(req.socket?.remoteAddress) || !isLoopbackHostHeader(req.headers.host)) return 403
  if (!connection || typeof connection.requestRejection !== 'function') return 403
  let rejection
  try {
    rejection = connection.requestRejection({ headers: req.headers })
  } catch {
    return 403
  }
  return rejection === undefined ? 0 : rejection
}

/** 写操作的跨站防护：自定义请求头 + 同源抓取元数据 + JSON。 */
export function writeRejection(req) {
  if (req.headers['x-uumit-remote-ui'] !== '1') return 403
  const site = req.headers['sec-fetch-site']
  if (site !== undefined && site !== 'same-origin') return 403
  if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) return 415
  return 0
```

</details>

**依据 3 · 源码核查**：[src/ui/routes.js:153-159](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/src/ui/routes.js#L153-L159)

public需明确确认。

```text
    'POST /api/exposure': async (body) => {
      const name = requireService(agent)
      if (!TIERS.has(body.tier)) throw Object.assign(new Error('tier'), { status: 422, code: 'VALIDATION_FAILED' })
      if (body.tier === 'public' && body.confirm !== true) throw Object.assign(new Error('选择「所有人」需要确认'), { status: 422, code: 'CONFIRMATION_REQUIRED' })
      const svc = await agent.api.desktopSetExposure(name, { tier: body.tier, confirm: body.tier === 'public' ? true : null, triggerReason: '在 DSH 本机管理页设置' })
      await agent.refreshConfig()
      return svc
```

**依据 4 · 源码核查**：[src/tool.js:62-76](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/src/tool.js#L62-L76)

工具实际允许的操作。

<details>
<summary>查看原文（15行）</summary>

```text
export async function executeAction(agent, origin, args) {
  const action = args && args.action
  try {
    if (action === 'status') return { ok: true, action, ...summarize(agent.status(), origin) }
    if (action === 'manage') return { ok: true, action, manage_url: manageURL(origin), say: '请点 DSH 侧栏底部设置按钮旁的 UUMit 图标，在弹出的面板里选择谁能用、邀请别人或断开。图标不出现时也可以打开本机管理页。' }
    if (action === 'connect') {
      const s = agent.status()
      if (s.state === 'paired' || s.state === 'pairing') return { ok: true, action, ...summarize(s, origin) }
      await agent.startPairing()
      return { ok: true, action, ...summarize(agent.status(), origin) }
    }
  } catch (err) {
    return { ok: false, action, say: '操作没有成功，请打开本机管理页查看原因。', manage_url: manageURL(origin), error: { message: err && err.message ? err.message : String(err) } }
  }
  return { ok: false, action: String(action), say: '调用方式不对。', error: { message: `action must be one of ${ACTIONS.join(', ')}` } }
```

</details>

**依据 5 · 源码核查**：[src/agent.js:348-368](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/src/agent.js#L348-L368)

断开先平台请求再清本地。

<details>
<summary>查看原文（21行）</summary>

```text
  /** 断开后清理本地；平台不可达时不清理，避免本机以为断开而网页仍显示在线。 */
  async unpair() {
    if (this.creds) {
      try {
        await this.api.unpair()
      } catch (err) {
        if (!isCredentialRejected(err)) throw err
      }
    }
    this._clearLocal()
  }

  _clearLocal() {
    this.tunnel.stop()
    for (const t of this.timers) clearInterval(t)
    this.timers = []
    this.store.clearPairing()
    this.creds = null
    this.config = null
    this.issue = null
    this.emit('change')
```

</details>

**依据 6 · 源码核查**：[index.js:81-97](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/index.js#L81-L97)

dispose停止通道代理及路由。

<details>
<summary>查看原文（17行）</summary>

```text
  let stopped = false
  const stop = () => {
    if (stopped) return
    stopped = true
    agent.stop()
    proxy.close()
    tunnelServer.server.close()
    for (const d of disposers.splice(0)) {
      try {
        d()
      } catch {
        // 已随上下文释放
      }
    }
  }
  if (typeof ctx.on === 'function') ctx.on('dispose', stop)
  return stop
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么条件适合试用，如何检验授权生命周期？

**研究主题**：新假设与验证、采用判断

#### 完整回答

适合能控制本机与UUMit账号、理解远端完整权限的人，在无敏感文件和工具的独立web实例做私有访问试用。先核对配对码、正确实例、本机管理不可远端访问，再测试新HTTP请求和已连接WebSocket在授权撤销、网络中断及停用后的行为。错误实例、权限不符或撤销后仍能继续访问时应停插件断通道并在平台核实撤销，退回本机操作。可推导一个未实现方向，把授权快照时效与活动连接清退作为可见状态，明确区分新请求拒绝和既有连接终止。以撤销/配置不可达的对照检查暴露窗口、误断和操作恢复；若没有缩小窗口或误断负担超过收益则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/agent.js:382-406](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/src/agent.js#L382-L406)

旧配置维护支持时效假设。

<details>
<summary>查看原文（25行）</summary>

```text
  async refreshConfig() {
    if (!this.creds) return
    let cfg
    try {
      cfg = await this.api.getConfig()
    } catch (err) {
      if (isCredentialRejected(err)) return this._markRevoked('config')
      this.lastError = describeError(err)
      this.emit('change')
      // 平台暂不可达时按上次快照维持通道
      if (this.config) this._applyTunnel(this.config)
      return
    }
    if (cfg.tunnel_token && cfg.tunnel_token !== this.creds.tunnelToken) {
      this.store.saveCredentials({ ...this.creds, tunnelToken: cfg.tunnel_token })
      this.creds = this.store.loadCredentials()
    }
    this.store.saveConfig(cfg)
    this.store.saveSettings({ address: cfg.address, handle: cfg.handle, edition: cfg.edition })
    const prevInterval = this.config?.serving_report_interval_sec
    this.config = this.store.loadConfig()
    if (prevInterval !== this.config.serving_report_interval_sec && this.timers.length) this._scheduleReport()
    this.lastError = null
    if (!this.service()) await this._registerService()
    this._applyTunnel(this.config)
```

</details>

**依据 2 · 源码核查**：[src/proxy/loopback.js:253-288](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/src/proxy/loopback.js#L253-L288)

已升级连接支持清退假设。

<details>
<summary>查看原文（36行）</summary>

```text
  async handleUpgrade(req, socket, head, rule) {
    const pathname = new URL(req.url, 'http://x').pathname
    const { meta, reject } = this.admit(req, rule, pathname)
    if (reject) return writeRaw(socket, reject)
    let cookie
    try {
      cookie = await this.innerAuth.get()
    } catch {
      return writeRaw(socket, { status: 503, body: 'dsh unavailable', headers: { 'content-type': 'text/plain; charset=utf-8' } })
    }
    const origin = this.origin()
    const target = new URL(origin)
    const port = Number(target.port) || (target.protocol === 'https:' ? 443 : 80)
    const host = target.hostname.replace(/^\[|\]$/g, '')
    const up = target.protocol === 'https:' ? tls.connect({ host, port, rejectUnauthorized: false }) : net.connect({ host, port })
    const headers = rewriteHeaders(req, { origin, cookie, meta, index: false, upgrade: true })
    let lines = `${req.method} ${cleanPath(req.url)} HTTP/1.1\r\n`
    for (let i = 0; i < headers.length; i += 2) lines += `${headers[i]}: ${headers[i + 1]}\r\n`
    up.once(target.protocol === 'https:' ? 'secureConnect' : 'connect', () => {
      up.write(lines + '\r\n')
      if (head && head.length) up.write(head)
      up.once('data', (first) => {
        // DSH 拒绝内部凭据时作废缓存，下一次升级重新兑换
        if (/^HTTP\/1\.1 401/.test(first.toString('latin1', 0, 16))) this.innerAuth.invalidate(cookie)
        socket.write(first)
        up.pipe(socket)
        socket.pipe(up)
      })
    })
    up.on('error', (err) => {
      this.log.warn?.(`websocket upstream failed: ${err.message}`)
      socket.destroy()
    })
    socket.on('error', () => up.destroy())
    socket.on('close', () => up.destroy())
    up.on('close', () => socket.destroy())
```

</details>

**依据 3 · 源码核查**：[index.js:81-97](https://github.com/uumit-ai/dsh-uumit-remote/blob/9e64809f6db492f5eff4381cb90ddbbb7164c215/index.js#L81-L97)

停用作为本机退路。

<details>
<summary>查看原文（17行）</summary>

```text
  let stopped = false
  const stop = () => {
    if (stopped) return
    stopped = true
    agent.stop()
    proxy.close()
    tunnelServer.server.close()
    for (const d of disposers.splice(0)) {
      try {
        d()
      } catch {
        // 已随上下文释放
      }
    }
  }
  if (typeof ctx.on === 'function') ctx.on('dispose', stop)
  return stop
```

</details>

#### 缺口

- 没有真实UUMit网关、撤销传播和跨端访问验收。
  **影响**：不能证明外部平台身份、成员撤销和已有连接终止符合宣传，也不能给安全保证。
  **进一步探讨**：用独立实例记录配对、私有/受邀、HTTP与WebSocket撤销和平台故障的实际窗口及恢复。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
