# dsh-codex-guard

> 在DSH中调用codex-guard CLI，返回提交前卫生检查报告。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[87e138c](https://github.com/Akimiya-z/codex-guard/tree/87e138cdcca2e2929073bb913212dc06769087fc/dsh)

<!-- BEGIN META -->
[![GitHub ★ 136](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=136&color=yellow&logo=github&style=flat)](https://github.com/Akimiya-z/codex-guard)
<!-- END META -->

**使用建议**：先在隔离仓库核对实际扫描目录与CLI版本；报告入口不能替代提交前硬性检查。

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

- **用途**：开发者让Agent检查当前仓库的TODO、秘密及提交主题，报告仍需人工判断。

- **建议**：未验证假设：显式绑定会话仓库和CLI摘要、以结构化findings/exitStatus返回并由独立策略决定提交放行，可减少检查错目标与报告被忽略。用两个cwd仓库、阻断/干净/CLI崩溃样例核目标和状态；若不能稳定区分，不接硬闸门。

先在隔离仓库核对实际扫描目录与CLI版本；报告入口不能替代提交前硬性检查。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

参照直接运行codex-guard CLI/GitHub Action；本组件只提供DSH模型工具入口，扫描规则属于外部CLI而非dsh目录原创。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：codex_guard提交卫生检查CLI适配

**流程与依赖**

dsh/index.js注册codex_guard，spawnSync npx --yes codex-guard，ref以argv传入；Windows寻找npx-cli.js由Node执行，避免cmd解释。

宿主tools、Node/npm/npx、首次可用网络与外部codex-guard包；CLI未固定版本且不随此组件源码验证。

模型调用ref/json→同步执行CLI→返回stdout或stderr；非零可表示发现阻断项，本适配不抛出该状态，也不拦截提交。

**效果与成本**

首次下载和后续CLI变化有网络/供应链维护成本，spawnSync阻塞宿主线程且无显式timeout；模型阅读报告另有token和人工复核，未测单位成本。

省去手工调用步骤，无误报率、漏报率或交付收益证据。

- **思考**：工作目录固定process.cwd而不是工具会话工作区，可能检查另一个仓库；npx未锁版本，固定dsh提交并不能固定检测语义。退出码1被普通字符串返回，是否允许提交仍由外部流程决定。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：本组件的增量是可被模型发现的CLI适配和跨平台argv安全调用。未在此组件实现检测算法，不能将整仓规则、Action流程或CLI迭代计为本组件技术贡献。

本组件的增量是可被模型发现的CLI适配和跨平台argv安全调用。未在此组件实现检测算法，不能将整仓规则、Action流程或CLI迭代计为本组件技术贡献。

ref不经shell、Windows原生Node调用npx脚本是具体接线；同步子进程与退出码文本化是关键复用代价。

源码依据：[dsh/index.js](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/index.js)、[dsh/cordis.patch.yml](https://github.com/Akimiya-z/codex-guard/blob/87e138cdcca2e2929073bb913212dc06769087fc/dsh/cordis.patch.yml)。

<a id="detail-section-5"></a>

### 主要限制

工作目录固定process.cwd而不是工具会话工作区，可能检查另一个仓库；npx未锁版本，固定dsh提交并不能固定检测语义。退出码1被普通字符串返回，是否允许提交仍由外部流程决定。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[Akimiya-z/codex-guard](https://github.com/Akimiya-z/codex-guard)
- **版本号**：适配组件未单独声明；仓库根CLI包为1.9.0（不代表本组件独立版本）（[固定提交 87e138cd](https://github.com/Akimiya-z/codex-guard/tree/87e138cdcca2e2929073bb913212dc06769087fc)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

- 已检查：dsh/index.js、dsh/cordis.patch.yml、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：只在隔离仓库未来验证会话目标、固定CLI、超时和状态语义；本轮未下载/运行CLI。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

未验证假设：显式绑定会话仓库和CLI摘要、以结构化findings/exitStatus返回并由独立策略决定提交放行，可减少检查错目标与报告被忽略。用两个cwd仓库、阻断/干净/CLI崩溃样例核目标和状态；若不能稳定区分，不接硬闸门。

只在隔离仓库未来验证会话目标、固定CLI、超时和状态语义；本轮未下载/运行CLI。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：dsh；内容摘要：6bb00abcd95ec095ea9ad7ad23ea6692191cd55dad05a8b8b9d1959d7006fe0e。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 96 | 75 | 17 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/Akimiya-z/codex-guard/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
