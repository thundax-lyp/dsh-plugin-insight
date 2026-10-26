# dsh-sidebar-panel-fold

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[7353d02](https://github.com/ACGsu/dsh-sidebar-panel-fold/tree/7353d026fe87d4e87b74ea3ba4dac6efd4bf1bec)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/ACGsu/dsh-sidebar-panel-fold)
<!-- END META -->

> **实现功能**：把 DSH 左侧全局面板列表收成一行，并通过浮层切换面板和保存折叠状态。

> **核心亮点**：相比修改内置文件或简单display:none，增量在保留面板切换、活动状态和跨重启偏好；这是局部界面便利，没有改变Agent或任务交付流程。[Q01](#research-q01)

> **风险与缺陷**：实现没有官方整列表包裹槽，因而依赖nav结构和DOM观察；上游侧栏变化可能让控件无法定位。动态导入schema仅缓解包解析，不能保证所有旧schemastery版本支持volatile。[Q03](#research-q03)

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
  - [Q01 · 收成一行的增量是否超过简单隐藏？](#detail-section-11)
  - [Q02 · 控件怎样避免争夺React子节点并保存偏好？](#detail-section-12)
  - [Q03 · 主要维护风险是什么？](#detail-section-13)
  - [Q04 · 节省空间是否抵得过额外点击？](#detail-section-14)
  - [Q05 · 正式列表槽能否替代观察器？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合面板较多、希望给会话列表留空间的用户；合格结果是收起后仍能访问所有原生面板并可恢复展开。

原生完整面板列表保留一键访问但占高度；手工CSS隐藏更简单但缺少活动摘要与恢复入口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 列表折叠 | 节省侧栏高度 | 依赖panellist/nav锚点 |
| 浮层切换 | 收起时访问原面板 | 代理原按钮，不创造新面板 |
| 偏好保存 | 重启恢复折叠态 | Host优先，降级存储不跨端 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Web客户端及sidebar.panellist/nav结构 | 必需 | 定位与代理原面板 | 宿主布局变更可能失效 |
| settings及兼容schemastery | 持久设置所需 | 跨端/重启保留 | 解析失败降级localStorage；方法版本仍需核对 |
| localStorage | 降级才需 | 浏览器本地记忆 | 不保证跨端同步 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 安装加载后查看侧栏折叠行 | 控件与原面板均可见 |
| 2 | 收起并从浮层逐个切换 | 与原生选择同一面板 |
| 3 | 重启核对状态，异常展开或禁用 | 所有面板仍可访问 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地插件，金额未知 | 安装与逐面板核对 | 需匹配侧栏DOM |
| 持续使用 | DOM观察与布局工作，未测 | 选择面板多一次浮层动作 | 空间收益因面板数量而异 |
| 失败恢复 | 重载或禁用 | 恢复原列表、清理偏好 | 卸载清理路径存在，未运行 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 释放列表高度 | 折叠CSS与摘要行 | 实际会话查找效率 |
| 保留面板入口 | 浮层代理原按钮 | 键盘、读屏和新宿主一致性 |

> **思考**：实现没有官方整列表包裹槽，因而依赖nav结构和DOM观察；上游侧栏变化可能让控件无法定位。动态导入schema仅缓解包解析，不能保证所有旧schemastery版本支持volatile。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相比修改内置文件或简单display:none，增量在保留面板切换、活动状态和跨重启偏好；这是局部界面便利，没有改变Agent或任务交付流程。[Q01](#research-q01)

相比修改内置文件或简单display:none，增量在保留面板切换、活动状态和跨重启偏好；这是局部界面便利，没有改变Agent或任务交付流程。[Q01](#research-q01)

把新增控件放在nav前方而非React子列表中，减少与宿主渲染所有权冲突；注销观察器和全局事件体现生命周期意识。可复用外挂UI所有权原则，具体选择器和glyph复制仍需随宿主维护。

<a id="detail-section-5"></a>

### 1.4 主要限制

实现没有官方整列表包裹槽，因而依赖nav结构和DOM观察；上游侧栏变化可能让控件无法定位。动态导入schema仅缓解包解析，不能保证所有旧schemastery版本支持volatile。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

可在面板很多的独立profile试用，先逐个核对浮层切换和展开恢复。依赖键盘或读屏时先验证相应路径，状态回退到浏览器存储不能当跨端同步。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的设计解释，效果未独立验证；未来设计假设尚未实现或验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/client.js、src/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查Host schema、客户端锚点、设置、点击代理与卸载；未执行视觉或键盘验收。
- 下一步：逐面板、窄轨、键盘、读屏和重启检查；对照原生访问步数与会话列表可视项，未执行。

**分析版本**

- **仓库**：[ACGsu/dsh-sidebar-panel-fold](https://github.com/ACGsu/dsh-sidebar-panel-fold)
- **版本号**：0.1.0（[固定提交 7353d02](https://github.com/ACGsu/dsh-sidebar-panel-fold/tree/7353d026fe87d4e87b74ea3ba4dac6efd4bf1bec)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是增加官方面板列表容器槽与状态接口后，可取消DOM扫描并保持一致可访问性；比较宿主布局变化下的失效数和维护改动，未改善则不成立。[Q05](#research-q05)

逐面板、窄轨、键盘、读屏和重启检查；对照原生访问步数与会话列表可视项，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 228 | — | — | 2470 |
| .js | source | 2 | 797 | 589 | 155 | — |
| .mjs | test | 1 | 545 | 434 | 57 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/ACGsu/dsh-sidebar-panel-fold/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/ACGsu/dsh-sidebar-panel-fold/issues?q=is%3Aissue+created%3A2026-09-23T01%3A50%3A30.406Z..2026-10-23T01%3A50%3A30.406Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/ACGsu/dsh-sidebar-panel-fold/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-23T01%3A50%3A30.406Z..2026-10-23T01%3A50%3A30.406Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：ACGsu/dsh-sidebar-panel-fold 固定组件如何完成目标任务，贡献在何种边界成立，是否适合可控试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 收成一行的增量是否超过简单隐藏？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面对多个全局面板挤占高度，简单隐藏CSS会损失入口，原生完整列表则保留直接访问。插件新增摘要和浮层，使收起后还能切换，并保留活动图标。合格结果是所有原面板均可访问及恢复，价值是局部导航取舍，不是工作流或交付能力创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:8-23](https://github.com/ACGsu/dsh-sidebar-panel-fold/blob/7353d026fe87d4e87b74ea3ba4dac6efd4bf1bec/src/client.js#L8-L23)

作者解释无整列表槽与独立控件设计。

<details>
<summary>查看原文（16行）</summary>

```text
    /**
     * Browser half of dsh-sidebar-panel-fold.
     *
     * The sidebar's global panel list (the `nav` inside the sidebar) is rendered
     * exclusively by SidebarRoot: the `sidebar.panellist` slot only produces one
     * PanelRow per registered panel, so no official seam wraps the whole list.
     * This half therefore anchors on two stable facts guaranteed by the renderer
     * and the sidebar:
     *
     *   1. `[data-slot="sidebar.panellist"]` — emitted by SlotOutlet for every
     *      list entry, with `display: contents` so it never joins layout;
     *   2. the `nav` element containing it — the panel list container.
     *
     * It then owns exactly one sibling element placed *before* that `nav` (never
     * inside React's child list) plus a stylesheet that can hide the `nav`.
     */
```

</details>

**依据 2 · 源码核查**：[src/client.js:456-465](https://github.com/ACGsu/dsh-sidebar-panel-fold/blob/7353d026fe87d4e87b74ea3ba4dac6efd4bf1bec/src/client.js#L456-L465)

浮层最终触发原目标点击。

<details>
<summary>查看原文（10行）</summary>

```text
          item.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            // Hand the switch back to the built-in row so DSH's own selectPanel
            // path (analytics included) stays authoritative.
            const target = panel.row.isConnected ? panel.row : null;
            closeMenu();
            target?.click();
          });
          menu.appendChild(item);
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 控件怎样避免争夺React子节点并保存偏好？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

查找data-slot锚点的closest nav，在nav外插入自有行，用类隐藏子项。偏好优先Host设置，缺设置客户端才回退localStorage，防止旧浏览器值遮盖权威设置。Host动态解析schemastery，解析失败保留UI降级；这降低安装路径问题但不是无条件跨版本保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:174-186](https://github.com/ACGsu/dsh-sidebar-panel-fold/blob/7353d026fe87d4e87b74ea3ba4dac6efd4bf1bec/src/client.js#L174-L186)

锚点查找依赖具体DOM。

<details>
<summary>查看原文（13行）</summary>

```text
    //#region dom helpers
    /**
     * The panel list container: the `nav` holding the panellist slot anchor.
     * The plugin's own summary row reuses the active panel's glyph markup, so the
     * query must skip any anchor that is not inside a nav (our clone).
     * @returns {HTMLElement|null}
     */
    function findNav() {
      for (const anchor of document.querySelectorAll(`[data-slot="${SLOT}"]`)) {
        const nav = anchor.closest("nav");
        if (nav !== null) return nav;
      }
      return null;
```

</details>

**依据 2 · 源码核查**：[src/client.js:291-340](https://github.com/ACGsu/dsh-sidebar-panel-fold/blob/7353d026fe87d4e87b74ea3ba4dac6efd4bf1bec/src/client.js#L291-L340)

设置与本地回退优先级。

<details>
<summary>查看原文（50行）</summary>

```text
       * Fold state backed by the Host settings document, with a localStorage
       * fallback for deployments that do not compose the settings client.
       */
      const state = {
        folded: false,
        /** @type {{getSnapshot:Function,subscribe:Function,set:Function}|null} */
        form: null,
        listeners: new Set(),
        get() {
          return this.folded;
        },
        /** @param {boolean} next */
        async set(next) {
          if (this.folded === next) return;
          this.folded = next;
          this.emit();
          if (this.form !== null) {
            try {
              await this.form.set(FOLDED_FIELD, next);
            } catch (error) {
              console.warn("[dsh-sidebar-panel-fold] could not persist the fold state", error);
            }
            return;
          }
          try {
            window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
          } catch {
            /* private mode or disabled storage: keep the in-memory value */
          }
        },
        /** @param {() => void} listener @returns {() => void} */
        subscribe(listener) {
          this.listeners.add(listener);
          return () => this.listeners.delete(listener);
        },
        emit() {
          for (const listener of [...this.listeners]) {
            try {
              listener();
            } catch (error) {
              console.error("[dsh-sidebar-panel-fold] listener failed", error);
            }
          }
        },
      };

      // Seed from the fallback first: a Host value that arrives later wins, so a
      // stale localStorage entry can never shadow the real setting.
      try {
        state.folded = window.localStorage.getItem(STORAGE_KEY) === "1";
```

</details>

**依据 3 · 源码核查**：[src/index.js:29-56](https://github.com/ACGsu/dsh-sidebar-panel-fold/blob/7353d026fe87d4e87b74ea3ba4dac6efd4bf1bec/src/index.js#L29-L56)

动态schema导入与volatile调用。

<details>
<summary>查看原文（28行）</summary>

```text
async function loadSchema() {
  try {
    const mod = await import("@deepseek-ai/schemastery");
    const z = mod?.default ?? mod;
    return typeof z?.object === "function" ? z : void 0;
  } catch (error) {
    console.warn(
      "[dsh-sidebar-panel-fold] @deepseek-ai/schemastery is not resolvable from this install " +
        "(a `link:` install does that — use `file:` instead); the fold state will fall back to localStorage",
      error,
    );
    return void 0;
  }
}

const z = await loadSchema();

/**
 * Durable schema: the wire envelope the browser scope validates against.
 * Undefined when the schema library is missing, which simply means this entry
 * exposes no settings form and the browser half uses its fallback store.
 */
const Config =
  z === void 0
    ? void 0
    : z.object({
        [FOLDED_FIELD]: z.boolean().default(false).volatile(),
      });
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 主要维护风险是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

关键风险是非正式DOM契约。作者承认官方slot只给每项，没有列表包裹槽，因此观察body并跟踪布局变化；上游改变nav结构可能无锚点。Host只探测z.object，没有单独探测volatile方法，旧schema版本兼容仍需核对。卸载断开观察器并移除keydown为正面支持，但本轮没证明键盘和读屏完整性。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:678-699](https://github.com/ACGsu/dsh-sidebar-panel-fold/blob/7353d026fe87d4e87b74ea3ba4dac6efd4bf1bec/src/client.js#L678-L699)

观察器与全局事件生命周期。

<details>
<summary>查看原文（22行）</summary>

```text
        const observer = new MutationObserver(schedule);
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["aria-current", "aria-label", "class", "data-sidebar-collapsed"],
        });

        document.addEventListener("pointerdown", onDocumentPointerDown, true);
        document.addEventListener("keydown", onDocumentKeyDown, true);
        window.addEventListener("resize", onViewportChange);
        window.addEventListener("scroll", onViewportChange, true);

        return () => {
          offState();
          observer.disconnect();
          document.removeEventListener("pointerdown", onDocumentPointerDown, true);
          document.removeEventListener("keydown", onDocumentKeyDown, true);
          window.removeEventListener("resize", onViewportChange);
          window.removeEventListener("scroll", onViewportChange, true);
          if (runtime.raf !== null) cancelAnimationFrame(runtime.raf);
          if (runtime.menuRaf !== null) cancelAnimationFrame(runtime.menuRaf);
```

</details>

**依据 2 · 源码核查**：[src/index.js:29-56](https://github.com/ACGsu/dsh-sidebar-panel-fold/blob/7353d026fe87d4e87b74ea3ba4dac6efd4bf1bec/src/index.js#L29-L56)

存在object不代表volatile必然可用。

<details>
<summary>查看原文（28行）</summary>

```text
async function loadSchema() {
  try {
    const mod = await import("@deepseek-ai/schemastery");
    const z = mod?.default ?? mod;
    return typeof z?.object === "function" ? z : void 0;
  } catch (error) {
    console.warn(
      "[dsh-sidebar-panel-fold] @deepseek-ai/schemastery is not resolvable from this install " +
        "(a `link:` install does that — use `file:` instead); the fold state will fall back to localStorage",
      error,
    );
    return void 0;
  }
}

const z = await loadSchema();

/**
 * Durable schema: the wire envelope the browser scope validates against.
 * Undefined when the schema library is missing, which simply means this entry
 * exposes no settings form and the browser half uses its fallback store.
 */
const Config =
  z === void 0
    ? void 0
    : z.object({
        [FOLDED_FIELD]: z.boolean().default(false).volatile(),
      });
```

</details>

#### 缺口

- 新宿主DOM和可访问性未实际核查
  **影响**：限制默认长期启用判断
  **进一步探讨**：按面板、窄轨、Tab、Escape与读屏顺序核对。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 节省空间是否抵得过额外点击？

**研究主题**：效果与总成本、采用判断

#### 完整回答

面板多而切换少的人更可能受益，频繁切换用户可能宁愿完整列表。资源成本是DOM观察和重新排布，无模型费用来源，但不可直接称无成本。先在隔离profile收起、逐个切换、重启并展开，异常禁用即可恢复原列表。衡量应包括可视会话数、访问步数和错误选择，当前未量化节时。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:456-488](https://github.com/ACGsu/dsh-sidebar-panel-fold/blob/7353d026fe87d4e87b74ea3ba4dac6efd4bf1bec/src/client.js#L456-L488)

切换与展开都由浮层动作承担。

<details>
<summary>查看原文（33行）</summary>

```text
          item.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            // Hand the switch back to the built-in row so DSH's own selectPanel
            // path (analytics included) stays authoritative.
            const target = panel.row.isConnected ? panel.row : null;
            closeMenu();
            target?.click();
          });
          menu.appendChild(item);
        }
        if (panels.length > 0) {
          const separator = document.createElement("div");
          separator.className = CLS_SEP;
          separator.setAttribute("role", "separator");
          menu.appendChild(separator);
          const unfold = document.createElement("button");
          unfold.type = "button";
          unfold.className = CLS_ITEM;
          unfold.setAttribute("role", "menuitem");
          const unfoldIcon = document.createElement("span");
          unfoldIcon.className = CLS_ITEM_ICON;
          unfoldIcon.setAttribute("aria-hidden", "true");
          unfoldIcon.innerHTML = CARET_UP;
          const unfoldLabel = document.createElement("span");
          unfoldLabel.className = CLS_ITEM_LABEL;
          unfoldLabel.textContent = t("menu.unfold");
          unfold.append(unfoldIcon, unfoldLabel);
          unfold.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            closeMenu();
            void state.set(false);
```

</details>

**依据 2 · 源码核查**：[src/client.js:678-699](https://github.com/ACGsu/dsh-sidebar-panel-fold/blob/7353d026fe87d4e87b74ea3ba4dac6efd4bf1bec/src/client.js#L678-L699)

持续观察与清理是资源和恢复路径。

<details>
<summary>查看原文（22行）</summary>

```text
        const observer = new MutationObserver(schedule);
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["aria-current", "aria-label", "class", "data-sidebar-collapsed"],
        });

        document.addEventListener("pointerdown", onDocumentPointerDown, true);
        document.addEventListener("keydown", onDocumentKeyDown, true);
        window.addEventListener("resize", onViewportChange);
        window.addEventListener("scroll", onViewportChange, true);

        return () => {
          offState();
          observer.disconnect();
          document.removeEventListener("pointerdown", onDocumentPointerDown, true);
          document.removeEventListener("keydown", onDocumentKeyDown, true);
          window.removeEventListener("resize", onViewportChange);
          window.removeEventListener("scroll", onViewportChange, true);
          if (runtime.raf !== null) cancelAnimationFrame(runtime.raf);
          if (runtime.menuRaf !== null) cancelAnimationFrame(runtime.menuRaf);
```

</details>

#### 缺口

- 净导航效率没有同条件对照
  **影响**：不保证所有用户都省时
  **进一步探讨**：用同一面板布局比较常用任务步数和完成时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 正式列表槽能否替代观察器？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是宿主提供列表容器槽、活动面板和切换接口后，插件直接声明折叠视图。增量是维护边界从DOM启发式转成接口契约，不是增加视觉功能。用宿主布局变更样本比较当前扫描与接口原型的失效和修改量；若仍需DOM桥接或维护量不降，应拒绝复杂迁移。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:11-23](https://github.com/ACGsu/dsh-sidebar-panel-fold/blob/7353d026fe87d4e87b74ea3ba4dac6efd4bf1bec/src/client.js#L11-L23)

缺少容器槽是明确推导起点。

<details>
<summary>查看原文（13行）</summary>

```text
     * The sidebar's global panel list (the `nav` inside the sidebar) is rendered
     * exclusively by SidebarRoot: the `sidebar.panellist` slot only produces one
     * PanelRow per registered panel, so no official seam wraps the whole list.
     * This half therefore anchors on two stable facts guaranteed by the renderer
     * and the sidebar:
     *
     *   1. `[data-slot="sidebar.panellist"]` — emitted by SlotOutlet for every
     *      list entry, with `display: contents` so it never joins layout;
     *   2. the `nav` element containing it — the panel list container.
     *
     * It then owns exactly one sibling element placed *before* that `nav` (never
     * inside React's child list) plus a stylesheet that can hide the `nav`.
     */
```

</details>

#### 缺口

- 宿主接口尚未具备或验证
  **影响**：不构成现有能力
  **进一步探讨**：先在最小宿主扩展里比较扫描依赖。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
