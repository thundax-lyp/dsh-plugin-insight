# DSH Mobile

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[0d5ac46](https://github.com/saya-ch/dsh-mobile/tree/0d5ac46dc961e021f363e85b0ba6d3585682e980)

<!-- BEGIN META -->
[![GitHub ★ 637](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=637&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/saya-ch/dsh-mobile) [![npm 30d 17,588](https://img.shields.io/static/v1?label=npm+30d&message=17%2C588&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mobile) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mobile)
<!-- END META -->

> **功能**：让手机浏览器或 Android App 通过局域网或远程通道继续使用电脑中的 DSH

> **亮点**：[Q01](#research-q01) 的增量在于把手机接入、设备配对和认证网关连成个人跨设备流程。[Q02](#research-q02) 显示 HTTP、WS 和撤销在途资源有实际接线，而不是仅有登录页面。

> **主要限制**：[Q03](#research-q03) 中断线不说明上游操作未发生，撤销连接也不回滚任务；配对设备可操作同一个 DSH，不能替代多用户隔离。

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
  - [Q01 · 相比直接打开 DSH 网页，移动访问实际补上什么？](#detail-section-11)
  - [Q02 · 配对凭据怎样到达 HTTP 和 WS，撤销能否约束在途连接？](#detail-section-12)
  - [Q03 · 断线重试能否保证手机操作不重复或自动完成？](#detail-section-13)
  - [Q04 · 局域网与远程部署分别依赖什么，使用成本由谁承担？](#detail-section-14)
  - [Q05 · 如何用可信手机做有限试用，什么时候退出？](#detail-section-15)
  - [Q06 · 能否为断线写操作增加可核对的结果收据？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已经在电脑运行 DSH、需要离开电脑后继续查看消息或处理待输入事项的个人用户。任务合格标准是在同一工作区和会话继续处理，并能撤销手机访问，而不是复制一个会话到新服务器。原办法可以在可信网络直接打开网页，或者用已有 VPN 加浏览器；插件额外组织独立网关、单次配对、设备管理和手机入口，减少用户手工拼装这些组件的工作。

实际 plugin.startGateway 构造 MobileAccessGateway 与 JsonDeviceStore，启动后挂入任务事件；它代理原有上游，并没有实现新的推理引擎或会话数据库。会话与工具能力应归属于 DSH，网络隧道与证书能力也不能全部归为插件原创。README 明确配对设备能够操作电脑 DSH，应完全信任。由此这是个人设备延伸，不是多人共享计算服务的权限隔离方案。

直接使用可信网络中的 DSH 网页，或现有 VPN 配合浏览器；会话、工作区和模型能力来自上游 DSH。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 配对网关 | 授予本人手机访问电脑DSH | 配对设备完全受信任，不是多人隔离 |
| 同会话代理 | 在手机继续原任务 | 电脑在线，依赖上游能力 |
| 设备撤销 | 停止凭据与在途连接 | 不回滚上游已执行操作 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 在线电脑与匹配 DSH/Node | 必需 | 提供原会话与工具 | 手机不能独立执行原任务 |
| 可信网络、HTTPS 与受信任手机 | 接入必需 | 保护凭据与授予设备操作权 | 不配对不可信设备，回电脑操作 |
| 远程隧道或自建代理 | 远程才需 | 到达独立网关 | 先使用局域网或已有 VPN |
| 外部第三方 WS 路径批准 | 特定插件才需 | 放行明确连接路径 | 保留默认拒绝，先核对来源 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户按 Desktop 或 Web 入口安装并保留电脑访问 | 插件载入且电脑原任务仍可操作 |
| 配对 | 用户在可信局域网授予本人手机访问 | 一次密钥交换后可访问同会话 |
| 任务 | 用户处理无重要副作用任务并核对结果 | 消息与原会话一致，断线先查结果 |
| 验收 | 用户从电脑撤销设备 | 手机新请求拒绝且旧连接终止，否则停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 电脑与网络及可选隧道费用，金额未知 | 安装、证书与配对，时间未知 | Desktop/Web入口不同 |
| 持续使用 | 原模型调用、电脑在线、远程服务 | 版本兼容、设备管理 | 无同任务费用与节时数据 |
| 失败恢复 | 可能重新联网或执行任务 | 先回原会话确认副作用再重试 | 代理不保证业务恰好一次 |
| 退出 | 保留原DSH环境 | 撤销设备、关闭网关并确认不可达 | 没有同版真实退出验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 手机延续 | 代理原DSH、配对与设备会话链可查 | 真实手机各模块兼容 |
| 撤销 | 删除持久设备状态并中止会话资源 | 真实网络和App的完成时延 |
| 断线处理 | 特定静态GET可有限重试，写入不自动重放 | 上游写入最终结果及端到端恢复成功率 |

> **思考**：[Q03](#research-q03) 中断线不说明上游操作未发生，撤销连接也不回滚任务；配对设备可操作同一个 DSH，不能替代多用户隔离。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的增量在于把手机接入、设备配对和认证网关连成个人跨设备流程。[Q02](#research-q02) 显示 HTTP、WS 和撤销在途资源有实际接线，而不是仅有登录页面。

[Q02](#research-q02) 单次窗口在串行修改内复查，设备删除先持久后终止会话，WS等待上游后再认证，均是值得借鉴的生命周期处理。[Q03](#research-q03) 有意限制自动重放属于合理取舍。核心gateway较大，证书、隧道及客户端版本增加维护面，本轮未覆盖全部模块，不把测试文件存在视为运行通过。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 中断线不说明上游操作未发生，撤销连接也不回滚任务；配对设备可操作同一个 DSH，不能替代多用户隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议已有 DSH、确有离开电脑后继续同一会话需要的个人用户在可信局域网试用。先保存电脑侧退路，以一个无重要副作用的任务配对手机，检查消息与待输入项，再从电脑撤销设备，确认手机新请求失败、已有连接结束。之后才考虑远程隧道，而不是一次启用所有连接方式。 试用成功应是同任务可继续且访问可撤销，不能只看二维码或页面能打开。若已撤销仍能操作、网络中断后任务状态不明却被提示重新提交，或所需第三方连接必须大幅放宽允许路径，应停止并回到电脑端，或已有的可信 VPN 网页流程。多人隔离需求不适合靠配对功能解决。该试用路径是源码支持的有条件判断，没有同版宿主验收，不升级为持续安装建议。 依据见 [Q05](#research-q05)。

实际 plugin.startGateway 构造 MobileAccessGateway 与 JsonDeviceStore，启动后挂入任务事件；它代理原有上游，并没有实现新的推理引擎或会话数据库。会话与工具能力应归属于 DSH，网络隧道与证书能力也不能全部归为插件原创。README 明确配对设备能够操作电脑 DSH，应完全信任。由此这是个人设备延伸，不是多人共享计算服务的权限隔离方案。

最小验证选择一种可回滚或无损任务，分别在上游接收前、执行后响应前断线，对比当前流程与标识查询流程的重复执行数、状态误判和人工确认时间。若无法让状态记录与实际执行一致，或者原会话查询已足够简单、增益抵不过新增状态维护，就否定独立收据组件方向。当前没有实现、真实需求频率或付费意愿证据，不计入现有贡献。 依据见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

认证与撤销主路径有固定源码支持。手机兼容、隧道可用性和实际收益未独立验收；写操作收据是未验证设计假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/plugin.ts、src/access.ts、src/gateway.ts、src/storage.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定0d5ac46dc961e021f363e85b0ba6d3585682e980。检查README、package、plugin、access、gateway与设备存储主链；未审查全部隧道实现、Android Keystore及全部界面。
- 下一步：实际为固定源码检查，未安装运行目标代码，未执行其测试或手机验收。有限试用须自行确认同会话、断线结果和撤销连接。

**分析版本**

- **仓库**：[saya-ch/dsh-mobile](https://github.com/saya-ch/dsh-mobile)
- **版本号**：0.6.18（[固定提交 0d5ac46](https://github.com/saya-ch/dsh-mobile/tree/0d5ac46dc961e021f363e85b0ba6d3585682e980)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

由静态资源可重试而写操作不能自动重试的边界，可以推导未验证的操作收据设计。让支持的上游操作携带稳定请求标识并记录最终状态，手机重连先查询收据，再决定是否提交；相对当前纯传输失败提示，增量是降低“已执行还是未执行”的人工判断负担。它需要 DSH 具体业务接口配合，网关独自缓存成功响应不能保证上游副作用与记录原子一致。

最小验证选择一种可回滚或无损任务，分别在上游接收前、执行后响应前断线，对比当前流程与标识查询流程的重复执行数、状态误判和人工确认时间。若无法让状态记录与实际执行一致，或者原会话查询已足够简单、增益抵不过新增状态维护，就否定独立收据组件方向。当前没有实现、真实需求频率或付费意愿证据，不计入现有贡献。 依据见 [Q06](#research-q06)。

实际为固定源码检查，未安装运行目标代码，未执行其测试或手机验收。有限试用须自行确认同会话、断线结果和撤销连接。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 45 | 5294 | — | — | 123479 |
| .ts | source | 102 | 35830 | 30365 | 3754 | — |
| .ts | test | 167 | 40991 | 36516 | 2308 | — |
| .mjs | source | 61 | 12824 | 11891 | 552 | — |
| .mjs | test | 3 | 273 | 232 | 31 | — |

</details>

**活跃度**

[![Issue 未关闭 24](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=24&color=737b86&logo=github)](https://github.com/saya-ch/dsh-mobile/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有 DSH 用户能否在手机可靠继续电脑任务，且不把配对当作多用户权限隔离？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比直接打开 DSH 网页，移动访问实际补上什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已经在电脑运行 DSH、需要离开电脑后继续查看消息或处理待输入事项的个人用户。任务合格标准是在同一工作区和会话继续处理，并能撤销手机访问，而不是复制一个会话到新服务器。原办法可以在可信网络直接打开网页，或者用已有 VPN 加浏览器；插件额外组织独立网关、单次配对、设备管理和手机入口，减少用户手工拼装这些组件的工作。

实际 plugin.startGateway 构造 MobileAccessGateway 与 JsonDeviceStore，启动后挂入任务事件；它代理原有上游，并没有实现新的推理引擎或会话数据库。会话与工具能力应归属于 DSH，网络隧道与证书能力也不能全部归为插件原创。README 明确配对设备能够操作电脑 DSH，应完全信任。由此这是个人设备延伸，不是多人共享计算服务的权限隔离方案。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:45-62](https://github.com/saya-ch/dsh-mobile/blob/0d5ac46dc961e021f363e85b0ba6d3585682e980/README.md#L45-L62)

作者明确同会话、网络通道与设备完全信任条件。

<details>
<summary>查看原文（18行）</summary>

```text
DSH Mobile 是一个 DeepSeek Harness 插件，让手机浏览器或 Android App 通过局域网，或可选的 Tailscale Funnel、cpolar、cloudflared、自建 FRP 或自有反向代理远程通道连接电脑，继续使用同一份会话、工作区、消息和工具。电脑端分别启停局域网与远程访问、分别管理配对授权；Android App 统一显示已配对电脑。插件不修改 DeepSeek Harness 源码。

移动访问使用独立 HTTPS 与设备配对；Android App 固定局域网私有 CA，公开远程通道使用系统信任的证书；自签 FRP 入口还需由 0.4.6 App 在配对时固定远程 CA。

它还能在 DSH 对话里用 `/mobile <需求>` 定制手机端。

## 能做什么

- **在手机上继续电脑端的工作**：同一份会话、工作区、消息和工具，实时同步。
- **用对话定制手机端**：在 DSH 对话里提出布局、交互或功能需求；文件修改完成后，手机页面通常会自动刷新。
- **专属触屏布局**：会话抽屉、工具详情、设置、提问卡片和输入栏都按手机重新组织；App 跟随系统语言（简/英/意），插件界面跟随 DSH 语言。
- **多种远程通道**：Tailscale、cpolar、cloudflared 快速/命名隧道、自建 FRP、自有反向代理，按网络任选；Windows/Linux x64 还可由插件托管 Caddy HTTPS 与证书。
- **配对与多设备**：扫码、链接或密钥配对一次；切换 Wi-Fi、热点或 IP 后通常自动恢复；App 在一个列表中显示局域网和远程配对的电脑，定期检测可达状态，并支持切换、重新配对或删除本地记录。
- **一键诊断与放行**：检查版本、网关、网卡、防火墙和远程通道，生成脱敏报告；被拦截的第三方插件连接按确切路径一键放行。
- **任务系统通知**：任务完成与待输入以 Android 系统通知提醒，可在 App 内的 DSH“通用设置”中开启，锁屏文本脱敏。
- **纵深安全**：局域网固定私有 CA，公开远程入口使用受信任 HTTPS；自签 FRP 入口由 0.4.6 App 固定远程 CA。凭据存 Keystore，设备令牌只发往精确 Origin，第三方 WS 默认拦截。

配对设备可以操作电脑上的 DSH，应视为完全受信任的设备。局域网只在可信网络开启；远程访问应使用可靠的 HTTPS 通道。手机丢失时，请立即从电脑端撤销设备。
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:595-621](https://github.com/saya-ch/dsh-mobile/blob/0d5ac46dc961e021f363e85b0ba6d3585682e980/src/plugin.ts#L595-L621)

真正构造并启动带设备存储的网关，接入已有任务事件。

<details>
<summary>查看原文（27行）</summary>

```text
  const startGateway = async (candidateConfig: PluginConfig): Promise<MobileAccessRuntime> => {
    const resolved = withInstallationIdentity(parseGatewayConfig({
      ...candidateConfig,
      upstreamOrigin: template.upstreamOrigin.origin,
    }), frpIdentity, candidateConfig.instanceId !== undefined)
    const candidate = new MobileAccessGateway(
      resolved,
      new JsonDeviceStore(resolved.stateFile, resolved.maxDevices),
      mobileAccess,
      upstreamLoginUrl,
      webSocketPaths,
      blockedUpgradePaths,
      (source, code) => { logger.warn('%s discovery degraded while DSH remains available: %s', source, code) },
      clientModulePreferences,
      entry => { logger.warn('auth failure %s', JSON.stringify(entry)) },
      entry => { logger.warn('http failure %s', JSON.stringify(entry)) },
      entry => { logger.info('upstream auth %s', JSON.stringify(entry)) },
      entry => { logger.warn('slow api %s', JSON.stringify(entry)) },
    )
    await candidate.start()
    lanGateway = candidate
    const removeTaskSink = taskEventHub.add(candidate)
    return {
      close: async () => {
        if (lanGateway === candidate) lanGateway = undefined
        removeTaskSink()
        await candidate.close()
```

</details>

#### 缺口

- 没有用户离开电脑后的真实任务频率和 VPN 浏览器同任务对照。
  **影响**：可以解释连接组织增量，但不能证明普遍需要迁移。
  **进一步探讨**：对已有手机接入需求者记录同一任务在 VPN 网页与插件下的配对、恢复和撤销负担。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配对凭据怎样到达 HTTP 和 WS，撤销能否约束在途连接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

AccessController 在单次配对窗口检查密钥后进入串行修改，再次检查窗口并消耗它，持久化设备令牌摘要后创建短会话。HTTP 主请求在进入代理前调用 authorize，认证失败网页可转登录页；WS 则检查精确 Origin、允许路径、握手与会话，在等待上游认证后再次认证，避免只在最早阶段判断。

撤销先保存不含该设备的新快照，再删除关联会话；网关订阅会话结束，撤销通知发出后中止该会话的在途资源。由此源代码提供了设备凭据、短会话与连接生命周期的闭环，超过单纯把登录页面放在代理前面。但设备身份只限定谁连进同一个 DSH，并不创建按工作区或用户的最小权限。也不能由 abort 连接推断上游已完成写操作被回滚。

#### 证据与依据

**依据 1 · 源码核查**：[src/access.ts:297-342](https://github.com/saya-ch/dsh-mobile/blob/0d5ac46dc961e021f363e85b0ba6d3585682e980/src/access.ts#L297-L342)

一次性窗口二次检查、摘要持久化和创建会话的实际顺序。

<details>
<summary>查看原文（46行）</summary>

```text
  /** Consume the pairing window exactly once and persist only the device-token digest. */
  async pair(sourceKey: string, token: string, label?: string): Promise<PairingResult> {
    this.requireInitialized()
    const initialNow = this.now()
    const initialWindow = this.pairingWindow
    // Reject unknown guesses before the serialized mutation queue. A candidate
    // is checked again inside it because another pairing or opening can replace
    // the one-time window while this request waits.
    if (token.length > 512 || initialWindow === undefined || initialWindow.expiresAt <= initialNow
      || !matchesDigest(token, initialWindow.digest)) {
      this.rejectPairingAttempt(sourceKey, initialNow)
    }
    if (this.pairPending) throw new AccessError(429, 'rate_limited')
    this.pairPending = true
    try {
      return await this.exclusive(async () => {
        const now = this.now()
        const window = this.pairingWindow
        if (window === undefined || window.expiresAt <= now || !matchesDigest(token, window.digest)) {
          if (window !== undefined && window.expiresAt <= now) this.pairingWindow = undefined
          this.rejectPairingAttempt(sourceKey, now)
        }
        this.pairingWindow = undefined
        const active = this.devices.filter(device => device.revokedAt === undefined && device.expiresAt > now)
        if (active.length >= this.options.maxDevices) throw new AccessError(409, 'device_limit')

        const deviceToken = opaqueToken()
        const device: StoredDevice = Object.freeze({
          id: randomBytes(16).toString('hex'),
          label: normalizeLabel(label),
          tokenDigest: digestHex(deviceToken),
          createdAt: now,
          expiresAt: now + this.options.deviceTtlMs,
          lastSeenAt: now,
          ...(this.options.pairingInstanceId === undefined ? {} : { nativeInstanceId: this.options.pairingInstanceId }),
        })
        const retained = this.devices.filter(candidate => candidate.revokedAt === undefined && candidate.expiresAt > now)
        const next = [...retained, device]
        await this.store.save(this.snapshot(next))
        this.devices = next
        const session = this.createSession(device, now)
        return Object.freeze({
          ...session,
          deviceToken,
          deviceExpiresAt: device.expiresAt,
        })
```

</details>

**依据 2 · 源码核查**：[src/gateway.ts:2049-2072](https://github.com/saya-ch/dsh-mobile/blob/0d5ac46dc961e021f363e85b0ba6d3585682e980/src/gateway.ts#L2049-L2072)

HTTP 主路径经过会话认证。

<details>
<summary>查看原文（24行）</summary>

```text
    let authorization: SessionAuthorization
    try {
      authorization = this.authorize(request)
    } catch (error) {
      const mapped = mapError(error)
      this.authFailures.record('authorize', mapped.status, request, target.decodedPathname, policy.canonicalOrigin(request.headers.origin))
      const acceptsHtml = request.headers.accept?.split(',').some(value => value.trim().split(';', 1)[0] === 'text/html') ?? false
      const topLevel = request.method === 'GET'
        && acceptsHtml
        && (request.headers['sec-fetch-dest'] === undefined || request.headers['sec-fetch-dest'] === 'document')
        && target.decodedPathname !== '/api'
        && !target.decodedPathname.startsWith('/api/')
      if (mapped.status === 401 && topLevel) {
        const returnPath = target.raw.length <= 2048 ? target.raw : '/'
        setSecurityHeaders(response, this.tlsEnabled)
        response.writeHead(302, {
          Location: `${AUTH_PREFIX}/login?return=${encodeURIComponent(returnPath)}`,
          'Content-Length': 0,
        })
        response.end()
        return
      }
      throw error
    }
```

</details>

**依据 3 · 源码核查**：[src/gateway.ts:3695-3752](https://github.com/saya-ch/dsh-mobile/blob/0d5ac46dc961e021f363e85b0ba6d3585682e980/src/gateway.ts#L3695-L3752)

WS 路径、Origin、握手与等待上游后的二次认证。

<details>
<summary>查看原文（58行）</summary>

```text
  private async handleUpgrade(request: IncomingMessage, client: Socket, head: Buffer): Promise<void> {
    const target = parseRequestTarget(request.url)
    const policy = this.requirePolicy()
    // Android WebView WebSockets do not consistently carry Fetch Metadata.
    // Exact Origin, direct CIDR, exact Host, and the short Session Cookie
    // remain mandatory; when Sec-Fetch-Site is present, assertExternalTrust
    // still requires it to be same-origin.
    assertExternalTrust(request, policy, false)
    if (!policy.acceptsOrigin(request.headers.origin)) throw new HttpError(403, 'forbidden')
    // Core DSH paths plus admin-approved third-party plugin paths (exact
    // pathname match; the query string rides along to the upstream plugin,
    // which owns its parsing). Everything else stays 404: paired-device
    // auth, Origin, and handshake checks below still apply to allowed paths.
    const upgradeAllowed = WS_PATHS.has(target.decodedPathname)
      || (this.extraWebSocketPaths?.has(target.decodedPathname) ?? false)
    if (!upgradeAllowed) {
      this.blockedUpgradeLog?.record(target.decodedPathname)
      throw new HttpError(404, 'not_found')
    }
    if (request.method !== 'GET' || headerValue(request.headers, 'upgrade')?.toLowerCase() !== 'websocket'
      || !hasToken(headerValue(request.headers, 'connection'), 'upgrade')) {
      throw new HttpError(400, 'bad_request')
    }
    const key = headerValue(request.headers, 'sec-websocket-key')
    if (key === undefined || headerValue(request.headers, 'sec-websocket-version') !== '13') {
      throw new HttpError(400, 'bad_request')
    }
    let decodedKey: Buffer
    try {
      decodedKey = Buffer.from(key, 'base64')
    } catch {
      throw new HttpError(400, 'bad_request')
    }
    if (decodedKey.length !== 16 || decodedKey.toString('base64') !== key) throw new HttpError(400, 'bad_request')
    let authorization = this.authorize(request)
    if (this.activeWebSockets.size >= this.config.maxWebSockets) throw new HttpError(429, 'busy')
    const upstreamCookie = await this.upstreamCookieHeader()
    if (client.destroyed) return
    authorization = this.authorize(request)
    if (this.activeWebSockets.size >= this.config.maxWebSockets) throw new HttpError(429, 'busy')
    const compressed = this.config.websocketCompression.paths.includes(target.decodedPathname)

    const upstream = connect({
      host: stripIpv6Brackets(this.config.upstreamOrigin.hostname),
      port: Number(this.config.upstreamOrigin.port),
    })
    client.pause()
    const id = this.nextOperationId++
    const closeBoth = (): void => {
      client.destroy()
      upstream.destroy()
    }
    client.on('error', closeBoth)
    upstream.on('error', closeBoth)
    const timer = setTimeout(closeBoth, Math.max(1, authorization.expiresAt - Date.now()))
    timer.unref()
    const record: ActiveWebSocket = Object.freeze({ ...authorization, client, upstream, timer })
    this.activeWebSockets.set(id, record)
```

</details>

**依据 4 · 源码核查**：[src/access.ts:428-439](https://github.com/saya-ch/dsh-mobile/blob/0d5ac46dc961e021f363e85b0ba6d3585682e980/src/access.ts#L428-L439)

持久化设备删除先于清理会话。

<details>
<summary>查看原文（12行）</summary>

```text
  /** Durably delete the device, then end every Session owned by that device. */
  async revokeDevice(deviceId: string): Promise<boolean> {
    this.requireInitialized()
    return this.exclusive(async () => {
      const next = this.devices.filter(device => device.id !== deviceId)
      if (next.length === this.devices.length) return false
      await this.store.save(this.snapshot(next))
      this.devices = next
      for (const [key, session] of this.sessions) {
        if (session.deviceId === deviceId) this.removeSession(key, 'revoked')
      }
      return true
```

</details>

**依据 5 · 源码核查**：[src/gateway.ts:1353-1374](https://github.com/saya-ch/dsh-mobile/blob/0d5ac46dc961e021f363e85b0ba6d3585682e980/src/gateway.ts#L1353-L1374)

会话结束回调通知并中止资源。

<details>
<summary>查看原文（22行）</summary>

```text
    this.removeSessionListener = this.access.onSessionEnded((authorization, reason) => {
      for (const view of this.mobileDocumentViews.values()) {
        if (view.sessionKey === authorization.sessionKey) this.removeMobileDocumentView(view)
      }
      if (reason === 'revoked') {
        const cleanup = this.clientModulePreferences.removeDevice(authorization.deviceId)
          .catch(() => { process.emitWarning('Unable to remove revoked device client preferences', { code: 'DSH_MOBILE_PREFERENCE_CLEANUP_FAILED' }) })
        this.clientModuleRevocations.add(cleanup)
        void cleanup.finally(() => this.clientModuleRevocations.delete(cleanup))
        if (!this.pendingDeviceRevocations.has(authorization.deviceId)) {
          this.pendingDeviceRevocations.add(authorization.deviceId)
          this.broadcastDeviceRevoked(authorization.deviceId)
        }
        // Let the final SSE frame enter the socket before revocation closes
        // the session-owned stream and WebSockets.
        setImmediate(() => {
          this.abortSessionResources(authorization.sessionKey)
          this.pendingDeviceRevocations.delete(authorization.deviceId)
        })
      } else {
        this.abortSessionResources(authorization.sessionKey)
      }
```

</details>

#### 缺口

- 没有同版真实手机与 DSH 的撤销在途请求结果。
  **影响**：源码闭环不能等同所有浏览器、App和网络组合已验收。
  **进一步探讨**：隔离测试一台手机已连 WS 和长请求时撤销，验证后续请求拒绝、连接断开及上游已发生副作用记录。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 断线重试能否保证手机操作不重复或自动完成？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能。HTTP 代理只有不带请求体且路径为 /plugins/ 或 /assets/ 的 GET 被判定可重放，其余请求最多一次。这个设计减少自动重复写操作的风险，但它既不提供业务幂等键，也不提供写入结果查询收据。手机断线时，POST 等操作可能已到上游，连接失败不等于任务未执行；用户应先回原会话核对结果，再决定重试。

WS 的过期计时和关闭连接也只是传输层边界，不能成为业务任务取消或完成证明。插件的连接恢复和原生 App 自动重连可以提升接入便利，但本轮只核查网关主链，没有把全部移动端恢复逻辑和通知逻辑当作已验证。对必须保证每次写入只执行一次的工作流，仍需上游任务系统提供自己的幂等和可查询状态。

#### 证据与依据

**依据 1 · 源码核查**：[src/gateway.ts:3314-3363](https://github.com/saya-ch/dsh-mobile/blob/0d5ac46dc961e021f363e85b0ba6d3585682e980/src/gateway.ts#L3314-L3363)

可重放请求只含特定无正文静态 GET，其余单次。

<details>
<summary>查看原文（50行）</summary>

```text
    const replayable = request.method === 'GET'
      && request.headers['transfer-encoding'] === undefined
      && (declared === undefined || Number(declared) === 0)
      && (request.url?.split('?', 1)[0]?.startsWith('/plugins/') === true
        || request.url?.split('?', 1)[0]?.startsWith('/assets/') === true)
    const holder: { request?: ClientRequest } = {}
    const operation = this.allocateRequest(authorization, response, holder)
    documentView?.abortStreams.add(operation.abort)
    const onClose = (): void => {
      if (documentView === undefined) operation.release()
      operation.abort()
    }
    response.once('close', onClose)
    const startedAt = performance.now()
    const latencyPath = boundedApiPath(request.url)
    // The client's wait ends when the response closes: a completed body or an
    // aborted read. Sampling only completed streams would hide the timeouts this
    // diagnostic exists to explain, so the close listener records both.
    if (latencyPath !== undefined) {
      response.once('close', () => {
        this.apiLatency.record({
          method: request.method,
          path: latencyPath,
          status: response.headersSent ? response.statusCode : 0,
          durationMs: performance.now() - startedAt,
        })
      })
    }
    // The HTTP parser accepts no payload without Content-Length or Transfer-Encoding.
    // Draining a bodyless GET once keeps its IncomingMessage out of retry pipelines.
    if (replayable) request.resume()
    try {
      const attempts = replayable ? MOBILE_BOOT_UPSTREAM_ATTEMPTS : 1
      for (let attempt = 1; attempt <= attempts; attempt++) {
        operation.signal.throwIfAborted()
        try {
          await this.proxyHttpOnce(request, response, holder, operation.signal, replayable, documentView)
          return
        } catch (error) {
          if (operation.signal.aborted || response.destroyed) return
          if (response.headersSent) {
            response.destroy()
            return
          }
          if (error instanceof HttpError || !isTransientUpstreamError(error)) {
            throw error instanceof HttpError ? error : new HttpError(502, 'upstream_unavailable')
          }
          if (attempt === attempts) throw new HttpError(502, 'upstream_unavailable')
          await waitForAbortableDelay(MOBILE_BOOT_RETRY_DELAY_MS * attempt, operation.signal)
        }
```

</details>

**依据 2 · 源码核查**：[src/gateway.ts:3741-3761](https://github.com/saya-ch/dsh-mobile/blob/0d5ac46dc961e021f363e85b0ba6d3585682e980/src/gateway.ts#L3741-L3761)

WS 超时与关闭只控制连接两端，不含业务回滚。

<details>
<summary>查看原文（21行）</summary>

```text
    client.pause()
    const id = this.nextOperationId++
    const closeBoth = (): void => {
      client.destroy()
      upstream.destroy()
    }
    client.on('error', closeBoth)
    upstream.on('error', closeBoth)
    const timer = setTimeout(closeBoth, Math.max(1, authorization.expiresAt - Date.now()))
    timer.unref()
    const record: ActiveWebSocket = Object.freeze({ ...authorization, client, upstream, timer })
    this.activeWebSockets.set(id, record)
    const cleanup = (): void => {
      if (compressed && (!client.destroyed || !upstream.destroyed)) return
      const active = this.activeWebSockets.get(id)
      if (active !== undefined) clearTimeout(active.timer)
      this.activeWebSockets.delete(id)
    }
    client.once('close', () => { if (!compressed) upstream.destroy(); cleanup() })
    upstream.once('close', () => { if (!compressed) client.destroy(); cleanup() })
    upstream.setTimeout(this.config.upstreamTimeoutMs, closeBoth)
```

</details>

#### 缺口

- 断线时业务写入是否已执行必须依赖上游具体接口状态。
  **影响**：不能宣称断网自动完成或端到端恰好一次。
  **进一步探讨**：选择可安全恢复的写操作，在上游接收后断网，比较原会话状态、手机提示和人工确认步骤。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 局域网与远程部署分别依赖什么，使用成本由谁承担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

局域网仍需要电脑在线、可信网络、匹配的 DSH/Node 和手机信任证书及配对。远程访问在此之外依赖选定隧道、公开 HTTPS 或自建代理运维；作者列出的通道并非本轮全部实测，不能把供应商可用性和费用写成插件保障。根 package 声明 Node ^22.19 或 >=24 与 Cordis、DSH 服务及 React 接口，而可选 peer 不表示用户任务不需要这些宿主能力。

使用单位是一轮手机接入、完成同会话操作并确认结果。现金包括原 DSH 模型、电脑在线、电信网络以及实际选用远程服务的收费；本轮没有账单。人工包括初次网络证书配对、持续版本兼容、手机丢失后的撤销与断线结果核对。相比自己维护代理与认证，插件集中配置可能减少手工拼装，但如果用户已有稳定 VPN 和可信网页接入，额外网关与配对状态也可能增加负担。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:45-62](https://github.com/saya-ch/dsh-mobile/blob/0d5ac46dc961e021f363e85b0ba6d3585682e980/README.md#L45-L62)

网络、证书与完全受信手机前提。

<details>
<summary>查看原文（18行）</summary>

```text
DSH Mobile 是一个 DeepSeek Harness 插件，让手机浏览器或 Android App 通过局域网，或可选的 Tailscale Funnel、cpolar、cloudflared、自建 FRP 或自有反向代理远程通道连接电脑，继续使用同一份会话、工作区、消息和工具。电脑端分别启停局域网与远程访问、分别管理配对授权；Android App 统一显示已配对电脑。插件不修改 DeepSeek Harness 源码。

移动访问使用独立 HTTPS 与设备配对；Android App 固定局域网私有 CA，公开远程通道使用系统信任的证书；自签 FRP 入口还需由 0.4.6 App 在配对时固定远程 CA。

它还能在 DSH 对话里用 `/mobile <需求>` 定制手机端。

## 能做什么

- **在手机上继续电脑端的工作**：同一份会话、工作区、消息和工具，实时同步。
- **用对话定制手机端**：在 DSH 对话里提出布局、交互或功能需求；文件修改完成后，手机页面通常会自动刷新。
- **专属触屏布局**：会话抽屉、工具详情、设置、提问卡片和输入栏都按手机重新组织；App 跟随系统语言（简/英/意），插件界面跟随 DSH 语言。
- **多种远程通道**：Tailscale、cpolar、cloudflared 快速/命名隧道、自建 FRP、自有反向代理，按网络任选；Windows/Linux x64 还可由插件托管 Caddy HTTPS 与证书。
- **配对与多设备**：扫码、链接或密钥配对一次；切换 Wi-Fi、热点或 IP 后通常自动恢复；App 在一个列表中显示局域网和远程配对的电脑，定期检测可达状态，并支持切换、重新配对或删除本地记录。
- **一键诊断与放行**：检查版本、网关、网卡、防火墙和远程通道，生成脱敏报告；被拦截的第三方插件连接按确切路径一键放行。
- **任务系统通知**：任务完成与待输入以 Android 系统通知提醒，可在 App 内的 DSH“通用设置”中开启，锁屏文本脱敏。
- **纵深安全**：局域网固定私有 CA，公开远程入口使用受信任 HTTPS；自签 FRP 入口由 0.4.6 App 固定远程 CA。凭据存 Keystore，设备令牌只发往精确 Origin，第三方 WS 默认拦截。

配对设备可以操作电脑上的 DSH，应视为完全受信任的设备。局域网只在可信网络开启；远程访问应使用可靠的 HTTPS 通道。手机丢失时，请立即从电脑端撤销设备。
```

</details>

**依据 2 · 源码核查**：[README.md:64-81](https://github.com/saya-ch/dsh-mobile/blob/0d5ac46dc961e021f363e85b0ba6d3585682e980/README.md#L64-L81)

Desktop 与 Web 安装入口不同。

<details>
<summary>查看原文（18行）</summary>

````text
## 快速开始

先在电脑安装插件，再用 Android App 或手机浏览器配对。按你使用的 DSH 选择安装方式。

### 官方 DSH Desktop

在应用的 **插件** 页面安装并启用 `dsh-mobile`，再打开 **移动访问** 配置局域网或远程通道。Desktop 的 profile 由应用管理，不适用下面的 `--profile web` 命令。

安装或更新后，请从应用菜单正常退出并重新打开 Desktop，无需清除会话或配对数据。若仍提示 `dsh-mobile-question-fixes: failed to import`，请检查安装日志；这也可能是组件解析问题，单纯重启不一定能解决。

### DSH Web

已经安装 `dsh` 命令时，在终端执行：

```powershell
dsh plugin --profile web add dsh-mobile@latest
dsh plugin --profile web exec dsh-mobile setup
dsh --profile web
````

</details>

**依据 3 · 源码核查**：[package.json:1-29](https://github.com/saya-ch/dsh-mobile/blob/0d5ac46dc961e021f363e85b0ba6d3585682e980/package.json#L1-L29)

包版本、CLI与入口。

<details>
<summary>查看原文（29行）</summary>

```text
{
  "name": "dsh-mobile",
  "version": "0.6.18",
  "private": false,
  "description": "DeepSeek Harness 移动端适配与安全访问插件，支持局域网、远程连接、Android App 和手机浏览器。",
  "type": "module",
  "workspaces": [
    "packages/question-fixes"
  ],
  "bin": {
    "dsh-mobile": "lib/cli.js"
  },
  "main": "./lib/index.mjs",
  "types": "./lib/index.d.mts",
  "exports": {
    ".": {
      "types": "./lib/index.d.mts",
      "default": "./lib/index.mjs"
    },
    "./client": {
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json"
  },
  "files": [
    "lib/**/*.mjs",
    "lib/cli.js",
    "lib/**/*.d.mts",
    "lib/client.js",
```

</details>

**依据 4 · 源码核查**：[src/plugin.ts:595-621](https://github.com/saya-ch/dsh-mobile/blob/0d5ac46dc961e021f363e85b0ba6d3585682e980/src/plugin.ts#L595-L621)

网关持久设备状态与生命周期由插件维护。

<details>
<summary>查看原文（27行）</summary>

```text
  const startGateway = async (candidateConfig: PluginConfig): Promise<MobileAccessRuntime> => {
    const resolved = withInstallationIdentity(parseGatewayConfig({
      ...candidateConfig,
      upstreamOrigin: template.upstreamOrigin.origin,
    }), frpIdentity, candidateConfig.instanceId !== undefined)
    const candidate = new MobileAccessGateway(
      resolved,
      new JsonDeviceStore(resolved.stateFile, resolved.maxDevices),
      mobileAccess,
      upstreamLoginUrl,
      webSocketPaths,
      blockedUpgradePaths,
      (source, code) => { logger.warn('%s discovery degraded while DSH remains available: %s', source, code) },
      clientModulePreferences,
      entry => { logger.warn('auth failure %s', JSON.stringify(entry)) },
      entry => { logger.warn('http failure %s', JSON.stringify(entry)) },
      entry => { logger.info('upstream auth %s', JSON.stringify(entry)) },
      entry => { logger.warn('slow api %s', JSON.stringify(entry)) },
    )
    await candidate.start()
    lanGateway = candidate
    const removeTaskSink = taskEventHub.add(candidate)
    return {
      close: async () => {
        if (lanGateway === candidate) lanGateway = undefined
        removeTaskSink()
        await candidate.close()
```

</details>

#### 缺口

- 未核对各远程供应商当前费用和各手机网络的完整运行行为。
  **影响**：不能给出免费承诺、单位成本或可靠性排名。
  **进一步探讨**：只选用户实际需要的一条通道，记录首次配置、持续费用、一次断线恢复及禁用后的可达性。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何用可信手机做有限试用，什么时候退出？

**研究主题**：采用判断

#### 完整回答

建议已有 DSH、确有离开电脑后继续同一会话需要的个人用户在可信局域网试用。先保存电脑侧退路，以一个无重要副作用的任务配对手机，检查消息与待输入项，再从电脑撤销设备，确认手机新请求失败、已有连接结束。之后才考虑远程隧道，而不是一次启用所有连接方式。

试用成功应是同任务可继续且访问可撤销，不能只看二维码或页面能打开。若已撤销仍能操作、网络中断后任务状态不明却被提示重新提交，或所需第三方连接必须大幅放宽允许路径，应停止并回到电脑端，或已有的可信 VPN 网页流程。多人隔离需求不适合靠配对功能解决。该试用路径是源码支持的有条件判断，没有同版宿主验收，不升级为持续安装建议。

#### 证据与依据

**依据 1 · 源码核查**：[src/access.ts:428-439](https://github.com/saya-ch/dsh-mobile/blob/0d5ac46dc961e021f363e85b0ba6d3585682e980/src/access.ts#L428-L439)

设备撤销有持久状态变更。

<details>
<summary>查看原文（12行）</summary>

```text
  /** Durably delete the device, then end every Session owned by that device. */
  async revokeDevice(deviceId: string): Promise<boolean> {
    this.requireInitialized()
    return this.exclusive(async () => {
      const next = this.devices.filter(device => device.id !== deviceId)
      if (next.length === this.devices.length) return false
      await this.store.save(this.snapshot(next))
      this.devices = next
      for (const [key, session] of this.sessions) {
        if (session.deviceId === deviceId) this.removeSession(key, 'revoked')
      }
      return true
```

</details>

**依据 2 · 源码核查**：[src/gateway.ts:1353-1374](https://github.com/saya-ch/dsh-mobile/blob/0d5ac46dc961e021f363e85b0ba6d3585682e980/src/gateway.ts#L1353-L1374)

现有会话资源结束有真实接线。

<details>
<summary>查看原文（22行）</summary>

```text
    this.removeSessionListener = this.access.onSessionEnded((authorization, reason) => {
      for (const view of this.mobileDocumentViews.values()) {
        if (view.sessionKey === authorization.sessionKey) this.removeMobileDocumentView(view)
      }
      if (reason === 'revoked') {
        const cleanup = this.clientModulePreferences.removeDevice(authorization.deviceId)
          .catch(() => { process.emitWarning('Unable to remove revoked device client preferences', { code: 'DSH_MOBILE_PREFERENCE_CLEANUP_FAILED' }) })
        this.clientModuleRevocations.add(cleanup)
        void cleanup.finally(() => this.clientModuleRevocations.delete(cleanup))
        if (!this.pendingDeviceRevocations.has(authorization.deviceId)) {
          this.pendingDeviceRevocations.add(authorization.deviceId)
          this.broadcastDeviceRevoked(authorization.deviceId)
        }
        // Let the final SSE frame enter the socket before revocation closes
        // the session-owned stream and WebSockets.
        setImmediate(() => {
          this.abortSessionResources(authorization.sessionKey)
          this.pendingDeviceRevocations.delete(authorization.deviceId)
        })
      } else {
        this.abortSessionResources(authorization.sessionKey)
      }
```

</details>

**依据 3 · 源码核查**：[src/gateway.ts:3702-3712](https://github.com/saya-ch/dsh-mobile/blob/0d5ac46dc961e021f363e85b0ba6d3585682e980/src/gateway.ts#L3702-L3712)

WS 第三方路径按明确集合放行。

<details>
<summary>查看原文（11行）</summary>

```text
    assertExternalTrust(request, policy, false)
    if (!policy.acceptsOrigin(request.headers.origin)) throw new HttpError(403, 'forbidden')
    // Core DSH paths plus admin-approved third-party plugin paths (exact
    // pathname match; the query string rides along to the upstream plugin,
    // which owns its parsing). Everything else stays 404: paired-device
    // auth, Origin, and handshake checks below still apply to allowed paths.
    const upgradeAllowed = WS_PATHS.has(target.decodedPathname)
      || (this.extraWebSocketPaths?.has(target.decodedPathname) ?? false)
    if (!upgradeAllowed) {
      this.blockedUpgradeLog?.record(target.decodedPathname)
      throw new HttpError(404, 'not_found')
```

</details>

**依据 4 · 源码核查**：[README.md:62-62](https://github.com/saya-ch/dsh-mobile/blob/0d5ac46dc961e021f363e85b0ba6d3585682e980/README.md#L62-L62)

配对设备需完全信任，丢失从电脑撤销。

```text
配对设备可以操作电脑上的 DSH，应视为完全受信任的设备。局域网只在可信网络开启；远程访问应使用可靠的 HTTPS 通道。手机丢失时，请立即从电脑端撤销设备。
```

#### 缺口

- 手机任务端到端成功率和长期版本维护负担未量化。
  **影响**：试用可控不等于收益足以支持长期采用。
  **进一步探讨**：固定一周真实但可恢复任务，记录失败、恢复、撤销与电脑回退次数。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否为断线写操作增加可核对的结果收据？

**研究主题**：新假设与验证

#### 完整回答

由静态资源可重试而写操作不能自动重试的边界，可以推导未验证的操作收据设计。让支持的上游操作携带稳定请求标识并记录最终状态，手机重连先查询收据，再决定是否提交；相对当前纯传输失败提示，增量是降低“已执行还是未执行”的人工判断负担。它需要 DSH 具体业务接口配合，网关独自缓存成功响应不能保证上游副作用与记录原子一致。

最小验证选择一种可回滚或无损任务，分别在上游接收前、执行后响应前断线，对比当前流程与标识查询流程的重复执行数、状态误判和人工确认时间。若无法让状态记录与实际执行一致，或者原会话查询已足够简单、增益抵不过新增状态维护，就否定独立收据组件方向。当前没有实现、真实需求频率或付费意愿证据，不计入现有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[src/gateway.ts:3314-3363](https://github.com/saya-ch/dsh-mobile/blob/0d5ac46dc961e021f363e85b0ba6d3585682e980/src/gateway.ts#L3314-L3363)

重试范围明确缺少业务写入结果查询，是推导依据。

<details>
<summary>查看原文（50行）</summary>

```text
    const replayable = request.method === 'GET'
      && request.headers['transfer-encoding'] === undefined
      && (declared === undefined || Number(declared) === 0)
      && (request.url?.split('?', 1)[0]?.startsWith('/plugins/') === true
        || request.url?.split('?', 1)[0]?.startsWith('/assets/') === true)
    const holder: { request?: ClientRequest } = {}
    const operation = this.allocateRequest(authorization, response, holder)
    documentView?.abortStreams.add(operation.abort)
    const onClose = (): void => {
      if (documentView === undefined) operation.release()
      operation.abort()
    }
    response.once('close', onClose)
    const startedAt = performance.now()
    const latencyPath = boundedApiPath(request.url)
    // The client's wait ends when the response closes: a completed body or an
    // aborted read. Sampling only completed streams would hide the timeouts this
    // diagnostic exists to explain, so the close listener records both.
    if (latencyPath !== undefined) {
      response.once('close', () => {
        this.apiLatency.record({
          method: request.method,
          path: latencyPath,
          status: response.headersSent ? response.statusCode : 0,
          durationMs: performance.now() - startedAt,
        })
      })
    }
    // The HTTP parser accepts no payload without Content-Length or Transfer-Encoding.
    // Draining a bodyless GET once keeps its IncomingMessage out of retry pipelines.
    if (replayable) request.resume()
    try {
      const attempts = replayable ? MOBILE_BOOT_UPSTREAM_ATTEMPTS : 1
      for (let attempt = 1; attempt <= attempts; attempt++) {
        operation.signal.throwIfAborted()
        try {
          await this.proxyHttpOnce(request, response, holder, operation.signal, replayable, documentView)
          return
        } catch (error) {
          if (operation.signal.aborted || response.destroyed) return
          if (response.headersSent) {
            response.destroy()
            return
          }
          if (error instanceof HttpError || !isTransientUpstreamError(error)) {
            throw error instanceof HttpError ? error : new HttpError(502, 'upstream_unavailable')
          }
          if (attempt === attempts) throw new HttpError(502, 'upstream_unavailable')
          await waitForAbortableDelay(MOBILE_BOOT_RETRY_DELAY_MS * attempt, operation.signal)
        }
```

</details>

#### 缺口

- 上游具体接口是否支持幂等标识及原子状态记录。
  **影响**：新增网关状态可能反而制造第二真相源。
  **进一步探讨**：先对一个接口核对执行与状态记录事务，不能满足时停在更清晰的未知结果提示。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
