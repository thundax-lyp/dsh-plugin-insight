# dsh-wsl-notify

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[fc30cad](https://github.com/173787247/dsh-wsl-notify/tree/fc30cadb664a6b8934a73e470d84eb869a4ff1d3)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-notify)
<!-- END META -->

> **功能**：提供WSL到Windows短消息工具，支持阻塞MessageBox和BalloonTip回退，不自动验证任务完成或用户已读。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把桌面脚本变为统一工具与两分支，并处理Unicode/固定参数；Windows显示能力属于Forms和交互桌面，不计可靠投递创新。

> **主要限制**：[Q03](#research-q03) 进程ok不证明显示/已读，非终止错误可能不fallback；默认阻塞、无统一deadline/取消、静默裁剪和可解argv限制内容与采用。

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
  - [Q01 · 长任务提醒增加什么，何谓合格结果？](#detail-section-11)
  - [Q02 · 文字、模式与PowerShell回退怎样执行？](#detail-section-12)
  - [Q03 · 通知ok与失败回退能保证什么？](#detail-section-13)
  - [Q04 · 怎样试用提醒，并验证更准确的通知状态？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人用户明确允许在Windows桌面接收长任务非敏感短提醒，真实业务完成与用户已读另核。

手工桌面脚本或留浏览器看聊天；增量为模型工具交接，不是任务事件自动化或可靠消息服务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| MessageBox | 强可见短提醒 | 阻塞至关闭/超时，桌面依赖 |
| BalloonTip | 不要求用户关框 | 等4.5秒，策略可拦，失败可能变阻塞 |
| 结构化回执 | 看进程/模式结果 | 非显示/已读或业务完成证明 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/prompt、Node>=18 | 必需 | 工具注册与调用 | 兼容未验 |
| WSL/interop及PowerShell | 必需 | 跨系统起进程 | 非WSL返回失败 |
| Forms/Drawing与交互桌面 | 必需 | MessageBox/BalloonTip | 进程ok仍不证可见 |
| 用户授权短非敏感消息 | 采用前提 | 避免桌面披露/打扰 | 不用于秘密或唯一告警 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核桌面策略与interop | 用户同意非敏感提醒 |
| 测试 | 选模式发短测试消息 | 亲见内容与总等待 |
| 使用 | 以原任务日志确认后提醒 | 不用通知ok证明任务成功/已读 |
| 退出 | 停调用/禁用回原界面 | 已显示内容/框另处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Windows/宿主环境 | 策略/桌面与短消息核验 | 无额外推送账户，环境费未知 |
| 持续 | 每次PowerShell，toast睡4.5秒 | MessageBox关闭/提醒打扰 | 模型费与净反应改善未知 |
| 失败恢复 | fallback再进程/超时 | 核桌面/日志/重复框 | 无ID去重或收到ack |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 桌面桥 | 两Forms脚本和工具装配 | 真实显示/策略/用户知晓 |
| fallback | toast抛错再MessageBox | 非终止错误是否触发 |
| 任务提醒 | 短文本裁剪与模式 | 任务正确性/漏提醒改善 |

> **思考**：[Q03](#research-q03) 进程ok不证明显示/已读，非终止错误可能不fallback；默认阻塞、无统一deadline/取消、静默裁剪和可解argv限制内容与采用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把桌面脚本变为统一工具与两分支，并处理Unicode/固定参数；Windows显示能力属于Forms和交互桌面，不计可靠投递创新。

[Q02](#research-q02) 编码/脚本/渲染分层、固定execFile与Dispose值得保留；[Q03](#research-q03) 编码不是保密，进程结束不是可靠收据，总deadline与取消仍需验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 进程ok不证明显示/已读，非终止错误可能不fallback；默认阻塞、无统一deadline/取消、静默裁剪和可解argv限制内容与采用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 明确授权非敏感短提醒可试，接受阻塞与fallback，保留原日志；显示不符、重复打扰或等待超预算即停用回原界面。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

完整固定index/notify与公共wsl-host执行函数，复核正式findings；未执行通知、PowerShell或目标测试，实际桌面行为未知。

- 已检查：作者 README、包清单、源码路径 index.js、lib/notify.js、lib/wsl-host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定完整入口、notify与直接wsl-host执行路径；不把套件兼容表/作者说明作真实桌面验收，不审Windows策略实现。
- 下一步：[Q04](#research-q04) 非敏感消息测试实际显示、非终止错、超时/重复，测误成功和打扰，实验未执行。

**分析版本**

- **仓库**：[173787247/dsh-wsl-notify](https://github.com/173787247/dsh-wsl-notify)
- **版本号**：0.1.1（[固定提交 fc30cad](https://github.com/173787247/dsh-wsl-notify/tree/fc30cadb664a6b8934a73e470d84eb869a4ff1d3)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证方向为稳定ID、共享deadline/取消及明确requested/失败未知和截断说明；以错误成功/重复打扰验证，不把它当已读确认。

[Q04](#research-q04) 非敏感消息测试实际显示、非终止错、超时/重复，测误成功和打扰，实验未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 171 | — | — | 839 |
| .js | source | 3 | 207 | 181 | 8 | — |
| .js | test | 1 | 33 | 29 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-notify/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-notify/issues?q=is%3Aissue+created%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-notify/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：模型通知调用到Windows桌面结果能保证什么，怎样限定采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 长任务提醒增加什么，何谓合格结果？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是在个人WSL长任务结束后用Windows桌面短消息提醒离开浏览器的用户。相对手工PowerShell弹窗或只看聊天，它把标题/正文/模式和回执接成win_notify模型工具；没有监听任务完成事件自动推送，是否调用、何时调用及文字是否真实仍取决于Agent和用户授权。

默认MessageBox阻塞至关闭，toast实际是Forms NotifyIcon BalloonTip，不是持久可靠消息服务；作者称non-blocking指无需等用户关框，不是工具立即返回。正确消息在交互桌面可见才算显示成功，用户已知晓或任务真正完成需另证。插件不验证正文“完成”的业务状态，不应作为唯一可靠告警渠道。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:18-36](https://github.com/173787247/dsh-wsl-notify/blob/fc30cadb664a6b8934a73e470d84eb869a4ff1d3/index.js#L18-L36)

实际工具和prompt，不自动挂任务事件。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.systemPrompt.section({
    name: "tool:win_notify",
    order: 123,
    text: "Use win_notify to show a short Windows notification when a long WSL task finishes. mode=messagebox (default, blocking) or mode=toast (BalloonTip, non-blocking; falls back to MessageBox). Keep title/body brief; no secrets.",
  });

  ctx.tools.register({
    name: "win_notify",
    description: "Show a Windows notification from WSL: MessageBox (default, blocking) or toast BalloonTip (non-blocking).",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string", description: "Window / balloon title (default DSH)." },
        body: { type: "string", description: "Message body." },
        mode: {
          type: "string",
          enum: ["toast", "messagebox"],
          description: "toast = NotifyIcon BalloonTip (non-blocking); messagebox = blocking MessageBox (default).",
```

</details>

**依据 2 · 源码核查**：[lib/notify.js:17-48](https://github.com/173787247/dsh-wsl-notify/blob/fc30cadb664a6b8934a73e470d84eb869a4ff1d3/lib/notify.js#L17-L48)

两种桌面脚本，toast仍等待。

<details>
<summary>查看原文（32行）</summary>

```text
/** Blocking MessageBox (reliable fallback). */
export function buildNotifyScript(titleB64, bodyB64) {
  return [
    "Add-Type -AssemblyName System.Windows.Forms",
    ...decodeVars(titleB64, bodyB64),
    "[Windows.Forms.MessageBox]::Show($body, $title, 'OK', 'Information') | Out-Null",
    "'ok'",
  ].join("; ");
}

/**
 * Non-blocking tray BalloonTip via NotifyIcon.
 * Keeps the icon alive briefly so the balloon can show, then disposes.
 * On failure the caller should fall back to MessageBox.
 */
export function buildToastScript(titleB64, bodyB64) {
  return [
    "Add-Type -AssemblyName System.Windows.Forms",
    "Add-Type -AssemblyName System.Drawing",
    ...decodeVars(titleB64, bodyB64),
    "$ni = New-Object System.Windows.Forms.NotifyIcon",
    "$ni.Icon = [System.Drawing.SystemIcons]::Information",
    "$ni.Visible = $true",
    "$ni.BalloonTipTitle = $title",
    "$ni.BalloonTipText = $(if ([string]::IsNullOrEmpty($body)) { ' ' } else { $body })",
    "$ni.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::Info",
    "$ni.ShowBalloonTip(4000)",
    "Start-Sleep -Milliseconds 4500",
    "$ni.Visible = $false",
    "$ni.Dispose()",
    "'ok'",
  ].join("; ");
```

</details>

#### 缺口

- 无实际桌面显示/漏提醒与反应时间对照
  **影响**：不能证明更可靠通知或用户已收到
  **进一步探讨**：在实际桌面用非敏感消息区分显示、忽略和用户确认。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文字、模式与PowerShell回退怎样执行？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

入口依tools/systemPrompt，检测WSL并在非WSL返回结构化失败；标题/正文各按maxLen默认500裁剪，UTF8→base64后置于固定脚本解码，避免原消息作为PowerShell语法拼入。helper用固定系统候选或PATH的powershell.exe，execFile固定argv、NoProfile/NonInteractive，timeout与4MiB缓冲。编码是语法/Unicode处理，不是保密：base64仍在命令行参数可解。

MessageBox调用后输出ok；toast建NotifyIcon、ShowBalloonTip4000，睡4500ms后隐藏/Dispose。toast的runPowerShell抛错才另跑MessageBox，每次获得完整timeoutMs，不是共享总deadline；无execution AbortSignal接入。声明isConcurrencySafe false可让宿主串行，但不是插件内稳定ID/去重。函数拆分和固定参数可复用，仍需Windows interop、Forms/Drawing和交互桌面。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:13-16](https://github.com/173787247/dsh-wsl-notify/blob/fc30cadb664a6b8934a73e470d84eb869a4ff1d3/index.js#L13-L16)

配置。

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 30_000);
  const maxLen = positive(config.maxLen, 500);
  const wsl = detectWsl();
```

**依据 2 · 源码核查**：[index.js:53-75](https://github.com/173787247/dsh-wsl-notify/blob/fc30cadb664a6b8934a73e470d84eb869a4ff1d3/index.js#L53-L75)

裁剪、WSL、toast catch回退和返回。

<details>
<summary>查看原文（23行）</summary>

```text
    timeoutMs,
    isConcurrencySafe: () => false,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      const title = String(args?.title ?? "DSH").slice(0, maxLen);
      const body = String(args?.body ?? "Task finished.").slice(0, maxLen);
      const mode = normalizeMode(args?.mode);
      const { titleB64, bodyB64 } = encodeTitleBody(title, body);
      try {
        if (mode === "toast") {
          try {
            await runPowerShell(buildToastScript(titleB64, bodyB64), { timeoutMs });
            return { ok: true, title, mode: "toast" };
          } catch {
            await runPowerShell(buildNotifyScript(titleB64, bodyB64), { timeoutMs });
            return { ok: true, title, mode: "messagebox" };
          }
        }
        await runPowerShell(buildNotifyScript(titleB64, bodyB64), { timeoutMs });
        return { ok: true, title, mode: "messagebox" };
      } catch (err) {
        return { ok: false, title, mode, error: err instanceof Error ? err.message : String(err) };
      }
```

</details>

**依据 3 · 源码核查**：[lib/notify.js:1-24](https://github.com/173787247/dsh-wsl-notify/blob/fc30cadb664a6b8934a73e470d84eb869a4ff1d3/lib/notify.js#L1-L24)

编码与固定MessageBox脚本。

<details>
<summary>查看原文（24行）</summary>

```text
export function encodeTitleBody(title, body) {
  return {
    titleB64: Buffer.from(String(title ?? "DSH"), "utf8").toString("base64"),
    bodyB64: Buffer.from(String(body ?? ""), "utf8").toString("base64"),
  };
}

function decodeVars(titleB64, bodyB64) {
  const t = String(titleB64).replace(/'/g, "''");
  const b = String(bodyB64).replace(/'/g, "''");
  return [
    `$title = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${t}'))`,
    `$body = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${b}'))`,
  ];
}

/** Blocking MessageBox (reliable fallback). */
export function buildNotifyScript(titleB64, bodyB64) {
  return [
    "Add-Type -AssemblyName System.Windows.Forms",
    ...decodeVars(titleB64, bodyB64),
    "[Windows.Forms.MessageBox]::Show($body, $title, 'OK', 'Information') | Out-Null",
    "'ok'",
  ].join("; ");
```

</details>

**依据 4 · 源码核查**：[lib/notify.js:32-48](https://github.com/173787247/dsh-wsl-notify/blob/fc30cadb664a6b8934a73e470d84eb869a4ff1d3/lib/notify.js#L32-L48)

BalloonTip时长和Dispose。

<details>
<summary>查看原文（17行）</summary>

```text
export function buildToastScript(titleB64, bodyB64) {
  return [
    "Add-Type -AssemblyName System.Windows.Forms",
    "Add-Type -AssemblyName System.Drawing",
    ...decodeVars(titleB64, bodyB64),
    "$ni = New-Object System.Windows.Forms.NotifyIcon",
    "$ni.Icon = [System.Drawing.SystemIcons]::Information",
    "$ni.Visible = $true",
    "$ni.BalloonTipTitle = $title",
    "$ni.BalloonTipText = $(if ([string]::IsNullOrEmpty($body)) { ' ' } else { $body })",
    "$ni.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::Info",
    "$ni.ShowBalloonTip(4000)",
    "Start-Sleep -Milliseconds 4500",
    "$ni.Visible = $false",
    "$ni.Dispose()",
    "'ok'",
  ].join("; ");
```

</details>

**依据 5 · 源码核查**：[lib/wsl-host.js:34-42](https://github.com/173787247/dsh-wsl-notify/blob/fc30cadb664a6b8934a73e470d84eb869a4ff1d3/lib/wsl-host.js#L34-L42)

实际进程参数和timeout。

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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 通知ok与失败回退能保证什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

当前ok依据PowerShell进程未抛，而不检查stdout是不是ok，也不查询窗口/通知是否显示。脚本未设置ErrorActionPreference=Stop或关键调用-ErrorAction Stop，非终止错误有可能继续到末尾，不能保证所有显示失败触发catch/fallback；这是控制流限制，未在Windows复现。toast被通知策略拦、用户未看等也不能用子进程退出识别。

默认框会等待用户关，超时可让插件返回失败但并不统一证明窗口/用户状态；toast一次失败再MessageBox理论会占两个分支时限，宿主tool timeout如何取消内部进程本轮未验。裁剪没有在返回说明正文被截，可能丢尾部关键条件；format文本叫notified容易被理解成送达。默认no secrets只是提示，代码没有内容敏感检查，消息会显示桌面且通过argv，须用户限定非敏感。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:62-74](https://github.com/173787247/dsh-wsl-notify/blob/fc30cadb664a6b8934a73e470d84eb869a4ff1d3/index.js#L62-L74)

成功只看进程，两个分支分别timeout。

<details>
<summary>查看原文（13行）</summary>

```text
        if (mode === "toast") {
          try {
            await runPowerShell(buildToastScript(titleB64, bodyB64), { timeoutMs });
            return { ok: true, title, mode: "toast" };
          } catch {
            await runPowerShell(buildNotifyScript(titleB64, bodyB64), { timeoutMs });
            return { ok: true, title, mode: "messagebox" };
          }
        }
        await runPowerShell(buildNotifyScript(titleB64, bodyB64), { timeoutMs });
        return { ok: true, title, mode: "messagebox" };
      } catch (err) {
        return { ok: false, title, mode, error: err instanceof Error ? err.message : String(err) };
```

</details>

**依据 2 · 源码核查**：[lib/notify.js:18-24](https://github.com/173787247/dsh-wsl-notify/blob/fc30cadb664a6b8934a73e470d84eb869a4ff1d3/lib/notify.js#L18-L24)

缺强制终止错误配置。

```text
export function buildNotifyScript(titleB64, bodyB64) {
  return [
    "Add-Type -AssemblyName System.Windows.Forms",
    ...decodeVars(titleB64, bodyB64),
    "[Windows.Forms.MessageBox]::Show($body, $title, 'OK', 'Information') | Out-Null",
    "'ok'",
  ].join("; ");
```

**依据 3 · 源码核查**：[lib/notify.js:32-55](https://github.com/173787247/dsh-wsl-notify/blob/fc30cadb664a6b8934a73e470d84eb869a4ff1d3/lib/notify.js#L32-L55)

气泡及notified回执。

<details>
<summary>查看原文（24行）</summary>

```text
export function buildToastScript(titleB64, bodyB64) {
  return [
    "Add-Type -AssemblyName System.Windows.Forms",
    "Add-Type -AssemblyName System.Drawing",
    ...decodeVars(titleB64, bodyB64),
    "$ni = New-Object System.Windows.Forms.NotifyIcon",
    "$ni.Icon = [System.Drawing.SystemIcons]::Information",
    "$ni.Visible = $true",
    "$ni.BalloonTipTitle = $title",
    "$ni.BalloonTipText = $(if ([string]::IsNullOrEmpty($body)) { ' ' } else { $body })",
    "$ni.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::Info",
    "$ni.ShowBalloonTip(4000)",
    "Start-Sleep -Milliseconds 4500",
    "$ni.Visible = $false",
    "$ni.Dispose()",
    "'ok'",
  ].join("; ");
}

/** Prefer toast via BurntToast if present; MessageBox is the reliable fallback we ship. */
export function formatNotifyResult(value) {
  if (!value.ok) return `win_notify failed: ${value.error}`;
  const mode = value.mode ? ` mode=${value.mode}` : "";
  return `notified: ${value.title}${mode}`;
```

</details>

**依据 4 · 源码核查**：[index.js:57-60](https://github.com/173787247/dsh-wsl-notify/blob/fc30cadb664a6b8934a73e470d84eb869a4ff1d3/index.js#L57-L60)

静默裁剪。

```text
      const title = String(args?.title ?? "DSH").slice(0, maxLen);
      const body = String(args?.body ?? "Task finished.").slice(0, maxLen);
      const mode = normalizeMode(args?.mode);
      const { titleB64, bodyB64 } = encodeTitleBody(title, body);
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用提醒，并验证更准确的通知状态？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

明确允许个人Windows桌面显示非敏感短消息时可小范围试用，选择模式并接受toast失败可能变阻塞框，保留原聊天/任务日志。首次核interop/桌面/通知策略，发无敏感测试并亲眼看内容；任务业务完成仍查原日志，脚本ok不作为已读证明。未见额外推送账户/独立API，但Windows/宿主和模型调用成本未知。

持续每次起PowerShell、toast至少约4.5秒脚本睡眠以及可能人工关闭框，频繁调用有打扰和重复成本；失败可能再spawn/超时，查日志与桌面而非无条件重发。停止调用/禁用工具回原界面，不会撤销已显示内容或证明既有框关闭。

未验证假设是稳定通知ID、共享总deadline/取消、明确requested/failed/显示未知和截断说明，区别于现有两分支回执；它仍不能证明人已阅读。用正常、策略拦截、PowerShell非终止错、用户不关框和重复调用比较错误成功判断/重复打扰及等待。若没有减少误判或维护/确认负担更高则否定，当前未做实验。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:53-75](https://github.com/173787247/dsh-wsl-notify/blob/fc30cadb664a6b8934a73e470d84eb869a4ff1d3/index.js#L53-L75)

采用等待/回退/裁剪成本来源。

<details>
<summary>查看原文（23行）</summary>

```text
    timeoutMs,
    isConcurrencySafe: () => false,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      const title = String(args?.title ?? "DSH").slice(0, maxLen);
      const body = String(args?.body ?? "Task finished.").slice(0, maxLen);
      const mode = normalizeMode(args?.mode);
      const { titleB64, bodyB64 } = encodeTitleBody(title, body);
      try {
        if (mode === "toast") {
          try {
            await runPowerShell(buildToastScript(titleB64, bodyB64), { timeoutMs });
            return { ok: true, title, mode: "toast" };
          } catch {
            await runPowerShell(buildNotifyScript(titleB64, bodyB64), { timeoutMs });
            return { ok: true, title, mode: "messagebox" };
          }
        }
        await runPowerShell(buildNotifyScript(titleB64, bodyB64), { timeoutMs });
        return { ok: true, title, mode: "messagebox" };
      } catch (err) {
        return { ok: false, title, mode, error: err instanceof Error ? err.message : String(err) };
      }
```

</details>

**依据 2 · 源码核查**：[lib/notify.js:43-55](https://github.com/173787247/dsh-wsl-notify/blob/fc30cadb664a6b8934a73e470d84eb869a4ff1d3/lib/notify.js#L43-L55)

睡眠与文本回执是验证参照。

<details>
<summary>查看原文（13行）</summary>

```text
    "$ni.ShowBalloonTip(4000)",
    "Start-Sleep -Milliseconds 4500",
    "$ni.Visible = $false",
    "$ni.Dispose()",
    "'ok'",
  ].join("; ");
}

/** Prefer toast via BurntToast if present; MessageBox is the reliable fallback we ship. */
export function formatNotifyResult(value) {
  if (!value.ok) return `win_notify failed: ${value.error}`;
  const mode = value.mode ? ` mode=${value.mode}` : "";
  return `notified: ${value.title}${mode}`;
```

</details>

#### 缺口

- 没有真实Windows显示/取消/策略及成本对照
  **影响**：不能承诺可靠送达或净节时
  **进一步探讨**：实际环境非敏感案例核显示与进程结果、总等待/重复打扰，保留任务真相源。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
