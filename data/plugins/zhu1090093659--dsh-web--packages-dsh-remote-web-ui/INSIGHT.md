# DSH Remote Web UI

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[5d4bf78](https://github.com/zhu1090093659/dsh-web/tree/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui)

<!-- BEGIN META -->
[![GitHub ★ 10,524](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C524&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 96,751](https://img.shields.io/static/v1?label=npm+30d&message=96%2C751&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-remote-web-ui) [![最新发布 2026-11-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-remote-web-ui)
<!-- END META -->

> **功能**：为 DSH Web 界面提供扫码配对、设备会话管理及跨设备访问入口。

> **亮点**：[Q01](#research-q01) 与 [Q04](#research-q04) 识别的增量是复用宿主Web界面，把第二设备配对、设备身份和独立代理接到一个侧栏工作流。该代理在设备校验后附内层凭据，贡献同时意味着完整控制授权责任。

> **主要限制**：[Q02](#research-q02) 的发码token可重复兑换，单设备撤销不能作废链接；[Q06](#research-q06) 不能确认存活连接立即退出。匿名路由只改变宿主外层要求，仍需逐类自有围栏，不能等同公开业务数据。

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
  - [Q01 · 谁还应考虑这个退役独立包？](#detail-section-11)
  - [Q02 · token、grant与设备凭据是否可重复使用？](#detail-section-12)
  - [Q03 · auth anonymous后由谁保护配对控制与公开页面？](#detail-section-13)
  - [Q04 · HTTP与WebSocket怎样用设备凭据代理宿主权限？](#detail-section-14)
  - [Q05 · 新旧宿主内层认证和relay编码失败怎样呈现？](#detail-section-15)
  - [Q06 · 撤销、停用和退出能撤掉哪些状态？](#detail-section-16)
  - [Q07 · 哪个可证伪实验能决定旧部署是否继续保留？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：仍维护独立旧部署的管理员可在受控第二设备核对同一宿主会话及退出，合格结果包括凭据回收，不只是页面能打开。[Q01](#research-q01) 限定退役与分发未知。

原办法是受控宿主地址与原生登录，需自行管理网络和退出。此组件把设备交接放到侧栏；已迁移手机App与其分发可用性不在本项验收内。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 本地发码 | 给第二设备访问链接 | token在窗口内可重复兑换 |
| 设备管理 | 撤销、停止与状态查看 | 单设备撤销不作废未过期token |
| 页面接续 | grant/cookie进入同一Web界面 | 退役与宿主版本须核对 |
| 宿主HTTP代理 | 以设备凭据访问内层宿主 | 完整控制性质，部分本地前缀拒绝 |
| 流式连接代理 | 已知WS路径接入 | 握手校验不证明存活连接立即撤销 |
| 网络接入 | LAN及可选relay/隧道 | 外部服务、共享身份和费用需另核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH >=0.2.2-rc.3及host三个服务 | 必需 | 独立host与Web客户端挂载 | 无法据源码推定可加载 |
| 可达LAN或公共base | 发码必需 | 第二设备取得入口 | issue拒绝发不可达码 |
| 有效设备凭据和内层认证 | 宿主代理必需 | 授权与回环请求 | 403或内层401，不能把配对当登录完成 |
| 受控网络和本机管理退路 | 旧部署核查所需 | 回收与迁移 | 不适合继续扩大入口 |
| 隧道/relay及共享身份 | 公网模式所需 | 接入与传输 | 与替代包争用，需独立盘点 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 管理员记录旧包、宿主和网络绑定 | 本机受控路径可恢复 |
| 配对 | 本地发码，第二设备兑换并进入页面 | 区分token、grant、设备与内层认证 |
| 核对 | 使用只读测试会话 | 页面与请求结果可核对 |
| 退出 | 本地撤设备或stop并检查新旧连接 | 未确认关闭时停网络入口，勿直接重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 网络和部署资源，金额未知 | 核对版本、绑定及设备 | 配置与扫码耗时未测 |
| 持续 | 隧道/relay流量和服务费未知 | 管理凭据、设备和重连 | 退役维护和内层兼容未知 |
| 失败恢复 | 重连/重新部署资源未知 | 分层排查token、认证与宿主结果 | 不回滚已转发的业务写入 |
| 迁移退出 | 替代网络开销未知 | 关闭旧入口并核对共享relay | 新包须另行核查 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 第二设备交接 | 侧栏和设备配对接线 | 分发物与真实浏览器兼容 |
| 身份分层 | 设备gate先于内层宿主认证 | 全部宿主直达路径是否受约束 |
| 回收 | token/设备清理及新握手检查 | 存活连接立即退出 |
| 中继编码 | 请求identity的真实调用 | 手机端到端乱码与性能 |

> **思考**：[Q02](#research-q02) 的发码token可重复兑换，单设备撤销不能作废链接；[Q06](#research-q06) 不能确认存活连接立即退出。匿名路由只改变宿主外层要求，仍需逐类自有围栏，不能等同公开业务数据。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q04](#research-q04) 识别的增量是复用宿主Web界面，把第二设备配对、设备身份和独立代理接到一个侧栏工作流。该代理在设备校验后附内层凭据，贡献同时意味着完整控制授权责任。

[Q03](#research-q03) 的bootstrap与控制面分层、[Q05](#research-q05) 的内外认证缓存和编码归属值得借鉴。SDK失败不是全自动回退，代理权限放大要求设备gate先执行；迁移需重查宿主入口、日志凭据与连接生命周期。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的发码token可重复兑换，单设备撤销不能作废链接；[Q06](#research-q06) 不能确认存活连接立即退出。匿名路由只改变宿主外层要求，仍需逐类自有围栏，不能等同公开业务数据。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q06](#research-q06) 与 [Q07](#research-q07) 仅支持旧部署迁移观察。使用非关键设备和只读会话，明确回收结果后再退出；新部署优先核查当前受维护路线，不能把作者迁移指向当验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定独立源码仍有真实接线，作者同时宣布退役并保留过渡描述。已检查源码，未确认分发物、宿主运行与撤销传播；退出回执是待验证设计。

- 已检查：作者 README、包清单、源码路径 packages/dsh-remote-web-ui/package.json、packages/dsh-remote-web-ui/cordis.patch.yml、packages/dsh-remote-web-ui/README.md、packages/dsh-remote-web-ui/tsdown.config.ts、packages/dsh-remote-web-ui/src/index.ts、packages/dsh-remote-web-ui/src/client/index.ts、packages/dsh-remote-web-ui/src/pairing.ts、packages/dsh-remote-web-ui/src/gate.ts、packages/dsh-remote-web-ui/src/routes.ts、packages/dsh-remote-web-ui/src/remote-api.ts、packages/dsh-remote-web-ui/src/remote-methods.ts、packages/dsh-remote-web-ui/src/inner-auth.ts、packages/dsh-remote-web-ui/src/loopback-proxy.ts、packages/dsh-remote-web-ui/src/relay-bridge-connector.ts 及固定范围 inventory；组件：packages/dsh-remote-web-ui。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定0.4.19独立包，核对patch、client入口、配对状态、匿名route自有围栏、HTTP/WS代理、内层认证、新编码与停用。未展开全部公网注册器和替代包。
- 下一步：未执行目标插件、测试、安装或真实宿主。源码核查不等于撤销传播、公网服务与分发物可用性验证；实验应在既有部署隔离副本进行。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.19（[固定提交 5d4bf78](https://github.com/zhu1090093659/dsh-web/tree/5d4bf78e319393ac20d9f5acecc7a0e43f970bee)）
- **版本日期**：2026-11-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q07](#research-q07) 推导可核查的退出回执：分别列出token、设备、新握手和存活通道结果，比较能否减少临时授权回收的人工负担。若无法取得真实连接状态或核查成本不降，就否定推广。

未执行目标插件、测试、安装或真实宿主。源码核查不等于撤销传播、公网服务与分发物可用性验证；实验应在既有部署隔离副本进行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 494 | — | — | 21023 |
| .ts | source | 51 | 15643 | 9020 | 5760 | — |
| .tsx | source | 10 | 2567 | 1927 | 534 | — |
| .ts | test | 53 | 13361 | 10077 | 2740 | — |
| .tsx | test | 3 | 895 | 696 | 149 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 141](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=141&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-20T03%3A16%3A38.300Z..2026-11-19T03%3A16%3A38.300Z) [![近30天关闭 143](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=143&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-20T03%3A16%3A38.300Z..2026-11-19T03%3A16%3A38.300Z)



统计日期：2026-11-19。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：退役的独立Web远程组件在固定源码中怎样授权第二设备，并怎样界定匿名路由、内层认证和撤销？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁还应考虑这个退役独立包？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

本次对象是独立的 @linxin666/dsh-remote-web-ui 0.4.19，而不是已迁移的手机App桥接包。固定源码仍有真实host路由、Web客户端与侧栏配对入口；清单声明DSH >=0.2.2-rc.3，host需要webServer、typertGateway与connection。已有独立旧部署的管理员可以用受控第二设备检查同一宿主界面的接续和回收，不应将它作为新部署的默认远程入口。

相对直接开放宿主地址，组件增加侧栏发链接、设备会话和撤销的交接流程，复用官方页面而非重做一套业务界面。README同时写“独立安装过渡期仍能工作”和“不再提供远程访问能力”，并把浏览器远控列入退役范围；这与固定源码仍注册能力形成声明边界，不能擅自从一方推出当前发布物的可用性。作者还说明与替代包共享relay身份，不能同时启用两套relay。没有核验发布字节与真实部署，因此本次结论限定源码和旧部署迁移，不背书继续生产采用。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-remote-web-ui/README.md:5-9](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/README.md#L5-L9)

退役声明、独立过渡与共享relay警告有明确边界。

```text
> **Deprecation notice**: `@linxin666/dsh-remote-web-ui` is deprecated in favor of [@linxin666/dsh-remote-bridge](../dsh-remote-bridge/README.md). It has been retired from the `@linxin666/dsh-web-all` aggregate bundle (where legacy profile rows mount silently as no-ops via tombstone exports and the `retiredPlugins` registry) and will be removed in the next release. Standalone installation (`dsh plugin --profile <name> add @linxin666/dsh-remote-web-ui`) remains functional during this transitional period. Browser-based remote control has been replaced by the native phone app (@linxin666/dsh-remote-bridge), and this package no longer provides remote access capabilities.
>
> - **Capabilities migrated to `@linxin666/dsh-remote-bridge`**: Ingress stack (relay registry identity, lease control claim/release, quick and named tunnel connectors, Durable Object relay bridge connector, cloudflared lifecycle management and orphan process reaping, Cloudflare named tunnel ingress sync, LAN forwarder, host bind capability probe, and host firewall management).
> - **Capabilities retired with this package**: Browser-facing remote web control (pairing cookie gate, `/api/pair` endpoints, `/remote` proxy channel, and the mobile browser touch adaptation layer).
> - **Known coexistence risk**: if installed in the same profile alongside `@linxin666/dsh-remote-bridge`, do not enable relay on both plugins simultaneously (both share the same on-disk relay identity per profile; running both causes Durable Object connection contention, and mounting the bridge with `relay=false` withdraws the shared registration row and releases the lease).
```

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/package.json:45-60](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/package.json#L45-L60)

声明最低宿主要求、bundle patch、Web客户端与注入依赖。

<details>
<summary>查看原文（16行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.2.2-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-sidebar"
      ],
      "platform": "web"
    }
  },
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/cordis.patch.yml:8-10](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/cordis.patch.yml#L8-L10)

独立行真实挂载本包。

```text
- insert:
    - id: remote-web-ui
      name: '@linxin666/dsh-remote-web-ui'
```

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:87-87](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/index.ts#L87-L87)

宿主注入三个服务。

```text
export const inject = ['webServer', 'typertGateway', 'connection']
```

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/client/index.ts:280-299](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/client/index.ts#L280-L299)

侧栏入口按enabled实际注册和释放。

<details>
<summary>查看原文（20行）</summary>

```text
  // Sidebar foot entry: the sidebar foot seat is `sidebar.footer.action` in
  // the 0.1.2 shell composition (the legacy `sidebar.remote` seat is gone
  // upstream). The pairing link is origin-agnostic, so the entry needs no
  // workspace source.
  ctx.slots.inject('sidebar.footer.action', () => {
    let disposeEntry: (() => void) | undefined
    const syncEntry = (): void => {
      if (enabled() && disposeEntry === undefined) {
        try {
          disposeEntry = ctx.slots.register({ name: 'sidebar.footer.action', id: 'remote-web-ui', locale: NS }, FooterRemoteEntry)
        } catch {
          // ignore registration collision
        }
      } else if (!enabled() && disposeEntry !== undefined) {
        disposeEntry()
        disposeEntry = undefined
      }
    }
    const unsubscribe = settingsForm.subscribe(syncEntry)
    syncEntry()
```

</details>

#### 缺口

- 退役声明与分发物实际可用状态未核验
  **影响**：固定源码有接线不能证明npm包或现有宿主可运行
  **进一步探讨**：对已有部署先记录精确包和宿主版本，再在隔离副本确认入口与迁移路径。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · token、grant与设备凭据是否可重复使用？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

发码需要可达LAN地址或公共地址，新发一个token会清空旧token并退出stopped。token在过期前是可重复兑换的持有者凭据，accept不删除它；每次成功兑换生成新的设备ID，满额时按最早创建时间逐出设备。因此不能按README“一码一个设备”理解成一次性授权，也不能用撤销一个设备来作废仍有效的发码链接。

短时单次消费的是后续落地grant。app页面先consume grant，再检查该设备是否仍有效；没有有效grant时可以复用有效cookie重新打开，二者都无效会返回配对失败页面，不返回宿主页。stop清掉全部token和设备，revoke只删除指定设备，两者都持久化撤销并通知界面。设备ID本身承担凭据作用，展示名不改变授权；操作上应把发码链接和设备凭据按其真实有效期管理。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:457-482](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/pairing.ts#L457-L482)

可达性前提、新token替换旧token。

<details>
<summary>查看原文（26行）</summary>

```text
  issue(workspaceId?: string, address?: string): { token: string; expiresAt: number } {
    // The rule lives in the bases the caller registered, not in this message:
    // a non-loopback bind (the wildcard where the host still accepts it, a
    // concrete interface literal where it does not — see lanBasesOf in
    // index.ts) or a public base is what makes a QR reachable. The message
    // keeps the wildcard wording only as the operator's most familiar form.
    if (this.lanBases.size === 0 && this.publicBase === undefined) {
      throw new Error('remote-web-ui: pairing requires a reachable bind (--host 0.0.0.0 or publicBaseUrl)')
    }
    if (address !== undefined && !this.lanBases.has(address)) {
      throw new UnknownLanAddressError(address)
    }
    const now = this.clock.now()
    const token = this.clock.randomToken()
    this.tokens.clear()
    this.stopped = false
    this.tokenSerial += 1
    this.tokens.set(token, {
      id: `t${this.tokenSerial}`,
      issuedAt: now,
      expiresAt: now + this.config.tokenTtlMs,
      ...(workspaceId !== undefined ? { workspaceId } : {}),
      ...(address !== undefined ? { address } : {}),
    })
    this.notify()
    return { token, expiresAt: now + this.config.tokenTtlMs }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:485-523](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/pairing.ts#L485-L523)

重复兑换、设备ID与满额逐出。

<details>
<summary>查看原文（39行）</summary>

```text
  /**
   * Redeem a token and bind a device session. The token is a bearer
   * credential for its whole window, not a single-use nonce: it is refused
   * only when unknown, past its expiry, or after stop(), and every successful
   * call — including a repeat within the same window — mints a fresh device
   * session (see the module doc for the mobile cookie-context rationale).
   * @param token - the token secret from the QR link.
   * @param userAgent - optional User-Agent header captured at accept.
   * @returns the new device id, or a refusal code.
   */
  accept(token: string, userAgent?: string): AcceptResult {
    const record = this.tokens.get(token)
    if (record === undefined || this.stopped || this.clock.now() > record.expiresAt) {
      return { ok: false, code: 'invalid' }
    }
    const deviceId = this.clock.randomToken()
    const now = this.clock.now()
    // FIFO-evict until a slot is free. The loop (not a single delete) covers a
    // table that is already over the cap: restore keeps every persisted session
    // (see loadPersisted), so the excess is collected here, once the store is
    // actually asked to admit a new device, rather than at startup on a cap the
    // configuration may not have delivered yet.
    while (this.devices.size >= this.config.maxDevices) {
      let oldest: { id: string; createdAt: number } | undefined
      for (const [id, session] of this.devices) {
        if (oldest === undefined || session.createdAt < oldest.createdAt) oldest = { id, createdAt: session.createdAt }
      }
      if (oldest === undefined) break
      this.devices.delete(oldest.id)
    }
    const label = sanitizeUserAgent(userAgent)
    this.devices.set(deviceId, {
      createdAt: now,
      lastSeenAt: now,
      ...(label !== undefined ? { userAgent: label } : {}),
    })
    this.persist()
    this.notify()
    return { ok: true, deviceId }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:1187-1208](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/routes.ts#L1187-L1208)

grant单次消费与cookie回退。

<details>
<summary>查看原文（22行）</summary>

```text
    const url = new URL(req.url ?? '/', 'http://pair.invalid')
    // The one-time grant is spent before anything else: a replayed or expired
    // grant resolves to nothing (pair-grant.ts), so a leaked landing URL can
    // never be re-run. The cookie stays the primary credential for a reopen
    // (the service worker's network-first navigation carries it).
    const grantedDevice = grants.consume(url.searchParams.get('grant') ?? undefined)
    const cookieDevice = readCookie(req.headers.cookie, service.config.cookieName)
    const id = (grantedDevice !== undefined && service.touchDevice(grantedDevice))
      ? grantedDevice
      : (cookieDevice !== undefined && service.touchDevice(cookieDevice))
        ? cookieDevice
        : undefined
    if (id === undefined) {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' })
      res.end(pairingFailurePage())
      return
    }
    const html = await deps.indexDocument?.(id).catch(() => undefined)
    if (html === undefined) {
      res.writeHead(502, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' })
      res.end('remote device app unavailable')
      return
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:526-550](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/pairing.ts#L526-L550)

全部停止与单设备撤销的不同状态变化。

<details>
<summary>查看原文（25行）</summary>

```text
  /**
   * Stop remote control: revoke every device session and clear the token.
   * The phone's next gated /api request 403s; the panel falls back to
   * stopped until a fresh QR is issued.
   */
  stop(): void {
    this.tokens.clear()
    this.devices.clear()
    this.persistRevocation()
    this.stopped = true
    this.notify()
  }

  /**
   * Revoke one paired device. The next gated request from that cookie is
   * refused; other sessions stay live. Unknown ids are a no-op.
   * @param deviceId - the cookie value of the device to drop.
   * @returns true when a live session was removed.
   */
  revoke(deviceId: string): boolean {
    if (this.stopped) return false
    if (!this.devices.delete(deviceId)) return false
    this.persistRevocation()
    this.notify()
    return true
```

</details>

**依据 5 · 作者声明**：[packages/dsh-remote-web-ui/README.md:82-85](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/README.md#L82-L85)

作者用法的一码一设备与源码应区分。

```text
2. Start `dsh web`, click the phone icon, and the panel mints a fresh time-limited QR.
3. Scan with the phone (or open the copied link): the device pairs and boots the **official Web GUI** served cookieless by the plugin (`/pair-accept` → `/pair-app`), which reloads into `/`. When the link names the public base, the landing page also probes the advertised LAN origins (one short no-cors request to `/pair-ping` per candidate) and moves the phone to the first one that answers, remembering the decision for the session: the public page it was served from stays usable throughout, so the probe never blocks pairing, and a phone that is not on that network simply stays where it is. On a phone, the portrait adaptation layer is already active — same layout as the desktop, same live state. Later reopens from history or a bookmark go straight back into the app (https origins; see Security model).
4. **To pair a PC instead**: copy the same link and open it in a browser on the other computer. After the same round trip the full Web GUI runs there over the gated `/remote` channel; unpaired PCs see the guided blocking page and no data. One active token pairs one device; mint a fresh QR for the next device.
5. The desktop badge flips to 已连接 in real time; the device roster lists the paired devices with per-device 取消配对, and 停止 revokes everything.
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · auth anonymous后由谁保护配对控制与公开页面？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

makeRoutes对配对和手机页面统一标为auth: anonymous，表示不要求宿主桌面登录；实际权限由每类handler自己决定，并非都匿名提供宿主数据。发码、stop、revoke、事件流及LAN绑定使用loopbackFence，它同时要求socket/Host为回环、没有转发标记，并满足浏览器来源检查。可识别反向代理不应被当桌面控制入口；如果部署主动抹掉这些标记，则不能依赖该判断补偿代理配置。

accept允许可达手机来源，先作LAN/Host判断和限流，再校验有效token才生成设备；app页先检查Host围栏，只有有效grant或设备cookie才取宿主HTML。status对未配对访问只返回phase和LAN可达布尔，不返回设备表；设备凭据表只从本地事件流给出。ping只提供204可达信号，service-worker是无数据脚本，在手机来源围栏后不要求设备凭据。把这两类公开引导资源说成“设备cookie保护的业务接口”同样不准确。匿名元数据让手机能到达bootstrap，不消除handler的独立授权责任。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:735-750](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/routes.ts#L735-L750)

本地控制围栏与手机来源围栏不同。

<details>
<summary>查看原文（16行）</summary>

```text
   * route that mints, stops or streams a credential. A direct desktop request
   * (loopback socket, loopback Host, NO forwarding header) passes; a request a
   * reverse proxy forwarded does not, even though the reachability fence below
   * now accepts the rewritten loopback upstream it presents (issue #1906 stays
   * shut for the control plane while #1919 opens the phone-facing surface).
   */
  const loopbackFence = (req: IncomingMessage): boolean => isLoopbackClient(req) && isTrustedApiRequest(req, [])
  /**
   * Phone-facing fence: loopback, the service's live LAN literals, configured
   * public host, extra trusted hosts, or dynamically paired hosts. `navigation`
   * relaxes the browser-marker checks for a top-level document navigation (the
   * pairing entry pages), never for an API or subresource request.
   */
  const lanFence = (req: IncomingMessage, navigation = false): boolean => {
    const combined = servedAuthorities()
    if (navigation && isTopLevelDocumentNavigation(req) ? isTrustedHost(req, combined) : isTrustedApiRequest(req, combined)) return true
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/gate.ts:74-98](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/gate.ts#L74-L98)

回环上游与真正桌面请求区分，转发标记影响信任。

<details>
<summary>查看原文（25行）</summary>

```text
export function isLoopbackUpstream(request: IncomingMessage): boolean {
  const hostname = hostnameOf(request)
  if (hostname === undefined || !isLoopbackHostname(hostname)) return false
  const socket = request.socket as { remoteAddress?: string } | undefined
  return isLoopbackAddress(socket?.remoteAddress)
}

/**
 * Whether a request comes from the desktop loopback client: a loopback upstream
 * ({@link isLoopbackUpstream}) reached with no forwarding header. This is the
 * same decision the shared copy makes in `isLoopbackRequest` (sans the browser
 * same-origin markers, which the /api/pair routes apply separately through
 * `isTrustedApiRequest`), and it carries the same proxy rule: a reverse proxy
 * rewrites the Host to its own 127.0.0.1:<port> upstream and connects over
 * loopback, so a request that arrives with CF-Connecting-IP or X-Forwarded-For
 * is a forwarded one and is never the desktop (issue #1906). Every decision
 * that grants the desktop payload or a control plane (the api/gate listener,
 * the events stream, /api/pair/issue, /api/pair/stop, /api/pair/revoke,
 * /api/pair/lan-bind) reads this predicate, so the rule holds for all of them.
 * @param request - node HTTP request.
 * @returns true for a local desktop request with no proxy in front of it.
 */
export function isLoopbackClient(request: IncomingMessage): boolean {
  if (isProxiedRequest(request)) return false
  return isLoopbackUpstream(request)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:901-937](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/routes.ts#L901-L937)

accept限流、token校验后才发cookie。

<details>
<summary>查看原文（37行）</summary>

```text
  const handleAccept = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (!requireMethod(req, res, 'POST')) return
    const privateLanHost = privateLanHostOf(req)
    if (!lanFence(req) && privateLanHost === undefined) {
      writeJson(res, 403, { ok: false, code: 'forbidden' })
      return
    }
    if (rateLimitAccept(req, 'api')) {
      writeJson(res, 429, { ok: false, code: 'rate-limited' })
      return
    }
    const body = await readJsonBody(req, { maxBytes: MAX_BODY_BYTES, objectOnly: true })
    const payload = parsePairPayload(acceptPayloadSchema, body)
    if (payload === undefined) {
      writeJson(res, 400, { ok: false, code: 'bad-payload' })
      return
    }
    const ua = req.headers['user-agent']
    const result = service.accept(payload.token, typeof ua === 'string' ? ua : undefined)
    if (!result.ok) {
      if (!lanFence(req)) {
        writeJson(res, 403, { ok: false, code: 'forbidden' })
        return
      }
      writeJson(res, 404, { ok: false, code: result.code })
      return
    }
    if (privateLanHost !== undefined) {
      addBounded(dynamicTrustedHosts, privateLanHost, MAX_DYNAMIC_TRUSTED_HOSTS)
    }
    // The Secure attribute follows the transport (deviceCookie): off on
    // plain-HTTP LAN, where a Secure cookie is dropped by the browser, and on
    // for a tunneled request the edge stamped as https. Lax keeps top-level
    // navigations working while blocking cross-site subrequests.
    writeJson(res, 200, { ok: true, deviceId: result.deviceId }, {
      'set-cookie': [deviceCookie(req, service.config.cookieName, result.deviceId)],
    })
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:1044-1081](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/routes.ts#L1044-L1081)

未配对status最小响应，事件流需本地围栏。

<details>
<summary>查看原文（38行）</summary>

```text
  const handleStatus = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (!requireMethod(req, res, 'GET')) return
    if (!lanFence(req)) {
      writeJson(res, 403, { ok: false, code: 'forbidden' })
      return
    }
    const deviceId = readCookie(req.headers.cookie, service.config.cookieName)
    const paired = deviceId !== undefined && service.hasDevice(deviceId)
    // The desktop (loopback, no forwarding header) keeps the full
    // pairing-relevant view; the LAN IP literals stay behind a live pairing or
    // that desktop view so an unauthenticated caller on a tunnel cannot map the
    // internal network. A phone already knows its usable literal from the URL
    // it opened. A tunneled visitor reaches this handler now (#1919) and lands
    // on the minimal branch: reachability for the pairing flow, the snapshot
    // only for the desktop or a live device.
    const local = isLoopbackClient(req)
    const snapshot = service.snapshot()
    // Unpaired LAN/tunnel clients get only the pairing-relevant fields; the
    // token expiry, public tunnel URL, and counts are an oracle for targeting
    // and stay behind a live device cookie. The per-device roster (ids are
    // session credentials) is never returned here — only the loopback events
    // stream carries it to the desktop panel.
    const { devices: _devices, ...rest } = snapshot
    const visible = paired || local
      ? rest
      : { phase: snapshot.phase, lanAvailable: snapshot.lanAvailable }
    writeJson(res, 200, { ok: true, paired, requirePairingForLan: pairingRequired(), ...visible })
  }

  const handleEvents = (req: IncomingMessage, res: ServerResponse): void => {
    if (!requireMethod(req, res, 'GET')) return
    if (!loopbackFence(req)) {
      writeJson(res, 403, { ok: false, code: 'forbidden' })
      return
    }
    events.open(req, res)
    // Snapshot on open: a late-opening panel converges without history.
    events.push(service.snapshot())
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:1174-1208](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/routes.ts#L1174-L1208)

宿主HTML需有效grant或cookie。

<details>
<summary>查看原文（35行）</summary>

```text
  const handleAppPage = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (!requireMethod(req, res, 'GET')) return
    if (!lanFence(req, true)) {
      logEntryRefusal(req, PAIR_PATHS.appPage, 'untrusted-host')
      res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' })
      res.end('forbidden')
      return
    }
    if (rateLimitAccept(req, 'page')) {
      res.writeHead(429, { 'content-type': 'text/plain; charset=utf-8' })
      res.end('rate limited')
      return
    }
    const url = new URL(req.url ?? '/', 'http://pair.invalid')
    // The one-time grant is spent before anything else: a replayed or expired
    // grant resolves to nothing (pair-grant.ts), so a leaked landing URL can
    // never be re-run. The cookie stays the primary credential for a reopen
    // (the service worker's network-first navigation carries it).
    const grantedDevice = grants.consume(url.searchParams.get('grant') ?? undefined)
    const cookieDevice = readCookie(req.headers.cookie, service.config.cookieName)
    const id = (grantedDevice !== undefined && service.touchDevice(grantedDevice))
      ? grantedDevice
      : (cookieDevice !== undefined && service.touchDevice(cookieDevice))
        ? cookieDevice
        : undefined
    if (id === undefined) {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' })
      res.end(pairingFailurePage())
      return
    }
    const html = await deps.indexDocument?.(id).catch(() => undefined)
    if (html === undefined) {
      res.writeHead(502, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' })
      res.end('remote device app unavailable')
      return
```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:1251-1283](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/routes.ts#L1251-L1283)

ping与service-worker是刻意可达的非业务资源。

<details>
<summary>查看原文（33行）</summary>

```text
  const handlePing = (req: IncomingMessage, res: ServerResponse): void => {
    if (!requireMethod(req, res, 'GET')) return
    if (!isTrustedHost(req, servedAuthorities())) {
      res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' })
      res.end()
      return
    }
    res.writeHead(204, { 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' })
    res.end()
  }

  /**
   * The reopen service worker script. Same phone-facing fence as the app
   * page but no rate limit and no device check: the script is inert logic
   * (no secrets, no data), and browsers re-fetch it on navigations for
   * update checks, which must not trip a brute-force budget. no-store keeps
   * the update check meaningful across deploys.
   */
  const handleAppServiceWorker = (req: IncomingMessage, res: ServerResponse): void => {
    if (!requireMethod(req, res, 'GET')) return
    if (!lanFence(req, true)) {
      res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' })
      res.end('forbidden')
      return
    }
    res.writeHead(200, {
      'content-type': 'text/javascript; charset=utf-8',
      'cache-control': 'no-store',
      // Defensive: the root-level script path already allows a `/` scope,
      // the header keeps that explicit for engines that want it stated.
      'service-worker-allowed': '/',
    })
    res.end(appServiceWorkerScript())
```

</details>

**依据 7 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:1286-1314](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/routes.ts#L1286-L1314)

所有配对路由统一auth anonymous。

<details>
<summary>查看原文（29行）</summary>

```text
  const routes: WebRoute[] = [
    { kind: 'exact', path: PAIR_PATHS.issue, handler: handleIssue },
    { kind: 'exact', path: PAIR_PATHS.accept, handler: handleAccept },
    { kind: 'exact', path: PAIR_PATHS.stop, handler: handleStop },
    { kind: 'exact', path: PAIR_PATHS.revoke, handler: handleRevoke },
    { kind: 'exact', path: PAIR_PATHS.rename, handler: handleRename },
    { kind: 'exact', path: PAIR_PATHS.merge, handler: handleMerge },
    { kind: 'exact', path: PAIR_PATHS.heartbeat, handler: handleHeartbeat },
    { kind: 'exact', path: PAIR_PATHS.status, handler: handleStatus },
    { kind: 'exact', path: PAIR_PATHS.events, handler: handleEvents },
  ]
  if (deps.lanBindStatus !== undefined) {
    routes.push({ kind: 'exact', path: PAIR_PATHS.lanBind, handler: handleLanBind })
  }
  routes.push({ kind: 'exact', path: PAIR_PATHS.acceptPage, handler: handleAcceptPage })
  // The beacon is independent of the app landing: a deployment with no
  // indexDocument still advertises LAN bases, and a landing served some other
  // way may still probe them.
  routes.push({ kind: 'exact', path: PAIR_PATHS.ping, handler: handlePing })
  if (deps.indexDocument !== undefined) {
    routes.push({ kind: 'exact', path: PAIR_PATHS.appPage, handler: handleAppPage })
    // The reopen worker is only meaningful when the app landing it
    // re-serves exists (same condition as /pair-app).
    routes.push({ kind: 'exact', path: PAIR_PATHS.appServiceWorker, handler: handleAppServiceWorker })
  }
  // All pairing and phone-UI routes enforce their own loopback, device-cookie,
  // or bootstrap-token fence and must remain reachable without desktop browser login.
  type AuthAwareRoute = (typeof routes)[number] & { readonly auth?: 'anonymous' | 'required' | 'deny' }
  return routes.map((route): AuthAwareRoute => ({ ...route, auth: 'anonymous' }))
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · HTTP与WebSocket怎样用设备凭据代理宿主权限？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

HTTP的/remote前缀虽然标为auth: anonymous，但handler首先检查cookie或专用header所带设备ID并touchDevice；失败直接403，在读入和转发正文之前退出。之后限制方法、规范化路径、拒绝本机控制前缀，端口未绑定时503，成功才代理到127.0.0.1。独立通道始终要求设备凭据，不跟随requirePairingForLan放宽。该凭据会换成进程自己的内层宿主认证，因此相当于完整宿主控制，不是只读会话分享。

WebSocket只注册已列出的精确upgrade路径，cookie/header不足时再用查询device校验，失败403并销毁socket；有效时剥掉内层查询中的设备凭据，再检查本地禁止路径和绑定端口，等待内层cookie后建立代理。/api/pair、/api/update、/api/plugin-manager被前缀拒绝，但其他设置、凭据及普通宿主API可通过，不能将“部分本地控制面”扩大成所有配置都不可远程操作。

loopback代理剥离外来Origin、cookie、转发和设备头，改写Host和同源标记，再附进程内层cookie。普通api/gate监听器只保护会实际发出该事件的调用方；仅注册监听不能证明当前宿主所有/api及其他插件前缀都经过它。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:132-200](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/remote-api.ts#L132-L200)

HTTP设备校验、路径、禁止前缀、端口和匿名元数据。

<details>
<summary>查看原文（69行）</summary>

```text
export function pairedDeviceIdOf(req: IncomingMessage, service: PairingService): string | undefined {
  const cookieDevice = readCookie(req.headers.cookie, service.config.cookieName)
  const headerDevice = typeof req.headers[REMOTE_DEVICE_HEADER] === 'string'
    ? (req.headers[REMOTE_DEVICE_HEADER] as string)
    : undefined
  const id = cookieDevice ?? headerDevice
  if (id === undefined) return undefined
  return service.touchDevice(id) ? id : undefined
}

/**
 * Build the remote desktop channel HTTP routes.
 * @param deps - pairing service + local port + inner credential.
 * @returns the routes to register on webServer.
 */
export function makeRemoteApiRoutes(deps: RemoteApiDeps): WebRoute[] {
  const { service } = deps

  const handler = (req: IncomingMessage, res: ServerResponse): void => {
    // Paired credential first — before any bytes are buffered or forwarded.
    // Unconditional by design: this channel attaches the process's own
    // browser-auth cookie to every re-issued call, so admitting an unpaired
    // caller would hand out that credential's authority (issue #1665).
    const paired = pairedDeviceIdOf(req, service)
    if (paired === undefined) {
      req.resume()
      envelopeError(res, 403, 'invalid-request', 'unpaired', 'this device is not paired with the desktop')
      return
    }

    const method = req.method ?? 'GET'
    if (!ALLOWED_METHODS.has(method)) {
      req.resume()
      res.writeHead(405).end()
      return
    }

    const url = new URL(req.url ?? '/', 'http://127.0.0.1')
    const inner = innerPathOf(url.pathname)
    if (inner === undefined) {
      req.resume()
      res.writeHead(404).end()
      return
    }
    const denied = loopbackOnlyDenial(inner)
    if (denied !== undefined) {
      req.resume()
      envelopeError(res, 403, 'invalid-request', 'forbidden', denied)
      return
    }

    const port = deps.port()
    if (port === undefined) {
      // The listener has not bound yet (a recompose pass): refuse instead of
      // minting an http://127.0.0.1:undefined target; the desktop retries.
      req.resume()
      envelopeError(res, 503, 'invalid-request', 'port-unbound', 'the local web server port is not bound yet; retry shortly')
      return
    }
    proxyLoopbackHttp(req, res, port, `${inner}${url.search}`, deps.auth)
  }

  const route: {
    readonly kind: 'prefix'
    readonly path: string
    readonly auth: 'anonymous'
    readonly handler: typeof handler
  } = { kind: 'prefix', path: REMOTE_PREFIX, auth: 'anonymous', handler }
  return [route]
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:238-287](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/remote-api.ts#L238-L287)

upgrade独立认证、端口拒绝与内层代理。

<details>
<summary>查看原文（50行）</summary>

```text
export function makeRemoteApiUpgradeRoutes(deps: RemoteApiDeps): WebUpgradeRoute[] {
  const { service } = deps

  const handlerFor = (fallbackPath: string) => (req: IncomingMessage, socket: Duplex, head: Buffer): void => {
    // WebSocket handshakes cannot carry headers from the Web API, so the
    // cookieless credential rides the query; the cookie stays the primary.
    // The gate is unconditional here too (issue #1665).
    let queryDevice: string | undefined
    try {
      queryDevice = new URL(req.url ?? '/', 'http://127.0.0.1').searchParams.get(REMOTE_DEVICE_QUERY) ?? undefined
    } catch { /* fall through to the cookie */ }
    const deviceId = pairedDeviceIdOf(req, service)
    const paired = deviceId ?? (queryDevice !== undefined && service.touchDevice(queryDevice) ? queryDevice : undefined)
    if (paired === undefined) {
      socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n')
      socket.destroy()
      return
    }
    const port = deps.port()
    if (port === undefined) {
      // Same unbound-port refusal as the HTTP leg: no :undefined handshake.
      socket.write('HTTP/1.1 503 Service Unavailable\r\nConnection: close\r\n\r\n')
      socket.destroy()
      return
    }
    const inner = upgradeInnerPath(req.url, fallbackPath)
    const denied = loopbackOnlyDenial(inner.split('?')[0] ?? inner)
    if (denied !== undefined) {
      socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n')
      socket.destroy()
      return
    }
    // The inner handshake needs the browser-auth credential (the gateway
    // event-stream route enforces it); resolving it is async, so the
    // handshake bytes are written once it settles. A missing credential
    // proceeds as before — the gateway route then refuses.
    void Promise.resolve(deps.auth?.ready())
      .catch(() => undefined)
      .then((cookie) => {
        if (socket.destroyed) return
        proxyLoopbackUpgrade(req, socket, head, port, inner, typeof cookie === 'string' ? cookie : undefined)
      })
  }

  type AuthAwareUpgradeRoute = WebUpgradeRoute & { readonly auth?: 'anonymous' | 'required' | 'deny' }
  return REMOTE_UPGRADE_PATHS.map((path): AuthAwareUpgradeRoute => ({
    path,
    auth: 'anonymous',
    handler: handlerFor(path.slice(REMOTE_PREFIX.length)),
  }))
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:218-230](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/remote-api.ts#L218-L230)

剥离查询设备凭据。

<details>
<summary>查看原文（13行）</summary>

```text
export function upgradeInnerPath(reqUrl: string | undefined, fallbackPath: string): string {
  if (reqUrl === undefined || reqUrl === '') return fallbackPath
  let url: URL
  try {
    url = new URL(reqUrl, 'http://127.0.0.1')
  } catch {
    return fallbackPath
  }
  const inner = innerPathOf(url.pathname)
  if (inner === undefined) return fallbackPath
  url.searchParams.delete(REMOTE_DEVICE_QUERY)
  return `${inner}${url.search}`
}
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-methods.ts:60-89](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/remote-methods.ts#L60-L89)

实际本地禁止前缀只有列出的控制面。

<details>
<summary>查看原文（30行）</summary>

```text
 */
export const REMOTE_DEVICE_HEADER = 'x-dsh-remote-device'
export const REMOTE_DEVICE_QUERY = 'device'

/**
 * Path prefixes that stay physically local even for a paired device. A
 * paired remote desktop may use the full host API (chat, sessions,
 * settings, credentials, presets — it is a full-control credential), but it
 * must not reach the machine-control planes: pairing control itself, the
 * dsh-web self-update installer, and plugin install/remove.
 */
export const LOCAL_ONLY_PREFIXES: readonly string[] = [
  '/api/pair',
  '/api/update',
  PLUGIN_MANAGER_PATH,
] as const

/**
 * Whether a paired inner path must stay physically local.
 * @param innerPath - the rewritten inner path (e.g. `/api/session.list`).
 * @returns a denial message, or undefined when the path may be proxied.
 */
export function localOnlyDenial(innerPath: string): string | undefined {
  for (const prefix of LOCAL_ONLY_PREFIXES) {
    if (innerPath === prefix || innerPath.startsWith(`${prefix}/`)) {
      return `${prefix.slice(1)} stays physically local and stays unreachable from a paired remote desktop`
    }
  }
  return undefined
}
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/loopback-proxy.ts:115-131](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/loopback-proxy.ts#L115-L131)

内层请求改写Host与认证。

<details>
<summary>查看原文（17行）</summary>

```text
function forwardedRequestHeaders(req: IncomingMessage, port: number, cookie: string | undefined): Record<string, string> {
  const nominated = nominatedHeaders(req.headers.connection)
  const headers: Record<string, string> = {}
  for (let index = 0; index + 1 < req.rawHeaders.length; index += 2) {
    const name = req.rawHeaders[index].toLowerCase()
    if (REQUEST_HEADER_DENYLIST.has(name) || nominated.has(name)) continue
    if (REQUEST_HEADER_DENY_PREFIXES.some(prefix => name.startsWith(prefix))) continue
    const value = req.rawHeaders[index + 1]
    const previous = headers[name]
    // Repeated headers reach the upstream as one comma-joined value, the same
    // way node folds duplicates on the receiving side.
    headers[name] = previous === undefined ? value : `${previous}, ${value}`
  }
  headers.host = `127.0.0.1:${String(port)}`
  headers['sec-fetch-site'] = 'same-origin'
  if (cookie !== undefined) headers.cookie = cookie
  return headers
```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/gate.ts:115-131](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/gate.ts#L115-L131)

普通api/gate的LAN开关与禁用判断。

<details>
<summary>查看原文（17行）</summary>

```text
export function makeGateListener(
  service: PairingService,
  requirePairingForLan: boolean | (() => boolean) = true,
  enabled: boolean | (() => boolean) = true,
): (request: IncomingMessage, method: string | undefined, next: () => boolean | Promise<boolean>) => boolean | Promise<boolean> {
  return (request, _method, next) => {
    // Loopback clients (desktop at 127.0.0.1) always pass without cookie check.
    if (isLoopbackClient(request)) return next()
    const active = typeof enabled === 'function' ? enabled() : enabled
    if (!active) return false
    const require = typeof requirePairingForLan === 'function' ? requirePairingForLan() : requirePairingForLan
    // When pairing is not required for LAN, non-loopback requests pass too.
    if (!require) return next()
    // Non-loopback origin: verify paired-device cookie. Sibling plugins that
    // own their own prefixes (/pet, /git, /sidebar, …) consult the same cookie
    // through the remoteWebUiPairing service — this listener only covers /api.
    return isPairedDeviceRequest(service, request) ? next() : false
```

</details>

#### 缺口

- 宿主是否对全部普通/api路径发出api/gate未作跨包核验
  **影响**：不能声称设备撤销能约束所有原生或第三方直达入口
  **进一步探讨**：在实际固定宿主的路由注册与调用链中定位事件发出点，分别检查直达与/remote请求。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 新旧宿主内层认证和relay编码失败怎样呈现？

**研究主题**：工程质量与复用、依赖、兼容与流程

#### 完整回答

内层认证先通过resolveLaunchTokenUrl找进程可用的启动认证URL。旧connection.authenticatedUrl存在时直接调用，若它抛错立即返回undefined，不继续尝试entry-url；只有旧方法不存在时才从webServer/entry-url事件取得候选，优先open=true，再取任一非空URL。不能把它描述成旧接口失败自动跨SDK回退。

createInnerAuth只跟随手动重定向读取dsh-auth-前缀cookie，缓存成功值并合并并发兑换；无URL、无cookie或请求失败返回undefined。HTTP代理仍把当前请求发向内层，内层认证拒绝会原样返回；遇带cookie的401会失效缓存，但不会在当前请求里自动重放。因此配对成功与内层宿主授权成功是两步，重复用户动作前要辨别失败在哪一步。

relay桥接的另一个真实改动是每次发上游HTTP或WS请求都调用bridgeUpstreamHeaders，丢弃手机accept-encoding及逐跳头，主动请求identity，避免把手机到边缘的压缩能力错误用于回环这一跳。它控制请求协商，没有在本次证明上游一定遵从或边缘网络没有其他编码问题，不能把源码修复写成真实手机乱码已复现并解决。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:1508-1534](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/index.ts#L1508-L1534)

旧认证方法与entry-url分支及throw行为。

<details>
<summary>查看原文（27行）</summary>

```text
/**
 * Resolve a launch-token authenticated DSH URL for `baseUrl` across SDK cohorts:
 * legacy hosts expose `connection.authenticatedUrl(baseUrl)`, while peer-auth
 * hosts collect entry URLs via `ctx.emit(webServer, 'webserver/entry-url', baseUrl, entries)`.
 */
export function resolveLaunchTokenUrl(ctx: LaunchTokenContext, baseUrl: string): string | undefined {
  const connection = readLegacyLaunchConnection(ctx)
  if (connection !== undefined && typeof connection.authenticatedUrl === 'function') {
    try {
      return connection.authenticatedUrl(baseUrl)
    } catch {
      return undefined
    }
  }
  const webServer = readEntryUrlWebServer(ctx)
  if (webServer === undefined || typeof ctx.emit !== 'function') return undefined
  const entries: EntryUrlCandidate[] = []
  try {
    ctx.emit(webServer, 'webserver/entry-url', baseUrl, entries)
  } catch {
    return undefined
  }
  const preferred = entries.find((entry) => entry.open === true && typeof entry.url === 'string' && entry.url.length > 0)
  if (preferred?.url !== undefined) return preferred.url
  const fallback = entries.find((entry) => typeof entry.url === 'string' && entry.url.length > 0)
  return fallback?.url
}
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/inner-auth.ts:37-65](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/inner-auth.ts#L37-L65)

手动兑换并提取内层cookie。

<details>
<summary>查看原文（29行）</summary>

```text
export function createInnerAuth(
  launchUrl: () => string | undefined,
  fetchImpl: typeof fetch = fetch,
): InnerAuth {
  let cached: string | undefined
  let inflight: Promise<string | undefined> | undefined

  const redeem = async (): Promise<string | undefined> => {
    const url = launchUrl()
    if (url === undefined) return undefined
    try {
      // redirect: 'manual' keeps the 303's set-cookie readable instead of
      // following it; the exchange itself is a plain GET with the token in
      // the query, exactly what a first browser visit performs.
      const response = await fetchImpl(url, { redirect: 'manual' })
      const raw = response.headers.get('set-cookie')
      if (raw === null) return undefined
      // Generated cookie values are base64url and never contain commas, so a
      // comma split followed by a prefix match finds the browser-auth entry
      // even when the exchange sets several cookies.
      const entry = raw
        .split(',')
        .map((part) => part.trim())
        .find((part) => part.startsWith(BROWSER_AUTH_COOKIE_PREFIX))
      if (entry === undefined) return undefined
      const pair = entry.split(';')[0]?.trim()
      return pair !== undefined && pair.includes('=') ? pair : undefined
    } catch {
      return undefined
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/inner-auth.ts:69-84](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/inner-auth.ts#L69-L84)

缓存、inflight及失效。

<details>
<summary>查看原文（16行）</summary>

```text
  return {
    ready(): Promise<string | undefined> {
      if (cached !== undefined) return Promise.resolve(cached)
      inflight ??= redeem().then((value) => {
        if (value !== undefined) cached = value
        inflight = undefined
        return value
      }, () => {
        inflight = undefined
        return undefined
      })
      return inflight
    },
    invalidate(): void {
      cached = undefined
    },
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/loopback-proxy.ts:158-194](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/loopback-proxy.ts#L158-L194)

内层认证未知仍代理，401失效不自动重放。

<details>
<summary>查看原文（37行）</summary>

```text
  port: number,
  upstreamPath: string,
  auth?: InnerAuth,
): void {
  void Promise.resolve(auth?.ready())
    .catch(() => undefined)
    .then((cookie) => { pipeLoopbackHttp(req, res, port, upstreamPath, auth, typeof cookie === 'string' ? cookie : undefined) })
}

function pipeLoopbackHttp(
  req: IncomingMessage,
  res: ServerResponse,
  port: number,
  upstreamPath: string,
  auth: InnerAuth | undefined,
  cookie: string | undefined,
): void {
  const headers = forwardedRequestHeaders(req, port, cookie)

  const upstream = httpRequest({
    host: '127.0.0.1',
    port,
    path: upstreamPath,
    method: req.method,
    headers,
  }, (upstreamRes) => {
    // The cached credential went stale (secret rotation, credential store
    // reset): drop it so the next request re-redeems. The in-flight response
    // still pipes through untouched.
    if (upstreamRes.statusCode === 401 && cookie !== undefined) auth?.invalidate()
    const out: OutgoingHttpHeaders = {}
    for (const name of HTTP_FORWARD_RESPONSE_HEADERS) {
      const value = upstreamRes.headers[name]
      if (value !== undefined) out[name] = value
    }
    res.writeHead(upstreamRes.statusCode ?? 502, out)
    upstreamRes.pipe(res)
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/relay-bridge-connector.ts:123-132](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/relay-bridge-connector.ts#L123-L132)

丢弃外来编码并选择identity。

<details>
<summary>查看原文（10行）</summary>

```text
export function bridgeUpstreamHeaders(frameHeaders: unknown, host: string): Record<string, string> {
  const headers: Record<string, string> = {}
  for (const [name, value] of headerPairs(frameHeaders)) {
    const lowered = name.toLowerCase()
    if (BRIDGE_HOP_BY_HOP.has(lowered) || lowered === UPSTREAM_ENCODING_HEADER) continue
    headers[name] = value
  }
  headers.host = host
  headers[UPSTREAM_ENCODING_HEADER] = UPSTREAM_ENCODING
  return headers
```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/relay-bridge-connector.ts:494-535](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/relay-bridge-connector.ts#L494-L535)

HTTP与WS真实调用header转换。

<details>
<summary>查看原文（42行）</summary>

```text
  /** Start one upstream HTTP request for a bridged stream. */
  private startHttp(id: number, frame: Record<string, unknown>): void {
    const upstream = new URL(this.options.upstream)
    const method = typeof frame.method === 'string' ? frame.method : 'GET'
    const path = typeof frame.url === 'string' && frame.url !== '' ? frame.url : '/'
    const host = bridgeUpstreamHost(frame.host, this.options.hostname)
    const request = http.request({
      host: upstream.hostname,
      port: upstream.port === '' ? 80 : Number(upstream.port),
      path,
      method,
      headers: bridgeUpstreamHeaders(frame.headers, host),
    }, (response: http.IncomingMessage) => {
      this.requests.delete(id)
      this.sendText(JSON.stringify({
        t: 'res',
        id,
        status: response.statusCode,
        statusText: response.statusMessage ?? '',
        headers: rawHeaderPairs(response.rawHeaders),
      }))
      response.on('data', (chunk: Buffer) => { this.sendChunk(encodeChunk(HTTP_BODY, id, chunk)) })
      response.on('end', () => { this.sendText(JSON.stringify({ t: 'fin', id })) })
      response.on('error', (error: Error) => { this.sendText(JSON.stringify({ t: 'fail', id, message: error.message })) })
    })
    request.on('error', (error: Error) => {
      this.requests.delete(id)
      this.sendText(JSON.stringify({ t: 'fail', id, message: error.message }))
    })
    this.requests.set(id, request)
  }

  /** Open one upstream WebSocket for a phone's upgrade. */
  private async openSocket(id: number, frame: Record<string, unknown>): Promise<void> {
    const upstream = new URL(this.options.upstream)
    const host = bridgeUpstreamHost(frame.host, this.options.hostname)
    const headers = bridgeUpstreamHeaders(frame.headers, host)
    headers.connection = 'Upgrade'
    headers.upgrade = 'websocket'
    headers['sec-websocket-key'] = randomBytes(16).toString('base64')
    headers['sec-websocket-version'] = '13'
    try {
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 撤销、停用和退出能撤掉哪些状态？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

单设备revoke只撤该ID；全部stop撤token和所有设备。新HTTP及新的WS握手会重新touchDevice，已撤销凭据因此被拒。配置enabled=false还service.stop、停止隧道、处理relay半连接、重置公共地址，并释放配对HTTP与upgrade注册；定时sweep也随禁用释放。它没有承诺回滚已转发宿主任务或文件写入。

已建立的WS代理不是在每一帧重新查设备表。当前源码确认握手处校验及路由释放，但没有在这条已读代理链找到revoke逐连接中断的保证；因此“停止”不能直接解释为所有存活连接立刻失效。普通/api监听还取决于宿主是否发事件，公网代理、其他插件入口与共享relay身份都要分别盘点。

对旧部署迁移者，首次要确认版本、网络绑定和原有可控管理通道，持续要核对设备和链接有效期，失败后要区分token、cookie、内层认证、隧道与宿主结果。只有保留本机管理和可恢复profile，才适合在隔离LAN观察旧行为；不建议为了短暂便利新建公网旧包部署。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:526-550](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/pairing.ts#L526-L550)

stop与revoke状态变化。

<details>
<summary>查看原文（25行）</summary>

```text
  /**
   * Stop remote control: revoke every device session and clear the token.
   * The phone's next gated /api request 403s; the panel falls back to
   * stopped until a fresh QR is issued.
   */
  stop(): void {
    this.tokens.clear()
    this.devices.clear()
    this.persistRevocation()
    this.stopped = true
    this.notify()
  }

  /**
   * Revoke one paired device. The next gated request from that cookie is
   * refused; other sessions stay live. Unknown ids are a no-op.
   * @param deviceId - the cookie value of the device to drop.
   * @returns true when a live session was removed.
   */
  revoke(deviceId: string): boolean {
    if (this.stopped) return false
    if (!this.devices.delete(deviceId)) return false
    this.persistRevocation()
    this.notify()
    return true
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:150-159](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/remote-api.ts#L150-L159)

新HTTP每次设备检查。

<details>
<summary>查看原文（10行）</summary>

```text
  const handler = (req: IncomingMessage, res: ServerResponse): void => {
    // Paired credential first — before any bytes are buffered or forwarded.
    // Unconditional by design: this channel attaches the process's own
    // browser-auth cookie to every re-issued call, so admitting an unpaired
    // caller would hand out that credential's authority (issue #1665).
    const paired = pairedDeviceIdOf(req, service)
    if (paired === undefined) {
      req.resume()
      envelopeError(res, 403, 'invalid-request', 'unpaired', 'this device is not paired with the desktop')
      return
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:241-278](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/remote-api.ts#L241-L278)

WS只在握手链校验并建立代理。

<details>
<summary>查看原文（38行）</summary>

```text
  const handlerFor = (fallbackPath: string) => (req: IncomingMessage, socket: Duplex, head: Buffer): void => {
    // WebSocket handshakes cannot carry headers from the Web API, so the
    // cookieless credential rides the query; the cookie stays the primary.
    // The gate is unconditional here too (issue #1665).
    let queryDevice: string | undefined
    try {
      queryDevice = new URL(req.url ?? '/', 'http://127.0.0.1').searchParams.get(REMOTE_DEVICE_QUERY) ?? undefined
    } catch { /* fall through to the cookie */ }
    const deviceId = pairedDeviceIdOf(req, service)
    const paired = deviceId ?? (queryDevice !== undefined && service.touchDevice(queryDevice) ? queryDevice : undefined)
    if (paired === undefined) {
      socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n')
      socket.destroy()
      return
    }
    const port = deps.port()
    if (port === undefined) {
      // Same unbound-port refusal as the HTTP leg: no :undefined handshake.
      socket.write('HTTP/1.1 503 Service Unavailable\r\nConnection: close\r\n\r\n')
      socket.destroy()
      return
    }
    const inner = upgradeInnerPath(req.url, fallbackPath)
    const denied = loopbackOnlyDenial(inner.split('?')[0] ?? inner)
    if (denied !== undefined) {
      socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n')
      socket.destroy()
      return
    }
    // The inner handshake needs the browser-auth credential (the gateway
    // event-stream route enforces it); resolving it is async, so the
    // handshake bytes are written once it settles. A missing credential
    // proceeds as before — the gateway route then refuses.
    void Promise.resolve(deps.auth?.ready())
      .catch(() => undefined)
      .then((cookie) => {
        if (socket.destroyed) return
        proxyLoopbackUpgrade(req, socket, head, port, inner, typeof cookie === 'string' ? cookie : undefined)
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:1388-1426](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/index.ts#L1388-L1426)

禁用的隧道、relay、路由与sweep清理。

<details>
<summary>查看原文（39行）</summary>

```text
    const enabled = value.enabled
    if (!enabled) {
      service.stop()
      // The tunnel branch above follows the plan, not the master switch, so an
      // explicit "off" must also drop the public ingress it started: otherwise
      // the cloudflared child keeps a live public URL (and the relay keeps its
      // stable row) while the panel says remote control is stopped. The relay
      // row is deliberately kept so re-enabling reuses the same origin.
      tunnel.stop()
      disposeRelayHalf()
      publicBase.reset()
    }
    if (disposeRoutes === undefined && enabled) {
      disposeRoutes = ctx.effect(
        () => {
          const disposers = [
            ...routes.map(route => ctx.webServer.register(route)),
            ...upgrades.map(route => ctx.webServer.registerUpgrade(route)),
          ]
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

**依据 5 · 作者声明**：[packages/dsh-remote-web-ui/README.md:5-9](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/README.md#L5-L9)

退役和共享relay使迁移成本成为实质条件。

```text
> **Deprecation notice**: `@linxin666/dsh-remote-web-ui` is deprecated in favor of [@linxin666/dsh-remote-bridge](../dsh-remote-bridge/README.md). It has been retired from the `@linxin666/dsh-web-all` aggregate bundle (where legacy profile rows mount silently as no-ops via tombstone exports and the `retiredPlugins` registry) and will be removed in the next release. Standalone installation (`dsh plugin --profile <name> add @linxin666/dsh-remote-web-ui`) remains functional during this transitional period. Browser-based remote control has been replaced by the native phone app (@linxin666/dsh-remote-bridge), and this package no longer provides remote access capabilities.
>
> - **Capabilities migrated to `@linxin666/dsh-remote-bridge`**: Ingress stack (relay registry identity, lease control claim/release, quick and named tunnel connectors, Durable Object relay bridge connector, cloudflared lifecycle management and orphan process reaping, Cloudflare named tunnel ingress sync, LAN forwarder, host bind capability probe, and host firewall management).
> - **Capabilities retired with this package**: Browser-facing remote web control (pairing cookie gate, `/api/pair` endpoints, `/remote` proxy channel, and the mobile browser touch adaptation layer).
> - **Known coexistence risk**: if installed in the same profile alongside `@linxin666/dsh-remote-bridge`, do not enable relay on both plugins simultaneously (both share the same on-disk relay identity per profile; running both causes Durable Object connection contention, and mounting the bridge with `relay=false` withdraws the shared registration row and releases the lease).
```

#### 缺口

- 存活WebSocket和所有外部代理下的撤销传播未确认
  **影响**：不能把撤销响应当作全部连接和任务已终止
  **进一步探讨**：在受控部署分别记录新HTTP、旧WS、新WS握手与已有任务，撤销后检查状态再关闭网络入口。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪个可证伪实验能决定旧部署是否继续保留？

**研究主题**：新假设与验证、效果与总成本、采用判断

#### 完整回答

可研究的假设是，设备列表加可核查的退出回执能降低临时授权回收的人工负担。它来自源码把发码token、设备、grant和内层认证分层管理，但不能仅因有撤销按钮就认定回收可靠；尤其可重用token与存活WS必须放进验收。该“退出回执”尚未实现和验证。

最小对照用既有部署的隔离副本、两个非关键浏览器和只读测试会话，与原宿主的受控访问办法比较。记录同一码二次兑换、同grant重用、revoke后新请求及存活WS、stop后重连和内层401五类结果；同时记录获得访问、找到所有设备、确认退出的人工分钟及网络资源。只有退出状态真实可核对、总人工负担下降且无多余授权残留，才支持假设；状态不明或核查更费力就放弃。

本次推荐为观察旧部署迁移而非新安装。若旧包/宿主不匹配、撤销后仍能新建访问、内层反复401或两套relay争用，立即停止旧入口并回到本机受控通道。迁移后的替代包需要独立核查，不因作者推荐就视为已验收。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:485-550](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/pairing.ts#L485-L550)

重复token与两种撤销为实验提供不同状态。

<details>
<summary>查看原文（66行）</summary>

```text
  /**
   * Redeem a token and bind a device session. The token is a bearer
   * credential for its whole window, not a single-use nonce: it is refused
   * only when unknown, past its expiry, or after stop(), and every successful
   * call — including a repeat within the same window — mints a fresh device
   * session (see the module doc for the mobile cookie-context rationale).
   * @param token - the token secret from the QR link.
   * @param userAgent - optional User-Agent header captured at accept.
   * @returns the new device id, or a refusal code.
   */
  accept(token: string, userAgent?: string): AcceptResult {
    const record = this.tokens.get(token)
    if (record === undefined || this.stopped || this.clock.now() > record.expiresAt) {
      return { ok: false, code: 'invalid' }
    }
    const deviceId = this.clock.randomToken()
    const now = this.clock.now()
    // FIFO-evict until a slot is free. The loop (not a single delete) covers a
    // table that is already over the cap: restore keeps every persisted session
    // (see loadPersisted), so the excess is collected here, once the store is
    // actually asked to admit a new device, rather than at startup on a cap the
    // configuration may not have delivered yet.
    while (this.devices.size >= this.config.maxDevices) {
      let oldest: { id: string; createdAt: number } | undefined
      for (const [id, session] of this.devices) {
        if (oldest === undefined || session.createdAt < oldest.createdAt) oldest = { id, createdAt: session.createdAt }
      }
      if (oldest === undefined) break
      this.devices.delete(oldest.id)
    }
    const label = sanitizeUserAgent(userAgent)
    this.devices.set(deviceId, {
      createdAt: now,
      lastSeenAt: now,
      ...(label !== undefined ? { userAgent: label } : {}),
    })
    this.persist()
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
    this.persistRevocation()
    this.stopped = true
    this.notify()
  }

  /**
   * Revoke one paired device. The next gated request from that cookie is
   * refused; other sessions stay live. Unknown ids are a no-op.
   * @param deviceId - the cookie value of the device to drop.
   * @returns true when a live session was removed.
   */
  revoke(deviceId: string): boolean {
    if (this.stopped) return false
    if (!this.devices.delete(deviceId)) return false
    this.persistRevocation()
    this.notify()
    return true
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:241-278](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/remote-api.ts#L241-L278)

可观察新握手与存活连接的分界。

<details>
<summary>查看原文（38行）</summary>

```text
  const handlerFor = (fallbackPath: string) => (req: IncomingMessage, socket: Duplex, head: Buffer): void => {
    // WebSocket handshakes cannot carry headers from the Web API, so the
    // cookieless credential rides the query; the cookie stays the primary.
    // The gate is unconditional here too (issue #1665).
    let queryDevice: string | undefined
    try {
      queryDevice = new URL(req.url ?? '/', 'http://127.0.0.1').searchParams.get(REMOTE_DEVICE_QUERY) ?? undefined
    } catch { /* fall through to the cookie */ }
    const deviceId = pairedDeviceIdOf(req, service)
    const paired = deviceId ?? (queryDevice !== undefined && service.touchDevice(queryDevice) ? queryDevice : undefined)
    if (paired === undefined) {
      socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n')
      socket.destroy()
      return
    }
    const port = deps.port()
    if (port === undefined) {
      // Same unbound-port refusal as the HTTP leg: no :undefined handshake.
      socket.write('HTTP/1.1 503 Service Unavailable\r\nConnection: close\r\n\r\n')
      socket.destroy()
      return
    }
    const inner = upgradeInnerPath(req.url, fallbackPath)
    const denied = loopbackOnlyDenial(inner.split('?')[0] ?? inner)
    if (denied !== undefined) {
      socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n')
      socket.destroy()
      return
    }
    // The inner handshake needs the browser-auth credential (the gateway
    // event-stream route enforces it); resolving it is async, so the
    // handshake bytes are written once it settles. A missing credential
    // proceeds as before — the gateway route then refuses.
    void Promise.resolve(deps.auth?.ready())
      .catch(() => undefined)
      .then((cookie) => {
        if (socket.destroyed) return
        proxyLoopbackUpgrade(req, socket, head, port, inner, typeof cookie === 'string' ? cookie : undefined)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/loopback-proxy.ts:183-194](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/src/loopback-proxy.ts#L183-L194)

401应作为失败结果而非透明恢复。

<details>
<summary>查看原文（12行）</summary>

```text
  }, (upstreamRes) => {
    // The cached credential went stale (secret rotation, credential store
    // reset): drop it so the next request re-redeems. The in-flight response
    // still pipes through untouched.
    if (upstreamRes.statusCode === 401 && cookie !== undefined) auth?.invalidate()
    const out: OutgoingHttpHeaders = {}
    for (const name of HTTP_FORWARD_RESPONSE_HEADERS) {
      const value = upstreamRes.headers[name]
      if (value !== undefined) out[name] = value
    }
    res.writeHead(upstreamRes.statusCode ?? 502, out)
    upstreamRes.pipe(res)
```

</details>

**依据 4 · 作者声明**：[packages/dsh-remote-web-ui/README.md:5-9](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-remote-web-ui/README.md#L5-L9)

明确退役和迁移范围。

```text
> **Deprecation notice**: `@linxin666/dsh-remote-web-ui` is deprecated in favor of [@linxin666/dsh-remote-bridge](../dsh-remote-bridge/README.md). It has been retired from the `@linxin666/dsh-web-all` aggregate bundle (where legacy profile rows mount silently as no-ops via tombstone exports and the `retiredPlugins` registry) and will be removed in the next release. Standalone installation (`dsh plugin --profile <name> add @linxin666/dsh-remote-web-ui`) remains functional during this transitional period. Browser-based remote control has been replaced by the native phone app (@linxin666/dsh-remote-bridge), and this package no longer provides remote access capabilities.
>
> - **Capabilities migrated to `@linxin666/dsh-remote-bridge`**: Ingress stack (relay registry identity, lease control claim/release, quick and named tunnel connectors, Durable Object relay bridge connector, cloudflared lifecycle management and orphan process reaping, Cloudflare named tunnel ingress sync, LAN forwarder, host bind capability probe, and host firewall management).
> - **Capabilities retired with this package**: Browser-facing remote web control (pairing cookie gate, `/api/pair` endpoints, `/remote` proxy channel, and the mobile browser touch adaptation layer).
> - **Known coexistence risk**: if installed in the same profile alongside `@linxin666/dsh-remote-bridge`, do not enable relay on both plugins simultaneously (both share the same on-disk relay identity per profile; running both causes Durable Object connection contention, and mounting the bridge with `relay=false` withdraws the shared registration row and releases the lease).
```

#### 缺口

- 回收回执和同条件操作负担的实验未执行
  **影响**：不能确认新设计减少授权残留或人工成本
  **进一步探讨**：先在隔离副本完成五类对照，记录反例和恢复步骤后再判断是否保留旧入口。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
