# dsh-eye-comfort

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[b07a9bd](https://github.com/AaronKate/dsh-codex-appearance/tree/b07a9bdc4bcd37f23df4d93c82f271920f084b7f)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：为 DSH 提供主题、字体字号、内容宽度、对比度、纸张纹理与动态效果设置。

> **核心亮点**：将配色、字体、内容与动画设置整合到宿主token层，本机字体枚举减少手写CSS与候选遗漏；属集成便利。参见[Q01](#research-q01)。

> **风险与缺陷**：lazy保存的旧快照可在后续即时更新后写回，且保存失败被旁路；本地外观正确不等于下次启动保留最新参数。参见[Q02](#research-q02)。

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
  - [Q01 · 外观配置的实际贡献与“护眼”主张边界是什么？](#detail-section-11)
  - [Q02 · 字体、token和本地设置如何联动，恢复有什么细节？](#detail-section-12)
  - [Q03 · 首次启用、日常和退出各有什么条件与成本？](#detail-section-13)
  - [Q04 · 可控试用与新的验证假设是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向默认外观不满足阅读偏好的桌面用户，以可读布局和可恢复设置为验收，不把护眼名称当健康疗效。

宿主浅深色模式和手写CSS是参照；本项主要节省配置接线，未建立健康或任务质量对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 外观设置 | 调整阅读偏好 | 本地设置，不是健康效果保证 |
| 字体枚举 | 展示本机字体 | OS命令可用，失败缓存/回退 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22.19、Web扩展点 | 启动必需 | 插件与设置/token | 不启用，保留宿主主题 |
| OS字体命令 | 可选增强 | 完整字体清单 | 候选探测回退 |
| 可写localStorage | 持久化必需 | 保存设置 | 当次有效可能不留存 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户安装、移除旧包并重启 | 单一覆盖层，出现外观页 |
| 2 | 用户选择主题与字号 | 正文/代码/链接可读 |
| 3 | 用户重启并禁用检查 | 保存正确且原主题可恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包资源、OS字体命令 | 安装重启、调参 | 费用/时间未测 |
| 持续使用 | CSS/token重绘、本地存储 | 检查可读与主题冲突 | 无强制模型调用，耗时未知 |
| 失败恢复 | 重载或重装 | 记录/重设参数、禁用 | 写盘异常旁路，恢复时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 配置范围 | 主题/字体/token设置 | 真实宿主视觉一致性 |
| 持久化 | localStorage与sanitize | 快速更新/异常后的最新保存 |
| 阅读 | 可调整宽度与对比 | 正确率、疲劳和健康收益 |

> **思考**：lazy保存的旧快照可在后续即时更新后写回，且保存失败被旁路；本地外观正确不等于下次启动保留最新参数。参见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将配色、字体、内容与动画设置整合到宿主token层，本机字体枚举减少手写CSS与候选遗漏；属集成便利。参见[Q01](#research-q01)。

将配色、字体、内容与动画设置整合到宿主token层，本机字体枚举减少手写CSS与候选遗漏；属集成便利。参见[Q01](#research-q01)。

可复用字体命令限时缓存和token清理；注意失败缓存需重启才重探、旧宿主无Connection时不加围栏以及延迟快照时序。详见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

lazy保存的旧快照可在后续即时更新后写回，且保存失败被旁路；本地外观正确不等于下次启动保留最新参数。参见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

单主题小范围试用，核代码/中文/链接、重启保存与禁用恢复；不把名称推为健康效果。参见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

配置能力有源码支持；阅读/健康收益未验证，延迟持久化存在静态时序风险，修订号改进未实现。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查Host字体路由、客户端状态/token/生命周期和包发布声明；未逐项视觉复验或测健康效果。
- 下一步：先验证滑杆lazy→非lazy主题切换→等待重载的状态，再核禁用和阅读对照；均未执行。

**分析版本**

- **仓库**：[AaronKate/dsh-codex-appearance](https://github.com/AaronKate/dsh-codex-appearance)
- **版本号**：0.3.7（[固定提交 b07a9bd](https://github.com/AaronKate/dsh-codex-appearance/tree/b07a9bdc4bcd37f23df4d93c82f271920f084b7f)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设为修订号持久化与可回退对照预览，先用快速调参重载验证状态保留，再独立检验阅读收益。参见[Q04](#research-q04)。

先验证滑杆lazy→非lazy主题切换→等待重载的状态，再核禁用和阅读对照；均未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 97 | — | — | 1558 |
| .js | source | 2 | 950 | 676 | 268 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/AaronKate/dsh-codex-appearance/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本外观插件的配置增量、状态边界和采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 外观配置的实际贡献与“护眼”主张边界是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

长时间阅读代码和聊天、对默认字号配色不适的桌面用户可在一处调整主题、界面/内容/代码字体、行距、宽度和动画。合格结果是文本可读、布局不遮挡、设置可恢复；并非医学上的视疲劳治疗。作者Windows安装和截图是作者报告，本轮未复验。

相对宿主浅深色切换或手写CSS，插件把五种配色、主题token和内容样式联动，并通过本机字体枚举扩大选择。增量是配置整合与可达性，没有证据证明提高阅读正确率、保护眼健康或具原创配色算法。偏好已经由宿主满足的用户不必增加覆盖层。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:1-7](https://github.com/AaronKate/dsh-codex-appearance/blob/b07a9bdc4bcd37f23df4d93c82f271920f084b7f/README.md#L1-L7)

作者功能和Windows验证声明。

```text
# DeepSeek Harness 护眼外观插件

在设置中增加「外观」页，提供五套护眼主题（暖白、米纸、豆沙绿、雾蓝、石墨），以及跟随系统/浅色/深色模式、强调色与背景色、界面与代码的字体和字号、字体样式、内容宽度、对比度、纸张质感和减少动态效果等设置。每套主题各自带有匹配的强调色与链接色，并覆盖消息气泡、轮次预览、输入框、改动文件卡片等界面区域；深色模式保持蓝灰。字体下拉会列出本机安装的全部字族（由插件主进程读取系统字体清单，读不到时回退到内置候选探测），可分别设置界面、内容与代码字体。纸张质感在内容区、侧栏、输入框和卡片上叠一层极淡的纸纤维颗粒，强度可调；纹理自带主题底色，不改变原有色温，也不触碰原生标题栏。输入框在鼠标移入时轻微上浮、聚焦输入时落回原位。通过 Harness 的主题 token 和设置 section 扩展点工作；设置保存在当前桌面应用的本地浏览器存储中。

Eye-comfort appearance controls for DeepSeek Harness: five light themes, accent and background colours, typography, content width, contrast and motion. This is an independent community plugin, not an official Codex or DeepSeek product.

已在 Windows 上 DeepSeek Harness 0.2.0-rc.2 中验证安装、设置界面与浅色/深色主题效果。字体清单通过主进程调用系统接口读取（Windows 用 GDI+，macOS 用 system_profiler，Linux 用 fc-list），不修改系统设置。
```

**依据 2 · 源码核查**：[lib/client.js:771-787](https://github.com/AaronKate/dsh-codex-appearance/blob/b07a9bdc4bcd37f23df4d93c82f271920f084b7f/lib/client.js#L771-L787)

token覆盖与设置页接线。

<details>
<summary>查看原文（17行）</summary>

```text
      ctx.inject(["theme"], scope => {
        function sync() {
          removeTheme?.();
          try { scope.theme.setTheme(state.mode); } catch {}
          removeTheme = scope.theme.overrideTokens("dsh-eye-comfort", themeTokens(state));
          applyExtras(state, state.reducedMotion === "on" || (state.reducedMotion === "system" && motionMedia.matches));
        }
        const media = matchMedia("(prefers-color-scheme: dark)");
        const motionMedia = matchMedia("(prefers-reduced-motion: reduce)");
        sync();
        const syncEnvironment = () => { if (state.mode === "system" || state.reducedMotion === "system") sync(); };
        media.addEventListener("change", syncEnvironment);
        motionMedia.addEventListener("change", syncEnvironment);
        listeners.add(sync);
        scope.effect(() => () => { listeners.delete(sync); media.removeEventListener("change", syncEnvironment); motionMedia.removeEventListener("change", syncEnvironment); removeTheme?.(); document.getElementById("dca-theme-extras")?.remove(); }, "dsh-eye-comfort: theme controls");
      });
      ctx.slots.inject("settings.section", () => ctx.slots.register({name:"settings.section",id:"codex-appearance",order:5,label:"外观"},SettingsPage));
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 字体、token和本地设置如何联动，恢复有什么细节？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host通过只读路由枚举系统字体，Windows用PowerShell/GDI+，macOS用system_profiler，Linux用fc-list；命令有超时与输出上限，结果在模块缓存，失败缓存空列表。Connection存在时先admit并在异常时拒绝，但旧宿主无Connection时仍放行，不能宣称所有环境都有同样访问围栏。首次同步命令可能短暂占用Host线程。

客户端sanitize限制颜色和数值，localStorage保存设置，theme.overrideTokens返回清理函数，环境主题/减少动画变化触发重算；卸载清token、样式和监听。值得借鉴的是官方token层与字体探测回退，移植仍需适配宿主token。一个具体一致性边界是lazy更新把快照排进200ms定时器，随后非lazy更新直接写盘却不清pending，旧快照可能稍后覆盖新存储；当前内存正确也不能保证重启后保存最新选择。此为静态时序风险，未执行复现。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:92-103](https://github.com/AaronKate/dsh-codex-appearance/blob/b07a9bdc4bcd37f23df4d93c82f271920f084b7f/lib/index.js#L92-L103)

字体缓存含失败结果。

<details>
<summary>查看原文（12行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/index.js:115-148](https://github.com/AaronKate/dsh-codex-appearance/blob/b07a9bdc4bcd37f23df4d93c82f271920f084b7f/lib/index.js#L115-L148)

可选Connection围栏与只读响应。

<details>
<summary>查看原文（34行）</summary>

```text
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
      if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(405, { allow: "GET, HEAD" });
        response.end();
        return;
      }
      const fonts = installedFonts();
      const body = JSON.stringify({ platform: process.platform, fonts });
      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-cache",
      });
      response.end(request.method === "HEAD" ? undefined : body);
```

</details>

**依据 3 · 源码核查**：[lib/client.js:267-288](https://github.com/AaronKate/dsh-codex-appearance/blob/b07a9bdc4bcd37f23df4d93c82f271920f084b7f/lib/client.js#L267-L288)

延迟快照和即时写盘路径。

<details>
<summary>查看原文（22行）</summary>

```text
    let state;
    try { state = sanitize(JSON.parse(localStorage.getItem(KEY))); } catch { state = sanitize(null); }
    function setState(next) {
      state = sanitize(next);
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
      listeners.forEach(fn => fn());
    }
    const persistSoon = (function () {
      let timer = null, pending = null;
      const flush = () => { timer = null; if (pending !== null) { try { localStorage.setItem(KEY, JSON.stringify(pending)); } catch {} pending = null; } };
      return next => { pending = sanitize(next); if (!timer) timer = setTimeout(flush, 200); };
    })();
    function useSettings() {
      const [value, update] = React.useState(state);
      React.useEffect(() => { const fn = () => update(state); listeners.add(fn); return () => listeners.delete(fn); }, []);
      const patch = (p, lazy) => {
        const next = {...state, ...p};
        state = sanitize(next);
        if (lazy) persistSoon(next); else { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }
        listeners.forEach(fn => fn());
      };
      return [value, patch];
```

</details>

**依据 4 · 源码核查**：[lib/client.js:771-785](https://github.com/AaronKate/dsh-codex-appearance/blob/b07a9bdc4bcd37f23df4d93c82f271920f084b7f/lib/client.js#L771-L785)

token和环境监听生命周期。

<details>
<summary>查看原文（15行）</summary>

```text
      ctx.inject(["theme"], scope => {
        function sync() {
          removeTheme?.();
          try { scope.theme.setTheme(state.mode); } catch {}
          removeTheme = scope.theme.overrideTokens("dsh-eye-comfort", themeTokens(state));
          applyExtras(state, state.reducedMotion === "on" || (state.reducedMotion === "system" && motionMedia.matches));
        }
        const media = matchMedia("(prefers-color-scheme: dark)");
        const motionMedia = matchMedia("(prefers-reduced-motion: reduce)");
        sync();
        const syncEnvironment = () => { if (state.mode === "system" || state.reducedMotion === "system") sync(); };
        media.addEventListener("change", syncEnvironment);
        motionMedia.addEventListener("change", syncEnvironment);
        listeners.add(sync);
        scope.effect(() => () => { listeners.delete(sync); media.removeEventListener("change", syncEnvironment); motionMedia.removeEventListener("change", syncEnvironment); removeTheme?.(); document.getElementById("dca-theme-extras")?.remove(); }, "dsh-eye-comfort: theme controls");
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 首次启用、日常和退出各有什么条件与成本？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

package要求Node>=22.19及具备ui-theme/settings.section等扩展点的Web宿主；字体OS命令是可选增强，失败仍可内置候选探测。首次安装/重启后调参，日常本地计算与CSS覆盖，无强制模型/订阅调用。资源量和调参分钟数未测，不能因本地运行就填零成本。

持续维护来自宿主token/DOM选择器变化、多个主题的注册顺序和本地浏览器存储。旧包改名为dsh-eye-comfort，作者要求先卸旧；设置不跨设备，写盘异常被吞掉会让用户不知未保存。退出时清覆盖层但保留本地设置，需自己记录参数或清本地存储；不能据源码清理函数认定真实卸载已验收。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-25](https://github.com/AaronKate/dsh-codex-appearance/blob/b07a9bdc4bcd37f23df4d93c82f271920f084b7f/package.json#L1-L25)

版本、客户端注入与Node要求。

<details>
<summary>查看原文（25行）</summary>

```text
{
  "name": "dsh-eye-comfort",
  "version": "0.3.7",
  "description": "Eye-comfort appearance controls for DeepSeek Harness: five light themes, paper-grain texture, accent and background colours, fonts, type sizes, content width, contrast and motion.",
  "keywords": ["deepseek-harness", "dsh-plugin", "theme", "appearance"],
  "license": "MIT",
  "repository": {"type": "git", "url": "git+https://github.com/AaronKate/dsh-codex-appearance.git"},
  "homepage": "https://github.com/AaronKate/dsh-codex-appearance",
  "type": "module",
  "main": "./lib/index.js",
  "exports": {".": "./lib/index.js", "./client": "./lib/client.js", "./cordis.patch.yml": "./cordis.patch.yml"},
  "files": ["lib", "cordis.patch.yml", "README.md"],
  "dsh": {
    "meta": {
      "title": {"en": "Eye Comfort", "zh": "护眼外观"},
      "description": {
        "en": "Adjust the DeepSeek Harness UI: five eye-comfort themes, accent and background colours, fonts, type sizes, font styles, content width, contrast and motion.",
        "zh": "调整 DeepSeek Harness 的界面外观：五套护眼主题、强调色与背景、字体字号、字体样式、内容宽度、对比度与动态效果。"
      }
    },
    "bundle": {"patch": "./cordis.patch.yml"},
    "client": {"inject": ["@deepseek-ai/dsh-client-ui-theme", "@deepseek-ai/dsh-client-ui-settings-general", "@deepseek-ai/dsh-client-ui-renderer"], "platform": "web"}
  },
  "engines": {"node": ">=22.19"}
}
```

</details>

**依据 2 · 源码核查**：[README.md:17-35](https://github.com/AaronKate/dsh-codex-appearance/blob/b07a9bdc4bcd37f23df4d93c82f271920f084b7f/README.md#L17-L35)

安装、改名与卸载边界。

<details>
<summary>查看原文（19行）</summary>

````text
![对比度 0 / 50 / 100](assets/contrast-levels.png)

## 安装

从 [Releases](https://github.com/AaronKate/dsh-codex-appearance/releases) 下载 `dsh-eye-comfort-0.3.7.tgz`，执行：

```sh
dsh plugin --profile desktop add ./dsh-eye-comfort-0.3.7.tgz
```

本地开发可在仓库根目录 `npm pack` 后从 `dist/` 安装打包产物。

重启 DeepSeek Harness，在「设置 → 外观」中调整。Windows 上 PowerShell 同样使用以上命令；路径可改为下载文件的绝对路径。要求 DeepSeek Harness 版本包含 `ui-theme` 和 `settings.section` 插件接口。

> 从 `dsh-codex-appearance` 改名为 `dsh-eye-comfort`。若你装过旧版本，请先执行下方卸载命令移除旧包，再按上面的方式安装新包；外观设置保存在浏览器存储中，与包名无关，重装后不会丢失。

## 卸载

```sh
````

</details>

**依据 3 · 源码核查**：[lib/client.js:267-288](https://github.com/AaronKate/dsh-codex-appearance/blob/b07a9bdc4bcd37f23df4d93c82f271920f084b7f/lib/client.js#L267-L288)

写盘错误旁路。

<details>
<summary>查看原文（22行）</summary>

```text
    let state;
    try { state = sanitize(JSON.parse(localStorage.getItem(KEY))); } catch { state = sanitize(null); }
    function setState(next) {
      state = sanitize(next);
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
      listeners.forEach(fn => fn());
    }
    const persistSoon = (function () {
      let timer = null, pending = null;
      const flush = () => { timer = null; if (pending !== null) { try { localStorage.setItem(KEY, JSON.stringify(pending)); } catch {} pending = null; } };
      return next => { pending = sanitize(next); if (!timer) timer = setTimeout(flush, 200); };
    })();
    function useSettings() {
      const [value, update] = React.useState(state);
      React.useEffect(() => { const fn = () => update(state); listeners.add(fn); return () => listeners.delete(fn); }, []);
      const patch = (p, lazy) => {
        const next = {...state, ...p};
        state = sanitize(next);
        if (lazy) persistSoon(next); else { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }
        listeners.forEach(fn => fn());
      };
      return [value, patch];
```

</details>

#### 缺口

- 多主题、存储失败与旧宿主尚未验收
  **影响**：设置持久与视觉可用性未知
  **进一步探讨**：在目标宿主核重启、禁用、无Connection和配色冲突，记录参数及恢复

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可控试用与新的验证假设是什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

建议有阅读定制需求的用户试用，先只用一个主题覆盖层，调整字号/宽度后核中文、代码与链接，重启确认保存并验禁用恢复；如果对比不足、代码截断或重启回退，停止采用。与健康相关的收益没有独立证据，不据“护眼”名称承诺。

未验证假设是以状态修订号管理延迟持久化，并提供主题预览对照和一键恢复。它由延迟旧快照与错误吞掉推导，可能减少调参丢失和回退人工；增加状态同步复杂性。最小验证快速执行滑杆lazy→主题非lazy→200ms等待→重载，比较参数保留率；另在同文本字号下对照阅读正确率与主观舒适度。若状态仍旧或阅读无改善，则不支持相应收益；本轮均未执行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:275-288](https://github.com/AaronKate/dsh-codex-appearance/blob/b07a9bdc4bcd37f23df4d93c82f271920f084b7f/lib/client.js#L275-L288)

延迟持久化的修订需求依据。

<details>
<summary>查看原文（14行）</summary>

```text
      let timer = null, pending = null;
      const flush = () => { timer = null; if (pending !== null) { try { localStorage.setItem(KEY, JSON.stringify(pending)); } catch {} pending = null; } };
      return next => { pending = sanitize(next); if (!timer) timer = setTimeout(flush, 200); };
    })();
    function useSettings() {
      const [value, update] = React.useState(state);
      React.useEffect(() => { const fn = () => update(state); listeners.add(fn); return () => listeners.delete(fn); }, []);
      const patch = (p, lazy) => {
        const next = {...state, ...p};
        state = sanitize(next);
        if (lazy) persistSoon(next); else { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }
        listeners.forEach(fn => fn());
      };
      return [value, patch];
```

</details>

**依据 2 · 源码核查**：[README.md:33-35](https://github.com/AaronKate/dsh-codex-appearance/blob/b07a9bdc4bcd37f23df4d93c82f271920f084b7f/README.md#L33-L35)

冲突与本机设置边界。

````text
## 卸载

```sh
````

#### 缺口

- 持久化修订和阅读收益未验证
  **影响**：不能升为健康效果或持续安装认可
  **进一步探讨**：执行快速调参/重载对照及匹配文本阅读任务

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
