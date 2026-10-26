# dsh-web-mobile-fix

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[bba4d83](https://github.com/AcidGr/dsh-web-mobile-fix/tree/bba4d83bfb1aac90c209fb5602428cbb9bb3fcc7)

<!-- BEGIN META -->
[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/AcidGr/dsh-web-mobile-fix) [![npm 30d 1,715](https://img.shields.io/static/v1?label=npm+30d&message=1%2C715&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-mobile-fix) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-web-mobile-fix)
<!-- END META -->

> **实现功能**：为Harness网页提供窄屏布局修复，并适配悬浮窗口中的会话和输入交互。

> **核心亮点**：相对手改产品源码，插件封装了可随profile加载的窄屏布局及悬浮窗口交互，集中处理导航、输入与会话切换；增量为宿主界面适配，未识别新布局算法。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：README的纯CSS与完全可逆描述不覆盖真实实现。overlay分支全局替换focus且清理未恢复，pointer/touch/mousedown与侧栏监听也未全部移除；这是静态可见的清理遗漏，实际干扰尚未复现。参见[Q03](#research-q03)。

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
  - [Q01 · 谁需要移动网页布局修复，相对手工或宿主原生办法增加什么？](#detail-section-11)
  - [Q02 · CSS选择器、overlay bridge及生命周期如何从入口形成完整调用链，依赖失效怎么办？](#detail-section-12)
  - [Q03 · 什么实现边界最可能使移动网页布局修复的贡献不成立，哪些工程设计可复用？](#detail-section-13)
  - [Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？](#detail-section-14)
  - [Q05 · 可从CSS选择器、overlay bridge及生命周期的限制推导什么可证伪改进？](#detail-section-15)
  - [Q06 · 哪些用户可以受控采用移动网页布局修复，何时应停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向通过手机浏览Harness Web、频繁在设置、会话列表和对话输入间切换的人。合格结果是窄屏能选会话、配置及发送信息而不遮挡；简单替代是宿主原生响应式布局或用户样式。该版还包含Android悬浮窗口行为，不应仅按CSS补丁理解。

手工用户样式只解决布局；原生响应式界面若已满足，插件额外监听与桥接负担不一定值得。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 窄屏布局覆盖 | 设置/输入/侧栏可用布局 | <=700px，依赖DOM选择器 |
| 悬浮窗口控制 | 返回、退出及会话切换 | 需overlay模式与相应bridge |
| 焦点和滚动适配 | 抑制非触摸聚焦并保持输入可见 | 全局原型补丁，清理不完整 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Harness Web profile与客户端模块加载器 | 必需 | 加载 ./client 与样式 | Node半部为空，单独加载不产生布局效果 |
| 宿主DOM槽位及类名片段 | 必需 | 命中设置、侧栏、输入框 | 选择器变更可能失效或误匹配 |
| DSHOverlayBridge或overlay URL标记 | 悬浮模式必需 | 原生返回、退出与切换会话 | 部分按钮退化，URL误匹配仍可能进入模式 |
| Node >=20、DSH >=0.1.0 | 包声明 | 安装与宿主依赖 | 范围声明不是逐版验收 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户在web profile安装并刷新 | 确认客户端模块进入页面 |
| 2 | 用户用窄屏检查设置、侧栏及输入 | 不遮挡内容，可用键盘及触控完成操作 |
| 3 | 需要悬浮模式时核查bridge与焦点行为 | 输入框只在用户意图时聚焦且能正常辅助导航 |
| 4 | 移除插件并重新加载页面 | 样式、监听和focus恢复；当前实现需全页刷新消除全局补丁 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 浏览器加载脚本和CSS，金额未知 | 安装及多尺寸/键盘核对，耗时未知 | 已有布局能满足时无需增加覆盖 |
| 持续使用 | CSS匹配、事件监听及blur渲染资源，量未知 | 宿主升级后回归各选择器 | 移动耗电和掉帧未测 |
| 失败恢复 | 重新加载页面资源，金额未知 | 停用插件、刷新并重验焦点与侧栏 | effect清理不恢复focus覆盖 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 窄屏布局 | <=700px规则覆盖导航/输入/侧栏 | 不同语言、缩放与软键盘下可用性 |
| 悬浮交互 | 桥接按钮、触控焦点及深链接实现可见 | 与辅助技术及其他插件是否冲突 |
| 可逆性 | 移除样式及部分监听 | 无刷新卸载无法由源码保证完全恢复 |

> **思考**：README的纯CSS与完全可逆描述不覆盖真实实现。overlay分支全局替换focus且清理未恢复，pointer/touch/mousedown与侧栏监听也未全部移除；这是静态可见的清理遗漏，实际干扰尚未复现。参见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手改产品源码，插件封装了可随profile加载的窄屏布局及悬浮窗口交互，集中处理导航、输入与会话切换；增量为宿主界面适配，未识别新布局算法。参见[Q01](#research-q01)、[Q02](#research-q02)。

相对手改产品源码，插件封装了可随profile加载的窄屏布局及悬浮窗口交互，集中处理导航、输入与会话切换；增量为宿主界面适配，未识别新布局算法。参见[Q01](#research-q01)、[Q02](#research-q02)。

样式注入与ctx.effect回收的模式便于局部复用；全局focus替换、宽DOM选择器、空catch及遗漏监听使维护边界扩大，移植需重建宿主DOM契约与可撤销生命周期。

<a id="detail-section-5"></a>

### 1.4 主要限制

README的纯CSS与完全可逆描述不覆盖真实实现。overlay分支全局替换focus且清理未恢复，pointer/touch/mousedown与侧栏监听也未全部移除；这是静态可见的清理遗漏，实际干扰尚未复现。参见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察。普通窄屏用户先确认宿主原生布局是否足够；确需评估时用非关键profile，测试设置、长会话、键盘和停用后全页刷新。需要可靠热卸载、无障碍焦点或与其他focus插件共存时暂缓。参见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

界面适配机制由固定源码支持；移动端效果、兼容范围和设计假设未运行验证。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh.md、package.json、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定版README、manifest、Node空入口与客户端CSS/overlay/清理链；未运行浏览器、软键盘或宿主。
- 下一步：可在隔离profile用同一设置/发送任务对照原生布局，覆盖加载/停用、软键盘、横屏与其他焦点插件，记录功能与恢复结果。

**分析版本**

- **仓库**：[AcidGr/dsh-web-mobile-fix](https://github.com/AcidGr/dsh-web-mobile-fix)
- **版本号**：1.0.8（[固定提交 bba4d83](https://github.com/AcidGr/dsh-web-mobile-fix/tree/bba4d83bfb1aac90c209fb5602428cbb9bb3fcc7)）
- **版本日期**：2026-09-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可把悬浮焦点策略改为有所有者的可撤销适配器，保存原focus、统一登记监听和计时器，停用时逐项恢复。对照当前分支反复加载/停用、键盘导航及两个插件并存，若焦点和监听未恢复或触控体验变差则否定方案；仍是未验证设计。参见[Q05](#research-q05)。

可在隔离profile用同一设置/发送任务对照原生布局，覆盖加载/停用、软键盘、横屏与其他焦点插件，记录功能与恢复结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1472 | 1399 | 86 | — |
| .md | source | 2 | 157 | — | — | 1082 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/AcidGr/dsh-web-mobile-fix/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 bba4d83bfb1aac90c209fb5602428cbb9bb3fcc7 和截止 2026-10-23T01:41:11Z 范围内，移动网页布局修复能为明确用户提供什么可核查增量，其关键限制、总成本和采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要移动网页布局修复，相对手工或宿主原生办法增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

手机浏览Harness的个人用户若反复遇到设置、会话列表和输入区挤压，可用插件集中覆盖布局；交付标准为能完成选会话、配置和发送。与手改产品或用户CSS相比，它提供profile加载与悬浮桥接，但并无新布局算法。

作者宣称槽位稳定与不改产品源码；源码支持独立注入，但大量[class*=]和宽role选择器不是独立版本契约。贡献是否节省操作应以完成同一手机任务的成功率核对，不能由截图或规则数量推出。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-25](https://github.com/AcidGr/dsh-web-mobile-fix/blob/bba4d83bfb1aac90c209fb5602428cbb9bb3fcc7/README.md#L1-L25)

作者定位移动布局修复，属于主张而非运行证据

<details>
<summary>查看原文（25行）</summary>

```text
# dsh-web-mobile-fix
[![awesome · DSH plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)

**English** | [简体中文](README.zh.md)

Mobile layout fixes for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web UI.

A pure client-side CSS overlay that repairs the worst mobile breakages on narrow (≤700px viewport) screens, without touching any product source:

- Settings panel becomes a full-screen column layout instead of a squeezed desktop layout
- Sidebar opens floating instead of squeezing the conversation
- Settings nav tabs fit on a single horizontal row
- Composer action bar fits on a single row without wrapping or layering

## How it works

The plugin ships a browser half (`exports["./client"]`, declared via `dsh.client.platform: "web"`), discovered by the client-modules scanner and loaded from the boot manifest. It injects one `<style>` tag with `@media (max-width: 700px)` overrides targeting the product's stable `data-slot` attributes, and removes the tag on unload — fully reversible.

## Requirements

- DeepSeek Harness Web profile (`dsh --profile web`), any recent 0.1.x release
- Selectors target product slot contracts; they are stable within a version line but may need small updates after a major product revamp

## Install

```

</details>

**依据 2 · 源码核查**：[lib/client.js:48-66](https://github.com/AcidGr/dsh-web-mobile-fix/blob/bba4d83bfb1aac90c209fb5602428cbb9bb3fcc7/lib/client.js#L48-L66)

设置规则实际为居中卡片且匹配通用dialog，不能照抄全屏设置描述

<details>
<summary>查看原文（19行）</summary>

```text
      "@media (max-width: 700px) {",
      "  /* 1. Settings panel: elegant centered floating modal card */",
      "  [role=\"dialog\"][aria-modal=\"true\"][aria-labelledby] {",
      "    flex-direction: column !important;",
      "    width: min(92vw, 440px) !important;",
      "    max-width: min(92vw, 440px) !important;",
      "    height: min(78vh, 78dvh, 620px) !important;",
      "    min-height: 420px !important;",
      "    max-height: min(86vh, 86dvh, 680px) !important;",
      "    border-radius: 20px !important;",
      "    background: rgba(28, 32, 42, 0.96) !important;",
      "    backdrop-filter: blur(28px) !important;",
      "    -webkit-backdrop-filter: blur(28px) !important;",
      "    border: 1px solid rgba(255, 255, 255, 0.14) !important;",
      "    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.08) !important;",
      "    overflow: hidden !important;",
      "    margin: auto !important;",
      "    display: flex !important;",
      "  }",
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · CSS选择器、overlay bridge及生命周期如何从入口形成完整调用链，依赖失效怎么办？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

插件的Node apply为空，Web加载器发现./client后注入style；窄屏CSS命中DOM槽位，overlay检测另加根标记、focus原型补丁、会话localStorage与桥接按钮。需要Web profile、对应DOM、客户端加载器；先安装刷新，再检查窄屏任务，有bridge才有完整悬浮操作，失败可停用并全页刷新。

URL检测使用字符串包含而非严格参数值；标记一旦设置未在effect中清除。样式范围既有窄屏也有overlay全屏规则，实际影响不局限于手机宽度。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-10](https://github.com/AcidGr/dsh-web-mobile-fix/blob/bba4d83bfb1aac90c209fb5602428cbb9bb3fcc7/lib/index.js#L1-L10)

Node入口没有服务端逻辑

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Mobile-fix node half. Pure UI plugin: the empty apply exists so the plugin
 * appears in the web profile's cordis.yml / Loader; the browser half ships via
 * exports["./client"], discovered through the package.json dsh.client
 * declaration.
 */

/** Host plugin body — no host-side behavior for this surface plugin. */
function apply() {}
export { apply };
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1058-1111](https://github.com/AcidGr/dsh-web-mobile-fix/blob/bba4d83bfb1aac90c209fb5602428cbb9bb3fcc7/lib/client.js#L1058-L1111)

检测overlay并全局替换focus

<details>
<summary>查看原文（54行）</summary>

```text
    function apply(ctx) {
      var checkOverlay = function () {
        if (typeof window === "undefined") return false;
        try {
          if (window.DSHOverlayBridge !== undefined || window.__DSH_OVERLAY__ === true) return true;
          var search = window.location && window.location.search;
          if (search && (search.indexOf("ov=") !== -1 || search.indexOf("overlay") !== -1)) return true;
        } catch (e) {}
        return false;
      };

      var isOverlayMode = checkOverlay();
      if (isOverlayMode) {
        document.documentElement.setAttribute("data-dsh-overlay", "true");
        window.__DSH_OVERLAY__ = true;

        // In mobile overlay mode, prevent auto-focus on input fields when switching sessions or clicking home.
        // Soft keyboard should ONLY pop up when user explicitly touches/clicks the input box!
        var userTouchingInputRecently = false;
        var userTouchingInputTimer = null;
        var recordUserTouch = function (e) {
          var target = e.target instanceof Element ? e.target : (e.target && e.target.parentElement);
          var isInputArea = target && target.closest && target.closest(
            'input, textarea, [contenteditable="true"], [role="textbox"], [data-lexical-editor], [data-composer-input], [class*="_input"]'
          );
          if (isInputArea) {
            userTouchingInputRecently = true;
            if (userTouchingInputTimer) clearTimeout(userTouchingInputTimer);
            userTouchingInputTimer = setTimeout(function () {
              userTouchingInputRecently = false;
            }, 350);
          } else {
            userTouchingInputRecently = false;
            if (userTouchingInputTimer) clearTimeout(userTouchingInputTimer);
          }
        };
        document.addEventListener("pointerdown", recordUserTouch, true);
        document.addEventListener("touchstart", recordUserTouch, true);
        document.addEventListener("mousedown", recordUserTouch, true);

        var origFocus = HTMLElement.prototype.focus;
        HTMLElement.prototype.focus = function (opts) {
          // If this is an input/textarea/contenteditable and it wasn't triggered by direct user touch ON THE INPUT BOX, suppress focus
          var isInputLike = this.matches && this.matches('input, textarea, [contenteditable="true"], [role="textbox"], [data-lexical-editor], [data-composer-input]');
          if (isInputLike && !userTouchingInputRecently) {
            return;
          }
          return origFocus.apply(this, arguments);
        };

        // Target session deep link & hot-switching support
        var getTargetSession = function () {
          try {
            var search = window.location && window.location.search;
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1113-1167](https://github.com/AcidGr/dsh-web-mobile-fix/blob/bba4d83bfb1aac90c209fb5602428cbb9bb3fcc7/lib/client.js#L1113-L1167)

深链接写localStorage并重试打开会话

<details>
<summary>查看原文（55行）</summary>

```text
              var params = new URLSearchParams(search);
              var s = params.get("session") || params.get("session_id") || params.get("s");
              if (s) return s;
            }
            var hash = window.location && window.location.hash;
            if (hash && hash.indexOf("session-") !== -1) {
              var m = hash.match(/(session-[a-z0-9-]+)/);
              if (m) return m[1];
            }
          } catch (e) {}
          return null;
        };

        var targetSessionFromUrl = getTargetSession();
        if (targetSessionFromUrl) {
          try {
            localStorage.setItem("dsh.sessions.current", JSON.stringify({ sessionId: targetSessionFromUrl }));
          } catch (e) {}
        }

        // Global hot-switch interface for Android WebView bridge
        window.DSH_SWITCH_SESSION = function (sessionId) {
          if (!sessionId) return false;
          try {
            localStorage.setItem("dsh.sessions.current", JSON.stringify({ sessionId: sessionId }));
            var uiWorkspace = ctx.get ? ctx.get("uiWorkspace") : (ctx.uiWorkspace || void 0);
            if (uiWorkspace && typeof uiWorkspace.openSession === "function") {
              uiWorkspace.openSession(sessionId);
              return true;
            }
          } catch (e) {
            console.warn("[dsh-web-mobile-fix] DSH_SWITCH_SESSION failed:", e);
          }
          return false;
        };

        if (targetSessionFromUrl) {
          var openRetries = 0;
          var tryOpenSession = function () {
            var uiWorkspace = ctx.get ? ctx.get("uiWorkspace") : (ctx.uiWorkspace || void 0);
            if (uiWorkspace && typeof uiWorkspace.openSession === "function") {
              uiWorkspace.openSession(targetSessionFromUrl);
            } else if (openRetries++ < 15) {
              setTimeout(tryOpenSession, 150);
            }
          };
          setTimeout(tryOpenSession, 100);
        }
      }

      var tag = document.createElement("style");
      tag.dataset.plugin = "dsh-web-mobile-fix";
      tag.textContent = CSS;
      document.head.append(tag);

```

</details>

**依据 4 · 源码核查**：[package.json:22-43](https://github.com/AcidGr/dsh-web-mobile-fix/blob/bba4d83bfb1aac90c209fb5602428cbb9bb3fcc7/package.json#L22-L43)

运行时与客户端声明

<details>
<summary>查看原文（22行）</summary>

```text
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    },
    "compatibility": {
      "dsh": ">=0.1.0",
      "dshReleases": {
        "0.1.2-alpha.2": "compatible",
        "0.1.2-alpha.3": "compatible",
        "0.1.2-alpha.4": "compatible",
        "0.1.2-alpha.5": "compatible",
        "0.1.2-rc.1": "compatible",
        "0.1.3-alpha.1": "compatible",
        "0.1.3-alpha.2": "compatible",
        "0.1.5-alpha.1": "compatible",
        "0.1.5-alpha.2": "compatible",
        "0.1.5-rc.1": "compatible",
        "0.1.5-rc.2": "compatible",
        "0.1.5-rc.3": "compatible",
        "0.1.6-alpha.1": "compatible",
        "0.1.6-alpha.2": "compatible",
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么实现边界最可能使移动网页布局修复的贡献不成立，哪些工程设计可复用？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

最影响可逆性主张的是全局focus补丁和监听的撤销不完整。源码保留origFocus但cleanup没有恢复，侧栏及触摸监听亦残留；未实际复现干扰，不能称已造成故障。集中样式注入可复用，但应补齐生命周期。

设置高度min-height 420px与动态视口上限可能在短屏冲突；侧栏隐藏中心而不是保持正文可见抽屉。工程可借鉴的是效果层集中注入和style标签移除，但作用域宽、空catch与全局原型补丁提高维护负担。当前代码没有恢复origFocus，cleanup只移除部分事件；若热重载重复apply，可能叠加残留闭包。需把代码事实与未复现后果分开。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1093-1111](https://github.com/AcidGr/dsh-web-mobile-fix/blob/bba4d83bfb1aac90c209fb5602428cbb9bb3fcc7/lib/client.js#L1093-L1111)

全局focus替换且闭包捕获用户触摸状态

<details>
<summary>查看原文（19行）</summary>

```text
        };
        document.addEventListener("pointerdown", recordUserTouch, true);
        document.addEventListener("touchstart", recordUserTouch, true);
        document.addEventListener("mousedown", recordUserTouch, true);

        var origFocus = HTMLElement.prototype.focus;
        HTMLElement.prototype.focus = function (opts) {
          // If this is an input/textarea/contenteditable and it wasn't triggered by direct user touch ON THE INPUT BOX, suppress focus
          var isInputLike = this.matches && this.matches('input, textarea, [contenteditable="true"], [role="textbox"], [data-lexical-editor], [data-composer-input]');
          if (isInputLike && !userTouchingInputRecently) {
            return;
          }
          return origFocus.apply(this, arguments);
        };

        // Target session deep link & hot-switching support
        var getTargetSession = function () {
          try {
            var search = window.location && window.location.search;
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1370-1401](https://github.com/AcidGr/dsh-web-mobile-fix/blob/bba4d83bfb1aac90c209fb5602428cbb9bb3fcc7/lib/client.js#L1370-L1401)

侧栏点击监听单独注册

<details>
<summary>查看原文（32行）</summary>

```text
      // Auto-collapse full-screen sidebar on mobile/overlay when a session, panel, plugin, or new session is selected
      var onSidebarItemClick = function (event) {
        var target = event.target instanceof Element ? event.target : (event.target && event.target.parentElement);
        if (!target) return;
        var frame = document.querySelector('[class*="_frame"]');
        if (!frame || frame.hasAttribute("data-sidebar-collapsed")) return;

        var isOverlay = document.documentElement.hasAttribute("data-dsh-overlay");
        var isNarrow = isOverlay || (window.innerWidth && window.innerWidth <= 700);
        if (!isNarrow) return;

        var autoCollapseTarget = target.closest && target.closest(
          '[class*="_sessionRow"], [class*="_searchResultRow"], ' +
          '[class*="_panelRow"], nav[class*="_panelList"] button, ' +
          'button[class*="_panelRow"], button[aria-label*="插件"], button[aria-label*="Plugin" i], ' +
          'button[class*="_newSession"], button[aria-label*="新会话"], button[aria-label*="新建会话"]'
        );
        if (autoCollapseTarget) {
          setTimeout(function () {
            try {
              var layout = ctx.get ? ctx.get("layout") : void 0;
              if (layout && typeof layout.toggleSidebar === "function") {
                var currentFrame = document.querySelector('[class*="_frame"]');
                if (currentFrame && !currentFrame.hasAttribute("data-sidebar-collapsed")) {
                  layout.toggleSidebar();
                }
              }
            } catch (e) {}
          }, 80);
        }
      };
      document.addEventListener("click", onSidebarItemClick, false);
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1440-1455](https://github.com/AcidGr/dsh-web-mobile-fix/blob/bba4d83bfb1aac90c209fb5602428cbb9bb3fcc7/lib/client.js#L1440-L1455)

cleanup移除部分监听，未恢复focus和触摸/侧栏监听

<details>
<summary>查看原文（16行）</summary>

```text
      ctx.effect(function () {
        return function () {
          tag.remove();
          if (whaleBtn && whaleBtn.parentNode) whaleBtn.parentNode.removeChild(whaleBtn);
          if (closeBtn && closeBtn.parentNode) closeBtn.parentNode.removeChild(closeBtn);
          if (homeBtn && homeBtn.parentNode) homeBtn.parentNode.removeChild(homeBtn);
          if (backToChatBtn && backToChatBtn.parentNode) backToChatBtn.parentNode.removeChild(backToChatBtn);
          document.removeEventListener("click", onOverlayClick, true);
          document.removeEventListener("focusin", onComposerFocus, true);
          if (typeof window !== "undefined") {
            if (window.visualViewport) {
              window.visualViewport.removeEventListener("resize", onViewportResize);
            }
            window.removeEventListener("resize", onViewportResize);
          }
        };
```

</details>

**依据 4 · 源码核查**：[lib/client.js:159-177](https://github.com/AcidGr/dsh-web-mobile-fix/blob/bba4d83bfb1aac90c209fb5602428cbb9bb3fcc7/lib/client.js#L159-L177)

展开侧栏时隐藏中心区域

<details>
<summary>查看原文（19行）</summary>

```text
      "  /* 3. Expanded sidebar on narrow screens: take 100% full width and collapse center */",
      "  [class*=\"_frame\"]:not([data-sidebar-collapsed]) {",
      "    grid-template-columns: 100% 0px 0px !important;",
      "  }",
      "  [class*=\"_frame\"]:not([data-sidebar-collapsed]) [class*=\"_sidebarCol\"] {",
      "    width: 100% !important;",
      "    min-width: 100% !important;",
      "    max-width: 100% !important;",
      "    overflow: hidden !important;",
      "    z-index: 60 !important;",
      "  }",
      "  [class*=\"_frame\"]:not([data-sidebar-collapsed]) [class*=\"_centerCol\"] {",
      "    width: 0 !important;",
      "    min-width: 0 !important;",
      "    max-width: 0 !important;",
      "    overflow: hidden !important;",
      "    visibility: hidden !important;",
      "    opacity: 0 !important;",
      "    pointer-events: none !important;",
```

</details>

#### 缺口

- 宿主DOM和辅助技术实际组合未核查
  **影响**：无法判定选择器命中及键盘影响覆盖
  **进一步探讨**：可比较窄屏/overlay、键盘与读屏完成同任务的结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？

**研究主题**：效果与总成本

#### 完整回答

首次采用需安装并核对手机尺寸、键盘与DOM命中，持续成本是浏览器渲染/监听与升级回归，失败成本是停用、刷新及恢复焦点。现金、耗时和耗电都无实测；效果只能确认覆盖与桥接存在，不能确认任务更快。

计量单位应是手机上完成一次会话切换及发送、或一次设置保存；应记录失败重试、刷新和宿主升级复核。源码没有金额、耗时或耗电对照，不能称免费、零成本或已节省操作。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1403-1437](https://github.com/AcidGr/dsh-web-mobile-fix/blob/bba4d83bfb1aac90c209fb5602428cbb9bb3fcc7/lib/client.js#L1403-L1437)

聚焦及视口变化触发多次定时滚动

<details>
<summary>查看原文（35行）</summary>

```text
      // Auto-scroll chat bubbles to bottom when soft keyboard pops up or composer is focused
      var scrollChatToBottom = function () {
        if (!document.documentElement.hasAttribute("data-dsh-overlay")) return;
        var scroller = document.querySelector('[data-conversation-scroll], [class*="_scrollBody"], [class*="_scroll"]');
        if (scroller) {
          scroller.scrollTop = scroller.scrollHeight;
        }
      };

      var onComposerFocus = function (e) {
        if (!document.documentElement.hasAttribute("data-dsh-overlay")) return;
        var target = e.target;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable || (target.closest && target.closest('[data-composer-card], [class*="_card"]')))) {
          scrollChatToBottom();
          setTimeout(scrollChatToBottom, 100);
          setTimeout(scrollChatToBottom, 250);
          setTimeout(scrollChatToBottom, 400);
        }
      };
      document.addEventListener("focusin", onComposerFocus, true);

      var onViewportResize = function () {
        if (!document.documentElement.hasAttribute("data-dsh-overlay")) return;
        var active = document.activeElement;
        if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable || (active.closest && active.closest('[data-composer-card], [class*="_card"]')))) {
          scrollChatToBottom();
          setTimeout(scrollChatToBottom, 100);
          setTimeout(scrollChatToBottom, 250);
        }
      };
      if (typeof window !== "undefined") {
        if (window.visualViewport) {
          window.visualViewport.addEventListener("resize", onViewportResize);
        }
        window.addEventListener("resize", onViewportResize);
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1440-1455](https://github.com/AcidGr/dsh-web-mobile-fix/blob/bba4d83bfb1aac90c209fb5602428cbb9bb3fcc7/lib/client.js#L1440-L1455)

退出恢复负担与清理覆盖相关

<details>
<summary>查看原文（16行）</summary>

```text
      ctx.effect(function () {
        return function () {
          tag.remove();
          if (whaleBtn && whaleBtn.parentNode) whaleBtn.parentNode.removeChild(whaleBtn);
          if (closeBtn && closeBtn.parentNode) closeBtn.parentNode.removeChild(closeBtn);
          if (homeBtn && homeBtn.parentNode) homeBtn.parentNode.removeChild(homeBtn);
          if (backToChatBtn && backToChatBtn.parentNode) backToChatBtn.parentNode.removeChild(backToChatBtn);
          document.removeEventListener("click", onOverlayClick, true);
          document.removeEventListener("focusin", onComposerFocus, true);
          if (typeof window !== "undefined") {
            if (window.visualViewport) {
              window.visualViewport.removeEventListener("resize", onViewportResize);
            }
            window.removeEventListener("resize", onViewportResize);
          }
        };
```

</details>

#### 缺口

- 端到端操作时间、掉帧和维护工时无数据
  **影响**：不能量化净收益
  **进一步探讨**：同设备同任务对照原生布局与插件，分记操作及恢复时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可从CSS选择器、overlay bridge及生命周期的限制推导什么可证伪改进？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把悬浮行为收进有所有者的可撤销适配器，统一回收原型补丁、监听和计时器。应以反复加载/停用、键盘导航和插件并存对照原版，只有焦点/监听恢复且触控未退步才支持；残留不降或兼容性变差即否定。

推导来自注入易回滚和原型补丁难回滚之间的不对称。适配器应保存前置值并只在自身仍拥有补丁时恢复，避免覆盖后加载插件；监听/定时器统一dispose，URL模式严格解析。新增代价是生命周期管理与多插件共存测试，不能把设计复杂性当收益。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1093-1111](https://github.com/AcidGr/dsh-web-mobile-fix/blob/bba4d83bfb1aac90c209fb5602428cbb9bb3fcc7/lib/client.js#L1093-L1111)

原focus已捕获但未用于撤销，支持设计改进切入点

<details>
<summary>查看原文（19行）</summary>

```text
        };
        document.addEventListener("pointerdown", recordUserTouch, true);
        document.addEventListener("touchstart", recordUserTouch, true);
        document.addEventListener("mousedown", recordUserTouch, true);

        var origFocus = HTMLElement.prototype.focus;
        HTMLElement.prototype.focus = function (opts) {
          // If this is an input/textarea/contenteditable and it wasn't triggered by direct user touch ON THE INPUT BOX, suppress focus
          var isInputLike = this.matches && this.matches('input, textarea, [contenteditable="true"], [role="textbox"], [data-lexical-editor], [data-composer-input]');
          if (isInputLike && !userTouchingInputRecently) {
            return;
          }
          return origFocus.apply(this, arguments);
        };

        // Target session deep link & hot-switching support
        var getTargetSession = function () {
          try {
            var search = window.location && window.location.search;
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1440-1455](https://github.com/AcidGr/dsh-web-mobile-fix/blob/bba4d83bfb1aac90c209fb5602428cbb9bb3fcc7/lib/client.js#L1440-L1455)

现有effect清理可作为统一dispose挂载点

<details>
<summary>查看原文（16行）</summary>

```text
      ctx.effect(function () {
        return function () {
          tag.remove();
          if (whaleBtn && whaleBtn.parentNode) whaleBtn.parentNode.removeChild(whaleBtn);
          if (closeBtn && closeBtn.parentNode) closeBtn.parentNode.removeChild(closeBtn);
          if (homeBtn && homeBtn.parentNode) homeBtn.parentNode.removeChild(homeBtn);
          if (backToChatBtn && backToChatBtn.parentNode) backToChatBtn.parentNode.removeChild(backToChatBtn);
          document.removeEventListener("click", onOverlayClick, true);
          document.removeEventListener("focusin", onComposerFocus, true);
          if (typeof window !== "undefined") {
            if (window.visualViewport) {
              window.visualViewport.removeEventListener("resize", onViewportResize);
            }
            window.removeEventListener("resize", onViewportResize);
          }
        };
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些用户可以受控采用移动网页布局修复，何时应停止？

**研究主题**：采用判断

#### 完整回答

建议观察，适合确有窄屏痛点且能用非关键profile核对的用户；依赖无障碍焦点、热卸载或多个focus插件者暂缓。试用验收应覆盖设置保存、切会话、发消息和停用后刷新；出现聚焦失效或页面截断就停止。

布局便利的证据仅为固定源码实现，作者的兼容版本表没有本轮独立验收。停止条件包括输入无法聚焦、设置被截断、停用后仍自动收侧栏或键盘导航失效；退出采用完整页面刷新，不承诺热卸载恢复。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-25](https://github.com/AcidGr/dsh-web-mobile-fix/blob/bba4d83bfb1aac90c209fb5602428cbb9bb3fcc7/README.md#L19-L25)

兼容范围为作者说明

```text
## Requirements

- DeepSeek Harness Web profile (`dsh --profile web`), any recent 0.1.x release
- Selectors target product slot contracts; they are stable within a version line but may need small updates after a major product revamp

## Install

```

**依据 2 · 源码核查**：[lib/client.js:1440-1455](https://github.com/AcidGr/dsh-web-mobile-fix/blob/bba4d83bfb1aac90c209fb5602428cbb9bb3fcc7/lib/client.js#L1440-L1455)

恢复限制影响采用结论

<details>
<summary>查看原文（16行）</summary>

```text
      ctx.effect(function () {
        return function () {
          tag.remove();
          if (whaleBtn && whaleBtn.parentNode) whaleBtn.parentNode.removeChild(whaleBtn);
          if (closeBtn && closeBtn.parentNode) closeBtn.parentNode.removeChild(closeBtn);
          if (homeBtn && homeBtn.parentNode) homeBtn.parentNode.removeChild(homeBtn);
          if (backToChatBtn && backToChatBtn.parentNode) backToChatBtn.parentNode.removeChild(backToChatBtn);
          document.removeEventListener("click", onOverlayClick, true);
          document.removeEventListener("focusin", onComposerFocus, true);
          if (typeof window !== "undefined") {
            if (window.visualViewport) {
              window.visualViewport.removeEventListener("resize", onViewportResize);
            }
            window.removeEventListener("resize", onViewportResize);
          }
        };
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
