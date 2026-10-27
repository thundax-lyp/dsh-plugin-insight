# dsh-composer-expand

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[e816461](https://github.com/13071301808/dsh-composer-expand/tree/e816461115436f1cb084f868398e610396d00679)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/13071301808/dsh-composer-expand) [![npm 30d 969](https://img.shields.io/static/v1?label=npm+30d&message=969&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-composer-expand) [![最新发布 2026-09-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-composer-expand)
<!-- END META -->

> **功能**：在DSH会话输入工具行增加展开按钮，切换70vh长稿视图、记忆浏览器状态，并在展开时调整普通Enter行为。

> **亮点**：借官方slot/data属性调整高度和Enter，并在DOM重建后恢复展开；只存布尔状态，host无功能/外部请求。详见[Q02](#research-q02)。

> **主要限制**：样式只第一root却键盘绑所有seat，菜单仅seat内检测；Lexical原生换行/撤销依宿主；全局observer与强Set旧seat可能累积。兼容表非操作验收。详见[Q03](#research-q03)。

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
  - [Q01 · 适合什么输入任务，成功结果是什么？](#detail-section-11)
  - [Q02 · 展开、记忆和DOM自愈怎样实现？](#detail-section-12)
  - [Q03 · 回车与多界面/资源边界是什么？](#detail-section-13)
  - [Q04 · 如何启动并选择适用环境？](#detail-section-14)
  - [Q05 · 首次、持续与失败成本和效果怎样？](#detail-section-15)
  - [Q06 · 推荐及可继续探讨方向是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在DSH Web会话写长prompt/多行草稿、觉得默认输入框过矮的用户。插件只在conversation.input.right放展开按钮，70vh书写视图、最小300px区域并切换普通Enter为换行；不是新编辑器、草稿备份或Agent工作流能力。

合格结果应是长稿更容易看与编辑，输入内容/光标/IME不被破坏，菜单Enter与发送快捷键保持可预测，收起/卸载回默认。基线是默认composer内滚动或在外部编辑器写后粘贴。价值是就地少切窗口，不是提升模型推理或保证prompt质量。

默认输入内滚动或外部编辑后粘贴；插件省切换，编辑效率/误发送率无对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 展开/收起 | 长稿70vh视图 | 固定高度/最小值需核小屏 |
| Enter调整 | 展开普通回车换行意图 | 依Lexical/菜单/IME契约 |
| 状态记忆 | 浏览器刷新/切换保留 | 非逐session |
| DOM自愈 | 重建后样式/监听恢复 | 第一root与全seat范围差异 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 不满足时 |
| --- | --- | --- |
| 兼容Web客户端/React18/slots/locale | 按钮/翻译文案/状态 | 静态注入服务缺失影响加载 |
| conversation bundle与data DOM契约 | CSS和键盘锚点 | 找不到root no-op，不代表按钮功能完整 |
| Node ^22.19或>=24及包lib | host/loader入口 | 已有预构建，源开发需tsdown |
| browser localStorage | 单浏览器展开记忆 | 失败回默认收起，不存草稿内容 |



#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | 核自己的Web/宿主版本及plugin entry | 广兼容表是作者声明，operations unknown |
| 展开 | 从发送旁按钮切换 | 高度/内容/光标仍正确 |
| 编辑 | 分别核普通/修饰Enter与IME菜单 | 不把换行变意外发送或破坏undo |
| 切换 | 会话/视图/工作区/重载 | 了解全浏览器状态而非逐会话 |
| 关闭 | 收起/卸载 | 样式/observer/监听器回收依宿主生命周期 |

无需密钥/模型/外部服务，源码无网络/文件读取/host命令或session事件写入。package列大量compatible但dshOperations全unknown，README诚实不声称安装启动卸载验收；不将列表数量当本轮兼容结论。

**效果与成本**

#### 成本

| 阶段 | 现金与资源 | 人工与时间 | 已知与未知 |
| --- | --- | --- | --- |
| 首次 | 现有DSH/Web和小包，无新增模型/服务请求 | 安装重启，核输入快捷键 | 无工时估值/包价格数据 |
| 持续使用 | localStorage一布尔状态、observer与seat监听器 | 适应展开Enter，核菜单/切视图 | 长会话重建时内存/扫描开销未量化 |
| 失败恢复 | 关闭插件/重载清运行DOM | 保存草稿后收起或卸载，核原行为 | 无草稿备份保证，输入问题恢复时间未知 |



#### 效果

| 目标 | 代码增量 | 证据边界 |
| --- | --- | --- |
| 长稿可读 | 70vh/最小高度+按钮 | 小屏min-height与可用高度需看布局 |
| 少重复设置 | 浏览器记忆/重建重扫 | 不按session，多个UI不同步风险 |
| 降误发送意图 | 展开普通Enter不传播 | 菜单/IME/编辑历史需按宿主代际核 |
| 低外部成本 | 无模型/HTTP/host命令 | 不等于零客户端CPU/内存 |

没有同草稿输入效率/误发送率对照，不能从视图更大直接量化生产力。最小300px/260px与70vh也不自动保证所有小屏都有足够会话空间。

> **思考**：样式只第一root却键盘绑所有seat，菜单仅seat内检测；Lexical原生换行/撤销依宿主；全局observer与强Set旧seat可能累积。兼容表非操作验收。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：借官方slot/data属性调整高度和Enter，并在DOM重建后恢复展开；只存布尔状态，host无功能/外部请求。详见[Q02](#research-q02)。

capture handler只对无修饰Enter且非isComposing、target属于seat内editable、seat内无listbox时stopPropagation，不preventDefault。这样试图避开宿主bubble发送并保原生换行，IME/修饰键主动让路是合理约束。但Lexical是否接纳原生编辑DOM/历史、是否丢光标或撤销边界依宿主实际事件链，不能仅凭stopPropagation证明所有编辑器正确。

菜单检测只找seat内[role=listbox]，若宿主portal到seat外，可能错误拦截选候选；先前祖先capture发送也不受此监听影响。多root时仅第一root变高却所有seat拦Enter，样式与行为可不同步；README承认单composer假设，不能把props.sessionId当实际隔离。

observer对全document子树每次新增都查全root/seats，无debounce；bound强Set一直保留卸载前见过的seat，包括已脱离DOM的旧节点，长时间视图重建可能增资源。cleanup会释放本轮，但中途不清旧seat。localStorage失败可回false/忽略写；locale.register有catch回英文，useEffect仍直接调用locale.subscribe，不能把register异常降级扩大为所有locale故障均不崩。style移除依赖宿主loader识别data-plugin，不是本函数显式移除。

<a id="detail-section-5"></a>

### 1.4 主要限制

样式只第一root却键盘绑所有seat，菜单仅seat内检测；Lexical原生换行/撤销依宿主；全局observer与强Set旧seat可能累积。兼容表非操作验收。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有试用，长草稿/单composer用户先核Enter、IME、菜单与收起行为；不作为草稿备份。详见[Q06](#research-q06)。

合格结果应是长稿更容易看与编辑，输入内容/光标/IME不被破坏，菜单Enter与发送快捷键保持可预测，收起/卸载回默认。基线是默认composer内滚动或在外部编辑器写后粘贴。价值是就地少切窗口，不是提升模型推理或保证prompt质量。

采用建议：有试用，长草稿/单composer用户先核Enter、IME、菜单与收起行为；不作为草稿备份。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。纯客户端高度切换与清理链明确，编辑/菜单与多root代际边界需要按环境核。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client/index.js、src/index.js、lib/client.js、lib/index.js、cordis.patch.yml、tsdown.config.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整src客户端/host与预构建关键路径、包/patch/build声明；不启动宿主/编辑真实草稿或运行构建。
- 下一步：可继续比较双root/portaled菜单、IME撤销/小屏与反复DOM重建，核输入内容/根一致和资源。

**分析版本**

- **仓库**：[13071301808/dsh-composer-expand](https://github.com/13071301808/dsh-composer-expand)
- **版本号**：0.1.5（[固定提交 e816461](https://github.com/13071301808/dsh-composer-expand/tree/e816461115436f1cb084f868398e610396d00679)）
- **版本日期**：2026-10-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索slot实例root一致绑定/失效seat清理与视口高度clamp，以多root/菜单/IME和重建对照行为与资源；未实现。详见[Q06](#research-q06)。

可继续比较双root/portaled菜单、IME撤销/小屏与反复DOM重建，核输入内容/根一致和资源。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 521 | 318 | 186 | — |
| .md | source | 1 | 94 | — | — | 1330 |
| .mjs | source | 1 | 74 | 53 | 16 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/13071301808/dsh-composer-expand/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/13071301808/dsh-composer-expand/issues?q=is%3Aissue+created%3A2026-09-22T08%3A09%3A10.123Z..2026-10-22T08%3A09%3A10.123Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/13071301808/dsh-composer-expand/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T08%3A09%3A10.123Z..2026-10-22T08%3A09%3A10.123Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核长稿编辑场景、CSS/slot/键盘/DOM自愈、范围与编辑一致性、兼容依赖和资源成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适合什么输入任务，成功结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向在DSH Web会话写长prompt/多行草稿、觉得默认输入框过矮的用户。插件只在conversation.input.right放展开按钮，70vh书写视图、最小300px区域并切换普通Enter为换行；不是新编辑器、草稿备份或Agent工作流能力。

合格结果应是长稿更容易看与编辑，输入内容/光标/IME不被破坏，菜单Enter与发送快捷键保持可预测，收起/卸载回默认。基线是默认composer内滚动或在外部编辑器写后粘贴。价值是就地少切窗口，不是提升模型推理或保证prompt质量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-20](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/README.md#L5-L20)

作者场景/功能。

<details>
<summary>查看原文（16行）</summary>

```text
为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）打造的 composer 展开/收起插件。在 composer 工具行放一个 ⬆/⬇ 按钮，点击在「默认封顶高度」与「70vh 高书写视图」之间切换，长草稿不再挤在一个小窗口里滚动。

## 为什么需要

DSH 默认把 composer 文本框封顶在一个较小高度（seat 上定义了 `--dsh-composer-text-max-height: 336px`，限制文本框滚动容器）。草稿变长后，只能在小窗口里滚动几行。本插件对短草稿保持默认行为，写长 prompt 时一键切换到大视图。

## 功能

- **⬆ 按钮在 composer 工具行** — 位于 `conversation.input.right`（发送按钮旁官方预留的可点击控件位）。
- **展开到 70vh** — 在会话滚动容器上切换 CSS class；composer 输入区同步放宽 `max-height`。再点一次恢复默认封顶高度。
- **展开最小高度 300px** — 输入内容较少时也保持足够的书写空间；内容变多后最高仍受 `70vh` 限制。
- **展开状态回车换行** — 展开时普通回车只插入换行，不触发发送；`Ctrl/Cmd + Enter` 等带修饰键快捷键仍可用于发送；斜杠 / @ 触发菜单打开时不拦截，回车正常选候选。
- **浏览器内持久化** — 状态写入 `localStorage[dsh-composer-expand:expanded]`，刷新页面、切换工作区都保留。
- **展开状态自愈** — 展开期间监听 DOM 重建：即使 harness 重建了会话滚动容器或 composer 卡片（切视图、切会话），展开样式与"回车换行"行为也会自动重新应用到新的输入框上。
- **中英文双语** — 按钮文案与提示跟随 DSH 的 `locale` 服务。
- **纯前端** — 无自定义协议、无 host 命令、无 LLM 调用、不进会话日志。
```

</details>

**依据 2 · 源码核查**：[src/client/index.js:228-245](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/src/client/index.js#L228-L245)

按钮/slot实际。

<details>
<summary>查看原文（18行）</summary>

```text
    return createElement('button', {
      type: 'button',
      className: 'cpex-btn',
      title: title,
      'aria-pressed': on ? 'true' : 'false',
      'data-on': on ? 'true' : 'false',
      onClick: onClick,
    },
      createElement('span', { className: 'cpex-glyph', 'aria-hidden': 'true' }, on ? '⬇' : '⬆'),
      createElement('span', null, label),
    );
  }

  ctx.slots.inject('conversation.input.right', function () {
    return ctx.slots.register(
      { name: 'conversation.input.right', id: 'composer-expand', order: 90, label: 'Expand composer' },
      function (props) { return createElement(ExpandButton, props); },
    );
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 展开、记忆和DOM自愈怎样实现？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

React按钮state从单一localStorage键读，点击取反。effect管理document第一conversation-scroll的class，CSS覆盖composer seat的高度变量并给旧mirror/新input-scroll/编辑面设min/max-height。依稳定data属性而非构建hash，兼容两代输入DOM的意图清楚，但“稳定”是作者依赖契约，不是永久API保证。

展开时document全子树MutationObserver发现新增节点便重扫，将class加到第一root、keydown capture绑定所有seat；bound Set避免重复绑定，cleanup断observer、移class、解绑。持久状态按浏览器不分session，props.sessionId虽读但未用于选择/存储；跨工作区保留是便利也是范围限制。

贡献是官方slot上的小型CSS/键盘行为增强和DOM重建恢复，不是新算法。host apply为空，已检查预构建client关键路径与src一致，未重新build。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.js:56-79](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/src/client/index.js#L56-L79)

高度CSS。

<details>
<summary>查看原文（24行）</summary>

```text
const CSS = [
  '.' + CLASS_ON + ' { --' + CSS_VAR_HEIGHT + ': ' + TALL_HEIGHT + '; }',
  // The composer card sits inside [data-composer-seat], which is a direct
  // child of [data-conversation-scroll] in the default ChatView. The
  // [data-conversation-composer-overlay] anchor only exists in the
  // Trajectory view, so it is not used here.
  // Uncap the REAL height limit: the harness seat sets
  // --dsh-composer-text-max-height (336px) which caps the input scrollport
  // (.scroll[data-input-scroll] { max-height: var(...) }); overriding the
  // variable on the seat relaxes that cap. The variable lives on the seat
  // in both composer generations (textarea-era and Lexical-era), so this
  // rule is generation-agnostic.
  '.' + CLASS_ON + ' [data-composer-seat] { --dsh-composer-text-max-height: var(--' + CSS_VAR_HEIGHT + ') !important; }',
  // Floor: keep enough writing space even with little content. The
  // textarea-era composer sized the surface through a hidden mirror
  // ([data-input-mirror]); the Lexical-era composer exposes
  // [data-input-scroll] (capped scrollport) and [data-composer-input]
  // (contenteditable host). Anchor both generations; hashed CSS classes
  // are deliberately never used.
  '.' + CLASS_ON + ' [data-input-mirror] { min-height: 300px !important; }',
  '.' + CLASS_ON + ' [data-input-scroll] { min-height: 300px !important; }',
  '.' + CLASS_ON + ' [data-composer-input] { min-height: 260px !important; max-height: var(--' + CSS_VAR_HEIGHT + ') !important; }',
  // Belt-and-braces: keep the editor surface under the tall cap.
  '.' + CLASS_ON + ' [data-composer-seat] textarea { max-height: var(--' + CSS_VAR_HEIGHT + ') !important; }',
```

</details>

**依据 2 · 源码核查**：[src/client/index.js:111-115](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/src/client/index.js#L111-L115)

持久键。

```text
function readStored() {
  try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch (_) { return false; }
}
function writeStored(on) {
  try { localStorage.setItem(STORAGE_KEY, on ? '1' : '0'); } catch (_) { /* private mode */ }
```

**依据 3 · 源码核查**：[src/client/index.js:144-196](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/src/client/index.js#L144-L196)

DOM重扫/cleanup。

<details>
<summary>查看原文（53行）</summary>

```text
function manageExpandedDom(on) {
  if (typeof document === 'undefined') return;

  if (!on) {
    document.querySelectorAll('[data-conversation-scroll].' + CLASS_ON).forEach(function (root) {
      root.classList.remove(CLASS_ON);
    });
    writeStored(false);
    return;
  }

  writeStored(true);

  const bound = new Set();
  const handleKeyDown = function (event) {
    if (event.key !== 'Enter' || event.shiftKey || event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
    const target = event.target;
    if (typeof Element === 'undefined' || !(target instanceof Element)) return;
    const seat = target.closest('[data-composer-seat]');
    if (!seat) return;
    const editable = target.closest('[data-composer-input], textarea, [contenteditable="true"]');
    if (!editable || !seat.contains(editable)) return; // only intercept typing inside the editor
    if (seat.querySelector('[role="listbox"]')) return; // trigger menu open: Enter picks the candidate
    event.stopPropagation();
  };
  const applyClass = function () {
    const root = document.querySelector('[data-conversation-scroll]');
    if (root) root.classList.add(CLASS_ON);
  };
  const bindSeats = function () {
    document.querySelectorAll('[data-composer-seat]').forEach(function (seat) {
      if (bound.has(seat)) return;
      seat.addEventListener('keydown', handleKeyDown, true);
      bound.add(seat);
    });
  };
  const sweep = function () { applyClass(); bindSeats(); };

  sweep();
  const observer = typeof MutationObserver === 'undefined' ? null : new MutationObserver(function (mutations) {
    for (let i = 0; i < mutations.length; i++) {
      if (mutations[i].addedNodes.length > 0) { sweep(); return; }
    }
  });
  if (observer) observer.observe(document.documentElement, { childList: true, subtree: true });

  return function () {
    if (observer) observer.disconnect();
    document.querySelectorAll('[data-conversation-scroll].' + CLASS_ON).forEach(function (root) {
      root.classList.remove(CLASS_ON);
    });
    bound.forEach(function (seat) { seat.removeEventListener('keydown', handleKeyDown, true); });
  };
```

</details>

**依据 4 · 源码核查**：[src/client/index.js:211-224](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/src/client/index.js#L211-L224)

React状态与sessionId未消费。

<details>
<summary>查看原文（14行）</summary>

```text
  function ExpandButton(props) {
    const sessionId = props.sessionId ? String(props.sessionId) : '';
    const [on, setOn] = useState(readStored());
    const [, setLocaleTick] = useState(0);

    useEffect(function () {
      return ctx.locale.subscribe(function () { setLocaleTick(function (x) { return x + 1; }); });
    }, []);

    useEffect(function () {
      return manageExpandedDom(on);
    }, [on]);

    const onClick = useCallback(function () { setOn(function (v) { return !v; }); }, []);
```

</details>

**依据 5 · 源码核查**：[src/index.js:1-11](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/src/index.js#L1-L11)

host空入口。

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * dsh-composer-expand — host half.
 *
 * The browser half owns the entire UI (button + CSS height toggle) through
 * the `conversation.input.right` slot. There are no commands, services, or
 * session hooks to register here, but the bundle manifest expects
 * `lib/index.js` to exist, so this file is a minimal apply() stub.
 */
export function apply() {
  // no-op: the client half is self-contained.
}
```

</details>

**依据 6 · 源码核查**：[lib/client.js:133-184](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/lib/client.js#L133-L184)

发布候选client同关键行为。

<details>
<summary>查看原文（52行）</summary>

```text
				document.querySelectorAll("[data-conversation-scroll].dsh-composer-expand-on").forEach(function(root) {
					root.classList.remove(CLASS_ON);
				});
				writeStored(false);
				return;
			}
			writeStored(true);
			const bound = /* @__PURE__ */ new Set();
			const handleKeyDown = function(event) {
				if (event.key !== "Enter" || event.shiftKey || event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
				const target = event.target;
				if (typeof Element === "undefined" || !(target instanceof Element)) return;
				const seat = target.closest("[data-composer-seat]");
				if (!seat) return;
				const editable = target.closest("[data-composer-input], textarea, [contenteditable=\"true\"]");
				if (!editable || !seat.contains(editable)) return;
				if (seat.querySelector("[role=\"listbox\"]")) return;
				event.stopPropagation();
			};
			const applyClass = function() {
				const root = document.querySelector("[data-conversation-scroll]");
				if (root) root.classList.add(CLASS_ON);
			};
			const bindSeats = function() {
				document.querySelectorAll("[data-composer-seat]").forEach(function(seat) {
					if (bound.has(seat)) return;
					seat.addEventListener("keydown", handleKeyDown, true);
					bound.add(seat);
				});
			};
			const sweep = function() {
				applyClass();
				bindSeats();
			};
			sweep();
			const observer = typeof MutationObserver === "undefined" ? null : new MutationObserver(function(mutations) {
				for (let i = 0; i < mutations.length; i++) if (mutations[i].addedNodes.length > 0) {
					sweep();
					return;
				}
			});
			if (observer) observer.observe(document.documentElement, {
				childList: true,
				subtree: true
			});
			return function() {
				if (observer) observer.disconnect();
				document.querySelectorAll("[data-conversation-scroll].dsh-composer-expand-on").forEach(function(root) {
					root.classList.remove(CLASS_ON);
				});
				bound.forEach(function(seat) {
					seat.removeEventListener("keydown", handleKeyDown, true);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 回车与多界面/资源边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

capture handler只对无修饰Enter且非isComposing、target属于seat内editable、seat内无listbox时stopPropagation，不preventDefault。这样试图避开宿主bubble发送并保原生换行，IME/修饰键主动让路是合理约束。但Lexical是否接纳原生编辑DOM/历史、是否丢光标或撤销边界依宿主实际事件链，不能仅凭stopPropagation证明所有编辑器正确。

菜单检测只找seat内[role=listbox]，若宿主portal到seat外，可能错误拦截选候选；先前祖先capture发送也不受此监听影响。多root时仅第一root变高却所有seat拦Enter，样式与行为可不同步；README承认单composer假设，不能把props.sessionId当实际隔离。

observer对全document子树每次新增都查全root/seats，无debounce；bound强Set一直保留卸载前见过的seat，包括已脱离DOM的旧节点，长时间视图重建可能增资源。cleanup会释放本轮，但中途不清旧seat。localStorage失败可回false/忽略写；locale.register有catch回英文，useEffect仍直接调用locale.subscribe，不能把register异常降级扩大为所有locale故障均不崩。style移除依赖宿主loader识别data-plugin，不是本函数显式移除。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.js:158-188](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/src/client/index.js#L158-L188)

键盘/第一root/全seat/全局observer。

<details>
<summary>查看原文（31行）</summary>

```text
  const handleKeyDown = function (event) {
    if (event.key !== 'Enter' || event.shiftKey || event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
    const target = event.target;
    if (typeof Element === 'undefined' || !(target instanceof Element)) return;
    const seat = target.closest('[data-composer-seat]');
    if (!seat) return;
    const editable = target.closest('[data-composer-input], textarea, [contenteditable="true"]');
    if (!editable || !seat.contains(editable)) return; // only intercept typing inside the editor
    if (seat.querySelector('[role="listbox"]')) return; // trigger menu open: Enter picks the candidate
    event.stopPropagation();
  };
  const applyClass = function () {
    const root = document.querySelector('[data-conversation-scroll]');
    if (root) root.classList.add(CLASS_ON);
  };
  const bindSeats = function () {
    document.querySelectorAll('[data-composer-seat]').forEach(function (seat) {
      if (bound.has(seat)) return;
      seat.addEventListener('keydown', handleKeyDown, true);
      bound.add(seat);
    });
  };
  const sweep = function () { applyClass(); bindSeats(); };

  sweep();
  const observer = typeof MutationObserver === 'undefined' ? null : new MutationObserver(function (mutations) {
    for (let i = 0; i < mutations.length; i++) {
      if (mutations[i].addedNodes.length > 0) { sweep(); return; }
    }
  });
  if (observer) observer.observe(document.documentElement, { childList: true, subtree: true });
```

</details>

**依据 2 · 源码核查**：[src/client/index.js:190-196](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/src/client/index.js#L190-L196)

退出释放。

```text
  return function () {
    if (observer) observer.disconnect();
    document.querySelectorAll('[data-conversation-scroll].' + CLASS_ON).forEach(function (root) {
      root.classList.remove(CLASS_ON);
    });
    bound.forEach(function (seat) { seat.removeEventListener('keydown', handleKeyDown, true); });
  };
```

**依据 3 · 源码核查**：[src/client/index.js:199-218](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/src/client/index.js#L199-L218)

locale注册catch但subscribe直接调用。

<details>
<summary>查看原文（20行）</summary>

```text
export function apply(ctx) {
  injectStyle();

  let t = function (key) { return EN[key] || ZH[key] || key; };
  try {
    ctx.locale.register(ID, 'zh', ZH);
    ctx.locale.register(ID, 'en', EN);
    t = ctx.locale.bind(ID);
  } catch (error) {
    console.error(ID + ': locale registration failed: ' + String(error));
  }

  function ExpandButton(props) {
    const sessionId = props.sessionId ? String(props.sessionId) : '';
    const [on, setOn] = useState(readStored());
    const [, setLocaleTick] = useState(0);

    useEffect(function () {
      return ctx.locale.subscribe(function () { setLocaleTick(function (x) { return x + 1; }); });
    }, []);
```

</details>

**依据 4 · 源码核查**：[src/client/index.js:86-95](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/src/client/index.js#L86-L95)

style所有权标记。

<details>
<summary>查看原文（10行）</summary>

```text
/** One <style data-plugin> tag per load; the loader removes plugin-owned tags on unload. */
function injectStyle() {
  const tagId = ID + '/button.css';
  if (typeof document !== 'undefined' && document.querySelector('style[data-plugin-css="' + tagId + '"]') === null) {
    const tag = document.createElement('style');
    tag.dataset.plugin = ID;
    tag.dataset.pluginCss = tagId;
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }
```

</details>

**依据 5 · 作者声明**：[README.md:76-90](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/README.md#L76-L90)

作者已知范围/清理声明。

<details>
<summary>查看原文（15行）</summary>

```text
## 已知限制

- 状态按浏览器记忆，不按会话。DSH 同一时刻只渲染一个 composer，目前无感知差异；若未来同时渲染多个，需要收窄 DOM 选择器。
- 展开高度固定为 `70vh`。未来版本可在设置卡片里提供高度滑块。
- `--dsh-composer-text-max-height`（336px）是 DSH 的设计选择。本插件只放宽 composer 文本框容器，不影响其他 disclosure 行。

## DSH STORE 兼容与权限声明（供自动复检读取）

- **Node.js**：`^22.19.0 || >=24.0.0`（见 `package.json engines`）。
- **DSH 范围**：`>=0.1.0-rc.7 <0.3.0`；逐版本结论见 `package.json → dsh.compatibility.dshReleases`，官方最新三版（当前 `0.2.1-alpha.1 / alpha.2 / alpha.3`，另前瞻声明 `alpha.4`）均为 `compatible`。
- **`dshOperations` 诚实声明为 `unknown`**：尚未提供一次性 Profile 的安装/启动/卸载/回滚证据，不虚构 `passed`。
- **依赖**：`peerDependencies` 仅 `@deepseek-ai/cordis ^4.0.1` 与 `react ^18.2.0`（由 harness 提供，不打包）；客户端仅使用官方 `slots`、`locale` 服务，`dsh.client.inject` 仅声明 `@deepseek-ai/dsh-client-ui-conversation`；无 `preinstall/install/postinstall/prepare` 生命周期脚本。
- **权限**：无文件、无网络、无命令、无凭据访问；仅写浏览器 `localStorage[dsh-composer-expand:expanded]`（插件私有展开状态），以及对 `[data-conversation-scroll]` / `[data-composer-seat]` 的 DOM class 与 capture 阶段 keydown 监听。无外部服务、无 host 命令、无 LLM 调用、不写会话日志。
- **Entry IDs**：仅新增自有 ID —— Bundle Patch 插入 `composer-expand`，客户端 `slots.register` 为 `conversation.input.right / composer-expand`；不替换、不禁用任何 `@deepseek-ai/*` 官方包或受保护 entry。
- **失败边界**：`localStorage` 不可用（隐私模式）则回落为默认收起；找不到 DOM 锚点则 no-op；`locale` 注册失败则回落英文并 `console.error`；卸载时 loader 移除插件自有 `<style>`，observer disconnect 并移除已加 class。
```

</details>

#### 缺口

- Lexical编辑/IME/撤销、portaled菜单和多root场景的实际事件顺序未对照。
  **影响**：不承诺每代宿主全部输入行为正确。
  **进一步探讨**：用无秘密草稿与宿主DOM事件记录核回车/撤销/菜单、拆分root和反复重建后的绑定数量。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何启动并选择适用环境？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 不满足时 |
| --- | --- | --- |
| 兼容Web客户端/React18/slots/locale | 按钮/翻译文案/状态 | 静态注入服务缺失影响加载 |
| conversation bundle与data DOM契约 | CSS和键盘锚点 | 找不到root no-op，不代表按钮功能完整 |
| Node ^22.19或>=24及包lib | host/loader入口 | 已有预构建，源开发需tsdown |
| browser localStorage | 单浏览器展开记忆 | 失败回默认收起，不存草稿内容 |

#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | 核自己的Web/宿主版本及plugin entry | 广兼容表是作者声明，operations unknown |
| 展开 | 从发送旁按钮切换 | 高度/内容/光标仍正确 |
| 编辑 | 分别核普通/修饰Enter与IME菜单 | 不把换行变意外发送或破坏undo |
| 切换 | 会话/视图/工作区/重载 | 了解全浏览器状态而非逐会话 |
| 关闭 | 收起/卸载 | 样式/observer/监听器回收依宿主生命周期 |

无需密钥/模型/外部服务，源码无网络/文件读取/host命令或session事件写入。package列大量compatible但dshOperations全unknown，README诚实不声称安装启动卸载验收；不将列表数量当本轮兼容结论。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:10-17](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/package.json#L10-L17)

Node/入口。

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
```

**依据 2 · 源码核查**：[package.json:42-64](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/package.json#L42-L64)

peer/客户端/patch。

<details>
<summary>查看原文（23行）</summary>

```text
    "react": "^18.2.0"
  },
  "devDependencies": {
    "tsdown": "^0.22.14"
  },
  "dsh": {
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-conversation"
      ],
      "platform": "web"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "compatibility": {
      "dsh": ">=0.1.0-rc.7 <0.3.0",
      "dshReleases": {
        "0.1.0-rc.2": "unknown",
        "0.1.0-rc.3": "unknown",
        "0.1.0-rc.6": "unknown",
        "0.1.0-rc.7": "compatible",
        "0.1.0-rc.8": "compatible",
```

</details>

**依据 3 · 作者声明**：[README.md:84-90](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/README.md#L84-L90)

作者兼容/operations/权限。

```text
- **Node.js**：`^22.19.0 || >=24.0.0`（见 `package.json engines`）。
- **DSH 范围**：`>=0.1.0-rc.7 <0.3.0`；逐版本结论见 `package.json → dsh.compatibility.dshReleases`，官方最新三版（当前 `0.2.1-alpha.1 / alpha.2 / alpha.3`，另前瞻声明 `alpha.4`）均为 `compatible`。
- **`dshOperations` 诚实声明为 `unknown`**：尚未提供一次性 Profile 的安装/启动/卸载/回滚证据，不虚构 `passed`。
- **依赖**：`peerDependencies` 仅 `@deepseek-ai/cordis ^4.0.1` 与 `react ^18.2.0`（由 harness 提供，不打包）；客户端仅使用官方 `slots`、`locale` 服务，`dsh.client.inject` 仅声明 `@deepseek-ai/dsh-client-ui-conversation`；无 `preinstall/install/postinstall/prepare` 生命周期脚本。
- **权限**：无文件、无网络、无命令、无凭据访问；仅写浏览器 `localStorage[dsh-composer-expand:expanded]`（插件私有展开状态），以及对 `[data-conversation-scroll]` / `[data-composer-seat]` 的 DOM class 与 capture 阶段 keydown 监听。无外部服务、无 host 命令、无 LLM 调用、不写会话日志。
- **Entry IDs**：仅新增自有 ID —— Bundle Patch 插入 `composer-expand`，客户端 `slots.register` 为 `conversation.input.right / composer-expand`；不替换、不禁用任何 `@deepseek-ai/*` 官方包或受保护 entry。
- **失败边界**：`localStorage` 不可用（隐私模式）则回落为默认收起；找不到 DOM 锚点则 no-op；`locale` 注册失败则回落英文并 `console.error`；卸载时 loader 移除插件自有 `<style>`，observer disconnect 并移除已加 class。
```

**依据 4 · 源码核查**：[src/client/index.js:45-48](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/src/client/index.js#L45-L48)

客户端硬服务。

```text
import { createElement, useCallback, useEffect, useState } from 'react'

// Slot context + locale for i18n.
export const inject = ['slots', 'locale']
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 首次、持续与失败成本和效果怎样？

**研究主题**：效果与总成本

#### 完整回答

#### 成本

| 阶段 | 现金与资源 | 人工与时间 | 已知与未知 |
| --- | --- | --- | --- |
| 首次 | 现有DSH/Web和小包，无新增模型/服务请求 | 安装重启，核输入快捷键 | 无工时估值/包价格数据 |
| 持续使用 | localStorage一布尔状态、observer与seat监听器 | 适应展开Enter，核菜单/切视图 | 长会话重建时内存/扫描开销未量化 |
| 失败恢复 | 关闭插件/重载清运行DOM | 保存草稿后收起或卸载，核原行为 | 无草稿备份保证，输入问题恢复时间未知 |

#### 效果

| 目标 | 代码增量 | 证据边界 |
| --- | --- | --- |
| 长稿可读 | 70vh/最小高度+按钮 | 小屏min-height与可用高度需看布局 |
| 少重复设置 | 浏览器记忆/重建重扫 | 不按session，多个UI不同步风险 |
| 降误发送意图 | 展开普通Enter不传播 | 菜单/IME/编辑历史需按宿主代际核 |
| 低外部成本 | 无模型/HTTP/host命令 | 不等于零客户端CPU/内存 |

没有同草稿输入效率/误发送率对照，不能从视图更大直接量化生产力。最小300px/260px与70vh也不自动保证所有小屏都有足够会话空间。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.js:56-79](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/src/client/index.js#L56-L79)

高度资源。

<details>
<summary>查看原文（24行）</summary>

```text
const CSS = [
  '.' + CLASS_ON + ' { --' + CSS_VAR_HEIGHT + ': ' + TALL_HEIGHT + '; }',
  // The composer card sits inside [data-composer-seat], which is a direct
  // child of [data-conversation-scroll] in the default ChatView. The
  // [data-conversation-composer-overlay] anchor only exists in the
  // Trajectory view, so it is not used here.
  // Uncap the REAL height limit: the harness seat sets
  // --dsh-composer-text-max-height (336px) which caps the input scrollport
  // (.scroll[data-input-scroll] { max-height: var(...) }); overriding the
  // variable on the seat relaxes that cap. The variable lives on the seat
  // in both composer generations (textarea-era and Lexical-era), so this
  // rule is generation-agnostic.
  '.' + CLASS_ON + ' [data-composer-seat] { --dsh-composer-text-max-height: var(--' + CSS_VAR_HEIGHT + ') !important; }',
  // Floor: keep enough writing space even with little content. The
  // textarea-era composer sized the surface through a hidden mirror
  // ([data-input-mirror]); the Lexical-era composer exposes
  // [data-input-scroll] (capped scrollport) and [data-composer-input]
  // (contenteditable host). Anchor both generations; hashed CSS classes
  // are deliberately never used.
  '.' + CLASS_ON + ' [data-input-mirror] { min-height: 300px !important; }',
  '.' + CLASS_ON + ' [data-input-scroll] { min-height: 300px !important; }',
  '.' + CLASS_ON + ' [data-composer-input] { min-height: 260px !important; max-height: var(--' + CSS_VAR_HEIGHT + ') !important; }',
  // Belt-and-braces: keep the editor surface under the tall cap.
  '.' + CLASS_ON + ' [data-composer-seat] textarea { max-height: var(--' + CSS_VAR_HEIGHT + ') !important; }',
```

</details>

**依据 2 · 源码核查**：[src/client/index.js:158-188](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/src/client/index.js#L158-L188)

监听和重扫成本。

<details>
<summary>查看原文（31行）</summary>

```text
  const handleKeyDown = function (event) {
    if (event.key !== 'Enter' || event.shiftKey || event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
    const target = event.target;
    if (typeof Element === 'undefined' || !(target instanceof Element)) return;
    const seat = target.closest('[data-composer-seat]');
    if (!seat) return;
    const editable = target.closest('[data-composer-input], textarea, [contenteditable="true"]');
    if (!editable || !seat.contains(editable)) return; // only intercept typing inside the editor
    if (seat.querySelector('[role="listbox"]')) return; // trigger menu open: Enter picks the candidate
    event.stopPropagation();
  };
  const applyClass = function () {
    const root = document.querySelector('[data-conversation-scroll]');
    if (root) root.classList.add(CLASS_ON);
  };
  const bindSeats = function () {
    document.querySelectorAll('[data-composer-seat]').forEach(function (seat) {
      if (bound.has(seat)) return;
      seat.addEventListener('keydown', handleKeyDown, true);
      bound.add(seat);
    });
  };
  const sweep = function () { applyClass(); bindSeats(); };

  sweep();
  const observer = typeof MutationObserver === 'undefined' ? null : new MutationObserver(function (mutations) {
    for (let i = 0; i < mutations.length; i++) {
      if (mutations[i].addedNodes.length > 0) { sweep(); return; }
    }
  });
  if (observer) observer.observe(document.documentElement, { childList: true, subtree: true });
```

</details>

**依据 3 · 源码核查**：[src/client/index.js:211-245](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/src/client/index.js#L211-L245)

状态/按钮。

<details>
<summary>查看原文（35行）</summary>

```text
  function ExpandButton(props) {
    const sessionId = props.sessionId ? String(props.sessionId) : '';
    const [on, setOn] = useState(readStored());
    const [, setLocaleTick] = useState(0);

    useEffect(function () {
      return ctx.locale.subscribe(function () { setLocaleTick(function (x) { return x + 1; }); });
    }, []);

    useEffect(function () {
      return manageExpandedDom(on);
    }, [on]);

    const onClick = useCallback(function () { setOn(function (v) { return !v; }); }, []);
    const label = on ? t('button.collapse.label') : t('button.expand.label');
    const title = on ? t('button.collapse.title') : t('button.expand.title');

    return createElement('button', {
      type: 'button',
      className: 'cpex-btn',
      title: title,
      'aria-pressed': on ? 'true' : 'false',
      'data-on': on ? 'true' : 'false',
      onClick: onClick,
    },
      createElement('span', { className: 'cpex-glyph', 'aria-hidden': 'true' }, on ? '⬇' : '⬆'),
      createElement('span', null, label),
    );
  }

  ctx.slots.inject('conversation.input.right', function () {
    return ctx.slots.register(
      { name: 'conversation.input.right', id: 'composer-expand', order: 90, label: 'Expand composer' },
      function (props) { return createElement(ExpandButton, props); },
    );
```

</details>

#### 缺口

- 反复重建/小屏下的资源、输入耗时与误发送率无对照。
  **影响**：不量化省时或长期轻量。
  **进一步探讨**：固定无秘密草稿与视图切换次数，比较任务时间/误发送/监听数量和内存。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 推荐及可继续探讨方向是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

有条件试用。长草稿用户在单composer/兼容Web环境可以先核快捷键后使用，功能小且没有额外外部数据面；能随时收起。但不宜凭广兼容表忽略Lexical/菜单与多root差异，敏感长稿先保存副本，别把它当内容恢复工具。

从第一root样式/全seat键盘不一致和bound长期保旧seat，可推导“按slot实例绑定root并增量维护seat集合”。参照当前全document扫描，给每个可视composer稳定owner，样式/键盘/菜单都限制到同一根，MutationObserver只看该根并移除失效seat。高度再以可用视口clamp而非固定min溢出。此为未实现方案，不计当前贡献。

对照含双root、portaled菜单、IME/undo、100次切视图及小视口。反例是slot没有稳定root或菜单只能全局识别，盲收窄会失去自愈/候选行为。若新方案仍拦另一composer回车、重建后丢展开、监听增长无界，或省下扫描却增加输入延迟，核心假设不成立。判据应是根一致/无误发送、资源有界与编辑历史完整，而非只有按钮变高。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.js:169-196](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/src/client/index.js#L169-L196)

实例根/集合方案基线。

<details>
<summary>查看原文（28行）</summary>

```text
  const applyClass = function () {
    const root = document.querySelector('[data-conversation-scroll]');
    if (root) root.classList.add(CLASS_ON);
  };
  const bindSeats = function () {
    document.querySelectorAll('[data-composer-seat]').forEach(function (seat) {
      if (bound.has(seat)) return;
      seat.addEventListener('keydown', handleKeyDown, true);
      bound.add(seat);
    });
  };
  const sweep = function () { applyClass(); bindSeats(); };

  sweep();
  const observer = typeof MutationObserver === 'undefined' ? null : new MutationObserver(function (mutations) {
    for (let i = 0; i < mutations.length; i++) {
      if (mutations[i].addedNodes.length > 0) { sweep(); return; }
    }
  });
  if (observer) observer.observe(document.documentElement, { childList: true, subtree: true });

  return function () {
    if (observer) observer.disconnect();
    document.querySelectorAll('[data-conversation-scroll].' + CLASS_ON).forEach(function (root) {
      root.classList.remove(CLASS_ON);
    });
    bound.forEach(function (seat) { seat.removeEventListener('keydown', handleKeyDown, true); });
  };
```

</details>

**依据 2 · 源码核查**：[src/client/index.js:211-245](https://github.com/13071301808/dsh-composer-expand/blob/e816461115436f1cb084f868398e610396d00679/src/client/index.js#L211-L245)

slot实例基线。

<details>
<summary>查看原文（35行）</summary>

```text
  function ExpandButton(props) {
    const sessionId = props.sessionId ? String(props.sessionId) : '';
    const [on, setOn] = useState(readStored());
    const [, setLocaleTick] = useState(0);

    useEffect(function () {
      return ctx.locale.subscribe(function () { setLocaleTick(function (x) { return x + 1; }); });
    }, []);

    useEffect(function () {
      return manageExpandedDom(on);
    }, [on]);

    const onClick = useCallback(function () { setOn(function (v) { return !v; }); }, []);
    const label = on ? t('button.collapse.label') : t('button.expand.label');
    const title = on ? t('button.collapse.title') : t('button.expand.title');

    return createElement('button', {
      type: 'button',
      className: 'cpex-btn',
      title: title,
      'aria-pressed': on ? 'true' : 'false',
      'data-on': on ? 'true' : 'false',
      onClick: onClick,
    },
      createElement('span', { className: 'cpex-glyph', 'aria-hidden': 'true' }, on ? '⬇' : '⬆'),
      createElement('span', null, label),
    );
  }

  ctx.slots.inject('conversation.input.right', function () {
    return ctx.slots.register(
      { name: 'conversation.input.right', id: 'composer-expand', order: 90, label: 'Expand composer' },
      function (props) { return createElement(ExpandButton, props); },
    );
```

</details>

#### 缺口

- 实例root/增量seat与动态高度方案未实现。
  **影响**：不计当前范围/资源优势。
  **进一步探讨**：以固定DOM/事件记录比较隔离、编辑完整性与资源，不使用真实用户草稿。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
