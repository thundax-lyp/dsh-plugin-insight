# Windows MCP 桌面集成

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[9347426](https://github.com/helloHub1212/dsh-windows-mcp/tree/9347426f35a897b5904223abb19ae9e4f30a78a6)

<!-- BEGIN META -->
[![GitHub ★ 978](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=978&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/helloHub1212/dsh-windows-mcp) [![npm 30d 752,551](https://img.shields.io/static/v1?label=npm+30d&message=752%2C551&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-windows-mcp) [![最新发布 2026-11-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-windows-mcp)
<!-- END META -->

> **功能**：通过 DSH 的 MCP 客户端接入 Windows 桌面截图、窗口观察和输入操作。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，宿主助手可在会话里逐步取得桌面工具，同时由插件维护桥和依赖。新版释放旧工具限制并把 pre-step 决策交回宿主，修正了重新启用后无法揭示和会话可能中断的路径。

> **主要限制**：[Q03](#research-q03) 显示，截图、窗口识别与输入效果分别受 DPI、UIA 和宿主条件影响。[Q04](#research-q04) 的重装保护依赖可见进程扫描，失败时仍可能开始安装。

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
  - [Q01 · 一个 Windows 桌面观察任务如何进入 DSH？](#detail-section-11)
  - [Q02 · 新版如何让允许的工具回到模型，并拦住直接调用？](#detail-section-12)
  - [Q03 · 何时能区分可截图和可控制？](#detail-section-13)
  - [Q04 · 安装、重装和版本切换怎样判断安全条件？](#detail-section-14)
  - [Q05 · 观察试用要付出什么、何时退出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要检查没有专用 API 的 Windows 应用界面的 DSH 使用者，可用公开样例核对截图、窗口标题和状态。

原办法是用户自己截图并记录窗口状态，或手工配置 Windows-MCP 进程和桥。若已有稳定 API，桌面操作的焦点和缩放条件可能增加负担。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Windows-MCP 桥 | 把桌面观察或输入接给 DSH | 依赖官方桥和本机 Windows 服务 |
| 工具开关与揭示 | 控制会话中可见能力与调用 | 依赖宿主 API，启用并非只读授权 |
| doctor | 诊断 UIA、句柄和 DPI 线索 | 单次启发式，超时可报告未测 |
| 托管安装 | 下载、激活或回滚服务版本 | 需 uv 和可写 profile，扫描可能漏检 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Windows 和带官方 MCP 客户端的 DSH | 桥接必需 | 运行桌面服务并挂载工具 | 不能完成桌面任务 |
| uv 与 Python 3.14 | 托管安装必需 | 准备版本目录 | 显示无安装工具、解释器或依赖错误 |
| PowerShell | 两类诊断使用 | 枚举进程和探测窗口 | 结果可能为空或未测 |
| 宿主限制和分派 API | 实现工具门禁必需 | 更新工具表并拦截调用 | 缺失方法时相应分支跳过 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 使用者在可复位 Windows 桌面核对桥和工具链 | 版本目录存在且桥指向正确路径 |
| 观察 | 使用者只揭示截图、窗口观察并记录画面 | 能同时得到正确图片和目标标题 |
| 恢复 | 核对状态、日志与正在运行的版本 | 如桥与版本记录不一致先退出操作 |
| 退出 | 停用桥并重启 DSH | 会话回到手工核对，确认未再调用桥 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 镜像下载和版本目录资源 | 准备宿主、uv 和独立桌面 | 下载耗时未知 |
| 持续使用 | 图像传输与模型额度 | 核对 UIA、窗口、缩放和开关 | 单次任务成本未知 |
| 失败恢复 | 保留备用版本及日志占用 | 停桥重启或重新激活，再查状态 | 回滚耗时和部分状态待测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 桌面观察 | 宿主桥可挂载 Windows-MCP 工具 | 可见窗口、截图质量与输入效果 |
| 工具范围 | 可见限制和调用拒绝分层实现 | 宿主兼容性、节省的上下文量 |
| 维护 | 可识别占用目标目录的进程和部分本地失败 | 真实误检、漏检和重装成功率 |

> **思考**：[Q03](#research-q03) 显示，截图、窗口识别与输入效果分别受 DPI、UIA 和宿主条件影响。[Q04](#research-q04) 的重装保护依赖可见进程扫描，失败时仍可能开始安装。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，宿主助手可在会话里逐步取得桌面工具，同时由插件维护桥和依赖。新版释放旧工具限制并把 pre-step 决策交回宿主，修正了重新启用后无法揭示和会话可能中断的路径。

[Q02](#research-q02) 的释放、重入标记和 next 保留能解释开关恢复及宿主步骤隔离。[Q04](#research-q04) 的进程匹配与错误分类改善待验故障定位，但路径权限和状态落盘仍值得追查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示，截图、窗口识别与输入效果分别受 DPI、UIA 和宿主条件影响。[Q04](#research-q04) 的重装保护依赖可见进程扫描，失败时仍可能开始安装。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 保留观察。只在可复位桌面验证公开窗口，并检查停用桥后不会继续调用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可追踪宿主桥、可见性与分派接线，以及诊断和升级中的失败分支。桌面级输入效果、宿主兼容与诊断阈值仍待验证。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、lib/index.js、README.zh.md、lib/desktop-probe.js、lib/dependency.js、lib/processes.js、lib/updater.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：宿主插件、官方桥声明、工具门禁、Windows 诊断、托管安装与激活的固定源码。上游工具真实实现和 Windows 操作、远端镜像和包制品未实测。
- 下一步：在无敏感信息的 Windows 测试桌面，分别记录工具列表、关闭后的分派拒绝、真实图像和窗口标题，再验证重启及回滚。以 [Q03](#research-q03) 的诊断冲突用例检查观察门槛。

**分析版本**

- **仓库**：[helloHub1212/dsh-windows-mcp](https://github.com/helloHub1212/dsh-windows-mcp)
- **版本号**：0.2.10（[固定提交 9347426](https://github.com/helloHub1212/dsh-windows-mcp/tree/9347426f35a897b5904223abb19ae9e4f30a78a6)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 提出在诊断与窗口识别冲突时，保持只观察并让操作员确认同一目标，再允许交互。用实际窗口变化、错误落点与额外步骤比较这项待验证设计。

在无敏感信息的 Windows 测试桌面，分别记录工具列表、关闭后的分派拒绝、真实图像和窗口标题，再验证重启及回滚。以 [Q03](#research-q03) 的诊断冲突用例检查观察门槛。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1096 | — | — | 12669 |
| .js | source | 10 | 5822 | 4505 | 1017 | — |
| .mjs | source | 4 | 382 | 296 | 53 | — |
| .mjs | test | 5 | 2428 | 2038 | 166 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/helloHub1212/dsh-windows-mcp/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=9&color=737b86&logo=github)](https://github.com/helloHub1212/dsh-windows-mcp/issues?q=is%3Aissue+created%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z) [![近30天关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/helloHub1212/dsh-windows-mcp/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z)



统计日期：2026-11-14。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Windows 桌面观察任务能否在 DSH 内完成，并在界面识别、工具权限和托管升级失败时可靠退出？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 一个 Windows 桌面观察任务如何进入 DSH？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

维护没有专用 API 的 Windows 应用的人，可以让 DSH 读取已打开的虚拟测试窗口标题和截图，再对照预期界面。与手动用截图和便签交接相比，插件把工具入口、依赖维护及受限揭示留在同一宿主。Bundle 插入自身和官方 MCP 客户端两行，桥默认禁用，安装后由 profile 覆盖指向具体 Windows-MCP 可执行文件。宿主的 apply 注册 doctor、设置、工具门禁与揭示，截图、点击等由官方桥通过标准输入输出交给 Python 端服务。新增便利来自宿主集成和安装维护，图像、坐标和输入效果仍由上游实现；原先若能用稳定 API 读状态，桌面桥通常会增加窗口焦点和识别约束。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:8-12](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/package.json#L8-L12)

核对宿主和浏览器入口。

```text
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
```

**依据 2 · 源码核查**：[cordis.patch.yml:43-69](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/cordis.patch.yml#L43-L69)

补丁插入宿主和默认禁用的官方桥，配置 Windows-MCP 命令及排除项。

<details>
<summary>查看原文（27行）</summary>

```text
- insert:
    - id: windows-mcp-plugin
      name: dsh-windows-mcp

    - id: windows-mcp-bridge
      name: "@deepseek-ai/dsh-mcp-client"
      # Inert until the installer points it at a real executable (see above):
      # a cold `uvx` resolve inside DSH's startup can hang the whole window.
      disabled: true
      config:
        # Namespace for every tool name: mcp__windows__Screenshot, ...
        serverName: windows
        transport: stdio
        # Only reached if someone re-enables this row without rewriting
        # `command`; harmless, because by then the toolchain is installed.
        command: uvx
        args:
          # Pinned for reproducibility. Replace with `windows-mcp` to float, or
          # with an absolute path to a fixed interpreter (`python -m windows_mcp`).
          - windows-mcp@0.8.8
          - serve
          # Curation: drop the tools DSH already covers (its own shell and file
          # tools), plus `App`, which upstream only supports reliably on an
          # English Windows install. Never list `ControlStatus` here — upstream
          # keeps it unconditionally.
          - --exclude-tools
          - App,PowerShell,FileSystem
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1295-1316](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/index.js#L1295-L1316)

宿主实际装配诊断、设置与工具控制。

<details>
<summary>查看原文（22行）</summary>

```text
export function apply(ctx) {
  try {
    const warn = makeLogger(ctx);
    computerUse.enabled = readComputerUse().enabled;
    settings = readSettings(stateDirectory);
    updater = createUpdater({
      warn,
      resolver: which,
      pinned: windowsMcpVersionPin(readText(patchPath)),
      preferredMirror: () => (settings === null ? "auto" : settings.plugin.preferredMirror),
      writeBridge: (executable) =>
        writeBridgeOverride(executable, {
          warn,
          version: selfVersion(),
          settings: settings === null ? null : bridgeSettingsOf(settings),
        }),
    });
    auditStartup(warn);
    registerDoctor(ctx, warn);
    registerStateRoute(ctx, warn);
    registerToolGate(ctx, warn);
    registerRevealTool(ctx, warn);
```

</details>

**依据 4 · 作者声明**：[README.zh.md:20-44](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/README.zh.md#L20-L44)

作者列出 Windows 工具及调度开关。

<details>
<summary>查看原文（25行）</summary>

```text
## agent 能拿到什么

装好插件且 Windows-MCP 可启动后，工具列表里会出现：

| 工具 | 作用 |
| --- | --- |
| `mcp__windows__Screenshot` | 截屏；图片会作为**真正的图片附件**进入对话 |
| `mcp__windows__Snapshot` | 抓取无障碍树（纯文本，不花图片 token） |
| `mcp__windows__DisplayInventory` | 枚举显示器及其几何信息 |
| `mcp__windows__Click` / `Move` / `Scroll` | 鼠标输入 |
| `mcp__windows__Type` / `Shortcut` | 键盘输入 |
| `mcp__windows__Wait` / `WaitFor` | 等待固定时长，或等到某个界面条件成立 |
| `mcp__windows__Scrape` | 抓取网页内容；也可从当前浏览器标签页抽取 DOM |
| `mcp__windows__MultiSelect` / `MultiEdit` | 批量选中元素 / 批量编辑 |
| `mcp__windows__Clipboard` | 读写剪贴板 |
| `mcp__windows__Process` | 枚举、启动、结束进程 |
| `mcp__windows__Notification` | 弹出 Windows 系统通知 |
| `mcp__windows__Registry` | 读写注册表 |
| `mcp__windows__ControlStatus` | 控制环状态。**无法关闭**——上游强制保留 |
| `mcp__windows__App` | 启动/切换应用。*默认排除*（上游只在英文版 Windows 上稳定支持） |
| `mcp__windows__PowerShell` / `FileSystem` | *默认排除*——DSH 已有 shell 与文件工具 |

另外本插件自带一个工具 `windows_mcp_doctor`：当 `mcp__windows__*` 工具缺失时，用它查原因。

输入框工具行里还会多出一颗 **AI 控制电脑** 胶囊（就在"访问模式"旁边）：显示当前真正注册了几个桌面工具，并在重启后记住你的选择（状态文件：`~/.dsh/dsh-windows-mcp.state.json`）。它默认是**关闭**的——全新安装不会把桌面交给 agent，直到你亲手点亮这颗胶囊。
```

</details>

#### 缺口

- 无相同桌面任务的手工与插件对照
  **影响**：无法量化交接耗时与需求强度
  **进一步探讨**：固定一个可复位窗口，逐次比较截图与可读标题是否对应

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 新版如何让允许的工具回到模型，并拦住直接调用？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

工具过滤与调用门禁独立。插件从全局工具列表取已注册名字，再在 Agent 的工具作用域限制未揭示的 Windows 工具；关闭 Computer Use 时也隐藏揭示入口。变化时先释放原限制，防止重新切换开关后旧掩码仍生效；重入标志屏蔽同步 tools/change 导致的递归。新 pre-step 在应用限制失败时仍调用宿主 next，让会话决策链继续。分派 guard 即使拿到工具名也会按开关和揭示状态拒绝调用；如果宿主缺对应 restrict 或 guard 方法，这两个处理会跳过，不能宣称任何版本的宿主都能阻断。启用开关后，揭示工具可按名称或关键词挑选目录项，默认路径可以揭示全部。它提供上下文与可见范围管理，启用后并未将所有其他输入能力变成只读。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:365-387](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/index.js#L365-L387)

限制计算只匹配已注册工具及当前揭示状态。

<details>
<summary>查看原文（23行）</summary>

```text
  /** Tools this agent must not see right now, limited to what is registered. */
  function denyFor(agent) {
    let known;
    try {
      known = serviceOf()?.schemas?.();
    } catch {
      return null;
    }
    if (!Array.isArray(known)) return null;
    const deny = [];
    for (const schema of known) {
      const name = Array.isArray(schema) ? schema[0] : schema?.name;
      if (typeof name !== "string") continue;
      if (name === REVEAL_TOOL_NAME) {
        // The entry itself is dead weight when the desktop is off or when every
        // schema is always shown.
        if (!computerUse.enabled || !lazyToolsEnabled()) deny.push(name);
        continue;
      }
      if (!isBridgedToolName(name)) continue;
      if (computerUse.enabled && isToolRevealed(agent, name)) continue;
      deny.push(name);
    }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:391-430](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/index.js#L391-L430)

释放旧限制及防递归，缺少作用域时提前返回。

<details>
<summary>查看原文（40行）</summary>

```text
  function release(agent) {
    const previous = applied.get(agent);
    if (previous === undefined) return;
    applied.delete(agent);
    try { previous.dispose(); } catch { /* the agent scope may be gone */ }
  }

  /**
   * True while this gate is itself mutating a tool layer. Registering or
   * disposing a restriction runs `ScopedLayers.effect`, which synchronously
   * emits `tools/change`; the listener below re-enters `reapply()`, which used
   * to stack one more `restrict()` per level. Every level but the outermost
   * lost its disposer (only the last handle is kept), so each orphaned deny
   * mask stayed on the agent scope forever — that is why flipping the switch
   * back on, or calling `windows_desktop`, never brought the tool back.
   */
  let applying = false;

  function applyToAgent(agent) {
    if (applying) return;
    if (agent === null || typeof agent !== "object") return;
    live.add(agent);
    applying = true;
    try {
      const scoped = agent?.ctx?.get?.("tools") ?? agent?.ctx?.tools;
      if (typeof scoped?.restrict !== "function") return;
      const deny = denyFor(agent);
      if (deny === null) return;
      const key = deny.slice().sort().join(",");
      const previous = applied.get(agent);
      if (previous !== undefined && previous.key === key) return;
      release(agent);
      if (deny.length === 0) return;
      try {
        applied.set(agent, { key, dispose: scoped.restrict({ deny }) });
      } catch (error) {
        warn(`could not restrict desktop tools: ${String(error)}`);
      }
    } finally {
      applying = false;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:466-505](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/index.js#L466-L505)

pre-step 保留宿主 continuation，分派 guard 拒绝关闭或隐藏工具。

<details>
<summary>查看原文（40行）</summary>

```text
    hook("agent/created", (payload) => { applyToAgent(payload?.agent); });
    hook("agent/disposed", (payload) => {
      release(payload?.agent);
      live.delete(payload?.agent);
    });
    // Safety net: repairs a decision the events above could not place yet.
    //
    // `agent/pre-step` is a Cordis WATERFALL, not a plain notification: the
    // host (dsh-agent-loop `preStep()`) dispatches it as
    // `waterfall("agent/pre-step", payload, () => ({ kind: "enter", messages }))`
    // and then reads `decision.kind`. A waterfall listener that does not call
    // `next()` vetoes the rest of the chain *including* that built-in, and its
    // own return value becomes the decision — so returning `undefined` here
    // makes the loop throw "Cannot read properties of undefined (reading
    // 'kind')" and kills every turn before the step even starts. Always hand
    // the chain back, whatever happened to the gate.
    hook("agent/pre-step", async (payload, next) => {
      try { applyToAgent(payload?.agent); } catch { /* a gate failure must never break the step */ }
      return typeof next === "function" ? next() : undefined;
    });
    // The bridge registers its tools after startup, so a restriction computed
    // from an empty registry has to be recomputed once they exist.
    hook("tools/change", () => { reapply(); });
  }

  if (typeof ctx?.inject !== "function") return;
  try {
    ctx.inject(["tools"], (scoped) => {
      try {
        if (scoped?.tools) toolsService = scoped.tools;
        if (typeof scoped?.tools?.guard !== "function") return;
        scoped.tools.guard((execution) => {
          const name = execution?.name;
          if (!isBridgedToolName(name)) return undefined;
          if (!computerUse.enabled) {
            return `Computer Use is switched off, so "${name}" is not available. Switch the Computer Use control back on in the composer and retry.`;
          }
          if (!isToolRevealed(execution?.agent, name)) {
            return `"${name}" is hidden to save context. Call ${REVEAL_TOOL_NAME} first (with no arguments it reveals every desktop capability), then retry.`;
          }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:580-606](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/index.js#L580-L606)

揭示工具按开关与筛选词选择可用能力。

<details>
<summary>查看原文（27行）</summary>

```text
          execute(args, exec) {
            if (!computerUse.enabled) {
              return {
                revealed: [],
                tools: [],
                note: "Computer Use is switched off, so there is nothing to reveal. Ask the user to switch the Computer Use control on in the composer first.",
              };
            }
            const catalog = desktopCatalog(scoped.tools);
            const names = Array.isArray(args?.names) ? args.names.map((value) => String(value)).filter((value) => value !== "") : [];
            const query = typeof args?.query === "string" ? args.query.trim().toLowerCase() : "";
            let picked = catalog;
            if (names.length > 0) {
              picked = catalog.filter((entry) =>
                names.some(
                  (wanted) =>
                    wanted === entry.name ||
                    `${BRIDGE_TOOL_PREFIX}${wanted}` === entry.name ||
                    (entry.name.startsWith(BRIDGE_TOOL_PREFIX) && entry.name.slice(BRIDGE_TOOL_PREFIX.length) === wanted),
                ),
              );
            } else if (query !== "") {
              picked = catalog.filter(
                (entry) => entry.name.toLowerCase().includes(query) || entry.description.toLowerCase().includes(query),
              );
            }
            const state = revealStateFor(exec?.agent);
```

</details>

#### 缺口

- 未跨宿主版本测试禁用、开关切换和直接调用
  **影响**：不能确认限制 API 的运行兼容性或上下文节省
  **进一步探讨**：同一个空白会话记录模型工具表、直接调用结果和切换后恢复，用不支持 guard 的配置作反例

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 何时能区分可截图和可控制？

**研究主题**：功能与机制、缺陷与关键质疑、新假设与验证

#### 完整回答

新版 doctor 注册的执行函数会等待桌面探测，失败则仍给出诊断报告。探测限 Windows，运行短时 PowerShell 子进程并在超时后收束。报告比较 UIA 顶层窗口数、原生窗口句柄数与主屏缩放；句柄不少于 3 且 UIA 不超过 1 时提示上游 UIA 问题，高 DPI 时提示绝对坐标可能漂移。计数模式是单次启发式，不能独立归因到某个上游缺陷，进程访问权限和桌面活动也可能改变读数。README 还把图像缩放提示与最近物理输入引发的 USER_CONTROL 列为上游行为，只有真实宿主验证能确认对应版本。可以在诊断结果与新一次窗口识别冲突时，先停在观察态，再允许用户逐步验证窗口及点击后的界面变化；若此门槛频繁误拦等价的安全任务，说明阈值仍需修改。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:821-846](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/index.js#L821-L846)

doctor 的宿主注册及真实探测调用。

<details>
<summary>查看原文（26行）</summary>

```text
        const dispose = scoped.tools.register({
          name: TOOL_NAME,
          description:
            "Diagnose the Windows-MCP bridge bundled by dsh-windows-mcp: uv/uvx availability, the ~/.windows-mcp install, the effective bridge row, which mcp__windows__* tools are registered, and a live desktop probe (UI Automation windows and display scaling). Use this when the Windows desktop tools are missing, failing, or report success while doing nothing.",
          parameters: {
            type: "object",
            properties: {},
            additionalProperties: false,
          },
          output: {
            schema: {
              type: "object",
              properties: { report: { type: "string" } },
              required: ["report"],
              additionalProperties: false,
            },
            render(_args, value) {
              const report = typeof value?.report === "string" ? value.report : JSON.stringify(value, null, 2);
              return [{ type: "text", text: report }];
            },
          },
          async execute() {
            // Bounded and read-only; the probe resolves to `{ error }` instead
            // of throwing, so the report is printed either way.
            const probe = await probeDesktop();
            return { report: buildReport(scoped.tools, probe) };
```

</details>

**依据 2 · 源码核查**：[lib/desktop-probe.js:136-171](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/desktop-probe.js#L136-L171)

平台判断、启动和超时退出。

<details>
<summary>查看原文（36行）</summary>

```text
export function probeDesktop(options = {}) {
  const timeoutMs = Number.isFinite(options.timeoutMs) && options.timeoutMs > 0 ? options.timeoutMs : PROBE_TIMEOUT_MS;
  const platform = typeof options.platform === "string" ? options.platform : process.platform;
  if (platform !== "win32") {
    return Promise.resolve({ skipped: "not a Windows host" });
  }
  const launcher = typeof options.spawn === "function" ? options.spawn : spawn;

  return new Promise((resolve) => {
    let settled = false;
    let timer = null;
    let child = null;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      if (timer !== null) clearTimeout(timer);
      resolve(value);
    };

    try {
      timer = setTimeout(() => {
        try {
          if (child !== null && typeof child.kill === "function") child.kill();
        } catch {
          /* the result is already decided */
        }
        finish({ error: `timed out after ${timeoutMs} ms` });
      }, timeoutMs);
      child = launcher(
        "powershell.exe",
        ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", PROBE_SCRIPT],
        { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] },
      );
    } catch (error) {
      finish({ error: String(error) });
      return;
```

</details>

**依据 3 · 源码核查**：[lib/desktop-probe.js:103-127](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/desktop-probe.js#L103-L127)

报告基于计数与缩放解释，包含启发式阈值。

<details>
<summary>查看原文（25行）</summary>

```text
  const uia = probe.uiaWindows;
  const handles = probe.windowHandles;
  const scale = probe.displayScale;
  const parts = [];
  parts.push(uia === null || uia === undefined ? "UI Automation unavailable" : `UI Automation sees ${uia} top-level window(s)`);
  if (handles !== null && handles !== undefined) parts.push(`${handles} window handle(s)`);
  if (scale !== null && scale !== undefined) parts.push(`display scale ${Math.round(scale * 100)}%`);

  const notes = [];
  if (
    typeof uia === "number" &&
    typeof handles === "number" &&
    handles >= 3 &&
    uia <= 1
  ) {
    notes.push(
      `UI Automation enumerates ${uia} window(s) while ${handles} window handle(s) exist. Snapshot then prints "No windows found" / "No elements" and Move/Click/Type report success without acting: this is upstream ${UPSTREAM_UIA_ISSUE}, not an install, mirror, or sandbox problem. Signing out of the Windows session (or rebooting) usually restores UI Automation; the durable fix has to land upstream.`,
    );
  }
  if (typeof scale === "number" && scale >= 1.25) {
    notes.push(
      `the primary display runs at ${Math.round(scale * 100)}% scaling. Upstream #607 divides absolute Move/Click coordinates by that factor, so requested positions land nearer the top-left than asked (1500,1100 arrives near ${Math.round(1500 / scale)},${Math.round(1100 / scale)} at this scale). Treat absolute coordinates as unreliable at non-100% scale and prefer reading positions from a Snapshot.`,
    );
  }
  return { line: parts.join(", "), notes };
```

</details>

**依据 4 · 作者声明**：[README.zh.md:236-241](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/README.zh.md#L236-L241)

作者解释缩放坐标和物理输入拦截。

```text
| `App` 工具报错或没反应 | 上游明确说它只在英文版 Windows 上可靠；本插件默认已排除。 |
| DSH 启动明显变慢 | 桥不该占用启动时间：它出厂 `disabled: true`，只有安装后把 `command` 指到可执行文件才会启动。启动变慢说明**别的**行在引导期解析工具链——看 `windows_mcp_doctor` 打印的生效行。 |
| 截图里的字看不清 | 把 `WINDOWS_MCP_SCREENSHOT_SCALE` 提到接近 `1.0`；上游截图上限是 1920×1080。 |
| 点击位置偏了，或截图比屏幕小 | 截图被缩小了。出现缩放时 `Screenshot` 会打印 `Screenshot Coordinate Scale`：把图像像素坐标乘以这个系数再交给 `Click` / `Move` / `Scroll`；也可以把 `WINDOWS_MCP_SCREENSHOT_SCALE` 设为 `1.0`（慢一些，但像素与屏幕一致）。上游的 `Click` 没有落点预演，也没有窗口/区域约束。 |
| 自己在动鼠标键盘时所有工具都报 `USER_CONTROL` | 上游把最近 10 秒内的物理输入视为你收回了控制权，会拒绝**全部**工具，包括 `Screenshot` / `Snapshot`，直到 `wait_seconds` 归零。把手离开鼠标键盘约十秒即可。 |
| 重装报 `uv exited with code 2`，之后 DSH 起不来 | 桥正从要重装的那个版本运行。Windows 锁定运行中的 `windows-mcp.exe`，就地重装会删掉环境的一部分又无法完成。安装器现在会在启动 uv 之前拒绝，并点名占用的进程；请切到另一个已安装版本（或禁用桥）、重启 DSH 后再装。目录被占用属于本机问题，不会再被报成镜像失败。 |
```

#### 缺口

- 未取得缩放与 UIA 状态下的同版本屏幕对照
  **影响**：只能分析诊断信号，无法证明屏幕输入命中
  **进一步探讨**：在受控桌面先核查标题和句柄变化，再对比启用停留观察前后的误拦与误触

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、重装和版本切换怎样判断安全条件？

**研究主题**：依赖、兼容与流程、工程质量与复用、缺陷与关键质疑

#### 完整回答

托管安装先找宿主 PATH 上的 uv，以固定版本和 Python 3.14 范围调用 tool install。新版先用 PowerShell 枚举带可执行路径的进程，路径按当前目标版本目录前缀匹配，找到活动进程便在调用 uv 前拒绝并给出 PID 和停用指引。进程扫描返回空列表、超时或失败会放过，扫描和安装之间也有时间差。uv 失败时，锁目录、构建或缺解释器一类本地错误会提前结束镜像尝试；只有读到工具版本和可执行文件才走激活。激活先写 profile 桥再写版本状态，第二次落盘失败会明确报告桥已写入，不能把失败响应理解成已自动还原。回滚选择上一个版本重新激活。prepare 路由读取同步拒绝并以 409 回传，异步进程扫描可能先收到 202，再由状态查询告警。收到请求与完成安装是两个阶段。

#### 证据与依据

**依据 1 · 源码核查**：[lib/dependency.js:241-261](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/dependency.js#L241-L261)

实际 uv 参数包含工具规格与 Python 范围。

<details>
<summary>查看原文（21行）</summary>

```text
export function spawnUvInstall(options = {}) {
  const uv = options.uv;
  const spec = options.spec;
  const indexUrl = typeof options.indexUrl === "string" && options.indexUrl !== "" ? options.indexUrl : null;
  const toolDirectory = typeof options.toolDirectory === "string" && options.toolDirectory !== "" ? options.toolDirectory : null;
  const onLine = typeof options.onLine === "function" ? options.onLine : () => {};
  const python =
    options.python === null
      ? null
      : typeof options.python === "string" && options.python !== ""
        ? options.python
        : UV_PYTHON_REQUIREMENT;
  const args = ["tool", "install", "--force"];
  if (indexUrl !== null) args.push("--default-index", indexUrl);
  if (python !== null) args.push("--python", python);
  args.push(spec);
  const child = spawn(uv, args, {
    cwd: typeof options.cwd === "string" ? options.cwd : homedir(),
    env: { ...uvInstallEnvironment(toolDirectory), ...(options.env ?? {}) },
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
```

</details>

**依据 2 · 源码核查**：[lib/processes.js:70-79](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/processes.js#L70-L79)

目标版本环境的路径匹配。

<details>
<summary>查看原文（10行）</summary>

```text
export function processesUnder(root, entries) {
  if (typeof root !== "string" || root === "" || !Array.isArray(entries)) return [];
  const wanted = comparablePath(root);
  if (wanted === "") return [];
  const prefix = wanted.endsWith("\\") ? wanted : `${wanted}\\`;
  return entries.filter((entry) => {
    if (entry === null || typeof entry !== "object" || typeof entry.path !== "string") return false;
    const actual = comparablePath(entry.path);
    return actual === wanted || actual.startsWith(prefix);
  });
```

</details>

**依据 3 · 源码核查**：[lib/processes.js:88-121](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/processes.js#L88-L121)

非 Windows、超时与启动失败时返回空数组。

<details>
<summary>查看原文（34行）</summary>

```text
export function listProcesses(options = {}) {
  const timeoutMs = Number.isFinite(options.timeoutMs) && options.timeoutMs > 0 ? options.timeoutMs : PROCESS_SCAN_TIMEOUT_MS;
  const platform = typeof options.platform === "string" ? options.platform : process.platform;
  if (platform !== "win32") return Promise.resolve([]);
  const launcher = typeof options.spawn === "function" ? options.spawn : spawn;

  return new Promise((resolve) => {
    let settled = false;
    let timer = null;
    let child = null;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      if (timer !== null) clearTimeout(timer);
      resolve(value);
    };

    try {
      timer = setTimeout(() => {
        try {
          if (child !== null && typeof child.kill === "function") child.kill();
        } catch {
          /* the result is already decided */
        }
        finish([]);
      }, timeoutMs);
      child = launcher(
        "powershell.exe",
        ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", SCAN_SCRIPT],
        { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] },
      );
    } catch {
      finish([]);
      return;
```

</details>

**依据 4 · 源码核查**：[lib/updater.js:178-204](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/updater.js#L178-L204)

进程预检及失败放行范围。

<details>
<summary>查看原文（27行）</summary>

```text
  async function preflight(version) {
    let entries = [];
    try {
      entries = await inspectProcesses();
    } catch {
      entries = [];
    }
    if (!Array.isArray(entries) || entries.length === 0) return { ok: true };
    let toolRoot;
    try {
      toolRoot = versionToolRoot(root, version);
    } catch {
      return { ok: true };
    }
    const running = processesUnder(toolRoot, entries);
    if (running.length === 0) return { ok: true };
    // Another install may have started while the scan ran; do not overwrite it.
    if (installState.phase === "installing") return { ok: false, error: "an install is already running" };
    const pids = running
      .slice(0, 3)
      .map((entry) => `PID ${entry.pid}`)
      .join(", ");
    const message =
      `Windows-MCP is running from ${toolRoot} (${pids}). Installing in place would delete that environment while it is in use and leave it unable to start. ` +
      "Switch to another installed version (or disable the bridge), restart DSH, then install this version again.";
    return refuseInstall(version, message);
  }
```

</details>

**依据 5 · 源码核查**：[lib/updater.js:442-487](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/updater.js#L442-L487)

安装状态、二次并发检查、镜像尝试边界。

<details>
<summary>查看原文（46行）</summary>

```text
  async function installVersion(version) {
    if (typeof version !== "string" || version === "") return { ok: false, error: "a version is required" };
    if (installPromise !== null) return { ok: false, error: "an install is already running" };
    const uv = resolver("uv");
    if (uv === null) {
      return refuseInstall(
        version,
        "`uv` was not found on the PATH of this DSH process. Install uv (https://docs.astral.sh/uv/), restart DSH, then retry.",
      );
    }
    const gate = await preflight(version);
    if (gate.ok !== true) return gate;
    // The scan is asynchronous, so a second click can get here too: re-check
    // before claiming the install slot.
    if (installPromise !== null) return { ok: false, error: "an install is already running" };
    installPromise = (async () => {
      installState.phase = "installing";
      installState.version = version;
      installState.mirror = null;
      installState.startedAt = new Date().toISOString();
      installState.finishedAt = null;
      installState.error = null;
      installState.bridge = null;
      installState.log = [];
      if (lastProbe === null) {
        try {
          lastProbe = await probe({ project: WINDOWS_MCP_TOOL });
        } catch {
          lastProbe = null;
        }
      }
      const order = mirrorOrder(lastProbe);
      let lastError = "no mirror was available";
      for (const mirror of order) {
        installState.mirror = mirror.id;
        append(`trying ${mirror.label} (${formatBytesPerSecond(mirrorSpeed(lastProbe, mirror.id))})`);
        const attempt = await installAttempt({ uv, version, mirror });
        if (attempt.ok !== true) {
          lastError = `${mirror.label}: ${attempt.error}`;
          append(`failed: ${lastError}`);
          if (attempt.fatal === true) {
            // A missing wheel or interpreter fails identically on every mirror;
            // walking the rest would only keep the real reason buried.
            append("this failure is not mirror-specific, so the remaining mirrors are skipped");
            break;
          }
```

</details>

**依据 6 · 源码核查**：[lib/updater.js:383-402](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/updater.js#L383-L402)

安装成功还需对比版本和可执行文件。

<details>
<summary>查看原文（20行）</summary>

```text
      running.on("close", (code) => {
        if (code !== 0) {
          const detail = installFailureDetail(attemptLines);
          finish({
            ok: false,
            error: `uv exited with code ${code}${detail.tail === null ? "" : `: ${detail.tail}`}`,
            fatal: detail.fatal,
          });
          return;
        }
        const installedVersion = toolVersionIn(toolDirectory);
        const executable = executableIn(toolDirectory);
        if (installedVersion !== version || executable === null) {
          finish({
            ok: false,
            error: `uv finished, but ${toolDirectory} does not contain windows-mcp ${version}`,
          });
          return;
        }
        finish({ ok: true, executable, toolDirectory });
```

</details>

**依据 7 · 源码核查**：[lib/updater.js:418-438](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/updater.js#L418-L438)

两处状态的写入先后与部分成功。

<details>
<summary>查看原文（21行）</summary>

```text
  function activate(version) {
    const executable = activeInstall({ active: version }, home)?.executable ?? null;
    if (executable === null) {
      return { ok: false, error: `Windows-MCP ${version} is not installed under ${root}` };
    }
    let bridge;
    try {
      bridge = writeBridge(executable);
    } catch (error) {
      bridge = { ok: false, error: String(error) };
    }
    if (bridge?.ok !== true) return { ok: false, error: bridge?.error ?? "the bridge row could not be written", bridge };
    const state = readVersionsState(home);
    const next = activateVersion(state, version);
    try {
      writeVersionsState(next, home);
    } catch (error) {
      return { ok: false, error: `the bridge was written, but the versions file could not be updated: ${String(error)}`, bridge };
    }
    installState.bridge = bridge;
    return { ok: true, version, executable, bridge };
```

</details>

**依据 8 · 源码核查**：[lib/updater.js:523-535](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/updater.js#L523-L535)

切换和回滚统一走激活。

<details>
<summary>查看原文（13行）</summary>

```text
  function activateInstalled(version) {
    if (installState.phase === "installing") return { ok: false, error: "an install is already running" };
    const activated = activate(version);
    return { ...activated, view: view() };
  }

  /** Go back to the version that the active one replaced. */
  function rollback() {
    const state = readVersionsState(home);
    if (state.previous === null) return { ok: false, error: "there is no previous version to go back to", view: view() };
    const target = state.previous;
    const activated = activate(target);
    return { ...activated, rolledBackFrom: state.active, view: view() };
```

</details>

**依据 9 · 源码核查**：[lib/dependency.js:60-96](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/dependency.js#L60-L96)

本地错误按日志识别并保留尾部原因。

<details>
<summary>查看原文（37行）</summary>

```text
const MIRROR_INDEPENDENT_FAILURES = [
  /Failed to build/iu,
  /failed building wheel/iu,
  /LINK\s*:\s*fatal error/iu,
  /Microsoft Visual C\+\+/u,
  /No interpreter found/iu,
  /no python interpreter/iu,
  // A locked file is a local problem: every mirror deletes the same directory
  // and hits the same running executable, so retrying only destroys more.
  /failed to remove directory/iu,
  /os error 5\b/iu,
  /Access is denied/iu,
  /拒绝访问/u,
  /being used by another process/iu,
  /另一个程序正在使用此文件/u,
];

/**
 * Read the reason out of a failed `uv tool install` log.
 *
 * @param lines - the streamed output lines (or one chunk).
 * @returns `{ fatal, tail }` — `fatal` when another mirror cannot help, and
 *   `tail` the last error-looking line, trimmed for the page.
 */
export function installFailureDetail(lines) {
  const text = Array.isArray(lines) ? lines.join("\n") : String(lines ?? "");
  const fatal = MIRROR_INDEPENDENT_FAILURES.some((pattern) => pattern.test(text));
  const rows = text
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line !== "");
  const tail =
    [...rows].reverse().find((line) => /^error[:\s]/iu.test(line)) ??
    [...rows].reverse().find((line) => /error|failed|cannot|no interpreter/iu.test(line)) ??
    rows[rows.length - 1] ??
    null;
  return { fatal, tail: tail === null ? null : tail.slice(0, MAX_LOG_LINE) };
```

</details>

**依据 10 · 源码核查**：[lib/index.js:1070-1098](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/index.js#L1070-L1098)

路由回传同步请求拒绝并通过状态提供异步结果。

<details>
<summary>查看原文（29行）</summary>

```text
          const view = updater.view();
          const target = view.versions.pinned ?? view.check.latest;
          if (target === null) {
            respond(response, 409, { started: false, reason: "no Windows-MCP version is known yet", prepare: prepareSnapshot() });
            return;
          }
          if (view.install.phase === "installing") {
            respond(response, 409, { started: false, reason: "an install is already running", prepare: prepareSnapshot() });
            return;
          }
          void updater
            .installVersion(target)
            .then((result) => {
              if (result === null || result === undefined || result.ok !== true) {
                warn(`the install did not start: ${result?.error ?? "unknown error"}`);
              }
            })
            .catch((error) => warn(`the install did not start: ${String(error)}`));
          // A refusal (missing `uv`, unknown version) is recorded synchronously,
          // before the promise settles, so it can be reported right here instead
          // of answering 202 and leaving the page on `phase: "idle"`.
          const after = updater.view().install;
          const refused = after.phase === "failed" && typeof after.error === "string";
          respond(response, refused ? 409 : 202, {
            started: !refused,
            reason: refused ? after.error : undefined,
            spec: `windows-mcp@${target}`,
            prepare: prepareSnapshot(),
          });
```

</details>

#### 缺口

- 未在 Windows 验证扫描并发和无进程路径的情况
  **影响**：无法断言 preflight 避免所有重装破坏
  **进一步探讨**：用空闲版本、同目录活动进程、不可读列表和写版本文件失败分别检查 install 与回滚状态

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 观察试用要付出什么、何时退出？

**研究主题**：效果与总成本、采用判断

#### 完整回答

在一次性 Windows 测试桌面上打开无敏感信息的样例窗口，以图片和一段可复核的窗口描述作为合格结果。先准备能加载官方 MCP 桥的 DSH 与可用 uv，确认实际进程指向选定版本；需要比较开关时只揭示 Screenshot 和 Snapshot，切勿根据截图成功推断 Click 正常。因启用开关后揭示可扩到其他能力，应限制在无敏感内容的桌面，通过工具表及分派拒绝同时核查开关；无法确认时停用 profile 的桥并重启恢复手工。安装消耗依赖下载与本地版本目录空间，持续截图占图片传输或模型配额，人工用于核对 DPI/UIA 与版本切换。实际下载重试、模型费用和单次任务耗时均无实测。如果工具回执未反映窗口变化、诊断看不到目标窗口或关闭后仍能调用，停止助手操作并人工核对。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:25-29](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/cordis.patch.yml#L25-L29)

安装后的 profile 覆盖过程。

```text
# The installer then writes the row again into the profile's own patch layer
# ($DSH_HOME/profiles/<profile>/cordis.patch.yml) between the
# `# >>> dsh-windows-mcp …` markers, with `disabled: false` and `command:`
# pointing at the installed executable — so later boots spawn the exe directly
# and never touch the network or `uvx`.
```

**依据 2 · 源码核查**：[lib/index.js:497-506](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/index.js#L497-L506)

关闭时工具分派应拒绝。

<details>
<summary>查看原文（10行）</summary>

```text
        scoped.tools.guard((execution) => {
          const name = execution?.name;
          if (!isBridgedToolName(name)) return undefined;
          if (!computerUse.enabled) {
            return `Computer Use is switched off, so "${name}" is not available. Switch the Computer Use control back on in the composer and retry.`;
          }
          if (!isToolRevealed(execution?.agent, name)) {
            return `"${name}" is hidden to save context. Call ${REVEAL_TOOL_NAME} first (with no arguments it reveals every desktop capability), then retry.`;
          }
          return undefined;
```

</details>

**依据 3 · 源码核查**：[lib/desktop-probe.js:111-125](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/desktop-probe.js#L111-L125)

界面和显示缩放的关键验收信号。

<details>
<summary>查看原文（15行）</summary>

```text
  const notes = [];
  if (
    typeof uia === "number" &&
    typeof handles === "number" &&
    handles >= 3 &&
    uia <= 1
  ) {
    notes.push(
      `UI Automation enumerates ${uia} window(s) while ${handles} window handle(s) exist. Snapshot then prints "No windows found" / "No elements" and Move/Click/Type report success without acting: this is upstream ${UPSTREAM_UIA_ISSUE}, not an install, mirror, or sandbox problem. Signing out of the Windows session (or rebooting) usually restores UI Automation; the durable fix has to land upstream.`,
    );
  }
  if (typeof scale === "number" && scale >= 1.25) {
    notes.push(
      `the primary display runs at ${Math.round(scale * 100)}% scaling. Upstream #607 divides absolute Move/Click coordinates by that factor, so requested positions land nearer the top-left than asked (1500,1100 arrives near ${Math.round(1500 / scale)},${Math.round(1100 / scale)} at this scale). Treat absolute coordinates as unreliable at non-100% scale and prefer reading positions from a Snapshot.`,
    );
```

</details>

**依据 4 · 源码核查**：[lib/updater.js:403-413](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/lib/updater.js#L403-L413)

单个安装尝试的超时及终止。

<details>
<summary>查看原文（11行）</summary>

```text
      });
      timer = setTimeout(() => {
        append("install timed out after 30 minutes");
        try {
          running.kill();
        } catch {
          /* already gone */
        }
        finish({ ok: false, error: "install timed out" });
      }, INSTALL_TIMEOUT_MS);
      if (typeof timer.unref === "function") timer.unref();
```

</details>

**依据 5 · 作者声明**：[README.zh.md:236-240](https://github.com/helloHub1212/dsh-windows-mcp/blob/9347426f35a897b5904223abb19ae9e4f30a78a6/README.zh.md#L236-L240)

作者列出不同观察与交互的失败边界。

```text
| `App` 工具报错或没反应 | 上游明确说它只在英文版 Windows 上可靠；本插件默认已排除。 |
| DSH 启动明显变慢 | 桥不该占用启动时间：它出厂 `disabled: true`，只有安装后把 `command` 指到可执行文件才会启动。启动变慢说明**别的**行在引导期解析工具链——看 `windows_mcp_doctor` 打印的生效行。 |
| 截图里的字看不清 | 把 `WINDOWS_MCP_SCREENSHOT_SCALE` 提到接近 `1.0`；上游截图上限是 1920×1080。 |
| 点击位置偏了，或截图比屏幕小 | 截图被缩小了。出现缩放时 `Screenshot` 会打印 `Screenshot Coordinate Scale`：把图像像素坐标乘以这个系数再交给 `Click` / `Move` / `Scroll`；也可以把 `WINDOWS_MCP_SCREENSHOT_SCALE` 设为 `1.0`（慢一些，但像素与屏幕一致）。上游的 `Click` 没有落点预演，也没有窗口/区域约束。 |
| 自己在动鼠标键盘时所有工具都报 `USER_CONTROL` | 上游把最近 10 秒内的物理输入视为你收回了控制权，会拒绝**全部**工具，包括 `Screenshot` / `Snapshot`，直到 `wait_seconds` 归零。把手离开鼠标键盘约十秒即可。 |
```

#### 缺口

- 没有相同宿主版本的真实端到端观察和退出记录
  **影响**：只支持观察结论及验收方案
  **进一步探讨**：在可复位 Windows 会话比较屏幕结果、拒绝和重启后的桥状态，记录用户时间和实际请求

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
