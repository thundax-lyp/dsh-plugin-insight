# dsh-gui-guard

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[dd118db](https://github.com/7gzgn/dsh-gui-guard/tree/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：为 Windows 窗口提供状态检查、前台准备及带坐标口径的点击与输入工具。

> **核心亮点**：把窗口探测、还原、坐标口径换算和输入前激活集中在一个工具，并回显请求与应用坐标；减少调用方分别处理 Windows 状态的步骤。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：Ensure-Foreground 的 isForeground 没有成为 click/type 的执行门槛，ok 与 cursorMatches 也不能证明事件进了目标窗口；失败时仍发全局事件是源码可见的误操作风险。详见[Q03](#research-q03)。

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
  - [Q01 · 谁在何场景使用，合格结果是什么？](#detail-section-11)
  - [Q02 · 五种动作及坐标处理如何实现？](#detail-section-12)
  - [Q03 · 前台保障和 click 成功信号是否足以证明点对窗口？](#detail-section-13)
  - [Q04 · 启动、持续操作及失败恢复的成本和效果证据是什么？](#detail-section-14)
  - [Q05 · 值得借鉴什么，如何验证改进与采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用 DSH 在 Windows 桌面根据截图/OCR 坐标点击或输入的个人用户。

原始 Windows 自动化需要调用方自行核最小化、前台与 DPI，再发全局鼠标/键盘事件；本包封装步骤并回显操作口径。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| list/probe | 查窗口与前台/DPI 状态 | 有标题主窗口，重名需用 PID |
| prepare | 还原、前台与可选尺寸 | SetForegroundWindow 结果需复核 |
| click | 物理/逻辑坐标换算和鼠标事件 | 不校验前台成功或控件命中 |
| type | 激活后 SendKeys 输入 | 无焦点硬门控，特殊字符遵循 SendKeys 语法 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Windows user32 | 必需 | 枚举、前台、DPI 与输入 | 非 Windows 无核心功能 |
| pwsh 或 powershell.exe | 必需 | 每次动作执行脚本 | 无命令或超时则报错 |
| DSH tools 服务 | 实际工具暴露必需 | 注册 gui_guard | 动态 import 降级不等于工具可用 |
| systemPrompt 服务 | 可选 | 提醒 Agent 用法 | 缺失时跳过公告 |
| 已知窗口和坐标 | click/type 条件 | 定位目标与落点 | 不提供 OCR/元素识别 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 安装并核环境 | 用户核 Windows、PowerShell 与 tools 服务 | gui_guard 可注册，失败不操作桌面 |
| 查目标 | Agent list/probe，以 PID 优先 | 目标窗口、DPI、前台状态明确 |
| 操作 | 用户/Agent 确认坐标口径后 prepare/click/type | 额外核目标实际响应，不只看 ok |
| 退出 | 用户停用/移除并重启宿主 | 工具注册消失，未做本轮验收 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 现金未知；Windows 与 PowerShell 资源 | 核宿主版本、窗口定位和坐标口径 | 安装/权限验收未做 |
| 持续使用 | 每次 PowerShell 进程与固定 sleep | 核实前台、点位和实际响应 | 延迟、误点率未独立测 |
| 失败恢复 | 目标应用撤销或重做成本未知 | 人工查错误窗口与输入副作用 | 未见可回滚机制 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 窗口状态与 DPI 回显 | PowerShell 从 Win32 API 读取并输出字段 | 多显示器和不同 DPI 感知级别的正确性 |
| 坐标点击与输入 | 有鼠标/SendKeys 路径，作者报告可靠性目的 | 目标控件是否收到事件、首字符是否完整 |
| 失败边界 | 找不到窗口返回错误、execFile 有超时 | 前台被拒绝时误操作率与恢复成本 |

> **思考**：Ensure-Foreground 的 isForeground 没有成为 click/type 的执行门槛，ok 与 cursorMatches 也不能证明事件进了目标窗口；失败时仍发全局事件是源码可见的误操作风险。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把窗口探测、还原、坐标口径换算和输入前激活集中在一个工具，并回显请求与应用坐标；减少调用方分别处理 Windows 状态的步骤。详见[Q01](#research-q01)、[Q02](#research-q02)。

把窗口探测、还原、坐标口径换算和输入前激活集中在一个工具，并回显请求与应用坐标；减少调用方分别处理 Windows 状态的步骤。详见[Q01](#research-q01)、[Q02](#research-q02)。

base64 JSON 配合 execFile 避免把模型输入拼接到 shell；动作结果保留原始 JSON 和可读文本。窗口匹配可用 PID，但模糊标题首匹配和前台失败不门控是主要边界。cursorMatches 只证明光标大致到点，不证明事件命中目标。

<a id="detail-section-5"></a>

### 1.4 主要限制

Ensure-Foreground 的 isForeground 没有成为 click/type 的执行门槛，ok 与 cursorMatches 也不能证明事件进了目标窗口；失败时仍发全局事件是源码可见的误操作风险。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

真实业务桌面当前建议观察；隔离试用先以 PID 定位和 probe 核查，若 isForeground=false、点位越界或光标不匹配就停止人工接管。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

五动作源码可核查；前台失败后仍可能发送全局事件，真实误点与性能未在本轮验证；前台门控是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/win32.ps1、test/smoke.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取固定提交 README、package、Node 入口、PowerShell 后端和真实点击测试脚本；未执行任何目标代码或操作 Windows 窗口。
- 下一步：在隔离 Windows 桌面构造前台切换失败、重名窗口、窗外坐标、跨屏 DPI 和正常输入，测目标事件落点、误拒、延迟与退出状态。

**分析版本**

- **仓库**：[7gzgn/dsh-gui-guard](https://github.com/7gzgn/dsh-gui-guard)
- **版本号**：0.1.1（[固定提交 dd118db](https://github.com/7gzgn/dsh-gui-guard/tree/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可在全局事件发送前加入前台与点位范围门控，并以拒绝前台、重名窗口及跨屏 DPI 输入对照误点和误拒；尚未实现。详见[Q05](#research-q05)。

在隔离 Windows 桌面构造前台切换失败、重名窗口、窗外坐标、跨屏 DPI 和正常输入，测目标事件落点、误拒、延迟与退出状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 304 | 245 | 41 | — |
| .md | source | 1 | 116 | — | — | 1328 |
| .mjs | test | 1 | 112 | 92 | 8 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-gui-guard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-gui-guard/issues?q=is%3Aissue+created%3A2026-09-22T05%3A11%3A08.599Z..2026-10-22T05%3A11%3A08.599Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-gui-guard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A11%3A08.599Z..2026-10-22T05%3A11%3A08.599Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断固定提交的 Windows GUI 操作层是否能减少坐标点击与输入事故，识别不能保证安全的情况和采用成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何场景使用，合格结果是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本插件面向用 DSH Agent 操作 Windows 桌面、已经从截图或 OCR 得到屏幕坐标的人。原办法是让 Agent 直接点击、另行还原窗口、切前台和手工处理 DPI；作者报告这些步骤不一致会造成落空或输入首字符丢失。插件用一个 gui_guard 工具给出 list、probe、prepare、click、type 五种动作。合格结果应是定位到明确目标窗口、确认前台、按声明的坐标口径点击正确控件或完整输入文本，并且错误时不误操作其它窗口。

它没有 OCR、控件识别或对目标坐标语义的检查。README 说可与另一个 computer-use 插件分工，由后者找坐标，本包负责落点与状态观察。因此增量是把几个 Windows 操作前置检查及转换集中在同一调用，不是新的视觉定位能力，也不保证目标控件响应。自绘 UI 只能按坐标操作，无法借本包确认控件身份。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-42](https://github.com/7gzgn/dsh-gui-guard/blob/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd/README.md#L1-L42)

作者陈述四类失败场景与五种动作，事故未获独立复现。

<details>
<summary>查看原文（42行）</summary>

````text
# dsh-gui-guard

> 在按坐标点击、往窗口里打字**之前**，先确认这个窗口现在到底能不能操作。

给 **DSH**（DeepSeek Harness）用的 **Windows 窗口操作可靠性层**。
它把「agent 操作一个 Windows 窗口」这件事里最容易翻车的四步，收进一次原子调用。

**零依赖 · 纯本地 · 不联网**

---

## 为什么会有这个（真实事故）

起因很蠢：**一个 AI 要点一个按钮，点了十几次都没点中。**

复盘下来是**四个坑叠在一起**：

| # | 坑 | 现象 |
|---|---|---|
| 1 | **窗口被最小化了** | 按坐标点击全部落在桌面上，日志上看是"点了，没反应" |
| 2 | **窗口不在前台** | 第一次点击只用来**激活**窗口，根本不会落到控件上 |
| 3 | **系统 150% DPI 缩放** | 截图/OCR 给的是**物理像素**，`GetWindowRect` 给的是**逻辑像素** —— 两套坐标，混用必偏 |
| 4 | **输入的首字符被吞** | 「激活窗口」和「发送按键」在同一次调用里做，第一个字符必丢 |

这四个坑**跟具体应用无关**，是 Windows API 的固有性质 —— 任何人让 agent 操作 Windows 桌面，都会挨个撞一遍。

所以我把它们封成了一层：**别让使用者去记这些，工具自己处理掉。**

## 它做什么

| 动作 | 作用 |
|---|---|
| `list` | 列出所有带窗口的进程（找目标用），顺带标出哪些已最小化 |
| `probe` | **体检**：是否最小化 / 是否前台 / DPI 缩放 / 屏幕的逻辑与物理分辨率 / 该注意什么 |
| `prepare` | 把窗口**还原并置于前台**，可选同时移动位置或改尺寸 |
| `click` | **安全点击**：先还原+激活，再落点；坐标默认按**物理像素**收，内部换算成逻辑像素 |
| `type` | **安全输入**：把「激活」和「发送」分成两步，避免首字符被吞 |

## 用法

```
gui_guard({ action: "probe", window: "记事本" })
````

</details>

**依据 2 · 作者声明**：[README.md:82-103](https://github.com/7gzgn/dsh-gui-guard/blob/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd/README.md#L82-L103)

作者界定坐标口径、无 OCR/UIA 定位与协同边界。

<details>
<summary>查看原文（22行）</summary>

```text
## 局限（先说清楚）

- **仅 Windows**。底层是 `user32.dll`。
- **不提供 OCR / 元素定位**。它管的是"坐标拿到之后怎么点准"，找坐标是你的事（或另一个工具的事，比如 `dsh-computer-use-win`）。
- **自绘控件仍然控不了**。UIA 抓不到的界面，这层只能保证"点在你要的那个坐标上"，不能保证"那个坐标上真的响应"。
- **需要能 spawn `powershell.exe`**（系统自带；有 `pwsh` 会优先用）。
- 每次调用会起一个 PowerShell 进程，**单次约几百毫秒** —— 它是"点得准"，不是"点得快"。

## 和 `dsh-computer-use-win` 的关系

那个插件给的是**原始能力**（UIA 树、截图、OCR、窗口管理、键鼠）；
这个插件给的是**可靠性**（该不该点、点哪儿、坐标什么口径、点完对不对）。

两个一起用最顺：**先用 `dsh-computer-use-win` 拿到坐标，再用 `gui_guard` 落点。**

## 兼容性

- **声明范围：`>=0.2.0-rc.2 <0.3.0-0`** —— 覆盖整个 0.2 线（含 0.2.0 正式版）。
- **下限是我实际验证过的版本，上限是下一个大版本**。没验证过的大版本不声称兼容，也不拿你的环境去赌。
- **运行时还会主动降级**：拿不到 `@deepseek-ai/dsh-tools` 的 `defineTool`，就退化成恒等函数；`ctx.systemPrompt` 不存在，就跳过公告段。也就是说 —— 即使宿主 API 有出入，这个插件也**不会把你整个 DSH 拖崩**，它只会少一项能力。

## License
```

</details>

**依据 3 · 源码核查**：[lib/index.js:170-211](https://github.com/7gzgn/dsh-gui-guard/blob/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd/lib/index.js#L170-L211)

工具定义五动作及输入参数，click 的目标坐标由调用方提供。

<details>
<summary>查看原文（42行）</summary>

```text
  if (ctx.tools !== undefined && typeof ctx.tools.register === 'function') {
    disposers.push(ctx.tools.register(defineTool({
      name: 'gui_guard',
      description: [
        '在按坐标点击/打字之前，先确认「现在这个窗口能不能安全操作」，并让点击与输入自动处理还原、激活与 DPI 坐标口径。',
        "action='probe'：体检一个窗口 —— 是否最小化、是否在前台、DPI 缩放、屏幕的逻辑与物理分辨率、以及该注意什么。先 probe 再动手。",
        "action='prepare'：把窗口还原（取消最小化）并置于前台，可选同时移动/改尺寸（给 x/y/width/height）。",
        "action='click'：安全点击。会自动还原+激活窗口，再落点。坐标默认按**物理像素**（截图/OCR 给出的那种）解释，内部换算成逻辑像素；如果你的坐标本来就是逻辑像素，传 space=\"logical\"。",
        "action='type'：安全输入。会把「激活窗口」和「发送按键」分成两步，避免刚激活时第一个字符被吞。",
        "action='list'：列出当前所有带窗口的进程（找目标用）。",
        '窗口定位：给 window（标题子串，精确匹配优先）或 pid，二选一。',
        '纯本地：不联网、不上传，只操作本机窗口。',
      ].join('\n'),
      timeoutMs: 90000,
      parameters: {
        action: {
          type: 'string',
          description: "One of: probe, prepare, click, type, list. 'list' 不需要 window/pid。",
        },
        window: {
          type: 'string',
          description: '窗口标题（精确匹配优先，否则取第一个子串命中）。与 pid 二选一。',
        },
        pid: {
          type: 'number',
          description: '目标进程 pid。与 window 二选一，更精确。',
        },
        x: {
          type: 'number',
          description: 'click 用：横坐标。',
        },
        y: {
          type: 'number',
          description: 'click 用：纵坐标。',
        },
        space: {
          type: 'string',
          description: "click 用：坐标口径 —— 'physical'（默认，截图/OCR 那种）或 'logical'（GetWindowRect 那种）。",
        },
        text: {
          type: 'string',
          description: 'type 用：要发送的文本（SendKeys 语法，特殊字符需自行转义，如 {ENTER}）。',
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 五种动作及坐标处理如何实现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Node 侧用 execFile 选择 pwsh 或 powershell.exe，将 JSON payload 编成 base64 作为脚本参数，并设 45 秒单次超时。PowerShell 侧以 Get-Process 枚举有主窗口的进程，按 PID、精确标题、首个模糊标题依次找目标。probe 读取最小化、可见、前台、窗口矩形和 DPI；prepare 调 ShowWindow 与 SetForegroundWindow，可选移动尺寸。click 先把默认物理坐标除以所读窗口缩放比例，调用 Ensure-Foreground 后 SetCursorPos 与 mouse_event 下压/释放；type 先激活并等待，再调用 SendKeys。返回中同时提供请求点、换算点与光标现在位置。

这种把坐标口径与动作回显集中在工具边界的做法可迁移到其它桌面自动化；base64 JSON 减少 shell 引号问题，execFile 也避免通过 shell 拼接模型输入。工程上每个动作都启一个脚本进程，存在固定等待；批量操作资源成本不能按单次示例外推。Node 的动态 defineTool 降级仅在宿主服务缺失时保持可装载，不说明工具仍能被模型调用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:41-100](https://github.com/7gzgn/dsh-gui-guard/blob/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd/lib/index.js#L41-L100)

确认 shell 选择、base64、execFile 和超时。

<details>
<summary>查看原文（60行）</summary>

```text
/** 可选 shell：pwsh 优先（原生 UTF-8），否则退回系统 Windows PowerShell。 */
let shellPromise = null;
function pickShell() {
  if (shellPromise === null) {
    shellPromise = (async () => {
      for (const candidate of ['pwsh', 'powershell.exe']) {
        try {
          await new Promise((resolve, reject) => {
            execFile(candidate, ['-NoProfile', '-NonInteractive', '-Command', 'exit 0'],
              { timeout: 8000, windowsHide: true }, (err) => (err ? reject(err) : resolve()));
          });
          return candidate;
        } catch {
          /* 试下一个 */
        }
      }
      return 'powershell.exe';
    })();
  }
  return shellPromise;
}

/**
 * 跑一次后端动作。
 * @param {string} action list | probe | prepare | click | type
 * @param {object} payload 动作参数
 * @returns {Promise<object>} 后端返回的 JSON
 */
async function runAction(action, payload = {}) {
  const shell = await pickShell();
  const b64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');
  const args = [
    '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass',
    '-File', SCRIPT_PATH, '-Action', action, '-Payload64', b64,
  ];
  return await new Promise((resolve, reject) => {
    execFile(shell, args, {
      encoding: 'utf8',
      timeout: 45000,
      windowsHide: true,
      maxBuffer: 4 * 1024 * 1024,
    }, (err, stdout, stderr) => {
      const text = String(stdout || '').trim();
      const lastLine = text.split(/\r?\n/).filter((l) => l.trim() !== '').pop();
      if (lastLine) {
        try {
          resolve(JSON.parse(lastLine));
          return;
        } catch {
          /* 落到下面的错误分支 */
        }
      }
      if (err) {
        reject(new Error(`${err.message}${stderr ? ` | ${String(stderr).slice(0, 300)}` : ''}`));
        return;
      }
      reject(new Error(`后端没有返回可解析的 JSON：${text.slice(0, 200)}`));
    });
  });
}
```

</details>

**依据 2 · 源码核查**：[lib/win32.ps1:64-115](https://github.com/7gzgn/dsh-gui-guard/blob/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd/lib/win32.ps1#L64-L115)

确认窗口定位顺序、状态字段与前台准备函数。

<details>
<summary>查看原文（52行）</summary>

```text
function Get-Target([string]$needle, $pidValue) {
  $all = @(Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 })
  if ($pidValue) {
    return ($all | Where-Object { $_.Id -eq [int]$pidValue } | Select-Object -First 1)
  }
  if ([string]::IsNullOrWhiteSpace($needle)) { return $null }
  $exact = @($all | Where-Object { (Get-WinText $_.MainWindowHandle) -eq $needle })
  if ($exact.Count -gt 0) { return $exact[0] }
  $partial = @($all | Where-Object { (Get-WinText $_.MainWindowHandle) -like "*$needle*" })
  if ($partial.Count -gt 0) { return $partial[0] }
  return $null
}

function Get-Snapshot([IntPtr]$h) {
  $r = New-Object GG+RECT
  [void][GG]::GetWindowRect($h, [ref]$r)
  $p = New-Object GG+POINT
  [void][GG]::GetCursorPos([ref]$p)
  $dpiWin = 0
  try { $dpiWin = [GG]::GetDpiForWindow($h) } catch { $dpiWin = 0 }
  $logicalW = [GG]::GetSystemMetrics(0)
  $logicalH = [GG]::GetSystemMetrics(1)
  $scale = if ($dpiWin -gt 0) { [math]::Round($dpiWin / 96.0, 4) } else { 1.0 }
  return [ordered]@{
    hwnd       = [int64]$h
    title      = (Get-WinText $h)
    minimized  = [bool][GG]::IsIconic($h)
    visible    = [bool][GG]::IsWindowVisible($h)
    foreground = ([GG]::GetForegroundWindow() -eq $h)
    rect       = [ordered]@{ left = $r.Left; top = $r.Top; width = ($r.Right - $r.Left); height = ($r.Bottom - $r.Top) }
    cursor     = [ordered]@{ x = $p.X; y = $p.Y }
    dpi        = [ordered]@{ window = $dpiWin; scale = $scale }
    screen     = [ordered]@{
      logicalWidth   = $logicalW
      logicalHeight  = $logicalH
      physicalWidth  = [int][math]::Round($logicalW * $scale)
      physicalHeight = [int][math]::Round($logicalH * $scale)
    }
  }
}

function Ensure-Foreground([IntPtr]$h) {
  $wasForeground = ([GG]::GetForegroundWindow() -eq $h)
  $wasMinimized = [bool][GG]::IsIconic($h)
  if ($wasMinimized) { [void][GG]::ShowWindow($h, 9) }
  [void][GG]::SetWindowPos($h, [IntPtr]::Zero, 0, 0, 0, 0, 0x0003)
  [void][GG]::SetForegroundWindow($h)
  Start-Sleep -Milliseconds 450
  return [ordered]@{
    wasForeground = $wasForeground
    wasMinimized  = $wasMinimized
    isForeground  = ([GG]::GetForegroundWindow() -eq $h)
```

</details>

**依据 3 · 源码核查**：[lib/win32.ps1:191-251](https://github.com/7gzgn/dsh-gui-guard/blob/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd/lib/win32.ps1#L191-L251)

确认点击坐标换算、按键、回显与 type 路径。

<details>
<summary>查看原文（61行）</summary>

```text
    'click' {
      $t = Get-Target $a['window'] $a['pid']
      if (-not $t) { Out-Json ([ordered]@{ ok = $false; action = 'click'; error = 'window-not-found' }); break }
      $h = $t.MainWindowHandle
      $fx = [int]$a['x']
      $fy = [int]$a['y']
      # Coordinate space matters: screenshot/OCR tools report PHYSICAL pixels,
      # while SetCursorPos (called from a DPI-unaware host) speaks LOGICAL
      # pixels. Default to 'physical' because that is what those tools emit.
      $space = if ($a.ContainsKey('space')) { [string]$a['space'] } else { 'physical' }
      $scale = 1.0
      try { $d = [GG]::GetDpiForWindow($h); if ($d -gt 0) { $scale = $d / 96.0 } } catch { $scale = 1.0 }
      $lx = $fx
      $ly = $fy
      if ($space -eq 'physical' -and $scale -ne 1.0) {
        $lx = [int][math]::Round($fx / $scale)
        $ly = [int][math]::Round($fy / $scale)
      }
      $before = Ensure-Foreground $h
      [void][GG]::SetCursorPos($lx, $ly)
      Start-Sleep -Milliseconds 220
      [GG]::mouse_event(0x0002, 0, 0, 0, [UIntPtr]::Zero)
      Start-Sleep -Milliseconds 90
      [GG]::mouse_event(0x0004, 0, 0, 0, [UIntPtr]::Zero)
      Start-Sleep -Milliseconds 350
      $p = New-Object GG+POINT
      [void][GG]::GetCursorPos([ref]$p)
      Out-Json ([ordered]@{
        ok            = $true
        action        = 'click'
        window        = (Get-WinText $h)
        pid           = $t.Id
        requested     = [ordered]@{ x = $fx; y = $fy; space = $space }
        applied       = [ordered]@{ x = $lx; y = $ly; space = 'logical'; scale = $scale }
        cursorNowAt   = [ordered]@{ x = $p.X; y = $p.Y }
        cursorMatches = ([math]::Abs($p.X - $lx) -le 2 -and [math]::Abs($p.Y - $ly) -le 2)
        wasMinimized  = $before.wasMinimized
        wasForeground = $before.wasForeground
        isForeground  = $before.isForeground
        note          = $(if (-not $before.wasForeground) { 'Window was not foreground: this click first activated it. If the target control did not react, click once more at the same coordinates.' } else { '' })
      })
    }

    'type' {
      $t = Get-Target $a['window'] $a['pid']
      if (-not $t) { Out-Json ([ordered]@{ ok = $false; action = 'type'; error = 'window-not-found' }); break }
      $h = $t.MainWindowHandle
      $before = Ensure-Foreground $h
      Start-Sleep -Milliseconds 250
      Add-Type -AssemblyName System.Windows.Forms
      [System.Windows.Forms.SendKeys]::SendWait([string]$a['text'])
      Start-Sleep -Milliseconds 200
      Out-Json ([ordered]@{
        ok            = $true
        action        = 'type'
        window        = (Get-WinText $h)
        sentLength    = ([string]$a['text']).Length
        wasMinimized  = $before.wasMinimized
        wasForeground = $before.wasForeground
        isForeground  = $before.isForeground
      })
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 前台保障和 click 成功信号是否足以证明点对窗口？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不足以。Ensure-Foreground 记录 SetForegroundWindow 后的 isForeground，但 click 和 type 均没有以它为门槛。即使 Windows 拒绝前台切换，click 仍会移动全局光标并发 mouse_event，type 仍发全局 SendKeys，存在落到其它前台窗口的静态风险。返回 ok=true 是脚本走完路径，并非目标控件接收事件；cursorMatches 只比较 GetCursorPos 与设定坐标，不检查窗口焦点、命中控件或点击效果。click 在此前台不足时的 note 还建议同坐标再点一次，这不能替代目标确认。

标题模糊匹配只选第一个进程，多同名窗口可能选错；PID 方式较明确但 PID 本身可能过期。DPI 以 GetDpiForWindow/96 的单一 scale 换算，而不同屏幕、多显示器或不同感知级别下是否仍准确未在本轮核实。源码里没有点击点位于目标窗口矩形内的硬检查，因而不能把它称作安全点击保证。这些是代码路径可见的可能失效条件，本轮未运行 Windows 环境去复现。

#### 证据与依据

**依据 1 · 源码核查**：[lib/win32.ps1:105-116](https://github.com/7gzgn/dsh-gui-guard/blob/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd/lib/win32.ps1#L105-L116)

前台准备函数返回 isForeground，但只是状态。

<details>
<summary>查看原文（12行）</summary>

```text
function Ensure-Foreground([IntPtr]$h) {
  $wasForeground = ([GG]::GetForegroundWindow() -eq $h)
  $wasMinimized = [bool][GG]::IsIconic($h)
  if ($wasMinimized) { [void][GG]::ShowWindow($h, 9) }
  [void][GG]::SetWindowPos($h, [IntPtr]::Zero, 0, 0, 0, 0, 0x0003)
  [void][GG]::SetForegroundWindow($h)
  Start-Sleep -Milliseconds 450
  return [ordered]@{
    wasForeground = $wasForeground
    wasMinimized  = $wasMinimized
    isForeground  = ([GG]::GetForegroundWindow() -eq $h)
  }
```

</details>

**依据 2 · 源码核查**：[lib/win32.ps1:191-251](https://github.com/7gzgn/dsh-gui-guard/blob/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd/lib/win32.ps1#L191-L251)

click/type 无前台门控，cursorMatches 只比较光标坐标。

<details>
<summary>查看原文（61行）</summary>

```text
    'click' {
      $t = Get-Target $a['window'] $a['pid']
      if (-not $t) { Out-Json ([ordered]@{ ok = $false; action = 'click'; error = 'window-not-found' }); break }
      $h = $t.MainWindowHandle
      $fx = [int]$a['x']
      $fy = [int]$a['y']
      # Coordinate space matters: screenshot/OCR tools report PHYSICAL pixels,
      # while SetCursorPos (called from a DPI-unaware host) speaks LOGICAL
      # pixels. Default to 'physical' because that is what those tools emit.
      $space = if ($a.ContainsKey('space')) { [string]$a['space'] } else { 'physical' }
      $scale = 1.0
      try { $d = [GG]::GetDpiForWindow($h); if ($d -gt 0) { $scale = $d / 96.0 } } catch { $scale = 1.0 }
      $lx = $fx
      $ly = $fy
      if ($space -eq 'physical' -and $scale -ne 1.0) {
        $lx = [int][math]::Round($fx / $scale)
        $ly = [int][math]::Round($fy / $scale)
      }
      $before = Ensure-Foreground $h
      [void][GG]::SetCursorPos($lx, $ly)
      Start-Sleep -Milliseconds 220
      [GG]::mouse_event(0x0002, 0, 0, 0, [UIntPtr]::Zero)
      Start-Sleep -Milliseconds 90
      [GG]::mouse_event(0x0004, 0, 0, 0, [UIntPtr]::Zero)
      Start-Sleep -Milliseconds 350
      $p = New-Object GG+POINT
      [void][GG]::GetCursorPos([ref]$p)
      Out-Json ([ordered]@{
        ok            = $true
        action        = 'click'
        window        = (Get-WinText $h)
        pid           = $t.Id
        requested     = [ordered]@{ x = $fx; y = $fy; space = $space }
        applied       = [ordered]@{ x = $lx; y = $ly; space = 'logical'; scale = $scale }
        cursorNowAt   = [ordered]@{ x = $p.X; y = $p.Y }
        cursorMatches = ([math]::Abs($p.X - $lx) -le 2 -and [math]::Abs($p.Y - $ly) -le 2)
        wasMinimized  = $before.wasMinimized
        wasForeground = $before.wasForeground
        isForeground  = $before.isForeground
        note          = $(if (-not $before.wasForeground) { 'Window was not foreground: this click first activated it. If the target control did not react, click once more at the same coordinates.' } else { '' })
      })
    }

    'type' {
      $t = Get-Target $a['window'] $a['pid']
      if (-not $t) { Out-Json ([ordered]@{ ok = $false; action = 'type'; error = 'window-not-found' }); break }
      $h = $t.MainWindowHandle
      $before = Ensure-Foreground $h
      Start-Sleep -Milliseconds 250
      Add-Type -AssemblyName System.Windows.Forms
      [System.Windows.Forms.SendKeys]::SendWait([string]$a['text'])
      Start-Sleep -Milliseconds 200
      Out-Json ([ordered]@{
        ok            = $true
        action        = 'type'
        window        = (Get-WinText $h)
        sentLength    = ([string]$a['text']).Length
        wasMinimized  = $before.wasMinimized
        wasForeground = $before.wasForeground
        isForeground  = $before.isForeground
      })
```

</details>

**依据 3 · 源码核查**：[lib/win32.ps1:64-74](https://github.com/7gzgn/dsh-gui-guard/blob/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd/lib/win32.ps1#L64-L74)

标题子串匹配选第一个进程，没有歧义拒绝。

<details>
<summary>查看原文（11行）</summary>

```text
function Get-Target([string]$needle, $pidValue) {
  $all = @(Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 })
  if ($pidValue) {
    return ($all | Where-Object { $_.Id -eq [int]$pidValue } | Select-Object -First 1)
  }
  if ([string]::IsNullOrWhiteSpace($needle)) { return $null }
  $exact = @($all | Where-Object { (Get-WinText $_.MainWindowHandle) -eq $needle })
  if ($exact.Count -gt 0) { return $exact[0] }
  $partial = @($all | Where-Object { (Get-WinText $_.MainWindowHandle) -like "*$needle*" })
  if ($partial.Count -gt 0) { return $partial[0] }
  return $null
```

</details>

#### 缺口

- 缺少 Windows 前台切换被拒绝、多显示器 DPI 与标题重名的执行结果。
  **影响**：不能量化误点概率，也不能把静态风险写成已发生故障。
  **进一步探讨**：在隔离桌面模拟前台拒绝、同名窗口、跨屏 DPI 和窗外坐标，记录实际事件落点与返回字段。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、持续操作及失败恢复的成本和效果证据是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

运行依赖 Windows user32、可启动的 pwsh 或 powershell.exe、宿主 tools 服务；systemPrompt 只提供可选公告。脚本调用进程枚举、全局前台/光标/按键 API，具有改变用户当前桌面状态的副作用。包清单宣称 Node >=18 和 DSH 0.2 RC 兼容，未在本轮宿主安装核查。首次需确认 Windows 权限、目标窗口定位、坐标来自物理还是逻辑像素；持续每次启进程并有数段固定 sleep，人工还须检查目标实际反应。若误操作发生，恢复成本取决于目标应用，无法从源码定量。

作者说单次约几百毫秒，但仅 click 的固定等待就有激活 450ms、光标 220ms、按下到抬起 90ms、结束 350ms，加上进程启动；说明该数字不可不加条件地引用。测试脚本会真的对 DSH 主窗口标题栏执行两次 click，不能在本轮无授权运行；它只检查返回和光标位置，不验证目标控件收到事件。没有同任务对照、误点率、输入完整率或恢复耗时。现金费用没有证据，需与本地计算资源及人工时间分开记录。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-55](https://github.com/7gzgn/dsh-gui-guard/blob/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd/package.json#L1-L55)

包清单声明平台关联依赖与兼容范围。

<details>
<summary>查看原文（55行）</summary>

```text
{
  "name": "dsh-gui-guard",
  "version": "0.1.1",
  "description": "Windows GUI automation reliability layer: probe whether a window is minimized, foreground or DPI-scaled, then click and type with the coordinate space and activation order handled for you. Zero dependencies, local only.",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./win32": "./lib/win32.ps1",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md",
    "LICENSE"
  ],
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "windows",
    "gui-automation",
    "computer-use",
    "dpi-scaling",
    "coordinates",
    "click",
    "sendkeys",
    "reliability",
    "窗口",
    "自动化",
    "坐标"
  ],
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "test": "node test/smoke.mjs"
  },
  "publishConfig": {
    "access": "public"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/7gzgn/dsh-gui-guard.git"
  },
  "homepage": "https://github.com/7gzgn/dsh-gui-guard#readme",
  "bugs": {
    "url": "https://github.com/7gzgn/dsh-gui-guard/issues"
  },
  "dsh": {
    "compatibility": {
      "dshReleases": {
        "0.2.0-rc.2": "compatible",
```

</details>

**依据 2 · 源码核查**：[lib/index.js:69-100](https://github.com/7gzgn/dsh-gui-guard/blob/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd/lib/index.js#L69-L100)

每次动作由 execFile 启 PowerShell，设置超时。

<details>
<summary>查看原文（32行）</summary>

```text
async function runAction(action, payload = {}) {
  const shell = await pickShell();
  const b64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');
  const args = [
    '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass',
    '-File', SCRIPT_PATH, '-Action', action, '-Payload64', b64,
  ];
  return await new Promise((resolve, reject) => {
    execFile(shell, args, {
      encoding: 'utf8',
      timeout: 45000,
      windowsHide: true,
      maxBuffer: 4 * 1024 * 1024,
    }, (err, stdout, stderr) => {
      const text = String(stdout || '').trim();
      const lastLine = text.split(/\r?\n/).filter((l) => l.trim() !== '').pop();
      if (lastLine) {
        try {
          resolve(JSON.parse(lastLine));
          return;
        } catch {
          /* 落到下面的错误分支 */
        }
      }
      if (err) {
        reject(new Error(`${err.message}${stderr ? ` | ${String(stderr).slice(0, 300)}` : ''}`));
        return;
      }
      reject(new Error(`后端没有返回可解析的 JSON：${text.slice(0, 200)}`));
    });
  });
}
```

</details>

**依据 3 · 源码核查**：[lib/win32.ps1:209-250](https://github.com/7gzgn/dsh-gui-guard/blob/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd/lib/win32.ps1#L209-L250)

固定等待与全局输入副作用可见。

<details>
<summary>查看原文（42行）</summary>

```text
      $before = Ensure-Foreground $h
      [void][GG]::SetCursorPos($lx, $ly)
      Start-Sleep -Milliseconds 220
      [GG]::mouse_event(0x0002, 0, 0, 0, [UIntPtr]::Zero)
      Start-Sleep -Milliseconds 90
      [GG]::mouse_event(0x0004, 0, 0, 0, [UIntPtr]::Zero)
      Start-Sleep -Milliseconds 350
      $p = New-Object GG+POINT
      [void][GG]::GetCursorPos([ref]$p)
      Out-Json ([ordered]@{
        ok            = $true
        action        = 'click'
        window        = (Get-WinText $h)
        pid           = $t.Id
        requested     = [ordered]@{ x = $fx; y = $fy; space = $space }
        applied       = [ordered]@{ x = $lx; y = $ly; space = 'logical'; scale = $scale }
        cursorNowAt   = [ordered]@{ x = $p.X; y = $p.Y }
        cursorMatches = ([math]::Abs($p.X - $lx) -le 2 -and [math]::Abs($p.Y - $ly) -le 2)
        wasMinimized  = $before.wasMinimized
        wasForeground = $before.wasForeground
        isForeground  = $before.isForeground
        note          = $(if (-not $before.wasForeground) { 'Window was not foreground: this click first activated it. If the target control did not react, click once more at the same coordinates.' } else { '' })
      })
    }

    'type' {
      $t = Get-Target $a['window'] $a['pid']
      if (-not $t) { Out-Json ([ordered]@{ ok = $false; action = 'type'; error = 'window-not-found' }); break }
      $h = $t.MainWindowHandle
      $before = Ensure-Foreground $h
      Start-Sleep -Milliseconds 250
      Add-Type -AssemblyName System.Windows.Forms
      [System.Windows.Forms.SendKeys]::SendWait([string]$a['text'])
      Start-Sleep -Milliseconds 200
      Out-Json ([ordered]@{
        ok            = $true
        action        = 'type'
        window        = (Get-WinText $h)
        sentLength    = ([string]$a['text']).Length
        wasMinimized  = $before.wasMinimized
        wasForeground = $before.wasForeground
        isForeground  = $before.isForeground
```

</details>

**依据 4 · 源码核查**：[test/smoke.mjs:1-76](https://github.com/7gzgn/dsh-gui-guard/blob/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd/test/smoke.mjs#L1-L76)

测试含真实点击且断言主要覆盖返回、坐标与光标。

<details>
<summary>查看原文（76行）</summary>

```text
/**
 * dsh-gui-guard 自测（零依赖，`node test/smoke.mjs`）。
 *
 * 会真的做一次点击 —— 但目标是 DSH 主窗口的**标题栏空白处**，点下去只会让窗口
 * 拿到焦点，不触发任何功能。坐标是从 probe 的实时 rect 算出来的，不写死。
 */

import { runAction } from '../lib/index.js';
import * as plugin from '../lib/index.js';

let failed = 0;
function check(name, cond, extra) {
  if (cond) console.log(`  ✅ ${name}`);
  else {
    failed += 1;
    console.log(`  ❌ ${name}${extra ? ` — ${extra}` : ''}`);
  }
}

console.log('① list');
const list = await runAction('list');
check('返回窗口数组', Array.isArray(list.windows) && list.windows.length > 0, JSON.stringify(list).slice(0, 120));
check('能列出带标题的窗口', list.windows.every((w) => typeof w.title === 'string'));
const dshLike = list.windows.find((w) => /DeepSeek Harness/i.test(w.title));
check('找得到 DSH 主窗口（用作后续测试目标）', Boolean(dshLike), JSON.stringify(list.windows.map((w) => w.title)));

console.log('\n② probe：体检目标窗口');
const target = dshLike ? { pid: dshLike.pid } : { window: 'DeepSeek Harness' };
const probe = await runAction('probe', target);
check('probe 成功', probe.ok === true, JSON.stringify(probe).slice(0, 160));
check('拿到 DPI 与缩放', typeof probe.dpi?.scale === 'number' && probe.dpi.scale > 0, JSON.stringify(probe.dpi));
check('给出逻辑/物理两套分辨率', probe.screen?.logicalWidth > 0 && probe.screen?.physicalWidth > 0, JSON.stringify(probe.screen));
check(
  '物理 = 逻辑 × 缩放（口径自洽）',
  Math.abs(probe.screen.physicalWidth - probe.screen.logicalWidth * probe.dpi.scale) <= 2,
  `${probe.screen.physicalWidth} vs ${probe.screen.logicalWidth} × ${probe.dpi.scale}`,
);
check('返回 notes 数组（给模型看的提醒）', Array.isArray(probe.notes), typeof probe.notes);
check('返回窗口 rect', typeof probe.rect?.width === 'number' && probe.rect.width > 0, JSON.stringify(probe.rect));

console.log('\n③ 找不到窗口时要老实报错');
const missing = await runAction('probe', { window: 'dsh-gui-guard-no-such-window-xyz' });
check('ok=false', missing.ok === false);
check('error=window-not-found', missing.error === 'window-not-found', String(missing.error));

console.log('\n④ click：按物理坐标请求，内部换算成逻辑坐标');
if (probe.ok === true && probe.rect.width > 0) {
  const scale = probe.dpi.scale;
  // 标题栏中间偏左：rect 是逻辑像素，先换算成物理像素再请求
  const physX = Math.round((probe.rect.left + probe.rect.width * 0.5) * scale);
  const physY = Math.round((probe.rect.top + 8) * scale);
  const click = await runAction('click', { pid: probe.pid, x: physX, y: physY, space: 'physical' });
  check('click 成功', click.ok === true, JSON.stringify(click).slice(0, 160));
  check('请求口径记为 physical', click.requested?.space === 'physical', JSON.stringify(click.requested));
  check('落点口径记为 logical', click.applied?.space === 'logical', JSON.stringify(click.applied));
  check(
    '落点 = 请求 ÷ 缩放',
    Math.abs(click.applied.x - Math.round(physX / scale)) <= 2 && Math.abs(click.applied.y - Math.round(physY / scale)) <= 2,
    `请求(${physX},${physY}) → 落点(${click.applied?.x},${click.applied?.y})，缩放 ${scale}`,
  );
  check('光标确实到达了目标', click.cursorMatches === true, JSON.stringify(click.cursorNowAt));
} else {
  console.log('  ⏭ 跳过（没有可用的 probe 结果）');
}

console.log('\n⑤ space=logical 时不做换算');
if (probe.ok === true) {
  const logicalX = Math.round(probe.rect.left + probe.rect.width * 0.4);
  const logicalY = Math.round(probe.rect.top + 8);
  const click2 = await runAction('click', { pid: probe.pid, x: logicalX, y: logicalY, space: 'logical' });
  check('落点原样使用逻辑坐标', click2.applied?.x === logicalX && click2.applied?.y === logicalY,
    `请求(${logicalX},${logicalY}) → 落点(${click2.applied?.x},${click2.applied?.y})`);
}

console.log('\n⑥ type 的错误路径');
const badType = await runAction('type', { window: 'dsh-gui-guard-no-such-window-xyz', text: 'x' });
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 值得借鉴什么，如何验证改进与采用？

**研究主题**：新假设与验证、采用判断、贡献与相对优势

#### 完整回答

值得借鉴的是动作前输出状态并明确坐标口径、请求与应用点分开回显，以及用单一参数化工具容纳 probe/prepare/click/type。对真实业务桌面当前建议观察，不直接接入高影响点击或输入；原因不是功能无意义，而是前台切换失败仍发送全局事件、成功回执不代表点击目标以及本轮无宿主验收。若个人在隔离窗口试用，应优先用 PID、先 probe，核实前台及目标位置后再操作，出现 isForeground=false 或光标不匹配就停止，并保留人工接管。

可提出未实现的前台及范围门控假设：在点击/输入前必须核对目标窗口仍为前台，坐标须在同一窗口当前边界内；失败时返回结构化错误而不发全局事件。最小验证用前台拒绝、窗口被遮挡、标题重名、窗外点和 DPI 切换做对照，检查误操作次数、合法操作被误拒数与额外延迟。若门控仍让事件落到错误窗口或误拒使常规工作不可用，则假设被削弱。不能把它计入当前插件创新或提高采用成熟度。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:129-145](https://github.com/7gzgn/dsh-gui-guard/blob/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd/lib/index.js#L129-L145)

工具回显请求、应用与光标状态，但文本不证明控件响应。

<details>
<summary>查看原文（17行）</summary>

```text
    case 'click': {
      const lines = [
        `gui_guard click：已点击 ${value.window} (pid ${value.pid})`,
        `  请求坐标：(${value.requested?.x}, ${value.requested?.y}) 空间=${value.requested?.space}`,
        `  实际落点：(${value.applied?.x}, ${value.applied?.y}) 空间=logical，缩放 ${value.applied?.scale}`,
        `  光标现在：(${value.cursorNowAt?.x}, ${value.cursorNowAt?.y})${value.cursorMatches ? ' ✓ 与目标一致' : ' ⚠ 与目标不一致'}`,
        `  点击前：${value.wasMinimized ? '最小化' : '正常'}｜${value.wasForeground ? '前台' : '非前台'}`,
      ];
      if (value.note) lines.push(`  ⚠ ${value.note}`);
      return lines.join('\n');
    }
    case 'type': {
      return [
        `gui_guard type：已向 ${value.window} 发送 ${value.sentLength} 个字符`,
        `  发送前：${value.wasMinimized ? '最小化' : '正常'}｜${value.wasForeground ? '前台' : '非前台'}`,
      ].join('\n');
    }
```

</details>

**依据 2 · 源码核查**：[lib/win32.ps1:105-116](https://github.com/7gzgn/dsh-gui-guard/blob/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd/lib/win32.ps1#L105-L116)

已有 isForeground 可用于假设中的门控。

<details>
<summary>查看原文（12行）</summary>

```text
function Ensure-Foreground([IntPtr]$h) {
  $wasForeground = ([GG]::GetForegroundWindow() -eq $h)
  $wasMinimized = [bool][GG]::IsIconic($h)
  if ($wasMinimized) { [void][GG]::ShowWindow($h, 9) }
  [void][GG]::SetWindowPos($h, [IntPtr]::Zero, 0, 0, 0, 0, 0x0003)
  [void][GG]::SetForegroundWindow($h)
  Start-Sleep -Milliseconds 450
  return [ordered]@{
    wasForeground = $wasForeground
    wasMinimized  = $wasMinimized
    isForeground  = ([GG]::GetForegroundWindow() -eq $h)
  }
```

</details>

**依据 3 · 源码核查**：[lib/win32.ps1:191-232](https://github.com/7gzgn/dsh-gui-guard/blob/dd118dbc4a1839ebf2a5730eb0682a5fa1a93ffd/lib/win32.ps1#L191-L232)

现有 click 不检查前台与窗口边界，是改进比较基线。

<details>
<summary>查看原文（42行）</summary>

```text
    'click' {
      $t = Get-Target $a['window'] $a['pid']
      if (-not $t) { Out-Json ([ordered]@{ ok = $false; action = 'click'; error = 'window-not-found' }); break }
      $h = $t.MainWindowHandle
      $fx = [int]$a['x']
      $fy = [int]$a['y']
      # Coordinate space matters: screenshot/OCR tools report PHYSICAL pixels,
      # while SetCursorPos (called from a DPI-unaware host) speaks LOGICAL
      # pixels. Default to 'physical' because that is what those tools emit.
      $space = if ($a.ContainsKey('space')) { [string]$a['space'] } else { 'physical' }
      $scale = 1.0
      try { $d = [GG]::GetDpiForWindow($h); if ($d -gt 0) { $scale = $d / 96.0 } } catch { $scale = 1.0 }
      $lx = $fx
      $ly = $fy
      if ($space -eq 'physical' -and $scale -ne 1.0) {
        $lx = [int][math]::Round($fx / $scale)
        $ly = [int][math]::Round($fy / $scale)
      }
      $before = Ensure-Foreground $h
      [void][GG]::SetCursorPos($lx, $ly)
      Start-Sleep -Milliseconds 220
      [GG]::mouse_event(0x0002, 0, 0, 0, [UIntPtr]::Zero)
      Start-Sleep -Milliseconds 90
      [GG]::mouse_event(0x0004, 0, 0, 0, [UIntPtr]::Zero)
      Start-Sleep -Milliseconds 350
      $p = New-Object GG+POINT
      [void][GG]::GetCursorPos([ref]$p)
      Out-Json ([ordered]@{
        ok            = $true
        action        = 'click'
        window        = (Get-WinText $h)
        pid           = $t.Id
        requested     = [ordered]@{ x = $fx; y = $fy; space = $space }
        applied       = [ordered]@{ x = $lx; y = $ly; space = 'logical'; scale = $scale }
        cursorNowAt   = [ordered]@{ x = $p.X; y = $p.Y }
        cursorMatches = ([math]::Abs($p.X - $lx) -le 2 -and [math]::Abs($p.Y - $ly) -le 2)
        wasMinimized  = $before.wasMinimized
        wasForeground = $before.wasForeground
        isForeground  = $before.isForeground
        note          = $(if (-not $before.wasForeground) { 'Window was not foreground: this click first activated it. If the target control did not react, click once more at the same coordinates.' } else { '' })
      })
    }
```

</details>

#### 缺口

- 门控能否降低误操作且不增加不可接受的误拒或等待尚未验证。
  **影响**：设计假设不能作为当前产品能力或实测收益。
  **进一步探讨**：按故障与正常输入矩阵记录错误事件、误拒和延迟，再与现有逻辑同条件比较。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
