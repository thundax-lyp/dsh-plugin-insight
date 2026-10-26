# dsh-sakurafrp

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[1c68de7](https://github.com/ArimaKana-Akane/dsh-sakurafrp/tree/1c68de7b79afa2b08734a28aa696a42d1bc0e250)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：在 DSH 中管理现有移动网关，提供链路状态、开关、配对二维码、设备撤销与自愈入口。

> **核心亮点**：相对手工调用网关管理 API 和查看 systemd，插件把状态、配对及设备撤销集中到会话内，并用用户关闭标记限制自愈。它没有实现隧道或手机网关，访问能力归属上游；贡献是现有链路的管理交接。[Q01](#research-q01)

> **风险与缺陷**：用户关闭意图能否可靠压过自愈是核心条件。control 先停网关再写抑制文件，文件失败仍返回 ok:true 和 suppressed:true，后台可能再次开启；后台 ensureGateway 使用 null 请求，adminBase 回退固定3080，非默认端口的面板控制与自愈可能指向不同实例。健康探测关闭证书校验，只支持连通响应判断。[Q02](#research-q02)

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
  - [Q01 · 管理壳真正增加什么，公网探测证明什么？](#detail-section-11)
  - [Q02 · 关闭、自愈与端口依赖是否保持一致？](#detail-section-12)
  - [Q03 · 统一期望状态能否取代额外抑制标记？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有 dsh-mobile 和 SakuraFrp 隧道的 Linux/WSL2 用户，从会话界面检查手机访问并管理配对设备。

替代是直接调用 dsh-mobile 管理接口、使用其原生设置及手工 systemctl；本插件便利集中，但保留多套状态和附加服务负担，未做人工时间对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 网关开关 | 管理手机访问 | 依赖上游 API 与可写关闭标记 |
| 配对及撤销 | 展示一次性二维码、撤销设备 | 权威来自 dsh-mobile，未做真实设备验收 |
| 链路探测 | 查看公网健康响应和延迟 | TLS证书验证关闭，不证明安全或业务可达 |
| 自愈与守护控制 | 恢复意外关闭网关 | 后台默认3080，用户关闭标记须成功 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH webServer 与 dsh-mobile | 核心必需 | 管理API和控制界面 | 无网关不能完成配对 |
| SakuraFrp/frpc、端口和证书 | 公网访问必需 | 手机到本机隧道 | 本插件不自动修复隧道配置 |
| 可写抑制文件 | 可靠关闭必需 | 阻止自愈重启 | 失败可能撤销用户关闭 |
| systemctl | 仅外部守护必需 | 开停 watchdog | 内置自愈另行运行 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户配置隧道、CA、端口和网关 | 上游访问独立可用 |
| 管理 | 用户开面板并申请配对 | 一次性二维码仅本机管理可见 |
| 验收 | 手机连接、用户撤销设备 | 撤销后确实拒绝访问 |
| 关闭 | 用户停网关并重启宿主 | 关闭意图保持，否则停用自愈排查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 隧道账号、宿主、证书资源，金额未知 | 配公网端口、CA和移动网关 | 本插件不承担隧道部署 |
| 持续使用 | 15秒管理检查、60秒公网探测 | 证书和设备撤销维护 | 流量与时长未知 |
| 失败恢复 | 重试、证书和服务恢复资源未知 | 对账关闭文件、网关状态和实例端口 | 标记失败可重新开启 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 图形管理 | 管理 API 转发和状态聚合 | 当前上游接口兼容 |
| 自愈 | 无关闭标记时尝试开启 | 多实例和标记失败的一致性 |
| 公网健康 | TLS请求检查200及ok字段 | 证书真实性、手机配对与任务办结 |

> **思考**：用户关闭意图能否可靠压过自愈是核心条件。control 先停网关再写抑制文件，文件失败仍返回 ok:true 和 suppressed:true，后台可能再次开启；后台 ensureGateway 使用 null 请求，adminBase 回退固定3080，非默认端口的面板控制与自愈可能指向不同实例。健康探测关闭证书校验，只支持连通响应判断。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手工调用网关管理 API 和查看 systemd，插件把状态、配对及设备撤销集中到会话内，并用用户关闭标记限制自愈。它没有实现隧道或手机网关，访问能力归属上游；贡献是现有链路的管理交接。[Q01](#research-q01)

相对手工调用网关管理 API 和查看 systemd，插件把状态、配对及设备撤销集中到会话内，并用用户关闭标记限制自愈。它没有实现隧道或手机网关，访问能力归属上游；贡献是现有链路的管理交接。[Q01](#research-q01)

正整数间隔校验避免 NaN 高频定时器，公网探测有并发 guard 和超时，变更管理检查回环、Origin 和标志/可选令牌。双状态关闭机制与后台默认端口是主要耦合，状态返回应反映标记实际写入结果。可借鉴用户意图优先的自愈原则，复用需权威状态及实例绑定。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

用户关闭意图能否可靠压过自愈是核心条件。control 先停网关再写抑制文件，文件失败仍返回 ok:true 和 suppressed:true，后台可能再次开启；后台 ensureGateway 使用 null 请求，adminBase 回退固定3080，非默认端口的面板控制与自愈可能指向不同实例。健康探测关闭证书校验，只支持连通响应判断。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，并在隔离链路验证关闭后跨重启仍关闭、标记不可写有明确失败、非3080端口不操作别的实例。健康显示仅作线索，完整验收还需真实配对、撤销和手机访问；缺少隧道或证书经验者先用上游管理说明。[Q02](#research-q02)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

管理转发、抑制与健康探测有源码支持；公网探测不验证证书真实性或完整配对链，关闭标记失败和后台固定端口存在限制。统一状态假设未实现。

- 已检查：作者 README、包清单、源码路径 lib/index.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 README、清单、host 管理转发、TLS探测、关闭标记、自愈和控制路由；未全面审计客户端、外部 watchdog 或 dsh-mobile 安全实现。
- 下一步：在复制环境验证关闭标记只读、两个端口、网关API错误和重启竞争，记录期望与实际状态；真实设备逐项验证配对失效和撤销，证书验证另外进行。未执行。

**分析版本**

- **仓库**：[ArimaKana-Akane/dsh-sakurafrp](https://github.com/ArimaKana-Akane/dsh-sakurafrp)
- **版本号**：1.1.0（[固定提交 1c68de7](https://github.com/ArimaKana-Akane/dsh-sakurafrp/tree/1c68de7b79afa2b08734a28aa696a42d1bc0e250)）
- **版本日期**：2026-09-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可提出未验证的统一期望状态方案，由网关权威配置保存 enabled 及版本，自愈只恢复已启用状态，管理壳不另存关闭文件，并从宿主取得实例端口。对关闭时写失败、两个端口及重启竞争测试，若仍重新打开或控制错误实例，就否定方案；需要上游 API 协作和迁移旧标记。[Q03](#research-q03)

在复制环境验证关闭标记只读、两个端口、网关API错误和重启竞争，记录期望与实际状态；真实设备逐项验证配对失效和撤销，证书验证另外进行。未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1322 | 1061 | 181 | — |
| .md | source | 1 | 335 | — | — | 3789 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/ArimaKana-Akane/dsh-sakurafrp/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：图形移动网关管理是否减轻维护，并可靠保留用户关闭意图？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 管理壳真正增加什么，公网探测证明什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

插件对 dsh-mobile 的 loopback API 转发开关、状态与配对，SakuraFrp/frpc 的公网隧道仍由外部部署，不能把这部分能力归给管理壳。相对脚本和 YAML 操作，它把多项维护集中为会话入口。公网探测请求 health 并检查200与ok文本，可测响应延迟；rejectUnauthorized:false 说明它不验证证书真实性，也没有完成手机配对与会话任务，因此只能作为可达性线索。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:199-217](https://github.com/ArimaKana-Akane/dsh-sakurafrp/blob/1c68de7b79afa2b08734a28aa696a42d1bc0e250/lib/index.js#L199-L217)

管理请求转发到现有上游 API，非新网关实现。

<details>
<summary>查看原文（19行）</summary>

```text
function adminBase(req) {
  try {
    const raw = String((req && req.headers && (req.headers.host || '')) || '').trim()
    if (/^(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/i.test(raw)) return 'http://' + raw
  } catch {}
  return 'http://127.0.0.1:3080'
}

async function adminCall(req, path, opts) {
  const options = opts || {}
  const url = adminBase(req) + ADMIN_PATH + path
  const init = { method: options.method || 'GET', signal: AbortSignal.timeout(TIMEOUT_MS) }
  if (options.body !== undefined) {
    init.headers = { 'Content-Type': 'application/json' }
    init.body = JSON.stringify(options.body)
  }
  const res = await fetch(url, init)
  const text = await res.text()
  let json = null
```

</details>

**依据 2 · 源码核查**：[lib/index.js:223-251](https://github.com/ArimaKana-Akane/dsh-sakurafrp/blob/1c68de7b79afa2b08734a28aa696a42d1bc0e250/lib/index.js#L223-L251)

探测关闭证书检查并按健康响应判定，证据范围有限。

<details>
<summary>查看原文（29行）</summary>

```text
function probeAuthority(authority) {
  return new Promise((resolve) => {
    const started = Date.now()
    const host = authority.split(':')[0]
    const port = Number(authority.split(':')[1] || 443)
    let done = false
    const finish = (payload) => { if (!done) { done = true; resolve(payload) } }
    let req
    try {
      req = https.request({
        host, port, path: '/mobile-access/health', method: 'GET',
        rejectUnauthorized: false, timeout: TIMEOUT_MS,
        headers: { Host: authority, 'User-Agent': 'dsh-sakurafrp/1.0' },
      }, (res) => {
        let data = ''
        res.setEncoding('utf8')
        res.on('data', (c) => { if (data.length < 4000) data += c })
        res.on('end', () => finish({
          authority,
          ok: res.statusCode === 200 && /"ok"\s*:\s*true/.test(data),
          status: res.statusCode,
          latencyMs: Date.now() - started,
          body: data.trim().slice(0, 160),
          error: null,
        }))
      })
    } catch (err) {
      finish({ authority, ok: false, status: 0, latencyMs: Date.now() - started, error: String((err && err.message) || err) })
      return
```

</details>

#### 缺口

- 真实手机端完整访问及撤销效果未验收。
  **影响**：健康面板不能证明远程任务闭环。
  **进一步探讨**：在明确网关、隧道和设备版本上验证配对、任务和撤销。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 关闭、自愈与端口依赖是否保持一致？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用、效果与总成本、采用判断

#### 完整回答

control 请求先改变网关，再调用 setSuppressed 保存用户意图；文件写失败只记日志，回复仍为 ok:true 与 suppressed:true。自愈只看文件存在，因此可能把用户刚关闭的网关重新打开。后台 ensureGateway 用 null 请求，adminBase 无 Host 时回退3080，而用户路由可从请求推导端口，非默认部署可能产生不同目标。这些是可见控制流缺口，未运行复现。首次还要配置隧道、证书及上游，持续有周期请求与设备维护，失败需要对账两套状态，金额和时长未知，宜先观察一致性再试用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:199-205](https://github.com/ArimaKana-Akane/dsh-sakurafrp/blob/1c68de7b79afa2b08734a28aa696a42d1bc0e250/lib/index.js#L199-L205)

后台无请求上下文回退固定端口。

```text
function adminBase(req) {
  try {
    const raw = String((req && req.headers && (req.headers.host || '')) || '').trim()
    if (/^(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/i.test(raw)) return 'http://' + raw
  } catch {}
  return 'http://127.0.0.1:3080'
}
```

**依据 2 · 源码核查**：[lib/index.js:302-316](https://github.com/ArimaKana-Akane/dsh-sakurafrp/blob/1c68de7b79afa2b08734a28aa696a42d1bc0e250/lib/index.js#L302-L316)

自愈以抑制文件为唯一关闭条件。

<details>
<summary>查看原文（15行）</summary>

```text
async function ensureGateway() {
  if (isSuppressed()) {
    state.selfHeal = { ...state.selfHeal, lastAt: Date.now(), lastAction: '已跳过（用户已关闭手机访问）', lastError: null }
    return { ok: true, running: false, changed: false, suppressed: true }
  }
  try {
    const ctl = await adminCall(null, '/control')
    if (!ctl.json) {
      state.selfHeal.lastError = 'control 无响应（dsh-mobile 未启用？）：' + ctl.text.slice(0, 120)
      return { ok: false, error: state.selfHeal.lastError }
    }
    if (ctl.json.running) return { ok: true, running: true, changed: false }
    const started = await adminCall(null, '/control', { method: 'POST', body: { running: true } })
    const running = !!(started.json && started.json.running)
    state.selfHeal = { lastAt: Date.now(), count: state.selfHeal.count + 1, lastAction: running ? '已重新拉起网关' : '拉起失败', lastError: running ? null : started.text.slice(0, 200) }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:484-496](https://github.com/ArimaKana-Akane/dsh-sakurafrp/blob/1c68de7b79afa2b08734a28aa696a42d1bc0e250/lib/index.js#L484-L496)

标记失败仍回成功，返回状态和实际持久性可分离。

<details>
<summary>查看原文（13行）</summary>

```text
  register('/dsh-sakurafrp/control', guarded(async (req, res, reply) => {
    if (req.method !== 'POST') { reply(405, { ok: false, error: '只接受 POST' }); return }
    const body = await readJson(req)
    const running = body.running !== false
    const r = await adminCall(req, '/control', { method: 'POST', body: { running } })
    if (!r.json) { reply(200, { ok: false, error: '网关控制无响应：' + r.text.slice(0, 200) }); return }
    // 记住用户意图：关闭 → 留抑制标记（自愈与 watchdog 都让路）；开启 → 清除标记。
    const marked = setSuppressed(!running)
    logLine('手机访问 ' + (running ? '开启' : '关闭')
      + (marked ? '' : '（抑制标记写入失败，自愈可能把它拉回来！）')
      + '：' + JSON.stringify(r.json).slice(0, 200))
    reply(200, { ok: true, gateway: r.json, suppressed: !running, snapshot: await snapshot(req) })
  }, { desktopOnly: true }))
```

</details>

#### 缺口

- 非默认端口与标记失败实际表现未复现。
  **影响**：不能量化错实例和重新开启风险。
  **进一步探讨**：双实例隔离部署并注入文件权限失败，核对所有请求目标和关闭结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 统一期望状态能否取代额外抑制标记？

**研究主题**：新假设与验证

#### 完整回答

额外文件解决了自愈覆盖关闭意图，却形成网关状态和插件标记两套事实。可推导未验证方案，把 enabled 期望及版本保存在网关权威配置，自愈只重建已启用实例，并从宿主提供的端口调用。需要上游接口配合和旧文件迁移，不能由本插件单方面保证。最小验证覆盖关闭提交失败、宿主重启和两个端口，要求关闭不被撤销且请求不越实例；若权威状态不可获取或仍出现重新开启，方案不成立。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:275-293](https://github.com/ArimaKana-Akane/dsh-sakurafrp/blob/1c68de7b79afa2b08734a28aa696a42d1bc0e250/lib/index.js#L275-L293)

独立文件状态提供统一权威假设的推导依据。

<details>
<summary>查看原文（19行）</summary>

```text
function isSuppressed() {
  try { return fs.existsSync(SUPPRESS_FILE) } catch { return false }
}

/** 写/删抑制标记；返回是否成功。 */
function setSuppressed(on) {
  try {
    if (on) {
      fs.mkdirSync(path.dirname(SUPPRESS_FILE), { recursive: true })
      fs.writeFileSync(SUPPRESS_FILE, new Date().toISOString() + ' 用户主动关闭手机访问\n', { mode: 0o600 })
    } else {
      fs.rmSync(SUPPRESS_FILE, { force: true })
    }
    return true
  } catch (err) {
    logLine('抑制标记写入失败：' + ((err && err.message) || err))
    return false
  }
}
```

</details>

#### 缺口

- 上游是否提供稳定期望状态接口未知。
  **影响**：方案可能需要修改网关而非纯管理壳。
  **进一步探讨**：先定义有版本的状态协议并验证迁移和并发。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
