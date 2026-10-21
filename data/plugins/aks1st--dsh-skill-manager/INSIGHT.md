# dsh-skill-manager

> 在设置界面分层浏览、编辑和导入导出技能目录。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[fb45203](https://github.com/AKS1st/dsh-skill-manager/tree/fb452031031ea50a3287292d22b54e765d1039dc)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dsh-skill-manager) · [![npm 30d 1061](https://img.shields.io/static/v1?label=npm+30d&message=1%2C061&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-skill-manager)
<!-- END META -->

**使用建议**：可先只读浏览；在验证多文件ZIP完整性前不要依赖导入成功作为可运行验收。

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

- **用途**：维护用户或项目技能并识别只读系统/预设来源。

- **建议**：未验证假设：按顶层技能目录归属解包全部合法资源，并以manifest摘要做导出再导入一致性核查，可防“有Skill无脚本”。用含references/scripts、多技能与路径逃逸ZIP比较字节集合及拒绝行为。

可先只读浏览；在验证多文件ZIP完整性前不要依赖导入成功作为可运行验收。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

参照文件编辑器和技能目录管理；增量是宿主分层目录、只读白名单与可视操作。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：技能分层设置页与编辑入口
- **Host 路由**：skillManager文件管理RPC
- **后台**：技能目录枚举与读写白名单

**流程与依赖**

主机skillManager服务经connection.fetch精确RPC路由提供list/files/read/write/import/export/delete/toggle；客户端设置页与编辑器调用。枚举后建立canonical可读/可写目录白名单。

宿主skills、filesystem、workspace/preset与connection服务及客户端slots/locale/uiSession；不是新增模型调用技能。

列出分层目录→选择技能→浏览编辑→SKILL保存前校验frontmatter→导入导出或双步删除→刷新；脚本与引用文件并非因此执行。

**效果与成本**

维护宿主多来源API、目录扫描及解压限制；无内建模型token，人工仍审技能指令和脚本。

有简化技能维护的实现，未证明导入完整或维护工时下降。

- **思考**：ZIP规范化时skillNameByEntry只记录SKILL.md或顶层md，提取循环对其他条目因未映射而continue，因此脚本/引用附件可能未导入，技能列表成功不等于资源包完整。写入也无版本冲突比较，前置格式校验不等于技能语义正确。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：把来源层级与文件可写性绑定，系统/预设只读，realpath校验避免路径逃逸；SKILL前置校验减少错误保存导致技能消失。

把来源层级与文件可写性绑定，系统/预设只读，realpath校验避免路径逃逸；SKILL前置校验减少错误保存导致技能消失。

5000树节点、2000ZIP条目与解压前声明100MiB预算、规范路径和frontmatter gate有明确边界；这些不替代导入语义校验。

源码依据：[src/index.ts](https://github.com/AKS1st/dsh-skill-manager/blob/fb452031031ea50a3287292d22b54e765d1039dc/src/index.ts)、[src/client/index.ts](https://github.com/AKS1st/dsh-skill-manager/blob/fb452031031ea50a3287292d22b54e765d1039dc/src/client/index.ts)。

<a id="detail-section-5"></a>

### 主要限制

ZIP规范化时skillNameByEntry只记录SKILL.md或顶层md，提取循环对其他条目因未映射而continue，因此脚本/引用附件可能未导入，技能列表成功不等于资源包完整。写入也无版本冲突比较，前置格式校验不等于技能语义正确。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AKS1st/dsh-skill-manager](https://github.com/AKS1st/dsh-skill-manager)
- **版本号**：0.3.2（[固定提交 fb452031](https://github.com/AKS1st/dsh-skill-manager/tree/fb452031031ea50a3287292d22b54e765d1039dc)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.ts、src/client/index.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：静态发现需隔离ZIP往返复现；另核符号链接、只读层、并发编辑和删除确认。本轮未导入技能。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

未验证假设：按顶层技能目录归属解包全部合法资源，并以manifest摘要做导出再导入一致性核查，可防“有Skill无脚本”。用含references/scripts、多技能与路径逃逸ZIP比较字节集合及拒绝行为。

静态发现需隔离ZIP往返复现；另核符号链接、只读层、并发编辑和删除确认。本轮未导入技能。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：77e60872010bdb73a561678fdbb6ca58226273ead89114042ba1d2df7535c4bb。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 2708 | 2450 | 392 | — |
| .md | source | 2 | 141 | — | — | 1233 |
| .ts | source | 7 | 2300 | 1570 | 614 | — |
| .tsx | source | 2 | 621 | 529 | 59 | — |
| .ts | test | 5 | 968 | 811 | 78 | — |
| .mjs | source | 1 | 17 | 9 | 7 | — |

排除 9 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AKS1st/dsh-skill-manager/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
