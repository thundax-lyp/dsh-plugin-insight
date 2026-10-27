# dsh-accountdisplayname-edit

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[fb3c073](https://github.com/AomiRaku/dsh-accountDisplayName-edit/tree/fb3c073725d28e7c718a7fce6bde2d9d7ff6cf92)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AomiRaku/dsh-accountDisplayName-edit)
<!-- END META -->

> **实现功能**：在 DSH 侧栏本地自定义账号显示名和头像，并通过账号菜单编辑。

> **核心亮点**：相对截图后逐次打码，它把侧栏名称头像脱敏前移到本地界面，并保留 React 原头像子树以便恢复。贡献是可复用的局部展示便利，未证明整图匿名或端到端节时。[Q01](#research-q01) [Q02](#research-q02)

> **风险与缺陷**：显示覆盖依赖宿主 DOM，而且保存并非整体事务。头像先写成功后别名写失败时，界面可能部分提交；静默选择器回退也不能告诉用户是否已覆盖。源码支持这些边界，尚未复现故障频率。[Q03](#research-q03)

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
  - [Q01 · 覆盖账号显示解决谁的什么任务，相比手工遮挡增加什么？](#detail-section-11)
  - [Q02 · 覆盖、菜单与草稿如何接入宿主，失败会怎样？](#detail-section-12)
  - [Q03 · 名称和头像保存是否整体提交，如何影响截图可信度？](#detail-section-13)
  - [Q04 · 首次、持续与失败恢复成本是否抵消便利？](#detail-section-14)
  - [Q05 · 如何改进保存与脱敏确认，最小验证是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：公开演示或分享 DSH 截图的人可预设化名与头像，减少侧栏反复手工遮挡；合格结果仍须逐图检查其他个人信息。[Q01](#research-q01)

最简单的参照是截图后手工遮挡；它无宿主 DOM 依赖但每张图都要处理。本插件只移动侧栏这部分工作，不能替代全图检查。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 自定义侧栏名称 | 用化名覆盖账号标签 | 仅本浏览器显示，依赖启动器 DOM |
| 自定义侧栏头像 | 用本地图片覆盖原头像 | 图片重编码和 localStorage 受限，原节点保留 |
| 名称头像编辑对话框 | 保存、取消和恢复默认 | shell.overlay 可用；两字段保存不具整体事务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH web 模块加载与 React | 启动必需 | 加载浏览器实现 | 无编辑入口 |
| 账号启动器与菜单 DOM | 核心操作必需 | 定位并覆盖显示 | 可能静默无覆盖 |
| shell.overlay | 编辑必需 | 显示编辑器 | 无法完成正常配置路径 |
| localStorage 写权限 | 持续保存必需 | 持久化化名头像 | 保存失败，可能部分提交 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户通过宿主插件面板安装 | 包加载且账号菜单出现编辑入口 |
| 设置 | 用户选择头像和化名后保存 | 侧栏与重载后均显示预期内容 |
| 分享 | 用户逐图检查后发布 | 其他区域无不应分享的信息 |
| 恢复 | 用户恢复默认或卸载并清存储 | 原账号显示恢复，残留键经检查清理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主设备与浏览器存储，金额未知 | 安装、设置名称头像、检查截图，耗时未知 | 图片上限10MB，重编码目标128×128 |
| 持续使用 | 无独立服务调用机制，总费用未知 | 每图检查其他信息，升级后复核覆盖 | 未测重复截图节时 |
| 失败恢复 | 本地存储与排查资源，金额未知 | 恢复默认、清键、核对部分保存 | 两字段保存不具整体事务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 侧栏显示替换 | DOM 与 localStorage 链路可核查 | 实际宿主兼容 |
| 原头像恢复 | 保留节点、移除覆盖属性 | 所有宿主重渲染组合 |
| 截图脱敏便利 | 减少同一区域重复手改的机制 | 节时、整图遗漏率与单位合格任务成本 |

> **思考**：显示覆盖依赖宿主 DOM，而且保存并非整体事务。头像先写成功后别名写失败时，界面可能部分提交；静默选择器回退也不能告诉用户是否已覆盖。源码支持这些边界，尚未复现故障频率。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对截图后逐次打码，它把侧栏名称头像脱敏前移到本地界面，并保留 React 原头像子树以便恢复。贡献是可复用的局部展示便利，未证明整图匿名或端到端节时。[Q01](#research-q01) [Q02](#research-q02)

相对截图后逐次打码，它把侧栏名称头像脱敏前移到本地界面，并保留 React 原头像子树以便恢复。贡献是可复用的局部展示便利，未证明整图匿名或端到端节时。[Q01](#research-q01) [Q02](#research-q02)

保留 React 头像子树、缓存启动器和单字段写成功后再更新界面，是有明确维护目的的实现。DOM 后缀与位置回退仍需宿主升级复核；safe 降级避免抛错，却不能证明脱敏成功。跨字段保存应由更高层一致性逻辑负责，见 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

显示覆盖依赖宿主 DOM，而且保存并非整体事务。头像先写成功后别名写失败时，界面可能部分提交；静默选择器回退也不能告诉用户是否已覆盖。源码支持这些边界，尚未复现故障频率。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

经常分享界面的用户可先在非敏感截图中试用，检查保存、取消、恢复默认和重载；不要省略整图复核。出现覆盖消失或保存状态不明时先停用并检查。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

本地显示覆盖有固定源码支持；兼容与实际截图收益未做宿主验证。双阶段保存与状态确认属于未验证设计假设。

- 已检查：作者 README、包清单、源码路径 lib/client.js、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交的浏览器接线、存储和保存路径源码核查；没有安装、运行测试或真实宿主验收。
- 下一步：在匹配宿主中核对保存、取消、默认恢复与重载，再注入头像成功而别名写失败和 DOM 变化；以同批截图比较总耗时和遗漏，未执行。

**分析版本**

- **仓库**：[AomiRaku/dsh-accountDisplayName-edit](https://github.com/AomiRaku/dsh-accountDisplayName-edit)
- **版本号**：0.2.1（[固定提交 fb3c073](https://github.com/AomiRaku/dsh-accountDisplayName-edit/tree/fb3c073725d28e7c718a7fce6bde2d9d7ff6cf92)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可尝试将名称头像合为版本化记录，持久化成功后一次更新界面，并显示目标 DOM 覆盖状态。应以写入故障和 DOM 变化验证旧状态保留，再比较截图遗漏；若提示使用户忽略整图检查，假设不成立。这是未验证设想。[Q05](#research-q05)

在匹配宿主中核对保存、取消、默认恢复与重载，再注入头像成功而别名写失败和 DOM 变化；以同批截图比较总耗时和遗漏，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1301 | 969 | 253 | — |
| .md | source | 2 | 449 | — | — | 4231 |
| .mjs | test | 4 | 1324 | 1082 | 116 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/AomiRaku/dsh-accountDisplayName-edit/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断本地名称与头像覆盖能否为截图分享提供可控的隐私便利，并检验 DOM 接线及保存语义的限制。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 覆盖账号显示解决谁的什么任务，相比手工遮挡增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向要展示 DSH 界面、又不愿在侧栏暴露电话号码、邮箱或账号头像的人。合格结果是分享前侧栏显示预设化名与图片，同时账号身份和登录仍由宿主管理。作者将用途限定为显示覆盖；它不改变账号资料，也不能保证截图其他区域没有个人信息。相比每次截图后手动打码，增量是把常用脱敏设置留在浏览器并在侧栏更新后重新应用，省去重复编辑同一处 UI 的动作。该增量是一种局部展示便利，不能据此断言整图脱敏、匿名化或已节省多少时间。对不分享界面、仅需一次打码的人，截图编辑器仍是更简单的替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-30](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/fb3c073725d28e7c718a7fce6bde2d9d7ff6cf92/README.md#L3-L30)

作者列明截图场景、名称头像覆盖和本地存储，明确承诺边界为显示层。

<details>
<summary>查看原文（28行）</summary>

```text
Replaces the sidebar account label — the phone number, email, or account name
DeepSeek Harness shows at the bottom-left — and the avatar above it, with a name
and image you choose, so screenshots do not expose the original.

The edit entry is a new **Edit display name** row in the account menu, the one you
open by clicking that label. The dialog it opens holds both the avatar and the name.

## What it does

- Replaces the account label text in the sidebar footer with a display name you set.
- Replaces the launcher avatar with an image you pick from a local file.
- Adds an **Edit display name** / **编辑显示名称** row to the account menu, directly
  under Settings.
- Opens one editor dialog for both: pick or clear an avatar, type a name, then Save,
  Cancel, or Use default. `Enter` saves, `Esc` cancels.
- Both edits are drafts until Save — Cancel leaves the sidebar untouched.
- Saving an empty value restores the account's own text; clearing the avatar restores
  the account's own avatar.
- A picked image is centre-cropped square, downscaled to 128×128 and re-encoded, so
  the stored copy stays in the low tens of KB.
- Stores both per browser in `localStorage`, under
  `dsh.account-display-name-edit.alias` and `dsh.account-display-name-edit.avatar`.
- Display only. The account, the credentials and the profile are never read or
  changed, and the plugin makes no network requests of its own.

## Requirements

Built and verified against DSH `0.2.0-rc.2`. The account launcher and `Menu` DOM it
```

</details>

**依据 2 · 源码核查**：[lib/client.js:277-305](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/fb3c073725d28e7c718a7fce6bde2d9d7ff6cf92/lib/client.js#L277-L305)

applyLabel 将用户 alias 写入启动器标签，并保留原显示文本以恢复，支持重复展示覆盖的机制判断。

<details>
<summary>查看原文（29行）</summary>

```text
      var only = node.childNodes.length === 1 ? node.firstChild : null;
      if (only !== null && only.nodeType === 3) only.nodeValue = text;
      else node.textContent = text;
    }

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
      }
    }

    // ------------------------------------------------ the account launcher avatar

    var avatarApplied = null; // data URL currently painted on the avatar span
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 覆盖、菜单与草稿如何接入宿主，失败会怎样？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

入口通过 package 的立即加载浏览器配置进入模块图，宿主半部只承担 Loader 身份且不申请宿主服务。浏览器使用宿主提供的 React；触发器通过 data-signed-out 与 data-collapsed 属性定位，标签通过类名后缀与位置回退定位。别名和头像读取浏览器 localStorage，头像用背景图覆盖并隐藏原节点的子元素，避免直接替换 React 的头像树。菜单项依赖已有菜单 DOM，编辑器则挂到 shell.overlay。因此无额外账号并不等于没有依赖，宿主模块加载约定、slots 和指定 DOM 结构都是效果条件。safe 包装将探测异常转换为回退值，主要换来不向宿主抛错的退化方式；它不能保证未来 DOM 变化后仍能覆盖，也无法成为隐私保护成功的确认信号。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:16-30](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/fb3c073725d28e7c718a7fce6bde2d9d7ff6cf92/lib/index.js#L16-L30)

宿主入口声明空 inject 且 apply 无行为，解释其服务依赖范围。

<details>
<summary>查看原文（15行）</summary>

```text
/** Loader-visible plugin name; must match the entry id in cordis.patch.yml. */
export const name = 'account-display-name-edit';

/**
 * No host services are required. Declared explicitly so the intent is obvious
 * and a future host-side need shows up as a diff rather than a silent addition.
 */
export const inject = [];

/**
 * Inert on purpose. Activation is not required for the browser half to load:
 * `dsh.client.immediately` in package.json puts the bundle in the boot graph's
 * immediate tier on its own.
 */
export function apply() {}
```

</details>

**依据 2 · 源码核查**：[lib/client.js:244-267](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/fb3c073725d28e7c718a7fce6bde2d9d7ff6cf92/lib/client.js#L244-L267)

DOM 选择器和回退实际决定兼容范围。

<details>
<summary>查看原文（24行）</summary>

```text
      // `reconcile` runs on every body mutation — during a streaming reply that is
      // every frame — so this must stay O(1) while the launcher is still in the tree.
      if (cachedTrigger !== null && cachedTrigger.isConnected) return cachedTrigger;
      cachedTrigger = safe(function () {
        return document.querySelector(TRIGGER_SELECTOR) || document.querySelector(TRIGGER_FALLBACK);
      }, null);
      return cachedTrigger;
    }

    /**
     * The launcher's text node holder: the button's own label span, found by the
     * stable `_label` suffix CSS modules appends to a authored class name, with a
     * positional fallback (the label is the last of the button's spans).
     */
    function labelNode(trigger) {
      var named = safe(function () {
        return trigger.querySelector(':scope > span[class*="_label"]');
      }, null);
      if (named !== null) return named;
      var spans = [];
      for (var i = 0; i < trigger.children.length; i++) {
        if (trigger.children[i].tagName === "SPAN") spans.push(trigger.children[i]);
      }
      return spans.length >= 2 ? spans[spans.length - 1] : null;
```

</details>

**依据 3 · 源码核查**：[lib/client.js:329-347](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/fb3c073725d28e7c718a7fce6bde2d9d7ff6cf92/lib/client.js#L329-L347)

头像以背景图和属性覆盖，原 React 节点仍保留。

<details>
<summary>查看原文（19行）</summary>

```text
      if (node === null) return;

      if (state.avatar === "") {
        if (avatarApplied !== null) {
          node.removeAttribute(AVATAR_ATTR);
          node.style.backgroundImage = "";
          avatarApplied = null;
        }
        return;
      }

      if (avatarApplied === state.avatar && node.getAttribute(AVATAR_ATTR) === "1") return;
      node.setAttribute(AVATAR_ATTR, "1");
      node.style.backgroundImage = 'url("' + state.avatar + '")';
      avatarApplied = state.avatar;
    }

    /** One scoped stylesheet: sizes the background image and hides the real avatar. */
    function injectStyles() {
```

</details>

**依据 4 · 源码核查**：[lib/client.js:1220-1244](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/fb3c073725d28e7c718a7fce6bde2d9d7ff6cf92/lib/client.js#L1220-L1244)

apply 将编辑器接入 shell.overlay，支持接线判断。

<details>
<summary>查看原文（25行）</summary>

```text
    function apply(ctx) {
      locale = safe(function () {
        return ctx.get("locale");
      }, null);
      loadAlias();
      loadAvatar();

      var disposers = [];
      safe(function () {
        disposers.push(
          ctx.slots.inject("shell.overlay", function () {
            return ctx.slots.register(
              {
                name: "shell.overlay",
                id: PLUGIN_ID + "-overlay",
                order: 50,
                inject: function () {
                  return {};
                }
              },
              DisplayNameOverlay
            );
          })
        );
      }, null);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 名称和头像保存是否整体提交，如何影响截图可信度？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

正常路径中两项均保存后关闭对话框，但它们不是一个整体事务。setAvatar 会先写 localStorage、更新 state 并 reconcile；commit 随后调用 setAlias。当头像写成功而名称写入失败时，commit 仅显示错误并保留窗口，没有回滚已经应用的头像。reset 同样连续调用两个 setter 且未判断返回值，随后关闭编辑器。因此错误信息与用户看到的状态可能出现部分提交，这是从控制流可以确定的设计限制，尚未在宿主复现。它不导致账号凭据被修改，但会削弱“失败后没有变更”的直觉；用户仍须查看侧栏的实际结果。值得借鉴的是写入成功后再更新单个字段、保留原头像 DOM 和缓存触发器的局部设计；复用时应把跨字段一致性作为额外职责。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:177-208](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/fb3c073725d28e7c718a7fce6bde2d9d7ff6cf92/lib/client.js#L177-L208)

每个 setter 独立持久化和更新界面，没有共享事务。

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

**依据 2 · 源码核查**：[lib/client.js:1101-1122](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/fb3c073725d28e7c718a7fce6bde2d9d7ff6cf92/lib/client.js#L1101-L1122)

commit 和 reset 顺序调用两个 setter，解释部分提交及错误处理边界。

<details>
<summary>查看原文（22行）</summary>

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
      };
```

</details>

#### 缺口

- 尚无存储故障注入下的真实界面观察。
  **影响**：可判断非事务控制流，不能量化故障频率或用户影响。
  **进一步探讨**：在头像写入成功、别名写入抛错的条件下观察侧栏与重新加载后的状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续与失败恢复成本是否抵消便利？

**研究主题**：效果与总成本、采用判断

#### 完整回答

成本计量单位应是一张符合分享目的且侧栏没有原账号信息的截图。首次要安装包、选择化名图片并确认覆盖；持续使用仍要检查截图其他区域和宿主升级后的侧栏；故障时需检查存储权限与 DOM 兼容，恢复默认或清理浏览器键。源码未引入独立服务收费或模型调用，但这不是对总成本为零的证明，宿主、设备与人工时间仍存在，金额和耗时没有实测。对于经常公开演示 DSH 的用户，局部范围清楚且可以直接比较覆盖前后的截图，适合小范围试用；对必须保证匿名或组织级隐私合规的流程，仅靠本插件不足。试用成功标准是保存、取消、恢复默认及重新加载均符合预期，且每张分享图经人工检查；出现覆盖缺失或部分保存难以解释时应停止依赖它承担脱敏责任。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:73-101](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/fb3c073725d28e7c718a7fce6bde2d9d7ff6cf92/README.md#L73-L101)

使用和卸载步骤明确把设置与 localStorage 清理交给用户。

<details>
<summary>查看原文（29行）</summary>

```text
1. Click the account row at the bottom of the sidebar.
2. Choose **Edit display name**.
3. Optionally click **Choose image…** and pick a PNG / JPG / WebP; the round preview
   shows the cropped result. **Clear avatar** goes back to the account's own avatar.
4. Type the name you want. Save an empty value to go back to the account's own text.
5. Click **Save**. Nothing changes until you do.

## Screenshots

The account menu, with the **Edit display name** row added under Settings, and the
chosen name and avatar on the launcher below it:

![The account menu with the Edit display name row](assets/screenshot-1.png)

The editor dialog: avatar preview, name field, and Save / Cancel / Use default:

![The editor dialog](assets/screenshot-2.png)

## Uninstall

Remove the insert from `cordis.patch.yml` and delete the package directory. The
stored name and avatar stay in the browser's `localStorage` until you clear them; the
plugin writes nothing else.

## How it works

A dual-face plugin whose host half does almost nothing.

- **Host half — `lib/index.js`.** Deliberately import-free. Its only job is to be a
```

</details>

**依据 2 · 源码核查**：[lib/client.js:37-49](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/fb3c073725d28e7c718a7fce6bde2d9d7ff6cf92/lib/client.js#L37-L49)

固定存储键与头像尺寸限制说明本地状态及资源边界。

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

#### 缺口

- 没有同类截图任务的时间和脱敏遗漏率对照。
  **影响**：不能定量判断节时或可靠性收益。
  **进一步探讨**：比较同一批界面用本插件和截图后打码的总耗时、复核次数与遗漏。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何改进保存与脱敏确认，最小验证是什么？

**研究主题**：新假设与验证

#### 完整回答

可以提出未验证的双阶段保存与覆盖状态确认设计。由 Q03 的分离 setter 推导，将 alias 与 avatar 组成单一版本化记录，先验证并持久化该记录，成功后一次更新 UI；由 Q02 的静默 DOM 回退推导，增加只面向用户的覆盖状态提示，明确显示本次是否找到了目标标签和头像。新增成本是旧键迁移、状态提示与宿主 UI 的维护，且仍不能保证其他区域匿名。最小验证需分别注入配额不足、拒绝写入和 DOM 结构变化，检查是否保持旧状态且不会误报已覆盖；再以截图复核遗漏率比较有无状态提示。若单记录写入仍造成不可解释的半状态，或提示使用户减少对整张截图的复核导致遗漏增加，该方向就不能被认为改善了隐私流程。该假设只由现有失败边界推导，尚无实现或效果证据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1101-1122](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/fb3c073725d28e7c718a7fce6bde2d9d7ff6cf92/lib/client.js#L1101-L1122)

分离保存是统一记录设计的推导依据，不证明新设计有效。

<details>
<summary>查看原文（22行）</summary>

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
      };
```

</details>

**依据 2 · 源码核查**：[lib/client.js:244-267](https://github.com/AomiRaku/dsh-accountDisplayName-edit/blob/fb3c073725d28e7c718a7fce6bde2d9d7ff6cf92/lib/client.js#L244-L267)

选择器回退是覆盖状态确认需求的推导依据。

<details>
<summary>查看原文（24行）</summary>

```text
      // `reconcile` runs on every body mutation — during a streaming reply that is
      // every frame — so this must stay O(1) while the launcher is still in the tree.
      if (cachedTrigger !== null && cachedTrigger.isConnected) return cachedTrigger;
      cachedTrigger = safe(function () {
        return document.querySelector(TRIGGER_SELECTOR) || document.querySelector(TRIGGER_FALLBACK);
      }, null);
      return cachedTrigger;
    }

    /**
     * The launcher's text node holder: the button's own label span, found by the
     * stable `_label` suffix CSS modules appends to a authored class name, with a
     * positional fallback (the label is the last of the button's spans).
     */
    function labelNode(trigger) {
      var named = safe(function () {
        return trigger.querySelector(':scope > span[class*="_label"]');
      }, null);
      if (named !== null) return named;
      var spans = [];
      for (var i = 0; i < trigger.children.length; i++) {
        if (trigger.children[i].tagName === "SPAN") spans.push(trigger.children[i]);
      }
      return spans.length >= 2 ? spans[spans.length - 1] : null;
```

</details>

#### 缺口

- 双阶段记录和状态提示未实现或验证。
  **影响**：不能将其计入本插件当前贡献。
  **进一步探讨**：制作只改变存储边界的原型并进行故障注入与截图任务对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
