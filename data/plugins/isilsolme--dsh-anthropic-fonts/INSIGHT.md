# DSH Anthropic Fonts

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[4bf1d25](https://github.com/Isilsolme/dsh-anthropic-fonts/tree/4bf1d25d25e2a89a0a4285928ea98913dc82e5c5)

<!-- BEGIN META -->
[![GitHub ★ 31](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=31&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Isilsolme/dsh-anthropic-fonts) [![npm 30d 2,239](https://img.shields.io/static/v1?label=npm+30d&message=2%2C239&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-anthropic-fonts) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-anthropic-fonts)
<!-- END META -->

> **功能**：为 DSH Web 界面、Markdown 对话和代码设置不同字体族及回退。

> **亮点**：用同一浏览器插件分别设置 UI、对话和代码字体，延用多个宿主排版分量，见 [Q02](#research-q02)。

> **主要限制**：CSS 变量存在不保证指定字体可用，字体覆盖和宿主样式优先级仍需验算，见 [Q03](#research-q03)。

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
  - [Q01 · 何种需求适合安装字体插件？](#detail-section-11)
  - [Q02 · 浏览器如何装配、回退及移除？](#detail-section-12)
  - [Q03 · 为何启用后可能还是显示系统字体？](#detail-section-13)
  - [Q04 · 怎样判断字体变更符合要求？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合希望分别调整 DSH Web 界面、对话和代码字体的个人用户，见 [Q01](#research-q01)。

以宿主外观设置或已有 CSS 为对照，比较能否保持字号、字重和行高，见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 独立字体族 | 调整界面、对话及代码显示 | 需本机字体与 Web token，缺失时回退 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 和模块加载器 | 需要 | 加载 CSS 注入入口 | 无样式变化 |
| 本机已安装对应字体 | 实际采用指定字体需要 | 浏览器匹配字形 | 使用列表里的回退 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 试用 | 隔离 profile，保留原字号 | 核对标题、代码和中文 |
| 退出 | 卸载并刷新 | 原设置重新生效 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 入门 | 本地资产 | 核字体和宿主 | 耗时待测 |
| 持续 | 浏览器样式 | 回退对照 | 无测量 |
| 退出 | 恢复 CSS | 复查原字型 | 无需服务端数据迁移的实现路径 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 字体替换 | 写入族及排版变量 | 实际字形和可读性 |
| 恢复 | 清理 style | 目标宿主卸载实效 |

> **思考**：CSS 变量存在不保证指定字体可用，字体覆盖和宿主样式优先级仍需验算，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：用同一浏览器插件分别设置 UI、对话和代码字体，延用多个宿主排版分量，见 [Q02](#research-q02)。

仅一个 CSS 注入 effect，逻辑易检查，主题 token 的后续变动影响范围，见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

CSS 变量存在不保证指定字体可用，字体覆盖和宿主样式优先级仍需验算，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有现成字体时在独立页面检查实际字形及大小。未达到预期就移除样式返回宿主配置，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持字体样式注入和移除。本次未执行固定宿主和字体实际渲染验收。

- 已检查：作者 README、包清单、源码路径 cordis.patch.yml、README.md、lib/client.js、package.json、lib/index.js、LICENSE 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定发布 JavaScript 与作者说明，未执行目标宿主、安装或字体授权核验。
- 下一步：同一消息逐项比较字形、尺寸和撤销，见 [Q04](#research-q04)。

**分析版本**

- **仓库**：[Isilsolme/dsh-anthropic-fonts](https://github.com/Isilsolme/dsh-anthropic-fonts)
- **版本号**：0.3.0（[固定提交 4bf1d25](https://github.com/Isilsolme/dsh-anthropic-fonts/tree/4bf1d25d25e2a89a0a4285928ea98913dc82e5c5)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

为实际字体缺失及 token 漂移提供诊断提示，比较排查时间和误判，见 [Q04](#research-q04)。

同一消息逐项比较字形、尺寸和撤销，见 [Q04](#research-q04)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 99 | 79 | 12 | — |
| .md | source | 2 | 372 | — | — | 2803 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-17），可前往 [GitHub Issues](https://github.com/Isilsolme/dsh-anthropic-fonts/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH Web 用户能否替换三类字体而保留宿主排版，缺字体和卸载后发生什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何种需求适合安装字体插件？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

希望 DSH Web 区分界面、衬线对话和等宽代码的用户，可用同一则中英混合消息试验。相比在设置中直接换正文与代码族，增量是按宿主 Markdown 样式分开对话字体，并为多种强调样式统一重建字体简写。只想放大字体的用户用原有字号设置更直接。验收分别读 UI、标题、强调、表格和代码的计算样式，并检查字形实际渲染。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-29](https://github.com/Isilsolme/dsh-anthropic-fonts/blob/4bf1d25d25e2a89a0a4285928ea98913dc82e5c5/README.md#L9-L29)

作者描述字型、语言及回退。

<details>
<summary>查看原文（21行）</summary>

```text
- **代码 / 代码块**：`Anthropic Mono Variable`

中文回退到思源字体（`Noto Sans SC` / `Source Han Sans SC` / `Noto Serif SC`），未安装时回退到系统字体（苹方 / 微软雅黑 / 宋体）。

## 字体

> **重要：插件不内置字体**。npm 包不随包分发字体文件；安装插件后还需手动安装字体（见下表），然后刷新 / 重启 web 才会生效。

插件引用的三个 Anthropic 拉丁字体（建议安装，英文 / 代码效果最佳）：

| 字体 | 用途 | 获取方式 |
|---|---|---|
| Anthropic Sans Web Text | 界面 | 仓库 [`fonts/`](fonts/) 下载，或从 Claude 应用提取 |
| Anthropic Serif Web Text | 模型对话 | 仓库 [`fonts/`](fonts/) 下载，或从 Claude 应用提取 |
| Anthropic Mono Variable | 代码 | 仓库 [`fonts/`](fonts/) 下载，或从 Claude 应用提取 |

安装：Windows 双击每个 `.ttf` → 点「安装」；macOS 用「字体册」导入。安装后**刷新 / 重启 web** 生效。

> 字体版权归 Anthropic 所有，仅供个人使用，不适用 MIT 许可（详见 [LICENSE](LICENSE) 字体声明）。

中文无需额外安装：会回退到思源黑体 / 宋体（Noto Sans/Serif SC、Source Han），没有则用系统字体。
```

</details>

**依据 2 · 源码核查**：[lib/client.js:19-31](https://github.com/Isilsolme/dsh-anthropic-fonts/blob/4bf1d25d25e2a89a0a4285928ea98913dc82e5c5/lib/client.js#L19-L31)

界面与代码两层 token、Markdown 简写。

<details>
<summary>查看原文（13行）</summary>

```text
    var ROOT =
      "html:root{" +
      "--dsh-font-family-text:" + SANS + ";" +
      "--dsh-font-family-code:" + MONO + ";" +
      "--dsw-font-family:" + SANS + ";" +
      "--ds-font-family-code:" + MONO + ";" +
      "--dsw-font-serif:" + SERIF +
      "}";

    // 0.2.x 起 Markdown 正文与标题都走 font 简写 token（font:var(--dsw-font-markdown-h1)），
    // 字体族已经烧进简写里，单独的 --dsw-font-markdown-*-font-family 不再被任何选择器读取。
    // 这里用宿主自己的 style / weight / size / line-height 分量重建简写：字号行高继续跟随 DSH
    // （含设置里的字号调整），只把字体族换成衬线。分量缺失时回退到 DSH 的默认值。
```

</details>

**依据 3 · 源码核查**：[lib/client.js:54-73](https://github.com/Isilsolme/dsh-anthropic-fonts/blob/4bf1d25d25e2a89a0a4285928ea98913dc82e5c5/lib/client.js#L54-L73)

按变体覆盖字体族并复用宿主分量。

<details>
<summary>查看原文（20行）</summary>

```text
    function part(variant, field, fallback) {
      return "var(--dsw-font-markdown-" + variant + "-" + field + "," + fallback + ")";
    }

    function markdownTokens() {
      var decls = [];
      for (var i = 0; i < VARIANTS.length; i++) {
        var variant = VARIANTS[i][0];
        // 0.1.x 的选择器读的是这个族 token；0.2.x 已没有选择器读它，保留不影响新版本。
        decls.push("--dsw-font-markdown-" + variant + "-font-family:var(--dsw-font-serif)");
        decls.push(
          "--dsw-font-markdown-" + variant + ":" +
            part(variant, "font-style", VARIANTS[i][1]) + " " +
            part(variant, "font-weight", VARIANTS[i][2]) + " " +
            part(variant, "font-size", VARIANTS[i][3]) + "/" +
            part(variant, "line-height", VARIANTS[i][4]) + " " +
            "var(--dsw-font-serif)"
        );
      }
      return "html body{" + decls.join(";") + "}";
```

</details>

#### 缺口

- 未比较真实可读性
  **影响**：结论仅限样式机制
  **进一步探讨**：用相同文本对照原外观设置

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 浏览器如何装配、回退及移除？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

包补丁载入宿主壳，Web 客户端声明立即启用。实际入口在宿主 ModuleLoader 注册，壳没有后台行为。CSS 写两代宿主的字体族变量，不直接逐段插入样式，Markdown 简写通过 var 从宿主读样式、字重、字号及行高，无值时才用定义中的回退。无 document 提前返回，已有同 ID 样式不重复插入，effect 处置移除原 style。若将来宿主不再引用这些 token 或更高优先级覆盖，标签存在也不代表视觉起效。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:15-48](https://github.com/Isilsolme/dsh-anthropic-fonts/blob/4bf1d25d25e2a89a0a4285928ea98913dc82e5c5/package.json#L15-L48)

发布入口和 Web 生命周期声明。

<details>
<summary>查看原文（34行）</summary>

```text
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md",
    "README.en.md",
    "LICENSE"
  ],
  "keywords": [
    "dsh",
    "deepseek-harness",
    "dsh-plugin",
    "cordis",
    "web-ui",
    "font",
    "anthropic"
  ],
  "engines": {
    "node": ">=22",
    "dsh": ">=0.1.0-rc.7 <0.3.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [],
      "platform": "web",
      "immediately": true
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1-3](https://github.com/Isilsolme/dsh-anthropic-fonts/blob/4bf1d25d25e2a89a0a4285928ea98913dc82e5c5/lib/index.js#L1-L3)

宿主壳无主要逻辑。

```text
/** Host half is intentionally empty; the font effect is browser-only. */
export const name = 'dsh-anthropic-fonts'
export function apply() {}
```

**依据 3 · 源码核查**：[lib/client.js:1-31](https://github.com/Isilsolme/dsh-anthropic-fonts/blob/4bf1d25d25e2a89a0a4285928ea98913dc82e5c5/lib/client.js#L1-L31)

模块载入、字体层与规则。

<details>
<summary>查看原文（31行）</summary>

```text
window.__ModuleLoader__.load({
  id: "dsh-anthropic-fonts",
  factory: function (require) {
    var module = { exports: {} };
    var exports = module.exports;

    // 只覆盖字体族，字号 / 行高 / 字重全部交给 DSH 自己的排版 token。
    var SANS =
      "'Anthropic Sans Web Text','Noto Sans SC','Source Han Sans SC',-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei','Helvetica Neue',Helvetica,Arial,sans-serif";
    var SERIF =
      "'Anthropic Serif Web Text',Georgia,'Times New Roman','Noto Serif SC','Source Han Serif SC','Songti SC','SimSun',serif";
    var MONO =
      "'Anthropic Mono Variable','Source Han Sans SC',ui-monospace,'SF Mono','JetBrains Mono','Fira Code',Consolas,'Liberation Mono',Menlo,Courier,monospace";

    // DSH >= 0.2 的排版分两层：--dsh-font-family-{text,code} 是唯一事实来源（设置里的
    // 「正文字体 / 代码字体」写的就是它们），theme 再在 body 上把它们拼进 --dsw-font-family /
    // --ds-font-family-code。所以必须覆盖 --dsh-* 这一层：只写 --dsw-font-family 会被 body 上那条
    // 派生声明盖掉（0.1.x 没有 --dsh-* 层，故两套都写，两条曲线同时可用）。
    var ROOT =
      "html:root{" +
      "--dsh-font-family-text:" + SANS + ";" +
      "--dsh-font-family-code:" + MONO + ";" +
      "--dsw-font-family:" + SANS + ";" +
      "--ds-font-family-code:" + MONO + ";" +
      "--dsw-font-serif:" + SERIF +
      "}";

    // 0.2.x 起 Markdown 正文与标题都走 font 简写 token（font:var(--dsw-font-markdown-h1)），
    // 字体族已经烧进简写里，单独的 --dsw-font-markdown-*-font-family 不再被任何选择器读取。
    // 这里用宿主自己的 style / weight / size / line-height 分量重建简写：字号行高继续跟随 DSH
    // （含设置里的字号调整），只把字体族换成衬线。分量缺失时回退到 DSH 的默认值。
```

</details>

**依据 4 · 源码核查**：[lib/client.js:54-89](https://github.com/Isilsolme/dsh-anthropic-fonts/blob/4bf1d25d25e2a89a0a4285928ea98913dc82e5c5/lib/client.js#L54-L89)

简写构造、去重和卸载。

<details>
<summary>查看原文（36行）</summary>

```text
    function part(variant, field, fallback) {
      return "var(--dsw-font-markdown-" + variant + "-" + field + "," + fallback + ")";
    }

    function markdownTokens() {
      var decls = [];
      for (var i = 0; i < VARIANTS.length; i++) {
        var variant = VARIANTS[i][0];
        // 0.1.x 的选择器读的是这个族 token；0.2.x 已没有选择器读它，保留不影响新版本。
        decls.push("--dsw-font-markdown-" + variant + "-font-family:var(--dsw-font-serif)");
        decls.push(
          "--dsw-font-markdown-" + variant + ":" +
            part(variant, "font-style", VARIANTS[i][1]) + " " +
            part(variant, "font-weight", VARIANTS[i][2]) + " " +
            part(variant, "font-size", VARIANTS[i][3]) + "/" +
            part(variant, "line-height", VARIANTS[i][4]) + " " +
            "var(--dsw-font-serif)"
        );
      }
      return "html body{" + decls.join(";") + "}";
    }

    var css = ROOT + markdownTokens();

    function apply(ctx) {
      if (typeof document === "undefined") return;
      var tagId = "dsh-anthropic-fonts/fonts.css";
      if (document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") !== null) return;
      var tag = document.createElement("style");
      tag.dataset.plugin = "dsh-anthropic-fonts";
      tag.dataset.pluginCss = tagId;
      tag.textContent = css;
      document.head.appendChild(tag);
      ctx.effect(function () {
        return function () { tag.remove(); };
      });
```

</details>

#### 缺口

- 未运行目标浏览器
  **影响**：真实样式和处置顺序需复测
  **进一步探讨**：比较安装前后再卸载的计算样式及 style 数量

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 为何启用后可能还是显示系统字体？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

包发布列表没有 fonts，Web 实现只声明字体族，没有 font-face 下载。因此系统没有对应字体名时会选列表里的中文或系统回退，计算样式展示字体列表也不能证明指定实际字形被使用。仓库的字体声明称这些字型为第三方专有内容且不在 MIT 软件许可之内，不能据软件许可推断可统一分发。README 报告旧宿主组合的安装及浏览器检查，本轮仅读作者材料，注册表包、覆盖范围和实际版本尚未确认。成本集中在本地字体和宿主版本核对，低频退路是移除样式并恢复默认。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:21-27](https://github.com/Isilsolme/dsh-anthropic-fonts/blob/4bf1d25d25e2a89a0a4285928ea98913dc82e5c5/package.json#L21-L27)

发布清单未包含 fonts。

```text
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md",
    "README.en.md",
    "LICENSE"
  ],
```

**依据 2 · 源码核查**：[lib/client.js:7-13](https://github.com/Isilsolme/dsh-anthropic-fonts/blob/4bf1d25d25e2a89a0a4285928ea98913dc82e5c5/lib/client.js#L7-L13)

只设字体族和回退。

```text
    // 只覆盖字体族，字号 / 行高 / 字重全部交给 DSH 自己的排版 token。
    var SANS =
      "'Anthropic Sans Web Text','Noto Sans SC','Source Han Sans SC',-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei','Helvetica Neue',Helvetica,Arial,sans-serif";
    var SERIF =
      "'Anthropic Serif Web Text',Georgia,'Times New Roman','Noto Serif SC','Source Han Serif SC','Songti SC','SimSun',serif";
    var MONO =
      "'Anthropic Mono Variable','Source Han Sans SC',ui-monospace,'SF Mono','JetBrains Mono','Fira Code',Consolas,'Liberation Mono',Menlo,Courier,monospace";
```

**依据 3 · 源码核查**：[LICENSE:25-29](https://github.com/Isilsolme/dsh-anthropic-fonts/blob/4bf1d25d25e2a89a0a4285928ea98913dc82e5c5/LICENSE#L25-L29)

仓库字体额外声明。

```text
Font files notice: `fonts/AnthropicSansWebText.ttf`, `fonts/AnthropicSerifWebText.ttf`
and `fonts/AnthropicMonoVariable.ttf` are proprietary typefaces of Anthropic,
extracted from Anthropic's web products. They are included in this repository
for personal use only and are **not** covered by the MIT license above; all
rights remain with Anthropic. The npm package does not ship these files.
```

**依据 4 · 作者声明**：[README.md:107-127](https://github.com/Isilsolme/dsh-anthropic-fonts/blob/4bf1d25d25e2a89a0a4285928ea98913dc82e5c5/README.md#L107-L127)

作者记录固定宿主组合的检查。

<details>
<summary>查看原文（21行）</summary>

````text
已验证版本（一次性 Profile，`DSH_HOME` 指向临时目录，不触碰真实 Profile）：

| DSH 版本 | 安装 | 启动 | 卸载 |
|---|---|---|---|
| 0.1.5-alpha.2 | ✅ | ✅ | ✅ |
| 0.1.5-rc.1 | ✅ | ✅ | ✅ |
| 0.1.5-rc.2 | ✅ | ✅ | ✅ |
| 0.2.1-rc.5 | ✅ | ✅ | ✅ |

0.2.1-rc.5 额外做了浏览器内验收：在真实页面里读取计算样式，界面 `--dsw-font-family` 为 Anthropic Sans，Markdown 容器 / h1–h4 / p / strong / em / 表格为 Anthropic Serif，行内代码与代码块为 Anthropic Mono，且字号、行高、字重与 DSH 默认值逐项一致（h1 21px/700/30px、正文 14px/24px、表格 13px/22px 等）。

验证步骤（每个版本各跑一次）：

```sh
DSH_HOME=/tmp/dsh-smoke dsh plugin --profile web add /path/to/dsh-anthropic-fonts  # 安装
DSH_HOME=/tmp/dsh-smoke dsh --profile web --dump-config                            # 入口 anthropic-fonts 出现在组合配置里
DSH_HOME=/tmp/dsh-smoke dsh --profile web --port 39123 --no-open                   # 启动并输出访问地址
DSH_HOME=/tmp/dsh-smoke dsh plugin --profile web remove dsh-anthropic-fonts        # 卸载
```

覆盖到的证据：依赖写入 profile、bundle 追加进 `dsh.profile.bundles`、bundle patch 插入入口 `anthropic-fonts`（且没被兼容性 preflight 禁用）、web 服务正常监听并返回页面（启动载荷里已注册 `dsh-anthropic-fonts/client.js`）、卸载后依赖与 bundle 行都被移除。**未覆盖**：独立安全审计。
````

</details>

#### 缺口

- 缺注册表包及字体权利独立核验
  **影响**：不支持组织统一分发判断
  **进一步探讨**：有现成字体的个人环境仅核样式和回落

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样判断字体变更符合要求？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先记录一则带标题、代码、表格与中文的消息。用同一浏览器、字号和消息比较原生及插件，既看 computed style，也确认实际渲染字体、代码列与截断。已具字体条件可用隔离 Web profile 尝试，缺字体又只想改变字号时先用宿主外观。可增加只读诊断列，提示字体家族没有匹配或宿主 token 没被消费，以降低排障时间。若提示不能区分 fallback 与正常字体，或引入闪动与耗时，则保留现有简单方案。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:31-73](https://github.com/Isilsolme/dsh-anthropic-fonts/blob/4bf1d25d25e2a89a0a4285928ea98913dc82e5c5/lib/client.js#L31-L73)

不同变体与回退条件适于比较。

<details>
<summary>查看原文（43行）</summary>

```text
    // （含设置里的字号调整），只把字体族换成衬线。分量缺失时回退到 DSH 的默认值。
    var DELTA = "var(--dsh-content-font-delta)";
    var DELTA_2 = "var(--dsh-content-font-delta-secondary,0px)";
    var SIZE = "var(--dsh-content-font-size,14px)";
    var SIZE_2 = "var(--dsh-content-font-size-secondary,13px)";
    // [variant, font-style, font-weight, font-size, line-height]
    var VARIANTS = [
      ["h1", "normal", "700", "calc(21px + " + DELTA + ")", "calc(30px + " + DELTA + ")"],
      ["h2", "normal", "700", "calc(19px + " + DELTA + ")", "calc(28px + " + DELTA + ")"],
      ["h3", "normal", "700", "calc(18px + " + DELTA + ")", "calc(26px + " + DELTA + ")"],
      ["h4", "normal", "600", SIZE, "calc(24px + " + DELTA + ")"],
      ["base", "normal", "400", SIZE, "calc(24px + " + DELTA + ")"],
      ["base-strong", "normal", "600", SIZE, "calc(24px + " + DELTA + ")"],
      ["base-italic", "italic", "400", SIZE, "calc(24px + " + DELTA + ")"],
      ["base-strong-italic", "italic", "600", SIZE, "calc(24px + " + DELTA + ")"],
      ["table", "normal", "400", SIZE_2, "calc(22px + " + DELTA_2 + ")"],
      ["table-head", "normal", "500", SIZE_2, "calc(22px + " + DELTA_2 + ")"],
      ["small", "normal", "400", "12px", "20px"],
      ["small-strong", "normal", "600", "12px", "20px"],
      ["small-italic", "italic", "400", "12px", "20px"],
      ["small-strong-italic", "italic", "600", "12px", "20px"]
    ];

    function part(variant, field, fallback) {
      return "var(--dsw-font-markdown-" + variant + "-" + field + "," + fallback + ")";
    }

    function markdownTokens() {
      var decls = [];
      for (var i = 0; i < VARIANTS.length; i++) {
        var variant = VARIANTS[i][0];
        // 0.1.x 的选择器读的是这个族 token；0.2.x 已没有选择器读它，保留不影响新版本。
        decls.push("--dsw-font-markdown-" + variant + "-font-family:var(--dsw-font-serif)");
        decls.push(
          "--dsw-font-markdown-" + variant + ":" +
            part(variant, "font-style", VARIANTS[i][1]) + " " +
            part(variant, "font-weight", VARIANTS[i][2]) + " " +
            part(variant, "font-size", VARIANTS[i][3]) + "/" +
            part(variant, "line-height", VARIANTS[i][4]) + " " +
            "var(--dsw-font-serif)"
        );
      }
      return "html body{" + decls.join(";") + "}";
```

</details>

**依据 2 · 源码核查**：[lib/client.js:78-89](https://github.com/Isilsolme/dsh-anthropic-fonts/blob/4bf1d25d25e2a89a0a4285928ea98913dc82e5c5/lib/client.js#L78-L89)

可检查实际注入及移除。

<details>
<summary>查看原文（12行）</summary>

```text
    function apply(ctx) {
      if (typeof document === "undefined") return;
      var tagId = "dsh-anthropic-fonts/fonts.css";
      if (document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") !== null) return;
      var tag = document.createElement("style");
      tag.dataset.plugin = "dsh-anthropic-fonts";
      tag.dataset.pluginCss = tagId;
      tag.textContent = css;
      document.head.appendChild(tag);
      ctx.effect(function () {
        return function () { tag.remove(); };
      });
```

</details>

#### 缺口

- 未测试可用性或诊断假设
  **影响**：仅建议可逆试用
  **进一步探讨**：校验每一类元素的实际字形和尺寸

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
