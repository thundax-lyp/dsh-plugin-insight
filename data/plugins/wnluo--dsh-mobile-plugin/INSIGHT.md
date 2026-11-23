# DSH Mobile Plugin

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[d8febe5](https://github.com/WNLUO/dsh-mobile-plugin/tree/d8febe5aef7ae36e1be2238952c94a4614e1c8ed)

<!-- BEGIN META -->
[![GitHub ★ 242](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=242&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WNLUO/dsh-mobile-plugin) [![npm 30d 253,905](https://img.shields.io/static/v1?label=npm+30d&message=253%2C905&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mobile-plugin) [![最新发布 2026-11-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mobile-plugin)
<!-- END META -->

> **功能**：为手机客户端提供 DSH 会话、工作区和文件接口，并管理配对、网络线路与远程网页连接。

> **亮点**：[Q01](#research-q01) 把移动接续接入同一宿主会话；[Q03](#research-q03) 用消息身份关联prompt与正文回查，并给slash单独去重。

> **主要限制**：[Q02](#research-q02) 的控制面localOnly不检查socket、Host或Origin，采用依赖未核实的外层访问边界；[Q03](#research-q03) 的内存去重和有界回查也不能保证跨重启无重复。

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
  - [Q01 · 从安装到手机追加一条消息，实际运行的是哪一代插件？](#detail-section-11)
  - [Q02 · 设备权限、协议降级和本机控制面分别有怎样的边界？](#detail-section-12)
  - [Q03 · 普通消息和slash去重能保证送达与任务办结吗？](#detail-section-13)
  - [Q04 · 远程网页与多条网络线路扩大哪些责任，撤销完成表示什么？](#detail-section-14)
  - [Q05 · 采用前应补哪些条件，首次、持续、恢复与退出成本是什么？](#detail-section-15)
  - [Q06 · 怎样验证送达回查与授权撤销形成可靠的恢复流程？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已在电脑运行DSH会话的用户，通过配对手机查看会话并接续消息，其他文件与管理能力须按权限另评。

回桌面继续或使用原生网页。组件增加按设备配对的移动接口和线路管理，不等于端到端客户端、远端服务或业务任务已验证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话发送与正文回查 | 从手机接续同一会话 | 消息身份、权限和200事件窗口；accepted非办结 |
| 命令派发 | 从手机执行会话命令 | 已知命令按身份去重，未知可回退普通文本 |
| 设备权限与封包 | 限制移动路由和拒绝协议降级 | 旧凭据可能全权；不代表外层控制面安全 |
| 配对与撤销管理 | 发放凭据、轮换票据并断流 | 远端撤销是单独事实；控制面依赖外层边界 |
| 多线路连接管理 | 保存独立线路地址并撤回失效地址 | 实际公网可达与费用未核 |
| 远程电脑配对 | 给完整网页通道发独立凭据 | 比手机消息权限更广，代理全链未审计 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH webServer与包声明宿主范围 | 必需 | 挂载稳定外壳与路由 | 无webServer不加载；版本兼容未运行 |
| 会话网关/服务 | 发送和历史必需 | prompt及history | 路由存在不代表宿主服务就绪 |
| 支持协议的手机App、设备凭据与权限 | 移动任务必需 | 配对、授权、请求封包 | 旧凭据可能全权，未知路由拒绝 |
| 已核实的外层鉴权/网络边界 | 控制面部署必需 | 限制配置和撤销等管理入口 | localOnly本身不检查Origin/socket，无法说明时暂停采用 |
| relay/Cloudflare/其他线路 | 跨网按需 | 连接和地址发布 | 本地状态不能证明远端可达，服务/资源费用未知 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 用户核对控制面外层访问、宿主代及网络 | 非信任来源拒绝，运行/安装版本可区分 |
| 2 | 用户在非敏感隔离profile配对并核对档位 | 凭据权限与协议可解释 |
| 3 | 手机发送固定身份文本，回查宿主正文 | accepted和delivered分开，窗口外留未知 |
| 4 | 用户分通道撤销、断流并回桌面 | 核对旧凭据/票据/连接，远端不可达不当已确认 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 主机、手机和网络资源未知 | 兼容、外层鉴权、配对和权限 | 未测配置耗时 |
| 持续使用 | 模型、隧道/relay、进程和存储未知 | 维护线路、更新代与消息核对 | 不承诺免费/低成本 |
| 失败恢复 | 重试、扫描与重新配对资源未知 | 查消息身份、窗口与实际授权 | 内存去重不跨重启保证 |
| 退出 | 撤销/断连资源未知 | 分通道核对凭据、票据及旧流 | 远端不可达时撤销未确认 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 手机接续 | 凭据守卫及会话发送路由 | 实际客户端可靠性和办结时间 |
| 重试识别 | 消息ID、成功缓存与200事件正文回查 | 重启/窗口外重复和漏发 |
| 线路管理 | 独立地址与状态撤回、外壳持有传输 | 端到端可达性和服务开销 |
| 授权退出 | 本地吊销/轮换/断流及远端尝试 | 外层控制面与全通道撤销证明 |

> **思考**：[Q02](#research-q02) 的控制面localOnly不检查socket、Host或Origin，采用依赖未核实的外层访问边界；[Q03](#research-q03) 的内存去重和有界回查也不能保证跨重启无重复。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把移动接续接入同一宿主会话；[Q03](#research-q03) 用消息身份关联prompt与正文回查，并给slash单独去重。

[Q01](#research-q01) 外壳/代与传输分层降低换代交接耦合，但要暴露真实运行身份；[Q03](#research-q03) 接受与正文事实分开；[Q04](#research-q04) 地址撤回和撤销分项值得借鉴。复用时不可把localOnly命名当本机授权证明。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的控制面localOnly不检查socket、Host或Origin，采用依赖未核实的外层访问边界；[Q03](#research-q03) 的内存去重和有界回查也不能保证跨重启无重复。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 先确认控制面外层访问与权限，再考虑非敏感往返；边界不能说明、身份不匹配或撤销后仍可访问时停止扩展使用并回桌面。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

移动接线、凭据/权限、发送及撤销分支已检查；部署风险未攻防复现，手机端与网络结果未验证；恢复状态方案属于假设。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、lib/index.js、lib/impl.js、lib/routes/mobile-api.js、lib/http/routing.js、lib/routes/control-plane.js、lib/mobile/auth.js、lib/mobile/permissions.js、lib/mobile/session-send.js、lib/mobile/session-cache.js、lib/mobile/session-delivery.js、lib/shell/updater.js、lib/remote/host.cjs、lib/cloudflared/wiring.cjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件，覆盖旧Q01—Q05与当前控制面、权限、发送/命令、送达取消、远程配对及Cloudflare生命周期。没有全面审计全部新增forge/文件/统计路由、所有二进制获取、密码学和宿主外层认证。
- 下一步：未运行目标或网络攻防。先核实际部署控制面授权，再按[Q06](#research-q06) 做响应丢失/重启/窗口外/撤销的非敏感对照，分别记录未知与失败。

**分析版本**

- **仓库**：[WNLUO/dsh-mobile-plugin](https://github.com/WNLUO/dsh-mobile-plugin)
- **版本号**：0.5.97（[固定提交 d8febe5](https://github.com/WNLUO/dsh-mobile-plugin/tree/d8febe5aef7ae36e1be2238952c94a4614e1c8ed)）
- **版本日期**：2026-11-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出分开显示接受、正文、授权和运行代的未验证恢复方案，比较重复、漏发、撤销后访问和全部恢复时间。

未运行目标或网络攻防。先核实际部署控制面授权，再按[Q06](#research-q06) 做响应丢失/重启/窗口外/撤销的非敏感对照，分别记录未知与失败。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 36 | 3842 | — | — | 66270 |
| .js | source | 201 | 55842 | 36859 | 15887 | — |
| .mjs | source | 19 | 3492 | 2543 | 713 | — |
| .cjs | source | 85 | 18551 | 13043 | 4542 | — |
| .tsx | source | 51 | 9372 | 7179 | 1802 | — |
| .ts | source | 34 | 10845 | 9440 | 1196 | — |
| .mjs | test | 2 | 563 | 453 | 68 | — |
| .cjs | test | 319 | 80733 | 65420 | 9547 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/WNLUO/dsh-mobile-plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 26](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=26&color=737b86&logo=github)](https://github.com/WNLUO/dsh-mobile-plugin/issues?q=is%3Aissue+created%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z) [![近30天关闭 26](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=26&color=737b86&logo=github)](https://github.com/WNLUO/dsh-mobile-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z)



统计日期：2026-11-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：手机接续的身份、权限和送达回查能证明到哪一步，网络与自更新如何影响采用前提？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 从安装到手机追加一条消息，实际运行的是哪一代插件？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、依赖、兼容与流程

#### 完整回答

代表任务是已有电脑DSH会话的用户离开桌面后，用已配对手机查看内容并追加一条非敏感文本，最后在宿主历史中确认消息身份。相对回桌面或直接使用原生网页，本组件增加设备配对、移动API、网络线路和状态同步；移动App本身与托管relay不是这份根组件源码的全部实现，不能把接口存在写成端到端已可用。

根bundle patch挂载dsh-mobile-plugin，main是lib/index.js稳定外壳。外壳只硬注入webServer，创建runtime并安装传输持有者，真正移动路由在实现代装配，session/send与delivery均包guarded。宿主能力按需ctx.get并可降级，因此“路由可见”不证明会话发送网关已经就绪。

运行状态分别给installedVersion、当前runtime状态和两侧shell hash。周期先核对正式包/OTA并reconcile已安装代，随后才由autoUpdate开关决定是否自动装更新；关闭自动下载不意味着磁盘已有新版本永远不换代。开关文件不存在默认自动更新，损坏文件则不启。固定版本评估需要核对实际运行代与网络配置，不能只读包管理器版本。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:19-21](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/cordis.patch.yml#L19-L21)

根挂载。

```text
- insert:
    - id: dsh-mobile
      name: 'dsh-mobile-plugin'
```

**依据 2 · 源码核查**：[lib/index.js:26-49](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/index.js#L26-L49)

稳定入口与webServer/代runtime/传输装配。

<details>
<summary>查看原文（24行）</summary>

```text
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRuntime } from './shell/runtime.js'
import * as updater from './shell/updater.js'
import { installedPackageDir, installedVersion, profileNodeModules, snapshotRunningGeneration } from './shell/manager.js'
import { createDeviceOta } from './shell/device-ota.js'
import { installHostHalf } from './shell/half-route.js'
import { installTransportHosts } from './shell/transport-host.js'
import { firstInstallNeedsRestart } from './shell/first-install.js'

export const name = 'dsh-mobile-plugin'
// 外壳同样只等 `webServer`：它不读 `sessions`，多注一个只是多一种「整行 pending」的理由。
export const inject = ['webServer']

/**
 * 装载当前代，并把「查 / 装 / 换代码」这套动作暴露成服务。
 *
 * 对照 `lib/impl.js` 的 `apply`：那边注册真正的移动 API，这里注册「装载它」。两份 effect
 * 各自归属自己那层 fiber —— 外壳被卸载时，代的 fiber 作为子节点一起 dispose。
 */
export function apply(ctx) {
  const runtime = createRuntime()
  // 传输进程（sidecar / FRP / 总控上报）由稳定外壳持有，跨代存活；细节在 shell/transport-host.js。
  installTransportHosts(ctx)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:187-239](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/index.js#L187-L239)

运行/安装身份与周期换代顺序。

<details>
<summary>查看原文（53行）</summary>

```text
  ctx.reflect.provide('dshMobilePluginRuntime', {
    status: () => ({
      ...runtime.status(),
      /** 盘上装着的版本（市场装完立刻变，和运行中的版本对照就能看出「要不要换」）。 */
      installedVersion: installedVersion(),
      runningShellHash,
      installedShellHash: installedShellHash(),
      shellChanged: (() => {
        const installed = installedShellHash()
        return installed !== null && runningShellHash !== null && installed !== runningShellHash
      })(),
      profileNodeModules: profileNodeModules(),
      autoUpdate: updater.autoUpdateEnabled(),
      autoIntervalMs: updater.AUTO_INTERVAL_MS,
      marketBase: base(),
      marketLastCheckedAt: updateState.lastCheckedAt,
      marketLastError: updateState.lastError,
      marketResult: updateState.result,
      lastApply: updateState.lastApply,
      appliedAt: updateState.appliedAt,
      /** 第一次装进一台正在跑的 DSH、还没重启过：手机端据此要求重启一次（见 shell/first-install.js）。 */
      firstInstallPendingRestart: firstInstallNeedsRestart(),
    }),
    check,
    apply: applyUpdate,
    reload: version => runtime.reload(version),
    /** 就地把盘上这一份重新装载一遍：版本身份没变也照换（开发机改完代码用，见 runtime 的 reread）。 */
    reread: () => runtime.reload(undefined, { reread: true }),
    deviceOta,
    setAutoUpdate: enabled => {
      const value = updater.setAutoUpdate(enabled)
      log('info', 'dsh-mobile-plugin: 自动更新已%s', value ? '开启' : '关闭')
      return value
    },
  })

  runtime
    .start(ctx, { log })
    .then(() => {
      log('info', 'dsh-mobile-plugin: 已装载 %s（来源 %s）', runtime.status().version, runtime.status().source)
      // 每 2 分钟让已落盘的正式版接管 OTA，并补上「盘上比运行中新」的那次换代（补换代不
      // 受开关管：它不下载任何东西）；自动安装由开关控制，开着就不等正在跑的对话。
      const timer = setInterval(() => {
        deviceOta.reconcileOfficial()
          .then(() => updater.reconcileInstalledGeneration({ runtime, log }))
          .then(() => updater.autoUpdateEnabled() ? applyUpdate({ auto: true }) : null)
          .catch(error => {
            updateState.lastError = String(error?.message || error)
            log('warn', 'dsh-mobile-plugin: 更新检查失败：%s', updateState.lastError)
          })
      }, updater.AUTO_INTERVAL_MS)
      if (typeof timer.unref === 'function') timer.unref()
      ctx.effect(() => () => clearInterval(timer), 'dsh-mobile-plugin: auto update timer')
```

</details>

**依据 4 · 源码核查**：[lib/shell/updater.js:515-530](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/shell/updater.js#L515-L530)

缺配置默认自动更新，损坏不启。

<details>
<summary>查看原文（16行）</summary>

```text
/** 未设置过默认自动更新；显式关闭保持关闭，配置损坏时不改动盘上插件。 */
export function autoUpdateEnabled() {
  try {
    const raw = JSON.parse(fs.readFileSync(autoUpdateFile(), 'utf8'))
    return raw?.enabled === true
  } catch (error) {
    return error?.code === 'ENOENT'
  }
}

/** 写开关。 */
export function setAutoUpdate(enabled) {
  const file = autoUpdateFile()
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify({ enabled: enabled === true }, null, 2)}\n`)
  return autoUpdateEnabled()
```

</details>

**依据 5 · 源码核查**：[lib/routes/mobile-api.js:523-526](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/routes/mobile-api.js#L523-L526)

发送和送达挂到guarded路线。

```text
  route('/api/mobile/v1/session/send', sessions.handleSend)
  // 「这一发到底进没进」：App 的离线发件箱在重发之前先问一句（按 clientMessageId 回查
  // 会话正文）。只读、只看最近一窗，见 mobile/session-delivery.js。
  route('/api/mobile/v1/session/delivery', sessionDelivery.handleSessionDelivery)
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 设备权限、协议降级和本机控制面分别有怎样的边界？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

移动请求先解析独立设备凭据头，兼容Authorization Bearer；对已知记录，吊销和过期会直接失败，只有无记录时才尝试旧HMAC。permission按路径/方法分类，未知路由拒绝；但无记录和缺permissions字段的旧凭据仍视为全权，缺省配对档也是full，空数组才保留BASE以外的拒绝。approve权限还可立长期放行规则，不等于无副作用。权限表新增forge合并、审阅提交等FILES_WRITE能力，手机控制面已经不只是收发消息，应按实际任务核对授予范围。

守卫在有deviceKey的已知凭据未带协议v2时返回e2ee-required，避免静默回旧协议；v2再openRequest并把明文交给业务handler。未知路由拒绝与降级拒绝都是源码机制，本轮未做密码学审计或证明所有代理都保留正确头。

控制面是另一条重要边界。当前localOnly只检查relay/lan转发标记、实例头、配对cookie及method，不检查请求socket、Host或Origin；revoke-all与config实际使用它。trustedLocalUi存在不等于所有localOnly路由都调用它。源码因此不能支持“控制面只因名字就限定本机”的结论，直接暴露宿主端口或自定义反代时必须依赖外层鉴权与网络限制。本轮未核宿主外层和浏览器保护，不能宣称已利用漏洞，也不能宣称部署在公网仍已安全。

#### 证据与依据

**依据 1 · 源码核查**：[lib/mobile/auth.js:60-65](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/mobile/auth.js#L60-L65)

独立头优先及Bearer兼容。

```text
function presentedCredential(req) {
  const raw = req.headers['x-dsh-device-credential'];
  const header = Array.isArray(raw) ? raw[0] : raw;
  if (typeof header === 'string' && header.trim()) return header.trim();
  const m = /^Bearer\s+([^\s]+)$/.exec(req.headers.authorization || '');
  return m ? m[1] : null;
```

**依据 2 · 源码核查**：[lib/mobile/auth.js:85-110](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/mobile/auth.js#L85-L110)

已知记录先吊销/过期，再旧HMAC。

<details>
<summary>查看原文（26行）</summary>

```text
function authOutcome(req) {
  const presented = presentedCredential(req);
  if (presented) {
    const state = loadRelayState();
    if (state && state.instanceId) {
      // 过渡期里同一台手机的凭据可能还挂在旧号下（换身份尚未完成），新旧号都查一遍。
      let known = null;
      for (const id of instanceIdsOf(state)) {
        known = credentials.lookup(presented, id);
        if (known) break;
      }
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

**依据 3 · 源码核查**：[lib/mobile/permissions.js:11-27](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/mobile/permissions.js#L11-L27)

旧全权及approve的副作用声明。

<details>
<summary>查看原文（17行）</summary>

```text
 * 边界口径（只收紧不放开）：
 *  - 凭据记录里**没有 `permissions` 字段 = 全权**。现网老凭据、升级前的老会话都缺这一格，
 *    一律按全权放行，行为与今天单 token 全给一字不差。
 *  - `permissions: []`（空数组）≠ 缺失：它是「明确什么都不给」，除下方 BASE 那几条保命接口
 *    （能连上、能自愈、能自己解绑、能升级）外全部 403。
 *  - 授权只能收窄：手机端只能在自己的当前权限里往下减（见 setDevicePermissions 的调用方），
 *    授予 / 提权只在电脑侧。
 *
 * 一个权限位 gate 一组路由。依赖关系（input→view、dispatch→view、files.write→files.read）
 * 由档位保证闭包完整（三档枚举本身自洽），运行时按位独立判定、不做隐式扩展；授予入口只收
 * 这三档枚举，没有别的写入路径，所以这里不加运行时闭包校验。
 *
 * 两条限制，摆明在头里：
 *  - 无记录的老凭据（升级前的 HMAC）按全权放行，且**无法被按设备降档** —— 它没有记录可写，
 *    要断只能吊销全部。
 *  - 可答审批档（approve）不等于无副作用：批一次能让模型在该会话里落地写动作，也能立一条
 *    长期自动放行规则。
```

</details>

**依据 4 · 源码核查**：[lib/mobile/permissions.js:46-62](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/mobile/permissions.js#L46-L62)

三档与缺省full。

<details>
<summary>查看原文（17行）</summary>

```text
/** 三档：配对时在电脑侧选定，展开成 permissions 数组存进凭据。 */
const TIERS = Object.freeze({
  readonly: [PERMISSIONS.VIEW, PERMISSIONS.FILES_READ],
  approve: [PERMISSIONS.VIEW, PERMISSIONS.FILES_READ, PERMISSIONS.APPROVE],
  full: ALL_PERMISSIONS.slice(),
});

const TIER_NAMES = Object.freeze(Object.keys(TIERS));
const DEFAULT_TIER = 'full';

function isKnownTier(tier) {
  return typeof tier === 'string' && Object.prototype.hasOwnProperty.call(TIERS, tier);
}

/** 档位 → 权限数组（未知 / 缺省一律回全权，向后兼容）。 */
function permissionsForTier(tier) {
  return isKnownTier(tier) ? TIERS[tier].slice() : TIERS.full.slice();
```

</details>

**依据 5 · 源码核查**：[lib/mobile/permissions.js:103-114](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/mobile/permissions.js#L103-L114)

缺权限字段/无记录仍全权。

<details>
<summary>查看原文（12行）</summary>

```text
/**
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
```

</details>

**依据 6 · 源码核查**：[lib/mobile/permissions.js:279-295](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/mobile/permissions.js#L279-L295)

forge读写和合并权限面积。

<details>
<summary>查看原文（17行）</summary>

```text
  '/api/mobile/v1/git/forge/capabilities': V.VIEW,
  '/api/mobile/v1/git/forge/state': V.FILES_READ,
  '/api/mobile/v1/git/forge/diff': V.FILES_READ,
  '/api/mobile/v1/git/forge/checks': V.FILES_READ,
  '/api/mobile/v1/git/forge/commits': V.FILES_READ,
  '/api/mobile/v1/git/forge/review': V.FILES_READ,
  '/api/mobile/v1/git/forge/reviewers': V.FILES_READ,
  '/api/mobile/v1/git/forge/viewed': { GET: V.FILES_READ, POST: V.FILES_WRITE },
  '/api/mobile/v1/git/forge/track': V.FILES_WRITE,
  '/api/mobile/v1/git/forge/dismiss': V.FILES_WRITE,
  '/api/mobile/v1/git/forge/review-write': V.FILES_WRITE,
  '/api/mobile/v1/git/forge/submit-review': V.FILES_WRITE,
  '/api/mobile/v1/git/forge/rerun-checks': V.FILES_WRITE,
  '/api/mobile/v1/git/forge/request-reviews': V.FILES_WRITE,
  '/api/mobile/v1/git/forge/update-branch': V.FILES_WRITE,
  '/api/mobile/v1/git/forge/ready': V.FILES_WRITE,
  '/api/mobile/v1/git/forge/merge': V.FILES_WRITE,
```

</details>

**依据 7 · 源码核查**：[lib/http/routing.js:174-224](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/http/routing.js#L174-L224)

未知分类、权限及deviceKey降级拒绝。

<details>
<summary>查看原文（51行）</summary>

```text
    // 按设备权限子集校验本条路由（见 lib/mobile/permissions.js）。位置定死在「已鉴权、
    // 已挂 record」之后、「解封」之前：越权能直接回**明文 403**，客户端不必解信封就能读懂；
    // 而 401（没登录/被踢/过期）与 403（登录了但缺这一位）必须是两种处置，不能混。
    // BASE 路由 resolve 回 null、老凭据 / 无记录 has 恒真，都自然放行。
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
          error: { code: 'permission-denied', message: '这台手机没有这个操作的权限，请到电脑端的插件里把权限提上来', required: need, granted },
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
      try {
        rawBody = await envelope.readBody(req)
      } catch {
        return sendJson(res, 413, { ok: false, error: { code: 'e2ee-bad-envelope', message: '请求体过大' } })
      }
      const opened = openRequest(req, { keyFor: envelope.keyFor }, rawBody)
      if (!opened.ok) {
        // 错误响应永远明文（§8.3(11)）：App 要先读懂它才谈得上重发或校准时钟。
        if (opened.extra) sendJson(res, opened.status, { ok: false, error: { code: opened.code, ...opened.extra } })
        else sendJson(res, opened.status, { ok: false, error: { code: opened.code } })
        return
      }
      sealed = opened
      // 业务 handler 拿到的是明文 JSON：域代码一行业务逻辑都不用知道信封存在。
      if (opened.body !== undefined) req.body = opened.body
      // SSE 那条路要逐帧封装（帧没有请求头可用），所以把密钥与这次请求的 AAD 材料
      // 挂在 req 上，由开流那一处取。**只在内存里、只活这一条请求**。
      req.__dshE2ee = { keys: opened.keys, req: opened.req }
```

</details>

**依据 8 · 源码核查**：[lib/http/routing.js:31-56](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/http/routing.js#L31-L56)

转发标记、实例头和cookie判据。

<details>
<summary>查看原文（26行）</summary>

```text
const VIA_HEADER = 'x-dsh-via';

/** 请求是否由本机的中转或局域网代理转发而来（值即转发方）。 */
const proxiedRequest = (req) => {
  const headers = req?.headers;
  if (!headers || typeof headers !== 'object') return false;
  // 按小写比对而不是直接取键：Node 会把入站头名压成小写，但假 req、反代注入、
  // 以及 `WebSocket` 升级那条路的 headers 对象不保证如此，靠大小写绕过太便宜。
  for (const [name, raw] of Object.entries(headers)) {
    if (name.toLowerCase() !== VIA_HEADER) continue;
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (typeof value === 'string' && value.trim() !== '') return true;
  }
  return false;
};

// Relay pairing cookies and instance headers are routing credentials only;
// never allow them to reach the local control plane.
//
// `x-dsh-via` 也在这里：它是「转发来的」这个事实本身。手机走 `/api/mobile/v1/**` 时通常
// 既不待实例头也不带 cookie，只靠这两条挡不住转发来的控制面请求。
const remoteRelayRequest = (req) => Boolean(
  proxiedRequest(req)
    || (typeof req.headers['x-dsh-instance'] === 'string' && req.headers['x-dsh-instance'])
    || /(?:^|;\s*)dsh_(?:pair|lan)=/.test(String(req.headers.cookie || '')),
)
```

</details>

**依据 9 · 源码核查**：[lib/http/routing.js:109-118](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/http/routing.js#L109-L118)

localOnly仅转发和method检查。

<details>
<summary>查看原文（10行）</summary>

```text
const localOnly = (method, handler) => async (req, res) => {
  if (remoteRelayRequest(req)) return sendJson(res, 403, { ok: false, error: { code: 'local_only', message: '控制面仅允许本机访问' } })
  const allowed = Array.isArray(method) ? method : [method]
  const actual = String(req.method || 'GET').toUpperCase()
  if (!allowed.includes(actual)) {
    const label = Array.isArray(method) ? method.join(' / ') : method
    return sendJson(res, 405, { ok: false, error: { code: 'method-not-allowed', message: `仅支持 ${label}` } })
  }
  return handler(req, res)
}
```

</details>

**依据 10 · 源码核查**：[lib/routes/control-plane.js:1140-1162](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/routes/control-plane.js#L1140-L1162)

撤销和配置真实使用localOnly。

<details>
<summary>查看原文（23行）</summary>

```text
  registerRoute({ kind: 'exact', path: '/api/relay/revoke-all', handler: localOnly('POST', async (_req, res) => {
    const deviceIds = [...new Set((credentials.listDevices?.(state.instanceId) || []).map(device => device.deviceId).filter(Boolean))]
    // 清除所有授权 = 中转清空本实例全部设备授权 + 本机吊销局域网设备凭据 +
    // 轮换 lanSecret/配对码。三处都要做：只清中转的话，同网设备仍能用旧的
    // `dshc_` 凭据直连宿主，而移动端的「撤销全部授权」正是在要求它们全部失效。
    let revoked = 0
    try {
      const result = await getSidecar().request('/revoke-all', 'POST', undefined, 20_000)
      revoked = Number(result && result.revoked) || 0
    } catch { /* 中转不可达时仍继续吊销本机凭据与密钥 */ }
    const localRevoked = credentials.revokeAllByInstance(state.instanceId)
    state.lanSecret = randomBytes(32).toString('hex')
    // 恢复全部授权也要把二维码那枚票据一起换掉（`core.rotatePairing` 一次换码换票）：
    // 只换 pairingCode 的话，截图里那张旧二维码的票据仍能配出新设备。
    core.rotatePairing(state)
    core.saveState(state)
    await syncSidecar().catch(() => undefined)
    for (const deviceId of deviceIds) dropDeviceStreams(deviceId, res)
    dropAllDeviceStreams(res)
    sendJson(res, 200, { ok: true, revoked: revoked + localRevoked, revokedRelay: revoked, revokedLocal: localRevoked, ...status() })
  }) })
  registerRoute({ kind: 'exact', path: '/api/relay/config', handler: localOnly('POST', async (req, res) => {
    const body = await readJson(req)
```

</details>

#### 缺口

- 宿主外层鉴权、监听范围和代理对控制面路径的限制未独立核实。
  **影响**：不能给直接公网或任意反代部署持续采用建议。
  **进一步探讨**：固定实际宿主和部署，核查外层认证是否覆盖配置/撤销路径，并从非信任来源验证拒绝边界。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 普通消息和slash去重能保证送达与任务办结吗？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

只能证明几个不同阶段，不能合并为一个成功状态。普通prompt在有clientMessageId时把对应requestId交宿主，并以sessionId:clientMessageId进入ctx级去重表；已有promise直接复用，只有成功信封保留，抛错或宿主明确拒绝会释放。状态是内存WeakMap，不是跨重启持久幂等账本；缺clientMessageId则直接调用。slash命令也用单独command前缀去重，已知命令派发成功返回handledAs=command，未知命令或网关缺失再按普通文本处理；普通prompt结论不能覆盖所有命令副作用。

可选模型选择仍在promptOnce外层先执行，host-unsupported有回退，其他错误明确返回。因而同消息身份复用prompt并不能推出模型选择外层也只发生一次。图片上传解析和空内容continuation还有各自输入检查，不应把所有发送都简化成同一个文本API。

发送最终accepted只表示当前调用未报错。delivery独立用宿主history最近200事件派生消息并寻找clientMessageId，命中给seq；会话不存在返回404，客户端断开可取消扫描。未命中可能是未落正文、已超窗口或历史不足，特别在插件重启后不能推断“绝对没发过”。模型任务完成、更改正确和用户验收还在更后阶段。可靠重试应保持身份并回查原事件，不能把accepted、delivered和办结混为一谈。

#### 证据与依据

**依据 1 · 源码核查**：[lib/mobile/session-send.js:102-112](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/mobile/session-send.js#L102-L112)

prompt requestId及同会话消息去重。

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

**依据 2 · 源码核查**：[lib/mobile/session-cache.js:395-414](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/mobile/session-cache.js#L395-L414)

内存promise复用、仅成功保留、失败释放。

<details>
<summary>查看原文（20行）</summary>

```text
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

**依据 3 · 源码核查**：[lib/mobile/session-send.js:161-181](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/mobile/session-send.js#L161-L181)

slash命令独立去重和accepted。

<details>
<summary>查看原文（21行）</summary>

```text
  // ── Slash 命令派发 ─────────────────────────────────────────────
  // 已知命令：注册表执行（command/run + command/done 随事件流回传），响应标注 handledAs 供
  // 客户端跳过「乐观 pending 气泡 + running 态」；未知命令/语法不符（execute 返回 undefined）
  // 与网关未组合时回退普通消息（对齐桌面 miss 落入默认 sink，`/foo` 仍按文本发送）。
  const singleText = singleTextOf(content);
  if (singleText !== null && singleText.trim().startsWith('/')) {
    const line = singleText.trim();
    const clientMessageId = typeof body.clientMessageId === 'string' ? body.clientMessageId : '';
    // 命令同样按 clientMessageId 去重：传输内核换通道重投同一次发送时，命令绝不能执行第二遍。
    // 口径与普通消息的 promptOnceFor 一致 —— 只有真正派发成功才留下去重记录；未知命令 / 网关
    // 未组合 / 派发失败都释放，允许重投真的再试一次。
    const runCommand = () => executeCommand(ctx, body.sessionId, line).then((outcome) => ({ outcome, result: { ok: outcome.execution !== undefined } }));
    const dispatched = clientMessageId ? await promptOnceFor(ctx, `${body.sessionId}:command:${clientMessageId}`, runCommand) : await runCommand();
    const outcome = dispatched.outcome;
    if (outcome.error) {
      const failure = outcome.error.failure
        || { code: 'command-error', message: outcome.error.message || String(outcome.error), details: {} };
      return sendJson(res, 400, { ok: false, error: failure });
    }
    if (outcome.execution !== undefined) {
      return sendJson(res, 200, { ok: true, accepted: true, handledAs: 'command' });
```

</details>

**依据 4 · 源码核查**：[lib/mobile/session-send.js:184-220](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/mobile/session-send.js#L184-L220)

模型选择在外层，promptaccepted非终局。

<details>
<summary>查看原文（37行）</summary>

```text
  // ── 本次发送携带的模型 ─────────────────────────────────────────
  // App 侧选模型只改本地，切换请求随这一条消息一起到。**必须在 prompt 之前**落到会话上，
  // 这样这一轮的第一步用的就是用户刚选的模型（`agent.model.select` 只作用于尚未准备的那一步）。
  // 旧宿主没有会话级切换接口时沿用会话当前模型，避免普通消息被可选选择阻断。
  // 模型不可用、配置无效、会话恢复失败与服务尚未就绪仍明确报错。
  const modelSelection = modelSelectionOf(body);
  if (modelSelection) {
    const applied = await selectSessionModel(ctx, { sessionId: body.sessionId, ...modelSelection });
    const result = applied && applied.result ? applied.result : null;
    if (result?.error?.code !== 'host-unsupported' && result?.ok !== true) {
      const failure = result && result.error
        ? result.error
        : { code: 'session/model-unavailable', message: '所选模型当前不可用', details: modelSelection };
      return sendJson(res, 400, { ok: false, error: continuation ? continuationError(failure) : failure });
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

**依据 5 · 源码核查**：[lib/mobile/session-delivery.js:30-69](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/mobile/session-delivery.js#L30-L69)

200事件窗口、取消、404与身份查找。

<details>
<summary>查看原文（40行）</summary>

```text
/** 一次回查读多少条事件：发件箱的条目只可能出现在最近这几天。 */
const DELIVERY_HISTORY_WINDOW = 200;
/** 两个参数的长度上限（与 `clientMessageId` 的生成形状同一个量级）。 */
const PARAM_MAX = 200;

/**
 * GET /api/mobile/v1/session/delivery?sessionId=…&clientMessageId=…（token）
 * → { ok, delivered, seq? }
 *
 * 宿主没有这条会话（被删 / 换了机器）时回 404：那是「查不到」，不是「没送到」——
 * App 据此把发件箱里那条标成失败，而不是永远重试。
 */
async function handleSessionDelivery(ctx, req, res) {
  const url = new URL(req.url, 'http://x');
  const sessionId = (url.searchParams.get('sessionId') || '').trim();
  const clientMessageId = (url.searchParams.get('clientMessageId') || '').trim();
  if (!sessionId || !clientMessageId || sessionId.length > PARAM_MAX || clientMessageId.length > PARAM_MAX) {
    return sendJson(res, 400, { ok: false, error: { code: 'bad-request', message: '需要 { sessionId, clientMessageId }' } });
  }
  const signal = requestSignal(res);
  const { value, error } = unwrap(await callSessions(ctx, 'history', { sessionId, maxMessages: DELIVERY_HISTORY_WINDOW }, 'mobile', signal));
  if (signal.aborted) return;
  if (error) {
    const missing = error.code === 'session-not-found';
    return sendJson(res, missing ? 404 : 502, {
      ok: false,
      error: {
        code: typeof error.code === 'string' ? error.code : 'host-call-failed',
        message: typeof error.message === 'string' && error.message ? error.message : '读取会话历史失败',
      },
    });
  }
  const events = (value && Array.isArray(value.events)) ? value.events : [];
  const messages = deriveMessages(events);
  const hit = messages.find((message) => message.clientMessageId === clientMessageId);
  sendJson(res, 200, {
    ok: true,
    delivered: Boolean(hit),
    ...(hit && typeof hit.seq === 'number' ? { seq: hit.seq } : {}),
  });
```

</details>

#### 缺口

- 手机弱网、进程重启和历史窗口外的实际重复/漏发率未测。
  **影响**：不能承诺跨重启exactly-once或无重复续写。
  **进一步探讨**：在响应丢失/重启/窗口外场景以宿主消息身份和seq核对，不以客户端气泡判断。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 远程网页与多条网络线路扩大哪些责任，撤销完成表示什么？

**研究主题**：依赖、兼容与流程、工程质量与复用、效果与总成本

#### 完整回答

远程电脑通道与手机API权限是不同用途。remote host处理配对OPTIONS并回显Origin，真正POST仍检查实例、限流、一次票据、版本和密钥材料，在异步工作前消费票据并发remoteWeb凭据。CORS回显本身不是授权保证，票据与后续连接校验才是主边界；本轮只追配对，不宣称整个网页代理和浏览器隔离已审计。完整网页能力比一条手机文本续写更广，必须单独验证退出与既有连接。

Cloudflare线路在impl实际mount，wiring优先复用外壳持有runner，地址写独立cloudflareUrl而不改用户手填LAN/TCP地址。stop调用runner.stop再清地址，重启前撤旧地址，按enabled恢复；创建或启停失败保留可查询降级状态。这区分“配置受理”和“已有连通地址”，但不能由本地状态证明公网手机端实际可达，也不能证明第三方隧道服务持续可用或免费。FRP、P2P和其他线路另有部署责任，本研究没有全面评测所有二进制获取和网络回退。

撤销全部会尝试远端sidecar revoke，再吊销本地凭据、换lanSecret和配对票据、保存并断开流。远端不可达被catch后仍继续本地撤销，所以一次成功HTTP回包不证明远端撤销已确认；应分读revokedRelay、revokedLocal并核对旧通道是否还能访问。退出要覆盖凭据、票据、传输进程和完整网页连接，不能仅在手机点解绑。

#### 证据与依据

**依据 1 · 源码核查**：[lib/remote/host.cjs:89-137](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/remote/host.cjs#L89-L137)

CORS与实际配对认证、消费票据和remoteWeb凭据分层。

<details>
<summary>查看原文（49行）</summary>

```text
  async function handlePair(req, res) {
    // 浏览器从官网这个源打过来是跨源的：预检和正式回包都要能让浏览器放行。
    // 配对本身有一次票据 + 端到端加密证明，CORS 不是这里的鉴权边界，回显来源即可。
    // 放在方法判断之前：预检（OPTIONS）必须能被答掉，否则真请求根本发不出来。
    const origin = req && req.headers
      ? (Array.isArray(req.headers.origin) ? req.headers.origin[0] : req.headers.origin)
      : '';
    const allowCors = () => { if (origin) res.setHeader('access-control-allow-origin', origin); };
    if (req.method === 'OPTIONS') {
      allowCors();
      res.setHeader('access-control-allow-methods', 'POST, OPTIONS');
      res.setHeader('access-control-allow-headers', 'content-type, x-dsh-instance');
      res.setHeader('access-control-max-age', '600');
      res.writeHead(204);
      res.end();
      return;
    }
    allowCors();
    if (req.method !== 'POST') { sendJson(res, 405, { ok: false, code: 'REMOTE_METHOD' }); return; }
    if (closed) { sendJson(res, 503, { ok: false, code: 'REMOTE_CONNECT' }); return; }
    // 请求自报的实例号（头优先，缺头看 `?instance=`）与本机对不上：这张链接指向别的电脑。
    // 趁还没花掉限流额度、也没读请求体时就拒掉，别让一张错链接吃满限流。
    const refusal = instanceHintRefusal(req, instanceId());
    if (refusal) { sendJson(res, 400, { ok: false, code: refusal }); return; }
    const rate = throttle.take();
    if (!rate.allowed) { res.setHeader('retry-after', String(rate.retryAfterSec)); sendJson(res, 429, { ok: false, code: 'REMOTE_RATE_LIMIT' }); return; }
    const timeout = setTimeout(() => req.destroy(), HANDSHAKE_MS);
    timeout.unref?.();
    let body;
    try { body = await readJsonBody(req, c.MAX_HANDSHAKE); } finally { clearTimeout(timeout); }
    const ticket = body && tickets.get(body.ticketId);
    try {
      if (!ticket || ticket.expiresAt <= now() || body.instanceId !== instanceId()) throw c.error('REMOTE_AUTH');
      if (body.v !== 1) throw c.error(typeof body.v === 'number' ? 'REMOTE_VERSION' : 'REMOTE_AUTH');
      const keys = c.pairKeys(ticket.ticket, instanceId(), ticket.ticketId);
      const request = c.openJson(keys.up, body.sealed, pairAad(ticket.ticketId, 'up'));
      c.keyBytes(request.deviceKey);
      c.keyBytes(request.nonce);
      if (!KEY_ID.test(request.keyId) || typeof request.deviceId !== 'string' || !request.deviceId || request.deviceId.length > 128) throw c.error('REMOTE_AUTH');
      // 在任何异步工作前消耗：同一邀请的并行请求只能有一份获得授权。
      tickets.delete(ticket.ticketId);
      const device = { deviceId: request.deviceId, name: String(request.name || 'Computer').slice(0, 128), platform: 'computer' };
      const issued = credentials.issue(instanceId(), device, '', undefined, { deviceKey: request.deviceKey, keyId: request.keyId, permissions: [], remoteWeb: true });
      const binding = { instanceId: instanceId(), name: name(), deviceId: issued.deviceId, credential: issued.credential, keyId: request.keyId, routes: await routes(), createdAt: now(), nonce: request.nonce, connectionInfo: await info() };
      throttle.noteSuccess();
      sendJson(res, 200, { ok: true, v: 1, sealed: c.sealJson(keys.down, binding, pairAad(ticket.ticketId, 'down')) });
    } catch (error) {
      throttle.noteFail();
      sendJson(res, 401, { ok: false, code: error?.code === 'REMOTE_VERSION' ? 'REMOTE_VERSION' : 'REMOTE_AUTH' });
```

</details>

**依据 2 · 源码核查**：[lib/impl.js:528-528](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/impl.js#L528-L528)

Cloudflare线路实际挂载。

```text
  const cloudflare = mountCloudflare({ mount, warn, state, settings, portOf: advertisedLanPort, ctx, name })
```

**依据 3 · 源码核查**：[lib/cloudflared/wiring.cjs:33-66](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/cloudflared/wiring.cjs#L33-L66)

外壳复用、创建降级和stop清地址。

<details>
<summary>查看原文（34行）</summary>

```text
function mountCloudflare(options) {
  const { mount, warn, state, settings, portOf, ctx, name } = options;
  // 外壳持有 runner 时沿用（换代不重启隧道）；缺省走本地。
  let host = null;
  try { host = typeof ctx.get === 'function' ? ctx.get('dshMobileTransportCloudflare') || null : null } catch { host = null; }
  // 运行器创建本身万一抛错，也不能让插件加载失败：给一个「不可用但可查询原因」的降级壳。
  let runner;
  try {
    runner = host && host.runner ? host.runner : createCloudflaredRunner({ portOf });
  } catch (error) {
    warn('Cloudflare 隧道运行器创建失败：%s', error && error.message ? error.message : error);
    const degraded = () => ({ available: false, running: false, pid: null, url: '', error: `Cloudflare 隧道初始化失败：${error && error.message ? error.message : error}`, startedAt: 0, starting: false, retrying: false, waitingForPort: false, enabled: false });
    return { start: async () => degraded(), stop: async () => degraded(), status: degraded, syncLocalPort: async () => degraded() };
  }

  // 控制面开关：start 幂等（runner 自己写 enabled 标记）；stop 幂等（runner 删标记、停进程）。
  // 任何一步出错都不许把异常抛回调用方（会变成面板 500 / 甚至未捕获拒绝），只记日志并把状态交回去。
  const start = async () => {
    try { await runner.start(); }
    catch (error) { warn('启动 Cloudflare 隧道失败：%s', error && error.message ? error.message : error); }
    return runner.status();
  };
  /** 撤掉状态里那条已经连不上的地址；没写过就什么都不做。 */
  const clearAddress = async () => {
    if (typeof state.cloudflareUrl !== 'string' || !state.cloudflareUrl) return;
    try { await settings.update({ cloudflareUrl: '' }); }
    catch (error) { warn('撤掉 Cloudflare 地址失败：%s', error && error.message ? error.message : error); }
  };
  const stop = async () => {
    try { await runner.stop(); }
    catch (error) { warn('停止 Cloudflare 隧道失败：%s', error && error.message ? error.message : error); }
    // runner 停进程时会走「地址撤回」，这里再兜一次：面板回包里也不能留旧地址。
    await clearAddress();
    return runner.status();
```

</details>

**依据 4 · 源码核查**：[lib/cloudflared/wiring.cjs:71-92](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/cloudflared/wiring.cjs#L71-L92)

地址监听、旧地址撤回及按状态自启。

<details>
<summary>查看原文（22行）</summary>

```text
  // 地址回报：隧道拿到新 https 地址时写进独立字段 `cloudflareUrl`（不再写 `manualLanUrl`）。
  // settings.update 会经 settings.watch → applyServices → control.sync() 自动把新地址报给总控，
  // 总控那头从 `kind:'cf'` 这条线路上读，和用户手填的直连互不覆盖。
  mount('cloudflare 地址', () => ctx.effect(() => {
    if (typeof runner.setAddressGoneListener === 'function') runner.setAddressGoneListener(clearAddress);
    if (typeof runner.setAddressListener !== 'function') return () => {};
    runner.setAddressListener(async (address, isCurrent) => {
      if (!isCurrent() || state.cloudflareUrl === address) return;
      try { await settings.update({ cloudflareUrl: address }); }
      catch (error) { warn('把 Cloudflare 地址写回状态失败：%s', error && error.message ? error.message : error); }
    });
    return () => runner.setAddressListener(null);
  }, `${name}: cloudflare address`));
  // 上次运行留下的地址（relay.json 里那条）来自上一条隧道，这次进程还没连上之前它一定是死链：
  // 先撤掉，等这轮真连上边缘再由地址监听写回来。重启 DSH / 插件热重载都走这里。
  if (typeof state.cloudflareUrl === 'string' && state.cloudflareUrl && !status().running) void clearAddress();
  // 自动启动：上次是启用状态就再拉起；卸载时杀进程但保留 enabled 供下次恢复。
  if (!(host && host.runner)) {
    mount('cloudflare 隧道进程', () => ctx.effect(() => {
      if (runner.shouldAutoStart()) Promise.resolve(runner.start()).catch((error) => warn('自动启动 Cloudflare 隧道失败：%s', error && error.message ? error.message : error));
      return () => { void runner.dispose(); };
    }, `${name}: cloudflare runner`));
```

</details>

**依据 5 · 源码核查**：[lib/routes/control-plane.js:1140-1159](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/routes/control-plane.js#L1140-L1159)

远端best effort、本地吊销/轮换/断流与分项回执。

<details>
<summary>查看原文（20行）</summary>

```text
  registerRoute({ kind: 'exact', path: '/api/relay/revoke-all', handler: localOnly('POST', async (_req, res) => {
    const deviceIds = [...new Set((credentials.listDevices?.(state.instanceId) || []).map(device => device.deviceId).filter(Boolean))]
    // 清除所有授权 = 中转清空本实例全部设备授权 + 本机吊销局域网设备凭据 +
    // 轮换 lanSecret/配对码。三处都要做：只清中转的话，同网设备仍能用旧的
    // `dshc_` 凭据直连宿主，而移动端的「撤销全部授权」正是在要求它们全部失效。
    let revoked = 0
    try {
      const result = await getSidecar().request('/revoke-all', 'POST', undefined, 20_000)
      revoked = Number(result && result.revoked) || 0
    } catch { /* 中转不可达时仍继续吊销本机凭据与密钥 */ }
    const localRevoked = credentials.revokeAllByInstance(state.instanceId)
    state.lanSecret = randomBytes(32).toString('hex')
    // 恢复全部授权也要把二维码那枚票据一起换掉（`core.rotatePairing` 一次换码换票）：
    // 只换 pairingCode 的话，截图里那张旧二维码的票据仍能配出新设备。
    core.rotatePairing(state)
    core.saveState(state)
    await syncSidecar().catch(() => undefined)
    for (const deviceId of deviceIds) dropDeviceStreams(deviceId, res)
    dropAllDeviceStreams(res)
    sendJson(res, 200, { ok: true, revoked: revoked + localRevoked, revokedRelay: revoked, revokedLocal: localRevoked, ...status() })
```

</details>

#### 缺口

- 远端撤销、持续连接关闭和各线路实际可达性未执行。
  **影响**：不能将本地回包当全通道撤销证明。
  **进一步探讨**：分别测试旧凭据、旧票据、已建流及远程网页；不可达时保留未确认状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用前应补哪些条件，首次、持续、恢复与退出成本是什么？

**研究主题**：采用判断、效果与总成本

#### 完整回答

当前建议先观察并核实部署边界。至少要确认宿主端口没有把控制面直接交给非信任来源，且外层认证确实覆盖config、revoke等路径，再考虑个人隔离profile中的非敏感一条文本往返。配对时选择适当档位并检查实际记录，不把缺省full当最小授权；发送需要input等权限，readonly不能直接当可续写档。先验证可读、可发、可回查和可撤销，再讨论文件/forge等更强能力。

首次投入是主机/手机兼容、网络入口和配对/权限；持续投入有模型调用、relay/隧道流量、平台进程、更新换代和凭据续期；失败恢复要确认消息身份、运行代、历史窗口和副作用；退出要分通道吊销/断流并回桌面继续。费用、峰值资源和总时间没有本轮数据，不称免费或低成本。自动更新与已有新代接管还会改变固定版本试验，应记录真实代而非仅关一个开关。

若无法说明控制面的外层访问限制、旧全权凭据无法收回、accepted与正文身份对不上，或撤销后旧连接仍能读写，应停止扩展使用，回到桌面原生会话并处理网络/凭据。源码的接续价值仍在，但这些关键边界未确认，不适合以接口数量提高采用结论。

#### 证据与依据

**依据 1 · 源码核查**：[lib/http/routing.js:109-118](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/http/routing.js#L109-L118)

采用前需外层边界的源码原因。

<details>
<summary>查看原文（10行）</summary>

```text
const localOnly = (method, handler) => async (req, res) => {
  if (remoteRelayRequest(req)) return sendJson(res, 403, { ok: false, error: { code: 'local_only', message: '控制面仅允许本机访问' } })
  const allowed = Array.isArray(method) ? method : [method]
  const actual = String(req.method || 'GET').toUpperCase()
  if (!allowed.includes(actual)) {
    const label = Array.isArray(method) ? method.join(' / ') : method
    return sendJson(res, 405, { ok: false, error: { code: 'method-not-allowed', message: `仅支持 ${label}` } })
  }
  return handler(req, res)
}
```

</details>

**依据 2 · 源码核查**：[lib/mobile/permissions.js:46-62](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/mobile/permissions.js#L46-L62)

readonly/approve/full与缺省档。

<details>
<summary>查看原文（17行）</summary>

```text
/** 三档：配对时在电脑侧选定，展开成 permissions 数组存进凭据。 */
const TIERS = Object.freeze({
  readonly: [PERMISSIONS.VIEW, PERMISSIONS.FILES_READ],
  approve: [PERMISSIONS.VIEW, PERMISSIONS.FILES_READ, PERMISSIONS.APPROVE],
  full: ALL_PERMISSIONS.slice(),
});

const TIER_NAMES = Object.freeze(Object.keys(TIERS));
const DEFAULT_TIER = 'full';

function isKnownTier(tier) {
  return typeof tier === 'string' && Object.prototype.hasOwnProperty.call(TIERS, tier);
}

/** 档位 → 权限数组（未知 / 缺省一律回全权，向后兼容）。 */
function permissionsForTier(tier) {
  return isKnownTier(tier) ? TIERS[tier].slice() : TIERS.full.slice();
```

</details>

**依据 3 · 源码核查**：[lib/mobile/session-send.js:201-220](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/mobile/session-send.js#L201-L220)

接受回执需要独立正文核对。

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

**依据 4 · 源码核查**：[lib/index.js:223-239](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/index.js#L223-L239)

周期换代与开关不是同一行为。

<details>
<summary>查看原文（17行）</summary>

```text
  runtime
    .start(ctx, { log })
    .then(() => {
      log('info', 'dsh-mobile-plugin: 已装载 %s（来源 %s）', runtime.status().version, runtime.status().source)
      // 每 2 分钟让已落盘的正式版接管 OTA，并补上「盘上比运行中新」的那次换代（补换代不
      // 受开关管：它不下载任何东西）；自动安装由开关控制，开着就不等正在跑的对话。
      const timer = setInterval(() => {
        deviceOta.reconcileOfficial()
          .then(() => updater.reconcileInstalledGeneration({ runtime, log }))
          .then(() => updater.autoUpdateEnabled() ? applyUpdate({ auto: true }) : null)
          .catch(error => {
            updateState.lastError = String(error?.message || error)
            log('warn', 'dsh-mobile-plugin: 更新检查失败：%s', updateState.lastError)
          })
      }, updater.AUTO_INTERVAL_MS)
      if (typeof timer.unref === 'function') timer.unref()
      ctx.effect(() => () => clearInterval(timer), 'dsh-mobile-plugin: auto update timer')
```

</details>

**依据 5 · 源码核查**：[lib/routes/control-plane.js:1140-1159](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/routes/control-plane.js#L1140-L1159)

退出需分读本地/远端结果。

<details>
<summary>查看原文（20行）</summary>

```text
  registerRoute({ kind: 'exact', path: '/api/relay/revoke-all', handler: localOnly('POST', async (_req, res) => {
    const deviceIds = [...new Set((credentials.listDevices?.(state.instanceId) || []).map(device => device.deviceId).filter(Boolean))]
    // 清除所有授权 = 中转清空本实例全部设备授权 + 本机吊销局域网设备凭据 +
    // 轮换 lanSecret/配对码。三处都要做：只清中转的话，同网设备仍能用旧的
    // `dshc_` 凭据直连宿主，而移动端的「撤销全部授权」正是在要求它们全部失效。
    let revoked = 0
    try {
      const result = await getSidecar().request('/revoke-all', 'POST', undefined, 20_000)
      revoked = Number(result && result.revoked) || 0
    } catch { /* 中转不可达时仍继续吊销本机凭据与密钥 */ }
    const localRevoked = credentials.revokeAllByInstance(state.instanceId)
    state.lanSecret = randomBytes(32).toString('hex')
    // 恢复全部授权也要把二维码那枚票据一起换掉（`core.rotatePairing` 一次换码换票）：
    // 只换 pairingCode 的话，截图里那张旧二维码的票据仍能配出新设备。
    core.rotatePairing(state)
    core.saveState(state)
    await syncSidecar().catch(() => undefined)
    for (const deviceId of deviceIds) dropDeviceStreams(deviceId, res)
    dropAllDeviceStreams(res)
    sendJson(res, 200, { ok: true, revoked: revoked + localRevoked, revokedRelay: revoked, revokedLocal: localRevoked, ...status() })
```

</details>

#### 缺口

- 外层授权及端到端移动/撤销结果缺失。
  **影响**：只能observe，不提高为trial/install。
  **进一步探讨**：先固定部署与客户端，完成非敏感往返和撤销回读，记录权限、运行代与控制面拒绝结果。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 怎样验证送达回查与授权撤销形成可靠的恢复流程？

**研究主题**：新假设与验证

#### 完整回答

可以提出未验证假设：把请求接受、正文身份命中、当前授权和运行代四种事实分别呈现，并规定“未知不自动当未发生”，可能减少弱网换通道后的重复消息与错误恢复。当前组件已提供部分事实，尚不能据此证明手机端完整执行了该状态机。增加状态也会带来等待、手工核对和旧客户端兼容成本。

最小对照固定同一手机、宿主代、模型和测试会话，比较收到超时就新身份重投与复用原身份先回查。故障覆盖接受前断开、响应丢失但正文已写、200事件窗外、插件重启、设备撤销以及远端撤销暂不可达。用宿主原事件的消息身份/seq、重复/漏发数、权限撤销后访问结果及全部恢复时间验收。若减少重复仅靠漏发增加，或在换代/窗口外一律错误判定未送达，则不能推广；若额外核对时间抵消收益也应收窄。控制面边界必须先独立确认，不能用此消息实验代替部署鉴权检验。

#### 证据与依据

**依据 1 · 源码核查**：[lib/mobile/session-cache.js:395-414](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/mobile/session-cache.js#L395-L414)

内存成功缓存的边界。

<details>
<summary>查看原文（20行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/mobile/session-delivery.js:30-69](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/mobile/session-delivery.js#L30-L69)

正文身份窗口和缺会话状态。

<details>
<summary>查看原文（40行）</summary>

```text
/** 一次回查读多少条事件：发件箱的条目只可能出现在最近这几天。 */
const DELIVERY_HISTORY_WINDOW = 200;
/** 两个参数的长度上限（与 `clientMessageId` 的生成形状同一个量级）。 */
const PARAM_MAX = 200;

/**
 * GET /api/mobile/v1/session/delivery?sessionId=…&clientMessageId=…（token）
 * → { ok, delivered, seq? }
 *
 * 宿主没有这条会话（被删 / 换了机器）时回 404：那是「查不到」，不是「没送到」——
 * App 据此把发件箱里那条标成失败，而不是永远重试。
 */
async function handleSessionDelivery(ctx, req, res) {
  const url = new URL(req.url, 'http://x');
  const sessionId = (url.searchParams.get('sessionId') || '').trim();
  const clientMessageId = (url.searchParams.get('clientMessageId') || '').trim();
  if (!sessionId || !clientMessageId || sessionId.length > PARAM_MAX || clientMessageId.length > PARAM_MAX) {
    return sendJson(res, 400, { ok: false, error: { code: 'bad-request', message: '需要 { sessionId, clientMessageId }' } });
  }
  const signal = requestSignal(res);
  const { value, error } = unwrap(await callSessions(ctx, 'history', { sessionId, maxMessages: DELIVERY_HISTORY_WINDOW }, 'mobile', signal));
  if (signal.aborted) return;
  if (error) {
    const missing = error.code === 'session-not-found';
    return sendJson(res, missing ? 404 : 502, {
      ok: false,
      error: {
        code: typeof error.code === 'string' ? error.code : 'host-call-failed',
        message: typeof error.message === 'string' && error.message ? error.message : '读取会话历史失败',
      },
    });
  }
  const events = (value && Array.isArray(value.events)) ? value.events : [];
  const messages = deriveMessages(events);
  const hit = messages.find((message) => message.clientMessageId === clientMessageId);
  sendJson(res, 200, {
    ok: true,
    delivered: Boolean(hit),
    ...(hit && typeof hit.seq === 'number' ? { seq: hit.seq } : {}),
  });
```

</details>

**依据 3 · 源码核查**：[lib/index.js:187-208](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/index.js#L187-L208)

运行代与安装身份可查询。

<details>
<summary>查看原文（22行）</summary>

```text
  ctx.reflect.provide('dshMobilePluginRuntime', {
    status: () => ({
      ...runtime.status(),
      /** 盘上装着的版本（市场装完立刻变，和运行中的版本对照就能看出「要不要换」）。 */
      installedVersion: installedVersion(),
      runningShellHash,
      installedShellHash: installedShellHash(),
      shellChanged: (() => {
        const installed = installedShellHash()
        return installed !== null && runningShellHash !== null && installed !== runningShellHash
      })(),
      profileNodeModules: profileNodeModules(),
      autoUpdate: updater.autoUpdateEnabled(),
      autoIntervalMs: updater.AUTO_INTERVAL_MS,
      marketBase: base(),
      marketLastCheckedAt: updateState.lastCheckedAt,
      marketLastError: updateState.lastError,
      marketResult: updateState.result,
      lastApply: updateState.lastApply,
      appliedAt: updateState.appliedAt,
      /** 第一次装进一台正在跑的 DSH、还没重启过：手机端据此要求重启一次（见 shell/first-install.js）。 */
      firstInstallPendingRestart: firstInstallNeedsRestart(),
```

</details>

**依据 4 · 源码核查**：[lib/routes/control-plane.js:1140-1159](https://github.com/WNLUO/dsh-mobile-plugin/blob/d8febe5aef7ae36e1be2238952c94a4614e1c8ed/lib/routes/control-plane.js#L1140-L1159)

撤销的本地/远端分项。

<details>
<summary>查看原文（20行）</summary>

```text
  registerRoute({ kind: 'exact', path: '/api/relay/revoke-all', handler: localOnly('POST', async (_req, res) => {
    const deviceIds = [...new Set((credentials.listDevices?.(state.instanceId) || []).map(device => device.deviceId).filter(Boolean))]
    // 清除所有授权 = 中转清空本实例全部设备授权 + 本机吊销局域网设备凭据 +
    // 轮换 lanSecret/配对码。三处都要做：只清中转的话，同网设备仍能用旧的
    // `dshc_` 凭据直连宿主，而移动端的「撤销全部授权」正是在要求它们全部失效。
    let revoked = 0
    try {
      const result = await getSidecar().request('/revoke-all', 'POST', undefined, 20_000)
      revoked = Number(result && result.revoked) || 0
    } catch { /* 中转不可达时仍继续吊销本机凭据与密钥 */ }
    const localRevoked = credentials.revokeAllByInstance(state.instanceId)
    state.lanSecret = randomBytes(32).toString('hex')
    // 恢复全部授权也要把二维码那枚票据一起换掉（`core.rotatePairing` 一次换码换票）：
    // 只换 pairingCode 的话，截图里那张旧二维码的票据仍能配出新设备。
    core.rotatePairing(state)
    core.saveState(state)
    await syncSidecar().catch(() => undefined)
    for (const deviceId of deviceIds) dropDeviceStreams(deviceId, res)
    dropAllDeviceStreams(res)
    sendJson(res, 200, { ok: true, revoked: revoked + localRevoked, revokedRelay: revoked, revokedLocal: localRevoked, ...status() })
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
