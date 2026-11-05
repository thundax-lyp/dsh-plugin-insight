# dsh-strata

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[50b128a](https://github.com/jsdvjx/dsh-strata/tree/50b128aea6d8dc9e5d493f852302c2e6577daf81)

<!-- BEGIN META -->
[![GitHub ★ 95](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=95&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/jsdvjx/dsh-strata) [![npm 30d 1,275](https://img.shields.io/static/v1?label=npm+30d&message=1%2C275&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-strata) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-strata)
<!-- END META -->

> **功能**：在 DSH Chat 提供语义缩略地图、锚点和线索墙。

> **亮点**：[Q01](#research-q01) 在长会话中回看提示与失败节点的用户可用缩略地图和线索墙跳转。宿主半部 apply 为空，浏览器将 TraceMinimap 注册到 shell.overlay。地图以已加载布局锚点绘制，线索墙可通过导出得到更完整的用户提示。相比长滚动条和逐屏查找，它加入语义位置。

> **主要限制**：[Q02](#research-q02) README 和空 host 注释称无会话数据过线，但浏览器 fetchPrompts 实际调用宿主 session.export 并将 ZIP 完整读入内存后解析。因此应区分插件没有独立远端与通过宿主获取完整日志。地图范围仍限已加载窗口，线索墙和地图覆盖不同。

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
  - [Q01 · Strata 怎样帮助找长对话位置？](#detail-section-11)
  - [Q02 · 纯浏览器是否代表只用 DOM？](#detail-section-12)
  - [Q03 · 如何试用与退出？](#detail-section-13)
  - [Q04 · 如何避免线索墙大导出占用过高？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在长对话中回看提示及失败节点的用户。

滚动条和手工搜索。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 地图 | 可视化已加载窗口 | 依赖锚点 |
| 线索墙 | 展示历史提示 | 使用宿主导出 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 Chat 锚点 | 必需 | 地图几何 | 原滚动条 |
| session.export | 线索墙需要 | 读取提示 | 只看已加载 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 合成长会话 | 核对锚点 |
| 验证 | 跳转导出与切换 | 检查内容 |
| 退出 | 禁用检查 rail | 清理偏好 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 资源未知 | 准备样本 | 未测 |
| 持续 | 绘制导出成本未知 | 兼容检查 | 按日志 |
| 退出 | 清理时间未知 | 读回界面 | 核对偏好 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 定位 | overlay 与锚点 | 实际效率 |
| 线索墙 | 读取完整导出 | 内存及权限 |

> **思考**：[Q02](#research-q02) README 和空 host 注释称无会话数据过线，但浏览器 fetchPrompts 实际调用宿主 session.export 并将 ZIP 完整读入内存后解析。因此应区分插件没有独立远端与通过宿主获取完整日志。地图范围仍限已加载窗口，线索墙和地图覆盖不同。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 在长会话中回看提示与失败节点的用户可用缩略地图和线索墙跳转。宿主半部 apply 为空，浏览器将 TraceMinimap 注册到 shell.overlay。地图以已加载布局锚点绘制，线索墙可通过导出得到更完整的用户提示。相比长滚动条和逐屏查找，它加入语义位置。

[Q02](#research-q02) README 和空 host 注释称无会话数据过线，但浏览器 fetchPrompts 实际调用宿主 session.export 并将 ZIP 完整读入内存后解析。因此应区分插件没有独立远端与通过宿主获取完整日志。地图范围仍限已加载窗口，线索墙和地图覆盖不同。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) README 和空 host 注释称无会话数据过线，但浏览器 fetchPrompts 实际调用宿主 session.export 并将 ZIP 完整读入内存后解析。因此应区分插件没有独立远端与通过宿主获取完整日志。地图范围仍限已加载窗口，线索墙和地图覆盖不同。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在兼容 DSH Chat 中创建含工具错误和折叠轮次的合成会话，核对地图与线索墙，并试切换会话和浅深主题。开销来自浏览器观测、绘制和导出。停用时检查原滚动条和原 turn rail 恢复，按需清理本地显示偏好。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码及作者说明，未执行目标。

- 已检查：作者 README、包清单、源码路径 README.md、client.js、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定身份及其直接依赖的代表实现。
- 下一步：验证大导出、切会话和原 rail 恢复。

**分析版本**

- **仓库**：[jsdvjx/dsh-strata](https://github.com/jsdvjx/dsh-strata)
- **版本号**：0.12.1（[固定提交 50b128a](https://github.com/jsdvjx/dsh-strata/tree/50b128aea6d8dc9e5d493f852302c2e6577daf81)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 对照当前 arrayBuffer，可试验限制导出大小或按宿主分页读取用户提示。合成递增长日志比较峰值内存、首屏和完整率；若遗漏或无明显改善则调整。

验证大导出、切会话和原 rail 恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1525 | — | — | 15349 |
| .js | source | 2 | 3647 | 2660 | 885 | — |
| .js | test | 2 | 587 | 504 | 51 | — |
| .mjs | test | 2 | 191 | 164 | 31 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/jsdvjx/dsh-strata/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话地图如何组织和传递上下文？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Strata 怎样帮助找长对话位置？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

在长会话中回看提示与失败节点的用户可用缩略地图和线索墙跳转。宿主半部 apply 为空，浏览器将 TraceMinimap 注册到 shell.overlay。地图以已加载布局锚点绘制，线索墙可通过导出得到更完整的用户提示。相比长滚动条和逐屏查找，它加入语义位置。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-15](https://github.com/jsdvjx/dsh-strata/blob/50b128aea6d8dc9e5d493f852302c2e6577daf81/index.js#L1-L15)

空宿主入口

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Node half of dsh-strata — deliberately empty.
 *
 * Everything this plugin does happens in the browser (see ./client.js): it
 * reads the conversation scrollport's own layout through the official anchor
 * attributes and paints a minimap into the shell overlay layer. There is no
 * host state, no tool, no remote, and no session data crossing the wire for
 * it, so the host-side plugin only has to exist for the composition row to
 * resolve.
 */

export const name = 'strata'

/** Mount point; the browser half carries the feature. */
export function apply() {}
```

</details>

**依据 2 · 源码核查**：[client.js:3596-3600](https://github.com/jsdvjx/dsh-strata/blob/50b128aea6d8dc9e5d493f852302c2e6577daf81/client.js#L3596-L3600)

overlay 注册

```text
      ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay',
        id: 'strata',
        order: 40,
      }, TraceMinimap))
```

**依据 3 · 源码核查**：[client.js:2376-2405](https://github.com/jsdvjx/dsh-strata/blob/50b128aea6d8dc9e5d493f852302c2e6577daf81/client.js#L2376-L2405)

线索墙与导出

<details>
<summary>查看原文（30行）</summary>

```text
      // ── clue wall: every user message, full screen ──────────────────────
      // The loaded window is a contiguous suffix of the append-only log, so
      // the LAST K user events map 1:1 in order onto the K user bands; the
      // rest come from the export endpoint. Hovering a user dot opens the
      // wall; clicking a card jumps (chain-loading first when the message
      // sits above the loaded window); Esc / a gap click close it. Only the
      // cards in (and just around) the visible window exist as DOM.
      const WALL_BUFFER = 6
      let wallOpen = false
      let wallBusy = false
      let wallDom = null
      let wallFocusIdx = -1
      /** Current visible window [a, b] into the prompt list. */
      let wallWin = { a: 0, b: -1 }
      /** Persistent connector paths, keyed by prompt index. */
      const wallPaths = new Map()

      /**
       * Fetch and inflate the session's full log through the export endpoint.
       * The ZIP's sizes live in the central directory (streaming writer), so
       * the entry is located from there and inflated with deflate-raw; the
       * inflated text is parsed line by line as it streams.
       * @param sessionId - session to export.
       * @param signal - abort signal for the request.
       * @returns prompts in log order.
       */
      async function fetchPrompts(sessionId, signal) {
        const res = await fetch('/api/session.export?sessionId=' + encodeURIComponent(sessionId), { signal })
        if (!res.ok) throw new Error('export ' + res.status)
        const buf = new Uint8Array(await res.arrayBuffer())
```

</details>

**依据 4 · 作者声明**：[README.md:170-191](https://github.com/jsdvjx/dsh-strata/blob/50b128aea6d8dc9e5d493f852302c2e6577daf81/README.md#L170-L191)

作者说明布局和绘制

<details>
<summary>查看原文（22行）</summary>

```text
## How it works

Pure browser half; the Node half is empty and no session data crosses the wire for it.
Geometry and semantics both come from anchors the conversation view already publishes —
`[data-conversation-scroll]` for the scrollport, `[data-chat-anchor-key]` per flow row
(the *outermost* one: a tool renderer nests a `call:<id>` anchor of its own inside the
row, and that belongs to the row rather than being a row), `data-chat-flow-kind` for
that row's registered Chat Node kind, `data-state="error"` for a failed tool or command,
`hidden` on a row for the turn folding DSH 0.1.2 does in Compact mode,
`[data-composer-seat]` to stay clear of the sticky composer. It
contributes one entry to the frame-wide `shell.overlay` list slot, so it adds a surface
instead of replacing one, and uninstalling leaves the native UI untouched. Labels are
registered with the host's locale service as the `dsh-strata` namespace and translated
through its `t` seat, so they follow the UI language live. The scrollbar
takeover uses the theme's documented seam — rebinding `--dsh-scrollbar-thumb` to
`transparent` on the scrollport, the same mechanism ui-sidebar uses — so both the WebKit
and Firefox rendering paths are covered and no stylesheet is overridden.

Rendering is a canvas repainted on a rAF, re-measuring rows only when the transcript's
structure changes — a streaming reply grows one band through its own ResizeObserver
report, a plain scroll moves the lens and nothing else, and the strata are cached as a
base layer so a hover repaints one band, not the session. Colors are read from the theme's own
```

</details>

#### 缺口

- 未运行长会话导航
  **影响**：实际定位准确率和效率未知
  **进一步探讨**：用合成长会话核对节点及跳转

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 纯浏览器是否代表只用 DOM？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

README 和空 host 注释称无会话数据过线，但浏览器 fetchPrompts 实际调用宿主 session.export 并将 ZIP 完整读入内存后解析。因此应区分插件没有独立远端与通过宿主获取完整日志。地图范围仍限已加载窗口，线索墙和地图覆盖不同。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:2-9](https://github.com/jsdvjx/dsh-strata/blob/50b128aea6d8dc9e5d493f852302c2e6577daf81/index.js#L2-L9)

作者代码注释

```text
 * Node half of dsh-strata — deliberately empty.
 *
 * Everything this plugin does happens in the browser (see ./client.js): it
 * reads the conversation scrollport's own layout through the official anchor
 * attributes and paints a minimap into the shell overlay layer. There is no
 * host state, no tool, no remote, and no session data crossing the wire for
 * it, so the host-side plugin only has to exist for the composition row to
 * resolve.
```

**依据 2 · 源码核查**：[client.js:2393-2425](https://github.com/jsdvjx/dsh-strata/blob/50b128aea6d8dc9e5d493f852302c2e6577daf81/client.js#L2393-L2425)

完整导出读取

<details>
<summary>查看原文（33行）</summary>

```text
      /**
       * Fetch and inflate the session's full log through the export endpoint.
       * The ZIP's sizes live in the central directory (streaming writer), so
       * the entry is located from there and inflated with deflate-raw; the
       * inflated text is parsed line by line as it streams.
       * @param sessionId - session to export.
       * @param signal - abort signal for the request.
       * @returns prompts in log order.
       */
      async function fetchPrompts(sessionId, signal) {
        const res = await fetch('/api/session.export?sessionId=' + encodeURIComponent(sessionId), { signal })
        if (!res.ok) throw new Error('export ' + res.status)
        const buf = new Uint8Array(await res.arrayBuffer())
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)
        let eocd = -1
        for (let i = buf.length - 22; i >= 0; i -= 1) {
          if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break }
        }
        if (eocd === -1) throw new Error('no zip directory')
        const count = view.getUint16(eocd + 10, true)
        let offset = view.getUint32(eocd + 16, true)
        for (let n = 0; n < count; n += 1) {
          if (offset + 46 > buf.length || view.getUint32(offset, true) !== 0x02014b50) break
          const method = view.getUint16(offset + 10, true)
          const csize = view.getUint32(offset + 20, true)
          const nameLen = view.getUint16(offset + 28, true)
          const extraLen = view.getUint16(offset + 30, true)
          const commentLen = view.getUint16(offset + 32, true)
          const localOffset = view.getUint32(offset + 42, true)
          const name = new TextDecoder().decode(buf.subarray(offset + 46, offset + 46 + nameLen))
          if (name === 'session.jsonl') {
            if (localOffset + 30 > buf.length) throw new Error('truncated export')
            const lnl = view.getUint16(localOffset + 26, true)
```

</details>

**依据 3 · 作者声明**：[README.md:195-206](https://github.com/jsdvjx/dsh-strata/blob/50b128aea6d8dc9e5d493f852302c2e6577daf81/README.md#L195-L206)

作者列出窗口范围

<details>
<summary>查看原文（12行）</summary>

```text
## Limits

- **The map covers the loaded window.** DSH pages older history in on demand; until it is
  loaded it has no layout to map. The `⌃` indicator is the honest signal that more
  exists; reaching the top pulls it in automatically.
- **Chat view only.** The Trajectory tab renders its own event ledger with different
  anchors; the map stands down there rather than guessing.
- The rail occupies a ~14px strip of the transcript's right padding, so clicks in that
  strip go to the map.
- Hiding the host's turn rail is keyed on the stylesheet that rail ships
  (the rule declaring `--turn-rail-band`). A DSH that stops shipping it under
  that name gets its rail back, not a broken map.
```

</details>

#### 缺口

- 宿主 export 授权、切会话和大 ZIP 上限未知
  **影响**：不能确定越权访问与内存开销
  **进一步探讨**：用两会话、取消和超大导出测试

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用与退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

在兼容 DSH Chat 中创建含工具错误和折叠轮次的合成会话，核对地图与线索墙，并试切换会话和浅深主题。开销来自浏览器观测、绘制和导出。停用时检查原滚动条和原 turn rail 恢复，按需清理本地显示偏好。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:129-168](https://github.com/jsdvjx/dsh-strata/blob/50b128aea6d8dc9e5d493f852302c2e6577daf81/README.md#L129-L168)

兼容和安装

<details>
<summary>查看原文（40行）</summary>

````text
## Compatibility

| DSH | Status |
|---|---|
| 0.1.2-rc.1 | Tested — turn folding, the turn navigator, the width handle and the locale switch are all accounted for (see below) |
| 0.1.1-rc.2 | Tested — nothing 0.1.2-specific is required; every seam degrades to the old behaviour |

What 0.1.2 brought, and what the map does about it:

- **Turn folding** (Compact mode hides a finished turn's process rows in place): folded
  rows leave the map the moment they fold, and come back the moment they open.
- **The turn navigator**: hidden while the map is up, handed back when it stands down
  (`localStorage['dsh-strata.native-turn-rail'] = 'keep'` keeps both).
- **The content-width handle** sits under the dot column at laptop widths: the column
  owns its 14px, so a gap between two dots is not a resize grip.
- **Language switching**: labels come through the host's locale service and follow a
  switch in Settings → General without a reload; a language pack can translate the
  `dsh-strata` namespace into a third-party language. A host without the service
  gets the built-in zh/en table keyed on the document language.
- **Pager lifecycle**: 0.1.2 unmounts the "load older" control while a page is in
  flight; the load chain waits for it to come back instead of calling the history
  exhausted, and measures progress by rows landed rather than by scroll height.

## Install

```sh
dsh plugin --profile web add dsh-strata
```

Or straight from the repo:

```sh
dsh plugin --profile web add "github:jsdvjx/dsh-strata#main"
```

Then restart `dsh web`. To remove:

```sh
dsh plugin --profile web remove dsh-strata
```
````

</details>

**依据 2 · 作者声明**：[README.md:188-206](https://github.com/jsdvjx/dsh-strata/blob/50b128aea6d8dc9e5d493f852302c2e6577daf81/README.md#L188-L206)

绘制及已知限制

<details>
<summary>查看原文（19行）</summary>

```text
Rendering is a canvas repainted on a rAF, re-measuring rows only when the transcript's
structure changes — a streaming reply grows one band through its own ResizeObserver
report, a plain scroll moves the lens and nothing else, and the strata are cached as a
base layer so a hover repaints one band, not the session. Colors are read from the theme's own
`--dsw-alias-*` tokens, so light and dark both come out right, and `prefers-reduced-motion`
disables the transitions.

## Limits

- **The map covers the loaded window.** DSH pages older history in on demand; until it is
  loaded it has no layout to map. The `⌃` indicator is the honest signal that more
  exists; reaching the top pulls it in automatically.
- **Chat view only.** The Trajectory tab renders its own event ledger with different
  anchors; the map stands down there rather than guessing.
- The rail occupies a ~14px strip of the transcript's right padding, so clicks in that
  strip go to the map.
- Hiding the host's turn rail is keyed on the stylesheet that rail ships
  (the rule declaring `--turn-rail-band`). A DSH that stops shipping it under
  that name gets its rail back, not a broken map.
```

</details>

**依据 3 · 源码核查**：[client.js:1259-1278](https://github.com/jsdvjx/dsh-strata/blob/50b128aea6d8dc9e5d493f852302c2e6577daf81/client.js#L1259-L1278)

本地显示偏好

<details>
<summary>查看原文（20行）</summary>

```text
        keepNativeTurnRail = window.localStorage.getItem(NATIVE_RAIL_KEY) === 'keep'
      } catch {
        // Storage refusal only costs the opt-out.
      }

      let scroller = null
      let bands = []
      /** Row element -> its band, for the incremental resize path. */
      let bandByEl = new Map()
      let userBandIndex = []
      // Map scale: 'all' spans the whole loaded session, 'init' restores the
      // extent at session open, 'mid' twice that. Zoomed windows slide with
      // the reading position and are immune to prepend rescaling.
      const ZOOM_KEY = 'dsh-strata.zoom'
      let zoomMode = 'init'
      let initialExtent = 0
      let initialSession
      let currentSession
      try {
        const saved = window.localStorage.getItem(ZOOM_KEY)
```

</details>

#### 缺口

- 未运行或测大日志
  **影响**：性能和恢复未知
  **进一步探讨**：记录浏览器内存和节点跳转

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何避免线索墙大导出占用过高？

**研究主题**：新假设与验证

#### 完整回答

对照当前 arrayBuffer，可试验限制导出大小或按宿主分页读取用户提示。合成递增长日志比较峰值内存、首屏和完整率；若遗漏或无明显改善则调整。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:2402-2425](https://github.com/jsdvjx/dsh-strata/blob/50b128aea6d8dc9e5d493f852302c2e6577daf81/client.js#L2402-L2425)

当前全量缓冲

<details>
<summary>查看原文（24行）</summary>

```text
      async function fetchPrompts(sessionId, signal) {
        const res = await fetch('/api/session.export?sessionId=' + encodeURIComponent(sessionId), { signal })
        if (!res.ok) throw new Error('export ' + res.status)
        const buf = new Uint8Array(await res.arrayBuffer())
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)
        let eocd = -1
        for (let i = buf.length - 22; i >= 0; i -= 1) {
          if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break }
        }
        if (eocd === -1) throw new Error('no zip directory')
        const count = view.getUint16(eocd + 10, true)
        let offset = view.getUint32(eocd + 16, true)
        for (let n = 0; n < count; n += 1) {
          if (offset + 46 > buf.length || view.getUint32(offset, true) !== 0x02014b50) break
          const method = view.getUint16(offset + 10, true)
          const csize = view.getUint32(offset + 20, true)
          const nameLen = view.getUint16(offset + 28, true)
          const extraLen = view.getUint16(offset + 30, true)
          const commentLen = view.getUint16(offset + 32, true)
          const localOffset = view.getUint32(offset + 42, true)
          const name = new TextDecoder().decode(buf.subarray(offset + 46, offset + 46 + nameLen))
          if (name === 'session.jsonl') {
            if (localOffset + 30 > buf.length) throw new Error('truncated export')
            const lnl = view.getUint16(localOffset + 26, true)
```

</details>

#### 缺口

- 宿主分页接口未知
  **影响**：可能需要上游支持
  **进一步探讨**：先核查 API 再对照长会话

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
