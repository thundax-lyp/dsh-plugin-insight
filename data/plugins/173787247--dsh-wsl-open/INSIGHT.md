# dsh-wsl-open

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[550509f](https://github.com/173787247/dsh-wsl-open/tree/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-open)
<!-- END META -->

> **实现功能**：把聊天中的Linux文件路径转为可从Windows打开的文件入口。

> **核心亮点**：把跨系统文件交接融入聊天阅读路径；增量是路径呈现和桌面打开集成，不提供文件内容编辑或正确性验证。

> **风险与缺陷**：客户端正则识别会跳过含空格等路径，服务端会拒绝不存在或范围外文件，因此识别失败主要影响可用性；openOnWindows把Explorer任意数字退出码当成功，是对Explorer复用窗口的宽松兼容，返回ok仍不能证明目标文件确实打开。

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

> **用途**：WSL工具生成文件后，用户希望直接用Windows默认应用查看。

手动wslpath与Explorer；插件减少路径复制。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：为聊天中的Linux路径提供Windows打开桥接。

**流程与依赖**

依赖WSL、Windows互操作和默认应用；UNC访问受发行版及应用支持限制。

生成文件后核对聊天中的路径入口，点击打开并确认文件身份；失败时手工复制路径。

**效果与成本**

路径识别和跨进程打开成本较小，但误识别后的人工查找未测。

把跨系统文件交接融入聊天阅读路径；增量是路径呈现和桌面打开集成，不提供文件内容编辑或正确性验证。 客户端正则识别会跳过含空格等路径，服务端会拒绝不存在或范围外文件，因此识别失败主要影响可用性；openOnWindows把Explorer任意数字退出码当成功，是对Explorer复用窗口的宽松兼容，返回ok仍不能证明目标文件确实打开。

> **思考**：客户端正则识别会跳过含空格等路径，服务端会拒绝不存在或范围外文件，因此识别失败主要影响可用性；openOnWindows把Explorer任意数字退出码当成功，是对Explorer复用窗口的宽松兼容，返回ok仍不能证明目标文件确实打开。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把跨系统文件交接融入聊天阅读路径；增量是路径呈现和桌面打开集成，不提供文件内容编辑或正确性验证。

把跨系统文件交接融入聊天阅读路径；增量是路径呈现和桌面打开集成，不提供文件内容编辑或正确性验证。

CSS Highlight避免改写React DOM，点击和服务端路径检查分层可借鉴；服务端已做存在性、词法范围及realpath复查，界面识别与打开结果仍需真实宿主验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

客户端正则识别会跳过含空格等路径，服务端会拒绝不存在或范围外文件，因此识别失败主要影响可用性；openOnWindows把Explorer任意数字退出码当成功，是对Explorer复用窗口的宽松兼容，返回ok仍不能证明目标文件确实打开。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用一个非敏感文件测试中文和空格路径，确认目标文件而非只看应用启动。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献：把跨系统文件交接融入聊天阅读路径；增量是路径呈现和桌面打开集成，不提供文件内容编辑或正确性验证。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

- 已检查：作者 README、包清单、源码路径 index.js、client.js、package.json、cordis.patch.yml、lib/scan-path.js、lib/windows-path.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：已核查入口完整打开链、package客户端声明、client高亮与点击接线及扫描/映射函数；未打开文件或验证Web宿主实际加载与桌面表现。 固定checkout的注册候选与关键主张定向抽读；未逐行完整审阅全部源码、测试、依赖及外部参照，未运行目标代码。评分仅针对文中明确的CLI/API/人工流程参照；跨场景迁移为解释性判断。
- 下一步：测试中文、空格、括号、标点、范围外及不存在路径，分别核对高亮、服务端拒绝和实际目标；模拟Explorer失败但返回数字退出码，确认调用方不能将ok当作打开验收。

**分析版本**

- **仓库**：[173787247/dsh-wsl-open](https://github.com/173787247/dsh-wsl-open)
- **版本号**：0.2.0（[固定提交 550509f](https://github.com/173787247/dsh-wsl-open/tree/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：将识别文本与已确认存在的产物分开显示，可减少自然语言中的伪路径被误点；需比较额外文件探测成本。

测试中文、空格、括号、标点、范围外及不存在路径，分别核对高亮、服务端拒绝和实际目标；模拟Explorer失败但返回数字退出码，确认调用方不能将ok当作打开验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 211 | — | — | 1372 |
| .js | source | 4 | 540 | 473 | 16 | — |
| .js | test | 1 | 88 | 77 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-open/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
