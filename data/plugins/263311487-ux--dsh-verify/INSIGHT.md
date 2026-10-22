# dsh-verify

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[d969899](https://github.com/263311487-ux/dsh-verify/tree/d969899808e51dcccd261588f667b18633020fca)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/263311487-ux/dsh-verify) [![npm 30d 2,385](https://img.shields.io/static/v1?label=npm+30d&message=2%2C385&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-verify) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-verify)
<!-- END META -->

> **实现功能**：通过 JSON 清单执行浏览器断言，提供 CLI、MCP 与 HTML 检查报告。

> **核心亮点**：相对直接写 Playwright 脚本，贡献是可审阅 JSON 规范与报告的轻量组合，并通过计算样式断言覆盖只检查 CSS class 的盲点。浏览器和像素比较是既有机制，不归为本项目原创；清单仍由人或模型决定。

> **风险与缺陷**：浏览器执行能否证明交付完整且独立？runOne 只判断给定 steps，空清单拒绝通过，但缺漏需求不会自动成为失败；expect_screenshot 缺少基线时创建并通过，不能视为已比较过视觉基线。良好人工规范可以收窄这些边界，但执行本身不建立清单独立性。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：给 Agent 生成的网页做可重复验收，交付物是具体浏览器断言结果及截图，而不是模型口头完成声明。

参照手写 Playwright 与 Agent 自述完成：前者更通用但需编程，后者没有实际浏览器断言；本项目改进声明式交付便利，不替代测试设计。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：MCP提供verify_spec、verify_url、generate_and_verify和health，CLI规范执行另见正文

**流程与依赖**

必要为 Node20+、Playwright 浏览器与可访问网页；视觉比较需可信基线，外网目标、认证和测试数据由使用者准备。可选 LLM 仅参与生成清单。

编辑 spec→启动静态服务器或定位目标 URL→执行浏览器动作→逐项捕获错误→生成 HTML/JSON→人工解释失败；运行异常与断言失败必须查看结构化内容区分。

**效果与成本**

首次需安装 Node20+、浏览器并编写规范；持续维护选择器和基线，浏览器资源及失败排查耗时另计；只有可选清单生成需要 LLM 费用。

确定性断言有助于把交付争议定位到具体样式或文本，但节省复核时间及真实缺陷检出率尚无本轮实验。

> **思考**：浏览器执行能否证明交付完整且独立？runOne 只判断给定 steps，空清单拒绝通过，但缺漏需求不会自动成为失败；expect_screenshot 缺少基线时创建并通过，不能视为已比较过视觉基线。良好人工规范可以收窄这些边界，但执行本身不建立清单独立性。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对直接写 Playwright 脚本，贡献是可审阅 JSON 规范与报告的轻量组合，并通过计算样式断言覆盖只检查 CSS class 的盲点。浏览器和像素比较是既有机制，不归为本项目原创；清单仍由人或模型决定。

相对直接写 Playwright 脚本，贡献是可审阅 JSON 规范与报告的轻量组合，并通过计算样式断言覆盖只检查 CSS class 的盲点。浏览器和像素比较是既有机制，不归为本项目原创；清单仍由人或模型决定。

[固定源码依据](https://github.com/263311487-ux/dsh-verify/blob/d969899808e51dcccd261588f667b18633020fca/bin/verify.mjs#L225)。

逐步异常记录保留 action 与 detail，浏览器和静态服务器在 finally 关闭；截图差异有阈值及差异图。首次创建基线通过的语义需要独立展示，HTML 的独立验收措辞强于实际作者独立性。

<a id="detail-section-5"></a>

### 1.4 主要限制

浏览器执行能否证明交付完整且独立？runOne 只判断给定 steps，空清单拒绝通过，但缺漏需求不会自动成为失败；expect_screenshot 缺少基线时创建并通过，不能视为已比较过视觉基线。良好人工规范可以收窄这些边界，但执行本身不建立清单独立性。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合已有明确浏览器验收条件的网页团队先试用；分别审查规范、首次基线和运行错误，保留结构化结果，不用 PASS 代表完整需求或独立审计。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持下述已实现机制；效果为机制推断，未来假设未验证。

- 已检查：作者 README、包清单、源码路径 bin/verify.mjs、mcp/server.mjs、dsh/plugin.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交的核心入口与说明抽读；未执行目标代码、测试、插件安装或真实宿主验收，未核实独立采用与同条件收益。
- 下一步：同一网页设置未写断言的坏按钮、缺基线截图及已批准基线三组，比较现有与需求映射报告是否识别验收缺口；若仍将缺覆盖视作完整通过则否定假设。

**分析版本**

- **仓库**：[263311487-ux/dsh-verify](https://github.com/263311487-ux/dsh-verify)
- **版本号**：0.9.6（[固定提交 d9698998](https://github.com/263311487-ux/dsh-verify/tree/d969899808e51dcccd261588f667b18633020fca)）
- **版本日期**：2026-10-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：将需求 ID、清单作者和基线审批状态纳入报告，使未覆盖需求及首次基线与已比较通过分开验收；从已有逐步结果推导，新增负担是维护需求映射。

同一网页设置未写断言的坏按钮、缺基线截图及已批准基线三组，比较现有与需求映射报告是否识别验收缺口；若仍将缺覆盖视作完整通过则否定假设。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 20 | 1032 | — | — | 8834 |
| .mjs | source | 12 | 1432 | 1275 | 88 | — |
| .js | source | 2 | 46 | 28 | 8 | — |
| .mjs | test | 8 | 518 | 458 | 8 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/263311487-ux/dsh-verify/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
