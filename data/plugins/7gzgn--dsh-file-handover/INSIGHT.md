# dsh-file-handover

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[e1c6158](https://github.com/7gzgn/dsh-file-handover/tree/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：将本地文件路径填入Windows原生文件框，按Win32/UIA/剪贴板回读并可确认，返回候选与动作记录。

> **核心亮点**：把原生文件选择框环节接进模型工具，给回读与候选记录。详见[Q01](#research-q01)。

> **风险与缺陷**：默认首结构匹配无PID/HWND绑定，路径回读仅子串兜底，确认消息不等应用接收且取消未传播。详见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 递文件解决什么任务？](#detail-section-11)
  - [Q02 · Node到Windows动作如何实现？](#detail-section-12)
  - [Q03 · 显式目标与回读规则真的足够精确吗？](#detail-section-13)
  - [Q04 · 限时、取消与维护成本有哪些证据？](#detail-section-14)
  - [Q05 · 适合如何采用，进一步研究什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：浏览器上传/应用打开文件需要跨到Windows原生文件框。详见[Q01](#research-q01)。

人工文件选择或固定应用专用GUI自动化，工具回读不等上传成功。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 探测/填路径 | 原生文件框 | 首结构匹配 |
| 回读/确认 | 交接动作 | 子串/无应用收据 |
| CLI | 脱离会话调用 | 非DSH用户命令 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| Node>=18/宿主工具 | 注册编排 | ABI |
| Windows PS/.NET | Win32/UIA | 非Windows通常spawn失败 |
| 交互桌面/权限 | 控件动作 | 焦点/权限差异 |
| 单一已打开文件框 | 选目标 | 默认多框不拒绝 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 打开指定应用文件框 | 用户/浏览器工具 | 单一目标 |
| probe看现场 | 模型与用户 | 标题/PID明确 |
| 只填路径核对 | 工具与用户 | 精确文件列表 |
| 应用回读接收 | 用户/应用工具 | 不只看confirmed |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Windows交互桌面/权限 | 打开框、核唯一目标 | 需Windows交互桌面/唯一对话框；准备工时未知 |
| 持续使用 | PS进程、焦点和剪贴板；无插件模型请求 | 人工确认目标与应用附件结果 | 无插件模型请求；PS/焦点/剪贴板资源和成功率未计量 |
| 失败恢复 | 候选/actual与应用附件状态 | 先查已发生动作，避免盲重试 | 先核actual与应用附件再重试；恢复工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 填原生框 | Win32/UIA/fallback | Windows/焦点 |
| 路径回读 | actual与重试 | 子串非集合一致 |
| 交接结果 | 确认消息与现场 | 应用接收需外部回读 |

> **思考**：默认首结构匹配无PID/HWND绑定，路径回读仅子串兜底，确认消息不等应用接收且取消未传播。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把原生文件选择框环节接进模型工具，给回读与候选记录。详见[Q01](#research-q01)。

把原生文件选择框环节接进模型工具，给回读与候选记录。详见[Q01](#research-q01)。

纯plan与动作拆分、失败现场/拒未回读确认可借鉴，需精确身份与取消。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认首结构匹配无PID/HWND绑定，路径回读仅子串兜底，确认消息不等应用接收且取消未传播。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，单可见框probe+click=false人工核对。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

回读与失败现场设计可查；目标非必选身份、子串校验和全局输入限制自动确认。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/plan.js、lib/handover.js、lib/handover.ps1、bin/dsh-file-handover.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定完整plan/Node编排和宿主注册、PowerShell定位/回读/fallback/确认关键链、CLI/README；不执行桌面。
- 下一步：进一步从双框/换框、路径前缀、抢焦点和确认后超时研究租约/收据。

**分析版本**

- **仓库**：[7gzgn/dsh-file-handover](https://github.com/7gzgn/dsh-file-handover)
- **版本号**：0.2.1（[固定提交 e1c6158](https://github.com/7gzgn/dsh-file-handover/tree/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究目标租约、精确路径集合与应用回执，拒多候选并限制全局输入，比较误投/重复确认。当前未验证。详见[Q05](#research-q05)。

进一步从双框/换框、路径前缀、抢焦点和确认后超时研究租约/收据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 95 | 71 | 11 | — |
| .js | source | 3 | 508 | 352 | 121 | — |
| .md | source | 1 | 122 | — | — | 1577 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-file-handover/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-file-handover/issues?q=is%3Aissue+created%3A2026-09-22T06%3A24%3A33.147Z..2026-10-22T06%3A24%3A33.147Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-file-handover/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A24%3A33.147Z..2026-10-22T06%3A24%3A33.147Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Windows原生文件框交接怎样定位目标/回读/确认，其结果可支持什么自动化责任？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 递文件解决什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向Windows上网页上传、聊天发文件、应用打开本地文档时的原生文件选择框。模型先用其他工具触发打开框，再调handover_file验证绝对路径文件存在、等待对话框、填路径/回读并可点击打开；独立CLI还可probe。贡献是把浏览器自动化之外的原生文件框环节接成结构化结果，而不是文件传输协议或目标应用上传验收。

成功层级必须分清探测到框、路径回读、点击确认以及应用确实收到文件。README本身要求最后用浏览器/应用回读名字字节数；工具ok最多表明脚本这段动作满足其判断，不能替代发布、上传、发送结果。描述“目标总显式”与参数实际能力不一致，绝对文件路径显式不等目标窗口身份显式。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:46-59](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/README.md#L46-L59)

工具配合与外部回读。

<details>
<summary>查看原文（14行）</summary>

````text
handover_file  path=<绝对路径>                        # 单个文件
handover_file  paths=[<绝对路径>, <绝对路径>, ...]      # 多选（v0.2.0，最多 12 个）
handover_file  path=... [timeoutSec] [dryRun] [expectTitle] [maxAttempts] [click]
```

**多选**（v0.2.0）：对话框支持多选时（网页的多图上传、微信发多个文件、系统"打开"框），
给 `paths` 数组即可。插件把路径按 `"a" "b" "c"` 的格式填进去，**逐个回读**——
少一个就算失败，不会出现"以为交了三个、实际只进了一个"。

典型配合（以网页上传为例）：

1. 用浏览器工具**真实点击**页面的"上传/选择文件"按钮（程序化 `input.click()` 不会弹出系统对话框）；
2. 调 `handover_file` 递文件（单个用 `path`，多个用 `paths`）；
3. 用浏览器工具**回读页面**，确认它真的收到了那些文件（名字/字节数）。
````

</details>

**依据 2 · 源码核查**：[lib/index.js:69-87](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/index.js#L69-L87)

工具参数无窗口ID/PID。

<details>
<summary>查看原文（19行）</summary>

```text
      name: 'handover_file',
      description: [
        '把一个或多个本地文件交给系统"打开文件"对话框（网页上传、微信发文件、PS 打开都行）。',
        '用法：先做触发动作（例如真实点击页面的"上传"按钮），再调它 —— 它会等对话框出现、填好路径、**读回来核对**、点确认。',
        '**目标必须显式**：它不会自己去找"最像的对话框"；路径必须是绝对路径。',
        '**多选**：给 `paths` 数组（最多 12 个）就能一次交多个文件 —— 图文、多附件都用它；单个文件仍可用 `path`。',
        '每步回读、失败带现场（看到过哪些候选窗口 + 每次尝试的实际值）。',
      ].join('\n'),
      timeoutMs: TOOL_TIMEOUT_MS,
      parameters: {
        path: { type: 'string', description: '要交付的**单个**本地文件绝对路径（与 paths 二选一）' },
        paths: { type: 'array', items: { type: 'string' }, description: '要一次交付的多个文件（绝对路径数组，最多 12 个；与 path 二选一）' },
        timeoutSec: { type: 'number', description: `等对话框出现的秒数（默认 ${DEFAULT_TIMEOUT_SEC}；实测弹窗延迟可 >15s）` },
        dryRun: { type: 'boolean', description: 'true = 只探测（找对话框、报结构），不填不点' },
        expectTitle: { type: 'string', description: '显式按标题前缀过滤对话框标题（默认空 = 不按标题，只认结构）' },
        dialogAutomationId: { type: 'string', description: `文件名输入框的自动化 id（默认 ${DEFAULT_FILE_INPUT_AUTOMATION_ID}）` },
        confirmAutomationId: { type: 'string', description: `确认按钮的自动化 id（默认 ${DEFAULT_CONFIRM_AUTOMATION_ID}；取消是 ${CANCEL_AUTOMATION_ID}）` },
        maxAttempts: { type: 'number', description: `填值+回读的最大轮数（默认 ${DEFAULT_MAX_ATTEMPTS}）` },
        click: { type: 'boolean', description: 'false = 只填路径、不点确认（想自己确认时用）' },
```

</details>

**依据 3 · 源码核查**：[lib/handover.js:70-103](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/handover.js#L70-L103)

结果封装。

<details>
<summary>查看原文（34行）</summary>

```text
export async function runHandover(input = {}, deps = {}) {
  const errors = validateInput(input);
  if (errors.length > 0) return { ok: false, stage: 'validate', errors };

  const list = Array.isArray(input.paths) && input.paths.length > 0
    ? input.paths.filter((p) => typeof p === 'string' && p.trim() !== '')
    : [input.path];
  const fileCheck = await checkFiles(list, { statImpl: deps.statImpl });
  if (fileCheck.ok !== true) return { ok: false, stage: 'file', errors: [fileCheck.reason] };

  const scriptPath = deps.scriptPath ?? defaultScriptPath();
  const powershell = deps.powershell ?? defaultPowerShell();
  const timeoutSec = Number.isFinite(input.timeoutSec) ? input.timeoutSec : DEFAULT_TIMEOUT_SEC;
  const { command, args } = buildPsCommand(input, { scriptPath, powershell });

  // 脚本自己按秒轮询等对话框；这里只做"比它更宽"的硬上限，防止它卡死。
  const spawnResult = await spawnAndCollect(
    deps.spawnImpl ?? nodeSpawn,
    command,
    args,
    (timeoutSec + 20) * 1000,
  );

  const parsed = parseHandoverResult(spawnResult.stdout);
  const result = parsed === null ? null : { ...parsed, fileSize: fileCheck.size, files: fileCheck.files };
  return {
    ok: spawnResult.code === 0 && result?.ok === true,
    stage: 'run',
    result,
    code: spawnResult.code,
    stdout: spawnResult.stdout,
    stderr: spawnResult.stderr,
    command: [command, ...args].join(' '),
    errors: [],
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Node到Windows动作如何实现？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

plan校验文件绝对路径/最多12个，stat逐个确认文件，组argv不经shell插值。Node spawn powershell.exe -NoProfile -ExecutionPolicy Bypass执行随包脚本，脚本编译C# Win32辅助及UIAutomation，枚举#32770窗口并找AutomationId1148。先用Win32文件编辑框WM_SETTEXT回读，后UIA Value/Legacy，最后剪贴板和SendKeys；确认按按钮ID1或指定ID，NoConfirm只填不点。ASCII脚本减少旧Windows PowerShell无BOM乱码，是针对平台的务实工程取舍。

需要交互Windows桌面、PowerShell/.NET UIAutomation/Forms以及可访问目标进程权限；Node>=18和宿主tools/systemPrompt，CLI只是bin不是DSH用户命令。环境DSH_FILE_HANDOVER_POWERSHELL可更换可执行文件，需可信设置。非Windows无明确平台早拒绝，通常到spawn失败；Windows绝对路径在其他平台Node path语义也不同。

#### 证据与依据

**依据 1 · 源码核查**：[lib/plan.js:36-69](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/plan.js#L36-L69)

校验。

<details>
<summary>查看原文（34行）</summary>

```text
 */
export function validateInput(input = {}) {
  const errors = [];
  const paths = Array.isArray(input.paths) ? input.paths.filter((p) => typeof p === 'string' && p.trim() !== '') : [];
  const path = input.path;
  if (paths.length === 0 && (typeof path !== 'string' || path.trim() === '')) {
    errors.push('path 必填：要交付的本地文件**绝对路径**（多个文件用 paths 数组）');
  } else {
    const list = paths.length > 0 ? paths : [path];
    for (const item of list) {
      if (!isAbsolute(item)) errors.push(`必须是绝对路径（不许靠当前目录猜）：${item}`);
    }
    if (list.length > 12) errors.push(`一次最多 12 个文件（给了 ${list.length} 个）`);
  }
  if (input.paths !== undefined && !Array.isArray(input.paths)) {
    errors.push('paths 必须是字符串数组');
  } else if (Array.isArray(input.paths) && input.paths.some((p) => typeof p !== 'string')) {
    errors.push('paths 里每一项都必须是字符串');
  }
  if (input.expectTitle !== undefined && typeof input.expectTitle !== 'string') {
    errors.push('expectTitle 必须是字符串（不填 = 不按标题过滤，只认结构）');
  }
  if (input.timeoutSec !== undefined && (!Number.isFinite(input.timeoutSec) || input.timeoutSec <= 0)) {
    errors.push('timeoutSec 必须是正数（秒）');
  }
  if (input.maxAttempts !== undefined && (!Number.isInteger(input.maxAttempts) || input.maxAttempts < 1)) {
    errors.push('maxAttempts 必须是 ≥1 的整数');
  }
  if (input.dialogAutomationId !== undefined && !/^\d+$/.test(String(input.dialogAutomationId))) {
    errors.push('dialogAutomationId 必须是数字字符串（Windows 文件对话框的约定是 1148）');
  }
  if (input.confirmAutomationId !== undefined && !/^\d+$/.test(String(input.confirmAutomationId))) {
    errors.push('confirmAutomationId 必须是数字字符串（打开=1 / 取消=2）');
  }
```

</details>

**依据 2 · 源码核查**：[lib/plan.js:112-149](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/plan.js#L112-L149)

argv与ExecutionPolicy。

<details>
<summary>查看原文（38行）</summary>

```text
 */
export function buildPsArgs(input = {}) {
  const list = Array.isArray(input.paths) && input.paths.length > 0
    ? input.paths.filter((p) => typeof p === 'string' && p.trim() !== '')
    : (typeof input.path === 'string' && input.path !== '' ? [input.path] : []);
  const args = [
    list.length > 1 ? '-Paths' : '-Path', String(list.length > 1 ? list.join('|') : (list[0] ?? '')),
    '-TimeoutSec', String(input.timeoutSec ?? DEFAULT_TIMEOUT_SEC),
    '-FileNameAutomationId', String(input.dialogAutomationId ?? DEFAULT_FILE_INPUT_AUTOMATION_ID),
    '-ConfirmAutomationId', String(input.confirmAutomationId ?? DEFAULT_CONFIRM_AUTOMATION_ID),
    '-MaxAttempts', String(input.maxAttempts ?? DEFAULT_MAX_ATTEMPTS),
  ];
  if (typeof input.expectTitle === 'string' && input.expectTitle !== '') {
    args.push('-ExpectTitle', input.expectTitle);
  }
  if (input.dryRun === true) args.push('-DryRun');
  if (input.click === false) args.push('-NoConfirm');
  return args;
}

/**
 * 构造完整的 PowerShell 调用（脚本路径 + 参数）。
 * @param {object} input 参数
 * @param {object} opts 选项 `{ scriptPath, powershell }`
 * @returns {{command:string, args:string[]}} 调用
 */
export function buildPsCommand(input, { scriptPath, powershell = 'powershell.exe' } = {}) {
  return {
    command: powershell,
    args: ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', scriptPath, ...buildPsArgs(input)],
  };
}

/**
 * 从 stdout 里取出脚本的 JSON 结果（容忍前面混进的杂音）。
 * @param {string} stdout 标准输出
 * @returns {object|null} 结果或 null
 */
```

</details>

**依据 3 · 源码核查**：[lib/handover.js:25-31](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/handover.js#L25-L31)

解释器配置。

```text
export function defaultScriptPath() {
  return join(HERE, 'handover.ps1');
}

/** 用哪个 PowerShell：默认 Windows 自带的 powershell.exe（一切 Windows 都有），可用环境变量覆盖。 */
export function defaultPowerShell() {
  return process.env.DSH_FILE_HANDOVER_POWERSHELL ?? 'powershell.exe';
```

**依据 4 · 源码核查**：[lib/handover.ps1:1-25](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/handover.ps1#L1-L25)

Win32与ASCII取舍。

<details>
<summary>查看原文（25行）</summary>

```text
# handover.ps1 - hand a local file to a native "Open" file dialog, verifying every step.
#
# This script is deliberately ASCII-only. Reason (measured, not theory): a .ps1 saved
# as UTF-8 *without* BOM is read by Windows PowerShell as GBK, so any non-ASCII literal
# (a window title, say) turns into mojibake and every title-based match silently fails.
#
# Why Win32 messages instead of UI Automation for the actual typing:
#   On this machine, this process's UIA view of the modern file dialog exposes NO
#   editable "file name" element at all - the three elements carrying automation id 1148
#   all come back as ControlType.Pane with no ValuePattern (only the list items and the
#   search box are Edit). The dialog is the classic Win32 construction underneath:
#       dialog > ComboBoxEx32 > ComboBox > Edit
#   so FindWindowEx + WM_SETTEXT reaches the real edit control, needs no focus, no key
#   timing and no automation provider cooperation. UIA stays as a fallback, and the
#   keyboard as a last resort - every route reads the value back before it is trusted.
#
# Rules this file follows, all learned on a real upload page:
#   1. Find the dialog by structure (top-level class #32770 carrying id 1148), never by
#      title. EnumWindows is used because UIA desktop-tree traversal returned an empty
#      set for a dialog another tool could see at that same moment.
#   2. Wait patiently: the native dialog can appear well over 15 seconds after the click.
#   3. Type, then READ BACK, and retry. Text sent to a freshly activated dialog drops its
#      first characters (reproducible: "D:\..." arrives as ":\..."), so one attempt is
#      never trusted.
#   4. Confirm through the control id (1 = Open/Save, 2 = Cancel), never a blind Enter.
```

</details>

**依据 5 · 源码核查**：[lib/handover.ps1:236-262](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/handover.ps1#L236-L262)

装配/选框。

<details>
<summary>查看原文（27行）</summary>

```text
try {
  Add-Type -AssemblyName UIAutomationClient
  Add-Type -AssemblyName UIAutomationTypes
  Add-Type -AssemblyName System.Windows.Forms
  Add-Type -TypeDefinition $win32Source -Language CSharp | Out-Null

  $AE = [System.Windows.Automation.AutomationElement]
  $tree = [System.Windows.Automation.TreeScope]
  $inputCond = [System.Windows.Automation.PropertyCondition]::new($AE::AutomationIdProperty, $FileNameAutomationId)

  # ---- 1. Wait for a #32770 that carries the file-name control --------------------
  $deadline = (Get-Date).AddSeconds($TimeoutSec)
  $dialogElement = $null
  $dialogHwnd = [IntPtr]::Zero
  while ((Get-Date) -lt $deadline) {
    foreach ($h in [HandoverWin32]::TopLevelByClass('#32770')) {
      $el = $AE::FromHandle($h)
      if ($null -eq $el) { continue }
      $title = $el.Current.Name
      if ($ExpectTitle -ne '' -and $title -notlike "$ExpectTitle*") { continue }
      $hasInput = $false
      try { $hasInput = ($null -ne $el.FindFirst($tree::Descendants, $inputCond)) } catch { $hasInput = $false }
      $entry = [ordered]@{ hwnd = [int64]$h; pid = $el.Current.ProcessId; title = $title; hasFileInput = $hasInput }
      $exists = $false
      foreach ($s in $seen) { if ([int64]$s.hwnd -eq [int64]$h) { $exists = $true; break } }
      if (-not $exists) { [void]$seen.Add($entry) }
      if ($hasInput) { $dialogElement = $el; $dialogHwnd = $h; break }
```

</details>

**依据 6 · 源码核查**：[package.json:38-44](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/package.json#L38-L44)

Node声明。

```text
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "test": "node test/smoke.mjs"
  },
  "publishConfig": {
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 显式目标与回读规则真的足够精确吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

默认不填expectTitle时在所有#32770中选第一个带输入控件的框，没有必选PID/HWND/owner，也不因多个匹配而拒绝；标题是PowerShell -like前缀模式，未逃逸通配符，仍不能证明唯一目标。dryRun返回的hwnd/pid不会作为下次正式调用的绑定参数，再调用会重新枚举，期间切框可能误投。不能将“不是按最像标题猜”扩写为窗口身份已明确。

Test-Filled先比较整串，再检查每个路径是否是actual子串，连单文件也会走子串兜底；额外路径或a与a-copy前缀可以被误认为一致，多选没有解析成精确路径集合。剪贴板fallback会改全局剪贴板且不恢复，SetForegroundWindow结果被忽略，随后全局SendKeys/80次Backspace可能作用于变化的焦点；回读失败现在会拒绝确认，这是积极修复但不能撤销已经误打的键。确认true是按钮消息/Invoke发出，不检查对话框关闭或目标应用收文件；WM_COMMAND fallback可能已经发动作却返回false后再尝试UIA，存在重复确认可能。

#### 证据与依据

**依据 1 · 源码核查**：[lib/handover.ps1:66-73](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/handover.ps1#L66-L73)

子串回读。

```text
# Read-back check: exact match for one path; for several, every path must appear.
function Test-Filled([string]$actual) {
  if ($null -eq $actual) { return $false }
  if ($actual -eq $FillText) { return $true }
  foreach ($p in $allPaths) {
    if ($actual.IndexOf($p, [System.StringComparison]::OrdinalIgnoreCase) -lt 0) { return $false }
  }
  return $true
```

**依据 2 · 源码核查**：[lib/handover.ps1:250-281](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/handover.ps1#L250-L281)

首结构匹配与dry-run。

<details>
<summary>查看原文（32行）</summary>

```text
  while ((Get-Date) -lt $deadline) {
    foreach ($h in [HandoverWin32]::TopLevelByClass('#32770')) {
      $el = $AE::FromHandle($h)
      if ($null -eq $el) { continue }
      $title = $el.Current.Name
      if ($ExpectTitle -ne '' -and $title -notlike "$ExpectTitle*") { continue }
      $hasInput = $false
      try { $hasInput = ($null -ne $el.FindFirst($tree::Descendants, $inputCond)) } catch { $hasInput = $false }
      $entry = [ordered]@{ hwnd = [int64]$h; pid = $el.Current.ProcessId; title = $title; hasFileInput = $hasInput }
      $exists = $false
      foreach ($s in $seen) { if ([int64]$s.hwnd -eq [int64]$h) { $exists = $true; break } }
      if (-not $exists) { [void]$seen.Add($entry) }
      if ($hasInput) { $dialogElement = $el; $dialogHwnd = $h; break }
    }
    if ($null -ne $dialogElement) { break }
    Start-Sleep -Milliseconds 300
  }

  $result.seen = @($seen)
  if ($null -eq $dialogElement) {
    throw "dialog-not-found within ${TimeoutSec}s (saw $($seen.Count) candidate window(s))"
  }
  $result.dialog = [ordered]@{
    hwnd = [int64]$dialogHwnd
    pid = $dialogElement.Current.ProcessId
    title = $dialogElement.Current.Name
  }

  if ($DryRun) {
    $result.ok = $true
    $result | ConvertTo-Json -Compress -Depth 8
    exit 0
```

</details>

**依据 3 · 源码核查**：[lib/handover.ps1:172-180](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/handover.ps1#L172-L180)

确认fallback发消息又返回false。

```text
    public static bool ClickButtonById(IntPtr dialog, int id) {
        IntPtr button = FindButtonById(dialog, id);
        if (button != IntPtr.Zero) {
            SendMessage(button, BM_CLICK, IntPtr.Zero, IntPtr.Zero);
            return true;
        }
        // No button found: fall back to telling the dialog itself (IDOK) to commit.
        SendMessage(dialog, WM_COMMAND, new IntPtr(id), IntPtr.Zero);
        return false;
```

**依据 4 · 源码核查**：[lib/handover.ps1:369-432](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/handover.ps1#L369-L432)

剪贴板/焦点/拒绝未回读。

<details>
<summary>查看原文（64行）</summary>

```text
    $record = [ordered]@{ attempt = $i; method = 'clipboard'; actual = $null; matched = $false; error = $null }
    try {
      # Clipboard, not typed characters. Measured on this machine: typing the path made
      # the IME turn separators into full-width punctuation and candidate words, and the
      # box kept appending because select-all never landed. A paste carries the exact
      # bytes and does not go through the IME at all. (The garbled read-back sample is
      # kept in README.md - it cannot live here, this file must stay ASCII-only.)
      Set-Clipboard -Value $FillText
      [void][HandoverWin32]::SetForegroundWindow($dialogHwnd)
      Start-Sleep -Milliseconds 300
      [System.Windows.Forms.SendKeys]::SendWait('^a')
      Start-Sleep -Milliseconds 200
      # Clear the field no matter what select-all did, then paste over it.
      [System.Windows.Forms.SendKeys]::SendWait('{END}')
      for ($k = 0; $k -lt 80; $k++) { [System.Windows.Forms.SendKeys]::SendWait('{BACKSPACE}') }
      Start-Sleep -Milliseconds 150
      [System.Windows.Forms.SendKeys]::SendWait('^v')
      Start-Sleep -Milliseconds 500
      $readBack = $null
      foreach ($c in $uiaCandidates) {
        $value = Get-ElementValue $c
        if ($null -ne $value -and "$value" -ne '') { $readBack = $value; break }
      }
      if ($null -eq $readBack) {
        $record.actual = '(unreadable)'
        $record.error = 'readback-unavailable'
        $filled = $true
        $fillVerified = $false
        $result.fillMethod = 'clipboard-unverified'
      } else {
        $record.actual = $readBack
        $lastActual = $readBack
        $record.matched = (Test-Filled "$readBack")
        if ($record.matched) { $filled = $true; $fillVerified = $true; $result.fillMethod = 'clipboard' }
      }
    } catch {
      $record.error = $_.Exception.Message
      $lastError = $record.error
    }
    [void]$attempts.Add($record)
    if ($filled) { break }
  }

  $result.fillVerified = $fillVerified
  $result.attempts = @($attempts)
  if (-not $filled) {
    $detail = if ($null -ne $lastActual) { "last read back: '$lastActual'" } else { "last error: '$lastError'" }
    $result.error = "value-mismatch ($detail)"
    $result.seen = @($seen)
    $result | ConvertTo-Json -Compress -Depth 8
    exit 1
  }

  # ---- 2z. Unverified fill is NOT success -------------------------------------------
  # The clipboard pass cannot always read the box back. Older builds treated that as
  # "filled" and clicked Open anyway -- measured 2026-10-17: the paste had landed in the
  # address bar, the dialog closed, and the page got no file while the tool reported
  # success. A write we cannot read back must fail loudly and leave the dialog open so a
  # human can see what happened.
  if (-not $fillVerified) {
    $result.error = 'fill-unverified (the path was written but could not be read back, so it was NOT confirmed)'
    $result.seen = @($seen)
    $result | ConvertTo-Json -Compress -Depth 8
    exit 1
```

</details>

**依据 5 · 源码核查**：[lib/handover.ps1:435-454](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/handover.ps1#L435-L454)

确认无应用回执。

<details>
<summary>查看原文（20行）</summary>

```text
  # ---- 3. Confirm -----------------------------------------------------------------
  if ($shouldConfirm) {
    $clicked = [HandoverWin32]::ClickButtonById($dialogHwnd, [int]$ConfirmAutomationId)
    if ($clicked) {
      $result.confirmed = $true
    } else {
      # No Win32 button: try the UI Automation invoke pattern.
      $confirmCond = [System.Windows.Automation.PropertyCondition]::new($AE::AutomationIdProperty, $ConfirmAutomationId)
      $button = $dialogElement.FindFirst($tree::Descendants, $confirmCond)
      if ($null -eq $button) { throw "confirm-not-found (id=$ConfirmAutomationId)" }
      $invoke = $null
      if (-not $button.TryGetCurrentPattern([System.Windows.Automation.InvokePattern]::Pattern, [ref]$invoke)) {
        throw "confirm-not-invokable (type=$($button.Current.ControlType.ProgrammaticName))"
      }
      ([System.Windows.Automation.InvokePattern]$invoke).Invoke()
      $result.confirmed = $true
    }
  }

  $result.ok = $true
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 限时、取消与维护成本有哪些证据？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

plan/编排/PS动作分离，失败含候选窗口和每次actual，未回读不确认，宿主返回避开undefined不合法输出，这些可帮助恢复。package test指向test/smoke.mjs，但固定Git树未含test目录/该文件，不能采信存在可运行测试。本次不执行任何目标代码；无现成测试原文可支撑Windows多框行为。

Node给子进程timeout=(timeoutSec+20)s，宿主工具固定180秒，但execute没有接受/传播调用abort signal；宿主取消不等PS动作立即停止，timeoutSec/maxAttempts只有正数/整数下限无业务上限，等待加多方法重试也可能超Node硬限。stdout/stderr无专门大小限额。首次需打开正确应用和桌面权限、辨识框结构，持续无插件LLM调用但GUI占用焦点/剪贴板会打断人工操作；失败恢复先查看现场与应用附件清单，不能盲重试一次可能已确认的动作。耗时/成功率/少人工收益无同任务量化。

#### 证据与依据

**依据 1 · 源码核查**：[lib/handover.js:42-60](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/handover.js#L42-L60)

收集和spawn timeout。

<details>
<summary>查看原文（19行）</summary>

```text
function spawnAndCollect(spawnImpl, command, args, timeoutMs) {
  return new Promise((resolve) => {
    let child;
    try {
      child = spawnImpl(command, args, { windowsHide: true, timeout: timeoutMs });
    } catch (err) {
      resolve({ code: -1, stdout: '', stderr: err instanceof Error ? err.message : String(err) });
      return;
    }
    let stdout = '';
    let stderr = '';
    child.stdout?.on?.('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr?.on?.('data', (chunk) => { stderr += chunk.toString(); });
    child.on?.('error', (err) => {
      resolve({ code: -1, stdout, stderr: `${stderr}${err instanceof Error ? err.message : String(err)}` });
    });
    child.on?.('close', (code) => {
      resolve({ code: typeof code === 'number' ? code : -1, stdout, stderr });
    });
```

</details>

**依据 2 · 源码核查**：[lib/handover.js:85-103](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/handover.js#L85-L103)

硬限与记录。

<details>
<summary>查看原文（19行）</summary>

```text
  // 脚本自己按秒轮询等对话框；这里只做"比它更宽"的硬上限，防止它卡死。
  const spawnResult = await spawnAndCollect(
    deps.spawnImpl ?? nodeSpawn,
    command,
    args,
    (timeoutSec + 20) * 1000,
  );

  const parsed = parseHandoverResult(spawnResult.stdout);
  const result = parsed === null ? null : { ...parsed, fileSize: fileCheck.size, files: fileCheck.files };
  return {
    ok: spawnResult.code === 0 && result?.ok === true,
    stage: 'run',
    result,
    code: spawnResult.code,
    stdout: spawnResult.stdout,
    stderr: spawnResult.stderr,
    command: [command, ...args].join(' '),
    errors: [],
```

</details>

**依据 3 · 源码核查**：[lib/index.js:35-36](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/index.js#L35-L36)

宿主固定限时。

```text
const SECTION_ORDER = 208;
const TOOL_TIMEOUT_MS = 180000;
```

**依据 4 · 源码核查**：[lib/index.js:110-130](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/index.js#L110-L130)

执行未接signal。

<details>
<summary>查看原文（21行）</summary>

```text
      async execute(args) {
        const a = args ?? {};
        try {
          const data = await runHandover({
            path: a.path,
            paths: Array.isArray(a.paths) ? a.paths : undefined,
            timeoutSec: a.timeoutSec ?? cfg.timeoutSec,
            dryRun: a.dryRun === true,
            expectTitle: a.expectTitle ?? cfg.expectTitle,
            dialogAutomationId: a.dialogAutomationId ?? cfg.dialogAutomationId,
            confirmAutomationId: a.confirmAutomationId ?? cfg.confirmAutomationId,
            maxAttempts: a.maxAttempts ?? cfg.maxAttempts,
            click: a.click !== false,
          });
          // **不能**写 `error: undefined`：宿主用 lossless-JSON 校验返回对象，
          // JSON.stringify 会悄悄丢掉 undefined，校验器不会 —— 会被判 "invalid output"。
          const out = { ok: data.ok === true, data };
          if (out.ok !== true) out.error = String((data.errors ?? [])[0] ?? data.result?.error ?? '未完成');
          return out;
        } catch (err) {
          return { ok: false, error: err instanceof Error ? err.message : String(err) };
```

</details>

**依据 5 · 源码核查**：[package.json:40-44](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/package.json#L40-L44)

test入口。

```text
  },
  "scripts": {
    "test": "node test/smoke.mjs"
  },
  "publishConfig": {
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 适合如何采用，进一步研究什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先观察，具体限制是默认目标不唯一、回读子串判断、全局输入fallback和缺应用接收收据。可信Windows单一可见打开框、可丢弃文件可作对照，先probe并核标题/PID，再用click=false人工确认更稳妥；这仍不是跨两次调用的身份绑定。重要文件、发布/付款等不可逆后续、多个相同框或有人同时操作桌面，不宜直接自动确认。失败先查应用是否已收到，保留stdout/候选记录再决定补救。

继续可研究必须PID+HWND+owner的目标租约，dryRun签发短期token正式动作重核身份，多候选失败关闭；路径回读解析精确有序/无序集合、拒额外项，恢复剪贴板并限制全局键盘fallback，确认后读窗口与应用附件收据。基线为首结构匹配/子串/发确认，反例含双同标题框、probe后换框、前缀文件名/额外路径、焦点被抢、取消和消息发出后超时。比较误投、重复确认、错删输入及恢复工时，当前未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/handover.ps1:66-73](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/handover.ps1#L66-L73)

回读基线。

```text
# Read-back check: exact match for one path; for several, every path must appear.
function Test-Filled([string]$actual) {
  if ($null -eq $actual) { return $false }
  if ($actual -eq $FillText) { return $true }
  foreach ($p in $allPaths) {
    if ($actual.IndexOf($p, [System.StringComparison]::OrdinalIgnoreCase) -lt 0) { return $false }
  }
  return $true
```

**依据 2 · 源码核查**：[lib/handover.ps1:250-281](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/handover.ps1#L250-L281)

目标基线。

<details>
<summary>查看原文（32行）</summary>

```text
  while ((Get-Date) -lt $deadline) {
    foreach ($h in [HandoverWin32]::TopLevelByClass('#32770')) {
      $el = $AE::FromHandle($h)
      if ($null -eq $el) { continue }
      $title = $el.Current.Name
      if ($ExpectTitle -ne '' -and $title -notlike "$ExpectTitle*") { continue }
      $hasInput = $false
      try { $hasInput = ($null -ne $el.FindFirst($tree::Descendants, $inputCond)) } catch { $hasInput = $false }
      $entry = [ordered]@{ hwnd = [int64]$h; pid = $el.Current.ProcessId; title = $title; hasFileInput = $hasInput }
      $exists = $false
      foreach ($s in $seen) { if ([int64]$s.hwnd -eq [int64]$h) { $exists = $true; break } }
      if (-not $exists) { [void]$seen.Add($entry) }
      if ($hasInput) { $dialogElement = $el; $dialogHwnd = $h; break }
    }
    if ($null -ne $dialogElement) { break }
    Start-Sleep -Milliseconds 300
  }

  $result.seen = @($seen)
  if ($null -eq $dialogElement) {
    throw "dialog-not-found within ${TimeoutSec}s (saw $($seen.Count) candidate window(s))"
  }
  $result.dialog = [ordered]@{
    hwnd = [int64]$dialogHwnd
    pid = $dialogElement.Current.ProcessId
    title = $dialogElement.Current.Name
  }

  if ($DryRun) {
    $result.ok = $true
    $result | ConvertTo-Json -Compress -Depth 8
    exit 0
```

</details>

**依据 3 · 源码核查**：[lib/handover.ps1:369-454](https://github.com/7gzgn/dsh-file-handover/blob/e1c6158dbd4a4ec5c3057305d7d9c445edb9799f/lib/handover.ps1#L369-L454)

输入和确认基线。

<details>
<summary>查看原文（86行）</summary>

```text
    $record = [ordered]@{ attempt = $i; method = 'clipboard'; actual = $null; matched = $false; error = $null }
    try {
      # Clipboard, not typed characters. Measured on this machine: typing the path made
      # the IME turn separators into full-width punctuation and candidate words, and the
      # box kept appending because select-all never landed. A paste carries the exact
      # bytes and does not go through the IME at all. (The garbled read-back sample is
      # kept in README.md - it cannot live here, this file must stay ASCII-only.)
      Set-Clipboard -Value $FillText
      [void][HandoverWin32]::SetForegroundWindow($dialogHwnd)
      Start-Sleep -Milliseconds 300
      [System.Windows.Forms.SendKeys]::SendWait('^a')
      Start-Sleep -Milliseconds 200
      # Clear the field no matter what select-all did, then paste over it.
      [System.Windows.Forms.SendKeys]::SendWait('{END}')
      for ($k = 0; $k -lt 80; $k++) { [System.Windows.Forms.SendKeys]::SendWait('{BACKSPACE}') }
      Start-Sleep -Milliseconds 150
      [System.Windows.Forms.SendKeys]::SendWait('^v')
      Start-Sleep -Milliseconds 500
      $readBack = $null
      foreach ($c in $uiaCandidates) {
        $value = Get-ElementValue $c
        if ($null -ne $value -and "$value" -ne '') { $readBack = $value; break }
      }
      if ($null -eq $readBack) {
        $record.actual = '(unreadable)'
        $record.error = 'readback-unavailable'
        $filled = $true
        $fillVerified = $false
        $result.fillMethod = 'clipboard-unverified'
      } else {
        $record.actual = $readBack
        $lastActual = $readBack
        $record.matched = (Test-Filled "$readBack")
        if ($record.matched) { $filled = $true; $fillVerified = $true; $result.fillMethod = 'clipboard' }
      }
    } catch {
      $record.error = $_.Exception.Message
      $lastError = $record.error
    }
    [void]$attempts.Add($record)
    if ($filled) { break }
  }

  $result.fillVerified = $fillVerified
  $result.attempts = @($attempts)
  if (-not $filled) {
    $detail = if ($null -ne $lastActual) { "last read back: '$lastActual'" } else { "last error: '$lastError'" }
    $result.error = "value-mismatch ($detail)"
    $result.seen = @($seen)
    $result | ConvertTo-Json -Compress -Depth 8
    exit 1
  }

  # ---- 2z. Unverified fill is NOT success -------------------------------------------
  # The clipboard pass cannot always read the box back. Older builds treated that as
  # "filled" and clicked Open anyway -- measured 2026-10-17: the paste had landed in the
  # address bar, the dialog closed, and the page got no file while the tool reported
  # success. A write we cannot read back must fail loudly and leave the dialog open so a
  # human can see what happened.
  if (-not $fillVerified) {
    $result.error = 'fill-unverified (the path was written but could not be read back, so it was NOT confirmed)'
    $result.seen = @($seen)
    $result | ConvertTo-Json -Compress -Depth 8
    exit 1
  }

  # ---- 3. Confirm -----------------------------------------------------------------
  if ($shouldConfirm) {
    $clicked = [HandoverWin32]::ClickButtonById($dialogHwnd, [int]$ConfirmAutomationId)
    if ($clicked) {
      $result.confirmed = $true
    } else {
      # No Win32 button: try the UI Automation invoke pattern.
      $confirmCond = [System.Windows.Automation.PropertyCondition]::new($AE::AutomationIdProperty, $ConfirmAutomationId)
      $button = $dialogElement.FindFirst($tree::Descendants, $confirmCond)
      if ($null -eq $button) { throw "confirm-not-found (id=$ConfirmAutomationId)" }
      $invoke = $null
      if (-not $button.TryGetCurrentPattern([System.Windows.Automation.InvokePattern]::Pattern, [ref]$invoke)) {
        throw "confirm-not-invokable (type=$($button.Current.ControlType.ProgrammaticName))"
      }
      ([System.Windows.Automation.InvokePattern]$invoke).Invoke()
      $result.confirmed = $true
    }
  }

  $result.ok = $true
```

</details>

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
