# dsh-a11y-scan

> 调用axe扫描本地HTML、构建页面或显式确认的URL，输出无障碍问题与多格式报告。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[8515929](https://github.com/988hj7tczd-oss/dsh-a11y-scan/tree/8515929d9e914cc0cadd60416676608ea1da03ae)

<!-- BEGIN META -->
[![npm 30d 86](https://img.shields.io/static/v1?label=npm+30d&message=86&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-a11y-scan) [![首次发布 2026-08-24](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-a11y-scan)
<!-- END META -->

**使用建议**：适合已有axe后端的前端团队在本地构建产物先试用。先核对真实引擎运行与页面状态，再处理incomplete和人工清单；不要把报告无违规当完整WCAG认证。

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

- **用途**：前端开发者需要在交付前发现可自动检测的无障碍问题，合格结果是实际页面规则命中与人工复核项可追踪，而不是一份WCAG合规证书。

- **建议**：由自动violations与incomplete并列推导，可为每次报告保存页面URL/DOM摘要、引擎版本与交互状态，将人工复核结果绑定同一版本，形成“已检测/未覆盖/人工确认”矩阵。未验证假设是减少零违规误当合规。对动态登录/弹窗/键盘任务比较报告，若漏覆盖仍不显式则否定。

适合已有axe后端的前端团队在本地构建产物先试用。先核对真实引擎运行与页面状态，再处理incomplete和人工清单；不要把报告无违规当完整WCAG认证。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

直接axe CLI/浏览器扩展可检测同一规则；插件提供Agent结构化调用和报告包装，不宣称超过axe覆盖率。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：a11y_scan进行目标解析、扫描与报告生成。

**流程与依赖**

必要为DSH tools/fs/subprocess，axe CLI与可用Chrome；URL需网络并可能执行页面JS，本地静态页面也受资源和渲染条件影响。

选择目标/等级/输出，解析页面，按真实引擎逐页扫描，汇总violations/incomplete与人工清单；显式reportFile才写报告，修复后重新扫描并人工验收。

**效果与成本**

首次构建宿主依赖与浏览器后端，扫描逐页运行消耗CPU/时间，人工焦点和读屏复核仍必要；无成本或修复合格率实测。

可减少规则结果整理与定位工作，业务可访问性改善仍需用户流程和辅助技术测试。

- **思考**：源码与录制结果测试能否证明真实页面覆盖？实际依赖axe CLI、浏览器与目标渲染，离线fixture/模拟engine只能证明管线，不证明目标站点JS状态或真实宿主。confirmUrl是调用布尔参数，不是独立认证的用户批准记录；扫描无违规也未覆盖焦点与阅读语义等人工项。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对直接axe CLI输出，增量是把目标发现、DSH工具接线、中文错误和修复建议/人工清单组织为Agent可用报告。检测核心属于axe，不能把上游规则库算插件原创。

相对直接axe CLI输出，增量是把目标发现、DSH工具接线、中文错误和修复建议/人工清单组织为Agent可用报告。检测核心属于axe，不能把上游规则库算插件原创。

目标解析/引擎/报告纯逻辑分离，结构化错误与静态服务路径约束可借鉴。维护成本在浏览器环境、SPA状态与WCAG映射，上游检测归属应清楚；URL参数门槛不等于网络沙箱。 源码依据：[src/runner.ts](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/runner.ts)、[src/report.ts](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/report.ts)、[src/index.ts](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/index.ts)、[src/tools/a11y-scan.ts](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/tools/a11y-scan.ts)、[package.json](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/package.json)。

<a id="detail-section-5"></a>

### 主要限制

源码与录制结果测试能否证明真实页面覆盖？实际依赖axe CLI、浏览器与目标渲染，离线fixture/模拟engine只能证明管线，不证明目标站点JS状态或真实宿主。confirmUrl是调用布尔参数，不是独立认证的用户批准记录；扫描无违规也未覆盖焦点与阅读语义等人工项。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[988hj7tczd-oss/dsh-a11y-scan](https://github.com/988hj7tczd-oss/dsh-a11y-scan)
- **版本号**：0.1.0（[固定提交 8515929d](https://github.com/988hj7tczd-oss/dsh-a11y-scan/tree/8515929d9e914cc0cadd60416676608ea1da03ae)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 src/runner.ts、src/report.ts、src/index.ts、src/tools/a11y-scan.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：在固定浏览器与axe版本对比直接CLI和插件的真实结果，覆盖动态页面、空页、缺依赖、未确认URL与报告转义；人工检查焦点和读屏流程。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由自动violations与incomplete并列推导，可为每次报告保存页面URL/DOM摘要、引擎版本与交互状态，将人工复核结果绑定同一版本，形成“已检测/未覆盖/人工确认”矩阵。未验证假设是减少零违规误当合规。对动态登录/弹窗/键盘任务比较报告，若漏覆盖仍不显式则否定。

在固定浏览器与axe版本对比直接CLI和插件的真实结果，覆盖动态页面、空页、缺依赖、未确认URL与报告转义；人工检查焦点和读屏流程。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：09a48d311993b149eb5eae954e78346ff99c7c61a8533f9e5338c4c2952e146a。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 237 | — | — | 2851 |
| .ts | source | 4 | 1910 | 1538 | 251 | — |
| .ts | test | 2 | 467 | 369 | 48 | — |

排除 1 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-a11y-scan/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
