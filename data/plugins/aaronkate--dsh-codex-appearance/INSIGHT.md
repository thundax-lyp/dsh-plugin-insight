# dsh-eye-comfort

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[0859929](https://github.com/AaronKate/dsh-codex-appearance/tree/085992962dc6f01383186c0e66015a2ab9d9fda9)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AaronKate/dsh-codex-appearance) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-eye-comfort)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供主题、字体、定时切换和外观设置。

> **亮点**：[Q01](#research-q01) 集中调整界面参数，[Q02](#research-q02) 结合 token 与宿主结构样式；没有证明护眼医疗效果。

> **主要限制**：[Q03](#research-q03) 字体路由在旧宿主缺 connection 时无本组件鉴权；[Q04](#research-q04) 延迟写可能覆盖新设置。

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
  - [Q01 · 外观插件解决什么问题，相比原生主题是什么增量？](#detail-section-11)
  - [Q02 · 主题如何应用与恢复，哪些选择器依赖宿主内部结构？](#detail-section-12)
  - [Q03 · 系统字体和坐标的隐私边界是什么？](#detail-section-13)
  - [Q04 · 配置写入、导入和退出有哪些恢复条件？](#detail-section-14)
  - [Q05 · 怎样验证持久化次序与导出隐私的改进？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH 用户希望配置显示配色、字体、对比度和主题切换。

宿主已有主题与系统深浅色能力；插件补充预设、显示参数和定时设置。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 主题及 CSS | 定制界面显示 | 部分依赖内部类名 |
| JSON 导入导出 | 转移设置 | 包含已保存坐标 |
| 系统字体清单 | 挑选字族 | 宿主认证取决于 connection 等外围条件 |

**流程与依赖**

| 依赖 | 条件 | 用途 | 缺失影响 |
|---|---|---|---|
| DSH theme、settings.section | 显示必需 | 应用 token 与设置页 | 页面或主题不可用 |
| webServer | 字体路由必需 | 返回系统字族 | 回退候选探测 |
| 系统字体命令 | 对应平台需要 | 列出字体 | 失败缓存空列表 |
| 本地浏览器存储 | 设置持久化需要 | 保存外观与坐标 | 无法可靠保留设置 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 准备 | 用户核对宿主版本并备份设置 | 不兼容则停止 |
| 配置 | 在外观页选择主题与参数 | 字体不可用时选后备 |
| 分享 | 导出前检查 JSON | 删除不愿分享的坐标 |
| 恢复 | 禁用插件并恢复配置 | 与其他主题冲突时回原生界面 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | 兼容宿主与字体接口 | 配置和许可核对 | 实际兼容未知 |
| 持续 | 本地样式和周期检查 | 检查宿主更新导致的视觉失效 | 资源开销未测 |
| 恢复 | 本地设置备份 | 排查存储及主题冲突 | 卸载恢复未测 |

| 结果 | 依据 | 未知 |
|---|---|---|
| 自定义界面 | 设置页和 token 源码 | 用户可读性效果 |
| 本地导入导出 | JSON 读写源码 | 坐标分享意外概率 |
| 对比调制 | 固定公式 | 全界面可访问性 |

> **思考**：[Q03](#research-q03) 字体路由在旧宿主缺 connection 时无本组件鉴权；[Q04](#research-q04) 延迟写可能覆盖新设置。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 集中调整界面参数，[Q02](#research-q02) 结合 token 与宿主结构样式；没有证明护眼医疗效果。

[Q02](#research-q02) 清理订阅和 token 覆盖，但附加样式依赖内部类名；[Q04](#research-q04) 延迟持久化与即时写有顺序风险。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 字体路由在旧宿主缺 connection 时无本组件鉴权；[Q04](#research-q04) 延迟写可能覆盖新设置。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 想试外观者先备份设置，检查导出坐标与可读性；若宿主不兼容或字体接口边界不符合预期，停用并回原生主题。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本静态核查，作者 Windows 验证为自述；本轮未运行目标。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查宿主字体接口、客户端主题接入、存储与部分样式；未逐一核查全部色值、太阳算法和宿主外围认证。
- 下一步：隔离宿主复核选择器、所有主题对比、快速写入、字体路由及卸载；本次未运行。

**分析版本**

- **仓库**：[AaronKate/dsh-codex-appearance](https://github.com/AaronKate/dsh-codex-appearance)
- **版本号**：0.3.22（[固定提交 0859929](https://github.com/AaronKate/dsh-codex-appearance/tree/085992962dc6f01383186c0e66015a2ab9d9fda9)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出序列化持久化及导出位置提示，需验证正确性和负担。

隔离宿主复核选择器、所有主题对比、快速写入、字体路由及卸载；本次未运行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 126 | — | — | 2681 |
| .js | source | 4 | 1862 | 1231 | 627 | — |
| .cjs | source | 1 | 311 | 274 | 24 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AaronKate/dsh-codex-appearance/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AaronKate/dsh-codex-appearance/issues?q=is%3Aissue+created%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AaronKate/dsh-codex-appearance/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查外观覆盖、设置持久化及字体与位置信息的边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 外观插件解决什么问题，相比原生主题是什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要调节 DSH 桌面界面外观的用户；宿主本身已有主题 token 和设置扩展，本插件把浅深配色、字体、尺寸、对比度和定时设置集中在外观页，并生成对应 token 与 CSS。相对只切系统深浅色，它提供更细的配置；“护眼”是项目定位，不能据此证明视疲劳改善、无障碍合规或用户收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-7](https://github.com/AaronKate/dsh-codex-appearance/blob/085992962dc6f01383186c0e66015a2ab9d9fda9/README.md#L1-L7)

作者说明主题与自身 Windows 验证主张。

```text
# DeepSeek Harness 护眼外观插件

在设置中增加「外观」页，提供五套浅色护眼主题（暖白、米纸、豆沙绿、雾蓝、石墨）与五套深色主题（蓝灰、纯黑、北境、暖褐、墨绿），以及跟随系统／浅色／深色／按时间表四种模式、强调色与背景色、界面与代码的字体和字号、字体样式、内容宽度、对比度、纸张质感和减少动态效果等设置。每套主题各自带有匹配的强调色与链接色，并覆盖消息气泡、轮次预览、输入框、改动文件卡片等界面区域。语法高亮的九个着色器变量（关键字、字符串、注释、常量、函数、参数、标点、链接等）与 diff 的增删底色、行号槽、标记色都按主题重新调制，并按实际代码块底色校验对比度；另有色盲友好档把增删行的红绿换成蓝橙。设置可导出为 JSON 再导入到另一台机器，也可设定「浅色起／深色起」两个时间点让界面自动切换。字体下拉会列出本机安装的全部字族（由插件主进程读取系统字体清单，读不到时回退到内置候选探测），可分别设置界面、内容与代码字体。纸张质感在内容区、侧栏、输入框和卡片上叠一层极淡的纸纤维颗粒，强度可调；纹理自带主题底色，不改变原有色温，也不触碰原生标题栏。输入框在鼠标移入时轻微上浮、聚焦输入时落回原位。通过 Harness 的主题 token 和设置 section 扩展点工作；设置保存在当前桌面应用的本地浏览器存储中。

Eye-comfort appearance controls for DeepSeek Harness: five light and five dark themes, themed syntax highlighting and diff colours (with a colour-blind-friendly option), scheduled light/dark switching, JSON import and export, accent and background colours, typography, content width, contrast and paper grain. This is an independent community plugin, not an official Codex or DeepSeek product.

已在 Windows 上 DeepSeek Harness 0.2.0-rc.2 中验证安装、设置界面与浅色/深色主题效果。字体清单通过主进程调用系统接口读取（Windows 用 GDI+，macOS 用 system_profiler，Linux 用 fc-list），不修改系统设置。
```

**依据 2 · 源码核查**：[lib/client.js:1480-1498](https://github.com/AaronKate/dsh-codex-appearance/blob/085992962dc6f01383186c0e66015a2ab9d9fda9/lib/client.js#L1480-L1498)

注入主题并覆盖 tokens。

<details>
<summary>查看原文（19行）</summary>

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
          // 定时模式下不能把 "schedule" 交给宿主（它只认 system/light/dark），
          // 直接传解析后的深浅色。
          try { scope.theme.setTheme(state.mode === "schedule" ? effectiveScheme(state) : state.mode); } catch {}
          removeTheme = scope.theme.overrideTokens("dsh-eye-comfort", themeTokens(state));
          applyExtras(state, state.reducedMotion === "on" || (state.reducedMotion === "system" && motionMedia.matches));
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1526-1530](https://github.com/AaronKate/dsh-codex-appearance/blob/085992962dc6f01383186c0e66015a2ab9d9fda9/lib/client.js#L1526-L1530)

释放资源并注册设置页。

```text
        scope.effect(() => () => { clearInterval(ticker); listeners.delete(sync); schemeObserver.disconnect(); media.removeEventListener("change", syncEnvironment); motionMedia.removeEventListener("change", syncEnvironment); removeTheme?.(); document.getElementById("dca-theme-extras")?.remove(); }, "dsh-eye-comfort: theme controls");
      });
      ctx.slots.inject("settings.section", () => ctx.slots.register({name:"settings.section",id:"codex-appearance",order:5,label:"外观"},SettingsPage));
    }
    return {apply, inject:["slots"]};
```

#### 缺口

- 缺少可核查同条件用户研究
  **影响**：无法说明视觉疲劳或任务表现改善
  **进一步探讨**：与宿主默认外观比较可读性、错误和主观反馈。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 主题如何应用与恢复，哪些选择器依赖宿主内部结构？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端通过 theme 注入 setTheme 和 overrideTokens，设置改动触发重算；系统模式监听 body 属性和媒体查询，定时模式每 30 秒检查切换，释放时清理计时器、监听器、覆盖层与附加 style。除 token 外，applyExtras 还针对带 hash 的 class 子串与 !important 绘制侧栏、输入区域：宿主构建重命名或 DOM 改变可导致局部失效，不能把注册通过等同完整样式兼容。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:735-736](https://github.com/AaronKate/dsh-codex-appearance/blob/085992962dc6f01383186c0e66015a2ab9d9fda9/lib/client.js#L735-L736)

创建附加 style。

```text
      let style = document.getElementById("dca-theme-extras");
      if (!style) { style = document.createElement("style"); style.id = "dca-theme-extras"; document.head.appendChild(style); }
```

**依据 2 · 源码核查**：[lib/client.js:779-803](https://github.com/AaronKate/dsh-codex-appearance/blob/085992962dc6f01383186c0e66015a2ab9d9fda9/lib/client.js#L779-L803)

CSS 依赖内部类名及强覆盖。

<details>
<summary>查看原文（25行）</summary>

```text
        ? `body [class*="mP3x-q_frame"] { background: ${theme.sidebarGlassFill} !important; }
        body [class*="mP3x-q_sidebarCol"] { background: ${theme.sidebarGlassFill} !important; }`
        : `body [class*="mP3x-q_frame"] { background: ${darkSidebar} !important; }
        body [class*="mP3x-q_sidebarCol"] { background: ${darkSidebar} !important; }
        body [class*="centerCol"]:not([class*="mP3x-q_centerCol"]) { background: ${darkSidebar} !important; }`;
      // The transcript area gets its own cool off-white in light mode. Only the column and the
      // conversation root are repainted: --dsw-alias-bg-base stays on the app base because
      // twenty other modules read it, and repainting the token would tint the whole window.
      // The composer's bottom fade is a gradient built from that token, so it is rebuilt from
      // the same colour here; otherwise a pale band shows under the last message.
      // 深色同样要画：不画的话内容列退回 --dsw-alias-bg-base，与侧栏同色（就是这次的 bug）。
      const content = scheme === "light"
        ? `body [class*="mP3x-q_centerCol"] { background: ${theme.content} !important; }
        body [class*="an3WzG_root"] { background: ${theme.content} !important; }`
        : `body [class*="mP3x-q_centerCol"] { background: ${darkContent} !important; }
        body [class*="an3WzG_root"] { background: ${darkContent} !important; }`;
      // 输入区那条「透明 → 底色」的淡出层（composerSeat）原本用不透明渐变换掉 DSH 的默认实现，
      // 它会盖住背后 root 的纸张纹理，导致输入框左右两侧是纯色（截图里箭头指的位置）。
      // 实测（纯色遮罩盖在有纹理的底上，看 P5-P95 色阶差）：
      //   alpha 1.0 → 0（纹理全被盖住）／0.92 → 1.9（等于没有）／0.75 → 5.1／0.5 → 10／0.25 → 15
      // 开纸质时取 0.45：纹理透出约 11 个色阶，与周围纸面一致，同时淡出遮罩仍然起作用。
      // 关纸质时必须回到完全不透明：这层同时负责遮挡滚动到输入区底下的内容，
      // 半透明会让消息从输入框下方透出来。
      const seatAlpha = paperOn ? .45 : 1;
      const seat = `body [class*="an3WzG_composerSeat"] { background: linear-gradient(180deg, transparent 0px, ${hexA(scheme === "light" ? theme.content : darkContent, seatAlpha)} 36px) !important; }`;
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1480-1498](https://github.com/AaronKate/dsh-codex-appearance/blob/085992962dc6f01383186c0e66015a2ab9d9fda9/lib/client.js#L1480-L1498)

主题注入及覆盖。

<details>
<summary>查看原文（19行）</summary>

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
          // 定时模式下不能把 "schedule" 交给宿主（它只认 system/light/dark），
          // 直接传解析后的深浅色。
          try { scope.theme.setTheme(state.mode === "schedule" ? effectiveScheme(state) : state.mode); } catch {}
          removeTheme = scope.theme.overrideTokens("dsh-eye-comfort", themeTokens(state));
          applyExtras(state, state.reducedMotion === "on" || (state.reducedMotion === "system" && motionMedia.matches));
```

</details>

**依据 4 · 源码核查**：[lib/client.js:1504-1528](https://github.com/AaronKate/dsh-codex-appearance/blob/085992962dc6f01383186c0e66015a2ab9d9fda9/lib/client.js#L1504-L1528)

监听、定时与清理。

<details>
<summary>查看原文（25行）</summary>

```text
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
        // 定时切换的心跳：每 30 秒看一次表，只有"该切了"才重算，不做无谓重绘。
        // 不用精确闹钟——深浅色晚 30 秒切换，人感觉不到。
        let lastScheme = effectiveScheme(state);
        const ticker = setInterval(() => {
          if (state.mode !== "schedule") { lastScheme = effectiveScheme(state); return; }
          const want = effectiveScheme(state);
          if (want !== lastScheme) { lastScheme = want; sync(); }
        }, 30000);
        scope.effect(() => () => { clearInterval(ticker); listeners.delete(sync); schemeObserver.disconnect(); media.removeEventListener("change", syncEnvironment); motionMedia.removeEventListener("change", syncEnvironment); removeTheme?.(); document.getElementById("dca-theme-extras")?.remove(); }, "dsh-eye-comfort: theme controls");
      });
      ctx.slots.inject("settings.section", () => ctx.slots.register({name:"settings.section",id:"codex-appearance",order:5,label:"外观"},SettingsPage));
```

</details>

#### 缺口

- 未在当前宿主运行或逐屏检查
  **影响**：无法确认实际视觉与卸载恢复
  **进一步探讨**：固定宿主版本检查前后对比及宿主更新后的选择器。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 系统字体和坐标的隐私边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

宿主通过系统命令获取字体并缓存；字体路由在存在 connection.admit 时调用它并对拒绝或异常拦截，旧宿主缺该服务则直接继续，路由本身没有替代鉴权；外层 webServer 限制未审，不能断言可被远程读取。客户端点击定位后将经纬度写入设置，导出把整个 state 序列化为 JSON，因此已保存的精确坐标也随导出带出；经由用户分享配置时应先检查并移除坐标。导出行为不是自动外发。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:49-82](https://github.com/AaronKate/dsh-codex-appearance/blob/085992962dc6f01383186c0e66015a2ab9d9fda9/lib/index.js#L49-L82)

macOS 和 Linux 系统字体命令及失败回退。

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

**依据 2 · 源码核查**：[lib/index.js:92-103](https://github.com/AaronKate/dsh-codex-appearance/blob/085992962dc6f01383186c0e66015a2ab9d9fda9/lib/index.js#L92-L103)

结果含失败缓存。

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

**依据 3 · 源码核查**：[lib/index.js:107-148](https://github.com/AaronKate/dsh-codex-appearance/blob/085992962dc6f01383186c0e66015a2ab9d9fda9/lib/index.js#L107-L148)

connection 可选且字体路由返回结果。

<details>
<summary>查看原文（42行）</summary>

```text
 * Register the read-only route. Returns a disposer, matching the Cordis effect contract.
 *
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

**依据 4 · 源码核查**：[lib/client.js:389-411](https://github.com/AaronKate/dsh-codex-appearance/blob/085992962dc6f01383186c0e66015a2ab9d9fda9/lib/client.js#L389-L411)

设置含经纬度。

<details>
<summary>查看原文（23行）</summary>

```text
    function sanitize(raw) {
      const x = raw && typeof raw === "object" ? raw : {};
      const palette = (v, base) => ({accent: hex(v?.accent, base.accent), background: hex(v?.background, base.background), foreground: hex(v?.foreground, base.foreground), uiFont:fontValue(v?.uiFont, "system"), contentFont:fontValue(v?.contentFont, "inherit"), codeFont:fontValue(v?.codeFont, "system")});
      return {
        mode: ["system", "light", "dark", "schedule"].includes(x.mode) ? x.mode : DEFAULT.mode,
        separate: !!x.separate,
        theme: THEME_IDS.includes(x.theme) ? x.theme : "warm",
        darkTheme: DARK_IDS.includes(x.darkTheme) ? x.darkTheme : "slate",
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
        paperStrength: clamp(x.paperStrength, 1, 100, 60),
        colorblind: !!x.colorblind,
        lightAt: timeValue(x.lightAt, DEFAULT.lightAt), darkAt: timeValue(x.darkAt, DEFAULT.darkAt),
        sun: !!x.sun, lat: coord(x.lat, 90), lon: coord(x.lon, 180)
```

</details>

**依据 5 · 源码核查**：[lib/client.js:1346-1359](https://github.com/AaronKate/dsh-codex-appearance/blob/085992962dc6f01383186c0e66015a2ab9d9fda9/lib/client.js#L1346-L1359)

定位结果保存到设置。

<details>
<summary>查看原文（14行）</summary>

```text
      // 日出日落：位置只存经纬度，太阳时间每次现算（不落盘，换天自然更新）。
      // 定位走系统定位服务（Electron 会转交给 Windows 定位），被拒绝时退回手动经纬度。
      const [geo, setGeo] = React.useState({ status: "idle", error: "" });
      const locate = () => {
        const geolocation = typeof navigator !== "undefined" ? navigator.geolocation : null;
        if (!geolocation) { setGeo({ status: "error", error: "此环境没有系统定位接口" }); return; }
        setGeo({ status: "locating", error: "" });
        geolocation.getCurrentPosition(
          (pos) => {
            patch({ lat: coord(pos.coords.latitude, 90), lon: coord(pos.coords.longitude, 180) });
            setGeo({ status: "ok", error: "" });
          },
          (err) => setGeo({ status: "error", error: err && err.code === 1 ? "定位权限被拒绝（Windows 设置 › 隐私和安全性 › 位置）" : err && err.code === 3 ? "定位超时，请重试" : "系统定位不可用" }),
          { timeout: 15000, maximumAge: 3600000 }
```

</details>

**依据 6 · 源码核查**：[lib/client.js:1370-1396](https://github.com/AaronKate/dsh-codex-appearance/blob/085992962dc6f01383186c0e66015a2ab9d9fda9/lib/client.js#L1370-L1396)

完整 state 导出和导入。

<details>
<summary>查看原文（27行）</summary>

```text
      // 导入 / 导出：设置本来就是纯数据（颜色 + 字体 + 尺寸 + 模式），一个 JSON 就能带走。
      // 之前它只躺在 localStorage 里——换 profile、重装一次就归零，也没法把调好的色板发给别人。
      // 导入走 sanitize：非法值一律回落到默认，不会把界面写成不可用状态。
      function exportSettings() {
        const stamp = new Date().toISOString().slice(0, 10);
        const payload = {app: "dsh-eye-comfort", version: 1, settings: state};
        const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], {type: "application/json"}));
        const a = document.createElement("a");
        a.href = url; a.download = `dsh-eye-comfort-${stamp}.json`;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      function importSettings() {
        const picker = document.createElement("input");
        picker.type = "file"; picker.accept = ".json,application/json";
        picker.onchange = () => {
          const file = picker.files && picker.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const raw = JSON.parse(String(reader.result));
              // 两种形状都收：完整导出（{settings:{...}}）与裸设置对象。
              setState(raw && typeof raw.settings === "object" ? raw.settings : raw);
            } catch { /* 解析失败保持原样，不做部分写入 */ }
          };
          reader.readAsText(file);
```

</details>

#### 缺口

- 未审计所有宿主的 webServer、网络和权限策略
  **影响**：不能判断具体部署是否能跨来源访问字体
  **进一步探讨**：在隔离宿主核对缺 connection 时的监听地址、Host/Origin 和认证。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 配置写入、导入和退出有哪些恢复条件？

**研究主题**：效果与总成本、采用判断

#### 完整回答

设置保存在浏览器 localStorage，sanitize 对枚举、范围和字体字符做规范化；导入 JSON 解析失败保持原样，合法 JSON 则经 setState 规范化后整体替换。延迟持久化的 pending 设置会在 200ms 后写盘；其间若先执行立即写入，当前代码未清除旧 pending，旧快照可能随后覆盖持久化的新值，内存状态仍是新值，重载后可能回退。这里只是从控制流推断，未触发复现；分享前备份和移除位置，出现冲突则禁用并恢复原生主题。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:389-415](https://github.com/AaronKate/dsh-codex-appearance/blob/085992962dc6f01383186c0e66015a2ab9d9fda9/lib/client.js#L389-L415)

设置规范化及读取。

<details>
<summary>查看原文（27行）</summary>

```text
    function sanitize(raw) {
      const x = raw && typeof raw === "object" ? raw : {};
      const palette = (v, base) => ({accent: hex(v?.accent, base.accent), background: hex(v?.background, base.background), foreground: hex(v?.foreground, base.foreground), uiFont:fontValue(v?.uiFont, "system"), contentFont:fontValue(v?.contentFont, "inherit"), codeFont:fontValue(v?.codeFont, "system")});
      return {
        mode: ["system", "light", "dark", "schedule"].includes(x.mode) ? x.mode : DEFAULT.mode,
        separate: !!x.separate,
        theme: THEME_IDS.includes(x.theme) ? x.theme : "warm",
        darkTheme: DARK_IDS.includes(x.darkTheme) ? x.darkTheme : "slate",
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
        paperStrength: clamp(x.paperStrength, 1, 100, 60),
        colorblind: !!x.colorblind,
        lightAt: timeValue(x.lightAt, DEFAULT.lightAt), darkAt: timeValue(x.darkAt, DEFAULT.darkAt),
        sun: !!x.sun, lat: coord(x.lat, 90), lon: coord(x.lon, 180)
      };
    }
    let state, rawState = null;
    try { rawState = JSON.parse(localStorage.getItem(KEY)); state = sanitize(rawState); } catch { state = sanitize(null); }
```

</details>

**依据 2 · 源码核查**：[lib/client.js:440-456](https://github.com/AaronKate/dsh-codex-appearance/blob/085992962dc6f01383186c0e66015a2ab9d9fda9/lib/client.js#L440-L456)

立即写和延迟写互不取消。

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1382-1396](https://github.com/AaronKate/dsh-codex-appearance/blob/085992962dc6f01383186c0e66015a2ab9d9fda9/lib/client.js#L1382-L1396)

导入与解析错误分支。

<details>
<summary>查看原文（15行）</summary>

```text
      function importSettings() {
        const picker = document.createElement("input");
        picker.type = "file"; picker.accept = ".json,application/json";
        picker.onchange = () => {
          const file = picker.files && picker.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const raw = JSON.parse(String(reader.result));
              // 两种形状都收：完整导出（{settings:{...}}）与裸设置对象。
              setState(raw && typeof raw.settings === "object" ? raw.settings : raw);
            } catch { /* 解析失败保持原样，不做部分写入 */ }
          };
          reader.readAsText(file);
```

</details>

**依据 4 · 源码核查**：[lib/client.js:1468-1478](https://github.com/AaronKate/dsh-codex-appearance/blob/085992962dc6f01383186c0e66015a2ab9d9fda9/lib/client.js#L1468-L1478)

对比度滑杆使用 lazy 写。

<details>
<summary>查看原文（11行）</summary>

```text
        h("div",{className:"dca-card"},
          row("界面字体样式",choice(s.fontStyle,v=>patch({fontStyle:v}),[["normal","常规"],["compact","紧凑"],["comfortable","舒适"]],"界面字体样式")),
          row("内容字体",choice(fontValue("contentFont"),v=>changeFont("contentFont",v),fontOpts,"内容字体")),
          row("内容字体样式",choice(s.contentStyle,v=>patch({contentStyle:v}),[["normal","常规"],["compact","紧凑"],["comfortable","舒适"]],"内容字体样式")),
          row("代码字体",choice(fontValue("codeFont"),v=>changeFont("codeFont",v),fontOpts,"代码字体")),
          row("代码字体样式",choice(s.codeStyle,v=>patch({codeStyle:v}),[["normal","常规"],["compact","紧凑"],["comfortable","舒适"]],"代码字体样式")),
          row("对比度",h("div",{style:{display:"flex",alignItems:"center",gap:8}},h(Slider,{value:s.contrast,onChange:v=>patch({contrast:v},true),label:"对比度"}),h("span",null,s.contrast)))) ,
        h("div",{className:"dca-actions"},
          h("button",{className:"dca-button",type:"button",onClick:exportSettings},"导出设置"),
          h("button",{className:"dca-button",type:"button",onClick:importSettings},"导入设置"),
          h("button",{className:"dca-button",type:"button",onClick:()=>setState(DEFAULT)},"重置为默认设置")));
```

</details>

**依据 5 · 作者声明**：[README.md:42-52](https://github.com/AaronKate/dsh-codex-appearance/blob/085992962dc6f01383186c0e66015a2ab9d9fda9/README.md#L42-L52)

卸载及本地保存的作者说明。

<details>
<summary>查看原文（11行）</summary>

````text
重启 DeepSeek Harness，在「设置 → 外观」中调整。Windows 上 PowerShell 同样使用以上命令；路径可改为下载文件的绝对路径。要求 DeepSeek Harness 版本包含 `ui-theme` 和 `settings.section` 插件接口。

> 从 `dsh-codex-appearance` 改名为 `dsh-eye-comfort`。若你装过旧版本，请先执行下方卸载命令移除旧包，再按上面的方式安装新包；外观设置保存在浏览器存储中，与包名无关，重装后不会丢失。

## 卸载

```sh
dsh plugin --profile desktop remove dsh-eye-comfort
```

此插件不修改应用安装包或签名。与其他主题插件同时启用时，最后注册的 token 覆盖层决定同名颜色。当前版本的设置属于本机当前桌面应用，不跨设备同步。
````

</details>

#### 缺口

- 未实测快速交错输入、卸载或重启
  **影响**：不能认定用户实际发生丢失或恢复成功
  **进一步探讨**：测试滑杆后 200ms 内立即改其他设置，再重启核对磁盘与界面。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证持久化次序与导出隐私的改进？

**研究主题**：新假设与验证

#### 完整回答

[Q04](#research-q04) 的延迟/立即路径可能乱序，假设给所有写入共享单调序列或在立即写前合并/取消待写，可使最后用户意图在重启后保留；[Q03](#research-q03) 的完整 state 含坐标，假设导出前默认提示或排除位置能减少误分享。两项均未实现；对照连续滑杆加立即更改、跨格式导入、是否保留位置等场景，测最终值与用户负担，若丢写增加或正常跨设备恢复受损则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:443-456](https://github.com/AaronKate/dsh-codex-appearance/blob/085992962dc6f01383186c0e66015a2ab9d9fda9/lib/client.js#L443-L456)

待写快照与立即写并存。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1373-1396](https://github.com/AaronKate/dsh-codex-appearance/blob/085992962dc6f01383186c0e66015a2ab9d9fda9/lib/client.js#L1373-L1396)

完整 state 导出与导入路径。

<details>
<summary>查看原文（24行）</summary>

```text
      function exportSettings() {
        const stamp = new Date().toISOString().slice(0, 10);
        const payload = {app: "dsh-eye-comfort", version: 1, settings: state};
        const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], {type: "application/json"}));
        const a = document.createElement("a");
        a.href = url; a.download = `dsh-eye-comfort-${stamp}.json`;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      function importSettings() {
        const picker = document.createElement("input");
        picker.type = "file"; picker.accept = ".json,application/json";
        picker.onchange = () => {
          const file = picker.files && picker.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const raw = JSON.parse(String(reader.result));
              // 两种形状都收：完整导出（{settings:{...}}）与裸设置对象。
              setState(raw && typeof raw.settings === "object" ? raw.settings : raw);
            } catch { /* 解析失败保持原样，不做部分写入 */ }
          };
          reader.readAsText(file);
```

</details>

#### 缺口

- 未实现和实测上述改进
  **影响**：不能声称修复或已降低泄露
  **进一步探讨**：以受控时钟和人工分享任务比较原路径和候选实现。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
