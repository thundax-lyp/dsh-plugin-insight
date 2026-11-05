# DSH Annotation

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[48eac63](https://github.com/omdsh-dev/dsh-annotation/tree/48eac63badf93641f2276b8b0068f6ebbe22ba9b)

<!-- BEGIN META -->
[![GitHub ★ 160](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=160&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-annotation) [![npm 30d 3,331](https://img.shields.io/static/v1?label=npm+30d&message=3%2C331&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@changfenhuang/dsh-annotation) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@changfenhuang/dsh-annotation)
<!-- END META -->

> **功能**：在 DSH 选中文字批注并随消息发送，以编号关联回复。

> **亮点**：[Q01](#research-q01) 将选段和问题统一提交。

> **主要限制**：[Q03](#research-q03) 隐藏只改气泡显示，模型仍收到内容。

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
  - [Q01 · 多段批注如何减少手工引用？](#detail-section-11)
  - [Q02 · 怎样与宿主发送顺序协调？](#detail-section-12)
  - [Q03 · 气泡不显示是否代表内容未发送？](#detail-section-13)
  - [Q04 · 如何安全试用与退出？](#detail-section-14)
  - [Q05 · 发送预览能避免遗留批注误发吗？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要逐段追问 DSH 回复的人可收集批注再统一发出。

人工复制和编号有明确可见性，但有重复整理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 批注 | 为文本添加说明 | 依赖可选文本界面 |
| 提交 | 和问题一并发送 | 模型会收到选段 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 Web 宿主 | 必需 | 接入 composer | 改用手工 |
| 本地存储 | 跨刷新需要 | 保存草稿 | 只保留当前页面状态 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 选择 | 标记合成选段 | 核对待发内容 |
| 提交 | 检查气泡与回复 | 验证模型输入范围 |
| 退出 | 清除草稿、禁用 | 用手工引用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 安装耗时未知 | 需要宿主 |
| 持续 | 上下文费用未知 | 校对耗时未知 | 批注增加输入 |
| 恢复 | 重试开销未知 | 排查耗时未知 | 存储和输入法有边界 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 上下文收集 | 有草稿拼接和存储 | 输入法与模型遵循 |

> **思考**：[Q03](#research-q03) 隐藏只改气泡显示，模型仍收到内容。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将选段和问题统一提交。

输入事件分开处理修饰键和宿主队列。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 隐藏只改气泡显示，模型仍收到内容。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先测试输入法与合成数据。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的批注草稿、提交时序和模型可见性。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的批注草稿、提交时序和模型可见性。未执行目标代码或实际宿主验证。
- 下一步：以刷新后带旧草稿情境对照

**分析版本**

- **仓库**：[omdsh-dev/dsh-annotation](https://github.com/omdsh-dev/dsh-annotation)
- **版本号**：1.4.11（[固定提交 48eac63](https://github.com/omdsh-dev/dsh-annotation/tree/48eac63badf93641f2276b8b0068f6ebbe22ba9b)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 测试显式预览能否减少误发。

以刷新后带旧草稿情境对照

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 456 | — | — | 9028 |
| .js | source | 3 | 3317 | 2662 | 582 | — |
| .md | test | 1 | 72 | — | — | 677 |
| .mjs | source | 7 | 783 | 691 | 38 | — |
| .ts | source | 1 | 9 | 3 | 3 | — |
| .mjs | test | 18 | 1881 | 1659 | 123 | — |
| .ts | test | 1 | 427 | 385 | 26 | — |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-annotation/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=8&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-annotation/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-annotation/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：批注草稿、提交时序和模型可见性

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多段批注如何减少手工引用？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户可选多段文本记录批注并随问题提交。相比复制后手写编号，扩展负责收集和编号；模型仍需遵循文本指令，是否逐条回答要人工看。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-38](https://github.com/omdsh-dev/dsh-annotation/blob/48eac63badf93641f2276b8b0068f6ebbe22ba9b/README.md#L21-L38)

作者描述交互与编号

<details>
<summary>查看原文（18行）</summary>

```text
Select any text in an assistant reply to annotate it (the annotation body may be left empty = just mark the passage). Annotations accumulate across messages and turns. An **Annotations ×N** chip appears next to the input box — hover to view all annotations, remove them one by one. Press Enter and the annotation block goes to the model together with whatever question is in the input box. **The annotation block never shows up as text in your own message bubble** — only the question plus the chip (content visible on hover; hidden before paint, zero flicker). The model replies with `Annotation 1: …` … `Annotation N: …`, one per annotation, and every Annotation label in the reply is a hoverable chip showing the annotated passage and your note.

Form: official **bundle plugin** (`dsh.bundle` + a `dsh.client` declaration in package.json, injected into the browser via client-modules; the Node half is an empty implementation). **Zero core changes** — no DSH files are touched; `cordis.patch.yml` only inserts its own id once, and the profile patch stays `[]`.

## Features

Sidebar file annotations (DSH 0.1.6-alpha.1): select plain text, Markdown, or code in a workspace file preview and use the same annotate, save, and Enter-to-send flow. The editor and model-facing quote include the file path. After reloading and reopening the original file, its markers are restored; identical passages in different files remain separate. PDF, images, and HTML inside iframes are not covered.

| Feature | Description |
|---|---|
| Select-to-annotate | Select assistant text → toolbar "Annotate" → write your note (may be empty); dismiss by clicking elsewhere or pressing Esc |
| Numbered marker + highlight | A blue numbered marker + highlight anchored to the passage, viewport-anchored with collision avoidance, never lost when scrolled out of view |
| Cross-turn collection | Any number of annotations accumulate across messages/turns, numbered from 1 |
| "Annotations ×N" chip | Small chip beside the input box; hover shows every annotation, deletable individually |
| Enter sends with your message | Annotation block + the question in the input box are sent to the model together (the model receives the full content) |
| Hidden in your bubble | The annotation block is removed from your bubble's DOM the moment you send (before the browser paints), leaving only the question + the chip (hover to view); historical messages self-heal after a refresh |
| Numbered reply correspondence | A format instruction is injected into the message so the model replies `Annotation 1: …` … `Annotation N: …` one by one |
| Reply annotation chips | `Annotation N:` in the reply renders as hoverable chips showing the passage + your note |
```

</details>

**依据 2 · 源码核查**：[client.js:1351-1367](https://github.com/omdsh-dev/dsh-annotation/blob/48eac63badf93641f2276b8b0068f6ebbe22ba9b/client.js#L1351-L1367)

发送时拼接草稿

<details>
<summary>查看原文（17行）</summary>

```text
      function onKeyDown(e) {
        if (e.key === 'Escape') {
          if (ui.mode !== 'closed') closeToolbar()
          return
        }
        // 【回车随输入框发送】在 composer 里按 Enter（且已收集批注、非输入法合成）：
        // 提交前一刻把批注块拼进草稿，composer 自己的 Enter 提交继续——模型收到
        // 批注清单 + 用户输入的问题。用户始终看不到文本被塞进去。
        // IME 铁律（v1.3.10 修了 nativeEvent.keyCode；v1.3.11 补 compositionend
        // 后 Enter keyCode=13 的时序洞）：合成期 / 上屏确认 Enter 绝不能 setDraft。
        // 修饰键守卫（v1.3.18 修 issue #10）：Shift+Enter 换行、Alt+Enter 默认路径
        // 不触发拼稿；裸 Enter 继续处理带文字草稿，Cmd/Ctrl+Enter 只接管空草稿
        // 的纯批注。已有文字时交回 composer，保留宿主的 Queue / Steer 策略。
        // 纯批注的 Cmd/Ctrl+Enter 需要在这里直接提交：composer 的 accelerated 路径在
        // 「运行中 + 有排队消息」时会走 steerQueue，而不是发送当前草稿；我们在
        // capture 阶段 setDraft 后 stopPropagation，主动 submit('queue')，保证
        // 纯批注能直接发出，同时不会把批注块明文留在输入框。
```

</details>

#### 缺口

- 未看实际编号响应
  **影响**：不能保证模型遵循
  **进一步探讨**：用三段引用检查回复对应

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 怎样与宿主发送顺序协调？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

捕获阶段监听 Enter，限制修饰键与输入位置，避开输入法提交。普通附加后交给宿主发送，特定加速手势走 scope 和 submit queue。依赖 DOM 锚点和宿主上下文，标记改变会破坏接线。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:1368-1408](https://github.com/omdsh-dev/dsh-annotation/blob/48eac63badf93641f2276b8b0068f6ebbe22ba9b/client.js#L1368-L1408)

输入法、双 DOM 分支、显式提交

<details>
<summary>查看原文（41行）</summary>

```text
        if (e.key === 'Enter' && !e.shiftKey && !e.altKey
          && ui.quotes.length > 0) {
          // 双分支门控：DSH ≥0.1.2 是 div[data-composer-input] 输入区，≤0.1.1 是 textarea。
          // 1.4.6 适配 0.1.2 时移除了 textarea 分支，旧核心上 Enter 因此不再拼入批注块
          // （只剩发送按钮路径可用）。两条分支并行保留。
          var input = e.target instanceof Element &&
            (e.target.closest('[data-composer-input]') ||
              (e.target instanceof HTMLTextAreaElement && e.target.closest('[data-composer-card]')))
          if (input && input.closest('[data-composer-card]') !== null) {
            if (isImeKeyBlocked(e)) {
              // 宿主的合成尾窗可能短于这里的 50ms。仅在本来会拼批注的
              // 手势上拦住宿主提交；不 preventDefault，保留输入法确认行为。
              if (shouldGuardImeEnter(e)) e.stopPropagation()
              return
            }
            var attached = attachAndSend(e)
            if (attached && (e.ctrlKey || e.metaKey)) {
              e.preventDefault()
              e.stopPropagation()
              submitAttached()
            }
          }
        }
      }
      // capture 阶段：必须先于 composer 自己的 Enter 处理（React 在容器层冒泡
      // 提交）——否则等我们执行时消息已提交，拼稿永远太迟。
      document.addEventListener('keydown', onKeyDown, true)

      function submitAttached() {
        var current = readCurrentSessionId()
        if (current === undefined) {
          console.warn('[annotation] 无法确定当前会话，批注直接提交已跳过')
          return
        }
        var scoped = sessions.scope(current)
        if (scoped === undefined) {
          console.warn('[annotation] 当前会话 scope 不可用，批注直接提交已跳过')
          return
        }
        try {
          ctx.conversation.input.for(scoped).submit('queue')
```

</details>

#### 缺口

- 未验证各种输入法
  **影响**：可能出现误触或遗漏
  **进一步探讨**：检查中文合成、队列和提交按钮

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 气泡不显示是否代表内容未发送？

**研究主题**：缺陷与关键质疑

#### 完整回答

批注块被拼入草稿发给模型，气泡装饰只影响展示。待发批注也按会话键存入 localStorage，存储失败会降级。不能因为气泡只显示原提问就认为选段没进入宿主消息。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:31-38](https://github.com/omdsh-dev/dsh-annotation/blob/48eac63badf93641f2276b8b0068f6ebbe22ba9b/README.md#L31-L38)

作者说明展示与模型差异

```text
| Select-to-annotate | Select assistant text → toolbar "Annotate" → write your note (may be empty); dismiss by clicking elsewhere or pressing Esc |
| Numbered marker + highlight | A blue numbered marker + highlight anchored to the passage, viewport-anchored with collision avoidance, never lost when scrolled out of view |
| Cross-turn collection | Any number of annotations accumulate across messages/turns, numbered from 1 |
| "Annotations ×N" chip | Small chip beside the input box; hover shows every annotation, deletable individually |
| Enter sends with your message | Annotation block + the question in the input box are sent to the model together (the model receives the full content) |
| Hidden in your bubble | The annotation block is removed from your bubble's DOM the moment you send (before the browser paints), leaving only the question + the chip (hover to view); historical messages self-heal after a refresh |
| Numbered reply correspondence | A format instruction is injected into the message so the model replies `Annotation 1: …` … `Annotation N: …` one by one |
| Reply annotation chips | `Annotation N:` in the reply renders as hoverable chips showing the passage + your note |
```

**依据 2 · 源码核查**：[client.js:1084-1102](https://github.com/omdsh-dev/dsh-annotation/blob/48eac63badf93641f2276b8b0068f6ebbe22ba9b/client.js#L1084-L1102)

浏览器草稿存储

<details>
<summary>查看原文（19行）</summary>

```text
      function readPendingQuotes(sessionId) {
        if (sessionId === undefined) return []
        try {
          return parsePendingQuotes(localStorage.getItem(pendingStorageKey(sessionId)))
        } catch (err) {
          console.warn('[annotation] 读取待发送批注失败：', err)
          return []
        }
      }

      function writePendingQuotes(sessionId) {
        if (sessionId === undefined) return
        try {
          var key = pendingStorageKey(sessionId)
          if (ui.quotes.length === 0) localStorage.removeItem(key)
          else localStorage.setItem(key, stringifyPendingQuotes(ui.quotes))
        } catch (err) {
          console.warn('[annotation] 保存待发送批注失败：', err)
        }
```

</details>

**依据 3 · 源码核查**：[client.js:1356-1367](https://github.com/omdsh-dev/dsh-annotation/blob/48eac63badf93641f2276b8b0068f6ebbe22ba9b/client.js#L1356-L1367)

提交前拼接

<details>
<summary>查看原文（12行）</summary>

```text
        // 【回车随输入框发送】在 composer 里按 Enter（且已收集批注、非输入法合成）：
        // 提交前一刻把批注块拼进草稿，composer 自己的 Enter 提交继续——模型收到
        // 批注清单 + 用户输入的问题。用户始终看不到文本被塞进去。
        // IME 铁律（v1.3.10 修了 nativeEvent.keyCode；v1.3.11 补 compositionend
        // 后 Enter keyCode=13 的时序洞）：合成期 / 上屏确认 Enter 绝不能 setDraft。
        // 修饰键守卫（v1.3.18 修 issue #10）：Shift+Enter 换行、Alt+Enter 默认路径
        // 不触发拼稿；裸 Enter 继续处理带文字草稿，Cmd/Ctrl+Enter 只接管空草稿
        // 的纯批注。已有文字时交回 composer，保留宿主的 Queue / Steer 策略。
        // 纯批注的 Cmd/Ctrl+Enter 需要在这里直接提交：composer 的 accelerated 路径在
        // 「运行中 + 有排队消息」时会走 steerQueue，而不是发送当前草稿；我们在
        // capture 阶段 setDraft 后 stopPropagation，主动 submit('queue')，保证
        // 纯批注能直接发出，同时不会把批注块明文留在输入框。
```

</details>

#### 缺口

- 未观察供应方留存
  **影响**：不能确定真实数据传播范围
  **进一步探讨**：用合成文字检查会话和模型输入

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何安全试用与退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

在支持版本的测试会话，先只批注合成回复，核对发送和回复编号。需要支持的 Web 宿主与客户端声明。若误发或输入法冲突，清空待发批注、禁用扩展，改用手工引用。安装与维护开销未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:57-68](https://github.com/omdsh-dev/dsh-annotation/blob/48eac63badf93641f2276b8b0068f6ebbe22ba9b/README.md#L57-L68)

安装说明

<details>
<summary>查看原文（12行）</summary>

````text
## Install (official bundle path · the only one)

```sh
# Public npm package (works without an npm account)
dsh plugin --profile web add @changfenhuang/dsh-annotation
# Or install directly from the public GitHub source
dsh plugin --profile web add git+https://github.com/omdsh-dev/dsh-annotation.git
# local path install (development / debugging)
cd /path/to/dsh-annotation
dsh plugin --profile web add .
# restart the web service — see "Restarting the web service" below
```
````

</details>

**依据 2 · 源码核查**：[package.json:8-14](https://github.com/omdsh-dev/dsh-annotation/blob/48eac63badf93641f2276b8b0068f6ebbe22ba9b/package.json#L8-L14)

客户端导出

```text
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": "./client.js",
    "./package.json": "./package.json"
```

**依据 3 · 源码核查**：[client.js:1094-1102](https://github.com/omdsh-dev/dsh-annotation/blob/48eac63badf93641f2276b8b0068f6ebbe22ba9b/client.js#L1094-L1102)

草稿删除

```text
      function writePendingQuotes(sessionId) {
        if (sessionId === undefined) return
        try {
          var key = pendingStorageKey(sessionId)
          if (ui.quotes.length === 0) localStorage.removeItem(key)
          else localStorage.setItem(key, stringifyPendingQuotes(ui.quotes))
        } catch (err) {
          console.warn('[annotation] 保存待发送批注失败：', err)
        }
```

#### 缺口

- 未运行宿主或模型
  **影响**：未知兼容范围
  **进一步探讨**：验证发送、撤除与历史展示

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 发送预览能避免遗留批注误发吗？

**研究主题**：新假设与验证

#### 完整回答

待发批注可跨会话刷新保存。试验提交前额外提示将发送哪些段落，对照现有 hover 提示。测误发与按键负担；若误发无改善或严重拖慢反复批注，则否定。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:1084-1102](https://github.com/omdsh-dev/dsh-annotation/blob/48eac63badf93641f2276b8b0068f6ebbe22ba9b/client.js#L1084-L1102)

持久草稿

<details>
<summary>查看原文（19行）</summary>

```text
      function readPendingQuotes(sessionId) {
        if (sessionId === undefined) return []
        try {
          return parsePendingQuotes(localStorage.getItem(pendingStorageKey(sessionId)))
        } catch (err) {
          console.warn('[annotation] 读取待发送批注失败：', err)
          return []
        }
      }

      function writePendingQuotes(sessionId) {
        if (sessionId === undefined) return
        try {
          var key = pendingStorageKey(sessionId)
          if (ui.quotes.length === 0) localStorage.removeItem(key)
          else localStorage.setItem(key, stringifyPendingQuotes(ui.quotes))
        } catch (err) {
          console.warn('[annotation] 保存待发送批注失败：', err)
        }
```

</details>

**依据 2 · 作者声明**：[README.md:33-36](https://github.com/omdsh-dev/dsh-annotation/blob/48eac63badf93641f2276b8b0068f6ebbe22ba9b/README.md#L33-L36)

已有悬浮入口

```text
| Cross-turn collection | Any number of annotations accumulate across messages/turns, numbered from 1 |
| "Annotations ×N" chip | Small chip beside the input box; hover shows every annotation, deletable individually |
| Enter sends with your message | Annotation block + the question in the input box are sent to the model together (the model receives the full content) |
| Hidden in your bubble | The annotation block is removed from your bubble's DOM the moment you send (before the browser paints), leaving only the question + the chip (hover to view); historical messages self-heal after a refresh |
```

#### 缺口

- 无行为样本
  **影响**：效果未知
  **进一步探讨**：以刷新后带旧草稿情境对照

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
