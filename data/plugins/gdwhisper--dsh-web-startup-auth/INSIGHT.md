# dsh-web-startup-auth

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[354b84c](https://github.com/GDWhisper/dsh-web-startup-auth/tree/354b84cb95a191ce739e86915f0b798bd3e372f7)

<!-- BEGIN META -->
[![GitHub ★ 66](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=66&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/GDWhisper/dsh-web-startup-auth) [![npm 30d 1,822](https://img.shields.io/static/v1?label=npm+30d&message=1%2C822&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-startup-auth) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-startup-auth)
<!-- END META -->

> **功能**：替换 DSH Web 启动器并提供单管理员账号登录、会话认证与设置页

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 支持的增量是把远程管理员登录、全量密钥轮换和设置入口接入原生认证，并用依赖顺序、注册包装、waterfall及resource分发覆盖组合门禁。TLS和密码学来自宿主/标准库，拼图不计安全贡献。

> **主要限制**：[Q03](#research-q03) 凭据读取失败统一当未注册，直接覆写无原子切换；首次注册窗口、回环代理误配、无单会话吊销与紧耦合接管都限制持续采用。静态推导未等同实测攻击，但不支持立即开放公网；需要先修复错误态并做真实覆盖验收。

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
  - [Q01 · 谁需要单管理员远程登录，相对原生token URL和代理增加什么？](#detail-section-11)
  - [Q02 · 凭据和会话怎样接到路由、原生cookie与设置？](#detail-section-12)
  - [Q03 · 什么访问、存储和撤销条件使主要价值失效？](#detail-section-13)
  - [Q04 · 管理员如何评估，成本、失败恢复与退出是什么？](#detail-section-14)
  - [Q05 · 哪些设计可迁移，什么新增方向值得验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：目标是拥有一台可信DSH主机、希望在另一台浏览器持续访问同一工作环境的管理员。原生浏览器凭据入口及Host信任围栏是宿主能力；本插件的增量是用户名/密码注册登录、可调期限的独立签名会话、修改密码/用户名时全量轮换，并把这些状态接进设置页。相对每台浏览器使用启动token URL，它改变了进入流程；相对已有HTTPS反向代理认证或SSH隧道，它减少外置身份服务接线，却引入紧耦合的宿主适配责任，不能普遍认为更安全或更省事。

这是包含startup/auth/client三个入口的原生插件bundle，patch禁用原启动器，提供同名webStartup，再使connection依赖webAuth以等待保护安装。绑定放宽与认证是配套改变，单独开放0.0.0.0不是贡献的合格交付。成功结果应该是远程匿名拿不到受保护HTTP/API/升级通道，合法会话可用，旧会话在轮换后失效，且管理员能恢复。

单文件只存一个username/passwordHash/secret，没有成员、租户、角色或按项目授权。登录后仍操作同一Host能力，不是多人共享平台。拼图是可选装饰，不计入防自动化安全贡献；scrypt、HMAC和TLS不是新密码学，本插件的设计增量在接入顺序和与宿主cookie的衔接。

原生token URL、Host信任围栏与原生cookie由DSH提供；SSH端口转发、HTTPS反向代理认证是直接替代。此bundle负责用户名密码会话与接线，不提供多用户权限隔离。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| remote-web-startup | 非回环/IPv6绑定及TLS配置透传 | 必须与auth配套；schema/宿主需兼容 |
| 单管理员登录 | 账号密码换取独立签名会话 | 首次注册需隔离；没有成员权限 |
| 路由与原生cookie衔接 | 登录后经过宿主准入并保留自身门禁 | 私有接管点变化需验收，原生cookie单独不授权 |
| 账号设置/重置 | 策略调整与全量密钥轮换恢复 | logout不撤销副本，期限变更只对新cookie |
| 可选拼图 | 登录交互装饰 | 非安全防线 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH声明>=0.1.7-rc.1 <0.3.0-0，运行依赖0.2.2-rc.1线 | 必需 | Host/Client与启动接线 | 范围不证明兼容，升级须验收 |
| credentials与真实profile模块实例 | 原生桥接/绑定需要 | 取签名密钥、拓宽实际schema | 密钥缺失不补签；无法拓宽时拒绝扩展host |
| HTTPS与正确Host代理 | 远程敏感流量前提 | 加密与避免误当回环 | HTTP可泄露；Host改成回环可能免登录 |
| 独立凭据文件和本机恢复入口 | 部署前提 | 注册、轮换、恢复 | 读错/损坏不可当可安全重注册 |
| 前端settings slot及构建lib | 设置页特定功能 | 账号与策略管理 | 源码未构建不会改变运行产物 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 隔离 | 管理员备份profile、指定独立凭据，仅回环启动 | 不触真实凭据与公网 |
| 注册 | 回环注册管理员，按需强制本机登录 | 未注册与仅trusted状态不混同 |
| 验收 | 在受控HTTPS网络测匿名/合法/旧会话/仅原生cookie及各路由形态 | 任一解释不清的放行即停 |
| 故障 | 测文件损坏、升级与代理Host变更 | 错误态必须拒绝而非重开注册 |
| 退出 | 关监听、移除bundle并完整重启 | 原生启动器与认证恢复后才决定再开放 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 主机、构建、证书/代理资源，金额未知 | profile隔离、账号和覆盖矩阵 | 无本轮安装耗时 |
| 持续 | 同步scrypt、每次文件读取、证书维护 | 每次宿主升级核对私有表/签名/事件 | 未测吞吐，不等于低负担 |
| 故障 | 重启与恢复停机资源未知 | 凭据修复、secret全量轮换、代理排障 | 单会话不能吊销；错误态未闭合 |
| 退出 | 停止对外访问的业务代价未知 | 移除重启、保管或离线删除凭据 | 热卸载不证明复原；勿在线删文件开注册 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 账号进入 | 注册/登录到双cookie与设置链 | 当前宿主真实浏览器可用 |
| 会话门禁 | 注册包装与共享API双层谓词 | 全表面实测覆盖和升级持续有效 |
| 撤销恢复 | 改账号/CLI轮换使旧自身签名无效 | 单会话副本不能单独撤销 |
| 网络可达 | LAN/IPv6 schema和权威表适配 | 平台socket、TLS、代理部署实际结果 |
| 维护收益 | 将接线组成bundle | 相对SSH/成熟代理的工时与安全收益 |

> **思考**：[Q03](#research-q03) 凭据读取失败统一当未注册，直接覆写无原子切换；首次注册窗口、回环代理误配、无单会话吊销与紧耦合接管都限制持续采用。静态推导未等同实测攻击，但不支持立即开放公网；需要先修复错误态并做真实覆盖验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 支持的增量是把远程管理员登录、全量密钥轮换和设置入口接入原生认证，并用依赖顺序、注册包装、waterfall及resource分发覆盖组合门禁。TLS和密码学来自宿主/标准库，拼图不计安全贡献。

保护顺序、同一授权谓词、多表面适配与fail-closed resource检测值得借鉴；原地私有方法修改、凭据错误混同未注册与非原子文件写入提高维护责任。作者测试有真实事件总线但模拟webServer，不等于网络端到端；统计区分src、入库lib、测试及文档，见 [Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 凭据读取失败统一当未注册，直接覆写无原子切换；首次注册窗口、回环代理误配、无单会话吊销与紧耦合接管都限制持续采用。静态推导未等同实测攻击，但不支持立即开放公网；需要先修复错误态并做真实覆盖验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

采用观察。先离线隔离profile验证凭据错误态与完整访问矩阵，不以包的支持版本范围替代宿主验收。需要远程访问时先用现有SSH/认证代理；关键故障未修复或Host接管不清即停止，见 [Q03](#research-q03)、[Q04](#research-q04)。

这是包含startup/auth/client三个入口的原生插件bundle，patch禁用原启动器，提供同名webStartup，再使connection依赖webAuth以等待保护安装。绑定放宽与认证是配套改变，单独开放0.0.0.0不是贡献的合格交付。成功结果应该是远程匿名拿不到受保护HTTP/API/升级通道，合法会话可用，旧会话在轮换后失效，且管理员能恢复。

单文件只存一个username/passwordHash/secret，没有成员、租户、角色或按项目授权。登录后仍操作同一Host能力，不是多人共享平台。拼图是可选装饰，不计入防自动化安全贡献；scrypt、HMAC和TLS不是新密码学，本插件的设计增量在接入顺序和与宿主cookie的衔接。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码主链可解释，未执行安装、测试或宿主验收。贡献是单管理员远程认证适配；错误态、路由接管和代理/TLS条件阻止当前直接持续暴露，采用observe。

- 已检查：作者 README、包清单、源码路径 README.md、AGENTS.md、package.json、cordis.patch.yml、src/startup.ts、src/auth.ts、src/credential-store.ts、src/ipv6-shim.ts、src/session-limits.ts、src/client/index.tsx、tests/waterfall-integration.spec.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源包核查Host/Client主链、凭据/签名、路由保护、绑定schema与代表测试。未安装运行目标、未独立复核整个宿主、未执行作者测试或攻击/浏览器实验。
- 下一步：后续绑定宿主精确版本，以独立凭据文件测匿名/有效/过期/轮换/仅原生cookie、handler/resource/upgrade、真实Host代理/TLS及损坏写入。当前无实际运行结论。

**分析版本**

- **仓库**：[GDWhisper/dsh-web-startup-auth](https://github.com/GDWhisper/dsh-web-startup-auth)
- **版本号**：0.1.14（[固定提交 354b84c](https://github.com/GDWhisper/dsh-web-startup-auth/tree/354b84cb95a191ce739e86915f0b798bd3e372f7)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设以未注册/有效/错误三态、原子写入和接管清单替代布尔凭据与人工观察哨，可降低升级或存储故障静默放开的机会。以损坏写入、新resource形态和恢复实验验证；若无法观察关键边界或妨碍恢复，则转向外部成熟代理。未实现、未验证。

后续绑定宿主精确版本，以独立凭据文件测匿名/有效/过期/轮换/仅原生cookie、handler/resource/upgrade、真实Host代理/TLS及损坏写入。当前无实际运行结论。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 18 | 2909 | — | — | 69579 |
| .js | source | 13 | 5787 | 4019 | 1843 | — |
| .ts | source | 12 | 4267 | 2447 | 1591 | — |
| .tsx | source | 1 | 1049 | 817 | 195 | — |
| .ts | test | 8 | 3766 | 3011 | 424 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/GDWhisper/dsh-web-startup-auth/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/GDWhisper/dsh-web-startup-auth/issues?q=is%3Aissue+created%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/GDWhisper/dsh-web-startup-auth/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查固定版本远程绑定与单管理员会话的实际增量、接线、安全条件和维护成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要单管理员远程登录，相对原生token URL和代理增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是拥有一台可信DSH主机、希望在另一台浏览器持续访问同一工作环境的管理员。原生浏览器凭据入口及Host信任围栏是宿主能力；本插件的增量是用户名/密码注册登录、可调期限的独立签名会话、修改密码/用户名时全量轮换，并把这些状态接进设置页。相对每台浏览器使用启动token URL，它改变了进入流程；相对已有HTTPS反向代理认证或SSH隧道，它减少外置身份服务接线，却引入紧耦合的宿主适配责任，不能普遍认为更安全或更省事。

这是包含startup/auth/client三个入口的原生插件bundle，patch禁用原启动器，提供同名webStartup，再使connection依赖webAuth以等待保护安装。绑定放宽与认证是配套改变，单独开放0.0.0.0不是贡献的合格交付。成功结果应该是远程匿名拿不到受保护HTTP/API/升级通道，合法会话可用，旧会话在轮换后失效，且管理员能恢复。

单文件只存一个username/passwordHash/secret，没有成员、租户、角色或按项目授权。登录后仍操作同一Host能力，不是多人共享平台。拼图是可选装饰，不计入防自动化安全贡献；scrypt、HMAC和TLS不是新密码学，本插件的设计增量在接入顺序和与宿主cookie的衔接。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-33](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/package.json#L1-L33)

包版本0.1.14与startup/auth/client导出。

<details>
<summary>查看原文（33行）</summary>

```text
{
  "name": "dsh-web-startup-auth",
  "version": "0.1.14",
  "description": "DSH remote-aware web-startup replacement + username/password auth plugin: allows --host 0.0.0.0 when paired with the auth plugin",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./startup": {
      "types": "./lib/types/startup.d.ts",
      "default": "./lib/startup.js"
    },
    "./auth": {
      "types": "./lib/types/auth.d.ts",
      "default": "./lib/auth.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "src",
    "cordis.patch.yml"
  ],
  "scripts": {
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:13-47](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/cordis.patch.yml#L13-L47)

替换启动器并以webAuth注入保证激活顺序。

<details>
<summary>查看原文（35行）</summary>

```text

- id: web-startup
  disabled: true

- id: connection
  # webServer must stay in this list: HostConnectionService.register runs
  # `owner.webServer.register(route)` against the connection row's inject
  # scope, so third-party consumers of `ctx.connection.rpc.handle` /
  # `connection.fetch.register` (e.g. dsh-ntr) fail with `cannot get property
  # "webServer" without inject` when it is dropped (E2E 2026-10-12, the 0.2.1
  # preview stock row [webStartup] has the same gap). webStartup carries the
  # fence authority list the expression below reads: cordis gates
  # ctx.<service> access on inject declarations (ungated access throws at
  # interpolation). webAuth is the ordering red line — this row must not
  # activate before the auth plugin wrapped the webserver's route
  # registration, or the /api routes mount unprotected
  # (docs/agent/auth-mechanics.md「路由保护顺序」). Row inject merges into the
  # connection module's own `inject`; it never replaces it.
  inject: [webServer, webStartup, webAuth]
  config:
    # One expression, both harness eras: on the 0.2.1 line this is verbatim the
    # stock row (upstream deleted resolveLanTrust and reads invocation
    # authorities from webStartup), on the 0.2.0 line it replaces the stock
    # `ctx.webRuntime.trustedHosts` consumption. Either way the list is the
    # remote startup's: --trusted-host values plus the bind-derived LAN/IPv6
    # authorities the stock derivations cannot produce for wildcard binds
    # (issue #35; docs/agent/ipv6-bind.md).
    trustedHosts: !!js ctx.webStartup.trustedHosts

- insert:
    - id: dsh-web-startup-auth
      name: dsh-web-startup-auth

    - id: remote-web-startup
      name: dsh-web-startup-auth/startup
```

</details>

**依据 3 · 源码核查**：[src/credential-store.ts:55-68](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/credential-store.ts#L55-L68)

单一管理员文件状态而非用户/租户模型。

<details>
<summary>查看原文（14行）</summary>

```text
interface CredentialFile {
  /** The configured username. */
  username: string
  /** `salt:hash` where hash = scryptSync(password, salt, 64)` */
  passwordHash: string
  /** Random hex used to sign session cookies. */
  secret: string
  /** When true, loopback requests need a session like every other address. */
  requireLoopbackLogin?: boolean
  /** Admin-selected session lifetime in days (see session-limits.ts). */
  sessionMaxAgeDays?: number
  /** When true, the login endpoint also demands a solved slider puzzle. */
  slideVerification?: boolean
}
```

</details>

**依据 4 · 源码核查**：[src/startup.ts:285-326](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/startup.ts#L285-L326)

绑定扩展能力检测、TLS配对与失败提示。

<details>
<summary>查看原文（42行）</summary>

```text
      program.error(`error: --port must be a number, got ${JSON.stringify(options.port)}`)
    }
    let host: string | undefined
    if (options.host !== undefined) {
      try {
        host = normalizeBindHost(options.host)
      } catch (error) {
        program.error(`error: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
    // The extended host domain rides on the widened schema: on the 0.2.0
    // line that covers IPv6 and concrete-IPv4 literals; on the 0.2.1 line
    // the wildcards are rejected by the stock member too. If the widen
    // failed, only 127.0.0.1 is guaranteed to validate on both eras.
    if (host !== undefined && host !== '127.0.0.1' && !ipv6BindSupported) {
      program.error('error: 当前 dsh 版本不支持扩展的 --host 值（通配 / IPv6 / 具体 IPv4 字面量）：无法扩展 webserver 的 host 配置；请升级 dsh，或改用 --host 127.0.0.1')
    }
    let tls: WebStartupValues['tls']
    if (options.tlsCert !== undefined && options.tlsKey !== undefined) {
      tls = { certFile: options.tlsCert, keyFile: options.tlsKey }
    } else if (options.tlsCert !== undefined || options.tlsKey !== undefined) {
      program.error('error: --tls-cert and --tls-key must be supplied together')
    }
    let publicUrl: string | undefined
    if (options.publicUrl !== undefined) {
      try {
        parsePublicUrl(options.publicUrl, '--public-url')
        publicUrl = options.publicUrl
      } catch (error) {
        program.error(`error: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
    // TLS and --public-url shipped in the same upstream line; on an older
    // harness the rows would ignore the provided values — a TLS flag under a
    // plain-HTTP listener must fail loudly, not silently.
    if ((tls !== undefined || publicUrl !== undefined) && !tlsSupported) {
      program.error('error: 当前 dsh 版本不支持 TLS / --public-url（需要 dsh >= 0.2.1）；请升级 dsh')
    }
    ctx.provide(WEB_STARTUP_SERVICE, {
      openBrowser: options.open,
      ...host !== undefined && { host },
      ...options.port !== undefined && { port: Number(options.port) },
```

</details>

#### 缺口

- 没有独立用户采用或与代理认证/SSH操作对比。
  **影响**：进入流程改善有机制依据，但需求频率与净维护收益未实证。
  **进一步探讨**：以同一管理员任务比较登录、换浏览器、撤销和升级恢复步骤。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 凭据和会话怎样接到路由、原生cookie与设置？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

startup提供host/port/TLS/publicUrl及trustedHosts；ipv6-shim从profile根解析真正参与启动的WebServer实例，再原地拓宽host schema，保留其required等meta，失败时拒绝扩展host值。LAN/IPv6权威列表进入宿主信任围栏，只解决Host准入，不使远程用户免登录。TLS实际监听由宿主完成；旧宿主缺TLS/publicUrl能力时明确报错。

注册POST要求非空用户名和至少8字符密码，归一化用户名后以随机盐scrypt散列，另存32字节随机session secret。凭据文件按DSH_WEB_AUTH_FILE覆盖、其次DSH_HOME、最后用户目录；新文件0600、启动chmod旧文件。dsh_sid包含用户名与到期时间并HMAC签名；每次验证读取文件secret。默认14天、档位3至180天，改期限只影响新签发。登录失败有按socket IP限流与全局退避，内存状态重启失去；反代后的多个用户会共享代理IP预算。

auth先挂/login和自身auth API，再包裹已有/后注册exact、prefix、upgrade与fallback。普通受保护请求先isAuthorized：默认TCP对端和Host均回环可免会话，否则验dsh_sid。页面匿名302，API匿名401，升级请求直接结束401。resource形态不能在Fetch Request层判断socket，所以改守serveResource HTTP分发点；存在resource而分发点不可拦截时抛错拒绝激活。

通过自身认证的访问者仍需宿主原生dsh-auth cookie。插件从credentials服务读取宿主签名密钥，按请求Host/TLS audience补签兼容格式；页面缺该cookie时返回200导航跳板再进入原页。共享API另在connection/request waterfall再次验自身会话，原生cookie单独不能通过。这是两层会话闸门，fallback/upgrade/第三方通道仍主要依赖注册包装，不能把共享API的冗余推广到所有表面。

Client在settings.section登记认证页，通过对应API读状态、退出及修改账号/策略。退出只清客户端两类cookie；改密码/用户名和CLI auth-reset轮换secret，使旧dsh_sid整体失效，当前操作者重新获签。CLI不能首次建号。

#### 证据与依据

**依据 1 · 源码核查**：[src/ipv6-shim.ts:95-153](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/ipv6-shim.ts#L95-L153)

修改实际schema成员并保留meta，profile解析避免错误模块实例。

<details>
<summary>查看原文（59行）</summary>

```text
 * @returns whether the schema now accepts the extended host domain.
 */
export function widenHostMember(schema: LooseObjectSchema): boolean {
  const dict = schema.dict
  const host = dict?.host
  if (isWidenedMember(host)) return true
  if (
    dict === undefined ||
    typeof host !== 'function' ||
    typeof z.union !== 'function' ||
    typeof z.transform !== 'function' ||
    typeof z.ValidationError !== 'function'
  ) {
    return false
  }
  try {
    const widened = z.union([
      host as unknown as LooseSchema,
      // Loose on purpose: `isIPv6` also admits zone and mapped spellings.
      // The CLI (`normalizeBindHost`) is the value gate, and boot validation
      // only ever sees CLI-normalized values.
      z.transform(z.string(), (value, options) => {
        if (!isIPv4(value) && !isIPv6(value)) throw new z.ValidationError('expected an IPv4 or IPv6 literal', options)
        return value
      }),
    ]) as unknown as LooseSchema
    // Carry the member's own meta onto the new union — above all `required`:
    // a fresh union's meta is empty, and a default-less non-required member
    // lets a host-less config validate (the object resolver then drops the
    // key, and listen(port, undefined) binds ALL interfaces). The stock host
    // member is `.required()` on both eras, so the widened one must stay
    // required.
    const meta = Reflect.get(host, 'meta')
    Reflect.set(widened, 'meta', meta !== null && typeof meta === 'object' ? { ...meta } : {})
    Reflect.set(widened, WIDENED, true)
    dict.host = widened
    return true
  } catch {
    return false
  }
}

/**
 * The webserver module instance the boot path validates configs against.
 *
 * A profile root URL resolves the package exactly the way the `webserver`
 * row does (the plugin loader resolves rows from the same base), so the
 * required module is the row's instance. Without a base URL the imported
 * instance is returned — the unit-test path.
 * @param baseUrl - the cordis context's base URL (profile root at boot).
 */
function bootWebServer(baseUrl: string | undefined): LooseWebServer | undefined {
  if (baseUrl === undefined) return WebServer
  try {
    const require = createRequire(new URL('node_modules/.host-schema.cjs', baseUrl))
    const entry = require.resolve(WEBSERVER_PACKAGE)
    const loaded = require(entry) as { WebServer?: LooseWebServer }
    return loaded?.WebServer
  } catch {
```

</details>

**依据 2 · 源码核查**：[src/startup.ts:292-326](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/startup.ts#L292-L326)

CLI能力门禁与webStartup配置提供。

<details>
<summary>查看原文（35行）</summary>

```text
        program.error(`error: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
    // The extended host domain rides on the widened schema: on the 0.2.0
    // line that covers IPv6 and concrete-IPv4 literals; on the 0.2.1 line
    // the wildcards are rejected by the stock member too. If the widen
    // failed, only 127.0.0.1 is guaranteed to validate on both eras.
    if (host !== undefined && host !== '127.0.0.1' && !ipv6BindSupported) {
      program.error('error: 当前 dsh 版本不支持扩展的 --host 值（通配 / IPv6 / 具体 IPv4 字面量）：无法扩展 webserver 的 host 配置；请升级 dsh，或改用 --host 127.0.0.1')
    }
    let tls: WebStartupValues['tls']
    if (options.tlsCert !== undefined && options.tlsKey !== undefined) {
      tls = { certFile: options.tlsCert, keyFile: options.tlsKey }
    } else if (options.tlsCert !== undefined || options.tlsKey !== undefined) {
      program.error('error: --tls-cert and --tls-key must be supplied together')
    }
    let publicUrl: string | undefined
    if (options.publicUrl !== undefined) {
      try {
        parsePublicUrl(options.publicUrl, '--public-url')
        publicUrl = options.publicUrl
      } catch (error) {
        program.error(`error: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
    // TLS and --public-url shipped in the same upstream line; on an older
    // harness the rows would ignore the provided values — a TLS flag under a
    // plain-HTTP listener must fail loudly, not silently.
    if ((tls !== undefined || publicUrl !== undefined) && !tlsSupported) {
      program.error('error: 当前 dsh 版本不支持 TLS / --public-url（需要 dsh >= 0.2.1）；请升级 dsh')
    }
    ctx.provide(WEB_STARTUP_SERVICE, {
      openBrowser: options.open,
      ...host !== undefined && { host },
      ...options.port !== undefined && { port: Number(options.port) },
```

</details>

**依据 3 · 源码核查**：[src/credential-store.ts:43-52](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/credential-store.ts#L43-L52)

凭据路径解析。

<details>
<summary>查看原文（10行）</summary>

```text
 */
function dshHomeDir(): string {
  const fromEnv = process.env.DSH_HOME
  return fromEnv !== undefined && fromEnv.trim().length > 0 ? fromEnv : join(homedir(), '.dsh')
}

/** The persisted credential file (overridable via DSH_WEB_AUTH_FILE for tests). */
function credentialFile(): string {
  return process.env.DSH_WEB_AUTH_FILE ?? join(dshHomeDir(), 'web-auth.json')
}
```

</details>

**依据 4 · 源码核查**：[src/credential-store.ts:71-156](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/credential-store.ts#L71-L156)

盐、secret、scrypt与持久化。

<details>
<summary>查看原文（86行）</summary>

```text
function hashPassword(password: string, salt: string): string {
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

/** Generate a random salt (16 bytes hex). */
function makeSalt(): string {
  return randomBytes(16).toString('hex')
}

/** Generate a random session secret (32 bytes hex). */
function makeSecret(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Read the credential file if it exists.
 * @returns the stored credentials, or `undefined` if not registered.
 */
function readCredentials(): CredentialFile | undefined {
  if (!existsSync(credentialFile())) return undefined
  try {
    return JSON.parse(readFileSync(credentialFile(), 'utf8')) as CredentialFile
  } catch {
    return undefined
  }
}

/** Ensure the credential directory exists (owner-only access). */
function ensureDir(): void {
  const dir = dshHomeDir()
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true, mode: 0o700 })
  }
}

/**
 * Write the credential file (creates the directory if needed).
 *
 * The file is written owner-only (0o600): it holds the scrypt password hash
 * and the session HMAC secret, so group/other readers could crack the
 * password offline or forge session cookies outright.
 * @param data - the credentials to persist.
 */
function writeCredentials(data: CredentialFile): void {
  ensureDir()
  writeFileSync(credentialFile(), JSON.stringify(data, null, 2), { encoding: 'utf8', mode: 0o600 })
}

/**
 * Restrict an existing credential file to owner-only access.
 *
 * Fixes files created by earlier versions that followed the process umask
 * (commonly 0o644), which would let other local users read the session
 * signing secret and forge cookies. No-op when the file does not exist yet.
 */
export function hardenCredentialFilePermissions(): void {
  if (existsSync(credentialFile())) {
    chmodSync(credentialFile(), 0o600)
  }
}

/** Whether a username/password has been registered. */
export function hasCredentials(): boolean {
  return readCredentials() !== undefined
}

/**
 * Register a new username/password. Throws if credentials already exist.
 * @param username - the username.
 * @param password - the password.
 * @returns the newly created secret (for session signing).
 */
export function registerCredentials(username: string, password: string): string {
  if (hasCredentials()) {
    throw new Error('web-auth: credentials already registered')
  }
  const salt = makeSalt()
  const secret = makeSecret()
  const passwordHash = hashPassword(password, salt)
  writeCredentials({ username, passwordHash, secret })
  return secret
}

/**
 * Validate a username/password against the stored credentials.
```

</details>

**依据 5 · 源码核查**：[src/auth.ts:339-397](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/auth.ts#L339-L397)

cookie签名/到期验证。

<details>
<summary>查看原文（59行）</summary>

```text
/** Cookie header string for a session cookie with the configured expiry. */
function sessionCookieSet(value: string, secure: boolean): string {
  const attributes = `${SESSION_COOKIE}=${value}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${getSessionMaxAgeSec()}`
  return secure ? `${attributes}; Secure` : attributes
}

/** Clear the session cookie (carrying `Secure` on a TLS listener, like the set). */
function sessionCookieClear(secure: boolean): string {
  const attributes = `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`
  return secure ? `${attributes}; Secure` : attributes
}

/** Parse the session cookie from a request. */
function parseSessionCookie(req: IncomingMessage): string | undefined {
  const cookie = req.headers.cookie
  if (!cookie) return undefined
  // Simple cookie parser (no full RFC compliance needed for a single cookie)
  const start = cookie.indexOf(SESSION_COOKIE + '=')
  if (start === -1) return undefined
  const valueStart = start + SESSION_COOKIE.length + 1
  const end = cookie.indexOf(';', valueStart)
  return end === -1 ? cookie.slice(valueStart) : cookie.slice(valueStart, end)
}

/** Build a session payload (username + expiry) and sign it. */
function buildSessionCookie(username: string): string | undefined {
  const exp = Math.floor(Date.now() / 1000) + getSessionMaxAgeSec()
  const payload = JSON.stringify({ u: username, e: exp })
  const sig = signSession(payload)
  if (sig === undefined) return undefined
  return `${Buffer.from(payload, 'utf8').toString('base64url')}.${sig}`
}

/** Validate a session cookie and return the username if valid. */
function validateSessionCookie(req: IncomingMessage): string | undefined {
  const raw = parseSessionCookie(req)
  if (!raw) return undefined
  const dot = raw.indexOf('.')
  if (dot === -1) return undefined
  const payloadBase64 = raw.slice(0, dot)
  const sig = raw.slice(dot + 1)
  let payload: string
  try {
    payload = Buffer.from(payloadBase64, 'base64url').toString('utf8')
  } catch {
    return undefined
  }
  if (!verifySession(payload, sig)) return undefined
  let parsed: { u?: string; e?: number }
  try {
    parsed = JSON.parse(payload) as { u?: string; e?: number }
  } catch {
    return undefined
  }
  if (typeof parsed.u !== 'string' || typeof parsed.e !== 'number') return undefined
  // Check expiry
  if (parsed.e < Math.floor(Date.now() / 1000)) return undefined
  return parsed.u
}
```

</details>

**依据 6 · 源码核查**：[src/auth.ts:635-698](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/auth.ts#L635-L698)

从credentials取得原生secret并补签audience cookie。

<details>
<summary>查看原文（64行）</summary>

```text
async function browserAuthSecret(): Promise<Buffer | undefined> {
  const credentials = lookupCredentials?.()
  if (credentials === undefined) return undefined
  const cached = browserSecretCache.get(credentials)
  if (cached !== undefined) return cached
  try {
    const record = await credentials.readRecord(BROWSER_AUTH_RECORD_KEY) as
      | { kind?: unknown; payload?: unknown }
      | undefined
    if (record === undefined || record === null) return undefined
    if (record.kind !== 'grant' || record.payload === null || typeof record.payload !== 'object') {
      return undefined
    }
    const payload = record.payload as { version?: unknown; secret?: unknown }
    if (payload.version !== BROWSER_COOKIE_VERSION || typeof payload.secret !== 'string') {
      return undefined
    }
    const secret = Buffer.from(payload.secret, 'base64url')
    if (secret.length !== BROWSER_SECRET_BYTES) return undefined
    browserSecretCache.set(credentials, secret)
    return secret
  } catch {
    return undefined
  }
}

/**
 * Serialize the native cookie value: `v1.<base64url(payload)>.<base64url(hmac)>`
 * where the HMAC covers the base64url payload string itself — byte-for-byte
 * the format upstream `decodeCookie` expects.
 */
function encodeBrowserCookie(
  payload: { version: number; authority: string; issuedAt: number; expiresAt: number },
  secret: Buffer,
): string {
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  const signature = createHmac('sha256', secret).update(body).digest().toString('base64url')
  return `v1.${body}.${signature}`
}

/** Cookie attributes copied from upstream `sessionCookie`, `; Secure` appended on TLS. */
function browserCookieAttributes(expiresAt: number, secure: boolean): string {
  const attributes = `; Max-Age=${String(BROWSER_COOKIE_MAX_AGE_SEC)}; Path=/; Expires=${new Date(expiresAt).toUTCString()}; HttpOnly; SameSite=Strict`
  return secure ? `${attributes}; Secure` : attributes
}

/**
 * Mint a `Set-Cookie` value for the native browser-auth cookie, bound to the
 * request's own audience. Returns undefined when the audience is missing
 * or the signing secret is not available yet (retry on the next request).
 * @param req - the request whose Host (audience) and TLS listener scope the cookie.
 * @param secure - whether the receiving listener serves TLS.
 */
async function mintBrowserCookie(req: IncomingMessage, secure: boolean): Promise<string | undefined> {
  const secret = await browserAuthSecret()
  if (secret === undefined) return undefined
  const audience = requestAudience(req.headers, secure)
  if (audience === undefined) return undefined
  const issuedAt = Date.now()
  const expiresAt = issuedAt + BROWSER_COOKIE_MAX_AGE_SEC * 1000
  const value = encodeBrowserCookie({ version: BROWSER_COOKIE_VERSION, authority: audience, issuedAt, expiresAt }, secret)
  return `${browserCookieName(audience)}=${value}${browserCookieAttributes(expiresAt, secure)}`
}

```

</details>

**依据 7 · 源码核查**：[src/auth.ts:1419-1466](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/auth.ts#L1419-L1466)

注册包装的授权、补签与路径限制。

<details>
<summary>查看原文（48行）</summary>

```text
    path === '/login' || path === '/oauth/callback' || path.startsWith('/api/auth/')

  /** Wrap a protected request handler with the session check + minting hop. */
  const protect = (handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>) =>
    async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
      if (!isAuthorized(req)) {
        // Send page navigations to the login page; upstream's own
        // unauthenticated index answer is a bare-text 401.
        if ((req.method === 'GET' || req.method === 'HEAD') && isPageNavigation(req)) {
          res.writeHead(302, { location: '/login', 'cache-control': 'no-store' })
          res.end()
          return
        }
        jsonResponse(res, 401, { error: 'unauthorized' })
        return
      }
      const audience = requestAudience(req.headers, secure)
      if (audience !== undefined && readBrowserCookie(req.headers, audience) === undefined &&
          (req.method === 'GET' || req.method === 'HEAD')) {
        const minted = await mintBrowserCookie(req, secure)
        if (minted !== undefined) {
          // Only ever bounce to a path on this origin. An absolute-form
          // request target (`GET http://host/...`, `GET //host/...`) must
          // not turn the mint into an open redirect — the 303 era carried
          // that hole in its Location header, so guard both branches.
          const target = req.url ?? '/'
          const url = target.startsWith('/') && !target.startsWith('//') ? target : '/'
          if (isPageNavigation(req)) {
            // 200 bounce, never a 3xx: see `mintBounceDocument`.
            res.writeHead(200, {
              'content-type': 'text/html; charset=utf-8',
              'cache-control': 'no-store',
              'set-cookie': minted,
            })
            res.end(req.method === 'HEAD' ? undefined : mintBounceDocument(url))
            return
          }
          res.writeHead(303, {
            location: url,
            'cache-control': 'no-store',
            'set-cookie': minted,
          })
          res.end()
          return
        }
      }
      await handler(req, res)
    }
```

</details>

**依据 8 · 源码核查**：[src/auth.ts:1571-1629](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/auth.ts#L1571-L1629)

resource dispatch守卫及注册接线。

<details>
<summary>查看原文（59行）</summary>

```text
  const assertResourceDispatch = (): void => {
    if (typeof tables.serveResource !== 'function') {
      throw new Error(
        'web-auth: this dsh version registers Web resource routes but webServer.serveResource is not interceptable; refusing to run without route protection',
      )
    }
  }

  // ── 4a. Resource-form http dispatch (dsh 0.2.2+) ─────────────────────────
  // In 0.2.2 the SPA fallback (frontend-static) and the client-bundle route
  // (modules' `/plugins`) are resources. Guard before the dispatcher builds
  // its Request, so the node request (and its socket) is still available:
  // named resource routes get the same session boundary as handler routes;
  // the fallback keeps dist assets public and guards only the index paths,
  // exactly like `wrapFallback` above. In-process reads (`readResource`, used
  // by liveshare) never pass here: their caller already admitted the Peer.
  if (typeof tables.serveResource === 'function') {
    const originalServeResource = tables.serveResource.bind(webServer)
    tables.serveResource = async (req, res, target, resource) => {
      const pathname = target.pathname
      const anonymous = matchesNamedRoute(pathname)
        ? isPublicRoute(pathname)
        : (req.method === 'GET' || req.method === 'HEAD') &&
          pathname !== '/' && pathname !== '/index.html'
      if (anonymous) {
        await originalServeResource(req, res, target, resource)
        return
      }
      await protect(() => originalServeResource(req, res, target, resource))(req, res)
    }
  }

  for (const route of tables.exact?.values() ?? []) if (!isResourceRoute(route)) wrapHandler(route)
  for (const route of tables.prefixes?.values() ?? []) if (!isResourceRoute(route)) wrapHandler(route)
  for (const route of tables.upgrades?.values() ?? []) wrapUpgradeHandler(route)
  if (tables.fallback !== undefined) {
    if (isResourceFallback(tables.fallback)) assertResourceDispatch()
    else tables.fallback = wrapFallback(tables.fallback)
  }
  const hasRetroResource = [...(tables.exact?.values() ?? []), ...(tables.prefixes?.values() ?? [])]
    .some(isResourceRoute)
  if (hasRetroResource) assertResourceDispatch()

  // Wrap routes registered from now on.
  webServer.register = (route: RouteLike) => {
    if (isResourceRoute(route)) assertResourceDispatch()
    else wrapHandler(route)
    return originalRegister(route)
  }
  webServer.registerUpgrade = (route: WebUpgradeRoute) => {
    wrapUpgradeHandler(route)
    return originalRegisterUpgrade(route)
  }
  webServer.registerFallback = (fallback: FallbackLike) => {
    if (isResourceFallback(fallback)) {
      assertResourceDispatch()
      return originalRegisterFallback(fallback)
    }
    return originalRegisterFallback(wrapFallback(fallback))
```

</details>

**依据 9 · 源码核查**：[src/auth.ts:1664-1682](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/auth.ts#L1664-L1682)

共享API waterfall与服务提供。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.on('connection/request', async (request, response, next) => {
    if (!isAuthorized(request)) {
      jsonResponse(response, 401, { error: 'unauthorized' })
      return
    }
    await next()
  })

  // ── 5. Provide the auth service ───────────────────────────────────────────
  const service: WebAuthService = {
    authenticate(request) {
      return isAuthorized(request)
    },
  }

  ctx.provide('webAuth', service)
  ctx.logger.info('web-auth: active (bind host %s, tls %s, credentials: %s)',
    bindHost, secure ? 'on' : 'off', hasCredentials() ? 'set' : 'not set')
  void ctx.get(WEB_STARTUP_SERVICE) // ensure injection is satisfied
```

</details>

**依据 10 · 源码核查**：[src/client/index.tsx:1024-1049](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/client/index.tsx#L1024-L1049)

Client设置slot真实接线。

<details>
<summary>查看原文（26行）</summary>

```text
 * Register the auth section once the `settings.section` declaration is on
 * the ledger. The label is a plain string (no locale dependency).
 *
 * Note: 0.1.2 dropped the client-runtime aggregate type and the `slots`
 * Context member is not re-declared by any package we depend on, so the
 * service is read through a narrow structural assertion (cordis proxies the
 * property at runtime; the `inject` set above is what guarantees it).
 * @param ctx - client root context.
 */
export function apply(ctx: Context): void {
  interface SectionSlotRegistrar {
    inject(name: string, supplier: () => unknown): void
    register(
      spec: { name: string; id: string; order: number; label: () => string },
      component: unknown,
    ): unknown
  }
  const slots = (ctx as unknown as { slots?: SectionSlotRegistrar }).slots
  slots?.inject('settings.section', () => slots.register({
    name: 'settings.section',
    id: SECTION_ID,
    order: 100,
    label: () => SECTION_LABEL,
  }, AuthSection))
  installAuthNavIcon()
}
```

</details>

**依据 11 · 源码核查**：[src/auth.ts:954-969](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/auth.ts#L954-L969)

登出只清cookie。

<details>
<summary>查看原文（16行）</summary>

```text
    {
      kind: 'exact',
      path: '/api/auth/logout',
      handler: async (req, res) => {
        // Clear our session cookie, and the native browser-auth cookie for
        // this authority (its name is derivable without the secret). The
        // native cookie alone cannot restore access — our wrapper rejects
        // any request without a valid `dsh_sid` — but clearing it keeps the
        // browser consistent with the signed-out state.
        const cookies = [sessionCookieClear(secure)]
        const nativeClear = clearBrowserCookie(req, secure)
        if (nativeClear !== undefined) cookies.push(nativeClear)
        res.writeHead(200, { 'content-type': 'application/json', 'set-cookie': cookies })
        res.end(JSON.stringify({ ok: true }))
      },
    },
```

</details>

**依据 12 · 源码核查**：[src/credential-store.ts:185-199](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/credential-store.ts#L185-L199)

账号更新轮换secret。

<details>
<summary>查看原文（15行）</summary>

```text
    ...creds,
    username: opts.username ?? creds.username,
    passwordHash: opts.password !== undefined ? hashPassword(opts.password, makeSalt()) : creds.passwordHash,
    secret: makeSecret(),
  })
}

/**
 * Whether loopback requests must also present a session.
 *
 * Defaults to `false` (the historical behavior: a genuine loopback request is
 * implicitly trusted). Persisted next to the credentials because both share
 * one write path and one threat model.
 * @returns the persisted flag; `false` before registration.
 */
```

</details>

#### 缺口

- 未运行真实宿主或验证签名格式与当前宿主实际相同。
  **影响**：源码主链成立不等于所有接口都被覆盖或兼容；作者既往实测不替代本轮运行。
  **进一步探讨**：隔离profile逐测匿名/合法/仅原生cookie/旧会话与HTTP、resource、upgrade、RPC矩阵。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么访问、存储和撤销条件使主要价值失效？

**研究主题**：缺陷与关键质疑

#### 完整回答

首次注册没有预共享凭据，未建号时任何能到达注册端点的人均可成为管理员；应在仅回环监听时完成注册再开放网络。更值得注意的是readCredentials把JSON解析或读取异常统一返回undefined，hasCredentials据此为false，注册用hasCredentials防重。结合直接覆写文件而无原子替换，这意味着损坏/读取失败可能被当成“未注册”，重新开放首次注册逻辑。这是源码可推导的失败边界，本轮未制造文件损坏或证明远程可触发；它足以要求部署者保留离线恢复手段和受控网络，而不是给出公网持续采用结论。

默认免登录同时核对TCP回环与Host回环，外部直连仅伪造Host不足以绕过。反代若在本机连接并把Host写死为127.0.0.1，则两条件同时成立，所有转发用户会被当本机免认证；保留真实Host、配置对应trustedHosts，或启用本机强制登录，是部署关键前提。X-Forwarded-For不用于身份判断。--trusted-host仅过Host围栏，不能用它推断会话授权。

cookie是自包含的签名载荷，无服务端单会话表。退出不吊销泄露副本，修改有效期不缩短旧cookie，恢复依赖账号更新全量secret轮换。明文HTTP暴露密码和cookie，Secure只由实际监听TLS决定，插件没有自行提供TLS加密。反代TLS终止到HTTP时不能臆称后端会自动识别外部HTTPS；需要实际核对cookie和代理策略。

公开路由包含/login、/oauth/callback以及所有/api/auth/前缀；自身敏感auth端点有内部鉴权/当前密码检查，但未来第三方在该前缀注册会被包装层排除，应避免扩展保留前缀。fallback GET/HEAD的静态资产公开只守首页，不能声称每个字节都要登录。原生补签密钥缺失会返回undefined而不关闭自身认证，后续宿主仍可能拒绝，用户会遇到已登录却无法进入的兼容排障。

原地改schema、替换register/serveResource及已挂handler没有看到对应恢复原引用的dispose路径。不能把热卸载等同回到原始Host状态，应停止监听后移除并完整重启。没有证据显示本插件能隔离登录后同一Host上的文件、进程和Agent权限。

#### 证据与依据

**依据 1 · 源码核查**：[src/credential-store.ts:91-118](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/credential-store.ts#L91-L118)

读取错误返回undefined，写入使用直接writeFileSync。

<details>
<summary>查看原文（28行）</summary>

```text
  if (!existsSync(credentialFile())) return undefined
  try {
    return JSON.parse(readFileSync(credentialFile(), 'utf8')) as CredentialFile
  } catch {
    return undefined
  }
}

/** Ensure the credential directory exists (owner-only access). */
function ensureDir(): void {
  const dir = dshHomeDir()
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true, mode: 0o700 })
  }
}

/**
 * Write the credential file (creates the directory if needed).
 *
 * The file is written owner-only (0o600): it holds the scrypt password hash
 * and the session HMAC secret, so group/other readers could crack the
 * password offline or forge session cookies outright.
 * @param data - the credentials to persist.
 */
function writeCredentials(data: CredentialFile): void {
  ensureDir()
  writeFileSync(credentialFile(), JSON.stringify(data, null, 2), { encoding: 'utf8', mode: 0o600 })
}
```

</details>

**依据 2 · 源码核查**：[src/credential-store.ts:135-156](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/credential-store.ts#L135-L156)

hasCredentials与首次注册防重同源。

<details>
<summary>查看原文（22行）</summary>

```text
  return readCredentials() !== undefined
}

/**
 * Register a new username/password. Throws if credentials already exist.
 * @param username - the username.
 * @param password - the password.
 * @returns the newly created secret (for session signing).
 */
export function registerCredentials(username: string, password: string): string {
  if (hasCredentials()) {
    throw new Error('web-auth: credentials already registered')
  }
  const salt = makeSalt()
  const secret = makeSecret()
  const passwordHash = hashPassword(password, salt)
  writeCredentials({ username, passwordHash, secret })
  return secret
}

/**
 * Validate a username/password against the stored credentials.
```

</details>

**依据 3 · 源码核查**：[src/auth.ts:818-847](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/auth.ts#L818-L847)

未注册访问者可创建管理员。

<details>
<summary>查看原文（30行）</summary>

```text
          username,
        })
      },
    },
    {
      kind: 'exact',
      path: '/api/auth/register',
      handler: async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405)
          res.end()
          return
        }
        try {
          const body = await parseBody(req)
          const username = typeof body.username === 'string' ? normalizeUsername(body.username) : ''
          const password = typeof body.password === 'string' ? body.password : ''
          if (!username || !password) {
            jsonResponse(res, 400, { error: '请输入用户名和密码' })
            return
          }
          if (password.length < MIN_PASSWORD_LENGTH) {
            jsonResponse(res, 400, { error: `密码至少 ${MIN_PASSWORD_LENGTH} 个字符` })
            return
          }
          if (hasCredentials()) {
            jsonResponse(res, 400, { error: '管理员账号已设置，不能重复注册' })
            return
          }
          registerCredentials(username, password)
```

</details>

**依据 4 · 源码核查**：[src/auth.ts:489-548](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/auth.ts#L489-L548)

双回环判定及本机强制登录开关。

<details>
<summary>查看原文（60行）</summary>

```text
function isLoopbackAuthority(host: string | undefined): boolean {
  if (host === undefined) return false
  let hostname: string
  try {
    hostname = new URL(`http://${host}`).hostname
  } catch {
    return false
  }
  if (LOOPBACK_HOSTNAMES.includes(hostname)) return true
  const parts = hostname.split('.')
  return parts.length === 4 && parts[0] === '127' &&
    parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255)
}

/**
 * Whether a TCP peer address is a loopback address.
 *
 * Only the socket's own peer address counts. `X-Forwarded-For` and friends are
 * client-supplied headers and are never consulted: a reverse proxy that wants
 * its clients treated as remote has to forward the real `Host`, which is the
 * signal the loopback check below reads.
 * @param address - `req.socket.remoteAddress`, if any.
 * @returns `true` for 127/8 IPv4 (including IPv4-mapped IPv6) and IPv6 loopback.
 */
function isLoopbackRemoteAddress(address: string | undefined): boolean {
  if (address === undefined) return false
  // Node reports IPv4 peers on a dual-stack socket as `::ffff:127.0.0.1`.
  const normalized = address.startsWith('::ffff:') ? address.slice(7) : address
  if (normalized === '::1') return true
  const parts = normalized.split('.')
  return parts.length === 4 && parts[0] === '127' &&
    parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255)
}

/**
 * Whether the request itself is a loopback request, and therefore implicitly
 * trusted without a session.
 *
 * Both halves are required, because each one alone is forgeable or
 * insufficient:
 * - The `Host` header alone is forgeable: an attacker reaching the server over
 *   the LAN can send `Host: 127.0.0.1`. The socket's peer address cannot be
 *   forged by anyone who is not already on the loopback interface.
 * - The peer address alone misses reverse proxies: a proxy on the same host
 *   connects from 127.0.0.1 while its client is remote, so the forwarded
 *   `Host` (the external domain) is what distinguishes that case from a
 *   genuine local browser.
 *
 * A host-local caller that reaches the server over loopback *and* claims a
 * loopback authority is already a local user, so implicit trust is safe.
 * @param req - the incoming HTTP request.
 * @returns `true` when the request needs no session cookie.
 */
function isTrustedOrigin(req: IncomingMessage): boolean {
  // An administrator may require every address — loopback included — to present
  // a session. When the persisted flag is on, loopback is no longer implicitly
  // trusted (the default, flag-off behavior keeps loopback trusted).
  if (getRequireLoopbackLogin()) return false
  return isLoopbackRemoteAddress(req.socket?.remoteAddress) &&
    isLoopbackAuthority(req.headers.host)
```

</details>

**依据 5 · 源码核查**：[src/auth.ts:339-348](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/auth.ts#L339-L348)

Secure由监听TLS传入。

<details>
<summary>查看原文（10行）</summary>

```text
/** Cookie header string for a session cookie with the configured expiry. */
function sessionCookieSet(value: string, secure: boolean): string {
  const attributes = `${SESSION_COOKIE}=${value}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${getSessionMaxAgeSec()}`
  return secure ? `${attributes}; Secure` : attributes
}

/** Clear the session cookie (carrying `Secure` on a TLS listener, like the set). */
function sessionCookieClear(secure: boolean): string {
  const attributes = `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`
  return secure ? `${attributes}; Secure` : attributes
```

</details>

**依据 6 · 源码核查**：[src/credential-store.ts:275-310](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/credential-store.ts#L275-L310)

会话期限只作用新cookie。

<details>
<summary>查看原文（36行）</summary>

```text
 * Persist the session lifetime.
 * @param days - the new lifetime in days (must be a selectable choice).
 * @throws when `days` is not one of the selectable choices, or when no
 * credentials exist yet.
 */
export function setSessionMaxAgeDays(days: number): void {
  if (!isValidSessionMaxAgeDays(days)) {
    throw new Error(`web-auth: session lifetime must be one of ${SESSION_MAX_AGE_CHOICES.join('/')}`)
  }
  const creds = readCredentials()
  if (creds === undefined) {
    throw new Error('web-auth: register an administrator before changing the session lifetime')
  }
  if (getSessionMaxAgeDays() === days) return
  writeCredentials({ ...creds, sessionMaxAgeDays: days })
}

/**
 * Replace the stored password (keeps the username).
 *
 * Also rotates the session signing secret, which invalidates every already
 * issued session cookie — resetting a forgotten password therefore signs the
 * previous administrator out everywhere at once.
 * @param newPassword - the replacement password.
 * @throws when no credentials exist yet.
 */
export function resetPassword(newPassword: string): void {
  updateCredentials({ password: newPassword })
}

/**
 * Change the stored password after verifying the old one.
 *
 * Rotates the session signing secret (like {@link resetPassword}), which
 * invalidates every already-issued session cookie — the caller must re-issue
 * a fresh session for the authenticated user.
```

</details>

**依据 7 · 源码核查**：[src/auth.ts:1418-1424](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/auth.ts#L1418-L1424)

公开前缀例外。

```text
  const isPublicRoute = (path: string): boolean =>
    path === '/login' || path === '/oauth/callback' || path.startsWith('/api/auth/')

  /** Wrap a protected request handler with the session check + minting hop. */
  const protect = (handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>) =>
    async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
      if (!isAuthorized(req)) {
```

**依据 8 · 源码核查**：[src/auth.ts:1470-1498](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/auth.ts#L1470-L1498)

静态fallback例外。

<details>
<summary>查看原文（29行）</summary>

```text
   * the SPA index AND the static assets next to it. Only the index paths
   * stay guarded; every other fallback path is a public build artifact
   * (favicon.svg, bundled JS/CSS/...), and the login page itself references
   * `/favicon.svg`, which would render as a broken image behind a 401.
   * Unparseable request targets keep the full guard.
   */
  const wrapFallback = (handler: WebRoute['handler']): WebRoute['handler'] => {
    if (wrappedFallbacks.has(handler)) return handler
    wrappedFallbacks.add(handler)
    const guarded = protect(handler)
    return async (req, res) => {
      let pathname: string
      try {
        pathname = new URL(req.url ?? '/', 'http://x').pathname
      } catch {
        await guarded(req, res)
        return
      }
      if ((req.method === 'GET' || req.method === 'HEAD') &&
          pathname !== '/' && pathname !== '/index.html') {
        await handler(req, res)
        return
      }
      await guarded(req, res)
    }
  }

  const wrapHandler = (route: WebRoute): void => {
    if (wrappedHandlers.has(route) || isPublicRoute(route.path)) return
```

</details>

**依据 9 · 源码核查**：[src/auth.ts:1587-1629](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/auth.ts#L1587-L1629)

原位替换分发和注册方法，无此段复原。

<details>
<summary>查看原文（43行）</summary>

```text
  if (typeof tables.serveResource === 'function') {
    const originalServeResource = tables.serveResource.bind(webServer)
    tables.serveResource = async (req, res, target, resource) => {
      const pathname = target.pathname
      const anonymous = matchesNamedRoute(pathname)
        ? isPublicRoute(pathname)
        : (req.method === 'GET' || req.method === 'HEAD') &&
          pathname !== '/' && pathname !== '/index.html'
      if (anonymous) {
        await originalServeResource(req, res, target, resource)
        return
      }
      await protect(() => originalServeResource(req, res, target, resource))(req, res)
    }
  }

  for (const route of tables.exact?.values() ?? []) if (!isResourceRoute(route)) wrapHandler(route)
  for (const route of tables.prefixes?.values() ?? []) if (!isResourceRoute(route)) wrapHandler(route)
  for (const route of tables.upgrades?.values() ?? []) wrapUpgradeHandler(route)
  if (tables.fallback !== undefined) {
    if (isResourceFallback(tables.fallback)) assertResourceDispatch()
    else tables.fallback = wrapFallback(tables.fallback)
  }
  const hasRetroResource = [...(tables.exact?.values() ?? []), ...(tables.prefixes?.values() ?? [])]
    .some(isResourceRoute)
  if (hasRetroResource) assertResourceDispatch()

  // Wrap routes registered from now on.
  webServer.register = (route: RouteLike) => {
    if (isResourceRoute(route)) assertResourceDispatch()
    else wrapHandler(route)
    return originalRegister(route)
  }
  webServer.registerUpgrade = (route: WebUpgradeRoute) => {
    wrapUpgradeHandler(route)
    return originalRegisterUpgrade(route)
  }
  webServer.registerFallback = (fallback: FallbackLike) => {
    if (isResourceFallback(fallback)) {
      assertResourceDispatch()
      return originalRegisterFallback(fallback)
    }
    return originalRegisterFallback(wrapFallback(fallback))
```

</details>

#### 缺口

- 文件损坏重新注册是静态路径推导，未运行；代理/TLS/资源路由覆盖也未宿主验收。
  **影响**：主要风险应作为采用前待核查的条件，不能写已复现攻击或已完成安全审计。
  **进一步探讨**：隔离凭据文件模拟损坏与写入中断，预期应拒绝服务而不回到注册；验证修复后再考虑暴露。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 管理员如何评估，成本、失败恢复与退出是什么？

**研究主题**：采用判断、效果与总成本

#### 完整回答

当前建议观察，先在隔离profile做本地验收，不直接把它作为互联网服务的认证边界。包声明dsh >=0.1.7-rc.1且<0.3.0-0，运行依赖已对齐0.2.2-rc.1；这只是声明范围，范围内新版本仍可能改变私有字段、路由resource形态和原生cookie。源码安装需要构建，因为exports加载lib；Git带构建产物不能当本轮重现通过。

准备时备份profile，使用独立DSH_HOME/凭据文件，保留本机CLI恢复入口。仅回环启动，先注册，再根据共享主机场景选择强制本机登录；核对真实登录身份与仅本机trusted状态的区别。随后在受控网络使用HTTPS并配置真实Host，逐一验证匿名首页/API/resource/upgrade拒绝、合法会话可达、单独原生cookie被拒，以及改密码后旧dsh_sid失效。文件异常不能当未注册自动继续，出现此行为应停止并修复。

持续成本是每次宿主升级重做cookie格式、route表、serveResource和waterfall接线观察哨，管理证书/域名/代理与管理员恢复，以及scrypt同步计算和文件读取负载。代码里的每IP及全局退避降低尝试压力，但不是多实例共享限流，不能据此估算高并发防护。无授权费记录，现金支出和配置工时未知，不记0；未测出节约运营成本。

退出先关闭对外监听，再移除bundle并重启，核对原启动器和原生认证恢复。已有凭据文件和浏览器cookie是额外持久状态；不应在服务仍可达时直接删凭据来“清理”，否则再次打开首次注册。认证恢复不删除DSH会话历史，也不意味着已阻止曾经授权的Agent动作。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:42-68](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/package.json#L42-L68)

运行依赖、宿主peer范围与构建脚本。

<details>
<summary>查看原文（27行）</summary>

```text
    "@deepseek-ai/dsh-cmdline": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-host-webserver": "^0.2.2-rc.1",
    "@deepseek-ai/schemastery": "^3.18.1",
    "commander": "^15.0.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh": ">=0.1.7-rc.1 <0.3.0-0",
    "react": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh": {
      "optional": true
    }
  },
  "devDependencies": {
    "@deepseek-ai/dsh-client-ui-settings": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-slots": "^0.2.2-rc.1",
    "@types/node": "^26.0.0",
    "@types/react": "^18.3.1",
    "react": "^18.2.0",
    "tsdown": "^0.23.0",
    "typescript": "^6.0.3",
    "vitest": "^5.0.0"
  },
  "dsh": {
    "bundle": {
```

</details>

**依据 2 · 源码核查**：[src/startup.ts:235-269](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/startup.ts#L235-L269)

CLI要求已有账号并轮换secret的恢复链。

<details>
<summary>查看原文（35行）</summary>

```text
  if (password === undefined && username === undefined) {
    password = await promptNewPassword()
  }
  if (password !== undefined && password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`密码至少 ${MIN_PASSWORD_LENGTH} 个字符`)
  }
  updateCredentials({
    ...username !== undefined && { username },
    ...password !== undefined && { password },
  })
  const parts: string[] = []
  if (username !== undefined) parts.push('管理员用户名已更新')
  if (password !== undefined) parts.push('管理员密码已重置')
  return `${parts.join('，')}，所有现有会话已失效`
}

/**
 * Read the cordis context's base URL (the profile root at boot), the base
 * from which the `webserver` row resolves the package whose schema the boot
 * path validates against.
 * @param ctx - plugin context carrying the command line.
 */
function ctxBaseUrl(ctx: Context): string | undefined {
  if ('baseUrl' in ctx) {
    const base = ctx.baseUrl
    if (typeof base === 'string') return base
  }
  return undefined
}

/**
 * Parse and provide the Web invocation. Unlike the stock web-startup, this
 * does NOT reject the wildcard hosts; remote security is the auth plugin's
 * job. IPv6 literals and concrete IPv4 literals pass too — the stock
 * webserver schema is widened in place here, before the `webserver` row
```

</details>

**依据 3 · 源码核查**：[src/auth.ts:794-817](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/auth.ts#L794-L817)

会话登录与回环信任在状态中分开表达。

<details>
<summary>查看原文（24行）</summary>

```text
  const authEndpoints: WebRoute[] = [
    {
      kind: 'exact',
      path: '/api/auth/status',
      handler: async (req, res) => {
        const registered = hasCredentials()
        // Two independent facts, because `authenticated` alone cannot express
        // them: does this caller *hold* a session, and is it merely waved
        // through by loopback trust? A local browser on a default deployment
        // is trusted without any cookie, so it is authorized but not signed
        // in — "退出登录" has nothing to revoke there, and the tab has to say
        // so instead of showing a signed-in identity.
        const session = validateSessionCookie(req)
        const trusted = isTrustedOrigin(req)
        const authenticated = session !== undefined || trusted
        // A session names its own user. A trusted caller holding none gets the
        // stored admin name — that is the account that exists, not an identity
        // this caller proved.
        const username = session ?? (trusted ? getUsername() : undefined)
        jsonResponse(res, 200, {
          registered,
          authenticated,
          session: session !== undefined,
          trusted,
```

</details>

**依据 4 · 源码核查**：[src/auth.ts:1120-1160](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/auth.ts#L1120-L1160)

强制本机登录需授权且禁止无账号开启。

<details>
<summary>查看原文（41行）</summary>

```text
        // Reading and flipping the switch requires an authenticated caller,
        // mirroring change-password: a session cookie for a remote caller,
        // or the implicit trust of a genuine loopback request while the
        // switch itself is still off.
        try {
          if (!isAuthorized(req)) {
            jsonResponse(res, 401, { error: '未登录或会话已过期' })
            return
          }
          if (req.method === 'GET') {
            jsonResponse(res, 200, { requireLoopbackLogin: getRequireLoopbackLogin() })
            return
          }
          if (req.method !== 'POST') {
            res.writeHead(405)
            res.end()
            return
          }
          const body = await parseBody(req)
          const requireLoopbackLogin = body.requireLoopbackLogin
          if (typeof requireLoopbackLogin !== 'boolean') {
            jsonResponse(res, 400, { error: 'requireLoopbackLogin 必须为布尔值' })
            return
          }
          try {
            setRequireLoopbackLogin(requireLoopbackLogin)
          } catch (error) {
            // Enabling before any admin exists would lock out every caller
            // (loopback included): there would be no account to log into.
            ctx.logger.warn('web-auth: policy update failed: %s', error instanceof Error ? error.message : String(error))
            jsonResponse(res, 400, { error: '请先注册管理员账号，再开启强制登录' })
            return
          }
          ctx.logger.info('web-auth: requireLoopbackLogin set to %s (from %s)', requireLoopbackLogin, clientIp(req) ?? 'unknown')
          jsonResponse(res, 200, { ok: true, requireLoopbackLogin })
        } catch (error) {
          if (isBodyTooLarge(error)) {
            jsonResponse(res, 413, { error: '请求体过大' })
            return
          }
          ctx.logger.warn('web-auth: policy endpoint failed: %s', error instanceof Error ? error.message : String(error))
```

</details>

**依据 5 · 源码核查**：[src/auth.ts:229-337](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/auth.ts#L229-L337)

内存限流、全局上限与成功不清全局压力。

<details>
<summary>查看原文（109行）</summary>

```text
function isLockedOut(req: IncomingMessage): boolean {
  const entry = loginFailures.get(clientIp(req) ?? '')
  return entry?.lockedUntil !== undefined && entry.lockedUntil > Date.now()
}

/**
 * The global penalty for a given aggregate failure count: zero up to the free
 * allowance, then doubling per step, capped.
 * @param failures - failures recorded in the current window.
 * @returns the penalty in milliseconds.
 */
function globalBackoffMs(failures: number): number {
  if (failures < GLOBAL_FREE_FAILURES) return 0
  const step = Math.floor((failures - GLOBAL_FREE_FAILURES) / GLOBAL_FAILURES_PER_STEP)
  return Math.min(GLOBAL_BACKOFF_MAX_MS, GLOBAL_BACKOFF_BASE_MS * 2 ** step)
}

/**
 * Whether the caller is exempt from the **global** penalty.
 *
 * A genuine loopback caller — peer address *and* `Host` both loopback, with the
 * loopback-login switch off — is already authorized without logging in, so
 * penalizing it protects nothing and would hand an attacker a way to lock the
 * administrator out of their own machine. With the switch on, loopback is
 * treated like any other address and the penalty applies.
 * @param req - the incoming request.
 * @returns `true` when the global penalty must not apply.
 */
function isGlobalLockoutExempt(req: IncomingMessage): boolean {
  return isTrustedOrigin(req)
}

/**
 * Whether the aggregate failure pressure currently blocks this caller.
 * @param req - the incoming request.
 * @returns `true` when the caller must wait.
 */
function isGloballyLockedOut(req: IncomingMessage): boolean {
  if (globalLockedUntil <= Date.now()) return false
  return !isGlobalLockoutExempt(req)
}

/**
 * Milliseconds until this caller may retry, for the `Retry-After` header.
 * @param req - the incoming request.
 * @returns whole seconds, or `undefined` when nothing is blocking.
 */
function retryAfterSeconds(req: IncomingMessage): number | undefined {
  const now = Date.now()
  const local = loginFailures.get(clientIp(req) ?? '')?.lockedUntil ?? 0
  const until = Math.max(local, isGlobalLockoutExempt(req) ? 0 : globalLockedUntil)
  if (until <= now) return undefined
  return Math.max(1, Math.ceil((until - now) / 1000))
}

/** Record a failed login; locks the client out after repeated failures. */
function recordLoginFailure(req: IncomingMessage): void {
  const now = Date.now()
  // Aggregate pressure first: it applies even when the peer address is
  // unreadable, which is exactly the case a per-client map cannot cover.
  if (globalFailures === undefined || now - globalFailures.firstAt > GLOBAL_FAILURE_WINDOW_MS) {
    globalFailures = { count: 1, firstAt: now }
  } else {
    globalFailures.count += 1
  }
  const penalty = globalBackoffMs(globalFailures.count)
  if (penalty > 0) globalLockedUntil = now + penalty

  const ip = clientIp(req)
  if (ip === undefined) return
  const entry = loginFailures.get(ip)
  if (entry === undefined || now - entry.firstAt > FAILURE_TRACKING_WINDOW_MS) {
    loginFailures.set(ip, { count: 1, firstAt: now })
    return
  }
  entry.count += 1
  if (entry.count >= MAX_LOGIN_FAILURES) {
    entry.lockedUntil = now + LOCKOUT_MS
  }
}

/** Clear the failure state after a successful login. */
function recordLoginSuccess(req: IncomingMessage): void {
  const ip = clientIp(req)
  if (ip !== undefined) loginFailures.delete(ip)
  // Deliberately does NOT clear `globalFailures`: one administrator getting in
  // does not mean the aggregate pressure ended, and a successful login is
  // something only a holder of the password can produce. The counter decays by
  // window instead, and the penalty is capped, so this cannot strand anyone.
}

/**
 * Drop stale failure entries so the tracking map cannot grow without bound
 * when attackers spoof socket addresses from many sources.
 */
function pruneLoginFailures(now = Date.now()): void {
  if (globalFailures !== undefined && now - globalFailures.firstAt > GLOBAL_FAILURE_WINDOW_MS) {
    globalFailures = undefined
    globalLockedUntil = 0
  }
  if (loginFailures.size < 1024) return
  for (const [ip, entry] of loginFailures) {
    if (now - entry.firstAt > FAILURE_TRACKING_WINDOW_MS) {
      loginFailures.delete(ip)
    } else if (entry.lockedUntil !== undefined && entry.lockedUntil < now) {
      loginFailures.delete(ip)
    }
  }
}
```

</details>

**依据 6 · 源码核查**：[src/auth.ts:1398-1404](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/auth.ts#L1398-L1404)

保留原方法但随后原地包裹，退出需完整重启。

```text
  const originalRegister = webServer.register.bind(webServer)
  const originalRegisterUpgrade = webServer.registerUpgrade.bind(webServer)
  const originalRegisterFallback = webServer.registerFallback.bind(webServer)
  const wrappedHandlers = new WeakSet<WebRoute>()
  const wrappedUpgrades = new WeakSet<WebUpgradeRoute>()
  const wrappedFallbacks = new WeakSet<WebRoute['handler']>()
  /**
```

#### 缺口

- 没有同版本安装/卸载、证书、代理或吞吐实测。
  **影响**：持续使用负担和安全覆盖尚未获验收，不能升级install。
  **进一步探讨**：完成前述矩阵，保存版本/配置/响应状态及退出证据；有任一未解释放行就停止。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些设计可迁移，什么新增方向值得验证？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

工程亮点是保护顺序用服务依赖表达，注册层默认拒绝与官方waterfall互备，并为0.2.2 resource移到仍有TCP信息的HTTP分发点，缺关键分发接口时拒绝激活。schema widening保留required和解析profile真实模块实例，也说明“单测改到了另一个模块副本”并不能证明实际启动受控。这里有可迁移的接入教训，但不是独立可移植安全库；仍大量依赖宿主内部可变表和cookie格式。

tests/waterfall-integration使用真实Cordis事件总线和模拟webServer，覆盖无session阻断、有session/真回环放行及HTTPS模式。这比直接调用一个函数更接近扩展点语义，但没有真实网络、反代、浏览器和宿主原始认证栈；本轮只读测试，没有执行，作者文档中的历史通过次数也不作为本轮结果。src与lib均入库，统计要区分源码、构建、测试和文档，不能合计为原创实现规模。拼图的视觉变体不改变其装饰性质。

值得验证的新方向是“凭据状态严格分离＋访问覆盖回执”：把未注册、有效、不可读/损坏分成状态，错误态拒绝注册和访问；原子写入并保留恢复日志；启动时输出受保护路由、公开例外、resource与upgrade门禁是否接管的机器可核对清单。相对目前hasCredentials布尔和维护者人工观察哨，它把安全前提变成可验收状态。最小验证在隔离profile注入损坏/截断写入及新路由形态，确认不会开放注册、未接管表面拒绝启动，同时正常恢复不丢管理员配置。若这些检查仍依赖不可观察的上游私有行为或导致正常升级无法恢复，就应推翻此方案并优先依赖外部成熟认证代理。该方向未在本版实现，不计入已有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[src/auth.ts:1571-1580](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/auth.ts#L1571-L1580)

resource不能接管时拒绝激活。

<details>
<summary>查看原文（10行）</summary>

```text
  const assertResourceDispatch = (): void => {
    if (typeof tables.serveResource !== 'function') {
      throw new Error(
        'web-auth: this dsh version registers Web resource routes but webServer.serveResource is not interceptable; refusing to run without route protection',
      )
    }
  }

  // ── 4a. Resource-form http dispatch (dsh 0.2.2+) ─────────────────────────
  // In 0.2.2 the SPA fallback (frontend-static) and the client-bundle route
```

</details>

**依据 2 · 源码核查**：[src/ipv6-shim.ts:123-153](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/ipv6-shim.ts#L123-L153)

保留required元数据并解析profile启动实例。

<details>
<summary>查看原文（31行）</summary>

```text
    // lets a host-less config validate (the object resolver then drops the
    // key, and listen(port, undefined) binds ALL interfaces). The stock host
    // member is `.required()` on both eras, so the widened one must stay
    // required.
    const meta = Reflect.get(host, 'meta')
    Reflect.set(widened, 'meta', meta !== null && typeof meta === 'object' ? { ...meta } : {})
    Reflect.set(widened, WIDENED, true)
    dict.host = widened
    return true
  } catch {
    return false
  }
}

/**
 * The webserver module instance the boot path validates configs against.
 *
 * A profile root URL resolves the package exactly the way the `webserver`
 * row does (the plugin loader resolves rows from the same base), so the
 * required module is the row's instance. Without a base URL the imported
 * instance is returned — the unit-test path.
 * @param baseUrl - the cordis context's base URL (profile root at boot).
 */
function bootWebServer(baseUrl: string | undefined): LooseWebServer | undefined {
  if (baseUrl === undefined) return WebServer
  try {
    const require = createRequire(new URL('node_modules/.host-schema.cjs', baseUrl))
    const entry = require.resolve(WEBSERVER_PACKAGE)
    const loaded = require(entry) as { WebServer?: LooseWebServer }
    return loaded?.WebServer
  } catch {
```

</details>

**依据 3 · 源码核查**：[tests/waterfall-integration.spec.ts:11-50](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/tests/waterfall-integration.spec.ts#L11-L50)

真实事件总线、模拟webServer的测试边界。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * Integration tests for the shared-API session gate on the REAL cordis events
 * bus. The unit tests in auth.spec.ts call the listener function directly;
 * these prove the two properties that only a real bus can show: a listener
 * registered on the plugin's own context receives the `connection/request`
 * waterfall a foreign context dispatches (one shared EventsService per tree),
 * and a veto (no `next()` call) really stops the chain tail — the bridge —
 * from running.
 */

interface Harness {
  ctx: Context
  dispatch: (req: IncomingMessage, res: ServerResponse) => Promise<void>
  bridged: () => boolean
}

function harness(protocol?: string): Harness {
  const ctx = new Context()
  const routes: WebRoute[] = []
  const webServer = {
    host: '0.0.0.0',
    port: 3080,
    ...protocol !== undefined && { protocol },
    exact: new Map<string, WebRoute>(),
    prefixes: new Map<string, WebRoute>(),
    upgrades: new Map<string, unknown>(),
    fallback: undefined as WebRoute['handler'] | undefined,
    register: (route: WebRoute) => {
      routes.push(route)
      const table = route.kind === 'exact' ? webServer.exact : webServer.prefixes
      table.set(route.path, route)
      return () => {}
    },
    registerUpgrade: () => () => {},
    registerFallback: () => () => {},
    tapIndex: () => {},
  }
  ;(ctx as unknown as { provide: (key: string, value: unknown) => void }).provide('webServer', webServer)
  apply(ctx, {})

```

</details>

**依据 4 · 源码核查**：[tests/waterfall-integration.spec.ts:101-141](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/tests/waterfall-integration.spec.ts#L101-L141)

作者测试用例覆盖阻断和合法路径，未在本轮运行。

<details>
<summary>查看原文（41行）</summary>

```text
describe('connection/request waterfall on the real events bus', () => {
  it('vetoes a session-less request so the bridge never runs', async () => {
    const h = harness()
    const { captured, res } = responseCapture()
    await h.dispatch(request(), res)
    expect(h.bridged()).toBe(false)
    expect(captured.statusCode).toBe(401)
    expect(JSON.parse(captured.body)).toEqual({ error: 'unauthorized' })
  })

  it('reaches the bridge with a live session', async () => {
    registerCredentials('admin', 'secret1')
    const h = harness()
    const { captured, res } = responseCapture()
    await h.dispatch(request({ cookie: sessionCookie('admin') }), res)
    expect(h.bridged()).toBe(true)
    expect(captured.statusCode).toBe(0)
  })

  it('reaches the bridge from a genuine loopback caller', async () => {
    const h = harness()
    const { captured, res } = responseCapture()
    await h.dispatch(request({ ip: '127.0.0.1', host: '127.0.0.1:3080' }), res)
    expect(h.bridged()).toBe(true)
    expect(captured.statusCode).toBe(0)
  })

  it('applies the same gate on an https listener', async () => {
    registerCredentials('admin', 'secret1')
    const h = harness('https:')
    const denied = responseCapture()
    await h.dispatch(request(), denied.res)
    expect(h.bridged()).toBe(false)
    expect(denied.captured.statusCode).toBe(401)

    const allowed = responseCapture()
    await h.dispatch(request({ cookie: sessionCookie('admin') }), allowed.res)
    expect(h.bridged()).toBe(true)
    expect(allowed.captured.statusCode).toBe(0)
  })
})
```

</details>

**依据 5 · 源码核查**：[src/credential-store.ts:91-118](https://github.com/GDWhisper/dsh-web-startup-auth/blob/354b84cb95a191ce739e86915f0b798bd3e372f7/src/credential-store.ts#L91-L118)

推导错误态分离和原子写入方向的现有机制。

<details>
<summary>查看原文（28行）</summary>

```text
  if (!existsSync(credentialFile())) return undefined
  try {
    return JSON.parse(readFileSync(credentialFile(), 'utf8')) as CredentialFile
  } catch {
    return undefined
  }
}

/** Ensure the credential directory exists (owner-only access). */
function ensureDir(): void {
  const dir = dshHomeDir()
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true, mode: 0o700 })
  }
}

/**
 * Write the credential file (creates the directory if needed).
 *
 * The file is written owner-only (0o600): it holds the scrypt password hash
 * and the session HMAC secret, so group/other readers could crack the
 * password offline or forge session cookies outright.
 * @param data - the credentials to persist.
 */
function writeCredentials(data: CredentialFile): void {
  ensureDir()
  writeFileSync(credentialFile(), JSON.stringify(data, null, 2), { encoding: 'utf8', mode: 0o600 })
}
```

</details>

#### 缺口

- 新状态模型与接管清单未实现，旧安全文档中的上游源码不在本项完整核查范围。
  **影响**：不能给出安全认证或量化攻击抵抗效果。
  **进一步探讨**：固定宿主版本进行故障注入和真实HTTP覆盖验收，与外部代理方案对照。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
