# 护眼外观

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[ba7903e](https://github.com/AaronKate/dsh-codex-appearance/tree/ba7903e5ca5ceb5573a309195c5def85b1932f01)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：DSH个人外观细调与Host字体列表；原生宽度/模式、延迟保存及私有CSS影响恢复和适配。

> **亮点**：将个人配色/分区字体、纹理和系统模式接到Host token/设置入口，少手写CSS；Host字体名是额外本机能力而非浏览器字体安装/传送，新渲染或护眼效果不在证据内，见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：部分disposer不等状态回滚：原生mode/width未还原，重置/迟写可与持久值分叉；Host字体/准入与私有CSS也不能推成跨机器可用或严格拒绝未知身份，具体条件见[Q03](#research-q03)。

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
  - [Q01 · 这是哪种外观扩展，相对原生界面增加什么？](#detail-section-11)
  - [Q02 · 启动、字体、保存与页面生效如何连接？](#detail-section-12)
  - [Q03 · 哪些可恢复、字体和适配承诺需要收窄？](#detail-section-13)
  - [Q04 · 依赖、用法和四阶段投入如何衡量？](#detail-section-14)
  - [Q05 · 哪些先修，什么方向才值得继续试？](#detail-section-15)
  - [Q06 · 当前采用如何限定，退出需要做什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：按个人偏好细调DSH长对话/代码/输入与改动卡片，验收清晰可操作及可恢复；非视觉健康或业务产物改进，适用与原生能力参照见[Q01](#research-q01)。

先试原生主题/已有宽度、系统缩放、简单主题或仅token；若已够用，额外Host字体桥接/私有CSS维护未必值得。未全面盘点当前Host原生外观菜单，不把每个参数算独有，见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 外观细调 | 配色/分区字体/字号与纸纹 | 个人偏好，不证明健康/无障碍；私有类名需适配 |
| 字体列表 | 固定OS枚举和浏览器候选fallback | Host名不等远端浏览器字体，失败缓存/准入具体待验 |
| 模式/宽度 | 接Host setter与原生存储 | 宿主宽度已有；重置own state不复原native偏好 |
| 保存/退出 | 本地偏好与token/observer部分清理 | 写失败吞、pending可迟写，无全状态回滚/账号同步 |
| 减少动态 | 响应系统或手选duration/scroll | 覆盖body全局，不能当性能/可用性已验证 |

**流程与依赖**

Host webServer与客户端slots为主入口，theme是nested条件，完整字体还依赖OS命令/同机渲染和实际准入；原生偏好/私有选择器约束恢复，完整表见[Q04](#research-q04)。

先记录原生模式/宽度与两个存储键，在同机隔离环境逐项调少量参数，等待/重载/重置/禁用分别验；不让重置按钮代替人工核原生状态。步骤统一见[Q04](#research-q04)。

**效果与成本**

没有模型key/素材生成费用机制，但首次同步字体探测、持续DOM/纹理与升级/恢复人时仍需计入；不能从纯UI定位推零负担。四阶段及未知项仅见[Q04](#research-q04)。

个人细调可以有用而无需主张健康/创新领先；真实字形/像素和退出一致性才决定是否值得留用。效果边界统一见[Q04](#research-q04)，不以对比度滑块、注释或截图代替实测。

> **思考**：部分disposer不等状态回滚：原生mode/width未还原，重置/迟写可与持久值分叉；Host字体/准入与私有CSS也不能推成跨机器可用或严格拒绝未知身份，具体条件见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将个人配色/分区字体、纹理和系统模式接到Host token/设置入口，少手写CSS；Host字体名是额外本机能力而非浏览器字体安装/传送，新渲染或护眼效果不在证据内，见[Q01](#research-q01)、[Q02](#research-q02)。

sanitize、token映射/受控data URI纹理和fallback/部分disposer可借鉴，但双偏好与原生setter需要完整生命周期，不能仅清理样式。工程统计为所列扩展/启发式范围，不等每个选择器审计、原创量或视觉效果。

<a id="detail-section-5"></a>

### 1.4 主要限制

部分disposer不等状态回滚：原生mode/width未还原，重置/迟写可与持久值分叉；Host字体/准入与私有CSS也不能推成跨机器可用或严格拒绝未知身份，具体条件见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察；确需细调才先核同机服务/字体准入与原生mode/width的手工恢复，跨机器/多主题/多窗与新Host构建另验。失败停止改值并回原生偏好，边界见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定状态/字体/样式核心链及恢复反例可核；真实Host/字体/视觉/退出未验，观察；兼容层提示仍是假设。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、lib/client.js、lib/index.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核manifest/patch/README、完整Host字体枚举/缓存/准入/注册及实际client关键状态/保存、native width caller、theme/extras/环境监听/清理、候选字体与私有选择器/全body减少动态。未全审每个视觉CSS/截图/IDE文件或Host内部；不执行字体命令、目标/构建/安装、浏览器渲染/像素/性能或健康实验。
- 下一步：本轮固定四材料/HEAD与原文绑定复核；只做源码阅读与本工程结构核验，不执行字体系统命令/插件/安装/视觉实验。作者Windows记录及注释色差/对比值单独作为声明，未继承；当前Host theme/admit/存储/退出与真实页面按[Q06](#research-q06)取证。

**分析版本**

- **仓库**：[AaronKate/dsh-codex-appearance](https://github.com/AaronKate/dsh-codex-appearance)
- **版本号**：0.3.14（[固定提交 ba7903e](https://github.com/AaronKate/dsh-codex-appearance/tree/ba7903e5ca5ceb5573a309195c5def85b1932f01)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

正确性先修，再测稳定token独立使用、兼容CSS可关闭/在对应页面已挂载后提示失配是否胜简单替代；已有分函数不当新分层，证伪条件见[Q05](#research-q05)。

本轮固定四材料/HEAD与原文绑定复核；只做源码阅读与本工程结构核验，不执行字体系统命令/插件/安装/视觉实验。作者Windows记录及注释色差/对比值单独作为声明，未继承；当前Host theme/admit/存储/退出与真实页面按[Q06](#research-q06)取证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 97 | — | — | 1558 |
| .js | source | 2 | 1153 | 733 | 415 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/AaronKate/dsh-codex-appearance/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：外观插件能否在保留原生偏好可恢复的条件下改善个人阅读配置；字体来源、状态保存/退出和私有CSS边界如何影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这是哪种外观扩展，相对原生界面增加什么？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

根当前包名dsh-eye-comfort0.3.14、仓库AaronKate/dsh-codex-appearance，MIT独立社区DSH插件，不是官方Codex/DeepSeek产品。ESM Host入口lib/index.js和Web factory lib/client.js均已提交/在files范围，patch挂eye-comfort；Node>=22.19有声明，但没有DSH engine/精确兼容白名单。README过去Windows DSH0.2.0-rc.2安装/主题验证是作者报告，不能证明本轮当前Host/包安装或跨平台效果。

目标是按个人偏好调整DSH长对话、代码和改动卡片的阅读界面，合格结果是这些区域清晰可操作、偏好可保存并能回原状。它提供五套浅色配色、深浅模式独立颜色/字体、界面/内容/代码字号样式、纸纹/动态等组合，以及Host字体列表；主观喜欢暖色不是健康或无障碍效果。原生theme接口和系统缩放/字体、现成主题或简单CSS是参照；当前代码明确承认内容宽度由宿主ConversationWidthControls及原生存储键管理，不能把宽度当从无到有，也未全面核当前Host原生菜单的全部能力。

贡献是交互参数与Host token/CSS/字体枚举的适配，非新渲染/视觉健康算法。若只想切浅深色或改宽度，先用原生设置可能更省维护；需要多区域细调的人才有额外价值。字体路由会运行固定OS枚举命令，因此不是纯浏览器无进程的皮肤；Host只强依赖webServer，client只强依赖slots，theme服务在nested inject可用后才上token/extras，缺theme仍有设置入口不等颜色已生效。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-25](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/package.json#L1-L25)

身份/双入口/Node声明，无DSH engine，不能当已装。

<details>
<summary>查看原文（25行）</summary>

```text
{
  "name": "dsh-eye-comfort",
  "version": "0.3.14",
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

**依据 2 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/cordis.patch.yml#L1-L3)

当前根挂载。

```text
- insert:
    - id: eye-comfort
      name: dsh-eye-comfort
```

**依据 3 · 作者声明**：[README.md:3-7](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/README.md#L3-L7)

功能、独立社区及作者过去Windows验证。

```text
在设置中增加「外观」页，提供五套护眼主题（暖白、米纸、豆沙绿、雾蓝、石墨），以及跟随系统/浅色/深色模式、强调色与背景色、界面与代码的字体和字号、字体样式、内容宽度、对比度、纸张质感和减少动态效果等设置。每套主题各自带有匹配的强调色与链接色，并覆盖消息气泡、轮次预览、输入框、改动文件卡片等界面区域；深色模式保持蓝灰。字体下拉会列出本机安装的全部字族（由插件主进程读取系统字体清单，读不到时回退到内置候选探测），可分别设置界面、内容与代码字体。纸张质感在内容区、侧栏、输入框和卡片上叠一层极淡的纸纤维颗粒，强度可调；纹理自带主题底色，不改变原有色温，也不触碰原生标题栏。输入框在鼠标移入时轻微上浮、聚焦输入时落回原位。通过 Harness 的主题 token 和设置 section 扩展点工作；设置保存在当前桌面应用的本地浏览器存储中。

Eye-comfort appearance controls for DeepSeek Harness: five light themes, accent and background colours, typography, content width, contrast and motion. This is an independent community plugin, not an official Codex or DeepSeek product.

已在 Windows 上 DeepSeek Harness 0.2.0-rc.2 中验证安装、设置界面与浅色/深色主题效果。字体清单通过主进程调用系统接口读取（Windows 用 GDI+，macOS 用 system_profiler，Linux 用 fc-list），不修改系统设置。
```

**依据 4 · 源码核查**：[lib/client.js:10-20](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L10-L20)

实际默认/参数与默认深色。

<details>
<summary>查看原文（11行）</summary>

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
    };
    const FONTS = {system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", inherit: "inherit", sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", serif: "Georgia, 'Songti SC', serif", mono: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace"};
```

</details>

**依据 5 · 源码核查**：[lib/client.js:225-243](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L225-L243)

宿主已有width ownership及插件写原生键。

<details>
<summary>查看原文（19行）</summary>

```text
    const listeners = new Set();
    // The transcript/composer width belongs to DSH: ConversationWidthControls owns
    // `dsh.conversation.contentWidth` and republishes an inline --dsh-chat-user-width from its
    // ResizeObserver, resolving it against the column width. That value is clamped to
    // [640, columnWidth - 176], so a request larger than the window can hold is reduced, and a
    // stylesheet rule can never win against the inline write. Hence: persist the preference,
    // then set the same inline variable for immediate effect.
    const WIDTH_KEY = "dsh.conversation.contentWidth";
    function applyContentWidth(px) {
      try { localStorage.setItem(WIDTH_KEY, String(px)); } catch {}
      for (const el of document.querySelectorAll('[class*="an3WzG_body"],[class*="an3WzG_root"]')) {
        el.style.setProperty("--dsh-chat-user-width", px + "px");
      }
      // The embedded transcript hard-codes its own min(100% - 32px, 920px), so it needs the
      // resolved width rather than the user-facing variable.
      for (const el of document.querySelectorAll('[class*="an3WzG_embeddedBody"]')) {
        el.style.setProperty("--dsh-chat-content-width", `min(${px}px, calc(100% - 32px))`);
      }
    }
```

</details>

**依据 6 · 源码核查**：[lib/client.js:952-994](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L952-L994)

真正client入口、nested theme/slots与清理。

<details>
<summary>查看原文（43行）</summary>

```text
    function apply(ctx) {
      injectCss();
      // 启动即拉取一次系统字体，用户打开设置页时列表已经就绪。
      loadHostFonts();
      const markNav = () => { for (const button of document.querySelectorAll('[data-shortcut-modal="settings"] nav button')) if (button.textContent.trim() === "外观" && button.dataset.dcaAppearanceNav !== "true") button.dataset.dcaAppearanceNav = "true"; };
      let navQueued = false;
      const navObserver = new MutationObserver(() => { if (!navQueued) { navQueued = true; setTimeout(() => { navQueued = false; markNav(); }, 100); } });
      navObserver.observe(document.body, {childList:true, subtree:true});
      markNav();
      ctx.effect(() => () => navObserver.disconnect(), "dsh-eye-comfort: settings icon");
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
    }
    return {apply, inject:["slots"]};
  }
});
```

</details>

**依据 7 · 源码核查**：[lib/index.js:153-159](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/index.js#L153-L159)

Host只必需webServer。

```text
export const inject = ["webServer"];

/** @param {any} ctx */
export async function apply(ctx) {
  const dispose = registerFontsRoute(ctx);
  return () => dispose();
}
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 启动、字体、保存与页面生效如何连接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

client apply启动即loadHostFonts，不是等打开设置才查询。GET /api/dsh-eye-comfort/fonts带same-origin凭据；Host校验分支后同步installedFonts：Windows PowerShell/GDI+、macOS system_profiler JSON递归_name、其他平台fc-list别名；设15/20秒timeout和4/16MiB输出上限，去重排序后module cache。失败缓存[]且仍200返回platform/fonts。客户端只请求一次且失败吞掉；非空Host列表优先，否则用候选字体对三类fallback、两组拉丁字符串的布局宽度差探测，随后也缓存。不是下载/安装字体或验证全部字形。

状态从固定dsh-codex-appearance/v1 localStorage读入，sanitize约束hex色、枚举、字体字符串、字号/宽度等数字；格式合法不等视觉合格。UI变更更新内存/通知listeners，即时保存或200ms合并迟写；没有远程配置/账号同步。选择浅色主题会重新seed浅色accent/background/foreground，深色下隐藏浅色卡；参数转换成light/dark token对，overrideTokens注册同名覆盖层，applyExtras创建/更新dca-theme-extras样式（含SVG data URI纹理/字体/私有选择器），没有远端生成/模型任务。

模式每次sync调用theme.setTheme(state.mode)，环境监听body data-ds-dark-theme及matchMedia深浅/减少动态，再重算token/CSS；设置页自己也观察body刷新。宽度滑块另走applyContentWidth：写宿主dsh.conversation.contentWidth，并给命中DOM写两个inline CSS变量，再把own state.contentWidth迟写；它不只是own token。已有清理函数会删除sync监听、body/media观察/监听、token覆盖和extras、断开导航observer；但这不是还原原生模式/宽度及全部DOM/存储，反例见Q03。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:94-138](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L94-L138)

一次Host查询/候选布局探测与缓存。

<details>
<summary>查看原文（45行）</summary>

```text
    let detectedFonts = null;
    // 宿主路由返回的真实系统字体清单。启动时拉一次；在它到达之前（或路由不可用时）
    // 仍用下面的实测候选表兜底，下拉永远不会空。
    let hostFonts = [];
    let hostFontsAsked = false;
    const fontSubscribers = new Set();
    function loadHostFonts() {
      if (hostFontsAsked) return;
      hostFontsAsked = true;
      fetch("/api/dsh-eye-comfort/fonts", { credentials: "same-origin", cache: "no-cache" })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!data || !Array.isArray(data.fonts)) return;
          hostFonts = data.fonts.filter((f) => typeof f === "string" && f.trim()).map((f) => f.trim());
          for (const notify of fontSubscribers) { try { notify(); } catch {} }
        })
        .catch(() => {});
    }
    function installedFontList() {
      if (hostFonts.length) return hostFonts;
      return detectInstalledFonts();
    }
    function detectInstalledFonts() {
      if (detectedFonts) return detectedFonts;
      // 测量需要真实布局；面板可能在 body 就绪前渲染，拿不到就退化为只用内置项，
      // 不要让字体探测把整个设置页拖崩。
      if (!document.body) return (detectedFonts = []);
      const span = document.createElement("span");
      span.style.cssText = "position:absolute;left:-9999px;top:-9999px;visibility:hidden;font-size:72px;white-space:nowrap;";
      document.body.appendChild(span);
      try {
        const widthOf = (family, baseline) => {
          span.style.fontFamily = `"${family}", ${baseline}`;
          return FONT_PROBE.map((t) => { span.textContent = t; return span.getBoundingClientRect().width; }).join("|");
        };
        const base = {};
        for (const [k, v] of Object.entries(FONT_BASELINES)) base[k] = widthOf("__dca_probe__", v);
        const available = [];
        for (const family of FONT_CANDIDATES) {
          const installed = Object.entries(FONT_BASELINES).some(([k, v]) => widthOf(family, v) !== base[k]);
          if (installed) available.push(family);
        }
        detectedFonts = available;
        return available;
      } finally {
```

</details>

**依据 2 · 源码核查**：[lib/index.js:26-82](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/index.js#L26-L82)

固定同步OS命令与timeout/buffer。

<details>
<summary>查看原文（57行）</summary>

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
  return out.split(/\r?\n/).map((name) => name.trim()).filter(Boolean);
}

/**
 * macOS: `system_profiler` reports the installed families. Linux: fontconfig's `fc-list`
 * is the authority and every desktop ships it. Both are plain text / JSON — no native deps.
 * @returns {string[] | null}
 */
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

**依据 3 · 源码核查**：[lib/index.js:84-104](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/index.js#L84-L104)

module缓存包括失败空表。

<details>
<summary>查看原文（21行）</summary>

```text
}

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
}
```

</details>

**依据 4 · 源码核查**：[lib/client.js:254-304](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L254-L304)

sanitize、即时与迟写、内存listeners。

<details>
<summary>查看原文（51行）</summary>

```text
    function fontValue(raw, fallback) {
      if (typeof raw !== "string") return fallback;
      if (FONTS[raw]) return raw;
      const name = raw.trim().slice(0, 80);
      if (!name || /[;{}\\<>]/.test(name) || /["']/.test(name)) return fallback;
      return name;
    }
    function sanitize(raw) {
      const x = raw && typeof raw === "object" ? raw : {};
      const palette = (v, base) => ({accent: hex(v?.accent, base.accent), background: hex(v?.background, base.background), foreground: hex(v?.foreground, base.foreground), uiFont:fontValue(v?.uiFont, "system"), contentFont:fontValue(v?.contentFont, "inherit"), codeFont:fontValue(v?.codeFont, "system")});
      return {
        mode: ["system", "light", "dark"].includes(x.mode) ? x.mode : DEFAULT.mode,
        separate: !!x.separate,
        theme: THEME_IDS.includes(x.theme) ? x.theme : "warm",
        accent: hex(x.accent, BLUE), background: hex(x.background, DEFAULT.background), foreground: hex(x.foreground, DEFAULT.foreground),
        light: palette(x.light, DEFAULT.light), dark: palette(x.dark, DEFAULT.dark),
        uiFont: fontValue(x.uiFont, "system"), contentFont: fontValue(x.contentFont, "inherit"), codeFont: fontValue(x.codeFont, "system"),
        uiSize: clamp(x.uiSize, 11, 20, 14), codeSize: clamp(x.codeSize, 10, 20, 12),
        contentWidth: clamp(x.contentWidth, 680, 1400, 920),
        fontStyle: ["normal", "compact", "comfortable"].includes(x.fontStyle) ? x.fontStyle : "normal",
        contentStyle: ["normal", "compact", "comfortable"].includes(x.contentStyle) ? x.contentStyle : "normal",
        codeStyle: ["normal", "compact", "comfortable"].includes(x.codeStyle) ? x.codeStyle : "normal",
        contrast: clamp(x.contrast, 0, 100, 40),
        reducedMotion: ["system", "on", "off"].includes(x.reducedMotion) ? x.reducedMotion : "system",
        paper: !!x.paper,
        paperStrength: clamp(x.paperStrength, 1, 100, 60)
      };
    }
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
    }
```

</details>

**依据 5 · 源码核查**：[lib/client.js:213-243](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L213-L243)

主题seed和原生宽度写入。

<details>
<summary>查看原文（31行）</summary>

```text
    function themeOf(s) { return THEMES[s.theme] || THEMES.warm; }
    // Picking a theme seeds the stored light palette with that theme's colours. Everything
    // downstream keeps reading s.light, so a theme switch and a manual colour edit travel the
    // same path — no second source of truth to keep in sync.
    function applyTheme(s, id) {
      const t = THEMES[id] || THEMES.warm;
      return {
        theme: id in THEMES ? id : "warm",
        light: {...s.light, accent: t.accent, background: t.content, foreground: t.foreground},
        accent: t.accent, foreground: t.foreground
      };
    }
    const listeners = new Set();
    // The transcript/composer width belongs to DSH: ConversationWidthControls owns
    // `dsh.conversation.contentWidth` and republishes an inline --dsh-chat-user-width from its
    // ResizeObserver, resolving it against the column width. That value is clamped to
    // [640, columnWidth - 176], so a request larger than the window can hold is reduced, and a
    // stylesheet rule can never win against the inline write. Hence: persist the preference,
    // then set the same inline variable for immediate effect.
    const WIDTH_KEY = "dsh.conversation.contentWidth";
    function applyContentWidth(px) {
      try { localStorage.setItem(WIDTH_KEY, String(px)); } catch {}
      for (const el of document.querySelectorAll('[class*="an3WzG_body"],[class*="an3WzG_root"]')) {
        el.style.setProperty("--dsh-chat-user-width", px + "px");
      }
      // The embedded transcript hard-codes its own min(100% - 32px, 920px), so it needs the
      // resolved width rather than the user-facing variable.
      for (const el of document.querySelectorAll('[class*="an3WzG_embeddedBody"]')) {
        el.style.setProperty("--dsh-chat-content-width", `min(${px}px, calc(100% - 32px))`);
      }
    }
```

</details>

**依据 6 · 源码核查**：[lib/client.js:317-356](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L317-L356)

light/dark token映射，不把注释色差当实测。

<details>
<summary>查看原文（40行）</summary>

```text
    function themeTokens(s) {
      const theme = themeOf(s);
      // Selecting a theme writes its palette into s.light (see applyTheme), so this reads the
      // theme's colours through the normal path — no special-casing for edited colours, and the
      // background stays the theme's flat base rather than the stored swatch.
      const light = {...activePalette(s, "light"), background: theme.base};
      const dark = activePalette(s, "dark");
      const pair = fn => ({light: fn(light, "light"), dark: fn(dark, "dark")});
      // The contrast slider used to reach the dark palette only, with coefficients so small the
      // whole 0→100 sweep moved a layer by 1–3% luminance — invisible. Both schemes now derive
      // their surfaces from it: light mixes toward the foreground (surfaces darken), dark mixes
      // toward its foreground while the base itself deepens. Scales are chosen so the extremes
      // stay readable (light keeps ≥8:1 body contrast, dark ≥6:1).
      const t = clamp(s.contrast, 0, 100, 40) / 100;
      const level = (p, scheme, tier) => {
        if (scheme === "light") {
          // Surfaces sit below the transcript colour, so "more contrast" means darker steps.
          const step = [[.015, .075], [.030, .105], [.050, .140], [.045, .130]][tier - 1];
          return mix(theme.content, p.foreground, step[0] + t * step[1]);
        }
        const step = [[.030, .040], [.050, .065], [.085, .085], [.090, .080]][tier - 1];
        return mix(p.background, p.foreground, step[0] + t * step[1]);
      };
      return {
        "--dsw-alias-brand-primary": pair(p => p.accent),
        "--dsw-alias-brand-primary-new-colorprimary-new-color": pair(p => p.accent),
        "--dsw-alias-brand-text": pair(p => p.accent),
        "--dsw-alias-bg-base": pair(p => p.background),
        "--dsw-alias-bg-layer-1": pair((p, scheme) => level(p, scheme, 1)),
        "--dsw-alias-bg-layer-2": pair((p, scheme) => level(p, scheme, 2)),
        "--dsw-alias-bg-layer-3": pair((p, scheme) => level(p, scheme, 3)),
        "--dsw-alias-bg-module-platform": pair((p, scheme) => scheme === "light" ? theme.platform : mix(p.background, p.foreground, .07)),
        // 代码块底色。浅色沿用 layer-4；深色不能再用 layer-4：那里它只比内容区亮
        // ΔL 2.20%、比普通卡片只高 1.15%，代码块看起来就是一块"稍微亮一点的卡片"，
        // 和正文区几乎分不开（用户反馈"深色下代码块颜色不明显"）。
        // 深色基准取内容区实际底色 mix(#1B2028, fg, .12)（与 applyExtras 的 darkContent 同式），
        // 在其上朝前景混 .16 —— 实测 ΔL 4.32%（vs 内容区）、3.27%（vs 卡片），
        // 仍低于控件层（相差 2.12%），层次保持单调递增。
        "--dsw-alias-markdown-code-block": pair((p, scheme) => scheme === "light"
          ? level(p, scheme, 4)
```

</details>

**依据 7 · 源码核查**：[lib/client.js:482-510](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L482-L510)

extras/纸纹参数与生成接点。

<details>
<summary>查看原文（29行）</summary>

```text
    function applyExtras(s, suppressMotion) {
      const scheme = effectiveScheme(s);
      const fonts = s.separate ? s[scheme] : s;
      const palette = activePalette(s, scheme);
      const theme = themeOf(s);
      // Inline code sits one tier deeper than a code block, and follows the same slider so the
      // setting feels consistent in both schemes.
      const ct = clamp(s.contrast, 0, 100, 40) / 100;
      const inlineCodeBg = scheme === "light"
        ? mix(theme.content, palette.foreground, .060 + ct * .150)
        : mix(palette.background, palette.foreground, .095 + ct * .095);
      let style = document.getElementById("dca-theme-extras");
      if (!style) { style = document.createElement("style"); style.id = "dca-theme-extras"; document.head.appendChild(style); }
      const density = s.contentStyle === "compact" ? 1.25 : s.contentStyle === "comfortable" ? 1.65 : 1.45;
      // 代码块的字体样式走 DSH 的变量链，而不是 pre/code 上的 line-height：
      //   --dsw-font-markdown-code-block = <size> / calc(19px + var(--dsh-code-font-delta)) <family>
      //   --dsh-code-font-delta = calc(var(--dsh-code-font-size,11px) - 11px)
      // 组件用 `font:` 简写消费它，简写会重置 line-height，写在 pre/code 上的 line-height
      // 一律被覆盖——之前代码字体样式"不生效"就是这个原因。基准行高 19px：
      // 紧凑 17px、常规 19px、舒适 22px，通过 --dsh-code-font-delta 反推字号增量。
      const codeDelta = s.codeStyle === "compact" ? -2 : s.codeStyle === "comfortable" ? 3 : 0;
      // 纸张质感：纹理自带主题底色，所以每个「纸面」要用它自己实际的底色生成一张。
      // 只画在内容区/侧栏/卡片上，绝不动 --dsw-specific-sidebar-fill：
      // 那个 token 由原生标题栏读取，带 alpha 会让窗口边框花掉。
      const paperOn = !!s.paper;
      // 强度 → 亮度抖动幅度（相对值）。实测（Edge 渲染 + 像素统计，P5-P95 色阶差 / 255）：
      //   浅色 amp 0.010≈16、0.016≈26（明显纸纤维）、0.022≈33（较强）、0.030≈42（开始发脏）
      //   深色同样 amp 的可见度只有浅色的 1/3（暗部对绝对抖动不敏感），系数放大 3 倍。
      // 100% 定在「明显但仍是纸」：浅 0.022、深 0.066。默认 60% 约浅 0.013（一眼能看出质感）。
```

</details>

**依据 8 · 源码核查**：[lib/client.js:875-898](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L875-L898)

设置页字体订阅与body观察清理。

<details>
<summary>查看原文（24行）</summary>

```text
    function SettingsPage() {
      const [s, patch] = useSettings();
      // 字体清单来自宿主路由（真实系统字体，可能异步到达），到达后触发一次重渲染。
      const [, bumpFonts] = React.useState(0);
      React.useEffect(() => {
        loadHostFonts();
        const notify = () => bumpFonts((n) => n + 1);
        fontSubscribers.add(notify);
        return () => { fontSubscribers.delete(notify); };
      }, []);
      // 「跟随系统」时，真正生效的深浅色由 DSH 写在 body 上的属性决定（见 effectiveScheme）。
      // 系统主题切换后该属性会变，但 React 不会因此重渲染，设置页就会停在旧状态
      // （表现为"护眼主题"该出现时不出现、该隐藏时不隐藏）。监听属性变化强制重算一次。
      React.useEffect(() => {
        if (s.mode !== "system" || !document.body) return;
        const mo = new MutationObserver(() => bumpFonts((n) => n + 1));
        mo.observe(document.body, { attributes: true, attributeFilter: ["data-ds-dark-theme"] });
        return () => mo.disconnect();
      }, [s.mode]);
      const scheme = effectiveScheme(s);
      const theme = themeOf(s);
      const editable = activePalette(s, scheme);
      const fontValue = field => s.separate ? s[scheme][field] : s[field];
      const changeFont = (field, value) => s.separate ? patch({[scheme]:{...s[scheme],[field]:value}}) : patch({[field]:value});
```

</details>

**依据 9 · 源码核查**：[lib/client.js:952-994](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L952-L994)

startup真正caller、主题/环境监听及disposer。

<details>
<summary>查看原文（43行）</summary>

```text
    function apply(ctx) {
      injectCss();
      // 启动即拉取一次系统字体，用户打开设置页时列表已经就绪。
      loadHostFonts();
      const markNav = () => { for (const button of document.querySelectorAll('[data-shortcut-modal="settings"] nav button')) if (button.textContent.trim() === "外观" && button.dataset.dcaAppearanceNav !== "true") button.dataset.dcaAppearanceNav = "true"; };
      let navQueued = false;
      const navObserver = new MutationObserver(() => { if (!navQueued) { navQueued = true; setTimeout(() => { navQueued = false; markNav(); }, 100); } });
      navObserver.observe(document.body, {childList:true, subtree:true});
      markNav();
      ctx.effect(() => () => navObserver.disconnect(), "dsh-eye-comfort: settings icon");
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
    }
    return {apply, inject:["slots"]};
  }
});
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些可恢复、字体和适配承诺需要收窄？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

退出不是完整回滚。sync调用theme.setTheme但从未保存原模式；width滑块写宿主键和inline变量，清理只移除token/extras与监听，没有恢复原mode/原生width键或inline值。重置按钮仅setState(DEFAULT)，不会调用applyContentWidth；own宽度可回920而原生偏好/已有inline仍旧值。pending迟写也未被即时保存/重置取消，若200ms窗口内有后续即时修改，旧pending可再写storage，与新内存分叉。这是明确调用顺序/可能竞态，未作真实复现；不能称卸载/重置即原样。

自己的固定存储键与原生width键没有profile/user命名空间，只依赖浏览器origin/partition隔离；同源多窗没有storage监听/版本冲突处理，跨设备/跨profile是否共享由Host环境决定，不作自动同步或独占保证。localStorage写失败被吞，UI即时生效不证明已持久。导航style/标记与已排队的timer/RAF也没有成套取消/恢复，不能把观察器disconnect等同每个副作用消失。

额外CSS不仅用稳定token：HOHHba、K5rwea、an3WzG等私有类片段加!important，Host升级/组件布局可能失配或误命中，非每次构建必坏。减少动态作用body所有元素/伪元素的duration/scroll，不只是本插件；对比度滑块只是混色，用户可选低差/同色组合，没有运行时对比率/字形可读性校验，注释8:1/6:1与截图不是任意设置下合规或健康证据。

Host字体清单不是远程浏览器已装字体清单：route只返回名字/platform，不传字体文件；非空Host列表会跳过浏览器候选探测，因此远程机器不同、Mac收集_name或候选宽度相同/无中文字形时，名称不保证实际family/字形可用。未命中缓存的字体查询会同步占住Host事件循环，慢/失败时可能等到声明timeout，实际时长未测；失败module cache和client Asked标志都无刷新入口，刷新面板不等重探。

准入有边界：请求已进入本handler后，connection.admit缺失仍继续到字体枚举返回；存在时只同步调用，抛错403、返回对象含rejection才拒绝。未校验其余未知形态/未await异步返回，不是未知身份一律拒绝；当前Host具体合同/外层Host-Origin/网络范围未核，不能继承注释“另一网站不能读”或反称已匿名泄露。GET与HEAD都会在回应前触发installedFonts；命令参数固定，不是路由允许任意shell执行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:232-243](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L232-L243)

原生存储与inline副作用。

<details>
<summary>查看原文（12行）</summary>

```text
    const WIDTH_KEY = "dsh.conversation.contentWidth";
    function applyContentWidth(px) {
      try { localStorage.setItem(WIDTH_KEY, String(px)); } catch {}
      for (const el of document.querySelectorAll('[class*="an3WzG_body"],[class*="an3WzG_root"]')) {
        el.style.setProperty("--dsh-chat-user-width", px + "px");
      }
      // The embedded transcript hard-codes its own min(100% - 32px, 920px), so it needs the
      // resolved width rather than the user-facing variable.
      for (const el of document.querySelectorAll('[class*="an3WzG_embeddedBody"]')) {
        el.style.setProperty("--dsh-chat-content-width", `min(${px}px, calc(100% - 32px))`);
      }
    }
```

</details>

**依据 2 · 源码核查**：[lib/client.js:283-303](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L283-L303)

pending没有被即时写/重置取消、持久失败吞。

<details>
<summary>查看原文（21行）</summary>

```text
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

**依据 3 · 源码核查**：[lib/client.js:924-951](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L924-L951)

width真正caller与只setState的重置。

<details>
<summary>查看原文（28行）</summary>

```text
          row("代码字体大小",numberRowWrap("codeSize","代码字体大小","调整聊天和差异视图中的代码字号",10,20)),
          row("内容宽度",h("div",{style:{display:"flex",alignItems:"center",gap:8}},
            h("input",{className:"dca-slider",type:"range",min:680,max:1400,step:20,value:s.contentWidth,"aria-label":"内容宽度",onChange:e=>{
              // DSH owns this width: it writes --dsh-chat-user-width inline on every resize from
              // its own localStorage preference, and deletes that inline variable whenever the
              // preference is absent. Fighting that with CSS never worked, so the slider updates
              // DSH's own preference key and dispatches resize so its ResizeObserver republishes.
              const px = Number(e.target.value);
              applyContentWidth(px);
              patch({contentWidth:px},true);
            }}),
            h("span",{className:"dca-muted",style:{minWidth:"52px",textAlign:"right"}},s.contentWidth+" px")),"输入框与正文的最大宽度；拖拽正文两侧边缘可临时覆盖")),
        h("div",{className:"dca-card"},
          row("减少动态效果",choice(s.reducedMotion,v=>patch({reducedMotion:v}),[["system","系统"],["on","开启"],["off","关闭"]],"减少动态效果"),"减少动画效果或匹配系统设置"),
          row("纸张质感",switcher(s.paper,v=>patch({paper:v}),"纸张质感"),"在内容区、侧栏与卡片上叠一层极淡的纸张颗粒（不影响原生标题栏）"),
          s.paper ? row("颗粒强度",h("div",{style:{display:"flex",alignItems:"center",gap:8}},
            h(Slider,{value:s.paperStrength,onChange:v=>patch({paperStrength:v},true),label:"颗粒强度"}),
            h("span",{className:"dca-muted",style:{minWidth:"36px",textAlign:"right"}},String(s.paperStrength))),"数值越大颗粒越明显；建议 40–70，再高接近砂纸") : null,
          row("分别设置浅色和深色模式",switcher(s.separate,v=>patch({separate:v}),"分别设置浅色和深色模式"),"分别选择各自的颜色和字体")),
        h("div",{className:"dca-card"},
          row("界面字体样式",choice(s.fontStyle,v=>patch({fontStyle:v}),[["normal","常规"],["compact","紧凑"],["comfortable","舒适"]],"界面字体样式")),
          row("内容字体",choice(fontValue("contentFont"),v=>changeFont("contentFont",v),fontOpts,"内容字体")),
          row("内容字体样式",choice(s.contentStyle,v=>patch({contentStyle:v}),[["normal","常规"],["compact","紧凑"],["comfortable","舒适"]],"内容字体样式")),
          row("代码字体",choice(fontValue("codeFont"),v=>changeFont("codeFont",v),fontOpts,"代码字体")),
          row("代码字体样式",choice(s.codeStyle,v=>patch({codeStyle:v}),[["normal","常规"],["compact","紧凑"],["comfortable","舒适"]],"代码字体样式")),
          row("对比度",h("div",{style:{display:"flex",alignItems:"center",gap:8}},h(Slider,{value:s.contrast,onChange:v=>patch({contrast:v},true),label:"对比度"}),h("span",null,s.contrast)))) ,
        h("div",{className:"dca-actions"},h("button",{className:"dca-button",type:"button",onClick:()=>setState(DEFAULT)},"重置为默认设置")));
    }
```

</details>

**依据 4 · 源码核查**：[lib/client.js:952-990](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L952-L990)

setTheme无旧值保存、清理范围/排队任务。

<details>
<summary>查看原文（39行）</summary>

```text
    function apply(ctx) {
      injectCss();
      // 启动即拉取一次系统字体，用户打开设置页时列表已经就绪。
      loadHostFonts();
      const markNav = () => { for (const button of document.querySelectorAll('[data-shortcut-modal="settings"] nav button')) if (button.textContent.trim() === "外观" && button.dataset.dcaAppearanceNav !== "true") button.dataset.dcaAppearanceNav = "true"; };
      let navQueued = false;
      const navObserver = new MutationObserver(() => { if (!navQueued) { navQueued = true; setTimeout(() => { navQueued = false; markNav(); }, 100); } });
      navObserver.observe(document.body, {childList:true, subtree:true});
      markNav();
      ctx.effect(() => () => navObserver.disconnect(), "dsh-eye-comfort: settings icon");
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

**依据 5 · 源码核查**：[lib/client.js:646-681](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L646-L681)

构建类名/important兼容CSS实例。

<details>
<summary>查看原文（36行）</summary>

```text
        body button[class*="_newSession"] :is(kbd, [class*="_key_"]) { background: transparent !important; color: ${mix(theme.foreground, theme.content, .22)} !important; }
        /* DSH 更新后整个 UI 包重新构建，类名哈希从 hIlkoa_* 换成 wnFoaW_*（从 app.asar
           导出的完整清单确认：sessionRow/selected/searchResultRow 同属 wnFoaW 模块），
           旧选择器全部失配，选中行回落到原生 var(--dsw-alias-interactive-bg-hover)
           （浅色 3% alpha），肉眼几乎不可见。选中色同时加深：sidebarSelected 与侧栏
           底色每通道只差 ≈10，改为朝前景混 .12 —— 与设置页导航选中态同一档位（ΔL≈20%）。 */
        body [class*="wnFoaW_sessionRow"][class*="wnFoaW_selected"] { background: ${mix(theme.sidebarSelected, theme.foreground, .12)} !important; }
        body [class*="wnFoaW_sessionRow"]:hover:not([class*="wnFoaW_selected"]) { background: ${theme.sidebarRowHover} !important; }
        body [class*="wnFoaW_searchResultRow"][class*="wnFoaW_selected"] { background: ${mix(theme.sidebarSelected, theme.foreground, .12)} !important; }` : `/* 深色分支：上面那一整组覆盖原本只在浅色下生成，深色下这些表面全部退回 DSH 的
             静态 token。其中「修改文件」卡片（HOHHba_card）底色是 --dsw-alias-bg-layer-1，
             深色默认 #232324（近纯黑），而内容区是 ${darkContent} —— 卡片在明亮的正文区上
             就是一块黑斑（用户反馈"修改文件代码块是黑色的"）。这里按同样的语义补一套
             深色值：面板=内容区色，卡片/控件逐级提亮，与 ui.card / ui.control 同源。 */
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
        body[data-ds-dark-theme] [class*="K5rwea_fileIcon"] { background: color-mix(in srgb, ${palette.foreground} 6%, transparent) !important; border-color: ${ui.border} !important; }
        body [class*="HOHHba_row"], body [class*="HOHHba_path"], body [class*="HOHHba_counts"] { color: ${mix(palette.foreground, darkContent, .34)} !important; }
        body [class*="HOHHba_list"] { border-top-color: ${ui.border}; }
        body [class*="xeixwq_split"], body [class*="xeixwq_details"], body [class*="eciBTa_root"], body [class*="eciBTa_ledger"], body [class*="Wd4N7W_root"], body [class*="xeixwq_trajectory"], body [class*="xeixwq_table"], body [class*="xeixwq_assistantOutput"], body [class*="xeixwq_programPanel"], body [class*="xeixwq_programSource"], body [class*="xeixwq_schema"], body [class*="xeixwq_promptDiff"], body [class*="xeixwq_overviewHeading"], body [class*="xeixwq_overviewPreview"], body [class*="xeixwq_historyLoadButton"], body [class*="xeixwq_historyLoadingBar"] { background: ${ui.panel} !important; --dsw-alias-bg-layer-1: ${ui.panel}; --dsw-alias-bg-layer-2: ${ui.card}; --dsw-alias-bg-layer-3: ${ui.control}; --dsw-alias-border-l2: ${ui.border}; --dsw-alias-border-l3: ${ui.border}; --dsw-alias-border-l4: ${ui.border}; }
        body [class*="xeixwq_turnLabel"], body [class*="xeixwq_systemNeutral"], body [class*="xeixwq_compacted"], body [class*="Wd4N7W_search"], body [class*="xeixwq_table"] th { background: ${ui.control} !important; border-color: ${ui.border} !important; }
        body [class*="Wd4N7W_search"]:focus-within { background: ${ui.card} !important; }`}
```

</details>

**依据 6 · 源码核查**：[lib/client.js:788-800](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L788-L800)

减少动态全body作用。

<details>
<summary>查看原文（13行）</summary>

```text
        body [class*="_item_4ub78_"]:hover:not(:disabled),
        body [class*="_item_4ub78_"]:focus-visible:not(:disabled),
        body [class*="_selectedFill_4ub78_"],
        body [class*="pc3rQa_item"][class*="pc3rQa_active"],
        body [class*="9r0rkG_option"]:hover:not([class*="9r0rkG_optionCopy"]):not(:disabled),
        body [class*="9r0rkG_option"]:focus-visible:not([class*="9r0rkG_optionCopy"]),
        body [class*="9r0rkG_optionActive"]:not(:disabled) {
          background: ${scheme === "light"
            ? mix(theme.bubble, theme.foreground, .12)
            : mix(mix(mix("#1B2028", palette.foreground, .12), palette.foreground, .16), palette.foreground, .16)} !important; }
        ${suppressMotion ? 'body *, body *::before, body *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }' : ''}
      `;
    }
```

</details>

**依据 7 · 源码核查**：[lib/client.js:261-280](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L261-L280)

只做值形状/范围sanitize，非视觉校验。

<details>
<summary>查看原文（20行）</summary>

```text
    function sanitize(raw) {
      const x = raw && typeof raw === "object" ? raw : {};
      const palette = (v, base) => ({accent: hex(v?.accent, base.accent), background: hex(v?.background, base.background), foreground: hex(v?.foreground, base.foreground), uiFont:fontValue(v?.uiFont, "system"), contentFont:fontValue(v?.contentFont, "inherit"), codeFont:fontValue(v?.codeFont, "system")});
      return {
        mode: ["system", "light", "dark"].includes(x.mode) ? x.mode : DEFAULT.mode,
        separate: !!x.separate,
        theme: THEME_IDS.includes(x.theme) ? x.theme : "warm",
        accent: hex(x.accent, BLUE), background: hex(x.background, DEFAULT.background), foreground: hex(x.foreground, DEFAULT.foreground),
        light: palette(x.light, DEFAULT.light), dark: palette(x.dark, DEFAULT.dark),
        uiFont: fontValue(x.uiFont, "system"), contentFont: fontValue(x.contentFont, "inherit"), codeFont: fontValue(x.codeFont, "system"),
        uiSize: clamp(x.uiSize, 11, 20, 14), codeSize: clamp(x.codeSize, 10, 20, 12),
        contentWidth: clamp(x.contentWidth, 680, 1400, 920),
        fontStyle: ["normal", "compact", "comfortable"].includes(x.fontStyle) ? x.fontStyle : "normal",
        contentStyle: ["normal", "compact", "comfortable"].includes(x.contentStyle) ? x.contentStyle : "normal",
        codeStyle: ["normal", "compact", "comfortable"].includes(x.codeStyle) ? x.codeStyle : "normal",
        contrast: clamp(x.contrast, 0, 100, 40),
        reducedMotion: ["system", "on", "off"].includes(x.reducedMotion) ? x.reducedMotion : "system",
        paper: !!x.paper,
        paperStrength: clamp(x.paperStrength, 1, 100, 60)
      };
```

</details>

**依据 8 · 源码核查**：[lib/client.js:94-138](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L94-L138)

Host优先/一次请求/候选布局测量非完整字形验证。

<details>
<summary>查看原文（45行）</summary>

```text
    let detectedFonts = null;
    // 宿主路由返回的真实系统字体清单。启动时拉一次；在它到达之前（或路由不可用时）
    // 仍用下面的实测候选表兜底，下拉永远不会空。
    let hostFonts = [];
    let hostFontsAsked = false;
    const fontSubscribers = new Set();
    function loadHostFonts() {
      if (hostFontsAsked) return;
      hostFontsAsked = true;
      fetch("/api/dsh-eye-comfort/fonts", { credentials: "same-origin", cache: "no-cache" })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!data || !Array.isArray(data.fonts)) return;
          hostFonts = data.fonts.filter((f) => typeof f === "string" && f.trim()).map((f) => f.trim());
          for (const notify of fontSubscribers) { try { notify(); } catch {} }
        })
        .catch(() => {});
    }
    function installedFontList() {
      if (hostFonts.length) return hostFonts;
      return detectInstalledFonts();
    }
    function detectInstalledFonts() {
      if (detectedFonts) return detectedFonts;
      // 测量需要真实布局；面板可能在 body 就绪前渲染，拿不到就退化为只用内置项，
      // 不要让字体探测把整个设置页拖崩。
      if (!document.body) return (detectedFonts = []);
      const span = document.createElement("span");
      span.style.cssText = "position:absolute;left:-9999px;top:-9999px;visibility:hidden;font-size:72px;white-space:nowrap;";
      document.body.appendChild(span);
      try {
        const widthOf = (family, baseline) => {
          span.style.fontFamily = `"${family}", ${baseline}`;
          return FONT_PROBE.map((t) => { span.textContent = t; return span.getBoundingClientRect().width; }).join("|");
        };
        const base = {};
        for (const [k, v] of Object.entries(FONT_BASELINES)) base[k] = widthOf("__dca_probe__", v);
        const available = [];
        for (const family of FONT_CANDIDATES) {
          const installed = Object.entries(FONT_BASELINES).some(([k, v]) => widthOf(family, v) !== base[k]);
          if (installed) available.push(family);
        }
        detectedFonts = available;
        return available;
      } finally {
```

</details>

**依据 9 · 源码核查**：[lib/index.js:49-104](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/index.js#L49-L104)

Mac_name/fc-list与失败cache。

<details>
<summary>查看原文（56行）</summary>

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
  }
}

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
}
```

</details>

**依据 10 · 源码核查**：[lib/index.js:115-151](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/index.js#L115-L151)

可选/同步admit、仅特定rejection、HEAD亦枚举。

<details>
<summary>查看原文（37行）</summary>

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
    },
  });
}
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、用法和四阶段投入如何衡量？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

无需模型key或远端生成服务不等无成本；本插件自有网络用途是同源字体查询，源码未见把会话正文发往供应商。

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22.19、Host webServer，DSH主题/设置接口 | 相应半侧必需 | 路由、token及设置section | 无DSH engine闸门；缺theme可有设置入口但无token/extras效果 |
| slots/React、DOM、localStorage/matchMedia | 客户端必需 | 配置、生效、系统模式和保存 | 存储失败静默；没有跨设备/账号恢复 |
| Windows PowerShell/GDI+或Mac system_profiler/Linux fc-list | 完整Host字体可选 | 同机字体枚举 | 缺失/超时缓存[]，浏览器退候选/手填，不是完整清单 |
| 当前Host admit/外层请求与网络边界 | 字体信息准入条件 | 控制Host平台/字体名字访问 | 组件内方法缺失放行，未知返回形态不统一拒；需核当前Host |
| 宿主token/私有类名、原生mode/width与单主题约定 | 预期外观/恢复必需 | 区域样式/宽度/退出 | Host变化、多覆盖和双偏好可失配，不保证原样恢复 |

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 首次 | 用户在同机个人隔离Host/profile/浏览器环境核服务/准入，记录原模式/宽度和两个存储键 | 先有手工恢复路径；不把README安装/截图当本轮验收 |
| 选择 | 一次只改少量颜色/字体/字号，纸纹先关；核对话、代码、输入/焦点和改动卡 | 看真实文字/控制可操作，不以色卡/对比度数值代替 |
| 持续 | 用户复开/刷新后核保存、原生宽度与插件显示一致；升级前回归私有CSS/主题共存 | 不符先回原生设置，别用继续改参数掩盖未决状态 |
| 恢复/退出 | 等待迟写、保全偏好，禁用后手工核/恢复Host模式、原生width键与已写inline/浏览器状态 | 重置不等回滚；字体缓存重探需模块/进程重载并核，必要还原隔离环境 |

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地环境/字体同步命令、布局测量 | 查接口、准入、旧值和调参/页面检查 | 没有插件订阅/模型计费代码；现金/真实耗时未测，不报零总成本 |
| 持续使用 | localStorage/DOM监听、CSS/可选SVG纹理渲染 | 宿主升级与页面/字体适配 | CPU/内存/耗电/阅读净收益未知，功能多不证明更省 |
| 失败恢复 | 重载/重探字体、偏好备份与样式恢复 | 查两个键、原生模式/width、pending与多窗覆盖 | declared15/20秒timeout非实测；缓存空不等系统没字体 |
| 退出或替换 | 本地偏好/DOM与native设置残留 | 禁用并手工核/恢复原值、改原生设置/简单主题 | 无全副作用回滚/账号同步，不承诺卸载即原状 |

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 个人细调 | 颜色/多区域字体/字号、纸纹、模式参数有实现 | 用户偏好、操作/阅读错误改善及当前全界面适配 |
| 字体选择 | 固定OS枚举/缓存与候选fallback | 浏览器实际family/中文字形、远程一致性及首次延时 |
| 保存/退出 | own storage、token/observer部分清理 | native偏好恢复/迟写/多窗，完整禁用效果 |
| 可读性 | 对比度/减少动态控制可配置 | 真实对比率/无障碍/健康收益，不能由名称或注释推出 |

比较单位是读完并正确操作一次真实页面任务，包含调参、检查和升级/退出人工；没有客观阅读实验/价格或资源测量，不计算ROI/健康效果。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:21-25](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/package.json#L21-L25)

界面模块与Node声明。

```text
    "bundle": {"patch": "./cordis.patch.yml"},
    "client": {"inject": ["@deepseek-ai/dsh-client-ui-theme", "@deepseek-ai/dsh-client-ui-settings-general", "@deepseek-ai/dsh-client-ui-renderer"], "platform": "web"}
  },
  "engines": {"node": ">=22.19"}
}
```

**依据 2 · 源码核查**：[lib/index.js:26-82](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/index.js#L26-L82)

字体命令声明timeout/buffer，而非实测。

<details>
<summary>查看原文（57行）</summary>

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
  return out.split(/\r?\n/).map((name) => name.trim()).filter(Boolean);
}

/**
 * macOS: `system_profiler` reports the installed families. Linux: fontconfig's `fc-list`
 * is the authority and every desktop ships it. Both are plain text / JSON — no native deps.
 * @returns {string[] | null}
 */
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

**依据 3 · 源码核查**：[lib/index.js:115-159](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/index.js#L115-L159)

路由/准入/Host生命周期。

<details>
<summary>查看原文（45行）</summary>

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
    },
  });
}

export const inject = ["webServer"];

/** @param {any} ctx */
export async function apply(ctx) {
  const dispose = registerFontsRoute(ctx);
  return () => dispose();
}
```

</details>

**依据 4 · 源码核查**：[lib/client.js:232-243](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L232-L243)

恢复需要处理原生偏好。

<details>
<summary>查看原文（12行）</summary>

```text
    const WIDTH_KEY = "dsh.conversation.contentWidth";
    function applyContentWidth(px) {
      try { localStorage.setItem(WIDTH_KEY, String(px)); } catch {}
      for (const el of document.querySelectorAll('[class*="an3WzG_body"],[class*="an3WzG_root"]')) {
        el.style.setProperty("--dsh-chat-user-width", px + "px");
      }
      // The embedded transcript hard-codes its own min(100% - 32px, 920px), so it needs the
      // resolved width rather than the user-facing variable.
      for (const el of document.querySelectorAll('[class*="an3WzG_embeddedBody"]')) {
        el.style.setProperty("--dsh-chat-content-width", `min(${px}px, calc(100% - 32px))`);
      }
    }
```

</details>

**依据 5 · 源码核查**：[lib/client.js:283-303](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L283-L303)

保存/迟写分支。

<details>
<summary>查看原文（21行）</summary>

```text
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

**依据 6 · 源码核查**：[lib/client.js:952-990](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L952-L990)

生效与部分清理机制。

<details>
<summary>查看原文（39行）</summary>

```text
    function apply(ctx) {
      injectCss();
      // 启动即拉取一次系统字体，用户打开设置页时列表已经就绪。
      loadHostFonts();
      const markNav = () => { for (const button of document.querySelectorAll('[data-shortcut-modal="settings"] nav button')) if (button.textContent.trim() === "外观" && button.dataset.dcaAppearanceNav !== "true") button.dataset.dcaAppearanceNav = "true"; };
      let navQueued = false;
      const navObserver = new MutationObserver(() => { if (!navQueued) { navQueued = true; setTimeout(() => { navQueued = false; markNav(); }, 100); } });
      navObserver.observe(document.body, {childList:true, subtree:true});
      markNav();
      ctx.effect(() => () => navObserver.disconnect(), "dsh-eye-comfort: settings icon");
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

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些先修，什么方向才值得继续试？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

先修原生mode/width回滚、重置/迟写一致性与字体准入/来源说明；这是基本正确性，不包装成新创新。当前themeTokens与applyExtras已分函数、已有深浅/减少动态监听和字体fallback，也不能再提“加分层/加系统监听/加字体列表”就算新增。

未验证候选是把稳定token作为可独立使用的基础层，把私有CSS兼容覆盖真正做成可关闭/可识别适配的层，并在对应页面/控件确已挂载后提示选择器失配、退回原生/稳定色层。不能把虚拟列表/未打开卡片的零匹配当失配，更不能静默宣称全覆盖。先比较更简单的只用原生设置或仅token、不检测也不加兼容层是否足够。

最小对照用两份可获得的固定Host构建，实际打开对话/代码/输入聚焦/改动卡片及深浅模式，比较现版、仅token和最小兼容提示方案。测失配发现时间、样式修复量、操作/阅读错误、噪声提示与恢复人时，字体/偏好保持一致；健康收益不在实验宣称内。如果仅token已够用、提示误报或维护负担更高且无实质错误减少，就否定独立兼容层产品方向。少量固定界面可能适合原生贡献/简单主题，不预设需要新平台。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:317-356](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L317-L356)

已有token函数/层。

<details>
<summary>查看原文（40行）</summary>

```text
    function themeTokens(s) {
      const theme = themeOf(s);
      // Selecting a theme writes its palette into s.light (see applyTheme), so this reads the
      // theme's colours through the normal path — no special-casing for edited colours, and the
      // background stays the theme's flat base rather than the stored swatch.
      const light = {...activePalette(s, "light"), background: theme.base};
      const dark = activePalette(s, "dark");
      const pair = fn => ({light: fn(light, "light"), dark: fn(dark, "dark")});
      // The contrast slider used to reach the dark palette only, with coefficients so small the
      // whole 0→100 sweep moved a layer by 1–3% luminance — invisible. Both schemes now derive
      // their surfaces from it: light mixes toward the foreground (surfaces darken), dark mixes
      // toward its foreground while the base itself deepens. Scales are chosen so the extremes
      // stay readable (light keeps ≥8:1 body contrast, dark ≥6:1).
      const t = clamp(s.contrast, 0, 100, 40) / 100;
      const level = (p, scheme, tier) => {
        if (scheme === "light") {
          // Surfaces sit below the transcript colour, so "more contrast" means darker steps.
          const step = [[.015, .075], [.030, .105], [.050, .140], [.045, .130]][tier - 1];
          return mix(theme.content, p.foreground, step[0] + t * step[1]);
        }
        const step = [[.030, .040], [.050, .065], [.085, .085], [.090, .080]][tier - 1];
        return mix(p.background, p.foreground, step[0] + t * step[1]);
      };
      return {
        "--dsw-alias-brand-primary": pair(p => p.accent),
        "--dsw-alias-brand-primary-new-colorprimary-new-color": pair(p => p.accent),
        "--dsw-alias-brand-text": pair(p => p.accent),
        "--dsw-alias-bg-base": pair(p => p.background),
        "--dsw-alias-bg-layer-1": pair((p, scheme) => level(p, scheme, 1)),
        "--dsw-alias-bg-layer-2": pair((p, scheme) => level(p, scheme, 2)),
        "--dsw-alias-bg-layer-3": pair((p, scheme) => level(p, scheme, 3)),
        "--dsw-alias-bg-module-platform": pair((p, scheme) => scheme === "light" ? theme.platform : mix(p.background, p.foreground, .07)),
        // 代码块底色。浅色沿用 layer-4；深色不能再用 layer-4：那里它只比内容区亮
        // ΔL 2.20%、比普通卡片只高 1.15%，代码块看起来就是一块"稍微亮一点的卡片"，
        // 和正文区几乎分不开（用户反馈"深色下代码块颜色不明显"）。
        // 深色基准取内容区实际底色 mix(#1B2028, fg, .12)（与 applyExtras 的 darkContent 同式），
        // 在其上朝前景混 .16 —— 实测 ΔL 4.32%（vs 内容区）、3.27%（vs 卡片），
        // 仍低于控件层（相差 2.12%），层次保持单调递增。
        "--dsw-alias-markdown-code-block": pair((p, scheme) => scheme === "light"
          ? level(p, scheme, 4)
```

</details>

**依据 2 · 源码核查**：[lib/client.js:646-681](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L646-L681)

私有选择器兼容范围。

<details>
<summary>查看原文（36行）</summary>

```text
        body button[class*="_newSession"] :is(kbd, [class*="_key_"]) { background: transparent !important; color: ${mix(theme.foreground, theme.content, .22)} !important; }
        /* DSH 更新后整个 UI 包重新构建，类名哈希从 hIlkoa_* 换成 wnFoaW_*（从 app.asar
           导出的完整清单确认：sessionRow/selected/searchResultRow 同属 wnFoaW 模块），
           旧选择器全部失配，选中行回落到原生 var(--dsw-alias-interactive-bg-hover)
           （浅色 3% alpha），肉眼几乎不可见。选中色同时加深：sidebarSelected 与侧栏
           底色每通道只差 ≈10，改为朝前景混 .12 —— 与设置页导航选中态同一档位（ΔL≈20%）。 */
        body [class*="wnFoaW_sessionRow"][class*="wnFoaW_selected"] { background: ${mix(theme.sidebarSelected, theme.foreground, .12)} !important; }
        body [class*="wnFoaW_sessionRow"]:hover:not([class*="wnFoaW_selected"]) { background: ${theme.sidebarRowHover} !important; }
        body [class*="wnFoaW_searchResultRow"][class*="wnFoaW_selected"] { background: ${mix(theme.sidebarSelected, theme.foreground, .12)} !important; }` : `/* 深色分支：上面那一整组覆盖原本只在浅色下生成，深色下这些表面全部退回 DSH 的
             静态 token。其中「修改文件」卡片（HOHHba_card）底色是 --dsw-alias-bg-layer-1，
             深色默认 #232324（近纯黑），而内容区是 ${darkContent} —— 卡片在明亮的正文区上
             就是一块黑斑（用户反馈"修改文件代码块是黑色的"）。这里按同样的语义补一套
             深色值：面板=内容区色，卡片/控件逐级提亮，与 ui.card / ui.control 同源。 */
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
        body[data-ds-dark-theme] [class*="K5rwea_fileIcon"] { background: color-mix(in srgb, ${palette.foreground} 6%, transparent) !important; border-color: ${ui.border} !important; }
        body [class*="HOHHba_row"], body [class*="HOHHba_path"], body [class*="HOHHba_counts"] { color: ${mix(palette.foreground, darkContent, .34)} !important; }
        body [class*="HOHHba_list"] { border-top-color: ${ui.border}; }
        body [class*="xeixwq_split"], body [class*="xeixwq_details"], body [class*="eciBTa_root"], body [class*="eciBTa_ledger"], body [class*="Wd4N7W_root"], body [class*="xeixwq_trajectory"], body [class*="xeixwq_table"], body [class*="xeixwq_assistantOutput"], body [class*="xeixwq_programPanel"], body [class*="xeixwq_programSource"], body [class*="xeixwq_schema"], body [class*="xeixwq_promptDiff"], body [class*="xeixwq_overviewHeading"], body [class*="xeixwq_overviewPreview"], body [class*="xeixwq_historyLoadButton"], body [class*="xeixwq_historyLoadingBar"] { background: ${ui.panel} !important; --dsw-alias-bg-layer-1: ${ui.panel}; --dsw-alias-bg-layer-2: ${ui.card}; --dsw-alias-bg-layer-3: ${ui.control}; --dsw-alias-border-l2: ${ui.border}; --dsw-alias-border-l3: ${ui.border}; --dsw-alias-border-l4: ${ui.border}; }
        body [class*="xeixwq_turnLabel"], body [class*="xeixwq_systemNeutral"], body [class*="xeixwq_compacted"], body [class*="Wd4N7W_search"], body [class*="xeixwq_table"] th { background: ${ui.control} !important; border-color: ${ui.border} !important; }
        body [class*="Wd4N7W_search"]:focus-within { background: ${ui.card} !important; }`}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:952-990](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L952-L990)

已有nested token/extras及环境监听，非新增。

<details>
<summary>查看原文（39行）</summary>

```text
    function apply(ctx) {
      injectCss();
      // 启动即拉取一次系统字体，用户打开设置页时列表已经就绪。
      loadHostFonts();
      const markNav = () => { for (const button of document.querySelectorAll('[data-shortcut-modal="settings"] nav button')) if (button.textContent.trim() === "外观" && button.dataset.dcaAppearanceNav !== "true") button.dataset.dcaAppearanceNav = "true"; };
      let navQueued = false;
      const navObserver = new MutationObserver(() => { if (!navQueued) { navQueued = true; setTimeout(() => { navQueued = false; markNav(); }, 100); } });
      navObserver.observe(document.body, {childList:true, subtree:true});
      markNav();
      ctx.effect(() => () => navObserver.disconnect(), "dsh-eye-comfort: settings icon");
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

**依据 4 · 源码核查**：[lib/client.js:924-951](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L924-L951)

正确性修复依据：native宽度与own重置分开。

<details>
<summary>查看原文（28行）</summary>

```text
          row("代码字体大小",numberRowWrap("codeSize","代码字体大小","调整聊天和差异视图中的代码字号",10,20)),
          row("内容宽度",h("div",{style:{display:"flex",alignItems:"center",gap:8}},
            h("input",{className:"dca-slider",type:"range",min:680,max:1400,step:20,value:s.contentWidth,"aria-label":"内容宽度",onChange:e=>{
              // DSH owns this width: it writes --dsh-chat-user-width inline on every resize from
              // its own localStorage preference, and deletes that inline variable whenever the
              // preference is absent. Fighting that with CSS never worked, so the slider updates
              // DSH's own preference key and dispatches resize so its ResizeObserver republishes.
              const px = Number(e.target.value);
              applyContentWidth(px);
              patch({contentWidth:px},true);
            }}),
            h("span",{className:"dca-muted",style:{minWidth:"52px",textAlign:"right"}},s.contentWidth+" px")),"输入框与正文的最大宽度；拖拽正文两侧边缘可临时覆盖")),
        h("div",{className:"dca-card"},
          row("减少动态效果",choice(s.reducedMotion,v=>patch({reducedMotion:v}),[["system","系统"],["on","开启"],["off","关闭"]],"减少动态效果"),"减少动画效果或匹配系统设置"),
          row("纸张质感",switcher(s.paper,v=>patch({paper:v}),"纸张质感"),"在内容区、侧栏与卡片上叠一层极淡的纸张颗粒（不影响原生标题栏）"),
          s.paper ? row("颗粒强度",h("div",{style:{display:"flex",alignItems:"center",gap:8}},
            h(Slider,{value:s.paperStrength,onChange:v=>patch({paperStrength:v},true),label:"颗粒强度"}),
            h("span",{className:"dca-muted",style:{minWidth:"36px",textAlign:"right"}},String(s.paperStrength))),"数值越大颗粒越明显；建议 40–70，再高接近砂纸") : null,
          row("分别设置浅色和深色模式",switcher(s.separate,v=>patch({separate:v}),"分别设置浅色和深色模式"),"分别选择各自的颜色和字体")),
        h("div",{className:"dca-card"},
          row("界面字体样式",choice(s.fontStyle,v=>patch({fontStyle:v}),[["normal","常规"],["compact","紧凑"],["comfortable","舒适"]],"界面字体样式")),
          row("内容字体",choice(fontValue("contentFont"),v=>changeFont("contentFont",v),fontOpts,"内容字体")),
          row("内容字体样式",choice(s.contentStyle,v=>patch({contentStyle:v}),[["normal","常规"],["compact","紧凑"],["comfortable","舒适"]],"内容字体样式")),
          row("代码字体",choice(fontValue("codeFont"),v=>changeFont("codeFont",v),fontOpts,"代码字体")),
          row("代码字体样式",choice(s.codeStyle,v=>patch({codeStyle:v}),[["normal","常规"],["compact","紧凑"],["comfortable","舒适"]],"代码字体样式")),
          row("对比度",h("div",{style:{display:"flex",alignItems:"center",gap:8}},h(Slider,{value:s.contrast,onChange:v=>patch({contrast:v},true),label:"对比度"}),h("span",null,s.contrast)))) ,
        h("div",{className:"dca-actions"},h("button",{className:"dca-button",type:"button",onClick:()=>setState(DEFAULT)},"重置为默认设置")));
    }
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前采用如何限定，退出需要做什么？

**研究主题**：采用判断、工程质量与复用

#### 完整回答

当前观察，不把“只是配色”当无状态可逆。确需多区域细调的人，先在同机个人隔离环境核Host主题接口/字体准入、记录原生模式与宽度和own/native两个存储键，再用一页真实对话、代码和改动卡片检验；只需浅深/宽度的人先用原生。字体列表/纹理/对比度均按个人实际效果选，不作健康或无障碍保证。

升级有限试用需确认：Host字体名在浏览器实际可用、字体失败fallback/缓存可识别，修改/等待/刷新后两个偏好与页面一致，重置后的native width、关闭插件后的mode/width/inline及普通页面可恢复，另验同源多窗/其他主题和Host升级。关键区域失配/文字难辨、准入或存储范围不符、重置不一致或恢复不可信时停止改值，保全旧偏好，禁用后手工恢复Host原模式和原生宽度，必要重载隔离环境；不要连续点击重置期待事务回滚。

可借鉴的是sanitize、token优先/受控SVG纹理、系统模式与字体fallback及部分disposer；迁移仍要重做Host token/类名/原生偏好与准入合同。本轮没有运行字体命令、目标、安装/渲染或测量，也不把作者Windows报告、代码色差注释/截图继承为当前验收。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:232-243](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L232-L243)

原生width实际写入需手工恢复。

<details>
<summary>查看原文（12行）</summary>

```text
    const WIDTH_KEY = "dsh.conversation.contentWidth";
    function applyContentWidth(px) {
      try { localStorage.setItem(WIDTH_KEY, String(px)); } catch {}
      for (const el of document.querySelectorAll('[class*="an3WzG_body"],[class*="an3WzG_root"]')) {
        el.style.setProperty("--dsh-chat-user-width", px + "px");
      }
      // The embedded transcript hard-codes its own min(100% - 32px, 920px), so it needs the
      // resolved width rather than the user-facing variable.
      for (const el of document.querySelectorAll('[class*="an3WzG_embeddedBody"]')) {
        el.style.setProperty("--dsh-chat-content-width", `min(${px}px, calc(100% - 32px))`);
      }
    }
```

</details>

**依据 2 · 源码核查**：[lib/client.js:283-303](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L283-L303)

迟写/静默存储边界。

<details>
<summary>查看原文（21行）</summary>

```text
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

**依据 3 · 源码核查**：[lib/client.js:924-990](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/client.js#L924-L990)

重置、生效与清理范围。

<details>
<summary>查看原文（67行）</summary>

```text
          row("代码字体大小",numberRowWrap("codeSize","代码字体大小","调整聊天和差异视图中的代码字号",10,20)),
          row("内容宽度",h("div",{style:{display:"flex",alignItems:"center",gap:8}},
            h("input",{className:"dca-slider",type:"range",min:680,max:1400,step:20,value:s.contentWidth,"aria-label":"内容宽度",onChange:e=>{
              // DSH owns this width: it writes --dsh-chat-user-width inline on every resize from
              // its own localStorage preference, and deletes that inline variable whenever the
              // preference is absent. Fighting that with CSS never worked, so the slider updates
              // DSH's own preference key and dispatches resize so its ResizeObserver republishes.
              const px = Number(e.target.value);
              applyContentWidth(px);
              patch({contentWidth:px},true);
            }}),
            h("span",{className:"dca-muted",style:{minWidth:"52px",textAlign:"right"}},s.contentWidth+" px")),"输入框与正文的最大宽度；拖拽正文两侧边缘可临时覆盖")),
        h("div",{className:"dca-card"},
          row("减少动态效果",choice(s.reducedMotion,v=>patch({reducedMotion:v}),[["system","系统"],["on","开启"],["off","关闭"]],"减少动态效果"),"减少动画效果或匹配系统设置"),
          row("纸张质感",switcher(s.paper,v=>patch({paper:v}),"纸张质感"),"在内容区、侧栏与卡片上叠一层极淡的纸张颗粒（不影响原生标题栏）"),
          s.paper ? row("颗粒强度",h("div",{style:{display:"flex",alignItems:"center",gap:8}},
            h(Slider,{value:s.paperStrength,onChange:v=>patch({paperStrength:v},true),label:"颗粒强度"}),
            h("span",{className:"dca-muted",style:{minWidth:"36px",textAlign:"right"}},String(s.paperStrength))),"数值越大颗粒越明显；建议 40–70，再高接近砂纸") : null,
          row("分别设置浅色和深色模式",switcher(s.separate,v=>patch({separate:v}),"分别设置浅色和深色模式"),"分别选择各自的颜色和字体")),
        h("div",{className:"dca-card"},
          row("界面字体样式",choice(s.fontStyle,v=>patch({fontStyle:v}),[["normal","常规"],["compact","紧凑"],["comfortable","舒适"]],"界面字体样式")),
          row("内容字体",choice(fontValue("contentFont"),v=>changeFont("contentFont",v),fontOpts,"内容字体")),
          row("内容字体样式",choice(s.contentStyle,v=>patch({contentStyle:v}),[["normal","常规"],["compact","紧凑"],["comfortable","舒适"]],"内容字体样式")),
          row("代码字体",choice(fontValue("codeFont"),v=>changeFont("codeFont",v),fontOpts,"代码字体")),
          row("代码字体样式",choice(s.codeStyle,v=>patch({codeStyle:v}),[["normal","常规"],["compact","紧凑"],["comfortable","舒适"]],"代码字体样式")),
          row("对比度",h("div",{style:{display:"flex",alignItems:"center",gap:8}},h(Slider,{value:s.contrast,onChange:v=>patch({contrast:v},true),label:"对比度"}),h("span",null,s.contrast)))) ,
        h("div",{className:"dca-actions"},h("button",{className:"dca-button",type:"button",onClick:()=>setState(DEFAULT)},"重置为默认设置")));
    }
    function apply(ctx) {
      injectCss();
      // 启动即拉取一次系统字体，用户打开设置页时列表已经就绪。
      loadHostFonts();
      const markNav = () => { for (const button of document.querySelectorAll('[data-shortcut-modal="settings"] nav button')) if (button.textContent.trim() === "外观" && button.dataset.dcaAppearanceNav !== "true") button.dataset.dcaAppearanceNav = "true"; };
      let navQueued = false;
      const navObserver = new MutationObserver(() => { if (!navQueued) { navQueued = true; setTimeout(() => { navQueued = false; markNav(); }, 100); } });
      navObserver.observe(document.body, {childList:true, subtree:true});
      markNav();
      ctx.effect(() => () => navObserver.disconnect(), "dsh-eye-comfort: settings icon");
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

**依据 4 · 源码核查**：[lib/index.js:115-151](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/lib/index.js#L115-L151)

可选准入需实际验。

<details>
<summary>查看原文（37行）</summary>

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
    },
  });
}
```

</details>

**依据 5 · 作者声明**：[README.md:7-7](https://github.com/AaronKate/dsh-codex-appearance/blob/ba7903e5ca5ceb5573a309195c5def85b1932f01/README.md#L7-L7)

作者过去Windows验证不等本轮结果。

```text
已在 Windows 上 DeepSeek Harness 0.2.0-rc.2 中验证安装、设置界面与浅色/深色主题效果。字体清单通过主进程调用系统接口读取（Windows 用 GDI+，macOS 用 system_profiler，Linux 用 fc-list），不修改系统设置。
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
