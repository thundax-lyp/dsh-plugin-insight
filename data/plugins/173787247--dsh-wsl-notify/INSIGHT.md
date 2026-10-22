# dsh-wsl-notify

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[3c83e89](https://github.com/173787247/dsh-wsl-notify/tree/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-notify)
<!-- END META -->

> **实现功能**：从WSL调用Windows MessageBox或NotifyIcon气泡显示短文本，气泡抛错时回退阻塞消息框。

> **核心亮点**：把跨WSL桌面脚本接成工具/两分支，非自动事件通知或可靠投递。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：进程ok非实际显示，非终止错误可能不fallback；默认阻塞与分支总等待/取消未统一，裁剪不明且argv不保密。详见[Q02](#research-q02)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 面向谁，通知主链是什么？](#detail-section-11)
  - [Q02 · 增量和显示/失败/阻塞关键边界是什么？](#detail-section-12)
  - [Q03 · 依赖、隐私和读者步骤是什么？](#detail-section-13)
  - [Q04 · 三阶段成本和效果如何衡量？](#detail-section-14)
  - [Q05 · 工程点、通知状态收据假设和采用建议？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：明确允许在Windows桌面显示非敏感任务提示，真实业务状态另核。

原UI/系统通知或手工PowerShell可替代；工具省接线，也增加阻塞/打扰和未知重复风险。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| MessageBox | 默认桌面弹框 | 阻塞到关闭，timeout非收据 |
| 气泡 | NotifyIcon显示请求 | 脚本等4.5秒，策略可拦 |
| fallback | 抛错后MessageBox | 非终止错不一定触发，可能再阻塞 |
| 编码 | UTF8 base64脚本参数 | 不保密/不自动证明任务完成 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18与DSH tools/systemPrompt | 必需 | win_notify工具/指引 | 需匹配真实schema，非自动完成事件订阅 |
| WSL/Windows interop/PowerShell | 必需 | 从Linux执行桌面脚本 | env检测不证明interop可用 |
| Forms/可见交互桌面 | 必需 | MessageBox或NotifyIcon | 后台/锁屏/策略可不显示，退出不等人看到 |
| System.Drawing/通知策略 | BalloonTip必需 | 图标和气泡 | 失败可能触发阻塞MessageBox或静默未被识别 |
| 无敏感短标题/正文授权 | 必需 | Windows可见消息 | base64 argv不保密，旁人可见 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定宿主/WSL/桌面，明确允许弹窗 | 用无敏感短文本，考虑打扰/锁屏 |
| 选择 | 显式messagebox或toast | toast失败可能变阻塞，不当纯异步保证 |
| 调用 | 仅在明确任务状态后请求提醒 | 通知文案非任务成功证据，结果只是尝试 |
| 恢复 | 无显示/超时先核桌面/策略和原业务状态 | 不盲重弹/重做业务，重要待办回原UI |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Windows桌面/interop，金额未知 | 权限/策略和无敏感短消息核对 | 无独立推送或模型API服务 |
| 持续使用 | 每次spawn PowerShell；toast脚本睡4.5秒 | 消息打扰与MessageBox人工关闭 | toast不等工具立即返回 |
| 失败恢复 | timeout/fallback再spawn/核桌面 | 区分显示未知/被拦/用户未看 | 无幂等/收到ack，重复可打扰 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 桌面桥 | Forms两种显示脚本 | 消息实际可见/用户知晓 |
| fallback | toast抛错后MessageBox | 非终止错被识别与总等待 |
| 简短提醒 | 文本截断/工具调用 | 真实反应时间或漏提醒改善 |

> **思考**：进程ok非实际显示，非终止错误可能不fallback；默认阻塞与分支总等待/取消未统一，裁剪不明且argv不保密。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把跨WSL桌面脚本接成工具/两分支，非自动事件通知或可靠投递。详见[Q01](#research-q01)与[Q02](#research-q02)。

把跨WSL桌面脚本接成工具/两分支，非自动事件通知或可靠投递。详见[Q01](#research-q01)与[Q02](#research-q02)。

纯编码/脚本/格式函数与Host注册分开、execFile固定argv、子进程timeout和气泡dispose可复用；编码防语法混入不等argv保密，脚本结束也不等可靠通知收据。

<a id="detail-section-5"></a>

### 1.4 主要限制

进程ok非实际显示，非终止错误可能不fallback；默认阻塞与分支总等待/取消未统一，裁剪不明且argv不保密。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

明确授权非敏感短消息可试用，接受阻塞/fallback并保留原UI，不当唯一可靠通道。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。WSL到Windows桌面的固定脚本封装贡献可核；进程成功不证明显示或读者知晓，状态收据与统一取消/时限方案尚未验证。

- 已检查：作者 README、包清单、源码路径 index.js、lib/notify.js、lib/wsl-host.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定index/notify完整实现及同hash公共wsl-host，未运行PowerShell/通知/目标测试，不保证各Windows桌面显示。
- 下一步：进一步探讨以受控桌面/被拦/非终止错/超时/取消/Unicode夹具核状态，再比较实际感知与打扰。

**分析版本**

- **仓库**：[173787247/dsh-wsl-notify](https://github.com/173787247/dsh-wsl-notify)
- **版本号**：0.1.1（[固定提交 3c83e89](https://github.com/173787247/dsh-wsl-notify/tree/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨明确通知状态/稳定ID与总deadline、错误/取消协议和截断说明，仍不证明人已阅读。详见[Q05](#research-q05)。

进一步探讨以受控桌面/被拦/非终止错/超时/取消/Unicode夹具核状态，再比较实际感知与打扰。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 171 | — | — | 839 |
| .js | source | 3 | 207 | 181 | 8 | — |
| .js | test | 1 | 33 | 29 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-notify/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-notify/issues?q=is%3Aissue+created%3A2026-09-22T07%3A47%3A33.776Z..2026-10-22T07%3A47%3A33.776Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-notify/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A47%3A33.776Z..2026-10-22T07%3A47%3A33.776Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核WSL桌面消息工具的阻塞/fallback与实际显示保证，区分尝试、进程完成和用户知晓。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向谁，通知主链是什么？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向在WSL跑DSH、想在Windows桌面获得一条短提示的人。输入title/body与mode，输出ok/title/实际分支mode或错误。合格结果需正确桌面可见并且文案对应真实任务状态；工具不验证任务完成，也未订阅任务事件，必须由模型/读者调用。

加载时detectWsl，注册win_notify和提示。标题/正文默认各500个JS字符裁剪，UTF8 base64放固定PowerShell脚本；默认MessageBox阻塞直到用户按OK，toast为Forms NotifyIcon BalloonTip，保图标4.5秒后dispose。toast runPowerShell reject才再调MessageBox。执行带默认30秒timeout、非并发安全声明；公共wsl-host副本hash与已读实现一致，原生execFile运行。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:13-26](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/index.js#L13-L26)

注册/提示。

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 30_000);
  const maxLen = positive(config.maxLen, 500);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_notify",
    order: 123,
    text: "Use win_notify to show a short Windows notification when a long WSL task finishes. mode=messagebox (default, blocking) or mode=toast (BalloonTip, non-blocking; falls back to MessageBox). Keep title/body brief; no secrets.",
  });

  ctx.tools.register({
    name: "win_notify",
    description: "Show a Windows notification from WSL: MessageBox (default, blocking) or toast BalloonTip (non-blocking).",
```

</details>

**依据 2 · 源码核查**：[index.js:53-75](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/index.js#L53-L75)

执行/裁剪/fallback。

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

**依据 3 · 源码核查**：[lib/notify.js:1-24](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/lib/notify.js#L1-L24)

编码/MessageBox。

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

**依据 4 · 源码核查**：[lib/notify.js:32-48](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/lib/notify.js#L32-L48)

气泡脚本。

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

**依据 5 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/lib/wsl-host.js#L34-L41)

执行上限。

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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 增量和显示/失败/阻塞关键边界是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

增量是把WSL到Windows消息显示封装为短文本工具和两分支，固定脚本/base64减少文字混入命令语法的机会，不是新通知或可靠投递协议。

成功只按PowerShell进程Promise，未检查stderr/stdout、NotifyIcon事件或用户看见；脚本无ErrorActionPreference Stop/显式try/catch退出码，非终止错误可能继续输出ok并退出，toast就不会fallback。注释“BurntToast优先”实际无该实现，只是BalloonTip，不应叫现代通知中心持久toast。气泡请求本身也不证明策略/免打扰/桌面会显示。

messagebox默认阻塞，30秒无人关闭可能timeout；toast脚本仍等4.5秒，失败后MessageBox可再等同一个timeout，外层工具timeout不保证覆盖整个fallback总时长。execute未收exec.signal，所以取消不直接传播到子进程。错误/超时可能已显示过，重试可再打扰，工具没有稳定通知ID/查询或撤销。

maxLen静默UTF16slice未返回truncated，可能裁掉关键文本/代理对，配置无上限和整数约束；完整文字以base64 argv存在、不是加密，Windows弹窗也有旁观泄露。模型提示no secrets不是强制授权。isConcurrencySafefalse仅宿主参考，不保证其他进程不同时弹窗。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:57-74](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/index.js#L57-L74)

裁剪/结果/fallback。

<details>
<summary>查看原文（18行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/notify.js:18-24](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/lib/notify.js#L18-L24)

无错误协议/阻塞。

```text
export function buildNotifyScript(titleB64, bodyB64) {
  return [
    "Add-Type -AssemblyName System.Windows.Forms",
    ...decodeVars(titleB64, bodyB64),
    "[Windows.Forms.MessageBox]::Show($body, $title, 'OK', 'Information') | Out-Null",
    "'ok'",
  ].join("; ");
```

**依据 3 · 源码核查**：[lib/notify.js:32-55](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/lib/notify.js#L32-L55)

气泡和文案。

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

**依据 4 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/lib/wsl-host.js#L34-L41)

timeout/argv。

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

**依据 5 · 源码核查**：[index.js:86-88](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/index.js#L86-L88)

配置仅正数。

```text
function positive(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
```

#### 缺口

- 具体桌面/锁屏/免打扰下实际显示和用户知晓未由进程退出证明。
  **影响**：ok/notified不能作可靠完成或收到确认。
  **进一步探讨**：可先把attempted/display_requested/failed/unknown分开，核允许的桌面事件与原UI状态，不自动重复。
- PowerShell非终止错误/超时/fallback总体与取消副作用边界需真实运行契约。
  **影响**：可能静默未显示或超时后重复弹窗。
  **进一步探讨**：可先统一终止错误和总deadline/取消，再用无敏感受控桌面研究显示/失败状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、隐私和读者步骤是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

包0.1.1/Node>=18需WSL env/内核检测、PowerShell和Forms/Drawing。窗口属于当前Windows用户桌面，不是Web浏览器通知，也不会在没有交互桌面的所有环境可靠显示。没有自动后台任务/事件监听，属于模型工具。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18与DSH tools/systemPrompt | 必需 | win_notify工具/指引 | 需匹配真实schema，非自动完成事件订阅 |
| WSL/Windows interop/PowerShell | 必需 | 从Linux执行桌面脚本 | env检测不证明interop可用 |
| Forms/可见交互桌面 | 必需 | MessageBox或NotifyIcon | 后台/锁屏/策略可不显示，退出不等人看到 |
| System.Drawing/通知策略 | BalloonTip必需 | 图标和气泡 | 失败可能触发阻塞MessageBox或静默未被识别 |
| 无敏感短标题/正文授权 | 必需 | Windows可见消息 | base64 argv不保密，旁人可见 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定宿主/WSL/桌面，明确允许弹窗 | 用无敏感短文本，考虑打扰/锁屏 |
| 选择 | 显式messagebox或toast | toast失败可能变阻塞，不当纯异步保证 |
| 调用 | 仅在明确任务状态后请求提醒 | 通知文案非任务成功证据，结果只是尝试 |
| 恢复 | 无显示/超时先核桌面/策略和原业务状态 | 不盲重弹/重做业务，重要待办回原UI |

默认文案Task finished只是默认文本，用户不应据收到通知反推任务已验收。桥接不调用第三方推送API，但文本会进入Windows进程参数/桌面，敏感内容仍不适用。本轮不弹窗/发送。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-4](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/package.json#L1-L4)

版本。

```text
{
  "name": "dsh-wsl-notify",
  "version": "0.1.1",
  "description": "DeepSeek Harness tool: Windows MessageBox notification from WSL.",
```

**依据 2 · 源码核查**：[package.json:16-18](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/package.json#L16-L18)

Node。

```text
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/notify.test.js" },
  "files": ["index.js", "lib", "cordis.patch.yml", "README.md", "README.zh.md", "LICENSE",
```

**依据 3 · 源码核查**：[lib/wsl-host.js:21-27](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/lib/wsl-host.js#L21-L27)

WSL判定。

```text
export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) return true;
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
  }
```

**依据 4 · 源码核查**：[lib/notify.js:20-22](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/lib/notify.js#L20-L22)

Forms桌面。

```text
    "Add-Type -AssemblyName System.Windows.Forms",
    ...decodeVars(titleB64, bodyB64),
    "[Windows.Forms.MessageBox]::Show($body, $title, 'OK', 'Information') | Out-Null",
```

**依据 5 · 源码核查**：[lib/notify.js:34-43](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/lib/notify.js#L34-L43)

Drawing/NotifyIcon。

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 三阶段成本和效果如何衡量？

**研究主题**：效果与总成本

#### 完整回答

本地桥无需独立推送账号/服务费用，仍有模型工具回合、PowerShell进程、4.5秒图标维持或人工关MessageBox。阻塞通知可以更醒目也更打扰，不等提高效率；toast也非后台调度服务。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Windows桌面/interop，金额未知 | 权限/策略和无敏感短消息核对 | 无独立推送或模型API服务 |
| 持续使用 | 每次spawn PowerShell；toast脚本睡4.5秒 | 消息打扰与MessageBox人工关闭 | toast不等工具立即返回 |
| 失败恢复 | timeout/fallback再spawn/核桌面 | 区分显示未知/被拦/用户未看 | 无幂等/收到ack，重复可打扰 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 桌面桥 | Forms两种显示脚本 | 消息实际可见/用户知晓 |
| fallback | toast抛错后MessageBox | 非终止错被识别与总等待 |
| 简短提醒 | 文本截断/工具调用 | 真实反应时间或漏提醒改善 |

失败恢复要区分原任务状态与显示状态，重复弹窗不是补业务验收。与看原UI/手工通知比较应计漏提醒、反应时间、打扰和全部fallback等待，而不是工具ok比率。

#### 证据与依据

**依据 1 · 源码核查**：[lib/notify.js:22-23](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/lib/notify.js#L22-L23)

MessageBox阻塞。

```text
    "[Windows.Forms.MessageBox]::Show($body, $title, 'OK', 'Information') | Out-Null",
    "'ok'",
```

**依据 2 · 源码核查**：[lib/notify.js:43-47](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/lib/notify.js#L43-L47)

4.5秒等待。

```text
    "$ni.ShowBalloonTip(4000)",
    "Start-Sleep -Milliseconds 4500",
    "$ni.Visible = $false",
    "$ni.Dispose()",
    "'ok'",
```

**依据 3 · 源码核查**：[index.js:62-74](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/index.js#L62-L74)

fallback链。

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

#### 缺口

- 无各桌面实际显示率、反应时间、打扰和总等待对照。
  **影响**：不能承诺可靠非阻塞提醒或固定省时。
  **进一步探讨**：可用明确授权无敏感短消息比较MessageBox/气泡/原UI，记实际感知和恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程点、通知状态收据假设和采用建议？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

纯编码/脚本/格式函数与Host注册分开、execFile固定argv、子进程timeout和气泡dispose可复用；编码防语法混入不等argv保密，脚本结束也不等可靠通知收据。

可探讨未验证的“通知状态收据”。统一终止错误/明确JSON结果和实际分支，保持总deadline/exec.signal；stable ID去重且超时保unknown，不在状态未知时自动换阻塞模式。UI明确气泡与MessageBox的阻塞/策略差异，截断先拒绝或显式返回，文字通过stdin等减少argv暴露。可见/关闭事件可辅助但不能证明读者理解，重要待办仍保留视觉状态。代价是跨桌面事件/interop/隐私和状态维护。可用无交互桌面、被拦气泡、非终止错、超时前已显示、取消和长Unicode文本夹具研究。

推荐trial，限明确允许的非敏感短提示并保留原UI；需接受默认MessageBox阻塞与toast fallback，不用作唯一故障/待办通道。继续从错误协议、总deadline/取消和状态措辞入手；显示未知、乱码/裁剪或打扰超预期就停，不重复业务或盲重弹。

推导基于Q02的进程成功、显示请求和读者知晓三种状态混同，以及失败后再弹阻塞框的重复风险。相对当前二值ok+fallback，新方案若在相同授权夹具中减少“已显示却记失败后重弹”和“进程ok却误称已收到”，同时总等待受限且无需记录敏感正文，可支持状态透明度增量；若仍把非终止错当显示成功、取消后继续弹框、未知结果重试造成重复，或为追踪收据增加超过收益的人工/隐私负担，则不能支持该设计优势。即使通过，也只证明显示状态管理，不能证明人已阅读理解或原业务完成。

#### 证据与依据

**依据 1 · 源码核查**：[lib/notify.js:1-24](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/lib/notify.js#L1-L24)

纯编码/脚本。

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

**依据 2 · 源码核查**：[lib/notify.js:32-48](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/lib/notify.js#L32-L48)

dispose/收据起点。

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

**依据 3 · 源码核查**：[index.js:62-74](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/index.js#L62-L74)

状态/fallback起点。

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

**依据 4 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-notify/blob/3c83e8964ff6a639b58d4a36bbbb5b784c4453b9/lib/wsl-host.js#L34-L41)

deadline/输入通道起点。

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

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
