# chicheng-gate

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[cfee329](https://github.com/534119219/chicheng-gate/tree/cfee329acf7f886749469779259a6a9147a2b190)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/534119219/chicheng-gate)
<!-- END META -->

> **功能**：以密码门禁、反向代理和 frpc 隧道把 DSH 暴露到远端。

> **亮点**：把门禁、反代和隧道生命周期整合，降低远程接入步骤；同时也把宿主高权限能力置于新的网络边界。 详见[Q03](#research-q03)。

> **主要限制**：远端认证成功后近似完整控制；源码补丁随宿主升级易漂移，下载运行 frpc 又增加二进制供应链与公网攻击面。 详见[Q04](#research-q04)。

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
  - [Q01 · 场景：目标是手机或公网远程访问完整 DSH？](#detail-section-11)
  - [Q02 · 机制：插件补丁修改三个官方源点，放宽 trustedHosts/privileged methods，经 scrypt 密码、cookie、限速和 HTTP/WS/SSE 反代接入，可拉起 frpc。？](#detail-section-12)
  - [Q03 · 贡献：把门禁、反代和隧道生命周期整合，降低远程接入步骤？](#detail-section-13)
  - [Q04 · 局限：远端认证成功后近似完整控制？](#detail-section-14)
  - [Q05 · 依赖：依赖精确宿主源码结构、可写安装目录、密码/会话密钥、frpc 服务与公网域名/网络？](#detail-section-15)
  - [Q06 · 成本与效果：除隧道服务费用外，需要证书、域名、监控、密钥轮换和升级后重审补丁？](#detail-section-16)
  - [Q07 · 工程：scrypt、cookie 和限速是必要控制，但不足以证明公网安全？](#detail-section-17)
  - [Q08 · 假设：若改为 VPN 内访问、默认只读 RPC、设备绑定和可撤销短期令牌，可把风险从“完整公网暴露”降到可控远程入口。？](#detail-section-18)
  - [Q09 · 采用：当前不建议采用？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：目标是手机或公网远程访问完整 DSH；仅需局域网或单个只读页面时 SSH/VPN/官方远程方案暴露面更小。 详见[Q01](#research-q01)。

目标是手机或公网远程访问完整 DSH；仅需局域网或单个只读页面时 SSH/VPN/官方远程方案暴露面更小。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

#### 能力明细

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| Host 路由 | 提供密码认证、代理、WebSocket/SSE 与管理接口 | 补丁对目标宿主版本的安全影响、会话固定/暴破/代理绕过和 frpc 供应链未审计 |
| 界面 | 配置远程入口和门禁状态 | 补丁对目标宿主版本的安全影响、会话固定/暴破/代理绕过和 frpc 供应链未审计 |
| 后台 | 管理 frpc 下载、进程和隧道 | 补丁对目标宿主版本的安全影响、会话固定/暴破/代理绕过和 frpc 供应链未审计 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| 宿主源码补丁点 | 必需 | 放宽远程访问 | 升级可能失配 |
| 密码/cookie 密钥 | 必需 | 门禁会话 | 泄漏即完整控制 |
| frpc/隧道服务 | 公网时 | 反向通道 | 下载与服务供应链 |

#### 启动步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 建模 | 列出可达 RPC/数据 | 默认拒绝高权限 |
| 隔离安装 | 仅克隆 profile | 备份三处源码 |
| 攻击测试 | 覆盖 HTTP/WS/SSE/cookie | 修复前不联网 |
| 恢复 | 停 frpc 并还原补丁 | 核本地信任边界 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 基础设施 | 域名/证书/隧道 | 配置监控与轮换 | 持续费用未知 |
| 升级 | 重新审三处补丁 | 回归协议代理 | 版本漂移高 |
| 事故 | 凭据/代码暴露或锁死 | 隔离/恢复/轮换 | 影响面接近完整 DSH |

#### 效果

| 效果项 | 源码支持 | 验证指标 |
| --- | --- | --- |
| 远程可达 | 手机/公网完整界面 | 连接成功率 |
| 门禁 | 密码/cookie/限速 | 攻击测试通过率 |
| VPN/SSH 对照 | 少改宿主且边界成熟 | 暴露端点数与维护小时 |

> **思考**：远端认证成功后近似完整控制；源码补丁随宿主升级易漂移，下载运行 frpc 又增加二进制供应链与公网攻击面。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把门禁、反代和隧道生命周期整合，降低远程接入步骤；同时也把宿主高权限能力置于新的网络边界。 详见[Q03](#research-q03)。

scrypt、cookie 和限速是必要控制，但不足以证明公网安全；缺少本轮渗透、补丁完整性和权限最小化证据。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

远端认证成功后近似完整控制；源码补丁随宿主升级易漂移，下载运行 frpc 又增加二进制供应链与公网攻击面。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前不建议采用；不要在持有代码、凭据或生产访问权的 DSH 上暴露，优先使用 VPN/SSH 并等待独立安全审计。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码明确包含宿主补丁、密码门禁、协议代理和 frpc 生命周期；本轮未暴露端口、未下载 frpc、未做攻击测试，因而只能确认高权限远程入口的实现形态，不能确认其公网安全。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 README.md、lib/index.js、lib/client.js 与 prepared inventory；未安装、未运行、未访问真实账号/设备/服务。补丁对目标宿主版本的安全影响、会话固定/暴破/代理绕过和 frpc 供应链未审计。
- 下一步：下一步只做本项可证伪实验：在无真实凭据的克隆环境做 threat model 与渗透：Host 头、cookie 固定、WS/SSE、限速绕过、补丁卸载恢复和 frpc 哈希。

**分析版本**

- **仓库**：[534119219/chicheng-gate](https://github.com/534119219/chicheng-gate)
- **版本号**：1.0.3（[固定提交 cfee329](https://github.com/534119219/chicheng-gate/tree/cfee329acf7f886749469779259a6a9147a2b190)）
- **版本日期**：2026-08-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

若改为 VPN 内访问、默认只读 RPC、设备绑定和可撤销短期令牌，可把风险从“完整公网暴露”降到可控远程入口。 详见[Q08](#research-q08)。

下一步只做本项可证伪实验：在无真实凭据的克隆环境做 threat model 与渗透：Host 头、cookie 固定、WS/SSE、限速绕过、补丁卸载恢复和 frpc 哈希。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1592 | 1397 | 60 | — |
| .md | source | 1 | 122 | — | — | 1528 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/534119219/chicheng-gate/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：修改宿主信任边界并暴露完整 DSH 的远程门禁，是否具备足够的可审计防护？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 场景：目标是手机或公网远程访问完整 DSH？

**研究主题**：场景与需求

#### 完整回答

目标是手机或公网远程访问完整 DSH；仅需局域网或单个只读页面时 SSH/VPN/官方远程方案暴露面更小。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/534119219/chicheng-gate/blob/cfee329acf7f886749469779259a6a9147a2b190/README.md#L1-L5)

固定提交复核：场景相关声明与实现入口。

```text
# chicheng-gate

DSH Web GUI 插件：远程访问控制 + frpc 内网穿透 + 面板密码门禁 + 手机端 UI 适配。

在设置面板里统一管理：
```

#### 缺口

- 补丁对目标宿主版本的安全影响、会话固定/暴破/代理绕过和 frpc 供应链未审计
  **影响**：场景结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在无真实凭据的克隆环境做 threat model 与渗透：Host 头、cookie 固定、WS/SSE、限速绕过、补丁卸载恢复和 frpc 哈希

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 机制：插件补丁修改三个官方源点，放宽 trustedHosts/privileged methods，经 scrypt 密码、cookie、限速和 HTTP/WS/SSE 反代接入，可拉起 frpc。？

**研究主题**：功能与机制

#### 完整回答

插件补丁修改三个官方源点，放宽 trustedHosts/privileged methods，经 scrypt 密码、cookie、限速和 HTTP/WS/SSE 反代接入，可拉起 frpc。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-10](https://github.com/534119219/chicheng-gate/blob/cfee329acf7f886749469779259a6a9147a2b190/lib/index.js#L1-L10)

固定提交复核：机制相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
import { networkInterfaces, homedir } from "node:os";
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync, statSync, openSync, unlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { spawn, execFileSync } from "node:child_process";
import { createServer, request as httpRequest } from "node:http";
import z from "schemastery";

const name = "chicheng-gate";
const NS = "chicheng-gate";
```

</details>

#### 缺口

- 补丁对目标宿主版本的安全影响、会话固定/暴破/代理绕过和 frpc 供应链未审计
  **影响**：机制结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在无真实凭据的克隆环境做 threat model 与渗透：Host 头、cookie 固定、WS/SSE、限速绕过、补丁卸载恢复和 frpc 哈希

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 贡献：把门禁、反代和隧道生命周期整合，降低远程接入步骤？

**研究主题**：贡献与相对优势

#### 完整回答

把门禁、反代和隧道生命周期整合，降低远程接入步骤；同时也把宿主高权限能力置于新的网络边界。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/534119219/chicheng-gate/blob/cfee329acf7f886749469779259a6a9147a2b190/README.md#L1-L5)

固定提交复核：贡献相关声明与实现入口。

```text
# chicheng-gate

DSH Web GUI 插件：远程访问控制 + frpc 内网穿透 + 面板密码门禁 + 手机端 UI 适配。

在设置面板里统一管理：
```

#### 缺口

- 补丁对目标宿主版本的安全影响、会话固定/暴破/代理绕过和 frpc 供应链未审计
  **影响**：贡献结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在无真实凭据的克隆环境做 threat model 与渗透：Host 头、cookie 固定、WS/SSE、限速绕过、补丁卸载恢复和 frpc 哈希

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 局限：远端认证成功后近似完整控制？

**研究主题**：缺陷与关键质疑

#### 完整回答

远端认证成功后近似完整控制；源码补丁随宿主升级易漂移，下载运行 frpc 又增加二进制供应链与公网攻击面。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-10](https://github.com/534119219/chicheng-gate/blob/cfee329acf7f886749469779259a6a9147a2b190/lib/index.js#L1-L10)

固定提交复核：局限相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
import { networkInterfaces, homedir } from "node:os";
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync, statSync, openSync, unlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { spawn, execFileSync } from "node:child_process";
import { createServer, request as httpRequest } from "node:http";
import z from "schemastery";

const name = "chicheng-gate";
const NS = "chicheng-gate";
```

</details>

#### 缺口

- 补丁对目标宿主版本的安全影响、会话固定/暴破/代理绕过和 frpc 供应链未审计
  **影响**：局限结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在无真实凭据的克隆环境做 threat model 与渗透：Host 头、cookie 固定、WS/SSE、限速绕过、补丁卸载恢复和 frpc 哈希

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 依赖：依赖精确宿主源码结构、可写安装目录、密码/会话密钥、frpc 服务与公网域名/网络？

**研究主题**：依赖、兼容与流程

#### 完整回答

依赖精确宿主源码结构、可写安装目录、密码/会话密钥、frpc 服务与公网域名/网络；任一错配都可能中断或降级安全。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/534119219/chicheng-gate/blob/cfee329acf7f886749469779259a6a9147a2b190/README.md#L1-L5)

固定提交复核：依赖相关声明与实现入口。

```text
# chicheng-gate

DSH Web GUI 插件：远程访问控制 + frpc 内网穿透 + 面板密码门禁 + 手机端 UI 适配。

在设置面板里统一管理：
```

#### 缺口

- 补丁对目标宿主版本的安全影响、会话固定/暴破/代理绕过和 frpc 供应链未审计
  **影响**：依赖结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在无真实凭据的克隆环境做 threat model 与渗透：Host 头、cookie 固定、WS/SSE、限速绕过、补丁卸载恢复和 frpc 哈希

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本与效果：除隧道服务费用外，需要证书、域名、监控、密钥轮换和升级后重审补丁？

**研究主题**：效果与总成本

#### 完整回答

除隧道服务费用外，需要证书、域名、监控、密钥轮换和升级后重审补丁；入侵或锁死的恢复成本远高于普通 UI 插件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/534119219/chicheng-gate/blob/cfee329acf7f886749469779259a6a9147a2b190/README.md#L1-L5)

固定提交复核：成本与效果相关声明与实现入口。

```text
# chicheng-gate

DSH Web GUI 插件：远程访问控制 + frpc 内网穿透 + 面板密码门禁 + 手机端 UI 适配。

在设置面板里统一管理：
```

#### 缺口

- 补丁对目标宿主版本的安全影响、会话固定/暴破/代理绕过和 frpc 供应链未审计
  **影响**：成本与效果结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在无真实凭据的克隆环境做 threat model 与渗透：Host 头、cookie 固定、WS/SSE、限速绕过、补丁卸载恢复和 frpc 哈希

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 工程：scrypt、cookie 和限速是必要控制，但不足以证明公网安全？

**研究主题**：工程质量与复用

#### 完整回答

scrypt、cookie 和限速是必要控制，但不足以证明公网安全；缺少本轮渗透、补丁完整性和权限最小化证据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-10](https://github.com/534119219/chicheng-gate/blob/cfee329acf7f886749469779259a6a9147a2b190/lib/index.js#L1-L10)

固定提交复核：工程相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
import { networkInterfaces, homedir } from "node:os";
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync, statSync, openSync, unlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { spawn, execFileSync } from "node:child_process";
import { createServer, request as httpRequest } from "node:http";
import z from "schemastery";

const name = "chicheng-gate";
const NS = "chicheng-gate";
```

</details>

#### 缺口

- 补丁对目标宿主版本的安全影响、会话固定/暴破/代理绕过和 frpc 供应链未审计
  **影响**：工程结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在无真实凭据的克隆环境做 threat model 与渗透：Host 头、cookie 固定、WS/SSE、限速绕过、补丁卸载恢复和 frpc 哈希

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 假设：若改为 VPN 内访问、默认只读 RPC、设备绑定和可撤销短期令牌，可把风险从“完整公网暴露”降到可控远程入口。？

**研究主题**：新假设与验证

#### 完整回答

若改为 VPN 内访问、默认只读 RPC、设备绑定和可撤销短期令牌，可把风险从“完整公网暴露”降到可控远程入口。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/534119219/chicheng-gate/blob/cfee329acf7f886749469779259a6a9147a2b190/README.md#L1-L5)

固定提交复核：假设相关声明与实现入口。

```text
# chicheng-gate

DSH Web GUI 插件：远程访问控制 + frpc 内网穿透 + 面板密码门禁 + 手机端 UI 适配。

在设置面板里统一管理：
```

#### 缺口

- 补丁对目标宿主版本的安全影响、会话固定/暴破/代理绕过和 frpc 供应链未审计
  **影响**：假设结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在无真实凭据的克隆环境做 threat model 与渗透：Host 头、cookie 固定、WS/SSE、限速绕过、补丁卸载恢复和 frpc 哈希

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 采用：当前不建议采用？

**研究主题**：采用判断

#### 完整回答

当前不建议采用；不要在持有代码、凭据或生产访问权的 DSH 上暴露，优先使用 VPN/SSH 并等待独立安全审计。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/534119219/chicheng-gate/blob/cfee329acf7f886749469779259a6a9147a2b190/README.md#L1-L5)

固定提交复核：采用相关声明与实现入口。

```text
# chicheng-gate

DSH Web GUI 插件：远程访问控制 + frpc 内网穿透 + 面板密码门禁 + 手机端 UI 适配。

在设置面板里统一管理：
```

#### 缺口

- 补丁对目标宿主版本的安全影响、会话固定/暴破/代理绕过和 frpc 供应链未审计
  **影响**：采用结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在无真实凭据的克隆环境做 threat model 与渗透：Host 头、cookie 固定、WS/SSE、限速绕过、补丁卸载恢复和 frpc 哈希

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
