# dsh-fullscreen-input

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[0e21159](https://github.com/AL-Yichen/dsh-fullscreen-input/tree/0e211595f4f07289ba3b713b67d47b90498fa082)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/AL-Yichen/dsh-fullscreen-input) [![npm 30d 748](https://img.shields.io/static/v1?label=npm+30d&message=748&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-fullscreen-input) [![最新发布 2026-10-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-07&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-fullscreen-input)
<!-- END META -->

> **实现功能**：为同一会话草稿提供可拖动的大输入面板与明确发送手势。

> **核心亮点**：避免另存一份草稿的同步分叉，直接沿用宿主队列与提交；针对引用投影损失做带版本的恢复。不是新调度器或发送协议。

> **风险与缺陷**：textarea是富文本的较贫乏投影，恢复依赖insertReference、范围及draftRev；缺能力时静默降级可能保留文本却丢引用语义。submit无返回确认后便关闭面板，动作未抛异常不等于消息已接受。

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

> **用途**：长文本、中文输入法和附件引用混合输入，希望Enter始终换行的用户。

参照宿主composer与普通独立textarea；增量是共用草稿/提交动作，并尝试保留富文本引用。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：共享会话草稿的大输入面板与外观设置

**流程与依赖**

浏览器slots提供面板，useInput和inputActions读写同一草稿，session scope取得insertReference；setDraft扁平化后按draftRev逐步恢复引用，submit调用宿主原动作。主机apply为空。

宿主slots/locale、会话inputActions及per-session conversation能力；本地存储只存面板外观偏好。

打开面板→编辑共享投影→恢复引用→附件调用宿主动作→按钮或Ctrl/CmdEnter提交→关闭；普通Enter/ShiftEnter换行，IME guard先行。

**效果与成本**

无额外模型调用；复杂富文本兼容、快捷键及布局维护成本高于普通textarea，外观状态本地。

有减少误发送和输入空间限制的设计，无真实输入法/引用正确率数据。

> **思考**：textarea是富文本的较贫乏投影，恢复依赖insertReference、范围及draftRev；缺能力时静默降级可能保留文本却丢引用语义。submit无返回确认后便关闭面板，动作未抛异常不等于消息已接受。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：避免另存一份草稿的同步分叉，直接沿用宿主队列与提交；针对引用投影损失做带版本的恢复。不是新调度器或发送协议。

避免另存一份草稿的同步分叉，直接沿用宿主队列与提交；针对引用投影损失做带版本的恢复。不是新调度器或发送协议。

调用宿主submit优于模拟Enter，版本化引用恢复和事件清理有实质细节；源码注释的“只读”不改变insertReference实际写草稿。

源码依据：[lib/index.js](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/lib/index.js)、[src/client.js](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/src/client.js)。

<a id="detail-section-5"></a>

### 1.4 主要限制

textarea是富文本的较贫乏投影，恢复依赖insertReference、范围及draftRev；缺能力时静默降级可能保留文本却丢引用语义。submit无返回确认后便关闭面板，动作未抛异常不等于消息已接受。

<a id="detail-section-6"></a>

### 1.5 使用建议

先核自己的宿主版本、输入法与引用附件保留，再替代主要输入入口。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[AL-Yichen/dsh-fullscreen-input](https://github.com/AL-Yichen/dsh-fullscreen-input)
- **版本号**：1.2.4（[固定提交 0e211595](https://github.com/AL-Yichen/dsh-fullscreen-input/tree/0e211595f4f07289ba3b713b67d47b90498fa082)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.js、src/client.js、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：核共享草稿一致性、引用范围恢复失败提示、IME、忙状态与提交拒绝；本轮未输入或发消息。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：提供宿主原生富草稿编辑事务与引用恢复状态，可减少长文本引用丢失。以多引用编辑、附件上传、会话切换、IME和锁定样例比较引用身份及队列实际结果。

核共享草稿一致性、引用范围恢复失败提示、IME、忙状态与提交拒绝；本轮未输入或发消息。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：16fef7ce66f66900740e038a4e4dd9c0d8e7763a98b5b43e5b2806dcd60af59d。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 715 | — | — | 17435 |
| .mjs | source | 1 | 46 | 19 | 23 | — |
| .js | source | 3 | 6178 | 3886 | 2025 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/AL-Yichen/dsh-fullscreen-input/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
