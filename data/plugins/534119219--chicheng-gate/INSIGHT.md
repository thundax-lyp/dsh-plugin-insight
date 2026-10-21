# chicheng-gate

> 在 DSH Web 管理远程访问、frpc 隧道、面板密码门禁与移动端界面。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[cfee329](https://github.com/534119219/chicheng-gate/tree/cfee329acf7f886749469779259a6a9147a2b190)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-gate)
<!-- END META -->

**使用建议**：仅适合了解DSH远程控制范围、能维护网络的人在隔离环境先检查；先设置密码，验证HTTP和WebSocket都被挡住，再考虑外网，并单独确认加密传输及升级后的补丁恢复。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、流程与依赖](#detail-section-3)
  - [效果、成本与限制](#detail-section-4)
  - [核心贡献与工程亮点](#detail-section-5)
  - [使用判断](#detail-section-6)
  - [能力、流程与成本](#detail-section-7)
  - [工程贡献](#detail-section-8)
  - [核查说明与分析版本](#detail-section-9)
- [未来设计假设（未验证）](#detail-section-10)
- [辅助信息](#detail-section-11)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 场景与替代办法

需要从其他设备访问自用DSH的人，通过面板管理监听范围、隧道和密码登录；交付可访问的Web界面，仍需核查网络与宿主权限。

参照frp+独立反向代理与手工DSH配置；不将frpc协议和密码算法归于插件原创。

<a id="detail-section-3"></a>

### 能力、流程与依赖

lib/index.js包裹HTTP request/upgrade并用scrypt哈希和会话cookie验证非本机来源，另建loopback密码反向代理供frpc转发；修改DSH官方文件的访问与移动端接缝并保留.bak。

- **Host 路由**：密码登录与独立隧道网关。
- **界面**：远程访问/frpc/密码/移动端配置。
- **后台**：frpc进程管理及访问补丁应用恢复。

DSH webServer/connection及官方文件布局，frpc/frps和外部网络；访问控制依赖宿主其他入口是否均通过同一HTTP/upgrade包装。

确认风险→配置密码→开启监听或隧道→下载/拉起frpc→非本机登录→代理到DSH；关闭时停止隧道并恢复补丁，恢复内容须核对。

web bundle及客户端设置，按平台下载frpc或指定路径；修改官方源码超出普通槽位扩展，升级后需重新核查。

<a id="detail-section-4"></a>

### 效果、成本与限制

减少远程访问配置分散，但控制面一旦开放涉及会话、文件与执行权限，能访问不等于获得适当隔离。

首次需frps服务器、密码与网络配置；持续承担公网暴露、证书/网络运维和宿主升级补丁核对。现金为外部服务器等实际开销，未测；人工安全核查不可由GUI开关消除。

集成门禁是否抵消了扩大宿主信任面的代价？源码同时修改trustedHosts和特权接口路径，且applyPatches按字符串改官方文件，revertPatches直接回写旧.bak；宿主升级后关闭开关可能覆盖新的官方内容。frpc校验文件HTTP失败只警告并跳过，缺少匹配行也不终止，不能把“带SHA256”概括为强制校验。cookie构造未设Secure，传输保密也不是插件已证明能力。

<a id="detail-section-5"></a>

### 核心贡献与工程亮点

相对手工配置frpc、反向代理和DSH监听参数，贡献是把网络开关、登录门禁与独立隧道网关放进同一DSH设置流程，使来自loopback的隧道流量也先过密码。scrypt、frpc与反向代理均为既有机制，插件增量在DSH访问接缝及生命周期集成。

scrypt随机盐、timingSafeEqual、会话令牌哈希和独立隧道网关值得借鉴；字符串补丁与旧备份无条件恢复使维护边界脆弱，需要版本守卫和失败关闭。

源码依据：[lib/index.js](https://github.com/534119219/chicheng-gate/blob/cfee329acf7f886749469779259a6a9147a2b190/lib/index.js)、[lib/client.js](https://github.com/534119219/chicheng-gate/blob/cfee329acf7f886749469779259a6a9147a2b190/lib/client.js)、[cordis.patch.yml](https://github.com/534119219/chicheng-gate/blob/cfee329acf7f886749469779259a6a9147a2b190/cordis.patch.yml)、[package.json](https://github.com/534119219/chicheng-gate/blob/cfee329acf7f886749469779259a6a9147a2b190/package.json)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：需要从其他设备访问自用DSH的人，通过面板管理监听范围、隧道和密码登录；交付可访问的Web界面，仍需核查网络与宿主权限。

- **建议**：待验证假设：将宿主接缝转换为按版本/哈希守卫的显式适配层，恢复时仅撤销自己仍匹配的补丁，并让frpc安装校验失败即停止，可降低升级与供应链不确定性。依据是当前.bak恢复与可跳过校验。用官方文件已升级/用户另改/校验404三类输入，验证拒绝覆盖与拒绝运行，同时记录维护多版本适配的人工成本；当前均未实现。

仅适合了解DSH远程控制范围、能维护网络的人在隔离环境先检查；先设置密码，验证HTTP和WebSocket都被挡住，再考虑外网，并单独确认加密传输及升级后的补丁恢复。

**核查状态**：已抽读固定版本源码，未安装、运行目标插件或真实宿主验收。源码可确认密码网关与隧道管理设计；未启动网关、下载frpc或做安全测试，不能据此认定可安全公网部署。未来版本约束假设未验证。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **Host 路由**：密码登录与独立隧道网关。
- **界面**：远程访问/frpc/密码/移动端配置。
- **后台**：frpc进程管理及访问补丁应用恢复。

- **思考**：集成门禁是否抵消了扩大宿主信任面的代价？源码同时修改trustedHosts和特权接口路径，且applyPatches按字符串改官方文件，revertPatches直接回写旧.bak；宿主升级后关闭开关可能覆盖新的官方内容。frpc校验文件HTTP失败只警告并跳过，缺少匹配行也不终止，不能把“带SHA256”概括为强制校验。cookie构造未设Secure，传输保密也不是插件已证明能力。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：相对手工配置frpc、反向代理和DSH监听参数，贡献是把网络开关、登录门禁与独立隧道网关放进同一DSH设置流程，使来自loopback的隧道流量也先过密码。scrypt、frpc与反向代理均为既有机制，插件增量在DSH访问接缝及生命周期集成。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- 版本号：1.0.3；版本日期：2026-08-21（固定提交日期，北京时间；不是包发布日期）。
- 固定版本：[cfee329a](https://github.com/534119219/chicheng-gate/tree/cfee329acf7f886749469779259a6a9147a2b190)；本次截止 2026-10-21T03:00:27Z。
- 已检查：README、package与以上源码路径及固定组件统计。
- 未执行：目标代码、目标测试、安装、真实宿主或第三方服务验证。
- 范围限制：抽读密码/会话、代理、frpc下载校验及源码补丁；未检验完整攻击面、TLS部署或宿主升级恢复。
- 证据边界：源码与作者说明不等于独立效果验证；GitHub/npm指标不证明采用或收益。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：cb7b1616df7884110436a98345594a16e01ef0b1ffbedbc4ffcbd983a3956b04。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1592 | 1397 | 60 | — |
| .md | source | 1 | 122 | — | — | 1528 |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：将宿主接缝转换为按版本/哈希守卫的显式适配层，恢复时仅撤销自己仍匹配的补丁，并让frpc安装校验失败即停止，可降低升级与供应链不确定性。依据是当前.bak恢复与可跳过校验。用官方文件已升级/用户另改/校验404三类输入，验证拒绝覆盖与拒绝运行，同时记录维护多版本适配的人工成本；当前均未实现。

隔离宿主核对所有HTTP/WS入口、无密码拒绝、隧道路径、会话失效、校验下载失败与升级后关开恢复；当前无执行证据。

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/534119219/chicheng-gate/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/534119219/chicheng-gate/issues?q=is%3Aissue+created%3A2026-09-21T03%3A08%3A54.314Z..2026-10-21T03%3A08%3A54.314Z)

暂未获取：近30天关闭。

统计日期：2026-10-21。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
