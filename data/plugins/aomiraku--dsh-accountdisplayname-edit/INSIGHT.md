# dsh-accountdisplayname-edit

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[9391df1](https://github.com/AomiRaku/dsh-accountDisplayName-edit/tree/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AomiRaku/dsh-accountDisplayName-edit) [![npm 30d 596](https://img.shields.io/static/v1?label=npm+30d&message=596&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-accountdisplayname-edit) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-accountdisplayname-edit)
<!-- END META -->

> **功能**：在 DSH 侧栏本地自定义账号显示名称和头像。

> **亮点**：[Q01](#research-q01) 提供侧栏本地替代显示，[Q02](#research-q02) 将其保存于浏览器。

> **主要限制**：[Q03](#research-q03) 名称与头像分开保存并可能部分成功；[Q01](#research-q01) 不证明全页面隐私。

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
  - [Q01 · 谁需要改显示名头像，相对截图打码有什么差异？](#detail-section-11)
  - [Q02 · 保存和展示如何接线，作用范围在哪里？](#detail-section-12)
  - [Q03 · 存储错误与恢复默认是否保证名称、头像同时变化？](#detail-section-13)
  - [Q04 · 依赖、隐私和退出条件是什么？](#detail-section-14)
  - [Q05 · 如何帮助用户决定截图是否可分享？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：截图时希望隐藏 DSH 侧栏账号标签和头像。

用户逐张检查截图并手动遮盖敏感内容。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 本地别名 | 替换侧栏标签 | 不改变账号资料 |
| 本地头像 | 替换侧栏图片 | 与别名分开保存 |
| 恢复默认 | 请求删除两项 | 未检查删除成功 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| 兼容 DSH Web | 必需 | 提供侧栏 DOM | 匹配失败无覆盖 |
| 浏览器 localStorage | 持久化需要 | 保存别名头像 | 写失败不持久 |
| 非敏感替代内容 | 自定义需要 | 减少侧栏暴露 | 原始信息仍可见 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 使用测试账号和无敏感图片 | 不确定则不分享 |
| 编辑 | 填名称并选头像保存 | 核两项是否均改变 |
| 验证 | 刷新、切账号并逐张检查 | 原信息出现则手动遮盖 |
| 恢复 | 请求恢复后重新检查 | 删除失败时核存储 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 接入 | 浏览器存储未知 | 核兼容和选图 | DOM 依赖 |
| 截图 | 资源消耗未知 | 检查其他敏感区域 | 覆盖效果未测 |
| 恢复 | 成本未知 | 核两个字段删除 | 删除可能失败 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 别名 | 本地存储并替换标签 | 全页面隐私 |
| 头像 | 独立存储图片 | 各设备一致 |
| 恢复 | 分别请求删除 | 两项均删除成功 |

> **思考**：[Q03](#research-q03) 名称与头像分开保存并可能部分成功；[Q01](#research-q01) 不证明全页面隐私。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 提供侧栏本地替代显示，[Q02](#research-q02) 将其保存于浏览器。

[Q03](#research-q03) 保存头像后名称可能失败，恢复也不检查删除返回值。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 名称与头像分开保存并可能部分成功；[Q01](#research-q01) 不证明全页面隐私。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用测试账号核保存、刷新和切账号；公开前逐张检查并手动遮盖。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已静态核查客户端存储、显示与保存代表路径；未运行浏览器。

- 已检查：作者 README、包清单、源码路径 README.zh.md、lib/client.js、package.json、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定 README、清单、宿主空入口与客户端存储及显示路径；未运行 DSH、浏览器或截图。
- 下一步：[Q05](#research-q05) 用合成账号对照现有截图检查与覆盖范围提示。

**分析版本**

- **仓库**：[AomiRaku/dsh-accountDisplayName-edit](https://github.com/AomiRaku/dsh-accountDisplayName-edit)
- **版本号**：0.2.1（[固定提交 9391df1](https://github.com/AomiRaku/dsh-accountDisplayName-edit/tree/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设本地覆盖范围提示可减少截图漏查；尚未验证。

[Q05](#research-q05) 用合成账号对照现有截图检查与覆盖范围提示。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1301 | 969 | 253 | — |
| .md | source | 2 | 453 | — | — | 4271 |
| .mjs | test | 4 | 1324 | 1082 | 116 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AomiRaku/dsh-accountDisplayName-edit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AomiRaku/dsh-accountDisplayName-edit/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AomiRaku/dsh-accountDisplayName-edit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对本地显示、保存失败与隐私边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要改显示名头像，相对截图打码有什么差异？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README.zh.md:3-20 面向截图时希望隐藏侧栏账号信息的用户，提供本地自定义文字和头像；相对每张图事后打码，可在侧栏先显示替代内容。固定键与 DOM 修改仅覆盖此插件所匹配的界面，不改变账号资料，也不能保证页面其他位置、短暂闪现或截图中所有隐私均被遮盖；是否有效仍须用户逐张检查。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:3-20](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6/README.zh.md#L3-L20)

作者描述场景、草稿与本地存储。

<details>
<summary>查看原文（18行）</summary>

```text
把 DeepSeek Harness 侧边栏左下角的账号文字（手机号 / 邮箱 / 账户名）**和上面的头像**
替换为你自定义的名称和图片，避免截图泄露隐私。

编辑入口就在账号菜单里：点左下角账号 → **编辑显示名称**。弹窗里同时可以改名和换头像。

## 功能

- 侧边栏左下角的账号标签改为你设置的自定义文本。
- 头像可以换成你从本地选的图片。
- 账号菜单中新增一行 **编辑显示名称**，位于「设置」下方。
- 以上两项在同一个弹窗里编辑：选择 / 清除头像、输入名称，然后 保存 / 取消 / 恢复默认。
  `Enter` 保存，`Esc` 取消。
- 两项都是**草稿**，点「保存」才生效；点「取消」侧边栏不会有任何变化。
- 名称留空保存即恢复账号原名；清空头像即恢复账号原头像。
- 选中的图片会先居中裁成正方形、缩放到 128×128 再重新编码，存储体积通常只有几十 KB。
- 名称和头像都按浏览器存在 `localStorage`：
  `dsh.account-display-name-edit.alias` 与 `dsh.account-display-name-edit.avatar`。
- **只改显示**：不读取也不修改账号、凭证与资料，插件自身不发任何网络请求。
```

</details>

**依据 2 · 源码核查**：[lib/client.js:35-57](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6/lib/client.js#L35-L57)

固定本地存储键及 DOM 匹配。

<details>
<summary>查看原文（23行）</summary>

```text
    // --------------------------------------------------------------- constants

    var PLUGIN_ID = "dsh-accountdisplayname-edit";
    var STORAGE_KEY = "dsh.account-display-name-edit.alias";
    var AVATAR_KEY = "dsh.account-display-name-edit.avatar";
    var MAX_LENGTH = 32;

    /**
     * Avatar limits. A picked image is centre-cropped square and drawn at
     * `AVATAR_DIMENSION`, which keeps the stored data URL in the low tens of KB
     * so it fits comfortably in the page's `localStorage` quota.
     */
    var AVATAR_DIMENSION = 128;
    var AVATAR_MAX_FILE_BYTES = 10 * 1024 * 1024;
    var AVATAR_MAX_STORED_CHARS = 512 * 1024;

    /**
     * The account launcher is the only menu trigger the shell marks with a
     * signed-in/out flag; `data-collapsed` is the same component's second
     * always-present flag, kept as a fallback for a future rename.
     */
    var TRIGGER_SELECTOR = 'button[aria-haspopup="menu"][data-signed-out]';
    var TRIGGER_FALLBACK = 'button[aria-haspopup="menu"][data-collapsed]';
```

</details>

**依据 3 · 源码核查**：[lib/client.js:282-299](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6/lib/client.js#L282-L299)

对账号标签节点应用别名。

<details>
<summary>查看原文（18行）</summary>

```text
    function applyLabel(trigger) {
      var node = labelNode(trigger);
      if (node === null) return;
      var text = node.textContent;
      if (text !== written) shipped = text;

      if (state.alias !== "") {
        if (text !== state.alias) {
          writeText(node, state.alias);
          written = state.alias;
        }
        return;
      }

      // No alias: give the shipped text back exactly once.
      if (written !== null && text === written) {
        writeText(node, shipped === null ? "" : shipped);
        written = null;
```

</details>

#### 缺口

- 未实测截图和其他页面
  **影响**：不能保证完整隐私遮盖
  **进一步探讨**：用测试账号检查各页面与截图。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 保存和展示如何接线，作用范围在哪里？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

package.json:46-53 声明 Web 客户端立即加载，lib/index.js 宿主 apply 为空；client.js:177-208 将名称和头像分别写 localStorage，成功后更新状态并 reconcile；211-222 读取固定键，282-299 用别名替换匹配标签。固定键没有账号标识，因此同源的浏览器存储范围内不会按账号自动隔离；用户切换账号时需检查显示。DOM 选择器依赖宿主结构，真实各版本行为未执行。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:46-53](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6/package.json#L46-L53)

Web 客户端立即加载。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true
    }
```

**依据 2 · 源码核查**：[lib/index.js:1-18](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6/lib/index.js#L1-L18)

宿主端无操作。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * dsh-accountdisplayname-edit — host half.
 *
 * The whole feature lives in the browser half: the sidebar account row and the
 * menu it opens are rendered by two other client plugins, and neither exposes an
 * extension slot, so the edit row is appended to the open menu's DOM instead.
 * Nothing here needs host state — the display name is stored in the page's
 * `localStorage` — so this half exists purely as the Loader entry the host's
 * client-module scanner reads `dsh.client` from in order to serve `./client`.
 *
 * Deliberately import-free: the package declares no dependencies and no
 * peerDependencies, so it cannot fail to load because of a missing, renamed, or
 * version-mismatched peer package.
 */

/** Loader-visible plugin name; must match the entry id in cordis.patch.yml. */
export const name = 'account-display-name-edit';

```

</details>

**依据 3 · 源码核查**：[lib/client.js:35-57](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6/lib/client.js#L35-L57)

固定存储键及 DOM 选择器。

<details>
<summary>查看原文（23行）</summary>

```text
    // --------------------------------------------------------------- constants

    var PLUGIN_ID = "dsh-accountdisplayname-edit";
    var STORAGE_KEY = "dsh.account-display-name-edit.alias";
    var AVATAR_KEY = "dsh.account-display-name-edit.avatar";
    var MAX_LENGTH = 32;

    /**
     * Avatar limits. A picked image is centre-cropped square and drawn at
     * `AVATAR_DIMENSION`, which keeps the stored data URL in the low tens of KB
     * so it fits comfortably in the page's `localStorage` quota.
     */
    var AVATAR_DIMENSION = 128;
    var AVATAR_MAX_FILE_BYTES = 10 * 1024 * 1024;
    var AVATAR_MAX_STORED_CHARS = 512 * 1024;

    /**
     * The account launcher is the only menu trigger the shell marks with a
     * signed-in/out flag; `data-collapsed` is the same component's second
     * always-present flag, kept as a fallback for a future rename.
     */
    var TRIGGER_SELECTOR = 'button[aria-haspopup="menu"][data-signed-out]';
    var TRIGGER_FALLBACK = 'button[aria-haspopup="menu"][data-collapsed]';
```

</details>

**依据 4 · 源码核查**：[lib/client.js:177-222](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6/lib/client.js#L177-L222)

分别保存及读取本地值。

<details>
<summary>查看原文（46行）</summary>

```text
    function setAlias(next) {
      var value = typeof next === "string" ? next.slice(0, MAX_LENGTH) : "";
      var writtenOk = safe(function () {
        if (value === "") window.localStorage.removeItem(STORAGE_KEY);
        else window.localStorage.setItem(STORAGE_KEY, value);
        return true;
      }, false);
      if (writtenOk !== true) return false;
      state.alias = value;
      emit();
      reconcile();
      return true;
    }

    /**
     * Persist the avatar data URL. Returns false when the value is too large or
     * cannot be written, so the dialog can keep itself open and say so instead of
     * accepting an edit that would silently vanish on reload.
     */
    function setAvatar(next) {
      var value = typeof next === "string" ? next : "";
      if (value.length > AVATAR_MAX_STORED_CHARS) return false;
      var writtenOk = safe(function () {
        if (value === "") window.localStorage.removeItem(AVATAR_KEY);
        else window.localStorage.setItem(AVATAR_KEY, value);
        return true;
      }, false);
      if (writtenOk !== true) return false;
      state.avatar = value;
      emit();
      reconcile();
      return true;
    }

    function loadAvatar() {
      var stored = safe(function () {
        return window.localStorage.getItem(AVATAR_KEY);
      }, null);
      state.avatar = typeof stored === "string" && stored.indexOf("data:image/") === 0 ? stored : "";
    }

    function loadAlias() {
      var stored = safe(function () {
        return window.localStorage.getItem(STORAGE_KEY);
      }, null);
      state.alias = typeof stored === "string" ? stored.slice(0, MAX_LENGTH) : "";
```

</details>

**依据 5 · 源码核查**：[lib/client.js:282-299](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6/lib/client.js#L282-L299)

显示覆盖逻辑。

<details>
<summary>查看原文（18行）</summary>

```text
    function applyLabel(trigger) {
      var node = labelNode(trigger);
      if (node === null) return;
      var text = node.textContent;
      if (text !== written) shipped = text;

      if (state.alias !== "") {
        if (text !== state.alias) {
          writeText(node, state.alias);
          written = state.alias;
        }
        return;
      }

      // No alias: give the shipped text back exactly once.
      if (written !== null && text === written) {
        writeText(node, shipped === null ? "" : shipped);
        written = null;
```

</details>

#### 缺口

- 未测不同宿主和账号切换
  **影响**：无法保证覆盖或账号隔离
  **进一步探讨**：测试同源账号切换和浏览器存储限制。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 存储错误与恢复默认是否保证名称、头像同时变化？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

client.js:177-208 两个写入分别返回成功与否；1101-1113 先写头像再写别名，后者失败时没有回滚前者，故可能部分保存；1118-1121 的恢复默认忽略两个删除返回值就关闭窗口。头像大于限制或不是图片会被拒绝（419-445）；局部存储错误、异步图像读取与宿主 DOM 变化仍需真实验证。截图前应重新打开检查两项，不把提示或取消当原子恢复保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:177-208](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6/lib/client.js#L177-L208)

两项分别写入。

<details>
<summary>查看原文（32行）</summary>

```text
    function setAlias(next) {
      var value = typeof next === "string" ? next.slice(0, MAX_LENGTH) : "";
      var writtenOk = safe(function () {
        if (value === "") window.localStorage.removeItem(STORAGE_KEY);
        else window.localStorage.setItem(STORAGE_KEY, value);
        return true;
      }, false);
      if (writtenOk !== true) return false;
      state.alias = value;
      emit();
      reconcile();
      return true;
    }

    /**
     * Persist the avatar data URL. Returns false when the value is too large or
     * cannot be written, so the dialog can keep itself open and say so instead of
     * accepting an edit that would silently vanish on reload.
     */
    function setAvatar(next) {
      var value = typeof next === "string" ? next : "";
      if (value.length > AVATAR_MAX_STORED_CHARS) return false;
      var writtenOk = safe(function () {
        if (value === "") window.localStorage.removeItem(AVATAR_KEY);
        else window.localStorage.setItem(AVATAR_KEY, value);
        return true;
      }, false);
      if (writtenOk !== true) return false;
      state.avatar = value;
      emit();
      reconcile();
      return true;
```

</details>

**依据 2 · 源码核查**：[lib/client.js:419-445](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6/lib/client.js#L419-L445)

图片类型、大小及读取失败。

<details>
<summary>查看原文（27行）</summary>

```text
    /** Read one picked file into a storable avatar, reporting a localized failure key. */
    function readAvatarFile(file, done) {
      var type = String((file && file.type) || "");
      if (type.indexOf("image/") !== 0) {
        done(null, "avatarFailed");
        return;
      }
      if (file.size > AVATAR_MAX_FILE_BYTES) {
        done(null, "avatarTooLarge");
        return;
      }
      var reader = new FileReader();
      reader.onerror = function () {
        done(null, "avatarFailed");
      };
      reader.onload = function () {
        var dataUrl = typeof reader.result === "string" ? reader.result : "";
        if (dataUrl === "") {
          done(null, "avatarFailed");
          return;
        }
        shrinkAvatar(dataUrl, function (result, failure) {
          if (result !== null && result.length > AVATAR_MAX_STORED_CHARS) {
            done(null, "avatarTooLarge");
            return;
          }
          done(result, failure);
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1101-1121](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6/lib/client.js#L1101-L1121)

先后保存及恢复忽略结果。

<details>
<summary>查看原文（21行）</summary>

```text
      var commit = function () {
        var copy = strings();
        // The avatar is validated first so a rejected image never half-saves the name.
        if (!setAvatar(draftAvatar)) {
          setAvatarError(copy.avatarTooLarge);
          return;
        }
        var nextAlias = String(draft).replace(/\s+/g, " ").trim().slice(0, MAX_LENGTH);
        if (!setAlias(nextAlias)) {
          setAvatarError(copy.saveFailed);
          return;
        }
        setEditorOpen(false);
      };
      var cancel = function () {
        setEditorOpen(false);
      };
      var reset = function () {
        setAvatar("");
        setAlias("");
        setEditorOpen(false);
```

</details>

#### 缺口

- 未运行存储写失败注入
  **影响**：不能保证两项同时成功或还原
  **进一步探讨**：测试第一项成功第二项失败及恢复失败。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、隐私和退出条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:46-53、60-61 需要 Web 客户端及所声明 Node 版本；README.zh.md:22-28 声称基于特定宿主 DOM，插件并非账号资料修改器。自定义头像保存在浏览器 localStorage，浏览器清理、设备迁移或同源访问可能改变可见状态；人工需检查截图、浏览器与图片来源。先用测试账号设置无敏感别名和图片，刷新、切账号并检查截图；存储失败、原身份仍出现或恢复结果未知时停止公开分享并手动遮盖。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:46-53](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6/package.json#L46-L53)

Web 客户端声明。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true
    }
```

**依据 2 · 源码核查**：[package.json:60-61](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6/package.json#L60-L61)

Node 版本。

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
```

**依据 3 · 作者声明**：[README.zh.md:22-28](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6/README.zh.md#L22-L28)

作者描述宿主结构兼容边界。

```text
## 环境要求

在 DSH `0.2.0-rc.2` 上开发并验证。它依赖的账号行与 `Menu` 结构——`data-signed-out`、
`_avatar` / `_label` 两个 span、portal 到 `<body>` 的 `div[role="menu"]` 及其
`role="presentation"` 视口与 `itemIcon` / `itemLabel` 行——在 `0.2.1-rc.2` 中**未变**，
本包也对照该版本核对过。宿主侧不 import 任何模块，浏览器侧失败即降级，所以在结构
已变化的版本上表现为「不覆盖、菜单里没有这一行」，而不是报错——详见[兼容性](#兼容性)。
```

**依据 4 · 源码核查**：[lib/client.js:177-222](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6/lib/client.js#L177-L222)

浏览器本地存储。

<details>
<summary>查看原文（46行）</summary>

```text
    function setAlias(next) {
      var value = typeof next === "string" ? next.slice(0, MAX_LENGTH) : "";
      var writtenOk = safe(function () {
        if (value === "") window.localStorage.removeItem(STORAGE_KEY);
        else window.localStorage.setItem(STORAGE_KEY, value);
        return true;
      }, false);
      if (writtenOk !== true) return false;
      state.alias = value;
      emit();
      reconcile();
      return true;
    }

    /**
     * Persist the avatar data URL. Returns false when the value is too large or
     * cannot be written, so the dialog can keep itself open and say so instead of
     * accepting an edit that would silently vanish on reload.
     */
    function setAvatar(next) {
      var value = typeof next === "string" ? next : "";
      if (value.length > AVATAR_MAX_STORED_CHARS) return false;
      var writtenOk = safe(function () {
        if (value === "") window.localStorage.removeItem(AVATAR_KEY);
        else window.localStorage.setItem(AVATAR_KEY, value);
        return true;
      }, false);
      if (writtenOk !== true) return false;
      state.avatar = value;
      emit();
      reconcile();
      return true;
    }

    function loadAvatar() {
      var stored = safe(function () {
        return window.localStorage.getItem(AVATAR_KEY);
      }, null);
      state.avatar = typeof stored === "string" && stored.indexOf("data:image/") === 0 ? stored : "";
    }

    function loadAlias() {
      var stored = safe(function () {
        return window.localStorage.getItem(STORAGE_KEY);
      }, null);
      state.alias = typeof stored === "string" ? stored.slice(0, MAX_LENGTH) : "";
```

</details>

**依据 5 · 源码核查**：[lib/client.js:1101-1121](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6/lib/client.js#L1101-L1121)

部分写入及恢复边界。

<details>
<summary>查看原文（21行）</summary>

```text
      var commit = function () {
        var copy = strings();
        // The avatar is validated first so a rejected image never half-saves the name.
        if (!setAvatar(draftAvatar)) {
          setAvatarError(copy.avatarTooLarge);
          return;
        }
        var nextAlias = String(draft).replace(/\s+/g, " ").trim().slice(0, MAX_LENGTH);
        if (!setAlias(nextAlias)) {
          setAvatarError(copy.saveFailed);
          return;
        }
        setEditorOpen(false);
      };
      var cancel = function () {
        setEditorOpen(false);
      };
      var reset = function () {
        setAvatar("");
        setAlias("");
        setEditorOpen(false);
```

</details>

#### 缺口

- 未验浏览器存储和所有宿主位置
  **影响**：无法保证完整隐私或跨设备状态
  **进一步探讨**：测试目标环境并人工复查截图。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何帮助用户决定截图是否可分享？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有名称/头像草稿和侧栏替换；只再添加预览不足以证明隐私。设想在用户主动触发时对当前可见页面做本地检查，标明已覆盖节点、未匹配状态和仍需人工核对的区域；不读取或上传截图、账号值或不可见内容。与现有直接截图和人工检查对照，测试宿主 DOM 变化、账号菜单、弹窗及切账号场景，比较漏遮盖、误报和操作耗时；若无法覆盖关键区域、出现原始值或误导用户视为完全安全则否定。先确认现有 UI 是否已有等价覆盖提示。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:35-57](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6/lib/client.js#L35-L57)

现有固定 DOM 选择器。

<details>
<summary>查看原文（23行）</summary>

```text
    // --------------------------------------------------------------- constants

    var PLUGIN_ID = "dsh-accountdisplayname-edit";
    var STORAGE_KEY = "dsh.account-display-name-edit.alias";
    var AVATAR_KEY = "dsh.account-display-name-edit.avatar";
    var MAX_LENGTH = 32;

    /**
     * Avatar limits. A picked image is centre-cropped square and drawn at
     * `AVATAR_DIMENSION`, which keeps the stored data URL in the low tens of KB
     * so it fits comfortably in the page's `localStorage` quota.
     */
    var AVATAR_DIMENSION = 128;
    var AVATAR_MAX_FILE_BYTES = 10 * 1024 * 1024;
    var AVATAR_MAX_STORED_CHARS = 512 * 1024;

    /**
     * The account launcher is the only menu trigger the shell marks with a
     * signed-in/out flag; `data-collapsed` is the same component's second
     * always-present flag, kept as a fallback for a future rename.
     */
    var TRIGGER_SELECTOR = 'button[aria-haspopup="menu"][data-signed-out]';
    var TRIGGER_FALLBACK = 'button[aria-haspopup="menu"][data-collapsed]';
```

</details>

**依据 2 · 源码核查**：[lib/client.js:282-299](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6/lib/client.js#L282-L299)

现有标签替换。

<details>
<summary>查看原文（18行）</summary>

```text
    function applyLabel(trigger) {
      var node = labelNode(trigger);
      if (node === null) return;
      var text = node.textContent;
      if (text !== written) shipped = text;

      if (state.alias !== "") {
        if (text !== state.alias) {
          writeText(node, state.alias);
          written = state.alias;
        }
        return;
      }

      // No alias: give the shipped text back exactly once.
      if (written !== null && text === written) {
        writeText(node, shipped === null ? "" : shipped);
        written = null;
```

</details>

**依据 3 · 作者声明**：[README.zh.md:3-20](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/9391df1eff1a7b14f2e6f72f9d1336cfd12591a6/README.zh.md#L3-L20)

已有草稿和显示功能。

<details>
<summary>查看原文（18行）</summary>

```text
把 DeepSeek Harness 侧边栏左下角的账号文字（手机号 / 邮箱 / 账户名）**和上面的头像**
替换为你自定义的名称和图片，避免截图泄露隐私。

编辑入口就在账号菜单里：点左下角账号 → **编辑显示名称**。弹窗里同时可以改名和换头像。

## 功能

- 侧边栏左下角的账号标签改为你设置的自定义文本。
- 头像可以换成你从本地选的图片。
- 账号菜单中新增一行 **编辑显示名称**，位于「设置」下方。
- 以上两项在同一个弹窗里编辑：选择 / 清除头像、输入名称，然后 保存 / 取消 / 恢复默认。
  `Enter` 保存，`Esc` 取消。
- 两项都是**草稿**，点「保存」才生效；点「取消」侧边栏不会有任何变化。
- 名称留空保存即恢复账号原名；清空头像即恢复账号原头像。
- 选中的图片会先居中裁成正方形、缩放到 128×128 再重新编码，存储体积通常只有几十 KB。
- 名称和头像都按浏览器存在 `localStorage`：
  `dsh.account-display-name-edit.alias` 与 `dsh.account-display-name-edit.avatar`。
- **只改显示**：不读取也不修改账号、凭证与资料，插件自身不发任何网络请求。
```

</details>

#### 缺口

- 未查遍全部 UI 和无原型
  **影响**：无法证明新增性或减少泄露
  **进一步探讨**：先核现有提示再用合成账号截图对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
