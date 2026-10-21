# dsh-question-nav

> 以会话提问索引与圆点导航跳转历史用户提问。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[29e7e48](https://github.com/AbelKeithsun/dsh-question-nav/tree/29e7e487235bdbcba13768f1a009ecd2089d6faa)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AbelKeithsun/dsh-question-nav) [![npm 30d 1,247](https://img.shields.io/static/v1?label=npm+30d&message=1%2C247&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@luziyang2026/dsh-question-nav) [![首次发布 2026-08-21](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@luziyang2026/dsh-question-nav)
<!-- END META -->

**使用建议**：经常回看长会话者可列为导航候选；多模态/多文本块提问需核对索引完整性，不把圆点缺失理解为没有历史问题。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：长会话用户回看先前问题、定位对应轮次；交付物是问题导航和定位结果，不进行内容总结或问答。

- **建议**：为索引保留全部文本块但分页传输，并将跳转绑定session与绝对deadline，可能同时保持完整性和长会话响应。用首块图片+后续文本、多文本块、万轮历史、加载挂住和中途切会话案例，要求文本完整且不跨会话滚动；如内存或延迟未改善，应区分数据完整性与性能收益。

经常回看长会话者可列为导航候选；多模态/多文本块提问需核对索引完整性，不把圆点缺失理解为没有历史问题。

核查状态：投影、合并与分页跳转源码支持；超长会话性能、跨版本及实际跳转准确性未验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

宿主历史滚动、浏览器查找或摘要目录；插件提供完整事件驱动索引及按需跳转，不改变回答内容。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：shell.overlay问题圆点导航、悬停卡与设置tab。
- **事件监听**：questionIndex会话投影折叠用户事件，client订阅projection/live内容更新。

**流程与依赖**

Host注册questionIndex投影，折叠完整事件只收append且source=user的消息，turn/start标轮次；依赖宿主projection cache持久化及推送。client把投影与live窗口合并，一轮多问题归一个点；overlay显示问题卡，点击时逐页loadOlder直到目标可渲染再滚动，失败提示或邻近行fallback。

DSH sessions、projection/cache与历史载体、Web slots/locale/settings及DOM锚点；缺能力按源码降级。

Host折叠用户事件→缓存/推送索引→client合并刚发送问题→悬停全文卡/点击→按需向前加载→找锚点滚动或报失败；导航不改会话原文。

DSH Web bundle，投影/settings服务可选；缺投影时退live窗口，完整历史能力不成立，依赖宿主cache载体而非插件自建数据库。

**效果与成本**

现金无额外模型API；人工维护宿主chat key/投影契约，长会话保存问题文本带来缓存与内存成本；跳转老历史分页有等待。

减少手工滚动和打开全部历史的需求；未证明阅读效率提升，也不是语义搜索替代。

- **思考**：“完整历史/全文”是否等于所有提问完整可达？projection的messageText只取content第一个块，后续文本块或首块为图片会丢提问；索引questions数组无上限，长会话每次追加复制。jump的deadline在await loadOlder之外检查，单次挂住仍可能超预算；isViewActive仅检查任意chat flow，不确认仍是原session。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相比扫描当前DOM找问题，先建立独立于渲染窗口的事件投影，保持完整问题导航而不预先扩展聊天窗口；纯数据变换与注入式jump ports方便迁移。宿主缓存/分页能力归上游，圆点导航本身不是新业务流程。

相比扫描当前DOM找问题，先建立独立于渲染窗口的事件投影，保持完整问题导航而不预先扩展聊天窗口；纯数据变换与注入式jump ports方便迁移。宿主缓存/分页能力归上游，圆点导航本身不是新业务流程。

投影state/wire严格schema、非相关事件保留同引用减少dirty写入；纯turn分组和jump ports便于隔离验证，fallback明确返回ok=false而非假装精确命中。

固定源码依据：[src/index.ts](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/index.ts)、[src/projection.ts](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/projection.ts)、[src/core/turn-dots.ts](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/core/turn-dots.ts)、[src/core/jump.ts](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/core/jump.ts)、[src/client/index.ts](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/client/index.ts)、[src/client/QuestionNavStrip.tsx](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/client/QuestionNavStrip.tsx)、[package.json](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/package.json)。

<a id="detail-section-5"></a>

### 主要限制

“完整历史/全文”是否等于所有提问完整可达？projection的messageText只取content第一个块，后续文本块或首块为图片会丢提问；索引questions数组无上限，长会话每次追加复制。jump的deadline在await loadOlder之外检查，单次挂住仍可能超预算；isViewActive仅检查任意chat flow，不确认仍是原session。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：0.7.8；版本日期：2026-09-06（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[29e7e487](https://github.com/AbelKeithsun/dsh-question-nav/tree/29e7e487235bdbcba13768f1a009ecd2089d6faa)；本轮基准：2026-10-21T05:26:52Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根组件Host投影注册、projection fold、turn dots、jump orchestration及client接线；未逐行检查全部动画/CSS与真实宿主，不执行构建测试。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

为索引保留全部文本块但分页传输，并将跳转绑定session与绝对deadline，可能同时保持完整性和长会话响应。用首块图片+后续文本、多文本块、万轮历史、加载挂住和中途切会话案例，要求文本完整且不跨会话滚动；如内存或延迟未改善，应区分数据完整性与性能收益。

未执行；提出多块文本/多模态、长历史、无投影降级、loadOlder挂起与切session反例，分开测准确率、峰值内存和等待。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 431 | — | — | 4321 |
| .ts | source | 19 | 1552 | 910 | 517 | — |
| .tsx | source | 2 | 782 | 563 | 180 | — |
| .ts | test | 8 | 751 | 625 | 39 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/AbelKeithsun/dsh-question-nav/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AbelKeithsun/dsh-question-nav/issues?q=is%3Aissue+created%3A2026-09-21T05%3A34%3A26.031Z..2026-10-21T05%3A34%3A26.031Z)

暂未获取：近30天关闭。

统计日期：2026-10-21。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
