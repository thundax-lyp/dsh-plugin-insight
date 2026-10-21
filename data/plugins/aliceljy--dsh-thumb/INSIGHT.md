# dsh-thumb

> 为窄屏DSH提供覆盖式会话抽屉、单列设置与紧凑阅读样式。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[cde1359](https://github.com/AliceLJY/dsh-thumb/tree/cde135922e5fdd8729b163c634dd811294555d36)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AliceLJY/dsh-thumb)
<!-- END META -->

**使用建议**：手机用户可先核会话切换、设置和相邻trace视图；需要更大点击目标时调整密度。

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

- **用途**：手机或窄平板切换会话后阅读聊天，避免侧栏持续挤压正文。

- **建议**：未验证假设：以官方布局槽位承载抽屉，并按触控目标与正文空间双预算调密度，可减少兼容修补和误触。用多个窄屏、trace/设置、触屏任务比较误触、阅读与切会话耗时；空间增益若伴误触上升则停止缩小按钮。

手机用户可先核会话切换、设置和相邻trace视图；需要更大点击目标时调整密度。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

参照作者固定DSH版本列求解器与原生窄屏布局；增量是抽屉覆盖和选会话后自动收起，作者宽度测量不是本轮运行结果。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：手机抽屉、单列设置和阅读密度

**流程与依赖**

客户端按语义CSS后缀唯一定位列并打data-thumb属性，窄屏CSS作用于自有属性；MutationObserver/resize维护标记，overlay遮罩调用官方layout.toggleSidebar，点击会话后收起。

宿主slots/layout和React、CSS Modules语义后缀/DOM结构；作者声明rc.6及0.2.1-rc.2检查，本轮未验。

≤1023px展开侧栏→覆盖聊天并显示遮罩→点会话或遮罩关闭→正文恢复；设置窄屏单列；URL/localStorage开关可停用。

**效果与成本**

无模型/API费用；DOM监听和CSS兼容需随宿主维护，作者不承诺维护；缩小字体和按钮有可读性/触达取舍。

作者报告393px视口原生正文113px，属于固定环境材料；本轮未复测宽度、触达或阅读效率。

- **思考**：定位依赖宿主内部语义类名，唯一匹配校验避免误写但不能保证升级兼容；紧凑按钮24px牺牲触达尺寸，更多正文空间不自动等于更好移动可用性。作者单设备测量不能外推所有手机。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：针对窄屏侧栏挤占的明确失败路径，将覆盖抽屉、关闭动作与阅读密度组合，改善的是同一界面任务的可用空间。常见响应式设计，不构成新布局算法或业务分工。

针对窄屏侧栏挤占的明确失败路径，将覆盖抽屉、关闭动作与阅读密度组合，改善的是同一界面任务的可用空间。常见响应式设计，不构成新布局算法或业务分工。

语义后缀集中定位和自有data属性将易变选择器收束，官方toggle优于模拟点击；语义改名仍会失效，不是稳定宿主契约。

源码依据：[src/index.js](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/src/index.js)、[src/client.js](https://github.com/AliceLJY/dsh-thumb/blob/cde135922e5fdd8729b163c634dd811294555d36/src/client.js)。

<a id="detail-section-5"></a>

### 主要限制

定位依赖宿主内部语义类名，唯一匹配校验避免误写但不能保证升级兼容；紧凑按钮24px牺牲触达尺寸，更多正文空间不自动等于更好移动可用性。作者单设备测量不能外推所有手机。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AliceLJY/dsh-thumb](https://github.com/AliceLJY/dsh-thumb)
- **版本号**：0.1.0（[固定提交 cde13592](https://github.com/AliceLJY/dsh-thumb/tree/cde135922e5fdd8729b163c634dd811294555d36)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.js、src/client.js、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：未来固定宿主/设备矩阵核定位、开关、trace隔离、键盘与触达；本轮未运行作者Playwright。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

未验证假设：以官方布局槽位承载抽屉，并按触控目标与正文空间双预算调密度，可减少兼容修补和误触。用多个窄屏、trace/设置、触屏任务比较误触、阅读与切会话耗时；空间增益若伴误触上升则停止缩小按钮。

未来固定宿主/设备矩阵核定位、开关、trace隔离、键盘与触达；本轮未运行作者Playwright。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：61628f228209bc39bd85bf9dc5b3e22074dbc5ea93eb31eb66e576cc1701d853。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 276 | — | — | 4922 |
| .js | source | 2 | 483 | 262 | 190 | — |
| .mjs | test | 2 | 335 | 236 | 82 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AliceLJY/dsh-thumb/issues?q=is%3Aissue+created%3A2026-09-21T08%3A00%3A12.882Z..2026-10-21T08%3A00%3A12.882Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AliceLJY/dsh-thumb/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T08%3A00%3A12.882Z..2026-10-21T08%3A00%3A12.882Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-21。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
