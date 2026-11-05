# dsh-mac-companion

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[7c1c886](https://github.com/173787247/dsh-mac-companion/tree/7c1c886c1d08e6b16a09594495e8cdf1dc780591)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-mac-companion)
<!-- END META -->

> **功能**：通过 Mac Companion 在 DSH 发通知、运行 Shortcuts 和读写剪贴板。

> **亮点**：[Q01](#research-q01) 把 Mac 通知、Shortcut 与剪贴板操作接成结构化 DSH 工具。

> **主要限制**：[Q02](#research-q02) 远端确认是请求字段，服务可能无 token，超时也没有远端停止证明。

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
  - [Q01 · Mac Companion 能把哪些操作带入 DSH 会话？](#detail-section-11)
  - [Q02 · 远端确认与权限能控制哪些副作用？](#detail-section-12)
  - [Q03 · 怎样验收并减少错误执行或重试？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户需要从 WSL 的 DSH 会话调用另一台已配置的 Mac。

在 Mac 手动操作，或通过受控的原生服务调用。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 健康与通知 | 查看服务和发送测试通知 | 需核对实际端点与权限 |
| Shortcuts 与剪贴板 | 触发 Mac 操作 | 确认字段与系统权限决定能否执行，超时须查远端 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 与共享客户端 | 必需 | 挂载远端工具 | 依赖解析失败无法加载 |
| 隔离 macOS Companion 和系统权限 | 必需 | 执行 Mac 动作 | 健康可达仍可能动作失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户配置隔离 Mac 服务和授权 | 使用合成内容 |
| 验收 | 用户查健康和测试动作 | 核对实际设备和后置状态 |
| 退出 | 用户停用工具并回 Mac | 超时后先核对实际副作用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 设备资源未知 | 准备服务、凭据和系统权限 | 须隔离测试环境 |
| 持续 | 运行开销未知 | 复核动作和结果 | 剪贴板输出可能含敏感数据 |
| 失败 | 恢复时间未知 | 查 Mac 原工具和进程 | 避免不明状态下重试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 跨机动作 | 实际服务可调用 Mac 通知、Shortcuts 和剪贴板 | 真实兼容性和操作节时 |

> **思考**：[Q02](#research-q02) 远端确认是请求字段，服务可能无 token，超时也没有远端停止证明。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把 Mac 通知、Shortcut 与剪贴板操作接成结构化 DSH 工具。

[Q02](#research-q02) 服务确认值的真假转换及无 timeout 的 Shortcut 路径限制恢复语义。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 远端确认是请求字段，服务可能无 token，超时也没有远端停止证明。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 仅用隔离 Mac 和无敏感通知开始，执行状态不明时回本机。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持工具和随仓服务机制，实际授权、系统权限和执行未验收。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、companion/server.py、lib/companion_client.js、package-lock.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定组件、协议、锁文件及随仓 Python 服务源码。未运行宿主、Mac 服务、快捷指令或测试。
- 下一步：覆盖错误凭据、无 token、非布尔确认、Mac 权限、慢 Shortcut 和真实回读。

**分析版本**

- **仓库**：[173787247/dsh-mac-companion](https://github.com/173787247/dsh-mac-companion)
- **版本号**：0.1.1（[固定提交 7c1c886](https://github.com/173787247/dsh-mac-companion/tree/7c1c886c1d08e6b16a09594495e8cdf1dc780591)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 用名称约束、严格确认和操作 ID 对照错动作及重试副作用。

覆盖错误凭据、无 token、非布尔确认、Mac 权限、慢 Shortcut 和真实回读。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 124 | — | — | 499 |
| .js | source | 2 | 220 | 209 | 2 | — |
| .js | test | 1 | 15 | 14 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-mac-companion/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-mac-companion/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-mac-companion/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户能否对隔离 Mac 执行指定动作，并核对身份、授权和实际结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Mac Companion 能把哪些操作带入 DSH 会话？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有 macOS 设备的用户可从 DSH 探测 Companion、发通知、运行指定 Shortcut、读写剪贴板文本。相比直接发 HTTP 或在 Mac 手动操作，插件将固定动作与输入结构绑定到工具，远端脚本才真正调用 osascript 或 shortcuts。合格结果应观察实际 Mac 上的通知、目标 Shortcut 退出及剪贴板内容，不能只看健康探测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-39](https://github.com/173787247/dsh-mac-companion/blob/7c1c886c1d08e6b16a09594495e8cdf1dc780591/README.md#L18-L39)

工具和部署说明。

<details>
<summary>查看原文（22行）</summary>

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
````

</details>

**依据 2 · 源码核查**：[index.js:72-103](https://github.com/173787247/dsh-mac-companion/blob/7c1c886c1d08e6b16a09594495e8cdf1dc780591/index.js#L72-L103)

通知工具接线。

<details>
<summary>查看原文（32行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[companion/server.py:65-105](https://github.com/173787247/dsh-mac-companion/blob/7c1c886c1d08e6b16a09594495e8cdf1dc780591/companion/server.py#L65-L105)

远端实际动作。

<details>
<summary>查看原文（41行）</summary>

```text
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
```

</details>

#### 缺口

- 未测真实 Mac 会话和通知呈现
  **影响**：不能确认跨主机收益或权限兼容
  **进一步探讨**：以合成通知和测试 Shortcut 对照远端结果

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 远端确认与权限能控制哪些副作用？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

工具从配置或环境选端点和 token，共享客户端通过再导出接入。剪贴板写入在插件入口要求 confirm === true，Shortcut 入口向依赖转发布尔值。随仓服务用 bool(body.get("confirm"))，直接调用时非空字符串等也能通过其真假检查，未绑定真人或请求身份。Bearer 在 token 为空时不检查，默认回环；服务自身是 ThreadingHTTPServer，无 TLS 接线。服务端可运行提供名称的 Shortcut，未见按名称列表；运行无显式 timeout，客户端超时不能证明远端停止。读剪贴板输出正文前 8000 字符，写入会替换剪贴板内容。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:11-32](https://github.com/173787247/dsh-mac-companion/blob/7c1c886c1d08e6b16a09594495e8cdf1dc780591/index.js#L11-L32)

端点、共享配置与动作范围。

<details>
<summary>查看原文（22行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[index.js:108-140](https://github.com/173787247/dsh-mac-companion/blob/7c1c886c1d08e6b16a09594495e8cdf1dc780591/index.js#L108-L140)

Shortcut 布尔参数转发。

<details>
<summary>查看原文（33行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[index.js:174-207](https://github.com/173787247/dsh-mac-companion/blob/7c1c886c1d08e6b16a09594495e8cdf1dc780591/index.js#L174-L207)

写入工具确认。

<details>
<summary>查看原文（34行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[lib/companion_client.js:1-7](https://github.com/173787247/dsh-mac-companion/blob/7c1c886c1d08e6b16a09594495e8cdf1dc780591/lib/companion_client.js#L1-L7)

共享客户端接线。

```text
/** Re-export shared Companion protocol client from dsh-wsl-common. */
export {
  listDevices,
  resolveDevice,
  health,
  invoke,
} from "dsh-wsl-common/companion_client.js";
```

**依据 5 · 源码核查**：[package-lock.json:18-24](https://github.com/173787247/dsh-mac-companion/blob/7c1c886c1d08e6b16a09594495e8cdf1dc780591/package-lock.json#L18-L24)

共享包锁定。

```text
    "node_modules/dsh-wsl-common": {
      "version": "0.2.0",
      "resolved": "git+ssh://git@github.com/173787247/dsh-wsl-common.git#3d2ce64e4cbbe708cc26d31fe3dbf7b80dbd2781",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
```

**依据 6 · 源码核查**：[companion/server.py:23-29](https://github.com/173787247/dsh-mac-companion/blob/7c1c886c1d08e6b16a09594495e8cdf1dc780591/companion/server.py#L23-L29)

认证条件。

```text
class Handler(BaseHTTPRequestHandler):
    token = ""

    def _auth(self) -> bool:
        if not self.token:
            return True
        return self.headers.get("Authorization") == f"Bearer {self.token}"
```

**依据 7 · 源码核查**：[companion/server.py:55-105](https://github.com/173787247/dsh-mac-companion/blob/7c1c886c1d08e6b16a09594495e8cdf1dc780591/companion/server.py#L55-L105)

服务端真假判断、运行与剪贴板。

<details>
<summary>查看原文（51行）</summary>

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
```

</details>

**依据 8 · 源码核查**：[companion/server.py:116-128](https://github.com/173787247/dsh-mac-companion/blob/7c1c886c1d08e6b16a09594495e8cdf1dc780591/companion/server.py#L116-L128)

绑定地址和 HTTP 服务。

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

- 未核对安装后的共享客户端行为、网络保护和真实 macOS 权限
  **影响**：不能认为请求已获真人授权或超时已取消
  **进一步探讨**：隔离实例测试错误 token、非布尔确认、权限拒绝和慢 Shortcut

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样验收并减少错误执行或重试？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

先在隔离 Mac 用户环境确认 Python、通知及 Shortcuts 权限，默认仅回环或受控通道，只操作无敏感剪贴板和可弃用 Shortcut。停用插件后用 Mac 原工具核对副作用，超时时先查远端结果。可验证服务端固定动作和 Shortcut 名称清单、严格布尔以及独立操作 ID，比较同名错误、响应丢失和重试造成的重复执行。若不能收敛错动作或重复调用，或合法调用开销过大则弃用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-40](https://github.com/173787247/dsh-mac-companion/blob/7c1c886c1d08e6b16a09594495e8cdf1dc780591/README.md#L28-L40)

作者的服务和 DSH 配置。

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

**依据 2 · 源码核查**：[companion/server.py:72-105](https://github.com/173787247/dsh-mac-companion/blob/7c1c886c1d08e6b16a09594495e8cdf1dc780591/companion/server.py#L72-L105)

当前远端动作与结果基线。

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

**依据 3 · 源码核查**：[index.js:25-38](https://github.com/173787247/dsh-mac-companion/blob/7c1c886c1d08e6b16a09594495e8cdf1dc780591/index.js#L25-L38)

Host 停用及接入。

<details>
<summary>查看原文（14行）</summary>

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

  ctx.systemPrompt.section({
    name: "tool:mac-companion",
    order: 141,
    text: "dsh-mac-companion calls a macOS companion daemon over HTTP (/v1/health, /v1/invoke). Start companion/server.py on the Mac. Prefer mac_companion_status before notify/shortcut/clipboard.",
```

</details>

#### 缺口

- 未运行 macOS 或目标保护改法
  **影响**：接入、恢复和改法成本未知
  **进一步探讨**：用虚拟值、可弃用 Shortcut 与隔离网络验证

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
