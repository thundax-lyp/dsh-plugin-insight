# dsh-nav-history

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[c9f91ec](https://github.com/AhaCrazy/dsh-nav-history/tree/c9f91ec738fcf2372fc5f4cf4172d8edd3e2c3e6)

<!-- BEGIN META -->
[![npm 30d 289](https://img.shields.io/static/v1?label=npm+30d&message=289&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-nav-history) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-nav-history)
<!-- END META -->

> **功能**：为 DSH 会话和页面提供前进后退历史。

> **亮点**：[Q01](#research-q01) 提供统一历史底栏，[Q02](#research-q02) 将位置与宿主导航接线。

> **主要限制**：[Q03](#research-q03) 失效落点可能改写历史，localStorage 失败仅保留内存。

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
  - [Q01 · 历史导航相对手工切换有什么用途？](#detail-section-11)
  - [Q02 · 位置如何记录并执行恢复？](#detail-section-12)
  - [Q03 · 错误落点、失效记录和本地存储如何处理？](#detail-section-13)
  - [Q04 · 兼容、隐私、成本和退出条件是什么？](#detail-section-14)
  - [Q05 · 如何帮助用户判断历史项是否仍可恢复？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户在 DSH 会话和页面之间频繁切换。

手工记住并选择会话或页面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 位置记录 | 保存会话和面板栈 | 本地限制 100 条和 7 天 |
| 恢复 | 调宿主导航 | 异步落点未测 |
| 存储 | 浏览器保存历史 | 失败退内存 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| 兼容 DSH Web 服务 | 必需 | 状态和导航 API | 跟踪可能不可用 |
| localStorage | 刷新持久化需要 | 保存位置 | 回退内存 |
| 仍存在的目标 | 恢复需要 | 打开会话或页面 | 可能删条或改写 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 使用非敏感测试会话 | 核宿主接口 |
| 浏览 | 在会话和面板间切换 | 检查底栏记录 |
| 恢复 | 点击历史并核实际落点 | 错跳时手动选择 |
| 复核 | 刷新检查持久化 | 存储不可用不依赖历史 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 接入 | 浏览器存储未知 | 核版本和隐私 | 位置含会话标识 |
| 使用 | 本地记录空间未知 | 检查目标 | 100 条 7 天上限 |
| 恢复 | 成本未知 | 手工找回页面 | 存储可能仅内存 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 记录 | 订阅位置并限长 | 所有页面可追踪 |
| 恢复 | 调宿主导航并比较落点 | 异步恢复正确 |
| 持久 | localStorage 尝试保存 | 浏览器允许写入 |

> **思考**：[Q03](#research-q03) 失效落点可能改写历史，localStorage 失败仅保留内存。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 提供统一历史底栏，[Q02](#research-q02) 将位置与宿主导航接线。

[Q03](#research-q03) 恢复失败删条，实际落点不同改写；存储失败退内存。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 失效落点可能改写历史，localStorage 失败仅保留内存。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 用非敏感会话测试后退与刷新；错跳时手动选择目标。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已静态核查导航接线、栈及存储路径；未运行宿主。

- 已检查：作者 README、包清单、源码路径 README.md、src/apply.js、src/history.js、src/storage.js、src/constants.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定 README、清单、客户端接线、历史及存储；未运行浏览器或宿主。
- 下一步：[Q05](#research-q05) 先核宿主可用性接口，再测失效及延迟。

**分析版本**

- **仓库**：[AhaCrazy/dsh-nav-history](https://github.com/AhaCrazy/dsh-nav-history)
- **版本号**：0.3.0（[固定提交 c9f91ec](https://github.com/AhaCrazy/dsh-nav-history/tree/c9f91ec738fcf2372fc5f4cf4172d8edd3e2c3e6)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设跳转前可用性和实际落点提示可减少误跳；尚未验证。

[Q05](#research-q05) 先核宿主可用性接口，再测失效及延迟。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 11 | 2524 | 2276 | 112 | — |
| .md | source | 1 | 117 | — | — | 1644 |
| .mjs | source | 1 | 84 | 62 | 15 | — |
| .mjs | test | 4 | 562 | 497 | 17 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/AhaCrazy/dsh-nav-history/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对导航历史记录、恢复和存储边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 历史导航相对手工切换有什么用途？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:3-20 描述在会话和整页面板之间提供浏览器式前进后退；相对记住目标并手工选择，底栏可显示邻近位置。固定源码支持独立客户端栈，不等于浏览器 URL 历史或会话内容备份；未实测用户效率和各插件面板兼容。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-20](https://github.com/AhaCrazy/dsh-nav-history/blob/c9f91ec738fcf2372fc5f4cf4172d8edd3e2c3e6/README.md#L3-L20)

作者描述场景与范围。

<details>
<summary>查看原文（18行）</summary>

```text
DSH（DeepSeek Harness）Web GUI 的**全局后退 / 前进**插件：像浏览器一样，记住你去过的每一个"页面"——包括会话（含 Agent Teams 的成员会话 / 子智能体会话）和各种插件开启的整页面板（插件市场、任务、自定义插件页……），一键回到上一个位置。

DSH 本身没有 URL 路由，也没有浏览历史：切换会话或整页面板只是替换当前视图，旧位置直接丢弃。本插件维护自己的访问栈来补上这一块。

![dsh-nav-history 导航条示意：底部显示前后多个页面记录，右侧为历史位置计数](docs/screenshots/navigation-bar.png)

*示例中底栏一次显示 4 个页面记录（可在 1–7 之间配置），右侧 `45/45` 为当前历史栈位置；点击任意条目可直接跳转。*

## 功能

- **全局后退 / 前进**：覆盖两类"页面"：
  - **会话**：主会话、成员会话（`origin: 'subagent'` 的子会话）、任意历史会话；
  - **整页面板**：插件注册到 `main` + `sidebar.panellist` 的页面（插件市场、任务页等），以及从面板跳回会话、会话再进面板的任意交错。
- **常驻底栏**：挂在 `shell.bottom` 根座位，跨面板常驻、不随面板切换消失，也不占用会话头部。
- **前后文可见**：底栏一次性显示当前页面及其前后的历史位置（默认 3 个，可在 1–7 之间配置），**点击任意条目可直接跳转**；当前页面高亮。
- **浏览器式快捷键**：`Alt+←` / `Alt+→`（macOS 为 `⌘[` / `⌘]`），已注册进 DSH 的快捷键系统，可在 **设置 → 通用 → 快捷键** 中查看和改键；另支持鼠标侧键（后退键 3 / 前进键 4）。
- **历史持久化**：按浏览器存 localStorage（键 `dsh.nav-history.v1`，上限 100 条，7 天过期），刷新页面后历史仍在。
- **纯客户端**：Host 半为空实现，不注册工具、不写提示词、不碰会话数据；只读取公开的布局 / 会话状态并调用公开的导航 API。
```

</details>

**依据 2 · 源码核查**：[src/apply.js:53-75](https://github.com/AhaCrazy/dsh-nav-history/blob/c9f91ec738fcf2372fc5f4cf4172d8edd3e2c3e6/src/apply.js#L53-L75)

连接导航、宿主状态和持久化。

<details>
<summary>查看原文（23行）</summary>

```text
    const settings = loadSettings();
    const controller = createNavHistory({
      limit: LIMIT,
      maxVisible: settings.maxVisible,
      entryWidth: settings.entryWidth,
      readLocation: () => readLocation(ctx),
      openSession: (sessionId) => {
        if (ctx.uiWorkspace && typeof ctx.uiWorkspace.openSession === 'function') {
          ctx.uiWorkspace.openSession(sessionId);
        }
      },
      selectPanel: (panelId) => {
        if (ctx.layout && typeof ctx.layout.selectPanel === 'function') {
          ctx.layout.selectPanel(panelId);
        }
      },
      panelLabel: (panelId) => resolvePanelLabel(ctx, panelId),
      sessionLabel: (sessionId) => resolveSessionLabel(ctx, sessionId),
      load: loadHistory,
      persist: saveHistory,
      persistSettings: saveSettings,
      onError: (error) => console.warn('[nav-history] restore dropped one entry:', error),
    });
```

</details>

**依据 3 · 源码核查**：[src/apply.js:90-95](https://github.com/AhaCrazy/dsh-nav-history/blob/c9f91ec738fcf2372fc5f4cf4172d8edd3e2c3e6/src/apply.js#L90-L95)

注册底栏及设置入口。

```text
    ctx.slots.inject('shell.bottom', () =>
      registerIntoSlot('shell.bottom', { locale: NS, registrant: PKG }, NavBar),
    );

    ctx.slots.inject('plugins.bundle.config', () =>
      registerIntoSlot('plugins.bundle.config', { key: PKG, order: 10, locale: NS, registrant: PKG }, ConfigSection),
```

#### 缺口

- 未做用户和页面对照
  **影响**：无法证明节时或全面覆盖
  **进一步探讨**：用多面板测试任务对照手动切换。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 位置如何记录并执行恢复？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

apply.js:53-75 把当前页面读取、openSession、selectPanel 及存储传给控制器，98-117 订阅面板与会话变化。history.js:119-131 对相邻相同位置去重，新访问删除前进分支并限长；153-168 按目标调用宿主导航，再读取落点。它只持久化 panelId、sessionId 和时间，不保存消息内容；宿主状态接口和页面注册是必要条件。

#### 证据与依据

**依据 1 · 源码核查**：[src/apply.js:53-75](https://github.com/AhaCrazy/dsh-nav-history/blob/c9f91ec738fcf2372fc5f4cf4172d8edd3e2c3e6/src/apply.js#L53-L75)

构造控制器并传入宿主接口。

<details>
<summary>查看原文（23行）</summary>

```text
    const settings = loadSettings();
    const controller = createNavHistory({
      limit: LIMIT,
      maxVisible: settings.maxVisible,
      entryWidth: settings.entryWidth,
      readLocation: () => readLocation(ctx),
      openSession: (sessionId) => {
        if (ctx.uiWorkspace && typeof ctx.uiWorkspace.openSession === 'function') {
          ctx.uiWorkspace.openSession(sessionId);
        }
      },
      selectPanel: (panelId) => {
        if (ctx.layout && typeof ctx.layout.selectPanel === 'function') {
          ctx.layout.selectPanel(panelId);
        }
      },
      panelLabel: (panelId) => resolvePanelLabel(ctx, panelId),
      sessionLabel: (sessionId) => resolveSessionLabel(ctx, sessionId),
      load: loadHistory,
      persist: saveHistory,
      persistSettings: saveSettings,
      onError: (error) => console.warn('[nav-history] restore dropped one entry:', error),
    });
```

</details>

**依据 2 · 源码核查**：[src/apply.js:98-117](https://github.com/AhaCrazy/dsh-nav-history/blob/c9f91ec738fcf2372fc5f4cf4172d8edd3e2c3e6/src/apply.js#L98-L117)

订阅宿主状态。

<details>
<summary>查看原文（20行）</summary>

```text
    ctx.effect(() => {
      const disposers = [];
      try {
        if (ctx.layout && ctx.layout.panelInfo && typeof ctx.layout.panelInfo.subscribe === 'function') {
          disposers.push(ctx.layout.panelInfo.subscribe(() => controller.onChange()));
        }
      } catch (error) {
        console.warn('[nav-history] panel tracking unavailable:', error);
      }
      try {
        const selection = ctx.uiWorkspace && ctx.uiWorkspace.selection;
        if (selection && typeof selection.subscribe === 'function') {
          disposers.push(selection.subscribe(() => controller.onChange()));
        }
      } catch (error) {
        console.warn('[nav-history] session tracking unavailable:', error);
      }
      try {
        if (ctx.sessions && ctx.sessions.list && typeof ctx.sessions.list.subscribe === 'function') {
          disposers.push(ctx.sessions.list.subscribe(() => controller.refresh()));
```

</details>

**依据 3 · 源码核查**：[src/history.js:110-131](https://github.com/AhaCrazy/dsh-nav-history/blob/c9f91ec738fcf2372fc5f4cf4172d8edd3e2c3e6/src/history.js#L110-L131)

持久化、去重与前进分支。

<details>
<summary>查看原文（22行）</summary>

```text
  function persist() {
    if (typeof options.persist !== 'function') return;
    try {
      options.persist(entries.map((entry) => ({ panelId: entry.panelId, sessionId: entry.sessionId, at: entry.at })), index);
    } catch (error) {
      console.warn('[nav-history] history persist failed:', error);
    }
  }

  function push(location) {
    if (location.sessionId === null && location.panelId === null) return false;
    const top = entries[index];
    if (top !== undefined && entryKey(top) === entryKey(location)) return false;
    if (index < entries.length - 1) entries.splice(index + 1);
    entries.push({ panelId: location.panelId, sessionId: location.sessionId, at: Date.now() });
    index = entries.length - 1;
    while (entries.length > limit) {
      entries.shift();
      index -= 1;
    }
    if (index < 0) index = 0;
    persist();
```

</details>

**依据 4 · 源码核查**：[src/history.js:153-168](https://github.com/AhaCrazy/dsh-nav-history/blob/c9f91ec738fcf2372fc5f4cf4172d8edd3e2c3e6/src/history.js#L153-L168)

按目标调用导航。

<details>
<summary>查看原文（16行）</summary>

```text
  function applyEntry(entry) {
    applying = entryKey(entry);
    let failure = null;

    try {
      const before = current();
      if (entry.sessionId !== null && before.sessionId !== entry.sessionId) {
        options.openSession(entry.sessionId);
      }
      if (entry.panelId !== null) {
        options.selectPanel(entry.panelId);
      } else if (before.panelId !== null) {
        // Back to a conversation entry while a whole-page panel is showing:
        // `selectPanel(null)` returns to the conversation view.
        options.selectPanel(null);
      }
```

</details>

#### 缺口

- 未执行真实宿主导航
  **影响**：不能保证异步落点或全页面覆盖
  **进一步探讨**：在兼容宿主切换会话与面板。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 错误落点、失效记录和本地存储如何处理？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

history.js:153-197 恢复时捕获同步异常并删除出错条目；若立即读到的实际位置不同，则用落点改写该条，不证明异步导航已完成。storage.js:4-20 读写 localStorage 异常时分别返回空或仅保留内存，且不向用户保证持久化；constants.js:6-9 限制 100 条及 7 天。失效、存储受限和宿主异步更新是否会产生错误历史需实测。

#### 证据与依据

**依据 1 · 源码核查**：[src/history.js:153-197](https://github.com/AhaCrazy/dsh-nav-history/blob/c9f91ec738fcf2372fc5f4cf4172d8edd3e2c3e6/src/history.js#L153-L197)

异常删条和落点改写。

<details>
<summary>查看原文（45行）</summary>

```text
  function applyEntry(entry) {
    applying = entryKey(entry);
    let failure = null;

    try {
      const before = current();
      if (entry.sessionId !== null && before.sessionId !== entry.sessionId) {
        options.openSession(entry.sessionId);
      }
      if (entry.panelId !== null) {
        options.selectPanel(entry.panelId);
      } else if (before.panelId !== null) {
        // Back to a conversation entry while a whole-page panel is showing:
        // `selectPanel(null)` returns to the conversation view.
        options.selectPanel(null);
      }
    } catch (error) {
      failure = error;
    }

    const expected = entryKey(entry);
    const landing = current();
    applying = null;

    if (failure !== null) {
      console.warn('[nav-history] restore failed:', failure);
      const at = entries.indexOf(entry);
      if (at >= 0) {
        entries.splice(at, 1);
        if (index > at) index -= 1;
        else if (index === at) index = Math.max(0, at - 1);
        if (index >= entries.length) index = entries.length - 1;
        persist();
      }
      if (typeof options.onError === 'function') options.onError(failure);
      return;
    }

    if (entryKey(landing) !== expected) {
      // The restore landed on a nearby location (for example a panel entry
      // recorded before any session was selected). Keep the cursor on this
      // entry and store the real landing: appending a new entry here would
      // jump the cursor to the end and silently keep the forward branch.
      rewriteEntry(entry, landing);
    }
```

</details>

**依据 2 · 源码核查**：[src/storage.js:4-20](https://github.com/AhaCrazy/dsh-nav-history/blob/c9f91ec738fcf2372fc5f4cf4172d8edd3e2c3e6/src/storage.js#L4-L20)

读写失败回退。

<details>
<summary>查看原文（17行）</summary>

```text
export function loadHistory() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STORE_KEY);
    if (raw === null) return null;
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

export function saveHistory(entries, index) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORE_KEY, JSON.stringify({ entries, index }));
  } catch (error) {
    // storage quota / privacy mode: history stays in memory only
```

</details>

**依据 3 · 源码核查**：[src/constants.js:6-9](https://github.com/AhaCrazy/dsh-nav-history/blob/c9f91ec738fcf2372fc5f4cf4172d8edd3e2c3e6/src/constants.js#L6-L9)

容量和期限。

```text
export const LIMIT = 100;
export const STORE_KEY = 'dsh.nav-history.v1';
export const SETTINGS_KEY = 'dsh.nav-history.settings.v1';
export const ENTRY_TTL_MS = 7 * 24 * 60 * 60 * 1000;
```

**依据 4 · 源码核查**：[src/apply.js:59-68](https://github.com/AhaCrazy/dsh-nav-history/blob/c9f91ec738fcf2372fc5f4cf4172d8edd3e2c3e6/src/apply.js#L59-L68)

导航调用未等待返回值。

<details>
<summary>查看原文（10行）</summary>

```text
      openSession: (sessionId) => {
        if (ctx.uiWorkspace && typeof ctx.uiWorkspace.openSession === 'function') {
          ctx.uiWorkspace.openSession(sessionId);
        }
      },
      selectPanel: (panelId) => {
        if (ctx.layout && typeof ctx.layout.selectPanel === 'function') {
          ctx.layout.selectPanel(panelId);
        }
      },
```

</details>

#### 缺口

- 未测异步导航、损坏存储及过期
  **影响**：历史可能缺失或落点不符
  **进一步探讨**：用假宿主注入延迟与存储失败。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 兼容、隐私、成本和退出条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:47-56 指定 Web 客户端服务，README:19-20 声称位置存在浏览器 localStorage；记录含会话标识与时间，虽不含消息正文，仍可能泄露使用轨迹。用户需接受有限历史和本地浏览器可访问性；存储被清理或不可写后不能依赖刷新恢复。先用非敏感测试会话检查后退和刷新，错跳或界面不兼容时停止依赖并手动切换。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:47-56](https://github.com/AhaCrazy/dsh-nav-history/blob/c9f91ec738fcf2372fc5f4cf4172d8edd3e2c3e6/package.json#L47-L56)

Web 客户端接线。

<details>
<summary>查看原文（10行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots"
      ]
```

</details>

**依据 2 · 源码核查**：[src/history.js:110-114](https://github.com/AhaCrazy/dsh-nav-history/blob/c9f91ec738fcf2372fc5f4cf4172d8edd3e2c3e6/src/history.js#L110-L114)

持久化位置和时间。

```text
  function persist() {
    if (typeof options.persist !== 'function') return;
    try {
      options.persist(entries.map((entry) => ({ panelId: entry.panelId, sessionId: entry.sessionId, at: entry.at })), index);
    } catch (error) {
```

**依据 3 · 源码核查**：[src/storage.js:4-20](https://github.com/AhaCrazy/dsh-nav-history/blob/c9f91ec738fcf2372fc5f4cf4172d8edd3e2c3e6/src/storage.js#L4-L20)

存储失败退内存。

<details>
<summary>查看原文（17行）</summary>

```text
export function loadHistory() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STORE_KEY);
    if (raw === null) return null;
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

export function saveHistory(entries, index) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORE_KEY, JSON.stringify({ entries, index }));
  } catch (error) {
    // storage quota / privacy mode: history stays in memory only
```

</details>

**依据 4 · 源码核查**：[src/constants.js:6-9](https://github.com/AhaCrazy/dsh-nav-history/blob/c9f91ec738fcf2372fc5f4cf4172d8edd3e2c3e6/src/constants.js#L6-L9)

限制容量和期限。

```text
export const LIMIT = 100;
export const STORE_KEY = 'dsh.nav-history.v1';
export const SETTINGS_KEY = 'dsh.nav-history.settings.v1';
export const ENTRY_TTL_MS = 7 * 24 * 60 * 60 * 1000;
```

#### 缺口

- 未测权限、隐私及宿主兼容
  **影响**：无法保证持久与恢复
  **进一步探讨**：非敏感会话试导航和刷新。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何帮助用户判断历史项是否仍可恢复？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有底栏已显示目标、当前项和历史位置，失败会删条或改落点；重复增加后退按钮没有增量。设想在导航前按宿主可用的只读状态给条目标注可确认、失效或未知，并在跳转后显式比较实际落点，允许用户保留未知而不自动重试。对照现有底栏，用删除会话、卸载面板、延迟更新及禁用存储测误跳、误删和操作耗时；若宿主没有可靠可用性接口、把未知显示为可用或增加误判则否定。先核现有 UI 是否已有等价状态。

#### 证据与依据

**依据 1 · 源码核查**：[src/history.js:153-197](https://github.com/AhaCrazy/dsh-nav-history/blob/c9f91ec738fcf2372fc5f4cf4172d8edd3e2c3e6/src/history.js#L153-L197)

已有恢复失败和落点逻辑。

<details>
<summary>查看原文（45行）</summary>

```text
  function applyEntry(entry) {
    applying = entryKey(entry);
    let failure = null;

    try {
      const before = current();
      if (entry.sessionId !== null && before.sessionId !== entry.sessionId) {
        options.openSession(entry.sessionId);
      }
      if (entry.panelId !== null) {
        options.selectPanel(entry.panelId);
      } else if (before.panelId !== null) {
        // Back to a conversation entry while a whole-page panel is showing:
        // `selectPanel(null)` returns to the conversation view.
        options.selectPanel(null);
      }
    } catch (error) {
      failure = error;
    }

    const expected = entryKey(entry);
    const landing = current();
    applying = null;

    if (failure !== null) {
      console.warn('[nav-history] restore failed:', failure);
      const at = entries.indexOf(entry);
      if (at >= 0) {
        entries.splice(at, 1);
        if (index > at) index -= 1;
        else if (index === at) index = Math.max(0, at - 1);
        if (index >= entries.length) index = entries.length - 1;
        persist();
      }
      if (typeof options.onError === 'function') options.onError(failure);
      return;
    }

    if (entryKey(landing) !== expected) {
      // The restore landed on a nearby location (for example a panel entry
      // recorded before any session was selected). Keep the cursor on this
      // entry and store the real landing: appending a new entry here would
      // jump the cursor to the end and silently keep the forward branch.
      rewriteEntry(entry, landing);
    }
```

</details>

**依据 2 · 源码核查**：[src/history.js:41-63](https://github.com/AhaCrazy/dsh-nav-history/blob/c9f91ec738fcf2372fc5f4cf4172d8edd3e2c3e6/src/history.js#L41-L63)

已有历史项展示。

<details>
<summary>查看原文（23行）</summary>

```text
  /** Entries currently shown in the bar: the current page plus neighbours. */
  function windowItems() {
    if (entries.length === 0) return [];
    if (maxVisible <= 1) {
      const entry = entries[index];
      if (entry === undefined) return [];
      return [{ index, label: describe(entry), kind: entry.panelId !== null ? 'panel' : 'session', active: true }];
    }
    const half = Math.floor((maxVisible - 1) / 2);
    const start = Math.max(0, Math.min(index - half, entries.length - maxVisible));
    const end = Math.min(entries.length, start + maxVisible);
    const items = [];
    for (let cursor = start; cursor < end; cursor += 1) {
      const entry = entries[cursor];
      if (entry === undefined) continue;
      items.push({
        index: cursor,
        label: describe(entry),
        kind: entry.panelId !== null ? 'panel' : 'session',
        active: cursor === index,
      });
    }
    return items;
```

</details>

**依据 3 · 源码核查**：[src/storage.js:4-20](https://github.com/AhaCrazy/dsh-nav-history/blob/c9f91ec738fcf2372fc5f4cf4172d8edd3e2c3e6/src/storage.js#L4-L20)

存储失败回退。

<details>
<summary>查看原文（17行）</summary>

```text
export function loadHistory() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STORE_KEY);
    if (raw === null) return null;
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

export function saveHistory(entries, index) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORE_KEY, JSON.stringify({ entries, index }));
  } catch (error) {
    // storage quota / privacy mode: history stays in memory only
```

</details>

#### 缺口

- 未穷尽 UI 与宿主可用性接口
  **影响**：增量和效果未知
  **进一步探讨**：先核接口再注入失效与延迟。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
