# dsh-device-bridge

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[6201d1b](https://github.com/173787247/dsh-device-bridge/tree/6201d1ba1cba7c4efd41733efcc5dd81b924b911)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-device-bridge)
<!-- END META -->

> **功能**：在 DSH 中列出配置设备、探测 Companion 状态并请求命名动作。

> **亮点**：[Q01](#research-q01) 统一配置与工具入口，复用已有设备 Companion。

> **主要限制**：[Q02](#research-q02) 客户端允许动作不等于设备端授权，样例 token 可为空，真实动作须查服务实现。

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
  - [Q01 · 通用桥接能为已有设备服务增加什么？](#detail-section-11)
  - [Q02 · 允许动作与认证在客户端和样例服务各如何承担？](#detail-section-12)
  - [Q03 · 怎样评估桥接并避免把可达当成操作授权？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户希望从会话调用已部署的轻量设备服务。

用同一服务的原生 HTTP 请求或设备本地入口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 设备列表与健康 | 定位已配置端点 | 实际能力取决于设备服务 |
| 远端动作 | 调用命名设备能力 | 需核实共享客户端和服务端授权 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Host 与共享客户端依赖 | 必需 | 挂载工具和发请求 | 依赖解析失败则无法加载 |
| 可达测试 Companion | 必需 | 执行协议动作 | 健康和实际能力需分开验收 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户设隔离设备和动作 | 只启用测试 ping |
| 核对 | 用户验证健康与设备端日志 | 同设备和动作相符 |
| 退出 | 用户停用插件并直接检查服务 | 避免重复有副作用动作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 设备与网络资源未知 | 配置端点和认证 | 需要独立服务 |
| 持续 | 调用成本未知 | 维护设备与动作范围 | 凭据和结果仍需核对 |
| 失败 | 恢复开销未知 | 查设备实际状态 | 请求超时不证明无执行 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多设备接入 | 统一列表和动作入口 | 真实设备覆盖与用户节时 |

> **思考**：[Q02](#research-q02) 客户端允许动作不等于设备端授权，样例 token 可为空，真实动作须查服务实现。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 统一配置与工具入口，复用已有设备 Companion。

[Q02](#research-q02) 通用工具把策略参数交给共享客户端，远端能力和副作用需独立验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 客户端允许动作不等于设备端授权，样例 token 可为空，真实动作须查服务实现。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先用隔离 mock 对照请求与设备日志，再评估真实服务。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持入口、参数和随仓 mock。实际依赖行为和设备结果未验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、companion/mock_server.py、lib/companion_client.js、package-lock.json、docs/PROTOCOL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定组件、协议说明、锁文件和随仓 mock。未运行目标、依赖、设备或宿主。
- 下一步：覆盖无 token、错设备、拒绝动作、响应丢失、重试和实际设备回读。

**分析版本**

- **仓库**：[173787247/dsh-device-bridge](https://github.com/173787247/dsh-device-bridge)
- **版本号**：0.1.1（[固定提交 6201d1b](https://github.com/173787247/dsh-device-bridge/tree/6201d1ba1cba7c4efd41733efcc5dd81b924b911)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 以设备和动作绑定及操作 ID 做对账，测重复请求。

覆盖无 token、错设备、拒绝动作、响应丢失、重试和实际设备回读。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 125 | — | — | 551 |
| .js | source | 2 | 127 | 119 | 1 | — |
| .js | test | 1 | 13 | 12 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-device-bridge/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有 Companion 的用户能否从 DSH 请求测试设备动作并确认实际授权与结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 通用桥接能为已有设备服务增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有手机或小型设备 Companion 服务的用户可在 DSH 查看已配置的设备、探测健康并请求命名动作。与逐个构造 HTTP 请求相比，工具集中设备配置和模型可调用入口。功能来自设备实现，不是通用远程 shell。随仓 mock 只处理 ping、health、status，成功只证明样例返回，不足以证明通知或其他设备动作。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-24](https://github.com/173787247/dsh-device-bridge/blob/6201d1ba1cba7c4efd41733efcc5dd81b924b911/README.md#L3-L24)

作者描述协议和设备范围。

<details>
<summary>查看原文（22行）</summary>

```text
> Optional companion to [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit). Not in `install.sh`.

通用 **Companion 协议** 客户端：手机 / IoT / 跳板机薄 Agent，实现 `/v1/health` + `/v1/invoke` 即可接入。与 [dsh-mac-companion](https://github.com/173787247/dsh-mac-companion) 共用协议；SSH 直连用 [dsh-remote-ssh](https://github.com/173787247/dsh-remote-ssh)。

[English → README.en.md](./README.en.md)

## 兼容性

| 字段 | 值 |
|------|----|
| **插件** | `dsh-device-bridge` **0.1.1** |
| **最低 dsh** | ≥ **0.1.2** |
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.2.2-rc.1`**） |
| **套件档位** | 可选（远程桥接） |

## 工具

| 工具 | 作用 |
|------|------|
| `device_list` | 列出已配置设备 |
| `device_status` | GET /v1/health |
| `device_invoke` | POST /v1/invoke（action 白名单） |
```

</details>

**依据 2 · 源码核查**：[index.js:29-48](https://github.com/173787247/dsh-device-bridge/blob/6201d1ba1cba7c4efd41733efcc5dd81b924b911/index.js#L29-L48)

设备列表的投影。

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[index.js:82-114](https://github.com/173787247/dsh-device-bridge/blob/6201d1ba1cba7c4efd41733efcc5dd81b924b911/index.js#L82-L114)

动作入口。

<details>
<summary>查看原文（33行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[companion/mock_server.py:30-49](https://github.com/173787247/dsh-device-bridge/blob/6201d1ba1cba7c4efd41733efcc5dd81b924b911/companion/mock_server.py#L30-L49)

mock 实际响应。

<details>
<summary>查看原文（20行）</summary>

```text
    def do_GET(self) -> None:  # noqa: N802
        if not self._auth():
            return self._json(401, {"ok": False, "error": "unauthorized"})
        if self.path.split("?")[0] != "/v1/health":
            return self._json(404, {"ok": False, "error": "not found"})
        self._json(200, {"ok": True, "kind": self.kind, "version": "0.1.0", "capabilities": self.allow})

    def do_POST(self) -> None:  # noqa: N802
        if not self._auth():
            return self._json(401, {"ok": False, "error": "unauthorized"})
        if self.path.split("?")[0] != "/v1/invoke":
            return self._json(404, {"ok": False, "error": "not found"})
        n = int(self.headers.get("Content-Length") or 0)
        body = json.loads(self.rfile.read(n) or b"{}")
        action = str(body.get("action") or "")
        if action not in self.allow:
            return self._json(400, {"ok": False, "error": f"action not allowlisted: {action}"})
        if action in ("ping", "health", "status"):
            return self._json(200, {"ok": True, "result": {"action": action, "pong": True}})
        return self._json(400, {"ok": False, "error": f"unhandled action: {action}"})
```

</details>

#### 缺口

- 未验证真实设备兼容性或效益
  **影响**：不能把样例接口外推为手机功能
  **进一步探讨**：在测试 companion 中对照直接请求和设备端执行记录

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 允许动作与认证在客户端和样例服务各如何承担？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

入口用设备非空 allowActions，否则用全局配置或 health/ping/status 默认值，并把允许列表和 confirm 参数传给共享 invoke。具体认证头、拒绝和超时语义属于再导出的共享包，当前组件源码未展开。仓库 lockfile 记录固定依赖提交，但发布安装是否遵循这个解析须检查。mock 在 token 为空时允许请求，默认回环，扩大监听须先处理身份和传输。mock 的服务端动作限制来自自己的 allow，未展示危险动作的真实授权。并发安全标记也不能保证任意远端动作幂等。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:16-20](https://github.com/173787247/dsh-device-bridge/blob/6201d1ba1cba7c4efd41733efcc5dd81b924b911/index.js#L16-L20)

默认动作。

```text
  const timeoutMs = positive(config.timeoutMs, 30_000);
  const devices = listDevices(config.devices);
  const defaultAllow = Array.isArray(config.defaultAllowActions)
    ? config.defaultAllowActions.map(String)
    : ["health", "ping", "status"];
```

**依据 2 · 源码核查**：[index.js:82-114](https://github.com/173787247/dsh-device-bridge/blob/6201d1ba1cba7c4efd41733efcc5dd81b924b911/index.js#L82-L114)

参数、委托与并发标记。

<details>
<summary>查看原文（33行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/companion_client.js:1-7](https://github.com/173787247/dsh-device-bridge/blob/6201d1ba1cba7c4efd41733efcc5dd81b924b911/lib/companion_client.js#L1-L7)

共享依赖接线。

```text
/** Re-export shared Companion protocol client from dsh-wsl-common. */
export {
  listDevices,
  resolveDevice,
  health,
  invoke,
} from "dsh-wsl-common/companion_client.js";
```

**依据 4 · 源码核查**：[package-lock.json:18-24](https://github.com/173787247/dsh-device-bridge/blob/6201d1ba1cba7c4efd41733efcc5dd81b924b911/package-lock.json#L18-L24)

锁定版本与提交。

```text
    "node_modules/dsh-wsl-common": {
      "version": "0.2.0",
      "resolved": "git+ssh://git@github.com/173787247/dsh-wsl-common.git#3d2ce64e4cbbe708cc26d31fe3dbf7b80dbd2781",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
```

**依据 5 · 源码核查**：[companion/mock_server.py:12-20](https://github.com/173787247/dsh-device-bridge/blob/6201d1ba1cba7c4efd41733efcc5dd81b924b911/companion/mock_server.py#L12-L20)

mock Bearer 规则。

```text
class Handler(BaseHTTPRequestHandler):
    token = ""
    kind = "generic"
    allow = ["health", "ping", "status"]

    def _auth(self) -> bool:
        if not self.token:
            return True
        return self.headers.get("Authorization") == f"Bearer {self.token}"
```

**依据 6 · 源码核查**：[companion/mock_server.py:37-65](https://github.com/173787247/dsh-device-bridge/blob/6201d1ba1cba7c4efd41733efcc5dd81b924b911/companion/mock_server.py#L37-L65)

服务端允许列表和默认绑定。

<details>
<summary>查看原文（29行）</summary>

```text
    def do_POST(self) -> None:  # noqa: N802
        if not self._auth():
            return self._json(401, {"ok": False, "error": "unauthorized"})
        if self.path.split("?")[0] != "/v1/invoke":
            return self._json(404, {"ok": False, "error": "not found"})
        n = int(self.headers.get("Content-Length") or 0)
        body = json.loads(self.rfile.read(n) or b"{}")
        action = str(body.get("action") or "")
        if action not in self.allow:
            return self._json(400, {"ok": False, "error": f"action not allowlisted: {action}"})
        if action in ("ping", "health", "status"):
            return self._json(200, {"ok": True, "result": {"action": action, "pong": True}})
        return self._json(400, {"ok": False, "error": f"unhandled action: {action}"})

    def log_message(self, fmt: str, *args) -> None:
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=18766)
    ap.add_argument("--token", default=os.environ.get("DSH_DEVICE_TOKEN", ""))
    ap.add_argument("--kind", default="phone")
    args = ap.parse_args()
    Handler.token = args.token
    Handler.kind = args.kind
    httpd = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"dsh-device-bridge mock on http://{args.host}:{args.port} kind={args.kind}", flush=True)
```

</details>

#### 缺口

- 未展开已安装共享依赖和真实设备服务
  **影响**：不能确认认证、重试或取消保障
  **进一步探讨**：固定依赖版本及服务实现后，用模拟拒绝、超时与重复请求对照

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样评估桥接并避免把可达当成操作授权？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

在隔离网络配置测试设备 ID、明确端点与最低动作，只用 health/ping，对照设备端实际请求。授权或超时不明则停用，直接检查服务日志和原请求。可验证请求前绑定设备和动作，并给已确认结果独立操作 ID，模拟响应丢失、重复调用和设备能力变化，对照错目标和重复执行。若服务器无法识别或拒绝重复，或额外成本无收益则放弃。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:11-27](https://github.com/173787247/dsh-device-bridge/blob/6201d1ba1cba7c4efd41733efcc5dd81b924b911/index.js#L11-L27)

挂载和设备配置。

<details>
<summary>查看原文（17行）</summary>

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

  ctx.systemPrompt.section({
    name: "tool:device-bridge",
    order: 142,
    text: "dsh-device-bridge talks to any device that implements Companion protocol v1 (/v1/health, /v1/invoke). Use for phones, IoT, or thin agents when SSH is not enough. Prefer device_list then device_status before device_invoke.",
  });
```

</details>

**依据 2 · 源码核查**：[docs/PROTOCOL.md:5-30](https://github.com/173787247/dsh-device-bridge/blob/6201d1ba1cba7c4efd41733efcc5dd81b924b911/docs/PROTOCOL.md#L5-L30)

协议不展示操作标识。

<details>
<summary>查看原文（26行）</summary>

````text
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

Destructive actions require `confirm: true` on both the dsh plugin and the companion.
````

</details>

**依据 3 · 源码核查**：[companion/mock_server.py:37-49](https://github.com/173787247/dsh-device-bridge/blob/6201d1ba1cba7c4efd41733efcc5dd81b924b911/companion/mock_server.py#L37-L49)

样例没有调用结果对账。

<details>
<summary>查看原文（13行）</summary>

```text
    def do_POST(self) -> None:  # noqa: N802
        if not self._auth():
            return self._json(401, {"ok": False, "error": "unauthorized"})
        if self.path.split("?")[0] != "/v1/invoke":
            return self._json(404, {"ok": False, "error": "not found"})
        n = int(self.headers.get("Content-Length") or 0)
        body = json.loads(self.rfile.read(n) or b"{}")
        action = str(body.get("action") or "")
        if action not in self.allow:
            return self._json(400, {"ok": False, "error": f"action not allowlisted: {action}"})
        if action in ("ping", "health", "status"):
            return self._json(200, {"ok": True, "result": {"action": action, "pong": True}})
        return self._json(400, {"ok": False, "error": f"unhandled action: {action}"})
```

</details>

#### 缺口

- 未运行协议或设备服务
  **影响**：接入、维护及网络恢复成本未知
  **进一步探讨**：用可弃用服务验收身份、动作拒绝及超时回读

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
