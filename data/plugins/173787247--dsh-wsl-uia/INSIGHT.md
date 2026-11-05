# dsh-wsl-uia

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[7b5db7f](https://github.com/173787247/dsh-wsl-uia/tree/7b5db7f830e41b1f86b63ba1c1c4a7237fd5a72d)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-uia)
<!-- END META -->

> **功能**：从 WSL 枚举 Windows 窗口、读取控件树，并按名称等待或查找路径。

> **亮点**：[Q01](#research-q01) 在会话内提供语义控件与父级路径线索。

> **主要限制**：[Q02](#research-q02) 句柄只属于观测结果，结果上限和等待预算也不能保证遍历完整或严格时限。

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
  - [Q01 · 如何从 WSL 读取桌面控件而不依赖截图坐标？](#detail-section-11)
  - [Q02 · 观测句柄、搜索边界和等待时限如何解释？](#detail-section-12)
  - [Q03 · 怎样验收并降低遗漏的误判？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：测试者需要查看 Windows 控件的身份、能力和结构线索。

原生 UIA 检查工具或手工观察窗口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 窗口和控件树 | 取得 UIA 属性与支持模式 | 深度、输出及宿主权限有限 |
| 等待与路径 | 定位具名元素 | 重名和单次执行超时影响结果 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| WSL interop 和可访问 Windows UIA 桌面 | 必需 | 读取控件树 | 非 WSL 或权限不足会失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选择测试窗口 | 确认 PID 和可披露内容 |
| 观察 | 用户查询树、等待和路径 | 用原生 UIA 对照 |
| 退出 | 用户改用检查器 | 先核对目标与遍历边界 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 配置隔离桌面 | 需 Windows interop |
| 持续 | 遍历开销未知 | 核对句柄和限制 | 等待可能反复启动进程 |
| 失败 | 排查时间未知 | 回原生 UIA | 区分未访问和确实不存在 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 控件定位 | 提供结构、模式和父级路径 | 真实应用覆盖和节时 |

> **思考**：[Q02](#research-q02) 句柄只属于观测结果，结果上限和等待预算也不能保证遍历完整或严格时限。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 在会话内提供语义控件与父级路径线索。

[Q02](#research-q02) 输出预算与遍历预算不同，观测索引不能当稳定句柄。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 句柄只属于观测结果，结果上限和等待预算也不能保证遍历完整或严格时限。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在无敏感内容的测试窗口以原生 UIA 复核树和等待。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持观察动作，真实控件覆盖、等待和收益未验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/uia-exec.js、lib/uia-locate.js、lib/uia.js、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码。未运行 Windows、UIA、DSH 或目标测试。
- 下一步：验收多窗口、重名、截断、大树、权限与慢响应。

**分析版本**

- **仓库**：[173787247/dsh-wsl-uia](https://github.com/173787247/dsh-wsl-uia)
- **版本号**：0.1.0（[固定提交 7b5db7f](https://github.com/173787247/dsh-wsl-uia/tree/7b5db7f830e41b1f86b63ba1c1c4a7237fd5a72d)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 回显遍历停止原因并传播剩余时间，比较漏检误读。

验收多窗口、重名、截断、大树、权限与慢响应。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 123 | — | — | 559 |
| .js | source | 5 | 583 | 507 | 32 | — |
| .js | test | 1 | 203 | 181 | 6 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-uia/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-uia/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-uia/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 开发者能否在 DSH 取得足以定位测试控件的 Windows UIA 观察？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 如何从 WSL 读取桌面控件而不依赖截图坐标？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

桌面测试者可枚举顶层窗口，查询目标的控件树、支持模式和边界矩形，也可等待具名元素出现或追踪父级路径。相比肉眼看图，UIA 能给控件类型、名称与 AutomationId，有助于从当前 DSH 会话定位状态。产物是一次观察，不能视为对控件的操作或永久 ID。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-7](https://github.com/173787247/dsh-wsl-uia/blob/7b5db7f830e41b1f86b63ba1c1c4a7237fd5a72d/README.md#L3-L7)

作者观察定位。

```text
DeepSeek Harness plugin: Windows UI Automation observation from WSL: enumerate top-level windows and read a bounded element tree with per-observation handles.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)
```

**依据 2 · 源码核查**：[lib/uia-exec.js:91-122](https://github.com/173787247/dsh-wsl-uia/blob/7b5db7f830e41b1f86b63ba1c1c4a7237fd5a72d/lib/uia-exec.js#L91-L122)

实际遍历和元素属性。

<details>
<summary>查看原文（32行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/uia-locate.js:70-112](https://github.com/173787247/dsh-wsl-uia/blob/7b5db7f830e41b1f86b63ba1c1c4a7237fd5a72d/lib/uia-locate.js#L70-L112)

等待与路径的脚本。

<details>
<summary>查看原文（43行）</summary>

```text
export function buildWaitScript({ pid, expectName, expectType, maxDepth, maxElements }) {
  return `${PRELUDE}
$target = Dsh-Window ${pid} ''
if ($null -eq $target) { ConvertTo-Json -Compress @{ error = 'no matching window' }; exit }
${locate(expectName, expectType, maxDepth, maxElements)}
if ($matches.Count -eq 0) { ConvertTo-Json -Compress @{ found = $false; searched = $seen }; exit }
ConvertTo-Json -Compress -Depth 4 @{
  found = $true
  count = $matches.Count
  searched = $seen
  element = @{
    controlType = $matches[0].Current.ControlType.ProgrammaticName.Replace('ControlType.','')
    name = $matches[0].Current.Name
    enabled = $matches[0].Current.IsEnabled
  }
  window = @{ pid = $target.Current.ProcessId; title = $target.Current.Name }
}
`;
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

#### 缺口

- 未测试真实应用 UIA 树覆盖
  **影响**：不能确定跨应用识别率和用户节时
  **进一步探讨**：对照两种测试应用的原生 UIA 检查器

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 观测句柄、搜索边界和等待时限如何解释？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

tree 在显式 PID 下取第一个顶层匹配，缺省用前台，给结果生成时间戳与数组序号句柄。句柄是本次结果的定位线索，不能由它证明窗口或控件身份跨观察稳定。tree 遍历深度有界，循环上限用输出条数；若过滤排除大量元素，实际访问节点可多于 maxElements。find 在输出之后再筛有名称或模式的结果，truncated 取最终条数，可能掩盖上游截断。wait 按 name/type 反复启动 PowerShell，每次进程使用独立超时，整段 waitMs 只在请求结束后检查，不能保证严格截止。path 对多个匹配会拒绝，wait 则给第一个及计数。

#### 证据与依据

**依据 1 · 源码核查**：[lib/uia-exec.js:76-122](https://github.com/173787247/dsh-wsl-uia/blob/7b5db7f830e41b1f86b63ba1c1c4a7237fd5a72d/lib/uia-exec.js#L76-L122)

目标、访问边界和字段。

<details>
<summary>查看原文（47行）</summary>

```text
  // `$_` is not bound outside a pipeline — these run as plain expressions
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
```

</details>

**依据 2 · 源码核查**：[lib/uia-exec.js:147-168](https://github.com/173787247/dsh-wsl-uia/blob/7b5db7f830e41b1f86b63ba1c1c4a7237fd5a72d/lib/uia-exec.js#L147-L168)

生成 epoch、后筛与截断。

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

**依据 3 · 源码核查**：[lib/uia.js:7-34](https://github.com/173787247/dsh-wsl-uia/blob/7b5db7f830e41b1f86b63ba1c1c4a7237fd5a72d/lib/uia.js#L7-L34)

句柄编码。

<details>
<summary>查看原文（28行）</summary>

```text
export function makeHandle(epoch, index) {
  return `${epoch}.${index}`;
}

export function parseHandle(handle) {
  if (typeof handle !== "string") return null;
  const m = /^(\d+)\.(\d+)$/.exec(handle.trim());
  if (!m) return null;
  return { epoch: Number(m[1]), index: Number(m[2]) };
}

/**
 * A handle is only usable if it came from an observation of the same window and
 * the current epoch. Anything else means the caller is acting on a picture of
 * the UI that may already be out of date, which is what this check exists to
 * catch rather than paper over.
 */
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
}
```

</details>

**依据 4 · 源码核查**：[lib/uia-locate.js:70-97](https://github.com/173787247/dsh-wsl-uia/blob/7b5db7f830e41b1f86b63ba1c1c4a7237fd5a72d/lib/uia-locate.js#L70-L97)

等待与路径歧义处理。

<details>
<summary>查看原文（28行）</summary>

```text
export function buildWaitScript({ pid, expectName, expectType, maxDepth, maxElements }) {
  return `${PRELUDE}
$target = Dsh-Window ${pid} ''
if ($null -eq $target) { ConvertTo-Json -Compress @{ error = 'no matching window' }; exit }
${locate(expectName, expectType, maxDepth, maxElements)}
if ($matches.Count -eq 0) { ConvertTo-Json -Compress @{ found = $false; searched = $seen }; exit }
ConvertTo-Json -Compress -Depth 4 @{
  found = $true
  count = $matches.Count
  searched = $seen
  element = @{
    controlType = $matches[0].Current.ControlType.ProgrammaticName.Replace('ControlType.','')
    name = $matches[0].Current.Name
    enabled = $matches[0].Current.IsEnabled
  }
  window = @{ pid = $target.Current.ProcessId; title = $target.Current.Name }
}
`;
}

export function buildPathScript({ pid, expectName, expectType, maxDepth, maxElements }) {
  return `${PRELUDE}
$target = Dsh-Window ${pid} ''
if ($null -eq $target) { ConvertTo-Json -Compress @{ error = 'no matching window' }; exit }
${locate(expectName, expectType, maxDepth, maxElements)}
if ($matches.Count -eq 0) { ConvertTo-Json -Compress @{ error = 'no element matched' }; exit }
if ($matches.Count -gt 1) { ConvertTo-Json -Compress @{ error = 'ambiguous: more than one element matched'; count = $matches.Count }; exit }
# Walk up from the match to the window and reverse, so the chain reads root-first.
```

</details>

**依据 5 · 源码核查**：[lib/uia-locate.js:124-146](https://github.com/173787247/dsh-wsl-uia/blob/7b5db7f830e41b1f86b63ba1c1c4a7237fd5a72d/lib/uia-locate.js#L124-L146)

独立超时与轮询预算。

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

- 没有真实树、重复控件和慢调用结果
  **影响**：不能保证覆盖或等待时限
  **进一步探讨**：在隔离应用测试多窗口、深树、重名和超时

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样验收并降低遗漏的误判？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

先用 Windows interop 可用的隔离 WSL 桌面，明确 PID 且避免真实窗口标题与控件内容进入结果。对照原生 UIA 树和路径；找不到时核对边界，不直接推断控件不存在。可对照返回访问数、选中数和停止原因，并使每次进程耗时受剩余预算约束，比较大树和慢响应的误判、耗时和召回。若误报或合法结果遗漏上升，则不采纳。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:17-33](https://github.com/173787247/dsh-wsl-uia/blob/7b5db7f830e41b1f86b63ba1c1c4a7237fd5a72d/index.js#L17-L33)

工具与宿主门槛。

<details>
<summary>查看原文（17行）</summary>

```text
  ctx.tools.register({
    name: "uia_tree",
    description: "Observe Windows UI from WSL via UI Automation. action=windows lists top-level windows; action=tree returns a bounded element tree with per-observation handles; action=find searches the tree.",
    parameters: uia.parameters(),
    output: {
      schema: uia.outputSchema(),
      render: (_args, value) => [{ type: "text", text: uia.format(value) }],
    },
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, action: args?.action ?? "tree", error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, action: args?.action ?? "tree", error: String(error?.message ?? error) };
      }
```

</details>

**依据 2 · 源码核查**：[lib/uia-exec.js:97-119](https://github.com/173787247/dsh-wsl-uia/blob/7b5db7f830e41b1f86b63ba1c1c4a7237fd5a72d/lib/uia-exec.js#L97-L119)

树输出计数与深度。

<details>
<summary>查看原文（23行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/uia-locate.js:124-146](https://github.com/173787247/dsh-wsl-uia/blob/7b5db7f830e41b1f86b63ba1c1c4a7237fd5a72d/lib/uia-locate.js#L124-L146)

等待预算基线。

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

- 无真实应用、权限及改法对照
  **影响**：未知实际接入和探测成本
  **进一步探讨**：用合成桌面样例验证访问量与实际等待

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
