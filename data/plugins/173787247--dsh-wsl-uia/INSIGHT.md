# dsh-wsl-uia

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[43e5b42](https://github.com/173787247/dsh-wsl-uia/tree/43e5b42c013a3170c318217889eb1c9504d9f6c4)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-uia)
<!-- END META -->

> **实现功能**：从WSL读取Windows顶层窗口和UI Automation控件树，提供过滤查找、按名等待和祖先路径，并给元素标注观测内句柄。

> **核心亮点**：将Windows UIA语义、PowerShell互操作、按名等待/path与DSH观察工具连接，减少纯视觉定位负担。详见[Q02](#research-q02)。

> **风险与缺陷**：windowHandle声明未用，pid取首窗、tree默认前台而wait/path默认首窗；epoch.index未持久绑定窗口或动作。tree限返回数非visited，Name/title无秘密过滤，总wait预算/取消未贯穿。详见[Q03](#research-q03)、[Q05](#research-q05)。

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
  - [Q01 · 观察Windows UI适合什么问题？](#detail-section-11)
  - [Q02 · 从WSL到UIA数据怎么产生，亮点在哪里？](#detail-section-12)
  - [Q03 · 窗口、handle与秘密披露怎样界定？](#detail-section-13)
  - [Q04 · 启动需要哪些条件，推荐读者怎样使用？](#detail-section-14)
  - [Q05 · 遍历上限、等待与取消是否真正有界？](#detail-section-15)
  - [Q06 · 成本效果、推荐和可继续探讨的方向是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在WSL运行DSH、需要理解Windows应用当前窗口/控件的人。uia_tree一个工具含windows/tree/find/wait/path五动作，获取顶层窗口、控件名字/类型/状态/矩形/可用pattern，或等命名元素/追溯祖先，帮助模型说明界面和准备后续操作。

本插件不点击、不输入、不调用InvokePattern执行动作。actions依赖独立wininput，不能把可见pattern当已获执行授权。合格观察需准确窗口、时间、范围/过滤/截断，find不到要区分不存在、不在深度/节点预算或UIA未暴露。

截图/OCR和人手描述是基线。UIA结构在有可访问性树的应用可免截图定位；自绘画布、跨权限窗口和动态UI不保证完整，控件名也不证明用户业务意图。

手工描述或截图/OCR定位；UIA给结构但依应用可访问性，不提供动作授权或全桌面无秘密保证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| windows | 顶层窗口列表 | 含所有可见元信息，无每会话PID许可 |
| tree/find | 控件名/类型/矩形/pattern | windowHandle未用，访问预算非返回数 |
| wait | 精确名称出现 | 默认目标/总预算与tree不同 |
| path | 唯一命名元素祖先链 | 歧义拒绝，搜索截断需核 |
| 观测handle | epoch.index标记 | 非持久窗口身份，消费者动作未验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Windows+WSL、Node>=18与DSH工具/提示 | 必需 | 跨系统观察 | 非WSL工具明确ok:false |
| Windows PowerShell与UIAutomation程序集 | 必需 | 获取树与前台窗口 | 标准路径无文件则回PATH，真实可用需核 |
| 应用UIA provider/权限 | 数据条件 | 控件语义 | 自绘/权限差异可缺项 |
| 明确目标PID/窗口和数据许可 | 使用前提 | 防错窗/秘密外发 | 不能只靠前台或未实现windowHandle |
| 另装wininput | 仅动作 | 点击/输入/Invoke | 本插件只观察，不提供动作授权 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 无敏感测试窗并核观察权限 | 不先扫全部真实业务界面 |
| 枚举 | 列窗确定PID/标题 | 同PID多窗需显式识别，不依忽略的HWND |
| 树 | 小深度/预算读结构 | 核标题/类型/截断及epoch |
| 查找 | 使用明确名称/type再看path | find空不当不存在，path歧义返回错误 |
| 等待 | 指定PID/名称和时间 | 默认目标与tree不同需核 |
| 后续 | 动作前重新观察并独立确认 | 不将索引当稳定ID/授权 |

本轮不读真实桌面、不执行PowerShell/作者单元或live测试。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 复用Windows/WSL与应用UIA | 核桥与应用UIA权限/多窗目标 | 应用覆盖/调试时间及金额未知 |
| 持续使用 | PowerShell启动/程序集、UIA遍历与模型文本 | 审阅姓名/控件文本披露 | 窄过滤不一定省扫描，实际资源/费用未知 |
| 失败恢复 | 重复观测与进程/遍历资源 | 排错窗/歧义/慢树 | 本插件不动作回滚，动作消费者另核；恢复时间未知 |



#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 结构观察 | 类型/名称/pattern/矩形 | 依应用UIA，非视觉全面理解 |
| 少定位复制 | 按名wait/path和观测内handle | handle不是跨时稳定身份 |
| 有限返回 | depth/count与进程buffer | tree访问计数/总wait不严格 |

> **思考**：windowHandle声明未用，pid取首窗、tree默认前台而wait/path默认首窗；epoch.index未持久绑定窗口或动作。tree限返回数非visited，Name/title无秘密过滤，总wait预算/取消未贯穿。详见[Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将Windows UIA语义、PowerShell互操作、按名等待/path与DSH观察工具连接，减少纯视觉定位负担。详见[Q02](#research-q02)。

将Windows UIA语义、PowerShell互操作、按名等待/path与DSH观察工具连接，减少纯视觉定位负担。详见[Q02](#research-q02)。

tree while用out.Count<maxElements限制返回匹配节点，队列visited没有独立计数。过滤窄或大量匿名/不匹配节点时，虽然depth上限，访问/入队量可远超maxElements，UIA调用成本未严格受该字段约束；truncated仅elements.length>=maxElements，深度截断/过滤/属性异常跳过没有独立收据。刚好等于预算也不证明确有遗漏。

wait/path的locate用seen限制访问，较tree有明确节点预算。wait每轮可占config timeout（最高120秒），waitMs在轮后才检查，故waitMs100ms不保证100ms返回；主工具默认30秒可能先超时。等待循环sleep与PowerShell执行未绑定exec.signal，宿主取消不自动停止后续轮询。

runPowerShell execFile有timeout和4MiB maxBuffer，异常交顶层ok:false；这些约束覆盖单进程，不证明完整wait预算或Windows UIA调用/后代都立即终止。工具isConcurrencySafe可并行观察，epoch毫秒碰撞/焦点变化与同PID多窗使后续动作仍需重新核目标。作者测试含纯函数与WSL条件live，但存在不等于本轮执行通过。

<a id="detail-section-5"></a>

### 1.4 主要限制

windowHandle声明未用，pid取首窗、tree默认前台而wait/path默认首窗；epoch.index未持久绑定窗口或动作。tree限返回数非visited，Name/title无秘密过滤，总wait预算/取消未贯穿。详见[Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，可用无敏感测试窗口纯观察，先解决目标/预算/隐私与动作消费者契约，不直接当安全自动操作基础。详见[Q06](#research-q06)。

本插件不点击、不输入、不调用InvokePattern执行动作。actions依赖独立wininput，不能把可见pattern当已获执行授权。合格观察需准确窗口、时间、范围/过滤/截断，find不到要区分不存在、不在深度/节点预算或UIA未暴露。

截图/OCR和人手描述是基线。UIA结构在有可访问性树的应用可免截图定位；自绘画布、跨权限窗口和动态UI不保证完整，控件名也不证明用户业务意图。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。只读结构接线成立，窗口参数/默认目标、跨插件handle契约与敏感/遍历/等待预算需明确。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、SECURITY.md、lib/uia.js、lib/uia-exec.js、lib/uia-locate.js、lib/wsl-host.js、test/uia.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定index/四lib关键观察/定位/预算/互操作、包/README/SECURITY与作者测试结构；不真实桌面观察/PowerShell/宿主执行，动作插件未纳入。
- 下一步：可继续用自制应用的同PID多窗/焦点切换/假秘密/过滤大树/慢wait序列，核观测身份、范围/省略与取消，再比较手工定位。

**分析版本**

- **仓库**：[173787247/dsh-wsl-uia](https://github.com/173787247/dsh-wsl-uia)
- **版本号**：0.1.0（[固定提交 43e5b42](https://github.com/173787247/dsh-wsl-uia/tree/43e5b42c013a3170c318217889eb1c9504d9f6c4)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索随机观测ID绑定会话/PID/HWND/时间与动作前重核、visited/省略收据、敏感策略和总signal预算；未实现。详见[Q06](#research-q06)。

可继续用自制应用的同PID多窗/焦点切换/假秘密/过滤大树/慢wait序列，核观测身份、范围/省略与取消，再比较手工定位。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 123 | — | — | 559 |
| .js | source | 5 | 583 | 507 | 32 | — |
| .js | test | 1 | 203 | 181 | 6 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-uia/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-uia/issues?q=is%3Aissue+created%3A2026-09-22T06%3A40%3A27.014Z..2026-10-22T06%3A40%3A27.014Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-uia/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A40%3A27.014Z..2026-10-22T06%3A40%3A27.014Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核固定WSL Windows UIA观察机制，区分窗口/观测标签与稳定身份、返回数与访问预算、读取与披露。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 观察Windows UI适合什么问题？

**研究主题**：场景与需求

#### 完整回答

面向在WSL运行DSH、需要理解Windows应用当前窗口/控件的人。uia_tree一个工具含windows/tree/find/wait/path五动作，获取顶层窗口、控件名字/类型/状态/矩形/可用pattern，或等命名元素/追溯祖先，帮助模型说明界面和准备后续操作。

本插件不点击、不输入、不调用InvokePattern执行动作。actions依赖独立wininput，不能把可见pattern当已获执行授权。合格观察需准确窗口、时间、范围/过滤/截断，find不到要区分不存在、不在深度/节点预算或UIA未暴露。

截图/OCR和人手描述是基线。UIA结构在有可访问性树的应用可免截图定位；自绘画布、跨权限窗口和动态UI不保证完整，控件名也不证明用户业务意图。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-3](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/README.md#L3-L3)

WSL观察作者定位。

```text
DeepSeek Harness plugin: Windows UI Automation observation from WSL: enumerate top-level windows and read a bounded element tree with per-observation handles.
```

**依据 2 · 源码核查**：[lib/uia.js:106-122](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia.js#L106-L122)

五动作和参数。

<details>
<summary>查看原文（17行）</summary>

```text
export function parameters() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      action: { type: "string", enum: ["windows", "tree", "find", "wait", "path"], description: "windows: list top-level windows. tree: read a bounded element tree. find: search it. wait: poll until a named element appears. path: the ancestor chain of a named element." },
      pid: { type: "number", description: "Target process id (tree/find). Defaults to the foreground window." },
      windowHandle: { type: "string", description: "Target window handle, as returned by action=windows." },
      maxDepth: { type: "number", description: "Tree depth limit (default 4, max 12)." },
      maxElements: { type: "number", description: "Element budget (default 200, max 1500)." },
      nameContains: { type: "string", description: "find: case-insensitive substring of the element name." },
      controlType: { type: "string", description: "find: control type filter, e.g. Button." },
      actionableOnly: { type: "boolean", description: "Return only elements that expose an action pattern." },
      expectName: { type: "string", description: "wait/path: exact element name to look for, as tree reported it." },
      expectType: { type: "string", description: "wait/path: optional control type to narrow the match." },
      waitMs: { type: "number", description: "wait: how long to keep polling, 100-60000 (default 8000)." },
    },
```

</details>

**依据 3 · 源码核查**：[lib/uia.js:62-77](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia.js#L62-L77)

返回元素属性。

<details>
<summary>查看原文（16行）</summary>

```text
export function normalizeElement(e, index, epoch) {
  return {
    handle: makeHandle(epoch, index),
    index,
    depth: Math.trunc(Number(e.depth) || 0),
    controlType: String(e.controlType ?? ""),
    name: String(e.name ?? "").slice(0, 200),
    automationId: String(e.automationId ?? ""),
    className: String(e.className ?? ""),
    enabled: Boolean(e.enabled),
    x: Math.trunc(Number(e.x) || 0),
    y: Math.trunc(Number(e.y) || 0),
    width: Math.trunc(Number(e.width) || 0),
    height: Math.trunc(Number(e.height) || 0),
    patterns: Array.isArray(e.patterns) ? e.patterns.map(String) : [],
  };
```

</details>

**依据 4 · 源码核查**：[index.js:11-14](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/index.js#L11-L14)

动作插件只为外部引用。

```text
  ctx.systemPrompt.section({
    name: "tool:uia_tree",
    order: 210,
    text: "Use uia_tree to observe Windows UI from WSL: action=windows lists top-level windows, action=tree reads a bounded UI Automation element tree, action=find searches it. Every element carries a handle tied to that one observation; pass it to win_invoke / win_type / win_click in dsh-wsl-wininput. A handle from an older observation is rejected on purpose — re-observe instead.",
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从WSL到UIA数据怎么产生，亮点在哪里？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

detectWsl看环境/内核，runPowerShell找标准Windows PowerShell路径，execFile执行固定生成脚本。脚本加载UIAutomationClient/Types与user32前台函数，设置UTF8并把异常矩形归0。windows遍历顶层Window，tree按pid取首个顶层或默认前台，以ControlViewWalker队列遍历深度有限的控件，结果JSON再归一。

动态name/type以PowerShell单引号转义，pid/depth/count数值clamp，避免把任意字符串直接解释成命令。nameContains用-like通配，不是严格文字substring，用户输入*?[]仍有匹配语义。返回每元素Date.now epoch+过滤输出index，提示这只是观测内地址。

贡献是UIA语义与DSH结构化观察接线，另有按精确名称等待/祖先路径以减少位置索引依赖；不是新的计算机视觉或跨时稳定控件身份系统。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wsl-host.js:14-41](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/wsl-host.js#L14-L41)

WSL与PowerShell固定路径/execFile。

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

**依据 2 · 源码核查**：[lib/uia-exec.js:9-31](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia-exec.js#L9-L31)

UIA/UTF8/矩形异常处理。

<details>
<summary>查看原文（23行）</summary>

```text
const PRELUDE = `
$ErrorActionPreference = 'Stop'
# The console codepage mangles non-ASCII window titles; force UTF-8 on the way out.
[Console]::OutputEncoding = [Text.Encoding]::UTF8
Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes
Add-Type @"
using System;using System.Runtime.InteropServices;using System.Text;
public class DshW {
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int L,T,R,B; }
}
"@
# A minimized or hidden window reports an empty rectangle, whose components are
# not convertible to Int32 — they are [+/-]Infinity or NaN. Convert through a
# guard so those windows still appear, at 0x0, instead of throwing.
function Dsh-I([double]$v) { if ([double]::IsNaN($v) -or [double]::IsInfinity($v)) { 0 } else { [int]$v } }
function Dsh-Rect($el) {
  try { $r = $el.Current.BoundingRectangle } catch { return @{ x=0; y=0; width=0; height=0 } }
  @{ x=(Dsh-I $r.X); y=(Dsh-I $r.Y); width=(Dsh-I $r.Width); height=(Dsh-I $r.Height) }
}
```

</details>

**依据 3 · 源码核查**：[lib/uia-exec.js:77-123](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia-exec.js#L77-L123)

目标/过滤与BFS输出。

<details>
<summary>查看原文（47行）</summary>

```text
  // against `$el`, so they must name it directly.
  const filterName = nameContains ? `$el.Current.Name -like ${psQuote("*" + nameContains + "*")}` : "$true";
  const filterType = controlType ? `$el.Current.ControlType.ProgrammaticName -like ${psQuote("*" + controlType + "*")}` : "$true";
  return `${PRELUDE}
$target = $null
if (${pid || 0} -gt 0) {
  $cond = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::ProcessIdProperty, ${pid || 0})
  $roots = [System.Windows.Automation.AutomationElement]::RootElement.FindAll([System.Windows.Automation.TreeScope]::Children, $cond)
  if ($roots.Count -gt 0) { $target = $roots[0] }
} else {
  $h = [DshW]::GetForegroundWindow()
  $target = [System.Windows.Automation.AutomationElement]::FromHandle($h)
}
if ($null -eq $target) { ConvertTo-Json -Compress @{ error = 'no matching window' }; exit }
$walker = [System.Windows.Automation.TreeWalker]::ControlViewWalker
$out = @()
$queue = New-Object System.Collections.Queue
# A 2-element array is unwrapped by the Enqueue(object) overload, so the
# pair has to be a single object.
$queue.Enqueue(@{ el = $target; d = 0 })
while ($queue.Count -gt 0 -and $out.Count -lt ${maxElements}) {
  $item = $queue.Dequeue(); $el = $item.el; $d = $item.d
  try {
    $r = Dsh-Rect $el
    $pn = Dsh-Patterns $el
    $keep = (${filterName}) -and (${filterType})
    if (${actionableOnly ? "$true" : "$false"}) { $keep = $keep -and ($pn.Count -gt 0) }
    if ($d -gt 0 -and $keep) {
      $out += [pscustomobject]@{
        depth = $d
        controlType = $el.Current.ControlType.ProgrammaticName.Replace('ControlType.','')
        name = $el.Current.Name
        automationId = $el.Current.AutomationId
        className = $el.Current.ClassName
        enabled = $el.Current.IsEnabled
        x = $r.x; y = $r.y; width = $r.width; height = $r.height
        patterns = $pn
      }
    }
  } catch {}
  if ($d -lt ${maxDepth}) {
    $c = $walker.GetFirstChild($el)
    while ($c) { $queue.Enqueue(@{ el = $c; d = $d + 1 }); $c = $walker.GetNextSibling($c) }
  }
}
$w = @{ pid = $target.Current.ProcessId; title = $target.Current.Name }
ConvertTo-Json -Compress -Depth 6 @{ window = $w; elements = @($out) }
```

</details>

**依据 4 · 源码核查**：[lib/uia-exec.js:127-168](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia-exec.js#L127-L168)

转义/clamp/归一epoch。

<details>
<summary>查看原文（42行）</summary>

```text
function psQuote(s) {
  return "'" + String(s).replace(/'/g, "''") + "'";
}

export async function execute(args, config = {}) {
  const requested = ["windows", "tree", "find", "wait", "path"].includes(args?.action) ? args.action : "tree";
  // The two location actions live in their own module: they walk by name rather
  // than by index, which is a different question from reading the tree.
  if (requested === "wait") return waitForElement(args, config);
  if (requested === "path") return elementPath(args, config);
  const action = requested;
  const timeoutMs = clampInt(config.timeoutMs, { min: 1000, max: 120000, fallback: 30000 });

  if (action === "windows") {
    const { stdout } = await runPowerShell(windowsScript(), { timeoutMs });
    const raw = JSON.parse(stdout.trim() || "[]");
    const windows = (Array.isArray(raw) ? raw : []).map(normalizeWindow);
    return { ok: true, action, count: windows.length, windows };
  }

  const pid = clampInt(args?.pid, { min: 0, max: 2 ** 31, fallback: 0 });
  const maxDepth = clampInt(args?.maxDepth, { min: 1, max: 12, fallback: 4 });
  const maxElements = clampInt(args?.maxElements, { min: 1, max: 1500, fallback: 200 });
  const script = treeScript({
    pid, maxDepth, maxElements,
    nameContains: typeof args?.nameContains === "string" ? args.nameContains : "",
    controlType: typeof args?.controlType === "string" ? args.controlType : "",
    actionableOnly: Boolean(args?.actionableOnly),
  });
  const { stdout } = await runPowerShell(script, { timeoutMs });
  const raw = JSON.parse(stdout.trim() || "{}");
  if (raw.error) return { ok: false, action, error: raw.error };

  const epoch = Date.now();
  const all = (raw.elements ?? []).map((e, i) => normalizeElement(e, i, epoch));
  const elements = action === "find" ? all.filter(isInteresting) : all;
  return {
    ok: true, action, epoch,
    window: { pid: Number(raw.window?.pid ?? 0), title: String(raw.window?.title ?? "") },
    count: elements.length,
    truncated: elements.length >= maxElements,
    elements,
```

</details>

**依据 5 · 源码核查**：[lib/uia-locate.js:88-112](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia-locate.js#L88-L112)

路径唯一匹配和祖先链。

<details>
<summary>查看原文（25行）</summary>

```text
}

export function buildPathScript({ pid, expectName, expectType, maxDepth, maxElements }) {
  return `${PRELUDE}
$target = Dsh-Window ${pid} ''
if ($null -eq $target) { ConvertTo-Json -Compress @{ error = 'no matching window' }; exit }
${locate(expectName, expectType, maxDepth, maxElements)}
if ($matches.Count -eq 0) { ConvertTo-Json -Compress @{ error = 'no element matched' }; exit }
if ($matches.Count -gt 1) { ConvertTo-Json -Compress @{ error = 'ambiguous: more than one element matched'; count = $matches.Count }; exit }
# Walk up from the match to the window and reverse, so the chain reads root-first.
$el = $matches[0]
$chain = New-Object System.Collections.ArrayList
while ($null -ne $el) {
  [void]$chain.Insert(0, @{
    controlType = $el.Current.ControlType.ProgrammaticName.Replace('ControlType.','')
    name = $el.Current.Name
    automationId = $el.Current.AutomationId
  })
  # Stop at the top-level Window, not at the first element carrying an HWND: a
  # native edit control has its own handle, so testing for one stops on the
  # first level and the chain comes back as a single entry.
  if ($el.Current.ControlType.ProgrammaticName -eq "ControlType.Window") { break }
  $el = $walker.GetParent($el)
}
ConvertTo-Json -Compress -Depth 5 @{ chain = @($chain); searched = $seen }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 窗口、handle与秘密披露怎样界定？

**研究主题**：缺陷与关键质疑

#### 完整回答

windowHandle在schema声明，但execute构建script时只传pid/depth/filter，没有用windowHandle；pid有多个顶层窗时取roots[0]，不传pid取当前前台。wait/path另一套Dsh-Window默认pid0取枚举第一个Window，不取前台，与tree默认语义不一致。因此只靠已返回HWND参数不能确保观察同一个窗，动态焦点变化也会改变目标。

handle是epoch.index，execute未存“当前epoch/窗口注册”，也未调用checkHandle；纯helper检查epoch相等并作pid格式判断，但没有把pid与原观察窗绑定。两次Date.now可能同毫秒，不能当全局唯一观察ID。README说动作插件拒旧handle属于跨插件契约，本轮未检查消费者固定版本，不宣称动作安全已经验收。

SECURITY要求不返回token/password等，但观察代码直接取窗口标题/Current.Name、automationId，没有IsPassword/敏感窗口过滤或秘密模式识别。UIA通常能否读密码值由应用提供者决定，不能据未读ValuePattern推断所有Name/title不含秘密。窗口枚举也没有用户批准目标范围或每会话允许PID集合。只读界面仍会把可见内容交模型，需按实际应用/数据许可选择目标。

#### 证据与依据

**依据 1 · 源码核查**：[lib/uia.js:111-120](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia.js#L111-L120)

声明windowHandle与目标语义。

<details>
<summary>查看原文（10行）</summary>

```text
      action: { type: "string", enum: ["windows", "tree", "find", "wait", "path"], description: "windows: list top-level windows. tree: read a bounded element tree. find: search it. wait: poll until a named element appears. path: the ancestor chain of a named element." },
      pid: { type: "number", description: "Target process id (tree/find). Defaults to the foreground window." },
      windowHandle: { type: "string", description: "Target window handle, as returned by action=windows." },
      maxDepth: { type: "number", description: "Tree depth limit (default 4, max 12)." },
      maxElements: { type: "number", description: "Element budget (default 200, max 1500)." },
      nameContains: { type: "string", description: "find: case-insensitive substring of the element name." },
      controlType: { type: "string", description: "find: control type filter, e.g. Button." },
      actionableOnly: { type: "boolean", description: "Return only elements that expose an action pattern." },
      expectName: { type: "string", description: "wait/path: exact element name to look for, as tree reported it." },
      expectType: { type: "string", description: "wait/path: optional control type to narrow the match." },
```

</details>

**依据 2 · 源码核查**：[lib/uia-exec.js:81-89](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia-exec.js#L81-L89)

pid首窗/默认前台。

```text
$target = $null
if (${pid || 0} -gt 0) {
  $cond = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::ProcessIdProperty, ${pid || 0})
  $roots = [System.Windows.Automation.AutomationElement]::RootElement.FindAll([System.Windows.Automation.TreeScope]::Children, $cond)
  if ($roots.Count -gt 0) { $target = $roots[0] }
} else {
  $h = [DshW]::GetForegroundWindow()
  $target = [System.Windows.Automation.AutomationElement]::FromHandle($h)
}
```

**依据 3 · 源码核查**：[lib/uia-exec.js:147-168](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia-exec.js#L147-L168)

未使用windowHandle、不持久epoch。

<details>
<summary>查看原文（22行）</summary>

```text
  const pid = clampInt(args?.pid, { min: 0, max: 2 ** 31, fallback: 0 });
  const maxDepth = clampInt(args?.maxDepth, { min: 1, max: 12, fallback: 4 });
  const maxElements = clampInt(args?.maxElements, { min: 1, max: 1500, fallback: 200 });
  const script = treeScript({
    pid, maxDepth, maxElements,
    nameContains: typeof args?.nameContains === "string" ? args.nameContains : "",
    controlType: typeof args?.controlType === "string" ? args.controlType : "",
    actionableOnly: Boolean(args?.actionableOnly),
  });
  const { stdout } = await runPowerShell(script, { timeoutMs });
  const raw = JSON.parse(stdout.trim() || "{}");
  if (raw.error) return { ok: false, action, error: raw.error };

  const epoch = Date.now();
  const all = (raw.elements ?? []).map((e, i) => normalizeElement(e, i, epoch));
  const elements = action === "find" ? all.filter(isInteresting) : all;
  return {
    ok: true, action, epoch,
    window: { pid: Number(raw.window?.pid ?? 0), title: String(raw.window?.title ?? "") },
    count: elements.length,
    truncated: elements.length >= maxElements,
    elements,
```

</details>

**依据 4 · 源码核查**：[lib/uia-locate.js:19-31](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia-locate.js#L19-L31)

wait/path第一个匹配窗。

<details>
<summary>查看原文（13行）</summary>

```text
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
}
"@
function Dsh-Window([int]$targetPid, [string]$title) {
  $cond = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::ControlTypeProperty, [System.Windows.Automation.ControlType]::Window)
  $wins = [System.Windows.Automation.AutomationElement]::RootElement.FindAll([System.Windows.Automation.TreeScope]::Children, $cond)
  foreach ($w in $wins) {
    if ($w.Current.NativeWindowHandle -eq 0) { continue }
    if ($targetPid -gt 0 -and $w.Current.ProcessId -ne $targetPid) { continue }
    if ($title -ne '' -and $w.Current.Name -notlike "*$title*") { continue }
    return $w
  }
  return $null
```

</details>

**依据 5 · 源码核查**：[lib/uia.js:24-33](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia.js#L24-L33)

helper仅epoch与pid格式判断。

<details>
<summary>查看原文（10行）</summary>

```text
export function checkHandle(handle, { epoch, pid }) {
  const parsed = parseHandle(handle);
  if (!parsed) return { ok: false, error: `malformed handle: ${String(handle)}` };
  if (parsed.epoch !== epoch) {
    return { ok: false, error: `stale handle: observation epoch ${parsed.epoch}, current ${epoch}` };
  }
  if (pid !== undefined && Number(pid) !== parsed.epoch && !Number.isFinite(pid)) {
    return { ok: false, error: `malformed pid: ${String(pid)}` };
  }
  return { ok: true, ...parsed };
```

</details>

**依据 6 · 作者声明**：[SECURITY.md:1-3](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/SECURITY.md#L1-L3)

作者不返回秘密要求。

```text
# Security

`dsh-wsl-uia` must not log, print, or return secrets (tokens, passwords, PEM keys).
```

**依据 7 · 源码核查**：[lib/uia-exec.js:104-114](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia-exec.js#L104-L114)

直接输出Name/AutomationId等。

<details>
<summary>查看原文（11行）</summary>

```text
    if ($d -gt 0 -and $keep) {
      $out += [pscustomobject]@{
        depth = $d
        controlType = $el.Current.ControlType.ProgrammaticName.Replace('ControlType.','')
        name = $el.Current.Name
        automationId = $el.Current.AutomationId
        className = $el.Current.ClassName
        enabled = $el.Current.IsEnabled
        x = $r.x; y = $r.y; width = $r.width; height = $r.height
        patterns = $pn
      }
```

</details>

#### 缺口

- 独立wininput对handle/窗口/名称的同版本验证链未检查。
  **影响**：不提供跨插件防陈旧动作或授权保证。
  **进一步探讨**：可继续固定两仓版本，核观察ID/窗口身份/目标名称在动作前是否重读且拒歧义。
- 各应用UIA provider可见数据与敏感Name/title缺少受控样本。
  **影响**：不能承诺无秘密披露或UIA覆盖率。
  **进一步探讨**：用无真实秘密的自制窗口测试password控件、带假token标题及被遮挡/提权窗，核过滤策略。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动需要哪些条件，推荐读者怎样使用？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Windows+WSL、Node>=18与DSH工具/提示 | 必需 | 跨系统观察 | 非WSL工具明确ok:false |
| Windows PowerShell与UIAutomation程序集 | 必需 | 获取树与前台窗口 | 标准路径无文件则回PATH，真实可用需核 |
| 应用UIA provider/权限 | 数据条件 | 控件语义 | 自绘/权限差异可缺项 |
| 明确目标PID/窗口和数据许可 | 使用前提 | 防错窗/秘密外发 | 不能只靠前台或未实现windowHandle |
| 另装wininput | 仅动作 | 点击/输入/Invoke | 本插件只观察，不提供动作授权 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 无敏感测试窗并核观察权限 | 不先扫全部真实业务界面 |
| 枚举 | 列窗确定PID/标题 | 同PID多窗需显式识别，不依忽略的HWND |
| 树 | 小深度/预算读结构 | 核标题/类型/截断及epoch |
| 查找 | 使用明确名称/type再看path | find空不当不存在，path歧义返回错误 |
| 等待 | 指定PID/名称和时间 | 默认目标与tree不同需核 |
| 后续 | 动作前重新观察并独立确认 | 不将索引当稳定ID/授权 |

本轮不读真实桌面、不执行PowerShell/作者单元或live测试。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-22](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/package.json#L1-L22)

版本/Node/运行入口。

<details>
<summary>查看原文（22行）</summary>

```text
{
  "name": "dsh-wsl-uia",
  "version": "0.1.0",
  "description": "Windows UI Automation observation from WSL: enumerate top-level windows and read a bounded element tree with stable per-observation handles.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/173787247/dsh-wsl-uia.git"
  },
  "bugs": {
    "url": "https://github.com/173787247/dsh-wsl-uia/issues"
  },
  "homepage": "https://github.com/173787247/dsh-wsl-uia#readme",
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "test": "node --test test/*.test.js"
  },
  "files": [
```

</details>

**依据 2 · 源码核查**：[index.js:25-32](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/index.js#L25-L32)

非WSL拒绝与执行错误。

```text
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, action: args?.action ?? "tree", error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, action: args?.action ?? "tree", error: String(error?.message ?? error) };
```

**依据 3 · 源码核查**：[lib/wsl-host.js:8-18](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/wsl-host.js#L8-L18)

固定路径/fallback。

<details>
<summary>查看原文（11行）</summary>

```text
const WINDOWS_BINS = {
  "powershell.exe": ["/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe"],
  "cmd.exe": ["/mnt/c/Windows/System32/cmd.exe"],
  "explorer.exe": ["/mnt/c/Windows/explorer.exe"],
};

export function windowsBin(name, { exists = existsSync } = {}) {
  for (const p of WINDOWS_BINS[name] || []) {
    if (exists(p)) return p;
  }
  return name;
```

</details>

**依据 4 · 源码核查**：[lib/uia-locate.js:88-94](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia-locate.js#L88-L94)

path歧义拒绝。

```text
}

export function buildPathScript({ pid, expectName, expectType, maxDepth, maxElements }) {
  return `${PRELUDE}
$target = Dsh-Window ${pid} ''
if ($null -eq $target) { ConvertTo-Json -Compress @{ error = 'no matching window' }; exit }
${locate(expectName, expectType, maxDepth, maxElements)}
```

**依据 5 · 作者声明**：[README.md:30-33](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/README.md#L30-L33)

作者环境要求。

```text
## Requirements

- Windows with WSL, and DeepSeek Harness running inside it.
- PowerShell reachable at the standard path (the plugin finds it itself).
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 遍历上限、等待与取消是否真正有界？

**研究主题**：工程质量与复用

#### 完整回答

tree while用out.Count<maxElements限制返回匹配节点，队列visited没有独立计数。过滤窄或大量匿名/不匹配节点时，虽然depth上限，访问/入队量可远超maxElements，UIA调用成本未严格受该字段约束；truncated仅elements.length>=maxElements，深度截断/过滤/属性异常跳过没有独立收据。刚好等于预算也不证明确有遗漏。

wait/path的locate用seen限制访问，较tree有明确节点预算。wait每轮可占config timeout（最高120秒），waitMs在轮后才检查，故waitMs100ms不保证100ms返回；主工具默认30秒可能先超时。等待循环sleep与PowerShell执行未绑定exec.signal，宿主取消不自动停止后续轮询。

runPowerShell execFile有timeout和4MiB maxBuffer，异常交顶层ok:false；这些约束覆盖单进程，不证明完整wait预算或Windows UIA调用/后代都立即终止。工具isConcurrencySafe可并行观察，epoch毫秒碰撞/焦点变化与同PID多窗使后续动作仍需重新核目标。作者测试含纯函数与WSL条件live，但存在不等于本轮执行通过。

#### 证据与依据

**依据 1 · 源码核查**：[lib/uia-exec.js:97-123](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia-exec.js#L97-L123)

返回计数预算、队列遍历与异常跳过。

<details>
<summary>查看原文（27行）</summary>

```text
while ($queue.Count -gt 0 -and $out.Count -lt ${maxElements}) {
  $item = $queue.Dequeue(); $el = $item.el; $d = $item.d
  try {
    $r = Dsh-Rect $el
    $pn = Dsh-Patterns $el
    $keep = (${filterName}) -and (${filterType})
    if (${actionableOnly ? "$true" : "$false"}) { $keep = $keep -and ($pn.Count -gt 0) }
    if ($d -gt 0 -and $keep) {
      $out += [pscustomobject]@{
        depth = $d
        controlType = $el.Current.ControlType.ProgrammaticName.Replace('ControlType.','')
        name = $el.Current.Name
        automationId = $el.Current.AutomationId
        className = $el.Current.ClassName
        enabled = $el.Current.IsEnabled
        x = $r.x; y = $r.y; width = $r.width; height = $r.height
        patterns = $pn
      }
    }
  } catch {}
  if ($d -lt ${maxDepth}) {
    $c = $walker.GetFirstChild($el)
    while ($c) { $queue.Enqueue(@{ el = $c; d = $d + 1 }); $c = $walker.GetNextSibling($c) }
  }
}
$w = @{ pid = $target.Current.ProcessId; title = $target.Current.Name }
ConvertTo-Json -Compress -Depth 6 @{ window = $w; elements = @($out) }
```

</details>

**依据 2 · 源码核查**：[lib/uia-exec.js:160-168](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia-exec.js#L160-L168)

epoch/截断推断。

```text
  const epoch = Date.now();
  const all = (raw.elements ?? []).map((e, i) => normalizeElement(e, i, epoch));
  const elements = action === "find" ? all.filter(isInteresting) : all;
  return {
    ok: true, action, epoch,
    window: { pid: Number(raw.window?.pid ?? 0), title: String(raw.window?.title ?? "") },
    count: elements.length,
    truncated: elements.length >= maxElements,
    elements,
```

**依据 3 · 源码核查**：[lib/uia-locate.js:43-67](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia-locate.js#L43-L67)

locate seen预算。

<details>
<summary>查看原文（25行）</summary>

```text
 */
function locate(expectName, expectType, maxDepth, maxElements) {
  return `
$matches = New-Object System.Collections.ArrayList
$seen = 0
$walker = [System.Windows.Automation.TreeWalker]::ControlViewWalker
$queue = New-Object System.Collections.Queue
$queue.Enqueue(@{ el = $target; d = 0 })
while ($queue.Count -gt 0 -and $seen -lt ${maxElements}) {
  $item = $queue.Dequeue(); $el = $item.el; $d = $item.d
  $seen++
  if ($d -gt 0) {
    try {
      $ct = $el.Current.ControlType.ProgrammaticName.Replace('ControlType.','')
      $nm = $el.Current.Name
      $typeOk = ${expectType ? `($ct -eq ${psq(expectType)})` : "$true"}
      if ($typeOk -and $nm -eq ${psq(expectName)}) { [void]$matches.Add($el) }
    } catch {}
  }
  if ($d -lt ${maxDepth}) {
    $c = $walker.GetFirstChild($el)
    while ($c) { $queue.Enqueue(@{ el = $c; d = $d + 1 }); $c = $walker.GetNextSibling($c) }
  }
}
`;
```

</details>

**依据 4 · 源码核查**：[lib/uia-locate.js:116-146](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia-locate.js#L116-L146)

等待单次timeout/总预算轮后判断。

<details>
<summary>查看原文（31行）</summary>

```text
const LIMITS = (args, config) => ({
  expectName: typeof args?.expectName === "string" ? args.expectName : "",
  expectType: typeof args?.expectType === "string" ? args.expectType : "",
  maxDepth: clampInt(args?.maxDepth, { min: 1, max: 12, fallback: 10 }),
  maxElements: clampInt(args?.maxElements, { min: 1, max: 1500, fallback: 1200 }),
  timeoutMs: clampInt(config?.timeoutMs, { min: 1000, max: 120000, fallback: 30000 }),
});

export async function waitForElement(args, config) {
  const o = LIMITS(args, config);
  if (!o.expectName) return { ok: false, action: "wait", error: "expectName is required: name the element to look for" };
  const budget = clampInt(args?.waitMs, { min: 100, max: 60000, fallback: 8000 });
  const started = Date.now();
  let last = { ok: true, action: "wait", found: false, searched: 0, waitedMs: 0 };
  for (;;) {
    const { stdout } = await runPowerShell(
      buildWaitScript({ pid: clampInt(args?.pid, { min: 0, max: 2 ** 31, fallback: 0 }), ...o }),
      { timeoutMs: o.timeoutMs },
    );
    const out = JSON.parse(stdout.trim() || "{}");
    if (out.error) return { ok: false, action: "wait", error: String(out.error) };
    const elapsed = Date.now() - started;
    last = {
      ok: true, action: "wait", found: Boolean(out.found), count: out.count ?? 0,
      searched: out.searched ?? 0, element: out.element, window: out.window, waitedMs: elapsed,
    };
    // A timeout is an answer — "it did not appear" — not a failure.
    if (last.found || elapsed >= budget) break;
    await new Promise((r) => setTimeout(r, elapsed < 2000 ? 400 : 800));
  }
  return last;
```

</details>

**依据 5 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/wsl-host.js#L34-L41)

单进程timeout/buffer。

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

**依据 6 · 源码核查**：[index.js:25-32](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/index.js#L25-L32)

工具timeout与无exec.signal。

```text
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, action: args?.action ?? "tree", error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, action: args?.action ?? "tree", error: String(error?.message ?? error) };
```

**依据 7 · 源码核查**：[test/uia.test.js:138-163](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/test/uia.test.js#L138-L163)

作者live条件测试，仅检查结构。

<details>
<summary>查看原文（26行）</summary>

```text
describe("live (skipped outside WSL)", { skip: !canRunLive }, () => {
  it("lists at least one top-level window", async () => {
    const v = await execute({ action: "windows" }, { timeoutMs: 40_000 });
    assert.equal(v.ok, true);
    assert.ok(v.count >= 1, "expected at least one window");
    assert.ok(v.windows.every((w) => Number.isInteger(w.pid)));
  });

  it("walks a tree and hands out handles from one epoch", async () => {
    const v = await execute({ action: "tree", maxDepth: 10, maxElements: 300 }, { timeoutMs: 90_000 });
    assert.equal(v.ok, true);
    assert.ok(v.count >= 1, "expected at least one element");
    const epochs = new Set(v.elements.map((e) => e.handle.split(".")[0]));
    assert.equal(epochs.size, 1, "every handle must belong to this observation");
    assert.equal(Number([...epochs][0]), v.epoch);
  });

  it("finds an actionable element", async () => {
    const v = await execute({ action: "find", controlType: "Button", maxDepth: 12, maxElements: 400 }, { timeoutMs: 90_000 });
    assert.equal(v.ok, true);
    assert.ok(v.elements.every((e) => e.controlType === "Button"));
  });
});

// ── the location actions, added after the first release ─────────────────────
import { buildWaitScript, buildPathScript, waitForElement, elementPath } from "../lib/uia-locate.js";
```

</details>

#### 缺口

- 窄过滤大树、慢UIA、取消和同时观察的实际开销/资源清理未量测。
  **影响**：不能保证节点/时间预算严格或下游目标稳定。
  **进一步探讨**：自制大树与慢provider核visited/returned/depth截断、总等待和取消后进程，不用真实桌面数据。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本效果、推荐和可继续探讨的方向是什么？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 复用Windows/WSL与应用UIA | 核桥与应用UIA权限/多窗目标 | 应用覆盖/调试时间及金额未知 |
| 持续使用 | PowerShell启动/程序集、UIA遍历与模型文本 | 审阅姓名/控件文本披露 | 窄过滤不一定省扫描，实际资源/费用未知 |
| 失败恢复 | 重复观测与进程/遍历资源 | 排错窗/歧义/慢树 | 本插件不动作回滚，动作消费者另核；恢复时间未知 |

#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 结构观察 | 类型/名称/pattern/矩形 | 依应用UIA，非视觉全面理解 |
| 少定位复制 | 按名wait/path和观测内handle | handle不是跨时稳定身份 |
| 有限返回 | depth/count与进程buffer | tree访问计数/总wait不严格 |

先观察。WSL到UIA的只读结构接线有明确价值，但windowHandle未用、默认目标不一致、观测与动作身份契约未闭合，加上秘密过滤和预算收据缺口，暂不把它当安全自动操作的推荐基础。可先无敏感测试窗口纯观察。

可探讨“会话与窗口绑定的观察收据”。生成随机observation ID绑定PID/HWND/创建时间，所有动作显式复核它和目标Name/type/path；树记录visited/returned/省略原因，time budget贯穿每轮signal，敏感控件Name/title按策略隐藏。相较毫秒索引，目标是少错窗、过期动作和超预算读取。

未实现。最小对照包括同PID多窗、并发同毫秒、焦点切换、忽略HWND、过滤零匹配大树、慢wait和假秘密控件，比较目标正确/拒绝、visited/延迟、披露量与人工次数；若严格身份重核造成过多拒绝，也不能退回不经确认的索引操作。

#### 证据与依据

**依据 1 · 源码核查**：[lib/uia-exec.js:81-89](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia-exec.js#L81-L89)

窗口身份方案基线。

```text
$target = $null
if (${pid || 0} -gt 0) {
  $cond = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::ProcessIdProperty, ${pid || 0})
  $roots = [System.Windows.Automation.AutomationElement]::RootElement.FindAll([System.Windows.Automation.TreeScope]::Children, $cond)
  if ($roots.Count -gt 0) { $target = $roots[0] }
} else {
  $h = [DshW]::GetForegroundWindow()
  $target = [System.Windows.Automation.AutomationElement]::FromHandle($h)
}
```

**依据 2 · 源码核查**：[lib/uia-exec.js:160-168](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia-exec.js#L160-L168)

观测ID/预算方案基线。

```text
  const epoch = Date.now();
  const all = (raw.elements ?? []).map((e, i) => normalizeElement(e, i, epoch));
  const elements = action === "find" ? all.filter(isInteresting) : all;
  return {
    ok: true, action, epoch,
    window: { pid: Number(raw.window?.pid ?? 0), title: String(raw.window?.title ?? "") },
    count: elements.length,
    truncated: elements.length >= maxElements,
    elements,
```

**依据 3 · 源码核查**：[lib/uia-locate.js:124-146](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia-locate.js#L124-L146)

总budget/signal方案基线。

<details>
<summary>查看原文（23行）</summary>

```text
export async function waitForElement(args, config) {
  const o = LIMITS(args, config);
  if (!o.expectName) return { ok: false, action: "wait", error: "expectName is required: name the element to look for" };
  const budget = clampInt(args?.waitMs, { min: 100, max: 60000, fallback: 8000 });
  const started = Date.now();
  let last = { ok: true, action: "wait", found: false, searched: 0, waitedMs: 0 };
  for (;;) {
    const { stdout } = await runPowerShell(
      buildWaitScript({ pid: clampInt(args?.pid, { min: 0, max: 2 ** 31, fallback: 0 }), ...o }),
      { timeoutMs: o.timeoutMs },
    );
    const out = JSON.parse(stdout.trim() || "{}");
    if (out.error) return { ok: false, action: "wait", error: String(out.error) };
    const elapsed = Date.now() - started;
    last = {
      ok: true, action: "wait", found: Boolean(out.found), count: out.count ?? 0,
      searched: out.searched ?? 0, element: out.element, window: out.window, waitedMs: elapsed,
    };
    // A timeout is an answer — "it did not appear" — not a failure.
    if (last.found || elapsed >= budget) break;
    await new Promise((r) => setTimeout(r, elapsed < 2000 ? 400 : 800));
  }
  return last;
```

</details>

#### 缺口

- 没有截图/手动描述与UIA同任务正确率、时间和披露量对照。
  **影响**：不能量化省时或安全优势。
  **进一步探讨**：用自制无敏感应用的固定定位任务比较准确、操作数、token和延迟。
- 窗口绑定观察收据/敏感策略/贯穿取消方案未实现。
  **影响**：不计当前防陈旧或隐私保证。
  **进一步探讨**：固定多窗/焦点/慢树/假秘密异常序列对照拒绝和成本。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
