# dsh-wsl-shot

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[1b2a555](https://github.com/173787247/dsh-wsl-shot/tree/1b2a5552055384e72a914fc3ca5ecf406d8415a5)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-shot)
<!-- END META -->

> **实现功能**：将 Windows 剪贴板图片经 PowerShell 临时 PNG 复制为 WSL 文件，供后续多模态使用。

> **核心亮点**：提供 win_shot 工具完成跨 Windows/WSL 剪贴板图片落盘；详见[Q01](#research-q01)。

> **风险与缺陷**：Public 临时图片在失败分支可能残留，时间戳命名与并发标记有碰撞风险；详见[Q02](#research-q02)。

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
  - [Q01 · win_shot 实际如何把剪贴板图像交给 DSH？](#detail-section-11)
  - [Q02 · 临时图像、输出路径和并发有哪些边界？](#detail-section-12)
  - [Q03 · 什么前提下可用，如何衡量端到端成本？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 WSL 中把 Windows 截图/复制的图片存成本地文件以便后续引用。

手工 Windows 截图保存、用 wslpath/cp 复制到 WSL 再传给模型。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| win_shot | Windows 剪贴板图像转 WSL PNG 文件 | 需 WSL/PowerShell/wslpath；只返回路径 |
| 无图提示 | 告知用户先复制图像 | 仅检查 Clipboard 返回/错误文本 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| WSL、PowerShell 与 WinForms 剪贴板 | 必需 | 从 Windows 读取并保存 PNG | 无图/命令失败 |
| wslpath 与 Public/WSL 目录权限 | 必需 | 跨系统定位和复制 | 返回错误，可能留临时文件 |
| DSH tools/systemPrompt | 必需 | 注册 win_shot | 工具不可用 |
| 多模态消费工具/宿主 | 仅最终附图任务必需 | 将路径传入模型 | 本插件仅落盘 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户放非敏感图入 Windows 剪贴板；管理员核权限 | Clipboard 可读取 |
| 加载 | 管理员安装插件、重启 web 并开新会话 | win_shot 出现 |
| 任务 | Agent 调工具，随后用户/宿主消费返回 WSL 路径 | PNG 内容正确，不把路径误作已附图 |
| 验收/恢复 | 用户核文件与 Windows 临时目录 | 失败清残留并复测 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | WSL/Windows/PowerShell 与可写目录；安装价格未知 | 安装、重启会话、审图片与目录授权；耗时未知 | 实际剪贴板可见性待核 |
| 持续使用 | 每次 Windows 临时 PNG 与 WSL 拷贝占磁盘/内存；大小频次未知 | 检查图片路径并手工接入多模态；耗时未知 | 返回路径不自动附图 |
| 失败恢复 | 残留 Public 临时文件与重拍/重试占资源；金额未知 | 找残留/清理、排错并重新复制；耗时未知 | 失败后清理并非全路径保证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 跨系统图片复制 | Q01 源码形成临时 PNG→WSL 拷贝 | 实际 WSL/剪贴板兼容 |
| 失败提示 | Q01/Q02 源码有无图/路径错误 | Public 文件残留概率 |
| 多模态会话 | 只返回本地文件路径 | 后续模型是否真正接图 |

> **思考**：Public 临时图片在失败分支可能残留，时间戳命名与并发标记有碰撞风险；详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：提供 win_shot 工具完成跨 Windows/WSL 剪贴板图片落盘；详见[Q01](#research-q01)。

提供 win_shot 工具完成跨 Windows/WSL 剪贴板图片落盘；详见[Q01](#research-q01)。

PowerShell/WinForms、wslpath、copyFileSync；无图提示，成功复制后尝试删除临时文件。

<a id="detail-section-5"></a>

### 1.4 主要限制

Public 临时图片在失败分支可能残留，时间戳命名与并发标记有碰撞风险；详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅用非敏感图片在隔离 WSL 试用，先核 Public 权限、失败清理、输出目录和后续多模态接续；详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码可核本地复制链；临时文件失败残留、同毫秒并发碰撞和多模态接续未实测。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh.md、package.json、index.js、lib/shot.js、lib/wsl-host.js、test/shot.test.js、SECURITY.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态审阅；未读取真实剪贴板、运行 PowerShell 或 DSH 宿主。
- 下一步：隔离非敏感图测试正常/无图/wslpath与复制故障、并发碰撞、残留权限与实际多模态接入。

**分析版本**

- **仓库**：[173787247/dsh-wsl-shot](https://github.com/173787247/dsh-wsl-shot)
- **版本号**：0.1.1（[固定提交 1b2a555](https://github.com/173787247/dsh-wsl-shot/tree/1b2a5552055384e72a914fc3ca5ecf406d8415a5)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

独占临时目录、唯一命名和 finally 清理或可减少碰撞/残留；需隔离测试，详见[Q03](#research-q03)。

隔离非敏感图测试正常/无图/wslpath与复制故障、并发碰撞、残留权限与实际多模态接入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 115 | — | — | 694 |
| .js | source | 3 | 198 | 176 | 2 | — |
| .js | test | 1 | 19 | 17 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-shot/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-shot/issues?q=is%3Aissue+created%3A2026-09-22T08%3A08%3A39.337Z..2026-10-22T08%3A08%3A39.337Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-shot/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T08%3A08%3A39.337Z..2026-10-22T08%3A08%3A39.337Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 Windows 剪贴板图片转 WSL 文件的完整路径、临时文件/并发边界与成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · win_shot 实际如何把剪贴板图像交给 DSH？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

工具在 WSL 内调用 PowerShell，使用 System.Windows.Forms.Clipboard.GetImage 保存 PNG 至 Windows Public 目录的时间戳文件，再用 wslpath 转路径、copyFileSync 到 WSL outDir/name.png，复制成功后尝试删除 Windows 临时文件。返回本地路径，不会自动将图像附件上传到模型或会话；多模态交付仍需后续工具/宿主消费该路径。无图时返回提示。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:4-37](https://github.com/173787247/dsh-wsl-shot/blob/1b2a5552055384e72a914fc3ca5ecf406d8415a5/index.js#L4-L37)

注册 win_shot 并限定 WSL。

<details>
<summary>查看原文（34行）</summary>

```text
export const name = "dsh-wsl-shot";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_shot",
    order: 119,
    text: "Use win_shot for WSL/Windows interop: Save a Windows clipboard image into a WSL file for multimodal chat.",
  });

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
    },
    presentCall: () => ({ card: "generic", title: "win_shot" }),
    presentResult: (_args, result) => (
      result.isError
        ? { card: "generic", title: "win_shot failed", content: result.content }
        : { card: "generic", title: "win_shot", content: result.content }
    ),
  });
```

</details>

**依据 2 · 源码核查**：[lib/shot.js:50-98](https://github.com/173787247/dsh-wsl-shot/blob/1b2a5552055384e72a914fc3ca5ecf406d8415a5/lib/shot.js#L50-L98)

剪贴板保存、wslpath、复制、删除、结果。

<details>
<summary>查看原文（49行）</summary>

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
}
```

</details>

**依据 3 · 作者声明**：[README.md:5-17](https://github.com/173787247/dsh-wsl-shot/blob/1b2a5552055384e72a914fc3ca5ecf406d8415a5/README.md#L5-L17)

作者说明保存文件供多模态使用。

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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 临时图像、输出路径和并发有哪些边界？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

Windows 临时文件固定在 C:\Users\Public 且使用 Date.now 毫秒名；仅成功复制后尝试 unlink，wslpath/复制失败会返回 windowsTemp 但不清理。WSL 输出目录可由 outDir 任意指定，mkdirSync 在 try 外；name 虽过滤特殊字符，却允许同名覆盖。工具标记 isConcurrencySafe=true，而同毫秒多调用可能碰撞 Windows 临时路径或目标文件；没有尺寸上限/文件权限专门设置。不能据此断言实际数据泄露，但敏感剪贴板图像的残留/覆盖风险需环境验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/shot.js:18-26](https://github.com/173787247/dsh-wsl-shot/blob/1b2a5552055384e72a914fc3ca5ecf406d8415a5/lib/shot.js#L18-L26)

outDir/name 参数无路径根限制。

```text
export function parameters() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      outDir: { type: "string", description: "Output directory under WSL (default ~/.dsh/shots)." },
      name: { type: "string", description: "File basename without extension." },
    },
  };
```

**依据 2 · 源码核查**：[lib/shot.js:50-98](https://github.com/173787247/dsh-wsl-shot/blob/1b2a5552055384e72a914fc3ca5ecf406d8415a5/lib/shot.js#L50-L98)

Public 时间戳文件、复制失败与成功清理。

<details>
<summary>查看原文（49行）</summary>

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
}
```

</details>

**依据 3 · 源码核查**：[index.js:25-29](https://github.com/173787247/dsh-wsl-shot/blob/1b2a5552055384e72a914fc3ca5ecf406d8415a5/index.js#L25-L29)

并发安全标记。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

**依据 4 · 源码核查**：[test/shot.test.js:5-18](https://github.com/173787247/dsh-wsl-shot/blob/1b2a5552055384e72a914fc3ca5ecf406d8415a5/test/shot.test.js#L5-L18)

测试仅核格式化和无图提示。

<details>
<summary>查看原文（14行）</summary>

```text
describe("win_shot", () => {
  it("formats", () => {
    assert.match(format({ ok: true }), /ok/i);
  });

  it("formats no-image with hint", () => {
    const text = format({
      ok: false,
      error: "no image on clipboard",
      hint: "Copy an image first",
    });
    assert.match(text, /no image on clipboard/);
    assert.match(text, /hint: Copy an image first/);
  });
```

</details>

#### 缺口

- 未测 Public 临时文件 ACL、碰撞及失败恢复
  **影响**：敏感图片可见性/覆盖实际程度未知
  **进一步探讨**：用非敏感图片模拟 wslpath/复制失败与并发调用，检查临时文件和权限

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么前提下可用，如何衡量端到端成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

需要 WSL、Windows PowerShell/WinForms 剪贴板、wslpath、Windows Public 与 WSL outDir 写权限，DSH tools/systemPrompt；README 还要求重启 web 并开新 session。首次需安装和确认路径/权限；持续每次生成临时 PNG、复制到 WSL、可能占双份磁盘及图片读取时间；失败恢复需清理残留、重拍/重试和人工检查目标文件。没有图片尺寸上限、单位空间/耗时或现金价格数据。创新假设：相对当前公共目录+毫秒命名+成功后清理，使用独占受限临时目录、不可预测唯一文件名、finally 清理并限定输出根，或可减少碰撞和失败残留。条件是 Windows↔WSL 可互访目录与权限稳定，代价是目录管理与兼容。最小证伪：隔离模拟无图、wslpath 失败、复制失败、同毫秒并发与超大图，检查残留数、权限、覆盖和正常成功率；若仍残留或覆盖，假设失败。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | WSL/Windows/PowerShell 与可写目录；安装价格未知 | 安装、重启会话、审图片与目录授权；耗时未知 | 实际剪贴板可见性待核 |
| 持续使用 | 每次 Windows 临时 PNG 与 WSL 拷贝占磁盘/内存；大小频次未知 | 检查图片路径并手工接入多模态；耗时未知 | 返回路径不自动附图 |
| 失败恢复 | 残留 Public 临时文件与重拍/重试占资源；金额未知 | 找残留/清理、排错并重新复制；耗时未知 | 失败后清理并非全路径保证 |

以目标WSL文件内容与原剪贴板图一致且临时残留明确为中间验收；最终多模态任务还需后续宿主读取附件。采用者需授权实际剪贴板内容和输出位置，文件名清洗不限制outDir/现有符号链接，复制成功不证明敏感临时副本一定删除。正确图片任务的全链路模型与恢复成本未知，不因没有外部API而填零。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:36-45](https://github.com/173787247/dsh-wsl-shot/blob/1b2a5552055384e72a914fc3ca5ecf406d8415a5/README.md#L36-L45)

安装及新会话说明。

<details>
<summary>查看原文（10行）</summary>

````text
## Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-shot
# or local:
dsh plugin --profile web add /absolute/path/to/dsh-wsl-shot
```

Restart `dsh web` and open a **new** session. Tool: `win_shot`.

````

</details>

**依据 2 · 源码核查**：[lib/shot.js:50-98](https://github.com/173787247/dsh-wsl-shot/blob/1b2a5552055384e72a914fc3ca5ecf406d8415a5/lib/shot.js#L50-L98)

权限/磁盘/恢复相关数据流。

<details>
<summary>查看原文（49行）</summary>

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
}
```

</details>

**依据 3 · 源码核查**：[lib/wsl-host.js:21-41](https://github.com/173787247/dsh-wsl-shot/blob/1b2a5552055384e72a914fc3ca5ecf406d8415a5/lib/wsl-host.js#L21-L41)

WSL 探测与 PowerShell 运行。

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

#### 缺口

- 未采图片大小分布与失败/清理计数
  **影响**：磁盘资源与单位任务成本未知
  **进一步探讨**：记录真实非敏感截图的文件大小、耗时、失败恢复

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
