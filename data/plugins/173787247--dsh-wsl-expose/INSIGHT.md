# dsh-wsl-expose

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[6eeef6c](https://github.com/173787247/dsh-wsl-expose/tree/6eeef6cc3d1cec444df584fe195850d71e0432e8)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-expose)
<!-- END META -->

> **功能**：为 WSL 服务提供 Windows 端口映射建议及可选 netsh 操作。

> **亮点**：把网络模式探测、命令建议和端口映射封装为 DSH 工具。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：当前执行路径未检查文档所称 allowApply 或白名单，默认监听 0.0.0.0；删除未核对规则归属。[Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 何时需要端口映射，相比本机访问有何区别？](#detail-section-11)
  - [Q02 · advise、apply、remove 实际做什么？](#detail-section-12)
  - [Q03 · allowApply 和端口白名单是代码强制的吗？](#detail-section-13)
  - [Q04 · 如何安全评估映射及撤销？](#detail-section-14)
  - [Q05 · 已有 advise 和范围检查之外，如何让网络变更可审查？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需从 LAN 访问 WSL 开发服务的用户；基线是手动检查网络并配置 Windows 规则。[Q01](#research-q01)

人工检查 WSL 网络、服务监听和 Windows 规则。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 建议 | 探测网络模式并给命令 | 未证明可达 |
| 映射 | 添加或删除 portproxy | 代码无 allowApply 门槛 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| WSL 与 DSH | 必需 | 工具与网络环境 | 手动检查 |
| Windows PowerShell 与管理员权限 | 变更需要 | netsh 规则 | 仅保留建议 |
| 用户授权、可信服务与网络 | 变更必需 | 决定暴露范围 | 不变更 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户确认服务、网络和原有规则 | 目标不明则停止 |
| 建议 | 用户先调用 advise 核对命令 | 检查监听地址与认证 |
| 变更 | 经授权人工确认规则与恢复 | 失败核实原规则，不盲删 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | WSL 与 Windows 环境 | 检查认证及现有规则 | 权限未测 |
| 持续 | 暴露服务资源 | 维护防火墙和地址 | LAN 范围未知 |
| 恢复 | 误删既有规则风险 | 核查归属与状态 | 无归属检查 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 建议 | 网络模式与命令生成 | 网络模式识别准确率 |
| 映射 | PowerShell 调用分支 | 实际可达与安全 |

> **思考**：当前执行路径未检查文档所称 allowApply 或白名单，默认监听 0.0.0.0；删除未核对规则归属。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把网络模式探测、命令建议和端口映射封装为 DSH 工具。[Q01](#research-q01) [Q02](#research-q02)

代码未读取 allowApply，也无端口白名单；apply/remove 直接执行匹配命令。[Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

当前执行路径未检查文档所称 allowApply 或白名单，默认监听 0.0.0.0；删除未核对规则归属。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

先只读核对网络和规则；LAN 变更需明确授权并确认恢复，不依赖文档所称 opt-in。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持建议与直接变更分支；未运行 WSL 或 Windows。

- 已检查：作者 README、包清单、源码路径 README.md、SECURITY.md、index.js、lib/expose.js、lib/wsl-host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 10 文件、零排除与解析错误；静态检查完整执行函数，未调用 PowerShell。
- 下一步：隔离环境核验默认地址、白名单缺失、原有规则保护和撤销结果。

**分析版本**

- **仓库**：[173787247/dsh-wsl-expose](https://github.com/173787247/dsh-wsl-expose)
- **版本号**：0.2.2（[固定提交 6eeef6c](https://github.com/173787247/dsh-wsl-expose/tree/6eeef6cc3d1cec444df584fe195850d71e0432e8)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：实际执行前强制 opt-in、白名单与前后快照可降低误暴露或误删；需对照现有 advise 与输入检查。[Q05](#research-q05)

隔离环境核验默认地址、白名单缺失、原有规则保护和撤销结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 183 | — | — | 1181 |
| .js | source | 4 | 290 | 265 | 5 | — |
| .js | test | 1 | 48 | 44 | 2 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-expose/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 端口建议和 apply/remove 的实际权限及暴露边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何时需要端口映射，相比本机访问有何区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要从局域网访问 WSL 开发服务的用户可获取 Windows portproxy 建议或执行映射；作者把本机 DSH 页面访问与局域网发布区分，推荐本机使用带 token 的 relay。端口暴露扩大网络访问面，单机访问优先现有本地路径；是否可达取决于网络、服务和防火墙。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:34-46](https://github.com/173787247/dsh-wsl-expose/blob/6eeef6cc3d1cec444df584fe195850d71e0432e8/README.md#L34-L46)

作者区分本机与 LAN 使用。

<details>
<summary>查看原文（13行）</summary>

```text
**Scope:** LAN / non-local portproxy only. Local dsh UI should use kit relay `:3081` + token, **not** netsh portproxy to expose 3080.

## Why

Phone / another PC on the LAN sometimes needs a Windows-published port that forwards into WSL. That is different from “open dsh in the local Windows browser”:

| Goal | Do this |
|------|---------|
| Chat UI on **this** Windows box | kit [`restart-dsh-web.sh`](https://github.com/173787247/dsh-wsl-kit/blob/master/scripts/restart-dsh-web.sh) → printed URL on **`:3081?token=…`** |
| Expose a **dev server** to LAN | `wsl_expose` (allowlisted ports) after you understand firewall risk |
| Bind dsh on `0.0.0.0` | **Never** — dsh must stay on `127.0.0.1:3080` |

Under NAT-mode WSL, Windows localhost forwarding can be flaky; mirrored networking changes the story — the tool reports `networkingMode` so you do not guess.
```

</details>

**依据 2 · 源码核查**：[index.js:7-29](https://github.com/173787247/dsh-wsl-expose/blob/6eeef6cc3d1cec444df584fe195850d71e0432e8/index.js#L7-L29)

注册工具并限制 WSL 环境。

<details>
<summary>查看原文（23行）</summary>

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:wsl_expose",
    order: 113,
    text: "Use wsl_expose when Windows cannot reach a WSL port. For dsh web prefer kit restart-dsh-web.sh → http://127.0.0.1:3081/ (never dsh --host 0.0.0.0). Portproxy is optional/LAN.",
  });

  ctx.tools.register({
    name: "wsl_expose",
    description: "Advise/apply Windows portproxy for a WSL port; prefers :3081 relay for dsh and reads .wslconfig networkingMode.",
    parameters: core.parameters(config),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

</details>

#### 缺口

- 未运行 WSL、Windows netsh 或防火墙
  **影响**：无法确认路由生效、管理员权限及 LAN 可达性
  **进一步探讨**：在隔离 Windows/WSL 环境先只读核对规则和服务监听，再验证恢复

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · advise、apply、remove 实际做什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

未知 action 默认 advise；检查端口 1–65535 和 IPv4 文本形状，缺省监听 0.0.0.0，读取 WSL 地址与网络模式并构造命令。advise 返回建议不运行，apply/remove 在找到 WSL IP 后通过 PowerShell 分别执行 netsh portproxy add/delete；示例防火墙命令出现在建议命令中，但这段执行分支只执行 portproxy。成功表示命令未抛错，不证明防火墙、安全或服务可达。

#### 证据与依据

**依据 1 · 源码核查**：[lib/expose.js:105-136](https://github.com/173787247/dsh-wsl-expose/blob/6eeef6cc3d1cec444df584fe195850d71e0432e8/lib/expose.js#L105-L136)

输入、默认值与 advise 返回。

<details>
<summary>查看原文（32行）</summary>

```text
export async function execute(args, config = {}, deps = {}) {
  const action = ["advise", "apply", "remove"].includes(args?.action) ? args.action : "advise";
  const port = Number.isInteger(args?.port) ? args.port : (Number(config.defaultPort) || 3080);
  if (port < 1 || port > 65535) return { ok: false, action, port, error: "invalid port" };
  const listen = typeof args?.listenAddress === "string" && args.listenAddress.trim()
    ? args.listenAddress.trim()
    : "0.0.0.0";
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(listen) && listen !== "0.0.0.0") {
    return { ok: false, action, port, error: "listenAddress must be IPv4" };
  }
  const ips = await (deps.hostnameIps || hostnameIps)();
  const wslIp = ips[0] || "";
  const commands = [
    `netsh interface portproxy add v4tov4 listenaddress=${listen} listenport=${port} connectaddress=${wslIp || "<WSL_IP>"} connectport=${port}`,
    `netsh advfirewall firewall add rule name="DSH WSL ${port}" dir=in action=allow protocol=TCP localport=${port}`,
    `netsh interface portproxy delete v4tov4 listenaddress=${listen} listenport=${port}`,
  ];
  const networkingMode = (deps.readNetworkingMode || readNetworkingMode)();
  const advice = buildExposeAdvice({ networkingMode, port });
  const browserHint = "http://127.0.0.1:3081/ (kit relay; dsh binds 127.0.0.1:3080 only)";
  if (action === "advise") {
    return {
      ok: true,
      action,
      port,
      listenAddress: listen,
      wslIp,
      commands,
      advice,
      networkingMode,
      browserHint,
    };
```

</details>

**依据 2 · 源码核查**：[lib/expose.js:138-175](https://github.com/173787247/dsh-wsl-expose/blob/6eeef6cc3d1cec444df584fe195850d71e0432e8/lib/expose.js#L138-L175)

apply/remove 及错误返回。

<details>
<summary>查看原文（38行）</summary>

```text
  if (!wslIp) {
    return { ok: false, action, port, error: "could not detect WSL IP", advice, networkingMode, browserHint };
  }
  const ps = deps.runPowerShell || runPowerShell;
  try {
    if (action === "apply") {
      await ps(
        `netsh interface portproxy add v4tov4 listenaddress=${listen} listenport=${port} connectaddress=${wslIp} connectport=${port}`,
        { timeoutMs: 20_000 },
      );
    } else {
      await ps(
        `netsh interface portproxy delete v4tov4 listenaddress=${listen} listenport=${port}`,
        { timeoutMs: 20_000 },
      );
    }
    return {
      ok: true,
      action,
      port,
      listenAddress: listen,
      wslIp,
      commands,
      advice,
      networkingMode,
      browserHint,
    };
  } catch (err) {
    return {
      ok: false,
      action,
      port,
      wslIp,
      commands,
      advice,
      networkingMode,
      browserHint,
      error: err instanceof Error ? err.message : String(err),
```

</details>

**依据 3 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-expose/blob/6eeef6cc3d1cec444df584fe195850d71e0432e8/lib/wsl-host.js#L34-L41)

PowerShell 调用和超时。

```text
export async function runPowerShell(script, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("powershell.exe");
  const { stdout, stderr } = await execFileAsync(
    bin,
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { timeout: timeoutMs, windowsHide: true, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
  return { stdout: String(stdout ?? ""), stderr: String(stderr ?? "") };
```

#### 缺口

- 未运行 WSL、Windows netsh 或防火墙
  **影响**：无法确认路由生效、管理员权限及 LAN 可达性
  **进一步探讨**：在隔离 Windows/WSL 环境先只读核对规则和服务监听，再验证恢复

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · allowApply 和端口白名单是代码强制的吗？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

当前固定 execute 未读取 allowApply 或白名单：仅校验端口范围与地址文本形状，显式 apply/remove 即进入执行分支；默认端口是 3080、默认监听 0.0.0.0。SECURITY 和工具说明声称 opt-in、allowlisted，而代码路径未体现该门槛；必须按实际权限与用户明确授权处理，不能假定已有硬保护。地址正则也不是完整 IPv4 数值校验。

#### 证据与依据

**依据 1 · 作者声明**：[SECURITY.md:1-5](https://github.com/173787247/dsh-wsl-expose/blob/6eeef6cc3d1cec444df584fe195850d71e0432e8/SECURITY.md#L1-L5)

作者声明 allowApply 是 opt-in。

```text
# Security

`dsh-wsl-expose` must not log, print, or return secrets (tokens, passwords, PEM keys).

Port exposure to the LAN is opt-in (`allowApply`). Prefer `plan` over `apply`.
```

**依据 2 · 源码核查**：[index.js:17-29](https://github.com/173787247/dsh-wsl-expose/blob/6eeef6cc3d1cec444df584fe195850d71e0432e8/index.js#L17-L29)

工具直接委托 core.execute。

<details>
<summary>查看原文（13行）</summary>

```text
  ctx.tools.register({
    name: "wsl_expose",
    description: "Advise/apply Windows portproxy for a WSL port; prefers :3081 relay for dsh and reads .wslconfig networkingMode.",
    parameters: core.parameters(config),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

</details>

**依据 3 · 源码核查**：[lib/expose.js:105-124](https://github.com/173787247/dsh-wsl-expose/blob/6eeef6cc3d1cec444df584fe195850d71e0432e8/lib/expose.js#L105-L124)

范围与文本校验，无 allowApply 判断。

<details>
<summary>查看原文（20行）</summary>

```text
export async function execute(args, config = {}, deps = {}) {
  const action = ["advise", "apply", "remove"].includes(args?.action) ? args.action : "advise";
  const port = Number.isInteger(args?.port) ? args.port : (Number(config.defaultPort) || 3080);
  if (port < 1 || port > 65535) return { ok: false, action, port, error: "invalid port" };
  const listen = typeof args?.listenAddress === "string" && args.listenAddress.trim()
    ? args.listenAddress.trim()
    : "0.0.0.0";
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(listen) && listen !== "0.0.0.0") {
    return { ok: false, action, port, error: "listenAddress must be IPv4" };
  }
  const ips = await (deps.hostnameIps || hostnameIps)();
  const wslIp = ips[0] || "";
  const commands = [
    `netsh interface portproxy add v4tov4 listenaddress=${listen} listenport=${port} connectaddress=${wslIp || "<WSL_IP>"} connectport=${port}`,
    `netsh advfirewall firewall add rule name="DSH WSL ${port}" dir=in action=allow protocol=TCP localport=${port}`,
    `netsh interface portproxy delete v4tov4 listenaddress=${listen} listenport=${port}`,
  ];
  const networkingMode = (deps.readNetworkingMode || readNetworkingMode)();
  const advice = buildExposeAdvice({ networkingMode, port });
  const browserHint = "http://127.0.0.1:3081/ (kit relay; dsh binds 127.0.0.1:3080 only)";
```

</details>

**依据 4 · 源码核查**：[lib/expose.js:125-151](https://github.com/173787247/dsh-wsl-expose/blob/6eeef6cc3d1cec444df584fe195850d71e0432e8/lib/expose.js#L125-L151)

显式 apply/remove 分支。

<details>
<summary>查看原文（27行）</summary>

```text
  if (action === "advise") {
    return {
      ok: true,
      action,
      port,
      listenAddress: listen,
      wslIp,
      commands,
      advice,
      networkingMode,
      browserHint,
    };
  }
  if (!wslIp) {
    return { ok: false, action, port, error: "could not detect WSL IP", advice, networkingMode, browserHint };
  }
  const ps = deps.runPowerShell || runPowerShell;
  try {
    if (action === "apply") {
      await ps(
        `netsh interface portproxy add v4tov4 listenaddress=${listen} listenport=${port} connectaddress=${wslIp} connectport=${port}`,
        { timeoutMs: 20_000 },
      );
    } else {
      await ps(
        `netsh interface portproxy delete v4tov4 listenaddress=${listen} listenport=${port}`,
        { timeoutMs: 20_000 },
```

</details>

#### 缺口

- 未运行 WSL、Windows netsh 或防火墙
  **影响**：无法确认路由生效、管理员权限及 LAN 可达性
  **进一步探讨**：在隔离 Windows/WSL 环境先只读核对规则和服务监听，再验证恢复

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何安全评估映射及撤销？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要 WSL、Windows PowerShell、管理员能力、明确端口和可信网络；作者建议本机 UI 使用 relay。先以 advise 记录目标与既有规则、检查服务认证及防火墙；任何实际变更须用户授权，完成后核对规则和可达范围，撤销前确认目标确属本次创建。代码 remove 直接删除匹配监听地址和端口，未见归属检查；失败不能当作已恢复。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:38-46](https://github.com/173787247/dsh-wsl-expose/blob/6eeef6cc3d1cec444df584fe195850d71e0432e8/README.md#L38-L46)

作者描述本机 relay 与 LAN 边界。

```text
Phone / another PC on the LAN sometimes needs a Windows-published port that forwards into WSL. That is different from “open dsh in the local Windows browser”:

| Goal | Do this |
|------|---------|
| Chat UI on **this** Windows box | kit [`restart-dsh-web.sh`](https://github.com/173787247/dsh-wsl-kit/blob/master/scripts/restart-dsh-web.sh) → printed URL on **`:3081?token=…`** |
| Expose a **dev server** to LAN | `wsl_expose` (allowlisted ports) after you understand firewall risk |
| Bind dsh on `0.0.0.0` | **Never** — dsh must stay on `127.0.0.1:3080` |

Under NAT-mode WSL, Windows localhost forwarding can be flaky; mirrored networking changes the story — the tool reports `networkingMode` so you do not guess.
```

**依据 2 · 源码核查**：[lib/expose.js:125-151](https://github.com/173787247/dsh-wsl-expose/blob/6eeef6cc3d1cec444df584fe195850d71e0432e8/lib/expose.js#L125-L151)

生成建议和直接删除规则。

<details>
<summary>查看原文（27行）</summary>

```text
  if (action === "advise") {
    return {
      ok: true,
      action,
      port,
      listenAddress: listen,
      wslIp,
      commands,
      advice,
      networkingMode,
      browserHint,
    };
  }
  if (!wslIp) {
    return { ok: false, action, port, error: "could not detect WSL IP", advice, networkingMode, browserHint };
  }
  const ps = deps.runPowerShell || runPowerShell;
  try {
    if (action === "apply") {
      await ps(
        `netsh interface portproxy add v4tov4 listenaddress=${listen} listenport=${port} connectaddress=${wslIp} connectport=${port}`,
        { timeoutMs: 20_000 },
      );
    } else {
      await ps(
        `netsh interface portproxy delete v4tov4 listenaddress=${listen} listenport=${port}`,
        { timeoutMs: 20_000 },
```

</details>

**依据 3 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-expose/blob/6eeef6cc3d1cec444df584fe195850d71e0432e8/lib/wsl-host.js#L34-L41)

Windows PowerShell 依赖。

```text
export async function runPowerShell(script, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("powershell.exe");
  const { stdout, stderr } = await execFileAsync(
    bin,
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { timeout: timeoutMs, windowsHide: true, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
  return { stdout: String(stdout ?? ""), stderr: String(stderr ?? "") };
```

#### 缺口

- 未运行 WSL、Windows netsh 或防火墙
  **影响**：无法确认路由生效、管理员权限及 LAN 可达性
  **进一步探讨**：在隔离 Windows/WSL 环境先只读核对规则和服务监听，再验证恢复

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 已有 advise 和范围检查之外，如何让网络变更可审查？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：引入默认关闭的显式 apply 开关、端口/监听地址白名单和执行前后规则快照，可能防止误暴露及误删。现有已有 advise 默认、端口范围和 IPv4 文本检查，不能把这些当新能力；SECURITY 已声明 allowApply，但固定执行路径未实现。未穷尽宿主外部审批或等价保护；在隔离 WSL 对照误执行、既有规则保护、恢复成功和误拒率，无改善或造成误删则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/expose.js:105-124](https://github.com/173787247/dsh-wsl-expose/blob/6eeef6cc3d1cec444df584fe195850d71e0432e8/lib/expose.js#L105-L124)

已有 advise 默认及格式校验。

<details>
<summary>查看原文（20行）</summary>

```text
export async function execute(args, config = {}, deps = {}) {
  const action = ["advise", "apply", "remove"].includes(args?.action) ? args.action : "advise";
  const port = Number.isInteger(args?.port) ? args.port : (Number(config.defaultPort) || 3080);
  if (port < 1 || port > 65535) return { ok: false, action, port, error: "invalid port" };
  const listen = typeof args?.listenAddress === "string" && args.listenAddress.trim()
    ? args.listenAddress.trim()
    : "0.0.0.0";
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(listen) && listen !== "0.0.0.0") {
    return { ok: false, action, port, error: "listenAddress must be IPv4" };
  }
  const ips = await (deps.hostnameIps || hostnameIps)();
  const wslIp = ips[0] || "";
  const commands = [
    `netsh interface portproxy add v4tov4 listenaddress=${listen} listenport=${port} connectaddress=${wslIp || "<WSL_IP>"} connectport=${port}`,
    `netsh advfirewall firewall add rule name="DSH WSL ${port}" dir=in action=allow protocol=TCP localport=${port}`,
    `netsh interface portproxy delete v4tov4 listenaddress=${listen} listenport=${port}`,
  ];
  const networkingMode = (deps.readNetworkingMode || readNetworkingMode)();
  const advice = buildExposeAdvice({ networkingMode, port });
  const browserHint = "http://127.0.0.1:3081/ (kit relay; dsh binds 127.0.0.1:3080 only)";
```

</details>

**依据 2 · 源码核查**：[lib/expose.js:125-151](https://github.com/173787247/dsh-wsl-expose/blob/6eeef6cc3d1cec444df584fe195850d71e0432e8/lib/expose.js#L125-L151)

现有变更路径无该门槛。

<details>
<summary>查看原文（27行）</summary>

```text
  if (action === "advise") {
    return {
      ok: true,
      action,
      port,
      listenAddress: listen,
      wslIp,
      commands,
      advice,
      networkingMode,
      browserHint,
    };
  }
  if (!wslIp) {
    return { ok: false, action, port, error: "could not detect WSL IP", advice, networkingMode, browserHint };
  }
  const ps = deps.runPowerShell || runPowerShell;
  try {
    if (action === "apply") {
      await ps(
        `netsh interface portproxy add v4tov4 listenaddress=${listen} listenport=${port} connectaddress=${wslIp} connectport=${port}`,
        { timeoutMs: 20_000 },
      );
    } else {
      await ps(
        `netsh interface portproxy delete v4tov4 listenaddress=${listen} listenport=${port}`,
        { timeoutMs: 20_000 },
```

</details>

**依据 3 · 作者声明**：[SECURITY.md:3-5](https://github.com/173787247/dsh-wsl-expose/blob/6eeef6cc3d1cec444df584fe195850d71e0432e8/SECURITY.md#L3-L5)

作者已声明 opt-in。

```text
`dsh-wsl-expose` must not log, print, or return secrets (tokens, passwords, PEM keys).

Port exposure to the LAN is opt-in (`allowApply`). Prefer `plan` over `apply`.
```

#### 缺口

- 未运行 WSL、Windows netsh 或防火墙
  **影响**：无法确认路由生效、管理员权限及 LAN 可达性
  **进一步探讨**：在隔离 Windows/WSL 环境先只读核对规则和服务监听，再验证恢复

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
