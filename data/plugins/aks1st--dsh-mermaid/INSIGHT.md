# dsh-mermaid

> 按视口延迟渲染已完成Mermaid代码块，并提供缩放与错误报告入口。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[2708cdf](https://github.com/AKS1st/dsh-mermaid/tree/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48)

<!-- BEGIN META -->
[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dsh-mermaid) [![npm 30d 4,325](https://img.shields.io/static/v1?label=npm+30d&message=4%2C325&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-mermaid) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-mermaid)
<!-- END META -->

**使用建议**：先核宿主代码块兼容；错误修复按钮会尝试发送消息，使用前保留已有草稿。

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

- **用途**：阅读模型生成的流程图、时序图，遇语法错误再主动请求模型修复。

- **建议**：未验证假设：改用宿主草稿事务并在已有草稿时追加/确认，可避免修复入口破坏草稿。以非空草稿、忙状态、不同发送键及快速会话切换核内容保留和实际发送状态。

先核宿主代码块兼容；错误修复按钮会尝试发送消息，使用前保留已有草稿。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

参照Mermaid与宿主代码块；增量为DSH流式完成判定、懒渲染、主题刷新和修复入口。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：Mermaid图、缩放和错误修复按钮
- **Host 路由**：Mermaid本地分发和配置

**流程与依赖**

主机提供本地UMD和配置，客户端监听稳定代码块DOM，以IntersectionObserver近视口入队串行渲染，strict配置且不调用bindFunctions；失败保留源码并显示操作。

webServer、客户端DOM hooks、Mermaid包与浏览器观察器；宿主代码块结构和composer键盘约定须匹配。

代码块完成→近视口渲染→缩放或显示错误→用户点击发送AI修复→写textarea并模拟Enter；不是后台自动修复。

**效果与成本**

本地脚本体积与浏览器布局成本，主动修复才产生模型token费用；DOM兼容维护是持续成本。

改善图阅读可能性明确，未有渲染性能或修复成功率对照。

- **思考**：sendToAI会覆盖现有textarea草稿，30ms后只检查非空就发Enter，不证明草稿等于报告或已真正提交；DOM与按键模拟绑定宿主约定。strict与文本/边数上限不能保证任意图渲染性能。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：将流式消息与图渲染时机分离，防半成品反复渲染，并串行处理近视口任务；图布局与净化来自Mermaid上游。

将流式消息与图渲染时机分离，防半成品反复渲染，并串行处理近视口任务；图布局与净化来自Mermaid上游。

观察器共享、串行队列、释放清理与错误源码保留值得复用；发送成功标志不等于宿主接收确认。

源码依据：[src/index.ts](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/index.ts)、[src/client/index.ts](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/client/index.ts)、[src/client/dom.ts](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/client/dom.ts)。

<a id="detail-section-5"></a>

### 主要限制

sendToAI会覆盖现有textarea草稿，30ms后只检查非空就发Enter，不证明草稿等于报告或已真正提交；DOM与按键模拟绑定宿主约定。strict与文本/边数上限不能保证任意图渲染性能。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AKS1st/dsh-mermaid](https://github.com/AKS1st/dsh-mermaid)
- **版本号**：0.5.0（[固定提交 2708cdf2](https://github.com/AKS1st/dsh-mermaid/tree/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48)）
- **版本日期**：2026-08-17（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.ts、src/client/index.ts、src/client/dom.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：核半成品不渲染、离屏队列、主题变化、错误入口保留草稿和发送判定；本轮未发消息或渲染。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

未验证假设：改用宿主草稿事务并在已有草稿时追加/确认，可避免修复入口破坏草稿。以非空草稿、忙状态、不同发送键及快速会话切换核内容保留和实际发送状态。

核半成品不渲染、离屏队列、主题变化、错误入口保留草稿和发送判定；本轮未发消息或渲染。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：f8442a03af0d0f4522a88120f79ee89158619fc6df70f08b765b318529fa41fc。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 9 | 2419 | 1723 | 712 | — |
| .md | source | 3 | 204 | — | — | 1917 |
| .mjs | source | 3 | 277 | 215 | 42 | — |
| .ts | source | 6 | 1331 | 837 | 409 | — |
| .ts | test | 4 | 1097 | 926 | 82 | — |

排除 6 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AKS1st/dsh-mermaid/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
