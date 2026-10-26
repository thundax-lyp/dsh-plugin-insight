# dsh-device-bridge

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[25699df](https://github.com/173787247/dsh-device-bridge/tree/25699dfd31f32500e5016e90d271c8e6674c1945)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-device-bridge)
<!-- END META -->

> **实现功能**：DSH 工具将 Companion v1 健康检查和动作调用转给手机/IoT/薄 Agent。

> **核心亮点**：为多个设备提供统一 Companion v1 工具入口，而具体动作和安全策略依赖共享库与设备端。详见[Q01](#research-q01)。

> **风险与缺陷**：核心客户端仅再导出外部包，无法由本仓库证明白名单与确认；Termux 样例空 token 对局域网可达主机开放。详见[Q02](#research-q02)与[Q03](#research-q03)。

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
  - [Q01 · 设备桥接的用户任务、协议和交付边界是什么？](#detail-section-11)
  - [Q02 · 配置、默认设备、白名单与确认怎样传递？](#detail-section-12)
  - [Q03 · 示例 companion 的网络和鉴权默认值安全边界如何？](#detail-section-13)
  - [Q04 · 部署与维护成本、失败恢复是什么？](#detail-section-14)
  - [Q05 · 如何把“动作确认”变成可验证的跨设备契约？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 companion 的设备由 Agent 统一枚举、查状态与调用受限动作；实际设备能力需对端实现。详见[Q01](#research-q01)。

SSH/MCP 等方式已能操作远端设备；此方案需证明跨设备 HTTP 协议与权限的额外价值。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| device_list | 列设备 | baseUrl 进入工具输出 |
| device_status | 健康检查 | 依赖外部共享库 |
| device_invoke | 动作调用 | 白名单/确认端到端未核 |
| Termux 样例 | 演示服务端 | 默认全接口+空 token |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必要性 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH tools/systemPrompt | 必需 | Agent 工具入口 | 不可调用 |
| dsh-wsl-common | 必需 | 设备解析与 HTTP 客户端 | 模块无法加载 |
| Companion v1 服务/网络 | 必需 | 健康与动作 | 断连/调用失败 |

#### 启动步骤

| 步骤 | 动作 | 判据或失败处理 |
| --- | --- | --- |
| 配置 | 指定设备 URL/token/动作白名单 | 本地清单正确且最小化 |
| 核验 | 先 device_list/status | 健康/能力匹配 |
| 执行 | 对允许动作 invoke | 双侧确认与结果可审 |
| 恢复 | 失败先查设备状态 | 不盲目重发副作用动作 |

**效果与成本**

#### 成本

| 阶段 | 资源与现金成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 首次 | DSH、Git 依赖和设备端服务；金额未知 | 配设备 URL、token、白名单 | 局域网/传输策略需核 |
| 持续 | 设备网络/端口与日志 | 维护版本和动作权限 | 可靠性未知 |
| 失败 | 副作用动作可能处于未知状态 | 查状态后恢复，避免盲重试 | 缺幂等契约 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 统一工具 | 三个 DSH 工具和协议文档 | 真实设备协同效果 |
| 白名单/确认 | 参数转给共享库 | 锁定实现与设备端双侧执行 |
| 样例连接 | Termux 标准库 HTTP 桩 | 安全局域网部署 |

> **思考**：核心客户端仅再导出外部包，无法由本仓库证明白名单与确认；Termux 样例空 token 对局域网可达主机开放。详见[Q02](#research-q02)与[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：为多个设备提供统一 Companion v1 工具入口，而具体动作和安全策略依赖共享库与设备端。详见[Q01](#research-q01)。

为多个设备提供统一 Companion v1 工具入口，而具体动作和安全策略依赖共享库与设备端。详见[Q01](#research-q01)。

薄封装降低重复代码，但把关键安全语义放在外部 Git 依赖；列表泄露 baseUrl 与并发副作用需明确。详见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

核心客户端仅再导出外部包，无法由本仓库证明白名单与确认；Termux 样例空 token 对局域网可达主机开放。详见[Q02](#research-q02)与[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅隔离网络、低风险动作且设备端认证明确时观察；危险动作须先审共享库及设备实现。详见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认工具封装和样例；关键 allowlist/confirm 网络实现藏在未核共享依赖，样例默认 0.0.0.0 且空 token 放行。真实宿主/设备未测。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、package-lock.json、index.js、lib/companion_client.js、docs/PROTOCOL.md、examples/termux-companion.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README、工具注册、协议、锁文件与 Termux 示例；未运行目标或锁定共享库源码；旧 META 仅复用。
- 下一步：核 dsh-wsl-common 固定提交源码及目标 DSH，隔离 LAN 测无 token/危险动作/超时重试/并发/HTTP 暴露。

**分析版本**

- **仓库**：[173787247/dsh-device-bridge](https://github.com/173787247/dsh-device-bridge)
- **版本号**：0.1.1（[固定提交 25699df](https://github.com/173787247/dsh-device-bridge/tree/25699dfd31f32500e5016e90d271c8e6674c1945)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是端到端验证双侧认证/确认/幂等，示例改显式 token，并以拒绝矩阵验收。详见[Q05](#research-q05)。

核 dsh-wsl-common 固定提交源码及目标 DSH，隔离 LAN 测无 token/危险动作/超时重试/并发/HTTP 暴露。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 125 | — | — | 551 |
| .js | source | 2 | 127 | 119 | 1 | — |
| .js | test | 1 | 13 | 12 | 2 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-device-bridge/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：设备桥是否以可审计的白名单、鉴权和确认边界安全调用外部设备？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 设备桥接的用户任务、协议和交付边界是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

该插件让 DSH Agent 枚举配置的手机/IoT/薄 Agent、查健康并向 Companion v1 的 /v1/invoke 发受限动作，适用于 SSH 不便而设备已有 HTTP companion 的场景。自身注册三个工具和 systemPrompt 提示，不提供设备端服务；示例 Termux companion 仅实现 ping/health/notify 桩。实际设备控制能力完全取决于对端实现，不能把“通用桥”理解为出厂支持手机硬件操作。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-24](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/README.md#L1-L24)

作者定位、工具列表与协议

<details>
<summary>查看原文（24行）</summary>

```text
# dsh-device-bridge

> Optional companion to [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit). Not in `install.sh`.

通用 **Companion 协议** 客户端：手机 / IoT / 跳板机薄 Agent，实现 `/v1/health` + `/v1/invoke` 即可接入。与 [dsh-mac-companion](https://github.com/173787247/dsh-mac-companion) 共用协议；SSH 直连用 [dsh-remote-ssh](https://github.com/173787247/dsh-remote-ssh)。

[English → README.en.md](./README.en.md)

## 兼容性

| 字段 | 值 |
|------|----|
| **插件** | `dsh-device-bridge` **0.1.1** |
| **最低 dsh** | ≥ **0.1.2** |
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.2.0-rc.2`**） |
| **套件档位** | 可选（远程桥接） |

## 工具

| 工具 | 作用 |
|------|------|
| `device_list` | 列出已配置设备 |
| `device_status` | GET /v1/health |
| `device_invoke` | POST /v1/invoke（action 白名单） |
```

</details>

**依据 2 · 源码核查**：[index.js:23-27](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/index.js#L23-L27)

systemPrompt 操作提示

```text
  ctx.systemPrompt.section({
    name: "tool:device-bridge",
    order: 142,
    text: "dsh-device-bridge talks to any device that implements Companion protocol v1 (/v1/health, /v1/invoke). Use for phones, IoT, or thin agents when SSH is not enough. Prefer device_list then device_status before device_invoke.",
  });
```

**依据 3 · 源码核查**：[index.js:29-119](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/index.js#L29-L119)

三个工具注册

<details>
<summary>查看原文（91行）</summary>

```text
  ctx.tools.register({
    name: "device_list",
    description: "List configured companion devices (id, kind, baseUrl).",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute() {
      return {
        ok: true,
        devices: devices.map((x) => ({
          id: x.id,
          kind: x.kind,
          baseUrl: x.baseUrl,
          allowActions: x.allowActions,
        })),
        protocol: "companion-v1",
      };
    },
    presentCall: () => ({ card: "generic", title: "device list" }),
    presentResult: (_a, r) => ({ card: "generic", title: "device list", content: r.content }),
  });

  ctx.tools.register({
    name: "device_status",
    description: "GET /v1/health on a device.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: { deviceId: { type: "string" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const device = resolveDevice(devices, args.deviceId);
        const h = await health(device, { timeoutMs });
        return { ok: h.ok, deviceId: device.id, kind: device.kind, health: h };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "device status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "device status", content: r.content }),
  });

  ctx.tools.register({
    name: "device_invoke",
    description: "POST /v1/invoke on a device (action must be allowlisted).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["action"],
      properties: {
        deviceId: { type: "string" },
        action: { type: "string" },
        args: { type: "object", additionalProperties: true },
        confirm: { type: "boolean" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const device = resolveDevice(devices, args.deviceId);
        const allow = device.allowActions && device.allowActions.length ? device.allowActions : defaultAllow;
        return await invoke(device, {
          action: args.action,
          args: args.args && typeof args.args === "object" ? args.args : {},
          confirm: args.confirm === true,
          timeoutMs,
          allowActions: allow,
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "device invoke" }),
    presentResult: (_a, r) => ({ card: "generic", title: "device invoke", content: r.content }),
  });
```

</details>

**依据 4 · 作者声明**：[docs/PROTOCOL.md:1-29](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/docs/PROTOCOL.md#L1-L29)

协议端点和 confirm 约定

<details>
<summary>查看原文（29行）</summary>

````text
# Companion protocol (v1)

Shared by **dsh-mac-companion** and **dsh-device-bridge**.

## Endpoints

| Method | Path | Role |
|--------|------|------|
| GET | `/v1/health` | Liveness + capability list |
| POST | `/v1/invoke` | Run one allowlisted action |

### GET /v1/health

```json
{ "ok": true, "kind": "mac", "version": "0.1.0", "capabilities": ["notify", "shortcut", "clipboard_read"] }
```

`kind` examples: `mac`, `phone`, `aix-agent`, `generic`.

### POST /v1/invoke

```json
{ "action": "notify", "args": { "title": "dsh", "body": "done" }, "confirm": false }
```

```json
{ "ok": true, "result": {} }
```

````

</details>

**依据 5 · 源码核查**：[examples/termux-companion.py:18-70](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/examples/termux-companion.py#L18-L70)

样例仅健康、ping 与通知日志桩

<details>
<summary>查看原文（53行）</summary>

```text
class Handler(BaseHTTPRequestHandler):
    token = ""
    kind = "termux"
    allow = ["health", "ping", "notify"]

    def _auth(self) -> bool:
        if not self.token:
            return True
        return self.headers.get("Authorization") == f"Bearer {self.token}"

    def _json(self, code: int, obj: dict) -> None:
        raw = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_GET(self) -> None:  # noqa: N802
        if not self._auth():
            return self._json(401, {"ok": False, "error": "unauthorized"})
        if self.path.split("?")[0] != "/v1/health":
            return self._json(404, {"ok": False, "error": "not found"})
        self._json(
            200,
            {
                "ok": True,
                "kind": self.kind,
                "version": "0.1.1",
                "capabilities": list(self.allow),
            },
        )

    def do_POST(self) -> None:  # noqa: N802
        if not self._auth():
            return self._json(401, {"ok": False, "error": "unauthorized"})
        if self.path.split("?")[0] != "/v1/invoke":
            return self._json(404, {"ok": False, "error": "not found"})
        n = int(self.headers.get("Content-Length") or 0)
        body = json.loads(self.rfile.read(n) or b"{}")
        action = str(body.get("action") or "")
        args = body.get("args") if isinstance(body.get("args"), dict) else {}
        if action not in self.allow:
            return self._json(400, {"ok": False, "error": f"action not allowlisted: {action}"})
        if action in ("ping", "health"):
            return self._json(200, {"ok": True, "result": {"action": action, "pong": True}})
        if action == "notify":
            title = str(args.get("title") or "dsh")
            text = str(args.get("body") or args.get("text") or "")
            # Stub: log only. On a real Termux box you could call termux-notification.
            sys.stderr.write(f"[notify] {title}: {text}\n")
            return self._json(200, {"ok": True, "result": {"notified": True, "title": title}})
        return self._json(400, {"ok": False, "error": f"unhandled action: {action}"})
```

</details>

#### 缺口

- 真实设备/网络与宿主工具调用未测
  **影响**：不能承诺任何物理设备动作可用
  **进一步探讨**：在隔离设备实现协议并核动作回执

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配置、默认设备、白名单与确认怎样传递？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 时读取 devices 和默认动作白名单，device_list 返回 id/kind/baseUrl/allowActions；device_status 通过共享库 resolveDevice/health，device_invoke 选设备、选择设备专属或默认白名单，把 action/args/confirm/timeout 交给共享库 invoke。共享库源码未包含在本项目内，当前文件只是再导出；白名单是否严密执行、危险动作确认条件、URL/凭据处理与返回体校验均须核锁定依赖提交，不能把工具描述当实现证明。工具标记 isConcurrencySafe:true，但远端副作用是否可并发由设备决定。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:11-21](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/index.js#L11-L21)

配置、默认白名单与超时

<details>
<summary>查看原文（11行）</summary>

```text
export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-device-bridge] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 30_000);
  const devices = listDevices(config.devices);
  const defaultAllow = Array.isArray(config.defaultAllowActions)
    ? config.defaultAllowActions.map(String)
    : ["health", "ping", "status"];
  console.log(`[dsh-device-bridge] devices=${devices.length}`);
```

</details>

**依据 2 · 源码核查**：[index.js:29-80](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/index.js#L29-L80)

list/status 工具行为

<details>
<summary>查看原文（52行）</summary>

```text
  ctx.tools.register({
    name: "device_list",
    description: "List configured companion devices (id, kind, baseUrl).",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute() {
      return {
        ok: true,
        devices: devices.map((x) => ({
          id: x.id,
          kind: x.kind,
          baseUrl: x.baseUrl,
          allowActions: x.allowActions,
        })),
        protocol: "companion-v1",
      };
    },
    presentCall: () => ({ card: "generic", title: "device list" }),
    presentResult: (_a, r) => ({ card: "generic", title: "device list", content: r.content }),
  });

  ctx.tools.register({
    name: "device_status",
    description: "GET /v1/health on a device.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: { deviceId: { type: "string" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const device = resolveDevice(devices, args.deviceId);
        const h = await health(device, { timeoutMs });
        return { ok: h.ok, deviceId: device.id, kind: device.kind, health: h };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "device status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "device status", content: r.content }),
  });
```

</details>

**依据 3 · 源码核查**：[index.js:82-119](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/index.js#L82-L119)

invoke 转发参数及并发安全标记

<details>
<summary>查看原文（38行）</summary>

```text
  ctx.tools.register({
    name: "device_invoke",
    description: "POST /v1/invoke on a device (action must be allowlisted).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["action"],
      properties: {
        deviceId: { type: "string" },
        action: { type: "string" },
        args: { type: "object", additionalProperties: true },
        confirm: { type: "boolean" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const device = resolveDevice(devices, args.deviceId);
        const allow = device.allowActions && device.allowActions.length ? device.allowActions : defaultAllow;
        return await invoke(device, {
          action: args.action,
          args: args.args && typeof args.args === "object" ? args.args : {},
          confirm: args.confirm === true,
          timeoutMs,
          allowActions: allow,
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "device invoke" }),
    presentResult: (_a, r) => ({ card: "generic", title: "device invoke", content: r.content }),
  });
```

</details>

**依据 4 · 源码核查**：[lib/companion_client.js:1-7](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/lib/companion_client.js#L1-L7)

仅再导出共享库

```text
/** Re-export shared Companion protocol client from dsh-wsl-common. */
export {
  listDevices,
  resolveDevice,
  health,
  invoke,
} from "dsh-wsl-common/companion_client.js";
```

**依据 5 · 源码核查**：[package-lock.json:13-26](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/package-lock.json#L13-L26)

共享库锁定 Git 提交

<details>
<summary>查看原文（14行）</summary>

```text
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/dsh-wsl-common": {
      "version": "0.2.0",
      "resolved": "git+ssh://git@github.com/173787247/dsh-wsl-common.git#3d2ce64e4cbbe708cc26d31fe3dbf7b80dbd2781",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    }
  }
```

</details>

#### 缺口

- dsh-wsl-common 锁定提交实现未核，实际 companion 行为未测
  **影响**：不能确认白名单/确认/超时端到端约束
  **进一步探讨**：核依赖 3d2ce64... 源码并做拒绝/超时/并发契约测试

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 示例 companion 的网络和鉴权默认值安全边界如何？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

仓库提供的 Termux 示例默认监听 0.0.0.0，token 默认取环境变量且可为空；空 token 时 _auth 无条件允许，GET /v1/health 与 POST /v1/invoke 对能连到该端口的主机开放。当前样例只提供 ping 和写 stderr 的 notify 桩，故风险是可被远端触发状态查询/通知日志，而非直接任意命令执行；若用户沿用默认样例并后续扩展真实动作，暴露面随动作扩大。README 引导在手机局域网配置 http://phone-ip，没有加密保证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-44](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/README.md#L35-L44)

作者建议局域网 Termux HTTP 样例

<details>
<summary>查看原文（10行）</summary>

````text
### Termux / 轻量 companion

手机上可用 stdlib 样例（健康检查 + ping/notify 桩）：

```sh
python3 examples/termux-companion.py --port 18767
# Termux: 允许局域网访问后，在 dsh 侧配置 baseUrl=http://<phone-ip>:18767
```

手机聊天入口仍用 [dsh-wsl-im](https://github.com/173787247/dsh-wsl-im)；本插件负责设备侧能力。`lib/companion_client.js` 从 [dsh-wsl-common](https://github.com/173787247/dsh-wsl-common) 再导出。
````

</details>

**依据 2 · 源码核查**：[examples/termux-companion.py:18-27](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/examples/termux-companion.py#L18-L27)

空 token 即全放行

<details>
<summary>查看原文（10行）</summary>

```text
class Handler(BaseHTTPRequestHandler):
    token = ""
    kind = "termux"
    allow = ["health", "ping", "notify"]

    def _auth(self) -> bool:
        if not self.token:
            return True
        return self.headers.get("Authorization") == f"Bearer {self.token}"

```

</details>

**依据 3 · 源码核查**：[examples/termux-companion.py:36-70](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/examples/termux-companion.py#L36-L70)

开放健康和白名单动作桩

<details>
<summary>查看原文（35行）</summary>

```text
    def do_GET(self) -> None:  # noqa: N802
        if not self._auth():
            return self._json(401, {"ok": False, "error": "unauthorized"})
        if self.path.split("?")[0] != "/v1/health":
            return self._json(404, {"ok": False, "error": "not found"})
        self._json(
            200,
            {
                "ok": True,
                "kind": self.kind,
                "version": "0.1.1",
                "capabilities": list(self.allow),
            },
        )

    def do_POST(self) -> None:  # noqa: N802
        if not self._auth():
            return self._json(401, {"ok": False, "error": "unauthorized"})
        if self.path.split("?")[0] != "/v1/invoke":
            return self._json(404, {"ok": False, "error": "not found"})
        n = int(self.headers.get("Content-Length") or 0)
        body = json.loads(self.rfile.read(n) or b"{}")
        action = str(body.get("action") or "")
        args = body.get("args") if isinstance(body.get("args"), dict) else {}
        if action not in self.allow:
            return self._json(400, {"ok": False, "error": f"action not allowlisted: {action}"})
        if action in ("ping", "health"):
            return self._json(200, {"ok": True, "result": {"action": action, "pong": True}})
        if action == "notify":
            title = str(args.get("title") or "dsh")
            text = str(args.get("body") or args.get("text") or "")
            # Stub: log only. On a real Termux box you could call termux-notification.
            sys.stderr.write(f"[notify] {title}: {text}\n")
            return self._json(200, {"ok": True, "result": {"notified": True, "title": title}})
        return self._json(400, {"ok": False, "error": f"unhandled action: {action}"})
```

</details>

**依据 4 · 源码核查**：[examples/termux-companion.py:76-90](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/examples/termux-companion.py#L76-L90)

默认 0.0.0.0 与可空 token

<details>
<summary>查看原文（15行）</summary>

```text
def main() -> None:
    ap = argparse.ArgumentParser(description="Termux companion stub for dsh-device-bridge")
    ap.add_argument("--host", default="0.0.0.0")
    ap.add_argument("--port", type=int, default=18767)
    ap.add_argument("--token", default=os.environ.get("DSH_COMPANION_TOKEN", ""))
    ap.add_argument("--kind", default="termux")
    args = ap.parse_args()
    Handler.token = args.token
    Handler.kind = args.kind
    httpd = ThreadingHTTPServer((args.host, args.port), Handler)
    print(
        f"termux-companion on http://{args.host}:{args.port} kind={args.kind} caps={Handler.allow}",
        flush=True,
    )
    httpd.serve_forever()
```

</details>

**依据 5 · 作者声明**：[docs/PROTOCOL.md:20-29](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/docs/PROTOCOL.md#L20-L29)

协议请求/确认约定

<details>
<summary>查看原文（10行）</summary>

````text
### POST /v1/invoke

```json
{ "action": "notify", "args": { "title": "dsh", "body": "done" }, "confirm": false }
```

```json
{ "ok": true, "result": {} }
```

````

</details>

#### 缺口

- 实际部署防火墙、token 和扩展动作未核
  **影响**：不能判定目标设备已暴露或有远程执行能力
  **进一步探讨**：明确配置 token/绑定并在隔离 LAN 测未授权请求

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署与维护成本、失败恢复是什么？

**研究主题**：效果与总成本、依赖、兼容与流程、采用判断

#### 完整回答

必须有 DSH tools/systemPrompt 注入、dsh-wsl-common Git 依赖、可达的 companion 服务及相容的 v1 协议。作者称最低 DSH 0.1.2、套件可选；包自身 Node >=18。安装示例为 GitHub 包和 Python mock/Termux，时间、资金和连接可靠性未测。设备清单直接返回 baseUrl，可能把内网拓扑暴露给 Agent 对话/日志，需配置最小权限；设备断连时 status/invoke 捕获异常返回 ok:false，但没有自动重试/幂等键，对有副作用动作尤其要先查状态再决定是否重试。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-44](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/README.md#L9-L44)

兼容、安装和 companion 需求

<details>
<summary>查看原文（36行）</summary>

````text
## 兼容性

| 字段 | 值 |
|------|----|
| **插件** | `dsh-device-bridge` **0.1.1** |
| **最低 dsh** | ≥ **0.1.2** |
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.2.0-rc.2`**） |
| **套件档位** | 可选（远程桥接） |

## 工具

| 工具 | 作用 |
|------|------|
| `device_list` | 列出已配置设备 |
| `device_status` | GET /v1/health |
| `device_invoke` | POST /v1/invoke（action 白名单） |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-device-bridge
python3 companion/mock_server.py --port 18766 --kind phone
```

配置见 `examples/devices.cordis.snippet.yml`。协议：[`docs/PROTOCOL.md`](./docs/PROTOCOL.md)。

### Termux / 轻量 companion

手机上可用 stdlib 样例（健康检查 + ping/notify 桩）：

```sh
python3 examples/termux-companion.py --port 18767
# Termux: 允许局域网访问后，在 dsh 侧配置 baseUrl=http://<phone-ip>:18767
```

手机聊天入口仍用 [dsh-wsl-im](https://github.com/173787247/dsh-wsl-im)；本插件负责设备侧能力。`lib/companion_client.js` 从 [dsh-wsl-common](https://github.com/173787247/dsh-wsl-common) 再导出。
````

</details>

**依据 2 · 源码核查**：[package.json:1-17](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/package.json#L1-L17)

依赖/引擎/打包

<details>
<summary>查看原文（17行）</summary>

```text
{
  "name": "dsh-device-bridge",
  "version": "0.1.1",
  "description": "DeepSeek Harness plugin: generic HTTP companion bridge for phones/IoT/legacy agents.",
  "license": "MIT",
  "repository": { "type": "git", "url": "https://github.com/173787247/dsh-device-bridge.git" },
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/*.test.js" },
  "files": ["index.js", "lib", "cordis.patch.yml", "README.md", "README.en.md", "README.zh.md", "LICENSE", "CHANGELOG.md", "examples", "companion", "docs"],
  "keywords": ["dsh-plugin", "deepseek-harness", "device", "companion", "iot", "mobile"],
  "dependencies": {
    "dsh-wsl-common": "github:173787247/dsh-wsl-common"
  },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
}
```

</details>

**依据 3 · 源码核查**：[index.js:39-49](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/index.js#L39-L49)

清单输出 baseUrl

<details>
<summary>查看原文（11行）</summary>

```text
    async execute() {
      return {
        ok: true,
        devices: devices.map((x) => ({
          id: x.id,
          kind: x.kind,
          baseUrl: x.baseUrl,
          allowActions: x.allowActions,
        })),
        protocol: "companion-v1",
      };
```

</details>

**依据 4 · 源码核查**：[index.js:69-76](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/index.js#L69-L76)

status 异常返回

```text
    async execute(args) {
      try {
        const device = resolveDevice(devices, args.deviceId);
        const h = await health(device, { timeoutMs });
        return { ok: h.ok, deviceId: device.id, kind: device.kind, health: h };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
```

**依据 5 · 源码核查**：[index.js:102-115](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/index.js#L102-L115)

invoke 异常返回

<details>
<summary>查看原文（14行）</summary>

```text
    async execute(args) {
      try {
        const device = resolveDevice(devices, args.deviceId);
        const allow = device.allowActions && device.allowActions.length ? device.allowActions : defaultAllow;
        return await invoke(device, {
          action: args.action,
          args: args.args && typeof args.args === "object" ? args.args : {},
          confirm: args.confirm === true,
          timeoutMs,
          allowActions: allow,
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
```

</details>

#### 缺口

- 真实依赖安装、通信失败恢复和设备权限未测
  **影响**：不能估计运行成本或安全可用性
  **进一步探讨**：目标宿主/设备测断网、超时、重复 invoke 和最小清单

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何把“动作确认”变成可验证的跨设备契约？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向是固定审计 dsh-wsl-common 的 allowlist/confirm/URL 处理，并在设备端对危险动作独立确认、认证和传输加密；对副作用请求加幂等标识/状态查询，避免超时后盲目重放。示例默认应要求显式 token 或回环绑定，并把 LAN 部署条件写清。以拒绝未列动作、confirm 缺失、无 token、跨网段、超时后重复、并发冲突为验收矩阵。当前仅建议在隔离、低风险动作上观察试用。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:103-112](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/index.js#L103-L112)

当前把 allowlist/confirm 委托共享库

<details>
<summary>查看原文（10行）</summary>

```text
      try {
        const device = resolveDevice(devices, args.deviceId);
        const allow = device.allowActions && device.allowActions.length ? device.allowActions : defaultAllow;
        return await invoke(device, {
          action: args.action,
          args: args.args && typeof args.args === "object" ? args.args : {},
          confirm: args.confirm === true,
          timeoutMs,
          allowActions: allow,
        });
```

</details>

**依据 2 · 源码核查**：[lib/companion_client.js:1-7](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/lib/companion_client.js#L1-L7)

共享库仅再导出

```text
/** Re-export shared Companion protocol client from dsh-wsl-common. */
export {
  listDevices,
  resolveDevice,
  health,
  invoke,
} from "dsh-wsl-common/companion_client.js";
```

**依据 3 · 源码核查**：[examples/termux-companion.py:23-27](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/examples/termux-companion.py#L23-L27)

空 token 放行

```text
    def _auth(self) -> bool:
        if not self.token:
            return True
        return self.headers.get("Authorization") == f"Bearer {self.token}"

```

**依据 4 · 作者声明**：[docs/PROTOCOL.md:30-30](https://github.com/173787247/dsh-device-bridge/blob/25699dfd31f32500e5016e90d271c8e6674c1945/docs/PROTOCOL.md#L30-L30)

文档称危险动作双方需 confirm

```text
Destructive actions require `confirm: true` on both the dsh plugin and the companion.
```

#### 缺口

- 跨端确认/认证/幂等方案未实现或验证
  **影响**：不能计作现有能力
  **进一步探讨**：核依赖与设备端实现，构建端到端拒绝测试

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
