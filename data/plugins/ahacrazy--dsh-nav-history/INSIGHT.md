# dsh-nav-history

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[c73b5f6](https://github.com/AhaCrazy/dsh-nav-history/tree/c73b5f62bbfec0479a10b0e553d615e90d532830)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：为 DSH 会话与整页面板提供后退、前进、历史底栏和本地持久化。

> **亮点**：独立于 URL 构建跨会话与面板的访问顺序入口，恢复标记和落点就地重写避免产生虚假前进分支。这是具体的导航适配增量，未证明找回耗时下降。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：统一异常删除历史条目会把临时故障与目标消失混在一起，静默导航无操作还可能重写落点。边界影响记录可靠性，未发现会删除会话内容。[Q03](#research-q03)

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
  - [Q01 · 历史解决什么任务，新增什么？](#detail-section-11)
  - [Q02 · 记录与恢复如何避免制造虚假历史？](#detail-section-12)
  - [Q03 · 恢复失败和本地历史有什么成本，适合谁？](#detail-section-13)
  - [Q04 · 怎样区分失效目标和临时失败？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：高频跨会话与整页面板的用户可按访问顺序找回主视图；不恢复滚动或内容。[Q01](#research-q01)

手动侧栏查找按对象名称定位；历史栈按访问顺序定位，两者适合不同记忆线索。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 后退与前进 | 按访问顺序返回主视图 | 依赖导航服务，不含滚动与页签 |
| 历史条目直达 | 选择相邻访问位置 | 目标失效或异常可移除记录 |
| 本地历史持久化 | 刷新后继续找回 | localStorage 可写，浏览器范围 |
| 底栏配置 | 调整条目数与宽度 | 数值夹限，配置本地保存 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web slots、locale | 启动必需 | 底栏与配置 | 对应界面不可用 |
| layout、uiWorkspace、sessions | 核心必需 | 读取位置、导航和标题 | 跟踪或恢复降级 |
| localStorage | 持久化必需 | 历史与偏好 | 仅内存保存 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 安装 | 用户安装并重载 | 底栏出现 |
| 访问 | 用户切换会话和面板 | 历史显示正确相邻位置 |
| 返回 | 用户点击或快捷键导航 | 回到目标，失败时手动找回 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主与存储，金额未知 | 安装和配置底栏，耗时未知 | 需要布局与会话服务 |
| 持续使用 | 本地历史存储，资源未测 | 注意历史范围与底栏占位 | 不恢复滚动和页签 |
| 失败恢复 | 排查资源未知 | 手工寻找目标或清理历史 | 临时异常也可能移除记录 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 访问顺序找回 | 栈、游标与导航方法 | 全部面板的真实时序兼容 |
| 历史保留 | localStorage 写入 | 浏览器存储失败后的持久性 |
| 找回效率 | 避免重搜侧栏的机制 | 耗时、误导航率 |

> **思考**：统一异常删除历史条目会把临时故障与目标消失混在一起，静默导航无操作还可能重写落点。边界影响记录可靠性，未发现会删除会话内容。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：独立于 URL 构建跨会话与面板的访问顺序入口，恢复标记和落点就地重写避免产生虚假前进分支。这是具体的导航适配增量，未证明找回耗时下降。[Q01](#research-q01) [Q02](#research-q02)

UI 无关控制器便于定位分支和恢复语义，effect 清理订阅值得借鉴。持久化错误降为内存状态是可用性取舍，统一异常删条目和同步落点假设则需使用者知晓。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

统一异常删除历史条目会把临时故障与目标消失混在一起，静默导航无操作还可能重写落点。边界影响记录可靠性，未发现会删除会话内容。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用普通会话和面板交错导航，检查后退后新访问的分支截断、重载和失效目标；只把它当主视图位置入口。记录不稳定时回侧栏手动查找。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

导航栈与接线有源码支持；真实宿主时序、导航收益与分类恢复方案未验证。

- 已检查：作者 README、包清单、源码路径 src/history.js、src/apply.js、src/storage.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 src 导航、存储与装配源码；未运行构建、测试或宿主。
- 下一步：核对会话面板交错、后退新分支、重载、删除目标、瞬时异常及异步状态通知，未执行。

**分析版本**

- **仓库**：[AhaCrazy/dsh-nav-history](https://github.com/AhaCrazy/dsh-nav-history)
- **版本号**：0.3.0（[固定提交 c73b5f6](https://github.com/AhaCrazy/dsh-nav-history/tree/c73b5f62bbfec0479a10b0e553d615e90d532830)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可用 restored、gone、retryable 区分恢复结果，仅确认失效时删记录；以延迟、瞬时异常和删除目标验证准确性，分类不可得或等待负担过大则否定。未实现。[Q04](#research-q04)

核对会话面板交错、后退新分支、重载、删除目标、瞬时异常及异步状态通知，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 11 | 2524 | 2276 | 112 | — |
| .md | source | 1 | 111 | — | — | 1620 |
| .mjs | source | 1 | 84 | 62 | 15 | — |
| .mjs | test | 4 | 562 | 497 | 17 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AhaCrazy/dsh-nav-history/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AhaCrazy/dsh-nav-history/issues?q=is%3Aissue+created%3A2026-09-24T05%3A55%3A43.646Z..2026-10-24T05%3A55%3A43.646Z)

暂未获取：近30天关闭。

统计日期：2026-10-24。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：检验跨面板与会话历史的实际增量和失败恢复语义。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 历史解决什么任务，新增什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向在多个会话与整页面板之间反复切换的人，合格结果是返回之前的主视图位置，而不是恢复对话内容、滚动位置或页签。作者指出宿主视图切换没有浏览器式历史，本插件用独立栈补上后退、前进与邻近条目直达。相对从侧栏重新查找，它把访问顺序作为检索入口；相对浏览器后退，其对象是宿主公开布局状态而非 URL。是否减少查找时间未测，且用户若只在一个会话工作，底栏带来的持续占位可能没有收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-20](https://github.com/AhaCrazy/dsh-nav-history/blob/c73b5f62bbfec0479a10b0e553d615e90d532830/README.md#L3-L20)

用途和主视图历史范围来自作者声明。

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

**依据 2 · 源码核查**：[src/history.js:14-19](https://github.com/AhaCrazy/dsh-nav-history/blob/c73b5f62bbfec0479a10b0e553d615e90d532830/src/history.js#L14-L19)

历史位置只有 panelId 与 sessionId，限制恢复承诺。

```text
  function current() {
    const location = options.readLocation() || {};
    return {
      panelId: location.panelId === undefined ? null : location.panelId,
      sessionId: isNonEmptyString(location.sessionId) ? location.sessionId : null,
    };
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 记录与恢复如何避免制造虚假历史？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

apply 订阅 layout.panelInfo 和 uiWorkspace.selection，控制器记录位置并维护游标。push 忽略与当前位置相同的条目，后退后新增位置会截断前进分支。恢复时 applying 标记屏蔽同步通知，先打开会话再选择面板，结束后读取落点；落点不符则就地重写原条目，避免把恢复误记为新访问而跳到栈尾。这些都是维持浏览器式语义的具体设计。localStorage 失败静默退为内存状态，生命周期通过 effect 清理订阅。它依赖宿主导航调用与状态通知时序，源码只明确同步恢复的假设；没有运行来证明所有插件面板都满足该假设。

#### 证据与依据

**依据 1 · 源码核查**：[src/history.js:119-150](https://github.com/AhaCrazy/dsh-nav-history/blob/c73b5f62bbfec0479a10b0e553d615e90d532830/src/history.js#L119-L150)

去重、前进分支截断与恢复通知屏蔽是历史语义的核心。

<details>
<summary>查看原文（32行）</summary>

```text
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
    return true;
  }

  /** Record the actual landing of a restore on its own entry, keeping the cursor. */
  function rewriteEntry(entry, landing) {
    const at = entries.indexOf(entry);
    if (at < 0) return;
    entries[at] = { panelId: landing.panelId, sessionId: landing.sessionId, at: entry.at };
    persist();
  }

  function onChange() {
    // Notifications fired synchronously during a restore are that restore's
    // own intermediate states (the session write precedes the panel write);
    // recording them would create phantom entries.
    if (applying !== null) return;
    const pushed = push(current());
    if (!pushed) publish();
    else publish(true);
```

</details>

**依据 2 · 源码核查**：[src/history.js:153-197](https://github.com/AhaCrazy/dsh-nav-history/blob/c73b5f62bbfec0479a10b0e553d615e90d532830/src/history.js#L153-L197)

恢复顺序与落点重写说明状态一致性设计。

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

**依据 3 · 源码核查**：[src/apply.js:98-133](https://github.com/AhaCrazy/dsh-nav-history/blob/c73b5f62bbfec0479a10b0e553d615e90d532830/src/apply.js#L98-L133)

订阅与清理接线可追到宿主状态。

<details>
<summary>查看原文（36行）</summary>

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
        }
      } catch (error) {
        console.warn('[nav-history] session labels unavailable:', error);
      }
      disposers.push(installMouseButtons(controller));
      disposers.push(registerShortcuts(ctx, controller, fallbackT));
      return () => {
        for (const dispose of disposers) {
          try {
            dispose();
          } catch (error) {
            // ignore
          }
        }
      };
    }, 'nav-history: tracking');
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 恢复失败和本地历史有什么成本，适合谁？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

applyEntry 把所有同步异常都当成应移除该历史条目的失败，没有区分目标已删除与临时服务异常。因此它可以跳过失效目标，也可能在瞬时故障时丢掉有用访问记录；这不是删除会话内容。导航服务缺失时 apply 适配器静默无操作，控制器随后可能把当前位置重写为该历史落点。源码支持这些限制，实际发生频率未知。成本单位是一次准确找回所需主视图。首次安装配置、持续占用底栏与浏览器存储、故障后手动寻找目标都需要计入。现金和人工耗时未知，没有模型调用机制。适合高频跨视图用户在普通会话试用，先核对后退再新开页面是否截断分支、重载是否保留、删除目标是否只影响记录；需要完整工作台或滚动状态恢复的人不宜按此承诺采用。

#### 证据与依据

**依据 1 · 源码核查**：[src/history.js:169-197](https://github.com/AhaCrazy/dsh-nav-history/blob/c73b5f62bbfec0479a10b0e553d615e90d532830/src/history.js#L169-L197)

异常统一删除与落点重写限定失败语义。

<details>
<summary>查看原文（29行）</summary>

```text
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

**依据 2 · 源码核查**：[src/apply.js:59-67](https://github.com/AhaCrazy/dsh-nav-history/blob/c73b5f62bbfec0479a10b0e553d615e90d532830/src/apply.js#L59-L67)

缺少导航方法时适配器静默返回。

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
```

**依据 3 · 源码核查**：[src/storage.js:15-22](https://github.com/AhaCrazy/dsh-nav-history/blob/c73b5f62bbfec0479a10b0e553d615e90d532830/src/storage.js#L15-L22)

写存储失败后保留内存，刷新持久性可能丢失。

```text
export function saveHistory(entries, index) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORE_KEY, JSON.stringify({ entries, index }));
  } catch (error) {
    // storage quota / privacy mode: history stays in memory only
  }
}
```

#### 缺口

- 无真实导航准确率和查找耗时数据。
  **影响**：不能定量确认收益和临时失败损失。
  **进一步探讨**：对同一组会话面板任务比较侧栏查找与历史导航，并记录失败类别。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样区分失效目标和临时失败？

**研究主题**：新假设与验证

#### 完整回答

可提出未验证的带结果分类的恢复协议。导航适配层返回 restored、gone 或 retryable，控制器只有 gone 才移除条目，retryable 保留游标与记录并允许用户重试。推导来自统一异常删除与静默无操作，不需要扩展为内容回滚。新增代价是宿主错误归类、等待落点确认和超时责任。最小验证注入目标删除、一次性失败与延迟通知，要求失效目标可跳过、临时失败不丢记录且不产生虚假新历史；若无法可靠分类或等待阻塞日常切换，设计不成立。当前实现没有该协议，不能算作已实现恢复保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/history.js:177-197](https://github.com/AhaCrazy/dsh-nav-history/blob/c73b5f62bbfec0479a10b0e553d615e90d532830/src/history.js#L177-L197)

统一异常与实际落点处理为分类恢复方案提供推导依据。

<details>
<summary>查看原文（21行）</summary>

```text
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

#### 缺口

- 宿主可提供的可靠错误类别未知。
  **影响**：协议可行性尚不能确定。
  **进一步探讨**：先核查宿主导航返回契约，再做故障注入原型。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
