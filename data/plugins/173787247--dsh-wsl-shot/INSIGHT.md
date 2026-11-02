# dsh-wsl-shot

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[47be4a8](https://github.com/173787247/dsh-wsl-shot/tree/47be4a896794c1a546ff68fbd02b13319464b42c)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-shot)
<!-- END META -->

> **功能**：将 Windows 剪贴板图片保存为 WSL 文件，供后续多模态会话引用。

> **亮点**：[Q01](#research-q01) 封装剪贴板图片跨OS落盘并返回路径，减少搬移步骤。

> **主要限制**：[Q02](#research-q02) Public临时图失败可残留，时间戳/固定目标可撞或覆盖，取消不等落盘停止。

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
  - [Q01 · win_shot是截屏还是多模态接入？](#detail-section-11)
  - [Q02 · 临时文件、并发和失败会留下什么？](#detail-section-12)
  - [Q03 · 从授权到退出要负担哪些环节？](#detail-section-13)
  - [Q04 · 哪种试用可控，怎样验证新方向？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户已复制Windows图片，希望在WSL的DSH会话中引用。

手动保存/移动并上传图片；插件不主动截屏或自动附图。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 剪贴板读取 | 取用户已复制图像 | 不主动截图，需明确授权 |
| 跨OS落盘 | 临时PNG转WSL文件 | Public残留/同名覆盖需核 |
| 无图提示 | 引导先复制样图 | 返回路径不等模型接图 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| WSL/Node>=18/DSH | 必需 | 工具运行 | 兼容未验 |
| PowerShell/WinForms/interop | 必需 | 当前剪贴板图像 | 无图/GUI不可见 |
| wslpath与两端可写目录 | 必需 | 落盘复制 | 失败可能留Public图 |
| 授权图像/附图链 | 采用前提 | 正确多模态任务 | 本地路径不自动附图 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户复制已授权样图 | 内容/目录明确 |
| 转存 | Agent调用工具 | 核实际图片非只ok |
| 接续 | 用户/宿主实际附图 | 模型确认接收 |
| 异常/退出 | 用户核两端残留再清理 | 不盲重试、不误删他图 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 原宿主/目录 | 核权限/内容/接图 | 工时未知 |
| 持续 | 临时PNG与WSL副本/上下文 | 核图与附件 | 尺寸频度资源未知 |
| 失败恢复 | 残留/重试存储 | 两端核图清理 | 非全路径自动清理 |
| 退出 | 图像仍保留 | 授权清理与会话附件处理 | 关插件不删图 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 图像转存 | Clipboard到PNG/WSL | GUI/权限兼容 |
| 错误反馈 | 无图/转换/复制错误 | 清理成功与并发正确 |
| 多模态接续 | 返回文本路径 | 宿主是否附图/理解质量 |

> **思考**：[Q02](#research-q02) Public临时图失败可残留，时间戳/固定目标可撞或覆盖，取消不等落盘停止。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 封装剪贴板图片跨OS落盘并返回路径，减少搬移步骤。

[Q02](#research-q02) 无图token提供具体反馈，成功后清理已存在但非全分支；时间戳不等独占。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) Public临时图失败可残留，时间戳/固定目标可撞或覆盖，取消不等落盘停止。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 非敏感样图/独立目录先核Public权限/失败残留与后续接图；异常回手工。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码落盘接线成立，未读取实际剪贴板/执行PowerShell；限定非敏感副本试用，清理协议未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/shot.js、lib/wsl-host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整读README/清单/index/shot/host并复核旧findings；未运行目标/测试、读真实剪贴板或截图。
- 下一步：非敏感样图核并发/同名、各失败清理、取消后落盘及DSH真实接图，计磁盘/人工成本。

**分析版本**

- **仓库**：[173787247/dsh-wsl-shot](https://github.com/173787247/dsh-wsl-shot)
- **版本号**：0.1.1（[固定提交 47be4a8](https://github.com/173787247/dsh-wsl-shot/tree/47be4a896794c1a546ff68fbd02b13319464b42c)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 独占临时协议/不覆盖和清理状态可减少错图残留；若误回收或负担更高即否定。

非敏感样图核并发/同名、各失败清理、取消后落盘及DSH真实接图，计磁盘/人工成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 115 | — | — | 694 |
| .js | source | 3 | 198 | 176 | 2 | — |
| .js | test | 1 | 19 | 17 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-shot/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查剪贴板图片跨OS落盘与隐私、并发和附件闭环边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · win_shot是截屏还是多模态接入？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它读取用户已复制到Windows剪贴板的图片，转PNG并复制到WSL文件，给DSH用户后续引用。并不主动截屏，也不把图片自动附到模型；output render仅返回文本路径。合格结果是用户确认正确图片落盘并在后续流程实际被模型接收，不能以ok=true推成多模态任务完成。相比先保存Windows图片再手动搬到WSL，增量是工具内转存/路径反馈，图像/剪贴板与复制能力来自WinForms/系统。

index原生注册win_shot和提示，是真插件。仅偶尔用图、或客户端已有跨OS粘贴上传时，额外落盘未必更省事；图片理解质量仍由宿主/模型和用户后续附图决定。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:5-17](https://github.com/173787247/dsh-wsl-shot/blob/47be4a896794c1a546ff68fbd02b13319464b42c/README.md#L5-L17)

作者剪贴板到文件定位。

<details>
<summary>查看原文（13行）</summary>

````text
DeepSeek Harness plugin: Save a Windows clipboard image into a WSL file for multimodal chat.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)

## Where it sits

Saves a Windows clipboard image into a WSL file so the agent can attach it.

```mermaid
flowchart LR
  clip["Windows clipboard image"] --> tool["win_shot"] --> file["WSL image file"]
````

</details>

**依据 2 · 源码核查**：[index.js:17-29](https://github.com/173787247/dsh-wsl-shot/blob/47be4a896794c1a546ff68fbd02b13319464b42c/index.js#L17-L29)

工具和文本render。

<details>
<summary>查看原文（13行）</summary>

```text
  ctx.tools.register({
    name: "win_shot",
    description: "Save a Windows clipboard image into a WSL file for multimodal chat.",
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

**依据 3 · 源码核查**：[lib/shot.js:58-63](https://github.com/173787247/dsh-wsl-shot/blob/47be4a896794c1a546ff68fbd02b13319464b42c/lib/shot.js#L58-L63)

读取Clipboard不是截屏。

```text
  const ps = `
Add-Type -AssemblyName System.Windows.Forms;
$img = [System.Windows.Forms.Clipboard]::GetImage();
if ($null -eq $img) { Write-Output '${NO_IMAGE_TOKEN}'; exit 0 };
$img.Save('${winTemp.replace(/'/g, "''")}', [System.Drawing.Imaging.ImageFormat]::Png);
'${winTemp.replace(/'/g, "''")}'
```

#### 缺口

- 宿主是否真正接图及手工基线未验。
  **影响**：无法证明多模态任务成功或节时。
  **进一步探讨**：用非敏感样图比较落盘到模型确认接图的完整步骤。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 临时文件、并发和失败会留下什么？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

core先mkdir输出目录，name以允许字母数字下划线点横线替换，再以Date.now构造Windows Public PNG。PowerShell Clipboard.GetImage，无图有专用token提示；非空输出后wslpath转换，再copyFileSync到WSL，复制成功才尝试unlink临时图，且删除失败被忽略。wslpath失败/复制失败/PowerShell写出后异常，都可能留下Public图；ok不保证已清理。

时间戳并非独占唯一，工具却标可并发，同毫秒请求可撞临时名；自定义相同name的目标复制默认覆盖，无冲突确认。outDir用户可给任意可写目录、相对目录基于进程cwd，没有会话policy/宿主fs服务或目录根验证；不能把插件可调用当工作区授权。PowerShell固定脚本/路径引号处理可核，不需虚构命令注入。外层默认15秒、内部PowerShell25秒再wslpath5秒且无signal，取消后仍可能有图/文件，不要立即重试或假定无残留。

#### 证据与依据

**依据 1 · 源码核查**：[lib/shot.js:50-97](https://github.com/173787247/dsh-wsl-shot/blob/47be4a896794c1a546ff68fbd02b13319464b42c/lib/shot.js#L50-L97)

目录/name/临时图/复制清理及失败。

<details>
<summary>查看原文（48行）</summary>

```text
export async function execute(args) {
  const outDir = typeof args?.outDir === "string" && args.outDir.trim()
    ? args.outDir.trim()
    : join(homedir(), ".dsh", "shots");
  mkdirSync(outDir, { recursive: true });
  const base = (typeof args?.name === "string" && args.name.trim() ? args.name.trim() : `shot-${Date.now()}`)
    .replace(/[^\w.-]+/g, "_");
  const winTemp = `C:\\\\Users\\\\Public\\\\dsh-shot-${Date.now()}.png`;
  const ps = `
Add-Type -AssemblyName System.Windows.Forms;
$img = [System.Windows.Forms.Clipboard]::GetImage();
if ($null -eq $img) { Write-Output '${NO_IMAGE_TOKEN}'; exit 0 };
$img.Save('${winTemp.replace(/'/g, "''")}', [System.Drawing.Imaging.ImageFormat]::Png);
'${winTemp.replace(/'/g, "''")}'
`;
  let stdout = "";
  try {
    const result = await runPowerShell(ps, { timeoutMs: 25_000 });
    stdout = String(result.stdout || "").trim();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/no image on clipboard/i.test(msg) || msg.includes(NO_IMAGE_TOKEN)) {
      return noClipboardImage();
    }
    return { ok: false, error: msg, hint: NO_IMAGE_HINT };
  }
  if (!stdout || stdout.includes(NO_IMAGE_TOKEN)) {
    return noClipboardImage();
  }
  let linuxTemp = "";
  try {
    const { stdout: wslOut } = await execFileAsync("wslpath", ["-u", winTemp.replace(/\\\\/g, "\\")], {
      timeout: 5000,
      encoding: "utf8",
    });
    linuxTemp = String(wslOut).trim();
  } catch {
    return { ok: false, windowsTemp: winTemp, error: "wslpath failed for temp file" };
  }
  const dest = join(outDir, `${base}.png`);
  try {
    const { copyFileSync, unlinkSync } = await import("node:fs");
    copyFileSync(linuxTemp, dest);
    try { unlinkSync(linuxTemp); } catch { /* ignore */ }
  } catch (err) {
    return { ok: false, windowsTemp: winTemp, error: err instanceof Error ? err.message : String(err) };
  }
  return { ok: true, path: dest, windowsTemp: winTemp };
```

</details>

**依据 2 · 源码核查**：[index.js:25-29](https://github.com/173787247/dsh-wsl-shot/blob/47be4a896794c1a546ff68fbd02b13319464b42c/index.js#L25-L29)

并发标记与调用无signal。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

**依据 3 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-shot/blob/47be4a896794c1a546ff68fbd02b13319464b42c/lib/wsl-host.js#L34-L41)

PowerShell固定argv。

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

- Public实际ACL、同毫秒/同name覆盖和取消后文件状态未验。
  **影响**：隐私/覆盖和重试风险影响敏感图片采用。
  **进一步探讨**：非敏感副本核ACL、转换/复制失败、并发和取消后的两端文件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 从授权到退出要负担哪些环节？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要Node>=18、WSL/Windows互操作、PowerShell/WinForms可访问当前剪贴板、wslpath及两端目录可写。WSL检测成功不等GUI剪贴板可见；README概览仍写0.1.0而清单/兼容表0.1.1，本轮以固定清单0.1.1为版本，不把套件外链当实测。读取的是当前剪贴板，用户须先明确图片内容和转存授权，可能含敏感画面；落盘本地也不等随后模型不上传。

首次核目录/权限和后续附图链；持续每图有Windows临时PNG与WSL副本，内存/磁盘/模型上下文资源未知。失败要两端找残留，先核成功文件再重试；没有自动到期/磁盘清理。退出需清理已授权范围内的两端图像、处理后续会话附件，关插件并不删除既有文件。没有付费API不等存储与人工核图为0。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-17](https://github.com/173787247/dsh-wsl-shot/blob/47be4a896794c1a546ff68fbd02b13319464b42c/package.json#L1-L17)

清单版本/运行要求。

<details>
<summary>查看原文（17行）</summary>

```text
{
  "name": "dsh-wsl-shot",
  "version": "0.1.1",
  "description": "Save a Windows clipboard image into a WSL file for multimodal chat.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/173787247/dsh-wsl-shot.git"
  },
  "bugs": {
    "url": "https://github.com/173787247/dsh-wsl-shot/issues"
  },
  "homepage": "https://github.com/173787247/dsh-wsl-shot#readme",
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
```

</details>

**依据 2 · 源码核查**：[README.md:20-29](https://github.com/173787247/dsh-wsl-shot/blob/47be4a896794c1a546ff68fbd02b13319464b42c/README.md#L20-L29)

文档版本不一致。

<details>
<summary>查看原文（10行）</summary>

```text
Suite diagram and version snapshot: [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit#how-the-pieces-fit). This plugin is **0.1.0** (full). Do not copy that matrix into this README.


## Compatibility

| Field | Value |
|-------|-------|
| **Plugin** | `dsh-wsl-shot` **0.1.1** |
| **Minimum dsh** | ≥ **0.1.2** (web UI one-shot `?token=` on Windows relay `:3081`) |
| **Latest verified** | See [dsh-wsl-kit Compatibility](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) (currently **`0.2.1-rc.5`**) — single source of truth for the suite |
```

</details>

**依据 3 · 源码核查**：[lib/shot.js:50-97](https://github.com/173787247/dsh-wsl-shot/blob/47be4a896794c1a546ff68fbd02b13319464b42c/lib/shot.js#L50-L97)

两端磁盘/读取链。

<details>
<summary>查看原文（48行）</summary>

```text
export async function execute(args) {
  const outDir = typeof args?.outDir === "string" && args.outDir.trim()
    ? args.outDir.trim()
    : join(homedir(), ".dsh", "shots");
  mkdirSync(outDir, { recursive: true });
  const base = (typeof args?.name === "string" && args.name.trim() ? args.name.trim() : `shot-${Date.now()}`)
    .replace(/[^\w.-]+/g, "_");
  const winTemp = `C:\\\\Users\\\\Public\\\\dsh-shot-${Date.now()}.png`;
  const ps = `
Add-Type -AssemblyName System.Windows.Forms;
$img = [System.Windows.Forms.Clipboard]::GetImage();
if ($null -eq $img) { Write-Output '${NO_IMAGE_TOKEN}'; exit 0 };
$img.Save('${winTemp.replace(/'/g, "''")}', [System.Drawing.Imaging.ImageFormat]::Png);
'${winTemp.replace(/'/g, "''")}'
`;
  let stdout = "";
  try {
    const result = await runPowerShell(ps, { timeoutMs: 25_000 });
    stdout = String(result.stdout || "").trim();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/no image on clipboard/i.test(msg) || msg.includes(NO_IMAGE_TOKEN)) {
      return noClipboardImage();
    }
    return { ok: false, error: msg, hint: NO_IMAGE_HINT };
  }
  if (!stdout || stdout.includes(NO_IMAGE_TOKEN)) {
    return noClipboardImage();
  }
  let linuxTemp = "";
  try {
    const { stdout: wslOut } = await execFileAsync("wslpath", ["-u", winTemp.replace(/\\\\/g, "\\")], {
      timeout: 5000,
      encoding: "utf8",
    });
    linuxTemp = String(wslOut).trim();
  } catch {
    return { ok: false, windowsTemp: winTemp, error: "wslpath failed for temp file" };
  }
  const dest = join(outDir, `${base}.png`);
  try {
    const { copyFileSync, unlinkSync } = await import("node:fs");
    copyFileSync(linuxTemp, dest);
    try { unlinkSync(linuxTemp); } catch { /* ignore */ }
  } catch (err) {
    return { ok: false, windowsTemp: winTemp, error: err instanceof Error ? err.message : String(err) };
  }
  return { ok: true, path: dest, windowsTemp: winTemp };
```

</details>

#### 缺口

- 剪贴板可见性、尺寸资源和后续附图/残留保留未验。
  **影响**：可能不兼容或把隐私/存储负担转给用户。
  **进一步探讨**：独立会话用已批准样图核内容、目录、附件与退出清理。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪种试用可控，怎样验证新方向？

**研究主题**：采用判断、新假设与验证

#### 完整回答

仅用非敏感样图/独立目录试用，先看Public权限与失败清理，再确认DSH实际附图；不要对私密剪贴板循环调用。结果不明先核两端文件和图片内容，停止重试，回手动保存/上传并按授权清理。

可探索独占随机临时目录/创建、目标不覆盖和finally清理的落盘协议，回传清理状态和后续附件状态。现有无图token与成功后unlink已是基线，增量是并发/失败所有权与明确残留，而非“已有清理完全没有”。对同毫秒并发、同name、转换/复制失败、清理拒绝做对照，比较错图/覆盖/残留、额外I/O及人工确认。finally不能清理所有强退情形，仍需可审计过期回收。若残留不降或回收误删他人图像，否定该方向；未实现。

#### 证据与依据

**依据 1 · 源码核查**：[lib/shot.js:55-57](https://github.com/173787247/dsh-wsl-shot/blob/47be4a896794c1a546ff68fbd02b13319464b42c/lib/shot.js#L55-L57)

非独占命名基线。

```text
  const base = (typeof args?.name === "string" && args.name.trim() ? args.name.trim() : `shot-${Date.now()}`)
    .replace(/[^\w.-]+/g, "_");
  const winTemp = `C:\\\\Users\\\\Public\\\\dsh-shot-${Date.now()}.png`;
```

**依据 2 · 源码核查**：[lib/shot.js:76-97](https://github.com/173787247/dsh-wsl-shot/blob/47be4a896794c1a546ff68fbd02b13319464b42c/lib/shot.js#L76-L97)

已有无图/成功清理与缺口。

<details>
<summary>查看原文（22行）</summary>

```text
  if (!stdout || stdout.includes(NO_IMAGE_TOKEN)) {
    return noClipboardImage();
  }
  let linuxTemp = "";
  try {
    const { stdout: wslOut } = await execFileAsync("wslpath", ["-u", winTemp.replace(/\\\\/g, "\\")], {
      timeout: 5000,
      encoding: "utf8",
    });
    linuxTemp = String(wslOut).trim();
  } catch {
    return { ok: false, windowsTemp: winTemp, error: "wslpath failed for temp file" };
  }
  const dest = join(outDir, `${base}.png`);
  try {
    const { copyFileSync, unlinkSync } = await import("node:fs");
    copyFileSync(linuxTemp, dest);
    try { unlinkSync(linuxTemp); } catch { /* ignore */ }
  } catch (err) {
    return { ok: false, windowsTemp: winTemp, error: err instanceof Error ? err.message : String(err) };
  }
  return { ok: true, path: dest, windowsTemp: winTemp };
```

</details>

#### 缺口

- 独占临时协议和附件状态无实现。
  **影响**：不能承诺隐私安全/多模态闭环。
  **进一步探讨**：先验证失败所有权与清理不会误删，再做端到端接图对照。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
