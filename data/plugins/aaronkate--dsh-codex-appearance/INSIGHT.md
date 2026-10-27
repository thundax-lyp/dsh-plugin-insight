# dsh-eye-comfort

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[4991952](https://github.com/AaronKate/dsh-codex-appearance/tree/4991952d6759b0a5edc6a3924ced3076bc0b5075)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：为DSH增加外观设置，调整主题、字体、字号、宽度、对比度、纸纹和动态效果。

> **亮点**：相对基础浅深主题提供分区字体/配色及本机字体选择，属于个性化集成贡献。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：部分CSS依赖构建类名，字体查询是同步子进程且来源栅栏可选；本地设置不跨设备，名称不证明护眼效果。见 [Q03](#research-q03)。

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
  - [Q01 · 外观定制相对宿主主题增加什么？](#detail-section-11)
  - [Q02 · 设置如何影响主题和字体？](#detail-section-12)
  - [Q03 · 维护、权限与资源边界是什么？](#detail-section-13)
  - [Q04 · 可检验何种设计改进，当前谁可试用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户按个人偏好调整对话阅读界面，以清晰可操作且可恢复为交付。

宿主原生主题、系统字体与浏览器缩放是低负担替代；是否值得额外CSS维护需个人实测。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 配色/字体/宽度 | 个人阅读偏好 | 本地存储，不跨设备 |
| 系统字体列表 | 选择本机字族 | Host命令与访问边界需验收 |
| 纸纹/动态控制 | 调整视觉表现 | CSS兼容和效果未测 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH theme/settings.section/Web | 界面必需 | 配置与token覆盖 | 不兼容可能局部失效 |
| webServer与系统字体命令 | 全量字体列表必需 | Host枚举字体 | 失败缓存为空/回候选 |
| connection.admit | 来源保护条件 | 字体列表访问校验 | 缺失仍服务，远程需验收 |
| 浏览器localStorage | 持久偏好必需 | 保存本机设置 | 清理或换设备需重配 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户保存原设置并装隔离环境 | 外观页与字体可用 |
| 2 | 用户检查深浅模式/代码/输入/改动卡片 | 文字与操作不受阻 |
| 3 | 用户禁用并重启核对恢复 | 无残留覆盖，否则恢复默认 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 字体枚举/渲染资源未知 | 调配色字体与检查页面 | 无视觉验收 |
| 持续使用 | 本地存储与纹理渲染 | 宿主升级CSS维护 | CPU/阅读收益未测 |
| 失败恢复 | 重启/重探字体资源未知 | 回默认、禁用、恢复本地设置 | 无跨设备同步 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 定制 | token/CSS/本地设置存在 | 当前宿主全界面覆盖 |
| 字体 | 系统枚举与缓存路径 | 首次阻塞和跨平台表现 |
| 阅读 | 提供可调参数 | 真实可读性、健康或无障碍收益 |

> **思考**：部分CSS依赖构建类名，字体查询是同步子进程且来源栅栏可选；本地设置不跨设备，名称不证明护眼效果。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对基础浅深主题提供分区字体/配色及本机字体选择，属于个性化集成贡献。见 [Q01](#research-q01)、[Q02](#research-q02)。

theme token优先并清理监听是可借鉴处；构建类名CSS与可选字体访问栅栏要显式标兼容边界。同步系统命令应关注首次宿主阻塞，缓存失败有可用性代价。

<a id="detail-section-5"></a>

### 1.4 主要限制

部分CSS依赖构建类名，字体查询是同步子进程且来源栅栏可选；本地设置不跨设备，名称不证明护眼效果。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

个人本机有限试用，保存原设置并验收各界面/禁用恢复，不将名称当健康效果。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持外观与字体配置；当前渲染、可读性和健康效果未验证；token/兼容层设计是假设。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定host/client源码与README抽查，不运行字体命令、安装、视觉测试或健康研究，不继承作者Windows验证。
- 下一步：跨宿主构建检查主题/字体/深浅模式/禁用矩阵，并测字体首次请求与样式恢复。

**分析版本**

- **仓库**：[AaronKate/dsh-codex-appearance](https://github.com/AaronKate/dsh-codex-appearance)
- **版本号**：0.3.10（[固定提交 4991952](https://github.com/AaronKate/dsh-codex-appearance/tree/4991952d6759b0a5edc6a3924ced3076bc0b5075)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证的稳定token与可关闭兼容CSS分层，可能降低宿主升级修复成本；用跨构建视觉矩阵测净收益。见 [Q04](#research-q04)。

跨宿主构建检查主题/字体/深浅模式/禁用矩阵，并测字体首次请求与样式恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 97 | — | — | 1558 |
| .js | source | 2 | 1140 | 733 | 402 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/AaronKate/dsh-codex-appearance/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：外观插件能否以可撤销的宿主扩展改善个人阅读偏好，哪些CSS/字体与存储边界影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 外观定制相对宿主主题增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是长时间阅读DSH对话、希望调整颜色、字体、字号和内容宽度的用户。合格结果是文字、代码、输入与改动卡片均清晰可操作，禁用后回到原主题；主观喜欢一种暖色不是客观健康效果。相对宿主浅深主题，插件增加多套配色、分区字体、纸纹和对比度等细化控制，以及主机字体枚举。贡献是个性化配置和宿主覆盖集成，并非新渲染算法。README的Windows验证为作者报告，本轮没有实际视觉或读者测试，不将“护眼”名称转成医学/无障碍效果证明。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-7](https://github.com/AaronKate/dsh-codex-appearance/blob/4991952d6759b0a5edc6a3924ced3076bc0b5075/README.md#L1-L7)

作者功能与Windows验证声明

```text
# DeepSeek Harness 护眼外观插件

在设置中增加「外观」页，提供五套护眼主题（暖白、米纸、豆沙绿、雾蓝、石墨），以及跟随系统/浅色/深色模式、强调色与背景色、界面与代码的字体和字号、字体样式、内容宽度、对比度、纸张质感和减少动态效果等设置。每套主题各自带有匹配的强调色与链接色，并覆盖消息气泡、轮次预览、输入框、改动文件卡片等界面区域；深色模式保持蓝灰。字体下拉会列出本机安装的全部字族（由插件主进程读取系统字体清单，读不到时回退到内置候选探测），可分别设置界面、内容与代码字体。纸张质感在内容区、侧栏、输入框和卡片上叠一层极淡的纸纤维颗粒，强度可调；纹理自带主题底色，不改变原有色温，也不触碰原生标题栏。输入框在鼠标移入时轻微上浮、聚焦输入时落回原位。通过 Harness 的主题 token 和设置 section 扩展点工作；设置保存在当前桌面应用的本地浏览器存储中。

Eye-comfort appearance controls for DeepSeek Harness: five light themes, accent and background colours, typography, content width, contrast and motion. This is an independent community plugin, not an official Codex or DeepSeek product.

已在 Windows 上 DeepSeek Harness 0.2.0-rc.2 中验证安装、设置界面与浅色/深色主题效果。字体清单通过主进程调用系统接口读取（Windows 用 GDI+，macOS 用 system_profiler，Linux 用 fc-list），不修改系统设置。
```

**依据 2 · 源码核查**：[lib/client.js:10-18](https://github.com/AaronKate/dsh-codex-appearance/blob/4991952d6759b0a5edc6a3924ced3076bc0b5075/lib/client.js#L10-L18)

可配置模式/字体/宽度/动态默认

```text
    const DEFAULT = {
      mode: "dark", separate: false, theme: "warm",
      accent: BLUE, background: "#2A313A", foreground: "#DAD6D6",
      light: {accent: BLUE, background: "#F7F8F9", foreground: "#262F3C", uiFont:"system", contentFont:"inherit", codeFont:"system"},
      dark: {accent: BLUE, background: "#2A313A", foreground: "#DAD6D6", uiFont:"system", contentFont:"inherit", codeFont:"system"},
      uiFont: "system", contentFont: "inherit", codeFont: "system",
      uiSize: 14, codeSize: 12, fontStyle: "normal", contentStyle: "normal", codeStyle: "normal",
      contentWidth: 920, contrast: 40, reducedMotion: "system",
      paper: false, paperStrength: 60
```

#### 缺口

- 真实可读性、对比度合格与读者偏好未验证
  **影响**：不能断言改善阅读或健康
  **进一步探讨**：用真实页面和用户任务比较原主题/插件的可读性与操作错误

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 设置如何影响主题和字体？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

client将配置保存在固定localStorage键，监听theme服务后setTheme并注册overrideTokens，同时applyExtras注入更细CSS。它监听body深色属性和媒体查询，禁用时移除监听、token覆盖与extras样式。host字体路由用Windows GDI+/macOS system_profiler/Linux fc-list枚举并去重缓存，浏览器不需要直接系统字体权限。可借鉴的是宿主token与组件扩展配合、失败退候选字体，移植要重做token和CSS选择器映射。字体路由是额外Host能力，不能称纯客户端零进程插件。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1-18](https://github.com/AaronKate/dsh-codex-appearance/blob/4991952d6759b0a5edc6a3924ced3076bc0b5075/lib/client.js#L1-L18)

固定本地存储键与默认值

<details>
<summary>查看原文（18行）</summary>

```text
window.__ModuleLoader__.load({
  id: "dsh-eye-comfort",
  factory: (require) => {
    const React = require("react");
    const h = React.createElement;
    const KEY = "dsh-codex-appearance/v1";
    const BLUE = "#339CFF";
    // 浅色模式下的链接基色：偏蓝、饱和度足够，用来和暖色正文拉开冷暖对比。
    const LINK_BLUE = "#2F6FD0";
    const DEFAULT = {
      mode: "dark", separate: false, theme: "warm",
      accent: BLUE, background: "#2A313A", foreground: "#DAD6D6",
      light: {accent: BLUE, background: "#F7F8F9", foreground: "#262F3C", uiFont:"system", contentFont:"inherit", codeFont:"system"},
      dark: {accent: BLUE, background: "#2A313A", foreground: "#DAD6D6", uiFont:"system", contentFont:"inherit", codeFont:"system"},
      uiFont: "system", contentFont: "inherit", codeFont: "system",
      uiSize: 14, codeSize: 12, fontStyle: "normal", contentStyle: "normal", codeStyle: "normal",
      contentWidth: 920, contrast: 40, reducedMotion: "system",
      paper: false, paperStrength: 60
```

</details>

**依据 2 · 源码核查**：[lib/client.js:949-977](https://github.com/AaronKate/dsh-codex-appearance/blob/4991952d6759b0a5edc6a3924ced3076bc0b5075/lib/client.js#L949-L977)

theme覆盖、环境监听与清理

<details>
<summary>查看原文（29行）</summary>

```text
      let removeTheme = null;
      ctx.inject(["theme"], scope => {
        function sync() {
          removeTheme?.();
          try { scope.theme.setTheme(state.mode); } catch {}
          removeTheme = scope.theme.overrideTokens("dsh-eye-comfort", themeTokens(state));
          applyExtras(state, state.reducedMotion === "on" || (state.reducedMotion === "system" && motionMedia.matches));
        }
        // 「跟随系统」时的重算信号：不能只监听 prefers-color-scheme。
        // DSH 把主题写进 body 的 data-ds-dark-theme，系统深浅色变化会先反映到这个属性上；
        // 而媒体查询会被 Electron 的 nativeTheme.themeSource 改写，两者会不一致。
        // 因此同时监听属性变化（MutationObserver）与媒体查询（保留作为兜底）。
        const media = matchMedia("(prefers-color-scheme: dark)");
        const motionMedia = matchMedia("(prefers-reduced-motion: reduce)");
        let pending = false;
        const schemeObserver = new MutationObserver(() => {
          if (pending || state.mode !== "system") return;
          pending = true;
          requestAnimationFrame(() => { pending = false; sync(); });
        });
        if (document.body) schemeObserver.observe(document.body, { attributes: true, attributeFilter: ["data-ds-dark-theme"] });
        sync();
        const syncEnvironment = () => { if (state.mode === "system" || state.reducedMotion === "system") sync(); };
        media.addEventListener("change", syncEnvironment);
        motionMedia.addEventListener("change", syncEnvironment);
        listeners.add(sync);
        scope.effect(() => () => { listeners.delete(sync); schemeObserver.disconnect(); media.removeEventListener("change", syncEnvironment); motionMedia.removeEventListener("change", syncEnvironment); removeTheme?.(); document.getElementById("dca-theme-extras")?.remove(); }, "dsh-eye-comfort: theme controls");
      });
      ctx.slots.inject("settings.section", () => ctx.slots.register({name:"settings.section",id:"codex-appearance",order:5,label:"外观"},SettingsPage));
```

</details>

**依据 3 · 源码核查**：[lib/index.js:26-40](https://github.com/AaronKate/dsh-codex-appearance/blob/4991952d6759b0a5edc6a3924ced3076bc0b5075/lib/index.js#L26-L40)

Windows同步字体子进程

<details>
<summary>查看原文（15行）</summary>

```text
function windowsFonts() {
  // 输出编码是这个探测的唯一陷阱：powershell.exe 默认按系统 ANSI 代码页（简体中文机器上是
  // GBK）写出，而 Node 按 UTF-8 解码，纯中文字体名（微软雅黑、宋体、华文楷体…）会整条变成
  // 替换字符并被去重合并掉。先把 Console::OutputEncoding 钉成 UTF-8，再输出。
  const script = [
    "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8",
    "$OutputEncoding = [System.Text.Encoding]::UTF8",
    "Add-Type -AssemblyName System.Drawing",
    "(New-Object System.Drawing.Text.InstalledFontCollection).Families | ForEach-Object { $_.Name }",
  ].join("; ");
  const out = execFileSync(
    "powershell",
    ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", script],
    { encoding: "utf8", windowsHide: true, timeout: 15000, maxBuffer: 4 * 1024 * 1024 },
  );
```

</details>

**依据 4 · 源码核查**：[lib/index.js:49-82](https://github.com/AaronKate/dsh-codex-appearance/blob/4991952d6759b0a5edc6a3924ced3076bc0b5075/lib/index.js#L49-L82)

macOS/Linux枚举和失败处理

<details>
<summary>查看原文（34行）</summary>

```text
function unixFonts() {
  try {
    if (process.platform === "darwin") {
      const out = execFileSync("system_profiler", ["SPFontsDataType", "-json"], {
        encoding: "utf8",
        timeout: 20000,
        maxBuffer: 16 * 1024 * 1024,
      });
      const families = [];
      const walk = (node) => {
        if (Array.isArray(node)) return node.forEach(walk);
        if (!node || typeof node !== "object") return;
        if (typeof node._name === "string" && node._name) families.push(node._name);
        for (const value of Object.values(node)) walk(value);
      };
      walk(JSON.parse(out));
      return families;
    }
    const out = execFileSync("fc-list", ["-f", "%{family}\n"], {
      encoding: "utf8",
      timeout: 15000,
      maxBuffer: 16 * 1024 * 1024,
    });
    // fc-list prints comma-separated aliases per face ("Noto Sans,Noto Sans CJK SC").
    const families = new Set();
    for (const line of out.split("\n")) {
      for (const alias of line.split(",")) {
        const name = alias.trim();
        if (name) families.add(name);
      }
    }
    return [...families];
  } catch {
    return null;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 维护、权限与资源边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

扩展并非只依赖稳定token：client额外CSS匹配HOHHba/K5rwea等构建类名片段，宿主重新构建或布局变化可能使部分区域失效，不能从ui-theme接口存在推断全部覆盖兼容。font读取同步execFileSync，首次请求可能阻塞宿主至声明超时，缓存失败为空避免反复执行但也需重启才能再探。路由在connection.admit存在时校验，缺此服务仍提供字体列表，这让旧宿主兼容与主机字体信息边界发生取舍，远程暴露需验收。localStorage只属于当前浏览器环境，不跨设备，也不自动随profile备份；主题多插件最后覆盖获胜。首次需检查字体/主题，持续需适配CSS和本地设置，失败恢复回默认并禁用；现金、CPU和人工时未测，不能推断免费无成本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:646-662](https://github.com/AaronKate/dsh-codex-appearance/blob/4991952d6759b0a5edc6a3924ced3076bc0b5075/lib/client.js#L646-L662)

构建类名CSS覆盖

<details>
<summary>查看原文（17行）</summary>

```text
        body[data-ds-dark-theme] [class*="HOHHba_card"] { background: ${ui.card} !important; border-color: ${ui.border} !important; }
        /* 同样要带 body[data-ds-dark-theme]：DSH 有一条
           body[data-ds-dark-theme] .HOHHba_card{--changes-fill:neutral-850}（0-2-1），
           裸选择器压不过它，卡头会退回近黑。 */
        body[data-ds-dark-theme] [class*="HOHHba_card"] { --changes-fill: transparent; --changes-hover: ${ui.control}; }
        body[data-ds-dark-theme] [class*="HOHHba_tile"] { background: color-mix(in srgb, ${palette.foreground} 6%, transparent) !important; border-color: ${ui.border} !important; }
        /* 「已编辑 client.js」这类单文件卡片（K5rwea_file）走另一套局部变量
           --deliverable-fill：深色下 DSH 把它硬编码成 --dsw-static-neutral-850 (#212123)，
           比内容区 ${darkContent} 暗得多，在正文里就是一块黑斑（用户截图确认）。

           这里必须带 body[data-ds-dark-theme] 限定：DSH 自己的深色规则写的是
           body[data-ds-dark-theme] .K5rwea_root（权重 0-2-1），而裸的
           body [class*="K5rwea_root"] 只有 0-1-1 —— 上一版就是被它压过去，
           变量改了但计算值没变，卡片依旧发黑。加上同一前缀后权重 0-3-1，稳定生效。
           卡片底色与 HOHHba 卡片同取 ui.card，hover 用 ui.control。 */
        body[data-ds-dark-theme] [class*="K5rwea_root"] { --deliverable-fill: ${ui.card}; --deliverable-hover: ${ui.control}; }
        body[data-ds-dark-theme] [class*="K5rwea_file"] { border-color: ${ui.border} !important; }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:86-103](https://github.com/AaronKate/dsh-codex-appearance/blob/4991952d6759b0a5edc6a3924ced3076bc0b5075/lib/index.js#L86-L103)

字体列表缓存含失败

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Read (and memoise) the installed font families. A failed probe is cached as an empty list:
 * retrying per request would run a subprocess on every settings render, and a machine whose
 * font catalog cannot be read is not going to start reporting it a second later.
 * @returns {string[]}
 */
export function installedFonts() {
  if (cache !== null) return cache;
  let families = null;
  try {
    families = process.platform === "win32" ? windowsFonts() : unixFonts();
  } catch {
    families = null;
  }
  cache = [...new Set((families ?? []).map((name) => String(name).trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
  return cache;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:109-136](https://github.com/AaronKate/dsh-codex-appearance/blob/4991952d6759b0a5edc6a3924ced3076bc0b5075/lib/index.js#L109-L136)

信任栅栏可选

<details>
<summary>查看原文（28行）</summary>

```text
 * The route is admitted through Connection's fence when that service is present (Host/Origin
 * check plus the browser session cookie), so another site open in the same browser cannot read
 * the machine's font catalog — the list is fingerprinting-grade data. `connection` is optional
 * only so an older host still serves the route; when it is present the fence always applies.
 * @param {any} ctx
 */
export function registerFontsRoute(ctx) {
  return ctx.webServer.register({
    kind: "exact",
    path: FONTS_PATH,
    handler: async (request, response) => {
      const connection = ctx.get?.("connection");
      if (connection?.admit) {
        let admission;
        try {
          admission = connection.admit(request);
        } catch {
          // Fail closed: a fence that cannot decide must not hand out the font list.
          response.writeHead(403);
          response.end("forbidden");
          return;
        }
        if (admission && typeof admission === "object" && "rejection" in admission) {
          response.writeHead(admission.rejection);
          response.end(admission.rejection === 401 ? "unauthorized" : "forbidden");
          return;
        }
      }
```

</details>

**依据 4 · 作者声明**：[README.md:35-39](https://github.com/AaronKate/dsh-codex-appearance/blob/4991952d6759b0a5edc6a3924ced3076bc0b5075/README.md#L35-L39)

本地设置与多主题覆盖边界

````text
```sh
dsh plugin --profile desktop remove dsh-eye-comfort
```

此插件不修改应用安装包或签名。与其他主题插件同时启用时，最后注册的 token 覆盖层决定同名颜色。当前版本的设置属于本机当前桌面应用，不跨设备同步。
````

#### 缺口

- 当前宿主CSS覆盖、字体请求和禁用未运行
  **影响**：影响可读性、性能与主机信息访问
  **进一步探讨**：测试主题矩阵/无connection/字体命令失败/禁用恢复

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可检验何种设计改进，当前谁可试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是把稳定token覆盖作为基础层，将构建类名extras标为可独立关闭的兼容层，并在宿主选择器失配时提示，会比全量静默CSS更易维护。来源Q03的私有class耦合；代价是少量区域可能退回原色，不把缺口藏成全覆盖。最小实验在两份不同构建的宿主页面比较现状与分层方案，检查代码对比、输入聚焦、改动卡片及深浅模式，测失配发现时间、样式修复量与用户操作错误；若提醒无价值且显著破坏一致性则否定。当前有限试用个人本机界面，先保存原设置并验证禁用恢复；远程字体接口与其他主题共存需先检查。字号/纸纹按个人效果选，不给健康承诺。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:949-975](https://github.com/AaronKate/dsh-codex-appearance/blob/4991952d6759b0a5edc6a3924ced3076bc0b5075/lib/client.js#L949-L975)

token和extras已有分层接点

<details>
<summary>查看原文（27行）</summary>

```text
      let removeTheme = null;
      ctx.inject(["theme"], scope => {
        function sync() {
          removeTheme?.();
          try { scope.theme.setTheme(state.mode); } catch {}
          removeTheme = scope.theme.overrideTokens("dsh-eye-comfort", themeTokens(state));
          applyExtras(state, state.reducedMotion === "on" || (state.reducedMotion === "system" && motionMedia.matches));
        }
        // 「跟随系统」时的重算信号：不能只监听 prefers-color-scheme。
        // DSH 把主题写进 body 的 data-ds-dark-theme，系统深浅色变化会先反映到这个属性上；
        // 而媒体查询会被 Electron 的 nativeTheme.themeSource 改写，两者会不一致。
        // 因此同时监听属性变化（MutationObserver）与媒体查询（保留作为兜底）。
        const media = matchMedia("(prefers-color-scheme: dark)");
        const motionMedia = matchMedia("(prefers-reduced-motion: reduce)");
        let pending = false;
        const schemeObserver = new MutationObserver(() => {
          if (pending || state.mode !== "system") return;
          pending = true;
          requestAnimationFrame(() => { pending = false; sync(); });
        });
        if (document.body) schemeObserver.observe(document.body, { attributes: true, attributeFilter: ["data-ds-dark-theme"] });
        sync();
        const syncEnvironment = () => { if (state.mode === "system" || state.reducedMotion === "system") sync(); };
        media.addEventListener("change", syncEnvironment);
        motionMedia.addEventListener("change", syncEnvironment);
        listeners.add(sync);
        scope.effect(() => () => { listeners.delete(sync); schemeObserver.disconnect(); media.removeEventListener("change", syncEnvironment); motionMedia.removeEventListener("change", syncEnvironment); removeTheme?.(); document.getElementById("dca-theme-extras")?.remove(); }, "dsh-eye-comfort: theme controls");
```

</details>

**依据 2 · 源码核查**：[lib/client.js:646-662](https://github.com/AaronKate/dsh-codex-appearance/blob/4991952d6759b0a5edc6a3924ced3076bc0b5075/lib/client.js#L646-L662)

兼容层依赖构建类名

<details>
<summary>查看原文（17行）</summary>

```text
        body[data-ds-dark-theme] [class*="HOHHba_card"] { background: ${ui.card} !important; border-color: ${ui.border} !important; }
        /* 同样要带 body[data-ds-dark-theme]：DSH 有一条
           body[data-ds-dark-theme] .HOHHba_card{--changes-fill:neutral-850}（0-2-1），
           裸选择器压不过它，卡头会退回近黑。 */
        body[data-ds-dark-theme] [class*="HOHHba_card"] { --changes-fill: transparent; --changes-hover: ${ui.control}; }
        body[data-ds-dark-theme] [class*="HOHHba_tile"] { background: color-mix(in srgb, ${palette.foreground} 6%, transparent) !important; border-color: ${ui.border} !important; }
        /* 「已编辑 client.js」这类单文件卡片（K5rwea_file）走另一套局部变量
           --deliverable-fill：深色下 DSH 把它硬编码成 --dsw-static-neutral-850 (#212123)，
           比内容区 ${darkContent} 暗得多，在正文里就是一块黑斑（用户截图确认）。

           这里必须带 body[data-ds-dark-theme] 限定：DSH 自己的深色规则写的是
           body[data-ds-dark-theme] .K5rwea_root（权重 0-2-1），而裸的
           body [class*="K5rwea_root"] 只有 0-1-1 —— 上一版就是被它压过去，
           变量改了但计算值没变，卡片依旧发黑。加上同一前缀后权重 0-3-1，稳定生效。
           卡片底色与 HOHHba 卡片同取 ui.card，hover 用 ui.control。 */
        body[data-ds-dark-theme] [class*="K5rwea_root"] { --deliverable-fill: ${ui.card}; --deliverable-hover: ${ui.control}; }
        body[data-ds-dark-theme] [class*="K5rwea_file"] { border-color: ${ui.border} !important; }
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
