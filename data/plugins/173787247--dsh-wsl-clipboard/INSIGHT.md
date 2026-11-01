# dsh-wsl-clipboard

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[7ad99b8](https://github.com/173787247/dsh-wsl-clipboard/tree/7ad99b892356c79b13db6ccb3c47e69536190a7f)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-clipboard)
<!-- END META -->

> **功能**：让 WSL 中的 DSH Agent 读写 Windows 文本剪贴板。

> **亮点**：[Q01](#research-q01) 提供模型可调用的跨环境文本入口，[Q02](#research-q02) 将其接到 Windows Forms。

> **主要限制**：[Q03](#research-q03) 超长写入先截断并覆盖，读取内容进入工具结果；秘密提示并非过滤。

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
  - [Q01 · WSL 剪贴板工具相对人工复制改变什么？](#detail-section-11)
  - [Q02 · 读取和写入如何从模型工具到 Windows 剪贴板？](#detail-section-12)
  - [Q03 · 截断、秘密、错误与恢复的边界是什么？](#detail-section-13)
  - [Q04 · 在何种环境下可试用，失败怎么办？](#detail-section-14)
  - [Q05 · 如何避免超长写入在用户不知情时覆盖剪贴板？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户授权 Agent 在 WSL 与 Windows 应用间传递短文本。

用户手工复制文本并核对目标应用。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 读取 | 返回 Windows 剪贴板文本 | 内容进入工具结果，超长截断 |
| 写入 | 通过 PowerShell 写文本 | 超长先截断并覆盖 |
| 限制 | 超时、缓冲和非并发 | 无秘密过滤或自动回滚 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| DSH tools 与 systemPrompt | 必需 | 注册工具和提示 | 无法接入 |
| WSL 与 Windows PowerShell | 必需 | 访问系统剪贴板 | 返回错误 |
| 已授权非敏感文本 | 采用前重要 | 避免暴露秘密 | 不应读取或写入 |
| 用户备份原内容 | 写入前重要 | 手动恢复 | 无自动回滚 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认授权并保存原剪贴板 | 敏感内容停止 |
| 配置 | 核 WSL、PowerShell 及长度上限 | 环境不符停止 |
| 试用 | 用短合成文本读写 | 检查 Windows 实际文本及截断 |
| 恢复 | 失败或未知时手动检查并恢复 | 不盲目重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 准备 | WSL 与桌面环境成本未知 | 核授权、互操作和原内容 | 共享剪贴板可能敏感 |
| 使用 | 每次 PowerShell 与结果 token 成本未知 | 核编码和长度 | 默认上限非命令行容量保证 |
| 恢复 | 无自动备份成本可量化 | 检查并手动恢复 | 超时与覆盖结果未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 文本桥 | Forms 读取与写入接线 | 实际编码和桌面权限 |
| 转义 | 写入经 UTF-8 base64 | 进程参数保密 |
| 截断 | 结构化字段标记 | 写入显示提示与内容无损 |

> **思考**：[Q03](#research-q03) 超长写入先截断并覆盖，读取内容进入工具结果；秘密提示并非过滤。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 提供模型可调用的跨环境文本入口，[Q02](#research-q02) 将其接到 Windows Forms。

[Q02](#research-q02) 注释中的备用读取未实现；[Q03](#research-q03) 写入截断后覆盖且渲染未显示该标记。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 超长写入先截断并覆盖，读取内容进入工具结果；秘密提示并非过滤。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 明确授权后，先备份并用非敏感短文本试读写；失败或结果未知时手动核对恢复。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码的注册、读取、写入及错误路径已检查；未运行 WSL 或剪贴板。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/clipboard.js、lib/wsl-host.js、SECURITY.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定 README、清单、工具与本仓库 helper；未运行目标、PowerShell 或访问剪贴板。
- 下一步：[Q05](#research-q05) 先核宿主呈现，再比较边界长度和失败时的剪贴板变化。

**分析版本**

- **仓库**：[173787247/dsh-wsl-clipboard](https://github.com/173787247/dsh-wsl-clipboard)
- **版本号**：0.1.0（[固定提交 7ad99b8](https://github.com/173787247/dsh-wsl-clipboard/tree/7ad99b892356c79b13db6ccb3c47e69536190a7f)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设超长写入前拒绝并请求用户决定可避免静默覆盖；未验证。

[Q05](#research-q05) 先核宿主呈现，再比较边界长度和失败时的剪贴板变化。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 179 | — | — | 879 |
| .js | source | 3 | 226 | 205 | 2 | — |
| .js | test | 1 | 28 | 25 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-clipboard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-clipboard/issues?q=is%3Aissue+created%3A2026-10-02T12%3A37%3A53.293Z..2026-11-01T12%3A37%3A53.293Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-clipboard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T12%3A37%3A53.293Z..2026-11-01T12%3A37%3A53.293Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 WSL 剪贴板桥接、截断与隐私边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · WSL 剪贴板工具相对人工复制改变什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:5-17 描述让 WSL 中的 DSH Agent 读写 Windows 剪贴板；相对用户手工在 Linux 与 Windows 应用间复制非敏感短文本，该组件提供模型可调用的桥接入口。Windows 剪贴板和 PowerShell 本身不是插件发明；自动访问共享剪贴板也可能让模型看到本不打算分享的内容，不能根据入口推断节时或安全。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-17](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/README.md#L5-L17)

作者描述跨 WSL 与 Windows 的用途。

<details>
<summary>查看原文（13行）</summary>

````text
DeepSeek Harness tool: **`wsl_clipboard`** — read or write the **Windows** clipboard from an agent in WSL.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)

## Where it sits

Reads or writes the Windows clipboard from the agent in WSL.

```mermaid
flowchart LR
  agent["dsh agent in WSL"] --> tool["wsl_clipboard"] --> win["Windows clipboard"]
````

</details>

**依据 2 · 源码核查**：[index.js:18-30](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/index.js#L18-L30)

提示指引与工具注册。

<details>
<summary>查看原文（13行）</summary>

```text
  ctx.systemPrompt.section({
    name: "tool:wsl_clipboard",
    order: 117,
    text: [
      "Use wsl_clipboard to read or write the Windows clipboard from WSL.",
      "Prefer it when the user asks to copy a path, command, or snippet between Linux and Windows apps.",
      "Do not put secrets into the clipboard unless the user explicitly asks.",
    ].join(" "),
  });

  ctx.tools.register({
    name: "wsl_clipboard",
    description: "Read or write the Windows clipboard from WSL (UTF-8 text).",
```

</details>

**依据 3 · 源码核查**：[index.js:64-79](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/index.js#L64-L79)

读取并返回剪贴板文本。

<details>
<summary>查看原文（16行）</summary>

```text
    async execute(args) {
      if (!wsl) {
        return { ok: false, action: args?.action || "get", error: "not running in WSL" };
      }
      const action = args?.action === "set" ? "set" : "get";
      try {
        if (action === "get") {
          const { stdout } = await runPowerShell(getClipboardScriptSafe(), { timeoutMs });
          const clamped = clampText(stdout, maxChars);
          return {
            ok: true,
            action: "get",
            text: clamped.text,
            chars: clamped.text.length,
            truncated: clamped.truncated,
          };
```

</details>

#### 缺口

- 未测试实际用户工作流
  **影响**：不能证明节时、编码或隐私效果
  **进一步探讨**：用非敏感合成文本与手工复制对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 读取和写入如何从模型工具到 Windows 剪贴板？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

index.js:13-16 取默认 15 秒、100000 字符并检测 WSL；28-64 注册 get/set 工具且声明非并发，64-98 根据动作调用 helper、截断并返回结构化结果。clipboard.js:21-27 的实际读取脚本只调用 Add-Type 和 Forms GetText，尽管上一行注释声称有 Get-Clipboard 备用路径，代码没有该分支；30-37 将写入文本 UTF-8 编为 base64 后由脚本解码并 SetText。wsl-host.js:34-41 以 execFile 运行 PowerShell，限制 4 MiB 缓冲及超时。未运行 WSL、PowerShell 或真实读写。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:13-16](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/index.js#L13-L16)

默认限制和 WSL 检测。

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const maxChars = positive(config.maxChars, 100_000);
  const wsl = detectWsl();
```

**依据 2 · 源码核查**：[index.js:28-64](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/index.js#L28-L64)

工具接口和非并发声明。

<details>
<summary>查看原文（37行）</summary>

```text
  ctx.tools.register({
    name: "wsl_clipboard",
    description: "Read or write the Windows clipboard from WSL (UTF-8 text).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["action"],
      properties: {
        action: {
          type: "string",
          enum: ["get", "set"],
          description: "get = read Windows clipboard; set = write text to it.",
        },
        text: {
          type: "string",
          description: "Required when action=set. Plain text to place on the clipboard.",
        },
      },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ok: { type: "boolean" },
          action: { type: "string" },
          text: { type: "string" },
          chars: { type: "integer" },
          truncated: { type: "boolean" },
          error: { type: "string" },
        },
      },
      render: (_args, value) => [{ type: "text", text: formatClipboardResult(value.action || "get", value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => false,
    async execute(args) {
```

</details>

**依据 3 · 源码核查**：[index.js:64-98](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/index.js#L64-L98)

get/set 实际路径及错误。

<details>
<summary>查看原文（35行）</summary>

```text
    async execute(args) {
      if (!wsl) {
        return { ok: false, action: args?.action || "get", error: "not running in WSL" };
      }
      const action = args?.action === "set" ? "set" : "get";
      try {
        if (action === "get") {
          const { stdout } = await runPowerShell(getClipboardScriptSafe(), { timeoutMs });
          const clamped = clampText(stdout, maxChars);
          return {
            ok: true,
            action: "get",
            text: clamped.text,
            chars: clamped.text.length,
            truncated: clamped.truncated,
          };
        }
        if (typeof args?.text !== "string") {
          return { ok: false, action: "set", error: "missing text" };
        }
        const clamped = clampText(args.text, maxChars);
        const b64 = encodeForPowerShell(clamped.text);
        await runPowerShell(setClipboardScriptFromBase64(b64), { timeoutMs });
        return {
          ok: true,
          action: "set",
          chars: clamped.text.length,
          truncated: clamped.truncated,
        };
      } catch (err) {
        return {
          ok: false,
          action,
          error: err instanceof Error ? err.message : String(err),
        };
```

</details>

**依据 4 · 源码核查**：[lib/clipboard.js:9-10](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/lib/clipboard.js#L9-L10)

将写入文本编码为 UTF-8 base64。

```text
export function encodeForPowerShell(text) {
  return Buffer.from(String(text ?? ""), "utf8").toString("base64");
```

**依据 5 · 源码核查**：[lib/clipboard.js:20-37](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/lib/clipboard.js#L20-L37)

读取只有 Forms 路径，写入解码和 SetText。

<details>
<summary>查看原文（18行）</summary>

```text
/** Prefer Add-Type System.Windows.Forms; fall back to Get-Clipboard. */
export function getClipboardScriptSafe() {
  return [
    "Add-Type -AssemblyName System.Windows.Forms",
    "$t = [System.Windows.Forms.Clipboard]::GetText()",
    "if ($null -eq $t) { $t = '' }",
    "[Console]::Out.Write($t)",
  ].join("; ");
}

export function setClipboardScriptFromBase64(b64) {
  const safe = String(b64).replace(/'/g, "''");
  return [
    "Add-Type -AssemblyName System.Windows.Forms",
    `$bytes = [Convert]::FromBase64String('${safe}')`,
    "$text = [Text.Encoding]::UTF8.GetString($bytes)",
    "[System.Windows.Forms.Clipboard]::SetText($text)",
    "'ok'",
```

</details>

**依据 6 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/lib/wsl-host.js#L34-L41)

PowerShell 进程参数、超时和缓冲。

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

- 未运行真实环境及字符编码验证
  **影响**：不能保证互操作、编码或桌面权限
  **进一步探讨**：用隔离 WSL 和合成 Unicode 读写测试。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 截断、秘密、错误与恢复的边界是什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

clipboard.js:3-6 在 JavaScript 字符串长度上截断，index.js:70-86 对读取结果及写入输入均截断；超长 set 先截断再覆盖现有剪贴板，结构化结果虽含 truncated，clipboard.js:41-54 的 set 文本展示仅含 chars 与 status，没有展示截断标记。读取文本会进入工具结果；systemPrompt 仅提示不要复制秘密，SECURITY.md:1-3 的不得返回秘密也是规则声明，源码没有内容级过滤。base64 限制脚本插值风险但写入值仍出现在子进程命令参数；PowerShell 失败、超时或截断后未实现原内容备份、回滚和写后验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/clipboard.js:3-10](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/lib/clipboard.js#L3-L10)

截断和 base64 编码。

```text
export function clampText(text, max = MAX_CHARS) {
  const s = String(text ?? "");
  if (s.length <= max) return { text: s, truncated: false };
  return { text: s.slice(0, max), truncated: true };
}

export function encodeForPowerShell(text) {
  return Buffer.from(String(text ?? ""), "utf8").toString("base64");
```

**依据 2 · 源码核查**：[index.js:70-98](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/index.js#L70-L98)

读写截断及异常返回。

<details>
<summary>查看原文（29行）</summary>

```text
        if (action === "get") {
          const { stdout } = await runPowerShell(getClipboardScriptSafe(), { timeoutMs });
          const clamped = clampText(stdout, maxChars);
          return {
            ok: true,
            action: "get",
            text: clamped.text,
            chars: clamped.text.length,
            truncated: clamped.truncated,
          };
        }
        if (typeof args?.text !== "string") {
          return { ok: false, action: "set", error: "missing text" };
        }
        const clamped = clampText(args.text, maxChars);
        const b64 = encodeForPowerShell(clamped.text);
        await runPowerShell(setClipboardScriptFromBase64(b64), { timeoutMs });
        return {
          ok: true,
          action: "set",
          chars: clamped.text.length,
          truncated: clamped.truncated,
        };
      } catch (err) {
        return {
          ok: false,
          action,
          error: err instanceof Error ? err.message : String(err),
        };
```

</details>

**依据 3 · 源码核查**：[lib/clipboard.js:41-55](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/lib/clipboard.js#L41-L55)

渲染读取内容，写入渲染不含截断标记。

<details>
<summary>查看原文（15行）</summary>

```text
export function formatClipboardResult(action, payload) {
  const lines = [`clipboard ${action}`];
  if (payload.ok === false) {
    lines.push(`error: ${payload.error || "failed"}`);
    return lines.join("\n");
  }
  if (action === "get") {
    lines.push(`chars: ${payload.chars ?? 0}${payload.truncated ? " (truncated)" : ""}`);
    lines.push("---");
    lines.push(payload.text ?? "");
  } else {
    lines.push(`chars: ${payload.chars ?? 0}`);
    lines.push("status: set");
  }
  return lines.join("\n");
```

</details>

**依据 4 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/lib/wsl-host.js#L34-L41)

脚本作为进程参数及超时。

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

**依据 5 · 源码核查**：[index.js:18-25](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/index.js#L18-L25)

秘密限制是提示词指引。

```text
  ctx.systemPrompt.section({
    name: "tool:wsl_clipboard",
    order: 117,
    text: [
      "Use wsl_clipboard to read or write the Windows clipboard from WSL.",
      "Prefer it when the user asks to copy a path, command, or snippet between Linux and Windows apps.",
      "Do not put secrets into the clipboard unless the user explicitly asks.",
    ].join(" "),
```

**依据 6 · 作者声明**：[SECURITY.md:1-3](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/SECURITY.md#L1-L3)

作者的秘密处理要求。

```text
# Security

`dsh-wsl-clipboard` must not log, print, or return secrets (tokens, passwords, PEM keys).
```

#### 缺口

- 未测试终止错误、长文本及真实进程可见性
  **影响**：不能保证秘密隔离、无损写入或回滚
  **进一步探讨**：以无敏感内容测试长度、失败和实际剪贴板。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 在何种环境下可试用，失败怎么办？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:1-17 指定 Node >=18 和 DSH 包；wsl-host.js:21-26 使用环境变量或内核版本识别 WSL，34-41 依赖 Windows PowerShell。首次需核 WSL 互操作与桌面会话，每次启动子进程、人工核对内容并承担共享剪贴板覆盖与模型上下文风险，具体时间和 token 成本未知。只在明确授权下用已备份的非敏感短文本试读写，确认实际 Windows 侧结果；敏感内容、超长、失败或状态未知时停用该操作并手动恢复，避免盲目重试。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-17](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/package.json#L1-L17)

包身份和 Node 版本。

<details>
<summary>查看原文（17行）</summary>

```text
{
  "name": "dsh-wsl-clipboard",
  "version": "0.1.0",
  "description": "DeepSeek Harness tool: read/write the Windows clipboard from WSL.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/173787247/dsh-wsl-clipboard.git"
  },
  "bugs": {
    "url": "https://github.com/173787247/dsh-wsl-clipboard/issues"
  },
  "homepage": "https://github.com/173787247/dsh-wsl-clipboard#readme",
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
```

</details>

**依据 2 · 源码核查**：[lib/wsl-host.js:21-26](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/lib/wsl-host.js#L21-L26)

WSL 判定。

```text
export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) return true;
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
```

**依据 3 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/lib/wsl-host.js#L34-L41)

PowerShell 依赖。

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

**依据 4 · 源码核查**：[index.js:70-98](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/index.js#L70-L98)

截断与错误处理。

<details>
<summary>查看原文（29行）</summary>

```text
        if (action === "get") {
          const { stdout } = await runPowerShell(getClipboardScriptSafe(), { timeoutMs });
          const clamped = clampText(stdout, maxChars);
          return {
            ok: true,
            action: "get",
            text: clamped.text,
            chars: clamped.text.length,
            truncated: clamped.truncated,
          };
        }
        if (typeof args?.text !== "string") {
          return { ok: false, action: "set", error: "missing text" };
        }
        const clamped = clampText(args.text, maxChars);
        const b64 = encodeForPowerShell(clamped.text);
        await runPowerShell(setClipboardScriptFromBase64(b64), { timeoutMs });
        return {
          ok: true,
          action: "set",
          chars: clamped.text.length,
          truncated: clamped.truncated,
        };
      } catch (err) {
        return {
          ok: false,
          action,
          error: err instanceof Error ? err.message : String(err),
        };
```

</details>

#### 缺口

- 未验证互操作及恢复成本
  **影响**：不能保证桌面环境可用或恢复成功
  **进一步探讨**：隔离测试并预留人工恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何避免超长写入在用户不知情时覆盖剪贴板？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有 maxChars、结构化 truncated 和非并发声明，但写入先截断再调用 SetText，文本渲染未展示 truncated；仅增加长度配置不能改变已发生的截断覆盖。未验证设想是对超长写入先拒绝且保留旧内容，返回原始长度、上限和明确的用户决策，再由用户主动缩短或确认另一个显式操作；读取敏感内容同样先由用户授权，不记录正文。对照现有行为，以边界长度、Unicode 代理对、PowerShell 失败和旧剪贴板含重要内容测试无意覆盖、误判及任务耗时；若仍写入截断值、不能保证原内容未变或负担高于手工复制则否定。先核宿主呈现和外部授权是否已有等价阻断。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:62-64](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/index.js#L62-L64)

已有非并发声明。

```text
    timeoutMs,
    isConcurrencySafe: () => false,
    async execute(args) {
```

**依据 2 · 源码核查**：[index.js:81-92](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/index.js#L81-L92)

截断后写入并返回 truncated。

<details>
<summary>查看原文（12行）</summary>

```text
        if (typeof args?.text !== "string") {
          return { ok: false, action: "set", error: "missing text" };
        }
        const clamped = clampText(args.text, maxChars);
        const b64 = encodeForPowerShell(clamped.text);
        await runPowerShell(setClipboardScriptFromBase64(b64), { timeoutMs });
        return {
          ok: true,
          action: "set",
          chars: clamped.text.length,
          truncated: clamped.truncated,
        };
```

</details>

**依据 3 · 源码核查**：[lib/clipboard.js:41-54](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/lib/clipboard.js#L41-L54)

写结果渲染不显示 truncated。

<details>
<summary>查看原文（14行）</summary>

```text
export function formatClipboardResult(action, payload) {
  const lines = [`clipboard ${action}`];
  if (payload.ok === false) {
    lines.push(`error: ${payload.error || "failed"}`);
    return lines.join("\n");
  }
  if (action === "get") {
    lines.push(`chars: ${payload.chars ?? 0}${payload.truncated ? " (truncated)" : ""}`);
    lines.push("---");
    lines.push(payload.text ?? "");
  } else {
    lines.push(`chars: ${payload.chars ?? 0}`);
    lines.push("status: set");
  }
```

</details>

**依据 4 · 源码核查**：[lib/clipboard.js:3-6](https://github.com/173787247/dsh-wsl-clipboard/blob/7ad99b892356c79b13db6ccb3c47e69536190a7f/lib/clipboard.js#L3-L6)

现有长度截断方式。

```text
export function clampText(text, max = MAX_CHARS) {
  const s = String(text ?? "");
  if (s.length <= max) return { text: s, truncated: false };
  return { text: s.slice(0, max), truncated: true };
```

#### 缺口

- 未查所有宿主 UI 和无原型
  **影响**：新增性、正确性与收益未知
  **进一步探讨**：核宿主呈现后做边界及失败对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
