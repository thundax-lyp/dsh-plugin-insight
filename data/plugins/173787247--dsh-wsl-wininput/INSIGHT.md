# dsh-wsl-wininput

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[eaa10e6](https://github.com/173787247/dsh-wsl-wininput/tree/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-wininput)
<!-- END META -->

> **实现功能**：从 WSL 按名称调用 Windows 控件，或向指定窗口发送文本、按键与点击。

> **核心亮点**：相对重用上次树的元素index，按名称重查并拒绝0/多匹配能消除位置漂移的一类误操作。该具体增量有源码支持；不是稳定对象句柄协议，也不意味着输入隔离。

> **风险与缺陷**：作者简介声称不抢焦点，实际type/key明确SetForegroundWindow+SendWait，click移动系统光标，且不校验前台切换是否成功；这直接限制“后台定向输入”。invoke遍历受限时也只能证明已访问范围唯一。

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

> **用途**：需要操作Windows表单/按钮的WSL Agent，以目标应用实际状态变化为交付；不接受单纯API成功作为任务完成。

本次比较参照为上述人工命令、平台接口或本地脚本；没有独立同任务运行对照，不声称整体收益或首创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：win_invoke

**流程与依赖**

Node≥18、DSH、WSL/PowerShell/UIAutomation/Windows.Forms 必要；目标需可访问性及合适权限；自绘UI只能走坐标/键盘且更依赖焦点。

先观察并明确窗口→按名称invoke或显式输入→重读应用结果；歧义时拒绝并重新观察，不自动猜测控件；失败后的重复提交须人工判断。

**效果与成本**

无外部服务费；主要是观察、焦点协调与失败复核，重复输入可能产生业务副作用，未测合格任务用时。

语义重新定位比index复用更可解释；全局输入路径无法支持作者“无焦点干扰”的广义描述。

> **思考**：作者简介声称不抢焦点，实际type/key明确SetForegroundWindow+SendWait，click移动系统光标，且不校验前台切换是否成功；这直接限制“后台定向输入”。invoke遍历受限时也只能证明已访问范围唯一。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对重用上次树的元素index，按名称重查并拒绝0/多匹配能消除位置漂移的一类误操作。该具体增量有源码支持；不是稳定对象句柄协议，也不意味着输入隔离。

相对重用上次树的元素index，按名称重查并拒绝0/多匹配能消除位置漂移的一类误操作。该具体增量有源码支持；不是稳定对象句柄协议，也不意味着输入隔离。

buildInvokeScript的唯一匹配拒绝与escapeSendKeys值得复用；序列化isConcurrencySafe=false只约束本工具调用，不锁用户桌面或其他插件，需更大范围状态协调。 源码：[index.js](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/index.js)、[lib/wininput.js](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/lib/wininput.js)、[lib/wininput-exec.js](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/lib/wininput-exec.js)、[test/wininput.test.js](https://github.com/173787247/dsh-wsl-wininput/blob/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41/test/wininput.test.js)。

<a id="detail-section-5"></a>

### 1.4 主要限制

作者简介声称不抢焦点，实际type/key明确SetForegroundWindow+SendWait，click移动系统光标，且不校验前台切换是否成功；这直接限制“后台定向输入”。invoke遍历受限时也只能证明已访问范围唯一。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合有人看护的Windows自动化；优先具备唯一名称的invoke，打字/点击会干扰焦点和鼠标，执行前暂停其他桌面操作并检查结果。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持所述适配机制；贡献评价属于有固定源码依据的解释。尚未安装或运行，效果与宿主兼容未验证；新设计推演均未实现。

- 已检查：作者 README、包清单、源码路径 index.js、lib/wininput.js、lib/wininput-exec.js、test/wininput.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交 eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41，检查作者说明、入口、所列核心实现与测试内容；未执行测试或插件、未核实外部套件和独立用户效果。
- 下一步：两个测试窗口间刻意切换焦点，分别执行invoke/type/key/click；记录实际接收窗口和前后状态；若SetForegroundWindow失败仍返回成功，禁止无人值守输入。

**分析版本**

- **仓库**：[173787247/dsh-wsl-wininput](https://github.com/173787247/dsh-wsl-wininput)
- **版本号**：0.1.0（[固定提交 eaa10e6](https://github.com/173787247/dsh-wsl-wininput/tree/eaa10e6b313f2a6e65f7ce5e2523c7f4bc050b41)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：动作返回“唯一语义调用”与“全局输入”两类状态，后者要求检查前台句柄和动作后条件，可降低与用户同时操作时的误投；需重新观察，不能保证无干扰。

两个测试窗口间刻意切换焦点，分别执行invoke/type/key/click；记录实际接收窗口和前后状态；若SetForegroundWindow失败仍返回成功，禁止无人值守输入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 129 | — | — | 623 |
| .js | source | 4 | 427 | 361 | 30 | — |
| .js | test | 1 | 50 | 46 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-wininput/issues) 查看。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
