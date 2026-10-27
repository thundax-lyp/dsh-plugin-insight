# dsh-mac-companion

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[80c0f61](https://github.com/173787247/dsh-mac-companion/tree/80c0f61cedd985b19178bd45b2618f64a4eb96fc)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-mac-companion)
<!-- END META -->

> **实现功能**：DSH 经 HTTP 调用 macOS Companion 的通知、Shortcuts 和剪贴板工具。

> **核心亮点**：将共享设备协议包装为 DSH 工具并附轻量 Mac 服务，省去手工命令。详见[Q02](#research-q02)。

> **风险与缺陷**：Mac 服务空 token 即免鉴权、跨机示例为明文 HTTP，confirm 不等于人在场审批；剪贴板读无 confirm。详见[Q03](#research-q03)。

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
  - [Q01 · 跨 WSL/Mac 桥接允许 agent 做哪些桌面动作？](#detail-section-11)
  - [Q02 · 客户端、共享协议库和 Mac 服务如何配合？](#detail-section-12)
  - [Q03 · Token、confirm 和剪贴板权限的实际防线是什么？](#detail-section-13)
  - [Q04 · 跨机安装需要哪些组件与维护？](#detail-section-14)
  - [Q05 · 怎样试用而不把机器动作误认为已获用户授权？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL/远程 DSH 需有限操作用户 Mac，必须绑定正确设备与明确授权。

本机 Shortcuts/通知/剪贴板或 SSH 操作；本包提供 DSH 工具化远程入口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| health | 连通性 | 默认环回 |
| notify | 弹出通知 | Mac 权限 |
| shortcut | 本地自动化 | confirm 仅参数 |
| clipboard | 文本读写 | 敏感信息、读无确认 |

**流程与依赖**

| 条件 | 用途 | 失败时 |
| --- | --- | --- |
| DSH tools/systemPrompt/共享库 | 工具调用 | 无功能 |
| Mac Python/osascript/Shortcuts | 执行动作 | 权限或命令失败 |
| token 与可信网络 | 远端连接 | 越权或不可达 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 部署 | 环境 token、可信隧道 | 只有目标客户端可达 |
| 授权 | 按动作审批 | 人明确同意 |
| 验收 | 假剪贴板/假 Shortcut | 结果正确且可追踪 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 部署 | Mac 常驻服务、网络/隧道、token | 跨机连通 |
| 使用 | HTTP 往返/系统权限 | 误调用和超时 |
| 治理 | 审剪贴板/Shortcuts 权限 | 外泄/恢复成本 |

| 结果 | 源码支持 | 未证实 |
| --- | --- | --- |
| 通知/剪贴板/Shortcut | Mac 服务动作 | 实机权限/连通 |
| 鉴权 | 可配置 token | 空 token 默认放行 |
| 确认 | 请求 confirm | 人在场授权，实际没有 |

> **思考**：Mac 服务空 token 即免鉴权、跨机示例为明文 HTTP，confirm 不等于人在场审批；剪贴板读无 confirm。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将共享设备协议包装为 DSH 工具并附轻量 Mac 服务，省去手工命令。详见[Q02](#research-q02)。

将共享设备协议包装为 DSH 工具并附轻量 Mac 服务，省去手工命令。详见[Q02](#research-q02)。

服务默认环回、空 token 放行，HTTP 明文；确认仅 JSON 字段；Shortcuts 子进程无 timeout，剪贴板读直接返回文本。

<a id="detail-section-5"></a>

### 1.4 主要限制

Mac 服务空 token 即免鉴权、跨机示例为明文 HTTP，confirm 不等于人在场审批；剪贴板读无 confirm。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先健康/通知在可信隧道内试用；剪贴板/Shortcuts 须有独立用户审批与服务端约束。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持五工具和服务端动作；confirm 是可自填布尔值，空 token 服务放行，跨机 HTTP 部署需额外安全边界。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/companion_client.js、companion/server.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：审阅固定提交入口、共享客户端再导出、Mac Python 服务与 README；未审外部依赖实现或运行服务。
- 下一步：隔离 Mac/WSL，测默认绑定、空 token/错 token、审批和动作回传；只用假剪贴板内容与无副作用 Shortcut。

**分析版本**

- **仓库**：[173787247/dsh-mac-companion](https://github.com/173787247/dsh-mac-companion)
- **版本号**：0.1.1（[固定提交 80c0f61](https://github.com/173787247/dsh-mac-companion/tree/80c0f61cedd985b19178bd45b2618f64a4eb96fc)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

服务端一次性授权、动作 allowlist、可信隧道与 Shortcut 超时可将远程动作变得可审；尚未实现。详见[Q05](#research-q05)。

隔离 Mac/WSL，测默认绑定、空 token/错 token、审批和动作回传；只用假剪贴板内容与无副作用 Shortcut。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 124 | — | — | 499 |
| .js | source | 2 | 220 | 209 | 2 | — |
| .js | test | 1 | 15 | 14 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-mac-companion/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-mac-companion/issues?q=is%3Aissue+created%3A2026-09-22T05%3A54%3A07.697Z..2026-10-22T05%3A54%3A07.697Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-mac-companion/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A54%3A07.697Z..2026-10-22T05%3A54%3A07.697Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：厘清跨机 Mac 动作桥的身份、确认语义和部署网络边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨 WSL/Mac 桥接允许 agent 做哪些桌面动作？

**研究主题**：场景与需求

#### 完整回答

插件给 DSH 五个工具：健康、通知、Shortcuts、剪贴板读写，HTTP 调用用户另行运行的 macOS Companion。合格结果是连到预期 Mac、动作成功且敏感剪贴板和 Shortcuts 在用户明确授权范围；这里的 confirm=true 是调用参数，不构成操作系统或人在场确认。README 示例让 WSL 访问 Mac IP，但启动示例没给 --host，服务默认只绑定 127.0.0.1，直接跨机通常需显式绑定或可信隧道。基线是用户自己在 Mac 运行 Shortcuts/粘贴、SSH 远程命令。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-42](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/README.md#L18-L42)

工具和部署示例。

<details>
<summary>查看原文（25行）</summary>

````text
## 工具

| 工具 | 作用 |
|------|------|
| `mac_companion_status` | GET /v1/health |
| `mac_notify` | 系统通知 |
| `mac_run_shortcut` | 跑 Shortcuts（需 confirm=true） |
| `mac_clipboard_read` | 读剪贴板文本 |
| `mac_clipboard_write` | 写剪贴板（需 confirm=true） |

## Mac 上启动 Companion

```sh
python3 companion/server.py --port 18765 --token 'your-secret'
```

WSL 侧：

```sh
dsh plugin --profile web add github:173787247/dsh-mac-companion
export DSH_MAC_COMPANION_URL=http://<mac-ip>:18765
export DSH_MAC_COMPANION_TOKEN=your-secret
```

仅 SSH CLI 请用 [dsh-remote-ssh](https://github.com/173787247/dsh-remote-ssh)。
````

</details>

**依据 2 · 源码核查**：[index.js:41-211](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/index.js#L41-L211)

五工具注册。

<details>
<summary>查看原文（171行）</summary>

```text
  ctx.tools.register({
    name: "mac_companion_status",
    description: "Probe macOS companion /v1/health.",
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
        return { ok: h.ok, device: { id: device.id, baseUrl: device.baseUrl, kind: device.kind }, health: h };
      } catch (e) {
        return {
          ok: false,
          error: e instanceof Error ? e.message : String(e),
          hint: "Start companion/server.py on the Mac",
        };
      }
    },
    presentCall: () => ({ card: "generic", title: "mac companion status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "mac companion status", content: r.content }),
  });

  ctx.tools.register({
    name: "mac_notify",
    description: "Show a macOS notification via companion action=notify.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["body"],
      properties: {
        deviceId: { type: "string" },
        title: { type: "string" },
        body: { type: "string" },
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
        return await invoke(device, {
          action: "notify",
          args: { title: args.title || "dsh", body: String(args.body) },
          timeoutMs,
          allowActions,
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "mac notify" }),
    presentResult: (_a, r) => ({ card: "generic", title: "mac notify", content: r.content }),
  });

  ctx.tools.register({
    name: "mac_run_shortcut",
    description: "Run a macOS Shortcut by name via companion action=shortcut.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["name"],
      properties: {
        deviceId: { type: "string" },
        name: { type: "string", description: "Shortcuts app name" },
        input: { type: "string" },
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
        return await invoke(device, {
          action: "shortcut",
          args: { name: String(args.name), input: args.input || "" },
          confirm: args.confirm === true,
          timeoutMs,
          allowActions,
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "mac shortcut" }),
    presentResult: (_a, r) => ({ card: "generic", title: "mac shortcut", content: r.content }),
  });

  ctx.tools.register({
    name: "mac_clipboard_read",
    description: "Read macOS clipboard text via companion action=clipboard_read.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: { deviceId: { type: "string" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        { type: "text", text: v.ok === false ? v.error : v.result?.text || JSON.stringify(v) },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const device = resolveDevice(devices, args.deviceId);
        return await invoke(device, { action: "clipboard_read", timeoutMs, allowActions });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "mac clipboard read" }),
    presentResult: (_a, r) => ({ card: "generic", title: "mac clipboard read", content: r.content }),
  });

  ctx.tools.register({
    name: "mac_clipboard_write",
    description: "Set macOS clipboard text via companion (requires confirm=true).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["text"],
      properties: {
        deviceId: { type: "string" },
        text: { type: "string" },
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
        if (args.confirm !== true) {
          return { ok: false, error: "confirm=true required for clipboard_write" };
        }
        const device = resolveDevice(devices, args.deviceId);
        return await invoke(device, {
          action: "clipboard_write",
          args: { text: String(args.text ?? "") },
          confirm: true,
          timeoutMs,
          allowActions,
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "mac clipboard write" }),
    presentResult: (_a, r) => ({ card: "generic", title: "mac clipboard write", content: r.content }),
```

</details>

**依据 3 · 源码核查**：[companion/server.py:116-128](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/companion/server.py#L116-L128)

默认仅环回绑定。

<details>
<summary>查看原文（13行）</summary>

```text
def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=18765)
    ap.add_argument("--token", default=os.environ.get("DSH_MAC_COMPANION_TOKEN", ""))
    args = ap.parse_args()
    Handler.token = args.token
    httpd = ThreadingHTTPServer((args.host, args.port), Handler)
    print(
        f"dsh-mac-companion listening on http://{args.host}:{args.port} token={'set' if args.token else 'off'}",
        flush=True,
    )
    httpd.serve_forever()
```

</details>

#### 缺口

- 未用实际 WSL/Mac 网络验证。
  **影响**：示例直连可用性未知。
  **进一步探讨**：隔离网络测本机环回、Mac IP 和隧道。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 客户端、共享协议库和 Mac 服务如何配合？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

DSH 入口按配置或环境变量组设备，复用外部 dsh-wsl-common 的 listDevices/resolveDevice/health/invoke；每项工具只组装 action/args/confirm 并调用 shared client。Mac 侧 Python ThreadingHTTPServer 提供 /v1/health 和 /v1/invoke，动作由 osascript、shortcuts 命令执行。插件增量是 DSH 工具封装与可部署的轻量服务；设备选择/请求协议核心在另一个依赖包中，本轮未审其固定实现。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-39](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/index.js#L1-L39)

设备和共享客户端。

<details>
<summary>查看原文（39行）</summary>

```text
import { listDevices, resolveDevice, health, invoke } from "./lib/companion_client.js";

export const name = "dsh-mac-companion";
export const inject = ["tools", "systemPrompt"];

function positive(v, d) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : d;
}

function macDevices(config) {
  if (Array.isArray(config.devices) && config.devices.length) return listDevices(config.devices);
  const baseUrl = config.baseUrl || process.env.DSH_MAC_COMPANION_URL || "http://127.0.0.1:18765";
  return listDevices([
    {
      id: "mac",
      baseUrl,
      kind: "mac",
      token: config.token || process.env.DSH_MAC_COMPANION_TOKEN || "",
      allowActions: config.allowActions,
    },
  ]);
}

export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-mac-companion] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 30_000);
  const devices = macDevices(config);
  const allowActions = Array.isArray(config.allowActions) ? config.allowActions.map(String) : [];
  console.log(`[dsh-mac-companion] devices=${devices.length} base=${devices[0]?.baseUrl || "-"}`);

  ctx.systemPrompt.section({
    name: "tool:mac-companion",
    order: 141,
    text: "dsh-mac-companion calls a macOS companion daemon over HTTP (/v1/health, /v1/invoke). Start companion/server.py on the Mac. Prefer mac_companion_status before notify/shortcut/clipboard.",
  });
```

</details>

**依据 2 · 源码核查**：[lib/companion_client.js:1-7](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/lib/companion_client.js#L1-L7)

协议客户端再导出。

```text
/** Re-export shared Companion protocol client from dsh-wsl-common. */
export {
  listDevices,
  resolveDevice,
  health,
  invoke,
} from "dsh-wsl-common/companion_client.js";
```

**依据 3 · 源码核查**：[companion/server.py:39-110](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/companion/server.py#L39-L110)

HTTP 路由与动作。

<details>
<summary>查看原文（72行）</summary>

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
                "kind": "mac",
                "version": "0.1.0",
                "capabilities": CAPABILITIES,
                "platform": sys.platform,
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
        args = body.get("args") or {}
        confirm = bool(body.get("confirm"))
        try:
            if action == "notify":
                title = str(args.get("title") or "dsh")
                text = str(args.get("body") or "")
                script = f"display notification {json.dumps(text)} with title {json.dumps(title)}"
                run_osascript(script)
                return self._json(200, {"ok": True, "result": {"notified": True}})
            if action == "shortcut":
                if not confirm:
                    return self._json(400, {"ok": False, "error": "shortcut requires confirm=true"})
                name = str(args.get("name") or "")
                if not name:
                    return self._json(400, {"ok": False, "error": "name required"})
                cmd = ["shortcuts", "run", name]
                inp = args.get("input")
                if inp:
                    p = subprocess.run(cmd, input=str(inp), text=True, capture_output=True, check=False)
                else:
                    p = subprocess.run(cmd, text=True, capture_output=True, check=False)
                return self._json(
                    200,
                    {
                        "ok": p.returncode == 0,
                        "result": {
                            "code": p.returncode,
                            "stdout": (p.stdout or "")[-4000:],
                            "stderr": (p.stderr or "")[-2000:],
                        },
                    },
                )
            if action == "clipboard_read":
                text = run_osascript("the clipboard as text")
                return self._json(200, {"ok": True, "result": {"text": text[:8000]}})
            if action == "clipboard_write":
                if not confirm:
                    return self._json(400, {"ok": False, "error": "confirm=true required"})
                raw = str((args or {}).get("text") or "")[:8000]
                # Escape for AppleScript string literal
                esc = raw.replace("\\", "\\\\").replace('"', '\\"')
                run_osascript(f'set the clipboard to "{esc}"')
                return self._json(200, {"ok": True, "result": {"chars": len(raw)}})
            if action == "health":
                return self._json(200, {"ok": True, "result": {"capabilities": CAPABILITIES}})
            return self._json(400, {"ok": False, "error": f"unknown action: {action}"})
        except Exception as e:  # noqa: BLE001
            return self._json(500, {"ok": False, "error": str(e)})
```

</details>

**依据 4 · 源码核查**：[package.json:1-16](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/package.json#L1-L16)

GitHub 依赖。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "dsh-mac-companion",
  "version": "0.1.1",
  "description": "DeepSeek Harness plugin: talk to a macOS companion daemon (notify/Shortcuts/clipboard).",
  "license": "MIT",
  "repository": { "type": "git", "url": "https://github.com/173787247/dsh-mac-companion.git" },
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/*.test.js" },
  "files": ["index.js", "lib", "cordis.patch.yml", "README.md", "README.en.md", "README.zh.md", "LICENSE", "CHANGELOG.md", "examples", "companion", "docs"],
  "keywords": ["dsh-plugin", "deepseek-harness", "macos", "companion"],
  "dependencies": {
    "dsh-wsl-common": "github:173787247/dsh-wsl-common"
  },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
```

</details>

#### 缺口

- dsh-wsl-common 未在本项固定源码内。
  **影响**：客户端超时、allowActions 实施和身份细节待审依赖版本。
  **进一步探讨**：锁依赖 SHA 并单独审共享协议库。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Token、confirm 和剪贴板权限的实际防线是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

Mac 服务在 token 为空时 _auth 总放行；默认仅监听环回，但按 README 跨机需要显式对外绑定，必须设置高熵 token 和网络限制。HTTP 明文传 token 与剪贴板/Shortcut 内容，跨不可信网络会暴露；插件不会提供 TLS。Shortcuts 和剪贴板写要求请求 JSON 中 confirm 真，模型可自行给出 true，并非用户交互授权。剪贴板读连 confirm 都不要求，返回最多 8000 字符到工具输出；Shortcuts stdout/stderr 也返回。安全性依赖 DSH 工具调用审批、共享库 allowActions 与部署网络边界，不能仅凭 confirm 认为安全。

#### 证据与依据

**依据 1 · 源码核查**：[companion/server.py:23-30](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/companion/server.py#L23-L30)

空 token 放行。

```text
class Handler(BaseHTTPRequestHandler):
    token = ""

    def _auth(self) -> bool:
        if not self.token:
            return True
        return self.headers.get("Authorization") == f"Bearer {self.token}"

```

**依据 2 · 源码核查**：[companion/server.py:55-110](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/companion/server.py#L55-L110)

confirm 与剪贴板/Shortcuts 回传。

<details>
<summary>查看原文（56行）</summary>

```text
    def do_POST(self) -> None:  # noqa: N802
        if not self._auth():
            return self._json(401, {"ok": False, "error": "unauthorized"})
        if self.path.split("?")[0] != "/v1/invoke":
            return self._json(404, {"ok": False, "error": "not found"})
        n = int(self.headers.get("Content-Length") or 0)
        body = json.loads(self.rfile.read(n) or b"{}")
        action = str(body.get("action") or "")
        args = body.get("args") or {}
        confirm = bool(body.get("confirm"))
        try:
            if action == "notify":
                title = str(args.get("title") or "dsh")
                text = str(args.get("body") or "")
                script = f"display notification {json.dumps(text)} with title {json.dumps(title)}"
                run_osascript(script)
                return self._json(200, {"ok": True, "result": {"notified": True}})
            if action == "shortcut":
                if not confirm:
                    return self._json(400, {"ok": False, "error": "shortcut requires confirm=true"})
                name = str(args.get("name") or "")
                if not name:
                    return self._json(400, {"ok": False, "error": "name required"})
                cmd = ["shortcuts", "run", name]
                inp = args.get("input")
                if inp:
                    p = subprocess.run(cmd, input=str(inp), text=True, capture_output=True, check=False)
                else:
                    p = subprocess.run(cmd, text=True, capture_output=True, check=False)
                return self._json(
                    200,
                    {
                        "ok": p.returncode == 0,
                        "result": {
                            "code": p.returncode,
                            "stdout": (p.stdout or "")[-4000:],
                            "stderr": (p.stderr or "")[-2000:],
                        },
                    },
                )
            if action == "clipboard_read":
                text = run_osascript("the clipboard as text")
                return self._json(200, {"ok": True, "result": {"text": text[:8000]}})
            if action == "clipboard_write":
                if not confirm:
                    return self._json(400, {"ok": False, "error": "confirm=true required"})
                raw = str((args or {}).get("text") or "")[:8000]
                # Escape for AppleScript string literal
                esc = raw.replace("\\", "\\\\").replace('"', '\\"')
                run_osascript(f'set the clipboard to "{esc}"')
                return self._json(200, {"ok": True, "result": {"chars": len(raw)}})
            if action == "health":
                return self._json(200, {"ok": True, "result": {"capabilities": CAPABILITIES}})
            return self._json(400, {"ok": False, "error": f"unknown action: {action}"})
        except Exception as e:  # noqa: BLE001
            return self._json(500, {"ok": False, "error": str(e)})
```

</details>

**依据 3 · 源码核查**：[companion/server.py:116-128](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/companion/server.py#L116-L128)

默认绑定。

<details>
<summary>查看原文（13行）</summary>

```text
def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=18765)
    ap.add_argument("--token", default=os.environ.get("DSH_MAC_COMPANION_TOKEN", ""))
    args = ap.parse_args()
    Handler.token = args.token
    httpd = ThreadingHTTPServer((args.host, args.port), Handler)
    print(
        f"dsh-mac-companion listening on http://{args.host}:{args.port} token={'set' if args.token else 'off'}",
        flush=True,
    )
    httpd.serve_forever()
```

</details>

**依据 4 · 源码核查**：[index.js:108-211](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/index.js#L108-L211)

confirm 参数和剪贴板读权限。

<details>
<summary>查看原文（104行）</summary>

```text
  ctx.tools.register({
    name: "mac_run_shortcut",
    description: "Run a macOS Shortcut by name via companion action=shortcut.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["name"],
      properties: {
        deviceId: { type: "string" },
        name: { type: "string", description: "Shortcuts app name" },
        input: { type: "string" },
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
        return await invoke(device, {
          action: "shortcut",
          args: { name: String(args.name), input: args.input || "" },
          confirm: args.confirm === true,
          timeoutMs,
          allowActions,
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "mac shortcut" }),
    presentResult: (_a, r) => ({ card: "generic", title: "mac shortcut", content: r.content }),
  });

  ctx.tools.register({
    name: "mac_clipboard_read",
    description: "Read macOS clipboard text via companion action=clipboard_read.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: { deviceId: { type: "string" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        { type: "text", text: v.ok === false ? v.error : v.result?.text || JSON.stringify(v) },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const device = resolveDevice(devices, args.deviceId);
        return await invoke(device, { action: "clipboard_read", timeoutMs, allowActions });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "mac clipboard read" }),
    presentResult: (_a, r) => ({ card: "generic", title: "mac clipboard read", content: r.content }),
  });

  ctx.tools.register({
    name: "mac_clipboard_write",
    description: "Set macOS clipboard text via companion (requires confirm=true).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["text"],
      properties: {
        deviceId: { type: "string" },
        text: { type: "string" },
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
        if (args.confirm !== true) {
          return { ok: false, error: "confirm=true required for clipboard_write" };
        }
        const device = resolveDevice(devices, args.deviceId);
        return await invoke(device, {
          action: "clipboard_write",
          args: { text: String(args.text ?? "") },
          confirm: true,
          timeoutMs,
          allowActions,
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "mac clipboard write" }),
    presentResult: (_a, r) => ({ card: "generic", title: "mac clipboard write", content: r.content }),
```

</details>

**依据 5 · 作者声明**：[README.md:28-40](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/README.md#L28-L40)

明文 HTTP/URL 示例。

<details>
<summary>查看原文（13行）</summary>

````text
## Mac 上启动 Companion

```sh
python3 companion/server.py --port 18765 --token 'your-secret'
```

WSL 侧：

```sh
dsh plugin --profile web add github:173787247/dsh-mac-companion
export DSH_MAC_COMPANION_URL=http://<mac-ip>:18765
export DSH_MAC_COMPANION_TOKEN=your-secret
```
````

</details>

#### 缺口

- 未审宿主工具审批/共享库 allowActions。
  **影响**：最终操作授权边界未知。
  **进一步探讨**：隔离假 token/被拒动作/无审批路径测。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 跨机安装需要哪些组件与维护？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

固定包 0.1.1 MIT、Node>=18，依赖从 GitHub 安装的 dsh-wsl-common；Mac 端 Python3、osascript、Shortcuts 权限/应用、网络/防火墙与常驻进程。每次动作需等待 HTTP 往返，默认 DSH 工具超时 30 秒；Mac 服务执行 Shortcuts 没有 subprocess timeout，某个 Shortcut 卡住时线程可持续占用。使用 token CLI 参数会出现在 shell 历史/进程参数中，服务支持环境变量读取 token。作者称 DSH>=0.1.2 是文档兼容记录，未实测本轮环境。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-16](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/package.json#L1-L16)

包与 GitHub 依赖。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "dsh-mac-companion",
  "version": "0.1.1",
  "description": "DeepSeek Harness plugin: talk to a macOS companion daemon (notify/Shortcuts/clipboard).",
  "license": "MIT",
  "repository": { "type": "git", "url": "https://github.com/173787247/dsh-mac-companion.git" },
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/*.test.js" },
  "files": ["index.js", "lib", "cordis.patch.yml", "README.md", "README.en.md", "README.zh.md", "LICENSE", "CHANGELOG.md", "examples", "companion", "docs"],
  "keywords": ["dsh-plugin", "deepseek-harness", "macos", "companion"],
  "dependencies": {
    "dsh-wsl-common": "github:173787247/dsh-wsl-common"
  },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
```

</details>

**依据 2 · 源码核查**：[index.js:25-33](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/index.js#L25-L33)

默认超时。

```text
export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-mac-companion] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 30_000);
  const devices = macDevices(config);
  const allowActions = Array.isArray(config.allowActions) ? config.allowActions.map(String) : [];
  console.log(`[dsh-mac-companion] devices=${devices.length} base=${devices[0]?.baseUrl || "-"}`);
```

**依据 3 · 源码核查**：[companion/server.py:78-94](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/companion/server.py#L78-L94)

Shortcuts 调用无超时。

<details>
<summary>查看原文（17行）</summary>

```text
                cmd = ["shortcuts", "run", name]
                inp = args.get("input")
                if inp:
                    p = subprocess.run(cmd, input=str(inp), text=True, capture_output=True, check=False)
                else:
                    p = subprocess.run(cmd, text=True, capture_output=True, check=False)
                return self._json(
                    200,
                    {
                        "ok": p.returncode == 0,
                        "result": {
                            "code": p.returncode,
                            "stdout": (p.stdout or "")[-4000:],
                            "stderr": (p.stderr or "")[-2000:],
                        },
                    },
                )
```

</details>

**依据 4 · 源码核查**：[companion/server.py:116-128](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/companion/server.py#L116-L128)

启动/Token 方式。

<details>
<summary>查看原文（13行）</summary>

```text
def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=18765)
    ap.add_argument("--token", default=os.environ.get("DSH_MAC_COMPANION_TOKEN", ""))
    args = ap.parse_args()
    Handler.token = args.token
    httpd = ThreadingHTTPServer((args.host, args.port), Handler)
    print(
        f"dsh-mac-companion listening on http://{args.host}:{args.port} token={'set' if args.token else 'off'}",
        flush=True,
    )
    httpd.serve_forever()
```

</details>

**依据 5 · 作者声明**：[README.md:9-16](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/README.md#L9-L16)

作者兼容记录。

```text
## 兼容性

| 字段 | 值 |
|------|----|
| **插件** | `dsh-mac-companion` **0.1.1** |
| **最低 dsh** | ≥ **0.1.2** |
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.2.0-rc.2`**） |
| **套件档位** | 可选（远程桥接） |
```

#### 缺口

- 未运行 Mac 服务或 DSH。
  **影响**：系统权限提示、稳定性及延迟未知。
  **进一步探讨**：隔离 Mac 用户/网络矩阵测试。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样试用而不把机器动作误认为已获用户授权？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先只用健康/通知，借可信本地隧道或受限网络和环境变量 token，确认 Mac 身份与请求日志；剪贴板读/写及 Shortcuts 仅在 DSH 调用审批明确覆盖时开放。未实现假设是在服务端对每个敏感 action 增加独立一次性用户授权、按身份/动作 allowlist、TLS 或本地隧道强制，并对 Shortcut 设超时/输出裁剪。用误调用和故障注入对照，测未经人同意动作数、token 泄漏、超时恢复与成功率。

#### 证据与依据

**依据 1 · 源码核查**：[companion/server.py:23-30](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/companion/server.py#L23-L30)

当前空 token 放行。

```text
class Handler(BaseHTTPRequestHandler):
    token = ""

    def _auth(self) -> bool:
        if not self.token:
            return True
        return self.headers.get("Authorization") == f"Bearer {self.token}"

```

**依据 2 · 源码核查**：[companion/server.py:72-105](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/companion/server.py#L72-L105)

confirm 只看请求字段。

<details>
<summary>查看原文（34行）</summary>

```text
            if action == "shortcut":
                if not confirm:
                    return self._json(400, {"ok": False, "error": "shortcut requires confirm=true"})
                name = str(args.get("name") or "")
                if not name:
                    return self._json(400, {"ok": False, "error": "name required"})
                cmd = ["shortcuts", "run", name]
                inp = args.get("input")
                if inp:
                    p = subprocess.run(cmd, input=str(inp), text=True, capture_output=True, check=False)
                else:
                    p = subprocess.run(cmd, text=True, capture_output=True, check=False)
                return self._json(
                    200,
                    {
                        "ok": p.returncode == 0,
                        "result": {
                            "code": p.returncode,
                            "stdout": (p.stdout or "")[-4000:],
                            "stderr": (p.stderr or "")[-2000:],
                        },
                    },
                )
            if action == "clipboard_read":
                text = run_osascript("the clipboard as text")
                return self._json(200, {"ok": True, "result": {"text": text[:8000]}})
            if action == "clipboard_write":
                if not confirm:
                    return self._json(400, {"ok": False, "error": "confirm=true required"})
                raw = str((args or {}).get("text") or "")[:8000]
                # Escape for AppleScript string literal
                esc = raw.replace("\\", "\\\\").replace('"', '\\"')
                run_osascript(f'set the clipboard to "{esc}"')
                return self._json(200, {"ok": True, "result": {"chars": len(raw)}})
```

</details>

**依据 3 · 源码核查**：[companion/server.py:116-128](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/companion/server.py#L116-L128)

默认部署边界。

<details>
<summary>查看原文（13行）</summary>

```text
def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=18765)
    ap.add_argument("--token", default=os.environ.get("DSH_MAC_COMPANION_TOKEN", ""))
    args = ap.parse_args()
    Handler.token = args.token
    httpd = ThreadingHTTPServer((args.host, args.port), Handler)
    print(
        f"dsh-mac-companion listening on http://{args.host}:{args.port} token={'set' if args.token else 'off'}",
        flush=True,
    )
    httpd.serve_forever()
```

</details>

**依据 4 · 源码核查**：[index.js:146-211](https://github.com/173787247/dsh-mac-companion/blob/80c0f61cedd985b19178bd45b2618f64a4eb96fc/index.js#L146-L211)

剪贴板工具入口。

<details>
<summary>查看原文（66行）</summary>

```text
  ctx.tools.register({
    name: "mac_clipboard_read",
    description: "Read macOS clipboard text via companion action=clipboard_read.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: { deviceId: { type: "string" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        { type: "text", text: v.ok === false ? v.error : v.result?.text || JSON.stringify(v) },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const device = resolveDevice(devices, args.deviceId);
        return await invoke(device, { action: "clipboard_read", timeoutMs, allowActions });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "mac clipboard read" }),
    presentResult: (_a, r) => ({ card: "generic", title: "mac clipboard read", content: r.content }),
  });

  ctx.tools.register({
    name: "mac_clipboard_write",
    description: "Set macOS clipboard text via companion (requires confirm=true).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["text"],
      properties: {
        deviceId: { type: "string" },
        text: { type: "string" },
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
        if (args.confirm !== true) {
          return { ok: false, error: "confirm=true required for clipboard_write" };
        }
        const device = resolveDevice(devices, args.deviceId);
        return await invoke(device, {
          action: "clipboard_write",
          args: { text: String(args.text ?? "") },
          confirm: true,
          timeoutMs,
          allowActions,
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "mac clipboard write" }),
    presentResult: (_a, r) => ({ card: "generic", title: "mac clipboard write", content: r.content }),
```

</details>

#### 缺口

- 服务端人在场授权/TLS/Shortcut 超时未实现。
  **影响**：不能计入现有安全性。
  **进一步探讨**：先隔离原型再做越权测试。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
