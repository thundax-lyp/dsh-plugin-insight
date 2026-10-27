# dsh-wsl-clipboard

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[1aeac41](https://github.com/173787247/dsh-wsl-clipboard/tree/1aeac41d93ee494267b83095b4c8217226d7bd33)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-clipboard)
<!-- END META -->

> **实现功能**：在WSL内通过PowerShell读取或设置Windows文本剪贴板，带字符裁剪与结构化结果。

> **核心亮点**：把常见跨WSL脚本接线变为工具，base64分离数据与脚本，非新剪贴板隔离技术。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：进程成功非剪贴板回读，PowerShell非终止错误/stderr未核；set截断展示不明，base64 argv不保密且全局状态无CAS。详见[Q02](#research-q02)。

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
  - [Q01 · 面向谁，读写Windows文本剪贴板如何工作？](#detail-section-11)
  - [Q02 · 贡献和失败/敏感/截断边界是什么？](#detail-section-12)
  - [Q03 · 依赖、权限和读者流程是什么？](#detail-section-13)
  - [Q04 · 三阶段成本和效果如何比较？](#detail-section-14)
  - [Q05 · 工程点、文本交接收据假设与采用判断是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：明确授权复制非敏感短路径/命令/片段到Windows应用，或读取指定共享剪贴板文本。

手工PowerShell/WSL复制可替代；工具减少接线，也增加模型读取共享剪贴板与成功误判风险。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| get | 读Windows文本 | 敏感共享状态会进模型，先全取再裁 |
| set | 写UTF8文本 | 覆盖/裁剪且无回读/CAS |
| 编码执行 | base64固定脚本 | argv可见，不是秘密存储 |
| 失败报告 | 超时/exec错误 | 非终止PowerShell错未必捕获 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18及匹配DSH tools/systemPrompt | 必需 | 注册工具与指引 | 工具schema需匹配真实宿主 |
| WSL环境/Windows interop | 必需 | 执行Windows PowerShell | 非WSL明确返回错误 |
| PowerShell/System.Windows.Forms及交互桌面剪贴板 | 必需 | GetText/SetText | 锁定/忙/程序集失败需核，不等空文本 |
| 当前剪贴板读/覆盖授权 | 必需 | 全局文本共享状态 | get可把敏感内容带进模型；set替换旧内容 |
| 字符/命令行与编码限制 | 必需 | base64脚本参数/结果 | maxChars不是实际可写长度保证 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定WSL/Host，保留原剪贴板，选非敏感短文本 | 用户明确决定读还是覆盖 |
| 写入 | 显式set已审文本 | 到目标Windows应用核完整内容，不只status set |
| 读取 | 明确授权后get | 只读实际需要内容，截断/空串核来源 |
| 恢复 | 未知先查实际剪贴板 | 不盲重复覆盖，原内容备份由用户管理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | WSL/PowerShell环境，金额未知 | interop/宿主/Unicode短文本核对 | 无独立模型API调用 |
| 持续使用 | 每次起PowerShell、UTF8/base64与结果tokens | 保护全局剪贴板/核文本 | 100k字符默认不等命令行可容纳 |
| 失败恢复 | 复核文本、恢复旧内容 | 区分空串/失败/截断/未知覆盖 | 无自动回滚/CAS/写后hash |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 文本桥 | WSL interop到Forms文本剪贴板 | 各桌面/编码/长文本完整性 |
| 数据转义 | UTF8 base64隔开脚本字符串 | 不隐藏命令行里的敏感数据 |
| 成功/截断 | 结构化ok/截断字段 | stderr非终止错误/真实写回内容 |

> **思考**：进程成功非剪贴板回读，PowerShell非终止错误/stderr未核；set截断展示不明，base64 argv不保密且全局状态无CAS。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把常见跨WSL脚本接线变为工具，base64分离数据与脚本，非新剪贴板隔离技术。详见[Q01](#research-q01)与[Q02](#research-q02)。

把常见跨WSL脚本接线变为工具，base64分离数据与脚本，非新剪贴板隔离技术。详见[Q01](#research-q01)与[Q02](#research-q02)。

纯clamp/编码/固定脚本与系统执行分离、execFile argv、超时/缓冲、结构化错误和非并发声明值得复用。应保留base64防语法混入价值，同时说明argv保密和PowerShell错误协议未解决。

<a id="detail-section-5"></a>

### 1.4 主要限制

进程成功非剪贴板回读，PowerShell非终止错误/stderr未核；set截断展示不明，base64 argv不保密且全局状态无CAS。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

明确授权非敏感短文本可试用，保留原内容并核Windows实际文本，异常未知先停。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持UTF8/base64固定脚本的WSL文本剪贴板桥；进程退出不证明真实剪贴板内容，截断、编码与并发覆盖仍需明确。终止错误协议、写后hash与安全文本通道尚未验证。

- 已检查：作者 README、包清单、源码路径 index.js、lib/clipboard.js、lib/wsl-host.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定index及clipboard/wsl-host相关完整实现；未运行PowerShell、目标测试或读写本机剪贴板，不保证真实编码/桌面行为。
- 下一步：进一步探讨以Unicode/空串/长度/忙剪贴板/错误/取消/并发改写夹具核实际内容，再比较完整性和人时。

**分析版本**

- **仓库**：[173787247/dsh-wsl-clipboard](https://github.com/173787247/dsh-wsl-clipboard)
- **版本号**：0.1.0（[固定提交 1aeac41](https://github.com/173787247/dsh-wsl-clipboard/tree/1aeac41d93ee494267b83095b4c8217226d7bd33)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨stdin/安全通道和错误/编码协议、写后hash收据与显式截断，跨interop/隐私成本未验证。详见[Q05](#research-q05)。

进一步探讨以Unicode/空串/长度/忙剪贴板/错误/取消/并发改写夹具核实际内容，再比较完整性和人时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 179 | — | — | 879 |
| .js | source | 3 | 226 | 205 | 2 | — |
| .js | test | 1 | 28 | 25 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-clipboard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-clipboard/issues?q=is%3Aissue+created%3A2026-09-22T07%3A38%3A59.771Z..2026-10-22T07%3A38%3A59.771Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-clipboard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A38%3A59.771Z..2026-10-22T07%3A38%3A59.771Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核WSL文本剪贴板读写，区分数据编码、真实桌面副作用、失败/截断与完整性收据。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向谁，读写Windows文本剪贴板如何工作？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向在WSL运行DSH、想把路径/命令/短文本复制到Windows应用或明确读取当前Windows剪贴板的人。输入get或set/text，输出文本/字符数/截断或错误。合格结果需正确Windows桌面、原文完整且授权明确；文本桥不处理图片/文件列表，也不把命令复制当执行。

加载时detectWsl读env或/proc，注册wsl_clipboard与固定指引。get调用Forms Clipboard.GetText，stdout再clamp；set先JS UTF16字符slice，再UTF8 base64拼固定PowerShell脚本解码SetText。runPowerShell优先系统路径，execFile -NoProfile/-NonInteractive/-Command，15秒timeout/4MiB maxBuffer；无WSL返回错误，工具声明非并发安全。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:13-26](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/index.js#L13-L26)

环境/指引。

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const maxChars = positive(config.maxChars, 100_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:wsl_clipboard",
    order: 117,
    text: [
      "Use wsl_clipboard to read or write the Windows clipboard from WSL.",
      "Prefer it when the user asks to copy a path, command, or snippet between Linux and Windows apps.",
      "Do not put secrets into the clipboard unless the user explicitly asks.",
    ].join(" "),
  });
```

</details>

**依据 2 · 源码核查**：[index.js:62-99](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/index.js#L62-L99)

两动作。

<details>
<summary>查看原文（38行）</summary>

```text
    timeoutMs,
    isConcurrencySafe: () => false,
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
      }
```

</details>

**依据 3 · 源码核查**：[lib/clipboard.js:3-10](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/lib/clipboard.js#L3-L10)

截断/编码。

```text
export function clampText(text, max = MAX_CHARS) {
  const s = String(text ?? "");
  if (s.length <= max) return { text: s, truncated: false };
  return { text: s.slice(0, max), truncated: true };
}

export function encodeForPowerShell(text) {
  return Buffer.from(String(text ?? ""), "utf8").toString("base64");
```

**依据 4 · 源码核查**：[lib/clipboard.js:21-38](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/lib/clipboard.js#L21-L38)

Forms固定脚本。

<details>
<summary>查看原文（18行）</summary>

```text
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
  ].join("; ");
```

</details>

**依据 5 · 源码核查**：[lib/wsl-host.js:14-41](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/lib/wsl-host.js#L14-L41)

检测/execFile。

<details>
<summary>查看原文（28行）</summary>

```text
export function windowsBin(name, { exists = existsSync } = {}) {
  for (const p of WINDOWS_BINS[name] || []) {
    if (exists(p)) return p;
  }
  return name;
}

export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) return true;
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
  }
}

export function distroName({ env = process.env } = {}) {
  return env.WSL_DISTRO_NAME || "WSL";
}

export async function runPowerShell(script, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("powershell.exe");
  const { stdout, stderr } = await execFileAsync(
    bin,
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { timeout: timeoutMs, windowsHide: true, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
  return { stdout: String(stdout ?? ""), stderr: String(stderr ?? "") };
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 贡献和失败/敏感/截断边界是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

增量是把原本需手写WSL到PowerShell的剪贴板文本动作变为结构化工具，UTF8 base64减少输入当脚本解释的机会，非新剪贴板技术。

工具把进程Promise未reject当成功，忽略stderr和set stdout，也不写后GetText验证。脚本未设ErrorActionPreference Stop/try-catch退出码，PowerShell非终止错误条件下可能继续输出ok；因此oktrue不能单独证明Clipboard实际写入/读取成功。getSafe注释声称fallback Get-Clipboard，实际无该分支。getSafe也未设置OutputEncoding/Console编码，而未使用的getClipboardScript有设置，Unicode输出仍需固定运行时核对。

set会无提示截断后覆盖Windows全局剪贴板，结构结果有truncated，但formatClipboardResult set只显示chars/status，不展示截断标记；slice按UTF16代码单元，可能在代理对中间裁开，长文本base64 -Command还受系统命令行限制。get先收完整stdout至4MiB才clamp，maxChars不约束Windows侧读取。

base64是编码不是保密，完整写入文本在进程命令行参数中；get会把用户可能从其他应用复制的内容返回模型，提示只约束“不主动放秘密”并非代码授权检查。isConcurrencySafefalse只给宿主调度参考，无法阻止Windows其他应用并发改剪贴板，无CAS/备份/来源隔离。exec不收signal，仅子进程timeout，超时/异常后全局结果可能未知。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:70-98](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/index.js#L70-L98)

忽略stderr/无readback。

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

**依据 2 · 源码核查**：[lib/clipboard.js:21-38](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/lib/clipboard.js#L21-L38)

无fallback/无终止错协议。

<details>
<summary>查看原文（18行）</summary>

```text
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
  ].join("; ");
```

</details>

**依据 3 · 源码核查**：[lib/clipboard.js:13-17](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/lib/clipboard.js#L13-L17)

未使用编码版。

```text
export function getClipboardScript() {
  return [
    "$OutputEncoding = [Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8",
    "[Console]::Out.Write([System.Windows.Forms.Clipboard]::GetText())",
  ].join("; ");
```

**依据 4 · 源码核查**：[lib/clipboard.js:41-54](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/lib/clipboard.js#L41-L54)

set展示无truncated。

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

**依据 5 · 源码核查**：[lib/clipboard.js:3-6](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/lib/clipboard.js#L3-L6)

UTF16slice。

```text
export function clampText(text, max = MAX_CHARS) {
  const s = String(text ?? "");
  if (s.length <= max) return { text: s, truncated: false };
  return { text: s.slice(0, max), truncated: true };
```

**依据 6 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/lib/wsl-host.js#L34-L41)

base64argv/timeout/buffer。

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

**依据 7 · 源码核查**：[index.js:63-64](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/index.js#L63-L64)

宿主非并发标记。

```text
    isConcurrencySafe: () => false,
    async execute(args) {
```

#### 缺口

- 实际Forms剪贴板、非终止错误和跨WSL输出编码/长命令边界未由成功退出证明。
  **影响**：不能承诺ok即完整文本写入，空串不一定真为空。
  **进一步探讨**：可先显式错误/编码协议与写后hash回读，再用无敏感Unicode/空串/忙剪贴板/长度阶梯核。
- 全局剪贴板并发/来源授权不由工具强制。
  **影响**：读可能外泄敏感文本，写可覆盖别的应用刚复制内容。
  **进一步探讨**：可从用户明确范围/原内容备份和版本/hash检查入手，未知先看Windows实际状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、权限和读者流程是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

包0.1.0/Node>=18需真实WSL interop和Windows PowerShell/Forms，detectWsl是环境启发式而非系统可用性检查；检测true也可能Windows不可达。工具硬注入tools/systemPrompt，未关闭指引配置。原生子进程不是Host sandboxPolicy执行，拥有当前Windows用户剪贴板权限。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18及匹配DSH tools/systemPrompt | 必需 | 注册工具与指引 | 工具schema需匹配真实宿主 |
| WSL环境/Windows interop | 必需 | 执行Windows PowerShell | 非WSL明确返回错误 |
| PowerShell/System.Windows.Forms及交互桌面剪贴板 | 必需 | GetText/SetText | 锁定/忙/程序集失败需核，不等空文本 |
| 当前剪贴板读/覆盖授权 | 必需 | 全局文本共享状态 | get可把敏感内容带进模型；set替换旧内容 |
| 字符/命令行与编码限制 | 必需 | base64脚本参数/结果 | maxChars不是实际可写长度保证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定WSL/Host，保留原剪贴板，选非敏感短文本 | 用户明确决定读还是覆盖 |
| 写入 | 显式set已审文本 | 到目标Windows应用核完整内容，不只status set |
| 读取 | 明确授权后get | 只读实际需要内容，截断/空串核来源 |
| 恢复 | 未知先查实际剪贴板 | 不盲重复覆盖，原内容备份由用户管理 |

适合用户明确要复制的非敏感短文本，get属于读取另一应用共享状态，不能因为工具只读就自动采集。写后再把实际文本返给模型也可能增加隐私面，收据可只核hash/长度而非再次暴露全文。本轮未调用真实剪贴板。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-4](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/package.json#L1-L4)

版本。

```text
{
  "name": "dsh-wsl-clipboard",
  "version": "0.1.0",
  "description": "DeepSeek Harness tool: read/write the Windows clipboard from WSL.",
```

**依据 2 · 源码核查**：[package.json:16-18](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/package.json#L16-L18)

Node声明。

```text
  "engines": {
    "node": ">=18"
  },
```

**依据 3 · 源码核查**：[index.js:10-26](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/index.js#L10-L26)

依赖/提示。

<details>
<summary>查看原文（17行）</summary>

```text
export const name = "dsh-wsl-clipboard";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const maxChars = positive(config.maxChars, 100_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:wsl_clipboard",
    order: 117,
    text: [
      "Use wsl_clipboard to read or write the Windows clipboard from WSL.",
      "Prefer it when the user asks to copy a path, command, or snippet between Linux and Windows apps.",
      "Do not put secrets into the clipboard unless the user explicitly asks.",
    ].join(" "),
  });
```

</details>

**依据 4 · 源码核查**：[lib/wsl-host.js:21-41](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/lib/wsl-host.js#L21-L41)

检测与原生执行。

<details>
<summary>查看原文（21行）</summary>

```text
export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) return true;
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
  }
}

export function distroName({ env = process.env } = {}) {
  return env.WSL_DISTRO_NAME || "WSL";
}

export async function runPowerShell(script, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("powershell.exe");
  const { stdout, stderr } = await execFileAsync(
    bin,
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { timeout: timeoutMs, windowsHide: true, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
  return { stdout: String(stdout ?? ""), stderr: String(stderr ?? "") };
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 三阶段成本和效果如何比较？

**研究主题**：效果与总成本

#### 完整回答

它减少手写脚本但每次spawn PowerShell，仍有Windows interop启动与模型工具回合成本；输入base64约4/3增长，get全文返回会消耗上下文。无独立外部API调用，不等操作成本为零。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | WSL/PowerShell环境，金额未知 | interop/宿主/Unicode短文本核对 | 无独立模型API调用 |
| 持续使用 | 每次起PowerShell、UTF8/base64与结果tokens | 保护全局剪贴板/核文本 | 100k字符默认不等命令行可容纳 |
| 失败恢复 | 复核文本、恢复旧内容 | 区分空串/失败/截断/未知覆盖 | 无自动回滚/CAS/写后hash |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 文本桥 | WSL interop到Forms文本剪贴板 | 各桌面/编码/长文本完整性 |
| 数据转义 | UTF8 base64隔开脚本字符串 | 不隐藏命令行里的敏感数据 |
| 成功/截断 | 结构化ok/截断字段 | stderr非终止错误/真实写回内容 |

默认15秒和非并发标记降低局部等待/冲突机会，不能撤回已覆盖的全局状态。对照应在同样短文本/Unicode/目标应用比较完整性与总手工时间，不能只统计工具返回成功次数。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/lib/wsl-host.js#L34-L41)

spawn限制。

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

**依据 2 · 源码核查**：[index.js:70-91](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/index.js#L70-L91)

全文/字符截断。

<details>
<summary>查看原文（22行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/clipboard.js:47-54](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/lib/clipboard.js#L47-L54)

展示。

```text
  if (action === "get") {
    lines.push(`chars: ${payload.chars ?? 0}${payload.truncated ? " (truncated)" : ""}`);
    lines.push("---");
    lines.push(payload.text ?? "");
  } else {
    lines.push(`chars: ${payload.chars ?? 0}`);
    lines.push("status: set");
  }
```

#### 缺口

- 无跨环境文本完整率、时延及相较手动PowerShell/系统复制的人时对照。
  **影响**：不能承诺长文本/Unicode普遍可靠或固定省时。
  **进一步探讨**：可用无敏感基准文本测真实剪贴板回读/目标应用内容和恢复成本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程点、文本交接收据假设与采用判断是什么？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

纯clamp/编码/固定脚本与系统执行分离、execFile argv、超时/缓冲、结构化错误和非并发声明值得复用。应保留base64防语法混入价值，同时说明argv保密和PowerShell错误协议未解决。

可探讨未验证的“文本交接收据”。通过stdin或安全临时通道传UTF8，脚本明确STA/编码/终止错误，写入前确认用户目标，写后只读长度/hash对比；截断必须先拒绝或明确获准、显示真实字符/字节差，执行取消结果unknown不当失败未写。原内容可由用户选择备份并尊重并发更改，不自动回滚覆盖新剪贴板。代价是跨interop输入、隐私备份和版本维护。可用引号/newline/emoji、空串、长文本、忙剪贴板/权限失败、取消和其他应用改写夹具研究。

推荐trial，限明确授权、非敏感短文本，先核一次Windows实际内容，原剪贴板需保留，不把set状态当强保证。继续可从错误协议/编码/readback和截断可见性入手；出现截断、非预期空串、乱码、写入未知或来源不明就停止，先核真实剪贴板，不盲覆盖或读取更多。

#### 证据与依据

**依据 1 · 源码核查**：[lib/clipboard.js:3-38](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/lib/clipboard.js#L3-L38)

纯数据编码/脚本。

<details>
<summary>查看原文（36行）</summary>

```text
export function clampText(text, max = MAX_CHARS) {
  const s = String(text ?? "");
  if (s.length <= max) return { text: s, truncated: false };
  return { text: s.slice(0, max), truncated: true };
}

export function encodeForPowerShell(text) {
  return Buffer.from(String(text ?? ""), "utf8").toString("base64");
}

export function getClipboardScript() {
  return [
    "$OutputEncoding = [Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8",
    "[Console]::Out.Write([System.Windows.Forms.Clipboard]::GetText())",
  ].join("; ");
}

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
  ].join("; ");
```

</details>

**依据 2 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/lib/wsl-host.js#L34-L41)

执行seam。

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

**依据 3 · 源码核查**：[index.js:84-98](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/index.js#L84-L98)

收据假设起点。

<details>
<summary>查看原文（15行）</summary>

```text
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

**依据 4 · 源码核查**：[lib/clipboard.js:41-54](https://github.com/173787247/dsh-wsl-clipboard/blob/1aeac41d93ee494267b83095b4c8217226d7bd33/lib/clipboard.js#L41-L54)

截断展示起点。

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

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
