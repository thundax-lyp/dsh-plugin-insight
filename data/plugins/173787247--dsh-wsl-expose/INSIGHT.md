# dsh-wsl-expose

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[d731e52](https://github.com/173787247/dsh-wsl-expose/tree/d731e529bce9e050b4a7ef378e67e3cc497b563c)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-expose) [![npm 30d 674](https://img.shields.io/static/v1?label=npm+30d&message=674&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-wsl-expose) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-wsl-expose)
<!-- END META -->

> **实现功能**：为 WSL 服务给出 Windows portproxy 建议，并可经 PowerShell 实际增删转发。

> **核心亮点**：把 WSL 网络模式、建议命令与 portproxy 操作集中到工具，详见[Q01](#research-q01)。

> **风险与缺陷**：安全说明的 allowApply/端口白名单未在执行路径强制，默认全接口监听；详见[Q02](#research-q02)。

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
  - [Q01 · 端口建议与执行如何工作？](#detail-section-11)
  - [Q02 · 安全声明中的 allowApply 与端口白名单是否由代码强制？](#detail-section-12)
  - [Q03 · Windows 网络和回滚有哪些未覆盖处？](#detail-section-13)
  - [Q04 · 首次、持续及失败恢复分别消耗什么，如何验收？](#detail-section-14)
  - [Q05 · 怎样证伪显式许可与状态回读能减少误暴露？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：从 Windows/LAN 访问 WSL 内服务；本机 dsh UI 建议使用套件 relay。

手工查询 WSL IP 与 .wslconfig 并运行 netsh。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 机制 | 风险 |
| --- | --- | --- |
| advise | 输出网络建议/命令 | WSL IP 可能误选 |
| apply/remove | PowerShell 调 netsh | 缺 opt-in/白名单 |

**流程与依赖**

WSL、Windows PowerShell、netsh 与管理员权限；套件 relay 是另一组件。

确认服务/模式→advise→审阅监听地址、IP、规则→人工应用/验证/回滚。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | WSL/Windows/PowerShell及本地服务资源，价格未知 | 核管理员权限、目标服务/IP/监听面及现有规则，工时未知 | advise不改规则；apply默认全接口且无文档所述opt-in |
| 持续使用 | Windows转发/服务网络资源与维护，量未知 | 检IP漂移、防火墙与访问范围，工时未知 | 无自动动态IP同步/健康检测，不量化运维节省 |
| 失败恢复 | 规则备份/回退、服务恢复和可能误暴露处理资源，金额未知 | 分辨PowerShell/netsh/监听/防火墙状态并精确清理，工时未知 | remove只删对应portproxy，不能恢复手工防火墙或已发生访问 |

缩短网络模式和命令查找时间，但自动 apply 的安全契约不成立。

> **思考**：安全说明的 allowApply/端口白名单未在执行路径强制，默认全接口监听；详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 WSL 网络模式、建议命令与 portproxy 操作集中到工具，详见[Q01](#research-q01)。

把 WSL 网络模式、建议命令与 portproxy 操作集中到工具，详见[Q01](#research-q01)。

PowerShell 执行 portproxy；实际不会创建展示的防火墙规则。

<a id="detail-section-5"></a>

### 1.4 主要限制

安全说明的 allowApply/端口白名单未在执行路径强制，默认全接口监听；详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅参考建议；优先本地 relay。若需 LAN 发布，手工审阅命令和防火墙；详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态源码证明 apply 可执行任意有效端口、默认 0.0.0.0，缺 allowApply/端口白名单；未在 Windows 实测。

- 已检查：作者 README、包清单、源码路径 README.md、SECURITY.md、index.js、lib/expose.js、lib/expose-net.js、lib/wsl-host.js、test/expose.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交，未在 WSL/Windows 执行 PowerShell、netsh 或目标测试。
- 下一步：隔离 VM 测 allowApply 禁用、端口限制、多网卡、重启 IP、并发增删、规则清理。

**分析版本**

- **仓库**：[173787247/dsh-wsl-expose](https://github.com/173787247/dsh-wsl-expose)
- **版本号**：0.2.2（[固定提交 d731e52](https://github.com/173787247/dsh-wsl-expose/tree/d731e529bce9e050b4a7ef378e67e3cc497b563c)）
- **版本日期**：2026-10-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将写操作绑定管理配置许可、明确端口/地址并回读规则，反证与回退代价见[Q05](#research-q05)。

隔离 VM 测 allowApply 禁用、端口限制、多网卡、重启 IP、并发增删、规则清理。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 183 | — | — | 1181 |
| .js | source | 4 | 290 | 265 | 5 | — |
| .js | test | 1 | 48 | 44 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-expose/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-expose/issues?q=is%3Aissue+created%3A2026-09-22T07%3A29%3A14.499Z..2026-10-22T07%3A29%3A14.499Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-expose/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A29%3A14.499Z..2026-10-22T07%3A29%3A14.499Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 WSL 端口发布的建议/执行边界、默认暴露风险与安全声明一致性。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 端口建议与执行如何工作？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

注册 wsl_expose 工具及系统提示；非 WSL 直接返回错误。WSL 中 advise 读取 Windows 用户 .wslconfig networkingMode、取第一个非 loopback IPv4 并生成 netsh portproxy/防火墙/删除命令；apply/remove 通过 PowerShell -Command 实际执行 portproxy 增删。该插件面向 LAN 发布 WSL 服务，文档建议本机 dsh UI 使用另一个 :3081 relay。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:4-37](https://github.com/173787247/dsh-wsl-expose/blob/d731e529bce9e050b4a7ef378e67e3cc497b563c/index.js#L4-L37)

工具注册与 WSL 检测。

<details>
<summary>查看原文（34行）</summary>

```text
export const name = "dsh-wsl-portproxy";
export const inject = ["tools", "systemPrompt"];

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
    },
    presentCall: () => ({ card: "generic", title: "wsl_expose" }),
    presentResult: (_args, result) => (
      result.isError
        ? { card: "generic", title: "wsl_expose failed", content: result.content }
        : { card: "generic", title: "wsl_expose", content: result.content }
    ),
  });
```

</details>

**依据 2 · 源码核查**：[lib/expose.js:14-63](https://github.com/173787247/dsh-wsl-expose/blob/d731e529bce9e050b4a7ef378e67e3cc497b563c/lib/expose.js#L14-L63)

模式读取与建议。

<details>
<summary>查看原文（50行）</summary>

```text
export function readNetworkingMode({
  env = process.env,
  exists = existsSync,
  readFile = readFileSync,
} = {}) {
  const user = windowsUserFromEnv(env);
  const candidates = [];
  if (user) candidates.push(`/mnt/c/Users/${user}/.wslconfig`);
  for (const p of candidates) {
    if (!exists(p)) continue;
    try {
      const text = readFile(p, "utf8");
      const m = text.match(/^\s*networkingMode\s*=\s*(\w+)/im);
      if (m) return m[1].toLowerCase();
    } catch {
      /* ignore */
    }
  }
  return "unknown";
}

export function buildExposeAdvice({ networkingMode = "unknown", port = 3080 } = {}) {
  const tips = [];
  tips.push(
    "DeepSeek Harness dsh web MUST stay on 127.0.0.1 (no --host 0.0.0.0). From Windows use kit scripts/restart-dsh-web.sh and open the printed :3081/?token= URL (dsh ≥0.1.2; bare :3081 is 401).",
  );
  tips.push(
    "Before portproxy: run scripts/check-dsh-health.sh and port_doctor on 3080/3081; local UI uses the :3081 relay, not netsh.",
  );
  if (port === 3080 || port === 3081) {
    tips.push(
      `You asked about port ${port}: for local UI prefer the :3081 relay over netsh portproxy. Portproxy is for LAN exposure of a non-dsh service or when mirrored/localhost fails.`,
    );
  }
  if (networkingMode === "mirrored") {
    tips.push(
      "networkingMode=mirrored (.wslconfig): Windows localhost often reaches WSL directly — portproxy may be unnecessary for same-machine browser access.",
    );
  } else if (networkingMode === "nat") {
    tips.push(
      "networkingMode=nat: Windows browser usually cannot hit WSL 127.0.0.1. Prefer mirrored, or keep the :3081 Python relay; use portproxy only when you need a published Windows listen address.",
    );
  } else {
    tips.push(
      "networkingMode unknown — run wslconfig_hint. Without mirrored, rely on restart-dsh-web.sh (:3081) rather than guessing portproxy.",
    );
  }
  tips.push("apply/remove require an elevated Windows shell; prefer advise + run yourself when unsure.");
  tips.push("Do not expose beyond your LAN without TLS and auth.");
  return tips;
```

</details>

**依据 3 · 源码核查**：[lib/expose.js:105-177](https://github.com/173787247/dsh-wsl-expose/blob/d731e529bce9e050b4a7ef378e67e3cc497b563c/lib/expose.js#L105-L177)

advise/apply/remove 分支。

<details>
<summary>查看原文（73行）</summary>

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
    };
  }
```

</details>

**依据 4 · 作者声明**：[README.md:34-46](https://github.com/173787247/dsh-wsl-expose/blob/d731e529bce9e050b4a7ef378e67e3cc497b563c/README.md#L34-L46)

LAN 与本地 UI 用途区分。

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

#### 缺口

- 未在 WSL/Windows 执行
  **影响**：实际 portproxy/防火墙结果未知
  **进一步探讨**：隔离 Windows 主机测 NAT/mirrored 和回滚

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 安全声明中的 allowApply 与端口白名单是否由代码强制？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

SECURITY.md 称 LAN 暴露是 allowApply opt-in，README 称 allowlisted ports；但 execute 只校验 port 为 1–65535、listenAddress 为 IPv4 形状，未读取 allowApply、未限制 3080/3081 或端口集合。action=apply 可默认 listenAddress 0.0.0.0，对任意有效端口调用 netsh portproxy；因此模型工具调用能请求暴露 dsh 端口，虽然建议文本告诫不要这样做。注册还标记 isConcurrencySafe true，多个并行增删相同端口可能互相覆盖。这是静态源码不一致，未进行实际暴露。

#### 证据与依据

**依据 1 · 作者声明**：[SECURITY.md:1-7](https://github.com/173787247/dsh-wsl-expose/blob/d731e529bce9e050b4a7ef378e67e3cc497b563c/SECURITY.md#L1-L7)

allowApply opt-in 声明。

```text
# Security

`dsh-wsl-expose` must not log, print, or return secrets (tokens, passwords, PEM keys).

Port exposure to the LAN is opt-in (`allowApply`). Prefer `plan` over `apply`.

Report issues via GitHub Issues on this repository.
```

**依据 2 · 作者声明**：[README.md:34-44](https://github.com/173787247/dsh-wsl-expose/blob/d731e529bce9e050b4a7ef378e67e3cc497b563c/README.md#L34-L44)

allowlisted ports 和 dsh 端口警示。

<details>
<summary>查看原文（11行）</summary>

```text
**Scope:** LAN / non-local portproxy only. Local dsh UI should use kit relay `:3081` + token, **not** netsh portproxy to expose 3080.

## Why

Phone / another PC on the LAN sometimes needs a Windows-published port that forwards into WSL. That is different from “open dsh in the local Windows browser”:

| Goal | Do this |
|------|---------|
| Chat UI on **this** Windows box | kit [`restart-dsh-web.sh`](https://github.com/173787247/dsh-wsl-kit/blob/master/scripts/restart-dsh-web.sh) → printed URL on **`:3081?token=…`** |
| Expose a **dev server** to LAN | `wsl_expose` (allowlisted ports) after you understand firewall risk |
| Bind dsh on `0.0.0.0` | **Never** — dsh must stay on `127.0.0.1:3080` |
```

</details>

**依据 3 · 源码核查**：[lib/expose.js:105-113](https://github.com/173787247/dsh-wsl-expose/blob/d731e529bce9e050b4a7ef378e67e3cc497b563c/lib/expose.js#L105-L113)

任何有效端口与默认全接口地址。

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
```

**依据 4 · 源码核查**：[lib/expose.js:138-153](https://github.com/173787247/dsh-wsl-expose/blob/d731e529bce9e050b4a7ef378e67e3cc497b563c/lib/expose.js#L138-L153)

apply/remove 没有 allowApply 检查。

<details>
<summary>查看原文（16行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[index.js:25-30](https://github.com/173787247/dsh-wsl-expose/blob/d731e529bce9e050b4a7ef378e67e3cc497b563c/index.js#L25-L30)

标记并发安全。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
    },
```

#### 缺口

- 未在 Windows 权限上下文试 apply
  **影响**：操作是否被系统管理员权限拦截未知
  **进一步探讨**：隔离虚拟机验证无 allowApply 调用被阻断与否

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Windows 网络和回滚有哪些未覆盖处？

**研究主题**：依赖、兼容与流程、采用判断、缺陷与关键质疑

#### 完整回答

生成的 commands 包含 netsh advfirewall add rule，但 apply 实际只执行 portproxy add，不添加防火墙规则；remove 只删 portproxy，也不删防火墙规则。其显示命令与执行行为不同。WSL IP 取 networkInterfaces 的首个非内部 IPv4，未确认属于当前 WSL 虚拟网卡，WSL 重启后的 IP 漂移也未自动更新；工具需要 Windows PowerShell 与管理员权限。建议仅先用 advise，经人工核对服务、目标 IP、监听地址与防火墙，再手工执行及验证；修复 allowApply/端口限制前不直接启用 apply。

runPowerShell仅把execFile的PowerShell进程成功视作resolve，未显式以netsh的LASTEXITCODE决定结果，apply也不查询portproxy或实际监听/连通状态。因此ok只代表该包装调用没有抛错，不能直接当规则已正确生效；删除也不等业务连接或防火墙全部清理。

#### 证据与依据

**依据 1 · 源码核查**：[lib/expose.js:115-124](https://github.com/173787247/dsh-wsl-expose/blob/d731e529bce9e050b4a7ef378e67e3cc497b563c/lib/expose.js#L115-L124)

命令列表含防火墙规则。

<details>
<summary>查看原文（10行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/expose.js:141-153](https://github.com/173787247/dsh-wsl-expose/blob/d731e529bce9e050b4a7ef378e67e3cc497b563c/lib/expose.js#L141-L153)

实际仅 portproxy 增删。

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/expose-net.js:1-12](https://github.com/173787247/dsh-wsl-expose/blob/d731e529bce9e050b4a7ef378e67e3cc497b563c/lib/expose-net.js#L1-L12)

取首个非内部 IPv4。

<details>
<summary>查看原文（12行）</summary>

```text
import { networkInterfaces } from "node:os";

export async function hostnameIps() {
  const nets = networkInterfaces();
  const out = [];
  for (const list of Object.values(nets)) {
    for (const n of list || []) {
      if (n.family === "IPv4" && !n.internal) out.push(n.address);
    }
  }
  return out;
}
```

</details>

**依据 4 · 源码核查**：[lib/wsl-host.js:34-42](https://github.com/173787247/dsh-wsl-expose/blob/d731e529bce9e050b4a7ef378e67e3cc497b563c/lib/wsl-host.js#L34-L42)

PowerShell 执行路径。

```text
export async function runPowerShell(script, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("powershell.exe");
  const { stdout, stderr } = await execFileAsync(
    bin,
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { timeout: timeoutMs, windowsHide: true, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
  return { stdout: String(stdout ?? ""), stderr: String(stderr ?? "") };
}
```

**依据 5 · 源码核查**：[lib/wsl-host.js:34-42](https://github.com/173787247/dsh-wsl-expose/blob/d731e529bce9e050b4a7ef378e67e3cc497b563c/lib/wsl-host.js#L34-L42)

PowerShell进程包装未独立检查netsh退出码/转发结果

```text
export async function runPowerShell(script, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("powershell.exe");
  const { stdout, stderr } = await execFileAsync(
    bin,
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { timeout: timeoutMs, windowsHide: true, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
  return { stdout: String(stdout ?? ""), stderr: String(stderr ?? "") };
}
```

#### 缺口

- 未测试 WSL 多网卡/IP 变化
  **影响**：连接目标正确性与持久性未知
  **进一步探讨**：测试多网卡、WSL 重启后连接与清理

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续及失败恢复分别消耗什么，如何验收？

**研究主题**：效果与总成本、采用判断

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | WSL/Windows/PowerShell及本地服务资源，价格未知 | 核管理员权限、目标服务/IP/监听面及现有规则，工时未知 | advise不改规则；apply默认全接口且无文档所述opt-in |
| 持续使用 | Windows转发/服务网络资源与维护，量未知 | 检IP漂移、防火墙与访问范围，工时未知 | 无自动动态IP同步/健康检测，不量化运维节省 |
| 失败恢复 | 规则备份/回退、服务恢复和可能误暴露处理资源，金额未知 | 分辨PowerShell/netsh/监听/防火墙状态并精确清理，工时未知 | remove只删对应portproxy，不能恢复手工防火墙或已发生访问 |

以仅目标服务向明确允许地址可达、其它服务未暴露且能恢复原规则为单位，不把生成命令或ok=true当验收。相比手查IP/模式并netsh配置，本工具省步骤但不提供新网络隔离；Windows管理员上下文、规则留存和服务本身认证依部署者管理。金额、流量、误暴露损失和恢复工时未知，不因仅本地命令推零成本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/expose.js:105-177](https://github.com/173787247/dsh-wsl-expose/blob/d731e529bce9e050b4a7ef378e67e3cc497b563c/lib/expose.js#L105-L177)

规则参数和执行/错误路径

<details>
<summary>查看原文（73行）</summary>

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
    };
  }
```

</details>

**依据 2 · 源码核查**：[lib/expose-net.js:1-12](https://github.com/173787247/dsh-wsl-expose/blob/d731e529bce9e050b4a7ef378e67e3cc497b563c/lib/expose-net.js#L1-L12)

IP选择

<details>
<summary>查看原文（12行）</summary>

```text
import { networkInterfaces } from "node:os";

export async function hostnameIps() {
  const nets = networkInterfaces();
  const out = [];
  for (const list of Object.values(nets)) {
    for (const n of list || []) {
      if (n.family === "IPv4" && !n.internal) out.push(n.address);
    }
  }
  return out;
}
```

</details>

**依据 3 · 源码核查**：[lib/wsl-host.js:34-42](https://github.com/173787247/dsh-wsl-expose/blob/d731e529bce9e050b4a7ef378e67e3cc497b563c/lib/wsl-host.js#L34-L42)

进程超时/缓冲及返回

```text
export async function runPowerShell(script, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("powershell.exe");
  const { stdout, stderr } = await execFileAsync(
    bin,
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { timeout: timeoutMs, windowsHide: true, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
  return { stdout: String(stdout ?? ""), stderr: String(stderr ?? "") };
}
```

#### 缺口

- 实际权限、网络模式、流量与旧规则清理成本未知
  **影响**：无法估算长期成本或保证可达/恢复
  **进一步探讨**：从隔离规则快照与目标/非目标连通真值记录入手

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样证伪显式许可与状态回读能减少误暴露？

**研究主题**：新假设与验证、工程质量与复用、采用判断

#### 完整回答

当前文档宣称opt-in/allowlist而实际缺失，默认0.0.0.0且apply不执行展示的防火墙命令、未核规则生效。相对当前参数直通，设计假设是以宿主管理配置的allowApply和端口/地址集合默认拒绝写入，变更前保存规则、变更后核netsh实际结果并独立验证监听，在失败时仅回退本次拥有的变更，可减少误暴露/误报成功。条件是管理员授权和旧规则归属可信、外层服务有认证；模型填confirm本身不算人类授权。代价是状态记录、管理员操作和回读/回退复杂度。最小对照在隔离VM/假命令适配器输入未授权端口、dsh端口、全接口、已有同端口规则、netsh失败但PowerShell零退出、IP漂移及并发增删，对比原版/原型的未授权规则数、假成功率、旧规则保留与恢复工时。若禁止范围仍被发布、错误仍ok或回退删别人规则，假设被证伪。此方案未实现/执行，不能撤销已经到达服务的访问。

#### 证据与依据

**依据 1 · 源码核查**：[lib/expose.js:105-153](https://github.com/173787247/dsh-wsl-expose/blob/d731e529bce9e050b4a7ef378e67e3cc497b563c/lib/expose.js#L105-L153)

缺许可及实际命令

<details>
<summary>查看原文（49行）</summary>

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
      );
    }
```

</details>

**依据 2 · 源码核查**：[index.js:25-30](https://github.com/173787247/dsh-wsl-expose/blob/d731e529bce9e050b4a7ef378e67e3cc497b563c/index.js#L25-L30)

并发声明

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
    },
```

**依据 3 · 源码核查**：[lib/wsl-host.js:34-42](https://github.com/173787247/dsh-wsl-expose/blob/d731e529bce9e050b4a7ef378e67e3cc497b563c/lib/wsl-host.js#L34-L42)

包装返回

```text
export async function runPowerShell(script, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("powershell.exe");
  const { stdout, stderr } = await execFileAsync(
    bin,
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { timeout: timeoutMs, windowsHide: true, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
  return { stdout: String(stdout ?? ""), stderr: String(stderr ?? "") };
}
```

#### 缺口

- 管理授权入口、规则归属与回退方案未实现
  **影响**：不能将配置设想算现有安全保障
  **进一步探讨**：从明确授权和旧规则所有权的失败矩阵入手

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
